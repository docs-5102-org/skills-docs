# HTML + React + Ant Design 实现指南

## CDN 引入（固定版本，必须按顺序）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>页面标题</title>
  <link rel="stylesheet" href="https://unpkg.com/antd/dist/reset.css">
  <!-- 可选：Google Fonts -->
</head>
<body>
  <div id="root"></div>

  <script src="https://unpkg.com/react@18.0.0/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18.0.0/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.js"></script>
  <script src="https://unpkg.com/dayjs/dayjs.min.js"></script>
  <script src="https://unpkg.com/antd/dist/antd.min.js"></script>
  <script src="https://unpkg.com/@ant-design/icons/dist/index.umd.js"></script>

  <script type="text/babel">
    // 全局解构 antd 组件
    const {
      Layout, Menu, Button, Form, Input, Select, Table, Card,
      Space, Row, Col, Typography, Tag, Badge, Modal, Drawer,
      DatePicker, Upload, Checkbox, Radio, Switch, Pagination,
      Breadcrumb, Steps, Tabs, Collapse, List, Descriptions,
      Statistic, Progress, Alert, Spin, Divider, Avatar, Tooltip,
      Popover, Dropdown, message, notification, ConfigProvider
    } = antd;
    const { Header, Content, Footer, Sider } = Layout;
    const { Title, Text, Paragraph, Link } = Typography;
    const { Option } = Select;

    // 图标解构（按需取用）
    const {
      HomeOutlined, UserOutlined, SettingOutlined, SearchOutlined,
      PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined,
      UploadOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
      DashboardOutlined, FileOutlined, BellOutlined, LogoutOutlined
    } = AntdIcons;

    // React Hooks
    const { useState, useEffect, useCallback, useMemo, useRef } = React;

    // 主应用组件
    const App = () => {
      // ... 业务逻辑

      return (
        <ConfigProvider>
          {/* 页面结构 */}
        </ConfigProvider>
      );
    };

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>
```

## 常用模式

### 带侧边栏的后台布局
```jsx
const [collapsed, setCollapsed] = useState(false);

<Layout style={{ minHeight: '100vh' }}>
  <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
    <div style={{ height: 32, margin: 16, background: 'rgba(255,255,255,.2)' }} />
    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={menuItems} />
  </Sider>
  <Layout>
    <Header style={{ padding: 0, background: '#fff' }} />
    <Content style={{ margin: '16px' }}>
      <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
        {/* 内容区 */}
      </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>页脚文字</Footer>
  </Layout>
</Layout>
```

### 数据表格
```jsx
const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space>
        <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
        <Button type="link" danger onClick={() => handleDelete(record)}>删除</Button>
      </Space>
    )
  }
];

<Table columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 10 }} />
```

### 表单验证
```jsx
const [form] = Form.useForm();

const onFinish = (values) => {
  console.log('表单数据:', values);
};

<Form form={form} layout="vertical" onFinish={onFinish}>
  <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
    <Input placeholder="请输入" />
  </Form.Item>
  <Form.Item>
    <Button type="primary" htmlType="submit">提交</Button>
  </Form.Item>
</Form>
```

### Modal 弹窗
```jsx
const [open, setOpen] = useState(false);

<>
  <Button onClick={() => setOpen(true)}>打开弹窗</Button>
  <Modal title="标题" open={open} onOk={() => setOpen(false)} onCancel={() => setOpen(false)}>
    <p>弹窗内容</p>
  </Modal>
</>
```

## antd v5 注意事项
- `visible` 属性已废弃，改用 `open`（Modal、Drawer、Dropdown 等）
- `Menu` 使用 `items` 数组代替 `<Menu.Item>` 子元素写法（推荐）
- `message.success()` 等全局提示需在事件处理函数中调用
- 主题色 token：`colorPrimary: '#1677ff'`
