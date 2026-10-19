/** Fuente única de enlaces externos: no repetir estas URLs en componentes. */
export const SITE_URL = "https://chambalab.org";
/** Invitación oficial de Discord. Es el destino de la redirección /discord. */
export const DISCORD_URL = "https://discord.gg/fNd8CXBbsQ";
/**
 * Enlace estable de la invitación (redirección en astro.config.mjs). Úsalo donde
 * el enlace se guarda fuera del sitio (calendarios, datos estructurados), para
 * que no se rompa si la invitación cambia.
 */
export const DISCORD_PUBLIC_URL = `${SITE_URL}/discord`;
export const GITHUB_ORG_URL = "https://github.com/Chamba-Lab";
export const LINKEDIN_URL = "https://www.linkedin.com/company/chambalab";
export const TIKTOK_URL = "https://www.tiktok.com/@chambalab";
export const INSTAGRAM_URL = "https://www.instagram.com/chambalab.dev/";
export const X_URL = "https://x.com/chambalabdev";
export const GITHUB_URL = `${GITHUB_ORG_URL}/home`;
export const CONTRIBUTING_URL = `${GITHUB_URL}/blob/master/CONTRIBUTING.md`;
export const CODE_OF_CONDUCT_URL = `${GITHUB_URL}/blob/master/CODE_OF_CONDUCT.md`;

export const DISCORD_GUILD_ID = "1473927361106808832";
export const DISCORD_WIDGET_API = `https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`;
export const DISCORD_WIDGET_IFRAME = `https://discord.com/widget?id=${DISCORD_GUILD_ID}&theme=dark`;
