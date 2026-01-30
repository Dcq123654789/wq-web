import React from 'react';
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
          // community 字段关联到 Community 实体
          community: {
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
          // 活动图片（单张）
          coverImage: {
            valueType: 'image',
            render: (props: any) => (
              <FileUpload {...props} uploadType="image" maxCount={8} />
            ),
          },
          // 活动图库（多张）
          images: {
            valueType: 'image',
            render: (props: any) => (
              <FileUpload {...props} uploadType="image" maxCount={9} />
            ),
          },
          // 活动开始时间
          startTime: {
            valueType: 'dateTime',
          },
          // 活动结束时间
          endTime: {
            valueType: 'dateTime',
          },
          // 活动地点（使用地图选择器）
          locationAddress: {
            label: '活动地点',
            valueType: 'text',
            required: true,
            render: (formProps: any) => (
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
                  console.log('📍 地图选择器 onChange - 位置信息:', locationInfo);

                  // 更新当前字段（locationAddress）
                  formProps.onChange?.(locationInfo);

                  // 获取表单实例
                  const form = formProps.form;

                  if (!form) {
                    console.error('❌ 表单实例不存在，无法更新字段值');
                    return;
                  }

                  console.log('✅ 表单实例已获取');

                  // 同时更新经纬度字段（如果存在）
                  if (locationInfo) {
                    // 更新经度字段
                    if (locationInfo.lng !== undefined && locationInfo.lng !== null) {
                      form.setFieldValue('longitude', locationInfo.lng);
                      console.log(`✅ 已设置经度 (longitude): ${locationInfo.lng}`);
                    } else {
                      console.warn('⚠️ locationInfo.lng 为空');
                    }

                    // 更新纬度字段
                    if (locationInfo.lat !== undefined && locationInfo.lat !== null) {
                      form.setFieldValue('latitude', locationInfo.lat);
                      console.log(`✅ 已设置纬度 (latitude): ${locationInfo.lat}`);
                    } else {
                      console.warn('⚠️ locationInfo.lat 为空');
                    }

                    // 如果需要，也可以更新其他相关字段
                    if (locationInfo.province) {
                      form.setFieldValue('province', locationInfo.province);
                      console.log(`✅ 已设置省份: ${locationInfo.province}`);
                    }
                    if (locationInfo.city) {
                      form.setFieldValue('city', locationInfo.city);
                      console.log(`✅ 已设置城市: ${locationInfo.city}`);
                    }
                    if (locationInfo.district) {
                      form.setFieldValue('district', locationInfo.district);
                      console.log(`✅ 已设置区县: ${locationInfo.district}`);
                    }

                    // 打印当前表单的所有值（用于调试）
                    setTimeout(() => {
                      const currentValues = form.getFieldsValue();
                      console.log('📋 当前表单数据:', {
                        longitude: currentValues.longitude,
                        latitude: currentValues.latitude,
                        locationAddress: currentValues.locationAddress,
                        province: currentValues.province,
                        city: currentValues.city,
                        district: currentValues.district,
                      });
                    }, 100);
                  } else {
                    console.error('❌ locationInfo 为空，无法设置经纬度');
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
          labelWidth: 80,
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
          console.error(`${operation} 操作失败:`, error);
        },
      }}
    />
  );
}
