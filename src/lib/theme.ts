export type Theme = "light" | "dark";

const STORAGE_KEY = "chamba-lab-theme";

export function getStoredTheme(): Theme | null {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark") return stored;
    } catch {
        /* ignore storage access issues (private mode, etc.) */
    }
    return null;
}

export function setStoredTheme(theme: Theme) {
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        /* ignore storage access issues (private mode, etc.) */
    }
}

export function systemPrefersDark(): boolean {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/** The theme actually in effect: the visitor's explicit choice, else the OS preference. */
export function currentTheme(): Theme {
    return getStoredTheme() ?? (systemPrefersDark() ? "dark" : "light");
}
