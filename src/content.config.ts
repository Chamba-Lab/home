import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";

// "en" is the required baseline; "es" is an optional overlay that falls
// back to "en" when missing (see applyLang in src/layouts/Layout.astro).
const i18nText = z.object({
    en: z.string(),
    es: z.string().optional(),
});

const resources = defineCollection({
    loader: file("src/content/resources.json"),
    schema: z.object({
        title: z.string(),
        description: i18nText,
        url: z.string().url(),
        category: z.enum(["cv", "aprendizaje", "practica"]),
    }),
});

const events = defineCollection({
    loader: file("src/content/events.json"),
    schema: z.object({
        // Explicit ordering: the file loader does not preserve JSON array order.
        order: z.number(),
        title: i18nText,
        description: i18nText,
        type: z.enum(["fixed", "recurring"]),
        // "fixed": one-time event, ISO date. "recurring": human-readable cadence.
        date: z.string().optional(),
        recurrence: i18nText.optional(),
    }),
});

export const collections = { resources, events };
