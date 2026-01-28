# 企业级项目配置清单

> 基于 Umi Max 4.x 的企业级前端项目配置清单

## ✅ 已有配置

- [x] ESLint（代码检查）
- [x] Prettier（代码格式化）
- [x] Stylelint（样式检查）
- [x] Husky + lint-staged（提交前检查）
- [x] TypeScript（类型检查）
- [x] Ant Design + ProComponents（UI 库）
- [x] Access（权限管理）
- [x] Model（状态管理）
- [x] Request（请求封装）

---

## 🔧 待补充配置

### 🔥 高优先级（必须完成）

#### 1. 环境变量配置

- [ ] 创建 `.env` 文件（通用环境变量）
- [ ] 创建 `.env.development` 文件（开发环境）
- [ ] 创建 `.env.production` 文件（生产环境）
- [ ] 配置 API_BASE_URL、APP_TITLE 等变量

**涉及文件：**

- `.env`
- `.env.development`
- `.env.production`

---

#### 2. 开发环境 API 代理

- [ ] 在 `.umirc.ts` 中配置 `proxy`
- [ ] 配置后端 API 地址转发
- [ ] 处理跨域问题

**涉及文件：**

- `.umirc.ts`

---

#### 3. 请求/响应拦截器

- [ ] 配置请求拦截器（添加 Token）
- [ ] 配置响应拦截器（统一错误处理）
- [ ] 配置 Token 刷新机制
- [ ] 处理 401、403、500 等错误码
- [ ] 配置请求超时时间

**涉及文件：**

- `src/app.ts`

---

#### 4. 构建优化

- [ ] 配置代码分割（按路由分割）
- [ ] 配置压缩优化
- [ ] 配置 Tree Shaking
- [ ] 配置图片压缩
- [ ] 配置 CDN 路径
- [ ] 配置 publicPath

**涉及文件：**

- `.umirc.ts`

---

#### 5. CDN 配置

- [ ] 配置静态资源 CDN 路径
- [ ] 配置图片 CDN
- [ ] 配置上传脚本（可选）

**涉及文件：**

- `.umirc.ts`
- `cdn-upload.sh`（可选）

---

#### 6. 多环境配置

- [ ] 配置开发环境（development）
- [ ] 配置测试环境（test）
- [ ] 配置预发布环境（staging）
- [ ] 配置生产环境（production）

**涉及文件：**

- `.env.development`
- `.env.test`
- `.env.staging`
- `.env.production`

---

### ⭐ 中优先级（推荐完成）

#### 7. Ant Design 主题配置

- [ ] 配置主题色（@primary-color）
- [ ] 配置暗黑模式
- [ ] 配置组件主题变量
- [ ] 配置字体

**涉及文件：**

- `.umirc.ts`

---

#### 8. Commitlint 配置

- [ ] 安装 @commitlint/cli、@commitlint/config-conventional
- [ ] 创建 `.commitlintrc.js` 配置文件
- [ ] 配置 Git 提交规范
- [ ] 配置 Husky 钩子

**涉及文件：**

- `.commitlintrc.js`
- `.husky/commit-msg`

---

#### 9. EditorConfig 配置

- [ ] 创建 `.editorconfig` 文件
- [ ] 统一缩进风格
- [ ] 统一换行符
- [ ] 统一字符编码

**涉及文件：**

- `.editorconfig`

---

#### 10. Mock 数据服务

- [ ] 配置 Mock 接口
- [ ] 使用 Mock.js 或其他 Mock 工具
- [ ] 配置开发环境 Mock 开关

**涉及文件：**

- `mock/**/*.ts`

---

#### 11. CI/CD 配置

- [ ] 配置 GitHub Actions / GitLab CI
- [ ] 配置自动构建
- [ ] 配置自动部署
- [ ] 配置自动化测试

**涉及文件：**

- `.github/workflows/ci.yml` 或 `.gitlab-ci.yml`

---

#### 12. 项目文档完善

- [ ] 完善 README.md（项目介绍、快速开始、目录结构）
- [ ] 创建 CHANGELOG.md（版本记录）
- [ ] 创建 CONTRIBUTING.md（贡献指南）
- [ ] 创建 API.md（接口文档）

**涉及文件：**

- `README.md`
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- `API.md`

---

### 💡 低优先级（可选完成）

#### 13. Docker 配置

- [ ] 创建 Dockerfile
- [ ] 创建 docker-compose.yml
- [ ] 配置 Nginx 反向代理

**涉及文件：**

- `Dockerfile`
- `docker-compose.yml`
- `nginx.conf`

---

#### 14. 性能监控

- [ ] 接入 Sentry（错误监控）
- [ ] 配置 Web Vitals（性能指标）
- [ ] 配置用户行为追踪

**涉及文件：**

- `src/app.ts`
- `src/monitoring/index.ts`

---

#### 15. 单元测试

- [ ] 配置 Jest
- [ ] 配置 @testing-library/react
- [ ] 编写组件测试用例
- [ ] 配置测试覆盖率

**涉及文件：**

- `jest.config.js`
- `src/**/*.test.tsx`

---

## 📊 配置进度统计

- **总任务数：** 15 项
- **高优先级：** 6 项（必须）
- **中优先级：** 6 项（推荐）
- **低优先级：** 3 项（可选）

## 🎯 建议实施顺序

1. 第一批（基础配置）：1-3
2. 第二批（构建部署）：4-6
3. 第三批（规范文档）：7-9
4. 第四批（工程化）：10-12
5. 第五批（优化增强）：13-15

---

**最后更新时间：** 2026-01-28
