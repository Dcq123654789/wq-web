import React from 'react';
import { GenericCrud } from '@/components/GenericCrud';
import { Image, Tag } from 'antd';
import FileUpload from '@/components/FileUpload';

/**
 * 商品管理页面
 *
 * 功能特性：
 * - 动态获取商品实体字段信息
 * - 自动生成表格列和表单字段
 * - 支持商品主图和图片集上传
 * - 支持商品分类管理
 * - 支持库存、销量、评分统计
 * - 支持商品规格配置
 */
export default function ProductPage() {
  return (
    <GenericCrud
      rowKey="_id"
      headerTitle="商品管理"

      // 动态实体配置
      dynamicEntity={{
        // 实体类名（首字母大写）
        entityClassName: 'Product',

        // 实体名称（小写）
        entityName: 'product',

        // 排除的字段
        excludeFields: [],

        // 字段覆盖配置
        fieldOverrides: {
          // 商品名称
          name: {
            label: '商品名称',
            required: true,
            rules: [
              { required: true, message: '请输入商品名称' },
              { max: 200, message: '商品名称最多200个字符' },
            ],
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

        

          // 主图URL
          poster: {
            label: '商品主图',
            valueType: 'image',
            required: true,
            // 表格中显示图片
            renderTable: (_: any, record: any) => {
              const value = record.poster;
              if (!value) return '-';
              return (
                <Image
                  src={value}
                  alt="商品主图"
                  width={40}
                  height={40}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                />
              );
            },
            // 表单中使用上传组件
            renderFormItem: (props: any) => (
              <FileUpload {...props} uploadType="image" maxCount={1} />
            ),
          },

          // 商品描述
          description: {
            label: '商品描述',
            valueType: 'textarea',
            hideInSearch: true,
            fieldProps: {
              rows: 4,
            },
          },

          // 库存数量
          stock: {
            label: '库存数量',
            valueType: 'digit',
            required: true,
            initialValue: 0,
            fieldProps: {
              min: 0,
            },
          },

          // 销量
          sales: {
            label: '销量',
            valueType: 'digit',
            hideInForm: true, // 销量通常自动统计，不允许手动修改
            initialValue: 0,
          },

          // 评分
          rating: {
            label: '评分',
            valueType: 'digit',
            hideInForm: true, // 评分通常自动计算，不允许手动修改
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
            hideInForm: true, // 评价数量自动统计，不允许手动修改
            initialValue: 0,
          },

          // 商品图片数组
          images: {
            label: '商品图片集',
            valueType: 'image',
            hideInSearch: true,
            // 表格中显示多张图片的缩略图
            renderTable: (_: any, record: any) => {
              const value = record.images;
              if (!value || !Array.isArray(value) || value.length === 0) return '-';
              // 显示前3张图片作为缩略图
              const previewImages = value.slice(0, 3).map((img: string, index: number) => (
                <Image
                  key={index}
                  src={img}
                  alt={`图片${index + 1}`}
                  width={30}
                  height={30}
                  style={{ objectFit: 'cover', borderRadius: 4, marginRight: 4 }}
                />
              ));
              // 如果超过3张，显示数量
              const count = value.length > 3 ? (
                <span style={{ marginLeft: 4, color: '#999' }}>+{value.length - 3}</span>
              ) : null;
              return <span style={{ display: 'flex', alignItems: 'center' }}>{previewImages}{count}</span>;
            },
            // 表单中使用上传组件
            renderFormItem: (props: any) => (
              <FileUpload {...props} uploadType="image" maxCount={9} />
            ),
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
          scroll: { x: 2000 },
        },
        createModal: {
          title: '新建商品',
          width: 900,
        },
        updateModal: {
          title: '编辑商品',
          width: 900,
        },
      }}

      // 表单默认值
      data={{
        category: 0, // 默认分类为营养保健
        stock: 0,
        sales: 0,
        rating: 0,
        reviewCount: 0,
      }}

      // 回调函数
      callbacks={{
        onCreateSuccess: () => {
          console.log('商品创建成功');
        },
        onUpdateSuccess: () => {
          console.log('商品更新成功');
        },
        onDeleteSuccess: () => {
          console.log('商品删除成功');
        },
        onError: (error, operation) => {
          console.error(`商品${operation}操作失败:`, error);
        },
      }}
    />
  );
}
