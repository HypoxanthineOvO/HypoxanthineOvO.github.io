# MIGRATION_PLAN

生成时间：2026-04-19T09:51:33.645Z
状态：dry-run only, no content files modified

> Codex dry-run plan for Prompt C. 审完这份计划后，再进入真正的内容迁移。

## 待用户确认

- `本科课程/CS130/Final-Cheatsheet.md`: 考试复习 / cheatsheet 明确属于 `course-material`，但 subcategory 无法自然落入四个目标桶；当前建议 tag / destination = course-material
- `本科课程/CS130/Midterm-Cheatsheet.md`: 考试复习 / cheatsheet 明确属于 `course-material`，但 subcategory 无法自然落入四个目标桶；当前建议 tag / destination = course-material
- `本科课程/CS182/Cheatsheet.md`: 考试复习 / cheatsheet 明确属于 `course-material`，但 subcategory 无法自然落入四个目标桶；当前建议 tag / destination = course-material
- `本科课程/Overview.md`: 课程索引页且含大量硬编码旧链接，更适合并入 `/courses` 页面而不是 note；当前建议 tag / destination = course-material
- `数字电路设计与实践/前端仿真.md`: 数字 IC 验证流程偏实现，但 VCS / Verdi 工具链成分也很重，`tooling-notes` 是合理备选；当前建议 tag / destination = engineering-practice
- `MyCourses.md`: 页面型索引 stub，更适合作为独立页面，而不是 dated content entry；当前建议 tag / destination = N/A
- `MyWorks.md`: 不是单篇文章，应拆成结构化的 publications 条目；末尾文学类发表需单独决定是否也进入 publications；当前建议 tag / destination = N/A
- `MyCourses.md`: Eden 上的事实源不是 git repo，无法用 `git log --follow` 恢复创建时间；`date` 只能先留 TODO，除非用户提供 canonical publish date；当前建议 tag / destination = course-material (only if kept as content)

## 1.1 categories → subcategory 映射

| File | Original categories | Proposed collection | Proposed subcategory | Final tags | Confidence | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 2021下半年-2022年诗词创作.md | 诗与词 | posts | literature-notes | creative-writing | high | 诗词合集属于直接创作产出 |
| 2023年诗词创作.md | 诗与词 | posts | literature-notes | creative-writing | high | 诗词合集属于直接创作产出 |
| 2024年诗词创作.md | 诗与词 | posts | literature-notes | creative-writing | high | 诗词合集属于直接创作产出 |
| 本科课程/CS130/Final-Cheatsheet.md | 本科课程 > CS130 | notes | TBD | course-material | medium | 考试复习 / cheatsheet 明确属于 `course-material`，但 subcategory 无法自然落入四个目标桶 |
| 本科课程/CS130/Midterm-Cheatsheet.md | 本科课程 > CS130 | notes | TBD | course-material | medium | 考试复习 / cheatsheet 明确属于 `course-material`，但 subcategory 无法自然落入四个目标桶 |
| 本科课程/CS182/Cheatsheet.md | 本科课程 > CS182 | notes | TBD | course-material | medium | 考试复习 / cheatsheet 明确属于 `course-material`，但 subcategory 无法自然落入四个目标桶 |
| 本科课程/Overview.md | 本科课程 | notes or page | TBD | course-material | low | 课程索引页且含大量硬编码旧链接，更适合并入 `/courses` 页面而不是 note |
| 常用技术笔记/C_And_CPP.md | 常用技术笔记 > 环境配置 | notes | engineering | tooling-notes | high | 环境配置 / 工具链工作流，适合 engineering + tooling-notes |
| 常用技术笔记/CUDA.md | 常用技术笔记 > 环境配置 | notes | engineering | tooling-notes | high | 环境配置 / 工具链工作流，适合 engineering + tooling-notes |
| 常用技术笔记/LaTeX.md | 常用技术笔记 > 环境配置 | notes | engineering | tooling-notes | high | 环境配置 / 工具链工作流，适合 engineering + tooling-notes |
| 常用技术笔记/Marp.md | 常用技术笔记 > 实用工具 | notes | engineering | tooling-notes | high | 环境配置 / 工具链工作流，适合 engineering + tooling-notes |
| 常用技术笔记/Python.md | 常用技术笔记 > 环境配置 | notes | engineering | tooling-notes | high | 环境配置 / 工具链工作流，适合 engineering + tooling-notes |
| 常用技术笔记/SSH.md | 常用技术笔记 | notes | engineering | tooling-notes | high | 环境配置 / 工具链工作流，适合 engineering + tooling-notes |
| 个人创作/高中作品小记/灯河.md | 散文 | posts | literature-notes | literary-essay | high | 完整散文作品，不是创作过程笔记 |
| 个人创作/高中作品小记/楼林.md | 散文 | posts | literature-notes | literary-essay | high | 完整散文作品，不是创作过程笔记 |
| 个人创作/人文课论文/不醒人之梦-创作小记.md | 文学论文 | posts | literature-papers | creative-writing | medium | 虽然放在“文学论文”目录下，但正文是创作产出，不是分析型论文 |
| 个人创作/人文课论文/马克思技术观在当代的应用和启示.md | 文学论文 | posts | literature-papers | literary-essay | high | 人文学科论文 / 读书报告 / 完整思想表达 |
| 个人创作/人文课论文/你见过停滞在空中的云吗.md | 文学论文 | posts | literature-papers | creative-writing | medium | 虽然放在“文学论文”目录下，但正文是创作产出，不是分析型论文 |
| 个人创作/人文课论文/宋词导读拍照配词.md | 文学论文 | posts | literature-papers | creative-writing | medium | 虽然放在“文学论文”目录下，但正文是创作产出，不是分析型论文 |
| 个人创作/人文课论文/宋词中的感性和理性.md | 文学论文 | posts | literature-papers | literary-essay | high | 人文学科论文 / 读书报告 / 完整思想表达 |
| 个人创作/人文课论文/婉约词中的风骨.md | 文学论文 | posts | literature-papers | literary-essay | high | 人文学科论文 / 读书报告 / 完整思想表达 |
| 个人创作/人文课论文/元代之后陆上丝绸之路凋敝的必然性.md | 文学论文 | posts | literature-papers | literary-essay | high | 人文学科论文 / 读书报告 / 完整思想表达 |
| 个人创作/人文课论文/智能的逆流与边界.md | 文学论文 | posts | literature-papers | literary-essay | high | 人文学科论文 / 读书报告 / 完整思想表达 |
| 个人创作/行见录/行见录-相逢篇.md | 散文 | posts | literature-notes | literary-essay | high | 完整散文作品，不是创作过程笔记 |
| 个人创作/行见录/行见录-遗憾篇.md | 散文 | posts | literature-notes | literary-essay | high | 完整散文作品，不是创作过程笔记 |
| 讲座笔记/MeTax-GPUEchoSystem.md | 讲座笔记 | notes | research | gpu-research | high | 用户已明确：MeTax / 沐曦内容只打 `gpu-research`，不打 `lecture-notes` |
| 教程/笔记本电脑选购指南.md | 常用技术笔记 | posts | engineering | tooling-notes | medium | 长篇导购指南更像 post 而非 note，但 taxonomy 仍归技术向 |
| 科研思考/辐射场中的显式表达和隐式表达.md | 科研思考 | notes | research | gpu-research | high | 研究导向明确，辐射场 / Neural Rendering 术语与 research notes 一致 |
| 科研思考/中国芯片的前世今生.md | 本科课程 > 毛概 | notes | research | gpu-research | medium | 芯片史 slide 风格课程产物；tag 倾向明确，但最终落到 notes 还是别的承载方式仍可复核 |
| 数字电路设计与实践/前端仿真.md | 数字电路设计与实践 > 工程 | notes | engineering | engineering-practice | medium | 数字 IC 验证流程偏实现，但 VCS / Verdi 工具链成分也很重，`tooling-notes` 是合理备选 |
| 数字电路设计与实践/Testbench编写基础.md | 数字电路设计与实践 > 工程 | notes | engineering | engineering-practice | high | 偏实现导向的数字 IC 文章 |
| MyCourses.md | N/A | page-like | TBD | N/A | low | 页面型索引 stub，更适合作为独立页面，而不是 dated content entry |
| MyWorks.md | N/A | publications split | TBD | N/A | medium | 不是单篇文章，应拆成结构化的 publications 条目；末尾文学类发表需单独决定是否也进入 publications |
| PaperReading/Paper-3DGaussian.md | Paper Reading | notes | research | gpu-research | high | Neural Rendering / Acceleration 方向的论文笔记 |
| PaperReading/Paper-NeuRex.md | Paper Reading | notes | research | gpu-research | high | Neural Rendering / Acceleration 方向的论文笔记 |
| PaperReading/Paper-RTNeRFAndInstant3D.md | Paper Reading | notes | research | gpu-research | high | Neural Rendering / Acceleration 方向的论文笔记 |

## 1.2 Page-like 文章目的地建议

### `about/index.md`

- 建议：`about/index.md` -> 作为 `src/pages/about.astro` 的内容替换源
- 理由：源文件本身就是 `layout: about` 的页面 stub，不是按时间归档的文章；Astro 现有 `/about` 路由与它天然对齐。
- 备选：保留手写的 `src/pages/about.astro` 结构，只把旧 front-matter 里的 `banner_img` 和标题语义当作参考素材。

### `MyCourses.md`

- 建议：`MyCourses.md` -> 新建独立页 `src/pages/courses.astro`
- 理由：正文是极短的课程索引 stub，且缺少 `date` 与 `categories`；硬塞进 posts / notes 会得到一篇信息量过低的 dated entry。做成独立页，也方便后续与 `本科课程/Overview.md` 合并。
- 备选：如果用户坚持一切都放 collection，可转成 notes 里的 index 型条目并打 `course-material`，但信息架构上弱于真正的页面。

### `MyWorks.md`

- 建议：`MyWorks.md` -> 拆成结构化 `src/content/publications/*.md` 条目，并按需要回链 `projects`
- 理由：文件本质上是 bibliography / publication list，而不是单篇文章；现有 publications schema 已经能承接 title / authors / venue / year / pdf 等结构化字段。
- 备选：如果用户希望先保留一个总览页，也可以先做 `/works` 页面，但仍建议把该文件当作 publications front-matter 的拆分源，而不是整篇迁成 post。

### `本科课程/Overview.md`

- 建议：`本科课程/Overview.md` -> 更适合并入未来 `/courses` 页面，而不是迁成 dated note
- 理由：它是课程索引和旧域名链接集合，不是独立文章；如果保留为 note，会把旧 Hexo permalink 假设继续带进新站。
- 备选：只有在用户明确要保留“旧课程总览页归档”时，才作为 note 迁入并打 `course-material`。

## 1.3 slug 规则

- 规则：保留中文；英文统一小写；空格与下划线转 `-`；去掉 FS 非法字符与明显展示性标点；默认使用文件 basename 生成 slug。
- 冲突处理：若 basename 冲突，则按 `-2`, `-3` 追加后缀。当前扫描范围内没有 basename 冲突。

| Original file | Planned slug |
| --- | --- |
| 2021下半年-2022年诗词创作.md | 2021下半年-2022年诗词创作 |
| 2023年诗词创作.md | 2023年诗词创作 |
| 2024年诗词创作.md | 2024年诗词创作 |
| 本科课程/CS130/Final-Cheatsheet.md | final-cheatsheet |
| 本科课程/CS130/Midterm-Cheatsheet.md | midterm-cheatsheet |
| 本科课程/CS182/Cheatsheet.md | cheatsheet |
| 本科课程/Overview.md | overview |
| 常用技术笔记/C_And_CPP.md | c-and-cpp |
| 常用技术笔记/CUDA.md | cuda |
| 常用技术笔记/LaTeX.md | latex |
| 常用技术笔记/Marp.md | marp |
| 常用技术笔记/Python.md | python |
| 常用技术笔记/SSH.md | ssh |
| 个人创作/高中作品小记/灯河.md | 灯河 |
| 个人创作/高中作品小记/楼林.md | 楼林 |
| 个人创作/人文课论文/不醒人之梦-创作小记.md | 不醒人之梦-创作小记 |
| 个人创作/人文课论文/马克思技术观在当代的应用和启示.md | 马克思技术观在当代的应用和启示 |
| 个人创作/人文课论文/你见过停滞在空中的云吗.md | 你见过停滞在空中的云吗 |
| 个人创作/人文课论文/宋词导读拍照配词.md | 宋词导读拍照配词 |
| 个人创作/人文课论文/宋词中的感性和理性.md | 宋词中的感性和理性 |
| 个人创作/人文课论文/婉约词中的风骨.md | 婉约词中的风骨 |
| 个人创作/人文课论文/元代之后陆上丝绸之路凋敝的必然性.md | 元代之后陆上丝绸之路凋敝的必然性 |
| 个人创作/人文课论文/智能的逆流与边界.md | 智能的逆流与边界 |
| 个人创作/行见录/行见录-相逢篇.md | 行见录-相逢篇 |
| 个人创作/行见录/行见录-遗憾篇.md | 行见录-遗憾篇 |
| 讲座笔记/MeTax-GPUEchoSystem.md | metax-gpuechosystem |
| 教程/笔记本电脑选购指南.md | 笔记本电脑选购指南 |
| 科研思考/辐射场中的显式表达和隐式表达.md | 辐射场中的显式表达和隐式表达 |
| 科研思考/中国芯片的前世今生.md | 中国芯片的前世今生 |
| 数字电路设计与实践/前端仿真.md | 前端仿真 |
| 数字电路设计与实践/Testbench编写基础.md | testbench编写基础 |
| MyCourses.md | courses |
| MyWorks.md | publications/* (split from myworks) |
| PaperReading/Paper-3DGaussian.md | paper-3dgaussian |
| PaperReading/Paper-NeuRex.md | paper-neurex |
| PaperReading/Paper-RTNeRFAndInstant3D.md | paper-rtnerfandinstant3d |

## 1.4 外链图片下载映射

- 仅覆盖外链图片；仓库内 `/files/*` 与 `/imgs/*` 不在此节下载范围。
- 目标落点统一为 `src/assets/images/<slug>/<filename>`。
- Markdown 图片改写计划：在迁移后的 `.mdx` 中用 `import imgX from "../../assets/images/<slug>/<filename>";`，再写成 `![alt](imgX.src)`。
- HTML `<img>` 改写计划：同样改成 `.mdx`，写为 `<img src={imgX.src} ... />`。

### `final-cheatsheet` — `本科课程/CS130/Final-Cheatsheet.md`

- 外链图片数（唯一 URL）：`32`
- 改写模式：当前是 Markdown 图片语法；若统一使用 import 方案，也建议转为 MDX
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet0.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet0.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet1.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet1.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet2.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet2.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet3.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet3.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet4.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet4.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet5.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet5.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet6.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet6.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet7.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet7.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet8.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet8.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet9.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet9.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet10.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet10.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet11.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet11.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet12.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet12.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet13.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet13.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet14.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet14.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet15.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet15.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet16.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet16.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet18.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet18.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet19.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet19.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet20.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet20.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet21.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet21.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet22.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet22.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet23.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet23.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet24.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet24.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet25.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet25.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet26.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet26.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet27.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet27.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet28.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet28.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet29.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet29.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet30.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet30.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet31.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet31.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/OS_Final_Cheatsheet32.png` → `src/assets/images/final-cheatsheet/OS-Final-Cheatsheet32.png`

### `midterm-cheatsheet` — `本科课程/CS130/Midterm-Cheatsheet.md`

- 外链图片数（唯一 URL）：`10`
- 改写模式：当前是 Markdown 图片语法；若统一使用 import 方案，也建议转为 MDX
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/Untitled.png` → `src/assets/images/midterm-cheatsheet/Untitled.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/Untitled%201.png` → `src/assets/images/midterm-cheatsheet/Untitled-1.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/Untitled%202.png` → `src/assets/images/midterm-cheatsheet/Untitled-2.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/Untitled%203.png` → `src/assets/images/midterm-cheatsheet/Untitled-3.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/Untitled%204.png` → `src/assets/images/midterm-cheatsheet/Untitled-4.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/Untitled%205.png` → `src/assets/images/midterm-cheatsheet/Untitled-5.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/Untitled%206.png` → `src/assets/images/midterm-cheatsheet/Untitled-6.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/Untitled%207.png` → `src/assets/images/midterm-cheatsheet/Untitled-7.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/Untitled%208.png` → `src/assets/images/midterm-cheatsheet/Untitled-8.png` (same URL referenced 2 times)
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/Untitled%209.png` → `src/assets/images/midterm-cheatsheet/Untitled-9.png`

### `cheatsheet` — `本科课程/CS182/Cheatsheet.md`

- 外链图片数（唯一 URL）：`16`
- 改写模式：当前是 Markdown 图片语法；若统一使用 import 方案，也建议转为 MDX
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/IML_Final_Cheatsheet0.png` → `src/assets/images/cheatsheet/IML-Final-Cheatsheet0.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/IML_Final_Cheatsheet1.png` → `src/assets/images/cheatsheet/IML-Final-Cheatsheet1.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/IML_Final_Cheatsheet2.png` → `src/assets/images/cheatsheet/IML-Final-Cheatsheet2.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/IML_Final_Cheatsheet3.png` → `src/assets/images/cheatsheet/IML-Final-Cheatsheet3.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/IML_Final_Cheatsheet4.png` → `src/assets/images/cheatsheet/IML-Final-Cheatsheet4.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/IML_Final_Cheatsheet5.png` → `src/assets/images/cheatsheet/IML-Final-Cheatsheet5.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/IML_Final_Cheatsheet6.png` → `src/assets/images/cheatsheet/IML-Final-Cheatsheet6.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/IML_Final_Cheatsheet7.png` → `src/assets/images/cheatsheet/IML-Final-Cheatsheet7.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/IML_Final_Cheatsheet8.png` → `src/assets/images/cheatsheet/IML-Final-Cheatsheet8.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/IML_Final_Cheatsheet9.png` → `src/assets/images/cheatsheet/IML-Final-Cheatsheet9.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/IML_Final_Cheatsheet10.png` → `src/assets/images/cheatsheet/IML-Final-Cheatsheet10.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/IML_Final_Cheatsheet11.png` → `src/assets/images/cheatsheet/IML-Final-Cheatsheet11.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/IML_Final_Cheatsheet12.png` → `src/assets/images/cheatsheet/IML-Final-Cheatsheet12.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/IML_Final_Cheatsheet13.png` → `src/assets/images/cheatsheet/IML-Final-Cheatsheet13.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/IML_Final_Cheatsheet14.png` → `src/assets/images/cheatsheet/IML-Final-Cheatsheet14.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/IML_Final_Cheatsheet15.png` → `src/assets/images/cheatsheet/IML-Final-Cheatsheet15.png`

### `c-and-cpp` — `常用技术笔记/C_And_CPP.md`

- 外链图片数（唯一 URL）：`3`
- 改写模式：当前是 Markdown 图片语法；若统一使用 import 方案，也建议转为 MDX
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/env.png` → `src/assets/images/c-and-cpp/env.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/env2.png` → `src/assets/images/c-and-cpp/env2.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/env3.png` → `src/assets/images/c-and-cpp/env3.png`

### `cuda` — `常用技术笔记/CUDA.md`

- 外链图片数（唯一 URL）：`1`
- 改写模式：当前是 Markdown 图片语法；若统一使用 import 方案，也建议转为 MDX
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/20240226122713.png` → `src/assets/images/cuda/20240226122713.png`

### `marp` — `常用技术笔记/Marp.md`

- 外链图片数（唯一 URL）：`2`
- 改写模式：当前是 Markdown 图片语法；若统一使用 import 方案，也建议转为 MDX
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/20240525134153.png` → `src/assets/images/marp/20240525134153.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/20240525134246.png` → `src/assets/images/marp/20240525134246.png`

### `ssh` — `常用技术笔记/SSH.md`

- 外链图片数（唯一 URL）：`4`
- 改写模式：当前是 Markdown 图片语法；若统一使用 import 方案，也建议转为 MDX
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/20240224154203.png` → `src/assets/images/ssh/20240224154203.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/20240224154611.png` → `src/assets/images/ssh/20240224154611.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/20240224154618.png` → `src/assets/images/ssh/20240224154618.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/20240224154809.png` → `src/assets/images/ssh/20240224154809.png`

### `元代之后陆上丝绸之路凋敝的必然性` — `个人创作/人文课论文/元代之后陆上丝绸之路凋敝的必然性.md`

- 外链图片数（唯一 URL）：`8`
- 改写模式：当前是 Markdown 图片语法；若统一使用 import 方案，也建议转为 MDX
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/20240222151749.png` → `src/assets/images/元代之后陆上丝绸之路凋敝的必然性/20240222151749.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/20240222151844.png` → `src/assets/images/元代之后陆上丝绸之路凋敝的必然性/20240222151844.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/20240222151855.png` → `src/assets/images/元代之后陆上丝绸之路凋敝的必然性/20240222151855.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/20240222151900.png` → `src/assets/images/元代之后陆上丝绸之路凋敝的必然性/20240222151900.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/20240222152030.png` → `src/assets/images/元代之后陆上丝绸之路凋敝的必然性/20240222152030.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/20240222152123.png` → `src/assets/images/元代之后陆上丝绸之路凋敝的必然性/20240222152123.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/20240222153008.png` → `src/assets/images/元代之后陆上丝绸之路凋敝的必然性/20240222153008.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/20240222153034.png` → `src/assets/images/元代之后陆上丝绸之路凋敝的必然性/20240222153034.png`

### `智能的逆流与边界` — `个人创作/人文课论文/智能的逆流与边界.md`

- 外链图片数（唯一 URL）：`3`
- 改写模式：当前是 Markdown 图片语法；若统一使用 import 方案，也建议转为 MDX
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/20240706131933.png` → `src/assets/images/智能的逆流与边界/20240706131933.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/20240706131950.png` → `src/assets/images/智能的逆流与边界/20240706131950.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/20240706132107.png` → `src/assets/images/智能的逆流与边界/20240706132107.png`

### `笔记本电脑选购指南` — `教程/笔记本电脑选购指南.md`

- 外链图片数（唯一 URL）：`1`
- 改写模式：当前是 Markdown 图片语法；若统一使用 import 方案，也建议转为 MDX
  - `https://pic2.zhimg.com/v2-d68ec9bffce1bdf4a9fc863a0431dca9_b.jpg` → `src/assets/images/笔记本电脑选购指南/v2-d68ec9bffce1bdf4a9fc863a0431dca9-b.jpg`

### `辐射场中的显式表达和隐式表达` — `科研思考/辐射场中的显式表达和隐式表达.md`

- 外链图片数（唯一 URL）：`2`
- 改写模式：当前是 Markdown 图片语法；若统一使用 import 方案，也建议转为 MDX
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/LightField.png` → `src/assets/images/辐射场中的显式表达和隐式表达/LightField.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/RadianceField.png` → `src/assets/images/辐射场中的显式表达和隐式表达/RadianceField.png`

### `testbench编写基础` — `数字电路设计与实践/Testbench编写基础.md`

- 外链图片数（唯一 URL）：`2`
- 改写模式：当前是 Markdown 图片语法；若统一使用 import 方案，也建议转为 MDX
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/TestbenchArch.png` → `src/assets/images/testbench编写基础/TestbenchArch.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/Example_Module.png` → `src/assets/images/testbench编写基础/Example-Module.png`

### `paper-3dgaussian` — `PaperReading/Paper-3DGaussian.md`

- 外链图片数（唯一 URL）：`2`
- 改写模式：当前是 Markdown 图片语法；若统一使用 import 方案，也建议转为 MDX
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/overview.png` → `src/assets/images/paper-3dgaussian/overview.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/Densify.png` → `src/assets/images/paper-3dgaussian/Densify.png`

### `paper-neurex` — `PaperReading/Paper-NeuRex.md`

- 外链图片数（唯一 URL）：`15`
- 改写模式：当前是 Markdown 图片语法；若统一使用 import 方案，也建议转为 MDX
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/Pipeline.png` → `src/assets/images/paper-neurex/Pipeline.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/NeRFWithNGP.png` → `src/assets/images/paper-neurex/NeRFWithNGP.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/NGPPara.png` → `src/assets/images/paper-neurex/NGPPara.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/NGPFeaturePipeline.png` → `src/assets/images/paper-neurex/NGPFeaturePipeline.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/LatencyBreakdown.png` → `src/assets/images/paper-neurex/LatencyBreakdown.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/HashTableAccess.png` → `src/assets/images/paper-neurex/HashTableAccess.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/Exeflow.png` → `src/assets/images/paper-neurex/Exeflow.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/rh.png` → `src/assets/images/paper-neurex/rh.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/arc.png` → `src/assets/images/paper-neurex/arc.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/SpeedOnGPU.png` → `src/assets/images/paper-neurex/SpeedOnGPU.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/SpeedUpPart.png` → `src/assets/images/paper-neurex/SpeedUpPart.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/RenderQuality.png` → `src/assets/images/paper-neurex/RenderQuality.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/ResImages.png` → `src/assets/images/paper-neurex/ResImages.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/SourceOfGain.png` → `src/assets/images/paper-neurex/SourceOfGain.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/bachgrid.png` → `src/assets/images/paper-neurex/bachgrid.png`

### `paper-rtnerfandinstant3d` — `PaperReading/Paper-RTNeRFAndInstant3D.md`

- 外链图片数（唯一 URL）：`9`
- 改写模式：包含 HTML <img>，迁移时应转为 MDX
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/2023-05-05-22-10-07.png` → `src/assets/images/paper-rtnerfandinstant3d/2023-05-05-22-10-07.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/2023-05-05-22-11-58.png` → `src/assets/images/paper-rtnerfandinstant3d/2023-05-05-22-11-58.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/nerfmodel.png` → `src/assets/images/paper-rtnerfandinstant3d/nerfmodel.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/tensorfprof.png` → `src/assets/images/paper-rtnerfandinstant3d/tensorfprof.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/tsnsorfprof-2080ti.png` → `src/assets/images/paper-rtnerfandinstant3d/tsnsorfprof-2080ti.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/tensorf-prof-legend.png` → `src/assets/images/paper-rtnerfandinstant3d/tensorf-prof-legend.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/effrendpipel.png` → `src/assets/images/paper-rtnerfandinstant3d/effrendpipel.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/vdro.png` → `src/assets/images/paper-rtnerfandinstant3d/vdro.png`
  - `https://raw.githubusercontent.com/HypoxanthineOvO/HypoImager/main/RTRes.png` → `src/assets/images/paper-rtnerfandinstant3d/RTRes.png`

## 1.5 Hexo 标签插件 → MDX 映射

- N/A。`MIGRATION_SCAN.md` 已确认 Hexo tag plugin 使用次数为 0，本阶段直接跳过。

## 1.6 失效链接处理

| Article | Line | Original | Suggested action |
| --- | --- | --- | --- |
| _posts/本科课程/CS130/Final-Cheatsheet.md | 617 | Cheatsheet-Final%20a3ede0b2d25945df9dd63986f8a9b2fb/Untitled%2017.png | 若无法从其他备份找回缺失导出的图片目录，则删除该坏图链，或在文中保留 TODO 注释说明资源缺失 |
| _posts/个人创作/人文课论文/宋词中的感性和理性.md | 74 | /files/宋词中的感性和理性.pdf | 若找不回附件，则把下载链接改成纯文本说明，例如“PDF 附件未在 Eden 事实源中找到” |
| _posts/个人创作/人文课论文/婉约词中的风骨.md | 96 | /files/婉约词中的风骨.pdf | 若找不回附件，则把下载链接改成纯文本说明，例如“PDF 附件未在 Eden 事实源中找到” |
| _posts/个人创作/人文课论文/元代之后陆上丝绸之路凋敝的必然性.md | 268 | /files/元代之后陆上丝绸之路凋敝的必然性.docx | 若无法补回附件，则删除该 Docx 条目，或改成 TODO 说明等待用户补件 |
| _posts/个人创作/人文课论文/元代之后陆上丝绸之路凋敝的必然性.md | 269 | /files/元代之后陆上丝绸之路凋敝的必然性.pdf | 若无法补回附件，则删除该 PDF 条目，或改成 TODO 说明等待用户补件 |
| _posts/MyWorks.md | 13 | /files/Papers/My-ISCAS2024.pdf | 改为 `/files/Papers/MY-ISCAS2024.pdf` 以匹配事实源中的真实文件名；若用户更想统一命名，再决定是否重命名源文件 |

## 1.7 front-matter 规范化

### 缺 tags 的 16 篇：建议 tag

| File | Current categories | Title | Excerpt basis | Suggested tags | Status |
| --- | --- | --- | --- | --- | --- |
| 2021下半年-2022年诗词创作.md | 诗与词 | 2021下半年-2022年诗词创作 | 诗词创作 离家 时至今日前事休，天南海北少年游。 漫漫长路从此始，不到云霄不回头。 西江月 来路云月渺渺，前路风雨茫茫。 独自可以对天酌，可怜无人相望。 相逢不过萍水，寓所更在他乡 | creative-writing | 推断 |
| 2023年诗词创作.md | 诗与词 | 2023 年诗词创作 | 序言 2023 年我并没有机会去写太多的内容。一方面是因为这一年真的很忙，另一方面是因为，在缺乏阅读的情况下，我总觉得没有文字回荡在自己的脑海里。所幸在年底上了宋词导读课，终于有时 | creative-writing | 推断 |
| 2024年诗词创作.md | 诗与词 | 2024 年诗词创作 | 序言 诗词创作 鹧鸪天·雪后小记 白雪攀上小红墙，且行且看且思量。 万籁俱寂浮云上，已似逍遥游四方。 身欢畅，意徜徉，风与月共诉衷肠。 君若似此三更雪，何惧输谁一段香？ 临江仙 晴 | creative-writing | 推断 |
| 个人创作/高中作品小记/灯河.md | 散文 | 【高中作品小记】江城忆（二） 灯河 | “这是沉没在灯河中的我们最后的幻想，企盼我们也有鱼跃龙门，水击三千里的那一天。” ——《灯河》 如果你在晚上登上一座有窗的楼来俯瞰街道，你会看到川流不息的灯光，像很多很多坠落于地的 | literary-essay | 推断 |
| 个人创作/高中作品小记/楼林.md | 散文 | 【高中作品小记】江城忆（一）楼林 | “他们怀念乡村的草木清新，殊不知我们在棱角分明的楼林间成长，回到原始而质朴的怀抱。”——《楼林》 武汉有个绰号叫“江城”，又有人说武汉是“百湖之城”。每当坐飞机飞向天河机场的时候， | literary-essay | 推断 |
| 个人创作/人文课论文/不醒人之梦-创作小记.md | 文学论文 | 【宋词导读 讨论课】《不醒人之梦》创作手记 | 《不醒人之梦》 作品链接 歌词 斗草阶前初见，穿针楼上的那一眼【斗草阶前初见，穿针楼上曾逢】 心字罗衣翩翩，只微笑便留住春天【小颦若解愁春暮。一笑留春春也住】 云随水歌声转，临镜一 | creative-writing | 推断 |
| 个人创作/人文课论文/马克思技术观在当代的应用和启示.md | 文学论文 | 【马克思主义基本原理】论文：马克思技术观在当代的应用和启示 | <center 马克思眼中的19世纪和我们的21世纪 ——马克思技术观在当代的应用和启示 </center 文本摘录 由于推广机器和分工，无产者的劳动已经失去了任何独立的性质，因而 | literary-essay | 推断 |
| 个人创作/人文课论文/你见过停滞在空中的云吗.md | 文学论文 | 【唐前诗文之美 创意写作】你见过停滞在空中的云吗？ | 你见过停滞在空中的云吗？ 你见过停滞在空中的云吗？ 我很喜欢站在上海科技大学东门的门口，向着外面的马路眺望。周边的几幢楼给门口围出了一片小小的空地。你站在那里张开手抬起头，就好像在 | creative-writing | 推断 |
| 个人创作/人文课论文/宋词导读拍照配词.md | 文学论文 | 【宋词导读 拍照配词】没有人记得，就没有人忘记 | 欲买桂花同载酒，终不似，少年游。 2021年6月23日的晚上，我在手机的便签中写下： 只有离开或消逝的事物才被冠以“故”字，因此，久别者才叫“故人”，离开后方为“故乡”。 直到和好 | creative-writing | 推断 |
| 个人创作/人文课论文/宋词中的感性和理性.md | 文学论文 | 【宋词导读 读书报告】宋词中的感性和理性 | 宋词中的感性与理性 在中国韵文的文学体式中，有一个传统：“文以载道”。这个传统也蔓延到诗上：我们说“温柔敦厚乃诗之教也”，诗天生就被赋予了一种教化的力量。或许正是因此，随着时代的发 | literary-essay | 推断 |
| 个人创作/人文课论文/婉约词中的风骨.md | 文学论文 | 【唐宋文学精华 期末论文】婉约词中的风骨 | 婉约词中的风骨 引言 起初的风骨只是一把中性的标尺。但随着时间的推移，我们逐渐把那种豪迈的、悲壮的诗歌当成了风骨的代表。或许是因为有那样多的好汉站在仁义之上，引吭高歌、奋笔疾书，写 | literary-essay | 推断 |
| 个人创作/人文课论文/元代之后陆上丝绸之路凋敝的必然性.md | 文学论文 | 【中华文明通论 期末论文】元代之后陆上丝绸之路凋敝的必然性 | Abstract 近年来，丝绸之路研究中，存在重汉唐、轻明清，重海路、轻陆路的倾向。对于丝绸之路的发展和繁盛，有相当多的论文从经济、政治、文化、宗教等各个角度对丝绸之路进行解构和分 | literary-essay | 推断 |
| 个人创作/人文课论文/智能的逆流与边界.md | 文学论文 | 【科技文明通论 期末论文】智能的逆流与边界 | 智能的逆流和边界：AI浪潮下的“为何”与“如何” 摘要：在 2023 年，由 OpenAI 推出的 ChatGPT 带来了人工智能的新时代，成为增长最快的网络平台之一。然而，这并不 | literary-essay | 推断 |
| 个人创作/行见录/行见录-相逢篇.md | 散文 | 【行见录】相逢篇 | “青春时节的相逢就是这样一个美好的事情，它足够热烈，是一瞬间绽放的烟火；又足够短暂，短暂到沉重的现实来不及侵入和玷污它就灰飞烟灭，消散在流逝的时光里，只剩下一抹浅浅的泡影。” —— | literary-essay | 推断 |
| 个人创作/行见录/行见录-遗憾篇.md | 散文 | 【行见录】遗憾篇 | 在盛夏的某个中午，人海浮沉，如泡沫的心思在阳光下消融，融入时间的尘埃里，没有人记得，也就没有人忘记。 遗憾是一种风吹不散，时间也无法侵蚀的东西。 再完满的爱意若没有维系也会随着时间 | literary-essay | 推断 |
| MyCourses.md | N/A | Our Courses! | Our Courses! SI100B EE Part CS100 VSP100 | course-material（仅当保留为 content 时） | TBD |

### tags 单字符串异常：原始串 → 规范化数组

| File | Original tag string | Split tokens | Normalized final tags | Status |
| --- | --- | --- | --- | --- |
| 讲座笔记/MeTax-GPUEchoSystem.md | 沐曦集成电路，GPU 生态 | 沐曦集成电路, GPU 生态 | gpu-research | 推断 |
| 科研思考/辐射场中的显式表达和隐式表达.md | Radiance Fields, Neural Rendering | Radiance Fields, Neural Rendering | gpu-research | 推断 |
| 数字电路设计与实践/前端仿真.md | 数字电路, 仿真, VCS, Verdi, | 数字电路, 仿真, VCS, Verdi | engineering-practice | TBD |
| 数字电路设计与实践/Testbench编写基础.md | 数字电路, 仿真 | 数字电路, 仿真 | engineering-practice | 推断 |
| PaperReading/Paper-3DGaussian.md | Neural Rendering, Architiecture, Hardware-Software Co-Design | Neural Rendering, Architiecture, Hardware-Software Co-Design | gpu-research | 推断 |
| PaperReading/Paper-NeuRex.md | Neural Rendering, Architiecture, Hardware-Software Co-Design | Neural Rendering, Architiecture, Hardware-Software Co-Design | gpu-research | 推断 |
| PaperReading/Paper-RTNeRFAndInstant3D.md | Neural Rendering, Architiecture, Hardware-Software Co-Design | Neural Rendering, Architiecture, Hardware-Software Co-Design | gpu-research | 推断 |

### 其他 front-matter 规则

- `MyCourses.md` 缺 `date`：当前 Eden 事实源不是 git repo，无法用 `git log --follow` 恢复首次提交时间；计划保留 `TODO`，待用户补 canonical date 或允许无日期 page 化。
- `MyCourses.md` / `MyWorks.md` 缺 `categories`：均视作 page-like / split-source，不补旧 categories。
- `mathjax: true` → `math: true`：适用于 `PaperReading/Paper-3DGaussian.md` 与 `科研思考/辐射场中的显式表达和隐式表达.md`。
- `sticky`、`index_img`、`banner_img`：不直接迁入 collections front-matter；仅在 page-like 或 UI 重写时按需人工吸收。
- `description`：默认从正文首个非标题段抽取 120-160 字，page-like 文件不自动抽 description。
- `draft`：默认 `false`；扫描阶段未发现需要保留为草稿的历史文章。
