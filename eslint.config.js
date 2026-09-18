import { createRequire } from "node:module";

import js from "@eslint/js";
import eslintPluginAstro from "eslint-plugin-astro";

const require = createRequire(import.meta.url);
const tsParser = require("@typescript-eslint/parser");

export default [
    js.configs.recommended,
    ...eslintPluginAstro.configs.recommended,
    {
        files: ["*.astro", "**/*.astro"],
        languageOptions: {
            parserOptions: {
                parser: tsParser,
            },
        },
    },
    {
        ignores: [
            "dist/**/*",
            ".astro/**/*",
            "node_modules/**/*",
            "CHANGELOG.md",
            "docs/**/*",
            "README.md",
            "AGENTS.md",
        ],
    },
];
