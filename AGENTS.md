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
*   **Páginas**: `/` (hero + intro + CTA), `/recursos` (guías y plataformas curadas), `/eventos` (formatos de sesiones recurrentes).
*   **Layout compartido**: `src/layouts/Layout.astro` monta `Header` y `Footer` (`src/components/`) y centraliza el diccionario ES/EN del toggle de idioma (persistido en `localStorage`).
*   **i18n**: el toggle traduce chrome estructural (nav, hero, CTAs, títulos de sección) vía `data-i18n`. El contenido específico de cada recurso/evento no se fuerza a traducir — se marca su idioma en la propia tarjeta (ver `docs/branding_concepts.md` sobre no forzar copy).

### Backend & Data (Evolutionary)
*   **Phase 1 (Static)**: JSON files como "base de datos" (Content Collections de Astro, `src/content.config.ts` + `src/content/*.json`). **Strict Static Site Generation (SSG)** para compatibilidad con GitHub Pages.
*   **Phase 2 (Dynamic)**:
    *   **Logic**: Python (FastAPI) o Node.js (Hono) para scrapers/APIs ligeras.
    *   **Cloud**: AWS Lambda (Serverless) para tareas cron (ej. Scraper semanal).

## 3. Design System: "Barrio Moderno"
*Estética que inspira confianza, modernidad y cercanía.*

*   **Vibe**: Clean, Bold Typography, High Contrast. "Tech pero humano".
*   **Palette (Concept)**:
    *   *Primary*: `Electric Indigo` (Tech/Futuro).
    *   *Secondary*: `Inca Gold` (Sutil, referencia cultural).
    *   *Background*: `Slate/Zinc` (Modo oscuro preferente).
*   **Typography**: `Inter` o `Geist Sans` (Legibilidad extrema).
*   **Iconography**: Clean SVGs (Heroicons/Phosphor-style). Evitar logos con copyright directo si no es necesario.

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

