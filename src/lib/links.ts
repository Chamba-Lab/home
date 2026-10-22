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

export type LinkKind = "github-profile" | "github-repo" | "youtube";

const GITHUB_HOSTS = new Set(["github.com", "www.github.com"]);
const YOUTUBE_HOSTS = new Set([
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "youtu.be",
]);

/**
 * Tipo de recurso al que apunta un enlace, para ponerle su insignia en el
 * blog: un perfil de GitHub (`github.com/usuario`), un repositorio
 * (`github.com/usuario/repo`, también con subrutas) o YouTube. Cualquier otro
 * enlace devuelve `undefined`.
 */
export function linkKind(href: unknown): LinkKind | undefined {
    if (typeof href !== "string" || !/^https?:\/\//i.test(href)) {
        return undefined;
    }
    let url: URL;
    try {
        url = new URL(href);
    } catch {
        return undefined;
    }
    if (YOUTUBE_HOSTS.has(url.hostname)) return "youtube";
    if (!GITHUB_HOSTS.has(url.hostname)) return undefined;
    const [owner, repo] = url.pathname.split("/").filter(Boolean);
    if (!owner) return undefined;
    return repo ? "github-repo" : "github-profile";
}

/** Host de una URL sin "www.", o `undefined` si no es una URL http(s) válida. */
function bareHost(href: unknown): string | undefined {
    if (typeof href !== "string" || !/^https?:\/\//i.test(href)) {
        return undefined;
    }
    try {
        return new URL(href).hostname.replace(/^www\./, "");
    } catch {
        return undefined;
    }
}

/**
 * Persona del equipo cuyo portafolio es el sitio al que apunta el enlace (se
 * compara solo el dominio, sin "www." ni ruta), para ponerle su insignia.
 */
export function matchPortfolio<T extends { portfolio?: string }>(
    href: unknown,
    members: T[],
): T | undefined {
    const host = bareHost(href);
    if (!host) return undefined;
    return members.find((m) => bareHost(m.portfolio) === host);
}
