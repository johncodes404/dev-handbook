# 如何精准控制 VS Code 中 GitHub Copilot 的指令文件读取

## 前言：当“智能”变成“干扰”

最近 GitHub Copilot 推出了一个非常强大的功能：**自定义指令（Custom Instructions）**。只要我们在项目中创建一个 `.github/copilot-instructions.md` 文件，Copilot 就会在每次对话时自动读取里面的“家规”，比如“永远使用 Python 3.12”、“不要使用魔术数字”等等。

这本是个好功能，但有时候也挺烦人的。

比如，我只是想问一个简单的正则问题，或者想在一个新语境下写代码，Copilot 却依然死板地引用那个几百行的指令文件，导致上下文 token 被浪费，甚至因为指令过严而无法生成我想要的代码。

**每次看到对话框里弹出 `Used references: copilot-instructions.md`，我就想问：有没有办法让它闭嘴？**

经过一番研究，我发现了 VS Code 中一个隐藏得很好的高级设置，可以完美解决这个问题。

## 核心设置：Chat: Instructions Files Locations

在 VS Code 的设置里，有一个专门控制 Copilot 读取哪些文件的配置项，叫做 **`Chat: Instructions Files Locations`**。

简单来说，这是一个**路径白名单/黑名单管理器**。它允许你：
1.  **告诉 Copilot 去哪里找“家规”**（不仅仅是默认路径）。
2.  **明确禁止 Copilot 读取某些文件**。

### 解决方案一：一键全局关闭（推荐）

如果你觉得最近这个指令文件太烦，想暂时完全禁用它，不需要删除文件，也不需要重命名。

1.  打开 VS Code 设置（`Ctrl + ,` 或 `Cmd + ,`）。
2.  搜索 `copilot instructions`。
3.  找到 **`GitHub > Copilot > Chat > Code Generation: Use Instruction Files`**。
4.  **取消勾选**该选项。

![](https://cdn.jsdelivr.net/gh/johncodes404/blog-assets/images20260216221607634.png)

**效果**：Copilot 会彻底忽略项目中所有的 `.github/copilot-instructions.md` 文件，就像它们不存在一样。

---

### 解决方案二：精准控制（黑名单模式）

如果你是一个多模型重度用户，你的项目里可能同时存在给 Claude 看的 `.claude/rules` 和给 Copilot 看的 `.github/instructions`。你希望 Copilot 只读自己的，别乱读别人的，或者你想保留文件但暂时不让 Copilot 读。

这时候就需要用到 **`Instructions Files Locations`** 的高级配置了。

1.  在设置中找到 **`Chat: Instructions Files Locations`**。
2.  点击“添加项”。
3.  **配置黑名单**：
    *   **项 (Key)**: 输入你不想让它读的文件路径，例如 `.claude/rules` 或 `.github/copilot-instructions.md`。
    *   **值 (Value)**: 选择 `false`。

**配置示例：**

| 项 (Item) | 值 (Value) | 含义 |
| :--- | :--- | :--- |
| `.github/instructions` | `true` | 强制 Copilot 读取此文件 |
| `.claude/rules` | `false` | **禁止** Copilot 读取此文件 |
| `.github/copilot-instructions.md` | `false` | **禁止** Copilot 读取默认指令文件 |

这样配置后，Copilot 就会乖乖听话，只读取你允许它读的文件，而不会把其他 AI 的规则混淆进来。

### 极客方案：直接修改 settings.json

如果你喜欢直接操作 JSON 配置文件，可以将以下代码段添加到你的 `settings.json` 中：

```json
// 全局禁用指令文件
"github.copilot.chat.codeGeneration.useInstructionFiles": false,

// 或者，精细化控制读取路径
"github.copilot.chat.instructionsFilesLocations": {
    ".github/instructions": true,
    ".claude/rules": false,
    ".github/copilot-instructions.md": false
}
