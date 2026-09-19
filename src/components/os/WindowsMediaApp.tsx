'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Play,
    Pause,
    Square,
    Volume2,
    Volume1,
    VolumeX,
    SkipBack,
    SkipForward,
    Repeat,
    Shuffle,
    Disc,
    Radio,
    Sparkles,
} from 'lucide-react';
import { audio } from '@/lib/audio';

export default function WindowsMediaApp() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(80);
    const [isLooping, setIsLooping] = useState(true);
    const [visualizerMode, setVisualizerMode] = useState<'bars' | 'wave'>('bars');

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const isPlayingRef = useRef(false);

    // Keep ref in sync for animation loop
    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    // Audio element listener & state synchronization
    useEffect(() => {
        const audioEl = audio.getAudioElement();

        const updateStatus = () => {
            const playing = audio.getLofiPlaying();
            setIsPlaying(playing);
            setIsMuted(audio.getMuted());
            setVolume(Math.round(audio.getVolume() * 100));
            const cur = audio.getMusicCurrentTime();
            const dur = audio.getMusicDuration();
            if (!isNaN(cur)) setCurrentTime(cur);
            if (!isNaN(dur) && dur > 0) setDuration(dur);
        };

        updateStatus();

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onTime = () => {
            if (audioEl) {
                setCurrentTime(audioEl.currentTime);
                if (audioEl.duration && !isNaN(audioEl.duration)) {
                    setDuration(audioEl.duration);
                }
            }
        };

        if (audioEl) {
            audioEl.addEventListener('play', onPlay);
            audioEl.addEventListener('pause', onPause);
            audioEl.addEventListener('timeupdate', onTime);
            audioEl.addEventListener('loadedmetadata', updateStatus);
        }

        const handlePlayEvent = (e: CustomEvent<{ isPlaying: boolean }>) => {
            setIsPlaying(e.detail.isPlaying);
        };
        const handleVolumeEvent = (e: CustomEvent<{ volume: number }>) => {
            setVolume(Math.round(e.detail.volume * 100));
        };
        const handleMuteEvent = (e: CustomEvent<{ isMuted: boolean }>) => {
            setIsMuted(e.detail.isMuted);
        };

        window.addEventListener('portfolio_music_play', handlePlayEvent as EventListener);
        window.addEventListener('portfolio_volume_change', handleVolumeEvent as EventListener);
        window.addEventListener('portfolio_mute_change', handleMuteEvent as EventListener);

        const pollTimer = setInterval(updateStatus, 500);

        return () => {
            if (audioEl) {
                audioEl.removeEventListener('play', onPlay);
                audioEl.removeEventListener('pause', onPause);
                audioEl.removeEventListener('timeupdate', onTime);
                audioEl.removeEventListener('loadedmetadata', updateStatus);
            }
            window.removeEventListener('portfolio_music_play', handlePlayEvent as EventListener);
            window.removeEventListener('portfolio_volume_change', handleVolumeEvent as EventListener);
            window.removeEventListener('portfolio_mute_change', handleMuteEvent as EventListener);
            clearInterval(pollTimer);
        };
    }, []);

    // 60 FPS Windows Media Player 12 Authentic Spectrum Visualizer
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const BAR_COUNT = 28;
        const barHeights = new Float32Array(BAR_COUNT).fill(4);
        const peakHeights = new Float32Array(BAR_COUNT).fill(4);
        const peakHolds = new Uint8Array(BAR_COUNT).fill(0);
        const peakSpeeds = new Float32Array(BAR_COUNT).fill(0);

        let startTime = performance.now();

        const render = (now: number) => {
            const elapsed = (now - startTime) / 1000;
            const playing = isPlayingRef.current;

            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);

            if (visualizerMode === 'bars') {
                const gap = 3;
                const barWidth = Math.max(3, (w - (BAR_COUNT - 1) * gap) / BAR_COUNT);

                for (let i = 0; i < BAR_COUNT; i++) {
                    let targetHeight = 4;

                    if (playing) {
                        // Multi-octave harmonic frequency simulation
                        // Low bands: Kick/Bass rhythmic pulses (approx 120 bpm = 2Hz)
                        const bassPulse = Math.pow(Math.max(0, Math.sin(elapsed * 4.2)), 3) * 65;
                        const subBass = Math.sin(elapsed * 2.1 + i * 0.2) * 20;

                        // Mid bands: Harmonic sweeps and melodic sway
                        const midWave = Math.sin(elapsed * 6.5 + i * 0.45) * 35;
                        const vocalSway = Math.cos(elapsed * 3.8 - i * 0.3) * 25;

                        // High bands: Fast jitter and sparkle
                        const highSparkle = Math.sin(elapsed * 12.0 + i * 0.9) * 20 + (Math.sin(elapsed * 25.0 + i) > 0.5 ? 15 : 0);

                        // Frequency curve weighting (higher energy in bass/mids)
                        let energy = 0;
                        if (i < 8) {
                            // Bass / Sub-bass
                            energy = 25 + bassPulse * (1 - i * 0.08) + subBass;
                        } else if (i < 20) {
                            // Mids / Melody
                            energy = 20 + midWave + vocalSway + bassPulse * 0.3;
                        } else {
                            // Highs / Treble
                            energy = 15 + highSparkle + midWave * 0.3;
                        }

                        // Organic jitter
                        const noise = (Math.sin(elapsed * 18 + i * 3.7) + 1) * 6;
                        targetHeight = Math.max(6, Math.min(h - 8, energy + noise));
                    }

                    // Smooth lerp towards target
                    barHeights[i] += (targetHeight - barHeights[i]) * (playing ? 0.32 : 0.12);

                    // Peak falloff physics (Classic WMP / Winamp style)
                    if (barHeights[i] >= peakHeights[i]) {
                        peakHeights[i] = barHeights[i];
                        peakHolds[i] = 12; // hold for 12 frames
                        peakSpeeds[i] = 0;
                    } else {
                        if (peakHolds[i] > 0) {
                            peakHolds[i]--;
                        } else {
                            peakSpeeds[i] += 0.4;
                            peakHeights[i] = Math.max(barHeights[i], peakHeights[i] - peakSpeeds[i]);
                        }
                    }

                    const curH = barHeights[i];
                    const x = i * (barWidth + gap);
                    const y = h - curH;

                    // Segmented block spectrum gradient (Classic Windows Media Player 12)
                    const segmentH = 3;
                    const segmentGap = 1.5;
                    const segments = Math.floor(curH / (segmentH + segmentGap));

                    for (let s = 0; s < segments; s++) {
                        const segY = h - (s + 1) * (segmentH + segmentGap);
                        const ratio = s / (h / (segmentH + segmentGap));

                        if (playing) {
                            if (ratio > 0.75) {
                                ctx.fillStyle = '#fde047'; // Amber/gold peak
                            } else if (ratio > 0.4) {
                                ctx.fillStyle = '#38bdf8'; // Sky blue
                            } else {
                                ctx.fillStyle = '#0284c7'; // Deep cobalt cyan
                            }
                        } else {
                            ctx.fillStyle = 'rgba(148, 163, 184, 0.25)'; // Idle muted slate
                        }

                        ctx.fillRect(x, segY, barWidth, segmentH);
                    }

                    // Draw Peak Cap
                    if (playing && peakHeights[i] > 6) {
                        const peakY = Math.max(0, h - peakHeights[i]);
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(x, peakY, barWidth, 1.5);
                    }
                }
            } else {
                // Ocean Wave Oscilloscope Mode
                ctx.beginPath();
                ctx.moveTo(0, h / 2);

                for (let x = 0; x < w; x++) {
                    const progress = x / w;
                    let amp = 0;

                    if (playing) {
                        amp = Math.sin(progress * 8 + elapsed * 5) * 22
                            + Math.sin(progress * 16 - elapsed * 8) * 12
                            + Math.sin(progress * 32 + elapsed * 14) * 6;
                    } else {
                        amp = Math.sin(progress * 4 + elapsed * 0.5) * 2;
                    }

                    ctx.lineTo(x, h / 2 + amp);
                }

                ctx.strokeStyle = playing ? '#38bdf8' : 'rgba(148, 163, 184, 0.3)';
                ctx.lineWidth = 2;
                ctx.shadowColor = playing ? '#00e5ff' : 'transparent';
                ctx.shadowBlur = playing ? 8 : 0;
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            animFrameRef.current = requestAnimationFrame(render);
        };

        animFrameRef.current = requestAnimationFrame(render);

        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [visualizerMode]);

    const handleTogglePlay = () => {
        audio.playClick();
        const playing = audio.toggleLofi();
        setIsPlaying(playing);
    };

    const handleStop = () => {
        audio.playClick();
        audio.stopLofi();
        audio.seekMusic(0);
        setIsPlaying(false);
        setCurrentTime(0);
    };

    const handleToggleMute = () => {
        audio.playClick();
        const muted = audio.toggleMute();
        setIsMuted(muted);
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newPercent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
        audio.seekMusicPercent(newPercent);
        if (duration) {
            setCurrentTime((newPercent / 100) * duration);
        }
    };

    const formatTime = (secs: number) => {
        if (!secs || isNaN(secs)) return '0:00';
        const mins = Math.floor(secs / 60);
        const remSecs = Math.floor(secs % 60);
        return `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`;
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="flex-1 flex flex-col overflow-hidden font-sans select-none bg-[#09111b] text-[#ffffff] text-xs">
            {/* 1. Windows Media Player 12 Aero Glass Title & Tab Strip */}
            <div className="h-9 px-3 bg-gradient-to-b from-[#25466d] via-[#16304f] to-[#0d1f34] border-b border-[#3b5d84] flex items-center justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#f97316] via-[#3b82f6] to-[#06b6d4] p-[1px] shadow-sm flex items-center justify-center">
                        <Disc
                            className="w-4 h-4 text-white"
                            style={{
                                animation: 'spin 4s linear infinite',
                                animationPlayState: isPlaying ? 'running' : 'paused',
                            }}
                        />
                    </div>
                    <span className="font-semibold text-xs tracking-wide text-[#e8f2fc] drop-shadow-sm">
                        Windows Media Player
                    </span>
                </div>

                <div className="flex items-center gap-1 text-[11px]">
                    <button
                        onClick={() => {
                            audio.playClick();
                            setVisualizerMode(prev => prev === 'bars' ? 'wave' : 'bars');
                        }}
                        className="px-2 py-0.5 rounded-[2px] bg-[#1a385c] hover:bg-[#234c7a] text-[#70b0ea] hover:text-white border border-[#3b6da1] font-medium shadow-inner flex items-center gap-1 transition-colors cursor-pointer"
                        title="Toggle Visualizer Mode"
                    >
                        <Radio className="w-3 h-3" />
                        <span>{visualizerMode === 'bars' ? 'Spectrum Bars' : 'Waveform'}</span>
                    </button>
                    <span className="px-2 py-0.5 text-[#9cb6d4] hover:text-white cursor-pointer transition-colors hidden sm:inline">
                        Now Playing
                    </span>
                </div>
            </div>

            {/* 2. Visualizer Chamber & Vinyl Album Display */}
            <div className="flex-1 relative flex flex-col items-center justify-between p-3 overflow-hidden bg-gradient-to-b from-[#142842] via-[#091524] to-[#040911]">
                {/* Track Metadata Header */}
                <div className="text-center space-y-0.5 z-10 pt-1">
                    <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-[#38bdf8] uppercase tracking-widest">
                        <Sparkles className="w-3 h-3 text-[#38bdf8]" />
                        <span>High-Fidelity Audio • Windows Media</span>
                    </div>
                    <h2 className="text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        Good Music
                    </h2>
                    <p className="text-[11px] text-[#90a8c2]">
                        Aditya Narayan Ray • Original Soundtrack
                    </p>
                </div>

                {/* Central Vinyl Album Disc with Realistic Groove Reflections */}
                <div className="my-auto z-10 flex flex-col items-center justify-center relative py-1">
                    <div
                        className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-[#475569]/60 shadow-[0_8px_24px_rgba(0,0,0,0.8)] flex items-center justify-center"
                        style={{
                            background: 'radial-gradient(circle, #1e293b 0%, #0f172a 40%, #020617 75%, #000000 100%)',
                            boxShadow: isPlaying
                                ? '0 0 24px rgba(56, 189, 248, 0.45), 0 8px 30px rgba(0,0,0,0.9)'
                                : '0 4px 16px rgba(0,0,0,0.6)',
                            animation: 'spin 6s linear infinite',
                            animationPlayState: isPlaying ? 'running' : 'paused',
                            transition: 'box-shadow 0.4s ease',
                        }}
                    >
                        {/* Vinyl Grooves rings */}
                        <div className="absolute inset-2 rounded-full border border-white/10" />
                        <div className="absolute inset-4 rounded-full border border-white/5" />
                        <div className="absolute inset-6 rounded-full border border-white/10" />
                        <div className="absolute inset-8 rounded-full border border-white/5" />

                        {/* Light sheen specular reflection */}
                        <div
                            className="absolute inset-0 rounded-full pointer-events-none"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 45%, rgba(255,255,255,0.08) 55%, transparent 100%)',
                            }}
                        />

                        {/* Center Album Artwork Label */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0284c7] via-[#38bdf8] to-[#93c5fd] border-2 border-white/40 flex flex-col items-center justify-center p-1 shadow-inner text-center">
                            <span className="text-[8px] font-bold text-white uppercase tracking-tighter leading-none">
                                GOOD
                            </span>
                            <span className="text-[7px] font-medium text-[#04284d] uppercase tracking-tighter leading-none">
                                MUSIC
                            </span>
                            {/* Spindle hole */}
                            <div className="w-2 h-2 rounded-full bg-[#000000] border border-white/50 mt-0.5" />
                        </div>
                    </div>
                </div>

                {/* 60 FPS Real-time Spectrum Visualizer Canvas */}
                <div className="w-full max-w-md h-20 relative z-10 px-2 flex items-center justify-center">
                    <canvas
                        ref={canvasRef}
                        width={380}
                        height={76}
                        className="w-full h-full"
                    />
                </div>

                {/* Progress / Seek Scrubber Bar */}
                <div className="w-full max-w-md space-y-1 z-10 px-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#9cb6d4]">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                    <div
                        onClick={handleSeek}
                        className="w-full h-2 rounded-full bg-[#0d1c2d] border border-[#23456b] cursor-pointer relative overflow-hidden shadow-inner group"
                        title="Click to seek"
                    >
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[#0284c7] via-[#38bdf8] to-[#7dd3fc] transition-all relative"
                            style={{ width: `${progressPercent}%` }}
                        >
                            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_6px_#fff]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Authentic Windows Media Player 12 Transport Control Bar */}
            <div className="h-16 px-4 bg-gradient-to-b from-[#1b3655] via-[#0f2237] to-[#081524] border-t border-[#2d5077] flex items-center justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] flex-shrink-0">
                {/* Left Controls: Repeat & Shuffle */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            audio.playClick();
                            setIsLooping(!isLooping);
                        }}
                        className={`p-1.5 rounded-[3px] border transition-colors cursor-pointer ${
                            isLooping
                                ? 'bg-[#1e4470] border-[#4a85c2] text-[#60a5fa]'
                                : 'bg-transparent border-transparent text-[#7d9cb8] hover:text-white'
                        }`}
                        title={isLooping ? 'Repeat: On' : 'Repeat: Off'}
                    >
                        <Repeat className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => audio.playClick()}
                        className="p-1.5 rounded-[3px] border border-transparent text-[#7d9cb8] hover:text-white transition-colors cursor-pointer"
                        title="Shuffle"
                    >
                        <Shuffle className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Center Main Controls: Previous, Stop, PLAY/PAUSE (Iconic Glossy Aero Orb), Next */}
                <div className="flex items-center gap-2.5">
                    {/* Previous Track / Restart */}
                    <button
                        onClick={() => {
                            audio.playClick();
                            audio.seekMusic(0);
                            setCurrentTime(0);
                        }}
                        className="w-8 h-8 rounded-full bg-gradient-to-b from-[#2a4d75] to-[#122842] hover:from-[#356194] hover:to-[#1a385c] border border-[#4878a8] flex items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] cursor-pointer active:scale-95 transition-all"
                        title="Previous (Restart)"
                    >
                        <SkipBack className="w-3.5 h-3.5" />
                    </button>

                    {/* Stop Button */}
                    <button
                        onClick={handleStop}
                        className="w-8 h-8 rounded-full bg-gradient-to-b from-[#2a4d75] to-[#122842] hover:from-[#356194] hover:to-[#1a385c] border border-[#4878a8] flex items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] cursor-pointer active:scale-95 transition-all"
                        title="Stop"
                    >
                        <Square className="w-3 h-3 fill-current" />
                    </button>

                    {/* Iconic Windows 7 WMP Play/Pause Glossy Aero Orb */}
                    <button
                        onClick={handleTogglePlay}
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white cursor-pointer active:scale-95 transition-all group relative"
                        style={{
                            background: isPlaying
                                ? 'linear-gradient(180deg, #4892dd 0%, #1e62a8 50%, #124376 100%)'
                                : 'linear-gradient(180deg, #3b7bbd 0%, #174e87 50%, #0d345c 100%)',
                            border: '2px solid #82b9ed',
                            boxShadow: isPlaying
                                ? '0 0 18px rgba(56, 189, 248, 0.75), inset 0 2px 2px rgba(255,255,255,0.7), 0 2px 8px rgba(0,0,0,0.6)'
                                : '0 2px 10px rgba(0,0,0,0.5), inset 0 2px 2px rgba(255,255,255,0.5)',
                        }}
                        title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                    >
                        {/* Upper Aero Glass Specular Highlight */}
                        <div
                            className="absolute top-1 left-2 right-2 h-4 rounded-full pointer-events-none"
                            style={{
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.05) 100%)',
                            }}
                        />
                        {isPlaying ? (
                            <Pause className="w-5 h-5 fill-white text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                        ) : (
                            <Play className="w-5 h-5 ml-0.5 fill-white text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                        )}
                    </button>

                    {/* Next Track */}
                    <button
                        onClick={() => {
                            audio.playClick();
                            audio.seekMusic(0);
                            setCurrentTime(0);
                        }}
                        className="w-8 h-8 rounded-full bg-gradient-to-b from-[#2a4d75] to-[#122842] hover:from-[#356194] hover:to-[#1a385c] border border-[#4878a8] flex items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] cursor-pointer active:scale-95 transition-all"
                        title="Next (Restart)"
                    >
                        <SkipForward className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Right Controls: Volume Icon & Windows 7 Volume Slider */}
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={handleToggleMute}
                        className="p-1 rounded text-[#9cb6d4] hover:text-white cursor-pointer transition-colors"
                        title={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? (
                            <VolumeX className="w-4 h-4 text-[#ef4444]" />
                        ) : volume < 50 ? (
                            <Volume1 className="w-4 h-4" />
                        ) : (
                            <Volume2 className="w-4 h-4" />
                        )}
                    </button>
                    <div
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const clickX = e.clientX - rect.left;
                            const newVol = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
                            setVolume(newVol);
                            audio.setVolume(newVol / 100);
                            if (isMuted && newVol > 0) {
                                audio.setMuted(false);
                                setIsMuted(false);
                            }
                        }}
                        className="w-16 h-1.5 rounded-full bg-[#102236] border border-[#23456b] cursor-pointer relative overflow-hidden hidden sm:block shadow-inner"
                        title={`Volume: ${Math.round(isMuted ? 0 : volume)}%`}
                    >
                        <div
                            className="h-full rounded-full bg-[#38bdf8]"
                            style={{ width: `${isMuted ? 0 : volume}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
