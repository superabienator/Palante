'use client';

import React, { useState, useEffect } from 'react';
import { StatsBar } from '../components/StatsBar';
import { DecisionCard } from '../components/DecisionCard';
import { useGameStore } from '../store/gameStore';
import { CharacterProfile, ArchetypeId, EndingType } from '../types/story';
import rawStoryData from '../content/story.json';

const ENDING_TITLES: Record<EndingType, { title: string; subtitle: string; verdict: string }> = {
  PRISION_INCONDICIONAL: {
    title: 'AUTO DE PRISIÓN INCONDICIONAL Y COMUNICADA',
    subtitle: 'DESTINO: CENTRO PENITENCIARIO MADRID V (SOTO DEL REAL)',
    verdict: 'Riesgo extremo de fuga, destrucción reiterada de pruebas y alarma social.',
  },
  INDULTO_EXPRES: {
    title: 'BOE EXTRAORDINARIO: REAL DECRETO DE INDULTO',
    subtitle: 'CONCEDIDO POR RAZONES DE "JUSTICIA Y EQUIDAD"',
    verdict: 'El Consejo de Ministros extingue la pena a cambio de silencio institucional.',
  },
  FUGA_Y_PRESCRIPCION: {
    title: 'HUIDA Y PRESCRIPCIÓN EN CANTÓN HELVÉTICO',
    subtitle: 'LOCALIZADO EN GINEBRA CON RESIDENCIA NO FISCAL',
    verdict: 'Las comisiones rogatorias caducan en los cajones judiciales suizos.',
  },
  SOBRESEIMIENTO_BOTIN: {
    title: 'AUTO DE SOBRESEIMIENTO LIBRE Y ARCHIVO',
    subtitle: 'NULIDAD DE ACTUACIONES POR DEFECTO DE FORMA',
    verdict: 'Las escuchas policiales son declaradas ilícitas y el sumario se desmorona.',
  },
  PURGA_DE_OFICIO: {
    title: 'DESTITUCIÓN FULMINANTE Y SUSPENSIÓN DE EMPLEO',
    subtitle: 'EXPULSADO DE LA CARRERA Y TRASLADADO FORZOSO',
    verdict: 'El aparato te sacrifica públicamente para blindar al comité directivo.',
  },
  CONSEJO_IBEX: {
    title: 'PUERTA GIRATORIA: SILLÓN EN EL CONSEJO DEL IBEX 35',
    subtitle: 'RETRIBUCIÓN: 600.000 € ANUALES + BLINDAJE',
    verdict: 'Fichaje estrella como consejero independiente de empresa estratégica.',
  },
};

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  const status = useGameStore((state) => state.status);
  const characterProfile = useGameStore((state) => state.characterProfile);
  const stats = useGameStore((state) => state.stats);
  const currentNode = useGameStore((state) => state.currentNode);
  const history = useGameStore((state) => state.history);
  const unlockedMechanics = useGameStore((state) => state.unlockedMechanics);
  const evidenceDocuments = useGameStore((state) => state.evidenceDocuments);
  const ending = useGameStore((state) => state.ending);

  const startGame = useGameStore((state) => state.startGame);
  const makeChoice = useGameStore((state) => state.makeChoice);
  const restartGame = useGameStore((state) => state.restartGame);
  const resetToCharacterSelect = useGameStore((state) => state.resetToCharacterSelect);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar desajustes de hidratación antes del montaje del cliente
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

  const availableCharacters = Object.values(
    (rawStoryData.meta.characters ?? {}) as Record<string, CharacterProfile>
  );

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-black font-mono selection:bg-black selection:text-white p-3 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* ========================================================
            CABECERA GENERAL FANZINE / LOGOTIPO BRUTALISTA
           ======================================================== */}
        <header className="border-2 md:border-4 border-black bg-white p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-2 mb-3">
            <span className="bg-black text-white px-2 py-0.5 text-xs font-black uppercase tracking-widest">
              FANZINE DE LA CLEPTOCRACIA // VOL. 1
            </span>
            <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">
              DILIGENCIAS URGENTES // AUDIENCIA NACIONAL
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-1">
                IBEX-35 & PÚNICA
              </h1>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-700">
                Simulador de Saqueo, Puertas Giratorias y Cloacas del Estado
              </p>
            </div>

            <div className="border-2 border-black bg-stone-100 p-2 text-right text-[11px] font-bold uppercase rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div>ESTADO DE LA INSTRUCCIÓN:</div>
              <div className="font-black text-xs text-black">
                {status === 'NOT_STARTED' && 'SELECCIÓN DE IMPUTADOS'}
                {status === 'PLAYING' && 'EN PLENA LEGISLATURA'}
                {status === 'GAME_OVER' && 'SENTENCIA DICTADA'}
              </div>
            </div>
          </div>
        </header>

        {/* ========================================================
            ESTADO 1: NOT_STARTED (SELECCIÓN DE ARQUETIPO)
           ======================================================== */}
        {status === 'NOT_STARTED' && (
          <section
            aria-label="Selección de Arquetipo de Imputado"
            className="flex flex-col gap-6"
          >
            <div className="border-2 border-black bg-black text-white p-3 text-xs sm:text-sm font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              ★ PASO 1: SELECCIONA EL EXPEDIENTE DE TU PERSONAJE PARA INICIAR LA CAUSA
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCharacters.map((char) => (
                <div
                  key={char.id}
                  className="group relative flex flex-col justify-between border-2 md:border-3 border-black bg-white p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div>
                    {/* Encabezado de la Ficha Policial */}
                    <div className="flex items-center justify-between gap-1 border-b-2 border-black pb-2 mb-3">
                      <span className="text-[10px] font-black uppercase bg-stone-100 border border-black px-1.5 py-0.5">
                        {char.sphere}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-zinc-500">
                        EXP #{char.id.slice(0, 10)}
                      </span>
                    </div>

                    <h2 className="text-xl font-black uppercase tracking-tight text-black mb-2 leading-tight">
                      {char.name}
                    </h2>

                    <div className="text-xs italic text-zinc-700 bg-stone-50 border-l-2 border-black pl-2 py-1 mb-4">
                      "{char.realInspiration}"
                    </div>

                    {/* Resumen de Estadísticas Iniciales */}
                    <div className="border-t border-b border-black py-2 mb-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">
                        DOTACIÓN INICIAL DE RECURSOS:
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                        <div className="border border-black p-1 bg-stone-50">
                          <span className="text-[9px] block text-zinc-500 uppercase">PASTA EN B</span>
                          <span>{char.initialStats.pastaEnB}%</span>
                        </div>
                        <div className="border border-black p-1 bg-stone-50">
                          <span className="text-[9px] block text-zinc-500 uppercase">PRESIÓN UCO</span>
                          <span>{char.initialStats.presionJudicial}%</span>
                        </div>
                        <div className="border border-black p-1 bg-stone-50">
                          <span className="text-[9px] block text-zinc-500 uppercase">IMPUNIDAD</span>
                          <span>{char.initialStats.impunidad}%</span>
                        </div>
                        <div className="border border-black p-1 bg-stone-50">
                          <span className="text-[9px] block text-zinc-500 uppercase">PRENSA</span>
                          <span>{char.initialStats.reputacionMediatica}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-zinc-600 mb-4">
                      ★ Mecánicas desbloqueadas: <span className="font-bold text-black">{char.unlockedMechanics.length}</span>
                    </div>
                  </div>

                  {/* Botón de Sello de Toma de Posesión */}
                  <button
                    type="button"
                    onClick={() => startGame(char.id as ArchetypeId)}
                    className="w-full border-2 border-black bg-white group-hover:bg-black group-hover:text-white py-3 px-4 text-xs font-black uppercase tracking-widest transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-center"
                  >
                    [ ASUMIR CARGO // INICIAR ]
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            ESTADO 2: PLAYING (LEGISLATURA EN CURSO)
           ======================================================== */}
        {status === 'PLAYING' && (
          <section
            aria-label="Tablero de Juego Fanzine"
            className="flex flex-col gap-6"
          >
            {/* Barra Superior de Control de Turno */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-black bg-stone-100 p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2">
                <span className="bg-black text-white px-2 py-0.5 text-xs font-black uppercase tracking-wider">
                  EN ACTIVO
                </span>
                <span className="text-xs font-bold uppercase">
                  {characterProfile?.name ?? 'Imputado Anónimo'}
                </span>
                <span className="text-xs text-zinc-500">
                  ({history.length} decisiones tomadas)
                </span>
              </div>

              <button
                type="button"
                onClick={resetToCharacterSelect}
                className="border-2 border-black bg-white hover:bg-black hover:text-white px-3 py-1 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-colors"
              >
                [ CAMBIAR PERSONAJE ]
              </button>
            </div>

            {/* Barra de Estadísticas Brutalistas */}
            <StatsBar
              stats={stats}
              characterProfile={characterProfile}
              showCharacterBadge={false}
            />

            {/* Ficha Principal de Decisión y Sumario */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Columna Izquierda / Central: Tarjeta de Sumario y Decisiones */}
              <div className="lg:col-span-2">
                <DecisionCard
                  node={currentNode}
                  onSelectChoice={(choiceId) => makeChoice(choiceId)}
                />
              </div>

              {/* Columna Derecha: Expediente de Pruebas y Mecánicas */}
              <div className="flex flex-col gap-4">
                {/* Cuadro de Pruebas Incautadas */}
                <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                    <span className="text-xs font-black uppercase tracking-widest text-black">
                      PIEZAS DE CONVICCIÓN
                    </span>
                    <span className="text-[10px] bg-black text-white px-1.5 py-0.2 font-bold">
                      {evidenceDocuments.length}
                    </span>
                  </div>

                  {evidenceDocuments.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic">
                      Aún no constan documentos incautados en esta pieza del sumario.
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {evidenceDocuments.map((doc, idx) => (
                        <li
                          key={idx}
                          className="border border-black bg-stone-50 p-2 text-xs font-mono text-zinc-900 border-l-4 border-l-black"
                        >
                          <span className="font-bold text-[10px] text-zinc-500 block uppercase mb-0.5">
                            PRUEBA #{idx + 1}
                          </span>
                          "{doc}"
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Cuadro de Mecánicas Desbloqueadas */}
                <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                    <span className="text-xs font-black uppercase tracking-widest text-black">
                      MECÁNICAS ACTIVAS
                    </span>
                    <span className="text-[10px] bg-black text-white px-1.5 py-0.2 font-bold">
                      {unlockedMechanics.length}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {unlockedMechanics.map((id) => (
                      <span
                        key={id}
                        className="border border-black bg-stone-100 text-black px-2 py-0.5 text-xs font-bold"
                      >
                        #{id}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Diario Secreta de Sobresueldos (Historial reciente) */}
                {history.length > 0 && (
                  <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-2 mb-3">
                      LIBRETA DE APUNTES ({history.length})
                    </div>
                    <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                      {history.slice(-3).reverse().map((entry, idx) => (
                        <div
                          key={idx}
                          className="text-[11px] border border-black/30 p-2 bg-stone-50"
                        >
                          <div className="font-bold text-black uppercase mb-1">
                            ➔ {entry.choiceLabel}
                          </div>
                          <div className="text-[10px] text-zinc-600">
                            Pieza: {entry.nodeId}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            ESTADO 3: GAME_OVER (SENTENCIA JUDICIAL / EPÍLOGO)
           ======================================================== */}
        {status === 'GAME_OVER' && (
          <section
            aria-label="Sentencia Judicial y Fallo Definitivo"
            className="flex flex-col gap-6"
          >
            {/* Portada de Edición Extra de Prensa */}
            <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {/* Cinta de Alerta Judicial */}
              <div className="bg-black text-white p-2.5 text-center text-xs sm:text-sm font-black uppercase tracking-widest mb-6">
                ★★★ AUDIENCIA NACIONAL // FALLO JUDICIAL DEFINITIVO ★★★
              </div>

              {/* Dictamen */}
              {ending && ENDING_TITLES[ending] ? (
                <div className="mb-6 border-b-4 border-black pb-6">
                  <div className="text-xs font-black uppercase tracking-widest text-zinc-600 mb-1">
                    [ DICTAMEN DE LA CAUSA: {ending} ]
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-black leading-tight mb-2">
                    {ENDING_TITLES[ending].title}
                  </h2>
                  <div className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-3">
                    {ENDING_TITLES[ending].subtitle}
                  </div>
                  <p className="text-xs sm:text-sm italic bg-stone-100 border-l-4 border-black p-3 text-zinc-800">
                    "{ENDING_TITLES[ending].verdict}"
                  </p>
                </div>
              ) : (
                <div className="mb-6 border-b-4 border-black pb-6">
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mb-2">
                    {currentNode?.headline ?? 'CONCLUSIÓN DE LA PIEZA SEPARADA'}
                  </h2>
                </div>
              )}

              {/* Extracto de los Hechos Probados */}
              {currentNode?.context && (
                <div className="mb-6 font-mono text-sm leading-relaxed bg-[#faf8f5] p-4 border-2 border-black">
                  <div className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-1">
                    HECHOS PROBADOS EN LA INSTRUCCIÓN:
                  </div>
                  <p className="text-zinc-900">{currentNode.context}</p>
                </div>
              )}

              {/* Estadísticas de Liquidación Final */}
              <div className="mb-6">
                <div className="text-xs font-black uppercase tracking-widest text-black mb-2">
                  LIQUIDACIÓN FINAL DE PATRIMONIO E IMPUNIDAD:
                </div>
                <StatsBar stats={stats} characterProfile={characterProfile} showCharacterBadge={false} />
              </div>

              {/* Resumen de la Causa */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-2 border-black p-3 bg-stone-100 mb-6 text-center">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block font-bold">DECISIONES FIRMADAS</span>
                  <span className="text-lg font-black">{history.length}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block font-bold">PRUEBAS INCAUTADAS</span>
                  <span className="text-lg font-black">{evidenceDocuments.length}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block font-bold">MECÁNICAS EMPLEADAS</span>
                  <span className="text-lg font-black">{unlockedMechanics.length}</span>
                </div>
              </div>

              {/* Acciones de Reinicio / Cambio de Personaje */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={restartGame}
                  className="flex-1 border-2 border-black bg-black text-white hover:bg-zinc-800 py-3.5 px-4 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-center"
                >
                  [ REPETIR JUGADA CON ESTE IMPUTADO ]
                </button>

                <button
                  type="button"
                  onClick={resetToCharacterSelect}
                  className="flex-1 border-2 border-black bg-white hover:bg-black hover:text-white py-3.5 px-4 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-center transition-colors"
                >
                  [ CAMBIAR DE PERSONAJE // NUEVA CAUSA ]
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            PIE DE PÁGINA // SUMARIO COLECTIVO
           ======================================================== */}
        <footer className="border-t-2 border-black pt-4 pb-8 text-center text-xs font-mono text-zinc-600">
          <div className="font-bold uppercase tracking-wider mb-1">
            IBEX-35 & PÚNICA: FANZINE EDITION
          </div>
          <div className="text-[10px] uppercase">
            Cualquier parecido con autos de la Audiencia Nacional o escuchas de la UCO no es coincidencia.
          </div>
        </footer>
      </div>
    </main>
  );
}
