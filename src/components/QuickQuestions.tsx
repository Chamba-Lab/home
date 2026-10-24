import { useEffect, useRef, useState } from "react";
import { QUICK_QUESTIONS_I18N } from "../i18n/quick-questions";
import {
    COUNT_CHOICES,
    DEFAULT_TIMER_SECONDS,
    TIMER_CHOICES,
    buildRound,
    formatSeconds,
    nextIndex,
    roundSize,
    type QuickQuestion,
} from "../lib/quick-questions";

interface Pack {
    id: string;
    name: { es: string; en: string };
    questions: QuickQuestion[];
}

interface QuickQuestionsProps {
    packs: Pack[];
}

type Phase = "setup" | "question" | "revealed" | "done";

const LETTERS = ["A", "B", "C", "D", "E"];

const choiceClass = (active: boolean) =>
    `px-4 py-2 rounded-xl text-sm font-bold border transition-colors duration-200 ${
        active
            ? "bg-brand-yellow text-[#080D1A] border-brand-yellow"
            : "bg-slate-900/50 text-slate-300 border-white/10 hover:border-brand-yellow/40"
    }`;

export default function QuickQuestions({ packs }: QuickQuestionsProps) {
    const [lang, setLang] = useState<"es" | "en">("es");

    useEffect(() => {
        const stored = localStorage.getItem("chamba-lab-lang");
        if (stored === "es" || stored === "en") setLang(stored);

        const handleLangChange = (e: Event) => {
            const detail = (e as CustomEvent<{ lang: "es" | "en" }>).detail;
            if (detail?.lang === "es" || detail?.lang === "en") {
                setLang(detail.lang);
            }
        };
        document.addEventListener("chamba-lab:lang", handleLangChange);
        return () =>
            document.removeEventListener("chamba-lab:lang", handleLangChange);
    }, []);

    const t = QUICK_QUESTIONS_I18N[lang];

    const [packId, setPackId] = useState(packs[0]?.id ?? "");
    const [count, setCount] = useState<number>(COUNT_CHOICES[0]);
    const [seconds, setSeconds] = useState<number>(DEFAULT_TIMER_SECONDS);
    const [phase, setPhase] = useState<Phase>("setup");
    const [round, setRound] = useState<QuickQuestion[]>([]);
    const [index, setIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timedOut, setTimedOut] = useState(false);
    const headingRef = useRef<HTMLHeadingElement>(null);

    const pack = packs.find((p) => p.id === packId) ?? packs[0];
    const current = round[index];

    const start = () => {
        if (!pack) return;
        const questions = buildRound(pack.questions, count);
        if (questions.length === 0) return;
        setRound(questions);
        setIndex(0);
        setTimedOut(false);
        setTimeLeft(seconds);
        setPhase("question");
    };

    const reveal = (byTimer = false) => {
        setTimedOut(byTimer);
        setPhase("revealed");
    };

    const advance = () => {
        const next = nextIndex(index, round.length);
        if (next === null) {
            setPhase("done");
            return;
        }
        setIndex(next);
        setTimedOut(false);
        setTimeLeft(seconds);
        setPhase("question");
    };

    // Countdown: one tick per second while a question is open.
    useEffect(() => {
        if (phase !== "question" || seconds === 0) return;
        if (timeLeft <= 0) {
            setTimedOut(true);
            setPhase("revealed");
            return;
        }
        const id = window.setTimeout(() => setTimeLeft((s) => s - 1), 1000);
        return () => window.clearTimeout(id);
    }, [phase, timeLeft, seconds]);

    // Keep focus on the question heading so keyboard and screen reader users
    // follow the flow without hunting for the next control.
    useEffect(() => {
        if (phase !== "setup") headingRef.current?.focus();
    }, [phase, index]);

    // Space / Enter move the round along (presenter shortcut).
    useEffect(() => {
        if (phase !== "question" && phase !== "revealed") return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== " " && e.key !== "Enter") return;
            const target = e.target as HTMLElement | null;
            if (target?.closest("button, a, input, select, textarea")) return;
            e.preventDefault();
            if (phase === "question") reveal();
            else advance();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    });

    if (!pack) return null;

    const stageClass =
        "card-glass rounded-3xl border border-white/10 p-6 sm:p-10 max-w-3xl mx-auto";

    if (phase === "setup") {
        return (
            <div className={stageClass}>
                <fieldset className="mb-8">
                    <legend className="text-xs font-bold uppercase tracking-wider text-brand-yellow mb-3">
                        {t.packLabel}
                    </legend>
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
                                    onChange={() => setPackId(p.id)}
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
                        <legend className="text-xs font-bold uppercase tracking-wider text-brand-yellow mb-3">
                            {t.countLabel}
                        </legend>
                        <div className="flex flex-wrap gap-2">
                            {COUNT_CHOICES.map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    aria-pressed={count === n}
                                    onClick={() => setCount(n)}
                                    className={choiceClass(count === n)}
                                >
                                    {t.countOption(
                                        roundSize(n, pack.questions.length),
                                    )}
                                </button>
                            ))}
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend className="text-xs font-bold uppercase tracking-wider text-brand-yellow mb-3">
                            {t.timerLabel}
                        </legend>
                        <div className="flex flex-wrap gap-2">
                            {TIMER_CHOICES.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    aria-pressed={seconds === s}
                                    onClick={() => setSeconds(s)}
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
                    onClick={start}
                    className="w-full sm:w-auto bg-brand-yellow text-[#080D1A] font-bold px-8 py-3 rounded-xl hover:brightness-110 transition"
                >
                    {t.start}
                </button>
            </div>
        );
    }

    if (phase === "done") {
        return (
            <div className={`${stageClass} text-center`}>
                <h2
                    ref={headingRef}
                    tabIndex={-1}
                    className="font-display text-3xl font-extrabold text-white mb-3 outline-none"
                >
                    {t.doneTitle}
                </h2>
                <p className="text-slate-300 mb-8">
                    {t.doneBody(round.length)}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        type="button"
                        onClick={start}
                        className="bg-brand-yellow text-[#080D1A] font-bold px-6 py-3 rounded-xl hover:brightness-110 transition"
                    >
                        {t.again}
                    </button>
                    <button
                        type="button"
                        onClick={() => setPhase("setup")}
                        className="border border-white/15 text-slate-200 font-bold px-6 py-3 rounded-xl hover:border-brand-yellow/40 transition"
                    >
                        {t.changePack}
                    </button>
                </div>
            </div>
        );
    }

    if (!current) return null;
    const revealed = phase === "revealed";
    const isLast = nextIndex(index, round.length) === null;

    return (
        <div className={stageClass}>
            <div className="flex items-center justify-between gap-4 mb-6 text-xs font-bold uppercase tracking-wider">
                <span className="text-brand-yellow">
                    {t.progress(index + 1, round.length)}
                </span>
                {seconds > 0 && !revealed && (
                    <span className="text-slate-300 tabular-nums">
                        <span className="sr-only">{t.timeLeft}: </span>
                        <span
                            className={
                                timeLeft <= 5 ? "text-red-300" : undefined
                            }
                        >
                            {formatSeconds(timeLeft)}
                        </span>
                    </span>
                )}
                {timedOut && revealed && (
                    <span className="text-red-300">{t.timeUp}</span>
                )}
            </div>

            <h2
                ref={headingRef}
                tabIndex={-1}
                className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-snug mb-8 outline-none"
            >
                {current.question}
            </h2>

            <ol className="grid gap-3 mb-8">
                {current.options.map((option, i) => {
                    const isAnswer = revealed && i === current.answer;
                    const isWrong = revealed && i !== current.answer;
                    return (
                        <li
                            key={`${index}-${i}`}
                            className={`flex items-start gap-3 rounded-2xl border p-4 text-base transition-colors duration-200 ${
                                isAnswer
                                    ? "border-emerald-400 bg-emerald-400/10 text-white"
                                    : isWrong
                                      ? "border-white/5 bg-slate-900/30 text-slate-400"
                                      : "border-white/10 bg-slate-900/50 text-slate-100"
                            }`}
                        >
                            <span
                                aria-hidden="true"
                                className={`shrink-0 w-7 h-7 rounded-lg grid place-items-center text-xs font-bold ${
                                    isAnswer
                                        ? "bg-emerald-400 text-[#080D1A]"
                                        : "bg-white/10 text-slate-300"
                                }`}
                            >
                                {LETTERS[i]}
                            </span>
                            <span>
                                {option}
                                {isAnswer && (
                                    <span className="sr-only">
                                        {" "}
                                        ({t.correct})
                                    </span>
                                )}
                            </span>
                        </li>
                    );
                })}
            </ol>

            <div aria-live="polite">
                {revealed && current.explanation && (
                    <p className="text-sm text-slate-300 leading-relaxed mb-8 border-l-2 border-emerald-400/60 pl-4">
                        <span className="font-bold text-white">{t.why}: </span>
                        {current.explanation}
                    </p>
                )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {revealed ? (
                    <button
                        type="button"
                        onClick={advance}
                        className="bg-brand-yellow text-[#080D1A] font-bold px-8 py-3 rounded-xl hover:brightness-110 transition"
                    >
                        {isLast ? t.finish : t.next}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => reveal()}
                        className="bg-brand-yellow text-[#080D1A] font-bold px-8 py-3 rounded-xl hover:brightness-110 transition"
                    >
                        {t.reveal}
                    </button>
                )}
                <span className="text-xs text-slate-500">{t.hintKeys}</span>
            </div>
        </div>
    );
}
