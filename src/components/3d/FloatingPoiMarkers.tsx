'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Bed, Coffee, Laptop } from 'lucide-react';
import { audio } from '@/lib/audio';

interface FloatingPoiMarkersProps {
    onSelectSetup: () => void;
    onSelectCoffee: () => void;
    onSelectBed: () => void;
    visible: boolean;
}

export default function FloatingPoiMarkers({
    onSelectSetup,
    onSelectCoffee,
    onSelectBed,
    visible,
}: FloatingPoiMarkersProps) {
    const setupRef = useRef<THREE.Group>(null);
    const coffeeRef = useRef<THREE.Group>(null);
    const bedRef = useRef<THREE.Group>(null);

    const lastBobUpdate = useRef(0);

    useFrame((state) => {
        if (!visible) return; // Skip all work when markers are hidden
        const t = state.clock.getElapsedTime();
        // Throttle bobbing to ~24 FPS
        if (t - lastBobUpdate.current < 0.042) return;
        lastBobUpdate.current = t;
        // Gentle holographic floating bobbing
        if (setupRef.current) setupRef.current.position.y = 2.05 + Math.sin(t * 2.4) * 0.04;
        if (coffeeRef.current) coffeeRef.current.position.y = 1.55 + Math.sin(t * 2.4 + 1.2) * 0.04;
        if (bedRef.current) bedRef.current.position.y = 1.25 + Math.sin(t * 2.4 + 2.4) * 0.04;
    });

    if (!visible) return null;

    return (
        <group>
            {/* 1. SETUP / BATTLESTATION MARKER */}
            <group ref={setupRef} position={[0, 2.05, -0.2]}>
                <Html center distanceFactor={7} zIndexRange={[100, 0]}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            audio.playClick();
                            onSelectSetup();
                        }}
                        onMouseEnter={() => audio.playHover()}
                        className="group relative flex items-center justify-center p-2.5 rounded-full bg-zinc-950/85 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,245,212,0.6)] hover:shadow-[0_0_25px_rgba(0,245,212,1.0)] hover:scale-115 transition-all duration-200 cursor-pointer backdrop-blur-md"
                        title="Code"
                    >
                        <span className="absolute -inset-1 rounded-full border border-cyan-400/40 animate-ping pointer-events-none" />
                        <Laptop className="w-4 h-4 text-cyan-300 group-hover:text-white transition-colors" />

                        {/* Tooltip on hover */}
                        <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-zinc-950/90 border border-cyan-500/50 text-[10px] font-mono text-cyan-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                            Code
                        </div>
                    </button>
                </Html>
            </group>

            {/* 2. ESPRESSO STAND MARKER */}
            <group ref={coffeeRef} position={[2.94, 1.55, 0.42]}>
                <Html center distanceFactor={7} zIndexRange={[100, 0]}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            audio.playClick();
                            onSelectCoffee();
                        }}
                        onMouseEnter={() => audio.playHover()}
                        className="group relative flex items-center justify-center p-2.5 rounded-full bg-zinc-950/85 border border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(255,183,3,0.6)] hover:shadow-[0_0_25px_rgba(255,183,3,1.0)] hover:scale-115 transition-all duration-200 cursor-pointer backdrop-blur-md"
                        title="Brew"
                    >
                        <span className="absolute -inset-1 rounded-full border border-amber-400/40 animate-ping pointer-events-none" />
                        <Coffee className="w-4 h-4 text-amber-300 group-hover:text-white transition-colors" />

                        {/* Tooltip on hover */}
                        <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-zinc-950/90 border border-amber-500/50 text-[10px] font-mono text-amber-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                            Brew
                        </div>
                    </button>
                </Html>
            </group>

            {/* 3. BED / FUTON MARKER */}
            <group ref={bedRef} position={[-2.6, 1.25, 0.8]}>
                <Html center distanceFactor={7} zIndexRange={[100, 0]}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            audio.playClick();
                            onSelectBed();
                        }}
                        onMouseEnter={() => audio.playHover()}
                        className="group relative flex items-center justify-center p-2.5 rounded-full bg-zinc-950/85 border border-rose-400 text-rose-300 shadow-[0_0_15px_rgba(247,37,133,0.6)] hover:shadow-[0_0_25px_rgba(247,37,133,1.0)] hover:scale-115 transition-all duration-200 cursor-pointer backdrop-blur-md"
                        title="Sleep"
                    >
                        <span className="absolute -inset-1 rounded-full border border-rose-400/40 animate-ping pointer-events-none" />
                        <Bed className="w-4 h-4 text-rose-300 group-hover:text-white transition-colors" />

                        {/* Tooltip on hover */}
                        <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-zinc-950/90 border border-rose-500/50 text-[10px] font-mono text-rose-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                            Sleep
                        </div>
                    </button>
                </Html>
            </group>
        </group>
    );
}
