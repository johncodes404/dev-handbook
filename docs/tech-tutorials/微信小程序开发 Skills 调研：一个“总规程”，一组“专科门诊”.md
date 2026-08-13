# 微信小程序开发 Skills 调研：一个“总规程”，一组“专科门诊”

> 调研日期：2026-08-13  
> 研究对象：[TencentCloudBase/CloudBase-AI-Toolkit 的 `miniprogram-development`](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/tree/main/plugin/cloudbase/skills/miniprogram-development) 与 [Sun-sunshine06/miniprogram-skills](https://github.com/Sun-sunshine06/miniprogram-skills)。

## 先说结论

这两个东西解决的不是同一层问题，不能把它们理解为“二选一”。

- **第一个（腾讯云 CloudBase）像项目总规程**：规定 AI 面对微信小程序时该用什么思维、先查什么、哪些平台边界不能踩、开发者工具和云开发怎么走。
- **第二个（Miniprogram Skills）像六个专科门诊**：分别处理脚手架、错误导入后的恢复、CLI 预览、GUI 运行时、导航架构、页面文案；它不负责从零到一把一个小程序全包下来。

对“梅园14号”这类原生微信云开发项目，正确顺序是：

```
视觉方案定稿
    ↓
CloudBase 的 miniprogram-development 约束代码生成
    ↓
按问题类型调用第二套的专用 Skill 验证或修复
```

最重要的一点：**Skill 的价值不在于让 AI 更会“写页面”，而在于给 AI 划清证据边界。**  
例如，`preview` 成功只能证明编译/预览路径健康，不能证明“点按钮后不会白屏”；截图好看也不能证明运行时没报错。把不同证据放在不同工序里，才不会出现 AI 看一张图就开始瞎改代码。

---

## 一、第一套：CloudBase 的 `miniprogram-development`

### 1. 它是什么

这是腾讯云 CloudBase 工具包中的一个小程序开发 Skill，当前文件标注版本为 **2.26.0**。主体由一份 `SKILL.md` 和 5 份场景参考组成：

| 模块 | 它解决什么 |
| --- | --- |
| 主 Skill | 小程序页面、组件、配置、调试、预览、发布、云开发与搜索优化的总入口 |
| `cloudbase-integration.md` | `wx.cloud`、OPENID、数据库、云函数、存储的边界 |
| `devtools-debug-preview.md` | 微信开发者工具 Nightly、`wechatide`、`miniprogram-ci` 的执行分工 |
| `wxide-vs-cloudbase-mcp.md` | 微信 IDE Skills、CloudBase Skills、CloudBase MCP 三者如何分工 |
| `seo-search-optimization.md` | 小程序被微信搜索收录时的 URL、跳转、授权、标题与缩略图规则 |
| `pitfalls.md` | 可选链兼容、TDesign 样式、Canvas/云存储、环境漂移等常见坑 |

它还要求在“改代码”前遵循同一工具包里相邻的变更安全协议；遇到 CloudBase 认证、数据库、支付等问题时，要转交相邻的专项 Skill。因此它**不是一份孤立、可随手复制的提示词**，而是一个路由中枢。

### 2. 它的设计思想：先分清平台，再分清执行面

普通 AI 很容易把“前端”理解成浏览器：想当然地写 Web 登录、Web SDK、`fetch`、React/Vue 习惯用法。这个 Skill 的第一层约束，是强迫 AI 承认：**微信小程序不是缩小版网页。**

它把系统拆成三层：

| 层 | 作用 | 不该替代谁 |
| --- | --- | --- |
| 微信开发者工具 Nightly + `wechatide` | 打开项目、编译、模拟器、控制台/网络、预览上传、日常云开发操作 | 不替代编码规范 |
| CloudBase Skills | 告诉 AI 应如何写小程序与云开发代码 | 不直接替代执行工具 |
| CloudBase MCP | 高级云治理、权限、数据模型、MySQL/PG 等补位能力 | 不抢日常 DevTools 工作 |

其中最有价值的判断是：**如果 Nightly 开发者工具可用，日常小程序云开发操作优先走微信登录态的 `wechatide`；不要为了查集合、部署云函数，又强行开一套腾讯云 MCP 登录。**  
这不是反对 MCP，而是在减少身份、环境、权限三套状态之间的漂移。工具越多，真正危险的常常不是“不会用”，而是“以为自己正在操作 A 环境，实际动了 B 环境”。

### 3. 它对小程序代码的核心约束

#### 项目不是一堆页面，而是一份路径合同

AI 修改前要确认：

- `project.config.json` 中的 `miniprogramRoot` 是否指向真实源码；
- `app.json.pages` 是否真的对应页面文件；
- 页面是否带齐逻辑、WXML、WXSS、JSON 等配套文件；
- 真机预览、上传前是否有合法 `appid`；
- 所有本地图片、图标、组件路径是否真实存在。

这是因为小程序最常见的“看上去代码没问题、开发者工具就是不跑”并非业务逻辑，而是**路径合同被破坏**：仓库根目录与小程序根目录混了、页面路径没注册、资源引用是悬空的。

它还默认建议简单场景使用**无图标的自定义 tabBar**。逻辑并不是“图标不好看”，而是图标会带来资源路径、选中态、预留空白和对齐四类额外变量；若你的设计本来就不需要图标，文本 tabBar 更容易稳定地做到信息密度和视觉对齐。

#### 云开发不是“再写一个登录页”

该 Skill 对 CloudBase 的判断很清楚：

- 客户端使用 `wx.cloud.database()`、`wx.cloud.callFunction()`、`wx.cloud.uploadFile()`；
- `wx.cloud.init()` 应在应用启动阶段集中初始化，不要每页乱初始化；
- 云函数内用 `cloud.getWXContext().OPENID` 获得可信用户身份；
- 普通用户可安全执行的读写留在客户端权限边界内；
- 跨集合、特权写入、第三方 API、数据校验等放到云函数；
- **不要把 Web 登录流搬进小程序。**

这背后是一个非常实用的分层：前端负责发起用户动作，云函数负责拥有权限的判断和编排。OPENID 由平台上下文给出，而不是让页面从用户输入里“证明自己是谁”。

#### 调试不是一个按钮，而是一条证据链

它给出的优先级是：

1. 有 Nightly：用 `wechatide`，并先通过 `--help` 或 `tools.yaml` 查真实参数，不能臆造命令；
2. 没有 Nightly：`miniprogram-ci` 负责预览/上传，CloudBase MCP 负责云资源操作；
3. `miniprogram-ci` 不能替代模拟器、控制台、网络缓冲区和 GUI 自动化。

尤其要记住：**Stable 版微信开发者工具不等于带有 Skills/MCP 的 Nightly 版。**  
很多“为什么命令不存在”的问题，不是你的项目坏了，而是装错了执行面。

#### 搜索收录是另一套产品约束

若未来做可公开搜索到的文章、公告或指南页，Skill 要求：

- 结果页能凭 URL 参数直接打开，不能依赖前一步状态或全局缓存；
- 参数应短而语义化，不要塞整坨 JSON；
- 尽量使用 `navigator`，并避免爬虫访问被点击锁/变量锁拦住；
- 阅读类内容不要强制先登录或绑手机；
- `web-view` 里的内容不会被小程序搜索收录；
- 关键页设置标题、分享图，音视频设置可供爬虫识别的封面。

这对“公告/指南”类功能尤其有启发：**能被访问，不等于能被发现；能被发现，也不等于在没有上一页状态时能被正确打开。**

### 4. 它提前替你防的坑

- 老版本基础库/开发者工具可能不支持 `?.` 和 `??`；
- TDesign 的边框、状态常由伪元素控制，普通选择器覆盖未必生效；
- Canvas 保存和云存储失败常是临时文件路径或权限规则问题；
- 开发者工具所连的云环境，可能与代码中初始化的环境不同；
- CI 上传还受 AppID 与 IP 白名单限制。

### 5. 对它的评价

**强项**

- 腾讯生态内的边界判断很完整，尤其是 Nightly / `wechatide` / CloudBase MCP 的分工；
- 不会强迫所有小程序使用 CloudBase，只有代码或需求出现 `wx.cloud` 时才进入云开发规则；
- 有“不要猜工具名、不要猜环境 ID、不要把凭据写进配置”的安全意识；
- 既处理工程，也处理搜索收录这种常被工程师遗漏的产品约束。

**限制**

- 它主要是**开发与执行规程**，不是 UI 审美 Skill；不能指望它自动把后台页面设计得高级；
- 很多能力依赖微信开发者工具 Nightly 与真实本机环境，当前对话环境并不能替代你的 Mac；
- 单独拿走 `miniprogram-development` 文件并不理想，因为它明确依赖同包的 CloudBase 认证、数据库和安全协议。

**我的判断**：它适合做你的“底层宪法”，尤其适合微信云开发项目；安装时应优先安装完整的 CloudBase Skills 包，而不是只复制这一个目录。

---

## 二、第二套：`miniprogram-skills`，不是一个 Skill，而是六个

### 1. 它是什么

[Sun-sunshine06/miniprogram-skills](https://github.com/Sun-sunshine06/miniprogram-skills) 当前公开 6 个 Skill，仓库自称支持 Codex 与 Claude Code，版本记录为 `v0.4.0`。每个 Skill 都采用同一种结构：

```
SKILL.md：触发条件、流程、允许自动修复的边界、固定输出结构
references/：操作手册 + 正例/反例 prompt
agents/openai.yaml：Codex 界面的展示与触发元数据
```

它的真正设计亮点不在“内容多”，而在于给每个 Skill 都写了**不适用条件**。这会显著降低 AI 见到任何问题都套同一套流程的概率。

仓库还额外维护了机器可读的技能目录、路由测试样本、重放记录和验证脚本。换句话说，它在尝试把“AI 会不会正确选择 Skill”也当成可测试对象，而不是只验证代码。

### 2. 六个 Skill 的准确分工

| Skill | 解决的核心问题 | 关键边界 | 对我是否有用 |
| --- | --- | --- | --- |
| `miniapp-official-scaffold-alignment` | 新项目或改造前，检查脚手架是否符合官方规则 | 这是**开始前的体检**，不是导入污染后的清理 | 高 |
| `miniapp-devtools-recovery` | 开发者工具导错根目录、生成模板残留、编译条件陈旧、TS 识别漂移后的恢复 | 恢复已污染项目，不拿来设计新脚手架 | 高 |
| `miniapp-devtools-cli-repair` | 用官方 CLI 排查编译与 preview 失败 | `preview` 已绿、但点击后白屏时，应转 GUI 检查 | 高 |
| `miniapp-devtools-gui-check` | 自动化检查打开页面、点击、运行时异常与 selector | 是窄范围 smoke check，不是全站视觉回归 | 中高 |
| `miniapp-center-hub-refactor` | 顶级导航变得混乱时，重组为“中心/hub” | 处理信息架构，不是单纯改文案或卡片样式 | 中 |
| `miniapp-user-facing-copy-trim` | 页面像内部说明书时，压缩文案 | 不改变业务流与整体导航 | 高 |

#### A. 脚手架对齐：先确认“地基是真的”

它检查：

- 仓库根目录和小程序代码根目录是否混淆；
- `project.config.json` 的 `miniprogramRoot`；
- `app.json.pages` 是否匹配真实页面目录；
- 页面/组件是否拥有同路径同名的逻辑、结构、样式、配置文件组；
- 组件 JSON 是否声明 `"component": true`；
- TypeScript 是否有明确编译链，而不是“文件写成 .ts 就当它能跑”。

这一项的价值很大：AI 最容易在“信息不完整”时补脑。该 Skill 明确要求它说“尚未指定”，不要凭空补配置。

#### B. DevTools 恢复：对付“工具把仓库弄脏了”

这是专门处理你曾经担心过的那种事故：已有仓库被当成“新建项目”导入，开发者工具生成模板页、重复配置、错误启动页。

它的原则是：

1. 先检查 `git status`、根目录、`project.config.json`、`project.private.config.json`、`app.json`；
2. 先还原被覆盖的受版本控制文件；
3. 再删除确认是生成物的残留；
4. 把“仓库根目录”和“实际小程序代码根目录”分开；
5. TS 项目若提示缺 `.js`，先查 TypeScript 识别/导入配置，不要粗暴改回 JavaScript；
6. 若启动了 `app.json` 未声明的页面，优先怀疑旧的自定义编译条件。

这是很好的安全顺序：**先恢复真相，再清扫垃圾。** 反过来先删，很容易把用户真正写的文件误当残留。

#### C. CLI 修复：把“截图猜病”改成命令证据

它主张官方 DevTools CLI 的诊断阶梯：

1. `--help`：确认 CLI 存在；
2. `open`：建立 IDE 连接，并从实际输出得到 live port；
3. `preview`：作为主编译检查；
4. 只有 `preview` 无法回答问题时，才用 `engine build` 做辅助；
5. 根据结果区分：仓库局部错误、宿主机/登录/AppID 阻塞、GUI-only 问题、本地服务依赖问题。

它允许自动修的范围非常克制：`project.config.json`、`tsconfig.json`、`app.json`、错误根目录残留、精确定位的轻微语法问题。涉及产品策略、发布状态、后端配置、大范围重写时，必须停下。

这个设计很值得借鉴：**AI 的自动化不该按“能不能改”划线，而应按“改错的损失是否局部且可逆”划线。**

#### D. GUI 检查：解决 preview 看不到的“活着时才出错”

这是第二套最有工程价值、也最容易被误解的一项。

它配了一个真实的 `tools/wechat-gui-check` 工具，可以：

- 通过官方 CLI 拉起 DevTools 自动化；
- 用 `miniprogram-automator` 连接；
- 按 JSON 配置打开某条路由；
- 做少量 `wait`、`tap`、`callMethod`；
- 收集异常、console 事件、页面路径、selector 是否出现；
- 输出 `report.json` 与 `trace.log`；
- 截图，但截图只是 best-effort 证据。

它强调的证据优先级是：

```
运行时异常 / console / 页面路径 / selector
    > 截图
```

因为截图只能告诉你“某一刻长什么样”，不能可靠告诉你页面是否刚报错、接口是否失败、点击事件是否没触发。

但它仍是 **public beta**，必须诚实看待限制：

- 运行在真实主机上，依赖开发者工具登录、AppID 权限、无弹窗、WebSocket 会话；
- `miniprogram-automator` 被设计成“用户自行提供”的运行时依赖，默认不随仓库安装；
- dry-run 只能验证路径、route config、CLI/automator 是否可找到，**不是运行时成功证明**；
- 截图 API 在不同 automator 版本下可能缺失或超时；
- 当前已记录 host-side 与外部仓库的部分验证，但没有把它包装成“已在各种机器、各种项目上充分验证”的万能工具。

这套诚实的限制，反而增加了可信度。

#### E. Center / Hub 重构：先解决“入口归谁”，再美化

这个 Skill 处理的是顶级导航膨胀：待办、集成、提醒、个人设置散落多个 Tab，用户不知道哪里办事。

它要求先做一张迁移表：当前入口、用户意图、使用频率、是否需要详情页、未来归属；再把高频待处理事项与低频设置分开。Hub 只展示摘要与下一步，复杂表单、筛选、验证仍保留为独立详情页。

它反对两种很常见的假改造：

- 把多个 Tab 塞成一个超长页面；
- 为了“统一入口”而删掉本来就有独立状态和流程价值的详情页。

这与你做后台页面时经常遇到的感受有关：**界面乱并不总是间距问题，很多时候是“谁拥有这件事”没有被设计。**

#### F. 用户可见文案压缩：让页面停止像管理后台说明书

它的工作不是改视觉，而是逐段决定页面文字该“保留、缩短、下沉还是删除”。

核心转换关系：

- 段落 → 标题 + 一行摘要；
- 管理名词 → 明确动词；
- 实现描述 → 用户可理解的状态；
- 重复警告 → 一条阻塞提示。

它要求逐一检查 Tab、标题、分区标签、按钮、状态 chip、空状态、错误 banner、toast；同时避免中文短标签里硬塞英文技术词。

这与你近期反复做的 UI 优化非常契合：很多页面“信息多但不密”，原因不是卡片少，而是同一解释在副标题、卡片说明、banner 中重复出现。

### 3. 它的成熟度：有工程意识，但不要神化

该仓库的成熟度不是均匀的：

- CLI 修复与 GUI 检查在目录中标为较高成熟度；
- 脚手架对齐、恢复、Hub、文案压缩为中等；
- GUI 工具仍是 beta；
- Hub 与文案压缩目前主要是路由样本与重放验证，尚缺跨仓库 forward-test；
- 所有 6 个正向 prompt 与 3 个相邻边界 prompt 都有重放记录，但**尚未有 live installed-skill routing 的真实转录**。

因此它最适合作为“高质量流程模板”，而不是不经判断直接信任的黑箱。

---

## 三、两套方案到底如何搭配

| 维度 | CloudBase `miniprogram-development` | `miniprogram-skills` |
| --- | --- | --- |
| 定位 | 开发全链路总规程 | 六种典型问题的专用流程 |
| 覆盖范围 | 工程约束、DevTools、云开发、发布、搜索收录 | 脚手架、恢复、CLI、GUI、信息架构、文案 |
| 强项 | 微信/腾讯生态边界与工具分层 | 问题分类、证据边界、输出合同、验证意识 |
| UI 审美能力 | 很弱，不是设计师 | 只覆盖导航与文案，不负责视觉美化 |
| 依赖 | 完整 CloudBase Skills 包、Nightly 时可更强 | DevTools；GUI 检查还需真实宿主机和 automator |
| 最适合的角色 | 项目的默认开发规则 | AI 遇到具体故障时的“分诊台” |

一句话：**第一个决定 AI 不该怎么乱写，第二个决定 AI 遇到不同症状该怎么查。**

---

## 四、我的实际使用策略

### 1. 不要一次性安装一堆

对现有小程序项目：

1. 将腾讯 CloudBase 的完整 Skills 包作为基础规则；
2. 第二套不必为了“看起来厉害”全时强制触发，而是在特定任务时按名称调用；
3. 把你的视觉原型规则继续单独保留：Skill 不能替代视觉决策。

### 2. 以后按下面这张分诊表提问

| 你遇到的情况 | 优先使用 |
| --- | --- |
| 新建/迁移项目，担心目录、`miniprogramRoot`、页面文件不对 | `miniapp-official-scaffold-alignment` |
| 开发者工具导错项目、生成多余模板页、启动页乱了 | `miniapp-devtools-recovery` |
| 预览失败、需要先知道编译到底报什么 | `miniapp-devtools-cli-repair` |
| `preview` 已成功，但点进去白屏、按钮失效、接口运行时异常 | `miniapp-devtools-gui-check` |
| Tab 太多、某个“我的/管理”页成了入口垃圾场 | `miniapp-center-hub-refactor` |
| 页面又长又啰嗦，但业务和导航不想动 | `miniapp-user-facing-copy-trim` |
| 任何原生小程序开发、云开发、预览上传、搜索收录 | CloudBase `miniprogram-development` |

### 3. 给 AI 的推荐总指令

```text
这是原生微信小程序项目。先遵守 miniprogram-development：
1. 先检查 project.config.json、miniprogramRoot、app.json.pages 与页面配套文件；
2. 不使用 Web、React、Vue 的思维或 SDK；
3. 仅在项目确实使用 wx.cloud 时采用 CloudBase 规则；
4. 不猜测 appid、云环境、DevTools CLI 工具名或参数；
5. 修改后说明：本次证据来自编译、CLI preview、GUI 运行时还是人工视觉确认；不要把一种证据冒充成另一种。
若本次任务属于 [填入具体子 Skill 名称]，再按其流程处理。
```

### 4. 对“梅园14号”的具体优先级

现在最值得沉淀的不是 GUI 全自动化，而是三件事：

1. **CloudBase 总规程**：防止以后 AI 把 Web 写法、错误环境、错误权限模式带进项目；
2. **文案压缩 + Hub 重构方法**：直接服务你目前的后台 UI 迭代；
3. **CLI → GUI 的验证分层**：项目再次开发或交接时，先用 CLI 确认“能编译”，再用 GUI 检查关键路径，避免反复在截图里猜。

GUI 自动化则等到页面稳定、你确实需要反复验“成员管理 / 公告 / 排班”等核心路径时再上。现在就把它装成大工程，收益很小，反而会让工具链变重。

---

## 五、最后记住的三句话

1. **小程序开发的敌人不是不会写 WXML，而是把 Web、云环境、开发者工具三套规则混在一起。**
2. **“能 preview”是编译证据；“能点击且无异常”才是运行时证据；“看着顺眼”仍是设计判断。**
3. **Skill 最好的形态不是替你思考，而是让 AI 在不该自作主张的地方停下来。**
