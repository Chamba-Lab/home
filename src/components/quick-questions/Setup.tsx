import type { QUICK_QUESTIONS_I18N } from "../../i18n/quick-questions";
import {
    COUNT_CHOICES,
    TIMER_CHOICES,
    roundSize,
    type QuickQuestion,
} from "../../lib/quick-questions";
import type { Lang } from "../../lib/use-lang";
import { choiceClass, primaryButton } from "./styles";

export interface Pack {
    id: string;
    name: { es: string; en: string };
    questions: QuickQuestion[];
}

interface SetupProps {
    t: (typeof QUICK_QUESTIONS_I18N)[Lang];
    lang: Lang;
    packs: Pack[];
    packId: string;
    onPack: (id: string) => void;
    count: number;
    onCount: (count: number) => void;
    seconds: number;
    onSeconds: (seconds: number) => void;
    onStart: () => void;
}

const legendClass =
    "text-xs font-bold uppercase tracking-wider text-brand-yellow mb-3";

export default function Setup({
    t,
    lang,
    packs,
    packId,
    onPack,
    count,
    onCount,
    seconds,
    onSeconds,
    onStart,
}: SetupProps) {
    const pack = packs.find((p) => p.id === packId) ?? packs[0];

    return (
        <div className="card-glass rounded-3xl border border-white/10 p-6 sm:p-10 max-w-3xl mx-auto">
            <fieldset className="mb-8">
                <legend className={legendClass}>{t.packLabel}</legend>
                <div className="grid gap-3 sm:grid-cols-3">
                    {packs.map((p) => (
                        <label
                            key={p.id}
                            className={`cursor-pointer rounded-2xl border p-4 transition-colors duration-200 focus-within:ring-2 focus-within:ring-brand-yellow ${
                                p.id === packId
                                    ? "border-brand-yellow bg-brand-yellow/10"
                                    : "border-white/10 bg-slate-900/50 hover:border-brand-yellow/40"
                            }`}
                        >
                            <input
                                type="radio"
                                name="pack"
                                value={p.id}
                                checked={p.id === packId}
                                onChange={() => onPack(p.id)}
                                className="sr-only"
                            />
                            <span className="block font-bold text-white text-sm mb-1">
                                {p.name[lang]}
                            </span>
                            <span className="block text-xs text-slate-400">
                                {t.questionsInPack(p.questions.length)}
                            </span>
                        </label>
                    ))}
                </div>
            </fieldset>

            <div className="grid gap-6 sm:grid-cols-2 mb-8">
                <fieldset>
                    <legend className={legendClass}>{t.countLabel}</legend>
                    <div className="flex flex-wrap gap-2">
                        {COUNT_CHOICES.map((n) => (
                            <button
                                key={n}
                                type="button"
                                aria-pressed={count === n}
                                onClick={() => onCount(n)}
                                className={choiceClass(count === n)}
                            >
                                {t.countOption(
                                    roundSize(n, pack?.questions.length ?? 0),
                                )}
                            </button>
                        ))}
                    </div>
                </fieldset>
                <fieldset>
                    <legend className={legendClass}>{t.timerLabel}</legend>
                    <div className="flex flex-wrap gap-2">
                        {TIMER_CHOICES.map((s) => (
                            <button
                                key={s}
                                type="button"
                                aria-pressed={seconds === s}
                                onClick={() => onSeconds(s)}
                                className={choiceClass(seconds === s)}
                            >
                                {t.timerOption(s)}
                            </button>
                        ))}
                    </div>
                </fieldset>
            </div>

            <p className="text-xs text-slate-500 mb-6">{t.spanishNote}</p>

            <button
                type="button"
                onClick={onStart}
                className={`w-full sm:w-auto ${primaryButton}`}
            >
                {t.start}
            </button>
        </div>
    );
}
