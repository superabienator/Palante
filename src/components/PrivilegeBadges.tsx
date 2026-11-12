'use client';

import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { PRIVILEGES_REGISTRY, PrivilegeDefinition, PrivilegeCategory } from '../config/privileges';

export interface PrivilegeBadgesProps {
  className?: string;
  unlockedMechanics?: number[];
  lastActivatedPrivilegeId?: number | null;
}

const CATEGORY_META: Record<
  PrivilegeCategory,
  { label: string; icon: string; bgClass: string; badgeBorder: string }
> = {
  FONDO_RESERVA: {
    label: 'FONDO EN B',
    icon: '💰',
    bgClass: 'bg-amber-100 hover:bg-amber-200 text-amber-950',
    badgeBorder: 'border-amber-950',
  },
  ESCUDO_JUDICIAL: {
    label: 'ESCUDO TOGA',
    icon: '⚖️',
    bgClass: 'bg-blue-100 hover:bg-blue-200 text-blue-950',
    badgeBorder: 'border-blue-950',
  },
  BLINDAJE_AFORAMIENTO: {
    label: 'AFORAMIENTO',
    icon: '🛡️',
    bgClass: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950',
    badgeBorder: 'border-emerald-950',
  },
  CONTROL_PRENSA: {
    label: 'PAZ EDITORIAL',
    icon: '📰',
    bgClass: 'bg-stone-100 hover:bg-stone-200 text-zinc-900',
    badgeBorder: 'border-black',
  },
};

export function PrivilegeBadges({
  className = '',
  unlockedMechanics: propUnlocked,
  lastActivatedPrivilegeId: propLastActivated,
}: PrivilegeBadgesProps) {
  const storeUnlocked = useGameStore((state) => state.unlockedMechanics);
  // Leemos de forma segura lastActivatedPrivilege o de lastDiceRoll
  const storeLastActivated = useGameStore(
    (state) => state.lastActivatedPrivilege ?? state.lastDiceRoll?.unlockedPrivilegeId ?? null
  );

  const [selectedPrivilege, setSelectedPrivilege] = useState<PrivilegeDefinition | null>(null);

  const unlockedIds = propUnlocked ?? storeUnlocked ?? [];
  const lastActivated = propLastActivated !== undefined ? propLastActivated : storeLastActivated;

  // Mapear mecánicas a definiciones
  const privileges = unlockedIds
    .map((id) => PRIVILEGES_REGISTRY[id])
    .filter((p): p is PrivilegeDefinition => Boolean(p));

  if (privileges.length === 0) {
    return (
      <div
        className={`border-2 border-black bg-stone-100 p-3 text-xs font-mono text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${className}`}
      >
        <span className="font-bold text-zinc-500 uppercase">
          [ SIN CHAPAS DE PRIVILEGIO DESBLOQUEADAS ]
        </span>
      </div>
    );
  }

  return (
    <section
      aria-label="Chapas de Privilegios Desbloqueados"
      className={`border-3 border-[#121a12] bg-[#fbf9f0] p-3 sm:p-4 shadow-[4px_4px_0px_0px_#121a12] font-mono ${className}`}
    >
      {/* Cabecera de la Bandeja */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-black text-white px-2 py-0.5 text-[10px] sm:text-xs font-black uppercase tracking-widest">
            COLECCIÓN DE CHAPAS
          </span>
          <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider hidden sm:inline">
            Privilegios Activos de Saqueo & Blindaje
          </span>
        </div>

        <div className="text-xs font-black bg-white border border-black px-2 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
          {privileges.length} ACTIVOS
        </div>
      </div>

      {/* Rack / Bandeja de Chapas Interactivas */}
      <div className="flex flex-wrap gap-2 items-center mb-3">
        {privileges.map((priv) => {
          const isRecentlyActivated = lastActivated === priv.id;
          const meta = CATEGORY_META[priv.category] ?? CATEGORY_META.CONTROL_PRENSA;
          const isSelected = selectedPrivilege?.id === priv.id;

          return (
            <button
              key={priv.id}
              type="button"
              onClick={() => setSelectedPrivilege(isSelected ? null : priv)}
              title={`${priv.name} (${priv.inGameEffect})`}
              className={`relative group inline-flex items-center gap-1.5 border-2 border-black px-2.5 py-1 text-xs font-black uppercase tracking-tight transition-all duration-100 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 ${
                meta.bgClass
              } ${isSelected ? 'ring-2 ring-black scale-105' : ''} ${
                isRecentlyActivated
                  ? 'bg-amber-300 text-black border-2 border-black ring-4 ring-amber-400 ring-offset-1 animate-pulse shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  : ''
              }`}
            >
              <span>{meta.icon}</span>
              <span>{priv.name}</span>
              <span className="text-[9px] opacity-75 font-normal">#{priv.id}</span>

              {/* Indicador de Activación Reciente */}
              {isRecentlyActivated && (
                <span className="absolute -top-2 -right-1 bg-black text-amber-300 text-[8px] font-black px-1 border border-amber-300 animate-bounce">
                  ★ ACTIVO
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tarjeta de Inspección del Privilegio Seleccionado (Tooltip / Drawer Fanzinero) */}
      {selectedPrivilege ? (
        <div className="border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] animate-in fade-in duration-100">
          <div className="flex items-center justify-between border-b border-black pb-1.5 mb-2">
            <div className="flex items-center gap-2">
              <span className="bg-black text-white px-1.5 py-0.2 text-[10px] font-black uppercase">
                {CATEGORY_META[selectedPrivilege.category]?.label ?? selectedPrivilege.category}
              </span>
              <h4 className="text-xs sm:text-sm font-black uppercase text-black">
                {selectedPrivilege.name} (#{selectedPrivilege.id})
              </h4>
              <span className="text-[10px] text-zinc-500 font-bold hidden sm:inline">
                [{selectedPrivilege.shortTag}]
              </span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPrivilege(null)}
              className="text-xs font-black border border-black bg-stone-100 hover:bg-black hover:text-white px-1.5 py-0.2 cursor-pointer"
            >
              ✕ CERRAR
            </button>
          </div>

          <p className="text-xs text-zinc-800 italic mb-2">
            "{selectedPrivilege.description}"
          </p>

          <div className="bg-amber-50 border border-black p-2 text-xs font-bold text-black flex items-center gap-2">
            <span className="text-base">🎲</span>
            <div>
              <span className="font-black uppercase text-[10px] text-zinc-600 block">
                EFECTO EN LAS TIRADAS DE DADOS:
              </span>
              <span>{selectedPrivilege.inGameEffect}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider text-center py-1">
          [ Toca cualquier chapa para examinar su bonificación en las tiradas ]
        </div>
      )}
    </section>
  );
}

export default PrivilegeBadges;
