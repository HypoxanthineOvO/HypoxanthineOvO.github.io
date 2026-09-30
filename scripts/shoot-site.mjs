// 对构建产物（dist）截图，供视觉验收。
// 用法：先 `python3 -m http.server 4173 -d dist`，再 `node scripts/shoot-site.mjs`
import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';

mkdirSync('shots', { recursive: true });
const candidates = [
  process.env.PW_CHROME,
  `${homedir()}/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome`,
  `${homedir()}/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome`,
].filter(Boolean);
const executablePath = candidates.find(existsSync);
const browser = await chromium.launch(executablePath ? { executablePath } : {});

const base = 'http://127.0.0.1:4173';
const shots = [
  ['/', 'home-light'],
  ['/', 'home-dark', { dark: true }],
  ['/', 'home-mobile', { viewport: [390, 844] }],
  ['/research', 'research'],
  ['/research/scar-neural-rendering-accelerator', 'paper-detail'],
  ['/work', 'work'],
  ['/work/vspi', 'work-detail'],
  ['/essays', 'essays'],
  ['/essays/楼林', 'essay-detail'],
  ['/poetry', 'poetry'],
  ['/poetry/2024年诗词创作', 'poetry-detail'],
  ['/study', 'study'],
  ['/publish', 'publish'],
  ['/publish/daily/2026-08-23', 'daily-detail'],
  ['/notes', 'notes-empty'],
  ['/archive', 'archive'],
  ['/about', 'about'],
];

for (const [path, name, opts = {}] of shots) {
  const page = await browser.newPage({
    viewport: { width: opts.viewport?.[0] ?? 1440, height: opts.viewport?.[1] ?? 1000 },
  });
  await page.goto(base + encodeURI(path), { waitUntil: 'networkidle' }).catch(() => page.goto(base + encodeURI(path)));
  if (opts.dark) await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `shots/${name}.png`, fullPage: true });
  await page.close();
  console.log('shot:', name);
}

await browser.close();
console.log('done');
