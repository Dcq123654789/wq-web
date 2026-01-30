import { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';

// 是否正在刷新token
let isRefreshing = false;
// 失败请求队列
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

// 处理队列中的请求
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// 清除认证信息并跳转登录页
const clearAuthAndRedirect = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('adminInfo');
  history.push('/login');
};

// 刷新token的辅助函数
const refreshAccessToken = async (refreshToken: string) => {
  const { request } = require('@umijs/max');
  return request('/api/admin/auth/refresh', {
    method: 'POST',
    data: { refreshToken },
  });
};

// 排除不需要 token 的请求路径（登录、刷新token、登出等）
const EXCLUDED_PATHS = [
  '/api/admin/auth/login',    // 登录
  '/api/admin/auth/refresh',  // 刷新token
  '/api/admin/auth/logout',   // 登出
];

// 请求配置
export const requestConfig: RequestConfig = {
  timeout: 60000,
  requestInterceptors: [
    (config: any) => {
      const { url } = config;

      // 如果是登录请求，不添加 token
      if (EXCLUDED_PATHS.some((path) => url.includes(path))) {
        console.log('请求拦截器: 跳过登录请求', { url });
        return config;
      }

      // 从 localStorage 获取 accessToken
      const accessToken = localStorage.getItem('accessToken');

      // 添加调试日志
      if (accessToken) {
        console.log('请求拦截器: 添加 token', {
          url,
          hasToken: !!accessToken,
          tokenPrefix: accessToken.substring(0, 20) + '...',
        });

        // 添加 Authorization header
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
        };
      } else {
        console.log('请求拦截器: 没有 token', { url });
      }

      return config;
    },
  ],
  responseInterceptors: [
    async (response, options) => {
      const { status } = response;

      // 处理401未授权错误
      if (status === 401) {
        const refreshTokenValue = localStorage.getItem('refreshToken');

        // 如果没有refreshToken，直接跳转登录页
        if (!refreshTokenValue) {
          clearAuthAndRedirect();
          return Promise.reject({ message: '未登录或登录已过期' });
        }

        // 如果正在刷新token，将请求加入队列
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => {
            // 使用 umi 的 request 重新发送请求
            return (globalThis as any).request(options.url, {
              ...options,
              headers: {
                ...options.headers,
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            });
          });
        }

        // 开始刷新token
        isRefreshing = true;

        try {
          // 调用刷新token接口
          const res = await refreshAccessToken(refreshTokenValue);

          if (res.code !== 200 || !res.data?.accessToken) {
            throw new Error(res.message || 'Token刷新失败');
          }

          const newAccessToken = res.data.accessToken;

          // 保存新的accessToken
          localStorage.setItem('accessToken', newAccessToken);

          // 处理队列中的请求
          processQueue(null, newAccessToken);

          // 重新发送原始请求
          return (globalThis as any).request(options.url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
        } catch (error: any) {
          // 刷新失败，清除认证信息并跳转登录页
          processQueue(error, null);
          clearAuthAndRedirect();
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      return response;
    },
  ],
  errorHandler: (error) => {
    // 统一错误处理
    if (error.response) {
      // 服务器返回错误状态码
      const { status } = error.response;
      if (status === 401) {
        // 已在响应拦截器中处理401
        return Promise.reject(error);
      }
      if (status === 403) {
        error.message = '没有权限访问';
      } else if (status === 404) {
        error.message = '请求的资源不存在';
      } else if (status === 500) {
        error.message = '服务器内部错误';
      } else if (status === 502) {
        error.message = '网关错误';
      } else if (status === 503) {
        error.message = '服务不可用';
      } else if (status === 504) {
        error.message = '网关超时';
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      error.message = '网络连接异常，请检查网络';
    } else {
      // 请求配置出错
      error.message = error.message || '请求失败';
    }

    return Promise.reject(error);
  },
};
