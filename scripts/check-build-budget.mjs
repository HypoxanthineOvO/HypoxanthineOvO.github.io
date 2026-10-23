// Build-time guardrails: requests are measured separately by benchmark-performance.mjs.
import { readFile, stat, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { load } from 'cheerio';
const $ = load(await readFile('dist/index.html', 'utf8'));
const fonts = JSON.parse(await readFile('dist/font-subsets.json', 'utf8'));
const css = $('link[rel="stylesheet"]').map((_, el) => $(el).attr('href')).get();
let cssGzipBytes = 0;
for (const url of css) cssGzipBytes += gzipSync(await readFile('dist' + url)).length;
const fontBytes = fonts.pages['/index.html'].availableFontBytes;
const hero = $('.scene-poster');
const heroDefaultBytes = (await stat('dist' + hero.attr('src'))).size;
const report = { homeFontBytes: fontBytes, homeStylesGzipBytes: cssGzipBytes, heroDefaultBytes };
// Conservative upper bound for all eight original weights (including runtime text).
// Initial measured subset is ~910KB; keep 10% headroom without changing typography.
const limits = { homeFontBytes: 1_000_000, homeStylesGzipBytes: 60_000, heroDefaultBytes: 250_000 };
for (const [key, max] of Object.entries(limits)) {
  if (report[key] > max) throw new Error(`${key}: ${report[key]} exceeds build budget ${max}. Investigate before changing the budget.`);
}
if (!hero.attr('srcset')) throw new Error('Hero responsive images missing');
if ($('.hero-scene video').length) throw new Error('Hero must not eagerly load video');
await writeFile('dist/performance-budget.json', JSON.stringify({ measured: report, limits }, null, 2));
console.log('Build budgets passed:', report);
