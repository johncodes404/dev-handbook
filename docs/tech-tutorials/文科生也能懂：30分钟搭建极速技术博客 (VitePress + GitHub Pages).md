# 【保姆级教程】文科生也能懂：30分钟搭建极速技术博客 (VitePress + GitHub Pages)

## 1. 背景/前言 (Introduction)

作为一名文科背景的研究生，我们往往需要一个干净、纯粹的空间来整理“深度思考”和“技术笔记”。市面上的博客框架（如 Hexo, WordPress）要么配置太繁琐，要么广告满天飞；而专业的 React/Vue 项目又太过于“硬核”，维护成本极高。

**我们需要的是：** 一个只关注写作（Markdown），不需要写代码，且能自动发布到独立域名的工具。

**VitePress** 就是这个终极答案。它是 Vue 团队推出的静态站点生成器，主打“极速”和“极简”。配合 **GitHub Pages** 和 **GitHub Actions**，我们可以实现“写完即发布”的自动化工作流。

本文将手把手教你从零开始，避开复杂的代码坑，搭建一个属于你的现代化技术文档站。

## 2. 核心步骤 (Step-by-Step Guide)

### 第一步：在 GitHub 创建“基地”
不要混用之前的仓库，我们需要一个全新的开始。
1. 登录 GitHub，点击右上角 `+` -> **New repository**。
2. **Repository name**: 填写 `tech-notes` (或者 `dev-handbook`)。
3. **Public/Private**: 选择 **Public**。
4. **关键点**：勾选 **Add a README file**。
5. **关键点**：在 **.gitignore** 下拉菜单中，搜索并选择 **Node** (这能防止上传垃圾文件)。
6. 点击 **Create repository**。

### 第二步：本地环境初始化
打开你的 VS Code，克隆刚才创建的仓库，然后打开终端（Terminal），依次执行以下命令：

```bash
# 1. 初始化项目身份证 (生成 package.json)
npm init -y

# 2. 安装 VitePress 核心引擎 (作为开发依赖)
npm add -D vitepress vue

# 3. 启动自动配置向导 (魔法开始的地方)
npx vitepress init
```

**配置向导问答作业：**
*   `Where should VitePress initialize the config?` -> **回车** (默认当前目录)
*   `Site title` -> 输入你的博客名称，如 **Jayden's Tech Notes**
*   `Site description` -> 输入简介
*   `Theme` -> 选择 **Default Theme**
*   `Use TypeScript?` -> 选择 **Yes** (推荐)
*   `Add VitePress npm scripts to package.json?` -> **Yes** (关键)

### 第三步：目录结构优化 (为了长治久安)
默认生成的文件都在根目录，为了后续管理方便，建议将文档归档到 `docs` 文件夹。

1. 在根目录新建文件夹 `docs`。
2. 将 `.vitepress` 文件夹、`index.md`、`api-examples.md` 等文件全部拖入 `docs` 文件夹。
3. **修改配置文件**：打开根目录下的 `package.json`，找到 `"scripts"` 部分，修改为以下内容（告诉 VitePress 去 `docs` 目录找文件）：

```json
"scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
},
```

### 第四步：配置自动化发布 (GitHub Actions)
这是最核心的一步。我们要告诉 GitHub：“每次我推送代码，你就自动帮我构建网站并发布”。

1. 在项目根目录新建文件夹 `.github`。
2. 在 `.github` 内新建文件夹 `workflows`。
3. 在 `workflows` 内新建文件 `deploy.yml`。
4. 复制以下代码填入 `deploy.yml`：

```yaml
# .github/workflows/deploy.yml
name: Deploy VitePress site to Pages

on:
  push:
    branches: [ main ] # 确保你的主分支名是 main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Install dependencies
        run: npm ci
      - name: Build with VitePress
        run: npm run docs:build # 调用我们在 package.json 改好的命令
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist # 构建产物的输出路径

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 第五步：推送与开启 Pages
1. 在终端提交代码：
   ```bash
   git add .
   git commit -m "init: create tech notes with vitepress"
   git push
   ```
2. 回到 GitHub 网页端，进入仓库 **Settings** -> **Pages**。
3. 在 **Build and deployment** 下的 **Source**，选择 **GitHub Actions**。

## 3. 避坑指南/常见报错 (Troubleshooting)

在搭建过程中，这三个坑最容易劝退新手：

**坑一：构建失败，提示找不到文件**
*   **报错现象**：GitHub Actions 里的 `Build with VitePress` 步骤报错。
*   **原因**：通常是因为你移动了文件到 `docs` 目录，但忘记修改 `package.json` 里的脚本，或者 `deploy.yml` 里的 `path` 路径不对。
*   **解法**：检查 `package.json` 里是否是 `"vitepress build docs"`，以及 `deploy.yml` 里是否是 `path: docs/.vitepress/dist`。

**坑二：Node 版本不兼容**
*   **报错现象**：本地运行 `npm run docs:dev` 报错。
*   **原因**：VitePress 需要较新的 Node.js 版本。
*   **解法**：确保你的 Node.js 版本 >= 18。在终端输入 `node -v` 检查。

**坑三：GitHub Pages 404**
*   **报错现象**：部署成功了，但访问链接显示 404。
*   **原因**：如果是第一次部署，可能需要等待 1-2 分钟 DNS 刷新。或者你的 `config.ts` 里配置了错误的 `base` 路径。
*   **解法**：如果是自定义域名，不需要配置 `base`。如果是 `username.github.io/repo-name/` 这种格式，需要在 `docs/.vitepress/config.ts` 里添加 `base: '/repo-name/'`。

## 4. 效果展示/总结 (Conclusion)

完成以上步骤后，等待 GitHub Actions 的绿色对勾亮起。点击 Settings -> Pages 里生成的链接，你会看到一个极简、优雅、带有夜间模式切换的技术文档站。

**现在的你：**
不再需要关心服务器、不再需要关心 HTML/CSS。
只需要打开 VS Code，在 `docs` 目录下新建一个 `.md` 文件，写下你的思考，然后 `git push`。
全世界都能看到你的智慧结晶。

**Next Action:** 试着写一篇《我的第一个 VitePress 博客》，记录下此刻的成就感吧！