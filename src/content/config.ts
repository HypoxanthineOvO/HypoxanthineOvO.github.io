import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 散文：style 控制阅读页子皮肤（essay-classical / essay-modern）
const essays = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/essays' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
    style: z.enum(['classical', 'modern']).default('classical'),
    math: z.boolean().default(false),
    updated: z.date().optional(),
  }),
});

// 诗词：按年结集，正文里空行分组即断阕
const poetry = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/poetry' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
    // 合集卡片上的选句
    picked: z.string().optional(),
    updated: z.date().optional(),
  }),
});

// 学习档案：按学期组织的课程论文、读书报告、创意写作、文学发表
const study = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/study' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
    term: z.string(),
    type: z.enum(['coursework', 'review', 'creative', 'literary', 'summary']),
    course: z.string().optional(),
    math: z.boolean().default(false),
  }),
});

// 技术笔记：待逐篇重写，draft 条目默认不进生产列表
const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
    source: z.string().optional(),
    authors: z.array(z.string()).optional(),
    link: z.string().url().optional(),
    draft: z.boolean().default(false),
    math: z.boolean().default(false),
  }),
});

// 学术发表（研究门）。文学发表已移入 study。
const publications = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()).optional(),
    venue: z.string().optional(),
    year: z.number().int(),
    research_area: z.string().optional(),
    pdf: z.string().optional(),
    code: z.string().optional(),
    project_page: z.string().optional(),
    bibtex: z.string().optional(),
    teaser: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

// 项目：合并自 portfolio.ts 与旧 projects 集合。featured 才上墙。
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    emoji: z.string().optional(),
    description: z.string(),
    status: z.enum(['active', 'wip', 'archived']),
    statusNote: z.string().optional(),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
    githubUrl: z.string().url().optional(),
    url: z.string().optional(),
    tech: z.array(z.string()).default([]),
    period: z.string().optional(),
    category: z.enum(['research', 'systems', 'writing', 'tools']).optional(),
    // 首页分组：productivity = 生产力工具；minecraft = MC 作品
    group: z.enum(['productivity', 'minecraft']).optional(),
    // stable 有详情页；developing 只上卡片
    tier: z.enum(['stable', 'developing', 'rework']).default('developing'),
    icon: z.string().optional(),
    version: z.string().optional(),
    order: z.number().default(99),
    // 亮点数字，卡片和详情页顶部展示
    highlights: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
  }),
});

// 内容：飘零账号的视频与文章。只收录作者确认过要上网站的条目。
const media = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/media' }),
  schema: z.object({
    kind: z.enum(['video', 'article']),
    title: z.string(),
    date: z.date(),
    series: z.string().optional(),
    description: z.string(),
    cover: z.string().optional(),
    duration: z.string().optional(),
    // 站内可直接播放的视频文件
    video: z.string().optional(),
    status: z.enum(['published', 'upcoming']).default('published'),
    platforms: z.array(z.enum(['wechat', 'douyin', 'bilibili', 'channels', 'xiaohongshu'])).default([]),
    // 视频对应的文字版（media 集合里的 id）
    related: z.string().optional(),
  }),
});

// 发布：公众号长文 + 未来知乎/B站/小红书，platform 区分渠道
const publish = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/publish' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    column: z.string().optional(),
    platform: z.enum(['wechat', 'zhihu', 'bilibili', 'xiaohongshu']).default('wechat'),
    status: z.enum(['published', 'archive', 'draft']).default('published'),
    featured: z.boolean().default(false),
    cover: z.string().nullable().default(null),
    source: z.string().optional(),
  }),
});

// 开发日记：project-log 机制，project 字段关联项目 slug
const projectLog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/project-log' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    kind: z.enum(['diary', 'release']),
    project: z.string(),
    milestone: z.string().optional(),
    status: z.enum(['shipped', 'wip', 'abandoned']).default('wip'),
    duration: z.string().optional(),
  }),
});

export const collections = { media, essays, poetry, study, notes, publications, projects, publish, projectLog };
