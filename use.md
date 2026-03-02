# AI 编辑器引入 Skills 文档的使用方式

## 一、Cursor 引入 Skills

### 方式1：`@Docs` 添加远程文档（你之前的记忆）

```
@Docs → Add new doc → 输入你的 GitHub 仓库文档 URL
```

比如：
```
https://github.com/docs-5102-org/skills-docs/blob/main/skills/docx/SKILL.md
```

**但有个问题**：`@Docs` 是给 AI 补充知识用的，它会索引文档内容，但**不会自动触发规则执行**，更适合"查阅参考"而非"强制约束行为"。

---

### 方式2：`.cursor/rules/` — 最推荐 ✅

这才是真正让 Cursor 按照 Skills 工作的方式。

**结构：**
```
your-project/
└── .cursor/
    └── rules/
        ├── docx.mdc        ← 从 skills 仓库复制过来
        ├── pptx.mdc
        ├── frontend-design.mdc
        └── global.mdc      ← 全局规则
```

**每个 `.mdc` 文件有三种触发模式：**

```markdown
---
description: 创建 Word 文档时使用此规则
globs: ["**/*.docx", "**/doc*/**"]
alwaysApply: false          ← 按需触发
---

# DOCX Skill
（粘贴 SKILL.md 的内容）
```

| 模式 | 配置 | 效果 |
|------|------|------|
| `alwaysApply: true` | 无需 globs | 每次对话都生效 |
| `alwaysApply: false` + globs | 匹配文件时自动触发 | 按文件类型触发 |
| `alwaysApply: false` 无 globs | 需手动 `@rulename` | 手动按需引用 |

**手动引用方式：**
```
@docx 帮我创建一个报告文档
@frontend-design 帮我设计一个登录页
```

---

### 方式3：`@file` 直接引用文件

如果 skills 仓库在本地，可以直接：
```
@skills/docx/SKILL.md  帮我创建一个合同文档
```

---

## 二、Windsurf 引入 Skills

Windsurf 使用 `.windsurfrules` 或 `AGENTS.md` 文件。

### 方式1：项目级 `.windsurfrules`

```
your-project/
└── .windsurfrules     ← 单文件，项目全局生效
```

内容可以直接把多个 SKILL.md 合并进去：

```markdown
# Project Rules

## When creating Word documents:
（粘贴 docx SKILL.md 内容）

## When creating presentations:
（粘贴 pptx SKILL.md 内容）

## Frontend design standards:
（粘贴 frontend-design SKILL.md 内容）
```

### 方式2：`@file` 实时引用

```
@SKILL.md 按照这个规范帮我创建文档
```

---

## 三、Claude Code 引入 Skills

Claude Code 使用 `CLAUDE.md` 文件，这是它**最核心的规则入口**。

### 方式1：`CLAUDE.md` — 最推荐 ✅

```
your-project/
├── CLAUDE.md              ← 项目级，自动加载
└── skills/
    ├── docx/SKILL.md
    └── pptx/SKILL.md
```

**`CLAUDE.md` 写法（引用 Skills）：**

```markdown
# Project Rules

## Skills 规范

当用户需要创建 Word 文档时，请严格遵循以下规范：
@skills/docx/SKILL.md

当用户需要创建 PPT 时：
@skills/pptx/SKILL.md

当用户需要前端设计时：
@skills/frontend-design/SKILL.md
```

> Claude Code 支持在 `CLAUDE.md` 中用 `@文件路径` 引用其他文件内容！

### 方式2：全局 `CLAUDE.md`

```bash
~/.claude/CLAUDE.md    ← 对所有项目生效
```

把 Skills 规范放这里，所有项目都自动继承。

### 方式3：对话中直接引用

```bash
# 在 Claude Code 对话中
请阅读 @skills/docx/SKILL.md 然后帮我创建文档
```

---

## 四、三者对比总结

| | Cursor | Windsurf | Claude Code |
|---|---|---|---|
| 规则文件 | `.cursor/rules/*.mdc` | `.windsurfrules` | `CLAUDE.md` |
| 自动触发 | ✅ globs 匹配 | ✅ 全局生效 | ✅ 自动加载 |
| 手动引用 | `@rulename` / `@file` | `@file` | `@文件路径` |
| 远程文档 | `@Docs` 索引 | ❌ 不支持 | ❌ 不支持 |
| 多文件拆分 | ✅ 每个 skill 一个 `.mdc` | ⚠️ 单文件为主 | ✅ 支持 `@引用` |
| 全局规则 | `~/.cursor/rules/` | 不支持 | `~/.claude/CLAUDE.md` |

---

## 五、同步脚本

**同步脚本**：把 `SKILL.md` 内容自动转换为各平台格式，一次维护，多端同步。这样你只需更新 `skills/*/SKILL.md`，脚本自动生成各平台对应的规则文件。

- [sync-skills.js](./sync-skills.js)