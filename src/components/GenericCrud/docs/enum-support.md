# 枚举类型字段支持

GenericCrud 组件现已支持自动识别服务器返回的枚举类型字段，并自动渲染为下拉选择器。

## 功能说明

当服务器返回的字段定义中包含 `enumValues` 时，组件会自动将此字段渲染为选择器，支持以下两种格式：

### 格式 1：对象格式（推荐）

```json
{
  "status": {
    "name": "status",
    "type": "Integer",
    "description": "报名状态",
    "enumType": "ActivityStatus",
    "enumValues": {
      "0": "报名中",
      "1": "报名结束",
      "2": "活动结束",
      "3": "已满员"
    }
  }
}
```

### 格式 2：数组格式

```json
{
  "status": {
    "name": "status",
    "type": "Integer",
    "description": "报名状态",
    "enumValues": [
      { "value": 0, "label": "报名中" },
      { "value": 1, "label": "报名结束" },
      { "value": 2, "label": "活动结束" },
      { "value": 3, "label": "已满员" }
    ]
  }
}
```

## 自动处理逻辑

组件会自动：

1. **检测枚举字段** - 识别包含 `enumValues` 的字段定义
2. **转换字段类型** - 将 `valueType` 自动设置为 `select`
3. **生成选项列表** - 将 `enumValues` 转换为 ProTable 可用的 `valueEnum` 格式
4. **数字键处理** - 对象格式的数字键（如 `"0"`, `"1"`）会自动转换为数字类型

## 表现形式

### 在表格中

枚举字段会显示为下拉选择器，并显示对应的文本标签：

```
| 状态        |
|-------------|
| 报名中      |
| 报名结束    |
| 活动结束    |
```

### 在表单中

编辑时会显示下拉选择框，用户可以从预定义的选项中选择：

```
状态: [下拉选择框 ▼]
     ├── 报名中
     ├── 报名结束
     ├── 活动结束
     └── 已满员
```

### 在搜索栏中

支持按枚举值进行筛选搜索。

## 示例代码

### 使用 GenericCrud

```tsx
import { GenericCrud } from '@/components/GenericCrud';

export default function ActivitiesPage() {
  return (
    <GenericCrud
      rowKey="_id"
      headerTitle="活动管理"
      dynamicEntity={{
        entityClassName: 'CommunityActivity',
        entityName: 'communityActivity',
        // 无需手动配置 status 字段，组件会自动识别枚举类型
      }}
      features={{
        create: true,
        update: true,
        delete: true,
      }}
    />
  );
}
```

### 手动覆盖枚举配置（可选）

如果需要自定义枚举显示，可以在 `fieldOverrides` 中覆盖：

```tsx
dynamicEntity={{
  entityClassName: 'CommunityActivity',
  entityName: 'communityActivity',
  fieldOverrides: {
    status: {
      label: '活动状态',  // 自定义标签
      valueType: 'select',
      valueEnum: {
        0: { text: '报名中', status: 'Processing' },
        1: { text: '报名结束', status: 'Default' },
        2: { text: '活动结束', status: 'Success' },
        3: { text: '已满员', status: 'Error' },
      },
    },
  },
}}
```

## 支持的字段类型

枚举支持以下基础数据类型：

- **Integer / int** - 数字枚举（如：0, 1, 2）
- **String** - 字符串枚举（如：'active', 'inactive'）
- **Long** - 长整型枚举

## 常见使用场景

1. **状态字段** - 订单状态、活动状态、审核状态等
2. **类型字段** - 用户类型、商品类型、分类等
3. **级别字段** - 会员等级、优先级等
4. **性别字段** - 男、女、未知（已内置支持）

## 注意事项

1. **枚举值唯一性** - 确保枚举值的键（key）唯一
2. **显示文本** - 对象格式的值为显示文本，数组格式使用 `label` 或 `text` 字段
3. **数字转换** - 对象格式的数字字符串键（如 `"0"`）会自动转换为数字类型
4. **表单验证** - 枚举字段默认不是必填，可通过 `fieldOverrides` 设置 `required: true`
