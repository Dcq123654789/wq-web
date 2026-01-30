import { Button, Result } from 'antd';
import React from 'react';
import { useNavigate } from 'umi';

interface GlobalErrorProps {
  title?: string;
  subTitle?: string;
  onReset?: () => void;
}

/**
 * 全局错误提示页面组件
 * 用于显示各种错误状态（404、500等）
 */
const GlobalError: React.FC<GlobalErrorProps> = ({
  title = '页面加载失败',
  subTitle = '抱歉，页面加载时遇到了问题',
  onReset,
}) => {
  const navigate = useNavigate();

  const handleReset = (): void => {
    if (onReset) {
      onReset();
    } else {
      navigate(-1);
    }
  };

  const handleReload = (): void => {
    window.location.reload();
  };

  const handleGoHome = (): void => {
    navigate('/');
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f2f5',
      }}
    >
      <Result
        status="warning"
        title={title}
        subTitle={subTitle}
        extra={[
          <Button type="primary" key="reset" onClick={handleReset}>
            返回上页
          </Button>,
          <Button key="reload" onClick={handleReload}>
            刷新页面
          </Button>,
          <Button key="home" onClick={handleGoHome}>
            返回首页
          </Button>,
        ]}
      />
    </div>
  );
};

export default GlobalError;
