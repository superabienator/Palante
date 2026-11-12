'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StatsBar } from '../components/StatsBar';
import { ReignsCard } from '../components/ReignsCard';
import { CharacterSelector } from '../components/CharacterSelector';
import { VerdictModal } from '../components/VerdictModal';
import { useGameStore } from '../store/gameStore';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [showDossier, setShowDossier] = useState(false);

  const status = useGameStore((state) => state.status);
  const characterProfile = useGameStore((state) => state.characterProfile);
  const daysInPower = useGameStore((state) => state.daysInPower);
  const cardsSurvived = useGameStore((state) => state.cardsSurvived);
  const unlockedMechanics = useGameStore((state) => state.unlockedMechanics);
  const evidenceDocuments = useGameStore((state) => state.evidenceDocuments);
  const resetToCharacterSelect = useGameStore((state) => state.resetToCharacterSelect);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#f4f1ea] p-4 sm:p-8 font-mono text-black">
        <div className="max-w-4xl mx-auto border-4 border-black bg-white p-6 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="border-b-4 border-black pb-4 mb-6">
            <div className="h-8 bg-black w-3/4 mb-2 animate-pulse" />
            <div className="h-4 bg-zinc-300 w-1/2 animate-pulse" />
          </div>
          <p className="font-mono text-xs uppercase font-bold tracking-widest text-zinc-500">
            [ ABRIENDO EXPEDIENTES DEL SUMARIO CENTRAL... ]
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-black font-mono selection:bg-black selection:text-white p-3 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* Encabezado Principal Fanzine */}
        <header className="border-3 md:border-4 border-black bg-white p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-2 mb-3">
            <span className="bg-black text-white px-2 py-0.5 text-xs font-black uppercase tracking-widest">
              FANZINE DE LA CLEPTOCRACIA // REIGNS EDITION
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest hidden sm:inline">
                AUDIENCIA NACIONAL // SUMARIO EN TIEMPO REAL
              </span>
              <Link
                href="/admin"
                className="text-[10px] font-bold uppercase tracking-wider border border-black bg-stone-100 hover:bg-black hover:text-white px-2 py-0.5 transition-colors shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                title="Panel de redacción y mazo para usuarios no técnicos"
              >
                Acceso Sumario / Panel de Redacción ➔
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-1">
                IBEX-35 & PÚNICA
              </h1>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-700">
                Simulador de Supervivencia Política, Puertas Giratorias y Cloacas del Estado
              </p>
            </div>

            <div className="border-2 border-black bg-stone-100 p-2 text-right text-[11px] font-bold uppercase rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div>ESTADO DE LA LEGISLATURA:</div>
              <div className="font-black text-xs text-black">
                {status === 'NOT_STARTED' && 'SELECCIÓN DE IMPUTADOS'}
                {status === 'PLAYING' && `${daysInPower} DÍAS SOBREVIVIDOS`}
                {status === 'GAME_OVER' && 'SENTENCIA DICTADA'}
              </div>
            </div>
          </div>
        </header>

        {/* ========================================================
            ESTADO 1: NOT_STARTED -> SELECTOR JERÁRQUICO
           ======================================================== */}
        {status === 'NOT_STARTED' && <CharacterSelector />}

        {/* ========================================================
            ESTADO 2: PLAYING -> MODO REIGNS (SWIPE + TELEMETRÍA)
           ======================================================== */}
        {status === 'PLAYING' && (
          <section className="flex flex-col gap-6" aria-label="Tablero de Supervivencia Reigns">
            {/* Barra Superior con Imputado Activo y Control */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-black bg-stone-100 p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2">
                <span className="bg-black text-white px-2 py-0.5 text-xs font-black uppercase tracking-wider">
                  EN LA POLTRONA
                </span>
                <span className="text-xs font-black uppercase">
                  {characterProfile?.name}
                </span>
                <span className="text-xs text-zinc-600 hidden sm:inline">
                  | {characterProfile?.sphere}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs font-bold uppercase bg-white border border-black px-2 py-0.5">
                  LEGISLATURA: {cardsSurvived}/25 TRIMESTRES
                </div>
                <button
                  type="button"
                  onClick={resetToCharacterSelect}
                  className="border-2 border-black bg-white hover:bg-black hover:text-white px-3 py-1 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-colors"
                >
                  [ CAMBIAR IMPUTADO ]
                </button>
              </div>
            </div>

            {/* Barra de Estadísticas con Indicadores Predictivos en Tiempo Real */}
            <StatsBar showCharacterBadge={false} />

            {/* Ficha Interactiva de Decisiones Tipo Reigns */}
            <div className="py-2">
              <ReignsCard />
            </div>

            {/* Sumario Judicial Desplegable (Evidencias y Mecánicas sin saturar la pantalla) */}
            <div className="mt-2 border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <button
                type="button"
                onClick={() => setShowDossier(!showDossier)}
                className="w-full flex items-center justify-between p-3 text-xs font-mono font-black uppercase tracking-wider hover:bg-stone-50 cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  <span>📁 EXPEDIENTE JUDICIAL EN CURSO</span>
                  <span className="bg-black text-white px-1.5 py-0.5 text-[10px]">
                    {evidenceDocuments.length} PIEZAS
                  </span>
                  <span className="bg-stone-200 border border-black px-1.5 py-0.5 text-[10px] hidden sm:inline">
                    {unlockedMechanics.length} MECÁNICAS
                  </span>
                </div>
                <span className="text-zinc-700 font-bold">
                  {showDossier ? '[ OCULTAR EXPEDIENTE ▲ ]' : '[ INSPECCIONAR EXPEDIENTE ▼ ]'}
                </span>
              </button>

              {showDossier && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-t-2 border-black bg-stone-50">
                  {/* Piezas de Convicción */}
                  <div className="border border-black bg-white p-3">
                    <div className="flex items-center justify-between border-b border-black pb-1.5 mb-2">
                      <span className="text-xs font-black uppercase tracking-widest text-black">
                        PIEZAS DE CONVICCIÓN INCAUTADAS
                      </span>
                      <span className="text-[10px] bg-black text-white px-1.5 py-0.2 font-bold">
                        {evidenceDocuments.length}
                      </span>
                    </div>

                    {evidenceDocuments.length === 0 ? (
                      <p className="text-xs text-zinc-500 italic">
                        Sin intervenciones policiales registradas en esta pieza.
                      </p>
                    ) : (
                      <ul className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                        {evidenceDocuments.map((doc, idx) => (
                          <li
                            key={idx}
                            className="border border-black bg-amber-50/50 p-2 text-xs font-mono text-zinc-900 border-l-3 border-l-black"
                          >
                            "{doc}"
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Mecánicas Desbloqueadas */}
                  <div className="border border-black bg-white p-3">
                    <div className="flex items-center justify-between border-b border-black pb-1.5 mb-2">
                      <span className="text-xs font-black uppercase tracking-widest text-black">
                        MECÁNICAS DE SAQUEO ACTIVAS
                      </span>
                      <span className="text-[10px] bg-black text-white px-1.5 py-0.2 font-bold">
                        {unlockedMechanics.length}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                      {unlockedMechanics.map((id) => (
                        <span
                          key={id}
                          className="border border-black bg-stone-100 text-black px-2 py-0.5 text-xs font-bold"
                        >
                          Mecánica #{id}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Modal / Pantalla de Fin de Partida */}
        <VerdictModal />

        {/* Pie de Página */}
        <footer className="border-t-2 border-black pt-4 pb-8 text-center text-xs font-mono text-zinc-600 flex flex-col items-center gap-2">
          <div className="font-bold uppercase tracking-wider">
            IBEX-35 & PÚNICA: REIGNS FANZINE EDITION
          </div>
          <div className="text-[10px] uppercase">
            Desliza hacia los lados o utiliza las teclas [ ← ] y [ → ] para sobrevivir al sumario judicial.
          </div>
          <div className="mt-1">
            <Link
              href="/admin"
              className="text-[11px] font-black uppercase tracking-wider underline hover:text-black transition-colors"
            >
              [ Acceso Sumario / Panel de Redacción ]
            </Link>
          </div>
        </footer>

      </div>
    </main>
  );
}
