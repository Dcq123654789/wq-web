import React from 'react';
import { GenericCrud } from '@/components/GenericCrud';
import RelationSelect from '@/components/GenericCrud/components/RelationSelect';

/**
 * 活动报名管理页面
 *
 * 功能特性：
 * - 动态获取活动报名实体字段信息
 * - 自动生成表格列和表单字段
 * - 使用通用 CRUD 接口
 * - 支持关联活动（CommunityActivity）
 * - 支持关联用户（WqUser）
 * - 支持报名状态管理
 */
export default function ActivityRegistrationPage() {
  return (
    <GenericCrud
      rowKey="_id"
      headerTitle="活动报名管理"

      // 动态实体配置
      dynamicEntity={{
        // 实体类名（首字母大写）
        entityClassName: 'ActivityRegistration',

        // 实体名称（小写）
        entityName: 'activityregistration',

        // 排除的字段（不显示在表格和表单中）
        excludeFields: ['openid', 'unionid', 'sessionKey'],

        // 关联实体配置
        relations: {
          // activityId 字段关联到 CommunityActivity 实体
          activityId: {
            entityClassName: 'CommunityActivity',
            entityName: 'communityActivity',
            displayField: 'title', // 显示活动标题
            valueField: '_id',     // 使用 _id 作为值
          },
          // userId 字段关联到 WqUser 实体
          // userId: {
          //   entityClassName: 'WqUser',
          //   entityName: 'wquser',
          //   displayField: 'nickname', // 显示用户昵称
          //   valueField: '_id',        // 使用 _id 作为值
          // },
        },

        // 字段覆盖配置
        fieldOverrides: {
          // 用户ID - 添加联动功能
          userId: {
            label: '用户',
            required: true,
            renderFormItem: ({ value, onChange, form, mode }: any) => {
              const relationConfig = {
                entityClassName: 'WqUser',
                entityName: 'wquser',
                displayField: 'nickname', // 显示用户昵称 
              };

              return (
                <RelationSelect
                  value={value}
                  relationConfig={relationConfig}
                  mode={mode}
                  onChange={(selectedValue: string, userRecord: any) => {
                    // 调用原始onChange
                    onChange?.(selectedValue);
                    
                    // 当选择用户时，自动填充姓名和联系电话
                    if (userRecord) { 
                      // 自动填充姓名字段（根据WqUser实体的字段名调整）
                      if (userRecord.nickname) {
                        form.setFieldValue('userName', userRecord.nickname);
                      }  

                      // 自动填充联系电话字段
                      if (userRecord.phone) {
                        form.setFieldValue('userPhone', userRecord.phone);
                      }  
                    }
                  }}
                />
              );
            },
          },

          // 姓名
          userName: {
            label: '姓名',
            valueType: 'text',
            required: true,
            fieldProps: {
              placeholder: '请输入姓名',
            },
          },

          // 联系电话
          userPhone: {
            label: '联系电话',
            valueType: 'text',
            required: true,
            rules: [
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入有效的手机号码',
              },
            ],
            fieldProps: {
              placeholder: '请输入联系电话',
            },
          },

          // 备注
          remark: {
            label: '备注',
            valueType: 'textarea',
            fieldProps: {
              rows: 3,
              placeholder: '请输入备注信息',
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
          title: '新建报名记录',
          width: 600,
        },
        updateModal: {
          title: '编辑报名记录',
          width: 600,
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
