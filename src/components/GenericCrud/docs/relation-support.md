# 关联实体支持

GenericCrud 组件现已支持关联实体字段，可以自动处理一对多、多对一等关系。

## 功能说明

当实体中包含关联对象字段（如 `Community`、`User` 等）时，可以通过配置 `relations` 来实现：

1. **表格显示** - 自动显示关联对象的指定字段（如社区名称）
2. **表单选择** - 提供下拉选择器，动态加载关联实体数据
3. **数据提交** - 提交关联对象的 ID 值

## 服务器返回格式

```json
{
  "community": {
    "name": "community",
    "type": "Community",
    "description": "所属社区信息（懒加载）"
  }
}
```

## 配置方法

### 基础配置

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

        // 关联实体配置
        relations: {
          community: {
            entityClassName: 'Community',
            entityName: 'community',
            displayField: 'name',  // 显示社区名称
            valueField: '_id',     // 提交社区ID
          },
        },
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

### 关联配置参数

```typescript
interface RelationConfig {
  // 关联实体类名（如：Community）
  entityClassName: string;

  // 关联实体名称（小写，如：community）
  entityName: string;

  // 显示字段（默认：name）
  // 从关联对象中读取此字段用于显示
  displayField?: string;

  // 值字段（默认：_id）
  // 提交时使用此字段的值
  valueField?: string;

  // 是否多选（默认：false）
  multiple?: boolean;
}
```

## 使用场景

### 1. 一对多关系（活动 → 社区）

```tsx
relations: {
  community: {
    entityClassName: 'Community',
    entityName: 'community',
    displayField: 'name',
    valueField: '_id',
  },
}
```

**数据格式：**
```json
{
  "_id": "act001",
  "title": "社区活动",
  "community": {
    "_id": "com001",
    "name": "幸福社区"
  }
}
```

**表格显示：** `幸福社区`
**表单提交：** `{ "community": "com001" }`

### 2. 多对一关系（订单 → 用户）

```tsx
relations: {
  user: {
    entityClassName: 'User',
    entityName: 'user',
    displayField: 'nickname',
    valueField: '_id',
  },
}
```

### 3. 多选关联（活动 → 多个标签）

```tsx
relations: {
  tags: {
    entityClassName: 'Tag',
    entityName: 'tag',
    displayField: 'name',
    valueField: '_id',
    multiple: true,  // 支持多选
  },
}
```

## 表现形式

### 在表格中

自动渲染关联对象的显示字段：

```
| 活动标题     | 所属社区   |
|-------------|-----------|
| 健身活动     | 幸福社区   |
| 读书会       | 阳光社区   |
```

### 在表单中

提供下拉选择器，支持搜索和过滤：

```
所属社区: [下拉选择框 ▼]
         ├── 幸福社区
         ├── 阳光社区
         └── 和谐社区
```

### 提交数据格式

```json
{
  "title": "健身活动",
  "community": "com001"  // 提交关联对象的 _id
}
```

## 高级用法

### 自定义显示字段

```tsx
relations: {
  community: {
    entityClassName: 'Community',
    entityName: 'community',
    displayField: 'fullName',  // 使用 fullName 字段显示
    valueField: 'id',          // 使用 id 字段作为值
  },
}
```

### 组合使用字段覆盖

```tsx
dynamicEntity={{
  entityClassName: 'CommunityActivity',
  entityName: 'communityActivity',
  relations: {
    community: {
      entityClassName: 'Community',
      entityName: 'community',
    },
  },
  fieldOverrides: {
    // 自定义关联字段的标签
    community: {
      label: '所属社区',
      required: true,
    },
  },
}}
```

## 注意事项

1. **API 接口** - 关联实体需要有对应的查询接口（`/api/{entityName}/list`）
2. **懒加载** - 关联对象数据在表单打开时才加载
3. **字段映射** - 确保 `displayField` 和 `valueField` 在关联实体中存在
4. **性能优化** - 关联数据会一次性加载（默认 pageSize: 1000）
5. **数据格式** - 服务器返回的关联对象应包含完整的字段信息

## 故障排查

### 问题：表格显示 `[object Object]`

**原因：** 关联字段配置不正确或数据格式不对

**解决：** 检查 `relations` 配置，确保 `displayField` 正确

### 问题：表单选择器无数据

**原因：** 关联实体 API 未返回数据或接口路径错误

**解决：**
1. 检查关联实体的查询接口是否正常
2. 查看浏览器控制台的网络请求
3. 确认 `entityName` 与后端接口路径匹配

### 问题：提交时关联字段为空

**原因：** `valueField` 配置不正确

**解决：** 确保 `valueField` 与关联对象的主键字段一致

## 完整示例

```tsx
import React from 'react';
import { GenericCrud } from '@/components/GenericCrud';

export default function CommunityActivitiesPage() {
  return (
    <GenericCrud
      rowKey="_id"
      headerTitle="社区活动管理"
      dynamicEntity={{
        entityClassName: 'CommunityActivity',
        entityName: 'communityActivity',

        // 关联实体配置
        relations: {
          community: {
            entityClassName: 'Community',
            entityName: 'community',
            displayField: 'name',
            valueField: '_id',
          },
          organizer: {
            entityClassName: 'User',
            entityName: 'user',
            displayField: 'nickname',
            valueField: '_id',
          },
        },

        // 字段覆盖
        fieldOverrides: {
          title: {
            required: true,
            rules: [
              { min: 2, max: 50, message: '标题长度为 2-50 个字符' },
            ],
          },
          description: {
            valueType: 'textarea',
            fieldProps: { rows: 4 },
          },
        },
      }}

      features={{
        create: true,
        update: true,
        delete: true,
      }}

      ui={{
        createModal: {
          title: '新建活动',
          width: 800,
        },
      }}
    />
  );
}
```
