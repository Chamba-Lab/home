# AGENTS.md: Chamba Lab Source of Truth
**Status**: Active | **Protocol**: AI-DLC v1.0

## 1. Project Identity
*   **Name**: Chamba Lab
*   **Type**: Community-Led Tech Platform (Non-Profit).
*   **Mission**: Democratizar el acceso a oportunidades laborales en tech, conectando a quienes están construyendo su carrera con quienes ya tienen camino recorrido.
*   **Core Values**:
    *   *Comunidad*: Nadie crece solo.
    *   *Práctico*: Recursos y apoyo real, no solo teoría.
    *   *Privacidad*: Datos protegidos por diseño.
*   **Nota de marca**: "Chamba" es el único término del glosario cultural activo hoy (es el nombre). El resto (Trome, Pilas, Yapa, etc.) se introduce progresivamente en features concretas, no como copy genérico — ver `docs/branding_concepts.md`.

## 2. Tech Stack Strict (The Ecosystem)
*Construiremos un ecosistema evolutivo, iniciando lean.*

### Frontend (Web Platform)
*   **Framework**: **Astro 7.x** (Rendimiento por defecto).
*   **UI Library**: **React 19+** (Para "Islas" de interactividad: Chamba Board, Dinámicas, Forms).
*   **Styling**: **TailwindCSS 4.x** (Utility-first con tokens en `@theme`).
*   **Hosting**: **GitHub Pages** (Opción Principal - Costo Cero).
    *   *Alternativa*: Vercel / Netlify (Solo si se requiere SSR en el futuro).
*   **Runtime**: **Node.js >=22.12.0** (ver `engines` en `package.json`; el pipeline usa `lts/*`).

### Site Structure
*   **Páginas**: 
    *   `/` (Landing inmersiva: Hero con iluminación radial, integración de widget interactivo de Discord, vitrina dinámica de recursos curados y vitrina asimétrica de eventos destacados y recurrentes).
    *   `/resources` (Biblioteca curada de guías, plantillas y plataformas con buscador y filtros por categoría).
    *   `/events` (Calendario de eventos fijos y recurrentes con cálculo por meses y exportación a Google Calendar / iCal).
    *   `/activities` (Hub de dinámicas comunitarias) y subrutas por actividad (ej. `/activities/roulette`). Rutas siempre en inglés, aunque el copy visible sea en español con soporte bilingüe.
*   **Layout compartido**: `src/layouts/Layout.astro` monta `Header` y `Footer` (`src/components/`), gestiona i18n (`ES`/`EN`), carga las fuentes (`Plus Jakarta Sans` + `Inter`) y aplica la base `class="dark bg-[#080D1A] text-slate-200"`.
*   **Header responsive**: Sticky glassmorphism (`backdrop-blur-xl bg-[#080D1A]/85 border-b border-white/[0.08]`). Enlaces directos a `/resources`, `/events` y `/activities`. Selector de idioma en pastilla segmentada (`[ ES | EN ]`) y botón CTA de Discord con resplandor (*hover glow*). En mobile colapsa a menú desplegable con fondo desenfocado.
*   **i18n**: Diccionario centralizado en `src/i18n/translations.ts`. El selector traduce el chrome estructural y las secciones de la landing en vivo vía `data-i18n` y atributos bilingües (`data-i18n-en` / `data-i18n-es`), persistiendo la preferencia en `localStorage` (`chamba-lab-lang`).
*   **Tema**: Dark-mode first (`#080D1A`), garantizando una experiencia inmersiva, consistente y con alto contraste sin fluctuaciones de estilo.
*   **Widget de Discord**: Componente `src/components/DiscordWidget.astro` que obtiene en build time los datos del servidor vía API JSON de Discord (`widget.json`), renderizando una tarjeta *glassmorphism* moderna con contador de conectados, canales activos y avatares, con selector para alternar opcionalmente al iFrame oficial.
*   **Dinámicas**: `/activities` lista actividades comunitarias (`activities.json`). Primera dinámica activa: **La Ruleta** (`/activities/roulette`) con tres packs precargados (Empleabilidad, Debates Tech, Qué Aprender 2026) y modo libre, construida en React 19 sobre Canvas 2D.

### Backend & Data (Evolutionary)
*   **Phase 1 (Static)**: Archivos JSON como base de datos (`src/content.config.ts` + `src/content/*.json`). **Strict Static Site Generation (SSG)** para compatibilidad con GitHub Pages.
*   **Phase 2 (Dynamic)**:
    *   **Logic**: Python (FastAPI) o Node.js (Hono) para scrapers/APIs ligeras.
    *   **Cloud**: AWS Lambda (Serverless) para tareas cron (ej. Scraper semanal).

## 3. Design System: "Modern Dark Glassmorphism" (Stitch: Landing Optimizada y Equilibrada)
*Estética inmersiva para desarrolladores: superficies obsidian-blue, vidrio esmerilado, iluminación radial y acentos vibrantes.*

*   **Vibe**: Alto contraste, tipografía display elegante en titulares, esquinas suavemente redondeadas (`rounded-xl`, `rounded-2xl`), gradientes radiales sutiles y efectos de resplandor (*glow*) en interacción.
*   **Tokens**: Definidos en `src/styles/global.css` dentro de `@theme` de Tailwind v4:
    *   `--color-bg`: `#080D1A` (Fondo lienzo principal).
    *   `--color-surface`: `#0B1120` (Superficie de paneles y contenedores).
    *   `--color-surface-subtle`: `#0f172a`.
    *   `--color-surface-card`: `#131e36` (Superficie de tarjetas elevadas).
    *   `--color-brand-yellow`: `#FACC15` (Amarillo marca de alto impacto en CTAs primarios y énfasis de texto).
    *   `--color-brand-discord`: `#5865F2` (Blurple oficial para acciones y telemetría de Discord).
    *   `--color-border`: `rgba(255, 255, 255, 0.12)`.
*   **Utilidades visuales clave**:
    *   `.glow-radial`: Gradiente radial superior dorado suave que ilumina el hero.
    *   `.card-glass`: Fondo traslúcido (`rgba(15, 23, 42, 0.65)`), desenfoque de fondo (`backdrop-filter: blur(16px)`), borde sutil `rgba(255, 255, 255, 0.08)` y transición a `border-brand-yellow/30` en hover.
*   **Tipografía**:
    *   Display / Títulos: **Plus Jakarta Sans** (pesos 600, 700, 800) para impacto visual limpio y moderno.
    *   Cuerpo de texto / Lectura: **Inter** (pesos 400, 500, 600) para máxima legibilidad.
*   **Iconografía**: SVGs limpios inline optimizados (`DiscordIcon`, flechas, menú) y Google Material Symbols Outlined.

## 4. Architecture Patterns & Governance
*   **Static First**: Todo contenido informativo (Guías, Recursos, Eventos) es estático (SSG).
*   **Islands Architecture**: Javascript solo donde es interactivo (Dinámicas en React, switchers en componentes Astro).
*   **Privacy by Default**: Respeto a privacidad comunitaria, sin tracking invasivo.

## 5. Development Protocol
1.  **Atomic Commits**: Un cambio lógico = Un commit.
2.  **Linting**: ESLint + Prettier obligatorios (`npm run lint` antes de push).
3.  **Documentation**: Cada feature nueva actualiza este archivo maestro.
4.  **Conventional Commits**: Obligatorio usar prefijos estándar (`feat:`, `fix:`, `chore:`) para alimentar el changelog automático.

## 6. CI/CD Pipeline (Automated)
*   **Provider**: GitHub Actions.
*   **Trigger**: Push to `master`.
*   **Tools**:
    *   `release-it`: Gestión de versiones y git tags.
    *   `auto-changelog`: Generación de historial de cambios.
*   **Stages**:
    *   `Lint & Test` → `Release` → `Build` → `Deploy (GitHub Pages)`.

## 7. Community & Resources
*   **Discord**: [Unirse a la Comunidad](https://discord.gg/TCuZSnfKTE) (Hub central de coordinación).
*   **GitHub**: Repositorio principal para código y issues.
