import { describe, expect, it } from "vitest";
import {
    FALLBACK_DATA,
    buildView,
    channelUrl,
    normalize,
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

    it("el respaldo tiene a dos personas en General", () => {
        const view = buildView(FALLBACK_DATA);
        expect(view.voice[0].channel.name).toContain("General");
        expect(view.inVoice).toBe(2);
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

    it("marca silenciados y atenúa canales vacíos", () => {
        const html = renderVoice(buildView(data));
        expect(html).toContain("Silenciado");
        expect(html).toContain("opacity-60");
    });

    it("pinta en el idioma pedido con atributos bilingües", () => {
        const html = renderVoice(buildView(data), "en");
        expect(html).toContain('data-i18n-en="Empty">Empty<');
        expect(html).toContain('data-i18n-es="Vacío"');
    });

    it("muestra un estado vacío honesto sin canales", () => {
        const html = renderVoice(buildView(normalize({})));
        expect(html).toContain("No hay canales de voz disponibles.");
    });
});
