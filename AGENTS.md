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
*   **UI Library**: **React 19+** (Para "Islas" de interactividad: Chamba Board, Forms).
*   **Styling**: **TailwindCSS 4.x** (Utility-first).
*   **Hosting**: **GitHub Pages** (Opción Principal - Costo Cero).
    *   *Alternativa*: Vercel / Netlify (Solo si se requiere SSR en el futuro).
*   **Runtime**: **Node.js >=22.12.0** (ver `engines` en `package.json`; el pipeline usa `lts/*`).

### Site Structure
*   **Páginas**: `/` (hero + intro + CTA), `/recursos` (guías y plataformas curadas), `/eventos` (formatos de sesiones recurrentes), `/dinamicas` (mini actividades comunitarias — ruleta configurable).
*   **Layout compartido**: `src/layouts/Layout.astro` monta `Header` y `Footer` (`src/components/`), inicializa el toggle de idioma y el de tema (claro/oscuro), y trae los componentes reutilizables (`DiscordCta`, `ResourceCard`, `EventItem`, `icons/*`) usados por las páginas.
*   **i18n**: diccionario en `src/i18n/translations.ts`. El toggle traduce chrome estructural (nav, hero, CTAs, títulos de sección) vía `data-i18n`, persistido en `localStorage` (`chamba-lab-lang`). El contenido específico de cada recurso/evento no se fuerza a traducir — se marca su idioma en la propia tarjeta (ver `docs/branding_concepts.md` sobre no forzar copy).
*   **Tema (claro/oscuro)**: lógica en `src/lib/theme.ts`, toggle en el header (ícono sol/luna). Sigue la preferencia del sistema (`prefers-color-scheme`) por defecto; un click guarda una elección explícita en `localStorage` (`chamba-lab-theme`) vía `data-theme` en `<html>`, que tiene prioridad sobre el sistema. Un script inline en el `<head>` de `Layout.astro` aplica el tema guardado antes del primer paint para evitar parpadeo.
*   **Dinámicas (Ruleta)**: isla React (`src/components/RouletteWheel.tsx`) con dos modos. Configurable vía `src/content/dinamicas.json` — tres presets precargados (Empleabilidad, Debates Tech, Qué Aprender 2026) o modo libre donde usuarios ingresan opciones personalizadas (máx 12). Canvas 2D animado con easing, resultado mostrado en card dorada. Datos de presets editables sin tocar código React.
*   **Próximas páginas/features (backlog)** — ver detalle de producto en `docs/project.md`:
    *   **Calendario de eventos**: exportar cada evento de `/eventos` a `.ics` y/o suscribirse (feed ICS) al calendario general de la comunidad.
    *   **Más dinámicas**: extensión de `/dinamicas` con nuevas actividades (preguntas rápidas, minijuegos, etc.) más allá de la ruleta inicial.

### Backend & Data (Evolutionary)
*   **Phase 1 (Static)**: JSON files como "base de datos" (Content Collections de Astro, `src/content.config.ts` + `src/content/*.json`). **Strict Static Site Generation (SSG)** para compatibilidad con GitHub Pages.
*   **Phase 2 (Dynamic)**:
    *   **Logic**: Python (FastAPI) o Node.js (Hono) para scrapers/APIs ligeras.
    *   **Cloud**: AWS Lambda (Serverless) para tareas cron (ej. Scraper semanal).

## 3. Design System: "Neo-brutalista Indigo/Oro"
*Bordes gruesos, sombra dura, bloques de color plano. Tech con carácter, no una plantilla SaaS genérica.*

*   **Vibe**: Alto contraste, tipografía bold en mayúsculas, cero radio de borde, sombras duras (offset, sin blur) que se "aplastan" al interactuar (hover/click). Deliberadamente distinto del look indigo+slate+sombra-suave por defecto de Tailwind.
*   **Tokens**: todo vive en `src/styles/global.css` como variables CSS semánticas dentro de `@theme` (nunca clases de paleta cruda como `indigo-600` o `slate-800` en los componentes). Tailwind v4 genera las utilidades automáticamente (`bg-primary`, `text-muted`, `border-border`, etc.).
    *   `--color-primary` (Electric Indigo, `#4f46e5` claro / `#6366f1` oscuro): botones y bloques de acción.
    *   `--color-accent` (Inca Gold vívido, `#ffc93c` claro / `#d4a94b` oscuro): bloques planos — badges, chip de "Lab" en el wordmark, tags, fecha de eventos. **No usar como color de texto** sobre fondo claro (contraste insuficiente); usar `--color-on-accent` para el texto encima.
    *   `--color-border` ("ink", el trazo de todo borde) y `--color-shadow` (el color de la sombra dura): son los únicos tokens que realmente cambian de tono entre modos — negro/negro en claro, blanco/oro en oscuro. Todo lo demás solo ajusta luminosidad, para que claro/oscuro se sientan la misma marca.
    *   `--color-bg`, `--color-surface`, `--color-content`, `--color-muted`, `--color-content-inverse`: fondo de página, fondo de tarjeta, texto principal, texto secundario, texto sobre `primary`.
*   **Tema**: soporta `prefers-color-scheme` y un toggle manual (`data-theme` en `<html>`, ver sección 2) — ambos casos usan los mismos tokens oscuros, nunca una paleta distinta.
*   **Utilidades propias**: `.shadow-brutal` / `.shadow-brutal-sm` (sombra dura 6px/3px sin blur). Combinar con `hover:translate-x-[Npx] hover:translate-y-[Npx] hover:shadow-none` en elementos interactivos para el efecto de "presión".
*   **Bordes y radio**: `border-[3px] border-border` en casi todo elemento discreto (botones, tarjetas, badges, inputs); radio de borde siempre `0` (`rounded-none`, nunca `rounded-*`).
*   **Typography**: `Archivo Black` para títulos/display (mayúsculas), `Inter` para cuerpo de texto.
*   **Iconography**: SVGs propios inline en `src/components/icons/` (stroke, sin relleno, `currentColor`). Evitar logos con copyright directo si no es necesario.
*   **Referencia visual**: las 13 variantes evaluadas antes de elegir esta dirección quedaron documentadas como Artifact de diseño (canvas con artboards comparables) — pedir el link si se necesita retomar la evaluación.

## 4. Architecture Patterns & Governance
*   **Static First**: Todo contenido informativo (Guías, Blogs) debe ser estático (SSG).
*   **Islands Architecture**: Javascript solo donde es necesario (Busca de empleo, Filtros).
*   **Privacy by Default**:
    *   CVs compartidos públicamente deben ser anonimizados (sin teléfono/dirección).
    *   No tracking invasivo (respetar Do Not Track).

## 5. Development Protocol
1.  **Atomic Commits**: Un cambio lógico = Un commit.
2.  **Linting**: ESLint + Prettier obligatorios (`npm run lint` antes de push).
3.  **Documentation**: Cada feature nueva actualiza este archivo.
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

