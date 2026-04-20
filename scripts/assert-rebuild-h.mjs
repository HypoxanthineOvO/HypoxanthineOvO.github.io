import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import * as cheerio from 'cheerio';

const mode = process.argv[2] ?? 'default';
const repoRoot = '/home/heyx/Hypo-Website';
const distRoot = path.join(repoRoot, 'dist');

const draftEntries = [
  { id: 'c-and-cpp', file: 'src/content/notes/c-and-cpp.mdx', title: '【环境配置】C 与 C++ 的编译环境' },
  { id: 'cuda', file: 'src/content/notes/cuda.mdx', title: '【环境配置】CUDA环境配置' },
  { id: 'latex', file: 'src/content/notes/latex.mdx', title: '【环境配置】LaTeX 环境配置' },
  { id: 'marp', file: 'src/content/notes/marp.mdx', title: '【实用工具】Marp 和 ShanghaiTech Marp 主题' },
  { id: 'python', file: 'src/content/notes/python.mdx', title: '【环境配置】Python 环境与 Conda' },
  { id: 'ssh', file: 'src/content/notes/ssh.mdx', title: '【环境配置】SSH 远程连接' },
  { id: '前端仿真', file: 'src/content/notes/前端仿真.mdx', title: '【数字IC设计】使用 VCS 与 Verdi 的前端仿真流程' },
  { id: 'testbench编写基础', file: 'src/content/notes/testbench编写基础.mdx', title: '【数字IC设计】Testbench 编写基础' },
  { id: 'paper-3dgaussian', file: 'src/content/notes/paper-3dgaussian.mdx', title: '【PaperReading】3D Gaussian Splattting' },
  { id: 'paper-neurex', file: 'src/content/notes/paper-neurex.mdx', title: '【PaperReading】NeuRex' },
  { id: 'paper-rtnerfandinstant3d', file: 'src/content/notes/paper-rtnerfandinstant3d.mdx', title: '【PaperReading】RTNeRF & Instant3D' },
  {
    id: '辐射场中的显式表达和隐式表达',
    file: 'src/content/notes/辐射场中的显式表达和隐式表达.mdx',
    title: '【科研思考】辐射场中的显式表达和隐式表达',
  },
  {
    id: 'metax-gpu-ecosystem',
    file: 'src/content/notes/metax-gpu-ecosystem.mdx',
    title: '【讲座笔记】从 0 开始构建 GPU 生态——以沐曦集成电路（MeTax）为例',
  },
];

const techSeriesSlugs = ['tooling-env', 'tooling-ops', 'tooling-hardware', 'research-nerf', 'research-cryo', 'research-essay'];
const noticeKeyword = '正在重写中';

function decodeHref(href) {
  try {
    return decodeURIComponent(href);
  } catch {
    return href;
  }
}

function readDist(file) {
  return fs.readFileSync(path.join(distRoot, file), 'utf8');
}

function normalizePath(value) {
  try {
    const url = new URL(value);
    return decodeHref(url.pathname.replace(/\/$/, ''));
  } catch {
    return decodeHref(value.replace(/\/$/, ''));
  }
}

function extractEntryHrefsFromHtml(file) {
  const html = readDist(file);
  const $ = cheerio.load(html);
  return $('a[href]')
    .map((_, element) => decodeHref($(element).attr('href') ?? ''))
    .get()
    .filter((href) => href.startsWith('/notes/') || href.startsWith('/posts/'));
}

function extractRssLinks() {
  const xml = readDist('rss.xml');
  const $ = cheerio.load(xml, { xmlMode: true });
  return $('item > link')
    .map((_, element) => normalizePath($(element).text().trim()))
    .get();
}

function runGit(args) {
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' }).trim();
}

function assertResult(results, ok, name, detail) {
  results.push({ ok, name, detail });
}

function allDraftPaths() {
  return draftEntries.map((entry) => `/notes/${entry.id}`);
}

function hasAnyDraftHref(hrefs) {
  return allDraftPaths().some((slug) => hrefs.includes(slug));
}

function countSeriesEntries(file) {
  return extractEntryHrefsFromHtml(file).length;
}

function runDefaultAssertions() {
  const results = [];
  const notesIndexHrefs = extractEntryHrefsFromHtml('notes/index.html');

  assertResult(results, !hasAnyDraftHref(notesIndexHrefs), 'dist/notes/index.html 不含 13 个 draft slug', notesIndexHrefs.join(', '));
  assertResult(results, !hasAnyDraftHref(extractEntryHrefsFromHtml('series/tooling-env/index.html')), 'dist/series/tooling-env/index.html 不含任何 draft slug');
  assertResult(
    results,
    !hasAnyDraftHref(extractEntryHrefsFromHtml('series/tooling-hardware/index.html')),
    'dist/series/tooling-hardware/index.html 不含任何 draft slug'
  );
  assertResult(results, !hasAnyDraftHref(extractEntryHrefsFromHtml('series/research-nerf/index.html')), 'dist/series/research-nerf/index.html 不含任何 draft slug');
  assertResult(results, !hasAnyDraftHref(extractEntryHrefsFromHtml('series/research-essay/index.html')), 'dist/series/research-essay/index.html 不含任何 draft slug');
  assertResult(results, countSeriesEntries('series/essay/index.html') === 4, 'dist/series/essay/index.html 命中 4 篇', `count=${countSeriesEntries('series/essay/index.html')}`);
  assertResult(results, countSeriesEntries('series/poetry/index.html') === 3, 'dist/series/poetry/index.html 命中 3 篇', `count=${countSeriesEntries('series/poetry/index.html')}`);

  const rssLinks = extractRssLinks();
  assertResult(results, !allDraftPaths().some((slug) => rssLinks.includes(slug)), 'dist/rss.xml 不含 13 个 draft slug');
  assertResult(results, rssLinks.length === 7, 'dist/rss.xml 含 essay / poetry 共 7 篇', `count=${rssLinks.length}`);

  const toolingEnvHtml = readDist('series/tooling-env/index.html');
  assertResult(results, toolingEnvHtml.includes(noticeKeyword), 'dist/series/tooling-env/index.html 含公告关键字「正在重写中」');

  const techNoticePages = techSeriesSlugs.map((slug) => ({
    slug,
    hasNotice: readDist(`series/${slug}/index.html`).includes(noticeKeyword),
  }));
  assertResult(
    results,
    techNoticePages.every((item) => item.hasNotice),
    '6 个技术类 series 页都含公告关键字',
    techNoticePages.map((item) => `${item.slug}:${item.hasNotice}`).join(', ')
  );

  assertResult(results, !readDist('index.html').includes(noticeKeyword), 'dist/index.html 不含公告关键字（首页不挂）');
  assertResult(results, countSeriesEntries('series/humanities/index.html') === 9, 'dist/series/humanities/index.html 仍可访问且含 9 篇', `count=${countSeriesEntries('series/humanities/index.html')}`);
  assertResult(results, readDist('posts/index.html').includes(noticeKeyword), 'dist/posts/index.html 含 global 公告关键字');

  return results;
}

function runPreviewAssertions() {
  const results = [];
  const rssLinks = extractRssLinks();

  assertResult(results, countSeriesEntries('series/tooling-env/index.html') === 6, 'dist/series/tooling-env/index.html 命中 6 篇', `count=${countSeriesEntries('series/tooling-env/index.html')}`);
  assertResult(results, countSeriesEntries('series/research-nerf/index.html') === 3, 'dist/series/research-nerf/index.html 命中 3 篇', `count=${countSeriesEntries('series/research-nerf/index.html')}`);
  assertResult(results, allDraftPaths().every((slug) => rssLinks.includes(slug)), 'dist/rss.xml 含 13 个 draft slug');
  assertResult(results, readDist('series/tooling-env/index.html').includes(noticeKeyword), 'preview 模式下公告仍然显示');

  return results;
}

function runSourceAssertions() {
  const results = [];

  assertResult(
    results,
    draftEntries.every((entry) => fs.existsSync(path.join(repoRoot, entry.file))),
    '13 个 draft 源文件全部存在'
  );

  const draftCommit = runGit(['log', '--format=%H', '--grep=content: mark 13 legacy tech posts as draft for rewrite', '-n', '1']);
  const schemaCommit = runGit(['log', '--format=%H', '--grep=feat(schema): add draft field to posts and notes', '-n', '1']);

  const perFileDraftOnly = draftEntries.every((entry) => {
    const diff = runGit(['diff', '--unified=0', schemaCommit, draftCommit, '--', entry.file]);
    const plusLines = diff
      .split('\n')
      .filter((line) => line.startsWith('+') && !line.startsWith('+++'))
      .map((line) => line.slice(1));
    const minusLines = diff.split('\n').filter((line) => line.startsWith('-') && !line.startsWith('---'));
    return plusLines.length === 1 && plusLines[0] === 'draft: true' && minusLines.length === 0;
  });

  assertResult(results, perFileDraftOnly, '每个 draft 文件的 frontmatter 只新增了 draft: true 一行');

  const changedFiles = runGit(['diff', '--name-only', '88ff80d..HEAD']).split('\n').filter(Boolean);
  const forbiddenTouched = changedFiles.filter(
    (file) =>
      file.startsWith('src/content/publications/') ||
      file.startsWith('src/content/projects/') ||
      [
        'src/content/posts/灯河.mdx',
        'src/content/posts/楼林.mdx',
        'src/content/posts/行见录-相逢篇.mdx',
        'src/content/posts/行见录-遗憾篇.mdx',
        'src/content/posts/2021下半年-2022年诗词创作.mdx',
        'src/content/posts/2023年诗词创作.mdx',
        'src/content/posts/2024年诗词创作.mdx',
        'src/content/posts/不醒人之梦-创作小记.mdx',
        'src/content/posts/你见过停滞在空中的云吗.mdx',
        'src/content/posts/元代之后陆上丝绸之路凋敝的必然性.mdx',
        'src/content/posts/婉约词中的风骨.mdx',
        'src/content/posts/宋词中的感性和理性.mdx',
        'src/content/posts/宋词导读拍照配词.mdx',
        'src/content/posts/智能的逆流与边界.mdx',
        'src/content/posts/马克思技术观在当代的应用和启示.mdx',
        'src/content/notes/中国芯片的前世今生.mdx',
      ].includes(file)
  );

  assertResult(
    results,
    forbiddenTouched.length === 0,
    'git diff --name-only 不出现 publications / projects / humanities / essay / poetry 的 mdx',
    forbiddenTouched.join(', ')
  );

  return results;
}

const results =
  mode === 'default' ? runDefaultAssertions() : mode === 'preview' ? runPreviewAssertions() : runSourceAssertions();

for (const result of results) {
  console.log(`${result.ok ? '[PASS]' : '[FAIL]'} ${result.name}${result.detail ? ` :: ${result.detail}` : ''}`);
}

if (results.some((result) => !result.ok)) {
  process.exit(1);
}
