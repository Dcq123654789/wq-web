import { useAccess, useModel } from '@umijs/max';
import { Button, Space, Tag } from 'antd';

const AccessPage: React.FC = () => {
  const access = useAccess();
  const { initialState } = useModel('@@initialState');

  return (
    <div>
      <h1>权限示例页面</h1>
      <Space direction="vertical">
        <div>
          当前用户：<Tag color="blue">{initialState?.name}</Tag>
        </div>
        <div>
          canSeeAdmin 权限：
          {access.canSeeAdmin ? (
            <Tag color="success">有权限</Tag>
          ) : (
            <Tag color="error">无权限</Tag>
          )}
        </div>
        <Button type="primary" disabled={!access.canSeeAdmin}>
          只有 canSeeAdmin 权限才能点击
        </Button>
      </Space>
    </div>
  );
};

export default AccessPage;
