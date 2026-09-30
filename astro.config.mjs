// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));

// ---- 旧 URL → 新位置 301（静态托管下为 meta-refresh 落地页） ----
// 内容条目的映射按当前集合目录自动生成，加减文章无需改这里。
/** @type {Record<string, string>} */
const redirects = {};

// /posts/<slug> → 各门（按文件所在集合）
const postTargets = [
  ['essays', '/essays'],
  ['poetry', '/poetry'],
  ['study', '/study'],
];
for (const [dir, base] of postTargets) {
  const dirPath = join(root, 'src/content', dir);
  if (!existsSync(dirPath)) continue;
  for (const file of readdirSync(dirPath)) {
    const slug = file.replace(/\.(md|mdx)$/, '');
    redirects[`/posts/${slug}`] = `${base}/${slug}`;
  }
}

// /publications/<slug> → /research/<slug>
const pubsDir = join(root, 'src/content/publications');
if (existsSync(pubsDir)) {
  for (const file of readdirSync(pubsDir)) {
    const slug = file.replace(/\.(md|mdx)$/, '');
    redirects[`/publications/${slug}`] = `/research/${slug}`;
  }
}

// /projects/<slug> → /work/<slug>（含 /log 子路由）
const projectsDir = join(root, 'src/content/projects');
if (existsSync(projectsDir)) {
  for (const file of readdirSync(projectsDir)) {
    const slug = file.replace(/\.(md|mdx)$/, '');
    redirects[`/projects/${slug}`] = `/work/${slug}`;
    redirects[`/projects/${slug}/log`] = `/work/${slug}`;
  }
}

// /wechat/articles/<slug> → /publish/<slug>
const publishDir = join(root, 'src/content/publish');
if (existsSync(publishDir)) {
  for (const file of readdirSync(publishDir)) {
    const slug = file.replace(/\.(md|mdx)$/, '');
    redirects[`/wechat/articles/${slug}`] = `/publish/${slug}`;
  }
}

// /wechat/daily/<date> → /publish/daily/<date>
const dailyFile = join(root, 'src/data/ai-daily.json');
if (existsSync(dailyFile)) {
  const issues = JSON.parse(readFileSync(dailyFile, 'utf8'));
  for (const issue of issues) {
    redirects[`/wechat/daily/${issue.date}`] = `/publish/daily/${issue.date}`;
  }
}

// 旧导航与聚合页 → 归宿
Object.assign(redirects, {
  '/wechat': '/publish',
  '/wechat/daily': '/publish/daily',
  '/projects': '/work',
  '/publications': '/research',
  '/series': '/archive',
  '/tags': '/archive',
  '/courses': '/study',
  '/search': '/archive',
  '/en': '/',
  '/en/about': '/about',
  '/en/research': '/research',
  '/en/work': '/work',
});

export default defineConfig({
  site: 'https://hypox.cn',
  output: 'static',
  integrations: [
    mdx(),
    sitemap(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  redirects,
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
    remarkPlugins: [remarkMath, remarkBreaks],
    rehypePlugins: [rehypeKatex],
  },
});
