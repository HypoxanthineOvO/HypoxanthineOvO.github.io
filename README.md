# 飘零 · Hypoxanthine

贺云翔的个人站点，发布于 [hypox.cn](https://hypox.cn)。Astro 静态站 + GitHub Pages。

站点结构与设计约定见 [DESIGN.md](./DESIGN.md)（v2）：首页是品牌总入口，分区为内容 / 项目 / 研究 / 写作 / 关于。

```bash
pnpm install
pnpm dev      # 本地开发
pnpm check    # 类型检查
pnpm build    # 构建到 dist/

# 验收（先起本地服务）
python3 -m http.server 4173 -d dist
node scripts/validate-site.mjs       # 结构与交互断言
python3 scripts/check-dist-links.py  # dist 内链检查
node scripts/shoot-site.mjs          # 全页截图到 shots/
```

## 日常维护

- **发新内容**：在 `src/content/media/` 加一个 Markdown 文件（`kind: video | article`）。只有放进这里的条目才会上网站。
- **项目**：`src/content/projects/` 里 `featured: true` 且有 `group` 的条目上首页；`tier: stable` 才生成详情页，其余卡片直接链到 GitHub。
- **首页的非集合数据**（最近动态、Minecraft 截图、群像名牌、研究现状）在 `src/data/home.ts`。
- **平台账号**在 `src/lib/site.ts` 的 `platforms`。
- **图标**：`mocks/icons/` 存原图、统一风格说明 `STYLE.md` 和逐项提示词 `prompts.tsv`，用 Codex 图像生成；网站用 `public/media/icons/*.webp`。
- 旧地址（公众号「阅读原文」`/wechat/articles/*`、`/publish`、`/notes`、`/archive` 等）由 `astro.config.mjs` 生成跳转。
