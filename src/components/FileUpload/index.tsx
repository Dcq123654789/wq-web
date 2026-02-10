import React from 'react';
import { Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { UploadRequestError } from 'antd/es/upload/interface';
import { request } from '@umijs/max';

export interface FileUploadProps {
  /** 当前值（单文件为字符串，多文件为数组） */
  value?: string | string[];
  /** 值变化回调 */
  onChange?: (value: string | string[]) => void;
  /** 上传接口地址 */
  action?: string;
  /** 上传类型：image-图片, file-文件 */
  uploadType?: 'image' | 'file';
  /** 最大上传数量，默认1（单文件） */
  maxCount?: number;
  /** 文件类型限制，如：['image/jpeg', 'image/png'] */
  accept?: string;
  /** 文件大小限制（MB），默认10 */
  maxSize?: number;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 额外的请求数据 */
  data?: Record<string, any>;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 通用文件/图片上传组件
 *
 * 功能特性：
 * - 支持单文件/多文件上传
 * - 支持图片和文件上传模式
 * - 支持文件类型和大小限制
 * - 支持自定义上传接口
 *
 * @example
 * // 单张图片上传
 * <FileUpload value={avatar} onChange={setAvatar} uploadType="image" maxCount={1} />
 *
 * // 多张图片上传
 * <FileUpload value={images} onChange={setImages} uploadType="image" maxCount={5} />
 *
 * // 文件上传
 * <FileUpload value={file} onChange={setFile} uploadType="file" accept=".pdf,.doc,.docx" />
 */
const FileUpload: React.FC<FileUploadProps> = ({
  value,
  onChange,
  action = '/api/upload',
  uploadType = 'image',
  maxCount = 1,
  accept,
  maxSize = 10,
  headers,
  data,
  disabled = false,
}) => {
  // 判断是否为多文件模式
  const isMultiple = maxCount > 1;

  // 自动添加 Token 认证头
  const uploadHeaders = React.useMemo(() => {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, [headers]);

  // 将 value 转换为 fileList 格式
  const fileList: UploadFile[] = React.useMemo(() => {

    if (!value) return [];

    // 多文件模式
    if (isMultiple && Array.isArray(value)) {
      const list = value.map((url, index) => ({
        uid: `-${index}`,
        name: uploadType === 'image' ? `image-${index + 1}.png` : `file-${index + 1}`,
        status: 'done' as const,
        url,
      }));
      return list;
    }

    // 单文件模式
    if (typeof value === 'string') {
      const list = [
        {
          uid: '-1',
          name: uploadType === 'image' ? 'image.png' : 'file',
          status: 'done' as const,
          url: value,
        },
      ];
      return list;
    }

    return [];
  }, [value, isMultiple, uploadType]);

  // 处理文件上传前校验
  const beforeUpload = (file: File) => {
    // 文件大小校验
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLtMaxSize) {
      message.error(`文件大小不能超过 ${maxSize}MB`);
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  // 处理文件变化
  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    const { file, fileList } = info;


    if (file.status === 'done') {
      const response = file.response as any;

      // 🔍 详细调试：检查响应结构

      // 尝试多种可能的 URL 路径
      let fileUrl = response?.url || response?.data?.url || response?.data?.fileName;

      // ⚠️ 不删除空格！URL 中的空格会被浏览器自动编码为 %20%20

      if (fileUrl) {

        // ⭐ 关键修复：更新 file 对象的 url 属性，这样 fileList 会立即显示图片
        file.url = fileUrl;

        // 多文件模式：添加新URL到数组
        if (isMultiple) {
          const currentUrls = Array.isArray(value) ? value : [];
          const newUrls = [...currentUrls, fileUrl];
          onChange?.(newUrls);
        } else {
          // 单文件模式：直接设置URL
          onChange?.(fileUrl);
        }
        message.success('上传成功');
      } else {
        message.error('上传失败：未返回文件URL');
      }
    } else if (file.status === 'error') {
      message.error('上传失败');
    } else if (file.status === 'uploading') {
    }

    // ⭐ 重要：返回更新后的 fileList，确保 Upload 组件状态正确
    return info.fileList;
  };

  // 处理文件移除
  const handleRemove: UploadProps['onRemove'] = (file) => {
    const { url } = file;

    if (isMultiple && Array.isArray(value)) {
      // 多文件模式：从数组中移除
      const newUrls = value.filter((item) => item !== url);
      onChange?.(newUrls);
    } else {
      // 单文件模式：清空值
      onChange?.(isMultiple ? [] : '');
    }

    return true;
  };

  // ⭐ 自定义上传函数
  const customRequest: UploadProps['customRequest'] = async (options) => {
    const { file, onProgress, onSuccess, onError } = options;

    const formData = new FormData();
    formData.append('file', file);

    // 如果有额外数据，添加到 formData
    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
    }

    try {
      // 使用 umi 的 request 方法上传
      const response = await request<{
        code: number;
        message: string;
        data: {
          fileName?: string;
          size?: number;
          url?: string;
        };
      }>(action, {
        method: 'POST',
        data: formData,
        // 不设置 Content-Type，让浏览器自动设置 multipart/form-data
        requestType: 'form',
        headers: uploadHeaders as any,
        // 上传进度回调
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress({ percent }, file);
          }
        },
      });


      // 检查响应格式
      let fileUrl = response?.url || response?.data?.url;

      // ⚠️ 不删除空格！保留原始 URL

      if (fileUrl) {

        // ⭐ 验证图片是否可以访问
        const img = new Image();
        img.onload = () => {
          // 图片可以访问，调用成功回调
          onSuccess(
            {
              ...response,
              url: fileUrl,
            },
            file as File,
          );

          // 立即调用 onChange 更新值
          if (isMultiple) {
            const currentUrls = Array.isArray(value) ? value : [];
            const newUrls = [...currentUrls, fileUrl];
            onChange?.(newUrls);
          } else {
            onChange?.(fileUrl);
          }

          message.success('上传成功');
        };

        img.onerror = () => {
          message.error('上传失败：文件无法访问，请检查后端上传逻辑');
          onError(new Error('文件上传到服务器失败') as UploadRequestError);
        };

        // 开始验证（设置超时）
        img.src = fileUrl;
        setTimeout(() => {
          if (!img.complete) {
            message.error('上传超时：文件无法访问');
            onError(new Error('文件验证超时') as UploadRequestError);
          }
        }, 10000); // 10秒超时
      } else {
        onError(new Error('上传失败：未返回文件URL') as UploadRequestError);
      }
    } catch (error: any) {
      onError(error);
    }
  };

  // 上传按钮
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>
        {uploadType === 'image' ? '上传图片' : '上传文件'}
      </div>
    </div>
  );

  // 根据上传类型设置默认 accept
  const defaultAccept =
    uploadType === 'image'
      ? 'image/png,image/jpeg,image/jpg,image/gif,image/webp'
      : undefined;

  return (
    <Upload
      listType={uploadType === 'image' ? 'picture-card' : 'text'}
      fileList={fileList}
      onChange={handleChange}
      onRemove={handleRemove}
      beforeUpload={beforeUpload}
      customRequest={customRequest}
      maxCount={maxCount}
      accept={accept || defaultAccept}
      disabled={disabled}
      multiple={isMultiple}
      onPreview={(file) => {
        // 图片预览
        if (uploadType === 'image' && file.url) {
          // 检查图片是否能加载
          const img = new Image();
          img.onload = () => {
            window.open(file.url, '_blank');
          };
          img.onerror = () => {
            message.error('图片加载失败，文件可能未正确上传到服务器');
          };
          img.src = file.url;
        }
      }}
    >
      {fileList.length >= maxCount ? null : uploadButton}
    </Upload>
  );
};

export default FileUpload;
