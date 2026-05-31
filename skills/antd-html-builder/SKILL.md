---
name: antd-html-builder
description: >
  将用户描述、截图或需求转化为基于 Ant Design 的完整可运行单文件 HTML 页面。
  当用户提到"Ant Design"、"antd"、"用antd做"、"生成页面"、"截图转代码"、"UI组件"、
  "管理后台"、"表单页面"、"数据表格"、"仪表盘"等关键词时必须使用此技能。
  支持 HTML原生/React/Vue/Angular 四种框架输出，默认输出 HTML+React（antd CDN引入方式）。
  无需构建工具，生成代码可直接在浏览器运行。
---

# Ant Design 单文件 HTML 构建技能

将用户需求（文字描述、UI截图、草图）转化为基于 Ant Design 的完整可运行单文件 HTML。

## Ant Design 官方文档

Ant Design 是 Ant Group 出品的企业级 React UI 库，当前稳定版为 **v5.x**，使用 CSS-in-JS 并引入 Design Token 主题系统。

**遇到不确定的组件 API、Props 或用法时，优先查阅官方文档，不要凭记忆猜测：**
- 组件概览 + 索引：https://ant.design/llms.txt
- 完整组件文档（含 API + 示例）：https://ant.design/llms-full.txt

## 快速框架选择

| 场景 | 推荐框架 |
|------|---------|
| 用户未指定框架 | **HTML + React**（默认） |
| 用户说"用React" / "React组件" | HTML + React |
| 用户说"用Vue" / "Vue项目" | HTML + Vue |
| 用户说"用Angular" / "NG-ZORRO" | HTML + Angular |
| 用户说"纯HTML" / "不要框架" / "最简单" | HTML + Vanilla JS + antd |

> 选定框架后，读取 `references/` 下对应的详细实现指南。

---

## 通用输出规范（所有框架适用）

### 像素级还原原则
- 精确匹配颜色值（背景色、文字色、边框色），不得使用近似色
- 精确匹配间距（padding、margin）、字号、字重
- 使用截图/描述中的**原始文本**，不得简化或替换
- 重复元素必须完整输出（15条列表项就写15条，不用注释代替）

### 图片处理
- 所有图片使用 `https://placehold.co/{宽}x{高}` 占位图
- alt 文本须详细描述图片内容，供后续 AI 图像生成使用
- 示例：`<img src="https://placehold.co/400x300" alt="企业团队合影，会议室背景，6人围坐圆桌">`

### 代码完整性
- **禁止**使用任何省略注释，如 `<!-- 其他项目... -->` `<!-- 重复以上 -->` `{/* ... */}`
- 所有状态、交互逻辑必须完整实现
- 可交互元素（按钮、表单、菜单）需有对应事件处理逻辑

### 输出格式
- 只输出 `<html>...</html>` 标签内的完整代码
- 不加 Markdown 代码块标记（不加 \`\`\`html）
- 代码可直接保存为 .html 文件在浏览器运行

---

## Ant Design 组件使用原则

优先使用 antd 内置组件，不重复造轮子：

- **布局**: `Layout`、`Grid`（Row/Col）、`Space`、`Divider`
- **导航**: `Menu`、`Breadcrumb`、`Pagination`、`Steps`
- **数据展示**: `Table`、`Card`、`List`、`Descriptions`、`Tag`、`Badge`、`Statistic`
- **数据录入**: `Form`、`Input`、`Select`、`DatePicker`、`Upload`、`Checkbox`、`Radio`、`Switch`
- **反馈**: `Modal`、`Drawer`、`Alert`、`Message`、`Notification`、`Spin`、`Progress`
- **按钮**: 区分 `primary`、`default`、`dashed`、`text`、`link` 类型

> Ant Design 默认主题色为 `#1677ff`（antd v5）或 `#1890ff`（antd v4），使用 CDN 版时默认为 v5 样式。

---

## 参考文件索引

根据选定框架，读取对应的详细实现指南：

| 框架 | 文件路径 | 内容摘要 |
|------|---------|---------|
| HTML + React（默认） | `references/react-antd.md` | CDN引入、JSX写法、Hooks、完整模板 |
| HTML + Vue | `references/vue-antd.md` | Vue3 全局构建、Composition API、完整模板 |
| HTML + Angular | `references/angular-antd.md` | NG-ZORRO、UMD引入、模块声明、完整模板 |
| 图标使用 | `references/icons.md` | @ant-design/icons 引入与使用方式 |

---

## 工作流程

```
1. 分析输入（文字描述 / 截图 / 草图）
2. 识别所需 antd 组件列表
3. 对不熟悉或不确定的组件，查阅 https://ant.design/llms.txt 确认 API
4. 根据框架选择读取对应 references/ 文件
5. 按通用输出规范生成完整 HTML
6. 自检：确认无省略注释，图片占位符正确，交互逻辑完整
7. 输出纯 HTML 代码（无 Markdown 包裹）
```
