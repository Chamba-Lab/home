# Chamba Lab 🚀

![Chamba Lab Hero Banner](https://raw.githubusercontent.com/Chamba-Lab/home/master/public/banner.png)

> **Community-Led Tech Platform**  
> *Democratizando el acceso a oportunidades laborales en tech.*

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](./LICENSE)
[![CI/CD Status](https://github.com/Chamba-Lab/home/actions/workflows/master-pipeline.yml/badge.svg)](https://github.com/Chamba-Lab/home/actions)
[![Astro](https://img.shields.io/badge/Astro-7.x-BC52EE.svg)](https://astro.build)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC.svg)](https://tailwindcss.com)

## 📌 Nuestra Misión

Somos una comunidad tech para quienes construyen su carrera en tecnología — estudiantes, profesionales y todo lo que hay en el medio. Compartimos conocimiento, oportunidades y apoyo real para crecer juntos. Discord es nuestro punto de encuentro.

---

## 🛠 Tech Stack

Construido para ser rápido, accesible y escalable.

- **Frontend**: [Astro 7.x](https://astro.build) (Optimizado para rendimiento extremo).
- **UI Library**: [React 19+](https://reactjs.org) (Utilizado en "Islas" de interacción).
- **Styling**: [TailwindCSS 4.x](https://tailwindcss.com), sistema de diseño neo-brutalista (bordes gruesos, sombra dura, indigo + oro) — ver [AGENTS.md](./AGENTS.md#3-design-system-neo-brutalista-indigooro).
- **CI/CD**: GitHub Actions + `release-it` para versionado automático.

---

## 🧭 Estructura del sitio

| Ruta | Contenido |
| :--- | :--- |
| `/` | Hero + intro + CTA a Discord |
| `/resources` | Guías, plantillas y plataformas de práctica curadas |
| `/events` | Próximos eventos y sesiones recurrentes de la comunidad |
| `/activities` | Hub de mini actividades comunitarias (dinámicas) |
| `/activities/roulette` | La Ruleta — dinámica interactiva con temas preestablecidos o modo libre |

Rutas siempre en inglés (buenas prácticas), aunque el copy visible es en español con toggle a inglés (`ES`/`EN` en el header). El header también incluye toggle de tema claro/oscuro y colapsa a menú hamburguesa en mobile. Detalle técnico completo en [AGENTS.md](./AGENTS.md#site-structure).

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
| `npm run release` | Proceso de lanzamiento y versionado (Conventional Commits) |

### Despliegue Automático
Al realizar un push a la rama `master`, el sistema activa:
1. **Validación**: Linting y Tests de unidad.
2. **Release**: Generación de tags, actualización de `CHANGELOG.md`.
3. **Deploy**: Publicación instantánea en **GitHub Pages**.

---

## 🤝 Comunidad y Contribución

¡Nadie crece solo! Las contribuciones son el motor de Chamba Lab.

- **Guía del Colaborador**: Revisa nuestro archivo [AGENTS.md](./AGENTS.md) para entender el sistema de diseño y flujos.
- **Discord**: [Escríbenos en la comunidad](https://discord.gg/TCuZSnfKTE).

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [`LICENSE`](./LICENSE) para más detalles.

---
<p align="center">Hecho con ❤️ por la comunidad de Chamba Lab</p>