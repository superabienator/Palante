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

              {status !== 'NOT_STARTED' && (
                <>
                  <span className="border-2 border-black bg-amber-300 text-black px-2.5 py-1 text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    👑 SUCESOR #{rulerGeneration}
                  </span>

                  <span className="border-2 border-black bg-black text-white px-2.5 py-1 text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    ⏱️ TRIMESTRE {currentQuarter} / 25
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Pantalla Inicial con Contexto y Botón de Inicio */}
        {status === 'NOT_STARTED' && (
          <section
            aria-label="Portada y Contexto de la Partida"
            className="border-4 border-black bg-[#faf8f4] p-5 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-5"
          >
            <div className="border-b-3 border-black pb-4">
              <span className="inline-block bg-red-700 text-white border-2 border-black px-2.5 py-0.5 text-[11px] font-black uppercase tracking-widest mb-2">
                SUMARIO ABIERTO // EDICIÓN REIGNS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black leading-tight">
                BIENVENIDO A LA POLTRONA, IMPUTADO DE TURNO
              </h2>
              <p className="text-sm sm:text-base text-zinc-800 mt-2 leading-relaxed">
                Acabas de tomar posesión del cargo. Sin currículum que memorizar ni excusas que valgan:
                tu único objetivo es sobrevivir <strong>25 trimestres (4 años de legislatura + prórroga)</strong>{' '}
                despachando marrones a izquierda o derecha hasta jubilarte en un consejo del <strong>IBEX 35</strong>.
                Si caes antes, un sucesor anónimo ocupará tu sillón al instante.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="font-black uppercase text-black mb-1">💰 PASTA EN B (0% ó 100% = CAÍDA)</div>
                <p className="text-zinc-700">
                  Si se agota, el partido te purga por insolvente. Si llega al 100%, cantas en Suiza y te caza Europol.
                </p>
              </div>
              <div className="border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="font-black uppercase text-black mb-1">⚖️ PRESIÓN JUDICIAL (100% = PRISIÓN)</div>
                <p className="text-zinc-700">
                  Pinchazos, registros de la UCO y autos de la Audiencia. Si toca el techo, duermes en Soto del Real.
                </p>
              </div>
              <div className="border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="font-black uppercase text-black mb-1">🛡️ IMPUNIDAD (0% = SUPLICATORIO)</div>
                <p className="text-zinc-700">
                  Tu red de favores y aforamiento. Si cae a cero, pierdes el blindaje y vas directo al banquillo.
                </p>
              </div>
              <div className="border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="font-black uppercase text-black mb-1">📰 REPUTACIÓN MEDIÁTICA (0% = PURGA)</div>
                <p className="text-zinc-700">
                  Control de portadas y tertulias. Si la prensa te lincha hasta el cero, te cesan en rueda de prensa.
                </p>
              </div>
            </div>

            <div className="border-2 border-dashed border-black bg-amber-50 p-3 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="font-black uppercase text-black">🎲 MECÁNICA DE JUEGO: </span>
                <span className="text-zinc-800">
                  Desliza cada carta a <strong>izquierda (←)</strong> o <strong>derecha (→)</strong>. Cada decisión lanza un <strong>Dado D6</strong> que modula el impacto real sobre los medidores.
                </span>
              </div>
            </div>

            <button
              type="button"
              autoFocus
              onClick={handleStartGame}
              className="w-full border-4 border-black bg-black text-white hover:bg-red-700 active:translate-x-0.5 active:translate-y-0.5 py-4 px-6 font-black uppercase text-base sm:text-lg tracking-wider shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-colors"
            >
              ▶ INICIAR PARTIDA // SENTARSE EN LA POLTRONA
            </button>
          </section>
        )}

        {/* Tablero Central Minimalista: 4 Medidores + Mazo Centrado */}
        {status !== 'NOT_STARTED' && (
          <section
            className="flex flex-col items-center gap-5"
            aria-label="Tablero de Supervivencia Política"
          >
            <StatsBar className="w-full" />

            <div className="w-full py-1">
              <ReignsCard />
            </div>
          </section>
        )}

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
