# 技能文档库

一个面向 Agent 工作流的技能集合，覆盖文档处理、视觉设计、前端开发、应用工程、技术写作、测试与自动化等场景。

当前仓库共包含 **24 个 Skill**。每个 Skill 都位于 `skills/` 下的独立目录中，并通过 `SKILL.md` 描述触发场景、执行流程、约束规则和最佳实践。

## 安装单个 Skill

无需克隆整个仓库，可以直接下载某个 Skill：

```bash
# 将 skill-name 替换为目标目录名，例如 frontend-design
mkdir -p ~/.claude/skills/skill-name
curl -o ~/.claude/skills/skill-name/SKILL.md \
  https://raw.githubusercontent.com/docs-5102-org/skills-docs/main/skills/skill-name/SKILL.md
```

示例：

```bash
mkdir -p ~/.claude/skills/frontend-design
curl -o ~/.claude/skills/frontend-design/SKILL.md \
  https://raw.githubusercontent.com/docs-5102-org/skills-docs/main/skills/frontend-design/SKILL.md
```

安装完成后重启 Claude Code 会话即可识别。若 Skill 包含 `scripts/`、`templates/` 或 `references/` 等配套目录，请按需同步下载。

## Skill 总览

| # | 技能名称 | 英文标识 | 分类 | 核心用途 | 主要输出 |
|---|---|---|---|---|---|
| 1 | 算法艺术 | [`algorithmic-art`](skills/algorithmic-art/SKILL.md) | 创意设计 | 使用 p5.js、随机种子、参数控制创建生成艺术、流场和粒子系统 | `.md`、`.html`、`.js` |
| 2 | Ant Design | [`antd`](skills/antd/SKILL.md) | 开发技术 | 使用 antd 构建企业级 React UI、后台页面、组件和主题 | React 组件 |
| 3 | Ant Design HTML 构建器 | [`antd-html-builder`](skills/antd-html-builder/SKILL.md) | 开发技术 | 将需求、截图或草图转为基于 Ant Design 的可运行单文件 HTML 页面 | `.html` |
| 4 | 品牌指南 | [`brand-guidelines`](skills/brand-guidelines/SKILL.md) | 创意设计 | 应用 Anthropic 品牌色、字体和视觉格式 | 品牌化制品 |
| 5 | 画布设计 | [`canvas-design`](skills/canvas-design/SKILL.md) | 创意设计 | 创建静态视觉艺术、海报、设计导向 PNG/PDF 作品 | `.png`、`.pdf`、`.md` |
| 6 | UTF-8 编码 | [`cli-encoding`](skills/cli-encoding/SKILL.md) | 工具框架 | 处理文件编码安全，尤其是 Windows/PowerShell 读写源码文件 | 编码规范 |
| 7 | 文档协作 | [`doc-coauthoring`](skills/doc-coauthoring/SKILL.md) | 内容写作 | 协作编写技术规范、PRD、设计文档、决策文档和提案 | 结构化文档 |
| 8 | Word 文档 | [`docx`](skills/docx/SKILL.md) | 文档处理 | 创建、读取、编辑 Word 文档，处理格式、评论、修订和图像 | `.docx` |
| 9 | 前端设计 | [`frontend-design`](skills/frontend-design/SKILL.md) | 创意设计 | 构建高质量网站、仪表板、组件和 UI 系统 | HTML/CSS/React |
| 10 | 内部通讯 | [`internal-comms`](skills/internal-comms/SKILL.md) | 内容写作 | 撰写状态报告、3P 更新、新闻通讯、FAQ 和事故报告 | 商务文档 |
| 11 | Java 面试官 | [`java-interviewer`](skills/java-interviewer/SKILL.md) | 教育培训 | 模拟 Java 高级工程师/架构师技术面试并给出反馈 | 面试问题与评价 |
| 12 | MCP 构建器 | [`mcp-builder`](skills/mcp-builder/SKILL.md) | 开发技术 | 创建 MCP 服务器，让 LLM 与外部服务集成 | MCP Server |
| 13 | PDF 处理 | [`pdf`](skills/pdf/SKILL.md) | 文档处理 | PDF 文本/表格提取、合并拆分、表单、水印、加密和 OCR | `.pdf` |
| 14 | PowerShell | [`powershell`](skills/powershell/SKILL.md) | 开发技术 | 编写、审查、修复 PowerShell 脚本和 Windows 自动化任务 | `.ps1` |
| 15 | PowerPoint | [`pptx`](skills/pptx/SKILL.md) | 文档处理 | 创建、读取、编辑演示文稿、幻灯片模板和演讲备注 | `.pptx` |
| 16 | FastAPI | [`python-fastapi`](skills/python-fastapi/SKILL.md) | 开发技术 | 开发 API 路由、SQLModel 模型、CRUD、测试和 HTML 模板 | Python 服务 |
| 17 | 报价单 DOCX | [`quotation-docx`](skills/quotation-docx/SKILL.md) | 文档处理 | 生成中文项目报价单，包含模块明细、费用汇总、付款方式和里程碑 | `.docx` |
| 18 | 技能创建器 | [`skill-creator`](skills/skill-creator/SKILL.md) | 工具框架 | 创建、评估、改进和优化 Skill | Skill 定义 |
| 19 | Slack GIF 创建 | [`slack-gif-creator`](skills/slack-gif-creator/SKILL.md) | 创意设计 | 创建符合 Slack 尺寸、时长和体积约束的 GIF | `.gif` |
| 20 | 开源工具评测写作 | [`tech-review-writer`](skills/tech-review-writer/SKILL.md) | 内容写作 | 撰写开源 AI 工具深度评测、项目分析和公众号文章 | 文章 |
| 21 | 主题工厂 | [`theme-factory`](skills/theme-factory/SKILL.md) | 创意设计 | 为文档、演示、页面等应用预设专业主题 | 主题化制品 |
| 22 | Web 制品构建器 | [`web-artifacts-builder`](skills/web-artifacts-builder/SKILL.md) | 开发技术 | 使用 React、TypeScript、Vite、Tailwind 构建复杂 HTML 制品 | 单文件 `.html` |
| 23 | Web 应用测试 | [`webapp-testing`](skills/webapp-testing/SKILL.md) | 开发技术 | 使用 Playwright 验证本地 Web 应用、截图和浏览器日志 | 测试报告 |
| 24 | Excel 电子表格 | [`xlsx`](skills/xlsx/SKILL.md) | 文档处理 | 创建、编辑、清洗电子表格，处理公式、财务模型和格式 | `.xlsx`、`.csv`、`.tsv` |

## 按用途快速查找

| 我需要 | 推荐 Skill |
|---|---|
| 创建或编辑 Office 文档 | `docx`、`pdf`、`pptx`、`xlsx`、`quotation-docx` |
| 设计视觉或交互制品 | `algorithmic-art`、`canvas-design`、`frontend-design`、`brand-guidelines`、`theme-factory`、`slack-gif-creator` |
| 开发应用、API 或集成 | `python-fastapi`、`antd`、`antd-html-builder`、`web-artifacts-builder`、`mcp-builder`、`powershell` |
| 测试 Web 应用 | `webapp-testing` |
| 撰写专业内容 | `internal-comms`、`doc-coauthoring`、`tech-review-writer` |
| 创建或维护 Skill | `skill-creator`、`cli-encoding` |
| 练习技术面试 | `java-interviewer` |

## 目录结构

| 目录 | Skill |
|---|---|
| `skills/algorithmic-art/` | 算法艺术 |
| `skills/antd/` | Ant Design |
| `skills/antd-html-builder/` | Ant Design HTML 构建器 |
| `skills/brand-guidelines/` | 品牌指南 |
| `skills/canvas-design/` | 画布设计 |
| `skills/cli-encoding/` | UTF-8 编码 |
| `skills/doc-coauthoring/` | 文档协作 |
| `skills/docx/` | Word 文档 |
| `skills/frontend-design/` | 前端设计 |
| `skills/internal-comms/` | 内部通讯 |
| `skills/java-interviewer/` | Java 面试官 |
| `skills/mcp-builder/` | MCP 构建器 |
| `skills/pdf/` | PDF 处理 |
| `skills/powershell/` | PowerShell |
| `skills/pptx/` | PowerPoint |
| `skills/python-fastapi/` | FastAPI |
| `skills/quotation-docx/` | 报价单 DOCX |
| `skills/skill-creator/` | 技能创建器 |
| `skills/slack-gif-creator/` | Slack GIF 创建 |
| `skills/tech-review-writer/` | 开源工具评测写作 |
| `skills/theme-factory/` | 主题工厂 |
| `skills/web-artifacts-builder/` | Web 制品构建器 |
| `skills/webapp-testing/` | Web 应用测试 |
| `skills/xlsx/` | Excel 电子表格 |

## 文件说明

| 文件或目录 | 说明 |
|---|---|
| `SKILL.md` | Skill 主说明文件，包含触发规则、执行流程和约束 |
| `LICENSE.txt` | Skill 的许可证或使用条款 |
| `scripts/` | 辅助脚本、验证脚本和自动化工具 |
| `templates/` | 可复用模板 |
| `references/` 或 `reference.md` | 补充参考资料、深入说明和示例 |

## 贡献指南2

| 步骤 | 要求 |
|---|---|
| 1 | 在 `skills/` 下创建稳定的 kebab-case 目录名 |
| 2 | 编写完整的 `SKILL.md`，包含 frontmatter、描述、触发条件和执行规则 |
| 3 | 如有许可证要求，添加 `LICENSE.txt` |
| 4 | 将脚本、模板、参考资料分别放入清晰的子目录 |
| 5 | 同步更新 `README.md` 和 `README.zh.md` 中的 Skill 表格 |

## 相关资源

| 资源 | 链接 |
|---|---|
| 英文版本 | [README.md](README.md) |
| 使用示例 | [use.md](use.md) |
| 主仓库 | [docs-5102-org/skills-docs](https://github.com/docs-5102-org/skills-docs) |
