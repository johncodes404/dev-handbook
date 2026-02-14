# LogicLoom (原 dev-handbook)

> **核心理念**：只专注写作，其余自动化完成。
> 
> 更新时间：2026-02-14  
> 目标：极简主义个人博客，基于 VitePress，实现“零配置”文章管理。

## 1. 项目定位

`dev-handbook` 是一个基于 VitePress 的自动化个人博客系统。

- 内容源：`docs/` 下的 Markdown 文件
- 本地预览：`npm run docs:dev`
- 生产构建：`npm run docs:build`
- 自动发布：推送到 `main` 分支后由 GitHub Actions 部署到 GitHub Pages
- 线上地址：`https://johncodes404.github.io/dev-handbook/`

## 2. 技术栈与关键约束

- Node.js：`>=20 <23`（建议用 Node 20 LTS）
- 包管理：npm（使用 `package-lock.json`）
- 文档框架：VitePress `1.6.4`
- 组件依赖：Vue `3.5.28`
- 部署：GitHub Pages + GitHub Actions

关键约束：

- 仓库名是 `dev-handbook`，因此 `docs/.vitepress/config.ts` 中必须是 `base: '/dev-handbook/'`
- `package.json` 必须保留 `"type": "module"`，否则可能出现 ESM 加载报错
- CI 使用 `npm ci`，依赖版本由 `package-lock.json` 锁定

## 3. 目录结构（当前）

```text
dev-handbook/
├─ .github/
│  └─ workflows/
│     └─ deploy.yml                 # 自动构建+发布工作流
├─ docs/
│  ├─ .vitepress/
│  │  └─ config.ts                  # 站点配置（含基础信息/导航栏）
│  ├─ tech-tutorials/               # 技术教程文章目录
│  ├─ thinking/                     # 思考随笔文章目录
│  ├─ index.md                      # 首页（自动加载文章列表）
│  ├─ posts.data.ts                 # [核心] 自动化脚本：扫描并提取文章信息
│  └─ public/                       # 静态资源（图片等）
├─ REQUIREMENTS.md                  # 项目需求文档
├─ package.json
└─ README.md                        # 本文档
```

## 4. 构建与发布链路（工作原理）

完整链路：

1. 你在 `docs/` 下写 Markdown。
2. 本地用 `npm run docs:dev` 预览。
3. 提交并推送到 `main`。
4. GitHub Actions 触发 `.github/workflows/deploy.yml`。
5. `build` job 执行 `npm ci` + `npm run docs:build`，产物在 `docs/.vitepress/dist`。
6. `deploy` job 把产物发布到 GitHub Pages。
7. 网站自动更新。

工作流触发条件：

- 自动触发：`push` 到 `main`
- 手动触发：`workflow_dispatch`

## 5. 首次接手（从 0 到可运行）

### 5.1 环境准备

- 安装 Git
- 安装 Node.js 20 LTS
- 确认 npm 可用

检查命令：

```powershell
git --version
node -v
npm -v
```

### 5.2 克隆与安装

```powershell
git clone https://github.com/johncodes404/dev-handbook.git
cd dev-handbook
npm ci
```

### 5.3 本地运行与构建验证

开发预览：

```powershell
npm run docs:dev
```

生产构建：

```powershell
npm run docs:build
```

本地预览构建结果：

```powershell
npm run docs:preview
```

如果 `docs:build` 成功，说明本地环境基本可用。

## 6. 日常写作与发布流程

### 6.1 新增文章

示例：新增教程文章

1. 创建文件：`docs/tech-tutorials/your-topic.md`
2. 写 Markdown 内容
3. 视需要在 `docs/.vitepress/config.ts` 的 sidebar 中补充入口

### 6.2 本地预览

```powershell
npm run docs:dev
```

### 6.3 提交并自动发布

```powershell
git add .
git commit -m "docs: add your-topic tutorial"
git push
```

推送后自动部署，无需手动上传服务器。

## 7. 关键配置说明

## 7.1 `package.json`

核心脚本：

- `docs:dev`：本地开发
- `docs:build`：生产构建
- `docs:preview`：预览构建产物

关键字段：

- `"engines": { "node": ">=20 <23" }`
- `"type": "module"`

## 7.2 `docs/.vitepress/config.ts`

高风险配置：

- `base: '/dev-handbook/'`  
  如果仓库名变更，这里必须同步修改，否则线上静态资源路径会错。

常改配置：

- `title` / `description`
- `themeConfig.nav`
- `themeConfig.sidebar`

## 7.3 `.github/workflows/deploy.yml`

核心点：

- Node 版本固定为 20
- 依赖安装用 `npm ci`
- 构建命令 `npm run docs:build`
- 发布目录 `docs/.vitepress/dist`
- 权限包含 `pages: write` 和 `id-token: write`

## 8. GitHub Pages 一次性检查项

仓库设置里确认：

1. `Settings` -> `Pages`
2. `Build and deployment` -> `Source` 选择 `GitHub Actions`
3. 仓库可见性为 `Public`

## 9. 常见问题与处理

### 9.1 线上 404 或样式丢失

排查顺序：

1. 检查 `docs/.vitepress/config.ts` 的 `base` 是否为 `/dev-handbook/`
2. 确认访问地址是 `https://johncodes404.github.io/dev-handbook/`
3. 查看 Actions 最近一次部署是否成功

### 9.2 Actions 部署报 `Failed to create deployment (404)`

通常是 Pages 未启用或非 `GitHub Actions` 模式。  
去 `Settings -> Pages` 按第 8 节重新设置。

### 9.3 本地构建报 ESM 相关错误

检查：

1. `package.json` 是否有 `"type": "module"`
2. Node 是否在 `>=20 <23`
3. 依赖是否通过 `npm ci` 正常安装

### 9.4 推送时报 workflow 权限不足

如果使用 HTTPS token 推送，token 需要包含 `workflow` scope。  
可用 `gh auth refresh -h github.com -s workflow` 重新授权。

## 10. 稳定运行建议（低维护成本）

1. 不要删除 `package-lock.json`，始终使用 `npm ci`
2. CI 维持 Node 20，不要频繁变更大版本
3. 每月一次小步升级依赖（可选）
4. 对 `main` 分支启用保护（可选）
5. 修改导航或目录后先本地 `docs:build` 再 push

## 11. 接手人快速验收清单

接手当天按以下清单确认：

1. `npm ci` 成功
2. `npm run docs:build` 成功
3. 新建一篇测试文章并本地预览成功
4. push 后 Actions 的 `build`、`deploy` 全绿
5. 线上地址可访问并看到新文章

通过以上 5 项，即可认为交接完成。
