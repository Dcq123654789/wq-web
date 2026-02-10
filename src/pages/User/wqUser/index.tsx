import React from 'react';
import { GenericCrud } from '@/components/GenericCrud';

/**
 * 微信用户管理页面
 *
 * 功能特性：
 * - 动态获取用户实体字段信息
 * - 自动生成表格列和表单字段
 * - 使用通用 CRUD 接口
 * - 支持用户头像显示
 * - 支持性别筛选
 * - 支持手机号搜索
 */
export default function WqUserPage() {
  return (
    <GenericCrud
      rowKey="_id"
      headerTitle="微信用户管理"

      // 动态实体配置
      dynamicEntity={{
        // 实体类名（首字母大写）
        entityClassName: 'WqUser',

        // 实体名称（小写）
        entityName: 'wquser',

        // 排除的字段（不显示在表格和表单中）
        excludeFields: [
          'openid',          // 微信 OpenID（敏感信息）
          'unionid',         // 微信 UnionID（敏感信息）
          'sessionKey',      // 会话密钥（敏感信息）
          'password',        // 密码（如有）
        ],

        // 字段覆盖配置
        fieldOverrides: {
          // 用户昵称
          nickname: {
            label: '用户昵称',
            required: true,
            rules: [
              { min: 2, max: 20, message: '昵称长度为 2-20 个字符' },
            ],
          },

          // 头像字段（显示为图片）
          avatar: {
            label: '头像',
            valueType: 'image',
            width: 80,
          },

          // 真实姓名
          realName: {
            label: '真实姓名',
            valueType: 'text',
            rules: [
              { max: 50, message: '真实姓名最多50个字符' },
            ],
          },

          // 性别字段（显示为下拉选择）
          gender: {
            label: '性别',
            valueType: 'select',
            valueEnum: {
              1: { text: '男', status: 'Success' },
              2: { text: '女', status: 'Processing' },
              0: { text: '未知', status: 'Default' },
            },
            initialValue: 0,
          },

          // 出生日期
          birthDate: {
            label: '出生日期',
            valueType: 'date',
            hideInSearch: true,
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

          // 省份
          province: {
            label: '省份',
            valueType: 'text',
            hideInSearch: true,
            rules: [
              { max: 50, message: '省份最多50个字符' },
            ],
          },

          // 城市
          city: {
            label: '城市',
            valueType: 'text',
            hideInSearch: true,
            rules: [
              { max: 50, message: '城市最多50个字符' },
            ],
          },

          // 区/县
          district: {
            label: '区/县',
            valueType: 'text',
            hideInSearch: true,
            hideInTable: true, // 表格中不显示，太占空间
            rules: [
              { max: 50, message: '区/县最多50个字符' },
            ],
          },

          // 详细地址
          detailAddress: {
            label: '详细地址',
            valueType: 'textarea',
            hideInSearch: true,
            hideInTable: true, // 表格中不显示，太占空间
            rules: [
              { max: 255, message: '详细地址最多255个字符' },
            ],
          },

          // 所属社区ID
          communityId: {
            label: '社区ID',
            valueType: 'text',
            hideInTable: true, // 表格中只显示社区名称
            rules: [
              { max: 64, message: '社区ID最多64个字符' },
            ],
          },

          // 所属社区名称
          communityName: {
            label: '所属社区',
            valueType: 'text',
          },

          // 用户收货地址（关联关系）
          addresses: {
            label: '收货地址',
            hideInTable: true,
            hideInSearch: true,
            hideInForm: true, // 不在主表单中显示
          },

          // 创建时间
          createTime: {
            label: '注册时间',
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
        create: true,       // 允许新建用户
        update: true,       // 允许编辑用户
        delete: true,       // 允许删除用户
        batchDelete: true,  // 允许批量删除
        selection: true,    // 显示复选框
        export: false,      // 暂不开放导出
      }}

      // UI 配置
      ui={{
        search: {
          labelWidth: 80,
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
          scroll: { x: 1200 }, // 横向滚动
        },
        createModal: {
          title: '新建微信用户',
          width: 700,
        },
        updateModal: {
          title: '编辑微信用户',
          width: 700,
        },
      }}

      // 表单默认值
      data={{
        gender: 0, // 默认性别为未知
      }}

      // 回调函数
      callbacks={{
        onCreateSuccess: () => {
          console.log('微信用户创建成功');
        },
        onUpdateSuccess: () => {
          console.log('微信用户更新成功');
        },
        onDeleteSuccess: () => {
          console.log('微信用户删除成功');
        },
        onError: (error, operation) => {
          console.error(`微信用户${operation}操作失败:`, error);
        },
      }}
    />
  );
}
