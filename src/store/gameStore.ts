import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  ArchetypeId,
  CharacterProfile,
  CharacterStats,
  EndingType,
  GameOverReason,
  ReignsCard,
  ReignsCardChoice,
  SphereType,
  StatModifiers,
  StoryNode,
} from '../types/story';
import rawStoryData from '../content/story.json';
import reignsDeckData from '../content/reignsDeck.json';

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

  // Estado Modo Reigns
  currentReignsCard: ReignsCard | null;
  reignsDeck: ReignsCard[];
  reignsCardIndex: number;
  daysInPower: number; // cada carta ~ 90 días (un trimestre)
  cardsSurvived: number;
  previewDirection: 'left' | 'right' | null;
  gameOverReason: GameOverReason | null;
  gameOverDescription: string | null;

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

function shuffleCards(cards: ReignsCard[]): ReignsCard[] {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
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
      gameOverReason: null,
      gameOverDescription: null,

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

        const cards = reignsDeckData.cards as ReignsCard[];
        const shuffled = shuffleCards(cards);
        const firstCard = shuffled[0] ?? null;

        set({
          status: 'PLAYING',
          gameMode: 'REIGNS',
          selectedSphere: character.sphere,
          selectedArchetypeId: archetypeId,
          characterProfile: { ...character },
          stats: { ...character.initialStats },
          reignsDeck: shuffled,
          currentReignsCard: firstCard,
          reignsCardIndex: 0,
          daysInPower: 90, // Primer trimestre
          cardsSurvived: 0,
          previewDirection: null,
          gameOverReason: null,
          gameOverDescription: null,
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

      makeReignsChoice: (direction: 'left' | 'right'): boolean => {
        const {
          status,
          currentReignsCard,
          stats,
          reignsDeck,
          reignsCardIndex,
          daysInPower,
          cardsSurvived,
          unlockedMechanics,
          evidenceDocuments,
        } = get();

        if (status !== 'PLAYING' || !currentReignsCard) {
          return false;
        }

        const choice: ReignsCardChoice =
          direction === 'left' ? currentReignsCard.leftChoice : currentReignsCard.rightChoice;

        const nextStats = applyModifiers(stats, choice.modifiers);
        const nextCardsSurvived = cardsSurvived + 1;
        const nextDays = daysInPower + 90; // +1 trimestre

        // Desbloqueo de mecánicas y acumulación de pruebas
        const nextUnlockedMechanics =
          choice.mechanicId !== undefined && !unlockedMechanics.includes(choice.mechanicId)
            ? [...unlockedMechanics, choice.mechanicId]
            : unlockedMechanics;

        const nextEvidences =
          currentReignsCard.evidenceDocument &&
          !evidenceDocuments.includes(currentReignsCard.evidenceDocument)
            ? [...evidenceDocuments, currentReignsCard.evidenceDocument]
            : evidenceDocuments;

        // Evaluación de fin de partida estilo Reigns
        const verdict = checkReignsGameOver(nextStats, nextCardsSurvived);

        if (verdict.isGameOver) {
          set({
            stats: nextStats,
            status: 'GAME_OVER',
            gameOverReason: verdict.reason,
            gameOverDescription: verdict.description,
            ending: verdict.ending,
            previewDirection: null,
            cardsSurvived: nextCardsSurvived,
            daysInPower: nextDays,
            unlockedMechanics: nextUnlockedMechanics,
            evidenceDocuments: nextEvidences,
          });
          return true;
        }

        // Selección de la siguiente carta
        const nextIndex = (reignsCardIndex + 1) % reignsDeck.length;
        const nextCard = reignsDeck[nextIndex];

        set({
          stats: nextStats,
          currentReignsCard: nextCard,
          reignsCardIndex: nextIndex,
          daysInPower: nextDays,
          cardsSurvived: nextCardsSurvived,
          previewDirection: null,
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
          gameOverReason: null,
          gameOverDescription: null,
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
        unlockedMechanics: state.unlockedMechanics,
        evidenceDocuments: state.evidenceDocuments,
        ending: state.ending,
        gameOverReason: state.gameOverReason,
        gameOverDescription: state.gameOverDescription,
      }),
    }
  )
);
