'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Disc3, Radio } from 'lucide-react';
import { audio } from '@/lib/audio';

export default function WindowsMediaApp() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        setIsPlaying(audio.getLofiPlaying());
        setIsMuted(audio.getMuted());
    }, []);

    const handleTogglePlay = () => {
        const playing = audio.toggleLofi();
        setIsPlaying(playing);
    };

    const handleToggleMute = () => {
        const muted = audio.toggleMute();
        setIsMuted(muted);
    };

    return (
        <div className="flex-1 flex flex-col p-5 bg-gradient-to-b from-[#181820] to-[#0d0d12] text-zinc-100 font-sans select-none overflow-hidden justify-between">
            {/* Top Track Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                    <Disc3 className={`w-7 h-7 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white">
                        Cyberpunk Lofi Synthesizer
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono flex items-center gap-1.5 mt-0.5">
                        <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                        Procedural Web Audio Stream • 80 BPM
                    </p>
                </div>
            </div>

            {/* Spectrum Graphic Simulation */}
            <div className="flex items-end justify-center gap-1.5 h-28 my-auto">
                {[45, 78, 62, 90, 55, 84, 96, 68, 74, 88, 52, 64, 92, 70, 80].map((h, i) => (
                    <div
                        key={i}
                        className={`w-2 rounded-t-sm transition-all duration-300 ${
                            isPlaying ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,245,212,0.6)]' : 'bg-white/10'
                        }`}
                        style={{
                            height: isPlaying ? `${Math.max(12, (h * (0.6 + Math.sin(i * 1.3) * 0.4)))}%` : '10%',
                        }}
                    />
                ))}
            </div>

            {/* Bottom Controls */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleToggleMute}
                        className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <span className="text-xs text-zinc-400 font-mono">
                        {isMuted ? 'MUTED' : 'LIVE'}
                    </span>
                </div>

                <button
                    onClick={handleTogglePlay}
                    className="flex items-center justify-center w-11 h-11 rounded-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold transition-all cursor-pointer shadow-lg shadow-cyan-500/30 hover:scale-105"
                    title={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                <div className="text-right text-[11px] text-zinc-500 font-mono">
                    Zero latency
                </div>
            </div>
        </div>
    );
}
