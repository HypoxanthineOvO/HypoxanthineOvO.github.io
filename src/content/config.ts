import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { blogSubcategories } from '../lib/site';

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog',
  }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    subcategory: z.enum(blogSubcategories),
    tags: z.array(z.string()).default([]),
    summary: z.string().optional(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const teaching = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/teaching',
  }),
  schema: z.object({
    title: z.string(),
    course: z.string(),
    role: z.string(),
    semester: z.string(),
    institution: z.string().optional(),
    summary: z.string().optional(),
    resources: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().url(),
        })
      )
      .optional(),
  }),
});

const courses = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/courses',
  }),
  schema: z.object({
    title: z.string(),
    code: z.string(),
    institution: z.string().optional(),
    semester: z.string().optional(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const publications = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/publications',
  }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
    year: z.number().int(),
    type: z.enum(['conference', 'journal', 'workshop', 'preprint']),
    links: z
      .object({
        pdf: z.string().url().optional(),
        code: z.string().url().optional(),
        arxiv: z.string().url().optional(),
        doi: z.string().url().optional(),
        project: z.string().url().optional(),
      })
      .optional(),
    abstract: z.string().optional(),
  }),
});

export const collections = {
  blog,
  teaching,
  courses,
  publications,
};
