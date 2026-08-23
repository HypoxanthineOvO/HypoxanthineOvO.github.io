---
kind: cycle
name: C001-personal-site-rebuild
status: active
started: 2026-08-23
updated: 2026-08-23
builds_on: []
plan: PLAN.md
progress: PROGRESS.md
execution: EXECUTION.md
---

# Personal Site Rebuild and Launch

## 本轮目的

基于可核验的个人资料、项目、研究与长期写作，重建并发布一个以低温 GPU 研究者和系统构建者为核心身份的中英双语个人网站。网站以 `hypox.cn` 为主域，保留 `hypoxanthine.cn` 跳转，并以统一的 Research Instrument 交互语言形成鲜明、可用、可维护的个人数字档案。

## 执行边界

本 Cycle 包含证据采集与内容策展、现有 Astro 网站重构、交互与 3D 实现、旧内容与 URL 兼容、全面验证、GitHub Pages 生产发布及 DNSPod 域名配置。凭据、第三方私人信息、实验室或合作者约束下不可公开的材料不进入网站；不修改资料源仓库或 Hypo-Database。

## 验证目标

代码检查与静态构建通过；桌面与移动端的页面、3D canvas、交互、双语路由、可访问性和旧链接经自动化与截图验证；GitHub Pages 部署成功；`hypox.cn` 在 HTTPS 下可访问且 `www` 与旧域按计划跳转；公开内容无明显凭据或受限材料。

## 关联

- 现有 GitHub Pages 仓库 `HypoxanthineOvO/HypoxanthineOvO.github.io` 及其 `hexo-legacy` 历史。
- Eden `/home/heyx/Hypo-Database`、本机 Workspace/Archive、GitHub 与 GitLab 项目作为只读资料源。
- 腾讯云 DNSPod `hypohub` profile 和 Hermes `tcapi` Skill 作为域名配置入口。
