import { history } from '@umijs/max';
import { message } from 'antd';
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

      // 添加 Authorization header（不覆盖其他 headers）
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
    (response: any) => {
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

// 白名单路由（不需要登录就能访问）
const WHITE_LIST = ['/login'];

// 渲染函数 - 在组件渲染前执行，用于路由守卫
export function render(oldRender: () => void) {
  const { pathname } = window.location;

  // 检查是否在白名单中
  if (WHITE_LIST.includes(pathname)) {
    oldRender();
    return;
  }

  // 检查是否已登录
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    // 未登录，跳转到登录页
    message.warning('请先登录');
    history.push('/login');
    oldRender();
    return;
  }

  // 已登录，正常渲染
  oldRender();
}

 export const rootContainer = (container: React.ReactNode) => {
  return <div className="umi-root-container">{container}</div>;
};
  