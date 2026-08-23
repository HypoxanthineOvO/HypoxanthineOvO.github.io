---
kind: execution-log
cycle: C001-personal-site-rebuild
updated: 2026-08-24T01:13:00+08:00
---

# Personal Site Rebuild and Launch 执行记录

## 2026-08-24 01:13 - M6 DNS 与旧域跳转完成，等待 TLS

- **计划项：** `M6`
- **目的：** 让新主域解析到生产站，并保留旧域跳转。
- **动作：** 在 DNSPod `hypohub` profile 为 `hypox.cn` 和 `hypoxanthine.cn` 分别创建两条 GitHub Pages A 与 `www` CNAME；因 DNSPod URL 转发要求备案，按用户选择创建公开 repo `HypoxanthineOvO/hypoxanthine.cn-redirect`，部署 index/404 跳转页并绑定旧域；系统 NS 全程未改。
- **结果：** Google/Cloudflare 公共 DNS 已返回预期记录；主域 HTTP 返回新站 200，两个 `www` 均 301 到 apex，旧域 apex 返回含 canonical、meta refresh 与 `location.replace()` 的跳转页。GitHub Health 已确认主域 DNS valid、served by Pages、HTTPS eligible。
- **证据：** DNSPod record IDs `2377155703`、`2377155708`、`2377155746`、`2377168847`、`2377168848`、`2377168849`；redirect commit `221eed6`；直接 Host 路由 curl 验证。
- **计划影响：** M6 保持进行中，唯一剩余项为外部 TLS 签发。
- **遇到的问题：** DNSPod 免费套餐限制同子域最多两条 A；显性 URL 因未备案被拒；GitHub custom-domain 证书在约一小时监看窗口内尚未签发。
- **下一步：** 证书存在后启用两个 Pages 站点的 `https_enforced`，验证生产 HTTPS 与旧域跳转。

## 2026-08-24 00:06 - M5 GitHub Pages 发布完成

- **计划项：** `M5`
- **目的：** 将重构站点提交并部署到生产 Pages。
- **动作：** 提交 `4d36eb5` 并推送 `origin/main`；监看 Actions run `32650527649`；通过 Pages API 设置 `cname=hypox.cn`。
- **结果：** build 与 deploy jobs 均 success，Pages status 为 built，custom domain 已绑定 `hypox.cn`。
- **证据：** GitHub commit `4d36eb5`、Actions run `32650527649`、Pages API readback。
- **计划影响：** M5 完成，进入 M6。
- **遇到的问题：** 在证书尚不存在时同时请求 HTTPS enforcement 返回预期 404；改为先绑定域名、后等待证书。
- **下一步：** 配置 DNS 并完成 TLS 验收。

## 2026-08-24 00:02 - M4 浏览器与发布前质量门完成

- **计划项：** `M4`
- **目的：** 证明网站在真实浏览器、静态产物和公开边界上可发布。
- **动作：** 使用 Playwright 覆盖 1440×900、1024×768、390×844、360×800；验证移动菜单、主题、Work Field/Index、搜索、日报卡片与 Three.js canvas；对 248 个 HTML 执行内部链接和 canonical 扫描。
- **结果：** Playwright `failures: []`；canvas 方差 1079.50、动态变化 84371 像素、reduced-motion 变化 0；248 页内部死链 0、canonical failures 0；CNAME、RSS、sitemap 正常。
- **证据：** `scripts/validate-site.py`、`scripts/check-dist-links.py`、`/tmp/hypox-site-validation/report.json`、`pnpm astro check`、`pnpm build`。
- **计划影响：** M4 完成，进入 M5。
- **遇到的问题：** 修复了筛选 `hidden` 优先级、语言切换死链、draft 笔记索引缺失、底部图片懒加载和测试时序竞态。
- **下一步：** 提交并推送，监看 GitHub Pages。

## 2026-08-23 23:51 - M3 网站与 Hypo-Writer 内容整合完成

- **计划项：** `M3`
- **目的：** 交付完整网站和公众号正式内容面。
- **动作：** 实现首页、Work、Research、公众号、Archive、Search、About 与核心中英页面；导入 98 期 AI 日报和 10 篇长文，恢复旧文章、笔记、系列、标签与前后篇导航。
- **结果：** `2026-08-23` 日报页面按源数据渲染 5 张新闻卡片；公众号长文、日报、15 篇旧文章和 14 篇技术笔记均可检索和访问。
- **证据：** `src/content/wechat/`、`src/data/wechat-daily.json`、`src/pages/wechat/`、`src/pages/archive.astro`、`src/pages/search.astro`。
- **计划影响：** M3 完成，进入 M4。
- **遇到的问题：** 纠正了日报层级、Astro 图标导出名和历史 draft 可见性不一致。
- **下一步：** 执行多视口浏览器验证。

## 2026-08-23 23:42 - M2 设计系统与交互实现完成

- **计划项：** `M2`
- **目的：** 建立与低温 GPU 研究身份一致的交互视觉系统。
- **动作：** 落实 Research Instrument tokens、深色实验表面与纸白内容表面、荧光青/信号红/酸性黄语义色；实现 Three.js Thermal State Machine、Work Field/Index、响应式导航与 reduced-motion。
- **结果：** 首页六区、核心中英页面和桌面/移动交互架构完成；首屏下一 section 在各视口可见。
- **证据：** `src/styles/global.css`、`src/components/ThermalField.astro`、`src/components/HomePage.astro`、`src/components/WorkPage.astro`。
- **计划影响：** M2 完成，进入 M3。
- **遇到的问题：** 无。
- **下一步：** 整合完整内容与路由。

## 2026-08-23 23:28 - M1 证据盘点与内容模型完成

- **计划项：** `M1`
- **目的：** 以可核验资料确定当前身份、研究演化、项目和写作范围。
- **动作：** 核对现有站内容、GitHub/GitLab 项目、公开研究材料与 Hypo-Writer；区分当前 cryogenic GPU 主线和既往 neural rendering 轨迹；整理项目、发表、公众号和历史档案。
- **结果：** 形成 9 个项目、9 项发表、98 期日报、10 篇公众号长文、15 篇旧文章和 14 篇技术笔记的公开模型；未导入凭据或受限研究结果。
- **证据：** `src/data/portfolio.ts`、`src/content/publications/`、`scripts/import-hypo-writer.mjs`、`src/content/wechat/`、`src/data/wechat-daily.json`。
- **计划影响：** M1 完成，进入 M2。
- **遇到的问题：** 用户补充公众号一级栏目和逐日 issue 模型，已纳入架构。
- **下一步：** 实现设计系统与交互架构。

## 2026-08-23 23:17 - 日报页面层级纠正

- **计划项：** `M1`
- **目的：** 准确表达公众号日报的 issue 与新闻条目层级。
- **动作：** 将日报模型从模糊的按日卡片流纠正为 `daily issue → news items[]`；每个日期有独立页面，页面内部显示当天全部新闻卡片。
- **结果：** M1 将从 `news-pipeline/issues/ai-news/<date>` 提取正式 issue，不把 prep 或内部证据文件作为前台内容。
- **证据：** `PLAN.md`、`PROGRESS.md`、本地 Discussion Ledger。
- **计划影响：** 修正 M3 页面与数据验收，不新增计划 ID。
- **遇到的问题：** 先前表述将“一天”误作单张卡片，已被用户纠正。
- **下一步：** 盘点实际日报 issue 的日期、条目结构与可公开字段。

## 2026-08-23 23:13 - 公众号一级栏目与连续执行约束

- **计划项：** `M1`
- **目的：** 将公众号内容从普通写作来源提升为有独立信息架构的一级产品面。
- **动作：** 增加公众号一级导航；规定日报为按日卡片流，科学/技术长文为独立文章，教程/系列保留顺序和前后篇；确认后续不等待中间审阅。
- **结果：** 公众号设计可以依据 Hypo-Writer 的真实分类自主落实，M1 继续执行。
- **证据：** `PLAN.md`、`PROGRESS.md`、本地 Discussion Ledger。
- **计划影响：** M3 页面范围扩展，不新增计划 ID 或人工审阅点。
- **遇到的问题：** 无。
- **下一步：** 完成内容盘点并据此确定公众号内容模型和页面布局。

## 2026-08-23 23:09 - Goal 授权与公众号范围补充

- **计划项：** `M1`
- **目的：** 开始已批准 Goal，并确保 Hypo-Writer 公众号内容成为正式网站内容源。
- **动作：** 将 Plan 切换为 active；把 `Workspace/Hypo/Hypo-Writer`、微信公众号文章、发布元数据、首页精选、完整索引、详情与搜索写入 M1/M3 和验收；只读核对其目录结构。
- **结果：** M1 已开始，六阶段结构不变；尚未修改网站代码、GitHub 远端、Pages 或 DNS。
- **证据：** `PLAN.md`、`PROGRESS.md`；Hypo-Writer 中存在 `workspace/accounts/wechat`、`workspace/works`、`workspace/projects`、`workspace/series` 与 `workspace/articles`。
- **计划影响：** 扩大 M1/M3 的内容范围，但不增加人工审阅点。
- **遇到的问题：** 无。
- **下一步：** 接入现有网站仓库并完成各资料源的并行内容盘点。
