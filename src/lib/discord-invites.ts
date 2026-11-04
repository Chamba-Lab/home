import { DISCORD_URL, TIKTOK_DISCORD_URL } from "./constants";

/**
 * Invitación de Discord por red social (ruta /discord/<red>). Cada red tiene su
 * propia invitación permanente para que Discord cuente cuánta gente entró por
 * ella. Mientras una red no tenga la suya, apunta a la invitación de la web.
 * `web` es la de /discord y de los botones del sitio.
 */
export const DISCORD_INVITES: Record<string, string> = {
    web: DISCORD_URL,
    tiktok: TIKTOK_DISCORD_URL,
    // Pendientes de crear su invitación propia.
    linkedin: DISCORD_URL,
    instagram: DISCORD_URL,
};

/** Las redes con ruta propia (todas menos `web`, que es /discord). */
export function sourceInvites(
    invites: Record<string, string> = DISCORD_INVITES,
): Record<string, string> {
    return Object.fromEntries(
        Object.entries(invites).filter(([source]) => source !== "web"),
    );
}

/**
 * Invitación para una ruta como `/discord/tiktok/`. Una red desconocida (o la
 * propia `/discord/`) cae en la invitación de la web.
 */
export function inviteForPath(
    pathname: string,
    invites: Record<string, string> = DISCORD_INVITES,
): string | null {
    const match = /^\/discord(?:\/([^/]*))?\/?$/i.exec(pathname);
    if (!match) return null;
    const source = (match[1] ?? "web").toLowerCase();
    return Object.hasOwn(invites, source) ? invites[source] : invites.web;
}
