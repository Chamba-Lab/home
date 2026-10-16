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
        // Format: "web" (default), "channel" (YouTube channel) or "video"
        // (YouTube video, played on demand).
        type: z.enum(["web", "channel", "video"]).default("web"),
        // Channel only: URL of the channel image (yt3.googleusercontent.com,
        // ?=s112 size). The browser loads it; the title initial is the fallback.
        avatar: z.string().url().optional(),
        // Video only: name of the channel that publishes it.
        channel: z.string().optional(),
        category: z.enum([
            "cv",
            "empleo",
            "aprendizaje",
            "certificacion",
            "becas",
            "ia",
            "practica",
            "opensource",
        ]),
        // Optional, only for courses and certifications: free, freemium
        // (free tier with paid extras) or paid.
        access: z.enum(["free", "freemium", "paid"]).optional(),
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
        // Optional time fields (HH:mm format, e.g. "19:00")
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        timezone: z.string().default("UTC-5"),
    }),
});

const team = defineCollection({
    loader: file("src/content/team.json"),
    schema: z.object({
        name: z.string(),
        // Display order within its tier (ascending).
        order: z.number(),
        // Public title (site, LinkedIn, social). Independent of Discord roles.
        tier: z.enum(["founder", "cofounder", "core", "contributor", "member"]),
        // Own profile photo: file name inside src/assets/team/ (founders).
        // Omitted: the browser loads the GitHub avatar of `github` at runtime.
        avatar: z.string().optional(),
        github: z.string().url(),
        // Optional: omitted links are simply not rendered.
        portfolio: z.string().url().optional(),
        // Optional personal logo (.svg/.png/.jpg) inside src/assets/team/logos/.
        // Replaces the globe icon of the portfolio link; without it the globe stays.
        logo: z.string().optional(),
        linkedin: z.string().url().optional(),
    }),
});

const activities = defineCollection({
    loader: file("src/content/activities.json"),
    schema: z.object({
        name: z.string(),
        description: z.string(),
        status: z.enum(["available", "coming-soon"]),
    }),
});

const roulette = defineCollection({
    loader: file("src/content/roulette.json"),
    schema: z.object({
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
});

export const collections = { resources, events, team, activities, roulette };
