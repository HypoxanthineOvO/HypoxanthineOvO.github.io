// 项目演示动效的共用工具：进入视口才开始，偏好减少动效时直接给最终状态。
export const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function whenVisible(el: Element, start: () => void) {
  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      io.disconnect();
      start();
    }
  }, { threshold: 0.2 });
  io.observe(el);
}

export function each(selector: string, init: (el: HTMLElement) => void) {
  document.querySelectorAll<HTMLElement>(selector).forEach(init);
}

export async function typeInto(el: HTMLElement, text: string, speed = 32) {
  el.textContent = '';
  for (const ch of text) {
    el.textContent += ch;
    await sleep(speed);
  }
}
