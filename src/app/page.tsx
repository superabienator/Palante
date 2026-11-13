'use client';

import React, { useState, useEffect } from 'react';
import { StatsBar } from '../components/StatsBar';
import { ReignsCard } from '../components/ReignsCard';
import { VerdictModal } from '../components/VerdictModal';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../utils/soundEffects';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [muted, setMuted] = useState(false);

  const status = useGameStore((state) => state.status);
  const rulerGeneration = useGameStore((state) => state.rulerGeneration);
  const cardsSurvived = useGameStore((state) => state.cardsSurvived);
  const currentReignsCard = useGameStore((state) => state.currentReignsCard);
  const startNewReign = useGameStore((state) => state.startNewReign);

  useEffect(() => {
    setMounted(true);
    setMuted(soundManager.isMuted());
    const unsub = soundManager.onMuteChange((m) => setMuted(m));
    return unsub;
  }, []);

  useEffect(() => {
    if (mounted && (status === 'NOT_STARTED' || (status === 'PLAYING' && !currentReignsCard))) {
      startNewReign(rulerGeneration || 1);
    }
  }, [mounted, status, currentReignsCard, rulerGeneration, startNewReign]);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#f4f1ea] p-4 sm:p-8 font-mono text-black">
        <div className="max-w-3xl mx-auto border-4 border-black bg-white p-6 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="border-b-4 border-black pb-4 mb-6">
            <div className="h-8 bg-black w-3/4 mb-2 animate-pulse" />
            <div className="h-4 bg-zinc-300 w-1/2 animate-pulse" />
          </div>
          <p className="font-mono text-xs uppercase font-bold tracking-widest text-zinc-500">
            [ BARAJANDO EL SUMARIO CENTRAL... ]
          </p>
        </div>
      </main>
    );
  }

  const currentQuarter = Math.min(cardsSurvived + 1, 25);

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-black font-mono selection:bg-black selection:text-white p-3 sm:p-5 md:p-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-5">
        {/* Cabecera Compacta Estilo Reigns Puro */}
        <header className="border-3 md:border-4 border-black bg-white p-3 sm:p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">
                IBÉRICA DE CORRUPCIÓN
              </h1>
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-700 mt-1">
                Supervivencia Política Exprés // Desliza a Izquierda o Derecha
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => soundManager.toggleMute()}
                className="border-2 border-black bg-stone-100 hover:bg-black hover:text-white px-2.5 py-1 text-[11px] font-black uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                title={muted ? 'Activar efectos sonoros analógicos' : 'Silenciar efectos'}
              >
                <span>{muted ? '🔇 MUTE' : '🔊 AUDIO ON'}</span>
              </button>

              <span className="border-2 border-black bg-amber-300 text-black px-2.5 py-1 text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                👑 SUCESOR #{rulerGeneration}
              </span>

              <span className="border-2 border-black bg-black text-white px-2.5 py-1 text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                ⏱️ TRIMESTRE {currentQuarter} / 25
              </span>
            </div>
          </div>
        </header>

        {/* Tablero Central Minimalista: 4 Medidores + Mazo Centrado */}
        <section
          className="flex flex-col items-center gap-5"
          aria-label="Tablero de Supervivencia Política"
        >
          <StatsBar className="w-full" />

          <div className="w-full py-1">
            <ReignsCard />
          </div>
        </section>

        {/* Modal Nativo de Caída y Sucesión Instantánea */}
        <VerdictModal />

        {/* Pie de Página */}
        <footer className="border-t-2 border-black pt-3 pb-6 text-center text-xs font-mono text-zinc-600 flex flex-col items-center gap-1">
          <div className="font-bold uppercase tracking-wider text-black">
            IBÉRICA DE CORRUPCIÓN // FANZINE EDITION
          </div>
          <div className="text-[10px] uppercase">
            Desliza la carta o usa [ ← ] / [ → ] para sobrevivir en la poltrona.
          </div>
        </footer>
      </div>
    </main>
  );
}
