# AI 编辑器引入 Skills 的使用方式

本仓库的核心思路是：每个 Skill 都维护在 `skills/<skill-name>/SKILL.md` 中，再按不同 AI 编辑器/Agent 的规则入口同步成对应格式。

推荐做法：

| 场景 | 推荐方式 |
|---|---|
| 只想临时参考某个 Skill | 在对话里 `@file` 引用对应 `SKILL.md` |
| 希望项目自动生效 | 使用平台规则文件：Cursor 用 `.cursor/rules/`，Windsurf 用 `.windsurfrules`，Claude Code 用 `CLAUDE.md`，Codex 用 `AGENTS.md` |
| 多平台同时维护 | 使用 [sync-skills.js](./sync-skills.js) 自动同步 |

---

## 一、Cursor 引入 Skills

### 方式 1：`.cursor/rules/`（推荐）

Cursor 最适合把每个 Skill 拆成一个 `.mdc` 规则文件。

```text
your-project/
└── .cursor/
    └── rules/
        ├── global.mdc
        ├── docx.mdc
        ├── pptx.mdc
        └── frontend-design.mdc
```

`.mdc` 文件示例：

```markdown
---
description: 创建 Word 文档时使用此规则
globs: ["**/*.docx", "**/doc*/**"]
alwaysApply: false
---

# DOCX Skill

（粘贴 SKILL.md 的内容）
```

| 触发模式 | 配置方式 | 效果 |
|---|---|---|
| 全局生效 | `alwaysApply: true` | 每次对话都加载 |
| 文件匹配 | `alwaysApply: false` + `globs` | 匹配文件类型时自动触发 |
| 手动触发 | `alwaysApply: false`，不写 `globs` | 对话中使用 `@rulename` |

手动引用示例：

```text
@docx 帮我创建一个报告文档
@frontend-design 帮我设计一个登录页
```

### 方式 2：`@Docs` 添加远程文档

```text
@Docs → Add new doc → 输入 GitHub 文档 URL
```

示例：

```text
https://github.com/docs-5102-org/skills-docs/blob/main/skills/docx/SKILL.md
```

注意：`@Docs` 更适合让 Cursor 检索参考资料，不等同于强制规则触发。需要约束 Agent 行为时，仍优先使用 `.cursor/rules/`。

### 方式 3：`@file` 直接引用本地文件

```text
@skills/docx/SKILL.md 按照这个规范帮我创建合同文档
```

---

## 二、Windsurf 引入 Skills

Windsurf 常用 `.windsurfrules` 作为项目级规则入口。

### 方式 1：项目级 `.windsurfrules`

```text
your-project/
└── .windsurfrules
```

可以把多个 Skill 合并到一个规则文件中：

```markdown
# Project Rules

## When creating Word documents

（粘贴 docx/SKILL.md 内容）

## When creating presentations

（粘贴 pptx/SKILL.md 内容）

## Frontend design standards

（粘贴 frontend-design/SKILL.md 内容）
```

### 方式 2：对话中 `@file` 引用

```text
@skills/docx/SKILL.md 按照这个规范帮我创建文档
```

---

## 三、Claude Code 引入 Skills

Claude Code 使用 `CLAUDE.md` 作为规则入口。

### 方式 1：项目级 `CLAUDE.md`（推荐）

```text
your-project/
├── CLAUDE.md
└── skills/
    ├── docx/SKILL.md
    └── pptx/SKILL.md
```

`CLAUDE.md` 示例：

```markdown
# Project Rules

## Skills 规范

当用户需要创建 Word 文档时，请严格遵循：
@skills/docx/SKILL.md

当用户需要创建 PPT 时，请严格遵循：
@skills/pptx/SKILL.md

当用户需要前端设计时，请严格遵循：
@skills/frontend-design/SKILL.md
```

Claude Code 支持在 `CLAUDE.md` 中使用 `@文件路径` 引用其他文件内容。

### 方式 2：全局 `CLAUDE.md`

```bash
~/.claude/CLAUDE.md
```

适合放入跨项目通用的 Skill 规则。

### 方式 3：对话中直接引用

```text
请阅读 @skills/docx/SKILL.md，然后帮我创建文档
```

---

## 四、Codex 引入 Skills

Codex 使用 `AGENTS.md` 作为项目级 Agent 指令入口。本仓库的同步脚本已经支持自动生成 `AGENTS.md`，适合把多个 Skill 汇总成 Codex 可自动读取的项目规则。

### 方式 1：项目级 `AGENTS.md`（推荐）

```text
your-project/
├── AGENTS.md
└── skills/
    ├── docx/SKILL.md
    ├── frontend-design/SKILL.md
    └── python-fastapi/SKILL.md
```

`AGENTS.md` 示例：

```markdown
# AGENTS.md — Skills 规则

## 使用说明

以下是项目中配置的所有 Skills 规范。
遇到对应任务时，请严格按照对应 Skill 的要求执行。

## Skill: docx

（粘贴 docx/SKILL.md 内容）

---

## Skill: frontend-design

（粘贴 frontend-design/SKILL.md 内容）
```

### 方式 2：保持 Skill 文件独立，在 `AGENTS.md` 中说明触发方式

如果不想把所有 Skill 内容合并进 `AGENTS.md`，也可以只写索引和约束：

```markdown
# Project Skills

- 处理 Word 文档时，读取并遵循 `skills/docx/SKILL.md`
- 做前端设计时，读取并遵循 `skills/frontend-design/SKILL.md`
- 开发 FastAPI 功能时，读取并遵循 `skills/python-fastapi/SKILL.md`
```

这种方式更轻量，但稳定性取决于 Agent 是否主动读取对应文件。对高频或强约束 Skill，推荐使用完整合并版 `AGENTS.md`。

### 方式 3：对话中直接指定 Skill

```text
请按 skills/quotation-docx/SKILL.md 的规范，帮我生成项目报价单。
```

---

## 五、平台对比

| 能力 | Cursor | Windsurf | Claude Code | Codex |
|---|---|---|---|---|
| 项目规则入口 | `.cursor/rules/*.mdc` | `.windsurfrules` | `CLAUDE.md` | `AGENTS.md` |
| 自动加载 | 支持 | 支持 | 支持 | 支持 |
| 按文件类型触发 | 支持 `globs` | 不突出 | 不突出 | 不突出 |
| 手动引用 | `@rulename` / `@file` | `@file` | `@文件路径` | 直接说明文件路径或任务规则 |
| 远程文档索引 | `@Docs` | 不突出 | 不突出 | 不突出 |
| 多 Skill 管理 | 每个 Skill 一个 `.mdc` | 单文件合并 | `CLAUDE.md` 合并或引用 | `AGENTS.md` 合并或索引 |
| 全局规则 | `~/.cursor/rules/` | 以项目级为主 | `~/.claude/CLAUDE.md` | 以项目级为主 |

---

## 六、使用同步脚本

[sync-skills.js](./sync-skills.js) 会扫描 `skills/*/SKILL.md`，并生成多个平台的规则文件。

```bash
node sync-skills.js sync
```

默认会生成：

| 平台 | 生成文件 |
|---|---|
| Cursor | `.cursor/rules/*.mdc`、`.cursor/rules/global.mdc` |
| Windsurf | `.windsurfrules` |
| Claude Code | `CLAUDE.md` |
| Codex | `AGENTS.md` |

常用命令：

```bash
# 查看已识别的 skills
node sync-skills.js list

# 只同步某几个 skills
node sync-skills.js sync --skills docx,pptx,frontend-design

# 只生成 Cursor 规则
node sync-skills.js sync --platform cursor

# 预览将写入哪些文件
node sync-skills.js sync --dry-run
```

维护建议：优先更新 `skills/<skill-name>/SKILL.md`，再运行同步脚本生成各平台规则文件，避免多处手工修改导致内容不一致。
