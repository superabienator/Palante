'use client';

import React from 'react';

export interface CharacterAvatarProps {
  speaker: string;
  speakerRole?: string;
  isCrisis?: boolean;
  crisisType?: 'judicial' | 'pasta' | 'impunidad' | 'prensa';
  className?: string;
}

export function CharacterAvatar({
  speaker,
  speakerRole = '',
  isCrisis = false,
  crisisType,
  className = '',
}: CharacterAvatarProps) {
  // 1. Estados de Crisis In Extremis
  if (isCrisis) {
    if (crisisType === 'judicial' || speaker.toLowerCase().includes('uco') || speaker.toLowerCase().includes('guardia civil')) {
      return (
        <div className={`relative flex items-center justify-center bg-red-950 border-2 border-red-600 p-2 shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] ${className}`}>
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor">
            {/* Sirena policial giratoria de la UCO */}
            <rect x="25" y="60" width="50" height="25" fill="#18181b" stroke="#ef4444" strokeWidth="4" />
            <path d="M30 60 C30 35, 70 35, 70 60 Z" fill="#ef4444" stroke="#ffffff" strokeWidth="3" />
            <line x1="50" y1="20" x2="50" y2="35" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
            <line x1="25" y1="25" x2="35" y2="38" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
            <line x1="75" y1="25" x2="65" y2="38" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="50" r="8" fill="#ffffff" />
            <text x="50" y="80" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900" fontFamily="monospace">U.C.O.</text>
          </svg>
        </div>
      );
    }

    if (crisisType === 'pasta' || speaker.toLowerCase().includes('bancarrota')) {
      return (
        <div className={`relative flex items-center justify-center bg-stone-900 border-2 border-amber-600 p-2 shadow-[2px_2px_0px_0px_rgba(217,119,6,1)] ${className}`}>
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor">
            {/* Caja fuerte vacía con telaraña y polilla */}
            <rect x="20" y="20" width="60" height="60" rx="4" fill="#27272a" stroke="#d97706" strokeWidth="4" />
            <circle cx="50" cy="50" r="16" stroke="#f59e0b" strokeWidth="3" fill="#18181b" />
            <line x1="50" y1="38" x2="50" y2="62" stroke="#f59e0b" strokeWidth="3" />
            <line x1="38" y1="50" x2="62" y2="50" stroke="#f59e0b" strokeWidth="3" />
            {/* Polilla volando */}
            <path d="M65 30 Q75 25 72 35 Q68 35 65 30 Z" fill="#ffffff" />
            <path d="M65 30 Q55 25 58 35 Q62 35 65 30 Z" fill="#ffffff" />
            <text x="50" y="94" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="900" fontFamily="monospace">0,00 €</text>
          </svg>
        </div>
      );
    }
  }

  // 2. Comprobación por Interlocutores Recurrentes (Dramatis Personae)
  const norm = (speaker + ' ' + speakerRole).toLowerCase();

  // A. Comisario Pepe Villarejo
  if (norm.includes('comisario') || norm.includes('villarejo') || norm.includes('pepe')) {
    return (
      <div className={`relative flex items-center justify-center bg-stone-900 border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${className}`}>
        <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor">
          {/* Boina calada */}
          <ellipse cx="50" cy="32" rx="36" ry="14" fill="#000000" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="50" cy="20" r="3.5" fill="#ffffff" />
          {/* Cara cuadrada */}
          <rect x="28" y="36" width="44" height="42" rx="6" fill="#f4f1ea" stroke="#000000" strokeWidth="3.5" />
          {/* Ojos con gafas oscuras de policía */}
          <rect x="34" y="44" width="14" height="9" fill="#000000" />
          <rect x="52" y="44" width="14" height="9" fill="#000000" />
          <line x1="48" y1="48" x2="52" y2="48" stroke="#000000" strokeWidth="3" />
          {/* Bigote castizo prominente */}
          <path d="M36 62 Q50 56 64 62 Q50 68 36 62 Z" fill="#000000" />
          {/* Grabadora con casete pegada en el pecho */}
          <rect x="36" y="80" width="28" height="18" fill="#27272a" stroke="#000000" strokeWidth="2" />
          <circle cx="44" cy="88" r="3" fill="#ef4444" />
          <circle cx="56" cy="88" r="3" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  // B. D. Florentino / El Oligarca del Palco
  if (norm.includes('florentino') || norm.includes('barón') || norm.includes('encofrado') || norm.includes('oligarca')) {
    return (
      <div className={`relative flex items-center justify-center bg-stone-100 border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${className}`}>
        <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor">
          {/* Pelo engominado hacia atrás */}
          <path d="M26 38 C26 20, 74 20, 74 38 Z" fill="#18181b" stroke="#000000" strokeWidth="3" />
          {/* Rostro orondo */}
          <circle cx="50" cy="50" r="26" fill="#fcfbf7" stroke="#000000" strokeWidth="3.5" />
          {/* Gafas metálicas redondas de magnate */}
          <circle cx="41" cy="46" r="8" fill="none" stroke="#000000" strokeWidth="3" />
          <circle cx="59" cy="46" r="8" fill="none" stroke="#000000" strokeWidth="3" />
          <line x1="49" y1="46" x2="51" y2="46" stroke="#000000" strokeWidth="3" />
          {/* Puro habano humeante en la comisura */}
          <rect x="58" y="58" width="24" height="6" fill="#78350f" stroke="#000000" strokeWidth="2" transform="rotate(-15 58 58)" />
          <circle cx="82" cy="52" r="3" fill="#ef4444" />
          {/* Humo del puro */}
          <path d="M84 48 Q88 40 82 35 Q86 30 84 22" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" />
          {/* Corbata de seda con alfiler de oro */}
          <polygon points="46,74 54,74 52,98 48,98" fill="#1e3a8a" stroke="#000000" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  // C. Magistrado Don Cándido / La Toga Amiga
  if (norm.includes('cándido') || norm.includes('magistrado') || norm.includes('juez') || norm.includes('arquitecto del sobreseimiento') || norm.includes('toga')) {
    return (
      <div className={`relative flex items-center justify-center bg-amber-50 border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${className}`}>
        <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor">
          {/* Toga negra con puñetas blancas */}
          <path d="M20 74 L80 74 L86 100 L14 100 Z" fill="#09090b" stroke="#000000" strokeWidth="3" />
          {/* Puñetas de encaje */}
          <path d="M42 74 Q50 82 58 74 L50 88 Z" fill="#ffffff" stroke="#000000" strokeWidth="2" />
          {/* Rostro austero con papada */}
          <rect x="30" y="32" width="40" height="42" rx="8" fill="#fcfbf7" stroke="#000000" strokeWidth="3" />
          {/* Gafas de pasta de magistrado sobre la nariz */}
          <rect x="35" y="42" width="12" height="7" fill="none" stroke="#000000" strokeWidth="3" />
          <rect x="53" y="42" width="12" height="7" fill="none" stroke="#000000" strokeWidth="3" />
          <line x1="47" y1="45" x2="53" y2="45" stroke="#000000" strokeWidth="2.5" />
          {/* Expresión severa / boca en arco */}
          <path d="M42 63 Q50 58 58 63" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
          {/* Mazo de madera judicial */}
          <rect x="74" y="24" width="18" height="10" rx="2" fill="#78350f" stroke="#000000" strokeWidth="2" transform="rotate(30 74 24)" />
          <line x1="80" y1="32" x2="90" y2="52" stroke="#78350f" strokeWidth="3" />
        </svg>
      </div>
    );
  }

  // D. Director del Diario / El Negociador de Portadas
  if (norm.includes('director') || norm.includes('diario') || norm.includes('prensa') || norm.includes('portada')) {
    return (
      <div className={`relative flex items-center justify-center bg-white border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${className}`}>
        <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor">
          {/* Periódico en primer plano doblado */}
          <rect x="14" y="48" width="72" height="48" fill="#f4f4f5" stroke="#000000" strokeWidth="3" />
          <line x1="20" y1="56" x2="50" y2="56" stroke="#ef4444" strokeWidth="3" />
          <line x1="20" y1="64" x2="80" y2="64" stroke="#000000" strokeWidth="2" />
          <line x1="20" y1="72" x2="80" y2="72" stroke="#000000" strokeWidth="1.5" />
          <line x1="20" y1="80" x2="70" y2="80" stroke="#000000" strokeWidth="1.5" />
          {/* Rostro asomando tras el periódico */}
          <circle cx="50" cy="34" r="22" fill="#fafafa" stroke="#000000" strokeWidth="3" />
          {/* Gafas redondas curiosas */}
          <circle cx="43" cy="34" r="6" fill="#000000" />
          <circle cx="57" cy="34" r="6" fill="#000000" />
          <circle cx="44" cy="32" r="2" fill="#ffffff" />
          <circle cx="58" cy="32" r="2" fill="#ffffff" />
          {/* Pluma estilográfica detrás de la oreja */}
          <line x1="68" y1="16" x2="76" y2="34" stroke="#d97706" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // E. El Chófer con Pendrive / El Topo de Interior
  if (norm.includes('chófer') || norm.includes('chofer') || norm.includes('topo') || norm.includes('conductor')) {
    return (
      <div className={`relative flex items-center justify-center bg-stone-200 border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${className}`}>
        <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor">
          {/* Gorra de chófer de servicio */}
          <path d="M22 36 Q50 20 78 36 L86 42 L14 42 Z" fill="#18181b" stroke="#000000" strokeWidth="3" />
          <ellipse cx="50" cy="42" rx="36" ry="6" fill="#27272a" stroke="#000000" strokeWidth="2.5" />
          <circle cx="50" cy="32" r="4" fill="#facc15" stroke="#000000" strokeWidth="1" />
          {/* Rostro con mandíbula tensa */}
          <rect x="28" y="44" width="44" height="38" rx="4" fill="#f5f5f4" stroke="#000000" strokeWidth="3" />
          {/* Gafas de aviador oscuras */}
          <polygon points="34,50 48,50 46,62 36,62" fill="#000000" />
          <polygon points="52,50 66,50 64,62 54,62" fill="#000000" />
          <line x1="48" y1="52" x2="52" y2="52" stroke="#000000" strokeWidth="2" />
          {/* Pendrive USB colgando al cuello en cadena */}
          <line x1="46" y1="78" x2="50" y2="88" stroke="#71717a" strokeWidth="2" />
          <line x1="54" y1="78" x2="50" y2="88" stroke="#71717a" strokeWidth="2" />
          <rect x="44" y="86" width="12" height="12" rx="2" fill="#eab308" stroke="#000000" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  // F. La Dama del Finiquito / Secretaria General
  if (norm.includes('finiquito') || norm.includes('dama') || norm.includes('secretaria') || norm.includes('cospedal') || norm.includes('portavoz')) {
    return (
      <div className={`relative flex items-center justify-center bg-rose-50 border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${className}`}>
        <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor">
          {/* Cardado de pelo rubio platino arquitectónico */}
          <path d="M18 42 C14 10, 86 10, 82 42 Q86 65 74 65 L26 65 Q14 65 18 42 Z" fill="#fde047" stroke="#000000" strokeWidth="3" />
          {/* Rostro angular e inexpresivo */}
          <polygon points="34,36 66,36 60,76 40,76" fill="#fdf4ff" stroke="#000000" strokeWidth="3" />
          {/* Ojos con sombra azulada */}
          <line x1="38" y1="46" x2="48" y2="46" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
          <line x1="52" y1="46" x2="62" y2="46" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
          <circle cx="43" cy="48" r="2.5" fill="#000000" />
          <circle cx="57" cy="48" r="2.5" fill="#000000" />
          {/* Labios apretados con carmín rojo */}
          <line x1="44" y1="64" x2="56" y2="64" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
          {/* Collar de perlas dobles */}
          <ellipse cx="50" cy="80" rx="14" ry="4" stroke="#a1a1aa" strokeWidth="2" strokeDasharray="3 3" fill="none" />
        </svg>
      </div>
    );
  }

  // G. El Banquero de la Caza / Miguel Blesa / Tarjetas Black
  if (norm.includes('blesa') || norm.includes('bankia') || norm.includes('taumaturgo') || norm.includes('caja') || norm.includes('safari')) {
    return (
      <div className={`relative flex items-center justify-center bg-emerald-50 border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${className}`}>
        <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor">
          {/* Tirantes de banquero de inversión */}
          <rect x="18" y="75" width="64" height="25" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
          <rect x="26" y="75" width="8" height="25" fill="#dc2626" />
          <rect x="66" y="75" width="8" height="25" fill="#dc2626" />
          {/* Cabeza de banquero con entradas */}
          <path d="M30 30 Q50 14 70 30 L74 68 L26 68 Z" fill="#fafaf9" stroke="#000000" strokeWidth="3" />
          {/* Gafas de concha sofisticadas */}
          <rect x="34" y="38" width="13" height="9" rx="2" fill="none" stroke="#78350f" strokeWidth="3" />
          <rect x="53" y="38" width="13" height="9" rx="2" fill="none" stroke="#78350f" strokeWidth="3" />
          <line x1="47" y1="42" x2="53" y2="42" stroke="#78350f" strokeWidth="2.5" />
          {/* Tarjeta Black en la mano */}
          <rect x="68" y="55" width="26" height="16" rx="2" fill="#000000" stroke="#facc15" strokeWidth="1.5" transform="rotate(-15 68 55)" />
          <text x="80" y="66" fill="#facc15" fontSize="5" fontWeight="bold" fontFamily="monospace" transform="rotate(-15 80 66)">BLACK</text>
        </svg>
      </div>
    );
  }

  // H. El Conseguidor Litoral / Correa / Marjaliza / El Paellero
  if (norm.includes('conseguidor') || norm.includes('alquimista') || norm.includes('gasolinera') || norm.includes('marjaliza') || norm.includes('correa') || norm.includes('bigotes')) {
    return (
      <div className={`relative flex items-center justify-center bg-amber-100 border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${className}`}>
        <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor">
          {/* Cadena de oro gigante */}
          <circle cx="50" cy="78" r="16" stroke="#ca8a04" strokeWidth="3.5" fill="none" />
          {/* Cara bronceada de marisco */}
          <circle cx="50" cy="46" r="24" fill="#fed7aa" stroke="#000000" strokeWidth="3" />
          {/* Bigotito fino de estraperlista */}
          <line x1="40" y1="54" x2="60" y2="54" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
          {/* Gafas de sol de espejo en la frente */}
          <rect x="36" y="24" width="12" height="7" rx="2" fill="#0284c7" stroke="#000000" strokeWidth="2" />
          <rect x="52" y="24" width="12" height="7" rx="2" fill="#0284c7" stroke="#000000" strokeWidth="2" />
          {/* Langostino en la boca */}
          <path d="M62 56 Q76 52 82 62 Q72 66 62 58 Z" fill="#f97316" stroke="#000000" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  // I. El Informático del Partido (Destructor de Discos Duros)
  if (norm.includes('informático') || norm.includes('martillo') || norm.includes('disco') || norm.includes('técnico')) {
    return (
      <div className={`relative flex items-center justify-center bg-zinc-200 border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${className}`}>
        <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor">
          {/* Maza o martillo en alto */}
          <rect x="68" y="14" width="22" height="12" rx="2" fill="#475569" stroke="#000000" strokeWidth="2.5" />
          <line x1="79" y1="26" x2="70" y2="54" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          {/* Cara sudorosa y estresada */}
          <circle cx="44" cy="46" r="22" fill="#f4f4f5" stroke="#000000" strokeWidth="3" />
          {/* Ojos saltones de pánico */}
          <circle cx="36" cy="44" r="5" fill="#ffffff" stroke="#000000" strokeWidth="2" />
          <circle cx="36" cy="44" r="2" fill="#000000" />
          <circle cx="50" cy="44" r="5" fill="#ffffff" stroke="#000000" strokeWidth="2" />
          <circle cx="50" cy="44" r="2" fill="#000000" />
          {/* Gota de sudor */}
          <path d="M22 36 Q20 44 24 44 Q28 44 26 36 Z" fill="#38bdf8" />
          {/* Disco duro abollado */}
          <rect x="20" y="74" width="38" height="22" rx="3" fill="#94a3b8" stroke="#000000" strokeWidth="2" />
          <line x1="30" y1="78" x2="48" y2="90" stroke="#000000" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  // J. Retrato por Defecto: Silueta de Sumario Clasificado con Barra de Censura
  return (
    <div className={`relative flex items-center justify-center bg-stone-100 border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${className}`}>
      <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor">
        {/* Silueta de sospechoso */}
        <circle cx="50" cy="38" r="20" fill="#27272a" stroke="#000000" strokeWidth="3" />
        <path d="M20 96 C20 68, 80 68, 80 96 Z" fill="#18181b" stroke="#000000" strokeWidth="3" />
        {/* Barra negra de censura en los ojos */}
        <rect x="26" y="32" width="48" height="12" fill="#000000" />
        <text x="50" y="41" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="monospace">CONFIDENCIAL</text>
      </svg>
    </div>
  );
}

export default CharacterAvatar;
