import React from 'react';
import { Image } from 'antd';
import { GenericCrud } from '@/components/GenericCrud';
import FileUpload from '@/components/FileUpload';
import MapPicker from '@/components/MapPicker';

/**
 * 社区活动管理页面
 *
 * 功能特性：
 * - 动态获取活动实体字段信息
 * - 自动生成表格列和表单字段
 * - 使用通用 CRUD 接口
 * - 支持活动图片上传
 * - 支持地图选点功能
 */
export default function ActivitiesPage() {
  return (
    <GenericCrud
      rowKey="_id"
      headerTitle="活动管理"
      // ⭐ 表单默认值
      //data={{ longitude: 22 }}
      // 动态实体配置
      dynamicEntity={{
        // 实体类名（首字母大写）
        entityClassName: 'CommunityActivity', 
        // 实体名称（小写） 
        entityName: 'communityActivity', 
        // 排除的字段（不显示在表格和表单中）
        excludeFields: [], 
        // 关联实体配置
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
          // 活动标题字段
          title: {
            required: true,
            rules: [
              { min: 2, max: 50, message: '标题长度为 2-50 个字符' },
            ],
          },
          // 活动描述字段
          description: {
            valueType: 'textarea',
            fieldProps: {
              rows: 4,
            },
          },
          // 活动图片（单张封面）
          coverImage: {
            label: '活动封面',
            valueType: 'image',
            // 表格中显示图片
            renderTable: (_: any, record: any) => {
              const value = record.coverImage;
              if (!value) return '-';
              // 如果是数组，显示第一张
              if (Array.isArray(value)) {
                return value.length > 0 ? (
                  <Image
                    src={value[0]}
                    alt="封面"
                    width={40}
                    height={40}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                  />
                ) : '-';
              }
              // 如果是字符串，直接显示
              return (
                <Image
                  src={value}
                  alt="封面"
                  width={40}
                  height={40}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                />
              );
            },
            // 表单中使用上传组件
            renderFormItem: (props: any) => (
              <FileUpload {...props} uploadType="image" maxCount={3} />
            ),
          },
          // 活动图库（多张）
          images: {
            label: '活动图库',
            valueType: 'image',
            // 表格中显示多张图片的缩略图
            renderTable: (_: any, record: any) => {
              const value = record.images;
              if (!value || !Array.isArray(value) || value.length === 0) return '-';
              // 显示前3张图片作为缩略图
              const previewImages = value.slice(0, 3).map((img: string, index: number) => (
                <Image
                  key={index}
                  src={img}
                  alt={`图库${index + 1}`}
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
          // 活动开始时间
          activityStartTime: {
            label: '活动开始时间',
            valueType: 'dateTime',
          },
          // 活动结束时间
          activityEndTime: {
            label: '活动结束时间',
            valueType: 'dateTime',
          },
          // 标签（数组类型）
          tags: {
            label: '标签',
            valueType: 'select',
            fieldProps: {
              mode: 'tags',
              placeholder: '请输入标签，按回车添加',
              options: [], // 空选项，允许自由输入
            },
            // normalize: 当值被设置到表单时调用（编辑时，从后端数据转为表单数据）
            normalize: (value: any) => {
              // 如果是字符串，转换为数组
              if (typeof value === 'string' && value) {
                return value.split(',').map(t => t.trim()).filter(t => t);
              }
              // 如果已经是数组，直接返回
              return Array.isArray(value) ? value : [];
            },
          },
          // 活动地点（使用地图选择器）
          locationAddress: {
            label: '活动地点',
            valueType: 'text',
            // 编辑时：将后端数据转换为对象传给 MapPicker
            normalize: (value: any, record: any) => {

              // 如果 value 已经是对象（包含 lng/lat），直接返回
              if (value && typeof value === 'object' && (value.lng || value.lat)) {
                return value;
              }

              // 如果是字符串地址，需要结合经纬度字段重建对象
              if (typeof value === 'string' && value) {
                return {
                  address: value,
                  lng: record?.longitude,
                  lat: record?.latitude,
                };
              }

              return value;
            },
            // 表单中使用地图选择器
            renderFormItem: (formProps: any) => (
              <MapPicker
                {...formProps}
                config={{
                  amapKey: process.env.AMAP_KEY,
                  mapType: 'amap',
                  defaultCenter: [116.397428, 39.90923], // 北京天安门
                  defaultZoom: 15,
                }}
                placeholder="请点击选择活动地点"
                modalTitle="选择活动地点"
                modalWidth={900}
                onChange={(locationInfo: any) => {

                  // 获取表单实例
                  const form = formProps.form;

                  if (!form) {
                    return;
                  }

                  // ⭐ 关键修复：保存完整的 LocationInfo 对象（包含 address）
                  // 这样 normalize 函数可以正确读取 address 字段
                  formProps.onChange?.(locationInfo);


                  // 同时更新经纬度字段（保持原有逻辑）
                  if (locationInfo) {
                    if (locationInfo.lng !== undefined && locationInfo.lng !== null) {
                      form.setFieldValue('longitude', locationInfo.lng);
                    }
                    if (locationInfo.lat !== undefined && locationInfo.lat !== null) {
                      form.setFieldValue('latitude', locationInfo.lat);
                    }
                  }
                }}
              />
            ),
          },
          // 经度字段（显示，可手动修改）
          longitude: {
            label: '经度',
            valueType: 'text',
            rules: [
              {
                pattern: /^-?(\d{1,3}(\.\d+)?)?$/,
                message: '请输入有效的经度（-180 到 180）',
              },
            ],
            fieldProps: {
              placeholder: '如：116.397428',
              precision: 6,
              step: 0.000001,
            },
          },
          // 纬度字段（显示，可手动修改）
          latitude: {
            label: '纬度',
            valueType: 'text',
            rules: [
              {
                pattern: /^-?(\d{1,2}(\.\d+)?)?$/,
                message: '请输入有效的纬度（-90 到 90）',
              },
            ],
            fieldProps: {
              placeholder: '如：39.90923',
              precision: 6,
              step: 0.000001,
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
          labelWidth: 120, // 增加标签宽度，让名称完整显示
          span: 6,
        },
        table: {
          size: 'middle',
          pagination: {
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
          },
        },
        createModal: {
          title: '新建活动',
          width: 800,
        },
        updateModal: {
          title: '编辑活动',
          width: 800,
        },
      }}

      // 回调函数
      callbacks={{
        onCreateSuccess: () => {
          // 创建成功后的回调
        },
        onUpdateSuccess: () => {
          // 更新成功后的回调
        },
        onDeleteSuccess: () => {
          // 删除成功后的回调
        },
        onError: (error, operation) => {
        },
      }}
    />
  );
}
