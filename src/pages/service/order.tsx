import React from 'react';
import { GenericCrud } from '@/components/GenericCrud';
import { Image, Tag } from 'antd';
import FileUpload from '@/components/FileUpload';

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
        entityName: 'serviceorder',

        // 排除的字段
        excludeFields: [
        
        ],
        relations: {
          // communityId 字段关联到 Community 实体
          userId: {
            entityClassName: 'WqUser',
            entityName: 'WqUser',
            displayField: 'nickname', // 显示社区名称
            valueField: '_id',    // 使用 _id 作为值
          },
          serviceId: {
            entityClassName: 'WqService',
            entityName: 'WqService',
            displayField: 'name', // 显示社区名称
            valueField: '_id',    // 使用 _id 作为值
          },
          couponId: {
            entityClassName: 'ServiceCoupon',
            entityName: 'ServiceCoupon',
            displayField: 'name',  
            valueField: '_id',     
          },
          providerId: {
            entityClassName: 'ServiceProvider',
            entityName: 'ServiceProvider',
            displayField: 'name', // 显示社区名称
            valueField: '_id',    // 使用 _id 作为值
          }, 
        },
        // 字段覆盖配置
        fieldOverrides: {
         
          // 用户ID
          userId: {
            label: '用户ID',
            hideInForm: false,  // 创建时需要填写
            required: true,
          },

          // 服务ID
          serviceId: {
            label: '服务项目',
            hideInForm: false,  // 创建时需要填写
            required: true,
            // ⭐ 自动填充配置：选择服务后自动填充相关字段
            autoFill: {
              serviceName: 'name',        // 服务名称 <- name 
              originalPrice: 'price',     // 原价 <- price
            },
          },

          // 服务名称（冗余）
          serviceName: {
            label: '服务名称',
            hideInForm: false,  // 允许查看，但通常是自动填充的
          },
 
          // 服务人员ID
          providerId: {
            label: '服务人员',
            hideInForm: false,  // 允许选择
            required: false,   // 非必填，派单时再指定
            // ⭐ 自动填充配置：选择服务人员后自动填充相关字段
            autoFill: {
              providerName: 'name',    // 服务人员姓名 <- name
              providerPhone: 'phone',  // 服务人员电话 <- phone
            },
          },

          // 服务人员姓名（冗余）
          providerName: {
            label: '服务人员姓名',
            hideInForm: false,  // 允许查看
            hideInSearch: true,
          },

          // 服务人员电话（冗余）
          providerPhone: {
            label: '服务人员电话',
            hideInForm: false,  // 允许查看
            hideInSearch: true,
          },


          // 预约日期
          bookingDate: {
            label: '预约日期',
            valueType: 'date',
            hideInForm: false,  // 创建时需要填写
            required: true,
          },

          // 预约时间段
          timeSlot: {
            label: '预约时间段',
            hideInForm: false,  // 创建时需要填写
            required: true,
          },

          // 联系人姓名
          contactName: {
            label: '联系人姓名',
            hideInForm: false,  // 创建时需要填写
            required: true,
          },

          // 联系电话
          contactPhone: {
            label: '联系电话',
            hideInForm: false,  // 创建时需要填写
            required: true,
          }, 
          // 原价
          originalPrice: {
            label: '原价（元）',
            valueType: 'digit',
            hideInForm: false,  // 创建时需要填写
            required: true,
            fieldProps: {
              prefix: '¥',
              precision: 2,
            },
          },

          // 实际支付金额
          finalPrice: {
            label: '实付金额（元）',
            valueType: 'digit',
            hideInForm: false,  // 创建时需要填写
            required: true,
            fieldProps: {
              prefix: '¥',
              precision: 2,
            },
          },

          // 优惠金额
          discountAmount: {
            label: '优惠金额（元）',
            valueType: 'digit',
            hideInForm: false,  // 创建时需要填写
            fieldProps: {
              prefix: '¥',
              precision: 2,
            },
          }, 
  
          
          // 支付时间
          payTime: {
            label: '支付时间',
            valueType: 'dateTime',
            hideInForm: true,
            hideInSearch: true,
          },  
          // 用户备注
          remark: {
            label: '用户备注',
            valueType: 'textarea',
            hideInForm: false,  // 创建时可以填写
            hideInSearch: true,
          },

          // 取消原因
          cancelReason: {
            label: '取消原因',
            valueType: 'textarea',
            hideInForm: false,  // 允许在表单中编辑
            hideInSearch: true,
          },

          // 服务完成凭证图片
          proofImages: {
            label: '完成凭证',
            valueType: 'image',
            hideInSearch: true,
            renderTable: (_: any, record: any) => {
              const value = record.proofImages;
              if (!value) return '-';

              // 处理字符串格式：将字符串解析为数组
              let imageList: string[] = [];
              if (typeof value === 'string') {
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
                  alt={`凭证${index + 1}`}
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
            renderFormItem: (props: any) => {
              // 处理字符串格式：将字符串解析为数组
              let value = props.value;
              if (typeof value === 'string') {
                const cleaned = value.trim().replace(/^\[|\]$/g, '');
                value = cleaned.split(',').map(url => url.trim()).filter(url => url);
              }
              return <FileUpload {...props} value={value} uploadType="image" maxCount={9} />;
            },
          },


        },
      }}

      // 功能配置
      features={{
        create: true,    // 允许后台手动创建订单
        update: true,    // 允许修改订单状态等信息
        delete: true,    // 允许删除订单
        batchDelete: true, // 允许批量删除
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
        createModal: {
          title: '新建服务订单',
          width: 800,
        },
        updateModal: {
          title: '编辑订单',
          width: 800,
        },
      }}

      // 表单默认值
      data={{ 
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
