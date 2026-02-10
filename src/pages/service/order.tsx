import React from 'react';
import { GenericCrud } from '@/components/GenericCrud';
import { Image, Tag } from 'antd';

/**
 * 服务订单管理页面
 *
 * 功能特性：
 * - 动态获取服务订单实体字段信息
 * - 自动生成表格列和表单字段
 * - 支持订单状态管理
 * - 支持订单查询和筛选
 * - 支持价格信息展示
 */
export default function ServiceOrderPage() {
  return (
    <GenericCrud
      rowKey="_id"
      headerTitle="服务订单管理"

      // 动态实体配置
      dynamicEntity={{
        entityClassName: 'ServiceOrder',
        entityName: 'wqservice_order',

        // 排除的字段
        excludeFields: [
          'orderId',          // 冗余字段
          'service',          // 关联对象
          'user',             // 关联对象
          'provider',         // 关联对象
          'proofImages',      // 服务完成凭证图片（内部使用）
        ],

        // 字段覆盖配置
        fieldOverrides: {
          // 订单编号
          orderNo: {
            label: '订单编号',
            hideInForm: true,
          },

          // 用户ID
          userId: {
            label: '用户ID',
            hideInForm: true,
          },

          // 服务ID
          serviceId: {
            label: '服务ID',
            hideInForm: true,
          },

          // 服务名称（冗余）
          serviceName: {
            label: '服务名称',
            hideInForm: true,
          },

          // 服务海报（冗余）
          servicePoster: {
            label: '服务海报',
            valueType: 'image',
            hideInForm: true,
            hideInSearch: true,
            renderTable: (_: any, record: any) => {
              const value = record.servicePoster;
              if (!value) return '-';
              return (
                <Image
                  src={value}
                  alt="服务海报"
                  width={40}
                  height={40}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                />
              );
            },
          },

          // 预约日期
          bookingDate: {
            label: '预约日期',
            valueType: 'date',
            hideInForm: true,
          },

          // 预约时间段
          timeSlot: {
            label: '预约时间段',
            hideInForm: true,
          },

          // 联系人姓名
          contactName: {
            label: '联系人姓名',
            hideInForm: true,
          },

          // 联系电话
          contactPhone: {
            label: '联系电话',
            hideInForm: true,
          },

          // 省份
          province: {
            label: '省份',
            hideInForm: true,
            hideInSearch: true,
          },

          // 城市
          city: {
            label: '城市',
            hideInForm: true,
          },

          // 区县
          district: {
            label: '区县',
            hideInForm: true,
            hideInSearch: true,
          },

          // 详细地址
          detailAddress: {
            label: '详细地址',
            hideInForm: true,
            hideInSearch: true,
          },

          // 原价
          originalPrice: {
            label: '原价（元）',
            valueType: 'digit',
            hideInForm: true,
            fieldProps: {
              prefix: '¥',
              precision: 2,
            },
          },

          // 实际支付金额
          finalPrice: {
            label: '实付金额（元）',
            valueType: 'digit',
            hideInForm: true,
            fieldProps: {
              prefix: '¥',
              precision: 2,
            },
          },

          // 优惠金额
          discountAmount: {
            label: '优惠金额（元）',
            valueType: 'digit',
            hideInForm: true,
            fieldProps: {
              prefix: '¥',
              precision: 2,
            },
          },

          // 优惠券ID
          couponId: {
            label: '优惠券ID',
            hideInForm: true,
            hideInSearch: true,
          },

          // 订单状态
          status: {
            label: '订单状态',
            valueType: 'select',
            valueEnum: {
              0: { text: '待支付', status: 'Default' },
              1: { text: '待接单', status: 'Processing' },
              2: { text: '已接单', status: 'Success' },
              3: { text: '服务中', status: 'Active' },
              4: { text: '待评价', status: 'Warning' },
              5: { text: '已完成', status: 'Success' },
              6: { text: '已取消', status: 'Error' },
              7: { text: '已退款', status: 'Error' },
            },
            initialValue: 0,
          },

          // 服务人员ID
          providerId: {
            label: '服务人员ID',
            hideInForm: true,
            hideInSearch: true,
          },

          // 服务人员姓名（冗余）
          providerName: {
            label: '服务人员',
            hideInForm: true,
            hideInSearch: true,
          },

          // 服务人员电话（冗余）
          providerPhone: {
            label: '服务人员电话',
            hideInForm: true,
            hideInSearch: true,
          },

          // 支付时间
          payTime: {
            label: '支付时间',
            valueType: 'dateTime',
            hideInForm: true,
            hideInSearch: true,
          },

          // 接单时间
          acceptTime: {
            label: '接单时间',
            valueType: 'dateTime',
            hideInForm: true,
            hideInSearch: true,
          },

          // 服务开始时间
          serviceStartTime: {
            label: '服务开始时间',
            valueType: 'dateTime',
            hideInForm: true,
            hideInSearch: true,
          },

          // 服务结束时间
          serviceEndTime: {
            label: '服务结束时间',
            valueType: 'dateTime',
            hideInForm: true,
            hideInSearch: true,
          },

          // 完成时间
          completeTime: {
            label: '完成时间',
            valueType: 'dateTime',
            hideInForm: true,
            hideInSearch: true,
          },

          // 取消时间
          cancelTime: {
            label: '取消时间',
            valueType: 'dateTime',
            hideInForm: true,
            hideInSearch: true,
          },

          // 用户备注
          remark: {
            label: '用户备注',
            valueType: 'textarea',
            hideInForm: true,
            hideInSearch: true,
          },

          // 取消原因
          cancelReason: {
            label: '取消原因',
            hideInForm: true,
            hideInSearch: true,
          },

          // 创建时间
          createTime: {
            label: '创建时间',
            valueType: 'dateTime',
            hideInForm: true,
            hideInSearch: false,
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
        create: false,  // 订单通常通过业务流程创建，不在后台手动创建
        update: true,   // 允许修改订单状态等信息
        delete: false,  // 订单通常不删除，只取消
        batchDelete: false,
        selection: true,
        export: false,
      }}

      // UI 配置
      ui={{
        search: {
          labelWidth: 120,
          span: 6,
        },
        table: {
          size: 'middle',
          pagination: {
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
          },
          scroll: { x: 2800 },
        },
        updateModal: {
          title: '编辑订单',
          width: 800,
        },
      }}

      // 表单默认值
      data={{
        status: 0,
        discountAmount: 0,
      }}

      // 回调函数
      callbacks={{
        onCreateSuccess: () => {
          console.log('订单创建成功');
        },
        onUpdateSuccess: () => {
          console.log('订单更新成功');
        },
        onDeleteSuccess: () => {
          console.log('订单删除成功');
        },
        onError: (error, operation) => {
          console.error(`订单${operation}操作失败:`, error);
        },
      }}
    />
  );
}
