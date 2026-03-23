# Cloudflare DNS & SaaS Manager

一个轻量级、边缘原生的 Cloudflare 管理面板。完全运行在 Cloudflare Pages 和 Functions 之上，用于高效管理 DNS 记录与 SSL for SaaS (自定义主机名)。

[![Cloudflare](https://img.shields.io/badge/Powered%20By-Cloudflare-F38020?logo=cloudflare)](https://pages.cloudflare.com/)

---

## ✨ 核心特性

- 🚀 **边缘渲染**：基于 Cloudflare Pages Functions，全球极速响应
- 🌐 **全能 DNS**：完整的 DNS 记录增删改查，支持批量操作
- 🔒 **SSL for SaaS**：轻松管理自定义主机名 (Custom Horunstnames) 与回退源 (Fallback Origin)
- 📁 **导入导出**：支持 DNS 记录的备份与快速迁移
- 👥 **多账户支持**：支持配置多个 Cloudflare API Token，一键切换
- 🔐 **三种登录方式**： 
  - **GitHub OAuth**：一键 GitHub 授权登录
  - **密码登录**：管理员密码 + 后端托管 Token
  - **本地模式**：前端直接输入 API Token，不存储凭证

---

## 界面截图

![DNS 页](img/dns.png)

![SaaS 页](img/saas.png)

---

## 📋 快速部署

### 1. 准备工作

- Fork 本仓库
- 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
- 准备一个 [Cloudflare API Token](https://dash.cloudflare.com/profile/api-tokens)（需 `区域:DNS:Edit` 和 `区域:SSL和证书:Edit` 权限）

### 2. 在 Cloudflare Pages 部署

1. 进入 **Workers 和 Pages** 控制台 → **创建应用** → **`Pages 应用`** → **连接到 Git**
2. 选择你的 Fork 仓库
3. 构建设置：
   - 框架预设：`Vite`
   - 构建命令：`npm run build`
   - 输出目录：`dist`
4. 点击 **保存并部署**

### 3. 托管模式下配置环境变量

在 Pages 项目 → **设置** → **环境变量** 中添加：

#### 必填项

| 变量名         | 描述                                                               |
| :------------- | :----------------------------------------------------------------- |
| `CF_API_TOKEN` | Cloudflare API 令牌 (需 区域:DNS:Edit 和 区域:SSL和证书:Edit 权限) |

#### 登录方式（至少配置一种）

- **GitHub OAuth** (推荐)

| 变量名                 | 描述                              |
| :--------------------- | :-------------------------------- |
| `GITHUB_CLIENT_ID`     | GitHub OAuth App 的 Client ID     |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App 的 Client Secret |
| `ALLOWED_GITHUB_USER`  | 你的 GitHub 用户名                |


- **密码登录** (可选)

| 变量名         | 描述                               |
| :------------- | :--------------------------------- |
| `APP_PASSWORD` | 管理面板登录密码（请使用复杂密码） |

> **注意**：配置了机密变量后，需要重新部署才能生效。（pages项目-部署-所有部署-重试部署）

#### 多账户（可选）

| 变量名                 | 描述                           |
| :--------------------- | :----------------------------- |
| `CF_API_TOKEN1`        | 备用账户 1 的令牌              |
| `CF_API_TOKEN2`        | 备用账户 2 的令牌              |
| `...`                  | 以此类推                       |
| `ALLOWED_GITHUB_USER1` | 允许登录的备用 GitHub 用户名 1 |
| `ALLOWED_GITHUB_USER2` | 允许登录的备用 GitHub 用户名 2 |
| `...`                  | 以此类推                       |

### 4. 配置 GitHub OAuth（使用 GitHub 登录时需要）

1. 前往 [GitHub Developer Settings](https://github.com/settings/developers) → **New OAuth App**
2. **Homepage URL**：`https://你的域名`
3. **Authorization callback URL**：`https://你的域名/api/auth/github/callback`
4. 将 Client ID 和 Client Secret 填入 Pages 环境变量

---

## 🏗️ 项目架构

```
├── src/                      # 前端 (React 18 + Vite)
│   ├── App.jsx               # 主应用 (Login / ZoneDetail / App)
│   ├── index.css             # 全局样式
│   └── mobile.css            # 移动端适配
├── functions/api/            # 后端 (Cloudflare Pages Functions)
│   ├── _middleware.js         # 认证中间件 (JWT/Token 校验)
│   ├── login.js              # 密码登录 API
│   ├── verify-token.js       # Token 校验 API
│   ├── accounts.js           # 多账户列表 API
│   ├── auth/                 # GitHub OAuth 流程
│   │   ├── config.js         # 登录配置查询
│   │   ├── github.js         # OAuth 重定向
│   │   └── github/callback.js # OAuth 回调
│   └── zones/                # Cloudflare API 代理
│       ├── index.js          # 域名列表
│       └── [zoneId]/         # 域名级操作
│           ├── dns_records.js     # DNS 记录
│           ├── dns_batch.js       # 批量删除
│           ├── dns_export.js      # 导出
│           ├── dns_import.js      # 导入
│           ├── custom_hostnames.js # 自定义主机名
│           └── fallback_origin.js  # 回退源
```

**技术栈**：React 18 · Vite · Lucide Icons · jose (JWT) · Cloudflare Pages Functions

---

## 🛠️ 本地开发

1. **安装依赖**：
   ```bash
   npm install
   ```

2. **启动开发环境**：
   ```bash
   # 终端 1：启动 Vite 前端热更新
   npm run dev

   # 终端 2：启动 Wrangler 代理绑定后端
   npm run dev:wrangler -- --binding APP_PASSWORD="your_password" --binding CF_API_TOKEN="your_token"
   ```

3. **访问地址**：`http://localhost:8788`

---

## 📜 许可证

本项目采用 [MIT License](./LICENSE) 开源。

## ⚠️ 免责声明

1. 本项目仅供学习和个人管理之用，请勿用于非法用途。
2. 请妥善保管您的 `APP_PASSWORD` 和 `CF_API_TOKEN`，由泄露导致的安全问题由使用者自行承担。
3. 建议开启 [Cloudflare Access](https://www.cloudflare.com/zero-trust/products/access/) 进行二次防护。

---

*Created with ❤️ by [sushen339](https://github.com/sushen339) | Powered by [antigravity](https://antigravity.google)*
