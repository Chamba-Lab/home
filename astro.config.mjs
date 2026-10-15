// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { DISCORD_URL } from "./src/lib/constants";

// https://astro.build/config
export default defineConfig({
    site: "https://chambalab.org",
    // Enlace público estable: si la invitación de Discord cambia, solo se
    // actualiza DISCORD_URL y chambalab.org/discord sigue funcionando.
    redirects: { "/discord": DISCORD_URL },
    integrations: [react(), sitemap()],

    vite: {
        plugins: [tailwindcss()],
    },
    // Chamba Lab community platform configuration
});
