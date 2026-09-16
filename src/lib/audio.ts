// Web Audio API Synthesizer for high-fidelity UI & Cyberpunk Lofi soundscape
// 100% procedural, zero latency, zero external assets, plays continuously

class AudioManager {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private volume: number = 0.75;
    private isMuted: boolean = false;
    private isLofiPlaying: boolean = false;
    private lofiIntervalId: number | null = null;
    private vinylNode: AudioNode | null = null;
    private stepIndex: number = 0;
    private autoStartInitialized: boolean = false;

    constructor() {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('portfolio_audio_muted');
            this.isMuted = saved !== null ? saved === 'true' : false;

            const savedVol = localStorage.getItem('portfolio_audio_volume');
            this.volume = savedVol !== null ? parseFloat(savedVol) : 0.75;

            // Automatically start Lofi on first user interaction if blocked by browser autoplay policy
            this.setupAutoPlayTrigger();
        }
    }

    private getContext(): AudioContext | null {
        if (typeof window === 'undefined') return null;
        if (!this.ctx) {
            const AudioCtx =
                window.AudioContext ||
                (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
        return this.ctx;
    }

    public getDest(ctx: AudioContext): AudioNode {
        if (!this.masterGain || this.masterGain.context !== ctx) {
            this.masterGain = ctx.createGain();
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, ctx.currentTime);
            this.masterGain.connect(ctx.destination);
        }
        return this.masterGain;
    }

    public setVolume(val: number): void {
        this.volume = Math.max(0, Math.min(1, val));
        if (typeof window !== 'undefined') {
            localStorage.setItem('portfolio_audio_volume', String(this.volume));
        }
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        }
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('portfolio_volume_change', { detail: { volume: this.volume } }));
        }
    }

    public getVolume(): number {
        return this.volume;
    }

    private setupAutoPlayTrigger() {
        if (this.autoStartInitialized) return;
        this.autoStartInitialized = true;

        const startOnGesture = () => {
            const ctx = this.getContext();
            if (ctx && ctx.state === 'suspended') {
                ctx.resume().then(() => {
                    if (!this.isMuted && !this.isLofiPlaying) {
                        this.startLofi();
                    }
                });
            } else if (!this.isMuted && !this.isLofiPlaying) {
                this.startLofi();
            }

            // Remove listeners once unlocked
            window.removeEventListener('click', startOnGesture);
            window.removeEventListener('pointerdown', startOnGesture);
            window.removeEventListener('keydown', startOnGesture);
            window.removeEventListener('scroll', startOnGesture);
        };

        window.addEventListener('click', startOnGesture, { once: true });
        window.addEventListener('pointerdown', startOnGesture, { once: true });
        window.addEventListener('keydown', startOnGesture, { once: true });
        window.addEventListener('scroll', startOnGesture, { once: true });

        // Also attempt direct startup immediately
        setTimeout(() => {
            if (!this.isMuted && !this.isLofiPlaying) {
                this.startLofi();
            }
        }, 300);
    }

    public toggleMute(): boolean {
        this.isMuted = !this.isMuted;
        if (typeof window !== 'undefined') {
            localStorage.setItem('portfolio_audio_muted', String(this.isMuted));
        }
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        }
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('portfolio_mute_change', { detail: { isMuted: this.isMuted } }));
        }
        if (!this.isMuted) {
            this.startLofi();
            this.playSuccess();
        } else {
            this.stopLofi();
        }
        return this.isMuted;
    }

    public getMuted(): boolean {
        return this.isMuted;
    }

    public setMuted(muted: boolean): void {
        this.isMuted = muted;
        if (typeof window !== 'undefined') {
            localStorage.setItem('portfolio_audio_muted', String(muted));
        }
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        }
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('portfolio_mute_change', { detail: { isMuted: this.isMuted } }));
        }
        if (muted) {
            this.stopLofi();
        } else {
            this.startLofi();
        }
    }

    // -------------------------------------------------------------
    // PROCEDURAL VINYL / RAIN CRACKLE TEXTURE
    // -------------------------------------------------------------
    private startVinylCrackle() {
        const ctx = this.getContext();
        if (!ctx || this.vinylNode) return;

        try {
            const bufferSize = ctx.sampleRate * 2;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);

            // Generate soft warm noise with random dust pops
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                const pop = Math.random() > 0.9992 ? (Math.random() - 0.5) * 0.4 : 0;
                data[i] = white * 0.015 + pop;
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            noise.loop = true;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1400;
            filter.Q.value = 1.0;

            const gain = ctx.createGain();
            gain.gain.value = 0.012; // Subtle ambient warmth

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.getDest(ctx));

            noise.start();
            this.vinylNode = gain;
        } catch {
            // Audio context restriction handled gracefully
        }
    }

    // -------------------------------------------------------------
    // SOPHISTICATED CYBER LOFI CHILLHOP GENERATOR
    // -------------------------------------------------------------
    public startLofi() {
        if (this.isLofiPlaying || this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        this.isLofiPlaying = true;
        this.startVinylCrackle();

        // 76 BPM Lofi Chillhop groove (1 beat = 0.789s, 1 sixteenth = 0.197s)
        const stepDurationMs = 197;

        // Jazzy Cyberpunk Neo-Soul Chord Progression:
        // Chord 1: Dm9
        // Chord 2: G13
        // Chord 3: Cmaj9
        // Chord 4: Am9
        const chords = [
            {
                bass: 73.42, // D2
                notes: [146.83, 220.00, 261.63, 293.66, 349.23], // D3, A3, C4, E4, F4 (Dm9)
            },
            {
                bass: 98.00, // G2
                notes: [196.00, 246.94, 293.66, 329.63, 392.00], // G3, B3, E4, G4, A4 (G13)
            },
            {
                bass: 65.41, // C2
                notes: [130.81, 196.00, 246.94, 293.66, 329.63], // C3, G3, B3, D4, E4 (Cmaj9)
            },
            {
                bass: 110.00, // A2
                notes: [164.81, 220.00, 261.63, 293.66, 329.63], // E3, A3, C4, E4, G4 (Am9)
            },
        ];

        const tick = () => {
            if (!this.isLofiPlaying || this.isMuted) return;
            const currentCtx = this.getContext();
            if (!currentCtx) return;

            const now = currentCtx.currentTime;
            const stepInBar = this.stepIndex % 16; // 16 steps per bar (4 beats of 4 sixteenths)
            const barIndex = Math.floor((this.stepIndex / 16) % 4);
            const currentChord = chords[barIndex];

            // 1. PLAY RHODES ELECTRIC PIANO CHORD (On beat 1, beat 2.5 anticipation, beat 4)
            if (stepInBar === 0 || stepInBar === 6) {
                const chordDuration = stepInBar === 0 ? 1.6 : 1.2;
                this.playRhodesChord(currentCtx, currentChord.notes, now, chordDuration);
            }

            // 2. PLAY WARM SUB BASSLINE
            if (stepInBar === 0 || stepInBar === 10) {
                this.playSubBass(currentCtx, currentChord.bass, now, 1.2);
            }

            // 3. PLAY SOFT LOFI DRUMS
            // Kick on beat 1 (step 0) and syncopated beat 2.5 (step 6) and beat 3.5 (step 11)
            if (stepInBar === 0 || stepInBar === 6 || stepInBar === 11) {
                this.playLofiKick(currentCtx, now);
            }

            // Soft Rim / Snare on beat 2 (step 4) and beat 4 (step 12)
            if (stepInBar === 4 || stepInBar === 12) {
                this.playLofiSnare(currentCtx, now);
            }

            // Swing Hi-hat on every eighth note (step 0, 2, 4, 6, 8, 10, 12, 14)
            if (stepInBar % 2 === 0) {
                const isOffbeat = stepInBar % 4 !== 0;
                this.playLofiHat(currentCtx, now, isOffbeat ? 0.015 : 0.025);
            }

            this.stepIndex++;
        };

        // Start step sequencer
        this.stepIndex = 0;
        tick();
        this.lofiIntervalId = window.setInterval(tick, stepDurationMs);
    }

    // Warm Rhodes / Electric Piano Synth
    private playRhodesChord(ctx: AudioContext, frequencies: number[], time: number, duration: number) {
        frequencies.forEach((freq, i) => {
            try {
                // Dual detuned oscillators for lush chorus
                const osc1 = ctx.createOscillator();
                const osc2 = ctx.createOscillator();
                const gain = ctx.createGain();
                const filter = ctx.createBiquadFilter();

                osc1.type = 'triangle';
                osc2.type = 'sine';

                // Subtle detuning for analog vintage warmth
                osc1.frequency.setValueAtTime(freq - 0.5, time);
                osc2.frequency.setValueAtTime(freq + 0.5, time);

                // Low-pass filter with gentle resonance
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(850, time);
                filter.frequency.exponentialRampToValueAtTime(450, time + duration);
                filter.Q.value = 1.2;

                // Bell/tine overtone transient
                const vel = 0.025 * (1 - i * 0.12);
                gain.gain.setValueAtTime(0.001, time);
                gain.gain.linearRampToValueAtTime(vel, time + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

                osc1.connect(filter);
                osc2.connect(filter);
                filter.connect(gain);
                gain.connect(this.getDest(ctx));

                osc1.start(time);
                osc2.start(time);
                osc1.stop(time + duration);
                osc2.stop(time + duration);
            } catch {
                // Ignore audio context exceptions
            }
        });
    }

    // Warm Analog Sub-bass
    private playSubBass(ctx: AudioContext, freq: number, time: number, duration: number) {
        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(160, time);

            gain.gain.setValueAtTime(0.001, time);
            gain.gain.linearRampToValueAtTime(0.05, time + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.getDest(ctx));

            osc.start(time);
            osc.stop(time + duration);
        } catch {
            // Ignore audio context exceptions
        }
    }

    // Mellow Lofi Kick
    private playLofiKick(ctx: AudioContext, time: number) {
        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(95, time);
            osc.frequency.exponentialRampToValueAtTime(36, time + 0.12);

            gain.gain.setValueAtTime(0.07, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

            osc.connect(gain);
            gain.connect(this.getDest(ctx));

            osc.start(time);
            osc.stop(time + 0.22);
        } catch {
            // Ignore audio context exceptions
        }
    }

    // Warm Rim-tap / Snare
    private playLofiSnare(ctx: AudioContext, time: number) {
        try {
            // Tone body
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(180, time);
            oscGain.gain.setValueAtTime(0.025, time);
            oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
            osc.connect(oscGain);
            oscGain.connect(this.getDest(ctx));
            osc.start(time);
            osc.stop(time + 0.06);

            // Filtered noise snap
            const bufferSize = ctx.sampleRate * 0.07;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 1800;

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.028, time);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.07);

            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.getDest(ctx));

            noise.start(time);
            noise.stop(time + 0.07);
        } catch {
            // Ignore audio context exceptions
        }
    }

    // Gentle Swing Hi-hat
    private playLofiHat(ctx: AudioContext, time: number, volume: number) {
        try {
            const bufferSize = ctx.sampleRate * 0.035;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.008));
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 6500;

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(volume, time);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.035);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.getDest(ctx));

            noise.start(time);
            noise.stop(time + 0.035);
        } catch {
            // Ignore audio context exceptions
        }
    }

    public stopLofi() {
        this.isLofiPlaying = false;
        if (this.lofiIntervalId) {
            clearInterval(this.lofiIntervalId);
            this.lofiIntervalId = null;
        }
    }

    public toggleLofi(): boolean {
        if (this.isLofiPlaying) {
            this.stopLofi();
            return false;
        } else {
            this.startLofi();
            return true;
        }
    }

    public getLofiPlaying(): boolean {
        return this.isLofiPlaying;
    }

    // -------------------------------------------------------------
    // UI SOUND EFFECTS (HOVER, CLICK, WARP, SUCCESS)
    // -------------------------------------------------------------
    public playHover() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const now = ctx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(580, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);

            gain.gain.setValueAtTime(0.015, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

            osc.connect(gain);
            gain.connect(this.getDest(ctx));

            osc.start(now);
            osc.stop(now + 0.05);
        } catch {
            // Graceful fallback
        }
    }

    public playClick() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const now = ctx.currentTime;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(360, now);
            osc.frequency.exponentialRampToValueAtTime(120, now + 0.06);

            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

            osc.connect(gain);
            gain.connect(this.getDest(ctx));

            osc.start(now);
            osc.stop(now + 0.07);
        } catch {
            // Graceful fallback
        }
    }

    public playFridgeDoor(open: boolean) {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;
            // Magnetic seal pop / click
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = open ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(open ? 180 : 320, now);
            osc.frequency.exponentialRampToValueAtTime(open ? 380 : 110, now + 0.12);

            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

            osc.connect(gain);
            gain.connect(this.getDest(ctx));
            osc.start(now);
            osc.stop(now + 0.14);
        } catch {
            // Graceful fallback
        }
    }

    public playSnack() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;
            // Crunchy munch bite + subtle melodic chime
            [0, 0.07].forEach((delay, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = idx === 0 ? 'triangle' : 'sine';
                osc.frequency.setValueAtTime(540 + idx * 260, now + delay);
                osc.frequency.exponentialRampToValueAtTime(220, now + delay + 0.06);

                gain.gain.setValueAtTime(0.035, now + delay);
                gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.06);

                osc.connect(gain);
                gain.connect(this.getDest(ctx));
                osc.start(now + delay);
                osc.stop(now + delay + 0.06);
            });

            // Satisfied gentle sparkle tone
            const chime = ctx.createOscillator();
            const chimeGain = ctx.createGain();
            chime.type = 'sine';
            chime.frequency.setValueAtTime(880, now + 0.15);
            chimeGain.gain.setValueAtTime(0.02, now + 0.15);
            chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.40);
            chime.connect(chimeGain);
            chimeGain.connect(this.getDest(ctx));
            chime.start(now + 0.15);
            chime.stop(now + 0.40);
        } catch {
            // Graceful fallback
        }
    }

    public playWarpGlide() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 1.2);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, now);
            filter.frequency.exponentialRampToValueAtTime(6000, now + 1.2);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.06, now + 0.5);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.getDest(ctx));

            osc.start(now);
            osc.stop(now + 1.2);
        } catch {
            // Graceful fallback
        }
    }

    public playWarpOut() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(900, now);
            osc.frequency.exponentialRampToValueAtTime(90, now + 0.9);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(4000, now);
            filter.frequency.exponentialRampToValueAtTime(300, now + 0.9);

            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.getDest(ctx));

            osc.start(now);
            osc.stop(now + 0.9);
        } catch {
            // Graceful fallback
        }
    }

    public playSuccess() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;
            const chords = [523.25, 659.25, 783.99, 1046.5];
            chords.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const start = now + idx * 0.05;

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, start);

                gain.gain.setValueAtTime(0.04, start);
                gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);

                osc.connect(gain);
                gain.connect(this.getDest(ctx));

                osc.start(start);
                osc.stop(start + 0.28);
            });
        } catch {
            // Graceful fallback
        }
    }

    public playKeypress() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const now = ctx.currentTime;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800 + Math.random() * 200, now);

            gain.gain.setValueAtTime(0.012, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

            osc.connect(gain);
            gain.connect(this.getDest(ctx));

            osc.start(now);
            osc.stop(now + 0.03);
        } catch {
            // Graceful fallback
        }
    }

    public playModal() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;
        try {
            const now = ctx.currentTime;
            [440, 660, 880].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + i * 0.04);
                gain.gain.setValueAtTime(0.02, now + i * 0.04);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.15);
                osc.connect(gain);
                gain.connect(this.getDest(ctx));
                osc.start(now + i * 0.04);
                osc.stop(now + i * 0.04 + 0.15);
            });
        } catch {
            // Graceful fallback
        }
    }

    public playPurr() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;
        try {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(45, now);
            gain.gain.setValueAtTime(0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
            osc.connect(gain);
            gain.connect(this.getDest(ctx));
            osc.start(now);
            osc.stop(now + 1.5);
        } catch {
            // Graceful fallback
        }
    }

    public playTerminal() {
        this.playKeypress();
    }

    public playDogBark() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;
        try {
            const now = ctx.currentTime;
            // First yip
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'triangle';
            osc1.frequency.setValueAtTime(520, now);
            osc1.frequency.exponentialRampToValueAtTime(240, now + 0.08);
            gain1.gain.setValueAtTime(0.04, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
            osc1.connect(gain1);
            gain1.connect(this.getDest(ctx));
            osc1.start(now);
            osc1.stop(now + 0.09);

            // Second playful yip
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(640, now + 0.1);
            osc2.frequency.exponentialRampToValueAtTime(320, now + 0.19);
            gain2.gain.setValueAtTime(0.045, now + 0.1);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc2.connect(gain2);
            gain2.connect(this.getDest(ctx));
            osc2.start(now + 0.1);
            osc2.stop(now + 0.2);
        } catch {
            // Graceful fallback
        }
    }
}

export const audio = new AudioManager();
