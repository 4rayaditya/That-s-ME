'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

interface ArchitecturalRoomProps {
    environmentPhase: 'morning' | 'afternoon' | 'evening' | 'night';
}

export default function ArchitecturalRoom({ environmentPhase }: ArchitecturalRoomProps) {
    const isLight = environmentPhase === 'morning' || environmentPhase === 'afternoon';

    // -------------------------------------------------------------
    // PROCEDURAL WARM HONEY OAK / WALNUT PARQUET FLOOR TEXTURE
    // -------------------------------------------------------------
    const woodFloorTexture = useMemo(() => {
        if (typeof document === 'undefined') return null;
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        // Base warm honey oak tone
        ctx.fillStyle = '#6b4e33';
        ctx.fillRect(0, 0, 1024, 1024);

        // Draw individual parquet planks with staggered joints
        const plankHeight = 64; // 16 rows
        const plankWidth = 256; // 4 columns per row

        for (let row = 0; row < 16; row++) {
            const y = row * plankHeight;
            const xOffset = (row % 3) * 85;

            for (let col = -1; col < 6; col++) {
                const x = col * plankWidth + xOffset;

                // Rich natural warm oak wood tones
                const tones = ['#755537', '#836140', '#7b5b3c', '#6d4f32', '#8b6845', '#7a5a39'];
                const tone = tones[(row * 7 + col * 13) % tones.length];
                ctx.fillStyle = tone;
                ctx.fillRect(x + 2, y + 2, plankWidth - 4, plankHeight - 4);

                // Wood grain lines
                ctx.strokeStyle = 'rgba(40, 25, 12, 0.22)';
                ctx.lineWidth = 1;
                for (let g = 0; g < 6; g++) {
                    const gy = y + 8 + g * 9 + Math.sin(col + g) * 2;
                    ctx.beginPath();
                    ctx.moveTo(x + 2, gy);
                    ctx.lineTo(x + plankWidth - 2, gy + (g % 2 === 0 ? 1 : -1));
                    ctx.stroke();
                }

                // Beveled plank seam shadow
                ctx.fillStyle = 'rgba(30, 18, 8, 0.45)';
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
    // AREA RUG TEXTURE (Aesthetic Woven Oatmeal Heathered Rug)
    // -------------------------------------------------------------
    const rugTexture = useMemo(() => {
        if (typeof document === 'undefined') return null;
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        // Neutral warm oatmeal linen textile tone
        ctx.fillStyle = '#e8e2d5';
        ctx.fillRect(0, 0, 512, 512);

        // Woven cross-hatch textile pattern
        ctx.strokeStyle = '#d0c6b4';
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

        // Aesthetic warm terracotta & sand border trim
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 5;
        ctx.strokeRect(16, 16, 480, 480);

        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.strokeRect(26, 26, 460, 460);

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }, []);

    // Dynamic color palettes for walls, ceiling, and lighting
    const plasterWallColor = isLight ? '#f4f0e6' : '#231e1a';
    const ceilingColor = isLight ? '#ebe6dc' : '#1c1815';
    const slatFeltColor = isLight ? '#2a221b' : '#191410';
    const slatWoodColor = isLight ? '#8c6747' : '#573d28';
    const coveLightColor = isLight ? '#fef3c7' : '#fbbf24';
    const curtainColor = isLight ? '#ece6db' : '#3a322b';
    const warmTrackLight = isLight ? '#fffbeb' : '#fed7aa';

    return (
        <group>
            {/* ============================================================ */}
            {/* 1. WARM HARDWOOD PARQUET FLOOR                               */}
            {/* ============================================================ */}
            <mesh receiveShadow position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[11.5, 11.5]} />
                <meshStandardMaterial
                    map={woodFloorTexture || undefined}
                    color={isLight ? '#967451' : '#5a3f28'}
                    roughness={0.45}
                    metalness={0.06}
                />
            </mesh>

            {/* LARGE WOVEN SCANDINAVIAN AREA RUG UNDER DESK & CHAIR */}
            <mesh receiveShadow position={[0, 0.002, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[4.8, 3.4]} />
                <meshStandardMaterial
                    map={rugTexture || undefined}
                    color={isLight ? '#f7f4ed' : '#332a22'}
                    roughness={0.92}
                />
            </mesh>

            {/* BEDSIDE COZY TEXTURED RUNNER RUG UNDER FUTON */}
            <mesh receiveShadow position={[-2.6, 0.003, 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[1.8, 2.6]} />
                <meshStandardMaterial
                    color={isLight ? '#e7e1d5' : '#2d241d'}
                    roughness={0.92}
                />
            </mesh>

            {/* SOLID OAK SKIRTING BOARDS (BASEBOARDS ALONG PERIMETER) */}
            <mesh position={[0, 0.07, -3.58]}>
                <boxGeometry args={[10.5, 0.14, 0.03]} />
                <meshStandardMaterial color={isLight ? '#5a3e29' : '#332215'} roughness={0.55} />
            </mesh>
            <mesh position={[-3.58, 0.07, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[10.5, 0.14, 0.03]} />
                <meshStandardMaterial color={isLight ? '#5a3e29' : '#332215'} roughness={0.55} />
            </mesh>
            <mesh position={[3.58, 0.07, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <boxGeometry args={[10.5, 0.14, 0.03]} />
                <meshStandardMaterial color={isLight ? '#5a3e29' : '#332215'} roughness={0.55} />
            </mesh>

            {/* ============================================================ */}
            {/* 2. REAL WALLS (ACOUSTIC OAK SLATS, LIMEWASH PLASTER, DOOR)   */}
            {/* ============================================================ */}

            {/* --- BACK WALL: LUXURY SCANDINAVIAN ACOUSTIC OAK SLATS WITH WINDOW OPENING --- */}
            <group position={[0, 2.0, -3.6]}>
                {/* Acoustic Felt Backing Panels around Window Opening */}
                {/* Left Wall Section */}
                <mesh receiveShadow position={[-3.7, 0, 0]}>
                    <planeGeometry args={[3.5, 4.2]} />
                    <meshStandardMaterial color={slatFeltColor} roughness={0.95} />
                </mesh>
                {/* Right Wall Section */}
                <mesh receiveShadow position={[3.7, 0, 0]}>
                    <planeGeometry args={[3.5, 4.2]} />
                    <meshStandardMaterial color={slatFeltColor} roughness={0.95} />
                </mesh>
                {/* Below Window Section (sill at y = 0.85) */}
                <mesh receiveShadow position={[0, -1.6, 0]}>
                    <planeGeometry args={[3.9, 1.0]} />
                    <meshStandardMaterial color={slatFeltColor} roughness={0.95} />
                </mesh>
                {/* Above Window Section (lintel at y = 2.95) */}
                <mesh receiveShadow position={[0, 1.55, 0]}>
                    <planeGeometry args={[3.9, 1.1]} />
                    <meshStandardMaterial color={slatFeltColor} roughness={0.95} />
                </mesh>

                {/* Vertical Natural Oak Slat Array */}
                {Array.from({ length: 58 }).map((_, i) => {
                    const x = -4.5 + i * 0.155;
                    const isInWindow = x > -1.95 && x < 1.95;
                    if (isInWindow) {
                        return (
                            <React.Fragment key={i}>
                                {/* Top Slat above window */}
                                <mesh position={[x, 1.55, 0.015]}>
                                    <boxGeometry args={[0.075, 1.1, 0.025]} />
                                    <meshStandardMaterial color={slatWoodColor} roughness={0.5} />
                                </mesh>
                                {/* Bottom Slat below window */}
                                <mesh position={[x, -1.6, 0.015]}>
                                    <boxGeometry args={[0.075, 1.0, 0.025]} />
                                    <meshStandardMaterial color={slatWoodColor} roughness={0.5} />
                                </mesh>
                            </React.Fragment>
                        );
                    }
                    return (
                        <mesh key={i} position={[x, 0, 0.015]}>
                            <boxGeometry args={[0.075, 4.15, 0.025]} />
                            <meshStandardMaterial color={slatWoodColor} roughness={0.5} />
                        </mesh>
                    );
                })}

                {/* Overhead Recessed Cove LED Strip with Warm Amber/Golden Glow */}
                <mesh position={[0, 2.05, 0.03]}>
                    <boxGeometry args={[10.2, 0.025, 0.04]} />
                    <meshBasicMaterial color={coveLightColor} toneMapped={false} />
                </mesh>
            </group>

            {/* --- LEFT WALL: WARM SCANDINAVIAN LIMEWASH PLASTER & ART --- */}
            <group position={[-3.5, 2.0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <mesh receiveShadow position={[0, 0, 0]}>
                    <planeGeometry args={[10.5, 4.2]} />
                    <meshStandardMaterial color={plasterWallColor} roughness={0.88} />
                </mesh>

                {/* Floating Natural Walnut Display Shelves */}
                <group position={[-1.2, 0.3, 0.15]}>
                    <mesh castShadow>
                        <boxGeometry args={[1.6, 0.04, 0.28]} />
                        <meshStandardMaterial color="#5a3d28" roughness={0.5} />
                    </mesh>
                    {/* Books on shelf */}
                    {[-0.6, -0.45, -0.3, -0.15, 0].map((bx, i) => (
                        <mesh key={i} position={[bx, 0.14, 0]} castShadow>
                            <boxGeometry args={[0.08, 0.24, 0.2]} />
                            <meshStandardMaterial color={['#b45309', '#0284c7', '#059669', '#d97706', '#7c3aed'][i]} />
                        </mesh>
                    ))}
                    {/* Potted shelf succulent */}
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

                {/* Framed Minimalist Scandinavian Gallery Canvas Art */}
                <group position={[1.4, 0.2, 0.04]}>
                    {/* Solid warm oak frame */}
                    <mesh castShadow>
                        <boxGeometry args={[1.4, 1.8, 0.05]} />
                        <meshStandardMaterial color="#5a3d28" roughness={0.4} />
                    </mesh>
                    {/* Linen matting board */}
                    <mesh position={[0, 0, 0.024]}>
                        <planeGeometry args={[1.26, 1.66]} />
                        <meshStandardMaterial color={isLight ? '#faf7f2' : '#231e1a'} roughness={0.85} />
                    </mesh>
                    {/* Minimalist Bauhaus / Botanical art composition */}
                    <mesh position={[0, 0.22, 0.026]}>
                        <circleGeometry args={[0.34, 32]} />
                        <meshBasicMaterial color="#d97706" toneMapped={false} />
                    </mesh>
                    <mesh position={[0, -0.18, 0.026]}>
                        <planeGeometry args={[0.62, 0.44]} />
                        <meshBasicMaterial color="#166534" toneMapped={false} />
                    </mesh>
                    <mesh position={[0.15, -0.05, 0.027]} rotation={[0, 0, 0.45]}>
                        <planeGeometry args={[0.03, 0.7]} />
                        <meshBasicMaterial color="#1f2937" toneMapped={false} />
                    </mesh>
                    {/* Protective gallery anti-reflective glass */}
                    <mesh position={[0, 0, 0.028]}>
                        <planeGeometry args={[1.26, 1.66]} />
                        <meshStandardMaterial color="#ffffff" transparent opacity={0.12} roughness={0.04} />
                    </mesh>
                </group>

                {/* Architectural Wall Sconce casting warm up/down light */}
                <group position={[0, 0.6, 0.08]}>
                    <mesh castShadow>
                        <boxGeometry args={[0.12, 0.32, 0.08]} />
                        <meshStandardMaterial color="#785338" metalness={0.7} />
                    </mesh>
                    <pointLight color="#fed7aa" intensity={1.4} distance={3.2} decay={2} position={[0, 0, 0.1]} />
                </group>
            </group>

            {/* --- RIGHT WALL: WARM LIMEWASH PLASTER, ENTRYWAY DOOR & WOODY WARDROBE --- */}
            <group position={[3.5, 2.0, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <mesh receiveShadow position={[0, 0, 0]}>
                    <planeGeometry args={[10.5, 4.2]} />
                    <meshStandardMaterial color={plasterWallColor} roughness={0.88} />
                </mesh>

                {/* Real Interior Entryway Door (Natural Oak Paneling) */}
                <group position={[1.4, -0.85, 0.04]}>
                    {/* Door Outer Steel Frame */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[1.16, 2.3, 0.08]} />
                        <meshStandardMaterial color="#3b2b1d" metalness={0.7} roughness={0.3} />
                    </mesh>
                    {/* Door Leaf (Warm Oak Paneled Door) */}
                    <mesh castShadow position={[0, 0, 0.02]}>
                        <boxGeometry args={[1.04, 2.18, 0.05]} />
                        <meshStandardMaterial color="#6a4c33" roughness={0.5} />
                    </mesh>
                    {/* Door Inset Panels */}
                    <mesh position={[0, 0.45, 0.048]}>
                        <boxGeometry args={[0.78, 0.8, 0.01]} />
                        <meshStandardMaterial color="#553a24" roughness={0.5} />
                    </mesh>
                    <mesh position={[0, -0.45, 0.048]}>
                        <boxGeometry args={[0.78, 0.8, 0.01]} />
                        <meshStandardMaterial color="#553a24" roughness={0.5} />
                    </mesh>
                    {/* Brushed Brass Lever Door Handle */}
                    <group position={[-0.42, 0, 0.07]}>
                        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.014, 0.014, 0.15, 12]} />
                            <meshStandardMaterial color="#eab308" metalness={0.92} roughness={0.15} />
                        </mesh>
                    </group>
                </group>
            </group>

            {/* ============================================================ */}
            {/* 3. TALL AESTHETIC WOODY WARDROBE (FLUTED DOORS & POTHOS)     */}
            {/* ============================================================ */}
            <AestheticWoodWardrobe isLight={isLight} />

            {/* ============================================================ */}
            {/* 4. ABUNDANT BOTANICAL GREENERY: MONSTERA & HANGING MACRAME  */}
            {/* ============================================================ */}
            <LargeMonsteraPlant />
            <HangingMacramePlant />
            <AkariPaperFloorLamp isLight={isLight} />

            {/* ============================================================ */}
            {/* 5. PHYSICAL SOLID CEILING & WARM OAK RAFTERS (y = 3.6)       */}
            {/* ============================================================ */}
            <group position={[0, 3.6, 0]}>
                {/* Physical Ceiling Plane overhead */}
                <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[11.5, 11.5]} />
                    <meshStandardMaterial color={ceilingColor} roughness={0.92} />
                </mesh>

                {/* Architectural Solid Oak Ceiling Rafters */}
                {[-3.0, -1.8, -0.6, 0.6, 1.8, 3.0].map((rz, i) => (
                    <mesh key={i} castShadow position={[0, -0.1, rz]}>
                        <boxGeometry args={[10.5, 0.2, 0.12]} />
                        <meshStandardMaterial color={isLight ? '#6a4c33' : '#3a2719'} roughness={0.45} />
                    </mesh>
                ))}

                {/* Longitudinal Cross Beam */}
                <mesh castShadow position={[0, -0.22, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[10.5, 0.22, 0.14]} />
                    <meshStandardMaterial color={isLight ? '#5a3d26' : '#2d1d11'} roughness={0.45} />
                </mesh>

                {/* Modern Track Rail with Spotlights */}
                <group position={[0, -0.3, 0]}>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[4.8, 0.03, 0.04]} />
                        <meshStandardMaterial color="#2d2218" metalness={0.8} />
                    </mesh>

                    {/* Spot 1: Battlestation Desk */}
                    <group position={[0, -0.08, 0]}>
                        <mesh castShadow rotation={[0.4, 0, 0]}>
                            <cylinderGeometry args={[0.045, 0.055, 0.12, 12]} />
                            <meshStandardMaterial color="#4a3726" metalness={0.7} />
                        </mesh>
                        <spotLight
                            position={[0, 0, 0]}
                            target-position={[0, 0.8, -0.7]}
                            intensity={isLight ? 2.2 : 1.8}
                            color={warmTrackLight}
                            angle={0.6}
                            penumbra={0.5}
                        />
                    </group>

                    {/* Spot 2: Coffee Bar & Counter */}
                    <group position={[1.8, -0.08, 0]}>
                        <mesh castShadow rotation={[0.3, -0.5, 0]}>
                            <cylinderGeometry args={[0.045, 0.055, 0.12, 12]} />
                            <meshStandardMaterial color="#4a3726" metalness={0.7} />
                        </mesh>
                        <spotLight
                            position={[0, 0, 0]}
                            target-position={[2.4, 0.9, 0.7]}
                            intensity={3.4}
                            color={warmTrackLight}
                            angle={0.7}
                            penumbra={0.5}
                        />
                    </group>

                    {/* Spot 3: Futon Bed */}
                    <group position={[-1.8, -0.08, 0]}>
                        <mesh castShadow rotation={[0.3, 0.5, 0]}>
                            <cylinderGeometry args={[0.045, 0.055, 0.12, 12]} />
                            <meshStandardMaterial color="#4a3726" metalness={0.7} />
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
            {/* 6. REALISTIC LOFT WINDOW (DEEP SOLID WOOD SILL & PLANTS)     */}
            {/* ============================================================ */}
            <group position={[0, 0.82, -3.45]}>
                {/* Deep Solid Walnut Window Sill Board */}
                <mesh castShadow receiveShadow position={[0, 0, 0.12]}>
                    <boxGeometry args={[3.85, 0.07, 0.32]} />
                    <meshStandardMaterial color="#5a3d28" roughness={0.4} />
                </mesh>

                {/* Indoor Potted Zen Juniper Bonsai on Window Sill */}
                <RealisticZenBonsai />

                {/* Ceramic Succulent Pots on Window Sill */}
                <AestheticSucculents />

                {/* Natural Oatmeal Draped Linen Curtains */}
                <mesh position={[-1.9, 1.1, 0.14]} castShadow>
                    <boxGeometry args={[0.35, 2.2, 0.12]} />
                    <meshStandardMaterial color={curtainColor} roughness={0.92} />
                </mesh>
                <mesh position={[1.9, 1.1, 0.14]} castShadow>
                    <boxGeometry args={[0.35, 2.2, 0.12]} />
                    <meshStandardMaterial color={curtainColor} roughness={0.92} />
                </mesh>
            </group>
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Tall Scandinavian Aesthetic Woody Wardrobe
// -------------------------------------------------------------
function AestheticWoodWardrobe({ isLight }: { isLight: boolean }) {
    return (
        <group position={[3.15, 1.25, -1.6]} rotation={[0, -Math.PI / 2, 0]}>
            {/* Main Solid Oak Wardrobe Cabinet Body */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[1.32, 2.38, 0.62]} />
                <meshStandardMaterial color={isLight ? '#7c5838' : '#4a3320'} roughness={0.45} />
            </mesh>

            {/* Fluted Vertical Slat Doors (Left & Right) */}
            {Array.from({ length: 18 }).map((_, i) => (
                <mesh key={i} position={[-0.58 + i * 0.068, 0, 0.315]} castShadow>
                    <boxGeometry args={[0.045, 2.32, 0.015]} />
                    <meshStandardMaterial color={isLight ? '#8e6642' : '#573d27'} roughness={0.5} />
                </mesh>
            ))}

            {/* Center Division Seam */}
            <mesh position={[0, 0, 0.32]}>
                <boxGeometry args={[0.015, 2.34, 0.02]} />
                <meshStandardMaterial color="#2d1c12" />
            </mesh>

            {/* Minimalist Brushed Brass Vertical Rod Handles */}
            <group position={[-0.04, 0, 0.34]}>
                <mesh castShadow>
                    <cylinderGeometry args={[0.012, 0.012, 0.38, 12]} />
                    <meshStandardMaterial color="#eab308" metalness={0.92} roughness={0.15} />
                </mesh>
            </group>
            <group position={[0.04, 0, 0.34]}>
                <mesh castShadow>
                    <cylinderGeometry args={[0.012, 0.012, 0.38, 12]} />
                    <meshStandardMaterial color="#eab308" metalness={0.92} roughness={0.15} />
                </mesh>
            </group>

            {/* Tapered Wooden Feet (4 Corners) */}
            {[
                [-0.56, -0.24],
                [0.56, -0.24],
                [-0.56, 0.24],
                [0.56, 0.24],
            ].map(([fx, fz], idx) => (
                <mesh key={idx} position={[fx, -1.24, fz]} castShadow>
                    <cylinderGeometry args={[0.026, 0.018, 0.12, 8]} />
                    <meshStandardMaterial color={isLight ? '#5a3d26' : '#332115'} roughness={0.5} />
                </mesh>
            ))}

            {/* CROWN TOP: TRAILING POTHOS PLANT CASCADING DOWN SIDE */}
            <group position={[0.32, 1.28, 0.08]}>
                {/* Fluted Ceramic Pot */}
                <mesh castShadow position={[0, 0.08, 0]}>
                    <cylinderGeometry args={[0.13, 0.10, 0.16, 16]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.3} />
                </mesh>
                {/* Pot Soil */}
                <mesh position={[0, 0.15, 0]}>
                    <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
                    <meshStandardMaterial color="#271c15" roughness={0.9} />
                </mesh>
                {/* Bushy Foliage Dome */}
                <mesh position={[0, 0.22, 0]} castShadow>
                    <sphereGeometry args={[0.16, 10, 10]} />
                    <meshStandardMaterial color="#10b981" roughness={0.6} />
                </mesh>
                {/* Trailing Green Pothos Vines */}
                <mesh position={[0.06, -0.32, 0.18]} castShadow>
                    <cylinderGeometry args={[0.01, 0.015, 0.85, 6]} />
                    <meshStandardMaterial color="#059669" roughness={0.7} />
                </mesh>
                {[-0.1, -0.25, -0.42, -0.6, -0.76].map((vy, vi) => (
                    <mesh key={vi} position={[0.07 + (vi % 2 === 0 ? 0.04 : -0.03), vy, 0.2]} rotation={[0.2, 0.3, 0.4]} castShadow>
                        <sphereGeometry args={[0.065, 8, 8]} />
                        <meshStandardMaterial color={vi % 2 === 0 ? '#10b981' : '#34d399'} roughness={0.6} />
                    </mesh>
                ))}
            </group>
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Realistic Zen Juniper Bonsai on Window Sill
// -------------------------------------------------------------
function RealisticZenBonsai() {
    return (
        <group position={[-1.2, 0.05, 0.12]}>
            {/* Low Japanese Ceramic Bonsai Tray */}
            <mesh castShadow position={[0, 0.03, 0]}>
                <boxGeometry args={[0.38, 0.06, 0.24]} />
                <meshStandardMaterial color="#232326" roughness={0.6} />
            </mesh>
            {/* Tray Feet */}
            {[-0.16, 0.16].map((fx, i) =>
                [-0.09, 0.09].map((fz, j) => (
                    <mesh key={`${i}-${j}`} position={[fx, 0.006, fz]}>
                        <boxGeometry args={[0.03, 0.012, 0.03]} />
                        <meshStandardMaterial color="#1a1a1c" roughness={0.6} />
                    </mesh>
                ))
            )}
            {/* Dark Organic Moss Soil */}
            <mesh position={[0, 0.06, 0]}>
                <boxGeometry args={[0.34, 0.01, 0.20]} />
                <meshStandardMaterial color="#1c2518" roughness={0.9} />
            </mesh>

            {/* Miniature Zen River Stones */}
            <mesh position={[-0.08, 0.075, 0.05]} rotation={[0.2, 0.4, 0]}>
                <sphereGeometry args={[0.022, 8, 8]} />
                <meshStandardMaterial color="#64748b" roughness={0.4} />
            </mesh>
            <mesh position={[-0.11, 0.072, 0.03]}>
                <sphereGeometry args={[0.016, 8, 8]} />
                <meshStandardMaterial color="#94a3b8" roughness={0.4} />
            </mesh>

            {/* Sculpted Gnarled Wooden Trunk with Natural S-Curves */}
            <group position={[0.04, 0.06, 0]}>
                {/* Trunk Base */}
                <mesh castShadow position={[0, 0.05, 0]} rotation={[0.1, 0, 0.25]}>
                    <cylinderGeometry args={[0.024, 0.038, 0.12, 10]} />
                    <meshStandardMaterial color="#3d2817" roughness={0.88} />
                </mesh>
                {/* Mid Trunk Curving Left */}
                <mesh castShadow position={[-0.03, 0.14, 0.01]} rotation={[-0.15, 0, -0.35]}>
                    <cylinderGeometry args={[0.018, 0.024, 0.12, 10]} />
                    <meshStandardMaterial color="#3d2817" roughness={0.88} />
                </mesh>
                {/* Upper Crown Bough */}
                <mesh castShadow position={[-0.06, 0.23, 0]} rotation={[0.1, 0, 0.2]}>
                    <cylinderGeometry args={[0.012, 0.018, 0.11, 8]} />
                    <meshStandardMaterial color="#452e1b" roughness={0.88} />
                </mesh>
                {/* Weathered Jin Deadwood Spike */}
                <mesh position={[-0.01, 0.27, -0.02]} rotation={[0.4, 0.2, -0.3]}>
                    <coneGeometry args={[0.007, 0.07, 6]} />
                    <meshStandardMaterial color="#d6cfc4" roughness={0.6} />
                </mesh>

                {/* Tiered Evergreen Needle Cloud Pads (Organic Foliage) */}
                {/* Lower Tier Right Cloud */}
                <group position={[0.08, 0.13, 0.02]}>
                    <mesh castShadow position={[0, 0, 0]}>
                        <cylinderGeometry args={[0.075, 0.09, 0.028, 12]} />
                        <meshStandardMaterial color="#142c16" roughness={0.7} />
                    </mesh>
                    <mesh position={[0, 0.015, 0]}>
                        <cylinderGeometry args={[0.06, 0.075, 0.02, 12]} />
                        <meshStandardMaterial color="#22481e" roughness={0.7} />
                    </mesh>
                </group>

                {/* Mid Tier Left Cloud */}
                <group position={[-0.10, 0.20, -0.01]}>
                    <mesh castShadow position={[0, 0, 0]}>
                        <cylinderGeometry args={[0.085, 0.105, 0.032, 12]} />
                        <meshStandardMaterial color="#142c16" roughness={0.7} />
                    </mesh>
                    <mesh position={[0, 0.016, 0]}>
                        <cylinderGeometry args={[0.07, 0.085, 0.022, 12]} />
                        <meshStandardMaterial color="#265022" roughness={0.7} />
                    </mesh>
                </group>

                {/* Upper Crown Main Cloud Pad */}
                <group position={[-0.05, 0.28, 0.01]}>
                    <mesh castShadow position={[0, 0, 0]}>
                        <cylinderGeometry args={[0.10, 0.12, 0.035, 14]} />
                        <meshStandardMaterial color="#163118" roughness={0.7} />
                    </mesh>
                    <mesh position={[0, 0.018, 0]}>
                        <cylinderGeometry args={[0.08, 0.10, 0.025, 14]} />
                        <meshStandardMaterial color="#2a5a25" roughness={0.7} />
                    </mesh>
                    <mesh position={[0.02, 0.032, 0.01]}>
                        <cylinderGeometry args={[0.055, 0.07, 0.018, 10]} />
                        <meshStandardMaterial color="#3d7a35" roughness={0.65} />
                    </mesh>
                </group>
            </group>
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Ceramic Succulent Pots with Rosette Petals
// -------------------------------------------------------------
function AestheticSucculents() {
    return (
        <group position={[1.2, 0.05, 0.12]}>
            {/* Pot 1: Matte White Ceramic Fluted Planter */}
            <group position={[-0.12, 0, 0]}>
                <mesh castShadow position={[0, 0.05, 0]}>
                    <cylinderGeometry args={[0.07, 0.05, 0.10, 16]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.25} />
                </mesh>
                {/* Echeveria Succulent Rosette Petals */}
                <group position={[0, 0.11, 0]}>
                    {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                        const rad = (deg * Math.PI) / 180;
                        return (
                            <mesh key={i} position={[Math.cos(rad) * 0.035, 0, Math.sin(rad) * 0.035]} rotation={[0.4 * Math.sin(rad), rad, 0.4 * Math.cos(rad)]} castShadow>
                                <boxGeometry args={[0.035, 0.012, 0.055]} />
                                <meshStandardMaterial color="#2d6a4f" roughness={0.5} />
                            </mesh>
                        );
                    })}
                    {/* Center Rosette Crown */}
                    <mesh position={[0, 0.02, 0]} castShadow>
                        <sphereGeometry args={[0.035, 8, 8]} />
                        <meshStandardMaterial color="#52b788" roughness={0.5} />
                    </mesh>
                </group>
            </group>

            {/* Pot 2: Warm Terracotta Cylindrical Planter */}
            <group position={[0.12, 0, 0]}>
                <mesh castShadow position={[0, 0.045, 0]}>
                    <cylinderGeometry args={[0.055, 0.045, 0.09, 16]} />
                    <meshStandardMaterial color="#c26338" roughness={0.7} />
                </mesh>
                {/* Jade Plant / Sedum Foliage */}
                <group position={[0, 0.095, 0]}>
                    {[
                        { pos: [0, 0.02, 0], scale: [0.04, 0.04, 0.04], color: '#386641' },
                        { pos: [-0.025, 0.035, 0.02], scale: [0.032, 0.032, 0.032], color: '#6a994e' },
                        { pos: [0.025, 0.035, -0.02], scale: [0.032, 0.032, 0.032], color: '#6a994e' },
                        { pos: [0.02, 0.05, 0.015], scale: [0.025, 0.025, 0.025], color: '#a7c957' },
                    ].map((leaf, idx) => (
                        <mesh key={idx} position={leaf.pos as [number, number, number]} castShadow>
                            <sphereGeometry args={[leaf.scale[0], 8, 8]} />
                            <meshStandardMaterial color={leaf.color} roughness={0.4} />
                        </mesh>
                    ))}
                </group>
            </group>
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Sculpted Large Floor Monstera Deliciosa
// -------------------------------------------------------------
function LargeMonsteraPlant() {
    return (
        <group position={[-1.7, 0, -1.8]}>
            {/* Fluted Matte White Ceramic Planter */}
            <mesh castShadow position={[0, 0.26, 0]}>
                <cylinderGeometry args={[0.27, 0.20, 0.52, 24]} />
                <meshStandardMaterial color="#f7f4ed" roughness={0.3} />
            </mesh>
            {/* Planter Drainage Saucer */}
            <mesh position={[0, 0.02, 0]}>
                <cylinderGeometry args={[0.22, 0.22, 0.04, 20]} />
                <meshStandardMaterial color="#e5ded2" roughness={0.5} />
            </mesh>
            {/* Rich Dark Organic Soil */}
            <mesh position={[0, 0.49, 0]}>
                <cylinderGeometry args={[0.25, 0.25, 0.03, 20]} />
                <meshStandardMaterial color="#1a140e" roughness={0.9} />
            </mesh>

            {/* Arching Graceful Petioles & Sculpted Fenestrated Leaves */}
            {[
                // Mature Broad Leaves with Deep Fenestration
                { stemAngle: 0.2, rotZ: 0.55, stemLen: 0.95, leafPos: [0.42, 1.05, 0.12], leafRot: [0.35, 0.1, 0.5], size: [0.44, 0.54] },
                { stemAngle: -0.7, rotZ: -0.5, stemLen: 0.88, leafPos: [-0.40, 0.98, -0.18], leafRot: [-0.25, -0.3, -0.45], size: [0.40, 0.50] },
                { stemAngle: 1.9, rotZ: 0.6, stemLen: 1.02, leafPos: [0.12, 1.15, 0.45], leafRot: [0.65, 0.25, 0.15], size: [0.46, 0.56] },
                { stemAngle: -2.2, rotZ: -0.55, stemLen: 0.82, leafPos: [-0.24, 0.92, -0.40], leafRot: [-0.55, 0.15, -0.35], size: [0.38, 0.48] },
                { stemAngle: 3.1, rotZ: 0.45, stemLen: 0.92, leafPos: [0.28, 1.02, -0.32], leafRot: [-0.35, 0.55, 0.35], size: [0.42, 0.52] },
                // Young Pale Leaf emerging in center
                { stemAngle: 0.9, rotZ: 0.2, stemLen: 0.72, leafPos: [0.10, 0.85, 0.10], leafRot: [0.2, 0.1, 0.2], size: [0.26, 0.34], isYoung: true },
            ].map((stem, idx) => (
                <group key={idx}>
                    {/* Arching Petiole Stem */}
                    <mesh position={[stem.leafPos[0] * 0.45, 0.49 + stem.stemLen * 0.32, stem.leafPos[2] * 0.45]} rotation={[0, stem.stemAngle, stem.rotZ]} castShadow>
                        <cylinderGeometry args={[0.012, 0.022, stem.stemLen, 8]} />
                        <meshStandardMaterial color={stem.isYoung ? '#65a30d' : '#14532d'} roughness={0.5} />
                    </mesh>

                    {/* Sculpted Heart-Shaped Monstera Leaf Plate */}
                    <group position={stem.leafPos as [number, number, number]} rotation={stem.leafRot as [number, number, number]}>
                        {/* Central Leaf Blade with glossy sheen */}
                        <mesh castShadow>
                            <boxGeometry args={[stem.size[0], 0.015, stem.size[1]]} />
                            <meshStandardMaterial
                                color={stem.isYoung ? '#84cc16' : idx % 2 === 0 ? '#143e1f' : '#1a4d27'}
                                roughness={0.28}
                                metalness={0.05}
                            />
                        </mesh>
                        {/* Distinct Center Petiole Vein */}
                        <mesh position={[0, 0.01, 0]}>
                            <boxGeometry args={[0.014, 0.012, stem.size[1] * 0.9]} />
                            <meshStandardMaterial color="#4ade80" roughness={0.4} />
                        </mesh>
                        {/* Leaf Fenestrations / Natural Cleft Notches */}
                        {!stem.isYoung && (
                            <>
                                <mesh position={[stem.size[0] * 0.28, 0.01, 0.05]} rotation={[0, 0.4, 0]}>
                                    <boxGeometry args={[0.08, 0.018, 0.02]} />
                                    <meshStandardMaterial color="#0f2914" roughness={0.3} />
                                </mesh>
                                <mesh position={[-stem.size[0] * 0.28, 0.01, -0.05]} rotation={[0, -0.4, 0]}>
                                    <boxGeometry args={[0.08, 0.018, 0.02]} />
                                    <meshStandardMaterial color="#0f2914" roughness={0.3} />
                                </mesh>
                            </>
                        )}
                    </group>
                </group>
            ))}
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Hanging Macrame Planter with Delicate Cascading Vines
// -------------------------------------------------------------
function HangingMacramePlant() {
    return (
        <group position={[-0.8, 2.7, 0.3]}>
            {/* Braided Macrame Hanging Ropes */}
            {[-0.1, 0.1].map((rx, i) =>
                [-0.1, 0.1].map((rz, j) => (
                    <mesh key={`${i}-${j}`} position={[rx * 0.5, 0.45, rz * 0.5]}>
                        <cylinderGeometry args={[0.004, 0.004, 0.9, 6]} />
                        <meshStandardMaterial color="#e5ded2" roughness={0.85} />
                    </mesh>
                ))
            )}
            {/* Hanging Ceramic Pot */}
            <mesh castShadow position={[0, 0, 0]}>
                <sphereGeometry args={[0.16, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#faf7f0" roughness={0.3} side={THREE.DoubleSide} />
            </mesh>
            {/* Bottom Macrame Tassel Fringe */}
            <mesh position={[0, -0.09, 0]}>
                <coneGeometry args={[0.025, 0.10, 8]} />
                <meshStandardMaterial color="#d6cfc4" roughness={0.9} />
            </mesh>
            {/* Soil */}
            <mesh position={[0, 0.02, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
                <meshStandardMaterial color="#1a140e" roughness={0.9} />
            </mesh>
            {/* Lush Crown of Trailing Foliage */}
            <mesh position={[0, 0.06, 0]} castShadow>
                <sphereGeometry args={[0.17, 12, 12]} />
                <meshStandardMaterial color="#166534" roughness={0.5} />
            </mesh>

            {/* Cascading English Ivy & String-of-Pearls Vines */}
            {[
                { x: 0.12, z: 0.08, len: 0.48, color: '#22c55e' },
                { x: -0.11, z: 0.09, len: 0.62, color: '#16a34a' },
                { x: 0.08, z: -0.10, len: 0.38, color: '#4ade80' },
                { x: -0.09, z: -0.08, len: 0.54, color: '#15803d' },
                { x: 0, z: 0.13, len: 0.70, color: '#166534' },
                { x: -0.14, z: 0.02, len: 0.42, color: '#22c55e' },
            ].map((vine, idx) => (
                <group key={idx} position={[vine.x, 0, vine.z]}>
                    <mesh position={[0, -vine.len * 0.5, 0]}>
                        <cylinderGeometry args={[0.003, 0.003, vine.len, 6]} />
                        <meshStandardMaterial color="#15803d" roughness={0.7} />
                    </mesh>
                    {/* Small Leaf Nodes Draped along the Vine */}
                    {Array.from({ length: 5 }).map((_, li) => (
                        <mesh
                            key={li}
                            position={[
                                (li % 2 === 0 ? 0.015 : -0.015),
                                -vine.len * (0.2 + li * 0.16),
                                (li % 3 === 0 ? 0.01 : -0.01),
                            ]}
                            rotation={[0.2, li * 0.8, 0.3]}
                            castShadow
                        >
                            <boxGeometry args={[0.024, 0.008, 0.028]} />
                            <meshStandardMaterial color={vine.color} roughness={0.4} />
                        </mesh>
                    ))}
                </group>
            ))}
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Designer Japanese Akari / Noguchi Paper Floor Lamp
// -------------------------------------------------------------
function AkariPaperFloorLamp({ isLight }: { isLight: boolean }) {
    return (
        <group position={[-3.1, 0, -1.8]}>
            {/* Slender Tripod Black Wire Legs */}
            {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
                <mesh
                    key={i}
                    position={[Math.cos(angle) * 0.12, 0.34, Math.sin(angle) * 0.12]}
                    rotation={[0.18 * Math.sin(angle), angle, -0.18 * Math.cos(angle)]}
                    castShadow
                >
                    <cylinderGeometry args={[0.005, 0.005, 0.72, 6]} />
                    <meshStandardMaterial color="#1c1917" metalness={0.8} roughness={0.3} />
                </mesh>
            ))}

            {/* Central Wire Upright */}
            <mesh position={[0, 0.65, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 0.2, 6]} />
                <meshStandardMaterial color="#1c1917" metalness={0.8} />
            </mesh>

            {/* Washi Paper Oval Lantern Shade */}
            <group position={[0, 0.92, 0]}>
                {/* Translucent Washi Paper Diffuser Body */}
                <mesh castShadow receiveShadow>
                    <sphereGeometry args={[0.24, 20, 20]} />
                    <meshStandardMaterial
                        color="#fef9ee"
                        roughness={0.85}
                        emissive="#fed7aa"
                        emissiveIntensity={isLight ? 0.2 : 0.65}
                    />
                </mesh>
                {/* Horizontal Bamboo Ribbing Rings */}
                {[-0.14, -0.07, 0, 0.07, 0.14].map((ry, i) => (
                    <mesh key={i} position={[0, ry, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[Math.sqrt(Math.max(0.01, 0.24 * 0.24 - ry * ry)) * 1.01, 0.003, 8, 24]} />
                        <meshStandardMaterial color="#d4c7b5" roughness={0.9} />
                    </mesh>
                ))}

                {/* Soft Warm Inner Ambient Glow */}
                <pointLight
                    color="#fef3c7"
                    intensity={isLight ? 0.7 : 1.4}
                    distance={3.8}
                    decay={2}
                />
            </group>
        </group>
    );
}
