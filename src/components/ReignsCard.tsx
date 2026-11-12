'use client';

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ReignsCard as ReignsCardType } from '../types/story';
import { CharacterAvatar } from './avatars/CharacterAvatar';

export interface ReignsCardProps {
  card?: ReignsCardType | null;
  className?: string;
  disabled?: boolean;
}

export function ReignsCard({
  card: propCard,
  className = '',
  disabled = false,
}: ReignsCardProps) {
  const storeCard = useGameStore((state) => state.currentReignsCard);
  const makeReignsChoice = useGameStore((state) => state.makeReignsChoice);
  const setPreviewDirection = useGameStore((state) => state.setPreviewDirection);

  const card = propCard ?? storeCard;

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const leftStampOpacity = useTransform(x, [-120, -30, 0], [1, 0.4, 0]);
  const rightStampOpacity = useTransform(x, [0, 30, 120], [0, 0.4, 1]);

  const [exitX, setExitX] = useState<number | null>(null);

  // Atajos de teclado (← y → o A / D)
  useEffect(() => {
    if (disabled || !card) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        triggerChoice('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        triggerChoice('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [card, disabled]);

  const triggerChoice = (direction: 'left' | 'right') => {
    if (disabled || !card) return;
    setExitX(direction === 'left' ? -350 : 350);
    setTimeout(() => {
      makeReignsChoice(direction);
      setExitX(null);
      x.set(0);
      setPreviewDirection(null);
    }, 180);
  };

  const handleDrag = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -25) {
      setPreviewDirection('left');
    } else if (info.offset.x > 25) {
      setPreviewDirection('right');
    } else {
      setPreviewDirection(null);
    }
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 90;
    if (info.offset.x < -threshold) {
      triggerChoice('left');
    } else if (info.offset.x > threshold) {
      triggerChoice('right');
    } else {
      setPreviewDirection(null);
    }
  };

  if (!card) {
    return (
      <div className="border-4 border-black bg-stone-100 p-8 font-mono text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-1">
        <p className="font-bold uppercase tracking-wider text-base">
          [ NO QUEDAN CAUSAS PENDIENTES EN EL SUMARIO ]
        </p>
      </div>
    );
  }

  // Detección de cartas de crisis o alerta procesal
  const isCrisis =
    card.id.toLowerCase().includes('crisis') ||
    card.headline.toLowerCase().includes('registro') ||
    card.headline.toLowerCase().includes('bancarrota') ||
    card.headline.toLowerCase().includes('suplicatorio') ||
    card.headline.toLowerCase().includes('portada dominical');

  let crisisType: 'judicial' | 'pasta' | 'impunidad' | 'prensa' | undefined;
  if (isCrisis) {
    if (card.headline.toLowerCase().includes('registro')) crisisType = 'judicial';
    else if (card.headline.toLowerCase().includes('bancarrota')) crisisType = 'pasta';
    else if (card.headline.toLowerCase().includes('suplicatorio')) crisisType = 'impunidad';
    else crisisType = 'prensa';
  }

  return (
    <div className={`w-full max-w-xl mx-auto flex flex-col items-center ${className}`}>
      {/* Contenedor Draggable con Framer Motion */}
      <div className="relative w-full min-h-[420px] flex items-center justify-center p-2">
        <motion.article
          key={card.id}
          style={{ x, rotate }}
          drag={disabled ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={exitX !== null ? { x: exitX, opacity: 0 } : { x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className={`w-full relative cursor-grab active:cursor-grabbing select-none border-4 ${
            isCrisis
              ? 'border-red-700 bg-red-50/30 shadow-[6px_6px_0px_0px_rgba(185,28,28,1)]'
              : 'border-black bg-[#faf8f4] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
          } p-5 sm:p-7 -rotate-1`}
        >
          {/* Alerta de Crisis Procesal en Cabecera de la Tarjeta */}
          {isCrisis && (
            <div className="border-2 border-red-700 bg-red-700 text-white font-mono font-black text-[10px] sm:text-xs uppercase px-2.5 py-1 tracking-widest flex items-center justify-between mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-pulse">
              <span>🚨 ALERTA PROCESAL // PIEZA SEPARADA URGENTE</span>
              <span className="bg-black text-white px-1.5 py-0.2">ART. 384 BIS</span>
            </div>
          )}

          {/* Sellos de Caucho Flotantes con Opacidad Proporcional al Desplazamiento */}
          <motion.div
            style={{ opacity: leftStampOpacity }}
            className="pointer-events-none absolute top-4 left-4 right-4 z-20 flex flex-col items-start gap-1"
          >
            <div className="border-4 border-red-700 bg-red-100/95 text-red-800 px-3 py-1 font-mono font-black text-lg sm:text-2xl uppercase tracking-widest -rotate-6 shadow-[3px_3px_0px_0px_rgba(185,28,28,1)]">
              {card.leftChoice.stampText || 'ACEPTAR'}
            </div>
            <div className="border-2 border-black bg-white text-black p-2 font-mono text-xs sm:text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] max-w-md">
              {card.leftChoice.label}
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: rightStampOpacity }}
            className="pointer-events-none absolute top-4 right-4 left-4 z-20 flex flex-col items-end gap-1"
          >
            <div className="border-4 border-black bg-yellow-200/95 text-black px-3 py-1 font-mono font-black text-lg sm:text-2xl uppercase tracking-widest rotate-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              {card.rightChoice.stampText || 'RECHAZAR'}
            </div>
            <div className="border-2 border-black bg-white text-black p-2 font-mono text-xs sm:text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] max-w-md text-right">
              {card.rightChoice.label}
            </div>
          </motion.div>

          {/* Membrete Oficial, Avatar Satírico y Emisor */}
          <header className="border-b-2 border-black pb-3 mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CharacterAvatar
                speaker={card.speaker}
                speakerRole={card.speakerRole}
                isCrisis={isCrisis}
                crisisType={crisisType}
                className="shrink-0"
              />
              <div>
                <div className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-600">
                  AUDIENCIA NACIONAL // SUMARIO
                </div>
                <h3 className="text-base sm:text-lg font-mono font-black uppercase text-black leading-tight">
                  {card.speaker}
                </h3>
                <div className="text-xs font-mono text-zinc-700 font-bold uppercase">
                  {card.speakerRole}
                </div>
              </div>
            </div>

            <div className="border border-black bg-stone-200 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider self-start shrink-0">
              {card.sphere}
            </div>
          </header>

          {/* Titular del Dilema */}
          <h2 className="text-lg sm:text-xl font-mono font-black uppercase text-black leading-tight mb-3">
            {card.headline}
          </h2>

          {/* Narración Fanzine del Hecho */}
          <div className="font-mono text-sm leading-relaxed text-black/90 mb-4 bg-white/70 p-3.5 border-l-4 border-black">
            {card.context}
          </div>

          {/* Pieza de Convicción Intervenida */}
          {card.evidenceDocument && (
            <div className="border-2 border-dashed border-black bg-amber-50 p-2.5 mb-4 text-xs font-mono">
              <span className="font-black uppercase tracking-wider block text-[10px] text-zinc-600 mb-0.5">
                📎 PIEZA DE CONVICCIÓN INCAUTADA:
              </span>
              <p className="italic text-zinc-800">"{card.evidenceDocument}"</p>
            </div>
          )}

          {/* Cita de Sumario / Escucha Telefónica en juego */}
          <footer className="border-t-2 border-black pt-2 text-[11px] font-mono text-zinc-600 italic">
            💡 Desliza hacia la izquierda o derecha para decidir
          </footer>
        </motion.article>
      </div>

      {/* Botones Físicos y Accesibles para Móvil y Teclado */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {/* Opción Izquierda */}
        <button
          type="button"
          onClick={() => triggerChoice('left')}
          onMouseEnter={() => setPreviewDirection('left')}
          onMouseLeave={() => setPreviewDirection(null)}
          disabled={disabled}
          className="group border-3 border-black bg-white hover:bg-stone-50 active:translate-x-0.5 active:translate-y-0.5 p-3.5 text-left font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-black uppercase text-red-700 tracking-wider">
              ← [ {card.leftChoice.stampText} ]
            </span>
            <span className="text-[10px] border border-black px-1.5 py-0.5 bg-stone-100 font-bold uppercase hidden sm:inline">
              Tecla: ← / A
            </span>
          </div>
          <p className="text-sm font-bold text-black leading-snug">
            {card.leftChoice.label}
          </p>
          {card.leftChoice.flavorQuote && (
            <div className="mt-2 border-l-3 border-red-700 bg-red-50/40 pl-2 py-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-red-800 block mb-0.5">
                🎙️ AUDIO UCO INTERVENIDO:
              </span>
              <p className="text-xs text-zinc-800 italic leading-snug">
                "{card.leftChoice.flavorQuote}"
              </p>
            </div>
          )}
        </button>

        {/* Opción Derecha */}
        <button
          type="button"
          onClick={() => triggerChoice('right')}
          onMouseEnter={() => setPreviewDirection('right')}
          onMouseLeave={() => setPreviewDirection(null)}
          disabled={disabled}
          className="group border-3 border-black bg-white hover:bg-stone-50 active:translate-x-0.5 active:translate-y-0.5 p-3.5 text-left font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-black uppercase text-black tracking-wider">
              [ {card.rightChoice.stampText} ] →
            </span>
            <span className="text-[10px] border border-black px-1.5 py-0.5 bg-stone-100 font-bold uppercase hidden sm:inline">
              Tecla: → / D
            </span>
          </div>
          <p className="text-sm font-bold text-black leading-snug">
            {card.rightChoice.label}
          </p>
          {card.rightChoice.flavorQuote && (
            <div className="mt-2 border-l-3 border-black bg-stone-100/70 pl-2 py-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-zinc-800 block mb-0.5">
                🎙️ AUDIO UCO INTERVENIDO:
              </span>
              <p className="text-xs text-zinc-800 italic leading-snug">
                "{card.rightChoice.flavorQuote}"
              </p>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

export default ReignsCard;
