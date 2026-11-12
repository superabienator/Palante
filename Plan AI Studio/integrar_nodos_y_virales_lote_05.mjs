import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const STORY_PATH = path.join(ROOT, 'src', 'content', 'story.json');
const PENDING_NEWS_PATH = path.join(ROOT, 'src', 'content', 'pendingNewsCards.json');

// 1. Nuevos nodos de historia
const story = JSON.parse(fs.readFileSync(STORY_PATH, 'utf-8'));

story.nodes['nodo_gomorra_puerto_barcelona'] = {
  id: "nodo_gomorra_puerto_barcelona",
  archetypeId: "LAVANDERO_TRANSNACIONAL",
  sphere: "EMPRESARIAL",
  headline: "EL DESEMBARCO DE LA CAMORRA: CONTENEDORES Y ÁTICOS EN BARCELONA",
  context: "Raffaele Amato 'Lo Spagnolo' y los lugartenientes de los Scissionisti te ofrecen una alianza estratégica en el Port de Barcelona: entrada limpia de mercancía por el muelle de inflamables a cambio de liquidez ilimitada en metálico para tus promociones inmobiliarias en Sitges y Castelldefels.",
  evidenceDocument: "Sumario de la Direzione Investigativa Antimafia con escuchas de comisiones y escrituras notariales en blanco.",
  choices: [
    {
      id: "c_gom_node_1",
      label: "Aceptar la liquidez en fajos y blindar los almacenes portuarios ante aduanas",
      flavorQuote: "En la Barceloneta no se hacen preguntas: el dinero fluye y las grúas de obra nunca se paran.",
      mechanicId: 5,
      modifiers: { pastaEnB: 25, presionJudicial: 15, impunidad: 20 },
      nextNodeId: "nodo_cleptocracia_fondos_buitre"
    },
    {
      id: "c_gom_node_2",
      label: "Filtrar el albarán del contenedor al Grupo de Fugitivos de la Policía Nacional",
      flavorQuote: "Que los geos revienten el muelle: nosotros salimos en la foto como baluartes de la ley.",
      mechanicId: 12,
      modifiers: { pastaEnB: -15, presionJudicial: -25, impunidad: 25 },
      nextNodeId: "proconsul_fin_sobreseimiento"
    }
  ]
};

story.nodes['nodo_cleptocracia_fondos_buitre'] = {
  id: "nodo_cleptocracia_fondos_buitre",
  archetypeId: "TAUMATURGO_AGUJERO",
  sphere: "EMPRESARIAL",
  headline: "LA FÁBRICA DE DELAWARE: RESCATE BANCARIO Y VIVIENDA PÚBLICA EN ALMONEDA",
  context: "Los fondos fiduciarios anglosajones y las LLCs de Wilmington exigen la cesión en bloque de miles de viviendas de protección oficial y el traspaso del agujero financiero de 60.000 millones a la Sareb con garantía pública.",
  evidenceDocument: "Contrato fiduciario de cesión de activos residenciales y modelo 750 de amnistía fiscal sellado sin inspección.",
  choices: [
    {
      id: "c_clepto_node_1",
      label: "Vender la vivienda social al fondo buitre y trasladar las plusvalías a Delaware",
      flavorQuote: "El mercado inmobiliario manda y en Wilmington no hay inspectores de hacienda ni preguntas morales.",
      mechanicId: 14,
      modifiers: { pastaEnB: 30, presionJudicial: 10, impunidad: 25 },
      nextNodeId: "nodo_esperpento_carretera_nacional"
    },
    {
      id: "c_clepto_node_2",
      label: "Acogerse a la amnistía fiscal al tipo del 10% y regularizar todo el capital repatriado",
      flavorQuote: "El BOE nos limpia el pecado: de comisionista opaco a respetable patriota fiscal con diploma.",
      mechanicId: 34,
      modifiers: { pastaEnB: -10, presionJudicial: -30, impunidad: 40 },
      nextNodeId: "proconsul_fin_sobreseimiento"
    }
  ],
  ending: "CONSEJO_IBEX"
};

story.nodes['nodo_esperpento_carretera_nacional'] = {
  id: "nodo_esperpento_carretera_nacional",
  archetypeId: "PASANTE_GIRATORIO",
  sphere: "POLITICA",
  headline: "EL ASFALTO DEL ESPERPENTO: RADIALES VACÍAS Y EL CONCIERTO PATRONAL",
  context: "Cruzas la estepa en una furgoneta abollada sorteando controles de tráfico, peajes quebrados rescatados por el Estado y verbenas municipales donde la mitad de la partida presupuestaria se esfuma en sobres en el camerino.",
  evidenceDocument: "Servilleta de papel con la liquidación de la orquesta fantasma y certificación de fin de obra de una rotonda oxidada.",
  choices: [
    {
      id: "c_esp_node_1",
      label: "Entrar triunfal en Madrid por la M-30 y repartir las mordidas en el asador de Génova",
      flavorQuote: "Hemos toreado a la Guardia Civil, a los interventores y a los alcaldes: ¡viva la picaresca nacional!",
      mechanicId: 20,
      modifiers: { pastaEnB: 20, presionJudicial: 10, impunidad: 30 },
      nextNodeId: "nodo_inicio_proconsul"
    },
    {
      id: "c_esp_node_2",
      label: "Aparcar la furgoneta en Lavapiés y publicar el fanzine con todas las vergüenzas de la gira",
      flavorQuote: "La guitarra y la tinta fanzinera no se compran: que todo el país se entere del gran esperpento.",
      mechanicId: 10,
      modifiers: { pastaEnB: -15, presionJudicial: -20, impunidad: 25 },
      nextNodeId: "proconsul_fin_sobreseimiento"
    }
  ],
  ending: "FUGA_Y_PRESCRIPCION"
};

fs.writeFileSync(STORY_PATH, JSON.stringify(story, null, 2), 'utf-8');
console.log(`Story actualizada. Total de nodos: ${Object.keys(story.nodes).length}`);

// 2. Nuevas noticias virales en pendingNewsCards.json
const pending = JSON.parse(fs.readFileSync(PENDING_NEWS_PATH, 'utf-8'));

const newVirales = [
  {
    id: "VIRAL_GOMORRA_CONTAINER_BARCELONETA",
    speaker: "El Reportero de Sucesos de Barcelona",
    speakerRole: "Cronista de la Noche Portuaria",
    sphere: "EMPRESARIAL",
    headline: "ESCÁNDALO EN EL MUELLE: OCHOCIENTOS KILOS DE COCAÍNA Y UN CAPO EN LA BARCELONETA",
    context: "Las imágenes de la Udyco abriendo contenedores de pescado congelado en el puerto de Barcelona se filtran a los telediarios. La oposición exige la comparecencia urgente de la Autoridad Portuaria.",
    evidenceDocument: "Vídeo en primicia emitido en el informativo de las 21:00 con furgones policiales precintando el muelle.",
    leftChoice: {
      id: "c_vir_gom_1",
      label: "Desviar la atención acusando a mafias internacionales ajenas a la ciudad",
      stampText: "BALONES FUERA",
      flavorQuote: "Barcelona es solo un punto de paso logístico global: esto ocurre en Rotterdam, en Amberes y en cualquier gran puerto.",
      modifiers: { pastaEnB: 10, presionJudicial: -10, impunidad: 15, reputacionMediatica: -18 },
      grantedFlags: ["VIRAL_GOMORRA_DESVIADA"]
    },
    rightChoice: {
      id: "c_vir_gom_2",
      label: "Cesar al director de aduanas y anunciar una auditoría integral de muelles",
      stampText: "PURGA ADUANERA",
      flavorQuote: "Caiga quien caiga en los muelles: ni un contenedor entra sin inspección escáner de rayos X.",
      modifiers: { pastaEnB: -12, presionJudicial: -20, impunidad: -10, reputacionMediatica: 20 },
      grantedFlags: ["VIRAL_AUDITORIA_PORTUARIA"]
    },
    requiredFlags: []
  },
  {
    id: "VIRAL_DELAWARE_BUZON_POSTAL",
    speaker: "La Corresponsal de Economía en Washington",
    speakerRole: "Investigadora de Paraísos Fiscales",
    sphere: "EMPRESARIAL",
    headline: "LA DIRECCIÓN DE ORO: DESCUBREN EL BUZÓN DE DELAWARE DE LA CÚPULA POLÍTICA",
    context: "Un consorcio periodístico internacional publica una fotografía del portal de Wilmington donde tributan cuarenta empresas pantalla controladas por consejeros autonómicos y banqueros rescatados.",
    evidenceDocument: "Registro mercantil de Delaware con el listado de filiales y beneficiarios finales con pasaporte español.",
    leftChoice: {
      id: "c_vir_del_1",
      label: "Defender la absoluta legalidad de la optimización fiscal corporativa internacional",
      stampText: "LIBRE MERCADO",
      flavorQuote: "Estar en Delaware es un derecho societario dentro de la economía globalizada; todo está declarado en modelos tributarios.",
      modifiers: { pastaEnB: 18, presionJudicial: 12, impunidad: 14, reputacionMediatica: -20 },
      grantedFlags: ["VIRAL_DEFENSA_DELAWARE"]
    },
    rightChoice: {
      id: "c_vir_del_2",
      label: "Anunciar el cierre voluntario de las filiales offshore y repatriar los fondos",
      stampText: "REPATRIACIÓN",
      flavorQuote: "Traemos hasta el último céntimo de vuelta a la banca nacional antes de que el Congreso abra una comisión de investigación.",
      modifiers: { pastaEnB: -18, presionJudicial: -18, impunidad: 10, reputacionMediatica: 18 },
      grantedFlags: ["VIRAL_REPATRIACION_DELAWARE"]
    },
    requiredFlags: []
  },
  {
    id: "VIRAL_FURGONETA_PEAJE_FANTASMA",
    speaker: "El Youtuber de Rutas Ibéricas",
    speakerRole: "Documentalista del Despilfarro Rural",
    sphere: "POLITICA",
    headline: "VÍDEO VIRAL: LA AUTOPISTA DE PEAJE VACÍA DE LA MANCHA SUPERA EL MILLÓN DE VISITAS",
    context: "Un vídeo grabado desde una furgoneta recorriendo 30 kilómetros de autopista sin un solo coche mientras el narrador come panceta se hace trending topic mundial, denunciando el rescate millonario pagado por el Estado.",
    evidenceDocument: "Captura del clip de vídeo con un millón doscientas mil reproducciones y etiqueta #RadialFantasma.",
    leftChoice: {
      id: "c_vir_rad_1",
      label: "Minimizar el vídeo calificándolo de bulo de redes sociales orquestado por la oposición",
      stampText: "BULO REDES",
      flavorQuote: "Ese vídeo está grabado a las cuatro de la madrugada; en horas punta la intensidad de tráfico es modélica.",
      modifiers: { pastaEnB: 8, presionJudicial: 6, impunidad: 12, reputacionMediatica: -16 },
      grantedFlags: ["VIRAL_RADIAL_DESMENTIDA"]
    },
    rightChoice: {
      id: "c_vir_rad_2",
      label: "Rebajar el peaje un 80% y convertir la radial en corredor logístico comarcal",
      stampText: "TARIFA PLANA",
      flavorQuote: "Si el asfalto ya está pagado por el erario, que lo usen los transportistas y no los buitres de la concesión.",
      modifiers: { pastaEnB: -10, presionJudicial: -10, impunidad: 8, reputacionMediatica: 16 },
      grantedFlags: ["VIRAL_TARIFA_POPULAR"]
    },
    requiredFlags: []
  },
  {
    id: "VIRAL_FESTIVAL_RECALIFICACION",
    speaker: "La Portavoz de la Plataforma Vecinal",
    speakerRole: "Luchadora contra la Especulación Cultural",
    sphere: "POLITICA",
    headline: "LA FIESTA DEL LADRILLO: DENUNCIAN QUE EL FESTIVAL ERA UNA COARTADA PARA EL POLÍGONO",
    context: "Los vecinos del municipio descubren en el boletín provincial que el terreno inundable del macrofestival indie ha sido reclasificado como suelo industrial y terciario para un centro comercial de la familia del alcalde.",
    evidenceDocument: "BOP con la modificación puntual del plan general aprobada tres días después de finalizar los conciertos.",
    leftChoice: {
      id: "c_vir_fest_1",
      label: "Defender la recalificación como motor ineludible de atracción de empleo y ocio",
      stampText: "EMPLEO Y OCIO",
      flavorQuote: "Los festivales ponen el municipio en el mapa: quien se oponga al centro comercial se opone al progreso del pueblo.",
      modifiers: { pastaEnB: 18, presionJudicial: 12, impunidad: 14, reputacionMediatica: -18 },
      grantedFlags: ["VIRAL_DEFENSA_POLIGONO"]
    },
    rightChoice: {
      id: "c_vir_fest_2",
      label: "Suspender cautelarmente la aprobación del plan general ante la movilización ciudadana",
      stampText: "SUSPENSIÓN CAUTELAR",
      flavorQuote: "No habrá centros comerciales sobre el lodazal de las verbenas: protegemos el suelo comarcal.",
      modifiers: { pastaEnB: -16, presionJudicial: -14, impunidad: -10, reputacionMediatica: 18 },
      grantedFlags: ["VIRAL_PLAN_SUSPENDIDO"]
    },
    requiredFlags: []
  }
];

// Comprobar que no existan duplicados
for (const card of newVirales) {
  if (!pending.find(p => p.id === card.id)) {
    pending.push(card);
  }
}

fs.writeFileSync(PENDING_NEWS_PATH, JSON.stringify(pending, null, 2), 'utf-8');
console.log(`Pending news cards actualizada. Total de virales: ${pending.length}`);
