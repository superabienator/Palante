# 04. Ejemplos Few-Shot de Oro (Estándar Canónico)

> *«Adjunta estos ejemplos en tus conversaciones con Google AI Studio para que el modelo imite con precisión milimétrica la sintaxis, el encadenamiento de banderas y la mordacidad cómica.»*

---

## Ejemplo 1: Macro-Saga Ramificada de 3 Cartas con Banderas (`flags`)

Este ejemplo muestra cómo la Carta 1 bifurca el destino, la Carta 2 depende de la decisión de la Carta 1, y la Carta 3 desata el desenlace:

```json
{
  "sagaName": "Operación Cocina: El Chófer y el Falso Cura",
  "description": "Intriga parapolicial para sustraer los papeles del extesorero utilizando fondos reservados de Interior.",
  "cards": [
    {
      "id": "saga_cocina_01_captacion_chofer",
      "speaker": "Secretario de Estado de Seguridad",
      "speakerRole": "El Fontanero de Interior",
      "sphere": "ORDEN_JUSTICIA",
      "headline": "OPERACIÓN KITCHEN: CAPTAR AL CHÓFER DE CONFIANZA",
      "context": "El extesorero está preso en Soto del Real, pero su mujer sigue moviéndose por Madrid en coche oficial. El chófer de la familia conoce todos los zulos, trasteros y pendrives con grabaciones. Una paga mensual de 2.000 € de los fondos reservados y una plaza fija en la Policía Nacional obrarían el milagro.",
      "evidenceDocument": "Recibo manuscrito con el concepto 'Colaborador K' firmado con inicial ilegible.",
      "weight": 2,
      "requiredFlags": [],
      "archetypeAffinity": ["FONTANERO_INTERIOR", "ARCHIVADOR_CLOACA"],
      "leftChoice": {
        "label": "Pagar la mensualidad opaca del chófer con cargo a la partida de reptiles de Interior",
        "stampText": "COMPRARLO",
        "flavorQuote": "El chófer se nos viene con todo. Por dos mil pavos al mes y una placa de policía te entrega hasta los dientes de oro del abuelo.",
        "mechanicId": 15,
        "modifiers": {
          "pastaEnB": -10,
          "presionJudicial": -8,
          "impunidad": 8,
          "reputacionMediatica": 0
        },
        "grantedFlags": ["cocina_chofer_captado"]
      },
      "rightChoice": {
        "label": "Negarse a financiar la operación y dejar que el extesorero cante ante el juez",
        "stampText": "DESESTIMAR",
        "flavorQuote": "No me metáis en este fregado, que los fondos reservados dejan rastro en el Tribunal de Cuentas y yo tengo tres hijos estudiando en ICADE.",
        "modifiers": {
          "pastaEnB": 6,
          "presionJudicial": 12,
          "impunidad": -8,
          "reputacionMediatica": -6
        },
        "grantedFlags": ["cocina_operacion_abortada"]
      }
    },
    {
      "id": "saga_cocina_02_asalto_falso_cura",
      "speaker": "El Sicario del Alzacuellos",
      "speakerRole": "El Falso Sacerdote con Revólver",
      "sphere": "ORDEN_JUSTICIA",
      "headline": "UN FALSO CURA ASALTA LA CASA DEL EXTESORERO",
      "context": "El chófer captado ha señalado el piso familiar. Un sicario disfrazado de sacerdote franciscano con alzacuellos llama a la puerta diciendo que viene de Instituciones Penitenciarias. Una vez dentro, encañona a la familia exigiendo 'los pendrives que tumban al Gobierno'.",
      "evidenceDocument": "Revólver sin número de serie y crucifijo de madera requisados en el felpudo del inmueble.",
      "weight": 1,
      "requiredFlags": ["cocina_chofer_captado"],
      "archetypeAffinity": ["FONTANERO_INTERIOR", "ARCHIVADOR_CLOACA"],
      "leftChoice": {
        "label": "Ordenar que la policía municipal y los Geos irrumpan de inmediato y silencien el suceso",
        "stampText": "SILENCIAR",
        "flavorQuote": "Meted al cura en un calabozo sin libro de registro y decid a la prensa que era un perturbado con problemas de medicación.",
        "mechanicId": 17,
        "modifiers": {
          "pastaEnB": -6,
          "presionJudicial": 8,
          "impunidad": -4,
          "reputacionMediatica": -10
        },
        "grantedFlags": ["cocina_falso_cura_detenido", "cocina_pendrive_recuperado"]
      },
      "rightChoice": {
        "label": "Dejar que el asalto prosiga sin interferencia policial para que limpie la vivienda",
        "stampText": "DEJAR HACER",
        "flavorQuote": "Que revuelva los cajones. Si encuentra las cintas, nos hemos ahorrado quince años de banquillo en la Audiencia Nacional.",
        "modifiers": {
          "pastaEnB": 0,
          "presionJudicial": 14,
          "impunidad": 4,
          "reputacionMediatica": -14
        },
        "grantedFlags": ["cocina_escandalo_prensa_total"]
      }
    },
    {
      "id": "saga_cocina_03_chantaje_pendrives",
      "speaker": "El Comisario Pepe",
      "speakerRole": "El Rey del Kompromat",
      "sphere": "ORDEN_JUSTICIA",
      "headline": "SUBASTA PRIVADA DE LOS 32 TERABYTES INCAUTADOS",
      "context": "El comisario se ha quedado en custodia del pendrive incautado en el asalto. Te convoca a una comida privada en el reservado de un asador de la calle Capitán Haya. Sobre el mantel de hilo despliega tres carpetas: 'Moncloa', 'Fiscales' y 'Banca Privada'.",
      "evidenceDocument": "Disco duro externo de dos terabytes lacrado con cinta policial rota.",
      "weight": 1,
      "requiredFlags": ["cocina_pendrive_recuperado"],
      "archetypeAffinity": ["FONTANERO_INTERIOR", "ARCHIVADOR_CLOACA"],
      "leftChoice": {
        "label": "Comprar su silencio garantizándole contratos de seguridad privada para su empresa pantalla",
        "stampText": "PACTAR",
        "flavorQuote": "A mí con que me respetéis las medallas pensionadas y las fincas de Córdoba me tenéis de amigo toda la vida.",
        "mechanicId": 16,
        "modifiers": {
          "pastaEnB": -12,
          "presionJudicial": -10,
          "impunidad": 12,
          "reputacionMediatica": 4
        },
        "grantedFlags": ["pacto_villarejo_sellado"]
      },
      "rightChoice": {
        "label": "Echarte un farol, rechazar la extorsión y ordenar a Asuntos Internos que le investiguen",
        "stampText": "DESAFIAR",
        "flavorQuote": "Te estás equivocando de cabo a rabo. Como yo abra la caja de los truenos, no queda en pie ni el apuntador.",
        "mechanicId": 19,
        "modifiers": {
          "pastaEnB": 0,
          "presionJudicial": 16,
          "impunidad": -14,
          "reputacionMediatica": -16
        },
        "grantedFlags": ["guerra_total_cloacas"]
      }
    }
  ]
}
```

---

## Ejemplo 2: Carta de Crisis Extrema (Alta Tensión Procesal)

```json
{
  "id": "crisis_presion_registro_inminente",
  "speaker": "El Portero de la Finca",
  "speakerRole": "Vigilante de la Urbanización VIP",
  "sphere": "ORDEN_JUSTICIA",
  "headline": "¡CRISIS MÁXIMA! LOS FURGONES DE LA UCO ESTÁN EN TU PUERTA",
  "context": "Son las 06:14 de la mañana. Cuatro furgones blancos de la Guardia Civil han bloqueado la barrera de acceso a tu urbanización de lujo. El juez instructor de la Audiencia Nacional y la secretaria judicial avanzan hacia tu portal con mandamiento de entrada y registro.",
  "evidenceDocument": "Auto judicial con providencia de prisión provisional comunicada y sin fianza.",
  "weight": 1,
  "requiredFlags": [],
  "leftChoice": {
    "label": "Tirar los móviles por la ventana del patio interior y quemar los dietarios en la chimenea",
    "stampText": "DESTRUIR",
    "flavorQuote": "¡Que no dejen entrar a nadie hasta que la chimenea no eche humo negro! ¡Tirad los discos duros al retrete ahora mismo!",
    "mechanicId": 10,
    "modifiers": {
      "pastaEnB": -12,
      "presionJudicial": -14,
      "impunidad": -8,
      "reputacionMediatica": -16
    },
    "grantedFlags": ["destruccion_pruebas_ejecutada"]
  },
  "rightChoice": {
    "label": "Abrir la puerta en batín de seda, servir café a los agentes y llamar en directo al presidente del Supremo",
    "stampText": "LLAMADA VIP",
    "flavorQuote": "Ustedes no saben con quién están hablando. En diez minutos este secretario judicial va a estar redactando multas de tráfico en Melilla.",
    "mechanicId": 37,
    "modifiers": {
      "pastaEnB": 0,
      "presionJudicial": -6,
      "impunidad": 14,
      "reputacionMediatica": -8
    },
    "grantedFlags": ["contacto_supremo_activado"]
  }
}
```

---

## Ejemplo 3: Carta de Coyuntura Viral (Actualidad Cruda)

```json
{
  "id": "viral_planton_entrevista_prime_time",
  "speaker": "Jefe de Campaña",
  "speakerRole": "Asesor de Comunicación Electoral",
  "sphere": "POLITICA",
  "headline": "EL PLANTÓN HISTÓRICO AL PROGRAMA DE MÁXIMA AUDIENCIA",
  "context": "Faltan cuarenta y ocho horas para la noche electoral. El líder de tu partido ha cancelado a última hora su comparecencia en el programa de entrevistas más visto del país. Las redes arden acusándole de cobardía y las encuestas internas pronostican una pérdida fulminante de quince escaños decisivos.",
  "evidenceDocument": "Borrador de escaleta televisiva con la palabra 'CANCELADO' estampada en rotulador rojo.",
  "weight": 2,
  "requiredFlags": [],
  "leftChoice": {
    "label": "Convocar una rueda de prensa improvisada denunciando 'encerrona mediática y manipulación'",
    "stampText": "VICTIMISMO",
    "flavorQuote": "No vamos a prestarnos al circo de los inquisidores mediáticos. Nos debemos a la España real que madruga.",
    "mechanicId": 40,
    "modifiers": {
      "pastaEnB": 0,
      "presionJudicial": -2,
      "impunidad": 8,
      "reputacionMediatica": -12
    },
    "grantedFlags": ["furia_electoral_activada"]
  },
  "rightChoice": {
    "label": "Rectificar de urgencia, acudir al plató y aceptar someterse a dos horas de preguntas a degüello",
    "stampText": "DAR LA CARA",
    "flavorQuote": "Entra ahí con una sonrisa de oreja a oreja y no pestañees ni aunque te saquen las fotos del yate en Formentera.",
    "modifiers": {
      "pastaEnB": -4,
      "presionJudicial": 6,
      "impunidad": -6,
      "reputacionMediatica": 14
    },
    "grantedFlags": ["debate_cara_a_cara_superado"]
  }
}
```
