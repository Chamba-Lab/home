import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { postPath, publishedPosts } from "../lib/posts";

// Feed del blog: solo entradas publicadas (los borradores no salen).
export async function GET(context: APIContext) {
    const posts = publishedPosts(await getCollection("posts"));
    return rss({
        title: "Blog · Chamba Lab",
        description:
            "Lo que probamos, construimos y aprendemos en la comunidad Chamba Lab.",
        site: context.site ?? "https://chambalab.org",
        items: posts.map((post) => ({
            title: post.data.title,
            description: post.data.description,
            pubDate: post.data.date,
            link: postPath(post.id),
            categories: post.data.tags,
        })),
        customData: "<language>es</language>",
    });
}
