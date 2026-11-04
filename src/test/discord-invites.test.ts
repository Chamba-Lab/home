import { describe, expect, it } from "vitest";
import { DISCORD_URL } from "../lib/constants";
import {
    DISCORD_INVITES,
    inviteForPath,
    sourceInvites,
} from "../lib/discord-invites";

const invites = {
    web: "https://discord.gg/web",
    tiktok: "https://discord.gg/tt",
};

describe("sourceInvites", () => {
    it("excluye la web, que es /discord", () => {
        expect(Object.keys(sourceInvites(invites))).toEqual(["tiktok"]);
    });
});

describe("inviteForPath", () => {
    it("resuelve la invitación de cada red", () => {
        expect(inviteForPath("/discord/tiktok/", invites)).toBe(invites.tiktok);
        expect(inviteForPath("/discord/tiktok", invites)).toBe(invites.tiktok);
    });

    it("no distingue mayúsculas", () => {
        expect(inviteForPath("/discord/TikTok/", invites)).toBe(invites.tiktok);
    });

    it("usa la de la web en /discord y en una red desconocida", () => {
        expect(inviteForPath("/discord/", invites)).toBe(invites.web);
        expect(inviteForPath("/discord/x/", invites)).toBe(invites.web);
        expect(inviteForPath("/discord/constructor/", invites)).toBe(
            invites.web,
        );
    });

    it("ignora rutas que no son de /discord", () => {
        expect(inviteForPath("/otra/", invites)).toBeNull();
        expect(inviteForPath("/discordia/", invites)).toBeNull();
        expect(inviteForPath("/discord/a/b/", invites)).toBeNull();
    });
});

describe("DISCORD_INVITES", () => {
    it("la web es la invitación oficial y toda red tiene una URL de Discord", () => {
        expect(DISCORD_INVITES.web).toBe(DISCORD_URL);
        for (const url of Object.values(DISCORD_INVITES)) {
            expect(url).toMatch(/^https:\/\/discord\.gg\/\w+$/);
        }
    });
});
