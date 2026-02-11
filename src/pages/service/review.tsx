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
        entityName: 'servicereview',

        // 排除的字段
        excludeFields: [
        
        ],
        relations: {
          // communityId 字段关联到 Community 实体
          orderId: {
            entityClassName: 'ServiceOrder',
            entityName: 'ServiceOrder', 
            valueField: '_id',    // 使用 _id 作为值
          },
        },
        // 字段覆盖配置
        fieldOverrides: { 
          orderId: {
            label: '服务项目',
            hideInForm: false,  // 创建时需要填写
            required: true,
            // ⭐ 自动填充配置：选择服务后自动填充相关字段
            autoFill: {
              providerId:'providerId'
            },
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
        },
      }}

      // 功能配置
      features={{
        create: true,   // 允许后台手动创建评价
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
        createModal: {
          title: '新建服务评价',
          width: 800,
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
