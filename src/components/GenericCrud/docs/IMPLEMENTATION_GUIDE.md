# GenericCrud 通用实体组件完整实现指南

## 目录
- [1. 组件概述](#1-组件概述)
- [2. 架构设计](#2-架构设计)
- [3. 核心概念](#3-核心概念)
- [4. 参数详解](#4-参数详解)
- [5. 实现逻辑](#5-实现逻辑)
- [6. 工具函数](#6-工具函数)
- [7. 使用示例](#7-使用示例)
- [8. 高级配置](#8-高级配置)

---

## 1. 组件概述

### 1.1 组件简介
`GenericCrud` 是一个高度可配置的通用 CRUD（增删改查）组件，基于 Ant Design Pro Components 构建。它通过动态获取实体字段信息，自动生成表格和表单，极大地简化了 CRUD 功能的开发。

### 1.2 核心特性

- **动态模式**：通过 API 自动获取实体字段信息，自动生成表格列和表单字段
- **静态模式**：手动配置列和表单字段，完全自定义
- **自动类型映射**：Java 类型自动映射到前端组件类型
- **关联实体支持**：自动处理外键关联，生成下拉选择器
- **枚举值支持**：自动识别枚举类型，生成下拉选择器
- **UI/UX 优化**：Glassmorphism 设计风格，流畅的动画过渡
- **权限控制**：内置权限检查机制
- **高度可定制**：支持自定义渲染、回调函数、表单组件等

### 1.3 文件结构

```
src/components/GenericCrud/
├── GenericCrud.tsx              # 主组件
├── types.ts                     # 类型定义
├── styles.css                   # 样式文件
├── index.ts                     # 导出文件
├── components/
│   ├── DynamicForm.tsx          # 动态表单组件
│   ├── CreateModal.tsx          # 新建弹窗
│   ├── UpdateModal.tsx          # 编辑弹窗
│   └── RelationSelect.tsx       # 关联实体选择器
├── utils/
│   ├── entityFieldMapper.ts     # 实体字段映射器
│   ├── formHelper.ts            # 表单辅助工具
│   └── columnsHelper.ts         # 列辅助工具
└── docs/                        # 文档目录
```

---

## 2. 架构设计

### 2.1 组件层次结构

```
GenericCrud (主组件)
├── ProTable (表格)
│   ├── 搜索表单
│   ├── 工具栏
│   └── 数据表格
│       ├── 列（自动生成或手动配置）
│       └── 操作列
├── CreateModal (新建弹窗)
│   └── DynamicForm / CustomForm
├── UpdateModal (编辑弹窗)
│   └── DynamicForm / CustomForm
└── 状态管理
    ├── 表格数据状态
    ├── 弹窗显示状态
    ├── 加载状态
    └── 动态字段状态
```

### 2.2 数据流

```
用户操作
   ↓
事件处理函数 (handleCreate, handleEdit, handleDelete)
   ↓
API 调用 (genericEntity 服务)
   ↓
后端批处理接口 (/api/batch)
   ↓
状态更新 (actionRef.reload)
   ↓
UI 重新渲染
```

---

## 3. 核心概念

### 3.1 动态模式 vs 静态模式

#### 动态模式
```typescript
// 通过 dynamicEntity 配置，自动从后端获取字段信息
<GenericCrud
  dynamicEntity={{
    entityClassName: 'WqUser',
    entityName: 'wquser',
    excludeFields: ['password'],
    fieldOverrides: { ... },
    relations: { ... },
    dataField: 'data'
  }}
/>
```

**工作流程**：
1. 调用 `/api/entity/fields/{className}` 获取实体字段信息
2. 自动生成 ProTable 列配置
3. 自动生成表单字段配置
4. 自动配置 CRUD 操作

#### 静态模式
```typescript
// 手动配置列和表单字段
<GenericCrud
  columns={columns}
  formFields={formFields}
  crudOperations={crudOperations}
/>
```

### 3.2 实体字段信息 (EntityFieldInfo)

后端返回的字段信息格式：

```typescript
interface EntityFieldInfo {
  [fieldName: string]: {
    type: string;              // 字段类型（如 "String"）
    typeName?: string;         // 完整类型名（如 "java.lang.String"）
    description?: string;      // 字段描述
    enumValues?: any[] | Record<string, string>;  // 枚举值
    enumType?: string;         // 枚举类型
  };
}
```

### 3.3 类型映射机制

Java 类型 → ProTable valueType：

| Java 类型 | valueType | 说明 |
|-----------|-----------|------|
| String | text | 文本输入 |
| Integer, Long | digit | 数字输入 |
| Boolean | switch | 开关 |
| Date, DateTime | dateTime | 日期时间选择器 |
| BigDecimal | money | 金额输入 |
| Text | textarea | 多行文本 |

---

## 4. 参数详解

### 4.1 GenericCrudConfig 完整参数

```typescript
interface GenericCrudConfig<T = any> {
  // ===== 动态模式 =====
  dynamicEntity?: DynamicEntityConfig;

  // ===== 基础配置 =====
  rowKey?: string;
  headerTitle?: string;

  // ===== 静态模式 =====
  columns?: ProColumns<T>[];
  formFields?: FormFieldConfig[];
  crudOperations?: CrudOperations<T>;

  // ===== 自定义配置 =====
  customFormComponents?: CustomFormComponents;
  features?: FeatureConfig;
  ui?: UIConfig;
  permissions?: PermissionConfig;

  // ===== 自定义渲染 =====
  renderItemActions?: (record: T, actions: ActionContext<T>) => ReactNode;
  renderToolbar?: (actions: ToolbarContext) => ReactNode;

  // ===== 回调函数 =====
  callbacks?: CallbackConfig;

  // ===== 表单默认值 =====
  data?: Record<string, any>;
}
```

---

### 4.2 动态实体配置 (dynamicEntity)

```typescript
interface DynamicEntityConfig {
  // ===== 必填 =====
  entityClassName: string;      // 实体类名（如：WqUser）
  entityName: string;           // 实体名称（小写，如：wquser）

  // ===== 可选 =====
  excludeFields?: string[];     // 排除的字段
  fieldOverrides?: FieldOverrideConfig;  // 字段覆盖配置
  relations?: { [fieldName: string]: RelationConfig };  // 关联实体配置
  dataField?: string;           // 数据包装字段
}
```

#### 参数说明

**entityClassName**
- **类型**：`string`
- **必填**：是
- **说明**：Java 实体类的完整类名
- **示例**：`'WqUser'`, `'Community'`, `'Order'`
- **用途**：用于调用 `/api/entity/fields/{className}` 获取字段信息

**entityName**
- **类型**：`string`
- **必填**：是
- **说明**：实体名称，通常是小写形式
- **示例**：`'wquser'`, `'community'`, `'order'`
- **用途**：用于 CRUD 操作的 API 调用

**excludeFields**
- **类型**：`string[]`
- **必填**：否
- **默认值**：`[]`
- **说明**：需要排除的字段列表
- **示例**：`['password', 'openid', 'serialVersionUID']`
- **用途**：某些字段不需要在表格或表单中显示

**fieldOverrides**
- **类型**：`FieldOverrideConfig`
- **必填**：否
- **说明**：字段覆盖配置，用于自定义特定字段的显示和验证
- **示例**：
```typescript
{
  name: {
    label: '用户名称',
    required: true,
    rules: [
      { required: true, message: '请输入用户名称' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符' }
    ]
  },
  avatar: {
    render: ({ value, onChange }) => (
      <ImageUpload value={value} onChange={onChange} />
    )
  }
}
```

**relations**
- **类型**：`{ [fieldName: string]: RelationConfig }`
- **必填**：否
- **说明**：关联实体配置，用于处理外键关联
- **示例**：
```typescript
{
  community: {
    entityClassName: 'Community',
    entityName: 'community',
    displayField: 'name',
    valueField: '_id',
    multiple: false
  }
}
```

**dataField**
- **类型**：`string`
- **必填**：否
- **说明**：数据包装字段，所有表单字段包装到该属性中
- **示例**：`'data'`
- **用途**：
  - 提交时：`{ name: "张三" }` → `{ data: { name: "张三" } }`
  - 编辑时：从 `record.data` 中提取值作为初始值

---

### 4.3 基础配置参数

**rowKey**
- **类型**：`string`
- **默认值**：`'id'`
- **说明**：表格行的唯一标识字段
- **示例**：`'_id'`, `'id'`, `'userId'`

**headerTitle**
- **类型**：`string`
- **默认值**：`'列表'`
- **说明**：表格标题
- **示例**：`'用户管理'`, `'商品列表'`

---

### 4.4 静态模式参数

**columns**
- **类型**：`ProColumns<T>[]`
- **必填**：否（动态模式下自动生成）
- **说明**：ProTable 列配置
- **示例**：
```typescript
const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    valueType: 'text',
    sorter: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    valueType: 'select',
    valueEnum: {
      0: { text: '禁用' },
      1: { text: '启用' },
    },
  },
];
```

**formFields**
- **类型**：`FormFieldConfig[]`
- **必填**：否
- **说明**：表单字段配置，优先级高于 columns
- **示例**：
```typescript
const formFields = [
  {
    name: 'username',
    label: '用户名',
    valueType: 'text',
    required: true,
    rules: [
      { required: true, message: '请输入用户名' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符' },
    ],
  },
];
```

**crudOperations**
- **类型**：`CrudOperations<T>`
- **必填**：否（动态模式下自动生成）
- **说明**：CRUD 操作函数
- **示例**：
```typescript
const crudOperations = {
  list: async (params, sort) => {
    const { data, total } = await queryEntity('wquser', params);
    return { data, success: true, total };
  },
  create: async (data) => {
    return await createEntity('wquser', data);
  },
  update: async (id, data) => {
    return await updateEntity('wquser', id, data);
  },
  delete: async (id) => {
    return await deleteEntity('wquser', id);
  },
};
```

---

### 4.5 自定义配置参数

**customFormComponents**
- **类型**：`CustomFormComponents`
- **说明**：自定义表单组件
- **示例**：
```typescript
{
  create: MyCreateForm,
  update: MyUpdateForm,
}
```

**features**
- **类型**：`FeatureConfig`
- **说明**：功能开关配置
- **示例**：
```typescript
{
  create: true,       // 显示新建按钮
  update: true,       // 显示编辑按钮
  delete: true,       // 显示删除按钮
  batchDelete: true,  // 显示批量删除按钮
  selection: true,    // 显示复选框
  export: false,      // 显示导出按钮
}
```

**ui**
- **类型**：`UIConfig`
- **说明**：UI 配置
- **示例**：
```typescript
{
  search: {
    labelWidth: 80,
    span: 6,
    collapsed: false,
  },
  table: {
    size: 'middle',
    scroll: { x: 'max-content' },
  },
  createModal: {
    title: '新建用户',
    width: 800,
  },
  updateModal: {
    title: '编辑用户',
    width: 800,
  },
}
```

**permissions**
- **类型**：`PermissionConfig`
- **说明**：权限控制
- **示例**：
```typescript
{
  create: true,           // 布尔值：直接控制
  update: 'user:update',  // 字符串：权限码（需集成权限系统）
  delete: 'user:delete',
}
```

---

### 4.6 自定义渲染参数

**renderItemActions**
- **类型**：`(record: T, actions: ActionContext<T>) => ReactNode`
- **说明**：自定义操作列渲染
- **示例**：
```typescript
renderItemActions={(record, { handleEdit, handleDelete }) => (
  <Space>
    <Button onClick={() => handleEdit()}>编辑</Button>
    <Button onClick={() => handleDelete()}>删除</Button>
    <Button onClick={() => console.log(record)}>查看</Button>
  </Space>
)}
```

**renderToolbar**
- **类型**：`(actions: ToolbarContext) => ReactNode`
- **说明**：自定义工具栏渲染
- **示例**：
```typescript
renderToolbar={({ handleCreate, handleBatchDelete, selectedRows }) => (
  <Space>
    <Button type="primary" onClick={handleCreate}>新建</Button>
    <Button danger onClick={handleBatchDelete} disabled={selectedRows.length === 0}>
      批量删除 ({selectedRows.length})
    </Button>
  </Space>
)}
```

---

### 4.7 回调函数参数

**callbacks**
- **类型**：`CallbackConfig`
- **说明**：生命周期回调
- **示例**：
```typescript
{
  onCreateSuccess: () => {
    message.success('创建成功');
  },
  onUpdateSuccess: () => {
    message.success('更新成功');
  },
  onDeleteSuccess: () => {
    message.success('删除成功');
  },
  onError: (error, operation) => {
    console.error(`${operation} 失败:`, error);
  },
}
```

---

### 4.8 表单默认值参数

**data**
- **类型**：`Record<string, any>`
- **说明**：新建表单的默认值
- **示例**：
```typescript
{
  status: 1,
  enabled: true,
  roleId: 'admin',
}
```

---

## 5. 实现逻辑

### 5.1 初始化流程

```
组件挂载
   ↓
检查是否配置了 dynamicEntity
   ↓
   ├─ 是：调用 getEntityFields(dynamicEntity.entityClassName)
   │     ↓
   │   获取实体字段信息
   │     ↓
   │   convertEntityFieldsToColumns() → 生成列配置
   │   convertEntityFieldsToFormFields() → 生成表单配置
   │     ↓
   │   设置 generatedColumns 和 generatedFormFields
   │
   └─ 否：直接使用 columns 和 formFields
```

### 5.2 列配置生成逻辑

```typescript
// 文件：utils/entityFieldMapper.ts

export function convertEntityFieldsToColumns(
  entityFields: EntityFieldInfo,
  excludeFields: string[],
  fieldOverrides?: FieldOverrideConfig,
  relations?: { [fieldName: string]: RelationConfig },
): ProColumns[] {
  // 1. 遍历实体字段
  Object.entries(entityFields).forEach(([fieldName, fieldInfo]) => {
    // 2. 排除指定字段
    if (excludeFields.includes(fieldName)) return;

    // 3. 排除复杂对象类型（非关联字段）
    if (!isRelation && isComplexType(fullTypeName)) return;

    // 4. 排除序列化版本号
    if (fieldName === 'serialVersionUID') return;

    // 5. 映射字段类型
    const valueType = mapFieldTypeToValueType(actualTypeName);

    // 6. 生成标题
    const title = description || fieldNameToTitle(fieldName);

    // 7. 应用字段覆盖
    if (fieldOverrides?.[fieldName]) {
      // 合并配置
    }

    // 8. 特殊字段处理
    if (fieldName === 'avatar') {
      column.valueType = 'image';
      column.render = ... // 图片渲染
    }
    if (fieldName === 'gender') {
      column.valueType = 'select';
      column.valueEnum = { 1: { text: '男' }, 2: { text: '女' } };
    }
    if (enumValues) {
      column.valueEnum = convertEnumValuesToValueEnum(enumValues);
    }
    if (isRelation) {
      column.render = ... // 关联对象渲染
    }

    // 9. 添加到列数组
    columns.push(column);
  });

  return columns;
}
```

### 5.3 表单字段生成逻辑

```typescript
export function convertEntityFieldsToFormFields(
  entityFields: EntityFieldInfo,
  excludeFields: string[],
  fieldOverrides?: FieldOverrideConfig,
  relations?: { [fieldName: string]: RelationConfig },
): FormFieldConfig[] {
  Object.entries(entityFields).forEach(([fieldName, fieldInfo]) => {
    // 1-6. 同列配置生成逻辑

    // 7. 排除只读字段
    if (fieldName === '_id' || fieldName === 'createTime' || fieldName === 'updateTime') {
      return;
    }

    // 8. 关联字段特殊处理
    if (isRelation) {
      formField.isRelation = true;
      formField.relationConfig = relations[fieldName];
      formField.requestAsync = true; // 标记为异步选择器
    }

    // 9. 应用字段覆盖
    if (fieldOverrides?.[fieldName]) {
      Object.assign(formField, fieldOverrides[fieldName]);
    }

    formFields.push(formField);
  });

  return formFields;
}
```

### 5.4 CRUD 操作逻辑

#### 查询逻辑
```typescript
const requestList = async (params, sort) => {
  // 1. 分离分页参数和查询条件
  const { current, pageSize, ...rest } = params;

  // 2. 转换查询条件：字符串字段使用模糊查询
  const conditions: Record<string, any> = {};
  Object.entries(rest).forEach(([key, value]) => {
    const fieldInfo = entityFields[key];
    const typeName = fieldInfo?.typeName || fieldInfo?.type || '';

    // 字符串类型使用模糊查询
    if (typeName.includes('String')) {
      conditions[key] = { $like: value };
    } else {
      conditions[key] = value;
    }
  });

  // 3. 调用 API
  return queryEntity(dynamicEntity.entityName, {
    current,
    pageSize,
    conditions: Object.keys(conditions).length > 0 ? conditions : undefined,
    sort,
  });
};
```

#### 创建逻辑
```typescript
const handleCreateSubmit = async (values) => {
  // 1. 检查是否配置了 dataField
  let submitData = values;
  if (dynamicEntity?.dataField) {
    // 包装数据
    submitData = {
      [dynamicEntity.dataField]: values,
    };
  }

  // 2. 调用创建 API
  await finalCrudOperations.create(submitData);

  // 3. 关闭弹窗
  setCreateModalVisible(false);

  // 4. 刷新列表
  actionRef?.reload();

  // 5. 触发回调
  if (callbacks.onCreateSuccess) {
    callbacks.onCreateSuccess();
  }
};
```

#### 更新逻辑
```typescript
const handleUpdateSubmit = async (values) => {
  // 1. 检查是否配置了 dataField
  let submitData = values;
  if (dynamicEntity?.dataField) {
    submitData = {
      [dynamicEntity.dataField]: values,
    };
  }

  // 2. 调用更新 API
  await finalCrudOperations.update(currentRecord[rowKey], submitData);

  // 3-5. 同创建逻辑
};
```

#### 删除逻辑
```typescript
const handleDelete = async (id) => {
  // 1. 权限检查
  if (!checkPermission(permissions.delete)) {
    message.warning('您没有删除权限');
    return;
  }

  // 2. 调用删除 API
  await finalCrudOperations.delete(id);

  // 3. 刷新列表
  actionRef?.reload();

  // 4. 触发回调
  if (callbacks.onDeleteSuccess) {
    callbacks.onDeleteSuccess();
  }
};
```

---

## 6. 工具函数

### 6.1 类型映射 (mapFieldTypeToValueType)

```typescript
// 文件：utils/entityFieldMapper.ts

export function mapFieldTypeToValueType(typeName: string): string {
  const typeMap: Record<string, string> = {
    // 字符串类型
    String: 'text',
    'java.lang.String': 'text',

    // 数字类型
    Integer: 'digit',
    Long: 'digit',
    Double: 'digit',

    // 布尔类型
    Boolean: 'switch',

    // 日期时间类型
    Date: 'dateTime',
    LocalDateTime: 'dateTime',
    LocalDate: 'date',

    // 金额类型
    BigDecimal: 'money',

    // 文本类型
    Text: 'textarea',
  };

  return typeMap[typeName] || 'text';
}
```

### 6.2 字段名转换 (fieldNameToTitle)

```typescript
export function fieldNameToTitle(fieldName: string): string {
  const fieldTitleMap: Record<string, string> = {
    id: 'ID',
    name: '名称',
    title: '标题',
    status: '状态',
    createTime: '创建时间',
    updateTime: '更新时间',
    username: '用户名',
    phone: '手机号',
    email: '邮箱',
    avatar: '头像',
    // ... 更多映射
  };

  return fieldTitleMap[fieldName] || fieldName;
}
```

### 6.3 枚举值转换 (convertEnumValuesToValueEnum)

```typescript
function convertEnumValuesToValueEnum(
  enumValues: any[] | Record<string, string> | undefined
): Record<string, any> | undefined {
  if (!enumValues) return undefined;

  // 对象格式: { "0": "报名中", "1": "报名结束" }
  if (!Array.isArray(enumValues)) {
    return Object.entries(enumValues).reduce((acc, [key, value]) => {
      acc[isNaN(Number(key)) ? key : Number(key)] = { text: value };
      return acc;
    }, {});
  }

  // 数组格式: [{ value: 0, label: '报名中' }, ...]
  return enumValues.reduce((acc, item) => {
    if (typeof item === 'object' && item.value !== undefined) {
      acc[item.value] = {
        text: item.label || item.text || item.value,
        status: item.status,
      };
    } else {
      acc[item] = { text: String(item) };
    }
    return acc;
  }, {});
}
```

### 6.4 表单辅助函数 (formHelper)

#### mergeFormFields
```typescript
// 合并表单字段配置，formFields 优先级高于 columns
export function mergeFormFields(
  columns: ProColumns[],
  formFields?: FormFieldConfig[],
): FormFieldConfig[] {
  // 1. 如果没有自定义 formFields，直接从 columns 提取
  if (!formFields || formFields.length === 0) {
    return extractFormFieldsFromColumns(columns);
  }

  // 2. 如果有覆盖标记，完全使用自定义配置
  if (formFields.some((field) => field.__override === true)) {
    return formFields.filter((field) => field.__override !== true);
  }

  // 3. 从 columns 提取默认字段
  const defaultFields = extractFormFieldsFromColumns(columns);

  // 4. 合并配置：formFields 优先
  const mergedFields = defaultFields
    .filter((defaultField) => {
      const customField = formFieldsMap.get(key);
      if (customField && customField.hideInForm) {
        return false; // 隐藏字段
      }
      return true;
    })
    .map((defaultField) => {
      const customField = formFieldsMap.get(key);
      if (customField) {
        return { ...defaultField, ...customField }; // 合并
      }
      return defaultField;
    });

  // 5. 添加新增字段
  formFields.forEach((field) => {
    const exists = defaultFields.some(...);
    if (!exists && !field.hideInForm) {
      mergedFields.push(field);
    }
  });

  return mergedFields;
}
```

#### buildValidationRules
```typescript
// 构建表单验证规则
export function buildValidationRules(field: FormFieldConfig): any[] {
  const rules: any[] = field.rules || [];

  // 如果设置了 required 且没有验证规则，添加默认规则
  if (field.required && rules.length === 0) {
    rules.push({
      required: true,
      message: `请输入${field.label || '该字段'}`,
    });
  }

  return rules;
}
```

---

## 7. 使用示例

### 7.1 最简单的动态模式

```typescript
import { GenericCrud } from '@/components/GenericCrud';

export default function UserList() {
  return (
    <GenericCrud
      headerTitle="用户管理"
      dynamicEntity={{
        entityClassName: 'WqUser',
        entityName: 'wquser',
        excludeFields: ['password', 'openid'],
      }}
      rowKey="_id"
    />
  );
}
```

### 7.2 带字段覆盖的动态模式

```typescript
export default function UserList() {
  return (
    <GenericCrud
      headerTitle="用户管理"
      dynamicEntity={{
        entityClassName: 'WqUser',
        entityName: 'wquser',
        excludeFields: ['password', 'openid'],
        fieldOverrides: {
          username: {
            label: '用户名称',
            required: true,
            rules: [
              { required: true, message: '请输入用户名称' },
              { min: 2, max: 20, message: '长度在 2 到 20 个字符' },
            ],
          },
          avatar: {
            render: ({ value, onChange }) => (
              <ImageUpload value={value} onChange={onChange} />
            ),
          },
        },
      }}
      rowKey="_id"
    />
  );
}
```

### 7.3 带关联实体的动态模式

```typescript
export default function ActivityList() {
  return (
    <GenericCrud
      headerTitle="活动管理"
      dynamicEntity={{
        entityClassName: 'Activity',
        entityName: 'activity',
        excludeFields: ['serialVersionUID'],
        relations: {
          community: {
            entityClassName: 'Community',
            entityName: 'community',
            displayField: 'name',
            valueField: '_id',
            multiple: false,
          },
        },
      }}
      rowKey="_id"
    />
  );
}
```

### 7.4 带 dataField 的动态模式

```typescript
export default function ProductList() {
  return (
    <GenericCrud
      headerTitle="商品管理"
      dynamicEntity={{
        entityClassName: 'Product',
        entityName: 'product',
        excludeFields: ['serialVersionUID'],
        dataField: 'data', // 所有表单字段包装到 data 属性中
      }}
      rowKey="_id"
      data={{ status: 1, enabled: true }} // 新建时的默认值
    />
  );
}
```

### 7.5 静态模式

```typescript
const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    valueType: 'text',
    sorter: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    valueType: 'select',
    valueEnum: {
      0: { text: '禁用' },
      1: { text: '启用' },
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    valueType: 'dateTime',
    hideInSearch: true,
  },
];

const formFields = [
  {
    name: 'username',
    label: '用户名',
    valueType: 'text',
    required: true,
    rules: [
      { required: true, message: '请输入用户名' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符' },
    ],
  },
  {
    name: 'password',
    label: '密码',
    valueType: 'password',
    required: true,
  },
  {
    name: 'status',
    label: '状态',
    valueType: 'radio',
    valueEnum: {
      0: { text: '禁用' },
      1: { text: '启用' },
    },
    initialValue: 1,
  },
];

export default function UserList() {
  return (
    <GenericCrud
      headerTitle="用户管理"
      columns={columns}
      formFields={formFields}
      crudOperations={{
        list: async (params, sort) => {
          // 自定义查询逻辑
          const response = await request('/api/user/list', {
            method: 'POST',
            data: { params, sort },
          });
          return {
            data: response.data,
            success: true,
            total: response.total,
          };
        },
        create: async (data) => {
          return await request('/api/user/create', {
            method: 'POST',
            data,
          });
        },
        update: async (id, data) => {
          return await request(`/api/user/update/${id}`, {
            method: 'PUT',
            data,
          });
        },
        delete: async (id) => {
          return await request(`/api/user/delete/${id}`, {
            method: 'DELETE',
          });
        },
      }}
      rowKey="_id"
    />
  );
}
```

### 7.6 带权限控制和自定义渲染

```typescript
export default function UserList() {
  return (
    <GenericCrud
      headerTitle="用户管理"
      dynamicEntity={{
        entityClassName: 'WqUser',
        entityName: 'wquser',
        excludeFields: ['password', 'openid'],
      }}
      rowKey="_id"
      features={{
        create: true,
        update: true,
        delete: true,
        batchDelete: true,
        selection: true,
        export: false,
      }}
      permissions={{
        create: 'user:create',
        update: 'user:update',
        delete: 'user:delete',
      }}
      renderItemActions={(record, { handleEdit, handleDelete }) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit()}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            onConfirm={() => handleDelete()}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
          <Button
            type="link"
            onClick={() => console.log('查看详情:', record)}
          >
            详情
          </Button>
        </Space>
      )}
      callbacks={{
        onCreateSuccess: () => {
          message.success('用户创建成功');
        },
        onUpdateSuccess: () => {
          message.success('用户更新成功');
        },
        onDeleteSuccess: () => {
          message.success('用户删除成功');
        },
        onError: (error, operation) => {
          console.error(`${operation} 失败:`, error);
          message.error(`${operation} 失败`);
        },
      }}
    />
  );
}
```

### 7.7 自定义表单组件

```typescript
// 自定义新建表单
const CustomCreateForm = ({ visible, onCancel, onSubmit, loading, data }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && data) {
      form.setFieldsValue(data);
    }
  }, [visible, data]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('验证失败:', error);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      title="自定义新建表单"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
          <Input placeholder="请输入用户名" />
        </Form.Item>
        {/* 更多表单项 */}
      </Form>
    </Modal>
  );
};

export default function UserList() {
  return (
    <GenericCrud
      headerTitle="用户管理"
      dynamicEntity={{
        entityClassName: 'WqUser',
        entityName: 'wquser',
        excludeFields: ['password', 'openid'],
      }}
      rowKey="_id"
      customFormComponents={{
        create: CustomCreateForm,
        update: CustomUpdateForm,
      }}
    />
  );
}
```

---

## 8. 高级配置

### 8.1 UI 配置

```typescript
<GenericCrud
  ui={{
    search: {
      labelWidth: 100,
      span: 6,
      collapsed: false,
    },
    table: {
      size: 'small',
      scroll: { x: 1500 },
      pagination: {
        defaultPageSize: 20,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
      },
    },
    createModal: {
      title: '新建用户',
      width: 800,
    },
    updateModal: {
      title: '编辑用户',
      width: 800,
    },
  }}
/>
```

### 8.2 数据包装字段 (dataField) 详细说明

**用途**：当后端要求数据包装在特定字段中时使用。

**示例场景**：
```typescript
// 前端提交的数据
{
  username: "admin",
  password: "123456"
}

// 后端要求的格式
{
  data: {
    username: "admin",
    password: "123456"
  }
}
```

**配置方式**：
```typescript
dynamicEntity={{
  entityClassName: 'WqUser',
  entityName: 'wquser',
  dataField: 'data', // 指定包装字段
}}
```

**工作原理**：
1. **创建时**：`GenericCrud.tsx:356-367`
   ```typescript
   let submitData = values;
   if (dynamicEntity?.dataField) {
     submitData = {
       [dynamicEntity.dataField]: values,
     };
   }
   ```

2. **编辑时**：`UpdateModal.tsx:23-36`
   ```typescript
   const extractInitialValues = (record: any, dataField?: string) => {
     if (!record) return undefined;
     if (!dataField) return record;

     // 从 record[dataField] 中提取值
     const extracted = record[dataField];
     return extracted || record;
   };
   ```

### 8.3 关联实体详细配置

```typescript
dynamicEntity={{
  entityClassName: 'Activity',
  entityName: 'activity',
  relations: {
    community: {
      entityClassName: 'Community',     // 实体类名
      entityName: 'community',          // 实体名称（用于API调用）
      displayField: 'name',             // 显示的字段
      valueField: '_id',                // 值字段
      multiple: false,                  // 是否多选
    },
    tags: {
      entityClassName: 'Tag',
      entityName: 'tag',
      displayField: 'name',
      valueField: '_id',
      multiple: true,                   // 多选标签
    },
  },
}}
```

**工作原理**：
1. **表格显示**：`entityFieldMapper.ts:353-369`
   ```typescript
   (column as any).render = (_: any, record: any) => {
     const relationValue = record[fieldName];

     // 如果是嵌套对象，直接显示指定字段
     if (relationValue && typeof relationValue === 'object') {
       return relationValue[displayField] || '-';
     }

     return '-';
   };
   ```

2. **表单编辑**：`RelationSelect.tsx:36-63`
   ```typescript
   useEffect(() => {
     const loadRelationData = async () => {
       const result = await queryEntity(entityName, {
         current: 1,
         pageSize: 1000,
       });

       const opts = result.data.map((item) => ({
         label: item[displayField],
         value: item[valueField],
       }));
       setOptions(opts);
     };
     loadRelationData();
   }, [entityName, displayField, valueField]);
   ```

### 8.4 自定义字段渲染

```typescript
dynamicEntity={{
  entityClassName: 'WqUser',
  entityName: 'wquser',
  fieldOverrides: {
    // 图片上传
    avatar: {
      label: '头像',
      render: ({ value, onChange, form }) => (
        <ImageUpload
          value={value}
          onChange={(url) => {
            onChange(url);
            // 可以设置其他字段的值
            form?.setFieldsValue({ hasAvatar: true });
          }}
        />
      ),
    },

    // 级联选择
    address: {
      label: '地址',
      render: ({ value, onChange }) => (
        <Cascader
          value={value}
          onChange={onChange}
          options={regionOptions}
          placeholder="请选择省/市/区"
        />
      ),
    },

    // 依赖字段
    communityId: {
      label: '社区',
      valueType: 'select',
      dependencies: ['city'],
      render: ({ city, form }) => {
        const communities = useCommunities(city);
        return (
          <Select
            options={communities}
            onChange={(value) => form?.setFieldValue('communityId', value)}
          />
        );
      },
    },
  },
}}
```

---

## 附录：完整类型定义

```typescript
// 请求返回数据格式
interface RequestData<T = any> {
  data: T[];
  success: boolean;
  total: number;
}

// 实体字段信息（API 返回格式）
interface EntityFieldInfo {
  type: string;
  typeName: string;
  description?: string;
  enumValues?: any[];
}

// 字段覆盖配置
interface FieldOverrideConfig {
  [fieldName: string]: Partial<FormFieldConfig>;
}

// 表单字段配置
interface FormFieldConfig {
  name: string | string[];
  label?: string;
  valueType?: string;
  required?: boolean;
  rules?: any[];
  render?: (props: FormFieldRenderProps) => ReactNode;
  [key: string]: any;
}

// CRUD 操作函数
interface CrudOperations<T = any> {
  list: (params: any, sort: any) => Promise<RequestData<T>>;
  create?: (data: any) => Promise<boolean>;
  update?: (id: any, data: any) => Promise<boolean>;
  delete?: (id: any | any[]) => Promise<boolean>;
}

// 功能开关配置
interface FeatureConfig {
  create?: boolean;
  update?: boolean;
  delete?: boolean;
  batchDelete?: boolean;
  selection?: boolean;
  export?: boolean;
}

// UI 配置
interface UIConfig {
  search?: {
    labelWidth?: number;
    span?: number;
    collapsed?: boolean;
  };
  table?: {
    size?: 'small' | 'middle' | 'large';
    pagination?: any;
  };
  createModal?: {
    title?: string;
    width?: number | string;
  };
  updateModal?: {
    title?: string;
    width?: number | string;
  };
}

// 权限配置
interface PermissionConfig {
  create?: boolean | string;
  update?: boolean | string;
  delete?: boolean | string;
}

// 关联实体配置
interface RelationConfig {
  entityClassName: string;
  entityName: string;
  displayField?: string;
  valueField?: string;
  multiple?: boolean;
}

// 动态实体配置
interface DynamicEntityConfig {
  entityClassName: string;
  entityName: string;
  excludeFields?: string[];
  fieldOverrides?: FieldOverrideConfig;
  relations?: { [fieldName: string]: RelationConfig };
  dataField?: string;
}
```

---

## 总结

`GenericCrud` 组件通过以下核心机制实现了高度可配置的 CRUD 功能：

1. **动态字段获取**：通过 API 获取实体字段信息，自动生成 UI
2. **智能类型映射**：Java 类型自动映射到前端组件类型
3. **配置优先级**：formFields > fieldOverrides > 自动生成
4. **数据包装支持**：通过 dataField 支持特殊数据格式
5. **关联实体处理**：自动识别并处理外键关联
6. **高度可定制**：支持自定义渲染、回调、表单组件等

通过合理配置这些参数，可以快速构建出功能完善、用户体验良好的 CRUD 页面。
