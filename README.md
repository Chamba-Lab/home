# Chamba Lab 🚀

![Chamba Lab Hero Banner](https://raw.githubusercontent.com/Chamba-Lab/home/master/public/og-image.png)

> **Connect. Inspire. Grow.**  
> *Comunidad tech en español para conectar, inspirarte y crecer.*

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](./LICENSE)
[![CI/CD Status](https://github.com/Chamba-Lab/home/actions/workflows/master-pipeline.yml/badge.svg)](https://github.com/Chamba-Lab/home/actions)
[![Astro](https://img.shields.io/badge/Astro-7.x-BC52EE.svg)](https://astro.build)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC.svg)](https://tailwindcss.com)

## 📌 Nuestra Misión

Somos una comunidad tech sin fines de lucro para quienes construyen su carrera en tecnología: estudiantes, profesionales y todo lo que hay en el medio. Compartimos conocimiento, oportunidades y apoyo real para crecer juntos. Discord es nuestro punto de encuentro. Más contexto en [docs/project.md](./docs/project.md).

---

## 🛠 Tech Stack

Construido para ser ultra rápido, accesible y visualmente impactante.

- **Frontend**: [Astro 7.x](https://astro.build) (Optimizado para rendimiento extremo y SSG).
- **UI Library**: [React 19+](https://reactjs.org) (Utilizado en "Islas" de interacción como el Ecosistema Comunitario y La Ruleta).
- **Styling**: [TailwindCSS 4.x](https://tailwindcss.com), sistema de diseño **Modern Dark Glassmorphism** (fondo obsidian `#080D1A`, tarjetas con `backdrop-blur`, acentos en amarillo `#FACC15` y Discord `#5865F2`) — especificación completa en [DESIGN.md](./DESIGN.md) y arquitectura en [AGENTS.md](./AGENTS.md).
- **CI/CD**: GitHub Actions + `release-it` para versionado automático y despliegue a **GitHub Pages**.

---

## 🧭 Estructura del sitio

| Ruta | Contenido |
| :--- | :--- |
| `/` | Landing con hero, widget de Discord, diagrama del ecosistema comunitario, eventos, equipo y recursos destacados |
| `/resources` | Biblioteca completa de guías, plantillas y plataformas curadas con filtros |
| `/events` | Calendario de eventos y sesiones recurrentes con exportación a Google Calendar / iCal |
| `/activities` | Hub de mini actividades comunitarias (dinámicas) |
| `/team` | Fundadores, Core team, Contributors y miembros de la comunidad |
| `/activities/roulette` | La Ruleta: dinámica interactiva con packs temáticos de preguntas y modo libre |

Rutas siempre en inglés, con soporte bilingüe (`ES`/`EN`). Detalle técnico en [AGENTS.md](./AGENTS.md).

---

## 🚀 Comenzando

### Prerrequisitos
- **Node.js**: v22.12+ (ver `engines` en `package.json`)
- **Gestor de paquetes**: npm (recomendado)

### Instalación Local

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/Chamba-Lab/home.git
   cd home
   ```

2. **Instala dependencias**:
   ```bash
   npm install
   ```

3. **Inicia el entorno de desarrollo**:
   ```bash
   npm run dev
   ```

---

## 📦 Flujo de Desarrollo

Utilizamos un pipeline automatizado para asegurar la calidad y facilitar el crecimiento.

### Comandos Clave
| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo local |
| `npm run build` | Genera la versión de producción (SSG) |
| `npm run lint` | Valida el código con ESLint y Prettier |
| `npm run lint:fix` | **Corrige automáticamente** problemas de estilo y lint |
| `npm run test` | Ejecuta las pruebas unitarias con Vitest |
| `npm run brand:optimize` | Optimiza los SVG de marca (`src/assets/brand/`) con svgo |
| `npm run team:optimize` | Optimiza los logos SVG del equipo (`src/assets/team/logos/`) con svgo |
| `npm run brand:og` | Regenera `public/og-image.png` (1200×630) desde `brand/og.svg` con los colores de los tokens |
| `npm run release` | Proceso de lanzamiento y versionado (Conventional Commits) |

### Identidad de marca
La mascota (mapache/gato con taza de café) es el logo de Chamba Lab. Los SVG maestros viven en `src/assets/brand/`, la plantilla OG y los avatares de Discord en `brand/`, y los favicons y el manifest en `public/`. Reglas de uso (fondos permitidos, tamaños mínimos) en [DESIGN.md §6.1](./DESIGN.md).

### Despliegue Automático
`master` está protegida: los cambios entran por Pull Request con checks de lint, tests, build y título. Al fusionar, el pipeline:
1. **Valida**: lint y tests.
2. **Publica la versión**: tag y `CHANGELOG.md`.
3. **Despliega** en **GitHub Pages**.

---

## 🤝 Comunidad y Contribución

Avanzar por cuenta propia tiene mérito; en comunidad multiplicas tus posibilidades. Las contribuciones son el motor de Chamba Lab.

- **Cómo contribuir**: lee [CONTRIBUTING.md](./CONTRIBUTING.md) (flujo de ramas, Conventional Commits, checklist de PR) y nuestro [Código de Conducta](./CODE_OF_CONDUCT.md).
- **Ideas y bugs**: abre un issue con las plantillas para proponer recursos, eventos o reportar errores.
- **Arquitectura, decisiones y diseño**: [AGENTS.md](./AGENTS.md), [docs/decisions.md](./docs/decisions.md) y [DESIGN.md](./DESIGN.md).
- **Discord**: [Escríbenos en la comunidad](https://discord.gg/TCuZSnfKTE).

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [`LICENSE`](./LICENSE) para más detalles.

---
<p align="center">Hecho con ❤️ por la comunidad de Chamba Lab</p>