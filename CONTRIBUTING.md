# Cómo contribuir a Chamba Lab

Gracias por sumar. Esta guía explica cómo proponer cambios sin fricción.

Al participar aceptas nuestro [Código de Conducta](./CODE_OF_CONDUCT.md). Si algo no queda claro, pregunta en [Discord](https://chambalab.org/discord).

## Formas de contribuir

| Quiero...                                                | Qué hacer                                                                                                  |
| :------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| Sugerir un recurso (guía, plantilla, plataforma)         | Abre un issue con la plantilla **Proponer un recurso**                                                     |
| Proponer un evento o sesión                              | Abre un issue con la plantilla **Proponer un evento**                                                      |
| Reportar un error                                        | Abre un issue con la plantilla **Reportar un bug**                                                         |
| Corregir o mejorar el sitio                              | Crea una rama (o un fork) y abre un Pull Request (ver abajo)                                               |
| Aparecer en la página del equipo (Miembro o Contributor) | Abre un issue con la plantilla **Pedir aparecer en la página del equipo** ([ver cómo](#sumarte-al-equipo)) |

No necesitas permiso previo para arreglar un bug evidente o un typo. Para cambios grandes (nueva sección, nueva dinámica, cambios de diseño), abre primero un issue o consulta en Discord para no duplicar esfuerzo.

## Preparar el entorno

Requisitos: **Node.js >= 22.23.4** y npm. Con una versión menor, `npm run build` y `npm run dev` se niegan a arrancar («Node.js … is not supported by Astro»).

```bash
git clone https://github.com/Chamba-Lab/home.git
cd home
npm install
npm run dev
```

El sitio queda en `http://localhost:4321/`. La arquitectura, el sistema de diseño y las convenciones viven en [AGENTS.md](./AGENTS.md) y [DESIGN.md](./DESIGN.md); léelos antes de tocar componentes o estilos.

## Flujo de trabajo

1. **Parte siempre de `master` actualizada.** Si eres colaborador, crea una rama; si no, haz un fork.
2. **Nombra la rama con un prefijo y una descripción corta**: `feat/team-logos`, `fix/ics-timezone`, `docs/contributing`, `chore/update-deps`.
3. **Haz commits pequeños**: un cambio lógico, un commit.
4. **Valida en local** antes de abrir el PR:
    ```bash
    npm run lint
    npm run test
    npm run build
    ```
5. **Abre un Pull Request hacia `master`** y completa la plantilla. Si cambia la interfaz, adjunta una captura. En cada PR corre automáticamente el workflow **PR Checks** (lint, tests, build y validación del título): debe quedar en verde para fusionar.
6. **Espera revisión.** Una persona del equipo revisa; responde a los comentarios con nuevos commits en la misma rama.

**Nunca hagas push directo a `master`** (está protegida, también para el equipo y para los agentes de IA): todo cambio va en una rama y entra por Pull Request. Ahí corre el pipeline que versiona y publica el sitio.

## Commits y título del PR

Usamos [Conventional Commits](https://www.conventionalcommits.org/es/). El prefijo alimenta el changelog y el número de versión automáticos, así que **no es opcional**.

| Prefijo     | Cuándo                                      |
| :---------- | :------------------------------------------ |
| `feat:`     | Funcionalidad o contenido nuevo visible     |
| `fix:`      | Corrección de un error                      |
| `docs:`     | Solo documentación                          |
| `perf:`     | Mejora de rendimiento                       |
| `refactor:` | Cambio interno sin cambio de comportamiento |
| `chore:`    | Mantenimiento, dependencias, configuración  |

Ejemplo: `feat: add portfolio logo to team cards`. Redacta el mensaje en inglés, en modo imperativo y en minúsculas tras el prefijo; el copy visible del sitio sí va en español.

Si el PR se integra con _squash_, **el título del PR se convierte en el mensaje del commit**, así que también debe seguir este formato.

## Estilo de código

- ESLint y Prettier son obligatorios: `npm run lint` debe pasar y `npm run lint:fix` corrige casi todo.
- Mantén el contenido estático: los datos viven en `src/content/*.json` (ver `src/content.config.ts`). No agregues dependencias que requieran servidor; el sitio se publica como estático en GitHub Pages.
- Los textos visibles son bilingües (ES/EN) y se centralizan en `src/i18n/translations.ts` o en los atributos `data-i18n-*`. Rutas y anclas van en inglés.
- No repitas URLs de Discord o GitHub en componentes: usa `src/lib/constants.ts`.
- Respeta los tokens del tema (`src/styles/global.css`) en lugar de colores sueltos.

## Documentación

Cada feature nueva actualiza [AGENTS.md](./AGENTS.md), y el `README.md`, `DESIGN.md` o `docs/project.md` cuando corresponda. Las decisiones importantes se anotan en [docs/decisions.md](./docs/decisions.md). Un PR que cambia el comportamiento sin tocar la documentación queda incompleto.

## Contenido

### Añadir un recurso

Edita `src/content/resources.json` con `id`, `title`, `description` (`en` y `es`), `url`, `category` y `access`.

- **Destacado en el home** (`starred: true`, opcional): los recursos marcados salen en la sección «Recursos Curados» del inicio, en el orden del archivo y hasta 6 (`HOME_STARRED_MAX`). Sin ninguno, la sección no se muestra. Marca solo los que mejor representen la biblioteca.

- **Categorías**: `cv`, `jobs`, `learning`, `certifications`, `scholarships` (oportunidades académicas), `ai`, `practice` y `opensource` (son también la ruta de cada categoría: `/resources/jobs`).
- **Formato** (`type`, opcional, por defecto `web`): `web`; `channel` (canal de YouTube, `url` del tipo `https://www.youtube.com/@handle`, con `avatar` opcional: la URL de la imagen del canal, que se saca del `og:image` de su página de YouTube (`yt3.googleusercontent.com/…=s112-c-k-c0x00ffffff-no-rj`); el navegador la carga y, si falta o falla, se muestra la inicial; `video` (video de YouTube, `url` con el ID y `channel` con el nombre del canal). La miniatura sale del ID y el reproductor solo se carga al pulsar, con `youtube-nocookie.com`.
- **Acceso** (`access`, solo en `learning` y `certifications`): `free`, `freemium` (gratis con extras de pago) o `paid`. En el resto es opcional y se omite: la mayoría es gratis o freemium y no aporta.

**Criterios de curación** (un recurso entra si cumple todos):

1. **Seguro**: sitio oficial y reconocido, con `https`, sin pedir datos sensibles de más ni pagos engañosos. Los enlaces van al sitio original, nunca a copias o acortadores.
2. **Propósito claro**: ayuda a conectar, inspirarse o crecer en la carrera, y se explica en una frase.
3. **Acceso**: se puede empezar sin pagar (gratis o con una parte gratuita real). Los de pago entran solo si son una referencia clara de su categoría y se marcan como `paid`.
4. **Vigente y útil para quien empieza**: se mantiene activo y sirve a Early Career sin dejar de ser útil a Mid & Senior.
5. **Español primero, sin ser requisito**: se prefiere lo disponible en español, pero se aceptan recursos en inglés que valgan la pena.

Las descripciones no repiten precios ni límites exactos, porque cambian; en cursos y certificaciones eso lo indica el campo `access`. Revisa los enlaces antes del PR.

### Añadir un evento

Edita `src/content/events.json`. Los eventos son `fixed` (con `date`) o `recurring` (con `weekday` y `startDate`). Las horas van en la zona comunitaria **UTC-5**. Los identificadores deben mantenerse estables: se usan como `UID` en los archivos `.ics`.

### Escribir una entrada del blog

El blog (`/blog/`) documenta lo que hacemos en la comunidad. Las entradas las escriben, por ahora, quienes ya pueden abrir pull requests.

1. Copia `src/content/posts/_plantilla.mdx` como `src/content/posts/<id-de-la-entrada>.mdx`. El nombre del archivo es el `id` y la ruta (`/blog/<id-de-la-entrada>/`): en minúsculas, con guiones y estable.
2. Completa el frontmatter. La `description` debe tener entre **120 y 160 caracteres** (es lo que ven los buscadores) y, si pones `cover`, `coverAlt` es obligatorio. Escribe en el idioma de `lang`: las entradas no se traducen. Los enlaces a otros sitios que pongas en el texto con Markdown (`[texto](https://…)`) se abren solos en una pestaña nueva.
3. Las imágenes van en una carpeta con el nombre de la entrada, junto al archivo (`src/content/posts/<id-de-la-entrada>/`), y se enlazan con rutas relativas: `![Descripción](./<id-de-la-entrada>/imagen.webp)`. Astro las optimiza. Escribe siempre un texto alternativo que describa lo que se ve.
4. Componentes (se usan sin importarlos; solo las imágenes de `BeforeAfter` se importan, justo después del frontmatter):
    - `<BeforeAfter before={antes} after={despues} beforeAlt="…" afterAlt="…" />`: comparador antes/después. Las dos imágenes deben tener la misma proporción. Etiquetas opcionales: `beforeLabel` y `afterLabel` (`{{ es: "…", en: "…" }}`).
    - `<YouTube url="https://www.youtube.com/watch?v=…" title="…" />`: el reproductor solo se carga al pulsar.
    - `<Clip src="/blog/<id-de-la-entrada>/demo.mp4" title="…" />`: video corto en bucle, en lugar de un GIF. Los archivos van en `public/blog/<id-de-la-entrada>/` (opcional: `webm` y `poster`). Mantenlos livianos.
5. Mientras la entrada no esté lista, déjala con `draft: true`: no se publica en ningún lado. Para publicarla, `draft: false` en un PR.
6. La entrada no incluye datos del evento al que corresponde. Ese vínculo se añade en el evento (`events.json`).
7. Nada de datos de prueba al commitear: revierte entradas o videos temporales antes del PR.

### Sumarte al equipo

Solicita tu lugar con la plantilla de issue **Pedir aparecer en la página del equipo** (solo Miembro de la comunidad o Contributor); al aceptarse, se agrega tu tarjeta (o puedes hacerlo tú en un PR). Los títulos públicos son `founder`, `cofounder`, `core`, `contributor` y `member`; los tres primeros son por invitación y no se piden por issue. Agrega tu entrada en `src/content/team.json` con el campo `tier` y tu URL de GitHub: tu foto se toma directamente de tu avatar de GitHub, sin subir archivos (solo los fundadores llevan foto propia en `src/assets/team/`). Opcionalmente puedes sumar un logo personal (`.svg`, `.png` o `.jpg`) en `src/assets/team/logos/` y referenciarlo en el campo `logo`: reemplaza el icono del globo en el enlace a tu portfolio. Para SVG, ejecuta `npm run team:optimize`.

## Revisión y fusión

- Mantenemos un tono respetuoso y directo: se critica el código, no a la persona.
- Los PRs pequeños y enfocados se revisan más rápido.
- Quien revisa puede pedir cambios o proponer alternativas; la decisión final es de los mantenedores.

¿Dudas? Escríbenos en [Discord](https://chambalab.org/discord).
