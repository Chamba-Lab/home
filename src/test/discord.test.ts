import { describe, expect, it } from "vitest";
import {
    FALLBACK_CHANNELS,
    OTHERS_AVATARS,
    buildView,
    channelLabel,
    channelUrl,
    normalize,
    renderChannelsOnly,
    renderVoice,
    type DiscordData,
} from "../lib/discord";

const data: DiscordData = {
    id: "1",
    name: "Chamba Lab",
    presence_count: 4,
    channels: [
        { id: "c1", name: "General", position: 0 },
        { id: "c2", name: "Vacío", position: 1 },
        { id: "c3", name: "Sesiones", position: 2 },
    ],
    members: [
        { id: "m1", username: "Ana", channel_id: "c3" },
        { id: "m2", username: "Beto", channel_id: "c3", self_mute: true },
        { id: "m3", username: "Bot", status: "online" },
    ],
};

describe("buildView", () => {
    it("agrupa por canal y pone primero los canales con gente", () => {
        const view = buildView(data);
        expect(view.voice.map((v) => v.channel.id)).toEqual(["c3", "c1", "c2"]);
        expect(view.voice[0].members.map((m) => m.username)).toEqual([
            "Ana",
            "Beto",
        ]);
        expect(view.inVoice).toBe(2);
        expect(view.online).toBe(4);
    });

    it("deja fuera de voz a quien no tiene canal (bots incluidos)", () => {
        expect(buildView(data).others.map((m) => m.username)).toEqual(["Bot"]);
    });

    it("el respaldo trae solo canales, sin personas inventadas", () => {
        expect(FALLBACK_CHANNELS.length).toBeGreaterThan(0);
        for (const channel of FALLBACK_CHANNELS) {
            expect(Object.keys(channel).sort()).toEqual([
                "id",
                "name",
                "position",
            ]);
        }
    });
});

describe("normalize", () => {
    it("rellena campos ausentes sin inventar personas", () => {
        const n = normalize({});
        expect(n.members).toEqual([]);
        expect(n.channels).toEqual([]);
        expect(n.presence_count).toBe(0);
    });
});

describe("renderVoice", () => {
    it("enlaza cada canal a Discord", () => {
        const html = renderVoice(buildView(data), "es", "g1");
        expect(html).toContain(channelUrl("g1", "c3"));
        expect(html).toContain('rel="noopener noreferrer"');
    });

    it("codifica IDs del API en el enlace del canal", () => {
        const evil = '1" onmouseover="a()';
        const html = renderVoice(
            buildView({
                ...data,
                channels: [{ id: evil, name: "General", position: 0 }],
                members: [],
            }),
            "es",
            "../x",
        );
        expect(html).not.toContain('" onmouseover=');
        expect(html).toContain(
            "https://discord.com/channels/..%2Fx/1%22%20onmouseover%3D%22a()",
        );
    });

    it("escapa nombres de usuario y de canal", () => {
        const html = renderVoice(
            buildView({
                ...data,
                channels: [{ id: "c1", name: "<b>x</b>", position: 0 }],
                members: [
                    {
                        id: "m",
                        username: '<img src=x onerror="a()">',
                        channel_id: "c1",
                    },
                ],
            }),
        );
        expect(html).not.toContain("<img src=x");
        expect(html).not.toContain("<b>x</b>");
        expect(html).toContain("&lt;b&gt;x&lt;/b&gt;");
    });

    it("solo acepta avatares del CDN de Discord", () => {
        const html = renderVoice(
            buildView({
                ...data,
                members: [
                    {
                        id: "a",
                        username: "A",
                        channel_id: "c1",
                        avatar_url: "javascript:alert(1)",
                    },
                    {
                        id: "b",
                        username: "B",
                        channel_id: "c1",
                        avatar_url:
                            "https://cdn.discordapp.com/widget-avatar/x",
                    },
                ],
            }),
        );
        expect(html).not.toContain("javascript:");
        expect(html).toContain("https://cdn.discordapp.com/widget-avatar/x");
    });

    it("dice quién está en cada canal, silenciados incluidos", () => {
        const html = renderVoice(buildView(data));
        expect(html).toContain(
            '<span class="sr-only">: Ana, Beto (silenciado)</span>',
        );
    });

    it("pone primero los canales con gente, resaltados, y deja entrar a los vacíos", () => {
        const html = renderVoice(buildView(data), "es", "g1");
        expect(html.indexOf("Sesiones")).toBeLessThan(html.indexOf("General"));
        expect(html).toContain("bg-brand-discord/[0.14]");
        expect(html).toContain(channelUrl("g1", "c1"));
        expect(html).toContain(channelUrl("g1", "c2"));
        expect(html).toContain('data-i18n-es="Entrar"');
    });

    it("sin nadie en voz, ningún canal se resalta", () => {
        const html = renderVoice(buildView({ ...data, members: [] }));
        expect(html).not.toContain("bg-brand-discord/[0.14]");
    });

    it("resume el resto en línea: dos nombres y cuántos más", () => {
        const many = Array.from({ length: OTHERS_AVATARS + 3 }, (_, i) => ({
            id: `o${i}`,
            username: `Persona ${i}`,
        }));
        const html = renderVoice(buildView({ ...data, members: many }));
        expect(html).toContain(">Persona 0, Persona 1 y 5 más<");
        expect(html).toContain(
            'data-i18n-en="Persona 0, Persona 1 and 5 more"',
        );
        expect(html.match(/title="Persona/g)?.length).toBe(OTHERS_AVATARS);
    });

    it("con dos en línea, los nombra a los dos", () => {
        const html = renderVoice(
            buildView({
                ...data,
                members: [
                    { id: "a", username: "Ana" },
                    { id: "b", username: "Beto" },
                ],
            }),
        );
        expect(html).toContain(">Ana y Beto<");
    });

    it("pinta en el idioma pedido con atributos bilingües", () => {
        const html = renderVoice(buildView(data), "en");
        expect(html).toContain('data-i18n-en="Voice channels">Voice channels<');
        expect(html).toContain('data-i18n-es="Canales de voz"');
    });

    it("muestra un estado vacío honesto sin canales", () => {
        const html = renderVoice(buildView(normalize({})));
        expect(html).toContain("No hay canales de voz disponibles.");
    });
});

describe("channelLabel", () => {
    it("quita el emoji del principio del nombre", () => {
        expect(channelLabel("🗿 General")).toBe("General");
        expect(channelLabel("☕code-and-coffee")).toBe("code-and-coffee");
        expect(channelLabel("🎙️Stage")).toBe("Stage");
    });

    it("deja el nombre tal cual si solo es un emoji", () => {
        expect(channelLabel("🎮")).toBe("🎮");
    });
});

describe("renderChannelsOnly", () => {
    const channels = [
        { id: "c2", name: "Segundo", position: 1 },
        { id: "c1", name: "Primero", position: 0 },
    ];

    it("mientras carga, muestra los canales y avisa sin inventar actividad", () => {
        const html = renderChannelsOnly(channels, "loading", "es", "g1");
        expect(html).toContain("Cargando quién está conectado");
        expect(html.indexOf("Primero")).toBeLessThan(html.indexOf("Segundo"));
        expect(html).toContain(channelUrl("g1", "c1"));
    });

    it("sin Discord, lo dice y deja entrar a los canales", () => {
        const html = renderChannelsOnly(channels, "offline", "en", "g1");
        expect(html).toContain("We couldn&#39;t load who&#39;s online");
        expect(html).toContain('data-i18n-es="No pudimos cargar');
        expect(html).toContain(channelUrl("g1", "c2"));
    });
});
