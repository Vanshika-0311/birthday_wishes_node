/**
 * Web Audio API synthesizer for birthday sounds and melodies.
 * Zero external audio file dependencies ensures 100% offline and sandbox reliability.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMelodyPlaying: boolean = false;
  private melodyTimeouts: number[] = [];

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopMelody();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Quick pleasant balloon pop sound
   */
  public playBalloonPop() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.13);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Candle blowing out sound (soft breath/puff)
   */
  public playCandleBlow() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.35);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(ctx.currentTime);
      noise.stop(ctx.currentTime + 0.4);
    } catch {
      // Ignore
    }
  }

  /**
   * Sparkle chime arpeggio for card opens and celebrations
   */
  public playChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const timeout = window.setTimeout(() => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.45);
      }, idx * 70);
      this.melodyTimeouts.push(timeout);
    });
  }

  /**
   * Music box Happy Birthday melody
   */
  public toggleHappyBirthdayMelody(onEnd?: () => void): boolean {
    if (this.isMelodyPlaying) {
      this.stopMelody();
      return false;
    }

    if (this.isMuted) {
      this.isMuted = false;
    }

    const ctx = this.getContext();
    if (!ctx) return false;

    this.isMelodyPlaying = true;

    // Melody: [frequency (Hz), duration (s), delay (s)]
    // Happy Birthday in C major
    const melody: [number, number, number][] = [
      [261.63, 0.25, 0],     // C4
      [261.63, 0.25, 0.3],   // C4
      [293.66, 0.5, 0.6],    // D4
      [261.63, 0.5, 1.2],    // C4
      [349.23, 0.5, 1.8],    // F4
      [329.63, 0.9, 2.4],    // E4

      [261.63, 0.25, 3.5],   // C4
      [261.63, 0.25, 3.8],   // C4
      [293.66, 0.5, 4.1],    // D4
      [261.63, 0.5, 4.7],    // C4
      [392.00, 0.5, 5.3],    // G4
      [349.23, 0.9, 5.9],    // F4

      [261.63, 0.25, 7.0],   // C4
      [261.63, 0.25, 7.3],   // C4
      [523.25, 0.5, 7.6],    // C5
      [440.00, 0.5, 8.2],    // A4
      [349.23, 0.5, 8.8],    // F4
      [329.63, 0.5, 9.4],    // E4
      [293.66, 0.7, 10.0],   // D4

      [466.16, 0.25, 11.0],  // Bb4
      [466.16, 0.25, 11.3],  // Bb4
      [440.00, 0.5, 11.6],   // A4
      [349.23, 0.5, 12.2],   // F4
      [392.00, 0.5, 12.8],   // G4
      [349.23, 1.2, 13.4],   // F4
    ];

    melody.forEach(([freq, dur, start]) => {
      const timeout = window.setTimeout(() => {
        if (!this.isMelodyPlaying || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Music box bell / celesta timbre
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + dur + 0.1);
      }, start * 1000);

      this.melodyTimeouts.push(timeout);
    });

    const endTimeout = window.setTimeout(() => {
      this.isMelodyPlaying = false;
      if (onEnd) onEnd();
    }, 15000);
    this.melodyTimeouts.push(endTimeout);

    return true;
  }

  public stopMelody() {
    this.isMelodyPlaying = false;
    this.melodyTimeouts.forEach(t => clearTimeout(t));
    this.melodyTimeouts = [];
  }

  public getIsMelodyPlaying(): boolean {
    return this.isMelodyPlaying;
  }
}

export const soundFx = new SoundSystem();
