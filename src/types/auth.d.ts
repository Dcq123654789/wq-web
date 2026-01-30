/**
 * 认证和用户相关类型定义
 */

/**
 * 登录参数
 */
export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
}

/**
 * 管理员信息
 */
export interface AdminInfo {
  id: string;
  username: string;
  realName: string;
  phone: string;
  email: string;
  avatar: string;
  role: number;
  roleDescription: string;
  lastLoginTime: string;
  lastLoginIp: string;
}

/**
 * 登录返回结果
 */
export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  admin: AdminInfo;
}

/**
 * 用户信息
 */
export interface UserInfo {
  _id: string;
  username: string;
  realName: string;
  phone: string;
  email: string;
  avatar: string;
  role: number;
  status: number;
  lastLoginTime: string;
  lastLoginIp: string;
  createTime: string;
  updateTime: string;
}

/**
 * 菜单权限
 */
export interface MenuPermission {
  id: number;
  parentId: number;
  name: string;
  path: string;
  component?: string;
  icon?: string;
  type: 'menu' | 'button' | 'directory';
  sort: number;
  permissions?: string[];
  visible?: boolean;
  children?: MenuPermission[];
}

/**
 * 角色信息
 */
export interface Role {
  id: number;
  name: string;
  code: string;
  description?: string;
  permissions?: string[];
  status?: number;
  createTime?: string;
  updateTime?: string;
}

/**
 * 初始状态
 */
export interface InitialState {
  token?: string;
  userInfo?: UserInfo;
  permissions?: string[];
  menus?: MenuPermission[];
  isLogin?: boolean;
}

/**
 * Request 配置
 */
export interface RequestConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

declare namespace APP {
  /**
   * 应用初始状态
   */
  typeInitialState = InitialState;
}

export {};
