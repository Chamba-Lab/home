# DESIGN.md: Chamba Lab Design System

**System Name**: Modern Dark Glassmorphism  
**Version**: 1.0.0  
**Design Reference**: Stitch (Landing Optimizada y Equilibrada)  
**Status**: Active / Production Standard  
**Host Framework**: Astro 7.x + TailwindCSS 4.x + React 19 Islands

---

## 1. Design Philosophy & Identity

Chamba Lab es una plataforma y comunidad de tecnología sin fines de lucro enfocada en democratizar oportunidades laborales e impulsar el crecimiento profesional práctico. El sistema de diseño refleja una experiencia inmersiva para desarrolladores (_developer-centric_), combinando la sobriedad técnica de superficies obsidian con la elegancia del vidrio esmerilado (_frosted glass_), acentos luminiscentes de alta energía y microinteracciones fluidas.

### Core Principles

1. **Dark-Mode First**: Experiencia inmersiva nativa (`#080D1A`), eliminando fluctuaciones visuales y reduciendo la fatiga visual.
2. **Elevación por Vidrio (Glassmorphism)**: La jerarquía visual se establece mediante capas de transparencia, desenfoque de fondo (_backdrop blur_) y bordes de luz especular sutiles, evitando sombras opacas artificiales.
3. **Alto Contraste y Legibilidad**: Todo texto y control cumple o supera el estándar WCAG AA (ratios de contraste superiores a 10:1 frente al fondo).
4. **Microinteracciones y Feedback Háptico**: Estados hover con resplandor (_glow_), elevación física (`-translate-y-0.5`), transiciones CSS suaves y retroalimentación auditiva/visual en componentes interactivos complejos.
5. **No Placeholders**: Todo componente visual o interactivo se implementa funcional, con datos estables y degradación elegante (_graceful fallback_).

---

## 2. Color Palette & Design Tokens

Los tokens base están configurados en `src/styles/global.css` dentro de `@theme` de Tailwind CSS v4.

### 2.1 Surfaces & Canvas (Obsidian Palette)

| Token                           | Hex / Value                 | Rol Semántico                                       |
| ------------------------------- | --------------------------- | --------------------------------------------------- |
| `--color-bg`                    | `#080D1A`                   | Lienzo principal de toda la aplicación              |
| `--color-surface`               | `#0B1120`                   | Paneles principales y contenedores estructurales    |
| `--color-surface-subtle`        | `#0F172A`                   | Superficies secundarias, campos de entrada y barras |
| `--color-surface-card`          | `#131E36`                   | Tarjetas elevadas y contenedores interactivos       |
| `--color-surface-border`        | `#1E293B`                   | Bordes estructurales sólidos                        |
| `--color-surface-border-subtle` | `rgba(255, 255, 255, 0.08)` | Bordes sutiles de vidrio esmerilado                 |

### 2.2 Brand & Accents

| Token                         | Hex / Value | Rol Semántico                                                                |
| ----------------------------- | ----------- | ---------------------------------------------------------------------------- |
| `--color-brand-yellow`        | `#FACC15`   | Amarillo marca primario: CTAs principales, énfasis, agujas y estados activos |
| `--color-brand-yellow-hover`  | `#FDE047`   | Estado hover de botones primarios y enlaces destacados                       |
| `--color-brand-discord`       | `#5865F2`   | Blurple oficial de Discord: widgets, CTAs de comunidad y telemetría          |
| `--color-brand-discord-hover` | `#4752C4`   | Estado hover para acciones de Discord                                        |

### 2.3 Semantic Typography & Status

| Token                     | Hex / Value                 | Rol Semántico                                         |
| ------------------------- | --------------------------- | ----------------------------------------------------- |
| `--color-content`         | `#E2E8F0`                   | Texto principal de lectura (alto contraste)           |
| `--color-muted`           | `#94A3B8`                   | Subtítulos, metadatos, etiquetas secundarias          |
| `--color-content-inverse` | `#020617`                   | Texto sobre superficies luminosas o botones amarillos |
| `--color-border`          | `rgba(255, 255, 255, 0.12)` | Borde estándar para tarjetas y divisores              |
| Status: Online            | `#34D399` / `#10B981`       | Puntos de presencia y estados activos de servidor     |
| Status: Alert             | `#F59E0B`                   | Badges de advertencia o eventos en vivo               |

---

## 3. Typography System

Cargada de forma optimizada vía Google Fonts en `src/layouts/Layout.astro`.

### 3.1 Font Families

- **Display / Titulares**: `'Plus Jakarta Sans', system-ui, sans-serif`  
  _Pesos_: `600` (SemiBold), `700` (Bold), `800` (ExtraBold).  
  _Uso_: H1, H2, H3, números de estadísticas, botones primarios y encabezados de tarjeta.
- **Body / Interfaz**: `'Inter', system-ui, sans-serif`  
  _Pesos_: `400` (Regular), `500` (Medium), `600` (SemiBold).  
  _Uso_: Párrafos de lectura, descripciones, tooltips, formularios y migas de pan.
- **Mono / Código**: `ui-monospace, SFMono-Regular, Menlo, monospace`  
  _Uso_: Badges técnicos, contadores, timestamps y filtros.

### 3.2 Type Scale

| Nivel          | Clase Tailwind                                     | Tamaño      | Leading           | Tracking        |
| -------------- | -------------------------------------------------- | ----------- | ----------------- | --------------- |
| Hero Display   | `text-4xl md:text-6xl font-display font-extrabold` | 36px / 60px | `leading-tight`   | `-0.02em`       |
| Section Title  | `text-2xl sm:text-3xl font-display font-bold`      | 24px / 30px | `leading-snug`    | `-0.01em`       |
| Card Title     | `text-lg sm:text-xl font-display font-bold`        | 18px / 20px | `leading-snug`    | normal          |
| Body Regular   | `text-sm sm:text-base font-sans`                   | 14px / 16px | `leading-relaxed` | normal          |
| Caption / Meta | `text-xs font-sans text-slate-400`                 | 12px        | `leading-normal`  | normal          |
| Micro Badge    | `text-[10px] sm:text-xs font-mono font-semibold`   | 10px / 12px | `leading-none`    | `tracking-wide` |

---

## 4. Spacing, Shapes & Elevation

### 4.1 Corner Roundness Scale

- **Pills & Badges**: `rounded-full` (chips de filtro, selector de idioma, status indicators).
- **Buttons & Inputs**: `rounded-xl` (12px) — controles interactivos estándar.
- **Cards & Modals**: `rounded-2xl` (16px) — tarjetas de eventos, recursos y paneles de control.
- **Interactive Islands & Stages**: `rounded-3xl` (24px) — contenedores principales como el escenario de la ruleta y vitrina del hero.

### 4.2 Elevation & Glass Utilities

- `.card-glass`:
    ```css
    background: rgba(15, 23, 42, 0.65);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: all 0.2s ease;
    ```
    _En hover_: `border-color: rgba(250, 204, 21, 0.3);`
- `.glow-radial`:
    ```css
    background: radial-gradient(
        circle 650px at 50% 0%,
        rgba(250, 204, 21, 0.08),
        transparent 70%
    );
    ```

---

## 5. Component Patterns & UI Library

### 5.1 Sticky Header & Navigation

- **Barra Superior**: `sticky top-0 z-50 backdrop-blur-xl bg-[#080D1A]/85 border-b border-white/[0.08]`.
- **Logo**: Isotipo Power Bolt estilizado (`⚡`) en SVG con gradiente dorado + wordmark display.
- **Segmented Language Switcher**: Pastilla redondeada (`rounded-full bg-slate-900/80 border border-white/10 p-0.5 text-xs`) con botones `ES` / `EN` toggleables y almacenamiento en `localStorage`.
- **Discord Action Button**: Botón compacto con resplandor blurple al interactuar.

### 5.2 Botones & CTAs

- **Primario (Brand Yellow)**:
  `bg-gradient-to-r from-brand-yellow via-amber-300 to-brand-yellow text-slate-950 font-display font-extrabold shadow-lg shadow-brand-yellow/25 hover:shadow-brand-yellow/40 hover:-translate-y-0.5 active:translate-y-0 rounded-xl`
- **Secundario (Glass / Discord)**:
  `card-glass border border-white/10 text-white hover:border-brand-discord hover:bg-brand-discord/10 rounded-xl`
- **Ghost / Icon Button**:
  `p-2 rounded-lg bg-slate-900/80 text-slate-300 hover:text-brand-yellow hover:bg-slate-800 border border-white/10`

### 5.3 Tarjetas Informativas (Vitrinas & Grids)

- Estructura: Fondo `.card-glass`, borde sutil `border-white/[0.08]`, padding generoso (`p-5` o `p-6`).
- Encabezado con badge temático o fecha en pastilla monospace.
- Cuerpo con título de alto contraste y descripción concisa en `text-slate-300`.
- Pie de tarjeta con metadatos técnicos y botón/enlace de acción directa.

### 5.4 Islas Interactivas (React 19)

- **La Ruleta Comunitaria (`RouletteWheel.tsx`)**:
    - Escenario circular con Canvas 2D adaptativo (renderizado radial para soportar hasta 24-30 opciones sin saturación).
    - Aguja física superior (12 o'clock) con animación física de oscilación (_wobble_).
    - Tooltip flotante _dark glass_ con posicionamiento trigonométrico que revela el texto íntegro al hacer hover sobre cualquier sector.
    - Audio sintetizado en Web Audio API (ticks percutivos al rozar las clavijas y acorde pentatónico triunfal al aterrizar).
    - Partículas de confeti dinámicas en canvas superpuesto.
- **Discord Widget (`DiscordWidget.astro` + API Fetch)**:
    - Consumo directo en cliente de la API oficial con _graceful fallback_ estático.
    - Avatares de miembros conectados, canales activos y botón rápido de acceso.

---

## 6. Iconography & Assets

- **Estilo**: SVGs vectoriales inline, trazado limpio (`stroke="currentColor"`, `strokeWidth="2"`), bordes redondeados (`strokeLinecap="round" strokeLinejoin="round"`).
- **Tamaños estándar**:
    - Micro / Inline: `w-3.5 h-3.5` a `w-4 h-4` (ej. ícono Shuffle, enlaces externos, flechas).
    - Controles / Botones: `w-5 h-5`
    - Hero / Features: `w-8 h-8` a `w-12 h-12` envueltos en contenedores esmerilados con resplandor suave.
- **Símbolos Clave**:
    - _Shuffle_: Flechas bidireccionales cruzadas estándar (`M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5`).
    - _Power Bolt_: Rayo de energía característico de Chamba Lab.
    - _Discord_: Logomarca oficial SVG monocromática o en blurple.

---

## 7. Motion & Interaction Guidelines

1. **Duraciones y Curvas**:
    - Hover ordinario: `duration-200 ease-out`.
    - Despliegue de menús y modales: `duration-300 cubic-bezier(0.16, 1, 0.3, 1)`.
    - Giro de Ruleta: `SPIN_DURATION_MS = 5200` con curva de desaceleración cuártica `easeOutQuart(t) = 1 - Math.pow(1 - t, 4)`.
2. **Efectos de Profundidad**:
    - Sutil elevación vertical (`-translate-y-0.5`) combinada con aumento de intensidad de sombra (`shadow-brand-yellow/30`).
3. **Respeto a Preferencias del Sistema**:
    - Soporte para `prefers-reduced-motion: reduce` para desactivar partículas y giros continuos prolongados.

---

## 8. Governance & Maintenance

- Cualquier nuevo componente debe reutilizar estrictamente los tokens de color definidos en `src/styles/global.css`.
- No introducir temas claros paralelos salvo que exista una decisión explícita de arquitectura; la consistencia dark-mode es la directriz central.
- Cada nuevo icono o variante debe documentarse en este archivo y respetar las normas de Atomic Commits y Conventional Commits del protocolo general (`AGENTS.md`).
