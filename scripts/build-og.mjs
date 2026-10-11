// Regenera public/og-image.png (1200x630) desde brand/og.svg.
// Los colores salen de los tokens de src/styles/global.css (@theme), única fuente.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const path = (p) => fileURLToPath(new URL(p, root));

const css = readFileSync(path("src/styles/global.css"), "utf8");
const token = (name) => {
    const m = css.match(
        new RegExp(String.raw`--color-${name}:\s*(#[0-9a-fA-F]{3,8})\s*;`),
    );
    if (!m)
        throw new Error(`Token --color-${name} no encontrado en global.css`);
    return m[1].toUpperCase();
};

const colors = {
    bg: token("bg"),
    yellow: token("brand-yellow"),
    cream: token("brand-cream"),
    muted: token("muted"),
    content: token("content"),
    white: token("content-inverse"),
};

// og.svg es un SVG válido por sí solo (hex reales). Aquí cada hex de marca se
// sustituye por el valor vigente de su token, para que global.css siga siendo
// la única fuente.
const hexToToken = {
    "#080D1A": colors.bg,
    "#FACC15": colors.yellow,
    "#FCF6E8": colors.cream,
    "#94A3B8": colors.muted,
    "#E2E8F0": colors.content,
    "#FFFFFF": colors.white,
};

const svg = readFileSync(path("brand/og.svg"), "utf8").replace(
    /#[0-9a-fA-F]{6}(?![0-9a-fA-F])/g,
    (hex) => hexToToken[hex.toUpperCase()] ?? hex,
);

const out = path("public/og-image.png");
await sharp(Buffer.from(svg))
    .resize(1200, 630)
    .png({ compressionLevel: 9 })
    .toFile(out);
console.log(`OG generado: ${out}`);
