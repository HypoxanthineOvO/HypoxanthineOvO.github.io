from __future__ import annotations

import json
import os
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageStat
from playwright.sync_api import sync_playwright


BASE_URL = os.environ.get("BASE_URL", "http://127.0.0.1:4321")
OUTPUT = Path("/tmp/hypox-site-validation")
OUTPUT.mkdir(parents=True, exist_ok=True)

VIEWPORTS = {
    "desktop": {"width": 1440, "height": 900},
    "tablet": {"width": 1024, "height": 768},
    "mobile": {"width": 390, "height": 844},
    "small-mobile": {"width": 360, "height": 800},
}


def image_signal(path: Path) -> float:
    image = Image.open(path).convert("RGB")
    return sum(ImageStat.Stat(image).var) / 3


def changed_pixels(before: Path, after: Path) -> int:
    difference = ImageChops.difference(Image.open(before).convert("RGB"), Image.open(after).convert("RGB"))
    return sum(1 for pixel in difference.getdata() if pixel != (0, 0, 0))


def main() -> int:
    failures: list[str] = []
    observations: dict[str, object] = {}
    with sync_playwright() as playwright:
        installed = sorted(Path.home().glob('.cache/ms-playwright/chromium-*/chrome-linux64/chrome'))
        browser = playwright.chromium.launch(
            headless=True,
            executable_path=str(installed[-1]) if installed else None,
            args=['--no-proxy-server'],
        )

        for name, viewport in VIEWPORTS.items():
            context = browser.new_context(viewport=viewport)
            page = context.new_page()
            console_errors: list[str] = []
            page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
            page.on("pageerror", lambda error: console_errors.append(str(error)))
            response = page.goto(BASE_URL, wait_until="networkidle")
            if not response or not response.ok:
                failures.append(f"{name}: home response was not OK")
                context.close()
                continue
            page.wait_for_timeout(700)
            page.screenshot(path=OUTPUT / f"home-{name}.png", full_page=True)

            overflow = page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
            if overflow > 1:
                failures.append(f"{name}: horizontal overflow {overflow}px")
            broken_images = page.locator("img").evaluate_all("images => images.filter(img => img.complete && img.naturalWidth === 0).map(img => img.src)")
            if broken_images:
                failures.append(f"{name}: broken images {broken_images[:3]}")
            if console_errors:
                failures.append(f"{name}: console errors {console_errors[:3]}")

            if name == "desktop":
                page.locator('[data-theme-toggle]').click()
                page.wait_for_timeout(100)
                if 'dark' not in (page.locator('html').get_attribute('class') or '').split():
                    failures.append('desktop: theme toggle did not activate dark mode')
                page.locator('[data-theme-toggle]').click()

                canvas = page.locator(".thermal-field__canvas")
                canvas.wait_for(state="visible")
                before = OUTPUT / "canvas-before.png"
                after = OUTPUT / "canvas-after.png"
                canvas.screenshot(path=before)
                page.mouse.move(1180, 380)
                page.wait_for_timeout(650)
                canvas.screenshot(path=after)
                signal = image_signal(before)
                motion = changed_pixels(before, after)
                observations["canvas_variance"] = signal
                observations["canvas_changed_pixels"] = motion
                if signal < 15:
                    failures.append(f"desktop: canvas appears blank (variance={signal:.2f})")
                if motion < 500:
                    failures.append(f"desktop: canvas does not visibly respond/move ({motion} changed pixels)")

                page.goto(f"{BASE_URL}/work", wait_until="networkidle")
                page.get_by_role("button", name="索引").click()
                if page.locator('[data-view-panel="index"]').is_hidden():
                    failures.append("desktop: Work Index view did not open")
                page.locator("[data-work-search]").fill("HypoDoc")
                page.wait_for_timeout(400)
                visible_work = page.locator('[data-view-panel="index"] [data-work-item]:visible').count()
                if visible_work != 1:
                    failures.append(f"desktop: Work search expected 1 result, got {visible_work}")

                page.goto(f"{BASE_URL}/wechat/daily/2026-08-23", wait_until="networkidle")
                card_count = page.locator(".news-card").count()
                observations["daily_2026_08_23_cards"] = card_count
                if card_count != 5:
                    failures.append(f"desktop: 2026-08-23 expected 5 news cards, got {card_count}")

                page.goto(f"{BASE_URL}/search", wait_until="networkidle")
                page.locator("[data-global-search]").fill("Cryogenic")
                page.wait_for_timeout(400)
                search_results = page.locator("[data-search-item]:visible").count()
                observations["cryogenic_search_results"] = search_results
                if search_results < 1:
                    failures.append("desktop: search returned no Cryogenic results")

            if name in {"mobile", "small-mobile"}:
                page.goto(BASE_URL, wait_until="networkidle")
                page.locator(".mobile-menu summary").click()
                if not page.locator(".mobile-menu__panel").is_visible():
                    failures.append(f"{name}: mobile menu did not open")

            context.close()

        reduced = browser.new_context(viewport=VIEWPORTS["desktop"], reduced_motion="reduce")
        page = reduced.new_page()
        page.goto(BASE_URL, wait_until="networkidle")
        page.wait_for_timeout(300)
        canvas = page.locator(".thermal-field__canvas")
        reduced_before = OUTPUT / "canvas-reduced-before.png"
        reduced_after = OUTPUT / "canvas-reduced-after.png"
        canvas.screenshot(path=reduced_before)
        page.wait_for_timeout(700)
        canvas.screenshot(path=reduced_after)
        reduced_motion = changed_pixels(reduced_before, reduced_after)
        observations["reduced_motion_changed_pixels"] = reduced_motion
        if reduced_motion > 100:
            failures.append(f"reduced-motion: canvas kept animating ({reduced_motion} changed pixels)")
        reduced.close()
        browser.close()

    report = {"failures": failures, "observations": observations, "screenshots": str(OUTPUT)}
    (OUTPUT / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2), flush=True)
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
