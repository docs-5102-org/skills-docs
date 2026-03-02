---
name: fastapi
description: >
  基于本项目 python-rules 规范的 FastAPI 全栈开发技能。
  触发场景：新增/修改 API 路由、SQLModel 数据库模型、CRUD 操作、统一响应封装、
  路由注册、后台任务与日志、前端 HTML 模板、pytest 接口测试。
  凡涉及 app/api、app/models、app/schemas、app/service、tests 目录的开发均应加载本技能。
---

# FastAPI 项目开发技能

> **使用说明**：本文件是自包含的技能文档，包含所有必要的代码模板和规则。
> 开发时请优先参照本文件中的代码片段，无需查阅其他外部文件。

---

## 一、项目结构速查

```
app/
├── api/            # 路由层：每个业务一个文件，__init__.py 统一注册
│   └── __init__.py
├── core/
│   ├── config.py       # 系统配置（Settings）
│   ├── response.py     # 统一响应：success / fail / html_response
│   ├── crud.py         # CRUDBase 通用模板
│   ├── redis.py        # Redis 客户端
│   └── database/
│       └── db_manager.py  # DbSessionDep, get_db_session
├── models/         # SQLModel 表模型
├── schemas/        # 纯 Pydantic 请求/响应模型（复杂场景）
├── service/        # 复杂业务逻辑
├── middleware/     # 中间件
├── utils/          # 工具函数
templates/          # Jinja2 HTML 模板
static/             # 静态资源
tests/
└── test_base.py    # TestBase 基类
logs/tasks/         # 任务日志文件 {task_id}.log
```

---

## 二、核心导入速查

```python
# 数据库会话（依赖注入，接口第一个参数）
from app.core.database.db_manager import DbSessionDep, get_db_session

# 统一响应
from app.core.response import success, fail, html_response, html_response_welcome

# CRUD 基类
from app.core.crud import CRUDBase

# 模型基类与主键 Mixin
from app.models.base import BaseSqlModel, IntIDMixin, UUIDIDHexMixin, StrMixin

# 任务日志
from app.utils.task_log import task_log_manager, task_logging_context
```

---

## 三、API 路由模板

### 3.1 标准 CRUD 路由

```python
"""
Product API 模块
功能：Product 的增删改查与列表。
"""
from typing import Annotated
from fastapi import APIRouter, Query
from sqlmodel import select

from ..core.database.db_manager import DbSessionDep
from ..core.response import success, fail
from ..core.crud import CRUDBase
from ..dependencies import get_route_dependencies
from ..models.product import Product, ProductQo

router = APIRouter(
    prefix="/products",
    tags=["Product"],
    dependencies=[*get_route_dependencies()],
)

product_crud = CRUDBase[Product, int](Product)


@router.post("/", summary="创建 Product")
def create_product(qo: ProductQo, session: DbSessionDep):
    """
    创建新 Product。
    - **qo**: 创建参数
    - 返回: 创建后的对象
    """
    obj = Product(**qo.model_dump(exclude_unset=True))
    created = product_crud.create(session, obj)
    return success(data=created.model_dump(mode="json"))


@router.get("/", summary="Product 列表")
def list_products(
    session: DbSessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 20,
):
    """分页获取 Product 列表。"""
    stmt = select(Product).offset(offset).limit(limit)
    items = session.exec(stmt).all()
    return success(data=[m.model_dump(mode="json") for m in items])


@router.get("/{product_id}", summary="Product 详情")
def get_product(product_id: int, session: DbSessionDep):
    """根据 ID 获取单条 Product。"""
    obj = product_crud.read(session, product_id)
    if not obj:
        return fail(msg="记录不存在")
    return success(data=obj.model_dump(mode="json"))


@router.put("/{product_id}", summary="更新 Product")
def update_product(product_id: int, qo: ProductQo, session: DbSessionDep):
    """更新 Product 字段。"""
    obj = product_crud.update(
        session, product_id, Product(**qo.model_dump(exclude_unset=True))
    )
    return success(data=obj.model_dump(mode="json"))


@router.delete("/{product_id}", summary="删除 Product")
def delete_product(product_id: int, session: DbSessionDep):
    """软删除或物理删除 Product。"""
    product_crud.delete(session, product_id)
    return success(data=None)
```

### 3.2 路由注册（app/api/\_\_init\_\_.py）

```python
from fastapi import APIRouter
from . import product, order  # 按需引入

v1_router = APIRouter(prefix="/api/v1")
v1_router.include_router(product.router)
v1_router.include_router(order.router)
```

### 3.3 路径冲突规避

```python
# ❌ 错误：/ui 会被 /{product_id} 匹配
router.get("/ui")
router.get("/{product_id}")

# ✅ 正确：用独立前缀区分静态路径与动态路径
router.get("/web/ui")       # 静态页面
router.get("/{product_id}") # 动态参数
```

---

## 四、SQLModel 模型模板

### 4.1 整数主键（最常用）

```python
"""
Product 模型
"""
from datetime import datetime
from pydantic import BaseModel, Field, field_serializer
from sqlmodel import Field as SqlField, String, Integer, Text

from app.models.base import BaseSqlModel, IntIDMixin


class Product(BaseSqlModel, IntIDMixin, table=True):
    """Product 表模型"""
    __tablename__ = "product"
    __table_args__ = {"comment": "产品表"}

    name: str = SqlField(
        sa_type=String(100),
        sa_column_kwargs={"index": True, "nullable": False, "comment": "产品名称"},
    )
    status: int = SqlField(
        sa_type=Integer,
        sa_column_kwargs={"default": 0, "nullable": False, "comment": "状态 0=正常"},
    )
    description: str | None = SqlField(
        default=None,
        sa_type=Text,
        sa_column_kwargs={"nullable": True, "comment": "描述"},
    )

    # 继承 BaseSqlModel 已有 created_at / updated_at / deleted_at 及序列化
    model_config = {"from_attributes": True}


class ProductQo(BaseModel):
    """Product 创建/更新参数"""
    name: str | None = Field(default=None, description="产品名称")
    status: int | None = Field(default=None, ge=0, description="状态")
    description: str | None = Field(default=None, description="描述")

    model_config = {
        "from_attributes": True,
        "json_schema_extra": {"example": {"name": "示例产品", "status": 0}},
    }
```

### 4.2 UUID 主键

```python
from app.models.base import BaseSqlModel, UUIDIDHexMixin

class Order(BaseSqlModel, UUIDIDHexMixin, table=True):
    __tablename__ = "order"
    __table_args__ = {"comment": "订单表"}
    # ... 字段定义同上
```

### 4.3 字符串主键

```python
from app.models.base import BaseSqlModel, StrMixin

class Config(BaseSqlModel, StrMixin, table=True):
    __tablename__ = "config"
    __table_args__ = {"comment": "配置表"}
```

### 4.4 日期字段序列化（BaseSqlModel 未覆盖时手动添加）

```python
from pydantic import field_serializer

@field_serializer("created_at", "updated_at", "completed_at", when_used="json")
def serialize_datetime(self, value: datetime | None) -> str | None:
    if value is None:
        return None
    return value.strftime("%Y/%m/%d %H:%M:%S")
```

### 4.5 模型序列化规则

```python
# ✅ 单条记录
return success(data=obj.model_dump(mode="json"))

# ✅ 列表记录
return success(data=[m.model_dump(mode="json") for m in items])

# ❌ 不要直接传 SQLModel 对象，会触发 JSON 序列化错误
return success(data=obj)
```

---

## 五、CRUD 基类用法

```python
from app.core.crud import CRUDBase
from app.models.product import Product

# 初始化（文件级别，不要放在函数内）
product_crud = CRUDBase[Product, int](Product)

# 创建
created = product_crud.create(session, Product(name="test"))

# 查询单条（不存在返回 None 或抛异常，视实现而定）
obj = product_crud.read(session, product_id)

# 更新（传入包含新值的实例）
updated = product_crud.update(session, product_id, Product(name="new"))

# 物理删除
product_crud.delete(session, product_id)

# 软删除（设置 deleted_at）
product_crud.soft_delete(session, product_id)
```

> **注意**：`session` 由 FastAPI 依赖注入传入，CRUD 方法内部不再 `with session` 包裹。

---

## 六、统一响应格式

```python
from app.core.response import success, fail

# 成功响应
return success(data={"id": 1, "name": "test"})
# → {"code": 0, "msg": "ok", "data": {...}}

# 失败响应
return fail(msg="参数错误")
# → {"code": -1, "msg": "参数错误", "data": null}

# 自定义错误码
return fail(code=404, msg="记录不存在")
```

---

## 七、前端页面模板

### 7.1 欢迎页 HTML（配合 html_response_welcome）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
</head>
<body class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white"
      x-data="{ loaded: false }" x-init="loaded = true">
    <div class="container mx-auto px-4 py-12 max-w-4xl">
        <h1 class="text-4xl font-bold mb-4 animate__animated"
            :class="loaded && 'animate__fadeInDown'">
            {{ title }}
        </h1>
        <p class="text-lg text-slate-300 mb-8 animate__animated"
           :class="loaded && 'animate__fadeIn'">
            {{ subtitle }}
        </p>
        <div class="flex gap-4">
            <a href="/docs"
               class="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition">
                API 文档
            </a>
        </div>
    </div>
</body>
</html>
```

### 7.2 路由返回 HTML

```python
from app.core.response import html_response, html_response_welcome
from fastapi import APIRouter
from fastapi.responses import HTMLResponse

router = APIRouter(prefix="/web", tags=["前端页面"])

@router.get("/ui", response_class=HTMLResponse)
def welcome_page():
    """欢迎页"""
    return html_response_welcome(title="My App", subtitle="API 服务已就绪")
```

**前端技术栈规范**：
- 样式：Tailwind CSS（CDN）
- 交互：Alpine.js（CDN，`x-data` / `x-init` / `@click` / `x-show`）
- 动画：Animate.css（CDN，配合 Alpine.js 动态绑定 class）
- 响应式：优先 mobile-first，使用 `sm:` / `md:` / `lg:` 断点

---

## 八、任务与日志

### 8.1 任务模型字段标准

```python
class Task(BaseSqlModel, UUIDIDHexMixin, table=True):
    __tablename__ = "task"

    name: str = SqlField(sa_type=String(200), sa_column_kwargs={"comment": "任务名"})
    status: str = SqlField(
        sa_type=String(20),
        sa_column_kwargs={"default": "pending", "comment": "状态: pending/running/completed/failed"},
    )
    error_message: str | None = SqlField(
        default=None, sa_type=Text, sa_column_kwargs={"comment": "错误信息"}
    )
    completed_at: datetime | None = SqlField(
        default=None, sa_column_kwargs={"comment": "完成时间"}
    )
```

**状态值**：`pending`（等待）/ `running`（运行中）/ `completed`（完成）/ `failed`（失败）

### 8.2 任务日志使用

```python
from app.utils.task_log import task_logging_context

async def run_task(task_id: str):
    with task_logging_context(task_id) as task_logger:
        task_logger.info("✅ 任务开始")
        try:
            # 执行业务逻辑
            result = do_something()
            task_logger.info(f"✅ 步骤完成: {result}")
        except Exception as e:
            task_logger.error(f"❌ 任务失败: {e}")
            raise
        task_logger.info("✅ 任务结束")
```

日志文件路径：`logs/tasks/{task_id}.log`，单文件最大 50MB，保留 3 个备份。

---

## 九、测试模板

```python
"""
Product API 测试
"""
import pytest
from fastapi.testclient import TestClient

from app.core.database.db_manager import get_db_session
from app.app_factory import create_app
from tests.test_base import TestBase


class TestProductApi(TestBase):
    """Product 接口测试"""

    @pytest.fixture
    def client(self, headers):
        app = create_app()
        app.dependency_overrides[get_db_session] = self.get_db  # 注入 SQLite 内存库
        with TestClient(app, headers=headers) as c:
            yield c

    def test_list_products(self, client: TestClient):
        r = client.get("/api/v1/products/")
        assert r.status_code == 200
        body = r.json()
        assert body["code"] == 0
        assert isinstance(body["data"], list)

    def test_create_and_get(self, client: TestClient):
        # 创建
        r = client.post("/api/v1/products/", json={"name": "测试产品", "status": 0})
        assert r.status_code == 200
        pid = r.json()["data"]["id"]

        # 查询
        r = client.get(f"/api/v1/products/{pid}")
        assert r.status_code == 200
        assert r.json()["data"]["name"] == "测试产品"

    def test_update(self, client: TestClient):
        r = client.post("/api/v1/products/", json={"name": "旧名"})
        pid = r.json()["data"]["id"]
        r = client.put(f"/api/v1/products/{pid}", json={"name": "新名"})
        assert r.json()["data"]["name"] == "新名"

    def test_delete(self, client: TestClient):
        r = client.post("/api/v1/products/", json={"name": "待删除"})
        pid = r.json()["data"]["id"]
        r = client.delete(f"/api/v1/products/{pid}")
        assert r.json()["code"] == 0
```

---

## 十、错误处理规范

```python
# 数据库写操作必须 try/except + 回滚
@router.post("/")
def create_item(qo: ItemQo, session: DbSessionDep):
    try:
        obj = Item(**qo.model_dump(exclude_unset=True))
        session.add(obj)
        session.commit()
        session.refresh(obj)
        return success(data=obj.model_dump(mode="json"))
    except Exception as e:
        session.rollback()
        return fail(msg=f"❌ 创建失败: {str(e)}")

# 外部调用（HTTP、文件IO）必须 try/except
try:
    result = external_api_call()
except Exception as e:
    logger.error(f"❌ 外部调用失败: {e}")
    raise
```

---

## 十一、开发清单（新增业务功能时逐项检查）

- [ ] `app/models/<name>.py` — 定义 SQLModel 表模型 + Qo
- [ ] `app/api/<name>.py` — 定义 APIRouter，实现各接口
- [ ] `app/api/__init__.py` — `include_router` 注册路由
- [ ] 接口响应统一用 `success()` / `fail()`，数据用 `model_dump(mode='json')`
- [ ] 路由无路径冲突（`/web/ui` 与 `/{id}` 等）
- [ ] 数据库写操作有 try/except + rollback
- [ ] `tests/test_<name>.py` — 覆盖增删改查主流程

---

## 十二、脚手架脚本（可选，从项目根目录执行）

```bash
# 生成 API 模块骨架
python .cursor/skills/fastapi/scripts/new_api.py <模块名> [--path=/xxx]
# 示例：python .cursor/skills/fastapi/scripts/new_api.py product --path=/products

# 生成 SQLModel 模型骨架
python .cursor/skills/fastapi/scripts/new_model.py <ModelName> [--id-type=int|uuid|str]
# 示例：python .cursor/skills/fastapi/scripts/new_model.py Product --id-type=int
```

> 脚手架生成的是骨架代码，仍需根据业务补充字段与逻辑。