import rss from '@astrojs/rss';

import { getNotes, getPosts } from '../lib/content';
import { siteConfig } from '../lib/site';

export async function GET(context) {
  const posts = await getPosts();
  const notes = await getNotes();

  const items = [
    ...posts.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description ?? '',
      pubDate: entry.data.date,
      link: `/posts/${entry.slug}`,
    })),
    ...notes.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description ?? '',
      pubDate: entry.data.date,
      link: `/notes/${entry.slug}`,
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: `${siteConfig.title} RSS`,
    description: 'Posts and notes from the Astro rebuild.',
    site: context.site ?? siteConfig.site,
    items,
  });
}
