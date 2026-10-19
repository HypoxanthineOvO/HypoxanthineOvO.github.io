// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import remarkDirective from 'remark-directive';
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
    const stable = /^tier:\s*stable\s*$/m.test(readFileSync(join(projectsDir, file), 'utf8'));
    redirects[`/projects/${slug}`] = stable ? `/work/${slug}` : '/work';
    redirects[`/projects/${slug}/log`] = stable ? `/work/${slug}` : '/work';
  }
}

// 旧公众号长文与 AI 日报已下线：所有旧地址（含公众号「阅读原文」深链）落到「内容」
const publishDir = join(root, 'src/content/publish');
if (existsSync(publishDir)) {
  for (const file of readdirSync(publishDir)) {
    const slug = file.replace(/\.(md|mdx)$/, '');
    redirects[`/wechat/articles/${slug}`] = '/content';
    redirects[`/publish/${slug}`] = '/content';
  }
}
const dailyFile = join(root, 'src/data/ai-daily.json');
if (existsSync(dailyFile)) {
  const issues = JSON.parse(readFileSync(dailyFile, 'utf8'));
  for (const issue of issues) {
    redirects[`/wechat/daily/${issue.date}`] = '/content';
    redirects[`/publish/daily/${issue.date}`] = '/content';
  }
}

// 技术笔记栏目已下线
const notesDir = join(root, 'src/content/notes');
if (existsSync(notesDir)) {
  for (const file of readdirSync(notesDir)) {
    redirects[`/notes/${file.replace(/\.(md|mdx)$/, '')}`] = '/';
  }
}

// 只保留稳定项目的详情页，其余项目旧地址回到项目列表
for (const file of existsSync(projectsDir) ? readdirSync(projectsDir) : []) {
  const slug = file.replace(/\.(md|mdx)$/, '');
  if (!/^tier:\s*stable\s*$/m.test(readFileSync(join(projectsDir, file), 'utf8'))) redirects[`/work/${slug}`] = '/work';
}

// 旧导航与聚合页 → 归宿
Object.assign(redirects, {
  '/wechat': '/content',
  '/wechat/daily': '/content',
  '/publish': '/content',
  '/publish/daily': '/content',
  '/notes': '/',
  '/archive': '/',
  '/projects': '/work',
  '/publications': '/research',
  '/series': '/',
  '/tags': '/',
  '/courses': '/study',
  '/search': '/',
  '/en': '/',
  '/en/about': '/about',
  '/en/research': '/research',
  '/en/work': '/work',
});

// hypo-writer 流水线的 :::intro / :::note 容器指令 → <aside class="directive …">
function remarkContainers() {
  /** @param {any} tree */
  return (tree) => {
    /** @param {any} node */
    const walk = (node) => {
      if (node.type === 'containerDirective') {
        node.data = node.data ?? {};
        node.data.hName = 'aside';
        node.data.hProperties = { class: `directive directive--${node.name}` };
      }
      if (node.children) node.children.forEach(walk);
    };
    walk(tree);
  };
}

export default defineConfig({
  site: 'https://hypox.cn',
  output: 'static',
  integrations: [
    mdx(),
    sitemap(),
  ],
  redirects,
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
    remarkPlugins: [remarkMath, remarkBreaks, remarkDirective, remarkContainers],
    rehypePlugins: [rehypeKatex],
  },
});
