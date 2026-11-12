'use client';

import React from 'react';
import { StoryNode, Choice, StatModifiers } from '../types/story';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../utils/soundEffects';

export interface DecisionCardProps {
  node?: StoryNode | null;
  onSelectChoice?: (choiceId: string) => void;
  className?: string;
  disabled?: boolean;
}

function formatModifier(label: string, value: number | undefined) {
  if (value === undefined || value === 0) return null;
  const sign = value > 0 ? `+${value}` : `${value}`;
  return `${label}: ${sign}`;
}

export function DecisionCard({
  node: propNode,
  onSelectChoice,
  className = '',
  disabled = false,
}: DecisionCardProps) {
  const storeNode = useGameStore((state) => state.currentNode);
  const makeChoice = useGameStore((state) => state.makeChoice);

  const node = propNode !== undefined ? propNode : storeNode;

  if (!node) {
    return (
      <div className="border-2 border-black bg-stone-100 p-6 font-mono text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1">
        <p className="font-bold uppercase tracking-wider text-sm">
          [ NINGÚN EXPEDIENTE JUDICIAL SELECCIONADO ]
        </p>
      </div>
    );
  }

  const handleChoice = (choiceId: string) => {
    if (disabled) return;
    soundManager.playStampImpact(true);
    if (onSelectChoice) {
      onSelectChoice(choiceId);
    } else {
      makeChoice(choiceId);
    }
  };

  return (
    <article
      aria-label="Expediente Judicial y Toma de Decisiones"
      className={`relative -rotate-1 border-2 md:border-4 border-black bg-[#faf8f5] p-4 sm:p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform duration-150 hover:rotate-0 ${className}`}
    >
      {/* Sello de Sumario Superior / Decoración Fanzine */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-black text-white px-2 py-0.5 text-[11px] font-mono font-black uppercase tracking-widest">
            SUMARIO // AUDIENCIA NACIONAL
          </span>
          <span className="text-[10px] font-mono uppercase font-bold text-zinc-700 tracking-wider">
            Diligencias Previas // Pieza #{node.id}
          </span>
        </div>

        <div className="border-2 border-black bg-white px-2 py-0.5 text-[10px] font-mono font-black uppercase tracking-widest text-black rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          ★ SECRETO DE SUMARIO ★
        </div>
      </div>

      {/* Titular Estilo Recorte de Prensa / Auto Judicial */}
      <header className="mb-4">
        <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-1">
          [ ÁMBITO: {node.sphere} ]
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-mono font-black uppercase tracking-tight text-black leading-tight border-b-2 border-black pb-3">
          {node.headline}
        </h2>
      </header>

      {/* Narración Fanzine Punk de los Hechos */}
      <div className="font-mono text-sm sm:text-base leading-relaxed text-black/90 mb-6 bg-white/60 p-3 sm:p-4 border-l-4 border-black">
        {node.context}
      </div>

      {/* Documento de Prueba Incautado (Si existe) */}
      {node.evidenceDocument && (
        <aside
          aria-label="Prueba Material Incautada"
          className="mb-6 border-2 border-dashed border-black bg-stone-100 p-3 sm:p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-1"
        >
          <div className="flex items-center gap-2 text-xs font-mono font-black uppercase tracking-widest text-black mb-1">
            <span>📎</span>
            <span>PIEZA DE CONVICCIÓN // PRUEBA INTERVENIDA:</span>
          </div>
          <p className="font-mono text-xs sm:text-sm text-zinc-800 italic">
            "{node.evidenceDocument}"
          </p>
        </aside>
      )}

      {/* Bloque de Opciones: Sellos de Caucho Oficiales */}
      <section aria-label="Resoluciones y Decisiones Ejecutivas">
        <div className="flex items-center justify-between border-t-2 border-black pt-3 mb-3">
          <span className="text-xs font-mono font-black uppercase tracking-widest text-black">
            RESOLUCIONES DISPONIBLES // ESTAMPA TU DECISIÓN:
          </span>
          <span className="text-[11px] font-mono text-zinc-600 uppercase">
            {node.choices.length} opciones
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          {node.choices.map((choice: Choice, index: number) => {
            const modifiersList = [
              formatModifier('PASTA EN B', choice.modifiers?.pastaEnB),
              formatModifier('PRESIÓN UCO', choice.modifiers?.presionJudicial),
              formatModifier('IMPUNIDAD', choice.modifiers?.impunidad),
              formatModifier('PRENSA', choice.modifiers?.reputacionMediatica),
            ].filter(Boolean);

            return (
              <button
                key={choice.id}
                type="button"
                onClick={() => handleChoice(choice.id)}
                disabled={disabled}
                className="group relative w-full text-left border-2 md:border-3 border-black bg-white p-3 sm:p-4 transition-all duration-100 hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {/* Cabecera del Sello de Caucho */}
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5 font-mono text-[10px] sm:text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="border border-black group-hover:border-white px-1.5 py-0.5 font-black uppercase bg-stone-100 group-hover:bg-white group-hover:text-black">
                      SELLO #{index + 1}
                    </span>
                    {choice.mechanicId && (
                      <span className="border border-black group-hover:border-white px-1.5 py-0.5 font-bold uppercase tracking-wider text-zinc-700 group-hover:text-zinc-200">
                        MECÁNICA #{choice.mechanicId}
                      </span>
                    )}
                  </div>

                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-500 group-hover:text-zinc-300">
                    [ ESTAMPA VÁLIDA ]
                  </span>
                </div>

                {/* Texto Principal de la Elección */}
                <div className="font-mono font-black text-sm sm:text-base uppercase tracking-tight mb-2 leading-snug">
                  {choice.label}
                </div>

                {/* Cita de Escucha Telefónica / Sumario */}
                {choice.flavorQuote && (
                  <div className="font-mono text-xs italic border-l-2 border-black group-hover:border-white pl-2 mb-2 text-zinc-700 group-hover:text-zinc-200">
                    «{choice.flavorQuote}»
                    <span className="not-italic text-[10px] ml-1 uppercase opacity-75">
                      — [PINCHAZO TELEFÓNICO]
                    </span>
                  </div>
                )}

                {/* Resumen de Modificadores de Estado */}
                {modifiersList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-black/20 group-hover:border-white/20">
                    {modifiersList.map((mod, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono font-bold px-1.5 py-0.5 border border-black/40 group-hover:border-white/40 bg-stone-50 group-hover:bg-zinc-800 text-black group-hover:text-white"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </article>
  );
}

export default DecisionCard;
