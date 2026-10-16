# Decisiones clave

Registro corto de las decisiones que condicionan el proyecto y el porqué. Solo entran las que un contribuidor o agente podría deshacer sin saberlo. Si cambias una, actualiza la entrada en el mismo PR.

## Producto

- **Este repo es solo la landing: la vista pública de la comunidad.** Explica quiénes somos y lleva a Discord, donde ocurre la interacción y las actividades. No aloja backend ni producto operativo; si el proyecto crece a un ecosistema mayor (por ejemplo, un tablero de empleo), vive aparte y este sitio lo enlaza.
- **Lema: _Connect. Inspire. Grow._** Resume la comunidad (conectar, inspirar, crecer juntos). Está en la imagen OG (`brand/og.svg`), los metadatos de `Layout.astro` y el README.
- **Valores: Comunidad y Práctico.** El lema _Connect. Inspire. Grow._ estructura la propuesta de la comunidad (ver `AGENTS.md`).
- **Copy neutro en español.** Sin jerga local para no limitar el crecimiento hacia otros países; "Chamba" (el nombre) es la única excepción.

## Recursos

- **Curación con criterios explícitos y marca de acceso.** Cada recurso debe ser seguro, tener un propósito claro, poder empezarse sin pagar y estar vigente (criterios completos en `CONTRIBUTING.md`). El campo `access` (`free`, `freemium`, `paid`) se muestra en la tarjeta solo en cursos y certificaciones, donde el costo decide; en herramientas de IA o portales de empleo casi todo es gratis o freemium y la etiqueta sobra. Las descripciones evitan precios y límites exactos porque cambian. Los de pago entran solo como referencia clara de su categoría.
- **Tres formatos de recurso: web, canal de YouTube y video.** Un campo `type` (por defecto `web`) cambia la forma de la tarjeta y se filtra por formato además de por categoría. Para un canal sirve más el canal que su sitio. Los videos muestran la miniatura de YouTube y cargan el reproductor (`youtube-nocookie.com`) solo al pulsar, para no enviar datos antes. El avatar de un canal es la URL de su imagen en YouTube, cargada por el navegador con la inicial como respaldo (mismo patrón que los avatares de GitHub en `/team`): no hay imágenes de terceros en el repo y, si YouTube cambia la imagen, el sitio sigue viéndose bien.
- **Herramientas de IA listadas sin preferencia.** Se incluyen los asistentes más usados con el mismo criterio y en orden neutral, sin recomendar uno sobre otro.

- **Página de recursos con dos niveles de lectura.** Título y subtítulo; las categorías se eligen con los filtros y cada tarjeta lleva su insignia. Sin encabezados de grupo, para no densificar la página.

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
- **SEO en español, sin rutas por idioma.** El HTML se genera en español y el inglés se aplica en el cliente, así que los buscadores solo indexan el español (coherente con el público principal). Si se quiere posicionar en inglés, hay que crear rutas `/en/` con `hreflang`; hoy no compensa el costo.
- **Un solo origen para URLs externas** (`src/lib/constants.ts`).
- **`chambalab.org/discord` como enlace público de la invitación.** Es una redirección estática a `DISCORD_URL`, para compartir un enlace propio y estable en redes, README y perfiles. Si la invitación se renueva, solo cambia `constants.ts`. Se usa en los calendarios (`.ics` y Google Calendar) y en el JSON-LD de los eventos, porque ahí el enlace queda guardado fuera del sitio; los archivos Markdown y la configuración del repo (que no pueden importar `constants.ts`) la usan escrita a mano. Los botones del sitio siguen yendo directo a `DISCORD_URL`. No exige Boost de Discord, a diferencia de una URL personalizada `discord.gg/…`.

## Flujo

- **`master` protegida con ruleset.** PR obligatorio con revisión, checks `Lint, Test & Build` y `PR title (Conventional Commits)`, solo squash. El release lo publica una GitHub App con bypass, no una cuenta personal.
- **Versionado y changelog automáticos** a partir de Conventional Commits; por eso el título del PR importa.
