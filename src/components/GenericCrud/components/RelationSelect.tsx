import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import type { RelationConfig } from '../types';
import { queryEntity } from '@/services/genericEntity';

interface RelationSelectProps {
  value?: any;
  onChange?: (value: any) => void;
  relationConfig: RelationConfig;
  mode?: 'create' | 'update';
  disabled?: boolean;
}

/**
 * 关联实体选择器
 * 动态加载关联实体的数据并渲染为下拉选择器
 */
const RelationSelect: React.FC<RelationSelectProps> = ({
  value,
  onChange,
  relationConfig,
  mode,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<{ label: string; value: any }[]>([]);

  const {
    entityClassName,
    entityName,
    displayField = 'name',
    valueField = '_id',
    multiple = false,
  } = relationConfig;

  // 加载关联实体数据
  useEffect(() => {
    const loadRelationData = async () => {
      try {
        setLoading(true);

        // 查询关联实体列表
        const result = await queryEntity(entityName, {
          current: 1,
          pageSize: 1000, // 获取所有数据
        });

        if (result.success && result.data) {
          const opts = result.data.map((item: any) => ({
            label: item[displayField] || item[valueField],
            value: item[valueField],
          }));
          setOptions(opts);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadRelationData();
  }, [entityName, entityClassName, displayField, valueField]);

  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      loading={loading}
      disabled={disabled}
      mode={multiple ? 'multiple' : undefined}
      placeholder={`请选择${displayField === 'name' ? '社区' : displayField}`}
      showSearch
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
      allowClear
    />
  );
};

export default RelationSelect;
