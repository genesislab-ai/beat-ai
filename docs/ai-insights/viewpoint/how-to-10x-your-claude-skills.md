![autoresearch 主图](/docs/ai-insights/viewpoint/images/how-to-10x-your-claude-skills-cover.jpg)

> 以下内容基于 X 上 Ole Lehmann 的原帖《How to 10x your Claude Skills (using Karpathy's autoresearch method)》高保真翻译，按原文标题、段落和步骤顺序展开，并保留原帖图片。

Claude Skills 很可能有 30% 的时候在失效，而且这种失效甚至不会被注意到。

我做了一个方法，可以让任何 skill 自动在后台自我改进。这篇文章里，我会把它怎么跑、怎么用，完整讲清楚。

只要把它启动起来，agent 就会一遍又一遍地测试和优化这个 skill，整个过程中完全不需要手工介入。

我的 landing page copy skill，质量检查通过率从 `56%` 提升到了 `92%`，而且零手工操作。

agent 只是一直自己测试、自己收紧 prompt。

下面就是这个方法，以及我做出来的那个 skill，直接拿去跑在自己的东西上就行：

附言：如果想每周都在收件箱里收到更多像这样的 AI workflow，可以订阅这份免费邮件，已经有 `3.4 万` 名读者：
[aisolo.beehiiv.com/subscribe](http://aisolo.beehiiv.com/subscribe)

## Where this comes from

Andrej Karpathy，OpenAI 联合创始人、Tesla 前 AI 负责人，也是 “vibe coding” 这个说法的提出者，最近发布了一个叫 `autoresearch` 的方法。

这个想法很简单：与其手工去把某样东西一点点改好，不如让 AI agent 自己在一个循环里替你完成这件事。

![Karpathy 的 autoresearch 仓库截图](/docs/ai-insights/viewpoint/images/how-to-10x-your-claude-skills-inline.jpg)

它先尝试一个很小的改动。检查结果有没有变好。变好了就保留，没变好就丢掉。

然后再来一次。再来一次。

Karpathy 最初把它用在机器学习代码上。但这个方法适用于任何能衡量、也能改进的东西。

包括为 Claude 写的 skills。

我把他的这套方法改造成了一个 skill，同时能在 Claude Code 和 Cowork 里工作。我只是把它跑在自己 setup 里的其他 skill 上。

我只要说一句：`run autoresearch on my landing page skill`，后面的事情它就全包了。

## How one loop auto-improves your skills

可以这样理解。

有一份菜谱，10 次里有 7 次做得很好，另外 3 次总有点不对劲。可能酱汁太淡，可能调味不对。

与其把整份菜谱从头改写一遍，不如只改一个配料。然后带着这个改动连续做 10 次。

- 变好了？保留这个改动。
- 变差了？把原来的配料放回去。

然后再改下一个地方。再做 10 次。更好还是更差？保留还是回滚？

这样跑上 50 轮之后，这份菜谱就会从 10 次里做好 7 次，变成 10 次里做好 9.5 次。

`autoresearch` 对 skills 做的事情，完全就是这个过程。

- “菜谱”就是 skill prompt。
- “做菜”就是运行这个 skill。
- “试吃打分”就是给输出评分。

整个流程里，唯一需要提供的东西，就是评分标准。

## The checklist that tells the agent exactly what 'good' means

要给 agent 一份简单的 checklist，告诉它“什么叫好结果”。这就是整个流程里唯一要做的工作。

做法也很简单，就是一组 `Yes / No` 问题。

每个问题只检查输出里的一个具体点。通过还是不通过，就这么简单。

agent 会用这份 checklist 去给每一轮输出打分，而这些分数会告诉它，自己的改动到底是在帮忙，还是在帮倒忙。

可以把它想成老师用 checklist 批改作文。

与其每次都让老师凭感觉打一个 “写作质量 1 到 10 分”，这种既模糊又会漂移的分数，不如把每一项都写成明确的是或否：

- 学生有没有写 thesis statement？是或否。
- 每个来源有没有引用？是或否。
- 全文是不是控制在 5 页以内？是或否。

用这套 checklist 去批 100 篇文章，每次都能得到稳定一致的结果。

这里也是同样的逻辑。比如一个 landing page copy skill，它的 checklist 可能是这样：

- “标题里有没有一个具体数字或结果？” 这能抓住像 “Grow Your Business” 这种空泛标题。
- “文案里有没有避开 `revolutionary`、`synergy`、`cutting-edge`、`next-level` 这种 buzzword？”
- “CTA 有没有使用一个明确的动词短语？” 这能抓住像 “Learn More” 或 “Click Here” 这种无力 CTA。
- “第一句话有没有点出一个具体痛点？” 这能抓住像 “In today’s fast-paced world...” 这种泛泛开场。
- “整段文案是不是控制在 150 词以内？” 这能抓住那些又长又拖、最后把读者耗光耐心的页面。

这些问题并不需要自己硬想。启动 autoresearch 之后，agent 会一步步带着完成。

它会追问“什么叫好结果”，帮忙把模糊感觉拆成明确的是非题；如果已经有现成的 style guide，它甚至还会主动提出从里面抽标准。

`3 到 6` 个问题通常是最合适的甜蜜点。再多的话，skill 就会开始“刷 checklist”，像那种只会背答案、但没有真正理解题目的学生一样。

## Here's how to run it

**Step 1: Download the skill. [Grab it here](https://www.dropbox.com/scl/fi/57v11vtj9gzqz10ybv7or/autoresearch.zip?rlkey=f0zbieol7beeykn04erun79ot&dl=1).** 把它放进 Claude Code 或 Cowork 的 skills 文件夹里。

**Step 2: Pick a skill to improve.** 直接说一句：`run autoresearch on my [skill name] skill`。挑那个最让人烦的 skill，那个一半时间表现很好、另一半时间像垃圾一样的。

**Step 3: The agent asks you 3 things.** 它会问要优化哪个 skill、准备用什么测试输入，比如 “write landing page copy for an AI productivity tool”，以及 checklist 问题是什么。

**Step 4: It runs your skill and shows you your starting score.** 这就是 baseline。我的 landing page skill 起点是 `56%`。标题空泛、buzzword 堆满、CTA 很弱。超过一半的检查项都没过。

**Step 5: It opens a live dashboard in your browser.** 分数曲线会随着时间往上走；每个 checklist 问题都有通过/失败拆解；还会记录它尝试过的每一次改动。页面每 `10` 秒自动刷新一次。

**Step 6: Walk away.** agent 会进入循环：分析哪里没过，对 skill prompt 做一个小改动，再重新测试。分数涨了就保留，分数掉了就撤回。

然后再来一轮。再来一轮。它会一直自主运行，直到手动停掉，或者连续 3 次跑到 `95%+`。

可以盯着 dashboard 看，也可以完全不管它。它不需要人盯盘。而且它会把改进后的版本另存成一个独立文件，所以原始 skill 不会被动到。

## What happened to my landing page skill

我把它跑在自己的 landing page copy skill 上，最后回来的结果是：

`56% → 92%`。一共 4 轮改动，保留了 3 轮，撤回了 1 轮。

agent 实际在我的 skill prompt 里改了这些地方：

- 加了一条专门针对最常见失败点的规则：`Your headline must include a specific number or result. Never use vague promises like 'Transform Your Business.'`
- 加了一份禁用 buzzword 清单：`NEVER use: revolutionary, cutting-edge, synergy, next-level, game-changing, leverage, unlock, transform.`
- 加了一个强示例 worked example，把 pain point opener 和 CTA 明确标出来，这样 skill 不用再猜“好结果”长什么样。
- 试过把字数再压紧一点，但后来又撤回了，因为文案变得太薄，CTA 也跟着受损。这个系统能抓住那种“局部看起来更好、整体却变差”的改动。

整个流程结束之后，我拿到的是：

- 一个单独保存的改进版 skill，原始版本保持不动，随时可以回退。
- 一份结果日志，记录每一轮的分数。
- 一份 changelog，解释每一次改动试了什么、为什么试、以及到底有没有帮助。
- 一份原始 skill 的备份，以防以后想回去。

那份 changelog 大概是整套东西里最有价值的部分。它完整记录了：对这个特定 skill 来说，什么改法有效，什么改法无效。

等以后更强的模型出来，甚至可以把这份 changelog 直接交给它，让它从上一个 agent 停下来的地方继续往前跑。

## This works on way more than skills

这套方法适用于任何能评分的任务。

- **Website speed:** 有人拿它去优化页面加载时间。每次只改一个点，测速度，保留或回滚。最后 67 轮把加载时间从 `1100ms` 打到了 `67ms`。
- **Cold outreach:** 先定义 checklist，比如“有没有提到对方公司”“是不是控制在 75 词以内”“结尾是不是一个具体问题”，然后让 agent 跑 50 个版本。
- **Newsletter intros:** 比如“开头有没有一个个人化细节”“有没有避开陈词滥调”，再让 agent 自动把它越收越紧。
- **Any prompt you use repeatedly**

只要能给它打分，就能对它做 autoresearch。

## Go run it

挑一个表现最差的 skill。启动 autoresearch。回来时，拿到的就会是一个真正能用的东西。

**[Download the skill here](https://www.dropbox.com/scl/fi/57v11vtj9gzqz10ybv7or/autoresearch.zip?rlkey=f0zbieol7beeykn04erun79ot&dl=1)**（Dropbox）

**Or check my github [here](https://github.com/olelehmann100kMRR/autoresearch-skill)**

附言：如果想每周都收到更多这种能帮忙获得更多客户、更多关注、同时完成更多事情的 AI workflow，而且不需要多花更多工时，我会免费发给 `3.4 万` 名读者。

加入后还会额外拿到一门免费的 Claude Cowork masterclass：
[aisolo.beehiiv.com/subscribe](http://aisolo.beehiiv.com/subscribe)

---

## 原文链接

> **How to 10x your Claude Skills (using Karpathy's autoresearch method)**
>
> 来源：X | 作者：Ole Lehmann
>
> 站内版本按原文标题、段落和步骤顺序高保真翻译，并保留了标题前主图和正文配图。
>
> 👉 <a href="https://x.com/itsolelehmann/status/2033919415771713715" target="_blank" rel="noopener noreferrer">点击阅读原文</a>
