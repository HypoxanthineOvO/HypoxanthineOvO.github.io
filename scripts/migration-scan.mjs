import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = '/home/heyx/Hypo-Website';
const sourceRoot = '/home/heyx/Hypo-Website-source/source';
const postsRoot = path.join(sourceRoot, '_posts');
const oldAuditPath = '/home/heyx/Hypo-Website-source/CONTENT_AUDIT_REPORT.md';

const skipDirs = new Set(['node_modules', 'public']);
const mdExtensions = new Set(['.md', '.markdown']);

function formatPath(filePath) {
  return path.relative(sourceRoot, filePath).split(path.sep).join('/');
}

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
  if (!inner) {
    return [];
  }

  return inner.split(',').map((part) => stripQuotes(part)).filter(Boolean);
}

function normalizeYamlValue(value) {
  const flow = parseFlowArray(value);
  if (flow) {
    return flow;
  }
  return stripQuotes(value);
}

function parseFrontMatter(content) {
  const lines = content.split(/\r?\n/);
  if (!/^\s*---\s*$/.test(lines[0] ?? '')) {
    return { data: {}, lineMap: {}, body: content, bodyStartLine: 1, rawBlock: '' };
  }

  let end = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (/^\s*---\s*$/.test(lines[i])) {
      end = i;
      break;
    }
  }

  if (end === -1) {
    return { data: {}, lineMap: {}, body: content, bodyStartLine: 1, rawBlock: '' };
  }

  const blockLines = lines.slice(1, end);
  const data = {};
  const lineMap = {};
  let currentKey = null;

  for (let index = 0; index < blockLines.length; index += 1) {
    const line = blockLines[index];
    const absoluteLine = index + 2;

    if (!line.trim()) {
      continue;
    }

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
    lineMap[key] = absoluteLine;

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
    bodyStartLine: end + 2,
    rawBlock: blockLines.join('\n'),
  };
}

async function walkMarkdownFiles(root) {
  const files = [];

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (skipDirs.has(entry.name)) {
          continue;
        }
        await walk(path.join(dir, entry.name));
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (mdExtensions.has(ext)) {
        files.push(path.join(dir, entry.name));
      }
    }
  }

  await walk(root);
  files.sort((a, b) => formatPath(a).localeCompare(formatPath(b), 'zh-Hans-CN'));
  return files;
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

function extractLine(content, lineNumber) {
  return content.split(/\r?\n/)[lineNumber - 1] ?? '';
}

function countPctDiff(current, baseline) {
  if (!baseline) {
    return null;
  }
  return Math.abs((current - baseline) / baseline) * 100;
}

function decodeRef(target) {
  try {
    return decodeURIComponent(target);
  } catch {
    return target;
  }
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function isRepoRelativeTarget(target) {
  const trimmed = target.trim();
  if (!trimmed || trimmed.startsWith('#')) {
    return false;
  }
  if (/^(?:[a-z]+:)?\/\//i.test(trimmed)) {
    return false;
  }
  if (/^(mailto|tel|data):/i.test(trimmed)) {
    return false;
  }
  return true;
}

async function resolveReference(filePath, target, kind) {
  if (kind === 'asset_img' || kind === 'asset_link') {
    const baseName = path.basename(filePath, path.extname(filePath));
    const direct = path.join(path.dirname(filePath), target);
    const postAssetFolder = path.join(path.dirname(filePath), baseName, target);
    if (await exists(direct)) return direct;
    if (await exists(postAssetFolder)) return postAssetFolder;
    return null;
  }

  const cleanTarget = decodeRef(target.split('#')[0].split('?')[0]).trim();
  if (!cleanTarget) {
    return null;
  }

  let candidate;
  if (cleanTarget.startsWith('/')) {
    candidate = path.join(sourceRoot, cleanTarget.replace(/^\/+/, ''));
  } else {
    candidate = path.resolve(path.dirname(filePath), cleanTarget);
  }

  const candidates = [candidate];
  if (!path.extname(candidate)) {
    candidates.push(`${candidate}.md`, `${candidate}.markdown`, path.join(candidate, 'index.md'));
  }

  for (const item of candidates) {
    if (await exists(item)) {
      return item;
    }
  }
  return null;
}

function parseOldAuditMetrics(content) {
  const readInt = (pattern) => {
    const match = content.match(pattern);
    return match ? Number(match[1]) : null;
  };

  return {
    posts: readInt(/source\/_posts\/` 下共有 `(\d+)` 篇 Markdown 文章/),
    nonPostPages: readInt(/source\/` 下的非 `_posts` Markdown 页面仅发现 `(\d+)` 个/),
    missingDate: readInt(/缺失 `date`：`(\d+)` 篇/),
    missingCategories: readInt(/缺失 `categories`：`(\d+)` 篇/),
    missingTags: readInt(/缺失 `tags`：`(\d+)` 篇/),
    categoryCount: readInt(/现有分类共 (\d+) 个/),
    tagCount: readInt(/标签总数为 `(\d+)`/),
    externalRawGithub: readInt(/\| `raw\.githubusercontent\.com` \| (\d+) \|/),
    externalZhimg: readInt(/\| `pic2\.zhimg\.com` \| (\d+) \|/),
    brokenRefs: readInt(/可解析但目标不存在：`(\d+)`/),
    hexoPlugins: readInt(/检测到 Hexo tag plugins：`(\d+)` 次/),
  };
}

function leadingTokenHistogram(entries) {
  const map = new Map();
  for (const entry of entries) {
    map.set(entry.token, (map.get(entry.token) ?? 0) + 1);
  }
  return map;
}

const markdownFiles = await walkMarkdownFiles(sourceRoot);
const postFiles = markdownFiles.filter((file) => file.startsWith(postsRoot + path.sep));
const pageFiles = markdownFiles.filter((file) => !file.startsWith(postsRoot + path.sep));
const oldAudit = parseOldAuditMetrics(await fs.readFile(oldAuditPath, 'utf8'));

const records = [];
const categoryCounts = new Map();
const tagCounts = new Map();
const pluginEntries = [];
const externalImageEntries = [];
let htmlExternalImageCount = 0;
const brokenRefs = [];
const relativeRefStats = {
  checked: 0,
  valid: 0,
  broken: 0,
};

for (const filePath of markdownFiles) {
  const raw = await fs.readFile(filePath, 'utf8');
  const { data, lineMap, body } = parseFrontMatter(raw);
  const relativePath = formatPath(filePath);
  const isPost = filePath.startsWith(postsRoot + path.sep);

  const categoriesRaw = data.categories;
  const tagsRaw = data.tags;
  const categories = Array.isArray(categoriesRaw)
    ? categoriesRaw
    : typeof categoriesRaw === 'string' && categoriesRaw
      ? [categoriesRaw]
      : [];
  const tags = Array.isArray(tagsRaw)
    ? tagsRaw
    : typeof tagsRaw === 'string' && tagsRaw
      ? [tagsRaw]
      : [];

  for (const category of categories) {
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
  }
  for (const tag of tags) {
    tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }

  const lines = raw.split(/\r?\n/);

  const pluginRegex = /\{%\s*([^\s%]+)([\s\S]*?)%\}/g;
  for (const match of body.matchAll(pluginRegex)) {
    const full = match[0];
    const absoluteLine = body.slice(0, match.index).split('\n').length + (raw.slice(0, raw.indexOf(body)).split('\n').length);
    pluginEntries.push({
      token: match[1],
      file: relativePath,
      line: absoluteLine,
      snippet: full.length > 100 ? `${full.slice(0, 97)}...` : full,
    });
  }

  const mdImageRegex = /!\[[^\]]*?\]\((.*?)\)/g;
  for (const match of raw.matchAll(mdImageRegex)) {
    const target = match[1].trim().replace(/\s+"[^"]*"$/, '');
    if (/^https?:\/\//i.test(target)) {
      try {
        const domain = new URL(target).hostname;
        externalImageEntries.push({ url: target, domain, file: relativePath });
      } catch {
        externalImageEntries.push({ url: target, domain: '(invalid-url)', file: relativePath });
      }
    }
  }

  const htmlImgRegex = /<img\b[^>]*?\bsrc=(["'])(.*?)\1[^>]*>/gi;
  for (const match of raw.matchAll(htmlImgRegex)) {
    const target = match[2].trim();
    if (/^https?:\/\//i.test(target)) {
      htmlExternalImageCount += 1;
      try {
        const domain = new URL(target).hostname;
        externalImageEntries.push({ url: target, domain, file: relativePath });
      } catch {
        externalImageEntries.push({ url: target, domain: '(invalid-url)', file: relativePath });
      }
    }
  }

  const markdownLinkRegex = /(!?)\[[^\]]*?\]\((.*?)\)/g;
  for (const match of raw.matchAll(markdownLinkRegex)) {
    const target = match[2].trim().replace(/\s+"[^"]*"$/, '');
    if (!isRepoRelativeTarget(target)) {
      continue;
    }

    const absoluteLine = raw.slice(0, match.index).split('\n').length;
    relativeRefStats.checked += 1;
    const resolved = await resolveReference(filePath, target, 'markdown');
    if (resolved) {
      relativeRefStats.valid += 1;
      continue;
    }

    relativeRefStats.broken += 1;
    brokenRefs.push({
      file: relativePath,
      line: absoluteLine,
      raw: extractLine(raw, absoluteLine).trim(),
      target,
      kind: match[1] === '!' ? 'image' : 'link',
    });
  }

  const htmlRefRegex = /<(img|a)\b[^>]*?\b(src|href)=(["'])(.*?)\3[^>]*>/gi;
  for (const match of raw.matchAll(htmlRefRegex)) {
    const target = match[4].trim();
    if (!isRepoRelativeTarget(target)) {
      continue;
    }
    const absoluteLine = raw.slice(0, match.index).split('\n').length;
    relativeRefStats.checked += 1;
    const resolved = await resolveReference(filePath, target, 'html');
    if (resolved) {
      relativeRefStats.valid += 1;
      continue;
    }
    relativeRefStats.broken += 1;
    brokenRefs.push({
      file: relativePath,
      line: absoluteLine,
      raw: extractLine(raw, absoluteLine).trim(),
      target,
      kind: match[1].toLowerCase() === 'img' ? 'image' : 'link',
    });
  }

  const assetPluginRegex = /\{%\s*(asset_img|asset_link)\s+(.+?)\s*%\}/g;
  for (const match of raw.matchAll(assetPluginRegex)) {
    const token = match[1];
    const payload = match[2].trim();
    const firstArg = payload.match(/^"([^"]+)"|'([^']+)'|(\S+)/);
    const target = firstArg ? stripQuotes(firstArg[1] ?? firstArg[2] ?? firstArg[3]) : payload;
    const absoluteLine = raw.slice(0, match.index).split('\n').length;
    relativeRefStats.checked += 1;
    const resolved = await resolveReference(filePath, target, token);
    if (resolved) {
      relativeRefStats.valid += 1;
      continue;
    }
    relativeRefStats.broken += 1;
    brokenRefs.push({
      file: relativePath,
      line: absoluteLine,
      raw: extractLine(raw, absoluteLine).trim(),
      target,
      kind: token,
    });
  }

  records.push({
    file: relativePath,
    isPost,
    title: typeof data.title === 'string' ? data.title : '',
    data,
    lineMap,
    tagFormatAnomaly:
      typeof tagsRaw === 'string' && /[,，;；]/.test(tagsRaw),
  });
}

const missingDate = records.filter((record) => record.isPost && !record.data.date);
const missingCategories = records.filter((record) => record.isPost && !record.data.categories);
const missingTags = records.filter((record) => record.isPost && !record.data.tags);
const tagFormatAnomalies = records.filter((record) => record.isPost && record.tagFormatAnomaly);

const categoryRows = [...categoryCounts.entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-Hans-CN'))
  .map(([category, count]) => [category, count]);

const tagRows = [...tagCounts.entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-Hans-CN'))
  .map(([tag, count]) => [tag, count]);

const pluginHistogram = [...leadingTokenHistogram(pluginEntries).entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'en'))
  .map(([token, count]) => ({
    token,
    count,
    samples: pluginEntries.filter((entry) => entry.token === token).slice(0, 2),
  }));

const externalImageDomainRows = [...externalImageEntries.reduce((map, entry) => {
  map.set(entry.domain, (map.get(entry.domain) ?? 0) + 1);
  return map;
}, new Map()).entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'en'))
  .map(([domain, count]) => [domain, count]);

const comparisonItems = [];
const currentMetrics = {
  posts: postFiles.length,
  nonPostPages: pageFiles.length,
  missingDate: missingDate.length,
  missingCategories: missingCategories.length,
  missingTags: missingTags.length,
  categoryCount: categoryCounts.size,
  tagCount: tagCounts.size,
  externalImages: externalImageEntries.length,
  brokenRefs: brokenRefs.length,
  hexoPlugins: pluginEntries.length,
};
const oldMetrics = {
  posts: oldAudit.posts,
  nonPostPages: oldAudit.nonPostPages,
  missingDate: oldAudit.missingDate,
  missingCategories: oldAudit.missingCategories,
  missingTags: oldAudit.missingTags,
  categoryCount: oldAudit.categoryCount,
  tagCount: oldAudit.tagCount,
  externalImages: (oldAudit.externalRawGithub ?? 0) + (oldAudit.externalZhimg ?? 0),
  brokenRefs: oldAudit.brokenRefs,
  hexoPlugins: oldAudit.hexoPlugins,
};

for (const [label, key] of [
  ['文章总数', 'posts'],
  ['非 _posts 页面数', 'nonPostPages'],
  ['缺失 date', 'missingDate'],
  ['缺失 categories', 'missingCategories'],
  ['缺失 tags', 'missingTags'],
  ['categories 取值数', 'categoryCount'],
  ['tags 取值数', 'tagCount'],
  ['外链图片总数', 'externalImages'],
  ['失效仓库内引用', 'brokenRefs'],
  ['Hexo 标签插件次数', 'hexoPlugins'],
]) {
  const current = currentMetrics[key];
  const baseline = oldMetrics[key];
  const pct = countPctDiff(current, baseline);
  const changed = pct !== null && pct >= 5;
  comparisonItems.push({
    label,
    baseline,
    current,
    pct,
    changed,
  });
}

const notableDrift = comparisonItems.filter((item) => item.changed);

const lines = [];
lines.push('# MIGRATION_SCAN');
lines.push('');
lines.push(`生成时间：${new Date().toISOString()}`);
lines.push(`扫描源：\`${sourceRoot}\``);
lines.push(`旧审计基线：\`${oldAuditPath}\``);
lines.push('');
lines.push('## 1. 内容总览');
lines.push('');
lines.push(`- \`_posts/\` 递归 Markdown 文章：\`${postFiles.length}\` 篇`);
lines.push(`- 非 \`_posts/\` Markdown 页面：\`${pageFiles.length}\` 个`);
if (pageFiles.length > 0) {
  lines.push(`- 页面清单：${pageFiles.map((file) => `\`${formatPath(file)}\``).join('、')}`);
}
lines.push('');
lines.push('## 2. Front-matter 完整性');
lines.push('');
lines.push(`- 缺失 \`date\`：\`${missingDate.length}\` 篇`);
lines.push(...missingDate.map((record) => `  - \`${record.file}:${record.lineMap.title ?? 2}\` (\`${record.title || '(untitled)'}\`)`));
lines.push(`- 缺失 \`categories\`：\`${missingCategories.length}\` 篇`);
lines.push(...missingCategories.map((record) => `  - \`${record.file}:${record.lineMap.title ?? 2}\` (\`${record.title || '(untitled)'}\`)`));
lines.push(`- 缺失 \`tags\`：\`${missingTags.length}\` 篇`);
lines.push(...missingTags.map((record) => `  - \`${record.file}:${record.lineMap.title ?? 2}\` (\`${record.title || '(untitled)'}\`)`));
lines.push('');
lines.push('### 2.1 tag 字段异常格式');
lines.push('');
if (tagFormatAnomalies.length === 0) {
  lines.push('- 未发现逗号串 / 全角逗号串这类 tag 格式异常。');
} else {
  lines.push(`- 发现 \`${tagFormatAnomalies.length}\` 篇 tag 仍是单字符串而非数组：`);
  lines.push(...tagFormatAnomalies.map((record) => `  - \`${record.file}:${record.lineMap.tags}\` → \`${record.data.tags}\``));
}
lines.push('');
lines.push('## 3. 实际 categories 取值空间');
lines.push('');
lines.push(`- 扁平展开后共有 \`${categoryCounts.size}\` 个 category token。`);
lines.push('');
lines.push(mdTable(['Category', 'Files'], categoryRows));
lines.push('');
lines.push('## 4. 实际 tags 取值空间');
lines.push('');
lines.push(`- 按 front-matter 原样统计共有 \`${tagCounts.size}\` 个 tag token / tag 串。`);
lines.push('');
lines.push(mdTable(['Tag', 'Files'], tagRows));
lines.push('');
lines.push('## 5. Hexo 标签插件 `{% %}` 使用情况');
lines.push('');
if (pluginHistogram.length === 0) {
  lines.push('- 本次重新扫描仍未发现 Hexo tag plugins。');
} else {
  lines.push(mdTable(
    ['Plugin', 'Count', 'Samples'],
    pluginHistogram.map((item) => [
      item.token,
      item.count,
      item.samples.map((sample) => `\`${sample.file}:${sample.line}\` ${sample.snippet}`).join('<br>'),
    ]),
  ));
}
lines.push('');
lines.push('## 6. 外链图片统计');
lines.push('');
lines.push(`- 外链图片总数：\`${externalImageEntries.length}\``);
lines.push(`- 其中 HTML \`<img>\` 外链：\`${htmlExternalImageCount}\``);
lines.push('');
lines.push(mdTable(['Domain', 'Count'], externalImageDomainRows));
lines.push('');
lines.push('## 7. 仓库内相对引用失效检测');
lines.push('');
lines.push(`- 已检查仓库内相对引用：\`${relativeRefStats.checked}\` 条`);
lines.push(`- 可解析且目标存在：\`${relativeRefStats.valid}\` 条`);
lines.push(`- 目标不存在：\`${relativeRefStats.broken}\` 条`);
lines.push('');
if (brokenRefs.length === 0) {
  lines.push('- 未发现失效的仓库内相对引用。');
} else {
  lines.push(mdTable(
    ['File', 'Line', 'Kind', 'Target', 'Raw'],
    brokenRefs.map((entry) => [entry.file, entry.line, entry.kind, entry.target, entry.raw]),
  ));
}
lines.push('');
lines.push('## 8. 与 Windows 旧审计报告对照');
lines.push('');
lines.push(mdTable(
  ['Metric', 'Windows Audit', 'Eden Source Scan', 'Delta'],
  comparisonItems.map((item) => [
    item.label,
    item.baseline ?? 'N/A',
    item.current,
    item.pct === null ? 'N/A' : `${item.pct.toFixed(1)}%${item.changed ? ' ↑ review' : ''}`,
  ]),
));
lines.push('');
if (notableDrift.length === 0) {
  lines.push('- 所有可比指标都在 5% 以内，没有发现实质漂移。');
} else {
  lines.push('- 以下指标与 Windows 旧审计报告相比差异 ≥ 5%，或表现出新问题：');
  lines.push(...notableDrift.map((item) => `  - ${item.label}：旧报告 ${item.baseline}，本次 ${item.current}，差异 ${item.pct.toFixed(1)}%`));
}

const newFieldNotes = [];
if (brokenRefs.some((entry) => entry.target === '/files/Papers/My-ISCAS2024.pdf')) {
  newFieldNotes.push('- 新发现 1 条大小写敏感环境下才会暴露的链接风险：`_posts/MyWorks.md` 指向 `/files/Papers/My-ISCAS2024.pdf`，而仓库内实际文件是 `source/files/Papers/MY-ISCAS2024.pdf`。Windows 下可能不暴露，Eden/Linux 下应视为失效引用。');
}
if (pluginHistogram.length === 0 && oldAudit.hexoPlugins === 0) {
  newFieldNotes.push('- Hexo tag plugins 仍然为 0，说明正文主体依旧是标准 Markdown / HTML / 数学公式路径。');
}
if (newFieldNotes.length > 0) {
  lines.push('');
  lines.push(...newFieldNotes);
}
if (htmlExternalImageCount > 0) {
  lines.push(`- 外链图片比 Windows 旧审计多出的 \`${externalImageEntries.length - ((oldAudit.externalRawGithub ?? 0) + (oldAudit.externalZhimg ?? 0))}\` 条，全部来自 \`_posts/PaperReading/Paper-RTNeRFAndInstant3D.md\` 内的 HTML \`<img>\` 外链；旧审计只统计了 Markdown 图片语法。`);
}
lines.push('');
lines.push('## 9. 备注');
lines.push('');
lines.push('- 本阶段只做扫描，不做任何内容迁移。');
lines.push('- `~/Hypo-Website-source/` 未写入；所有结论基于只读扫描。');

process.stdout.write(`${lines.join('\n')}\n`);
