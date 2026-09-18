import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";

const resources = defineCollection({
    loader: file("src/content/resources.json"),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        url: z.string().url(),
        category: z.enum(["cv", "aprendizaje", "practica"]),
        lang: z.enum(["es", "en"]).default("es"),
    }),
});

const events = defineCollection({
    loader: file("src/content/events.json"),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        type: z.enum(["fixed", "recurring"]),
        // "fixed": one-time event, ISO date. "recurring": human-readable cadence.
        date: z.string().optional(),
        recurrence: z.string().optional(),
    }),
});

export const collections = { resources, events };
