import { defineCollection, z } from "astro:content";
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    demoURL: z.string().optional(),
    repoURL: z.string().optional(),
  }),
});

const bookmarks = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: "./src/content/bookmarks" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    readDate: z.coerce.date(),
    url: z.string().url(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});


const prompts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: "./src/content/prompts" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

const videos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: "./src/content/videos" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    url: z.string().url(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional()
  }),
});

export const collections = { blog, projects, bookmarks, prompts, videos };
