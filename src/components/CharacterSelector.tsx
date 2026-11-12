'use client';

import React, { useState } from 'react';
import { ArchetypeId, SphereType } from '../types/story';
import { useGameStore } from '../store/gameStore';
import reignsDeckData from '../content/reignsDeck.json';
import { CharacterPortrait } from './CharacterPortrait';
import { PRIVILEGES_REGISTRY, calculateAggregatedPerks } from '../config/privileges';

interface SphereConfig {
  key: SphereType;
  title: string;
  tagline: string;
  badge: string;
  archetypeIds: ArchetypeId[];
}

const SPHERES: SphereConfig[] = [
  {
    key: 'POLITICA',
    title: 'I. CLASE POLÍTICA & GOBIERNO',
    tagline: 'Cajas B, recalificaciones del PGOU, fondos reservados y puertas giratorias',
    badge: 'BOE // PARTIDO',
    archetypeIds: [
      'CUSTODIO_LIBRETA',
      'PROCONSUL_HORMIGON',
      'FONTANERO_INTERIOR',
      'PASANTE_GIRATORIO',
    ],
  },
  {
    key: 'ORDEN_JUSTICIA',
    title: 'II. FUERZAS DEL ORDEN & TOGAS',
    tagline: 'Extorsión con kompromat, jueces de trinchera, purgas y falsos sepelios',
    badge: 'AUDIENCIA // CLOACAS',
    archetypeIds: [
      'ARCHIVADOR_CLOACA',
      'ARQUITECTO_SOBRESEIMIENTO',
      'TAPON_INSTITUCIONAL',
      'DIFUNTO_CONVENIENCIA',
    ],
  },
  {
    key: 'EMPRESARIAL',
    title: 'III. OLIGARQUÍA & FINANCIADORES',
    tagline: 'Comisiones del 3%, la pizza al 30%, rescates del IBEX y blanqueo transnacional',
    badge: 'IBEX 35 // PATRONAL',
    archetypeIds: [
      'BARON_ENCOFRADO',
      'ALQUIMISTA_HORMIGONERA',
      'TAUMATURGO_AGUJERO',
      'LAVANDERO_TRANSNACIONAL',
    ],
  },
];

export function CharacterSelector() {
  const [activeSphere, setActiveSphere] = useState<SphereType>('POLITICA');
  const startReignsGame = useGameStore((state) => state.startReignsGame);

  const currentSphereConfig = SPHERES.find((s) => s.key === activeSphere) ?? SPHERES[0];
  const characters = reignsDeckData.characters as Record<
    string,
    {
      id: ArchetypeId;
      name: string;
      sphere: SphereType;
      realInspiration: string;
      description: string;
      initialStats: {
        pastaEnB: number;
        presionJudicial: number;
        impunidad: number;
        reputacionMediatica: number;
      };
      unlockedMechanics: number[];
    }
  >;

  return (
    <section className="w-full max-w-5xl mx-auto p-4 font-mono">
      {/* Encabezado Fanzine */}
      <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6 -rotate-0.5">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-black text-white px-2 py-0.5 text-xs font-black uppercase tracking-widest">
            EXPEDIENTE GENERAL // SELECCIÓN DE IMPUTADO
          </span>
          <span className="text-xs uppercase font-bold text-zinc-600 hidden sm:inline">
            Elige a tu imputado y afianza tus contactos
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black uppercase text-black tracking-tight leading-none mb-3">
          ¿QUIÉN MANEJARÁ EL COTARRO HOY?
        </h1>
        <p className="text-sm text-zinc-800 leading-relaxed max-w-3xl">
          Elige tu poltrona en el banquillo. Tienes 25 trimestres para forrarte, amparar a tus amigos y saltar a un consejo de administración del IBEX 35 antes de que la Guardia Civil te reviente la puerta al amanecer. Desliza ante cada dilema y no dejes que tus cuatro barras toquen fondo ni se desborden de avaricia.
        </p>
      </div>

      {/* Pestañas de las 3 Esferas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
        {SPHERES.map((sphere) => {
          const isActive = sphere.key === activeSphere;
          return (
            <button
              key={sphere.key}
              type="button"
              onClick={() => setActiveSphere(sphere.key)}
              className={`border-3 border-black p-3.5 text-left transition-all ${
                isActive
                  ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-0.5 translate-y-0.5'
                  : 'bg-white text-black hover:bg-stone-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">
                {sphere.badge}
              </div>
              <div className="text-sm font-black uppercase leading-tight">{sphere.title}</div>
            </button>
          );
        })}
      </div>

      {/* Subtítulo de la Esfera Activa */}
      <div className="border-2 border-black bg-stone-100 p-3 mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <span className="text-xs font-black uppercase text-black block mb-0.5">
          ESFERA: {currentSphereConfig.title}
        </span>
        <p className="text-xs text-zinc-700 italic">{currentSphereConfig.tagline}</p>
      </div>

      {/* Grid de los 4 Subtipos / Arquetipos de la Esfera */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {currentSphereConfig.archetypeIds.map((archetypeId) => {
          const char = characters[archetypeId];
          if (!char) return null;

          const perks = calculateAggregatedPerks(char.unlockedMechanics);

          return (
            <article
              key={char.id}
              className="border-3 border-black bg-[#faf8f5] p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between hover:-translate-y-0.5 transition-transform"
            >
              <div>
                <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                  <span className="text-[11px] font-black uppercase bg-stone-200 px-2 py-0.5 border border-black truncate max-w-[200px]">
                    PIEZA: {char.name}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-600 uppercase">
                    {char.unlockedMechanics.length} PRIVILEGIOS DE POLTRONA
                  </span>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <CharacterPortrait
                    archetypeId={char.id}
                    alt={char.name}
                    size="md"
                    className="shrink-0"
                  />
                  <div>
                    <h2 className="text-lg sm:text-xl font-black uppercase text-black leading-tight mb-1">
                      {char.name}
                    </h2>
                    <div className="text-xs text-red-800 font-bold italic">
                      Inspiración: {char.realInspiration}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-zinc-800 leading-relaxed mb-4 bg-white/60 p-2.5 border-l-3 border-black">
                  {char.description}
                </p>

                {/* Métricas Iniciales */}
                <div className="border-2 border-black bg-white p-3 mb-3 text-xs">
                  <div className="font-black uppercase text-[10px] text-zinc-600 mb-2 border-b border-zinc-200 pb-1">
                    ESTADÍSTICAS INICIALES DEL MANDATO:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="font-bold text-zinc-700">Pasta en B:</span>{' '}
                      <span className="font-black">{char.initialStats.pastaEnB}%</span>
                    </div>
                    <div>
                      <span className="font-bold text-zinc-700">Presión Judicial:</span>{' '}
                      <span className="font-black">{char.initialStats.presionJudicial}%</span>
                    </div>
                    <div>
                      <span className="font-bold text-zinc-700">Impunidad:</span>{' '}
                      <span className="font-black">{char.initialStats.impunidad}%</span>
                    </div>
                    <div>
                      <span className="font-bold text-zinc-700">Reputación:</span>{' '}
                      <span className="font-black">{char.initialStats.reputacionMediatica}%</span>
                    </div>
                  </div>
                </div>

                {/* Privilegios de Poltrona y Efecto en Tiradas de Dados */}
                <div className="border-2 border-black bg-amber-50/70 p-3 mb-4 text-xs">
                  <div className="font-black uppercase text-[10px] text-black mb-1.5 flex items-center justify-between border-b border-black/20 pb-1">
                    <span>⚡ VENTAJAS EN TIRADAS DE DADOS:</span>
                    <span className="bg-black text-white px-1.5 py-0.2 text-[9px]">ACTIVO</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-2 text-[10px] font-bold">
                    {perks.presionJudicialDiscount > 0 && (
                      <span className="border border-black bg-white px-1.5 py-0.5 text-emerald-900">
                        🛡️ -{perks.presionJudicialDiscount}% Presión UCO
                      </span>
                    )}
                    {perks.pastaEnBBonus > 0 && (
                      <span className="border border-black bg-white px-1.5 py-0.5 text-emerald-900">
                        💰 +{perks.pastaEnBBonus}% Mordidas B
                      </span>
                    )}
                    {perks.reputacionShield > 0 && (
                      <span className="border border-black bg-white px-1.5 py-0.5 text-emerald-900">
                        📰 -{perks.reputacionShield}% Daño Prensa
                      </span>
                    )}
                    {perks.impunidadShield > 0 && (
                      <span className="border border-black bg-white px-1.5 py-0.5 text-emerald-900">
                        ⚖️ -{perks.impunidadShield}% Caída Impunidad
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {char.unlockedMechanics.map((mId) => {
                      const priv = PRIVILEGES_REGISTRY[mId];
                      if (!priv) return null;
                      return (
                        <span
                          key={mId}
                          title={`${priv.description} (${priv.inGameEffect})`}
                          className="text-[10px] border border-black/40 bg-white/80 px-1.5 py-0.5 text-zinc-800"
                        >
                          • {priv.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Botón de Inicio de Partida */}
              <button
                type="button"
                onClick={() => startReignsGame(char.id)}
                className="w-full border-3 border-black bg-black text-white hover:bg-zinc-800 active:translate-x-0.5 active:translate-y-0.5 py-3 px-4 font-black uppercase text-sm tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
              >
                ★ TOMAR POSESIÓN DEL CARGO ★
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default CharacterSelector;
