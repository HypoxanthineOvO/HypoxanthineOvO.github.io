import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const repoRoot = '/home/heyx/Hypo-Website';
const sourceRoot = '/home/heyx/Hypo-Website-source/source';
const postsRoot = path.join(sourceRoot, '_posts');
const contentRoot = path.join(repoRoot, 'src/content');
const assetsRoot = path.join(repoRoot, 'src/assets/images');
const publicRoot = path.join(repoRoot, 'public');
const summaryPath = path.join(repoRoot, '.migration-summary.json');

const COLLECTION_PLAN = {
  '2021下半年-2022年诗词创作.md': { collection: 'posts', slug: '2021下半年-2022年诗词创作', tags: ['creative-writing'] },
  '2023年诗词创作.md': { collection: 'posts', slug: '2023年诗词创作', tags: ['creative-writing'] },
  '2024年诗词创作.md': { collection: 'posts', slug: '2024年诗词创作', tags: ['creative-writing'] },
  '个人创作/高中作品小记/灯河.md': { collection: 'posts', slug: '灯河', tags: ['literary-essay'] },
  '个人创作/高中作品小记/楼林.md': { collection: 'posts', slug: '楼林', tags: ['literary-essay'] },
  '个人创作/人文课论文/不醒人之梦-创作小记.md': { collection: 'posts', slug: '不醒人之梦-创作小记', tags: ['creative-writing'] },
  '个人创作/人文课论文/马克思技术观在当代的应用和启示.md': { collection: 'posts', slug: '马克思技术观在当代的应用和启示', tags: ['literary-essay'] },
  '个人创作/人文课论文/你见过停滞在空中的云吗.md': { collection: 'posts', slug: '你见过停滞在空中的云吗', tags: ['creative-writing'] },
  '个人创作/人文课论文/宋词导读拍照配词.md': { collection: 'posts', slug: '宋词导读拍照配词', tags: ['creative-writing'] },
  '个人创作/人文课论文/宋词中的感性和理性.md': { collection: 'posts', slug: '宋词中的感性和理性', tags: ['literary-essay'] },
  '个人创作/人文课论文/婉约词中的风骨.md': { collection: 'posts', slug: '婉约词中的风骨', tags: ['literary-essay'] },
  '个人创作/人文课论文/元代之后陆上丝绸之路凋敝的必然性.md': { collection: 'posts', slug: '元代之后陆上丝绸之路凋敝的必然性', tags: ['literary-essay'] },
  '个人创作/人文课论文/智能的逆流与边界.md': { collection: 'posts', slug: '智能的逆流与边界', tags: ['literary-essay'] },
  '个人创作/行见录/行见录-相逢篇.md': { collection: 'posts', slug: '行见录-相逢篇', tags: ['literary-essay'] },
  '个人创作/行见录/行见录-遗憾篇.md': { collection: 'posts', slug: '行见录-遗憾篇', tags: ['literary-essay'] },
  '教程/笔记本电脑选购指南.md': { collection: 'posts', slug: '笔记本电脑选购指南', tags: ['tooling-notes'] },

  '本科课程/CS130/Final-Cheatsheet.md': { collection: 'notes', slug: 'final-cheatsheet', tags: ['course-material'] },
  '本科课程/CS130/Midterm-Cheatsheet.md': { collection: 'notes', slug: 'midterm-cheatsheet', tags: ['course-material'] },
  '本科课程/CS182/Cheatsheet.md': { collection: 'notes', slug: 'cheatsheet', tags: ['course-material'] },
  '常用技术笔记/C_And_CPP.md': { collection: 'notes', slug: 'c-and-cpp', tags: ['tooling-notes'] },
  '常用技术笔记/CUDA.md': { collection: 'notes', slug: 'cuda', tags: ['tooling-notes'] },
  '常用技术笔记/LaTeX.md': { collection: 'notes', slug: 'latex', tags: ['tooling-notes'] },
  '常用技术笔记/Marp.md': { collection: 'notes', slug: 'marp', tags: ['tooling-notes'] },
  '常用技术笔记/Python.md': { collection: 'notes', slug: 'python', tags: ['tooling-notes'] },
  '常用技术笔记/SSH.md': { collection: 'notes', slug: 'ssh', tags: ['tooling-notes'] },
  '讲座笔记/MeTax-GPUEchoSystem.md': { collection: 'notes', slug: 'metax-gpu-ecosystem', tags: ['gpu-research'] },
  '科研思考/辐射场中的显式表达和隐式表达.md': { collection: 'notes', slug: '辐射场中的显式表达和隐式表达', tags: ['gpu-research'] },
  '科研思考/中国芯片的前世今生.md': { collection: 'notes', slug: '中国芯片的前世今生', tags: ['literary-essay'] },
  '数字电路设计与实践/前端仿真.md': { collection: 'notes', slug: '前端仿真', tags: ['engineering-practice'] },
  '数字电路设计与实践/Testbench编写基础.md': { collection: 'notes', slug: 'testbench编写基础', tags: ['engineering-practice'] },
  'PaperReading/Paper-3DGaussian.md': { collection: 'notes', slug: 'paper-3dgaussian', tags: ['gpu-research'] },
  'PaperReading/Paper-NeuRex.md': { collection: 'notes', slug: 'paper-neurex', tags: ['gpu-research'] },
  'PaperReading/Paper-RTNeRFAndInstant3D.md': { collection: 'notes', slug: 'paper-rtnerfandinstant3d', tags: ['gpu-research'] },
};

const PAGE_FILES = new Set(['MyCourses.md', 'MyWorks.md', '本科课程/Overview.md']);

const BROKEN_REPLACEMENTS = {
  '本科课程/CS130/Final-Cheatsheet.md': [
    {
      find: '![Use main memory as “cache” for disk](Cheatsheet-Final%20a3ede0b2d25945df9dd63986f8a9b2fb/Untitled%2017.png)',
      replace: '<!-- TODO: 资源缺失，待从备份补回 -->\n（图片暂缺：原图文件待补回）',
    },
  ],
  '个人创作/人文课论文/宋词中的感性和理性.md': [
    {
      find: '- [PDF](/files/宋词中的感性和理性.pdf)',
      replace: '<!-- TODO: 资源缺失，待从备份补回 -->\n（附件暂缺：PDF 文件待补回）',
    },
  ],
  '个人创作/人文课论文/婉约词中的风骨.md': [
    {
      find: '- [PDF](/files/婉约词中的风骨.pdf)',
      replace: '<!-- TODO: 资源缺失，待从备份补回 -->\n（附件暂缺：PDF 文件待补回）',
    },
  ],
  '个人创作/人文课论文/元代之后陆上丝绸之路凋敝的必然性.md': [
    {
      find: '- [Docx](/files/元代之后陆上丝绸之路凋敝的必然性.docx)',
      replace: '<!-- TODO: 资源缺失，待从备份补回 -->\n（附件暂缺：DOCX 文件待补回）',
    },
    {
      find: '- [PDF](/files/元代之后陆上丝绸之路凋敝的必然性.pdf)',
      replace: '<!-- TODO: 资源缺失，待从备份补回 -->\n（附件暂缺：PDF 文件待补回）',
    },
  ],
};

const PUBLICATIONS = [
  {
    slug: 'density-estimation-effective-sampling-strategy',
    data: {
      kind: 'academic',
      title: 'Density Estimation-based Effective Sampling Strategy for Neural Rendering',
      authors: ['Hypoxanthine He', 'X. Lou'],
      venue: 'IEEE International Symposium on Circuits and Systems (ISCAS)',
      year: 2024,
      research_area: 'Neural Rendering Hardware',
      pdf: '/files/Papers/MY-ISCAS2024.pdf',
      featured: true,
    },
  },
  {
    slug: 'precision-scalable-computation-array',
    data: {
      kind: 'academic',
      title: 'Analysis and Design of Precision-scalable Computation Array for Efficient Neural Radiance Field Rendering',
      authors: ['K. Long', 'C. Rao', 'Hypoxanthine He', 'Z. Yuan', 'P. Zhou', 'J. Yu', 'X. Lou'],
      venue: 'IEEE Transactions on Circuits and Systems I: Regular Papers',
      year: 2023,
      research_area: 'Neural Rendering Hardware',
      featured: true,
    },
  },
  {
    slug: 'hardware-volume-renderer-convolutional-neural-radiance-fields',
    data: {
      kind: 'academic',
      title: 'An Efficient Hardware Volume Renderer for Convolutional Neural Radiance Fields',
      authors: ['X. Wang', 'Hypoxanthine He', 'X. Zhang', 'P. Zhou', 'X. Lou'],
      venue: 'IEEE International Symposium on Circuits and Systems (ISCAS)',
      year: 2024,
      research_area: 'Neural Rendering Hardware',
    },
  },
  {
    slug: 'energy-efficient-neural-volume-rendering-accelerator-fpga',
    data: {
      kind: 'academic',
      title: 'A 0.59μJ/pixel High-throughput Energy-efficient Neural Volume Rendering Accelerator on FPGA',
      authors: ['Z. Yuan', 'B. Yuan', 'Y. Gu', 'Y. Zheng', 'Hypoxanthine He', 'X. Wang', 'C. Rao', 'P. Zhou', 'J. Yu', 'X. Lou'],
      venue: 'IEEE Custom Integrated Circuits Conference (CICC)',
      year: 2024,
      research_area: 'Neural Rendering Hardware',
    },
  },
  {
    slug: 'ray-reordering-hardware-accelerated-neural-volume-rendering',
    data: {
      kind: 'academic',
      title: 'Ray Reordering for Hardware-Accelerated Neural Volume Rendering',
      authors: ['J. Ding', 'Hypoxanthine He', 'B. Yuan', 'Z. Yuan', 'P. Zhou', 'J. Yu', 'X. Lou'],
      venue: 'IEEE Transactions on Circuits and Systems for Video Technology (TCSVT)',
      year: 2024,
      research_area: 'Neural Rendering Hardware',
    },
  },
  {
    slug: 'neural-rendering-coprocessor-optimized-ray-representation',
    data: {
      kind: 'academic',
      title: 'A Neural Rendering Coprocessor With Optimized Ray Representation and Marching',
      authors: ['Z. Yuan', 'B. Yuan', 'C. Rao', 'Y. Zhu', 'Hypoxanthine He', 'P. Zhou', 'J. Yu', 'X. Lou'],
      venue: 'IEEE Transactions on Very Large Scale Integration (VLSI) Systems',
      year: 2025,
      research_area: 'Neural Rendering Hardware',
      featured: true,
    },
  },
  {
    slug: 'energy-efficient-edge-coprocessor-explicit-data-reuse',
    data: {
      kind: 'academic',
      title: 'An Energy-Efficient Edge Coprocessor for Neural Rendering With Explicit Data Reuse Strategies',
      authors: ['B. Yuan', 'X. Zhang', 'Z. Zheng', 'Y. Zhang', 'H. Wan', 'Z. Yuan', 'J. Chen', 'Y. He', 'J. Ding', 'X. Zhang', 'C. Rao', 'W. Su', 'P. Zhou', 'J. Yu', 'X. Lou'],
      venue: 'IEEE Transactions on Very Large Scale Integration (VLSI) Systems',
      year: 2025,
      research_area: 'Neural Rendering Hardware',
    },
  },
  {
    slug: '论中国古代诗词中的加餐',
    data: {
      kind: 'literary',
      title: '论中国古代诗词中的“加餐”',
      authors: ['陈娅妮', '贺云翔'],
      venue: '《古典文学知识》2025 年第 12 期（总第 318 期）',
      year: 2025,
      featured: true,
    },
  },
];

function parseFrontMatter(content) {
  const lines = content.split(/\r?\n/);
  if (!/^\s*---\s*$/.test(lines[0] ?? '')) {
    return { data: {}, body: content };
  }

  let end = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (/^\s*---\s*$/.test(lines[i])) {
      end = i;
      break;
    }
  }

  if (end === -1) {
    return { data: {}, body: content };
  }

  const data = {};
  let currentKey = null;

  for (let index = 1; index < end; index += 1) {
    const line = lines[index];
    if (!line.trim()) continue;

    const listMatch = line.match(/^\s*-\s+(.*)$/);
    if (listMatch && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      const value = listMatch[1].trim();
      if (/^\[.*\]$/.test(value)) {
        data[currentKey].push(...value.slice(1, -1).split(',').map((item) => item.trim()).filter(Boolean));
      } else {
        data[currentKey].push(stripQuotes(value));
      }
      continue;
    }

    const scalarMatch = line.match(/^([A-Za-z0-9_]+):(?:\s*(.*))?$/);
    if (!scalarMatch) {
      currentKey = null;
      continue;
    }

    const [, key, rawValue = ''] = scalarMatch;
    if (rawValue === '') {
      data[key] = [];
      currentKey = key;
      continue;
    }
    if (/^\[.*\]$/.test(rawValue.trim())) {
      data[key] = rawValue.trim().slice(1, -1).split(',').map((item) => item.trim()).filter(Boolean);
    } else {
      data[key] = stripQuotes(rawValue);
    }
    currentKey = null;
  }

  return {
    data,
    body: lines.slice(end + 1).join('\n'),
  };
}

function stripQuotes(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function quoteYaml(value) {
  return JSON.stringify(value);
}

function formatYamlDate(value) {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
    if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
      return trimmed.replace(/\s+/, 'T');
    }
  }
  return quoteYaml(value);
}

function firstParagraph(body) {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<img[^>]*>/gi, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/^#+\s+/gm, '')
    .replace(/[*_`>|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return text.slice(0, 160);
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function emptyDir(dirPath) {
  await fs.rm(dirPath, { recursive: true, force: true });
  await fs.mkdir(dirPath, { recursive: true });
}

async function walkFiles(root) {
  const result = [];
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else {
        result.push(fullPath);
      }
    }
  }
  await walk(root);
  result.sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
  return result;
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function escapeAttribute(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function parseMarkdownImageMeta(altText) {
  const trimmed = altText.trim();
  const meta = {};
  if (/^w:\d+$/i.test(trimmed)) {
    meta.width = trimmed.split(':')[1];
    meta.alt = '';
    return meta;
  }
  if (/^h:\d+$/i.test(trimmed)) {
    meta.height = trimmed.split(':')[1];
    meta.alt = '';
    return meta;
  }
  meta.alt = trimmed;
  return meta;
}

function buildImageElement(varName, attrs = {}) {
  const parts = [`src={${varName}.src}`];
  if (attrs.alt !== undefined) {
    parts.push(`alt=${quoteYaml(attrs.alt)}`);
  }
  if (attrs.title) {
    parts.push(`title=${quoteYaml(attrs.title)}`);
  }
  if (attrs.width) {
    parts.push(`width=${quoteYaml(String(attrs.width))}`);
  }
  if (attrs.height) {
    parts.push(`height=${quoteYaml(String(attrs.height))}`);
  }
  return `<img ${parts.join(' ')} />`;
}

function hashVar(url) {
  return `img${crypto.createHash('md5').update(url).digest('hex').slice(0, 8)}`;
}

function sanitizeFilename(name) {
  const parsed = path.parse(name);
  const base = parsed.name
    .normalize('NFKC')
    .replace(/[\s_]+/g, '-')
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '')
    .replace(/[“”"'`~!@#$%^&*+=\[\]{};,，。！？、：《》【】（）()]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${base || 'image'}${parsed.ext.toLowerCase() || ''}`;
}

function makeImagePlan(urls, slugDir) {
  const seenNames = new Map();
  const plan = new Map();

  for (const url of urls) {
    if (plan.has(url)) continue;
    const fileName = sanitizeFilename(decodeURIComponent(path.basename(new URL(url).pathname)));
    let finalName = fileName;
    const count = seenNames.get(fileName) ?? 0;
    if (count > 0) {
      const parsed = path.parse(fileName);
      finalName = `${parsed.name}-${count + 1}${parsed.ext}`;
    }
    seenNames.set(fileName, count + 1);
    plan.set(url, {
      varName: hashVar(url),
      targetDir: path.join(assetsRoot, slugDir),
      targetPath: path.join(assetsRoot, slugDir, finalName),
      importPath: `../../assets/images/${slugDir}/${finalName}`,
      fileName: finalName,
    });
  }
  return plan;
}

function applyBrokenReplacements(relativePath, body, brokenLinkActions) {
  let nextBody = body;
  for (const rule of BROKEN_REPLACEMENTS[relativePath] ?? []) {
    if (nextBody.includes(rule.find)) {
      nextBody = nextBody.replace(rule.find, rule.replace);
      brokenLinkActions.push({
        file: relativePath,
        action: rule.replace,
      });
    }
  }
  return nextBody;
}

function transformBody(relativePath, body, imagePlan) {
  const imports = [];
  const seenImports = new Set();
  let transformed = body;

  const markdownImageRegex = /!\[([^\]]*)]\((.*?)\)/g;
  transformed = transformed.replace(markdownImageRegex, (full, altText, targetWithTitle) => {
    const target = targetWithTitle.trim().replace(/\s+"[^"]*"$/, '');
    if (!/^https?:\/\//i.test(target)) {
      return full;
    }
    const entry = imagePlan.get(target);
    if (!entry) return full;
    if (!seenImports.has(entry.varName)) {
      seenImports.add(entry.varName);
      imports.push(`import ${entry.varName} from ${quoteYaml(entry.importPath)};`);
    }
    const attrs = parseMarkdownImageMeta(altText);
    if (attrs.alt === undefined) attrs.alt = '';
    return buildImageElement(entry.varName, attrs);
  });

  const htmlImageRegex = /<img\b([^>]*?)\bsrc=(["'])(.*?)\2([^>]*)>/gi;
  transformed = transformed.replace(htmlImageRegex, (full, before, quote, src, after) => {
    if (!/^https?:\/\//i.test(src.trim())) {
      return full;
    }
    const entry = imagePlan.get(src.trim());
    if (!entry) return full;
    if (!seenImports.has(entry.varName)) {
      seenImports.add(entry.varName);
      imports.push(`import ${entry.varName} from ${quoteYaml(entry.importPath)};`);
    }
    const attrsSource = `${before} ${after}`;
    const attrs = {};
    const widthMatch = attrsSource.match(/\bwidth=(["']?)([^"'\s>]+)\1/i);
    const heightMatch = attrsSource.match(/\bheight=(["']?)([^"'\s>]+)\1/i);
    const titleMatch = attrsSource.match(/\btitle=(["'])(.*?)\1/i);
    const altMatch = attrsSource.match(/\balt=(["'])(.*?)\1/i);
    if (widthMatch) attrs.width = widthMatch[2];
    if (heightMatch) attrs.height = heightMatch[2];
    if (titleMatch) attrs.title = titleMatch[2];
    attrs.alt = altMatch ? altMatch[2] : '';
    return buildImageElement(entry.varName, attrs);
  });

  return { imports, body: transformed };
}

async function downloadWithRetry(url, targetPath) {
  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(20_000),
        headers: {
          'user-agent': 'Hypo-Website migration bot',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      await ensureDir(path.dirname(targetPath));
      await fs.writeFile(targetPath, buffer);
      return { ok: true, status: response.status, bytes: buffer.length, attempts: attempt };
    } catch (error) {
      lastError = error;
    }
  }
  return { ok: false, error: String(lastError) };
}

async function writeCollectionEntry(record, summary) {
  const sourcePath = path.join(postsRoot, record.relativePath);
  const raw = await fs.readFile(sourcePath, 'utf8');
  const { data, body } = parseFrontMatter(raw);
  const processedBody = applyBrokenReplacements(record.relativePath, body, summary.brokenLinkActions);
  const externalUrls = [];

  for (const match of processedBody.matchAll(/!\[[^\]]*]\((.*?)\)/g)) {
    const target = match[1].trim().replace(/\s+"[^"]*"$/, '');
    if (/^https?:\/\//i.test(target)) externalUrls.push(target);
  }
  for (const match of processedBody.matchAll(/<img\b[^>]*?\bsrc=(["'])(.*?)\1[^>]*>/gi)) {
    if (/^https?:\/\//i.test(match[2].trim())) externalUrls.push(match[2].trim());
  }

  const imagePlan = makeImagePlan(externalUrls, record.slug);
  const transformed = transformBody(record.relativePath, processedBody, imagePlan);

  for (const [url, image] of imagePlan.entries()) {
    summary.imagePlan.push({
      article: record.slug,
      source: url,
      target: toPosix(path.relative(repoRoot, image.targetPath)),
    });
  }

  const description = firstParagraph(transformed.body);
  const frontmatter = [];
  frontmatter.push('---');
  frontmatter.push(`title: ${quoteYaml(data.title ?? record.slug)}`);
  frontmatter.push(`date: ${formatYamlDate(data.date)}`);
  if (description) {
    frontmatter.push(`description: ${quoteYaml(description)}`);
  }
  frontmatter.push('tags:');
  for (const tag of record.tags) {
    frontmatter.push(`  - ${quoteYaml(tag)}`);
  }
  if (record.collection === 'posts') {
    if (data.mathjax === true || data.mathjax === 'true') {
      frontmatter.push('math: true');
    }
  }
  frontmatter.push('---');
  frontmatter.push('');

  const content = [
    ...frontmatter,
    ...transformed.imports,
    ...(transformed.imports.length > 0 ? [''] : []),
    transformed.body.trim(),
    '',
  ].join('\n');

  const targetPath = path.join(contentRoot, record.collection, `${record.slug}.mdx`);
  await fs.writeFile(targetPath, content);
  summary.migratedEntries.push({
    file: record.relativePath,
    collection: record.collection,
    slug: record.slug,
  });
}

async function copyDirIfExists(sourceDir, targetDir) {
  await fs.rm(targetDir, { recursive: true, force: true });
  try {
    await fs.cp(sourceDir, targetDir, { recursive: true });
  } catch {
    // source dir may not exist
  }
}

async function writePublications() {
  await emptyDir(path.join(contentRoot, 'publications'));
  for (const publication of PUBLICATIONS) {
    const lines = ['---'];
    for (const [key, value] of Object.entries(publication.data)) {
      if (Array.isArray(value)) {
        lines.push(`${key}:`);
        for (const item of value) {
          lines.push(`  - ${quoteYaml(item)}`);
        }
      } else if (typeof value === 'boolean') {
        lines.push(`${key}: ${value}`);
      } else if (typeof value === 'number') {
        lines.push(`${key}: ${value}`);
      } else {
        lines.push(`${key}: ${quoteYaml(value)}`);
      }
    }
    lines.push('---', '', '');
    await fs.writeFile(path.join(contentRoot, 'publications', `${publication.slug}.md`), `${lines.join('\n')}`);
  }
}

async function writeCoursesPage() {
  const content = `---
import BaseLayout from '../layouts/BaseLayout.astro';

interface CourseItem {
  label: string;
  href?: string;
  children?: CourseItem[];
}

interface CourseTerm {
  term: string;
  items: CourseItem[];
}

const quickIndex: string[] = ['SI100B EE Part', 'CS100', 'VSP100'];

const terms: CourseTerm[] = [
  {
    term: '21 Fall（大一上学期）',
    items: [
      { label: 'SI100B 信息科学与技术导论' },
      { label: 'GEMA1009 数学分析 I' },
      { label: 'MATH1112 线性代数 I' },
      {
        label: '中华文明通论（刘勋）',
        children: [{ label: '期末论文：元代之后陆上丝绸之路凋敝的必然性', href: '/posts/元代之后陆上丝绸之路凋敝的必然性' }],
      },
    ],
  },
  {
    term: '22 Spring（大一下学期）',
    items: [
      { label: 'CS100 计算机编程', href: 'https://coursebench.geekpie.club/course/84?answer=340' },
      { label: 'GEMA1010 数学分析 II' },
      { label: 'SI120 离散数学' },
    ],
  },
  {
    term: '22 Fall（大二上学期）',
    items: [
      { label: 'CS101 数据结构与算法', href: 'https://coursebench.geekpie.club/course/347?answer=881' },
      { label: 'SI140A 面向信息科学的概率论与数理统计', href: 'https://coursebench.geekpie.club/course/494?answer=488' },
      { label: 'CS171 计算机图形学', href: 'https://coursebench.geekpie.club/course/352?answer=1051' },
      {
        label: 'GEHA1152 唐宋文学精华',
        href: 'https://coursebench.geekpie.club/course/403?answer=887',
        children: [{ label: '期末论文：婉约词中的风骨', href: '/posts/婉约词中的风骨' }],
      },
    ],
  },
  {
    term: '23 Spring（大二下学期）',
    items: [
      {
        label: 'CS110 计算机体系结构',
        href: 'https://coursebench.geekpie.club/course/85?answer=1183',
        children: [{ label: 'CS110P 计算机体系结构课程设计', href: 'https://coursebench.geekpie.club/course/86?answer=1193' }],
      },
      {
        label: 'EE150 信号与系统',
        href: 'https://coursebench.geekpie.club/course/128?answer=876',
        children: [{ label: '课程笔记', href: 'https://epan.shanghaitech.edu.cn/l/lF33j1' }],
      },
      { label: 'EE150L 信号与系统实验' },
      {
        label: 'CS182 机器学习引论',
        href: 'https://coursebench.geekpie.club/course/93?answer=878',
        children: [{ label: 'Final Review', href: '/notes/cheatsheet' }],
      },
      { label: '现代生命科学导论 C', href: 'https://coursebench.geekpie.club/course/27?answer=1375' },
      { label: '思想道德与法治（从思修看“基本写作素养”和通识课绩点的一定相关性）', href: 'https://coursebench.geekpie.club/course/193?answer=1046' },
    ],
  },
  {
    term: '23 Fall（大三上学期）',
    items: [
      { label: 'CS181 人工智能 I', href: 'https://coursebench.geekpie.club/course/92?answer=877' },
      {
        label: 'CS130 操作系统',
        href: 'https://coursebench.geekpie.club/course/350?answer=875',
        children: [
          { label: 'Midterm Review', href: '/notes/midterm-cheatsheet' },
          { label: 'Final Review', href: '/notes/final-cheatsheet' },
        ],
      },
      {
        label: 'GEHA1117 宋词导读',
        href: 'https://coursebench.geekpie.club/course/659?answer=704',
        children: [{ label: '读书报告：宋词中的感性与理性', href: '/posts/宋词中的感性和理性' }],
      },
      { label: 'GESS1023 毛泽东思想和中国特色社会主义理论体系概论', href: 'https://coursebench.geekpie.club/course/190?answer=712' },
    ],
  },
  {
    term: '24 Spring（大三下学期）',
    items: [
      { label: 'EE116 基于FPGA 的硬件系统设计', href: 'https://coursebench.geekpie.club/course/541?answer=907' },
      { label: 'SI114H 计算科学与工程', href: 'https://coursebench.geekpie.club/course/262?answer=906' },
      {
        label: '科技文明通论',
        href: 'https://coursebench.geekpie.club/course/156?answer=983',
        children: [{ label: '期末论文：智能的逆流与边界：AI 浪潮下的“为何”与“如何”', href: '/posts/智能的逆流与边界' }],
      },
      { label: '中外歌剧赏析', href: 'https://coursebench.geekpie.club/course/646?answer=908' },
    ],
  },
  {
    term: '24 Fall（大四上学期）',
    items: [
      { label: 'SI152 数值最优化', href: 'https://coursebench.geekpie.club/course/264?answer=1580' },
      {
        label: '马克思主义基本原理',
        children: [{ label: '马原期末论文', href: '/posts/马克思技术观在当代的应用和启示' }],
      },
      {
        label: '唐前诗文之美',
        href: 'https://coursebench.geekpie.club/course/172?answer=1543',
        children: [
          { label: '创意写作：你见过停滞在空中的云吗', href: '/posts/你见过停滞在空中的云吗' },
          { label: '期末论文：古代文学中“加餐”的流变（To be released）' },
        ],
      },
    ],
  },
  {
    term: '25 Spring（大四下学期）',
    items: [{ label: '这学期值得花时间的只有毕业设计了 QwQ' }],
  },
];
---

<BaseLayout title="Courses" description="Course archive merged from legacy MyCourses and Overview pages.">
  <section class="shell pb-20">
    <div class="content-shell md:mx-0 md:max-w-[820px] md:px-0">
      <p class="section-kicker">Courses</p>
      <h1 class="mb-6">Courses</h1>
      <div class="space-y-4 text-muted">
        <p>本页合并了旧 Hexo 站里的 <code>MyCourses.md</code> 与 <code>本科课程/Overview.md</code>。</p>
        <p>保留了课程时间线与仍然有效的外部链接，同时把原先硬编码到旧 Hexo 域名的内部文章链接改到了当前 Astro 站内路由。</p>
      </div>

      <div class="mt-10 rounded-3xl border border-border bg-bg px-6 py-6">
        <h2 class="mb-4 text-[1.2rem]">Legacy Quick Index</h2>
        <ul class="space-y-2 pl-5 text-muted">
          {quickIndex.map((item) => <li>{item}</li>)}
        </ul>
      </div>

      <div class="mt-12 space-y-10">
        {terms.map((section) => (
          <section>
            <h2 class="mb-4 text-[1.3rem]">{section.term}</h2>
            <ol class="space-y-3 pl-5 text-muted">
              {section.items.map((item) => (
                <li>
                  {item.href ? (
                    <a class="inline-link" href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noreferrer' : undefined}>
                      {item.label}
                    </a>
                  ) : (
                    item.label
                  )}
                  {item.children?.length ? (
                    <ul class="mt-2 space-y-2 pl-5">
                      {item.children.map((child) => (
                        <li>
                          {child.href ? (
                            <a class="inline-link" href={child.href} target={child.href.startsWith('http') ? '_blank' : undefined} rel={child.href.startsWith('http') ? 'noreferrer' : undefined}>
                              {child.label}
                            </a>
                          ) : (
                            child.label
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  </section>
</BaseLayout>
`;
  await fs.writeFile(path.join(repoRoot, 'src/pages/courses.astro'), content);
}

async function writeAboutPage() {
  const content = `---
import BaseLayout from '../layouts/BaseLayout.astro';
import { siteConfig } from '../lib/site';
---

<BaseLayout title="About" description="About page rebuilt from the legacy Hexo about stub and current site profile.">
  <section class="shell pb-20">
    <div class="content-shell md:mx-0 md:max-w-[820px] md:px-0">
      <p class="section-kicker">Profile</p>
      <h1 class="mb-6">About</h1>
      <img
        class="mb-8 w-full rounded-3xl border border-border object-cover"
        src="/imgs/IC_Cover.jpg"
        alt="Legacy banner image from the Hexo about page"
      />
      <div class="space-y-4 text-muted">
        <p>
          旧 Hexo 站的 <code>about/index.md</code> 只保留了页面标题、layout 标记和这张横幅图，因此这里沿用该图像作为历史入口，
          并保留当前 Astro 站的最小个人介绍框架。
        </p>
        <p>
          Hypoxanthine He is currently focused on research tooling, GPU-adjacent systems, and long-form writing that
          sits between literary essays and technical notes.
        </p>
        <p>
          联系方式保持最小化：
          <a class="inline-link" href={siteConfig.github} target="_blank" rel="noreferrer">GitHub</a>
          和
          <a class="inline-link" href={\`mailto:\${siteConfig.email}\`}>Email</a>。
        </p>
      </div>
    </div>
  </section>
</BaseLayout>
`;
  await fs.writeFile(path.join(repoRoot, 'src/pages/about.astro'), content);
}

async function updateLandingPage() {
  const filePath = path.join(repoRoot, 'src/pages/index.astro');
  const raw = await fs.readFile(filePath, 'utf8');
  const next = raw.replace(
    /<div class="content-shell space-y-4 text-muted md:mx-0 md:max-w-\[760px\] md:px-0">[\s\S]*?<\/div>/,
    `<div class="content-shell space-y-4 text-muted md:mx-0 md:max-w-[760px] md:px-0">
        <p>
          The rebuilt site now carries forward the legacy Hexo archive as three main flows: literary posts, technical
          and course notes, plus structured publications.
        </p>
        <p>
          The migration keeps the old writing readable while flattening the old category system into the final seven-tag
          taxonomy used by the Astro rebuild.
        </p>
      </div>`,
  );
  await fs.writeFile(filePath, next);
}

async function ensureNoteKatex() {
  const filePath = path.join(repoRoot, 'src/layouts/NoteLayout.astro');
  const raw = await fs.readFile(filePath, 'utf8');
  if (raw.includes("import katexCss from 'katex/dist/katex.min.css?raw';")) {
    return;
  }
  const next = raw
    .replace("import type { CollectionEntry } from 'astro:content';\n", "import type { CollectionEntry } from 'astro:content';\n\nimport katexCss from 'katex/dist/katex.min.css?raw';\n")
    .replace("const metaDescription = entry.data.description ?? 'Note detail page';\n", "const metaDescription = entry.data.description ?? 'Note detail page';\nconst katexStyles = katexCss;\n")
    .replace('<BaseLayout title={entry.data.title} description={metaDescription}>', '<BaseLayout title={entry.data.title} description={metaDescription}>\n  <style slot=\"head\" is:inline set:html={katexStyles} />');
  await fs.writeFile(filePath, next);
}

async function run() {
  const summary = {
    migratedEntries: [],
    skippedEntries: [],
    imageDownloads: [],
    imagePlan: [],
    fallbackPaths: [],
    brokenLinkActions: [],
    publicCopies: [],
  };

  await emptyDir(path.join(contentRoot, 'posts'));
  await emptyDir(path.join(contentRoot, 'notes'));
  await emptyDir(path.join(contentRoot, 'publications'));
  await emptyDir(assetsRoot);

  await copyDirIfExists(path.join(sourceRoot, 'files'), path.join(publicRoot, 'files'));
  await copyDirIfExists(path.join(sourceRoot, 'imgs'), path.join(publicRoot, 'imgs'));
  summary.publicCopies.push('public/files/**/*');
  summary.publicCopies.push('public/imgs/**/*');

  const allPostFiles = (await walkFiles(postsRoot))
    .filter((filePath) => filePath.endsWith('.md') || filePath.endsWith('.markdown'))
    .map((filePath) => path.relative(postsRoot, filePath).split(path.sep).join('/'));

  let processed = 0;
  for (const relativePath of allPostFiles) {
    if (PAGE_FILES.has(relativePath)) {
      continue;
    }
    const plan = COLLECTION_PLAN[relativePath];
    if (!plan) {
      summary.skippedEntries.push({ file: relativePath, reason: 'No migration plan entry found.' });
      continue;
    }

    try {
      await writeCollectionEntry({ relativePath, ...plan }, summary);
      processed += 1;
      if (processed % 5 === 0) {
        console.log(`[migrate] processed ${processed} collection entries`);
      }
    } catch (error) {
      summary.skippedEntries.push({ file: relativePath, reason: String(error) });
    }
  }

  const downloadsByUrl = new Map();
  for (const item of summary.imagePlan) {
    if (!downloadsByUrl.has(item.source)) {
      downloadsByUrl.set(item.source, item.target);
    }
  }

  let downloadCount = 0;
  for (const [url, relativeTarget] of downloadsByUrl.entries()) {
    const targetPath = path.join(repoRoot, relativeTarget);
    const result = await downloadWithRetry(url, targetPath);
    summary.imageDownloads.push({ url, target: relativeTarget, ...result });
    downloadCount += 1;
    if (downloadCount % 20 === 0) {
      console.log(`[migrate] downloaded ${downloadCount}/${downloadsByUrl.size} external images`);
    }
  }

  await writePublications();
  await writeCoursesPage();
  await writeAboutPage();
  await updateLandingPage();
  await ensureNoteKatex();

  await fs.writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`[migrate] done: ${summary.migratedEntries.length} entries, ${summary.imageDownloads.length} image downloads, ${summary.skippedEntries.length} skips`);
}

await run();
