import { useEffect, useState } from "react";

type NodeKey = "early" | "advising" | "senior" | "growing";

interface NodeDetail {
    title: string;
    subtitle: string;
    description: string;
    points: string[];
}

const ECOSYSTEM_DATA: Record<
    "es" | "en",
    {
        badge: string;
        sectionTitle: string;
        sectionHighlight: string;
        sectionDesc: string;
        advisingActivities: string[];
        growingActivities: string[];
        nodes: Record<NodeKey, NodeDetail>;
    }
> = {
    es: {
        badge: "Ecosistema Comunitario",
        sectionTitle: "El Ecosistema",
        sectionHighlight: "Chamba Lab",
        sectionDesc:
            "Un ciclo colaborativo y continuo. Conectamos a quienes inician con quienes ya tienen camino recorrido.",
        advisingActivities: [
            "Revisión comunitaria de CV, perfil de LinkedIn y GitHub",
            "Difusión y recomendación de convocatorias laborales reales",
            "Revisión colaborativa de código y proyectos personales",
            "Espacio para resolver dudas sobre entornos de trabajo y bloqueos técnicos",
            "Simulacros de entrevistas técnicas y feedback en vivo (Mock Interviews)",
        ],
        growingActivities: [
            "Networking profesional con desarrolladores y líderes de la región",
            "Espacios de conversación sobre arquitectura y diseño de sistemas",
            "Actualización técnica en nuevas herramientas y tendencias de la industria",
            "Desarrollo de habilidades blandas y liderazgo técnico",
            "Ciclo de retorno: compartir experiencia y guiar a quienes recién inician",
        ],
        nodes: {
            early: {
                title: "Early Career",
                subtitle: "Trainee & Junior",
                description:
                    "Espacio para estudiantes, desarrolladores autodidactas y quienes dan sus primeros pasos en la industria tech.",
                points: [
                    "Canales para compartir tu portafolio y proyectos en busca de feedback",
                    "Canal de difusión de oportunidades para perfiles trainee y junior",
                    "Espacio seguro para hacer preguntas técnicas sin temor al juicio",
                ],
            },
            advising: {
                title: "Advising & Preparación",
                subtitle: "Apoyo práctico entre pares",
                description:
                    "Espacio abierto donde la comunidad comparte consejos sinceros y feedback constructivo sobre procesos de selección.",
                points: [
                    "Hilos comunitarios de revisión de CV, LinkedIn y repositorios de GitHub",
                    "Dinámicas periódicas de simulacro de entrevistas técnicas (Mock Interviews)",
                    "Consejos prácticos de miembros con experiencia para superar entrevistas",
                ],
            },
            senior: {
                title: "Mid & Senior",
                subtitle: "Profesionales en actividad",
                description:
                    "Punto de encuentro para desarrolladores con experiencia laboral comprobada en tecnología.",
                points: [
                    "Networking horizontal entre pares de distintos países de la región",
                    "Conversaciones técnicas sobre producción, arquitectura y desafíos reales",
                    "Oportunidad de compartir conocimiento y guiar de forma abierta y flexible",
                ],
            },
            growing: {
                title: "Continuous Growing",
                subtitle: "Evolución continua",
                description:
                    "El ciclo donde los profesionales continúan aprendiendo y fortalecen la comunidad compartiendo su experiencia.",
                points: [
                    "Intercambio de recursos sobre buenas prácticas y nuevas tecnologías",
                    "Espacio para debatir sobre crecimiento profesional y roles de liderazgo",
                    "Cierre del ciclo: devolver apoyo guiando a la siguiente generación",
                ],
            },
        },
    },
    en: {
        badge: "Community Ecosystem",
        sectionTitle: "The",
        sectionHighlight: "Chamba Lab Ecosystem",
        sectionDesc:
            "A collaborative, continuous cycle. Connecting those starting out with seasoned developers.",
        advisingActivities: [
            "Community reviews for CVs, LinkedIn, and GitHub profiles",
            "Sharing and recommending verified tech job opportunities",
            "Collaborative code and personal project reviews",
            "Safe space for technical Q&A and unblocking work challenges",
            "Live technical and behavioral mock interview sessions",
        ],
        growingActivities: [
            "Professional networking with developers and tech leads across LATAM",
            "Conversations on software architecture and system design",
            "Technical upskilling in modern tools and industry trends",
            "Soft skills development, career growth, and technical leadership",
            "Giving back: sharing experience and mentoring newcomers",
        ],
        nodes: {
            early: {
                title: "Early Career",
                subtitle: "Trainee & Junior",
                description:
                    "Designed for graduating students, self-taught developers, and first-year tech professionals.",
                points: [
                    "Channels to showcase your portfolio and projects for community feedback",
                    "Curated diffusion channel for trainee and junior tech opportunities",
                    "Safe and supportive space to ask technical questions without judgment",
                ],
            },
            advising: {
                title: "Advising & Career Prep",
                subtitle: "Hands-on peer support",
                description:
                    "Open space where experienced developers share honest advice and constructive feedback on hiring processes.",
                points: [
                    "Community review threads for resumes, LinkedIn, and GitHub repos",
                    "Regular live technical and behavioral mock interview sessions",
                    "Actionable advice from experienced members on landing tech roles",
                ],
            },
            senior: {
                title: "Mid & Senior",
                subtitle: "Industry professionals",
                description:
                    "A peer circle for developers with proven industry experience across software and tech teams.",
                points: [
                    "Peer-to-peer networking across different tech ecosystems in LATAM",
                    "In-depth discussions on system design, production challenges, and tooling",
                    "Flexible opportunities to share knowledge and mentor incoming talent",
                ],
            },
            growing: {
                title: "Continuous Growing",
                subtitle: "Ongoing evolution",
                description:
                    "The self-sustaining community cycle: engineers continuing their growth while giving back to incoming developers.",
                points: [
                    "Resource sharing on engineering best practices and emerging tech",
                    "Discussions on career advancement and technical leadership paths",
                    "Closing the loop: guiding incoming members to complete the cycle",
                ],
            },
        },
    },
};

export default function CommunityEcosystem() {
    const [lang, setLang] = useState<"es" | "en">("es");
    const [activityIndex, setActivityIndex] = useState(0);
    const [inspectedNode, setInspectedNode] = useState<NodeKey | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("chamba-lab-lang");
        if (stored === "en" || stored === "es") {
            setLang(stored);
        }

        const handleLangChange = (e: Event) => {
            const detail = (e as CustomEvent<{ lang: "es" | "en" }>).detail;
            if (
                detail?.lang &&
                (detail.lang === "es" || detail.lang === "en")
            ) {
                setLang(detail.lang);
            }
        };

        document.addEventListener("chamba-lab:lang", handleLangChange);
        return () =>
            document.removeEventListener("chamba-lab:lang", handleLangChange);
    }, []);

    // Rotate the 2 dynamic interaction hubs every 3 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setActivityIndex((prev) => prev + 1);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const t = ECOSYSTEM_DATA[lang];
    const currentAdvisingActivity =
        t.advisingActivities[activityIndex % t.advisingActivities.length];
    const currentGrowingActivity =
        t.growingActivities[activityIndex % t.growingActivities.length];

    const isEs = lang === "es";
    const inspected = inspectedNode ? t.nodes[inspectedNode] : null;

    const MOBILE_STEPS: Array<{
        key: NodeKey;
        icon: string;
        accentColor: string;
        borderActive: string;
        dynamicActivity?: string;
    }> = [
        {
            key: "early",
            icon: "🚀",
            accentColor: "text-brand-yellow",
            borderActive: "border-brand-yellow/80 shadow-brand-yellow/15",
        },
        {
            key: "advising",
            icon: "✦",
            accentColor: "text-emerald-400",
            borderActive: "border-emerald-400/80 shadow-emerald-400/15",
            dynamicActivity: currentAdvisingActivity,
        },
        {
            key: "senior",
            icon: "⚡",
            accentColor: "text-[#818CF8]",
            borderActive: "border-[#818CF8]/80 shadow-[#5865F2]/20",
        },
        {
            key: "growing",
            icon: "✦",
            accentColor: "text-brand-yellow",
            borderActive: "border-brand-yellow/80 shadow-brand-yellow/15",
            dynamicActivity: currentGrowingActivity,
        },
    ];

    return (
        <section
            id="community-ecosystem"
            className="relative py-16 sm:py-24 overflow-hidden border-t border-white/[0.08]"
        >
            {/* Background lighting */}
            <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-brand-yellow/[0.04] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#5865F2]/[0.08] rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full card-glass text-xs font-semibold text-slate-300 border border-white/10 mb-4">
                        <span className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse" />
                        <span>{t.badge}</span>
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
                        {t.sectionTitle}{" "}
                        <span className="text-brand-yellow">
                            {t.sectionHighlight}
                        </span>
                        .
                    </h2>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                        {t.sectionDesc}
                    </p>
                </div>

                {/* ============================================================== */}
                {/* VISTA MOBILE: STEPPER VERTICAL INTERACTIVO (< 768px)          */}
                {/* ============================================================== */}
                <div className="block md:hidden space-y-3">
                    <div className="text-center text-xs text-slate-400 mb-3 flex items-center justify-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
                        <span>
                            {isEs
                                ? "Toca cada etapa para ver objetivos y dinámicas"
                                : "Tap any stage to view goals and dynamics"}
                        </span>
                    </div>

                    {MOBILE_STEPS.map((step, idx) => {
                        const nodeData = t.nodes[step.key];
                        const isExpanded = inspectedNode === step.key;

                        return (
                            <div key={step.key} className="relative">
                                {/* Connector line between steps */}
                                {idx > 0 && (
                                    <div className="flex justify-center -my-1 py-1">
                                        <div className="w-0.5 h-4 bg-gradient-to-b from-white/25 to-white/10 relative">
                                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] text-slate-500">
                                                ▼
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div
                                    onClick={() =>
                                        setInspectedNode((prev) =>
                                            prev === step.key ? null : step.key,
                                        )
                                    }
                                    className={`card-glass rounded-2xl p-4 border transition-all duration-300 cursor-pointer ${
                                        isExpanded
                                            ? `${step.borderActive} bg-slate-900 shadow-xl`
                                            : "border-white/10 hover:border-white/20 bg-[#070B16]"
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-xl shrink-0">
                                                {step.icon}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-display font-extrabold text-white text-sm truncate">
                                                    {nodeData.title}
                                                </h4>
                                                <p
                                                    className={`text-xs font-semibold ${step.accentColor} truncate`}
                                                >
                                                    {nodeData.subtitle}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`text-xs text-slate-400 transition-transform duration-300 ${
                                                isExpanded
                                                    ? "rotate-180 text-white"
                                                    : ""
                                            }`}
                                        >
                                            ▾
                                        </span>
                                    </div>

                                    {/* Collapsed state live activity ticker */}
                                    {!isExpanded && step.dynamicActivity && (
                                        <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] flex items-center gap-1.5 text-[11px] text-slate-300">
                                            <span className="text-brand-yellow font-bold">
                                                ✦
                                            </span>
                                            <span className="truncate">
                                                {step.dynamicActivity}
                                            </span>
                                        </div>
                                    )}

                                    {/* Expanded accordion details */}
                                    {isExpanded && (
                                        <div className="mt-3 pt-3 border-t border-white/10 animate-in fade-in duration-200">
                                            <p className="text-xs text-slate-300 leading-relaxed mb-3">
                                                {nodeData.description}
                                            </p>
                                            <ul className="space-y-2">
                                                {nodeData.points.map(
                                                    (pt, pIdx) => (
                                                        <li
                                                            key={pIdx}
                                                            className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed"
                                                        >
                                                            <span className="text-brand-yellow font-bold shrink-0">
                                                                ✓
                                                            </span>
                                                            <span>{pt}</span>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                            {step.dynamicActivity && (
                                                <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center gap-1.5 text-[11px] text-slate-400">
                                                    <span className="text-brand-yellow font-bold">
                                                        ✦
                                                    </span>
                                                    <span>
                                                        {step.dynamicActivity}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Continuous cycle indicator at bottom of mobile view */}
                    <div className="pt-2 text-center">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full card-glass border border-white/10 text-[11px] text-slate-400">
                            <span className="text-brand-yellow text-sm">↺</span>
                            <span>
                                {isEs
                                    ? "Ciclo continuo: en comunidad multiplicamos posibilidades"
                                    : "Continuous cycle: in community we multiply possibilities"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ============================================================== */}
                {/* VISTA DESKTOP: CANVAS VECTORIAL CENTRADO (>= 768px)            */}
                {/* ============================================================== */}
                <div className="hidden md:block">
                    <div className="card-glass rounded-3xl p-4 sm:p-8 border border-white/[0.12] bg-[#070B16] shadow-2xl relative">
                        <div className="w-full flex justify-center items-center overflow-x-auto">
                            <svg
                                viewBox="0 0 880 340"
                                className="w-full max-w-4xl h-auto min-w-[680px] select-none block mx-auto"
                                style={{
                                    filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.45))",
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="goldGrad"
                                        x1="0%"
                                        y1="0%"
                                        x2="100%"
                                        y2="100%"
                                    >
                                        <stop offset="0%" stopColor="#FACC15" />
                                        <stop
                                            offset="100%"
                                            stopColor="#F59E0B"
                                        />
                                    </linearGradient>

                                    <linearGradient
                                        id="blurpleGrad"
                                        x1="0%"
                                        y1="0%"
                                        x2="100%"
                                        y2="100%"
                                    >
                                        <stop offset="0%" stopColor="#818CF8" />
                                        <stop
                                            offset="100%"
                                            stopColor="#4F46E5"
                                        />
                                    </linearGradient>

                                    <linearGradient
                                        id="emeraldGrad"
                                        x1="0%"
                                        y1="0%"
                                        x2="100%"
                                        y2="100%"
                                    >
                                        <stop offset="0%" stopColor="#34D399" />
                                        <stop
                                            offset="100%"
                                            stopColor="#059669"
                                        />
                                    </linearGradient>

                                    <filter
                                        id="nodeGlow"
                                        x="-20%"
                                        y="-20%"
                                        width="140%"
                                        height="140%"
                                    >
                                        <feGaussianBlur
                                            stdDeviation="5"
                                            result="blur"
                                        />
                                        <feComposite
                                            in="SourceGraphic"
                                            in2="blur"
                                            operator="over"
                                        />
                                    </filter>

                                    <marker
                                        id="arrYellow"
                                        viewBox="0 0 10 10"
                                        refX="6"
                                        refY="5"
                                        markerWidth="5"
                                        markerHeight="5"
                                        orient="auto-start-reverse"
                                    >
                                        <path
                                            d="M 0 1 L 9 5 L 0 9 z"
                                            fill="#FACC15"
                                        />
                                    </marker>
                                    <marker
                                        id="arrEmerald"
                                        viewBox="0 0 10 10"
                                        refX="6"
                                        refY="5"
                                        markerWidth="5"
                                        markerHeight="5"
                                        orient="auto-start-reverse"
                                    >
                                        <path
                                            d="M 0 1 L 9 5 L 0 9 z"
                                            fill="#34D399"
                                        />
                                    </marker>
                                    <marker
                                        id="arrBlurple"
                                        viewBox="0 0 10 10"
                                        refX="6"
                                        refY="5"
                                        markerWidth="5"
                                        markerHeight="5"
                                        orient="auto-start-reverse"
                                    >
                                        <path
                                            d="M 0 1 L 9 5 L 0 9 z"
                                            fill="#818CF8"
                                        />
                                    </marker>
                                </defs>

                                {/* Background click handler to clear selection */}
                                <rect
                                    width="880"
                                    height="360"
                                    fill="transparent"
                                    className="cursor-default"
                                    onClick={() => setInspectedNode(null)}
                                />

                                {/* ============================================================== */}
                                {/* CONEXIONES VECTORIALES (GEOMETRÍA SIMÉTRICA Y CENTRADA)        */}
                                {/* ============================================================== */}

                                {/* 1. Transición Recta Directa: Early Career (180, 210) -> Mid & Senior (490, 210) */}
                                <g
                                    style={{
                                        opacity:
                                            inspectedNode === "growing"
                                                ? 0.15
                                                : inspectedNode === "advising"
                                                  ? 0.35
                                                  : 0.9,
                                        transition: "opacity 0.3s ease",
                                    }}
                                >
                                    <path
                                        id="path-transition"
                                        d="M 236 210 L 434 210"
                                        fill="none"
                                        stroke="#FACC15"
                                        strokeWidth="2.5"
                                        markerEnd="url(#arrYellow)"
                                    />
                                    <circle
                                        r="4"
                                        fill="#FACC15"
                                        filter="url(#nodeGlow)"
                                    >
                                        <animateMotion
                                            dur="2.4s"
                                            repeatCount="indefinite"
                                            path="M 236 210 L 434 210"
                                        />
                                    </circle>
                                </g>

                                {/* 2. Puente de Advising en 2 Tramos Claros y Simétricos */}
                                {/* Tramo 1: Mid & Senior (450, 170) -> Vértice Derecho de Advising (378, 84) */}
                                <g
                                    style={{
                                        opacity:
                                            inspectedNode === "growing"
                                                ? 0.15
                                                : 0.9,
                                        transition: "opacity 0.3s ease",
                                    }}
                                >
                                    <path
                                        d="M 450 170 L 378 84"
                                        fill="none"
                                        stroke="#34D399"
                                        strokeWidth="2"
                                        strokeDasharray="5 4"
                                        markerEnd="url(#arrEmerald)"
                                    />
                                    <circle
                                        r="3.5"
                                        fill="#34D399"
                                        filter="url(#nodeGlow)"
                                    >
                                        <animateMotion
                                            dur="2.2s"
                                            repeatCount="indefinite"
                                            path="M 450 170 L 378 84"
                                        />
                                    </circle>
                                </g>

                                {/* Tramo 2: Vértice Izquierdo de Advising (297, 80) -> Early Career (225, 166) */}
                                <g
                                    style={{
                                        opacity:
                                            inspectedNode === "growing"
                                                ? 0.15
                                                : 0.9,
                                        transition: "opacity 0.3s ease",
                                    }}
                                >
                                    <path
                                        d="M 297 80 L 225 166"
                                        fill="none"
                                        stroke="#34D399"
                                        strokeWidth="2"
                                        strokeDasharray="5 4"
                                        markerEnd="url(#arrEmerald)"
                                    />
                                    <circle
                                        r="3.5"
                                        fill="#34D399"
                                        filter="url(#nodeGlow)"
                                    >
                                        <animateMotion
                                            dur="2.2s"
                                            repeatCount="indefinite"
                                            path="M 297 80 L 225 166"
                                        />
                                    </circle>
                                </g>

                                {/* Actividad Dinámica Rotativa de Advising */}
                                <g
                                    transform="translate(335, 28)"
                                    style={{
                                        opacity:
                                            inspectedNode === "growing"
                                                ? 0.15
                                                : 0.95,
                                        transition: "opacity 0.3s ease",
                                    }}
                                >
                                    <text
                                        x="0"
                                        y="0"
                                        textAnchor="middle"
                                        fill="#34D399"
                                        fontSize="12.5"
                                        fontWeight="700"
                                        style={{
                                            textShadow:
                                                "0 0 12px rgba(52, 211, 153, 0.4)",
                                        }}
                                    >
                                        ✦ {currentAdvisingActivity}
                                    </text>
                                </g>

                                {/* 3. Loop de Crecimiento: Mid & Senior (490, 210) <-> Growing (720, 210) */}
                                <g
                                    style={{
                                        opacity:
                                            inspectedNode === "early" ||
                                            inspectedNode === "advising"
                                                ? 0.15
                                                : 0.9,
                                        transition: "opacity 0.3s ease",
                                    }}
                                >
                                    {/* Arco superior de ida hacia Growing */}
                                    <path
                                        d="M 536 178 C 576 130, 634 130, 684 178"
                                        fill="none"
                                        stroke="#818CF8"
                                        strokeWidth="2.5"
                                        markerEnd="url(#arrBlurple)"
                                    />
                                    <circle
                                        r="3.5"
                                        fill="#818CF8"
                                        filter="url(#nodeGlow)"
                                    >
                                        <animateMotion
                                            dur="2.6s"
                                            repeatCount="indefinite"
                                            path="M 536 178 C 576 130, 634 130, 684 178"
                                        />
                                    </circle>

                                    {/* Arco inferior de retorno a Mid & Senior */}
                                    <path
                                        d="M 684 242 C 634 290, 576 290, 536 242"
                                        fill="none"
                                        stroke="#818CF8"
                                        strokeWidth="2.5"
                                        markerEnd="url(#arrBlurple)"
                                    />
                                    <circle
                                        r="3.5"
                                        fill="#818CF8"
                                        filter="url(#nodeGlow)"
                                    >
                                        <animateMotion
                                            dur="2.6s"
                                            repeatCount="indefinite"
                                            path="M 684 242 C 634 290, 576 290, 536 242"
                                        />
                                    </circle>

                                    {/* Actividad Dinámica Rotativa de Growing */}
                                    <text
                                        x="610"
                                        y="298"
                                        textAnchor="middle"
                                        fill="#818CF8"
                                        fontSize="12.5"
                                        fontWeight="700"
                                        style={{
                                            textShadow:
                                                "0 0 12px rgba(129, 140, 248, 0.4)",
                                        }}
                                    >
                                        ✦ {currentGrowingActivity}
                                    </text>
                                </g>

                                {/* ============================================================== */}
                                {/* NODOS PRINCIPALES Y ROMBOS (CENTRADOS, CON FOCO Y ATENUACIÓN)  */}
                                {/* ============================================================== */}

                                {/* NODO 1: EARLY CAREER (Círculo en x=180, y=210) */}
                                <g
                                    transform="translate(180, 210)"
                                    className="cursor-pointer group"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setInspectedNode((prev) =>
                                            prev === "early" ? null : "early",
                                        );
                                    }}
                                    style={{
                                        opacity:
                                            inspectedNode &&
                                            inspectedNode !== "early" &&
                                            inspectedNode !== "advising"
                                                ? 0.25
                                                : 1,
                                        transition: "opacity 0.3s ease",
                                    }}
                                >
                                    <circle
                                        cx="0"
                                        cy="0"
                                        r="56"
                                        fill="#0C1528"
                                        stroke="#FACC15"
                                        strokeWidth={
                                            inspectedNode === "early"
                                                ? "3.5"
                                                : "2"
                                        }
                                        filter={
                                            inspectedNode === "early"
                                                ? "url(#nodeGlow)"
                                                : undefined
                                        }
                                    />
                                    <circle
                                        cx="0"
                                        cy="0"
                                        r="48"
                                        fill="url(#goldGrad)"
                                        fillOpacity="0.12"
                                    />
                                    <text
                                        x="0"
                                        y="-10"
                                        textAnchor="middle"
                                        fontSize="22"
                                    >
                                        🚀
                                    </text>
                                    <text
                                        x="0"
                                        y="12"
                                        textAnchor="middle"
                                        fill="#FFFFFF"
                                        fontSize="14"
                                        fontWeight="800"
                                    >
                                        Early Career
                                    </text>
                                    <text
                                        x="0"
                                        y="28"
                                        textAnchor="middle"
                                        fill="#FACC15"
                                        fontSize="11"
                                        fontWeight="700"
                                    >
                                        Trainee & Junior
                                    </text>
                                </g>

                                {/* ROMBO 1: ADVISING (Centrado matemáticamente en x=335, y=80) */}
                                <g
                                    transform="translate(335, 80)"
                                    className="cursor-pointer group"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setInspectedNode((prev) =>
                                            prev === "advising"
                                                ? null
                                                : "advising",
                                        );
                                    }}
                                    style={{
                                        opacity:
                                            inspectedNode === "growing"
                                                ? 0.25
                                                : 1,
                                        transition: "opacity 0.3s ease",
                                    }}
                                >
                                    <g transform="rotate(45)">
                                        <rect
                                            x="-28"
                                            y="-28"
                                            width="56"
                                            height="56"
                                            rx="10"
                                            fill="#0C1528"
                                            stroke="#34D399"
                                            strokeWidth={
                                                inspectedNode === "advising"
                                                    ? "3"
                                                    : "2"
                                            }
                                            filter={
                                                inspectedNode === "advising"
                                                    ? "url(#nodeGlow)"
                                                    : undefined
                                            }
                                        />
                                        <rect
                                            x="-20"
                                            y="-20"
                                            width="40"
                                            height="40"
                                            rx="6"
                                            fill="url(#emeraldGrad)"
                                            fillOpacity="0.15"
                                        />
                                    </g>
                                    <text
                                        x="0"
                                        y="4"
                                        textAnchor="middle"
                                        fill="#34D399"
                                        fontSize="13.5"
                                        fontWeight="800"
                                    >
                                        Advising
                                    </text>
                                </g>

                                {/* NODO 2: MID & SENIOR (Círculo en x=490, y=210) */}
                                <g
                                    transform="translate(490, 210)"
                                    className="cursor-pointer group"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setInspectedNode((prev) =>
                                            prev === "senior" ? null : "senior",
                                        );
                                    }}
                                    style={{
                                        opacity:
                                            inspectedNode &&
                                            inspectedNode !== "senior" &&
                                            inspectedNode !== "advising" &&
                                            inspectedNode !== "growing"
                                                ? 0.35
                                                : 1,
                                        transition: "opacity 0.3s ease",
                                    }}
                                >
                                    <circle
                                        cx="0"
                                        cy="0"
                                        r="56"
                                        fill="#0C1528"
                                        stroke="#818CF8"
                                        strokeWidth={
                                            inspectedNode === "senior"
                                                ? "3.5"
                                                : "2"
                                        }
                                        filter={
                                            inspectedNode === "senior"
                                                ? "url(#nodeGlow)"
                                                : undefined
                                        }
                                    />
                                    <circle
                                        cx="0"
                                        cy="0"
                                        r="48"
                                        fill="url(#blurpleGrad)"
                                        fillOpacity="0.15"
                                    />
                                    <text
                                        x="0"
                                        y="-10"
                                        textAnchor="middle"
                                        fontSize="22"
                                    >
                                        ⚡
                                    </text>
                                    <text
                                        x="0"
                                        y="12"
                                        textAnchor="middle"
                                        fill="#FFFFFF"
                                        fontSize="14"
                                        fontWeight="800"
                                    >
                                        Mid & Senior
                                    </text>
                                    <text
                                        x="0"
                                        y="28"
                                        textAnchor="middle"
                                        fill="#818CF8"
                                        fontSize="11"
                                        fontWeight="700"
                                    >
                                        SSr a más
                                    </text>
                                </g>

                                {/* ROMBO 2: GROWING (Centrado en x=720, y=210) */}
                                <g
                                    transform="translate(720, 210)"
                                    className="cursor-pointer group"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setInspectedNode((prev) =>
                                            prev === "growing"
                                                ? null
                                                : "growing",
                                        );
                                    }}
                                    style={{
                                        opacity:
                                            inspectedNode &&
                                            inspectedNode !== "growing" &&
                                            inspectedNode !== "senior"
                                                ? 0.25
                                                : 1,
                                        transition: "opacity 0.3s ease",
                                    }}
                                >
                                    <g transform="rotate(45)">
                                        <rect
                                            x="-28"
                                            y="-28"
                                            width="56"
                                            height="56"
                                            rx="10"
                                            fill="#0C1528"
                                            stroke="#FACC15"
                                            strokeWidth={
                                                inspectedNode === "growing"
                                                    ? "3"
                                                    : "2"
                                            }
                                            filter={
                                                inspectedNode === "growing"
                                                    ? "url(#nodeGlow)"
                                                    : undefined
                                            }
                                        />
                                        <rect
                                            x="-20"
                                            y="-20"
                                            width="40"
                                            height="40"
                                            rx="6"
                                            fill="url(#goldGrad)"
                                            fillOpacity="0.15"
                                        />
                                    </g>
                                    <text
                                        x="0"
                                        y="4"
                                        textAnchor="middle"
                                        fill="#FACC15"
                                        fontSize="13.5"
                                        fontWeight="800"
                                    >
                                        Growing
                                    </text>
                                </g>
                            </svg>
                        </div>

                        {/* Minimalist Hint Bar */}
                        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
                                {isEs
                                    ? "Toca cualquier nodo o rombo para enfocarlo y conocer sus dinámicas"
                                    : "Click any node or milestone to focus and explore its dynamics"}
                            </span>
                            {inspectedNode && (
                                <button
                                    type="button"
                                    onClick={() => setInspectedNode(null)}
                                    className="text-xs text-brand-yellow hover:underline cursor-pointer"
                                >
                                    {isEs
                                        ? "Restablecer vista completa"
                                        : "Reset view"}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ============================================================== */}
                    {/* DETALLE INFORMATIVO REFINADO (SIN BOTÓN REDUNDANTE DE DISCORD)  */}
                    {/* ============================================================== */}
                    {inspected && (
                        <div className="mt-4 card-glass rounded-2xl p-5 border border-brand-yellow/30 bg-slate-900/90 shadow-xl animate-in fade-in duration-300">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-display font-extrabold text-white text-base">
                                            {inspected.title}
                                        </h4>
                                        <span className="text-xs text-brand-yellow font-semibold">
                                            • {inspected.subtitle}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl mb-3">
                                        {inspected.description}
                                    </p>

                                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-white/[0.08]">
                                        {inspected.points.map((point, i) => (
                                            <li
                                                key={i}
                                                className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed"
                                            >
                                                <span className="text-brand-yellow font-bold">
                                                    ✓
                                                </span>
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setInspectedNode(null)}
                                    className="px-2 py-1 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors shrink-0"
                                    title="Cerrar detalle"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
