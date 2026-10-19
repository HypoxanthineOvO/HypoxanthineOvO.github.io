import { getCollection, type CollectionEntry } from 'astro:content';

// PREVIEW_DRAFTS=1 时草稿也进列表与路由（本地预览旧笔记用）
export const PREVIEW_DRAFTS = process.env.PREVIEW_DRAFTS === '1';

export type MediaEntry = CollectionEntry<'media'>;
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

export function formatMonthDay(date: Date) {
  return `${date.getUTCMonth() + 1}·${date.getUTCDate()}`;
}

// ---- 各分区查询 ----

// 已发布的在前，制作中的排在后面
export async function getMedia() {
  const all = sortByDateDesc(await getCollection('media'));
  return [...all.filter((m) => m.data.status === 'published'), ...all.filter((m) => m.data.status !== 'published')];
}


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
  const entries = (await getCollection('projectLog')) ?? [];
  return sortByDateDesc(entries.filter((entry) => entry.data.project === project));
}

export function getAdjacentEntries<T extends { id: string }>(entries: T[], id: string) {
  const index = entries.findIndex((entry) => entry.id === id);
  return {
    newer: index > 0 ? entries[index - 1] : null,
    older: index >= 0 && index < entries.length - 1 ? entries[index + 1] : null,
  };
}
