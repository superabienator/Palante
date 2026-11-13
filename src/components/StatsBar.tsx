'use client';

import React from 'react';
import { CharacterStats } from '../types/story';
import { useGameStore } from '../store/gameStore';

export interface StatsBarProps {
  stats?: CharacterStats;
  className?: string;
}

interface StatConfig {
  key: keyof CharacterStats;
  icon: string;
  label: string;
  shortLabel: string;
}

const STAT_CONFIGS: StatConfig[] = [
  {
    key: 'pastaEnB',
    icon: '💰',
    label: 'PASTA EN B',
    shortLabel: 'PASTA',
  },
  {
    key: 'presionJudicial',
    icon: '⚖️',
    label: 'PRESIÓN JUDICIAL',
    shortLabel: 'JUECES',
  },
  {
    key: 'impunidad',
    icon: '🛡️',
    label: 'IMPUNIDAD',
    shortLabel: 'IMPUN.',
  },
  {
    key: 'reputacionMediatica',
    icon: '📰',
    label: 'PRENSA',
    shortLabel: 'PRENSA',
  },
];

export function StatsBar({ stats: propStats, className = '' }: StatsBarProps) {
  const storeStats = useGameStore((state) => state.stats);
  const getPreviewModifiers = useGameStore((state) => state.getPreviewModifiers);

  const stats = propStats ?? storeStats;
  const previewModifiers = getPreviewModifiers();

  return (
    <section
      aria-label="Indicadores de Estado Fanzine"
      className={`fanzine-container border-3 border-black bg-white p-2 sm:p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${className}`}
    >
      {/* Grid 4 columnas compacto (cabe en 1 sola fila incluso en móvil) */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
        {STAT_CONFIGS.map((config) => {
          const value = Math.max(0, Math.min(100, stats[config.key] ?? 0));
          const isInRedZone = value <= 15 || value >= 85;

          // Punto Ciego estilo Reigns: solo muestra si el medidor se ve afectado y su magnitud (sin dirección ni signo)
          const delta = previewModifiers?.[config.key];
          const absDelta = delta ? Math.abs(delta) : 0;
          const isAffected = absDelta > 0;
          const isHeavyImpact = absDelta >= 12;

          return (
            <div
              key={config.key}
              className={`stat-card border-2 border-black p-1.5 sm:p-2 transition-colors duration-150 flex flex-col justify-between ${
                isInRedZone ? 'bg-red-50' : 'bg-[#faf8f4]'
              }`}
            >
              {/* Punto ciego de impacto + Icono */}
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-sm sm:text-base leading-none" aria-hidden="true">
                  {config.icon}
                </span>

                <div className="h-4 flex items-center justify-center min-w-[16px]">
                  {isAffected ? (
                    <span
                      aria-label={isHeavyImpact ? 'Impacto fuerte' : 'Impacto leve'}
                      data-danger={isInRedZone ? 'true' : undefined}
                      className={`inline-block rounded-full bg-black border border-black transition-transform animate-pulse ${
                        isHeavyImpact ? 'w-3.5 h-3.5' : 'w-2 h-2'
                      }`}
                    />
                  ) : isInRedZone ? (
                    <span
                      data-danger="true"
                      className="text-[9px] font-black text-red-700 animate-pulse"
                      title="Nivel crítico"
                    >
                      !
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Barra visual limpia sin spoiler numérico en partida */}
              <div
                className={`w-full h-3 sm:h-3.5 border-2 overflow-hidden relative ${
                  isInRedZone ? 'border-red-700 bg-red-100' : 'border-black bg-stone-200'
                }`}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={config.label}
              >
                <div
                  className={`h-full transition-all duration-300 ${
                    isInRedZone ? 'bg-red-700' : 'bg-black'
                  }`}
                  style={{ width: `${value}%` }}
                />
              </div>

              {/* Etiqueta compacta */}
              <div className="mt-1 text-[9px] sm:text-[10px] font-mono font-black uppercase tracking-tight text-center text-black truncate">
                <span className="sm:hidden">{config.shortLabel}</span>
                <span className="hidden sm:inline">{config.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default StatsBar;
