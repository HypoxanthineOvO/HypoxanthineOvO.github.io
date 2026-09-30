import rss from '@astrojs/rss';

import { getEssays, getPoetry, getNotes, getPublishArticles } from '../lib/content';
import { siteConfig } from '../lib/site';

// RSS 覆盖散文、诗词、笔记、发布门长文（DESIGN.md §2.2）
export async function GET(context) {
  const [essays, poetry, notes, articles] = await Promise.all([
    getEssays(),
    getPoetry(),
    getNotes(),
    getPublishArticles(),
  ]);

  const itemOf = (entry, gateHref) => ({
    title: entry.data.title,
    description: entry.data.description ?? '',
    pubDate: entry.data.date,
    link: `${gateHref}/${entry.id}`,
  });

  const items = [
    ...essays.map((e) => itemOf(e, '/essays')),
    ...poetry.map((e) => itemOf(e, '/poetry')),
    ...notes.map((e) => itemOf(e, '/notes')),
    ...articles.map((e) => itemOf(e, '/publish')),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: `${siteConfig.title} RSS`,
    description: siteConfig.description,
    site: context.site ?? siteConfig.site,
    customData: `<language>zh-CN</language><author>${siteConfig.author}</author>`,
    items,
  });
}
