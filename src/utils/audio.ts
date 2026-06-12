// Retro 8-Bit & Lofi Synthesizer using Web Audio API
class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true; // start muted for autoplay policy
  private ambientInterval: any = null;
  private vinylInterval: any = null;
  private currentCarbonLevel: number = 1.0; // 0 (healthy) to 1 (polluted)
  
  // Lofi loop variables
  private chordIndex: number = 0;
  private stepIndex: number = 0;

  constructor() {
    // Lazy initialized on first user interaction
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAmbient();
    } else {
      this.startAmbient();
    }
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }

  // Synthesize Mechanical Keyboard Click (Cherry MX Blue/Brown)
  playClick(type: 'tactile' | 'spacebar' = 'tactile') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Low frequency bottom-out clack
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(type === 'tactile' ? 700 : 350, now);
    osc.frequency.exponentialRampToValueAtTime(type === 'tactile' ? 250 : 120, now + 0.03);

    gain.gain.setValueAtTime(type === 'tactile' ? 0.06 : 0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.05);

    // 2. High frequency tactile snap (Filtered White Noise)
    const bufferSize = this.ctx.sampleRate * 0.015; // 15ms burst
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(type === 'tactile' ? 4200 : 2500, now);
    filter.Q.setValueAtTime(4, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(type === 'tactile' ? 0.05 : 0.03, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.02);
  }

  // Map swipe sound effects to mechanical clicks
  playSuccess() {
    this.playClick('tactile');
  }

  playDecline() {
    this.playClick('spacebar');
  }

  // Success Jingle (Tactile click cascades)
  playJingle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Retro chord run: C5 -> E5 -> G5 -> C6
    const freqs = [523.25, 659.25, 783.99, 1046.50];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.08, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.25);
    });
  }

  // Synthesize vinyl crackle (random soft ticks)
  private playVinylTick() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Random high frequency dust tick
    osc.frequency.setValueAtTime(Math.random() * 6000 + 1000, now);
    
    // Very quiet
    gain.gain.setValueAtTime(Math.random() * 0.0025, now);
    gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.004);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.005);
  }

  // Synthesize soft lofi kick drum
  private playLofiKick(time: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.12);

    gain.gain.setValueAtTime(0.06, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.15);

    // Filter to make it muddy/deep
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(150, time);

    osc.connect(lp);
    lp.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.18);
  }

  // Synthesize soft lofi snare (rimshot)
  private playLofiSnare(time: number) {
    if (!this.ctx) return;
    
    // Low frequency body
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, time);
    gain.gain.setValueAtTime(0.03, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(time);
    osc.stop(time + 0.1);

    // Noise snap (highly filtered)
    const bufferSize = this.ctx.sampleRate * 0.06; // 60ms
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(1000, time);
    bp.Q.setValueAtTime(2, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.025, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);

    noise.connect(bp);
    bp.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(time);
    noise.stop(time + 0.07);
  }

  // Synthesize warm Rhodes-like chill chord keys
  private playRhodesNotes(freqs: number[], time: number) {
    if (!this.ctx) return;

    // Apply detuning (wow/flutter) based on carbon footprint (High Carbon = wobbly cassette)
    const wobbleAmt = this.currentCarbonLevel * 8; // up to 8Hz detuning wobble

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Soft triangle wave filtered creates rhodes bell tone
      osc.type = 'triangle';
      
      // Detuned slightly for lofi organic width + wobble
      const detune = (Math.random() - 0.5) * 5;
      osc.detune.setValueAtTime(detune, time);
      osc.frequency.setValueAtTime(freq, time + idx * 0.035); // arpeggiated roll
      
      // Wobble modulation
      if (wobbleAmt > 0) {
        osc.frequency.linearRampToValueAtTime(freq + wobbleAmt, time + 1.0);
        osc.frequency.linearRampToValueAtTime(freq - wobbleAmt, time + 2.0);
      }

      // Smooth envelope (slow attack, long decay)
      gain.gain.setValueAtTime(0, time + idx * 0.035);
      gain.gain.linearRampToValueAtTime(0.022, time + idx * 0.035 + 0.12); // slow soft attack
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.5); // long chill decay

      // Warm low pass filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      // Muffled filter for high carbon, clean/bright for low carbon
      const filterFreq = 1000 - (this.currentCarbonLevel * 500); 
      filter.frequency.setValueAtTime(filterFreq, time);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time + idx * 0.035);
      osc.stop(time + 3.0);
    });
  }

  // Start background vinyl & lofi beat loops
  startAmbient() {
    if (this.isMuted) return;
    this.init();
    this.stopAmbient();

    // 1. Vinyl dust pops generator (repeats very fast randomly)
    const runVinyl = () => {
      this.playVinylTick();
      const nextTick = Math.random() * 200 + 40; // 40ms to 240ms
      this.vinylInterval = setTimeout(runVinyl, nextTick);
    };
    runVinyl();

    // 2. Chill lofi sequencer drum beat + Rhodes chords
    // Chords are selected based on carbon footprint (Major for healthy, minor/dissonant for polluted)
    const getChords = () => {
      if (this.currentCarbonLevel > 0.7) {
        // Uncomfortable, dark lofi chords
        return [
          [110.00, 130.81, 155.56, 196.00], // Am7b5
          [98.00, 116.54, 146.83, 174.61],  // Gm6
          [87.31, 103.83, 130.81, 164.81],  // Fm7
          [73.42, 87.31, 110.00, 138.59]     // Ddim7
        ];
      } else if (this.currentCarbonLevel > 0.45) {
        // Melancholic, neutral chill chords
        return [
          [110.00, 130.81, 164.81, 196.00], // Am7
          [98.00, 116.54, 146.83, 174.61],  // Gm7
          [87.31, 110.00, 130.81, 164.81],  // Fmaj7
          [73.42, 87.31, 110.00, 130.81]     // Dm7
        ];
      } else {
        // Bright, soothing major 7th lofi chords
        return [
          [130.81, 164.81, 196.00, 246.94], // Cmaj7
          [110.00, 130.81, 164.81, 196.00], // Am7
          [87.31, 110.00, 130.81, 164.81],  // Fmaj7
          [98.00, 123.47, 146.83, 196.00]   // G7
        ];
      }
    };

    // Sequence timing step rate: 375ms per step (8 steps = 3 seconds)
    const stepRate = 375;
    
    const runSequence = () => {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const chords = getChords();

      // Step 0: Play Rhodes chord + Kick
      if (this.stepIndex === 0) {
        const currentChord = chords[this.chordIndex];
        this.playRhodesNotes(currentChord, now);
        this.playLofiKick(now);
      }

      // Step 2: Snare
      if (this.stepIndex === 2) {
        this.playLofiSnare(now);
      }

      // Step 4: Kick
      if (this.stepIndex === 4) {
        this.playLofiKick(now);
      }
      
      // Step 5: Double kick skip
      if (this.stepIndex === 5 && Math.random() > 0.4) {
        this.playLofiKick(now + 0.18);
      }

      // Step 6: Snare
      if (this.stepIndex === 6) {
        this.playLofiSnare(now);
      }

      // Advance sequencer steps
      this.stepIndex = (this.stepIndex + 1) % 8;
      if (this.stepIndex === 0) {
        this.chordIndex = (this.chordIndex + 1) % chords.length;
      }

      // Tempo stretches slightly slower/sluggish under high pollution
      const dynamicTempo = stepRate + (this.currentCarbonLevel * 100); // 375ms to 475ms per step
      this.ambientInterval = setTimeout(runSequence, dynamicTempo);
    };

    runSequence();
  }

  stopAmbient() {
    if (this.ambientInterval) {
      clearTimeout(this.ambientInterval);
      this.ambientInterval = null;
    }
    if (this.vinylInterval) {
      clearTimeout(this.vinylInterval);
      this.vinylInterval = null;
    }
  }

  updateCarbonLevel(level: number) {
    this.currentCarbonLevel = Math.max(0, Math.min(1, level));
  }
}

export const audio = new AudioManager();
