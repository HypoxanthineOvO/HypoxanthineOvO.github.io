# Visual Tuning Report

## Summary

This pass only touched visual styling and component internals. No routes, content collections, Markdown content, or workflows were changed.

## Changed Files

- `package.json`
- `pnpm-lock.yaml`
- `tailwind.config.cjs`
- `src/styles/global.css`
- `src/components/Footer.astro`
- `src/components/Header.astro`
- `src/components/Hero.astro`
- `src/components/Nav.astro`
- `src/components/ProjectCard.astro`
- `src/components/PublicationCard.astro`
- `src/components/SectionHeader.astro`
- `src/components/ThemeToggle.astro`
- `src/pages/index.astro`

## Feedback Item Mapping

### A. Header alignment bug

Fixed in:

- `src/components/Nav.astro`
- `src/components/ThemeToggle.astro`
- `src/components/Header.astro`
- `src/styles/global.css`

What changed:

- Nav links and theme toggle now share the same interaction box padding: `0.5rem 0.75rem`.
- Nav links and toggle both use the same `line-height: none` behavior through shared utility classes.
- Theme toggle border was removed.
- Theme toggle is now pure icon at rest, with a subtle hover background based on `var(--border)`.
- Header right cluster gap was normalized and kept on a shared center alignment.

### B. “Too much white” / missing section stratification

Fixed in:

- `tailwind.config.cjs`
- `src/styles/global.css`
- `src/components/Footer.astro`
- `src/components/SectionHeader.astro`
- `src/pages/index.astro`

What changed:

- Added `--bg-alt` and `--bg-subtle` tokens for both light and dark themes.
- Landing page is no longer one large white shell.
- Each section now has a full-width background band while inner content remains centered at the same max width.
- Section order now alternates as requested:
  - Hero: `bg-subtle`
  - About: `bg-alt`
  - Publications: `bg`
  - Posts: `bg-alt`
  - Notes: `bg`
  - Projects: `bg-alt`
  - Footer: `bg-subtle`
- Fine divider lines between landing sections were removed; the hierarchy now comes from background changes instead.

### C. Accent blocks and missing detail voice

Fixed in:

- `src/styles/global.css`
- `src/components/PublicationCard.astro`
- `src/components/ProjectCard.astro`

What changed:

- Tag chips now use accent-tinted background and border with accent text.
- Project status badges now use explicit semantic color blocks for `Active`, `WIP`, `Archived`, and `Idea`, including separate dark-mode colors.
- Publication links (`PDF`, `Code`, `Site`) now render as compact bordered buttons instead of plain inline text links.
- Blockquotes now use an accent left rail plus a tinted background.
- Inline code now uses accent-tinted background and accent text.
- Code blocks now use the darker requested background and an accent left border.

### D. Hero text hierarchy was too weak

Fixed in:

- `src/components/Hero.astro`
- `src/styles/global.css`

What changed:

- All section kickers now use accent color, uppercase styling, and tighter editorial spacing.
- The site name keeps the large scale but now has stronger weight and tighter tracking.
- Tagline now uses accent color, slightly larger type, and more relaxed line-height.
- Social links now use inline icons and spacing with `·` separators instead of `/`.

Note:

- `@lucide/astro` was added for the icon pass.
- Lucide’s Astro package does not ship a GitHub brand icon, so the GitHub link currently uses the Lucide `GitBranch` icon as the nearest in-family fallback, while `Mail` uses a proper Lucide mail glyph.

### E. Avatar

- Left unchanged on purpose.

## Local Validation

- `pnpm astro check` → PASS
- `pnpm build` → PASS

## Deployment Validation

- GitHub Actions run `24620726229` finished green.
- Final route checks after deploy:
  - `/` → `200`
  - `/posts` → `200`
  - `/notes` → `200`
  - `/publications` → `200`
  - `/projects` → `200`
  - `/about` → `200`
  - `/tags` → `200`
  - `/404` → `200`
  - `/rss.xml` → `200`
  - `/sitemap-index.xml` → `200`
  - `/posts/clouds-in-still-air` → `200`
  - `/notes/gpu-ecosystem-notes` → `200`
  - `/tags/creative-writing` → `200`
  - `__definitely_missing__` → `404`

## Screenshot Review Suggestions

If the user checks screenshots tomorrow, the most important places to inspect are:

1. Header on desktop:
   confirm `Posts / Notes / Publications / Projects / About` and the theme icon sit on the same baseline and no longer look like mixed button sizes.
2. Hero:
   confirm the blue-tinted background band is visible but restrained, and the tagline now reads as a stronger second line instead of body copy.
3. About / Posts / Notes transitions:
   confirm the alternating section backgrounds create enough separation without feeling striped or heavy.
4. Publication cards:
   confirm `PDF / Code / Site` now read as light utility buttons rather than naked text.
5. Project cards:
   confirm the status badges now anchor each card visually.
6. Any post or note detail page:
   confirm blockquotes and inline code now “speak” visually without becoming noisy.

## D.1 Patch

- Header nav height normalization:
  `src/components/Nav.astro`, `src/components/ThemeToggle.astro`, and `src/styles/global.css` now share a single `.nav-item` treatment so `Posts / Notes / Publications / Projects / About` and the theme toggle use the same `inline-flex`, padding, font sizing, line-height, and vertical alignment. This removes the taller `Posts` bounding box and keeps every item on one baseline.
- GitHub icon correction:
  `src/components/Hero.astro` no longer uses the Lucide fallback hack for GitHub. The Hero social link now renders the official GitHub brand mark as an inline SVG path, while Email continues to use Lucide `Mail`.
- Publications layout change:
  `src/components/PublicationCard.astro`, `src/pages/index.astro`, `src/pages/publications/index.astro`, and `src/styles/global.css` now render publication cards in a full-width single-column stack. Each card keeps metadata on the left and utility links on the right on larger screens, which fits the current small publication count better than the previous multi-column grid.

Suggested visual check for this patch:

1. Header desktop nav:
   compare the top and bottom edges of `Posts`, `Notes`, `Publications`, `Projects`, `About`, and the theme icon in browser inspector. Their bounding boxes should now match.
2. Hero social links:
   confirm the GitHub icon is the proper cat/octocat brand mark instead of the earlier generic fallback icon.
3. Landing `Featured Publications` and `/publications`:
   confirm each paper occupies one full row, with the action buttons aligned to the right on desktop and stacked naturally on mobile.

## D.2 Nav Height Root-Cause Patch

Root cause:

- The `Posts` link was not using a special component and `aria-current` was not the problem.
- The actual cause was the global base rule in `src/styles/global.css`:
  `li + li { margin-top: 0.35rem; }`
- Header navigation uses a semantic `<ul><li>` structure, so every nav item after the first one inherited that top margin. That made `Notes / Publications / Projects / About` sit lower, which visually made `Posts` look a few pixels too high.

Measured before fix with `scripts/measure-nav.mjs` on local `pnpm dev`:

```text
[/] Posts: top=14.8 bottom=45.8 height=31
[/] Notes: top=17.6 bottom=48.6 height=31
[/] Publications: top=17.6 bottom=48.6 height=31
[/] Projects: top=17.6 bottom=48.6 height=31
[/] About: top=17.6 bottom=48.6 height=31

[/posts] Posts: top=14.8 bottom=45.8 height=31
[/posts] Notes: top=17.6 bottom=48.6 height=31
[/posts] Publications: top=17.6 bottom=48.6 height=31
[/posts] Projects: top=17.6 bottom=48.6 height=31
[/posts] About: top=17.6 bottom=48.6 height=31
```

Measured after fix:

```text
[/] Posts: top=20.5 bottom=51.5 height=31
[/] Notes: top=20.5 bottom=51.5 height=31
[/] Publications: top=20.5 bottom=51.5 height=31
[/] Projects: top=20.5 bottom=51.5 height=31
[/] About: top=20.5 bottom=51.5 height=31

[/posts] Posts: top=20.5 bottom=51.5 height=31
[/posts] Notes: top=20.5 bottom=51.5 height=31
[/posts] Publications: top=20.5 bottom=51.5 height=31
[/posts] Projects: top=20.5 bottom=51.5 height=31
[/posts] About: top=20.5 bottom=51.5 height=31
```

Implemented fix:

- Added a dedicated `nav-list` reset in `src/styles/global.css` so header navigation no longer inherits prose-style list spacing.
- Kept the semantic `<ul><li>` structure in `src/components/Nav.astro`, but isolated it from the global `li + li` rhythm rule.
- Set `.nav-item` to use the UI sans stack explicitly and disabled font synthesis so nav metrics are no longer coupled to the serif body stack.
- Added `scripts/measure-nav.mjs` and `playwright` as a dev dependency to keep this measurable instead of visual-only.

READY FOR HYPO REVIEW
