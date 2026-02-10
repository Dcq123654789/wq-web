import React from 'react';
import { GenericCrud } from '@/components/GenericCrud';
import { Image } from 'antd';
import FileUpload from '@/components/FileUpload';

/**
 * 服务人员管理页面
 *
 * 功能特性：
 * - 动态获取服务人员实体字段信息
 * - 自动生成表格列和表单字段
 * - 支持服务人员信息管理
 * - 支持技能认证管理
 * - 支持评价和订单统计
 */
export default function ServiceProviderPage() {
  return (
    <GenericCrud
      rowKey="_id"
      headerTitle="服务人员管理"

      // 动态实体配置
      dynamicEntity={{
        entityClassName: 'ServiceProvider',
        entityName: 'serviceprovider',

        // 排除的字段
        excludeFields: [
          // 'idCard',           // 身份证号（敏感信息）
          // 'currentOrderId',   // 当前进行中的订单ID（内部使用）
        ],
        relations: {
          // communityId 字段关联到 Community 实体
          communityId: {
            entityClassName: 'Community',
            entityName: 'community',
            displayField: 'name', // 显示社区名称
            valueField: '_id',    // 使用 _id 作为值
          },
        },
        // 字段覆盖配置
        fieldOverrides: {
          // 姓名
          name: {
            label: '姓名',
            required: true,
            rules: [
              { required: true, message: '请输入姓名' },
              { max: 50, message: '姓名最多50个字符' },
            ],
          },

          // 手机号
          phone: {
            label: '手机号',
            required: true,
            rules: [
              { required: true, message: '请输入手机号' },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入有效的手机号',
              },
            ],
          },

          // 头像
          avatar: {
            label: '头像',
            valueType: 'image',
            renderTable: (_: any, record: any) => {
              const value = record.avatar;
              if (!value) return '-';
              return (
                <Image
                  src={value}
                  alt="头像"
                  width={40}
                  height={40}
                  style={{ objectFit: 'cover', borderRadius: '50%' }}
                />
              );
            },
            renderFormItem: (props: any) => (
              <FileUpload {...props} uploadType="image" maxCount={1} />
            ),
          },

          // 性别
         

          // 出生日期
          birthDate: {
            label: '出生日期',
            valueType: 'date',
            hideInSearch: true,
          },

          // 可服务的分类
          categories: {
            label: '可服务的分类',
            valueType: 'textarea',
            hideInSearch: true,
            fieldProps: {
              rows: 2,
              placeholder: 'JSON数组格式，如：["cleaning", "repair"]',
            },
          },

          // 可提供的服务ID列表
          serviceIds: {
            label: '可提供的服务',
            valueType: 'textarea',
            hideInSearch: true,
            hideInTable: true,
            fieldProps: {
              rows: 2,
              placeholder: 'JSON数组格式，如：["id1", "id2"]',
            },
          },

          // 平均评分
          rating: {
            label: '平均评分',
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

          // 完成订单数
          orderCount: {
            label: '完成订单数',
            valueType: 'digit',
            hideInForm: true,
            initialValue: 0,
          },

          // 在线状态
          

          // 身份认证状态
          idCardVerified: {
            label: '身份认证',
            valueType: 'select',
            valueEnum: {
              true: { text: '已认证', status: 'Success' },
              false: { text: '未认证', status: 'Default' },
            },
            initialValue: false,
          },

          // 技能认证状态
          skillCertified: {
            label: '技能认证',
            valueType: 'select',
            valueEnum: {
              true: { text: '已认证', status: 'Success' },
              false: { text: '未认证', status: 'Default' },
            },
            initialValue: false,
          },

          // 证书图片
          certificates: {
            label: '证书图片',
            valueType: 'image',
            hideInSearch: true,
            renderTable: (_: any, record: any) => {
              const value = record.certificates;
              if (!value || !Array.isArray(value) || value.length === 0) return '-';
              const previewImages = value.slice(0, 2).map((img: string, index: number) => (
                <Image
                  key={index}
                  src={img}
                  alt={`证书${index + 1}`}
                  width={30}
                  height={30}
                  style={{ objectFit: 'cover', borderRadius: 4, marginRight: 4 }}
                />
              ));
              const count = value.length > 2 ? (
                <span style={{ marginLeft: 4, color: '#999' }}>+{value.length - 2}</span>
              ) : null;
              return <span style={{ display: 'flex', alignItems: 'center' }}>{previewImages}{count}</span>;
            },
            renderFormItem: (props: any) => (
              <FileUpload {...props} uploadType="image" maxCount={9} />
            ),
          },

          // 个人介绍
          introduction: {
            label: '个人介绍',
            valueType: 'textarea',
            hideInSearch: true,
            fieldProps: {
              rows: 4,
            },
          },

          // 工作年限
          workYears: {
            label: '工作年限',
            valueType: 'digit',
            hideInSearch: true,
            fieldProps: {
              min: 0,
              max: 50,
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
          title: '新建服务人员',
          width: 800,
        },
        updateModal: {
          title: '编辑服务人员',
          width: 800,
        },
      }}

      // 表单默认值 
      data={{ 
        status: 1,
        idCardVerified: false,
        skillCertified: false,
        reviewCount: 0,
        orderCount: 0,
        rating: 0,
      }}

      // 回调函数
      callbacks={{
        onCreateSuccess: () => {
          console.log('服务人员创建成功');
        },
        onUpdateSuccess: () => {
          console.log('服务人员更新成功');
        },
        onDeleteSuccess: () => {
          console.log('服务人员删除成功');
        },
        onError: (error, operation) => {
          console.error(`服务人员${operation}操作失败:`, error);
        },
      }}
    />
  );
}
