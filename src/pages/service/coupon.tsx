import React from 'react';
import { GenericCrud } from '@/components/GenericCrud';
import { Tag } from 'antd';

/**
 * 服务优惠券管理页面
 *
 * 功能特性：
 * - 动态获取服务优惠券实体字段信息
 * - 自动生成表格列和表单字段
 * - 支持多种优惠券类型（减免金额、折扣比例、免费服务）
 * - 支持使用条件设置
 * - 支持有效期和数量管理
 */
export default function ServiceCouponPage() {
  return (
    <GenericCrud
      rowKey="_id"
      headerTitle="服务优惠券管理"

      // 动态实体配置
      dynamicEntity={{
        entityClassName: 'ServiceCoupon',
        entityName: 'servicecoupon',

        // 排除的字段
        excludeFields: [
          'userServiceCoupons', // 关联对象
        ],

        // 字段覆盖配置
        fieldOverrides: { 

          // 优惠券名称
          name: {
            label: '优惠券名称',
            required: true,
            rules: [
              { required: true, message: '请输入优惠券名称' },
              { max: 100, message: '名称最多100个字符' },
            ],
          }, 
         

          // 优惠金额
          amount: {
            label: '优惠金额（元）',
            valueType: 'digit',
            hideInSearch: true,
            fieldProps: {
              prefix: '¥',
              precision: 2,
              min: 0,
            },
          },

          // 折扣比例
          discountPercentage: {
            label: '折扣比例（%）',
            valueType: 'digit',
            hideInSearch: true,
            fieldProps: {
              min: 0,
              max: 100,
              suffix: '%',
            },
          },

          // 最低消费金额
          minAmount: {
            label: '最低消费金额（元）',
            valueType: 'digit',
            hideInSearch: true,
            fieldProps: {
              prefix: '¥',
              precision: 2,
              min: 0,
            },
          }, 
         
          // 开始时间
          startTime: {
            label: '开始时间',
            valueType: 'dateTime',
            required: true,
          },

          // 结束时间
          endTime: {
            label: '结束时间',
            valueType: 'dateTime',
            required: true,
          },

          // 总发行量
          totalCount: {
            label: '总发行量',
            valueType: 'digit',
            required: true,
            fieldProps: {
              min: 1,
            },
          },

          // 已领取数量
          receivedCount: {
            label: '已领取数量',
            valueType: 'digit',
            hideInForm: true,
            fieldProps: {
              min: 0,
            },
          },

          // 已使用数量
          usedCount: {
            label: '已使用数量',
            valueType: 'digit',
            hideInForm: true,
            fieldProps: {
              min: 0,
            },
          },

          // 每人限领数量
          perUserLimit: {
            label: '每人限领数量',
            valueType: 'digit',
            required: true,
            fieldProps: {
              min: 1,
            },
          },

          // 状态
          status: {
            label: '状态',
            valueType: 'select',
            valueEnum: {
              0: { text: '禁用', status: 'Error' },
              1: { text: '启用', status: 'Success' },
            },
            required: true,
            initialValue: 1,
          },

          // 优惠券说明
          description: {
            label: '优惠券说明',
            valueType: 'textarea',
            hideInSearch: true,
            fieldProps: {
              rows: 4,
            },
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
          labelWidth: 140,
          span: 6,
        },
        table: {
          size: 'middle',
          pagination: {
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
          },
          scroll: { x: 2200 },
        },
        createModal: {
          title: '新建优惠券',
          width: 800,
        },
        updateModal: {
          title: '编辑优惠券',
          width: 800,
        },
      }}

      // 表单默认值
      data={{ 
        totalCount: 999999,
        
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
    />
  );
}
