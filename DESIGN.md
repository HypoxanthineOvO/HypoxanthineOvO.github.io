# hypox.cn 重设计说明

状态：已定稿（v1.1，2026-09-30），阶段零 mock 全部完成，进入正式实施

本文件是整站重建的设计契约。讨论阶段的全部决定都记录在这里，确认后按此实施；实施中要改设计，先改这里再改代码。本文可直接编辑。

## 1. 目标与访客

整站推倒重建，只做中文（删除 /en 与语言切换）。访客按优先级：

1. 我自己：回看旧作，全站浏览，按时间检索
2. 同行研究者：看代表作与研究脉络
3. 求职/申请评估者：快速了解工程能力，看项目卡片
4. 后辈学生：看随笔和技术笔记
5. 文学读者：看散文和诗词
6. 公众号读者：从"阅读原文"深链到文章页
7. 陌生访客：搜索引擎进入

## 2. 信息架构

### 2.1 七个领域门

| 门 | 路由 | 内容 | 列表页方向 |
|---|---|---|---|
| 研究 | `/research` | 学术发表（8 篇） | 严肃规整；论文当 demo 墙，每篇一张紧凑卡片 |
| 项目 | `/work` | 精选工程项目（只挑部分上墙） | 大卡片，悬浮感强 |
| 技术笔记 | `/notes` | 技术笔记（旧笔记待重写，初期稀疏） | 笔记本质感 |
| 散文 | `/essays` | 散文随笔（古典与现代两类子风格） | 轻纸感 |
| 诗词 | `/poetry` | 诗词合集（3 个合集） | 古意稍重，不用印章 |
| 发布 | `/publish`（定名"发布"） | 公众号长文 + AI 日报 + 未来知乎/B站/小红书内容 | 媒体感 |
| 学习档案 | `/study` | 人文课程论文、教评、文学发表、研究生总结，按学期排布 | 学期时间线 |

另有三个非门页面：`/`（首页）、`/about`（关于）、`/archive`（总档案）。

### 2.2 路由清理

- 新路由按上表执行，结构清晰优先
- 旧 URL 一律 301 重定向到新位置（Astro redirects 配置），特别是 `/wechat/articles/*`（公众号"阅读原文"已经在用）和 `/posts/*`、`/notes/*`
- 删除：`/en/*` 全部、`/series`、`/tags`、`/courses`、`/search`（并入 `/archive`）、`/projects`（并入 `/work`）、`/publications`（并入 `/research`）
- 删除 RewriteNotice（过期告示）与 series/tags 双轨分类体系，只保留门类这一层
- sitemap、RSS 随新结构更新；RSS 覆盖散文、诗词、笔记、发布门长文

### 2.3 数据层重整

- `projects`：合并 `src/data/portfolio.ts` 与 `src/content/projects/` 为单一内容集合。字段：name、description、featured（是否上墙）、cover（封面图）、status（active/wip/archived）、statusNote（自定义状态短语，如"自维护 agent core，每天在用"）、githubUrl、tech、正文（项目介绍）。开发日记继承现有 project-log 机制（kind/milestone/status/duration）
- `publications` 拆分：academic 留研究门；literary（"论中国古代诗词中的加餐"）移入学习档案
- `posts` 拆为 `essays` 与 `poetry` 两个集合；essays 增加 `style` 字段（`classical` / `modern`，默认 classical）控制子皮肤
- 新增 `study` 集合（学习档案）：按学期（`term` 字段）组织，类型含课程论文、教评、年度总结等
- `wechat` 集合与 `wechat-daily.json` 归入发布门，预留 `platform` 字段（wechat/zhihu/bilibili/xiaohongshu）
- 现有 14 篇技术笔记逐篇过：保留、重写或下架，实施时定

## 3. 首页

两段式：自我介绍区 + 卡片墙。

### 3.1 自我介绍区（顶部，严肃自述）

- 署名用真名"贺云翔"；Hypoxanthine 保留为站点品牌（域名、logo），不用于署名
- 隶属：上海科技大学 VSP Lab
- 研究方向两段式时态：已发表的用过去式（神经渲染加速器软硬件协同设计，论文为证）；进行中的明确说进行中（正把方向投向 77 K 低温 GPU 架构），不装完成时，不提未发表结果
- 图位：预留一个灵活位置，照片或头像都能装，素材后补
- 动态行：不讲主线，讲主线之外的兴趣"AI 与 Agent"，链到项目门
- 联系：GitHub、学校 email、B站、知乎、公众号（引流矩阵）
- 语气：实施时出 2-3 版文案供挑选

### 3.2 卡片墙（门厅）

- 注册表驱动：每扇门一条配置（slug、名称、weight、卡片皮肤、入口路由），首页自动渲染。加减门只改配置
- 卡片尺寸用相对分量（weight），布局算法按分量错位堆叠，保持舒服的高度节奏；不写死绝对尺寸
- 每张卡片风格截然不同（各自方言），但卡片解剖结构统一：眉标 + 标题 + 摘要 + 元信息 + 链接
- 桌面端一屏分成数块；移动端塌缩为单列
- 点击卡片进入对应门（整页跳转）

## 4. 皮肤系统（三层架构）

统一壳 + 多种内容方言的代码基础：

1. 壳层（全站共享）：导航、页宽、栅格、间距、字号阶梯、页脚。只认一套壳变量
2. 变量层（每门一套）：门内页面根节点挂 `data-skin="xxx"`，每门一个皮肤文件重定义一组 CSS 变量（字体、颜色、卡片底色、引用样式等）。每套皮肤给亮暗两组值。子皮肤同样机制（`essay-classical` / `essay-modern`）
3. 组件层（门内专属）：结构级差异不共享，如居中楷体引用、LaTeX 式论文版式、方格纸笔记

皮肤枚举：`research`、`engineering`（项目）、`notes`、`essay-classical`、`essay-modern`、`poetry`、`publish`、`study`、`paper`（论文详情）。

## 5. 各门规格

### 研究

- 列表：论文 demo 墙，紧凑卡片，不做重介绍
- 论文详情：一行式（题录 + 作者 + 会议 + 链接），PDF / code / bibtex 照旧；版式尝试 LaTeX 风格（`paper` 皮肤），不达标退回普通严肃版式

### 项目

- 卡片：封面图 + 项目名 + 状态灯 + 一句状态短语
- 详情页：
  - GitHub 信息卡：构建时烙快照（stars、最新 release、最近 push），页面加载时向 GitHub API 刷新一次，失败静默回退快照
  - 封面图：截图或 AI 生成图，精选项目各一张
  - 项目介绍：正文级段落（Markdown）
  - 状态灯：绿 = 活跃自用 / 黄 = 施工中 / 灰 = 归档，加每项目自定义状态短语
  - 开发日记：按时间线陈列 project-log 条目
- 未精选的项目：只进档案，不留"全部项目"列表（实施时确认）

### 技术笔记

- 栏目保留，内容待重写，初期稀疏
- 空状态诚实表述（"这个栏目在重写"级别的说明可以有，但不挂撒谎式横幅）

### 散文

- `classical` 子皮肤：纸色、宋体、轻纸纹、少量点缀色；引用为居中楷体加浅底色（不用左边色线加灰块）
- `modern` 子皮肤：中性冷静排版，社科期刊感，无纸纹
- 现有散文实施时逐篇分类，列表确认

### 诗词

- 独立成门；详情页居中排版（词尤其要居中），标题处理好，换行规则按词牌断句（上下阕分组）
- 古意稍重但不过度；印章暂不用，实施阶段可用 AI 生成一枚正经印章图，效果好再启用
- 不做竖排

### 发布（定名"发布"）

- 公众号长文 + AI 日报（98 期）合一陈列
- 未来扩展知乎、B站、小红书内容，预留 platform 字段

### 学习档案

- 按学期/阶段排布的课程论文、教评、文学发表、研究生总结
- 资料在 Windows 上，后续想办法导入

## 6. 壳规格

- 导航：站名（HYPOXANTHINE）+ 七门 + 档案 + 关于；手机端折叠菜单展开
- 主题：默认跟随系统（prefers-color-scheme），保留手动切换按钮，选择记忆在本地
- 色彩：壳用中性灰阶，每门一个识别色，进门沾该门的颜色
- 阅读交互：正文类内容全部整页跳转（方案 A），每篇一个独立网址
- 档案页：中性统一时间线 + 搜索，吸收旧 /search 功能，服务"我自己回看"的场景
- 移除 three.js（ThermalField 不进新首页），降低依赖

## 7. 技术要点

- Astro 静态站 + GitHub Pages 部署不变；构建验证用 `pnpm check` + `pnpm build`
- 字体：站内已有 Noto Serif SC、Noto Sans SC、JetBrains Mono；楷体需要补（候选霞鹜文楷 LXGW WenKai，实施时确认可用性）
- 旧内容 URL 迁移用 astro.config 静态 redirects
- 说明性内容（如本文件）一律 Markdown 入库，可手改、可推送

## 8. 实施决定记录（2026-09-30 定稿，原"实施阶段待办"逐项落定）

1. 学校 email：暂用现有 `hyx021203@163.com`，校邮箱拿到后替换
2. 发布门的名字：定名"发布"（英文标 PUBLISHING）
3. 照片：用已有头像 `/media/profile/yunxiang-he.webp`，不再留虚线占位框
4. 精选项目名单（上墙 6 个）：Cryo-GPU、VSPi、Hypo-Workflow、HypoDoc、Hypo-Writer、VSP-Codex；其余项目只进档案
5. 学习档案资料：先入库已数字化的 9 篇（8 篇课程作品 + 1 篇《古典文学知识》文学发表），Windows 上的资料后续导入
6. 印章：不用
7. 散文 classical/modern 逐篇分类：楼林、灯河、行见录·相逢篇、行见录·遗憾篇 → 全部 classical（4 篇；modern 皮肤保留机制，暂无内容）
8. 旧技术笔记去留：14 篇全部保持 draft 不上架，笔记门用"这个栏目在重写"诚实空态 + 重写进度，写完一篇上一篇
9. 自我介绍文案：采用 home-v1 中的克制版（两段式时态：已发表的过去式、77 K 进行中明确说进行中）

拆分映射（posts 15 篇的去向）：

- `essays`（4）：楼林、灯河、行见录-相逢篇、行见录-遗憾篇
- `poetry`（3）：2021下半年-2022年诗词创作、2023年诗词创作、2024年诗词创作
- `study`（9）：元代之后陆上丝绸之路凋敝的必然性、婉约词中的风骨、宋词导读拍照配词、宋词中的感性和理性、不醒人之梦-创作小记、智能的逆流与边界、你见过停滞在空中的云吗、马克思技术观在当代的应用和启示、（自 publications 移入）论中国古代诗词中的加餐

集合改名：`wechat` → `publish`（加 `platform` 字段，默认 wechat）；`wechat-daily.json` → `src/data/ai-daily.json`。

## 9. 实施顺序（含进度）

0. 阶段零：Mock 打样 ✅（2026-09-30 完成）。`mocks/` 下共 8 份独立 HTML：home-v1（首页：介绍区 + 七门卡片墙）、essay-skins-v1（散文古典/现代双皮肤）、research-v1（demo 墙 + paper 皮肤详情）、work-v1（精选大卡 + 详情页 GitHub 卡与开发日记）、poetry-v1（合集册页 + 居中词页上下阕分组）、publish-v1（日报 + 长文双栏）、study-v1（学期时间线）、notes-v1（方格纸诚实空态）。截图在 `mocks/shots/`（`node mocks/shoot.mjs` 重新生成）。全部 mock 均已视觉验收
1. 阶段一：数据层重整（集合合并拆分、字段新增）+ 新路由骨架 + 旧 URL 重定向
2. 阶段二：壳（导航、主题、色彩系统）+ 首页（介绍区 + 卡片墙）
3. 阶段三：逐门实现，顺序：研究 → 项目 → 散文 → 诗词 → 发布 → 学习档案 → 技术笔记
4. 阶段四：档案页、关于页、旧文件清理（/en、series、tags、旧组件）、sitemap/RSS 校验

每阶段结束 `pnpm check` 与 `pnpm build` 必须通过，并本地 preview 供验收。

## 10. 实施记录（2026-09-30 全部完成）

阶段一至四当日完成，逐项状态：

1. ✅ 数据层：essays / poetry / study / notes / publications / projects / publish / project-log 八个集合就位；portfolio.ts 已并入 projects；wechat → publish（platform 字段）；wechat-daily.json → src/data/ai-daily.json
2. ✅ 路由与重定向：~130 条旧 URL 重定向由 astro.config 按内容目录自动生成；/en、series、tags、courses、search、posts、projects、publications、wechat 全部下线
3. ✅ 壳：BaseLayout v2（注册表驱动导航、系统主题+手动记忆、移动端折叠菜单）；皮肤变量层在 src/styles/global.css（`html[data-skin=…]`，每门亮暗两套）；楷体用系统字体栈（霞鹜文楷未自托管，如需再评估）
4. ✅ 首页：介绍区（真名、两段式时态、现有头像照片）+ 七门卡片墙（lib/gates.ts 注册表驱动，桌面错位堆叠已校准到无碰撞，移动端单列）；three.js 已移除
5. ✅ 各门：研究（demo 墙 + paper 皮肤详情）、项目（精选 6 卡、GitHub 快照卡 + 运行时刷新 + 静默回退、开发日记时间线）、散文（classical 落地 / modern 机制就绪暂无内容）、诗词（册页 + 居中断阕）、发布（日报 + 长文，:::intro/:::note 容器指令经 remark-directive 转为样式块）、学习档案（学期时间线）、技术笔记（诚实空态 + 0/14 进度条）
6. ✅ 档案页：统一时间线 + 客户端搜索（吸收旧 /search）；关于页改中文单语；RSS 覆盖散文/诗词/笔记/发布长文；sitemap 校验无重定向页混入
7. ✅ 清理：three/tailwind/未用字体依赖移除；旧组件、旧布局、旧校验脚本退役；新增 scripts/validate-site.mjs（22 项断言全过）与 scripts/shoot-site.mjs

遗留待补（不阻塞）：

- SCAR (ISCAS 2026) 的 PDF 文件入库后补 `public/files/Papers/`，题录里已留注释
- 学校 email、B站/知乎主页地址拿到后更新 `src/lib/site.ts` 与首页联系胶囊
- 学习档案的 Windows 资料导入；essay-modern 第一篇内容；印章未启用（按 §8 决定）
