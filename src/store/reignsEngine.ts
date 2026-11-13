import {
  CharacterStats,
  EndingType,
  GameOverReason,
  InExtremisCriticalStat,
  InExtremisStatus,
  LegislativeStageInfo,
  LegislativeYear,
  ReignsCard,
  RiskAssessment,
  RiskLevel,
  StatModifiers,
  CLIMAX_CARD_ID,
} from '../types/story';

export type { InExtremisCriticalStat, InExtremisStatus };

export interface StatVariance {
  base: number;
  min: number;
  max: number;
  diceNotation: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export type ProjectedStatsRange = Partial<Record<keyof CharacterStats, StatVariance>>;

export interface SingleStatRollResult {
  statKey: keyof CharacterStats;
  statLabel: string;
  baseDelta: number;
  rolledDelta: number;
  min: number;
  max: number;
  diceFace: number; // 1..6
  diceNotation: string;
  statBefore?: number;
  statAfter?: number;
  privilegeApplied?: {
    name: string;
    amount: number;
  };
}

export interface LastDiceRollSummary {
  id: string;
  direction: 'left' | 'right';
  stampText: string;
  cardHeadline?: string;
  choiceLabel?: string;
  flavorQuote?: string;
  unlockedPrivilegeId?: number;
  rolls: SingleStatRollResult[];
  timestamp: number;
}

export interface ActivatedPrivilegeInfo {
  id: number;
  name: string;
  category?: string;
  shortTag?: string;
  description?: string;
  inGameEffect?: string;
  isNewUnlock: boolean;
  timestamp: number;
}

export const STAT_LABELS: Record<keyof CharacterStats, string> = {
  pastaEnB: 'Pasta en B',
  presionJudicial: 'Presión Judicial',
  impunidad: 'Impunidad',
  reputacionMediatica: 'Reputación Mediática',
};

export const clampStat = (value: number, delta: number | undefined = 0): number => {
  const nextValue = value + (delta ?? 0);
  return Math.max(0, Math.min(100, Math.round(nextValue)));
};

export const applyModifiers = (
  current: CharacterStats,
  modifiers: StatModifiers
): CharacterStats => {
  return {
    pastaEnB: clampStat(current.pastaEnB, modifiers.pastaEnB),
    presionJudicial: clampStat(current.presionJudicial, modifiers.presionJudicial),
    impunidad: clampStat(current.impunidad, modifiers.impunidad),
    reputacionMediatica: clampStat(current.reputacionMediatica, modifiers.reputacionMediatica),
  };
};

export function calculateStatVariance(baseDelta: number): StatVariance {
  if (baseDelta === 0) {
    return {
      base: 0,
      min: 0,
      max: 0,
      diceNotation: '1d6',
      riskLevel: 'LOW',
    };
  }

  const absVal = Math.abs(baseDelta);
  const riskLevel: StatVariance['riskLevel'] =
    absVal <= 5 ? 'LOW' : absVal <= 14 ? 'MEDIUM' : 'HIGH';

  const min =
    baseDelta > 0
      ? Math.max(1, Math.round(baseDelta * 0.6))
      : Math.round(baseDelta * 1.6);
  const max =
    baseDelta > 0
      ? Math.round(baseDelta * 1.6)
      : Math.min(-1, Math.round(baseDelta * 0.6));

  return {
    base: baseDelta,
    min,
    max,
    diceNotation: '1d6',
    riskLevel,
  };
}

export function calculateProjectedStatsRange(
  modifiers: StatModifiers
): ProjectedStatsRange {
  const result: ProjectedStatsRange = {};
  const keys: Array<keyof CharacterStats> = [
    'pastaEnB',
    'presionJudicial',
    'impunidad',
    'reputacionMediatica',
  ];

  for (const key of keys) {
    const val = modifiers[key];
    if (val !== undefined && val !== 0) {
      result[key] = calculateStatVariance(val);
    }
  }

  return result;
}

export function rollModifiersWithDice(
  modifiers: StatModifiers,
  direction: 'left' | 'right',
  stampText: string,
  forcedRoll?: number
): { rolledModifiers: StatModifiers; summary: LastDiceRollSummary } {
  const rangeMap = calculateProjectedStatsRange(modifiers);
  const rolledModifiers: StatModifiers = {};
  const rolls: SingleStatRollResult[] = [];

  const keys: Array<keyof CharacterStats> = [
    'pastaEnB',
    'presionJudicial',
    'impunidad',
    'reputacionMediatica',
  ];

  for (const key of keys) {
    const variance = rangeMap[key];
    if (!variance) continue;

    const diceFace =
      forcedRoll !== undefined
        ? Math.max(1, Math.min(6, Math.round(forcedRoll)))
        : Math.floor(Math.random() * 6) + 1;
    const factor = 0.6 + ((diceFace - 1) / 5) * 1.0;
    const rawRolled = Math.round(variance.base * factor);
    const rolledDelta = Math.max(variance.min, Math.min(variance.max, rawRolled));
    rolledModifiers[key] = rolledDelta;

    rolls.push({
      statKey: key,
      statLabel: STAT_LABELS[key],
      baseDelta: variance.base,
      rolledDelta,
      min: variance.min,
      max: variance.max,
      diceFace,
      diceNotation: variance.diceNotation,
    });
  }

  return {
    rolledModifiers,
    summary: {
      id: `roll_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      direction,
      stampText,
      rolls,
      timestamp: Date.now(),
    },
  };
}

export function checkReignsGameOver(
  stats: CharacterStats,
  cardsSurvived: number
): {
  isGameOver: boolean;
  reason: GameOverReason | null;
  ending: EndingType | null;
  description: string | null;
} {
  // 1. Supervivencia de Legislatura (Victoria a 25 cartas / ~6 años y medio de mandato)
  if (cardsSurvived >= 25) {
    return {
      isGameOver: true,
      reason: 'VICTORIA_LEGISLATURA',
      ending: 'CONSEJO_IBEX',
      description:
        '¡LEGISLATURA SUPERADA! Has toreado a la fiscalía, blindado tu patrimonio y asegurado un sillón vitalicio de 450.000 € anuales en el consejo de administración de una multinacional del IBEX 35.',
    };
  }

  // 2. Pasta en B (0 o 100)
  if (stats.pastaEnB <= 0) {
    return {
      isGameOver: true,
      reason: 'PASTA_MINIMA',
      ending: 'PURGA_DE_OFICIO',
      description:
        'BANCARROTA POLÍTICA. Te has quedado sin liquidez opaca para abonar los sobresueldos del aparato. El partido te retira el blindaje y te expulsa por insolvente.',
    };
  }
  if (stats.pastaEnB >= 100) {
    return {
      isGameOver: true,
      reason: 'PASTA_MAXIMA',
      ending: 'PRISION_INCONDICIONAL',
      description:
        'ALERTA INTERNACIONAL DE BLANQUEO. Tus cuentas en Ginebra cantan tanto que Europol y la fiscalía suiza bloquean todas tus sociedades pantalla. Detención coordinada.',
    };
  }

  // 3. Presión Judicial (techo en 100)
  if (stats.presionJudicial >= 100) {
    return {
      isGameOver: true,
      reason: 'PRESION_MAXIMA',
      ending: 'PRISION_INCONDICIONAL',
      description:
        'PRISIÓN INCONDICIONAL EN SOTO DEL REAL. Agentes de la UCO tiran abajo la puerta de tu domicilio de madrugada. El juez de la Audiencia decreta prisión comunicada y sin fianza.',
    };
  }

  // 4. Impunidad (colapso a 0)
  if (stats.impunidad <= 0) {
    return {
      isGameOver: true,
      reason: 'IMPUNIDAD_MINIMA',
      ending: 'PRISION_INCONDICIONAL',
      description:
        'PÉRDIDA DEL AFORAMIENTO. El Congreso vota unánimemente el suplicatorio. Sin aforamiento ni padrinos, vas directo al banquillo del tribunal penal ordinario.',
    };
  }

  // 5. Reputación Mediática (colapso a 0)
  if (stats.reputacionMediatica <= 0) {
    return {
      isGameOver: true,
      reason: 'REPUTACION_MINIMA',
      ending: 'PURGA_DE_OFICIO',
      description:
        'LINCHAMIENTO EDITORIAL. Portadas unánimes con tus escuchas más obscenas. El presidente del Gobierno comparece de urgencia para anunciar tu expulsión fulminante.',
    };
  }

  return { isGameOver: false, reason: null, ending: null, description: null };
}

/**
 * Evalúa si el personaje se encuentra en estado de "Rata Acorralada" (In Extremis).
 * Se activa si:
 * - pastaEnB <= 15 (bancarrota) o >= 85 (alerta antiblanqueo)
 * - presionJudicial >= 80 (UCO en la puerta)
 * - impunidad <= 15 (pérdida de aforamiento)
 * - reputacionMediatica <= 15 (linchamiento editorial)
 */
export function getInExtremisStatus(stats: CharacterStats): InExtremisStatus {
  const criticalStats: InExtremisCriticalStat[] = [];

  if (stats.pastaEnB <= 15) {
    criticalStats.push({
      key: 'pastaEnB',
      label: STAT_LABELS.pastaEnB,
      value: stats.pastaEnB,
      dangerType: 'MIN_DANGER',
    });
  } else if (stats.pastaEnB >= 85) {
    criticalStats.push({
      key: 'pastaEnB',
      label: STAT_LABELS.pastaEnB,
      value: stats.pastaEnB,
      dangerType: 'MAX_DANGER',
    });
  }

  if (stats.presionJudicial >= 80) {
    criticalStats.push({
      key: 'presionJudicial',
      label: STAT_LABELS.presionJudicial,
      value: stats.presionJudicial,
      dangerType: 'MAX_DANGER',
    });
  }

  if (stats.impunidad <= 15) {
    criticalStats.push({
      key: 'impunidad',
      label: STAT_LABELS.impunidad,
      value: stats.impunidad,
      dangerType: 'MIN_DANGER',
    });
  }

  if (stats.reputacionMediatica <= 15) {
    criticalStats.push({
      key: 'reputacionMediatica',
      label: STAT_LABELS.reputacionMediatica,
      value: stats.reputacionMediatica,
      dangerType: 'MIN_DANGER',
    });
  }

  return {
    active: criticalStats.length > 0,
    criticalStats,
  };
}

/**
 * Calcula el peso efectivo de una carta.
 * Reglas:
 * 1. Cartas In Extremis (isInExtremis === true):
 *    - Si inExtremisStatus.active === false: peso 0 (reservadas exclusivamente para acorralados).
 *    - Si inExtremisStatus.active === true: peso x10 base.
 *    - Si además targetDangerStat coincide con alguna estadística crítica actual: peso x20.
 * 2. Cartas normales / sagas:
 *    - Si requiredFlags coincide con recentlyGrantedFlags (últimos 3 turnos): peso x5.
 */
export function calculateCardWeight(
  card: ReignsCard,
  recentlyGrantedFlags: string[] = [],
  inExtremisStatus?: InExtremisStatus
): number {
  if (card.isInExtremis) {
    if (!inExtremisStatus || !inExtremisStatus.active) {
      return 0; // Reservada exclusivamente para momentos acorralados
    }

    let multiplier = 10;
    if (
      card.targetDangerStat &&
      inExtremisStatus.criticalStats.some((s) => s.key === card.targetDangerStat)
    ) {
      multiplier = 20; // 20x si rescata específicamente la estadística en peligro
    }

    return (card.weight ?? 1) * multiplier;
  }

  let baseWeight = card.weight ?? 1;
  if (
    card.requiredFlags &&
    card.requiredFlags.length > 0 &&
    card.requiredFlags.some((flag) => recentlyGrantedFlags.includes(flag))
  ) {
    baseWeight *= 5;
  }
  return baseWeight;
}

/**
 * Selección ponderada dentro de un subconjunto de cartas.
 */
export function weightedRandomSelect(
  cards: ReignsCard[],
  recentlyGrantedFlags: string[] = [],
  inExtremisStatus?: InExtremisStatus,
  rng: () => number = Math.random
): ReignsCard | null {
  if (cards.length === 0) return null;

  const validCards = cards.filter(
    (c) => calculateCardWeight(c, recentlyGrantedFlags, inExtremisStatus) > 0
  );
  if (validCards.length === 0) return null;
  if (validCards.length === 1) return validCards[0];

  const weights = validCards.map((c) =>
    calculateCardWeight(c, recentlyGrantedFlags, inExtremisStatus)
  );
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  if (totalWeight <= 0) {
    const idx = Math.floor(rng() * validCards.length);
    return validCards[idx];
  }

  let roll = rng() * totalWeight;
  for (let i = 0; i < validCards.length; i++) {
    roll -= weights[i];
    if (roll <= 0) {
      return validCards[i];
    }
  }

  return validCards[validCards.length - 1];
}

export interface SelectNextCardParams {
  allCards: ReignsCard[];
  activeFlags: Record<string, boolean>;
  currentCardId?: string;
  cardsSurvived: number;
  recentlyGrantedFlags?: string[];
  inExtremisStatus?: InExtremisStatus;
  currentStats?: CharacterStats;
  rng?: () => number;
}

/**
 * Motor central de selección procedural de cartas (Estilo Reigns Puro):
 * 1. Inyección obligatoria de la carta de clímax (CLIMAX_CARD_ID) en trimestre 24 (cardsSurvived === 23).
 * 2. Filtrado de cartas elegibles según banderas activas y estado in extremis.
 * 3. Descarte de la carta actual si hay alternativas disponibles.
 * 4. Encadenamiento de sagas: peso x5 para cartas con requiredFlags en recentlyGrantedFlags.
 * 5. Rata acorralada: cartas isInExtremis con peso 10x/20x en estado crítico, peso 0 en estado normal.
 */
export function selectNextReignsCard({
  allCards,
  activeFlags,
  currentCardId,
  cardsSurvived,
  recentlyGrantedFlags = [],
  inExtremisStatus,
  currentStats,
  rng = Math.random,
}: SelectNextCardParams): ReignsCard | null {
  const inExtremis =
    inExtremisStatus ??
    (currentStats ? getInExtremisStatus(currentStats) : { active: false, criticalStats: [] });

  // 1. Inyección obligatoria de clímax en el trimestre 24 (cardsSurvived === 23)
  if (cardsSurvived === 23) {
    const climaxCard = allCards.find((c) => c.id === CLIMAX_CARD_ID);
    if (climaxCard) {
      return climaxCard;
    }
  }

  // 2. Elegibilidad por banderas (la carta de clímax no debe salir antes del trimestre 24, y las de in extremis solo si acorralado)
  const eligible = allCards.filter((card) => {
    if (card.id === CLIMAX_CARD_ID && cardsSurvived !== 23) {
      return false;
    }
    if (card.isInExtremis && !inExtremis.active) {
      return false; // Reservada exclusivamente para momentos in extremis
    }
    if (!card.requiredFlags || card.requiredFlags.length === 0) {
      return true;
    }
    return card.requiredFlags.every((flag) => !!activeFlags[flag]);
  });

  if (eligible.length === 0) {
    return null;
  }

  // 3. Descartar la carta actual si hay alternativas
  const candidates = eligible.filter((c) => c.id !== currentCardId);
  const pool = candidates.length > 0 ? candidates : eligible;

  // 4. Selección ponderada pura por estado de medidores y sagas
  return weightedRandomSelect(pool, recentlyGrantedFlags, inExtremis, rng);
}

/**
 * Semáforo de riesgo mortal para decisiones Reigns:
 * Evalúa las estadísticas actuales junto con el rango proyectado de la decisión.
 * Devuelve SAFE, VOLATILE o LETHAL con desglose de estadísticas en peligro.
 */
export function calculateRiskAssessment(
  currentStats: CharacterStats,
  projectedRange: ProjectedStatsRange | null
): RiskAssessment {
  const dangerStats: RiskAssessment['dangerStats'] = [];
  const statKeys: Array<keyof CharacterStats> = [
    'pastaEnB',
    'presionJudicial',
    'impunidad',
    'reputacionMediatica',
  ];

  for (const key of statKeys) {
    const currentVal = currentStats[key] ?? 50;
    const variance = projectedRange?.[key];

    const minProjected = variance !== undefined ? currentVal + variance.min : currentVal;
    const maxProjected = variance !== undefined ? currentVal + variance.max : currentVal;

    if (key === 'pastaEnB') {
      if (minProjected <= 0) {
        dangerStats.push({
          statKey: 'pastaEnB',
          statLabel: STAT_LABELS.pastaEnB,
          bound: 'MIN',
          lethal: true,
        });
      } else if (minProjected < 15) {
        dangerStats.push({
          statKey: 'pastaEnB',
          statLabel: STAT_LABELS.pastaEnB,
          bound: 'MIN',
          lethal: false,
        });
      }

      if (maxProjected >= 100) {
        dangerStats.push({
          statKey: 'pastaEnB',
          statLabel: STAT_LABELS.pastaEnB,
          bound: 'MAX',
          lethal: true,
        });
      } else if (maxProjected > 85) {
        dangerStats.push({
          statKey: 'pastaEnB',
          statLabel: STAT_LABELS.pastaEnB,
          bound: 'MAX',
          lethal: false,
        });
      }
    } else if (key === 'presionJudicial') {
      if (maxProjected >= 100) {
        dangerStats.push({
          statKey: 'presionJudicial',
          statLabel: STAT_LABELS.presionJudicial,
          bound: 'MAX',
          lethal: true,
        });
      } else if (maxProjected > 85) {
        dangerStats.push({
          statKey: 'presionJudicial',
          statLabel: STAT_LABELS.presionJudicial,
          bound: 'MAX',
          lethal: false,
        });
      }
    } else if (key === 'impunidad') {
      if (minProjected <= 0) {
        dangerStats.push({
          statKey: 'impunidad',
          statLabel: STAT_LABELS.impunidad,
          bound: 'MIN',
          lethal: true,
        });
      } else if (minProjected < 15) {
        dangerStats.push({
          statKey: 'impunidad',
          statLabel: STAT_LABELS.impunidad,
          bound: 'MIN',
          lethal: false,
        });
      }
    } else if (key === 'reputacionMediatica') {
      if (minProjected <= 0) {
        dangerStats.push({
          statKey: 'reputacionMediatica',
          statLabel: STAT_LABELS.reputacionMediatica,
          bound: 'MIN',
          lethal: true,
        });
      } else if (minProjected < 15) {
        dangerStats.push({
          statKey: 'reputacionMediatica',
          statLabel: STAT_LABELS.reputacionMediatica,
          bound: 'MIN',
          lethal: false,
        });
      }
    }
  }

  let level: RiskLevel = 'SAFE';
  let explanation =
    'PARÁMETROS CONTROLADOS: Márgenes de impunidad institucional y estabilidad procesal dentro de la normalidad.';

  const lethalDangers = dangerStats.filter((d) => d.lethal);
  const volatileDangers = dangerStats.filter((d) => !d.lethal);

  if (lethalDangers.length > 0) {
    level = 'LETHAL';
    const lethalList = lethalDangers
      .map((d) => `${d.statLabel} (${d.bound === 'MAX' ? 'techo 100%' : 'colapso 0%'})`)
      .join(', ');
    explanation = `PELIGRO PROCESAL INMINENTE: La decisión puede provocar la caída irreversible del régimen por: ${lethalList}.`;
  } else if (volatileDangers.length > 0) {
    level = 'VOLATILE';
    const volatileList = volatileDangers
      .map((d) => `${d.statLabel} (${d.bound === 'MAX' ? '> 85%' : '< 15%'})`)
      .join(', ');
    explanation = `ALERTA DE ALTA VOLATILIDAD: La acción sitúa variables clave en umbral crítico de crisis procesal: ${volatileList}.`;
  }

  return {
    level,
    dangerStats,
    explanation,
  };
}

/**
 * Información contextual de la etapa y trimestre de la legislatura:
 * 4 años, divididos en trimestres (trimestre 24 = Clímax del Tribunal Supremo).
 */
export function getLegislativeStageInfo(cardsSurvived: number): LegislativeStageInfo {
  const quarter = cardsSurvived + 1;
  let year: LegislativeYear = 1;
  if (quarter > 18) year = 4;
  else if (quarter > 12) year = 3;
  else if (quarter > 6) year = 2;
  else year = 1;

  const isClimax = cardsSurvived === 23;

  const titles: Record<LegislativeYear, { title: string; subtitle: string }> = {
    1: {
      title: 'AÑO I: TOMA DE POSESIÓN Y RED CLIENTELAR',
      subtitle: 'Reparto de comisiones, colocación de afines y primeros contratos menores.',
    },
    2: {
      title: 'AÑO II: VELOCIDAD DE CRUCERO Y CONCESIONES',
      subtitle: 'Grandes recalificaciones, desvíos fiduciarios y tranquilidad procesal.',
    },
    3: {
      title: 'AÑO III: CERCO DE LA FISCALÍA Y GUERRA SUCIA',
      subtitle: 'Filtraciones a prensa, activación de comisarios y destrucción de discos.',
    },
    4: {
      title: 'AÑO IV: AGONÍA PROCESAL Y PACTO DE ESTADO',
      subtitle: 'Comisiones de investigación, amenaza de suplicatorio y búsqueda de indulto.',
    },
  };

  const quarterInYear = ((quarter - 1) % 6) + 1;
  const quarterLabel = `T${quarterInYear} · Trimestre ${quarter} (${quarter * 90} días)`;

  return {
    year,
    title: titles[year].title,
    subtitle: titles[year].subtitle,
    quarterLabel,
    isClimax,
  };
}
