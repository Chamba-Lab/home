import type { ImageMetadata } from "astro";
import { getCollection } from "astro:content";

// Títulos públicos (sitio, LinkedIn y redes). Independientes de los roles de Discord.
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

export const PROFILE_LABEL = {
    "early-career": "Early Career",
    mid: "Mid",
    senior: "Senior",
} as const;

// Avatares locales (descargados de GitHub una vez): no se piden a terceros en cada visita.
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

export async function getTeamMembers() {
    return (await getCollection("team"))
        .map((member) => ({
            ...member.data,
            id: member.id,
            avatarSrc: avatars[`../assets/team/${member.data.avatar}`]?.default,
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
