'use client';

import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
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
  const bestQuartersSurvived = useGameStore((state) => state.bestQuartersSurvived);
  const discoveredEndings = useGameStore((state) => state.discoveredEndings);
  const currentReignsCard = useGameStore((state) => state.currentReignsCard);
  const startNewReign = useGameStore((state) => state.startNewReign);

  useEffect(() => {
    setMounted(true);
    setMuted(soundManager.isMuted());
    const unsub = soundManager.onMuteChange((m) => setMuted(m));
    return unsub;
  }, []);

  useEffect(() => {
    if (mounted && status === 'PLAYING' && !currentReignsCard) {
      startNewReign(rulerGeneration || 1);
    }
  }, [mounted, status, currentReignsCard, rulerGeneration, startNewReign]);

  const handleStartGame = () => {
    soundManager.playStampImpact(true);
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => { finished: Promise<void> } })
        .startViewTransition(() => {
          flushSync(() => {
            startNewReign(1);
          });
        });
    } else {
      startNewReign(1);
    }
  };

  if (!mounted) {
    return (
      <main className="min-h-dvh bg-[#f4f1ea] p-4 sm:p-8 font-mono text-black flex items-center justify-center">
        <div className="w-full max-w-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="border-b-4 border-black pb-3 mb-4">
            <div className="h-7 bg-black w-3/4 mb-2 animate-pulse" />
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

  if (status === 'NOT_STARTED') {
    return (
      <main className="min-h-dvh bg-[#f4f1ea] text-black font-mono selection:bg-black selection:text-white p-3 sm:p-6 flex items-center justify-center">
        <div className="w-full max-w-3xl flex flex-col gap-4">
          <header className="border-4 border-black bg-white p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter leading-none">
                IBÉRICA DE CORRUPCIÓN
              </h1>
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-700 mt-1">
                Supervivencia Política Exprés // Estilo Reigns
              </p>
            </div>
            <button
              type="button"
              onClick={() => soundManager.toggleMute()}
              className="border-2 border-black bg-stone-100 hover:bg-black hover:text-white px-2.5 py-1 text-[11px] font-black uppercase tracking-wider cursor-pointer transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              {muted ? '🔇 MUTE' : '🔊 AUDIO ON'}
            </button>
          </header>

          <section
            aria-label="Portada y Contexto de la Partida"
            className="border-4 border-black bg-[#faf8f4] p-5 sm:p-7 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4"
          >
            <div className="border-b-3 border-black pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="inline-block bg-red-700 text-white border-2 border-black px-2.5 py-0.5 text-[11px] font-black uppercase tracking-widest">
                  SUMARIO ABIERTO // TABULA RASA
                </span>
                {(bestQuartersSurvived > 0 || discoveredEndings.length > 0) && (
                  <span className="border-2 border-black bg-amber-200 px-2 py-0.5 text-[11px] font-black uppercase">
                    🏆 RÉCORD: {bestQuartersSurvived}/25 · 📖 FINALES: {discoveredEndings.length}/9
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black leading-tight">
                BIENVENIDO A LA POLTRONA, IMPUTADO DE TURNO
              </h2>
              <p className="text-xs sm:text-sm text-zinc-800 mt-2 leading-relaxed">
                Sin pasado que memorizar: sobrevive <strong>25 trimestres</strong> despachando marrones a izquierda o derecha hasta jubilarte en el <strong>IBEX 35</strong>. Si caes antes, un sucesor anónimo ocupará tu sillón al instante.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="border-2 border-black bg-white p-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="font-black uppercase text-black mb-0.5">💰 PASTA EN B (0% / 100%)</div>
                <p className="text-zinc-700 text-[11px]">
                  0% = purga por insolvente · 100% = Europol te caza en Suiza.
                </p>
              </div>
              <div className="border-2 border-black bg-white p-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="font-black uppercase text-black mb-0.5">⚖️ PRESIÓN JUDICIAL (0% / 100%)</div>
                <p className="text-zinc-700 text-[11px]">
                  0% = sospecha de topo chivato · 100% = prisión en Soto del Real.
                </p>
              </div>
              <div className="border-2 border-black bg-white p-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="font-black uppercase text-black mb-0.5">🛡️ IMPUNIDAD (0% / 100%)</div>
                <p className="text-zinc-700 text-[11px]">
                  0% = pierdes el aforamiento · 100% = soberbia y traición interna.
                </p>
              </div>
              <div className="border-2 border-black bg-white p-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="font-black uppercase text-black mb-0.5">📰 PRENSA (0% / 100%)</div>
                <p className="text-zinc-700 text-[11px]">
                  0% = linchamiento editorial · 100% = eclipsas al Líder Supremo.
                </p>
              </div>
            </div>

            <div className="border-2 border-dashed border-black bg-amber-50 p-2.5 text-[11px] text-zinc-800">
              <strong className="uppercase text-black">● PUNTO CIEGO:</strong> Al inclinar una carta verás un punto sobre los medidores afectados, pero <strong>no sabrás si suben o bajan</strong> hasta soltarla. Confía en tu instinto.
            </div>

            <button
              type="button"
              autoFocus
              onClick={handleStartGame}
              className="w-full border-4 border-black bg-black text-white hover:bg-red-700 active:translate-x-0.5 active:translate-y-0.5 py-3.5 px-6 font-black uppercase text-base tracking-wider shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-colors"
            >
              ▶ INICIAR PARTIDA // SENTARSE EN LA POLTRONA
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-[#f4f1ea] text-black font-mono selection:bg-black selection:text-white p-2 sm:p-4 flex flex-col justify-between overflow-x-hidden">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-2.5 flex-1 justify-between">
        {/* Cabecera de 1 sola línea compacta para encuadre 100dvh móvil */}
        <header className="border-2 sm:border-3 border-black bg-white px-3 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-2">
          <h1 className="text-sm sm:text-lg font-black uppercase tracking-tighter leading-none truncate">
            IBÉRICA DE CORRUPCIÓN
          </h1>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => soundManager.toggleMute()}
              className="border-2 border-black bg-stone-100 hover:bg-black hover:text-white px-2 py-0.5 text-[10px] font-black uppercase cursor-pointer transition-colors"
              title={muted ? 'Activar audio' : 'Silenciar audio'}
            >
              {muted ? '🔇' : '🔊'}
            </button>

            <span className="border-2 border-black bg-amber-300 text-black px-2 py-0.5 text-[10px] sm:text-[11px] font-black uppercase">
              👑 #{rulerGeneration}
            </span>

            <span className="border-2 border-black bg-black text-white px-2 py-0.5 text-[10px] sm:text-[11px] font-black uppercase">
              ⏱️ {currentQuarter}/25
            </span>
          </div>
        </header>

        {/* 4 Medidores en una sola fila horizontal */}
        <StatsBar className="w-full" />

        {/* Mazo Centrado */}
        <section
          className="flex-1 flex flex-col justify-center py-1"
          aria-label="Tablero de Supervivencia Política"
        >
          <ReignsCard />
        </section>

        {/* Modal Nativo de Caída y Sucesión Instantánea */}
        <VerdictModal />

        {/* Pie mínimo */}
        <footer className="text-center text-[10px] font-mono text-zinc-600 uppercase pb-1">
          Desliza o usa [ ← ] / [ → ] · Récord: {bestQuartersSurvived}/25 · Finales: {discoveredEndings.length}/9
        </footer>
      </div>
    </main>
  );
}
