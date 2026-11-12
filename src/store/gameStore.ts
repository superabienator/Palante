import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  ArchetypeId,
  CharacterProfile,
  CharacterStats,
  EndingType,
  StatModifiers,
  StoryNode,
} from '../types/story';
import rawStoryData from '../content/story.json';

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
  // Estado
  status: GameStatus;
  selectedArchetypeId: ArchetypeId | null;
  characterProfile: CharacterProfile | null;
  stats: CharacterStats;
  currentNodeId: string;
  currentNode: StoryNode | null;
  history: GameHistoryEntry[];
  unlockedMechanics: number[];
  evidenceDocuments: string[];
  ending: EndingType | null;

  // Acciones
  startGame: (archetypeId: ArchetypeId) => boolean;
  makeChoice: (choiceId: string) => boolean;
  restartGame: () => void;
  resetToCharacterSelect: () => void;
}

const DEFAULT_STATS: CharacterStats = {
  pastaEnB: 0,
  presionJudicial: 0,
  impunidad: 0,
  reputacionMediatica: 0,
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

const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      status: 'NOT_STARTED',
      selectedArchetypeId: null,
      characterProfile: null,
      stats: DEFAULT_STATS,
      currentNodeId: '',
      currentNode: null,
      history: [],
      unlockedMechanics: [],
      evidenceDocuments: [],
      ending: null,

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
          selectedArchetypeId: archetypeId,
          characterProfile: { ...character },
          stats: { ...character.initialStats },
          currentNodeId: initialNodeId,
          currentNode: { ...initialNode },
          history: [],
          unlockedMechanics: [...character.unlockedMechanics],
          evidenceDocuments: initialEvidences,
          ending: initialNode.ending ?? null,
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

        // Registro de historial
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

        // Nuevas mecánicas desbloqueadas
        const nextUnlockedMechanics =
          choice.mechanicId !== undefined && !unlockedMechanics.includes(choice.mechanicId)
            ? [...unlockedMechanics, choice.mechanicId]
            : unlockedMechanics;

        // Nuevos documentos de prueba incautados
        const nextEvidences =
          nextNode.evidenceDocument && !evidenceDocuments.includes(nextNode.evidenceDocument)
            ? [...evidenceDocuments, nextNode.evidenceDocument]
            : evidenceDocuments;

        // Determinación de Game Over / Ending
        let isGameOver = false;
        let resolvedEnding: EndingType | null = null;

        if (nextNode.ending) {
          isGameOver = true;
          resolvedEnding = nextNode.ending;
        } else if (statsAfter.presionJudicial >= 100) {
          // Si la presión judicial toca techo, la UCO y el juez dictan prisión incondicional
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
        });

        return true;
      },

      restartGame: () => {
        const { selectedArchetypeId } = get();
        if (selectedArchetypeId) {
          get().startGame(selectedArchetypeId);
        }
      },

      resetToCharacterSelect: () => {
        set({
          status: 'NOT_STARTED',
          selectedArchetypeId: null,
          characterProfile: null,
          stats: DEFAULT_STATS,
          currentNodeId: '',
          currentNode: null,
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
        selectedArchetypeId: state.selectedArchetypeId,
        characterProfile: state.characterProfile,
        stats: state.stats,
        currentNodeId: state.currentNodeId,
        currentNode: state.currentNode,
        history: state.history,
        unlockedMechanics: state.unlockedMechanics,
        evidenceDocuments: state.evidenceDocuments,
        ending: state.ending,
      }),
    }
  )
);
