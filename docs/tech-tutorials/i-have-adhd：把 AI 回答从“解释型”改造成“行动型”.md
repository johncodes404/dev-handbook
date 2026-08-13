# i-have-adhd：把 AI 回答从“解释型”改造成“行动型”

> 调研日期：2026-08-14  
> 项目：[`ayghri/i-have-adhd`](https://github.com/ayghri/i-have-adhd)  
> 当前数据：约 **20.2k Stars / 1.2k Forks**，MIT License。  
> 一句话定位：一个专门约束 Coding Agent 输出方式的 Skill——**答案先行、动作先行、减少旁枝、明确下一步，让人读完就能做。**

## 先说结论

`i-have-adhd` 表面上是一个“ADHD 友好型” Skill，但我认为它真正解决的是一个更普遍的问题：

> **AI 往往擅长把事情讲完整，却不擅长把事情讲到“我现在就知道下一步该干什么”。**

它没有让模型变得更聪明，也没有增加新的工具能力。它只是重新设计了“模型 → 人”这一层接口。

典型 AI 会这样回答：

```text
这是个很好的问题。这个认证流程涉及中间件、Token 验证、Cookie……
从 src/auth.ts 来看，可能需要升级 jsonwebtoken……
你也可以顺便检查一下依赖版本……
希望对你有帮助。
```

`i-have-adhd` 想把它压成：

```text
先升级 jsonwebtoken，然后改 src/auth.ts:42。

1. 打开 src/auth.ts
2. 替换 verifyToken
3. 运行 auth.spec.ts

下一步：如果测试失败，只贴第一行错误。
```

差别不是“更短”，而是**信息的排序方式变了**：从“解释优先”变成“行动优先”。

这也是这个项目最值得借鉴的地方。

---

## 一、它到底是什么

项目核心非常小。

真正决定行为的文件只有：

[`skills/i-have-adhd/SKILL.md`](https://github.com/ayghri/i-have-adhd/blob/main/skills/i-have-adhd/SKILL.md)

当前只有约 **6.8 KB**。

其余代码主要在做三件事：

1. 给 Claude Code、Codex、Gemini CLI、GitHub Copilot、Pi、Qwen Code、Zed 等不同 Agent 做安装和适配；
2. 提供 always-on / session persistence；
3. 用 evals 验证“变短以后有没有把正确性、安全性和 Agent 自主性一起削掉”。

所以它不是一个复杂软件，而更像：

```text
一份经过工程化包装和验证的“输出协议”
```

这也是为什么它很适合作为学习 Agent Skills 设计的案例。

---

## 二、它对问题的定义非常准

作者不是从“请简洁回答”这种模糊偏好出发，而是先提出五个行为假设：

1. 工作记忆有限，离开屏幕的信息容易丢；
2. “知道该怎么做”和“真正开始做”之间存在摩擦；
3. 启动通常比继续更难，所以第一步必须极其明确；
4. “一会儿”“有点工作量”这种模糊时间无法帮助规划；
5. 已经完成的进展如果不可见，就很难形成反馈。

无论一个人是否真的有 ADHD，这五个问题在使用 Coding Agent 时都很常见。

例如 AI 告诉你：

> 你需要检查配置、确认依赖、调整代码、再跑一下测试。

你理论上全懂了，但下一秒还是会问：

> “所以我现在先干啥？”

`i-have-adhd` 的目标，就是消灭这一步额外的脑内编译。

---

## 三、10 条核心规则

### 1. 第一行直接给下一步动作

不要先解释背景。

如果答案本身是命令、文件路径或代码片段，就把它放第一行。

这条规则本质上是在争夺最宝贵的位置：**首屏注意力**。

---

### 2. 多步骤任务必须编号

每一步只做一件有边界的事。

不要写：

```text
打开文件，找到函数，替换以后再跑测试，然后看看结果。
```

而是：

```text
1. 打开 src/auth.ts
2. 替换 verifyToken
3. 运行 npm test -- auth.spec.ts
```

这里有一个很好的设计原则：

> **宁可让用户完成一条较短的路径，也不要给一条理论上完整、实际上没人执行到底的路径。**

---

### 3. 结尾只留下一个明确的下一步

不是：

> 希望能帮到你，有需要随时问我。

而是：

> 下一步：运行 `npm test`，失败的话贴第一行错误。

这让每一次对话都形成一个明确的“接口”。

上一轮回答的最后一句，直接连接下一轮输入。

---

### 4. 抑制旁枝问题

AI 很喜欢顺手发现十个问题。

修登录时，它会突然告诉你：

- 依赖旧了；
- README 也过期了；
- 命名不统一；
- 测试覆盖率还不够。

这些东西可能都对，但会把当前任务冲散。

Skill 的处理方式是：**当前问题先闭环，第二个问题单独排队。**

这是我认为非常重要的一条。

Agent 的“聪明”如果没有任务边界，最后会变成注意力污染。

---

### 5. 每一轮重新声明当前状态

例如：

```text
第 3/5 步完成：数据库 schema 已更新。
下一步：回填新字段。
```

而不是一句：

```text
Done. Ready for the next part?
```

长对话真正的问题不是上下文窗口，而是**人的上下文窗口**。

模型可能还记得前 30 轮，人已经忘了自己做到哪里。

---

### 6. 时间必须具体

不用：

```text
这需要一点时间。
```

而用：

```text
如果已有测试，大约 15 分钟；没有测试，可能需要半天。
```

它要求把时间从模糊形容词变成可用于决策的量级。

不过这条要注意环境约束：如果 Agent 自己正在执行任务，不应该随便承诺“我几分钟后完成”；时间估计更适合描述**用户需要执行的工作量**。

---

### 7. 把已经完成的成果显式展示出来

不要说：

```text
我已经对认证流程做了一些调整。
```

而要说：

```text
Magic Link 登录现在已经可以工作。
验证：npm run dev → 打开 /login。
```

核心不是“汇报”，而是让进度可以被验证。

---

### 8. 错误采用事实型表达

不用：

```text
糟糕，好像出了点问题。
```

而是：

```text
auth.spec.ts:42：期望 200，实际 401。
原因：请求没有 Authorization header。
修复：补上 Bearer token。
```

格式接近：

```text
位置 → 现象 → 原因 → 修复
```

这比任何“语气优化”都更有用。

---

### 9. 一个列表最多 5 项

超过 5 项，不继续堆，而是重新分组：

```text
现在做
以后做
```

或者：

```text
必须
可选
```

这背后其实是信息架构思维：**不是把信息全部给出来，而是先帮用户完成排序。**

---

### 10. 删除开场白、复盘和礼貌性收尾

作者直接禁止一类常见废话：

```text
Great question.
Let me think about this.
Hope this helps.
Let me know if you need anything else.
```

核心原则只有一句：

> **从答案开始，在答案结束时停止。**

---

## 四、真正让这个 Skill 成熟的，不是 10 条规则，而是“什么时候不要遵守”

很多 Prompt 最大的问题是只有规则，没有优先级。

于是“简洁”最后会演化成“少说必要信息”。

`i-have-adhd` 专门写了一节 `When to break the rules`，我认为这是整个 Skill 里最值得学的部分。

### 情况 1：用户明确要求详细解释

如果用户说：

```text
Explain it.
Walk me through it.
```

就应该完整解释。

它没有把“简洁”变成最高原则，而是认为：

```text
任务目标 > 输出风格
```

---

### 情况 2：危险操作

遇到：

- `rm -rf`
- force push
- schema migration
- drop table

必须先确认。

不能因为“下一步动作优先”，就直接把危险命令甩给用户。

---

### 情况 3：连续三轮还没修好

这是一个很聪明的反调试死循环设计。

如果连续三轮都是：

```text
还是不行。
```

就不要继续第 4 次、第 5 次机械修改。

应该停下来问：

> **是不是底层假设错了？**

这比“继续生成下一版代码”高级得多。

---

### 情况 4：真正存在歧义

如果目标根本不清楚，一次短问题优于大胆猜测后全部重做。

---

### 情况 5：规则和任务发生冲突

例如用户问“我有哪些选择”，就应该正常给 2～4 个方案，而不是因为“只能留一个下一步”就只给一个答案。

### 情况 6：规则和 Agent Harness 冲突

系统提示、工具调用规范、安全约束永远高于这个 Skill。

这点非常重要：

> **好的 Skill 不是试图统治整个 Agent，而是知道自己在指令层级里的位置。**

---

## 五、它为什么能持续生效

`SKILL.md` 里有一个关键配置：

```yaml
disable-model-invocation: true
```

也就是说，它默认不是让模型自己“觉得该用时就用”，而是由用户显式开启。

在 Codex 的适配文件里也明确写着：

```yaml
policy:
  allow_implicit_invocation: false
```

这种设计很合理。

因为它不是一个“处理 PDF”“查数据库”之类的能力型 Skill，而是一个**全局输出风格 Skill**。如果模型偷偷自动启用，反而可能篡改用户当前想要的表达方式。

### Claude Code

安装以后可以手动：

```text
/i-have-adhd
```

也可以创建：

```bash
touch ~/.claude/.i-have-adhd-always
```

进入 always-on。

Claude Code 的实现不是简单把一句提示塞进去，而是注册 `SessionStart` hook，在：

```text
startup / resume / clear / compact
```

这些场景重新检查 flag。

如果开启，就重新加载完整 `SKILL.md`。

这解决了一个实际问题：长 Session 做过 compaction 后，原来的风格规则可能被压掉。

### Codex

Codex 使用：

```text
$i-have-adhd
```

显式调用。

如果想全局生效，可以把核心规则写进：

```text
~/.codex/AGENTS.md
```

### 其他 Agent

项目还为 Gemini CLI、GitHub Copilot、Pi、Qwen Code、Zed、Kimi Code CLI、Hermes 等提供了安装路径，并给 Cursor 保留了同步后的 Skills 目录。

这也是项目传播快的重要原因之一：它没有把自己绑定死在 Claude Code 上，而是把核心 `SKILL.md` 当成“单一事实源”，其他平台只是适配层。

---

## 六、它不是只会写 Prompt：项目甚至做了 eval

这是我看完以后评价明显上升的一点。

项目在 [`evals/`](https://github.com/ayghri/i-have-adhd/tree/main/evals) 里建立了一套比较正式的评测。

不是简单比较：

> “用了以后平均少了多少 Token？”

而是比较五个维度：

| 指标 | 权重 |
| --- | ---: |
| Correctness | 35% |
| Autonomy | 25% |
| Actionability | 20% |
| Safety | 10% |
| Concision | 10% |

这个权重设计很有意思。

**简洁只占 10%。**

也就是说，这个项目并不认为“越短越好”。

它真正优化的是：

```text
正确 + Agent 自主完成 + 容易执行
```

然后才是短。

候选 Skill 要发布，还需要满足：

1. 没有 blocker；
2. 正确性和安全性不能显著低于 baseline；
3. 加权总分高于 baseline；
4. 对外做竞品比较时必须使用相同 cases、模型、trial 和 rubric。

测试案例也专门覆盖：

- 直接回答；
- Agent 自己能做的事情不要甩回给用户；
- Debug；
- 长解释；
- 危险操作；
- 请求歧义；
- 多步骤进度；
- 错误汇报；
- casual message；
- 复杂迁移计划；
- 医疗边界。

这里有一个很值得记住的设计思想：

> **输出风格的优化不能只测“看起来爽不爽”，还要测试它有没有伤害 Agent 的能力。**

---

## 七、为什么它能在三个月左右拿到 2 万 Star

仓库创建于 2026 年 5 月，到了 2026-08-14 已经超过 **20,000 Stars**。

下面是我的判断，不是作者的官方解释。

### 1. 它命中了一个所有 AI 用户都认识的痛点

很多 Skill 解决的是专业问题。

这个项目解决的是：

> **AI 太爱说话。**

几乎任何 Coding Agent 用户都能在 3 秒内理解它。

---

### 2. Before / After Demo 极其强

用户根本不需要理解 Agent Skills、Prompt Engineering 或 ADHD 理论。

只看 README 里的前后对比，就能立刻产生：

```text
对，我要的就是右边这个。
```

这是非常强的产品传播设计。

---

### 3. 名字天然具有传播性

`i-have-adhd` 比：

```text
action-first-response-formatter
```

显然更容易记，也更容易在社交网络上传播。

它把一个“输出格式工具”包装成了一个极有辨识度的身份型名字。

---

### 4. 核心极小，安装成本极低

用户不需要跑服务、不需要 API Key、不需要数据库。

本质就是一份规则文件。

越容易试，Star 转化率越高。

---

### 5. 它不是一次性 Prompt，而是产品化了 Prompt

它补齐了：

```text
Skill
+ 多 Agent 安装
+ always-on
+ hooks
+ tests
+ evals
+ 多语言 README
```

所以用户得到的不是“十条提示词”，而是一个可以长期使用的小产品。

这也是这个仓库最值得学的地方：

> **一个好的 Prompt 不等于一个好的 Skill。真正的 Skill 还要解决触发、持续生效、跨平台、验证和退出机制。**

---

## 八、我最值得借鉴的 5 个设计思想

### 1. “格式”本身就是功能

以前很容易把 AI 能力理解为：

```text
模型聪不聪明
会不会调用工具
代码写得对不对
```

但这个项目说明还有第四层：

```text
答案是否以人能够立刻执行的方式交付
```

模型正确 ≠ 用户完成任务。

中间还有一层“交互成本”。

---

### 2. 先定义认知摩擦，再写规则

它不是凭感觉规定“回答短一点”。

而是：

```text
问题：启动困难
→ 规则：第一行给动作

问题：工作记忆有限
→ 规则：每轮重述状态

问题：旁枝容易打断任务
→ 规则：一次只处理一个问题
```

这种 Prompt 设计方式比堆形容词稳定得多。

---

### 3. 一定要写“规则失效条件”

很多 Skill 只会说：

```text
Always do X.
Never do Y.
```

真正成熟的规则应该是：

```text
默认做 X；在 A/B/C 情况下例外。
```

现实世界不是 if，而是 if / else。

---

### 4. Skill 应该尽量保持单一事实源

这个项目没有给 Claude、Codex、Cursor 各维护一份完全不同的规则。

核心都指向同一个 `SKILL.md`，平台层只负责“怎么加载它”。

这可以显著减少规则漂移。

---

### 5. Prompt 也应该做回归测试

修改 Prompt 以后，“感觉更好”是不够的。

尤其是全局型 Skill，一条规则变化可能同时伤害：

- 正确性；
- 安全；
- 自主执行；
- 长文解释；
- 工具调用。

`i-have-adhd` 的 eval 思路非常值得复用到自己的 Skills 仓库。

---

## 九、我的使用建议

### 建议一：把它当“工作模式”，不要当所有场景的默认人格

我更推荐**按需启用**，而不是无脑 always-on。

最适合：

```text
修 Bug
改文件
执行 Git 操作
环境配置
排查报错
多步骤开发任务
```

这些场景的核心问题是“做完”，不是“聊透”。

不一定适合：

```text
系统学习一个新概念
学术讨论
方法论推演
需要多视角展开的问题
```

虽然 Skill 已经写了“用户要求解释时可以详细解释”的例外，但全局 always-on 仍然容易让模型形成过强的动作导向。

---

### 建议二：真正值得抄的不是名字，而是 5 条核心规则

如果不想安装整套，我会优先保留：

```text
1. 第一行直接给答案 / 下一步动作
2. 多步骤必须编号
3. 当前问题先闭环，不顺手扩散
4. 错误按“位置—原因—修复”表达
5. 删除无意义开场、复盘和客套结尾
```

这五条已经能消灭大部分 Coding Agent 废话。

---

### 建议三：如果长期使用，最好 Fork 后做自己的版本

原版假设的是“ADHD-friendly Coding Agent”。

真正长期使用时，更合理的是把它改造成自己的：

```text
personal-output-protocol
```

例如可以加入：

```text
- 能直接用工具完成的事情，不要把步骤甩给我
- 默认只给最优方案；存在明显 trade-off 时再给 2~3 个方案
- 遇到设计问题先指出最关键的 3 个问题
- 不因为追求简洁而省略“为什么”
- 我要求解释原理时，先讲设计动机，再讲怎么做
```

这样它就不只是“少废话”，而是真正成为一套个人 Agent 交互协议。

---

## 十、最终评价

我会把这个项目归类为：

> **一个非常简单，但产品定义异常准确的 Agent Skill。**

它没有发明什么高深技术。

真正厉害的是把一个大家都隐约不爽、却很少有人认真定义的问题说清楚了：

> **AI 回答的终点，不应该是“信息已经提供”，而应该是“下一步已经足够清楚”。**

更进一步说，`i-have-adhd` 展示了一条很值得记住的 Agent 产品规律：

```text
模型能力
×
工具能力
×
任务边界
×
输出接口
=
真实可用性
```

模型再强，如果最后把关键答案埋在第六段里，用户仍然会觉得它难用。

这也是为什么一个只有几 KB 核心规则的项目，可以在几个月里拿到两万多个 Star。

---

## 参考

- [项目主页：ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd)
- [README.md](https://github.com/ayghri/i-have-adhd/blob/main/README.md)
- [SKILL.md](https://github.com/ayghri/i-have-adhd/blob/main/skills/i-have-adhd/SKILL.md)
- [INSTALL.md](https://github.com/ayghri/i-have-adhd/blob/main/INSTALL.md)
- [Claude Code always-on hook](https://github.com/ayghri/i-have-adhd/blob/main/hooks/always-on.mjs)
- [Eval README](https://github.com/ayghri/i-have-adhd/blob/main/evals/README.md)
- [Eval rubric](https://github.com/ayghri/i-have-adhd/blob/main/evals/rubric.md)
- [Eval cases](https://github.com/ayghri/i-have-adhd/blob/main/evals/cases.jsonl)
