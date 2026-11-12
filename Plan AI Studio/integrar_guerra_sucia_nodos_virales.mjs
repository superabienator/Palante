import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const STORY_PATH = path.join(ROOT, 'src', 'content', 'story.json');
const PENDING_NEWS_PATH = path.join(ROOT, 'src', 'content', 'pendingNewsCards.json');

// 1. Nodos de historia en story.json
const story = JSON.parse(fs.readFileSync(STORY_PATH, 'utf-8'));

story.nodes['nodo_guerra_intxaurrondo_cumbre'] = {
  id: "nodo_guerra_intxaurrondo_cumbre",
  archetypeId: "FONTANERO_INTERIOR",
  sphere: "ORDEN_JUSTICIA",
  headline: "EL BASTIÓN DE INTXAURRONDO: LÍNEA ROJA Y FONDOS RESERVADOS",
  context: "El general Rodríguez Galindo te recibe en su despacho del acuartelamiento. Sobre la mesa hay maletines con billetes de la serie W y carpetas de vigilancia sobre el sur de Francia. Exige inmunidad total para sus subordinados y el blindaje judicial del Palacio de La Cumbre.",
  evidenceDocument: "Informe de los servicios secretos militares con el esquema del mando único antiterrorista y el listado de fondos especiales.",
  choices: [
    {
      id: "c_intx_node_1",
      label: "Firmar el blindaje del cuartel y ascender al coronel a general en el BOE",
      flavorQuote: "En la primera línea del Estado no se fiscalizan los métodos: la lealtad se premia con galones.",
      mechanicId: 40,
      modifiers: { pastaEnB: 20, presionJudicial: 15, impunidad: 35 },
      nextNodeId: "nodo_guerra_guadalajara_indulto"
    },
    {
      id: "c_intx_node_2",
      label: "Ordenar la inspección judicial de los sótanos y someter la unidad al Estado de derecho",
      flavorQuote: "La democracia no tolera cuarteles al margen de la Constitución: caiga quien caiga.",
      mechanicId: 38,
      modifiers: { pastaEnB: -15, presionJudicial: -25, impunidad: -20 },
      nextNodeId: "proconsul_fin_sobreseimiento"
    }
  ],
  ending: "SOBRESEIMIENTO_BOTIN"
};

story.nodes['nodo_guerra_guadalajara_indulto'] = {
  id: "nodo_guerra_guadalajara_indulto",
  archetypeId: "ARQUITECTO_SOBRESEIMIENTO",
  sphere: "POLITICA",
  headline: "LA PUERTA DE GUADALAJARA: EL INDULTO NAVIDEÑO DE NOCHEBUENA",
  context: "Tras la condena del Tribunal Supremo a diez años de prisión para el exministro y su secretario de Estado, miles de militantes desfilan frente al penal. En los despachos de Moncloa se redacta el decreto de indulto parcial de dos tercios para sacarlos en tercer grado.",
  evidenceDocument: "Borrador de Real Decreto de indulto por razones de equidad y pacificación social con informe favorable de la fiscalía.",
  choices: [
    {
      id: "c_guad_node_1",
      label: "Publicar el indulto en el BOE extraordinario de Nochebuena y abrir el régimen abierto",
      flavorQuote: "Pacificar el Estado y proteger a los nuestros: tres meses de prisión y a casa con pensión vitalicia.",
      mechanicId: 16,
      modifiers: { pastaEnB: 25, presionJudicial: -30, impunidad: 45 },
      nextNodeId: "nodo_inicio_proconsul"
    },
    {
      id: "c_guad_node_2",
      label: "Denegar el indulto y exigir el cumplimiento íntegro de la pena impuesta por el Supremo",
      flavorQuote: "Quien secuestró a ciudadanos inocentes debe cumplir la condena: la ley es igual para todos.",
      mechanicId: 38,
      modifiers: { pastaEnB: -18, presionJudicial: 25, impunidad: -30 },
      nextNodeId: "proconsul_fin_sobreseimiento"
    }
  ],
  ending: "INDULTO_EXPRES"
};

fs.writeFileSync(STORY_PATH, JSON.stringify(story, null, 2), 'utf-8');
console.log(`Story actualizada. Total nodos: ${Object.keys(story.nodes).length}`);

// 2. Virales en pendingNewsCards.json
const pending = JSON.parse(fs.readFileSync(PENDING_NEWS_PATH, 'utf-8'));

const newVirales = [
  {
    id: "VIRAL_GUERRA_FOSA_ALICANTE",
    speaker: "El Cronista de Sucesos de El País",
    speakerRole: "Investigador de Fosas Clandestinas",
    sphere: "ORDEN_JUSTICIA",
    headline: "IDENTIFICADOS EN ALICANTE: LOS CUERPOS ENTERRADOS EN CAL VIVA ERAN DE GUIPÚZCOA",
    context: "El cotejo genético confirma que los restos humanos hallados con 50 kilos de cal viva en Alicante pertenecen a los dos jóvenes secuestrados diez años atrás. La Audiencia Nacional reabre la macrocausa contra la cúpula de seguridad.",
    evidenceDocument: "Informe de toxicología y antropología forense confirmando muerte por herida de arma de fuego y enterramiento con cal.",
    leftChoice: {
      id: "c_vir_fosa_1",
      label: "Alegar prescripción de los delitos y recurrir las pruebas periciales de ADN",
      stampText: "RECURSO PRESCRIPCIÓN",
      flavorQuote: "Han pasado diez años; sin confesiones de parte no hay acusación que sostenga la sala.",
      modifiers: { pastaEnB: 12, presionJudicial: -16, impunidad: 22, reputacionMediatica: -20 },
      grantedFlags: ["VIRAL_FOSA_PRESCRIPCION"]
    },
    rightChoice: {
      id: "c_vir_fosa_2",
      label: "Procesar a todos los mandos implicados sin atender a privilegios militares",
      stampText: "JUSTICIA PLENA",
      flavorQuote: "Ni el uniforme ni la cal viva tapan el crimen de Estado: todos al banquillo.",
      modifiers: { pastaEnB: -14, presionJudicial: 24, impunidad: -26, reputacionMediatica: 24 },
      grantedFlags: ["VIRAL_PROCESAMIENTO_FOSA"]
    },
    requiredFlags: []
  },
  {
    id: "VIRAL_GUERRA_MARCHA_GUADALAJARA",
    speaker: "El Enviado Especial a Guadalajara",
    speakerRole: "Periodista a las Puertas del Penal",
    sphere: "POLITICA",
    headline: "IMÁGENES HISTÓRICAS: EL EXPRESIDENTE ABRAZA A LOS CONDENADOS EN LA PUERTA DEL PENAL",
    context: "La retransmisión televisiva del desfile de barones políticos y miles de militantes despidiendo con puño en alto a Barrionuevo y Vera en la cárcel de Guadalajara divide al país y despierta protestas internacionales.",
    evidenceDocument: "Fotografía de primera plana en periódicos internacionales con el titular: 'Government Leaders Escort Convicted Ministers to Prison Gate'.",
    leftChoice: {
      id: "c_vir_guad_1",
      label: "Reivindicar el acto como una muestra insuperable de lealtad política y compañerismo",
      stampText: "LEALTAD HISTÓRICA",
      flavorQuote: "A los compañeros se les arropa siempre; la historia nos dará la razón frente a las togas.",
      modifiers: { pastaEnB: 14, presionJudicial: 12, impunidad: 20, reputacionMediatica: -22 },
      grantedFlags: ["VIRAL_LEALTAD_DEFENDIDA"]
    },
    rightChoice: {
      id: "c_vir_guad_2",
      label: "Condenar el mitin a las puertas de la prisión como una afrenta intolerable a la judicatura",
      stampText: "AFRENTA JUDICIAL",
      flavorQuote: "Convertir la entrada en prisión de gobernantes condenados por secuestro en una fiesta es indigno.",
      modifiers: { pastaEnB: -12, presionJudicial: -18, impunidad: -20, reputacionMediatica: 22 },
      grantedFlags: ["VIRAL_CONDENA_MITIN_GUADALAJARA"]
    },
    requiredFlags: []
  },
  {
    id: "VIRAL_GUERRA_MICROFICHAS_CESID",
    speaker: "La Analista de Defensa de El Mundo",
    speakerRole: "Especialista en Inteligencia Militar",
    sphere: "ORDEN_JUSTICIA",
    headline: "ESCÁNDALO DE LAS MICROFICHAS: EL CORONEL PEROTE SUSTRAE EL ARCHIVO SECRETO DEL ESTADO",
    context: "La sustracción de miles de fichas fotográficas del búnker del CESID con escuchas telefónicas y operativos clandestinos desata una crisis militar sin precedentes y la dimisión en cadena de la cúpula de Defensa.",
    evidenceDocument: "Catálogo de documentos clasificados como secreto militar incautados en registros a banqueros y coroneles.",
    leftChoice: {
      id: "c_vir_pero_1",
      label: "Clasificar la investigación judicial bajo secreto de Estado y celebrar el consejo de guerra a puerta cerrada",
      stampText: "CONSEJO CERRADO",
      flavorQuote: "Los trapos sucios del espionaje militar se lavan en tribunal militar sin prensa ni cámaras.",
      modifiers: { pastaEnB: 12, presionJudicial: -18, impunidad: 22, reputacionMediatica: -18 },
      grantedFlags: ["VIRAL_CONSEJO_GUERRA_CERRADO"]
    },
    rightChoice: {
      id: "c_vir_pero_2",
      label: "Desclasificar los documentos y someter al servicio secreto al control del parlamento",
      stampText: "CONTROL PARLAMENTARIO",
      flavorQuote: "El servicio secreto militar no puede ser un poder opaco ajeno a la soberanía popular.",
      modifiers: { pastaEnB: -14, presionJudicial: 22, impunidad: -22, reputacionMediatica: 24 },
      grantedFlags: ["VIRAL_CESID_DESCLASIFICADO"]
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
