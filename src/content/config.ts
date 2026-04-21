import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { seriesValues } from '../lib/series';

const projectLogFields = {
  // Diary-style note or a release announcement.
  kind: z.enum(['diary', 'release']).optional(),
  // Project slug such as hypo-llm or hypo-wtt.
  project: z.string().optional(),
  // Semantic milestone name like v3-launch.
  milestone: z.string().optional(),
  // Outcome of the logged milestone.
  status: z.enum(['shipped', 'wip', 'abandoned']).default('wip'),
  // Human-readable time range such as 2026-03 ~ 2026-04.
  duration: z.string().optional(),
};

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/posts',
  }),
  schema: z
    .object({
      // Public title used in cards, metadata, and article pages.
      title: z.string(),
      // Original publish date.
      date: z.date(),
      // Optional short summary used in list pages and feeds.
      description: z.string().optional(),
      // Closed-set primary series used for navigation and archive pages.
      series: z.enum(seriesValues),
      // Open-set cross-cutting tags.
      tags: z.array(z.string()).default([]),
      // Archive-only entries stay inside the dedicated humanities series page.
      archived: z.boolean().default(false),
      // Draft posts stay out of production lists and routes.
      draft: z.boolean().default(false),
      // Enable KaTeX styles only when math markup is present.
      math: z.boolean().default(false),
      // Optional last updated date for migrated or revised posts.
      updated: z.date().optional(),
      ...projectLogFields,
    })
    .superRefine((data, ctx) => {
      if (data.series === 'project-log') {
        if (!data.kind) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'project-log entries require kind', path: ['kind'] });
        }
        if (!data.project) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'project-log entries require project', path: ['project'] });
        }
      }
    }),
});

const notes = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/notes',
  }),
  schema: z
    .object({
      // Note title shown in index pages and note detail pages.
      title: z.string(),
      // Date of the note itself.
      date: z.date(),
      // Source material such as a paper, book, or talk.
      source: z.string().optional(),
      // Authors of the source material when relevant.
      authors: z.array(z.string()).optional(),
      // Canonical source link for the original material.
      link: z.string().url().optional(),
      // Closed-set primary series used for navigation and archive pages.
      series: z.enum(seriesValues),
      // Open-set cross-cutting tags.
      tags: z.array(z.string()).default([]),
      // Archive-only entries stay inside the dedicated humanities series page.
      archived: z.boolean().default(false),
      // Draft notes stay out of production lists and routes.
      draft: z.boolean().default(false),
      // Optional note summary for cards and feeds.
      description: z.string().optional(),
      ...projectLogFields,
    })
    .superRefine((data, ctx) => {
      if (data.series === 'project-log') {
        if (!data.kind) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'project-log entries require kind', path: ['kind'] });
        }
        if (!data.project) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'project-log entries require project', path: ['project'] });
        }
      }
    }),
});

const publications = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/publications',
  }),
  schema: z.object({
    // Academic publications vs. literary publications.
    kind: z.enum(['academic', 'literary']).default('academic'),
    // Publication title.
    title: z.string(),
    // Ordered author list; highlight Hypoxanthine He in the UI.
    authors: z.array(z.string()).optional(),
    // Venue such as conference, journal, or workshop.
    venue: z.string().optional(),
    // Publication year used for sorting and grouping.
    year: z.number().int(),
    // Research area section heading for academic publications.
    research_area: z.string().optional(),
    // Optional PDF link.
    pdf: z.string().optional(),
    // Optional code repository link.
    code: z.string().optional(),
    // Optional standalone project page link.
    project_page: z.string().optional(),
    // Optional BibTeX string for quick copy.
    bibtex: z.string().optional(),
    // Optional teaser image path.
    teaser: z.string().optional(),
    // Featured publications appear on the landing page.
    featured: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/projects',
  }),
  schema: z.object({
    // Project name displayed on cards and detail pages.
    name: z.string(),
    // Optional emoji marker shown next to the project name.
    emoji: z.string().optional(),
    // Single-line summary for list pages.
    description: z.string(),
    // Current lifecycle state.
    status: z.enum(['active', 'wip', 'archived', 'internal']),
    // Optional GitHub repository link.
    githubUrl: z.string().url().optional(),
    // Optional main technologies or domains.
    tech: z.array(z.string()).default([]),
    // Featured projects appear on the landing page.
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  posts,
  notes,
  publications,
  projects,
};
