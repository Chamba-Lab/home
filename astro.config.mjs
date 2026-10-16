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
    // Sin Markdown con código: Shiki no se usa y es incompatible con la CSP.
    markdown: { syntaxHighlight: false },

    // CSP en un <meta> por página (GitHub Pages no permite cabeceras). Astro
    // calcula los hashes de cada script, así que script-src no admite código
    // inline ajeno. style-src necesita 'unsafe-inline' porque React
    // pre-renderiza el diagrama con atributos style.
    security: {
        csp: {
            directives: [
                "default-src 'self'",
                "img-src 'self' data: https://cdn.discordapp.com https://github.com https://avatars.githubusercontent.com https://img.youtube.com https://yt3.googleusercontent.com",
                "frame-src https://discord.com https://www.youtube-nocookie.com",
                "connect-src 'self' https://discord.com",
                // Vite incrusta como data: los subconjuntos de fuente pequeños.
                "font-src 'self' data:",
                "object-src 'none'",
                "base-uri 'self'",
                "form-action 'self'",
            ],
            styleDirective: {
                resources: ["'self'", "'unsafe-inline'"],
            },
        },
    },

    vite: {
        plugins: [tailwindcss()],
    },
    // Chamba Lab community platform configuration
});
