# MapPicker 地图选择器 - 调试指南

## 🔍 问题排查

### 问题：地图 SDK 加载超时或 API Key 错误

#### 常见错误：USERKEY_PLAT_NOMATCH

如果看到 `USERKEY_PLAT_NOMATCH` 或 `Unimplemented type: 3` 错误，说明：
- API Key 不是 Web JS API 类型的 Key
- Key 可能为 iOS/Android 服务端类型
- 需要在高德开放平台重新创建 Web 端(JS API) 应用的 Key

**获取正确的 Key：**
1. 访问 https://lbs.amap.com/
2. 登录后进入"控制台" → "应用管理" → "我的应用"
3. 点击"创建新应用"
4. 选择 **"Web端(JS API)"** 类型（⚠️ 不是 iOS 或 Android）
5. 复制获得的 Key 到配置中

#### 常见错误：INVALID_USER_SCODE (10008)

如果看到 `INVALID_USER_SCODE` 或 `infocode: "10008"` 错误，说明：
- API Key 配置了**安全码（security code）**验证
- 当前访问的域名（如 `localhost:8000`）未在白名单中
- 需要配置域名白名单或移除安全码限制

**解决方案 1：使用安全密钥（推荐）⭐**

从2021年起，高德地图引入了安全密钥机制，可以替代域名白名单限制：

1. 访问 https://console.amap.com/dev/key/app
2. 找到你的应用，可以看到"安全密钥"（securityJsCode）
3. 在组件配置中同时传入 API Key 和安全密钥：

```tsx
<MapPicker
  config={{
    amapKey: '66a9b5f73d564c9793c2b7f5af66b01f',
    amapSecret: 'b1fba6caa34acc77af75197972920754',
  }}
/>
```

或者在环境变量中配置：
```bash
AMAP_KEY=66a9b5f73d564c9793c2b7f5af66b01f
AMAP_SECRET=b1fba6caa34acc77af75197972920754
```

组件会自动配置 `window._AMapSecurityConfig`，无需手动设置。

**解决方案 2：配置域名白名单**

1. 访问 https://console.amap.com/dev/key/app
2. 找到对应的应用，点击"查看"
3. 在"设置"页面找到"安全码"配置
4. 添加以下域名到白名单：
   - `localhost` (本地开发)
   - `127.0.0.1` (本地开发)
   - 你的生产环境域名

**解决方案 3：移除安全码限制（测试环境）**

1. 访问 https://console.amap.com/dev/key/app
2. 找到对应的应用，点击"设置"
3. 将安全码设置为空或删除
4. 保存后等待几分钟生效

**解决方案 4：使用手动输入模式**
如果无法修改 Key 配置，组件会自动降级到手动输入模式：
- 点击"百度坐标拾取器"或"高德坐标拾取器"链接
- 在外部工具中选择位置
- 复制坐标到输入框
- 手动填写详细地址

#### ✅ 自动降级方案

如果地图 SDK 加载失败（例如 API Key 配置错误），组件会自动切换到**手动输入坐标模式**，提供以下功能：

1. **外部坐标拾取器链接**：
   - 百度坐标拾取器：https://api.map.baidu.com/lbsapi/getpoint/index.html
   - 高德坐标拾取器：https://lbs.amap.com/tools/picker

2. **手动输入坐标**：
   - 在外部工具中复制坐标
   - 粘贴到输入框中
   - 手动填写详细地址

3. **重试按钮**：可以随时重试加载地图 SDK

#### 解决方案 1：检查网络连接

1. 打开浏览器开发者工具（F12）
2. 切换到 **Network** 标签
3. 刷新页面
4. 查找以下请求：
   - `webapi.amap.com` - 高德地图脚本
   - `restapi.amap.com` - 高德地图 API

如果看到这些请求失败：
- 检查网络连接
- 检查是否有防火墙
- 尝试访问 https://lbs.amap.com

#### 解决方案 2：验证 API Key

在浏览器控制台执行：

```javascript
// 检查当前 API Key
console.log('当前使用的 Key:', 'c61ef52c0587cf65e395c14c438bae1f');
```

#### 解决方案 3：手动测试高德地图

1. 打开 https://lbs.amap.com/demo/javascript-api/example/2-1/map-show
2. 如果示例地图能正常显示，说明 API Key 有效
3. 如果不能显示，说明 Key 可能无效

#### 解决方案 4：检查浏览器控制台

查看控制台输出，应该看到：

**正常的日志流程：**
```
预加载地图脚本...
开始加载地图脚本...
地图类型: amap
使用 Key: c61ef52c0...
高德地图脚本 URL: https://webapi.amap.com/maps?v=2.0&key=c61ef52c0587cf65e395c14c438bae1f&plugin=AMap.Geocoder
等待 SDK 初始化...
等待 SDK... 100ms
等待 SDK... 200ms
...
地图脚本加载成功
高德地图 AMap 对象已就绪
```

**如果出现错误：**
```
地图脚本加载失败
```

说明脚本加载失败，可能是：
- API Key 无效
- 网络问题
- 被广告拦截器阻止

### 解决方案 5：临时解决方案 - 使用百度地图

如果高德地图一直无法加载，可以临时使用百度地图：

```tsx
<MapPicker
  config={{
    mapType: 'bmap',
    bmapKey: 'your-bmap-key', // 需要申请百度地图 Key
    defaultCenter: [121.4737, 31.2304], // 上海
  }}
/>
```

### 解决方案 6：使用 iframe 嵌入（备用方案）

如果上述方法都不行，可以使用 iframe 嵌入高德地图的选点器：

```tsx
// 这个方案不需要加载 JS SDK
<iframe
  src="https://m.amap.com/maps?input=116.397428,39.90923"
  style={{ width: '100%', height: '400px', border: 'none' }}
/>
```

## 🧪 测试步骤

### 1. 检查 Key 是否有效

访问以下 URL，将你的 Key 填入：
https://lbs.amap.com/demo/javascript-api/example/2-1/map-show

### 2. 查看详细的调试日志

1. 打开浏览器控制台（F12）
2. 点击"选点"按钮
3. 观察控制台输出
4. 截图发给我分析

### 3. 检查网络请求

1. 打开 Network 标签
2. 刷新页面
3. 查找 `amap.com` 相关请求
4. 检查请求状态码（应该是 200）

## 🚀 快速测试代码

创建一个测试页面验证：

```tsx
// src/pages/MapTest.tsx
import React, { useEffect } from 'react';
import { Button, Card, Space } from 'antd';

export default function MapTestPage() {
  const checkAMap = () => {
    // @ts-ignore
    console.log('window.AMap:', window.AMap);
    // @ts-ignore
    console.log('AMap exists:', typeof window.AMap !== 'undefined');

    if (typeof window.AMap !== 'undefined') {
      message.success('高德地图 SDK 已加载');
    } else {
      message.error('高德地图 SDK 未加载');
    }
  };

  const loadAMapManually = () => {
    const script = document.createElement('script');
    script.src = 'https://webapi.amap.com/maps?v=2.0&key=c61ef52c0587cf65e395c14c438bae1f&plugin=AMap.Geocoder';
    script.onload = () => {
      message.success('高德地图脚本加载成功');
    };
    script.onerror = () => {
      message.error('高德地图脚本加载失败');
    };
    document.head.appendChild(script);
  };

  return (
    <Card title="地图测试" style={{ padding: 24 }}>
      <Space direction="vertical">
        <Button type="primary" onClick={checkAMap}>
          检查 AMap 对象
        </Button>
        <Button onClick={loadAMapManually}>
          手动加载高德地图脚本
        </Button>
        <div>
          <p>当前状态:</p>
          <pre style={{ background: '#f5f5f5', padding: 16 }}>
            {JSON.stringify({
              amapLoaded: typeof window.AMap !== 'undefined',
              hasConfig: !!config.amapKey,
            }, null, 2)}
          </pre>
        </div>
      </Space>
    </Card>
  );
}
```

## 🌐 网络请求白名单

确保以下域名在白名单中：
- `webapi.amap.com`
- `restapi.amap.com`
- `lbs.amap.com`

如果你使用了广告拦截器，请将其设置为不拦截高德地图的请求。

## 📋 常见问题

### Q1: 一直显示"地图加载中"
**A:** 查看控制台是否有错误。如果没有日志输出，说明脚本根本没加载。

### Q2: 显示"SDK 加载超时"
**A:** 已增加最多10秒等待时间。如果还是超时，说明脚本加载失败或 window.AMap 对象未初始化。

### Q3: 有错误提示"API Key 配置错误"
**A:** 请访问高德开放平台验证 Key 是否有效。

### Q4: 点击地图没反应
**A:** 等待地图完全加载后再点击，地图加载需要几秒钟。

## 🔧 高级调试

### 在浏览器控制台手动测试

```javascript
// 1. 检查 AMap 是否存在
console.log('AMap:', window.AMap);

// 2. 手动加载地图脚本
const script = document.createElement('script');
script.src = 'https://webapi.amap.com/maps?v=2.0&key=c61ef52c0587cf65e395c14c438bae1f&plugin=AMap.Geocoder';
document.head.appendChild(script);

// 3. 测试地图创建
setTimeout(() => {
  const map = new window.AMap.Map('test-map', {
    zoom: 11,
    center: [116.397428, 39.90923],
  });
  console.log('地图创建成功:', map);
}, 2000);
```

### 检查 Content Security Policy

如果网站使用了 CSP（内容安全策略），需要添加：

```html
<!-- 在 index.html 中 -->
<meta http-equiv="Content-Security-Policy" content="
  script-src 'self' 'unsafe-inline' https://webapi.amap.com https://restapi.amap.com;
">
```

## 📞 获取支持

如果以上方法都无法解决：

1. **截图控制台的错误信息**
2. **截图 Network 标签中的请求详情**
3. **提供你的高德地图 Key 前几位（不要提供完整 Key）**
4. **说明你的浏览器版本和操作系统**

我可以帮你进一步分析问题。
