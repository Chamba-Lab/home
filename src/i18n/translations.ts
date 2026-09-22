export const translations = {
    es: {
        langToggle: "EN",
        navResources: "Recursos",
        navEvents: "Eventos",
        badge: "Comunidad Tech",
        intro: "Una comunidad para quienes construyen su carrera en tech — estudiantes, profesionales y todo lo que hay en el medio. Compartimos conocimiento, oportunidades y apoyo real para crecer juntos. Todo pasa en nuestro Discord.",
        cta: "Unirse a Discord",
        resourcesTitle: "Recursos",
        resourcesIntro:
            "Una selección de guías, plataformas de práctica y plantillas que la comunidad recomienda.",
        eventsTitle: "Próximos eventos",
        eventsIntro:
            "El lanzamiento y las sesiones recurrentes de la comunidad. Fechas exactas siempre confirmadas en el canal #eventos de Discord.",
        noEvents: "No hay eventos programados este mes.",
        filterAll: "Todos",
        noResourcesFound:
            "No encontramos recursos que coincidan con tu búsqueda.",
    },
    en: {
        langToggle: "ES",
        navResources: "Resources",
        navEvents: "Events",
        badge: "Tech Community",
        intro: "A community for people building their careers in tech — students, professionals, and everyone in between. We share knowledge, opportunities, and real support to grow together. It all happens in our Discord.",
        cta: "Join Discord",
        resourcesTitle: "Resources",
        resourcesIntro:
            "A curated set of guides, practice platforms, and templates the community recommends.",
        eventsTitle: "Upcoming events",
        eventsIntro:
            "The launch and the community's recurring sessions. Exact dates are always confirmed in the #eventos channel on Discord.",
        noEvents: "No events scheduled this month.",
        filterAll: "All",
        noResourcesFound: "No resources match your search.",
    },
} as const;

export type Lang = keyof typeof translations;
export type TranslationKey = keyof (typeof translations)["es"];
