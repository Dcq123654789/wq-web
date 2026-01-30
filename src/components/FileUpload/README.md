# FileUpload 通用文件上传组件

一个支持单/多文件、图片/文件上传的通用组件。

## 功能特性

- 支持单文件或多文件上传
- 支持图片和文件两种上传模式
- 支持文件类型和大小限制
- 支持自定义上传接口
- 图片模式使用卡片展示，文件模式使用列表展示

## 基础用法

### 1. 单张图片上传

```tsx
import FileUpload from '@/components/FileUpload';

// 在 GenericCrud 的 fieldOverrides 中使用
fieldOverrides: {
  avatar: {
    valueType: 'image',
    render: (props: any) => (
      <FileUpload {...props} uploadType="image" maxCount={1} />
    ),
  },
}
```

### 2. 多张图片上传

```tsx
fieldOverrides: {
  images: {
    valueType: 'image',
    render: (props: any) => (
      <FileUpload
        {...props}
        uploadType="image"
        maxCount={5}  // 最多上传5张
      />
    ),
  },
}
```

### 3. 文件上传（PDF、Word等）

```tsx
fieldOverrides: {
  document: {
    valueType: 'file',
    render: (props: any) => (
      <FileUpload
        {...props}
        uploadType="file"
        accept=".pdf,.doc,.docx"
        maxCount={1}
      />
    ),
  },
}
```

### 4. 多文件上传

```tsx
fieldOverrides: {
  attachments: {
    valueType: 'file',
    render: (props: any) => (
      <FileUpload
        {...props}
        uploadType="file"
        maxCount={10}
        maxSize={20}  // 限制单个文件20MB
      />
    ),
  },
}
```

## API 参数

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| value | 当前值（单文件为字符串，多文件为数组） | `string \| string[]` | - |
| onChange | 值变化回调 | `(value: string \| string[]) => void` | - |
| action | 上传接口地址 | `string` | `'/api/upload'` |
| uploadType | 上传类型 | `'image' \| 'file'` | `'image'` |
| maxCount | 最大上传数量 | `number` | `1` |
| accept | 文件类型限制 | `string` | 图片类型 |
| maxSize | 文件大小限制（MB） | `number` | `10` |
| headers | 请求头 | `Record<string, string>` | - |
| data | 额外的请求数据 | `Record<string, any>` | - |
| disabled | 是否禁用 | `boolean` | `false` |

## 常用配置示例

### 限制文件大小为 5MB

```tsx
<FileUpload {...props} maxSize={5} />
```

### 指定上传接口

```tsx
<FileUpload
  {...props}
  action="/api/custom/upload"
  headers={{
    Authorization: `Bearer ${token}`,
  }}
/>
```

### 仅允许上传特定图片格式

```tsx
<FileUpload
  {...props}
  accept="image/jpeg,image/png"
/>
```

### 多文件上传时传递额外参数

```tsx
<FileUpload
  {...props}
  uploadType="file"
  maxCount={5}
  data={{
    entityType: 'product',
    entityId: '123',
  }}
/>
```

## 数据格式

### 单文件模式（maxCount = 1）

- **值类型**: `string`
- **存储格式**: `"https://example.com/image.jpg"`

### 多文件模式（maxCount > 1）

- **值类型**: `string[]`
- **存储格式**: `["https://example.com/image1.jpg", "https://example.com/image2.jpg"]`

## 服务器响应格式

上传接口应返回以下格式之一：

```json
{
  "url": "https://example.com/uploaded/file.jpg"
}
```

或

```json
{
  "data": {
    "url": "https://example.com/uploaded/file.jpg"
  }
}
```
