# GenericCrud 表单初始值处理

## 📝 问题描述

从后端获取的数据中包含经纬度，但在编辑表单时这些值没有显示在输入框中。

## 🔍 问题分析

### 可能的原因

1. **数据结构嵌套**
   - 后端返回：`{ locationAddress: { lng: 116.397428, lat: 39.90923, address: "xxx" } }`
   - 表单需要：`{ longitude: 116.397428, latitude: 39.90923 }`
   - 需要将嵌套的值提取到顶层

2. **字段名不匹配**
   - 后端返回的字段名与表单字段名不一致
   - 例如：后端返回 `lng`，表单需要 `longitude`

3. **ProForm 初始化时机**
   - initialValues 设置后，ProForm 可能还未完全渲染
   - 需要使用 formRef 手动设置

## ✅ 解决方案

### 方案 1：使用 params 处理数据（推荐）

在 GenericCrud 中添加 `params` 回调来转换数据：

```tsx
import { GenericCrud } from '@/components/GenericCrud';
import MapPicker from '@/components/MapPicker';

export default function ActivitiesPage() {
  return (
    <GenericCrud
      dynamicEntity={{
        entityClassName: 'CommunityActivity',
        entityName: 'communityActivity',
        fieldOverrides: {
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
            // ⭐ 添加 params 提取嵌套值
            params: (value: any, record: any) => {
              console.log('locationAddress params:', value, record);
              // 如果 locationAddress 是对象，返回它
              if (value && typeof value === 'object') {
                return value;
              }
              return {};
            },
          },
          longitude: {
            label: '经度',
            valueType: 'text',
            // ⭐ 添加 params 从 locationAddress 中提取
            params: (value: any, record: any) => {
              console.log('longitude params:', value, record);
              // 优先使用 longitude，否则从 locationAddress.lng 提取
              if (value !== undefined) return value;
              if (record.locationAddress?.lng !== undefined) {
                return record.locationAddress.lng;
              }
              return undefined;
            },
          },
          latitude: {
            label: '纬度',
            valueType: 'text',
            // ⭐ 添加 params 从 locationAddress 中提取
            params: (value: any, record: any) => {
              console.log('latitude params:', value, record);
              if (value !== undefined) return value;
              if (record.locationAddress?.lat !== undefined) {
                return record.locationAddress.lat;
              }
              return undefined;
            },
          },
        },
      }}
    />
  );
}
```

### 方案 2：使用 onValuesChange 监听表单值变化

```tsx
<GenericCrud
  dynamicEntity={{
    entityClassName: 'CommunityActivity',
    entityName: 'communityActivity',
    // ... 其他配置
  }}
  callbacks={{
    onUpdateSuccess: () => {
      console.log('更新成功');
    },
  }}
  // ⭐ 添加表单值变化监听
  onValuesChange={(changedValues, allValues) => {
    console.log('表单值变化:', changedValues, allValues);

    // 如果 locationAddress 变化，同步更新经纬度
    if (changedValues.locationAddress) {
      const { lng, lat } = changedValues.locationAddress;
      if (lng !== undefined || lat !== undefined) {
        // 这个需要在 form 实例中操作
        console.log('需要同步经纬度:', lng, lat);
      }
    }
  }}
/>
```

### 方案 3：在 MapPicker 组件中处理初始值

修改 MapPicker 组件，在接收到 value 时自动设置经纬度字段：

```tsx
<MapPicker
  {...formProps}
  value={formProps.value}
  onChange={(locationInfo: any) => {
    // 更新当前字段
    formProps.onChange?.(locationInfo);

    // 更新经纬度字段
    const form = formProps.form;
    if (form && locationInfo) {
      form.setFieldValue('longitude', locationInfo.lng);
      form.setFieldValue('latitude', locationInfo.lat);
    }
  }}
/>
```

### 方案 4：预处理后端数据

在 GenericCrud 的数据获取后处理：

```tsx
<GenericCrud
  // ... 其他配置
  rowKey="_id"
  // ⭐ 添加数据转换
  request={async (params, sort) => {
    const response = await fetch('/api/communityActivity', {
      method: 'POST',
      body: JSON.stringify({ ...params, sort }),
    });
    const result = await response.json();

    // 转换数据结构
    const data = result.data.map((item: any) => {
      // 如果有 locationAddress 对象，提取 lng 和 lat 到顶层
      if (item.locationAddress && typeof item.locationAddress === 'object') {
        return {
          ...item,
          longitude: item.locationAddress.lng,
          latitude: item.locationAddress.lat,
        };
      }
      return item;
    });

    return {
      data,
      success: result.success,
      total: result.total,
    };
  }}
/>
```

## 🔧 调试技巧

### 1. 查看后端返回的数据

打开浏览器控制台，查看 Network 标签中的响应数据：

```javascript
// 应该看到类似这样的数据
{
  "_id": "123",
  "title": "活动标题",
  "locationAddress": {
    "lng": 116.397428,
    "lat": 39.90923,
    "address": "北京市东城区长安街"
  },
  // 或
  "longitude": 116.397428,
  "latitude": 39.90923
}
```

### 2. 查看 DynamicForm 的日志

已添加的日志会输出：
```javascript
DynamicForm 渲染: {
  mode: 'update',
  initialValues: { ... },
  formFieldsCount: 10
}

DynamicForm 设置表单初始值: { ... }
```

### 3. 查看字段的 params 输出

如果使用了 `params` 配置：
```javascript
locationAddress params: { lng: 116.397428, lat: 39.90923 }
longitude params: undefined, { locationAddress: { ... } }
```

### 4. 手动设置表单值测试

在浏览器控制台中测试：

```javascript
// 假设 ProForm 的 form 实例可以通过全局变量访问
// 或者通过 React DevTools 选择组件

form.setFieldValue('longitude', 116.397428);
form.setFieldValue('latitude', 39.90923);

// 验证
console.log('经度:', form.getFieldValue('longitude'));
console.log('纬度:', form.getFieldValue('latitude'));
```

## 📊 数据流

```
后端返回数据
    ↓
{ locationAddress: { lng: 116.397428, lat: 39.90923 } }
    ↓
GenericCrud setCurrentRecord
    ↓
UpdateModal record={currentRecord}
    ↓
DynamicForm initialValues={record}
    ↓
ProForm 初始化（通过 formRef）
    ↓
formRef.current.setFieldsValue(initialValues)
    ↓
表单字段显示值
```

## ✅ 验证步骤

1. **检查后端数据结构**
   ```bash
   # 打开浏览器开发者工具
   # Network 标签
   # 找到获取数据的请求
   # 查看 Response
   ```

2. **检查控制台日志**
   - 确认 DynamicForm 渲染日志
   - 确认 initialValues 内容
   - 确认字段 params 被调用

3. **检查表单渲染**
   - 打开编辑弹窗
   - 查看经纬度输入框是否有值
   - 如果没有，检查是否有错误信息

4. **测试手动设置**
   - 在控制台执行 `form.setFieldValue('longitude', 116.397428)`
   - 查看输入框是否显示值

## 🎯 推荐方案

根据数据结构选择合适的方案：

| 场景 | 推荐方案 |
|------|---------|
| 经纬度在顶层字段（longitude, latitude） | 方案 3：在 onChange 中同步 |
| 经纬度在嵌套对象（locationAddress.lng） | 方案 1：使用 params 提取 |
| 需要复杂的数据转换 | 方案 4：预处理数据 |
| 调试阶段 | 查看控制台日志 + 方案 2 |

## 💡 最佳实践

```tsx
// 综合使用多种方案
<MapPicker
  {...formProps}
  config={config}
  onChange={(locationInfo) => {
    // 1. 更新主字段
    formProps.onChange?.(locationInfo);

    // 2. 同步到经纬度字段
    const form = formProps.form;
    if (form && locationInfo) {
      form.setFieldValue('longitude', locationInfo.lng);
      form.setFieldValue('latitude', locationInfo.lat);

      // 3. 验证设置成功
      setTimeout(() => {
        const lng = form.getFieldValue('longitude');
        const lat = form.getFieldValue('latitude');
        console.log('经纬度已设置:', { lng, lat });
      }, 100);
    }
  }}
/>
```
