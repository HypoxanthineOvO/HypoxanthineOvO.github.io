import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/posts',
  }),
  schema: z.object({
    // Public title used in cards, metadata, and article pages.
    title: z.string(),
    // Original publish date.
    date: z.date(),
    // Optional short summary used in list pages and feeds.
    description: z.string().optional(),
    // Flat tag list for posts and post tag pages.
    tags: z.array(z.string()).default([]),
    // Draft posts stay out of production lists and routes.
    draft: z.boolean().default(false),
    // Enable KaTeX styles only when math markup is present.
    math: z.boolean().default(false),
    // Optional last updated date for migrated or revised posts.
    updated: z.date().optional(),
  }),
});

const notes = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/notes',
  }),
  schema: z.object({
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
    // Flat tags used only for the client-side note filter.
    tags: z.array(z.string()).default([]),
    // Optional note summary for cards and feeds.
    description: z.string().optional(),
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
    // Project name displayed on cards and detail snippets.
    name: z.string(),
    // Single-line summary for list pages.
    description: z.string(),
    // Current lifecycle state.
    status: z.enum(['Active', 'WIP', 'Archived', 'Idea']),
    // Main technologies or domains.
    tech: z.array(z.string()),
    // Optional source repository.
    repo: z.string().optional(),
    // Optional live project link.
    link: z.string().optional(),
    // Featured projects appear on the landing page.
    featured: z.boolean().default(false),
    // Explicit ordering control for the projects page.
    order: z.number().int().default(0),
  }),
});

export const collections = {
  posts,
  notes,
  publications,
  projects,
};
