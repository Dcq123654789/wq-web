import { PlusOutlined } from '@ant-design/icons';
import { FooterToolbar, PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

/**
 * @see https://umijs.org/zh-CN/components/table
 */
const TableList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<any>();

  const handleRemove = async (selectedRows: API.UserInfo[]) => {
    if (!selectedRows) return;
    try {
      // TODO: 调用删除接口
      message.success('删除成功');
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('删除失败');
      return false;
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      tip: '主键',
      hideInForm: true,
    },
    {
      title: '用户名',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      valueType: 'phone',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '禁用',
          status: 'Default',
        },
        1: {
          text: '正常',
          status: 'Processing',
        },
      },
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            // TODO: 处理编辑
            setUpdateModalVisible(true);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            handleRemove([record]);
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.UserInfo>
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params, sort) => {
          // TODO: 调用真实接口
          return {
            data: [
              {
                id: 1,
                name: '张三',
                email: 'zhangsan@example.com',
                phone: '13800138000',
                status: 1,
                createdAt: '2023-01-01 12:00:00',
              },
            ],
            success: true,
          };
        }}
        columns={columns}
        rowSelection={{}}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRowsState([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <CreateForm
        open={modalVisible}
        onOpenChange={setModalVisible}
        onFinish={async () => {
          message.success('创建成功');
          setModalVisible(false);
          actionRef.current?.reload();
          return true;
        }}
      />
      <UpdateForm
        open={updateModalVisible}
        onOpenChange={setUpdateModalVisible}
        onFinish={async () => {
          message.success('更新成功');
          setUpdateModalVisible(false);
          actionRef.current?.reload();
          return true;
        }}
      />
    </PageContainer>
  );
};

export default TableList;
