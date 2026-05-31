---
name: quotation-docx
description: >
  生成专业的中文项目报价单 Word 文档（.docx）。当用户提到"报价单"、"报价"、"开发报价"、"项目报价"、"做一个报价"、"生成报价文档"时，立即使用此 skill。支持任意项目类型（软件开发、小程序、网站、设计、硬件等），自动套用品牌主色、模块明细表、费用汇总、付款方式、里程碑计划等标准结构，输出专业可发送的 .docx 文件。即使用户只说"帮我出个报价"也应触发此 skill。
---

# 报价单 DOCX 生成 Skill

根据用户提供的项目信息，生成一份结构完整、排版专业的中文项目报价单 `.docx` 文件。

---

## 快速开始

### 第一步：收集信息

运行前先确认以下信息（没有的项可留空或用默认值）：

| 字段 | 说明 | 默认值 |
|------|------|--------|
| `project_name` | 项目名称 | 必填 |
| `client_name` | 客户/品牌名称 | 留空 |
| `modules` | 功能模块列表（含说明、工期、报价） | 必填 |
| `primary_color` | 品牌主色（HEX，不含#） | `1a5276`（深蓝） |
| `total_price` | 总价（元） | 自动加总 |
| `currency_words` | 总价大写 | 根据总价自动生成 |
| `valid_days` | 报价有效期（天） | `30` |
| `duration_weeks` | 预计工期（周） | 根据模块加总 |
| `payment_stages` | 付款节点（比例+时机） | 三阶段 30/40/30 |
| `milestones` | 里程碑列表 | 根据模块自动规划 |
| `notes` | 报价说明条款 | 使用默认条款 |

---

## 文档结构（标准模板）

生成的报价单包含以下六个章节，顺序固定：

```
封面标题块
一、项目概述（基本信息表）
二、功能模块报价明细（核心模块表）
三、技术架构说明（可选，软件项目适用）
四、费用汇总与付款方式
五、开发里程碑计划
六、报价说明与附加条款
签字栏
```

---

## 代码模板

使用 Node.js + `docx` 库生成。安装：`npm install -g docx`

输出路径：`/mnt/user-data/outputs/<文件名>.docx`

生成后必须运行验证：
```bash
python3 /mnt/skills/public/docx/scripts/office/validate.py "<输出路径>"
```

### 完整代码框架

```javascript
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType,
  VerticalAlign, LevelFormat
} = require('docx');
const fs = require('fs');

// ── 1. 品牌色配置 ──────────────────────────────────────────────────
// primaryColor: 品牌主色（来自用户输入，或默认深蓝 1a5276）
const primaryColor = "8B1A1A";       // 替换为实际主色
const headerBg    = "F5E6E6";        // 主色的极浅版（用于小标题背景）
const lightBg     = "FDF8F8";        // 隔行浅色背景
const borderColor = "D4A0A0";        // 表格边框色（主色的中间色调）
const grayColor   = "666666";        // 辅助灰色文字

// headerBg / lightBg / borderColor 根据 primaryColor 自动推导：
// - headerBg: 主色 + 大量白色混合（约 10% 主色饱和度）
// - lightBg:  比 headerBg 更浅
// - borderColor: 主色 + 50% 白色混合

// ── 2. 复用工具函数 ─────────────────────────────────────────────────

const border  = { style: BorderStyle.SINGLE, size: 4, color: borderColor };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder  = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

// 章节标题（带底部红线）
function makeHeader(text) {
  return new Paragraph({
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, bold: true, size: 28, color: primaryColor, font: "Arial" })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: primaryColor, space: 4 } }
  });
}

// 表头行（深色背景白字）
function headerRow(labels, widths) {
  return new TableRow({
    tableHeader: true,
    children: labels.map((label, i) =>
      new TableCell({
        borders,
        width: { size: widths[i], type: WidthType.DXA },
        shading: { fill: primaryColor, type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 120, right: 120 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: label, bold: true, size: 20, color: "FFFFFF", font: "Arial" })]
        })]
      })
    )
  });
}

// 普通数据行（支持隔行变色）
function dataRow(cols, widths, isEven = false) {
  return new TableRow({
    children: cols.map((text, i) =>
      new TableCell({
        borders,
        width: { size: widths[i], type: WidthType.DXA },
        shading: { fill: isEven ? lightBg : "FFFFFF", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          alignment: i >= cols.length - 2 ? AlignmentType.CENTER : AlignmentType.LEFT,
          children: [new TextRun({ text, size: 18, font: "Arial" })]
        })]
      })
    )
  });
}

// 模块行（含多条 bullet 说明 + 可选高亮）
function moduleRow(num, name, bullets, days, mandays, price, isHighlight = false, isEven = false) {
  const bg = isHighlight ? "F0E0E0" : (isEven ? lightBg : "FFFFFF");
  return new TableRow({
    children: [
      // 序号列
      mkCell(num,    420,  bg, { bold: isHighlight, color: isHighlight ? primaryColor : "000000", align: AlignmentType.CENTER }),
      // 模块名列
      mkCell(name,   2800, bg, { bold: isHighlight, color: isHighlight ? primaryColor : "000000", size: isHighlight ? 20 : 18 }),
      // 说明列（多 bullet）
      new TableCell({
        borders, width: { size: 3686, type: WidthType.DXA },
        shading: { fill: bg, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: bullets.map(b =>
          new Paragraph({
            numbering: { reference: "bullets", level: 0 },
            children: [new TextRun({ text: b, size: 18, font: "Arial" })]
          })
        )
      }),
      // 工期列
      mkCell(days,   900,  bg, { align: AlignmentType.CENTER }),
      // 工作量列（可删除此列，见"精简版"说明）
      mkCell(mandays,1200, bg, { align: AlignmentType.CENTER }),
      // 报价列
      mkCell(price,  1300, bg, { bold: isHighlight, color: isHighlight ? primaryColor : "000000", align: AlignmentType.CENTER }),
    ]
  });
}

// 单元格快捷创建
function mkCell(text, width, bg, opts = {}) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: bg || "FFFFFF", type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.LEFT,
      children: [new TextRun({
        text,
        bold:  opts.bold  || false,
        size:  opts.size  || 18,
        color: opts.color || "000000",
        font:  "Arial"
      })]
    })]
  });
}

// ── 3. 页面设置 ─────────────────────────────────────────────────────
// A4 竖版，边距 1000 DXA（约 1.76cm）
// 内容宽度 = 11906 - 1000*2 = 9906 DXA

// ── 4. 模块列宽参考（总宽 9906）───────────────────────────────────
// 含工作量列: [420, 2800, 3686, 900, 1200, 1300]  → sum=10306 ❌
// 正确分配:   [420, 2800, 3486, 900, 1200, 1300]  → sum=10106
// ⚠️ 实际使用时以总宽 9906 为准，各列之和必须等于表格宽度

const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "·",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 360, hanging: 180 } } }
      }]
    }]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 }
      }
    },
    children: [
      /* ── 封面标题 ── */
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "<项目名称>开发", bold: true, size: 52, color: primaryColor, font: "Arial" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "项目报价单", bold: true, size: 40, color: primaryColor, font: "Arial" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 40 },
        children: [new TextRun({ text: "（副标题，如技术栈/核心特性）", size: 24, color: grayColor, font: "Arial" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 400 },
        children: [new TextRun({ text: `报价日期：${new Date().toLocaleDateString('zh-CN')}　　　有效期：30天`, size: 20, color: grayColor, font: "Arial" })] }),

      /* ── 一、项目概述 ── */
      makeHeader("一、项目概述"),
      // 4列信息表：左列标签（headerBg背景），右列内容
      // 包含：项目名称、适用平台、硬件对接（可选）、预计工期

      /* ── 二、功能模块报价明细 ── */
      makeHeader("二、功能模块报价明细"),
      // moduleRow × N（每个功能模块一行）
      // 最后一行：合计行（primaryColor背景，白字）

      /* ── 三、技术架构说明（可选）── */
      makeHeader("三、技术架构说明"),
      // 纯软件项目适用；硬件/设计类项目可删除此节

      /* ── 四、费用汇总与付款方式 ── */
      makeHeader("四、费用汇总与付款方式"),
      // 费用汇总表（功能开发费 + UI设计 + 测试部署 + 运维 + 总价）
      // 付款方式表（首款30% / 中期款40% / 尾款30%）

      /* ── 五、开发里程碑计划 ── */
      makeHeader("五、开发里程碑计划"),
      // P1-P6 阶段表

      /* ── 六、报价说明 ── */
      makeHeader("六、报价说明与附加条款"),
      // 6-8条文字说明

      /* ── 签字栏 ── */
      // 双栏：甲方签字 + 乙方盖章
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/mnt/user-data/outputs/报价单.docx", buffer);
  console.log("Done");
});
```

---

## 关键设计决策

### 颜色推导规则

当用户提供品牌主色（如从 Logo、App 截图识别）时，按以下规则推导配套色：

```
primaryColor  = 用户品牌主色（HEX）
headerBg      = 主色 HSL 明度调至 95%（极浅背景）
lightBg       = 主色 HSL 明度调至 98%（隔行色）
borderColor   = 主色 HSL 明度调至 70%（边框）
```

### 列宽分配（A4，内容宽 9906 DXA）

| 场景 | 列宽数组 | 说明 |
|------|---------|------|
| 模块明细（含工期+工作量） | [420, 3000, 3086, 900, 1200, 1300] | 标准6列 |
| 模块明细（仅工期，删工作量） | [420, 3200, 3686, 1000, 1600] | 精简5列 |
| 费用汇总 | [3302, 3302, 3302] | 3等分 |
| 付款方式 | [1600, 2000, 3306, 3000] | 4列 |
| 里程碑 | [660, 2000, 4246, 3000] | 4列 |
| 项目概述 | [2200, 7706] | 标签+内容 |

> ⚠️ 所有列宽之和必须严格等于表格宽度（9906），否则 Word 渲染异常。

### 合计行样式

```javascript
// 合计行：primaryColor 背景，白色粗体文字
new TableRow({ children: [
  // 前几列合并（columnSpan）显示"合计"标签
  new TableCell({ borders, columnSpan: 3, shading: { fill: primaryColor, type: ShadingType.CLEAR },
    children: [new Paragraph({ alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: "合　计", bold: true, size: 22, color: "FFFFFF", font: "Arial" })] })]
  }),
  // 合计数值列
  new TableCell({ borders, shading: { fill: primaryColor, type: ShadingType.CLEAR },
    children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "¥xx,xxx", bold: true, size: 22, color: "FFFFFF", font: "Arial" })] })]
  }),
]})
```

### 总价大写换算（中文）

```javascript
function toChinese(n) {
  const units = ["", "万", "亿"];
  const digits = ["零","壹","贰","叁","肆","伍","陆","柒","捌","玖"];
  // 简化实现：仅覆盖常见报价范围（0-999万）
  const wan = Math.floor(n / 10000);
  const rest = n % 10000;
  let result = "";
  if (wan) result += digits[wan] + "万";
  if (rest) {
    const qian = Math.floor(rest / 1000);
    const bai  = Math.floor((rest % 1000) / 100);
    const shi  = Math.floor((rest % 100) / 10);
    const ge   = rest % 10;
    if (qian) result += digits[qian] + "仟";
    if (bai)  result += digits[bai]  + "佰";
    if (shi)  result += digits[shi]  + "拾";
    if (ge)   result += digits[ge];
  }
  return result + "元整";
}
// 示例：toChinese(60000) → "陆万元整"
```

---

## 精简版：删除"工作量(人天)"列

客户通常不需要看人天，删掉更干净：

1. `moduleRow` 函数去掉 `mandays` 参数和对应 `mkCell`
2. `headerRow` 标签数组去掉 `"工作量(人天)"`
3. 列宽从 6 列调整为 5 列，重新分配使总和等于 9906

---

## 常见陷阱

- **`\n` 换行无效**：bullet 点必须用独立 `Paragraph`，不能用 `\n` 拼接
- **`ShadingType.SOLID` 会全黑**：一律用 `ShadingType.CLEAR`
- **列宽之和必须精确等于表格宽度**：差 1 DXA 都可能导致最后一列溢出
- **`columnSpan` 合并列时**：被合并的列不再单独声明，宽度由 `columnSpan` 覆盖
- **中文字体**：统一用 `"Arial"`，Word 会自动 fallback 到系统中文字体，避免字体嵌入问题

---

## 输出检查清单

生成后逐项确认：

- [ ] `node script.js` 无报错
- [ ] `validate.py` 通过
- [ ] 总价数字与各模块加总一致
- [ ] 付款金额三项之和等于总价
- [ ] 里程碑阶段数与模块数匹配
- [ ] 文件名语义清晰（如 `咖啡机小程序报价单_v1.docx`）
- [ ] 调用 `present_files` 将文件发送给用户
