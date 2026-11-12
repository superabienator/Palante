# 01. Guía Operativa del Orquestador para Google AI Studio

> *«La cleptocracia española no se improvisa: se documenta en autos judiciales, se traduce al esperpento y se estructura con contratos de datos blindados.»*

---

## 1. Diagnóstico: Por qué el juego se siente pequeño y cómo lo escalamos

Actualmente el mazo cuenta con 40 cartas y 12 arquetipos. Aunque el bucle jugable, los dados y los privilegios funcionan con precisión matemática, una partida de 25 trimestres agota rápidamente la novedad:
- Las cartas aparecen con demasiada frecuencia.
- Falta ramificación profunda: si aceptas un soborno en el trimestre 2, la trama debería perseguirte con 3 ramificaciones alternativas en los trimestres 8, 14 y 22.
- Los personajes tienen pocos diálogos situacionales exclusivos.

### La Meta de Escalado
- **Volumen Objetivo:** **200 a 350 cartas** interconectadas.
- **Estructura:** **25 a 40 Macro-Sagas** de 5 a 8 cartas cada una, gobernadas por un grafo de banderas (`flags`).
- **Cartas de Crisis Situacionales:** Al menos 15 cartas de crisis que solo saltan cuando una estadística entra en zona de pánico (Presión > 75%, Pasta < 20%, etc.).
- **Cartas Virales de Coyuntura:** Reflejo de noticias del día a día (políticos esquivando entrevistas, comisiones parlamentarias, audios filtrados).

---

## 2. Configuración Recomendada en Google AI Studio

Para aprovechar la capacidad de razonamiento y el contexto kilométrico de Gemini:

| Parámetro | Valor Recomendado | Justificación |
|---|---|---|
| **Modelo** | **Gemini 1.5 Pro** o **Gemini 2.0 Pro / Flash** | Máxima capacidad para procesar libros enteros y sumarios judiciales en el mismo prompt. |
| **System Instructions** | Copiar el texto de `03_SYSTEM_PROMPTS_Y_PLANTILLAS_AI_STUDIO.md` | Fija el tono berlanguiano, la terminología procesal y el formato JSON. |
| **Temperature** | `0.75` – `0.85` | Suficiente creatividad y cinismo cómico sin alucinar formatos JSON inválidos. |
| **Top-P / Top-K** | `0.95` / `40` | Variedad léxica en la sátira sin perder coherencia gramatical. |
| **Response Format** | **Structured Output (JSON)** o `application/json` | Garantiza que la respuesta sea un objeto o array parseable sin texto previo ni posterior. |

---

## 3. Fuentes que debes subir a AI Studio (Knowledge Base)

Sube estos documentos como adjuntos (`+ Add file`) en Google AI Studio. Gemini los indexará en su contexto y extraerá anécdotas, nombres en clave y transcripciones literales:

### A. Sumarios y Autos Judiciales Reales
- **Auto del Caso Gürtel / Papeles de Bárcenas:** Para terminología de "visés", repartos en sobres, donaciones en planta noble y empresas de eventos.
- **Pieza Principal de la Operación Kitchen:** Para diálogos de comisarios, espionaje con fondos reservados y captación de chóferes.
- **Sumario del Caso ERE de Andalucía:** Para la "Partida 31L", intrusos en prejubilaciones y el chófer de la cocaína.
- **Sumario del Caso Púnica / Lezo:** Para adjudicaciones de colegios concertados, guarderías, comisiones en Suiza y fiestas municipales.
- **Caso Nóos:** Para convenios de turismo y deporte patrocinados por administraciones públicas.
- **Caso Bankia / Cajas de Ahorro:** Para tarjetas black, safaris en Namibia, colocación de preferentes y salidas a bolsa ficticias.

### B. Libros y Crónicas Periodísticas
- Reportajes de investigación sobre Francisco Paesa, Luis Roldán, Villarejo, Mario Conde y la familia Pujol.
- Crónicas parlamentarias de mociones de censura y comisiones de investigación del Congreso.

### C. Hemeroteca y Noticias Virales Recientes
- Transcripciones de entrevistas políticas incómodas (ej. plantones en programas de prime time).
- Casos de contratos de emergencia (mascarillas, material sanitario, comisiones a intermediarios).

---

## 4. Estrategia de Generación por Lotes (Batch Generation)

> [!CAUTION]
> **NO le pidas a AI Studio 300 cartas de golpe en un solo mensaje.**
> Si pides 300 cartas, la calidad literaria caerá, los diálogos serán genéricos y el JSON se truncará por límite de tokens de salida.

### El Método de los Lotes Temáticos (Sagas de 6 a 10 cartas):
Divide la expansión en **sesiones temáticas**:
1. **Lote 1: Macro-Saga de la Construcción y el Ladrillo** (8 cartas encadenadas con banderas como `pgou_recalificado`, `chalet_costero`, `inspeccion_urbanismo`).
2. **Lote 2: Macro-Saga de las Cloacas y el Chantaje Policial** (8 cartas sobre microfilmes, micrófonos en asadores y falsos informes).
3. **Lote 3: Macro-Saga del Sector Financiero y Rescates** (8 cartas sobre créditos condonados a partidos, créditos sindicados y activos tóxicos).
4. **Lote 4: Macro-Saga de la Sanidad y Contratos de Urgencia** (6 cartas sobre comisiones de mascarillas, intermediarios y naves logísticas).
5. **Lote 5: Macro-Saga de la Justicia y el Aforamiento** (6 cartas sobre recursos de amparo, jueces recusados y suplicatorios).

---

## 5. El Concepto Clave: El Grafo de Banderas (`flags`)

Para que el juego no sea repetitivo, las cartas no deben ser islas independientes. Utilizan dos campos fundamentales:
1. `grantedFlags`: Lista de etiquetas de texto que esta decisión activa en la partida (ej: `["soborno_aceptado", "chantaje_villarejo"]`).
2. `requiredFlags`: Lista de etiquetas que **deben estar activas** para que esta carta pueda entrar en la baraja (ej: `["soborno_aceptado"]`).

### Ejemplo de Cadena Causal:
- **Carta A (Trimestre 2):** Un constructor te ofrece un maletín de 200.000 € para recalificar un pinar.
  - Opción Izquierda: *Aceptar* $\rightarrow$ `grantedFlags: ["pinar_recalificado"]`, `pastaEnB: +15`, `presionJudicial: +8`.
- **Carta B (Trimestre 7):** Solo aparece si está activa la bandera `pinar_recalificado`:
  - Un colectivo ecologista y la Fiscalía de Medio Ambiente interponen querella por delito contra la ordenación del territorio.
  - Si en la Carta B eliges *Sobornar al fiscal*, activas `fiscal_comprado`.
- **Carta C (Trimestre 15):** Solo aparece si está activa `fiscal_comprado`:
  - El fiscal comprado te pide un puesto para su sobrino en el Tribunal de Cuentas o filtrará el audio a la prensa.

---

## 6. Proceso de Integración en el Proyecto

Una vez que AI Studio te entregue el JSON:
1. Copia el bloque JSON y guárdalo en un archivo temporal (ej. `nuevas_cartas.json`).
2. Ejecuta el script validador:
   ```powershell
   node "Plan AI Studio/validate_ai_studio_output.mjs" nuevas_cartas.json
   ```
3. Si el validador aprueba el archivo con 0 errores:
   - Puedes importarlo directamente pegándolo en el panel secreto `/admin` (pestaña Redacción / Crear Carta).
   - O bien nosotros lo fusionamos con [reignsDeck.json](file:///f:/Abi/Proyecto/Fanzine/src/content/reignsDeck.json) para que forme parte del mazo permanente oficial.
