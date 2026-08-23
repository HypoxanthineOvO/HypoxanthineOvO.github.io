import { copyFile, mkdir, readFile, readdir, realpath, rm, stat, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, resolve } from 'node:path';

const sourceRoot = process.env.HYPO_WRITER_ROOT;
if (!sourceRoot) {
  throw new Error('Set HYPO_WRITER_ROOT to the Hypo-Writer workspace root.');
}

const repoRoot = resolve(import.meta.dirname, '..');
const dailyRoot = join(sourceRoot, 'workspace/series/news-pipeline/issues/ai-news');
const dailyOutput = join(repoRoot, 'src/data/wechat-daily.json');
const articleOutput = join(repoRoot, 'src/content/wechat');
const mediaOutput = join(repoRoot, 'public/media/wechat');

const longforms = [
  {
    slug: 'lumoslatex-engineering',
    path: 'workspace/works/lumoslatex-latex',
    series: '研究与工程笔记',
    date: '2026-05-20',
    status: 'archive',
    featured: true,
    cover: 'workspace/works/lumoslatex-plus-ai-news/exports/wechat/images/cover-v5-cn.png',
  },
  {
    slug: 'kimi-k3-evaluation',
    path: 'workspace/series/ai-judgment/articles/kimi-k3-evaluation',
    series: 'AI 模型观察',
    date: '2026-07-16',
    status: 'published',
    featured: true,
  },
  {
    slug: 'hypo-workflow-introduction',
    path: 'workspace/projects/hypo-workflow/series/promotion-introduction/articles/current-hypo-workflow',
    series: 'Hypo-Workflow',
    date: '2026-05-12',
    status: 'archive',
    featured: true,
  },
  {
    slug: 'hypo-workflow-subagent-audit',
    path: 'workspace/projects/hypo-workflow/series/promotion-introduction/articles/subagent-audit',
    series: 'Hypo-Workflow',
    date: '2026-05-13',
    status: 'archive',
    featured: false,
  },
  {
    slug: 'hypo-workflow-beginner-guide',
    path: 'workspace/projects/hypo-workflow/series/tutorials/articles/beginner-guide',
    series: 'Hypo-Workflow 教程',
    date: '2026-05-18',
    status: 'archive',
    featured: false,
  },
  {
    slug: 'hypo-workflow-cycle-tutorial',
    path: 'workspace/projects/hypo-workflow/series/tutorials/articles/hypo-workflow-tutorial',
    series: 'Hypo-Workflow 教程',
    date: '2026-05-18',
    status: 'archive',
    featured: false,
  },
  {
    slug: 'model-evaluation',
    path: 'workspace/series/ai-judgment/articles/model-evaluation',
    series: 'AI 模型观察',
    date: '2026-06-06',
    status: 'archive',
    featured: true,
  },
  {
    slug: 'june-model-comparison-2026',
    path: 'workspace/series/ai-judgment/articles/june-model-comparison-2026',
    series: 'AI 模型观察',
    date: '2026-06-30',
    status: 'archive',
    featured: false,
  },
  {
    slug: 'vibe-coding-for-everyone',
    path: 'workspace/series/ai-judgment/articles/vibe-coding-for-everyone',
    series: 'AI 焦虑门诊',
    date: '2026-07-02',
    status: 'archive',
    featured: true,
  },
  {
    slug: 'traditional-company-ai',
    path: 'workspace/series/ai-judgment/articles/traditional-company-ai',
    series: 'AI 产业观察',
    date: '2026-07-06',
    status: 'archive',
    featured: false,
  },
];

function stripMarkdown(value) {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/^>\s?/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function field(yaml, name) {
  const match = yaml.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
  return match?.[1]?.trim().replace(/^['"]|['"]$/g, '') ?? null;
}

function parseDailyArticle(date, markdown, yaml) {
  const lines = markdown.replace(/\r/g, '').split('\n');
  const title = lines.find((line) => line.startsWith('# '))?.slice(2).trim() ?? `AI 日报 ${date}`;
  const summaryStart = lines.findIndex((line) => line.trim() === '## 今日简述');
  let summary = '';
  if (summaryStart >= 0) {
    const summaryLines = [];
    for (let index = summaryStart + 1; index < lines.length && !lines[index].startsWith('## '); index += 1) {
      if (lines[index].trim()) summaryLines.push(lines[index]);
    }
    summary = stripMarkdown(summaryLines.join(' '));
  }

  const items = [];
  let category = '今日动态';
  let current = null;
  const flush = () => {
    if (!current) return;
    const raw = current.lines.join('\n').replace(/WE_CHAT_DISCLAIMER_MARKER/g, '').trim();
    const sourceLine = raw.match(/^>\s*来源：\s*(.+)$/m)?.[1]?.trim() ?? null;
    const url = raw.match(/^>\s*原文：\s*`?(https?:\/\/[^`\s]+)`?\s*$/m)?.[1] ?? null;
    const body = stripMarkdown(
      raw
        .split('\n')
        .filter((line) => !/^>\s*(来源|原文)：/.test(line.trim()))
        .join('\n'),
    );
    items.push({ ...current, lines: undefined, body, source: sourceLine, url });
    current = null;
  };

  for (const line of lines) {
    const section = line.match(/^##\s+(.+)/);
    if (section) {
      flush();
      if (!['今日简述', '概览'].includes(section[1].trim())) category = section[1].trim();
      continue;
    }
    const item = line.match(/^###\s+#?(\d+)[.、]?\s+(.+)/);
    if (item) {
      flush();
      current = { number: Number(item[1]), title: stripMarkdown(item[2]), category, lines: [] };
      continue;
    }
    if (current) current.lines.push(line);
  }
  flush();

  return {
    date,
    title,
    summary,
    published: /^published:\s*true\s*$/m.test(yaml),
    status: field(yaml, 'status') ?? 'archive',
    items: items.sort((left, right) => left.number - right.number),
  };
}

async function importDailyIssues() {
  const entries = await readdir(dailyRoot, { withFileTypes: true });
  const issues = [];
  await mkdir(join(mediaOutput, 'daily'), { recursive: true });

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    if (!entry.isDirectory() || !/^\d{4}-\d{2}-\d{2}$/.test(entry.name)) continue;
    const directory = join(dailyRoot, entry.name);
    try {
      const [markdown, yaml] = await Promise.all([
        readFile(join(directory, 'article.md'), 'utf8'),
        readFile(join(directory, 'status.yaml'), 'utf8'),
      ]);
      const issue = parseDailyArticle(entry.name, markdown, yaml);
      if (!issue.items.length) continue;
      const cover = join(directory, 'images/cover.png');
      try {
        await stat(cover);
        await copyFile(cover, join(mediaOutput, 'daily', `${entry.name}.png`));
        issue.cover = `/media/wechat/daily/${entry.name}.png`;
      } catch {
        issue.cover = null;
      }
      issues.push(issue);
    } catch {
      // Incomplete issues remain in Hypo-Writer and are not exposed as finished archive pages.
    }
  }

  issues.sort((left, right) => right.date.localeCompare(left.date));
  await mkdir(dirname(dailyOutput), { recursive: true });
  await writeFile(dailyOutput, `${JSON.stringify(issues, null, 2)}\n`);
  return issues;
}

async function copyArticleAsset(articleDirectory, slug, relativePath) {
  if (/^(?:https?:|data:|\/)/.test(relativePath)) return relativePath;
  const cleanPath = relativePath.split(/[?#]/)[0];
  if (!['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(extname(cleanPath).toLowerCase())) return null;
  try {
    const source = await realpath(join(articleDirectory, cleanPath));
    const allowedRoot = await realpath(sourceRoot);
    if (!source.startsWith(`${allowedRoot}/`)) return null;
    const targetDirectory = join(mediaOutput, 'articles', slug);
    await mkdir(targetDirectory, { recursive: true });
    const targetName = basename(source);
    await copyFile(source, join(targetDirectory, targetName));
    return `/media/wechat/articles/${slug}/${targetName}`;
  } catch {
    return null;
  }
}

async function importLongforms() {
  await rm(articleOutput, { recursive: true, force: true });
  await mkdir(articleOutput, { recursive: true });

  for (const item of longforms) {
    const directory = join(sourceRoot, item.path);
    let markdown = (await readFile(join(directory, 'article.md'), 'utf8')).replace(/\r/g, '');
    const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? item.slug;
    markdown = markdown.replace(/^#\s+.+\n+/, '').replace(/WE_CHAT_DISCLAIMER_MARKER/g, '').trim();
    const firstParagraph = markdown
      .split(/\n\s*\n/)
      .map(stripMarkdown)
      .find((paragraph) => paragraph && !paragraph.startsWith('#')) ?? '';

    const matches = [...markdown.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
    for (const match of matches) {
      const copied = await copyArticleAsset(directory, item.slug, match[2]);
      markdown = markdown.replace(match[0], copied ? `![${match[1]}](${copied})` : '');
    }

    let cover = null;
    if (item.cover) {
      const source = join(sourceRoot, item.cover);
      const targetDirectory = join(mediaOutput, 'articles', item.slug);
      await mkdir(targetDirectory, { recursive: true });
      await copyFile(source, join(targetDirectory, basename(source)));
      cover = `/media/wechat/articles/${item.slug}/${basename(source)}`;
    }

    const frontmatter = [
      '---',
      `title: ${JSON.stringify(title)}`,
      `date: ${item.date}`,
      `description: ${JSON.stringify(firstParagraph.slice(0, 220))}`,
      `series: ${JSON.stringify(item.series)}`,
      `status: ${item.status}`,
      `featured: ${item.featured}`,
      `cover: ${cover ? JSON.stringify(cover) : 'null'}`,
      `source: hypo-writer`,
      '---',
      '',
    ].join('\n');
    await writeFile(join(articleOutput, `${item.slug}.md`), `${frontmatter}${markdown}\n`);
  }
}

const issues = await importDailyIssues();
await importLongforms();
console.log(`Imported ${issues.length} daily issues with ${issues.reduce((sum, issue) => sum + issue.items.length, 0)} news items and ${longforms.length} longforms.`);
