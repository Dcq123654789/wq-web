# 数据包装字段（dataField）使用指南

## 📝 功能说明

`dataField` 配置允许你将所有表单字段包装到一个父属性中再提交到后端。

### 示例场景

**需求**：后端接口要求所有数据包装在 `data` 字段中

```javascript
// ❌ 不使用 dataField 的提交格式
{
  "name": "张三",
  "age": 25,
  "city": "北京市"
}

// ✅ 使用 dataField: "data" 的提交格式
{
  "data": {
    "name": "张三",
    "age": 25,
    "city": "北京市"
  }
}
```

## 🚀 使用方法

### 1. 基础配置

```tsx
import { GenericCrud } from '@/components/GenericCrud';

export default function ActivitiesPage() {
  return (
    <GenericCrud
      dynamicEntity={{
        entityClassName: 'CommunityActivity',
        entityName: 'communityActivity',

        // ⭐ 配置数据包装字段
        dataField: 'data',  // 所有表单字段将包装到 "data" 属性中

        fieldOverrides: {
          name: {
            label: '活动名称',
            valueType: 'text',
          },
          age: {
            label: '年龄',
            valueType: 'digit',
          },
          city: {
            label: '城市',
            valueType: 'text',
          },
        },
      }}
    />
  );
}
```

### 2. 提交数据格式

当用户填写表单并点击"创建"时：

```javascript
// 用户输入：
// name: 张三
// age: 25
// city: 北京市

// 提交到后端的数据：
{
  "data": {
    "name": "张三",
    "age": 25,
    "city": "北京市"
  }
}
```

### 3. 编辑数据格式

当编辑时，会自动从 `data` 字段中提取值：

```javascript
// 后端返回的数据：
{
  "_id": "123",
  "data": {
    "name": "张三",
    "age": 25,
    "city": "北京市"
  }
}

// 表单自动填充：
// name: 张三
// age: 25
// city: 北京市
```

## 📊 数据流程

### 创建流程

```
用户填写表单
    ↓
表单值: { name: "张三", age: 25, city: "北京市" }
    ↓
dataField 包装
    ↓
提交数据: { data: { name: "张三", age: 25, city: "北京市" } }
    ↓
发送到后端
```

### 编辑流程

```
后端返回数据
    ↓
{ _id: "123", data: { name: "张三", age: 25 } }
    ↓
从 dataField 提取
    ↓
表单初始值: { name: "张三", age: 25 }
    ↓
用户修改表单
    ↓
表单值: { name: "李四", age: 26, city: "上海市" }
    ↓
dataField 包装
    ↓
提交数据: { data: { name: "李四", age: 26, city: "上海市" } }
    ↓
发送到后端
```

## 🔍 调试

查看浏览器控制台日志：

```javascript
// 创建时
创建数据包装: {
  原始数据: { name: "张三", age: 25, city: "北京市" },
  提交数据: { data: { name: "张三", age: 25, city: "北京市" } },
  包装字段: "data"
}

// 编辑时
UpdateModal 数据提取: {
  原始记录: { _id: "123", data: { name: "张三", age: 25 } },
  提取字段: "data",
  提取的值: { name: "张三", age: 25 }
}

// 更新时
更新数据包装: {
  原始数据: { name: "李四", age: 26 },
  提交数据: { data: { name: "李四", age: 26 } },
  包装字段: "data"
}
```

## 📋 完整示例

```tsx
import { GenericCrud } from '@/components/GenericCrud';
import MapPicker from '@/components/MapPicker';

export default function ActivitiesPage() {
  return (
    <GenericCrud
      dynamicEntity={{
        entityClassName: 'CommunityActivity',
        entityName: 'communityActivity',

        // ⭐ 配置数据包装字段
        dataField: 'bean',  // 使用 "bean" 作为父字段

        fieldOverrides: {
          // 名称字段
          name: {
            label: '活动名称',
            valueType: 'text',
            required: true,
            // 可以设置默认值
            initialValue: '默认活动',
          },

          // 描述字段
          description: {
            label: '活动描述',
            valueType: 'textarea',
          },

          // 最大参与人数
          maxParticipants: {
            label: '最大参与人数',
            valueType: 'digit',
            initialValue: 100,
          },

          // 地图选择器
          locationAddress: {
            label: '活动地点',
            valueType: 'text',
            required: true,
            render: (formProps: any) => (
              <MapPicker
                {...formProps}
                config={{
                  amapKey: process.env.AMAP_KEY,
                  mapType: 'amap',
                  defaultCenter: [116.397428, 39.90923],
                  defaultZoom: 15,
                }}
                onChange={(locationInfo: any) => {
                  formProps.onChange?.(locationInfo);

                  // 更新经纬度字段
                  const form = formProps.form;
                  if (form && locationInfo) {
                    form.setFieldValue('longitude', locationInfo.lng);
                    form.setFieldValue('latitude', locationInfo.lat);
                  }
                }}
              />
            ),
          },

          // 经度字段
          longitude: {
            label: '经度',
            valueType: 'text',
          },

          // 纬度字段
          latitude: {
            label: '纬度',
            valueType: 'text',
          },
        },
      }}

      // 功能配置
      features={{
        create: true,
        update: true,
        delete: true,
      }}
    />
  );
}
```

## 🎯 提交的数据格式

```json
{
  "bean": {
    "name": "活动名称",
    "description": "活动描述",
    "maxParticipants": 100,
    "locationAddress": {
      "lng": 116.397428,
      "lat": 39.90923,
      "address": "北京市东城区长安街"
    },
    "longitude": 116.397428,
    "latitude": 39.90923
  }
}
```

## ⚙️ 配置说明

### dataField 可选值

- `'data'` - 包装到 data 字段
- `'bean'` - 包装到 bean 字段
- `'entity'` - 包装到 entity 字段
- `'content'` - 包装到 content 字段
- 或任何你需要的字段名

### 不配置 dataField

如果不配置 `dataField`，数据直接提交：

```javascript
// 提交格式：
{
  "name": "张三",
  "age": 25
}
```

### 配置 dataField

配置后数据会被包装：

```javascript
// 提交格式：
{
  "data": {
    "name": "张三",
    "age": 25
  }
}
```

## 🎨 实际应用场景

### 场景 1：后端要求固定包装字段

```tsx
// 后端接口：
// POST /api/activity
// Request Body: { bean: { ... } }

dataField: 'bean'
```

### 场景 2：多个实体共享同一个接口

```tsx
// /api/user → { user: { name, age } }
// /api/order → { order: { amount, date } }

// 用户页面
<GenericCrud dynamicEntity={{ dataField: 'user' }} />

// 订单页面
<GenericCrud dynamicEntity={{ dataField: 'order' }} />
```

### 场景 3：嵌套数据结构

```tsx
// 后端返回：{ result: { data: { ... } } }

dataField: 'result.data'  // ⚠️ 暂不支持多级提取
// 当前只支持单级，如 dataField: 'data'
```

## ⚠️ 注意事项

1. **字段名冲突**
   - 如果表单中有名为 `data` 的字段，配置 `dataField: 'data'` 会冲突
   - 建议使用不同的字段名，如 `bean`, `entity` 等

2. **后端接口一致性**
   - 创建和更新接口都要使用相同的包装字段
   - 确保后端能正确解析包装后的数据

3. **数据提取**
   - 编辑时会自动从 `dataField` 中提取值
   - 如果后端返回的数据格式不一致，可能需要额外处理

4. **表单验证**
   - 验证规则针对的是表单字段值，不是包装后的数据
   - 例如：`{ required: true }` 验证的是 `name` 字段，不是 `data.name`

## 💡 最佳实践

```tsx
// ✅ 推荐：统一使用 dataField
<GenericCrud
  dynamicEntity={{
    dataField: 'bean',  // 清晰表明数据包装
    fieldOverrides: {
      // ... 字段配置
    },
  }}
/>

// ❌ 避免：字段名与 dataField 冲突
<GenericCrud
  dynamicEntity={{
    dataField: 'data',  // ⚠️ 如果有 data 字段会冲突
    fieldOverrides: {
      data: {  // ⚠️ 不要这样
        label: '数据',
      },
    },
  }}
/>
```

## 🎉 总结

使用 `dataField` 配置：

1. ✅ 所有表单字段自动包装到指定父字段
2. ✅ 创建和更新时自动应用包装
3. ✅ 编辑时自动提取字段值填充表单
4. ✅ 简化后端接口对接
5. ✅ 支持任意父字段名称

现在你可以轻松实现后端要求的数据包装格式了！🚀
