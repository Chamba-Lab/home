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
        title: i18nText,
        description: i18nText,
        type: z.enum(["fixed", "recurring"]),
        // "fixed": one-time event, ISO date.
        date: z.string().optional(),
        // "recurring": weekly on `weekday` (0=Sun..6=Sat), starting `startDate`.
        weekday: z.number().min(0).max(6).optional(),
        startDate: z.string().optional(),
        recurrenceLabel: i18nText.optional(),
    }),
});

const dinamicas = defineCollection({
    loader: file("src/content/dinamicas.json"),
    schema: z.object({
        activities: z.array(
            z.object({
                id: z.string(),
                name: z.string(),
                description: z.string(),
                status: z.enum(["available", "coming-soon"]),
            }),
        ),
        roulette: z.object({
            freeMode: z.object({
                placeholder: z.string(),
                maxOptions: z.number(),
            }),
            presets: z.array(
                z.object({
                    id: z.string(),
                    name: z.string(),
                    options: z.array(z.string()),
                }),
            ),
        }),
    }),
});

export const collections = { resources, events, dinamicas };
