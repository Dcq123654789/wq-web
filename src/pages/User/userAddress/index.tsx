import React from 'react';
import { GenericCrud } from '@/components/GenericCrud';
import { Tag, Badge } from 'antd';

/**
 * 用户收货地址管理页面
 *
 * 功能特性：
 * - 动态获取收货地址实体字段信息
 * - 自动生成表格列和表单字段
 * - 支持按用户ID筛选
 * - 支持默认地址标记
 * - 支持地址标签分类（家、公司、学校）
 * - 显示完整地址信息
 */
export default function UserAddressPage() {
  return (
    <GenericCrud
      rowKey="_id"
      headerTitle="收货地址管理"

      // 动态实体配置
      dynamicEntity={{
        // 实体类名（首字母大写）
        entityClassName: 'UserAddress',

        // 实体名称（小写）
        entityName: 'userAddress',

        // 排除的字段
        excludeFields: [
          'wquser',  // 排除关联对象字段，只使用 userId 外键
          'user',    // 如果后端有 user 字段，也排除
        ],

        // 关联实体配置
        relations: {
          // userId 字段关联到 WqUser 实体
          userId: {
            entityClassName: 'WqUser',
            entityName: 'wquser',
            displayField: 'nickname', // 显示用户的昵称
            valueField: '_id',
          },
        },

        // 字段覆盖配置
        fieldOverrides: {
          // 用户ID - 关联用户实体
          userId: {
            label: '所属用户',
            valueType: 'select', // 下拉选择
            required: true,
            rules: [
              { required: true, message: '请选择用户' },
            ],
            // 在表格中显示用户昵称（如果后端返回了关联对象）
            renderTable: (_: any, record: any) => {
              // 如果后端返回了关联对象（DTO/懒加载）
              if (record.wquser && record.wquser.nickname) {
                return (
                  <span>
                    <span style={{ marginRight: '4px' }}>👤</span>
                    <strong>{record.wquser.nickname}</strong>
                    {record.wquser.phone && (
                      <span style={{ color: '#999', marginLeft: '8px', fontSize: '12px' }}>
                        ({record.wquser.phone})
                      </span>
                    )}
                  </span>
                );
              }
              // 否则显示 userId 的前 12 位
              return (
                <span style={{ color: '#666', fontSize: '12px' }}>
                  {record.userId?.substring(0, 12)}{record.userId?.length > 12 ? '...' : ''}
                </span>
              );
            },
          },

          // 收货人姓名
          receiverName: {
            label: '收货人',
            valueType: 'text',
            required: true,
            rules: [
              { required: true, message: '请输入收货人姓名' },
              { max: 50, message: '收货人姓名最多50个字符' },
            ],
          },

          // 收货人电话
          receiverPhone: {
            label: '联系电话',
            valueType: 'text',
            required: true,
            rules: [
              { required: true, message: '请输入收货人电话' },
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
            required: true,
            rules: [
              { required: true, message: '请输入省份' },
              { max: 50, message: '省份最多50个字符' },
            ],
          },

          // 城市
          city: {
            label: '城市',
            valueType: 'text',
            required: true,
            rules: [
              { required: true, message: '请输入城市' },
              { max: 50, message: '城市最多50个字符' },
            ],
          },

          // 区/县
          district: {
            label: '区/县',
            valueType: 'text',
            rules: [
              { max: 50, message: '区/县最多50个字符' },
            ],
          },

          // 详细地址
          detailAddress: {
            label: '详细地址',
            valueType: 'textarea',
            required: true,
            rules: [
              { required: true, message: '请输入详细地址' },
              { max: 255, message: '详细地址最多255个字符' },
            ],
            // 在表格中显示完整地址
            renderTable: (_: any, record: any) => {
              const fullAddress = [
                record.province,
                record.city,
                record.district,
                record.detailAddress,
              ].filter(Boolean).join('');
              return <span style={{ fontSize: '12px' }}>{fullAddress}</span>;
            },
          },

          // 邮政编码
          postalCode: {
            label: '邮政编码',
            valueType: 'text',
            rules: [
              {
                pattern: /^\d{6}$/,
                message: '请输入有效的6位邮政编码',
              },
            ],
          },

          // 是否默认地址（Integer 类型：0=NO, 1=YES）
          isDefault: {
            label: '默认地址',
            valueType: 'select',
            valueEnum: {
              0: { text: '普通地址', status: 'Default' },
              1: { text: '默认地址', status: 'Success' },
            },
            required: true,
            initialValue: 0,
            renderTable: (_: any, record: any) => {
              return record.isDefault === 1 ? (
                <Badge status="success" text="默认" />
              ) : (
                <Badge status="default" text="普通" />
              );
            },
          },

          // 地址标签（Integer 类型：0=家, 1=公司, 2=学校）
          tag: {
            label: '地址标签',
            valueType: 'select',
            valueEnum: {
              0: { text: '家', status: 'Processing' },
              1: { text: '公司', status: 'Processing' },
              2: { text: '学校', status: 'Processing' },
            },
            renderTable: (_: any, record: any) => {
              const tagMap: Record<number, { text: string; color: string }> = {
                0: { text: '家', color: 'green' },
                1: { text: '公司', color: 'blue' },
                2: { text: '学校', color: 'orange' },
              };
              const tagInfo = tagMap[record.tag];
              if (!tagInfo) return <span style={{ color: '#999' }}>-</span>;
              return <Tag color={tagInfo.color}>{tagInfo.text}</Tag>;
            },
          },

          // 使用次数
          usedCount: {
            label: '使用次数',
            valueType: 'digit',
            hideInForm: true, // 不允许手动修改
            hideInSearch: true,
            renderTable: (_: any, record: any) => {
              return <Tag color="purple">{record.usedCount || 0} 次</Tag>;
            },
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
          labelWidth: 100,
          span: 6,
        },
        table: {
          size: 'middle',
          pagination: {
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
          },
          scroll: { x: 1600 },
        },
        createModal: {
          title: '新建收货地址',
          width: 800,
        },
        updateModal: {
          title: '编辑收货地址',
          width: 800,
        },
      }}

      // 表单默认值
      data={{
        isDefault: 0, // Integer 类型：0=NO（普通地址）, 1=YES（默认地址）
        usedCount: 0,
      }}

      // 回调函数
      callbacks={{
        onCreateSuccess: () => {
          console.log('收货地址创建成功');
        },
        onUpdateSuccess: () => {
          console.log('收货地址更新成功');
        },
        onDeleteSuccess: () => {
          console.log('收货地址删除成功');
        },
        onError: (error, operation) => {
          console.error(`收货地址${operation}操作失败:`, error);
        },
      }}
    />
  );
}
