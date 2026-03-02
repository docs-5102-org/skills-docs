# Ant Design Component Quick Reference

> This file provides a structured index of all 73 antd components with their primary use cases.
> For full API and examples, fetch: https://ant.design/llms-full.txt
> Or individual component: https://ant.design/components/{component-name}

---

## Layout Components

### Layout / Sider / Header / Content / Footer
```tsx
import { Layout } from 'antd';
const { Header, Sider, Content, Footer } = Layout;
```
- Admin shell structure with collapsible sidebar
- `Sider` supports `collapsible`, `collapsed`, `onCollapse`

### Grid: Row / Col
```tsx
import { Row, Col } from 'antd';
<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} md={8} lg={6}>...</Col>
</Row>
```
- 24-column grid system, responsive breakpoints: xs/sm/md/lg/xl/xxl

### Space
```tsx
<Space size="middle" direction="vertical" wrap>...</Space>
```
- Inline spacing between elements; use `wrap` for wrapping

### Flex
```tsx
<Flex gap="middle" align="center" justify="space-between" wrap>...</Flex>
```
- CSS flexbox wrapper, available since v5.10.0

### Divider
```tsx
<Divider orientation="left">Title</Divider>
<Divider type="vertical" />
```

---

## Navigation Components

### Menu
```tsx
<Menu mode="inline" items={[{ key, icon, label, children }]} />
// modes: 'horizontal' | 'vertical' | 'inline'
```
- `selectedKeys` (controlled), `defaultOpenKeys`, `onSelect`

### Breadcrumb
```tsx
<Breadcrumb items={[{ title: 'Home' }, { title: 'Page' }]} />
```

### Tabs
```tsx
<Tabs
  items={[{ key: '1', label: 'Tab 1', children: <Content /> }]}
  onChange={(key) => {}}
/>
```
- Types: `line` | `card` | `editable-card`

### Pagination
```tsx
<Pagination
  current={page}
  total={total}
  pageSize={10}
  onChange={(page, size) => {}}
  showSizeChanger
  showTotal={(total) => `Total ${total}`}
/>
```

### Steps
```tsx
<Steps
  current={1}
  items={[{ title: 'Step 1', description: 'desc' }]}
/>
```

### Anchor
- Page jump navigation with scroll tracking

---

## Data Entry Components

### Input / TextArea / Password / Search
```tsx
import { Input } from 'antd';
<Input placeholder="..." prefix={<Icon />} allowClear maxLength={100} showCount />
<Input.TextArea rows={4} autoSize={{ minRows: 2, maxRows: 6 }} />
<Input.Password />
<Input.Search onSearch={(val) => {}} enterButton />
```

### Select
```tsx
<Select
  options={[{ label: 'A', value: 'a' }]}
  mode="multiple"          // or 'tags'
  showSearch
  filterOption={(input, option) => option.label.includes(input)}
  allowClear
  placeholder="Select..."
  onChange={(value, option) => {}}
/>
```

### DatePicker / RangePicker / TimePicker
```tsx
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

<DatePicker format="YYYY-MM-DD" onChange={(date, str) => {}} />
<DatePicker.RangePicker />
<DatePicker showTime />
// antd v5 uses dayjs, not moment
```

### Form + Form.Item
```tsx
<Form form={form} layout="vertical" onFinish={onFinish}>
  <Form.Item name="field" label="Label" rules={[{ required: true }]}>
    <Input />
  </Form.Item>
  <Form.List name="items">
    {(fields, { add, remove }) => fields.map(field => (
      <Form.Item {...field} name={[field.name, 'value']}>
        <Input />
      </Form.Item>
    ))}
  </Form.List>
</Form>
```

### Checkbox / Radio
```tsx
<Checkbox.Group
  options={[{ label: 'A', value: 'a' }]}
  onChange={(checked) => {}}
/>
<Radio.Group options={options} optionType="button" buttonStyle="solid" />
```

### Switch
```tsx
<Switch checked={val} onChange={(checked) => {}} checkedChildren="On" unCheckedChildren="Off" />
```

### Slider
```tsx
<Slider min={0} max={100} range onChange={(val) => {}} marks={{ 0: '0', 100: '100' }} />
```

### Upload
```tsx
<Upload
  action="/api/upload"
  listType="picture-card"    // or 'text' | 'picture'
  maxCount={5}
  multiple
  onChange={({ file, fileList }) => {}}
  beforeUpload={(file) => {
    const isJpg = file.type === 'image/jpeg';
    return isJpg || Upload.LIST_IGNORE;
  }}
>
  <Button icon={<UploadOutlined />}>Upload</Button>
</Upload>
```

### Transfer
- Dual-panel selection widget

### TreeSelect
```tsx
<TreeSelect
  treeData={[{ title, value, children }]}
  treeCheckable
  showCheckedStrategy={TreeSelect.SHOW_PARENT}
/>
```

### Cascader
```tsx
<Cascader
  options={[{ label, value, children }]}
  multiple
  showSearch
/>
```

### ColorPicker (v5.5.0+)
```tsx
<ColorPicker defaultValue="#1677ff" showText onChange={(color) => color.toHexString()} />
```

### Mentions
```tsx
<Mentions options={[{ label, value }]} prefix={['@', '#']} />
```

---

## Data Display Components

### Table
```tsx
<Table
  columns={columns}
  dataSource={data}
  rowKey="id"
  loading={loading}
  pagination={{ current, pageSize, total, onChange }}
  rowSelection={{ type: 'checkbox', selectedRowKeys, onChange }}
  expandable={{ expandedRowRender: (record) => <p>{record.details}</p> }}
  scroll={{ x: 1200, y: 400 }}
  size="small"             // 'default' | 'middle' | 'small'
  sticky                   // sticky header
/>
```

### List
```tsx
<List
  dataSource={data}
  renderItem={(item) => (
    <List.Item actions={[<Button>Edit</Button>]}>
      <List.Item.Meta avatar={<Avatar />} title={item.title} description={item.desc} />
    </List.Item>
  )}
  pagination={{ pageSize: 10 }}
/>
```

### Card
```tsx
<Card
  title="Card Title"
  extra={<Button type="link">More</Button>}
  actions={[<EditOutlined />, <DeleteOutlined />]}
  cover={<img src="..." />}
  hoverable
>
  <Card.Meta avatar={<Avatar />} title="Title" description="Desc" />
</Card>
```

### Descriptions
```tsx
<Descriptions title="User Info" bordered column={3}>
  <Descriptions.Item label="Name">John</Descriptions.Item>
  <Descriptions.Item label="Status" span={2}>
    <Tag color="green">Active</Tag>
  </Descriptions.Item>
</Descriptions>
```

### Tag
```tsx
<Tag color="green">Active</Tag>
<Tag color="#87d068">Custom</Tag>
<Tag closable onClose={() => {}}>Closable</Tag>
<Tag.CheckableTag checked={checked} onChange={setChecked}>Tag</Tag.CheckableTag>
```

### Badge
```tsx
<Badge count={5} offset={[10, 0]}><Avatar /></Badge>
<Badge status="success" text="Active" />
<Badge dot><Icon /></Badge>
```

### Avatar
```tsx
<Avatar size={64} src="url" />
<Avatar icon={<UserOutlined />} />
<Avatar.Group maxCount={3}>...</Avatar.Group>
```

### Tree
```tsx
<Tree
  treeData={[{ title, key, children }]}
  checkable
  onCheck={(keys) => {}}
  draggable
/>
```

### Timeline
```tsx
<Timeline
  items={[
    { color: 'green', children: 'Event 1' },
    { dot: <ClockCircleOutlined />, children: 'Event 2' },
  ]}
/>
```

### Calendar
```tsx
<Calendar
  onSelect={(date) => {}}
  cellRender={(date) => <Badge count={3} />}
/>
```

### Carousel
```tsx
<Carousel autoplay dotPosition="bottom">
  <div><h3>Slide 1</h3></div>
</Carousel>
```

### Statistic / Countdown
```tsx
<Statistic title="Active Users" value={112893} prefix={<UserOutlined />} />
<Statistic.Countdown title="Deadline" value={Date.now() + 1000 * 60 * 60} />
```

---

## Feedback Components

### Modal
```tsx
// Controlled
<Modal title="Title" open={open} onOk={handleOk} onCancel={() => setOpen(false)} destroyOnHidden>
  <p>Content</p>
</Modal>

// Static
Modal.confirm({ title, content, onOk });
Modal.info({ title, content });
```

### Drawer
```tsx
<Drawer title="Title" open={open} onClose={() => setOpen(false)} width={640} placement="right">
  <Form />
</Drawer>
```

### message (Global)
```tsx
// Use App.useApp() in v5
const { message } = App.useApp();
message.success('Done!');
message.error('Failed!');
message.loading('Loading...', 0); // 0 = no auto-close
```

### notification (Global)
```tsx
const { notification } = App.useApp();
notification.open({ message, description, type: 'info', duration: 4 });
```

### Alert
```tsx
<Alert type="success" title="Success" description="More detail" showIcon closable />
// types: 'success' | 'info' | 'warning' | 'error'
```

### Spin / Skeleton
```tsx
<Spin spinning={loading} tip="Loading..."><Content /></Spin>
<Skeleton loading={loading} active avatar><Content /></Skeleton>
```

### Progress
```tsx
<Progress percent={70} status="active" />
<Progress type="circle" percent={75} />
<Progress type="dashboard" percent={75} />
```

### Result
```tsx
<Result
  status="success"    // '403' | '404' | '500' | 'success' | 'error' | 'warning' | 'info'
  title="Successfully Purchased!"
  extra={<Button type="primary">Back Home</Button>}
/>
```

### Popconfirm
```tsx
<Popconfirm
  title="Sure to delete?"
  onConfirm={handleDelete}
  okText="Yes"
  cancelText="No"
>
  <Button danger>Delete</Button>
</Popconfirm>
```

---

## Other Components

### Button
```tsx
<Button type="primary" size="large" icon={<SearchOutlined />} loading={loading} block>
  Submit
</Button>
// types: 'primary' | 'default' | 'dashed' | 'link' | 'text'
// sizes: 'large' | 'middle' | 'small'
```

### Tooltip / Popover
```tsx
<Tooltip title="Hover text" placement="top"><span>Hover me</span></Tooltip>
<Popover title="Title" content={<div>Rich content</div>} trigger="click">
  <Button>Click</Button>
</Popover>
```

### Dropdown
```tsx
<Dropdown
  menu={{
    items: [
      { key: '1', label: 'Action 1', icon: <EditOutlined /> },
      { type: 'divider' },
      { key: '2', label: 'Delete', danger: true },
    ],
    onClick: ({ key }) => {},
  }}
  trigger={['click']}
>
  <Button>Actions <DownOutlined /></Button>
</Dropdown>
```

### Image
```tsx
<Image src="url" width={200} preview={{ src: 'full-url' }} />
<Image.PreviewGroup items={images.map(src => ({ src }))}>
  {images.map(src => <Image key={src} src={src} />)}
</Image.PreviewGroup>
```

### QRCode (v5.1.0+)
```tsx
<QRCode value="https://ant.design" />
```

### Watermark (v5.1.0+)
```tsx
<Watermark content={['Ant Design', 'Version 5']}><Content /></Watermark>
```

### Tour (v5.0.0+)
```tsx
<Tour
  open={open}
  onClose={() => setOpen(false)}
  steps={[{ title, description, target: () => ref.current }]}
/>
```

### FloatButton (v5.0.0+)
```tsx
<FloatButton.Group trigger="click" icon={<CustomerServiceOutlined />}>
  <FloatButton icon={<QuestionCircleOutlined />} tooltip="Help" />
  <FloatButton.BackTop />
</FloatButton.Group>
```

---

## Utility Types (from antd)

```tsx
import type { GetRef, GetProps, GetProp } from 'antd';

// Get component ref type
type SelectRef = GetRef<typeof Select>;

// Get component props type
type ButtonProps = GetProps<typeof Button>;

// Get single prop type (NonNullable)
type SelectOptions = GetProp<typeof Select, 'options'>;
```