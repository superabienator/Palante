/**
 * Motor de Efectos de Sonido Analógicos y Procedurales (Web Audio API)
 * Diseñado para fanzine punk / sátira política ibérica.
 * Cero dependencias externas, cero latencia y compatible con SSR.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private listeners: Array<(muted: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('ibex_fanzine_sound_muted');
        this.muted = stored === 'true';
      } catch {
        this.muted = false;
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ibex_fanzine_sound_muted', String(this.muted));
      } catch {}
    }
    this.listeners.forEach((fn) => fn(this.muted));
    return this.muted;
  }

  public onMuteChange(callback: (muted: boolean) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((fn) => fn !== callback);
    };
  }

  /**
   * 1. Sonido de deslizamiento de papel / fanzine rugoso (Swipe)
   */
  public playPaperSwipe(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const duration = 0.09;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Ruido blanco filtrado con modulación para textura de papel
    for (let i = 0; i < bufferSize; i++) {
      const t = i / bufferSize;
      const envelope = Math.sin(t * Math.PI);
      data[i] = (Math.random() * 2 - 1) * envelope * 0.35;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2600, ctx.currentTime + duration);
    filter.Q.value = 1.2;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  }

  /**
   * 2. Golpe de sello de caucho oficial (Stamp Impact)
   * Impacto seco, golpe de tinta y resonancia de escritorio ministerial.
   */
  public playStampImpact(isLeft: boolean = true): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Componente grave (impacto de madera contra escritorio)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = isLeft ? 'triangle' : 'sine';
    const baseFreq = isLeft ? 130 : 110;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.12);

    oscGain.gain.setValueAtTime(0.45, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);

    // Componente agudo (chasquido de tinta y muelle del tampón)
    const bufferSize = Math.floor(ctx.sampleRate * 0.05);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const snap = ctx.createBufferSource();
    snap.buffer = buffer;

    const snapFilter = ctx.createBiquadFilter();
    snapFilter.type = 'highpass';
    snapFilter.frequency.setValueAtTime(800, now);

    const snapGain = ctx.createGain();
    snapGain.gain.setValueAtTime(0.25, now);
    snapGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    snap.connect(snapFilter);
    snapFilter.connect(snapGain);
    snapGain.connect(ctx.destination);

    snap.start(now);
  }

  /**
   * 3. Tirada de dados de sumario (Dice clatter)
   * Repiqueteo de dados rodando sobre mesa de madera.
   */
  public playDiceRoll(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const clackCount = 4;

    for (let i = 0; i < clackCount; i++) {
      const delay = now + i * 0.045 + Math.random() * 0.015;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const freq = 340 + Math.random() * 220;
      osc.frequency.setValueAtTime(freq, delay);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.6, delay + 0.035);

      gain.gain.setValueAtTime(0.2, delay);
      gain.gain.exponentialRampToValueAtTime(0.005, delay + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(delay);
      osc.stop(delay + 0.04);
    }
  }

  /**
   * 4. Tintineo de billetes / Caja registradora / Pasta en B
   * Armónicos metálicos de cobro en paraíso fiscal.
   */
  public playCashChime(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [1318.5, 1760.0]; // E6, A6

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  /**
   * 5. Alerta de crisis procesal / Noticia viral (Walkie-talkie UCO / Teletipo)
   */
  public playCrisisAlert(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(587.33, now + 0.08); // Salto a Re5
    osc.frequency.setValueAtTime(880, now + 0.16); // Salto a La5

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * 6. Martillazo de juez / Sentencia judicial (Gavel strike)
   */
  public playGavel(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Doble golpe característico del mazo
    [0, 0.14].forEach((offset) => {
      const t = now + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.14);
    });
  }
}

export const soundManager = new SoundManager();
