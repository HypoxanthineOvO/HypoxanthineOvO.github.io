---
kind: discussion-summary
cycle: C001-personal-site-rebuild
updated: 2026-08-23T23:17:30+08:00
raw_discussion: local/discussions/C001-personal-site-rebuild/
---

# Personal Site Rebuild and Launch 讨论摘要

## 已确认需求

- 基于本机相关文件夹与归档、Eden Hypo-Database、GitHub 和 GitLab 的多年资料，设计并发布个人网站。
- 使用现有 GitHub Pages 用户站点，并让 `hypox.cn` 成为主域；使用 Hermes 中腾讯云能力配置 DNS。
- 使用一个无中间人工审阅点的 Goal，在 Proposal 确认后连续完成采集、设计、实现、验证、发布和域名迁移。
- 网站必须有酷炫但有意义的交互界面，并以真实项目和个人内容为依据。
- `Workspace/Hypo/Hypo-Writer` 中的微信公众号内容不能缺失，必须作为正式写作内容源进入网站。
- 公众号必须是一级页面；日报按 `daily issue → news items[]` 组织，每天有一个独立日期页，日期页内部显示当天约 10 条新闻卡片；其他文章拥有独立详情，具体页面分配依据公众号原分类和实际内容。
- Goal 后续连续执行，不等待中间确认。

## 已作决定

- 身份定位为“研究者 + 系统构建者”，中英双语，采用 Research Instrument 视觉方向。
- 内容采用“精选主页 + 完整档案”；首页为 Identity、Current Field、Selected Systems、Research Trajectory、Writing & Notes、Beyond Systems/About 六区。
- 真实姓名与 `Hypoxanthine` 在首屏同等呈现。
- 写作、诗词和乒乓球等非研究内容拥有首页独立精选区。
- 第一版可广泛利用个人笔记、项目与归档，不对普通个人信息保守筛选，但仍排除凭据、他人私人信息和受合作/投稿约束的材料。
- `hypox.cn` 为主域，`hypoxanthine.cn` 保留并跳转到新域。

## 接受与拒绝

- 用户接受推荐的身份权重、Research Instrument、双语与内容深度方案。
- 用户接受 Hypoxanthine 与真实姓名同权、人格内容独立一屏、旧域保留跳转。
- 用户已选择“确认并开始”，授权执行完整 Goal 及 Proposal 中列明的生产发布与 DNS 业务记录修改。
- 用户授权主模型依据公众号的实际分类自主分配页面形态，并再次明确不设置中间等待点。

## 纠正与分歧

- 用户明确纠正：已经从神经渲染转向低温 GPU。此前把 neural rendering 放在当前研究主线的方案作废。
- 当前研究应准确表达为 77 K cryogenic GPU 的 evidence-guided design-space exploration；neural rendering 仅作为历史研究演化与既往成果。
- 用户在开始执行前纠正内容范围：此前仅以泛化的 Writing & Notes 表达不足，Hypo-Writer 中的公众号文章是不可遗漏的核心内容。
- 用户进一步纠正日报层级：不是“一天一张卡片”，而是“一天一个页面，页面内一条新闻一张卡片”。

## 已核实现状

- GitHub Pages 仓库使用 Astro 5、TypeScript、MDX 与 Tailwind，已有文章、笔记、项目、论文、课程与关于页面，旧 Hexo 历史已归档。
- GitHub、GitLab 和 Eden `/home/heyx/Hypo-Database` 均可只读访问；资料规模足以支撑内容策展。
- Hermes 中存在腾讯云 `tcapi` Skill，`tccli` 与 `hypohub` profile 可读 DNSPod；两个域名都在同一账户且当前仅有系统 NS 记录。

## 未决问题

- 无阻断性产品问题；Goal 已获开始授权。
