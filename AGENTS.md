# AGENTS.md: Chamba Lab Source of Truth
**Status**: Active | **Protocol**: AI-DLC v1.0

## 1. Project Identity
*   **Name**: Chamba Lab
*   **Type**: Community-Led Tech Platform (Non-Profit).
*   **Mission**: Democratizar el acceso a oportunidades laborales en tech, conectando a quienes están construyendo su carrera con quienes ya tienen camino recorrido.
*   **Core Values**:
    *   *Comunidad*: Avanzar por cuenta propia tiene mérito; en comunidad multiplicas tus posibilidades.
    *   *Práctico*: Recursos y apoyo real, no solo teoría.
    *   *Privacidad*: Datos protegidos por diseño.
*   **Nota de marca**: "Chamba" es el único término del glosario cultural activo hoy (es el nombre). El resto (Trome, Pilas, Yapa, etc.) se introduce progresivamente en features concretas, no como copy genérico — ver `docs/branding_concepts.md`.

## 2. Tech Stack Strict (The Ecosystem)
*Construiremos un ecosistema evolutivo, iniciando lean.*

### Frontend (Web Platform)
*   **Framework**: **Astro 7.x** (Rendimiento por defecto).
*   **UI Library**: **React 19+** (Para "Islas" de interactividad: Ecosistema Comunitario, Dinámicas como La Ruleta, Chamba Board).
*   **Styling**: **TailwindCSS 4.x** (Utility-first con tokens en `@theme`).
*   **Hosting**: **GitHub Pages** (Opción Principal - Costo Cero).
    *   *Alternativa*: Vercel / Netlify (Solo si se requiere SSR en el futuro).
*   **Runtime**: **Node.js >=22.12.0** (ver `engines` en `package.json`; el pipeline usa `lts/*`).

### Site Structure
*   **Páginas**: 
    *   `/` (Landing inmersiva: Hero con iluminación radial, integración de widget interactivo de Discord, diagrama interactivo del Ecosistema Chamba Lab con vista dual adaptativa: canvas SVG horizontal simétrico en desktop y stepper interactivo vertical en mobile con acordeón fluido y ticker dinámico, vitrina asimétrica de eventos con exportación a calendarios, vitrina de recursos curados y sección de equipo organizador).
    *   **Equipo organizador** (`src/components/TeamSection.astro`, ancla `#equipo`): título "Quienes hacen Chamba Lab" / "Meet the team" (glosario universal; `Camiseta` sigue reservado). Tarjetas `card-glass` iguales y sin jerarquía, en orden alfabético, con avatar, rol bilingüe y enlaces a GitHub, portfolio y LinkedIn. Datos en `src/content/team.json` (schema `team` en `content.config.ts`); los enlaces opcionales ausentes no se renderizan. Los avatares viven en `src/assets/team/` (descargados de GitHub, no se piden a terceros en cada visita). Para sumar a alguien: añadir su entrada y su foto.
    *   `/resources` (Biblioteca curada de guías, plantillas y plataformas con buscador y filtros por categoría).
    *   `/events` (Calendario de eventos fijos y recurrentes con cálculo por meses desde el primer evento registrado (el historial pasado sigue navegable, con los eventos pasados atenuados), zona horaria comunitaria UTC-5, y exportación funcional a Google Calendar e iCal `.ics` generados con RFC 5545).
    *   `/activities` (Hub de dinámicas comunitarias) y subrutas por actividad (ej. `/activities/roulette`). Rutas siempre en inglés, aunque el copy visible sea en español con soporte bilingüe.
*   **Layout compartido**: `src/layouts/Layout.astro` monta `Header` y `Footer` (`src/components/`), gestiona i18n (`ES`/`EN`), carga las fuentes (`Plus Jakarta Sans` + `Inter`) y aplica la base `class="dark bg-bg text-slate-200"`.
*   **Header responsive**: Sticky glassmorphism (`backdrop-blur-xl bg-[#080D1A]/85 border-b border-white/[0.08]`). Enlaces directos a `/resources`, `/events` y `/activities`. Selector de idioma en pastilla segmentada (`[ ES | EN ]`) y botón CTA de Discord con resplandor (*hover glow*). En mobile colapsa a menú desplegable con fondo desenfocado.
*   **i18n**: Diccionario centralizado en `src/i18n/translations.ts`. El selector traduce el chrome estructural y las secciones de la landing en vivo vía `data-i18n` y atributos bilingües (`data-i18n-en` / `data-i18n-es`), persistiendo la preferencia en `localStorage` (`chamba-lab-lang`).
*   **Enlaces externos centralizados**: `src/lib/constants.ts` es la única fuente de `DISCORD_URL`, `GITHUB_URL` y los datos del widget de Discord (`DISCORD_GUILD_ID`, `DISCORD_WIDGET_API`, `DISCORD_WIDGET_IFRAME`). No repetir estas URLs en componentes. CTAs de Discord con criterio: header, hero, widget, tarjeta final de `/events` y `/activities`, y un icono en el footer junto al de GitHub (repo de código).
*   **Tema**: Dark-mode first (`#080D1A`), garantizando una experiencia inmersiva, consistente y con alto contraste sin fluctuaciones de estilo.
*   **Widget de Discord**: Componente `src/components/DiscordWidget.astro` que obtiene en build time los datos del servidor vía API JSON de Discord (`widget.json`), renderizando una tarjeta *glassmorphism* moderna con el avatar del server (`brand/discord/avatar-cream-1024.png`, optimizado a WebP por `astro:assets`), contador de conectados, canales activos y avatares, con selector para alternar opcionalmente al iFrame oficial.
*   **Ecosistema Comunitario (`src/components/CommunityEcosystem.tsx`)**: Diagrama interactivo del ciclo colaborativo continuo con vista dual adaptativa (desktop SVG horizontal simétrico y mobile stepper interactivo vertical). Modela los perfiles de la comunidad y sus interacciones formativas:
    *   **Perfiles**:
        *   `Early Career` (*Trainee & Junior*): Estudiantes, autodidactas y profesionales que inician. Espacio para recibir feedback de código/CV, acceder a convocatorias iniciales y resolver dudas técnicas en un entorno seguro y libre de juicios.
        *   `Mid & Senior` (*Profesionales en actividad*): Desarrolladores con experiencia laboral comprobada. Punto de encuentro para networking horizontal regional, debates de arquitectura/producción y mentoría abierta y sin fricciones.
    *   **Interacciones**:
        *   `Advising & Preparación`: Apoyo práctico entre pares (revisión comunitaria de CV/LinkedIn/GitHub, difusión de convocatorias reales, revisión de código de proyectos personales y simulacros de entrevistas técnicas / *Mock Interviews* con feedback en vivo).
        *   `Continuous Growing`: Crecimiento profesional continuo y ciclo de retorno (networking con líderes regionales, conversaciones sobre arquitectura y diseño de sistemas, actualización técnica y cierre del ciclo guiando a la siguiente generación).
*   **Dinámicas**: `/activities` lista actividades comunitarias (`src/content/activities.json`). Primera dinámica activa: **La Ruleta** (`/activities/roulette`, datos en `src/content/roulette.json`) con soporte bilingüe (ES/EN), 7 packs precargados (96 preguntas de empleabilidad, arquitectura, tendencias 2026 con 24 opciones para early career y 12 para mid/senior, dilemas de producción, IA y rompehielos) y modo libre (hasta 24 opciones), construida en React 19 sobre Canvas 2D adaptativo con tooltips flotantes en hover, física de aguja (*needle wobble*), sintetizador de audio con Web Audio API, confeti dinámico y retiro progresivo de opciones sorteadas en la sesión activa (con opciones de reincorporación y restablecimiento).

### Backend & Data (Evolutionary)
*   **Phase 1 (Static)**: Archivos JSON como base de datos (`src/content.config.ts` + `src/content/*.json`). **Strict Static Site Generation (SSG)** para compatibilidad con GitHub Pages.
*   **Phase 2 (Dynamic)**:
    *   **Logic**: Python (FastAPI) o Node.js (Hono) para scrapers/APIs ligeras.
    *   **Cloud**: AWS Lambda (Serverless) para tareas cron (ej. Scraper semanal).

## 3. Design System: "Modern Dark Glassmorphism" (Stitch: Landing Optimizada y Equilibrada)
*Estética inmersiva para desarrolladores: superficies obsidian-blue, vidrio esmerilado, iluminación radial y acentos vibrantes. Ver especificación exhaustiva en [DESIGN.md](./DESIGN.md).*

*   **Vibe**: Alto contraste, tipografía display elegante en titulares, esquinas suavemente redondeadas (`rounded-xl`, `rounded-2xl`), gradientes radiales sutiles y efectos de resplandor (*glow*) en interacción.
*   **Tokens**: Definidos en `src/styles/global.css` dentro de `@theme` de Tailwind v4:
    *   `--color-bg`: `#080D1A` (Fondo lienzo principal).
    *   `--color-surface`: `#0B1120` (Superficie de paneles y contenedores).
    *   `--color-surface-subtle`: `#0f172a`.
    *   `--color-surface-card`: `#131e36` (Superficie de tarjetas elevadas).
    *   `--color-brand-yellow`: `#FACC15` (Amarillo marca de alto impacto en CTAs primarios y énfasis de texto).
    *   `--color-brand-yellow-deep`: `#A16207` (Texto amarillo sobre fondos claros, 4.51:1).
    *   `--color-brand-cream`: `#FCF6E8` (Crema de la mascota: fondo sobre claro, avatar alternativo).
    *   `--color-brand-discord`: `#5865F2` (Blurple oficial para acciones y telemetría de Discord).
    *   `--color-border`: `rgba(255, 255, 255, 0.12)`.
*   **Utilidades visuales clave**:
    *   `.glow-radial`: Gradiente radial superior dorado suave que ilumina el hero.
    *   `.card-glass`: Fondo traslúcido (`rgba(15, 23, 42, 0.65)`), desenfoque de fondo (`backdrop-filter: blur(16px)`), borde sutil `rgba(255, 255, 255, 0.08)` y transición a `border-brand-yellow/30` en hover.
*   **Tipografía**:
    *   Display / Títulos: **Plus Jakarta Sans** (pesos 600, 700, 800) para impacto visual limpio y moderno.
    *   Cuerpo de texto / Lectura: **Inter** (pesos 400, 500, 600) para máxima legibilidad.
*   **Identidad / Mascota**: Logo = mascota (mapache/gato con taza de café, *grumpy*). Masters SVG en `src/assets/brand/` (el header y el footer usan `chamba-tile.svg`); `brand/og.svg` es la plantilla de la imagen OG y `brand/discord/` guarda los avatares 1024. Nunca colocar la mascota directo sobre `#080D1A`: usar tile amarillo, sticker o fondo crema (`--color-brand-cream`). Reglas completas, tamaños mínimos y favicon en [DESIGN.md §6.1](./DESIGN.md).
    *   `npm run brand:optimize`: optimiza los SVG con svgo (`svgo.config.cjs`, conserva los `id` de capa).
    *   `npm run brand:og`: regenera `public/og-image.png` (1200x630) desde `brand/og.svg` con los colores de los tokens.
    *   Iconos de sitio en `public/`: `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest`.
*   **ICS**: el `UID` de cada evento es `<id>@chambalab.org` (`src/lib/calendar.ts`). `chambalab.org` es solo un namespace para el identificador, no un dominio que el sitio sirva; debe mantenerse estable para que los clientes de calendario actualicen en vez de duplicar eventos.
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
