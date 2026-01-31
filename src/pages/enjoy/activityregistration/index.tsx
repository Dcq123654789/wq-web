import React from 'react';
import { GenericCrud } from '@/components/GenericCrud';

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
          userId: {
            entityClassName: 'WqUser',
            entityName: 'wquser',
            displayField: 'nickname', // 显示用户昵称
            valueField: '_id',        // 使用 _id 作为值
          },
        },

        // 字段覆盖配置
        fieldOverrides: {
          // 报名状态
          status: {
            label: '报名状态',
            valueType: 'select',
            valueEnum: {
              0: { text: '待审核', status: 'Default' },
              1: { text: '已通过', status: 'Success' },
              2: { text: '已拒绝', status: 'Error' },
              3: { text: '已取消', status: 'Warning' },
            },
            required: true,
          },

          // 联系电话
          contactPhone: {
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

          // 报名时间（只读）
          registrationTime: {
            label: '报名时间',
            valueType: 'dateTime',
            hideInForm: true, // 在表单中隐藏
            hideInSearch: true, // 在搜索中隐藏
          },

          // 创建时间（只读）
          createTime: {
            label: '创建时间',
            valueType: 'dateTime',
            hideInForm: true,
            hideInSearch: true,
          },

          // 更新时间（只读）
          updateTime: {
            label: '更新时间',
            valueType: 'dateTime',
            hideInForm: true,
            hideInSearch: true,
          },

          // 活动ID - 在表格中显示活动标题
          activityId: {
            label: '活动名称',
            hideInForm: false, // 在表单中显示（下拉选择）
            hideInSearch: true, // 在搜索中隐藏（关联字段不适合搜索）
          },

          // 用户ID - 在表格中显示用户昵称
          userId: {
            label: '报名用户',
            hideInForm: false, // 在表单中显示（下拉选择）
            hideInSearch: true, // 在搜索中隐藏
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
