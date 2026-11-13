import { describe, it, expect, beforeEach } from 'vitest';
import {
  useGameStore,
  checkReignsGameOver,
  calculateCardWeight,
  weightedRandomSelect,
  selectNextReignsCard,
  calculateRiskAssessment,
  getLegislativeStageInfo,
  getInExtremisStatus,
} from '../src/store/gameStore';
import {
  CharacterStats,
  ReignsCard,
  CLIMAX_CARD_ID,
} from '../src/types/story';

describe('Reigns Engine & Game Loop (Modo Supervivencia)', () => {
  beforeEach(() => {
    useGameStore.getState().resetToCharacterSelect();
  });

  describe('Condiciones de Muerte Estilo Reigns', () => {
    it('detecta bancarrota política cuando la pastaEnB llega a 0', () => {
      const stats: CharacterStats = {
        pastaEnB: 0,
        presionJudicial: 30,
        impunidad: 50,
        reputacionMediatica: 50,
      };
      const verdict = checkReignsGameOver(stats, 5);
      expect(verdict.isGameOver).toBe(true);
      expect(verdict.reason).toBe('PASTA_MINIMA');
      expect(verdict.ending).toBe('PURGA_DE_OFICIO');
    });

    it('detecta alerta internacional antiblanqueo cuando pastaEnB llega a 100', () => {
      const stats: CharacterStats = {
        pastaEnB: 100,
        presionJudicial: 30,
        impunidad: 50,
        reputacionMediatica: 50,
      };
      const verdict = checkReignsGameOver(stats, 5);
      expect(verdict.isGameOver).toBe(true);
      expect(verdict.reason).toBe('PASTA_MAXIMA');
      expect(verdict.ending).toBe('PRISION_INCONDICIONAL');
    });

    it('detecta prisión incondicional inmediata cuando presionJudicial llega a 100', () => {
      const stats: CharacterStats = {
        pastaEnB: 50,
        presionJudicial: 100,
        impunidad: 50,
        reputacionMediatica: 50,
      };
      const verdict = checkReignsGameOver(stats, 8);
      expect(verdict.isGameOver).toBe(true);
      expect(verdict.reason).toBe('PRESION_MAXIMA');
      expect(verdict.ending).toBe('PRISION_INCONDICIONAL');
    });

    it('detecta pérdida de aforamiento cuando impunidad cae a 0', () => {
      const stats: CharacterStats = {
        pastaEnB: 50,
        presionJudicial: 40,
        impunidad: 0,
        reputacionMediatica: 50,
      };
      const verdict = checkReignsGameOver(stats, 8);
      expect(verdict.isGameOver).toBe(true);
      expect(verdict.reason).toBe('IMPUNIDAD_MINIMA');
      expect(verdict.ending).toBe('PRISION_INCONDICIONAL');
    });

    it('detecta linchamiento editorial cuando la reputación mediática cae a 0', () => {
      const stats: CharacterStats = {
        pastaEnB: 50,
        presionJudicial: 20,
        impunidad: 50,
        reputacionMediatica: 0,
      };
      const verdict = checkReignsGameOver(stats, 10);
      expect(verdict.isGameOver).toBe(true);
      expect(verdict.reason).toBe('REPUTACION_MINIMA');
      expect(verdict.ending).toBe('PURGA_DE_OFICIO');
    });

    it('detecta sospecha de topo (PRESION_MINIMA) cuando presionJudicial cae a 0', () => {
      const stats: CharacterStats = {
        pastaEnB: 50,
        presionJudicial: 0,
        impunidad: 50,
        reputacionMediatica: 50,
      };
      const verdict = checkReignsGameOver(stats, 6);
      expect(verdict.isGameOver).toBe(true);
      expect(verdict.reason).toBe('PRESION_MINIMA');
      expect(verdict.ending).toBe('PURGA_DE_OFICIO');
    });

    it('detecta exceso de soberbia (IMPUNIDAD_MAXIMA) cuando impunidad llega a 100', () => {
      const stats: CharacterStats = {
        pastaEnB: 50,
        presionJudicial: 40,
        impunidad: 100,
        reputacionMediatica: 50,
      };
      const verdict = checkReignsGameOver(stats, 7);
      expect(verdict.isGameOver).toBe(true);
      expect(verdict.reason).toBe('IMPUNIDAD_MAXIMA');
      expect(verdict.ending).toBe('PURGA_DE_OFICIO');
    });

    it('detecta eclipsar al líder (REPUTACION_MAXIMA) cuando reputacionMediatica llega a 100', () => {
      const stats: CharacterStats = {
        pastaEnB: 50,
        presionJudicial: 40,
        impunidad: 50,
        reputacionMediatica: 100,
      };
      const verdict = checkReignsGameOver(stats, 9);
      expect(verdict.isGameOver).toBe(true);
      expect(verdict.reason).toBe('REPUTACION_MAXIMA');
      expect(verdict.ending).toBe('PURGA_DE_OFICIO');
    });

    it('concede el retiro dorado al consejo del IBEX tras sobrevivir 25 cartas', () => {
      const stats: CharacterStats = {
        pastaEnB: 45,
        presionJudicial: 40,
        impunidad: 60,
        reputacionMediatica: 55,
      };
      const verdict = checkReignsGameOver(stats, 25);
      expect(verdict.isGameOver).toBe(true);
      expect(verdict.reason).toBe('VICTORIA_LEGISLATURA');
      expect(verdict.ending).toBe('CONSEJO_IBEX');
    });
  });

  describe('Mazo Unificado Estilo Reigns Puro (Sin Filtro de Personaje)', () => {
    const cardPolitica: ReignsCard = {
      id: 'card_politica_1',
      speaker: 'Ministro',
      speakerRole: 'Portavoz',
      sphere: 'POLITICA',
      headline: 'Dilema de Partido',
      context: 'Fondos de campaña',
      leftChoice: { label: 'Aceptar', stampText: 'SÍ', modifiers: {} },
      rightChoice: { label: 'Rechazar', stampText: 'NO', modifiers: {} },
      weight: 1,
    };

    const cardEmpresarial: ReignsCard = {
      id: 'card_emp_1',
      speaker: 'Constructor',
      speakerRole: 'Ladrillo',
      sphere: 'EMPRESARIAL',
      headline: 'Mordida Obra',
      context: 'Comisión en sobre',
      archetypeAffinity: ['CUSTODIO_LIBRETA'],
      leftChoice: { label: 'Trincar', stampText: 'SÍ', modifiers: {} },
      rightChoice: { label: 'Pasar', stampText: 'NO', modifiers: {} },
      weight: 1,
    };

    const cardOrden: ReignsCard = {
      id: 'card_orden_1',
      speaker: 'Comisario',
      speakerRole: 'Policía',
      sphere: 'ORDEN_JUSTICIA',
      headline: 'Pinchazo UCO',
      context: 'Audio filtrado',
      archetypeAffinity: ['ARCHIVADOR_CLOACA'],
      leftChoice: { label: 'Destruir', stampText: 'SÍ', modifiers: {} },
      rightChoice: { label: 'Ignorar', stampText: 'NO', modifiers: {} },
      weight: 1,
    };

    it('considera elegibles todas las cartas del mazo sin importar la esfera ni el arquetipo', () => {
      const allCards = [cardPolitica, cardEmpresarial, cardOrden];
      const seenIds = new Set<string>();

      for (let i = 0; i < 60; i++) {
        const picked = selectNextReignsCard({
          allCards,
          activeFlags: {},
          cardsSurvived: 5,
        });
        if (picked) seenIds.add(picked.id);
      }

      expect(seenIds.has(cardPolitica.id)).toBe(true);
      expect(seenIds.has(cardEmpresarial.id)).toBe(true);
      expect(seenIds.has(cardOrden.id)).toBe(true);
    });

    it('filtra cartas con requiredFlags según las banderas activas del tablero', () => {
      const gatedCard: ReignsCard = {
        ...cardPolitica,
        id: 'card_gated',
        requiredFlags: ['CASO_ABIERTO'],
      };
      const allCards = [cardOrden, gatedCard];

      for (let i = 0; i < 15; i++) {
        const picked = selectNextReignsCard({
          allCards,
          activeFlags: {},
          cardsSurvived: 2,
        });
        expect(picked?.id).toBe(cardOrden.id);
      }

      const seenWithFlag = new Set<string>();
      for (let i = 0; i < 30; i++) {
        const picked = selectNextReignsCard({
          allCards,
          activeFlags: { CASO_ABIERTO: true },
          cardsSurvived: 2,
        });
        if (picked) seenWithFlag.add(picked.id);
      }
      expect(seenWithFlag.has('card_gated')).toBe(true);
    });

    it('no repite cartas incluidas en playedCardIds mientras haya cartas sin jugar en el mazo', () => {
      const allCards = [cardPolitica, cardEmpresarial, cardOrden];
      const picked = selectNextReignsCard({
        allCards,
        activeFlags: {},
        currentCardId: cardPolitica.id,
        playedCardIds: [cardPolitica.id, cardEmpresarial.id],
        cardsSurvived: 3,
      });

      expect(picked?.id).toBe(cardOrden.id);
    });
  });

  describe('Encadenamiento Prioritario de Sagas (Peso 5x)', () => {
    const regularCard: ReignsCard = {
      id: 'regular_card',
      speaker: 'Interlocutor',
      speakerRole: 'Papel',
      sphere: 'POLITICA',
      headline: 'Dilema Ordinario',
      context: '...',
      leftChoice: { label: 'A', stampText: 'A', modifiers: {} },
      rightChoice: { label: 'B', stampText: 'B', modifiers: {} },
      weight: 2,
    };

    const sagaCard: ReignsCard = {
      id: 'saga_card_followup',
      speaker: 'Saga Boss',
      speakerRole: 'Trama',
      sphere: 'POLITICA',
      headline: 'Continuación de Saga',
      context: '...',
      weight: 2,
      requiredFlags: ['GOLF_APROBADO'],
      leftChoice: { label: 'A', stampText: 'A', modifiers: {} },
      rightChoice: { label: 'B', stampText: 'B', modifiers: {} },
    };

    it('aplica multiplicador 5x al peso cuando requiredFlags coincide con recentlyGrantedFlags', () => {
      // Sin bandera reciente -> peso base (2)
      expect(calculateCardWeight(sagaCard, [])).toBe(2);
      expect(calculateCardWeight(sagaCard, ['OTRA_BANDERA'])).toBe(2);

      // Con bandera otorgada recientemente -> peso base * 5 (2 * 5 = 10)
      expect(calculateCardWeight(sagaCard, ['GOLF_APROBADO'])).toBe(10);

      // Carta regular sin requiredFlags mantiene su peso base
      expect(calculateCardWeight(regularCard, ['GOLF_APROBADO'])).toBe(2);
    });

    it('prioriza significativamente la carta de saga en la selección ponderada', () => {
      const cards = [regularCard, sagaCard];
      let sagaCount = 0;
      const runs = 1200;

      // Con recentlyGrantedFlags: regularCard (peso 2) vs sagaCard (peso 10). Ratio teórico: 10/12 = 83.3%
      for (let i = 0; i < runs; i++) {
        const picked = weightedRandomSelect(cards, ['GOLF_APROBADO']);
        if (picked?.id === 'saga_card_followup') {
          sagaCount++;
        }
      }

      const ratio = sagaCount / runs;
      expect(ratio).toBeGreaterThan(0.70);
      expect(ratio).toBeLessThan(0.95);
    });
  });

  describe('Inyección Obligatoria del Clímax Procesal (cardsSurvived === 23)', () => {
    const mockClimaxCard: ReignsCard = {
      id: CLIMAX_CARD_ID,
      speaker: 'Presidente Sala Penal',
      speakerRole: 'Magistrado del Supremo',
      sphere: 'ORDEN_JUSTICIA',
      headline: 'EL PACTO DE LA TOJA',
      context: 'Último trimestre de la legislatura...',
      leftChoice: { label: 'Pactar', stampText: 'ENTREGAR', modifiers: {} },
      rightChoice: { label: 'Pelear', stampText: 'RECHAZAR', modifiers: {} },
      weight: 3,
    };

    const regularCard: ReignsCard = {
      id: 'card_normal',
      speaker: 'Alcalde',
      speakerRole: 'Edil',
      sphere: 'POLITICA',
      headline: 'Dilema Habitual',
      context: '...',
      leftChoice: { label: 'A', stampText: 'A', modifiers: {} },
      rightChoice: { label: 'B', stampText: 'B', modifiers: {} },
      weight: 1,
    };

    const deck = [regularCard, mockClimaxCard];

    it('inyecta obligatoriamente la carta CLIMAX_CARD_ID en cardsSurvived === 23 (trimestre 24)', () => {
      const selected = selectNextReignsCard({
        allCards: deck,
        activeFlags: {},
        cardsSurvived: 23,
      });

      expect(selected).not.toBeNull();
      expect(selected?.id).toBe(CLIMAX_CARD_ID);
    });

    it('no permite que la carta de clímax aparezca antes del trimestre 24', () => {
      for (const turn of [0, 5, 12, 22]) {
        const selected = selectNextReignsCard({
          allCards: deck,
          activeFlags: {},
          cardsSurvived: turn,
        });
        expect(selected?.id).toBe('card_normal');
      }
    });
  });

  describe('Semáforo de Riesgo Mortal (calculateRiskAssessment)', () => {
    it('devuelve SAFE cuando las métricas proyectadas permanecen en zona segura', () => {
      const stats: CharacterStats = {
        pastaEnB: 50,
        presionJudicial: 30,
        impunidad: 50,
        reputacionMediatica: 50,
      };

      const assessment = calculateRiskAssessment(stats, {
        pastaEnB: { base: 5, min: 3, max: 7, diceNotation: '1d6', riskLevel: 'LOW' },
        presionJudicial: { base: 5, min: 3, max: 7, diceNotation: '1d6', riskLevel: 'LOW' },
      });

      expect(assessment.level).toBe('SAFE');
      expect(assessment.dangerStats).toHaveLength(0);
      expect(assessment.explanation).toContain('PARÁMETROS CONTROLADOS');
    });

    it('devuelve VOLATILE cuando una métrica entra en umbral crítico (< 15 o > 85)', () => {
      const stats: CharacterStats = {
        pastaEnB: 20,
        presionJudicial: 80,
        impunidad: 50,
        reputacionMediatica: 50,
      };

      // Presión judicial sube hasta 80 + 8 = 88 (> 85), pero no llega a 100
      const assessment = calculateRiskAssessment(stats, {
        presionJudicial: { base: 6, min: 4, max: 8, diceNotation: '1d6', riskLevel: 'MEDIUM' },
      });

      expect(assessment.level).toBe('VOLATILE');
      expect(assessment.dangerStats.length).toBeGreaterThan(0);
      expect(assessment.dangerStats[0].statKey).toBe('presionJudicial');
      expect(assessment.dangerStats[0].lethal).toBe(false);
      expect(assessment.dangerStats[0].bound).toBe('MAX');
      expect(assessment.explanation).toContain('ALERTA DE ALTA VOLATILIDAD');
    });

    it('devuelve LETHAL cuando la decisión puede alcanzar el colapso (0 o 100)', () => {
      const stats: CharacterStats = {
        pastaEnB: 10,
        presionJudicial: 92,
        impunidad: 50,
        reputacionMediatica: 50,
      };

      // Presión judicial puede llegar a 92 + 10 = 102 >= 100 -> LETHAL
      const assessment = calculateRiskAssessment(stats, {
        presionJudicial: { base: 8, min: 6, max: 10, diceNotation: '1d6', riskLevel: 'MEDIUM' },
      });

      expect(assessment.level).toBe('LETHAL');
      const lethalStat = assessment.dangerStats.find((d) => d.statKey === 'presionJudicial');
      expect(lethalStat).toBeDefined();
      expect(lethalStat?.lethal).toBe(true);
      expect(lethalStat?.bound).toBe('MAX');
      expect(assessment.explanation).toContain('PELIGRO PROCESAL INMINENTE');
    });

    it('evalúa correctamente el estado actual cuando projectedRange es null', () => {
      const statsInDanger: CharacterStats = {
        pastaEnB: 8,
        presionJudicial: 20,
        impunidad: 50,
        reputacionMediatica: 50,
      };

      const assessment = calculateRiskAssessment(statsInDanger, null);
      expect(assessment.level).toBe('VOLATILE');
      expect(assessment.dangerStats[0].statKey).toBe('pastaEnB');
      expect(assessment.dangerStats[0].bound).toBe('MIN');
    });
  });

  describe('Etapas de la Legislatura (getLegislativeStageInfo)', () => {
    it('asigna correctamente los 4 años y detecta el clímax en el trimestre 24', () => {
      // Año 1: T1 - T6 (cardsSurvived 0..5)
      expect(getLegislativeStageInfo(0).year).toBe(1);
      expect(getLegislativeStageInfo(5).year).toBe(1);
      expect(getLegislativeStageInfo(0).isClimax).toBe(false);

      // Año 2: T7 - T12 (cardsSurvived 6..11)
      expect(getLegislativeStageInfo(6).year).toBe(2);
      expect(getLegislativeStageInfo(11).year).toBe(2);

      // Año 3: T13 - T18 (cardsSurvived 12..17)
      expect(getLegislativeStageInfo(12).year).toBe(3);
      expect(getLegislativeStageInfo(17).year).toBe(3);

      // Año 4: T19 - T24 (cardsSurvived 18..23)
      expect(getLegislativeStageInfo(18).year).toBe(4);
      expect(getLegislativeStageInfo(22).year).toBe(4);
      expect(getLegislativeStageInfo(22).isClimax).toBe(false);

      // Trimestre 24 (cardsSurvived 23): Clímax
      const climaxStage = getLegislativeStageInfo(23);
      expect(climaxStage.year).toBe(4);
      expect(climaxStage.isClimax).toBe(true);
      expect(climaxStage.quarterLabel).toContain('Trimestre 24');
    });
  });

  describe('Motor de Rata Acorralada (In Extremis Status & Milagros Desesperados)', () => {
    it('detecta estado in extremis cuando las estadísticas tocan umbrales críticos', () => {
      // Estado normal: no activo
      const normalStats: CharacterStats = {
        pastaEnB: 50,
        presionJudicial: 30,
        impunidad: 50,
        reputacionMediatica: 50,
      };
      const normalStatus = getInExtremisStatus(normalStats);
      expect(normalStatus.active).toBe(false);
      expect(normalStatus.criticalStats).toHaveLength(0);

      // Presión judicial >= 80 (UCO en la puerta)
      const ucoStats: CharacterStats = { ...normalStats, presionJudicial: 82 };
      const ucoStatus = getInExtremisStatus(ucoStats);
      expect(ucoStatus.active).toBe(true);
      expect(ucoStatus.criticalStats[0].key).toBe('presionJudicial');
      expect(ucoStatus.criticalStats[0].dangerType).toBe('MAX_DANGER');

      // Impunidad <= 15 (pérdida de aforamiento)
      const aforamientoStats: CharacterStats = { ...normalStats, impunidad: 12 };
      const aforamientoStatus = getInExtremisStatus(aforamientoStats);
      expect(aforamientoStatus.active).toBe(true);
      expect(aforamientoStatus.criticalStats[0].key).toBe('impunidad');
      expect(aforamientoStatus.criticalStats[0].dangerType).toBe('MIN_DANGER');

      // Pasta en B <= 15 y Pasta en B >= 85
      const bancarrotaStatus = getInExtremisStatus({ ...normalStats, pastaEnB: 10 });
      expect(bancarrotaStatus.active).toBe(true);
      expect(bancarrotaStatus.criticalStats[0].dangerType).toBe('MIN_DANGER');

      const europolStatus = getInExtremisStatus({ ...normalStats, pastaEnB: 90 });
      expect(europolStatus.active).toBe(true);
      expect(europolStatus.criticalStats[0].dangerType).toBe('MAX_DANGER');

      // Reputación mediática <= 15
      const linchamientoStatus = getInExtremisStatus({ ...normalStats, reputacionMediatica: 5 });
      expect(linchamientoStatus.active).toBe(true);
      expect(linchamientoStatus.criticalStats[0].key).toBe('reputacionMediatica');
    });

    it('calcula pesos especiales para cartas isInExtremis (peso 0 normal, 10x acorralado, 20x target específico)', () => {
      const miracleCard: ReignsCard = {
        id: 'inextremis_incendio_windsor',
        speaker: 'Bombero Amigo',
        speakerRole: 'Operaciones Especiales',
        sphere: 'ORDEN_JUSTICIA',
        headline: 'INCENDIO PROVIDENCIAL',
        context: 'Fuego en el archivo...',
        weight: 1,
        isInExtremis: true,
        targetDangerStat: 'presionJudicial',
        leftChoice: { label: 'A', stampText: 'A', modifiers: {} },
        rightChoice: { label: 'B', stampText: 'B', modifiers: {} },
      };

      // Si no está acorralado -> peso 0 (no debe salir)
      const inactiveStatus = { active: false, criticalStats: [] };
      expect(calculateCardWeight(miracleCard, [], inactiveStatus)).toBe(0);

      // Si está acorralado pero por otra estadística (ej. impunidad) -> peso x10
      const impunidadDangerStatus = {
        active: true,
        criticalStats: [
          { key: 'impunidad' as const, label: 'Impunidad', value: 10, dangerType: 'MIN_DANGER' as const },
        ],
      };
      expect(calculateCardWeight(miracleCard, [], impunidadDangerStatus)).toBe(10);

      // Si está acorralado por presionJudicial (coincide con targetDangerStat) -> peso x20
      const ucoDangerStatus = {
        active: true,
        criticalStats: [
          { key: 'presionJudicial' as const, label: 'Presión Judicial', value: 85, dangerType: 'MAX_DANGER' as const },
        ],
      };
      expect(calculateCardWeight(miracleCard, [], ucoDangerStatus)).toBe(20);
    });

    it('no extrae cartas in extremis si el personaje está a salvo y las prioriza masivamente al estar acorralado', () => {
      const normalCard: ReignsCard = {
        id: 'card_normal_1',
        speaker: 'Alcalde',
        speakerRole: 'Edil',
        sphere: 'POLITICA',
        headline: 'Dilema Común',
        context: '...',
        weight: 1,
        leftChoice: { label: 'A', stampText: 'A', modifiers: {} },
        rightChoice: { label: 'B', stampText: 'B', modifiers: {} },
      };

      const miracleCard: ReignsCard = {
        id: 'inextremis_tamayazo_soborno',
        speaker: 'Conseguidor',
        speakerRole: 'Operador',
        sphere: 'POLITICA',
        headline: 'TAMAYAZO RELÁMPAGO',
        context: '...',
        weight: 1,
        isInExtremis: true,
        targetDangerStat: 'impunidad',
        leftChoice: { label: 'A', stampText: 'A', modifiers: {} },
        rightChoice: { label: 'B', stampText: 'B', modifiers: {} },
      };

      const deck = [normalCard, miracleCard];

      // Caso 1: Personaje sano (impunidad 50) -> selectNextReignsCard nunca saca miracleCard
      for (let i = 0; i < 20; i++) {
        const drawn = selectNextReignsCard({
          allCards: deck,
          activeFlags: {},
          cardsSurvived: 3,
          currentStats: { pastaEnB: 50, presionJudicial: 30, impunidad: 50, reputacionMediatica: 50 },
        });
        expect(drawn?.id).toBe('card_normal_1');
      }

      // Caso 2: Personaje en peligro crítico (impunidad 10) -> miracleCard tiene peso 20x vs peso 1 normal
      let miracleCount = 0;
      const runs = 500;
      for (let i = 0; i < runs; i++) {
        const drawn = selectNextReignsCard({
          allCards: deck,
          activeFlags: {},
          cardsSurvived: 3,
          currentStats: { pastaEnB: 50, presionJudicial: 30, impunidad: 10, reputacionMediatica: 50 },
        });
        if (drawn?.id === 'inextremis_tamayazo_soborno') {
          miracleCount++;
        }
      }

      // Con peso 20 vs 1, ratio teórico ~ 95%
      expect(miracleCount / runs).toBeGreaterThan(0.85);
    });
  });
});
