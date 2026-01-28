import { Card, Row, Col, Statistic, Typography } from 'antd';
import {
  ShoppingOutlined,
  FileTextOutlined,
  UserOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

export default function Dashboard() {
  return (
    <>
      <Title level={3}>数据统计</Title>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日订单"
              value={1128}
              prefix={<FileTextOutlined />}
              suffix="单"
              valueStyle={{ color: '#3f8600' }}
            />
            <div style={{ marginTop: 16, fontSize: 12, color: '#888' }}>
              日环比 <ArrowUpOutlined /> 12%
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日销售额"
              value={92800}
              prefix={<DollarOutlined />}
              suffix="元"
              precision={2}
              valueStyle={{ color: '#cf1322' }}
            />
            <div style={{ marginTop: 16, fontSize: 12, color: '#888' }}>
              日环比 <ArrowDownOutlined /> 5%
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="商品总数"
              value={3456}
              prefix={<ShoppingOutlined />}
              suffix="件"
            />
            <div style={{ marginTop: 16, fontSize: 12, color: '#888' }}>
              本月新增 128 件
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={25680}
              prefix={<UserOutlined />}
              suffix="人"
            />
            <div style={{ marginTop: 16, fontSize: 12, color: '#888' }}>
              今日新增 56 人
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="快速入口" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card
                  hoverable
                  style={{ textAlign: 'center' }}
                  bodyStyle={{ padding: 24 }}
                >
                  <ShoppingOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                  <div style={{ marginTop: 8 }}>添加商品</div>
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  hoverable
                  style={{ textAlign: 'center' }}
                  bodyStyle={{ padding: 24 }}
                >
                  <FileTextOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                  <div style={{ marginTop: 8 }}>订单管理</div>
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  hoverable
                  style={{ textAlign: 'center' }}
                  bodyStyle={{ padding: 24 }}
                >
                  <UserOutlined style={{ fontSize: 32, color: '#faad14' }} />
                  <div style={{ marginTop: 8 }}>用户管理</div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="系统公告" bordered={false}>
            <div style={{ padding: '8px 0' }}>
              • 新功能上线：优惠券模块已完成开发
            </div>
            <div style={{ padding: '8px 0' }}>
              • 系统维护通知：今晚 22:00-23:00 进行系统升级
            </div>
            <div style={{ padding: '8px 0' }}>
              • 数据统计优化：新增商品分析报表
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}
