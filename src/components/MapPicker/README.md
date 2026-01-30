# 地图位置选择器组件

一个通用的地图选点组件，支持高德地图和百度地图，可在地图上点击选择位置并自动获取经纬度和详细地址。

## 功能特性

- ✅ 点击弹出地图，支持点击选点
- ✅ 自动获取经纬度坐标
- ✅ 逆地理编码获取详细地址
- ✅ 支持高德地图和百度地图
- ✅ 支持手动输入经纬度
- ✅ 标记选中位置
- ✅ 显示省市区信息
- ✅ 自动降级：SDK 加载失败时切换到手动输入模式

## 快速开始

### 1. 获取地图 API Key

**高德地图**（推荐）:
1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册并创建应用
3. 选择 "Web端(JS API)"
4. 获取 API Key

**百度地图**:
1. 访问 [百度地图开放平台](https://lbsyun.baidu.com/)
2. 注册并创建应用
3. 选择 "浏览器端"
4. 获取 AK (Access Key)

### 2. 在字段配置中使用

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
          // 地址字段
          address: {
            valueType: 'text',
            render: (props: any) => (
              <MapPicker
                {...props}
                config={{
                  amapKey: 'your-amap-key', // 替换为你的 Key
                  mapType: 'amap',
                }}
                placeholder="请选择活动地址"
              />
            ),
          },
          // 如果经纬度是独立字段，可以在onChange中处理
        },
      }}
    />
  );
}
```

## API 参数

### MapPicker Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| value | 位置信息 | `LocationInfo` | - |
| onChange | 位置变化回调 | `(location: LocationInfo) => void` | - |
| config | 地图配置 | `MapPickerConfig` | - |
| placeholder | 输入框占位符 | `string` | "请选择位置" |
| disabled | 是否禁用 | `boolean` | false |
| modalTitle | 弹窗标题 | `string` | "选择位置" |
| modalWidth | 弹窗宽度 | `number` | 800 |

### MapPickerConfig

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| amapKey | 高德地图 Key | `string` | - |
| bmapKey | 百度地图 Key | `string` | - |
| mapType | 地图类型 | `'amap' \| 'bmap'` | `'amap'` |
| defaultCenter | 默认中心点 | `[number, number]` | `[116.397428, 39.90923]` |
| defaultZoom | 默认缩放级别 | `number` | `15` |

### LocationInfo

| 参数 | 说明 | 类型 |
|------|------|------|
| lng | 经度 | `number` |
| lat | 纬度 | `number` |
| address | 详细地址 | `string` |
| province | 省份 | `string` |
| city | 城市 | `string` |
| district | 区/县 | `string` |

## 使用场景

### 场景 1：单字段存储完整信息

```tsx
<MapPicker
  value={{
    lng: 116.397428,
    lat: 39.90923,
    address: '北京市东城区长安街',
    province: '北京市',
    city: '北京市',
    district: '东城区'
  }}
  onChange={setLocation}
/>
```

### 场景 2：分离经纬度和地址字段

```tsx
<MapPicker
  value={{
    lng: formData.lng,
    lat: formData.lat,
    address: formData.address,
  }}
  onChange={(location) => {
    setFormData({
      ...formData,
      lng: location.lng,
      lat: location.lat,
      address: location.address,
    });
  }}
/>
```

### 场景 3：配合 GenericCrud 使用

```tsx
fieldOverrides: {
  // 使用组合字段
  location: {
    label: '活动地点',
    valueType: 'text',
    render: (props: any) => (
      <MapPicker
        {...props}
        config={{
          amapKey: 'your-key',
          mapType: 'amap',
          defaultCenter: [116.397428, 39.90923],
        }}
        placeholder="请点击选择活动地点"
      />
    ),
  },
}
```

## 完整示例

```tsx
import React from 'react';
import { GenericCrud } from '@/components/GenericCrud';
import MapPicker from '@/components/MapPicker';

export default function ActivitiesPage() {
  return (
    <GenericCrud
      rowKey="_id"
      headerTitle="活动管理"
      dynamicEntity={{
        entityClassName: 'CommunityActivity',
        entityName: 'communityActivity',
        fieldOverrides: {
          // 活动位置字段（存储完整 LocationInfo）
          location: {
            label: '活动地点',
            valueType: 'text',
            required: true,
            render: (props: any) => (
              <MapPicker
                {...props}
                config={{
                  // 替换为你的高德地图 Key
                  amapKey: process.env.AMAP_KEY || 'your-amap-key',
                  mapType: 'amap',
                  defaultCenter: [116.397428, 39.90923], // 北京
                  defaultZoom: 15,
                }}
                placeholder="请点击选择活动地点"
                modalTitle="选择活动地点"
                modalWidth={900}
              />
            ),
          },

          // 如果字段是分开的（address, lng, lat）
          // 可以创建一个自定义组件组合它们
          address: {
            label: '详细地址',
            valueType: 'text',
            render: (props: any) => (
              <MapPicker
                {...props}
                config={{ amapKey: 'your-key' }}
                onChange={(location) => {
                  // 同时更新多个字段
                  props.onChange({
                    address: location.address,
                    lng: location.lng,
                    lat: location.lat,
                  });
                }}
              />
            ),
          },
        },
      }}
    />
  );
}
```

## 高级用法：多字段映射

MapPicker 支持将地图选择的详细信息（经纬度、省市区等）自动填充到多个字段中。

### 完整示例

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
                placeholder="请点击选择活动地点"
                onChange={(locationInfo: any) => {
                  // 1. 更新当前字段
                  formProps.onChange?.(locationInfo);

                  // 2. 同时更新经纬度字段
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
        },
      }}
    />
  );
}
```

### LocationInfo 数据结构

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

### 字段可见性配置

- **hideInForm**: 在表单（创建/编辑）中隐藏
- **hideInTable**: 在数据列表表格中隐藏

```tsx
longitude: {
  hideInForm: true,   // 表单中不显示
  hideInTable: true,  // 表格中不显示
}
```

详细信息请参考：[字段映射配置指南](./FIELD_MAPPING.md)

## 环境变量配置

在 `.env` 文件中配置 API Key：

```env
# 高德地图 Key
AMAP_KEY=your-amap-key-here

# 百度地图 Key（可选）
BMAP_KEY=your-bmap-key-here
```

使用：

```tsx
<MapPicker
  config={{
    amapKey: process.env.AMAP_KEY,
  }}
/>
```

## 数据格式

### 存储格式建议

**方案 1：JSON 字符串（推荐）**
```json
{
  "lng": 116.397428,
  "lat": 39.90923,
  "address": "北京市东城区长安街",
  "province": "北京市",
  "city": "北京市",
  "district": "东城区"
}
```

**方案 2：分离字段**
```json
{
  "address": "北京市东城区长安街",
  "lng": 116.397428,
  "lat": 39.90923
}
```

## 样式自定义

组件使用 Ant Design 组件，可以通过全局样式或 CSS-in-JS 自定义：

```tsx
<MapPicker
  className="custom-map-picker"
/>
```

```css
.custom-map-picker .ant-btn-primary {
  background: your-color;
}
```

## 注意事项

1. **API Key 安全**：
   - 不要在前端代码中暴露敏感的 API Key
   - 建议通过环境变量或后端代理获取
   - 可以设置请求白名单限制

2. **地图加载**：
   - 首次加载可能较慢，建议显示加载提示
   - 地图脚本只在打开弹窗时加载
   - 弹窗关闭时销毁地图实例

3. **坐标系统**：
   - 高德地图：GCJ-02 坐标系（国测局坐标）
   - 百度地图：BD-09 坐标系
   - 两者不兼容，需要转换

4. **逆地理编码**：
   - 高德地图：免费 30万次/天
   - 百度地图：免费有限制
   - 建议缓存已解析的地址

5. **性能优化**：
   - 地图组件较大，建议延迟加载
   - 关闭弹窗时清理资源
   - 可以考虑使用 Web Worker

## 坐标转换

如果需要在不同坐标系间转换：

```javascript
// 百度坐标 (BD-09) 转 高德/腾讯 (GCJ-02)
function bdToGcj(bd_lng, bd_lat) {
  const x_pi = 3.14159265358979324 * 3000.0 / 180.0;
  const x = bd_lng - 0.0065;
  const y = bd_lat - 0.006;
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
  const gcj_lng = z * Math.cos(theta);
  const gcj_lat = z * Math.sin(theta);
  return { lng: gcj_lng, lat: gcj_lat };
}

// 高德/腾讯 (GCJ-02) 转 百度 (BD-09)
function gcjToBd(gcj_lng, gcj_lat) {
  const x_pi = 3.14159265358979324 * 3000.0 / 180.0;
  const z = Math.sqrt(gcj_lng * gcj_lng + gcj_lat * gcj_lat) + 0.00002 * Math.sin(gcj_lat * x_pi);
  const theta = Math.atan2(gcj_lat, gcj_lng) + 0.000003 * Math.cos(gcj_lng * x_pi);
  const bd_lng = z * Math.cos(theta) + 0.0065;
  const bd_lat = z * Math.sin(theta) + 0.006;
  return { lng: bd_lng, lat: bd_lat };
}
```

## 常见问题

### 1. 地图加载失败
- 检查 API Key 是否正确
- 检查网络连接
- 检查浏览器控制台错误信息

### 2. 点击地图没有反应
- 检查地图是否完全加载
- 尝试缩放地图后再点击
- 查看是否有 JavaScript 错误

### 3. 地址解析失败
- 检查逆地理编码是否启用
- 可能是网络问题
- 可能是 API 配额用完

### 4. 坐标不准确
- 检查坐标系是否一致
- 确认使用的地图服务
- 考虑进行坐标转换

## 浏览器兼容性

- Chrome/Edge: ✅ 完全支持
- Firefox: ✅ 完全支持
- Safari: ✅ 完全支持
- IE11: ⚠️ 需要 polyfill

## 开发建议

1. **开发环境**：
   - 使用测试 Key，避免消耗生产配额
   - 启用详细错误日志
   - 使用 React DevTools 调试

2. **生产环境**：
   - 使用正式的 API Key
   - 配置请求白名单
   - 监控 API 调用量
   - 实现错误边界

3. **测试**：
   - Mock 地图 API 进行单元测试
   - 使用 Storybook 展示组件
   - 测试不同网络环境

## 相关资源

- [高德地图 JavaScript API](https://lbs.amap.com/api/javascript-api/summary)
- [百度地图 JavaScript API](https://lbsyun.baidu.com/index.php?title=jspopular)
- [高德地图坐标转换](https://lbs.amap.com/api/javascript-api/guide/convert/convert)
- [地图选点示例](https://lbs.amap.com/demo/javascript-api/example/coordinate/transfer)
