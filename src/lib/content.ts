import { getCollection, type CollectionEntry } from 'astro:content';

import { noteTagLabels, postTagLabels } from './site';

export type PostEntry = CollectionEntry<'posts'>;
export type NoteEntry = CollectionEntry<'notes'>;
export type PublicationEntry = CollectionEntry<'publications'>;
export type ProjectEntry = CollectionEntry<'projects'>;

export function sortByDateDesc<T extends { data: { date: Date } }>(entries: T[]) {
  return [...entries].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
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

export function chunkEntries<T>(entries: T[], size: number) {
  const pages: T[][] = [];

  for (let index = 0; index < entries.length; index += size) {
    pages.push(entries.slice(index, index + size));
  }

  return pages;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
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
  const overrides = mode === 'post' ? postTagLabels : noteTagLabels;
  if (overrides[tag]) {
    return overrides[tag];
  }

  return tag
    .split('-')
    .map((part) => {
      if (part === 'gpu') {
        return 'GPU';
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');
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

export async function getPosts() {
  return sortByDateDesc((await getCollection('posts')).filter((entry) => !entry.data.draft));
}

export async function getNotes() {
  return sortByDateDesc(await getCollection('notes'));
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
  return [...(await getCollection('projects'))].sort((a, b) => {
    if (a.data.order !== b.data.order) {
      return a.data.order - b.data.order;
    }
    return a.data.name.localeCompare(b.data.name, 'en');
  });
}

export function getAdjacentEntries<T extends { id: string }>(entries: T[], id: string) {
  const index = entries.findIndex((entry) => entry.id === id);

  return {
    newer: index > 0 ? entries[index - 1] : null,
    older: index >= 0 && index < entries.length - 1 ? entries[index + 1] : null,
  };
}
