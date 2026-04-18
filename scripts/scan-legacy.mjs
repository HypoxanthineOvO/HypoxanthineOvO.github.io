import fs from 'node:fs/promises';
import path from 'node:path';

import * as cheerio from 'cheerio';
import { glob } from 'glob';
import TurndownService from 'turndown';

const repoRoot = process.cwd();
const legacyRoot = process.env.LEGACY_ROOT
  ? path.resolve(process.env.LEGACY_ROOT)
  : path.resolve(repoRoot, '..', 'Hypo-Website-legacy');
const outputRoot = path.join(repoRoot, 'scripts', 'legacy-inventory');
const samplesRoot = path.join(outputRoot, 'sample-posts');

const postPathPattern = /^\d{4}\/\d{2}\/\d{2}\/.+\/index\.html$/;
const ignoredRoots = ['archives/', 'page/', 'tags/', 'categories/', 'about/', 'links/', 'xml/', 'SI100B-24Fa-Tutorials/'];

const turndown = new TurndownService({
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  headingStyle: 'atx',
  hr: '---',
});

turndown.remove(['script', 'style', 'noscript', 'iframe']);

turndown.addRule('stripHeaderLinks', {
  filter(node) {
    return node.nodeName === 'A' && node.getAttribute('class')?.includes('headerlink');
  },
  replacement() {
    return '';
  },
});

turndown.addRule('preserveBreaksInCells', {
  filter(node) {
    return node.nodeName === 'BR';
  },
  replacement() {
    return '  \n';
  },
});

function cleanTagPiece(input) {
  return input
    .replace(/^#+/, '')
    .replace(/[，,;；|]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitTagLabel(label) {
  return label
    .split(/[，,;；|]/g)
    .map(cleanTagPiece)
    .filter(Boolean);
}

function normalizeWhitespace(input) {
  return input.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function yamlQuote(input) {
  return JSON.stringify(input ?? '');
}

function looksLikeMath(markdown, contentHtml) {
  return (
    /\$\$[\s\S]*?\$\$/m.test(markdown) ||
    /(^|[^\$])\$[^$\n][\s\S]*?[^$\n]\$/m.test(markdown) ||
    /\\\(|\\\)|\\\[|\\\]/.test(markdown) ||
    /katex|mathjax|equation|\\begin\{/.test(contentHtml)
  );
}

function fallbackDescription(text) {
  const compact = text.replace(/\s+/g, ' ').trim();
  return compact.slice(0, 180);
}

function legacyUrlFor(relativePath) {
  return `/${relativePath.replace(/\/index\.html$/, '/')}`;
}

function sampleFileName(post, index) {
  return `${post.date}-${String(index + 1).padStart(2, '0')}.md`;
}

function scoreSample(post) {
  const dateScore = Number(post.date.replaceAll('-', ''));
  const lengthCenter = 1750;
  const lengthPenalty = Math.abs(post.content_length - lengthCenter);
  const imagePenalty = post.image_count * 250;
  const tablePenalty = post.table_count * 350;
  const mathPenalty = post.has_math ? 100000 : 0;
  const codePenalty = post.has_code ? 50000 : 0;
  const lengthOutOfRangePenalty =
    post.content_length < 500 || post.content_length > 3000 ? 25000 : 0;
  return dateScore - lengthPenalty - imagePenalty - tablePenalty - mathPenalty - codePenalty - lengthOutOfRangePenalty;
}

function buildFrontmatter(post) {
  const lines = [
    '---',
    `title: ${yamlQuote(post.title)}`,
    `date: ${post.date}`,
    `legacy_url: ${yamlQuote(post.url)}`,
    `description: ${yamlQuote(post.description ?? '')}`,
    `has_math: ${post.has_math}`,
    `has_code: ${post.has_code}`,
    'tags:',
  ];

  if (post.tags.length === 0) {
    lines.push('  []');
  } else {
    for (const tag of post.tags) {
      lines.push(`  - ${yamlQuote(tag)}`);
    }
  }

  lines.push('categories:');

  if (post.categories.length === 0) {
    lines.push('  []');
  } else {
    for (const category of post.categories) {
      lines.push(`  - ${yamlQuote(category)}`);
    }
  }

  lines.push('---', '');
  return lines.join('\n');
}

function compareByCountThenName(a, b) {
  if (b.count !== a.count) {
    return b.count - a.count;
  }
  return a.name.localeCompare(b.name, 'en');
}

async function extractPost(relativePath) {
  const absolutePath = path.join(legacyRoot, relativePath);
  const html = await fs.readFile(absolutePath, 'utf8');
  const $ = cheerio.load(html);
  const content = $('.markdown-body').first();

  if (content.length === 0) {
    return null;
  }

  const title =
    $('#seo-header').first().text().trim() ||
    $('meta[property="og:title"]').attr('content')?.trim() ||
    $('title').text().replace(/\s+-\s+Hypoxanthine.*/, '').trim() ||
    relativePath;

  const published = $('meta[property="article:published_time"]').attr('content') ?? '';
  const updated = $('meta[property="article:modified_time"]').attr('content') ?? '';
  const date = published ? published.slice(0, 10) : relativePath.slice(0, 10).replaceAll('/', '-');

  const description =
    $('meta[name="description"]').attr('content')?.replace(/\s+/g, ' ').trim() ||
    $('meta[property="og:description"]').attr('content')?.replace(/\s+/g, ' ').trim();

  const categories = $('.category-chain-item')
    .toArray()
    .map((node) => $(node).text().replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  const rawTagLabels = $('.post-meta a.print-no-link[href*="/tags/"]')
    .toArray()
    .map((node) => $(node).text().trim())
    .filter(Boolean);

  const tags = rawTagLabels.flatMap(splitTagLabel);

  const cleaned = cheerio.load(content.html() ?? '');
  cleaned('a.headerlink').remove();
  cleaned('script, style, noscript, iframe').remove();
  cleaned('[lazyload]').removeAttr('lazyload');
  cleaned('[srcset="/img/loading.gif"]').removeAttr('srcset');

  const contentHtml = cleaned.root().html() ?? '';
  const markdown = normalizeWhitespace(turndown.turndown(contentHtml));
  const plainText = normalizeWhitespace(cleaned.root().text());

  const imageCount = cleaned('img').length;
  const tableCount = cleaned('table').length;
  const hasCode = cleaned('pre, code, .highlight').length > 0;
  const hasMath = looksLikeMath(markdown, contentHtml);

  return {
    title,
    date,
    updated: updated ? updated.slice(0, 10) : null,
    url: legacyUrlFor(relativePath),
    source_html: absolutePath,
    relative_html: relativePath,
    tags,
    raw_tag_labels: rawTagLabels,
    categories,
    description: description || fallbackDescription(plainText),
    content_length: plainText.length,
    word_count: plainText.split(/\s+/).filter(Boolean).length,
    image_count: imageCount,
    table_count: tableCount,
    has_math: hasMath,
    has_code: hasCode,
    sample_score: scoreSample({
      date,
      content_length: plainText.length,
      image_count: imageCount,
      table_count: tableCount,
      has_math: hasMath,
      has_code: hasCode,
    }),
    markdown,
  };
}

async function main() {
  await fs.mkdir(samplesRoot, { recursive: true });

  const htmlFiles = await glob('**/index.html', {
    cwd: legacyRoot,
    nodir: true,
  });

  const postFiles = htmlFiles.filter(
    (file) => postPathPattern.test(file) && !ignoredRoots.some((prefix) => file.startsWith(prefix))
  );

  const extracted = await Promise.all(postFiles.map(extractPost));
  const inventory = extracted
    .filter(Boolean)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'en'));

  const tagCounts = new Map();
  const categoryCounts = new Map();

  for (const post of inventory) {
    for (const tag of post.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
    for (const category of post.categories) {
      categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
    }
  }

  const tagIndex = [...tagCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort(compareByCountThenName);

  const categoryIndex = [...categoryCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort(compareByCountThenName);

  const samplePosts = [...inventory]
    .filter(
      (post) =>
        post.categories.length > 0 &&
        !/^(Overview|Our Courses|My Works|ShanghaiTech 课程笔记整理|20\d{2}\s*年诗词创作)/i.test(post.title)
    )
    .sort((a, b) => b.sample_score - a.sample_score || b.date.localeCompare(a.date))
    .slice(0, 5);

  await Promise.all([
    fs.writeFile(path.join(outputRoot, 'inventory.json'), `${JSON.stringify(inventory, null, 2)}\n`, 'utf8'),
    fs.writeFile(path.join(outputRoot, 'tag-index.json'), `${JSON.stringify(tagIndex, null, 2)}\n`, 'utf8'),
    fs.writeFile(path.join(outputRoot, 'category-index.json'), `${JSON.stringify(categoryIndex, null, 2)}\n`, 'utf8'),
  ]);

  await Promise.all(
    samplePosts.map(async (post, index) => {
      const outputPath = path.join(samplesRoot, sampleFileName(post, index));
      const body = `${buildFrontmatter(post)}${post.markdown}\n`;
      await fs.writeFile(outputPath, body, 'utf8');
    })
  );

  process.stdout.write(
    JSON.stringify(
      {
        legacyRoot,
        postCount: inventory.length,
        selectedSamples: samplePosts.map((post, index) => ({
          file: sampleFileName(post, index),
          title: post.title,
          date: post.date,
          url: post.url,
          tags: post.tags,
          categories: post.categories,
          has_math: post.has_math,
          has_code: post.has_code,
          content_length: post.content_length,
        })),
      },
      null,
      2
    )
  );
}

await main();
