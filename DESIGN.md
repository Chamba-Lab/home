# DESIGN.md: Chamba Lab Design System

**System Name**: Modern Dark Glassmorphism  
**Version**: 1.0.0  
**Status**: Active / Production Standard  
**Host Framework**: Astro 7.x + TailwindCSS 4.x + React 19 Islands

---

## 1. Design Philosophy & Identity

Chamba Lab es una plataforma y comunidad de tecnología sin fines de lucro enfocada en democratizar oportunidades laborales e impulsar el crecimiento profesional práctico. El sistema de diseño refleja una experiencia inmersiva para desarrolladores (_developer-centric_), combinando la sobriedad técnica de superficies obsidian con la elegancia del vidrio esmerilado (_frosted glass_), acentos luminiscentes de alta energía y microinteracciones fluidas.

### Core Principles

1. **Dark-Mode First**: Experiencia inmersiva nativa (`#080D1A`), eliminando fluctuaciones visuales y reduciendo la fatiga visual.
2. **Elevación por Vidrio (Glassmorphism)**: La jerarquía visual se establece mediante capas de transparencia, desenfoque de fondo (_backdrop blur_) y bordes de luz especular sutiles, evitando sombras opacas artificiales.
3. **Alto Contraste y Legibilidad**: texto claro sobre superficies oscuras; la meta es cumplir WCAG AA en texto y controles (el texto amarillo sobre fondo claro usa `brand-yellow-deep`).
4. **Microinteracciones**: estados hover con resplandor (_glow_), elevación (`-translate-y-0.5`) y transiciones suaves; audio y animación solo en componentes interactivos complejos (la ruleta).
5. **No Placeholders**: Todo componente visual o interactivo se implementa funcional, con datos estables y degradación elegante (_graceful fallback_).

---

## 2. Color Palette & Design Tokens

Los tokens base están configurados en `src/styles/global.css` dentro de `@theme` de Tailwind CSS v4.

### 2.1 Surfaces & Canvas (Obsidian Palette)

| Token                           | Hex / Value                 | Rol Semántico                                       |
| ------------------------------- | --------------------------- | --------------------------------------------------- |
| `--color-bg`                    | `#080D1A`                   | Lienzo principal de toda la aplicación              |
| `--color-surface`               | `#0B1120`                   | Paneles principales y contenedores estructurales    |
| `--color-surface-subtle`        | `#0F172A`                   | Superficies secundarias, campos de entrada y barras |
| `--color-surface-card`          | `#131E36`                   | Tarjetas elevadas y contenedores interactivos       |
| `--color-surface-border`        | `#1E293B`                   | Bordes estructurales sólidos                        |
| `--color-surface-border-subtle` | `rgba(255, 255, 255, 0.08)` | Bordes sutiles de vidrio esmerilado                 |

### 2.2 Brand & Accents

| Token                         | Hex / Value | Rol Semántico                                                                |
| ----------------------------- | ----------- | ---------------------------------------------------------------------------- |
| `--color-brand-yellow`        | `#FACC15`   | Amarillo marca primario: CTAs principales, énfasis, agujas y estados activos |
| `--color-brand-yellow-hover`  | `#FDE047`   | Estado hover de botones primarios y enlaces destacados                       |
| `--color-brand-yellow-deep`   | `#A16207`   | Texto amarillo sobre fondos claros (contraste 4.51:1)                        |
| `--color-brand-cream`         | `#FCF6E8`   | Fondo crema para la mascota sobre claro y avatar alternativo                 |
| `--color-brand-discord`       | `#5865F2`   | Blurple oficial de Discord: widgets, CTAs de comunidad y telemetría          |
| `--color-brand-discord-hover` | `#4752C4`   | Estado hover para acciones de Discord                                        |

### 2.3 Semantic Typography & Status

| Token                     | Hex / Value                 | Rol Semántico                                         |
| ------------------------- | --------------------------- | ----------------------------------------------------- |
| `--color-content`         | `#E2E8F0`                   | Texto principal de lectura (alto contraste)           |
| `--color-muted`           | `#94A3B8`                   | Subtítulos, metadatos, etiquetas secundarias          |
| `--color-content-inverse` | `#FFFFFF`                   | Texto sobre superficies de acento (ej. botón blurple) |
| `--color-on-accent`       | `#020617`                   | Texto sobre superficies luminosas o botones amarillos |
| `--color-border`          | `rgba(255, 255, 255, 0.12)` | Borde estándar para tarjetas y divisores              |
| Status: Online            | `#34D399` / `#10B981`       | Puntos de presencia y estados activos de servidor     |
| Status: Alert             | `#F59E0B`                   | Badges de advertencia o eventos en vivo               |

---

## 3. Typography System

Cargada de forma optimizada vía Google Fonts en `src/layouts/Layout.astro`.

### 3.1 Font Families

- **Display / Titulares**: `'Plus Jakarta Sans', system-ui, sans-serif`  
  _Pesos_: `600` (SemiBold), `700` (Bold), `800` (ExtraBold).  
  _Uso_: H1, H2, H3, números de estadísticas, botones primarios y encabezados de tarjeta.
- **Body / Interfaz**: `'Inter', system-ui, sans-serif`  
  _Pesos_: `400` (Regular), `500` (Medium), `600` (SemiBold).  
  _Uso_: Párrafos de lectura, descripciones, tooltips, formularios y migas de pan.
- **Mono / Código**: `ui-monospace, SFMono-Regular, Menlo, monospace`  
  _Uso_: Badges técnicos, contadores, timestamps y filtros.

### 3.2 Type Scale

| Nivel          | Clase Tailwind                                     | Tamaño      | Leading           | Tracking        |
| -------------- | -------------------------------------------------- | ----------- | ----------------- | --------------- |
| Hero Display   | `text-4xl md:text-6xl font-display font-extrabold` | 36px / 60px | `leading-tight`   | `-0.02em`       |
| Section Title  | `text-2xl sm:text-3xl font-display font-bold`      | 24px / 30px | `leading-snug`    | `-0.01em`       |
| Card Title     | `text-lg sm:text-xl font-display font-bold`        | 18px / 20px | `leading-snug`    | normal          |
| Body Regular   | `text-sm sm:text-base font-sans`                   | 14px / 16px | `leading-relaxed` | normal          |
| Caption / Meta | `text-xs font-sans text-slate-400`                 | 12px        | `leading-normal`  | normal          |
| Micro Badge    | `text-[10px] sm:text-xs font-mono font-semibold`   | 10px / 12px | `leading-none`    | `tracking-wide` |

---

## 4. Spacing, Shapes & Elevation

### 4.1 Corner Roundness Scale

- **Pills & Badges**: `rounded-full` (chips de filtro, selector de idioma, status indicators).
- **Buttons & Inputs**: `rounded-xl` (12px) — controles interactivos estándar.
- **Cards & Modals**: `rounded-2xl` (16px) — tarjetas de eventos, recursos y paneles de control.
- **Interactive Islands & Stages**: `rounded-3xl` (24px) — contenedores principales como el escenario de la ruleta y vitrina del hero.

### 4.2 Elevation & Glass Utilities

- `.card-glass`:
    ```css
    background: rgba(15, 23, 42, 0.65);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: all 0.2s ease;
    ```
    _En hover_: `border-color: rgba(250, 204, 21, 0.3);`
- `.glow-radial`:
    ```css
    background: radial-gradient(
        circle 650px at 50% 0%,
        rgba(250, 204, 21, 0.08),
        transparent 70%
    );
    ```

---

## 5. Component Patterns & UI Library

### 5.1 Sticky Header & Navigation

- **Barra Superior**: `sticky top-0 z-50 backdrop-blur-xl bg-bg/85 border-b border-white/[0.08]`.
- **Logo**: `chamba-tile.svg` (mascota sobre tile amarillo, 40px en header / 36px en footer, `rounded-xl`) + wordmark display "Chamba" + píldora "Lab".
- **Segmented Language Switcher**: Pastilla redondeada (`rounded-full bg-slate-900/80 border border-white/10 p-0.5 text-xs`) con botones `ES` / `EN` toggleables y almacenamiento en `localStorage`.
- **Discord Action Button**: Botón compacto con resplandor blurple al interactuar.

### 5.2 Botones & CTAs

- **Primario (Brand Yellow)**:
  `bg-gradient-to-r from-brand-yellow via-amber-300 to-brand-yellow text-slate-950 font-display font-extrabold shadow-lg shadow-brand-yellow/25 hover:shadow-brand-yellow/40 hover:-translate-y-0.5 active:translate-y-0 rounded-xl`
- **Secundario (Glass / Discord)**:
  `card-glass border border-white/10 text-white hover:border-brand-discord hover:bg-brand-discord/10 rounded-xl`
- **Ghost / Icon Button**:
  `p-2 rounded-lg bg-slate-900/80 text-slate-300 hover:text-brand-yellow hover:bg-slate-800 border border-white/10`

### 5.3 Tarjetas Informativas (Vitrinas & Grids)

- Estructura: Fondo `.card-glass`, borde sutil `border-white/[0.08]`, padding generoso (`p-5` o `p-6`).
- Encabezado con badge temático o fecha en pastilla monospace.
- Cuerpo con título de alto contraste y descripción concisa en `text-slate-300`.
- Pie de tarjeta con metadatos técnicos y botón/enlace de acción directa.

### 5.4 Tarjetas del equipo (`TeamMemberCard.astro`)

Tres variantes según el título público, para que la jerarquía se lea de un vistazo:

- **`full`**: tarjeta `card-glass` centrada con avatar de 80 px, nombre, título y enlaces (GitHub, portfolio, LinkedIn). Fundadores.
- **`row`**: tarjeta compacta en fila (avatar 48 px, nombre, título, GitHub). Core team y Contributors.
- **`chip`**: solo avatar de 48 px que enlaza a GitHub, con el nombre en un tooltip. Miembros.

Los avatares llevan borde neutro (`border-white/25`), nunca amarillo; el fondo amarillo de la inicial de respaldo se recorta con `bg-clip-padding` para que no se vea bajo el borde. Las secciones sin gente no se renderizan.

### 5.5 Islas interactivas (React 19)

- **La Ruleta (`RouletteWheel.tsx`)**: Canvas 2D adaptativo con texto radial, aguja con oscilación, tooltip flotante con el texto completo de cada opción, audio sintetizado con Web Audio API y confeti. El giro dura `SPIN_DURATION_MS` con desaceleración `easeOutQuart`.
- **Ecosistema Comunitario (`CommunityEcosystem.tsx`)**: diagrama de dos perfiles y dos interacciones con vista dual. En escritorio (>= 768 px) es un SVG horizontal con foco selectivo (`opacity-25` frente a `opacity-100`) y una tarjeta inspectora; en móvil, un stepper vertical con acordeón y un cierre de ciclo. Un ticker alterna actividades reales en cada interacción.
- **Widget de Discord (`DiscordWidget.astro`)**: cabecera con el avatar crema del servidor, contadores de conectados y en voz, canales de voz agrupados con su gente (ocupados primero, vacíos atenuados, cada canal enlaza a Discord) y quienes están en línea fuera de voz. Respaldo estático si falla la API.

## 6. Iconography & Assets

- **Estilo**: SVGs vectoriales inline, trazado limpio (`stroke="currentColor"`, `strokeWidth="2"`), bordes redondeados (`strokeLinecap="round" strokeLinejoin="round"`).
- **Tamaños estándar**:
    - Micro / Inline: `w-3.5 h-3.5` a `w-4 h-4` (ej. ícono Shuffle, enlaces externos, flechas).
    - Controles / Botones: `w-5 h-5`
    - Hero / Features: `w-8 h-8` a `w-12 h-12` envueltos en contenedores esmerilados con resplandor suave.
- **Símbolos Clave**:
    - _Shuffle_: Flechas bidireccionales cruzadas estándar (`M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5`).
    - _Mascota_: ver §6.1 (reglas de uso de la marca).
    - _Discord_: Logomarca oficial SVG monocromática o en blurple.

---

### 6.1 Identidad de marca: la mascota

Mapache/gato peludo con taza de café y expresión _grumpy_. Masters en `src/assets/brand/` (`chamba-mark`, `-awake`, `-mono` con `currentColor`, `-sticker`, `chamba-tile`, `chamba-lockup-dark`, `chamba-lockup-light`). Se conservan los `id` de capa (`body`, `face`, `sheen`) para tematizar con CSS. Avatares 1024 de Discord/GitHub en `brand/discord/` (solo referencia).

**Reglas de uso**

- La mascota **nunca** va directo sobre `#080D1A` (el cuerpo es del mismo color y desaparece). Usar:
    - tile amarillo (`#FACC15`) — por defecto en header, footer y favicon;
    - versión _sticker_ (contorno amarillo) sobre fondos oscuros — es la que usa la imagen OG y el banner del README;
    - fondo crema (`#FCF6E8`) sobre fondos claros.
- Lockup: `chamba-lockup-dark.svg` sobre fondos oscuros, `chamba-lockup-light.svg` sobre claros.
- Discord / GitHub org: avatar amarillo 1024 (alternativa crema). Se recorta en círculo; la mascota está centrada con margen.
- Tamaños mínimos: tile 24px (UI), mascota sola 32px; por debajo de eso usar el favicon (16/32/48).
- Texto amarillo sobre fondo claro: `--color-brand-yellow-deep`, no `brand-yellow`.

**Favicon e iconos** (`public/`, referenciados en `Layout.astro` respetando `base`): `favicon.ico` (16/32/48), `favicon.svg`, `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png` y `site.webmanifest` (`theme_color` y `background_color` `#080D1A`).

**Mantenimiento**

- Optimizar SVG: `npm run brand:optimize` (svgo con `svgo.config.cjs`: `cleanupIds:false`, `floatPrecision:1`, `multipass`).
- Regenerar la imagen OG: `npm run brand:og`. Renderiza `brand/og.svg` (SVG válido por sí solo; el script sustituye sus hex de marca por los valores vigentes de los tokens) a `public/og-image.png` (1200×630) leyendo los colores de los tokens de `global.css`. Si cambia un token, correr el script y commitear el PNG.
- `scripts/trace.py` vectoriza los PNG originales de `brand/source/` (requiere `potrace`, `numpy`, `Pillow`).

---

## 7. Motion & Interaction Guidelines

1. **Duraciones**: hover ordinario `duration-200 ease-out`; menús y paneles `duration-300`; giro de la ruleta `SPIN_DURATION_MS` con `easeOutQuart(t) = 1 - Math.pow(1 - t, 4)`.
2. **Profundidad**: elevación vertical sutil (`-translate-y-0.5`) junto con más resplandor o sombra de marca.
3. **Pendiente**: respetar `prefers-reduced-motion` (hoy no se aplica) para desactivar partículas y giros largos.

## 8. Governance & Maintenance

- Cualquier nuevo componente debe reutilizar estrictamente los tokens de color definidos en `src/styles/global.css`.
- No introducir temas claros paralelos salvo que exista una decisión explícita de arquitectura; la consistencia dark-mode es la directriz central.
- Cada nuevo icono, variante o patrón de componente se documenta en este archivo. Las normas de commits y PR están en `AGENTS.md`.
