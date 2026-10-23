/**
 * Helpers for blog entries. Pure functions so they can be
 * tested without Astro.
 */

interface PostLike {
    id: string;
    data: { date: Date; draft: boolean };
}

/** Entries that are not drafts, newest first. */
export function publishedPosts<T extends PostLike>(posts: T[]): T[] {
    return posts
        .filter((post) => !post.data.draft)
        .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Site path of an entry, with the trailing slash the site requires. */
export function postPath(id: string, base = "/"): string {
    const prefix = base.endsWith("/") ? base : `${base}/`;
    return `${prefix}blog/${id}/`;
}

/** Calendar day of an entry as YYYY-MM-DD (dates are stored as UTC midnight). */
export function postDateIso(date: Date): string {
    return date.toISOString().slice(0, 10);
}

type Lang = "es" | "en";

/** Date for the listing: "17 oct 2026" (es), "Oct 17, 2026" (en); without the year, "17 oct". */
export function formatPostDate(date: Date, lang: Lang, withYear = true) {
    return date
        .toLocaleDateString(lang === "es" ? "es-PE" : "en-US", {
            day: "numeric",
            month: "short",
            year: withYear ? "numeric" : undefined,
            timeZone: "UTC",
        })
        .replaceAll(".", "");
}

const WORDS_PER_MINUTE = 200;

/**
 * Reading time in minutes of an MDX body: counts the words of the text,
 * leaving out `import` lines and the tags of the components.
 */
export function readingMinutes(body: string): number {
    const text = body.replace(/^import .*$/gm, " ").replace(/<[^>]*>/g, " ");
    const words = text.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;
    return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

interface TaggedPost {
    data: { tags: string[]; date: Date };
}

/** Tags with how many entries use them: most used first, then alphabetical. */
export function tagCounts(posts: TaggedPost[]): [string, number][] {
    const counts = new Map<string, number>();
    for (const post of posts)
        for (const tag of post.data.tags)
            counts.set(tag, (counts.get(tag) ?? 0) + 1);
    return [...counts.entries()].sort(
        (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"),
    );
}

/** Entries grouped by year, keeping the order they come in. */
export function postsByYear<T extends TaggedPost>(posts: T[]): [number, T[]][] {
    const groups = new Map<number, T[]>();
    for (const post of posts) {
        const year = post.data.date.getUTCFullYear();
        groups.set(year, [...(groups.get(year) ?? []), post]);
    }
    return [...groups.entries()];
}

// --- Listing filters (run in the browser) ---

export type BlogView = "magazine" | "log";

export interface BlogFilter {
    tags: string[];
    query: string;
}

export interface BlogState extends BlogFilter {
    view?: BlogView;
}

/**
 * State of the listing from the URL: `?tag=IA&tag=3D&q=blender&view=log`.
 * The view is only set when the URL asks for one.
 */
export function parseBlogState(search: string): BlogState {
    const params = new URLSearchParams(search);
    const view = params.get("view");
    return {
        tags: [...new Set(params.getAll("tag").filter(Boolean))],
        query: params.get("q") ?? "",
        view: view === "log" || view === "magazine" ? view : undefined,
    };
}

/** Query string for a state ("" when there is nothing to keep). */
export function blogStateSearch(state: BlogState): string {
    const params = new URLSearchParams();
    state.tags.forEach((tag) => params.append("tag", tag));
    if (state.query.trim()) params.set("q", state.query.trim());
    if (state.view) params.set("view", state.view);
    const text = params.toString();
    return text ? `?${text}` : "";
}

export function isFiltering(filter: BlogFilter): boolean {
    return filter.tags.length > 0 || filter.query.trim() !== "";
}

/**
 * An entry matches if it has any of the chosen tags (or none was chosen)
 * and its text contains the search, ignoring accents and case.
 */
export function matchesPost(
    post: { tags: string[]; text: string },
    filter: BlogFilter,
): boolean {
    const query = normalize(filter.query.trim());
    return (
        (filter.tags.length === 0 ||
            post.tags.some((tag) => filter.tags.includes(tag))) &&
        (query === "" || normalize(post.text).includes(query))
    );
}

function normalize(text: string): string {
    return text
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();
}

/** "14 entradas" or, while filtering, "3 de 14 entradas". */
export function postCountLabel(
    shown: number,
    total: number,
    filtering: boolean,
    lang: Lang,
): string {
    if (lang === "en") {
        const noun = total === 1 ? "entry" : "entries";
        return filtering ? `${shown} of ${total} ${noun}` : `${total} ${noun}`;
    }
    const noun = total === 1 ? "entrada" : "entradas";
    return filtering ? `${shown} de ${total} ${noun}` : `${total} ${noun}`;
}
