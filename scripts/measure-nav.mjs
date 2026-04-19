import { chromium, firefox, webkit } from 'playwright';

const origin = process.argv[2] ?? 'http://127.0.0.1:4321';
const paths = ['/', '/posts'];
const browserName = process.argv[3] ?? 'firefox';

const browserTypes = {
  chromium,
  firefox,
  webkit,
};

if (!(browserName in browserTypes)) {
  throw new Error(`Unsupported browser "${browserName}". Use one of: ${Object.keys(browserTypes).join(', ')}`);
}

const browser = await browserTypes[browserName].launch({ headless: true });
const page = await browser.newPage({
  viewport: {
    width: 1440,
    height: 900,
  },
});

for (const path of paths) {
  await page.goto(new URL(path, origin).toString(), { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    if ('fonts' in document) {
      await document.fonts.ready;
    }
  });

  const metrics = await page.evaluate(() => {
    const navLinks = Array.from(document.querySelectorAll('nav[aria-label="Primary"] a'));
    const themeToggle = document.querySelector('[data-theme-toggle]');

    const readRect = (element, label) => {
      const rect = element.getBoundingClientRect();
      const parent = element.parentElement;
      const parentRect = parent?.getBoundingClientRect();

      return {
        label,
        top: Number(rect.top.toFixed(3)),
        bottom: Number(rect.bottom.toFixed(3)),
        height: Number(rect.height.toFixed(3)),
        parentTop: parentRect ? Number(parentRect.top.toFixed(3)) : null,
        parentBottom: parentRect ? Number(parentRect.bottom.toFixed(3)) : null,
        parentHeight: parentRect ? Number(parentRect.height.toFixed(3)) : null,
        lineHeight: window.getComputedStyle(element).lineHeight,
        fontWeight: window.getComputedStyle(element).fontWeight,
        fontFamily: window.getComputedStyle(element).fontFamily,
        display: window.getComputedStyle(element).display,
        alignSelf: window.getComputedStyle(element).alignSelf,
        parentDisplay: parent ? window.getComputedStyle(parent).display : null,
      };
    };

    return [
      ...navLinks.map((link) => readRect(link, link.textContent?.trim() ?? '(empty)')),
      ...(themeToggle ? [readRect(themeToggle, 'ThemeToggle')] : []),
    ];
  });

  for (const item of metrics) {
    console.log(
      `[${path}] ${item.label}: top=${item.top} bottom=${item.bottom} height=${item.height} lineHeight=${item.lineHeight} fontWeight=${item.fontWeight} fontFamily=${item.fontFamily}`,
      ` parentTop=${item.parentTop} parentBottom=${item.parentBottom} parentHeight=${item.parentHeight} display=${item.display} parentDisplay=${item.parentDisplay} alignSelf=${item.alignSelf}`,
    );
  }
}

await browser.close();
