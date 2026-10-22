import { youtubeEmbedUrl } from "./resources";

const ALLOW =
    "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";

/**
 * Replaces the thumbnail with the YouTube player (no tracking cookies until
 * the person presses play). Shared by the resource cards and the blog.
 */
export function mountVideoPlayer(
    thumb: Element,
    videoId: string,
    title: string,
): void {
    const iframe = document.createElement("iframe");
    iframe.src = youtubeEmbedUrl(videoId);
    iframe.title = title;
    iframe.allow = ALLOW;
    iframe.allowFullscreen = true;
    iframe.className = "absolute inset-0 h-full w-full";
    thumb.replaceChildren(iframe);
}
