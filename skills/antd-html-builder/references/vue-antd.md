# HTML + Vue 3 + Ant Design Vue 实现指南

## CDN 引入（固定版本，必须按顺序）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>页面标题</title>
  <link rel="stylesheet" href="https://unpkg.com/ant-design-vue@4/dist/reset.css">
</head>
<body>
  <div id="app"></div>

  <script src="https://unpkg.com/vue@3.3.11/dist/vue.global.js"></script>
  <script src="https://unpkg.com/dayjs/dayjs.min.js"></script>
  <script src="https://unpkg.com/ant-design-vue@4/dist/antd.min.js"></script>
  <script src="https://unpkg.com/@ant-design/icons-vue/dist/index.umd.js"></script>

  <script>
    const { createApp, ref, reactive, computed, onMounted, watch } = Vue;
    const {
      Layout, Menu, Button, Form, Input, Select, Table, Card,
      Space, Row, Col, Typography, Tag, Badge, Modal, Drawer,
      DatePicker, Checkbox, Radio, Switch, Pagination, message,
      Breadcrumb, Steps, Tabs, List, Descriptions, Statistic,
      Progress, Alert, Spin, Divider, Avatar, Tooltip, Dropdown,
      notification, ConfigProvider
    } = antd;

    const { HomeOutlined, UserOutlined, SettingOutlined } = AntDesignIconsVue;

    const app = createApp({
      components: {
        // 注册所有用到的组件
        ALayout: Layout,
        ALayoutHeader: Layout.Header,
        ALayoutContent: Layout.Content,
        ALayoutFooter: Layout.Footer,
        ALayoutSider: Layout.Sider,
        AMenu: Menu,
        AMenuItem: Menu.Item,
        AButton: Button,
        AForm: Form,
        AFormItem: Form.Item,
        AInput: Input,
        ASelect: Select,
        ASelectOption: Select.Option,
        ATable: Table,
        ACard: Card,
        ASpace: Space,
        ARow: Row,
        ACol: Col,
        ATag: Tag,
        ABadge: Badge,
        AModal: Modal,
        ATypographyTitle: Typography.Title,
        ATypographyText: Typography.Text,
        // 图标
        HomeOutlined,
        UserOutlined,
        SettingOutlined
      },
      setup() {
        // 响应式状态
        const count = ref(0);
        const formState = reactive({ username: '', password: '' });

        // 方法
        const handleSubmit = () => {
          console.log(formState);
        };

        return {
          count,
          formState,
          handleSubmit
        };
      },
      template: `
        <a-config-provider>
          <!-- 页面 HTML 模板 -->
        </a-config-provider>
      `
    });

    app.use(antd);
    app.mount('#app');
  </script>
</body>
</html>
```

## 重要：Vue 模板写法规范

### 组件命名
- Vue 中 antd 组件使用 kebab-case：`<a-button>`、`<a-table>`、`<a-form-item>`
- 或注册为大驼峰然后用 PascalCase：`<AButton>`

### 常用指令
```html
<!-- 条件渲染 -->
<div v-if="visible">显示内容</div>
<div v-else>隐藏时显示</div>

<!-- 列表渲染 -->
<a-list-item v-for="item in items" :key="item.id">{{ item.name }}</a-list-item>

<!-- 事件绑定 -->
<a-button @click="handleClick">点击</a-button>

<!-- 双向绑定 -->
<a-input v-model:value="formState.username" />
<a-select v-model:value="formState.status" />
<a-checkbox v-model:checked="formState.agree" />
```

### 表格配置
```javascript
const columns = ref([
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '状态', dataIndex: 'status', key: 'status',
    customRender: ({ text }) => h(Tag, { color: text === '启用' ? 'green' : 'red' }, () => text)
  }
]);
const dataSource = ref([
  { key: '1', name: '张三', status: '启用' }
]);
```

### 表单验证
```javascript
const formRef = ref();
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
};

const onSubmit = () => {
  formRef.value.validate().then(values => {
    console.log('验证通过:', values);
  });
};
```

## ant-design-vue v4 注意事项
- `visible` 属性已废弃，改用 `open`
- `v-model:value` 用于 Input/Select 等表单控件
- `v-model:checked` 用于 Checkbox/Switch
- `v-model:open` 用于 Modal/Drawer 的显示控制
- `h()` 函数在 template 中不可直接用，需在 setup() 返回渲染函数或用 customRender
