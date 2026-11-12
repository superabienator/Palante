'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export interface CharacterPortraitProps {
  src?: string;
  alt: string;
  speaker?: string;
  speakerRole?: string;
  archetypeId?: string;
  isCrisis?: boolean;
  crisisType?: 'judicial' | 'pasta' | 'impunidad' | 'prensa';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const ARCHETYPE_IMAGES: Record<string, string> = {
  CUSTODIO_LIBRETA: '/art/archetypes/custodio_libreta.webp',
  PROCONSUL_HORMIGON: '/art/archetypes/proconsul_hormigon.webp',
  FONTANERO_INTERIOR: '/art/archetypes/fontanero_interior.webp',
  PASANTE_GIRATORIO: '/art/archetypes/pasante_giratorio.webp',
  ARCHIVADOR_CLOACA: '/art/archetypes/archivador_cloaca.webp',
  ARQUITECTO_SOBRESEIMIENTO: '/art/archetypes/arquitecto_sobreseimiento.webp',
  TAPON_INSTITUCIONAL: '/art/archetypes/tapon_institucional.webp',
  DIFUNTO_CONVENIENCIA: '/art/archetypes/difunto_conveniencia.webp',
  BARON_ENCOFRADO: '/art/archetypes/baron_encofrado.webp',
  ALQUIMISTA_HORMIGONERA: '/art/archetypes/alquimista_hormigonera.webp',
  TAUMATURGO_AGUJERO: '/art/archetypes/taumaturgo_agujero.webp',
  LAVANDERO_TRANSNACIONAL: '/art/archetypes/lavandero_transnacional.webp',
};

const CHARACTER_KEYWORDS: Array<[string, string]> = [
  // Constructores, IBEX y urbanismo
  ['florentino', '/art/characters/florentino_palco.webp'],
  ['barón', '/art/characters/florentino_palco.webp'],
  ['oligarca', '/art/characters/florentino_palco.webp'],
  ['autopista', '/art/archetypes/baron_encofrado.webp'],
  ['concesionario', '/art/archetypes/baron_encofrado.webp'],
  ['romualdo', '/art/archetypes/alquimista_hormigonera.webp'],
  ['constructor', '/art/archetypes/alquimista_hormigonera.webp'],
  ['litoral', '/art/characters/conseguidor_paella.webp'],
  ['marbella', '/art/characters/conseguidor_paella.webp'],
  ['procónsul', '/art/archetypes/proconsul_hormigon.webp'],
  ['plana', '/art/archetypes/proconsul_hormigon.webp'],
  ['gafas oscuras', '/art/archetypes/proconsul_hormigon.webp'],

  // Cloacas, Interior y Policía
  ['pepe', '/art/characters/comisario_villarejo.webp'],
  ['villarejo', '/art/characters/comisario_villarejo.webp'],
  ['comisario', '/art/characters/comisario_villarejo.webp'],
  ['kompromat', '/art/characters/comisario_villarejo.webp'],
  ['fontanero', '/art/archetypes/fontanero_interior.webp'],
  ['seguridad', '/art/archetypes/fontanero_interior.webp'],
  ['bomberos', '/art/archetypes/fontanero_interior.webp'],
  ['sicario', '/art/archetypes/archivador_cloaca.webp'],
  ['alzacuellos', '/art/archetypes/archivador_cloaca.webp'],
  ['falso sacerdote', '/art/archetypes/archivador_cloaca.webp'],
  ['portero', '/art/crisis/crisis_uco_registro.webp'],
  ['vigilante', '/art/crisis/crisis_uco_registro.webp'],

  // Togas, Fiscalía y Peritos
  ['cándido', '/art/characters/magistrado_candido.webp'],
  ['candido', '/art/characters/magistrado_candido.webp'],
  ['magistrado', '/art/characters/magistrado_candido.webp'],
  ['juez', '/art/characters/magistrado_candido.webp'],
  ['abogado', '/art/archetypes/arquitecto_sobreseimiento.webp'],
  ['penitenciario', '/art/archetypes/arquitecto_sobreseimiento.webp'],
  ['perito', '/art/archetypes/arquitecto_sobreseimiento.webp'],
  ['forense', '/art/archetypes/arquitecto_sobreseimiento.webp'],
  ['tapón', '/art/archetypes/tapon_institucional.webp'],
  ['fiscal', '/art/archetypes/tapon_institucional.webp'],
  ['arqueóloga', '/art/characters/dama_finiquito.webp'],
  ['patrimonio', '/art/characters/dama_finiquito.webp'],

  // Prensa y Comunicación
  ['director', '/art/characters/director_diario.webp'],
  ['diario', '/art/characters/director_diario.webp'],
  ['portadas', '/art/characters/director_diario.webp'],
  ['prensa', '/art/crisis/crisis_prensa_escandalo.webp'],
  ['comunicación', '/art/crisis/crisis_prensa_escandalo.webp'],

  // Tesorería, Partido y Cajas B
  ['tesorero', '/art/archetypes/custodio_libreta.webp'],
  ['caja fuerte', '/art/archetypes/custodio_libreta.webp'],
  ['contable', '/art/archetypes/custodio_libreta.webp'],
  ['pagador', '/art/archetypes/custodio_libreta.webp'],
  ['chófer', '/art/characters/chofer_pendrive.webp'],
  ['chofer', '/art/characters/chofer_pendrive.webp'],
  ['finiquito', '/art/characters/dama_finiquito.webp'],
  ['secretaria', '/art/characters/dama_finiquito.webp'],
  ['informático', '/art/characters/informatico_martillo.webp'],
  ['informatico', '/art/characters/informatico_martillo.webp'],
  ['martillador', '/art/characters/informatico_martillo.webp'],
  ['martillo', '/art/characters/informatico_martillo.webp'],
  ['portavoz', '/art/archetypes/pasante_giratorio.webp'],
  ['parlamentario', '/art/archetypes/pasante_giratorio.webp'],

  // Banca, Cajas y Blanqueo
  ['blesa', '/art/characters/banquero_blesa.webp'],
  ['bankia', '/art/characters/banquero_blesa.webp'],
  ['banquero', '/art/characters/banquero_blesa.webp'],
  ['safari', '/art/characters/banquero_blesa.webp'],
  ['caja', '/art/characters/banquero_blesa.webp'],
  ['sareb', '/art/archetypes/taumaturgo_agujero.webp'],
  ['reestructuración', '/art/archetypes/taumaturgo_agujero.webp'],
  ['selectivo', '/art/archetypes/taumaturgo_agujero.webp'],
  ['paesa', '/art/archetypes/difunto_conveniencia.webp'],
  ['ilusionista', '/art/archetypes/difunto_conveniencia.webp'],
  ['fiduciario', '/art/archetypes/lavandero_transnacional.webp'],
  ['singapur', '/art/archetypes/lavandero_transnacional.webp'],
  ['ventanilla', '/art/archetypes/lavandero_transnacional.webp'],

  // Tramas Autonómicas (3%, Gürtel, ERE, Nóos)
  ['3%', '/art/characters/padrino_trespercent.webp'],
  ['pujol', '/art/characters/padrino_trespercent.webp'],
  ['misales', '/art/characters/padrino_trespercent.webp'],
  ['madre superiora', '/art/characters/padrino_trespercent.webp'],
  ['conseguidor', '/art/characters/conseguidor_paella.webp'],
  ['bigotes', '/art/characters/conseguidor_paella.webp'],
  ['eventos', '/art/characters/conseguidor_paella.webp'],
  ['sastre', '/art/archetypes/pasante_giratorio.webp'],
  ['modisto', '/art/archetypes/pasante_giratorio.webp'],
  ['duque', '/art/archetypes/pasante_giratorio.webp'],
  ['trabajo', '/art/characters/conseguidor_paella.webp'],
  ['31l', '/art/characters/conseguidor_paella.webp'],

  // Virales
  ['plantón', '/art/virales/viral_planton_evole.webp'],
  ['evole', '/art/virales/viral_planton_evole.webp'],
  ['mascarilla', '/art/virales/viral_mascarillas_koldo.webp'],
  ['koldo', '/art/virales/viral_mascarillas_koldo.webp'],
  ['comisión', '/art/virales/viral_comision_congreso.webp'],
  ['congreso', '/art/virales/viral_comision_congreso.webp'],
];

const NANOBANANA_POOL: string[] = [
  '/art/archetypes/custodio_libreta.webp',
  '/art/archetypes/proconsul_hormigon.webp',
  '/art/archetypes/fontanero_interior.webp',
  '/art/archetypes/pasante_giratorio.webp',
  '/art/archetypes/archivador_cloaca.webp',
  '/art/archetypes/arquitecto_sobreseimiento.webp',
  '/art/archetypes/tapon_institucional.webp',
  '/art/archetypes/difunto_conveniencia.webp',
  '/art/archetypes/baron_encofrado.webp',
  '/art/archetypes/alquimista_hormigonera.webp',
  '/art/archetypes/taumaturgo_agujero.webp',
  '/art/archetypes/lavandero_transnacional.webp',
  '/art/characters/comisario_villarejo.webp',
  '/art/characters/florentino_palco.webp',
  '/art/characters/magistrado_candido.webp',
  '/art/characters/banquero_blesa.webp',
  '/art/characters/dama_finiquito.webp',
  '/art/characters/director_diario.webp',
  '/art/characters/chofer_pendrive.webp',
  '/art/characters/padrino_trespercent.webp',
  '/art/characters/conseguidor_paella.webp',
  '/art/characters/informatico_martillo.webp',
];

function pickDeterministicNanoBananaPortrait(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return NANOBANANA_POOL[hash % NANOBANANA_POOL.length];
}

export function CharacterPortrait({
  src,
  alt,
  speaker = '',
  speakerRole = '',
  archetypeId,
  isCrisis = false,
  crisisType,
  size = 'md',
  className = '',
}: CharacterPortraitProps) {
  const [fallbackIdx, setFallbackIdx] = useState<number | null>(null);

  // 1. Determinar la ruta de la ilustración Nano Banana
  let resolvedSrc = src;

  if (!resolvedSrc) {
    if (archetypeId && ARCHETYPE_IMAGES[archetypeId]) {
      resolvedSrc = ARCHETYPE_IMAGES[archetypeId];
    } else if (isCrisis) {
      if (crisisType === 'judicial') resolvedSrc = '/art/crisis/crisis_uco_registro.webp';
      else if (crisisType === 'pasta') resolvedSrc = '/art/crisis/crisis_bancarrota.webp';
      else if (crisisType === 'impunidad') resolvedSrc = '/art/crisis/crisis_suplicatorio.webp';
      else resolvedSrc = '/art/crisis/crisis_prensa_escandalo.webp';
    } else {
      const searchTarget = `${speaker} ${speakerRole} ${alt}`.toLowerCase();
      for (const [kw, path] of CHARACTER_KEYWORDS) {
        if (searchTarget.includes(kw)) {
          resolvedSrc = path;
          break;
        }
      }
      if (!resolvedSrc) {
        resolvedSrc = pickDeterministicNanoBananaPortrait(searchTarget || 'default');
      }
    }
  }

  const finalSrc =
    fallbackIdx !== null
      ? NANOBANANA_POOL[fallbackIdx % NANOBANANA_POOL.length]
      : resolvedSrc;

  // Dimensiones según el tamaño
  const sizeMap = {
    sm: 'w-12 h-12 min-w-[48px] min-h-[48px]',
    md: 'w-16 h-16 sm:w-20 sm:h-20 min-w-[64px] min-h-[64px]',
    lg: 'w-20 h-20 sm:w-24 sm:h-24 min-w-[80px] min-h-[80px]',
    xl: 'w-24 h-24 sm:w-32 sm:h-32 min-w-[96px] min-h-[96px]',
  };

  const pxMap = {
    sm: 48,
    md: 80,
    lg: 96,
    xl: 128,
  };

  return (
    <div
      className={`relative overflow-hidden border-3 border-black bg-stone-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${sizeMap[size]} ${className}`}
    >
      <Image
        src={finalSrc}
        alt={alt}
        width={pxMap[size]}
        height={pxMap[size]}
        className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all"
        onError={() => {
          if (fallbackIdx === null) {
            setFallbackIdx(0);
          }
        }}
        unoptimized
      />
    </div>
  );
}

export default CharacterPortrait;
