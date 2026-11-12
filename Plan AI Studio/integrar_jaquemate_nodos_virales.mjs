import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const STORY_PATH = path.join(ROOT, 'src', 'content', 'story.json');
const PENDING_NEWS_PATH = path.join(ROOT, 'src', 'content', 'pendingNewsCards.json');

// 1. Nodos de historia
const story = JSON.parse(fs.readFileSync(STORY_PATH, 'utf-8'));

story.nodes['nodo_jaquemate_purga_stampa'] = {
  id: "nodo_jaquemate_purga_stampa",
  archetypeId: "ARQUITECTO_SOBRESEIMIENTO",
  sphere: "ORDEN_JUSTICIA",
  headline: "LA PURGA DEL FISCAL INCÓMODO: EL CONSEJO FISCAL DE LAS CLOACAS",
  context: "El fiscal que investiga el sumario Tándem ha rechazado todas las ofertas de pacto de las defensas bancarias y policiales. La cúpula de la Fiscalía General te convoca a un almuerzo discreto para pedirte que apoyes apartarlo de la plaza fija en Anticorrupción a cambio de un ascenso de carrera.",
  evidenceDocument: "Acta de votación del Consejo Fiscal con las plazas asignadas por afinidad política y el informe de archivo ocultado en un cajón.",
  choices: [
    {
      id: "c_stampa_node_1",
      label: "Votar la exclusión del fiscal y consumar la purga para frenar las imputaciones del IBEX",
      flavorQuote: "En la carrera fiscal quien no rema a favor de la cúpula acaba redactando multas en un juzgado de pueblo.",
      mechanicId: 19,
      modifiers: { pastaEnB: 20, presionJudicial: -25, impunidad: 30 },
      nextNodeId: "nodo_jaquemate_operacion_kitchen"
    },
    {
      id: "c_stampa_node_2",
      label: "Respaldar la independencia de Stampa y denunciar la injerencia política ante el Supremo",
      flavorQuote: "No seremos cómplices del atropello a un compañero por hacer su trabajo contra los poderosos.",
      mechanicId: 38,
      modifiers: { pastaEnB: -15, presionJudicial: 20, impunidad: -20 },
      nextNodeId: "proconsul_fin_sobreseimiento"
    }
  ],
  ending: "SOBRESEIMIENTO_BOTIN"
};

story.nodes['nodo_jaquemate_operacion_kitchen'] = {
  id: "nodo_jaquemate_operacion_kitchen",
  archetypeId: "FONTANERO_INTERIOR",
  sphere: "POLITICA",
  headline: "OPERACIÓN KITCHEN: FONDOS RESERVADOS PARA ASALTAR AL TESORERO",
  context: "En el búnker de la Secretaría de Estado de Seguridad se coordinan las entregas mensuales de billetes de la serie W al chófer del extesorero y el envío de un sicario con sotana para arrebatar los pendrives que comprometen al presidente del Gobierno.",
  evidenceDocument: "Vaciado pericial de mensajes de WhatsApp entre el ministro y el secretario de Estado protocolizados ante notario.",
  choices: [
    {
      id: "c_kitch_node_1",
      label: "Autorizar el asalto con el falso cura y pagar el silencio de los mandos policiales",
      flavorQuote: "Si caen las libretas del tesorero en el juzgado no queda en pie ni la sede de la calle Génova.",
      mechanicId: 33,
      modifiers: { pastaEnB: -20, presionJudicial: -20, impunidad: 35 },
      nextNodeId: "nodo_inicio_proconsul"
    },
    {
      id: "c_kitch_node_2",
      label: "Protocolizar todos los mensajes ante notario y colaborar plenamente con la Audiencia Nacional",
      flavorQuote: "El ministro dio las órdenes y yo guardo las escrituras con fe pública: no seré el chivo expiatorio de nadie.",
      mechanicId: 38,
      modifiers: { pastaEnB: 10, presionJudicial: -30, impunidad: 40 },
      nextNodeId: "proconsul_fin_sobreseimiento"
    }
  ],
  ending: "CONSEJO_IBEX"
};

fs.writeFileSync(STORY_PATH, JSON.stringify(story, null, 2), 'utf-8');
console.log(`Story actualizada. Total nodos: ${Object.keys(story.nodes).length}`);

// 2. Virales en pendingNewsCards.json
const pending = JSON.parse(fs.readFileSync(PENDING_NEWS_PATH, 'utf-8'));

const newVirales = [
  {
    id: "VIRAL_JAQUEMATE_DISCO_DE_ORO",
    speaker: "El Cronista de Tribunales de la Cadena SER",
    speakerRole: "Especialista en Cloacas Policiales",
    sphere: "ORDEN_JUSTICIA",
    headline: "EL 'DISCO DE ORO': CIEN GIGAS DE GRABACIONES A BANQUEROS Y MINISTROS EN LA AUDIENCIA",
    context: "El peritaje del disco duro requisado en la mansión de Boadilla revela cientos de horas de grabaciones en reservados gastronómicos. Las defensas de la banca y la política exigen la nulidad total alegando vulneración de derechos fundamentales.",
    evidenceDocument: "Certificación judicial de apertura de la pieza secreta del soporte de almacenamiento digital.",
    leftChoice: {
      id: "c_vir_oro_1",
      label: "Exigir la destrucción inmediata de las grabaciones alegando vulneración de la intimidad",
      stampText: "DESTRUCCIÓN DISCO",
      flavorQuote: "Si se escuchan esas cintas, el descrédito de las instituciones será irreparable para la democracia.",
      modifiers: { pastaEnB: 15, presionJudicial: -20, impunidad: 25, reputacionMediatica: -18 },
      grantedFlags: ["VIRAL_DISCO_ORO_DESTRUIDO"]
    },
    rightChoice: {
      id: "c_vir_oro_2",
      label: "Volcar todas las grabaciones al sumario público bajo estricta cadena de custodia",
      stampText: "TRANSPARENCIA SUMARIAL",
      flavorQuote: "La ciudadanía tiene derecho a saber cómo se pactaban las leyes y los silencios en los reservados.",
      modifiers: { pastaEnB: -14, presionJudicial: 22, impunidad: -18, reputacionMediatica: 22 },
      grantedFlags: ["VIRAL_DISCO_ORO_VOLCADO"]
    },
    requiredFlags: []
  },
  {
    id: "VIRAL_JAQUEMATE_FALSO_CURA_BARCENAS",
    speaker: "El Reportero de Investigación de El Confidencial",
    speakerRole: "Cronista de Sucesos Políticos",
    sphere: "POLITICA",
    headline: "EL ASALTO DEL FALSO SACERDOTE: UN REVÓLVER Y FONDOS RESERVADOS EN EL SALÓN",
    context: "Se filtran las declaraciones del chófer de Bárcenas reconociendo que cobró 50.000 euros en mano para facilitar la entrada a la vivienda y robar los pendrives de la contabilidad paralela.",
    evidenceDocument: "Fotografía del falso sacerdote reducido en el salón con el revólver en el suelo y bridas de plástico.",
    leftChoice: {
      id: "c_vir_cura_1",
      label: "Mantener que el falso cura fue un suceso aislado de un perturbado sin conexión con Interior",
      stampText: "TESIS PERTURBADO",
      flavorQuote: "Un chalado con sotana no tiene nada que ver con el gobierno ni con los fondos de seguridad.",
      modifiers: { pastaEnB: 10, presionJudicial: -12, impunidad: 16, reputacionMediatica: -20 },
      grantedFlags: ["VIRAL_TESIS_PERTURBADO_MANTENIDA"]
    },
    rightChoice: {
      id: "c_vir_cura_2",
      label: "Exigir una comisión parlamentaria de investigación urgente con comparecencia del ministro",
      stampText: "COMISIÓN PARLAMENTARIA",
      flavorQuote: "Enviar a un falso cura armado a encañonar a una familia con dinero público es el mayor escándalo del siglo.",
      modifiers: { pastaEnB: -12, presionJudicial: 24, impunidad: -22, reputacionMediatica: 22 },
      grantedFlags: ["VIRAL_COMISION_KITCHEN_ABIERTA"]
    },
    requiredFlags: []
  },
  {
    id: "VIRAL_JAQUEMATE_BBVA_FG_DIMISION",
    speaker: "El Analista Financiero del Financial Times",
    speakerRole: "Corresponsal Bancario en Madrid",
    sphere: "EMPRESARIAL",
    headline: "TERREMOTO EN LA CITY: EL BBVA IMPUTADO Y EL BANQUERO DESTITUIDO POR ESPIONAJE",
    context: "La imputación penal del banco y de su presidente histórico por contratar al comisario de las cloacas para espiar al gobierno provoca una caída del 6% en bolsa y la alarma del Banco Central Europeo.",
    evidenceDocument: "Portada del Financial Times con el titular: 'Spanish Bank BBVA Faces Criminal Indictment Over Corporate Spying'.",
    leftChoice: {
      id: "c_vir_bbva_1",
      label: "Emitir un comunicado corporativo atribuyendo toda la culpa al exjefe de seguridad fallecido",
      stampText: "CULPA AL MUERTO",
      flavorQuote: "El banquero nunca supo nada; el difunto jefe de seguridad actuó por libre sin supervisión.",
      modifiers: { pastaEnB: 12, presionJudicial: -14, impunidad: 18, reputacionMediatica: -16 },
      grantedFlags: ["VIRAL_BBVA_CULPA_MUERTO"]
    },
    rightChoice: {
      id: "c_vir_bbva_2",
      label: "Aceptar una multa ejemplar de la CNMV y revocar todos los privilegios del expresidente",
      stampText: "SANCIÓN HISTÓRICA",
      flavorQuote: "Fráncfort exige cortar de raíz con el pasado oscuro: el banquero queda despojado de honores.",
      modifiers: { pastaEnB: -18, presionJudicial: -18, impunidad: -14, reputacionMediatica: 20 },
      grantedFlags: ["VIRAL_BBVA_SANCION_HISTORICA"]
    },
    requiredFlags: []
  }
];

for (const card of newVirales) {
  if (!pending.find(p => p.id === card.id)) {
    pending.push(card);
  }
}

fs.writeFileSync(PENDING_NEWS_PATH, JSON.stringify(pending, null, 2), 'utf-8');
console.log(`Pending news cards actualizada. Total virales: ${pending.length}`);
