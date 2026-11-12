'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CharacterAvatar } from './avatars/CharacterAvatar';

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
  ['florentino', '/art/characters/florentino_palco.webp'],
  ['barón', '/art/characters/florentino_palco.webp'],
  ['oligarca', '/art/characters/florentino_palco.webp'],
  ['pepe', '/art/characters/comisario_villarejo.webp'],
  ['villarejo', '/art/characters/comisario_villarejo.webp'],
  ['comisario', '/art/characters/comisario_villarejo.webp'],
  ['cándido', '/art/characters/magistrado_candido.webp'],
  ['candido', '/art/characters/magistrado_candido.webp'],
  ['magistrado', '/art/characters/magistrado_candido.webp'],
  ['juez', '/art/characters/magistrado_candido.webp'],
  ['director', '/art/characters/director_diario.webp'],
  ['diario', '/art/characters/director_diario.webp'],
  ['prensa', '/art/characters/director_diario.webp'],
  ['chófer', '/art/characters/chofer_pendrive.webp'],
  ['chofer', '/art/characters/chofer_pendrive.webp'],
  ['finiquito', '/art/characters/dama_finiquito.webp'],
  ['secretaria', '/art/characters/dama_finiquito.webp'],
  ['blesa', '/art/characters/banquero_blesa.webp'],
  ['bankia', '/art/characters/banquero_blesa.webp'],
  ['banquero', '/art/characters/banquero_blesa.webp'],
  ['safari', '/art/characters/banquero_blesa.webp'],
  ['3%', '/art/characters/padrino_trespercent.webp'],
  ['pujol', '/art/characters/padrino_trespercent.webp'],
  ['misales', '/art/characters/padrino_trespercent.webp'],
  ['conseguidor', '/art/characters/conseguidor_paella.webp'],
  ['marjaliza', '/art/characters/conseguidor_paella.webp'],
  ['correa', '/art/characters/conseguidor_paella.webp'],
  ['informático', '/art/characters/informatico_martillo.webp'],
  ['informatico', '/art/characters/informatico_martillo.webp'],
  ['martillo', '/art/characters/informatico_martillo.webp'],
  ['plantón', '/art/virales/viral_planton_evole.webp'],
  ['evole', '/art/virales/viral_planton_evole.webp'],
  ['mascarilla', '/art/virales/viral_mascarillas_koldo.webp'],
  ['koldo', '/art/virales/viral_mascarillas_koldo.webp'],
  ['comisión', '/art/virales/viral_comision_congreso.webp'],
  ['congreso', '/art/virales/viral_comision_congreso.webp'],
];

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
  const [imgError, setImgError] = useState(false);

  // 1. Determinar la ruta de la imagen
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
      const searchTarget = (speaker + ' ' + speakerRole).toLowerCase();
      for (const [kw, path] of CHARACTER_KEYWORDS) {
        if (searchTarget.includes(kw)) {
          resolvedSrc = path;
          break;
        }
      }
    }
  }

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

  // Si no hay imagen resuelta o falló la carga del archivo, renderizamos el avatar SVG satírico como fallback impecable
  if (!resolvedSrc || imgError) {
    return (
      <CharacterAvatar
        speaker={speaker || alt}
        speakerRole={speakerRole}
        isCrisis={isCrisis}
        crisisType={crisisType}
        className={`${sizeMap[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`relative overflow-hidden border-3 border-black bg-stone-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${sizeMap[size]} ${className}`}
    >
      <Image
        src={resolvedSrc}
        alt={alt}
        width={pxMap[size]}
        height={pxMap[size]}
        className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all"
        onError={() => setImgError(true)}
        unoptimized
      />
    </div>
  );
}

export default CharacterPortrait;
