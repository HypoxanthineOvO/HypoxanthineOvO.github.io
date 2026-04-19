export const seriesValues = [
  'tooling-env',
  'tooling-ops',
  'tooling-hardware',
  'research-nerf',
  'research-cryo',
  'research-essay',
  'project-log',
  'essay',
  'poetry',
  'humanities',
] as const;

export type SeriesSlug = (typeof seriesValues)[number];
export type SeriesGroup = 'Notes' | 'Posts';

export interface SeriesMeta {
  slug: SeriesSlug;
  label: string;
  group: SeriesGroup;
  description: string;
  archivedOnly?: boolean;
}

export const seriesList: SeriesMeta[] = [
  {
    slug: 'tooling-env',
    label: '环境与工具链',
    group: 'Notes',
    description: '开发环境、语言运行时、编辑器与常用工具链的配置与经验。',
  },
  {
    slug: 'tooling-ops',
    label: '运维与部署',
    group: 'Notes',
    description: '部署、自动化、服务维护与运行期排障相关记录。',
  },
  {
    slug: 'tooling-hardware',
    label: '硬件与仿真',
    group: 'Notes',
    description: '数字设计、前端仿真、测试脚本与相关硬件工作流。',
  },
  {
    slug: 'research-nerf',
    label: '神经渲染研究',
    group: 'Notes',
    description: 'NeRF、3D Gaussian Splatting 与相关论文和研究笔记。',
  },
  {
    slug: 'research-cryo',
    label: '冷冻计算与 AI 加速',
    group: 'Notes',
    description: 'Cryo Computing × AI Acceleration 方向的后续研究记录。',
  },
  {
    slug: 'research-essay',
    label: '研究随笔',
    group: 'Notes',
    description: '介于技术笔记与长文之间的研究思考、讲座与背景整理。',
  },
  {
    slug: 'project-log',
    label: '项目日志',
    group: 'Posts',
    description: '围绕 Hypo-* 项目展开的开发日记、发布公告与里程碑记录。',
  },
  {
    slug: 'essay',
    label: '散文',
    group: 'Posts',
    description: '较完整的随笔、记忆与叙事性写作。',
  },
  {
    slug: 'poetry',
    label: '诗词',
    group: 'Posts',
    description: '诗词创作、合集与阶段性整理。',
  },
  {
    slug: 'humanities',
    label: '人文课程（锁库）',
    group: 'Posts',
    description: '人文课程论文、课程创作与阶段性写作归档，仅在本系列页展示。',
    archivedOnly: true,
  },
];

const seriesMetaMap = new Map(seriesList.map((item) => [item.slug, item]));

export function getSeriesMeta(series: SeriesSlug) {
  const meta = seriesMetaMap.get(series);

  if (!meta) {
    throw new Error(`Unknown series: ${series}`);
  }

  return meta;
}

export function isSeriesSlug(value: string): value is SeriesSlug {
  return seriesValues.includes(value as SeriesSlug);
}
