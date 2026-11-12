# Swarm Topology & Permissions (`AGENTS.md`)

Este proyecto opera bajo un enjambre multi-agente coordinado por contratos de datos tipados.

| Agente | Rol Principal | Carpetas de Escritura Exclusiva | Modelo Recomendado |
|---|---|---|---|
| Orchestrator-Agent | Arquitectura, esquemas, seguridad y estado | src/types/, src/app/api/, MASTER_PLAN.md, PROJECT_STATUS.md | Razonamiento / Thinking (Plan Pro) |
| Narrative-Agent | Redacción de nodos satíricos, mazo y lore | src/content/, docs/lore/ | Alta velocidad (Plan Pro) |
| GameEngine-Agent | Store de Zustand y tests unitarios | src/store/, tests/ | Alta velocidad (Plan Pro) |
| UI-Punk-Agent | Layouts fanzine, vistas y componentes base | src/components/, src/app/ | Alta velocidad (Plan Pro) |
| Visual-Punk-Agent | Avatares vectoriales SVG, dirección de arte y cartas de crisis | src/components/avatars/, src/assets/, public/art/ | Alta velocidad / Visión (Plan Pro) |

Regla Anti-Colisión: src/types/story.ts define los contratos compartidos. Si un agente requiere nuevas métricas de personaje, debe solicitar su extensión al Orchestrator-Agent antes de editar lógica o interfaz.
