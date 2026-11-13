'use client';

import React from 'react';
import { useGameStore } from '../store/gameStore';

export interface StageDefinition {
  id: string;
  yearNumber: 1 | 2 | 3 | 4 | 5;
  yearLabel: string;
  quarterRangeLabel: string;
  startQuarter: number;
  endQuarter: number;
  milestoneTitle: string;
  milestoneSubtitle: string;
  isClimax?: boolean;
}

export const LEGISLATIVE_STAGES: StageDefinition[] = [
  {
    id: 'stage_year_1',
    yearNumber: 1,
    yearLabel: 'AÑO I',
    quarterRangeLabel: 'T1 - T6',
    startQuarter: 1,
    endQuarter: 6,
    milestoneTitle: 'REPARTO DE CONTRATOS & PLIEGOS',
    milestoneSubtitle: 'Consolidación en la poltrona, primeros favores y recalificaciones.',
  },
  {
    id: 'stage_year_2',
    yearNumber: 2,
    yearLabel: 'AÑO II',
    quarterRangeLabel: 'T7 - T12',
    startQuarter: 7,
    endQuarter: 12,
    milestoneTitle: 'PRIMERAS ESCUCHAS DE LA UCO',
    milestoneSubtitle: 'Pinchazos telefónicos clasificados e inspectores merodeando el consistorio.',
  },
  {
    id: 'stage_year_3',
    yearNumber: 3,
    yearLabel: 'AÑO III',
    quarterRangeLabel: 'T13 - T18',
    startQuarter: 13,
    endQuarter: 18,
    milestoneTitle: 'COMISIÓN DE INVESTIGACIÓN & DOSIERES',
    milestoneSubtitle: 'Filtraciones masivas a prensa, comisiones en el Congreso y fuego amigo.',
  },
  {
    id: 'stage_year_4',
    yearNumber: 4,
    yearLabel: 'AÑO IV',
    quarterRangeLabel: 'T19 - T23',
    startQuarter: 19,
    endQuarter: 23,
    milestoneTitle: 'MACRO-JUICIO EN LA AUDIENCIA',
    milestoneSubtitle: 'Auto de apertura de juicio oral, quema de discos duros y pánico en la cúpula.',
  },
  {
    id: 'stage_climax',
    yearNumber: 5,
    yearLabel: 'CLÍMAX',
    quarterRangeLabel: 'T24',
    startQuarter: 24,
    endQuarter: 24,
    milestoneTitle: 'EL PACTO DE LA TOJA (VISTA ORAL)',
    milestoneSubtitle: 'La vista definitiva ante el Tribunal Supremo: pactar la salida o caer.',
    isClimax: true,
  },
];

export interface LegislativeRoadmapProps {
  className?: string;
  cardsSurvived?: number;
}

export function LegislativeRoadmap({ className = '', cardsSurvived: propCards }: LegislativeRoadmapProps) {
  const storeCardsSurvived = useGameStore((state) => state.cardsSurvived);
  const daysInPower = useGameStore((state) => state.daysInPower);

  const cards = propCards ?? storeCardsSurvived ?? 0;
  // Trimestre actual: 1 a 24
  const currentQuarter = Math.max(1, Math.min(24, cards + 1));

  // Determinar la etapa activa
  const activeStage =
    LEGISLATIVE_STAGES.find(
      (s) => currentQuarter >= s.startQuarter && currentQuarter <= s.endQuarter
    ) ?? LEGISLATIVE_STAGES[LEGISLATIVE_STAGES.length - 1];

  const progressPercent = Math.min(100, Math.round((cards / 24) * 100));

  return (
    <section
      aria-label="Cronograma de la Legislatura"
      className={`fanzine-container border-3 border-[#121a12] bg-[#fbf9f0] p-3 sm:p-4 shadow-[4px_4px_0px_0px_#121a12] font-mono ${className}`}
    >
      {/* Cabecera Fanzine del Cronograma */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-black text-white px-2 py-0.5 text-[10px] sm:text-xs font-black uppercase tracking-widest">
            HOJA DE RUTA JUDICIAL
          </span>
          <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider hidden sm:inline">
            4 Años de Mandato + Clímax
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-stone-100 border border-black px-2 py-0.5 font-black uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            TRIMESTRE {currentQuarter} / 24
          </span>
          <span className="text-[11px] font-bold text-zinc-600 hidden md:inline">
            ({daysInPower || (currentQuarter * 90)} días)
          </span>
        </div>
      </div>

      {/* Segmentos de la Legislatura con Container Queries */}
      <div className="grid grid-cols-2 @sm:grid-cols-5 gap-2 mb-3">
        {LEGISLATIVE_STAGES.map((stage) => {
          const isCompleted = currentQuarter > stage.endQuarter;
          const isCurrent =
            currentQuarter >= stage.startQuarter && currentQuarter <= stage.endQuarter;

          let blockStyle = 'bg-white border-zinc-400 text-zinc-500';
          if (isCurrent) {
            blockStyle = stage.isClimax
              ? 'bg-red-800 text-white border-black font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ring-2 ring-red-600 animate-pulse'
              : 'bg-black text-amber-300 border-black font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]';
          } else if (isCompleted) {
            blockStyle =
              'bg-[#ebe5d3] border-black text-zinc-900 line-through opacity-85 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]';
          }

          return (
            <div
              key={stage.id}
              className={`border-2 p-2 flex flex-col justify-between transition-all duration-150 ${blockStyle} ${
                stage.isClimax ? 'col-span-2 @sm:col-span-1' : ''
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-black tracking-wider mb-1">
                <span>{stage.yearLabel}</span>
                <span className="text-[9px] opacity-80">{stage.quarterRangeLabel}</span>
              </div>

              <div className="text-[10px] font-bold leading-tight uppercase truncate">
                {stage.milestoneTitle.split('&')[0].trim()}
              </div>

              <div className="mt-1 flex items-center justify-between text-[9px]">
                {isCompleted && <span className="font-bold">✓ SUPERADO</span>}
                {isCurrent && <span className="font-black text-amber-300">★ EN CURSO</span>}
                {!isCompleted && !isCurrent && <span className="text-zinc-400">PENDIENTE</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Barra de Progreso Global */}
      <div className="w-full h-2.5 border-2 border-black bg-stone-200 p-0.5 mb-2 relative overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            activeStage.isClimax ? 'bg-red-700 animate-pulse' : 'bg-black'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Tarjeta de Hito Activo Actual */}
      <div
        className={`border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
          activeStage.isClimax ? 'bg-red-100 border-red-800' : 'bg-stone-50'
        }`}
      >
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-zinc-700 mb-0.5">
            <span>{activeStage.isClimax ? '🔥 ALERTA DE FIN DE MANDATO:' : '📌 HITO EN CURSO:'}</span>
            <span className="bg-black text-white px-1.5 py-0.2">
              {activeStage.yearLabel} // {activeStage.quarterRangeLabel}
            </span>
          </div>
          <div className="text-xs font-black uppercase text-black leading-snug">
            {activeStage.milestoneTitle}
          </div>
          <div className="text-[11px] text-zinc-700 italic">
            "{activeStage.milestoneSubtitle}"
          </div>
        </div>

        <div className="shrink-0 text-right">
          <span className="text-[10px] font-bold uppercase text-zinc-500 block">
            SUPERVIVENCIA
          </span>
          <span className="text-xs font-black text-black">
            {cards}/24 TRIMESTRES
          </span>
        </div>
      </div>
    </section>
  );
}

export default LegislativeRoadmap;
