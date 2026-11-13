'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ReignsCard as ReignsCardType } from '../types/story';
import { CharacterPortrait } from './CharacterPortrait';
import { resolveRecurringCharacter } from '../utils/recurringCharacters';
import { soundManager } from '../utils/soundEffects';

export interface ReignsCardProps {
  card?: ReignsCardType | null;
  className?: string;
  disabled?: boolean;
}

/**
 * Dado Fanzine Brutalista en Blanco y Negro (Caras 1 a 6)
 */
export function FanzineDieFace({ face, size = 32 }: { face: number; size?: number }) {
  const dots: Record<number, Array<[number, number]>> = {
    1: [[50, 50]],
    2: [
      [28, 28],
      [72, 72],
    ],
    3: [
      [25, 25],
      [50, 50],
      [75, 75],
    ],
    4: [
      [28, 28],
      [72, 28],
      [28, 72],
      [72, 72],
    ],
    5: [
      [25, 25],
      [75, 25],
      [50, 50],
      [25, 75],
      [75, 75],
    ],
    6: [
      [28, 24],
      [72, 24],
      [28, 50],
      [72, 50],
      [28, 76],
      [72, 76],
    ],
  };

  const pips = dots[Math.max(1, Math.min(6, face))] ?? dots[1];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="inline-block shrink-0 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#121a12]"
      aria-label={`Dado cara ${face}`}
    >
      <rect x="2" y="2" width="96" height="96" fill="#ffffff" stroke="#000000" strokeWidth="6" />
      {pips.map(([cx, cy], idx) => (
        <circle key={idx} cx={cx} cy={cy} r="10" fill="#000000" />
      ))}
    </svg>
  );
}

export function ReignsCard({
  card: propCard,
  className = '',
  disabled = false,
}: ReignsCardProps) {
  const storeCard = useGameStore((state) => state.currentReignsCard);
  const makeReignsChoice = useGameStore((state) => state.makeReignsChoice);
  const previewDirection = useGameStore((state) => state.previewDirection);
  const setPreviewDirection = useGameStore((state) => state.setPreviewDirection);
  const lastDiceRoll = useGameStore((state) => state.lastDiceRoll);
  const clearLastDiceRoll = useGameStore((state) => state.clearLastDiceRoll);

  const card = propCard ?? storeCard;

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-180, 0, 180], [-14, 0, 14]);

  // Umbral sensible para móvil: a 8px empieza a verse el sello, a 45px es 100% nítido
  const leftStampOpacity = useTransform(x, [-45, -8, 0], [1, 0.6, 0]);
  const rightStampOpacity = useTransform(x, [0, 8, 45], [0, 0.6, 1]);

  const leftStampX = useTransform(x, [-150, 0], [20, 0]);
  const rightStampX = useTransform(x, [0, 150], [0, -20]);

  const [exitX, setExitX] = useState<number | null>(null);
  const swipeSoundPlayedRef = useRef(false);

  // Detección de cartas de crisis o alerta procesal
  const isCrisis = Boolean(
    card &&
      (Boolean(card.isInExtremis) ||
        card.id.toLowerCase().includes('crisis') ||
        card.headline.toLowerCase().includes('registro') ||
        card.headline.toLowerCase().includes('bancarrota') ||
        card.headline.toLowerCase().includes('suplicatorio') ||
        card.headline.toLowerCase().includes('portada dominical'))
  );

  // Micro-aviso fugaz del dado D6 sin bloquear la partida (auto-limpieza en 850ms)
  useEffect(() => {
    if (!lastDiceRoll) return;
    soundManager.playDiceRoll();
    const timer = setTimeout(() => {
      clearLastDiceRoll();
    }, 850);
    return () => clearTimeout(timer);
  }, [lastDiceRoll, clearLastDiceRoll]);

  // Efecto de sonido cuando entra una carta de crisis o in extremis
  useEffect(() => {
    if (isCrisis || card?.isInExtremis) {
      soundManager.playCrisisAlert();
    }
  }, [card?.id, isCrisis, card?.isInExtremis]);

  // Atajos de teclado instantáneos (sin modal que bloquee el flujo)
  useEffect(() => {
    if (disabled || !card) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setPreviewDirection('left');
        triggerChoice('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setPreviewDirection('right');
        triggerChoice('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [card, disabled]);

  const triggerChoice = (direction: 'left' | 'right') => {
    if (disabled || !card) return;
    soundManager.playStampImpact(direction === 'left');
    setExitX(direction === 'left' ? -350 : 350);
    setTimeout(() => {
      makeReignsChoice(direction);
      setExitX(null);
      x.set(0);
      setPreviewDirection(null);
      swipeSoundPlayedRef.current = false;
    }, 170);
  };

  const handleDrag = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -12) {
      if (!swipeSoundPlayedRef.current) {
        soundManager.playPaperSwipe();
        swipeSoundPlayedRef.current = true;
      }
      setPreviewDirection('left');
    } else if (info.offset.x > 12) {
      if (!swipeSoundPlayedRef.current) {
        soundManager.playPaperSwipe();
        swipeSoundPlayedRef.current = true;
      }
      setPreviewDirection('right');
    } else {
      setPreviewDirection(null);
      swipeSoundPlayedRef.current = false;
    }
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    swipeSoundPlayedRef.current = false;
    const threshold = 70;
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
      <div className="border-4 border-[#121a12] bg-[#f4efdc] p-6 font-mono text-center shadow-[6px_6px_0px_0px_#121a12] -rotate-1">
        <p className="font-bold uppercase tracking-wider text-sm text-zinc-900">
          [ NO QUEDAN CAUSAS PENDIENTES EN EL SUMARIO ]
        </p>
      </div>
    );
  }

  let crisisType: 'judicial' | 'pasta' | 'impunidad' | 'prensa' | undefined;
  if (isCrisis) {
    if (card.headline.toLowerCase().includes('registro')) crisisType = 'judicial';
    else if (card.headline.toLowerCase().includes('bancarrota')) crisisType = 'pasta';
    else if (card.headline.toLowerCase().includes('suplicatorio')) crisisType = 'impunidad';
    else crisisType = 'prensa';
  }

  const recurringChar = resolveRecurringCharacter(
    card.speaker,
    card.speakerRole,
    card.sphere
  );

  return (
    <div className={`w-full max-w-[360px] sm:max-w-[380px] mx-auto flex flex-col items-center relative ${className}`}>
      {/* Micro-dado fugaz no bloqueante en esquina tras resolver un swipe */}
      {lastDiceRoll && lastDiceRoll.rolls[0] && (
        <div
          aria-live="polite"
          className="pointer-events-none absolute -top-2 right-2 z-40 flex items-center gap-1.5 border-2 border-black bg-white px-2 py-1 shadow-[3px_3px_0px_0px_#121a12] animate-in fade-in zoom-in-95 duration-150"
        >
          <FanzineDieFace face={lastDiceRoll.rolls[0].diceFace} size={22} />
          <span className="text-[10px] font-mono font-black uppercase text-black">
            [{lastDiceRoll.stampText}]
          </span>
        </div>
      )}

      {/* HUD Superior Compacto: Decisión Emergente al Inclinar (sin spoiler de riesgo) */}
      <div className="w-full mb-1.5">
        <div
          className={`w-full min-h-[44px] border-2 border-[#121a12] px-2.5 py-1.5 font-mono text-center shadow-[3px_3px_0px_0px_#121a12] transition-colors duration-150 flex items-center justify-center ${
            previewDirection === 'left'
              ? 'bg-red-800 text-white border-red-950'
              : previewDirection === 'right'
              ? 'bg-amber-300 text-black border-amber-950'
              : 'bg-[#ede6cf]/90 text-zinc-800 border-black/70'
          }`}
        >
          {previewDirection === 'left' ? (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="bg-black text-white px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider border border-white shrink-0">
                ← {card.leftChoice.stampText || 'ACEPTAR'}
              </span>
              <span className="text-xs font-black uppercase leading-snug">
                {card.leftChoice.label}
              </span>
            </div>
          ) : previewDirection === 'right' ? (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase leading-snug">
                {card.rightChoice.label}
              </span>
              <span className="bg-black text-amber-300 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider border border-black shrink-0">
                {card.rightChoice.stampText || 'RECHAZAR'} →
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full text-[10px] font-bold text-zinc-700 uppercase tracking-wider">
              <span className="text-red-800 font-black">← Izquierda</span>
              <span className="text-zinc-600 hidden sm:inline">Desliza o usa [← / →]</span>
              <span className="text-amber-900 font-black">Derecha →</span>
            </div>
          )}
        </div>
      </div>

      {/* Pila Física de Cartas + Contenedor Draggable */}
      <div className="relative w-full flex items-center justify-center py-1">
        {/* Carta trasera asomando debajo para sensación física de mazo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-2 top-2 bottom-0 border-4 border-[#121a12] bg-[#e5ddc2] shadow-[4px_4px_0px_0px_#121a12] rotate-2 scale-[0.97]"
        />

        <motion.article
          key={card.id}
          style={{ x, rotate, transformOrigin: '50% 120%' }}
          drag={disabled ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.65}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={exitX !== null ? { x: exitX, opacity: 0 } : { x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className={`w-full min-h-[340px] sm:min-h-[370px] flex flex-col justify-between relative z-10 cursor-grab active:cursor-grabbing select-none border-4 ${
            card.isInExtremis
              ? 'border-red-900 bg-[#fff5f5] ring-3 ring-yellow-400 shadow-[6px_6px_0px_0px_#900]'
              : isCrisis
              ? 'border-red-800 bg-[#fcedec] shadow-[6px_6px_0px_0px_#822222]'
              : 'border-[#121a12] bg-[#f5efdc] shadow-[6px_6px_0px_0px_#121a12]'
          } p-4 sm:p-5 -rotate-1`}
        >
          {/* Mancha sutil de moho */}
          <div className="pointer-events-none absolute inset-0 moho-corner" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 moho-bottom" />

          {/* Precinto de Crisis o Bala de Plata */}
          {card.isInExtremis ? (
            <div className="border-2 border-black bg-yellow-400 text-black font-mono font-black text-[10px] sm:text-xs uppercase py-1 px-2 tracking-wider text-center mb-2.5 shadow-[2px_2px_0px_0px_#000] animate-pulse">
              🚨 RATA ACORRALADA: ÚLTIMA BALA 🚨
            </div>
          ) : isCrisis ? (
            <div className="border-2 border-red-900 bg-red-700 text-white font-mono font-black text-[10px] uppercase px-2 py-0.5 tracking-widest flex items-center justify-between mb-2.5">
              <span>🚨 ALERTA PROCESAL</span>
              <span>URGENTE</span>
            </div>
          ) : null}

          {/* Sellos de Caucho Flotantes sobre la carta al inclinar */}
          <motion.div
            style={{ opacity: leftStampOpacity, x: leftStampX }}
            className="pointer-events-none absolute top-3 left-3 z-30 flex flex-col items-start gap-1 max-w-[80%]"
          >
            <div className="border-3 border-red-800 bg-red-600/95 text-white px-2.5 py-0.5 font-mono font-black text-sm sm:text-base uppercase tracking-widest -rotate-6 shadow-[3px_3px_0px_0px_#121a12]">
              {card.leftChoice.stampText || 'ACEPTAR'}
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: rightStampOpacity, x: rightStampX }}
            className="pointer-events-none absolute top-3 right-3 z-30 flex flex-col items-end gap-1 max-w-[80%]"
          >
            <div className="border-3 border-amber-950 bg-amber-400/95 text-black px-2.5 py-0.5 font-mono font-black text-sm sm:text-base uppercase tracking-widest rotate-6 shadow-[3px_3px_0px_0px_#121a12]">
              {card.rightChoice.stampText || 'RECHAZAR'}
            </div>
          </motion.div>

          {/* Cabecera vertical de naipe: rol, nombre, retrato centrado y titular completo */}
          <header className="flex flex-col items-center text-center gap-2 border-b-2 border-[#121a12] pb-2.5 mb-2.5 relative z-10">
            <div className="w-full flex items-center justify-between gap-2 text-[10px] font-mono font-black uppercase tracking-widest text-zinc-600">
              <span>{recurringChar.role}</span>
              <span className="text-black">{recurringChar.name}</span>
            </div>

            <div className="w-full py-1.5 bg-[#ece6d0]/80 border-2 border-[#121a12] flex items-center justify-center">
              <CharacterPortrait
                src={card.portraitUrl ?? recurringChar.portraitUrl}
                speaker={recurringChar.name}
                speakerRole={recurringChar.role}
                alt={recurringChar.name}
                isCrisis={isCrisis}
                crisisType={crisisType}
                size="lg"
                className="shrink-0"
              />
            </div>

            <h3 className="text-xs sm:text-sm font-mono font-black uppercase text-black leading-snug">
              {card.headline}
            </h3>
          </header>

          {/* Dilema directo */}
          <div className="font-mono text-xs sm:text-sm leading-snug text-black/95 bg-white/85 p-3 border-l-4 border-[#121a12] relative z-10">
            {card.context}
          </div>
        </motion.article>
      </div>

      {/* Botones Táctiles Compactos (sin citas largas ni etiquetas RPG) */}
      <div className="w-full grid grid-cols-2 gap-2 mt-2.5">
        <button
          type="button"
          onClick={() => triggerChoice('left')}
          onMouseEnter={() => setPreviewDirection('left')}
          onMouseLeave={() => setPreviewDirection(null)}
          onFocus={() => setPreviewDirection('left')}
          onBlur={() => setPreviewDirection(null)}
          disabled={disabled}
          className={`border-2 p-2 sm:p-2.5 text-left font-mono transition-all cursor-pointer flex flex-col justify-between disabled:opacity-50 ${
            previewDirection === 'left'
              ? 'border-red-800 bg-red-100 shadow-[4px_4px_0px_0px_#822222] translate-x-0.5 translate-y-0.5'
              : 'border-[#121a12] bg-[#fbf9f0] hover:bg-red-50/60 shadow-[3px_3px_0px_0px_#121a12]'
          }`}
        >
          <span className="text-[10px] font-black uppercase text-red-800 tracking-wider block mb-0.5">
            ← [ {card.leftChoice.stampText} ]
          </span>
          <p className="text-[11px] sm:text-xs font-bold text-black leading-snug">
            {card.leftChoice.label}
          </p>
        </button>

        <button
          type="button"
          onClick={() => triggerChoice('right')}
          onMouseEnter={() => setPreviewDirection('right')}
          onMouseLeave={() => setPreviewDirection(null)}
          onFocus={() => setPreviewDirection('right')}
          onBlur={() => setPreviewDirection(null)}
          disabled={disabled}
          className={`border-2 p-2 sm:p-2.5 text-right font-mono transition-all cursor-pointer flex flex-col justify-between disabled:opacity-50 ${
            previewDirection === 'right'
              ? 'border-amber-950 bg-amber-100 shadow-[4px_4px_0px_0px_#121a12] translate-x-0.5 translate-y-0.5'
              : 'border-[#121a12] bg-[#fbf9f0] hover:bg-amber-50/60 shadow-[3px_3px_0px_0px_#121a12]'
          }`}
        >
          <span className="text-[10px] font-black uppercase text-black tracking-wider block mb-0.5">
            [ {card.rightChoice.stampText} ] →
          </span>
          <p className="text-[11px] sm:text-xs font-bold text-black leading-snug">
            {card.rightChoice.label}
          </p>
        </button>
      </div>
    </div>
  );
}

export default ReignsCard;
