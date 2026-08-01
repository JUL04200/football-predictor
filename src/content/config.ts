import { defineCollection, z } from "astro:content";

const journal = defineCollection({
  type: "content",
  schema: z.object({
    titre: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    resume: z.string(),
  }),
});

export const collections = { journal };
