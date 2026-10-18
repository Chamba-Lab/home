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
 * Respaldo SOLO si la API falla (sin red o Discord caído): refleja la vista
 * real del servidor. Son datos de ejemplo, no personas en vivo.
 */
export const FALLBACK_DATA: DiscordData = {
    id: DISCORD_GUILD_ID,
    name: "Chamba Lab",
    presence_count: 3,
    channels: [
        { id: "1548810529097781390", name: "🗿 General", position: 0 },
        { id: "1551276099198259230", name: "☕code-and-coffee", position: 1 },
        { id: "1560563282438258758", name: "Stage", position: 2 },
        // ID de ejemplo: el canal real no sale en el widget público.
        { id: "0", name: "ask-feedback", position: 3 },
    ],
    members: [
        { id: "0", username: "Jockie Music", status: "online" },
        {
            id: "1",
            username: "Lolipow",
            status: "online",
            channel_id: "1548810529097781390",
        },
        {
            id: "2",
            username: "Melio",
            status: "online",
            channel_id: "1548810529097781390",
        },
    ],
};

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

const TEXT = {
    voiceEmpty: { es: "Vacío", en: "Empty" },
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
    const count =
        members.length > 0
            ? `<span class="text-[10px] font-bold text-emerald-400 font-mono">${members.length}</span>`
            : `<span class="text-[10px] text-slate-500" ${t("voiceEmpty", lang)}</span>`;
    const people =
        members.length > 0
            ? `<ul class="px-2.5 pb-2 space-y-1">${members.map((m) => voiceMember(m, lang)).join("")}</ul>`
            : "";
    return `<li class="rounded-lg bg-slate-900/60 border border-white/5 hover:border-white/15 transition-colors${members.length === 0 ? " opacity-60" : ""}">
<a href="${escapeHtml(channelUrl(guildId, channel.id))}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between gap-2 px-2.5 py-1.5 min-w-0" aria-label="${escapeHtml(TEXT.join[lang])} ${name}" title="${escapeHtml(TEXT.join[lang])} ${name}">
<span class="flex items-center gap-1.5 min-w-0 text-xs font-semibold text-slate-300">${icon(ICON.speaker, "w-3.5 h-3.5 shrink-0 text-slate-400")}<span class="truncate">${name}</span></span>${count}</a>${people}</li>`;
}

/** Cuerpo del widget: canales de voz con su gente, y el resto en línea. */
export function renderVoice(
    view: DiscordView,
    lang: Lang = "es",
    guildId: string = DISCORD_GUILD_ID,
) {
    const voice =
        view.voice.length > 0
            ? `<ul class="space-y-1.5">${view.voice.map((v) => voiceChannel(v, guildId, lang)).join("")}</ul>`
            : `<p class="text-xs text-slate-400 py-2 text-center" ${t("noVoice", lang)}</p>`;
    const others =
        view.others.length > 0
            ? `<div class="pt-3 mt-3 border-t border-white/[0.06] space-y-2">
<span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block" ${t("alsoOnline", lang)}</span>
<ul class="flex flex-wrap gap-1.5">${view.others
                  .map(
                      (m) =>
                          `<li class="inline-flex items-center gap-1.5 pl-1 pr-2 py-0.5 rounded-full bg-slate-900/60 border border-white/5 min-w-0">${avatar(m, "w-4 h-4")}<span class="text-[11px] text-slate-300 truncate max-w-[9rem]">${escapeHtml(m.username)}</span></li>`,
                  )
                  .join("")}</ul></div>`
            : "";
    return voice + others;
}
