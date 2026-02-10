import React from 'react';
import { GenericCrud } from '@/components/GenericCrud';
import { Tag, InputNumber } from 'antd';
import { ProFormText, ProFormDigit } from '@ant-design/pro-components';
import RelationSelect from '@/components/GenericCrud/components/RelationSelect';

/**
 * 订单明细列表组件
 * 用于在订单详情中展示该订单的所有明细项
 *
 * @param orderId - 订单ID（用于筛选明细）
 */
interface OrderItemListProps {
  orderId: string;
}

export default function OrderItemList({ orderId }: OrderItemListProps) {
  return (
    <GenericCrud
      rowKey="_id"
      headerTitle="订单明细"

      // 动态实体配置
      dynamicEntity={{
        // 实体类名（首字母大写）
        entityClassName: 'OrderItem',

        // 实体名称（小写）
        entityName: 'orderItem',

        // 排除的字段
        excludeFields: ['order'], // 排除关联的order对象，只显示orderId

        // 固定查询条件：只查询指定订单的明细
        filter: {
          orderId: orderId,
        },

        // 关联实体配置
        relations: {
          // 商品ID字段关联到Product实体
          productId: {
            entityClassName: 'Product',
            entityName: 'product',
            displayField: 'name', // 显示商品名称
            valueField: '_id',    // 使用 _id 作为值
          },
        },

        // 字段覆盖配置
        fieldOverrides: {
          // 订单ID
          orderId: {
            label: '订单ID',
            valueType: 'text',
            hideInTable: true,
            hideInSearch: true,
          },

          // 商品ID - 使用RelationSelect并添加自动填充逻辑
          productId: {
            label: '商品',
            required: true,
            // 自定义渲染，添加选择后自动填充功能
            renderFormItem: (props: any) => (
              <RelationSelect
                value={props.value}
                onChange={(value: any, record?: any) => {
                  // 选择商品后自动填充商品名称、单价，并计算小计
                  if (record && props.form) {
                    const quantity = props.form.getFieldValue('quantity') || 1;
                    const subtotal = (record.price || 0) * quantity;
                    props.form.setFieldsValue({
                      productName: record.name,
                      productPrice: record.price,
                      subtotal: subtotal,
                    });
                  }
                  props.onChange?.(value);
                }}
                relationConfig={{
                  entityClassName: 'Product',
                  entityName: 'product',
                  displayField: 'name',
                  valueField: '_id',
                }}
                mode={props.mode}
              />
            ),
          },

          // 商品名称（自动填充）
          productName: {
            label: '商品名称',
            valueType: 'text',
            required: true,
          },

          // 商品单价（自动填充，支持手动修改）
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
            renderFormItem: (props: any) => {
              // 单价改变时重新计算小计
              return (
                <InputNumber
                  value={props.value}
                  onChange={(value) => {
                    const quantity = props.form?.getFieldValue('quantity') || 1;
                    const subtotal = (value || 0) * quantity;
                    props.form?.setFieldValue('subtotal', subtotal);
                    props.onChange?.(value);
                  }}
                  prefix="¥"
                  precision={2}
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                />
              );
            },
            renderTable: (_: any, record: any) => {
              return <span>¥{parseFloat(record.productPrice || 0).toFixed(2)}</span>;
            },
          },

          // 数量
          quantity: {
            label: '数量',
            valueType: 'digit',
            required: true,
            initialValue: 1,
            fieldProps: {
              min: 1,
              precision: 0,
              step: 1,
            },
            renderFormItem: (props: any) => {
              // 数量改变时重新计算小计
              return (
                <InputNumber
                  value={props.value}
                  onChange={(value) => {
                    const price = props.form?.getFieldValue('productPrice') || 0;
                    const subtotal = (price || 0) * (value || 0);
                    props.form?.setFieldValue('subtotal', subtotal);
                    props.onChange?.(value);
                  }}
                  precision={0}
                  min={1}
                  step={1}
                  style={{ width: '100%' }}
                />
              );
            },
            renderTable: (_: any, record: any) => {
              return <Tag color="blue">{record.quantity} 件</Tag>;
            },
          },

          // 小计金额（自动计算，显示但只读）
          subtotal: {
            label: '小计金额',
            valueType: 'digit',
            // 显示但禁用，确保值被提交
            renderFormItem: (props: any) => (
              <InputNumber
                value={props.value}
                disabled
                prefix="¥"
                precision={2}
                style={{ width: '100%' }}
              />
            ),
            fieldProps: {
              prefix: '¥',
              precision: 2,
              min: 0,
              step: 0.01,
            },
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

      // 新增时默认值
      data={{
        orderId: orderId,
        quantity: 1,
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
          span: 0,
        },
        table: {
          size: 'small',
          pagination: {
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          },
          scroll: { x: 1200 },
        },
      }}

      // 回调函数
      callbacks={{
        onError: (error, operation) => {
        },
      }}
    />
  );
}
