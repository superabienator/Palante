import { SphereType } from '../types/story';

export interface RecurringCharacter {
  id: string;
  name: string;
  role: string;
  portraitUrl: string;
}

const RECURRING_CAST: Record<string, RecurringCharacter> = {
  CONSTRUCTOR: {
    id: 'CONSTRUCTOR',
    name: 'Don Romualdo',
    role: 'Constructor del Palillo',
    portraitUrl: '/art/archetypes/alquimista_hormigonera.webp',
  },
  COMISARIO: {
    id: 'COMISARIO',
    name: 'Comisario Pepe',
    role: 'Cloacas de Interior',
    portraitUrl: '/art/characters/comisario_villarejo.webp',
  },
  MAGISTRADO: {
    id: 'MAGISTRADO',
    name: 'Magistrado Cándido',
    role: 'Audiencia Nacional',
    portraitUrl: '/art/characters/magistrado_candido.webp',
  },
  TESORERO: {
    id: 'TESORERO',
    name: 'El Tesorero',
    role: 'Custodio de la Caja B',
    portraitUrl: '/art/archetypes/custodio_libreta.webp',
  },
  DIRECTOR_PRENSA: {
    id: 'DIRECTOR_PRENSA',
    name: 'Director del Diario',
    role: 'Paz Editorial y Portadas',
    portraitUrl: '/art/characters/director_diario.webp',
  },
  SECRETARIA: {
    id: 'SECRETARIA',
    name: 'La Secretaria',
    role: 'Finiquitos en Diferido',
    portraitUrl: '/art/characters/dama_finiquito.webp',
  },
  BANQUERO: {
    id: 'BANQUERO',
    name: 'El Banquero',
    role: 'Cajas y Tarjetas Black',
    portraitUrl: '/art/characters/banquero_blesa.webp',
  },
  FISCAL: {
    id: 'FISCAL',
    name: 'El Fiscal Tapón',
    role: 'Ministerio Público',
    portraitUrl: '/art/archetypes/tapon_institucional.webp',
  },
  BARON_IBEX: {
    id: 'BARON_IBEX',
    name: 'El Barón del Palco',
    role: 'Oligarca del IBEX 35',
    portraitUrl: '/art/characters/florentino_palco.webp',
  },
  PORTAVOZ: {
    id: 'PORTAVOZ',
    name: 'El Portavoz',
    role: 'Aparato del Partido',
    portraitUrl: '/art/archetypes/pasante_giratorio.webp',
  },
};

const KEYWORD_TO_CAST: Array<[string[], keyof typeof RECURRING_CAST]> = [
  [['comisario', 'pepe', 'villarejo', 'policía', 'uco', 'cloaca', 'guardia', 'agente', 'sicario'], 'COMISARIO'],
  [['juez', 'magistrado', 'cándido', 'candido', 'tribunal', 'supremo', 'audiencia', 'sala'], 'MAGISTRADO'],
  [['fiscal', 'tapón', 'abogado', 'letrado', 'perito', 'notario'], 'FISCAL'],
  [['tesorero', 'contable', 'libreta', 'caja b', 'sobre', 'informático', 'martillo', 'pendrive', 'chófer', 'chofer'], 'TESORERO'],
  [['director', 'diario', 'prensa', 'periodista', 'tertulia', 'medios', 'cadena', 'tele', 'portada'], 'DIRECTOR_PRENSA'],
  [['secretaria', 'finiquito', 'jefa de gabinete', 'asesora', 'ministra', 'diputada'], 'SECRETARIA'],
  [['banquero', 'blesa', 'bankia', 'caja', 'fiduciario', 'suiza', 'panamá', 'offshore', 'blanqueo'], 'BANQUERO'],
  [['florentino', 'barón', 'palco', 'ibex', 'eléctrica', 'multinacional', 'aerolínea', 'energética'], 'BARON_IBEX'],
  [['romualdo', 'constructor', 'ladrillo', 'hormigón', 'obra', 'urbanismo', 'alcalde', 'autopista', 'golf', 'concesionario'], 'CONSTRUCTOR'],
];

/**
 * Mapea cualquiera de los 292 interlocutores del mazo a uno de los 10 personajes
 * recurrentes de la corte, logrando reconocimiento visual inmediato estilo Reigns.
 */
export function resolveRecurringCharacter(
  speaker: string,
  speakerRole: string,
  sphere?: SphereType
): RecurringCharacter {
  const haystack = `${speaker} ${speakerRole}`.toLowerCase();

  for (const [keywords, castKey] of KEYWORD_TO_CAST) {
    if (keywords.some((kw) => haystack.includes(kw))) {
      return RECURRING_CAST[castKey];
    }
  }

  if (sphere === 'EMPRESARIAL') return RECURRING_CAST.CONSTRUCTOR;
  if (sphere === 'ORDEN_JUSTICIA') return RECURRING_CAST.MAGISTRADO;
  return RECURRING_CAST.PORTAVOZ;
}
