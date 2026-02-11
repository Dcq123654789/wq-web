import React from 'react';
import { GenericCrud } from '@/components/GenericCrud';
import { Tag } from 'antd';

/**
 * 服务人员关联订单列表组件
 * 用于展示与服务人员关联的所有订单
 *
 * @param providerId - 服务人员ID（用于筛选订单）
 */
interface ProviderOrderListProps {
  providerId: string;
}

export default function ProviderOrderList({ providerId }: ProviderOrderListProps) {
  return (
    <GenericCrud
      rowKey="_id"
      headerTitle="关联订单"

      // 动态实体配置
      dynamicEntity={{
        // 实体类名（首字母大写）
        entityClassName: 'ServiceOrder',

        // 实体名称（小写）
        entityName: 'serviceorder',

        // 排除的字段
        excludeFields: [],

        // 固定查询条件：只查询指定服务人员的订单
        filter: {
          providerId: providerId,
        },

        // 关联实体配置
        relations: {
          userId: {
            entityClassName: 'WqUser',
            entityName: 'WqUser',
            displayField: 'nickname',
            valueField: '_id',
          },
          serviceId: {
            entityClassName: 'WqService',
            entityName: 'WqService',
            displayField: 'name',
            valueField: '_id',
          },
        },

        // 字段覆盖配置
        fieldOverrides: {
          // 用户ID
          userId: {
            label: '用户',
            hideInForm: true,
          },

          // 服务ID
          serviceId: {
            label: '服务项目',
            hideInForm: true,
          },

          // 服务名称（冗余）
          serviceName: {
            label: '服务项目',
            hideInForm: true,
            hideInSearch: true,
          },

          // 预约日期
          bookingDate: {
            label: '预约日期',
            valueType: 'date',
            hideInForm: true,
            hideInSearch: true,
          },

          // 预约时间段
          timeSlot: {
            label: '时间段',
            hideInForm: true,
            hideInSearch: true,
          },

          // 联系人姓名
          contactName: {
            label: '联系人',
            hideInForm: true,
            hideInSearch: true,
          },

          // 联系电话
          contactPhone: {
            label: '联系电话',
            hideInForm: true,
            hideInSearch: true,
          },

          // 地址信息
          province: {
            label: '省份',
            hideInForm: true,
            hideInTable: true,
            hideInSearch: true,
          },
          city: {
            label: '城市',
            hideInForm: true,
            hideInTable: true,
            hideInSearch: true,
          },
          district: {
            label: '区县',
            hideInForm: true,
            hideInTable: true,
            hideInSearch: true,
          },
          detailAddress: {
            label: '详细地址',
            hideInForm: true,
            hideInSearch: true,
            renderTable: (_: any, record: any) => {
              const { province, city, district, detailAddress } = record;
              const parts = [province, city, district, detailAddress].filter(Boolean);
              return parts.join(' ') || '-';
            },
          },

          // 价格信息
          originalPrice: {
            label: '原价',
            valueType: 'digit',
            hideInForm: true,
            hideInSearch: true,
            fieldProps: {
              prefix: '¥',
              precision: 2,
            },
          },

          finalPrice: {
            label: '实付金额',
            valueType: 'digit',
            hideInForm: true,
            hideInSearch: true,
            fieldProps: {
              prefix: '¥',
              precision: 2,
            },
            renderTable: (_: any, record: any) => {
              return <Tag color="green">¥{parseFloat(record.finalPrice || 0).toFixed(2)}</Tag>;
            },
          },

          discountAmount: {
            label: '优惠金额',
            valueType: 'digit',
            hideInForm: true,
            hideInTable: true,
            hideInSearch: true,
          },

          // 订单状态
          status: {
            label: '订单状态',
            valueType: 'select',
            hideInForm: true,
            valueEnum: {
              0: { text: '待支付', status: 'Warning' },
              1: { text: '待派单', status: 'Processing' },
              2: { text: '待服务', status: 'Default' },
              3: { text: '服务中', status: 'Processing' },
              4: { text: '待评价', status: 'Default' },
              5: { text: '已完成', status: 'Success' },
              6: { text: '已取消', status: 'Error' },
              7: { text: '已退款', status: 'Error' },
            },
            renderTable: (_: any, record: any) => {
              const statusMap = {
                0: { text: '待支付', color: 'orange' },
                1: { text: '待派单', color: 'blue' },
                2: { text: '待服务', color: 'default' },
                3: { text: '服务中', color: 'blue' },
                4: { text: '待评价', color: 'default' },
                5: { text: '已完成', color: 'green' },
                6: { text: '已取消', color: 'red' },
                7: { text: '已退款', color: 'red' },
              };
              const status = statusMap[record.status] || { text: '未知', color: 'default' };
              return <Tag color={status.color}>{status.text}</Tag>;
            },
          },

          // 支付时间
          payTime: {
            label: '支付时间',
            valueType: 'dateTime',
            hideInForm: true,
            hideInSearch: true,
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

          // 备注信息
          remark: {
            label: '用户备注',
            hideInForm: true,
            hideInTable: true,
            hideInSearch: true,
          },

          cancelReason: {
            label: '取消原因',
            hideInForm: true,
            hideInTable: true,
            hideInSearch: true,
          },
        },
      }}

      // 功能配置 - 只允许查看和编辑，不允许创建和删除
      features={{
        create: false,
        update: true,
        delete: false,
        batchDelete: false,
        selection: false,
        export: false,
      }}

      // UI 配置
      ui={{
        search: {
          span: 0, // 隐藏搜索栏
        },
        table: {
          size: 'small',
          pagination: {
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          },
          scroll: { x: 2000 },
        },
        updateModal: {
          title: '编辑订单',
          width: 800,
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
