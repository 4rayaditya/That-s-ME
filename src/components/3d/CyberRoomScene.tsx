'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import CyberCharacter, { CharacterRoutine } from './CyberCharacter';
import CameraController, { CameraMode } from './CameraController';
import { MonitorTextures } from './MonitorTextures';
import { EnvironmentPhase, ENVIRONMENT_CONFIGS } from '@/lib/environment';
import FloatingPoiMarkers from './FloatingPoiMarkers';
import ArchitecturalRoom from './ArchitecturalRoom';
import { audio } from '@/lib/audio';

interface CyberRoomSceneProps {
    cameraMode: CameraMode;
    onDollyComplete: () => void;
    onReturnComplete: () => void;
    onTourPoiChange?: (poiName: string, index: number, total: number) => void;
    onTourComplete?: () => void;
    currentRoutine: CharacterRoutine;
    onRoutineChange: (routine: CharacterRoutine, label: string) => void;
    environmentPhase: EnvironmentPhase;
    onJackIn: () => void;
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

            {/* STAND 1: MAIN HORIZONTAL MONITOR STAND (x = 0.22) */}
            <group position={[0.22, 0, 0]}>
                {/* Heavy CNC Machined Aluminum Desktop Base (resting flat on oak table at y = -0.69) */}
                <mesh castShadow receiveShadow position={[0, -0.685, 0.06]}>
                    <boxGeometry args={[0.32, 0.018, 0.24]} />
                    <meshStandardMaterial color="#090e18" metalness={0.92} roughness={0.18} />
                </mesh>
                {/* Beveled Chamfer Trim on Stand Base */}
                <mesh position={[0, -0.674, 0.06]}>
                    <boxGeometry args={[0.30, 0.005, 0.22]} />
                    <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.15} />
                </mesh>
                {/* Solid Vertical Riser Column (from desk to monitor VESA mount) */}
                <mesh castShadow position={[0, -0.34, -0.04]}>
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

            {/* STAND 2: SECOND VERTICAL MONITOR STAND (x = -0.46, angled 0.22 rad) */}
            <group position={[-0.46, 0, 0.04]} rotation={[0, 0.22, 0]}>
                {/* Heavy Aluminum Desktop Base (resting flat on oak table at y = -0.69) */}
                <mesh castShadow receiveShadow position={[0, -0.685, 0.06]}>
                    <boxGeometry args={[0.26, 0.018, 0.22]} />
                    <meshStandardMaterial color="#090e18" metalness={0.92} roughness={0.18} />
                </mesh>
                {/* Beveled Chamfer Trim on Stand Base */}
                <mesh position={[0, -0.674, 0.06]}>
                    <boxGeometry args={[0.24, 0.005, 0.20]} />
                    <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.15} />
                </mesh>
                {/* Solid Vertical Riser Column (from desk to vertical monitor VESA mount) */}
                <mesh castShadow position={[0, -0.32, -0.04]}>
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
            <mesh position={[0.22, 0.02, -0.04]}>
                <boxGeometry args={[0.95, 0.018, 0.01]} />
                <meshBasicMaterial color="#ff1744" toneMapped={false} />
            </mesh>
            <mesh position={[-0.46, 0.04, 0.0]} rotation={[0, 0.22, 0]}>
                <boxGeometry args={[0.015, 0.65, 0.01]} />
                <meshBasicMaterial color="#ff1744" toneMapped={false} />
            </mesh>

            {/* 1. MAIN HORIZONTAL MONITOR (Shorter in length & breadth, clean stealth bezel, Chrome Dino Game) */}
            <group position={[0.22, 0, 0]}>
                {/* Outer Beveled Chassis (Shorter in length & breadth: 1.16 x 0.62) */}
                <mesh castShadow>
                    <boxGeometry args={[1.16, 0.62, 0.055]} />
                    <meshStandardMaterial color="#070b14" metalness={0.88} roughness={0.22} />
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

                {/* Clean Stealth Bezel Frame - No blue rim */}
                <mesh position={[0, 0, 0.029]}>
                    <boxGeometry args={[1.12, 0.58, 0.004]} />
                    <meshStandardMaterial color="#0b0f19" roughness={0.7} metalness={0.5} />
                </mesh>

                {/* Active Screen Surface: Chrome Offline Dragon Game */}
                <mesh position={[0, 0, 0.033]}>
                    <planeGeometry args={[1.10, 0.56]} />
                    <meshBasicMaterial map={monitorTextures.centerTexture} toneMapped={false} />
                </mesh>
            </group>

            {/* 2. SECOND CURVED MONITOR VERTICALLY (Portrait Developer Display, angled close to main monitor) */}
            <group position={[-0.46, 0.04, 0.04]} rotation={[0, 0.22, 0]}>
                {/* Outer Vertical Chassis (Portrait: 0.42 width x 0.78 height) */}
                <mesh castShadow>
                    <boxGeometry args={[0.42, 0.78, 0.055]} />
                    <meshStandardMaterial color="#070b14" metalness={0.88} roughness={0.22} />
                </mesh>

                {/* Vertical Stealth Bezel Frame */}
                <mesh position={[0, 0, 0.029]}>
                    <boxGeometry args={[0.395, 0.755, 0.004]} />
                    <meshStandardMaterial color="#0b0f19" roughness={0.7} metalness={0.5} />
                </mesh>

                {/* Active Screen Surface: Live TypeScript Matrix IDE & Telemetry Screen */}
                <mesh position={[0, 0, 0.033]}>
                    <planeGeometry args={[0.38, 0.74]} />
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
            <mesh receiveShadow castShadow position={[0, 0.72, 0]}>
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
            <mesh castShadow position={[-1.48, 0.36, 0]}>
                <boxGeometry args={[0.08, 0.72, 1.05]} />
                <meshStandardMaterial color="#4a3220" roughness={0.5} />
            </mesh>
            <mesh castShadow position={[1.48, 0.36, 0]}>
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
                <mesh castShadow>
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
                    <mesh castShadow>
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
                                <mesh position={[lx, -0.01, lz]} rotation={[0, angle, 0]} castShadow>
                                    <boxGeometry args={[0.04, 0.025, legLength]} />
                                    <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.25} />
                                </mesh>
                                <mesh position={[wx, -0.025, wz]} castShadow>
                                    <cylinderGeometry args={[0.024, 0.024, 0.025, 12]} />
                                    <meshStandardMaterial color="#020408" roughness={0.7} />
                                </mesh>
                            </group>
                        );
                    })}
                </group>

                {/* Pneumatic Chrome Lift Column */}
                <mesh position={[0, 0.22, 0]} castShadow>
                    <cylinderGeometry args={[0.026, 0.034, 0.3, 16]} />
                    <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.1} />
                </mesh>

                {/* Under-Seat Tilt Mechanism */}
                <mesh position={[0, 0.37, 0]} castShadow>
                    <boxGeometry args={[0.26, 0.05, 0.24]} />
                    <meshStandardMaterial color="#090d16" metalness={0.8} roughness={0.3} />
                </mesh>

                {/* Waterfall-Edge Contoured Seat Pan */}
                <group position={[0, 0.42, 0]}>
                    <mesh castShadow>
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
                    <mesh castShadow position={[0, 0, 0]} rotation={[-0.1, 0, 0]}>
                        <cylinderGeometry args={[0.022, 0.03, 0.52, 12]} />
                        <meshStandardMaterial color="#090d16" metalness={0.85} roughness={0.2} />
                    </mesh>
                    {/* Lumbar Pad */}
                    <mesh position={[0, -0.06, -0.03]}>
                        <boxGeometry args={[0.32, 0.1, 0.04]} />
                        <meshStandardMaterial color="#05080f" roughness={0.7} />
                    </mesh>
                    {/* Breathable Mesh Back Frame */}
                    <mesh castShadow position={[0, 0.12, -0.02]} rotation={[0.06, 0, 0]}>
                        <boxGeometry args={[0.46, 0.46, 0.035]} />
                        <meshStandardMaterial color="#0e1422" roughness={0.7} />
                    </mesh>
                </group>

                {/* 3D Adjustable Armrests */}
                <group position={[-0.26, 0.54, 0.02]}>
                    <mesh castShadow position={[0, -0.06, 0]}>
                        <boxGeometry args={[0.03, 0.18, 0.05]} />
                        <meshStandardMaterial color="#1e293b" metalness={0.8} />
                    </mesh>
                    <mesh castShadow position={[0, 0.04, 0]}>
                        <boxGeometry args={[0.07, 0.03, 0.22]} />
                        <meshStandardMaterial color="#090d16" roughness={0.5} />
                    </mesh>
                </group>
                <group position={[0.26, 0.54, 0.02]}>
                    <mesh castShadow position={[0, -0.06, 0]}>
                        <boxGeometry args={[0.03, 0.18, 0.05]} />
                        <meshStandardMaterial color="#1e293b" metalness={0.8} />
                    </mesh>
                    <mesh castShadow position={[0, 0.04, 0]}>
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
            <mesh castShadow position={[0, 1.4, 0]}>
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
            <mesh position={[0, 2.92, -3.46]} castShadow>
                <boxGeometry args={[3.84, 0.08, 0.12]} />
                <meshStandardMaterial color="#3d2b1c" roughness={0.4} metalness={0.3} />
            </mesh>
            {/* Bottom Frame Beam */}
            <mesh position={[0, 0.88, -3.46]} receiveShadow>
                <boxGeometry args={[3.84, 0.08, 0.12]} />
                <meshStandardMaterial color="#3d2b1c" roughness={0.4} metalness={0.3} />
            </mesh>
            {/* Left Frame Jamb */}
            <mesh position={[-1.88, 1.9, -3.46]} castShadow>
                <boxGeometry args={[0.08, 2.08, 0.12]} />
                <meshStandardMaterial color="#3d2b1c" roughness={0.4} metalness={0.3} />
            </mesh>
            {/* Right Frame Jamb */}
            <mesh position={[1.88, 1.9, -3.46]} castShadow>
                <boxGeometry args={[0.08, 2.08, 0.12]} />
                <meshStandardMaterial color="#3d2b1c" roughness={0.4} metalness={0.3} />
            </mesh>
            {/* Center Slim Vertical Mullion */}
            <mesh position={[0, 1.9, -3.46]} castShadow>
                <boxGeometry args={[0.045, 2.0, 0.08]} />
                <meshStandardMaterial color="#3d2b1c" roughness={0.4} metalness={0.3} />
            </mesh>
            {/* Horizontal Upper Transom Bar */}
            <mesh position={[0, 2.45, -3.46]}>
                <boxGeometry args={[3.72, 0.035, 0.07]} />
                <meshStandardMaterial color="#3d2b1c" roughness={0.4} metalness={0.3} />
            </mesh>

            {/* Dark Night Glass Pane (curtain hangs in front of this) */}
            <mesh position={[0, 1.9, -3.48]}>
                <planeGeometry args={[3.68, 1.96]} />
                <meshStandardMaterial color="#0f172a" transparent opacity={0.45} roughness={0.04} metalness={0.15} />
            </mesh>
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
            <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
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
                <mesh castShadow position={[0, 0.22, 0]}>
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
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[0.90, 0.030, 0.20]} />
                    <meshStandardMaterial color="#6a4c33" roughness={0.5} />
                </mesh>
                <mesh position={[0, -0.016, 0.07]}>
                    <boxGeometry args={[0.86, 0.010, 0.016]} />
                    <meshBasicMaterial color="#ffb703" toneMapped={false} />
                </mesh>
                {([-0.30, -0.14, 0.16] as number[]).map((mx, idx) => (
                    <group key={idx} position={[mx, 0.052, 0]}>
                        <mesh castShadow>
                            <cylinderGeometry args={[0.040, 0.034, 0.062, 12]} />
                            <meshStandardMaterial color={idx === 1 ? '#f8fafc' : '#1e293b'} roughness={0.3} />
                        </mesh>
                    </group>
                ))}
                <group position={[0.36, 0.080, 0]}>
                    <mesh castShadow>
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
                <mesh position={[0, 1.85, 0]} castShadow>
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
// SUB-COMPONENT: Aesthetic Solid Oak Platform Bed & Nightstand
// -------------------------------------------------------------
const CyberBedAndChillZone = React.memo(function CyberBedAndChillZone() {
    return (
        <group position={[-2.7, 0, 0.8]} rotation={[0, Math.PI / 2, 0]}>
            {/* Solid Warm Oak Low Platform Bed Frame */}
            <mesh castShadow receiveShadow position={[0, 0.16, 0]}>
                <boxGeometry args={[1.4, 0.32, 2.3]} />
                <meshStandardMaterial color="#6a4c33" roughness={0.5} />
            </mesh>
            {/* Warm Golden Inset Accent Trim */}
            <mesh position={[0, 0.02, 0]}>
                <boxGeometry args={[1.44, 0.02, 2.34]} />
                <meshBasicMaterial color="#d97706" toneMapped={false} />
            </mesh>

            {/* Crisp Organic Cotton Mattress */}
            <mesh position={[0, 0.35, 0.1]} castShadow>
                <boxGeometry args={[1.3, 0.18, 2.1]} />
                <meshStandardMaterial color="#f7f4ed" roughness={0.9} />
            </mesh>
            {/* Soft Oatmeal / Waffle Linen Duvet */}
            <mesh position={[0, 0.45, 0.3]} castShadow>
                <boxGeometry args={[1.28, 0.08, 1.4]} />
                <meshStandardMaterial color="#ebe3d5" roughness={0.88} />
            </mesh>
            {/* Fluffy Cream Linen Bed Pillows */}
            <mesh position={[0.3, 0.48, -0.7]} rotation={[0.2, 0, 0]} castShadow>
                <boxGeometry args={[0.5, 0.14, 0.35]} />
                <meshStandardMaterial color="#faf6ee" roughness={0.8} />
            </mesh>
            <mesh position={[-0.3, 0.48, -0.7]} rotation={[0.2, 0, 0]} castShadow>
                <boxGeometry args={[0.5, 0.14, 0.35]} />
                <meshStandardMaterial color="#faf6ee" roughness={0.8} />
            </mesh>

            {/* Bedside Solid Walnut Nightstand */}
            <group position={[0.9, 0.25, -0.7]}>
                <mesh castShadow>
                    <boxGeometry args={[0.4, 0.5, 0.45]} />
                    <meshStandardMaterial color="#553a24" roughness={0.5} />
                </mesh>
                {/* Ceramic Water Carafe on Nightstand */}
                <mesh position={[0, 0.35, 0]} castShadow>
                    <cylinderGeometry args={[0.04, 0.05, 0.16, 16]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.2} />
                </mesh>
            </group>

            {/* HANGING PENDANT LIGHT ABOVE THE BED â€” one of the room's 5 accent lights
                ("above bed"), replacing the old plain bedside point light with a proper
                hanging fixture centered over the mattress. */}
            <group position={[0, 2.35, 0.1]}>
                {/* Recolored off warm-oak/bronze tones only â€” the earlier navy mount + red-orange
                    shade read as a clashing "red and blue" fixture against the warm room. */}
                <mesh>
                    <cylinderGeometry args={[0.045, 0.045, 0.014, 14]} />
                    <meshStandardMaterial color="#3d2b1c" metalness={0.6} roughness={0.35} />
                </mesh>
                <mesh position={[0, -0.28, 0]}>
                    <cylinderGeometry args={[0.004, 0.004, 0.56, 6]} />
                    <meshStandardMaterial color="#241812" roughness={0.85} />
                </mesh>
                {/* castShadow removed from this thin open-ended shade: it was producing
                    flickery shadow-acne artifacts under the directional light's shadow map. */}
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
                    <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]} castShadow>
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
            <mesh castShadow>
                <cylinderGeometry args={[0.032, 0.032, 0.006, 16]} />
                <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.3} />
            </mesh>
            {/* Legs in a slight action stance */}
            <mesh position={[-0.009, 0.03, 0]} rotation={[0, 0, 0.12]} castShadow>
                <cylinderGeometry args={[0.007, 0.008, 0.05, 8]} />
                <meshStandardMaterial color={primary} roughness={0.45} />
            </mesh>
            <mesh position={[0.009, 0.028, 0]} rotation={[0, 0, -0.2]} castShadow>
                <cylinderGeometry args={[0.007, 0.008, 0.05, 8]} />
                <meshStandardMaterial color={primary} roughness={0.45} />
            </mesh>
            {/* Torso */}
            <mesh position={[0, 0.07, 0]} rotation={[0, 0, 0.08]} castShadow>
                <boxGeometry args={[0.026, 0.05, 0.016]} />
                <meshStandardMaterial color={primary} roughness={0.4} />
            </mesh>
            {/* Chest Accent Emblem */}
            <mesh position={[0, 0.075, 0.009]}>
                <circleGeometry args={[0.008, 12]} />
                <meshBasicMaterial color={accent} toneMapped={false} />
            </mesh>
            {/* Raised Arm (action pose) */}
            <mesh position={[0.016, 0.1, 0]} rotation={[0, 0, -1.1]} castShadow>
                <cylinderGeometry args={[0.006, 0.006, 0.045, 8]} />
                <meshStandardMaterial color={primary} roughness={0.45} />
            </mesh>
            {/* Lowered Arm */}
            <mesh position={[-0.015, 0.06, 0]} rotation={[0, 0, 0.35]} castShadow>
                <cylinderGeometry args={[0.006, 0.006, 0.045, 8]} />
                <meshStandardMaterial color={primary} roughness={0.45} />
            </mesh>
            {/* Head */}
            <mesh position={[0.002, 0.115, 0]} castShadow>
                <sphereGeometry args={[0.014, 12, 12]} />
                <meshStandardMaterial color="#d4a373" roughness={0.6} />
            </mesh>
            {/* Hair / Mask Accent */}
            <mesh position={[0.002, 0.121, -0.003]}>
                <sphereGeometry args={[0.0145, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
                <meshStandardMaterial color={accent} roughness={0.4} />
            </mesh>
            {/* Flowing Cape Accent */}
            <mesh position={[0, 0.06, -0.014]} rotation={[0.25, 0, 0]} castShadow>
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
                    <mesh castShadow position={[0, 0.42, 0]}>
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
                <mesh castShadow receiveShadow>
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
                        <mesh key={i} position={[0, i * 0.016 + 0.008, 0]} castShadow>
                            <boxGeometry args={[0.095, 0.014, 0.135]} />
                            <meshStandardMaterial color={['#ef4444', '#f59e0b', '#06b6d4', '#8b5cf6'][i]} roughness={0.5} />
                        </mesh>
                    ))}
                </group>
            </group>

            {/* TOP TIER (SHELF 2 at y = 0.81m) */}
            <group position={[0, 0.81, 0]}>
                {/* Solid Warm Oak Frame Ring */}
                <mesh castShadow receiveShadow>
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
            {/* FLOATING WALL SHELVES (LEFT WALL) */}
            <group position={[-3.4, 2.2, 0.6]} rotation={[0, Math.PI / 2, 0]}>
                <mesh castShadow>
                    <boxGeometry args={[1.8, 0.04, 0.28]} />
                    <meshStandardMaterial color="#0b1220" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[-0.5, 0.1, 0]} castShadow>
                    <boxGeometry args={[0.15, 0.16, 0.03]} />
                    <meshStandardMaterial color="#e63946" />
                </mesh>
                <mesh position={[-0.3, 0.1, 0]} castShadow>
                    <boxGeometry args={[0.15, 0.16, 0.03]} />
                    <meshStandardMaterial color="#ffb703" />
                </mesh>
                <group position={[0.1, 0.12, 0]}>
                    <mesh castShadow>
                        <boxGeometry args={[0.16, 0.14, 0.16]} />
                        <meshBasicMaterial color="#f72585" toneMapped={false} />
                    </mesh>
                    <mesh position={[0, -0.09, 0]} castShadow>
                        <boxGeometry args={[0.1, 0.08, 0.1]} />
                        <meshStandardMaterial color="#ffeedd" />
                    </mesh>
                </group>
                <group position={[0.6, 0.15, 0]}>
                    <mesh position={[0, -0.08, 0]}>
                        <cylinderGeometry args={[0.07, 0.05, 0.1, 12]} />
                        <meshStandardMaterial color="#1e293b" />
                    </mesh>
                    <mesh position={[0, 0.08, 0]}>
                        <sphereGeometry args={[0.12, 12, 12]} />
                        <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                    </mesh>
                </group>
            </group>

            {/* WALL SIGN: "THAT'S ME // RAY OS" (BACK WALL, next to the window) â€” previously
                a flickering cyan/blue neon plane, now a steady warm yellowish-white glow with
                a small real light beside it washing that window-side corner. */}
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
    currentRoutine,
    onRoutineChange,
    environmentPhase,
    onJackIn,
}: CyberRoomSceneProps) {
    const monitorTextures = useMemo(() => new MonitorTextures(), []);
    const envConfig = ENVIRONMENT_CONFIGS[environmentPhase];

    useEffect(() => {
        return () => monitorTextures.destroy();
    }, [monitorTextures]);

    function SceneLoop() {
        const { gl } = useThree();

        // Smoothly adjust exposure without re-creating Canvas/WebGLRenderer
        useEffect(() => {
            gl.toneMappingExposure = environmentPhase === 'morning' ? 1.4 : environmentPhase === 'afternoon' ? 1.35 : 1.25;
        }, [gl, environmentPhase]);

        useFrame((state) => {
            monitorTextures.update(state.clock.elapsedTime);
        });
        return null;
    }

    return (
        <div className="w-full h-full relative cursor-default">
            <Canvas
                shadows
                camera={{ position: [0, 1.75, 4.55], fov: 55 }}
                dpr={[1, 1.5]}
                performance={{ min: 0.5 }}
                frameloop={cameraMode === 'at_screen' ? 'demand' : 'always'}
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

                {/* Camera Choreography (Locked manual orbit or guided room tour) */}
                <CameraController
                    mode={cameraMode}
                    onDollyComplete={onDollyComplete}
                    onReturnComplete={onReturnComplete}
                    onTourPoiChange={onTourPoiChange}
                    onTourComplete={onTourComplete}
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
                    castShadow
                    position={envConfig.sunPosition}
                    intensity={envConfig.sunIntensity}
                    color={envConfig.sunColor}
                    shadow-mapSize={[1024, 1024]}
                    shadow-bias={-0.0001}
                />

                {/* The old "morning sunlight beam" spotlight lived here â€” it only ever lit up
                    when environmentPhase === 'morning', which can no longer happen now that dark
                    mode is permanent, so it was a dead light sitting in the shader's light list
                    for no visual benefit. Removed as part of the room's lighting budget cut. */}

                {/* Real Architectural Room: Hardwood Parquet, Acoustic Slat Walls, Rafter Ceiling, Loft Window */}
                <ArchitecturalRoom environmentPhase={environmentPhase} />
                <WallPipelinesAndConduits />
                <IndustrialCeilingVent />

                {/* Battlestation: Desk, Single Ultrawide Monitor, Custom Liquid-Cooled PC Cabinet */}
                <BattlestationDesk />
                <BattlestationMonitors monitorTextures={monitorTextures} />
                <CpuCabinet />

                {/* Autonomous Character Simulation (Aditya Ray) */}
                <CyberCharacter currentRoutine={currentRoutine} onRoutineChange={onRoutineChange} />


                {/* Night Window (curtained â€” see ArchitecturalRoom for the closed curtain + wall-wash light) */}
                <DynamicAtmosphereWindow />

                {/* Coffee Station / Espresso Bar */}
                <CoffeeStation />

                {/* Cyber Futon Bed & Chill Zone */}
                <CyberBedAndChillZone />

                {/* Shelves & Decor */}
                <CyberRoomDecor />

                {/* Side Table with Anime Figurine Collection (open floor nook in front of the window) */}
                <SideTableWithFigurines />

                {/* 3D Floating Interactive POI Markers over Bed, Coffee Stand, and Battlestation */}
                <FloatingPoiMarkers
                    visible={cameraMode === 'orbit'}
                    onSelectSetup={() => {
                        if (currentRoutine !== 'coding' && currentRoutine !== 'returning_to_desk') {
                            onRoutineChange('returning_to_desk', 'Returning to Battlestation...');
                        } else {
                            onJackIn();
                        }
                    }}
                    onSelectCoffee={() => onRoutineChange('walking_to_coffee', 'Heading to Neon Espresso Bar...')}
                    onSelectBed={() => onRoutineChange('walking_to_bed', 'Heading to Cyber Futon to Sleep...')}
                />
            </Canvas>
        </div>
    );
}
