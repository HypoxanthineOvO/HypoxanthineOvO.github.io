# MIGRATION_REPORT

生成时间：2026-04-19T10:32:00Z  
状态：stage 3 report complete, local commits only, no push performed

## 1. 迁移结果

- 成功迁移：33 / 33
  - `posts`: 16
  - `notes`: 17
  - `publications`: 8（由 `MyWorks.md` 拆分）
- page-like 页面处理完成：
  - `MyCourses.md` + `本科课程/Overview.md` -> `src/pages/courses.astro`
  - `about/index.md` -> `src/pages/about.astro`
- skip：0

## 2. 图片与静态资源

- 外链图片下载：110 成功 / 0 失败
- 中文图片目录 fallback：0
  - `src/assets/images/...` 中保留了中文目录名；本轮 `astro check` 通过，因此未触发拼音化或 hash fallback
- 为保留旧站正文中的 `/files/*` 与 `/imgs/*` 资源路径，额外复制了 legacy 静态资源：
  - `public/files/**/*`
  - `public/imgs/**/*`
  - 共 81 个文件
- 失败图片明细：无

## 3. Publications Schema / Commit

- schema 扩展 commit：`fbe8242` `feat(publications): add kind-based publication schema`
- 正式迁移 commit：`1284141` `feat: migrate legacy hexo content`

## 4. 失效链接处理结果

- `_posts/MyWorks.md` 第 13 行：
  - `/files/Papers/My-ISCAS2024.pdf` 已定稿改为 `/files/Papers/MY-ISCAS2024.pdf`
  - 体现位置：`src/content/publications/density-estimation-effective-sampling-strategy.md`
- 以下 5 条失效资源均按用户决策改成 TODO HTML 注释 + 保留说明文本，没有直接删信息：
  - `本科课程/CS130/Final-Cheatsheet.md`
    - 缺失图片 -> `<!-- TODO: 资源缺失，待从备份补回 -->` + `（图片暂缺：原图文件待补回）`
  - `个人创作/人文课论文/宋词中的感性和理性.md`
    - 缺失 PDF -> `（附件暂缺：PDF 文件待补回）`
  - `个人创作/人文课论文/婉约词中的风骨.md`
    - 缺失 PDF -> `（附件暂缺：PDF 文件待补回）`
  - `个人创作/人文课论文/元代之后陆上丝绸之路凋敝的必然性.md`
    - 缺失 DOCX -> `（附件暂缺：DOCX 文件待补回）`
  - `个人创作/人文课论文/元代之后陆上丝绸之路凋敝的必然性.md`
    - 缺失 PDF -> `（附件暂缺：PDF 文件待补回）`

## 5. 待人工项

- `MyWorks.md` 拆出的 8 条 publications 已结构化落盘，但仍建议人工核对：
  - authors 顺序 / 缩写格式
  - venue 文案是否要完全按 IEEE/bibliography canonical 形式统一
  - `featured` 标记是否符合主页展示预期
- `/courses` 已生成，但当前未进 header 导航；如果需要提升可发现性，可后续决定是否加导航入口
- `/courses` 保留了 CourseBench / epan 等外部链接，建议人工确认这些链接是否仍为长期 canonical 地址
- `/about` 的旧源只有标题、layout 和 `banner_img`，因此当前页面仍是轻量重建版本，不是最终 biography
- 站内为兼容 legacy 绝对路径而复制了 `public/files` 与 `public/imgs`；若后续想进一步收敛仓库结构，可再评估是否把可公开资源做更细粒度整理

## 6. Astro Check 摘要

执行命令：`pnpm astro check`

结果：

```text
Result (41 files):
- 0 errors
- 0 warnings
- 6 hints
```

补充：

- 6 条 hints 全部来自辅助脚本里的未使用变量，不影响站点内容与页面类型检查通过：
  - `scripts/migrate-content.mjs`
  - `scripts/migration-plan.mjs`
  - `scripts/migration-scan.mjs`

## 7. 本轮实际落地范围

- 删除 Prompt B 遗留的 sample post / note / publication 占位内容
- 迁入 33 篇真实 legacy Markdown 到 `src/content/posts` 和 `src/content/notes`
- 将 `MyWorks.md` 拆成 8 条 `publications` collection 记录，并按 `kind = academic | literary` 适配现有 `/publications` 页面
- 生成 `src/pages/courses.astro`
- 重写 `/about` 为基于 legacy about stub 的最小可用版本
- 更新 landing / hero 文案，移除 Prompt B 残留占位描述
- 给 `NoteLayout` 注入 KaTeX CSS，以兼容迁入的数学 note

## 8. Post-merge build fix

- 触发背景：
  - 内容迁移阶段只跑了 `astro check`，没有补跑 `pnpm build`
  - push 到 `main` 后，GitHub Actions 在 build step 失败
- 本地复现：
  - 在仓库根目录执行 `pnpm build`
  - 完整失败输出与后续修复链已记录在 `BUILD_ERROR.log`
- root cause：
  - 不是图片路径、`kind` schema、tag 路由或 KaTeX 引用路径错误
  - 真正的问题是若干 legacy Markdown 在迁移成 `.mdx` 后仍保留了 **MDX 不兼容语法**
  - 具体包含四类：
    - HTML 注释 `<!-- ... -->` 出现在 `.mdx` 中
    - 原始 `<div>...</div>` 布局块嵌在 Markdown 列表流里，MDX 解析闭合关系失败
    - 原始 `<aside>...</aside>` callout 包裹列表，MDX 同样无法正确解析
    - 正文里的裸比较符号如 `<=1 FPS`、`> 0`、`< 0` 被 MDX 当作标签起始
- 修复动作：
  - 将缺失资源占位注释从 HTML comment 改成 MDX comment：`{/* ... */}`
  - 把 `paper-3dgaussian`、`paper-neurex` 中的 legacy `<div>` 网格块改写为纯 Markdown 结构
  - 把三份 cheatsheet note 里的 `<aside>` callout 改成 blockquote callout
  - 将会触发 MDX 词法冲突的比较符号包进 code span，或改回合法数学写法
  - 同步补强 `scripts/migrate-content.mjs`，避免未来重跑迁移时重新生成同类问题
- 修复结果：
  - `pnpm build` 已本地通过
  - 当前构建仍会打印若干 KaTeX strict-mode 提示，但不会导致构建失败

READY FOR HYPO REVIEW
