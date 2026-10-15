# Cómo contribuir a Chamba Lab

Gracias por sumar. Chamba Lab es una comunidad sin fines de lucro y todo lo que ves aquí lo sostienen voluntarios. Esta guía explica cómo proponer cambios sin fricción.

Al participar aceptas nuestro [Código de Conducta](./CODE_OF_CONDUCT.md). Si algo no queda claro, pregunta en [Discord](https://discord.gg/TCuZSnfKTE).

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

Requisitos: **Node.js >= 22.12** y npm.

```bash
git clone https://github.com/Chamba-Lab/home.git
cd home
npm install
npm run dev
```

El sitio queda en `http://localhost:4321/home/`. La arquitectura, el sistema de diseño y las convenciones viven en [AGENTS.md](./AGENTS.md) y [DESIGN.md](./DESIGN.md); léelos antes de tocar componentes o estilos.

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

Edita `src/content/resources.json` con `id`, `title`, `description` (`en` obligatorio, `es` opcional), `url` y `category` (`cv`, `aprendizaje` o `practica`). Priorizamos recursos gratuitos, vigentes y útiles para quien está empezando.

### Añadir un evento

Edita `src/content/events.json`. Los eventos son `fixed` (con `date`) o `recurring` (con `weekday` y `startDate`). Las horas van en la zona comunitaria **UTC-5**. Los identificadores deben mantenerse estables: se usan como `UID` en los archivos `.ics`.

### Sumarte al equipo

Solicita tu lugar con la plantilla de issue **Pedir aparecer en la página del equipo** (solo Miembro de la comunidad o Contributor); al aceptarse, se agrega tu tarjeta (o puedes hacerlo tú en un PR). Los títulos públicos son `founder`, `cofounder`, `core`, `contributor` y `member`; los tres primeros son por invitación y no se piden por issue. Agrega tu entrada en `src/content/team.json` con el campo `tier` y tu URL de GitHub: tu foto se toma directamente de tu avatar de GitHub, sin subir archivos (solo los fundadores llevan foto propia en `src/assets/team/`). Opcionalmente puedes sumar un logo personal (`.svg`, `.png` o `.jpg`) en `src/assets/team/logos/` y referenciarlo en el campo `logo`: reemplaza el icono del globo en el enlace a tu portfolio. Para SVG, ejecuta `npm run team:optimize`.

## Revisión y fusión

- Mantenemos un tono respetuoso y directo: se critica el código, no a la persona.
- Los PRs pequeños y enfocados se revisan más rápido.
- Quien revisa puede pedir cambios o proponer alternativas; la decisión final es de los mantenedores.

¿Dudas? Escríbenos en [Discord](https://discord.gg/TCuZSnfKTE).
