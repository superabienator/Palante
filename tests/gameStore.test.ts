import { describe, it, expect, beforeEach } from 'vitest';
import {
  useGameStore,
  clampStat,
  applyModifiers,
} from '../src/store/gameStore';
import { CharacterStats, CLIMAX_CARD_ID } from '../src/types/story';

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

  describe('Toma de Decisiones y Transición de Nodos (Modo Clásico)', () => {
    beforeEach(() => {
      useGameStore.getState().startGame('PROCONSUL_HORMIGON');
    });

    it('rechaza elecciones con ID inexistente', () => {
      const result = useGameStore.getState().makeChoice('eleccion_falsa');
      expect(result).toBe(false);
      expect(useGameStore.getState().currentNodeId).toBe('nodo_inicio_proconsul');
    });

    it('aplica la decisión c1 actualizando métricas, historial y nodo siguiente', () => {
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
      useGameStore.getState().makeChoice('c1');

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

  describe('Semáforo de Riesgo en el Store (getActiveRiskAssessment)', () => {
    it('devuelve null si la partida no ha comenzado', () => {
      expect(useGameStore.getState().getActiveRiskAssessment()).toBeNull();
    });

    it('evalúa el riesgo en tiempo real cuando el jugador previsualiza decisiones', () => {
      useGameStore.getState().startReignsGame('CUSTODIO_LIBRETA');

      // Sin previsualizar dirección: evalúa el estado basal
      const basalAssessment = useGameStore.getState().getActiveRiskAssessment();
      expect(basalAssessment).not.toBeNull();
      expect(['SAFE', 'VOLATILE', 'LETHAL']).toContain(basalAssessment?.level);

      // Al previsualizar izquierda: calcula el riesgo proyectado
      useGameStore.getState().setPreviewDirection('left');
      const leftAssessment = useGameStore.getState().getActiveRiskAssessment();
      expect(leftAssessment).not.toBeNull();
      expect(leftAssessment?.explanation).toBeDefined();

      // Al previsualizar derecha
      useGameStore.getState().setPreviewDirection('right');
      const rightAssessment = useGameStore.getState().getActiveRiskAssessment();
      expect(rightAssessment).not.toBeNull();

      // Al cancelar previsualización
      useGameStore.getState().setPreviewDirection(null);
      const resetAssessment = useGameStore.getState().getActiveRiskAssessment();
      expect(resetAssessment?.level).toBe(basalAssessment?.level);
    });
  });

  describe('Exposición de lastActivatedPrivilege en el Store', () => {
    it('inicia en null y se actualiza al tomar decisiones con mechanicId', () => {
      useGameStore.getState().startReignsGame('PROCONSUL_HORMIGON');
      expect(useGameStore.getState().lastActivatedPrivilege).toBeNull();
      expect(useGameStore.getState().lastActivatedPrivilegeInfo).toBeNull();

      // Simulamos una carta con mechanicId en la elección izquierda
      const currentCard = useGameStore.getState().currentReignsCard;
      expect(currentCard).toBeDefined();

      const ok = useGameStore.getState().makeReignsChoice('left');
      expect(ok).toBe(true);

      const state = useGameStore.getState();
      if (currentCard?.leftChoice.mechanicId !== undefined) {
        expect(state.lastActivatedPrivilege).toBe(currentCard.leftChoice.mechanicId);
        expect(state.lastActivatedPrivilegeInfo?.id).toBe(currentCard.leftChoice.mechanicId);
        expect(state.lastActivatedPrivilegeInfo?.name.length).toBeGreaterThan(0);
      }

      // Permite limpiar manualmente el privilegio
      useGameStore.getState().clearLastActivatedPrivilege();
      expect(useGameStore.getState().lastActivatedPrivilege).toBeNull();
      expect(useGameStore.getState().lastActivatedPrivilegeInfo).toBeNull();
    });
  });

  describe('Encadenamiento de Sagas y Ventana Deslizante de Banderas', () => {
    it('mantiene recentlyGrantedFlags en una ventana deslizante de 3 turnos', () => {
      useGameStore.getState().startReignsGame('CUSTODIO_LIBRETA');
      expect(useGameStore.getState().recentlyGrantedFlags).toHaveLength(0);

      // Inyectamos manualmente una bandera de prueba en el store para simular avance de saga
      useGameStore.setState({
        recentFlagsHistory: [['FLAG_TURNO_1']],
        recentlyGrantedFlags: ['FLAG_TURNO_1'],
        activeFlags: { FLAG_TURNO_1: true },
      });
      expect(useGameStore.getState().recentlyGrantedFlags).toContain('FLAG_TURNO_1');

      // Turno 2: se añade otra bandera
      const state2 = useGameStore.getState();
      const updatedHistory = [...state2.recentFlagsHistory, ['FLAG_TURNO_2']].slice(-3);
      useGameStore.setState({
        recentFlagsHistory: updatedHistory,
        recentlyGrantedFlags: Array.from(new Set(updatedHistory.flat())),
      });
      expect(useGameStore.getState().recentlyGrantedFlags).toEqual(['FLAG_TURNO_1', 'FLAG_TURNO_2']);

      // Turno 3: turno sin banderas nuevas
      const state3 = useGameStore.getState();
      const history3 = [...state3.recentFlagsHistory, []].slice(-3);
      useGameStore.setState({
        recentFlagsHistory: history3,
        recentlyGrantedFlags: Array.from(new Set(history3.flat())),
      });
      expect(useGameStore.getState().recentlyGrantedFlags).toEqual(['FLAG_TURNO_1', 'FLAG_TURNO_2']);

      // Turno 4: turno sin banderas -> FLAG_TURNO_1 expira (hace más de 3 turnos)
      const state4 = useGameStore.getState();
      const history4 = [...state4.recentFlagsHistory, []].slice(-3);
      useGameStore.setState({
        recentFlagsHistory: history4,
        recentlyGrantedFlags: Array.from(new Set(history4.flat())),
      });
      expect(useGameStore.getState().recentlyGrantedFlags).not.toContain('FLAG_TURNO_1');
      expect(useGameStore.getState().recentlyGrantedFlags).toContain('FLAG_TURNO_2');
    });
  });

  describe('Inyección de Clímax y Retiro Dorado en el Store', () => {
    it('alcanza el Clímax procesal en el trimestre 24 cuando cardsSurvived llega a 23', () => {
      useGameStore.getState().startReignsGame('CUSTODIO_LIBRETA');

      // Simulamos que el jugador ha sobrevivido 22 cartas y responde a la 23ª
      useGameStore.setState({ cardsSurvived: 22 });

      const ok = useGameStore.getState().makeReignsChoice('right');
      expect(ok).toBe(true);

      const state = useGameStore.getState();
      expect(state.cardsSurvived).toBe(23);
      expect(state.currentReignsCard?.id).toBe(CLIMAX_CARD_ID);
      expect(state.getStageInfo().isClimax).toBe(true);
      expect(state.getStageInfo().quarterLabel).toContain('Trimestre 24');
    });
  });

  describe('Detección y Respuesta In Extremis en el Store', () => {
    it('expone getInExtremisStatus reactivamente según las estadísticas del jugador', () => {
      useGameStore.getState().startReignsGame('CUSTODIO_LIBRETA');

      // Estado inicial sano
      const initialExtremis = useGameStore.getState().getInExtremisStatus();
      expect(initialExtremis.active).toBe(false);

      // Modificamos manualmente la presión judicial al 88 (> 80)
      useGameStore.setState({
        stats: {
          ...useGameStore.getState().stats,
          presionJudicial: 88,
        },
      });

      const dangerExtremis = useGameStore.getState().getInExtremisStatus();
      expect(dangerExtremis.active).toBe(true);
      expect(dangerExtremis.criticalStats[0].key).toBe('presionJudicial');
      expect(dangerExtremis.criticalStats[0].dangerType).toBe('MAX_DANGER');
    });
  });
});
