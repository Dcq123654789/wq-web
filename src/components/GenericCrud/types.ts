import type { ProColumns } from '@ant-design/pro-components';
import type { ReactNode } from 'react';

/**
 * 请求返回数据格式
 */
export interface RequestData<T = any> {
  data: T[];
  success: boolean;
  total: number;
}

/**
 * 实体字段信息（API 返回格式）
 */
export interface EntityFieldInfo {
  type: string;
  typeName: string;
  description?: string;
  enumValues?: any[];
}

/**
 * 字段覆盖配置
 */
export interface FieldOverrideConfig {
  [fieldName: string]: Partial<FormFieldConfig>;
}

/**
 * 表单字段配置
 */
export interface FormFieldConfig {
  name: string | string[];
  label?: string;
  valueType?: string;
  required?: boolean;
  rules?: any[];
  render?: (props: FormFieldRenderProps) => ReactNode;
  [key: string]: any;
}

/**
 * 表单字段渲染属性
 */
export interface FormFieldRenderProps {
  value?: any;
  onChange?: (value: any) => void;
  record?: any;
  mode?: 'create' | 'update';
  form?: any; // ProForm 的 form 实例，可用于设置其他字段的值
}

/**
 * CRUD 操作函数
 */
export interface CrudOperations<T = any> {
  list: (params: any, sort: any) => Promise<RequestData<T>>;
  create?: (data: any) => Promise<boolean>;
  update?: (id: any, data: any) => Promise<boolean>;
  delete?: (id: any | any[]) => Promise<boolean>;
}

/**
 * 功能开关配置
 */
export interface FeatureConfig {
  create?: boolean;
  update?: boolean;
  delete?: boolean;
  batchDelete?: boolean;
  selection?: boolean;
  export?: boolean;
}

/**
 * UI 配置
 */
export interface UIConfig {
  search?: {
    labelWidth?: number;
    span?: number;
    collapsed?: boolean;
  };
  table?: {
    size?: 'small' | 'middle' | 'large';
    pagination?: any;
  };
  createModal?: {
    title?: string;
    width?: number | string;
  };
  updateModal?: {
    title?: string;
    width?: number | string;
  };
}

/**
 * 权限配置
 */
export interface PermissionConfig {
  create?: boolean | string;
  update?: boolean | string;
  delete?: boolean | string;
}

/**
 * 操作上下文
 */
export interface ActionContext<T = any> {
  handleEdit: () => void;
  handleDelete: () => void;
  record: T;
}

/**
 * 工具栏上下文
 */
export interface ToolbarContext {
  handleCreate: () => void;
  handleBatchDelete: () => void;
  handleExport: () => void;
  selectedRows: any[];
  selectedRowKeys: any[];
}

/**
 * 回调函数配置
 */
export interface CallbackConfig {
  onCreateSuccess?: () => void;
  onUpdateSuccess?: () => void;
  onDeleteSuccess?: () => void;
  onError?: (error: any, operation: 'list' | 'create' | 'update' | 'delete') => void;
}

/**
 * 自定义表单组件配置
 */
export interface CustomFormComponents {
  create?: React.ComponentType<any>;
  update?: React.ComponentType<any>;
}

/**
 * 关联实体配置
 */
export interface RelationConfig {
  // 关联实体类名（如：Community）
  entityClassName: string;

  // 关联实体名称（小写，如：community）
  entityName: string;

  // 显示字段（默认：name）
  displayField?: string;

  // 值字段（默认：_id）
  valueField?: string;

  // 是否多选
  multiple?: boolean;
}

/**
 * 动态实体配置
 */
export interface DynamicEntityConfig {
  // 实体类名（如：WqUser）
  entityClassName: string;

  // 实体名称（小写，如：wquser）
  entityName: string;

  // 排除的字段
  excludeFields?: string[];

  // 字段覆盖配置
  fieldOverrides?: FieldOverrideConfig;

  // 关联实体配置（字段名 -> 关联配置）
  relations?: {
    [fieldName: string]: RelationConfig;
  };

  // ⭐ 新增：数据包装字段（所有表单字段包装到该属性中）
  // 例如：dataField = "data"，提交时变为 { data: { name: "张三", age: 25 } }
  dataField?: string;
}

/**
 * 通用 CRUD 配置
 */
export interface GenericCrudConfig<T = any> {
  // ===== 动态模式（新增） =====
  // 动态实体配置（与 columns/formFields 二选一）
  dynamicEntity?: DynamicEntityConfig;

  // ===== 静态模式（原有） =====
  // 基础配置
  rowKey?: string;
  headerTitle?: string;

  // 列配置（用于表格和默认表单）
  columns?: ProColumns<T>[];

  // 表单配置（可选，覆盖 columns 的表单配置）
  formFields?: FormFieldConfig[];

  // CRUD 操作函数（完全自定义）
  crudOperations?: CrudOperations<T>;

  // 自定义表单组件（可选）
  customFormComponents?: CustomFormComponents;

  // 功能开关
  features?: FeatureConfig;

  // UI 配置
  ui?: UIConfig;

  // 权限控制（可选）
  permissions?: PermissionConfig;

  // 自定义渲染
  renderItemActions?: (record: T, actions: ActionContext<T>) => ReactNode;
  renderToolbar?: (actions: ToolbarContext) => ReactNode;

  // 回调函数
  callbacks?: CallbackConfig;

  // ⭐ 新增：表单默认值（用于创建表单的初始值）
  data?: Record<string, any>;
}

/**
 * DynamicForm 组件 Props
 */
export interface DynamicFormProps {
  formFields: FormFieldConfig[];
  mode: 'create' | 'update';
  initialValues?: any;
  onSubmit: (values: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

/**
 * CreateModal 组件 Props
 */
export interface CreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  formFields: FormFieldConfig[];
  title?: string;
  width?: number | string;
  loading?: boolean;
  customFormComponent?: React.ComponentType<any>;
  data?: Record<string, any>; // ⭐ 新增：表单默认值
}

/**
 * UpdateModal 组件 Props
 */
export interface UpdateModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  formFields: FormFieldConfig[];
  record: any;
  title?: string;
  width?: number | string;
  loading?: boolean;
  customFormComponent?: React.ComponentType<any>;
  dataField?: string; // ⭐ 新增：数据包装字段
}
