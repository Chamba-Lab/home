// Exporta a PNG las piezas de Discord de brand/discord/*.svg (tamaño = viewBox, o el indicado).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const dir = new URL("../brand/discord/", import.meta.url);
const pieces = [
    ["server-banner", 960, 540],
    ["invite-splash", 1920, 1080],
    ["launch-announcement", 1200, 675],
    ["launch-event-cover", 1600, 640],
];

for (const [name, w, h] of pieces) {
    const svg = readFileSync(new URL(`${name}.svg`, dir));
    const out = fileURLToPath(new URL(`${name}.png`, dir));
    await sharp(svg).resize(w, h).png({ compressionLevel: 9 }).toFile(out);
    console.log(`${name}.png (${w}x${h})`);
}
