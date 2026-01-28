// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

// 使用自定义布局，移除默认 layout 配置
// export const layout = () => {
//   return {
//     logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
//     name: '电商后台管理系统',
//     top: true,
//     navTheme: 'dark',
//     headerTheme: 'light',
//     splitMenus: true,
//     siderWidth: 240,
//     menu: {
//       locale: false,
//     },
//     contentWidth: 'Fluid',
//   };
// };
