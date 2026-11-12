import { describe, it, expect, beforeEach } from 'vitest';
import {
  useGameStore,
  clampStat,
  applyModifiers,
} from '../src/store/gameStore';
import { CharacterStats } from '../src/types/story';

describe('Game Engine & Zustand Store (Hito 3)', () => {
  beforeEach(() => {
    useGameStore.getState().resetToCharacterSelect();
  });

  describe('Stat Clamping Logic', () => {
    it('mantiene los valores entre 0 y 100 sin desbordamiento', () => {
      expect(clampStat(90, 20)).toBe(100);
      expect(clampStat(10, -30)).toBe(0);
      expect(clampStat(50, 0)).toBe(50);
      expect(clampStat(42, undefined)).toBe(42);
    });

    it('aplica modificadores múltiples correctamente con clamping', () => {
      const initial: CharacterStats = {
        pastaEnB: 20,
        presionJudicial: 80,
        impunidad: 90,
        reputacionMediatica: 10,
      };

      const updated = applyModifiers(initial, {
        pastaEnB: 50,
        presionJudicial: 30, // 80 + 30 = 110 -> 100
        impunidad: -100, // 90 - 100 = -10 -> 0
        // reputacionMediatica undefined -> se mantiene en 10
      });

      expect(updated.pastaEnB).toBe(70);
      expect(updated.presionJudicial).toBe(100);
      expect(updated.impunidad).toBe(0);
      expect(updated.reputacionMediatica).toBe(10);
    });
  });

  describe('Ciclo de Vida de Partida', () => {
    it('inicia en estado NOT_STARTED sin personaje seleccionado', () => {
      const state = useGameStore.getState();
      expect(state.status).toBe('NOT_STARTED');
      expect(state.selectedArchetypeId).toBeNull();
      expect(state.currentNode).toBeNull();
    });

    it('falla al iniciar con un arquetipo no registrado', () => {
      // @ts-expect-error probando arquetipo inválido intencionadamente
      const success = useGameStore.getState().startGame('ARQUETIPO_FANTASMA');
      expect(success).toBe(false);
      expect(useGameStore.getState().status).toBe('NOT_STARTED');
    });

    it('inicia correctamente con PROCONSUL_HORMIGON cargando estadísticas y nodo raíz', () => {
      const success = useGameStore.getState().startGame('PROCONSUL_HORMIGON');
      expect(success).toBe(true);

      const state = useGameStore.getState();
      expect(state.status).toBe('PLAYING');
      expect(state.selectedArchetypeId).toBe('PROCONSUL_HORMIGON');
      expect(state.characterProfile?.name).toBe('El Procónsul del Hormigón');
      expect(state.stats).toEqual({
        pastaEnB: 25,
        presionJudicial: 15,
        impunidad: 60,
        reputacionMediatica: 50,
      });
      expect(state.currentNodeId).toBe('nodo_inicio_proconsul');
      expect(state.currentNode?.headline).toContain('PLAN GENERAL');
      expect(state.evidenceDocuments.length).toBeGreaterThan(0);
      expect(state.unlockedMechanics).toContain(9);
      expect(state.history).toHaveLength(0);
    });
  });

  describe('Toma de Decisiones y Transición de Nodos', () => {
    beforeEach(() => {
      useGameStore.getState().startGame('PROCONSUL_HORMIGON');
    });

    it('rechaza elecciones con ID inexistente', () => {
      const result = useGameStore.getState().makeChoice('eleccion_falsa');
      expect(result).toBe(false);
      expect(useGameStore.getState().currentNodeId).toBe('nodo_inicio_proconsul');
    });

    it('aplica la decisión c1 actualizando métricas, historial y nodo siguiente', () => {
      // c1: pastaEnB: +30, presionJudicial: +20, impunidad: -10
      // Inicial: { pastaEnB: 25, presionJudicial: 15, impunidad: 60, reputacionMediatica: 50 }
      const success = useGameStore.getState().makeChoice('c1');
      expect(success).toBe(true);

      const state = useGameStore.getState();
      expect(state.currentNodeId).toBe('nodo_registro_uco');
      expect(state.stats.pastaEnB).toBe(55);
      expect(state.stats.presionJudicial).toBe(35);
      expect(state.stats.impunidad).toBe(50);
      expect(state.stats.reputacionMediatica).toBe(50);

      // Verificación de historial
      expect(state.history).toHaveLength(1);
      const entry = state.history[0];
      expect(entry.choiceId).toBe('c1');
      expect(entry.mechanicId).toBe(9);
      expect(entry.statsBefore.pastaEnB).toBe(25);
      expect(entry.statsAfter.pastaEnB).toBe(55);
    });

    it('avanza hasta el desenlace procesal culminando en GAME_OVER', () => {
      // 1. Elección 1: c1 -> nodo_registro_uco
      useGameStore.getState().makeChoice('c1');

      // 2. Elección 2: c3 (Destruir discos duros) -> nodo_fin_soto
      const success = useGameStore.getState().makeChoice('c3');
      expect(success).toBe(true);

      const state = useGameStore.getState();
      expect(state.status).toBe('GAME_OVER');
      expect(state.ending).toBe('PRISION_INCONDICIONAL');
      expect(state.currentNodeId).toBe('nodo_fin_soto');
      expect(state.history).toHaveLength(2);
    });

    it('permite reiniciar la legislatura (restartGame) conservando el arquetipo', () => {
      useGameStore.getState().makeChoice('c1');
      useGameStore.getState().restartGame();

      const state = useGameStore.getState();
      expect(state.status).toBe('PLAYING');
      expect(state.selectedArchetypeId).toBe('PROCONSUL_HORMIGON');
      expect(state.currentNodeId).toBe('nodo_inicio_proconsul');
      expect(state.stats.pastaEnB).toBe(25); // restaurado a inicial
      expect(state.history).toHaveLength(0);
    });

    it('permite regresar al selector de personajes (resetToCharacterSelect)', () => {
      useGameStore.getState().makeChoice('c1');
      useGameStore.getState().resetToCharacterSelect();

      const state = useGameStore.getState();
      expect(state.status).toBe('NOT_STARTED');
      expect(state.selectedArchetypeId).toBeNull();
      expect(state.currentNode).toBeNull();
      expect(state.history).toHaveLength(0);
    });
  });
});
