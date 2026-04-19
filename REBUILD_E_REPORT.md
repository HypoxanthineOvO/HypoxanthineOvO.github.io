# REBUILD_E_REPORT

生成时间：2026-04-19T11:36:00Z  
状态：local-only complete, not pushed

## 1. 署名修改位置清单

| 位置 | 修改 |
| --- | --- |
| `src/lib/site.ts` | `author` 改为 `Yunxiang He`，`tagline` 改为 `Hypoxanthine (Yunxiang He)`，站点描述改为中文，头像路径改为 `/avatar.jpg` |
| `src/components/Header.astro` | Header 左侧品牌改为 `Hypoxanthine / Yunxiang He` |
| `src/components/Hero.astro` | Hero 展示 `Hypoxanthine (Yunxiang He)`，正文补充真名与网名关系 |
| `src/pages/about.astro` | About 页改为真名 + 网名轻量介绍，并明确 GitHub handle 保留 `HypoxanthineOvO` |
| `src/components/Footer.astro` | Footer copyright 固定为 `© 2026 Yunxiang He` |
| `src/layouts/BaseLayout.astro` | `<meta name="author">` 改为 `Yunxiang He` |
| `src/pages/rss.xml.js` | RSS `description` 改中文，`customData` 增加 `<author>Yunxiang He</author>` |
| `src/content/publications/*.md` | academic 条目中的作者名统一替换为 `Yunxiang He` |

## 2. 头像 / favicon 生成方式

- 生成文件：
  - `public/avatar.jpg`
  - `public/apple-touch-icon.png`
  - `public/favicon.svg`
- 占位策略：
  - `avatar.jpg` 与 `apple-touch-icon.png` 由现有 `public/avatar.png` 派生生成
  - `favicon.svg` 使用简洁的字母 `Y` 图形占位
- 实现方式：
  - 新增 `scripts/generate-identity-assets.mjs`
  - 为了在本地可重复生成位图，占位引入两个轻量 dev 依赖：`jpeg-js`、`pngjs`
- 引用位置：
  - Hero 小头像：`src/components/Hero.astro`
  - About 主头像：`src/pages/about.astro`
  - `<head>` 里的 favicon / apple touch icon：`src/layouts/BaseLayout.astro`
- 后续替换方式：
  - 用户后续只需用真实头像覆盖同名 `public/avatar.jpg`
  - 如需同步 Apple Touch Icon，可重跑脚本或直接覆盖 `public/apple-touch-icon.png`

## 3. Projects Schema 变更 + 11 个项目清单

### Schema

文件：`src/content/config.ts`

- `status` 改为 `z.enum(["active", "wip", "archived", "internal"])`
- 新增 `githubUrl`
- 新增 `emoji`
- `tech` 改为可选数组默认空数组
- 保留 `featured`
- 移除旧 stub 时代的 `repo` / `link` / `order` 依赖

### 路由与渲染

- `src/pages/projects/index.astro`
  - 按状态分区：`active -> wip -> archived -> internal`
- `src/components/ProjectCard.astro`
  - 显示 `emoji + name + description + 中文状态 badge + GitHub icon`
- `src/pages/projects/[slug].astro`
  - 新增项目详情页，满足 `/projects/hypo-agent` 级别路由验证

### 11 个项目确认清单

| slug | name | status |
| --- | --- | --- |
| `hypo-agent` | Hypo-Agent | `active` |
| `hypo-bill` | Hypo-Bill | `active` |
| `hypo-coder` | Hypo-Coder | `active` |
| `hypo-emoji` | Hypo-Emoji | `active` |
| `hypo-homework` | Hypo-Homework | `active` |
| `hypo-info` | Hypo-Info | `active` |
| `hypo-latex` | Hypo-LaTeX | `active` |
| `hypo-llm` | Hypo-LLM | `wip` |
| `hypo-marp` | Hypo-Marp | `active` |
| `hypo-thesis` | Hypo-Thesis | `active` |
| `hypo-wtt` | Hypo-WTT | `active` |

## 4. UI 中文化 Translation Table

| 原文 | 译文 | 文件位置 |
| --- | --- | --- |
| `Posts / Notes / Publications / Projects / About` | `文章 / 笔记 / 发表 / 项目 / 关于` | `src/lib/site.ts` |
| `Short Context` | `站点说明` | `src/pages/index.astro` |
| `Read more / View all` | `阅读全文 / 查看全部` | `src/pages/index.astro` |
| `Featured Publications / Featured Projects` | `精选发表 / 精选项目` | `src/pages/index.astro` |
| `Recent Posts / Recent Notes` | `最新文章 / 最新笔记` | `src/pages/index.astro` |
| `Posts` | `文章` | `src/pages/posts/index.astro`, `src/layouts/PostLayout.astro` |
| `Notes` | `笔记` | `src/pages/notes/index.astro`, `src/layouts/NoteLayout.astro` |
| `Publications` | `发表` | `src/pages/publications/index.astro`, `src/pages/publications/[slug].astro` |
| `Projects` | `项目` | `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro` |
| `Newer / Older` | `更新 / 更早` | `src/layouts/PostLayout.astro`, `src/layouts/NoteLayout.astro` |
| `Prev / Next` | `上一页 / 下一页` | `src/components/Pagination.astro` |
| `Table of Contents / Contents` | `目录` | `src/components/TOC.astro` |
| `Not Found / The page you were looking for is not in this rebuild.` | `页面未找到 / 你访问的页面不在当前重建版本中。` | `src/pages/404.astro` |
| `All notes / No notes match the current tag.` | `全部笔记 / 无匹配结果。` | `src/pages/notes/index.astro` |
| `Tag cloud for post tags only.` | `仅针对文章的标签云。` | `src/pages/tags/index.astro` |
| `Tag: X / Posts tagged X` | `标签：X / 标签「X」下的文章` | `src/pages/tags/[tag].astro` |
| `Updated` | `更新于` | `src/layouts/PostLayout.astro` |
| `Source / Authors / Source Link` | `来源 / 作者 / 原文链接` | `src/layouts/NoteLayout.astro` |
| `Built with Astro` | `基于 Astro 构建` | `src/components/Footer.astro` |
| RSS channel description | `Yunxiang He 的文章与笔记更新。` | `src/pages/rss.xml.js` |

说明：

- tag slug 没有被翻译，页面展示继续使用原始 slug，例如 `literary-essay`、`gpu-research`
- GitHub / RSS 名称保持英文

## 5. 验证结果

### 5.1 `astro check`

命令：`pnpm astro check`

结果：

```text
Result (44 files):
- 0 errors
- 0 warnings
- 6 hints
```

### 5.2 `pnpm build`

命令：`pnpm build`

结果：通过  
补充：构建尾部仍有既有 KaTeX strict-mode 提示，但不影响产物生成

### 5.3 本地路由 sweep（`pnpm dev`）

通过的路由：

- `/`
- `/posts`
- `/notes`
- `/publications`
- `/projects`
- `/about`
- `/courses`
- `/tags`
- `/rss.xml`
- `/posts/婉约词中的风骨`
- `/posts/智能的逆流与边界`
- `/posts/灯河`
- `/notes/final-cheatsheet`
- `/notes/辐射场中的显式表达和隐式表达`
- `/notes/paper-neurex`
- `/publications/density-estimation-effective-sampling-strategy`
- `/projects/hypo-agent`

补充检查：

- `dist/sitemap-index.xml` 已在 build 产物中生成
- `http://127.0.0.1:4321/tags/literary-essay` 返回 200

### 5.4 DOM 校验

由于本机 Playwright 缺少系统动态库 `libasound.so.2`，本轮改用仓库已安装的 `cheerio` 做静态 DOM 校验。

校验结果：

- Header nav 文案：`文章 / 笔记 / 发表 / 项目 / 关于`
- Footer 文案包含：`© 2026 Yunxiang He`
- `/projects` 卡片数：`11`
- 每张项目卡片均存在：
  - emoji
  - 中文状态 badge
  - GitHub 链接
- `/about` 页头像：
  - `img src="/avatar.jpg"`
  - DOM 中命中 1 次
- favicon：
  - `/favicon.svg` -> 200
  - `/apple-touch-icon.png` -> 200

## 6. 已知非阻断问题

- `https://github.com/HypoxanthineOvO/Hypo-*` 当前全部是占位链接，未来可能 404，这是预期行为
- `pnpm dev` 模式下 `sitemap-index.xml` 不直接暴露；该文件在 `pnpm build` 后的 `dist/` 中已生成
- `/tags/gpu-research` 目前 404 是设计结果，不是 bug
  - 现有 tag 路由只索引 posts
  - `gpu-research` 只出现在 notes，不在 posts 中出现
- Playwright 浏览器在当前环境无法启动，根因是系统缺少 `libasound.so.2`；本轮已用 `cheerio` 完成等价静态 DOM 断言

## 7. 待人工项

- 用真实头像覆盖 `public/avatar.jpg`，必要时同步更新 `public/apple-touch-icon.png`
- 决定是否把 `/courses` 加进主导航
- 后续若需要真实 GitHub 仓库地址，直接替换 11 个项目文件中的 `githubUrl`
- About 页仍是轻量版，需要用户后续补正式 bio
- 如果未来希望 `/tags/*` 同时覆盖 notes，需要重新定义 tags 信息架构；本轮没有改动该设计

READY FOR HYPO REVIEW
