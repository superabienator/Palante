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
    dangerHigh: true,
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
  className = '',
}: StatsBarProps) {
  const storeStats = useGameStore((state) => state.stats);
  const getPreviewModifiers = useGameStore((state) => state.getPreviewModifiers);
  const getProjectedStatsRange = useGameStore((state) => state.getProjectedStatsRange);
  const daysInPower = useGameStore((state) => state.daysInPower);
  const cardsSurvived = useGameStore((state) => state.cardsSurvived);

  const stats = propStats ?? storeStats;
  const previewModifiers = getPreviewModifiers();
  const projectedRange = getProjectedStatsRange();

  return (
    <section
      aria-label="Indicadores de Estado Fanzine"
      className={`fanzine-container border-2 md:border-4 border-black bg-white p-3 md:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${className}`}
    >
      {/* Encabezado Fanzine / Membrete Sumarial */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-black text-white px-2 py-0.5 text-xs font-mono font-black uppercase tracking-widest">
            TELEMETRÍA // MEDIDORES
          </span>
          <span className="text-[11px] font-mono text-black font-semibold uppercase tracking-wider hidden sm:inline">
            Equilibrio del Régimen (0% o 100% = Caída)
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          {daysInPower > 0 && (
            <span className="border border-black bg-yellow-200 px-2 py-0.5 font-bold uppercase tracking-wider">
              {daysInPower} DÍAS ({cardsSurvived} DILEMAS)
            </span>
          )}
        </div>
      </div>

      {/* Grid de 4 Indicadores Brutalistas con Container Queries */}
      <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-3 md:gap-4">
        {STAT_CONFIGS.map((config) => {
          const value = Math.max(0, Math.min(100, stats[config.key] ?? 0));
          const isInRedZone = value < 15 || value > 85;
          const isCriticalHigh = config.dangerHigh && value >= 80;
          const isCriticalLow = config.dangerLow && value <= 20;
          const isAlarm = isCriticalHigh || isCriticalLow || isInRedZone;

          // Indicador predictivo de impacto y margen de dados (cuando el jugador desliza o apunta a izq/der)
          const delta = previewModifiers?.[config.key];
          const variance = projectedRange?.[config.key];
          const hasDelta = delta !== undefined && delta !== 0;
          const isPositive = (delta ?? 0) > 0;

          // Determinar si el cambio es peligroso para esta barra
          const isDangerousShift =
            config.key === 'presionJudicial'
              ? isPositive
              : config.key === 'pastaEnB' && value >= 75 && isPositive
              ? true
              : !isPositive;

          const minStr = variance
            ? variance.min > 0
              ? `+${variance.min}`
              : `${variance.min}`
            : '';
          const maxStr = variance
            ? variance.max > 0
              ? `+${variance.max}`
              : `${variance.max}`
            : '';

          // Calcular zona visual proyectada sobre la barra 0..100
          const projLow = variance
            ? Math.max(0, Math.min(100, value + variance.min))
            : value;
          const projHigh = variance
            ? Math.max(0, Math.min(100, value + variance.max))
            : value;
          const zoneLeft = Math.min(value, projLow, projHigh);
          const zoneRight = Math.max(value, projLow, projHigh);
          const zoneWidth = Math.max(2, zoneRight - zoneLeft);

          return (
            <div
              key={config.key}
              className={`stat-card border-2 border-black p-2.5 transition-all duration-150 flex flex-col justify-between ${
                hasDelta
                  ? 'bg-amber-50 ring-2 ring-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5'
                  : isAlarm
                  ? 'bg-zinc-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              <div>
                {/* Título, predicción y porcentaje numérico */}
                <div className="flex items-center justify-between mb-1 gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-black tracking-tight uppercase text-black">
                      {config.label}
                    </span>
                    {/* Punto titilante de alerta de impacto */}
                    {hasDelta && (
                      <span
                        aria-label="Impacto inminente"
                        className={`inline-block w-2.5 h-2.5 rounded-full border border-black animate-ping ${
                          isDangerousShift ? 'bg-red-600' : 'bg-emerald-600'
                        }`}
                        title={isPositive ? 'Aumentará' : 'Disminuirá'}
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {hasDelta && (
                      <span
                        className={`text-[10px] font-mono font-black px-1 border border-black ${
                          isDangerousShift ? 'bg-red-600 text-white' : 'bg-emerald-700 text-white'
                        }`}
                      >
                        {isPositive ? '▲' : '▼'}
                      </span>
                    )}
                    <span
                      data-danger={isInRedZone ? 'true' : undefined}
                      className={`text-xs font-mono font-bold px-1.5 py-0.2 ${
                        isInRedZone
                          ? 'bg-red-600 text-white font-black animate-pulse ring-2 ring-red-700 shadow-[0_0_8px_rgba(220,38,38,0.7)]'
                          : 'bg-black text-white'
                      }`}
                    >
                      {value}%
                    </span>
                  </div>
                </div>

                {/* Subtítulo técnico sumario */}
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-600 mb-1.5">
                  <span className="truncate">{config.code}</span>
                  <span>{value}/100</span>
                </div>

                {/* Horquilla de Tirada de Dados al Previsualizar */}
                {variance && (
                  <div className="mb-2 border border-black bg-white p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center justify-between gap-1 text-[10px] font-mono font-black">
                      <span className="flex items-center gap-1 text-black">
                        <span className="inline-block animate-bounce">🎲</span>
                        <span>HORQUILLA ({variance.diceNotation}):</span>
                      </span>
                      <span
                        className={`px-1 py-0.2 border border-black ${
                          isDangerousShift
                            ? 'bg-red-100 text-red-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {minStr}% a {maxStr}%
                      </span>
                    </div>

                    <div className="text-[9px] font-mono text-zinc-600 mt-0.5 flex justify-between">
                      <span>Posible cierre:</span>
                      <span className="font-bold text-black">
                        {projLow}% — {projHigh}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                {/* Barra de Progreso Brutalista con Zona de Incertidumbre */}
                <div
                  className={`w-full h-4 border-2 p-0.5 relative overflow-hidden transition-colors ${
                    isInRedZone
                      ? 'border-red-700 bg-red-100 ring-2 ring-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)] animate-pulse'
                      : 'border-black bg-stone-100'
                  }`}
                >
                  {/* Barra actual */}
                  <div
                    className={`h-full transition-all duration-300 ${
                      isInRedZone
                        ? 'bg-red-700 animate-pulse'
                        : isCriticalHigh
                        ? 'bg-black animate-pulse'
                        : 'bg-black'
                    }`}
                    style={{ width: `${value}%` }}
                  />

                  {/* Zona de Margen Proyectado por los Dados */}
                  {variance && (
                    <div
                      className={`absolute top-0 bottom-0 opacity-75 animate-pulse border-x border-black ${
                        isDangerousShift ? 'bg-red-500' : 'bg-emerald-500'
                      }`}
                      style={{
                        left: `${zoneLeft}%`,
                        width: `${zoneWidth}%`,
                      }}
                      title={`Margen tras tirada: ${projLow}% a ${projHigh}%`}
                    />
                  )}
                </div>

                {/* Indicador de Alerta de Alto Contraste */}
                {isInRedZone ? (
                  <div className="mt-1.5 border border-red-700 bg-red-600 text-white px-1 py-0.5 text-[9px] font-mono font-black uppercase text-center tracking-wider animate-pulse shadow-[2px_2px_0px_0px_#000]">
                    🚨 ZONA ROJA ({value < 15 ? '< 15%' : '> 85%'}): RATA ACORRALADA
                  </div>
                ) : isCriticalHigh ? (
                  <div className="mt-1.5 border border-black bg-black text-white px-1 py-0.5 text-[9px] font-mono font-black uppercase text-center tracking-wider">
                    ⚠️ {config.key === 'pastaEnB' ? 'ALERTA: EUROPOL AL ACECHO' : 'ALERTA: PRISIÓN INMINENTE'}
                  </div>
                ) : isCriticalLow ? (
                  <div className="mt-1.5 border border-black bg-white text-black px-1 py-0.5 text-[9px] font-mono font-black uppercase text-center tracking-wider">
                    ⚠️ NIVEL CRÍTICO BAJO
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default StatsBar;
