/** Publish-time raster derivatives. Originals remain untouched for downloads and scripts. */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { resolve, join, extname, basename, relative, dirname, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';
import sharp from 'sharp';

const root = resolve(process.argv[2] || 'dist');
const output = join(root, '_images');
await mkdir(output, { recursive: true });
async function* walk(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, item.name);
    if (item.isDirectory()) yield* walk(path);
    else if (item.name.endsWith('.html')) yield path;
  }
}
const cache = new Map();
let imageCount = 0, sourceBytes = 0, largestBytes = 0, derivativeBytes = 0;
async function variants(url, htmlPath) {
  if (!url || /^(?:[a-z]+:|\/\/|#)/i.test(url)) return null;
  const pathOnly = decodeURIComponent(url.split(/[?#]/)[0]);
  if (!/\.(png|jpe?g|webp)$/i.test(pathOnly) || pathOnly.startsWith('/_images/')) return null;
  const path = pathOnly.startsWith('/') ? resolve(root, '.' + pathOnly) : resolve(dirname(htmlPath), pathOnly);
  if (!path.startsWith(root + sep)) return null;
  if (!cache.has(path)) cache.set(path, createVariants(path));
  return cache.get(path);
}
async function createVariants(path) {
  // Missing assets must still be reported by the link validator, not silently repaired.
  const source = await readFile(path);
  const meta = await sharp(source, { animated: true }).metadata();
  if (!meta.width || !meta.height || (meta.pages || 1) > 1 || meta.width <= 128) return null;
  const hash = createHash('sha256').update(source).update('webp-v1-q86-lossless-png').digest('hex').slice(0, 16);
  const stem = basename(path, extname(path)).replace(/[^a-z0-9_-]/gi, '').slice(0, 40) || 'image';
  // Keep the native size as an option: diagrams can be opened at full resolution.
  const widths = [...new Set([400, 800, 1200, 1600, meta.width].filter(w => w <= meta.width))].sort((a, b) => a - b);
  const results = [];
  for (const width of widths) {
    const bytes = await sharp(source).rotate().resize({ width, withoutEnlargement: true })
      .webp(meta.format === 'png' ? { lossless: true, effort: 5 } : { quality: 86, effort: 5 }).toBuffer();
    // Never replace a smaller original with a larger encoding at the same resolution.
    if (width === meta.width && bytes.length >= source.length) {
      results.push({ width, url: '/' + relative(root, path).split(sep).join('/'), bytes: source.length });
      continue;
    }
    const file = `${stem}-${hash}-${width}.webp`;
    await writeFile(join(output, file), bytes);
    derivativeBytes += bytes.length;
    results.push({ width, url: `/_images/${file}`, bytes: bytes.length });
  }
  imageCount++;
  sourceBytes += source.length;
  largestBytes += results.at(-1).bytes;
  return { results, width: meta.width, height: meta.height };
}
let pages = 0;
for await (const path of walk(root)) {
  const html = await readFile(path, 'utf8');
  const $ = load(html);
  for (const image of $('img').toArray()) {
    const el = $(image);
    if (el.attr('srcset') || el.attr('data-no-optimize') !== undefined) continue;
    const deferred = !el.attr('src') && !!el.attr('data-src');
    const sourceAttr = deferred ? 'data-src' : 'src';
    const result = await variants(el.attr(sourceAttr), path);
    el.attr('decoding', el.attr('decoding') || 'async');
    if (!result) continue;
    const { results, width, height } = result;
    const chosen = results.find(r => r.width >= 800) || results.at(-1);
    el.attr(sourceAttr, chosen.url);
    el.attr(deferred ? 'data-srcset' : 'srcset', results.map(r => `${r.url} ${r.width}w`).join(', '));
    el.attr('sizes', el.attr('sizes') || (Number(el.attr('width')) <= 128 ? `${el.attr('width')}px` : '(max-width: 800px) 100vw, 800px'));
    if (!el.attr('width') && !el.attr('height')) el.attr({ width: String(width), height: String(height) });
  }
  await writeFile(path, $.html());
  pages++;
}
const report = { pages, images: imageCount, sourceBytes, largestVariantBytes: largestBytes, generatedVariantBytes: derivativeBytes };
await writeFile(join(root, 'image-optimization.json'), JSON.stringify(report, null, 2) + '\n');
console.log('Image optimization:', JSON.stringify(report));
