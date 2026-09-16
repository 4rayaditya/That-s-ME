'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ArchitecturalRoomProps {
    environmentPhase: 'morning' | 'afternoon' | 'evening' | 'night';
}

function ArchitecturalRoom({ environmentPhase }: ArchitecturalRoomProps) {
    
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
    const plasterWallColor = '#231e1a';
    const ceilingColor = '#1c1815';
    const slatFeltColor = '#191410';
    const slatWoodColor = '#573d28';
    const coveLightColor = '#fbbf24';
    const curtainColor = '#3a322b';
    const warmTrackLight = '#fed7aa';

    return (
        <group>
            {/* ============================================================ */}
            {/* 1. WARM HARDWOOD PARQUET FLOOR                               */}
            {/* ============================================================ */}
            <mesh receiveShadow position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[11.5, 11.5]} />
                <meshStandardMaterial
                    map={woodFloorTexture || undefined}
                    color="#5a3f28"
                    roughness={0.45}
                    metalness={0.06}
                />
            </mesh>

            {/* LARGE WOVEN SCANDINAVIAN AREA RUG UNDER DESK & CHAIR */}
            <mesh receiveShadow position={[0, 0.002, -1.95]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[4.8, 3.2]} />
                <meshStandardMaterial
                    map={rugTexture || undefined}
                    color="#332a22"
                    roughness={0.92}
                />
            </mesh>

            {/* COZY WOVEN TEXTURED CARPET EXTENDING UNDER FUTON BED */}
            <mesh receiveShadow position={[-2.4, 0.003, 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2.8, 3.2]} />
                <meshStandardMaterial
                    color="#2d241d"
                    roughness={0.92}
                />
            </mesh>

            {/* SOLID OAK SKIRTING BOARDS (BASEBOARDS ALONG PERIMETER) */}
            <mesh position={[0, 0.07, -3.58]}>
                <boxGeometry args={[10.5, 0.14, 0.03]} />
                <meshStandardMaterial color="#332215" roughness={0.55} />
            </mesh>
            <mesh position={[-3.58, 0.07, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[10.5, 0.14, 0.03]} />
                <meshStandardMaterial color="#332215" roughness={0.55} />
            </mesh>
            <mesh position={[3.58, 0.07, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <boxGeometry args={[10.5, 0.14, 0.03]} />
                <meshStandardMaterial color="#332215" roughness={0.55} />
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

                {/* ============================================================ */}
                {/* REALISTIC ARCHITECTURAL OVER-BED FLOATING SHELF & ART        */}
                {/* ============================================================ */}
                <group position={[0.8, 0.25, 0.15]}>
                    {/* Solid Live-Edge Smoked Walnut Shelf Plank */}
                    <mesh receiveShadow>
                        <boxGeometry args={[1.9, 0.04, 0.28]} />
                        <meshStandardMaterial color="#422e1e" roughness={0.4} metalness={0.06} />
                    </mesh>

                    {/* Blackened Steel Structural Brackets with Industrial Hex Bolts */}
                    {[-0.75, 0.75].map((bx, i) => (
                        <group key={i} position={[bx, -0.06, -0.04]}>
                            {/* Wall bracket strip */}
                            <mesh position={[0, -0.06, -0.09]}>
                                <boxGeometry args={[0.032, 0.16, 0.008]} />
                                <meshStandardMaterial color="#18181b" metalness={0.88} roughness={0.2} />
                            </mesh>
                            {/* Shelf under-support arm */}
                            <mesh position={[0, 0.04, 0.02]}>
                                <boxGeometry args={[0.032, 0.008, 0.22]} />
                                <meshStandardMaterial color="#18181b" metalness={0.88} roughness={0.2} />
                            </mesh>
                        </group>
                    ))}

                    {/* Ambient Warm Under-Shelf LED Wash */}
                    <mesh position={[0, -0.022, 0.02]}>
                        <boxGeometry args={[1.75, 0.006, 0.012]} />
                        <meshBasicMaterial color="#fef3c7" toneMapped={false} />
                    </mesh>

                    {/* --- REALISTIC HARDBOUND BOOKS WITH TEXTURED SPINES & INSET PAGES --- */}
                    <group position={[-0.55, 0.02, 0.02]}>
                        {/* Book 1: Large Architectural Design Tome (Midnight Charcoal Cloth) */}
                        <group position={[-0.26, 0.14, 0]}>
                            <mesh>
                                <boxGeometry args={[0.064, 0.28, 0.22]} />
                                <meshStandardMaterial color="#18181b" roughness={0.7} />
                            </mesh>
                            {/* Cream page block inset */}
                            <mesh position={[0.002, 0, 0.015]}>
                                <boxGeometry args={[0.056, 0.268, 0.19]} />
                                <meshStandardMaterial color="#fefce8" roughness={0.9} />
                            </mesh>
                            {/* Embossed Gold Foil Spine Band */}
                            <mesh position={[-0.031, 0.06, 0]}>
                                <boxGeometry args={[0.002, 0.012, 0.21]} />
                                <meshStandardMaterial color="#eab308" metalness={0.95} roughness={0.15} />
                            </mesh>
                        </group>

                        {/* Book 2: Cyberpunk Art Anthology (Oxford Navy Linen) */}
                        <group position={[-0.19, 0.125, -0.005]}>
                            <mesh>
                                <boxGeometry args={[0.054, 0.25, 0.21]} />
                                <meshStandardMaterial color="#1e293b" roughness={0.65} />
                            </mesh>
                            <mesh position={[0.002, 0, 0.015]}>
                                <boxGeometry args={[0.046, 0.238, 0.18]} />
                                <meshStandardMaterial color="#fefce8" roughness={0.9} />
                            </mesh>
                        </group>

                        {/* Book 3: Japanese Architecture Monograph (Forest Green) */}
                        <group position={[-0.13, 0.115, 0]}>
                            <mesh>
                                <boxGeometry args={[0.048, 0.23, 0.20]} />
                                <meshStandardMaterial color="#14532d" roughness={0.6} />
                            </mesh>
                            <mesh position={[0.002, 0, 0.015]}>
                                <boxGeometry args={[0.040, 0.218, 0.17]} />
                                <meshStandardMaterial color="#fefce8" roughness={0.9} />
                            </mesh>
                        </group>

                        {/* Book 4: Minimalist Interiors (Oatmeal Textured Paper) */}
                        <group position={[-0.075, 0.13, 0.005]}>
                            <mesh>
                                <boxGeometry args={[0.052, 0.26, 0.21]} />
                                <meshStandardMaterial color="#d6d3d1" roughness={0.8} />
                            </mesh>
                            <mesh position={[0.002, 0, 0.015]}>
                                <boxGeometry args={[0.044, 0.248, 0.18]} />
                                <meshStandardMaterial color="#fefce8" roughness={0.9} />
                            </mesh>
                        </group>

                        {/* Book 5: Tilted Leaning Book (Terracotta Leather) */}
                        <group position={[-0.015, 0.115, 0]} rotation={[0, 0, -0.18]}>
                            <mesh>
                                <boxGeometry args={[0.045, 0.23, 0.20]} />
                                <meshStandardMaterial color="#9a3412" roughness={0.65} />
                            </mesh>
                            <mesh position={[0.002, 0, 0.015]}>
                                <boxGeometry args={[0.038, 0.218, 0.17]} />
                                <meshStandardMaterial color="#fefce8" roughness={0.9} />
                            </mesh>
                        </group>

                        {/* Heavy Machined Brushed Brass Triangular Bookend */}
                        <group position={[0.055, 0.07, 0]}>
                            <mesh rotation={[0, 0, Math.PI / 4]}>
                                <boxGeometry args={[0.10, 0.10, 0.16]} />
                                <meshStandardMaterial color="#eab308" metalness={0.95} roughness={0.15} />
                            </mesh>
                        </group>
                    </group>

                    {/* --- CERAMIC ABSTRACT DONUT VASE WITH DRIED FLORAL STEMS --- */}
                    <group position={[0.08, 0.09, -0.02]}>
                        <mesh rotation={[0, Math.PI / 2, 0]}>
                            <torusGeometry args={[0.065, 0.024, 16, 24]} />
                            <meshStandardMaterial color="#f1f5f9" roughness={0.7} />
                        </mesh>
                        {/* Vase weighted pedestal */}
                        <mesh position={[0, -0.065, 0]}>
                            <cylinderGeometry args={[0.045, 0.05, 0.02, 16]} />
                            <meshStandardMaterial color="#f1f5f9" roughness={0.7} />
                        </mesh>
                        {/* Delicate dried floral lunaria sprig */}
                        <mesh position={[0, 0.08, 0]} rotation={[0, 0, 0.12]}>
                            <cylinderGeometry args={[0.002, 0.003, 0.14, 6]} />
                            <meshStandardMaterial color="#78716c" roughness={0.9} />
                        </mesh>
                    </group>

                    {/* --- REALISTIC TRAILING INDOOR PLANT (Pothos with organic cascading leaves) --- */}
                    <group position={[0.42, 0.02, 0.04]}>
                        {/* Warm Sandstone Fluted Ceramic Planter */}
                        <mesh position={[0, 0.07, 0]}>
                            <cylinderGeometry args={[0.08, 0.06, 0.14, 18]} />
                            <meshStandardMaterial color="#c2b19d" roughness={0.65} />
                        </mesh>
                        {/* Rich potting soil */}
                        <mesh position={[0, 0.138, 0]}>
                            <cylinderGeometry args={[0.076, 0.076, 0.01, 16]} />
                            <meshStandardMaterial color="#271c14" roughness={0.9} />
                        </mesh>

                        {/* Dense Foliage Crown */}
                        <mesh position={[0, 0.16, 0]}>
                            <sphereGeometry args={[0.09, 12, 10]} />
                            <meshStandardMaterial color="#15803d" roughness={0.7} />
                        </mesh>

                        {/* Natural cascading vine leaves drooping over the front edge of the shelf */}
                        {[
                            { x: -0.05, y: 0.10, z: 0.08, rx: 0.8, rz: -0.2, s: 0.045 },
                            { x: 0.01, y: 0.06, z: 0.09, rx: 1.1, rz: 0.1, s: 0.042 },
                            { x: 0.06, y: 0.08, z: 0.08, rx: 0.9, rz: 0.3, s: 0.040 },
                            { x: -0.02, y: -0.01, z: 0.10, rx: 1.4, rz: -0.1, s: 0.038 },
                            { x: 0.04, y: -0.04, z: 0.10, rx: 1.5, rz: 0.15, s: 0.036 },
                            { x: 0.02, y: -0.10, z: 0.105, rx: 1.6, rz: 0.05, s: 0.032 },
                        ].map((leaf, idx) => (
                            <mesh key={idx} position={[leaf.x, leaf.y, leaf.z]} rotation={[leaf.rx, 0, leaf.rz]}>
                                <sphereGeometry args={[leaf.s, 8, 6]} />
                                <meshStandardMaterial color={idx % 2 === 0 ? '#166534' : '#15803d'} roughness={0.6} />
                            </mesh>
                        ))}
                    </group>

                    {/* Mini Framed Black-and-White Art resting on shelf */}
                    <group position={[0.70, 0.10, -0.02]} rotation={[0, -0.15, 0.04]}>
                        <mesh>
                            <boxGeometry args={[0.16, 0.20, 0.014]} />
                            <meshStandardMaterial color="#ca8a04" metalness={0.9} roughness={0.2} />
                        </mesh>
                        <mesh position={[0, 0, 0.008]}>
                            <planeGeometry args={[0.13, 0.17]} />
                            <meshStandardMaterial color="#09090b" roughness={0.5} />
                        </mesh>
                    </group>
                </group>

                {/* ============================================================ */}
                {/* LARGE MINIMALIST ARCHITECTURAL GALLERY ART ABOVE BED         */}
                {/* ============================================================ */}
                <group position={[0.8, 0.95, 0.04]}>
                    {/* Slim Dark Oak Gallery Frame */}
                    <mesh>
                        <boxGeometry args={[1.5, 0.95, 0.04]} />
                        <meshStandardMaterial color="#2d1c10" roughness={0.4} />
                    </mesh>
                    {/* Deep Warm Linen Matting Board */}
                    <mesh position={[0, 0, 0.021]}>
                        <planeGeometry args={[1.40, 0.85]} />
                        <meshStandardMaterial color="#1f1b18" roughness={0.88} />
                    </mesh>
                    {/* Elegant Japandi / Bauhaus Geometric Art Composition */}
                    <mesh position={[-0.22, 0.08, 0.023]}>
                        <circleGeometry args={[0.24, 32]} />
                        <meshBasicMaterial color="#b45309" toneMapped={false} />
                    </mesh>
                    <mesh position={[0.18, -0.06, 0.023]}>
                        <planeGeometry args={[0.48, 0.36]} />
                        <meshBasicMaterial color="#166534" toneMapped={false} />
                    </mesh>
                    <mesh position={[0.04, 0.02, 0.024]} rotation={[0, 0, 0.45]}>
                        <planeGeometry args={[0.02, 0.55]} />
                        <meshBasicMaterial color="#262626" toneMapped={false} />
                    </mesh>
                    {/* Protective Museum Non-Glare Glass Reflection */}
                    <mesh position={[0, 0, 0.025]}>
                        <planeGeometry args={[1.40, 0.85]} />
                        <meshStandardMaterial color="#ffffff" transparent opacity={0.08} roughness={0.05} />
                    </mesh>
                </group>

                {/* The "Geek Corner" superhero-poster (bold red/blue diagonal color-streaks in a
                    frame) used to live here. Removed â€” it read as messy overlapping colored
                    shapes rather than a poster, not the intended look. */}

                {/* Architectural Wall Sconce (decorative fixture only now â€” its point light was
                    removed as part of the room's lighting budget cut) */}
                <group position={[0, 0.6, 0.08]}>
                    <mesh>
                        <boxGeometry args={[0.12, 0.32, 0.08]} />
                        <meshStandardMaterial color="#785338" metalness={0.7} />
                    </mesh>
                </group>
            </group>

            {/* --- RIGHT WALL: WARM LIMEWASH PLASTER & WOODY WARDROBE --- */}
            <group position={[3.5, 2.0, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <mesh receiveShadow position={[0, 0, 0]}>
                    <planeGeometry args={[10.5, 4.2]} />
                    <meshStandardMaterial color={plasterWallColor} roughness={0.88} />
                </mesh>
            </group>

            {/* ============================================================ */}
            {/* 3. TALL AESTHETIC WOODY WARDROBE (FLUTED DOORS & POTHOS)     */}
            {/* ============================================================ */}
            <AestheticWoodWardrobe />

            {/* ============================================================ */}
            {/* 4. BOTANICAL GREENERY: HANGING MACRAME                      */}
            {/* ============================================================ */}
            <HangingMacramePlant />

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
                    <mesh key={i} position={[0, -0.1, rz]}>
                        <boxGeometry args={[10.5, 0.2, 0.12]} />
                        <meshStandardMaterial color="#3a2719" roughness={0.45} />
                    </mesh>
                ))}

                {/* Longitudinal Cross Beam */}
                <mesh position={[0, -0.22, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[10.5, 0.22, 0.14]} />
                    <meshStandardMaterial color="#2d1d11" roughness={0.45} />
                </mesh>

                {/* Modern Track Rail with Spotlights */}
                <group position={[0, -0.3, 0]}>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[4.8, 0.03, 0.04]} />
                        <meshStandardMaterial color="#2d2218" metalness={0.8} />
                    </mesh>

                    {/* Spot 1: Battlestation Desk â€” one of the room's 5 accent lights (desk
                        task spotlight). The rail still shows all 3 fixture heads below (Spot 2 &
                        3 kept as decorative track heads); only Spot 1 is an actual light now â€”
                        the coffee counter and bed each already get their own dedicated pendant
                        light instead, so lighting the same spots twice would be redundant. */}
                    <group position={[0, -0.08, 0]}>
                        <mesh rotation={[0.4, 0, 0]}>
                            <cylinderGeometry args={[0.045, 0.055, 0.12, 12]} />
                            <meshStandardMaterial color="#4a3726" metalness={0.7} />
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

                    {/* Spot 2: Coffee Bar & Counter (decorative track head only) */}
                    <group position={[1.8, -0.08, 0]}>
                        <mesh rotation={[0.3, -0.5, 0]}>
                            <cylinderGeometry args={[0.045, 0.055, 0.12, 12]} />
                            <meshStandardMaterial color="#4a3726" metalness={0.7} />
                        </mesh>
                    </group>

                    {/* Spot 3: Futon Bed (decorative track head only) */}
                    <group position={[-1.8, -0.08, 0]}>
                        <mesh rotation={[0.3, 0.5, 0]}>
                            <cylinderGeometry args={[0.045, 0.055, 0.12, 12]} />
                            <meshStandardMaterial color="#4a3726" metalness={0.7} />
                        </mesh>
                    </group>
                </group>
            </group>

            {/* ============================================================ */}
            {/* 6. REALISTIC LOFT WINDOW (DEEP SOLID WOOD SILL & PLANTS)     */}
            {/* ============================================================ */}
            <group position={[0, 0.82, -3.45]}>
                {/* Deep Solid Walnut Window Sill Board */}
                <mesh receiveShadow position={[0, 0, 0.12]}>
                    <boxGeometry args={[3.85, 0.07, 0.32]} />
                    <meshStandardMaterial color="#5a3d28" roughness={0.4} />
                </mesh>

                {/* Indoor Potted Zen Juniper Bonsai on Window Sill */}
                <RealisticZenBonsai />

                {/* Ceramic Succulent Pots on Window Sill */}
                <AestheticSucculents />

                {/* Fully Drawn Linen Curtains (closed for the night â€” the outside view is gone,
                    so the window stays covered instead of showing bare glass) */}
                <ClosedNightCurtain curtainColor={curtainColor} />

                {/* Curtain Rod & Warm Uplight (washes light onto the acoustic oak slat wall
                    above the curtain so the wood grain stays visible at night) */}
                <CurtainRodWallWashLight glowColor={coveLightColor} />
            </group>
        </group>
    );
}

export default React.memo(ArchitecturalRoom);

// -------------------------------------------------------------
// SUB-COMPONENT: Fully Drawn Linen Curtain (closed across the whole window)
// -------------------------------------------------------------
function ClosedNightCurtain({ curtainColor }: { curtainColor: string }) {
    // Procedural vertical pleat texture so the closed curtain reads as folded
    // fabric instead of a flat slab, without adding any extra geometry.
    const pleatTexture = useMemo(() => {
        if (typeof document === 'undefined') return null;
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 128, 128);
        for (let x = 0; x < 128; x += 16) {
            const grad = ctx.createLinearGradient(x, 0, x + 16, 0);
            grad.addColorStop(0, 'rgba(0,0,0,0.32)');
            grad.addColorStop(0.5, 'rgba(255,255,255,0.22)');
            grad.addColorStop(1, 'rgba(0,0,0,0.32)');
            ctx.fillStyle = grad;
            ctx.fillRect(x, 0, 16, 128);
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.repeat.set(6, 1);
        return texture;
    }, []);

    return (
        <group>
            {/* Left Panel */}
            <mesh position={[-0.96, 1.1, 0.14]}>
                <boxGeometry args={[1.98, 2.2, 0.1]} />
                <meshStandardMaterial map={pleatTexture || undefined} color={curtainColor} roughness={0.92} />
            </mesh>
            {/* Right Panel */}
            <mesh position={[0.96, 1.1, 0.14]}>
                <boxGeometry args={[1.98, 2.2, 0.1]} />
                <meshStandardMaterial map={pleatTexture || undefined} color={curtainColor} roughness={0.92} />
            </mesh>
            {/* Center Seam where the two drawn panels meet */}
            <mesh position={[0, 1.1, 0.19]}>
                <boxGeometry args={[0.03, 2.2, 0.02]} />
                <meshStandardMaterial color="#1a1510" roughness={0.9} />
            </mesh>
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Curtain Rod & Warm Wall-Wash Uplight
// -------------------------------------------------------------
function CurtainRodWallWashLight({ glowColor }: { glowColor: string }) {
    return (
        <group position={[0, 2.28, 0.17]}>
            {/* Slim Bronze Curtain Rod spanning the window */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.018, 0.018, 4.0, 10]} />
                <meshStandardMaterial color="#3d2b1c" metalness={0.6} roughness={0.35} />
            </mesh>
            {/* Brass End Finials */}
            {[-2.0, 2.0].map((fx, i) => (
                <mesh key={i} position={[fx, 0, 0]}>
                    <sphereGeometry args={[0.032, 10, 10]} />
                    <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.2} />
                </mesh>
            ))}
            {/* Small Uplight Fixture Housings mounted on the rod */}
            {[-1.5, 1.5].map((fx, i) => (
                <mesh key={i} position={[fx, 0.03, -0.02]}>
                    <boxGeometry args={[0.09, 0.035, 0.05]} />
                    <meshStandardMaterial color="#1c1410" metalness={0.7} roughness={0.3} />
                </mesh>
            ))}
            {/* Warm Glow washing up onto the acoustic oak slat wall above the curtain, keeping
                the wood grain visible now that the window itself is closed off. One of the
                room's 5 accent lights â€” a single wide-angle spotlight centered on the rod
                covers both fixture housings instead of lighting from each one separately. */}
            <spotLight
                color={glowColor}
                position={[0, 0.05, 0.05]}
                target-position={[0, 0.35, -0.2]}
                intensity={3.4}
                angle={1.1}
                penumbra={0.7}
                distance={2.8}
                decay={2}
            />
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Tall Scandinavian Aesthetic Woody Wardrobe
// -------------------------------------------------------------
function AestheticWoodWardrobe() {
    return (
        <group position={[3.15, 1.25, -1.6]} rotation={[0, -Math.PI / 2, 0]}>
            {/* Dedicated Architectural Warm Accent Lights so the wardrobe and lush cascading pothos are clearly visible */}
            <pointLight position={[0, 1.45, 0.95]} color="#fff3e0" intensity={4.5} distance={4.0} decay={2} />
            <pointLight position={[0, -0.15, 0.85]} color="#fed7aa" intensity={2.6} distance={3.0} decay={2} />

            {/* Main Solid Oak Wardrobe Cabinet Body */}
            <mesh receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[1.32, 2.38, 0.62]} />
                <meshStandardMaterial color="#4a3320" roughness={0.45} />
            </mesh>

            {/* Fluted Vertical Slat Doors (Left & Right) */}
            {Array.from({ length: 18 }).map((_, i) => (
                <mesh key={i} position={[-0.58 + i * 0.068, 0, 0.315]}>
                    <boxGeometry args={[0.045, 2.32, 0.015]} />
                    <meshStandardMaterial color="#573d27" roughness={0.5} />
                </mesh>
            ))}

            {/* Center Division Seam */}
            <mesh position={[0, 0, 0.32]}>
                <boxGeometry args={[0.015, 2.34, 0.02]} />
                <meshStandardMaterial color="#2d1c12" />
            </mesh>

            {/* Minimalist Brushed Brass Vertical Rod Handles */}
            <group position={[-0.04, 0, 0.34]}>
                <mesh>
                    <cylinderGeometry args={[0.012, 0.012, 0.38, 12]} />
                    <meshStandardMaterial color="#eab308" metalness={0.92} roughness={0.15} />
                </mesh>
            </group>
            <group position={[0.04, 0, 0.34]}>
                <mesh>
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
                <mesh key={idx} position={[fx, -1.24, fz]}>
                    <cylinderGeometry args={[0.026, 0.018, 0.12, 8]} />
                    <meshStandardMaterial color="#332115" roughness={0.5} />
                </mesh>
            ))}

            {/* CROWN TOP: REALISTIC STONEWARE TERRACOTTA PLANTER WITH CASCADING POTHOS & FALLING LEAVES */}
            <WardrobeCascadingPothos />
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Realistic Sculpted Heart-Shaped Pothos Leaf
// -------------------------------------------------------------
function SculptedPothosLeaf({
    scale = 1,
    variegationTone = '#a3e635',
}: {
    scale?: number;
    variegationTone?: string;
}) {
    return (
        <group scale={scale}>
            {/* Fine petiole stalk connecting leaf to vine */}
            <mesh position={[0, -0.012, -0.024]} rotation={[0.3, 0, 0]}>
                <cylinderGeometry args={[0.0022, 0.003, 0.045, 5]} />
                <meshStandardMaterial color="#365314" roughness={0.6} />
            </mesh>

            {/* Heart-shaped leaf blade main base (deep forest emerald) */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.062, 0.004, 0.078]} />
                <meshStandardMaterial color="#14532d" roughness={0.35} metalness={0.04} />
            </mesh>

            {/* Heart rounded lobes */}
            <mesh position={[-0.018, 0.001, -0.026]}>
                <sphereGeometry args={[0.022, 8, 8]} />
                <meshStandardMaterial color="#15803d" roughness={0.35} />
            </mesh>
            <mesh position={[0.018, 0.001, -0.026]}>
                <sphereGeometry args={[0.022, 8, 8]} />
                <meshStandardMaterial color="#15803d" roughness={0.35} />
            </mesh>

            {/* Tapered natural heart leaf apex */}
            <mesh position={[0, 0, 0.045]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.030, 0.003, 0.030]} />
                <meshStandardMaterial color="#166534" roughness={0.35} />
            </mesh>

            {/* Natural variegated golden chartreuse splash / streak */}
            <mesh position={[0.011, 0.002, 0.004]} rotation={[0, 0.12, 0]}>
                <boxGeometry args={[0.026, 0.003, 0.052]} />
                <meshStandardMaterial color={variegationTone} roughness={0.38} />
            </mesh>
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Lightweight Mathematical Falling Leaves Particle Loop
// -------------------------------------------------------------
function FallingPothosLeaves() {
    const leaf1 = useRef<THREE.Group>(null);
    const leaf2 = useRef<THREE.Group>(null);
    const leaf3 = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        const fallDistance = 2.45; // Wardrobe top down near floor

        const leavesData = [
            { ref: leaf1, speed: 0.28, offset: 0, startX: 0.08, startZ: 0.24, scale: 0.82 },
            { ref: leaf2, speed: 0.22, offset: 3.4, startX: 0.24, startZ: 0.16, scale: 0.74 },
            { ref: leaf3, speed: 0.25, offset: 5.9, startX: -0.06, startZ: 0.26, scale: 0.78 },
        ];

        leavesData.forEach((l, idx) => {
            if (!l.ref.current) return;
            const progress = (t * l.speed + l.offset) % fallDistance;
            const y = 0.08 - progress;

            // Organic mathematical flutter / air resistance drift
            const swayX = Math.sin(t * 2.3 + idx * 2.4) * 0.065;
            const swayZ = Math.cos(t * 1.9 + idx * 1.8) * 0.05;
            const pitch = Math.sin(t * 2.6 + idx) * 0.55;
            const yaw = t * 0.9 + idx * 1.7;
            const roll = Math.cos(t * 2.1 + idx) * 0.45;

            l.ref.current.position.set(l.startX + swayX, y, l.startZ + swayZ);
            l.ref.current.rotation.set(pitch, yaw, roll);
        });
    });

    return (
        <group>
            <group ref={leaf1}>
                <SculptedPothosLeaf scale={0.82} variegationTone="#a3e635" />
            </group>
            <group ref={leaf2}>
                <SculptedPothosLeaf scale={0.74} variegationTone="#facc15" />
            </group>
            <group ref={leaf3}>
                <SculptedPothosLeaf scale={0.78} variegationTone="#84cc16" />
            </group>
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Realistic Cascading Golden Pothos in Stoneware Planter
// -------------------------------------------------------------
function WardrobeCascadingPothos() {
    return (
        <group position={[0.34, 1.19, 0.12]}>
            {/* 1. STONEWARE RIBBED POT & TERRACOTTA SAUCER */}
            {/* Base Terracotta Drainage Saucer */}
            <mesh position={[0, 0.012, 0]}>
                <cylinderGeometry args={[0.16, 0.17, 0.024, 24]} />
                <meshStandardMaterial color="#a34726" roughness={0.78} />
            </mesh>
            <mesh position={[0, 0.024, 0]}>
                <cylinderGeometry args={[0.165, 0.165, 0.006, 24]} />
                <meshStandardMaterial color="#8c3b1e" roughness={0.8} />
            </mesh>

            {/* Main Ribbed Stoneware Ceramic Pot Body */}
            <mesh position={[0, 0.105, 0]}>
                <cylinderGeometry args={[0.15, 0.118, 0.18, 24]} />
                <meshStandardMaterial color="#b85430" roughness={0.65} />
            </mesh>

            {/* 4 Raised Stoneware Cream Accent Ribs */}
            {[0.045, 0.085, 0.125, 0.165].map((ry, i) => (
                <mesh key={i} position={[0, ry, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.122 + i * 0.007, 0.005, 8, 24]} />
                    <meshStandardMaterial color="#dfcfbe" roughness={0.82} />
                </mesh>
            ))}

            {/* Rolled Pot Top Rim */}
            <mesh position={[0, 0.192, 0]}>
                <cylinderGeometry args={[0.156, 0.148, 0.024, 24]} />
                <meshStandardMaterial color="#a64a27" roughness={0.7} />
            </mesh>

            {/* Rich Dark Organic Potting Soil */}
            <mesh position={[0, 0.18, 0]}>
                <cylinderGeometry args={[0.142, 0.142, 0.02, 20]} />
                <meshStandardMaterial color="#1a120c" roughness={0.95} />
            </mesh>

            {/* 2. CROWN CANOPY: DENSE VARIEGATED HEART LEAF CANOPY AT RIM */}
            {[
                { angle: 0.1, r: 0.13, y: 0.22, rot: [0.3, 0.1, -0.4], scale: 0.95, varTone: '#a3e635' },
                { angle: 0.6, r: 0.14, y: 0.23, rot: [0.2, 0.5, -0.3], scale: 1.0, varTone: '#facc15' },
                { angle: 1.2, r: 0.13, y: 0.24, rot: [-0.1, 1.1, -0.35], scale: 0.9, varTone: '#84cc16' },
                { angle: 1.8, r: 0.14, y: 0.22, rot: [-0.3, 1.7, -0.2], scale: 1.05, varTone: '#fde047' },
                { angle: 2.4, r: 0.13, y: 0.23, rot: [-0.35, 2.3, 0.1], scale: 0.92, varTone: '#a3e635' },
                { angle: 3.0, r: 0.14, y: 0.24, rot: [-0.2, 2.9, 0.3], scale: 1.0, varTone: '#84cc16' },
                { angle: 3.6, r: 0.13, y: 0.22, rot: [0.1, 3.5, 0.35], scale: 0.88, varTone: '#facc15' },
                { angle: 4.3, r: 0.14, y: 0.23, rot: [0.3, 4.2, 0.25], scale: 0.95, varTone: '#a3e635' },
                { angle: 5.0, r: 0.13, y: 0.24, rot: [0.35, 4.9, -0.1], scale: 1.02, varTone: '#fde047' },
                { angle: 5.7, r: 0.14, y: 0.22, rot: [0.25, 5.6, -0.3], scale: 0.92, varTone: '#84cc16' },
                // Center Upright Canopy Sprouts
                { angle: 0.8, r: 0.06, y: 0.27, rot: [0.15, 0.7, -0.15], scale: 0.8, varTone: '#bef264' },
                { angle: 2.6, r: 0.05, y: 0.28, rot: [-0.1, 2.5, 0.1], scale: 0.85, varTone: '#bef264' },
                { angle: 4.4, r: 0.06, y: 0.27, rot: [0.1, 4.3, 0.15], scale: 0.82, varTone: '#facc15' },
            ].map((leaf, li) => (
                <group
                    key={`canopy-${li}`}
                    position={[Math.cos(leaf.angle) * leaf.r, leaf.y, Math.sin(leaf.angle) * leaf.r]}
                    rotation={leaf.rot as [number, number, number]}
                >
                    <SculptedPothosLeaf scale={leaf.scale} variegationTone={leaf.varTone} />
                </group>
            ))}

            {/* 3. MULTI-TIERED CASCADING VINES (7 VINES DRAPING DOWN WARDROBE) */}

            {/* VINE 1: PRIMARY LONG FRONT-CORNER DRAPE (Length 0.96m, draping down front door) */}
            <group position={[0.07, 0.14, 0.15]}>
                {/* Smooth segmented vine stem curving naturally */}
                <mesh position={[0, -0.48, 0.04]} rotation={[0.05, 0, -0.04]}>
                    <cylinderGeometry args={[0.005, 0.008, 0.96, 6]} />
                    <meshStandardMaterial color="#2d4a12" roughness={0.7} />
                </mesh>
                {/* Alternating variegated heart leaves down Vine 1 */}
                {[
                    { y: -0.10, x: 0.03, z: 0.03, rot: [0.4, 0.2, -0.2], scale: 0.95, varTone: '#facc15' },
                    { y: -0.22, x: -0.03, z: 0.04, rot: [0.3, -0.3, 0.3], scale: 0.92, varTone: '#a3e635' },
                    { y: -0.36, x: 0.04, z: 0.05, rot: [0.45, 0.35, -0.15], scale: 0.88, varTone: '#fde047' },
                    { y: -0.50, x: -0.03, z: 0.06, rot: [0.35, -0.25, 0.25], scale: 0.84, varTone: '#84cc16' },
                    { y: -0.64, x: 0.03, z: 0.07, rot: [0.4, 0.3, -0.2], scale: 0.80, varTone: '#facc15' },
                    { y: -0.78, x: -0.02, z: 0.07, rot: [0.3, -0.2, 0.15], scale: 0.74, varTone: '#a3e635' },
                    { y: -0.92, x: 0.01, z: 0.08, rot: [0.25, 0.1, -0.1], scale: 0.68, varTone: '#bef264' },
                ].map((node, ni) => (
                    <group key={`v1-${ni}`} position={[node.x, node.y, node.z]} rotation={node.rot as [number, number, number]}>
                        <SculptedPothosLeaf scale={node.scale} variegationTone={node.varTone} />
                    </group>
                ))}
            </group>

            {/* VINE 2: MEDIUM FRONT-LEFT DRAPE (Length 0.68m) */}
            <group position={[-0.08, 0.13, 0.14]}>
                <mesh position={[-0.01, -0.34, 0.03]} rotation={[0.04, 0, 0.05]}>
                    <cylinderGeometry args={[0.004, 0.007, 0.68, 6]} />
                    <meshStandardMaterial color="#2d4a12" roughness={0.7} />
                </mesh>
                {[
                    { y: -0.12, x: -0.02, z: 0.02, rot: [0.35, -0.3, 0.2], scale: 0.90, varTone: '#a3e635' },
                    { y: -0.25, x: 0.03, z: 0.03, rot: [0.4, 0.25, -0.2], scale: 0.85, varTone: '#facc15' },
                    { y: -0.39, x: -0.03, z: 0.04, rot: [0.3, -0.35, 0.25], scale: 0.80, varTone: '#84cc16' },
                    { y: -0.53, x: 0.02, z: 0.04, rot: [0.4, 0.2, -0.15], scale: 0.75, varTone: '#fde047' },
                    { y: -0.65, x: -0.01, z: 0.05, rot: [0.25, -0.15, 0.1], scale: 0.66, varTone: '#bef264' },
                ].map((node, ni) => (
                    <group key={`v2-${ni}`} position={[node.x, node.y, node.z]} rotation={node.rot as [number, number, number]}>
                        <SculptedPothosLeaf scale={node.scale} variegationTone={node.varTone} />
                    </group>
                ))}
            </group>

            {/* VINE 3: OUTER RIGHT-CORNER DRAPE (Length 0.82m, hugging the side edge) */}
            <group position={[0.15, 0.14, 0.05]}>
                <mesh position={[0.04, -0.41, 0.01]} rotation={[0.02, 0, -0.06]}>
                    <cylinderGeometry args={[0.005, 0.007, 0.82, 6]} />
                    <meshStandardMaterial color="#2d4a12" roughness={0.7} />
                </mesh>
                {[
                    { y: -0.09, x: 0.03, z: 0.02, rot: [0.2, 0.4, -0.3], scale: 0.92, varTone: '#84cc16' },
                    { y: -0.21, x: 0.04, z: -0.02, rot: [-0.2, 0.5, -0.3], scale: 0.88, varTone: '#facc15' },
                    { y: -0.35, x: 0.05, z: 0.02, rot: [0.25, 0.35, -0.35], scale: 0.84, varTone: '#a3e635' },
                    { y: -0.49, x: 0.05, z: -0.02, rot: [-0.15, 0.45, -0.25], scale: 0.80, varTone: '#fde047' },
                    { y: -0.63, x: 0.06, z: 0.01, rot: [0.2, 0.3, -0.2], scale: 0.74, varTone: '#84cc16' },
                    { y: -0.77, x: 0.05, z: 0.01, rot: [0.15, 0.2, -0.15], scale: 0.65, varTone: '#bef264' },
                ].map((node, ni) => (
                    <group key={`v3-${ni}`} position={[node.x, node.y, node.z]} rotation={node.rot as [number, number, number]}>
                        <SculptedPothosLeaf scale={node.scale} variegationTone={node.varTone} />
                    </group>
                ))}
            </group>

            {/* VINE 4: OUTER SIDE PANEL DRAPE (Length 0.54m) */}
            <group position={[0.13, 0.13, -0.07]}>
                <mesh position={[0.03, -0.27, 0]} rotation={[0, 0, -0.05]}>
                    <cylinderGeometry args={[0.004, 0.006, 0.54, 6]} />
                    <meshStandardMaterial color="#2d4a12" roughness={0.7} />
                </mesh>
                {[
                    { y: -0.11, x: 0.03, z: 0.01, rot: [0.1, 0.6, -0.3], scale: 0.86, varTone: '#a3e635' },
                    { y: -0.24, x: 0.04, z: -0.01, rot: [-0.1, 0.7, -0.35], scale: 0.82, varTone: '#facc15' },
                    { y: -0.38, x: 0.04, z: 0.01, rot: [0.15, 0.5, -0.25], scale: 0.76, varTone: '#84cc16' },
                    { y: -0.50, x: 0.03, z: 0, rot: [0.1, 0.4, -0.2], scale: 0.68, varTone: '#bef264' },
                ].map((node, ni) => (
                    <group key={`v4-${ni}`} position={[node.x, node.y, node.z]} rotation={node.rot as [number, number, number]}>
                        <SculptedPothosLeaf scale={node.scale} variegationTone={node.varTone} />
                    </group>
                ))}
            </group>

            {/* VINE 5: REAR CORNER DRAPE (Length 0.42m) */}
            <group position={[-0.04, 0.12, -0.13]}>
                <mesh position={[0, -0.21, -0.02]} rotation={[-0.04, 0, 0]}>
                    <cylinderGeometry args={[0.004, 0.006, 0.42, 6]} />
                    <meshStandardMaterial color="#2d4a12" roughness={0.7} />
                </mesh>
                {[
                    { y: -0.10, x: -0.02, z: -0.02, rot: [-0.3, 1.8, -0.2], scale: 0.82, varTone: '#facc15' },
                    { y: -0.24, x: 0.02, z: -0.02, rot: [-0.25, 2.2, -0.25], scale: 0.76, varTone: '#84cc16' },
                    { y: -0.38, x: 0, z: -0.02, rot: [-0.2, 2.0, -0.15], scale: 0.66, varTone: '#bef264' },
                ].map((node, ni) => (
                    <group key={`v5-${ni}`} position={[node.x, node.y, node.z]} rotation={node.rot as [number, number, number]}>
                        <SculptedPothosLeaf scale={node.scale} variegationTone={node.varTone} />
                    </group>
                ))}
            </group>

            {/* VINE 6: SHORT TENDER FRONT SPROUT (Length 0.30m) */}
            <group position={[0.01, 0.14, 0.15]}>
                <mesh position={[0, -0.15, 0.02]} rotation={[0.08, 0, 0.02]}>
                    <cylinderGeometry args={[0.0035, 0.005, 0.30, 6]} />
                    <meshStandardMaterial color="#365314" roughness={0.65} />
                </mesh>
                {[
                    { y: -0.11, x: 0.02, z: 0.02, rot: [0.45, 0.2, -0.1], scale: 0.80, varTone: '#bef264' },
                    { y: -0.24, x: -0.01, z: 0.03, rot: [0.4, -0.2, 0.15], scale: 0.70, varTone: '#bef264' },
                ].map((node, ni) => (
                    <group key={`v6-${ni}`} position={[node.x, node.y, node.z]} rotation={node.rot as [number, number, number]}>
                        <SculptedPothosLeaf scale={node.scale} variegationTone={node.varTone} />
                    </group>
                ))}
            </group>

            {/* VINE 7: CURLING CENTRAL TENDRIL (Length 0.22m) */}
            <group position={[-0.04, 0.15, 0.14]}>
                <mesh position={[0, -0.11, 0.02]} rotation={[0.1, 0, -0.08]}>
                    <cylinderGeometry args={[0.003, 0.0045, 0.22, 6]} />
                    <meshStandardMaterial color="#365314" roughness={0.65} />
                </mesh>
                {[
                    { y: -0.08, x: -0.02, z: 0.02, rot: [0.4, -0.15, 0.1], scale: 0.75, varTone: '#a3e635' },
                    { y: -0.18, x: 0.01, z: 0.02, rot: [0.35, 0.1, -0.1], scale: 0.65, varTone: '#bef264' },
                ].map((node, ni) => (
                    <group key={`v7-${ni}`} position={[node.x, node.y, node.z]} rotation={node.rot as [number, number, number]}>
                        <SculptedPothosLeaf scale={node.scale} variegationTone={node.varTone} />
                    </group>
                ))}
            </group>

            {/* 4. FALLING LEAVES MICRO-ANIMATION LOOP */}
            <FallingPothosLeaves />
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Realistic Zen Juniper Bonsai on Window Sill
// -------------------------------------------------------------
function RealisticZenBonsai() {
    return (
        <group position={[-1.2, 0.05, 0.26]}>
            {/* Low Japanese Ceramic Bonsai Tray */}
            <mesh position={[0, 0.03, 0]}>
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
                <mesh position={[0, 0.05, 0]} rotation={[0.1, 0, 0.25]}>
                    <cylinderGeometry args={[0.024, 0.038, 0.12, 10]} />
                    <meshStandardMaterial color="#3d2817" roughness={0.88} />
                </mesh>
                {/* Mid Trunk Curving Left */}
                <mesh position={[-0.03, 0.14, 0.01]} rotation={[-0.15, 0, -0.35]}>
                    <cylinderGeometry args={[0.018, 0.024, 0.12, 10]} />
                    <meshStandardMaterial color="#3d2817" roughness={0.88} />
                </mesh>
                {/* Upper Crown Bough */}
                <mesh position={[-0.06, 0.23, 0]} rotation={[0.1, 0, 0.2]}>
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
                    <mesh position={[0, 0, 0]}>
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
                    <mesh position={[0, 0, 0]}>
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
                    <mesh position={[0, 0, 0]}>
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
        <group position={[1.2, 0.05, 0.26]}>
            {/* Pot 1: Matte White Ceramic Fluted Planter */}
            <group position={[-0.12, 0, 0]}>
                <mesh position={[0, 0.05, 0]}>
                    <cylinderGeometry args={[0.07, 0.05, 0.10, 16]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.25} />
                </mesh>
                {/* Echeveria Succulent Rosette Petals */}
                <group position={[0, 0.11, 0]}>
                    {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                        const rad = (deg * Math.PI) / 180;
                        return (
                            <mesh key={i} position={[Math.cos(rad) * 0.035, 0, Math.sin(rad) * 0.035]} rotation={[0.4 * Math.sin(rad), rad, 0.4 * Math.cos(rad)]}>
                                <boxGeometry args={[0.035, 0.012, 0.055]} />
                                <meshStandardMaterial color="#2d6a4f" roughness={0.5} />
                            </mesh>
                        );
                    })}
                    {/* Center Rosette Crown */}
                    <mesh position={[0, 0.02, 0]}>
                        <sphereGeometry args={[0.035, 8, 8]} />
                        <meshStandardMaterial color="#52b788" roughness={0.5} />
                    </mesh>
                </group>
            </group>

            {/* Pot 2: Warm Terracotta Cylindrical Planter */}
            <group position={[0.12, 0, 0]}>
                <mesh position={[0, 0.045, 0]}>
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
                        <mesh key={idx} position={leaf.pos as [number, number, number]}>
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
            <mesh position={[0, 0, 0]}>
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
            <mesh position={[0, 0.06, 0]}>
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


