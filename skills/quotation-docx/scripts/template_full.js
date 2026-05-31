const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, LevelFormat, PageNumber, PageBreak
} = require('docx');
const fs = require('fs');

const primaryColor = "8B1A1A";
const headerBg = "F5E6E6";
const lightBg = "FDF8F8";
const borderColor = "D4A0A0";
const grayColor = "666666";

const border = { style: BorderStyle.SINGLE, size: 4, color: borderColor };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function makeHeader(text) {
  return new Paragraph({
    spacing: { before: 320, after: 160 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 28,
        color: primaryColor,
        font: "Arial"
      })
    ],
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: primaryColor, space: 4 } }
  });
}

function cell(text, opts = {}) {
  return new TableCell({
    borders,
    width: { size: opts.width || 2340, type: WidthType.DXA },
    shading: { fill: opts.bg || "FFFFFF", type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.LEFT,
      children: [new TextRun({
        text,
        bold: opts.bold || false,
        size: opts.size || 20,
        color: opts.color || "000000",
        font: "Arial"
      })]
    })]
  });
}

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

// ===================== DOCUMENT =====================
const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "·",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 180 } } }
        }]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 }
      }
    },
    children: [

      // ── TITLE BLOCK ──────────────────────────────────────────────
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "咖啡机自助小程序开发", bold: true, size: 52, color: primaryColor, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "项目报价单", bold: true, size: 40, color: primaryColor, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 40 },
        children: [new TextRun({ text: "（含京东云零售机器对接）", size: 24, color: grayColor, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 40, after: 400 },
        children: [new TextRun({ text: `报价日期：${new Date().toLocaleDateString('zh-CN')}　　　有效期：30天`, size: 20, color: grayColor, font: "Arial" })]
      }),

      // ── SECTION 1: PROJECT INFO ───────────────────────────────────
      makeHeader("一、项目概述"),

      new Table({
        width: { size: 9906, type: WidthType.DXA },
        columnWidths: [2200, 7706],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, shading: { fill: headerBg, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "项目名称", bold: true, size: 20, color: primaryColor, font: "Arial" })] })] }),
            new TableCell({ borders, width: { size: 7706, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "咖啡机自助点单小程序（卡法未来品牌）", size: 20, font: "Arial" })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, shading: { fill: headerBg, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "适用平台", bold: true, size: 20, color: primaryColor, font: "Arial" })] })] }),
            new TableCell({ borders, width: { size: 7706, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "微信小程序", size: 20, font: "Arial" })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, shading: { fill: headerBg, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "硬件对接", bold: true, size: 20, color: primaryColor, font: "Arial" })] })] }),
            new TableCell({ borders, width: { size: 7706, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "京东云零售咖啡机（已完成API对接）", size: 20, font: "Arial" })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, shading: { fill: headerBg, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "预计工期", bold: true, size: 20, color: primaryColor, font: "Arial" })] })] }),
            new TableCell({ borders, width: { size: 7706, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "60个工作日（约3个月）", size: 20, font: "Arial" })] })] })
          ]}),
        ]
      }),

      // ── SECTION 2: MODULES ───────────────────────────────────────
      makeHeader("二、功能模块报价明细"),

      new Table({
        width: { size: 9906, type: WidthType.DXA },
        columnWidths: [420, 3000, 3086, 900, 1200, 1300],
        rows: [
          headerRow(["序号","功能模块","功能说明","工期(天)","工作量(人天)","报价(元)"],
                    [420, 3000, 3086, 900, 1200, 1300]),

          // --- 首页 ---
          new TableRow({ children: [
            new TableCell({ borders, width:{size:420,type:WidthType.DXA}, shading:{fill:"F0E0E0",type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:80,right:80}, children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"1",bold:true,size:18,color:primaryColor,font:"Arial"})]})]}),
            new TableCell({ borders, width:{size:3000,type:WidthType.DXA}, shading:{fill:"F0E0E0",type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:120,right:120}, children:[new Paragraph({children:[new TextRun({text:"首页 & 会员中心",bold:true,size:20,color:primaryColor,font:"Arial"})]})]}),
            new TableCell({ borders, width:{size:3086,type:WidthType.DXA}, shading:{fill:"F0E0E0",type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:120,right:120}, children:[
              new Paragraph({numbering:{reference:"bullets",level:0},children:[new TextRun({text:"首页Banner轮播/活动展示",size:18,font:"Arial"})]}),
              new Paragraph({numbering:{reference:"bullets",level:0},children:[new TextRun({text:"注册/登录（微信一键授权）",size:18,font:"Arial"})]}),
              new Paragraph({numbering:{reference:"bullets",level:0},children:[new TextRun({text:"邀请好友注册（5元券）",size:18,font:"Arial"})]}),
              new Paragraph({numbering:{reference:"bullets",level:0},children:[new TextRun({text:"积分商城 / 福利抽奖入口",size:18,font:"Arial"})]}),
            ]}),
            new TableCell({ borders, width:{size:900,type:WidthType.DXA}, shading:{fill:"F0E0E0",type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:80,right:80}, children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"8",size:18,font:"Arial"})]})]}),
            new TableCell({ borders, width:{size:1200,type:WidthType.DXA}, shading:{fill:"F0E0E0",type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:80,right:80}, children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"10",size:18,font:"Arial"})]})]}),
            new TableCell({ borders, width:{size:1300,type:WidthType.DXA}, shading:{fill:"F0E0E0",type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:80,right:80}, children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"8,000",size:18,font:"Arial"})]})]}),
          ]}),

          // --- 附近设备 ---
          dataRow(["2","附近设备 & 地图","LBS定位查询附近20台设备\n地图标注（腾讯地图SDK）\n设备状态显示（营业中/维护中）\n搜索设备功能","6","7","6,000"], [420,3000,3086,900,1200,1300], false),

          // --- 扫码点单 ---
          dataRow(["3","扫码点单 & 商品选购","扫码识别设备二维码\n商品分类展示 & 规格选择\n自定义口味/温度/甜度\n购物车 & 数量管理","8","10","8,500"], [420,3000,3086,900,1200,1300], true),

          // --- 支付 ---
          dataRow(["4","支付 & 优惠券","微信支付对接\n优惠券抵扣（无门槛/满减）\n次卡购买 & 核销\n支付结果回调处理","8","12","10,000"], [420,3000,3086,900,1200,1300], false),

          // --- 京东云对接 ---
          new TableRow({ children: [
            new TableCell({ borders, width:{size:420,type:WidthType.DXA}, shading:{fill:"F0E0E0",type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:80,right:80}, children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"5",bold:true,size:18,color:primaryColor,font:"Arial"})]})]}),
            new TableCell({ borders, width:{size:3000,type:WidthType.DXA}, shading:{fill:"F0E0E0",type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:120,right:120}, children:[new Paragraph({children:[new TextRun({text:"★ 京东云零售机器对接",bold:true,size:20,color:primaryColor,font:"Arial"})]})]}),
            new TableCell({ borders, width:{size:3086,type:WidthType.DXA}, shading:{fill:"F0E0E0",type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:120,right:120}, children:[
              new Paragraph({numbering:{reference:"bullets",level:0},children:[new TextRun({text:"京东云IoT API接入 & 鉴权",size:18,font:"Arial"})]}),
              new Paragraph({numbering:{reference:"bullets",level:0},children:[new TextRun({text:"下单指令推送至咖啡机",size:18,font:"Arial"})]}),
              new Paragraph({numbering:{reference:"bullets",level:0},children:[new TextRun({text:"出品状态实时监听（WebSocket）",size:18,font:"Arial"})]}),
              new Paragraph({numbering:{reference:"bullets",level:0},children:[new TextRun({text:"设备在线/离线状态同步",size:18,font:"Arial"})]}),
              new Paragraph({numbering:{reference:"bullets",level:0},children:[new TextRun({text:"异常报错处理 & 退款联动",size:18,font:"Arial"})]}),
            ]}),
            new TableCell({ borders, width:{size:900,type:WidthType.DXA}, shading:{fill:"F0E0E0",type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:80,right:80}, children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"10",size:18,font:"Arial"})]})]}),
            new TableCell({ borders, width:{size:1200,type:WidthType.DXA}, shading:{fill:"F0E0E0",type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:80,right:80}, children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"15",size:18,font:"Arial"})]})]}),
            new TableCell({ borders, width:{size:1300,type:WidthType.DXA}, shading:{fill:"F0E0E0",type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:80,right:80}, children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"15,000",size:18,font:"Arial"})]})]}),
          ]}),

          // --- 订单管理 ---
          dataRow(["6","订单管理","我的订单列表（全部/自取/外卖）\n订单状态实时更新\n历史订单查询 & 再来一单","5","6","5,000"], [420,3000,3086,900,1200,1300], false),

          // --- 会员/积分 ---
          dataRow(["7","会员 & 积分体系","积分获取 & 消耗规则\n积分兑好礼（商城）\n会员成长体系 & 等级\n优惠券包管理","8","10","8,000"], [420,3000,3086,900,1200,1300], true),

          // --- 个人中心 ---
          dataRow(["8","个人中心 & 常用功能","余额充值（会员储值）\n我的地址管理\n次卡购买 & 我的次卡\n合作申请入口 & 客服","5","6","5,000"], [420,3000,3086,900,1200,1300], false),

          // --- 后台 ---
          dataRow(["9","管理后台（Web端）","商品/设备/库存管理\n订单管理 & 数据统计\n优惠券/活动配置\n会员数据查询","10","15","12,000"], [420,3000,3086,900,1200,1300], true),

          // total
          new TableRow({ children: [
            new TableCell({ borders, columnSpan: 3, width:{size:6506,type:WidthType.DXA}, shading:{fill:primaryColor,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:120,right:120}, children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[new TextRun({text:"合计",bold:true,size:22,color:"FFFFFF",font:"Arial"})]})]}),
            new TableCell({ borders, width:{size:900,type:WidthType.DXA}, shading:{fill:primaryColor,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:80,right:80}, children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"68",bold:true,size:22,color:"FFFFFF",font:"Arial"})]})]}),
            new TableCell({ borders, width:{size:1200,type:WidthType.DXA}, shading:{fill:primaryColor,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:80,right:80}, children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"91",bold:true,size:22,color:"FFFFFF",font:"Arial"})]})]}),
            new TableCell({ borders, width:{size:1300,type:WidthType.DXA}, shading:{fill:primaryColor,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:80,right:80}, children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"77,500",bold:true,size:22,color:"FFFFFF",font:"Arial"})]})]}),
          ]}),
        ]
      }),

      // ── SECTION 3: TECH STACK ─────────────────────────────────────
      makeHeader("三、技术架构说明"),

      new Table({
        width: { size: 9906, type: WidthType.DXA },
        columnWidths: [1800, 4053, 4053],
        rows: [
          headerRow(["层级","技术选型","说明"], [1800, 4053, 4053]),
          dataRow(["前端（小程序）","微信原生小程序 / Taro框架","适配低端机，性能更优"], [1800,4053,4053], false),
          dataRow(["后端服务","Node.js + Express / Spring Boot","RESTful API，支持高并发"], [1800,4053,4053], true),
          dataRow(["数据库","MySQL 8.0 + Redis 缓存","订单/会员数据持久化"], [1800,4053,4053], false),
          dataRow(["云服务","腾讯云 COS + CDN","图片/静态资源托管"], [1800,4053,4053], true),
          dataRow(["地图","腾讯地图 JavaScript SDK","附近设备查询定位"], [1800,4053,4053], false),
          dataRow(["IoT对接","京东云零售机器 Open API","WebSocket长连接推送出品状态"], [1800,4053,4053], true),
          dataRow(["支付","微信支付 v3 API","小程序支付 & 退款"], [1800,4053,4053], false),
        ]
      }),

      // ── SECTION 4: PAYMENT ───────────────────────────────────────
      makeHeader("四、费用汇总与付款方式"),

      new Table({
        width: { size: 9906, type: WidthType.DXA },
        columnWidths: [3302, 3302, 3302],
        rows: [
          headerRow(["费用类型","金额（元）","备注"], [3302,3302,3302]),
          dataRow(["功能开发费","77,500","含全部9个模块"], [3302,3302,3302], false),
          dataRow(["UI设计费","8,000","参考卡法未来品牌视觉规范"], [3302,3302,3302], true),
          dataRow(["测试 & 部署","5,000","含上线支持、小程序审核配合"], [3302,3302,3302], false),
          dataRow(["运维支持（首年）","6,000","Bug修复，云服务不含"], [3302,3302,3302], true),
          new TableRow({ children: [
            new TableCell({ borders, width:{size:3302,type:WidthType.DXA}, shading:{fill:primaryColor,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:120,right:120}, children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"项目总价",bold:true,size:22,color:"FFFFFF",font:"Arial"})]})]}),
            new TableCell({ borders, columnSpan:2, width:{size:6604,type:WidthType.DXA}, shading:{fill:primaryColor,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:120,right:120}, children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"￥96,500 元（人民币玖万陆仟伍佰元整）",bold:true,size:24,color:"FFFFFF",font:"Arial"})]})]}),
          ]}),
        ]
      }),

      new Paragraph({ spacing: { before: 200, after: 80 }, children: [new TextRun({ text: "付款方式：", bold: true, size: 20, color: primaryColor, font: "Arial" })] }),
      new Table({
        width: { size: 9906, type: WidthType.DXA },
        columnWidths: [1600, 2000, 3306, 3000],
        rows: [
          headerRow(["阶段","付款比例","金额（元）","付款时机"], [1600,2000,3306,3000]),
          dataRow(["首款","30%","28,950","合同签订后3个工作日内"], [1600,2000,3306,3000], false),
          dataRow(["中期款","40%","38,600","完成核心功能提测验收后"], [1600,2000,3306,3000], true),
          dataRow(["尾款","30%","28,950","小程序上线验收通过后"], [1600,2000,3306,3000], false),
        ]
      }),

      // ── SECTION 5: SCHEDULE ──────────────────────────────────────
      makeHeader("五、开发里程碑计划"),

      new Table({
        width: { size: 9906, type: WidthType.DXA },
        columnWidths: [660, 2000, 4246, 3000],
        rows: [
          headerRow(["阶段","时间","交付内容","里程碑"], [660,2000,4246,3000]),
          dataRow(["P1","第1-2周","需求确认、UI设计稿评审、数据库设计","设计稿终稿交付"], [660,2000,4246,3000], false),
          dataRow(["P2","第3-5周","首页、附近设备、扫码点单、支付","前端核心流程可演示"], [660,2000,4246,3000], true),
          dataRow(["P3","第6-7周","京东云IoT对接、订单状态推送","真机联调出品成功"], [660,2000,4246,3000], false),
          dataRow(["P4","第8-9周","会员积分、个人中心、优惠券","全模块内测"], [660,2000,4246,3000], true),
          dataRow(["P5","第10-11周","管理后台开发","后台功能完整"], [660,2000,4246,3000], false),
          dataRow(["P6","第12周","测试修复、小程序审核、上线","正式上线交付"], [660,2000,4246,3000], true),
        ]
      }),

      // ── SECTION 6: NOTES ────────────────────────────────────────
      makeHeader("六、报价说明与附加条款"),

      ...[
        "1. 本报价基于上述UI截图及功能描述，如需新增功能模块需另行评估报价。",
        "2. 京东云零售机器API对接基于京东云官方Open API文档，如对方接口发生重大变更，调整工作量另计。",
        "3. 云服务器、短信、地图API等第三方按量付费费用由甲方自行承担，不含在本报价内。",
        "4. 小程序企业主体资质、微信支付商户号由甲方提前准备，开发方协助配置。",
        "5. 本报价有效期为30天，超期需重新确认。",
        "6. 源代码、设计稿等知识产权在尾款结清后全部移交甲方。",
      ].map(text => new Paragraph({
        spacing: { before: 80, after: 80 },
        children: [new TextRun({ text, size: 18, font: "Arial" })]
      })),

      // ── SIGNATURE ────────────────────────────────────────────────
      new Paragraph({ spacing: { before: 400, after: 80 }, children: [] }),
      new Table({
        width: { size: 9906, type: WidthType.DXA },
        columnWidths: [4953, 4953],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders: noBorders, width:{size:4953,type:WidthType.DXA}, margins:{top:80,bottom:80,left:120,right:120}, children:[
              new Paragraph({ children:[new TextRun({text:"甲方（委托方）确认签字：",bold:true,size:20,font:"Arial"})] }),
              new Paragraph({ spacing:{before:600}, children:[new TextRun({text:"签字：_______________　日期：___________",size:20,font:"Arial"})] }),
            ]}),
            new TableCell({ borders: noBorders, width:{size:4953,type:WidthType.DXA}, margins:{top:80,bottom:80,left:120,right:120}, children:[
              new Paragraph({ children:[new TextRun({text:"乙方（开发方）盖章：",bold:true,size:20,font:"Arial"})] }),
              new Paragraph({ spacing:{before:600}, children:[new TextRun({text:"盖章：_______________　日期：___________",size:20,font:"Arial"})] }),
            ]}),
          ]}),
        ]
      }),

    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/mnt/user-data/outputs/咖啡机小程序开发报价单.docx", buffer);
  console.log("Done");
});
