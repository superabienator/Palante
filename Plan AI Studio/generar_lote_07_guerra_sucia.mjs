import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.join(__dirname, 'lotes_generados', 'lote_07_guerra_sucia_total.json');

const lote07Data = {
  sagaName: "Guerra Sucia: Los Fondos Reservados, Intxaurrondo y las Cloacas del Estado",
  description: "Macro-saga monumental de 50 cartas extraídas directamente de la investigación documental y sumarial de 'Guerra sucia' (Manuel Cerdán). Narra con detalle la etapa del BVE y el CESID militar, la doctrina de 'ir, pegar y volver', el cuartel de Intxaurrondo y el Palacio de La Cumbre, los subcomisarios Amedo y Domínguez reclutando mercenarios en casinos de Biarritz, el secuestro de Segundo Marey, las sacas de billetes de la serie W del Banco de España, las pensiones suizas en Ginebra, el robo de microfichas del CESID por Perote, y la marcha histórica a la cárcel de Guadalajara seguida del indulto navideño.",
  cards: [
    // === SUB-SAGA 1: LOS MERCENARIOS DEL BVE Y EL HOTEL PINTOR (10 Cartas) ===
    {
      id: "saga_guerrapol_01_comando_biarritz",
      speaker: "El Mercenario Corso Polidori",
      speakerRole: "Sicario del Batallón Vasco Español",
      sphere: "ORDEN_JUSTICIA",
      headline: "ATENTADO EN BIARRITZ: EXPLOSIÓN BAJO EL MINI Y FUGA A NADO POR EL BIDASOA",
      context: "En el aparcamiento de Biarritz, la bomba adhesiva estalla prematuramente mientras la manipulan. Uno de los sicarios muere en el acto, el otro queda malherido y Polidori huye a la carrera, cruzando a nado el río Bidasoa de noche para pedir asilo en el cuartel de la Guardia Civil.",
      evidenceDocument: "Diligencias de la Gendarmería francesa con restos de explosivo plástico y matrícula del vehículo abandonado en la frontera.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Dar refugio al sicario en Madrid y trasladarlo discretamente en coche camuflado",
        stampText: "REFUGIO CLANDESTINO",
        flavorQuote: "El corso cumplió órdenes del Estado: que no pase ni una hora en comisaría ordinaria.",
        mechanicId: 38,
        modifiers: { pastaEnB: -14, presionJudicial: -18, impunidad: 22, reputacionMediatica: -16 },
        grantedFlags: ["GUERRA_CORSO_PROTEGIDO"]
      },
      rightChoice: {
        label: "Entregarlo inmediatamente a las autoridades francesas por la vía de la extradición",
        stampText: "ENTREGA FRANCIA",
        flavorQuote: "Quien cruza la frontera disparando y poniendo bombas responde ante la justicia gala.",
        mechanicId: 10,
        modifiers: { pastaEnB: 8, presionJudicial: 16, impunidad: -18, reputacionMediatica: 18 },
        grantedFlags: ["GUERRA_CORSO_ENTREGADO"]
      }
    },
    {
      id: "saga_guerrapol_02_cafeteria_california_goya",
      speaker: "El Empresario Intermediario",
      speakerRole: "Enlace Civil de los Servicios Secretos",
      sphere: "EMPRESARIAL",
      headline: "CITA EN CALLE GOYA: CAFETERÍA CALIFORNIA, HOTEL PINTOR Y PACTO DE SILENCIO",
      context: "El empresario Sánchez Pajares se reúne cara a cara con el sicario corso en una cafetería del barrio de Salamanca. El pistolero exige dinero para huir a la Costa Azul y confiesa que cometió el error de no rematar al superviviente.",
      evidenceDocument: "Notas manuscritas del intermediario relatando el encuentro con el sicario y la mediación de mandos militares.",
      weight: 2,
      requiredFlags: ["GUERRA_CORSO_PROTEGIDO"],
      leftChoice: {
        label: "Pagarle diez mil dólares en mano para que cruce a Italia y no vuelva a llamar jamás",
        stampText: "PAGO Y FUGA",
        flavorQuote: "Diez mil dólares en billetes usados compran el silencio de un sicario corso en la Riviera.",
        mechanicId: 5,
        modifiers: { pastaEnB: -12, presionJudicial: -14, impunidad: 16, reputacionMediatica: -12 },
        grantedFlags: ["GUERRA_CORSO_CALLADO"]
      },
      rightChoice: {
        label: "Romper lazos con el comando y pedir a los servicios de información que lo neutralicen",
        stampText: "RUPTURA TOTAL",
        flavorQuote: "El empresario no es un cajero automático de mercenarios: que se entienda con la guardia civil.",
        mechanicId: 38,
        modifiers: { pastaEnB: 10, presionJudicial: 12, impunidad: -12, reputacionMediatica: 14 },
        grantedFlags: ["GUERRA_CORSO_ABANDONADO"]
      }
    },
    {
      id: "saga_guerrapol_03_pasaporte_cascais_falso",
      speaker: "El Falsificador de Cascais",
      speakerRole: "Proveedor de Documentación en Lisboa",
      sphere: "ORDEN_JUSTICIA",
      headline: "IDENTIDAD PORTUGUESA: UN PASAPORTE EN BLANCO PARA SALVAR AL SICARIO PRESO",
      context: "Para evitar que la justicia francesa descubra la verdadera identidad del mercenario hospitalizado en Pau, los intermediarios compran en Portugal un lote con carnet de identidad, permiso de conducir y cartilla militar a nombre de un ciudadano luso inexistente.",
      evidenceDocument: "Pasaporte portugués auténtico expedido con fotografía del sicario y sello del consulado en Burdeos.",
      weight: 2,
      requiredFlags: [],
      leftChoice: {
        label: "Entregar el pasaporte falso al abogado defensor en Pau para burlar la euroorden",
        stampText: "COARTADA LUSA",
        flavorQuote: "Con papeles de Cascais en regla, ante el juez francés es solo un marinero portugués extraviado.",
        mechanicId: 35,
        modifiers: { pastaEnB: -10, presionJudicial: -16, impunidad: 18, reputacionMediatica: -14 },
        grantedFlags: ["GUERRA_PASAPORTE_LUSO_USADO"]
      },
      rightChoice: {
        label: "Rechazar la falsificación y ordenar al cónsul español que coopere con la fiscalía de Pau",
        stampText: "COOPERACIÓN PAU",
        flavorQuote: "No comprometeremos la diplomacia del Reino con pasaportes piratas fabricados en los muelles.",
        mechanicId: 10,
        modifiers: { pastaEnB: 6, presionJudicial: 14, impunidad: -14, reputacionMediatica: 16 },
        grantedFlags: ["GUERRA_DIPLOMACIA_LIMPIA"]
      }
    },
    {
      id: "saga_guerrapol_04_cassinello_ir_pegar_volver",
      speaker: "El Teniente Coronel Cassinello",
      speakerRole: "Jefe de los Servicios de Inteligencia Militar",
      sphere: "ORDEN_JUSTICIA",
      headline: "LA DOCTRINA 'IR, PEGAR Y VOLVER': SABOTAJES EN FRANCIA PARA PRESIONAR A PARÍS",
      context: "El mando del espionaje militar resume la estrategia secreta de la guerra sucia: incursiones rápidas en territorio francés para dinamitar vías férreas, postes telefónicos y librerías abertzales sin causar víctimas para forzar a Francia a extraditar etarras.",
      evidenceDocument: "Directiva de inteligencia militar clasificada de 1978 con el esquema operativo de hostigamiento transfronterizo.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Aprobar la directiva de hostigamiento y dotarla de explosivo militar sin numeración",
        stampText: "DOCTRINA CASSINELLO",
        flavorQuote: "Si en París no sienten la presión en sus propias calles, seguirán concediendo asilo a los pistoleros.",
        mechanicId: 38,
        modifiers: { pastaEnB: -16, presionJudicial: 14, impunidad: 20, reputacionMediatica: -20 },
        grantedFlags: ["GUERRA_DOCTRINA_ACTIVA"]
      },
      rightChoice: {
        label: "Vetar las acciones transfronterizas y concentrar la presión en la vía diplomática europea",
        stampText: "VETO MILITAR",
        flavorQuote: "Poner bombas al otro lado de los Pirineos es dinamitar nuestra credibilidad en la Comunidad Europea.",
        mechanicId: 40,
        modifiers: { pastaEnB: 10, presionJudicial: -12, impunidad: -16, reputacionMediatica: 18 },
        grantedFlags: ["GUERRA_VETO_ACCIONES"]
      }
    },
    {
      id: "saga_guerrapol_05_reclamacion_ocho_millones",
      speaker: "El Coronel Ayudante de Guzmán el Bueno",
      speakerRole: "Jefe de Gabinete de la Benemérita",
      sphere: "POLITICA",
      headline: "PORTAZO EN EL DESPACHO: 'LA GUARDIA CIVIL NO HA ORGANIZADO ESO Y NO PAGA'",
      context: "El empresario que adelantó ocho millones de pesetas para financiar los comandos acude a la Dirección General en Madrid. El alto mando militar le despide con frialdad: 'Yo nunca hablaré con usted. Nada tengo y nada le doy. Olvide este número de teléfono'.",
      evidenceDocument: "Cartas certificadas al director de la Guardia Civil reclamando la liquidación de gastos de guerra sucia devueltas sin abrir.",
      weight: 2,
      requiredFlags: [],
      leftChoice: {
        label: "Asustar al intermediario recordándole que en este mundo los testigos mueren ahogados",
        stampText: "AMENAZA DIRECTA",
        flavorQuote: "Que se dé por satisfecho con seguir vivo y no vuelva a poner un pie en la calle Guzmán el Bueno.",
        mechanicId: 21,
        modifiers: { pastaEnB: 8, presionJudicial: -14, impunidad: 18, reputacionMediatica: -16 },
        grantedFlags: ["GUERRA_INTERMEDIARIO_AMENAZADO"]
      },
      rightChoice: {
        label: "Reconocer discretamente la deuda y liquidarla mediante un contrato simulado de suministros",
        stampText: "LIQUIDACIÓN CONTRATO",
        flavorQuote: "Le adjudicamos el suministro de uniformes o neumáticos y enterramos la reclamación de una vez.",
        mechanicId: 24,
        modifiers: { pastaEnB: -12, presionJudicial: 10, impunidad: 12, reputacionMediatica: -10 },
        grantedFlags: ["GUERRA_DEUDA_COMPENSADA"]
      }
    },
    {
      id: "saga_guerrapol_06_mercaderes_armas_lisboa",
      speaker: "El Traficante de Armas del Puerto de Lisboa",
      speakerRole: "Proveedor Clandestino de Armamento",
      sphere: "EMPRESARIAL",
      headline: "ARMAS SIN MATRÍCULA: SUBFUSILES Y PISTOLAS DEL 9 LARGO EN LOS MUELLES LUSOS",
      context: "Agentes encubiertos compran en los muelles de Alcântara subfusiles Sterling y pistolas belgas con los números de serie borrados al ácido. El cargamento se transporta en dobles fondos de furgonetas hasta los pasos fronterizos de Salamanca.",
      evidenceDocument: "Albarán marítimo falsificado con transporte de maquinaria agrícola y cajas de madera selladas con plomo.",
      weight: 2,
      requiredFlags: [],
      leftChoice: {
        label: "Abonar el cargamento con divisas de fondos reservados y cruzar la aduana con credencial especial",
        stampText: "CRUCE ARMADO",
        flavorQuote: "El guardia de la aduana ve el pase oficial de Interior y levanta la barrera sin mirar el maletero.",
        mechanicId: 33,
        modifiers: { pastaEnB: -14, presionJudicial: 12, impunidad: 18, reputacionMediatica: -16 },
        grantedFlags: ["GUERRA_ARMAS_INTRODUCIDAS"]
      },
      rightChoice: {
        label: "Precintar el cargamento en la frontera portuguesa y abrir atestado por tráfico internacional de armas",
        stampText: "INTERCEPCIÓN ARMAS",
        flavorQuote: "No permitiremos que entren subfusiles piratas sin control balístico oficial en suelo español.",
        mechanicId: 38,
        modifiers: { pastaEnB: 8, presionJudicial: -16, impunidad: -14, reputacionMediatica: 18 },
        grantedFlags: ["GUERRA_ARMAS_INCAUTADAS"]
      }
    },
    {
      id: "saga_guerrapol_07_santuario_frances_biarritz",
      speaker: "El Prefecto de los Pirineos Atlánticos",
      speakerRole: "Autoridad Policial Francesa",
      sphere: "POLITICA",
      headline: "EL 'SANTUARIO FRANCÉS': PASEOS TRANQUILOS POR SAN JUAN DE LUZ Y COOPERACIÓN CERO",
      context: "A principios de los ochenta, los dirigentes abertzales viven plácidamente en hoteles y apartamentos de la costa vascofrancesa sin ser molestados por la gendarmería mientras no porten armas. Madrid clama contra la impunidad en la frontera.",
      evidenceDocument: "Notas diplomáticas reservadas del embajador en París protestando por la denegación reiterada de extradiciones.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Multiplicar los atentados de mercenarios en territorio francés para forzar a París a negociar",
        stampText: "TENSIÓN EN FRANCIA",
        flavorQuote: "Si en París ven que la guerra se traslada a sus calles turísticas, cambiarán de doctrina en seis meses.",
        mechanicId: 38,
        modifiers: { pastaEnB: -18, presionJudicial: 16, impunidad: 20, reputacionMediatica: -22 },
        grantedFlags: ["GUERRA_TENSION_FRANCIA"]
      },
      rightChoice: {
        label: "Supeditar los tratados comerciales y el ingreso en la CEE a la firma de convenios antiterroristas",
        stampText: "PRESIÓN DIPLOMÁTICA",
        flavorQuote: "El presidente galo firmará las extradiciones cuando vea en juego los aranceles agrícolas y el mercado común.",
        mechanicId: 40,
        modifiers: { pastaEnB: 12, presionJudicial: -14, impunidad: 10, reputacionMediatica: 20 },
        grantedFlags: ["GUERRA_DIPLOMACIA_CEE"]
      }
    },
    {
      id: "saga_guerrapol_08_piso_franco_hendaya",
      speaker: "El Operativo de Vigilancias Transfronterizas",
      speakerRole: "Agente del Gabinete de Escuchas",
      sphere: "ORDEN_JUSTICIA",
      headline: "EL MIRADOR DE HENDAYA: PRISMÁTICOS Y CÁMARAS SOBRE LA BAHÍA DE TXINGUDI",
      context: "Desde un apartamento alquilado en el paseo marítimo de Hendaya, agentes del servicio secreto fotografían a diario a los refugiados políticos que acuden a bares y cafeterías. Las fichas se envían a Madrid para autorizar los objetivos de los comandos.",
      evidenceDocument: "Carpetas de seguimiento con 200 fotografías en teleobjetivo y horarios de rutinas familiares de exiliados.",
      weight: 2,
      requiredFlags: [],
      leftChoice: {
        label: "Transmitir las coordenadas exactas a los mercenarios de los GAL para ejecutar la operación",
        stampText: "LUZ VERDE OBJETIVO",
        flavorQuote: "Tenemos la mesa del café, la hora de entrada y la matrícula del coche: objetivo confirmado.",
        mechanicId: 38,
        modifiers: { pastaEnB: -14, presionJudicial: 18, impunidad: 18, reputacionMediatica: -20 },
        grantedFlags: ["GUERRA_OBJETIVO_SENALADO"]
      },
      rightChoice: {
        label: "Usar la información exclusivamente para remitir órdenes de detención internacional a Interpol",
        stampText: "INTERPOL DIRECTO",
        flavorQuote: "La vigilancia policial sirve para que un juez firme una euroorden, no para señalar víctimas de sicarios.",
        mechanicId: 10,
        modifiers: { pastaEnB: 8, presionJudicial: -14, impunidad: -12, reputacionMediatica: 16 },
        grantedFlags: ["GUERRA_VIA_INTERPOL"]
      }
    },
    {
      id: "saga_guerrapol_09_general_saenz_santamaria",
      speaker: "El General Sáenz de Santamaría",
      speakerRole: "Delegado Especial del Gobierno en el Norte",
      sphere: "ORDEN_JUSTICIA",
      headline: "MANDO ÚNICO EN EL NORTE: 'EN LA LUCHA ANTITERRORISTA SE COQUETEA CON LA LÍNEA ROJA'",
      context: "El histórico general asume el mando supremo de la seguridad en el País Vasco. Conoce las cloacas como nadie y advierte en privado a los políticos de Madrid que los mercenarios descontrolados terminarán sentando a ministros en el banquillo.",
      evidenceDocument: "Transcripción de la comparecencia a puerta cerrada del general ante la Comisión de Secretos Oficiales del Congreso.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Desoír la advertencia y mantener el grifo de fondos reservados abierto para los comandos",
        stampText: "FONDO SIN FRENO",
        flavorQuote: "La eficacia se mide en resultados inmediatos: los escrúpulos jurídicos se dejan para tiempos de paz.",
        mechanicId: 33,
        modifiers: { pastaEnB: 16, presionJudicial: 14, impunidad: 18, reputacionMediatica: -18 },
        grantedFlags: ["GUERRA_FONDOS_DESATADOS"]
      },
      rightChoice: {
        label: "Hacer caso al general y desmantelar inmediatamente las estructuras paramilitares",
        stampText: "DESMANTELAMIENTO",
        flavorQuote: "Cortamos los pagos a mercenarios: si no lo hacemos hoy, mañana nos pedirán la cabeza en la Audiencia Nacional.",
        mechanicId: 38,
        modifiers: { pastaEnB: -16, presionJudicial: -18, impunidad: -14, reputacionMediatica: 20 },
        grantedFlags: ["GUERRA_COMANDOS_FRENADOS"]
      }
    },
    {
      id: "saga_guerrapol_10_archivo_muerte_polidori",
      speaker: "El Comisario de Brigada Regional",
      speakerRole: "Gestor de Leyendas y Coartadas",
      sphere: "ORDEN_JUSTICIA",
      headline: "LA LEYENDA DEL SICARIO AHOGADO: UN BULO POLICIAL PARA IMPONER LA OMERTÀ",
      context: "Para evitar que los intermediarios reclamen el dinero gastado, los mandos difunden el falso rumor de que el sicario Polidori ha aparecido ahogado en una playa de Alicante. El miedo congela las demandas y sella el pacto de silencio durante años.",
      evidenceDocument: "Nota interna de la brigada de información dando por fallecido ficticiamente al mercenario corso.",
      weight: 2,
      requiredFlags: ["GUERRA_INTERMEDIARIO_AMENAZADO"],
      leftChoice: {
        label: "Mantener el bulo y advertir a los testigos de que el mar Mediterráneo es muy profundo",
        stampText: "OMERTÀ COSTERA",
        flavorQuote: "En cuanto oyen la palabra ahogamiento, los empresarios se olvidan de los millones y se van a misa.",
        mechanicId: 27,
        modifiers: { pastaEnB: 10, presionJudicial: -12, impunidad: 20, reputacionMediatica: -14 },
        grantedFlags: ["GUERRA_OMERTA_IMPUESTA"]
      },
      rightChoice: {
        label: "Desmentir la muerte ficticia y abrir expediente a los mandos que inventaron la fábula",
        stampText: "EXPEDIENTE BULO",
        flavorQuote: "La policía no puede inventar falsos homicidios para aterrorizar a ciudadanos civiles en democracia.",
        mechanicId: 19,
        modifiers: { pastaEnB: -8, presionJudicial: 14, impunidad: -14, reputacionMediatica: 16 },
        grantedFlags: ["GUERRA_BULO_DESMONTADO"]
      }
    },

    // === SUB-SAGA 2: INTXAURRONDO, LA CUMBRE Y EL PALACIO PROHIBIDO (10 Cartas) ===
    {
      id: "saga_guerrapol_11_cuartel_intxaurrondo",
      speaker: "El Coronel Rodríguez Galindo",
      speakerRole: "Jefe de la 512ª Comandancia de Intxaurrondo",
      sphere: "ORDEN_JUSTICIA",
      headline: "EL BASTIÓN VERDE: INTXAURRONDO OPERA COMO UN ESTADO AUTÓNOMO EN GUIPÚZCOA",
      context: "El macroacuartelamiento donostiarra acoge a cientos de agentes que viven bajo una presión asfixiante de atentados diarios. El comandante Galindo impone una disciplina de hierro y una lealtad ciega que rechaza cualquier control judicial externo.",
      evidenceDocument: "Libro de órdenes del cuartel con registros de guardia sellados y visitas restringidas solo a mandos de confianza.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Dar carta blanca absoluta al comandante y blindar el cuartel ante inspecciones de jueces locales",
        stampText: "CARTA BLANCA",
        flavorQuote: "En primera línea de combate mandan los galones del cuartel, no los autos de los jueces provinciales.",
        mechanicId: 38,
        modifiers: { pastaEnB: 14, presionJudicial: 16, impunidad: 25, reputacionMediatica: -20 },
        grantedFlags: ["GUERRA_INTXAURRONDO_BLINDADO"]
      },
      rightChoice: {
        label: "Someter las dependencias a inspecciones judiciales periódicas y rotar a los mandos clave",
        stampText: "CONTROL JUDICIAL",
        flavorQuote: "Ningún cuartel militar puede convertirse en un territorio al margen de la Constitución y de las leyes.",
        mechanicId: 38,
        modifiers: { pastaEnB: -12, presionJudicial: -16, impunidad: -20, reputacionMediatica: 20 },
        grantedFlags: ["GUERRA_INTXAURRONDO_CONTROLADO"]
      }
    },
    {
      id: "saga_guerrapol_12_palacio_de_la_cumbre",
      speaker: "El Sargento de la Unidad Especial de Intxaurrondo",
      speakerRole: "Custodio del Palacio Prohibido",
      sphere: "ORDEN_JUSTICIA",
      headline: "EL PALACIO DE LA CUMBRE: SÓTANOS SECRETOS Y CUSTODIA AL MARGEN DE LOS JUZGADOS",
      context: "El palacete del Gobierno Civil en el paseo de La Cumbre se utiliza como centro clandestino de custodia de detenidos sin asistencia letrada ni comunicación judicial previa antes de su traslado a parajes remotos.",
      evidenceDocument: "Acta de la inspección ocular realizada diez años después por la Policía Judicial con muestras de pintura y suelo.",
      weight: 3,
      requiredFlags: ["GUERRA_INTXAURRONDO_BLINDADO"],
      leftChoice: {
        label: "Negar que el palacio se utilizara para custodias irregulares y ordenar pintar los sótanos",
        stampText: "CAPA DE PINTURA",
        flavorQuote: "Tres manos de cal blanca en las paredes del sótano y ningún perito encontrará restos de nada.",
        mechanicId: 3,
        modifiers: { pastaEnB: 10, presionJudicial: -16, impunidad: 22, reputacionMediatica: -18 },
        grantedFlags: ["GUERRA_CUMBRE_TAPADA"]
      },
      rightChoice: {
        label: "Permitir la entrada inmediata de los peritos del juzgado de guardia para levantar atestado",
        stampText: "PERITAJE JUDICIAL",
        flavorQuote: "Que los jueces entren y tomen muestras científicas: la verdad procesal debe esclarecerse.",
        mechanicId: 38,
        modifiers: { pastaEnB: -14, presionJudicial: 22, impunidad: -22, reputacionMediatica: 22 },
        grantedFlags: ["GUERRA_CUMBRE_DESTAPADA"]
      }
    },
    {
      id: "saga_guerrapol_13_fosa_cal_viva_alicante",
      speaker: "El Forense del Instituto Anatómico de Alicante",
      speakerRole: "Especialista en Antropología Forense",
      sphere: "ORDEN_JUSTICIA",
      headline: "LA FOSA DE ALICANTE: HUESOS EN CAL VIVA DESCUBIERTOS TRAS DIEZ AÑOS DE SILENCIO",
      context: "Un cazador encuentra restos óseos semienterrados en la fosa de Foya Caturla. Los cuerpos fueron cubiertos con 50 kilos de cal viva para acelerar la descomposición y evitar la identificación dental de los dos jóvenes vascos.",
      evidenceDocument: "Informe del forense Francisco Etxeberria que identifica las lesiones óseas y la compatibilidad de ADN.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Alegar que los restos son de enterramientos de la guerra civil para demorar la causa",
        stampText: "COARTADA HISTÓRICA",
        flavorQuote: "Decimos que la fosa es de 1936 y mandamos el expediente al juzgado militar territorial.",
        mechanicId: 34,
        modifiers: { pastaEnB: 10, presionJudicial: -14, impunidad: 18, reputacionMediatica: -20 },
        grantedFlags: ["GUERRA_FOSA_DEMORADA"]
      },
      rightChoice: {
        label: "Ordenar pruebas de ADN nuclear urgente e incoar el mayor sumario por terrorismo de Estado",
        stampText: "SUMARIO LASA ZABALA",
        flavorQuote: "La cal viva no borra la justicia: procesamos a los mandos responsables del enterramiento clandestino.",
        mechanicId: 38,
        modifiers: { pastaEnB: -16, presionJudicial: 24, impunidad: -24, reputacionMediatica: 24 },
        grantedFlags: ["GUERRA_SUMARIO_HISTORICO_ABIERTO"]
      }
    },
    {
      id: "saga_guerrapol_14_ascenso_a_general_galindo",
      speaker: "El Ministro de Defensa en el Consejo",
      speakerRole: "Promotor de Ascensos Militares",
      sphere: "POLITICA",
      headline: "ASCENSO DE LA DISCORDIA: EL GOBIERNO ASCIENDE A GENERAL AL CORONEL DE INTXAURRONDO",
      context: "Pese a que los juzgados ya investigan la guerra sucia, el Consejo de Ministros aprueba el ascenso a general de brigada de Rodríguez Galindo. El presidente defiende la condecoración en el Congreso ante las protestas de la oposición.",
      evidenceDocument: "Real Decreto de ascenso militar publicado en el Boletín Oficial del Estado con la firma del jefe del Estado.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Firmar el ascenso en el BOE para enviar un mensaje de respaldo inquebrantable a las fuerzas de seguridad",
        stampText: "FAJÍN DE GENERAL",
        flavorQuote: "El gobierno no abandona a sus generales en plena tormenta judicial: el fajín es de justicia.",
        mechanicId: 40,
        modifiers: { pastaEnB: 12, presionJudicial: 18, impunidad: 25, reputacionMediatica: -24 },
        grantedFlags: ["GUERRA_GALINDO_GENERAL"]
      },
      rightChoice: {
        label: "Paralizar el ascenso a la espera del resultado de las diligencias previas de la Audiencia",
        stampText: "ASCENSO PARALIZADO",
        flavorQuote: "No se nombra general a quien tiene sospechas de enterramientos clandestinos sobre la mesa del juez.",
        mechanicId: 10,
        modifiers: { pastaEnB: -10, presionJudicial: -14, impunidad: -18, reputacionMediatica: 20 },
        grantedFlags: ["GUERRA_ASCENSO_FRENADO"]
      }
    },
    {
      id: "saga_guerrapol_15_narcotrafico_informe_navajas",
      speaker: "El Fiscal Jefe de San Sebastián Luis Navajas",
      speakerRole: "Fiscal Instructor de la Trama de Narcotráfico",
      sphere: "ORDEN_JUSTICIA",
      headline: "EL INFORME NAVAJAS: VÍNCULOS SECRETOS ENTRE MANDOS POLICIALES Y EL CONTRABANDO",
      context: "El fiscal redacta un informe confidencial de 40 páginas donde se detalla cómo varios mandos del cuartel hacían la vista gorda ante la entrada de toneladas de hachís y cocaína a cambio de información sobre terrorismo y comisiones millonarias.",
      evidenceDocument: "Informe manuscrito reservado sellado y enviado en valija especial a la Fiscalía General del Estado.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Entregar el informe en mano al Fiscal General y exigir la apertura inmediata de juicio penal",
        stampText: "VALIJA ESPECIAL",
        flavorQuote: "Ni el uniforme de la Guardia Civil puede amparar el tráfico de drogas en las playas de Guipúzcoa.",
        mechanicId: 38,
        modifiers: { pastaEnB: -14, presionJudicial: 20, impunidad: -20, reputacionMediatica: 20 },
        grantedFlags: ["GUERRA_INFORME_NAVAJAS_CURSADO"]
      },
      rightChoice: {
        label: "Pactar el archivo del informe a cambio de un destino tranquilo en la Fiscalía del Tribunal Supremo",
        stampText: "ASCENSO FISCAL",
        flavorQuote: "Un informe contra un cuartel entero te condena al ostracismo; mejor ascender a Madrid y olvidar.",
        mechanicId: 19,
        modifiers: { pastaEnB: 14, presionJudicial: -18, impunidad: 22, reputacionMediatica: -16 },
        grantedFlags: ["GUERRA_NAVAJAS_ARCHIVADO"]
      }
    },
    {
      id: "saga_guerrapol_16_desaparicion_informe_fiscal",
      speaker: "El Custodio del Registro de la Fiscalía General",
      speakerRole: "Archivero Mayor de Togas",
      sphere: "ORDEN_JUSTICIA",
      headline: "LA CAJA FUERTE VACÍA: EL INFORME SOBRE EL CUARTEL DESAPARECE MISTERIOSAMENTE",
      context: "Cuando el juez instructor reclama el original del informe Navajas, la Secretaría Técnica responde que no consta ningún documento registrado. El informe de 40 páginas se ha esfumado literalmente de la sede de la calle Fortuny.",
      evidenceDocument: "Certificación negativa de la Secretaría Técnica afirmando que el documento jamás llegó al registro oficial.",
      weight: 2,
      requiredFlags: ["GUERRA_NAVAJAS_ARCHIVADO"],
      leftChoice: {
        label: "Dar por cerrado el incidente alegando que el informe fue solo un borrador informal de trabajo",
        stampText: "BORRADOR EXTRAVIADO",
        flavorQuote: "Sin papel oficial sellado no hay caso judicial; se declara el extravío involuntario y a otra cosa.",
        mechanicId: 19,
        modifiers: { pastaEnB: 12, presionJudicial: -16, impunidad: 24, reputacionMediatica: -18 },
        grantedFlags: ["GUERRA_EXTRAVIO_CONSUMADO"]
      },
      rightChoice: {
        label: "El fiscal Navajas aporta su copia personal con sello de registro y denuncia la sustracción",
        stampText: "COPIA NOTARIAL",
        flavorQuote: "Tenía una copia compulsada ante notario: los que robaron el informe van a declarar por infidelidad en la custodia.",
        mechanicId: 38,
        modifiers: { pastaEnB: -12, presionJudicial: 22, impunidad: -18, reputacionMediatica: 22 },
        grantedFlags: ["GUERRA_COPIA_APORTADA"]
      }
    },
    {
      id: "saga_guerrapol_17_medalla_al_merito_con_pension",
      speaker: "El Subsecretario del Interior",
      speakerRole: "Gestor de Honores y Condecoraciones",
      sphere: "POLITICA",
      headline: "CONDECORACIÓN BLINDADA: MEDALLA DE PLATA CON PENSIÓN VITALICIA DEL DIEZ POR CIENTO",
      context: "El ministerio aprueba en secreto la concesión de la Cruz de Plata al Mérito Policial con incremento de la pensión de jubilación a los mandos investigados en los GAL antes de que se dicte el auto de procesamiento.",
      evidenceDocument: "Orden ministerial reservada concediendo pensiones vitalicias anexas a condecoraciones policiales.",
      weight: 2,
      requiredFlags: [],
      leftChoice: {
        label: "Firmar la orden reservada para garantizar la lealtad y el silencio absoluto de los mandos",
        stampText: "PENSIÓN BLINDADA",
        flavorQuote: "Con un diez por ciento más en la pensión de por vida, nadie tiene la tentación de cantar en sala.",
        mechanicId: 24,
        modifiers: { pastaEnB: -10, presionJudicial: -14, impunidad: 20, reputacionMediatica: -16 },
        grantedFlags: ["GUERRA_MEDALLA_SILENCIO"]
      },
      rightChoice: {
        label: "Revocar las condecoraciones y suspender de funciones a cualquier mando con auto de procesamiento firme",
        stampText: "SUSPENSIÓN DECORO",
        flavorQuote: "No se pagan pensiones de honor a quienes tienen sobre sus espaldas causas por detención ilegal.",
        mechanicId: 38,
        modifiers: { pastaEnB: 8, presionJudicial: 16, impunidad: -18, reputacionMediatica: 18 },
        grantedFlags: ["GUERRA_MEDALLAS_RETIRADAS"]
      }
    },
    {
      id: "saga_guerrapol_18_juicio_audiencia_nacional_cumbre",
      speaker: "El Presidente de la Sección Primera de lo Penal",
      speakerRole: "Magistrado Presidente de la Sala",
      sphere: "ORDEN_JUSTICIA",
      headline: "EL GENERAL EN EL ESTRADO: 'JAMÁS PERMITÍ TORTURAS NI ASESINATOS EN MI CUARTEL'",
      context: "Sesión histórica en la Audiencia Nacional. Rodríguez Galindo, ataviado con traje de gala y fajín rojo, declara ante el tribunal negando cualquier relación con los GAL. Su testimonio contrasta con las declaraciones de sargentos y confidentes.",
      evidenceDocument: "Acta de juicio oral del sumario 1/95 con careos directos entre guardias civiles y mandos superiores.",
      weight: 3,
      requiredFlags: ["GUERRA_SUMARIO_HISTORICO_ABIERTO"],
      leftChoice: {
        label: "Respaldar la tesis de la defensa alegando falta de pruebas directas que vinculen al general con la fosa",
        stampText: "ABSOLUCIÓN DUDA",
        flavorQuote: "Sin confesión autoinculpatoria ni huellas en la fosa no se puede destruir la presunción de inocencia militar.",
        mechanicId: 17,
        modifiers: { pastaEnB: 12, presionJudicial: -18, impunidad: 24, reputacionMediatica: -22 },
        grantedFlags: ["GUERRA_ABSOLUCION_DEFENDIDA"]
      },
      rightChoice: {
        label: "Valorar la cadena de indicios concordantes y dictar la mayor condena de terrorismo de Estado",
        stampText: "PRISIÓN HISTÓRICA",
        flavorQuote: "Quien comandaba el bastión verde dirigía el aparato ejecutor: la condena es obligada por la ley.",
        mechanicId: 38,
        modifiers: { pastaEnB: -16, presionJudicial: 24, impunidad: -26, reputacionMediatica: 24 },
        grantedFlags: ["GUERRA_CONDENA_HISTORICA_EMITIDA"]
      }
    },
    {
      id: "saga_guerrapol_19_condena_75_anos",
      speaker: "El Secretario Judicial de la Sala",
      speakerRole: "Fedatario de la Audiencia Nacional",
      sphere: "ORDEN_JUSTICIA",
      headline: "FALLO HISTÓRICO: 75 AÑOS DE CÁRCEL PARA EL GENERAL RODRÍGUEZ GALINDO",
      context: "El tribunal condena a 75 años de prisión al general Rodríguez Galindo, al gobernador civil de Guipúzcoa Julen Elgorriaga y a tres mandos del cuartel por el secuestro y asesinato de Lasa y Zabala. El fallo sacude los cimientos de la seguridad del Estado.",
      evidenceDocument: "Sentencia de la Sala de lo Penal de la Audiencia Nacional ratificada íntegramente por el Tribunal Supremo.",
      weight: 3,
      requiredFlags: ["GUERRA_CONDENA_HISTORICA_EMITIDA"],
      leftChoice: {
        label: "Acusar a la sala de persecución política y movilizar a asociaciones militares en protesta",
        stampText: "REBELIÓN TOGAS",
        flavorQuote: "Se encarcela a los héroes que derrotaron al terrorismo mientras los asesinos celebran en la calle.",
        mechanicId: 21,
        modifiers: { pastaEnB: 10, presionJudicial: 16, impunidad: 16, reputacionMediatica: -20 },
        grantedFlags: ["GUERRA_PROTESTA_MILITAR"]
      },
      rightChoice: {
        label: "Acatar la sentencia con ejemplaridad institucional y ejecutar el ingreso en prisión militar",
        stampText: "ACATAMIENTO FIRME",
        flavorQuote: "Nadie está por encima de la ley: la democracia demostró que la guerra sucia se paga con la cárcel.",
        mechanicId: 38,
        modifiers: { pastaEnB: -14, presionJudicial: -20, impunidad: -24, reputacionMediatica: 24 },
        grantedFlags: ["GUERRA_INGRESO_PRISION_EJECUTADO"]
      }
    },
    {
      id: "saga_guerrapol_20_indulto_medico_arritmias",
      speaker: "El Juez Central de Vigilancia Penitenciaria",
      speakerRole: "Supervisor de Beneficios Penitenciarios",
      sphere: "ORDEN_JUSTICIA",
      headline: "EXCARCELACIÓN EXPRÉS: TERCER GRADO Y LIBERTAD POR ARRITMIA GRAVE TRAS CUATRO AÑOS",
      context: "Tras cumplir poco más de cuatro años de los 75 de condena, Instituciones Penitenciarias concede la libertad condicional al general por motivos de salud cardiológica. El condenado pasa a residir en su chalet de Zaragoza con libertad de movimientos.",
      evidenceDocument: "Informe de la Junta de Tratamiento Penitenciario avalando la aplicación del artículo 104.4 del reglamento.",
      weight: 3,
      requiredFlags: ["GUERRA_INGRESO_PRISION_EJECUTADO"],
      leftChoice: {
        label: "Autorizar la salida médica inmediata y evitar que el general fallezca bajo custodia estatal",
        stampText: "TERCER GRADO MÉDICO",
        flavorQuote: "Por razones humanitarias se extingue la prisión efectiva: un general enfermo debe estar con su familia.",
        mechanicId: 37,
        modifiers: { pastaEnB: 12, presionJudicial: -20, impunidad: 25, reputacionMediatica: -22 },
        grantedFlags: ["GUERRA_SALIDA_MEDICA_CONCEDIDA"]
      },
      rightChoice: {
        label: "Denegar el beneficio y exigir que sea tratado en el hospital penitenciario de la prisión",
        stampText: "HOSPITAL PENAL",
        flavorQuote: "La igualdad ante la ley rige para todos: 75 años de condena no se liquidan con cuatro años y un parte de arritmia.",
        mechanicId: 38,
        modifiers: { pastaEnB: -12, presionJudicial: 20, impunidad: -20, reputacionMediatica: 22 },
        grantedFlags: ["GUERRA_PRISION_EFECTIVA_MANTENIDA"]
      }
    },

    // === SUB-SAGA 3: AMEDO, DOMÍNGUEZ Y EL SECUESTRO DE SEGUNDO MAREY (10 Cartas) ===
    {
      id: "saga_guerrapol_21_ruleta_casino_biarritz",
      speaker: "El Subcomisario José Amedo",
      speakerRole: "Jefe de Grupo de Información de Bilbao",
      sphere: "ORDEN_JUSTICIA",
      headline: "RULETA EN BIARRITZ: LOS SUBCOMISARIOS GASTAN FONDOS RESERVADOS EN EL TAPETE",
      context: "José Amedo y Míchel Domínguez cruzan la frontera a diario en coches deportivos. Cenas de lujo, champán francés y fichas de 10.000 francos en el Casino de Biarritz pagadas con las partidas secretas que Interior destina a la lucha antiterrorista.",
      evidenceDocument: "Fichas de cambio del casino y facturas de hoteles de lujo en la costa vascofrancesa pagadas al contado.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Permitir los gastos alegando que son necesarios para infiltrarse en los círculos de la noche gala",
        stampText: "GASTO OPERATIVO",
        flavorQuote: "En la ruleta y los reservados se hacen los mejores confidentes; el ministerio asume las pérdidas de juego.",
        mechanicId: 23,
        modifiers: { pastaEnB: 14, presionJudicial: 12, impunidad: 16, reputacionMediatica: -16 },
        grantedFlags: ["GUERRA_AMEDO_CASINO_ACTIVO"]
      },
      rightChoice: {
        label: "Exigir auditoría y justificación ticket a ticket de cada peseta gastada en territorio francés",
        stampText: "FISCALIZACIÓN TOTAL",
        flavorQuote: "Los fondos reservados no están para financiar juergas de ruleta a dos policías de Bilbao.",
        mechanicId: 13,
        modifiers: { pastaEnB: -14, presionJudicial: -14, impunidad: -12, reputacionMediatica: 16 },
        grantedFlags: ["GUERRA_AMEDO_AUDITADO"]
      }
    },
    {
      id: "saga_guerrapol_22_reclutamiento_mercenarios_portugueses",
      speaker: "El Mercenario Portugués Talbi",
      speakerRole: "Reclutador del Hampa de Lisboa",
      sphere: "ORDEN_JUSTICIA",
      headline: "LOS MERCENARIOS DE LISBOA: MALEANTES Y CONDENADOS A SUELDO DE INTERIOR",
      context: "En el bar Anboto de Bilbao y en pensiones de Lisboa, Amedo contrata a pistoleros portugueses y delincuentes comunes. Les ofrece un millón de pesetas por secuestrar a un dirigente terrorista y cruzarlo por la frontera.",
      evidenceDocument: "Cheques de viaje cobrados en bancos de Bayona con la firma de los mercenarios contratados por los policías.",
      weight: 2,
      requiredFlags: ["GUERRA_AMEDO_CASINO_ACTIVO"],
      leftChoice: {
        label: "Entregar el anticipo en billetes franceses y ordenar la ejecución del secuestro de inmediato",
        stampText: "MERCENARIOS LUSOS",
        flavorQuote: "Un millón de pesetas y billete de vuelta a Lisboa: el trabajo sucio lo hacen los que no tienen patria.",
        mechanicId: 38,
        modifiers: { pastaEnB: -16, presionJudicial: 16, impunidad: 18, reputacionMediatica: -20 },
        grantedFlags: ["GUERRA_MERCENARIOS_LUSOS_ACTIVOS"]
      },
      rightChoice: {
        label: "Abortar la operación ante el riesgo evidente de descontrol de delincuentes comunes",
        stampText: "OPERACIÓN ABORTADA",
        flavorQuote: "Poner armas en manos de atracadores de bancos portugueses acabará en una carnicería judicial.",
        mechanicId: 10,
        modifiers: { pastaEnB: 10, presionJudicial: -14, impunidad: -10, reputacionMediatica: 16 },
        grantedFlags: ["GUERRA_MERCENARIOS_FRENADOS"]
      }
    },
    {
      id: "saga_guerrapol_23_secuestro_por_error_marey",
      speaker: "Segundo Marey",
      speakerRole: "Víctima Ciudadana del Secuestro",
      sphere: "POLITICA",
      headline: "EL ERROR TRÁGICO DE HENDAYA: SECUESTRADO UN ADMINISTRATIVO CONFUNDIDO CON UN CABECILLA",
      context: "Diciembre de 1983. Cuatro mercenarios portugueses asaltan en su casa de Hendaya a Segundo Marey, un administrativo hispanofrancés de 51 años sin vinculación política alguna. Lo confunden con un dirigente etarra por un error flagrante de foto.",
      evidenceDocument: "Denuncia de la familia Marey ante la policía francesa con descripción de los secuestradores hispanohablantes.",
      weight: 3,
      requiredFlags: ["GUERRA_MERCENARIOS_LUSOS_ACTIVOS"],
      leftChoice: {
        label: "Mantener el secuestro en la cabaña para negociar con el gobierno francés a pesar del error",
        stampText: "REHÉN POR ERROR",
        flavorQuote: "Ya que lo tenemos secuestrado, lo usamos para reivindicar la creación de los GAL en el comunicado.",
        mechanicId: 38,
        modifiers: { pastaEnB: -12, presionJudicial: 22, impunidad: -20, reputacionMediatica: -24 },
        grantedFlags: ["GUERRA_MAREY_MANTENIDO"]
      },
      rightChoice: {
        label: "Liberar al rehén de inmediato en un centro médico y pedir disculpas por vía diplomática",
        stampText: "LIBERACIÓN RÁPIDA",
        flavorQuote: "Tener a un ciudadano inocente atado en una cabaña dinamita cualquier justificación del Estado.",
        mechanicId: 10,
        modifiers: { pastaEnB: 8, presionJudicial: -16, impunidad: -14, reputacionMediatica: 18 },
        grantedFlags: ["GUERRA_MAREY_LIBERADO_PRONTO"]
      }
    },
    {
      id: "saga_guerrapol_24_cabaña_col_de_lizuniaga",
      speaker: "El Carcelero de Lizuniaga",
      speakerRole: "Custodio de la Cabaña del Monte",
      sphere: "ORDEN_JUSTICIA",
      headline: "LA CABAÑA DEL MONTE NAVARRO: DIEZ DÍAS A OSCURAS CON LOS OJOS VENDADOS",
      context: "Segundo Marey permanece encerrado diez días en una choza aislada en el puerto de Lizuniaga. Sus captores le mantienen encadenado con una capucha de lana en la cabeza mientras esperan órdenes de Madrid sobre si liberarlo o eliminarlo.",
      evidenceDocument: "Mantas militares, cadenas y casquillos de munición encontrados por la Guardia Civil en la borda abandonada.",
      weight: 2,
      requiredFlags: ["GUERRA_MAREY_MANTENIDO"],
      leftChoice: {
        label: "Consultar a la cúpula de Interior en Madrid qué hacer con el rehén inocente",
        stampText: "CONSULTA MONCLOA",
        flavorQuote: "En Madrid tienen que decidir si se suelta al administrativo o si nos lo quitamos de encima.",
        mechanicId: 21,
        modifiers: { pastaEnB: -10, presionJudicial: 18, impunidad: 16, reputacionMediatica: -20 },
        grantedFlags: ["GUERRA_CONSULTA_MADRID"]
      },
      rightChoice: {
        label: "Soltarlo inmediatamente por iniciativa propia antes de que la Gendarmería localice el monte",
        stampText: "SUELTA URGENTE",
        flavorQuote: "Aquí no matamos a un padre de familia por un error de novatos: le abrimos las esposas ya.",
        mechanicId: 38,
        modifiers: { pastaEnB: 6, presionJudicial: -14, impunidad: -12, reputacionMediatica: 16 },
        grantedFlags: ["GUERRA_SUELTA_ESPONTANEA"]
      }
    },
    {
      id: "saga_guerrapol_25_comunicado_fundacional_gal",
      speaker: "El Redactor del Comunicado de Guerra Sucia",
      speakerRole: "Portavoz Clandestino de los GAL",
      sphere: "POLITICA",
      headline: "NACEN LOS GAL: EL PRIMER COMUNICADO EXIGIENDO EL CANJE DE POLICÍAS",
      context: "Se emite a los medios franceses el primer comunicado formal con el membrete de los Grupos Antiterroristas de Liberación. Reivindican el secuestro de Marey y amenazan con matar a un refugiado por cada policía asesinado en España.",
      evidenceDocument: "Manifiesto mecanografiado en francés con el sello de los GAL enviado a la delegación de France Presse en Bayona.",
      weight: 3,
      requiredFlags: ["GUERRA_MAREY_MANTENIDO"],
      leftChoice: {
        label: "Distribuir el comunicado a todas las redacciones para sembrar el terror en el sur de Francia",
        stampText: "MANIFIESTO GAL",
        flavorQuote: "El comunicado fundacional deja claro que a partir de hoy el terrorismo se combate con sus mismas armas.",
        mechanicId: 15,
        modifiers: { pastaEnB: 12, presionJudicial: 20, impunidad: 18, reputacionMediatica: -25 },
        grantedFlags: ["GUERRA_COMUNICADO_PUBLICADO"]
      },
      rightChoice: {
        label: "Desautorizar las siglas y prohibir su difusión en los medios públicos estatales",
        stampText: "CENSURA SIGLAS",
        flavorQuote: "No daremos altavoz público a grupos paramilitares en la televisión ni en la radio nacional.",
        mechanicId: 10,
        modifiers: { pastaEnB: -10, presionJudicial: -12, impunidad: -14, reputacionMediatica: 18 },
        grantedFlags: ["GUERRA_SIGLAS_CENSURADAS"]
      }
    },
    {
      id: "saga_guerrapol_26_liberacion_en_la_frontera",
      speaker: "El Aduanero del Puesto de Dantxarinea",
      speakerRole: "Testigo de la Liberación",
      sphere: "ORDEN_JUSTICIA",
      headline: "LIBERADO EN LA PISTA FORESTAL: MAREY CAMINA DESCALZO Y DESORIENTADO HACIA LA FRANCIA",
      context: "Tras diez días de cautiverio, los secuestradores abandonan a Segundo Marey en una pista cercana al paso fronterizo de Dantxarinea. El rehén camina entre la niebla hasta el puesto de aduana, donde relata el infierno vivido a los gendarmes.",
      evidenceDocument: "Acta de comparecencia de Segundo Marey en la comisaría de Bayona con informe médico de lesiones y shock traumático.",
      weight: 2,
      requiredFlags: ["GUERRA_MAREY_MANTENIDO"],
      leftChoice: {
        label: "Facilitar atención médica discreta y ofrecer una indemnización confidencial a la familia",
        stampText: "INDEMNIZACIÓN CIEGA",
        flavorQuote: "Pagamos los gastos médicos y una renta para que el señor Marey no busque abogados en Madrid.",
        mechanicId: 5,
        modifiers: { pastaEnB: -16, presionJudicial: -14, impunidad: 16, reputacionMediatica: -12 },
        grantedFlags: ["GUERRA_MAREY_CALLADO"]
      },
      rightChoice: {
        label: "Abrir causa judicial de oficio por detención ilegal con interrogatorio a los policías de la frontera",
        stampText: "DILIGENCIAS DETENCIÓN",
        flavorQuote: "Un secuestro de diez días en suelo navarro se investiga hasta las últimas consecuencias penales.",
        mechanicId: 38,
        modifiers: { pastaEnB: 10, presionJudicial: 22, impunidad: -22, reputacionMediatica: 22 },
        grantedFlags: ["GUERRA_DILIGENCIAS_FRONTERA"]
      }
    },
    {
      id: "saga_guerrapol_27_detencion_de_los_subcomisarios",
      speaker: "El Juez Central Baltasar Garzón",
      speakerRole: "Magistrado del Juzgado Central 5",
      sphere: "ORDEN_JUSTICIA",
      headline: "GOLPE JUDICIAL EN BILBAO: EL JUEZ GARZÓN ORDENA ENCARCELAR A AMEDO Y DOMÍNGUEZ",
      context: "Julio de 1988. Tras recibir las pruebas de los cheques cobrados en Portugal y Francia, el joven juez Garzón dicta auto de prisión incondicional para los subcomisarios José Amedo y Míchel Domínguez. La cúpula política entra en pánico.",
      evidenceDocument: "Auto de prisión provisional incondicional por los delitos de pertenencia a banda armada y asesinato.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Presionar al Consejo del Poder Judicial para que aparte al magistrado por protagonismo",
        stampText: "PRESIONAR AL JUEZ",
        flavorQuote: "Ese juez de instrucción busca notoriedad política: hay que retirarle las competencias de terrorismo ya.",
        mechanicId: 19,
        modifiers: { pastaEnB: 12, presionJudicial: -18, impunidad: 22, reputacionMediatica: -20 },
        grantedFlags: ["GUERRA_PRESION_GARZON"]
      },
      rightChoice: {
        label: "Acatar la orden de ingreso en prisión y preparar la defensa letrada sin interferir en el juzgado",
        stampText: "INGRESO ACATADO",
        flavorQuote: "Los policías ingresan en prisión preventiva: la justicia debe actuar sin presiones ministeriales.",
        mechanicId: 38,
        modifiers: { pastaEnB: -14, presionJudicial: 24, impunidad: -24, reputacionMediatica: 24 },
        grantedFlags: ["GUERRA_AMEDO_PRESO"]
      }
    },
    {
      id: "saga_guerrapol_28_pensiones_suizas_esposas",
      speaker: "El Banquero Privado de Ginebra",
      speakerRole: "Gestor de Fondos Fiduciarios Helvéticos",
      sphere: "EMPRESARIAL",
      headline: "LA RUTA SUIZA: 200.000 PESETAS AL MES EN GINEBRA PARA LAS ESPOSAS DE LOS POLICÍAS",
      context: "Mientras los subcomisarios permanecen en la cárcel, altos cargos de Interior abren cuentas en la Banque Cantonale de Genève para ingresar rentas mensuales a sus cónyuges a través de testaferros para garantizar que no señalen a los jefes.",
      evidenceDocument: "Extractos bancarios en francos suizos intervenidos por comisión rogatoria con abonos periódicos ordenados desde Zurich.",
      weight: 3,
      requiredFlags: ["GUERRA_AMEDO_PRESO"],
      leftChoice: {
        label: "Mantener los ingresos puntuales en Ginebra para asegurar que el pacto de silencio no se rompa jamás",
        stampText: "PENSIÓN GINEBRA",
        flavorQuote: "Mientras sus familias vivan como reinas en Suiza, los policías se comerán los años de cárcel sin hablar.",
        mechanicId: 36,
        modifiers: { pastaEnB: -18, presionJudicial: -16, impunidad: 22, reputacionMediatica: -16 },
        grantedFlags: ["GUERRA_PENSIONES_SUIZAS_ACTIVAS"]
      },
      rightChoice: {
        label: "Cortar las transferencias en seco al considerar insostenible el delito de soborno a testigos",
        stampText: "CORTE SUIZA",
        flavorQuote: "Pagar pensiones en Suiza con dinero público es una bomba procesal que estallará en cuanto el juez pida comisiones rogatorias.",
        mechanicId: 14,
        modifiers: { pastaEnB: 14, presionJudicial: 22, impunidad: -22, reputacionMediatica: 20 },
        grantedFlags: ["GUERRA_PENSIONES_CORTADAS"]
      }
    },
    {
      id: "saga_guerrapol_29_confesion_amedo_garzon",
      speaker: "El Subcomisario en Confesión",
      speakerRole: "Acusado Converso ante el Juez",
      sphere: "ORDEN_JUSTICIA",
      headline: "LA VENGANZA DE AMEDO: 'VERA ME DABA LOS FAJOS EN SU DESPACHO Y BARRIONUEVO LO SABÍA'",
      context: "En 1994, tras cortarse las ayudas económicas y verse condenado a 108 años de cárcel, José Amedo pide declarar voluntariamente ante Garzón y desvela toda la estructura: la contratación de mercenarios, los pagos de Vera y la implicación ministerial.",
      evidenceDocument: "Declaración judicial de 80 páginas ante el Juzgado Central de Instrucción 5 con nombres, fechas y hoteles.",
      weight: 3,
      requiredFlags: ["GUERRA_PENSIONES_CORTADAS"],
      leftChoice: {
        label: "Descalificar a Amedo calificándolo de delincuente despechado que miente para lograr beneficios carcelarios",
        stampText: "TESTIGO MENTIROSO",
        flavorQuote: "La palabra de un convicto no vale nada frente a la honorabilidad intachable de un exministro.",
        mechanicId: 19,
        modifiers: { pastaEnB: 12, presionJudicial: -16, impunidad: 20, reputacionMediatica: -20 },
        grantedFlags: ["GUERRA_AMEDO_DESACREDITADO"]
      },
      rightChoice: {
        label: "Cotejar la confesión con las transferencias bancarias y dictar la imputación de la cúpula de Interior",
        stampText: "IMPUTACIÓN CÚPULA",
        flavorQuote: "Los papeles de los bancos suizos confirman palabra por palabra lo que declara el subcomisario: proceso abierto.",
        mechanicId: 38,
        modifiers: { pastaEnB: -16, presionJudicial: 26, impunidad: -26, reputacionMediatica: 24 },
        grantedFlags: ["GUERRA_CUPULA_IMPUTADA"]
      }
    },
    {
      id: "saga_guerrapol_30_libro_la_contra_amedo",
      speaker: "El Editor del Libro 'La Contra'",
      speakerRole: "Editor de Memorias Explosivas",
      sphere: "POLITICA",
      headline: "EL LIBRO DE LA VENGANZA: 'OBJETIVO PEÑARANDA' Y LAS COMISIONES DEL ANBOTO",
      context: "Amedo publica sus memorias en un libro superventas detallando las reuniones en el restaurante Anboto de Bilbao, las visitas a la sede de la Seguridad del Estado y los sobres con divisas entregados a mercenarios franceses.",
      evidenceDocument: "Libro 'La Contra' en escaparates de todas las librerías con reproducciones facsímiles de albaranes secretos.",
      weight: 2,
      requiredFlags: ["GUERRA_PENSIONES_CORTADAS"],
      leftChoice: {
        label: "Interponer querella por calumnias e injurias contra el expolicía y solicitar el secuestro de la edición",
        stampText: "SECUESTRO LIBRO",
        flavorQuote: "Nadie llena las librerías de basura sobre el gobierno sin responder por calumnias ante el juzgado.",
        mechanicId: 19,
        modifiers: { pastaEnB: 8, presionJudicial: -10, impunidad: 16, reputacionMediatica: -18 },
        grantedFlags: ["GUERRA_LIBRO_SECUESTRADO"]
      },
      rightChoice: {
        label: "Permitir la libre difusión del libro reconociendo el derecho a la información sobre el pasado de las cloacas",
        stampText: "DERECHO A LA VERDAD",
        flavorQuote: "La sociedad española tiene derecho a leer las confesiones de los actores directos de la guerra sucia.",
        mechanicId: 10,
        modifiers: { pastaEnB: -10, presionJudicial: 14, impunidad: -14, reputacionMediatica: 18 },
        grantedFlags: ["GUERRA_LIBRO_DIFUNDIDO"]
      }
    },

    // === SUB-SAGA 4: LOS MALETINES DE LA SERIE W Y EL MINISTERIO DEL INTERIOR (10 Cartas) ===
    {
      id: "saga_guerrapol_31_caja_fuerte_despacho_vera",
      speaker: "Rafael Vera",
      speakerRole: "Secretario de Estado para la Seguridad",
      sphere: "POLITICA",
      headline: "LA CAJA FUERTE DE CASTELLANA 5: HASTA 500 MILLONES DE PESETAS EN EFECTIVO",
      context: "En el despacho del número dos de Interior, tras un falso panel de caoba, se encuentra la caja de caudales del Estado. De allí salen cada mes maletines y sobres para operaciones especiales, gobernadores civiles y compras de armamento.",
      evidenceDocument: "Inventario de apertura de la caja fuerte levantado por la comisión judicial en el registro ministerial.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Distribuir los fondos sin exigir recibís para no dejar rastro documental que comprometa al gobierno",
        stampText: "ENTREGA CIEGA",
        flavorQuote: "En la lucha antiterrorista no se piden recibos con IVA: el dinero se gasta y aquí no ha pasado nada.",
        mechanicId: 33,
        modifiers: { pastaEnB: 18, presionJudicial: 14, impunidad: 22, reputacionMediatica: -20 },
        grantedFlags: ["GUERRA_ENTREGA_CIEGA_ACTIVA"]
      },
      rightChoice: {
        label: "Exigir justificantes contables sellados y someter los gastos reservados a fiscalización del Tribunal de Cuentas",
        stampText: "CONTROL TRIBUNAL",
        flavorQuote: "Hasta la última peseta del contribuyente debe tener justificación fiscal ante el parlamento.",
        mechanicId: 13,
        modifiers: { pastaEnB: -16, presionJudicial: -18, impunidad: -18, reputacionMediatica: 22 },
        grantedFlags: ["GUERRA_FONDOS_FISCALIZADOS"]
      }
    },
    {
      id: "saga_guerrapol_32_billetes_serie_w_banco_espana",
      speaker: "El Cajero Mayor del Banco de España",
      speakerRole: "Custodio de Billetes Especiales",
      sphere: "EMPRESARIAL",
      headline: "LOS BILLETES SERIE 'W': SACAS DE PAPEL MONEDA ESPECIAL DESTINADAS A INTERIOR",
      context: "El Banco de España emite series especiales de billetes de 10.000 pesetas identificadas con la letra 'W'. Sacas enteras se transportan en furgón blindado a la sede de Interior sin pasar por el circuito de compensación bancaria habitual.",
      evidenceDocument: "Acta de entrega de remesas del Banco de España con números de serie correlativos de la serie W.",
      weight: 3,
      requiredFlags: ["GUERRA_ENTREGA_CIEGA_ACTIVA"],
      leftChoice: {
        label: "Utilizar los billetes serie W para pagar a los mercenarios y los gastos de guerra sucia",
        stampText: "PAGO SERIE W",
        flavorQuote: "Los billetes serie W no existen para los inspectores de hacienda: dinero fresco y opaco para la fontanería.",
        mechanicId: 33,
        modifiers: { pastaEnB: 20, presionJudicial: 16, impunidad: 20, reputacionMediatica: -22 },
        grantedFlags: ["GUERRA_SERIE_W_CIRCULANDO"]
      },
      rightChoice: {
        label: "Prohibir la emisión de billetes opacos y unificar todas las partidas monetarias bajo control público",
        stampText: "FIN SERIE W",
        flavorQuote: "El Banco de España no puede emitir papel moneda pirata para operaciones clandestinas del gobierno.",
        mechanicId: 14,
        modifiers: { pastaEnB: -18, presionJudicial: -18, impunidad: -16, reputacionMediatica: 20 },
        grantedFlags: ["GUERRA_SERIE_W_CANCELADA"]
      }
    },
    {
      id: "saga_guerrapol_33_reparto_navideno_sobres",
      speaker: "El Gobernador Civil de Provincias",
      speakerRole: "Receptor del Aguinaldo de Interior",
      sphere: "POLITICA",
      headline: "EL AGUINALDO DE NAVIDAD: SOBRES DE HASTA UN MILLÓN PARA ALTOS CARGOS POLÍTICOS",
      context: "En el puente de diciembre, secretarios de Estado, directores generales y delegados del gobierno acuden en procesión al ministerio. Reciben sobres acolchados con billetes de la serie W como 'sobresueldo de representación y compensación de riesgo'.",
      evidenceDocument: "Libreta manuscrita de la secretaria de despacho con iniciales de los cargos y las cantidades entregadas en mano.",
      weight: 2,
      requiredFlags: ["GUERRA_SERIE_W_CIRCULANDO"],
      leftChoice: {
        label: "Cobrar el sobre de aguinaldo y justificarlo como complemento no contributivo de libre disposición",
        stampText: "SOBRE NAVIDAD",
        flavorQuote: "Todos los ministros cobran aguinaldo de fondos reservados; es la tradición no escrita de la casa.",
        mechanicId: 24,
        modifiers: { pastaEnB: 18, presionJudicial: 12, impunidad: 16, reputacionMediatica: -18 },
        grantedFlags: ["GUERRA_SOBRES_COBRADOS"]
      },
      rightChoice: {
        label: "Rechazar el sobre y denunciar la práctica ante la presidencia del Gobierno como malversación",
        stampText: "RECHAZO SOBRE",
        flavorQuote: "Los sueldos públicos están en el boletín oficial; cobrar sobres en negro es corrupción pura y dura.",
        mechanicId: 10,
        modifiers: { pastaEnB: -12, presionJudicial: -14, impunidad: -12, reputacionMediatica: 20 },
        grantedFlags: ["GUERRA_SOBRES_RECHAZADOS"]
      }
    },
    {
      id: "saga_guerrapol_34_furgon_banco_exterior",
      speaker: "El Jefe de Seguridad del Banco Exterior",
      speakerRole: "Custodio de Trasvases Financieros",
      sphere: "EMPRESARIAL",
      headline: "LA RUTA DE SAN JERÓNIMO: FURGONES BLINDADOS CARGADOS DE METÁLICO HACIA CASTELLANA",
      context: "A mediodía, un furgón de Prosegur recoge sacas de billetes en la sede central del Banco Exterior en Carrera de San Jerónimo y las deposita en el garaje subterráneo de Interior sin pasar por ningún registro de entrada aduanero ni fiscal.",
      evidenceDocument: "Hojas de ruta de los furgones de seguridad con paradas registradas en el garaje ministerial.",
      weight: 2,
      requiredFlags: [],
      leftChoice: {
        label: "Continuar el puente financiero semanal entre la banca pública y el ministerio de seguridad",
        stampText: "PUENTE FINANCIERO",
        flavorQuote: "La liquidez del Estado para operaciones especiales no se detiene por minucias contables.",
        mechanicId: 33,
        modifiers: { pastaEnB: 16, presionJudicial: 10, impunidad: 18, reputacionMediatica: -16 },
        grantedFlags: ["GUERRA_PUENTE_BANCA_ACTIVO"]
      },
      rightChoice: {
        label: "Exigir que todas las transferencias interministeriales se realicen por vía electrónica trazable",
        stampText: "TRAZABILIDAD BANCARIA",
        flavorQuote: "Se acabaron las sacas de billetes en furgones: transferencias del Banco de España con firma digital.",
        mechanicId: 14,
        modifiers: { pastaEnB: -14, presionJudicial: -16, impunidad: -14, reputacionMediatica: 18 },
        grantedFlags: ["GUERRA_BANCA_TRAZADA"]
      }
    },
    {
      id: "saga_guerrapol_35_compra_silencios_politicos",
      speaker: "El Exdirector General de la Policía",
      speakerRole: "Custodio Retirado con Memorias",
      sphere: "POLITICA",
      headline: "CIEN MILLONES POR CALLAR: FONDOS RESERVADOS PARA FRENAR LIBROS DE MEMORIAS",
      context: "Un exmando de Interior amenaza con publicar un manuscrito detallando todas las órdenes de la guerra sucia si no se le indemniza por los servicios prestados. Desde la secretaría de Estado se le entregan 100 millones de pesetas en billetes usados.",
      evidenceDocument: "Recibo manuscrito con la entrega fraccionada en cuatro maletines a cambio de entregar las cintas originales.",
      weight: 2,
      requiredFlags: ["GUERRA_ENTREGA_CIEGA_ACTIVA"],
      leftChoice: {
        label: "Pagar los cien millones y destruir el manuscrito en la caldera de calefacción del ministerio",
        stampText: "COMPRA SILENCIO",
        flavorQuote: "Cien millones es calderilla comparado con el daño que haría ese libro en plena campaña electoral.",
        mechanicId: 21,
        modifiers: { pastaEnB: -18, presionJudicial: -18, impunidad: 22, reputacionMediatica: 12 },
        grantedFlags: ["GUERRA_SILENCIO_COMPRADO"]
      },
      rightChoice: {
        label: "Rechazar el chantaje y querellarse contra el exmando por revelación de secretos oficiales",
        stampText: "QUERELLA CHANTAJE",
        flavorQuote: "El Estado no compra el silencio de sus antiguos funcionarios con dinero público de la seguridad.",
        mechanicId: 38,
        modifiers: { pastaEnB: 12, presionJudicial: 16, impunidad: -16, reputacionMediatica: 18 },
        grantedFlags: ["GUERRA_CHANTAJE_RECHAZADO"]
      }
    },
    {
      id: "saga_guerrapol_36_chalet_alpedrete_reformas",
      speaker: "El Contratista de Obras Privadas",
      speakerRole: "Constructor de Chalets Ministeriales",
      sphere: "EMPRESARIAL",
      headline: "LA PISCINA DE FONDOS RESERVADOS: CHALETS EN LA SIERRA PAGADOS CON DINERO DE SEGURIDAD",
      context: "La UCO descubre que cientos de millones de pesetas de fondos reservados acabaron financiando la compra y reforma de chalets de lujo en Alpedrete y fincas rústicas en Navacerrada para el disfrute personal de los secretarios de Estado.",
      evidenceDocument: "Facturas de mármoles, pistas de tenis y piscinas climatizadas abonadas en efectivo de billetes serie W.",
      weight: 2,
      requiredFlags: ["GUERRA_SERIE_W_CIRCULANDO"],
      leftChoice: {
        label: "Alegar que eran 'viviendas de seguridad protegidas' necesarias para resguardar a los altos cargos",
        stampText: "VIVIENDA SEGURIDAD",
        flavorQuote: "La piscina y el tenis son medidas de esparcimiento seguro para un cargo amenazado las 24 horas.",
        mechanicId: 24,
        modifiers: { pastaEnB: 16, presionJudicial: 14, impunidad: 16, reputacionMediatica: -20 },
        grantedFlags: ["GUERRA_CHALETS_JUSTIFICADOS"]
      },
      rightChoice: {
        label: "Embargar los inmuebles y exigir la devolución íntegra del dinero malversado a las arcas públicas",
        stampText: "EMBARGO CHALETS",
        flavorQuote: "Las piscinas privadas se pagan del bolsillo de cada uno; los fondos reservados son para salvar vidas.",
        mechanicId: 14,
        modifiers: { pastaEnB: -16, presionJudicial: -18, impunidad: -18, reputacionMediatica: 22 },
        grantedFlags: ["GUERRA_CHALETS_EMBARGADOS"]
      }
    },
    {
      id: "saga_guerrapol_37_destruccion_recibos_trituradora",
      speaker: "El Ordenanza del Sótano Ministerial",
      speakerRole: "Operador de la Trituradora Industrial",
      sphere: "POLITICA",
      headline: "NOCHE DE HUMO EN EL MINISTERIO: QUEMA MASIVA DE JUSTIFICANTES ANTES DEL CAMBIO",
      context: "En vísperas del traspaso de poderes tras la derrota electoral de 1996, las chimeneas del ministerio echan humo continuo. Durante tres noches se destruyen camiones enteros de recibís y cuadernos de fondos reservados para no dejar pistas a los nuevos ministros.",
      evidenceDocument: "Acta sindical de los empleados de mantenimiento denunciando saturación de las calderas de calefacción.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Alimentar las calderas hasta que no quede ni un solo apunte de las entregas de dinero negro",
        stampText: "QUEMA TOTAL",
        flavorQuote: "Sin recibos no hay delito de malversación; que los nuevos ministros encuentren los armarios limpios.",
        mechanicId: 3,
        modifiers: { pastaEnB: 14, presionJudicial: -20, impunidad: 24, reputacionMediatica: -22 },
        grantedFlags: ["GUERRA_RECIBOS_QUEMADOS"]
      },
      rightChoice: {
        label: "Precintar los archivos y entregar toda la documentación en un baúl lacrado a la Audiencia Nacional",
        stampText: "BAÚL LACRADO",
        flavorQuote: "Destruir archivos del Estado es un delito continuado: custodiamos los libros para la historia y los jueces.",
        mechanicId: 38,
        modifiers: { pastaEnB: -14, presionJudicial: 22, impunidad: -22, reputacionMediatica: 24 },
        grantedFlags: ["GUERRA_BAUL_ENTREGADO"]
      }
    },
    {
      id: "saga_guerrapol_38_el_sumario_de_los_fondos",
      speaker: "El Magistrado Instructor de Fondos Reservados",
      speakerRole: "Juez Central de Instrucción",
      sphere: "ORDEN_JUSTICIA",
      headline: "PIEZA SEPARADA DE FONDOS: IMPUTADOS TRES MINISTROS Y DIEZ DIRECTORES GENERALES",
      context: "El juzgado central abre una macrocausa independiente para investigar el desvío sistemático de 1.500 millones de pesetas de fondos reservados hacia patrimonios privados y pagos de guerra sucia.",
      evidenceDocument: "Auto de incoación de procedimiento abreviado por malversación de caudales públicos continuada.",
      weight: 3,
      requiredFlags: ["GUERRA_BAUL_ENTREGADO"],
      leftChoice: {
        label: "Plantear cuestiones previas alegando que los fondos reservados son un acto político no judiciable",
        stampText: "ACTO POLÍTICO",
        flavorQuote: "La dirección política de la seguridad del Estado no está sujeta al código penal ordinario.",
        mechanicId: 19,
        modifiers: { pastaEnB: 12, presionJudicial: -14, impunidad: 18, reputacionMediatica: -18 },
        grantedFlags: ["GUERRA_ACTO_POLITICO_ALEGADO"]
      },
      rightChoice: {
        label: "Rechazar las excepciones y sentar a toda la cúpula de Interior en el banquillo del Tribunal Supremo",
        stampText: "BANQUILLO SUPREMO",
        flavorQuote: "No hay zonas de impunidad en la gestión de caudales públicos: todos al banquillo del Supremo.",
        mechanicId: 38,
        modifiers: { pastaEnB: -16, presionJudicial: 24, impunidad: -24, reputacionMediatica: 24 },
        grantedFlags: ["GUERRA_BANQUILLO_SUPREMO_FIJADO"]
      }
    },
    {
      id: "saga_guerrapol_39_declaracion_barrionuevo_supremo",
      speaker: "José Barrionuevo",
      speakerRole: "Exministro del Interior",
      sphere: "POLITICA",
      headline: "EL EXMINISTRO ANTE EL SUPREMO: 'YO NUNCA AUTORICÉ NINGÚN SECUESTRO NI PAGUÉ MERCENARIOS'",
      context: "El exministro comparece en la Sala Segunda del Tribunal Supremo. Con tono firme e indignado, niega haber conocido los planes de los GAL y acusa a los jueces de montar un juicio político contra el gobierno de la transición.",
      evidenceDocument: "Acta de declaración del procesado ante la Sala Segunda del Tribunal Supremo presidida por el juez Bacigalupo.",
      weight: 3,
      requiredFlags: ["GUERRA_BANQUILLO_SUPREMO_FIJADO"],
      leftChoice: {
        label: "Aferrarse a la defensa política y presentar un frente común cerrado de todo el partido en el juicio",
        stampText: "FRENTE COMÚN",
        flavorQuote: "Ni un paso atrás: si condenan a Barrionuevo están condenando a diez millones de votantes de la democracia.",
        mechanicId: 21,
        modifiers: { pastaEnB: 14, presionJudicial: 14, impunidad: 20, reputacionMediatica: -20 },
        grantedFlags: ["GUERRA_FRENTE_COMUN_MANTENIDO"]
      },
      rightChoice: {
        label: "Admitir la responsabilidad in vigilando por los excesos cometidos por subordinados y pedir clemencia",
        stampText: "RESPONSABILIDAD CIVIL",
        flavorQuote: "Reconocer fallos graves de supervisión es la única manera de evitar penas de cárcel efectivas.",
        mechanicId: 10,
        modifiers: { pastaEnB: -12, presionJudicial: -16, impunidad: -16, reputacionMediatica: 18 },
        grantedFlags: ["GUERRA_ADMISION_RESPONSABILIDAD"]
      }
    },
    {
      id: "saga_guerrapol_40_condena_de_malversacion_vera",
      speaker: "El Presidente de la Sala Segunda del Supremo",
      speakerRole: "Magistrado Ponente de la Sentencia",
      sphere: "ORDEN_JUSTICIA",
      headline: "CONDENA HISTÓRICA DEL SUPREMO: DIEZ AÑOS DE CÁRCEL PARA EL EXMINISTRO Y SU NÚMERO DOS",
      context: "Julio de 1998. El Tribunal Supremo dicta sentencia firme condenando a José Barrionuevo y Rafael Vera a diez años de prisión y doce de inhabilitación por el secuestro de Segundo Marey y malversación continuada de caudales públicos.",
      evidenceDocument: "Sentencia de la Sala de lo Penal del Tribunal Supremo de 400 páginas ratificada por el pleno de la sala.",
      weight: 3,
      requiredFlags: ["GUERRA_BANQUILLO_SUPREMO_FIJADO"],
      leftChoice: {
        label: "Denunciar la sentencia ante el Tribunal Constitucional y pedir la suspensión cautelar del ingreso en prisión",
        stampText: "SUSPENSIÓN TC",
        flavorQuote: "Recurrimos en amparo al Constitucional para evitar la foto histórica de ministros entrando en la cárcel.",
        mechanicId: 16,
        modifiers: { pastaEnB: 10, presionJudicial: -18, impunidad: 22, reputacionMediatica: -22 },
        grantedFlags: ["GUERRA_SUSPENSION_TC_PEDIDA"]
      },
      rightChoice: {
        label: "Acatar la resolución del Supremo y cumplir el requerimiento de ingreso penitenciario",
        stampText: "CUMPLIMIENTO FIRME",
        flavorQuote: "El máximo tribunal del país ha hablado: el exministro debe ingresar en el penal como cualquier ciudadano.",
        mechanicId: 38,
        modifiers: { pastaEnB: -16, presionJudicial: 24, impunidad: -26, reputacionMediatica: 24 },
        grantedFlags: ["GUERRA_INGRESO_GUADALAJARA_FIJADO"]
      }
    },

    // === SUB-SAGA 5: LAS MICROFICHAS DEL CESID, GUADALAJARA Y LA 'X' (10 Cartas) ===
    {
      id: "saga_guerrapol_41_robo_microfichas_perote",
      speaker: "El Coronel Juan Alberto Perote",
      speakerRole: "Jefe Operativo de la AOME del CESID",
      sphere: "ORDEN_JUSTICIA",
      headline: "ROBO EN EL BÚNKER DEL CESID: MILES DE MICROFICHAS SECRETAS SUSTRAÍDAS EN MALETINES",
      context: "En el cuartel general de los servicios secretos, el jefe operativo de la Agrupación Operativa copia y sustrae cientos de microfichas clasificadas que detallan escuchas a ministros, operaciones de guerra sucia y expedientes de la Casa Real.",
      evidenceDocument: "Microfichas fotográficas del archivo secreto militar incautadas posteriormente en registros judiciales.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Llevarse las microfichas como póliza de seguro de vida ante una inminente purga militar",
        stampText: "SEGURO CESID",
        flavorQuote: "Quien tiene los secretos de la Corona y de los GAL en el bolsillo jamás irá a una celda militar.",
        mechanicId: 21,
        modifiers: { pastaEnB: 14, presionJudicial: -16, impunidad: 22, reputacionMediatica: -16 },
        grantedFlags: ["GUERRA_MICROFICHAS_SUSTRAIDAS"]
      },
      rightChoice: {
        label: "Custodiar los archivos en el búnker y no sustraer material clasificado de la defensa nacional",
        stampText: "DEBER MILITAR",
        flavorQuote: "El juramento militar y el secreto de Estado están por encima de las guerras personales de despachos.",
        mechanicId: 38,
        modifiers: { pastaEnB: -10, presionJudicial: 14, impunidad: -14, reputacionMediatica: 16 },
        grantedFlags: ["GUERRA_MICROFICHAS_INTACTAS"]
      }
    },
    {
      id: "saga_guerrapol_42_entrega_en_sede_banesto",
      speaker: "Mario Conde",
      speakerRole: "Banquero en Apuros de Banesto",
      sphere: "EMPRESARIAL",
      headline: "PACTO EN LA PLANTA NOBLE: PEROTE ENTREGA LOS PAPELES DEL CESID AL BANQUERO",
      context: "En el rascacielos de la calle Alcalá, el banquero Mario Conde recibe del coronel Perote un lote con las microfichas más comprometedoras para utilizarlas como ariete contra el gobierno y frenar las investigaciones sobre la quiebra de la entidad.",
      evidenceDocument: "Acta judicial de incautación de fotocopias de microfichas en el despacho privado de la sede bancaria.",
      weight: 3,
      requiredFlags: ["GUERRA_MICROFICHAS_SUSTRAIDAS"],
      leftChoice: {
        label: "Usar los papeles del CESID para chantajear a Moncloa y exigir el sobreseimiento de la causa Banesto",
        stampText: "CHANTAJE BANESTO",
        flavorQuote: "Si nos intervienen el banco publicamos los papeles de los GAL y el gobierno se va por el desagüe.",
        mechanicId: 21,
        modifiers: { pastaEnB: 18, presionJudicial: -18, impunidad: 24, reputacionMediatica: -20 },
        grantedFlags: ["GUERRA_CHANTAJE_BANESTO_LANZADO"]
      },
      rightChoice: {
        label: "Rechazar los papeles secretos y defender la solvencia del banco en los tribunales mercantiles",
        stampText: "DEFENSA MERCANTIL",
        flavorQuote: "Un banquero no trafica con secretos militares robados: las cuentas se defienden con auditorías.",
        mechanicId: 8,
        modifiers: { pastaEnB: -14, presionJudicial: 14, impunidad: -16, reputacionMediatica: 18 },
        grantedFlags: ["GUERRA_PAPELES_RECHAZADOS"]
      }
    },
    {
      id: "saga_guerrapol_43_papeles_cesid_chantaje_moncloa",
      speaker: "El Enviado Especial del Gobierno a Banesto",
      speakerRole: "Negociador de Secretos de Estado",
      sphere: "POLITICA",
      headline: "LA GUERRA DE DOSIERES: MONCLOA SE NIEGA A CEDER AL PULSO DE LAS MICROFICHAS",
      context: "El presidente del Gobierno rechaza el ultimátum del banquero y del militar. Ordena a la fiscalía general querellarse contra ambos por un delito continuado contra la seguridad nacional y la revelación de secretos de defensa.",
      evidenceDocument: "Querella de la Fiscalía General del Estado ante el Tribunal Supremo contra los tenedores de las microfichas.",
      weight: 3,
      requiredFlags: ["GUERRA_CHANTAJE_BANESTO_LANZADO"],
      leftChoice: {
        label: "Publicar las microfichas en medios de prensa aliados para hacer saltar el escándalo por los aires",
        stampText: "BOMBA MICROFICHAS",
        flavorQuote: "Se acabaron los pactos de despacho: sacamos los audios de la Zarzuela y que el país elija.",
        mechanicId: 15,
        modifiers: { pastaEnB: 12, presionJudicial: 18, impunidad: 16, reputacionMediatica: -24 },
        grantedFlags: ["GUERRA_MICROFICHAS_PUBLICADAS"]
      },
      rightChoice: {
        label: "Entregar los documentos originales al juez militar y allanarse a la justicia",
        stampText: "ENTREGA AL JUEZ",
        flavorQuote: "El chantaje al Estado no tiene recorrido: devolvemos los archivos antes de entrar en prisión militar.",
        mechanicId: 38,
        modifiers: { pastaEnB: -16, presionJudicial: -18, impunidad: -18, reputacionMediatica: 20 },
        grantedFlags: ["GUERRA_ENTREGA_MILITAR"]
      }
    },
    {
      id: "saga_guerrapol_44_desfile_puerta_guadalajara",
      speaker: "El Secretario General del Partido en Oposición",
      speakerRole: "Líder de la Comitiva de Despedida",
      sphere: "POLITICA",
      headline: "LA PROCESIÓN DE GUADALAJARA: EXPRESIDENTE Y MINISTROS DESPIDEN A LOS CONDENADOS",
      context: "Septiembre de 1998. El expresidente Felipe González, secretarios generales y barones autonómicos acuden a la prisión de Guadalajara para arropar y abrazar a Barrionuevo y Vera en su entrada física en el centro penitenciario.",
      evidenceDocument: "Fotografía histórica de portada de los líderes políticos abrazando a los condenados frente a las puertas del penal.",
      weight: 3,
      requiredFlags: ["GUERRA_INGRESO_GUADALAJARA_FIJADO"],
      leftChoice: {
        label: "Liderar la comitiva de solidaridad en la puerta de la cárcel calificándolos de patriotas injustamente tratados",
        stampText: "MARCHA GUADALAJARA",
        flavorQuote: "Nuestros compañeros cumplieron con su deber en los momentos más duros: nunca los dejaremos solos.",
        mechanicId: 40,
        modifiers: { pastaEnB: 12, presionJudicial: 16, impunidad: 22, reputacionMediatica: -22 },
        grantedFlags: ["GUERRA_MARCHA_GUADALAJARA_CELEBRADA"]
      },
      rightChoice: {
        label: "Prohibir a los cargos del partido acudir al penal y acatar la sentencia con sobriedad republicana",
        stampText: "SOBRIEDAD PENAL",
        flavorQuote: "No se convierte la entrada en prisión por secuestro de ciudadanos en un desfile partidista.",
        mechanicId: 10,
        modifiers: { pastaEnB: -12, presionJudicial: -16, impunidad: -18, reputacionMediatica: 22 },
        grantedFlags: ["GUERRA_SOBRIEDAD_ACATADA"]
      }
    },
    {
      id: "saga_guerrapol_45_himno_puerta_prision",
      speaker: "El Militante Veterano de Agrupación",
      speakerRole: "Portavoz del Clamor Callejero",
      sphere: "POLITICA",
      headline: "CÁNTICOS EN EL PENAL: PUÑO EN ALTO Y LÁGRIMAS ANTE LOS MUROS DE HORMIGÓN",
      context: "Tres mil militantes con pancartas corean consignas y cantan himnos mientras los dos altos cargos cruzan el rastrillo de la prisión de Guadalajara. Las imágenes abren todos los informativos de televisión del país.",
      evidenceDocument: "Grabaciones en directo de las cadenas de televisión con declaraciones de apoyo incondicional de los manifestantes.",
      weight: 2,
      requiredFlags: ["GUERRA_MARCHA_GUADALAJARA_CELEBRADA"],
      leftChoice: {
        label: "Reivindicar la concentración como una lección de dignidad colectiva y lealtad política",
        stampText: "LECCIÓN LEALTAD",
        flavorQuote: "La lealtad a los nuestros no se mide en sentencias judiciales, se mide en el corazón de la militancia.",
        mechanicId: 21,
        modifiers: { pastaEnB: 10, presionJudicial: 12, impunidad: 16, reputacionMediatica: -18 },
        grantedFlags: ["GUERRA_LEALTAD_REIVINDICADA"]
      },
      rightChoice: {
        label: "Lamentar el espectáculo público y pedir a la militancia que respete el dolor de las víctimas de los GAL",
        stampText: "RESPETO VÍCTIMAS",
        flavorQuote: "Festejar la entrada en la cárcel ofende la memoria de Segundo Marey y de todos los inocentes.",
        mechanicId: 10,
        modifiers: { pastaEnB: -10, presionJudicial: -14, impunidad: -14, reputacionMediatica: 20 },
        grantedFlags: ["GUERRA_RESPETO_VICTIMAS_DEFENDIDO"]
      }
    },
    {
      id: "saga_guerrapol_46_indulto_parcial_navidad",
      speaker: "El Ministro de Justicia del Gobierno Rival",
      speakerRole: "Promotor del Indulto en Consejo de Ministros",
      sphere: "POLITICA",
      headline: "INDULTO EN NOCHEBUENA: EL GOBIERNO OPOSITOR REBAJA DOS TERCIOS DE LA CONDENA",
      context: "Diciembre de 1998. En vísperas de Nochebuena y tras solo tres meses de reclusión efectiva, el Consejo de Ministros del partido rival concede el indulto parcial de dos tercios a Barrionuevo y Vera, permitiéndoles el tercer grado inmediato.",
      evidenceDocument: "Real Decreto de concesión de indulto parcial publicado en el BOE extraordinario del 24 de diciembre.",
      weight: 3,
      requiredFlags: ["GUERRA_MARCHA_GUADALAJARA_CELEBRADA"],
      leftChoice: {
        label: "Aprobar el indulto parcial navideño para pacificar la tensión política y cerrar heridas del Estado",
        stampText: "INDULTO NOCHEBUENA",
        flavorQuote: "Por razones de equidad y pacificación social cerramos el capítulo más amargo de la transición.",
        mechanicId: 16,
        modifiers: { pastaEnB: 14, presionJudicial: -24, impunidad: 28, reputacionMediatica: -24 },
        grantedFlags: ["GUERRA_INDULTO_NOCHEBUENA_CONCEDIDO"]
      },
      rightChoice: {
        label: "Denegar el indulto por imperativo legal al tratarse de delitos de secuestro y malversación continuada",
        stampText: "INDULTO DENEGADO",
        flavorQuote: "El indulto a gobernantes que secuestran ciudadanos destruye la credibilidad del sistema democrático.",
        mechanicId: 38,
        modifiers: { pastaEnB: -16, presionJudicial: 24, impunidad: -26, reputacionMediatica: 26 },
        grantedFlags: ["GUERRA_INDULTO_DENEGADO"]
      }
    },
    {
      id: "saga_guerrapol_47_la_incognita_de_la_x",
      speaker: "El Portavoz Parlamentario de la Oposición",
      speakerRole: "Diputado Interpelante en el Congreso",
      sphere: "POLITICA",
      headline: "EL ENIGMA DE LA 'X': ¿QUIÉN ESTABA EN LA CÚSPIDE DE LA PIRÁMIDE DE LOS GAL?",
      context: "En el pleno del Congreso de los Diputados, la oposición formula la pregunta que marcó una época: '¿Quién es el señor X?'. Los informes de inteligencia situaban la cúspide en la presidencia del Gobierno, pero la justicia nunca pudo acreditarlo formalmente.",
      evidenceDocument: "Gráfico piramidal elaborado por la Guardia Civil con una casilla en blanco marcada con la letra 'X' en la cima.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Responder con evasivas institucionales y acusar a los diputados de horadar la estabilidad de España",
        stampText: "DEFENSA INSTITUCIONAL",
        flavorQuote: "El señor X es una fábula novelística inventada por quienes quieren destruir los logros de este país.",
        mechanicId: 40,
        modifiers: { pastaEnB: 12, presionJudicial: -14, impunidad: 20, reputacionMediatica: -18 },
        grantedFlags: ["GUERRA_ENIGMA_X_TAPADO"]
      },
      rightChoice: {
        label: "Crear una comisión de la verdad parlamentaria con acceso a todas las actas de presidencia",
        stampText: "COMISIÓN VERDAD",
        flavorQuote: "Una democracia madura no teme a su pasado: desclasifiquemos todo hasta saber quién dio la orden.",
        mechanicId: 10,
        modifiers: { pastaEnB: -14, presionJudicial: 22, impunidad: -22, reputacionMediatica: 24 },
        grantedFlags: ["GUERRA_COMISION_VERDAD_CREADA"]
      }
    },
    {
      id: "saga_guerrapol_48_doctrina_secreto_de_estado",
      speaker: "El Ministro de la Presidencia",
      speakerRole: "Custodio de las Clasificaciones Secretas",
      sphere: "POLITICA",
      headline: "EL CERROJO DEL SECRETO: EL GOBIERNO VETA LA DESCLASIFICACIÓN DE DOCUMENTOS AL JUEZ",
      context: "El juez Garzón solicita la desclasificación de los 'papeles del CESID' sobre los atentados de los GAL. El Consejo de Ministros aprueba un acuerdo formal declarando que su entrega pondría en grave riesgo la seguridad nacional y las relaciones diplomáticas.",
      evidenceDocument: "Acuerdo del Consejo de Ministros denegando la desclasificación amparándose en la Ley de Secretos Oficiales de 1968.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Mantener el cerrojo de secretos oficiales y blindar los documentos de por vida en el archivo militar",
        stampText: "CERROJO SECRETO",
        flavorQuote: "La seguridad nacional prevalece sobre el sumario penal: los papeles se quedan bajo siete llaves.",
        mechanicId: 32,
        modifiers: { pastaEnB: 14, presionJudicial: -20, impunidad: 25, reputacionMediatica: -22 },
        grantedFlags: ["GUERRA_SECRETO_TOTAL_MANTENIDO"]
      },
      rightChoice: {
        label: "Desclasificar los documentos por mandato de la Sala Tercera del Tribunal Supremo",
        stampText: "DESCLASIFICACIÓN SUPREMO",
        flavorQuote: "El Supremo anula el cerrojo del gobierno: el secreto de Estado no ampara la impunidad criminal.",
        mechanicId: 38,
        modifiers: { pastaEnB: -16, presionJudicial: 24, impunidad: -24, reputacionMediatica: 24 },
        grantedFlags: ["GUERRA_PAPELES_DESCLASIFICADOS_SUPREMO"]
      }
    },
    {
      id: "saga_guerrapol_49_testigo_perote_militar",
      speaker: "El Presidente del Tribunal Militar Central",
      speakerRole: "General Auditor de Justicia Militar",
      sphere: "ORDEN_JUSTICIA",
      headline: "CONSEJO DE GUERRA AL CORONEL: SIETE AÑOS DE CÁRCEL MILITAR EN ALCALÁ DE HENARES",
      context: "El coronel Perote es juzgado en consejo de guerra por revelación de secretos de la defensa nacional y sustracción de microfichas. La justicia castrense le condena a siete años de prisión y a la pérdida de su condición militar.",
      evidenceDocument: "Sentencia del Tribunal Militar Central condenando al coronel de inteligencia militar.",
      weight: 2,
      requiredFlags: ["GUERRA_MICROFICHAS_SUSTRAIDAS"],
      leftChoice: {
        label: "Celebrar la condena militar como castigo ejemplar para disuadir a otros espías díscolos",
        stampText: "CASTIGO CASTRENSE",
        flavorQuote: "La traición al servicio secreto militar se purga con degradación pública y reclusión en Alcalá.",
        mechanicId: 38,
        modifiers: { pastaEnB: -10, presionJudicial: 16, impunidad: -14, reputacionMediatica: 16 },
        grantedFlags: ["GUERRA_PEROTE_CONDENADO"]
      },
      rightChoice: {
        label: "Concederle beneficios penitenciarios abreviados a cambio de que entregue los negativos restantes",
        stampText: "NEGOCIACIÓN NEGATIVOS",
        flavorQuote: "Menos cárcel militar si devuelve hasta el último negativo fotográfico que guardó en el desván.",
        mechanicId: 17,
        modifiers: { pastaEnB: 10, presionJudicial: -12, impunidad: 16, reputacionMediatica: -12 },
        grantedFlags: ["GUERRA_NEGATIVOS_RECUPERADOS"]
      }
    },
    {
      id: "saga_guerrapol_50_cierre_historico_sumarios",
      speaker: "El Cronista Histórico de la Transición",
      speakerRole: "Investigador de la Memoria Democrática",
      sphere: "POLITICA",
      headline: "PUNTO Y FINAL A LA GUERRA SUCIA: CIERRE DE LAS PIEZAS Y LECCIONES DE LA DEMOCRACIA",
      context: "Cuarenta años después del primer atentado del BVE y treinta del secuestro de Marey, las últimas piezas judiciales de la guerra sucia quedan archivadas por prescripción o fallecimiento de los inculpados. El Estado asume el balance amargo de una década de sombras.",
      evidenceDocument: "Decreto de archivo definitivo de la última pieza de los GAL en el Juzgado Central de Instrucción 5.",
      weight: 3,
      requiredFlags: [],
      leftChoice: {
        label: "Enterrar el pasado definitivamente sin actos de homenaje ni comisiones para no reabrir heridas",
        stampText: "PASAR PÁGINA",
        flavorQuote: "La transición tuvo sus sombras pero dio paso a la modernidad: no reabramos tumbas que dividen al país.",
        mechanicId: 34,
        modifiers: { pastaEnB: 12, presionJudicial: -18, impunidad: 22, reputacionMediatica: -16 },
        grantedFlags: ["GUERRA_PASAR_PAGINA_OFICIAL"]
      },
      rightChoice: {
        label: "Reconocer a todas las víctimas inocentes de la guerra sucia e incorporar la memoria a los libros de texto",
        stampText: "MEMORIA Y VERDAD",
        flavorQuote: "Un Estado fuerte no oculta sus errores: la verdad de los GAL debe enseñarse para que jamás vuelva a repetirse.",
        mechanicId: 10,
        modifiers: { pastaEnB: -14, presionJudicial: -20, impunidad: -22, reputacionMediatica: 26 },
        grantedFlags: ["GUERRA_MEMORIA_DEMOCRATICA_PLENA"]
      }
    }
  ]
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(lote07Data, null, 2), 'utf-8');
console.log(`Lote 07 generado con éxito: ${lote07Data.cards.length} cartas en ${OUTPUT_PATH}`);
