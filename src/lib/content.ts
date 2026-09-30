import { getCollection, type CollectionEntry } from 'astro:content';
import aiDailyRaw from '../data/ai-daily.json';

// PREVIEW_DRAFTS=1 时草稿也进列表与路由（本地预览旧笔记用）
export const PREVIEW_DRAFTS = process.env.PREVIEW_DRAFTS === '1';

export type EssayEntry = CollectionEntry<'essays'>;
export type PoetryEntry = CollectionEntry<'poetry'>;
export type StudyEntry = CollectionEntry<'study'>;
export type NoteEntry = CollectionEntry<'notes'>;
export type PublicationEntry = CollectionEntry<'publications'>;
export type ProjectEntry = CollectionEntry<'projects'>;
export type PublishEntry = CollectionEntry<'publish'>;
export type ProjectLogEntry = CollectionEntry<'projectLog'>;

export function sortByDateDesc<T extends { data: { date: Date } }>(entries: T[]) {
  return [...entries].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function groupBy<T>(entries: T[], keyOf: (entry: T) => string): { key: string; items: T[] }[] {
  const groups = new Map<string, T[]>();
  for (const entry of entries) {
    const key = keyOf(entry);
    const bucket = groups.get(key) ?? [];
    bucket.push(entry);
    groups.set(key, bucket);
  }
  return [...groups.entries()].map(([key, items]) => ({ key, items }));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatDateShort(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  }).format(date);
}

// ---- 各门查询 ----

export async function getEssays() {
  return sortByDateDesc(await getCollection('essays'));
}

export async function getPoetry() {
  return sortByDateDesc(await getCollection('poetry'));
}

export async function getStudy() {
  return sortByDateDesc(await getCollection('study'));
}

export async function getNotes() {
  const entries = await getCollection('notes');
  const visible = PREVIEW_DRAFTS ? entries : entries.filter((entry) => entry.data.draft !== true);
  return sortByDateDesc(visible);
}

export async function getPublications() {
  return [...(await getCollection('publications'))].sort(
    (a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title, 'en'),
  );
}

const STATUS_ORDER = ['wip', 'active', 'archived'] as const;

export async function getProjects() {
  return [...(await getCollection('projects'))].sort((a, b) => {
    const delta = STATUS_ORDER.indexOf(a.data.status) - STATUS_ORDER.indexOf(b.data.status);
    if (delta !== 0) return delta;
    return a.data.name.localeCompare(b.data.name, 'en');
  });
}

export async function getFeaturedProjects() {
  return (await getProjects()).filter((entry) => entry.data.featured);
}

export async function getPublishArticles() {
  const entries = await getCollection('publish');
  // published = 在架；archive = 公众号旧文归档，仍陈列；draft 不进生产
  return sortByDateDesc(entries.filter((entry) => entry.data.status !== 'draft'));
}

export async function getProjectLog(project: string) {
  const entries = await getCollection('projectLog');
  return sortByDateDesc(entries.filter((entry) => entry.data.project === project));
}

// ---- AI 日报 ----

export interface AiDailyItem {
  number: number;
  title: string;
  category: string;
  body: string;
  url?: string;
}

export interface AiDailyIssue {
  date: string;
  title: string;
  summary: string;
  published: boolean;
  status: string;
  cover?: string;
  items: AiDailyItem[];
}

const aiDailyAll = aiDailyRaw as AiDailyIssue[];

export function getAiDailyIssues() {
  return [...aiDailyAll].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getLatestAiDaily() {
  return getAiDailyIssues()[0] ?? null;
}

export function getAiDailyIssue(date: string) {
  return aiDailyAll.find((issue) => issue.date === date) ?? null;
}

// ---- 总档案（时间线 + 搜索的数据源） ----

export interface ArchiveItem {
  title: string;
  description?: string;
  date: Date | string;
  href: string;
  gate: string;
  gateName: string;
  extra?: string;
}

export async function getArchiveItems(): Promise<ArchiveItem[]> {
  const [essays, poetry, study, notes, publish, publications] = await Promise.all([
    getEssays(),
    getPoetry(),
    getStudy(),
    getNotes(),
    getPublishArticles(),
    getPublications(),
  ]);

  const items: ArchiveItem[] = [
    ...essays.map((e) => ({ title: e.data.title, description: e.data.description, date: e.data.date, href: `/essays/${e.id}`, gate: 'essays', gateName: '散文' })),
    ...poetry.map((e) => ({ title: e.data.title, description: e.data.description, date: e.data.date, href: `/poetry/${e.id}`, gate: 'poetry', gateName: '诗词' })),
    ...study.map((e) => ({ title: e.data.title, description: e.data.description, date: e.data.date, href: `/study/${e.id}`, gate: 'study', gateName: '学习档案', extra: e.data.course })),
    ...notes.map((e) => ({ title: e.data.title, description: e.data.description, date: e.data.date, href: `/notes/${e.id}`, gate: 'notes', gateName: '技术笔记' })),
    ...publish.map((e) => ({ title: e.data.title, description: e.data.description, date: e.data.date, href: `/publish/${e.id}`, gate: 'publish', gateName: '发布', extra: e.data.column })),
    ...publications.map((e) => ({ title: e.data.title, date: String(e.data.year), href: `/research/${e.id}`, gate: 'research', gateName: '研究', extra: e.data.venue })),
  ];

  return items.sort((a, b) => {
    const at = typeof a.date === 'string' ? a.date : a.date.toISOString();
    const bt = typeof b.date === 'string' ? b.date : b.date.toISOString();
    return bt.localeCompare(at);
  });
}

export function getAdjacentEntries<T extends { id: string }>(entries: T[], id: string) {
  const index = entries.findIndex((entry) => entry.id === id);
  return {
    newer: index > 0 ? entries[index - 1] : null,
    older: index >= 0 && index < entries.length - 1 ? entries[index + 1] : null,
  };
}
