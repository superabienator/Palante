'use client';

import React, { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useGameStore } from '../store/gameStore';
import { FanzineDieFace } from './ReignsCard';
import { soundManager } from '../utils/soundEffects';

export function VerdictModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const status = useGameStore((state) => state.status);
  const rulerGeneration = useGameStore((state) => state.rulerGeneration);
  const ending = useGameStore((state) => state.ending);
  const gameOverReason = useGameStore((state) => state.gameOverReason);
  const gameOverDescription = useGameStore((state) => state.gameOverDescription);
  const daysInPower = useGameStore((state) => state.daysInPower);
  const cardsSurvived = useGameStore((state) => state.cardsSurvived);
  const lastDiceRoll = useGameStore((state) => state.lastDiceRoll);
  const nextSuccessor = useGameStore((state) => state.nextSuccessor);
  const stats = useGameStore((state) => state.stats);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (status === 'GAME_OVER') {
      soundManager.playGavel();
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [status]);

  if (status !== 'GAME_OVER') return null;

  const isVictory = gameOverReason === 'VICTORIA_LEGISLATURA';

  const handleCrownSuccessor = () => {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => { finished: Promise<void> } })
        .startViewTransition(() => {
          flushSync(() => {
            nextSuccessor();
          });
        });
    } else {
      nextSuccessor();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="verdict-modal-title"
      onCancel={(e) => e.preventDefault()}
      {...({ closedby: 'none' } as Record<string, string>)}
      className="fanzine-dialog m-auto bg-transparent p-4 w-full max-w-2xl font-mono overflow-visible"
    >
      <div className="relative w-full border-4 md:border-6 border-black bg-[#faf8f4] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-1 max-h-[90vh] overflow-y-auto">
        {/* Sello de Auto Judicial */}
        <div className="flex flex-wrap items-center justify-between border-b-3 border-black pb-3 mb-5 gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 font-black text-sm uppercase tracking-widest text-white border-2 border-black ${
                isVictory ? 'bg-green-700' : 'bg-red-700'
              }`}
            >
              {isVictory ? '★ RETIRO DORADO ★' : '⚖️ AUTO DE ENJUICIAMIENTO'}
            </span>
            <span className="text-xs font-bold text-zinc-600 uppercase">
              Pieza #{ending ?? 'FIN_DE_CAUSA'}
            </span>
          </div>

          <div className="border border-black bg-stone-100 px-2 py-0.5 text-xs font-bold uppercase">
            AUDIENCIA NACIONAL // SALA PENAL
          </div>
        </div>

        {/* Titular del Desenlace */}
        <h2
          id="verdict-modal-title"
          className="text-2xl sm:text-3xl font-black uppercase text-black leading-tight mb-4"
        >
          {isVictory
            ? '¡IMPUNIDAD TOTAL! CONSEJO DEL IBEX 35'
            : '¡CULPABLE! CAÍDA DE LA POLTRONA'}
        </h2>

        {/* Subtítulo Dinástico y Trimestres Sobrevividos */}
        <div className="border-2 border-black bg-stone-100 p-3 sm:p-4 mb-5 flex flex-wrap justify-between items-center gap-3 text-xs">
          <div>
            <span className="font-bold text-zinc-600 block text-[10px] uppercase">
              RELEVO DINÁSTICO EN EL SILLÓN:
            </span>
            <span className="font-black text-sm uppercase text-black">
              FIN DEL MANDATO DEL SUCESOR #{rulerGeneration}
            </span>
          </div>

          <div className="text-right">
            <span className="font-bold text-zinc-600 block text-[10px] uppercase">
              SUPERVIVENCIA EN LA POLTRONA:
            </span>
            <span className="font-black text-base text-black">
              {cardsSurvived} / 25 Trimestres
            </span>
            <span className="text-[11px] text-zinc-600 block font-bold">
              ({daysInPower} DÍAS DE MANDATO)
            </span>
          </div>
        </div>

        {/* Sentencia / Descripción del Desenlace */}
        <div className="border-l-4 border-black bg-white p-4 mb-5 text-sm leading-relaxed text-zinc-900">
          <p className="font-bold text-black uppercase mb-1 text-xs tracking-wider">
            [ DICTAMEN DE LOS HECHOS ]
          </p>
          <p className="italic">{gameOverDescription}</p>
        </div>

        {/* Última Tirada de Dados que Decidió la Legislatura */}
        {lastDiceRoll && lastDiceRoll.rolls.length > 0 && (
          <div className="border-2 border-black bg-yellow-50 p-3 mb-5 text-xs">
            <div className="font-black uppercase text-[10px] text-black mb-2 border-b border-black/20 pb-1 flex items-center justify-between">
              <span>🎲 TIRADA DE DADOS DECISIVA ({lastDiceRoll.stampText}):</span>
              <span className="text-zinc-600">{lastDiceRoll.cardHeadline}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {lastDiceRoll.rolls.map((roll) => {
                const sign = roll.rolledDelta > 0 ? `+${roll.rolledDelta}` : `${roll.rolledDelta}`;
                return (
                  <div
                    key={roll.statKey}
                    className="border border-black bg-white p-2 flex items-center gap-2"
                  >
                    <FanzineDieFace face={roll.diceFace} size={22} />
                    <div>
                      <div className="font-black text-black">
                        {roll.statLabel}: {sign}%
                        {roll.statBefore !== undefined && roll.statAfter !== undefined && (
                          <span className="font-normal text-zinc-600 ml-1">
                            ({roll.statBefore}% ➔ {roll.statAfter}%)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Balance Patrimonial al Fin de Carrera */}
        <div className="border-2 border-black bg-white p-3 mb-6 text-xs">
          <div className="font-black uppercase text-[10px] text-zinc-600 mb-2 border-b border-zinc-200 pb-1">
            ESTADO DE LOS 4 MEDIDORES AL FINAL DEL MANDATO:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="border border-black p-1.5 bg-stone-50">
              <div className="text-[9px] font-bold text-zinc-600">PASTA EN B</div>
              <div className="font-black text-sm">{stats.pastaEnB}%</div>
            </div>
            <div className="border border-black p-1.5 bg-stone-50">
              <div className="text-[9px] font-bold text-zinc-600">PRESIÓN UCO</div>
              <div className="font-black text-sm">{stats.presionJudicial}%</div>
            </div>
            <div className="border border-black p-1.5 bg-stone-50">
              <div className="text-[9px] font-bold text-zinc-600">IMPUNIDAD</div>
              <div className="font-black text-sm">{stats.impunidad}%</div>
            </div>
            <div className="border border-black p-1.5 bg-stone-50">
              <div className="text-[9px] font-bold text-zinc-600">PRENSA</div>
              <div className="font-black text-sm">{stats.reputacionMediatica}%</div>
            </div>
          </div>
        </div>

        {/* Botón Único de Sucesión Instantánea */}
        <button
          type="button"
          autoFocus
          onClick={handleCrownSuccessor}
          className="w-full border-3 border-black bg-black text-white hover:bg-zinc-800 active:translate-x-0.5 active:translate-y-0.5 py-3.5 px-4 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center transition-all cursor-pointer"
        >
          ★ CORONAR AL SUCESOR #{rulerGeneration + 1} ★
        </button>
      </div>
    </dialog>
  );
}

export default VerdictModal;
