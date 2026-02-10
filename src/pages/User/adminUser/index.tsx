import React from 'react';
import { GenericCrud } from '@/components/GenericCrud';
import { Image } from 'antd';
import FileUpload from '@/components/FileUpload';
/**
 * 管理员用户管理页面
 *
 * 功能特性：
 * - 动态获取管理员实体字段信息
 * - 自动生成表格列和表单字段
 * - 使用通用 CRUD 接口
 * - 支持管理员头像显示
 * - 支持角色筛选（超级管理员、管理员、普通管理员）
 * - 支持状态筛选（正常、禁用、锁定）
 * - 密码重置功能
 */
export default function AdminUserPage() {
  return (
    <GenericCrud
      rowKey="_id"
      headerTitle="管理员用户管理"

      // 动态实体配置
      dynamicEntity={{
        // 实体类名（首字母大写）
        entityClassName: 'AdminUser',

        // 实体名称（小写）
        entityName: 'adminuser',

        // 排除的字段（不显示在表格和表单中）
        excludeFields: [
          'password',        // 密码（敏感信息，单独处理重置）
        ],

        // 字段覆盖配置
        fieldOverrides: {
          // 用户名
          username: {
            label: '用户名',
            required: true,
            rules: [
              { required: true, message: '请输入用户名' },
              { min: 3, max: 20, message: '用户名长度为 3-20 个字符' },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: '用户名只能包含字母、数字和下划线',
              },
            ],
          },

          // 真实姓名
          realName: {
            label: '真实姓名',
            required: true,
            rules: [
              { required: true, message: '请输入真实姓名' },
              { min: 2, max: 20, message: '姓名长度为 2-20 个字符' },
            ],
          },

          // 头像字段（显示为图片）
          avatar: {
            label: '头像',
            valueType: 'image', 
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
              <FileUpload {...props} uploadType="image" maxCount={1} />
            ),
          },

          // 手机号
          phone: {
            label: '手机号',
            valueType: 'text',
            rules: [
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入有效的手机号',
              },
            ],
          },

          // 邮箱
          email: {
            label: '邮箱',
            valueType: 'text',
            rules: [
              {
                type: 'email',
                message: '请输入有效的邮箱地址',
              },
            ],
          },

          // 角色字段（下拉选择）
          role: {
            label: '角色',
            valueType: 'select',
            valueEnum: {
              0: { text: '超级管理员', status: 'Processing' },
              1: { text: '管理员', status: 'Success' },
              2: { text: '普通管理员', status: 'Default' },
            },
            required: true,
            initialValue: 2, // 默认为普通管理员
          },

          // 角色描述（只读显示）
          roleDescription: {
            label: '角色描述',
            valueType: 'text',
            hideInForm: true, // 在表单中隐藏
          },

          // 状态字段（下拉选择）
          status: {
            label: '状态',
            valueType: 'select',
            valueEnum: {
              0: { text: '禁用', status: 'Error' },
              1: { text: '正常', status: 'Success' },
              2: { text: '锁定', status: 'Warning' },
            },
            required: true,
            initialValue: 1, // 默认为正常
          },

          // 最后登录时间（只读显示）
          lastLoginTime: {
            label: '最后登录时间',
            valueType: 'dateTime',
            hideInForm: true, // 在表单中隐藏（只读）
            hideInSearch: true, // 在搜索中隐藏
          },

          // 最后登录IP（只读显示）
          lastLoginIp: {
            label: '最后登录IP',
            valueType: 'text',
            hideInForm: true, // 在表单中隐藏（只读）
            hideInSearch: true, // 在搜索中隐藏
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
        create: true,       // 允许新建管理员
        update: true,       // 允许编辑管理员
        delete: true,       // 允许删除管理员
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
          scroll: { x: 1400 }, // 横向滚动（字段较多）
        },
        createModal: {
          title: '新建管理员',
          width: 700,
        },
        updateModal: {
          title: '编辑管理员',
          width: 700,
        },
      }}

      // 表单默认值（新建时）
      data={{
        status: 1,         // 默认状态为正常
        role: 2,           // 默认角色为普通管理员
      }}

      // 回调函数
      callbacks={{
        onCreateSuccess: () => {
          console.log('管理员创建成功');
        },
        onUpdateSuccess: () => {
          console.log('管理员更新成功');
        },
        onDeleteSuccess: () => {
          console.log('管理员删除成功');
        },
        onError: (error, operation) => {
          console.error(`管理员${operation}操作失败:`, error);
        },
      }}
    />
  );
}
