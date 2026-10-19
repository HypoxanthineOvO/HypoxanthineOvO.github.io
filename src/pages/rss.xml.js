import rss from '@astrojs/rss';

import { getMedia, getEssays, getPoetry } from '../lib/content';
import { siteConfig } from '../lib/site';

// RSS 覆盖内容（视频与文章）、散文、诗词
export async function GET(context) {
  const [media, essays, poetry] = await Promise.all([getMedia(), getEssays(), getPoetry()]);

  const itemOf = (entry, base) => ({
    title: entry.data.title,
    description: entry.data.description ?? '',
    pubDate: entry.data.date,
    link: `${base}/${entry.id}`,
  });

  const items = [
    ...media.filter((e) => e.data.status === 'published').map((e) => itemOf(e, '/content')),
    ...essays.map((e) => itemOf(e, '/essays')),
    ...poetry.map((e) => itemOf(e, '/poetry')),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site ?? siteConfig.site,
    customData: `<language>zh-CN</language><author>${siteConfig.author}</author>`,
    items,
  });
}
