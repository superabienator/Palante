'use client';

import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { StatsBar } from '../components/StatsBar';
import { ReignsCard } from '../components/ReignsCard';
import { VerdictModal } from '../components/VerdictModal';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../utils/soundEffects';

function runWithViewTransition(action: () => void) {
  if (typeof document !== 'undefined' && 'startViewTransition' in document) {
    (document as unknown as { startViewTransition: (cb: () => void) => { finished: Promise<void> } })
      .startViewTransition(() => {
        flushSync(action);
      });
  } else {
    action();
  }
}

const KNOWN_ENDINGS_LABELS = [
  { id: 'VICTORIA_LEGISLATURA', label: '🏆 Jubilación Dorada en el IBEX 35 (25 trimestres)' },
  { id: 'PASTA_MINIMA', label: '💸 Pasta en B al 0%: Purga por insolvencia' },
  { id: 'PASTA_MAXIMA', label: '🇨🇭 Pasta en B al 100%: Cazado por Europol en Suiza' },
  { id: 'PRESION_MINIMA', label: '🕵️ Presión UCO al 0%: Sospecha de topo chivato' },
  { id: 'PRESION_MAXIMA', label: '⛓️ Presión UCO al 100%: Prisión en Soto del Real' },
  { id: 'IMPUNIDAD_MINIMA', label: '🏛️ Impunidad al 0%: Suplicatorio y caída sin fuero' },
  { id: 'IMPUNIDAD_MAXIMA', label: '👑 Impunidad al 100%: Soberbia y traición interna' },
  { id: 'REPUTACION_MINIMA', label: '📰 Prensa al 0%: Linchamiento en portada dominical' },
  { id: 'REPUTACION_MAXIMA', label: '🌟 Prensa al 100%: Eclipsas al Líder Supremo' },
] as const;

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'restart' | 'resetDynasty' | null>(null);

  const helpDialogRef = useRef<HTMLDialogElement>(null);
  const confirmDialogRef = useRef<HTMLDialogElement>(null);

  const status = useGameStore((state) => state.status);
  const rulerGeneration = useGameStore((state) => state.rulerGeneration);
  const cardsSurvived = useGameStore((state) => state.cardsSurvived);
  const bestQuartersSurvived = useGameStore((state) => state.bestQuartersSurvived);
  const discoveredEndings = useGameStore((state) => state.discoveredEndings);
  const currentReignsCard = useGameStore((state) => state.currentReignsCard);
  const startNewReign = useGameStore((state) => state.startNewReign);
  const returnToMenu = useGameStore((state) => state.returnToMenu);
  const resetDynasty = useGameStore((state) => state.resetDynasty);

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
    runWithViewTransition(() => {
      startNewReign(currentReignsCard ? rulerGeneration || 1 : 1);
    });
  };

  const handleResumeGame = () => {
    soundManager.playStampImpact(true);
    runWithViewTransition(() => {
      useGameStore.setState({ status: 'PLAYING', previewDirection: null });
    });
  };

  const handleReturnToMenu = () => {
    runWithViewTransition(() => {
      returnToMenu();
    });
  };

  const openConfirmDialog = (action: 'restart' | 'resetDynasty') => {
    setConfirmAction(action);
    confirmDialogRef.current?.showModal();
  };

  const handleConfirmAction = () => {
    const action = confirmAction;
    confirmDialogRef.current?.close();
    setConfirmAction(null);
    if (action === 'restart') {
      soundManager.playStampImpact(true);
      runWithViewTransition(() => {
        startNewReign(rulerGeneration || 1);
      });
    } else if (action === 'resetDynasty') {
      runWithViewTransition(() => {
        resetDynasty();
      });
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
  const hasSavedProgress =
    bestQuartersSurvived > 0 ||
    discoveredEndings.length > 0 ||
    rulerGeneration > 1 ||
    currentReignsCard !== null;

  const sharedDialogs = (
    <>
      {/* Diálogo nativo de Confirmación (Reiniciar mandato o Reiniciar dinastía) */}
      <dialog
        ref={confirmDialogRef}
        onCancel={() => setConfirmAction(null)}
        className="fanzine-dialog p-0 bg-transparent max-w-md w-[92vw] m-auto"
        aria-labelledby="confirm-dialog-title"
      >
        <div className="border-4 border-black bg-[#faf8f4] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-mono text-black">
          <h3 id="confirm-dialog-title" className="text-base sm:text-lg font-black uppercase border-b-2 border-black pb-2 mb-3">
            {confirmAction === 'resetDynasty'
              ? '⚠️ BORRAR HISTORIAL DE DINASTÍA'
              : '↻ ¿REINICIAR MANDATO ACTUAL?'}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-800 mb-5 leading-relaxed">
            {confirmAction === 'resetDynasty'
              ? 'Se borrarán tu récord de trimestres, los finales descubiertos y volverás al Sucesor #1.'
              : `Vas por el trimestre ${currentQuarter}/25 con el Sucesor #${rulerGeneration}. Se perderá el progreso de este mandato y empezarás en el trimestre 1.`}
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                confirmDialogRef.current?.close();
                setConfirmAction(null);
              }}
              className="border-2 border-black bg-white hover:bg-stone-100 py-2.5 px-3 text-xs font-black uppercase cursor-pointer"
            >
              CANCELAR
            </button>
            <button
              type="button"
              onClick={handleConfirmAction}
              className="border-2 border-black bg-red-700 text-white hover:bg-red-800 py-2.5 px-3 text-xs font-black uppercase cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              {confirmAction === 'resetDynasty' ? 'SÍ, BORRAR TODO' : 'SÍ, REINICIAR'}
            </button>
          </div>
        </div>
      </dialog>

      {/* Diálogo nativo de Ayuda y Finales Descubiertos */}
      <dialog
        ref={helpDialogRef}
        className="fanzine-dialog p-0 bg-transparent max-w-lg w-[94vw] max-h-[88dvh] m-auto"
        aria-labelledby="help-dialog-title"
      >
        <div className="border-4 border-black bg-[#faf8f4] p-4 sm:p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-mono text-black overflow-y-auto max-h-[85dvh]">
          <div className="flex items-center justify-between border-b-3 border-black pb-2 mb-3">
            <h3 id="help-dialog-title" className="text-base sm:text-lg font-black uppercase">
              ❓ MANUAL DE SUPERVIVENCIA
            </h3>
            <button
              type="button"
              onClick={() => helpDialogRef.current?.close()}
              className="border-2 border-black bg-white hover:bg-black hover:text-white px-2 py-0.5 text-xs font-black uppercase cursor-pointer"
              aria-label="Cerrar ayuda"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="border-2 border-black bg-amber-50 p-2.5">
              <strong className="uppercase block mb-1">● PUNTOS CIEGOS Y DADO</strong>
              Al inclinar la carta o pasar el ratón por una opción verás un punto sobre los medidores que cambiarán (punto grande = impacto fuerte, pequeño = leve), <strong>sin saber si suben o bajan</strong>. Al soltar, el dado ajusta la intensidad final.
            </div>

            <div className="border-2 border-black bg-white p-2.5">
              <strong className="uppercase block mb-1">⚖️ PELIGRO EN AMBOS EXTREMOS (0% Y 100%)</strong>
              Aguanta <strong>25 trimestres</strong> sin que ningún medidor toque <strong>0%</strong> ni <strong>100%</strong>. Tanto la ruina absoluta como el exceso descontrolado terminan en cese fulminante.
            </div>

            <div className="border-2 border-black bg-white p-2.5">
              <strong className="uppercase block mb-1.5">
                📖 FINALES DESCUBIERTOS ({discoveredEndings.length}/9)
              </strong>
              <ul className="space-y-1 text-[11px]">
                {KNOWN_ENDINGS_LABELS.map((item) => {
                  const unlocked = discoveredEndings.includes(item.id);
                  return (
                    <li
                      key={item.id}
                      className={`px-2 py-1 border ${
                        unlocked
                          ? 'border-black bg-emerald-100 font-bold text-black'
                          : 'border-dashed border-zinc-400 bg-stone-100 text-zinc-500'
                      }`}
                    >
                      {unlocked ? item.label : '🔒 Final por descubrir...'}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="text-[11px] text-zinc-600 text-center pt-1">
              Controles: Arrastra la carta, pulsa los botones o usa las flechas <strong>[←] / [→]</strong>.
            </div>
          </div>
        </div>
      </dialog>
    </>
  );

  if (status === 'NOT_STARTED') {
    return (
      <>
        <main className="min-h-dvh bg-[#f4f1ea] text-black font-mono selection:bg-black selection:text-white p-3 sm:p-6 flex items-center justify-center">
        <div className="w-full max-w-3xl flex flex-col gap-4">
          <header className="border-4 border-black bg-white p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter leading-none">
                Palante!
              </h1>
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-700 mt-1">
                Supervivencia Política Exprés // Despacho &amp; Cloacas
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

            <div className="flex flex-col gap-2.5">
              {currentReignsCard ? (
                <>
                  <button
                    type="button"
                    autoFocus
                    onClick={handleResumeGame}
                    className="w-full border-4 border-black bg-black text-white hover:bg-red-700 active:translate-x-0.5 active:translate-y-0.5 py-3.5 px-6 font-black uppercase text-base tracking-wider shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-colors"
                  >
                    ▶ CONTINUAR MANDATO (#{rulerGeneration} · T.{currentQuarter}/25)
                  </button>
                  <button
                    type="button"
                    onClick={handleStartGame}
                    className="w-full border-3 border-black bg-white text-black hover:bg-amber-200 active:translate-x-0.5 active:translate-y-0.5 py-2.5 px-6 font-black uppercase text-xs sm:text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-colors"
                  >
                    ↻ EMPEZAR NUEVO MANDATO (DESDE T.1)
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  autoFocus
                  onClick={handleStartGame}
                  className="w-full border-4 border-black bg-black text-white hover:bg-red-700 active:translate-x-0.5 active:translate-y-0.5 py-3.5 px-6 font-black uppercase text-base tracking-wider shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-colors"
                >
                  ▶ INICIAR PARTIDA // SENTARSE EN LA POLTRONA
                </button>
              )}

              {hasSavedProgress && (
                <button
                  type="button"
                  onClick={() => openConfirmDialog('resetDynasty')}
                  className="self-center mt-1 text-[11px] font-bold uppercase text-zinc-600 hover:text-red-700 underline underline-offset-4 cursor-pointer"
                >
                  🗑️ Reiniciar dinastía y récord
                </button>
              )}
            </div>
          </section>
        </div>
      </main>
      {sharedDialogs}
      </>
    );
  }

  return (
    <>
    <main className="min-h-dvh bg-[#f4f1ea] text-black font-mono selection:bg-black selection:text-white p-2 sm:p-4 flex flex-col justify-between overflow-x-hidden">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-2.5 flex-1 justify-between">
        {/* Cabecera de 1 sola línea compacta para encuadre 100dvh móvil */}
        <header className="border-2 sm:border-3 border-black bg-white px-2.5 sm:px-3 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              type="button"
              onClick={handleReturnToMenu}
              className="border-2 border-black bg-stone-100 hover:bg-black hover:text-white px-2 py-0.5 text-[10px] sm:text-[11px] font-black uppercase cursor-pointer transition-colors shrink-0"
              title="Volver al menú principal"
              aria-label="Volver al menú principal"
            >
              🏠 <span className="hidden sm:inline">MENÚ</span>
            </button>
            <h1 className="text-sm sm:text-lg font-black uppercase tracking-tighter leading-none truncate">
              Palante!
            </h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (currentQuarter <= 1) {
                  soundManager.playStampImpact(true);
                  runWithViewTransition(() => startNewReign(rulerGeneration || 1));
                } else {
                  openConfirmDialog('restart');
                }
              }}
              className="border-2 border-black bg-stone-100 hover:bg-black hover:text-white px-2 py-0.5 text-[10px] sm:text-[11px] font-black uppercase cursor-pointer transition-colors"
              title="Reiniciar mandato actual"
              aria-label="Reiniciar mandato actual"
            >
              ↻
            </button>

            <button
              type="button"
              onClick={() => helpDialogRef.current?.showModal()}
              className="border-2 border-black bg-stone-100 hover:bg-black hover:text-white px-2 py-0.5 text-[10px] sm:text-[11px] font-black uppercase cursor-pointer transition-colors"
              title="Ayuda y finales descubiertos"
              aria-label="Ayuda y finales descubiertos"
            >
              ?
            </button>

            <button
              type="button"
              onClick={() => soundManager.toggleMute()}
              className="border-2 border-black bg-stone-100 hover:bg-black hover:text-white px-2 py-0.5 text-[10px] font-black uppercase cursor-pointer transition-colors"
              title={muted ? 'Activar audio' : 'Silenciar audio'}
              aria-label={muted ? 'Activar audio' : 'Silenciar audio'}
            >
              {muted ? '🔇' : '🔊'}
            </button>

            <span className="border-2 border-black bg-amber-300 text-black px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-black uppercase">
              👑 #{rulerGeneration}
            </span>

            <span className="border-2 border-black bg-black text-white px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-black uppercase">
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
    {sharedDialogs}
    </>
  );
}
