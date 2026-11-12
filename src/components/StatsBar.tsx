'use client';

import React from 'react';
import { CharacterStats, CharacterProfile } from '../types/story';
import { useGameStore } from '../store/gameStore';

export interface StatsBarProps {
  stats?: CharacterStats;
  characterProfile?: CharacterProfile | null;
  className?: string;
  showCharacterBadge?: boolean;
}

interface StatConfig {
  key: keyof CharacterStats;
  label: string;
  code: string;
  description: string;
  dangerHigh?: boolean;
  dangerLow?: boolean;
}

const STAT_CONFIGS: StatConfig[] = [
  {
    key: 'pastaEnB',
    label: 'PASTA EN B',
    code: 'FONDOS_OPACOS',
    description: 'Mordidas y fajos en cajas fuertes',
    dangerLow: true,
  },
  {
    key: 'presionJudicial',
    label: 'PRESIÓN JUDICIAL',
    code: 'UCO_FISCALIA',
    description: 'Diligencias previas y pinchazos',
    dangerHigh: true,
  },
  {
    key: 'impunidad',
    label: 'IMPUNIDAD',
    code: 'BLINDAJE_RED',
    description: 'Aforamiento y favores debidos',
    dangerLow: true,
  },
  {
    key: 'reputacionMediatica',
    label: 'REPUTACIÓN MEDIÁTICA',
    code: 'PAZ_EDITORIAL',
    description: 'Control de portadas y tertulias',
    dangerLow: true,
  },
];

export function StatsBar({
  stats: propStats,
  characterProfile: propProfile,
  className = '',
  showCharacterBadge = true,
}: StatsBarProps) {
  const storeStats = useGameStore((state) => state.stats);
  const storeProfile = useGameStore((state) => state.characterProfile);
  const getPreviewModifiers = useGameStore((state) => state.getPreviewModifiers);
  const previewDirection = useGameStore((state) => state.previewDirection);
  const daysInPower = useGameStore((state) => state.daysInPower);
  const cardsSurvived = useGameStore((state) => state.cardsSurvived);

  const stats = propStats ?? storeStats;
  const profile = propProfile ?? storeProfile;
  const previewModifiers = getPreviewModifiers();

  return (
    <section
      aria-label="Indicadores de Estado Fanzine"
      className={`border-2 md:border-4 border-black bg-white p-3 md:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${className}`}
    >
      {/* Encabezado Fanzine / Membrete Sumarial */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-black text-white px-2 py-0.5 text-xs font-mono font-black uppercase tracking-widest">
            TELEMETRÍA // DILIGENCIAS
          </span>
          <span className="text-[11px] font-mono text-black font-semibold uppercase tracking-wider hidden sm:inline">
            Pieza de Situación Patrimonial
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          {daysInPower > 0 && (
            <span className="border border-black bg-yellow-200 px-2 py-0.5 font-bold uppercase tracking-wider">
              {daysInPower} DÍAS ({cardsSurvived} DILEMAS)
            </span>
          )}
          {showCharacterBadge && profile && (
            <span className="border border-black px-1.5 py-0.5 bg-stone-100 font-black uppercase hidden sm:inline">
              {profile.name}
            </span>
          )}
        </div>
      </div>

      {/* Grid de 4 Indicadores Brutalistas con Feedback Predictivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {STAT_CONFIGS.map((config) => {
          const value = Math.max(0, Math.min(100, stats[config.key] ?? 0));
          const isCriticalHigh = config.dangerHigh && value >= 80;
          const isCriticalLow = config.dangerLow && value <= 20;
          const isAlarm = isCriticalHigh || isCriticalLow;

          // Indicador predictivo tipo Reigns (cuando el jugador desliza hacia izq o der)
          const delta = previewModifiers?.[config.key];
          const hasDelta = delta !== undefined && delta !== 0;
          const isPositive = (delta ?? 0) > 0;

          return (
            <div
              key={config.key}
              className={`border-2 border-black p-2.5 transition-all duration-150 ${
                hasDelta
                  ? 'bg-amber-50 ring-2 ring-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  : isAlarm
                  ? 'bg-zinc-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {/* Título, predicción y porcentaje numérico */}
              <div className="flex items-center justify-between mb-1 gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-black tracking-tight uppercase text-black">
                    {config.label}
                  </span>
                  {/* Punto titilante tipo Reigns */}
                  {hasDelta && (
                    <span
                      aria-label="Impacto inminente"
                      className={`inline-block w-2.5 h-2.5 rounded-full border border-black animate-ping ${
                        isPositive ? 'bg-black' : 'bg-red-600'
                      }`}
                      title={isPositive ? 'Aumentará' : 'Disminuirá'}
                    />
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {hasDelta && (
                    <span
                      className={`text-[10px] font-mono font-black px-1 border border-black ${
                        isPositive ? 'bg-black text-white' : 'bg-red-600 text-white'
                      }`}
                    >
                      {isPositive ? '▲' : '▼'}
                    </span>
                  )}
                  <span className="text-xs font-mono font-bold bg-black text-white px-1.5 py-0.2">
                    {value}%
                  </span>
                </div>
              </div>

              {/* Subtítulo técnico sumario */}
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-600 mb-1.5">
                <span className="truncate">{config.code}</span>
                <span>{value}/100</span>
              </div>

              {/* Barra de Progreso Brutalista de Alto Contraste */}
              <div className="w-full h-4 border-2 border-black bg-stone-100 p-0.5 relative overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isCriticalHigh
                      ? 'bg-black animate-pulse'
                      : 'bg-black'
                  }`}
                  style={{ width: `${value}%` }}
                />
              </div>

              {/* Indicador de Alerta de Alto Contraste */}
              {isCriticalHigh && (
                <div className="mt-1.5 border border-black bg-black text-white px-1 py-0.5 text-[9px] font-mono font-black uppercase text-center tracking-wider">
                  ⚠️ ALERTA: PRISIÓN INMINENTE
                </div>
              )}
              {isCriticalLow && (
                <div className="mt-1.5 border border-black bg-white text-black px-1 py-0.5 text-[9px] font-mono font-black uppercase text-center tracking-wider">
                  ⚠️ NIVEL CRÍTICO BAJO
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default StatsBar;
