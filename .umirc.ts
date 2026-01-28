import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  // 移除默认的 layout 配置，使用自定义布局
  // layout: {
  //   title: '@umijs/max',
  // },
  routes: [
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
          path: '/product/list',
          component: './Product/List',
        },
        {
          path: '/product/category',
          component: './Product/Category',
        },
        {
          path: '/product/brand',
          component: './Product/Brand',
        },
        {
          path: '/product/spec',
          component: './Product/Spec',
        },
        {
          path: '/order/list',
          component: './Order/List',
        },
        {
          path: '/order/after-sale',
          component: './Order/AfterSale',
        },
        {
          path: '/user/list',
          component: './User/List',
        },
        {
          path: '/user/level',
          component: './User/Level',
        },
        {
          path: '/marketing/coupon',
          component: './Marketing/Coupon',
        },
        {
          path: '/marketing/activity',
          component: './Marketing/Activity',
        },
        {
          path: '/system/user',
          component: './System/User',
        },
        {
          path: '/system/role',
          component: './System/Role',
        },
        {
          path: '/system/menu',
          component: './System/Menu',
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
      pathRewrite: { '^/api': '/api' },
      // 如果后端不需要 /api 前缀，可以使用以下配置
      // pathRewrite: { '^/api': '' },
    },
    // 可以配置多个代理
    // '/upload': {
    //   target: 'http://localhost:8080',
    //   changeOrigin: true,
    // },
  },
});
