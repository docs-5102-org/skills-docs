# HTML + Angular + NG-ZORRO 实现指南

> ⚠️ **注意**：Angular 的 UMD 单文件 HTML 模式**限制较多**，不适合复杂交互。
> 若用户需要复杂项目，建议说明 Angular 更适合 CLI 脚手架开发，并询问是否改用 React 或 Vue 方案。

## CDN 引入（固定版本，必须按顺序）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>页面标题</title>
  <link rel="stylesheet" href="https://unpkg.com/ng-zorro-antd/ng-zorro-antd.min.css">
  <style>
    /* 自定义样式 */
  </style>
</head>
<body>
  <app-root></app-root>

  <script src="https://unpkg.com/zone.js/dist/zone.js"></script>
  <script src="https://unpkg.com/rxjs/dist/bundles/rxjs.umd.js"></script>
  <script src="https://unpkg.com/@angular/core@16/bundles/core.umd.js"></script>
  <script src="https://unpkg.com/@angular/common@16/bundles/common.umd.js"></script>
  <script src="https://unpkg.com/@angular/compiler@16/bundles/compiler.umd.js"></script>
  <script src="https://unpkg.com/@angular/platform-browser@16/bundles/platform-browser.umd.js"></script>
  <script src="https://unpkg.com/@angular/platform-browser-dynamic@16/bundles/platform-browser-dynamic.umd.js"></script>
  <script src="https://unpkg.com/@angular/forms@16/bundles/forms.umd.js"></script>
  <script src="https://unpkg.com/ng-zorro-antd/bundles/ng-zorro-antd.umd.js"></script>

  <script>
    const ng = window.ng;
    const { Component, NgModule, OnInit } = ng.core;
    const { BrowserModule } = ng.platformBrowser;
    const { FormsModule, ReactiveFormsModule, FormBuilder, Validators } = ng.forms;
    const { platformBrowserDynamic } = ng.platformBrowserDynamic;

    // 解构 NG-ZORRO 模块
    const NzModule = window['ng-zorro-antd'];

    @Component({
      selector: 'app-root',
      template: `
        <nz-layout>
          <nz-header>
            <span class="logo">Logo</span>
            <ul nz-menu nzTheme="dark" nzMode="horizontal">
              <li nz-menu-item nzSelected>首页</li>
              <li nz-menu-item>关于</li>
            </ul>
          </nz-header>
          <nz-content style="padding: 24px">
            <!-- 内容 -->
            <nz-card nzTitle="卡片标题">
              <p>内容</p>
              <button nz-button nzType="primary" (click)="handleClick()">主要按钮</button>
            </nz-card>
          </nz-content>
          <nz-footer>页脚 ©2024</nz-footer>
        </nz-layout>
      `
    })
    class AppComponent {
      title = '应用名称';

      handleClick() {
        console.log('按钮点击');
      }
    }

    @NgModule({
      declarations: [AppComponent],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        NzModule.NzLayoutModule,
        NzModule.NzMenuModule,
        NzModule.NzButtonModule,
        NzModule.NzCardModule,
        NzModule.NzTableModule,
        NzModule.NzFormModule,
        NzModule.NzInputModule,
        NzModule.NzSelectModule,
        NzModule.NzModalModule,
        NzModule.NzMessageModule,
        NzModule.NzTagModule,
        NzModule.NzBadgeModule,
        NzModule.NzDividerModule,
        NzModule.NzSpaceModule,
        NzModule.NzGridModule,
        NzModule.NzTypographyModule,
        NzModule.NzStatisticModule,
        NzModule.NzProgressModule,
      ],
      bootstrap: [AppComponent]
    })
    class AppModule {}

    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err));
  </script>
</body>
</html>
```

## NG-ZORRO 常用组件写法

### 按钮
```html
<button nz-button nzType="primary">主要</button>
<button nz-button nzType="default">默认</button>
<button nz-button nzType="dashed">虚线</button>
<button nz-button nzType="text">文本</button>
<button nz-button nzType="link">链接</button>
<button nz-button nzDanger>危险</button>
```

### 表格
```html
<nz-table #basicTable [nzData]="tableData">
  <thead>
    <tr>
      <th>姓名</th>
      <th>年龄</th>
      <th>操作</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let item of basicTable.data">
      <td>{{ item.name }}</td>
      <td>{{ item.age }}</td>
      <td>
        <a (click)="edit(item)">编辑</a>
        <nz-divider nzType="vertical"></nz-divider>
        <a nz-popconfirm nzPopconfirmTitle="确认删除？" (nzOnConfirm)="delete(item)">删除</a>
      </td>
    </tr>
  </tbody>
</nz-table>
```

### 表单（响应式）
```typescript
// 在 Component 类中
constructor(private fb: FormBuilder) {}

ngOnInit() {
  this.validateForm = this.fb.group({
    username: [null, [Validators.required]],
    password: [null, [Validators.required]]
  });
}

submitForm() {
  if (this.validateForm.valid) {
    console.log(this.validateForm.value);
  }
}
```

```html
<form nz-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
  <nz-form-item>
    <nz-form-label [nzSpan]="6" nzRequired>用户名</nz-form-label>
    <nz-form-control [nzSpan]="14" nzErrorTip="请输入用户名">
      <input nz-input formControlName="username" placeholder="请输入">
    </nz-form-control>
  </nz-form-item>
  <nz-form-item>
    <nz-form-control [nzSpan]="14" [nzOffset]="6">
      <button nz-button nzType="primary" [disabled]="!validateForm.valid">提交</button>
    </nz-form-control>
  </nz-form-item>
</form>
```

## Angular 装饰器语法说明
- 使用 Babel 转译时，需确保 `@Component`、`@NgModule` 等装饰器语法被正确处理
- 若浏览器不支持装饰器，推荐改用 React 或 Vue 方案避免编译问题
