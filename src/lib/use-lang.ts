import { useEffect, useState } from "react";

export type Lang = "es" | "en";

/** Interface language of the page, kept in sync with the header toggle. */
export function useLang(): Lang {
    const [lang, setLang] = useState<Lang>("es");

    useEffect(() => {
        const stored = localStorage.getItem("chamba-lab-lang");
        if (stored === "es" || stored === "en") setLang(stored);

        const handleLangChange = (e: Event) => {
            const detail = (e as CustomEvent<{ lang: Lang }>).detail;
            if (detail?.lang === "es" || detail?.lang === "en") {
                setLang(detail.lang);
            }
        };
        document.addEventListener("chamba-lab:lang", handleLangChange);
        return () =>
            document.removeEventListener("chamba-lab:lang", handleLangChange);
    }, []);

    return lang;
}
