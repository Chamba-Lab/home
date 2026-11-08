/**
 * Datos y marcado del widget de Discord (voz agrupada por canal).
 * Lo usan el build (primer render) y el navegador (refresco cada 60 s), así el
 * marcado vive en un solo lugar. Los textos salen en el idioma pedido y llevan
 * `data-i18n-es/en` para que el selector ES/EN los cambie en vivo.
 */
import { DISCORD_GUILD_ID } from "./constants";

export type Lang = "es" | "en";

export interface DiscordMember {
    id: string;
    username: string;
    status?: string;
    avatar_url?: string;
    channel_id?: string;
    mute?: boolean;
    deaf?: boolean;
    self_mute?: boolean;
    self_deaf?: boolean;
}

export interface DiscordChannel {
    id: string;
    name: string;
    position: number;
}

export interface DiscordData {
    id: string;
    name: string;
    presence_count: number;
    channels: DiscordChannel[];
    members: DiscordMember[];
}

/**
 * Canales de voz del servidor, para cuando Discord no responde en el build.
 * Solo canales: nunca personas ni contadores, porque mostrar a alguien "en
 * voz" sin que Discord lo confirme sería inventar actividad.
 */
export const FALLBACK_CHANNELS: DiscordChannel[] = [
    { id: "1548810529097781390", name: "🗿 General", position: 0 },
    { id: "1551276099198259230", name: "☕code-and-coffee", position: 1 },
    { id: "1560563282438258758", name: "🎙️Stage", position: 2 },
    { id: "1548819408896397422", name: "🎮Valito", position: 3 },
    { id: "1550163239600390265", name: "🧊Minecraft", position: 4 },
    { id: "1561626780408881163", name: "🤖 Ai exploring", position: 5 },
];

/** Normaliza la respuesta de `widget.json` (campos ausentes -> vacíos). */
export function normalize(json: Partial<DiscordData>): DiscordData {
    return {
        id: json.id ?? DISCORD_GUILD_ID,
        name: json.name ?? "Chamba Lab",
        presence_count:
            typeof json.presence_count === "number" ? json.presence_count : 0,
        channels: json.channels ?? [],
        members: json.members ?? [],
    };
}

export interface VoiceChannelView {
    channel: DiscordChannel;
    members: DiscordMember[];
}

export interface DiscordView {
    online: number;
    inVoice: number;
    voice: VoiceChannelView[];
    // En línea pero fuera de un canal de voz (incluye bots: la API no los marca).
    others: DiscordMember[];
}

/** Agrupa miembros por canal de voz: canales con gente primero, luego vacíos. */
export function buildView(data: DiscordData): DiscordView {
    const byChannel = new Map<string, DiscordMember[]>();
    const others: DiscordMember[] = [];
    for (const member of data.members) {
        if (member.channel_id) {
            const list = byChannel.get(member.channel_id) ?? [];
            list.push(member);
            byChannel.set(member.channel_id, list);
        } else {
            others.push(member);
        }
    }

    const voice = [...data.channels]
        .sort((a, b) => a.position - b.position)
        .map((channel) => ({
            channel,
            members: byChannel.get(channel.id) ?? [],
        }));
    // Orden estable: ocupados primero, conservando la posición de Discord.
    const occupied = voice.filter((v) => v.members.length > 0);
    const empty = voice.filter((v) => v.members.length === 0);

    return {
        online: data.presence_count,
        inVoice: occupied.reduce((sum, v) => sum + v.members.length, 0),
        voice: [...occupied, ...empty],
        others,
    };
}

// Los IDs vienen del API: se codifican para que no alteren la URL ni el HTML.
export function channelUrl(guildId: string, channelId: string) {
    return `https://discord.com/channels/${encodeURIComponent(guildId)}/${encodeURIComponent(channelId)}`;
}

export function escapeHtml(value: string) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

// Solo avatares del CDN de Discord; cualquier otra URL se descarta.
function safeAvatar(url?: string) {
    return url && url.startsWith("https://cdn.discordapp.com/")
        ? escapeHtml(url)
        : undefined;
}

/** Chips de "También en línea" antes de resumir el resto como "+N". */
export const OTHERS_LIMIT = 8;

const TEXT = {
    voiceEmpty: { es: "Vacíos", en: "Empty" },
    nobodyInVoice: {
        es: "Nadie en voz ahora: entra a un canal",
        en: "No one in voice right now: hop into a channel",
    },
    moreOnline: { es: "más en línea", en: "more online" },
    loadingLive: {
        es: "Cargando quién está conectado…",
        en: "Loading who's online…",
    },
    offlineLive: {
        es: "No pudimos cargar quién está conectado. Entra a un canal:",
        en: "We couldn't load who's online. Hop into a channel:",
    },
    noVoice: {
        es: "No hay canales de voz disponibles.",
        en: "No voice channels available.",
    },
    alsoOnline: { es: "También en línea", en: "Also online" },
    join: { es: "Entrar a", en: "Join" },
    muted: { es: "Silenciado", en: "Muted" },
    deafened: { es: "Ensordecido", en: "Deafened" },
} as const;

// Texto bilingüe: se pinta en `lang` y el selector ES/EN lo cambia después.
function t(key: keyof typeof TEXT, lang: Lang) {
    const text = TEXT[key];
    return `data-i18n-es="${escapeHtml(text.es)}" data-i18n-en="${escapeHtml(text.en)}">${escapeHtml(text[lang])}`;
}

const ICON = {
    speaker:
        "M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z",
    micOff: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3zM3 3l18 18",
    deafened:
        "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2",
};

function icon(path: string, cls: string) {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="${cls}" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${path}"/></svg>`;
}

function avatar(member: DiscordMember, size: string) {
    const src = safeAvatar(member.avatar_url);
    if (src) {
        const px = size.includes("w-5") ? 20 : 16;
        return `<img src="${src}" alt="" width="${px}" height="${px}" class="${size} rounded-full object-cover shrink-0" loading="lazy" referrerpolicy="no-referrer">`;
    }
    const initial = escapeHtml(
        (member.username || "?").charAt(0).toUpperCase(),
    );
    return `<span class="${size} rounded-full bg-brand-discord/40 text-[10px] text-white font-bold flex items-center justify-center shrink-0">${initial}</span>`;
}

function voiceMember(member: DiscordMember, lang: Lang) {
    const deafened = member.deaf || member.self_deaf;
    const muted = member.mute || member.self_mute;
    let state = "";
    if (deafened) {
        state = `<span class="text-rose-400" title="${escapeHtml(TEXT.deafened[lang])}" data-i18n-title-es="${TEXT.deafened.es}" data-i18n-title-en="${TEXT.deafened.en}">${icon(ICON.deafened, "w-3.5 h-3.5")}</span>`;
    } else if (muted) {
        state = `<span class="text-rose-400" title="${escapeHtml(TEXT.muted[lang])}" data-i18n-title-es="${TEXT.muted.es}" data-i18n-title-en="${TEXT.muted.en}">${icon(ICON.micOff, "w-3.5 h-3.5")}</span>`;
    }
    return `<li class="flex items-center justify-between gap-2 min-w-0">
<span class="flex items-center gap-2 min-w-0">${avatar(member, "w-5 h-5")}<span class="text-xs font-medium text-slate-200 truncate">${escapeHtml(member.username)}</span></span>${state}</li>`;
}

function voiceChannel(
    { channel, members }: VoiceChannelView,
    guildId: string,
    lang: Lang,
) {
    const name = escapeHtml(channel.name);
    const count = `<span class="text-[10px] font-bold text-emerald-400 font-mono">${members.length}</span>`;
    const people = `<ul class="px-2.5 pb-2 space-y-1">${members.map((m) => voiceMember(m, lang)).join("")}</ul>`;
    return `<li class="rounded-lg bg-slate-900/60 border border-white/5 hover:border-white/15 transition-colors">
<a href="${escapeHtml(channelUrl(guildId, channel.id))}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between gap-2 px-2.5 py-1.5 min-w-0" aria-label="${escapeHtml(TEXT.join[lang])} ${name}" title="${escapeHtml(TEXT.join[lang])} ${name}">
<span class="flex items-center gap-1.5 min-w-0 text-xs font-semibold text-slate-300">${icon(ICON.speaker, "w-3.5 h-3.5 shrink-0 text-slate-400")}<span class="truncate">${name}</span></span>${count}</a>${people}</li>`;
}

// "+N" con el resto de "También en línea"; el texto completo va para lectores.
function moreOnline(extra: number, lang: Lang) {
    if (extra <= 0) return "";
    const label = (l: Lang) => `${extra} ${TEXT.moreOnline[l]}`;
    return `<li class="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-900/60 border border-white/5 text-[11px] font-semibold text-slate-400" title="${label(lang)}" data-i18n-title-es="${label("es")}" data-i18n-title-en="${label("en")}"><span aria-hidden="true">+${extra}</span><span class="sr-only" data-i18n-es="${label("es")}" data-i18n-en="${label("en")}">${label(lang)}</span></li>`;
}

// Canal vacío: chip compacto que igual enlaza a Discord.
function emptyChannel(
    { channel }: VoiceChannelView,
    guildId: string,
    lang: Lang,
) {
    const name = escapeHtml(channel.name);
    return `<li class="min-w-0"><a href="${escapeHtml(channelUrl(guildId, channel.id))}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 max-w-[11rem] pl-1.5 pr-2 py-0.5 rounded-full bg-slate-900/60 border border-white/5 text-[11px] text-slate-400 hover:text-slate-200 hover:border-white/15 transition-colors" aria-label="${escapeHtml(TEXT.join[lang])} ${name}" title="${escapeHtml(TEXT.join[lang])} ${name}">${icon(ICON.speaker, "w-3 h-3 shrink-0")}<span class="truncate">${name}</span></a></li>`;
}

/** Cuerpo del widget: canales de voz con su gente, y el resto en línea. */
export function renderVoice(
    view: DiscordView,
    lang: Lang = "es",
    guildId: string = DISCORD_GUILD_ID,
) {
    const occupied = view.voice.filter((v) => v.members.length > 0);
    const empty = view.voice.filter((v) => v.members.length === 0);
    const occupiedHtml =
        occupied.length > 0
            ? `<ul class="space-y-1.5">${occupied.map((v) => voiceChannel(v, guildId, lang)).join("")}</ul>`
            : "";
    // Sin nadie en voz, la fila de canales invita a entrar en vez de decir "vacíos".
    const emptyLabel = occupied.length > 0 ? "voiceEmpty" : "nobodyInVoice";
    const emptyHtml =
        empty.length > 0
            ? `<div class="${occupied.length > 0 ? "mt-2.5 " : ""}space-y-1.5">
<span class="text-[10px] font-semibold text-slate-500 block" ${t(emptyLabel, lang)}</span>
<ul class="flex flex-wrap gap-1.5">${empty.map((v) => emptyChannel(v, guildId, lang)).join("")}</ul></div>`
            : "";
    const voice =
        view.voice.length > 0
            ? occupiedHtml + emptyHtml
            : `<p class="text-xs text-slate-400 py-2 text-center" ${t("noVoice", lang)}</p>`;
    const others =
        view.others.length > 0
            ? `<div class="pt-3 mt-3 border-t border-white/[0.06] space-y-2">
<span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block" ${t("alsoOnline", lang)}</span>
<ul class="flex flex-wrap gap-1.5">${view.others
                  .slice(0, OTHERS_LIMIT)
                  .map(
                      (m) =>
                          `<li class="inline-flex items-center gap-1.5 pl-1 pr-2 py-0.5 rounded-full bg-slate-900/60 border border-white/5 min-w-0">${avatar(m, "w-4 h-4")}<span class="text-[11px] text-slate-300 truncate max-w-[9rem]">${escapeHtml(m.username)}</span></li>`,
                  )
                  .join(
                      "",
                  )}${moreOnline(view.others.length - OTHERS_LIMIT, lang)}</ul></div>`
            : "";
    return voice + others;
}

/**
 * Lista sin datos en vivo: mientras carga (`loading`) o si Discord no responde
 * (`offline`). Muestra solo los canales, que sirven para entrar, sin personas.
 */
export function renderChannelsOnly(
    channels: DiscordChannel[],
    state: "loading" | "offline",
    lang: Lang = "es",
    guildId: string = DISCORD_GUILD_ID,
) {
    const sorted = [...channels].sort((a, b) => a.position - b.position);
    const label =
        state === "loading"
            ? `<span class="text-[10px] font-semibold text-slate-500 flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" aria-hidden="true"></span><span ${t("loadingLive", lang)}</span></span>`
            : `<span class="text-[10px] font-semibold text-slate-400 block" ${t("offlineLive", lang)}</span>`;
    const chips = sorted.length
        ? `<ul class="flex flex-wrap gap-1.5">${sorted
              .map((channel) =>
                  emptyChannel({ channel, members: [] }, guildId, lang),
              )
              .join("")}</ul>`
        : "";
    return `<div class="space-y-1.5" aria-live="polite">${label}${chips}</div>`;
}
