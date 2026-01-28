import { Request, Response } from 'express';

// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    status: 1,
    createdAt: '2023-01-01 12:00:00',
    updatedAt: '2023-01-01 12:00:00',
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    status: 1,
    createdAt: '2023-01-02 12:00:00',
    updatedAt: '2023-01-02 12:00:00',
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    phone: '13800138003',
    status: 0,
    createdAt: '2023-01-03 12:00:00',
    updatedAt: '2023-01-03 12:00:00',
  },
];

export default {
  // 获取用户列表
  'GET /api/user/list': (req: Request, res: Response) => {
    const { current = 1, pageSize = 10 } = req.query;
    const start = ((current as number) - 1) * (pageSize as number);
    const end = start + (pageSize as number);
    const data = mockUsers.slice(start, end);

    res.json({
      data,
      total: mockUsers.length,
      success: true,
    });
  },

  // 创建用户
  'POST /api/user/create': (req: Request, res: Response) => {
    const newUser = {
      id: mockUsers.length + 1,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);

    res.json({
      data: newUser,
      success: true,
    });
  },

  // 更新用户
  'PUT /api/user/update': (req: Request, res: Response) => {
    const { id } = req.body;
    const index = mockUsers.findIndex((user) => user.id === id);

    if (index !== -1) {
      mockUsers[index] = {
        ...mockUsers[index],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };

      res.json({
        data: mockUsers[index],
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }
  },

  // 删除用户
  'DELETE /api/user/delete': (req: Request, res: Response) => {
    const { id } = req.query;

    if (Array.isArray(id)) {
      // 批量删除
      id.forEach((itemId) => {
        const index = mockUsers.findIndex((user) => user.id === itemId);
        if (index !== -1) {
          mockUsers.splice(index, 1);
        }
      });
    } else {
      // 单个删除
      const index = mockUsers.findIndex((user) => user.id === Number(id));
      if (index !== -1) {
        mockUsers.splice(index, 1);
      }
    }

    res.json({
      success: true,
    });
  },
};
