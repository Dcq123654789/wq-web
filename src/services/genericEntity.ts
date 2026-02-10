import { request } from '@umijs/max';
import type { RequestData } from '@/components/GenericCrud/types';

/**
 * 实体字段信息（API 返回格式）
 */
export interface EntityFieldInfo {
  type: string;
  typeName: string;
  enumValues?: any[];
}

/**
 * 实体字段响应
 */
export interface EntityFieldsResponse {
  [fieldName: string]: EntityFieldInfo;
}

/**
 * 批处理请求参数
 */
interface BatchRequestParams {
  entity: string;
  action: 'create' | 'query' | 'update' | 'delete';
  id?: string;
  data?: Record<string, any>;
  conditions?: Record<string, any>;
  pageNum?: number;
  pageSize?: number;
  sort?: Record<string, 'asc' | 'desc'>;
  fetch?: string[];
}

/**
 * 批处理响应
 */
interface BatchResponse<T = any> {
  code: number;
  message: string;
  data: T;
  total?: number;
  pageNum?: number;
  pageSize?: number;
  timestamp: number;
}

/**
 * 获取实体字段信息
 * @param className 实体类名（如：WqUser）
 */
export async function getEntityFields(className: string): Promise<EntityFieldsResponse> {
  const response = await request<{
    code: number;
    message: string;
    data: EntityFieldsResponse;
    timestamp: number;
  }>(`/api/entity/fields/${className}`, {
    method: 'GET',
  });

  // 提取 data 字段
  return response.data;
}

/**
 * 分页查询实体数据
 * @param entity 实体名称（小写，如：wquser）
 * @param params 查询参数
 */
export async function queryEntity<T = any>(
  entity: string,
  params: {
    current?: number;
    pageSize?: number;
    conditions?: Record<string, any>;
    sort?: Record<string, 'asc' | 'desc'>;
  },
): Promise<RequestData<T>> {
  const { current, pageSize, conditions, sort } = params;

  const payload: BatchRequestParams = {
    entity,
    action: 'query',
  };

  // 只有提供了分页参数才添加分页
  if (current !== undefined && pageSize !== undefined) {
    payload.pageNum = current;
    payload.pageSize = pageSize;
  }

  if (conditions && Object.keys(conditions).length > 0) {
    payload.conditions = conditions;
  }

  if (sort) {
    payload.sort = sort;
  }

  const response = await request<{
    code: number;
    message: string;
    data: {
      content: T[];
      totalElements: number;
      totalPages: number;
      number: number;
      size: number;
      numberOfElements: number;
      first: boolean;
      last: boolean;
      empty: boolean;
    };
    timestamp: number;
  }>(`/api/batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });

  // 后端返回的是 Spring Data JPA 的 Page 格式
  // data.content 是数据数组，data.totalElements 是总记录数
  return {
    data: response.data?.content || [],
    success: response.code === 200,
    total: response.data?.totalElements || 0,
  };
}

/**
 * 创建实体记录
 * @param entity 实体名称（小写，如：wquser）
 * @param data 要创建的数据
 */
export async function createEntity(
  entity: string,
  data: Record<string, any>,
): Promise<boolean> {
  const response = await request<BatchResponse>(`/api/batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      entity,
      action: 'create',
      data,
    },
  });

  return response.code === 200;
}

/**
 * 更新实体记录
 * @param entity 实体名称（小写，如：wquser）
 * @param id 记录ID
 * @param data 要更新的数据
 */
export async function updateEntity(
  entity: string,
  id: string,
  data: Record<string, any>,
): Promise<boolean> {
  const response = await request<BatchResponse>(`/api/batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      entity,
      action: 'update',
      id,
      data,
    },
  });

  return response.code === 200;
}

/**
 * 查询单个实体记录详情
 * @param entity 实体名称（小写，如：wquser）
 * @param id 记录ID
 */
export async function getEntityById<T = any>(
  entity: string,
  id: string,
): Promise<T | null> {
  try {
    const response = await request<BatchResponse<T>>(`/api/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        entity,
        action: 'query',
        conditions: { _id: id },
        pageNum: 1,
        pageSize: 1,
      },
    });

    if (response.code === 200 && response.data) {
      // 处理返回的数据格式（可能是数组或对象）
      const data = response.data as any;
      if (Array.isArray(data.content) && data.content.length > 0) {
        return data.content[0];
      }
      return data as T;
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * 删除实体记录
 * @param entity 实体名称（小写，如：wquser）
 * @param id 记录ID或ID数组
 */
export async function deleteEntity(
  entity: string,
  id: string | string[],
): Promise<boolean> {
  // 如果是批量删除，需要逐个删除
  if (Array.isArray(id)) {
    await Promise.all(
      id.map((singleId) =>
        request<BatchResponse>(`/api/batch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            entity,
            action: 'delete',
            id: singleId,
          },
        }),
      ),
    );
    return true;
  }

  // 单个删除
  const response = await request<BatchResponse>(`/api/batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      entity,
      action: 'delete',
      id,
    },
  });

  return response.code === 200;
}
