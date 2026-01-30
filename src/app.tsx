import { history } from '@umijs/max';
import type { InitialState, UserInfo } from './types/auth';

// 注意：这里不能直接 import { request }，因为我们导出了 request 配置
// 在运行时配置中，request 会自动被注入

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 运行时配置 - 请求拦截器
export const request = {
  timeout: 60000,
  requestInterceptors: [
    (config: any) => {
      // 从 localStorage 获取 accessToken
      const accessToken = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;

      if (accessToken) {
        console.log('✅ [运行时] 请求拦截器: 添加 token', {
          url: config.url,
          hasToken: !!accessToken,
        });

        // 添加 Authorization header（不覆盖其他 headers）
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
        };
      } else {
        console.log('⚠️ [运行时] 请求拦截器: 没有 token', {
          url: config.url,
        });
      }

      return config;
    },
  ],
  responseInterceptors: [
    (response: any) => {
      console.log('📥 [运行时] 响应拦截器:', {
        status: response.status,
      });
      return response;
    },
  ],
};

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<InitialState> {
  // 从 localStorage 获取 accessToken
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    return {
      isLogin: false,
    };
  }

  try {
    // 获取用户信息（直接使用 fetch，手动添加 token）
    const response = await fetch('/api/admin/auth/info', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const res: ApiResponse = await response.json();

    if (res.code !== 200) {
      throw new Error(res.message);
    }

    const userInfo = res.data;

    return {
      token: accessToken,
      userInfo,
      isLogin: true,
    };
  } catch (error) {
    // token 无效，清除本地存储
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('adminInfo');
    return {
      isLogin: false,
    };
  }
}

// 路由守卫
export function onRouteChange({ location }: { location: { pathname: string } }) {
  const { pathname } = location;

  // 如果是登录页面，不需要检查登录状态
  if (pathname === '/login') {
    return;
  }

  // 检查是否已登录
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    // 未登录，跳转到登录页
    history.push('/login');
  }
}

 export const rootContainer = (container: React.ReactNode) => {
  return <div className="umi-root-container">{container}</div>;
};
  