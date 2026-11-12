# 02. Contratos de Datos y Esquemas JSON Requeridos

> *«El motor del juego no admite campos inventados ni tipos flexibles: Zod valida cada clave en tiempo de compilación. Si un campo no cumple el esquema, la carta será rechazada.»*

---

## 1. Esquema Maestro de una Carta (`ReignsCard`)

AI Studio debe responder con un objeto JSON que contenga un array bajo la clave `"cards"`, o bien un array directo de objetos con esta estructura exacta:

```json
{
  "id": "saga_ladrillo_01_recalificacion_pinar",
  "speaker": "Don Romualdo",
  "speakerRole": "Promotor Inmobiliario de la Costa",
  "sphere": "EMPRESARIAL",
  "headline": "RECALIFICACIÓN EXPRÉS DE MONTE QUEMADO",
  "context": "Don Romualdo se presenta en el despacho con una caja de puros habanos que pesa sospechosamente como un lingote de plomo. El monte comunal ardió misteriosamente el pasado 15 de agosto y la promotora quiere levantar 400 adosados con campo de golf antes de que nazca el primer pino.",
  "evidenceDocument": "Plano urbanístico con anotación manuscrita a lápiz: 'Para el alcalde, 120k en bulto'.",
  "weight": 2,
  "requiredFlags": [],
  "archetypeAffinity": ["PROCONSUL_HORMIGON", "BARON_ENCOFRADO"],
  "leftChoice": {
    "label": "Firmar la modificación del PGOU por decreto de urgencia alegando interés social",
    "stampText": "RECALIFICAR",
    "flavorQuote": "Tú firma ahí, hombre, que el suelo recalificado no cría conejos pero da de comer a tres legislaturas.",
    "mechanicId": 1,
    "modifiers": {
      "pastaEnB": 14,
      "presionJudicial": 10,
      "impunidad": -4,
      "reputacionMediatica": -8
    },
    "grantedFlags": ["pinar_recalificado", "compromiso_don_romualdo"]
  },
  "rightChoice": {
    "label": "Paralizar el expediente y enviar a los técnicos de Medio Ambiente a plantar encinas",
    "stampText": "BLOQUEAR",
    "flavorQuote": "Acuérdate de quién te pagó la campaña municipal en cartelería, que la memoria en política dura cuatro telediarios.",
    "mechanicId": 3,
    "modifiers": {
      "pastaEnB": -8,
      "presionJudicial": -6,
      "impunidad": 4,
      "reputacionMediatica": 8
    },
    "grantedFlags": ["romualdo_enemigo_jurado"]
  }
}
```

---

## 2. Desglose Campo por Campo

### Campos Principales de la Carta

| Campo | Tipo | Obligatorio | Descripción y Restricciones |
|---|---|:---:|---|
| `id` | `string` | **SÍ** | Identificador único en formato `kebab_case` o `snake_case`. Debe indicar la saga y el número secuencial (ej. `saga_cloacas_03_grabacion`). |
| `speaker` | `string` | **SÍ** | Nombre del interlocutor (ej. `D. Romualdo`, `El Comisario Pepe`, `Fiscalía Anticorrupción`). |
| `speakerRole` | `string` | **SÍ** | Cargo o rol satírico (ej. `Fontanero de Interior`, `Sepulturero de Deuda`). |
| `sphere` | `enum` | **SÍ** | **Solo uno de estos 3 valores exactos:**<br>• `"POLITICA"`<br>• `"ORDEN_JUSTICIA"`<br>• `"EMPRESARIAL"` |
| `headline` | `string` | **SÍ** | Titular en **MAYÚSCULAS** estilo fanzine / teletipo de prensa (ej. `BOLSAS DE BASURA EN EL HELIPUERTO`). |
| `context` | `string` | **SÍ** | Narración del dilema (2 a 4 frases). Tono cínico, literario, ácido y berlanguiano. |
| `evidenceDocument` | `string` | No | Breve descripción de la prueba física incautada (ej. `Pendrive verde precintado por la UCO con 400 audios`). Si no hay prueba, omitir el campo o dejar como `null`. |
| `weight` | `number` | No | Probabilidad relativa de aparición (entero del `1` al `10`, por defecto `1`). Cartas raras = 1, cartas comunes = 3-5. |
| `requiredFlags` | `string[]` | No | Array de banderas requeridas. Si está vacío `[]`, puede aparecer desde el inicio. Si contiene `["pinar_recalificado"]`, solo entrará en el bombo cuando esa bandera haya sido activada por una decisión previa. |
| `archetypeAffinity` | `enum[]` | No | Si esta carta está pensada especialmente para ciertos arquetipos (ver lista de 12 IDs permitidos más abajo). |
| `leftChoice` | `object` | **SÍ** | Objeto con la decisión hacia la izquierda (ver sección siguiente). |
| `rightChoice` | `object` | **SÍ** | Objeto con la decisión hacia la derecha (ver sección siguiente). |

---

### Campos del Objeto de Decisión (`leftChoice` y `rightChoice`)

| Campo | Tipo | Obligatorio | Descripción y Restricciones |
|---|---|:---:|---|
| `label` | `string` | **SÍ** | Descripción de la acción tomada por el jugador. |
| `stampText` | `string` | **SÍ** | Texto en **MAYÚSCULAS** del sello de caucho emergente (ej. `TRINCAR`, `AFORARSE`, `NEGAR`, `FILTRAR`, `AMORTIZAR`, `SOBORNAR`, `PURGAR`). Máximo 2 palabras. |
| `flavorQuote` | `string` | No | Cita real o verosímil de pinchazo telefónico de la UCO o sumario judicial. Imprescindible para el tono del juego. |
| `mechanicId` | `number` | No | ID numérico del privilegio/mecánica asociado (entero del `1` al `40`). Si esta decisión otorga un privilegio permanente, se indica aquí. |
| `modifiers` | `object` | **SÍ** | Modificadores a las 4 estadísticas patrimoniales (ver tabla de rangos). |
| `grantedFlags` | `string[]` | No | Banderas que esta decisión inyecta en el estado de la partida para abrir o cerrar futuras tramas. |

---

### Las 4 Estadísticas y sus Rangos de Modificador

Cada una de las 4 métricas va de `0` a `100`. Los modificadores en cada decisión deben ser números enteros equilibrados:

```typescript
modifiers: {
  pastaEnB?: number;            // De -25 a +25 (Mordidas, fondos opacos)
  presionJudicial?: number;     // De -25 a +25 (Atención de la UCO y fiscales)
  impunidad?: number;           // De -25 a +25 (Red clientelar y aforamiento)
  reputacionMediatica?: number; // De -25 a +25 (Control editorial y portadas)
}
```

> [!WARNING]
> **Regla de Oro del Balance:**
> Ninguna decisión normal debe alterar más de 20 puntos de golpe una estadística (salvo cartas de crisis extrema). Los deltas habituales oscilan entre `±5` y `±14` para dar recorrido a los dados y permitir partidas de 25 trimestres.

---

## 3. Lista Cerrada de Enums Permitidos

### A. Esferas de Poder (`SphereType`)
- `"POLITICA"`
- `"ORDEN_JUSTICIA"`
- `"EMPRESARIAL"`

### B. Los 12 Arquetipos de Jugador (`ArchetypeId`)
Si usas `archetypeAffinity`, solo puedes incluir estos identificadores:
- `"CUSTODIO_LIBRETA"` (Tesorero de partido con libreta manuscrita)
- `"PROCONSUL_HORMIGON"` (Barón autonómico con aeropuerto sin aviones)
- `"FONTANERO_INTERIOR"` (Secretario de Estado de fondos reservados)
- `"PASANTE_GIRATORIO"` (Joven promesa camino de un consejo del IBEX)
- `"ARCHIVADOR_CLOACA"` (Comisario veterano con grabadoras en asadores)
- `"ARQUITECTO_SOBRESEIMIENTO"` (Abogado de Estado diseñando la doctrina Botín)
- `"TAPON_INSTITUCIONAL"` (Fiscal general afín frenando querellas)
- `"DIFUNTO_CONVENIENCIA"` (Agente secreto fiduciario fingiendo su defunción)
- `"BARON_ENCOFRADO"` (Presidente de constructora del IBEX con palco)
- `"ALQUIMISTA_HORMIGONERA"` (Promotor de la Púnica y el 30% en comisiones)
- `"TAUMATURGO_AGUJERO"` (Presidente de caja de ahorros rescatada con dinero público)
- `"LAVANDERO_TRANSNACIONAL"` (Testaferro suizo con sociedades en Panamá y Singapur)

---

## 4. Esquema de Retorno por Lote (Colección de Cartas)

Pídele a AI Studio que envuelva la respuesta siempre en esta estructura para procesarla en bloque:

```json
{
  "sagaName": "Nombre de la Macro-Saga o Lote",
  "description": "Resumen del arco argumental y ramificaciones cubiertas",
  "cards": [
    { /* Carta 1 */ },
    { /* Carta 2 */ },
    { /* Carta 3 */ }
  ]
}
```
