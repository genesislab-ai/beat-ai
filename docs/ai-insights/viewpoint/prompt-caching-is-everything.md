# 构建 Claude Code 的经验：Prompt Caching 才是一切

> 以下内容基于 X 上 Thariq 原文《Lessons from Building Claude Code: Prompt Caching Is Everything》整理翻译，按原文结构展开，保留关键配图与核心论证，非逐字直译。

![Prompt Caching 封面](/docs/ai-insights/viewpoint/images/prompt-caching-cover.jpg)

## 为什么长程 Agent 产品离不开 Prompt Caching

作者开门见山：工程界常说 “Cache Rules Everything Around Me”，这条规则放到 Agent 产品上一样成立。Claude Code 这类长时运行、不断往返调用模型的产品之所以在成本和延迟上可行，关键不是“模型更便宜了”，而是 prompt caching 让前几轮已经算过的前缀可以被重复利用。

从产品经营角度看，这不是锦上添花，而是底层约束。缓存命中率越高，每轮请求重复计算的 token 越少，系统成本越低，响应越快，订阅计划能给出的额度也就越宽松。所以 Claude Code 团队会持续监控 prompt cache hit rate，一旦命中率异常下降，甚至会按事故级别处理。

这篇文章的核心问题只有一个：既然 prompt caching 这么关键，那它到底是怎么工作的，又该如何围绕它设计 Agent 系统？

## 1. 先按“可缓存性”来摆放 Prompt

Prompt caching 的工作方式，本质上是前缀匹配。API 会从请求开头开始缓存内容，一直缓存到某个 `cache_control` 断点为止。也就是说，只要前缀稍有变化，后面的缓存命中就会被连带破坏。

因此，Prompt 的排列顺序非常重要。作者给出的经验非常明确：**静态内容放前面，动态内容放后面。**

![Prompt 排布与缓存层次](/docs/ai-insights/viewpoint/images/prompt-caching-layout.jpg)

Claude Code 内部大致按下面这个顺序组织请求：

1. 全局静态的 system prompt 与工具定义
2. 项目级共享的 `CLAUDE.md`
3. 会话级上下文
4. 本轮对话消息

这样设计的好处是，不同项目、不同会话、不同轮次可以尽量共享更长的公共前缀，让缓存命中最大化。

但作者也强调，这种顺序看似简单，实际上很脆弱。团队曾经踩过的坑包括：

1. 把精确时间戳写进本该静态的 system prompt
2. 以非确定性的方式打乱工具定义顺序
3. 动态修改工具参数，例如某个 AgentTool 本轮能调用哪些子智能体

这些改动看起来都“不大”，但只要发生在前缀区域，就会直接让缓存失效。

## 2. 信息更新时，优先用 Messages，而不是改 System Prompt

实际产品里，总会有一些会变化的信息，比如当前日期变了、用户刚修改了文件、工具返回了新的环境状态。直觉上，很多人会选择直接更新 prompt 内容，但这会带来新的 cache miss，而且往往成本不低。

作者给出的建议是：先问自己，这些变化能不能通过“下一轮消息”传进去，而不是改写前面的系统提示。

Claude Code 的做法，是把这类变化放进下一条 user message 或 tool result 中，用一个 `<system-reminder>` 标签告诉模型“现在是星期三了”或“某个文件刚被修改了”。这样，系统前缀保持稳定，缓存仍然可复用。

这背后的思路很值得记住：**如果某段信息会频繁变化，就不要把它塞进缓存前缀。**

## 3. 不要在同一个 Session 中途切换模型

很多人会想当然地认为：前面用大模型做复杂推理，后面碰到简单问题时切到小模型，应该更省钱。作者说，这在有 prompt caching 的长对话里经常恰好相反。

原因是 prompt cache 是按模型隔离的。假设你已经在 Opus 上积累了 10 万 token 的会话上下文，此时为了回答一个简单问题切到 Haiku，看起来单价更低，但实际上你得重新为 Haiku 建一套缓存前缀。那一大段历史上下文会重新计费，最终可能比继续让 Opus 回答还贵。

如果确实需要换模型，更合适的方法是使用子智能体。比如由 Opus 准备一个 handoff message，再把任务交给另一个模型去处理。Claude Code 里的 Explore agents 就经常按这种方式使用 Haiku。

这条经验的重点不是“永远别切模型”，而是：**模型切换会打断缓存连续性，必须把它当成一次架构级操作，而不是普通参数开关。**

## 4. 永远不要在会话中途增删工具

这是作者反复强调的一类高频失误。很多工程师会觉得，当前问题只需要几把工具，就只给模型这些工具；等场景变化了，再把别的工具加回来。这个思路对纯功能控制来说很直观，但对 prompt caching 来说非常糟糕。

因为工具定义本身就是缓存前缀的一部分。你在会话中途加一个工具、删一个工具、改一个工具描述，都会让整段前缀失效。

### Plan Mode 的正确设计方式

作者举了 Claude Code 的 Plan Mode 作为例子。

一个看似自然的实现方式是：进入 plan mode 时，把工具集切换成只读工具；退出时，再恢复可写工具。问题在于，这会直接打断缓存。

Claude Code 采用的方案正好相反：**无论是否处于 plan mode，请求里始终保留同一套工具定义。** 进入和退出规划模式，不是通过“改工具集”实现，而是通过 `EnterPlanMode` 和 `ExitPlanMode` 这两个工具本身来表示状态切换。

当用户进入 plan mode 时，系统只额外给模型一条说明消息，告诉它当前只能探索代码库、不能编辑文件、完成后调用 `ExitPlanMode` 即可。这样工具定义始终不变，缓存前缀也不会被破坏。

还有一个额外收益是：既然 `EnterPlanMode` 本身也是工具，模型就可以在遇到复杂任务时自己进入 plan mode，而不需要人工介入切换状态。

### Tool Search 的正确设计方式

作者还提到 Claude Code 的 tool search 场景。真实环境里，系统可能挂了几十个 MCP 工具，如果每轮请求都把完整 schema 全塞进去，成本很高；但如果按需删掉不用的工具，又会破坏缓存。

他们的解决办法是 `defer_loading`。也就是说，请求里始终保留一组轻量级工具 stub，只包含工具名和 `defer_loading: true` 之类的占位信息。模型需要时，通过 ToolSearch 去发现并加载完整 schema。

这样做的关键好处是：缓存前缀保持稳定，工具顺序保持稳定，而真正昂贵的完整工具定义只在需要时再注入。

这其实是在提醒所有 Agent 开发者：**与其“移除工具”，不如“延迟展开工具”。**

## 5. Compaction 和上下文分叉，也必须共享父会话前缀

当上下文窗口快满时，系统通常会做 compaction，也就是把已有对话总结成摘要，再基于摘要继续新会话。很多人把它实现成一个独立 API 调用：换一个专用 system prompt，不带工具，单独让模型做摘要。作者指出，这种做法虽然容易写，但会把 prompt caching 的优势几乎全部丢掉。

问题在于：如果 compaction 请求的 system prompt、工具定义、上下文结构与父会话不同，那它的缓存前缀就完全匹配不上。为了生成摘要，你会重新为那一大段历史上下文支付一次完整输入成本，用户账单也会明显变差。

![Compaction 与缓存安全分叉](/docs/ai-insights/viewpoint/images/prompt-caching-compaction.jpg)

Claude Code 的做法是“缓存安全分叉”：

1. 使用与父会话完全相同的 system prompt
2. 使用完全相同的用户上下文和系统上下文
3. 使用完全相同的工具定义
4. 先附上父会话已有消息，再在最后追加一条新的 compaction 指令

这样从 API 视角看，这次请求与父会话上一次请求几乎拥有同样的前缀，于是缓存仍然可以复用。真正新增的，只有最后那条 compact 指令以及摘要输出本身。

当然，这也带来一个额外要求：系统必须提前预留足够的上下文空间，确保 compact 请求和最终摘要都能放得下。作者称之为保存一个 “compaction buffer”。

## 最后的几条底层原则

文章最后把经验收束成几条更普遍的原则：

1. Prompt caching 是前缀匹配，前缀里任何改动都会让后面的缓存一起失效
2. 尽量用消息承载变化，而不是频繁修改 system prompt
3. 不要在会话中途切模型，也不要随意增删工具
4. 监控缓存命中率，就像监控可用性和延迟一样认真
5. 所有“派生操作”都应尽量复用父会话前缀，包括压缩、总结和技能执行

如果把这篇文章压缩成一句话，那就是：**Prompt caching 不是某个 API 的性能优化技巧，而是 Agent 产品的系统设计约束。** 你一旦接受这个前提，很多“为什么 Claude Code 要这样实现”的细节都会突然变得合理。

对做 Agent 产品的人来说，这篇文章最值得抄的不是某个孤立技巧，而是它背后的工程态度：先承认缓存约束是真实存在的，再围绕约束设计状态机、工具系统和上下文流转方式。只有这样，长程、多轮、低延迟、可负担的 Agent 体验才有机会成立。

## 原文链接

> **Lessons from Building Claude Code: Prompt Caching Is Everything**
>
> 来源：X | 作者：Thariq
>
> 一篇非常实战的工程总结，解释 Claude Code 为什么把 prompt caching 当作系统级约束，以及 plan mode、tool search、compaction 这些能力应如何围绕缓存来设计。
>
> 👉 <a href="https://x.com/trq212/status/2024574133011673516" target="_blank" rel="noopener noreferrer">点击阅读原文</a>
