# Project Status: IBEX-35 & Púnica (Fanzine Edition)

- Estado General: Transformación a formato "Reigns" completada, verificada y desplegada en producción.
- Hito Actual: Evolución Reigns Roguelike (COMPLETADO).

## Roadmap de Hitos Completados
- [x] Hito 0: Master Blueprint y Cimentación (Scaffolding Next.js, .rules, AGENTS.md, MCPs y Zod).
- [x] Hito 1: Ingesta en NotebookLM, definición de personajes asimétricos y biblia de juego (docs/lore/biblia_juego.md).
- [x] Hito 2: Calibración de métricas y ajuste de contratos (src/types/story.ts, src/content/story.json y tests/graph.test.ts).
- [x] Hito 3: Implementación del Store en Zustand y arnés de pruebas (src/store/gameStore.ts y tests/gameStore.test.ts).
- [x] Hito 4: Compilación del árbol narrativo completo (src/content/story.json con 22 nodos y 3 arquetipos interconectados).
- [x] Hito 5: Maquetación fanzine punk interactiva (StatsBar, DecisionCard, selector de personajes y estado global en Next.js 15).
- [x] Hito 6: Blindaje de seguridad HTTP, SEO/OpenGraph y optimización para despliegue en Vercel.
- [x] Hito 7 (Evolución Reigns): Mecánica de swipe táctil/ratón en tiempo real (`ReignsCard`), selector jerárquico de 3 esferas y 12 subtipos, indicadores predictivos en `StatsBar`, baraja procedural de dilemas (`reignsDeck.json`) y veredictos judiciales de fin de carrera (`VerdictModal`).
- [x] Hito 8 (Expansión Histórica, Panel /Admin y Pipeline de Actualidad):
  - Biblia 2.0 reconstruida en `docs/lore/biblia_juego.md` (10 NPCs recurrentes, 6 Macro-sagas, cartas de crisis y grandes sumarios: Malaya, ERE, Nóos, Pujol 3%, Bankia, Castor, Villarejo, Paesa).
  - Mazo procedural expandido a 40 cartas completas e interconectadas por flags en `src/content/reignsDeck.json`.
  - Panel administrativo visual `/admin` en `src/app/admin/page.tsx` para usuarios no técnicos (gestión de mazo, bandeja de virales y formulario interactivo con deslizadores de estadísticas).
  - Backend API persistente en `src/app/api/admin/cards/route.ts` con lectura y escritura de tarjetas en disco.
  - Pipeline de actualidad asistida (`scripts/suggestNewsCard.mjs` / `npm run news:suggest`) con 3 cartas de actualidad precargadas (Plantón de Abascal a Évole, Mascarillas en Pandemia, Comisión de Investigación).

---

## Verificación de Calidad y Producción (Verification Gate)
- **Arnés de Tests y Tipos:** `npm run verify` -> 23/23 tests pasando en Vitest (ReignsEngine, GameStore, GraphHarness) + 0 errores en TypeScript (`tsc --noEmit`).
- **Compilación en Producción:** `npm run build` -> Salida estática pre-renderizada (Zero-Runtime-AI, latencia cero).
- **Cabeceras HTTP de Seguridad:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin`.
- **Metadatos SEO y Tarjetas Sociales:** Integrados OpenGraph y Twitter Card en `src/app/layout.tsx`.

---

## Repositorio Remoto y Despliegue en Vercel
- **Repositorio GitHub:** [superabienator/Palante](https://github.com/superabienator/Palante)
- **Rama de Producción:** `main` (rastreada en `origin/main`).
- **Despliegue Automático Vercel:** Vinculable directamente en [Vercel New Project](https://vercel.com/new/clone?repository-url=https://github.com/superabienator/Palante) para despliegue continuo en cada push.
