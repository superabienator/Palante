'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ReignsCard as ReignsCardType } from '../types/story';
import { CharacterPortrait } from './CharacterPortrait';
import { PRIVILEGES_REGISTRY } from '../config/privileges';

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
      className="inline-block shrink-0 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
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
  const setPreviewDirection = useGameStore((state) => state.setPreviewDirection);
  const lastDiceRoll = useGameStore((state) => state.lastDiceRoll);
  const clearLastDiceRoll = useGameStore((state) => state.clearLastDiceRoll);

  const card = propCard ?? storeCard;

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const leftStampOpacity = useTransform(x, [-120, -30, 0], [1, 0.4, 0]);
  const rightStampOpacity = useTransform(x, [0, 30, 120], [0, 0.4, 1]);

  const [exitX, setExitX] = useState<number | null>(null);

  const isDiceModalOpen = Boolean(lastDiceRoll);

  // Atajos de teclado:
  // - Si la ventana emergente de dados está abierta: Enter, Espacio o Escape la cierran ("Siguiente").
  // - Si está cerrada: ←/A y →/D toman decisión sobre la carta activa.
  useEffect(() => {
    if (disabled || !card) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDiceModalOpen) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          e.preventDefault();
          clearLastDiceRoll();
        }
        return;
      }

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
  }, [card, disabled, isDiceModalOpen]);

  const triggerChoice = (direction: 'left' | 'right') => {
    if (disabled || !card || isDiceModalOpen) return;
    setExitX(direction === 'left' ? -350 : 350);
    setTimeout(() => {
      makeReignsChoice(direction);
      setExitX(null);
      x.set(0);
      setPreviewDirection(null);
    }, 180);
  };

  const handleDrag = (_: unknown, info: PanInfo) => {
    if (isDiceModalOpen) return;
    if (info.offset.x < -25) {
      setPreviewDirection('left');
    } else if (info.offset.x > 25) {
      setPreviewDirection('right');
    } else {
      setPreviewDirection(null);
    }
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (isDiceModalOpen) return;
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

  const leftPrivilegeUnlock = card.leftChoice.mechanicId
    ? PRIVILEGES_REGISTRY[card.leftChoice.mechanicId]
    : undefined;
  const rightPrivilegeUnlock = card.rightChoice.mechanicId
    ? PRIVILEGES_REGISTRY[card.rightChoice.mechanicId]
    : undefined;

  const newlyUnlockedPrivilege = lastDiceRoll?.unlockedPrivilegeId
    ? PRIVILEGES_REGISTRY[lastDiceRoll.unlockedPrivilegeId]
    : undefined;

  return (
    <div className={`w-full max-w-xl mx-auto flex flex-col items-center relative ${className}`}>
      {/* =====================================================================
          VENTANA EMERGENTE (MODAL) DE EXPLICACIÓN DE LA TIRADA DE DADOS
          Permanece abierta hasta que el jugador pulse "Siguiente" o "Cerrar"
         ===================================================================== */}
      <AnimatePresence>
        {lastDiceRoll && (
          <motion.div
            key={lastDiceRoll.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-mono"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dice-roll-modal-title"
          >
            <motion.div
              initial={{ scale: 0.88, y: 24, rotate: -1 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.92, y: 12, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="w-full max-w-lg border-4 border-black bg-[#faf8f4] p-5 sm:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto"
            >
              {/* Cabecera de la Ventana Emergente con Botón Cerrar */}
              <div className="flex items-center justify-between gap-2 border-b-3 border-black pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <motion.div
                    initial={{ rotate: -540, scale: 0.3 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                  >
                    <FanzineDieFace
                      face={lastDiceRoll.rolls[0]?.diceFace ?? 6}
                      size={36}
                    />
                  </motion.div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 block">
                      ACTA DE FORTUNA // RESOLUCIÓN DE DADOS
                    </span>
                    <h3
                      id="dice-roll-modal-title"
                      className="text-base sm:text-lg font-black uppercase text-black leading-tight"
                    >
                      SELLO APLICADO: [{lastDiceRoll.stampText}]
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={clearLastDiceRoll}
                  aria-label="Cerrar ventana de tirada de dados"
                  className="border-2 border-black bg-white hover:bg-black hover:text-white px-2.5 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-colors"
                >
                  ✕ CERRAR
                </button>
              </div>

              {/* Resumen de la Decisión Ejecutada */}
              {lastDiceRoll.choiceLabel && (
                <div className="border-2 border-black bg-stone-100 p-3 mb-4 text-xs">
                  {lastDiceRoll.cardHeadline && (
                    <div className="text-[10px] font-black uppercase text-zinc-600 mb-0.5">
                      CAUSA: {lastDiceRoll.cardHeadline}
                    </div>
                  )}
                  <div className="font-bold text-black leading-snug">
                    «{lastDiceRoll.choiceLabel}»
                  </div>
                  {lastDiceRoll.flavorQuote && (
                    <div className="mt-1.5 pt-1.5 border-t border-dashed border-black/40 italic text-zinc-700 text-[11px]">
                      🎙️ "{lastDiceRoll.flavorQuote}"
                    </div>
                  )}
                </div>
              )}

              {/* Desglose Detallado de Cada Tirada de Dados */}
              <div className="mb-4">
                <div className="text-[11px] font-black uppercase tracking-wider text-black mb-2">
                  🎲 DESGLOSE DE LA TIRADA Y EFECTO DE TUS PRIVILEGIOS:
                </div>

                <div className="flex flex-col gap-2.5">
                  {lastDiceRoll.rolls.map((roll, idx) => {
                    const isDanger =
                      roll.statKey === 'presionJudicial'
                        ? roll.rolledDelta > 0
                        : roll.rolledDelta < 0;
                    const sign =
                      roll.rolledDelta > 0
                        ? `+${roll.rolledDelta}`
                        : `${roll.rolledDelta}`;
                    const baseSign =
                      roll.baseDelta > 0 ? `+${roll.baseDelta}` : `${roll.baseDelta}`;
                    const minSign = roll.min > 0 ? `+${roll.min}` : `${roll.min}`;
                    const maxSign = roll.max > 0 ? `+${roll.max}` : `${roll.max}`;

                    return (
                      <div
                        key={roll.statKey}
                        className="border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <motion.div
                              initial={{ rotate: 360, scale: 0.4 }}
                              animate={{ rotate: 0, scale: 1 }}
                              transition={{
                                delay: idx * 0.08,
                                type: 'spring',
                                stiffness: 240,
                                damping: 15,
                              }}
                            >
                              <FanzineDieFace face={roll.diceFace} size={28} />
                            </motion.div>
                            <div>
                              <span className="text-xs font-black uppercase text-black block">
                                {roll.statLabel}
                              </span>
                              <span className="text-[10px] font-bold text-zinc-600">
                                Dado {roll.diceNotation} (Horquilla: {minSign}% a {maxSign}%)
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span
                              className={`inline-block border-2 border-black px-2 py-0.5 text-sm font-black ${
                                isDanger
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-emerald-100 text-emerald-900'
                              }`}
                            >
                              {sign}%
                            </span>
                            {roll.statBefore !== undefined && roll.statAfter !== undefined && (
                              <span className="block text-[10px] font-bold text-zinc-700 mt-0.5">
                                {roll.statBefore}% ➔ {roll.statAfter}%
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Explicación Matemática y Narrativa de la Tirada */}
                        <div className="text-[11px] text-zinc-700 bg-stone-50 border-t border-dashed border-black/30 pt-1.5 mt-1 flex flex-col gap-0.5">
                          <div>
                            • Impacto base de la decisión: <strong>{baseSign}%</strong> | Tirada obtenida en el margen [{minSign}%, {maxSign}%]: <strong>{sign}%</strong>.
                          </div>
                          {roll.privilegeApplied && (
                            <div className="font-bold text-emerald-900">
                              ⚡ Tu privilegio «{roll.privilegeApplied.name}» modificó la horquilla en{' '}
                              {roll.privilegeApplied.amount > 0
                                ? `+${roll.privilegeApplied.amount}%`
                                : `${roll.privilegeApplied.amount}%`}{' '}
                              a tu favor.
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Aviso si se ha desbloqueado un nuevo Privilegio de Poltrona */}
              {newlyUnlockedPrivilege && (
                <div className="border-2 border-black bg-emerald-50 p-3 mb-4 text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="font-black uppercase text-emerald-900 mb-0.5">
                    🔓 ¡NUEVO PRIVILEGIO DE POLTRONA INCORPORADO AL EXPEDIENTE!
                  </div>
                  <div className="font-bold text-black">
                    {newlyUnlockedPrivilege.name} ({newlyUnlockedPrivilege.shortTag})
                  </div>
                  <div className="text-[11px] text-emerald-800 mt-0.5">
                    Efecto permanente: {newlyUnlockedPrivilege.inGameEffect}
                  </div>
                </div>
              )}

              {/* Botones de Acción para Cerrar o Avanzar al Siguiente Dilema */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2 border-t-2 border-black">
                <button
                  type="button"
                  onClick={clearLastDiceRoll}
                  className="sm:w-1/3 border-3 border-black bg-white hover:bg-stone-100 active:translate-x-0.5 active:translate-y-0.5 py-2.5 px-3 font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-all"
                >
                  CERRAR
                </button>
                <button
                  type="button"
                  onClick={clearLastDiceRoll}
                  autoFocus
                  className="sm:w-2/3 border-3 border-black bg-black text-white hover:bg-zinc-800 active:translate-x-0.5 active:translate-y-0.5 py-2.5 px-4 font-black uppercase text-xs sm:text-sm tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-all"
                >
                  SIGUIENTE DILEMA → [ENTER]
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenedor Draggable con Framer Motion */}
      <div className="relative w-full min-h-[420px] flex items-center justify-center p-2">
        <motion.article
          key={card.id}
          style={{ x, rotate }}
          drag={disabled || isDiceModalOpen ? false : 'x'}
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

          {/* Membrete Oficial, Retrato Satírico y Emisor */}
          <header className="border-b-2 border-black pb-3 mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CharacterPortrait
                src={card.portraitUrl}
                speaker={card.speaker}
                speakerRole={card.speakerRole}
                alt={card.speaker}
                isCrisis={isCrisis}
                crisisType={crisisType}
                size="md"
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

          {/* Indicación ágil de interacción */}
          <footer className="border-t-2 border-black pt-2 text-[11px] font-mono text-zinc-600 italic flex items-center justify-between">
            <span>💡 Apunta o desliza para ver los márgenes de dados en la telemetría</span>
            <span className="font-bold not-italic text-[10px] bg-stone-200 px-1.5 py-0.5 border border-black">
              🎲 RIESGO VARIABLE
            </span>
          </footer>
        </motion.article>
      </div>

      {/* Botones Físicos y Accesibles para Móvil y Teclado */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {/* Opción Izquierda */}
        <button
          type="button"
          onClick={() => triggerChoice('left')}
          onMouseEnter={() => !isDiceModalOpen && setPreviewDirection('left')}
          onMouseLeave={() => setPreviewDirection(null)}
          onFocus={() => !isDiceModalOpen && setPreviewDirection('left')}
          onBlur={() => setPreviewDirection(null)}
          disabled={disabled || isDiceModalOpen}
          className="group border-3 border-black bg-white hover:bg-amber-50 active:translate-x-0.5 active:translate-y-0.5 p-3.5 text-left font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex flex-col justify-between disabled:opacity-50"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-black uppercase text-red-700 tracking-wider">
                ← [ {card.leftChoice.stampText} ]
              </span>
              <span className="text-[10px] border border-black px-1.5 py-0.5 bg-stone-100 font-bold uppercase hidden sm:inline">
                🎲 Tecla: ← / A
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
          </div>

          {leftPrivilegeUnlock && (
            <div className="mt-2 pt-1.5 border-t border-dashed border-black text-[10px] font-black text-emerald-900 flex items-center gap-1">
              <span>⚡ SUMA PRIVILEGIO:</span>
              <span className="underline">{leftPrivilegeUnlock.name}</span>
            </div>
          )}
        </button>

        {/* Opción Derecha */}
        <button
          type="button"
          onClick={() => triggerChoice('right')}
          onMouseEnter={() => !isDiceModalOpen && setPreviewDirection('right')}
          onMouseLeave={() => setPreviewDirection(null)}
          onFocus={() => !isDiceModalOpen && setPreviewDirection('right')}
          onBlur={() => setPreviewDirection(null)}
          disabled={disabled || isDiceModalOpen}
          className="group border-3 border-black bg-white hover:bg-amber-50 active:translate-x-0.5 active:translate-y-0.5 p-3.5 text-left font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex flex-col justify-between disabled:opacity-50"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-black uppercase text-black tracking-wider">
                [ {card.rightChoice.stampText} ] →
              </span>
              <span className="text-[10px] border border-black px-1.5 py-0.5 bg-stone-100 font-bold uppercase hidden sm:inline">
                🎲 Tecla: → / D
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
          </div>

          {rightPrivilegeUnlock && (
            <div className="mt-2 pt-1.5 border-t border-dashed border-black text-[10px] font-black text-emerald-900 flex items-center gap-1">
              <span>⚡ SUMA PRIVILEGIO:</span>
              <span className="underline">{rightPrivilegeUnlock.name}</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

export default ReignsCard;
