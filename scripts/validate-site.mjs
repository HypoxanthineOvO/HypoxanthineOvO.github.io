// 本地 preview 验收：对运行中的站点做结构与交互断言。
// 用法：`python3 -m http.server 4173 -d dist`，然后 `node scripts/validate-site.mjs`
import { chromium } from 'playwright';

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:4173';

const failures = [];
const ok = (name, cond, detail = '') => {
  if (cond) console.log(`  ok  ${name}`);
  else { failures.push(`${name}${detail ? ` (${detail})` : ''}`); console.log(`FAIL  ${name} ${detail}`); }
};

const browser = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(e.message));
const goto = (path) => page.goto(BASE_URL + encodeURI(path), { waitUntil: 'networkidle' });
const noOverflow = () => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);

// ---- 首页 ----
await goto('/');
ok('home: 品牌名', (await page.locator('.hero h1').textContent())?.startsWith('飘零'));
ok('home: 完整群像封面加载', await page.locator('.scene-poster').evaluate((el) => el.complete && el.naturalWidth > 10));
await page.waitForFunction(() => {
  const video = document.querySelector('.scene-video');
  return video && !video.paused && video.currentTime > .2;
}, undefined, { timeout: 15000 });
ok('home: 封面静音循环播放', await page.locator('.scene-video').evaluate((el) => el.muted && el.loop && el.playsInline && el.videoWidth > 0));
await page.getByRole('button', { name: '暂停动态封面' }).click();
ok('home: 封面可以暂停', await page.locator('.scene-video').evaluate((el) => el.paused));
await page.getByRole('button', { name: '播放动态封面' }).click();
await page.waitForFunction(() => !document.querySelector('.scene-video').paused);
ok('home: 封面可以恢复播放', await page.locator('.scene-video').evaluate((el) => !el.paused));
ok('home: 平台入口含 B站链接', (await page.locator('.platforms a[href*="bilibili.com"]').count()) === 1);
ok('home: 内容区三主线导览', (await page.locator('#content .pillar').count()) === 3);
ok('home: 视频区 1 主推 + 3 侧栏 + 1 制作中', (await page.locator('#content .v-lead').count()) === 1 && (await page.locator('#content .v-row').count()) === 3 && (await page.locator('#content .v-soon').count()) === 1);
ok('home: 文章区 5 篇', (await page.locator('#content .art-lead, #content .art').count()) === 5);
ok('home: 项目不再分组', (await page.locator('#projects .layer').count()) === 0);
ok('home: 项目 6 张卡', (await page.locator('#projects .show-row, #projects .trio-card').count()) === 6);
ok('home: Minecraft 详情入口', (await page.locator('#projects a[href="/work/hypomc"]').count()) >= 1 && (await page.locator('#projects a[href="/work/panlong"]').count()) >= 1);
ok('home: 研究时间线与小卡片', (await page.locator('#research .milestone').count()) === 6 && (await page.locator('#research .research-card').count()) === 5);
ok('home: 项目图标全部加载', await page.locator('#projects .ic').evaluateAll((els) => els.every((el) => el.complete && el.naturalWidth > 10)));
for (const demo of ['vspi', 'hypodoc', 'workflow', 'expression', 'info', 'class']) {
  const el = page.locator(`#projects [data-demo="${demo}"]`);
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2600);
  const moving = await el.evaluate((root) => root.textContent.length);
  ok(`home: ${demo} 演示在播放`, moving > 20, `len=${moving}`);
}
await page.click('#content .v-lead');
await page.waitForFunction(() => {
  const v = document.getElementById('vmodalVideo');
  return !document.getElementById('vmodal').hidden && v.readyState >= 2 && v.duration > 300;
}, null, { timeout: 15000 }).catch(() => {});
ok('home: 视频弹窗播放', await page.evaluate(() => {
  const v = document.getElementById('vmodalVideo');
  return !document.getElementById('vmodal').hidden && v.readyState >= 2 && v.duration > 300;
}));
await page.keyboard.press('Escape');
ok('home: Minecraft 分成两个作品', (await page.locator('.mc-group').count()) === 2);
const firstMagic = page.locator('.mc-tab').nth(3);
await firstMagic.scrollIntoViewIfNeeded();
await firstMagic.hover();
ok('home: 切到盘龙截图时作品名跟着换', (await page.locator('#mcbadge').textContent()) === '盘龙');
ok('home: 写作区不含技术笔记', !(await page.locator('#writing').textContent()).includes('技术笔记'));
ok('home: 导航 5 项', (await page.locator('.topnav a').count()) === 5);
ok('home: 无横向溢出', await noOverflow());

// ---- 分区页 ----
await goto('/content');
ok('content: 视频与文章', (await page.locator('.item').count()) === 10);
ok('content: 三主线导览', (await page.locator('.pillar').count()) === 3);
await goto('/content/ai-writing-tics');
ok('content: 文章插图加载', await page.locator('.md-body img').evaluateAll((els) => els.length >= 5 && els.every((el) => el.complete && el.naturalWidth > 10)));
await goto('/content/video-ai-flavor');
ok('content: 视频页链到文字版', (await page.locator('.related[href="/content/ai-writing-tics"]').count()) === 1);

await goto('/work');
ok('work: 稳定项目链到详情', (await page.locator('a.proj[href="/work/vspi"]').count()) === 1);
ok('work: Minecraft 两张卡直达详情', (await page.locator('a.proj[href="/work/hypomc"]').count()) === 1 && (await page.locator('a.proj[href="/work/panlong"]').count()) === 1);
ok('work: 项目不再分组', (await page.locator('.layer-head').count()) === 0 && (await page.locator('.proj').count()) === 8);
await goto('/work/vspi');
ok('work: VSPi 详情有 GitHub 卡', (await page.locator('.ghcard').count()) === 1);
ok('work: Workflow 3.0 有详情页', (await page.request.get(`${BASE_URL}/work/hypo-workflow`).then((r) => r.text())).includes('v3.0.0'));
ok('work: VSPi 详情有演示', (await page.locator('.bigdemo [data-demo="vspi"]').count()) === 1);
await goto('/work/hypomc');
ok('work: HypoMC 痛点矩阵', (await page.locator('.pain').count()) === 5 && (await page.locator('.mod').count()) >= 13 && (await page.locator('.gal-grid figure').count()) === 3);
await goto('/work/panlong');
ok('work: 盘龙 7 系法术矩阵', (await page.locator('.el').count()) === 7 && (await page.locator('.gal-grid figure').count()) === 5);
await goto('/work/hypo-info');
ok('work: Hypo-Info 详情页与演示', (await page.locator('.bigdemo [data-demo="info"]').count()) === 1);

await goto('/research');
ok('research: 论文与模拟器卡片', (await page.locator('.research-card').count()) === 5);
ok('research: 保留第三作者的早期论文', (await page.locator('[data-milestone="first-paper"]').textContent()).includes('第三作者'));
ok('research: 模拟器在首次一作投稿之前', await page.locator('.milestone').evaluateAll((nodes) => nodes.findIndex((node) => node.dataset.milestone === 'ngp-cmodel') < nodes.findIndex((node) => node.dataset.milestone === 'first-author-paper')));
ok('research: 低温研究未完待续', (await page.locator('[data-milestone="cryo-gpu"]').textContent()).includes('未完待续'));
ok('research: 作者名正常', !(await page.locator('.research-timeline').textContent()).includes('[object Object]'));
ok('research: 无横向溢出', await noOverflow());

await goto('/writing');
ok('writing: 三个栏目', (await page.locator('.col').count()) === 3);
await goto('/essays/楼林');
ok('essays: 古典引用居中楷体', await page.evaluate(() => {
  const cs = getComputedStyle(document.querySelector('.md-body blockquote'));
  return cs.textAlign === 'center' && cs.fontFamily.includes('Kaiti');
}));
await goto('/poetry/2024年诗词创作');
ok('poetry: 正文居中', await page.evaluate(() => {
  const p = document.querySelector('.poemdoc p:not(.doc-kicker):not(.doc-meta):not(.doc-end)');
  return p && getComputedStyle(p).textAlign === 'center';
}));
await goto('/study');
ok('study: 学期分组', (await page.locator('.term').count()) >= 5);
await goto('/about');
ok('about: 脱敏且无残留导师', await page.locator('.lead').textContent().then((t) => !t.includes('娄鑫') && !t.includes('贺云翔') && !t.includes('导师')));

// ---- 移动端 ----
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(BASE_URL + '/', { waitUntil: 'networkidle' });
ok('mobile: 无横向溢出', await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
await mobile.click('#menuBtn');
ok('mobile: 菜单展开', await mobile.locator('#mobileNav').isVisible());

const still = await browser.newPage({ reducedMotion: 'reduce' });
let heroVideoRequested = false;
still.on('request', (request) => { if (request.url().endsWith('/hero-classroom.mp4')) heroVideoRequested = true; });
await still.goto(BASE_URL + '/', { waitUntil: 'networkidle' });
ok('motion: 减少动态效果时不加载封面视频', !heroVideoRequested && await still.locator('.scene-video').evaluate((el) => el.paused && !el.getAttribute('src')));
ok('motion: 静态封面完整显示', await still.locator('.scene-poster').evaluate((el) => el.complete && el.naturalWidth > 0));
await still.close();

const fallback = await browser.newPage();
await fallback.route('**/hero-classroom.mp4', (route) => route.abort());
await fallback.goto(BASE_URL + '/', { waitUntil: 'networkidle' });
await fallback.waitForFunction(() => document.querySelector('.scene-video').error !== null);
ok('motion: 视频失败后保留静态封面', !(await fallback.locator('.hero-scene').getAttribute('class')).includes('has-video') && await fallback.locator('.scene-poster').evaluate((el) => el.complete && el.naturalWidth > 0));
await fallback.close();

// ---- 旧地址跳转（meta-refresh 页，用 HTTP 请求直查内容） ----
for (const [old, expect] of [
  ['/wechat/articles/hypo-workflow-introduction', '/content'],
  ['/publish', '/content'],
  ['/wechat/daily/2026-08-23', '/content'],
  ['/notes/cuda', '/'],
  ['/archive', '/'],
  ['/posts/楼林', '/essays/'],
  ['/projects/vspi', '/work/vspi'],
]) {
  const res = await page.request.get(BASE_URL + encodeURI(old));
  const meta = (await res.text()).match(/content="0;url=([^"]+)"/)?.[1] ?? '';
  ok(`redirect: ${old}`, res.status() === 200 && decodeURI(meta).startsWith(expect), meta.slice(0, 60));
}

ok('no page errors', pageErrors.length === 0, pageErrors.join(' | '));

await browser.close();
console.log(failures.length ? `\n${failures.length} 项失败` : '\n全部通过');
process.exit(failures.length ? 1 : 0);
