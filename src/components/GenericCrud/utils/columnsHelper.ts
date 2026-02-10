import type { ProColumns } from '@ant-design/pro-components';
import type { FormFieldConfig } from '../types';

/**
 * 从 ProColumns 提取表单字段配置
 * @param columns ProColumns 配置数组
 * @returns FormFieldConfig 数组
 */
export function extractFormFieldsFromColumns<T = any>(
  columns: ProColumns<T>[],
): FormFieldConfig[] {
  const formFields: FormFieldConfig[] = [];

  columns.forEach((column) => {
    // 跳过 hideInForm 的列
    if (column.hideInForm || column.hideInSearch) {
      return;
    }

    const field: FormFieldConfig = {
      name: column.dataIndex as string,
      label: column.title as string,
      valueType: column.valueType || 'text',
      required: false,
    };

    // 处理 valueEnum（转换为 select）
    if (column.valueEnum) {
      field.valueType = 'select';
      field.valueEnum = column.valueEnum;
    }

    // 处理 required
    if (column.fieldProps?.rules) {
      field.required = column.fieldProps.rules.some(
        (rule: any) => rule.required === true,
      );
    }

    // 复制其他属性
    if (column.valueType) {
      field.valueType = column.valueType;
    }

    if (column.fieldProps) {
      field.fieldProps = column.fieldProps;
    }

    // ⭐ 复制关联字段配置（关键修复！）
    if ((column as any).isRelation) {
      (field as any).isRelation = (column as any).isRelation;
      // ⭐ 关联字段在表单中需要用 select 类型
      field.valueType = 'select';
    }
    if ((column as any).relationConfig) {
      (field as any).relationConfig = (column as any).relationConfig;
    }
    if ((column as any).requestAsync) {
      (field as any).requestAsync = (column as any).requestAsync;
    }

    console.log(`📋 [extractFormFieldsFromColumns] 提取字段 [${field.name}]:`, {
      valueType: field.valueType,
      isRelation: (field as any).isRelation,
      hasRelationConfig: !!(field as any).relationConfig,
    });

    formFields.push(field);
  });

  return formFields;
}

/**
 * 过滤出用于表格展示的列
 * @param columns ProColumns 配置数组
 * @returns 过滤后的 ProColumns 数组
 */
export function filterTableColumns<T = any>(columns: ProColumns<T>[]): ProColumns<T>[] {
  return columns.filter((column) => !column.hideInTable);
}

/**
 * 获取列的 dataIndex 作为字段名
 * @param column ProColumn 配置
 * @returns 字段名
 */
export function getFieldName<T = any>(column: ProColumns<T>): string {
  return (column.dataIndex as string) || (column.key as string) || '';
}

/**
 * 检查列是否需要显示在表单中
 * @param column ProColumn 配置
 * @returns 是否显示
 */
export function shouldShowInForm<T = any>(column: ProColumns<T>): boolean {
  return !column.hideInForm && !column.hideInSearch;
}
