// @ts-check
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
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
    // GitHub Pages sirve cada página como carpeta y redirige /ruta a /ruta/
    // con un 301 (un viaje de red extra por clic). Con "always" los enlaces
    // internos llevan barra final y en dev una ruta sin ella da 404.
    trailingSlash: "always",
    // Descarga el HTML de una página interna al pasar el ratón (o tocar) su
    // enlace, para que al hacer clic ya esté. Respeta el ahorro de datos.
    prefetch: { prefetchAll: true, defaultStrategy: "hover" },
    integrations: [react(), sitemap(), mdx()],
    // Sin resaltado de código: Shiki no se usa y es incompatible con la CSP.
    // El MDX del blog hereda esta opción.
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
                // cloudflareinsights.com recibe las métricas de Web Analytics.
                "connect-src 'self' https://discord.com https://cloudflareinsights.com",
                // Vite incrusta como data: los subconjuntos de fuente pequeños.
                "font-src 'self' data:",
                "object-src 'none'",
                "base-uri 'self'",
                "form-action 'self'",
            ],
            // Cloudflare inyecta su beacon de Web Analytics al servir el HTML
            // (no está en el build), así que se permite su dominio.
            scriptDirective: {
                resources: ["'self'", "https://static.cloudflareinsights.com"],
            },
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
