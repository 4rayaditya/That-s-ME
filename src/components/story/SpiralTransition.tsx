'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SpiralTransitionProps {
    direction: 'in' | 'out';
    onComplete: () => void;
}

export default function SpiralTransition({ direction, onComplete }: SpiralTransitionProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 1300);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden flex items-center justify-center bg-space-950">
            {/* Spiral Vortex Canvas / Animation */}
            <motion.div
                initial={{
                    scale: direction === 'in' ? 1 : 12,
                    rotate: direction === 'in' ? 0 : 720,
                    opacity: 1,
                    filter: direction === 'in' ? 'blur(0px)' : 'blur(12px)',
                }}
                animate={{
                    scale: direction === 'in' ? 14 : 1,
                    rotate: direction === 'in' ? 720 : 0,
                    opacity: [1, 0.9, 0.4, 0],
                    filter: direction === 'in' ? ['blur(0px)', 'blur(8px)', 'blur(20px)', 'blur(0px)'] : ['blur(12px)', 'blur(6px)', 'blur(0px)'],
                }}
                transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-[120vw] h-[120vh] flex items-center justify-center"
            >
                {/* Concentric spiral rings */}
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full border-2 border-brand-cyan/60"
                        style={{
                            width: `${(i + 1) * 20}%`,
                            height: `${(i + 1) * 20}%`,
                            borderColor: i % 2 === 0 ? '#00f5d4' : '#9d4edd',
                            boxShadow: `0 0 40px ${i % 2 === 0 ? '#00f5d4' : '#9d4edd'}`,
                            transform: `rotate(${i * 45}deg)`,
                        }}
                    />
                ))}

                {/* Hyperspace warp rays */}
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-brand-cyan/20 to-space-950" />
            </motion.div>

            {/* Flash burst at center */}
            <motion.div
                initial={{ opacity: 0, scale: 0.1 }}
                animate={{ opacity: [0, 0.8, 1, 0], scale: [0.1, 2, 5, 8] }}
                transition={{ duration: 1.2, ease: 'easeIn' }}
                className="absolute w-48 h-48 rounded-full bg-brand-cyan/80 blur-2xl pointer-events-none"
            />

            {/* Subtext HUD */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 font-mono text-xs text-brand-cyan tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
                {direction === 'in' ? 'CONNECTING TO NEURAL SCREEN INTERFACE...' : 'DISCONNECTING... RETURNING TO ROOM'}
            </div>
        </div>
    );
}
