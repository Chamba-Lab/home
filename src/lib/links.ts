import { SITE_URL } from "./constants";

/** ¿El enlace lleva a otro sitio distinto de este? (rutas, anclas y chambalab.org no) */
export function isExternalUrl(href: unknown, siteUrl = SITE_URL): boolean {
    if (typeof href !== "string") return false;
    if (!/^(https?:)?\/\//i.test(href)) return false;
    try {
        return new URL(href, siteUrl).host !== new URL(siteUrl).host;
    } catch {
        return false;
    }
}
