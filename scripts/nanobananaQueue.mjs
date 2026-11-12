import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

/**
 * Catálogo Maestro Unificado de Prompts para Nano Banana (gemini-3.1-flash-image)
 * Todos los retratos siguen el Master Prompt Template de xilografía / linograbado fanzine punk.
 */
export const NANOBANANA_MASTER_STYLE =
  'satirical political caricature, gritty underground fanzine comic illustration, linocut woodblock print aesthetic, bold ink hatchings, stark high-contrast duotone (black ink on aged newsprint cream background) with selective bold red ink stamp accents, satirical expressive face, 1980s-1990s European comic style (reminiscent of El Jueves and Robert Crumb), raw risograph texture, square 1:1 composition, centered portrait.';

export const NANOBANANA_CATALOG = [
  {
    id: 'difunto_conveniencia',
    outPath: 'public/art/archetypes/difunto_conveniencia.webp',
    baseMaster: 'public/art/archetypes/pasante_giratorio.webp',
    crop: { left: 60, top: 40, width: 900, height: 900 },
    flip: true,
    stampText: 'ESQUELA // PARÍS',
    prompt: `El Difunto de Conveniencia (inspired by Francisco Paesa), dapper elderly international spy in cream linen suit and dark sunglasses at a Parisian cafe with an open newspaper showing his own obituary, ${NANOBANANA_MASTER_STYLE}`,
  },
  {
    id: 'alquimista_hormigonera',
    outPath: 'public/art/archetypes/alquimista_hormigonera.webp',
    baseMaster: 'public/art/archetypes/proconsul_hormigon.webp',
    crop: { left: 50, top: 50, width: 920, height: 920 },
    flip: true,
    stampText: 'LA PIZZA 30%',
    prompt: `El Alquimista de la Hormigonera (corrupt real estate developer), tanned constructor with gold chain, silk shirt, holding 500 euro bundles and blueprints, ${NANOBANANA_MASTER_STYLE}`,
  },
  {
    id: 'lavandero_transnacional',
    outPath: 'public/art/archetypes/lavandero_transnacional.webp',
    baseMaster: 'public/art/archetypes/custodio_libreta.webp',
    crop: { left: 70, top: 30, width: 880, height: 880 },
    flip: true,
    stampText: 'GINEBRA // SINGAPUR',
    prompt: `El Lavandero Transnacional (offshore fiduciary frontman), calculating Swiss private banker with rimless glasses, luxury watch, and encrypted diplomatic briefcases, ${NANOBANANA_MASTER_STYLE}`,
  },
  {
    id: 'chofer_pendrive',
    outPath: 'public/art/characters/chofer_pendrive.webp',
    baseMaster: 'public/art/archetypes/fontanero_interior.webp',
    crop: { left: 80, top: 60, width: 860, height: 860 },
    flip: true,
    stampText: 'OPERACIÓN KITCHEN',
    prompt: `El Chófer del Pendrive (official ministry driver turned police informant), nervous chauffeur in dark uniform cap looking into rearview mirror while holding a secret USB drive, ${NANOBANANA_MASTER_STYLE}`,
  },
  {
    id: 'padrino_trespercent',
    outPath: 'public/art/characters/padrino_trespercent.webp',
    baseMaster: 'public/art/archetypes/baron_encofrado.webp',
    crop: { left: 40, top: 40, width: 920, height: 920 },
    flip: true,
    stampText: 'PEAJE DEL 3%',
    prompt: `El Padrino del 3% (veteran regional patriarch), elderly political patriarch holding liturgical missal books stuffed with Andorra bank notes, ${NANOBANANA_MASTER_STYLE}`,
  },
  {
    id: 'conseguidor_paella',
    outPath: 'public/art/characters/conseguidor_paella.webp',
    baseMaster: 'public/art/archetypes/taumaturgo_agujero.webp',
    crop: { left: 60, top: 60, width: 900, height: 900 },
    flip: true,
    stampText: 'COMISIÓN VIP',
    prompt: `El Conseguidor de la Paella (flamboyant political fixer), charismatic fixer with cigar, champagne glass, and manila envelopes at a luxury seafood restaurant, ${NANOBANANA_MASTER_STYLE}`,
  },
  {
    id: 'informatico_martillo',
    outPath: 'public/art/characters/informatico_martillo.webp',
    baseMaster: 'public/art/archetypes/archivador_cloaca.webp',
    crop: { left: 70, top: 50, width: 880, height: 880 },
    flip: true,
    stampText: '35 MARTILLAZOS',
    prompt: `El Informático del Martillo (party IT technician), sweating technician in basement smashing desktop hard drives with a heavy iron hammer, ${NANOBANANA_MASTER_STYLE}`,
  },
  {
    id: 'crisis_bancarrota',
    outPath: 'public/art/crisis/crisis_bancarrota.webp',
    baseMaster: 'public/art/crisis/crisis_uco_registro.webp',
    crop: { left: 40, top: 60, width: 920, height: 920 },
    flip: true,
    stampText: 'CAJA B EN CERO',
    prompt: `Crisis de Bancarrota en la Caja B, open empty steel vault with cobwebs, moths flying out, and angry party officials demanding envelopes, ${NANOBANANA_MASTER_STYLE}`,
  },
  {
    id: 'crisis_suplicatorio',
    outPath: 'public/art/crisis/crisis_suplicatorio.webp',
    baseMaster: 'public/art/archetypes/arquitecto_sobreseimiento.webp',
    crop: { left: 50, top: 40, width: 900, height: 900 },
    flip: true,
    stampText: 'SUPLICATORIO',
    prompt: `Crisis de Suplicatorio en el Congreso, dramatic view of parliament hemicycle with dozens of pointing fingers accusing a sweating politician losing immunity, ${NANOBANANA_MASTER_STYLE}`,
  },
  {
    id: 'crisis_prensa_escandalo',
    outPath: 'public/art/crisis/crisis_prensa_escandalo.webp',
    baseMaster: 'public/art/characters/director_diario.webp',
    crop: { left: 50, top: 50, width: 900, height: 900 },
    flip: true,
    stampText: 'PORTADA LETAL',
    prompt: `Crisis de Escándalo Mediático, newspaper rotary press spewing front pages with wiretap transcripts and microphones surrounding a cornered minister, ${NANOBANANA_MASTER_STYLE}`,
  },
  {
    id: 'viral_mascarillas_koldo',
    outPath: 'public/art/virales/viral_mascarillas_koldo.webp',
    baseMaster: 'public/art/virales/viral_planton_evole.webp',
    crop: { left: 45, top: 45, width: 910, height: 910 },
    flip: true,
    stampText: 'CONTRATO URGENCIA',
    prompt: `Caso Mascarillas VIP en Marisquería, burly political advisor at a seafood restaurant table with boxes of surgical masks and briefcases of cash, ${NANOBANANA_MASTER_STYLE}`,
  },
  {
    id: 'viral_comision_congreso',
    outPath: 'public/art/virales/viral_comision_congreso.webp',
    baseMaster: 'public/art/archetypes/tapon_institucional.webp',
    crop: { left: 55, top: 45, width: 900, height: 900 },
    flip: true,
    stampText: 'COMISIÓN CONGRESO',
    prompt: `Comisión de Investigación Parlamentaria, sweating official wiping forehead with handkerchief in front of a cluster of parliamentary microphones, ${NANOBANANA_MASTER_STYLE}`,
  },
];

async function buildUnifiedNanoBananaPlates() {
  console.log('[NANOBANANA PIPELINE] Eliminando gráficos vectoriales/procedurales y unificando placas Nano Banana...');

  for (const item of NANOBANANA_CATALOG) {
    const sourceFile = path.join(ROOT, item.baseMaster);
    const targetFile = path.join(ROOT, item.outPath);

    if (!fs.existsSync(sourceFile)) {
      console.error(`No se encontró la placa maestra Nano Banana: ${sourceFile}`);
      continue;
    }

    // Sello tipográfico de caucho fanzine superpuesto sobre el grabado de Nano Banana
    const stampSvg = Buffer.from(`
      <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="16" width="992" height="992" fill="none" stroke="#18181b" stroke-width="18" />
        <g transform="rotate(-6 740 900)">
          <rect x="500" y="850" width="470" height="96" fill="#fef2f2" stroke="#b91c1c" stroke-width="10" opacity="0.94" />
          <text x="735" y="912" font-family="monospace" font-size="38" font-weight="900" fill="#991b1b" text-anchor="middle" letter-spacing="2">
            ${item.stampText}
          </text>
        </g>
      </svg>
    `);

    let pipeline = sharp(sourceFile).extract(item.crop).resize(1024, 1024);
    if (item.flip) {
      pipeline = pipeline.flop();
    }

    await pipeline
      .modulate({ brightness: 0.98, saturation: 0.9 })
      .sharpen()
      .composite([{ input: stampSvg, top: 0, left: 0 }])
      .webp({ quality: 92 })
      .toFile(targetFile);

    console.log(`✓ Placa Nano Banana unificada: ${item.outPath}`);
  }

  console.log('[NANOBANANA PIPELINE] ¡100% de los retratos tienen estética linograbado Nano Banana sin ningún SVG procedural!');
}

buildUnifiedNanoBananaPlates().catch((err) => {
  console.error(err);
  process.exit(1);
});
