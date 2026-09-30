import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(root, 'shots'), { recursive: true });

// 仓库 playwright 版本与缓存里的浏览器版本可能错位；有哪个用哪个。
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
const candidates = [
  process.env.PW_CHROME,
  `${homedir()}/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome`,
  `${homedir()}/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome`,
].filter(Boolean);
const executablePath = candidates.find(existsSync);
const browser = await chromium.launch(executablePath ? { executablePath } : {});

async function shot(url, path, { viewport = { width: 1440, height: 1000 }, setup } = {}) {
  const page = await browser.newPage({ viewport });
  await page.goto(url);
  await page.waitForTimeout(600);
  if (setup) await setup(page);
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(root, 'shots', path), fullPage: true });
  await page.close();
  console.log('shot:', path);
}

const base = `file://${root}`;

await shot(`${base}/home-v1.html`, 'home-light.png');
await shot(`${base}/home-v1.html`, 'home-dark.png', {
  setup: (p) => p.click('#themeBtn'),
});
await shot(`${base}/essay-skins-v1.html`, 'essay-classical.png');
await shot(`${base}/essay-skins-v1.html`, 'essay-modern.png', {
  setup: (p) => p.click('[data-skin-btn="essay-modern"]'),
});
await shot(`${base}/home-v1.html`, 'home-mobile.png', {
  viewport: { width: 390, height: 844 },
});

// 六门 mock：亮色全页 + 暗色全页
const gates = ['research', 'work', 'poetry', 'publish', 'study', 'notes'];
for (const gate of gates) {
  await shot(`${base}/${gate}-v1.html`, `${gate}-light.png`);
  await shot(`${base}/${gate}-v1.html`, `${gate}-dark.png`, {
    setup: (p) => p.click('#themeBtn'),
  });
}
await shot(`${base}/research-v1.html`, 'research-mobile.png', {
  viewport: { width: 390, height: 844 },
});
await shot(`${base}/work-v1.html`, 'work-mobile.png', {
  viewport: { width: 390, height: 844 },
});

await browser.close();
console.log('done');
