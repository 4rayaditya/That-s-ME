// Web Audio API Synthesizer for high-fidelity UI & Cyberpunk Narrative interaction sounds
// Zero external asset loading, zero latency, 100% reliable across browsers

class AudioManager {
    private ctx: AudioContext | null = null;
    private isMuted: boolean = false; // Enabled for atmospheric immersion!
    private lofiTimer: number | null = null;
    private isLofiPlaying: boolean = false;

    constructor() {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('portfolio_audio_muted');
            this.isMuted = saved !== null ? saved === 'true' : false;
        }
    }

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

    public toggleMute(): boolean {
        this.isMuted = !this.isMuted;
        if (typeof window !== 'undefined') {
            localStorage.setItem('portfolio_audio_muted', String(this.isMuted));
        }
        if (!this.isMuted) {
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
        if (muted) {
            this.stopLofi();
        }
    }

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
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.05);
        } catch {
            // Audio context restrictions handled gracefully
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
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.07);
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
                const startTime = now + i * 0.035;

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0.03, startTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.16);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(startTime);
                osc.stop(startTime + 0.16);
            });
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
            
            // Sub bass hum
            const sub = ctx.createOscillator();
            const subGain = ctx.createGain();
            sub.type = 'sawtooth';
            sub.frequency.setValueAtTime(60, now);
            sub.frequency.exponentialRampToValueAtTime(240, now + 1.2);
            subGain.gain.setValueAtTime(0.05, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
            sub.connect(subGain);
            subGain.connect(ctx.destination);
            sub.start(now);
            sub.stop(now + 1.4);

            // Resonant spiral sweep
            const sweep = ctx.createOscillator();
            const sweepGain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            
            sweep.type = 'sine';
            sweep.frequency.setValueAtTime(150, now);
            sweep.frequency.exponentialRampToValueAtTime(2200, now + 1.2);

            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(300, now);
            filter.frequency.exponentialRampToValueAtTime(3000, now + 1.2);
            filter.Q.value = 5.0;

            sweepGain.gain.setValueAtTime(0.06, now);
            sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

            sweep.connect(filter);
            filter.connect(sweepGain);
            sweepGain.connect(ctx.destination);

            sweep.start(now);
            sweep.stop(now + 1.3);

            // Digital Lock-in Click at end
            setTimeout(() => {
                this.playSuccess();
            }, 1100);
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

            osc.type = 'sine';
            osc.frequency.setValueAtTime(1800, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.8);

            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.85);
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
            const chords = [587.33, 659.25, 880, 1174.66]; // D5, E5, A5, D6 cute cyber meow arpeggio
            chords.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const start = now + idx * 0.08;

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, start);

                gain.gain.setValueAtTime(0.04, start);
                gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.2);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(start);
                osc.stop(start + 0.2);
            });
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
            const chords = [523.25, 659.25, 783.99, 1046.50];
            chords.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const start = now + idx * 0.05;

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, start);

                gain.gain.setValueAtTime(0.04, start);
                gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);

                osc.connect(gain);
                gain.connect(ctx.destination);

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
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.03);
        } catch {
            // Graceful fallback
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

    private startLofi() {
        this.isLofiPlaying = true;
        const chords = [
            [261.63, 329.63, 392.00, 493.88], // Cmaj7
            [220.00, 261.63, 329.63, 392.00], // Am7
            [174.61, 220.00, 261.63, 329.63], // Fmaj7
            [196.00, 246.94, 293.66, 392.00], // G7
        ];
        let chordIdx = 0;

        const playNextChord = () => {
            if (!this.isLofiPlaying || this.isMuted) return;
            const ctx = this.getContext();
            if (!ctx) return;

            const now = ctx.currentTime;
            const notes = chords[chordIdx % chords.length];
            chordIdx++;

            notes.forEach((freq) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const filter = ctx.createBiquadFilter();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(700, now);

                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.02, now + 0.6);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now);
                osc.stop(now + 2.8);
            });
        };

        playNextChord();
        this.lofiTimer = window.setInterval(playNextChord, 3000);
    }

    private stopLofi() {
        this.isLofiPlaying = false;
        if (this.lofiTimer) {
            clearInterval(this.lofiTimer);
            this.lofiTimer = null;
        }
    }
}

export const audio = new AudioManager();
