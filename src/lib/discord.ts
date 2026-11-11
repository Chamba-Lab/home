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

/** Avatares que se apilan en «También en línea»; el resto va como «y N más». */
export const OTHERS_AVATARS = 4;
/** Avatares que se apilan en la fila de un canal con gente. */
export const CHANNEL_AVATARS = 3;

const TEXT = {
    voiceChannels: { es: "Canales de voz", en: "Voice channels" },
    enter: { es: "Entrar", en: "Join" },
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
    and: { es: "y", en: "and" },
    more: { es: "más", en: "more" },
    muted: { es: "silenciado", en: "muted" },
    deafened: { es: "ensordecido", en: "deafened" },
} as const;

// Texto bilingüe: se pinta en `lang` y el selector ES/EN lo cambia después.
function bilingual(es: string, en: string, lang: Lang) {
    return `data-i18n-es="${escapeHtml(es)}" data-i18n-en="${escapeHtml(en)}">${escapeHtml(lang === "es" ? es : en)}`;
}

function t(key: keyof typeof TEXT, lang: Lang) {
    return bilingual(TEXT[key].es, TEXT[key].en, lang);
}

/**
 * Nombre del canal sin el emoji con el que empieza en Discord («🗿 General»
 * → «General»): el icono de altavoz ya marca la fila. Si no queda nada, el
 * nombre tal cual.
 */
export function channelLabel(name: string) {
    const label = name
        .replace(/^(?:\p{Extended_Pictographic}|️|‍|\s)+/u, "")
        .trim();
    return label || name;
}

const SPEAKER =
    "M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z";

function speaker(cls: string) {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="${cls}" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${SPEAKER}"/></svg>`;
}

// Avatar redondo con un aro del color de la pantalla, para apilarlos.
function avatar(member: DiscordMember, px: number, ring: string) {
    const name = escapeHtml(member.username);
    const cls = `rounded-full ring-2 ${ring} shrink-0`;
    const src = safeAvatar(member.avatar_url);
    if (src) {
        return `<img src="${src}" alt="" title="${name}" width="${px}" height="${px}" style="width:${px}px;height:${px}px" class="${cls} object-cover bg-[#1e2540]" loading="lazy" referrerpolicy="no-referrer">`;
    }
    const initial = escapeHtml(
        (member.username || "?").charAt(0).toUpperCase(),
    );
    return `<span title="${name}" style="width:${px}px;height:${px}px" class="${cls} bg-brand-discord/40 text-[10px] text-white font-bold flex items-center justify-center">${initial}</span>`;
}

// Quién está en el canal, para lectores de pantalla (los avatares son mudos).
function peopleText(members: DiscordMember[], lang: Lang) {
    return members
        .map((m) => {
            const state =
                m.deaf || m.self_deaf
                    ? TEXT.deafened[lang]
                    : m.mute || m.self_mute
                      ? TEXT.muted[lang]
                      : "";
            return state ? `${m.username} (${state})` : m.username;
        })
        .join(", ");
}

function channelRow(
    { channel, members }: VoiceChannelView,
    guildId: string,
    lang: Lang,
) {
    const name = escapeHtml(channelLabel(channel.name));
    const href = escapeHtml(channelUrl(guildId, channel.id));
    const label = `${escapeHtml(TEXT.join[lang])} ${name}`;
    if (members.length === 0) {
        return `<li><a href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label}" title="${label}" class="group flex items-center gap-2.5 rounded-lg border border-transparent py-1.5 pl-2 pr-2.5 transition-colors hover:border-white/[0.06] hover:bg-white/[0.04]">${speaker("w-3.5 h-3.5 shrink-0 text-slate-500")}<span class="flex-1 min-w-0 truncate text-[13px] font-medium text-slate-400 group-hover:text-slate-200">${name}</span><span class="text-[11px] font-medium text-slate-600 group-hover:text-slate-400" aria-hidden="true" ${t("enter", lang)}</span></a></li>`;
    }
    const people = escapeHtml(peopleText(members, lang));
    const stack = members
        .slice(0, CHANNEL_AVATARS)
        .map((m) => avatar(m, 20, "ring-[#1a2147]"))
        .join("");
    return `<li><a href="${href}" target="_blank" rel="noopener noreferrer" title="${label}" class="flex items-center gap-2.5 rounded-lg border border-brand-discord/35 bg-brand-discord/[0.14] py-2 pl-2 pr-2.5 transition-colors hover:bg-brand-discord/20">${speaker("w-3.5 h-3.5 shrink-0 text-indigo-200")}<span class="flex-1 min-w-0 truncate text-[13px] font-semibold text-white">${name}<span class="sr-only">: ${people}</span></span><span class="flex -space-x-1.5" aria-hidden="true">${stack}</span><span class="text-xs font-bold text-indigo-200" aria-hidden="true">${members.length}</span></a></li>`;
}

function sectionLabel(key: keyof typeof TEXT, lang: Lang, extra = "") {
    return `<p class="${extra}text-[10.5px] font-bold uppercase tracking-[0.09em] text-slate-500" ${t(key, lang)}</p>`;
}

// «Ana, Beto y 2 más»: los dos primeros por nombre y el resto contado.
function othersSummary(members: DiscordMember[], lang: Lang) {
    const names = members.map((m) => m.username);
    const rest = names.length - 2;
    const say = (l: Lang) =>
        rest > 0
            ? `${names[0]}, ${names[1]} ${TEXT.and[l]} ${rest} ${TEXT.more[l]}`
            : names.join(` ${TEXT.and[l]} `);
    return bilingual(say("es"), say("en"), lang);
}

function othersBlock(members: DiscordMember[], lang: Lang) {
    if (members.length === 0) return "";
    const stack = members
        .slice(0, OTHERS_AVATARS)
        .map((m) => avatar(m, 26, "ring-[#0e1428]"))
        .join("");
    return `<div class="mt-3.5 space-y-2">${sectionLabel("alsoOnline", lang)}<div class="flex items-center gap-2.5 min-w-0"><span class="flex -space-x-[7px] shrink-0" aria-hidden="true">${stack}</span><p class="text-xs text-slate-400 truncate" ${othersSummary(members, lang)}</p></div></div>`;
}

/**
 * Cuerpo del widget: los canales de voz como filas (los que tienen gente,
 * primero y resaltados con sus avatares) y quienes están en línea fuera de voz.
 */
export function renderVoice(
    view: DiscordView,
    lang: Lang = "es",
    guildId: string = DISCORD_GUILD_ID,
) {
    const voice =
        view.voice.length > 0
            ? `<ul class="space-y-0.5">${view.voice.map((v) => channelRow(v, guildId, lang)).join("")}</ul>`
            : `<p class="text-xs text-slate-400 py-2" ${t("noVoice", lang)}</p>`;
    return `${sectionLabel("voiceChannels", lang, "mb-2 ")}${voice}${othersBlock(view.others, lang)}`;
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
    const status =
        state === "loading"
            ? `<p class="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-500"><span class="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" aria-hidden="true"></span><span ${t("loadingLive", lang)}</span></p>`
            : `<p class="mb-2 text-[11px] font-medium text-slate-400" ${t("offlineLive", lang)}</p>`;
    const rows = sorted.length
        ? `<ul class="space-y-0.5">${sorted.map((channel) => channelRow({ channel, members: [] }, guildId, lang)).join("")}</ul>`
        : "";
    return `<div aria-live="polite">${sectionLabel("voiceChannels", lang, "mb-2 ")}${status}${rows}</div>`;
}
