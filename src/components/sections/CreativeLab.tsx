'use client';

import React from 'react';
import { Sparkles, FlaskConical, Atom, Eye, Terminal } from 'lucide-react';
import ParticleSandbox from '@/components/3d/ParticleSandbox';

export default function CreativeLab() {
    return (
        <section id="lab" className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-14">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-brand-pink/15 text-brand-pink border border-brand-pink/30 mb-3">
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>EXPERIMENTAL PLAYGROUND</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                    Creative <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink via-brand-purple to-brand-cyan">Lab</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
                    Interactive sandbox showcasing GPU kinematics, math shaders, and procedural particle dynamics.
                </p>
            </div>

            {/* Particle Sandbox Interactive Component */}
            <ParticleSandbox />

            {/* Lab Experiments Footnotes */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-space-900/60 border border-white/5 flex items-start gap-3">
                    <Atom className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                    <div>
                        <div className="font-semibold text-white">N-Body Kinematics</div>
                        <div className="text-zinc-400 mt-0.5">Real-time vector integration computing inverse square law gravity in real time.</div>
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-space-900/60 border border-white/5 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
                    <div>
                        <div className="font-semibold text-white">Zero-Loss 60+ FPS</div>
                        <div className="text-zinc-400 mt-0.5">Optimized with native 2D Canvas buffer caching and GPU hardware rendering.</div>
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-space-900/60 border border-white/5 flex items-start gap-3">
                    <Terminal className="w-4 h-4 text-brand-pink shrink-0 mt-0.5" />
                    <div>
                        <div className="font-semibold text-white">Interactive Dynamics</div>
                        <div className="text-zinc-400 mt-0.5">Toggle between attraction and repulsion force fields to disperse or condense matter.</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
