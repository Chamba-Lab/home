import type { Lang } from "./translations";

const STORAGE_KEY = "chamba-lab-lang";

export function getStoredLang(): Lang {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "es" || stored === "en") return stored;
    } catch {
        /* ignore storage access issues (private mode, etc.) */
    }
    return "es";
}

export function setStoredLang(lang: Lang) {
    try {
        localStorage.setItem(STORAGE_KEY, lang);
    } catch {
        /* ignore storage access issues (private mode, etc.) */
    }
}
