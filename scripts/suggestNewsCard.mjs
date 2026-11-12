#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PENDING_FILE = path.join(__dirname, '..', 'src', 'content', 'pendingNewsCards.json');

const args = process.argv.slice(2);
const headlineArg = args.join(' ').trim();

if (!headlineArg) {
  console.log(`
Uso: node scripts/suggestNewsCard.mjs "<Titular de noticia o suceso político>"

Ejemplo:
  node scripts/suggestNewsCard.mjs "Abascal rechaza ir al programa de Jordi Évole y cae en las encuestas"
`);
  process.exit(1);
}

console.log(`\n[REIGNS ENGINE] Procesando noticia: "${headlineArg}"...`);

// Generador de plantilla satírica berlanguiana
const slug = headlineArg
  .toUpperCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^A-Z0-9]+/g, '_')
  .slice(0, 30);

const uniqueId = `VIRAL_${slug}_${Date.now().toString().slice(-4)}`;

const newCardProposal = {
  id: uniqueId,
  speaker: "El Asesor de Imagen del Gabinete",
  speakerRole: "Especialista en Control de Daños Mediáticos",
  sphere: "POLITICA",
  headline: `ESCÁNDALO DE ACTUALIDAD: ${headlineArg.toUpperCase()}`,
  context: `La prensa matinal abre con el titular: «${headlineArg}». Los teléfonos de la sede echan humo, los barones territoriales exigen una posición unificada y las tertulias nocturnas ya tienen carnaza para tres días.`,
  evidenceDocument: `Informe urgente de monitorización de redes con 45.000 menciones negativas y llamadas cruzadas entre jefes de prensa.`,
  leftChoice: {
    id: `c_${uniqueId.toLowerCase()}_left`,
    label: "Atrincherarse, negar las informaciones y atacar a los medios de comunicación",
    stampText: "BÚNKER",
    flavorQuote: "Que digan lo que quieran. A nosotros nos votan los convencidos, no los tertulianos de la televisión.",
    modifiers: {
      pastaEnB: 0,
      presionJudicial: 5,
      impunidad: 15,
      reputacionMediatica: -20
    },
    grantedFlags: [`FLAG_${slug}_BUNKER`]
  },
  rightChoice: {
    id: `c_${uniqueId.toLowerCase()}_right`,
    label: "Dar la cara en rueda de prensa sin preguntas y prometer una comisión interna",
    stampText: "DESVÍO",
    flavorQuote: "Salimos dos minutos, ponemos cara de estadistas compungidos y derivamos todo a una comisión de ética que tardará dos años en fallar.",
    modifiers: {
      pastaEnB: -5,
      presionJudicial: -10,
      impunidad: -10,
      reputacionMediatica: 15
    },
    grantedFlags: [`FLAG_${slug}_COMISION`]
  },
  requiredFlags: []
};

// Cargar existentes
let pendingCards = [];
try {
  if (fs.existsSync(PENDING_FILE)) {
    const raw = fs.readFileSync(PENDING_FILE, 'utf-8');
    pendingCards = JSON.parse(raw);
  }
} catch {
  pendingCards = [];
}

pendingCards.push(newCardProposal);
fs.writeFileSync(PENDING_FILE, JSON.stringify(pendingCards, null, 2), 'utf-8');

console.log(`\n✓ Propuesta de tarjeta generada con éxito con ID: ${uniqueId}`);
console.log(`✓ Guardada en: src/content/pendingNewsCards.json`);
console.log(`✓ Ya disponible en el panel /admin para su revisión, edición o aprobación al mazo.\n`);
