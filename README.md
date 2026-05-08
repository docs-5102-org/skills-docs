# Skills Documentation

A comprehensive collection of specialized skills for creating, manipulating, and testing various document formats, designing interfaces, and building advanced applications.

## Overview

This repository contains documentation and resources for 16 different skills organized by purpose. Each skill includes detailed guides, code examples, and best practices for specific tasks.

---

## 安装单个 Skill

无需克隆整个仓库，用以下命令单独下载某个 skill：

```bash
# 将 skill-name 替换为你想要的 skill 目录名，例如 frontend-design
mkdir -p ~/.claude/skills/skill-name
curl -o ~/.claude/skills/skill-name/SKILL.md \
  https://raw.githubusercontent.com/docs-5102-org/skills-docs/main/skills/skill-name/SKILL.md
```

例如，安装 `frontend-design`：

```bash
mkdir -p ~/.claude/skills/frontend-design
curl -o ~/.claude/skills/frontend-design/SKILL.md \
  https://raw.githubusercontent.com/docs-5102-org/skills-docs/main/skills/frontend-design/SKILL.md
```

下载完成后重启 Claude Code 会话即可自动识别。如果该 skill 包含 `scripts/` 或 `references/` 子目录，需要对其中的文件逐一单独下载。

---

## 🎨 Creative & Design Skills

### [Algorithmic Art](skills/algorithmic-art/SKILL.md)
Create generative art using computational aesthetics and p5.js with seeded randomness and interactive parameter exploration. Perfect for algorithmic art, flow fields, particle systems, and interactive visualizations.

**Output**: `.md` (philosophy) + `.html` + `.js` (p5.js implementations)

### [Canvas Design](skills/canvas-design/SKILL.md)
Create beautiful visual designs and artwork in `.png` and `.pdf` formats. Develop design philosophies and aesthetic movements, then express them visually through original artwork.

**Output**: `.md` (philosophy) + `.pdf`/`.png` (designs)

### [Frontend Design](skills/frontend-design/SKILL.md)
Build distinctive, production-grade frontend interfaces and web components with exceptional design quality. Create websites, landing pages, dashboards, and React components that avoid generic AI aesthetics.

**Output**: HTML/CSS/React components

### [Brand Guidelines](skills/brand-guidelines/SKILL.md)
Apply Anthropic's official brand identity to any artifact. Includes brand colors, typography, visual formatting standards, and corporate design resources.

**Output**: Styled components using brand specifications

### [Theme Factory](skills/theme-factory/SKILL.md)
Access 10 pre-set professional themes with curated color palettes and font pairings. Apply consistent, professional styling to presentations, slides, documents, and landing pages.

**Output**: Themed artifacts with cohesive visual identity

---

## 📄 Document Processing Skills

### [DOCX Documents](skills/docx/SKILL.md)
Create, read, edit, and manipulate Word documents (`.docx`). Handle formatting, tables of contents, tracked changes, comments, images, and convert legacy `.doc` files.

**Capabilities**: 
- Reading/analyzing content
- Creating new documents
- Editing existing documents
- Find-and-replace operations
- Working with templates and formatting

### [PDF Processing](skills/pdf/SKILL.md)
Comprehensive PDF handling: read/extract text and tables, merge/split PDFs, fill forms, add watermarks, encrypt/decrypt, extract images, and perform OCR on scanned PDFs.

**Capabilities**:
- Text and table extraction
- Merging and splitting
- Form filling
- Watermarking and encryption
- Image extraction
- OCR capabilities

### [PowerPoint (PPTX)](skills/pptx/SKILL.md)
Create, read, edit, and manage PowerPoint presentations. Handle slide decks, templates, layouts, speaker notes, and comments. Extract content or create presentations from scratch.

**Capabilities**:
- Creating presentations
- Reading/extracting content
- Editing and modifying
- Working with templates
- Managing speaker notes and comments

### [Excel (XLSX)](skills/xlsx/SKILL.md)
Open, create, read, edit, and fix spreadsheets. Handle `.xlsx`, `.xlsm`, `.csv`, and `.tsv` files. Create financial models, clean messy data, add formulas, and apply professional formatting.

**Capabilities**:
- Creating and editing spreadsheets
- Data cleaning and restructuring
- Financial modeling
- Formulas and calculations
- Professional formatting

---

## 🛠️ Development & Technical Skills

### [Web Artifacts Builder](skills/web-artifacts-builder/SKILL.md)
Build elaborate, multi-component HTML artifacts using modern frontend technologies: React 18, TypeScript, Vite, Tailwind CSS, and shadcn/ui components.

**Stack**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui

**Output**: Single bundled HTML file

### [MCP Server Builder](skills/mcp-builder/SKILL.md)
Create high-quality Model Context Protocol (MCP) servers that enable LLMs to interact with external services. Build in Python (FastMCP) or Node/TypeScript (MCP SDK).

**Process**:
1. Design tool specifications
2. Implement tools
3. Test and evaluate
4. Document and deploy

### [Skill Creator](skills/skill-creator/SKILL.md)
Create new skills from scratch, modify and improve existing skills, and measure skill performance. Run evaluations, benchmark performance with variance analysis, and optimize skill descriptions for better triggering.

**Process**:
- Draft skill specification
- Create test prompts
- Run evaluations
- Analyze results quantitatively
- Iterate and refine
- Expand test sets

### [Web Application Testing](skills/webapp-testing/SKILL.md)
Test local web applications using Playwright. Verify frontend functionality, debug UI behavior, capture screenshots, and view browser logs with Python scripts.

**Tools**: Playwright + Python scripts

---

## 🎬 Content & Animation Skills

### [Slack GIF Creator](skills/slack-gif-creator/SKILL.md)
Create optimized animated GIFs for Slack. Provides constraints, validation tools, and animation concepts.

**Specifications**:
- **Emoji GIFs**: 128×128, under 3 seconds
- **Message GIFs**: 480×480
- **FPS**: 10-30 (lower = smaller file)
- **Colors**: 48-128 (fewer = smaller file)

---

## 📋 Communication Skills

### [Internal Communications](skills/internal-comms/SKILL.md)
Write professional internal communications including status reports, 3P updates (Progress, Plans, Problems), company newsletters, FAQs, and incident reports. Uses company-standard formats and templates.

**Document Types**:
- Status reports
- Leadership updates
- 3P updates
- Newsletters
- FAQ responses
- Incident reports

### [Doc Coauthoring](skills/doc-coauthoring/SKILL.md)
Collaborative document creation and management tools for team-based documentation projects.

---

## 📊 Quick Reference

| Skill | Primary Output | Best For |
|-------|---|---|
| Algorithmic Art | `.js`, `.html`, `.md` | Generative art, visualizations |
| Canvas Design | `.pdf`, `.png`, `.md` | Static visual designs |
| Frontend Design | HTML/React/CSS | Web interfaces, components |
| Brand Guidelines | Styled artifacts | Brand consistency |
| Theme Factory | Themed artifacts | Professional styling |
| DOCX | `.docx` | Word documents |
| PDF | `.pdf` | PDF manipulation |
| PPTX | `.pptx` | Presentations |
| XLSX | `.xlsx` | Spreadsheets |
| Web Artifacts | `.html` | Complex web artifacts |
| MCP Builder | MCP Server | LLM integrations |
| Skill Creator | Skills | Creating/improving skills |
| Web Testing | Test reports | Frontend testing |
| Slack GIF | `.gif` | Slack animations |
| Internal Comms | Documents | Business communication |

---

## Getting Started

1. **Choose a skill** based on your task
2. **Read the SKILL.md file** in the skill's directory for detailed instructions
3. **Follow the provided templates and examples**
4. **Check referenced guides** for advanced topics (e.g., `reference.md`, `editing.md`)
5. **Use provided scripts** in the `scripts/` directories

---

## Directory Structure

```
skills/
├── algorithmic-art/         # Generative art with p5.js
├── brand-guidelines/        # Anthropic brand styling
├── canvas-design/           # Visual design philosophy
├── doc-coauthoring/         # Collaborative documentation
├── docx/                    # Word document handling
├── frontend-design/         # Web UI design
├── internal-comms/          # Business communications
├── mcp-builder/             # MCP server development
├── pdf/                     # PDF processing
├── pptx/                    # PowerPoint presentations
├── skill-creator/           # Create and improve skills
├── slack-gif-creator/       # Slack GIF creation
├── theme-factory/           # Theme and styling
├── web-artifacts-builder/   # Complex web artifacts
├── webapp-testing/          # Web application testing
└── xlsx/                    # Excel spreadsheet handling
```

---

## Notes

- Each skill directory contains a `SKILL.md` file with comprehensive documentation
- Most skills include `scripts/` directories with helper tools and utilities
- License information is in each skill's `LICENSE.txt` file
- Some skills include `reference.md` files with advanced topics and examples

---

## Contributing

When adding new skills or updating documentation:
1. Follow the existing directory structure
2. Include a complete `SKILL.md` with description and usage guidelines
3. Add a `LICENSE.txt` file
4. Include scripts and examples in appropriate subdirectories
5. Update this README with the new skill information
