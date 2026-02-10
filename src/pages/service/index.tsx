import React from 'react';
import { GenericCrud } from '@/components/GenericCrud';
import { Image, Tag } from 'antd';
import FileUpload from '@/components/FileUpload';

/**
 * 上门服务管理页面
 *
 * 功能特性：
 * - 动态获取服务实体字段信息
 * - 自动生成表格列和表单字段
 * - 支持服务分类管理
 * - 支持服务海报和图片集上传
 * - 支持价格、评分、销量统计
 */
export default function ServicePage() {
  return (
    <GenericCrud
      rowKey="_id"
      headerTitle="上门服务管理"

      // 动态实体配置
      dynamicEntity={{
        entityClassName: 'WqService',
        entityName: 'wqservice',

        // 排除的字段
        excludeFields: ['serialVersionUID'],

        // 字段覆盖配置
        fieldOverrides: {
          // 服务名称
          name: {
            label: '服务名称',
            required: true,
            rules: [
              { required: true, message: '请输入服务名称' },
              { max: 100, message: '服务名称最多100个字符' },
            ],
          },
   

          // 服务海报
          poster: {
            label: '服务海报',
            valueType: 'image',
            required: true,
            renderTable: (_: any, record: any) => {
              const value = record.poster;
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
            renderFormItem: (props: any) => (
              <FileUpload {...props} uploadType="image" maxCount={1} />
            ),
          },

          // 服务图片集
          images: {
            label: '服务图片集',
            valueType: 'image',
            hideInSearch: true,
            renderTable: (_: any, record: any) => {
              const value = record.images;
              if (!value) return '-';

              // 处理字符串格式：将字符串解析为数组
              let imageList: string[] = [];
              if (typeof value === 'string') {
                // 去除首尾的方括号和空格，然后按逗号分割
                const cleaned = value.trim().replace(/^\[|\]$/g, '');
                imageList = cleaned.split(',').map(url => url.trim()).filter(url => url);
              } else if (Array.isArray(value)) {
                imageList = value;
              }

              if (imageList.length === 0) return '-';

              const previewImages = imageList.slice(0, 3).map((img: string, index: number) => (
                <Image
                  key={index}
                  src={img}
                  alt={`图片${index + 1}`}
                  width={30}
                  height={30}
                  style={{ objectFit: 'cover', borderRadius: 4, marginRight: 4 }}
                />
              ));
              const count = imageList.length > 3 ? (
                <span style={{ marginLeft: 4, color: '#999' }}>+{imageList.length - 3}</span>
              ) : null;
              return <span style={{ display: 'flex', alignItems: 'center' }}>{previewImages}{count}</span>;
            },
            renderFormItem: (props: any) => (
              <FileUpload {...props} uploadType="image" maxCount={9} />
            ),
          },

          // 价格
          price: {
            label: '价格（元）',
            valueType: 'digit',
            required: true,
            fieldProps: {
              prefix: '¥',
              precision: 2,
              min: 0,
            },
          },

          // 是否免费
          isFree: {
            label: '是否免费',
            valueType: 'select',
            valueEnum: {
              true: { text: '免费', status: 'Success' },
              false: { text: '付费', status: 'Default' },
            },
            initialValue: false,
          },

          // 已售数量
          sales: {
            label: '已售数量',
            valueType: 'digit',
            hideInForm: true,
            initialValue: 0,
          },

          // 服务描述
          description: {
            label: '服务描述',
            valueType: 'textarea',
            hideInSearch: true,
            fieldProps: {
              rows: 4,
            },
          },

          // 服务规格说明
          specifications: {
            label: '服务规格说明',
            valueType: 'textarea',
            hideInSearch: true,
            fieldProps: {
              rows: 3,
              placeholder: 'JSON格式，如：{"服务时长":"4小时","服务人数":"2人"}',
            },
          },

          // 服务评分
          rating: {
            label: '服务评分',
            valueType: 'digit',
            hideInForm: true,
            fieldProps: {
              min: 0,
              max: 5,
              precision: 1,
            },
          },

          // 评价数量
          reviewCount: {
            label: '评价数量',
            valueType: 'digit',
            hideInForm: true,
            initialValue: 0,
          },

          // 服务须知
          notice: {
            label: '服务须知',
            valueType: 'textarea',
            hideInSearch: true,
            fieldProps: {
              rows: 3,
            },
          },

          // 服务时长（分钟）
          duration: {
            label: '服务时长（分钟）',
            valueType: 'digit',
            hideInSearch: true,
            fieldProps: {
              min: 0,
            },
          },

          // 服务人数
          servicePeople: {
            label: '服务人数',
            valueType: 'digit',
            hideInSearch: true,
            fieldProps: {
              min: 1,
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
          scroll: { x: 2200 },
        },
        createModal: {
          title: '新建服务',
          width: 900,
        },
        updateModal: {
          title: '编辑服务',
          width: 900,
        },
      }}

      // 表单默认值
      data={{
        isFree: false,
        sales: 0,
        reviewCount: 0,
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
