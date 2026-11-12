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
import { PRIVILEGES_REGISTRY } from '../config/privileges';
import rawStoryData from '../content/story.json';
import reignsDeckData from '../content/reignsDeck.json';

import {
  ActivatedPrivilegeInfo,
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
  getLegislativeStageInfo,
  isCardAffiliated,
  rollModifiersWithDice,
  selectNextReignsCard,
  weightedRandomSelect,
} from './reignsEngine';

// Re-exportar funciones y tipos del motor para compatibilidad y uso modular
export type {
  ActivatedPrivilegeInfo,
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
  getLegislativeStageInfo,
  isCardAffiliated,
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
  // Estado general
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
  daysInPower: number; // cada carta ~ 90 días (un trimestre)
  cardsSurvived: number;
  previewDirection: 'left' | 'right' | null;
  lastDiceRoll: LastDiceRollSummary | null;
  gameOverReason: GameOverReason | null;
  gameOverDescription: string | null;
  activeFlags: Record<string, boolean>;
  recentlyGrantedFlags: Record<string, boolean> extends never ? string[] : string[];
  recentFlagsHistory: string[][];
  lastActivatedPrivilege: number | null;
  lastActivatedPrivilegeInfo: ActivatedPrivilegeInfo | null;

  // Estado Modo Clásico
  currentNodeId: string;
  currentNode: StoryNode | null;
  history: GameHistoryEntry[];
  unlockedMechanics: number[];
  evidenceDocuments: string[];

  // Acciones Reigns
  selectSphere: (sphere: SphereType) => void;
  startReignsGame: (archetypeId: ArchetypeId) => boolean;
  setPreviewDirection: (dir: 'left' | 'right' | null) => void;
  makeReignsChoice: (direction: 'left' | 'right') => boolean;
  getPreviewModifiers: () => StatModifiers | null;
  getProjectedStatsRange: () => ProjectedStatsRange | null;
  getActiveRiskAssessment: () => RiskAssessment | null;
  clearLastDiceRoll: () => void;
  clearLastActivatedPrivilege: () => void;
  getStageInfo: () => LegislativeStageInfo;

  // Acciones Clásicas
  startGame: (archetypeId: ArchetypeId) => boolean;
  makeChoice: (choiceId: string) => boolean;
  restartGame: () => void;
  resetToCharacterSelect: () => void;
}

const DEFAULT_STATS: CharacterStats = {
  pastaEnB: 50,
  presionJudicial: 20,
  impunidad: 50,
  reputacionMediatica: 50,
};

const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      status: 'NOT_STARTED',
      gameMode: 'REIGNS',
      selectedSphere: null,
      selectedArchetypeId: null,
      characterProfile: null,
      stats: DEFAULT_STATS,
      ending: null,

      currentReignsCard: null,
      reignsDeck: [],
      reignsCardIndex: 0,
      daysInPower: 0,
      cardsSurvived: 0,
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
      evidenceDocuments: [],

      selectSphere: (sphere: SphereType) => {
        set({ selectedSphere: sphere });
      },

      startReignsGame: (archetypeId: ArchetypeId): boolean => {
        const characters = reignsDeckData.characters as Record<string, CharacterProfile>;
        const character = characters[archetypeId];
        if (!character) {
          return false;
        }

        const rawCards = reignsDeckData.cards as ReignsCard[];
        const initialFlags: Record<string, boolean> = {};

        const firstCard = selectNextReignsCard({
          allCards: rawCards,
          activeFlags: initialFlags,
          cardsSurvived: 0,
          characterProfile: character,
          recentlyGrantedFlags: [],
        });

        set({
          status: 'PLAYING',
          gameMode: 'REIGNS',
          selectedSphere: character.sphere,
          selectedArchetypeId: archetypeId,
          characterProfile: { ...character },
          stats: { ...character.initialStats },
          reignsDeck: rawCards,
          currentReignsCard: firstCard,
          reignsCardIndex: 0,
          daysInPower: 90,
          cardsSurvived: 0,
          previewDirection: null,
          lastDiceRoll: null,
          gameOverReason: null,
          gameOverDescription: null,
          activeFlags: initialFlags,
          recentlyGrantedFlags: [],
          recentFlagsHistory: [],
          lastActivatedPrivilege: null,
          ending: null,
          unlockedMechanics: [...character.unlockedMechanics],
          evidenceDocuments: firstCard?.evidenceDocument ? [firstCard.evidenceDocument] : [],
        });

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
        const { currentReignsCard, previewDirection, unlockedMechanics } = get();
        if (!currentReignsCard || !previewDirection) {
          return null;
        }
        const modifiers =
          previewDirection === 'left'
            ? currentReignsCard.leftChoice.modifiers
            : currentReignsCard.rightChoice.modifiers;
        return calculateProjectedStatsRange(modifiers, unlockedMechanics);
      },

      getActiveRiskAssessment: (): RiskAssessment | null => {
        const { status, stats } = get();
        if (status !== 'PLAYING') {
          return null;
        }
        const projectedRange = get().getProjectedStatsRange();
        return calculateRiskAssessment(stats, projectedRange);
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
          unlockedMechanics,
          evidenceDocuments,
          activeFlags,
          characterProfile,
          recentFlagsHistory,
        } = get();

        if (status !== 'PLAYING' || !currentReignsCard) {
          return false;
        }

        const choice: ReignsCardChoice =
          direction === 'left' ? currentReignsCard.leftChoice : currentReignsCard.rightChoice;

        // Ejecutar tirada de dados aplicando privilegios pasivos del personaje
        const { rolledModifiers, summary } = rollModifiersWithDice(
          choice.modifiers,
          unlockedMechanics,
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
          unlockedPrivilegeId:
            choice.mechanicId !== undefined && !unlockedMechanics.includes(choice.mechanicId)
              ? choice.mechanicId
              : undefined,
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

        // Registro de privilegio activado para feedback visual y animación de pines
        let nextLastActivatedPrivilege: number | null = null;
        let nextLastActivatedPrivilegeInfo: ActivatedPrivilegeInfo | null = null;
        if (choice.mechanicId !== undefined) {
          const privDef = PRIVILEGES_REGISTRY[choice.mechanicId];
          const isNew = !unlockedMechanics.includes(choice.mechanicId);
          nextLastActivatedPrivilege = choice.mechanicId;
          nextLastActivatedPrivilegeInfo = {
            id: choice.mechanicId,
            name: privDef?.name ?? `Mecánica #${choice.mechanicId}`,
            category: privDef?.category,
            shortTag: privDef?.shortTag,
            description: privDef?.description,
            inGameEffect: privDef?.inGameEffect,
            isNewUnlock: isNew,
            timestamp: Date.now(),
          };
        }

        // Nuevas mecánicas y pruebas
        const nextUnlockedMechanics =
          choice.mechanicId !== undefined && !unlockedMechanics.includes(choice.mechanicId)
            ? [...unlockedMechanics, choice.mechanicId]
            : unlockedMechanics;

        const nextEvidences =
          currentReignsCard.evidenceDocument &&
          !evidenceDocuments.includes(currentReignsCard.evidenceDocument)
            ? [...evidenceDocuments, currentReignsCard.evidenceDocument]
            : evidenceDocuments;

        // Fin de partida
        const verdict = checkReignsGameOver(nextStats, nextCardsSurvived);

        if (verdict.isGameOver) {
          set({
            stats: nextStats,
            status: 'GAME_OVER',
            gameOverReason: verdict.reason,
            gameOverDescription: verdict.description,
            ending: verdict.ending,
            previewDirection: null,
            lastDiceRoll: enrichedSummary,
            cardsSurvived: nextCardsSurvived,
            daysInPower: nextDays,
            activeFlags: updatedFlags,
            recentlyGrantedFlags: updatedRecentlyGrantedFlags,
            recentFlagsHistory: updatedFlagsHistory,
            lastActivatedPrivilege: nextLastActivatedPrivilege,
            lastActivatedPrivilegeInfo: nextLastActivatedPrivilegeInfo,
            unlockedMechanics: nextUnlockedMechanics,
            evidenceDocuments: nextEvidences,
          });
          return true;
        }

        // Selección ponderada del siguiente dilema según esferas (65%), sagas (peso 5x) y clímax (trimestre 24)
        const allCards = reignsDeckData.cards as ReignsCard[];
        const nextCard =
          selectNextReignsCard({
            allCards,
            activeFlags: updatedFlags,
            currentCardId: currentReignsCard.id,
            cardsSurvived: nextCardsSurvived,
            characterProfile,
            recentlyGrantedFlags: updatedRecentlyGrantedFlags,
          }) ?? currentReignsCard;

        set({
          stats: nextStats,
          currentReignsCard: nextCard,
          reignsDeck: allCards,
          daysInPower: nextDays,
          cardsSurvived: nextCardsSurvived,
          previewDirection: null,
          lastDiceRoll: enrichedSummary,
          activeFlags: updatedFlags,
          recentlyGrantedFlags: updatedRecentlyGrantedFlags,
          recentFlagsHistory: updatedFlagsHistory,
          lastActivatedPrivilege: nextLastActivatedPrivilege,
          lastActivatedPrivilegeInfo: nextLastActivatedPrivilegeInfo,
          unlockedMechanics: nextUnlockedMechanics,
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
          unlockedMechanics: [...character.unlockedMechanics],
          evidenceDocuments: initialEvidences,
          ending: initialNode.ending ?? null,
          lastActivatedPrivilege: null,
        });

        return true;
      },

      makeChoice: (choiceId: string): boolean => {
        const { status, currentNode, stats, history, unlockedMechanics, evidenceDocuments } =
          get();

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

        let nextLastActivatedPrivilege: number | null = null;
        let nextLastActivatedPrivilegeInfo: ActivatedPrivilegeInfo | null = null;
        if (choice.mechanicId !== undefined) {
          const privDef = PRIVILEGES_REGISTRY[choice.mechanicId];
          const isNew = !unlockedMechanics.includes(choice.mechanicId);
          nextLastActivatedPrivilege = choice.mechanicId;
          nextLastActivatedPrivilegeInfo = {
            id: choice.mechanicId,
            name: privDef?.name ?? `Mecánica #${choice.mechanicId}`,
            category: privDef?.category,
            shortTag: privDef?.shortTag,
            description: privDef?.description,
            inGameEffect: privDef?.inGameEffect,
            isNewUnlock: isNew,
            timestamp: Date.now(),
          };
        }

        const nextUnlockedMechanics =
          choice.mechanicId !== undefined && !unlockedMechanics.includes(choice.mechanicId)
            ? [...unlockedMechanics, choice.mechanicId]
            : unlockedMechanics;

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
          unlockedMechanics: nextUnlockedMechanics,
          evidenceDocuments: nextEvidences,
          status: isGameOver ? 'GAME_OVER' : 'PLAYING',
          ending: resolvedEnding,
          lastActivatedPrivilege: nextLastActivatedPrivilege,
          lastActivatedPrivilegeInfo: nextLastActivatedPrivilegeInfo,
        });

        return true;
      },

      restartGame: () => {
        const { selectedArchetypeId, gameMode } = get();
        if (selectedArchetypeId) {
          if (gameMode === 'REIGNS') {
            get().startReignsGame(selectedArchetypeId);
          } else {
            get().startGame(selectedArchetypeId);
          }
        }
      },

      resetToCharacterSelect: () => {
        set({
          status: 'NOT_STARTED',
          selectedSphere: null,
          selectedArchetypeId: null,
          characterProfile: null,
          stats: DEFAULT_STATS,
          currentNodeId: '',
          currentNode: null,
          currentReignsCard: null,
          reignsDeck: [],
          reignsCardIndex: 0,
          daysInPower: 0,
          cardsSurvived: 0,
          previewDirection: null,
          lastDiceRoll: null,
          gameOverReason: null,
          gameOverDescription: null,
          activeFlags: {},
          recentlyGrantedFlags: [],
          recentFlagsHistory: [],
          lastActivatedPrivilege: null,
          lastActivatedPrivilegeInfo: null,
          history: [],
          unlockedMechanics: [],
          evidenceDocuments: [],
          ending: null,
        });
      },
    }),
    {
      name: 'ibex35-fanzine-game-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? window.localStorage : dummyStorage
      ),
      partialize: (state) => ({
        status: state.status,
        gameMode: state.gameMode,
        selectedSphere: state.selectedSphere,
        selectedArchetypeId: state.selectedArchetypeId,
        characterProfile: state.characterProfile,
        stats: state.stats,
        daysInPower: state.daysInPower,
        cardsSurvived: state.cardsSurvived,
        activeFlags: state.activeFlags,
        recentlyGrantedFlags: state.recentlyGrantedFlags,
        recentFlagsHistory: state.recentFlagsHistory,
        lastActivatedPrivilege: state.lastActivatedPrivilege,
        lastActivatedPrivilegeInfo: state.lastActivatedPrivilegeInfo,
        unlockedMechanics: state.unlockedMechanics,
        evidenceDocuments: state.evidenceDocuments,
        ending: state.ending,
        gameOverReason: state.gameOverReason,
        gameOverDescription: state.gameOverDescription,
      }),
    }
  )
);
