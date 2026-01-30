# 通用API接口使用文档

## 前言

本文档提供统一的通用接口供前端使用：
1. **实体字段查询接口** - 动态获取实体字段信息
2. **通用CRUD批处理接口** - 统一的CRUD操作

---

## 一、实体字段查询接口

### 1. 获取实体字段信息

根据实体类名获取该实体的所有字段信息（字段名、类型、枚举值等）。

**接口地址：**
```
GET /api/entity/fields/{className}
```

**路径参数：**
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| className | String | 是 | 实体类名（支持简短类名） | WqUser |

**请求示例：**
```http
GET /api/entity/fields/WqUser
```

**响应示例：**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "openid": {
      "type": "String",
      "typeName": "java.lang.String"
    },
    "username": {
      "type": "String",
      "typeName": "java.lang.String"
    },
    "nickname": {
      "type": "String",
      "typeName": "java.lang.String"
    },
    "gender": {
      "type": "Integer",
      "typeName": "java.lang.Integer"
    },
    "avatar": {
      "type": "String",
      "typeName": "java.lang.String"
    },
    "phone": {
      "type": "String",
      "typeName": "java.lang.String"
    },
    "communityName": {
      "type": "String",
      "typeName": "java.lang.String"
    }
  },
  "timestamp": 1769583225593
}
```

**使用场景：**
- 动态生成表单
- 动态生成表格列
- 获取实体结构信息

**注意事项：**
- 使用简短类名即可（如：WqUser、CommunityActivity）
- 标记了 `@ExcludeField` 注解的字段不会返回
- 枚举类型会返回所有枚举值

---

## 二、通用CRUD批处理接口

### 接口概览

**接口地址：**
```
POST /api/batch
```

**通用参数（所有操作必填）：**
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| entity | String | 是 | 实体名称（小写，如：wquser） | wquser |
| action | String | 是 | 操作类型：create/query/update/delete | query |

---

### 1. 创建操作 (create)

创建新的实体记录。

**请求参数：**
```json
{
  "entity": "wquser",
  "action": "create",
  "data": {
    "nickname": "张三",
    "phone": "13800138000",
    "gender": 1
  }
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| entity | String | 是 | 实体名称（小写） |
| action | String | 是 | 固定值：create |
| data | Object | 是 | 要创建的数据（字段名-值对） |

**响应示例：**
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "_id": "123456",
    "nickname": "张三",
    "phone": "13800138000",
    "gender": 1
  },
  "timestamp": 1769583225593
}
```

---

### 2. 查询操作 (query)

查询实体记录，支持条件查询、分页、排序。

**请求参数（基本查询）：**
```json
{
  "entity": "wquser",
  "action": "query",
  "pageNum": 1,
  "pageSize": 10,
  "sort": {
    "createTime": "desc"
  }
}
```

**请求参数（条件查询）：**
```json
{
  "entity": "wquser",
  "action": "query",
  "conditions": {
    "nickname": "张三",
    "gender": 1
  },
  "pageNum": 1,
  "pageSize": 10,
  "sort": {
    "createTime": "desc"
  },
  "fetch": ["nickname", "phone", "avatar"]
}
```

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| entity | String | 是 | - | 实体名称（小写） |
| action | String | 是 | - | 固定值：query |
| conditions | Object | 否 | null | 查询条件（字段名-值对） |
| pageNum | Integer | 否 | null | 页码（从1开始，不传则不分页） |
| pageSize | Integer | 否 | null | 每页大小（不传则不分页） |
| sort | Object | 否 | null | 排序规则（字段名: asc/desc） |
| fetch | Array | 否 | null | 指定返回的字段列表 |

**响应示例（分页查询）：**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "_id": "123456",
      "nickname": "张三",
      "phone": "13800138000",
      "gender": 1
    },
    {
      "_id": "123457",
      "nickname": "李四",
      "phone": "13900139000",
      "gender": 0
    }
  ],
  "pageNum": 1,
  "pageSize": 10,
  "total": 100,
  "timestamp": 1769583225593
}
```

---

### 3. 更新操作 (update)

根据ID更新实体记录。

**请求参数：**
```json
{
  "entity": "wquser",
  "action": "update",
  "id": "123456",
  "data": {
    "nickname": "张三（更新）",
    "phone": "13800138001"
  }
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| entity | String | 是 | 实体名称（小写） |
| action | String | 是 | 固定值：update |
| id | String | 是 | 记录ID |
| data | Object | 是 | 要更新的数据（字段名-值对） |

**响应示例：**
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "_id": "123456",
    "nickname": "张三（更新）",
    "phone": "13800138001"
  },
  "timestamp": 1769583225593
}
```

---

### 4. 删除操作 (delete)

根据ID删除实体记录。

**请求参数：**
```json
{
  "entity": "wquser",
  "action": "delete",
  "id": "123456"
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| entity | String | 是 | 实体名称（小写） |
| action | String | 是 | 固定值：delete |
| id | String | 是 | 记录ID |

**响应示例：**
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null,
  "timestamp": 1769583225593
}
```

---

## 三、常见使用场景

### 场景1：动态表单生成

```javascript
// 1. 先获取字段信息
const response = await fetch('/api/entity/fields/WqUser');
const result = await response.json();

// 2. 根据字段类型动态生成表单
Object.entries(result.data).forEach(([fieldName, fieldInfo]) => {
  if (fieldInfo.type === 'String') {
    // 生成文本输入框
    createTextInput(fieldName, fieldInfo);
  } else if (fieldInfo.type === 'Integer') {
    // 生成数字输入框
    createNumberInput(fieldName, fieldInfo);
  } else if (fieldInfo.enumValues) {
    // 生成下拉选择框
    createSelect(fieldName, fieldInfo.enumValues);
  }
});

// 3. 提交表单创建数据
await fetch('/api/batch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    entity: 'wquser',
    action: 'create',
    data: formData
  })
});
```

### 场景2：动态表格

```javascript
// 1. 获取字段信息
const fieldResponse = await fetch('/api/entity/fields/WqUser');
const fields = await fieldResponse.json();

// 2. 生成表格列头
const columns = Object.keys(fields.data).map(fieldName => ({
  title: fieldName,
  dataIndex: fieldName,
  key: fieldName
}));

// 3. 获取数据
const dataResponse = await fetch('/api/batch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    entity: 'wquser',
    action: 'query',
    pageNum: 1,
    pageSize: 10,
    sort: { createTime: 'desc' }
  })
});
const data = await dataResponse.json();

// 4. 渲染表格
<Table columns={columns} dataSource={data.data} />
```

### 场景3：分页列表

```javascript
// 加载数据
const loadData = async (page = 1, pageSize = 10) => {
  const response = await fetch('/api/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      entity: 'wquser',
      action: 'query',
      pageNum: page,
      pageSize: pageSize,
      sort: { createTime: 'desc' }
    })
  });
  const result = await response.json();

  console.log('总记录数:', result.total);
  console.log('当前页数据:', result.data);
};
```

### 场景4：条件查询

```javascript
// 查询性别为1的用户
const searchUsers = async (nickname, gender) => {
  const conditions = {};
  if (nickname) conditions.nickname = nickname;
  if (gender !== undefined) conditions.gender = gender;

  const response = await fetch('/api/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      entity: 'wquser',
      action: 'query',
      conditions: conditions,
      pageNum: 1,
      pageSize: 10
    })
  });
  return await response.json();
};
```

### 场景5：编辑更新

```javascript
// 先查询详情，再更新
const updateUserInfo = async (userId, updateData) => {
  // 更新用户信息
  const response = await fetch('/api/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      entity: 'wquser',
      action: 'update',
      id: userId,
      data: updateData
    })
  });
  return await response.json();
};

// 使用示例
await updateUserInfo('123456', {
  nickname: '新昵称',
  phone: '13800138000'
});
```

---

## 四、错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 400 | 请求参数错误 |
| 500 | 服务器内部错误 |

**错误响应示例：**
```json
{
  "code": 400,
  "message": "entity参数不能为空",
  "data": null,
  "timestamp": 1769583225593
}
```

---

## 五、注意事项

1. **实体命名规范**：
   - `/api/batch` 接口使用**小写**实体名（如：wquser、communityactivity）
   - `/api/entity/fields` 接口使用**首字母大写**类名（如：WqUser、CommunityActivity）

2. **ID类型**：所有实体的ID都是String类型

3. **白名单接口**：本文档中的接口已加入白名单，无需认证即可访问

4. **分页参数**：pageNum 从 1 开始（不是从0开始）

5. **条件查询**：conditions 中的多个条件是 AND 关系

---

## 六、完整的请求示例（前端）

### Axios 示例

```javascript
import axios from 'axios';

const baseURL = 'http://localhost:8080';

// 1. 获取实体字段信息
const getEntityFields = async (entityName) => {
  const response = await axios.get(`${baseURL}/api/entity/fields/${entityName}`);
  return response.data;
};

// 2. 创建
const create = async (entityName, data) => {
  const response = await axios.post(`${baseURL}/api/batch`, {
    entity: entityName,
    action: 'create',
    data: data
  });
  return response.data;
};

// 3. 查询（带分页）
const query = async (entityName, conditions = null, pageNum = 1, pageSize = 10, sort = null) => {
  const payload = {
    entity: entityName,
    action: 'query',
    pageNum,
    pageSize
  };
  if (conditions) payload.conditions = conditions;
  if (sort) payload.sort = sort;

  const response = await axios.post(`${baseURL}/api/batch`, payload);
  return response.data;
};

// 4. 更新
const update = async (entityName, id, data) => {
  const response = await axios.post(`${baseURL}/api/batch`, {
    entity: entityName,
    action: 'update',
    id: id,
    data: data
  });
  return response.data;
};

// 5. 删除
const deleteById = async (entityName, id) => {
  const response = await axios.post(`${baseURL}/api/batch`, {
    entity: entityName,
    action: 'delete',
    id: id
  });
  return response.data;
};

// 使用示例
(async () => {
  // 获取WqUser的字段信息
  const fields = await getEntityFields('WqUser');
  console.log('字段信息:', fields);

  // 创建用户
  const created = await create('wquser', {
    nickname: '张三',
    phone: '13800138000',
    gender: 1
  });
  console.log('创建结果:', created);

  // 分页查询
  const users = await query('wquser', null, 1, 10, { createTime: 'desc' });
  console.log('用户列表:', users);

  // 更新用户
  const updated = await update('wquser', created.data._id, {
    nickname: '李四'
  });
  console.log('更新结果:', updated);

  // 删除用户
  await deleteById('wquser', created.data._id);
})();
```

### Fetch API 示例

```javascript
const baseURL = 'http://localhost:8080';

// 封装请求方法
const batchRequest = async (entity, action, params = {}) => {
  const payload = {
    entity,
    action,
    ...params
  };

  const response = await fetch(`${baseURL}/api/batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return await response.json();
};

// 使用示例
(async () => {
  // 查询用户
  const users = await batchRequest('wquser', 'query', {
    pageNum: 1,
    pageSize: 10,
    sort: { createTime: 'desc' }
  });
  console.log('用户列表:', users);

  // 创建用户
  const created = await batchRequest('wquser', 'create', {
    data: {
      nickname: '张三',
      phone: '13800138000'
    }
  });
  console.log('创建结果:', created);
})();
```

---

## 七、支持实体列表

当前支持的实体类（持续更新中）：

| 实体类名 | entity参数值 | 说明 |
|---------|-------------|------|
| WqUser | wquser | 用户 |
| Community | community | 社区 |
| CommunityActivity | communityactivity | 社区活动 |
| ActivityRegistration | activityregistration | 活动报名 |

---

**文档版本：** v2.0
**更新日期：** 2025-01-29
**主要更新：** 更新为 `/api/batch` 统一接口
