import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '../lib/site';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  return rss({
    title: `${siteConfig.title} Blog`,
    description: 'RSS feed for blog posts in the Astro rebuild.',
    site: context.site ?? siteConfig.site,
    items: posts
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.summary,
        link: `/blog/${post.data.subcategory}/${post.id}/`,
      })),
    customData: '<language>en-us</language>',
  });
}
