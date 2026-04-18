> [!NOTE]
> Codex 自动草案，待 Hypoxanthine 审阅，作为 Prompt C 内容迁移输入。说明：legacy 站存在“一个 tag 字符串里塞多个概念”的情况，本提案已先按语义拆分后再做映射。

# Tag Migration Proposal

## Legacy Tag Inventory

- `CourseReview` (4)
- `Neural Rendering` (4)
- `环境配置` (4)
- `Architiecture` (3)
- `Hardware-Software Co-Design` (3)
- `仿真` (2)
- `数字电路` (2)
- `GPU 生态` (1)
- `MyPapers` (1)
- `Radiance Fields` (1)
- `VCS` (1)
- `Verdi` (1)
- `准备工作` (1)
- `实用工具` (1)
- `常用技术` (1)
- `沐曦集成电路` (1)
- `芯片` (1)

## Proposed Flat Taxonomy

- `literary-essay`: 文学论文、课程写作、较完整的思想表达。
- `creative-writing`: 创作手记、歌词改写、偏创作过程的文章。
- `personal-essay`: 散文、行见录、个人经验与情绪性写作。
- `gpu-research`: Neural Rendering、Radiance Fields、芯片、GPU 生态、硬软协同等研究方向。
- `lecture-notes`: 讲座笔记、学术分享记录、talk notes。
- `tooling-notes`: 环境配置、常用技术、工具链、工程工作流记录。
- `engineering-practice`: 数字电路、仿真、VCS/Verdi、偏实现导向的工程实践。
- `course-material`: course review、课程资料总览、cheatsheet 类内容。

## Old To New Mapping

| Legacy tag | Freq | Proposed new tag(s) | Decision | Reason |
| --- | ---: | --- | --- | --- |
| `CourseReview` | 4 | `course-material` | Merge | 这是课程资料属性，不需要继续保留英文遗留名。 |
| `Neural Rendering` | 4 | `gpu-research` | Merge | 作为具体研究主题，放进更稳的研究主标签下更利于长期维护。 |
| `环境配置` | 4 | `tooling-notes` | Merge | 本质是工具链与环境记录，不值得单独占一个顶层标签。 |
| `Architiecture` | 3 | `gpu-research` | Merge | 旧拼写还有错误，直接并入研究主标签最干净。 |
| `Hardware-Software Co-Design` | 3 | `gpu-research` | Merge | 与 GPU / rendering 研究方向高度重叠，单独保留会过细。 |
| `仿真` | 2 | `engineering-practice` | Merge | 应当与数字电路/VCS/Verdi并成工程实现簇。 |
| `数字电路` | 2 | `engineering-practice` | Merge | 频次不高，单列会造成 tag 云碎片化。 |
| `GPU 生态` | 1 | `gpu-research`, `lecture-notes` | Split | 内容主题是 GPU 研究，但文体常是讲座记录，需要双向落点。 |
| `MyPapers` | 1 | `publications` collection | Delete | 这不是主题标签，而是内容类型，应交给 Publications collection。 |
| `Radiance Fields` | 1 | `gpu-research` | Merge | 与 Neural Rendering 高度同域，没必要继续拆。 |
| `VCS` | 1 | `engineering-practice` | Merge | 工具名过细，适合并入数字电路工程实践。 |
| `Verdi` | 1 | `engineering-practice` | Merge | 同上，保留工具名只会制造孤立 tag。 |
| `准备工作` | 1 | `tooling-notes` | Merge | 实际是面向新生/新环境的工具准备，不是稳定主题。 |
| `实用工具` | 1 | `tooling-notes` | Merge | 语义过泛，统一并入工具链标签。 |
| `常用技术` | 1 | `tooling-notes` | Merge | 语义过泛，继续保留没有信息增益。 |
| `沐曦集成电路` | 1 | `gpu-research`, `lecture-notes` | Split | 既是具体产业对象，也是讲座语境下的笔记来源。 |
| `芯片` | 1 | `gpu-research` | Merge | 在新站定位里应并入更明确的研究方向标签。 |

## Migration Notes

- 旧站 tag 与 category 边界比较模糊；新站建议把“内容类型”交给 collections，把“主题”交给 tag。
- `文学论文`、`散文`、`诗与词` 这些 legacy category 不必再翻成 category 路由，可在迁移时按文体分配到 `literary-essay`、`creative-writing`、`personal-essay`。
- `讲座笔记`、`Paper Reading`、`本科课程` 这类内容优先迁到 `notes` collection，而不是继续塞进 posts。
- Prompt C 迁移时应优先人工确认两类边界：`gpu-research` vs `lecture-notes`，以及 `tooling-notes` vs `engineering-practice`。
