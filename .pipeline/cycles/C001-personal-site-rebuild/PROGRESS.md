---
kind: progress
cycle: C001-personal-site-rebuild
plan: PLAN.md
status: active
updated: 2026-08-24T01:13:00+08:00
current: M6
next: 等待 GitHub Pages 证书签发，启用 HTTPS 并完成最终浏览器验收
---

# Personal Site Rebuild and Launch 进度

## 当前状态

M1-M4 已完成：网站已依据现有站、公开项目资料与 Hypo-Writer 重构；公众号成为一级栏目，日报采用 `daily issue → news items[]`；Research Instrument 视觉、Three.js 低温 GPU 场景、双语核心页、Work/Research/Archive/Search 与完整内容详情均已实现。构建、链接、canonical 和多视口浏览器回归全部通过。当前执行 M5 生产发布。

## 完整计划状态

| ID | 阶段 | 状态 | 当前结果 / 证据 | 下一步 |
| --- | --- | --- | --- | --- |
| `M1` | 证据盘点与内容策展 | `completed` | 核对现有站、GitHub/GitLab、项目资料与 Hypo-Writer；冻结研究主线、9 个项目、9 项发表、公众号与旧内容模型 | 已交付 M2 |
| `M2` | 设计系统与交互架构 | `completed` | Research Instrument 双表面设计、首页六区、核心中英路由、Three.js 场景与 Field/Index 交互已落实 | 已交付 M3 |
| `M3` | 网站与内容完整实现 | `completed` | 完成 98 期 AI 日报、10 篇公众号长文、15 篇旧文章、14 篇技术笔记及 Archive/Search/Series/Tags；构建共 248 页 | 已交付 M4 |
| `M4` | 浏览器质量验证与修正 | `completed` | Astro 0 errors；248 页 canonical 和内部链接 0 failures；Playwright 四视口与 canvas 检查 `failures: []` | 已交付 M5 |
| `M5` | GitHub Pages 生产发布 | `completed` | `4d36eb5` 已推送；Actions run `32650527649` build/deploy success；Pages custom domain 为 `hypox.cn` | 已交付 M6 |
| `M6` | DNS 迁移与端到端验收 | `in_progress` | 主域与 `www` DNS 已生效；旧域 redirect repo `221eed6` 已部署并生效；HTTP Host 路由验证通过 | 等待两个 GitHub Pages 证书签发并启用 HTTPS |

## 阻塞

- GitHub Pages 尚未签发 `hypox.cn` 与 `hypoxanthine.cn` custom-domain TLS 证书；DNS health 已确认 valid/served/HTTPS eligible。该外部队列可能最长需要 24 小时。

## 计划变化

- 用户补充 Hypo-Writer 公众号内容为硬性要求，并纠正日报为 `daily issue → news items[]` 两级模型；已扩展信息架构、M1、M3 与验证目标，不改变六阶段结构。

## 下一步

继续轮询两个 Pages 站点的证书；签发后设置 `https_enforced=true`，再验证 `https://hypox.cn`、`www` 与旧域跳转。
