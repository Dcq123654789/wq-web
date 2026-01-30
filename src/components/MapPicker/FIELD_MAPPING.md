# MapPicker 字段映射配置

## 功能说明

MapPicker 组件支持将地图选择的经纬度等信息自动映射到多个字段中。

## 使用方法

### 基础配置

在 `fieldOverrides` 中配置 MapPicker，并在 `onChange` 中处理字段映射：

```tsx
import MapPicker from '@/components/MapPicker';

fieldOverrides: {
  // 地址字段（显示地图选择器）
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
          // 1. 更新当前字段
          formProps.onChange?.(locationInfo);

          // 2. 同时更新其他字段
          const form = formProps.form;
          if (form && locationInfo) {
            // 经度字段
            if (locationInfo.lng !== undefined) {
              form.setFieldValue('longitude', locationInfo.lng);
            }
            // 纬度字段
            if (locationInfo.lat !== undefined) {
              form.setFieldValue('latitude', locationInfo.lat);
            }
            // 省份
            if (locationInfo.province) {
              form.setFieldValue('province', locationInfo.province);
            }
            // 城市
            if (locationInfo.city) {
              form.setFieldValue('city', locationInfo.city);
            }
            // 区县
            if (locationInfo.district) {
              form.setFieldValue('district', locationInfo.district);
            }
          }
        }}
      />
    ),
  },

  // 经度字段（显示，可手动修改）
  longitude: {
    label: '经度',
    valueType: 'text',
    rules: [
      {
        pattern: /^-?(\d{1,3}(\.\d+)?)?$/,
        message: '请输入有效的经度（-180 到 180）',
      },
    ],
    fieldProps: {
      placeholder: '如：116.397428',
      precision: 6,
      step: 0.000001,
    },
  },

  // 纬度字段（显示，可手动修改）
  latitude: {
    label: '纬度',
    valueType: 'text',
    rules: [
      {
        pattern: /^-?(\d{1,2}(\.\d+)?)?$/,
        message: '请输入有效的纬度（-90 到 90）',
      },
    ],
    fieldProps: {
      placeholder: '如：39.90923',
      precision: 6,
      step: 0.000001,
    },
  },

  // 省份字段（可选）
  province: {
    label: '省份',
    valueType: 'text',
    hideInForm: true,  // 如果不想显示可以隐藏
  },

  // 城市字段（可选）
  city: {
    label: '城市',
    valueType: 'text',
    hideInForm: true,
  },

  // 区县字段（可选）
  district: {
    label: '区县',
    valueType: 'text',
    hideInForm: true,
  },
}
```

## LocationInfo 数据结构

MapPicker 的 `onChange` 回调返回以下数据：

```typescript
interface LocationInfo {
  lng?: number;      // 经度
  lat?: number;      // 纬度
  address?: string;  // 详细地址
  province?: string; // 省份
  city?: string;     // 城市
  district?: string; // 区县
}
```

## 常见使用场景

### 场景 1：只存储经纬度和地址

```tsx
onChange={(locationInfo) => {
  formProps.onChange?.(locationInfo);
  const form = formProps.form;
  if (form) {
    form.setFieldValue('lng', locationInfo.lng);
    form.setFieldValue('lat', locationInfo.lat);
  }
}}
```

### 场景 2：完整地址信息（省市区）

```tsx
onChange={(locationInfo) => {
  formProps.onChange?.(locationInfo);
  const form = formProps.form;
  if (form) {
    form.setFieldValue('longitude', locationInfo.lng);
    form.setFieldValue('latitude', locationInfo.lat);
    form.setFieldValue('province', locationInfo.province);
    form.setFieldValue('city', locationInfo.city);
    form.setFieldValue('district', locationInfo.district);
    form.setFieldValue('fullAddress', locationInfo.address);
  }
}}
```

### 场景 3：只显示地址，隐藏经纬度

```tsx
// 表单配置
locationAddress: {
  label: '地址',
  render: (formProps) => (
    <MapPicker
      {...formProps}
      onChange={(locationInfo) => {
        formProps.onChange?.(locationInfo.address);
        const form = formProps.form;
        if (form) {
          // 后台存储经纬度，但表单中不显示
          form.setFieldValue('longitude', locationInfo.lng);
          form.setFieldValue('latitude', locationInfo.lat);
        }
      }}
    />
  ),
},
// 经纬度字段完全隐藏
longitude: {
  hideInForm: true,
  hideInTable: true,
},
latitude: {
  hideInForm: true,
  hideInTable: true,
}
```

## 字段可见性配置

### hideInForm
- 在表单（创建/编辑弹窗）中隐藏该字段
- 适用于由其他字段自动填充的字段（如经纬度）

### hideInTable
- 在数据列表表格中隐藏该字段
- 适用于不需要在列表中显示的字段

### 同时隐藏
```tsx
longitude: {
  hideInForm: true,   // 表单中不显示
  hideInTable: true,  // 表格中不显示
}
```

## 表单 API

### form.setFieldValue(name, value)
设置表单字段的值：

```tsx
// 设置单个字段
form.setFieldValue('longitude', 116.397428);

// 批量设置
form.setFieldsValue({
  longitude: 116.397428,
  latitude: 39.90923,
  province: '北京市',
  city: '北京市',
  district: '东城区',
});
```

### form.getFieldValue(name)
获取表单字段的值：

```tsx
const lng = form.getFieldValue('longitude');
const lat = form.getFieldValue('latitude');
```

## 完整示例

参考 `src/pages/enjoy/activities/index.tsx` 中的实现：

```tsx
export default function ActivitiesPage() {
  return (
    <GenericCrud
      dynamicEntity={{
        entityClassName: 'CommunityActivity',
        entityName: 'communityActivity',
        fieldOverrides: {
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
                placeholder="请点击选择活动地点"
                modalTitle="选择活动地点"
                modalWidth={900}
                onChange={(locationInfo: any) => {
                  // 更新当前字段
                  formProps.onChange?.(locationInfo);

                  // 更新经纬度字段
                  const form = formProps.form;
                  if (form && locationInfo) {
                    form.setFieldValue('longitude', locationInfo.lng);
                    form.setFieldValue('latitude', locationInfo.lat);
                    form.setFieldValue('province', locationInfo.province);
                    form.setFieldValue('city', locationInfo.city);
                    form.setFieldValue('district', locationInfo.district);
                  }
                }}
              />
            ),
          },

          // 经纬度字段（隐藏）
          longitude: {
            label: '经度',
            valueType: 'text',
            hideInForm: true,
            hideInTable: true,
          },
          latitude: {
            label: '纬度',
            valueType: 'text',
            hideInForm: true,
            hideInTable: true,
          },
        },
      }}
    />
  );
}
```

## 调试技巧

在 onChange 中添加 console.log 查看数据：

```tsx
onChange={(locationInfo) => {
  console.log('地图选择器返回数据:', locationInfo);
  console.log('经度:', locationInfo.lng);
  console.log('纬度:', locationInfo.lat);
  console.log('详细地址:', locationInfo.address);

  // 其余代码...
}}
```

## 注意事项

1. **字段名必须匹配**：确保 `setFieldValue` 中的字段名与实际数据库字段名一致

2. **初始化数据**：编辑已有数据时，需要正确初始化 MapPicker 的 value：
   ```tsx
   // value 应该是 LocationInfo 格式
   value: {
     lng: 116.397428,
     lat: 39.90923,
     address: "北京市东城区长安街",
   }
   ```

3. **表单实例检查**：使用 `form` 前先检查是否存在：
   ```tsx
   if (form && locationInfo) {
     // 安全使用 form
   }
   ```

4. **类型安全**：可以定义接口以获得类型提示：
   ```tsx
   interface FormProps {
     value?: LocationInfo;
     onChange?: (value: any) => void;
     form?: any; // ProForm 的 form 实例
   }
   ```

## 总结

通过配置 MapPicker 的 `onChange` 回调，可以轻松实现：
- ✅ 地图选点
- ✅ 自动填充经纬度
- ✅ 自动填充省市区信息
- ✅ 多字段联动更新
- ✅ 灵活控制字段可见性
