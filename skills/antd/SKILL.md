---
name: antd
description: Use this skill whenever the user asks to build UI components, pages, or features using Ant Design (antd). Triggers include:any mention of "antd", "Ant Design", using antd components (Button, Table, Form, Modal, Select, DatePicker, etc.), building React admin/dashboard/enterprise UIs, theming with antd, or fixing antd-related issues. Also triggers for questions about antd API, props, design tokens, or migration between antd versions.
license: MIT
docs:
  overview: https://ant.design/llms.txt
  full: https://ant.design/llms-full.txt
---

# Ant Design (antd) Development Guide

## Overview

Ant Design is an enterprise-class React UI library by Ant Group. Current stable version is **v5.x**, which uses CSS-in-JS by default and introduces Design Tokens for theming.

> **Always refer to the official docs for component details:**
> - Component overview + links → https://ant.design/llms.txt
> - Full component docs with API + examples → https://ant.design/llms-full.txt

---

## ⚠️ Umi / @umijs/max Import Rule — CRITICAL

When the project uses **Umi** or **@umijs/max**, ALL framework-level APIs **must** be imported from `@umijs/max`, never from `umi`.

```tsx
// ✅ CORRECT — always use @umijs/max
import { Access, useAccess, history, useModel, useRequest, Link, NavLink } from '@umijs/max';

// ❌ WRONG — do NOT use 'umi' directly
import { history, useModel } from 'umi';
```

### Why

`@umijs/max` is the modern, feature-complete preset that supersedes `umi`. It re-exports everything from `umi` and adds built-in plugins (access control, initial state, request, layout, etc.). Using `umi` directly in a `@umijs/max` project causes:
- Missing plugin APIs (e.g. `useAccess`, `useModel` not found)
- Potential duplicate React contexts
- Build inconsistencies

### Common @umijs/max APIs

| API | Import |
|-----|--------|
| Routing (`history`, `useNavigate`, `Link`, `NavLink`) | `@umijs/max` |
| Access control (`Access`, `useAccess`) | `@umijs/max` |
| Global state (`useModel`) | `@umijs/max` |
| Data fetching (`useRequest`) | `@umijs/max` |
| App layout (`defineApp`, `defineLayout`) | `@umijs/max` |
| Request instance (`request`) | `@umijs/max` |

### How to detect which one the project uses

1. Check `package.json` — if `@umijs/max` is listed as a dependency, **always use `@umijs/max`**.
2. Check `config/config.ts` or `.umirc.ts` — presence of `@umijs/max` preset confirms it.
3. When uncertain, default to `@umijs/max` (it is backwards-compatible with `umi`).

---

## Quick Start

```bash
npm install antd
# or
pnpm add antd
```

```tsx
import { Button, ConfigProvider } from 'antd';

const App = () => (
  <ConfigProvider theme={{ token: { colorPrimary: '#1677ff' } }}>
    <Button type="primary">Hello Ant Design</Button>
  </ConfigProvider>
);
```

---

## Core Principles

### 1. Always Use ConfigProvider at the Root

Wrap your entire app with `ConfigProvider` to:
- Set global theme tokens
- Configure locale (i18n)
- Set global component default props

```tsx
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

<ConfigProvider
  locale={zhCN}
  theme={{
    token: {
      colorPrimary: '#1677ff',
      borderRadius: 6,
    },
    components: {
      Button: { borderRadius: 4 },
    },
  }}
>
  <App />
</ConfigProvider>
```

### 2. Import Only What You Need (Tree Shaking)

antd v5 supports tree shaking by default. No need for babel-plugin-import.

```tsx
// ✅ Correct - tree shaking works
import { Button, Table, Form } from 'antd';

// ❌ Avoid - imports entire library
import antd from 'antd';
```

### 3. Use Design Tokens, Not Hardcoded Colors

```tsx
import { theme } from 'antd';

const MyComponent = () => {
  const { token } = theme.useToken();
  return (
    <div style={{ color: token.colorPrimary, padding: token.paddingMD }}>
      Themed content
    </div>
  );
};
```

---

## Component Usage Patterns

### Form (Most Complex Component)

```tsx
import { Form, Input, Button, Select } from 'antd';

const MyForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };

  return (
    <Form
      form={form}
      layout="vertical"           // 'horizontal' | 'vertical' | 'inline'
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={(errorInfo) => console.log('Failed:', errorInfo)}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          { required: true, message: 'Please input your username!' },
          { min: 3, message: 'At least 3 characters' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Role"
        name="role"
        rules={[{ required: true }]}
      >
        <Select options={[
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
        ]} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
        <Button onClick={() => form.resetFields()} style={{ marginLeft: 8 }}>Reset</Button>
      </Form.Item>
    </Form>
  );
};
```

**Form Tips:**
- Use `Form.useForm()` for programmatic control
- `form.setFieldsValue()` to set values externally
- `form.validateFields()` returns a Promise
- `Form.List` for dynamic fields

### Table (Data Display)

```tsx
import { Table, Tag, Space, Button } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
  key: string;
  name: string;
  age: number;
  status: 'active' | 'inactive';
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    filterSearch: true,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (status) => (
      <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag>
    ),
    filters: [
      { text: 'Active', value: 'active' },
      { text: 'Inactive', value: 'inactive' },
    ],
    onFilter: (value, record) => record.status === value,
  },
  {
    title: 'Action',
    render: (_, record) => (
      <Space>
        <Button type="link" size="small">Edit</Button>
        <Button type="link" danger size="small">Delete</Button>
      </Space>
    ),
  },
];

// Server-side pagination pattern
const MyTable = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const handleTableChange: TableProps<DataType>['onChange'] = (pag, filters, sorter) => {
    // Fetch data based on new params
    fetchData({ pagination: pag, filters, sorter });
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="key"
      loading={loading}
      pagination={pagination}
      onChange={handleTableChange}
      scroll={{ x: 1200 }}   // horizontal scroll for many columns
    />
  );
};
```

### Modal

```tsx
import { Modal, Button, Form } from 'antd';

// Pattern 1: Controlled Modal with Form
const EditModal = ({ open, onClose, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) form.setFieldsValue(initialValues);
    else form.resetFields();
  }, [open, initialValues]);

  const handleOk = async () => {
    const values = await form.validateFields();
    onSubmit(values);
  };

  return (
    <Modal
      title="Edit Item"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      destroyOnHidden   // reset state when closed
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Pattern 2: Static method (for confirms, alerts)
Modal.confirm({
  title: 'Are you sure?',
  content: 'This action cannot be undone.',
  onOk: () => handleDelete(),
});
```

### Layout (Admin Shell)

```tsx
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  UserOutlined,
  DashboardOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={[
            { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
            { key: 'users', icon: <UserOutlined />, label: 'Users' },
            {
              key: 'settings',
              icon: <SettingOutlined />,
              label: 'Settings',
              children: [
                { key: 'profile', label: 'Profile' },
                { key: 'security', label: 'Security' },
              ],
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
```

---

## Theming: Design Tokens

antd v5 uses a 3-tier token system:

```
Global Tokens → Alias Tokens → Component Tokens
```

### Customize Global Tokens

```tsx
<ConfigProvider theme={{
  token: {
    // Brand colors
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    // Typography
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI"',
    // Border
    borderRadius: 6,
    // Spacing (follows 4px base grid)
    marginXS: 8,
    marginSM: 12,
    margin: 16,
    marginMD: 20,
    marginLG: 24,
  }
}}>
```

### Customize Component Tokens

```tsx
<ConfigProvider theme={{
  components: {
    Button: {
      colorPrimary: '#ff6b35',
      borderRadius: 20,         // pill buttons
    },
    Table: {
      headerBg: '#f0f5ff',
      rowHoverBg: '#e6f4ff',
    },
    Form: {
      labelColor: '#555',
      labelFontSize: 13,
    },
  }
}}>
```

### Dark Mode

```tsx
import { theme } from 'antd';

<ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
  <App />
</ConfigProvider>

// Dynamic toggle
const [isDark, setIsDark] = useState(false);
<ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
```

### Use Tokens in Components

```tsx
const { token } = theme.useToken();

// token.colorPrimary, token.colorBgContainer, token.borderRadius...
```

---

## Icons

Requires separate package:

```bash
npm install @ant-design/icons
```

```tsx
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

// In components
<Button icon={<PlusOutlined />} type="primary">Add</Button>
<Input prefix={<SearchOutlined />} placeholder="Search..." />
```

---

## Common Patterns

### CRUD Page Pattern

```tsx
import { Table, Button, Modal, Form, Space, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const CrudPage = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingRecord(null);
    setModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await api.delete(id);
    message.success('Deleted successfully');
    fetchData();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editingRecord) {
      await api.update(editingRecord.id, values);
    } else {
      await api.create(values);
    }
    message.success('Saved successfully');
    setModalOpen(false);
    fetchData();
  };

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" />
      <Modal
        title={editingRecord ? 'Edit' : 'Add'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
```

### Search + Filter Toolbar

```tsx
import { Input, Select, DatePicker, Button, Space, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const SearchToolbar = ({ onSearch, onReset }) => (
  <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
    <Col xs={24} sm={12} md={8} lg={6}>
      <Input placeholder="Search by name" prefix={<SearchOutlined />} allowClear />
    </Col>
    <Col xs={24} sm={12} md={8} lg={6}>
      <Select placeholder="Status" style={{ width: '100%' }} allowClear
        options={[
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ]}
      />
    </Col>
    <Col xs={24} sm={12} md={8} lg={6}>
      <DatePicker.RangePicker style={{ width: '100%' }} />
    </Col>
    <Col>
      <Space>
        <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>Search</Button>
        <Button icon={<ReloadOutlined />} onClick={onReset}>Reset</Button>
      </Space>
    </Col>
  </Row>
);
```

### Notification & Message

```tsx
import { message, notification, App } from 'antd';

// In antd v5, use App.useApp() to avoid hooks-outside-context issues
const MyComponent = () => {
  const { message, notification, modal } = App.useApp();

  const handleSuccess = () => {
    message.success('Operation successful!');
  };

  const handleNotify = () => {
    notification.open({
      message: 'Notification Title',
      description: 'Detailed description here.',
      type: 'info',
      duration: 4,
    });
  };
};

// Wrap app with <App> component
<ConfigProvider>
  <App>
    <MyApp />
  </App>
</ConfigProvider>
```

---

## Integration Guides

### With Next.js (App Router)

```tsx
// app/AntdRegistry.tsx
'use client';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { useServerInsertedHTML } from 'next/navigation';
import { useState } from 'react';

export function AntdRegistry({ children }: React.PropsWithChildren) {
  const [cache] = useState(() => createCache());
  useServerInsertedHTML(() => (
    <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
  ));
  return <StyleProvider cache={cache}>{children}</StyleProvider>;
}

// app/layout.tsx
import { AntdRegistry } from './AntdRegistry';
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
```

### With Vite

```tsx
// vite.config.ts - no special config needed for v5
// Just install and import

// main.tsx
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';   // Reset styles only in v5
```

---

## Common Mistakes & Fixes

| Mistake | Fix |
|---------|-----|
| `message.success` not styled | Wrap with `<App>`, use `App.useApp()` |
| Modal not closing on submit | Use `open` state, not `visible` (deprecated) |
| Form not resetting on Modal close | Add `destroyOnHidden` to Modal |
| Table not updating | Check `rowKey` is unique; avoid index as key |
| Dark mode not applying | Ensure `ConfigProvider` wraps entire tree |
| Icons not showing | Install `@ant-design/icons` separately |
| CSS conflicts with Tailwind | Add `antd/dist/reset.css` before Tailwind base |
| `getPopupContainer` warning | Pass `() => document.body` or parent element |
| Form submit triggering on Enter | Add `onKeyDown` or use `htmlType="button"` on non-submit buttons |

---

## Version Notes (v5 vs v4)

| Feature | v4 | v5 |
|---------|----|----|
| Styling | Less | CSS-in-JS (Design Tokens) |
| Theming | `@primary-color` Less var | `ConfigProvider theme.token` |
| `visible` prop | ✅ Used | ❌ Replaced by `open` |
| `message` / `notification` | Global static | `App.useApp()` recommended |
| Icon package | Bundled | Separate `@ant-design/icons` |
| `babel-plugin-import` | Required | Not needed |
| SSR | Manual setup | StyleProvider |

---

## Quick Reference: Key Components

| Category | Components |
|----------|------------|
| Layout | `Layout`, `Grid (Row/Col)`, `Space`, `Divider`, `Flex` |
| Navigation | `Menu`, `Breadcrumb`, `Pagination`, `Steps`, `Tabs` |
| Data Entry | `Form`, `Input`, `Select`, `DatePicker`, `Upload`, `Switch`, `Checkbox`, `Radio`, `Slider` |
| Data Display | `Table`, `List`, `Card`, `Descriptions`, `Tag`, `Badge`, `Avatar`, `Tree`, `Timeline` |
| Feedback | `Modal`, `Drawer`, `Alert`, `message`, `notification`, `Spin`, `Progress`, `Skeleton` |
| Other | `Button`, `Icon`, `Tooltip`, `Popover`, `Dropdown`, `ConfigProvider`, `App` |

---

## Documentation Links

- **All components overview**: https://ant.design/llms.txt
- **Full docs with API + examples**: https://ant.design/llms-full.txt
- **Specific component** (replace `button`): https://ant.design/components/button
- **Design tokens**: https://ant.design/docs/react/customize-theme
- **Migration v4→v5**: https://ant.design/docs/react/migration-v5
