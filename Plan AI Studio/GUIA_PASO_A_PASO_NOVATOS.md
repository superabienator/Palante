# 🧭 Guía Definitiva Paso a Paso: Escalado en Google AI Studio (Para Novatos)

> *«Esta es tu guía única. No necesitas consultar nada más. Sigue estos 4 pasos cronológicos para generar cientos de cartas ricas en diálogo, sumarios reales y ramificaciones narrativas, e integrarlas en el juego en segundos.»*

---

## 📋 Resumen del Proceso en 4 Pasos

1. **Paso 1:** Configurar la pantalla de Google AI Studio (2 minutos).
2. **Paso 2:** Subir tus documentos de consulta (PDFs, noticias o notas).
3. **Paso 3:** Copiar y pegar los prompts de generación.
4. **Paso 4:** Guardar el resultado y fusionarlo en el juego con un solo clic.

---

## 🛠️ PASO 1: Configurar Google AI Studio (Clic a Clic)

1. Abre tu navegador e inicia sesión en: **[https://aistudio.google.com/](https://aistudio.google.com/)**
2. Pulsa en el botón superior izquierdo: **`Create New Prompt`** $\rightarrow$ elige **`Chat Prompt`**.
3. **Configura la columna de la derecha (Panel de Ajustes):**
   - **Model:** Selecciona **`Gemini 1.5 Pro`** (o *Gemini 2.0 Pro / Flash* si lo tienes disponible). *Tiene 2 millones de tokens de memoria, suficiente para meter libros enteros.*
   - **Temperature:** Ponla en **`0.8`** (equilibrio ideal entre sátira creativa y precisión en el formato).
4. **Configura la caja de "System Instructions" (Columna izquierda o arriba):**
   Copia **todo el texto del siguiente recuadro** y pégalo tal cual en la casilla de *System Instructions*:

```text
Eres el Guionista Principal y Diseñador Narrativo de "IBEX-35 & Púnica: ¡PALANTE!", un simulador satírico, ácido y despiadado de supervivencia política, judicial y empresarial en España.

ESTILO LITERARIO:
- Humor negro ibérico, costumbrismo corrupto y esperpento berlanguiano (en la estela de "La Escopeta Nacional", "El Verdugo" y los guiones de Rafael Azcona).
- Cinismo institucional absoluto: los personajes buscan forrarse, comprar voluntades, esquivar a la UCO y asegurarse un sillón en el consejo del IBEX 35.
- Utiliza la terminología real de los sumarios de la Audiencia Nacional (visés, comisiones del 3%, mordidas en sobres manila, piezas separadas, recalificaciones del PGOU, fondos reservados, doctrina Botín, tarjetas black y comidas pantagruélicas en asadores con micrófonos ocultos).
- Cada decisión DEBE incluir un "flavorQuote" que suene a escucha telefónica real de la Guardia Civil o declaración judicial.

REGLAS DE FORMATO ESTRICTAS:
1. Responde SIEMPRE con un único JSON válido sin texto de introducción ni conclusiones.
2. Cada carta debe cumplir estrictamente esta estructura:
   - id: string único descriptivo (ej: "saga_koldo_01_mascarillas").
   - speaker: nombre del interlocutor (ej: "D. Romualdo", "El Comisario Pepe").
   - speakerRole: cargo satírico (ej: "El Fontanero de Interior").
   - sphere: exactamente "POLITICA", "ORDEN_JUSTICIA" o "EMPRESARIAL".
   - headline: titular en MAYÚSCULAS.
   - context: narración del dilema (2 a 4 frases mordaces).
   - evidenceDocument: descripción de la prueba física incautada si aplica.
   - weight: número entero del 1 al 5.
   - requiredFlags: lista de banderas necesarias para que la carta aparezca (o [] si puede salir desde el principio).
   - leftChoice y rightChoice: objetos con:
     * label: descripción de la acción.
     * stampText: texto del sello de caucho en MAYÚSCULAS (ej: "TRINCAR", "AFORARSE", "NEGAR").
     * flavorQuote: transcripción textual o verosímil de audio policial.
     * mechanicId: número entero del 1 al 40 (si otorga un resorte de corrupción permanente).
     * modifiers: { pastaEnB, presionJudicial, impunidad, reputacionMediatica } con valores entre -18 y +18.
     * grantedFlags: lista de banderas que esta decisión activa.
```

---

## 📎 PASO 2: Subir tus Fuentes Reales

En la barra inferior donde escribes los mensajes en AI Studio verás el icono del clip o **`+` (`Add file`)**:

1. Pulsa en **`+`** y sube los documentos que quieras que la IA utilice como base:
   - PDFs de autos judiciales o noticias de periódicos.
   - Informes de la UCO o resúmenes de comisiones de investigación del Congreso.
   - Notas propias con anécdotas o escándalos que quieras incluir.
2. *(Si no tienes archivos a mano, no te preocupes: Gemini ya conoce los casos Gürtel, Púnica, ERE, Nóos, Villarejo, Koldo, Bárcenas y Bankia en su memoria base).*

---

## 💬 PASO 3: Los Prompts de Generación (Copiar y Pegar en el Chat)

No le pidas 300 cartas de golpe. Pídele **Macro-Sagas de 6 a 8 cartas** en cada mensaje. Así la calidad literaria y los diálogos serán oro puro.

Aquí tienes los 3 prompts listos para usar en orden:

---

### PROMPT A: Generar una Macro-Saga de 6 Cartas Encadenadas
> *Copia el siguiente texto, cambia el título si quieres otro tema, y pégalo en el chat de AI Studio:*

```text
Genera una Macro-Saga ramificada de 6 cartas encadenadas titulada "La Trama de las Mascarillas y el Asador".

PREMISA:
En plena crisis sanitaria de urgencia, intermediarios y asesores de ministerios adjudican contratos millonarios de material sanitario defectuoso a una empresa pantalla sin experiencia previa, cobrando comisiones del 25% que se reparten en marisquerías de Madrid y se blanquean en chalets y parcelas rústicas.

ARQUITECTURA DE CARTAS:
- Carta 1 (Apertura): Se ofrece el primer contrato de emergencia sin licitación. La opción izquierda acepta y activa la bandera "contrato_urgencia_firmado"; la derecha lo frena y activa "proveedor_tradicional".
- Cartas 2, 3 y 4 (Nudo ramificado): Requieren "contrato_urgencia_firmado". Surgen problemas: las mascarillas no filtran, el banco avisa de transferencias sospechosas o la Guardia Civil pincha las llamadas del asesor. Cada decisión añade nuevas banderas.
- Cartas 5 y 6 (Clímax): Registro sorpresa de la UCO en el asador o comparecencia televisada en la comisión del Congreso.

RECUERDA:
- Incluye citas de escuchas telefónicas reales ("flavorQuote") y piezas de convicción ("evidenceDocument").
- Formato de respuesta: objeto JSON con las claves "sagaName", "description" y el array "cards".
```

---

### PROMPT B: Generar la Siguiente Saga sin Repetir
> *Una vez recibida la primera saga, envía este segundo prompt en la misma conversación:*

```text
Excelente. Ahora genera otra Macro-Saga ramificada diferente de 6 cartas titulada "El Gran Rescate de la Radial Quebrada".

PREMISA:
Una constructora del IBEX 35 construyó una autopista de peaje sin tráfico. Tras quebrar, exige que el Estado pague la factura mediante la Responsabilidad Patrimonial de la Administración (RPA), mientras la prensa económica destapa que el sobrecoste en el hormigón financió la sede del partido.

Asegúrate de que:
1. Los "id" de las cartas sean únicos (ej: "saga_radial_01_quiebra", "saga_radial_02_rescate", etc.).
2. Las banderas ("grantedFlags" y "requiredFlags") sean específicas de esta saga (ej: "radial_rescatada", "auditoria_boe_frenada").
3. Mantén el formato JSON puro.
```

---

### PROMPT C: Generar Cartas Virales de Actualidad
> *Para meter noticias de última hora que conecten con la realidad:*

```text
Genera un paquete de 4 cartas individuales de CUESTIÓN VIRAL / ESCÁNDALO DE PRENSA inspiradas en la actualidad política española reciente:

1. El candidato presidencial que cancela a última hora su entrevista en el programa de máxima audiencia ("El Plantón").
2. Un diputado que se equivoca al pulsar el botón telemático en una votación clave del Congreso.
3. La filtración de grabaciones de WhatsApp en un grupo de concejales conspirando contra su propio alcalde.
4. El descubrimiento de un zulo con fajos de billetes en el falso techo de un chalé en la sierra.

Formato: array JSON de cartas con titulares en mayúsculas, sellos tajantes y citas telefónicas ácidas.
```

---

## 💾 PASO 4: Guardar e Integrar en el Juego (En 30 Segundos)

Cuando AI Studio te responda con el bloque de código JSON:

1. **Copia el JSON:**
   - En la esquina superior derecha del bloque de código en AI Studio verás un icono de **`Copy`** (Copiar). Púlsalo.
2. **Guárdalo en un archivo:**
   - En tu editor (Antigravity / VS Code), crea un archivo nuevo dentro de la carpeta `Plan AI Studio/` llamado:
     **`nuevas_cartas.json`**
   - Pega dentro el contenido que acabas de copiar y guarda el archivo (`Ctrl + S`).
3. **Fusiónalo con el juego con este único comando:**
   - Abre la terminal de la aplicación y ejecuta:
     ```powershell
     node "Plan AI Studio/validate_ai_studio_output.mjs" "Plan AI Studio/nuevas_cartas.json" --merge
     ```
   - El script validará que todos los campos sean correctos, comprobará que no haya errores de sintaxis y **añadirá las nuevas cartas a la baraja oficial (`reignsDeck.json`) automáticamente**.

---

## 🗓️ Plan de 5 Sesiones Recomendado (Para alcanzar 200+ Cartas)

Para construir el juego más completo y divertido sin agobiarte, dedica una sesión de 15 minutos en AI Studio a cada uno de estos 5 pilares:

| Sesión | Temática de las Sagas | Cartas Estimadas |
|---|---|:---:|
| **Sesión 1** | **Las Cloacas del Estado:** Comisarios, cintas magnetofónicas, asaltos a casas y dossiers falsos. | +40 cartas |
| **Sesión 2** | **El Ladrillo y el Hormigón:** Recalificaciones de montes protegidos, aeropuertos fantasma y obras públicas. | +40 cartas |
| **Sesión 3** | **El Fondo de Reptiles y Clientelismo:** Subvenciones a cursos falsos, chóferes de confianza y prejubilaciones fantasma. | +40 cartas |
| **Sesión 4** | **La Gran Banca y el IBEX 35:** Tarjetas black, colocación de deuda a jubilados, safaris y rescates fiscales. | +40 cartas |
| **Sesión 5** | **Campañas Electorales y Virales:** Mítines vacíos, plantones en TV, comisiones parlamentarias y mociones de censura. | +40 cartas |

**Resultado final:** Una baraja de más de **240 cartas interconectadas**, donde cada legislatura de 25 trimestres tomará derroteros completamente distintos y nunca jugarás dos partidas iguales.
