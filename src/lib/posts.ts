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
