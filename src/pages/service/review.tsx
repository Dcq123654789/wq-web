import React from 'react';
import { GenericCrud } from '@/components/GenericCrud';
import { Image, Rate } from 'antd';
import FileUpload from '@/components/FileUpload';

/**
 * 服务评价管理页面
 *
 * 功能特性：
 * - 动态获取服务评价实体字段信息
 * - 自动生成表格列和表单字段
 * - 支持评分展示
 * - 支持评价内容管理
 * - 支持追评和商家回复
 */
export default function ServiceReviewPage() {
  return (
    <GenericCrud
      rowKey="_id"
      headerTitle="服务评价管理"

      // 动态实体配置
      dynamicEntity={{
        entityClassName: 'ServiceReview',
        entityName: 'wqservice_review',

        // 排除的字段
        excludeFields: [
          'order',            // 关联对象
          'user',             // 关联对象
          'service',          // 关联对象
          'provider',         // 关联对象
        ],

        // 字段覆盖配置
        fieldOverrides: {
          // 订单ID
          orderId: {
            label: '订单ID',
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

          // 服务人员ID
          providerId: {
            label: '服务人员ID',
            hideInForm: true,
            hideInSearch: true,
          },

          // 总分
          rating: {
            label: '总分',
            valueType: 'digit',
            required: true,
            fieldProps: {
              min: 1,
              max: 5,
            },
            renderTable: (_: any, record: any) => {
              return <Rate disabled value={record.rating} />;
            },
          },

          // 态度评分
          attitudeRating: {
            label: '态度评分',
            valueType: 'digit',
            hideInSearch: true,
            fieldProps: {
              min: 1,
              max: 5,
            },
            renderTable: (_: any, record: any) => {
              return record.attitudeRating ? <Rate disabled value={record.attitudeRating} /> : '-';
            },
          },

          // 质量评分
          qualityRating: {
            label: '质量评分',
            valueType: 'digit',
            hideInSearch: true,
            fieldProps: {
              min: 1,
              max: 5,
            },
            renderTable: (_: any, record: any) => {
              return record.qualityRating ? <Rate disabled value={record.qualityRating} /> : '-';
            },
          },

          // 守时评分
          punctualityRating: {
            label: '守时评分',
            valueType: 'digit',
            hideInSearch: true,
            fieldProps: {
              min: 1,
              max: 5,
            },
            renderTable: (_: any, record: any) => {
              return record.punctualityRating ? <Rate disabled value={record.punctualityRating} /> : '-';
            },
          },

          // 评价文字
          content: {
            label: '评价内容',
            valueType: 'textarea',
            hideInSearch: true,
            fieldProps: {
              rows: 4,
            },
          },

          // 评价图片
          images: {
            label: '评价图片',
            valueType: 'image',
            hideInSearch: true,
            renderTable: (_: any, record: any) => {
              const value = record.images;
              if (!value || !Array.isArray(value) || value.length === 0) return '-';
              const previewImages = value.slice(0, 3).map((img: string, index: number) => (
                <Image
                  key={index}
                  src={img}
                  alt={`评价图片${index + 1}`}
                  width={30}
                  height={30}
                  style={{ objectFit: 'cover', borderRadius: 4, marginRight: 4 }}
                />
              ));
              const count = value.length > 3 ? (
                <span style={{ marginLeft: 4, color: '#999' }}>+{value.length - 3}</span>
              ) : null;
              return <span style={{ display: 'flex', alignItems: 'center' }}>{previewImages}{count}</span>;
            },
            renderFormItem: (props: any) => (
              <FileUpload {...props} uploadType="image" maxCount={9} />
            ),
          },

          // 评价标签
          tags: {
            label: '评价标签',
            valueType: 'textarea',
            hideInSearch: true,
            fieldProps: {
              rows: 2,
              placeholder: 'JSON数组格式，如：["服务好", "准时"]',
            },
          },

          // 追评内容
          additionalContent: {
            label: '追评内容',
            valueType: 'textarea',
            hideInSearch: true,
            hideInForm: true, // 追评由用户在前端操作
            fieldProps: {
              rows: 3,
            },
          },

          // 追评时间
          additionalTime: {
            label: '追评时间',
            valueType: 'dateTime',
            hideInForm: true,
            hideInSearch: true,
          },

          // 商家回复内容
          replyContent: {
            label: '商家回复',
            valueType: 'textarea',
            hideInSearch: true,
            fieldProps: {
              rows: 3,
            },
          },

          // 商家回复时间
          replyTime: {
            label: '回复时间',
            valueType: 'dateTime',
            hideInForm: true,
            hideInSearch: true,
          },

          // 是否匿名
          isAnonymous: {
            label: '是否匿名',
            valueType: 'select',
            valueEnum: {
              true: { text: '匿名', status: 'Warning' },
              false: { text: '公开', status: 'Success' },
            },
            initialValue: false,
          },

          // 是否显示
          isVisible: {
            label: '是否显示',
            valueType: 'select',
            valueEnum: {
              true: { text: '显示', status: 'Success' },
              false: { text: '隐藏', status: 'Default' },
            },
            initialValue: true,
          },

          // 创建时间
          createTime: {
            label: '评价时间',
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
        create: false,  // 评价由用户在前端创建
        update: true,   // 允许商家回复、显示/隐藏等操作
        delete: true,   // 允许删除违规评价
        batchDelete: true,
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
          scroll: { x: 2400 },
        },
        updateModal: {
          title: '编辑评价',
          width: 800,
        },
      }}

      // 表单默认值
      data={{
        isAnonymous: false,
        isVisible: true,
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
