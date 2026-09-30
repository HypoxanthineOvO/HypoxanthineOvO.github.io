// 本地 preview 验收（DESIGN.md §9）：对运行中的站点做结构与交互断言。
// 用法：`python3 -m http.server 4173 -d dist`，然后 `node scripts/validate-site.mjs`
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:4173';
const candidates = [
  process.env.PW_CHROME,
  `${homedir()}/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome`,
  `${homedir()}/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome`,
].filter(Boolean);
const executablePath = candidates.find(existsSync);

const failures = [];
const ok = (name, cond, detail = '') => {
  if (cond) console.log(`  ok  ${name}`);
  else { failures.push(`${name}${detail ? ` (${detail})` : ''}`); console.log(`FAIL  ${name} ${detail}`); }
};

const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const goto = (path) => page.goto(BASE_URL + encodeURI(path), { waitUntil: 'networkidle' });

// ---- 壳与首页 ----
await goto('/');
ok('home: 七扇门卡片', (await page.locator('.door').count()) === 7);
ok('home: 真名署名', (await page.locator('.intro__name').textContent()) === '贺云翔');
ok('home: 头像真图', await page.locator('.intro__photo').evaluate((el) => el.complete && el.naturalWidth > 10));
ok('home: 卡片墙无重叠', await page.evaluate(() => {
  const rects = [...document.querySelectorAll('.door')].map((d) => d.getBoundingClientRect());
  for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) {
    const a = rects[i], b = rects[j];
    if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 8 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 8) return false;
  }
  return true;
}));
const before = await page.evaluate(() => document.documentElement.dataset.theme);
await page.click('#themeBtn');
ok('shell: 主题切换', (await page.evaluate(() => document.documentElement.dataset.theme)) !== before);
ok('shell: 导航含七门+档案+关于', await page.locator('.topnav a').count() >= 9);

// ---- 各门 ----
await goto('/research');
ok('research: 论文卡片', (await page.locator('.paper-card').count()) >= 8);
await goto('/research/scar-neural-rendering-accelerator');
ok('research: paper 详情居中标题', await page.evaluate(() => getComputedStyle(document.querySelector('.paperdoc h1')).textAlign === 'center'));

await goto('/work');
ok('work: 精选卡片', (await page.locator('.bignet').count()) === 6);
await goto('/work/vspi');
ok('work: GitHub 卡存在', (await page.locator('.ghcard').count()) === 1);

await goto('/essays');
ok('essays: 列表', (await page.locator('.essayrow').count()) === 4);
await goto('/essays/楼林');
ok('essays: 古典引用居中楷体', await page.evaluate(() => {
  const el = document.querySelector('.md-body blockquote');
  const cs = getComputedStyle(el);
  return cs.textAlign === 'center' && cs.fontFamily.includes('Kaiti');
}));

await goto('/poetry');
ok('poetry: 合集册页', (await page.locator('.vol').count()) === 3);
await goto('/poetry/2024年诗词创作');
ok('poetry: 正文居中', await page.evaluate(() => {
  const p = document.querySelector('.poemdoc p:not(.doc-kicker):not(.doc-meta):not(.doc-end)');
  return p && getComputedStyle(p).textAlign === 'center';
}));

await goto('/study');
ok('study: 学期分组', (await page.locator('.term').count()) >= 5);

await goto('/publish');
ok('publish: 日报+长文双栏', (await page.locator('.daily-hero').count()) === 1 && (await page.locator('.art').count()) === 10);

await goto('/notes');
ok('notes: 诚实空态', (await page.locator('.empty h2').textContent()) === '这个栏目在重写');

await goto('/archive');
ok('archive: 时间线条目', (await page.locator('.row').count()) >= 30);
await page.fill('#archiveSearch', '楼林');
await page.waitForTimeout(200);
const visibleRows = await page.evaluate(() => [...document.querySelectorAll('.row')].filter((r) => r.style.display !== 'none').length);
ok('archive: 搜索过滤', visibleRows === 1, `visible=${visibleRows}`);

// ---- 重定向抽查（meta-refresh 页会自行导航，用 HTTP 请求直查内容） ----
for (const [old, expectStartsWith] of [
  ['/wechat', '/publish'],
  ['/posts/楼林', '/essays/'],
  ['/search', '/archive'],
]) {
  const res = await page.request.get(BASE_URL + encodeURI(old));
  const html = await res.text();
  const meta = html.match(/content="0;url=([^"]+)"/)?.[1] ?? '';
  ok(`redirect: ${old}`, res.status() === 200 && meta.includes(expectStartsWith), meta.slice(0, 60));
}

await browser.close();
console.log(failures.length ? `\n${failures.length} 项失败` : '\n全部通过');
process.exit(failures.length ? 1 : 0);
