import React, { useMemo, useRef, useEffect } from 'react';
import { ProForm, ProFormText, ProFormSelect, ProFormDateTimePicker, ProFormDateRangePicker, ProFormMoney, ProFormTextArea, ProFormSwitch, ProFormRadio, ProFormCheckbox, ProFormSlider, ProFormDigit, ProFormDateTimeRangePicker, ProFormTimePicker, ProFormDependency } from '@ant-design/pro-components';
import type { FormFieldConfig, FormFieldRenderProps } from '../types';
import { buildValidationRules } from '../utils/formHelper';
import RelationSelect from './RelationSelect';

/**
 * 动态表单组件
 * 根据 formFields 配置动态生成表单字段
 */
const DynamicForm: React.FC<any> = ({
  formFields,
  mode,
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const formRef = useRef<any>();

  // 当 initialValues 变化时，设置表单值
  useEffect(() => {
    if (initialValues && formRef.current) {
      console.log('DynamicForm 设置表单初始值:', initialValues);
      formRef.current.setFieldsValue(initialValues);
    }
  }, [initialValues]);

  // 添加调试日志
  useEffect(() => {
    console.log('DynamicForm 渲染:', {
      mode,
      initialValues,
      formFieldsCount: formFields?.length,
    });
  }, [mode, initialValues, formFields]);
  // 渲染单个字段
  const renderField = (field: FormFieldConfig) => {
    const { name, label, valueType = 'text', required, render, renderFormItem, fieldProps = {} } = field;
    const rules = buildValidationRules(field);
    const fieldName = Array.isArray(name) ? name : [name];

    const commonProps = {
      name: fieldName,
      label,
      required,
      rules,
      ...fieldProps,
    };

    // 优先使用 renderFormItem（表单专用），如果没有则使用 render（通用渲染器）
    const customRender = renderFormItem || render;

    // 如果有自定义 render 函数，使用自定义渲染
    if (customRender) {
      console.log(`🎨 渲染自定义字段 [${fieldName}]`, { label, valueType });
      return (
        <ProForm.Item
          key={fieldName.join('.')}
          label={label}
          rules={rules}
          shouldUpdate={(prevValues, currentValues) => {
            return prevValues[fieldName[0]] !== currentValues[fieldName[0]];
          }}
        >
          {(form: any) => {
            const value = form.getFieldValue(fieldName);
            const onChange = (val: any) => {
              console.log(`字段 [${fieldName}] onChange:`, val);
              form.setFieldValue(fieldName, val);
            };
            console.log(`🎨 渲染自定义组件, 字段: [${fieldName}], 当前值:`, value);
            return (
              <>
                {customRender({
                  value,
                  onChange,
                  record: initialValues,
                  mode,
                  form,
                })}
                {/* ⭐ 隐藏字段：确保表单提交时包含这个字段的值 */}
                <ProForm.Item name={fieldName} noStyle>
                  <input type="hidden" />
                </ProForm.Item>
              </>
            );
          }}
        </ProForm.Item>
      );
    }

    // 根据 valueType 渲染不同的表单组件
    switch (valueType) {
      case 'text':
        return <ProFormText key={fieldName.join('.')} {...commonProps} />;

      case 'password':
        return <ProFormText.Password key={fieldName.join('.')} {...commonProps} />;

      case 'textarea':
        return <ProFormTextArea key={fieldName.join('.')} {...commonProps} />;

      case 'select':
        // 关联字段使用 RelationSelect 组件
        if ((field as any).isRelation && (field as any).relationConfig) {
          return (
            <ProForm.Item
              key={fieldName.join('.')}
              label={label}
              rules={rules}
              name={fieldName}
            >
              <RelationSelect
                relationConfig={(field as any).relationConfig}
                mode={mode}
              />
            </ProForm.Item>
          );
        }
        // 普通枚举选择器
        return (
          <ProFormSelect
            key={fieldName.join('.')}
            {...commonProps}
            options={field.valueEnum ? Object.entries(field.valueEnum).map(([value, config]: [string, any]) => ({
              label: config.text,
              value: isNaN(Number(value)) ? value : Number(value),
            })) : field.options}
          />
        );

      case 'radio':
        return (
          <ProFormRadio
            key={fieldName.join('.')}
            {...commonProps}
            options={field.valueEnum ? Object.entries(field.valueEnum).map(([value, config]: [string, any]) => ({
              label: config.text,
              value: isNaN(Number(value)) ? value : Number(value),
            })) : field.options}
          />
        );

      case 'checkbox':
        return (
          <ProFormCheckbox
            key={fieldName.join('.')}
            {...commonProps}
            options={field.valueEnum ? Object.entries(field.valueEnum).map(([value, config]: [string, any]) => ({
              label: config.text,
              value: isNaN(Number(value)) ? value : Number(value),
            })) : field.options}
          />
        );

      case 'date':
        return (
          <ProFormDateTimePicker
            key={fieldName.join('.')}
            {...commonProps}
            fieldProps={{
              ...fieldProps.fieldProps,
            }}
          />
        );

      case 'dateRange':
        return <ProFormDateRangePicker key={fieldName.join('.')} {...commonProps} />;

      case 'dateTime':
        return (
          <ProFormDateTimePicker
            key={fieldName.join('.')}
            {...commonProps}
            fieldProps={{
              ...fieldProps.fieldProps,
            }}
          />
        );

      case 'dateTimeRange':
        return <ProFormDateTimeRangePicker key={fieldName.join('.')} {...commonProps} />;

      case 'time':
        return <ProFormTimePicker key={fieldName.join('.')} {...commonProps} />;

      case 'money':
        return <ProFormMoney key={fieldName.join('.')} {...commonProps} fieldProps={{ precision: 2, ...fieldProps.fieldProps }} />;

      case 'digit':
        return <ProFormDigit key={fieldName.join('.')} {...commonProps} />;

      case 'switch':
        return (
          <ProFormSwitch
            key={fieldName.join('.')}
            {...commonProps}
            fieldProps={{
              ...fieldProps.fieldProps,
            }}
          />
        );

      case 'slider':
        return <ProFormSlider key={fieldName.join('.')} {...commonProps} />;

      case 'image':
        // 图片字段，如果有 renderFormItem 或 render 函数则使用自定义渲染
        const imageRender = field.renderFormItem || field.render;
        if (imageRender) {
          console.log(`🎨 渲染图片字段 [${fieldName}]`, { label });
          return (
            <ProForm.Item
              key={fieldName.join('.')}
              label={label}
              rules={rules}
              shouldUpdate={(prevValues, currentValues) => {
                return prevValues[fieldName[0]] !== currentValues[fieldName[0]];
              }}
            >
              {(form: any) => {
                const value = form.getFieldValue(fieldName);
                const onChange = (val: any) => {
                  console.log(`图片字段 [${fieldName}] onChange:`, val);
                  form.setFieldValue(fieldName, val);
                };
                console.log(`🎨 渲染图片组件, 字段: [${fieldName}], 当前值:`, value);
                return (
                  <>
                    {imageRender({
                      value,
                      onChange,
                      mode,
                      form,
                    })}
                    {/* ⭐ 隐藏字段：确保表单提交时包含这个字段的值 */}
                    <ProForm.Item name={fieldName} noStyle>
                      <input type="hidden" />
                    </ProForm.Item>
                  </>
                );
              }}
            </ProForm.Item>
          );
        }
        return (
          <ProForm.Item key={fieldName.join('.')} name={fieldName} label={label} rules={rules}>
            <div>请为图片字段配置 renderFormItem 函数</div>
          </ProForm.Item>
        );

      case 'file':
        // 文件上传组件
        return (
          <ProForm.Item key={fieldName.join('.')} name={fieldName} label={label} rules={rules}>
            {(props: any) =>
              field.renderFileUpload ? (
                field.renderFileUpload({ ...props, mode })
              ) : (
                <div>请配置 renderFileUpload 函数</div>
              )
            }
          </ProForm.Item>
        );

      case 'dependency':
        // 依赖字段
        return (
          <ProFormDependency key={fieldName.join('.')} name={field.dependencies || []}>
            {(deps, form: any) => {
              if (field.render) {
                return field.render({ ...deps, mode, form });
              }
              return null;
            }}
          </ProFormDependency>
        );

      default:
        return <ProFormText key={fieldName.join('.')} {...commonProps} />;
    }
  };

  return (
    <ProForm
      formRef={formRef}
      initialValues={initialValues}
      onFinish={async (values) => {
        console.log('📋 表单提交的值:', values);
        await onSubmit(values);
      }}
      submitter={{
        render: (_, dom) => (
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            {dom[0]}
            {dom[1]}
          </div>
        ),
        searchConfig: {
          submitText: mode === 'create' ? '创建' : '保存',
          resetText: '取消',
        },
        resetButtonProps: {
          onClick: onCancel,
        },
        submitButtonProps: {
          loading,
        },
      }}
    >
      {formFields.map((field) => renderField(field))}
    </ProForm>
  );
};

export default DynamicForm;
