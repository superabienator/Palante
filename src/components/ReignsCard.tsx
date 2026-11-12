'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useGameStore, ProjectedStatsRange } from '../store/gameStore';
import { ReignsCard as ReignsCardType, RiskAssessment, RiskLevel, CharacterStats } from '../types/story';
import { CharacterPortrait } from './CharacterPortrait';
import { PRIVILEGES_REGISTRY } from '../config/privileges';
import { soundManager } from '../utils/soundEffects';

function calculateLocalRiskAssessment(
  stats: CharacterStats,
  projectedRange: ProjectedStatsRange | null
): RiskAssessment {
  if (!projectedRange) {
    const isCritical =
      stats.presionJudicial >= 85 ||
      stats.pastaEnB <= 15 ||
      stats.pastaEnB >= 85 ||
      stats.impunidad <= 15 ||
      stats.reputacionMediatica <= 15;
    return {
      level: isCritical ? 'VOLATILE' : 'SAFE',
      dangerStats: [],
      explanation: isCritical ? 'Parámetros institucionales en zona crítica' : 'Situación estable',
    };
  }

  const dangerStats: RiskAssessment['dangerStats'] = [];
  let hasLethal = false;
  let hasVolatile = false;

  const statKeys: Array<keyof CharacterStats> = [
    'pastaEnB',
    'presionJudicial',
    'impunidad',
    'reputacionMediatica',
  ];

  for (const key of statKeys) {
    const variance = projectedRange[key];
    if (!variance) continue;

    const currentVal = stats[key] ?? 50;
    const minProjected = Math.max(0, Math.min(100, currentVal + variance.min));
    const maxProjected = Math.max(0, Math.min(100, currentVal + variance.max));

    let isLethalForStat = false;
    let isVolatileForStat = false;

    if (key === 'pastaEnB') {
      if (minProjected <= 0 || maxProjected >= 100) isLethalForStat = true;
      else if (minProjected <= 15 || maxProjected >= 85) isVolatileForStat = true;
    } else if (key === 'presionJudicial') {
      if (maxProjected >= 100) isLethalForStat = true;
      else if (maxProjected >= 80) isVolatileForStat = true;
    } else if (key === 'impunidad') {
      if (minProjected <= 0) isLethalForStat = true;
      else if (minProjected <= 15) isVolatileForStat = true;
    } else if (key === 'reputacionMediatica') {
      if (minProjected <= 0) isLethalForStat = true;
      else if (minProjected <= 15) isVolatileForStat = true;
    }

    if (isLethalForStat) {
      hasLethal = true;
      dangerStats.push({
        statKey: key,
        statLabel: key,
        bound: key === 'presionJudicial' ? 'MAX' : 'MIN',
        lethal: true,
      });
    } else if (isVolatileForStat) {
      hasVolatile = true;
      dangerStats.push({
        statKey: key,
        statLabel: key,
        bound: key === 'presionJudicial' ? 'MAX' : 'MIN',
        lethal: false,
      });
    }
  }

  const level: RiskLevel = hasLethal ? 'LETHAL' : hasVolatile ? 'VOLATILE' : 'SAFE';
  const explanation = hasLethal
    ? 'Peligro inminente de prisión o bancarrota en esta tirada'
    : hasVolatile
    ? 'Riesgo alto de desestabilización en parámetros clave'
    : 'Tirada en márgenes institucionales seguros';

  return { level, dangerStats, explanation };
}

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
  const stats = useGameStore((state) => state.stats);
  const getProjectedStatsRange = useGameStore((state) => state.getProjectedStatsRange);
  const getActiveRiskAssessment = useGameStore((state) => state.getActiveRiskAssessment);

  const projectedRange = typeof getProjectedStatsRange === 'function' ? getProjectedStatsRange() : null;

  const riskAssessment: RiskAssessment = useMemo(() => {
    if (typeof getActiveRiskAssessment === 'function') {
      const storeAssessment = getActiveRiskAssessment();
      if (storeAssessment) return storeAssessment;
    }
    return calculateLocalRiskAssessment(stats, projectedRange);
  }, [getActiveRiskAssessment, stats, projectedRange]);

  const card = propCard ?? storeCard;

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-180, 0, 180], [-10, 0, 10]);

  // Umbral mucho más sensible y nítido para móvil:
  // A solo 8-10px ya empieza a revelarse el sello, y a 40px ya es 100% visible
  const leftStampOpacity = useTransform(x, [-45, -8, 0], [1, 0.6, 0]);
  const rightStampOpacity = useTransform(x, [0, 8, 45], [0, 0.6, 1]);

  // Contrarrestar sutilmente la salida de pantalla en móvil
  const leftStampX = useTransform(x, [-150, 0], [20, 0]);
  const rightStampX = useTransform(x, [0, 150], [0, -20]);

  const [exitX, setExitX] = useState<number | null>(null);
  const swipeSoundPlayedRef = useRef(false);

  const isDiceModalOpen = Boolean(lastDiceRoll);

  // Detección de cartas de crisis o alerta procesal
  const isCrisis = Boolean(
    card &&
      (card.id.toLowerCase().includes('crisis') ||
        card.headline.toLowerCase().includes('registro') ||
        card.headline.toLowerCase().includes('bancarrota') ||
        card.headline.toLowerCase().includes('suplicatorio') ||
        card.headline.toLowerCase().includes('portada dominical'))
  );

  // Efecto de sonido al saltar tirada de dados
  useEffect(() => {
    if (lastDiceRoll) {
      soundManager.playDiceRoll();
      if (lastDiceRoll.unlockedPrivilegeId) {
        const timer = setTimeout(() => soundManager.playCashChime(), 320);
        return () => clearTimeout(timer);
      }
    }
  }, [lastDiceRoll]);

  // Efecto de sonido cuando entra una carta de crisis
  useEffect(() => {
    if (isCrisis) {
      soundManager.playCrisisAlert();
    }
  }, [card?.id, isCrisis]);

  // Atajos de teclado:
  // - Si la ventana emergente de dados está abierta: Enter, Espacio o Escape la cierran ("Siguiente").
  // - Si está cerrada: ←/A y →/D toman decisión sobre la carta activa.
  useEffect(() => {
    if (disabled || !card) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDiceModalOpen) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          e.preventDefault();
          soundManager.playPaperSwipe();
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
    soundManager.playStampImpact(direction === 'left');
    setExitX(direction === 'left' ? -350 : 350);
    setTimeout(() => {
      makeReignsChoice(direction);
      setExitX(null);
      x.set(0);
      setPreviewDirection(null);
      swipeSoundPlayedRef.current = false;
    }, 180);
  };

  const handleDrag = (_: unknown, info: PanInfo) => {
    if (isDiceModalOpen) return;

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
    if (isDiceModalOpen) return;

    // Umbral rebajado a 70px para mayor agilidad en móvil
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
      <div className="border-4 border-[#121a12] bg-[#f4efdc] p-8 font-mono text-center shadow-[6px_6px_0px_0px_#121a12] -rotate-1">
        <p className="font-bold uppercase tracking-wider text-base text-zinc-900">
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-mono"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dice-roll-modal-title"
          >
            <motion.div
              initial={{ scale: 0.88, y: 24, rotate: -1 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.92, y: 12, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="w-full max-w-lg border-4 border-[#121a12] bg-[#f5efdc] p-5 sm:p-6 shadow-[8px_8px_0px_0px_#121a12] max-h-[90vh] overflow-y-auto"
            >
              {/* Cabecera de la Ventana Emergente con Botón Cerrar */}
              <div className="flex items-center justify-between gap-2 border-b-3 border-[#121a12] pb-3 mb-4">
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
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700 block">
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
                  onClick={() => {
                    soundManager.playPaperSwipe();
                    clearLastDiceRoll();
                  }}
                  aria-label="Cerrar ventana de tirada de dados"
                  className="border-2 border-black bg-white hover:bg-black hover:text-white px-2.5 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#121a12] cursor-pointer transition-colors"
                >
                  ✕ CERRAR
                </button>
              </div>

              {/* Resumen de la Decisión Ejecutada */}
              {lastDiceRoll.choiceLabel && (
                <div className="border-2 border-[#121a12] bg-[#ebe4ce] p-3 mb-4 text-xs">
                  {lastDiceRoll.cardHeadline && (
                    <div className="text-[10px] font-black uppercase text-zinc-700 mb-0.5">
                      CAUSA: {lastDiceRoll.cardHeadline}
                    </div>
                  )}
                  <div className="font-bold text-black leading-snug">
                    «{lastDiceRoll.choiceLabel}»
                  </div>
                  {lastDiceRoll.flavorQuote && (
                    <div className="mt-1.5 pt-1.5 border-t border-dashed border-black/40 italic text-zinc-800 text-[11px]">
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
                        className="border-2 border-[#121a12] bg-[#fbf9f0] p-3 shadow-[3px_3px_0px_0px_#121a12]"
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
                                  ? 'bg-red-200 text-red-950'
                                  : 'bg-emerald-200 text-emerald-950'
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
                        <div className="text-[11px] text-zinc-800 bg-[#ede6cf] border-t border-dashed border-black/30 pt-1.5 mt-1 flex flex-col gap-0.5 p-1.5">
                          <div>
                            • Impacto base de la decisión: <strong>{baseSign}%</strong> | Tirada obtenida en el margen [{minSign}%, {maxSign}%]: <strong>{sign}%</strong>.
                          </div>
                          {roll.privilegeApplied && (
                            <div className="font-bold text-emerald-950">
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
                <div className="border-2 border-emerald-900 bg-emerald-100 p-3 mb-4 text-xs shadow-[2px_2px_0px_0px_#121a12]">
                  <div className="font-black uppercase text-emerald-950 mb-0.5">
                    🔓 ¡NUEVO PRIVILEGIO DE POLTRONA INCORPORADO AL EXPEDIENTE!
                  </div>
                  <div className="font-bold text-black">
                    {newlyUnlockedPrivilege.name} ({newlyUnlockedPrivilege.shortTag})
                  </div>
                  <div className="text-[11px] text-emerald-900 mt-0.5">
                    Efecto permanente: {newlyUnlockedPrivilege.inGameEffect}
                  </div>
                </div>
              )}

              {/* Botones de Acción para Cerrar o Avanzar al Siguiente Dilema */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2 border-t-2 border-[#121a12]">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPaperSwipe();
                    clearLastDiceRoll();
                  }}
                  className="sm:w-1/3 border-3 border-black bg-white hover:bg-stone-200 active:translate-x-0.5 active:translate-y-0.5 py-2.5 px-3 font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_#121a12] cursor-pointer transition-all"
                >
                  CERRAR
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPaperSwipe();
                    clearLastDiceRoll();
                  }}
                  autoFocus
                  className="sm:w-2/3 border-3 border-black bg-black text-white hover:bg-zinc-800 active:translate-x-0.5 active:translate-y-0.5 py-2.5 px-4 font-black uppercase text-xs sm:text-sm tracking-wider shadow-[3px_3px_0px_0px_#121a12] cursor-pointer transition-all"
                >
                  SIGUIENTE DILEMA → [ENTER]
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          HUD DINÁMICO SUPERIOR: PREVIEW DE DECISIÓN EN TIEMPO REAL (MÓVIL & ESCRITORIO)
          Permanece centrado e inmóvil para que NUNCA se salga de la pantalla al inclinar.
         ===================================================================== */}
      <div className="w-full mb-2 px-1">
        <div
          className={`w-full min-h-[58px] border-3 border-[#121a12] p-2 sm:p-2.5 font-mono text-center shadow-[4px_4px_0px_0px_#121a12] transition-all duration-150 flex flex-col justify-center items-center ${
            previewDirection === 'left'
              ? 'bg-red-800 text-white border-red-950 scale-[1.01]'
              : previewDirection === 'right'
              ? 'bg-amber-300 text-black border-amber-950 scale-[1.01]'
              : 'bg-[#ede6cf]/90 text-zinc-800 border-black/70'
          }`}
        >
          {previewDirection === 'left' ? (
            <div className="flex flex-col items-center w-full animate-in fade-in duration-100">
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <span className="bg-black text-white px-2 py-0.5 text-xs font-black uppercase tracking-wider shrink-0 border border-white">
                  ← [ {card.leftChoice.stampText || 'ACEPTAR'} ]
                </span>
                <span className="text-xs sm:text-sm font-black uppercase text-white leading-tight">
                  {card.leftChoice.label}
                </span>
              </div>
              {card.leftChoice.flavorQuote && (
                <div className="text-[11px] text-red-100 italic truncate max-w-full mt-1">
                  🎙️ "{card.leftChoice.flavorQuote}"
                </div>
              )}
              {/* Semáforo de Riesgo */}
              <div className="mt-1">
                {riskAssessment.level === 'LETHAL' ? (
                  <span className="bg-red-950 text-red-200 border-2 border-red-500 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider animate-pulse shadow-[2px_2px_0px_0px_#000]">
                    🔴 RIESGO: PELIGRO DE CÁRCEL / BANCARROTA
                  </span>
                ) : riskAssessment.level === 'VOLATILE' ? (
                  <span className="bg-amber-950 text-amber-300 border border-amber-400 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-[1px_1px_0px_0px_#000]">
                    🟡 RIESGO: VOLÁTIL
                  </span>
                ) : (
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-400 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-[1px_1px_0px_0px_#000]">
                    🟢 RIESGO: CONTROLADO
                  </span>
                )}
              </div>
            </div>
          ) : previewDirection === 'right' ? (
            <div className="flex flex-col items-center w-full animate-in fade-in duration-100">
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <span className="text-xs sm:text-sm font-black uppercase text-black leading-tight">
                  {card.rightChoice.label}
                </span>
                <span className="bg-black text-amber-300 px-2 py-0.5 text-xs font-black uppercase tracking-wider shrink-0 border border-black">
                  [ {card.rightChoice.stampText || 'RECHAZAR'} ] →
                </span>
              </div>
              {card.rightChoice.flavorQuote && (
                <div className="text-[11px] text-zinc-900 italic truncate max-w-full mt-1">
                  🎙️ "{card.rightChoice.flavorQuote}"
                </div>
              )}
              {/* Semáforo de Riesgo */}
              <div className="mt-1">
                {riskAssessment.level === 'LETHAL' ? (
                  <span className="bg-red-950 text-red-200 border-2 border-red-500 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider animate-pulse shadow-[2px_2px_0px_0px_#000]">
                    🔴 RIESGO: PELIGRO DE CÁRCEL / BANCARROTA
                  </span>
                ) : riskAssessment.level === 'VOLATILE' ? (
                  <span className="bg-amber-950 text-amber-300 border border-amber-400 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-[1px_1px_0px_0px_#000]">
                    🟡 RIESGO: VOLÁTIL
                  </span>
                ) : (
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-400 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-[1px_1px_0px_0px_#000]">
                    🟢 RIESGO: CONTROLADO
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full px-2 text-[10px] sm:text-xs font-bold text-zinc-700 uppercase tracking-wider">
              <span className="text-red-800 font-black">← Desliza Izquierda</span>
              <span className="text-[10px] font-black flex items-center gap-1">
                {riskAssessment.level === 'LETHAL' ? (
                  <span className="text-red-700 font-black animate-pulse">🔴 RIESGO: PELIGRO DE CÁRCEL</span>
                ) : riskAssessment.level === 'VOLATILE' ? (
                  <span className="text-amber-800 font-black">🟡 RIESGO: VOLÁTIL</span>
                ) : (
                  <span className="text-emerald-800 font-black">🟢 RIESGO: CONTROLADO</span>
                )}
              </span>
              <span className="text-amber-900 font-black">Desliza Derecha →</span>
            </div>
          )}
        </div>
      </div>

      {/* Contenedor Draggable con Framer Motion */}
      <div className="relative w-full min-h-[420px] flex items-center justify-center p-2">
        <motion.article
          key={card.id}
          style={{ x, rotate }}
          drag={disabled || isDiceModalOpen ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.65}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={exitX !== null ? { x: exitX, opacity: 0 } : { x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className={`w-full relative cursor-grab active:cursor-grabbing select-none border-4 ${
            isCrisis
              ? 'border-red-800 bg-[#fcedec] shadow-[6px_6px_0px_0px_#822222]'
              : 'border-[#121a12] bg-[#f5efdc] shadow-[6px_6px_0px_0px_#121a12]'
          } p-5 sm:p-7 -rotate-1`}
        >
          {/* Mancha sutil de humedad/moho de cloaca en esquinas de la carta */}
          <div className="pointer-events-none absolute inset-0 moho-corner" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 moho-bottom" />

          {/* Alerta de Crisis Procesal en Cabecera de la Tarjeta */}
          {isCrisis && (
            <div className="border-2 border-red-900 bg-red-700 text-white font-mono font-black text-[10px] sm:text-xs uppercase px-2.5 py-1 tracking-widest flex items-center justify-between mb-4 shadow-[2px_2px_0px_0px_#121a12] animate-pulse">
              <span>🚨 ALERTA PROCESAL // PIEZA SEPARADA URGENTE</span>
              <span className="bg-black text-white px-1.5 py-0.2">ART. 384 BIS</span>
            </div>
          )}

          {/* Sellos de Caucho Flotantes con Opacidad Proporcional al Desplazamiento */}
          <motion.div
            style={{ opacity: leftStampOpacity, x: leftStampX }}
            className="pointer-events-none absolute top-3 left-3 z-30 flex flex-col items-start gap-1 max-w-[85%]"
          >
            <div className="border-4 border-red-800 bg-red-600/95 text-white px-3 py-1 font-mono font-black text-base sm:text-xl uppercase tracking-widest -rotate-6 shadow-[4px_4px_0px_0px_#121a12]">
              {card.leftChoice.stampText || 'ACEPTAR'}
            </div>
            <div className="border-2 border-black bg-white/95 text-black p-2 font-mono text-xs sm:text-sm font-bold shadow-[2px_2px_0px_0px_#121a12] line-clamp-2">
              {card.leftChoice.label}
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: rightStampOpacity, x: rightStampX }}
            className="pointer-events-none absolute top-3 right-3 z-30 flex flex-col items-end gap-1 max-w-[85%]"
          >
            <div className="border-4 border-amber-950 bg-amber-400/95 text-black px-3 py-1 font-mono font-black text-base sm:text-xl uppercase tracking-widest rotate-6 shadow-[4px_4px_0px_0px_#121a12]">
              {card.rightChoice.stampText || 'RECHAZAR'}
            </div>
            <div className="border-2 border-black bg-white/95 text-black p-2 font-mono text-xs sm:text-sm font-bold shadow-[2px_2px_0px_0px_#121a12] text-right line-clamp-2">
              {card.rightChoice.label}
            </div>
          </motion.div>

          {/* Membrete Oficial, Retrato Satírico y Emisor */}
          <header className="border-b-2 border-[#121a12] pb-3 mb-4 flex items-center justify-between gap-3 relative z-10">
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
                <div className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-700">
                  AUDIENCIA NACIONAL // SUMARIO
                </div>
                <h3 className="text-base sm:text-lg font-mono font-black uppercase text-black leading-tight">
                  {card.speaker}
                </h3>
                <div className="text-xs font-mono text-zinc-800 font-bold uppercase">
                  {card.speakerRole}
                </div>
              </div>
            </div>

            <div className="border border-black bg-[#ede6cf] px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider self-start shrink-0">
              {card.sphere}
            </div>
          </header>

          {/* Titular del Dilema */}
          <h2 className="text-lg sm:text-xl font-mono font-black uppercase text-black leading-tight mb-3 relative z-10">
            {card.headline}
          </h2>

          {/* Narración Fanzine del Hecho */}
          <div className="font-mono text-sm leading-relaxed text-black/90 mb-4 bg-white/80 p-3.5 border-l-4 border-[#121a12] relative z-10 shadow-xs">
            {card.context}
          </div>

          {/* Pieza de Convicción Intervenida */}
          {card.evidenceDocument && (
            <div className="border-2 border-dashed border-[#121a12] bg-[#f8f3e0] p-2.5 mb-4 text-xs font-mono relative z-10">
              <span className="font-black uppercase tracking-wider block text-[10px] text-zinc-700 mb-0.5">
                📎 PIEZA DE CONVICCIÓN INCAUTADA:
              </span>
              <p className="italic text-zinc-900">"{card.evidenceDocument}"</p>
            </div>
          )}

          {/* Indicación ágil de interacción */}
          <footer className="border-t-2 border-[#121a12] pt-2 text-[11px] font-mono text-zinc-700 italic flex items-center justify-between relative z-10">
            <span>💡 Desliza o usa teclas para ver las tiradas de dados</span>
            <span className="font-bold not-italic text-[10px] bg-[#ede6cf] px-1.5 py-0.5 border border-black">
              🎲 RIESGO VARIABLE
            </span>
          </footer>
        </motion.article>
      </div>

      {/* Botones Físicos y Accesibles para Móvil y Teclado */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        {/* Opción Izquierda */}
        <button
          type="button"
          onClick={() => triggerChoice('left')}
          onMouseEnter={() => !isDiceModalOpen && setPreviewDirection('left')}
          onMouseLeave={() => setPreviewDirection(null)}
          onFocus={() => !isDiceModalOpen && setPreviewDirection('left')}
          onBlur={() => setPreviewDirection(null)}
          disabled={disabled || isDiceModalOpen}
          className={`group border-3 p-3.5 text-left font-mono transition-all cursor-pointer flex flex-col justify-between disabled:opacity-50 ${
            previewDirection === 'left'
              ? 'border-red-800 bg-red-100 shadow-[6px_6px_0px_0px_#822222] translate-x-0.5 translate-y-0.5'
              : 'border-[#121a12] bg-[#fbf9f0] hover:bg-red-50/50 shadow-[4px_4px_0px_0px_#121a12]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-black uppercase text-red-800 tracking-wider">
                ← [ {card.leftChoice.stampText} ]
              </span>
              <span className="text-[10px] border border-black px-1.5 py-0.5 bg-[#ede6cf] font-bold uppercase hidden sm:inline">
                🎲 Tecla: ← / A
              </span>
            </div>
            <p className="text-sm font-bold text-black leading-snug">
              {card.leftChoice.label}
            </p>
            {card.leftChoice.flavorQuote && (
              <div className="mt-2 border-l-3 border-red-700 bg-red-100/60 pl-2 py-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-red-900 block mb-0.5">
                  🎙️ AUDIO UCO INTERVENIDO:
                </span>
                <p className="text-xs text-zinc-900 italic leading-snug">
                  "{card.leftChoice.flavorQuote}"
                </p>
              </div>
            )}
          </div>

          {leftPrivilegeUnlock && (
            <div className="mt-2 pt-1.5 border-t border-dashed border-black text-[10px] font-black text-emerald-950 flex items-center gap-1">
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
          className={`group border-3 p-3.5 text-left font-mono transition-all cursor-pointer flex flex-col justify-between disabled:opacity-50 ${
            previewDirection === 'right'
              ? 'border-amber-950 bg-amber-100 shadow-[6px_6px_0px_0px_#121a12] translate-x-0.5 translate-y-0.5'
              : 'border-[#121a12] bg-[#fbf9f0] hover:bg-amber-50/50 shadow-[4px_4px_0px_0px_#121a12]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-black uppercase text-black tracking-wider">
                [ {card.rightChoice.stampText} ] →
              </span>
              <span className="text-[10px] border border-black px-1.5 py-0.5 bg-[#ede6cf] font-bold uppercase hidden sm:inline">
                🎲 Tecla: → / D
              </span>
            </div>
            <p className="text-sm font-bold text-black leading-snug">
              {card.rightChoice.label}
            </p>
            {card.rightChoice.flavorQuote && (
              <div className="mt-2 border-l-3 border-[#121a12] bg-[#ede6cf]/80 pl-2 py-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-zinc-900 block mb-0.5">
                  🎙️ AUDIO UCO INTERVENIDO:
                </span>
                <p className="text-xs text-zinc-900 italic leading-snug">
                  "{card.rightChoice.flavorQuote}"
                </p>
              </div>
            )}
          </div>

          {rightPrivilegeUnlock && (
            <div className="mt-2 pt-1.5 border-t border-dashed border-black text-[10px] font-black text-emerald-950 flex items-center gap-1">
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
