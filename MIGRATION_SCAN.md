# MIGRATION_SCAN

生成时间：2026-04-19T09:28:03.150Z
扫描源：`/home/heyx/Hypo-Website-source/source`
旧审计基线：`/home/heyx/Hypo-Website-source/CONTENT_AUDIT_REPORT.md`

## 1. 内容总览

- `_posts/` 递归 Markdown 文章：`36` 篇
- 非 `_posts/` Markdown 页面：`1` 个
- 页面清单：`about/index.md`

## 2. Front-matter 完整性

- 缺失 `date`：`1` 篇
  - `_posts/MyCourses.md:2` (`Our Courses!`)
- 缺失 `categories`：`2` 篇
  - `_posts/MyCourses.md:2` (`Our Courses!`)
  - `_posts/MyWorks.md:2` (`Overview Of My Research：我的科研工作一览`)
- 缺失 `tags`：`16` 篇
  - `_posts/2021下半年-2022年诗词创作.md:2` (`2021下半年-2022年诗词创作`)
  - `_posts/2023年诗词创作.md:2` (`2023 年诗词创作`)
  - `_posts/2024年诗词创作.md:2` (`2024 年诗词创作`)
  - `_posts/个人创作/高中作品小记/灯河.md:2` (`【高中作品小记】江城忆（二） 灯河`)
  - `_posts/个人创作/高中作品小记/楼林.md:2` (`【高中作品小记】江城忆（一）楼林`)
  - `_posts/个人创作/人文课论文/不醒人之梦-创作小记.md:2` (`【宋词导读 讨论课】《不醒人之梦》创作手记`)
  - `_posts/个人创作/人文课论文/马克思技术观在当代的应用和启示.md:2` (`【马克思主义基本原理】论文：马克思技术观在当代的应用和启示`)
  - `_posts/个人创作/人文课论文/你见过停滞在空中的云吗.md:2` (`【唐前诗文之美 创意写作】你见过停滞在空中的云吗？`)
  - `_posts/个人创作/人文课论文/宋词导读拍照配词.md:2` (`【宋词导读 拍照配词】没有人记得，就没有人忘记`)
  - `_posts/个人创作/人文课论文/宋词中的感性和理性.md:2` (`【宋词导读 读书报告】宋词中的感性和理性`)
  - `_posts/个人创作/人文课论文/婉约词中的风骨.md:2` (`【唐宋文学精华 期末论文】婉约词中的风骨`)
  - `_posts/个人创作/人文课论文/元代之后陆上丝绸之路凋敝的必然性.md:2` (`【中华文明通论 期末论文】元代之后陆上丝绸之路凋敝的必然性`)
  - `_posts/个人创作/人文课论文/智能的逆流与边界.md:2` (`【科技文明通论 期末论文】智能的逆流与边界`)
  - `_posts/个人创作/行见录/行见录-相逢篇.md:2` (`【行见录】相逢篇`)
  - `_posts/个人创作/行见录/行见录-遗憾篇.md:2` (`【行见录】遗憾篇`)
  - `_posts/MyCourses.md:2` (`Our Courses!`)

### 2.1 tag 字段异常格式

- 发现 `7` 篇 tag 仍是单字符串而非数组：
  - `_posts/讲座笔记/MeTax-GPUEchoSystem.md:5` → `沐曦集成电路，GPU 生态`
  - `_posts/科研思考/辐射场中的显式表达和隐式表达.md:5` → `Radiance Fields, Neural Rendering`
  - `_posts/数字电路设计与实践/前端仿真.md:6` → `数字电路, 仿真, VCS, Verdi,`
  - `_posts/数字电路设计与实践/Testbench编写基础.md:6` → `数字电路, 仿真`
  - `_posts/PaperReading/Paper-3DGaussian.md:5` → `Neural Rendering, Architiecture, Hardware-Software Co-Design`
  - `_posts/PaperReading/Paper-NeuRex.md:5` → `Neural Rendering, Architiecture, Hardware-Software Co-Design`
  - `_posts/PaperReading/Paper-RTNeRFAndInstant3D.md:5` → `Neural Rendering, Architiecture, Hardware-Software Co-Design`

## 3. 实际 categories 取值空间

- 扁平展开后共有 `15` 个 category token。

| Category | Files |
| --- | --- |
| 文学论文 | 8 |
| 常用技术笔记 | 7 |
| 本科课程 | 5 |
| 环境配置 | 4 |
| 散文 | 4 |
| 诗与词 | 3 |
| Paper Reading | 3 |
| 工程 | 2 |
| 数字电路设计与实践 | 2 |
| CS130 | 2 |
| 讲座笔记 | 1 |
| 科研思考 | 1 |
| 毛概 | 1 |
| 实用工具 | 1 |
| CS182 | 1 |

## 4. 实际 tags 取值空间

- 按 front-matter 原样统计共有 `12` 个 tag token / tag 串。

| Tag | Files |
| --- | --- |
| 环境配置 | 4 |
| CourseReview | 4 |
| Neural Rendering, Architiecture, Hardware-Software Co-Design | 3 |
| 常用技术 | 1 |
| 沐曦集成电路，GPU 生态 | 1 |
| 实用工具 | 1 |
| 数字电路, 仿真 | 1 |
| 数字电路, 仿真, VCS, Verdi, | 1 |
| 芯片 | 1 |
| 准备工作 | 1 |
| MyPapers | 1 |
| Radiance Fields, Neural Rendering | 1 |

## 5. Hexo 标签插件 `{% %}` 使用情况

- 本次重新扫描仍未发现 Hexo tag plugins。

## 6. 外链图片统计

- 外链图片总数：`111`
- 其中 HTML `<img>` 外链：`7`

| Domain | Count |
| --- | --- |
| raw.githubusercontent.com | 110 |
| pic2.zhimg.com | 1 |

## 7. 仓库内相对引用失效检测

- 已检查仓库内相对引用：`80` 条
- 可解析且目标存在：`74` 条
- 目标不存在：`6` 条

| File | Line | Kind | Target | Raw |
| --- | --- | --- | --- | --- |
| _posts/本科课程/CS130/Final-Cheatsheet.md | 617 | image | Cheatsheet-Final%20a3ede0b2d25945df9dd63986f8a9b2fb/Untitled%2017.png | ![Use main memory as “cache” for disk](Cheatsheet-Final%20a3ede0b2d25945df9dd63986f8a9b2fb/Untitled%2017.png) |
| _posts/个人创作/人文课论文/宋词中的感性和理性.md | 74 | link | /files/宋词中的感性和理性.pdf | - [PDF](/files/宋词中的感性和理性.pdf) |
| _posts/个人创作/人文课论文/婉约词中的风骨.md | 96 | link | /files/婉约词中的风骨.pdf | - [PDF](/files/婉约词中的风骨.pdf) |
| _posts/个人创作/人文课论文/元代之后陆上丝绸之路凋敝的必然性.md | 268 | link | /files/元代之后陆上丝绸之路凋敝的必然性.docx | - [Docx](/files/元代之后陆上丝绸之路凋敝的必然性.docx) |
| _posts/个人创作/人文课论文/元代之后陆上丝绸之路凋敝的必然性.md | 269 | link | /files/元代之后陆上丝绸之路凋敝的必然性.pdf | - [PDF](/files/元代之后陆上丝绸之路凋敝的必然性.pdf) |
| _posts/MyWorks.md | 13 | link | /files/Papers/My-ISCAS2024.pdf | - [点击下载](/files/Papers/My-ISCAS2024.pdf) |

## 8. 与 Windows 旧审计报告对照

| Metric | Windows Audit | Eden Source Scan | Delta |
| --- | --- | --- | --- |
| 文章总数 | 36 | 36 | 0.0% |
| 非 _posts 页面数 | 1 | 1 | 0.0% |
| 缺失 date | 1 | 1 | 0.0% |
| 缺失 categories | 2 | 2 | 0.0% |
| 缺失 tags | 16 | 16 | 0.0% |
| categories 取值数 | 15 | 15 | 0.0% |
| tags 取值数 | 12 | 12 | 0.0% |
| 外链图片总数 | 104 | 111 | 6.7% ↑ review |
| 失效仓库内引用 | 5 | 6 | 20.0% ↑ review |
| Hexo 标签插件次数 | 0 | 0 | N/A |

- 以下指标与 Windows 旧审计报告相比差异 ≥ 5%，或表现出新问题：
  - 外链图片总数：旧报告 104，本次 111，差异 6.7%
  - 失效仓库内引用：旧报告 5，本次 6，差异 20.0%

- 新发现 1 条大小写敏感环境下才会暴露的链接风险：`_posts/MyWorks.md` 指向 `/files/Papers/My-ISCAS2024.pdf`，而仓库内实际文件是 `source/files/Papers/MY-ISCAS2024.pdf`。Windows 下可能不暴露，Eden/Linux 下应视为失效引用。
- Hexo tag plugins 仍然为 0，说明正文主体依旧是标准 Markdown / HTML / 数学公式路径。
- 外链图片比 Windows 旧审计多出的 `7` 条，全部来自 `_posts/PaperReading/Paper-RTNeRFAndInstant3D.md` 内的 HTML `<img>` 外链；旧审计只统计了 Markdown 图片语法。

## 9. 备注

- 本阶段只做扫描，不做任何内容迁移。
- `~/Hypo-Website-source/` 未写入；所有结论基于只读扫描。
