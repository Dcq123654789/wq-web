import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';

export type UpdateFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinish: () => Promise<boolean>;
};

const UpdateForm: React.FC<UpdateFormProps> = ({ open, onOpenChange, onFinish }) => {
  return (
    <ModalForm
      title="编辑用户"
      open={open}
      onOpenChange={onOpenChange}
      onFinish={async (values) => {
        // TODO: 调用更新接口
        console.log(values);
        return await onFinish();
      }}
      modalProps={{
        destroyOnClose: true,
      }}
    >
      <ProFormText name="id" label="ID" disabled />
      <ProFormText
        name="name"
        label="用户名"
        placeholder="请输入用户名"
        rules={[
          { required: true, message: '请输入用户名' },
          { min: 2, max: 20, message: '用户名长度为2-20个字符' },
        ]}
      />
      <ProFormText
        name="email"
        label="邮箱"
        placeholder="请输入邮箱"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '邮箱格式不正确' },
        ]}
      />
      <ProFormText
        name="phone"
        label="手机号"
        placeholder="请输入手机号"
        rules={[
          { required: true, message: '请输入手机号' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
          },
        ]}
      />
      <ProFormSelect
        name="status"
        label="状态"
        options={[
          { label: '正常', value: 1 },
          { label: '禁用', value: 0 },
        ]}
        rules={[{ required: true, message: '请选择状态' }]}
      />
    </ModalForm>
  );
};

export default UpdateForm;
