import type { ImageMetadata } from "astro";
import { getCollection } from "astro:content";

// Títulos públicos del equipo (sitio, LinkedIn y redes).
export const TIERS = [
    "founder",
    "cofounder",
    "core",
    "contributor",
    "member",
] as const;
export type Tier = (typeof TIERS)[number];

export const TIER_LABEL: Record<Tier, { en: string; es: string }> = {
    founder: { en: "Founder", es: "Founder" },
    cofounder: { en: "Co-founder", es: "Co-founder" },
    core: { en: "Core team", es: "Core team" },
    contributor: { en: "Contributor", es: "Contributor" },
    member: { en: "Community member", es: "Miembro de la comunidad" },
};

// Fotos propias locales (fundadores). El resto usa su avatar de GitHub en el navegador.
const avatars = import.meta.glob<{ default: ImageMetadata }>(
    "../assets/team/*.jpg",
    { eager: true },
);
// Logos personales opcionales (reemplazan el globo del enlace al portfolio).
const logos = import.meta.glob<string>("../assets/team/logos/*", {
    eager: true,
    query: "?url",
    import: "default",
});

// Avatar público de GitHub (redirige al avatar actual de la cuenta).
export function githubAvatarUrl(user: string, size: number) {
    return `https://github.com/${encodeURIComponent(user)}.png?size=${size}`;
}

// "https://github.com/usuario" -> "usuario"
function githubUserOf(url: string) {
    return new URL(url).pathname.split("/").filter(Boolean)[0];
}

export async function getTeamMembers() {
    return (await getCollection("team"))
        .map((member) => ({
            ...member.data,
            id: member.id,
            githubUser: githubUserOf(member.data.github),
            avatarSrc: member.data.avatar
                ? avatars[`../assets/team/${member.data.avatar}`]?.default
                : undefined,
            logoSrc: member.data.logo
                ? logos[`../assets/team/logos/${member.data.logo}`]
                : undefined,
        }))
        .sort(
            (a, b) =>
                TIERS.indexOf(a.tier) - TIERS.indexOf(b.tier) ||
                a.order - b.order,
        );
}

export type TeamMember = Awaited<ReturnType<typeof getTeamMembers>>[number];
