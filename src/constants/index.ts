/**
 * 应用常量配置
 */

// 应用基本信息
export const APP_NAME = '企业级项目';

// 分页配置
export const PAGE_SIZE_OPTIONS = ['10', '20', '50', '100'];
export const DEFAULT_PAGE_SIZE = 10;

// 状态枚举
export enum StatusEnum {
  DISABLED = 0, // 禁用
  ENABLED = 1, // 启用
}

// 用户状态
export const USER_STATUS = {
  [StatusEnum.DISABLED]: '禁用',
  [StatusEnum.ENABLED]: '正常',
};

// 性别枚举
export enum GenderEnum {
  MALE = 1, // 男
  FEMALE = 2, // 女,
}
