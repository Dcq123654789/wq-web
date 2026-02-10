import React, { useState } from 'react';
import { GenericCrud } from '@/components/GenericCrud';
import { Tag, Descriptions, Drawer, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import OrderItemList from './components/OrderItemList';

/**
 * 订单管理页面
 *
 * 功能特性：
 * - 动态获取订单实体字段信息
 * - 自动生成表格列和表单字段
 * - 订单状态筛选（待付款、待发货、待收货、已完成、已取消）
 * - 支持订单明细查看（JSON数组格式）
 * - 支持收货地址信息展示
 * - 订单明细包含：商品ID、商品名称、单价、数量、小计金额
 */
export default function OrderPage() {
  // 控制订单明细抽屉的显示
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [selectedOrderNo, setSelectedOrderNo] = useState<string>('');

  // 打开订单明细抽屉
  const handleViewOrderItems = (record: any) => {
    setSelectedOrderId(record._id || record.id);
    setSelectedOrderNo(record.orderNo || '订单');
    setDrawerVisible(true);
  };

  return (
    <>
    <GenericCrud
      rowKey="_id"
      headerTitle="订单管理"

      // 动态实体配置
      dynamicEntity={{
        // 实体类名（首字母大写）
        entityClassName: 'Order',

        // 实体名称（小写）
        entityName: 'order',

        // 排除的字段
        excludeFields: [],

        // 字段覆盖配置
        fieldOverrides: {
          // 订单编号
          orderNo: {
            label: '订单编号',
            required: true,
            rules: [
              { required: true, message: '请输入订单编号' },
              { max: 50, message: '订单编号最多50个字符' },
            ],
          },

          // 用户ID
          userId: {
            label: '用户ID',
            valueType: 'text',
            hideInForm: true, // 在表单中隐藏（通常不允许修改）
          },

          // 订单总金额
          totalAmount: {
            label: '订单总金额',
            valueType: 'digit',
            required: true,
            fieldProps: {
              prefix: '¥',
              precision: 2,
              min: 0,
            },
          },

          // 订单状态
          status: {
            label: '订单状态',
            valueType: 'select',
            valueEnum: {
              0: { text: '待付款', status: 'Warning' },
              1: { text: '待发货', status: 'Processing' },
              2: { text: '待收货', status: 'Default' },
              3: { text: '已完成', status: 'Success' },
              4: { text: '已取消', status: 'Error' },
            },
            required: true,
            initialValue: 0,
            renderTable: (_: any, record: any) => {
              const statusMap = {
                0: { text: '待付款', color: 'orange' },
                1: { text: '待发货', color: 'blue' },
                2: { text: '待收货', color: 'default' },
                3: { text: '已完成', color: 'green' },
                4: { text: '已取消', color: 'red' },
              };
              const status = statusMap[record.status] || { text: '未知', color: 'default' };
              return <Tag color={status.color}>{status.text}</Tag>;
            },
          },

          // 收货人姓名
          receiverName: {
            label: '收货人姓名',
            valueType: 'text',
            required: true,
            rules: [
              { required: true, message: '请输入收货人姓名' },
              { max: 50, message: '收货人姓名最多50个字符' },
            ],
          },

          // 收货人电话
          receiverPhone: {
            label: '收货人电话',
            valueType: 'text',
            required: true,
            rules: [
              { required: true, message: '请输入收货人电话' },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入有效的手机号',
              },
            ],
          },

          // 收货地址
          receiverAddress: {
            label: '收货地址',
            valueType: 'textarea',
            required: true,
            rules: [
              { required: true, message: '请输入收货地址' },
              { max: 500, message: '收货地址最多500个字符' },
            ],
          },

          // 订单备注
          remark: {
            label: '订单备注',
            valueType: 'textarea',
            hideInSearch: true,
            rules: [
              { max: 500, message: '订单备注最多500个字符' },
            ],
          }, 
 
          // 创建时间
          createTime: {
            label: '创建时间',
            valueType: 'dateTime',
            hideInForm: true,
            hideInSearch: true,
            sorter: true,
          },

          // 更新时间
          updateTime: {
            label: '更新时间',
            valueType: 'dateTime',
            hideInForm: true,
            hideInSearch: true,
            sorter: true,
          },
        },
      }}

      // 功能配置
      features={{
        create: true,
        update: true,
        delete: true,
        batchDelete: true,
        selection: true,
        export: false,
      }}

      // UI 配置
      ui={{
        search: {
          labelWidth: 100,
          span: 6,
        },
        table: {
          size: 'middle',
          pagination: {
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
          },
          scroll: { x: 1800 },
        },
        createModal: {
          title: '新建订单',
          width: 800,
        },
        updateModal: {
          title: '编辑订单',
          width: 800,
        },
      }}

      // 表单默认值
      data={{
        status: 0, // 默认状态为待付款
        totalAmount: 0,
      }}

      // 回调函数
      callbacks={{
        onCreateSuccess: () => {
        },
        onUpdateSuccess: () => {
        },
        onDeleteSuccess: () => {
        },
        onError: (error, operation) => {
        },
      }}

      // 自定义操作列按钮
      renderItemActions={(record, { handleEdit, handleDelete }) => {
        return (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* 查看明细按钮 */}
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewOrderItems(record)}
              style={{ padding: '4px 8px' }}
            >
              查看明细
            </Button>

            {/* 编辑按钮 */}
            <Button
              type="link"
              onClick={() => handleEdit()}
              style={{ padding: '4px 8px' }}
            >
              编辑
            </Button>
          </div>
        );
      }}
    />

    {/* 订单明细抽屉 */}
    <Drawer
      title={`${selectedOrderNo} - 订单明细`}
      placement="right"
      width={1200}
      open={drawerVisible}
      onClose={() => setDrawerVisible(false)}
      destroyOnClose
    >
      <OrderItemList orderId={selectedOrderId} />
    </Drawer>
  </>
  );
}
