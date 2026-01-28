import { useEmotionCss } from '@ant-design/use-emotion-css';
import { useModel } from '@umijs/max';
import { useRequest } from 'ahooks';
import React from 'react';

const Guide: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const containerStyle = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage: "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V2oS4p-2BVoAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  const { data: loading } = useRequest(
    () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    },
    {
      manual: false,
    },
  );

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div className={containerStyle}>
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: 24,
          borderRadius: 8,
          margin: 'auto',
          maxWidth: 800,
        }}
      >
        <h1>欢迎使用 {initialState?.name || 'Ant Design Pro'}</h1>
        <p>
          这是一个基于 Umi Max 的企业级中后台应用，提供了开箱即用的功能。
        </p>
        <h2>主要特性</h2>
        <ul>
          <li>📦 开箱即用，内置最佳实践</li>
          <li>🏷️ TypeScript 支持</li>
          <li>🎨 Ant Design 组件库</li>
          <li>🔥 热更新</li>
          <li>🚀 快速构建</li>
        </ul>
      </div>
    </div>
  );
};

export default Guide;
