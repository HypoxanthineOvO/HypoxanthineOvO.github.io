import { getCollection, type CollectionEntry } from 'astro:content';

import { filterVisible } from './content-filter';
import type { SeriesSlug } from './series';

export type PostEntry = CollectionEntry<'posts'>;
export type NoteEntry = CollectionEntry<'notes'>;
export type PublicationEntry = CollectionEntry<'publications'>;
export type ProjectEntry = CollectionEntry<'projects'>;
export type ContentEntry = PostEntry | NoteEntry;
export type ContentKind = 'post' | 'note';

export interface ArchiveEntry {
  id: string;
  title: string;
  description?: string;
  date: Date;
  tags: string[];
  series: SeriesSlug;
  archived: boolean;
  type: ContentKind;
  href: string;
  kind?: 'diary' | 'release';
  project?: string;
  milestone?: string;
  status?: 'shipped' | 'wip' | 'abandoned';
  duration?: string;
}

export interface AdjacentArchiveEntry {
  title: string;
  href: string;
  type: ContentKind;
}

export function sortByDateDesc<T extends { data: { date: Date } }>(entries: T[]) {
  return [...entries].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function sortArchiveEntries(entries: ArchiveEntry[]) {
  return [...entries].sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function groupEntriesByYear<T extends { data: { date: Date } }>(entries: T[]) {
  const groups = new Map<number, T[]>();

  for (const entry of entries) {
    const year = entry.data.date.getUTCFullYear();
    const bucket = groups.get(year) ?? [];
    bucket.push(entry);
    groups.set(year, bucket);
  }

  return [...groups.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({
      year,
      items: sortByDateDesc(items),
    }));
}

export function groupArchiveEntriesByYear(entries: ArchiveEntry[]) {
  const groups = new Map<number, ArchiveEntry[]>();

  for (const entry of entries) {
    const year = entry.date.getUTCFullYear();
    const bucket = groups.get(year) ?? [];
    bucket.push(entry);
    groups.set(year, bucket);
  }

  return [...groups.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({
      year,
      items: sortArchiveEntries(items),
    }));
}

export function chunkEntries<T>(entries: T[], size: number) {
  const pages: T[][] = [];

  for (let index = 0; index < entries.length; index += size) {
    pages.push(entries.slice(index, index + size));
  }

  return pages;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function toTagParam(tag: string) {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatTagLabel(tag: string, mode: 'post' | 'note' = 'post') {
  void mode;
  return tag;
}

export function collectTags<T extends { data: { tags?: string[] } }>(entries: T[]) {
  const counts = new Map<string, number>();

  for (const entry of entries) {
    for (const tag of entry.data.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'en'));
}

interface ContentQueryOptions {
  includeArchived?: boolean;
}

function filterArchived<T extends { data: { archived?: boolean } }>(entries: T[], includeArchived = false) {
  return includeArchived ? entries : entries.filter((entry) => !entry.data.archived);
}

export async function getPosts(options: ContentQueryOptions = {}) {
  const entries = filterVisible(await getCollection('posts'));
  return sortByDateDesc(filterArchived(entries, options.includeArchived));
}

export async function getNotes(options: ContentQueryOptions = {}) {
  return sortByDateDesc(filterArchived(filterVisible(await getCollection('notes')), options.includeArchived));
}

export async function getPublications() {
  return [...(await getCollection('publications'))].sort((a, b) => {
    if (a.data.kind !== b.data.kind) {
      return a.data.kind === 'academic' ? -1 : 1;
    }
    if (b.data.year !== a.data.year) {
      return b.data.year - a.data.year;
    }
    return a.data.title.localeCompare(b.data.title, 'en');
  });
}

export async function getProjects() {
  const statusOrder = ['active', 'wip', 'archived', 'internal'] as const;
  return [...(await getCollection('projects'))].sort((a, b) => {
    const statusDelta = statusOrder.indexOf(a.data.status) - statusOrder.indexOf(b.data.status);
    if (statusDelta !== 0) {
      return statusDelta;
    }
    return a.data.name.localeCompare(b.data.name, 'en');
  });
}

export function toArchiveEntry(entry: PostEntry | NoteEntry, type: ContentKind): ArchiveEntry {
  return {
    id: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    date: entry.data.date,
    tags: entry.data.tags ?? [],
    series: entry.data.series,
    archived: entry.data.archived ?? false,
    type,
    href: type === 'post' ? `/posts/${entry.id}` : `/notes/${entry.id}`,
    kind: entry.data.kind,
    project: entry.data.project,
    milestone: entry.data.milestone,
    status: entry.data.status,
    duration: entry.data.duration,
  };
}

export async function getArchiveEntries(options: ContentQueryOptions = {}) {
  const [posts, notes] = await Promise.all([getPosts(options), getNotes(options)]);

  return sortArchiveEntries([
    ...posts.map((entry) => toArchiveEntry(entry, 'post')),
    ...notes.map((entry) => toArchiveEntry(entry, 'note')),
  ]);
}

export async function getSeriesEntries(series: SeriesSlug, options: ContentQueryOptions = {}) {
  const entries = await getArchiveEntries({
    includeArchived: options.includeArchived ?? series === 'humanities',
  });

  return entries.filter((entry) => entry.series === series);
}

export async function getProjectLogEntries(project: string, options: ContentQueryOptions = {}) {
  const [posts, notes] = await Promise.all([getPosts(options), getNotes(options)]);

  return sortArchiveEntries([
    ...posts
      .filter((entry) => entry.data.series === 'project-log' && entry.data.project === project)
      .map((entry) => toArchiveEntry(entry, 'post')),
    ...notes
      .filter((entry) => entry.data.series === 'project-log' && entry.data.project === project)
      .map((entry) => toArchiveEntry(entry, 'note')),
  ]);
}

export function getAdjacentEntries<T extends { id: string }>(entries: T[], id: string) {
  const index = entries.findIndex((entry) => entry.id === id);

  return {
    newer: index > 0 ? entries[index - 1] : null,
    older: index >= 0 && index < entries.length - 1 ? entries[index + 1] : null,
  };
}

export function getAdjacentArchiveEntries(entries: ArchiveEntry[], href: string) {
  const index = entries.findIndex((entry) => entry.href === href);
  const toLink = (entry: ArchiveEntry | undefined): AdjacentArchiveEntry | null =>
    entry
      ? {
          title: entry.title,
          href: entry.href,
          type: entry.type,
        }
      : null;

  return {
    newer: index > 0 ? toLink(entries[index - 1]) : null,
    older: index >= 0 && index < entries.length - 1 ? toLink(entries[index + 1]) : null,
  };
}
