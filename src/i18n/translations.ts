export const translations = {
    es: {
        langToggle: "EN",
        navResources: "Recursos",
        navEvents: "Eventos",
        navActivities: "Dinámicas",
        joinDiscord: "Unirse a Discord",
        badge: "Comunidad Tech",
        heroTitlePrefix: "El espacio para impulsar tu camino en",
        heroTitleHighlight: "tecnología",
        heroIntro1:
            "Una comunidad para quienes construyen su carrera en tech — estudiantes, profesionales y todo lo que hay en el medio.",
        heroIntro2:
            "Compartimos conocimiento, oportunidades y apoyo real para crecer juntos. Todo pasa en nuestro Discord en tiempo real.",
        ctaDiscord: "Unirse a Discord",
        ctaResources: "Ver Recursos",

        // Discord Card
        discordLiveTag: "LIVE // DISCORD",
        discordOnline: "miembros en línea",
        discordChannels: "Canales de voz y estudio",
        discordJoin: "Unirse a la Comunidad",
        discordWidgetTabModern: "Vista Moderna",
        discordWidgetTabOfficial: "Widget Oficial",

        // Resources Section
        resourcesSectionTitle: "Recursos Curados",
        resourcesSectionDesc:
            "Una selección de guías, plataformas de práctica y plantillas que la comunidad recomienda.",
        resourcesTitle: "Recursos",
        resourcesIntro:
            "Una selección de guías, plataformas de práctica y plantillas que la comunidad recomienda.",
        exploreResource: "Explorar recurso",
        viewAllResources: "Explorar todos los recursos",

        // Events Section
        eventsSectionTitle: "Eventos y Sesiones",
        eventsSectionDesc:
            "Workshops en vivo, simulacros técnicos y espacios de coworking.",
        eventsTitle: "Próximos eventos",
        eventsIntro:
            "El lanzamiento y las sesiones recurrentes de la comunidad. Fechas exactas siempre confirmadas en el canal #eventos de Discord.",
        nextLiveSession: "Próxima Sesión",
        weeklySession: "Sesión Semanal",
        scheduleDiscord: "Agendar en Discord",
        participateDiscord: "Participar en Discord",
        reviewDiscord: "Revisar en Discord",
        addToGCal: "Google Calendar",
        downloadIcs: "iCal",
        viewAllEvents: "Ver calendario completo de eventos",
        noEvents: "No hay eventos programados este mes.",

        filterAll: "Todos",
        noResourcesFound:
            "No encontramos recursos que coincidan con tu búsqueda.",
        dynamicsTitle: "Dinámicas",
        dynamicsIntro:
            "Mini actividades para la comunidad. Gira la ruleta, elige un tema, debate en vivo o desafíate a ti mismo. Perfecto para sesiones en Discord, eventos o simplemente para romper el hielo.",

        // Footer
        footerDesc:
            "Espacio colaborativo para impulsar carreras y compartir oportunidades reales en tecnología en LATAM y el mundo.",
        allRightsReserved: "Todos los derechos reservados.",
    },
    en: {
        langToggle: "ES",
        navResources: "Resources",
        navEvents: "Events",
        navActivities: "Activities",
        joinDiscord: "Join Discord",
        badge: "Tech Community",
        heroTitlePrefix: "The space to empower your path in",
        heroTitleHighlight: "tech",
        heroIntro1:
            "A community for anyone building their career in tech — students, professionals, and everyone in between.",
        heroIntro2:
            "We share knowledge, opportunities, and genuine support to grow together. It all happens live on our Discord.",
        ctaDiscord: "Join Discord",
        ctaResources: "Explore Resources",

        // Discord Card
        discordLiveTag: "LIVE // DISCORD",
        discordOnline: "members online",
        discordChannels: "Voice & study channels",
        discordJoin: "Join Community",
        discordWidgetTabModern: "Modern View",
        discordWidgetTabOfficial: "Official Widget",

        // Resources Section
        resourcesSectionTitle: "Curated Resources",
        resourcesSectionDesc:
            "A curated set of guides, practice platforms, and templates recommended by the community.",
        resourcesTitle: "Resources",
        resourcesIntro:
            "A curated set of guides, practice platforms, and templates the community recommends.",
        exploreResource: "Explore resource",
        viewAllResources: "Explore all resources",

        // Events Section
        eventsSectionTitle: "Events & Sessions",
        eventsSectionDesc:
            "Live workshops, technical mock interviews, and coworking spaces.",
        eventsTitle: "Upcoming events",
        eventsIntro:
            "The launch and recurring sessions of the community. Exact dates are always confirmed in the #eventos channel on Discord.",
        nextLiveSession: "Next Live Session",
        weeklySession: "Weekly Session",
        scheduleDiscord: "RSVP on Discord",
        participateDiscord: "Join on Discord",
        reviewDiscord: "Check on Discord",
        addToGCal: "Google Calendar",
        downloadIcs: "iCal",
        viewAllEvents: "View full events calendar",
        noEvents: "No events scheduled this month.",

        filterAll: "All",
        noResourcesFound: "No resources match your search.",
        dynamicsTitle: "Dynamics",
        dynamicsIntro:
            "Mini activities for the community. Spin the roulette, choose a topic, debate live, or challenge yourself. Perfect for Discord sessions, events, or just breaking the ice.",

        // Footer
        footerDesc:
            "Collaborative space to empower tech careers and share real opportunities across LATAM and beyond.",
        allRightsReserved: "All rights reserved.",
    },
} as const;

export type Lang = keyof typeof translations;
export type TranslationKey = keyof (typeof translations)["es"];
