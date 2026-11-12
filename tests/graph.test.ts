import { describe, it, expect } from 'vitest';
import { Choice, StoryGraphSchema } from '../src/types/story';
import storyData from '../src/content/story.json';

describe('Graph & Lore Verification Harness (Hito 2)', () => {
  it('valida el grafo completo contra el esquema Zod actualizado', () => {
    const result = StoryGraphSchema.safeParse(storyData);
    expect(result.success, result.error?.message).toBe(true);
  });

  it('el nodo inicial corresponde a un personaje registrado en meta', () => {
    const initialNode = storyData.nodes[storyData.meta.initialNodeId as keyof typeof storyData.nodes];
    expect(initialNode).toBeDefined();
    expect(storyData.meta.characters[initialNode.archetypeId as keyof typeof storyData.meta.characters]).toBeDefined();
  });

  it('todos los nextNodeId apuntan a nodos válidos y existentes', () => {
    const nodeIds = new Set(Object.keys(storyData.nodes));
    const missingPointers: string[] = [];

    for (const [id, node] of Object.entries(storyData.nodes)) {
      for (const choice of node.choices) {
        if (!nodeIds.has(choice.nextNodeId)) {
          missingPointers.push(`${id} -> ${choice.nextNodeId}`);
        }
      }
    }
    expect(missingPointers, `Enlaces huérfanos: ${missingPointers.join(', ')}`).toHaveLength(0);
  });

  it('las mecánicas asignadas a las elecciones corresponden al rango legal (1-40)', () => {
    for (const node of Object.values(storyData.nodes)) {
      for (const choice of node.choices as Choice[]) {
        if (choice.mechanicId !== undefined) {
          expect(choice.mechanicId).toBeGreaterThanOrEqual(1);
          expect(choice.mechanicId).toBeLessThanOrEqual(40);
        }
      }
    }
  });
});
