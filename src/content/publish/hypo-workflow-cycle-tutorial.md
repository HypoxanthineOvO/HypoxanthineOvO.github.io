---
title: "Hypo-Workflow 入门：把 Agent 工作变成一轮可验收的 Cycle"
date: 2026-05-18
description: "Hypo-Workflow 的使用前提，是已经有一个可用的 Agent 环境，例如 Codex、Claude Code、Cursor、OpenCode 或同类工具。"
column: "Hypo-Workflow 教程"
status: archive
featured: false
cover: null
source: hypo-writer
platform: wechat
---
Hypo-Workflow 的使用前提，是已经有一个可用的 Agent 环境，例如 Codex、Claude Code、Cursor、OpenCode 或同类工具。

底层 Agent 负责读取文件、修改代码、运行命令和执行测试。Hypo-Workflow 负责维护项目级工作流状态：Cycle、Plan、执行进度、报告、验收、归档，以及跨会话复用的项目上下文。

> **概念｜Hypo-Workflow 管的是工作流，不是模型**
>
> 底层 Agent runtime 仍然是 Codex、Claude Code、Cursor 或 OpenCode。Hypo-Workflow 位于其上层，记录规划、状态、证据、验收和项目记忆。

本文使用同一个示例贯穿基本流程：Hypo-LLM 的第一轮 Cycle。
Hypo-LLM 是组内使用的 Sub2API 维护 fork 的运维/部署工作区，包含 Docker Compose、PostgreSQL、Redis 和 `.pipeline` 历史；背后的源码工作区是 `sub2api-cost-scheduler`，它维护了 VSPLab fork 的源码、release 规则和调度器改造。

## 示例背景：同步维护 fork，并上线排行榜

这一轮最开始的目标，可以概括成 C1 归档里的项目名：

```text
Sub2API VSP Lab Fork Sync And Leaderboards
```

更具体地说，当时要把组内 Sub2API fork 从一个已有的本地调度器/后台/仪表盘改造状态，推进成一次可发布的版本：整理 fork 维护关系，同步 upstream `v0.1.119`，改成 monthly-first 调度策略，打磨调度策略的管理界面，补排行榜接口和仪表盘，最后构建镜像并部署到 Hypo-LLM 的 Docker Compose 服务里。

这个目标同时涉及三类上下文：

- 源码：`sub2api-cost-scheduler`，维护组内 Sub2API fork、调度器、管理后台和仪表盘。
- 测试：后端 Go 单测、前端 Vitest、typecheck、frontend build、Docker Compose 配置和健康检查。
- 部署：Hypo-LLM 中的 Docker Compose 服务、版本镜像、release tag、上线公告和回滚证据。

> **判断｜这个例子为什么适合 Cycle**
>
> 它有明确维护目标，有源码和测试入口，也有部署验证背景。Cycle 可以把这些材料放进同一轮交付里，而不是让 fork 同步、调度策略、排行榜和发布部署散落在不同对话中。

后文命令都围绕这个示例展开；命令中的目标名称是示例值。

<!-- 图 2：第一次使用命令流，M04 制作 -->

## `/hw:init`：让项目进入 Hypo-Workflow 管理

在这个示例里，`/hw:init` 的目的不是“扫一下目录就完了”，而是让 Hypo-Workflow 先读懂这一轮的初始目标和两个工作区的边界。

C1 开始时的目标是：维护组内 Sub2API fork，保护已经存在的调度器/后台/仪表盘改动，把源码同步到 upstream `v0.1.119`，补上 monthly-first 调度、排行榜和发布部署流程。对应的工作区是：

- `Hypo-LLM`：部署和运维工作区。
- `sub2api-cost-scheduler`：组内 Sub2API fork 的源码工作区。

在示例项目根目录执行：

```text
/hw:init
```

这一步会扫描项目拓扑、建立 `.pipeline/` 基础结构，并记录一份架构基线。普通 `init` 不要求 Git；只有从 Git 历史导入过往 Cycle 证据时才需要 `--import-history`。

如果项目之前已经初始化过，或者目录结构发生了较大变化，用：

```text
/hw:init --rescan
```

> **避坑｜`/hw:init` 不是开始执行**
>
> `init` 只做初始化和重扫。它会创建 `.pipeline/` 和基线，但不会创建 `cycle.yaml`，更不会开始任何任务。它只是把项目纳入 Hypo-Workflow 管理。

> **例子｜运维工作区也可以被纳入管理**
>
> Hypo-LLM 就是一个例子：它包含 Docker Compose、PostgreSQL 和 Redis，以及 `.pipeline` 历史。这说明项目上下文不只是一堆源码文件，部署拓扑、数据卷和运维关系同样可以被 Hypo-Workflow 记录下来，成为后续 Cycle 的背景。

## `/hw:cycle new`：把目标装进一轮 Cycle

接下来，把这一轮维护目标放进一个 Cycle。

```text
/hw:cycle new "Sub2API VSP Lab Fork Sync And Leaderboards" --type feature
```

Cycle 是一轮明确交付的单元。它会把一个目标、后面的计划、执行证据、验收结果和归档材料放在同一条线上，而不是散落在聊天记录里。

> **概念｜Cycle 承载完整交付**
>
> Cycle 会承载从 plan、start 到 accept、close 的完整生命周期。Cycle 结束时，目标、过程和结果都能回到 `.pipeline` 中查证。

一个 Cycle 对应一个可验收目标。如果目前已经有一个 active Cycle，新建时 Hypo-Workflow 会先按归档流程处理旧的 Cycle，再开新的。

> **判断｜什么时候开新 Cycle**
>
> “Sub2API VSP Lab Fork Sync And Leaderboards”可以作为一轮 Cycle；另一个完全无关的 UI 或文档主题应拆开。Cycle 的边界按交付目标划分，不按聊天主题划分。

创建 Cycle 时还可以通过 `--context` 参数，把之前积累的审计、补丁、延后项或调试材料带入本轮。后面做长期维护时，这个参数会很有用。

## `/hw:plan`：先把工作拆清楚

创建好 Cycle 后，进入规划：

```text
/hw:plan
```

`/hw:plan` 是 Discover-first 的规划流程，可以简化为四步：问清楚、拆 Milestone、生成 prompts、确认启动。只有到第三步 Generate 时，才会写入 `.pipeline/config.yaml`、prompts 和 architecture。

Plan 阶段会先确认验收方式、影响范围和测试覆盖，再生成后续执行用的 prompts。

> **避坑｜`/hw:plan` 不是边想边做**
>
> Plan Mode 的多轮问题和确认，是为了在执行前固定验收口径。没有确认前，它不应直接进入实现。

在这个例子里，Plan 不是抽象地问“要不要改调度器”，而是沿着 C1 的真实需求一轮一轮追问。下面是按 C1 归档记录整理过的问答口吻：

> 这时候它会问我：这轮到底维护哪个项目？源码和部署是不是同一个目录？
>
> 我就根据需求回答：源码在 `sub2api-cost-scheduler`，这是组内使用的 Sub2API 维护 fork；`Hypo-LLM` 是部署和运维工作区。源码改动、镜像构建、本地 Compose 验证和上线证据都要纳入这一轮。

> 这时候它会问我：这轮要先处理 fork 本身，还是直接改功能？
>
> 我就根据需求回答：先处理 fork 维护基线。`origin` 要指向组内 GitLab fork，`upstream` 指向 `Wei-Shaw/sub2api`；当前已有的 scheduler / admin / dashboard worktree 不能丢，release 命名要固定成 `v<upstream>_vsplab_<major>_<minor>`，这一轮目标 tag 是 `v0.1.119_vsplab_1_1`。

> 这时候它会问我：upstream 同步到哪里？已有本地改动怎么处理？
>
> 我就根据需求回答：从 upstream `v0.1.116` 同步到 `v0.1.119`。同步前要先保护本地改动，可以建安全 baseline commit 或备份分支；冲突解决时不能把已有 scheduler、后台和仪表盘行为覆盖掉。

> 这时候它会问我：调度算法具体要改成什么？
>
> 我就根据需求回答：健康账号里先用 `monthly_basic`，再用 `monthly_pro`，再 fallback 到非月费；`official` 低于两类 monthly，高于 `metered`。health 只做硬门槛，不作为同层连续打分；同层内部按剩余额度做 quota-weighted fairness。

> 这时候它会问我：调度策略在后台怎么编辑？
>
> 我就根据需求回答：继续放在 `accounts.extra.scheduler_policy`，但 create、edit、bulk edit 和账号列表里的显示要统一，不能像临时塞进去的字段；写入时要保留其他 `extra` 键。

> 这时候它会问我：排行榜要给谁看，接口怎么区分？
>
> 我就根据需求回答：管理员和普通登录用户都要能看。管理员接口保留运维能力；用户侧接口放在 usage dashboard 下，不暴露 email。榜单包括今日用量、历史累计用量和工作时长/活跃度。

> 这时候它会问我：上线时需要做到哪一步？
>
> 我就根据需求回答：这一轮要直接发布。创建 `v0.1.119_vsplab_1_1`，构建自定义镜像，更新 Hypo-LLM 的 Compose 镜像配置，只重启 `sub2api` 服务，健康检查通过后激活排行榜上线公告，公告从 `2026-04-29 08:00:00 +08:00` 开始每日弹出。

> **例子｜`/hw:plan` 会把一句话拆成可验收路径**
>
> “同步维护 fork，并上线排行榜”这句话本身不是完整规格。Plan 会把它拆成修改范围、Milestone、测试和验收方式。

如果主要问题是“架构边界还没理清”，应先进入 Deep Plan。

> **概念｜Deep Plan 放在普通 plan 之前**
>
> 当需求边界、模块层次或长期顺序还不适合直接拆 Milestone 时，用 `/hw:plan:deep` 或 `/hw:plan --deep`。它会生成一份可审计的 discussion package，但它**不直接执行实现**，也不会绕过后续普通 Plan 的确认门。

> **判断｜如果问题是“真实发生了什么”，先用 Analysis**
>
> 当目标是搞清楚根因、系统事实或指标，比如“为什么缓存命中率这么低？”——用 `/hw:analysis`。它会维护一条可追踪的调研账本。像缓存命中率分析这类工作，就比直接开改更适合先进入 Analysis。  
> 调研结论清晰之后，再决定是进 `/hw:plan`、`/hw:debug`，还是开新 Cycle。

确认计划后，Plan 会生成 prompts 和 architecture，至此规划阶段结束。

## `/hw:start` 与 `/hw:resume`：执行，也能从中断处继续

计划确认了，就可以启动执行：

```text
/hw:start
```

`/hw:start` 会从 `.pipeline/` 读取配置，按 Prompt 和 Milestone 串行推进。执行过程中会更新 `state.yaml`、`log.yaml` 和 `PROGRESS.md`。

在这个示例里，执行阶段不是一次性“让 Agent 改调度器”，而是按 Milestone 推进。我可以看着它逐步改这些东西：

- M0：整理 fork remote、版本命名和维护基线，确认 `origin` / `upstream` 拓扑，写入 release 规则和维护文档。
- M1：把组内 fork 从 upstream `v0.1.116` 同步到 `v0.1.119`，保留已有 scheduler / admin / dashboard 改动，并解决后端和前端冲突。
- M2：重做分层 monthly-first 调度：`monthly_basic` 优先，其次 `monthly_pro`，再到非月费 fallback；同层账号按剩余额度做加权公平。
- M3：打磨调度策略 UI，让 create、edit、bulk edit 和账号列表都用同一套 `scheduler_policy` 表达和展示方式。
- M4：补管理员和普通用户排行榜接口，区分 admin 与 user-facing contract，用户侧不暴露 email。
- M5：在管理员和用户仪表盘放上三列排行榜，并给公告系统增加 `popup_daily` 每日弹窗模式。
- M6：构建 `sub2api-vsplab:v0.1.119_vsplab_1_1` 镜像，更新 Compose，重启 `sub2api`，健康检查通过后发布 tag，并激活排行榜上线公告。

如果任务很长，写到一半停了下来，下次再回来时不需要重头跑。在同一个项目下用：

```text
/hw:resume
```

`/hw:resume` 会读取保存的 `.pipeline/state.yaml` 和可选的 `.pipeline/continuation.yaml`，从下一个还没有完成的步骤继续，已经完成的部分不会重放。

> **避坑｜`/hw:resume` 不是裸 `/resume`**
>
> Claude Code 原生有 `/resume`，但 Hypo-Workflow 的恢复命令是 `/hw:resume`。这两个命令不通用。请一定使用带 `/hw:` 前缀的版本。

> **概念｜Compact 是上下文摘要，不是设计权威**
>
> 项目周期很长时，执行文件可能会变得臃肿。`/hw:compact` 会为这些大文件生成 `.compact` 派生摘要，让下一次会话加载上下文更轻，但它既不删除也不重写任何原始文件。Compact 是速览入口，不是权威设计文档。

> **判断｜症状明确但根因未知时，用 Debug**
>
> 如果已有具体症状、失败测试、trace 或异常日志，而且根因尚不明确——比如转发请求返回 503、模型名在各层对不上——用 `/hw:debug`。它提供五步调试流：症状确认、根因定位、修复、验证、关闭。  
> 当问题变得越来越开放、更像是一次调查，应升到 Analysis。

## `/hw:status`、`/hw:report`、`/hw:log`：知道现在发生了什么

执行过程中或执行完成后，有三个只读命令用于观察状态，它们不推进任何任务。

- 想知道**现在跑到哪一步**了：`/hw:status`
- 想看**最近一次结果**：`/hw:report`
- 想追溯**完整事件顺序**：`/hw:log`

```text
/hw:status
/hw:status --full
/hw:report
/hw:report --view M<N>
/hw:log
/hw:log --type milestone
```

> **判断｜卡住时先 status、report 还是 log？**
>
> 进度当前位置：`/hw:status`。  
> 最近一次交付结果（含通过/失败）：`/hw:report`。  
> 中间发生的一连串事件：`/hw:log`。  
> 这三个命令是从证据层回答“发生了什么”，而不是依赖感觉或聊天记忆。

> **例子｜读证据，而不是只听完成声明**
>
> 像 Hypo-LLM 这样的长期项目，`.pipeline/` 里会慢慢积累 reports、progress、patches 和 debug 记录。先看 report 和 status，就能知道这一轮到底跑出了什么结果，哪里可能需要人工介入。

如果这一轮涉及上线或重要交付，还有一个额外视角：

> **判断｜交付前需要独立风险视角时，用 Audit**
>
> `/hw:audit` 会对代码做一次预防性扫描，覆盖安全、缺陷、架构、性能、测试、质量等维度。它不等同于普通 report。  
> 典型位置：`/hw:start` 完成后、`/hw:accept` 前，或者准备发布时。发布前回归验证、风险扫描和文档检查，都适合在验收前单独看一遍。

<!-- 图 1：Cycle 生命周期，M04 制作 -->

## `/hw:accept` 与 `/hw:reject`：把人工验收放回流程

Cycle 执行完成后，会进入 pending 状态，等待人工验收。

通过的，接受这一轮：

```text
/hw:accept
```

`/hw:accept` 会把 Cycle 标记为 completed 和 accepted，但它并不执行归档。归档是后面 `/hw:cycle close` 的事。

> **避坑｜`accept` 不等于 `close`**
>
> `/hw:accept` 是人工验收表态，不是自动归档 runner。关闭和归档仍然由 `/hw:cycle close` 负责。

如果验收不通过，给出具体反馈：

```text
/hw:reject "测试覆盖不足，请补充登录失败分支，并在 report 里列出新增测试命令和结果"
```

`/hw:reject` 会把完整反馈写入 `.pipeline/acceptance/` 下的文件，Cycle 会重新打开为 active，下一步通常是 `resume revision` 开始修订。

> **例子｜一条可执行的 reject 反馈**
>
> 反馈应当具体到缺少什么、用什么方式验证。例如：“缺少调度策略 fallback 分支测试，请补充对应用例，并在 report 里附上测试运行结果。”

## `/hw:cycle close`：归档这一轮，再开下一轮

验收通过后，这一轮的交付可以关闭并归档：

```text
/hw:cycle close
```

`close` 会把本轮的 `PROGRESS.md`、`state.yaml`、`cycle.yaml`、`prompts/`、`reports/` 移动到 `.pipeline/archives/C{N}-{slug}/`，同时保留 `config`、`log`、`patches`、`knowledge`、`archives` 本身、`PROJECT-SUMMARY` 和 `compact` 视图。

> **概念｜归档不是清空记忆**
>
> 当前轮的产物会从 `.pipeline/` 的活跃区移到 `archives` 里，但项目级的长期材料全部保留。下一次会话上来，不用重新解释整个项目，`.pipeline` 里的线索足够让 Agent 直接接上。

旧的一轮归档后，就可以开下一个 Cycle。如果上一轮遗留了一些零散问题，还可以显式地带入：

```text
/hw:cycle new "下一轮目标" --context patches,deferred
```

这就会把未处理的小修、延后项一起带进新 Cycle。

> **例子｜从已完成 Cycle 开启下一轮**
>
> 上一轮结束时，若还有两个小补丁和一个被延后的文档更新项未处理，开新 Cycle 时可以通过 `--context patches,deferred` 放进本轮上下文。

对于周期性的小修补，还有一条独立轨道：

> **避坑｜Patch 不是完整 Milestone**
>
> 有些修复不值得开整整一个 Milestone，比如一个热修、一个小清理。用 `/hw:patch` 处理它们。Patch 编号跨 Cycle 不重置，也不写入 `state.yaml` 或生成 Milestone report。长期项目里，这类轻量热修很常见。

项目跑久了，还会慢慢积累可复用的长期知识：

> **概念｜Knowledge 存长期可复用事实**
>
> `/hw:knowledge` 帮助你把“这里踩过什么坑”“某个模块的选择逻辑是什么”存为可检索的记录，而不是靠聊天历史回忆。Hypo-LLM 的 `.pipeline/knowledge/` 下已经有索引和记录，但它还不是“完整知识库”——只是开始沉淀。

同时，代码在变，文档也需要同步：

> **避坑｜文档治理需要显式动作**
>
> `/hw:docs` 支持 check、repair、generate、sync。描述性文档的修复不会自动发生在普通的 release 或 sync 操作里，需要显式 repair 或确认。README、管理员手册和渠道说明这类文档治理动作，都应当有据可查。

如果工作流需要对接 GitHub PR / GitLab MR：

> **判断｜什么时候让 `/hw:pr` 介入**
>
> 涉及 Pull Request 或 Merge Request 时，用 `/hw:pr` 先做 inspect、review、fix，并把证据归档到本地 Change Request archive。需要远程写入时才做明确确认，不要默认自动推送。

<!-- 图 3：.pipeline 记忆与归档关系，M04 制作 -->

## 从这里开始：第一轮最小命令序列，以及命令索引

一轮完整的可验收 Cycle，可以只包含下面这条基本路径：

```text
/hw:init
/hw:cycle new "第一轮目标" --type feature
/hw:plan
/hw:start
/hw:status
/hw:report
/hw:accept
/hw:cycle close
```

如果中途中断，就把 `/hw:start` 之后换成 `/hw:resume`。  
如果验收不通过，在用 `/hw:reject "<反馈>"` 之后执行 `/hw:resume` 继续修订。

后续需要不同场景的命令时，可以参考这篇配套的**命令查找表**，它会按“我想做什么”组织所有基本路径和高级分叉。

（命令查找表见 M04 后续输出，本文不再单独生成最终速查图。）
