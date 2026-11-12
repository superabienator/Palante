import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DECK_PATH = path.join(ROOT, 'src', 'content', 'reignsDeck.json');

// === Esquemas de Validación Estricta Zod ===

const SphereTypeSchema = z.enum(['POLITICA', 'ORDEN_JUSTICIA', 'EMPRESARIAL']);

const ArchetypeIdSchema = z.enum([
  'CUSTODIO_LIBRETA',
  'PROCONSUL_HORMIGON',
  'FONTANERO_INTERIOR',
  'PASANTE_GIRATORIO',
  'ARCHIVADOR_CLOACA',
  'ARQUITECTO_SOBRESEIMIENTO',
  'TAPON_INSTITUCIONAL',
  'DIFUNTO_CONVENIENCIA',
  'BARON_ENCOFRADO',
  'ALQUIMISTA_HORMIGONERA',
  'TAUMATURGO_AGUJERO',
  'LAVANDERO_TRANSNACIONAL',
]);

const StatModifiersSchema = z.object({
  pastaEnB: z.number().int().optional(),
  presionJudicial: z.number().int().optional(),
  impunidad: z.number().int().optional(),
  reputacionMediatica: z.number().int().optional(),
});

const ReignsCardChoiceSchema = z.object({
  label: z.string().min(3, 'El label de la decisión debe tener al menos 3 caracteres'),
  stampText: z.string().min(2, 'El sello de caucho debe tener al menos 2 letras'),
  flavorQuote: z.string().optional(),
  mechanicId: z.number().int().min(1).max(40).optional(),
  modifiers: StatModifiersSchema,
  grantedFlags: z.array(z.string()).optional(),
});

const ReignsCardSchema = z.object({
  id: z.string().min(3, 'El ID debe tener al menos 3 caracteres'),
  speaker: z.string().min(2, 'El nombre del emisor es obligatorio'),
  speakerRole: z.string().min(2, 'El cargo del emisor es obligatorio'),
  speakerAvatar: z.string().optional(),
  portraitUrl: z.string().optional(),
  sphere: SphereTypeSchema,
  headline: z.string().min(5, 'El titular debe tener al menos 5 caracteres'),
  context: z.string().min(15, 'La narración del contexto debe tener al menos 15 caracteres'),
  evidenceDocument: z.string().optional(),
  leftChoice: ReignsCardChoiceSchema,
  rightChoice: ReignsCardChoiceSchema,
  weight: z.number().int().min(1).max(10).optional().default(1),
  archetypeAffinity: z.array(ArchetypeIdSchema).optional(),
  requiredFlags: z.array(z.string()).optional().default([]),
});

// === Función Principal ===

async function main() {
  const args = process.argv.slice(2);
  const shouldMerge = args.includes('--merge');
  const targetFileArg = args.find((a) => !a.startsWith('--'));

  if (!targetFileArg) {
    console.log(`
========================================================================
🔍 VALIDADOR DE SALIDAS DE GOOGLE AI STUDIO (IBEX-35 & PÚNICA: ¡PALANTE!)
========================================================================

Uso:
  node "Plan AI Studio/validate_ai_studio_output.mjs" <ruta_del_archivo.json> [--merge]

Opciones:
  --merge   Si la validación es 100% exitosa, añade automáticamente las cartas
            a 'src/content/reignsDeck.json'.

Ejemplo:
  node "Plan AI Studio/validate_ai_studio_output.mjs" mis_nuevas_cartas.json --merge
========================================================================
`);
    process.exit(1);
  }

  const filePath = path.isAbsolute(targetFileArg)
    ? targetFileArg
    : path.resolve(process.cwd(), targetFileArg);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: El archivo no existe: ${filePath}`);
    process.exit(1);
  }

  console.log(`\n📂 Leyendo archivo: ${filePath}`);
  let rawContent;
  try {
    rawContent = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error(`❌ Error al leer el archivo:`, err.message);
    process.exit(1);
  }

  // Limpieza defensiva en caso de que AI Studio devuelva bloques de markdown ```json
  let cleanedContent = rawContent.trim();
  if (cleanedContent.startsWith('```json')) {
    cleanedContent = cleanedContent.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleanedContent.startsWith('```')) {
    cleanedContent = cleanedContent.replace(/^```/, '').replace(/```$/, '').trim();
  }

  // Soporte para múltiples bloques JSON pegados consecutivamente (}{)
  if (!cleanedContent.startsWith('[') && /\}\s*\{/.test(cleanedContent)) {
    console.log(`🧩 Detectados múltiples bloques JSON concatenados. Auto-envolviendo en array...`);
    cleanedContent = '[' + cleanedContent.replace(/\}\s*\{/g, '},{') + ']';
  }

  let parsedJson;
  try {
    parsedJson = JSON.parse(cleanedContent);
  } catch (err) {
    console.error(`❌ Error de sintaxis JSON. La salida de AI Studio no es un JSON válido:\n`, err.message);
    process.exit(1);
  }

  // Normalizar lista de cartas: puede venir como { cards: [...] }, como array directo [...], o como array de sagas [{ cards: [...] }, ...]
  let incomingCards = [];
  if (Array.isArray(parsedJson)) {
    for (const item of parsedJson) {
      if (item && Array.isArray(item.cards)) {
        console.log(`🏷️  Macro-Saga detectada: "${item.sagaName || 'Sin título'}"`);
        if (item.description) {
          console.log(`📝 Descripción: ${item.description}`);
        }
        incomingCards.push(...item.cards);
      } else if (item && typeof item === 'object' && item.id) {
        incomingCards.push(item);
      }
    }
  } else if (parsedJson && Array.isArray(parsedJson.cards)) {
    console.log(`🏷️  Macro-Saga detectada: "${parsedJson.sagaName || 'Sin título'}"`);
    if (parsedJson.description) {
      console.log(`📝 Descripción: ${parsedJson.description}`);
    }
    incomingCards = parsedJson.cards;
  } else if (parsedJson && typeof parsedJson === 'object' && parsedJson.id) {
    incomingCards = [parsedJson];
  } else {
    console.error(`❌ Formato no reconocido. Se esperaba un array de cartas o un objeto con la propiedad "cards".`);
    process.exit(1);
  }

  console.log(`🔎 Total de cartas a validar: ${incomingCards.length}\n`);

  // Cargar cartas existentes para verificar colisiones de IDs
  let existingDeckCards = [];
  if (fs.existsSync(DECK_PATH)) {
    try {
      const deckData = JSON.parse(fs.readFileSync(DECK_PATH, 'utf-8'));
      existingDeckCards = deckData.cards || [];
    } catch {
      existingDeckCards = [];
    }
  }

  const existingIds = new Set(existingDeckCards.map((c) => c.id));
  const seenBatchIds = new Set();

  let hasErrors = false;
  const validatedCards = [];

  incomingCards.forEach((rawCard, idx) => {
    const cardIndexDisplay = `[Carta #${idx + 1}: ${rawCard.id || 'SIN_ID'}]`;

    // 1. Validar unicidad de ID en el lote
    if (rawCard.id) {
      if (seenBatchIds.has(rawCard.id)) {
        console.error(`❌ ${cardIndexDisplay}: ID duplicado dentro del mismo lote entrante: "${rawCard.id}"`);
        hasErrors = true;
      }
      seenBatchIds.add(rawCard.id);

      if (existingIds.has(rawCard.id)) {
        console.warn(`⚠️  ${cardIndexDisplay}: El ID ya existe en 'reignsDeck.json'. Se sobrescribirá si se usa --merge.`);
      }
    }

    // 2. Validación formal con Zod
    const validationResult = ReignsCardSchema.safeParse(rawCard);
    if (!validationResult.success) {
      hasErrors = true;
      console.error(`❌ ${cardIndexDisplay}: Error de validación Zod:`);
      validationResult.error.issues.forEach((issue) => {
        console.error(`   - Campo: ${issue.path.join('.')} ➔ ${issue.message}`);
      });
    } else {
      validatedCards.push(validationResult.data);
      console.log(`✓ ${cardIndexDisplay} validada correctamente (${validationResult.data.headline})`);
    }
  });

  console.log('\n------------------------------------------------------------');
  if (hasErrors) {
    console.error(`❌ LA VALIDACIÓN FALLÓ: Corrige los errores señalados en AI Studio antes de fusionar.`);
    process.exit(1);
  }

  console.log(`✅ ¡VALIDACIÓN 100% EXITOSA! (${validatedCards.length} cartas conformes al contrato).`);

  // 3. Fusión opcional con el mazo maestro
  if (shouldMerge) {
    console.log(`\n🔄 Fusionando cartas con 'src/content/reignsDeck.json'...`);
    const masterDeckData = JSON.parse(fs.readFileSync(DECK_PATH, 'utf-8'));
    const masterCards = masterDeckData.cards || [];

    const cardMap = new Map();
    // Añadir existentes
    masterCards.forEach((c) => cardMap.set(c.id, c));
    // Sobrescribir o añadir nuevas
    let newCount = 0;
    let updatedCount = 0;
    validatedCards.forEach((c) => {
      if (cardMap.has(c.id)) {
        updatedCount++;
      } else {
        newCount++;
      }
      cardMap.set(c.id, c);
    });

    masterDeckData.cards = Array.from(cardMap.values());
    fs.writeFileSync(DECK_PATH, JSON.stringify(masterDeckData, null, 2), 'utf-8');

    console.log(`🎉 ¡Fusión completada!`);
    console.log(`   - Nuevas cartas agregadas: +${newCount}`);
    console.log(`   - Cartas actualizadas: ${updatedCount}`);
    console.log(`   - Total cartas en la baraja: ${masterDeckData.cards.length}`);
  } else {
    console.log(`💡 Para añadir estas cartas al juego automáticamente, ejecuta de nuevo con la opción --merge:`);
    console.log(`   node "Plan AI Studio/validate_ai_studio_output.mjs" "${targetFileArg}" --merge`);
  }
}

main().catch((err) => {
  console.error('Error imprevisto:', err);
  process.exit(1);
});
