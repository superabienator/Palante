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
  portraitUrl: z.string().optional().describe('Ruta a la ilustración fanzine del arquetipo'),
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

// === Esquemas de Extensión para el Modo Reigns 2.0 (Cadenas y Banderas) ===

export const ReignsCardChoiceSchema = z.object({
  label: z.string().describe('Texto descriptivo de la acción elegida'),
  stampText: z.string().describe('Texto del sello de caucho emergente (ej. TRINCAR, RECHAZAR)'),
  flavorQuote: z.string().optional().describe('Cita real de sumario o pinchazo'),
  mechanicId: z.number().int().min(1).max(40).optional(),
  modifiers: StatModifiersSchema,
  grantedFlags: z.array(z.string()).optional().describe('Banderas/flags que activa esta elección'),
});
export type ReignsCardChoice = z.infer<typeof ReignsCardChoiceSchema>;

export const ReignsCardSchema = z.object({
  id: z.string(),
  speaker: z.string().describe('Nombre del interlocutor'),
  speakerRole: z.string().describe('Cargo o papel en la trama (ej. Constructor, Fiscal, Ministro)'),
  speakerAvatar: z.string().optional().describe('Icono o código de recorte fanzine'),
  portraitUrl: z.string().optional().describe('Ruta a la ilustración fanzine de la carta o interlocutor'),
  sphere: SphereTypeSchema.optional(),
  headline: z.string().describe('Titular del dilema'),
  context: z.string().describe('Narración fanzine del dilema'),
  evidenceDocument: z.string().optional().describe('Pieza de convicción incautada si aplica'),
  leftChoice: ReignsCardChoiceSchema,
  rightChoice: ReignsCardChoiceSchema,
  weight: z.number().int().min(1).max(10).optional().default(1),
  archetypeAffinity: z.array(ArchetypeIdSchema).optional(),
  requiredFlags: z.array(z.string()).optional().describe('Banderas requeridas para que esta carta aparezca'),
  isInExtremis: z.boolean().optional().describe('Carta de salvación desesperada cuando el personaje está acorralado'),
  targetDangerStat: z.enum(['pastaEnB', 'presionJudicial', 'impunidad', 'reputacionMediatica']).optional().describe('Estadística crítica que rescata in extremis'),
});
export type ReignsCard = z.infer<typeof ReignsCardSchema>;

export const GameOverReasonSchema = z.enum([
  'PASTA_MINIMA', // Bancarrota
  'PASTA_MAXIMA', // Alerta Europol / Suiza
  'PRESION_MAXIMA', // Soto del Real
  'PRESION_MINIMA', // Sospecha de topo
  'IMPUNIDAD_MINIMA', // Pérdida de aforamiento
  'IMPUNIDAD_MAXIMA', // Traición interna
  'REPUTACION_MINIMA', // Linchamiento de prensa
  'REPUTACION_MAXIMA', // Eclipsar al líder
  'VICTORIA_LEGISLATURA', // Retiro dorado
]);
export type GameOverReason = z.infer<typeof GameOverReasonSchema>;

// === Contratos para Semáforo de Riesgo D6 y Etapas de Legislatura ===

export const RiskLevelSchema = z.enum(['SAFE', 'VOLATILE', 'LETHAL']);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

export interface RiskAssessment {
  level: RiskLevel;
  dangerStats: Array<{
    statKey: keyof CharacterStats;
    statLabel: string;
    bound: 'MIN' | 'MAX';
    lethal: boolean;
  }>;
  explanation: string;
}

export type LegislativeYear = 1 | 2 | 3 | 4;

export interface LegislativeStageInfo {
  year: LegislativeYear;
  title: string;
  subtitle: string;
  quarterLabel: string;
  isClimax: boolean;
}

export const CLIMAX_CARD_ID = 'climax_tribunal_supremo_pacto_toja';

// === Contratos para la Mecánica de "Rata Acorralada" (In Extremis) ===

export interface InExtremisCriticalStat {
  key: keyof CharacterStats;
  label: string;
  value: number;
  dangerType: 'MIN_DANGER' | 'MAX_DANGER';
}

export interface InExtremisStatus {
  active: boolean;
  criticalStats: InExtremisCriticalStat[];
}
