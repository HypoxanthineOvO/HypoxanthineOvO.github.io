import fs from 'node:fs/promises';
import path from 'node:path';

import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const repoRoot = '/home/heyx/Hypo-Website';
const publicDir = path.join(repoRoot, 'public');

function resizeNearest(sourceWidth, sourceHeight, sourceData, targetWidth, targetHeight) {
  const target = Buffer.alloc(targetWidth * targetHeight * 4);

  for (let y = 0; y < targetHeight; y += 1) {
    const sourceY = Math.min(sourceHeight - 1, Math.floor((y / targetHeight) * sourceHeight));
    for (let x = 0; x < targetWidth; x += 1) {
      const sourceX = Math.min(sourceWidth - 1, Math.floor((x / targetWidth) * sourceWidth));
      const sourceIndex = (sourceY * sourceWidth + sourceX) * 4;
      const targetIndex = (y * targetWidth + x) * 4;

      target[targetIndex] = sourceData[sourceIndex];
      target[targetIndex + 1] = sourceData[sourceIndex + 1];
      target[targetIndex + 2] = sourceData[sourceIndex + 2];
      target[targetIndex + 3] = sourceData[sourceIndex + 3];
    }
  }

  return target;
}

function flattenToRgb(rgbaData, matte = { r: 244, g: 246, b: 250 }) {
  const rgb = Buffer.alloc((rgbaData.length / 4) * 4);

  for (let index = 0; index < rgbaData.length; index += 4) {
    const alpha = rgbaData[index + 3] / 255;
    rgb[index] = Math.round(rgbaData[index] * alpha + matte.r * (1 - alpha));
    rgb[index + 1] = Math.round(rgbaData[index + 1] * alpha + matte.g * (1 - alpha));
    rgb[index + 2] = Math.round(rgbaData[index + 2] * alpha + matte.b * (1 - alpha));
    rgb[index + 3] = 255;
  }

  return rgb;
}

async function writePng(filePath, width, height, data) {
  const png = new PNG({ width, height });
  png.data = data;
  await fs.writeFile(filePath, PNG.sync.write(png));
}

async function main() {
  const sourcePath = path.join(publicDir, 'avatar.png');
  const sourcePng = PNG.sync.read(await fs.readFile(sourcePath));

  const avatarSize = 512;
  const appleSize = 180;

  const avatarRgba = resizeNearest(sourcePng.width, sourcePng.height, sourcePng.data, avatarSize, avatarSize);
  const appleRgba = resizeNearest(sourcePng.width, sourcePng.height, sourcePng.data, appleSize, appleSize);

  const avatarJpeg = jpeg.encode(
    {
      width: avatarSize,
      height: avatarSize,
      data: flattenToRgb(avatarRgba),
    },
    92,
  );

  await fs.writeFile(path.join(publicDir, 'avatar.jpg'), avatarJpeg.data);
  await writePng(path.join(publicDir, 'apple-touch-icon.png'), appleSize, appleSize, appleRgba);

  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Y">
  <rect width="64" height="64" rx="16" fill="#1E3A5F" />
  <path d="M17 17h10l6 11 6-11h10L38 36v11H28V36L17 17Z" fill="#F7F8FA" />
</svg>
`;

  await fs.writeFile(path.join(publicDir, 'favicon.svg'), faviconSvg);
}

await main();
