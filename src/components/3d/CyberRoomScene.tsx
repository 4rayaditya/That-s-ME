
'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, AdaptiveDpr, AdaptiveEvents, Html } from '@react-three/drei';
import CyberCharacter, { CharacterRoutine } from './CyberCharacter';
import CameraController, { CameraMode } from './CameraController';
import { MonitorTextures } from './MonitorTextures';
import { EnvironmentPhase, ENVIRONMENT_CONFIGS } from '@/lib/environment';
import FloatingPoiMarkers from './FloatingPoiMarkers';
import ArchitecturalRoom from './ArchitecturalRoom';
import { audio } from '@/lib/audio';
import { useIsMobile } from '@/lib/useIsMobile';

interface CyberRoomSceneProps {
    cameraMode: CameraMode;
    onDollyComplete: () => void;
    onReturnComplete: () => void;
    onTourPoiChange?: (poiName: string, index: number, total: number) => void;
    onTourComplete?: () => void;
    onTourProgress?: (progress: number) => void;
    forcedTourIndex?: number | null;
    currentRoutine: CharacterRoutine;
    onRoutineChange: (routine: CharacterRoutine, label: string) => void;
    environmentPhase: EnvironmentPhase;
    onJackIn: () => void;
    onSelectSetup?: () => void;
    isMenuOpen?: boolean;
}

// -------------------------------------------------------------
// SUB-COMPONENT: Dual Monitor Setup (Compact Main + Vertical Curved)
// -------------------------------------------------------------
const BattlestationMonitors = React.memo(function BattlestationMonitors({ monitorTextures }: { monitorTextures: MonitorTextures }) {
    return (
        <group position={[0, 1.45, -3.20]}>
            {/* ============================================================ */}
            {/* DEDICATED VISIBLE DESKTOP STANDS FOR BOTH MONITORS           */}
            {/* ============================================================ */}

            {/* STAND 1: MAIN HORIZONTAL MONITOR STAND (x = 0.28) */}
            <group position={[0.28, 0, 0]}>
                {/* Heavy CNC Machined Aluminum Desktop Base (resting flat on oak table at y = -0.69) */}
                <mesh receiveShadow position={[0, -0.685, 0.06]}>
                    <boxGeometry args={[0.32, 0.018, 0.24]} />
                    <meshStandardMaterial color="#090e18" metalness={0.92} roughness={0.18} />
                </mesh>
                {/* Beveled Chamfer Trim on Stand Base */}
                <mesh position={[0, -0.674, 0.06]}>
                    <boxGeometry args={[0.30, 0.005, 0.22]} />
                    <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.15} />
                </mesh>
                {/* Solid Vertical Riser Column (from desk to monitor VESA mount) */}
                <mesh position={[0, -0.34, -0.04]}>
                    <boxGeometry args={[0.075, 0.68, 0.055]} />
                    <meshStandardMaterial color="#0c121e" metalness={0.9} roughness={0.2} />
                </mesh>
                {/* Vertical Accent Rib / Cable Routing Channel */}
                <mesh position={[0, -0.34, -0.012]}>
                    <boxGeometry args={[0.035, 0.62, 0.006]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.15} />
                </mesh>
                {/* Articulated VESA Mount Bracket & Tilt Knuckle */}
                <mesh position={[0, 0, -0.04]}>
                    <boxGeometry args={[0.16, 0.16, 0.035]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0, -0.02]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.022, 0.022, 0.08, 16]} />
                    <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.1} />
                </mesh>
            </group>

            {/* STAND 2: SECOND VERTICAL MONITOR STAND (x = -0.56, angled 0.22 rad) */}
            <group position={[-0.56, 0, 0.04]} rotation={[0, 0.22, 0]}>
                {/* Heavy Aluminum Desktop Base (resting flat on oak table at y = -0.69) */}
                <mesh receiveShadow position={[0, -0.685, 0.06]}>
                    <boxGeometry args={[0.26, 0.018, 0.22]} />
                    <meshStandardMaterial color="#090e18" metalness={0.92} roughness={0.18} />
                </mesh>
                {/* Beveled Chamfer Trim on Stand Base */}
                <mesh position={[0, -0.674, 0.06]}>
                    <boxGeometry args={[0.24, 0.005, 0.20]} />
                    <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.15} />
                </mesh>
                {/* Solid Vertical Riser Column (from desk to vertical monitor VESA mount) */}
                <mesh position={[0, -0.32, -0.04]}>
                    <boxGeometry args={[0.065, 0.72, 0.055]} />
                    <meshStandardMaterial color="#0c121e" metalness={0.9} roughness={0.2} />
                </mesh>
                {/* Vertical Accent Rib */}
                <mesh position={[0, -0.32, -0.012]}>
                    <boxGeometry args={[0.028, 0.64, 0.006]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.15} />
                </mesh>
                {/* Articulated VESA Mount Bracket & Tilt Knuckle */}
                <mesh position={[0, 0.04, -0.04]}>
                    <boxGeometry args={[0.14, 0.14, 0.035]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0.04, -0.02]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.07, 16]} />
                    <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.1} />
                </mesh>
            </group>

            {/* "BEHIND SETUP" RED BIAS LIGHT: contrasting sharply against the black slat wall */}
            <pointLight color="#ff1744" intensity={3.5} distance={2.5} decay={2} position={[0, 0.04, -0.12]} />

            {/* Physical Red LED Backlight Strips on the rear of monitors */}
            <mesh position={[0.28, 0.02, -0.04]}>
                <boxGeometry args={[0.95, 0.018, 0.01]} />
                <meshBasicMaterial color="#ff1744" toneMapped={false} />
            </mesh>
            <mesh position={[-0.56, 0.04, 0.0]} rotation={[0, 0.22, 0]}>
                <boxGeometry args={[0.015, 0.65, 0.01]} />
                <meshBasicMaterial color="#ff1744" toneMapped={false} />
            </mesh>

            {/* 1. MAIN HORIZONTAL MONITOR (Positioned at x = 0.28, separated by clean black border) */}
            <group position={[0.28, 0, 0]}>
                {/* Outer Beveled Chassis (1.14 x 0.62) */}
                <mesh>
                    <boxGeometry args={[1.14, 0.62, 0.055]} />
                    <meshStandardMaterial color="#050810" metalness={0.92} roughness={0.25} />
                </mesh>

                {/* Webcam on Top */}
                <group position={[0, 0.325, 0.01]}>
                    <mesh>
                        <boxGeometry args={[0.14, 0.025, 0.04]} />
                        <meshStandardMaterial color="#03060d" metalness={0.9} roughness={0.2} />
                    </mesh>
                    <mesh position={[0, 0, 0.022]}>
                        <sphereGeometry args={[0.007, 12, 12]} />
                        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
                    </mesh>
                    {/* Micro red recording indicator dot */}
                    <mesh position={[0.04, 0, 0.022]}>
                        <sphereGeometry args={[0.003, 8, 8]} />
                        <meshBasicMaterial color="#ef4444" toneMapped={false} />
                    </mesh>
                </group>

                {/* Outer Matte Black Border Frame */}
                <mesh position={[0, 0, 0.029]}>
                    <boxGeometry args={[1.12, 0.60, 0.006]} />
                    <meshStandardMaterial color="#03050a" roughness={0.9} metalness={0.1} />
                </mesh>

                {/* Inner Black Bezel Inset */}
                <mesh position={[0, 0, 0.031]}>
                    <boxGeometry args={[1.08, 0.56, 0.002]} />
                    <meshStandardMaterial color="#070a12" roughness={0.7} metalness={0.3} />
                </mesh>

                {/* Active Screen Surface: Chrome Offline Dragon Game */}
                <mesh position={[0, 0, 0.033]}>
                    <planeGeometry args={[1.06, 0.54]} />
                    <meshBasicMaterial map={monitorTextures.centerTexture} toneMapped={false} />
                </mesh>
            </group>

            {/* 2. SECOND CURVED MONITOR VERTICALLY (Positioned at x = -0.56, angled 0.22 rad, crisp black border, zero overlap) */}
            <group position={[-0.56, 0.04, 0.04]} rotation={[0, 0.22, 0]}>
                {/* Outer Vertical Chassis (Portrait: 0.42 width x 0.78 height) */}
                <mesh>
                    <boxGeometry args={[0.42, 0.78, 0.055]} />
                    <meshStandardMaterial color="#050810" metalness={0.92} roughness={0.25} />
                </mesh>

                {/* Outer Matte Black Border Frame */}
                <mesh position={[0, 0, 0.029]}>
                    <boxGeometry args={[0.40, 0.76, 0.006]} />
                    <meshStandardMaterial color="#03050a" roughness={0.9} metalness={0.1} />
                </mesh>

                {/* Inner Black Bezel Inset */}
                <mesh position={[0, 0, 0.031]}>
                    <boxGeometry args={[0.38, 0.74, 0.002]} />
                    <meshStandardMaterial color="#070a12" roughness={0.7} metalness={0.3} />
                </mesh>

                {/* Active Screen Surface: Live TypeScript Matrix IDE & Telemetry Screen */}
                <mesh position={[0, 0, 0.033]}>
                    <planeGeometry args={[0.36, 0.72]} />
                    <meshBasicMaterial map={monitorTextures.leftTexture} toneMapped={false} />
                </mesh>
            </group>
        </group>
    );
});

// -------------------------------------------------------------
// SUB-COMPONENT: Custom High-End Gaming / Workstation PC Cabinet
// -------------------------------------------------------------
const CpuCabinet = React.memo(function CpuCabinet() {
    return (
        <group position={[1.05, 0.02, -2.75]} rotation={[0, -0.22, 0]} scale={[1.20, 1.20, 1.20]}>
            {/* 1. CHASSIS CASE (Dark Anodized Aluminum Mid-Tower Frame) */}
            <mesh position={[0, 0.25, 0]}>
                <boxGeometry args={[0.22, 0.50, 0.46]} />
                <meshStandardMaterial color="#0c101d" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* 4 Bottom Rubber Isolation Feet */}
            {[-0.08, 0.08].map((fx, i) =>
                [-0.18, 0.18].map((fz, j) => (
                    <mesh key={`${i}-${j}`} position={[fx, 0.008, fz]}>
                        <cylinderGeometry args={[0.016, 0.016, 0.016, 12]} />
                        <meshStandardMaterial color="#020408" roughness={0.8} />
                    </mesh>
                ))
            )}

            {/* Bottom PSU Basement Shroud */}
            <mesh position={[0, 0.065, 0]}>
                <boxGeometry args={[0.218, 0.11, 0.456]} />
                <meshStandardMaterial color="#080c16" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* PSU Shroud Glowing Badge */}
            <mesh position={[-0.111, 0.065, 0.05]}>
                <boxGeometry args={[0.002, 0.02, 0.12]} />
                <meshBasicMaterial color="#f59e0b" toneMapped={false} />
            </mesh>

            {/* 2. SHOWCASE TEMPERED GLASS SIDE PANEL (Facing center towards user) */}
            <mesh position={[-0.111, 0.28, 0]}>
                <boxGeometry args={[0.004, 0.38, 0.44]} />
                <meshPhysicalMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.22}
                    roughness={0.06}
                    metalness={0.1}
                    transmission={0.7}
                />
            </mesh>
            {/* Tempered Glass Tinted Border Frame */}
            <mesh position={[-0.111, 0.28, 0]}>
                <boxGeometry args={[0.005, 0.40, 0.45]} />
                <meshStandardMaterial color="#090e18" roughness={0.4} />
            </mesh>

            {/* 3. MOTHERBOARD & INTERNAL HARDWARE */}
            {/* ATX Motherboard PCB */}
            <mesh position={[0.09, 0.28, 0]}>
                <boxGeometry args={[0.01, 0.34, 0.30]} />
                <meshStandardMaterial color="#070a12" roughness={0.8} />
            </mesh>
            {/* Massive Aluminum VRM Heatsinks */}
            <mesh position={[0.075, 0.40, -0.06]}>
                <boxGeometry args={[0.02, 0.05, 0.14]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0.075, 0.35, -0.12]}>
                <boxGeometry args={[0.02, 0.12, 0.04]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* 4x DDR5 RGB High-Performance RAM Sticks */}
            {[-0.03, -0.015, 0.0, 0.015].map((rz, i) => (
                <group key={i} position={[0.07, 0.36, rz]}>
                    <mesh>
                        <boxGeometry args={[0.012, 0.06, 0.008]} />
                        <meshStandardMaterial color="#0f172a" metalness={0.8} />
                    </mesh>
                    {/* Glowing Top RGB Diffuser Strip */}
                    <mesh position={[-0.006, 0.028, 0]}>
                        <boxGeometry args={[0.004, 0.008, 0.008]} />
                        <meshBasicMaterial color={i % 2 === 0 ? '#00f5d4' : '#38bdf8'} toneMapped={false} />
                    </mesh>
                </group>
            ))}

            {/* 4. AIO LIQUID CPU COOLER PUMP BLOCK & RADIATOR TUBING */}
            <group position={[0.065, 0.32, -0.06]}>
                {/* Circular Pump Block */}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.038, 0.038, 0.028, 20]} />
                    <meshStandardMaterial color="#090e18" metalness={0.9} roughness={0.2} />
                </mesh>
                {/* Infinity Mirror Glowing Ring */}
                <mesh position={[-0.015, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <ringGeometry args={[0.024, 0.034, 20]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} side={THREE.DoubleSide} />
                </mesh>
                {/* LCD Temp Display Center (38Â°C) */}
                <mesh position={[-0.015, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <circleGeometry args={[0.02, 20]} />
                    <meshBasicMaterial color="#042f2e" toneMapped={false} side={THREE.DoubleSide} />
                </mesh>
                {/* Dual Braided Black Coolant Hoses */}
                <mesh position={[0, 0.08, 0.04]} rotation={[0.4, 0, 0.2]}>
                    <cylinderGeometry args={[0.007, 0.007, 0.16, 12]} />
                    <meshStandardMaterial color="#111827" roughness={0.7} />
                </mesh>
                <mesh position={[0, 0.08, 0.01]} rotation={[0.4, 0, 0.2]}>
                    <cylinderGeometry args={[0.007, 0.007, 0.16, 12]} />
                    <meshStandardMaterial color="#111827" roughness={0.7} />
                </mesh>
            </group>

            {/* Top 360mm Liquid Cooling Radiator with Exhaust Fans */}
            <group position={[0, 0.47, 0]}>
                <mesh>
                    <boxGeometry args={[0.18, 0.028, 0.38]} />
                    <meshStandardMaterial color="#111827" metalness={0.7} roughness={0.4} />
                </mesh>
                {[-0.11, 0, 0.11].map((fz, i) => (
                    <mesh key={i} position={[0, -0.018, fz]}>
                        <cylinderGeometry args={[0.048, 0.048, 0.015, 16]} />
                        <meshStandardMaterial color="#0f172a" roughness={0.6} />
                    </mesh>
                ))}
            </group>

            {/* 5. THE BEAST: HIGH-END GRAPHICS CARD (GPU - RTX 4090 / 5090) */}
            <group position={[0.01, 0.20, 0.02]}>
                {/* 3.5-Slot Thick GPU Shroud & Aluminum Heatsink Fins */}
                <mesh>
                    <boxGeometry args={[0.085, 0.11, 0.32]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.88} roughness={0.25} />
                </mesh>
                {/* Brushed Titanium GPU Backplate with Flow-Through Cutouts */}
                <mesh position={[0.043, 0.056, 0]}>
                    <boxGeometry args={[0.003, 0.006, 0.31]} />
                    <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.15} />
                </mesh>
                {/* Triple Cooling Fans on Underbelly Face */}
                {[-0.09, 0, 0.09].map((fz, i) => (
                    <group key={i} position={[-0.043, 0, fz]}>
                        <mesh rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.042, 0.042, 0.004, 16]} />
                            <meshStandardMaterial color="#020617" roughness={0.7} />
                        </mesh>
                        {/* Center Chrome Fan Hub Badge */}
                        <mesh position={[-0.003, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.014, 0.014, 0.003, 16]} />
                            <meshStandardMaterial color="#cbd5e1" metalness={0.98} roughness={0.1} />
                        </mesh>
                    </group>
                ))}
                {/* Side Illuminated GPU Logo ("GEFORCE RTX") */}
                <mesh position={[-0.044, 0.035, -0.02]}>
                    <boxGeometry args={[0.002, 0.018, 0.15]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                </mesh>
                {/* Custom Individual 12VHPWR Sleeved Power Cables with Combs */}
                <group position={[-0.02, -0.04, 0.06]}>
                    {[-0.015, -0.005, 0.005, 0.015].map((cx, i) => (
                        <mesh key={i} position={[cx, -0.03, 0]} rotation={[0.2, 0, 0]}>
                            <cylinderGeometry args={[0.0035, 0.0035, 0.06, 8]} />
                            <meshStandardMaterial color={i % 2 === 0 ? '#1e293b' : '#d97706'} roughness={0.6} />
                        </mesh>
                    ))}
                    {/* Billet Aluminum Cable Comb */}
                    <mesh position={[0, -0.025, 0]}>
                        <boxGeometry args={[0.038, 0.006, 0.008]} />
                        <meshStandardMaterial color="#090e18" metalness={0.95} />
                    </mesh>
                </group>
                {/* Acrylic Anti-Sag Support Bracket */}
                <mesh position={[-0.04, -0.08, 0.12]}>
                    <cylinderGeometry args={[0.006, 0.006, 0.08, 8]} />
                    <meshStandardMaterial color="#38bdf8" transparent opacity={0.6} roughness={0.1} />
                </mesh>
            </group>

            {/* 6. FRONT 3x 120mm ARGB INTAKE FANS WITH HALO GLOW RINGS */}
            <group position={[0, 0.28, 0.232]}>
                {[-0.12, 0, 0.12].map((fy, i) => (
                    <group key={i} position={[0, fy, 0]}>
                        <mesh rotation={[Math.PI / 2, 0, 0]}>
                            <torusGeometry args={[0.045, 0.006, 8, 24]} />
                            <meshBasicMaterial color={i === 1 ? '#f59e0b' : '#00f5d4'} toneMapped={false} />
                        </mesh>
                        <mesh rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.038, 0.038, 0.006, 16]} />
                            <meshStandardMaterial color="#090e18" roughness={0.7} />
                        </mesh>
                    </group>
                ))}
            </group>

            {/* Top Power Button & Front I/O Ports */}
            <group position={[0.05, 0.501, 0.18]}>
                <mesh>
                    <cylinderGeometry args={[0.007, 0.007, 0.004, 12]} />
                    <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
                </mesh>
                {/* Illuminated Power LED Ring */}
                <mesh position={[0, 0.002, 0]}>
                    <ringGeometry args={[0.007, 0.010, 16]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} side={THREE.DoubleSide} />
                </mesh>
            </group>

            {/* Internal RGB lighting was here (2 point lights lighting the components through
                the glass) â€” removed as part of the room's lighting budget cut. The RAM strips,
                GPU logo and fan rings are all already emissive `meshBasicMaterial`, so they
                still read as glowing without casting extra light onto the room. */}
        </group>
    );
});

// -------------------------------------------------------------
// SUB-COMPONENT: Battlestation Desk, Mat, Keyboard, Cables, Lamp
// -------------------------------------------------------------
const BattlestationDesk = React.memo(function BattlestationDesk() {
    const rgbUnderglowRef = useRef<THREE.PointLight>(null);
    useFrame((state) => {
        if (rgbUnderglowRef.current) {
            const hue = (state.clock.elapsedTime * 0.08) % 1;
            rgbUnderglowRef.current.color.setHSL(hue, 0.95, 0.52);
        }
    });

    return (
        <group position={[0, 0, -2.95]}>
            {/* Desktop Surface - Aesthetic Solid Warm Oak / Live-Edge Walnut */}
            <mesh receiveShadow position={[0, 0.72, 0]}>
                <boxGeometry args={[3.2, 0.065, 1.25]} />
                <meshStandardMaterial color="#7c5335" roughness={0.45} metalness={0.06} />
            </mesh>

            {/* Desk Edge Chamfer / Warm Amber Accent */}
            <mesh position={[0, 0.69, 0.627]}>
                <boxGeometry args={[3.2, 0.015, 0.01]} />
                <meshBasicMaterial color="#d97706" toneMapped={false} />
            </mesh>

            {/* RGB LIGHT FIXTURES & DYNAMIC UNDERGLOW BELOW TABLE */}
            <mesh position={[0, 0.68, 0.45]}>
                <boxGeometry args={[2.9, 0.012, 0.02]} />
                <meshBasicMaterial color="#a855f7" toneMapped={false} />
            </mesh>
            <mesh position={[0, 0.68, -0.45]}>
                <boxGeometry args={[2.9, 0.012, 0.02]} />
                <meshBasicMaterial color="#06b6d4" toneMapped={false} />
            </mesh>
            {/* Dynamic RGB point light below table illuminating the floor, under-desk CPU cabinet & chair base */}
            <pointLight
                ref={rgbUnderglowRef}
                color="#a855f7"
                intensity={3.4}
                distance={3.4}
                decay={2}
                position={[0, 0.38, 0.0]}
            />

            {/* Solid Oak & Warm Bronze Trestle Legs */}
            <mesh position={[-1.48, 0.36, 0]}>
                <boxGeometry args={[0.08, 0.72, 1.05]} />
                <meshStandardMaterial color="#4a3220" roughness={0.5} />
            </mesh>
            <mesh position={[1.48, 0.36, 0]}>
                <boxGeometry args={[0.08, 0.72, 1.05]} />
                <meshStandardMaterial color="#4a3220" roughness={0.5} />
            </mesh>

            {/* Cable Management Tray Under Desk with Warm Status Glow */}
            <group position={[0, 0.66, -0.3]}>
                <mesh>
                    <boxGeometry args={[2.0, 0.05, 0.2]} />
                    <meshStandardMaterial color="#2c1f15" roughness={0.6} />
                </mesh>
                {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
                    <mesh key={i} position={[x, -0.03, 0]}>
                        <boxGeometry args={[0.05, 0.01, 0.03]} />
                        <meshBasicMaterial color="#f59e0b" toneMapped={false} />
                    </mesh>
                ))}
            </group>

            {/* PREMIUM COGNAC LEATHER / SADDLE TAN DESK BLOTTER */}
            <group position={[0, 0.753, 0.12]}>
                <mesh receiveShadow>
                    <boxGeometry args={[1.9, 0.005, 0.68]} />
                    <meshStandardMaterial color="#8a532a" roughness={0.8} />
                </mesh>
                {/* Natural beige perimeter stitching */}
                <mesh position={[0, 0.003, 0]}>
                    <boxGeometry args={[1.92, 0.002, 0.7]} />
                    <meshBasicMaterial color="#e0c9b0" />
                </mesh>
            </group>

            {/* HIGH-END CNC MECHANICAL KEYBOARD WITH WARM RETRO CAPS */}
            {/* KEYBOARD WITH KEYCAP ROWS */}
            <group position={[0, 0.76, 0.15]} rotation={[0.08, 0, 0]}>
                {/* Dark Walnut & Aluminum Frame */}
                <mesh>
                    <boxGeometry args={[0.56, 0.024, 0.20]} />
                    <meshStandardMaterial color="#3a271a" roughness={0.4} metalness={0.4} />
                </mesh>
                {/* Polished Brass Weight Inset Bar on back */}
                <mesh position={[0, 0.013, -0.08]}>
                    <boxGeometry args={[0.48, 0.003, 0.025]} />
                    <meshStandardMaterial color="#eab308" metalness={0.92} roughness={0.15} />
                </mesh>
                {/* Sculpted Keycap Row Tier 1 (Number Row) */}
                <mesh position={[0, 0.016, -0.055]}>
                    <boxGeometry args={[0.51, 0.012, 0.03]} />
                    <meshStandardMaterial color="#332216" roughness={0.5} />
                </mesh>
                {/* Sculpted Keycap Row Tier 2 & 3 (QWERTY & Home Alphas - Cream) */}
                <mesh position={[0, 0.017, -0.015]}>
                    <boxGeometry args={[0.51, 0.013, 0.045]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.4} />
                </mesh>
                {/* Spacebar & Modifiers Row */}
                <mesh position={[0, 0.015, 0.045]}>
                    <boxGeometry args={[0.51, 0.011, 0.035]} />
                    <meshStandardMaterial color="#332216" roughness={0.5} />
                </mesh>
                {/* Warm Amber Per-Key Underglow */}
                <mesh position={[0, 0.013, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.52, 0.17]} />
                    <meshBasicMaterial color="#f59e0b" toneMapped={false} />
                </mesh>
            </group>

            {/* ERGONOMIC MOUSE ON LEATHER MAT */}
            <group position={[0.48, 0.76, 0.16]}>
                <mesh position={[0, 0.02, 0]} rotation={[0, -0.06, 0]}>
                    <boxGeometry args={[0.075, 0.035, 0.135]} />
                    <meshStandardMaterial color="#2d2218" metalness={0.4} roughness={0.4} />
                </mesh>
                <mesh position={[0, 0.038, -0.025]}>
                    <boxGeometry args={[0.002, 0.005, 0.06]} />
                    <meshStandardMaterial color="#1a140f" roughness={0.9} />
                </mesh>
                <mesh position={[0, 0.037, -0.025]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.009, 0.009, 0.008, 12]} />
                    <meshBasicMaterial color="#f59e0b" toneMapped={false} />
                </mesh>
            </group>

            {/* AESTHETIC DESK ACCESSORIES (MOLESKINE JOURNAL & WOOD TRAY) */}
            <group position={[-1.2, 0.76, 0.2]}>
                <mesh position={[0, 0.01, 0]} rotation={[0, 0.15, 0]}>
                    <boxGeometry args={[0.22, 0.02, 0.3]} />
                    <meshStandardMaterial color="#2d2219" roughness={0.6} />
                </mesh>
                <mesh position={[0, 0.022, 0]} rotation={[0, 0.15, 0]}>
                    <boxGeometry args={[0.21, 0.005, 0.29]} />
                    <meshStandardMaterial color="#faf6ee" roughness={0.8} />
                </mesh>
            </group>

            {/* ARTICULATED DESK LAMP WITH WARM AMBER GLOW */}
            <group position={[-1.25, 0.75, -0.3]}>
                <mesh>
                    <cylinderGeometry args={[0.09, 0.1, 0.03, 16]} />
                    <meshStandardMaterial color="#ffb703" metalness={0.8} roughness={0.3} />
                </mesh>
                <mesh position={[0.1, 0.22, 0.1]} rotation={[0, 0, -0.45]}>
                    <cylinderGeometry args={[0.015, 0.015, 0.45, 8]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh position={[0.22, 0.42, 0.2]} rotation={[0.4, 0, -0.7]}>
                    <coneGeometry args={[0.12, 0.16, 16, 1, true]} />
                    <meshStandardMaterial color="#ffb703" metalness={0.7} roughness={0.3} side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0.22, 0.38, 0.2]}>
                    <sphereGeometry args={[0.04, 16, 16]} />
                    <meshBasicMaterial color="#ffb703" toneMapped={false} />
                </mesh>
                {/* Its point light was removed as part of the room's lighting budget cut â€” the
                    ceiling desk spotlight below (one of the room's 5 accent lights) plus the
                    "behind setup" monitor bias light now cover this corner, and the bulb's
                    emissive material still reads as lit on its own. */}
            </group>

            {/* REALISTIC HERMAN MILLER AERON-STYLE ERGONOMIC CHAIR (Aligned at world z=0.4) */}
            <group position={[0, 0, 1.1]}>
                {/* Five-Star Caster Wheel Base */}
                <group position={[0, 0.05, 0]}>
                    <mesh>
                        <cylinderGeometry args={[0.065, 0.075, 0.05, 16]} />
                        <meshStandardMaterial color="#090d16" metalness={0.9} roughness={0.2} />
                    </mesh>
                    {[0, 1, 2, 3, 4].map((i) => {
                        const angle = (i * Math.PI * 2) / 5;
                        const legLength = 0.32;
                        const lx = Math.sin(angle) * (legLength / 2);
                        const lz = Math.cos(angle) * (legLength / 2);
                        const wx = Math.sin(angle) * legLength;
                        const wz = Math.cos(angle) * legLength;
                        return (
                            <group key={i}>
                                <mesh position={[lx, -0.01, lz]} rotation={[0, angle, 0]}>
                                    <boxGeometry args={[0.04, 0.025, legLength]} />
                                    <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.25} />
                                </mesh>
                                <mesh position={[wx, -0.025, wz]}>
                                    <cylinderGeometry args={[0.024, 0.024, 0.025, 12]} />
                                    <meshStandardMaterial color="#020408" roughness={0.7} />
                                </mesh>
                            </group>
                        );
                    })}
                </group>

                {/* Pneumatic Chrome Lift Column */}
                <mesh position={[0, 0.22, 0]}>
                    <cylinderGeometry args={[0.026, 0.034, 0.3, 16]} />
                    <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.1} />
                </mesh>

                {/* Under-Seat Tilt Mechanism */}
                <mesh position={[0, 0.37, 0]}>
                    <boxGeometry args={[0.26, 0.05, 0.24]} />
                    <meshStandardMaterial color="#090d16" metalness={0.8} roughness={0.3} />
                </mesh>

                {/* Waterfall-Edge Contoured Seat Pan */}
                <group position={[0, 0.42, 0]}>
                    <mesh>
                        <boxGeometry args={[0.5, 0.05, 0.48]} />
                        <meshStandardMaterial color="#0b0f19" roughness={0.6} />
                    </mesh>
                    <mesh position={[0, 0.015, 0]}>
                        <boxGeometry args={[0.44, 0.04, 0.42]} />
                        <meshStandardMaterial color="#1e2433" roughness={0.85} />
                    </mesh>
                </group>

                {/* Contoured High-Back Spine & Lumbar Support (Facing desk towards -Z) */}
                <group position={[0, 0.70, 0.22]}>
                    <mesh position={[0, 0, 0]} rotation={[-0.1, 0, 0]}>
                        <cylinderGeometry args={[0.022, 0.03, 0.52, 12]} />
                        <meshStandardMaterial color="#090d16" metalness={0.85} roughness={0.2} />
                    </mesh>
                    {/* Lumbar Pad */}
                    <mesh position={[0, -0.06, -0.03]}>
                        <boxGeometry args={[0.32, 0.1, 0.04]} />
                        <meshStandardMaterial color="#05080f" roughness={0.7} />
                    </mesh>
                    {/* Breathable Mesh Back Frame */}
                    <mesh position={[0, 0.12, -0.02]} rotation={[0.06, 0, 0]}>
                        <boxGeometry args={[0.46, 0.46, 0.035]} />
                        <meshStandardMaterial color="#0e1422" roughness={0.7} />
                    </mesh>
                </group>

                {/* 3D Adjustable Armrests */}
                <group position={[-0.26, 0.54, 0.02]}>
                    <mesh position={[0, -0.06, 0]}>
                        <boxGeometry args={[0.03, 0.18, 0.05]} />
                        <meshStandardMaterial color="#1e293b" metalness={0.8} />
                    </mesh>
                    <mesh position={[0, 0.04, 0]}>
                        <boxGeometry args={[0.07, 0.03, 0.22]} />
                        <meshStandardMaterial color="#090d16" roughness={0.5} />
                    </mesh>
                </group>
                <group position={[0.26, 0.54, 0.02]}>
                    <mesh position={[0, -0.06, 0]}>
                        <boxGeometry args={[0.03, 0.18, 0.05]} />
                        <meshStandardMaterial color="#1e293b" metalness={0.8} />
                    </mesh>
                    <mesh position={[0, 0.04, 0]}>
                        <boxGeometry args={[0.07, 0.03, 0.22]} />
                        <meshStandardMaterial color="#090d16" roughness={0.5} />
                    </mesh>
                </group>
            </group>
        </group>
    );
});

// -------------------------------------------------------------
// SUB-COMPONENT: Corner Server Rack with Patch Cables & LEDs
// -------------------------------------------------------------
const ServerRackTower = React.memo(function ServerRackTower() {
    const ledRef = useRef<THREE.InstancedMesh>(null);
    const count = 48;
    // Reuse dummy to avoid GC allocation every frame
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const offColor = useMemo(() => new THREE.Color('#040810'), []);
    const lastLedUpdate = useRef(0);
    const matrixInitialized = useRef(false);

    const ledData = useMemo(() => {
        const positions: THREE.Vector3[] = [];
        const colors: THREE.Color[] = [];
        const colorPalette = [
            new THREE.Color('#00f5d4'),
            new THREE.Color('#00f5d4'),
            new THREE.Color('#10b981'),
            new THREE.Color('#f72585'),
            new THREE.Color('#ffb703'),
            new THREE.Color('#040810'),
        ];

        for (let row = 0; row < 12; row++) {
            for (let col = 0; col < 4; col++) {
                positions.push(new THREE.Vector3(-0.24 + col * 0.16, 0.35 + row * 0.18, 0.38));
                colors.push(colorPalette[Math.floor(Math.random() * colorPalette.length)]);
            }
        }
        return { positions, colors };
    }, []);

    useFrame((state) => {
        if (!ledRef.current) return;
        const time = state.clock.elapsedTime;

        // Set LED positions once on first frame (static, no need to update every frame)
        if (!matrixInitialized.current) {
            for (let i = 0; i < count; i++) {
                dummy.position.copy(ledData.positions[i]);
                dummy.updateMatrix();
                ledRef.current.setMatrixAt(i, dummy.matrix);
            }
            ledRef.current.instanceMatrix.needsUpdate = true;
            matrixInitialized.current = true;
        }

        // Throttle color blink to ~10 FPS - LED blinks are very subtle
        if (time - lastLedUpdate.current < 0.1) return;
        lastLedUpdate.current = time;

        for (let i = 0; i < count; i++) {
            const blink = Math.sin(time * 10 + i * 1.7) > 0.2;
            ledRef.current.setColorAt(i, blink ? ledData.colors[i] : offColor);
        }
        ledRef.current.instanceColor!.needsUpdate = true;
    });

    return (
        <group position={[-3.3, 0, -2.4]} rotation={[0, 0.4, 0]}>
            {/* 42U Server Rack Cabinet */}
            <mesh position={[0, 1.4, 0]}>
                <boxGeometry args={[0.9, 2.8, 0.8]} />
                <meshStandardMaterial color="#060a12" roughness={0.4} metalness={0.8} />
            </mesh>

            {/* Perforated Metal Honeycomb Side Grille */}
            <mesh position={[-0.46, 1.4, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[0.76, 2.6]} />
                <meshStandardMaterial color="#020408" metalness={0.9} roughness={0.3} />
            </mesh>

            {/* Smoked Acrylic Front Door */}
            <mesh position={[0, 1.4, 0.41]}>
                <planeGeometry args={[0.82, 2.7]} />
                <meshStandardMaterial color="#00f5d4" transparent opacity={0.12} roughness={0.1} metalness={0.9} />
            </mesh>

            {/* Individual Server Blades */}
            {Array.from({ length: 12 }).map((_, i) => (
                <mesh key={i} position={[0, 0.35 + i * 0.18, 0.35]}>
                    <boxGeometry args={[0.78, 0.14, 0.05]} />
                    <meshStandardMaterial color="#111c2e" metalness={0.85} roughness={0.25} />
                </mesh>
            ))}

            {/* Colorful Ethernet Patch Cables Looping Between Blades */}
            {[
                { y: 0.6, color: '#00f5d4', x: -0.15 },
                { y: 1.0, color: '#ffb703', x: 0.1 },
                { y: 1.5, color: '#f72585', x: -0.05 },
                { y: 1.9, color: '#00f5d4', x: 0.18 },
            ].map((cable, idx) => (
                <mesh key={idx} position={[cable.x, cable.y, 0.39]} rotation={[0, 0, 0.4]}>
                    <torusGeometry args={[0.1, 0.012, 8, 16, Math.PI]} />
                    <meshBasicMaterial color={cable.color} toneMapped={false} />
                </mesh>
            ))}

            {/* Blinking Status LED Array */}
            <instancedMesh ref={ledRef} args={[undefined, undefined, count]}>
                <sphereGeometry args={[0.014, 8, 8]} />
                <meshBasicMaterial toneMapped={false} />
            </instancedMesh>
            {/* Its own point light was removed as part of the room's lighting budget cut;
                the blinking LEDs are emissive and still read as lit on their own. */}
        </group>
    );
});

// -------------------------------------------------------------
// SUB-COMPONENT: Night Window (Curtained â€” exterior vista removed)
// -------------------------------------------------------------
// Dark mode is permanent now, and at night the window is drawn shut with a
// curtain (see ArchitecturalRoom's closed curtain panels), so the courtyard
// garden / sky vista / rain that used to be visible through the glass has
// been removed entirely: it was never seen behind the curtain and was one
// of the heavier parts of the scene (a generated sky texture, a dozen+
// garden meshes, and a per-frame rain particle update).
const DynamicAtmosphereWindow = React.memo(function DynamicAtmosphereWindow() {
    return (
        <group position={[0, 0, 0]}>
            {/* ARCHITECTURAL HOLLOW WINDOW CASING & SLIM BRONZE MULLIONS */}
            {/* Top Frame Beam */}
            <mesh position={[0, 2.92, -3.46]}>
                <boxGeometry args={[3.84, 0.08, 0.12]} />
                <meshStandardMaterial color="#3d2b1c" roughness={0.4} metalness={0.3} />
            </mesh>
            {/* Bottom Frame Beam */}
            <mesh position={[0, 0.88, -3.46]} receiveShadow>
                <boxGeometry args={[3.84, 0.08, 0.12]} />
                <meshStandardMaterial color="#3d2b1c" roughness={0.4} metalness={0.3} />
            </mesh>
            {/* Left Frame Jamb */}
            <mesh position={[-1.88, 1.9, -3.46]}>
                <boxGeometry args={[0.08, 2.08, 0.12]} />
                <meshStandardMaterial color="#3d2b1c" roughness={0.4} metalness={0.3} />
            </mesh>
            {/* Right Frame Jamb */}
            <mesh position={[1.88, 1.9, -3.46]}>
                <boxGeometry args={[0.08, 2.08, 0.12]} />
                <meshStandardMaterial color="#3d2b1c" roughness={0.4} metalness={0.3} />
            </mesh>
            {/* Center Slim Vertical Mullion */}
            <mesh position={[0, 1.9, -3.46]}>
                <boxGeometry args={[0.045, 2.0, 0.08]} />
                <meshStandardMaterial color="#3d2b1c" roughness={0.4} metalness={0.3} />
            </mesh>
            {/* Horizontal Upper Transom Bar */}
            <mesh position={[0, 2.45, -3.46]}>
                <boxGeometry args={[3.72, 0.035, 0.07]} />
                <meshStandardMaterial color="#3d2b1c" roughness={0.4} metalness={0.3} />
            </mesh>
        </group>
    );
});



// -------------------------------------------------------------
// SUB-COMPONENT: Cyberpunk Mini Fridge & Gamer Snacks Counter
// -------------------------------------------------------------
interface MiniFridgeAndSnacksCounterProps {
    currentRoutine?: CharacterRoutine;
    onRoutineChange?: (routine: CharacterRoutine, label: string) => void;
}

interface SnackDef {
    id: string;
    title: string;
    desc: string;
    icon: string;
    stat: string;
    inFridge?: boolean;
}

const MiniFridgeAndSnacksCounter = React.memo(function MiniFridgeAndSnacksCounter({
    currentRoutine,
    onRoutineChange,
}: MiniFridgeAndSnacksCounterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isCabinetOpen, setIsCabinetOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState<{
        title: string;
        desc: string;
        icon: string;
        stat: string;
        key: number;
    } | null>(null);
    const [eatenCount, setEatenCount] = useState(0);
    const [pulsingItem, setPulsingItem] = useState<string | null>(null);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const doorHingeRef = useRef<THREE.Group>(null);
    const cabinetHingeRef = useRef<THREE.Group>(null);
    const interiorLightRef = useRef<THREE.PointLight>(null);

    // Auto-dismiss snack message after 4.2 seconds
    useEffect(() => {
        if (!snackMessage) return;
        const timer = setTimeout(() => {
            setSnackMessage(null);
        }, 4200);
        return () => clearTimeout(timer);
    }, [snackMessage]);

    // Synchronize fridge & pantry doors with Aditya's routines:
    // Auto-opens when Aditya is snacking; auto-closes BEFORE he moves away!
    useEffect(() => {
        if (currentRoutine === 'snacking_at_fridge') {
            setIsOpen(true);
            audio.playFridgeDoor(true);
            // Close the fridge door at 1.8s so it is fully shut and latched before he finishes snacking at 3.0s!
            const closeTimer = setTimeout(() => {
                setIsOpen(false);
                setIsCabinetOpen(false);
                audio.playFridgeDoor(false);
            }, 1800);
            return () => clearTimeout(closeTimer);
        } else {
            // Ensure door is closed whenever not snacking
            setIsOpen((prev) => {
                if (prev) audio.playFridgeDoor(false);
                return false;
            });
            setIsCabinetOpen((prev) => {
                if (prev) audio.playFridgeDoor(false);
                return false;
            });
        }
    }, [currentRoutine]);

    // Smooth hinge animation in render loop
    useFrame((_, delta) => {
        const dt = Math.min(0.05, delta);
        if (doorHingeRef.current) {
            const targetAngle = isOpen ? -Math.PI * 0.65 : 0;
            doorHingeRef.current.rotation.y = THREE.MathUtils.damp(
                doorHingeRef.current.rotation.y,
                targetAngle,
                8,
                dt
            );
        }
        if (cabinetHingeRef.current) {
            const targetAngle = isCabinetOpen ? Math.PI * 0.58 : 0;
            cabinetHingeRef.current.rotation.y = THREE.MathUtils.damp(
                cabinetHingeRef.current.rotation.y,
                targetAngle,
                8,
                dt
            );
        }
        if (interiorLightRef.current) {
            const targetIntensity = isOpen ? 4.5 : 2.0;
            interiorLightRef.current.intensity = THREE.MathUtils.damp(
                interiorLightRef.current.intensity,
                targetIntensity,
                6,
                dt
            );
        }
    });

    const toggleFridge = (forced?: boolean) => {
        const next = forced !== undefined ? forced : !isOpen;
        setIsOpen(next);
        audio.playFridgeDoor(next);
        if (next) {
            setSnackMessage({
                title: 'Mini Fridge Opened',
                desc: 'Chilled cold air rushing out! Click any can or bottle to drink.',
                icon: '🧊',
                stat: 'Chamber: 3°C',
                key: Date.now(),
            });
        } else {
            setSnackMessage({
                title: 'Mini Fridge Closed',
                desc: 'Acoustic magnetic seal locked. Cold storage secure.',
                icon: '🔒',
                stat: 'Locked at 3°C',
                key: Date.now(),
            });
        }
    };

    const toggleCabinet = () => {
        const next = !isCabinetOpen;
        setIsCabinetOpen(next);
        audio.playFridgeDoor(next);
        if (next) {
            setSnackMessage({
                title: 'Snack Pantry Opened',
                desc: 'Restocked with instant Tonkotsu ramen & cyber protein bars!',
                icon: '🍱',
                stat: 'Pantry Stash Unlocked',
                key: Date.now(),
            });
        }
    };

    const handleConsume = (snack: SnackDef) => {
        if (snack.inFridge && !isOpen) {
            setIsOpen(true);
            audio.playFridgeDoor(true);
        }
        audio.playSnack();
        setPulsingItem(snack.id);
        setTimeout(() => setPulsingItem(null), 450);
        setEatenCount((c) => c + 1);
        setSnackMessage({
            title: snack.title,
            desc: snack.desc,
            icon: snack.icon,
            stat: snack.stat,
            key: Date.now(),
        });
    };

    // Catalog of all snacks for random snacking button
    const ALL_SNACKS: SnackDef[] = useMemo(
        () => [
            { id: 'can-surge', title: 'Cyber Surge Energy', desc: 'Gulped electric citrus surge! Heart rate overclocked.', icon: '⚡', stat: '+100 Focus & Turbo Hype', inFridge: true },
            { id: 'can-pink', title: 'Neon Berry Nitro', desc: 'Chugged icy wild strawberry! Supercharged reflexes.', icon: '🍓', stat: '+80 Speed & Reflexes', inFridge: true },
            { id: 'can-gold', title: 'Volt Citrus Spark', desc: 'Downed fizzy sour lemon recharge! Fully hydrated.', icon: '🍋', stat: '+65 Electrolytes', inFridge: true },
            { id: 'can-green', title: 'Hyper Matcha Nitro', desc: 'Sipped chilled ceremonial green tea fizz!', icon: '🍵', stat: '+75 Calming Clarity', inFridge: true },
            { id: 'bottle-blue', title: 'Midnight Cold Brew', desc: 'Savored 18-hour cold steeped dark roast coffee!', icon: '☕', stat: '+60 Midnight Stamina', inFridge: true },
            { id: 'bottle-amber', title: 'Caramel Nitro Stout', desc: 'Enjoyed rich vanilla caramel craft cream soda!', icon: '🥤', stat: '+45 Sweet Comfort', inFridge: true },
            { id: 'bottle-cyan', title: 'Sparkling Ramune', desc: 'Popped the glass marble down with a satisfying clink!', icon: '🫧', stat: '+35 Fizzy Happiness', inFridge: true },
            { id: 'bottle-red', title: 'Tokyo Craft Cola', desc: 'Sipped artisan spiced cinnamon cardamom cola!', icon: '🧃', stat: '+40 Dopamine Flow', inFridge: true },
            { id: 'pocky-red', title: 'Strawberry Pocky', desc: 'Crunch crunch! Munched sweet strawberry cream biscuit sticks.', icon: '🍓', stat: '+20 Sweet Morale' },
            { id: 'pocky-green', title: 'Matcha Cream Pocky', desc: 'Crunchy ceremonial matcha wafer biscuit munched.', icon: '🍵', stat: '+20 Creative Flow' },
            { id: 'chips-gold', title: 'Ghost Pepper Doritos', desc: 'Fiery spicy crunch! Eyes watering with pure energy.', icon: '🌶️', stat: '+25 Turbo Hype' },
            { id: 'chips-purple', title: 'Roasted Nori Seaweed', desc: 'Savory crispy sesame nori snack devoured.', icon: '🍙', stat: '+15 Brainfuel' },
            { id: 'candy-jar', title: 'Sour RGB Power Gummies', desc: 'Popped 3 chewy rainbow sour power gummy candies!', icon: '🍬', stat: '+30 Sugar Rush' },
            { id: 'tea-mug', title: 'Steaming Genmaicha Tea', desc: 'Took a warm, fragrant sip of roasted brown rice green tea.', icon: '🍵', stat: '+35 Calming Zen' },
            { id: 'pantry-ramen', title: 'Spicy Tonkotsu Ramen', desc: 'Slurped rich piping-hot broth and wavy noodles!', icon: '🍜', stat: '+85 Pure Fuel' },
            { id: 'pantry-bar', title: 'Cyber Protein Bar', desc: 'Chomped chewy peanut butter fudge oat protein bar!', icon: '🍫', stat: '+50 Sustained Energy' },
        ],
        []
    );

    // Character routine reaction: when Aditya comes to snack, fridge automatically opens and serves treats
    useEffect(() => {
        if (currentRoutine === 'snacking_at_fridge') {
            setIsOpen(true);
            audio.playFridgeDoor(true);
            const randomSnack = ALL_SNACKS[Math.floor(Math.random() * ALL_SNACKS.length)];
            audio.playSnack();
            setSnackMessage({
                title: randomSnack.title,
                desc: randomSnack.desc,
                icon: randomSnack.icon,
                stat: randomSnack.stat,
                key: Date.now(),
            });
        } else if (currentRoutine === 'returning_to_desk' || currentRoutine === 'coding') {
            setIsOpen(false);
        }
    }, [currentRoutine, ALL_SNACKS]);

    // Helper for interactive item scale
    const getItemScale = (id: string, base: [number, number, number] = [1, 1, 1]): [number, number, number] => {
        const mult = pulsingItem === id ? 1.32 : hoveredItem === id ? 1.12 : 1.0;
        return [base[0] * mult, base[1] * mult, base[2] * mult];
    };

    return (
        <group position={[-2.40, 0, -2.95]}>
            {/* Minimal floating speech toast when snack is actively being eaten */}
            {snackMessage && (
                <group position={[0, 1.38, 0]}>
                    <Html center distanceFactor={6.2} zIndexRange={[120, 0]}>
                        <div className="animate-in fade-in zoom-in duration-200 pointer-events-none px-3 py-1.5 rounded-full bg-zinc-950/90 border border-emerald-400 text-xs font-mono text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.5)] whitespace-nowrap backdrop-blur-md flex items-center gap-2">
                            <span className="text-base">{snackMessage.icon}</span>
                            <span className="font-semibold">{snackMessage.title}</span>
                            <span className="text-emerald-400/80 text-[10px]">({snackMessage.stat})</span>
                        </div>
                    </Html>
                </group>
            )}

            {/* 1. COUNTERTOP & SOLID CABINET FRAME */}
            {/* Counter Cabinet Body */}
            <mesh receiveShadow position={[0, 0.44, 0]}>
                <boxGeometry args={[1.15, 0.88, 0.58]} />
                <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.6} />
            </mesh>
            {/* Live-Edge Walnut Counter Top Surface */}
            <mesh receiveShadow position={[0, 0.89, 0]}>
                <boxGeometry args={[1.20, 0.04, 0.62]} />
                <meshStandardMaterial color="#6a4c33" roughness={0.45} metalness={0.06} />
            </mesh>
            {/* Amber Neon Edge Accent under Counter Rim */}
            <mesh position={[0, 0.865, 0.312]}>
                <boxGeometry args={[1.18, 0.010, 0.008]} />
                <meshBasicMaterial color="#f59e0b" toneMapped={false} />
            </mesh>

            {/* 2. GLASS-DOOR RGB MINI FRIDGE (Left Bay, x = -0.28) */}
            <group position={[-0.28, 0.44, 0.02]}>
                {/* Fridge Chassis Cavity / Dark Interior */}
                <mesh>
                    <boxGeometry args={[0.50, 0.74, 0.48]} />
                    <meshStandardMaterial color="#030712" roughness={0.7} metalness={0.5} />
                </mesh>

                {/* Interior Cold Glow Light (Cyan/Aqua LED Bar) */}
                <pointLight
                    ref={interiorLightRef}
                    color="#00f5d4"
                    intensity={2.2}
                    distance={1.4}
                    decay={2}
                    position={[0, 0.25, 0.12]}
                />
                <mesh position={[0, 0.34, 0.14]}>
                    <boxGeometry args={[0.42, 0.012, 0.02]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                </mesh>

                {/* Frost / Cold Mist Plane inside fridge when open */}
                {isOpen && (
                    <mesh position={[0, 0, 0.16]}>
                        <planeGeometry args={[0.44, 0.68]} />
                        <meshBasicMaterial color="#00f5d4" transparent opacity={0.08} side={THREE.DoubleSide} />
                    </mesh>
                )}

                {/* Wire Shelf 1 (Middle Tier) */}
                <mesh position={[0, 0.02, 0]}>
                    <boxGeometry args={[0.44, 0.008, 0.40]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
                </mesh>

                {/* Wire Shelf 2 (Lower Tier) */}
                <mesh position={[0, -0.32, 0]}>
                    <boxGeometry args={[0.44, 0.008, 0.40]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
                </mesh>

                {/* ============================================================ */}
                {/* CHILLED ENERGY DRINK CANS (Top Shelf) - INTERACTIVE          */}
                {/* ============================================================ */}
                {[
                    { id: 'can-surge', title: 'Cyber Surge Energy', desc: 'Gulped electric citrus surge! Heart rate overclocked.', icon: '⚡', stat: '+100 Focus & Turbo Hype', inFridge: true, color: '#00f5d4', x: -0.16 },
                    { id: 'can-pink', title: 'Neon Berry Nitro', desc: 'Chugged icy wild strawberry! Supercharged reflexes.', icon: '🍓', stat: '+80 Speed & Reflexes', inFridge: true, color: '#f43f5e', x: -0.05 },
                    { id: 'can-gold', title: 'Volt Citrus Spark', desc: 'Downed fizzy sour lemon recharge! Fully hydrated.', icon: '🍋', stat: '+65 Electrolytes', inFridge: true, color: '#eab308', x: 0.06 },
                    { id: 'can-green', title: 'Hyper Matcha Nitro', desc: 'Sipped chilled ceremonial green tea fizz!', icon: '🍵', stat: '+75 Calming Clarity', inFridge: true, color: '#10b981', x: 0.17 },
                ].map((can) => {
                    const isHovered = hoveredItem === can.id;
                    const isPulsing = pulsingItem === can.id;
                    return (
                        <group
                            key={can.id}
                            position={[can.x, 0.12, 0.05]}
                            scale={getItemScale(can.id)}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleConsume(can);
                            }}
                            onPointerOver={(e) => {
                                e.stopPropagation();
                                setHoveredItem(can.id);
                                document.body.style.cursor = 'pointer';
                            }}
                            onPointerOut={(e) => {
                                e.stopPropagation();
                                if (hoveredItem === can.id) setHoveredItem(null);
                                document.body.style.cursor = 'auto';
                            }}
                        >
                            <mesh>
                                <cylinderGeometry args={[0.032, 0.032, 0.13, 14]} />
                                <meshStandardMaterial
                                    color={can.color}
                                    metalness={0.88}
                                    roughness={0.2}
                                    emissive={isHovered || isPulsing ? can.color : '#000000'}
                                    emissiveIntensity={isHovered ? 0.35 : isPulsing ? 0.8 : 0}
                                />
                            </mesh>
                            {/* Can Lid */}
                            <mesh position={[0, 0.066, 0]}>
                                <cylinderGeometry args={[0.029, 0.029, 0.004, 14]} />
                                <meshStandardMaterial color="#cbd5e1" metalness={0.98} roughness={0.08} />
                            </mesh>
                        </group>
                    );
                })}

                {/* ============================================================ */}
                {/* CHILLED GLASS COLD BREW / SODA BOTTLES - INTERACTIVE         */}
                {/* ============================================================ */}
                {[
                    { id: 'bottle-blue', title: 'Midnight Cold Brew', desc: 'Savored 18-hour cold steeped dark roast coffee!', icon: '☕', stat: '+60 Midnight Stamina', inFridge: true, color: '#1e3a5f', cap: '#eab308', x: -0.14 },
                    { id: 'bottle-amber', title: 'Caramel Nitro Stout', desc: 'Enjoyed rich vanilla caramel craft cream soda!', icon: '🥤', stat: '+45 Sweet Comfort', inFridge: true, color: '#451a03', cap: '#eab308', x: -0.04 },
                    { id: 'bottle-cyan', title: 'Sparkling Ramune', desc: 'Popped the glass marble down with a satisfying clink!', icon: '🫧', stat: '+35 Fizzy Happiness', inFridge: true, color: '#0369a1', cap: '#38bdf8', x: 0.06 },
                    { id: 'bottle-red', title: 'Tokyo Craft Cola', desc: 'Sipped artisan spiced cinnamon cardamom cola!', icon: '🧃', stat: '+40 Dopamine Flow', inFridge: true, color: '#7f1d1d', cap: '#fbbf24', x: 0.16 },
                ].map((bottle) => {
                    const isHovered = hoveredItem === bottle.id;
                    const isPulsing = pulsingItem === bottle.id;
                    return (
                        <group
                            key={bottle.id}
                            position={[bottle.x, -0.20, 0.05]}
                            scale={getItemScale(bottle.id)}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleConsume(bottle);
                            }}
                            onPointerOver={(e) => {
                                e.stopPropagation();
                                setHoveredItem(bottle.id);
                                document.body.style.cursor = 'pointer';
                            }}
                            onPointerOut={(e) => {
                                e.stopPropagation();
                                if (hoveredItem === bottle.id) setHoveredItem(null);
                                document.body.style.cursor = 'auto';
                            }}
                        >
                            <mesh>
                                <cylinderGeometry args={[0.028, 0.032, 0.15, 14]} />
                                <meshPhysicalMaterial
                                    color={bottle.color}
                                    transparent
                                    opacity={0.7}
                                    roughness={0.1}
                                    emissive={isHovered || isPulsing ? bottle.color : '#000000'}
                                    emissiveIntensity={isHovered ? 0.3 : isPulsing ? 0.7 : 0}
                                />
                            </mesh>
                            {/* Bottle Neck */}
                            <mesh position={[0, 0.09, 0]}>
                                <cylinderGeometry args={[0.012, 0.012, 0.04, 10]} />
                                <meshPhysicalMaterial color={bottle.color} transparent opacity={0.7} roughness={0.1} />
                            </mesh>
                            {/* Bottle Crown Cap */}
                            <mesh position={[0, 0.114, 0]}>
                                <cylinderGeometry args={[0.014, 0.014, 0.008, 10]} />
                                <meshStandardMaterial color={bottle.cap} metalness={0.95} roughness={0.15} />
                            </mesh>
                        </group>
                    );
                })}

                {/* ============================================================ */}
                {/* HINGED TEMPERED GLASS SHOWCASE DOOR (Pivots at Left Edge)    */}
                {/* ============================================================ */}
                <group ref={doorHingeRef} position={[-0.24, 0, 0.245]}>
                    <group
                        position={[0.24, 0, 0]}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFridge();
                        }}
                        onPointerOver={(e) => {
                            e.stopPropagation();
                            document.body.style.cursor = 'pointer';
                        }}
                        onPointerOut={(e) => {
                            e.stopPropagation();
                            document.body.style.cursor = 'auto';
                        }}
                    >
                        {/* Tempered Glass Showcase Door */}
                        <mesh position={[0, 0, 0]}>
                            <boxGeometry args={[0.48, 0.72, 0.012]} />
                            <meshPhysicalMaterial
                                color="#ffffff"
                                transparent
                                opacity={0.25}
                                roughness={0.05}
                                metalness={0.1}
                                transmission={0.78}
                            />
                        </mesh>
                        {/* Black Matte Bezel Frame on Glass Door */}
                        <mesh position={[0, 0, 0.003]}>
                            <boxGeometry args={[0.50, 0.74, 0.008]} />
                            <meshStandardMaterial color="#090d16" roughness={0.4} />
                        </mesh>
                        {/* Brushed Titanium Door Handle */}
                        <mesh position={[0.22, 0, 0.015]}>
                            <boxGeometry args={[0.014, 0.32, 0.018]} />
                            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
                        </mesh>
                        {/* Micro Digital Temp Display: "3°C" */}
                        <mesh position={[-0.14, 0.32, 0.008]}>
                            <boxGeometry args={[0.08, 0.024, 0.002]} />
                            <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                        </mesh>
                    </group>
                </group>
            </group>

            {/* ============================================================ */}
            {/* 3. RIGHT SNACK STORAGE CABINET (Hinged Pantry Door)          */}
            {/* ============================================================ */}
            <group position={[0.28, 0.44, 0.02]}>
                {/* Pantry Cavity Interior */}
                <mesh>
                    <boxGeometry args={[0.50, 0.74, 0.48]} />
                    <meshStandardMaterial color="#050811" roughness={0.7} />
                </mesh>

                {/* Interior Pantry Shelf */}
                <mesh position={[0, 0.02, 0]}>
                    <boxGeometry args={[0.46, 0.014, 0.42]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
                </mesh>

                {/* Interior Stash: Instant Tonkotsu Ramen Cup (Clickable) */}
                <group
                    position={[-0.10, 0.12, 0.06]}
                    scale={getItemScale('pantry-ramen')}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleConsume({
                            id: 'pantry-ramen',
                            title: 'Spicy Tonkotsu Ramen',
                            desc: 'Slurped rich piping-hot broth and wavy noodles!',
                            icon: '🍜',
                            stat: '+85 Pure Fuel',
                        });
                    }}
                    onPointerOver={(e) => {
                        e.stopPropagation();
                        setHoveredItem('pantry-ramen');
                        document.body.style.cursor = 'pointer';
                    }}
                    onPointerOut={(e) => {
                        e.stopPropagation();
                        if (hoveredItem === 'pantry-ramen') setHoveredItem(null);
                        document.body.style.cursor = 'auto';
                    }}
                >
                    <mesh>
                        <cylinderGeometry args={[0.05, 0.04, 0.12, 14]} />
                        <meshStandardMaterial color="#f97316" roughness={0.4} />
                    </mesh>
                    <mesh position={[0, 0.062, 0]}>
                        <cylinderGeometry args={[0.052, 0.052, 0.005, 14]} />
                        <meshStandardMaterial color="#e2e8f0" metalness={0.5} />
                    </mesh>
                </group>

                {/* Interior Stash: Cyber Protein Bars (Clickable) */}
                <group
                    position={[0.12, 0.08, 0.06]}
                    rotation={[0, 0.3, 0]}
                    scale={getItemScale('pantry-bar')}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleConsume({
                            id: 'pantry-bar',
                            title: 'Cyber Protein Bar',
                            desc: 'Chomped chewy peanut butter fudge oat protein bar!',
                            icon: '🍫',
                            stat: '+50 Sustained Energy',
                        });
                    }}
                    onPointerOver={(e) => {
                        e.stopPropagation();
                        setHoveredItem('pantry-bar');
                        document.body.style.cursor = 'pointer';
                    }}
                    onPointerOut={(e) => {
                        e.stopPropagation();
                        if (hoveredItem === 'pantry-bar') setHoveredItem(null);
                        document.body.style.cursor = 'auto';
                    }}
                >
                    <mesh>
                        <boxGeometry args={[0.05, 0.12, 0.024]} />
                        <meshStandardMaterial color="#a855f7" metalness={0.7} roughness={0.25} />
                    </mesh>
                </group>

                {/* Hinged Pantry Door (Pivots at Right Edge) */}
                <group ref={cabinetHingeRef} position={[0.24, 0, 0.27]}>
                    <group
                        position={[-0.24, 0, 0]}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleCabinet();
                        }}
                        onPointerOver={(e) => {
                            e.stopPropagation();
                            document.body.style.cursor = 'pointer';
                        }}
                        onPointerOut={(e) => {
                            e.stopPropagation();
                            document.body.style.cursor = 'auto';
                        }}
                    >
                        <mesh>
                            <boxGeometry args={[0.48, 0.74, 0.016]} />
                            <meshStandardMaterial color="#0b1220" roughness={0.5} metalness={0.3} />
                        </mesh>
                        {/* Vertical Anodized Brass Handle */}
                        <mesh position={[-0.18, 0, 0.018]}>
                            <boxGeometry args={[0.012, 0.28, 0.016]} />
                            <meshStandardMaterial color="#eab308" metalness={0.92} roughness={0.18} />
                        </mesh>
                        {/* Cabinet Door Embossed Accent Line */}
                        <mesh position={[0, 0, 0.01]}>
                            <boxGeometry args={[0.42, 0.68, 0.002]} />
                            <meshStandardMaterial color="#070b14" roughness={0.6} />
                        </mesh>
                    </group>
                </group>
            </group>

            {/* ============================================================ */}
            {/* 4. SNACK BAR COUNTERTOP ACCESSORIES (y = 0.91m) - ALL INTERACTIVE */}
            {/* ============================================================ */}
            <group position={[0, 0.91, 0]}>
                {/* Acrylic Snack Organizer Tray */}
                <group position={[-0.22, 0.01, 0.04]}>
                    <mesh>
                        <boxGeometry args={[0.38, 0.024, 0.28]} />
                        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
                    </mesh>

                    {/* Japanese Strawberry Pocky Box */}
                    <group
                        position={[-0.12, 0.08, -0.04]}
                        rotation={[0.15, 0.2, -0.05]}
                        scale={getItemScale('pocky-red')}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleConsume({
                                id: 'pocky-red',
                                title: 'Strawberry Pocky',
                                desc: 'Crunch crunch! Munched sweet strawberry cream biscuit sticks.',
                                icon: '🍓',
                                stat: '+20 Sweet Morale',
                            });
                        }}
                        onPointerOver={(e) => {
                            e.stopPropagation();
                            setHoveredItem('pocky-red');
                            document.body.style.cursor = 'pointer';
                        }}
                        onPointerOut={(e) => {
                            e.stopPropagation();
                            if (hoveredItem === 'pocky-red') setHoveredItem(null);
                            document.body.style.cursor = 'auto';
                        }}
                    >
                        <mesh>
                            <boxGeometry args={[0.07, 0.15, 0.03]} />
                            <meshStandardMaterial
                                color="#dc2626"
                                roughness={0.4}
                                emissive={hoveredItem === 'pocky-red' ? '#ef4444' : '#000000'}
                                emissiveIntensity={hoveredItem === 'pocky-red' ? 0.3 : 0}
                            />
                        </mesh>
                    </group>

                    {/* Japanese Matcha Pocky Box */}
                    <group
                        position={[-0.04, 0.08, -0.02]}
                        rotation={[0.1, -0.15, 0.04]}
                        scale={getItemScale('pocky-green')}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleConsume({
                                id: 'pocky-green',
                                title: 'Matcha Cream Pocky',
                                desc: 'Crunchy ceremonial matcha wafer biscuit munched.',
                                icon: '🍵',
                                stat: '+20 Creative Flow',
                            });
                        }}
                        onPointerOver={(e) => {
                            e.stopPropagation();
                            setHoveredItem('pocky-green');
                            document.body.style.cursor = 'pointer';
                        }}
                        onPointerOut={(e) => {
                            e.stopPropagation();
                            if (hoveredItem === 'pocky-green') setHoveredItem(null);
                            document.body.style.cursor = 'auto';
                        }}
                    >
                        <mesh>
                            <boxGeometry args={[0.07, 0.15, 0.03]} />
                            <meshStandardMaterial
                                color="#16a34a"
                                roughness={0.4}
                                emissive={hoveredItem === 'pocky-green' ? '#22c55e' : '#000000'}
                                emissiveIntensity={hoveredItem === 'pocky-green' ? 0.3 : 0}
                            />
                        </mesh>
                    </group>

                    {/* Ghost Pepper Chips Foil Pouch */}
                    <group
                        position={[0.08, 0.07, 0.02]}
                        rotation={[0.2, 0.3, 0]}
                        scale={getItemScale('chips-gold')}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleConsume({
                                id: 'chips-gold',
                                title: 'Ghost Pepper Doritos',
                                desc: 'Fiery spicy crunch! Eyes watering with pure energy.',
                                icon: '🌶️',
                                stat: '+25 Turbo Hype',
                            });
                        }}
                        onPointerOver={(e) => {
                            e.stopPropagation();
                            setHoveredItem('chips-gold');
                            document.body.style.cursor = 'pointer';
                        }}
                        onPointerOut={(e) => {
                            e.stopPropagation();
                            if (hoveredItem === 'chips-gold') setHoveredItem(null);
                            document.body.style.cursor = 'auto';
                        }}
                    >
                        <mesh>
                            <boxGeometry args={[0.10, 0.13, 0.025]} />
                            <meshStandardMaterial
                                color="#f59e0b"
                                metalness={0.6}
                                roughness={0.3}
                                emissive={hoveredItem === 'chips-gold' ? '#f59e0b' : '#000000'}
                                emissiveIntensity={hoveredItem === 'chips-gold' ? 0.3 : 0}
                            />
                        </mesh>
                    </group>

                    {/* Roasted Seaweed Nori Foil Pouch */}
                    <group
                        position={[0.04, 0.06, 0.06]}
                        rotation={[0.1, -0.2, 0]}
                        scale={getItemScale('chips-purple')}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleConsume({
                                id: 'chips-purple',
                                title: 'Roasted Nori Seaweed',
                                desc: 'Savory crispy sesame nori snack devoured.',
                                icon: '🍙',
                                stat: '+15 Brainfuel',
                            });
                        }}
                        onPointerOver={(e) => {
                            e.stopPropagation();
                            setHoveredItem('chips-purple');
                            document.body.style.cursor = 'pointer';
                        }}
                        onPointerOut={(e) => {
                            e.stopPropagation();
                            if (hoveredItem === 'chips-purple') setHoveredItem(null);
                            document.body.style.cursor = 'auto';
                        }}
                    >
                        <mesh>
                            <boxGeometry args={[0.10, 0.11, 0.025]} />
                            <meshStandardMaterial
                                color="#8b5cf6"
                                metalness={0.6}
                                roughness={0.3}
                                emissive={hoveredItem === 'chips-purple' ? '#a855f7' : '#000000'}
                                emissiveIntensity={hoveredItem === 'chips-purple' ? 0.3 : 0}
                            />
                        </mesh>
                    </group>
                </group>

                {/* Clear Glass Candy/Protein Gummy Jar with Brass Lid */}
                <group
                    position={[0.18, 0.08, 0.08]}
                    scale={getItemScale('candy-jar')}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleConsume({
                            id: 'candy-jar',
                            title: 'Sour RGB Power Gummies',
                            desc: 'Popped 3 chewy rainbow sour power gummy candies!',
                            icon: '🍬',
                            stat: '+30 Sugar Rush',
                        });
                    }}
                    onPointerOver={(e) => {
                        e.stopPropagation();
                        setHoveredItem('candy-jar');
                        document.body.style.cursor = 'pointer';
                    }}
                    onPointerOut={(e) => {
                        e.stopPropagation();
                        if (hoveredItem === 'candy-jar') setHoveredItem(null);
                        document.body.style.cursor = 'auto';
                    }}
                >
                    <mesh>
                        <cylinderGeometry args={[0.06, 0.06, 0.14, 18]} />
                        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.35} roughness={0.08} />
                    </mesh>
                    {/* Colorful Gummy / Candy Contents inside */}
                    <mesh position={[0, -0.02, 0]}>
                        <cylinderGeometry args={[0.052, 0.052, 0.09, 14]} />
                        <meshStandardMaterial
                            color="#f43f5e"
                            roughness={0.6}
                            emissive={hoveredItem === 'candy-jar' ? '#fb7185' : '#000000'}
                            emissiveIntensity={hoveredItem === 'candy-jar' ? 0.35 : 0}
                        />
                    </mesh>
                    {/* Brass Lid */}
                    <mesh position={[0, 0.075, 0]}>
                        <cylinderGeometry args={[0.064, 0.064, 0.016, 18]} />
                        <meshStandardMaterial color="#eab308" metalness={0.92} roughness={0.15} />
                    </mesh>
                </group>

                {/* Instant Electric Kettle & Ceramic Mug (Clickable Tea) */}
                <group
                    position={[0.34, 0.08, -0.08]}
                    scale={getItemScale('tea-mug')}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleConsume({
                            id: 'tea-mug',
                            title: 'Steaming Genmaicha Tea',
                            desc: 'Took a warm, fragrant sip of roasted brown rice green tea.',
                            icon: '🍵',
                            stat: '+35 Calming Zen',
                        });
                    }}
                    onPointerOver={(e) => {
                        e.stopPropagation();
                        setHoveredItem('tea-mug');
                        document.body.style.cursor = 'pointer';
                    }}
                    onPointerOut={(e) => {
                        e.stopPropagation();
                        if (hoveredItem === 'tea-mug') setHoveredItem(null);
                        document.body.style.cursor = 'auto';
                    }}
                >
                    <mesh>
                        <cylinderGeometry args={[0.052, 0.068, 0.15, 16]} />
                        <meshStandardMaterial color="#090d16" roughness={0.4} metalness={0.6} />
                    </mesh>
                    <mesh position={[-0.045, 0.045, 0]} rotation={[0, 0, 0.5]}>
                        <cylinderGeometry args={[0.008, 0.014, 0.05, 10]} />
                        <meshStandardMaterial color="#090d16" roughness={0.4} />
                    </mesh>
                    <mesh position={[0.068, 0.02, 0]}>
                        <boxGeometry args={[0.014, 0.12, 0.024]} />
                        <meshStandardMaterial color="#1e293b" roughness={0.5} />
                    </mesh>
                    <mesh position={[0, -0.076, 0]}>
                        <cylinderGeometry args={[0.072, 0.072, 0.012, 16]} />
                        <meshStandardMaterial color="#1e293b" metalness={0.8} />
                    </mesh>
                    <mesh position={[-0.065, -0.076, 0]}>
                        <sphereGeometry args={[0.004, 8, 8]} />
                        <meshBasicMaterial color="#f59e0b" toneMapped={false} />
                    </mesh>
                </group>
            </group>
        </group>
    );
});

// -------------------------------------------------------------
// SUB-COMPONENT: Modern Lounge Chill Zone, 65" OLED TV & Streetwear Decor (Options 1 & 4)
// -------------------------------------------------------------
interface LoungeAndMediaZoneProps {
    currentRoutine: CharacterRoutine;
    onRoutineChange: (routine: CharacterRoutine, statusText: string) => void;
}

const LoungeAndMediaZone = React.memo(function LoungeAndMediaZone({
    currentRoutine,
    onRoutineChange,
}: LoungeAndMediaZoneProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Procedural Tactile Bouclé Woven Fabric Texture for Realistic Luxury Sofa Upholstery
    const boucleTexture = useMemo(() => {
        if (typeof document === 'undefined') return null;
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        // Base warm oatmeal / natural ivory tone
        ctx.fillStyle = '#f4efe6';
        ctx.fillRect(0, 0, 512, 512);

        // Soft woven textile cross-hatch underlay
        ctx.strokeStyle = 'rgba(215, 205, 192, 0.45)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 512; i += 6) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(512, i);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 512);
            ctx.stroke();
        }

        // Realistic looped bouclé wool nubby fiber knots & highlights
        for (let i = 0; i < 3600; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const r = 1.2 + Math.random() * 2.2;
            const rand = Math.random();
            ctx.strokeStyle = rand > 0.65 ? 'rgba(255, 255, 255, 0.60)' : rand > 0.28 ? 'rgba(220, 210, 195, 0.50)' : 'rgba(175, 162, 145, 0.35)';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 1.6);
            ctx.stroke();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(3, 3);
        return texture;
    }, []);

    // Procedural 16:9 YouTube Player Interface Texture for the 65" OLED TV
    const tvTexture = useMemo(() => {
        if (typeof document === 'undefined') return null;
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 288;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        // Base YouTube player dark background
        ctx.fillStyle = '#0f0f0f';
        ctx.fillRect(0, 0, 512, 288);

        // ============================================================
        // 1. VIDEO VIEWPORT CONTENT (Lo-fi Anime Cyber City Stream)
        // ============================================================
        const videoGrad = ctx.createLinearGradient(0, 36, 0, 246);
        videoGrad.addColorStop(0, '#0c1022');
        videoGrad.addColorStop(0.5, '#1e1b4b');
        videoGrad.addColorStop(0.85, '#4c1d95');
        videoGrad.addColorStop(1, '#831843');
        ctx.fillStyle = videoGrad;
        ctx.fillRect(0, 36, 512, 210);

        // Distant city skyline inside the video
        ctx.fillStyle = '#090814';
        const skyline = [
            [15, 65, 35], [45, 95, 40], [80, 75, 30], [105, 120, 48],
            [150, 55, 36], [180, 85, 32], [210, 130, 50], [255, 70, 38],
            [290, 110, 42], [330, 60, 35], [360, 95, 45], [400, 70, 38],
            [435, 105, 42], [475, 80, 36]
        ];
        skyline.forEach(([bx, bh, bw]) => {
            ctx.fillRect(bx, 246 - bh, bw, bh);
            // Window lights
            ctx.fillStyle = '#fef08a';
            for (let wy = 246 - bh + 8; wy < 238; wy += 12) {
                for (let wx = bx + 5; wx < bx + bw - 5; wx += 9) {
                    if ((wx * 3 + wy * 7) % 5 === 0) {
                        ctx.fillRect(wx, wy, 3, 4);
                    }
                }
            }
            ctx.fillStyle = '#090814';
        });

        // Ambient city magenta/cyan fog in video
        const fogGrad = ctx.createLinearGradient(0, 210, 0, 246);
        fogGrad.addColorStop(0, 'rgba(244,63,94,0)');
        fogGrad.addColorStop(1, 'rgba(244,63,94,0.35)');
        ctx.fillStyle = fogGrad;
        ctx.fillRect(0, 210, 512, 36);

        // Giant glowing moon in video
        const moonGrad = ctx.createRadialGradient(390, 92, 4, 390, 92, 36);
        moonGrad.addColorStop(0, '#ffffff');
        moonGrad.addColorStop(0.3, '#fef08a');
        moonGrad.addColorStop(0.8, '#f43f5e');
        moonGrad.addColorStop(1, 'rgba(244,63,94,0)');
        ctx.fillStyle = moonGrad;
        ctx.beginPath();
        ctx.arc(390, 92, 36, 0, Math.PI * 2);
        ctx.fill();

        // ============================================================
        // 2. YOUTUBE TOP HEADER BAR (y: 0 to 36)
        // ============================================================
        const topScrim = ctx.createLinearGradient(0, 0, 0, 46);
        topScrim.addColorStop(0, 'rgba(0,0,0,0.85)');
        topScrim.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = topScrim;
        ctx.fillRect(0, 0, 512, 46);

        // YouTube Red Pill Logo
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(14, 10, 24, 16, 4);
        } else {
            ctx.rect(14, 10, 24, 16);
        }
        ctx.fill();

        // White Play Triangle
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(23, 14);
        ctx.lineTo(23, 22);
        ctx.lineTo(30, 18);
        ctx.closePath();
        ctx.fill();

        // "YouTube" Brand Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
        ctx.fillText('YouTube', 43, 23);

        // YouTube Search Bar (Center)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(150, 8, 205, 20, 10);
        } else {
            ctx.rect(150, 8, 205, 20);
        }
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '10px system-ui, sans-serif';
        ctx.fillText('🔍  lofi hip hop radio - beats to relax/study to', 160, 22);

        // Top Right: Notification Bell & Profile Avatar
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(460, 18, 5, 0, Math.PI * 2);
        ctx.fill();

        // Cyan User Profile Avatar with 'A'
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(486, 18, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('A', 483, 21);

        // ============================================================
        // 3. VIDEO OVERLAY INFO
        // ============================================================
        // Red [● LIVE] Badge
        ctx.fillStyle = '#cc0000';
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(14, 48, 48, 16, 3);
        } else {
            ctx.rect(14, 48, 48, 16);
        }
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('● LIVE', 20, 60);

        // Video Title Overlay
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.fillText('lofi hip hop radio 📚 - beats to relax/study to [24/7 live]', 68, 60);

        // Channel Name & Viewer Count
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px system-ui, sans-serif';
        ctx.fillText('Lofi Girl ✔  •  42,851 watching', 68, 74);

        // ============================================================
        // 4. BOTTOM YOUTUBE PLAYER CONTROLS (y: 240 to 288)
        // ============================================================
        const botScrim = ctx.createLinearGradient(0, 230, 0, 288);
        botScrim.addColorStop(0, 'rgba(0,0,0,0)');
        botScrim.addColorStop(1, 'rgba(0,0,0,0.92)');
        ctx.fillStyle = botScrim;
        ctx.fillRect(0, 230, 512, 58);

        // Timeline Progress Bar (Red scrubber line)
        const scrubY = 254;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(12, scrubY, 488, 3);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.fillRect(12, scrubY, 395, 3);
        // YouTube Red Progress Bar
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(12, scrubY, 345, 3);
        // Scrubber Knob
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(357, scrubY + 1.5, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(357, scrubY + 1.5, 2, 0, Math.PI * 2);
        ctx.fill();

        // Left Controls: Play/Pause, Next, Volume, Live badge
        ctx.fillStyle = '#ffffff';
        // Pause bars ❚❚
        ctx.fillRect(16, 266, 3, 11);
        ctx.fillRect(23, 266, 3, 11);

        // Next ⏭
        ctx.beginPath();
        ctx.moveTo(34, 266);
        ctx.lineTo(41, 271.5);
        ctx.lineTo(34, 277);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(42, 266, 2, 11);

        // Volume Speaker 🔊
        ctx.beginPath();
        ctx.moveTo(52, 269);
        ctx.lineTo(55, 269);
        ctx.lineTo(59, 266);
        ctx.lineTo(59, 277);
        ctx.lineTo(55, 274);
        ctx.lineTo(52, 274);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(59, 271.5, 4.5, -0.6, 0.6);
        ctx.stroke();

        // Volume slider bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(68, 271, 28, 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(68, 271, 20, 2);

        // Red Live Dot + "LIVE"
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('●', 106, 275);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('LIVE', 115, 275);

        // Right Controls: Autoplay, [CC], Settings, Miniplayer, Fullscreen
        // Autoplay switch
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.lineWidth = 1;
        ctx.strokeRect(386, 268, 16, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(395, 269, 6, 6);

        // [CC] Badge
        ctx.strokeRect(412, 267, 16, 10);
        ctx.font = 'bold 7px sans-serif';
        ctx.fillText('CC', 416, 275);

        // Settings Gear ⚙️
        ctx.font = '10px sans-serif';
        ctx.fillText('⚙️', 438, 276);

        // Theater mode rect
        ctx.strokeRect(460, 268, 12, 8);

        // Fullscreen [ ⛶ ]
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(484, 269); ctx.lineTo(484, 266); ctx.lineTo(487, 266);
        ctx.moveTo(496, 266); ctx.lineTo(499, 266); ctx.lineTo(499, 269);
        ctx.moveTo(484, 274); ctx.lineTo(484, 277); ctx.lineTo(487, 277);
        ctx.moveTo(496, 277); ctx.lineTo(499, 277); ctx.lineTo(499, 274);
        ctx.stroke();

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        return texture;
    }, []);

    // TV turns ON after he sits on sofa and turns OFF when he is not on sofa
    const isTvOn = currentRoutine === 'watching_tv';

    const triggerLounge = () => {
        audio.playClick();
        if (currentRoutine !== 'watching_tv') {
            onRoutineChange('walking_to_tv', 'Heading to Sofa to Chill...');
        } else {
            onRoutineChange('returning_to_desk', 'Returning to Battlestation...');
        }
    };

    return (
        <group>
            {/* ============================================================ */}
            {/* 1. WALL-MOUNTED 65" ULTRA-SLIM OLED TV (Mounted on Right Wall) */}
            {/* Right wall is x = 3.5, TV placed at x = 3.46, z = 1.35, y = 1.55 */}
            {/* ============================================================ */}
            <group
                position={[3.46, 1.55, 1.35]}
                onClick={(e) => {
                    e.stopPropagation();
                    triggerLounge();
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setIsHovered(true);
                    document.body.style.cursor = 'pointer';
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    setIsHovered(false);
                    document.body.style.cursor = 'auto';
                }}
            >
                {/* Wall VESA Steel Mounting Arm Bracket */}
                <mesh position={[0.015, 0, 0]}>
                    <boxGeometry args={[0.015, 0.35, 0.45]} />
                    <meshStandardMaterial color="#050505" metalness={0.8} roughness={0.4} />
                </mesh>

                {/* 1. Main TV Rear Chassis Enclosure (Ultra-slim OLED backing) */}
                <mesh position={[0.006, 0, 0]}>
                    <boxGeometry args={[0.016, 0.846, 1.496]} />
                    <meshStandardMaterial
                        color="#050505"
                        metalness={0.2}
                        roughness={0.85}
                    />
                </mesh>

                {/* 2. Sleek Ultra-Thin Matte Black Bezel Frame (Uniform thin black borders) */}
                {/* Top Border */}
                <mesh position={[-0.010, 0.42025, 0]}>
                    <boxGeometry args={[0.014, 0.008, 1.496]} />
                    <meshStandardMaterial color="#0a0a0a" roughness={0.9} metalness={0.1} />
                </mesh>
                {/* Bottom Border */}
                <mesh position={[-0.010, -0.41625, 0]}>
                    <boxGeometry args={[0.014, 0.008, 1.496]} />
                    <meshStandardMaterial color="#0a0a0a" roughness={0.9} metalness={0.1} />
                </mesh>
                {/* Left Border */}
                <mesh position={[-0.010, 0.002, -0.744]}>
                    <boxGeometry args={[0.014, 0.8325, 0.008]} />
                    <meshStandardMaterial color="#0a0a0a" roughness={0.9} metalness={0.1} />
                </mesh>
                {/* Right Border */}
                <mesh position={[-0.010, 0.002, 0.744]}>
                    <boxGeometry args={[0.014, 0.8325, 0.008]} />
                    <meshStandardMaterial color="#0a0a0a" roughness={0.9} metalness={0.1} />
                </mesh>

                {/* 6. 65" 16:9 OLED Display Screen (Fits squarely and cleanly inside the border) */}
                <mesh position={[-0.006, 0.002, 0]} rotation={[0, -Math.PI / 2, 0]}>
                    <planeGeometry args={[1.48, 0.8325]} />
                    {isTvOn ? (
                        <meshBasicMaterial
                            map={tvTexture || undefined}
                            toneMapped={false}
                        />
                    ) : (
                        <meshStandardMaterial
                            color="#030508"
                            roughness={0.06}
                            metalness={0.88}
                        />
                    )}
                </mesh>

                {/* 7. Subtle Center Branding Mark on Bottom Bezel */}
                <mesh position={[-0.013, -0.435, 0]}>
                    <boxGeometry args={[0.001, 0.004, 0.034]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
                </mesh>

                {/* 8. Micro Power LED Status Indicator on Bottom Bezel */}
                <mesh position={[-0.013, -0.435, 0.65]}>
                    <sphereGeometry args={[0.004, 10, 10]} />
                    <meshBasicMaterial color={isTvOn ? '#00f5d4' : '#ef4444'} toneMapped={false} />
                </mesh>
            </group>

            {/* ============================================================ */}
            {/* 2. FLOATING SMOKED WALNUT MEDIA CONSOLE (Under TV)            */}
            {/* ============================================================ */}
            <group position={[3.32, 0.48, 1.35]}>
                {/* Main Console Cabinet Body */}
                <mesh receiveShadow position={[0, 0, 0]}>
                    <boxGeometry args={[0.34, 0.24, 1.88]} />
                    <meshStandardMaterial color="#452c1e" roughness={0.42} metalness={0.05} />
                </mesh>

                {/* Center Slatted Speaker Cloth Insert */}
                <mesh position={[-0.171, 0, 0]}>
                    <boxGeometry args={[0.005, 0.20, 0.72]} />
                    <meshStandardMaterial color="#1a1c23" roughness={0.8} />
                </mesh>

                {/* Side Drawer Reveal Seams */}
                <mesh position={[-0.171, 0, -0.48]}>
                    <boxGeometry args={[0.005, 0.21, 0.01]} />
                    <meshStandardMaterial color="#2d1c12" />
                </mesh>
                <mesh position={[-0.171, 0, 0.48]}>
                    <boxGeometry args={[0.005, 0.21, 0.01]} />
                    <meshStandardMaterial color="#2d1c12" />
                </mesh>

                {/* ============================================================ */}
                {/* ARCHITECTURAL YELLOWISH-WHITE LED UNDERGLOW (JUST LIKE SETUP) */}
                {/* ============================================================ */}
                {/* Front linear LED diffuser strip */}
                <mesh position={[-0.11, -0.121, 0]}>
                    <boxGeometry args={[0.015, 0.008, 1.80]} />
                    <meshBasicMaterial color="#fff6d8" toneMapped={false} />
                </mesh>
                {/* Rear linear LED diffuser strip */}
                <mesh position={[0.11, -0.121, 0]}>
                    <boxGeometry args={[0.015, 0.008, 1.80]} />
                    <meshBasicMaterial color="#fffaea" toneMapped={false} />
                </mesh>
                {/* Recessed underside wash diffuser plate */}
                <mesh position={[0, -0.122, 0]}>
                    <boxGeometry args={[0.26, 0.004, 1.82]} />
                    <meshBasicMaterial color="#fff4d4" toneMapped={false} />
                </mesh>

                {/* Main yellowish-white under-table point light illuminating the floor & skirting */}
                <pointLight
                    color="#fff3cc"
                    intensity={3.5}
                    distance={3.4}
                    decay={2}
                    position={[-0.05, -0.22, 0]}
                />
                {/* Side wing fill lights along console length for seamless linear underglow */}
                <pointLight
                    color="#fffae8"
                    intensity={1.8}
                    distance={2.4}
                    decay={2}
                    position={[-0.05, -0.22, -0.58]}
                />
                <pointLight
                    color="#fffae8"
                    intensity={1.8}
                    distance={2.4}
                    decay={2}
                    position={[-0.05, -0.22, 0.58]}
                />

                {/* Soft warm floor glow pool directly under the floating console */}
                <mesh position={[-0.08, -0.476, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.65, 2.10]} />
                    <meshBasicMaterial color="#fff0be" transparent opacity={0.38} depthWrite={false} />
                </mesh>

                {/* Sleek Soundbar on Console Surface */}
                <group position={[0.02, 0.142, 0]}>
                    <mesh>
                        <boxGeometry args={[0.08, 0.042, 0.88]} />
                        <meshStandardMaterial color="#111827" roughness={0.6} metalness={0.3} />
                    </mesh>
                    {/* Metallic Accent Trim */}
                    <mesh position={[-0.041, 0, 0]}>
                        <boxGeometry args={[0.002, 0.014, 0.86]} />
                        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
                    </mesh>
                </group>

                {/* High-Detail PlayStation 5 (Vertical with Iconic Flared Collar Plates & Blue LED) */}
                <group position={[0.02, 0.28, -0.68]}>
                    {/* 1. Circular Matte Black Desktop Stand Base */}
                    <mesh position={[0, -0.155, 0]}>
                        <cylinderGeometry args={[0.055, 0.06, 0.012, 24]} />
                        <meshStandardMaterial color="#090d16" roughness={0.4} metalness={0.2} />
                    </mesh>

                    {/* 2. Sleek High-Gloss Obsidian Black Center Core */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[0.076, 0.30, 0.038]} />
                        <meshStandardMaterial color="#05070c" roughness={0.12} metalness={0.85} />
                    </mesh>

                    {/* 3. Left Flared White Wing Plate (Popped collar flare at top) */}
                    <group position={[0, 0, -0.022]}>
                        <mesh position={[0, 0, 0]}>
                            <boxGeometry args={[0.088, 0.32, 0.007]} />
                            <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.05} />
                        </mesh>
                        <mesh position={[-0.004, 0.165, -0.002]} rotation={[0, 0, -0.08]}>
                            <boxGeometry args={[0.082, 0.025, 0.007]} />
                            <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.05} />
                        </mesh>
                    </group>

                    {/* 4. Right Flared White Wing Plate (Symmetric popped collar flare at top) */}
                    <group position={[0, 0, 0.022]}>
                        <mesh position={[0, 0, 0]}>
                            <boxGeometry args={[0.088, 0.32, 0.007]} />
                            <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.05} />
                        </mesh>
                        <mesh position={[-0.004, 0.165, 0.002]} rotation={[0, 0, -0.08]}>
                            <boxGeometry args={[0.082, 0.025, 0.007]} />
                            <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.05} />
                        </mesh>
                    </group>

                    {/* 5. Ultra-Thin Optical Disc Drive Bulge (Right bottom) */}
                    <mesh position={[0.002, -0.07, 0.025]}>
                        <boxGeometry args={[0.084, 0.14, 0.008]} />
                        <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.05} />
                    </mesh>

                    {/* 6. Front USB-C & USB-A Ports */}
                    <mesh position={[-0.040, -0.02, 0]}>
                        <boxGeometry args={[0.002, 0.012, 0.004]} />
                        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
                    </mesh>
                    <mesh position={[-0.040, -0.045, 0]}>
                        <boxGeometry args={[0.002, 0.014, 0.006]} />
                        <meshStandardMaterial color="#2563eb" metalness={0.8} roughness={0.3} />
                    </mesh>

                    {/* 7. Iconic Glowing Blue/Cyan LED Slits along inner fin crease */}
                    <mesh position={[-0.042, 0.03, -0.018]}>
                        <boxGeometry args={[0.002, 0.22, 0.002]} />
                        <meshBasicMaterial color={isTvOn ? '#38bdf8' : '#1d4ed8'} toneMapped={false} />
                    </mesh>
                    <mesh position={[-0.042, 0.03, 0.018]}>
                        <boxGeometry args={[0.002, 0.22, 0.002]} />
                        <meshBasicMaterial color={isTvOn ? '#38bdf8' : '#1d4ed8'} toneMapped={false} />
                    </mesh>
                </group>

                {/* Dual Wireless Gamepads on Charging Dock */}
                <group position={[0.02, 0.145, 0.62]}>
                    {/* Dock Base */}
                    <mesh position={[0, 0.012, 0]}>
                        <boxGeometry args={[0.07, 0.024, 0.22]} />
                        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
                    </mesh>
                    {/* Gamepad 1 */}
                    <mesh position={[0, 0.04, -0.06]} rotation={[0.3, 0, 0]}>
                        <boxGeometry args={[0.055, 0.035, 0.08]} />
                        <meshStandardMaterial color="#090d16" roughness={0.4} />
                    </mesh>
                    {/* Gamepad 2 */}
                    <mesh position={[0, 0.04, 0.06]} rotation={[0.3, 0, 0]}>
                        <boxGeometry args={[0.055, 0.035, 0.08]} />
                        <meshStandardMaterial color="#090d16" roughness={0.4} />
                    </mesh>
                </group>

                {/* Fluted Ceramic Planter with Trailing Succulent */}
                <group position={[0.02, 0.155, 0.82]}>
                    <mesh>
                        <cylinderGeometry args={[0.04, 0.032, 0.07, 14]} />
                        <meshStandardMaterial color="#c2410c" roughness={0.65} />
                    </mesh>
                    <mesh position={[0, 0.04, 0]}>
                        <sphereGeometry args={[0.038, 8, 8]} />
                        <meshStandardMaterial color="#15803d" roughness={0.5} />
                    </mesh>
                </group>
            </group>

            {/* ============================================================ */}
            {/* 3. OPTION 4: STREETWEAR SKATEBOARDS WALL DISPLAY              */}
            {/* Mounted vertically on the right wall at z = 0.20 to 0.44     */}
            {/* ============================================================ */}
            <group position={[3.47, 1.65, 0.32]}>
                {/* Skateboard 1: Neo-Tokyo Akita Cyber Kanji Graphic */}
                <group position={[0, 0, -0.14]}>
                    {/* Deck Body (7-Ply Canadian Maple) */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[0.014, 0.78, 0.19]} />
                        <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.1} />
                    </mesh>
                    {/* Top Kicktail Curve */}
                    <mesh position={[0.008, 0.38, 0]} rotation={[0, 0, 0.16]}>
                        <boxGeometry args={[0.014, 0.10, 0.19]} />
                        <meshStandardMaterial color="#0f172a" roughness={0.35} />
                    </mesh>
                    {/* Bottom Kicktail Curve */}
                    <mesh position={[0.008, -0.38, 0]} rotation={[0, 0, -0.16]}>
                        <boxGeometry args={[0.014, 0.10, 0.19]} />
                        <meshStandardMaterial color="#0f172a" roughness={0.35} />
                    </mesh>
                    {/* Streetwear Graphic Inset Decals (Pink & Cyan Anime Wave) */}
                    <mesh position={[-0.008, 0.05, 0]}>
                        <boxGeometry args={[0.001, 0.44, 0.16]} />
                        <meshBasicMaterial color="#f43f5e" />
                    </mesh>
                    <mesh position={[-0.0085, -0.14, 0]}>
                        <boxGeometry args={[0.001, 0.22, 0.14]} />
                        <meshBasicMaterial color="#00f5d4" />
                    </mesh>
                    {/* Polished Chrome Trucks */}
                    {[-0.24, 0.24].map((ty, ti) => (
                        <group key={ti} position={[-0.02, ty, 0]}>
                            <mesh rotation={[0, 0, Math.PI / 2]}>
                                <cylinderGeometry args={[0.01, 0.01, 0.025, 8]} />
                                <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
                            </mesh>
                            {/* Hanger Axle */}
                            <mesh>
                                <boxGeometry args={[0.016, 0.016, 0.17]} />
                                <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
                            </mesh>
                            {/* 52mm Urethane Wheels */}
                            {[-0.08, 0.08].map((wz, wi) => (
                                <mesh key={wi} position={[0, 0, wz]} rotation={[Math.PI / 2, 0, 0]}>
                                    <cylinderGeometry args={[0.024, 0.024, 0.022, 12]} />
                                    <meshStandardMaterial color="#00f5d4" roughness={0.3} />
                                </mesh>
                            ))}
                        </group>
                    ))}
                </group>

                {/* Skateboard 2: Street Minimal Monochrome / Tokyo Typography */}
                <group position={[0, 0, 0.14]}>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[0.014, 0.78, 0.19]} />
                        <meshStandardMaterial color="#18181b" roughness={0.35} metalness={0.1} />
                    </mesh>
                    <mesh position={[0.008, 0.38, 0]} rotation={[0, 0, 0.16]}>
                        <boxGeometry args={[0.014, 0.10, 0.19]} />
                        <meshStandardMaterial color="#18181b" roughness={0.35} />
                    </mesh>
                    <mesh position={[0.008, -0.38, 0]} rotation={[0, 0, -0.16]}>
                        <boxGeometry args={[0.014, 0.10, 0.19]} />
                        <meshStandardMaterial color="#18181b" roughness={0.35} />
                    </mesh>
                    {/* Gold Foil Geometric Decal */}
                    <mesh position={[-0.008, 0, 0]}>
                        <boxGeometry args={[0.001, 0.52, 0.15]} />
                        <meshStandardMaterial color="#eab308" metalness={0.88} roughness={0.2} />
                    </mesh>
                    {/* Trucks & Off-White Wheels */}
                    {[-0.24, 0.24].map((ty, ti) => (
                        <group key={ti} position={[-0.02, ty, 0]}>
                            <mesh rotation={[0, 0, Math.PI / 2]}>
                                <cylinderGeometry args={[0.01, 0.01, 0.025, 8]} />
                                <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
                            </mesh>
                            <mesh>
                                <boxGeometry args={[0.016, 0.016, 0.17]} />
                                <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
                            </mesh>
                            {[-0.08, 0.08].map((wz, wi) => (
                                <mesh key={wi} position={[0, 0, wz]} rotation={[Math.PI / 2, 0, 0]}>
                                    <cylinderGeometry args={[0.024, 0.024, 0.022, 12]} />
                                    <meshStandardMaterial color="#fef08a" roughness={0.4} />
                                </mesh>
                            ))}
                        </group>
                    ))}
                </group>
            </group>


            {/* ============================================================ */}
            {/* 5. OPTION 4: MINIMALIST TECHWEAR COAT & HEADPHONE STAND       */}
            {/* Corner stand tucked beside TV lounge console at x = 3.25, z = 2.45 */}
            {/* ============================================================ */}
            <group position={[3.25, 0, 2.45]}>
                {/* Heavy Solid Steel Base Plate */}
                <mesh position={[0, 0.015, 0]}>
                    <cylinderGeometry args={[0.16, 0.16, 0.03, 16]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.25} />
                </mesh>

                {/* Matte-Black Steel Upright Mast */}
                <mesh position={[0, 0.88, 0]}>
                    <cylinderGeometry args={[0.016, 0.016, 1.72, 12]} />
                    <meshStandardMaterial color="#090d16" metalness={0.8} roughness={0.3} />
                </mesh>

                {/* Angled Hanging Hooks */}
                {[
                    { y: 1.62, rotY: 0.4, hookLen: 0.16 },
                    { y: 1.48, rotY: -1.2, hookLen: 0.18 },
                    { y: 1.25, rotY: 2.2, hookLen: 0.16 },
                ].map((hook, hi) => (
                    <group key={hi} position={[0, hook.y, 0]} rotation={[0, hook.rotY, 0.35]}>
                        <mesh position={[0, hook.hookLen * 0.5, 0]}>
                            <cylinderGeometry args={[0.008, 0.008, hook.hookLen, 8]} />
                            <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
                        </mesh>
                    </group>
                ))}

                {/* Wireless Studio Monitor Headphones Hung on Top Hook */}
                <group position={[0.06, 1.64, 0.04]} rotation={[0.2, 0.4, -0.2]}>
                    {/* Cushioned Headband Arc */}
                    <mesh>
                        <torusGeometry args={[0.065, 0.01, 8, 16, Math.PI]} />
                        <meshStandardMaterial color="#090d16" roughness={0.6} />
                    </mesh>
                    {/* Left & Right Memory Foam Earcups */}
                    {[-0.065, 0.065].map((ex, ei) => (
                        <mesh key={ei} position={[ex, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.026, 0.026, 0.024, 12]} />
                            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
                        </mesh>
                    ))}
                </group>

                {/* Draped Techwear Bomber Jacket Hung on Mid Hook */}
                <group position={[-0.04, 1.05, 0.05]} rotation={[0, 0.3, 0]}>
                    {/* Jacket Body */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[0.26, 0.62, 0.18]} />
                        <meshStandardMaterial color="#111827" roughness={0.7} />
                    </mesh>
                    {/* Cyber Orange Strap Accent Ribbon */}
                    <mesh position={[0, 0.05, 0.095]}>
                        <boxGeometry args={[0.03, 0.45, 0.004]} />
                        <meshStandardMaterial color="#ea580c" roughness={0.4} />
                    </mesh>
                    {/* Metal Carabiner Buckle */}
                    <mesh position={[0, -0.16, 0.10]}>
                        <boxGeometry args={[0.036, 0.045, 0.01]} />
                        <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
                    </mesh>
                </group>
            </group>

            {/* ============================================================ */}
            {/* 6. REALISTIC DESIGNER CURVED BOUCLÉ CHILL SOFA              */}
            {/* Positioned at x = 1.82, z = 1.35, facing +X (towards the TV) */}
            {/* ============================================================ */}
            <group
                position={[1.82, 0, 1.35]}
                rotation={[0, Math.PI / 2, 0]}
                onClick={(e) => {
                    e.stopPropagation();
                    triggerLounge();
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    document.body.style.cursor = 'pointer';
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    document.body.style.cursor = 'auto';
                }}
            >
                {/* ── SOFA STRUCTURE: Solid Hardwood Frame & Plinth Base ── */}
                {/* Low Solid Dark-Oak Plinth Base spanning the full sofa width */}
                <mesh receiveShadow position={[0, 0.045, 0]}>
                    <boxGeometry args={[1.46, 0.09, 0.74]} />
                    <meshStandardMaterial color="#1c140d" roughness={0.55} metalness={0.05} />
                </mesh>
                {/* Walnut veneer top face of plinth */}
                <mesh position={[0, 0.092, 0]}>
                    <boxGeometry args={[1.44, 0.008, 0.72]} />
                    <meshStandardMaterial color="#2e1d0e" roughness={0.65} />
                </mesh>
                {/* 4 Tapered Cone Walnut Feet with Polished Brass Ferrule Caps */}
                {([[-0.62, -0.28], [0.62, -0.28], [-0.62, 0.28], [0.62, 0.28]] as [number, number][]).map(([fx, fz], idx) => (
                    <group key={idx} position={[fx, 0.005, fz]}>
                        <mesh>
                            <cylinderGeometry args={[0.028, 0.020, 0.082, 14]} />
                            <meshStandardMaterial color="#3d2510" roughness={0.5} />
                        </mesh>
                        {/* Brass Cap Ferrule */}
                        <mesh position={[0, -0.036, 0]}>
                            <cylinderGeometry args={[0.021, 0.019, 0.022, 14]} />
                            <meshStandardMaterial color="#b45309" metalness={0.92} roughness={0.18} />
                        </mesh>
                    </group>
                ))}

                {/* ── UPHOLSTERED FRAME BODY (the structural shell beneath cushions) ── */}
                {/* Inner foam seating platform */}
                <mesh receiveShadow position={[0, 0.14, 0.02]}>
                    <boxGeometry args={[1.38, 0.04, 0.66]} />
                    <meshStandardMaterial map={boucleTexture || undefined} color="#ede8de" roughness={0.88} />
                </mesh>

                {/* ── THREE INDIVIDUAL SEAT CUSHIONS ── */}
                {/* Left Seat Cushion */}
                <group position={[-0.45, 0.255, 0.02]}>
                    <mesh receiveShadow>
                        <boxGeometry args={[0.43, 0.22, 0.62]} />
                        <meshStandardMaterial map={boucleTexture || undefined} color="#f5f0e8" roughness={0.90} />
                    </mesh>
                    {/* Pillow-top bulge */}
                    <mesh position={[0, 0.108, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.26, 0.26, 0.43, 20]} />
                        <meshStandardMaterial map={boucleTexture || undefined} color="#f5f0e8" roughness={0.90} />
                    </mesh>
                    {/* Front welt seam */}
                    <mesh position={[0, 0.112, 0.315]}>
                        <boxGeometry args={[0.43, 0.015, 0.013]} />
                        <meshStandardMaterial color="#ddd4c1" roughness={0.95} />
                    </mesh>
                    {/* Side welt seams */}
                    <mesh position={[-0.218, 0.08, 0]}>
                        <boxGeometry args={[0.013, 0.20, 0.62]} />
                        <meshStandardMaterial color="#ddd4c1" roughness={0.95} />
                    </mesh>
                </group>
                {/* Center Seat Cushion */}
                <group position={[0, 0.255, 0.02]}>
                    <mesh receiveShadow>
                        <boxGeometry args={[0.43, 0.22, 0.62]} />
                        <meshStandardMaterial map={boucleTexture || undefined} color="#f5f0e8" roughness={0.90} />
                    </mesh>
                    <mesh position={[0, 0.108, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.26, 0.26, 0.43, 20]} />
                        <meshStandardMaterial map={boucleTexture || undefined} color="#f5f0e8" roughness={0.90} />
                    </mesh>
                    <mesh position={[0, 0.112, 0.315]}>
                        <boxGeometry args={[0.43, 0.015, 0.013]} />
                        <meshStandardMaterial color="#ddd4c1" roughness={0.95} />
                    </mesh>
                </group>
                {/* Right Seat Cushion */}
                <group position={[0.45, 0.255, 0.02]}>
                    <mesh receiveShadow>
                        <boxGeometry args={[0.43, 0.22, 0.62]} />
                        <meshStandardMaterial map={boucleTexture || undefined} color="#f5f0e8" roughness={0.90} />
                    </mesh>
                    <mesh position={[0, 0.108, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.26, 0.26, 0.43, 20]} />
                        <meshStandardMaterial map={boucleTexture || undefined} color="#f5f0e8" roughness={0.90} />
                    </mesh>
                    <mesh position={[0, 0.112, 0.315]}>
                        <boxGeometry args={[0.43, 0.015, 0.013]} />
                        <meshStandardMaterial color="#ddd4c1" roughness={0.95} />
                    </mesh>
                    {/* Side welt seam right */}
                    <mesh position={[0.218, 0.08, 0]}>
                        <boxGeometry args={[0.013, 0.20, 0.62]} />
                        <meshStandardMaterial color="#ddd4c1" roughness={0.95} />
                    </mesh>
                </group>
                {/* Shadow gap crevices between cushions */}
                <mesh position={[-0.225, 0.29, 0.02]}>
                    <boxGeometry args={[0.02, 0.14, 0.60]} />
                    <meshStandardMaterial color="#1a1208" roughness={0.98} />
                </mesh>
                <mesh position={[0.225, 0.29, 0.02]}>
                    <boxGeometry args={[0.02, 0.14, 0.60]} />
                    <meshStandardMaterial color="#1a1208" roughness={0.98} />
                </mesh>

                {/* ── FULL-WIDTH BACKREST WITH BACK CUSHIONS ── */}
                {/* Structural backrest frame (reclined 12°) */}
                <group position={[0, 0.44, -0.33]} rotation={[-0.20, 0, 0]}>
                    {/* Solid frame wall */}
                    <mesh receiveShadow>
                        <boxGeometry args={[1.40, 0.42, 0.14]} />
                        <meshStandardMaterial map={boucleTexture || undefined} color="#eae5db" roughness={0.88} />
                    </mesh>
                    {/* Three back cushions (matching seat positions) */}
                    {([-0.45, 0, 0.45] as number[]).map((bx, bi) => (
                        <group key={bi} position={[bx, 0, 0.075]}>
                            {/* Back cushion body */}
                            <mesh>
                                <boxGeometry args={[0.43, 0.38, 0.10]} />
                                <meshStandardMaterial map={boucleTexture || undefined} color="#f5f0e8" roughness={0.90} />
                            </mesh>
                            {/* Front face pillow bulge */}
                            <mesh position={[0, 0, 0.04]}>
                                <boxGeometry args={[0.41, 0.36, 0.06]} />
                                <meshStandardMaterial map={boucleTexture || undefined} color="#f5f0e8" roughness={0.90} />
                            </mesh>
                            {/* Welt seam around front face */}
                            <mesh position={[0, 0.193, 0.03]}>
                                <boxGeometry args={[0.43, 0.012, 0.12]} />
                                <meshStandardMaterial color="#ddd4c1" roughness={0.95} />
                            </mesh>
                            {/* Center button tuft indentation */}
                            <mesh position={[0, 0, 0.072]}>
                                <cylinderGeometry args={[0.018, 0.018, 0.005, 12]} />
                                <meshStandardMaterial color="#ccc4b0" roughness={0.95} />
                            </mesh>
                        </group>
                    ))}
                    {/* Bullnose top crest rail */}
                    <mesh position={[0, 0.205, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.095, 0.095, 1.40, 22]} />
                        <meshStandardMaterial map={boucleTexture || undefined} color="#ede8de" roughness={0.88} />
                    </mesh>
                    {/* Back cushion shadow dividers */}
                    <mesh position={[-0.225, 0, 0.075]}>
                        <boxGeometry args={[0.018, 0.40, 0.12]} />
                        <meshStandardMaterial color="#1a1208" roughness={0.98} />
                    </mesh>
                    <mesh position={[0.225, 0, 0.075]}>
                        <boxGeometry args={[0.018, 0.40, 0.12]} />
                        <meshStandardMaterial color="#1a1208" roughness={0.98} />
                    </mesh>
                </group>

                {/* ── LEFT ARMREST ── */}
                <group position={[-0.69, 0.36, -0.04]}>
                    {/* Armrest vertical side panel */}
                    <mesh receiveShadow>
                        <boxGeometry args={[0.10, 0.44, 0.68]} />
                        <meshStandardMaterial map={boucleTexture || undefined} color="#ede8de" roughness={0.88} />
                    </mesh>
                    {/* Padded arm top flat surface */}
                    <mesh position={[0, 0.22, -0.02]}>
                        <boxGeometry args={[0.14, 0.06, 0.64]} />
                        <meshStandardMaterial map={boucleTexture || undefined} color="#f5f0e8" roughness={0.90} />
                    </mesh>
                    {/* Rounded front arm end cap */}
                    <mesh position={[0, 0.12, 0.34]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.11, 0.10, 0.14, 18]} />
                        <meshStandardMaterial map={boucleTexture || undefined} color="#ede8de" roughness={0.88} />
                    </mesh>
                    {/* Arm top welt seam */}
                    <mesh position={[0, 0.252, -0.02]}>
                        <boxGeometry args={[0.14, 0.012, 0.64]} />
                        <meshStandardMaterial color="#ddd4c1" roughness={0.95} />
                    </mesh>
                </group>

                {/* ── RIGHT ARMREST ── */}
                <group position={[0.69, 0.36, -0.04]}>
                    <mesh receiveShadow>
                        <boxGeometry args={[0.10, 0.44, 0.68]} />
                        <meshStandardMaterial map={boucleTexture || undefined} color="#ede8de" roughness={0.88} />
                    </mesh>
                    <mesh position={[0, 0.22, -0.02]}>
                        <boxGeometry args={[0.14, 0.06, 0.64]} />
                        <meshStandardMaterial map={boucleTexture || undefined} color="#f5f0e8" roughness={0.90} />
                    </mesh>
                    <mesh position={[0, 0.12, 0.34]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.11, 0.10, 0.14, 18]} />
                        <meshStandardMaterial map={boucleTexture || undefined} color="#ede8de" roughness={0.88} />
                    </mesh>
                    <mesh position={[0, 0.252, -0.02]}>
                        <boxGeometry args={[0.14, 0.012, 0.64]} />
                        <meshStandardMaterial color="#ddd4c1" roughness={0.95} />
                    </mesh>
                </group>

                {/* ── ACCENT PILLOWS & THROW ── */}
                {/* Round bouclé ball pillow */}
                <mesh position={[-0.34, 0.45, -0.25]}>
                    <sphereGeometry args={[0.12, 24, 24]} />
                    <meshStandardMaterial map={boucleTexture || undefined} color="#eae3d6" roughness={0.96} />
                </mesh>
                {/* Sage green linen lumbar cushion */}
                <group position={[0.30, 0.50, -0.30]} rotation={[0.18, -0.24, 0.06]}>
                    <mesh>
                        <boxGeometry args={[0.32, 0.26, 0.12]} />
                        <meshStandardMaterial color="#4a5e42" roughness={0.85} />
                    </mesh>
                    <mesh position={[0, 0, 0.062]}>
                        <boxGeometry args={[0.32, 0.26, 0.005]} />
                        <meshStandardMaterial color="#3a4b34" roughness={0.9} />
                    </mesh>
                </group>
                {/* Waffle-weave cashmere throw over right armrest */}
                <group position={[0.70, 0.48, 0.10]} rotation={[0, -0.18, 0.08]}>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[0.18, 0.028, 0.58]} />
                        <meshStandardMaterial color="#dcd3c5" roughness={0.94} />
                    </mesh>
                    <mesh position={[0, -0.08, 0.28]} rotation={[0.45, 0, 0]}>
                        <boxGeometry args={[0.18, 0.16, 0.022]} />
                        <meshStandardMaterial color="#d2c8b8" roughness={0.94} />
                    </mesh>
                </group>
            </group>

            {/* ============================================================ */}
            {/* 7. COMPACT FLUTED OAK COFFEE TABLE                           */}
            {/* ============================================================ */}

            {/* Chic Organic Fluted Oak Cylinder Coffee Table */}
            <group position={[2.42, 0, 1.35]}>
                {/* Solid Round Fluted Oak Table Drum */}
                <mesh receiveShadow position={[0, 0.12, 0]}>
                    <cylinderGeometry args={[0.24, 0.24, 0.24, 28]} />
                    <meshStandardMaterial color="#7c5838" roughness={0.46} metalness={0.04} />
                </mesh>

                {/* Top Chamfer Lip Rim */}
                <mesh position={[0, 0.242, 0]}>
                    <cylinderGeometry args={[0.245, 0.235, 0.015, 28]} />
                    <meshStandardMaterial color="#6a492d" roughness={0.4} />
                </mesh>

                {/* Tokyo Minimalist Architecture Book */}
                <mesh position={[0.02, 0.255, -0.06]} rotation={[0, 0.35, 0]}>
                    <boxGeometry args={[0.19, 0.016, 0.14]} />
                    <meshStandardMaterial color="#18181b" roughness={0.5} />
                </mesh>

                {/* Matte Ceramic Coffee Cup with Hot Coffee */}
                <group position={[-0.05, 0.28, 0.06]}>
                    <mesh>
                        <cylinderGeometry args={[0.034, 0.028, 0.068, 14]} />
                        <meshStandardMaterial color="#27272a" roughness={0.75} />
                    </mesh>
                    <mesh position={[0, 0.026, 0]}>
                        <cylinderGeometry args={[0.030, 0.030, 0.005, 12]} />
                        <meshStandardMaterial color="#3b1c09" roughness={0.25} />
                    </mesh>
                </group>
            </group>

            {/* ============================================================ */}
            {/* 7. MINIMALIST STANDING LIGHT IN LOUNGE NOOK                 */}
            {/* Soft architectural lighting - placed in lounge corner, never blocking TV */}
            {/* ============================================================ */}
            <group position={[2.95, 0, 2.70]}>
                {/* Weighted Nero Marquina Marble Circular Base */}
                <mesh receiveShadow position={[0, 0.022, 0]}>
                    <cylinderGeometry args={[0.18, 0.20, 0.044, 28]} />
                    <meshStandardMaterial color="#0f1117" roughness={0.3} metalness={0.15} />
                </mesh>
                {/* Brushed Brass Perimeter Trim Ring */}
                <mesh position={[0, 0.044, 0]}>
                    <torusGeometry args={[0.185, 0.006, 12, 28]} />
                    <meshStandardMaterial color="#b45309" metalness={0.92} roughness={0.2} />
                </mesh>
                {/* Brass Foot Tap Switch Button */}
                <mesh position={[0.08, 0.050, 0.06]}>
                    <cylinderGeometry args={[0.015, 0.015, 0.014, 16]} />
                    <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.25} />
                </mesh>

                {/* Single Slender Vertical Architectural Bronze Stem */}
                <mesh position={[0, 0.74, 0]}>
                    <cylinderGeometry args={[0.011, 0.011, 1.44, 16]} />
                    <meshStandardMaterial color="#1f1813" metalness={0.85} roughness={0.3} />
                </mesh>

                {/* Brass Shade Mount Knuckle Collar */}
                <mesh position={[0, 1.46, 0]}>
                    <cylinderGeometry args={[0.018, 0.018, 0.032, 16]} />
                    <meshStandardMaterial color="#b45309" metalness={0.92} roughness={0.2} />
                </mesh>

                {/* Single Fluted Architectural Lampshade (No shadow to prevent wall patterns) */}
                <group position={[0, 1.52, 0]}>
                    {/* Conical Lampshade Exterior */}
                    <mesh>
                        <cylinderGeometry args={[0.09, 0.22, 0.20, 24, 1, true]} />
                        <meshStandardMaterial
                            color="#faf5ee"
                            roughness={0.85}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                    {/* Brushed Brass Top Finial Ring */}
                    <mesh position={[0, 0.10, 0]}>
                        <cylinderGeometry args={[0.022, 0.022, 0.018, 16]} />
                        <meshStandardMaterial color="#b45309" metalness={0.92} roughness={0.2} />
                    </mesh>
                    {/* Warm Frosted Opal Glass Diffuser Bulb */}
                    <mesh position={[0, -0.04, 0]}>
                        <sphereGeometry args={[0.050, 18, 18]} />
                        <meshBasicMaterial color="#fffbeb" toneMapped={false} />
                    </mesh>
                    {/* Soft local warm lamp glow (short distance, completely clear of the TV wall) */}
                    <pointLight
                        color="#fef3c7"
                        intensity={0.45}
                        distance={0.9}
                        decay={2}
                        position={[0, -0.15, 0]}
                    />
                </group>
            </group>
        </group>
    );
});

// -------------------------------------------------------------
// SUB-COMPONENT: High-Tech Coffee Station / Espresso Bar
// -------------------------------------------------------------
const CoffeeStation = React.memo(function CoffeeStation() {
    const steamGeo = useMemo(() => {
        const count = 32;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 0.06;
            pos[i * 3 + 1] = 0.01 + Math.random() * 0.28;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 0.06;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        return geo;
    }, []);

    const lastSteamUpdate = useRef(0);
    useFrame((state) => {
        const now = state.clock.elapsedTime;
        const dt = now - lastSteamUpdate.current;
        if (dt < 0.05) return;
        lastSteamUpdate.current = now;
        const pos = steamGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < 32; i++) {
            pos[i * 3 + 1] += dt * 0.2;
            pos[i * 3] += (Math.random() - 0.5) * dt * 0.04;
            if (pos[i * 3 + 1] > 0.32) {
                pos[i * 3 + 1] = 0.01;
                pos[i * 3] = (Math.random() - 0.5) * 0.04;
            }
        }
        steamGeo.attributes.position.needsUpdate = true;
    });

    return (
        <group position={[3.15, 0, -0.43]} rotation={[0, -Math.PI / 2, 0]}>
            {/* Coffee counter is now moved flush against the tall wooden wardrobe at z=-0.94,
                sticking them seamlessly together as a custom built-in architectural unit. */}

            {/* COUNTER BASE - 1.0 wide, back face flush against the right wall (wall at world x=3.5) */}
            <mesh receiveShadow position={[0, 0.45, 0]}>
                <boxGeometry args={[1.0, 0.9, 0.62]} />
                <meshStandardMaterial color="#0a101b" roughness={0.4} metalness={0.7} />
            </mesh>
            <mesh position={[0, 0.9, 0.31]}>
                <boxGeometry args={[1.0, 0.018, 0.008]} />
                <meshBasicMaterial color="#ffb703" toneMapped={false} />
            </mesh>
            <mesh position={[0, 0.905, 0]} receiveShadow>
                <boxGeometry args={[1.02, 0.018, 0.64]} />
                <meshStandardMaterial color="#111827" metalness={0.6} roughness={0.3} />
            </mesh>

            {/* DETAILED ESPRESSO MACHINE */}
            <group position={[0.08, 0.92, -0.04]}>
                {/* Stainless body */}
                <mesh position={[0, 0.22, 0]}>
                    <boxGeometry args={[0.42, 0.44, 0.32]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.92} roughness={0.14} />
                </mesh>
                {/* Front panel */}
                <mesh position={[0, 0.22, 0.162]}>
                    <boxGeometry args={[0.38, 0.40, 0.004]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.2} />
                </mesh>
                {/* Top lid */}
                <mesh position={[0, 0.445, 0]}>
                    <boxGeometry args={[0.42, 0.014, 0.32]} />
                    <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.08} />
                </mesh>
                {/* Boiler dome */}
                <mesh position={[0.09, 0.465, 0.03]}>
                    <cylinderGeometry args={[0.058, 0.058, 0.06, 16]} />
                    <meshStandardMaterial color="#374151" metalness={0.95} roughness={0.1} />
                </mesh>
                {/* Pressure gauge */}
                <mesh position={[0.15, 0.31, 0.165]}>
                    <circleGeometry args={[0.044, 18]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.3} />
                </mesh>
                <mesh position={[0.15, 0.31, 0.166]}>
                    <ringGeometry args={[0.040, 0.047, 18]} />
                    <meshBasicMaterial color="#d97706" toneMapped={false} />
                </mesh>
                <mesh position={[0.15, 0.322, 0.167]} rotation={[0, 0, -0.55]}>
                    <boxGeometry args={[0.002, 0.030, 0.001]} />
                    <meshBasicMaterial color="#ef4444" toneMapped={false} />
                </mesh>
                {/* OLED display */}
                <mesh position={[-0.08, 0.31, 0.164]}>
                    <boxGeometry args={[0.09, 0.056, 0.003]} />
                    <meshBasicMaterial color="#042f2e" toneMapped={false} />
                </mesh>
                <mesh position={[-0.08, 0.31, 0.165]}>
                    <boxGeometry args={[0.082, 0.048, 0.001]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                </mesh>
                {/* Control knobs */}
                {([-0.12, 0.12] as number[]).map((kx, ki) => (
                    <group key={ki} position={[kx, 0.13, 0.165]}>
                        <mesh>
                            <cylinderGeometry args={[0.026, 0.026, 0.02, 14]} />
                            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
                        </mesh>
                        <mesh position={[0, 0.011, 0.016]} rotation={[Math.PI / 2, 0, 0]}>
                            <boxGeometry args={[0.003, 0.009, 0.001]} />
                            <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                        </mesh>
                    </group>
                ))}
                {/* Group-head */}
                <mesh position={[0, 0.065, 0.165]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.058, 0.058, 0.020, 18]} />
                    <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.04} />
                </mesh>
                {/* Portafilter collar */}
                <mesh position={[0, 0.022, 0.165]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.048, 0.048, 0.022, 16]} />
                    <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.08} />
                </mesh>
                {/* Portafilter handle */}
                <mesh position={[0, -0.072, 0.180]} rotation={[0.45, 0, 0]}>
                    <cylinderGeometry args={[0.016, 0.012, 0.16, 10]} />
                    <meshStandardMaterial color="#1e293b" roughness={0.5} />
                </mesh>
                {/* Dual spouts */}
                {([-0.020, 0.020] as number[]).map((sx, si) => (
                    <mesh key={si} position={[sx, -0.056, 0.178]} rotation={[0.75, 0, 0]}>
                        <cylinderGeometry args={[0.005, 0.005, 0.048, 8]} />
                        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
                    </mesh>
                ))}
                {/* Drip tray */}
                <mesh position={[0, -0.012, 0.055]}>
                    <boxGeometry args={[0.26, 0.016, 0.20]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
                </mesh>
                <mesh position={[0, -0.002, 0.055]}>
                    <boxGeometry args={[0.25, 0.007, 0.19]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
                </mesh>
                {/* Espresso cup */}
                <group position={[0, 0.008, 0.065]}>
                    <mesh>
                        <cylinderGeometry args={[0.026, 0.020, 0.038, 12]} />
                        <meshStandardMaterial color="#f8fafc" roughness={0.25} />
                    </mesh>
                    <mesh position={[0, 0.019, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <circleGeometry args={[0.024, 12]} />
                        <meshBasicMaterial color="#3d1505" />
                    </mesh>
                </group>
                {/* Steam wand */}
                <group position={[-0.228, 0.26, 0.04]}>
                    <mesh rotation={[0, 0, 0.42]}>
                        <cylinderGeometry args={[0.008, 0.008, 0.20, 10]} />
                        <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
                    </mesh>
                    <mesh position={[-0.044, -0.084, 0]}>
                        <cylinderGeometry args={[0.011, 0.007, 0.028, 10]} />
                        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.15} />
                    </mesh>
                    <points position={[-0.048, -0.06, 0]} geometry={steamGeo}>
                        <pointsMaterial color="#ffffff" size={0.025} transparent opacity={0.28} toneMapped={false} />
                    </points>
                </group>
                {/* Its point light was removed â€” the counter is now lit by the single overhead
                    pendant below, which is one of the room's 5 accent lights ("above coffee table"). */}
            </group>

            {/* WALL SHELF */}
            <group position={[0, 1.50, -0.22]}>
                <mesh receiveShadow>
                    <boxGeometry args={[0.90, 0.030, 0.20]} />
                    <meshStandardMaterial color="#6a4c33" roughness={0.5} />
                </mesh>
                <mesh position={[0, -0.016, 0.07]}>
                    <boxGeometry args={[0.86, 0.010, 0.016]} />
                    <meshBasicMaterial color="#ffb703" toneMapped={false} />
                </mesh>
                {([-0.30, -0.14, 0.16] as number[]).map((mx, idx) => (
                    <group key={idx} position={[mx, 0.052, 0]}>
                        <mesh>
                            <cylinderGeometry args={[0.040, 0.034, 0.062, 12]} />
                            <meshStandardMaterial color={idx === 1 ? '#f8fafc' : '#1e293b'} roughness={0.3} />
                        </mesh>
                    </group>
                ))}
                <group position={[0.36, 0.080, 0]}>
                    <mesh>
                        <cylinderGeometry args={[0.043, 0.043, 0.12, 14]} />
                        <meshStandardMaterial color="#ffffff" transparent opacity={0.4} roughness={0.1} />
                    </mesh>
                    <mesh position={[0, -0.018, 0]}>
                        <cylinderGeometry args={[0.039, 0.039, 0.075, 12]} />
                        <meshStandardMaterial color="#451a03" roughness={0.85} />
                    </mesh>
                    <mesh position={[0, 0.065, 0]}>
                        <cylinderGeometry args={[0.045, 0.045, 0.016, 14]} />
                        <meshStandardMaterial color="#a16207" roughness={0.4} metalness={0.6} />
                    </mesh>
                </group>
            </group>

            {/* PENDANT LIGHT â€” one of the room's 5 accent lights ("above coffee table") */}
            <group>
                <mesh position={[0, 2.65, 0]}>
                    <cylinderGeometry args={[0.060, 0.060, 0.018, 14]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[0, 2.27, 0]}>
                    <cylinderGeometry args={[0.004, 0.004, 0.70, 6]} />
                    <meshStandardMaterial color="#020617" roughness={0.9} />
                </mesh>
                <mesh position={[0, 1.92, 0]}>
                    <cylinderGeometry args={[0.028, 0.028, 0.052, 14]} />
                    <meshStandardMaterial color="#eab308" metalness={0.92} roughness={0.15} />
                </mesh>
                <mesh position={[0, 1.85, 0]}>
                    <coneGeometry args={[0.19, 0.15, 20, 1, true]} />
                    <meshStandardMaterial color="#ca8a04" metalness={0.88} roughness={0.22} side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0, 1.79, 0]}>
                    <sphereGeometry args={[0.044, 14, 14]} />
                    <meshBasicMaterial color="#fffbeb" toneMapped={false} />
                </mesh>
                <pointLight color="#fef3c7" intensity={4.5} distance={3.6} decay={1.8} position={[0, 1.72, 0.05]} />
            </group>
        </group>
    );
});

// -------------------------------------------------------------
// -------------------------------------------------------------
// SUB-COMPONENT: Designer Elevated Platform Bed & Slatted Headboard
// -------------------------------------------------------------
const CyberBedAndChillZone = React.memo(function CyberBedAndChillZone() {
    return (
        <group position={[-2.65, 0, 1.15]} rotation={[0, Math.PI / 2, 0]}>
            {/* ── 1. TAPERED ARCHITECTURAL LEGS (14cm clear air gap from floor/carpet) ── */}
            {/* 4 Corner Legs + 2 Mid-span Support Legs */}
            {[
                [-0.64, -1.02],
                [0.64, -1.02],
                [-0.64, 1.02],
                [0.64, 1.02],
                [-0.64, 0.0],
                [0.64, 0.0],
            ].map(([lx, lz], i) => (
                <group key={i} position={[lx, 0.07, lz]}>
                    {/* Tapered Matte Charcoal Steel Leg */}
                    <mesh>
                        <cylinderGeometry args={[0.022, 0.014, 0.14, 14]} />
                        <meshStandardMaterial color="#1a1815" roughness={0.4} metalness={0.8} />
                    </mesh>
                    {/* Brushed Champagne Brass Foot Ferrule */}
                    <mesh position={[0, -0.052, 0]}>
                        <cylinderGeometry args={[0.016, 0.014, 0.036, 14]} />
                        <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.25} />
                    </mesh>
                </group>
            ))}

            {/* ── 2. UNDERBED ARCHITECTURAL FLOATING GLOW ── */}
            {/* Creates unmistakable visual separation and floating depth above floor */}
            <mesh position={[0, 0.138, 0]}>
                <boxGeometry args={[1.36, 0.012, 2.18]} />
                <meshBasicMaterial color="#f59e0b" toneMapped={false} transparent opacity={0.35} />
            </mesh>
            <pointLight color="#fed7aa" intensity={0.8} distance={1.8} decay={2} position={[0, 0.07, 0]} />

            {/* ── 3. ELEVATED SOLID OAK PLATFORM BED FRAME (y = 0.14 to 0.26) ── */}
            <mesh receiveShadow position={[0, 0.20, 0]}>
                <boxGeometry args={[1.46, 0.12, 2.26]} />
                <meshStandardMaterial color="#4e3524" roughness={0.55} />
            </mesh>
            {/* Warm Inset Border Reveal / Shadow Rail */}
            <mesh position={[0, 0.145, 0]}>
                <boxGeometry args={[1.48, 0.016, 2.28]} />
                <meshStandardMaterial color="#2d1c10" roughness={0.8} />
            </mesh>
            {/* Top Perimeter Beveled Border Lip */}
            <mesh position={[0, 0.265, 0]}>
                <boxGeometry args={[1.46, 0.015, 2.26]} />
                <meshStandardMaterial color="#5c4033" roughness={0.5} />
            </mesh>

            {/* ── 4. DESIGNER SLATTED OAK & BOUCLÉ UPHOLSTERED HEADBOARD (Anchors bed to wall) ── */}
            <group position={[0, 0.58, -1.13]}>
                {/* Backing Wood Frame Panel */}
                <mesh receiveShadow>
                    <boxGeometry args={[1.62, 0.92, 0.07]} />
                    <meshStandardMaterial color="#3d281a" roughness={0.6} />
                </mesh>
                {/* Fluted Vertical Slat Accent Stripes */}
                {[-0.72, -0.62, -0.52, 0.52, 0.62, 0.72].map((sx, idx) => (
                    <mesh key={idx} position={[sx, 0, 0.038]}>
                        <boxGeometry args={[0.035, 0.90, 0.015]} />
                        <meshStandardMaterial color="#543722" roughness={0.5} />
                    </mesh>
                ))}
                {/* Plush Center Padded Bouclé Upholstered Insert */}
                <mesh position={[0, 0.02, 0.042]}>
                    <boxGeometry args={[0.96, 0.76, 0.035]} />
                    <meshStandardMaterial color="#f5f0e8" roughness={0.92} />
                </mesh>
                {/* Headboard Top Crown Shelf */}
                <mesh position={[0, 0.465, 0]}>
                    <boxGeometry args={[1.66, 0.025, 0.09]} />
                    <meshStandardMaterial color="#5c4033" roughness={0.45} />
                </mesh>
                {/* Subtle Headboard Top Ambient LED Glow Strip */}
                <mesh position={[0, 0.48, -0.02]}>
                    <boxGeometry args={[1.56, 0.008, 0.012]} />
                    <meshBasicMaterial color="#fed7aa" toneMapped={false} />
                </mesh>
            </group>

            {/* ── 5. DEEP ORGANIC LINEN MATTRESS (y = 0.25 to 0.46) ── */}
            <mesh position={[0, 0.355, 0.05]}>
                <boxGeometry args={[1.34, 0.21, 2.12]} />
                <meshStandardMaterial color="#faf8f5" roughness={0.88} />
            </mesh>
            {/* Quilted Mattress Border Welt Seam */}
            <mesh position={[0, 0.455, 0.05]}>
                <boxGeometry args={[1.35, 0.012, 2.13]} />
                <meshStandardMaterial color="#e5ded2" roughness={0.9} />
            </mesh>

            {/* ── 6. PLUSH DRAPED SCANDINAVIAN DUVET & FOLDED TOP SHEET ── */}
            {/* Crisp White Folded Top Sheet at Upper Chest */}
            <mesh position={[0, 0.468, -0.32]}>
                <boxGeometry args={[1.32, 0.025, 0.22]} />
                <meshStandardMaterial color="#ffffff" roughness={0.85} />
            </mesh>
            {/* Fluffy Warm Oatmeal Waffle Linen Comforter */}
            <mesh position={[0, 0.485, 0.36]}>
                <boxGeometry args={[1.36, 0.075, 1.44]} />
                <meshStandardMaterial color="#ebe3d6" roughness={0.92} />
            </mesh>
            {/* Draped Side Flange Left */}
            <mesh position={[-0.67, 0.445, 0.36]} rotation={[0, 0, 0.28]}>
                <boxGeometry args={[0.07, 0.07, 1.44]} />
                <meshStandardMaterial color="#e4dbcd" roughness={0.92} />
            </mesh>
            {/* Draped Side Flange Right */}
            <mesh position={[0.67, 0.445, 0.36]} rotation={[0, 0, -0.28]}>
                <boxGeometry args={[0.07, 0.07, 1.44]} />
                <meshStandardMaterial color="#e4dbcd" roughness={0.92} />
            </mesh>

            {/* ── 7. TEXTURED CHARCOAL BED RUNNER / THROW ACROSS FOOT ── */}
            <mesh position={[0, 0.528, 0.88]}>
                <boxGeometry args={[1.37, 0.024, 0.38]} />
                <meshStandardMaterial color="#374151" roughness={0.95} />
            </mesh>
            {/* Folded Layer Detail on Throw */}
            <mesh position={[0, 0.542, 0.93]}>
                <boxGeometry args={[1.35, 0.014, 0.20]} />
                <meshStandardMaterial color="#4b5563" roughness={0.92} />
            </mesh>

            {/* ── 8. MULTI-LAYERED FLUFFY BED PILLOWS & ACCENT CUSHIONS ── */}
            {/* Back King Sleeping Pillows (Crisp White Linen, propped against headboard) */}
            <mesh position={[0.33, 0.52, -0.80]} rotation={[0.24, 0, 0]}>
                <boxGeometry args={[0.50, 0.15, 0.32]} />
                <meshStandardMaterial color="#faf8f5" roughness={0.8} />
            </mesh>
            <mesh position={[-0.33, 0.52, -0.80]} rotation={[0.24, 0, 0]}>
                <boxGeometry args={[0.50, 0.15, 0.32]} />
                <meshStandardMaterial color="#faf8f5" roughness={0.8} />
            </mesh>
            {/* Front Accent Sham Pillows (Sage Green & Warm Clay) */}
            <mesh position={[0.30, 0.55, -0.60]} rotation={[0.30, 0, 0]}>
                <boxGeometry args={[0.40, 0.13, 0.24]} />
                <meshStandardMaterial color="#3f503d" roughness={0.88} />
            </mesh>
            <mesh position={[-0.30, 0.55, -0.60]} rotation={[0.30, 0, 0]}>
                <boxGeometry args={[0.40, 0.13, 0.24]} />
                <meshStandardMaterial color="#c2785c" roughness={0.88} />
            </mesh>
            {/* Center Cylindrical Lumbar Throw Pillow */}
            <mesh position={[0, 0.54, -0.48]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.055, 0.055, 0.38, 16]} />
                <meshStandardMaterial color="#e5ded4" roughness={0.9} />
            </mesh>

            {/* ── 9. ELEVATED SOLID WALNUT NIGHTSTAND (with matching tapered legs) ── */}
            <group position={[0.98, 0, -0.80]}>
                {/* Slim Tapered Nightstand Legs */}
                {[
                    [-0.15, -0.15],
                    [0.15, -0.15],
                    [-0.15, 0.15],
                    [0.15, 0.15],
                ].map(([nx, nz], i) => (
                    <mesh key={i} position={[nx, 0.07, nz]}>
                        <cylinderGeometry args={[0.014, 0.009, 0.14, 10]} />
                        <meshStandardMaterial color="#1a1815" metalness={0.8} roughness={0.3} />
                    </mesh>
                ))}
                {/* Nightstand Main Cabinet Body */}
                <mesh position={[0, 0.34, 0]}>
                    <boxGeometry args={[0.38, 0.40, 0.40]} />
                    <meshStandardMaterial color="#422c1b" roughness={0.5} />
                </mesh>
                {/* Drawer Front Divider & Brushed Brass Pull */}
                <mesh position={[0, 0.34, 0.202]}>
                    <boxGeometry args={[0.34, 0.16, 0.008]} />
                    <meshStandardMaterial color="#4e3523" roughness={0.55} />
                </mesh>
                <mesh position={[0, 0.34, 0.215]}>
                    <boxGeometry args={[0.08, 0.012, 0.012]} />
                    <meshStandardMaterial color="#d97706" metalness={0.92} roughness={0.2} />
                </mesh>

                {/* Ceramic Water Carafe & Tumbler on Nightstand */}
                <mesh position={[-0.06, 0.60, -0.06]}>
                    <cylinderGeometry args={[0.038, 0.048, 0.15, 16]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.2} />
                </mesh>
                <mesh position={[0.07, 0.57, 0.06]}>
                    <cylinderGeometry args={[0.026, 0.026, 0.07, 12]} />
                    <meshStandardMaterial color="#e2e8f0" roughness={0.1} />
                </mesh>
                {/* Bedside Hardcover Journal / Book */}
                <mesh position={[-0.04, 0.55, 0.08]} rotation={[0, 0.15, 0]}>
                    <boxGeometry args={[0.14, 0.022, 0.18]} />
                    <meshStandardMaterial color="#2d3748" roughness={0.7} />
                </mesh>
            </group>

            {/* ── 10. HANGING PENDANT LIGHT ABOVE THE BED ── */}
            <group position={[0, 2.35, 0.1]}>
                <mesh>
                    <cylinderGeometry args={[0.045, 0.045, 0.014, 14]} />
                    <meshStandardMaterial color="#3d2b1c" metalness={0.6} roughness={0.35} />
                </mesh>
                <mesh position={[0, -0.28, 0]}>
                    <cylinderGeometry args={[0.004, 0.004, 0.56, 6]} />
                    <meshStandardMaterial color="#241812" roughness={0.85} />
                </mesh>
                <mesh position={[0, -0.58, 0]}>
                    <coneGeometry args={[0.16, 0.13, 18, 1, true]} />
                    <meshStandardMaterial color="#a3672b" metalness={0.4} roughness={0.45} side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0, -0.64, 0]}>
                    <sphereGeometry args={[0.038, 14, 14]} />
                    <meshBasicMaterial color="#fff7ed" toneMapped={false} />
                </mesh>
                <pointLight color="#fed7aa" intensity={3.2} distance={3.0} decay={2} position={[0, -0.66, 0]} />
            </group>
        </group>
    );
});

// -------------------------------------------------------------
// SUB-COMPONENT: Minimalist Floor Standing Lamp (Single Light in Corner)
// Tucked into the front-left corner beside the bed near the screen
// -------------------------------------------------------------
const ArchitecturalStandingLamp = React.memo(function ArchitecturalStandingLamp() {
    return (
        <group position={[-2.95, 0, 2.70]}>
            {/* Weighted Nero Marquina Marble Circular Base */}
            <mesh receiveShadow position={[0, 0.022, 0]}>
                <cylinderGeometry args={[0.20, 0.22, 0.044, 28]} />
                <meshStandardMaterial color="#0f1117" roughness={0.3} metalness={0.15} />
            </mesh>
            {/* Brushed Brass Perimeter Trim Ring */}
            <mesh position={[0, 0.044, 0]}>
                <torusGeometry args={[0.205, 0.007, 12, 28]} />
                <meshStandardMaterial color="#b45309" metalness={0.92} roughness={0.2} />
            </mesh>
            {/* Brass Foot Tap Switch Button */}
            <mesh position={[0.10, 0.050, 0.07]}>
                <cylinderGeometry args={[0.016, 0.016, 0.014, 16]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.25} />
            </mesh>

            {/* Single Slender Vertical Architectural Bronze Stem */}
            <mesh position={[0, 0.82, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 1.60, 16]} />
                <meshStandardMaterial color="#1f1813" metalness={0.85} roughness={0.3} />
            </mesh>

            {/* Brass Shade Mount Knuckle Collar */}
            <mesh position={[0, 1.62, 0]}>
                <cylinderGeometry args={[0.020, 0.020, 0.035, 16]} />
                <meshStandardMaterial color="#b45309" metalness={0.92} roughness={0.2} />
            </mesh>

            {/* Single Fluted Architectural Lampshade */}
            <group position={[0, 1.68, 0]}>
                {/* Conical Lampshade Exterior */}
                <mesh>
                    <cylinderGeometry args={[0.10, 0.24, 0.22, 24, 1, true]} />
                    <meshStandardMaterial
                        color="#faf5ee"
                        roughness={0.85}
                        side={THREE.DoubleSide}
                    />
                </mesh>
                {/* Brushed Brass Top Finial Ring */}
                <mesh position={[0, 0.11, 0]}>
                    <cylinderGeometry args={[0.025, 0.025, 0.02, 16]} />
                    <meshStandardMaterial color="#b45309" metalness={0.92} roughness={0.2} />
                </mesh>
                {/* Warm Frosted Opal Glass Diffuser Bulb */}
                <mesh position={[0, -0.04, 0]}>
                    <sphereGeometry args={[0.055, 18, 18]} />
                    <meshBasicMaterial color="#fffbeb" toneMapped={false} />
                </mesh>
                {/* Single Cozy Warm Downward Ambient Light */}
                <pointLight
                    color="#fef3c7"
                    intensity={2.6}
                    distance={3.4}
                    decay={2}
                    position={[0, -0.06, 0]}
                />
            </group>
        </group>
    );
});

// -------------------------------------------------------------
// SUB-COMPONENT: Architectural Ceiling Ventilation & Ambient Beam
// -------------------------------------------------------------
const IndustrialCeilingVent = React.memo(function IndustrialCeilingVent() {
    const fanRef = useRef<THREE.Group>(null);

    useFrame((_, delta) => {
        if (fanRef.current) {
            fanRef.current.rotation.z += delta * 2.8;
        }
    });

    return (
        <group position={[0, 3.48, 0]}>
            {/* Vent Housing in Architectural Dark Walnut */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1.3, 0.15, 1.3]} />
                <meshStandardMaterial color="#382517" roughness={0.5} />
            </mesh>

            {/* Circular Vent Opening */}
            <mesh position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.42, 0.52, 24]} />
                <meshStandardMaterial color="#2d1c10" roughness={0.6} />
            </mesh>

            {/* 4-Blade Rotating Fan */}
            <group ref={fanRef} position={[0, -0.05, 0]}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
                        <boxGeometry args={[0.12, 0.44, 0.02]} />
                        <meshStandardMaterial color="#22150c" roughness={0.6} />
                    </mesh>
                ))}
            </group>

            {/* Warm Golden Spotlight removed - expensive shadow pass, fan is too high to notice */}
        </group>
    );
});

// -------------------------------------------------------------
// SUB-COMPONENT: Upper Wall Copper Conduits & Warm Accents
// -------------------------------------------------------------
const WallPipelinesAndConduits = React.memo(function WallPipelinesAndConduits() {
    return (
        <group>
            {/* Main Brushed Copper Pipe across back wall */}
            <mesh position={[0, 3.2, -3.38]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.075, 0.075, 7.0, 16]} />
                <meshStandardMaterial color="#784c28" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Pipe Couplings with Brass Rings */}
            {[-2.2, -0.7, 0.8, 2.3].map((x, i) => (
                <mesh key={i} position={[x, 3.2, -3.38]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.095, 0.095, 0.08, 16]} />
                    <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
                </mesh>
            ))}

            {/* The "Warm Ambient Conduit Accents along left wall" used to live here: two thin
                emissive rods 6.8 units long centered at y=3.05/2.96 â€” spanning from y=-0.35 (below
                the floor) to y=6.45 (nearly double the room's own ~3.6 ceiling height). They read
                as a giant glowing amber/green pole poking through the floor and ceiling. Removed. */}
        </group>
    );
});

// -------------------------------------------------------------
// SUB-COMPONENT: Small Collectible Anime Figurine (generic stylized pose/colorway â€”
// not any specific copyrighted character, just a "collectible figure on a display base" look)
// -------------------------------------------------------------
function AnimeFigurine({
    position,
    primary,
    accent,
    cape,
}: {
    position: [number, number, number];
    primary: string;
    accent: string;
    cape: string;
}) {
    return (
        <group position={position}>
            {/* Round Display Base */}
            <mesh>
                <cylinderGeometry args={[0.032, 0.032, 0.006, 16]} />
                <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.3} />
            </mesh>
            {/* Legs in a slight action stance */}
            <mesh position={[-0.009, 0.03, 0]} rotation={[0, 0, 0.12]}>
                <cylinderGeometry args={[0.007, 0.008, 0.05, 8]} />
                <meshStandardMaterial color={primary} roughness={0.45} />
            </mesh>
            <mesh position={[0.009, 0.028, 0]} rotation={[0, 0, -0.2]}>
                <cylinderGeometry args={[0.007, 0.008, 0.05, 8]} />
                <meshStandardMaterial color={primary} roughness={0.45} />
            </mesh>
            {/* Torso */}
            <mesh position={[0, 0.07, 0]} rotation={[0, 0, 0.08]}>
                <boxGeometry args={[0.026, 0.05, 0.016]} />
                <meshStandardMaterial color={primary} roughness={0.4} />
            </mesh>
            {/* Chest Accent Emblem */}
            <mesh position={[0, 0.075, 0.009]}>
                <circleGeometry args={[0.008, 12]} />
                <meshBasicMaterial color={accent} toneMapped={false} />
            </mesh>
            {/* Raised Arm (action pose) */}
            <mesh position={[0.016, 0.1, 0]} rotation={[0, 0, -1.1]}>
                <cylinderGeometry args={[0.006, 0.006, 0.045, 8]} />
                <meshStandardMaterial color={primary} roughness={0.45} />
            </mesh>
            {/* Lowered Arm */}
            <mesh position={[-0.015, 0.06, 0]} rotation={[0, 0, 0.35]}>
                <cylinderGeometry args={[0.006, 0.006, 0.045, 8]} />
                <meshStandardMaterial color={primary} roughness={0.45} />
            </mesh>
            {/* Head */}
            <mesh position={[0.002, 0.115, 0]}>
                <sphereGeometry args={[0.014, 12, 12]} />
                <meshStandardMaterial color="#d4a373" roughness={0.6} />
            </mesh>
            {/* Hair / Mask Accent */}
            <mesh position={[0.002, 0.121, -0.003]}>
                <sphereGeometry args={[0.0145, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
                <meshStandardMaterial color={accent} roughness={0.4} />
            </mesh>
            {/* Flowing Cape Accent */}
            <mesh position={[0, 0.06, -0.014]} rotation={[0.25, 0, 0]}>
                <boxGeometry args={[0.028, 0.08, 0.004]} />
                <meshStandardMaterial color={cape} roughness={0.6} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Two-Tier Collector's Figurine Display Pedestal
// -------------------------------------------------------------
const SideTableWithFigurines = React.memo(function SideTableWithFigurines() {
    return (
        // Positioned beside the battlestation desk under the warm wall light panel, fully visible
        <group position={[2.15, 0, -2.70]}>
            {/* 1. ARCHITECTURAL TWO-TIER DISPLAY FRAMEWORK (Height ~0.84m) */}
            {/* 4 Sleek Brushed Aluminum & Dark Oak Structural Columns */}
            {[
                [-0.20, -0.20],
                [0.20, -0.20],
                [-0.20, 0.20],
                [0.20, 0.20],
            ].map(([cx, cz], i) => (
                <group key={i} position={[cx, 0, cz]}>
                    <mesh position={[0, 0.42, 0]}>
                        <cylinderGeometry args={[0.016, 0.018, 0.84, 12]} />
                        <meshStandardMaterial color="#1e2433" metalness={0.9} roughness={0.2} />
                    </mesh>
                    {/* Polished Brass Shelf Collars */}
                    <mesh position={[0, 0.40, 0]}>
                        <cylinderGeometry args={[0.024, 0.024, 0.02, 12]} />
                        <meshStandardMaterial color="#eab308" metalness={0.95} roughness={0.15} />
                    </mesh>
                    <mesh position={[0, 0.80, 0]}>
                        <cylinderGeometry args={[0.024, 0.024, 0.02, 12]} />
                        <meshStandardMaterial color="#eab308" metalness={0.95} roughness={0.15} />
                    </mesh>
                    {/* Bottom isolation foot */}
                    <mesh position={[0, 0.008, 0]}>
                        <cylinderGeometry args={[0.022, 0.022, 0.016, 12]} />
                        <meshStandardMaterial color="#090d16" roughness={0.8} />
                    </mesh>
                </group>
            ))}

            {/* LOWER TIER (SHELF 1 at y = 0.40m) */}
            <group position={[0, 0.40, 0]}>
                {/* Dark Walnut Lower Shelf Deck */}
                <mesh receiveShadow>
                    <cylinderGeometry args={[0.30, 0.29, 0.024, 24]} />
                    <meshStandardMaterial color="#3e2a1b" roughness={0.5} />
                </mesh>
                {/* Brass Beveled Inset Ring */}
                <mesh position={[0, 0.013, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.26, 0.28, 24]} />
                    <meshStandardMaterial color="#eab308" metalness={0.92} roughness={0.15} />
                </mesh>

                {/* FIGURINE 4: Crimson Berserker */}
                <AnimeFigurine position={[-0.14, 0.015, 0.04]} primary="#b91c1c" accent="#ea580c" cape="#450a0a" />

                {/* FIGURINE 5: Azure Sorceress with Staff */}
                <AnimeFigurine position={[0.12, 0.015, 0.06]} primary="#1e40af" accent="#67e8f9" cape="#172554" />

                {/* FIGURINE 6: Emerald Scout */}
                <AnimeFigurine position={[0, 0.015, -0.14]} primary="#15803d" accent="#86efac" cape="#052e16" />

                {/* Manga Volume Stack on Lower Shelf */}
                <group position={[-0.12, 0.015, -0.10]} rotation={[0, 0.45, 0]}>
                    {[0, 1, 2, 3].map((i) => (
                        <mesh key={i} position={[0, i * 0.016 + 0.008, 0]}>
                            <boxGeometry args={[0.095, 0.014, 0.135]} />
                            <meshStandardMaterial color={['#ef4444', '#f59e0b', '#06b6d4', '#8b5cf6'][i]} roughness={0.5} />
                        </mesh>
                    ))}
                </group>
            </group>

            {/* TOP TIER (SHELF 2 at y = 0.81m) */}
            <group position={[0, 0.81, 0]}>
                {/* Solid Warm Oak Frame Ring */}
                <mesh receiveShadow>
                    <cylinderGeometry args={[0.32, 0.31, 0.026, 28]} />
                    <meshStandardMaterial color="#6a4c33" roughness={0.45} />
                </mesh>
                {/* Smoked Tempered Glass Center Inset */}
                <mesh position={[0, 0.014, 0]}>
                    <cylinderGeometry args={[0.28, 0.28, 0.004, 28]} />
                    <meshPhysicalMaterial
                        color="#0f172a"
                        transparent
                        opacity={0.7}
                        roughness={0.08}
                        metalness={0.2}
                        transmission={0.4}
                    />
                </mesh>
                {/* Under-Tier Warm Showcase Ambient Glow washing over Lower Shelf */}
                <pointLight color="#fde68a" intensity={1.8} distance={1.2} decay={2} position={[0, -0.05, 0]} />

                {/* FIGURINE 1 (Center Hero): Golden Samurai / Ronin */}
                <AnimeFigurine position={[0, 0.016, 0.08]} primary="#dc2626" accent="#facc15" cape="#7f1d1d" />

                {/* FIGURINE 2 (Left): Cyber Tech-Ninja */}
                <AnimeFigurine position={[-0.14, 0.016, -0.04]} primary="#0284c7" accent="#00f5d4" cape="#0f172a" />

                {/* FIGURINE 3 (Right): Dark Knight Mecha */}
                <AnimeFigurine position={[0.14, 0.016, -0.04]} primary="#4c1d95" accent="#ec4899" cape="#1e1b4b" />

                {/* Collector's Acrylic Trophy Stand & Plaque */}
                <mesh position={[0, 0.022, -0.12]}>
                    <boxGeometry args={[0.10, 0.03, 0.02]} />
                    <meshStandardMaterial color="#eab308" metalness={0.92} roughness={0.15} />
                </mesh>
            </group>
        </group>
    );
});

// -------------------------------------------------------------
// SUB-COMPONENT: Shelves, Collectibles & Neon "THAT'S ME" Sign
// -------------------------------------------------------------
const CyberRoomDecor = React.memo(function CyberRoomDecor() {
    return (
        <group>
            {/* WALL SIGN: "THAT'S ME // RAY OS" (BACK WALL, next to the window) — steady warm glow */}
            <group position={[-2.0, 2.7, -3.45]}>
                <mesh>
                    <boxGeometry args={[1.6, 0.45, 0.02]} />
                    <meshStandardMaterial color="#050810" roughness={0.9} />
                </mesh>
                <mesh position={[0, 0, 0.015]}>
                    <planeGeometry args={[1.54, 0.4]} />
                    <meshBasicMaterial color="#fde68a" transparent opacity={0.85} toneMapped={false} />
                </mesh>
                {/* One extra accent light, added on request to warmly light this window-side
                    corner where the flickering sign used to be. */}
                <pointLight color="#fde68a" intensity={2.2} distance={2.6} decay={2} position={[0, -0.1, 0.4]} />
            </group>

            {/* MATCHING RECTANGULAR LIGHT PANEL on the opposite side of the window/curtain
                (mirrored x, exact same box + glow-plane dimensions as the panel above) â€” gives
                the curtained window a symmetric pair of warm light panels flanking it. */}
            <group position={[2.0, 2.7, -3.45]}>
                <mesh>
                    <boxGeometry args={[1.6, 0.45, 0.02]} />
                    <meshStandardMaterial color="#050810" roughness={0.9} />
                </mesh>
                <mesh position={[0, 0, 0.015]}>
                    <planeGeometry args={[1.54, 0.4]} />
                    <meshBasicMaterial color="#fde68a" transparent opacity={0.85} toneMapped={false} />
                </mesh>
                <pointLight color="#fde68a" intensity={2.2} distance={2.6} decay={2} position={[0, -0.1, 0.4]} />
            </group>

        </group>
    );
});

// -------------------------------------------------------------
// MAIN SCENE ROOT EXPORT
// -------------------------------------------------------------
export default function CyberRoomScene({
    cameraMode,
    onDollyComplete,
    onReturnComplete,
    onTourPoiChange,
    onTourComplete,
    onTourProgress,
    forcedTourIndex,
    currentRoutine,
    onRoutineChange,
    environmentPhase,
    onJackIn,
    onSelectSetup,
    isMenuOpen = false,
}: CyberRoomSceneProps) {
    const isMobile = useIsMobile();
    const monitorTextures = useMemo(() => new MonitorTextures(), []);
    const envConfig = ENVIRONMENT_CONFIGS[environmentPhase];

    // Pause 3D frame rendering when browser tab is inactive to drop GPU consumption to 0%
    const [isTabVisible, setIsTabVisible] = useState(true);
    useEffect(() => {
        const handleVisibility = () => setIsTabVisible(document.visibilityState === 'visible');
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, []);

    useEffect(() => {
        return () => monitorTextures.destroy();
    }, [monitorTextures]);

    function SceneLoop() {
        const { gl } = useThree();

        // Set tone mapping exposure for dark cozy atmosphere
        useEffect(() => {
            gl.toneMappingExposure = 1.25;
        }, [gl]);

        useFrame((state) => {
            monitorTextures.update(state.clock.elapsedTime);
        });
        return null;
    }

    return (
        <div className="w-full h-full relative cursor-default">
            <Canvas
                camera={{ position: [-0.25, 1.68, 3.75], fov: 46 }}
                dpr={isMobile ? [1, 1] : [1, 1.25]}
                performance={{ min: 0.5 }}
                frameloop={cameraMode === 'at_screen' || !isTabVisible ? 'demand' : 'always'}
                gl={{
                    antialias: true,
                    powerPreference: 'high-performance',
                    stencil: false,
                    depth: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                }}
            >
                <SceneLoop />
                <AdaptiveDpr pixelated={false} />
                <AdaptiveEvents />

                {/* Camera Choreography (Locked manual orbit, guided room tour, or first-person roam) */}
                <CameraController
                    mode={cameraMode}
                    onDollyComplete={onDollyComplete}
                    onReturnComplete={onReturnComplete}
                    onTourPoiChange={onTourPoiChange}
                    onTourComplete={onTourComplete}
                    onTourProgress={onTourProgress}
                    forcedTourIndex={forcedTourIndex}
                />

                {/* Realistic Contact Shadows for all objects - cached to 1 frame for high FPS */}
                <ContactShadows
                    position={[0, 0.003, 0]}
                    opacity={0.75}
                    scale={10}
                    blur={2.0}
                    far={4.5}
                    resolution={512}
                    frames={1}
                    color="#000000"
                />

                {/* Dynamic Ambient & Sun Atmospheric Lighting */}
                <ambientLight intensity={envConfig.ambientIntensity} color={envConfig.ambientColor} />
                <directionalLight
                    position={envConfig.sunPosition}
                    intensity={envConfig.sunIntensity}
                    color={envConfig.sunColor}
                />

                {/* Real Architectural Room: Hardwood Parquet, Acoustic Slat Walls, Rafter Ceiling, Loft Window */}
                <ArchitecturalRoom environmentPhase={environmentPhase} />
                <WallPipelinesAndConduits />
                <IndustrialCeilingVent />

                {/* Battlestation: Desk, Dual Monitors, Custom Liquid-Cooled PC Cabinet */}
                <BattlestationDesk />
                <BattlestationMonitors monitorTextures={monitorTextures} />
                <CpuCabinet />

                {/* Mini Fridge & Snacks Counter beside the desk in the empty corner */}
                <MiniFridgeAndSnacksCounter
                    currentRoutine={currentRoutine}
                    onRoutineChange={onRoutineChange}
                />

                {/* Autonomous Character Simulation (Aditya Ray) */}
                <CyberCharacter currentRoutine={currentRoutine} onRoutineChange={onRoutineChange} />


                {/* Night Window (curtained — see ArchitecturalRoom for the closed curtain + wall-wash light) */}
                <DynamicAtmosphereWindow />

                {/* Coffee Station / Espresso Bar */}
                <CoffeeStation />

                {/* Cyber Futon Bed & Chill Zone */}
                <CyberBedAndChillZone />

                {/* Designer Architectural Arc Floor Standing Lamp & Planter (covers foreground space beside bed) */}
                <ArchitecturalStandingLamp />

                {/* Shelves & Decor */}
                <CyberRoomDecor />

                {/* Side Table with Anime Figurine Collection (open floor nook in front of the window) */}
                <SideTableWithFigurines />

                {/* Modern Lounge Chill Zone & Streetwear Decor (Options 1 & 4) */}
                <LoungeAndMediaZone
                    currentRoutine={currentRoutine}
                    onRoutineChange={onRoutineChange}
                />

                {/* 3D Floating Interactive POI Markers over Bed, Coffee Stand, Battlestation, Mini Fridge & Lounge */}
                <FloatingPoiMarkers
                    visible={cameraMode === 'orbit' && !isMenuOpen}
                    onSelectSetup={() => {
                        if (onSelectSetup) {
                            onSelectSetup();
                        } else if (currentRoutine !== 'coding' && currentRoutine !== 'returning_to_desk') {
                            onRoutineChange('returning_to_desk', 'Returning to Battlestation...');
                        } else {
                            onJackIn();
                        }
                    }}
                    onSelectCoffee={() => onRoutineChange('walking_to_coffee', 'Heading to Neon Espresso Bar...')}
                    onSelectBed={() => onRoutineChange('walking_to_bed', 'Heading to Cyber Futon to Sleep...')}
                    onSelectFridge={() => {
                        if (currentRoutine !== 'snacking_at_fridge') {
                            onRoutineChange('walking_to_fridge', 'Heading to Cyber Mini Fridge & Snack Bar...');
                        }
                    }}
                    onSelectTv={() => {
                        if (currentRoutine !== 'watching_tv') {
                            onRoutineChange('walking_to_tv', 'Heading to Sofa to Chill...');
                        }
                    }}
                />
            </Canvas>
        </div>
    );
}
