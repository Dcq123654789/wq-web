import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { message, Spin, Button, Popconfirm, Modal } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import type { GenericCrudConfig, FormFieldConfig } from './types';
import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';
import { mergeFormFields } from './utils/formHelper';
import { getEntityFields, queryEntity, createEntity, updateEntity, deleteEntity } from '@/services/genericEntity';
import {
  convertEntityFieldsToColumns,
  convertEntityFieldsToFormFields,
  type EntityFieldInfo,
} from './utils/entityFieldMapper';
import { PlusOutlined, DeleteOutlined, EditOutlined, ExportOutlined } from '@ant-design/icons';
import './styles.css';

/**
 * 通用 CRUD 组件（动态模式）
 * 通过 API 动态获取实体字段信息，自动生成表格和表单
 *
 * UI/UX 特性：
 * - Glassmorphism 设计风格
 * - 流畅的动画过渡
 * - 改进的视觉层次
 * - 优化的交互反馈
 */


const GenericCrud = <T extends Record<string, any>>({
  rowKey = 'id',
  headerTitle = '列表',
  dynamicEntity,
  columns,
  formFields,
  crudOperations,
  customFormComponents,
  features = {},
  ui = {},
  permissions = {},
  renderItemActions,
  renderToolbar,
  callbacks = {},
  data, // ⭐ 新增：表单默认值
}: GenericCrudConfig<T>) => {
  // 状态管理
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<T | null>(null);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fieldsLoading, setFieldsLoading] = useState(false);

  // 动态字段状态
  const [entityFields, setEntityFields] = useState<EntityFieldInfo>({});
  const [generatedColumns, setGeneratedColumns] = useState<ProColumns<T>[]>([]);
  const [generatedFormFields, setGeneratedFormFields] = useState<FormFieldConfig[]>([]);

  // 获取动态字段信息
  useEffect(() => {
    if (dynamicEntity) {
      const fetchEntityFields = async () => {
        try {
          setFieldsLoading(true);
          const fields = await getEntityFields(dynamicEntity.entityClassName);
          setEntityFields(fields);

          // 生成列配置
          const cols = convertEntityFieldsToColumns(
            fields,
            dynamicEntity.excludeFields || [],
            dynamicEntity.fieldOverrides,
            dynamicEntity.relations,
          );
          console.log('Generated columns:', cols);
          console.log('Avatar column:', cols.find((c: any) => c.dataIndex === 'avatar'));
          setGeneratedColumns(cols);

          // 生成表单字段配置
          const formFields = convertEntityFieldsToFormFields(
            fields,
            dynamicEntity.excludeFields || [],
            dynamicEntity.fieldOverrides,
            dynamicEntity.relations,
          );
          setGeneratedFormFields(formFields);
        } catch (error) {
          message.error('获取实体字段信息失败');
          console.error('Failed to fetch entity fields:', error);
        } finally {
          setFieldsLoading(false);
        }
      };

      fetchEntityFields();
    }
  }, [dynamicEntity]);

  // 确定使用的列和表单字段
  const finalColumns = useMemo(() => {
    if (dynamicEntity) {
      return generatedColumns;
    }
    return columns || [];
  }, [dynamicEntity, generatedColumns, columns]);

  const finalFormFields = useMemo(() => {
    if (dynamicEntity) {
      return generatedFormFields;
    }
    return formFields || [];
  }, [dynamicEntity, generatedFormFields, formFields]);

  // 确定 CRUD 操作
  const finalCrudOperations = useMemo(() => {
    if (dynamicEntity && !crudOperations) {
      // 使用通用 CRUD 操作
      return {
        list: async (params: any, sort: any) => {
          // 分离分页参数和查询条件
          const { current, pageSize, ...rest } = params;

          // 转换查询条件：字符串字段使用模糊查询
          const conditions: Record<string, any> = {};
          Object.entries(rest).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              // 检查字段类型
              const fieldInfo = entityFields[key];
              if (fieldInfo) {
                // 兼容新格式（只有 type）和旧格式（有 typeName）
                const typeName = fieldInfo.typeName || fieldInfo.type || '';

                // 字符串类型使用模糊查询
                if (typeName.includes('String') || typeName === 'string') {
                  conditions[key] = { $like: value };
                }
                // 其他类型保持原值
                else {
                  conditions[key] = value;
                }
              } else {
                // 未知字段类型，默认使用模糊查询（适用于文本输入）
                conditions[key] = { $like: value };
              }
            }
          });

          return queryEntity<T>(dynamicEntity.entityName, {
            current,
            pageSize,
            conditions: Object.keys(conditions).length > 0 ? conditions : undefined,
            sort,
          });
        },
        create: async (data: any) => {
          return createEntity(dynamicEntity.entityName, data);
        },
        update: async (id: any, data: any) => {
          return updateEntity(dynamicEntity.entityName, id, data);
        },
        delete: async (id: any) => {
          return deleteEntity(dynamicEntity.entityName, id);
        },
      };
    }
    return crudOperations;
  }, [dynamicEntity, crudOperations, entityFields]);

  // 默认功能开关
  const defaultFeatures = {
    create: finalCrudOperations?.create !== undefined,
    update: finalCrudOperations?.update !== undefined,
    delete: finalCrudOperations?.delete !== undefined,
    batchDelete: finalCrudOperations?.delete !== undefined,
    selection: true,
    export: false,
    ...features,
  };

  // 合并表单字段
  const mergedFormFields = useMemo(
    () => mergeFormFields(finalColumns, finalFormFields),
    [finalColumns, finalFormFields],
  );

  // 检查权限
  const checkPermission = useCallback((permission?: boolean | string): boolean => {
    if (permission === undefined) return true;
    if (typeof permission === 'boolean') return permission;
    // 如果是权限码字符串，这里可以集成权限系统
    // 例如: return hasPermission(permission)
    return true;
  }, []);

  // 列表请求
  const requestList = useCallback(
    async (params: any, sort: any) => {
      if (!finalCrudOperations) {
        return {
          data: [],
          success: false,
          total: 0,
        };
      }

      try {
        const result = await finalCrudOperations.list(params, sort);
        // 调试：打印返回的数据
        if (result.data && result.data.length > 0) {
          console.log('List data sample:', result.data[0]);
          console.log('Avatar field value:', result.data[0]?.avatar);
        }
        return {
          data: result.data || [],
          success: result.success,
          total: result.total || 0,
        };
      } catch (error) {
        if (callbacks.onError) {
          callbacks.onError(error, 'list');
        } else {
          message.error('加载数据失败');
        }
        return {
          data: [],
          success: false,
          total: 0,
        };
      }
    },
    [finalCrudOperations, callbacks],
  );

  // 新建操作
  const handleCreate = useCallback(() => {
    if (checkPermission(permissions.create)) {
      setCreateModalVisible(true);
    } else {
      message.warning('您没有新建权限');
    }
  }, [checkPermission, permissions.create]);

  // 编辑操作
  const handleEdit = useCallback(
    (record: T) => {
      if (checkPermission(permissions.update)) {
        setCurrentRecord(record);
        setUpdateModalVisible(true);
      } else {
        message.warning('您没有编辑权限');
      }
    },
    [checkPermission, permissions.update],
  );

  // 删除操作
  const handleDelete = useCallback(
    async (id: any) => {
      if (!checkPermission(permissions.delete)) {
        message.warning('您没有删除权限');
        return;
      }

      if (!finalCrudOperations?.delete) return;

      try {
        setLoading(true);
        await finalCrudOperations.delete(id);
        message.success('删除成功');
        actionRef?.reload();
        if (callbacks.onDeleteSuccess) {
          callbacks.onDeleteSuccess();
        }
      } catch (error) {
        if (callbacks.onError) {
          callbacks.onError(error, 'delete');
        } else {
          message.error('删除失败');
        }
      } finally {
        setLoading(false);
      }
    },
    [finalCrudOperations, actionRef, callbacks, checkPermission, permissions.delete],
  );

  // 批量删除操作
  const handleBatchDelete = useCallback(async () => {
    if (selectedRows.length === 0) {
      message.warning('请至少选择一项');
      return;
    }

    if (!checkPermission(permissions.delete)) {
      message.warning('您没有删除权限');
      return;
    }

    if (!finalCrudOperations?.delete) return;

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedRows.length} 项吗？`,
      onOk: async () => {
        try {
          setLoading(true);
          const ids = selectedRows.map((row) => row[rowKey]);
          await finalCrudOperations.delete(ids);
          message.success('批量删除成功');
          setSelectedRows([]);
          setSelectedRowKeys([]);
          actionRef?.reload();
          if (callbacks.onDeleteSuccess) {
            callbacks.onDeleteSuccess();
          }
        } catch (error) {
          if (callbacks.onError) {
            callbacks.onError(error, 'delete');
          } else {
            message.error('批量删除失败');
          }
        } finally {
          setLoading(false);
        }
      },
    });
  }, [
    selectedRows,
    rowKey,
    finalCrudOperations,
    actionRef,
    callbacks,
    checkPermission,
    permissions.delete,
  ]);

  // 导出操作
  const handleExport = useCallback(async () => {
    if (selectedRows.length === 0) {
      message.warning('请至少选择一项');
      return;
    }

    // 这里可以实现导出逻辑
    message.info('导出功能待实现');
  }, [selectedRows]);

  // 新建提交
  const handleCreateSubmit = useCallback(
    async (values: any) => {
      if (!finalCrudOperations?.create) return;

      try {
        setLoading(true);

        // ⭐ 如果配置了 dataField，将所有值包装到该字段中
        let submitData = values;
        if (dynamicEntity?.dataField) {
          submitData = {
            [dynamicEntity.dataField]: values,
          };
          console.log('创建数据包装:', {
            原始数据: values,
            提交数据: submitData,
            包装字段: dynamicEntity.dataField,
          });
        }

        await finalCrudOperations.create(submitData);
        setCreateModalVisible(false);
        actionRef?.reload();
        if (callbacks.onCreateSuccess) {
          callbacks.onCreateSuccess();
        }
      } catch (error) {
        if (callbacks.onError) {
          callbacks.onError(error, 'create');
        } else {
          message.error('创建失败');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [finalCrudOperations, actionRef, callbacks, dynamicEntity],
  );

  // 编辑提交
  const handleUpdateSubmit = useCallback(
    async (values: any) => {
      if (!currentRecord) return;
      if (!finalCrudOperations?.update) return;

      try {
        setLoading(true);

        // ⭐ 如果配置了 dataField，将所有值包装到该字段中
        let submitData = values;
        if (dynamicEntity?.dataField) {
          submitData = {
            [dynamicEntity.dataField]: values,
          };
          console.log('更新数据包装:', {
            原始数据: values,
            提交数据: submitData,
            包装字段: dynamicEntity.dataField,
          });
        }

        await finalCrudOperations.update(currentRecord[rowKey], submitData);
        setUpdateModalVisible(false);
        setCurrentRecord(null);
        actionRef?.reload();
        if (callbacks.onUpdateSuccess) {
          callbacks.onUpdateSuccess();
        }
      } catch (error) {
        if (callbacks.onError) {
          callbacks.onError(error, 'update');
        } else {
          message.error('更新失败');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentRecord, rowKey, finalCrudOperations, actionRef, callbacks, dynamicEntity],
  );

  // 构建操作列
  const actionColumn = useMemo(() => {
    return {
      title: '操作',
      valueType: 'option',
      width: 180,
      fixed: 'right' as const,
      render: (_: any, record: T) => {
        // 如果提供了自定义渲染函数，使用自定义
        if (renderItemActions) {
          return renderItemActions(record, {
            handleEdit: () => handleEdit(record),
            handleDelete: () => handleDelete(record[rowKey]),
            record,
          });
        }

        // 默认操作按钮（带图标）
        return (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {defaultFeatures.update && checkPermission(permissions.update) && (
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                className="action-link"
                style={{ padding: '4px 8px' }}
              >
                编辑
              </Button>
            )}
            {defaultFeatures.delete && checkPermission(permissions.delete) && (
              <Popconfirm
                title="确认删除"
                description="确定要删除吗？此操作无法撤销。"
                onConfirm={() => handleDelete(record[rowKey])}
                okText="确定"
                cancelText="取消"
                okButtonProps={{ danger: true }}
              >
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  danger
                  className="delete-link"
                  style={{ padding: '4px 8px' }}
                >
                  删除
                </Button>
              </Popconfirm>
            )}
          </div>
        );
      },
    };
  }, [renderItemActions, defaultFeatures, permissions, checkPermission, handleEdit, handleDelete, rowKey]);

  // 构建完整的列配置
  const finalColumnsWithAction = useMemo(() => {
    return [...finalColumns, actionColumn] as ProColumns<T>[];
  }, [finalColumns, actionColumn]);

  // 工具栏
  const toolbar = useMemo(() => {
    const toolbarContext = {
      handleCreate,
      handleBatchDelete,
      handleExport,
      selectedRows,
      selectedRowKeys,
    };

    // 如果提供了自定义工具栏渲染函数
    if (renderToolbar) {
      return renderToolbar(toolbarContext);
    }

    // 默认工具栏（带图标和样式）
    return (
      <>
        {defaultFeatures.create && checkPermission(permissions.create) && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            size="large"
          >
            新建
          </Button>
        )}
        {defaultFeatures.batchDelete && selectedRows.length > 0 && checkPermission(permissions.delete) && (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleBatchDelete}
            loading={loading}
            size="large"
          >
            批量删除 {selectedRows.length > 0 && `(${selectedRows.length})`}
          </Button>
        )}
        {defaultFeatures.export && selectedRows.length > 0 && (
          <Button
            icon={<ExportOutlined />}
            onClick={handleExport}
            size="large"
          >
            导出 {selectedRows.length > 0 && `(${selectedRows.length})`}
          </Button>
        )}
      </>
    );
  }, [
    renderToolbar,
    defaultFeatures,
    permissions,
    checkPermission,
    handleCreate,
    handleBatchDelete,
    handleExport,
    selectedRows,
    selectedRowKeys,
    loading,
  ]);

  // 加载中状态
  if (fieldsLoading) {
    return (
      <div className="generic-crud-wrapper">
        <div className="loading-container">
          <Spin size="large" tip="正在加载字段信息..." />
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="generic-crud-wrapper">
      <div className="pro-table-card">
        <ProTable<T>
            columns={finalColumnsWithAction}
            actionRef={actionRef}
            request={requestList}
            rowKey={rowKey}
            search={ui.search ?? {}}
            dateFormatter="string"
            headerTitle={headerTitle}
            toolBarRender={() => toolbar}
            rowSelection={
              defaultFeatures.selection
                ? {
                    selectedRowKeys,
                    onChange: (_, rows) => {
                      setSelectedRowKeys(_);
                      setSelectedRows(rows);
                    },
                  }
                : false
            }
            tableAlertRender={({ selectedRowKeys }) => (
              <span style={{ fontWeight: 500 }}>
                已选择 <a style={{ fontWeight: 600, color: '#667eea' }}>{selectedRowKeys.length}</a> 项
              </span>
            )}
            options={{
              density: true,
              fullScreen: true,
              reload: true,
              setting: true,
            }}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showQuickJumper: true,
              style: { marginRight: 24 },
            }}
            scroll={{
              x: 'max-content',
              ...ui.table?.scroll,
            }}
            {...ui.table}
          />
        </div>
      </div>

      {/* 新建弹窗 */}
      {defaultFeatures.create && (
        <CreateModal
          visible={createModalVisible}
          onCancel={() => setCreateModalVisible(false)}
          onSubmit={handleCreateSubmit}
          formFields={mergedFormFields}
          title={ui.createModal?.title || '新建'}
          width={ui.createModal?.width || 600}
          loading={loading}
          customFormComponent={customFormComponents?.create}
          data={data} // ⭐ 传递默认值
        />
      )}

      {/* 编辑弹窗 */}
      {defaultFeatures.update && (
        <UpdateModal
          visible={updateModalVisible}
          onCancel={() => {
            setUpdateModalVisible(false);
            setCurrentRecord(null);
          }}
          onSubmit={handleUpdateSubmit}
          formFields={mergedFormFields}
          record={currentRecord}
          title={ui.updateModal?.title || '编辑'}
          width={ui.updateModal?.width || 600}
          loading={loading}
          customFormComponent={customFormComponents?.update}
          dataField={dynamicEntity?.dataField} // ⭐ 传递数据包装字段
        />
      )}
    </>
  );
};

export default GenericCrud;
