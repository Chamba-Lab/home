export const ROULETTE_I18N = {
    es: {
        spinning: "Girando...",
        headerOptionsInWheel: (count: number) => `${count} opciones en rueda`,
        headerAvailableDrawn: (avail: number, drawn: number) =>
            `${avail} disponibles • ${drawn} sorteadas`,
        autoRemove: "Auto-retirar",
        noRemove: "Sin retirar",
        autoRemoveTitleOn:
            "Retiro automático activado: las opciones sorteadas se van retirando de la ruleta",
        autoRemoveTitleOff:
            "Retiro automático desactivado: las opciones permanecen en la ruleta",
        shuffleTitle: "Mezclar aleatoriamente el orden de las opciones",
        sound: "Sonido",
        mute: "Mute",
        clickToSpin: "Haz clic para girar la ruleta",
        hintSpin: "Haz clic en la rueda o en el botón para girar",
        spinButton: "¡GIRAR LA RULETA!",
        spinningButton: "GIRANDO RULETA...",
        resetDrawnCount: (count: number) =>
            `Restablecer opciones sorteadas (${count})`,

        // Canvas messages
        remainingOne: "Queda 1 opción disponible",
        resetToSpin: "Restablece para girar",
        allDrawnTitle: "¡Todas sorteadas!",
        allDrawnSubtitle: "Restablece para volver a girar",
        addAtLeast: "Agrega al menos",
        twoOptionsToSpin: "2 opciones para girar",

        // Result Card
        topicSelected: "Tema Seleccionado",
        removedFromWheel: "Retirada de la ruleta",
        optionOfTotal: (num: number, total: number) =>
            `Opción #${num} de ${total}`,
        remainingPlural: (count: number) =>
            `Quedan ${count} opciones en la ruleta para la siguiente ronda.`,
        remainingSingular: "Queda solo 1 opción por sortear en este paquete.",
        completedAll:
            "¡Completado! Se han sorteado todas las opciones de este paquete en esta sesión.",
        copiedNotice: "¡Copiado para Discord!",
        copyButton: "Copiar pregunta",
        spinAgain: "Girar de nuevo",
        resetOptions: "Restablecer opciones",
        keepInWheel: "Conservar en la ruleta",

        // Tabs
        tabDebates: (count: number) => `Temas de Debate (${count})`,
        tabFree: "Ruleta Libre",

        // Presets list
        selectThemePack: (count: number) =>
            `Selecciona un paquete temático (${count} disponibles)`,
        questionsDisp: (avail: number, total: number) =>
            `${avail} / ${total} disp.`,
        questionsCount: (count: number) => `${count} preguntas`,
        availableQuestions: (avail: number, total: number) =>
            `Preguntas disponibles (${avail} / ${total})`,
        resetShort: (count: number) => `Restablecer (${count})`,
        shuffleOrder: "Mezclar orden",
        allQuestionsDrawnSession:
            "¡Has sorteado todas las preguntas de este paquete en esta sesión!",
        resetQuestions: "Restablecer preguntas",
        drawnThisSession: (count: number) =>
            `Sorteadas en esta sesión (${count})`,
        resetOnReload: "Se restablecen al recargar la página",
        returnOption: "+ Reincorporar",

        // Free mode
        yourOptions: "Tus preguntas u opciones (una por línea)",
        freeModeStats: (avail: number, drawn: number, total: number) =>
            `${avail} disponibles ${drawn > 0 ? `• ${drawn} sorteadas` : ""} / ${total} total`,
        loadSample: "Cargar tema de ejemplo",
        resetDrawn: "Restablecer sorteadas",
        clearText: "Limpiar texto",

        // Sample free-mode questions
        sampleCustomInput:
            "¿Cuál es tu lenguaje de programación favorito?\n¿Qué proyecto te gustaría crear este año?\n¿Cuál fue el bug más difícil que resolviste?\n¿Qué consejo le darías a tu yo junior?\n¿Framework favorito y por qué?\n¿Libro, curso o canal tech que recomiendes?\n¿Prefieres trabajar remoto o presencial?\n¿Cuál ha sido tu peor entrevista técnica?",

        // Preset names
        presetNames: {
            employability: "💼 Empleabilidad & Carrera",
            "tech-debates": "⚔️ Debates Tech & Arquitectura",
            "learning-2026": "🚀 Qué Aprender en 2026",
            "production-dilemmas": "🔥 Dilemas de Producción",
            "ai-dev-future": "🤖 IA & Futuro del Dev",
            "icebreaker-culture": "⚡ Rompehielos & Cultura Dev",
        } as Record<string, string>,
    },
    en: {
        spinning: "Spinning...",
        headerOptionsInWheel: (count: number) => `${count} options on wheel`,
        headerAvailableDrawn: (avail: number, drawn: number) =>
            `${avail} available • ${drawn} drawn`,
        autoRemove: "Auto-remove",
        noRemove: "No removal",
        autoRemoveTitleOn:
            "Auto-remove enabled: drawn options are removed from the roulette",
        autoRemoveTitleOff:
            "Auto-remove disabled: options remain on the roulette",
        shuffleTitle: "Randomly shuffle the options order",
        sound: "Sound",
        mute: "Mute",
        clickToSpin: "Click to spin the roulette",
        hintSpin: "Click on the wheel or the button to spin",
        spinButton: "SPIN THE WHEEL!",
        spinningButton: "SPINNING WHEEL...",
        resetDrawnCount: (count: number) => `Reset drawn options (${count})`,

        // Canvas messages
        remainingOne: "1 option available",
        resetToSpin: "Reset to spin",
        allDrawnTitle: "All options drawn!",
        allDrawnSubtitle: "Reset to spin again",
        addAtLeast: "Add at least",
        twoOptionsToSpin: "2 options to spin",

        // Result Card
        topicSelected: "Selected Topic",
        removedFromWheel: "Removed from roulette",
        optionOfTotal: (num: number, total: number) =>
            `Option #${num} of ${total}`,
        remainingPlural: (count: number) =>
            `${count} options remaining on the wheel for the next round.`,
        remainingSingular: "Only 1 option remaining to draw in this pack.",
        completedAll:
            "Completed! All options in this pack have been drawn in this session.",
        copiedNotice: "Copied for Discord!",
        copyButton: "Copy question",
        spinAgain: "Spin again",
        resetOptions: "Reset options",
        keepInWheel: "Keep on roulette",

        // Tabs
        tabDebates: (count: number) => `Debate Topics (${count})`,
        tabFree: "Free Roulette",

        // Presets list
        selectThemePack: (count: number) =>
            `Select a theme pack (${count} available)`,
        questionsDisp: (avail: number, total: number) =>
            `${avail} / ${total} avail.`,
        questionsCount: (count: number) => `${count} questions`,
        availableQuestions: (avail: number, total: number) =>
            `Available questions (${avail} / ${total})`,
        resetShort: (count: number) => `Reset (${count})`,
        shuffleOrder: "Shuffle order",
        allQuestionsDrawnSession:
            "You have drawn all questions from this pack in this session!",
        resetQuestions: "Reset questions",
        drawnThisSession: (count: number) => `Drawn in this session (${count})`,
        resetOnReload: "Resets when page reloads",
        returnOption: "+ Re-add",

        // Free mode
        yourOptions: "Your questions or options (one per line)",
        freeModeStats: (avail: number, drawn: number, total: number) =>
            `${avail} available ${drawn > 0 ? `• ${drawn} drawn` : ""} / ${total} total`,
        loadSample: "Load sample topic",
        resetDrawn: "Reset drawn options",
        clearText: "Clear text",

        // Sample free-mode questions
        sampleCustomInput:
            "What is your favorite programming language?\nWhat project would you like to build this year?\nWhat was the hardest bug you ever fixed?\nWhat advice would you give to your junior self?\nFavorite framework and why?\nTech book, course, or channel you recommend?\nDo you prefer remote or on-site work?\nWhat has been your worst technical interview?",

        // Preset names
        presetNames: {
            employability: "💼 Employability & Career",
            "tech-debates": "⚔️ Tech Debates & Architecture",
            "learning-2026": "🚀 What to Learn in 2026",
            "production-dilemmas": "🔥 Production Dilemmas",
            "ai-dev-future": "🤖 AI & Future of Dev",
            "icebreaker-culture": "⚡ Icebreakers & Dev Culture",
        } as Record<string, string>,
    },
};
