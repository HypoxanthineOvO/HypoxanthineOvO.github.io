# REBUILD G 报告

## 1. 分支与提交列表

- 工作分支：`refactor/series-tags-ia`
- 本地提交，未 push

| 顺序 | Commit | 说明 |
| --- | --- | --- |
| 1 | `7341d75` | `feat(schema): add series/archived/project-log fields to posts+notes` |
| 2 | `1be71c0` | `refactor(content): remigrate 29 legacy entries to series + new tags` |
| 3 | `b34912a` | `chore(content): remove 4 deprecated cheatsheets/guide` |
| 4 | `89e32ce` | `feat(routes): add /series and /projects/[slug]/log routes` |
| 5 | `da5876e` | `feat(ui): series badges, tag chips, CourseCard, chinese nav` |
| 6 | `b727daa` | `fix(rss): exclude archived from feed` |

## 2. 29 篇 legacy 的 series 分布统计

| series | 数量 |
| --- | ---: |
| `tooling-env` | 6 |
| `tooling-hardware` | 2 |
| `research-nerf` | 3 |
| `research-essay` | 2 |
| `poetry` | 3 |
| `essay` | 4 |
| `humanities` | 9 |

校验：

- 总数：`29`
- 统计和：`6 + 2 + 3 + 2 + 3 + 4 + 9 = 29`
- `tooling-ops` / `research-cryo` / `project-log` 当前为空，但 `/series/<slug>` 占位页已生成

## 3. 样本 frontmatter 新旧对比

### 样本 A：`src/content/notes/cuda.mdx`

旧：

```yaml
title: "【环境配置】CUDA环境配置"
date: 2024-02-26
description: "..."
tags:
  - "tooling-notes"
```

新：

```yaml
title: "【环境配置】CUDA环境配置"
date: 2024-02-26
description: "..."
series: "tooling-env"
tags:
  - "cuda"
  - "nvidia"
  - "toolchain"
  - "windows"
  - "linux"
```

### 样本 B：`src/content/posts/灯河.mdx`

旧：

```yaml
title: "【高中作品小记】江城忆（二） 灯河"
date: 2021-02-20
description: "..."
tags:
  - "literary-essay"
```

新：

```yaml
title: "【高中作品小记】江城忆（二） 灯河"
date: 2021-02-20
description: "..."
series: "essay"
tags:
  - "prose"
  - "city"
  - "memory"
```

## 4. 删除的 4 个文件历史片段

说明：

- 当前仓库历史里，这 4 个文件的删除已经存在于更早的提交 `934e5e6`。
- 因此本轮的 `b34912a` 是一个空 checkpoint，用来保留回滚边界；没有再重复制造一次假的删除 diff。

`git log --diff-filter=D --summary -- <4 paths>` 片段：

```text
commit 934e5e6187ba1a359765f20f30082ca5c4f98bbe
Author: HypoxanthineOvO <heyx2025@shanghaitech.edu.cn>
Date:   Sun Apr 19 14:32:08 2026 +0000

    pub: add SCAR ISCAS 2026 paper

 delete mode 100644 src/content/notes/cheatsheet.mdx
 delete mode 100644 src/content/notes/final-cheatsheet.mdx
 delete mode 100644 src/content/notes/midterm-cheatsheet.mdx
 delete mode 100644 src/content/posts/笔记本电脑选购指南.mdx
```

## 5. 验证结果

### 5.1 双绿

- `pnpm check`
  - 结果：`0 errors / 0 warnings`
  - 备注：仍有既有迁移脚本的 `6 hints`，不影响交付
- `pnpm build`
  - 结果：通过

### 5.2 本地路由 sweep

- `/` -> `200`
- `/series` -> `200`
- `/series/tooling-env` -> `200`
- `/series/research-cryo` -> `200`
- `/series/project-log` -> `200`
- `/series/humanities` -> `200`
- `/projects/hypo-wtt` -> `200`

### 5.3 cheerio / dist 断言

`dist/series/index.html` 中文 series 名称：

- `环境与工具链`：命中
- `运维与部署`：命中
- `硬件与仿真`：命中
- `神经渲染研究`：命中
- `冷冻计算与 AI 加速`：命中
- `研究随笔`：命中
- `项目日志`：命中
- `散文`：命中
- `诗词`：命中
- `人文课程（锁库）`：命中

10 个系列页文件存在：

- `dist/series/tooling-env/index.html`
- `dist/series/tooling-ops/index.html`
- `dist/series/tooling-hardware/index.html`
- `dist/series/research-nerf/index.html`
- `dist/series/research-cryo/index.html`
- `dist/series/research-essay/index.html`
- `dist/series/project-log/index.html`
- `dist/series/essay/index.html`
- `dist/series/poetry/index.html`
- `dist/series/humanities/index.html`

项目页保留验证：

- `dist/projects/hypo-wtt/index.html`：命中 `乒乓球`

新 tag 页存在：

- `dist/tags/python/index.html`
- `dist/tags/nerf/index.html`
- `dist/tags/prose/index.html`

旧 7 tag 页不存在：

- `dist/tags/literary-essay/index.html`
- `dist/tags/gpu-research/index.html`
- `dist/tags/tooling-notes/index.html`
- `dist/tags/course-material/index.html`
- `dist/tags/engineering-practice/index.html`
- `dist/tags/creative-writing/index.html`
- `dist/tags/lecture-notes/index.html`

首页中文导航断言：

- `系列`：命中
- 英文 `Series`：未命中

全仓 frontmatter grep：

- 旧 7 tag 值：`0` 命中

## 6. 额外说明

- `projects` collection 保持原样，11 个真实项目卡未被覆盖。
- `publications` collection 未改 schema，也未改内容。
- `About / Hero / Footer / 署名` 未改；`src/lib/site.ts` 仅调整了导航数组。
- `project-log` 与 `research-cryo` 当前没有内容，但 `/series/project-log` 与 `/series/research-cryo` 均会正常生成“暂无内容”占位页。
- `/projects/[slug]/log` 仅对存在 log 的项目生成；当前无 log，因此不会生成任何该类页面，符合“无内容则 404”的约束。

## 7. 待人工项

- None
