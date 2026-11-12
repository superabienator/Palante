export type PrivilegeCategory =
  | 'ESCUDO_JUDICIAL'
  | 'FONDO_RESERVA'
  | 'CONTROL_PRENSA'
  | 'BLINDAJE_AFORAMIENTO';

export interface PrivilegeDefinition {
  id: number;
  name: string;
  category: PrivilegeCategory;
  shortTag: string;
  description: string;
  inGameEffect: string;
  diceModifiers: {
    presionJudicialDiscount?: number; // Amortigua subidas de presión judicial (UCO/Fiscalía)
    pastaEnBBonus?: number;           // Bonifica ingresos o amortigua gastos en B
    reputacionShield?: number;        // Mitiga caídas de reputación mediática
    impunidadShield?: number;         // Protege contra caídas de impunidad y suplicatorios
  };
}

export const PRIVILEGES_REGISTRY: Record<number, PrivilegeDefinition> = {
  1: {
    id: 1,
    name: 'Recalificación PGOU Monte',
    category: 'FONDO_RESERVA',
    shortTag: 'URBANISMO',
    description: 'Transformación exprés de monte comunal protegido en suelo urbanizable de lujo.',
    inGameEffect: '+3 pts extra en tiradas de recaudación de Pasta en B.',
    diceModifiers: { pastaEnBBonus: 3 },
  },
  2: {
    id: 2,
    name: 'Incendio Forestal Oportuno',
    category: 'FONDO_RESERVA',
    shortTag: 'URBANISMO',
    description: 'Fuego veraniego providencial que despeja hectáreas para un resort con campo de golf.',
    inGameEffect: '+3 pts en tiradas de Pasta en B al recalificar terrenos.',
    diceModifiers: { pastaEnBBonus: 3 },
  },
  3: {
    id: 3,
    name: 'Sepultura de Ruina Romana',
    category: 'ESCUDO_JUDICIAL',
    shortTag: 'OBRA PÚBLICA',
    description: 'Hormigonado nocturno de mosaicos arqueológicos antes de que llegue Patrimonio.',
    inGameEffect: 'Amortigua -3 pts de Presión Judicial en inspecciones.',
    diceModifiers: { presionJudicialDiscount: 3 },
  },
  4: {
    id: 4,
    name: 'Rescate de Radial Quebrada',
    category: 'FONDO_RESERVA',
    shortTag: 'IBEX 35',
    description: 'Socialización de pérdidas de autopistas sin tráfico con cargo al erario público.',
    inGameEffect: '+4 pts en tiradas de Pasta en B y amortiguación de gastos.',
    diceModifiers: { pastaEnBBonus: 4 },
  },
  5: {
    id: 5,
    name: 'Bolsas de Basura en Helipuerto',
    category: 'FONDO_RESERVA',
    shortTag: 'MALAYA',
    description: 'Trasiego de billetes de 500 € en bolsas de plástico negras sin pasar por ventanilla.',
    inGameEffect: '+4 pts de bonificación en tiradas de liquidez opaca.',
    diceModifiers: { pastaEnBBonus: 4 },
  },
  6: {
    id: 6,
    name: 'Cláusula Indemnizatoria Castor',
    category: 'BLINDAJE_AFORAMIENTO',
    shortTag: 'IBEX 35',
    description: 'Blindaje contractual que obliga al Estado a pagar aunque la obra provoque seísmos.',
    inGameEffect: 'Protege +4 pts en tiradas de Impunidad y blindaje empresarial.',
    diceModifiers: { impunidadShield: 4 },
  },
  7: {
    id: 7,
    name: 'Aeropuerto Peatonal sin Aviones',
    category: 'FONDO_RESERVA',
    shortTag: 'DIPUTACIÓN',
    description: 'Terminal internacional inaugurada con banda de música donde solo aterrizan conejos.',
    inGameEffect: '+3 pts en tiradas de comisiones de obra pública.',
    diceModifiers: { pastaEnBBonus: 3 },
  },
  8: {
    id: 8,
    name: 'Donativo Anónimo Planta Noble',
    category: 'FONDO_RESERVA',
    shortTag: 'FINANCIACIÓN',
    description: 'Maletín depositado en el despacho del tesorero por contratistas agradecidos.',
    inGameEffect: '+4 pts en tiradas de Pasta en B.',
    diceModifiers: { pastaEnBBonus: 4 },
  },
  9: {
    id: 9,
    name: 'Sobresueldo en Sobre Manila',
    category: 'BLINDAJE_AFORAMIENTO',
    shortTag: 'CAJA B',
    description: 'Complemento salarial libre de retenciones para mantener callada a la cúpula.',
    inGameEffect: 'Protege +3 pts de Impunidad comprando silencios internos.',
    diceModifiers: { impunidadShield: 3 },
  },
  10: {
    id: 10,
    name: 'Borrado con Martillo a Discos',
    category: 'ESCUDO_JUDICIAL',
    shortTag: 'OBSTRUCCIÓN',
    description: '35 martillazos homologados y formateo de bajo nivel ante el requerimiento del juez.',
    inGameEffect: 'Amortigua -4 pts en cualquier subida de Presión Judicial.',
    diceModifiers: { presionJudicialDiscount: 4 },
  },
  11: {
    id: 11,
    name: 'Misales a la Banca Andorrana',
    category: 'FONDO_RESERVA',
    shortTag: '3% / PUJOL',
    description: 'Transferencia de "legados familiares" codificados como textos litúrgicos en los Pirineos.',
    inGameEffect: '+4 pts en tiradas de Pasta en B.',
    diceModifiers: { pastaEnBBonus: 4 },
  },
  12: {
    id: 12,
    name: 'Mordida del 3% en Obra Civil',
    category: 'FONDO_RESERVA',
    shortTag: 'COMISIONES',
    description: 'Peaje institucional obligatorio en cada licitación de infraestructura pública.',
    inGameEffect: '+3 pts constantes en tiradas de Pasta en B.',
    diceModifiers: { pastaEnBBonus: 3 },
  },
  13: {
    id: 13,
    name: 'Filtración de Cuaderno Contable',
    category: 'CONTROL_PRENSA',
    shortTag: 'PRENSA',
    description: 'Dosificación de fotocopias a directores de periódico para controlar la agenda.',
    inGameEffect: 'Mitiga -4 pts en caídas de Reputación Mediática.',
    diceModifiers: { reputacionShield: 4 },
  },
  14: {
    id: 14,
    name: 'Micrófono en Centro Floral',
    category: 'BLINDAJE_AFORAMIENTO',
    shortTag: 'CLOACAS',
    description: 'Grabación de sobremesas con jueces, ministros y empresarios en reservado de lujo.',
    inGameEffect: 'Protege +4 pts en tiradas de Impunidad mediante chantaje.',
    diceModifiers: { impunidadShield: 4 },
  },
  15: {
    id: 15,
    name: 'Sueldo Reservado al Chófer',
    category: 'ESCUDO_JUDICIAL',
    shortTag: 'KITCHEN',
    description: 'Captación del conductor del extesorero con fondos reservados e ingreso en la Policía.',
    inGameEffect: 'Amortigua -4 pts en subidas de Presión Judicial.',
    diceModifiers: { presionJudicialDiscount: 4 },
  },
  16: {
    id: 16,
    name: 'Subasta de 32 Terabytes de Audios',
    category: 'BLINDAJE_AFORAMIENTO',
    shortTag: 'KOMPROMAT',
    description: 'Archivo encriptado capaz de hacer caer a medio arco parlamentario y tres bancos.',
    inGameEffect: 'Protege +5 pts en tiradas de Impunidad.',
    diceModifiers: { impunidadShield: 5 },
  },
  17: {
    id: 17,
    name: 'Asalto de Falso Cura al Domicilio',
    category: 'ESCUDO_JUDICIAL',
    shortTag: 'OPERACIONES',
    description: 'Incursión parapolicial disfrazada de clérigo para secuestrar pruebas documentales.',
    inGameEffect: 'Amortigua -3 pts de Presión Judicial.',
    diceModifiers: { presionJudicialDiscount: 3 },
  },
  18: {
    id: 18,
    name: 'Borrador Policial Fantasma UDYCO',
    category: 'CONTROL_PRENSA',
    shortTag: 'INTOXICACIÓN',
    description: 'Informe apócrifo sin firma ni membrete filtrado para destruir a rivales políticos.',
    inGameEffect: 'Mitiga -4 pts en caídas de Reputación Mediática.',
    diceModifiers: { reputacionShield: 4 },
  },
  19: {
    id: 19,
    name: 'Purga de Fiscal Anticorrupción',
    category: 'ESCUDO_JUDICIAL',
    shortTag: 'TOGAS',
    description: 'Remoción administrativa del fiscal que osó pedir registros en la sede central.',
    inGameEffect: 'Amortigua -5 pts en subidas de Presión Judicial.',
    diceModifiers: { presionJudicialDiscount: 5 },
  },
  20: {
    id: 20,
    name: 'Pinchazo en Hotel Mayfair Londres',
    category: 'BLINDAJE_AFORAMIENTO',
    shortTag: 'CORONA',
    description: 'Confesiones de comisiones del AVE en suite londinense guardadas bajo siete llaves.',
    inGameEffect: 'Protege +4 pts en tiradas de Impunidad.',
    diceModifiers: { impunidadShield: 4 },
  },
  21: {
    id: 21,
    name: 'Traje Diplomático a Medida',
    category: 'CONTROL_PRENSA',
    shortTag: 'COHECHO',
    description: 'Sastrería de lujo abonada por la trama a cambio de adjudicaciones de eventos.',
    inGameEffect: 'Mitiga -3 pts en caídas de Reputación Mediática.',
    diceModifiers: { reputacionShield: 3 },
  },
  22: {
    id: 22,
    name: 'Cumpleaños con Payaso y Confeti',
    category: 'CONTROL_PRENSA',
    shortTag: 'GÜRTEL',
    description: 'Eventos infantiles y jaguar en el garaje sufragados por la red de congresos.',
    inGameEffect: 'Mitiga -3 pts en caídas de Reputación Mediática.',
    diceModifiers: { reputacionShield: 3 },
  },
  23: {
    id: 23,
    name: 'Partida Presupuestaria 31L Reptil',
    category: 'FONDO_RESERVA',
    shortTag: 'ERE',
    description: 'Fondo de reptiles opaco para repartir subvenciones sin pasar por la Intervención.',
    inGameEffect: '+4 pts en tiradas de Pasta en B.',
    diceModifiers: { pastaEnBBonus: 4 },
  },
  24: {
    id: 24,
    name: 'Chófer con Sobre de Subvención',
    category: 'FONDO_RESERVA',
    shortTag: 'CLIENTELISMO',
    description: 'Ayudas directas desviadas para gastos festivos y redes clientelares provinciales.',
    inGameEffect: '+3 pts en tiradas de Pasta en B.',
    diceModifiers: { pastaEnBBonus: 3 },
  },
  25: {
    id: 25,
    name: 'Foro Deportivo Sin Factura',
    category: 'FONDO_RESERVA',
    shortTag: 'NÓOS',
    description: 'Fundación sin ánimo de lucro que cobra millones por tres folios copiados de internet.',
    inGameEffect: '+4 pts en tiradas de Pasta en B.',
    diceModifiers: { pastaEnBBonus: 4 },
  },
  26: {
    id: 26,
    name: 'Pinchazo Amiguito del Alma',
    category: 'BLINDAJE_AFORAMIENTO',
    shortTag: 'COHECHO',
    description: 'Complicidad fraternal con el presidente autonómico para blindar adjudicaciones.',
    inGameEffect: 'Protege +3 pts en tiradas de Impunidad.',
    diceModifiers: { impunidadShield: 3 },
  },
  27: {
    id: 27,
    name: 'Tarjeta Black sin Retención',
    category: 'FONDO_RESERVA',
    shortTag: 'CAJAS',
    description: 'Plástico opaco fuera de nómina para mariscadas, viajes y lujos libres de Hacienda.',
    inGameEffect: '+4 pts en tiradas de Pasta en B.',
    diceModifiers: { pastaEnBBonus: 4 },
  },
  28: {
    id: 28,
    name: 'Venta de Ladrillo Tóxico a Sareb',
    category: 'FONDO_RESERVA',
    shortTag: 'RESCATE',
    description: 'Empaquetado de solares invendibles transferidos al banco malo con aval estatal.',
    inGameEffect: '+4 pts en tiradas de Pasta en B.',
    diceModifiers: { pastaEnBBonus: 4 },
  },
  29: {
    id: 29,
    name: 'Safari Africano a Costa de Cédulas',
    category: 'CONTROL_PRENSA',
    shortTag: 'CAJAS',
    description: 'Cacerías privadas mientras se colocan preferentes a jubilados en las sucursales.',
    inGameEffect: 'Mitiga -3 pts en caídas de Reputación Mediática.',
    diceModifiers: { reputacionShield: 3 },
  },
  30: {
    id: 30,
    name: 'Folleto Engañoso de Salida a Bolsa',
    category: 'CONTROL_PRENSA',
    shortTag: 'BANKIA',
    description: 'Cuentas maquilladas con beneficios ficticios aplaudidas por todos los reguladores.',
    inGameEffect: 'Mitiga -4 pts en caídas de Reputación Mediática.',
    diceModifiers: { reputacionShield: 4 },
  },
  31: {
    id: 31,
    name: 'Condonación de Crédito Electoral',
    category: 'BLINDAJE_AFORAMIENTO',
    shortTag: 'BANCA',
    description: 'Perdón bancario de deudas millonarias de campaña a cambio de favores regulatorios.',
    inGameEffect: 'Protege +4 pts en tiradas de Impunidad.',
    diceModifiers: { impunidadShield: 4 },
  },
  32: {
    id: 32,
    name: 'Billetes Serie W de la Fábrica',
    category: 'FONDO_RESERVA',
    shortTag: 'PAESA',
    description: 'Sacos de papel moneda recién impreso extraídos sin rastro contable.',
    inGameEffect: '+5 pts en tiradas de Pasta en B.',
    diceModifiers: { pastaEnBBonus: 5 },
  },
  33: {
    id: 33,
    name: 'Esquela y Misa Falsa en Burgos',
    category: 'ESCUDO_JUDICIAL',
    shortTag: 'PAESA',
    description: 'Certificado de defunción tailandés y misa gregoriana para extinguir la causa penal.',
    inGameEffect: 'Amortigua -5 pts en subidas de Presión Judicial.',
    diceModifiers: { presionJudicialDiscount: 5 },
  },
  34: {
    id: 34,
    name: 'Papeles Falsificados de Laos',
    category: 'ESCUDO_JUDICIAL',
    shortTag: 'ROLDÁN',
    description: 'Documentación diplomática inventada para pactar una entrega con delitos limitados.',
    inGameEffect: 'Amortigua -4 pts en subidas de Presión Judicial.',
    diceModifiers: { presionJudicialDiscount: 4 },
  },
  35: {
    id: 35,
    name: 'Valija Diplomática Ginebra-Singapur',
    category: 'FONDO_RESERVA',
    shortTag: 'BLANQUEO',
    description: 'Estructura fiduciaria opaca que mueve divisas por tres continentes en 24 horas.',
    inGameEffect: '+4 pts en tiradas de Pasta en B.',
    diceModifiers: { pastaEnBBonus: 4 },
  },
  36: {
    id: 36,
    name: 'Dictamen de Demencia Sobrevenida',
    category: 'ESCUDO_JUDICIAL',
    shortTag: 'SOBRESEIMIENTO',
    description: 'Informe médico pericial que certifica amnesia selectiva justo el día del juicio oral.',
    inGameEffect: 'Amortigua -5 pts en subidas de Presión Judicial.',
    diceModifiers: { presionJudicialDiscount: 5 },
  },
  37: {
    id: 37,
    name: 'Blindaje Procesal de Urgencia',
    category: 'ESCUDO_JUDICIAL',
    shortTag: 'CRISIS',
    description: 'Recurso de nulidad de actuaciones ante la Sala Segunda para frenar el registro.',
    inGameEffect: 'Amortigua -4 pts en subidas de Presión Judicial.',
    diceModifiers: { presionJudicialDiscount: 4 },
  },
  38: {
    id: 38,
    name: 'Inyección de Furgón de Seguridad',
    category: 'FONDO_RESERVA',
    shortTag: 'CRISIS',
    description: 'Apertura de zulo de emergencia para pagar nóminas en B cuando hay sequía.',
    inGameEffect: '+4 pts en tiradas de Pasta en B.',
    diceModifiers: { pastaEnBBonus: 4 },
  },
  39: {
    id: 39,
    name: 'Maniobra de Pasillo en Comisión',
    category: 'BLINDAJE_AFORAMIENTO',
    shortTag: 'CRISIS',
    description: 'Pacto de silencio entre portavoces para bloquear la votación del suplicatorio.',
    inGameEffect: 'Protege +4 pts en tiradas de Impunidad.',
    diceModifiers: { impunidadShield: 4 },
  },
  40: {
    id: 40,
    name: 'Llamada al Editor del Periódico',
    category: 'CONTROL_PRENSA',
    shortTag: 'CRISIS',
    description: 'Amenaza de retirar la publicidad institucional si se publica la grabación dominical.',
    inGameEffect: 'Mitiga -4 pts en caídas de Reputación Mediática.',
    diceModifiers: { reputacionShield: 4 },
  },
};

export interface AggregatedPerks {
  presionJudicialDiscount: number;
  presionPrivilegeName: string | null;
  pastaEnBBonus: number;
  pastaPrivilegeName: string | null;
  reputacionShield: number;
  reputacionPrivilegeName: string | null;
  impunidadShield: number;
  impunidadPrivilegeName: string | null;
}

/**
 * Calcula los modificadores tácticos activos de acuerdo a los privilegios desbloqueados del personaje.
 * Aplica el mejor privilegio de cada categoría más +1 por cada privilegio adicional de la misma rama (máximo cap de +6)
 * para mantener tensión estratégica sin volver invencible al jugador.
 */
export function calculateAggregatedPerks(unlockedMechanics: number[]): AggregatedPerks {
  let presionJudicialDiscount = 0;
  let presionPrivilegeName: string | null = null;

  let pastaEnBBonus = 0;
  let pastaPrivilegeName: string | null = null;

  let reputacionShield = 0;
  let reputacionPrivilegeName: string | null = null;

  let impunidadShield = 0;
  let impunidadPrivilegeName: string | null = null;

  for (const id of unlockedMechanics) {
    const priv = PRIVILEGES_REGISTRY[id];
    if (!priv) continue;

    if (priv.diceModifiers.presionJudicialDiscount) {
      if (priv.diceModifiers.presionJudicialDiscount > presionJudicialDiscount) {
        presionJudicialDiscount = priv.diceModifiers.presionJudicialDiscount;
        presionPrivilegeName = priv.name;
      } else {
        presionJudicialDiscount = Math.min(6, presionJudicialDiscount + 1);
      }
    }

    if (priv.diceModifiers.pastaEnBBonus) {
      if (priv.diceModifiers.pastaEnBBonus > pastaEnBBonus) {
        pastaEnBBonus = priv.diceModifiers.pastaEnBBonus;
        pastaPrivilegeName = priv.name;
      } else {
        pastaEnBBonus = Math.min(6, pastaEnBBonus + 1);
      }
    }

    if (priv.diceModifiers.reputacionShield) {
      if (priv.diceModifiers.reputacionShield > reputacionShield) {
        reputacionShield = priv.diceModifiers.reputacionShield;
        reputacionPrivilegeName = priv.name;
      } else {
        reputacionShield = Math.min(6, reputacionShield + 1);
      }
    }

    if (priv.diceModifiers.impunidadShield) {
      if (priv.diceModifiers.impunidadShield > impunidadShield) {
        impunidadShield = priv.diceModifiers.impunidadShield;
        impunidadPrivilegeName = priv.name;
      } else {
        impunidadShield = Math.min(6, impunidadShield + 1);
      }
    }
  }

  return {
    presionJudicialDiscount,
    presionPrivilegeName,
    pastaEnBBonus,
    pastaPrivilegeName,
    reputacionShield,
    reputacionPrivilegeName,
    impunidadShield,
    impunidadPrivilegeName,
  };
}
