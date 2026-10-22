import { defineCollection, reference, z } from "astro:content";
import { file, glob } from "astro/loaders";
import {
    ACCESS_IDS,
    RESOURCE_CATEGORY_IDS,
    RESOURCE_TYPE_IDS,
} from "./lib/resources";

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
        type: z.enum(RESOURCE_TYPE_IDS).default("web"),
        // Channel only: URL of the channel image (yt3.googleusercontent.com,
        // ?=s112 size). The browser loads it; the title initial is the fallback.
        avatar: z.string().url().optional(),
        // Video only: name of the channel that publishes it.
        channel: z.string().optional(),
        category: z.enum(RESOURCE_CATEGORY_IDS),
        // Optional, only for courses and certifications: free, freemium
        // (free tier with paid extras) or paid.
        access: z.enum(ACCESS_IDS).optional(),
        // Optional: starred resources are the ones shown on the home page
        // (in file order, up to HOME_STARRED_MAX).
        starred: z.boolean().optional(),
    }),
});

const events = defineCollection({
    loader: file("src/content/events.json"),
    schema: z
        .object({
            title: i18nText,
            description: i18nText,
            type: z.enum(["fixed", "recurring"]),
            // Optional poster/card kind: "launch", "coworking" (Code & Coffee)
            // and "activity" (workshops, explorations; generic poster driven
            // by `tag`). Without it the event has no poster.
            kind: z.enum(["launch", "coworking", "activity"]).optional(),
            // Activity only: short label for the poster and the card category
            // (e.g. "AI exploration").
            tag: i18nText.optional(),
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
            // Optional: the native Discord event
            // (https://discord.com/events/<server>/<event>). The site links to
            // it so people can mark "Interested" and get Discord's own
            // reminder, with no bot or sync involved.
            discordEvent: z
                .string()
                .regex(
                    /^https:\/\/discord\.com\/events\/\d+\/\d+$/,
                    "Use the Discord event link: https://discord.com/events/<server>/<event>",
                )
                .optional(),
            // Optional: the blog entry that documents this event (the id of a
            // file in src/content/posts/, without the extension). The entry
            // knows nothing about events; the link lives here.
            post: reference("posts").optional(),
        })
        .refine((event) => event.kind !== "activity" || event.tag, {
            message: "Activity events need a `tag` (poster headline)",
            path: ["tag"],
        })
        .refine((event) => !event.post || event.type === "fixed", {
            message: "Only one-time (`fixed`) events can link a blog entry",
            path: ["post"],
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

// Blog. One MDX file per entry in src/content/posts/; files that
// start with "_" (like the template) are ignored. Images live next to the
// entry, in a folder with its name. An entry knows nothing about events: the
// link lives in the event (see `post` in events.json).
const posts = defineCollection({
    loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/posts" }),
    schema: ({ image }) =>
        z
            .object({
                title: z.string(),
                // SEO description of the page.
                description: z.string().min(120).max(160),
                date: z.coerce.date(),
                tags: z.array(z.string()).default([]),
                cover: image().optional(),
                // Required with `cover`: alt text of the image.
                coverAlt: z.string().optional(),
                // Opcional: imagen de las vistas previas al compartir (OG).
                // Se usa tal cual, sin recortar; lo ideal es 1200x630. Sin ella
                // se usa la imagen general del sitio.
                ogImage: image().optional(),
                // Name as it appears in team.json.
                author: z.string().optional(),
                // Language the entry is written in (entries are not translated).
                lang: z.enum(["es", "en"]).default("es"),
                // Drafts are not published anywhere.
                draft: z.boolean().default(false),
            })
            .refine((post) => !post.cover || post.coverAlt, {
                message: "A `cover` needs a `coverAlt` (alt text)",
                path: ["coverAlt"],
            }),
});

export const collections = {
    resources,
    events,
    team,
    activities,
    roulette,
    posts,
};
