import type { ProColumns } from '@ant-design/pro-components';
import type { FormFieldConfig } from '../types';
import { extractFormFieldsFromColumns } from './columnsHelper';

/**
 * 合并表单字段配置
 * formFields 优先级高于 columns
 * @param columns ProColumns 配置数组
 * @param formFields 自定义表单字段配置（可选）
 * @returns 合并后的 FormFieldConfig 数组
 */
export function mergeFormFields<T = any>(
  columns: ProColumns<T>[],
  formFields?: FormFieldConfig[],
): FormFieldConfig[] {
  // 如果没有自定义 formFields，直接从 columns 提取
  if (!formFields || formFields.length === 0) {
    return extractFormFieldsFromColumns(columns);
  }

  // 如果 formFields 包含特殊标记，表示完全使用自定义配置
  const hasOverrideMarker = formFields.some((field) => field.__override === true);
  if (hasOverrideMarker) {
    return formFields.filter((field) => field.__override !== true);
  }

  // 从 columns 提取默认字段
  const defaultFields = extractFormFieldsFromColumns(columns);

  // 创建字段映射，便于快速查找
  const formFieldsMap = new Map<string, FormFieldConfig>();
  formFields.forEach((field) => {
    const key = Array.isArray(field.name) ? field.name[0] : field.name;
    formFieldsMap.set(key, field);
  });

  // 合并配置：formFields 优先
  const mergedFields: FormFieldConfig[] = defaultFields
    .filter((defaultField) => {
      // 如果在 formFields 中显式定义了该字段且标记为隐藏，则过滤掉
      const key = Array.isArray(defaultField.name)
        ? defaultField.name[0]
        : defaultField.name;
      const customField = formFieldsMap.get(key);
      if (customField && customField.hideInForm) {
        return false;
      }
      return true;
    })
    .map((defaultField) => {
      const key = Array.isArray(defaultField.name)
        ? defaultField.name[0]
        : defaultField.name;
      const customField = formFieldsMap.get(key);

      // 如果有自定义配置，合并
      if (customField) {
        return {
          ...defaultField,
          ...customField,
          name: customField.name, // 保持自定义的 name（可能是数组形式）
        };
      }

      return defaultField;
    });

  // 添加 formFields 中新增的字段（不在 columns 中的）
  formFields.forEach((field) => {
    const key = Array.isArray(field.name) ? field.name[0] : field.name;
    const exists = defaultFields.some(
      (df) => (Array.isArray(df.name) ? df.name[0] : df.name) === key,
    );

    if (!exists && !field.hideInForm) {
      mergedFields.push(field);
    }
  });

  return mergedFields;
}

/**
 * 从表单值中提取需要提交的数据
 * 过滤掉 undefined 和 null 值
 * @param values 表单值
 * @returns 清理后的数据
 */
export function cleanFormValues(values: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = {};

  Object.keys(values).forEach((key) => {
    const value = values[key];
    if (value !== undefined && value !== null) {
      cleaned[key] = value;
    }
  });

  return cleaned;
}

/**
 * 格式化表单初始值
 * 处理日期、时间等特殊格式
 * @param record 原始数据
 * @param formFields 表单字段配置
 * @returns 格式化后的初始值
 */
export function formatInitialValues(
  record: Record<string, any>,
  formFields: FormFieldConfig[],
): Record<string, any> {
  const initialValues: Record<string, any> = {};

  formFields.forEach((field) => {
    const key = Array.isArray(field.name) ? field.name[0] : field.name;
    const value = record[key];

    if (value !== undefined && value !== null) {
      initialValues[key] = value;
    }
  });

  return initialValues;
}

/**
 * 构建表单验证规则
 * @param field 表单字段配置
 * @returns 验证规则数组
 */
export function buildValidationRules(field: FormFieldConfig): any[] {
  const rules: any[] = field.rules || [];

  // 如果设置了 required 且没有验证规则，添加默认规则
  if (field.required && rules.length === 0) {
    rules.push({
      required: true,
      message: `请输入${field.label || '该字段'}`,
    });
  }

  return rules;
}
