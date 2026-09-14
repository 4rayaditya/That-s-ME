'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

interface ArchitecturalRoomProps {
    environmentPhase: 'morning' | 'afternoon' | 'evening' | 'night';
}

export default function ArchitecturalRoom({ environmentPhase }: ArchitecturalRoomProps) {
    // -------------------------------------------------------------
    // PROCEDURAL HIGH-RES HARDWOOD FLOOR TEXTURE
    // -------------------------------------------------------------
    const woodFloorTexture = useMemo(() => {
        if (typeof document === 'undefined') return null;
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        // Base dark walnut rich wood tone
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(0, 0, 1024, 1024);

        // Draw individual parquet planks with staggered joints
        const plankHeight = 64; // 16 rows
        const plankWidth = 256; // 4 columns per row

        for (let row = 0; row < 16; row++) {
            const y = row * plankHeight;
            const xOffset = (row % 3) * 85;

            for (let col = -1; col < 6; col++) {
                const x = col * plankWidth + xOffset;

                // Subtle natural wood tone variations
                const tones = ['#1a1715', '#241f1c', '#201c19', '#1e1a17', '#27221e'];
                const tone = tones[(row * 7 + col * 13) % tones.length];
                ctx.fillStyle = tone;
                ctx.fillRect(x + 2, y + 2, plankWidth - 4, plankHeight - 4);

                // Wood grain lines
                ctx.strokeStyle = 'rgba(0,0,0,0.18)';
                ctx.lineWidth = 1;
                for (let g = 0; g < 6; g++) {
                    const gy = y + 8 + g * 9 + Math.sin(col + g) * 2;
                    ctx.beginPath();
                    ctx.moveTo(x + 2, gy);
                    ctx.lineTo(x + plankWidth - 2, gy + (g % 2 === 0 ? 1 : -1));
                    ctx.stroke();
                }

                // Beveled plank seam shadow
                ctx.fillStyle = 'rgba(0,0,0,0.45)';
                ctx.fillRect(x, y + plankHeight - 2, plankWidth, 2);
                ctx.fillRect(x + plankWidth - 2, y, 2, plankHeight);
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
        return texture;
    }, []);

    // -------------------------------------------------------------
    // AREA RUG TEXTURE (Large woven charcoal/heathered rug)
    // -------------------------------------------------------------
    const rugTexture = useMemo(() => {
        if (typeof document === 'undefined') return null;
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.fillStyle = '#18181b';
        ctx.fillRect(0, 0, 512, 512);

        // Woven cross-hatch textile pattern
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 2;
        for (let i = 0; i < 512; i += 8) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(512, i);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 512);
            ctx.stroke();
        }

        // Geometric cyber border trim
        ctx.strokeStyle = '#00f5d4';
        ctx.lineWidth = 6;
        ctx.strokeRect(16, 16, 480, 480);

        ctx.strokeStyle = 'rgba(247, 37, 133, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(26, 26, 460, 460);

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }, []);

    // Dynamic light tone according to environment
    const warmTrackLight = environmentPhase === 'evening' ? '#ffedd5' : '#ffffff';

    return (
        <group>
            {/* ============================================================ */}
            {/* 1. ACTUAL HARDWOOD PARQUET FLOOR                             */}
            {/* ============================================================ */}
            <mesh receiveShadow position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[11.5, 11.5]} />
                <meshStandardMaterial
                    map={woodFloorTexture || undefined}
                    color="#26221f"
                    roughness={0.42}
                    metalness={0.08}
                />
            </mesh>

            {/* LARGE WOVEN DESIGNER AREA RUG UNDER DESK & CHAIR */}
            <mesh receiveShadow position={[0, 0.002, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[4.8, 3.4]} />
                <meshStandardMaterial
                    map={rugTexture || undefined}
                    color="#20222b"
                    roughness={0.88}
                />
            </mesh>

            {/* BEDSIDE RUNNER RUG UNDER FUTON */}
            <mesh receiveShadow position={[-2.6, 0.003, 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[1.8, 2.6]} />
                <meshStandardMaterial
                    color="#131722"
                    roughness={0.9}
                />
            </mesh>

            {/* REAL WOOD SKIRTING BOARDS (BASEBOARDS ALONG PERIMETER) */}
            {/* Back Wall Skirting */}
            <mesh position={[0, 0.07, -3.58]}>
                <boxGeometry args={[10.5, 0.14, 0.03]} />
                <meshStandardMaterial color="#141210" roughness={0.6} />
            </mesh>
            {/* Left Wall Skirting */}
            <mesh position={[-3.58, 0.07, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[10.5, 0.14, 0.03]} />
                <meshStandardMaterial color="#141210" roughness={0.6} />
            </mesh>
            {/* Right Wall Skirting */}
            <mesh position={[3.58, 0.07, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <boxGeometry args={[10.5, 0.14, 0.03]} />
                <meshStandardMaterial color="#141210" roughness={0.6} />
            </mesh>

            {/* ============================================================ */}
            {/* 2. REAL WALLS (ACOUSTIC WOOD SLATS, PLASTER, ENTRYWAY DOOR)  */}
            {/* ============================================================ */}

            {/* --- BACK WALL: LUXURY SCANDINAVIAN ACOUSTIC WOOD SLATS --- */}
            <group position={[0, 2.0, -3.6]}>
                {/* Acoustic Dark Felt Backing Panel */}
                <mesh receiveShadow position={[0, 0, 0]}>
                    <planeGeometry args={[10.8, 4.2]} />
                    <meshStandardMaterial color="#0b0d13" roughness={0.95} />
                </mesh>

                {/* Vertical Dark Oak Slat Array (spaced evenly across the wall) */}
                {Array.from({ length: 58 }).map((_, i) => {
                    const x = -4.5 + i * 0.155;
                    // Leave gap for the window in center (-1.95 to 1.95)
                    if (x > -1.95 && x < 1.95) return null;
                    return (
                        <mesh key={i} castShadow position={[x, 0, 0.015]}>
                            <boxGeometry args={[0.075, 4.15, 0.025]} />
                            <meshStandardMaterial color="#221d19" roughness={0.55} />
                        </mesh>
                    );
                })}

                {/* Overhead Recessed Cove LED Strip Grazing Down Slat Wall */}
                <mesh position={[0, 2.05, 0.03]}>
                    <boxGeometry args={[10.2, 0.025, 0.04]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                </mesh>
            </group>

            {/* --- LEFT WALL: MODERN ARCHITECTURAL CHARCOAL PLASTER & ART --- */}
            <group position={[-3.5, 2.0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <mesh receiveShadow position={[0, 0, 0]}>
                    <planeGeometry args={[10.5, 4.2]} />
                    <meshStandardMaterial color="#0e131d" roughness={0.85} />
                </mesh>

                {/* Modern Floating Walnut Display Shelves */}
                <group position={[-1.2, 0.3, 0.15]}>
                    <mesh castShadow>
                        <boxGeometry args={[1.6, 0.04, 0.28]} />
                        <meshStandardMaterial color="#2a221b" roughness={0.6} />
                    </mesh>
                    {/* Books on shelf */}
                    {[-0.6, -0.45, -0.3, -0.15, 0].map((bx, i) => (
                        <mesh key={i} position={[bx, 0.14, 0]} castShadow>
                            <boxGeometry args={[0.08, 0.24, 0.2]} />
                            <meshStandardMaterial color={['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][i]} />
                        </mesh>
                    ))}
                    {/* Potted desk succulent */}
                    <group position={[0.45, 0.08, 0]}>
                        <mesh castShadow>
                            <cylinderGeometry args={[0.08, 0.06, 0.12, 12]} />
                            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
                        </mesh>
                        <mesh position={[0, 0.1, 0]}>
                            <sphereGeometry args={[0.09, 8, 8]} />
                            <meshStandardMaterial color="#10b981" roughness={0.7} />
                        </mesh>
                    </group>
                </group>

                {/* Framed Cyberpunk / Architectural Canvas Art Prints */}
                <group position={[1.4, 0.2, 0.04]}>
                    {/* Black aluminum frame */}
                    <mesh castShadow>
                        <boxGeometry args={[1.4, 1.8, 0.04]} />
                        <meshStandardMaterial color="#020408" metalness={0.9} roughness={0.2} />
                    </mesh>
                    {/* Art print surface */}
                    <mesh position={[0, 0, 0.022]}>
                        <planeGeometry args={[1.28, 1.68]} />
                        <meshStandardMaterial color="#0f172a" roughness={0.5} />
                    </mesh>
                    {/* Abstract glowing neon art lines inside frame */}
                    <mesh position={[0, 0.1, 0.025]}>
                        <planeGeometry args={[0.9, 0.03]} />
                        <meshBasicMaterial color="#f72585" toneMapped={false} />
                    </mesh>
                    <mesh position={[0, -0.2, 0.025]} rotation={[0, 0, 0.4]}>
                        <planeGeometry args={[0.8, 0.02]} />
                        <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                    </mesh>
                </group>

                {/* Architectural Wall Sconce casting warm up/down light */}
                <group position={[0, 0.6, 0.08]}>
                    <mesh castShadow>
                        <boxGeometry args={[0.12, 0.32, 0.08]} />
                        <meshStandardMaterial color="#0b0f19" metalness={0.8} />
                    </mesh>
                    <pointLight color="#fed7aa" intensity={1.2} distance={3.0} decay={2} position={[0, 0, 0.1]} />
                </group>
            </group>

            {/* --- RIGHT WALL: LOFT BRICK & REAL ENTRYWAY DOOR --- */}
            <group position={[3.5, 2.0, 0]} rotation={[0, -Math.PI / 2, 0]}>
                {/* Full-bleed Loft Wall Surface */}
                <mesh receiveShadow position={[0, 0, 0]}>
                    <planeGeometry args={[10.5, 4.2]} />
                    <meshStandardMaterial color="#0f141f" roughness={0.9} />
                </mesh>

                {/* Real Interior Entryway Door (Wood paneling with steel frame) */}
                <group position={[1.4, -0.85, 0.04]}>
                    {/* Door Outer Steel Architrave Frame */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[1.16, 2.3, 0.08]} />
                        <meshStandardMaterial color="#090d16" metalness={0.8} roughness={0.3} />
                    </mesh>
                    {/* Door Leaf (Dark Walnut Paneled Door) */}
                    <mesh castShadow position={[0, 0, 0.02]}>
                        <boxGeometry args={[1.04, 2.18, 0.05]} />
                        <meshStandardMaterial color="#211b17" roughness={0.6} />
                    </mesh>
                    {/* Door Decorative Inset Panels */}
                    <mesh position={[0, 0.45, 0.048]}>
                        <boxGeometry args={[0.78, 0.8, 0.01]} />
                        <meshStandardMaterial color="#1a1512" roughness={0.5} />
                    </mesh>
                    <mesh position={[0, -0.45, 0.048]}>
                        <boxGeometry args={[0.78, 0.8, 0.01]} />
                        <meshStandardMaterial color="#1a1512" roughness={0.5} />
                    </mesh>
                    {/* Modern Metallic Lever Door Handle */}
                    <group position={[-0.42, 0, 0.07]}>
                        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.012, 0.012, 0.14, 12]} />
                            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
                        </mesh>
                    </group>
                    {/* Subtle warm entryway indicator light */}
                    <mesh position={[0, 1.25, 0.06]}>
                        <boxGeometry args={[0.2, 0.02, 0.03]} />
                        <meshBasicMaterial color="#ffb703" toneMapped={false} />
                    </mesh>
                </group>
            </group>

            {/* ============================================================ */}
            {/* 3. ACTUAL ROOF & INDUSTRIAL CEILING RAFTERS (y = 3.6)       */}
            {/* ============================================================ */}
            <group position={[0, 3.6, 0]}>
                {/* Physical Solid Loft Ceiling Plane overhead */}
                <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[11.5, 11.5]} />
                    <meshStandardMaterial color="#080b11" roughness={0.92} />
                </mesh>

                {/* Exposed Matte-Black Steel Rafters across the ceiling */}
                {[-3.0, -1.8, -0.6, 0.6, 1.8, 3.0].map((rz, i) => (
                    <mesh key={i} castShadow position={[0, -0.1, rz]}>
                        <boxGeometry args={[10.5, 0.2, 0.12]} />
                        <meshStandardMaterial color="#080c14" metalness={0.9} roughness={0.25} />
                    </mesh>
                ))}

                {/* Longitudal Cross Beam */}
                <mesh castShadow position={[0, -0.22, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[10.5, 0.22, 0.14]} />
                    <meshStandardMaterial color="#080c14" metalness={0.9} roughness={0.25} />
                </mesh>

                {/* Modern Track Lighting Rail with Spotlights aimed down */}
                <group position={[0, -0.3, 0]}>
                    {/* Track rail */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[4.8, 0.03, 0.04]} />
                        <meshStandardMaterial color="#0f172a" metalness={0.9} />
                    </mesh>

                    {/* Track Spot 1: Aimed at Battlestation */}
                    <group position={[0, -0.08, 0]}>
                        <mesh castShadow rotation={[0.4, 0, 0]}>
                            <cylinderGeometry args={[0.045, 0.055, 0.12, 12]} />
                            <meshStandardMaterial color="#1e293b" metalness={0.8} />
                        </mesh>
                        <spotLight
                            position={[0, 0, 0]}
                            target-position={[0, 0.8, -0.7]}
                            intensity={1.8}
                            color={warmTrackLight}
                            angle={0.6}
                            penumbra={0.5}
                        />
                    </group>

                    {/* Track Spot 2: Aimed at Coffee Bar */}
                    <group position={[1.8, -0.08, 0]}>
                        <mesh castShadow rotation={[0.3, -0.5, 0]}>
                            <cylinderGeometry args={[0.045, 0.055, 0.12, 12]} />
                            <meshStandardMaterial color="#1e293b" metalness={0.8} />
                        </mesh>
                        <spotLight
                            position={[0, 0, 0]}
                            target-position={[2.4, 0.9, 0.7]}
                            intensity={1.5}
                            color={warmTrackLight}
                            angle={0.55}
                            penumbra={0.5}
                        />
                    </group>

                    {/* Track Spot 3: Aimed at Futon Bed */}
                    <group position={[-1.8, -0.08, 0]}>
                        <mesh castShadow rotation={[0.3, 0.5, 0]}>
                            <cylinderGeometry args={[0.045, 0.055, 0.12, 12]} />
                            <meshStandardMaterial color="#1e293b" metalness={0.8} />
                        </mesh>
                        <spotLight
                            position={[0, 0, 0]}
                            target-position={[-2.4, 0.5, 0.8]}
                            intensity={1.3}
                            color={warmTrackLight}
                            angle={0.55}
                            penumbra={0.5}
                        />
                    </group>
                </group>
            </group>

            {/* ============================================================ */}
            {/* 4. REALISTIC LOFT WINDOW DETAILS (DEEP WOODEN SILL & PLANTS) */}
            {/* ============================================================ */}
            <group position={[0, 0.82, -3.45]}>
                {/* Deep Solid Walnut Window Sill Board (Physical Depth) */}
                <mesh castShadow receiveShadow position={[0, 0, 0.12]}>
                    <boxGeometry args={[3.85, 0.07, 0.32]} />
                    <meshStandardMaterial color="#2d221a" roughness={0.4} metalness={0.1} />
                </mesh>

                {/* Indoor Potted Bonsai Tree on Window Sill */}
                <group position={[-1.2, 0.05, 0.12]}>
                    {/* Ceramic Bonsai Pot */}
                    <mesh castShadow position={[0, 0.05, 0]}>
                        <boxGeometry args={[0.36, 0.1, 0.22]} />
                        <meshStandardMaterial color="#0f172a" roughness={0.3} />
                    </mesh>
                    {/* Soil */}
                    <mesh position={[0, 0.09, 0]}>
                        <boxGeometry args={[0.32, 0.02, 0.18]} />
                        <meshStandardMaterial color="#271c15" roughness={0.9} />
                    </mesh>
                    {/* Bonsai Trunk */}
                    <mesh castShadow position={[0, 0.22, 0]} rotation={[0.1, 0, 0.2]}>
                        <cylinderGeometry args={[0.025, 0.04, 0.26, 8]} />
                        <meshStandardMaterial color="#3b271d" roughness={0.9} />
                    </mesh>
                    {/* Bonsai Foliage Clouds */}
                    <mesh position={[0.08, 0.34, 0]} castShadow>
                        <sphereGeometry args={[0.14, 8, 8]} />
                        <meshStandardMaterial color="#15803d" roughness={0.7} />
                    </mesh>
                    <mesh position={[-0.07, 0.38, 0.04]} castShadow>
                        <sphereGeometry args={[0.11, 8, 8]} />
                        <meshStandardMaterial color="#22c55e" roughness={0.7} />
                    </mesh>
                </group>

                {/* Ceramic Succulent Pots on Window Sill */}
                <group position={[1.2, 0.05, 0.12]}>
                    <mesh castShadow position={[0, 0.06, 0]}>
                        <cylinderGeometry args={[0.07, 0.05, 0.12, 12]} />
                        <meshStandardMaterial color="#ffffff" roughness={0.2} />
                    </mesh>
                    <mesh position={[0, 0.13, 0]}>
                        <sphereGeometry args={[0.08, 8, 8]} />
                        <meshStandardMaterial color="#10b981" roughness={0.8} />
                    </mesh>

                    <mesh castShadow position={[0.2, 0.04, 0]}>
                        <cylinderGeometry args={[0.055, 0.04, 0.08, 12]} />
                        <meshStandardMaterial color="#fbbf24" roughness={0.3} />
                    </mesh>
                    <mesh position={[0.2, 0.09, 0]}>
                        <sphereGeometry args={[0.065, 8, 8]} />
                        <meshStandardMaterial color="#34d399" roughness={0.8} />
                    </mesh>
                </group>

                {/* Elegant Pleated Linen Curtains Draped on Sides of Window */}
                {/* Left Curtain */}
                <mesh position={[-1.9, 1.1, 0.14]} castShadow>
                    <boxGeometry args={[0.35, 2.2, 0.12]} />
                    <meshStandardMaterial color="#1e293b" roughness={0.9} />
                </mesh>
                {/* Right Curtain */}
                <mesh position={[1.9, 1.1, 0.14]} castShadow>
                    <boxGeometry args={[0.35, 2.2, 0.12]} />
                    <meshStandardMaterial color="#1e293b" roughness={0.9} />
                </mesh>
            </group>
        </group>
    );
}
