import { request } from '@umijs/max';
import type { LoginParams, LoginResult, UserInfo, AdminInfo } from '@/types/auth';

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

/**
 * 登录接口
 */
export async function login(params: LoginParams) {
  return request<ApiResponse<LoginResult>>('/api/admin/auth/login', {
    method: 'POST',
    data: params,
  });
}

/**
 * 登出接口
 */
export async function logout() {
  return request<ApiResponse>('/api/admin/auth/logout', {
    method: 'POST',
  });
}

/**
 * 获取当前管理员信息
 */
export async function getCurrentUser() {
  return request<ApiResponse<UserInfo>>('/api/admin/auth/info', {
    method: 'GET',
  });
}

/**
 * 刷新 token
 */
export async function refreshToken(refreshToken: string) {
  return request<ApiResponse<{ accessToken: string; tokenType: string }>>('/api/admin/auth/refresh', {
    method: 'POST',
    data: { refreshToken },
  });
}

/**
 * 验证 token
 */
export async function validateToken(token: string) {
  return request<ApiResponse<{ valid: boolean; adminId: string; username: string; tokenType: string }>>('/api/admin/auth/validate', {
    method: 'POST',
    data: { token },
  });
}
