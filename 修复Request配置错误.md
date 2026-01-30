# 修复 "register failed, invalid key request from plugin" 错误

## ❌ 错误原因

在 umi/max 中，不能在 `app.tsx` 中导出 `request` 配置。这是运行时配置插件限制。

**错误代码**:
```typescript
// ❌ 错误：app.tsx 中不能导出 request
export const request: RequestConfig = {
  timeout: 60000,
  requestInterceptors: [...],
  responseInterceptors: [...],
};
```

## ✅ 解决方案

将 request 配置移到独立的文件，然后在 `.umirc.ts` 中引入。

### 1. 创建 `src/requestConfig.ts`

```typescript
import { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';

export const requestConfig: RequestConfig = {
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
  responseInterceptors: [
    async (response, options) => {
      // 处理 401 错误和 token 刷新
      // ...
    },
  ],
  errorHandler: (error) => {
    // 统一错误处理
    // ...
  },
};
```

### 2. 修改 `.umirc.ts`

```typescript
import { defineConfig } from '@umijs/max';
import { requestConfig } from './src/requestConfig';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: requestConfig,  // ✅ 在这里配置 request
  routes: [...]
});
```

### 3. 简化 `src/app.tsx`

只保留运行时配置：
- `getInitialState` - 获取初始状态
- `onRouteChange` - 路由守卫
- `rootContainer` - 根容器

```typescript
import { history } from '@umijs/max';
import { getCurrentUser } from './services/auth';
import type { InitialState } from './types/auth';

export async function getInitialState(): Promise<InitialState> {
  // 初始化状态逻辑
  // ...
}

export function onRouteChange({ location }: { location: { pathname: string } }) {
  // 路由守卫逻辑
  // ...
}

export const rootContainer = (container: React.ReactNode) => {
  return <div className="umi-root-container">{container}</div>;
};
```

## 文件结构

```
src/
├── app.tsx              # 运行时配置（getInitialState, onRouteChange 等）
├── requestConfig.ts     # Request 配置（拦截器、错误处理）
├── services/
│   └── auth.ts          # API 接口
└── types/
    └── auth.d.ts        # TypeScript 类型定义

.umirc.ts                # 应用配置（引入 requestConfig）
```

## 配置说明

### `.umirc.ts` - 编译时配置

- `routes` - 路由配置
- `proxy` - 代理配置
- `request` - 请求配置 ✅
- 其他插件配置

### `app.tsx` - 运行时配置

- `getInitialState` - 初始状态
- `onRouteChange` - 路由守卫
- `layout` - 布局配置
- `rootContainer` - 根容器
- ❌ 不能有 `request`

## 验证步骤

1. **重启开发服务器**:
   ```bash
   # 停止服务器 (Ctrl+C)
   cd d:\wan-qing\wq-web
   pnpm dev
   ```

2. **检查编译结果**:
   - ✅ 不应该有 "register failed" 错误
   - ✅ 服务器正常启动

3. **测试登录功能**:
   - 访问 `http://localhost:8000/login`
   - 登录（admin / 123456）
   - 检查 Network 标签中的请求是否携带 Authorization header

4. **查看调试日志**:
   ```javascript
   // 在浏览器 Console 中应该看到
   登录成功，token 已保存: {...}
   请求拦截器: 添加 token { url: "/api/admin/auth/info", ...}
   ```

## TypeScript 验证

```bash
cd d:\wan-qing\wq-web
npx tsc --noEmit
```

✅ 应该没有编译错误

## 功能列表

### 请求拦截器 (requestConfig.ts)
- ✅ 自动添加 Authorization header
- ✅ 从 localStorage 读取 accessToken
- ✅ 调试日志输出

### 响应拦截器 (requestConfig.ts)
- ✅ 401 错误自动处理
- ✅ Token 自动刷新
- ✅ 请求队列管理
- ✅ 刷新失败跳转登录

### 错误处理 (requestConfig.ts)
- ✅ HTTP 状态码统一处理
- ✅ 友好的错误提示

### 路由守卫 (app.tsx)
- ✅ 未登录自动跳转登录页
- ✅ 登录页不受限制

### 初始状态 (app.tsx)
- ✅ 自动获取用户信息
- ✅ Token 验证
- ✅ 失效自动清除

## 相关文件

| 文件 | 说明 |
|------|------|
| `src/requestConfig.ts` | Request 配置（新增） |
| `src/app.tsx` | 运行时配置（简化） |
| `.umirc.ts` | 应用配置（更新） |
| `src/services/auth.ts` | 登录相关 API |
| `src/pages/Login/index.tsx` | 登录页面 |
| `src/types/auth.d.ts` | 类型定义 |

## 注意事项

1. **配置分离**: Request 配置必须在 `.umirc.ts` 中，不能在 `app.tsx` 中
2. **运行时配置**: `app.tsx` 只能导出运行时配置函数
3. **TypeScript**: 使用 `RequestConfig` 类型确保类型安全
4. **调试**: 保留了 Console 日志便于调试

## 测试检查清单

- [ ] 开发服务器正常启动，无报错
- [ ] 登录功能正常
- [ ] Token 保存到 localStorage
- [ ] 后续请求携带 Authorization header
- [ ] Console 中有拦截器日志
- [ ] 401 错误自动刷新 token
- [ ] Token 失效跳转登录页
