import { Button, Result } from 'antd';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * 错误边界组件
 * 用于捕获子组件中的 JavaScript 错误，显示友好的错误提示界面
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 可以将错误日志上报给服务器
    console.error('ErrorBoundary 捕获到错误:', error, errorInfo);

    // 保存错误信息到 state
    this.setState({
      error,
      errorInfo,
    });

    // 可以在这里添加错误上报逻辑
    // logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // 如果提供了自定义的 fallback，则使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认的错误提示界面
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
            status="error"
            title="页面出现错误"
            subTitle={
              <div>
                <p>抱歉，页面遇到了一些问题</p>
                {this.state.error && (
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#999',
                      marginTop: '8px',
                    }}
                  >
                    错误信息: {this.state.error.message}
                  </p>
                )}
              </div>
            }
            extra={[
              <Button type="primary" key="reset" onClick={this.handleReset}>
                重试
              </Button>,
              <Button key="reload" onClick={this.handleReload}>
                刷新页面
              </Button>,
              <Button
                key="home"
                onClick={() => {
                  window.location.href = '/';
                }}
              >
                返回首页
              </Button>,
            ]}
          >
            {/* 开发环境下显示详细错误信息 */}
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <div
                style={{
                  marginTop: '24px',
                  padding: '16px',
                  background: '#f5f5f5',
                  borderRadius: '4px',
                  maxHeight: '400px',
                  overflow: 'auto',
                }}
              >
                <details>
                  <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                    查看详细错误信息
                  </summary>
                  <p style={{ marginTop: '8px', fontWeight: 'bold' }}>
                    {this.state.error && this.state.error.toString()}
                  </p>
                  <pre
                    style={{
                      marginTop: '8px',
                      padding: '12px',
                      background: '#fff',
                      border: '1px solid #d9d9d9',
                      borderRadius: '4px',
                      fontSize: '12px',
                      overflow: 'auto',
                    }}
                  >
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </div>
            )}
          </Result>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
