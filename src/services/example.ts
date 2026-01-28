import { request } from '@umijs/max';
import config from '@/utils/env';

/**
 * 示例 API 服务
 * 演示如何使用代理和环境变量
 */

/** 用户登录 */
export async function login(params: { username: string; password: string }) {
  return request<{
    success: boolean;
    data: {
      token: string;
      userInfo: Record<string, unknown>;
    };
  }>('/api/login', {
    method: 'POST',
    data: params,
  });
}

/** 获取用户信息 */
export async function getUserInfo() {
  return request<{
    success: boolean;
    data: Record<string, unknown>;
  }>('/api/user/info');
}

/** 获取用户列表 */
export async function getUserList(params: {
  current: number;
  pageSize: number;
}) {
  return request<{
    success: boolean;
    data: {
      list: unknown[];
      total: number;
    };
  }>('/api/user/list', {
    method: 'GET',
    params,
  });
}

/** 创建用户 */
export async function createUser(data: Record<string, unknown>) {
  return request<{
    success: boolean;
    data: Record<string, unknown>;
  }>('/api/user/create', {
    method: 'POST',
    data,
  });
}

/** 更新用户 */
export async function updateUser(id: string, data: Record<string, unknown>) {
  return request<{
    success: boolean;
    data: Record<string, unknown>;
  }>(`/api/user/update/${id}`, {
    method: 'PUT',
    data,
  });
}

/** 删除用户 */
export async function deleteUser(id: string) {
  return request<{
    success: boolean;
  }>(`/api/user/delete/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 示例：直接使用环境变量中的 API 地址
 * 通常不需要这样做，因为 request 已经配置了 baseURL
 */
export async function customRequest() {
  // 如果需要手动拼接完整 URL
  const fullUrl = `${config.apiBaseUrl}/custom/endpoint`;

  return request(fullUrl, {
    method: 'GET',
  });
}
