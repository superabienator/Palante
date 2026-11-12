'use client';

import React, { useState, useEffect } from 'react';
import { StatsBar } from '../components/StatsBar';
import { ReignsCard } from '../components/ReignsCard';
import { CharacterSelector } from '../components/CharacterSelector';
import { VerdictModal } from '../components/VerdictModal';
import { CharacterPortrait } from '../components/CharacterPortrait';
import { useGameStore } from '../store/gameStore';

const MECHANICS_REGISTRY: Record<number, { name: string; tag: string }> = {
  1: { name: 'Recalificación PGOU Monte', tag: 'URBANISMO' },
  2: { name: 'Incendio Forestal Oportuno', tag: 'URBANISMO' },
  3: { name: 'Sepultura de Ruina Romana', tag: 'OBRA PÚBLICA' },
  4: { name: 'Rescate de Radial Quebrada', tag: 'IBEX 35' },
  5: { name: 'Bolsas de Basura en Helipuerto', tag: 'MALAYA' },
  6: { name: 'Cláusula Indemnizatoria Castor', tag: 'IBEX 35' },
  7: { name: 'Aeropuerto Peatonal sin Aviones', tag: 'DIPUTACIÓN' },
  8: { name: 'Donativo Anónimo Planta Noble', tag: 'FINANCIACIÓN' },
  9: { name: 'Sobresueldo en Sobre Manila', tag: 'CAJA B' },
  10: { name: 'Borrado con Martillo a Discos', tag: 'OBSTRUCCIÓN' },
  11: { name: 'Misales a la Banca Andorrana', tag: '3% / PUJOL' },
  12: { name: 'Mordida del 3% en Obra Civil', tag: 'COMISIONES' },
  13: { name: 'Filtración de Cuaderno Contable', tag: 'PRENSA' },
  14: { name: 'Micrófono en Centro Floral', tag: 'CLOACAS' },
  15: { name: 'Sueldo Reservado al Chófer', tag: 'KITCHEN' },
  16: { name: 'Subasta de 32 Terabytes de Audios', tag: 'KOMPROMAT' },
  17: { name: 'Asalto de Falso Cura al Domicilio', tag: 'OPERACIONES' },
  18: { name: 'Borrador Policial Fantasma UDYCO', tag: 'INTOXICACIÓN' },
  19: { name: 'Purga de Fiscal Anticorrupción', tag: 'TOGAS' },
  20: { name: 'Pinchazo en Hotel Mayfair Londres', tag: 'CORONA' },
  21: { name: 'Traje Diplomático a Medida', tag: 'COHECHO' },
  22: { name: 'Cumpleaños con Payaso y Confeti', tag: 'GÜRTEL' },
  23: { name: 'Partida Presupuestaria 31L Reptil', tag: 'ERE' },
  24: { name: 'Chófer con Sobre de Subvención', tag: 'CLIENTELISMO' },
  25: { name: 'Foro Deportivo Sin Factura', tag: 'NÓOS' },
  26: { name: 'Pinchazo Amiguito del Alma', tag: 'COHECHO' },
  27: { name: 'Tarjeta Black sin Retención', tag: 'CAJAS' },
  28: { name: 'Venta de Ladrillo Tóxico a Sareb', tag: 'RESCATE' },
  29: { name: 'Safari Africano a Costa de Cédulas', tag: 'CAJAS' },
  30: { name: 'Folleto Engañoso de Salida a Bolsa', tag: 'BANKIA' },
  31: { name: 'Condonación de Crédito Electoral', tag: 'BANCA' },
  32: { name: 'Billetes Serie W de la Fábrica', tag: 'PAESA' },
  33: { name: 'Esquela y Misa Falsa en Burgos', tag: 'PAESA' },
  34: { name: 'Papeles Falsificados de Laos', tag: 'ROLDÁN' },
  35: { name: 'Valija Diplomática Ginebra-Singapur', tag: 'BLANQUEO' },
  36: { name: 'Dictamen de Demencia Sobrevenida', tag: 'SOBRESEIMIENTO' },
  37: { name: 'Blindaje Procesal de Urgencia', tag: 'CRISIS' },
  38: { name: 'Inyección de Furgón de Seguridad', tag: 'CRISIS' },
  39: { name: 'Maniobra de Pasillo en Comisión', tag: 'CRISIS' },
  40: { name: 'Llamada al Editor del Periódico', tag: 'CRISIS' },
};

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
              FANZINE DE LA CLEPTOCRACIA // ¡PALANTE!
            </span>
            <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">
              AUDIENCIA NACIONAL // SUMARIO EN TIEMPO REAL
            </span>
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
                {status === 'NOT_STARTED' && 'DILIGENCIAS PREVIAS (Elige tu poltrona)'}
                {status === 'PLAYING' && `LEGISLATURA EN CURSO (${daysInPower} DÍAS)`}
                {status === 'GAME_OVER' && 'SENTENCIA EN FIRME // CAUSA LIQUIDADA'}
              </div>
            </div>
          </div>
        </header>

        {/* ========================================================
            ESTADO 1: NOT_STARTED -> SELECTOR JERÁRQUICO
           ======================================================== */}
        {status === 'NOT_STARTED' && <CharacterSelector />}

        {/* ========================================================
            ESTADO 2: PLAYING -> LEGISLATURA EN CURSO
           ======================================================== */}
        {status === 'PLAYING' && (
          <section className="flex flex-col gap-6" aria-label="Tablero de Supervivencia Política">
            {/* Barra Superior con Imputado Activo y Control */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-black bg-stone-100 p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2">
                <CharacterPortrait
                  archetypeId={characterProfile?.id}
                  alt={characterProfile?.name || ''}
                  size="sm"
                  className="w-8 h-8 min-w-[32px] min-h-[32px]"
                />
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

            {/* Ficha Interactiva de Decisiones Políticas */}
            <div className="py-2">
              <ReignsCard />
            </div>

            {/* Sumario Judicial Desplegable (Evidencias y Privilegios sin saturar la pantalla) */}
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
                    {unlockedMechanics.length} PRIVILEGIOS
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

                  {/* Privilegios Desbloqueados */}
                  <div className="border border-black bg-white p-3">
                    <div className="flex items-center justify-between border-b border-black pb-1.5 mb-2">
                      <span className="text-xs font-black uppercase tracking-widest text-black">
                        PRIVILEGIOS Y RESORTES DE PODER ACTIVOS
                      </span>
                      <span className="text-[10px] bg-black text-white px-1.5 py-0.2 font-bold">
                        {unlockedMechanics.length}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                      {unlockedMechanics.map((id) => {
                        const mech = MECHANICS_REGISTRY[id];
                        return (
                          <span
                            key={id}
                            className="border border-black bg-stone-100 text-black px-2 py-0.5 text-xs font-bold flex items-center gap-1 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                          >
                            <span className="text-[9px] bg-black text-white px-1 py-0.2 font-black uppercase">
                              {mech?.tag ?? 'PODER'}
                            </span>
                            <span>{mech?.name ?? `Privilegio #${id}`}</span>
                          </span>
                        );
                      })}
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
          <div className="font-bold uppercase tracking-wider text-black">
            IBEX-35 & PÚNICA: ¡PALANTE! (FANZINE EDITION)
          </div>
          <div className="text-[10px] uppercase">
            Desliza la carta o usa el teclado [ ← ] y [ → ] para sortear a la Fiscalía y a la prensa.
          </div>
        </footer>

      </div>
    </main>
  );
}
