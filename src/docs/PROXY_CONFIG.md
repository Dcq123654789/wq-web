# API 代理配置说明

## 📖 什么是代理？

代理（Proxy）是一种解决跨域问题的方案。开发环境中，前端运行在 `http://localhost:8000`，后端 API 运行在 `http://localhost:8080`，直接请求会产生跨域问题。

通过配置代理，前端的 `/api/*` 请求会自动转发到后端服务器。

## 🔧 配置说明

### 1. 代理配置（`.umirc.ts`）

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8080',  // 后端服务器地址
    changeOrigin: true,               // 改变请求源
    pathRewrite: { '^/api': '/api' }, // 路径重写规则
  },
}
```

**配置项说明：**

| 配置项         | 说明                                   |
| -------------- | -------------------------------------- |
| `target`       | 目标服务器地址                         |
| `changeOrigin` | 是否修改请求头的 origin，解决跨域      |
| `pathRewrite`  | 路径重写，将 `/api` 前缀替换为其他路径 |

### 2. 常见代理场景

#### 场景一：后端需要 /api 前缀

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    pathRewrite: { '^/api': '/api' }, // 保持 /api 前缀
  },
}
```

请求流程：

- 前端请求：`/api/user/list`
- 转发到：`http://localhost:8080/api/user/list`

#### 场景二：后端不需要 /api 前缀

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    pathRewrite: { '^/api': '' }, // 去掉 /api 前缀
  },
}
```

请求流程：

- 前端请求：`/api/user/list`
- 转发到：`http://localhost:8080/user/list`

#### 场景三：多个后端服务

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  },
  '/upload': {
    target: 'http://localhost:8081',
    changeOrigin: true,
  },
}
```

#### 场景四：代理 HTTPS 接口

```typescript
proxy: {
  '/api': {
    target: 'https://api.example.com',
    changeOrigin: true,
    secure: false, // 不验证 SSL 证书
  },
}
```

## 🚀 使用方法

### 1. 在代码中发起请求

```typescript
import { request } from '@umijs/max';

// 请求会自动通过代理转发到后端
const data = await request('/api/user/list');
```

### 2. 在组件中使用

```typescript
import { request } from '@umijs/max';
import { useEffect } from 'react';

export default function UserList() {
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await request('/api/user/list', {
          params: { page: 1, pageSize: 10 },
        });
        console.log(response);
      } catch (error) {
        console.error('请求失败:', error);
      }
    }
    fetchData();
  }, []);

  return <div>用户列表</div>;
}
```

## 🔍 调试技巧

### 查看代理日志

启动开发服务器后，控制台会显示代理转发日志：

```
[HPM] POST /api/login -> http://localhost:8080/api/login
[HPM] GET /api/user/list -> http://localhost:8080/api/user/list
```

### 常见问题

**问题 1：代理不生效？**

- 检查 `.umirc.ts` 中的 proxy 配置
- 确保后端服务器已启动
- 重启开发服务器：`npm run dev`

**问题 2：仍然报跨域错误？**

- 确保 `changeOrigin: true` 已配置
- 检查后端 CORS 配置

**问题 3：生产环境需要代理吗？**

- 不需要！代理仅用于开发环境
- 生产环境通过 Nginx 或后端配置解决跨域

## 📝 环境变量配置

开发环境 `.env.development`：

```bash
# 使用代理路径
API_BASE_URL=/api
```

生产环境 `.env.production`：

```bash
# 使用完整域名
API_BASE_URL=https://api.example.com
```

## 🎯 总结

| 环境     | API_BASE_URL              | 是否需要代理    |
| -------- | ------------------------- | --------------- |
| 开发环境 | `/api`                    | ✅ 需要配置代理 |
| 生产环境 | `https://api.example.com` | ❌ 不需要代理   |
