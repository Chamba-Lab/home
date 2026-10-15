# Decisiones clave

Registro corto de las decisiones que condicionan el proyecto y el porqué. Solo entran las que un contribuidor o agente podría deshacer sin saberlo. Si cambias una, actualiza la entrada en el mismo PR.

## Producto

- **Este repo es solo la landing y el sitio público.** No aloja backend ni producto operativo. Si el proyecto crece a un ecosistema mayor (por ejemplo, un tablero de empleo), vive aparte y este sitio lo enlaza.
- **Lema: _Connect. Inspire. Grow._** Resume la comunidad (conectar, inspirar, crecer juntos). Está en la imagen OG (`brand/og.svg`), los metadatos de `Layout.astro` y el README.
- **Valores: Comunidad y Práctico.** La privacidad no es un pilar de marca; el sitio simplemente no necesita rastreo ni servidor.
- **Glosario cultural progresivo.** "Chamba" es el único término activo (el nombre). Los demás se activan uno a uno en una feature concreta, no como adorno del copy (`docs/branding_concepts.md`).

## Equipo y títulos

- **Títulos públicos independientes de los roles de Discord.** `founder`, `cofounder`, `core`, `contributor`, `member`. Fundador y Co-founder, y Core team, son por invitación; Contributor y Miembro se piden por issue. Los roles internos de Discord (por ejemplo, Staff) no se muestran afuera.
- **Los miembros aparecen solo si lo piden.** El muro de miembros es voluntario.
- **Avatares: fundadores con foto local; el resto, desde GitHub en cada visita.** Evita mantener imágenes por persona a cambio de que el navegador consulte a GitHub. Si pesa más lo contrario, se vuelve a `avatar` local o se descarga en el build.

## Técnicas

- **Sitio 100 % estático (SSG) en GitHub Pages.** Los datos son JSON validados con `content.config.ts`. Lo dinámico se resuelve en el navegador (por ejemplo, el widget de Discord) y no con servidor.
- **Widget de Discord sin bot.** Solo se usa `widget.json`, que expone canales de voz públicos y avatares genéricos; no hay canales de texto, eventos ni fotos reales. Con respuesta correcta nunca se mezclan datos de ejemplo.
- **i18n en el cliente.** El HTML se genera en español y el selector ES/EN cambia los textos en vivo con atributos `data-i18n*`. La preferencia se guarda en `localStorage`.
- **Rutas y anclas en inglés**, copy bilingüe.
- **Un solo origen para URLs externas** (`src/lib/constants.ts`).

## Flujo

- **`master` protegida con ruleset.** PR obligatorio con revisión, checks `Lint, Test & Build` y `PR title (Conventional Commits)`, solo squash. El release lo publica una GitHub App con bypass, no una cuenta personal.
- **Versionado y changelog automáticos** a partir de Conventional Commits; por eso el título del PR importa.
