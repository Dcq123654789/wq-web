/**
 * 环境变量类型定义
 */
declare namespace NodeJS {
  interface ProcessEnv {
    // 应用信息
    readonly APP_TITLE: string;
    readonly APP_VERSION?: string;
    readonly APP_DESCRIPTION?: string;

    // 环境标识
    readonly NODE_ENV: 'development' | 'production' | 'test';

    // API 配置
    readonly API_BASE_URL: string;
    readonly REQUEST_TIMEOUT: string;
    readonly UPLOAD_MAX_SIZE?: string;

    // 功能开关
    readonly MOCK_ENABLED: string;
    readonly MONITOR_ENABLED: string;
    readonly PERFORMANCE_MONITOR_ENABLED?: string;
    readonly DEBUG_ENABLED?: string;
    readonly SHOW_REQUEST_LOG?: string;

    // 构建配置
    readonly PORT?: string;
    readonly SOURCE_MAP?: string;
    readonly GZIP_ENABLED?: string;
    readonly MINIFY_ENABLED?: string;
    readonly TREE_SHAKING_ENABLED?: string;

    // CDN 配置
    readonly CDN_URL?: string;
    readonly PUBLIC_PATH?: string;

    // 监控配置
    readonly SENTRY_DSN?: string;
    readonly SENTRY_ENVIRONMENT?: string;
  }
}

/**
 * 获取环境变量的辅助函数
 */
export function getEnv(key: keyof NodeJS.ProcessEnv): string {
  return process.env[key] || '';
}

/**
 * 获取布尔类型的环境变量
 */
export function getBooleanEnv(key: keyof NodeJS.ProcessEnv): boolean {
  const value = process.env[key];
  return value === 'true' || value === '1';
}

/**
 * 获取数字类型的环境变量
 */
export function getNumberEnv(key: keyof NodeJS.ProcessEnv): number {
  const value = process.env[key];
  return value ? parseInt(value, 10) : 0;
}

export {};
