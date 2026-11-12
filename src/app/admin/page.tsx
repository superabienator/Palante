'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import reignsDeckData from '../../content/reignsDeck.json';
import initialPendingCards from '../../content/pendingNewsCards.json';
import { ReignsCard, SphereType } from '../../types/story';
import { CharacterPortrait } from '../../components/CharacterPortrait';

const STORAGE_ACTIVE_KEY = 'ibex35_admin_active_cards_v1';
const STORAGE_PENDING_KEY = 'ibex35_admin_pending_cards_v1';

type TabType = 'active' | 'pending' | 'create';

interface NewCardFormState {
  headline: string;
  sphere: SphereType;
  speaker: string;
  speakerRole: string;
  context: string;
  evidenceDocument: string;
  // Elección Izquierda
  leftLabel: string;
  leftStampText: string;
  leftFlavorQuote: string;
  leftPasta: number;
  leftPresion: number;
  leftImpunidad: number;
  leftPrensa: number;
  // Elección Derecha
  rightLabel: string;
  rightStampText: string;
  rightFlavorQuote: string;
  rightPasta: number;
  rightPresion: number;
  rightImpunidad: number;
  rightPrensa: number;
}

const INITIAL_FORM: NewCardFormState = {
  headline: '',
  sphere: 'POLITICA',
  speaker: '',
  speakerRole: '',
  context: '',
  evidenceDocument: '',
  leftLabel: '',
  leftStampText: 'RECHAZAR',
  leftFlavorQuote: '',
  leftPasta: 0,
  leftPresion: 0,
  leftImpunidad: 0,
  leftPrensa: 0,
  rightLabel: '',
  rightStampText: 'ACEPTAR',
  rightFlavorQuote: '',
  rightPasta: 0,
  rightPresion: 0,
  rightImpunidad: 0,
  rightPrensa: 0,
};

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<TabType>('active');

  // Listas de cartas
  const [activeCards, setActiveCards] = useState<ReignsCard[]>([]);
  const [pendingCards, setPendingCards] = useState<ReignsCard[]>([]);

  // Filtros de pestaña Mazo Activo
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSphere, setFilterSphere] = useState<string>('ALL');

  // Estado del formulario de creación
  const [formData, setFormData] = useState<NewCardFormState>(INITIAL_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const getAdminHeaders = () => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('ibex35_admin_token') || '' : '';
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const loadData = async (token?: string) => {
    const activeToken = token || (typeof window !== 'undefined' ? sessionStorage.getItem('ibex35_admin_token') || '' : '');
    const baseCards = (reignsDeckData.cards ?? []) as ReignsCard[];
    let savedActive: ReignsCard[] = baseCards;
    let savedPending: ReignsCard[] = initialPendingCards as unknown as ReignsCard[];

    // 1. Intentar cargar desde el backend API
    try {
      const res = await fetch('/api/admin/cards', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.activeCards)) {
          savedActive = data.activeCards;
          if (Array.isArray(data.pendingCards)) {
            savedPending = data.pendingCards;
          }
          setActiveCards(savedActive);
          setPendingCards(savedPending);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend API no disponible en este entorno, recurriendo a localStorage', err);
    }

    // 2. Fallback de localStorage
    try {
      const activeRaw = localStorage.getItem(STORAGE_ACTIVE_KEY);
      if (activeRaw) {
        const parsed = JSON.parse(activeRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          savedActive = parsed;
        }
      }

      const pendingRaw = localStorage.getItem(STORAGE_PENDING_KEY);
      if (pendingRaw) {
        const parsed = JSON.parse(pendingRaw);
        if (Array.isArray(parsed)) {
          savedPending = parsed;
        }
      }
    } catch (e) {
      console.error('Error leyendo mazo de localStorage', e);
    }

    setActiveCards(savedActive);
    setPendingCards(savedPending);
  };

  // Carga inicial y chequeo de sesión
  useEffect(() => {
    setMounted(true);
    const savedToken = sessionStorage.getItem('ibex35_admin_token');
    if (savedToken) {
      setIsAuthenticated(true);
      loadData(savedToken);
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await fetch('/api/admin/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_password', password: passwordInput }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('ibex35_admin_token', passwordInput);
        setIsAuthenticated(true);
        loadData(passwordInput);
        showToast('✓ Autorización judicial concedida. Sumario desclasificado.');
      } else {
        setAuthError(data.error || 'Clave de autorización judicial incorrecta.');
      }
    } catch {
      // Fallback local en caso de desconexión si la clave es palante2026
      if (passwordInput === 'palante2026') {
        sessionStorage.setItem('ibex35_admin_token', passwordInput);
        setIsAuthenticated(true);
        loadData(passwordInput);
      } else {
        setAuthError('Error de conexión o clave judicial denegada.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ibex35_admin_token');
    setIsAuthenticated(false);
    setPasswordInput('');
    showToast('🔒 Sesión cerrada. Sumario bloqueado.');
  };

  const saveActiveCards = (updated: ReignsCard[]) => {
    setActiveCards(updated);
    try {
      localStorage.setItem(STORAGE_ACTIVE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error guardando mazo activo', e);
    }
  };

  const savePendingCards = (updated: ReignsCard[]) => {
    setPendingCards(updated);
    try {
      localStorage.setItem(STORAGE_PENDING_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error guardando cartas pendientes', e);
    }
  };

  // Acción: Aprobar carta viral e incorporar al mazo activo
  const handleApproveViral = async (cardToApprove: ReignsCard) => {
    // Intentar sync con backend API
    try {
      await fetch('/api/admin/cards', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ action: 'approve_pending', cardId: cardToApprove.id }),
      });
    } catch (err) {
      console.warn('API sync fallback a localStorage', err);
    }

    // Actualización local inmediata
    const exists = activeCards.some((c) => c.id === cardToApprove.id);
    const updatedActive = exists ? activeCards : [cardToApprove, ...activeCards];
    saveActiveCards(updatedActive);

    const updatedPending = pendingCards.filter((c) => c.id !== cardToApprove.id);
    savePendingCards(updatedPending);

    showToast(`✓ Carta aprobada e incorporada al mazo activo: "${cardToApprove.headline}"`);
  };

  // Acción: Descartar carta viral
  const handleDiscardViral = async (cardId: string) => {
    try {
      await fetch('/api/admin/cards', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ action: 'discard_pending', cardId }),
      });
    } catch (err) {
      console.warn('API sync fallback a localStorage', err);
    }

    const updatedPending = pendingCards.filter((c) => c.id !== cardId);
    savePendingCards(updatedPending);
    showToast('✕ Propuesta de actualidad descartada del sumario.');
  };

  // Acción: Restaurar mazo a estado inicial
  const handleResetToDefault = () => {
    if (confirm('¿Restablecer el mazo activo y la bandeja a sus valores originales de fábrica?')) {
      const baseCards = (reignsDeckData.cards ?? []) as ReignsCard[];
      const basePending = initialPendingCards as unknown as ReignsCard[];
      saveActiveCards(baseCards);
      savePendingCards(basePending);
      showToast('Mazo y bandeja restaurados a los valores iniciales.');
    }
  };

  // Acción: Copiar JSON del mazo activo al portapapeles
  const handleCopyDeckJson = () => {
    const jsonStr = JSON.stringify(activeCards, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      showToast('✓ JSON completo del mazo copiado al portapapeles.');
    });
  };

  // Acción: Crear nueva carta desde el formulario
  const handleCreateCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.headline.trim()) {
      setFormError('El titular del caso es obligatorio.');
      return;
    }
    if (!formData.speaker.trim()) {
      setFormError('Indica el nombre del interlocutor (NPC).');
      return;
    }
    if (!formData.context.trim()) {
      setFormError('Escribe la narración del dilema o contexto.');
      return;
    }
    if (!formData.leftLabel.trim() || !formData.rightLabel.trim()) {
      setFormError('Debes completar las dos decisiones (izquierda y derecha).');
      return;
    }

    const uniqueId = `CUSTOM_${Date.now()}_${formData.headline.slice(0, 15).replace(/\s+/g, '_').toUpperCase()}`;

    const newCard: ReignsCard = {
      id: uniqueId,
      speaker: formData.speaker.trim(),
      speakerRole: formData.speakerRole.trim() || 'Interlocutor de Confianza',
      sphere: formData.sphere,
      headline: formData.headline.trim().toUpperCase(),
      context: formData.context.trim(),
      evidenceDocument: formData.evidenceDocument.trim() || undefined,
      weight: 1,
      leftChoice: {
        label: formData.leftLabel.trim(),
        stampText: (formData.leftStampText.trim() || 'DECISIÓN A').toUpperCase(),
        flavorQuote: formData.leftFlavorQuote.trim() || undefined,
        modifiers: {
          pastaEnB: formData.leftPasta,
          presionJudicial: formData.leftPresion,
          impunidad: formData.leftImpunidad,
          reputacionMediatica: formData.leftPrensa,
        },
      },
      rightChoice: {
        label: formData.rightLabel.trim(),
        stampText: (formData.rightStampText.trim() || 'DECISIÓN B').toUpperCase(),
        flavorQuote: formData.rightFlavorQuote.trim() || undefined,
        modifiers: {
          pastaEnB: formData.rightPasta,
          presionJudicial: formData.rightPresion,
          impunidad: formData.rightImpunidad,
          reputacionMediatica: formData.rightPrensa,
        },
      },
    };

    // Intentar sync con backend API
    try {
      await fetch('/api/admin/cards', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ action: 'create_card', card: newCard }),
      });
    } catch (err) {
      console.warn('API sync fallback a localStorage', err);
    }

    saveActiveCards([newCard, ...activeCards]);
    setFormData(INITIAL_FORM);
    showToast(`✓ ¡Caso guardado con éxito en el mazo activo! (#${uniqueId})`);
    setActiveTab('active');
  };

  // Filtrado de cartas activas
  const filteredActiveCards = useMemo(() => {
    return activeCards.filter((card) => {
      const matchesSphere = filterSphere === 'ALL' || card.sphere === filterSphere;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        card.headline.toLowerCase().includes(q) ||
        card.speaker.toLowerCase().includes(q) ||
        card.context.toLowerCase().includes(q) ||
        card.id.toLowerCase().includes(q);
      return matchesSphere && matchesSearch;
    });
  }, [activeCards, filterSphere, searchQuery]);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#f4f1ea] p-4 sm:p-8 font-mono text-black">
        <div className="max-w-6xl mx-auto border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="h-8 bg-black w-2/3 mb-4 animate-pulse" />
          <p className="text-xs uppercase font-bold text-zinc-500">
            [ CARGANDO CONSOLA ADMINISTRATIVA DEL SUMARIO... ]
          </p>
        </div>
      </main>
    );
  }

  // Pantalla de Bloqueo Judicial (Gatekeeper) para usuarios no autenticados
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#1c1917] text-stone-100 font-mono flex items-center justify-center p-4 selection:bg-red-700 selection:text-white">
        <div className="w-full max-w-md border-4 border-red-700 bg-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(185,28,28,1)] -rotate-1">
          <div className="border-b-2 border-red-700 pb-3 mb-5">
            <div className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">
              AUDIENCIA NACIONAL // JUZGADO CENTRAL
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
              🔒 EXPEDIENTE CLASIFICADO
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Pieza de redacción bajo secreto de sumario. Se requiere autorización judicial para acceder.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-zinc-300 mb-1.5">
                CLAVE DE AUTORIZACIÓN JUDICIAL:
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Introduce la clave secreta..."
                className="w-full border-2 border-zinc-600 bg-stone-900 px-3 py-2 text-sm text-white font-mono focus:border-red-600 focus:outline-none"
                autoFocus
              />
            </div>

            {authError && (
              <div className="border-2 border-red-700 bg-red-950/80 p-2.5 text-xs text-red-300 font-bold">
                ⚠️ {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading || !passwordInput.trim()}
              className="w-full border-2 border-red-700 bg-red-700 hover:bg-red-600 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 text-white font-black uppercase text-xs sm:text-sm py-2.5 tracking-wider transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              {authLoading ? 'VERIFICANDO CREDENCIALES...' : '[ DESCLASIFICAR Y ACCEDER AL PANEL ]'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-white underline font-bold uppercase transition-colors"
            >
              ← Volver al Juego Principal
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-black font-mono selection:bg-black selection:text-white p-3 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* ========================================================
            CABECERA ADMINISTRATIVA FANZINE
           ======================================================== */}
        <header className="border-3 md:border-4 border-black bg-white p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="bg-black text-white px-2 py-0.5 text-xs font-black uppercase tracking-widest">
                CONSEJO EDITORIAL // AUDIENCIA NACIONAL
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-zinc-600 uppercase">
                Panel de Control de Redacción & Mazo
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLogout}
                className="border-2 border-red-700 bg-red-50 hover:bg-red-700 hover:text-white text-red-800 px-3 py-1 text-xs font-black uppercase tracking-wider transition-colors shadow-[2px_2px_0px_0px_rgba(185,28,28,1)] cursor-pointer"
              >
                🔒 Cerrar Sesión
              </button>

              <Link
                href="/"
                className="border-2 border-black bg-stone-100 hover:bg-black hover:text-white px-3 py-1 text-xs font-black uppercase tracking-wider transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
              >
                ➔ Volver al Juego
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight mb-1">
                ADMINISTRADOR DE SUMARIOS // FANZINE
              </h1>
              <p className="text-xs sm:text-sm text-zinc-700">
                Gestión en vivo de dilemas, noticias virales de actualidad y creación intuitiva de cartas satíricas.
              </p>
            </div>

            {/* Marcadores Rápidos */}
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="border-2 border-black bg-stone-50 px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[10px] text-zinc-500 block uppercase font-bold">Mazo Activo</span>
                <span className="text-base font-black">{activeCards.length} cartas</span>
              </div>
              <div className="border-2 border-black bg-amber-100 px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[10px] text-zinc-600 block uppercase font-bold">Bandeja Virales</span>
                <span className="text-base font-black">{pendingCards.length} pendientes</span>
              </div>
            </div>
          </div>
        </header>

        {/* TOAST / ALERTA FLOTANTE */}
        {toastMessage && (
          <div className="border-3 border-black bg-black text-white p-3 font-black text-xs sm:text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce text-center">
            {toastMessage}
          </div>
        )}

        {/* ========================================================
            BARRA DE PESTAÑAS (TABS)
           ======================================================== */}
        <nav aria-label="Navegación de Pestañas" className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`border-2 md:border-3 border-black px-4 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
              activeTab === 'active'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-stone-100'
            }`}
          >
            📁 Pestaña 1: Mazo Activo ({activeCards.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`relative border-2 md:border-3 border-black px-4 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
              activeTab === 'pending'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-stone-100'
            }`}
          >
            ⚡ Pestaña 2: Bandeja de Actualidad & Virales ({pendingCards.length})
            {pendingCards.length > 0 && (
              <span className="ml-2 bg-amber-400 text-black border border-black px-1.5 py-0.2 text-[10px] font-black uppercase">
                NUEVAS
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`border-2 md:border-3 border-black px-4 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
              activeTab === 'create'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-stone-100'
            }`}
          >
            ✍️ Pestaña 3: Añadir Nuevo Caso / Noticia
          </button>
        </nav>

        {/* ========================================================
            PESTAÑA 1: MAZO ACTIVO
           ======================================================== */}
        {activeTab === 'active' && (
          <section aria-label="Catálogo de Cartas Activas" className="flex flex-col gap-4">
            {/* Barra de Filtro y Acciones Rápidas */}
            <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Buscador de texto */}
              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs font-black uppercase">Buscar:</span>
                <input
                  type="text"
                  placeholder="Titular, interlocutor, delito o ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-2 border-black bg-stone-50 px-3 py-1.5 text-xs font-mono font-bold focus:outline-none focus:bg-white"
                />
              </div>

              {/* Selector de Esfera */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase">Esfera:</span>
                {(['ALL', 'POLITICA', 'EMPRESARIAL', 'ORDEN_JUSTICIA'] as const).map((sp) => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => setFilterSphere(sp)}
                    className={`border border-black px-2 py-1 text-[11px] font-bold uppercase transition-colors ${
                      filterSphere === sp
                        ? 'bg-black text-white'
                        : 'bg-stone-100 text-black hover:bg-stone-200'
                    }`}
                  >
                    {sp === 'ALL' ? 'TODAS' : sp}
                  </button>
                ))}
              </div>

              {/* Botones de Utilidad */}
              <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-black/20">
                <button
                  type="button"
                  onClick={handleCopyDeckJson}
                  title="Copiar JSON del mazo para pegarlo o compartirlo"
                  className="border-2 border-black bg-stone-100 hover:bg-black hover:text-white px-3 py-1 text-xs font-black uppercase transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                >
                  [ 📋 COPIAR JSON ]
                </button>
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  title="Restaurar a las cartas originales"
                  className="border-2 border-black bg-white hover:bg-stone-200 px-3 py-1 text-xs font-bold uppercase transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer text-zinc-700"
                >
                  [ 🔄 RESTAURAR ]
                </button>
              </div>
            </div>

            {/* Contador de Resultados */}
            <div className="text-xs font-bold uppercase text-zinc-600 px-1">
              Mostrando {filteredActiveCards.length} de {activeCards.length} cartas en el mazo activo
            </div>

            {/* Listado de Cartas Activas */}
            {filteredActiveCards.length === 0 ? (
              <div className="border-4 border-black bg-white p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-bold uppercase text-sm mb-2">
                  [ NO SE HAN ENCONTRADO CARTAS CON ESOS FILTROS ]
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterSphere('ALL');
                  }}
                  className="border-2 border-black px-3 py-1 text-xs font-black uppercase bg-stone-100 hover:bg-black hover:text-white"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredActiveCards.map((card) => (
                  <article
                    key={card.id}
                    className="border-2 md:border-3 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
                  >
                    <div>
                      {/* Cabecera del Sumario de la Carta */}
                      <div className="flex flex-wrap items-center justify-between gap-1 border-b border-black pb-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-black text-white px-1.5 py-0.5 text-[10px] font-black uppercase">
                            {card.sphere}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-bold">
                            #{card.id}
                          </span>
                        </div>
                        {card.id.startsWith('CUSTOM_') && (
                          <span className="border border-black bg-amber-100 px-1.5 py-0.2 text-[9px] font-black uppercase">
                            EDITORIAL LOCAL
                          </span>
                        )}
                        {card.id.startsWith('VIRAL_') && (
                          <span className="border border-black bg-emerald-100 px-1.5 py-0.2 text-[9px] font-black uppercase">
                            VIRAL INCORPORADO
                          </span>
                        )}
                      </div>

                      {/* Interlocutor con Retrato Fanzine */}
                      <div className="flex items-center gap-2 mb-2">
                        <CharacterPortrait
                          speaker={card.speaker}
                          speakerRole={card.speakerRole}
                          alt={card.speaker}
                          size="sm"
                          className="w-10 h-10 min-w-[40px] min-h-[40px] shrink-0"
                        />
                        <div>
                          <div className="text-xs font-black uppercase text-black leading-snug">
                            {card.speaker}
                          </div>
                          <div className="text-[11px] text-zinc-600 italic">
                            {card.speakerRole}
                          </div>
                        </div>
                      </div>

                      {/* Titular */}
                      <h2 className="text-sm font-black uppercase tracking-tight text-black mb-2 leading-tight">
                        {card.headline}
                      </h2>

                      {/* Contexto */}
                      <p className="text-xs text-zinc-800 leading-relaxed mb-3 bg-stone-50 p-2 border-l-2 border-black">
                        {card.context}
                      </p>

                      {/* Pieza de Convicción */}
                      {card.evidenceDocument && (
                        <div className="text-[11px] text-zinc-700 italic border border-dashed border-black p-1.5 bg-amber-50/50 mb-3">
                          <span className="font-bold uppercase not-italic">📎 Prueba: </span>
                          "{card.evidenceDocument}"
                        </div>
                      )}

                      {/* Previsualización de Decisiones (Izquierda y Derecha) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-black/20 mb-2">
                        {/* Izquierda */}
                        <div className="border border-black p-2 bg-stone-50 text-[11px]">
                          <div className="flex items-center justify-between font-black mb-1">
                            <span className="text-[10px] bg-black text-white px-1 py-0.2">← IZQ</span>
                            <span className="border border-black px-1 text-[9px] uppercase font-bold">
                              {card.leftChoice.stampText}
                            </span>
                          </div>
                          <div className="font-bold text-black text-xs mb-1">
                            {card.leftChoice.label}
                          </div>
                          {card.leftChoice.flavorQuote && (
                            <div className="text-[10px] italic text-zinc-600 mb-1">
                              «{card.leftChoice.flavorQuote}»
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1 text-[9px] font-bold text-zinc-700">
                            {renderModifierBadge('B', card.leftChoice.modifiers.pastaEnB)}
                            {renderModifierBadge('Juez', card.leftChoice.modifiers.presionJudicial)}
                            {renderModifierBadge('Imp', card.leftChoice.modifiers.impunidad)}
                            {renderModifierBadge('Med', card.leftChoice.modifiers.reputacionMediatica)}
                          </div>
                        </div>

                        {/* Derecha */}
                        <div className="border border-black p-2 bg-stone-50 text-[11px]">
                          <div className="flex items-center justify-between font-black mb-1">
                            <span className="text-[10px] bg-black text-white px-1 py-0.2">DER →</span>
                            <span className="border border-black px-1 text-[9px] uppercase font-bold">
                              {card.rightChoice.stampText}
                            </span>
                          </div>
                          <div className="font-bold text-black text-xs mb-1">
                            {card.rightChoice.label}
                          </div>
                          {card.rightChoice.flavorQuote && (
                            <div className="text-[10px] italic text-zinc-600 mb-1">
                              «{card.rightChoice.flavorQuote}»
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1 text-[9px] font-bold text-zinc-700">
                            {renderModifierBadge('B', card.rightChoice.modifiers.pastaEnB)}
                            {renderModifierBadge('Juez', card.rightChoice.modifiers.presionJudicial)}
                            {renderModifierBadge('Imp', card.rightChoice.modifiers.impunidad)}
                            {renderModifierBadge('Med', card.rightChoice.modifiers.reputacionMediatica)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ========================================================
            PESTAÑA 2: BANDEJA DE ACTUALIDAD & VIRALES
           ======================================================== */}
        {activeTab === 'pending' && (
          <section aria-label="Bandeja de Actualidad y Virales" className="flex flex-col gap-4">
            <div className="border-2 border-black bg-amber-50 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-black mb-1">
                PROPUESTAS DE ACTUALIDAD POLÍTICA PENDIENTES DE REVISIÓN
              </h2>
              <p className="text-xs text-zinc-700">
                Estas cartas corresponden a sucesos virales y temas candentes redactados por el equipo. Pulsa [APROBAR] para inyectarlas directamente en el mazo de juego de forma inmediata, o [DESCARTAR] si no encajan con la línea editorial.
              </p>
            </div>

            {pendingCards.length === 0 ? (
              <div className="border-4 border-black bg-white p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-black uppercase text-base mb-2">
                  ★ BANDEJA AL DÍA: TODAS LAS PROPUESTAS HAN SIDO DILIGENCIADAS ★
                </p>
                <p className="text-xs text-zinc-600 mb-4">
                  No quedan cartas virales pendientes en la bandeja de entrada.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const basePending = initialPendingCards as unknown as ReignsCard[];
                    savePendingCards(basePending);
                    showToast('Propuestas virales recargadas.');
                  }}
                  className="border-2 border-black bg-black text-white hover:bg-zinc-800 px-4 py-2 text-xs font-black uppercase tracking-wider"
                >
                  Recargar Propuestas Virales Iniciales
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {pendingCards.map((card) => (
                  <article
                    key={card.id}
                    className="border-3 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  >
                    {/* Fila superior: ID y Esfera */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-400 text-black border border-black px-2 py-0.5 text-xs font-black uppercase">
                          PROPUESTA VIRAL
                        </span>
                        <span className="text-xs font-black uppercase">
                          {card.sphere}
                        </span>
                        <span className="text-xs text-zinc-500">
                          #{card.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <CharacterPortrait
                          speaker={card.speaker}
                          speakerRole={card.speakerRole}
                          alt={card.speaker}
                          size="sm"
                          className="w-10 h-10 min-w-[40px] min-h-[40px] shrink-0"
                        />
                        <div className="text-xs font-bold text-zinc-600 uppercase">
                          Interlocutor: <span className="text-black font-black">{card.speaker}</span> ({card.speakerRole})
                        </div>
                      </div>
                    </div>

                    {/* Titular y Contexto */}
                    <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-black mb-2">
                      {card.headline}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed bg-stone-50 p-3 border-l-4 border-black mb-3">
                      {card.context}
                    </p>

                    {card.evidenceDocument && (
                      <div className="text-xs text-zinc-700 italic border border-dashed border-black p-2 bg-amber-50 mb-4">
                        <span className="font-bold uppercase not-italic">📎 Prueba Incautada: </span>
                        "{card.evidenceDocument}"
                      </div>
                    )}

                    {/* Desglose de Elecciones */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                      {/* Izquierda */}
                      <div className="border-2 border-black p-3 bg-stone-50">
                        <div className="flex items-center justify-between border-b border-black pb-1 mb-1.5">
                          <span className="text-xs font-black bg-black text-white px-1.5 py-0.2">
                            ← DECISIÓN IZQUIERDA
                          </span>
                          <span className="border border-black px-1.5 py-0.2 text-[10px] font-black uppercase bg-white">
                            {card.leftChoice.stampText}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-black mb-1">
                          {card.leftChoice.label}
                        </div>
                        {card.leftChoice.flavorQuote && (
                          <div className="text-xs italic text-zinc-700 mb-2">
                            «{card.leftChoice.flavorQuote}»
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1 text-[10px] font-bold">
                          {renderModifierBadge('Pasta B', card.leftChoice.modifiers.pastaEnB)}
                          {renderModifierBadge('Presión UCO', card.leftChoice.modifiers.presionJudicial)}
                          {renderModifierBadge('Impunidad', card.leftChoice.modifiers.impunidad)}
                          {renderModifierBadge('Prensa', card.leftChoice.modifiers.reputacionMediatica)}
                        </div>
                      </div>

                      {/* Derecha */}
                      <div className="border-2 border-black p-3 bg-stone-50">
                        <div className="flex items-center justify-between border-b border-black pb-1 mb-1.5">
                          <span className="text-xs font-black bg-black text-white px-1.5 py-0.2">
                            DECISIÓN DERECHA →
                          </span>
                          <span className="border border-black px-1.5 py-0.2 text-[10px] font-black uppercase bg-white">
                            {card.rightChoice.stampText}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-black mb-1">
                          {card.rightChoice.label}
                        </div>
                        {card.rightChoice.flavorQuote && (
                          <div className="text-xs italic text-zinc-700 mb-2">
                            «{card.rightChoice.flavorQuote}»
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1 text-[10px] font-bold">
                          {renderModifierBadge('Pasta B', card.rightChoice.modifiers.pastaEnB)}
                          {renderModifierBadge('Presión UCO', card.rightChoice.modifiers.presionJudicial)}
                          {renderModifierBadge('Impunidad', card.rightChoice.modifiers.impunidad)}
                          {renderModifierBadge('Prensa', card.rightChoice.modifiers.reputacionMediatica)}
                        </div>
                      </div>
                    </div>

                    {/* BOTONES DE ACCIÓN RÁPIDA */}
                    <div className="flex flex-wrap gap-3 pt-3 border-t-2 border-black">
                      <button
                        type="button"
                        onClick={() => handleApproveViral(card)}
                        className="flex-1 border-2 border-black bg-black text-white hover:bg-zinc-800 py-3 px-4 text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-center"
                      >
                        [ ✓ APROBAR E INCORPORAR AL JUEGO ]
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDiscardViral(card.id)}
                        className="border-2 border-black bg-white hover:bg-red-50 py-3 px-6 text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-center text-black"
                      >
                        [ ✕ DESCARTAR ]
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ========================================================
            PESTAÑA 3: AÑADIR NUEVO CASO / NOTICIA (FORMULARIO)
           ======================================================== */}
        {activeTab === 'create' && (
          <section aria-label="Formulario de Creación de Caso" className="flex flex-col gap-6">
            <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-base font-black uppercase tracking-tight text-black mb-1">
                REDACTAR NUEVA CAUSA JUDICIAL O ESCÁNDALO POLÍTICO
              </h2>
              <p className="text-xs text-zinc-700">
                Formulario visual asistido para usuarios no técnicos. Introduce los datos del dilema y las dos opciones; la carta quedará registrada en el mazo activo inmediatamente.
              </p>
            </div>

            {formError && (
              <div className="border-2 border-black bg-red-100 text-black p-3 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                ⚠️ Error: {formError}
              </div>
            )}

            <form onSubmit={handleCreateCardSubmit} className="flex flex-col gap-6">
              {/* BLOQUE 1: DATOS GENERALES DEL CASO */}
              <fieldset className="border-3 border-black bg-white p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                <legend className="bg-black text-white px-2 py-0.5 text-xs font-black uppercase tracking-widest">
                  1. EXPEDIENTE GENERAL Y SUMARIO
                </legend>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black uppercase mb-1">
                      Titular del Dilema (Headline) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. REPARTO DE SOBRES EN EL PARKING DEL MINISTERIO"
                      value={formData.headline}
                      onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                      className="w-full border-2 border-black p-2 text-xs font-bold bg-stone-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase mb-1">
                      Esfera de Poder *
                    </label>
                    <select
                      value={formData.sphere}
                      onChange={(e) => setFormData({ ...formData, sphere: e.target.value as SphereType })}
                      className="w-full border-2 border-black p-2 text-xs font-bold bg-stone-50 focus:bg-white focus:outline-none"
                    >
                      <option value="POLITICA">POLÍTICA (Cargos, elecciones, sedes)</option>
                      <option value="EMPRESARIAL">EMPRESARIAL (Constructores, mordidas, IBEX)</option>
                      <option value="ORDEN_JUSTICIA">ORDEN Y JUSTICIA (Fiscalía, cloacas, UCO)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase mb-1">
                      Quién lo plantea (Nombre del Interlocutor / NPC) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Comisario Pepe / El Consejero Delegado"
                      value={formData.speaker}
                      onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                      className="w-full border-2 border-black p-2 text-xs font-bold bg-stone-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase mb-1">
                      Cargo o Papel del Interlocutor
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Mando de la Brigada de Información"
                      value={formData.speakerRole}
                      onChange={(e) => setFormData({ ...formData, speakerRole: e.target.value })}
                      className="w-full border-2 border-black p-2 text-xs font-bold bg-stone-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase mb-1">
                      Pieza de Convicción Incautada (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Libreta Moleskine con iniciales y cifras a lápiz"
                      value={formData.evidenceDocument}
                      onChange={(e) => setFormData({ ...formData, evidenceDocument: e.target.value })}
                      className="w-full border-2 border-black p-2 text-xs font-bold bg-stone-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-black uppercase mb-1">
                      Qué ocurre / Dilema Fanzine (Contexto) *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Narra la escena con tono satírico y crudeza institucional..."
                      value={formData.context}
                      onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                      className="w-full border-2 border-black p-2 text-xs font-bold bg-stone-50 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </fieldset>

              {/* BLOQUE 2: DECISIÓN IZQUIERDA Y DERECHA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* DECISIÓN IZQUIERDA (← SWIPE IZQ) */}
                <fieldset className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <legend className="bg-black text-white px-2 py-0.5 text-xs font-black uppercase tracking-widest">
                    2. DECISIÓN IZQUIERDA (← DESLIZAR IZQ)
                  </legend>

                  <div className="flex flex-col gap-3 mt-2">
                    <div>
                      <label className="block text-xs font-black uppercase mb-1">
                        Acción Elegida (Label) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Pagar en mano y destruir el albarán"
                        value={formData.leftLabel}
                        onChange={(e) => setFormData({ ...formData, leftLabel: e.target.value })}
                        className="w-full border-2 border-black p-2 text-xs font-bold bg-stone-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase mb-1">
                        Texto Sello de Caucho (Stamp) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. TRINCAR / BÚNKER / PAGAR"
                        value={formData.leftStampText}
                        onChange={(e) => setFormData({ ...formData, leftStampText: e.target.value })}
                        className="w-full border-2 border-black p-2 text-xs font-black uppercase bg-stone-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase mb-1">
                        Cita de Escucha UCO (Flavor Quote)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. «Esto en dos semanas está prescrito, tú tranquilo.»"
                        value={formData.leftFlavorQuote}
                        onChange={(e) => setFormData({ ...formData, leftFlavorQuote: e.target.value })}
                        className="w-full border-2 border-black p-2 text-xs italic bg-stone-50"
                      />
                    </div>

                    {/* Deslizadores de Impacto */}
                    <div className="border-t border-black pt-2 mt-1">
                      <span className="text-[11px] font-black uppercase text-zinc-600 block mb-2">
                        IMPACTO EN ESTADÍSTICAS (-30 a +30):
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <SliderField
                          label="Pasta en B"
                          value={formData.leftPasta}
                          onChange={(v) => setFormData({ ...formData, leftPasta: v })}
                        />
                        <SliderField
                          label="Presión Judicial"
                          value={formData.leftPresion}
                          onChange={(v) => setFormData({ ...formData, leftPresion: v })}
                        />
                        <SliderField
                          label="Impunidad"
                          value={formData.leftImpunidad}
                          onChange={(v) => setFormData({ ...formData, leftImpunidad: v })}
                        />
                        <SliderField
                          label="Reputación Prensa"
                          value={formData.leftPrensa}
                          onChange={(v) => setFormData({ ...formData, leftPrensa: v })}
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* DECISIÓN DERECHA (SWIPE DER →) */}
                <fieldset className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <legend className="bg-black text-white px-2 py-0.5 text-xs font-black uppercase tracking-widest">
                    3. DECISIÓN DERECHA (DESLIZAR DER →)
                  </legend>

                  <div className="flex flex-col gap-3 mt-2">
                    <div>
                      <label className="block text-xs font-black uppercase mb-1">
                        Acción Elegida (Label) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Convocar rueda de prensa y negar los hechos"
                        value={formData.rightLabel}
                        onChange={(e) => setFormData({ ...formData, rightLabel: e.target.value })}
                        className="w-full border-2 border-black p-2 text-xs font-bold bg-stone-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase mb-1">
                        Texto Sello de Caucho (Stamp) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. NEGAR / PACTAR / DENUNCIAR"
                        value={formData.rightStampText}
                        onChange={(e) => setFormData({ ...formData, rightStampText: e.target.value })}
                        className="w-full border-2 border-black p-2 text-xs font-black uppercase bg-stone-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase mb-1">
                        Cita de Escucha UCO (Flavor Quote)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. «Que se investigue hasta el final, caiga quien caiga.»"
                        value={formData.rightFlavorQuote}
                        onChange={(e) => setFormData({ ...formData, rightFlavorQuote: e.target.value })}
                        className="w-full border-2 border-black p-2 text-xs italic bg-stone-50"
                      />
                    </div>

                    {/* Deslizadores de Impacto */}
                    <div className="border-t border-black pt-2 mt-1">
                      <span className="text-[11px] font-black uppercase text-zinc-600 block mb-2">
                        IMPACTO EN ESTADÍSTICAS (-30 a +30):
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <SliderField
                          label="Pasta en B"
                          value={formData.rightPasta}
                          onChange={(v) => setFormData({ ...formData, rightPasta: v })}
                        />
                        <SliderField
                          label="Presión Judicial"
                          value={formData.rightPresion}
                          onChange={(v) => setFormData({ ...formData, rightPresion: v })}
                        />
                        <SliderField
                          label="Impunidad"
                          value={formData.rightImpunidad}
                          onChange={(v) => setFormData({ ...formData, rightImpunidad: v })}
                        />
                        <SliderField
                          label="Reputación Prensa"
                          value={formData.rightPrensa}
                          onChange={(v) => setFormData({ ...formData, rightPrensa: v })}
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>

              {/* BOTÓN DE GUARDADO PRINCIPAL */}
              <button
                type="submit"
                className="w-full border-3 md:border-4 border-black bg-black text-white hover:bg-zinc-800 py-4 px-6 text-sm font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-center"
              >
                [ 💾 GUARDAR EN EL MAZO ACTIVO ]
              </button>
            </form>
          </section>
        )}

        {/* PIE DE PÁGINA ADMIN */}
        <footer className="border-t-2 border-black pt-4 pb-8 text-center text-xs text-zinc-600">
          <div className="font-bold uppercase tracking-wider mb-1">
            PANEL ADMINISTRATIVO // IBEX-35 & PÚNICA FANZINE
          </div>
          <div className="text-[10px] uppercase">
            Las modificaciones en caliente se sincronizan en tu navegador y servidor mediante almacenamiento seguro.
          </div>
        </footer>

      </div>
    </main>
  );
}

// Helper: Mini badge de modificadores
function renderModifierBadge(label: string, value: number | undefined) {
  if (value === undefined || value === 0) return null;
  const isPos = value > 0;
  return (
    <span
      className={`border px-1 py-0.2 ${
        isPos ? 'border-black bg-stone-100' : 'border-black bg-zinc-200'
      }`}
    >
      {label}: {isPos ? `+${value}` : value}
    </span>
  );
}

// Helper: Selector / Stepper de Modificadores para usuarios no técnicos
function SliderField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="border border-black p-1.5 bg-stone-50">
      <div className="flex items-center justify-between text-[10px] font-black uppercase mb-1">
        <span>{label}</span>
        <span
          className={`px-1 font-bold ${
            value > 0 ? 'bg-black text-white' : value < 0 ? 'bg-zinc-700 text-white' : 'text-zinc-500'
          }`}
        >
          {value > 0 ? `+${value}` : value}
        </span>
      </div>
      <input
        type="range"
        min="-30"
        max="30"
        step="5"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full accent-black cursor-pointer"
      />
      <div className="flex justify-between text-[9px] text-zinc-500 font-bold">
        <span>-30</span>
        <span>0</span>
        <span>+30</span>
      </div>
    </div>
  );
}
