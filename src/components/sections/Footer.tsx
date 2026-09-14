'use client';

import React from 'react';
import { ArrowUp, Heart, Sparkles, Terminal } from 'lucide-react';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { audio } from '@/lib/audio';

export default function Footer() {
    const handleScrollTop = () => {
        audio.playSuccess();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative border-t border-white/5 bg-space-950/80 backdrop-blur-xl py-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left Brand */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-cyan/20 to-brand-purple/20 border border-brand-cyan/30 flex items-center justify-center font-mono font-bold text-xs text-brand-cyan">
                        AR
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white">Aditya Ray</div>
                        <div className="text-[11px] font-mono text-zinc-400">Creative Technologist Portfolio</div>
                    </div>
                </div>

                {/* Center Credits */}
                <div className="text-center text-xs font-mono text-zinc-400 flex flex-col items-center gap-1">
                    <div>Designed & Engineered with Next.js 14, WebGL & Framer Motion</div>
                    <div className="text-[10px] text-zinc-400">
                        © {new Date().getFullYear()} {PERSONAL_INFO.name} ({PERSONAL_INFO.handle}). All rights reserved.
                    </div>
                </div>

                {/* Right Back to Top */}
                <button
                    onClick={handleScrollTop}
                    onMouseEnter={() => audio.playHover()}
                    className="p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-brand-cyan/40 text-zinc-300 hover:text-brand-cyan transition-all flex items-center gap-2 text-xs font-mono"
                    title="Warp to top"
                >
                    <span>RETURN TO ORBIT</span>
                    <ArrowUp className="w-4 h-4" />
                </button>
            </div>
        </footer>
    );
}
