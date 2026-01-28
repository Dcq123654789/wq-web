/**
 * 环境变量工具函数
 * 用于安全地访问和使用环境变量
 */

/**
 * 获取环境变量
 * @param key 环境变量键名
 * @param defaultValue 默认值
 */
export function getEnv(
  key: keyof NodeJS.ProcessEnv,
  defaultValue: string = ''
): string {
  return process.env[key] || defaultValue;
}

/**
 * 获取布尔类型的环境变量
 * @param key 环境变量键名
 * @param defaultValue 默认值
 */
export function getBooleanEnv(
  key: keyof NodeJS.ProcessEnv,
  defaultValue: boolean = false
): boolean {
  const value = process.env[key];
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  return defaultValue;
}

/**
 * 获取数字类型的环境变量
 * @param key 环境变量键名
 * @param defaultValue 默认值
 */
export function getNumberEnv(
  key: keyof NodeJS.ProcessEnv,
  defaultValue: number = 0
): number {
  const value = process.env[key];
  const num = value ? parseInt(value, 10) : NaN;
  return isNaN(num) ? defaultValue : num;
}

/**
 * 常用环境变量快捷访问
 */
export const config = {
  // 应用信息
  appTitle: getEnv('APP_TITLE', '企业级项目'),
  appVersion: getEnv('APP_VERSION', '1.0.0'),

  // API 配置
  apiBaseUrl: getEnv('API_BASE_URL', '/api'),
  requestTimeout: getNumberEnv('REQUEST_TIMEOUT', 30000),
  uploadMaxSize: getNumberEnv('UPLOAD_MAX_SIZE', 10),

  // 功能开关
  mockEnabled: getBooleanEnv('MOCK_ENABLED', false),
  monitorEnabled: getBooleanEnv('MONITOR_ENABLED', false),
  performanceMonitorEnabled: getBooleanEnv('PERFORMANCE_MONITOR_ENABLED', false),
  debugEnabled: getBooleanEnv('DEBUG_ENABLED', false),
  showRequestLog: getBooleanEnv('SHOW_REQUEST_LOG', false),

  // 环境判断
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // CDN 配置
  cdnUrl: getEnv('CDN_URL', ''),
  publicPath: getEnv('PUBLIC_PATH', '/'),

  // Sentry 配置
  sentryDsn: getEnv('SENTRY_DSN', ''),
  sentryEnvironment: getEnv('SENTRY_ENVIRONMENT', process.env.NODE_ENV),
};

export default config;
