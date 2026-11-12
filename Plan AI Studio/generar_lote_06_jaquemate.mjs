import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.join(__dirname, 'lotes_generados', 'lote_06_operacion_jaquemate.json');

const lote06Data = {
  sagaName: "Operación Jaque Mate: El Fiscal, el Comisario y el Asador Rianxo",
  description: "Macro-saga de 50 cartas extraídas minuciosamente de la investigación judicial y documental de 'Operación Jaque Mate: Cómo acabaron con el fiscal del caso Villarejo' (Ernesto Ekaizer). Detalla el asalto a Boadilla, el encriptado 'disco de oro', la purga y acoso al fiscal Anticorrupción Ignacio Stampa por parte de la Fiscalía General, el espionaje masivo de 15.000 llamadas encargado por Francisco González (BBVA), el asalto del falso cura y los fondos reservados de la Operación Kitchen, la trama del móvil de Dina Bousselham, los audios del asador Rianxo y el módulo de Estremera.",
  cards: [
    // === SUB-SAGA 1: EL ASALTO A BOADILLA Y EL ARCHIVO SECRETO (10 Cartas) ===
    {
      id: "saga_jaquemate_01_asalto_boadilla",
      speaker: "El Inspector de Asuntos Internos",
      speakerRole: "Jefe del Equipo de Asalto Tándem",
      sphere: "ORDEN_JUSTICIA",
      headline: "ASALTO A LA MANSIÓN DE BOADILLA: 40 GRABADORAS OLYMPUS Y FAJOS EN LA CAJA FUERTE",
      context: "A las seis de la mañana, un equipo conjunto de Asuntos Internos y UDEF derriba la puerta del chalet blindado de José Manuel Villarejo. Tras cuadros de caza y estanterías giratorias encuentran cuarenta grabadoras digitales y cajas de caudales con billetes de 500 euros.",
      evidenceDocument: "Acta judicial de registro y entrada de 12 horas con inventario de 100 terabytes en soportes magnéticos.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Precintar todos los servidores y trasladarlos a la Audiencia Nacional en furgón escoltado",
        stampText: "INCAUTACIÓN TOTAL",
        flavorQuote: "Treinta años de grabaciones secretas del Reino de España caen en manos de los jueces de guardia.",
        mechanicId: 38,
        modifiers: { pastaEnB: -14, presionJudicial: -20, impunidad: -16, reputacionMediatica: 20 },
        grantedFlags: ["JAQUEMATE_ARCHIVOS_INCAUTADOS"]
      },
      rightChoice: {
        label: "Permitir que el comisario esconda el disco de copias de seguridad en el jardín",
        stampText: "REGISTRO SELECTIVO",
        flavorQuote: "Hay secretos de Estado que ni la policía ni el juez quieren ver en la portada del periódico de mañana.",
        mechanicId: 21,
        modifiers: { pastaEnB: 16, presionJudicial: 14, impunidad: 18, reputacionMediatica: -16 },
        grantedFlags: ["JAQUEMATE_REGISTRO_AMORTIGUADO"]
      }
    },
    {
      id: "saga_jaquemate_02_disco_de_oro",
      speaker: "El Perito Informático Forense",
      speakerRole: "Descifrador de la Policía Científica",
      sphere: "ORDEN_JUSTICIA",
      headline: "EL 'DISCO DE ORO': ENCRIPTACIÓN TRIPLE DE MICROSOFT PARA BLINDAR LAS CLOACAS",
      context: "Entre el material requisado aparece un disco duro externo con triple capa de cifrado BitLocker. Contiene carpetas rotuladas 'Control Político', 'Fondos Reservados' y 'Chantajes Ibex'. El comisario se niega a facilitar la clave alfanumérica.",
      evidenceDocument: "Informe pericial de la Sección de Ciberdelincuencia que certifica que descifrarlo por fuerza bruta tardará 40 años.",
      weight: 3,
      requiredFlags: ["JAQUEMATE_ARCHIVOS_INCAUTADOS"],
      leftChoice: {
        label: "Ofrecer atenuante procesal por confesión si entrega la contraseña del disco",
        stampText: "PACTO CLAVE",
        flavorQuote: "La contraseña es un pasaporte para abrir las alcantarillas de la transición sin anestesia.",
        mechanicId: 17,
        modifiers: { pastaEnB: 10, presionJudicial: -18, impunidad: 12, reputacionMediatica: 16 },
        grantedFlags: ["JAQUEMATE_DISCO_DESCIFRADO"]
      },
      rightChoice: {
        label: "Rechazar tratos y procesarle con la máxima petición de prisión por obstrucción a la justicia",
        stampText: "MANO DURA",
        flavorQuote: "No se negocia con quien ha grabado a medio país para extorsionar a ministros y banqueros.",
        mechanicId: 38,
        modifiers: { pastaEnB: -12, presionJudicial: 16, impunidad: -14, reputacionMediatica: 18 },
        grantedFlags: ["JAQUEMATE_DISCO_CERRADO"]
      }
    },
    {
      id: "saga_jaquemate_03_cenyt_holding",
      speaker: "El Director Financiero de CENYT",
      speakerRole: "Contable del Holding de Boadilla",
      sphere: "EMPRESARIAL",
      headline: "TORRE PICASSO: EL HOLDING DE LAS CLOACAS FACTURA 25 MILLONES A GRANDES DEL IBEX",
      context: "En la planta alta del rascacielos madrileño opera la sede oficial del grupo CENYT. La empresa emite facturas de 'análisis de riesgos' y 'prospección internacional' a multinacionales cotizadas para encubrir seguimientos ilegales de competidores.",
      evidenceDocument: "Facturas de CENYT Seguridad y CENYT Consultoría por importe de 4.800.000 euros firmadas con grandes energéticas.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Seguir pagando las cuotas mensuales de protección preventiva a través de la filial de Panamá",
        stampText: "CUOTA PROTECCIÓN",
        flavorQuote: "Tener a la policía privada de nuestro lado cuesta un millón al año, pero duermes tranquilo.",
        mechanicId: 14,
        modifiers: { pastaEnB: -16, presionJudicial: -14, impunidad: 20, reputacionMediatica: -12 },
        grantedFlags: ["JAQUEMATE_CENYT_CLIENTE"]
      },
      rightChoice: {
        label: "Cancelar todos los contratos de seguridad y presentar denuncia por extorsión mercantil",
        stampText: "RUPTURA CONTRATO",
        flavorQuote: "Se acabó pagar a chantajistas uniformados: que vengan a la junta de accionistas si se atreven.",
        mechanicId: 10,
        modifiers: { pastaEnB: 12, presionJudicial: 12, impunidad: -16, reputacionMediatica: 18 },
        grantedFlags: ["JAQUEMATE_CENYT_DENUNCIADO"]
      }
    },
    {
      id: "saga_jaquemate_04_garcia_losada_cuento_largo",
      speaker: "El Comisario General García Losada",
      speakerRole: "Exjefe de Policía Judicial",
      sphere: "ORDEN_JUSTICIA",
      headline: "EL 'CUENTO LARGO': 'VILLAREJO USABA EL AGENTE ENCUBIERTO PARA FORRARSE ÉL'",
      context: "En la comisión parlamentaria, el histórico mando policial desmonta el mito del comisario patriótico: 'Todo lo que hacía era el timo del cuento largo. Decía a los ricos que el Estado los espiaba para cobrarles millones por salvarlos. Su patria era la pasta'.",
      evidenceDocument: "Diario de Sesiones del Congreso de los Diputados con la transcripción literal del testimonio bajo juramento.",
      weight: 2,
      requiredFlags: [],
      leftChoice: {
        label: "Descalificar la comparecencia acusando al mando de rencillas internas del cuerpo",
        stampText: "RENCOR POLICIAL",
        flavorQuote: "Entre comisarios retirados la envidia es el peor veneno: que no vengan a dar lecciones de moral.",
        mechanicId: 21,
        modifiers: { pastaEnB: 8, presionJudicial: 10, impunidad: 12, reputacionMediatica: -14 },
        grantedFlags: ["JAQUEMATE_LOSADA_DESCALIFICADO"]
      },
      rightChoice: {
        label: "Aportar el testimonio al sumario judicial para desmontar la tesis del agente encubierto",
        stampText: "SUMARIO APORTADO",
        flavorQuote: "Si un comisario general declara que era una estafa piramidal, la defensa se desmorona por completo.",
        mechanicId: 38,
        modifiers: { pastaEnB: -10, presionJudicial: -16, impunidad: -12, reputacionMediatica: 18 },
        grantedFlags: ["JAQUEMATE_TESIS_DESMONTADA"]
      }
    },
    {
      id: "saga_jaquemate_05_canon_bertha_informe_falso",
      speaker: "El Redactor de la 'Policía Patriótica'",
      speakerRole: "Fabricante de Dosieres de Guerra Sucia",
      sphere: "POLITICA",
      headline: "EL 'CAÑÓN BERTHA': EL BORRADOR FALSO DE LA UDEF FILTRADO EN PLENAS ELECCIONES",
      context: "En noviembre de 2012, en plena campaña catalana, la cúpula policial redacta un borrador anónimo sin sello oficial acusando a líderes nacionalistas de cuentas en Suiza. Villarejo lo bautiza como su 'cañón Bertha' de artillería pesada mediática.",
      evidenceDocument: "Copia del borrador sin firma ni número de registro publicado en la primera plana del diario El Mundo.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Disparar el borrador a toda la prensa afín para reventar las expectativas electorales",
        stampText: "FUEGO MEDIÁTICO",
        flavorQuote: "El cañón Bertha no busca una sentencia judicial, busca hundir diez escaños en cuarenta y ocho horas.",
        mechanicId: 15,
        modifiers: { pastaEnB: 12, presionJudicial: 14, impunidad: 14, reputacionMediatica: -20 },
        grantedFlags: ["JAQUEMATE_CANON_BERTHA_DISPARADO"]
      },
      rightChoice: {
        label: "Desautorizar el documento públicamente confirmando que la UDEF jamás redactó ese informe",
        stampText: "DESMENTIDO UDEF",
        flavorQuote: "La policía democrática no publica pasquines sin firma la víspera de que la gente vote en las urnas.",
        mechanicId: 10,
        modifiers: { pastaEnB: -12, presionJudicial: -14, impunidad: -14, reputacionMediatica: 18 },
        grantedFlags: ["JAQUEMATE_BORRADOR_DESAUTORIZADO"]
      }
    },
    {
      id: "saga_jaquemate_06_estremera_modulo_politicos",
      speaker: "El Abogado Alfonso Pazos",
      speakerRole: "Compañero de Celda en Estremera",
      sphere: "ORDEN_JUSTICIA",
      headline: "MÓDULO 4 DE ESTREMERA: EL DESPACHO CARCELARIO DONDE SE TRAFICAN SECRETOS",
      context: "Ingresado en prisión provisional, el comisario comparte patio con extesoreros y exconsejeros autonómicos. Con la ayuda de un recluso de confianza, diseña un catálogo comercial de audios inéditos que ofrece a antiguos clientes para salvar sus causas.",
      evidenceDocument: "Notas manuscritas interceptadas en un paquete de tabaco con listas de precios por cinta encriptada.",
      weight: 2,
      requiredFlags: ["JAQUEMATE_ARCHIVOS_INCAUTADOS"],
      leftChoice: {
        label: "Negociar la compra de una grabación comprometedora a través de un intermediario suizo",
        stampText: "COMPRA CELDA",
        flavorQuote: "Tres millones de euros en una cuenta fiduciaria y la cinta del asador desaparece para siempre del sumario.",
        mechanicId: 14,
        modifiers: { pastaEnB: -18, presionJudicial: -16, impunidad: 18, reputacionMediatica: -10 },
        grantedFlags: ["JAQUEMATE_CINTA_RESCATADA"]
      },
      rightChoice: {
        label: "Intervenir la celda por sorpresa, requisar las notas manuscritas y aislarlo de módulo",
        stampText: "AISLAMIENTO",
        flavorQuote: "Se acabaron los despachos en la cárcel: en Estremera manda Instituciones Penitenciarias, no el comisario.",
        mechanicId: 38,
        modifiers: { pastaEnB: 8, presionJudicial: 14, impunidad: -16, reputacionMediatica: 16 },
        grantedFlags: ["JAQUEMATE_COMISARIO_AISLADO"]
      }
    },
    {
      id: "saga_jaquemate_07_amenaza_carta_moncloa",
      speaker: "El Portavoz de la Defensa del Comisario",
      speakerRole: "Emisario de Cartas Incendiarias",
      sphere: "POLITICA",
      headline: "CARTA A MONCLOA: 'SI YO CAIGO, ARDE EL ESTADO HASTA LOS CIMIENTOS'",
      context: "El comisario envía una carta abierta al presidente del Gobierno recordando sus 'servicios a la patria' en el País Vasco, en el caso Nóos y con la familia real. Exige su inmediata excarcelación por razones humanitarias o filtrará material clasificado.",
      evidenceDocument: "Carta con sello de entrada en el registro de Presidencia del Gobierno con alusiones directas a la Zarzuela.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Ceder al chantaje y maniobrar con la fiscalía para solicitar arresto domiciliario",
        stampText: "CESIÓN CHANTAJE",
        flavorQuote: "Es mejor un jubilado con pulsera telemática en Boadilla que ver la Corona en la portada de los diarios extranjeros.",
        mechanicId: 32,
        modifiers: { pastaEnB: 10, presionJudicial: -20, impunidad: 22, reputacionMediatica: -22 },
        grantedFlags: ["JAQUEMATE_CHANTAJE_MONCLOA_EXITOSO"]
      },
      rightChoice: {
        label: "Ignorar la misiva y remitir el texto al fiscal general para abrir una nueva pieza por coacciones",
        stampText: "COACCIONES",
        flavorQuote: "El Estado de derecho no negocia con amenazas epistolares desde el patio de una cárcel.",
        mechanicId: 16,
        modifiers: { pastaEnB: -12, presionJudicial: 18, impunidad: -18, reputacionMediatica: 20 },
        grantedFlags: ["JAQUEMATE_CARTA_IGNORADA"]
      }
    },
    {
      id: "saga_jaquemate_08_pension_invalidez_fingida",
      speaker: "El Médico Forense de la Audiencia",
      speakerRole: "Evaluador Médico de Imputados",
      sphere: "ORDEN_JUSTICIA",
      headline: "ICTUS DE CONVENIENCIA: EL COMISARIO ALEGA CEGUERA Y PÉRDIDA COGNITIVA SEVERA",
      context: "A las puertas del juicio oral por las piezas principales, los peritos de parte presentan un informe médico afirmando que el comisario padece demencia vascular, ceguera repentina del ojo izquierdo y vértigos que le impiden sentarse en el estrado.",
      evidenceDocument: "Dictamen médico privado con diagnóstico de deterioro cerebral irreversible firmado por clínica privada.",
      weight: 2,
      requiredFlags: [],
      leftChoice: {
        label: "Suspender la vista oral indefinidamente y concederle la incapacidad permanente",
        stampText: "SUSPENSIÓN MÉDICA",
        flavorQuote: "Si no ve ni recuerda su nombre, no podemos sentarlo ante tres magistrados; causa suspendida sine die.",
        mechanicId: 37,
        modifiers: { pastaEnB: 12, presionJudicial: -25, impunidad: 25, reputacionMediatica: -20 },
        grantedFlags: ["JAQUEMATE_JUICIO_SUSPENDIDO"]
      },
      rightChoice: {
        label: "Exigir una revisión forense exhaustiva por médicos del juzgado y obligarle a comparecer",
        stampText: "REVISIÓN FORENSE",
        flavorQuote: "Para amenazar a presidentes tiene una memoria de elefante; que declare aunque sea en silla de ruedas.",
        mechanicId: 38,
        modifiers: { pastaEnB: -10, presionJudicial: 18, impunidad: -14, reputacionMediatica: 18 },
        grantedFlags: ["JAQUEMATE_FORENSE_OBLIGADO"]
      }
    },
    {
      id: "saga_jaquemate_09_socio_uruguayo_cuentas",
      speaker: "El Gestor de Cuentas en Montevideo",
      speakerRole: "Fiduciario del Cono Sur",
      sphere: "EMPRESARIAL",
      headline: "LA RUTA DE MONTEVIDEO: 14 MILLONES APARCADOS EN FONDOS INMOBILIARIOS CHARRÚAS",
      context: "La UCO descubre un entramado societario en Uruguay y Panamá a nombre del socio fiduciario del comisario. Los fondos procedentes de las extorsiones a empresarios españoles se invirtieron en hoteles de lujo y urbanizaciones cerradas en Punta del Este.",
      evidenceDocument: "Comisión rogatoria de la justicia uruguaya con extractos de transferencias millonarias desde cuentas de Zurich.",
      weight: 2,
      requiredFlags: [],
      leftChoice: {
        label: "Bloquear las comisiones rogatorias mediante recursos dilatorios en los tribunales uruguayos",
        stampText: "DILACIÓN CHARRÚA",
        flavorQuote: "Entre la justicia española y la del Cono Sur hay miles de kilómetros y años de recursos de alzada.",
        mechanicId: 36,
        modifiers: { pastaEnB: 16, presionJudicial: 10, impunidad: 16, reputacionMediatica: -14 },
        grantedFlags: ["JAQUEMATE_FONDOS_SALVADOS"]
      },
      rightChoice: {
        label: "Solicitar el embargo preventivo y la repatriación urgente de los 14 millones al fondo del decomiso",
        stampText: "EMBARGO URUGUAY",
        flavorQuote: "El botín del comisario regresa a España para indemnizar a las víctimas de los espionajes ilegales.",
        mechanicId: 14,
        modifiers: { pastaEnB: -16, presionJudicial: -18, impunidad: -12, reputacionMediatica: 20 },
        grantedFlags: ["JAQUEMATE_FONDOS_REPATRIADOS"]
      }
    },
    {
      id: "saga_jaquemate_10_juicio_primera_sesion",
      speaker: "El Comisario Jubilado en el Estrado",
      speakerRole: "Acusado Principal de la Macrocausa",
      sphere: "ORDEN_JUSTICIA",
      headline: "EL ESPECTÁCULO DEL BANQUILLO: 'SOY UN AGENTE ENCUBIERTO Y ME DEBEN MEDALLAS'",
      context: "Primera sesión del juicio oral de las piezas Iron, Land y Pintor. El comisario se sienta en el banquillo ataviado con boina, parche en el ojo y carpeta roja bajo el brazo. Ante las cámaras declara que todo era una operación del CNI para proteger a la Corona.",
      evidenceDocument: "Grabación en vídeo de la vista oral de la Audiencia Nacional transmitida en directo por el canal judicial.",
      weight: 3,
      requiredFlags: ["JAQUEMATE_ARCHIVOS_INCAUTADOS"],
      leftChoice: {
        label: "Permitir que use el estrado como tribuna de propaganda para sembrar sospechas sobre las altas instituciones",
        stampText: "CIRCO JUDICIAL",
        flavorQuote: "Cada minuto que habla desacredita a los ministros, a los jueces y al Estado entero: puro espectáculo.",
        mechanicId: 21,
        modifiers: { pastaEnB: 10, presionJudicial: 12, impunidad: 14, reputacionMediatica: -18 },
        grantedFlags: ["JAQUEMATE_CIRCO_ESTRADO"]
      },
      rightChoice: {
        label: "El presidente del tribunal le retira la palabra con contundencia y ciñe el interrogatorio a las pruebas periciales",
        stampText: "CORTE EN SECO",
        flavorQuote: "Aquí no juzgamos la historia de España, juzgamos si usted cobró sobornos por robar bases de datos confidenciales.",
        mechanicId: 38,
        modifiers: { pastaEnB: -12, presionJudicial: -18, impunidad: -16, reputacionMediatica: 18 },
        grantedFlags: ["JAQUEMATE_ESTRADO_CONTROLADO"]
      }
    },

    // === SUB-SAGA 2: LA PURGA DEL FISCAL STAMPA Y LA FISCALÍA GENERAL (10 Cartas) ===
    {
      id: "saga_jaquemate_11_fiscal_rebelde",
      speaker: "Ignacio Stampa",
      speakerRole: "Fiscal de la Fiscalía Especial Anticorrupción",
      sphere: "ORDEN_JUSTICIA",
      headline: "EL FISCAL INCÓMODO: DILIGENCIAS 96/2017 Y NEGATIVA A PACTAR CON LAS DEFENSAS",
      context: "El fiscal Stampa lidera junto a su compañero Serrano el sumario Tándem. Trabaja 14 horas al día en un despacho abarrotado de carpetas en la calle Manuel Cortina, rechazando cualquier sugerencia de archivar piezas que afecten al poder financiero y político.",
      evidenceDocument: "Diligencias de investigación preliminares con firma del fiscal rechazando reuniones privadas con los letrados defensores.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Proteger el trabajo del fiscal y otorgarle refuerzos policiales y periciales exclusivos",
        stampText: "BLINDAJE FISCAL",
        flavorQuote: "Un fiscal independiente es la peor pesadilla de las cloacas: hay que blindarle el despacho y el teléfono.",
        mechanicId: 38,
        modifiers: { pastaEnB: -14, presionJudicial: 22, impunidad: -20, reputacionMediatica: 18 },
        grantedFlags: ["JAQUEMATE_STAMPA_BLINDADO"]
      },
      rightChoice: {
        label: "Buscar excusas disciplinarias para retirarle del caso antes de que toque a la cúpula bancaria",
        stampText: "MANIOBRA INTERNA",
        flavorQuote: "Ese fiscal es demasiado rígido: si sigue tirando del hilo nos va a sentar a todos en el banquillo.",
        mechanicId: 19,
        modifiers: { pastaEnB: 16, presionJudicial: -18, impunidad: 20, reputacionMediatica: -16 },
        grantedFlags: ["JAQUEMATE_MANIOBRA_STAMPA"]
      }
    },
    {
      id: "saga_jaquemate_12_abogados_podemos_chat",
      speaker: "La Abogada Rebelde de la Acusación",
      speakerRole: "Letrada de la Acusación Popular",
      sphere: "ORDEN_JUSTICIA",
      headline: "EL CHAT FILTRADO: CONVERSACIONES DE ABOGADOS CONVERTIDAS EN ARMA ARROJADIZA",
      context: "Una abogada purgada de un partido político filtra capturas de pantalla de un grupo de mensajería interna. En ellas se comentan con tono informal las impresiones sobre las comparecencias judiciales del fiscal Stampa, insinuando favoritismo.",
      evidenceDocument: "Capturas de pantalla del chat de Telegram enviadas anónimamente a medios digitales afines a la defensa del comisario.",
      weight: 2,
      requiredFlags: ["JAQUEMATE_MANIOBRA_STAMPA"],
      leftChoice: {
        label: "Utilizar las capturas para montar una denuncia penal por revelación de secretos contra el fiscal",
        stampText: "QUERELLA TRAMPA",
        flavorQuote: "Convertimos una broma de chat en un escándalo de Estado: el fiscal pasa de acusador a sospechoso.",
        mechanicId: 16,
        modifiers: { pastaEnB: 12, presionJudicial: -14, impunidad: 16, reputacionMediatica: -18 },
        grantedFlags: ["JAQUEMATE_QUERELLA_STAMPAGATE"]
      },
      rightChoice: {
        label: "Archivar las capturas por ser comunicaciones privadas intrascendentes sin valor probatorio",
        stampText: "ARCHIVO PLANO",
        flavorQuote: "Los chismes de pasillo no tienen recorrido procesal: la fiscalía no persigue cotilleos de chat.",
        mechanicId: 38,
        modifiers: { pastaEnB: -8, presionJudicial: 12, impunidad: -10, reputacionMediatica: 14 },
        grantedFlags: ["JAQUEMATE_CHAT_ARCHIVADO"]
      }
    },
    {
      id: "saga_jaquemate_13_stampagate_campaña",
      speaker: "El Director del Digital de Exclusivas",
      speakerRole: "Operador Mediático de Cloacas",
      sphere: "POLITICA",
      headline: "EL 'STAMPAGATE': PORTADAS COORDINADAS INVENTANDO UN ROMANCE PROCESAL",
      context: "Tres periódicos digitales publican simultáneamente en portada titulares sobre una supuesta relación sentimental y connivencia delictiva entre el fiscal y la letrada de Podemos. Las defensas de los comisarios y banqueros piden su recusación inmediata.",
      evidenceDocument: "Dossier de prensa con 45 artículos digitales replicando idénticos párrafos sin contraste periodístico.",
      weight: 3,
      requiredFlags: ["JAQUEMATE_QUERELLA_STAMPAGATE"],
      leftChoice: {
        label: "Alimentar la campaña mediática para forzar a la Fiscalía General a apartar a Stampa de la causa",
        stampText: "PICADORA MEDIÁTICA",
        flavorQuote: "En la picadora de carne de la prensa no importa la verdad, importa destruir la reputación del fiscal.",
        mechanicId: 15,
        modifiers: { pastaEnB: 14, presionJudicial: -18, impunidad: 18, reputacionMediatica: -20 },
        grantedFlags: ["JAQUEMATE_CAMPANA_EXITOSA"]
      },
      rightChoice: {
        label: "Emitir un comunicado oficial de la Fiscalía General respaldando sin fisuras la probidad de su fiscal",
        stampText: "RESPALDO PÚBLICO",
        flavorQuote: "La institución protege a sus fiscales de las calumnias pagadas por los investigados.",
        mechanicId: 10,
        modifiers: { pastaEnB: -12, presionJudicial: 16, impunidad: -14, reputacionMediatica: 18 },
        grantedFlags: ["JAQUEMATE_RESPALDO_STAMPA"]
      }
    },
    {
      id: "saga_jaquemate_14_fiscalia_madrid_inspeccion",
      speaker: "La Teniente Fiscal de la Comunidad de Madrid",
      speakerRole: "Instructora de la Investigación Interna",
      sphere: "ORDEN_JUSTICIA",
      headline: "EL INFORME EN EL CAJÓN: LA FISCALÍA ARCHIVA EL CASO PERO OCULTA EL DICTAMEN",
      context: "La fiscal superior de Madrid concluye la investigación penal sobre Stampa determinando que no cometió delito alguno ni reveló secreto judicial. Sin embargo, desde la Fiscalía General se dan instrucciones de no notificar el archivo hasta después del Consejo Fiscal.",
      evidenceDocument: "Decreto de archivo de diligencias de investigación penal 82/2020 con fecha retenida y sin notificar al interesado.",
      weight: 3,
      requiredFlags: ["JAQUEMATE_CAMPANA_EXITOSA"],
      leftChoice: {
        label: "Guardar el decreto en el cajón para que el Consejo Fiscal vote sin saber que estaba absuelto",
        stampText: "CAJÓN OSCURO",
        flavorQuote: "Si el Consejo se entera de que está libre de culpa, le votan la plaza fija; hay que mantener la sombra.",
        mechanicId: 19,
        modifiers: { pastaEnB: 10, presionJudicial: -16, impunidad: 20, reputacionMediatica: -18 },
        grantedFlags: ["JAQUEMATE_INFORME_GUARDADO"]
      },
      rightChoice: {
        label: "Notificar el archivo inmediatamente a los vocales del Consejo y al propio fiscal investigado",
        stampText: "NOTIFICACIÓN LEGAL",
        flavorQuote: "Ocultar una resolución absolutoria a un compañero es una prevaricación intolerable en democracia.",
        mechanicId: 38,
        modifiers: { pastaEnB: -10, presionJudicial: 16, impunidad: -16, reputacionMediatica: 16 },
        grantedFlags: ["JAQUEMATE_ARCHIVO_NOTIFICADO"]
      }
    },
    {
      id: "saga_jaquemate_15_lola_delgado_consejo_fiscal",
      speaker: "Dolores 'Lola' Delgado",
      speakerRole: "Fiscal General del Estado",
      sphere: "POLITICA",
      headline: "EL CONSEJO FISCAL DE LA PURGA: STAMPA QUEDA SIN PLAZA EN ANTICORRUPCIÓN",
      context: "En el pleno del Consejo Fiscal, la fiscal general del Estado no propone la renovación de Ignacio Stampa en Anticorrupción a pesar de su hoja de servicios impecable. Las ocho plazas se reparten entre fiscales que no conocen la causa Villarejo.",
      evidenceDocument: "Acta de la sesión del Consejo Fiscal de 27 de octubre de 2020 con la exclusión formal de Ignacio Stampa.",
      weight: 3,
      requiredFlags: ["JAQUEMATE_INFORME_GUARDADO"],
      leftChoice: {
        label: "Consumar la expulsión de Stampa y mandarlo de vuelta a juzgados territoriales de Madrid",
        stampText: "PURGA CONSUMADA",
        flavorQuote: "El mensaje queda claro para toda la carrera: quien toque a las altas esferas acaba tramitando multas de tráfico.",
        mechanicId: 19,
        modifiers: { pastaEnB: 14, presionJudicial: -22, impunidad: 25, reputacionMediatica: -22 },
        grantedFlags: ["JAQUEMATE_STAMPA_EXPULSADO"]
      },
      rightChoice: {
        label: "Otorgarle la plaza en propiedad reconociendo su dedicación exclusiva a la mayor causa contra las cloacas",
        stampText: "PLAZA MERITADA",
        flavorQuote: "Los méritos se defienden en la fiscalía: quien destapó la corrupción de Boadilla merece terminar el juicio.",
        mechanicId: 38,
        modifiers: { pastaEnB: -14, presionJudicial: 20, impunidad: -18, reputacionMediatica: 20 },
        grantedFlags: ["JAQUEMATE_STAMPA_CONFIRMADO"]
      }
    },
    {
      id: "saga_jaquemate_16_despacho_vaciado_cajas",
      speaker: "El Ordenanza de la Fiscalía Anticorrupción",
      speakerRole: "Testigo del Desalojo de Despachos",
      sphere: "ORDEN_JUSTICIA",
      headline: "EL DESALOJO EN CALLE MANUEL CORTINA: SIETE CAJAS DE CARTÓN Y CIERRE DE PUERTA",
      context: "Stampa empaqueta sus efectos personales, sus códigos penales y sus notas manuscritas de cuatro años de investigación. Ningún alto cargo de la fiscalía baja a despedirle en el portal mientras los nuevos titulares revisan sus armarios.",
      evidenceDocument: "Acta de entrega de llaves del despacho número 12 y resguardo de devolución de credencial oficial.",
      weight: 2,
      requiredFlags: ["JAQUEMATE_STAMPA_EXPULSADO"],
      leftChoice: {
        label: "Celebrar en privado con los abogados de los banqueros la salida del fiscal incómodo",
        stampText: "BRINDIS DESPACHO",
        flavorQuote: "El león de Anticorrupción ha sido desalojado; ahora el juicio se negociará con guante de seda.",
        mechanicId: 23,
        modifiers: { pastaEnB: 16, presionJudicial: -16, impunidad: 20, reputacionMediatica: -16 },
        grantedFlags: ["JAQUEMATE_FIESTA_DEFENSAS"]
      },
      rightChoice: {
        label: "Los fiscales de sala redactan un manifiesto interno denunciando el atropello corporativo",
        stampText: "MANIFIESTO FISCAL",
        flavorQuote: "No permitiremos que la política dicte quién se sienta en los juicios de corrupción del Reino.",
        mechanicId: 10,
        modifiers: { pastaEnB: -8, presionJudicial: 14, impunidad: -12, reputacionMediatica: 16 },
        grantedFlags: ["JAQUEMATE_REBELION_INTERNA"]
      }
    },
    {
      id: "saga_jaquemate_17_querella_contra_fiscal_general",
      speaker: "El Letrado Defensor de Ignacio Stampa",
      speakerRole: "Abogado del Fiscal Purgado",
      sphere: "ORDEN_JUSTICIA",
      headline: "CONTRAGOLPE EN EL SUPREMO: QUERELLA POR DESVIACIÓN DE PODER Y PREVARICACIÓN",
      context: "Stampa no se pliega en silencio. Presenta demanda contencioso-administrativa ante la Sala Tercera del Tribunal Supremo exigiendo las actas secretas del Consejo Fiscal y los informes ocultados por la Secretaría Técnica.",
      evidenceDocument: "Demanda judicial de 120 páginas detallando paso a paso la maniobra para privarle de su destino laboral.",
      weight: 2,
      requiredFlags: ["JAQUEMATE_STAMPA_EXPULSADO"],
      leftChoice: {
        label: "Clasificar las actas del Consejo como secreto de Estado para no remitirlas al Supremo",
        stampText: "ACTAS SECRETAS",
        flavorQuote: "Bajo la ley de secretos oficiales no entra ni la Sala Tercera: las actas se quedan en el búnker.",
        mechanicId: 32,
        modifiers: { pastaEnB: 8, presionJudicial: -14, impunidad: 18, reputacionMediatica: -18 },
        grantedFlags: ["JAQUEMATE_ACTAS_BLINDADAS"]
      },
      rightChoice: {
        label: "Entregar los expedientes íntegros al Tribunal Supremo y acatar el control judicial de la legalidad",
        stampText: "TRANSPARENCIA TOTAL",
        flavorQuote: "En un Estado democrático hasta la máxima fiscal responde ante los tribunales de justicia.",
        mechanicId: 38,
        modifiers: { pastaEnB: -10, presionJudicial: 16, impunidad: -14, reputacionMediatica: 18 },
        grantedFlags: ["JAQUEMATE_ACTAS_ENTREGADAS"]
      }
    },
    {
      id: "saga_jaquemate_18_stampa_libro_desquite",
      speaker: "El Editor del Libro de Memorias",
      speakerRole: "Editor de Investigación Periodística",
      sphere: "POLITICA",
      headline: "EL TESTIMONIO IMPRESO: 'EL SALVAJE OESTE DE LA FISCALÍA GENERAL'",
      context: "El fiscal apartado publica su propio libro de memorias documentando la intrahistoria de la macrocausa Tándem, los almuerzos conspirativos y cómo los poderes fácticos se cobraron su cabeza por no aceptar órdenes de despacho.",
      evidenceDocument: "Ejemplar del libro publicado con facsímiles de correos electrónicos internos y anotaciones de sumario.",
      weight: 2,
      requiredFlags: ["JAQUEMATE_STAMPA_EXPULSADO"],
      leftChoice: {
        label: "Abrirle expediente sancionador por revelación de secretos y faltas graves contra el deber de reserva",
        stampText: "EXPEDIENTE MORDAZA",
        flavorQuote: "Quien viste toga no escribe libros contando las vergüenzas de la casa; sanción de suspensión inmediata.",
        mechanicId: 19,
        modifiers: { pastaEnB: 8, presionJudicial: -10, impunidad: 16, reputacionMediatica: -20 },
        grantedFlags: ["JAQUEMATE_EXPEDIENTE_MORDAZA"]
      },
      rightChoice: {
        label: "Permitir la venta libre del libro y comparecer en el Congreso para dar explicaciones sobre lo denunciado",
        stampText: "DEBATE PÚBLICO",
        flavorQuote: "La verdad incomoda pero sana las instituciones podridas: que todo el país lea cómo operan las cloacas.",
        mechanicId: 10,
        modifiers: { pastaEnB: -10, presionJudicial: 14, impunidad: -12, reputacionMediatica: 20 },
        grantedFlags: ["JAQUEMATE_LIBRO_TRIUNFANTE"]
      }
    },
    {
      id: "saga_jaquemate_19_presion_a_fiscales_sustitutos",
      speaker: "El Nuevo Fiscal Asignado a Tándem",
      speakerRole: "Sustituto de Anticorrupción",
      sphere: "ORDEN_JUSTICIA",
      headline: "LA CAUSA INABARCABLE: LOS NUEVOS FISCALES PIDEN UN AÑO PARA LEER 200 TOMOS",
      context: "Los fiscales recién llegados confiesan al tribunal que no pueden sostener el ritmo de acusación en sala frente a 40 letrados defensores de élite. Piden sucesivas prórrogas que conducen directamente a la prescripción de delitos menores.",
      evidenceDocument: "Escrito de solicitud de aplazamiento de las sesiones de juicio oral por falta material de estudio del sumario.",
      weight: 2,
      requiredFlags: ["JAQUEMATE_STAMPA_EXPULSADO"],
      leftChoice: {
        label: "Aceptar las prórrogas y dejar que la lentitud procesal alivie la presión penal sobre los acusados",
        stampText: "DILACIÓN PROCESAL",
        flavorQuote: "Diez meses de retraso y los delitos societarios prescriben sin que nadie tenga que entrar en prisión.",
        mechanicId: 18,
        modifiers: { pastaEnB: 14, presionJudicial: -20, impunidad: 22, reputacionMediatica: -16 },
        grantedFlags: ["JAQUEMATE_PRESCRIPCION_ACELERADA"]
      },
      rightChoice: {
        label: "Fijar un calendario estricto de vistas orales ininterrumpidas de mañana y tarde",
        stampText: "CALENDARIO FÉRREO",
        flavorQuote: "No habrá descansos para las defensas de postín: el juicio se celebra día a día hasta sentencia firme.",
        mechanicId: 38,
        modifiers: { pastaEnB: -12, presionJudicial: 18, impunidad: -16, reputacionMediatica: 18 },
        grantedFlags: ["JAQUEMATE_VISTAS_CONTINUAS"]
      }
    },
    {
      id: "saga_jaquemate_20_sentencia_vindicacion",
      speaker: "El Magistrado Ponente del Supremo",
      speakerRole: "Juez de lo Contencioso-Administrativo",
      sphere: "ORDEN_JUSTICIA",
      headline: "REVÉS AL MINISTERIO: EL SUPREMO ANULA LA DECISIÓN QUE PURGÓ AL FISCAL",
      context: "Años después, la Sala Tercera del Tribunal Supremo declara nulo el acuerdo de la Fiscalía General por apreciar 'falta de motivación y desviación' en la exclusión de Stampa. La sentencia llega tarde para el juicio pero limpia su expediente.",
      evidenceDocument: "Sentencia firme del Tribunal Supremo condenando en costas a la Fiscalía General del Estado.",
      weight: 3,
      requiredFlags: ["JAQUEMATE_ACTAS_ENTREGADAS"],
      leftChoice: {
        label: "Acusar al Supremo de injerencia conservadora en las competencias del poder ejecutivo",
        stampText: "CHOQUE PODERES",
        flavorQuote: "Los jueces togados quieren mandar sobre el gobierno; desoímos la resolución política del tribunal.",
        mechanicId: 21,
        modifiers: { pastaEnB: 10, presionJudicial: 14, impunidad: 14, reputacionMediatica: -18 },
        grantedFlags: ["JAQUEMATE_CHOQUE_TRIBUNALES"]
      },
      rightChoice: {
        label: "Acatar la sentencia con humildad y reincorporar al fiscal a su plaza de origen con honores",
        stampText: "RESTITUCIÓN PLENA",
        flavorQuote: "El triunfo de la ley sobre la arbitrariedad: la justicia tarda pero restituye la dignidad mancillada.",
        mechanicId: 38,
        modifiers: { pastaEnB: -14, presionJudicial: -18, impunidad: -18, reputacionMediatica: 22 },
        grantedFlags: ["JAQUEMATE_RESTITUCION_STAMPA"]
      }
    },

    // === SUB-SAGA 3: PROYECTO KING, BBVA Y FRANCISCO GONZÁLEZ (10 Cartas) ===
    {
      id: "saga_jaquemate_21_asalto_sacyr_al_bbva",
      speaker: "El Asesor Monclovita de Asuntos Económicos",
      speakerRole: "Estratega del Asalto Bancario",
      sphere: "EMPRESARIAL",
      headline: "OPERACIÓN SACYR: EL ASALTO DE MONCLOA PARA DERROCAR A FRANCISCO GONZÁLEZ",
      context: "A finales de 2004, una constructora aliada con el gobierno intenta comprar el 3% del BBVA para forzar la dimisión de su presidente. Francisco González reúne a su guardia de corps y ordena blindar la entidad por cualquier medio.",
      evidenceDocument: "Informe confidencial de la CNMV sobre toma de participaciones significativas en entidades financieras.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Contratar al comisario en activo Villarejo para que monte una operación clandestina de contraataque",
        stampText: "ORDEN FG",
        flavorQuote: "Contratamos al mejor fontanero de Interior: cueste lo que cueste, nadie nos arrebata el banco.",
        mechanicId: 22,
        modifiers: { pastaEnB: -18, presionJudicial: 10, impunidad: 16, reputacionMediatica: -12 },
        grantedFlags: ["JAQUEMATE_BBVA_CENYT_ACTIVO"]
      },
      rightChoice: {
        label: "Resolver la OPA hostil en la junta general de accionistas con el apoyo de fondos internacionales",
        stampText: "BATALLA JUNTA",
        flavorQuote: "Los bancos se defienden en Wall Street y en Fráncfort con dividendos, no con policías en excedencia.",
        mechanicId: 8,
        modifiers: { pastaEnB: 14, presionJudicial: -10, impunidad: 8, reputacionMediatica: 16 },
        grantedFlags: ["JAQUEMATE_BATALLA_ACCIONARIAL"]
      }
    },
    {
      id: "saga_jaquemate_22_contrato_cenyt_fg",
      speaker: "El Jefe de Seguridad Corporativa del BBVA",
      speakerRole: "Enlace Bancario con CENYT",
      sphere: "EMPRESARIAL",
      headline: "PROYECTO TRAMPA: 10 MILLONES DE EUROS EN FACTURAS CAMUFLADAS DE SEGURIDAD",
      context: "El banco y la firma de Villarejo firman contratos sucesivos para los proyectos 'Trapa', 'Fish' y 'King'. Las minutas de 500.000 euros trimestrales se aprueban por vía de urgencia eludiendo todos los filtros de compras de la entidad.",
      evidenceDocument: "Libro de facturas internas del BBVA con conceptos genéricos de 'análisis de inteligencia patrimonial'.",
      weight: 3,
      requiredFlags: ["JAQUEMATE_BBVA_CENYT_ACTIVO"],
      leftChoice: {
        label: "Validar las facturas opacas con la firma del consejero delegado y archivar los informes en caja fuerte",
        stampText: "FACTURA CIEGA",
        flavorQuote: "En la planta 22 no se hacen preguntas de detalle: se paga y se garantiza la continuidad del presidente.",
        mechanicId: 24,
        modifiers: { pastaEnB: 18, presionJudicial: 12, impunidad: 14, reputacionMediatica: -16 },
        grantedFlags: ["JAQUEMATE_FACTURAS_PAGADAS"]
      },
      rightChoice: {
        label: "Paralizar los pagos en Intervención General por falta de soporte documental y justificación real",
        stampText: "FRENO AUDITORÍA",
        flavorQuote: "Sin albarán de trabajo no sale un euro del banco; diez millones a una empresa de un policía es inviable.",
        mechanicId: 13,
        modifiers: { pastaEnB: -14, presionJudicial: -14, impunidad: -10, reputacionMediatica: 16 },
        grantedFlags: ["JAQUEMATE_FACTURAS_FRENADAS"]
      }
    },
    {
      id: "saga_jaquemate_23_pinchazo_masivo_llamadas",
      speaker: "El 'Hacker' Telefónico del Holding",
      speakerRole: "Especialista en Sabotaje de Redes",
      sphere: "EMPRESARIAL",
      headline: "15.000 LLAMADAS INTERCEPTADAS: ESPIONAJE A MINISTROS, EMPRESARIOS Y PERIODISTAS",
      context: "A través de contactos corruptos en las compañías de telecomunicaciones, CENYT obtiene las sábanas de llamadas completas de Rodrigo Rato, Pedro Solbes, Miguel Sebastián y los directores de los principales diarios económicos.",
      evidenceDocument: "Listados informáticos confidenciales con registro de fechas, horas y antenas repetidoras de ministros del gobierno.",
      weight: 3,
      requiredFlags: ["JAQUEMATE_BBVA_CENYT_ACTIVO"],
      leftChoice: {
        label: "Utilizar las sábanas para anticipar los movimientos del gobierno y chantajear a los miembros de la OPA",
        stampText: "SÁBANA TOTAL",
        flavorQuote: "Sabemos con quién habla el ministro antes de que cuelgue el auricular: el asalto a la presidencia está muerto.",
        mechanicId: 21,
        modifiers: { pastaEnB: 16, presionJudicial: 16, impunidad: 16, reputacionMediatica: -20 },
        grantedFlags: ["JAQUEMATE_SABANAS_USADAS"]
      },
      rightChoice: {
        label: "Destruir los listados telefónicos inmediatamente ante el riesgo de penas de prisión por espionaje masivo",
        stampText: "DESTRUCCIÓN SÁBANAS",
        flavorQuote: "Tener el registro de llamadas de un vicepresidente del gobierno es un billete directo a la cárcel de Soto del Real.",
        mechanicId: 38,
        modifiers: { pastaEnB: -12, presionJudicial: -16, impunidad: -12, reputacionMediatica: 14 },
        grantedFlags: ["JAQUEMATE_SABANAS_DESTRUIDAS"]
      }
    },
    {
      id: "saga_jaquemate_24_informe_trampa_asociados",
      speaker: "El Redactor de Informes de Intrusión",
      speakerRole: "Analista de Operaciones Encubiertas",
      sphere: "EMPRESARIAL",
      headline: "DOSIERES MANIPULADOS: IMPLICAR AL PRESIDENTE DE LA CONSTRUCTORA EN CUENTAS OPAVAS",
      context: "Para abortar la operación, el comisario elabora un dosier atribuyendo al líder de Sacyr cuentas secretas en Suiza y comisiones en la construcción de autopistas. El documento se remite de forma anónima a la Fiscalía Anticorrupción.",
      evidenceDocument: "Dosier 'Informe Trampa' encuadernado en piel sintética con membrete apócrifo de agencia de detectives suiza.",
      weight: 2,
      requiredFlags: ["JAQUEMATE_BBVA_CENYT_ACTIVO"],
      leftChoice: {
        label: "Filtrar el dosier apócrifo al periódico económico para desplomar la cotización de los rivales",
        stampText: "BOMBAZO BOLSA",
        flavorQuote: "En cuanto la portada llegue al quiosco, las acciones de la constructora caen un diez por ciento y retiran la oferta.",
        mechanicId: 15,
        modifiers: { pastaEnB: 18, presionJudicial: 12, impunidad: 12, reputacionMediatica: -18 },
        grantedFlags: ["JAQUEMATE_DOSIER_FILTRADO"]
      },
      rightChoice: {
        label: "Desestimar el informe por falsario y no usar información fraudulenta en la guerra corporativa",
        stampText: "RECHAZO FALSO",
        flavorQuote: "No arriesgamos la reputación centenaria del banco por un corta-pega chapucero de cloaca.",
        mechanicId: 8,
        modifiers: { pastaEnB: -10, presionJudicial: -12, impunidad: 8, reputacionMediatica: 16 },
        grantedFlags: ["JAQUEMATE_DOSIER_RECHAZADO"]
      }
    },
    {
      id: "saga_jaquemate_25_destruccion_discos_banco",
      speaker: "El Técnico de Mantenimiento de Servidores",
      speakerRole: "Especialista en Borrado Seguro",
      sphere: "EMPRESARIAL",
      headline: "OPERACIÓN BORRADO: TRITURADO DE DISCOS Y REFORMATEO EN LA PLANTA ALTA",
      context: "Al estallar las primeras detenciones policiales en 2017, el equipo de seguridad interna del banco retira todos los ordenadores portátiles asignados a los proyectos de CENYT y los traslada a un centro de destrucción física en las afueras de Madrid.",
      evidenceDocument: "Certificado de destrucción de soportes ópticos y magnéticos con peso de 140 kilos de chatarra informática triturada.",
      weight: 2,
      requiredFlags: ["JAQUEMATE_BBVA_CENYT_ACTIVO"],
      leftChoice: {
        label: "Triturar los servidores hasta convertirlos en virutas metálicas para que no quede ni un byte",
        stampText: "TRITURADORA",
        flavorQuote: "Sin discos duros no hay delito informático; que los peritos de la policía busquen en el basurero.",
        mechanicId: 3,
        modifiers: { pastaEnB: 12, presionJudicial: -18, impunidad: 20, reputacionMediatica: -22 },
        grantedFlags: ["JAQUEMATE_DISCOS_TRITURADOS"]
      },
      rightChoice: {
        label: "Custodiar los discos y ponerlos a disposición de la UDEF en un sobre lacrado",
        stampText: "SOBRE LACRADO",
        flavorQuote: "Destruir pruebas a sabiendas es un delito de encubrimiento agravado: entregamos todo al juez.",
        mechanicId: 38,
        modifiers: { pastaEnB: -14, presionJudicial: 16, impunidad: -14, reputacionMediatica: 18 },
        grantedFlags: ["JAQUEMATE_PRUEBAS_ENTREGADAS"]
      }
    },
    {
      id: "saga_jaquemate_26_declaracion_fg_audiencia",
      speaker: "Francisco González (FG)",
      speakerRole: "Expresidente del BBVA",
      sphere: "EMPRESARIAL",
      headline: "EL BANQUERO EN EL BANQUILLO: 'NUNCA OÍ HABLAR DE VILLAREJO NI DE CENYT'",
      context: "FG comparece como imputado en la Audiencia Nacional durante más de dos horas. Con semblante serio, niega haber ordenado espionajes y asegura que el banco jamás contrató detectives en activo con su consentimiento expreso.",
      evidenceDocument: "Acta de declaración del investigado ante el juez instructor y los fiscales Anticorrupción en la Sala de Vistas.",
      weight: 3,
      requiredFlags: ["JAQUEMATE_BBVA_CENYT_ACTIVO"],
      leftChoice: {
        label: "Mantener la línea de defensa de ignorancia absoluta y culpar al director de seguridad fallecido",
        stampText: "IGNORANCIA TOTAL",
        flavorQuote: "El presidente miraba los balances globales; los contratos de seguridad de tres al cuarto los firmaban abajo.",
        mechanicId: 37,
        modifiers: { pastaEnB: 14, presionJudicial: -16, impunidad: 22, reputacionMediatica: -18 },
        grantedFlags: ["JAQUEMATE_DEFENSA_IGNORANCIA"]
      },
      rightChoice: {
        label: "Reconocer que se autorizó una investigación y pedir perdón público a los afectados por los pinchazos",
        stampText: "PERDÓN PÚBLICO",
        flavorQuote: "Asumir la responsabilidad corporativa es la única vía para salvar el prestigio del banco en los mercados.",
        mechanicId: 10,
        modifiers: { pastaEnB: -16, presionJudicial: -12, impunidad: -16, reputacionMediatica: 20 },
        grantedFlags: ["JAQUEMATE_PERDON_BANQUERO"]
      }
    },
    {
      id: "saga_jaquemate_27_auditoria_pwc_forensic",
      speaker: "El Socio Director del Forensic de PwC",
      speakerRole: "Investigador Contable Independiente",
      sphere: "EMPRESARIAL",
      headline: "EL INFORME FORENSIC: 2,3 MILLONES DE ARCHIVOS AUDITADOS Y DECENAS DE FACTURAS",
      context: "El banco encarga una auditoría externa para lavar su imagen. El equipo pericial rastrea millones de correos electrónicos corporativos y localiza menciones directas al comisario bajo el alias 'El Churrero' en agendas secretas de la presidencia.",
      evidenceDocument: "Dictamen forensic de 800 páginas entregado en soporte USB encriptado a la Audiencia Nacional.",
      weight: 2,
      requiredFlags: [],
      leftChoice: {
        label: "Filtrar a la prensa solo las conclusiones exculpatorias que descargan al consejo de administración",
        stampText: "FILTRO FORENSIC",
        flavorQuote: "Publicamos que la auditora no halló pruebas directas contra FG y nos ahorramos el pánico bursátil.",
        mechanicId: 15,
        modifiers: { pastaEnB: 12, presionJudicial: -12, impunidad: 16, reputacionMediatica: -14 },
        grantedFlags: ["JAQUEMATE_FORENSIC_EDITADO"]
      },
      rightChoice: {
        label: "Entregar el informe íntegro sin expurgar a la fiscalía con todos los correos incriminatorios",
        stampText: "ENTREGA ÍNTEGRA",
        flavorQuote: "La auditoría no es un folleto publicitario: caiga quien caiga, los papeles van al juzgado.",
        mechanicId: 14,
        modifiers: { pastaEnB: -12, presionJudicial: 16, impunidad: -14, reputacionMediatica: 18 },
        grantedFlags: ["JAQUEMATE_FORENSIC_TRANSPARENTE"]
      }
    },
    {
      id: "saga_jaquemate_28_imputacion_entidad_bancaria",
      speaker: "El Magistrado Juez Central de Instrucción",
      speakerRole: "Titular del Juzgado Central 6",
      sphere: "EMPRESARIAL",
      headline: "EL BANCO IMPUTADO: COHECHO, CORRUPCIÓN EN LOS NEGOCIOS Y REVELACIÓN DE SECRETOS",
      context: "El juez dicta auto imputando formalmente a la persona jurídica del BBVA. La resolución señala que los controles internos del banco fallaron de forma clamorosa al pagar durante 13 años a un comisario de policía en activo.",
      evidenceDocument: "Auto judicial de imputación de persona jurídica con apercibimiento de multas millonarias e inhabilitación.",
      weight: 3,
      requiredFlags: ["JAQUEMATE_BBVA_CENYT_ACTIVO"],
      leftChoice: {
        label: "Presentar recurso de apelación alegando que el banco fue la verdadera víctima de una estafa",
        stampText: "RECURSO VÍCTIMA",
        flavorQuote: "El banco fue engañado por un policía corrupto que cobró minutas por servicios que no prestó: somos víctimas.",
        mechanicId: 17,
        modifiers: { pastaEnB: 14, presionJudicial: -14, impunidad: 18, reputacionMediatica: -16 },
        grantedFlags: ["JAQUEMATE_RECURSO_BANCO"]
      },
      rightChoice: {
        label: "Pactar una conformidad con la fiscalía asumiendo una multa pecuniaria y reforzando el compliance",
        stampText: "CONFORMIDAD COMPLIANCE",
        flavorQuote: "Pagamos la multa corporativa, cambiamos los estatutos y cerramos la herida penal de una vez por todas.",
        mechanicId: 38,
        modifiers: { pastaEnB: -18, presionJudicial: -18, impunidad: -10, reputacionMediatica: 16 },
        grantedFlags: ["JAQUEMATE_CONFORMIDAD_BANCO"]
      }
    },
    {
      id: "saga_jaquemate_29_dimision_honoraria_fg",
      speaker: "El Representante del Banco Central Europeo",
      speakerRole: "Supervisor de Fráncfort",
      sphere: "EMPRESARIAL",
      headline: "PRESIÓN DE FRÁNCFORT: EL BANQUERO DEBE ABANDONAR HASTA LA PRESIDENCIA DE HONOR",
      context: "El Banco Central Europeo traslada un ultimátum a la cúpula del banco: o Francisco González renuncia a su despacho oficial, secretaria y honores corporativos, o se revocará la idoneidad fit and proper del nuevo consejo directivo.",
      evidenceDocument: "Carta confidencial remitida desde Fráncfort con la exigencia de apartamiento total del expresidente.",
      weight: 2,
      requiredFlags: [],
      leftChoice: {
        label: "Forzar la dimisión irrevocable de FG y retirarle el retrato oficial de la galería noble",
        stampText: "RETIRO FULMINANTE",
        flavorQuote: "El BCE no admite medias tintas: adiós despacho, adiós privilegios y adiós presidencia honorífica.",
        mechanicId: 40,
        modifiers: { pastaEnB: -10, presionJudicial: -12, impunidad: -12, reputacionMediatica: 18 },
        grantedFlags: ["JAQUEMATE_FG_DESALOJADO"]
      },
      rightChoice: {
        label: "Mantenerle un despacho discreto en una sede secundaria de la fundación privada",
        stampText: "RETIRO DORADO",
        flavorQuote: "A un banquero que presidió veinte años no se le echa a la calle; se le coloca en la fundación benéfica.",
        mechanicId: 23,
        modifiers: { pastaEnB: 8, presionJudicial: 10, impunidad: 14, reputacionMediatica: -14 },
        grantedFlags: ["JAQUEMATE_FG_PROTEGIDO"]
      }
    },
    {
      id: "saga_jaquemate_30_acuerdo_extrajudicial_banca",
      speaker: "El Director de Asesoría Jurídica Contenciosa",
      speakerRole: "Negociador de Indemnizaciones",
      sphere: "EMPRESARIAL",
      headline: "FONDO DE CONTINGENCIA: CIEN MILLONES PARA ACALLAR A LAS VÍCTIMAS DEL ESPIONAJE",
      context: "Los empresarios y directivos espiados por CENYT preparan macrodemandas de daños civiles contra la entidad financiera. El banco propone acuerdos transaccionales confidenciales con cláusula de silencio absoluto para evitar juicios públicos.",
      evidenceDocument: "Contratos de transacción extrajudicial con pago por transferencia bancaria a cambio de retirar las querellas penales.",
      weight: 3,
      requiredFlags: ["JAQUEMATE_BBVA_CENYT_ACTIVO"],
      leftChoice: {
        label: "Firmar los acuerdos confidenciales y pagar las indemnizaciones con la cuenta de provisiones",
        stampText: "PAZ COMPRADA",
        flavorQuote: "El dinero tapa todas las heridas: dos millones a cada empresario espiado y retiramos las acusaciones del sumario.",
        mechanicId: 14,
        modifiers: { pastaEnB: -18, presionJudicial: -20, impunidad: 20, reputacionMediatica: 14 },
        grantedFlags: ["JAQUEMATE_INDEMNIZACIONES_PAGADAS"]
      },
      rightChoice: {
        label: "Rechazar indemnizar a los querellantes y litigar hasta el final alegando falta de daño patrimonial probado",
        stampText: "LITIGIO TOTAL",
        flavorQuote: "Que demuestren qué contratos perdieron por un pinchazo telefónico: no pagamos ni un euro en chantajes.",
        mechanicId: 17,
        modifiers: { pastaEnB: 12, presionJudicial: 14, impunidad: -14, reputacionMediatica: -16 },
        grantedFlags: ["JAQUEMATE_LITIGIO_MANTENIDO"]
      }
    },

    // === SUB-SAGA 4: OPERACIÓN KITCHEN Y EL ASALTO A LOS BÁRCENAS (10 Cartas) ===
    {
      id: "saga_jaquemate_31_orden_de_moncloa_kitchen",
      speaker: "El Secretario de Estado de Seguridad",
      speakerRole: "Coordinador de la Operación Kitchen",
      sphere: "POLITICA",
      headline: "ORDEN DE INTERIOR: 'HAY QUE ENCONTRAR LAS LIBRETAS DEL TESORERO ANTES QUE EL JUEZ'",
      context: "En el verano de 2013, con el extesorero en prisión preventiva, la cúpula de Interior diseña un operativo parapolicial bautizado como 'Operación Kitchen'. El objetivo prioritario es arrebatarle los discos duros y agendas con la caja B del partido.",
      evidenceDocument: "Notas de coordinación manuscritas con el alias 'Cocinero' asignado al chófer de la familia Bárcenas.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Dar luz verde al operativo parapolicial financiándolo con la partida opaca de fondos reservados",
        stampText: "LUZ VERDE KITCHEN",
        flavorQuote: "Si esos pendrives llegan a la UDEF caemos todos en cadena: recuperadlos como sea.",
        mechanicId: 33,
        modifiers: { pastaEnB: -16, presionJudicial: -18, impunidad: 22, reputacionMediatica: -18 },
        grantedFlags: ["JAQUEMATE_KITCHEN_ACTIVA"]
      },
      rightChoice: {
        label: "Rechazar el uso de fondos públicos para proteger al partido y dejar que la justicia investigue",
        stampText: "LEGALIDAD ESTRICTA",
        flavorQuote: "El ministerio de Interior no es una agencia de fontanería para borrar discos duros de dirigentes políticos.",
        mechanicId: 38,
        modifiers: { pastaEnB: 12, presionJudicial: 16, impunidad: -18, reputacionMediatica: 20 },
        grantedFlags: ["JAQUEMATE_KITCHEN_ABORTADA"]
      }
    },
    {
      id: "saga_jaquemate_32_captacion_chofer_sergio",
      speaker: "El Comisario Principal de la Operación",
      speakerRole: "Captador de Confidentes",
      sphere: "ORDEN_JUSTICIA",
      headline: "EL CHOFER 'COCINERO': DOS MIL EUROS AL MES EN MANO Y PLAZA EN LA POLICÍA NACIONAL",
      context: "Sergio Ríos, el conductor de confianza de la esposa del extesorero, es captado por el comisario Villarejo y mandos de Interior. A cambio de facilitar llaves, fotografiar agendas y clonar móviles de la familia, recibe 2.000 € mensuales de fondos reservados.",
      evidenceDocument: "Recibís firmados con alias por entregas mensuales de billetes y expediente de acceso exprés a la escala básica policial.",
      weight: 3,
      requiredFlags: ["JAQUEMATE_KITCHEN_ACTIVA"],
      leftChoice: {
        label: "Entregar los sobres mensuales al chófer y prometerle el ascenso a funcionario de carrera",
        stampText: "PAGO MENSUAL",
        flavorQuote: "El chófer nos da la vida: sabe dónde come la mujer, qué papeles guarda en el bolso y qué habla con su abogado.",
        mechanicId: 25,
        modifiers: { pastaEnB: -14, presionJudicial: -14, impunidad: 18, reputacionMediatica: -14 },
        grantedFlags: ["JAQUEMATE_CHOFER_PAGADO"]
      },
      rightChoice: {
        label: "Interrumpir los pagos irregulares y remitir el testimonio del chófer al juzgado de guardia",
        stampText: "CORTE PAGOS",
        flavorQuote: "Comprar a un testigo protegido con fondos reservados es un delito de cohecho de manual.",
        mechanicId: 38,
        modifiers: { pastaEnB: 10, presionJudicial: 14, impunidad: -14, reputacionMediatica: 16 },
        grantedFlags: ["JAQUEMATE_CHOFER_DESESTIMADO"]
      }
    },
    {
      id: "saga_jaquemate_33_microfonos_en_el_taller",
      speaker: "El Oficial de Escuchas Pasivas",
      speakerRole: "Operador de Balizas y Micrófonos",
      sphere: "ORDEN_JUSTICIA",
      headline: "MICRÓFONOS EN EL TALLER: ESCUCHAS ILEGALES EN EL LOCAL DE RESTAURACIÓN DE CUADROS",
      context: "Agentes encubiertos se cuelan de madrugada en el estudio de restauración de Rosalía Iglesias en el barrio de Salamanca para ocultar transmisores de audio en las molduras de los marcos de los lienzos.",
      evidenceDocument: "Grabaciones de audio con ruidos ambientales y conversaciones privadas de la esposa del tesorero con sus hijos.",
      weight: 2,
      requiredFlags: ["JAQUEMATE_KITCHEN_ACTIVA"],
      leftChoice: {
        label: "Mantener los micrófonos activos durante seis meses para monitorizar cualquier contacto judicial",
        stampText: "MICRÓFONO OCULTO",
        flavorQuote: "Escuchamos hasta el tintineo del café con leche: si menciona un pendrive mandamos al equipo de asalto.",
        mechanicId: 21,
        modifiers: { pastaEnB: -12, presionJudicial: 10, impunidad: 16, reputacionMediatica: -16 },
        grantedFlags: ["JAQUEMATE_MICROFONOS_ACTIVOS"]
      },
      rightChoice: {
        label: "Retirar los dispositivos inmediatamente por vulnerar el derecho a la intimidad sin orden judicial",
        stampText: "RETIRO BALIZA",
        flavorQuote: "Pinchazos domiciliarios sin mandamiento del juez instructor anulan todas las pruebas del sumario.",
        mechanicId: 38,
        modifiers: { pastaEnB: 8, presionJudicial: -12, impunidad: -10, reputacionMediatica: 14 },
        grantedFlags: ["JAQUEMATE_MICROFONOS_RETIRADOS"]
      }
    },
    {
      id: "saga_jaquemate_34_falso_cura_asalto",
      speaker: "El 'Falso Cura' de la Calle General Díaz Porlier",
      speakerRole: "Sicario Disfrazado de Sacerdote",
      sphere: "POLITICA",
      headline: "EL ASALTO DEL FALSO SACERDOTE: UN REVOLVER Y BRIDAS PARA ATAR A LA FAMILIA",
      context: "Enrique Olivares se presenta en el domicilio familiar de Bárcenas vestido con sotana y alzacuellos simulando ser asistente de prisiones. Una vez dentro, encañona a la esposa y al hijo del extesorero exigiendo 'los pendrives que tumban al gobierno'.",
      evidenceDocument: "Revólver británico British Bulldog calibre 44 y bridas de plástico incautadas en la vivienda tras el forcejeo.",
      weight: 3,
      requiredFlags: ["JAQUEMATE_KITCHEN_ACTIVA"],
      leftChoice: {
        label: "Asegurar que se trataba de un enajenado mental solitario sin relación alguna con el ministerio",
        stampText: "LOCO SOLITARIO",
        flavorQuote: "Decimos que el falso cura actuó por delirio místico personal y enterramos cualquier nexo con Interior.",
        mechanicId: 37,
        modifiers: { pastaEnB: 10, presionJudicial: -12, impunidad: 16, reputacionMediatica: -20 },
        grantedFlags: ["JAQUEMATE_FALSO_CURA_DESVINCULADO"]
      },
      rightChoice: {
        label: "Investigar a fondo los teléfonos del asaltante y descubrir quién le facilitó el plano de la casa",
        stampText: "INVESTIGACIÓN ASALTO",
        flavorQuote: "Un falso cura no sabe qué cajón abrir si un comisario de policía no le ha dibujado el plano antes.",
        mechanicId: 38,
        modifiers: { pastaEnB: -14, presionJudicial: 18, impunidad: -16, reputacionMediatica: 20 },
        grantedFlags: ["JAQUEMATE_CONEXION_CURA_DESTAPADA"]
      }
    },
    {
      id: "saga_jaquemate_35_chisco_martinez_mensajes",
      speaker: "Francisco Martínez ('Chisco')",
      speakerRole: "Exsecretario de Estado de Seguridad",
      sphere: "POLITICA",
      headline: "WHATSAPPS DE LA COMPLICIDAD: 'EL ASTURIANO ESTÁ AL TANTO DE TODO EL DISPOSITIVO'",
      context: "El secretario de Estado intercambia decenas de mensajes con el ministro y con comisarios: 'El chófer es un filón', 'Hemos copiado tres teléfonos', 'Operación Kitchen con éxito'. Cuando la causa avanza, el número dos se ve abandonado por su partido.",
      evidenceDocument: "Vaciado forense del teléfono móvil de Francisco Martínez con transcripción certificada de los chats con el ministro.",
      weight: 3,
      requiredFlags: ["JAQUEMATE_KITCHEN_ACTIVA"],
      leftChoice: {
        label: "Borrar la memoria del teléfono y alegar pérdida del terminal en un viaje al extranjero",
        stampText: "TERMINAL PERDIDO",
        flavorQuote: "El móvil cayó por la borda de un barco de recreo: ni WhatsApp ni pruebas que me sienten en el banquillo.",
        mechanicId: 3,
        modifiers: { pastaEnB: 12, presionJudicial: -14, impunidad: 18, reputacionMediatica: -16 },
        grantedFlags: ["JAQUEMATE_MOVIL_BORRADO"]
      },
      rightChoice: {
        label: "Guardar copias de todos los mensajes ante notario como póliza de seguro ante una imputación penal",
        stampText: "SEGURO NOTARIAL",
        flavorQuote: "Si pretenden que yo me coma el marrón en solitario, los mensajes del ministro van directos a la Audiencia.",
        mechanicId: 38,
        modifiers: { pastaEnB: -10, presionJudicial: 16, impunidad: -14, reputacionMediatica: 18 },
        grantedFlags: ["JAQUEMATE_MENSAJES_NOTARIADOS"]
      }
    },
    {
      id: "saga_jaquemate_36_protocolizacion_notarial_mensajes",
      speaker: "El Notario de la Calle Serrano",
      speakerRole: "Fedatario Público de Madrid",
      sphere: "ORDEN_JUSTICIA",
      headline: "ACTA NOTARIAL BOMBA: EL SECRETARIO DE ESTADO PROTOCOLIZA LAS ÓRDENES DEL MINISTRO",
      context: "Aterrado por la petición de cárcel de la Fiscalía, Francisco Martínez comparece en la notaría con su smartphone para levantar acta notarial de todos los mensajes recibidos del ministro de Interior sobre la Operación Kitchen.",
      evidenceDocument: "Escritura pública de protocolización de comunicaciones telemáticas sellada con fe pública notarial.",
      weight: 3,
      requiredFlags: ["JAQUEMATE_MENSAJES_NOTARIADOS"],
      leftChoice: {
        label: "Aportar el acta notarial al juez instructor para pedir la imputación inmediata del ministro",
        stampText: "ACTA AL JUEZ",
        flavorQuote: "La fe notarial es incontestable: las órdenes venían de arriba y el ministro no puede lavarse las manos.",
        mechanicId: 38,
        modifiers: { pastaEnB: -12, presionJudicial: 22, impunidad: -18, reputacionMediatica: 22 },
        grantedFlags: ["JAQUEMATE_MINISTRO_IMPUTADO"]
      },
      rightChoice: {
        label: "Guardar el acta en secreto y usarla solo para pactar con el partido un indulto futuro o un puesto en Europa",
        stampText: "CANJE POLÍTICO",
        flavorQuote: "El acta notarial en un cajón vale más que en el sumario: garantiza silencio a cambio de impunidad política.",
        mechanicId: 32,
        modifiers: { pastaEnB: 16, presionJudicial: -18, impunidad: 22, reputacionMediatica: -18 },
        grantedFlags: ["JAQUEMATE_PACTO_SILENCIO_KITCHEN"]
      }
    },
    {
      id: "saga_jaquemate_37_imputacion_cupula_interior",
      speaker: "El Magistrado Instructor de la Audiencia Nacional",
      speakerRole: "Juez Central de Instrucción",
      sphere: "ORDEN_JUSTICIA",
      headline: "AUTO HISTÓRICO: PROCESADA LA CÚPULA DE INTERIOR POR ORGANIZACIÓN CRIMINAL",
      context: "El juzgado dicta auto de procesamiento contra el exministro, su secretario de Estado, el director adjunto operativo (DAO) de la Policía y seis comisarios por malversación de fondos reservados y robo con fuerza continuado.",
      evidenceDocument: "Auto de apertura de juicio oral con peticiones de pena de más de quince años de prisión por pieza Kitchen.",
      weight: 3,
      requiredFlags: ["JAQUEMATE_MINISTRO_IMPUTADO"],
      leftChoice: {
        label: "Recurrir en apelación asegurando que los fondos reservados no admiten fiscalización judicial",
        stampText: "RECURSO RESERVADO",
        flavorQuote: "La seguridad del Estado es materia reservada; ningún juez civil tiene competencia para revisar esos gastos.",
        mechanicId: 33,
        modifiers: { pastaEnB: 12, presionJudicial: -14, impunidad: 16, reputacionMediatica: -18 },
        grantedFlags: ["JAQUEMATE_RECURSO_RESERVADO"]
      },
      rightChoice: {
        label: "Acatar el auto y preparar la defensa técnica basada en el cumplimiento del deber antiterrorista",
        stampText: "DEFENSA TÉCNICA",
        flavorQuote: "Defendemos en sala que se actuaba para neutralizar chantajes que ponían en riesgo la estabilidad del país.",
        mechanicId: 17,
        modifiers: { pastaEnB: -10, presionJudicial: 14, impunidad: -12, reputacionMediatica: 16 },
        grantedFlags: ["JAQUEMATE_JUICIO_KITCHEN_FIJADO"]
      }
    },
    {
      id: "saga_jaquemate_38_el_cura_y_el_asturiano",
      speaker: "El Transcriptor de Cintas Policiales",
      speakerRole: "Agente de la Unidad de Apoyo Operativo",
      sphere: "ORDEN_JUSTICIA",
      headline: "LOS ALIAS DE MONCLOA: 'EL CURA' Y 'EL ASTURIANO' EN LAS GRABACIONES SECRETAS",
      context: "En las cintas de Villarejo se descubren conversaciones en las que los jefes policiales hablan de coordinar Kitchen con 'el cura' (el ministro) y con 'el asturiano' o 'el barba' (el presidente Mariano Rajoy).",
      evidenceDocument: "Informe de transcripción pericial donde se identifican las voces de los altos dirigentes en grabaciones telefónicas.",
      weight: 2,
      requiredFlags: ["JAQUEMATE_KITCHEN_ACTIVA"],
      leftChoice: {
        label: "Afirmar que los apodos eran meras especulaciones coloquiales sin correspondencia real con los cargos",
        stampText: "APODO COLOQUIAL",
        flavorQuote: "Llamar 'el barba' a alguien en una conversación de bar no demuestra que el presidente supiera nada.",
        mechanicId: 21,
        modifiers: { pastaEnB: 10, presionJudicial: -12, impunidad: 18, reputacionMediatica: -16 },
        grantedFlags: ["JAQUEMATE_ALIAS_DESVIRTUADO"]
      },
      rightChoice: {
        label: "Citar a declarar como testigos a los expresidentes para esclarecer el alcance de los mandatos",
        stampText: "TESTIFICAL MONCLOA",
        flavorQuote: "Bajo juramento de decir verdad: que los expresidentes respondan si autorizaron espiar a su tesorero.",
        mechanicId: 38,
        modifiers: { pastaEnB: -12, presionJudicial: 18, impunidad: -16, reputacionMediatica: 20 },
        grantedFlags: ["JAQUEMATE_TESTIFICALES_ALTAS"]
      }
    },
    {
      id: "saga_jaquemate_39_fondos_reservados_recibos",
      speaker: "El Interventor de Gastos Reservados",
      speakerRole: "Custodio de las Cajas Fuertes del Ministerio",
      sphere: "POLITICA",
      headline: "LOS RECIBÍS DEL ESCÁNDALO: 53.000 EUROS ENTREGADOS AL CHÓFER EN SOBRES CIEGOS",
      context: "Aparecen 26 hojas de liquidación selladas por el DAO donde se detallan pagos de 2.000 euros en metálico al chófer y compras de material de espionaje con cargo a la partida 31L de gastos reservados del Estado.",
      evidenceDocument: "Hojas de recibí con firmas apócrifas y cotejo caligráfico de la Comisaría General de Policía Científica.",
      weight: 2,
      requiredFlags: ["JAQUEMATE_KITCHEN_ACTIVA"],
      leftChoice: {
        label: "Declarar los recibís como materia clasificada bajo la Ley de Secretos Oficiales de 1968",
        stampText: "SECRETO 1968",
        flavorQuote: "La ley franquista de secretos sigue viva: sellamos los recibos de los fondos y no los ve ni Dios.",
        mechanicId: 33,
        modifiers: { pastaEnB: 14, presionJudicial: -16, impunidad: 20, reputacionMediatica: -18 },
        grantedFlags: ["JAQUEMATE_RECIBOS_CLASIFICADOS"]
      },
      rightChoice: {
        label: "Desclasificar los documentos por acuerdo del Consejo de Ministros y remitirlos íntegros a la sala",
        stampText: "DESCLASIFICACIÓN",
        flavorQuote: "La democracia no ampara el desvío de dinero público para pagar sicarios contra extesoreros.",
        mechanicId: 10,
        modifiers: { pastaEnB: -14, presionJudicial: 20, impunidad: -18, reputacionMediatica: 20 },
        grantedFlags: ["JAQUEMATE_RECIBOS_DESCLASIFICADOS"]
      }
    },
    {
      id: "saga_jaquemate_40_comision_investigacion_kitchen",
      speaker: "El Presidente de la Comisión del Congreso",
      speakerRole: "Diputado Presidente de la Sesión",
      sphere: "POLITICA",
      headline: "EL TEATRO PARLAMENTARIO: CINCUENTA POLÍTICOS SE ACOGEN AL DERECHO A NO DECLARAR",
      context: "La comisión de investigación del Congreso sobre la Operación Kitchen se convierte en un desfile mudo. Ministros, secretarios y comisarios leen una declaración estándar de silencio asesorados por sus abogados de postín.",
      evidenceDocument: "Diario de Sesiones de la Comisión con páginas enteras de la fórmula: 'No voy a responder a ninguna pregunta'.",
      weight: 3,
      requiredFlags: ["JAQUEMATE_MINISTRO_IMPUTADO"],
      leftChoice: {
        label: "Mantener el pacto de silencio absoluto y aguantar el rapapolvo de los portavoces de la oposición",
        stampText: "SILENCIO PARLAMENTO",
        flavorQuote: "Diez minutos de vergüenza en el atril y te vas a casa sin dejar un solo titular para el fiscal.",
        mechanicId: 21,
        modifiers: { pastaEnB: 10, presionJudicial: -12, impunidad: 16, reputacionMediatica: -16 },
        grantedFlags: ["JAQUEMATE_PACTO_SILENCIO_EXITO"]
      },
      rightChoice: {
        label: "Romper la disciplina de silencio y revelar que las órdenes partieron de la propia sede nacional del partido",
        stampText: "CONFESIÓN PARLAMENTO",
        flavorQuote: "Que todo el país sepa quién dio las órdenes de enviar al falso cura a la casa de Bárcenas.",
        mechanicId: 10,
        modifiers: { pastaEnB: -16, presionJudicial: 22, impunidad: -20, reputacionMediatica: 24 },
        grantedFlags: ["JAQUEMATE_CONFESION_BOMBA"]
      }
    },

    // === SUB-SAGA 5: EL CASO DINA, EL ASADOR RIANXO Y ESTREMERA (10 Cartas) ===
    {
      id: "saga_jaquemate_41_robo_movil_alcorcon",
      speaker: "El Agente de Vigilancias Urbanas",
      speakerRole: "Especialista en Hurtos Selectivos",
      sphere: "ORDEN_JUSTICIA",
      headline: "EL ROBO EN EL CENTRO COMERCIAL: DESAPARECE EL TELÉFONO DE LA ASESORA POLÍTICA",
      context: "En noviembre de 2015, sustraen al descuido el teléfono móvil de Dina Bousselham en una tienda de ropa de Alcorcón. Horas después, una copia íntegra de la tarjeta de memoria llega al despacho de José Manuel Villarejo.",
      evidenceDocument: "Denuncia por hurto presentada en comisaría de Alcorcón y registro de conexión de la tarjeta MicroSD clonada.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Entregar la tarjeta copiada a directores de periódicos afines para publicar los chats privados",
        stampText: "ENTREGA PRENSA",
        flavorQuote: "Los pantallazos íntimos del líder político en portada destrozan su crédito moral en veinticuatro horas.",
        mechanicId: 15,
        modifiers: { pastaEnB: 12, presionJudicial: 14, impunidad: 12, reputacionMediatica: -18 },
        grantedFlags: ["JAQUEMATE_DINA_CHATS_PUBLICADOS"]
      },
      rightChoice: {
        label: "Custodiar el material bajo precinto policial y devolverlo inmediatamente a su legítima propietaria",
        stampText: "DEVOLUCIÓN ÍNTEGRA",
        flavorQuote: "La policía no custodia fotos íntimas de ciudadanas para traficar con ellas en tertulias de televisión.",
        mechanicId: 38,
        modifiers: { pastaEnB: -10, presionJudicial: -14, impunidad: -12, reputacionMediatica: 18 },
        grantedFlags: ["JAQUEMATE_DINA_DEVUELTA"]
      }
    },
    {
      id: "saga_jaquemate_42_tarjeta_clonada_prensa",
      speaker: "El Director del Digital Amarillista",
      speakerRole: "Editor de Primicias Escandalosas",
      sphere: "POLITICA",
      headline: "PANTALLAZOS EN PORTADA: CHATS ÍNTIMOS DE POLÍTICOS FILTRADOS DURANTE SEMANAS",
      context: "El periódico digital inicia una saga de publicaciones revelando conversaciones de grupos privados de mensajería donde se vierten comentarios soeces y ataques a periodistas. El escándalo salpica de lleno a la formación morada.",
      evidenceDocument: "Ediciones digitales con capturas de pantalla de chats con sello de agua del medio de comunicación.",
      weight: 2,
      requiredFlags: ["JAQUEMATE_DINA_CHATS_PUBLICADOS"],
      leftChoice: {
        label: "Continuar la dosificación diaria de mensajes para maximizar el desgaste electoral del partido rival",
        stampText: "DESGASTE DIARIO",
        flavorQuote: "Una captura cada mañana: la política convertida en el patio de vecinas más salvaje del Reino.",
        mechanicId: 15,
        modifiers: { pastaEnB: 14, presionJudicial: 10, impunidad: 12, reputacionMediatica: -16 },
        grantedFlags: ["JAQUEMATE_DOSIFICACION_CHATS"]
      },
      rightChoice: {
        label: "Retirar los artículos ante un requerimiento judicial por vulneración del derecho a la intimidad",
        stampText: "RETIRADA ARTÍCULOS",
        flavorQuote: "Publicar secretos robados acarrea penas de prisión que ninguna audiencia de clics compensa.",
        mechanicId: 16,
        modifiers: { pastaEnB: -8, presionJudicial: -12, impunidad: -8, reputacionMediatica: 14 },
        grantedFlags: ["JAQUEMATE_ARTICULOS_FRENADOS"]
      }
    },
    {
      id: "saga_jaquemate_43_tarjeta_quemada_microondas",
      speaker: "El Perito de Ciberseguridad de la Policía Científica",
      speakerRole: "Experto en Recuperación de Datos Físicos",
      sphere: "ORDEN_JUSTICIA",
      headline: "LA TARJETA ACHICHARRADA: DAÑOS FÍSICOS COMPATIBLES CON CALOR EXTREMO O MICROONDAS",
      context: "El tribunal recibe por fin la tarjeta MicroSD original. Al examinarla al microscopio electrónico, los peritos concluyen que el chip presenta fracturas térmicas internas que impiden leer su contenido: alguien intentó destruirla con calor.",
      evidenceDocument: "Dictamen pericial informático que certifica que la tarjeta de memoria fue sometida a temperaturas superiores a 150 grados.",
      weight: 2,
      requiredFlags: ["JAQUEMATE_DINA_CHATS_PUBLICADOS"],
      leftChoice: {
        label: "Acusar al líder político de destrucción intencionada de pruebas para ocultar su propio contenido",
        stampText: "IMPUTACIÓN RIVAL",
        flavorQuote: "El líder morado destruyó la tarjeta para tapar lo que había dentro: que pase de víctima a investigado.",
        mechanicId: 16,
        modifiers: { pastaEnB: 12, presionJudicial: -10, impunidad: 16, reputacionMediatica: -18 },
        grantedFlags: ["JAQUEMATE_DINA_LIDER_ACUSADO"]
      },
      rightChoice: {
        label: "Cerrar la controversia sobre la tarjeta y centrar la investigación en la mafia que perpetró el robo",
        stampText: "FOCO EN ROBO",
        flavorQuote: "Lo relevante no es si la tarjeta sufrió calor, sino qué comisario ordenó sustraerla y clonarla.",
        mechanicId: 38,
        modifiers: { pastaEnB: -10, presionJudicial: 14, impunidad: -12, reputacionMediatica: 16 },
        grantedFlags: ["JAQUEMATE_FOCO_EN_MAFIA"]
      }
    },
    {
      id: "saga_jaquemate_44_comida_asador_rianxo_2009",
      speaker: "El 'Maitre' del Asador Rianxo",
      speakerRole: "Custodio de Reservados Gastronómicos",
      sphere: "ORDEN_JUSTICIA",
      headline: "ALMUERZO DE 2009 EN EL RIANXO: CINCO HORAS DE COÑAC, TOGAS Y GRABADORA ACTIVADA",
      context: "Octubre de 2009. En el reservado del asador gallego comen el juez Baltasar Garzón, la fiscal Dolores Delgado, Villarejo y mandos policiales. Entre marisco y copas de albariño, el comisario activa su grabadora Olympus bajo la solapa de la chaqueta.",
      evidenceDocument: "Audio digital de 4 horas y 28 minutos con comentarios confidenciales sobre magistrados de la Audiencia Nacional.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Guardar el audio del almuerzo en la caja fuerte como el seguro de vida definitivo contra la fiscalía",
        stampText: "SEGURO RIANXO",
        flavorQuote: "Tengo a la futura ministra y al juez estrella grabados rajando de sus compañeros: soy intocable.",
        mechanicId: 21,
        modifiers: { pastaEnB: 14, presionJudicial: -20, impunidad: 24, reputacionMediatica: -16 },
        grantedFlags: ["JAQUEMATE_AUDIO_RIANXO_GUARDADO"]
      },
      rightChoice: {
        label: "Borrar la grabación reconociendo que registrar conversaciones de sobremesa dinamita las instituciones",
        stampText: "BORRADO ÉTICO",
        flavorQuote: "Traficar con charlas de vino y sobremesa es la degradación absoluta de la función policial.",
        mechanicId: 38,
        modifiers: { pastaEnB: -12, presionJudicial: 14, impunidad: -16, reputacionMediatica: 18 },
        grantedFlags: ["JAQUEMATE_RIANXO_BORRADO"]
      }
    },
    {
      id: "saga_jaquemate_45_audio_escandalo_rianxo",
      speaker: "El Portavoz del Medio Digital Exclusivo",
      speakerRole: "Difusor de Grabaciones Sensibles",
      sphere: "POLITICA",
      headline: "BOMBA MEDIÁTICA: SE FILTRA EL AUDIO DEL RIANXO CON LA MINISTRA DE JUSTICIA",
      context: "Diez años después, los audios del asador Rianxo salen a la luz pública. Se escucha a la fiscal comentar con desparpajo intimidades de otros jueces y descalificar a colegas de la judicatura. La oposición pide su dimisión fulminante.",
      evidenceDocument: "Archivo MP3 reproducido en streaming por portales de noticias con millones de descargas en pocas horas.",
      weight: 3,
      requiredFlags: ["JAQUEMATE_AUDIO_RIANXO_GUARDADO"],
      leftChoice: {
        label: "Negar que las grabaciones tengan trascendencia y atrincherarse en el cargo ministerial",
        stampText: "ATRINCHERAMIENTO",
        flavorQuote: "Unos audios cortados y manipulados por un chantajista en prisión no van a tumbar a una ministra.",
        mechanicId: 19,
        modifiers: { pastaEnB: 10, presionJudicial: -14, impunidad: 18, reputacionMediatica: -22 },
        grantedFlags: ["JAQUEMATE_MINISTRA_RESISTE"]
      },
      rightChoice: {
        label: "Presentar la dimisión inmediata para preservar la dignidad y neutralidad del Ministerio de Justicia",
        stampText: "DIMISIÓN DIGNIDAD",
        flavorQuote: "Cuando las cloacas alcanzan el despacho oficial, la única salida honorable es cruzar la puerta de salida.",
        mechanicId: 40,
        modifiers: { pastaEnB: -14, presionJudicial: -16, impunidad: -18, reputacionMediatica: 20 },
        grantedFlags: ["JAQUEMATE_MINISTRA_DIMITE"]
      }
    },
    {
      id: "saga_jaquemate_46_pieza_land_herederos",
      speaker: "La Viuda del Magnate Inmobiliario",
      speakerRole: "Cliente de la Urbanización La Finca",
      sphere: "EMPRESARIAL",
      headline: "PIEZA LAND: GUERRA DE HERENCIAS EN LA FINCA CON CONTRATACIÓN DE CLOACAS",
      context: "Tras la muerte del dueño de la urbanización más exclusiva de Madrid, una de las herederas contrata a CENYT por varios millones de euros para espiar las comunicaciones de su hermana y su madrastra y quedarse con la mayoría del patrimonio.",
      evidenceDocument: "Informes de seguimiento con fotografías de las herederas saliendo del colegio y grabaciones ilegales de abogados.",
      weight: 2,
      requiredFlags: [],
      leftChoice: {
        label: "Ejecutar el espionaje hasta doblegar a los herederos rivales en la partición notarial de la herencia",
        stampText: "HERENCIA FORZADA",
        flavorQuote: "Con los audios íntimos en la mano firman el reparto de bienes que nosotros les pongamos delante.",
        mechanicId: 26,
        modifiers: { pastaEnB: 18, presionJudicial: 14, impunidad: 12, reputacionMediatica: -16 },
        grantedFlags: ["JAQUEMATE_LAND_HERENCIA_GANADA"]
      },
      rightChoice: {
        label: "Rechazar el encargo y denunciar a la cliente por proposición para cometer delito de revelación de secretos",
        stampText: "RECHAZO ENCARGO",
        flavorQuote: "La policía no es una agencia de sicarios para dirimir quién se queda con los chalets de lujo de La Finca.",
        mechanicId: 38,
        modifiers: { pastaEnB: -14, presionJudicial: -14, impunidad: -10, reputacionMediatica: 16 },
        grantedFlags: ["JAQUEMATE_LAND_RECHAZADO"]
      }
    },
    {
      id: "saga_jaquemate_47_pieza_iron_bufete_patentes",
      speaker: "El Socio Director del Bufete de Patentes",
      speakerRole: "Promotor del Espionaje Corporativo",
      sphere: "EMPRESARIAL",
      headline: "PIEZA IRON: HACKEO MASIVO DE BASES DE DATOS A UN DESPACHO DE ABOGADOS RIVAL",
      context: "Un histórico bufete de propiedad industrial contrata a Villarejo para reventar el servidor de antiguos socios que abrieron su propia firma. El comisario soborna a funcionarios de la Agencia Tributaria para obtener el listado completo de clientes.",
      evidenceDocument: "Volcado de datos fiscales confidenciales con el sello de acceso del NIF del comisario en los registros de Hacienda.",
      weight: 2,
      requiredFlags: [],
      leftChoice: {
        label: "Abonar la minuta de 600.000 euros mediante sociedades tapadera y usar los datos robados",
        stampText: "MINUTA IRON",
        flavorQuote: "Arrasamos la cartera de clientes de los disidentes y el dinero se lava en una consultora de Boadilla.",
        mechanicId: 14,
        modifiers: { pastaEnB: 16, presionJudicial: 16, impunidad: -10, reputacionMediatica: -18 },
        grantedFlags: ["JAQUEMATE_IRON_DATOS_ROBADOS"]
      },
      rightChoice: {
        label: "Expulsar a los directivos que ordenaron el hackeo y someter el bufete a una auditoría ética independiente",
        stampText: "AUDITORÍA ÉTICA",
        flavorQuote: "La propiedad intelectual no se defiende robando datos tributarios con policías corruptos.",
        mechanicId: 13,
        modifiers: { pastaEnB: -14, presionJudicial: -16, impunidad: 8, reputacionMediatica: 18 },
        grantedFlags: ["JAQUEMATE_IRON_SANCIONADO"]
      }
    },
    {
      id: "saga_jaquemate_48_pieza_pintor_marido_presentadora",
      speaker: "El Empresario de la Costa del Sol",
      speakerRole: "Cliente de Extorsiones Judiciales",
      sphere: "EMPRESARIAL",
      headline: "PIEZA PINTOR: UN VÍDEO CON DROGAS PARA CHANTAJEAR A UN JUEZ DE MENORES",
      context: "Los hermanos Muñoz (uno de ellos cónyuge de una famosa presentadora de televisión) encargan a CENYT un vídeo comprometedor con consumo de estupefacientes para presionar a un juez y a un fiscal y evitar una condena por insolvencia punible.",
      evidenceDocument: "Grabación audiovisual en un reservado con audio del comisario ofreciendo 'acojonar al juez con el vídeo'.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Difundir fragmentos del vídeo en círculos judiciales para forzar la inhibición del magistrado",
        stampText: "VIDEO CHANTAJE",
        flavorQuote: "En cuanto el juez vea que tenemos la cinta en la recámara se declara incompetente y nos absuelven.",
        mechanicId: 21,
        modifiers: { pastaEnB: 14, presionJudicial: 18, impunidad: -14, reputacionMediatica: -22 },
        grantedFlags: ["JAQUEMATE_PINTOR_CHANTAJE"]
      },
      rightChoice: {
        label: "Denunciar la extorsión ante la Fiscalía Anticorrupción y proteger al magistrado amenazado",
        stampText: "AMPARO JUDICIAL",
        flavorQuote: "Nadie arrodilla a un juez de la democracia con vídeos de burdel y sustancias ilegales.",
        mechanicId: 38,
        modifiers: { pastaEnB: -12, presionJudicial: -18, impunidad: 12, reputacionMediatica: 20 },
        grantedFlags: ["JAQUEMATE_PINTOR_DENUNCIADO"]
      }
    },
    {
      id: "saga_jaquemate_49_oferta_venta_audios_estremera",
      speaker: "El Emisario del Banco Suizo",
      speakerRole: "Comprador de Archivos Clasificados",
      sphere: "EMPRESARIAL",
      headline: "TRÁFICO DE SECRETOS EN ESTREMERA: DIEZ MILLONES POR EL ARCHIVO CLASIFICADO",
      context: "Un intermediario financiero visita al comisario en la sala de vis a vis de la prisión. Ofrece diez millones de francos suizos depositados en Singapur si entrega los discos con las grabaciones que afectan a oligarcas del este y jeques árabes.",
      evidenceDocument: "Mandato fiduciario de compraventa de información económica confidencial intervenido por vigilantes de prisiones.",
      weight: 2,
      requiredFlags: ["JAQUEMATE_ARCHIVOS_INCAUTADOS"],
      leftChoice: {
        label: "Aceptar la venta clandestina y enviar las claves a través de un letrado de confianza",
        stampText: "VENTA SINGAPUR",
        flavorQuote: "Diez millones en Singapur garantizan una vejez de sultán si logramos la libertad provisional.",
        mechanicId: 36,
        modifiers: { pastaEnB: 20, presionJudicial: 14, impunidad: 14, reputacionMediatica: -16 },
        grantedFlags: ["JAQUEMATE_VENTA_SINGAPUR"]
      },
      rightChoice: {
        label: "Interceptar el correo, frustrar la venta y abrir un nuevo procesamiento por revelación de secretos de Estado",
        stampText: "VENTA FRUSTRADA",
        flavorQuote: "Ni un solo secreto nacional se monetiza en bancos extranjeros mientras el investigado esté entre rejas.",
        mechanicId: 38,
        modifiers: { pastaEnB: -16, presionJudicial: -20, impunidad: -16, reputacionMediatica: 20 },
        grantedFlags: ["JAQUEMATE_VENTA_BLOQUEADA"]
      }
    },
    {
      id: "saga_jaquemate_50_sentencia_primera_condena",
      speaker: "El Presidente del Tribunal Central",
      speakerRole: "Magistrado Presidente de Sala",
      sphere: "ORDEN_JUSTICIA",
      headline: "PRIMERA SENTENCIA HISTÓRICA: DIECINUEVE AÑOS DE PRISIÓN PARA EL COMISARIO",
      context: "La Sala de lo Penal dicta la primera sentencia firme de la macrocausa Tándem: 19 años de cárcel para José Manuel Villarejo por los delitos de revelación de secretos y falsedad en las piezas Iron y Pintor, aunque le absuelve del cohecho en Land.",
      evidenceDocument: "Sentencia número 25/2023 de la Sección Cuarta de la Sala de lo Penal de la Audiencia Nacional de 350 páginas.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Recurrir en casación al Tribunal Supremo para arañar rebajas de condena por dilaciones indebidas",
        stampText: "CASACIÓN SUPREMO",
        flavorQuote: "El partido no termina aquí: los recursos al Supremo duran años y la cárcel se puede esquivar con achaques.",
        mechanicId: 17,
        modifiers: { pastaEnB: 12, presionJudicial: -14, impunidad: 16, reputacionMediatica: -14 },
        grantedFlags: ["JAQUEMATE_CASACION_ABIERTA"]
      },
      rightChoice: {
        label: "Acatar la condena ejemplar que consagra el fin de la impunidad de las cloacas policiales",
        stampText: "CONDENA EJEMPLAR",
        flavorQuote: "Diecinueve años de prisión: el Estado de derecho demuestra que ningún comisario está por encima de la ley.",
        mechanicId: 38,
        modifiers: { pastaEnB: -18, presionJudicial: -22, impunidad: -22, reputacionMediatica: 24 },
        grantedFlags: ["JAQUEMATE_CONDENA_HISTORICA"]
      }
    }
  ]
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(lote06Data, null, 2), 'utf-8');
console.log(`Lote 06 generado con éxito: ${lote06Data.cards.length} cartas en ${OUTPUT_PATH}`);
