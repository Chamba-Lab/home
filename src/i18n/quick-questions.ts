export const QUICK_QUESTIONS_I18N = {
    es: {
        packLabel: "Elige un pack",
        questionsInPack: (count: number) => `${count} preguntas`,
        countLabel: "Número de preguntas",
        countOption: (count: number) => `${count} preguntas`,
        timerLabel: "Tiempo por pregunta",
        timerOption: (seconds: number) =>
            seconds === 0 ? "Sin límite" : `${seconds} s`,
        spanishNote:
            "Las preguntas están solo en español por ahora; la interfaz sí es bilingüe.",
        start: "Empezar",
        progress: (current: number, total: number) =>
            `Pregunta ${current} de ${total}`,
        timeLeft: "Tiempo restante",
        timeUp: "¡Se acabó el tiempo!",
        reveal: "Revelar respuesta",
        correct: "Respuesta correcta",
        why: "Por qué",
        next: "Siguiente pregunta",
        finish: "Terminar",
        hintKeys: "Atajo: Espacio o Enter para continuar",
        doneTitle: "¡Ronda completada!",
        doneBody: (total: number) =>
            `Repasaron ${total} preguntas. ¿Alguna dio para conversar más?`,
        again: "Repetir con otras preguntas",
        changePack: "Cambiar de pack",
    },
    en: {
        packLabel: "Choose a pack",
        questionsInPack: (count: number) => `${count} questions`,
        countLabel: "Number of questions",
        countOption: (count: number) => `${count} questions`,
        timerLabel: "Time per question",
        timerOption: (seconds: number) =>
            seconds === 0 ? "No limit" : `${seconds} s`,
        spanishNote:
            "Questions are in Spanish for now; the interface is bilingual.",
        start: "Start",
        progress: (current: number, total: number) =>
            `Question ${current} of ${total}`,
        timeLeft: "Time left",
        timeUp: "Time's up!",
        reveal: "Reveal answer",
        correct: "Correct answer",
        why: "Why",
        next: "Next question",
        finish: "Finish",
        hintKeys: "Shortcut: Space or Enter to continue",
        doneTitle: "Round complete!",
        doneBody: (total: number) =>
            `You went through ${total} questions. Did any deserve more conversation?`,
        again: "Play again with other questions",
        changePack: "Change pack",
    },
};
