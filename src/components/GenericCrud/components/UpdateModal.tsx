import React, { useMemo } from 'react';
import { Modal } from 'antd';
import type { UpdateModalProps } from '../types';
import DynamicForm from './DynamicForm';
import { message } from 'antd';

/**
 * 编辑弹窗组件
 */
const UpdateModal: React.FC<UpdateModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  formFields,
  record,
  title = '编辑',
  width = 600,
  loading = false,
  customFormComponent: CustomFormComponent,
  dataField, // ⭐ 新增：数据包装字段
}) => {
  // ⭐ 提取 dataField 中的值作为初始值
  const extractInitialValues = (record: any, dataField?: string) => {
    if (!record) return undefined;
    if (!dataField) return record;

    // 如果配置了 dataField，从 record[dataField] 中提取值
    const extracted = record[dataField];

    return extracted || record;
  };

  // 使用 useMemo 优化 formFields 和 record 传递
  const memoizedFormFields = useMemo(() => formFields, [formFields]);
  const memoizedRecord = useMemo(
    () => extractInitialValues(record, dataField),
    [record, dataField]
  );

  const handleSubmit = async (values: any) => {
    try {
      await onSubmit(values);
      message.success('更新成功');
    } catch (error) {
      // 错误已在父组件处理
      throw error;
    }
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      width={width}
      footer={null}
      destroyOnClose
    >
      {CustomFormComponent ? (
        <CustomFormComponent
          visible={visible}
          onCancel={onCancel}
          onSubmit={onSubmit}
          record={memoizedRecord}
          loading={loading}
        />
      ) : (
        <DynamicForm
          formFields={memoizedFormFields}
          mode="update"
          initialValues={memoizedRecord}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          loading={loading}
        />
      )}
    </Modal>
  );
};

export default UpdateModal;
