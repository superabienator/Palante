import { describe, it, expect, beforeEach } from 'vitest';
import {
  PRIVILEGES_REGISTRY,
  calculateAggregatedPerks,
} from '../src/config/privileges';
import {
  useGameStore,
  calculateStatVariance,
  calculateProjectedStatsRange,
  rollModifiersWithDice,
} from '../src/store/gameStore';

describe('Privilegios de Poltrona & Sistema de Tiradas de Dados', () => {
  beforeEach(() => {
    useGameStore.getState().resetToCharacterSelect();
  });

  it('registra las 40 mecánicas con efectos tácticos e información completa', () => {
    for (let id = 1; id <= 40; id++) {
      const priv = PRIVILEGES_REGISTRY[id];
      expect(priv).toBeDefined();
      expect(priv.id).toBe(id);
      expect(priv.name.length).toBeGreaterThan(3);
      expect(priv.inGameEffect.length).toBeGreaterThan(5);
    }
  });

  it('calcula correctamente los privilegios agregados de un personaje', () => {
    // 10 = Borrado con Martillo (-4 Presión), 1 = Recalificación PGOU (+3 Pasta), 13 = Filtración Cuaderno (-4 Prensa)
    const perks = calculateAggregatedPerks([1, 10, 13]);
    expect(perks.presionJudicialDiscount).toBe(4);
    expect(perks.presionPrivilegeName).toBe('Borrado con Martillo a Discos');
    expect(perks.pastaEnBBonus).toBe(3);
    expect(perks.pastaPrivilegeName).toBe('Recalificación PGOU Monte');
    expect(perks.reputacionShield).toBe(4);
    expect(perks.reputacionPrivilegeName).toBe('Filtración de Cuaderno Contable');
  });

  it('aplica amortiguación de privilegios al calcular los márgenes de tirada de dados', () => {
    // Sin privilegios: subida base de +15 en Presión Judicial -> 1d8 (±4) => [11, 19]
    const rawVariance = calculateStatVariance('presionJudicial', 15, []);
    expect(rawVariance.min).toBe(11);
    expect(rawVariance.max).toBe(19);
    expect(rawVariance.perkBonus).toBeUndefined();

    // Con Borrado con Martillo (ID 10, descuento de -4): base ajustada +11 -> 1d6 (±3) => [8, 14]
    const shieldedVariance = calculateStatVariance('presionJudicial', 15, [10]);
    expect(shieldedVariance.min).toBe(8);
    expect(shieldedVariance.max).toBe(14);
    expect(shieldedVariance.perkBonus).toEqual({
      amount: -4,
      privilegeName: 'Borrado con Martillo a Discos',
    });
  });

  it('ejecuta tiradas de dados dentro de los márgenes prometidos y genera caras 1..6', () => {
    const modifiers = {
      pastaEnB: 10,
      presionJudicial: 15,
      impunidad: -8,
      reputacionMediatica: -12,
    };

    for (let i = 0; i < 25; i++) {
      const { rolledModifiers, summary } = rollModifiersWithDice(
        modifiers,
        [1, 10],
        'left',
        'TRINCAR'
      );

      expect(summary.rolls.length).toBe(4);
      for (const roll of summary.rolls) {
        expect(roll.rolledDelta).toBeGreaterThanOrEqual(roll.min);
        expect(roll.rolledDelta).toBeLessThanOrEqual(roll.max);
        expect(roll.diceFace).toBeGreaterThanOrEqual(1);
        expect(roll.diceFace).toBeLessThanOrEqual(6);
        expect(rolledModifiers[roll.statKey]).toBe(roll.rolledDelta);
      }
    }
  });

  it('integra la proyección de márgenes y registra lastDiceRoll en el store al decidir', () => {
    useGameStore.getState().startReignsGame('CUSTODIO_LIBRETA');

    // Al no previsualizar, el rango proyectado es null
    expect(useGameStore.getState().getProjectedStatsRange()).toBeNull();

    // Al previsualizar izquierda, devuelve los márgenes con dados
    useGameStore.getState().setPreviewDirection('left');
    const projected = useGameStore.getState().getProjectedStatsRange();
    expect(projected).not.toBeNull();

    // Al tomar la decisión, se registra lastDiceRoll con el sello y tiradas
    const ok = useGameStore.getState().makeReignsChoice('left');
    expect(ok).toBe(true);

    const lastRoll = useGameStore.getState().lastDiceRoll;
    expect(lastRoll).not.toBeNull();
    expect(lastRoll?.direction).toBe('left');
    expect(lastRoll?.rolls.length).toBeGreaterThan(0);
  });
});
