import React, { useMemo, useEffect } from 'react';
import { Modal } from 'antd';
import type { CreateModalProps } from '../types';
import DynamicForm from './DynamicForm';
import { message } from 'antd';

/**
 * 新建弹窗组件
 */
const CreateModal: React.FC<CreateModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  formFields,
  title = '新建',
  width = 600,
  loading = false,
  customFormComponent: CustomFormComponent,
  data, // ⭐ 新增：表单默认值
}) => {
  // 使用 useMemo 优化 formFields 传递
  const memoizedFormFields = useMemo(() => formFields, [formFields]);

  // ⭐ 添加调试日志
  React.useEffect(() => {
    if (data) {
    }
  }, [data]);

  const handleSubmit = async (values: any) => {
    try {
      await onSubmit(values);
      message.success('创建成功');
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
          loading={loading}
          data={data}
        />
      ) : (
        <DynamicForm
          formFields={memoizedFormFields}
          mode="create"
          initialValues={data}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          loading={loading}
        />
      )}
    </Modal>
  );
};

export default CreateModal;
