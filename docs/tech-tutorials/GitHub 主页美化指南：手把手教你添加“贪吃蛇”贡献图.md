# GitHub 主页美化指南：手把手教你添加“贪吃蛇”贡献图

## 前言
你是否在别人的 GitHub 主页看到过一条吃掉绿色贡献格子的“贪吃蛇”动画？这其实是通过 GitHub Actions 自动生成的。

但在配置过程中，很多开发者会遇到 **`Error: 128`** 或 **`Permission denied`** 的报错，导致动画无法生成。本文将基于真实的调试经历，教你如何正确配置，并重点解决最常见的权限“大坑”。

## 1. 准备工作
确保你有一个与你 **GitHub 用户名同名** 的公开仓库（例如你的用户名是 `Monica`，仓库名也应为 `Monica`）。这个仓库的 `README.md` 就是你个人主页展示的内容。

## 2. 配置 GitHub Action
在你的仓库中，创建文件路径：`.github/workflows/snake.yml`，并填入以下代码：

```yaml
name: Generate Snake

on:
  # 每天午夜自动运行
  schedule:
    - cron: "0 0 * * *" 
  # 允许手动触发
  workflow_dispatch:
  # 当 master/main 分支有 push 时触发
  push:
    branches:
    - master
    - main

jobs:
  generate:
    permissions: 
      contents: write # 显式声明写入权限（部分新版配置需要）
    runs-on: ubuntu-latest
    timeout-minutes: 5
    
    steps:
      # 1. 检出代码
      - name: Checkout
        uses: actions/checkout@v3

      # 2. 生成贪吃蛇文件
      - name: generate-snake-game-from-github-contribution-grid
        uses: Platane/snk/svg-only@v3
        with:
          github_user_name: ${{ github.repository_owner }}
          outputs: |
            dist/github-contribution-grid-snake.svg
            dist/github-contribution-grid-snake-dark.svg?palette=github-dark

      # 3. 将生成的文件推送到 output 分支
      - name: Push github-contribution-grid-snake.svg to the output branch
        uses: crazy-max/ghaction-github-pages@v3.1.0
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## 3. 🚨 关键步骤：解决权限报错（必看）

很多教程只讲了上面那一步，导致很多人运行 Action 时会遇到如下报错：
> `remote: Permission to <repo> denied to github-actions[bot].`
> `fatal: unable to access...: The requested URL returned error: 403`

**原因分析：**
GitHub Actions 的 `GITHUB_TOKEN` 默认权限通常是 **Read-only（只读）**。而上面的脚本需要将生成的 SVG 图片 **push（写入）** 到你的仓库分支中，因此会被拒绝。

**解决方案：**
1. 进入你的仓库页面，点击顶部的 **Settings（设置）**。
2. 在左侧边栏找到 **Actions** -> **General**。
3. 滚动到底部找到 **Workflow permissions** 区域。
4. 勾选 **Read and write permissions**（读写权限）。
5. 点击 **Save** 保存。

*(这一步是解决 90% 失败案例的关键！)*

## 4. 常见问题排查：分支不存在

如果在日志中看到关于 `branch` 的错误，或者提示找不到 `output` 分支：

虽然 `crazy-max/ghaction-github-pages` 插件通常会自动创建分支，但为了保险起见，你可以手动处理：
1. 确保你的 YAML 文件中 `target_branch` 设置为你想要的分支名（通常是 `output`）。
2. 脚本运行成功后，该分支会自动生成。
3. 如果依然报错，可以尝试手动创建一个名为 `output` 的空分支。

## 5. 在 README 中展示

最后，回到你的 `README.md` 文件，添加以下代码来引用生成的图片：

```markdown
<!-- 浅色模式展示 -->
![snake svg](https://github.com/你的用户名/你的用户名/blob/output/github-contribution-grid-snake.svg)

<!-- 或者支持深色模式的写法 -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/你的用户名/你的用户名/output/github-contribution-grid-snake-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/你的用户名/你的用户名/output/github-contribution-grid-snake.svg">
  <img alt="github contribution grid snake animation" src="https://raw.githubusercontent.com/你的用户名/你的用户名/output/github-contribution-grid-snake.svg">
</picture>
```
*(注意：将链接中的 `你的用户名` 替换为实际 ID)*

---

### 总结
配置 GitHub Actions 时，**代码正确只是第一步，仓库的权限设置同样至关重要**。当你遇到 Action 无法推送代码的情况时，第一时间检查 **Settings -> Actions -> Workflow permissions** 是否开启了写权限，通常就能药到病除。