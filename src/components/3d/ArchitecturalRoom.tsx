'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

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

            {/* CROWN TOP: TRAILING POTHOS PLANT CASCADING DOWN SIDE */}
            <group position={[0.32, 1.28, 0.08]}>
                {/* Fluted Ceramic Pot */}
                <mesh position={[0, 0.08, 0]}>
                    <cylinderGeometry args={[0.13, 0.10, 0.16, 16]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.3} />
                </mesh>
                {/* Pot Soil */}
                <mesh position={[0, 0.15, 0]}>
                    <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
                    <meshStandardMaterial color="#271c15" roughness={0.9} />
                </mesh>
                {/* Bushy Foliage Dome */}
                <mesh position={[0, 0.22, 0]}>
                    <sphereGeometry args={[0.16, 10, 10]} />
                    <meshStandardMaterial color="#10b981" roughness={0.6} />
                </mesh>
                {/* Trailing Green Pothos Vines */}
                <mesh position={[0.06, -0.32, 0.18]}>
                    <cylinderGeometry args={[0.01, 0.015, 0.85, 6]} />
                    <meshStandardMaterial color="#059669" roughness={0.7} />
                </mesh>
                {[-0.1, -0.25, -0.42, -0.6, -0.76].map((vy, vi) => (
                    <mesh key={vi} position={[0.07 + (vi % 2 === 0 ? 0.04 : -0.03), vy, 0.2]} rotation={[0.2, 0.3, 0.4]}>
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


