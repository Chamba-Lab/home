# Chamba Lab: Connect. Inspire. Evolve.

> **Status**: Definition & Expansion Phase  
> **Focus**: Professional Evolution & Community Support

> **Landing pública**: La landing principal presenta una arquitectura visual *Modern Dark Glassmorphism* (diseño "Landing Optimizada y Equilibrada"): Hero con iluminación radial, widget interactivo en tiempo real de Discord (tarjeta nativa moderna y conmutador a widget oficial), diagrama interactivo del Ecosistema Comunitario (perfiles *Early Career* y *Mid & Senior* con interacciones formativas *Advising* y *Continuous Growing* en vista dual SVG desktop y stepper mobile), vitrina asimétrica de eventos y vitrina de recursos curados. Los "Pilares de Acción" descritos abajo representan la visión de roadmap a mediano/largo plazo y se articulan directamente a través de dicho ecosistema. El término cultural activo en el copy público hoy es "Chamba" (el nombre); el resto se introduce progresivamente en features concretas — ver `docs/branding_concepts.md`.

## 🚀 Manifiesto
**Chamba Lab** es una iniciativa comunitaria, sin fines de lucro, para potenciar el talento tech. No somos una "aceleradora comercial"; somos un grupo de estudiantes y profesionales que creen en el poder de compartir conocimiento y tender puentes.

Nuestro objetivo es simple: **avanzar por cuenta propia tiene mérito; en comunidad multiplicas tus posibilidades.** Conectamos a quienes inician con quienes ya tienen camino recorrido, creando un espacio horizontal para aprender, recibir feedback sincero, debatir sobre retos reales y abrir nuevas oportunidades.

## 🏛️ Pilares de Acción

Nuestra estrategia se basa en dos columnas vertebrales que se integran en el ciclo colaborativo continuo:

### Pillar A: Professional Evolution & Advising
*Herramientas colaborativas y apoyo práctico entre pares para la inserción y crecimiento en el sector Tech.*

1.  **Chamba Board (Empleabilidad)**:
    *   Difusión comunitaria y recomendación de convocatorias laborales reales (sin spam).
2.  **Career Reviews & Portafolio**:
    *   Revisión comunitaria de CV (compatibles con ATS), perfiles de LinkedIn y repositorios de GitHub.
3.  **Code & Project Feedback**:
    *   Revisión colaborativa de código y proyectos personales para ganar solidez técnica.
4.  **Learning Paths & Unblocking**:
    *   Rutas de aprendizaje curadas y espacio seguro para resolver dudas técnicas y bloqueos de entornos de trabajo sin temor al juicio.
5.  **Mock Interviews**:
    *   Simulacros periódicos de entrevistas técnicas y de comportamiento con feedback en vivo entre pares.

### Pillar B: Community Core & Continuous Growing
*El tejido social y el espacio de evolución continua para profesionales en activo.*

1.  **Sync Spaces & Coworking**:
    *   Sesiones virtuales de trabajo en paralelo (ej. Code & Coffee recurrente los viernes).
2.  **Architecture & Tech Debates**:
    *   Espacios de conversación sobre arquitectura de software, desafíos en producción y herramientas modernas.
3.  **Knowledge Hub & Resources**:
    *   Biblioteca curada y viva de guías, plantillas y plataformas recomendadas por la comunidad (`/resources`).
4.  **Mentorship & Ciclo de Retorno**:
    *   Acceso a consejos de desarrolladores con experiencia laboral y oportunidad de devolver apoyo guiando a quienes recién inician.
5.  **Dinámicas & Eventos**:
    *   Mini actividades comunitarias interactivas (comenzando con **La Ruleta** en `/activities/roulette`) y calendario de sesiones con exportación a Google Calendar / iCal (`/events`).
    *   Modo preestablecido: 6 packs temáticos precargados (Empleabilidad, Debates Tech, Qué Aprender 2026, Dilemas de Producción, IA & Futuro del Dev, Rompehielos & Cultura Dev) con 72 preguntas en total.
    *   Modo libre: soporte ampliado para hasta 24 opciones personalizadas.
    *   Canvas 2D adaptativo con distribución radial para textos largos, tooltips flotantes en hover, física de aguja (*needle wobble*), sintetizador de audio con Web Audio API y confeti.
    *   Diseño bajo el estándar *Modern Dark Glassmorphism* documentado en [`DESIGN.md`](../DESIGN.md).
    *   Próximo: agregar más actividades (preguntas rápidas, minijuegos, etc.).

## 🗺️ Roadmap de Evolución

### Fase 1: Pulido Estructural, i18n & Ecosistema (En Curso)
- [x] **Reorganización del Landing Page**: Ajustar flujo narrativo (Hero & Discord ➔ Ecosistema Comunitario ➔ Eventos y Sesiones ➔ Recursos Curados).
- [ ] **SEO & Social Share Cards**: Implementación de Open Graph y Twitter Cards con imagen de previsualización oficial (*Modern Dark Glassmorphism*).
- [ ] **Internacionalización (i18n) Completa**: Traducción bilingüe exhaustiva en ruleta, dinámicas y textos pendientes.
- [ ] **Modularización de Datos**: Desacoplar presets de preguntas de la ruleta del catálogo general `content/activities.json`.

### Fase 2: Expansión de Valor, Dinámicas & Calidad
- [ ] **Career Kit Beta**: Primeras plantillas de CV Tech ATS-friendly, checklists de perfil (LinkedIn/GitHub) y rúbricas de Mock Interviews.
- [ ] **Segunda Dinámica: "⚡ Preguntas Rápidas"**: Quick Quiz con temporizador en `/activities/quick-questions` para stages de Discord.
- [ ] **Módulo de Contribución Comunitaria**: Plantillas de issues y canales guiados para proponer recursos y eventos comunitarios.
- [ ] **Suite de Tests Automatizados (Vitest)**: Cobertura de pruebas unitarias para utilidades de calendario (UTC-5, RFC 5545 `.ics`) y lógica de dinámicas.

### Fase 3: Plataforma Operativa de Empleabilidad
- [ ] **Evolución de Recursos**: De directorio estático a herramienta práctica operativa (guías comunitarias, salarios, prospección).
- [ ] **Chamba Board**: Publicación y recomendación de oportunidades laborales validadas y sin spam.
