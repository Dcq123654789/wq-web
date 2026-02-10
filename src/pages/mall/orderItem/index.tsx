import React from 'react';
import { GenericCrud } from '@/components/GenericCrud';
import { Tag } from 'antd';

/**
 * 订单明细管理页面
 *
 * 功能特性：
 * - 动态获取订单明细实体字段信息
 * - 自动生成表格列和表单字段
 * - 支持按订单ID筛选
 * - 支持按商品ID和名称查询
 * - 显示商品单价、数量和小计金额
 * - 关联订单信息
 */
export default function OrderItemPage() {
  return (
    <GenericCrud
      rowKey="_id"
      headerTitle="订单明细管理"

      // 动态实体配置
      dynamicEntity={{
        // 实体类名（首字母大写）
        entityClassName: 'OrderItem',

        // 实体名称（小写）
        entityName: 'orderitem',

        // 排除的字段
        excludeFields: ['order'], // 排除关联的order对象，只显示orderId

        // 字段覆盖配置
        fieldOverrides: {
          // 订单ID
          orderId: {
            label: '订单ID',
            valueType: 'text',
            required: true,
            rules: [
              { required: true, message: '请输入订单ID' },
              { max: 64, message: '订单ID最多64个字符' },
            ],
          },

          // 商品ID
          productId: {
            label: '商品ID',
            valueType: 'text',
            required: true,
            rules: [
              { required: true, message: '请输入商品ID' },
              { max: 64, message: '商品ID最多64个字符' },
            ],
          },

          // 商品名称
          productName: {
            label: '商品名称',
            valueType: 'text',
            required: true,
            rules: [
              { required: true, message: '请输入商品名称' },
              { max: 200, message: '商品名称最多200个字符' },
            ],
          },

          // 商品单价
          productPrice: {
            label: '商品单价',
            valueType: 'digit',
            required: true,
            fieldProps: {
              prefix: '¥',
              precision: 2,
              min: 0,
              step: 0.01,
            },
            rules: [
              { required: true, message: '请输入商品单价' },
            ],
            renderTable: (_: any, record: any) => {
              return <span>¥{parseFloat(record.productPrice || 0).toFixed(2)}</span>;
            },
          },

          // 数量
          quantity: {
            label: '数量',
            valueType: 'digit',
            required: true,
            fieldProps: {
              min: 1,
              precision: 0,
              step: 1,
            },
            rules: [
              { required: true, message: '请输入数量' },
              { type: 'number', min: 1, message: '数量必须大于0' },
            ],
            renderTable: (_: any, record: any) => {
              return <Tag color="blue">{record.quantity} 件</Tag>;
            },
          },

          // 小计金额
          subtotal: {
            label: '小计金额',
            valueType: 'digit',
            required: true,
            fieldProps: {
              prefix: '¥',
              precision: 2,
              min: 0,
              step: 0.01,
            },
            rules: [
              { required: true, message: '请输入小计金额' },
            ],
            renderTable: (_: any, record: any) => {
              return (
                <Tag color="green">
                  ¥{parseFloat(record.subtotal || 0).toFixed(2)}
                </Tag>
              );
            },
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
          scroll: { x: 1400 },
        },
        createModal: {
          title: '新建订单明细',
          width: 600,
        },
        updateModal: {
          title: '编辑订单明细',
          width: 600,
        },
      }}

      // 表单默认值
      data={{
        quantity: 1,
        productPrice: 0,
        subtotal: 0,
      }}

      // 回调函数
      callbacks={{
        onCreateSuccess: () => {
          console.log('订单明细创建成功');
        },
        onUpdateSuccess: () => {
          console.log('订单明细更新成功');
        },
        onDeleteSuccess: () => {
          console.log('订单明细删除成功');
        },
        onError: (error, operation) => {
          console.error(`订单明细${operation}操作失败:`, error);
        },
      }}
    />
  );
}
