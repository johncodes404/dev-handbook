# UI 界面审查与重设计 Skills 调研：从截图诊断到视觉定稿

> 调研日期：2026-08-14  
> 研究对象：`interface-design`、`design-critic-skill`、`ui-design-pro`、`mobile-app-ui-design`。  
> 核心问题：给 AI 一张现有 APP / 微信小程序界面截图后，如何让它先判断“哪里有问题、什么该删、什么该留”，再给出真正可落地的视觉优化方案，而不是一上来就堆卡片、图标、渐变和阴影。

## 先说结论

这 4 个 Skill 看起来都叫“UI 设计”，但实际上承担的是四种不同角色：

| Skill | 更像什么 | 最强项 | 对我最合适的使用位置 |
| --- | --- | --- | --- |
| [`interface-design`](https://github.com/Dammyjay93/interface-design) | 产品界面设计总监 | 从意图、层级、密度到设计系统的完整重设计 | **主设计 Skill** |
| [`design-critic-skill`](https://github.com/sergekostenchuk/ui-ux-agent-skill-system/tree/main/core/skills/design-critic-skill) | 设计审稿人 | 看截图、找问题、排序、给修改 brief | **截图诊断第一步** |
| [`ui-design-pro`](https://github.com/ceorkm/ui-design-pro) | UI 规则手册 / 去 AI 味清单 | 冗余、布局、颜色、卡片、交互细节 | **专项复查与去 AI 味** |
| [`mobile-app-ui-design`](https://github.com/ceorkm/mobile-app-ui-design) | 移动端设计顾问 | Thumb Zone、移动端信息层级、状态与流程 | **移动端约束检查** |

如果只安装一个，我仍然推荐 **`interface-design`**。

如果安装两个，最适合我的组合是：

```text
截图
  ↓
design-critic-skill：先诊断，不动手重做
  ↓
我确认“哪些问题值得改”
  ↓
interface-design：按确认后的方向重新设计
  ↓
HTML 视觉原型
  ↓
确认定稿后再还原到微信小程序代码
```

`ui-design-pro` 和 `mobile-app-ui-design` 更适合做“专项顾问”，而不是和前两个同时争夺设计主导权。

最值得记住的一句话是：

> **先 Critique，再 Design。先决定什么不该存在，再决定剩下的东西应该长什么样。**

很多 AI 界面之所以越改越花，不是因为不会 CSS，而是跳过了前半步。

---

## 一、`interface-design`：最适合当主设计 Skill

### 1. 它到底是什么

`interface-design` 明确把自己的范围限定在产品型界面：Dashboard、Admin Panel、SaaS、工具、设置页、数据界面，而不是营销页和品牌官网。

这一点非常重要。很多所谓的 Frontend Design Skill 是从 Landing Page 的审美出发的，默认追求“大标题、视觉冲击、渐变、Hero、插画”。但成员管理、公告管理、预约管理这类后台工具追求的是另一种东西：

- 谁最重要，一眼能不能看出来；
- 信息能不能快速扫完；
- 高频操作是不是顺手；
- 低频操作有没有安静地退到二级；
- 同一类内容是不是建立了稳定的视觉语法；
- 页面是不是既紧凑，又不拥挤。

`interface-design` 的基本立场是：**AI 最大的问题不是不会画，而是太容易使用“默认答案”。**

它认为，同样一句“做一个后台管理页面”，模型会天然掉进训练数据里最常见的模板：同样的 Sidebar、同样的卡片、同样的字体、同样的 KPI、同样的阴影。真正的设计不是换一个主题色，而是每一个决定都回答“为什么”。

### 2. 它的第一原则：先回答“这个页面是给谁干什么的”

在动 UI 之前，它要求先明确三个问题：

1. **谁在使用？** 不能只说抽象的“用户”，要想到一个真实的人在什么环境下打开它。
2. **他来这里究竟要完成什么动作？** 不是“查看成员管理”，而是“找到某个人并修改权限”“快速下架一条公告”。
3. **这个页面应该给人什么感觉？** “简洁现代”不算答案，要具体到“像工作台一样紧凑”“像阅读器一样安静”。

这个思路对我特别有用。

我过去看一个页面时，容易陷入“这个地方是不是应该换个圆角”“这里要不要加个图标”。`interface-design` 强迫设计先往上一层走：

> 管理员打开这个页面，最常做的动作是什么？

一旦这个问题回答清楚，很多视觉问题会自己消失。

例如一个公告管理页面，管理员最常做的是快速识别公告、判断状态，偶尔编辑或下架。那么“编辑 / 下架”就不应该和标题拥有同样的视觉权重。不是按钮样式不好看，而是**动作优先级被设计错了**。

### 3. 它最核心的内容：视觉层级不是“感觉”，而是一套可操作的变量

这个 Skill 把“为什么这个页面看起来怪”拆成了一组很具体的东西：

#### 一个页面只能有一个主要焦点

页面上所有东西都一样大、一样深、一样醒目，会形成一种典型的“停车场式界面”：每辆车都停得整整齐齐，但眼睛不知道先看谁。

所以先明确一个 focal point，再故意把其他东西降级。

降级的手段不是只有“变小”，还包括：

- 字重；
- 颜色 / 透明度；
- 位置；
- 周围留白；
- 对比度。

#### 字重和颜色，往往比字号更适合做层级

它举了一个很实用的思路：同样是 14px，也可以通过：

- 600 + primary：核心值；
- 500 + secondary：标签；
- 400 + muted：元信息；

形成三个层级。

这比“14、15、16px 三个字号互相打架”更稳。

#### 信息密度必须是“决定出来的”

它直接反对所有卡片都用一样的 padding、一样的 gap、一样的密度。

工具型页面可以紧：12–16px 的 padding 会像工作台；同样的内容如果统一塞进 24px 大卡片，就可能变成宣传册。

这对后台小程序尤其重要。以前很容易把“留白 = 高级”当成规则，结果几个成员、几条公告占了两三屏。这里真正应该问的是：

> **这是阅读型界面，还是操作型界面？**

后台工具通常应该比面向普通用户的展示页更紧凑。

#### 空间应该有节奏，而不是平均分配

相关内容靠近，不相关内容拉开。页面中应该出现“密—松—密”的节奏，而不是所有元素之间永远 16px。

这其实解释了很多“明明对齐了但还是怪”的页面：**机械统一不等于视觉秩序。**

### 4. 它对“AI 味”的判断非常强

它专门反对这些东西：

- 所有卡片相同大小；
- 所有区域相同间距；
- 过强边框；
- 大阴影；
- 为装饰而使用渐变和颜色；
- 多个 Accent Color；
- 平铺的视觉层级；
- 随机圆角；
- 缺失 loading / empty / error / disabled 状态；
- 为了改布局使用负 margin、absolute position 等结构性补丁。

它还有一个很好用的 **Squint Test（眯眼测试）**：把眼睛眯起来看页面，仍然应该能感受到主要层级，但不能有某条边框、某块颜色突然刺出来。

这个测试很适合解决那种“我说不上来哪里不对，但就是不对”的问题。

### 5. 它不只改一张图，还试图建立长期设计系统

`interface-design` 有一个很适合持续开发的机制：把已经确认过的设计决策保存到：

```text
.interface-design/system.md
```

里面记录：

- 页面整体气质；
- depth strategy：边框、阴影还是纯 surface；
- spacing 基础单位；
- 字体层级；
- 信息密度；
- 主色和语义色；
- 重复组件的尺寸、padding、radius；
- 已经确定的组件模式。

这意味着它不是每次重新“灵感创作”，而是让后续页面逐渐服从一套设计语言。

对一个有多个管理 Tab 的小程序，这比每张截图分别让 AI “美化一下”稳定得多。

### 6. `paintover` 和 `design-review` 很符合我的工作流

它在有视觉生成能力时建议使用几种模式，其中最值得注意的是：

- **paintover**：根据现有截图给出更强的视觉版本；
- **design-review**：严格做 craft + hierarchy 审查，尽可能展示 before / after；
- **design-deslop**：快速去除明显的视觉“脏东西”和 AI 套路。

这正好可以接在“截图 → 分析 → HTML 原型”的流程里。

### 7. 它对我最适合的场景

**最适合：**

- 已经有一个能用但不好看的页面，要整体重新梳理层级；
- 成员管理、公告管理、预约管理等工具型界面；
- 页面经常出现“卡片太多、空间很散、重点不明确”；
- 已经确定一套视觉语言，希望后续页面不要漂移；
- HTML 视觉原型阶段；
- 想同时考虑设计质量和组件一致性。

**不应该让它直接决定的东西：**

它有较多 Web / React / Headless UI 的实现建议，例如优先复用 Radix、React Aria 等。对于微信原生小程序，这些实现层建议不能照搬。

所以我应该把它当：

> **设计原则 + 视觉架构 Skill，而不是微信小程序工程 Skill。**

设计定稿以后，再交给专门的小程序开发 Skill 做 WXML / WXSS 的技术适配。

### 8. 我的评价

**9.5 / 10，主力。**

它最大的价值不是“审美好”，而是把设计变成了一串必须作出的决定：意图、焦点、密度、比例、层级、色彩、depth、tokens。

它解决的是我真正缺的那一层：**不是怎么写 CSS，而是为什么这个东西应该这样出现。**

---

## 二、`design-critic-skill`：最适合先看片找问题

### 1. 它的角色非常纯粹：Critic，不是 Designer

这个 Skill 的定义很克制：

> 主要任务是对视觉质量作判断并给出可执行的修正方向，而不是负责完整实现。

它明确支持四种模式：

- `screenshot-critique`：直接看截图；
- `figma-critique`：审查 Figma frame；
- `code-context-critique`：结合源码 / 本地截图判断视觉问题；
- `fix-brief`：把批评结果转换成下一位设计 / 开发 Agent 可以执行的修改说明。

单看这一点，它几乎就是为“我感觉这个页面怪，但说不出来哪里怪”而设计的。

### 2. 它为什么比一句“请像资深设计师一样评价”可靠

这个 Skill 强制所有批评落到可观察维度，主要包括：

- hierarchy：层级；
- grouping：分组；
- scan path：视线扫描路径；
- contrast risk：对比风险；
- spacing：间距；
- type scale：字体层级；
- affordance：用户能否看懂某个东西可操作；
- consistency：一致性；
- content density：信息密度；
- action priority：操作优先级。

它明确禁止这种评论：

```text
看起来有点无聊。
需要更有冲击力。
让它现代一点。
```

因为这类话无法执行。

它要求转换成：

```text
主操作与三个次操作具有相同视觉权重；降低次操作权重，只保留一个明确主操作。
```

这就是它最适合我的地方：**把“审美直觉”翻译成设计变量。**

### 3. 它要求先做视觉层级检查

配套的 `hierarchy-rubric.md` 非常短，但抓住了几个后台页面最常见的问题：

- 主操作是不是一眼可识别；
- 标题尺度和容器是否匹配；
- 相关控件有没有被放到一起；
- 用户视线是否自然走向下一步动作；
- 关键内容是否被装饰元素压住；
- 间距是帮助分组，还是把一个流程切碎；
- 次要操作是否足够安静。

这里有一个很重要的判断：

> **间距不是越大越好。间距过大也会破坏任务连续性。**

这正适合检查那种“信息不多，但是页面特别长”的后台界面。

### 4. 它还有一份专门的 Anti-Slop 清单

`anti-slop-patterns.md` 把典型 AI UI 的弱信号列得很直接：

- 用一个大渐变撑起整个设计；
- 随机装饰球 / blob；
- 没有结构意义的嵌套卡片；
- 工具型页面塞巨大 Hero 字体；
- 相同按钮 / 卡片尺寸不稳定；
- 一套颜色只有“好看”却没有语义角色；
- 用大图掩盖真正产品内容。

最重要的规则不是“这些东西绝对不能用”，而是：

> 指出**可观察问题 → 用户后果 → 具体修法**。

例如不要只说“编辑、下架按钮太多”，而应该说：

> 每条公告都暴露两个低频动作，导致列表扫描时视觉噪音持续重复；保留主要信息，将低频动作收进统一的 overflow menu。

### 5. 输出格式特别适合变成下一步的修改指令

它固定建议输出：

```text
Input
Evidence type
Top findings
Fix brief
What not to change
Verification
Privacy notes
```

其中最值得我保留的是：

> **What not to change**

这是防止 AI 设计漂移的利器。

过去最烦的情况是：我只说“搜索栏有点占空间”，AI 把卡片、标题、颜色、按钮全部一起改了。

以后设计审查阶段应该明确输出两张清单：

```text
要改什么
不要改什么
```

这会比“只列建议”稳定很多。

### 6. 它还有一个被容易忽略的优点：证据纪律

它要求批评标注证据来源：Screenshot、Figma、Source、Browser 或 Manual，而且禁止在没有真实证据时瞎说性能、DOM、Accessibility、Analytics。

这其实是一个非常好的 Agent 设计思想：

> **截图只能证明视觉，不应该从截图推断后台逻辑。**

这和我的需求完全一致——这一阶段只关心界面，不要把业务逻辑扯进来。

它的共享隐私规则还采用 local-first：私有源码、私有截图、Figma 私有 frame 等，如果要传给外部服务，需要明确批准。

### 7. 它对我最适合的场景

**强烈适合：**

- 我发一张现有页面截图，只想先听问题，不希望 AI 立刻写代码；
- 我知道“哪里怪”，但无法准确表达；
- 我想从 10 个问题里只抓最重要的 3–5 个；
- 我要判断“这个元素到底有没有必要存在”；
- 我需要把设计意见转换成下一步给 AI 的修改 brief；
- 我要求“其他区域不要动”。

**不适合：**

- 单独拿它从零设计完整界面；
- 期待它直接完成高质量 HTML；
- 让它替代完整的 Design System。

### 8. 我的评价

**9 / 10，截图诊断第一选择。**

如果 `interface-design` 是主治医生，那么 `design-critic-skill` 更像影像科：它最重要的任务不是直接开刀，而是先告诉我究竟哪里有问题。

---

## 三、`ui-design-pro`：一本非常有攻击性的“去 AI 味规则手册”

### 1. 它是什么

`ui-design-pro` 的目标写得非常直白：把粗糙、AI-generated、amateur UI 转成 professional software。

它不像 `design-critic` 那么强调证据，也不像 `interface-design` 那样从产品世界和设计意图出发。它更像一本积累了大量经验法则的 UI 手册。

主体大致分为：

1. 10 条 Foundation Laws；
2. 四层颜色系统；
3. Micro-interactions；
4. Beginner Mistakes；
5. Playful Design；
6. Card Layout；
7. Design Thinking；
8. Presenting Designs；
9. 最后一张完整 Checklist 和 Anti-pattern 对照表。

它的优势是非常具体，几乎每条都能立刻变成修改动作。

### 2. 最值得我吸收的几条规则

#### Rule 1：信息只出现一次

它的第三条 Foundation Law：

> 每一条信息只在最合适的位置出现一次。一个区域既没有交互，也没有独立信息，就删掉。

这条对于后台界面杀伤力很大。

例如：

- 卡片标题已经说明“置顶”，下面又放一个“置顶状态：是”；
- 右上角已经显示日期，正文又再写“展示时间”；
- 顶部已经显示成员数量，每个分组又重复一次同义统计。

很多所谓的“信息密度低”，本质不是信息少，而是**同样的信息被包装了太多次**。

#### Rule 2：低频操作可以收进 `···`

它在 Card / Layout 规则中明确建议：

> collapse actions to triple-dot menu

这不是说所有操作都应该藏起来，而是提醒一个重要原则：

> **列表中反复出现的低频操作，会形成视觉税。**

如果每条公告下面都出现“编辑 / 下架”，用户每扫一行都要付一次视觉成本。把它收进统一 overflow menu，可以明显提升列表信息密度。

#### Rule 3：能靠间距解决，就少画线

它反复强调：

- border 尽量轻；
- spacing 优先于 divider；
- 不要用大阴影；
- 不要纯黑纯白；
- 一个 context 里字号控制在 2–3 档；
- hierarchy 优先使用字重，而不是不断增加字号。

这些和 `interface-design` 的原则高度一致，说明这部分属于比较稳的共识。

#### Rule 4：Progressive Disclosure

先展示当前任务真正需要的信息，其余信息按需展开。

这个原则对于管理界面非常重要，因为后台系统天然字段很多。如果所有字段一开始都以“公平”的方式展示，页面一定臃肿。

“信息完整”和“信息全部同时可见”是两回事。

### 3. 它为什么不能成为我的第一主 Skill

这个 Skill 最大的优点也是它最大的风险：**太敢下结论。**

例如它有一些非常强的经验规则：

- 稀疏表单优先 Modal；
- Geography 数据优先 Map；
- KPI 应加入 Sparkline / donut；
- Chips 空间紧时变 Icon；
- Landing Page 应使用产品截图透视；
- 大量 Micro-interaction；
- Playful Design、404 动画等。

这些在某些 SaaS 场景很好，但不能变成普遍定律。

如果把整个 Skill 不加筛选地压到一个微信小程序后台页面上，AI 很可能开始：

- 加图标；
- 加动画；
- 把简单内容做成 KPI；
- 为“专业”而增加额外视觉元素。

而我真正需要的很多时候恰恰是：**做减法。**

所以最好的使用方式不是“让 `ui-design-pro` 全权重新设计”，而是把它当专项检查器：

```text
请只使用 ui-design-pro 中与 redundancy、layout、cards、spacing、typography
相关的原则审查当前截图，不增加插画、动画、图标或新功能。
```

这样收益最大、副作用最小。

### 4. 它对我最适合的场景

**适合：**

- 页面已经基本成型，做最后一轮“去 AI 味”；
- 检查重复信息；
- 检查卡片是不是套得太多；
- 判断低频操作是否应该折叠；
- 统一 spacing、radius、buttons、states；
- 快速找到一些非常具体的 UI anti-pattern。

**谨慎使用：**

- 从零设计；
- 微信小程序这种强调克制、原生感的工具界面；
- 不需要 Icon / Animation / Illustration 的页面；
- 业务本身非常简单时。

### 5. 我的评价

**8 / 10，适合作为规则库，不适合当唯一设计总监。**

我会把它理解成：

> `interface-design` 告诉 AI“为什么这样设计”，`ui-design-pro` 告诉 AI“常见烂设计通常烂在哪里”。

两者并不冲突，但优先级应该以前者为主。

---

## 四、`mobile-app-ui-design`：移动端知识很多，但要防止“过度装修”

### 1. 它的定位

这个 Skill 专门面向 Mobile App UI/UX，明确适用于：

- 设计移动端 screen；
- 改进现有 APP；
- onboarding；
- navigation；
- React Native / Flutter / SwiftUI 风格视觉原型；
- 用户只说一句“make this screen look better”也应该触发。

它的流程分成五步：

1. Understand Context；
2. Structure First；
3. Apply Visual Design；
4. Design for Emotion；
5. Polish & Details。

它比前面三个更关注“手机上的手指怎么操作”“这个页面前后是什么”“用户属于新手还是高频用户”。

### 2. 最值得保留的是 Step 2：Structure First

这部分其实比它后面的“视觉美化”更有价值。

它要求：

- 先画出用户从哪一页来、下一页去哪；
- 找出 MVP elements，只保留当前屏必要信息；
- 主操作尽量放在 Thumb Zone；
- 内容遵循自然扫描顺序；
- 降低交互成本；
- 不要为了“简洁”把关键内容层层藏进点击；
- 根据任务频率选择合适输入方式。

对于小程序页面，这套结构思维很有用。

特别是这一对 trade-off：

> Progressive Disclosure 不等于把所有东西都藏起来；减少视觉噪音，也不能以增加点击成本为代价。

例如“编辑 / 下架”是否收到 `···`，不能只从美观判断。还要看管理员一天操作多少次：

- 一天偶尔一次：收起来很合理；
- 连续处理几十条：每次多一次点击，反而可能降低效率。

这就是移动端 Skill 提醒我的地方：**视觉简洁和操作效率有时会冲突。**

### 3. 它对信息层级的规则也比较实用

它建议：

- 一般只用一个字体家族；
- 最多约 4 个字号、2 个主要字重；
- 用 size + weight + opacity 建立层级；
- 颜色遵循大面积中性色 + 少量 Accent；
- 使用 8pt / 4pt spacing grid；
- 相关元素近，不相关元素远；
- Tap Target 至少约 44×44pt；
- 必须设计 error / empty / loading / success。

这些对微信小程序依然成立。

它还把 **375px** 当作移动端原型基准之一，这和用 375px HTML 作为视觉基准的工作方式兼容。

### 4. 行业惯例参考有什么价值

它的 `industry-conventions.md` 把 APP 按领域拆开：AI / Tech、Crypto、Finance、Health、Meditation、Education、Fitness、Productivity、E-commerce 等。

真正有价值的不是“金融就用蓝色”这种表层规律，而是它提醒：

> **界面风格不是凭空决定的，不同任务对情绪、密度和交互反馈的要求不同。**

其中 Productivity 的规则最接近小程序后台：

- clean；
- minimal；
- information-dense but organized；
- strong grid；
- consistent spacing；
- quick actions。

如果调用这个 Skill，我应该明确告诉它：

```text
这是 productivity / admin tool，不是 consumer entertainment app。
```

否则它容易向 Duolingo、Airbnb 那一类消费级 APP 的视觉语言漂移。

### 5. 它最大的风险：后半部分太喜欢“情绪价值”

它专门讲 Peak-End Rule、Emotional Feedback Loop，并推荐：

- micro-animation；
- sparkle；
- badge；
- glow；
- illustration；
- emoji；
- rounded-2xl / rounded-3xl；
- backdrop-blur；
- 成功时 bounce / glow / sparkle。

这些不是坏设计，但对于“管理员看三条公告、改一个成员权限”来说，经常没有必要。

更明显的是它给出“section vertical padding 80–96px”等强规则。放到真实的 375px 移动工具界面里，很容易让页面过松。

所以我应该把它拆成两半使用：

**保留：**

- mobile flow；
- thumb zone；
- tap target；
- 信息层级；
- spacing grid；
- user stage；
- states；
- interaction cost。

**默认关闭：**

- glow；
- emoji；
- celebration；
- illustration；
- glassmorphism；
- 过大圆角；
- 为了“alive”而添加的动画。

### 6. 它对我最适合的场景

**适合：**

- 检查桌面端思维有没有被错误搬到手机上；
- 检查按钮触摸区域；
- 判断主操作放在哪里；
- 检查信息是否被过度隐藏；
- 搜索、筛选、列表、状态页等典型移动端流程；
- HTML 原型完成以后做一次 320–430px 范围的移动端复查。

**不适合直接掌舵：**

- 极简后台界面的视觉风格；
- 需要高信息密度的管理列表；
- 明确要求“不加装饰”的页面。

### 7. 我的评价

**7 / 10，作为移动端约束顾问很好，作为主设计 Skill 容易装修过度。**

---

## 五、四个 Skill 的真正差异

### 1. `design-critic` 解决的是“看懂”

它回答：

> 哪里有问题？为什么？哪个最严重？怎么修？哪些不要动？

### 2. `interface-design` 解决的是“重新组织并设计”

它回答：

> 这个用户到底来干什么？哪个信息应该先出现？层级、密度、空间、颜色、组件系统怎么重建？

### 3. `ui-design-pro` 解决的是“常见错误清扫”

它回答：

> 有没有重复信息？有没有 AI 卡片套娃？低频操作是不是占了太多空间？颜色、边框、圆角、反馈是否粗糙？

### 4. `mobile-app-ui-design` 解决的是“手机上到底好不好用”

它回答：

> 手指够不够得到？点击成本是不是变高？信息是不是藏得太深？屏幕空间是不是浪费？

所以正确关系不是四选一，而是：

```text
                 ┌─ ui-design-pro：专项去 AI 味
截图 → critic → interface-design → 原型
                 └─ mobile-app-ui-design：移动端约束复查
```

---

## 六、最适合我的实际工作流

### 阶段 1：只看截图，不许修改

主 Skill：**`design-critic-skill`**

我可以这样下指令：

```text
只进行 screenshot critique，不修改代码，也不要直接重设计。

请从：
- 视觉层级
- 信息密度
- 分组
- 扫描路径
- 操作优先级
- 间距
- 一致性

中找出最关键的 3–5 个问题。

每个问题都说明：
1. 我现在看到的具体问题；
2. 为什么会影响管理员使用；
3. 应该如何修改；
4. 哪些现有设计不要动。

不要讨论后台业务逻辑。
```

这一步的目标不是产生新图，而是把我模糊的感觉变成明确语言。

### 阶段 2：我决定“改哪些，不改哪些”

这一步必须由我做取舍。

原因是设计本质上有 trade-off：

- 更简洁，可能意味着多一次点击；
- 更高密度，可能降低普通用户易读性；
- 把操作隐藏，可以降低噪音，也可能降低高频管理员效率。

Skill 可以分析，但最后要先确定目标。

### 阶段 3：重新设计

主 Skill：**`interface-design`**

```text
基于已经确认的 critique 重新设计当前页面。

这是移动端管理工具，不是营销页面。
优先级：
1. 管理员扫描效率
2. 信息层级
3. 合理的信息密度
4. 操作优先级
5. 视觉一致性

只解决已经确认的问题，其他字段、业务能力和内容保持不变。
先说明 focal point、density、hierarchy、spacing strategy，
再给出视觉方案 / HTML 原型。
```

### 阶段 4：做两次专项复查

第一遍：`ui-design-pro`

```text
只检查 redundancy、cards、layout、spacing、typography 和 action hierarchy。
不要增加图标、插画、渐变、动画、新字段或新功能。
```

第二遍：`mobile-app-ui-design`

```text
只从移动端可用性检查：thumb zone、tap target、interaction cost、
320–430px 宽度适配、长文字、empty/loading/error states。
不要重新定义视觉风格。
```

### 阶段 5：冻结视觉，再改微信原生代码

HTML 原型确认后，把设计冻结。

后续 WXML / WXSS 阶段的目标应该是：

> **技术适配，不是第二次设计。**

这时再调用微信小程序开发 Skill，处理组件、路径、原生控件、平台限制和运行时问题。

---

## 七、为什么不建议四个一起调用

乍一看，Skill 越多越强。实际上 UI 设计恰恰很容易出现“规则汤”。

举例：

- `interface-design` 强调克制、一个 Accent、通过 space / weight 建立层级；
- `mobile-app-ui-design` 又会建议 illustration、glow、emoji、celebration；
- `ui-design-pro` 会鼓励大量具体 SaaS pattern；
- `design-critic` 本来只想做证据化诊断。

如果四个同时成为高优先级指令，模型必须在一堆互相不同的审美规则中折中，最后很可能再次回到“平均答案”。

更好的 Agent 设计不是：

```text
一次加载所有设计知识
```

而是：

```text
当前任务是什么 → 只调用最匹配的专家
```

也就是把 Skill 当成“专科”，而不是“BUFF 叠加”。

---

## 八、最终推荐

### 必装 1：`interface-design`

**角色：主设计师。**

适合完成真正的页面重设计、视觉层级、信息密度、Design System 和 HTML 原型。

### 必装 2：`design-critic-skill`

**角色：审稿人。**

以后我再发一句“这个页面就是感觉不对，但我说不上来”，应该优先让它工作。

### 可选 3：`ui-design-pro`

**角色：规则检查器。**

不要让它自由发挥，限定到 redundancy / layout / card / spacing / typography 几类规则，价值最大。

### 可选 4：`mobile-app-ui-design`

**角色：移动端顾问。**

主要吸收 Structure First、Thumb Zone、Tap Target、Interaction Cost、状态设计；默认抑制 glow、emoji、illustration、超大圆角等装饰性建议。

最终我会使用下面这套组合：

```text
【诊断】design-critic-skill
        ↓
【取舍】我确认改什么、不改什么
        ↓
【重设计】interface-design
        ↓
【专项去 AI 味】ui-design-pro（按需）
        ↓
【移动端验收】mobile-app-ui-design（按需）
        ↓
【定稿】HTML 视觉原型冻结
        ↓
【实现】微信小程序开发 Skill 还原 WXML / WXSS
```

如果以后只记住两个名字，就记住：

> **Critic 负责把“怪”说清楚；Interface Design 负责把“对”做出来。**

---

## 九、本次实际阅读范围

为避免只根据 README 或仓库介绍做判断，本次实际阅读了以下主体文件：

### `interface-design`

- [`SKILL.md`](https://github.com/Dammyjay93/interface-design/blob/main/.claude/skills/interface-design/SKILL.md) —— 完整主体，包括 Intent、Product Domain Exploration、Visual Hierarchy、Craft Foundations、Design System、Polish & Motion、Workflow、Design Review / Design Deslop。

### `design-critic-skill`

- [`SKILL.md`](https://github.com/sergekostenchuk/ui-ux-agent-skill-system/blob/main/core/skills/design-critic-skill/SKILL.md)
- [`hierarchy-rubric.md`](https://github.com/sergekostenchuk/ui-ux-agent-skill-system/blob/main/core/skills/design-critic-skill/references/hierarchy-rubric.md)
- [`anti-slop-patterns.md`](https://github.com/sergekostenchuk/ui-ux-agent-skill-system/blob/main/core/skills/design-critic-skill/references/anti-slop-patterns.md)
- [`taste-constraints.md`](https://github.com/sergekostenchuk/ui-ux-agent-skill-system/blob/main/core/skills/design-critic-skill/references/taste-constraints.md)
- [`critique-report.template.md`](https://github.com/sergekostenchuk/ui-ux-agent-skill-system/blob/main/core/skills/design-critic-skill/assets/critique-report.template.md)
- [`privacy-policy.md`](https://github.com/sergekostenchuk/ui-ux-agent-skill-system/blob/main/core/shared/privacy-policy.md)

这些不是附带材料：主 `SKILL.md` 明确要求 critique 时读取这些参考，因此判断这个 Skill 不能只看主文件。

### `ui-design-pro`

- [`SKILL.md`](https://github.com/ceorkm/ui-design-pro/blob/main/SKILL.md) —— 完整主体，包括 Foundation Laws、4-Layer Color System、Micro-interactions、Beginner Mistakes、Playful Design、Cards、Design Thinking、Presentation、Checklist 与 Anti-patterns。

### `mobile-app-ui-design`

- [`SKILL.md`](https://github.com/ceorkm/mobile-app-ui-design/blob/main/SKILL.md)
- [`industry-conventions.md`](https://github.com/ceorkm/mobile-app-ui-design/blob/main/references/industry-conventions.md) —— 主 Skill 明确要求结合的行业惯例与 Emotional Design 参考。

---

## 十、最后的判断

这轮调研之后，我对“UI Skill”有一个更清楚的认识：

**真正有价值的 Skill 不是替 AI 增加更多审美偏好，而是减少它做默认决策的机会。**

对于现有页面优化，最危险的工作流是：

```text
截图 → “帮我美化” → AI 自由发挥
```

更可靠的是：

```text
截图
→ 证据化批评
→ 明确哪些东西应该删除 / 降级 / 合并
→ 确定视觉层级和密度
→ 生成可比较的优化版本
→ 冻结视觉方案
→ 技术实现
```

换句话说，真正应该优化的不是某一个按钮，而是 **AI 参与设计的决策流程**。