import { request } from '@umijs/max';

/** 获取用户列表 GET /api/user/list */
export async function getUserList(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.UserInfoList>('/api/user/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建用户 POST /api/user/create */
export async function createUser(
  body: API.UserInfo,
  options?: { [key: string]: any },
) {
  return request('/api/user/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新用户 PUT /api/user/update */
export async function updateUser(
  body: API.UserInfo,
  options?: { [key: string]: any },
) {
  return request('/api/user/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户 DELETE /api/user/delete */
export async function deleteUser(
  params: {
    id?: number[];
  },
  options?: { [key: string]: any },
) {
  return request('/api/user/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
