# LogicLoom: 个人技术知识库构建方案 (PRD)

> **Slogan**: 让写作回归写作，让技术回归透明。
> **Owner**: Jayden
> **Date**: 2026-02-14
> **Version**: 1.0

## 1. 项目愿景 (Vision)

构建一个**高认知密度、结构化、极速响应**的个人技术教程站点。
不仅仅是碎片化的博客，而是体系化的知识花园。
利用现代前端技术栈（VitePress），实现“文科思维”与“技术实现”的完美融合，支持复杂的交互式演示，同时保持极简的阅读体验。

## 2. 核心价值 (Core Values)

*   **极速 (Speed)**: 秒级热更新，毫秒级页面加载，提供极致的阅读流心流。
*   **极简 (Minimalism)**: 排除一切干扰，内容为王，排版典雅。
*   **结构化 (Structured)**: 只有成体系的知识才有复利，强调目录树和索引。
*   **掌控感 (Ownership)**: 数据完全本地化（Markdown），Git 版本控制，不依赖任何第三方封闭平台。

## 3. 技术栈选型 (Tech Stack)

| 模块 | 选型 | 理由 |
| :--- | :--- | :--- |
| **核心框架** | **VitePress** | Vue 官方出品，SSG + SPA 架构，专为文档设计，性能极佳。 |
| **内容格式** | **Markdown** | 标准化、易迁移、支持内嵌 Vue 组件（MDX 风格）。 |
| **部署托管** | **GitHub Pages** | 免费、稳定、配合 Actions 自动流水线。 |
| **开发环境** | **VS Code + Node.js** | 行业标准工具链。 |
| **样式扩展** | **Vue 组件** | 用于未来开发复杂的交互式图表（如复利曲线、GDP增长图）。 |

## 4. 实施路线图 (Implementation Roadmap)

### Phase 1: 地基搭建与结构化 (Initialization)
- [ ] 初始化 Node.js 环境: `npm init -y`
- [ ] 安装核心依赖: `npm add -D vitepress vue`
- [ ] 运行向导: `npx vitepress init` (启用 TypeScript)
- [ ] **关键重构**: 建立 `docs/` 目录，将生成的 `.vitepress` 及 Markdown 文件移入其中，保持根目录整洁。
- [ ] **修正脚本**: 修改 `package.json` 中的 scripts，指向 `docs` 目录：
    ```json
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
    ```

### Phase 2: 内容策略与配置 (Configuration)
- [ ] 配置 `docs/.vitepress/config.ts`
    - [ ] 设置站点标题与描述
    - [ ] **关键配置**: 设置 `base` 路径 (解决 GitHub Pages 404 问题)
- [ ] 配置导航栏 (Navbar) 与侧边栏 (Sidebar)
- [ ] **首发内容**: 撰写《LogicLoom 诞生记：基于 VitePress 的个人知识库搭建实录》（元编程思维，边做边写）。
- [ ] 迁移现有的 `.md` 笔记到 `thinking/` 和 `tech-tutorials/`。

### Phase 3: 自动化部署 (Deployment)
- [ ] 创建 GitHub 仓库 `dev-handbook`
- [ ] 配置 `.github/workflows/deploy.yml` (使用生产级配置，含缓存与权限控制)
    ```yaml
    # 核心配置片段参考
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm run docs:build
    ```
- [ ] 在 GitHub Settings 开启 Pages 服务，源选择 "GitHub Actions"

## 5. 关键配置备忘 (Crucial Configs)

### 5.1 解决 GitHub Pages 路径问题
若仓库名为 `dev-handbook`，必须在 config 中添加 `base`：

```typescript
// docs/.vitepress/config.ts
export default defineConfig({
  // 必须与仓库名一致，且首尾都要有斜杠
  base: '/dev-handbook/', 
  title: "Jayden's LogicLoom",
  description: "深度思考，终身学习",
  themeConfig: {
    // ...
  }
})
```

### 5.2 目录结构规范
建议采用“扁平化 + 极简分类”的结构：

```
docs/
├── index.md                  # 首页
├── .vitepress/               # 核心配置
├── public/                   # 图片资源
│
├── tools/                    # 类别一：生产力工具
│   ├── index.md              # 就像这个分类的“目录页”
│   ├── vscode-settings.md    # 具体文章 1
│   ├── cursor-guide.md       # 具体文章 2
│   └── ...
│
└── thinking/                 # 类别二：随笔与思考
    ├── index.md
    └── ...
```

这种结构简单明了，随时可以往里加新文章。

这种结构的好处是：**路径即分类**。例如访问 `.../tools/vscode-settings` 就能看到文档。

## 6. 工作流 (Workflow)

1.  **Write**: 在 VS Code 中撰写 `.md` 文件。
2.  **Preview**: 终端运行 `npm run docs:dev` 本地实时预览。
3.  **Push**: `git push` 提交代码。
4.  **Live**: GitHub Actions 自动构建并发布，喝口咖啡，网站更新完毕。

## 7. 附录：未来扩展可能性

*   **交互式组件**: 使用 Vue 编写自定义组件，在 Markdown 中直接使用 `<Comp />`。
*   **全文搜索**: 集成 Algolia 或使用本地搜索插件。
*   **PWA**: 支持离线访问，像原生 App 一样安装在手机上。
