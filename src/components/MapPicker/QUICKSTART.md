# MapPicker 地图选择器 - 快速开始

## 🎯 功能概述

MapPicker 是一个通用的地图位置选择器组件，支持：
- 📍 点击地图选择位置
- 🌐 自动获取经纬度坐标
- 📝 逆地理编码获取详细地址
- 🏷️ 显示省市区信息
- 🗺️ 支持高德地图和百度地图

## 🚀 5 分钟快速上手

### 1. 获取 API Key

**方式 A：高德地图（推荐）**
1. 访问 https://lbs.amap.com/
2. 注册/登录账号
3. 进入控制台 → 应用管理 → 我的应用
4. 点击"创建新应用"
5. 选择"Web端(JS API)"
6. 复制获得的 Key

**方式 B：百度地图**
1. 访问 https://lbsyun.baidu.com/
2. 注册/登录账号
3. 进入控制台 → 应用管理 → 我的应用
4. 点击"创建应用"
5. 选择"浏览器端"
6. 复制获得的 AK (Access Key)

### 2. 配置环境变量

在项目根目录的 `.env.local` 文件中添加：

```bash
AMAP_KEY=你的高德地图Key
```

或在使用时直接传入：

```tsx
<MapPicker config={{ amapKey: 'your-key' }} />
```

### 3. 在页面中使用

```tsx
import MapPicker from '@/components/MapPicker';

function MyComponent() {
  const [location, setLocation] = useState({});

  return (
    <MapPicker
      value={location}
      onChange={setLocation}
      config={{
        amapKey: process.env.AMAP_KEY,
        mapType: 'amap',
        defaultCenter: [116.397428, 39.90923], // 北京
      }}
      placeholder="请选择位置"
    />
  );
}
```

### 4. 配合 GenericCrud 使用

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
          location: {
            label: '活动地点',
            render: (props) => (
              <MapPicker
                {...props}
                config={{ amapKey: process.env.AMAP_KEY }}
              />
            ),
          },
        },
      }}
    />
  );
}
```

## 📖 使用场景

### 场景 1：单字段存储

所有位置信息存储在一个 JSON 字段中：

```tsx
// 数据库存储格式
{
  "location": {
    "lng": 116.397428,
    "lat": 39.90923,
    "address": "北京市东城区长安街",
    "province": "北京市",
    "city": "北京市",
    "district": "东城区"
  }
}

// 表单配置
fieldOverrides: {
  location: {
    render: (props) => <MapPicker {...props} />,
  },
}
```

### 场景 2：多字段存储

经纬度、地址分开存储：

```tsx
// 数据库存储格式
{
  "locationAddress": {...},  // 完整位置信息
  "longitude": 116.397428,    // 单独存储经度
  "latitude": 39.90923,       // 单独存储纬度
  "province": "北京市",      // 单独存储省份
  "city": "北京市",          // 单独存储城市
  "district": "东城区"       // 单独存储区县
}

// 表单配置
fieldOverrides: {
  locationAddress: {
    label: '活动地点',
    render: (formProps: any) => (
      <MapPicker
        {...formProps}
        onChange={(locationInfo: any) => {
          // 1. 更新当前字段
          formProps.onChange?.(locationInfo);

          // 2. 使用 form API 更新其他字段
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
}
```

## 🎨 效果展示

### 1. 初始状态
```
┌────────────────────────────────────┐
│ 🔍 请选择位置              [选点]  │
└────────────────────────────────────┘
```

### 2. 点击"选点"按钮
```
┌────────────────────────────────────────────────┐
│                    选择位置              [X] │
├────────────────────────────────────────────────┤
│                                                │
│  ┌──────────────────────────────────────┐    │
│  │                                       │    │
│  │          地图区域                   │    │
│  │          (点击地图选点)             │    │
│  │                                       │    │
│  └──────────────────────────────────────┘    │
│                                                │
│  已选位置信息：                                │
│  经度: [116.397428]   纬度: [39.90923]         │
│  地址: 北京市东城区长安街                      │
│  北京市 - 北京市 - 东城区                    │
│                                                │
│                            [取消]      [确定]  │
└────────────────────────────────────────────────┘
```

### 3. 选择位置后
```
┌────────────────────────────────────┐
│ 🔍 北京市东城区长安街        [选点]  │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│ ✓ 经度: 116.397428                 │
│ ✓ 纬度: 39.90923                   │
│ 📍 北京市东城区长安街              │
└────────────────────────────────────┘
```

## ⚙️ 高级配置

### 自定义默认位置

```tsx
<MapPicker
  config={{
    defaultCenter: [121.4737, 31.2304], // 上海
    defaultZoom: 16,                    // 更大的缩放级别
  }}
/>
```

### 使用百度地图

```tsx
<MapPicker
  config={{
    mapType: 'bmap',
    bmapKey: process.env.BMAP_KEY,
    defaultCenter: [121.4737, 31.2304], // 上海
  }}
/>
```

### 自定义弹窗样式

```tsx
<MapPicker
  modalTitle="选择活动地点"
  modalWidth={1000}  // 更宽的弹窗
  placeholder="请点击选择活动举办地点"
/>
```

## 🔧 常见问题

### Q1: 地图不显示？
**A:** 检查以下几点：
1. API Key 是否正确配置
2. 网络连接是否正常
3. 浏览器控制台是否有错误
4. 是否有防火墙阻止地图加载

### Q2: 点击地图没反应？
**A:**
1. 等待地图完全加载后再点击
2. 检查是否有 JavaScript 错误
3. 尝试缩放地图后再点击

### Q3: 地址解析不准确？
**A:**
1. 高德地图和百度地图的坐标系不同
2. 可以通过坐标转换工具转换
3. 考虑使用更高精度的地图服务

### Q4: 如何隐藏经纬度输入框？
**A:** 经纬度输入框已集成在弹窗中，外部只显示地址或坐标。

## 📱 响应式支持

组件完全响应式，支持：
- 💻 桌面端：900px 宽度弹窗
- 📱 移动端：自动适配屏幕宽度
- 📱 平板：优化的触摸体验

## 🌐 浏览器支持

| 浏览器 | 版本 | 支持情况 |
|--------|------|----------|
| Chrome | 90+ | ✅ 完全支持 |
| Firefox | 88+ | ✅ 完全支持 |
| Safari | 14+ | ✅ 完全支持 |
| Edge | 90+ | ✅ 完全支持 |
| IE | 11 | ⚠️ 需要 polyfill |

## 📊 API 使用限制

### 高德地图
- 免费配额：30万次/天
- 个人开发者：完全免费
- 企业应用：可申请更高配额

### 百度地图
- 免费配额：有限制
- 个人开发者：较低配额
- 企业应用：可申请更高配额

## 🔒 安全建议

1. **不要在前端暴露生产环境的 Secret Key**
2. **设置请求白名单**（在地图平台配置）
3. **监控 API 调用量**，避免超出限制
4. **考虑通过后端代理**隐藏真实 Key

## 📚 相关文档

- [完整使用文档](./README.md)
- [高德地图文档](https://lbs.amap.com/api/javascript-api/summary)
- [百度地图文档](https://lbsyun.baidu.com/index.php?title=jspopular)

## 🎉 开始使用

现在你可以在任何需要位置选择的地方使用 MapPicker 组件了！

如果遇到问题，请查看完整文档或联系开发团队。
