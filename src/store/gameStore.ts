import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  ArchetypeId,
  CharacterProfile,
  CharacterStats,
  EndingType,
  GameOverReason,
  LegislativeStageInfo,
  ReignsCard,
  ReignsCardChoice,
  RiskAssessment,
  SphereType,
  StatModifiers,
  StoryNode,
} from '../types/story';
import rawStoryData from '../content/story.json';
import reignsDeckData from '../content/reignsDeck.json';

import {
  ActivatedPrivilegeInfo,
  InExtremisCriticalStat,
  InExtremisStatus,
  LastDiceRollSummary,
  ProjectedStatsRange,
  SingleStatRollResult,
  StatVariance,
  STAT_LABELS,
  applyModifiers,
  calculateCardWeight,
  calculateProjectedStatsRange,
  calculateRiskAssessment,
  calculateStatVariance,
  checkReignsGameOver,
  clampStat,
  getInExtremisStatus,
  getLegislativeStageInfo,
  rollModifiersWithDice,
  selectNextReignsCard,
  weightedRandomSelect,
} from './reignsEngine';

// Re-exportar funciones y tipos del motor para compatibilidad y uso modular
export type {
  ActivatedPrivilegeInfo,
  InExtremisCriticalStat,
  InExtremisStatus,
  LastDiceRollSummary,
  ProjectedStatsRange,
  SingleStatRollResult,
  StatVariance,
};
export {
  STAT_LABELS,
  applyModifiers,
  calculateCardWeight,
  calculateProjectedStatsRange,
  calculateRiskAssessment,
  calculateStatVariance,
  checkReignsGameOver,
  clampStat,
  getInExtremisStatus,
  getLegislativeStageInfo,
  rollModifiersWithDice,
  selectNextReignsCard,
  weightedRandomSelect,
};

export interface GameHistoryEntry {
  nodeId: string;
  choiceId: string;
  choiceLabel: string;
  mechanicId?: number;
  modifiers: StatModifiers;
  statsBefore: CharacterStats;
  statsAfter: CharacterStats;
  timestamp: number;
}

export type GameStatus = 'NOT_STARTED' | 'PLAYING' | 'GAME_OVER';

export interface GameState {
  // Estado general (Estilo Reigns Puro)
  rulerGeneration: number;
  status: GameStatus;
  gameMode: 'REIGNS' | 'CLASSIC';
  selectedSphere: SphereType | null;
  selectedArchetypeId: ArchetypeId | null;
  characterProfile: CharacterProfile | null;
  stats: CharacterStats;
  ending: EndingType | null;

  // Estado Modo Reigns 2.0 con Banderas / Questlines
  currentReignsCard: ReignsCard | null;
  reignsDeck: ReignsCard[];
  reignsCardIndex: number;
  playedCardIds: string[];
  daysInPower: number; // cada carta ~ 90 días (un trimestre)
  cardsSurvived: number;
  bestQuartersSurvived: number;
  discoveredEndings: GameOverReason[];
  lastDeathReason: GameOverReason | null;
  previewDirection: 'left' | 'right' | null;
  lastDiceRoll: LastDiceRollSummary | null;
  gameOverReason: GameOverReason | null;
  gameOverDescription: string | null;
  activeFlags: Record<string, boolean>;
  recentlyGrantedFlags: string[];
  recentFlagsHistory: string[][];
  lastActivatedPrivilege: number | null;
  lastActivatedPrivilegeInfo: ActivatedPrivilegeInfo | null;

  // Estado Modo Clásico (legado)
  currentNodeId: string;
  currentNode: StoryNode | null;
  history: GameHistoryEntry[];
  unlockedMechanics: number[];
  evidenceDocuments: string[];

  // Acciones Reigns
  selectSphere: (sphere: SphereType) => void;
  startReignsGame: (archetypeId?: ArchetypeId) => boolean;
  startNewReign: (generation?: number) => void;
  nextSuccessor: () => void;
  returnToMenu: () => void;
  resetDynasty: () => void;
  selectCharacter?: (archetypeId?: ArchetypeId) => boolean;
  setPreviewDirection: (dir: 'left' | 'right' | null) => void;
  makeReignsChoice: (direction: 'left' | 'right') => boolean;
  getPreviewModifiers: () => StatModifiers | null;
  getProjectedStatsRange: () => ProjectedStatsRange | null;
  getActiveRiskAssessment: () => RiskAssessment | null;
  getInExtremisStatus: () => InExtremisStatus;
  clearLastDiceRoll: () => void;
  clearLastActivatedPrivilege: () => void;
  getStageInfo: () => LegislativeStageInfo;

  // Acciones Clásicas / Ciclo
  startGame: (archetypeId: ArchetypeId) => boolean;
  makeChoice: (choiceId: string) => boolean;
  restartGame: () => void;
  resetToCharacterSelect: () => void;
}

const DEFAULT_STATS: CharacterStats = {
  pastaEnB: 50,
  presionJudicial: 40,
  impunidad: 50,
  reputacionMediatica: 50,
};

function createInitialReignState(
  rulerGeneration = 1,
  status: GameStatus = 'PLAYING',
  meta: {
    bestQuartersSurvived?: number;
    discoveredEndings?: GameOverReason[];
    lastDeathReason?: GameOverReason | null;
  } = {}
) {
  const rawCards = reignsDeckData.cards as ReignsCard[];
  const initialStats = { ...DEFAULT_STATS };
  const inExtremisStatus = getInExtremisStatus(initialStats);

  const firstCard = selectNextReignsCard({
    allCards: rawCards,
    activeFlags: {},
    playedCardIds: [],
    cardsSurvived: 0,
    recentlyGrantedFlags: [],
    inExtremisStatus,
    currentStats: initialStats,
  });

  return {
    rulerGeneration,
    status,
    gameMode: 'REIGNS' as const,
    selectedSphere: null,
    selectedArchetypeId: null,
    characterProfile: null,
    stats: initialStats,
    ending: null,
    currentReignsCard: firstCard,
    reignsDeck: rawCards,
    reignsCardIndex: 0,
    playedCardIds: firstCard ? [firstCard.id] : [],
    daysInPower: 90,
    cardsSurvived: 0,
    bestQuartersSurvived: meta.bestQuartersSurvived ?? 0,
    discoveredEndings: meta.discoveredEndings ?? [],
    lastDeathReason: meta.lastDeathReason ?? null,
    previewDirection: null,
    lastDiceRoll: null,
    gameOverReason: null,
    gameOverDescription: null,
    activeFlags: {},
    recentlyGrantedFlags: [],
    recentFlagsHistory: [],
    lastActivatedPrivilege: null,
    lastActivatedPrivilegeInfo: null,
    currentNodeId: '',
    currentNode: null,
    history: [],
    unlockedMechanics: [],
    evidenceDocuments: firstCard?.evidenceDocument ? [firstCard.evidenceDocument] : [],
  };
}

const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...createInitialReignState(1, 'NOT_STARTED'),

      selectSphere: (sphere: SphereType) => {
        set({ selectedSphere: sphere });
      },

      startNewReign: (generation = 1) => {
        set((state) =>
          createInitialReignState(generation, 'PLAYING', {
            bestQuartersSurvived: state.bestQuartersSurvived,
            discoveredEndings: state.discoveredEndings,
            lastDeathReason: state.lastDeathReason,
          })
        );
      },

      nextSuccessor: () => {
        set((state) =>
          createInitialReignState((state.rulerGeneration || 1) + 1, 'PLAYING', {
            bestQuartersSurvived: state.bestQuartersSurvived,
            discoveredEndings: state.discoveredEndings,
            lastDeathReason: state.lastDeathReason,
          })
        );
      },

      startReignsGame: (): boolean => {
        set((state) =>
          createInitialReignState(1, 'PLAYING', {
            bestQuartersSurvived: state.bestQuartersSurvived,
            discoveredEndings: state.discoveredEndings,
            lastDeathReason: state.lastDeathReason,
          })
        );
        return true;
      },

      selectCharacter: (): boolean => {
        set((state) =>
          createInitialReignState(1, 'PLAYING', {
            bestQuartersSurvived: state.bestQuartersSurvived,
            discoveredEndings: state.discoveredEndings,
            lastDeathReason: state.lastDeathReason,
          })
        );
        return true;
      },

      setPreviewDirection: (dir: 'left' | 'right' | null) => {
        set({ previewDirection: dir });
      },

      getPreviewModifiers: (): StatModifiers | null => {
        const { currentReignsCard, previewDirection } = get();
        if (!currentReignsCard || !previewDirection) {
          return null;
        }
        return previewDirection === 'left'
          ? currentReignsCard.leftChoice.modifiers
          : currentReignsCard.rightChoice.modifiers;
      },

      getProjectedStatsRange: (): ProjectedStatsRange | null => {
        const { currentReignsCard, previewDirection } = get();
        if (!currentReignsCard || !previewDirection) {
          return null;
        }
        const modifiers =
          previewDirection === 'left'
            ? currentReignsCard.leftChoice.modifiers
            : currentReignsCard.rightChoice.modifiers;
        return calculateProjectedStatsRange(modifiers);
      },

      getActiveRiskAssessment: (): RiskAssessment | null => {
        const { status, stats } = get();
        if (status !== 'PLAYING') {
          return null;
        }
        const projectedRange = get().getProjectedStatsRange();
        return calculateRiskAssessment(stats, projectedRange);
      },

      getInExtremisStatus: (): InExtremisStatus => {
        return getInExtremisStatus(get().stats);
      },

      clearLastDiceRoll: () => {
        set({ lastDiceRoll: null });
      },

      clearLastActivatedPrivilege: () => {
        set({ lastActivatedPrivilege: null, lastActivatedPrivilegeInfo: null });
      },

      getStageInfo: (): LegislativeStageInfo => {
        return getLegislativeStageInfo(get().cardsSurvived);
      },

      makeReignsChoice: (direction: 'left' | 'right'): boolean => {
        const {
          status,
          currentReignsCard,
          stats,
          daysInPower,
          cardsSurvived,
          playedCardIds,
          bestQuartersSurvived,
          discoveredEndings,
          evidenceDocuments,
          activeFlags,
          recentFlagsHistory,
        } = get();

        if (status !== 'PLAYING' || !currentReignsCard) {
          return false;
        }

        const choice: ReignsCardChoice =
          direction === 'left' ? currentReignsCard.leftChoice : currentReignsCard.rightChoice;

        // Ejecutar tirada de dados D6 pura (sin modificadores RPG de personaje)
        const { rolledModifiers, summary } = rollModifiersWithDice(
          choice.modifiers,
          direction,
          choice.stampText
        );

        const nextStats = applyModifiers(stats, rolledModifiers);
        const nextCardsSurvived = cardsSurvived + 1;
        const nextDays = daysInPower + 90;

        // Enriquecer el resumen con el antes/después de cada estadística y contexto de la decisión
        const enrichedSummary: LastDiceRollSummary = {
          ...summary,
          cardHeadline: currentReignsCard.headline,
          choiceLabel: choice.label,
          flavorQuote: choice.flavorQuote,
          rolls: summary.rolls.map((r) => ({
            ...r,
            statBefore: stats[r.statKey],
            statAfter: nextStats[r.statKey],
          })),
        };

        // Actualización de banderas activas (flags) y cola de banderas recientes (últimos 3 turnos)
        const updatedFlags = { ...activeFlags };
        const newlyGranted = choice.grantedFlags ?? [];
        if (newlyGranted.length > 0) {
          for (const flag of newlyGranted) {
            updatedFlags[flag] = true;
          }
        }

        const updatedFlagsHistory = [...(recentFlagsHistory ?? []), newlyGranted].slice(-3);
        const updatedRecentlyGrantedFlags = Array.from(new Set(updatedFlagsHistory.flat()));

        const nextEvidences =
          currentReignsCard.evidenceDocument &&
          !evidenceDocuments.includes(currentReignsCard.evidenceDocument)
            ? [...evidenceDocuments, currentReignsCard.evidenceDocument]
            : evidenceDocuments;

        // Fin de partida
        const verdict = checkReignsGameOver(nextStats, nextCardsSurvived);
        const nextBestQuarters = Math.max(bestQuartersSurvived || 0, nextCardsSurvived);

        if (verdict.isGameOver) {
          const nextDiscovered =
            verdict.reason && !discoveredEndings.includes(verdict.reason)
              ? [...discoveredEndings, verdict.reason]
              : discoveredEndings;

          set({
            stats: nextStats,
            status: 'GAME_OVER',
            gameOverReason: verdict.reason,
            gameOverDescription: verdict.description,
            ending: verdict.ending,
            previewDirection: null,
            lastDiceRoll: enrichedSummary,
            cardsSurvived: nextCardsSurvived,
            bestQuartersSurvived: nextBestQuarters,
            discoveredEndings: nextDiscovered,
            lastDeathReason: verdict.reason,
            daysInPower: nextDays,
            activeFlags: updatedFlags,
            recentlyGrantedFlags: updatedRecentlyGrantedFlags,
            recentFlagsHistory: updatedFlagsHistory,
            lastActivatedPrivilege: null,
            lastActivatedPrivilegeInfo: null,
            unlockedMechanics: [],
            evidenceDocuments: nextEvidences,
          });
          return true;
        }

        // Selección ponderada del siguiente dilema guiada únicamente por medidores, sagas (5x), in extremis (10x/20x), memoria de baraja y clímax (trimestre 24)
        const inExtremisStatus = getInExtremisStatus(nextStats);
        const allCards = reignsDeckData.cards as ReignsCard[];
        const updatedPlayedIds = playedCardIds.includes(currentReignsCard.id)
          ? playedCardIds
          : [...playedCardIds, currentReignsCard.id];
        const nextCard =
          selectNextReignsCard({
            allCards,
            activeFlags: updatedFlags,
            currentCardId: currentReignsCard.id,
            playedCardIds: updatedPlayedIds,
            cardsSurvived: nextCardsSurvived,
            recentlyGrantedFlags: updatedRecentlyGrantedFlags,
            inExtremisStatus,
            currentStats: nextStats,
          }) ?? currentReignsCard;

        set({
          stats: nextStats,
          currentReignsCard: nextCard,
          reignsDeck: allCards,
          playedCardIds: nextCard && !updatedPlayedIds.includes(nextCard.id)
            ? [...updatedPlayedIds, nextCard.id]
            : updatedPlayedIds,
          daysInPower: nextDays,
          cardsSurvived: nextCardsSurvived,
          bestQuartersSurvived: nextBestQuarters,
          previewDirection: null,
          lastDiceRoll: enrichedSummary,
          activeFlags: updatedFlags,
          recentlyGrantedFlags: updatedRecentlyGrantedFlags,
          recentFlagsHistory: updatedFlagsHistory,
          lastActivatedPrivilege: null,
          lastActivatedPrivilegeInfo: null,
          unlockedMechanics: [],
          evidenceDocuments: nextEvidences,
        });

        return true;
      },

      startGame: (archetypeId: ArchetypeId): boolean => {
        const characters = rawStoryData.meta.characters as Record<string, CharacterProfile>;
        const character = characters[archetypeId];
        if (!character) {
          return false;
        }

        const initialNodeId = rawStoryData.meta.initialNodeId;
        const initialNode = (rawStoryData.nodes as Record<string, StoryNode>)[initialNodeId];
        if (!initialNode) {
          return false;
        }

        const initialEvidences: string[] = initialNode.evidenceDocument
          ? [initialNode.evidenceDocument]
          : [];

        set({
          status: 'PLAYING',
          gameMode: 'CLASSIC',
          selectedArchetypeId: archetypeId,
          characterProfile: { ...character },
          stats: { ...character.initialStats },
          currentNodeId: initialNodeId,
          currentNode: { ...initialNode },
          history: [],
          unlockedMechanics: [],
          evidenceDocuments: initialEvidences,
          ending: initialNode.ending ?? null,
          lastActivatedPrivilege: null,
          lastActivatedPrivilegeInfo: null,
        });

        return true;
      },

      makeChoice: (choiceId: string): boolean => {
        const { status, currentNode, stats, history, evidenceDocuments } = get();

        if (status !== 'PLAYING' || !currentNode) {
          return false;
        }

        const choice = currentNode.choices.find((c) => c.id === choiceId);
        if (!choice) {
          return false;
        }

        const nodes = rawStoryData.nodes as Record<string, StoryNode>;
        const nextNode = nodes[choice.nextNodeId];
        if (!nextNode) {
          return false;
        }

        const statsAfter = applyModifiers(stats, choice.modifiers);

        const historyEntry: GameHistoryEntry = {
          nodeId: currentNode.id,
          choiceId: choice.id,
          choiceLabel: choice.label,
          mechanicId: choice.mechanicId,
          modifiers: choice.modifiers,
          statsBefore: { ...stats },
          statsAfter,
          timestamp: Date.now(),
        };

        const nextEvidences =
          nextNode.evidenceDocument && !evidenceDocuments.includes(nextNode.evidenceDocument)
            ? [...evidenceDocuments, nextNode.evidenceDocument]
            : evidenceDocuments;

        let isGameOver = false;
        let resolvedEnding: EndingType | null = null;

        if (nextNode.ending) {
          isGameOver = true;
          resolvedEnding = nextNode.ending;
        } else if (statsAfter.presionJudicial >= 100) {
          isGameOver = true;
          resolvedEnding = 'PRISION_INCONDICIONAL';
        }

        set({
          stats: statsAfter,
          currentNodeId: nextNode.id,
          currentNode: { ...nextNode },
          history: [...history, historyEntry],
          unlockedMechanics: [],
          evidenceDocuments: nextEvidences,
          status: isGameOver ? 'GAME_OVER' : 'PLAYING',
          ending: resolvedEnding,
          lastActivatedPrivilege: null,
          lastActivatedPrivilegeInfo: null,
        });

        return true;
      },

      restartGame: () => {
        set((state) =>
          createInitialReignState((state.rulerGeneration || 1) + 1, 'PLAYING', {
            bestQuartersSurvived: state.bestQuartersSurvived,
            discoveredEndings: state.discoveredEndings,
            lastDeathReason: state.lastDeathReason,
          })
        );
      },

      resetToCharacterSelect: () => {
        set(createInitialReignState(1, 'NOT_STARTED'));
      },

      returnToMenu: () => {
        set((state) => {
          if (state.status === 'GAME_OVER') {
            return createInitialReignState((state.rulerGeneration || 1) + 1, 'NOT_STARTED', {
              bestQuartersSurvived: state.bestQuartersSurvived,
              discoveredEndings: state.discoveredEndings,
              lastDeathReason: state.lastDeathReason,
            });
          }
          return { status: 'NOT_STARTED' as const, previewDirection: null };
        });
      },

      resetDynasty: () => {
        set(createInitialReignState(1, 'NOT_STARTED'));
      },
    }),
    {
      name: 'ibex35-fanzine-game-storage',
      version: 4,
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? window.localStorage : dummyStorage
      ),
      partialize: (state) => ({
        rulerGeneration: state.rulerGeneration,
        status: state.status,
        gameMode: state.gameMode,
        stats: state.stats,
        playedCardIds: state.playedCardIds,
        daysInPower: state.daysInPower,
        cardsSurvived: state.cardsSurvived,
        bestQuartersSurvived: state.bestQuartersSurvived,
        discoveredEndings: state.discoveredEndings,
        lastDeathReason: state.lastDeathReason,
        activeFlags: state.activeFlags,
        recentlyGrantedFlags: state.recentlyGrantedFlags,
        recentFlagsHistory: state.recentFlagsHistory,
        evidenceDocuments: state.evidenceDocuments,
        ending: state.ending,
        gameOverReason: state.gameOverReason,
        gameOverDescription: state.gameOverDescription,
      }),
      migrate: () => createInitialReignState(1, 'NOT_STARTED'),
    }
  )
);
