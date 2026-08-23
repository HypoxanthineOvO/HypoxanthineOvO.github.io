---
kind: plan
cycle: C001-personal-site-rebuild
mode: goal
status: active
updated: 2026-08-23
progress: PROGRESS.md
execution: EXECUTION.md
---

# Evidence-Backed Interactive Personal Site Goal

## 执行目的

一口气完成一个可公开访问、内容可信、视觉鲜明的个人网站：以真实姓名与 `Hypoxanthine` 双品牌呈现，以 Cryogenic GPU Systems、Computer Architecture 和 AI Systems Tooling 为当前身份主轴，以研究演化、代表系统、写作与个人兴趣构成完整档案；最终发布到 GitHub Pages，并让 `hypox.cn` 成为 HTTPS 主域。

## 已确认产品方向

- **身份：** 研究者与系统构建者并重；当前研究主线是 77 K 下 cryogenic GPU 的 evidence-guided design-space exploration。神经渲染属于既往研究轨迹，不作为当前研究方向。
- **信息架构：** 首页由 Identity、Current Field、Selected Systems、Research Trajectory、Writing & Notes、Beyond Systems/About 六个连续区段组成；一级导航提供 Work、Research、Writing/Notes、公众号、Archive 和 About。
- **品牌：** 首屏将真实姓名与 `HYPOXANTHINE` 同等呈现。
- **语言：** 核心页面完整中英双语，文章与笔记保留原语言并提供必要摘要。
- **内容深度：** 首页严格精选，二级页面承载较完整的项目、研究、论文、文章、笔记、课程与个人轨迹。
- **视觉：** Research Instrument 风格，以深墨黑、纸白、金属灰、荧光青与信号红构成双表面系统；避免模板化紫蓝科技渐变和卡片墙。
- **交互：** 首屏为全屏 `Thermal State Machine` 3D 场景，以 300 K 到 77 K 的温度场、GPU floorplan 与数据流表达研究问题；项目提供 `Field` 关系图与 `Index` 可搜索列表两种视图。
- **人格内容：** 写作、诗词、乒乓球等非研究内容在首页拥有独立精选区，并进入完整档案。
- **公众号内容：** `Workspace/Hypo/Hypo-Writer` 是正式内容源；微信公众号拥有独立一级页面并沿用其实际分类。日报采用 `daily issue → news items[]` 两级模型：每天是一份独立日报页面，例如 `0823` 页面内部显示当天约 10 条新闻卡片；日报索引按日期/月找到各期。科学/技术长文拥有独立文章页；教程和系列内容拥有系列页、顺序与前后篇导航。公众号内容同时进入首页精选和站内搜索，并保留可用的发布时间、系列、摘要、封面和原始发布链接。
- **域名：** `hypox.cn` 为 canonical 主域；`www.hypox.cn` 指向主站；`hypoxanthine.cn` 与其 `www` 保留并跳转到新主域。

## 执行边界

### 允许的工作

- 在当前工作区接入并保留现有 GitHub Pages 仓库历史，沿用 Astro 5、TypeScript、MDX、Tailwind 与 GitHub Actions，按需加入 Three.js 及最小依赖。
- 只读检索本机 Workspace、`/home/heyx/Archive`、明确相关的归档资料、GitHub/GitLab、Eden Hypo-Database、`Workspace/Hypo/Hypo-Writer` 与项目文档；依据来源交叉核对个人经历、研究演化、项目描述和公众号内容。
- 重构内容 schema、双语路由、主页和二级页面；迁移或整理现有文章、笔记、论文、课程和项目，保留有价值的历史 URL 或提供静态重定向。
- 使用真实项目截图、论文图、渲染结果、界面截图或个人已有照片等可公开视觉资产；对敏感或来源不明资产不发布。
- 直接提交并推送到 `HypoxanthineOvO/HypoxanthineOvO.github.io` 的生产分支，监看 GitHub Pages workflow 直至完成。
- 使用腾讯云 DNSPod API 修改两个已确认可控域名的业务记录；不得删除系统 NS。设置 GitHub Pages custom domain、等待证书并启用 HTTPS；为旧域设置到 `https://hypox.cn` 的跳转。

### 公开边界

用户已明确第一版无需对普通个人信息采取保守筛选，可广泛使用多年笔记、项目和归档塑造内容。以下仍为硬排除项：任何凭据或密钥、涉及他人的非公开私人信息、受实验室/合作/投稿约束而不可公开的材料、原始财务或账户数据。未发表的 Cryo-GPU 工作只使用公开安全的方向性描述，不泄露未冻结结果、匿名投稿信息或内部证据。

### 非目标

- 不修改 Hypo-Database、科研仓库、笔记库或其他资料源。
- 不搭建动态后端、CMS、登录系统、分析追踪或评论系统。
- 不批量生成虚构个人经历、项目成果或研究数据。
- 不重写 Git 历史，不删除旧分支和历史归档。

## 验证目标

- `pnpm install --frozen-lockfile`、`pnpm astro check` 和 `pnpm build` 成功，内容 schema、内部链接、i18n 路由及旧 URL 映射经脚本检查；日报日期页的条目数量、来源链接和卡片渲染经数据测试。
- Playwright 覆盖 1440px 桌面、1024px 平板、390px 与 360px 手机；检查首屏和下一屏均可见、无横向溢出、遮挡、文字截断、控制台错误或布局漂移。
- 对 Three.js canvas 做截图与像素检查，证明非空、构图正确、在桌面可拖拽/响应滚动且会运动；移动端与 `prefers-reduced-motion` 使用清晰的轻量降级。
- 键盘导航、焦点、skip link、语义标题、图像 alt、语言切换、主题切换和项目 `Field/Index` 切换可用；正常正文对比度满足 WCAG AA。
- 代表内容逐项回溯到 GitHub/GitLab、Hypo-Database、Hypo-Writer 或原始项目文档；当前研究准确表达为 cryogenic GPU，神经渲染只出现在历史轨迹；公众号精选与完整索引均可访问。
- 构建产物不含凭据、私有 remote URL、内部绝对路径或明确受限内容；仓库 secret scanning 与目标内容审查无阻断项。
- GitHub Actions Pages 部署成功；GitHub Pages custom domain 为 `hypox.cn` 且 HTTPS 生效；authoritative DNS 与公网解析验证根域、`www` 和旧域跳转；最终 URL 在真实浏览器中复验。

## 完整计划

Goal 开始后连续执行，不设置中间人工审阅点。只有新发现会改变公开边界的重大事实，或 DNS/发布权限与已确认状态不符时才暂停。

用户已再次明确要求后续不等待中间确认。主模型依据实际公众号分类和内容量完成页面分配、设计与实现；仅在无法安全推进的真实外部阻塞出现时中断。

| ID | 阶段 | 期望结果 | 验证方式 |
| --- | --- | --- | --- |
| `M1` | 证据盘点与内容策展 | 从现有站、GitHub/GitLab、Eden Hypo-Database、Hypo-Writer、本机项目和相关归档建立带来源的个人内容模型，确定精选内容、公众号文章、完整档案、研究演化与可用视觉资产；当前研究不会被旧站内容误导。 | 来源清单、内容 schema、公众号文章与发布元数据清单、代表条目抽查、重复/冲突说明与公开边界检查；不把原始资料库复制进网站。 |
| `M2` | 设计系统与交互架构 | 完成 Research Instrument 视觉 tokens、响应式布局、双语信息架构、Thermal State Machine 场景规格、项目 Field/Index 交互和无障碍/性能降级设计。 | 设计系统与页面结构落实到代码；关键状态在桌面、移动、键盘和 reduced-motion 下都有明确实现路径。 |
| `M3` | 网站与内容完整实现 | 在现有 Astro 架构上完成首页、Work、Research、Writing/Notes、公众号、Archive、About、双语核心路由、Hypo-Writer 内容迁移、日报索引与逐日新闻卡片流、长文详情、系列导航、真实视觉资产、搜索筛选、3D 场景与旧链接兼容。 | Astro/TypeScript 检查、内容与链接测试通过；每份日报有独立日期页且内部逐条显示当天新闻卡片，公众号文章可从首页、一级栏目、日报索引、系列、搜索和详情访问；本地运行中所有主要路由、控制和视觉资产可用。 |
| `M4` | 浏览器质量验证与修正 | 对功能、视觉、响应式、canvas、可访问性、性能与公开内容执行真实浏览器检查并修复问题。 | Playwright 多视口截图与交互测试、canvas 像素检查、无溢出/遮挡/控制台错误；构建与安全扫描通过。 |
| `M5` | GitHub Pages 生产发布 | 提交并推送生产分支，更新 Pages custom domain，等待 workflow 与 HTTPS 证书完成。 | GitHub commit、Actions 成功状态、Pages API 状态与生产页面浏览器检查。 |
| `M6` | DNS 迁移与端到端验收 | 配置 `hypox.cn` 根域和 `www`，启用旧域跳转，完成 authoritative DNS、TLS、canonical、跳转和最终页面验收。 | DNSPod API readback、权威 NS 查询、`curl`/浏览器 HTTPS 检查、旧域到新域跳转和最终多视口截图均符合预期。 |

## 外部副作用与回退

- 开始本 Goal 即授权向现有 GitHub Pages 生产仓库推送本次网站重构，并授权按 Proposal 中的明确域名目标修改 DNSPod 业务记录；不会修改系统 NS。
- DNS 写入前再次读取实际记录，只创建或修改目标记录，不执行宽泛删除。若写权限、GitHub domain verification 或证书条件不满足，则保留已完成网站与部署证据，停止在冲突点并报告精确阻塞。
- 代码可通过 Git revert 回退；DNS 可按写入前的 API readback 恢复。任何凭据只通过既有 profile 使用，不写入仓库、Workflow 或日志。

## 未决问题

- 无。真实姓名的标准中英文写法、机构/联系方式、精选项目与可公开素材由 M1 从已有权威资料交叉核验；只有来源冲突且会影响公开身份时才中断询问。
