# Skills Documentation

A curated collection of agent skills for documents, design, frontend development, application engineering, writing, and workflow automation.

This repository currently contains **23 skills**. Each skill lives in its own directory under `skills/` and includes a `SKILL.md` file with trigger rules, workflow guidance, and implementation details.

## Install A Single Skill

You do not need to clone the whole repository. Download one skill directly:

```bash
# Replace skill-name with the directory name, for example frontend-design
mkdir -p ~/.claude/skills/skill-name
curl -o ~/.claude/skills/skill-name/SKILL.md \
  https://raw.githubusercontent.com/docs-5102-org/skills-docs/main/skills/skill-name/SKILL.md
```

Example:

```bash
mkdir -p ~/.claude/skills/frontend-design
curl -o ~/.claude/skills/frontend-design/SKILL.md \
  https://raw.githubusercontent.com/docs-5102-org/skills-docs/main/skills/frontend-design/SKILL.md
```

Restart your Claude Code session after installation. If a skill includes `scripts/`, `templates/`, or `references/`, download those supporting files as needed.

## Skill Catalog

| # | Skill | Directory | Category | Best For | Primary Output |
|---|---|---|---|---|---|
| 1 | Algorithmic Art | [`algorithmic-art`](skills/algorithmic-art/SKILL.md) | Creative & Design | Generative art, flow fields, particle systems, p5.js experiments | `.md`, `.html`, `.js` |
| 2 | Ant Design | [`antd`](skills/antd/SKILL.md) | Development | React enterprise UI, admin pages, antd components and theming | React components |
| 3 | Brand Guidelines | [`brand-guidelines`](skills/brand-guidelines/SKILL.md) | Creative & Design | Anthropic-style colors, typography, and visual formatting | Styled artifacts |
| 4 | Canvas Design | [`canvas-design`](skills/canvas-design/SKILL.md) | Creative & Design | Static visual art, posters, design-forward PNG/PDF work | `.png`, `.pdf`, `.md` |
| 5 | UTF-8 Encoding | [`cli-encoding`](skills/cli-encoding/SKILL.md) | Tooling | Safe file reads/writes, especially on PowerShell and Windows | Encoding rules |
| 6 | Doc Coauthoring | [`doc-coauthoring`](skills/doc-coauthoring/SKILL.md) | Writing | Collaborative specs, PRDs, proposals, decision docs | Structured documents |
| 7 | DOCX Documents | [`docx`](skills/docx/SKILL.md) | Documents | Word document creation, editing, formatting, comments, tracked changes | `.docx` |
| 8 | Frontend Design | [`frontend-design`](skills/frontend-design/SKILL.md) | Creative & Design | Distinctive websites, dashboards, components, UI systems | HTML/CSS/React |
| 9 | Internal Communications | [`internal-comms`](skills/internal-comms/SKILL.md) | Writing | Status reports, 3P updates, newsletters, FAQs, incident reports | Business documents |
| 10 | Java Interviewer | [`java-interviewer`](skills/java-interviewer/SKILL.md) | Education | Java senior engineer or architect interview practice | Interview questions and feedback |
| 11 | MCP Server Builder | [`mcp-builder`](skills/mcp-builder/SKILL.md) | Development | Model Context Protocol servers and LLM tool integrations | MCP servers |
| 12 | PDF Processing | [`pdf`](skills/pdf/SKILL.md) | Documents | PDF extraction, merge/split, forms, watermarking, encryption, OCR | `.pdf` |
| 13 | PowerShell | [`powershell`](skills/powershell/SKILL.md) | Development | PowerShell scripts, Windows automation, cmdlet review and fixes | `.ps1` |
| 14 | PowerPoint | [`pptx`](skills/pptx/SKILL.md) | Documents | Presentations, slide decks, templates, speaker notes | `.pptx` |
| 15 | FastAPI | [`python-fastapi`](skills/python-fastapi/SKILL.md) | Development | API routes, SQLModel models, CRUD, tests, HTML templates | Python services |
| 16 | Quotation DOCX | [`quotation-docx`](skills/quotation-docx/SKILL.md) | Documents | Chinese project quotations with modules, totals, payment terms, milestones | `.docx` |
| 17 | Skill Creator | [`skill-creator`](skills/skill-creator/SKILL.md) | Tooling | Creating, evaluating, and improving skills | Skill definitions |
| 18 | Slack GIF Creator | [`slack-gif-creator`](skills/slack-gif-creator/SKILL.md) | Creative & Design | Slack emoji and message GIFs with size and timing constraints | `.gif` |
| 19 | Tech Review Writer | [`tech-review-writer`](skills/tech-review-writer/SKILL.md) | Writing | Long-form Chinese reviews of open-source AI tools and projects | Articles |
| 20 | Theme Factory | [`theme-factory`](skills/theme-factory/SKILL.md) | Creative & Design | Applying curated professional themes to artifacts | Themed artifacts |
| 21 | Web Artifacts Builder | [`web-artifacts-builder`](skills/web-artifacts-builder/SKILL.md) | Development | Multi-component HTML artifacts with React, TypeScript, Vite, Tailwind | Bundled `.html` |
| 22 | Web Application Testing | [`webapp-testing`](skills/webapp-testing/SKILL.md) | Development | Playwright testing, screenshots, browser logs, local app verification | Test reports |
| 23 | Excel Spreadsheets | [`xlsx`](skills/xlsx/SKILL.md) | Documents | Spreadsheets, data cleaning, formulas, financial models, formatting | `.xlsx`, `.csv`, `.tsv` |

## Quick Lookup

| Need | Use These Skills |
|---|---|
| Create or edit office documents | `docx`, `pdf`, `pptx`, `xlsx`, `quotation-docx` |
| Design visual or interactive artifacts | `algorithmic-art`, `canvas-design`, `frontend-design`, `brand-guidelines`, `theme-factory`, `slack-gif-creator` |
| Build apps, APIs, or integrations | `python-fastapi`, `antd`, `web-artifacts-builder`, `mcp-builder`, `powershell` |
| Test web applications | `webapp-testing` |
| Write professional content | `internal-comms`, `doc-coauthoring`, `tech-review-writer` |
| Create or maintain skills | `skill-creator`, `cli-encoding` |
| Practice technical interviews | `java-interviewer` |

## Directory Summary

| Directory | Skill |
|---|---|
| `skills/algorithmic-art/` | Algorithmic Art |
| `skills/antd/` | Ant Design |
| `skills/brand-guidelines/` | Brand Guidelines |
| `skills/canvas-design/` | Canvas Design |
| `skills/cli-encoding/` | UTF-8 Encoding |
| `skills/doc-coauthoring/` | Doc Coauthoring |
| `skills/docx/` | DOCX Documents |
| `skills/frontend-design/` | Frontend Design |
| `skills/internal-comms/` | Internal Communications |
| `skills/java-interviewer/` | Java Interviewer |
| `skills/mcp-builder/` | MCP Server Builder |
| `skills/pdf/` | PDF Processing |
| `skills/powershell/` | PowerShell |
| `skills/pptx/` | PowerPoint |
| `skills/python-fastapi/` | FastAPI |
| `skills/quotation-docx/` | Quotation DOCX |
| `skills/skill-creator/` | Skill Creator |
| `skills/slack-gif-creator/` | Slack GIF Creator |
| `skills/tech-review-writer/` | Tech Review Writer |
| `skills/theme-factory/` | Theme Factory |
| `skills/web-artifacts-builder/` | Web Artifacts Builder |
| `skills/webapp-testing/` | Web Application Testing |
| `skills/xlsx/` | Excel Spreadsheets |

## Repository Notes

| File Or Directory | Purpose |
|---|---|
| `SKILL.md` | Main skill instructions, trigger rules, and workflow guidance |
| `LICENSE.txt` | License terms for a skill, when provided |
| `scripts/` | Helper scripts and validation utilities |
| `templates/` | Reusable templates for generated artifacts |
| `references/` or `reference.md` | Supporting reference material and deeper examples |

## Contributing

| Step | Requirement |
|---|---|
| 1 | Create a new directory under `skills/` using a stable kebab-case name |
| 2 | Add a complete `SKILL.md` with frontmatter, description, trigger guidance, and workflow rules |
| 3 | Include `LICENSE.txt` when the skill has specific license terms |
| 4 | Place supporting scripts, templates, or references in clear subdirectories |
| 5 | Update the skill tables in both `README.md` and `README.zh.md` |

## Related

| Resource | Link |
|---|---|
| Chinese README | [README.zh.md](README.zh.md) |
| Usage examples | [use.md](use.md) |
| Repository | [docs-5102-org/skills-docs](https://github.com/docs-5102-org/skills-docs) |
