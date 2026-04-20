import type { CollectionEntry } from 'astro:content';

export type FilterableContentEntry = CollectionEntry<'posts'> | CollectionEntry<'notes'>;

export const PREVIEW_DRAFTS = import.meta.env.PREVIEW_DRAFTS === '1';

export function isVisible(entry: FilterableContentEntry): boolean {
  if (PREVIEW_DRAFTS) {
    return true;
  }

  return entry.data.draft !== true;
}

export function filterVisible<T extends FilterableContentEntry>(entries: T[]): T[] {
  return entries.filter(isVisible);
}
