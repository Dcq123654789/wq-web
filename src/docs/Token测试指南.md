# Token 携带测试指南

## 已修复的问题

✅ 移除了 `.umirc.ts` 中的 `request: {}` 空配置，该配置会覆盖 `app.tsx` 中的请求拦截器

✅ 在请求拦截器中添加了调试日志

## 测试步骤

### 1. 重启开发服务器

```bash
# 停止当前运行的服务器 (Ctrl+C)
# 然后重新启动
cd d:\wan-qing\wq-web
pnpm dev
```

### 2. 打开浏览器开发者工具

1. 打开 Chrome/Edge 浏览器
2. 按 `F12` 打开开发者工具
3. 切换到 `Console` 标签页
4. 切换到 `Network` 标签页

### 3. 执行登录

1. 访问 `http://localhost:8000/login`
2. 输入账号密码（admin / 123456）
3. 点击登录

### 4. 验证 Console 日志

在 Console 中应该看到：

```javascript
// 登录成功后的日志
登录成功，token 已保存: {
  accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJ0b2tlblR5cGUiOiJ...",
  refreshToken: "eyJhbGciOiJIUzUxMiJ9.eyJ0b2tlblR5cGUiOiJ...",
  admin: { id: "1769754330831_9070", username: "admin", ... }
}
```

### 5. 验证 localStorage

在 Console 中执行：

```javascript
// 查看所有存储的 token
console.log('accessToken:', localStorage.getItem('accessToken'));
console.log('refreshToken:', localStorage.getItem('refreshToken'));
console.log('adminInfo:', localStorage.getItem('adminInfo'));
```

### 6. 验证后续请求携带 Token

在 `Network` 标签页中：

1. 找到 `/api/admin/auth/info` 请求
2. 点击该请求
3. 查看 `Headers` 标签
4. 在 `Request Headers` 中应该看到：

```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

同时在 Console 中应该看到：

```javascript
请求拦截器: 添加 token {
  url: "/api/admin/auth/info",
  hasToken: true,
  tokenPrefix: "eyJhbGciOiJIUzUxMiJ9..."
}
```

### 7. 如果 Token 没有携带

如果看不到 Authorization header，请检查：

#### A. 检查 localStorage 是否有 token

```javascript
console.log(localStorage.getItem('accessToken'));
```

如果返回 `null`，说明登录时 token 没有保存成功。

#### B. 检查请求拦截器是否执行

在 Network 标签中查看所有请求，看是否有拦截器的日志输出。

#### C. 清除缓存重试

```javascript
// 在 Console 中执行
localStorage.clear();
location.reload();
```

然后重新登录。

## 可能的问题和解决方案

### 问题 1: 请求拦截器不执行

**原因**: `.umirc.ts` 中的 `request: {}` 配置覆盖了 `app.tsx` 中的配置

**解决**: 已修复，移除了 `.umirc.ts` 中的 `request: {}`

### 问题 2: Token 保存失败

**检查点**:
- 登录接口返回的数据格式是否正确
- `res.data.accessToken` 是否存在

**调试**:
```javascript
// 在登录页面的 onFinish 函数中添加
console.log('登录响应:', res);
console.log('accessToken:', res?.data?.accessToken);
```

### 问题 3: Token 存在但请求未携带

**原因**: 请求拦截器没有正确添加 header

**调试**:
```javascript
// 在 app.tsx 的请求拦截器中添加断点或日志
console.log('拦截器执行:', config.url);
console.log('Token:', localStorage.getItem('accessToken'));
```

## 手动测试 Token 携带

在 Console 中执行：

```javascript
// 手动测试请求是否携带 token
import { request } from '@umijs/max';

request('/api/admin/auth/info', {
  method: 'GET',
})
  .then(res => console.log('请求成功:', res))
  .catch(err => console.error('请求失败:', err));
```

在 Network 标签中查看该请求是否携带了 Authorization header。

## 验证配置文件

### .umirc.ts (正确配置)

```typescript
export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  // 注意：不要有 request: {}
  routes: [...]
});
```

### app.tsx (请求拦截器)

```typescript
export const request: RequestConfig = {
  timeout: 60000,
  requestInterceptors: [
    (config: any) => {
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
        };
      }

      return config;
    },
  ],
  // ...
};
```

## 预期结果

### 登录后

✅ localStorage 中保存了三个值：
- `accessToken`
- `refreshToken`
- `adminInfo`

✅ 所有 `/api/admin/*` 请求都携带 Authorization header

✅ Console 中有拦截器日志输出

### Network 请求示例

```
GET /api/admin/auth/info HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJ0b2tlblR5cGUiOiJhZG1pbiIsInVzZXJJZCI6IjE3Njk3NTQzMzA4MzFfOTA3MCIsInVzZXJuYW1lIjoiYWRtaW4iLCJzdWIiOiIxNzY5NzU0MzMwODMxXzkwNzAiLCJpYXQiOjE3Njk3NTQ3ODIsImV4cCI6MTc3MDM1OTU4MiwiaXNzIjoid2FucWluZyJ9.ZSy_e6Z4ZIIs4nbKgNd8RWweeccwyUce7tj2DHcsksK_H6mWvYuRSAffIL2u0-k_NDEfGWb-tFQpstF84GjUTA
```

## 联系支持

如果按照以上步骤仍然无法解决问题，请提供以下信息：

1. Console 的完整日志输出
2. Network 标签中 `/api/admin/auth/info` 请求的完整 headers
3. localStorage 的内容（截图或复制）
4. `.umirc.ts` 和 `app.tsx` 的相关配置部分
