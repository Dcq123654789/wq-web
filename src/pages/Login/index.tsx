import { useState } from 'react';
import { Form, Input, Button, Checkbox, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { login } from '@/services/auth';
import styles from './index.less';

interface LoginFormData {
  username: string;
  password: string;
  remember?: boolean;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { refresh } = useModel('@@initialState');
  const [form] = Form.useForm();

  const onFinish = async (values: LoginFormData) => {
    setLoading(true);
    try {
      // 调用登录 API
      const res = await login({
        username: values.username,
        password: values.password,
      });

      // 检查响应状态码
      if (res.code !== 200) {
        message.error(res.message || '登录失败');
        return;
      }

      const { accessToken, refreshToken, admin } = res.data;

      // 保存 token 和用户信息
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('adminInfo', JSON.stringify(admin));

      // 调试日志
      console.log('登录成功，token 已保存:', {
        accessToken: accessToken.substring(0, 30) + '...',
        refreshToken: refreshToken.substring(0, 30) + '...',
        admin,
      });

      message.success('登录成功');

      // 刷新初始状态
      await refresh();

      // 跳转到首页
      history.push('/');
    } catch (error: any) {
      message.error(error?.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <Card className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <h1>管理系统</h1>
            <p>欢迎登录后台管理系统</p>
          </div>

          <Form
            form={form}
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
