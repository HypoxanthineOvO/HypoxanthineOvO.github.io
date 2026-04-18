import type { CollectionEntry } from 'astro:content';

export type SiteEntry =
  | CollectionEntry<'blog'>
  | CollectionEntry<'teaching'>
  | CollectionEntry<'courses'>
  | CollectionEntry<'publications'>;

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function sortByDateDesc<T extends { data: { date: Date } }>(entries: T[]) {
  return [...entries].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function groupPostsByYear<T extends { data: { date: Date } }>(entries: T[]) {
  return sortByDateDesc(entries).reduce<Record<string, T[]>>((groups, entry) => {
    const year = entry.data.date.getFullYear().toString();
    groups[year] ??= [];
    groups[year].push(entry);
    return groups;
  }, {});
}

export function tagToSlug(tag: string) {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getEntryHref(entry: SiteEntry) {
  if (entry.collection === 'blog') {
    return `/blog/${entry.data.subcategory}/${entry.id}/`;
  }

  if (entry.collection === 'teaching') {
    return `/academia/teaching/${entry.id}/`;
  }

  if (entry.collection === 'courses') {
    return `/academia/courses/${entry.id}/`;
  }

  return `/academia/publications/#${entry.id}`;
}

export function getEntryMeta(entry: SiteEntry) {
  if (entry.collection === 'blog') {
    return formatDate(entry.data.date);
  }

  if (entry.collection === 'teaching') {
    return `${entry.data.course} · ${entry.data.semester}`;
  }

  if (entry.collection === 'courses') {
    return [entry.data.code, entry.data.semester].filter(Boolean).join(' · ');
  }

  return `${entry.data.venue} · ${entry.data.year}`;
}

export function getEntrySummary(entry: SiteEntry) {
  if ('summary' in entry.data && typeof entry.data.summary === 'string') {
    return entry.data.summary;
  }

  if ('abstract' in entry.data && typeof entry.data.abstract === 'string') {
    return entry.data.abstract;
  }

  return undefined;
}

export function getEntryTags(entry: SiteEntry) {
  const maybeTags = (entry.data as { tags?: string[] }).tags;
  return Array.isArray(maybeTags) ? maybeTags : [];
}

export function collectTags(entries: SiteEntry[]) {
  const tagMap = new Map<string, { tag: string; slug: string; entries: SiteEntry[] }>();

  for (const entry of entries) {
    const maybeTags = (entry.data as { tags?: string[] }).tags;
    if (!Array.isArray(maybeTags)) {
      continue;
    }

    for (const tag of maybeTags) {
      const slug = tagToSlug(tag);
      const bucket = tagMap.get(slug) ?? { tag, slug, entries: [] };
      bucket.entries.push(entry);
      tagMap.set(slug, bucket);
    }
  }

  return [...tagMap.values()].sort((a, b) => a.tag.localeCompare(b.tag));
}
