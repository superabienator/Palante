import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore, checkReignsGameOver } from '../src/store/gameStore';
import { CharacterStats } from '../src/types/story';

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

  describe('Ciclo de Partida en Modo Reigns', () => {
    it('inicia correctamente una partida con CUSTODIO_LIBRETA y baraja barajada', () => {
      const success = useGameStore.getState().startReignsGame('CUSTODIO_LIBRETA');
      expect(success).toBe(true);

      const state = useGameStore.getState();
      expect(state.status).toBe('PLAYING');
      expect(state.gameMode).toBe('REIGNS');
      expect(state.selectedArchetypeId).toBe('CUSTODIO_LIBRETA');
      expect(state.characterProfile?.name).toBe('El Custodio de la Libreta');
      expect(state.currentReignsCard).toBeDefined();
      expect(state.currentReignsCard?.leftChoice).toBeDefined();
      expect(state.currentReignsCard?.rightChoice).toBeDefined();
      expect(state.daysInPower).toBe(90);
      expect(state.cardsSurvived).toBe(0);
    });

    it('gestiona la previsualización en tiempo real del impacto de estadísticas', () => {
      useGameStore.getState().startReignsGame('BARON_ENCOFRADO');

      // Sin previsualización
      expect(useGameStore.getState().getPreviewModifiers()).toBeNull();

      // Previsualizar izquierda
      useGameStore.getState().setPreviewDirection('left');
      const leftMods = useGameStore.getState().getPreviewModifiers();
      expect(leftMods).toBeDefined();

      // Previsualizar derecha
      useGameStore.getState().setPreviewDirection('right');
      const rightMods = useGameStore.getState().getPreviewModifiers();
      expect(rightMods).toBeDefined();

      // Limpiar
      useGameStore.getState().setPreviewDirection(null);
      expect(useGameStore.getState().getPreviewModifiers()).toBeNull();
    });

    it('aplica decisiones y avanza en la legislatura', () => {
      useGameStore.getState().startReignsGame('BARON_ENCOFRADO');
      const initialCards = useGameStore.getState().cardsSurvived;

      const ok = useGameStore.getState().makeReignsChoice('right');
      expect(ok).toBe(true);
      expect(useGameStore.getState().cardsSurvived).toBe(initialCards + 1);
      expect(useGameStore.getState().daysInPower).toBe(180);
    });
  });
});
