# Hypoxanthine

贺云翔的个人站点，发布于 [hypox.cn](https://hypox.cn)。Astro 静态站 + GitHub Pages。

整站按 [DESIGN.md](./DESIGN.md) 的契约重建：七扇领域门（研究 / 项目 / 散文 / 诗词 / 发布 / 学习档案 / 技术笔记）+ 首页卡片墙 + 总档案。

```bash
pnpm install
pnpm dev      # 本地开发
pnpm check    # 类型检查
pnpm build    # 构建到 dist/

# 验收（先起本地服务）
python3 -m http.server 4173 -d dist
node scripts/validate-site.mjs   # 结构与交互断言
python3 scripts/check-dist-links.py  # dist 内链检查
node scripts/shoot-site.mjs      # 全页截图到 shots/
```

- 旧 URL 由 `astro.config.mjs` 按内容目录自动生成重定向（含公众号"阅读原文"深链 `/wechat/articles/*`）
- 技术笔记重写中：14 篇旧笔记保持 draft，`PREVIEW_DRAFTS=1 pnpm build` 可本地预览
- 生产域名与 Pages 自定义域均为 `https://hypox.cn`
