'use client';

import React from 'react';
import { Play, Pause, Disc3, Volume2, SkipForward, Radio } from 'lucide-react';
import { audio } from '@/lib/audio';

interface MusicPlayerAppProps {
    isPlaying: boolean;
    onToggle: () => void;
}

export default function MusicPlayerApp({ isPlaying, onToggle }: MusicPlayerAppProps) {
    return (
        <div className="p-5 font-mono text-xs max-w-md mx-auto space-y-5">
            {/* Cassette / Vinyl Graphic */}
            <div className="relative h-36 w-full rounded-xl bg-space-950/80 border border-brand-purple/40 flex items-center justify-center overflow-hidden shadow-[0_0_25px_rgba(157,78,221,0.2)]">
                <div className={`p-4 rounded-full border-2 border-dashed border-brand-purple/60 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                    <Disc3 className="w-16 h-16 text-brand-purple" />
                </div>

                {/* Cyber Audio Equalizer Bars */}
                <div className="absolute bottom-2 inset-x-4 flex items-end justify-between h-8 opacity-60">
                    {[...Array(24)].map((_, i) => (
                        <div
                            key={i}
                            className="w-1 bg-gradient-to-t from-brand-purple to-brand-cyan rounded-t transition-all duration-150"
                            style={{
                                height: isPlaying ? `${Math.max(10, (Math.sin(i + Date.now() / 200) + 1) * 45)}%` : '15%',
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Track Metadata */}
            <div className="text-center space-y-1">
                <div className="text-sm font-bold text-white">Midnight Cyber Cafe</div>
                <div className="text-[11px] text-brand-cyan">Aditya Ray • Synthesized Lofi Ambience</div>
                <div className="text-[10px] text-zinc-500">44.1 kHz // Web Audio Synthesizer Node</div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
                <button
                    onClick={onToggle}
                    className="p-3 rounded-full bg-gradient-to-r from-brand-cyan to-brand-purple text-space-950 font-bold shadow-[0_0_15px_rgba(0,245,212,0.4)] hover:scale-105 active:scale-95 transition-all"
                >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-space-950 ml-0.5" />}
                </button>
            </div>
        </div>
    );
}
