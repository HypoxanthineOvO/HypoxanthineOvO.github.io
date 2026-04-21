# REBUILD_H_REPORT

## 0. 说明

- 本轮工作基于分支 `refactor/series-tags-ia`，起点为 `88ff80d`。
- Prompt H 文案与当前分支存在一处现实差异：13 篇技术类 legacy 实际位于 `src/content/notes/`，而不是 `src/content/posts/`。
- 因此本轮按仓库真实结构执行：对 `notes` 中的 13 篇目标稿件添加 `draft: true`，并让全站 `posts + notes` 都走统一 draft 过滤。
- `/posts` 仍按 Prompt H 要求挂了 global 公告；真正受影响的条目列表页是 `/notes`，这一点在断言中已如实记录。

## 1. 5 个 commit 列表

1. `16054b0` `feat(schema): add draft field to posts and notes`
   - 为 `notes` schema 补齐 `draft` 字段，与 `posts` 对齐。
2. `3857f6f` `content: mark 13 legacy tech posts as draft for rewrite`
   - 将 13 篇技术类 legacy 笔记标为 draft，仅新增 `draft: true`。
3. `aaf5b15` `feat(build): filter draft entries globally with PREVIEW_DRAFTS escape hatch`
   - 抽出 `content-filter` helper，并让 `getPosts` / `getNotes` 统一走可见性过滤。
4. `18f757c` `feat(ui): add RewriteNotice banner on tech series pages`
   - 新增 `RewriteNotice`，挂到 `/posts` 和 6 个技术类 series 页顶部。
5. `本提交（提交后为当前 HEAD）` `test(cheerio): extend assertions for draft filter and rewrite notice`
   - 新增 cheerio 断言脚本、补 `REBUILD_H_REPORT.md`，并修正 preview escape hatch 的 `process.env` 读取与 RSS `entry.id` 链接。

## 2. 13 个 draft 文件的实际 slug 列表

说明：以下 slug 均来自 `src/content/notes/` 的实际文件名。

1. `c-and-cpp`
2. `cuda`
3. `latex`
4. `marp`
5. `python`
6. `ssh`
7. `前端仿真`
8. `testbench编写基础`
9. `paper-3dgaussian`
10. `paper-neurex`
11. `paper-rtnerfandinstant3d`
12. `辐射场中的显式表达和隐式表达`
13. `metax-gpu-ecosystem`

按系列分布：

- `tooling-env`：6 篇
- `tooling-hardware`：2 篇
- `research-nerf`：3 篇
- `research-essay`：2 篇

## 3. 2 篇 frontmatter 新旧对比

### 3.1 `src/content/notes/c-and-cpp.mdx`

旧：

```yaml
title: "【环境配置】C 与 C++ 的编译环境"
date: 2024-02-26
description: "..."
series: "tooling-env"
tags:
```

新：

```yaml
title: "【环境配置】C 与 C++ 的编译环境"
date: 2024-02-26
description: "..."
series: "tooling-env"
draft: true
tags:
```

### 3.2 `src/content/notes/metax-gpu-ecosystem.mdx`

旧：

```yaml
title: "【讲座笔记】从 0 开始构建 GPU 生态——以沐曦集成电路（MeTax）为例"
date: 2024-04-07
description: "..."
series: "research-essay"
tags:
```

新：

```yaml
title: "【讲座笔记】从 0 开始构建 GPU 生态——以沐曦集成电路（MeTax）为例"
date: 2024-04-07
description: "..."
series: "research-essay"
draft: true
tags:
```

## 4. cheerio 断言结果

说明：

- 默认 build：`pnpm build`
- preview build：`PREVIEW_DRAFTS=1 pnpm build`
- 断言脚本：`node scripts/assert-rebuild-h.mjs <default|source|preview>`

### 4.1 默认 build（draft 过滤生效）

- [x] `dist/notes/index.html` 不含 13 个 draft slug
- [x] `dist/series/tooling-env/index.html` 不含任何 draft slug
- [x] `dist/series/tooling-hardware/index.html` 不含任何 draft slug
- [x] `dist/series/research-nerf/index.html` 不含任何 draft slug
- [x] `dist/series/research-essay/index.html` 不含任何 draft slug
- [x] `dist/series/essay/index.html` 命中 4 篇
- [x] `dist/series/poetry/index.html` 命中 3 篇
- [x] `dist/rss.xml` 不含 13 个 draft slug
- [x] `dist/rss.xml` 含 essay / poetry 共 7 篇
- [x] `dist/series/tooling-env/index.html` 含公告关键字「正在重写中」
- [x] 6 个技术类 series 页都含公告关键字
- [x] `dist/index.html` 不含公告关键字（首页不挂）
- [x] `dist/series/humanities/index.html` 仍然可访问且含 9 篇

额外断言：

- [x] `dist/posts/index.html` 含 global 公告关键字

### 4.2 preview build（`PREVIEW_DRAFTS=1 pnpm build`）

- [x] `dist/series/tooling-env/index.html` 命中 6 篇
- [x] `dist/series/research-nerf/index.html` 命中 3 篇
- [x] `dist/rss.xml` 含 13 个 draft slug
- [x] 公告仍然显示（preview 模式不影响公告渲染）

### 4.3 源文件完整性

- [x] `src/content/notes/` 下 13 个 draft 源文件全部存在
- [x] 每个 draft 文件的 frontmatter 只新增了 `draft: true` 一行，其他字段未改
- [x] `git diff --name-only 88ff80d..HEAD` 不出现 `publications / projects / humanities / essay / poetry` 的 mdx

## 5. preview build 验证结果

- `PREVIEW_DRAFTS=1 pnpm build` 成功
- preview 模式下：
  - 13 个 draft note 详情页会重新出现在 `dist/notes/`
  - 技术类 series 页重新展示对应 legacy 条目
  - RSS 重新带回 13 个 draft 条目
  - 公告继续显示，不受 preview 开关影响

## 6. 未触达范围确认

- [x] 未改 `src/components/Hero.astro`
- [x] 未改 `src/pages/about.astro`
- [x] 未改 `src/lib/site.ts`
- [x] 未改 `src/content/publications/`
- [x] 未改 `src/content/projects/`
- [x] 未改 essay 4 篇 frontmatter
- [x] 未改 poetry 3 篇 frontmatter
- [x] 未改 humanities 条目的 `archived: true`
- [x] 未删除 13 篇源文件

## 7. 未解决的疑问

- 无阻断问题。
- 仅有一处需要在人工审阅时知晓的现实差异：Prompt H 写的是 `src/content/posts/`，但这条分支上的 13 篇目标技术稿实际位于 `src/content/notes/`。本轮已按仓库真实布局处理，并在断言与报告中同步反映。
