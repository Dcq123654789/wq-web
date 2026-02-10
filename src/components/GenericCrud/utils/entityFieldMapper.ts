import React from 'react';
import type { ProColumns } from '@ant-design/pro-components';
import type { FormFieldConfig, RelationConfig } from '../types';
import { getEntityFields, queryEntity } from '@/services/genericEntity';

/**
 * 实体字段信息（API 返回格式）
 */
export interface EntityFieldInfo {
  [fieldName: string]: {
    name?: string;
    type: string;
    typeName?: string;
    description?: string;
    enumType?: string;
    enumValues?: any[] | Record<string, string>;
  };
}

/**
 * 字段覆盖配置
 */
export interface FieldOverrideConfig {
  [fieldName: string]: Partial<FormFieldConfig>;
}

/**
 * 将枚举值转换为 ProTable 可用的格式
 * 支持两种格式：
 * 1. 数组格式: [{ value: 0, label: '报名中' }, { value: 1, label: '报名结束' }]
 * 2. 对象格式: { "0": "报名中", "1": "报名结束" }
 */
function convertEnumValuesToValueEnum(enumValues: any[] | Record<string, string> | undefined): Record<string, any> | undefined {
  if (!enumValues) return undefined;

  // 对象格式: { "0": "报名中", "1": "报名结束" }
  if (!Array.isArray(enumValues)) {
    return Object.entries(enumValues).reduce((acc: Record<string, any>, [key, value]) => {
      const numKey = isNaN(Number(key)) ? key : Number(key);
      acc[numKey] = {
        text: value,
      };
      return acc;
    }, {});
  }

  // 数组格式: [{ value: 0, label: '报名中' }, { value: 1, label: '报名结束' }]
  return enumValues.reduce((acc: Record<string, any>, item: any) => {
    if (typeof item === 'object' && item.value !== undefined) {
      acc[item.value] = {
        text: item.label || item.text || item.value,
        status: item.status,
      };
    } else {
      acc[item] = { text: String(item) };
    }
    return acc;
  }, {});
}

/**
 * Java 类型映射到 ProTable valueType
 */
export function mapFieldTypeToValueType(typeName: string): string {
  const typeMap: Record<string, string> = {
    // 字符串类型
    String: 'text',
    string: 'text',
    'java.lang.String': 'text',

    // 数字类型
    Integer: 'digit',
    int: 'digit',
    'java.lang.Integer': 'digit',
    Long: 'digit',
    long: 'digit',
    'java.lang.Long': 'digit',
    Double: 'digit',
    double: 'digit',
    Float: 'digit',
    float: 'digit',
    Short: 'digit',
    short: 'digit',

    // 布尔类型
    Boolean: 'switch',
    boolean: 'switch',
    'java.lang.Boolean': 'switch',

    // 日期时间类型
    Date: 'dateTime',
    date: 'date',
    DateTime: 'dateTime',
    dateTime: 'dateTime',
    Timestamp: 'dateTime',
    timestamp: 'dateTime',
    LocalDate: 'date',
    'java.time.LocalDate': 'date',
    LocalDateTime: 'dateTime',
    'java.time.LocalDateTime': 'dateTime',
    'java.sql.Timestamp': 'dateTime',

    // 金额类型
    BigDecimal: 'money',
    bigDecimal: 'money',
    'java.math.BigDecimal': 'money',

    // 文本类型
    Text: 'textarea',
    text: 'textarea',
  };

  return typeMap[typeName] || 'text';
}

/**
 * 将字段名转换为标题
 */
export function fieldNameToTitle(fieldName: string): string {
  // 处理驼峰命名，转换为中文友好的标题
  // 例如：userName -> 用户名, phoneNumber -> 电话号码
  const fieldTitleMap: Record<string, string> = {
    // 基础字段
    id: 'ID',
    _id: 'ID',
    name: '名称',
    title: '标题',
    code: '编码',
    type: '类型',
    status: '状态',
    description: '描述',
    remark: '备注',

    // 时间字段
    createTime: '创建时间',
    updateTime: '更新时间',
    birthDate: '出生日期',

    // 用户字段
    openid: 'OpenID',
    unionid: 'UnionID',
    username: '用户名',
    nickname: '昵称',
    password: '密码',
    realName: '真实姓名',
    phone: '手机号',
    phoneNumber: '手机号',
    email: '邮箱',
    avatar: '头像',
    gender: '性别',

    // 地址字段
    province: '省份',
    city: '城市',
    district: '区县',
    detailAddress: '详细地址',

    // 社区字段
    communityId: '社区ID',
    communityName: '社区名称',
    community: '社区',

    // 权限字段
    role: '角色',
    roles: '角色',
    permission: '权限',
    permissions: '权限',
    enabled: '启用状态',
    deleted: '删除状态',

    // 排序字段
    sort: '排序',
    order: '排序',
    serialVersionUID: '序列号',
  };

  if (fieldTitleMap[fieldName]) {
    return fieldTitleMap[fieldName];
  }

  // 如果没有映射，返回原字段名
  return fieldName;
}

/**
 * 检查是否为复杂对象类型
 */
function isComplexType(typeName: string): boolean {
  const complexTypes = [
    'Community',
    'Entity',
    'Object',
  ];
  return complexTypes.some(type => typeName.includes(type)) ||
         typeName.startsWith('com.example.') ||
         typeName.startsWith('org.');
}

/**
 * 根据字段名和类型获取列宽
 */
function getColumnWidth(fieldName: string, valueType: string): number | undefined {
  // ID字段 - 较窄
  if (fieldName === '_id' || fieldName === 'id') {
    return 180;
  }

  // 时间字段 - 固定宽度
  if (fieldName.includes('Time') || fieldName.includes('Date')) {
    return 160;
  }

  // 状态字段 - 较窄
  if (fieldName === 'status' || fieldName === 'gender' || fieldName === 'deleted') {
    return 80;
  }

  // 文本类型字段
  if (valueType === 'text' || valueType === 'textarea') {
    // 根据字段名判断可能的内容长度
    if (fieldName === 'nickname' || fieldName === 'username') {
      return 120;
    }
    if (fieldName === 'phone' || fieldName === 'email') {
      return 140;
    }
    if (fieldName === 'realName') {
      return 100;
    }
    // 地址相关字段
    if (fieldName.includes('address') || fieldName === 'province' || fieldName === 'city' || fieldName === 'district') {
      return 120;
    }
    // OpenID 等长字符串
    if (fieldName === 'openid' || fieldName === 'unionid') {
      return 200;
    }
  }

  // 数字类型 - 较窄
  if (valueType === 'digit') {
    return 100;
  }

  // 其他字段不设置宽度，自适应
  return undefined;
}

/**
 * 转换实体字段为 ProColumns 配置
 */
export function convertEntityFieldsToColumns(
  entityFields: EntityFieldInfo,
  excludeFields: string[] = [],
  fieldOverrides?: FieldOverrideConfig,
  relations?: { [fieldName: string]: RelationConfig },
  match?: true | { [fieldName: string]: string }, // ⭐ match：控制显示哪些查询条件
): ProColumns[] {
  const columns: ProColumns[] = [];

  // ⭐ 判断哪些字段应该在查询中显示
  // match: true - 显示所有字段
  // match: { name: '名称' } - 只显示指定字段
  // 默认: 只显示前三个字段
  let searchFields: string[] = [];

  if (match === true) {
    // 显示所有字段的查询条件
    searchFields = Object.keys(entityFields);
  } else if (match && typeof match === 'object') {
    // 只显示指定字段的查询条件
    searchFields = Object.keys(match);
  } else {
    // 默认只显示前三个字段（排除已经隐藏的字段）
    let count = 0;
    Object.entries(entityFields).forEach(([fieldName, fieldInfo]) => {
      // 排除复杂对象类型
      const fullTypeName = fieldInfo.typeName || fieldInfo.type || '';
      if (excludeFields.includes(fieldName)) return;
      if (fieldName === 'serialVersionUID') return;
      if (isComplexType(fullTypeName)) return;
      // 排除某些不适合查询的字段
      if (fieldName === 'password' || fieldName === 'openid' || fieldName === 'avatar') return;

      if (count < 3) {
        searchFields.push(fieldName);
        count++;
      }
    });
  }

  console.log('🔍 查询字段配置 (match):', { match, searchFields });

  Object.entries(entityFields).forEach(([fieldName, fieldInfo]) => {
    // 排除指定字段
    if (excludeFields.includes(fieldName)) {
      return;
    }

    // 排除复杂对象类型（如 Community）
    const fullTypeName = fieldInfo.typeName || fieldInfo.type || '';

    // 检查是否是关联字段
    const isRelation = relations && relations[fieldName];

    // 如果是复杂类型但不是关联字段，则排除
    if (!isRelation && isComplexType(fullTypeName)) {
      return;
    }

    // 排除序列化版本号
    if (fieldName === 'serialVersionUID') {
      return;
    }

    const { typeName, type, enumValues, description } = fieldInfo;

    // 优先使用 typeName，如果没有则使用 type
    const actualTypeName = typeName || type || '';

    // 优先使用 API 返回的 description，其次使用映射，最后使用字段名
    let title = description || fieldNameToTitle(fieldName);

    // 应用字段覆盖配置中的 label（如果有）
    if (fieldOverrides && fieldOverrides[fieldName] && fieldOverrides[fieldName].label) {
      title = fieldOverrides[fieldName].label!;
    }

    // 调试：打印标题信息
    if (fieldName === 'openid' || fieldName === 'nickname') {
      console.log(`字段 [${fieldName}] - type: ${type}, typeName: ${typeName}, description: "${description}", 最终标题:`, title);
    }

    const column: ProColumns = {
      title: title as any, // 确保 title 不会被自动格式化
      dataIndex: fieldName,
      key: fieldName,
      valueType: mapFieldTypeToValueType(actualTypeName) as any,
      sorter: true,
      // ⭐ 根据 searchFields 决定是否在查询中显示
      hideInSearch: !searchFields.includes(fieldName),
      // 为长文本字段设置宽度，避免占用过多空间
      width: getColumnWidth(fieldName, actualTypeName),
    };

    // ⭐ 应用字段覆盖配置（排除表单专用渲染器）
    if (fieldOverrides && fieldOverrides[fieldName]) {
      // 创建一个副本，排除表单专用的渲染器
      const overrides = { ...fieldOverrides[fieldName] };
      delete overrides.renderFormItem; // 移除表单专用渲染器
      delete overrides.renderForm;     // 移除另一个可能的表单渲染器属性
      delete overrides.render;         // 移除 render（表单渲染器）
      // ⭐ 将 renderTable 映射到 render（ProTable 列的渲染器）
      if (overrides.renderTable !== undefined) {
        (column as any).render = overrides.renderTable;
        delete overrides.renderTable;
      }
      // ⭐ 如果字段覆盖中已经设置了 hideInSearch，保持它的优先级
      if (overrides.hideInSearch === undefined) {
        delete overrides.hideInSearch;
      }
      Object.assign(column, overrides);
      console.log(`✅ 应用字段覆盖 [${fieldName}]:`, overrides);
    }

    // 头像字段使用图片渲染
    if (fieldName === 'avatar' || fieldName === 'headImg' || fieldName === 'imageUrl') {
      column.valueType = 'image';
      column.width = 80;
      // 自定义渲染函数，确保图片正确显示
      (column as any).render = (_: any, record: any) => {
        const url = record[fieldName];
        if (!url) return '-';
        return React.createElement('img', {
          src: url,
          alt: fieldName,
          style: { width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }
        });
      };
      console.log(`Avatar column [${fieldName}]:`, column);
    }

    // 性别字段特殊处理：1=男，2=女
    if (fieldName === 'gender') {
      column.valueType = 'select';
      column.valueEnum = {
        1: { text: '男' },
        2: { text: '女' },
      };
    }
    // 如果有枚举值，配置为选择器
    else if (enumValues) {
      const valueEnum = convertEnumValuesToValueEnum(enumValues);
      if (valueEnum) {
        column.valueType = 'select';
        column.valueEnum = valueEnum;
      }
    }
    // 关联字段特殊处理
    else if (isRelation) {
      const relationConfig = relations![fieldName];
      const displayField = relationConfig.displayField || 'name';

      column.valueType = 'text';

      // ⭐ 保存关联字段配置到 column 对象（关键修复！）
      (column as any).isRelation = true;
      (column as any).relationConfig = relationConfig;
      (column as any).requestAsync = true;

      console.log(`🔗 [convertEntityFieldsToColumns] 关联字段 [${fieldName}] 配置:`, {
        isRelation: true,
        relationConfig,
      });

      // 自定义渲染：显示关联对象的名称
      (column as any).render = (_: any, record: any) => {
        const relationValue = record[fieldName];

        // 如果是嵌套对象，直接显示指定字段
        if (relationValue && typeof relationValue === 'object') {
          return relationValue[displayField] || '-';
        }

        // 如果是 ID 值，显示 ID（后续可能需要通过 API 查询名称）
        if (relationValue) {
          return relationValue;
        }

        return '-';
      };
    }

    columns.push(column);
  });

  return columns;
}

/**
 * 转换实体字段为表单字段配置
 */
export function convertEntityFieldsToFormFields(
  entityFields: EntityFieldInfo,
  excludeFields: string[] = [],
  fieldOverrides?: FieldOverrideConfig,
  relations?: { [fieldName: string]: RelationConfig },
): FormFieldConfig[] {
  const formFields: FormFieldConfig[] = [];

  console.log('🔗 [convertEntityFieldsToFormFields] 开始处理表单字段');
  console.log('🔋 所有后端字段:', Object.keys(entityFields));
  console.log('📋 excludeFields:', excludeFields);
  console.log('🔗 relations 配置:', relations);

  Object.entries(entityFields).forEach(([fieldName, fieldInfo]) => {
    // 🔍 调试：特别是 communityId 字段
    if (fieldName === 'communityId' || fieldName.includes('Id')) {
      console.log(`🔍 检查字段 [${fieldName}]:`, {
        fieldInfo,
        inExcludeFields: excludeFields.includes(fieldName),
        fullTypeName: fieldInfo.typeName || fieldInfo.type || '',
        isComplexType: isComplexType(fieldInfo.typeName || fieldInfo.type || ''),
        isRelation: relations && relations[fieldName],
        relationConfig: relations?.[fieldName],
      });
    }

    // 排除指定字段
    if (excludeFields.includes(fieldName)) {
      console.log(`❌ 字段 [${fieldName}] 被排除（在 excludeFields 中）`);
      return;
    }

    // 排除复杂对象类型（如 Community）
    const fullTypeName = fieldInfo.typeName || fieldInfo.type || '';

    // 检查是否是关联字段
    const isRelation = relations && relations[fieldName];

    console.log(`🔍 字段 [${fieldName}] 检查:`, {
      fullTypeName,
      isRelation: !!isRelation,
      relationsKeys: relations ? Object.keys(relations) : 'no relations',
      hasThisFieldInRelations: !!(relations && relations[fieldName]),
    });

    // 如果是复杂类型但不是关联字段，则排除
    if (!isRelation && isComplexType(fullTypeName)) {
      console.log(`❌ 字段 [${fieldName}] 被排除（复杂类型且不是关联字段）`);
      return;
    }

    // 排除序列化版本号
    if (fieldName === 'serialVersionUID') {
      return;
    }

    // 排除只读字段（ID、时间戳等）
    if (fieldName === '_id' || fieldName === 'createTime' || fieldName === 'updateTime') {
      return;
    }

    const { typeName, type, enumValues, description } = fieldInfo;

    // 优先使用 typeName，如果没有则使用 type
    const actualTypeName = typeName || type || '';
    const valueType = mapFieldTypeToValueType(actualTypeName);

    // 优先使用 API 返回的 description，其次使用映射
    const label = description || fieldNameToTitle(fieldName);

    const formField: FormFieldConfig = {
      name: fieldName,
      label,
      valueType: valueType as any,
      required: fieldName === 'name' || fieldName === 'username' || fieldName === 'phone',
    };

    // 头像字段使用上传组件
    if (fieldName === 'avatar' || fieldName === 'headImg' || fieldName === 'imageUrl') {
      formField.valueType = 'image' as any;
    }

    // 性别字段特殊处理：1=男，2=女
    if (fieldName === 'gender') {
      formField.valueType = 'select';
      (formField as any).valueEnum = {
        1: { text: '男' },
        2: { text: '女' },
      };
    }
    // 如果有枚举值，配置为选择器
    else if (enumValues) {
      const valueEnum = convertEnumValuesToValueEnum(enumValues);
      if (valueEnum) {
        formField.valueType = 'select';
        (formField as any).valueEnum = valueEnum;
      }
    }
    // 关联字段：配置为 select 类型，并添加关联配置供后续使用
    else if (isRelation) {
      formField.valueType = 'select';
      (formField as any).isRelation = true;
      (formField as any).relationConfig = relations![fieldName];

      // 标记为异步选择器，需要动态加载选项
      (formField as any).requestAsync = true;

      console.log(`✅ 关联字段 [${fieldName}] 已配置:`, {
        valueType: formField.valueType,
        isRelation: (formField as any).isRelation,
        relationConfig: (formField as any).relationConfig,
      });
    }

    // 应用字段覆盖配置
    if (fieldOverrides && fieldOverrides[fieldName]) {
      Object.assign(formField, fieldOverrides[fieldName]);
      if (fieldName === 'communityId') {
        console.log(`⚠️ 关联字段 [${fieldName}] 被 fieldOverrides 覆盖:`, fieldOverrides[fieldName]);
      }
    }

    // 🔍 添加 communityId 到 formFields 的调试
    if (fieldName === 'communityId') {
      console.log(`📝 添加字段 [${fieldName}] 到 formFields:`, formField);
    }

    formFields.push(formField);
  });

  // ⭐ 新增：添加 fieldOverrides 中存在但 entityFields 中不存在的字段
  if (fieldOverrides) {
    Object.entries(fieldOverrides).forEach(([fieldName, overrideConfig]) => {
      // 检查该字段是否已经存在于 formFields 中
      const fieldExists = formFields.some(f => f.name === fieldName);

      // 如果字段不存在，且不在排除列表中，则添加它
      if (!fieldExists && !excludeFields.includes(fieldName)) {
        const formField: FormFieldConfig = {
          name: fieldName,
          label: overrideConfig.label || fieldNameToTitle(fieldName),
          ...overrideConfig,
        };

        console.log('✅ 从 fieldOverrides 添加额外字段:', fieldName, formField);
        formFields.push(formField);
      }
    });
  }

  return formFields;
}
