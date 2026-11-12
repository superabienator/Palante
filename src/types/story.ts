import { z } from 'zod';

export const SphereTypeSchema = z.enum([
  'POLITICA',
  'ORDEN_JUSTICIA',
  'EMPRESARIAL',
]);
export type SphereType = z.infer<typeof SphereTypeSchema>;

export const ArchetypeIdSchema = z.enum([
  // I. Políticos
  'CUSTODIO_LIBRETA',
  'PROCONSUL_HORMIGON',
  'FONTANERO_INTERIOR',
  'PASANTE_GIRATORIO',
  // II. Fuerzas del Orden / Justicia
  'ARCHIVADOR_CLOACA',
  'ARQUITECTO_SOBRESEIMIENTO',
  'TAPON_INSTITUCIONAL',
  'DIFUNTO_CONVENIENCIA',
  // III. Empresarios / Financiadores
  'BARON_ENCOFRADO',
  'ALQUIMISTA_HORMIGONERA',
  'TAUMATURGO_AGUJERO',
  'LAVANDERO_TRANSNACIONAL',
]);
export type ArchetypeId = z.infer<typeof ArchetypeIdSchema>;

export const CharacterStatsSchema = z.object({
  pastaEnB: z.number().int().min(0).max(100).describe('Fondos opacos y mordidas acumuladas'),
  presionJudicial: z.number().int().min(0).max(100).describe('Atención de UCO, fiscales e inspectores'),
  impunidad: z.number().int().min(0).max(100).describe('Red clientelar, aforamiento y capacidad de chantaje'),
  reputacionMediatica: z.number().int().min(0).max(100).describe('Control de portadas y paz editorial'),
});
export type CharacterStats = z.infer<typeof CharacterStatsSchema>;

export const StatModifiersSchema = z.object({
  pastaEnB: z.number().int().optional(),
  presionJudicial: z.number().int().optional(),
  impunidad: z.number().int().optional(),
  reputacionMediatica: z.number().int().optional(),
});
export type StatModifiers = z.infer<typeof StatModifiersSchema>;

export const EndingTypeSchema = z.enum([
  'PRISION_INCONDICIONAL',
  'INDULTO_EXPRES',
  'FUGA_Y_PRESCRIPCION',
  'SOBRESEIMIENTO_BOTIN',
  'PURGA_DE_OFICIO',
  'CONSEJO_IBEX',
]);
export type EndingType = z.infer<typeof EndingTypeSchema>;

export const ChoiceSchema = z.object({
  id: z.string(),
  label: z.string().describe('Texto de la decisión con cinismo institucional'),
  flavorQuote: z.string().optional().describe('Extracto de sumario o pinchazo telefónico real'),
  mechanicId: z.number().int().min(1).max(40).optional().describe('ID de la mecánica de saqueo asociada (1-40)'),
  modifiers: StatModifiersSchema,
  nextNodeId: z.string(),
});
export type Choice = z.infer<typeof ChoiceSchema>;

export const StoryNodeSchema = z.object({
  id: z.string(),
  archetypeId: ArchetypeIdSchema,
  sphere: SphereTypeSchema,
  headline: z.string().describe('Titular sensacionalista o extracto de auto judicial'),
  context: z.string().describe('Narración estilo fanzine punk de los hechos'),
  evidenceDocument: z.string().optional().describe('Descripción de la prueba material intervenida'),
  choices: z.array(ChoiceSchema).min(1).max(4),
  ending: EndingTypeSchema.optional(),
});
export type StoryNode = z.infer<typeof StoryNodeSchema>;

export const CharacterProfileSchema = z.object({
  id: ArchetypeIdSchema,
  name: z.string(),
  sphere: SphereTypeSchema,
  realInspiration: z.string(),
  initialStats: CharacterStatsSchema,
  unlockedMechanics: z.array(z.number().int().min(1).max(40)),
});
export type CharacterProfile = z.infer<typeof CharacterProfileSchema>;

export const StoryGraphSchema = z.object({
  meta: z.object({
    title: z.string(),
    version: z.string(),
    initialNodeId: z.string(),
    characters: z.record(z.string(), CharacterProfileSchema),
  }),
  nodes: z.record(z.string(), StoryNodeSchema),
});
export type StoryGraph = z.infer<typeof StoryGraphSchema>;
