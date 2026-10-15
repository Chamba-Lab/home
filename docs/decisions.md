# Decisiones clave

Registro corto de las decisiones que condicionan el proyecto y el porqué. Solo entran las que un contribuidor o agente podría deshacer sin saberlo. Si cambias una, actualiza la entrada en el mismo PR.

## Producto

- **Este repo es solo la landing: la vista pública de la comunidad.** Explica quiénes somos y lleva a Discord, donde ocurre la interacción y las actividades. No aloja backend ni producto operativo; si el proyecto crece a un ecosistema mayor (por ejemplo, un tablero de empleo), vive aparte y este sitio lo enlaza.
- **Lema: _Connect. Inspire. Grow._** Resume la comunidad (conectar, inspirar, crecer juntos). Está en la imagen OG (`brand/og.svg`), los metadatos de `Layout.astro` y el README.
- **Valores: Comunidad y Práctico.** El lema _Connect. Inspire. Grow._ estructura la propuesta de la comunidad (ver `AGENTS.md`).
- **Copy neutro en español.** Sin jerga local para no limitar el crecimiento hacia otros países; "Chamba" (el nombre) es la única excepción.

## Equipo y títulos

- **Títulos públicos del equipo**: `founder`, `cofounder`, `core`, `contributor`, `member`. Fundador, Co-founder y Core team son por invitación; Contributor y Miembro se piden por issue.
- **Los miembros aparecen solo si lo piden.** El muro de miembros es voluntario.
- **Avatares: fundadores con foto local; el resto, desde GitHub en cada visita.** Evita mantener imágenes por persona a cambio de que el navegador consulte a GitHub. Si pesa más lo contrario, se vuelve a `avatar` local o se descarga en el build.

## Técnicas

- **Dominio propio `chambalab.org` en la raíz.** El sitio se sirve desde GitHub Pages con `public/CNAME` y sin `base` en Astro. El DNS vive en Cloudflare (solo DNS, sin proxy). El namespace de los iCal (`<id>@chambalab.org`) no cambia, para que los calendarios sigan actualizando eventos.
- **Sitio 100 % estático (SSG) en GitHub Pages.** Los datos son JSON validados con `content.config.ts`. Lo dinámico se resuelve en el navegador (por ejemplo, el widget de Discord) y no con servidor.
- **Widget de Discord sin bot.** Solo se usa `widget.json`, que expone canales de voz públicos y avatares genéricos; no hay canales de texto, eventos ni fotos reales. Con respuesta correcta nunca se mezclan datos de ejemplo.
- **i18n en el cliente.** El HTML se genera en español y el selector ES/EN cambia los textos en vivo con atributos `data-i18n*`. La preferencia se guarda en `localStorage`.
- **Rutas y anclas en inglés**, copy bilingüe.
- **Un solo origen para URLs externas** (`src/lib/constants.ts`).

## Flujo

- **`master` protegida con ruleset.** PR obligatorio con revisión, checks `Lint, Test & Build` y `PR title (Conventional Commits)`, solo squash. El release lo publica una GitHub App con bypass, no una cuenta personal.
- **Versionado y changelog automáticos** a partir de Conventional Commits; por eso el título del PR importa.
