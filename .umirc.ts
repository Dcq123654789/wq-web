import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {
    timeout: 60000,
    requestInterceptors: [
      (config: any) => {
        // 从 localStorage 获取 accessToken（运行时执行）
        const accessToken = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;

        if (accessToken) {
          console.log('✅ 请求拦截器: 添加 token', {
            url: config.url,
            hasToken: !!accessToken,
            tokenPrefix: accessToken.substring(0, 30) + '...',
          });

          // 添加 Authorization header
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`,
          };
        } else {
          console.log('⚠️ 请求拦截器: 没有 token', {
            url: config.url,
          });
        }

        return config;
      },
    ],
    responseInterceptors: [
      (response: any) => {
        console.log('📥 响应拦截器:', {
          status: response.status,
        });
        return response;
      },
    ],
    errorHandler: (error: any) => {
      console.error('❌ 请求错误:', error);

      if (error.response) {
        const { status } = error.response;

        if (status === 401) {
          error.message = '未授权，请重新登录';
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('adminInfo');
          }
        } else if (status === 403) {
          error.message = '没有权限访问';
        } else if (status === 404) {
          error.message = '请求的资源不存在';
        } else if (status === 500) {
          error.message = '服务器内部错误';
        }
      } else if (error.request) {
        error.message = '网络连接异常，请检查网络';
      }

      return Promise.reject(error);
    },
  },
  // 移除默认的 layout 配置，使用自定义布局
  // layout: {
  //   title: '@umijs/max',
  // },
  routes: [
    {
      path: '/login',
      component: './Login',
    },
    {
      path: '/',
      component: '@/layouts/CustomLayout',
      routes: [
        {
          path: '/',
          redirect: '/dashboard',
        },
        {
          path: '/dashboard',
          component: './Dashboard',
        },
        {
          path: '/enjoy/activities',
          component: './enjoy/activities',
        },
        {
          path: '/user/adminUser',
          component: './User/adminUser',
        },
        {
          path: '/user/wqUser',
          component: './User/wqUser',
        },
         
      ],
    },
  ],
  npmClient: 'pnpm',
  // 开发环境代理配置
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
      timeout: 60000, // 60秒超时
      pathRewrite: { '^/api': '/api' },
    },
  },
});
