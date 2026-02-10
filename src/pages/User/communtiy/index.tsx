import React from 'react';
import { GenericCrud } from '@/components/GenericCrud';
import MapPicker from '@/components/MapPicker';
import { Input, Space } from 'antd';
/**
 * 社区管理页面
 *
 * 功能特性：
 * - 动态获取社区实体字段信息
 * - 自动生成表格列和表单字段
 * - 使用通用 CRUD 接口
 * - 支持社区编码、名称、位置信息管理
 * - 支持联系人信息管理
 * - 支持地理坐标（经纬度）管理
 */
export default function CommunityPage() {
  return (
    <GenericCrud
      rowKey="_id"
      headerTitle="社区列表"

      // 动态实体配置
      dynamicEntity={{
        // 实体类名（首字母大写）
        entityClassName: 'Community',

        // 实体名称（小写）
        entityName: 'community',

        // 排除的字段（不显示在表格和表单中）
        excludeFields: [
          'deleted', // 逻辑删除字段
        ],

        // 字段覆盖配置
        fieldOverrides: {
          // 社区编码
          code: {
            label: '社区编码',
            required: true,
            rules: [
              { required: true, message: '请输入社区编码' },
              { max: 50, message: '社区编码最多50个字符' },
            ],
          },

          // 社区名称
          name: {
            label: '社区名称',
            required: true,
            rules: [
              { required: true, message: '请输入社区名称' },
              { max: 100, message: '社区名称最多100个字符' },
            ],
          },

          // 省份（自动填充，可手动修改）
          province: {
            label: '省份',
            valueType: 'text',
          },

          // 城市（自动填充，可手动修改）
          city: {
            label: '城市',
            valueType: 'text',
          },

          // 区/县（自动填充，可手动修改）
          district: {
            label: '区/县',
            valueType: 'text',
          },

          // 详细地址（使用地图组件选择）
          detailAddress: {
            label: '详细地址',
            valueType: 'text',
            // 编辑时：将后端数据转换为对象传给 MapPicker
            normalize: (value: any, record: any) => {
              console.log('📍 detailAddress normalize (后端→表单):', value);

              // 如果是字符串地址，需要结合经纬度字段重建对象
              if (typeof value === 'string' && value) {
                return {
                  address: value,
                  lng: record?.longitude,
                  lat: record?.latitude,
                  province: record?.province,
                  city: record?.city,
                  district: record?.district,
                };
              }

              return value;
            },

            // 表单中使用地图选择器
            renderFormItem: (formProps: any) => {
              const form = formProps.form;
              // 从表单获取完整的 location 对象（用于 MapPicker 显示）
              const locationValue = {
                address: formProps.value?.address || formProps.value || '',
                lng: form?.getFieldValue('longitude'),
                lat: form?.getFieldValue('latitude'),
                province: form?.getFieldValue('province'),
                city: form?.getFieldValue('city'),
                district: form?.getFieldValue('district'),
              };

              return (
                <Space direction="vertical" style={{ width: '100%' }}>
                  {/* 地图选点组件 */}
                  <MapPicker
                    {...formProps}
                    value={locationValue}
                    config={{
                      amapKey: process.env.AMAP_KEY,
                      mapType: 'amap',
                      defaultCenter: [116.397428, 39.90923], // 北京天安门
                      defaultZoom: 15,
                    }}
                    placeholder="请点击选择社区位置"
                    modalTitle="选择社区位置"
                    modalWidth={900}
                    onChange={(locationInfo: any) => {
                      console.log('📍 地图选择器 onChange - 位置信息:', locationInfo);

                      if (!form) {
                        console.error('❌ 表单实例不存在，无法更新字段值');
                        return;
                      }

                      // ⭐ 关键修改：只保存 address 字符串到 detailAddress 字段
                      formProps.onChange?.(locationInfo?.address || '');

                      console.log('✅ 已保存地址字符串到 detailAddress:', locationInfo?.address);

                      // 同时更新经纬度和省市区字段
                      if (locationInfo) {
                        if (locationInfo.lng !== undefined && locationInfo.lng !== null) {
                          form.setFieldValue('longitude', locationInfo.lng);
                          console.log(`✅ 已设置经度: ${locationInfo.lng}`);
                        }
                        if (locationInfo.lat !== undefined && locationInfo.lat !== null) {
                          form.setFieldValue('latitude', locationInfo.lat);
                          console.log(`✅ 已设置纬度: ${locationInfo.lat}`);
                        }
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
                          console.log(`✅ 已设置区/县: ${locationInfo.district}`);
                        }
                      }
                    }}
                  />
                </Space>
              );
            },
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

          // 联系人
          contactPerson: {
            label: '联系人',
            valueType: 'text',
            rules: [
              { max: 50, message: '联系人最多50个字符' },
            ],
          },

          // 联系电话
          contactPhone: {
            label: '联系电话',
            valueType: 'text',
            rules: [
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入有效的手机号',
              },
              { max: 20, message: '联系电话最多20个字符' },
            ],
          },

          // 社区描述
          description: {
            label: '社区描述',
            valueType: 'textarea',
            hideInSearch: true, // 在搜索中隐藏
            rules: [
              { max: 500, message: '社区描述最多500个字符' },
            ],
          },

          // 创建时间（只读显示）
          createTime: {
            label: '创建时间',
            valueType: 'dateTime',
            hideInForm: true, // 在表单中隐藏（只读）
            hideInSearch: true, // 在搜索中隐藏
            sorter: true, // 允许排序
          },

          // 更新时间（只读显示）
          updateTime: {
            label: '更新时间',
            valueType: 'dateTime',
            hideInForm: true, // 在表单中隐藏（只读）
            hideInSearch: true, // 在搜索中隐藏
            sorter: true, // 允许排序
          },
        },
      }}

      // 功能配置
      features={{
        create: true,       // 允许新建社区
        update: true,       // 允许编辑社区
        delete: true,       // 允许删除社区
        batchDelete: true,  // 允许批量删除
        selection: true,    // 显示复选框
        export: false,      // 暂不开放导出
      }}

      // UI 配置
      ui={{
        search: {
          labelWidth: 100,
          span: 6,
          collapsed: false, // 默认展开搜索表单
        },
        table: {
          size: 'middle',
          pagination: {
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
          },
          scroll: { x: 1600 }, // 横向滚动（字段较多）
        },
        createModal: {
          title: '新建社区',
          width: 800,
        },
        updateModal: {
          title: '编辑社区',
          width: 800,
        },
      }}

      // 表单默认值（新建时）
      data={{
        deleted: 0,        // 默认未删除
      }}

      // 回调函数
      callbacks={{
        onCreateSuccess: () => {
          console.log('社区创建成功');
        },
        onUpdateSuccess: () => {
          console.log('社区更新成功');
        },
        onDeleteSuccess: () => {
          console.log('社区删除成功');
        },
        onError: (error, operation) => {
          console.error(`社区${operation}操作失败:`, error);
        },
      }}
    />
  );
}
