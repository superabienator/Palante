import { describe, it, expect, beforeEach } from 'vitest';
import {
  useGameStore,
  calculateStatVariance,
  rollModifiersWithDice,
} from '../src/store/gameStore';

describe('Sistema Puro de Tiradas de Dados D6 (Estilo Reigns Puro)', () => {
  beforeEach(() => {
    useGameStore.getState().resetToCharacterSelect();
  });

  it('calcula correctamente los márgenes limpios 0.6x a 1.6x y niveles de riesgo sin bonos RPG', () => {
    const zeroVariance = calculateStatVariance(0);
    expect(zeroVariance.min).toBe(0);
    expect(zeroVariance.max).toBe(0);
    expect(zeroVariance.riskLevel).toBe('LOW');

    // Impacto bajo (+5): 5 * 0.6 = 3, 5 * 1.6 = 8
    const lowVariance = calculateStatVariance(5);
    expect(lowVariance.min).toBe(3);
    expect(lowVariance.max).toBe(8);
    expect(lowVariance.riskLevel).toBe('LOW');
    expect(lowVariance.diceNotation).toBe('1d6');

    // Impacto medio (-10): -10 * 1.6 = -16, -10 * 0.6 = -6
    const medVariance = calculateStatVariance(-10);
    expect(medVariance.min).toBe(-16);
    expect(medVariance.max).toBe(-6);
    expect(medVariance.riskLevel).toBe('MEDIUM');

    // Impacto alto (+15): 15 * 0.6 = 9, 15 * 1.6 = 24
    const highVariance = calculateStatVariance(15);
    expect(highVariance.min).toBe(9);
    expect(highVariance.max).toBe(24);
    expect(highVariance.riskLevel).toBe('HIGH');
  });

  it('aplica factores deterministas del dado D6 (1 -> 0.6x, 6 -> 1.6x)', () => {
    const modifiers = { pastaEnB: 10, presionJudicial: -10 };

    const roll1 = rollModifiersWithDice(modifiers, 'left', 'TRINCAR', 1);
    expect(roll1.rolledModifiers.pastaEnB).toBe(6);
    expect(roll1.rolledModifiers.presionJudicial).toBe(-6);
    expect(roll1.summary.rolls.every((r) => r.diceFace === 1)).toBe(true);

    const roll6 = rollModifiersWithDice(modifiers, 'left', 'TRINCAR', 6);
    expect(roll6.rolledModifiers.pastaEnB).toBe(16);
    expect(roll6.rolledModifiers.presionJudicial).toBe(-16);
    expect(roll6.summary.rolls.every((r) => r.diceFace === 6)).toBe(true);
  });

  it('ejecuta tiradas aleatorias de dados dentro de los márgenes prometidos y genera caras 1..6', () => {
    const modifiers = {
      pastaEnB: 10,
      presionJudicial: 15,
      impunidad: -8,
      reputacionMediatica: -12,
    };

    for (let i = 0; i < 25; i++) {
      const { rolledModifiers, summary } = rollModifiersWithDice(
        modifiers,
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
    useGameStore.getState().startNewReign(1);

    // Al no previsualizar, el rango proyectado es null
    expect(useGameStore.getState().getProjectedStatsRange()).toBeNull();

    // Al previsualizar izquierda, devuelve los márgenes con dados
    useGameStore.getState().setPreviewDirection('left');
    const projected = useGameStore.getState().getProjectedStatsRange();
    expect(projected).not.toBeNull();

    // Al tomar la decisión, se registra lastDiceRoll con el sello, contexto y antes/después
    const ok = useGameStore.getState().makeReignsChoice('left');
    expect(ok).toBe(true);

    const lastRoll = useGameStore.getState().lastDiceRoll;
    expect(lastRoll).not.toBeNull();
    expect(lastRoll?.direction).toBe('left');
    expect(lastRoll?.choiceLabel).toBeDefined();
    expect(lastRoll?.cardHeadline).toBeDefined();
    expect(lastRoll?.rolls.length).toBeGreaterThan(0);
    expect(lastRoll?.rolls[0].statBefore).toBeTypeOf('number');
    expect(lastRoll?.rolls[0].statAfter).toBeTypeOf('number');

    // Permanece activo hasta que el usuario cierra la ventana emergente
    useGameStore.getState().clearLastDiceRoll();
    expect(useGameStore.getState().lastDiceRoll).toBeNull();
  });
});
