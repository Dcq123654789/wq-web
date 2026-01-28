import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

export default function Home() {
  return (
    <PageContainer>
      <Card>
        <h1>首页</h1>
        <p>路由路径: /home</p>
        <p>文件路径: src/pages/home/index.tsx</p>
      </Card>
    </PageContainer>
  );
}
