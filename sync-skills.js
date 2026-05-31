#!/usr/bin/env node

/**
 * Skills 同步脚本
 * 将 skills 仓库中的 SKILL.md 自动转换为各平台规则文件
 *
 * 支持平台：
 *   - Cursor     → .cursor/rules/*.mdc
 *   - Windsurf   → .windsurfrules
 *   - Claude Code → CLAUDE.md
 *
 * 用法：
 *   node sync-skills.js [命令] [选项]
 *
 * 命令：
 *   sync    同步所有 skills（默认）
 *   list    列出所有可用 skills
 *   clean   清除所有生成的规则文件
 *
 * 选项：
 *   --skills-dir <路径>   skills 仓库路径（默认：./skills）
 *   --output-dir <路径>   输出目录（默认：当前目录）
 *   --platform <平台>     只生成指定平台（cursor|windsurf|claudecode|all）
 *   --skills <名称>       只同步指定 skills，逗号分隔（如：pdf,docx,pptx）
 *   --dry-run             只预览，不写入文件
 *   --verbose             显示详细日志
 *
 * 示例：
 *   node sync-skills.js sync
 *   node sync-skills.js sync --skills pdf,docx --platform cursor
 *   node sync-skills.js list
 *   node sync-skills.js clean
 */

const fs = require('fs')
const path = require('path')

// ─────────────────────────────────────────────
// 解析命令行参数
// ─────────────────────────────────────────────
const args = process.argv.slice(2)

function getArg(name, defaultVal) {
  const idx = args.indexOf(name)
  if (idx !== -1 && args[idx + 1]) return args[idx + 1]
  return defaultVal
}

function hasFlag(name) {
  return args.includes(name)
}

const COMMAND     = ['sync','list','clean'].includes(args[0]) ? args[0] : 'sync'
const SKILLS_DIR  = path.resolve(getArg('--skills-dir', './skills'))
const OUTPUT_DIR  = path.resolve(getArg('--output-dir', '.'))
const PLATFORM    = getArg('--platform', 'all')
const ONLY_SKILLS = getArg('--skills', '') ? getArg('--skills', '').split(',').map(s => s.trim()) : []
const DRY_RUN     = hasFlag('--dry-run')
const VERBOSE     = hasFlag('--verbose')

// ─────────────────────────────────────────────
// 工具函数
// ─────────────────────────────────────────────
const log   = (...msg) => console.log(...msg)
const debug = (...msg) => { if (VERBOSE) console.log('[debug]', ...msg) }
const warn  = (...msg) => console.warn('⚠️ ', ...msg)

function writeFile(filePath, content) {
  if (DRY_RUN) {
    log(`  [dry-run] 将写入: ${filePath} (${content.length} 字节)`)
    return
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content, 'utf-8')
}

function ensureDir(dirPath) {
  if (!DRY_RUN) fs.mkdirSync(dirPath, { recursive: true })
}

// ─────────────────────────────────────────────
// 解析 SKILL.md frontmatter
// ─────────────────────────────────────────────
function parseSkillMd(content) {
  const normalized = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  const allLines = normalized.split('\n')

  if (allLines[0] !== '---') {
    return { meta: {}, body: content }
  }

  const closeIndex = allLines.findIndex((line, index) => index > 0 && line === '---')
  if (closeIndex === -1) {
    return { meta: {}, body: content }
  }

  const frontmatter = allLines.slice(1, closeIndex).join('\n')
  const body = allLines.slice(closeIndex + 1).join('\n').trim()
  const meta = {}
  const lines = frontmatter.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!match) continue

    const key = match[1].trim()
    const rawValue = match[2].trim()

    if (rawValue === '>' || rawValue === '|') {
      const block = []
      while (i + 1 < lines.length && (/^\s+/.test(lines[i + 1]) || lines[i + 1].trim() === '')) {
        i++
        block.push(lines[i].trim())
      }
      meta[key] = rawValue === '>'
        ? block.filter(Boolean).join(' ')
        : block.join('\n').trim()
      continue
    }

    meta[key] = rawValue
  }

  return { meta, body }
}

// ─────────────────────────────────────────────
// 扫描 skills 目录
// ─────────────────────────────────────────────
function scanSkills() {
  if (!fs.existsSync(SKILLS_DIR)) {
    log(`❌ skills 目录不存在: ${SKILLS_DIR}`)
    log(`   请用 --skills-dir 指定正确路径`)
    process.exit(1)
  }

  const skills = []
  const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const skillDir  = path.join(SKILLS_DIR, entry.name)
    const skillFile = path.join(skillDir, 'SKILL.md')

    if (!fs.existsSync(skillFile)) {
      debug(`跳过（无 SKILL.md）: ${entry.name}`)
      continue
    }

    const content = fs.readFileSync(skillFile, 'utf-8')
    const { meta, body } = parseSkillMd(content)

    // 收集同目录下的其他 .md 文件（如 FORMS.md、REFERENCE.md 等）
    const extraMds = fs.readdirSync(skillDir)
      .filter(f => f.endsWith('.md') && f !== 'SKILL.md')
      .map(f => ({
        name: f,
        path: path.join(skillDir, f),
        content: fs.readFileSync(path.join(skillDir, f), 'utf-8')
      }))

    // 检测是否有 scripts 目录
    const scriptsDir = path.join(skillDir, 'scripts')
    const hasScripts = fs.existsSync(scriptsDir)

    skills.push({
      name:        meta.name || entry.name,
      dirName:     entry.name,
      description: meta.description || '',
      skillFile,
      body,
      meta,
      extraMds,
      hasScripts,
      scriptsDir: hasScripts ? scriptsDir : null,
    })
  }

  // 过滤：只同步指定的 skills
  if (ONLY_SKILLS.length > 0) {
    return skills.filter(s =>
      ONLY_SKILLS.includes(s.name) || ONLY_SKILLS.includes(s.dirName)
    )
  }

  return skills
}

// ─────────────────────────────────────────────
// 生成 Cursor .mdc 文件
// ─────────────────────────────────────────────
function generateCursorRules(skills) {
  const rulesDir = path.join(OUTPUT_DIR, '.cursor', 'rules')
  ensureDir(rulesDir)

  const generated = []

  for (const skill of skills) {
    // 构建 globs —— 根据 skill 名称智能推断
    const globs = inferGlobs(skill.name)

    // 拼接额外 md 文件内容
    let extraContent = ''
    for (const extra of skill.extraMds) {
      extraContent += `\n\n---\n## 📎 ${extra.name}\n\n${extra.content}`
    }

    // scripts 提示：路径带上 skills/<dirName>/scripts/ 前缀
    const skillScriptsPrefix = `skills/${skill.dirName}/scripts`
    let scriptsNote = ''
    if (skill.hasScripts) {
      const scripts = fs.readdirSync(skill.scriptsDir)
      scriptsNote = `\n\n## 📁 可用脚本（${skillScriptsPrefix}/）\n\n`
      scriptsNote += scripts.map(s => `- \`${skillScriptsPrefix}/${s}\``).join('\n')
    }

    // 将 body 和 extraMds 中的 `scripts/` 路径替换为完整路径
    const fixScriptPaths = (text) =>
      text.replace(/(?<![`\/\w])scripts\//g, `${skillScriptsPrefix}/`)

    const fixedBody        = skill.hasScripts ? fixScriptPaths(skill.body) : skill.body
    let   fixedExtraContent = ''
    for (const extra of skill.extraMds) {
      const fixedContent = skill.hasScripts ? fixScriptPaths(extra.content) : extra.content
      fixedExtraContent += `\n\n---\n## 📎 ${extra.name}\n\n${fixedContent}`
    }

    const mdcContent = [
      `---`,
      `description: ${skill.description}`,
      globs.length > 0 ? `globs: [${globs.map(g => `"${g}"`).join(', ')}]` : '',
      `alwaysApply: false`,
      `---`,
      ``,
      fixedBody,
      fixedExtraContent,
      scriptsNote,
    ].filter(line => line !== null).join('\n')

    const outPath = path.join(rulesDir, `${skill.dirName}.mdc`)
    writeFile(outPath, mdcContent)
    generated.push(outPath)
    log(`  ✅ Cursor  → .cursor/rules/${skill.dirName}.mdc`)
  }

  // 生成一个全局入口 global.mdc 列出所有 skills
  const globalContent = [
    `---`,
    `description: Skills 全局索引，列出所有可用规则`,
    `alwaysApply: true`,
    `---`,
    ``,
    `# 可用 Skills 索引`,
    ``,
    `以下 skills 已配置，遇到对应任务时请自动加载对应规则：`,
    ``,
    ...skills.map(s => `- **${s.name}**: ${s.description.slice(0, 80)}${s.description.length > 80 ? '...' : ''}`),
    ``,
    `> 通过 @rulename 手动引用，或根据 globs 自动触发。`,
  ].join('\n')

  const globalPath = path.join(rulesDir, 'global.mdc')
  writeFile(globalPath, globalContent)
  log(`  ✅ Cursor  → .cursor/rules/global.mdc（全局索引）`)

  return generated
}

// ─────────────────────────────────────────────
// 生成 Windsurf .windsurfrules
// ─────────────────────────────────────────────
function generateWindsurfRules(skills) {
  const sections = [
    `# Skills Rules for Windsurf`,
    `# 自动生成于 ${new Date().toISOString()}`,
    `# 共 ${skills.length} 个 skills`,
    ``,
  ]

  for (const skill of skills) {
    const wsp = `skills/${skill.dirName}/scripts`
    const fixWs = (t) => skill.hasScripts
      ? t.replace(/(?<![`\/\w])scripts\//g, wsp + '/')
      : t
    sections.push(`${'='.repeat(60)}`)
    sections.push(`## Skill: ${skill.name}`)
    sections.push(`## 触发场景: ${skill.description.slice(0, 100)}`)
    sections.push(`${'='.repeat(60)}`)
    sections.push(``)
    sections.push(fixWs(skill.body))
    for (const extra of skill.extraMds) {
      sections.push(``)
      sections.push(`### 📎 ${extra.name}`)
      sections.push(``)
      sections.push(fixWs(extra.content))
    }
    if (skill.hasScripts) {
      const wscripts = fs.readdirSync(skill.scriptsDir)
      sections.push(``)
      sections.push(`### 📁 可用脚本（${wsp}/）`)
      sections.push(``)
      wscripts.forEach(s => sections.push(`- \`${wsp}/${s}\``))
    }
    sections.push(``)
  }

  const outPath = path.join(OUTPUT_DIR, '.windsurfrules')
  writeFile(outPath, sections.join('\n'))
  log(`  ✅ Windsurf → .windsurfrules`)
}

// ─────────────────────────────────────────────
// 生成 Claude Code CLAUDE.md / AGENTS.md
// ─────────────────────────────────────────────
function buildAgentRules(skills, fileName) {
  const lines = [
    `# ${fileName} — Skills 规则`,
    ``,
    `> 自动生成于 ${new Date().toISOString()}`,
    `> 共 ${skills.length} 个 skills`,
    ``,
    `## 使用说明`,
    ``,
    `以下是项目中配置的所有 Skills 规范。`,
    `遇到对应任务时，请严格按照对应 Skill 的要求执行。`,
    ``,
    `---`,
    ``,
  ]

  for (const skill of skills) {
    lines.push(`## 🔧 Skill: ${skill.name}`)
    lines.push(``)
    lines.push(`> **触发场景**: ${skill.description}`)
    lines.push(``)
    const ccp2 = `skills/${skill.dirName}/scripts`
    const fixCc = (t) => skill.hasScripts
      ? t.replace(/(?<![`\/\w])scripts\//g, ccp2 + '/')
      : t
    lines.push(fixCc(skill.body))

    // 附加额外 md 文件（如 FORMS.md、REFERENCE.md）
    for (const extra of skill.extraMds) {
      lines.push(``)
      lines.push(`### 📎 ${skill.name} / ${extra.name}`)
      lines.push(``)
      lines.push(fixCc(extra.content))
    }

    // scripts 说明
    if (skill.hasScripts) {
      const ccp = `skills/${skill.dirName}/scripts`
      const ccscripts = fs.readdirSync(skill.scriptsDir)
      lines.push(``)
      lines.push(`### 📁 可用脚本（${ccp}/）`)
      lines.push(``)
      ccscripts.forEach(s => lines.push(`- \`${ccp}/${s}\``))
    }

    lines.push(``)
    lines.push(`---`)
    lines.push(``)
  }

  return lines.join('\n')
}

function generateClaudeCode(skills) {
  const outPath = path.join(OUTPUT_DIR, 'CLAUDE.md')
  writeFile(outPath, buildAgentRules(skills, 'CLAUDE.md'))
  log(`  ✅ Claude Code → CLAUDE.md`)

  const agentsPath = path.join(OUTPUT_DIR, 'AGENTS.md')
  writeFile(agentsPath, buildAgentRules(skills, 'AGENTS.md'))
  log(`  ✅ Codex      → AGENTS.md`)
}

// ─────────────────────────────────────────────
// 根据 skill 名称推断 Cursor globs
// ─────────────────────────────────────────────
function inferGlobs(skillName) {
  const map = {
    'pdf':              ['**/*.pdf'],
    'docx':             ['**/*.docx', '**/*.doc'],
    'pptx':             ['**/*.pptx', '**/*.ppt'],
    'xlsx':             ['**/*.xlsx', '**/*.xlsm', '**/*.csv'],
    'frontend-design':  ['**/*.html', '**/*.css', '**/*.jsx', '**/*.tsx', '**/*.vue'],
    'web-artifacts-builder': ['**/*.html', '**/*.jsx', '**/*.tsx'],
    'mcp-builder':      ['**/mcp*/**', '**/server*/**'],
    'webapp-testing':   ['**/*.test.*', '**/tests/**', '**/e2e/**'],
    'algorithmic-art':  ['**/*.js', '**/*.html'],
    'canvas-design':    ['**/*.png', '**/*.pdf'],
    'slack-gif-creator':['**/*.gif'],
    'internal-comms':   ['**/docs/**', '**/reports/**'],
  }
  return map[skillName] || []
}

// ─────────────────────────────────────────────
// 命令：list
// ─────────────────────────────────────────────
function cmdList() {
  const skills = scanSkills()
  log(`\n📚 Skills 列表 (${SKILLS_DIR})\n`)
  log(`共发现 ${skills.length} 个 skills:\n`)

  for (const s of skills) {
    const extras = s.extraMds.map(e => e.name).join(', ')
    log(`  📦 ${s.name.padEnd(24)} ${s.hasScripts ? '🔧 scripts' : '          '} ${extras ? `📄 ${extras}` : ''}`)
    log(`     ${s.description.slice(0, 80)}${s.description.length > 80 ? '...' : ''}`)
    log(``)
  }
}

// ─────────────────────────────────────────────
// 命令：clean
// ─────────────────────────────────────────────
function cmdClean() {
  const targets = [
    path.join(OUTPUT_DIR, '.cursor', 'rules'),
    path.join(OUTPUT_DIR, '.windsurfrules'),
    path.join(OUTPUT_DIR, 'CLAUDE.md'),
    path.join(OUTPUT_DIR, 'AGENTS.md'),
  ]

  log(`\n🧹 清理生成的规则文件...\n`)
  for (const t of targets) {
    if (fs.existsSync(t)) {
      if (!DRY_RUN) {
        if (fs.statSync(t).isDirectory()) {
          fs.rmSync(t, { recursive: true })
        } else {
          fs.unlinkSync(t)
        }
      }
      log(`  🗑️  已删除: ${t}`)
    }
  }
  log(`\n✅ 清理完成`)
}

// ─────────────────────────────────────────────
// 命令：sync（主流程）
// ─────────────────────────────────────────────
function cmdSync() {
  log(`\n🚀 Skills 同步开始`)
  log(`   skills 目录: ${SKILLS_DIR}`)
  log(`   输出目录:    ${OUTPUT_DIR}`)
  log(`   平台:        ${PLATFORM}`)
  if (ONLY_SKILLS.length) log(`   只同步:      ${ONLY_SKILLS.join(', ')}`)
  if (DRY_RUN) log(`   模式:        dry-run（不写入文件）`)
  log(``)

  const skills = scanSkills()

  if (skills.length === 0) {
    warn(`未找到任何 skills，请检查 --skills-dir 路径`)
    process.exit(1)
  }

  log(`📦 发现 ${skills.length} 个 skills: ${skills.map(s => s.name).join(', ')}\n`)

  // 按平台生成
  if (PLATFORM === 'all' || PLATFORM === 'cursor') {
    log(`📁 生成 Cursor 规则...`)
    generateCursorRules(skills)
  }

  if (PLATFORM === 'all' || PLATFORM === 'windsurf') {
    log(`\n📁 生成 Windsurf 规则...`)
    generateWindsurfRules(skills)
  }

  if (PLATFORM === 'all' || PLATFORM === 'claudecode') {
    log(`\n📁 生成 Claude Code 规则...`)
    generateClaudeCode(skills)
  }

  log(`\n✅ 同步完成！`)
  log(``)
  log(`下一步：`)
  if (PLATFORM === 'all' || PLATFORM === 'cursor') {
    log(`  Cursor     → 在对话中使用 @skill名称 引用，或匹配文件类型自动触发`)
  }
  if (PLATFORM === 'all' || PLATFORM === 'windsurf') {
    log(`  Windsurf   → .windsurfrules 已自动生效`)
  }
  if (PLATFORM === 'all' || PLATFORM === 'claudecode') {
    log(`  Claude Code → CLAUDE.md 已自动生效`)
  }
}

// ─────────────────────────────────────────────
// 入口
// ─────────────────────────────────────────────
switch (COMMAND) {
  case 'list':  cmdList();  break
  case 'clean': cmdClean(); break
  default:      cmdSync();  break
}
