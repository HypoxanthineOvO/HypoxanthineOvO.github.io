import fs from 'node:fs/promises';
import path from 'node:path';

const sourceRoot = '/home/heyx/Hypo-Website-source/source';
const postsRoot = path.join(sourceRoot, '_posts');
const planPath = '/home/heyx/Hypo-Website/MIGRATION_PLAN.md';

const mdExtensions = new Set(['.md', '.markdown']);

function stripQuotes(value) {
  if (!value) return value;
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFlowArray(value) {
  const trimmed = value.trim();
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
    return null;
  }
  const inner = trimmed.slice(1, -1).trim();
  if (!inner) return [];
  return inner.split(',').map((part) => stripQuotes(part)).filter(Boolean);
}

function normalizeYamlValue(value) {
  const flow = parseFlowArray(value);
  if (flow) return flow;
  return stripQuotes(value);
}

function parseFrontMatter(content) {
  const lines = content.split(/\r?\n/);
  if (!/^\s*---\s*$/.test(lines[0] ?? '')) {
    return { data: {}, lineMap: {}, body: content };
  }

  let end = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (/^\s*---\s*$/.test(lines[i])) {
      end = i;
      break;
    }
  }

  if (end === -1) {
    return { data: {}, lineMap: {}, body: content };
  }

  const data = {};
  const lineMap = {};
  let currentKey = null;

  for (let index = 1; index < end; index += 1) {
    const line = lines[index];
    if (!line.trim()) continue;

    const listMatch = line.match(/^\s*-\s+(.*)$/);
    if (listMatch && currentKey) {
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = [];
      }
      const parsed = normalizeYamlValue(listMatch[1]);
      if (Array.isArray(parsed)) {
        data[currentKey].push(...parsed);
      } else {
        data[currentKey].push(parsed);
      }
      continue;
    }

    const scalarMatch = line.match(/^([A-Za-z0-9_]+):(?:\s*(.*))?$/);
    if (!scalarMatch) {
      currentKey = null;
      continue;
    }

    const [, key, rawValue = ''] = scalarMatch;
    lineMap[key] = index + 1;
    if (rawValue === '') {
      data[key] = [];
      currentKey = key;
      continue;
    }

    data[key] = normalizeYamlValue(rawValue);
    currentKey = null;
  }

  return {
    data,
    lineMap,
    body: lines.slice(end + 1).join('\n'),
  };
}

async function walkMarkdownFiles(root) {
  const files = [];

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const nextPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(nextPath);
        continue;
      }
      if (mdExtensions.has(path.extname(entry.name).toLowerCase())) {
        files.push(nextPath);
      }
    }
  }

  await walk(root);
  files.sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
  return files;
}

function formatRelative(filePath) {
  return path.relative(postsRoot, filePath).split(path.sep).join('/');
}

function formatSourceRelative(filePath) {
  return path.relative(sourceRoot, filePath).split(path.sep).join('/');
}

function slugifySegment(segment) {
  return segment
    .normalize('NFKC')
    .replace(/\.[^.]+$/, '')
    .replace(/[\s_]+/g, '-')
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '')
    .replace(/[“”"'`~!@#$%^&*+=\[\]{};,，。！？、：《》【】（）()]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .replace(/[A-Z]/g, (char) => char.toLowerCase());
}

function buildSlug(relativePath) {
  const basename = path.basename(relativePath, path.extname(relativePath));
  return slugifySegment(basename);
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value) return [value];
  return [];
}

function excerpt(body) {
  return body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/<img[^>]*>/gi, ' ')
    .replace(/\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/[#>*`-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 220);
}

function escapeCell(value) {
  return String(value).replace(/\|/g, '\\|');
}

function mdTable(headers, rows) {
  const head = `| ${headers.map(escapeCell).join(' | ')} |`;
  const divider = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${row.map(escapeCell).join(' | ')} |`).join('\n');
  return [head, divider, body].filter(Boolean).join('\n');
}

function classify(record) {
  const rel = record.relativePath;
  const categories = record.categories;
  const title = record.title;

  const shared = { note: '', waitForUser: false };

  if (rel === 'MyCourses.md') {
    return {
      collection: 'page-like',
      subcategory: 'TBD',
      confidence: 'low',
      finalTags: [],
      note: '页面型索引 stub，更适合作为独立页面，而不是 dated content entry',
      waitForUser: true,
    };
  }

  if (rel === 'MyWorks.md') {
    return {
      collection: 'publications split',
      subcategory: 'TBD',
      confidence: 'medium',
      finalTags: [],
      note: '不是单篇文章，应拆成结构化的 publications 条目；末尾文学类发表需单独决定是否也进入 publications',
      waitForUser: true,
    };
  }

  if (rel === '本科课程/Overview.md') {
    return {
      collection: 'notes or page',
      subcategory: 'TBD',
      confidence: 'low',
      finalTags: ['course-material'],
      note: '课程索引页且含大量硬编码旧链接，更适合并入 `/courses` 页面而不是 note',
      waitForUser: true,
    };
  }

  if (rel.startsWith('PaperReading/')) {
    return {
      collection: 'notes',
      subcategory: 'research',
      confidence: 'high',
      finalTags: ['gpu-research'],
      ...shared,
      note: 'Neural Rendering / Acceleration 方向的论文笔记',
    };
  }

  if (rel === '讲座笔记/MeTax-GPUEchoSystem.md') {
    return {
      collection: 'notes',
      subcategory: 'research',
      confidence: 'high',
      finalTags: ['gpu-research'],
      ...shared,
      note: '用户已明确：MeTax / 沐曦内容只打 `gpu-research`，不打 `lecture-notes`',
    };
  }

  if (rel.startsWith('科研思考/')) {
    return {
      collection: 'notes',
      subcategory: 'research',
      confidence: rel.includes('中国芯片') ? 'medium' : 'high',
      finalTags: ['gpu-research'],
      ...shared,
      note: rel.includes('中国芯片')
        ? '芯片史 slide 风格课程产物；tag 倾向明确，但最终落到 notes 还是别的承载方式仍可复核'
        : '研究导向明确，辐射场 / Neural Rendering 术语与 research notes 一致',
    };
  }

  if (rel.startsWith('常用技术笔记/')) {
    return {
      collection: 'notes',
      subcategory: 'engineering',
      confidence: 'high',
      finalTags: ['tooling-notes'],
      ...shared,
      note: '环境配置 / 工具链工作流，适合 engineering + tooling-notes',
    };
  }

  if (rel.startsWith('数字电路设计与实践/')) {
    const ambiguous = rel === '数字电路设计与实践/前端仿真.md';
    return {
      collection: 'notes',
      subcategory: 'engineering',
      confidence: ambiguous ? 'medium' : 'high',
      finalTags: ['engineering-practice'],
      note: ambiguous
        ? '数字 IC 验证流程偏实现，但 VCS / Verdi 工具链成分也很重，`tooling-notes` 是合理备选'
        : '偏实现导向的数字 IC 文章',
      waitForUser: ambiguous,
    };
  }

  if (rel.startsWith('本科课程/CS130/') || rel.startsWith('本科课程/CS182/')) {
    return {
      collection: 'notes',
      subcategory: 'TBD',
      confidence: 'medium',
      finalTags: ['course-material'],
      note: '考试复习 / cheatsheet 明确属于 `course-material`，但 subcategory 无法自然落入四个目标桶',
      waitForUser: true,
    };
  }

  if (rel.startsWith('本科课程/')) {
    return {
      collection: 'notes or page',
      subcategory: 'TBD',
      confidence: 'low',
      finalTags: ['course-material'],
      note: '课程总览更像独立页面，而不是 dated note entry',
      waitForUser: true,
    };
  }

  if (rel.startsWith('教程/')) {
    return {
      collection: 'posts',
      subcategory: 'engineering',
      confidence: 'medium',
      finalTags: ['tooling-notes'],
      ...shared,
      note: '长篇导购指南更像 post 而非 note，但 taxonomy 仍归技术向',
    };
  }

  if (categories.includes('文学论文')) {
    const creativeFiles = new Set([
      '个人创作/人文课论文/不醒人之梦-创作小记.md',
      '个人创作/人文课论文/你见过停滞在空中的云吗.md',
      '个人创作/人文课论文/宋词导读拍照配词.md',
    ]);

    return {
      collection: 'posts',
      subcategory: 'literature-papers',
      confidence: creativeFiles.has(rel) ? 'medium' : 'high',
      finalTags: [creativeFiles.has(rel) ? 'creative-writing' : 'literary-essay'],
      ...shared,
      note: creativeFiles.has(rel)
        ? '虽然放在“文学论文”目录下，但正文是创作产出，不是分析型论文'
        : '人文学科论文 / 读书报告 / 完整思想表达',
    };
  }

  if (categories.includes('散文')) {
    return {
      collection: 'posts',
      subcategory: 'literature-notes',
      confidence: 'high',
      finalTags: ['literary-essay'],
      ...shared,
      note: '完整散文作品，不是创作过程笔记',
    };
  }

  if (categories.includes('诗与词')) {
    return {
      collection: 'posts',
      subcategory: 'literature-notes',
      confidence: 'high',
      finalTags: ['creative-writing'],
      ...shared,
      note: '诗词合集属于直接创作产出',
    };
  }

  return {
    collection: 'posts',
    subcategory: 'TBD',
    confidence: 'low',
    finalTags: [],
    note: '默认兜底分类，需人工复核',
    waitForUser: true,
  };
}

function splitOriginalTagString(tagString) {
  return tagString
    .split(/[,，;；]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function sanitizeFilename(name) {
  const parsed = path.parse(name);
  const safeBase = parsed.name
    .normalize('NFKC')
    .replace(/[\s_]+/g, '-')
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '')
    .replace(/[“”"'`~!@#$%^&*+=\[\]{};,，。！？、：《》【】（）()]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const ext = parsed.ext.toLowerCase() || '';
  return `${safeBase || 'image'}${ext}`;
}

function buildImagePlan(record) {
  const perUrl = new Map();
  const usedNames = new Map();

  for (const image of record.externalImages) {
    if (perUrl.has(image.url)) {
      perUrl.get(image.url).uses += 1;
      continue;
    }

    const url = new URL(image.url);
    const decodedName = decodeURIComponent(path.basename(url.pathname));
    const initialName = sanitizeFilename(decodedName);
    let finalName = initialName;
    const seen = usedNames.get(initialName) ?? 0;
    if (seen > 0) {
      const parsed = path.parse(initialName);
      finalName = `${parsed.name}-${seen + 1}${parsed.ext}`;
    }
    usedNames.set(initialName, seen + 1);

    perUrl.set(image.url, {
      url: image.url,
      target: `src/assets/images/${record.slug}/${finalName}`,
      mode: image.mode,
      uses: 1,
    });
  }

  return [...perUrl.values()];
}

const pageSuggestions = {
  'about/index.md': {
    recommendation: '`about/index.md` -> 作为 `src/pages/about.astro` 的内容替换源',
    reason:
      '源文件本身就是 `layout: about` 的页面 stub，不是按时间归档的文章；Astro 现有 `/about` 路由与它天然对齐。',
    alternative:
      '保留手写的 `src/pages/about.astro` 结构，只把旧 front-matter 里的 `banner_img` 和标题语义当作参考素材。',
  },
  'MyCourses.md': {
    recommendation: '`MyCourses.md` -> 新建独立页 `src/pages/courses.astro`',
    reason:
      '正文是极短的课程索引 stub，且缺少 `date` 与 `categories`；硬塞进 posts / notes 会得到一篇信息量过低的 dated entry。做成独立页，也方便后续与 `本科课程/Overview.md` 合并。',
    alternative:
      '如果用户坚持一切都放 collection，可转成 notes 里的 index 型条目并打 `course-material`，但信息架构上弱于真正的页面。',
  },
  'MyWorks.md': {
    recommendation: '`MyWorks.md` -> 拆成结构化 `src/content/publications/*.md` 条目，并按需要回链 `projects`',
    reason:
      '文件本质上是 bibliography / publication list，而不是单篇文章；现有 publications schema 已经能承接 title / authors / venue / year / pdf 等结构化字段。',
    alternative:
      '如果用户希望先保留一个总览页，也可以先做 `/works` 页面，但仍建议把该文件当作 publications front-matter 的拆分源，而不是整篇迁成 post。',
  },
  '本科课程/Overview.md': {
    recommendation: '`本科课程/Overview.md` -> 更适合并入未来 `/courses` 页面，而不是迁成 dated note',
    reason:
      '它是课程索引和旧域名链接集合，不是独立文章；如果保留为 note，会把旧 Hexo permalink 假设继续带进新站。',
    alternative:
      '只有在用户明确要保留“旧课程总览页归档”时，才作为 note 迁入并打 `course-material`。',
  },
};

const files = await walkMarkdownFiles(postsRoot);
const records = [];

for (const filePath of files) {
  const raw = await fs.readFile(filePath, 'utf8');
  const { data, lineMap, body } = parseFrontMatter(raw);
  const relativePath = formatRelative(filePath);
  const categories = toArray(data.categories);
  const tags = toArray(data.tags);
  const classification = classify({
    relativePath,
    title: data.title ?? '',
    categories,
    tags,
  });

  const markdownImageRegex = /!\[[^\]]*]\((.*?)\)/g;
  const htmlImageRegex = /<img\b[^>]*?\bsrc=(["'])(.*?)\1[^>]*>/gi;
  const externalImages = [];

  for (const match of raw.matchAll(markdownImageRegex)) {
    const target = match[1].trim().replace(/\s+"[^"]*"$/, '');
    if (/^https?:\/\//i.test(target)) {
      externalImages.push({ url: target, mode: 'markdown' });
    }
  }

  for (const match of raw.matchAll(htmlImageRegex)) {
    const target = match[2].trim();
    if (/^https?:\/\//i.test(target)) {
      externalImages.push({ url: target, mode: 'html-img' });
    }
  }

  records.push({
    filePath,
    sourceRelative: formatSourceRelative(filePath),
    relativePath,
    title: data.title ?? '',
    date: data.date ?? null,
    categories,
    tags,
    rawTags: data.tags,
    raw,
    lineMap,
    body,
    excerpt: excerpt(body),
    slug: buildSlug(relativePath),
    classification,
    externalImages,
  });
}

const slugRows = [];
const slugSeen = new Map();
for (const record of records) {
  let slug = record.slug;
  if (record.relativePath === 'MyCourses.md') slug = 'courses';
  if (record.relativePath === 'MyWorks.md') slug = 'publications/* (split from myworks)';
  const baseSlug = slug;
  if (!slug.includes('*')) {
    const used = slugSeen.get(baseSlug) ?? 0;
    if (used > 0) {
      slug = `${baseSlug}-${used + 1}`;
    }
    slugSeen.set(baseSlug, used + 1);
  }
  record.plannedSlug = slug;
  slugRows.push([record.relativePath, slug]);
}

const imageGroups = records
  .filter((record) => record.externalImages.length > 0)
  .map((record) => ({
    record,
    mappings: buildImagePlan({ ...record, slug: record.plannedSlug.replace(/\/\*.*$/, '').replace(/\s+/g, '-') }),
  }));

const missingTagRecords = records.filter((record) => !record.rawTags);
const tagStringRecords = records.filter((record) => typeof record.rawTags === 'string' && /[,，;；]/.test(record.rawTags));

const brokenLinkSuggestions = [
  {
    file: '_posts/本科课程/CS130/Final-Cheatsheet.md',
    line: 617,
    original: 'Cheatsheet-Final%20a3ede0b2d25945df9dd63986f8a9b2fb/Untitled%2017.png',
    action: '若无法从其他备份找回缺失导出的图片目录，则删除该坏图链，或在文中保留 TODO 注释说明资源缺失',
  },
  {
    file: '_posts/个人创作/人文课论文/宋词中的感性和理性.md',
    line: 74,
    original: '/files/宋词中的感性和理性.pdf',
    action: '若找不回附件，则把下载链接改成纯文本说明，例如“PDF 附件未在 Eden 事实源中找到”',
  },
  {
    file: '_posts/个人创作/人文课论文/婉约词中的风骨.md',
    line: 96,
    original: '/files/婉约词中的风骨.pdf',
    action: '若找不回附件，则把下载链接改成纯文本说明，例如“PDF 附件未在 Eden 事实源中找到”',
  },
  {
    file: '_posts/个人创作/人文课论文/元代之后陆上丝绸之路凋敝的必然性.md',
    line: 268,
    original: '/files/元代之后陆上丝绸之路凋敝的必然性.docx',
    action: '若无法补回附件，则删除该 Docx 条目，或改成 TODO 说明等待用户补件',
  },
  {
    file: '_posts/个人创作/人文课论文/元代之后陆上丝绸之路凋敝的必然性.md',
    line: 269,
    original: '/files/元代之后陆上丝绸之路凋敝的必然性.pdf',
    action: '若无法补回附件，则删除该 PDF 条目，或改成 TODO 说明等待用户补件',
  },
  {
    file: '_posts/MyWorks.md',
    line: 13,
    original: '/files/Papers/My-ISCAS2024.pdf',
    action: '改为 `/files/Papers/MY-ISCAS2024.pdf` 以匹配事实源中的真实文件名；若用户更想统一命名，再决定是否重命名源文件',
  },
];

const waitingForUser = [];
for (const record of records) {
  if (record.classification.waitForUser) {
    waitingForUser.push({
      file: record.relativePath,
      issue: record.classification.note,
      current: record.classification.finalTags.length > 0 ? record.classification.finalTags.join(', ') : 'N/A',
    });
  }
}

waitingForUser.push({
  file: 'MyCourses.md',
  issue: 'Eden 上的事实源不是 git repo，无法用 `git log --follow` 恢复创建时间；`date` 只能先留 TODO，除非用户提供 canonical publish date',
  current: 'course-material (only if kept as content)',
});

const lines = [];
lines.push('# MIGRATION_PLAN');
lines.push('');
lines.push(`生成时间：${new Date().toISOString()}`);
lines.push('状态：dry-run only, no content files modified');
lines.push('');
lines.push('> Codex dry-run plan for Prompt C. 审完这份计划后，再进入真正的内容迁移。');
lines.push('');
lines.push('## 待用户确认');
lines.push('');
lines.push(...waitingForUser.map((item) => `- \`${item.file}\`: ${item.issue}；当前建议 tag / destination = ${item.current}`));
lines.push('');
lines.push('## 1.1 categories → subcategory 映射');
lines.push('');
lines.push(mdTable(
  ['File', 'Original categories', 'Proposed collection', 'Proposed subcategory', 'Final tags', 'Confidence', 'Notes'],
  records.map((record) => [
    record.relativePath,
    record.categories.length > 0 ? record.categories.join(' > ') : 'N/A',
    record.classification.collection,
    record.classification.subcategory,
    record.classification.finalTags.length > 0 ? record.classification.finalTags.join(', ') : 'N/A',
    record.classification.confidence,
    record.classification.note || '—',
  ]),
));
lines.push('');
lines.push('## 1.2 Page-like 文章目的地建议');
lines.push('');
for (const [file, suggestion] of Object.entries(pageSuggestions)) {
  lines.push(`### \`${file}\``);
  lines.push('');
  lines.push(`- 建议：${suggestion.recommendation}`);
  lines.push(`- 理由：${suggestion.reason}`);
  lines.push(`- 备选：${suggestion.alternative}`);
  lines.push('');
}
lines.push('## 1.3 slug 规则');
lines.push('');
lines.push('- 规则：保留中文；英文统一小写；空格与下划线转 `-`；去掉 FS 非法字符与明显展示性标点；默认使用文件 basename 生成 slug。');
lines.push('- 冲突处理：若 basename 冲突，则按 `-2`, `-3` 追加后缀。当前扫描范围内没有 basename 冲突。');
lines.push('');
lines.push(mdTable(['Original file', 'Planned slug'], slugRows));
lines.push('');
lines.push('## 1.4 外链图片下载映射');
lines.push('');
lines.push('- 仅覆盖外链图片；仓库内 `/files/*` 与 `/imgs/*` 不在此节下载范围。');
lines.push('- 目标落点统一为 `src/assets/images/<slug>/<filename>`。');
lines.push('- Markdown 图片改写计划：在迁移后的 `.mdx` 中用 `import imgX from "../../assets/images/<slug>/<filename>";`，再写成 `![alt](imgX.src)`。');
lines.push('- HTML `<img>` 改写计划：同样改成 `.mdx`，写为 `<img src={imgX.src} ... />`。');
lines.push('');
for (const group of imageGroups) {
  lines.push(`### \`${group.record.plannedSlug}\` — \`${group.record.relativePath}\``);
  lines.push('');
  lines.push(`- 外链图片数（唯一 URL）：\`${group.mappings.length}\``);
  lines.push(`- 改写模式：${group.mappings.some((item) => item.mode === 'html-img') ? '包含 HTML <img>，迁移时应转为 MDX' : '当前是 Markdown 图片语法；若统一使用 import 方案，也建议转为 MDX'}`);
  for (const mapping of group.mappings) {
    const reuse = mapping.uses > 1 ? ` (same URL referenced ${mapping.uses} times)` : '';
    lines.push(`  - \`${mapping.url}\` → \`${mapping.target}\`${reuse}`);
  }
  lines.push('');
}
lines.push('## 1.5 Hexo 标签插件 → MDX 映射');
lines.push('');
lines.push('- N/A。`MIGRATION_SCAN.md` 已确认 Hexo tag plugin 使用次数为 0，本阶段直接跳过。');
lines.push('');
lines.push('## 1.6 失效链接处理');
lines.push('');
lines.push(mdTable(
  ['Article', 'Line', 'Original', 'Suggested action'],
  brokenLinkSuggestions.map((item) => [item.file, item.line, item.original, item.action]),
));
lines.push('');
lines.push('## 1.7 front-matter 规范化');
lines.push('');
lines.push('### 缺 tags 的 16 篇：建议 tag');
lines.push('');
lines.push(mdTable(
  ['File', 'Current categories', 'Title', 'Excerpt basis', 'Suggested tags', 'Status'],
  missingTagRecords.map((record) => [
    record.relativePath,
    record.categories.length > 0 ? record.categories.join(' > ') : 'N/A',
    record.title,
    record.excerpt.slice(0, 90),
    record.relativePath === 'MyCourses.md'
      ? 'course-material（仅当保留为 content 时）'
      : record.classification.finalTags.length > 0
        ? record.classification.finalTags.join(', ')
        : 'N/A',
    record.classification.waitForUser ? 'TBD' : '推断',
  ]),
));
lines.push('');
lines.push('### tags 单字符串异常：原始串 → 规范化数组');
lines.push('');
lines.push(mdTable(
  ['File', 'Original tag string', 'Split tokens', 'Normalized final tags', 'Status'],
  tagStringRecords.map((record) => [
    record.relativePath,
    record.rawTags,
    splitOriginalTagString(record.rawTags).join(', '),
    record.classification.finalTags.join(', '),
    record.classification.waitForUser ? 'TBD' : '推断',
  ]),
));
lines.push('');
lines.push('### 其他 front-matter 规则');
lines.push('');
lines.push('- `MyCourses.md` 缺 `date`：当前 Eden 事实源不是 git repo，无法用 `git log --follow` 恢复首次提交时间；计划保留 `TODO`，待用户补 canonical date 或允许无日期 page 化。');
lines.push('- `MyCourses.md` / `MyWorks.md` 缺 `categories`：均视作 page-like / split-source，不补旧 categories。');
lines.push('- `mathjax: true` → `math: true`：适用于 `PaperReading/Paper-3DGaussian.md` 与 `科研思考/辐射场中的显式表达和隐式表达.md`。');
lines.push('- `sticky`、`index_img`、`banner_img`：不直接迁入 collections front-matter；仅在 page-like 或 UI 重写时按需人工吸收。');
lines.push('- `description`：默认从正文首个非标题段抽取 120-160 字，page-like 文件不自动抽 description。');
lines.push('- `draft`：默认 `false`；扫描阶段未发现需要保留为草稿的历史文章。');

await fs.writeFile(planPath, `${lines.join('\n')}\n`);
