# Ant Design 图标使用指南

## 引入方式

### React 版本
```html
<script src="https://unpkg.com/@ant-design/icons/dist/index.umd.js"></script>
```
解构访问：`const { HomeOutlined, UserOutlined } = AntdIcons;`

### Vue 版本
```html
<script src="https://unpkg.com/@ant-design/icons-vue/dist/index.umd.js"></script>
```
解构访问：`const { HomeOutlined } = AntDesignIconsVue;`

### Angular / NG-ZORRO 版本
NG-ZORRO 内置图标模块，无需额外引入：
```html
<span nz-icon nzType="home" nzTheme="outline"></span>
```

---

## 图标命名规则

所有图标名称以用途分类，后缀为风格类型：
- `Outlined`（线条风格，默认，最常用）
- `Filled`（填充风格）
- `TwoTone`（双色风格）

## 常用图标速查

### 导航/界面
| 用途 | 组件名 |
|------|--------|
| 首页 | `HomeOutlined` |
| 用户/个人 | `UserOutlined` |
| 设置 | `SettingOutlined` |
| 仪表盘 | `DashboardOutlined` |
| 菜单收起 | `MenuFoldOutlined` |
| 菜单展开 | `MenuUnfoldOutlined` |
| 通知/铃铛 | `BellOutlined` |
| 退出登录 | `LogoutOutlined` |
| 搜索 | `SearchOutlined` |

### 操作类
| 用途 | 组件名 |
|------|--------|
| 新增/加号 | `PlusOutlined` |
| 编辑 | `EditOutlined` |
| 删除 | `DeleteOutlined` |
| 下载 | `DownloadOutlined` |
| 上传 | `UploadOutlined` |
| 复制 | `CopyOutlined` |
| 刷新 | `ReloadOutlined` |
| 过滤 | `FilterOutlined` |
| 导出 | `ExportOutlined` |
| 导入 | `ImportOutlined` |

### 状态/反馈
| 用途 | 组件名 |
|------|--------|
| 成功 | `CheckCircleOutlined` |
| 警告 | `ExclamationCircleOutlined` |
| 错误 | `CloseCircleOutlined` |
| 信息 | `InfoCircleOutlined` |
| 加载 | `LoadingOutlined` |
| 眼睛(查看) | `EyeOutlined` |
| 隐藏 | `EyeInvisibleOutlined` |

### 文件/数据
| 用途 | 组件名 |
|------|--------|
| 文件 | `FileOutlined` |
| 文件夹 | `FolderOutlined` |
| 图片 | `PictureOutlined` |
| 表格 | `TableOutlined` |
| 图表(折线) | `LineChartOutlined` |
| 图表(柱状) | `BarChartOutlined` |
| 图表(饼图) | `PieChartOutlined` |

### 方向/箭头
| 用途 | 组件名 |
|------|--------|
| 左箭头 | `LeftOutlined` |
| 右箭头 | `RightOutlined` |
| 上箭头 | `UpOutlined` |
| 下箭头 | `DownOutlined` |
| 返回 | `ArrowLeftOutlined` |
| 链接 | `LinkOutlined` |

## React 中使用示例
```jsx
// 图标作为独立元素
<SearchOutlined style={{ fontSize: '16px', color: '#1677ff' }} />

// 图标在 Button 中
<Button type="primary" icon={<PlusOutlined />}>新增</Button>

// 图标在 Menu 中
const items = [
  { key: '1', icon: <HomeOutlined />, label: '首页' },
  { key: '2', icon: <UserOutlined />, label: '用户管理' },
];
```

## Vue 中使用示例
```html
<!-- 注册后使用 -->
<a-button type="primary">
  <template #icon><plus-outlined /></template>
  新增
</a-button>

<!-- 独立图标 -->
<search-outlined style="font-size: 16px; color: #1677ff" />
```
