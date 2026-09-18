// Web Audio API Synthesizer for high-fidelity UI & Cyberpunk Lofi soundscape
// 100% procedural, zero latency, zero external assets, plays continuously

class AudioManager {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private volume: number = 0.75;
    private isMuted: boolean = false;
    private isLofiPlaying: boolean = false;
    private lofiIntervalId: number | null = null;
    private stepIndex: number = 0;
    private autoStartInitialized: boolean = false;
    private bgAudio: HTMLAudioElement | null = null;
    private lastClickTime: number = 0;

    constructor() {
        if (typeof window !== 'undefined') {
            // Default sound effects unmuted so clicks and UI sounds play immediately
            this.isMuted = false;

            const savedVol = localStorage.getItem('portfolio_audio_volume');
            const parsedVol = savedVol !== null ? parseFloat(savedVol) : 0.75;
            this.volume = isNaN(parsedVol) || parsedVol < 0.15 ? 0.75 : parsedVol;

            // Unlock Web Audio context on first user interaction for UI sound effects (zero auto-play music)
            this.setupAudioUnlock();
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
            this.masterGain.connect(ctx.destination);
        }
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, ctx.currentTime);
        return this.masterGain;
    }

    public setVolume(val: number): void {
        this.volume = Math.max(0, Math.min(1, val));
        if (typeof window !== 'undefined') {
            localStorage.setItem('portfolio_audio_volume', String(this.volume));
        }
        if (this.bgAudio) {
            this.bgAudio.volume = this.isMuted ? 0 : this.volume;
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

    private setupAudioUnlock() {
        if (this.autoStartInitialized) return;
        this.autoStartInitialized = true;

        const unlockOnGesture = () => {
            const ctx = this.getContext();
            if (ctx && ctx.state === 'suspended') {
                ctx.resume().catch(() => {});
            }

            // Remove unlock listeners once user has interacted
            window.removeEventListener('click', unlockOnGesture);
            window.removeEventListener('pointerdown', unlockOnGesture);
            window.removeEventListener('keydown', unlockOnGesture);
        };

        window.addEventListener('click', unlockOnGesture, { once: true });
        window.addEventListener('pointerdown', unlockOnGesture, { once: true });
        window.addEventListener('keydown', unlockOnGesture, { once: true });
    }

    public toggleMute(): boolean {
        this.isMuted = !this.isMuted;
        if (typeof window !== 'undefined') {
            localStorage.setItem('portfolio_audio_muted', String(this.isMuted));
        }
        if (this.bgAudio) {
            this.bgAudio.volume = this.isMuted ? 0 : this.volume;
        }
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        }
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('portfolio_mute_change', { detail: { isMuted: this.isMuted } }));
        }
        if (!this.isMuted) {
            this.playSuccess();
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
        if (this.bgAudio) {
            this.bgAudio.volume = this.isMuted ? 0 : this.volume;
        }
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        }
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('portfolio_mute_change', { detail: { isMuted: this.isMuted } }));
        }
    }



    private getBgAudio(): HTMLAudioElement | null {
        if (typeof window === 'undefined') return null;
        if (!this.bgAudio) {
            this.bgAudio = new Audio('/music.mp3');
            this.bgAudio.loop = true;
            this.bgAudio.preload = 'auto';
            this.bgAudio.volume = this.isMuted ? 0 : this.volume;
            this.bgAudio.addEventListener('play', () => {
                this.isLofiPlaying = true;
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('portfolio_music_play', { detail: { isPlaying: true } }));
                }
            });
            this.bgAudio.addEventListener('pause', () => {
                this.isLofiPlaying = false;
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('portfolio_music_play', { detail: { isPlaying: false } }));
                }
            });
        }
        return this.bgAudio;
    }

    // -------------------------------------------------------------
    // REAL BACKGROUND MUSIC PLAYER (GOOD MUSIC)
    // -------------------------------------------------------------
    public startLofi(forceUnmute = false) {
        this.isMuted = false;
        if (this.volume < 0.15) {
            this.setVolume(0.75);
        }
        const audioEl = this.getBgAudio();
        if (audioEl) {
            audioEl.volume = Math.max(0.25, this.volume);
            audioEl.play().then(() => {
                this.isLofiPlaying = true;
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('portfolio_music_play', { detail: { isPlaying: true } }));
                }
            }).catch((err) => {
                console.warn('Audio play request failed:', err);
            });
        }
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
        if (this.bgAudio) {
            this.bgAudio.pause();
        }
    }

    public toggleLofi(): boolean {
        const audioEl = this.getBgAudio();
        if (audioEl && !audioEl.paused) {
            this.stopLofi();
            return false;
        } else {
            this.startLofi(true);
            return true;
        }
    }

    public getLofiPlaying(): boolean {
        const audioEl = this.getBgAudio();
        return audioEl ? !audioEl.paused : this.isLofiPlaying;
    }

    public getMusicCurrentTime(): number {
        return this.bgAudio ? this.bgAudio.currentTime : 0;
    }

    public getMusicDuration(): number {
        return this.bgAudio && !isNaN(this.bgAudio.duration) ? this.bgAudio.duration : 0;
    }

    public seekMusic(seconds: number): void {
        if (this.bgAudio) {
            this.bgAudio.currentTime = Math.max(0, Math.min(this.bgAudio.duration || 0, seconds));
        }
    }

    public seekMusicPercent(percent: number): void {
        if (this.bgAudio && this.bgAudio.duration) {
            this.bgAudio.currentTime = (percent / 100) * this.bgAudio.duration;
        }
    }

    public getAudioElement(): HTMLAudioElement | null {
        return this.getBgAudio();
    }

    // -------------------------------------------------------------
    // UI SOUND EFFECTS (HOVER, CLICK, WARP, SUCCESS)
    // -------------------------------------------------------------
    public playHover() {
        // Hover sound effect removed
    }

    // -------------------------------------------------------------
    // AUTHENTIC WINDOWS 7 AERO SOUND SUITE (PROCEDURAL WEB AUDIO)
    // -------------------------------------------------------------

    /**
     * Iconic soft, crisp Windows 7 Aero Navigation Click
     */
    public playWin7Click() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;
            // Debounce click within 35ms to prevent double sound phasing
            if (now - this.lastClickTime < 0.035) return;
            this.lastClickTime = now;

            // Dual micro-impulse mimicking the physical Windows 7 navigation tap
            [
                { time: now, freq: 1750, dur: 0.018, gain: 0.045 },
                { time: now + 0.012, freq: 1250, dur: 0.014, gain: 0.028 },
            ].forEach(({ time, freq, dur, gain: vol }) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const filter = ctx.createBiquadFilter();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, time);
                osc.frequency.exponentialRampToValueAtTime(freq * 0.4, time + dur);

                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(freq, time);
                filter.Q.value = 2.0;

                gain.gain.setValueAtTime(vol, time);
                gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.getDest(ctx));

                osc.start(time);
                osc.stop(time + dur);
            });
        } catch {
            // Graceful fallback
        }
    }

    public playClick() {
        this.playWin7Click();
    }

    /**
     * Iconic 4-note Windows 7 Startup Chime with lush warm harmonic bells & ambient swell
     */
    public playWin7Startup() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        const executeStartup = () => {
            try {
                const now = ctx.currentTime + 0.05;

                // 1. Warm ambient synth bed / riser
                const padOsc1 = ctx.createOscillator();
                const padOsc2 = ctx.createOscillator();
                const padGain = ctx.createGain();
                const padFilter = ctx.createBiquadFilter();

                padOsc1.type = 'sine';
                padOsc2.type = 'triangle';
                padOsc1.frequency.setValueAtTime(138.59, now); // Db3
                padOsc2.frequency.setValueAtTime(207.65, now); // Ab3

                padFilter.type = 'lowpass';
                padFilter.frequency.setValueAtTime(320, now);
                padFilter.frequency.exponentialRampToValueAtTime(1400, now + 1.2);
                padFilter.frequency.exponentialRampToValueAtTime(400, now + 3.4);

                padGain.gain.setValueAtTime(0.001, now);
                padGain.gain.linearRampToValueAtTime(0.08, now + 0.9);
                padGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);

                padOsc1.connect(padFilter);
                padOsc2.connect(padFilter);
                padFilter.connect(padGain);
                padGain.connect(this.getDest(ctx));

                padOsc1.start(now);
                padOsc2.start(now);
                padOsc1.stop(now + 3.4);
                padOsc2.stop(now + 3.4);

                // 2. The iconic 4-note sequence: Db5 -> Ab4 -> Eb5 -> F5
                const notes = [
                    { freq: 554.37, time: now + 0.10, dur: 2.2, vel: 0.12 }, // Db5
                    { freq: 415.30, time: now + 0.44, dur: 2.2, vel: 0.11 }, // Ab4
                    { freq: 622.25, time: now + 0.78, dur: 2.5, vel: 0.13 }, // Eb5
                    { freq: 698.46, time: now + 1.12, dur: 3.0, vel: 0.15 }, // F5 (resolving long chime)
                ];

                notes.forEach(({ freq, time, dur, vel }) => {
                    // Dual harmonics for authentic glass/bell chime timbre
                    [1, 2.76, 5.4].forEach((harmonic, hIdx) => {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        const hFreq = freq * harmonic;

                        osc.type = hIdx === 0 ? 'sine' : 'triangle';
                        osc.frequency.setValueAtTime(hFreq, time);

                        const hVel = vel / (hIdx + 1);
                        gain.gain.setValueAtTime(0.0001, time);
                        gain.gain.linearRampToValueAtTime(hVel, time + 0.015);
                        gain.gain.exponentialRampToValueAtTime(0.0001, time + dur / (hIdx === 0 ? 1 : 1.8));

                        osc.connect(gain);
                        gain.connect(this.getDest(ctx));

                        osc.start(time);
                        osc.stop(time + dur);
                    });
                });
            } catch {
                // Graceful fallback
            }
        };

        if (ctx.state === 'suspended') {
            ctx.resume().then(() => {
                executeStartup();
            }).catch(() => {});
        } else {
            executeStartup();
        }
    }

    /**
     * Windows 7 Window Minimize Whoosh (gentle downward airy scoop)
     */
    public playWin7Minimize() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;
            const dur = 0.16;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(580, now);
            osc.frequency.exponentialRampToValueAtTime(160, now + dur);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1200, now);
            filter.frequency.exponentialRampToValueAtTime(300, now + dur);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.035, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.getDest(ctx));

            osc.start(now);
            osc.stop(now + dur);
        } catch {
            // Graceful fallback
        }
    }

    /**
     * Windows 7 Window Maximize / Restore Whoosh (gentle upward airy scoop)
     */
    public playWin7Maximize() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;
            const dur = 0.16;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(680, now + dur);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, now);
            filter.frequency.exponentialRampToValueAtTime(1600, now + dur);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.035, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.getDest(ctx));

            osc.start(now);
            osc.stop(now + dur);
        } catch {
            // Graceful fallback
        }
    }

    /**
     * Interactive Curtain Slide / Fabric Whoosh with brass rod glide
     */
    public playCurtainSlide(open: boolean = true) {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;
            const dur = 0.48;

            // 1. Filtered pink noise buffer for soft linen fabric swoosh
            const bufferSize = Math.floor(ctx.sampleRate * dur);
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                output[i] = (b0 + b1 + b2) * 0.32;
            }

            const noiseNode = ctx.createBufferSource();
            noiseNode.buffer = noiseBuffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.Q.setValueAtTime(1.8, now);
            if (open) {
                filter.frequency.setValueAtTime(600, now);
                filter.frequency.exponentialRampToValueAtTime(1500, now + dur);
            } else {
                filter.frequency.setValueAtTime(1300, now);
                filter.frequency.exponentialRampToValueAtTime(450, now + dur);
            }

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.001, now);
            noiseGain.gain.linearRampToValueAtTime(0.05, now + 0.08);
            noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

            noiseNode.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.getDest(ctx));

            // 2. Subtle metallic chime ring of brass grommets sliding along pole
            const ringOsc = ctx.createOscillator();
            const ringGain = ctx.createGain();
            ringOsc.type = 'sine';
            ringOsc.frequency.setValueAtTime(open ? 2200 : 1900, now);
            ringGain.gain.setValueAtTime(0.001, now);
            ringGain.gain.linearRampToValueAtTime(0.012, now + 0.04);
            ringGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

            ringOsc.connect(ringGain);
            ringGain.connect(this.getDest(ctx));

            noiseNode.start(now);
            ringOsc.start(now);
            ringOsc.stop(now + 0.32);
        } catch {
            // Graceful fallback
        }
    }

    /**
     * Whoosh utility alias for window/curtain animation
     */
    public playWhoosh() {
        this.playCurtainSlide(true);
    }

    /**
     * Windows 7 Window Close / Tab Dismiss (same clean click sound)
     */
    public playWin7Close() {
        this.playClick();
    }

    /**
     * Windows 7 App Launch / Open Sound (clean crisp click)
     */
    public playWin7Open() {
        this.playClick();
    }


    /**
     * Mechanical Wall Toggle Light Switch click sound
     */
    public playSwitchClick() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;

            // Low thump
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(260, now);
            osc.frequency.exponentialRampToValueAtTime(70, now + 0.04);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.connect(gain);
            gain.connect(this.getDest(ctx));
            osc.start(now);
            osc.stop(now + 0.04);

            // High metallic snap
            const snap = ctx.createOscillator();
            const snapGain = ctx.createGain();
            snap.type = 'square';
            snap.frequency.setValueAtTime(2400, now);
            snap.frequency.exponentialRampToValueAtTime(600, now + 0.018);
            snapGain.gain.setValueAtTime(0.03, now);
            snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
            snap.connect(snapGain);
            snapGain.connect(this.getDest(ctx));
            snap.start(now);
            snap.stop(now + 0.02);
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

    public playArcadeShutdown() {
        try {
            if (typeof window !== 'undefined') {
                const sound = new Audio('/arcade-shutdown.wav');
                sound.volume = 0.06; // Ultra-soft subtle exit volume
                sound.currentTime = 0;
                sound.play().catch(() => {});
            }
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
