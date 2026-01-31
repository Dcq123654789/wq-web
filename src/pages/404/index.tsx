import { Button, Result } from 'antd';
import { history } from '@umijs/max';
import styles from './index.module.less';

const NotFound: React.FC = () => {
  const goBack = () => {
    history.back();
  };

  const goHome = () => {
    history.push('/dashboard');
  };

  return (
    <div className={styles.container}>
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在"
        extra={
          <div className={styles.buttons}>
            <Button type="default" onClick={goBack}>
              返回上一页
            </Button>
            <Button type="primary" onClick={goHome}>
              回到首页
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default NotFound;
