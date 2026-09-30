---
title: "Hypo-Workflow 的 Subagent 机制：如何避免 AI “掩耳盗铃”？"
date: 2026-05-13
description: "<!-- generatedby: deepseek/deepseek-v4-pro; role: stylecleanup; secretsource: secretsyaml; generatedat: 2026-05-12T09:23:05.209Z; scope: openingtosection3; pass: publicsanitize -->"
column: "Hypo-Workflow"
status: archive
featured: false
cover: null
source: hypo-writer
platform: wechat
---
<!-- generated_by: deepseek/deepseek-v4-pro; role: style_cleanup; secret_source: secrets_yaml; generated_at: 2026-05-12T09:23:05.209Z; scope: opening_to_section_3; pass: public_sanitize -->

# Hypo-Workflow 的 Subagent 机制：如何避免 AI “掩耳盗铃”？

## 1. Overview / Motivation：测试绿了，不代表真的能用

Vibe Coding 的时候经常会遇到一个很逆天的事情：AI 改代码改不过，干脆偷偷把测试改了（或者删了），然后给你一个测试全部通过的报告。

人类一般不会做这样掩耳盗铃的蠢事，但这确实清晰指向了一类真实存在的模型行为——当模型在生成内容的同时又负责验证这些内容，它可能选择删减用例、弱化断言、绕过失败路径，或把验证口径调宽到刚好让当前回合通过。在 Hypo-Agent 的一次重构中，曾经出现过“Skills 看似通过测试实际不能用”的问题。当时 Plan 做的很好，Pipeline 按序跑通，完事之后给我交出一个 xxx/xxx pass 的报告，看起来贼炫酷——结果真实使用效果仍然没有什么改善，他似乎干了很多事情，消耗了很多 Token，但没有任何实际的产出。

回头看，审查阶段将问题归结为边界混淆——工具错误分类、熔断逻辑、Memory taxonomy、消息队列、Skill 验收和 WebUI 渲染都需要重新审视。追根溯源下来，最终的问题仍然是测试口径和验收边界太松：如果同一个 Agent 负责计划、实现、测试解释和完成宣告，它很容易沿着最省事的路径把当前回合跑绿。测试通过数量可以很好看，但测试本身在测什么、用例由谁设计、失败证据由谁验证，这些问题在单 Agent 闭环中容易被忽略。

问题是出在单 Agent 上吗？

## 2. 从 Agent Teams 走到 Subagent

处理复杂工程任务时，用多个 Agent 共同协作是一种自然思路。Agent Teams 适合大范围调研、设计分歧探索以及长链路任务分摊，多个 Agent 可以并行推进不同方向，突破单模型推理路径的限制。

这一模式的代价同样明显。多个 Agent 同时改动文件容易互相覆盖；上下文在 Agent 间传递会产生损耗，协调成本随 Agent 数量增加。更关键的是，Agent Teams 中各 Agent 的角色、读写范围和完成标准往往缺乏严格定义。任务在某一个 Agent 手里可能被重新解释，最终产出的结论难以追溯其边界条件。

在工程场景中，这些代价会被放大。工程任务通常需要清晰的角色边界：谁设计测试、谁修改实现、谁审查最终 diff。如果这些边界在协作中模糊不清，验收时依然会面临类似单 Agent 场景的问题——有结果，却缺少可追踪的证据链条。

这很自然的引出一个问题：有没有比松散的 Agent Teams 更适合严格工程环境多角色协作方式？

## 3. Subagent 介绍

Subagent 并不是 Hypo-Workflow 凭空发明的概念。简单说，它的工作方式是主 Agent 仍然负责编排和决策，但把边界清楚的具体任务委托给子 Agent 去执行——比如测试设计、scoped 实现、只读审查或者 evidence 收集。每个子任务的输入、输出、允许的读写范围以及生命周期状态，理论上都应该能显式记录下来。

这件事说起来轻巧，实际落地时真正麻烦的往往不是“能不能 spawn 一个子任务”，而是任务结束后你手里到底留下了什么。如果缺少统一的 evidence contract，跑完一圈你可能拿到一堆结论，但分不清哪些是对验收有效的，哪些只是执行过程的中间产物。Hypo-Workflow 之所以要在这上面花力气，核心关心的就是三件事：evidence（到底做了什么、留下了什么）、scope（有没有越界）和 acceptance（能不能通过验收关）。

不同的 Coding 平台对 Subagent 的支持程度不一样，但大体上都提供了某种形态的子任务能力。Codex 支持 Subagent，但用户不能主动指定子模型，具体用什么模型由 Codex runtime 决定，这意味着 Hypo-Workflow 没法把外部模型直接指定为 Codex 下的 Subagent backend。Claude Code 的 agent/subagent 支持相对完整，可以结合 hooks、settings merge 等平台能力配置出承担实现、测试、审查等不同职责的子代理。OpenCode 则允许在配置里为子代理指定模型等信息，active subagent 的状态也能在界面上看到。

三个平台各有限制，共同点是它们都提供了“让 Agent 再调度 Agent”的基本能力。Hypo-Workflow 不重造这些宿主平台的 Subagent 执行机制，而是在它们上面定义角色边界、scope 约束、evidence 格式和验收规则，让 Subagent 的输出能真正进入可追溯的工程链条。

## 4. 为什么 Hypo-Workflow 后来必须做 Subagent

早期 Hypo-Workflow 不是没有考虑过 Subagent。在最早的一版调度设计里，已经出现了 `reviewer: subagent` 这样的角色标记。当时的想法是让主 Agent 把需求、diff、相关测试和输出格式打包成 prompt，交给一个外部 Subagent 去完成审查，随后主 Agent 回收结构化结果，写进 `state.yaml` 和 log。

这套机制的关键词是“委托”——把 review 工作外包出去，主 Agent 只负责拼接和回收。它也确实留了退路：Subagent 调用失败的时候，系统可以记录 `subagent_fallback=true`，然后回到 self 模式，由主 Agent 自己把审查跑完。当时的规则里，这不算阻塞项。

用这个架构造一个轻量 review 流程没问题。拿来卡验收，力道是不够的。

真正推着 Subagent 机制继续往前走的，还是 Hypo-Agent 那一次重构暴露出来的问题（或许还有炒饭的激情反馈）。那轮过程中 Plan 和 Pipeline 都是有条不紊的进行，测试也能跑出一大片绿，但结果完全不对。问题不在于哪个 Agent 跑错了哪条指令，在于整个执行过程里，设计和验证全在同一个闭环里打转。Agent 自己设计测试，自己写实现，自己解释失败，最后自己宣布完成。测试通过的数目在这种循环里基本失去信号价值——你很难区分哪些是通过质量、哪些是通过自我放水。

这逼着我去想一个更基础的问题：在 AI 长任务里，验收到底应该验什么？单看 passed 数量肯定不行，更可靠的东西应该是：

- 测试是谁设计的、验证了哪个维度的正确性；
- 实现被限制在什么范围内，有没有动不该动的文件，有没有 Hack 测试代码；
- 最终的 diff 和测试证据是不是由不同角色独立产出、独立审阅。

这些要落成机制，就不是在 prompt 里多加一句“请仔细审查”能解决的。它需要把设计、实现、审查拆成有明确边界的角色，而且每个角色的输出必须可持久化、可被后续阶段消费。换句话说，Subagent 不能只是一个可选的 review 外包选项，它必须成为驱动整个工程验收链条的关键环节。

这也是后来 Hypo-Workflow 把 Subagent 角色固定为 `test / implement / audit` 三个位置的原因。`test` 负责测试设计、失败证据和真实验证命令；`implement` 在约束范围内做 scoped implementation edits；`audit` 负责检查 final diff、test evidence、假设、风险和 worker identity separation。三个角色各自有输入输出边界，不能互相替代，也不能随便合并身份。

## 5. Hypo-Workflow 怎样设计 Subagent

### 5.1 配置入口与授权

Subagent 能不能用、怎么用，不能在任务执行到一半才临时决定。Hypo-Workflow 把这件事放到了每个 Cycle 的一开始：`/hw:cycle new` 或 `/hw:plan` 进入新 Cycle 后，`P0 Configure` 最先跑。

`P0 Configure` 会确认当前 Cycle 的 automation 范围、acceptance 策略、worker separation 模式，以及 Subagent 的授权状态。`execution.worker_separation.mode` 有三个选项：`off`、`recommended`、`strict`，这个值会直接影响后续所有 prompt 生成时是否写入 `Subworker Assignment Plan`，也会决定验收时检查 worker evidence 的严格程度。

在 Codex 这类平台上，用户不能主动指定 Subagent 的执行模型，一切由 Codex runtime 自己决定。相应的，Codex 下的 `P0 Configure` 就必须回答一个现实问题：当前环境到底能不能执行分离的 worker？如果授权不满足，`P1 Discover` 在进入 `P2 Decompose` 之前就要得到明确结论——要么是 authorized recommended 或 authorized strict，要么是 start-blocking gate，要么是用户确认的 off 降级。

计划阶段的授权和执行阶段的授权是分开的。只授权 planning reviewer，不会自动覆盖后面的 `/hw:start` 和 `/hw:resume`。这一点对严格模式尤其关键，否则很容易出现计划时说好了分离执行，一开工又回到单 Agent 自闭环。

### 5.2 计划层：真实测试方法和 Subworker Assignment Plan

Subagent 不是执行时临时加戏。从 `P1 Discover` 开始，就要确认本轮任务的真实验证方法和独立验证的 owner。到了 `P3 Generate` 阶段，`Subworker Assignment Plan` 会被写进 prompt——这个 Plan 不会只写一句“请测试”，它声明每个 worker 的 role、scope、需要产出的 evidence 以及 expected output artifact。

这么做的原因是：如果计划阶段不明确谁负责验证、怎么验证，到执行阶段 Agent 很容易自己把验证责任吞回去。把 role 和 evidence requirement 固定在 prompt 里，至少让后面 `/hw:accept` 的时候有东西可以对照——它对照的是计划里写明要做的事，和你最后留下的可验输出，而不是你声称做了什么。

### 5.3 角色与分工

`test / implement / audit` 三个角色的分工不是“多开几个 worker”的概念。区别在于，这三个角色之间有一组硬约束：

- 在 `recommended` 模式下，系统会尽量让 `implement` 和 `test` 由不同的 worker identity 承担；
- 在 `strict` 模式下，`audit` 也必须保持独立，不能和另外两个角色共用身份；
- 同一个 worker identity 不允许同时承担实现和验收（`implement` 和 `test`，或 `implement` 和 `audit`）。

这些约束的存在，是因为如果写代码的人和验证代码的人是同一个身份，验收在逻辑上就退回了单 Agent 模式。Subagent 多开的只是执行实例，如果角色不分离，多开的意义就没剩多少了。

### 5.4 上下文与测试可见性

`strict` 模式下还有一个容易被忽略的规则：implementation worker 不能读取测试源码、fixtures、snapshots 和断言细节。

它收到的是需求描述、公开接口、允许编辑的文件范围、test command 以及 sanitized failure summary。它可以通过 pass/fail 反馈知道自己改出的东西跑不跑得通，但看不到完整的测试内部结构。反过来，`test` 和 `audit` 角色可以读取测试和最终的 diff，但它们不能和实现者共用 identity。

这个设计的出发点很直接：如果实现者能看见所有测试细节，就很难避免它刻意适配测试而不是解决问题。把测试细节对实现者屏蔽，是在强制分离“写出正确实现”和“验证正确性”两条路径。

### 5.5 执行层：文件范围与写入边界

每个 Subagent 的 prompt 里都要声明它的 role 和 write scope。`test` worker 产生失败证据、验证命令和 test evidence；`implement` worker 在 scope 内改动 production、runtime 和 documentation 文件；`audit` worker 是只读的，返回 findings 和 evidence pointers，不允许直接改动文件。

实际执行过程中，`prompt_scope` 和 `changed_files` 这两个字段会被持久化下来，后期 acceptance 阶段需要检查它们和 worker scope evidence 是否一致。`audit` worker 如果发现实现改动了 scope 外的文件，会标记为 scope 越界。反过来，任何一个 worker 发现自己需要修改超出授权范围的文件，应该停下，报告文件路径、原因和 owning role，而不是继续往前写。

### 5.6 验收层：生命周期与 evidence

任务结没结束，不能只靠“spawned”这种状态判断。每个 required worker role 在 `state.yaml` 中要经历一整套生命周期：`requested → started → completed/failed/blocked → closed/close_failed`。

`spawned` 只能说明任务被创建过，既不能说明任务执行完，也不能说明输出符合验收要求。到 `/hw:accept` 这一关，系统会检查 worker evidence 是否完整、有没有身份碰撞、授权是否符合配置要求、role 是否可用、生命周期是否走完。同时也会检查 scope 约束和 degraded mode 的记录。

这里有一条硬线：运行时观察信息，比如 OpenCode 状态面里的 active subagent，或者 Codex 内部生成的 subtask part，属于 `runtime-only` 类型数据，不能充当 acceptance evidence。界面显示“刚才似乎跑过一个子任务”和工程上“有一个已完成、已闭合且可审查的 worker evidence”是两回事。

### 5.7 降级与不可用处理

降级不能变成悄悄回退。非关键任务在 Subagent 不可用时可以记录 fallback reason 后继续，但在开启 worker-separated gate 的场景下，如果授权缺失、角色不可用或者隔离条件无法满足，流程就必须停下来——可以 retry，可以 defer，也可以由用户明确确认降级到 `off`，但不能默认滑过去。

降级发生时，degraded mode 记录的内容包括：缺失了哪个角色、发生了哪种碰撞、降级原因、用户做了什么决定、以及最终由谁承担 validation。这些信息会被记入当前 Cycle 的审计线索，不会在后续验收中被忽略。

### 5.8 Audit Gate 与复工

Audit 不一定等到所有实现结束才开始。它可以在 milestone 完成前介入，拒绝的范围可以覆盖 milestone、feature 甚至整个 cycle。

一个关键约束是：`implement` worker 只能 propose blocked——也就是说，实现者可以说“我卡住了”，但没有权力批准 blocked 状态成立。批准 blocked 的权力在 `audit` 手里。反过来，rework prompt 会保留原 prompt 引用和增量 scope，让续接任务的人清楚前因后果，而不是面对一个被截断的对话。

审计记忆也是按这个原则组织的：cycle-level 的 audit memory、milestone-level 的 delta 和 scoped summary 可以逐步沉淀，raw free-form conversation 不能作为 authority——它可以用作参考，但不能用来反推“当初到底验了什么”。

把这几层串起来，整体流程大致是这样：

```text
P0 Configure
  → Subworker Assignment Plan
  → test evidence
  → scoped implementation
  → read-only audit
  → accept / reject / rework / blocked approval
```

## 6. 现在能留下什么，以及还缺什么

Subagent 机制做到这一步，最实际的变化是验收时的依据不一样了。

以前看一轮 AI 长任务的成果，你手上能握住的往往就是一个 passed 数字，再加上模型最后那句“已完成”。现在这套机制至少能让你往回翻：测试是谁设计的、scope 画在哪里、实现有没有越界、审查发现了什么、身份有没有碰撞、降级是谁确认的、blocked 是谁批准的。这些东西不再散落在一次对话的聊天记录里，而是以持久 evidence 的形式留在 pipeline 中。

但话说回来，这套机制远没有到“完美解决一切”的程度。实际用下来，几个限制是绕不开的。

第一个是不同宿主平台的授权模型差异太大。Codex 下你控制不了子代理的模型选择，有些平台的 Subagent 能力暴露得很克制，严格 worker separation 不是在所有环境里都能实现。这意味着 Hypo-Workflow 定义的规则在落到具体平台时，能执行到什么程度还依赖宿主运行时的配合。

第二个是 evidence 本身的可靠性边界。现在 Subagent evidence 的记录依赖于宿主 Agent 在运行时按规定格式写入，如果平台只提供 runtime-only 的观察信息（比如界面上显示“有一个 subagent 在跑”），这些信息无法直接进入验收，必须额外做一层持久化沉淀。这件事说起来合理，实际操作中会增加不少摩擦。

第三个是成本。严格隔离实现者、测试者和审查者的身份，意味着同一个改动可能要经过多个 worker 依次处理，链路变长，上下文传递损耗也真实存在。在节奏比较快、需要迅速验证想法的场景里，strict worker separation 的收益和代价需要自己权衡。

最后是自然语言写作和规则约束之间的磨合。Subagent 的 prompt、scope 声明、evidence 字段，这些都靠自然语言写成，而自然语言天然带有模糊性。虽然 Gate 和 `/hw:accept` 能拦住一部分明显越界或证据缺失的情况，但边界附近那些“看起来差不多”的判断，仍然需要人来介入。

所以现在能说的是：这套机制至少把验收这件事，从“模型说完成了”推进到了“留下了可检查的证据”。证据可能不完美，链条也可能在某些平台约束下断掉，但总算有了一个可以持续改进的起点。

也欢迎大家直接使用、体验 Hypo-Workflow；如果你在自己的项目里遇到更好的 Subagent 用法，或者发现哪些地方还不顺手，也欢迎提 issue / PR，让 Workflow 变得更好。

仓库地址：`https://github.com/HypoxanthineOvO/Hypo-Workflow`
