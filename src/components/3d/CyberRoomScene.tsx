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
// SUB-COMPONENT: Single Ultrawide Curved OLED Monitor
// -------------------------------------------------------------
function BattlestationMonitors({ monitorTextures }: { monitorTextures: MonitorTextures }) {
    return (
        <group position={[0, 1.45, -0.9]}>
            {/* Heavy-Duty Heavy Articulated Hydraulic Mounting Arm */}
            <mesh position={[0, -0.42, -0.15]}>
                <cylinderGeometry args={[0.045, 0.055, 0.84, 16]} />
                <meshStandardMaterial color="#090e18" metalness={0.95} roughness={0.15} />
            </mesh>
            <mesh position={[0, -0.78, 0]}>
                <boxGeometry args={[0.38, 0.04, 0.26]} />
                <meshStandardMaterial color="#090e18" metalness={0.95} roughness={0.15} />
            </mesh>
            {/* Articulated VESA Mount Bracket */}
            <mesh position={[0, 0, -0.06]}>
                <boxGeometry args={[0.18, 0.18, 0.05]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* AMBILIGHT BIAS BACKGLOW (Projecting onto back acoustic wood slats) */}
            <pointLight color="#00f5d4" intensity={2.2} distance={3.2} decay={2} position={[0, 0, -0.35]} />
            <pointLight color="#fbbf24" intensity={1.4} distance={2.5} decay={2} position={[0, -0.2, -0.35]} />

            {/* SINGLE PREMIUM 38" ULTRAWIDE CURVED OLED MONITOR */}
            <group position={[0, 0, 0]}>
                {/* Outer Beveled Chassis */}
                <mesh castShadow>
                    <boxGeometry args={[1.72, 0.82, 0.065]} />
                    <meshStandardMaterial color="#070b14" metalness={0.88} roughness={0.22} />
                </mesh>

                {/* Webcam & Biometric Sensor Array on Top */}
                <group position={[0, 0.425, 0.01]}>
                    <mesh>
                        <boxGeometry args={[0.18, 0.03, 0.045]} />
                        <meshStandardMaterial color="#03060d" metalness={0.9} roughness={0.2} />
                    </mesh>
                    <mesh position={[0, 0, 0.024]}>
                        <sphereGeometry args={[0.009, 12, 12]} />
                        <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                    </mesh>
                </group>

                {/* Glowing Screen Bezel Trim */}
                <mesh position={[0, 0, 0.034]}>
                    <boxGeometry args={[1.66, 0.76, 0.004]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                </mesh>
                {/* Active Screen Surface */}
                <mesh position={[0, 0, 0.038]}>
                    <planeGeometry args={[1.63, 0.73]} />
                    <meshBasicMaterial map={monitorTextures.centerTexture} toneMapped={false} />
                </mesh>
                {/* Screen Forward Cast Light */}
                <pointLight color="#00f5d4" intensity={2.0} distance={2.8} decay={2} position={[0, 0, 0.4]} />
            </group>
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Custom High-End Gaming / Workstation PC Cabinet
// -------------------------------------------------------------
function CpuCabinet() {
    const rgbPulseRef = useRef<THREE.PointLight>(null);
    const lastRgbUpdate = useRef(0);

    useFrame((state) => {
        // Throttle RGB pulse to ~15 FPS - human eye can't distinguish faster for a glow pulse
        if (state.clock.elapsedTime - lastRgbUpdate.current < 0.066) return;
        lastRgbUpdate.current = state.clock.elapsedTime;
        if (rgbPulseRef.current) {
            rgbPulseRef.current.intensity = 1.6 + Math.sin(state.clock.elapsedTime * 2.5) * 0.3;
        }
    });

    return (
        <group position={[1.18, 0.753, -0.65]} rotation={[0, -0.16, 0]}>
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
                {/* LCD Temp Display Center (38°C) */}
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

            {/* 7. SOFT INTERNAL STUDIO RGB LIGHTING (Illuminating components through the glass) */}
            <pointLight
                ref={rgbPulseRef}
                color="#00f5d4"
                intensity={1.8}
                distance={1.6}
                decay={2}
                position={[-0.04, 0.28, 0]}
            />
            <pointLight color="#f59e0b" intensity={0.9} distance={1.2} decay={2} position={[0.02, 0.18, 0.05]} />
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Battlestation Desk, Mat, Keyboard, Cables, Lamp
// -------------------------------------------------------------
function BattlestationDesk() {
    const lampFlickerRef = useRef<THREE.PointLight>(null);
    const lastLampUpdate = useRef(0);

    useFrame((state) => {
        // Throttle lamp flicker to ~20 FPS - subtle effect, doesn't need 60fps
        if (state.clock.elapsedTime - lastLampUpdate.current < 0.05) return;
        lastLampUpdate.current = state.clock.elapsedTime;
        if (lampFlickerRef.current) {
            lampFlickerRef.current.intensity = 2.6 + Math.sin(state.clock.elapsedTime * 14) * 0.15;
        }
    });

    return (
        <group position={[0, 0, -0.7]}>
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

            {/* DESKTOP GREENERY: POTTED CERAMIC SUCCULENT PLANTER */}
            <group position={[0.72, 0.76, 0.26]}>
                <mesh position={[0, 0.06, 0]}>
                    <cylinderGeometry args={[0.07, 0.05, 0.12, 16]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.3} />
                </mesh>
                <mesh position={[0, 0.12, 0]}>
                    <cylinderGeometry args={[0.065, 0.065, 0.02, 16]} />
                    <meshStandardMaterial color="#271c15" roughness={0.9} />
                </mesh>
                <mesh position={[0, 0.16, 0]}>
                    <sphereGeometry args={[0.08, 10, 10]} />
                    <meshStandardMaterial color="#10b981" roughness={0.6} />
                </mesh>
                <mesh position={[0.03, 0.21, 0.02]}>
                    <sphereGeometry args={[0.055, 8, 8]} />
                    <meshStandardMaterial color="#34d399" roughness={0.6} />
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
                <pointLight
                    ref={lampFlickerRef}
                    color="#ffb703"
                    intensity={2.8}
                    distance={3.5}
                    decay={2}
                    position={[0.22, 0.36, 0.2]}
                    castShadow
                />
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
}

// -------------------------------------------------------------
// SUB-COMPONENT: Corner Server Rack with Patch Cables & LEDs
// -------------------------------------------------------------
function ServerRackTower() {
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

            <pointLight color="#00f5d4" intensity={1.6} distance={2.5} decay={2} position={[0, 1.4, 0.5]} />
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Dynamic Atmosphere Window (Lush Botanical Courtyard Vista)
// -------------------------------------------------------------
function DynamicAtmosphereWindow({ environmentPhase }: { environmentPhase: EnvironmentPhase }) {
    const config = ENVIRONMENT_CONFIGS[environmentPhase];
    const rainRef = useRef<THREE.Points>(null);

    const isNight = environmentPhase === 'night';
    const isEvening = environmentPhase === 'evening';

    // Rain particles for night ambiance
    const rainCount = 180;
    const { rainGeo } = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(rainCount * 3);
        for (let i = 0; i < rainCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 3.4;
            pos[i * 3 + 1] = 1.0 + Math.random() * 1.8;
            pos[i * 3 + 2] = -3.48;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        return { rainGeo: geo };
    }, []);

    // Night sky texture only — we only keep dark mode
    const skyTexture = useMemo(() => {
        if (typeof document === 'undefined') return null;
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        const grad = ctx.createLinearGradient(0, 0, 0, 256);
        grad.addColorStop(0, '#030712');
        grad.addColorStop(0.6, '#0b1329');
        grad.addColorStop(1, '#111827');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 256);
        // Stars
        ctx.fillStyle = '#ffffff';
        for (let s = 0; s < 70; s++) {
            const sx = (Math.sin(s * 99) * 0.5 + 0.5) * 256;
            const sy = (Math.cos(s * 33) * 0.5 + 0.5) * 200;
            ctx.fillRect(sx, sy, s % 3 === 0 ? 2 : 1, s % 3 === 0 ? 2 : 1);
        }
        return new THREE.CanvasTexture(canvas);
    }, []);

    const lastRainUpdate = useRef(0);
    useFrame((state, delta) => {
        if (config.showRain && rainRef.current) {
            // Throttle rain to 30fps
            if (state.clock.elapsedTime - lastRainUpdate.current < 0.033) return;
            lastRainUpdate.current = state.clock.elapsedTime;
            const pos = rainGeo.attributes.position.array as Float32Array;
            for (let i = 0; i < rainCount; i++) {
                pos[i * 3 + 1] -= delta * (1.5 + (i % 5) * 0.4);
                if (pos[i * 3 + 1] < 1.0) {
                    pos[i * 3 + 1] = 2.8;
                }
            }
            rainGeo.attributes.position.needsUpdate = true;
        }
    });

    const windowGlassColor =
        environmentPhase === 'morning'
            ? '#fefce8'
            : environmentPhase === 'afternoon'
            ? '#f0f9ff'
            : environmentPhase === 'evening'
            ? '#fed7aa'
            : '#0f172a';

    return (
        <group position={[0, 0, 0]}>
            {/* ============================================================ */}
            {/* 1. ARCHITECTURAL HOLLOW WINDOW CASING & SLIM BRONZE MULLIONS */}
            {/* ============================================================ */}
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

            {/* Crystal Clear Glass Pane with Realistic Specular Tint */}
            <mesh position={[0, 1.9, -3.48]}>
                <planeGeometry args={[3.68, 1.96]} />
                <meshStandardMaterial
                    color={windowGlassColor}
                    transparent
                    opacity={isNight ? 0.45 : 0.15}
                    roughness={0.04}
                    metalness={0.15}
                />
            </mesh>

            {/* Dripping Rain Particles (Rendered only at Night) */}
            {config.showRain && (
                <points ref={rainRef} geometry={rainGeo}>
                    <pointsMaterial color="#38bdf8" size={0.03} transparent opacity={0.6} toneMapped={false} />
                </points>
            )}

            {/* ============================================================ */}
            {/* 2. OUTSIDE COURTYARD GARDEN & HIGH-RESOLUTION SKY VISTA      */}
            {/* ============================================================ */}
            <group position={[0, 1.8, -5.2]}>
                {/* Atmospheric Sky Backdrop with Custom Canvas Gradient */}
                <mesh position={[0, 0.6, -2.5]}>
                    <planeGeometry args={[16, 10]} />
                    <meshBasicMaterial map={skyTexture || undefined} color={config.windowSkyTop} />
                </mesh>

                {/* Courtyard Terrace Paver Floor */}
                <mesh position={[0, -1.8, 0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <planeGeometry args={[12, 6]} />
                    <meshStandardMaterial color={isNight ? '#14181f' : '#b8aea2'} roughness={0.75} />
                </mesh>

                {/* Garden Boundary Stone Wall with Ivy Foliage */}
                <group position={[0, -0.7, -1.6]}>
                    {/* Architectural Cut-Stone Boundary Wall */}
                    <mesh castShadow receiveShadow position={[0, 0, 0]}>
                        <boxGeometry args={[14, 2.2, 0.4]} />
                        <meshStandardMaterial color={isNight ? '#11151d' : '#6b5c4d'} roughness={0.85} />
                    </mesh>
                    {/* Wall Coping Cap Stone */}
                    <mesh position={[0, 1.12, 0]}>
                        <boxGeometry args={[14.2, 0.08, 0.46]} />
                        <meshStandardMaterial color={isNight ? '#191f2b' : '#857564'} roughness={0.7} />
                    </mesh>
                    {/* Climbing Ivy Foliage Pads along the stone wall */}
                    {[-4.5, -2.8, -1.2, 0.8, 2.4, 4.2].map((wx, wi) => (
                        <group key={wi} position={[wx, 0.2 + (wi % 3) * 0.25, 0.22]}>
                            <mesh>
                                <dodecahedronGeometry args={[0.32 + (wi % 2) * 0.1, 1]} />
                                <meshStandardMaterial
                                    color={isEvening ? '#78350f' : isNight ? '#0a2310' : wi % 2 === 0 ? '#1b431e' : '#275828'}
                                    roughness={0.7}
                                />
                            </mesh>
                        </group>
                    ))}
                </group>

                {/* Lush Lawn / Flower Bed along the courtyard terrace */}
                <mesh position={[0, -1.78, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[12, 2.2]} />
                    <meshStandardMaterial color={isNight ? '#0b1a0d' : '#1c3d18'} roughness={0.9} />
                </mesh>

                {/* Distant Layered Rolling Treeline - replaced with simple dark silhouette planes for performance */}
                <group position={[0, 0.3, -2.1]}>
                    {[-4.8, -2.4, 0.2, 2.6, 5.0].map((tx, ti) => (
                        <mesh key={ti} position={[tx, (ti % 2) * 0.35, 0]}>
                            <dodecahedronGeometry args={[1.1 + (ti % 3) * 0.25, 0]} />
                            <meshBasicMaterial color="#08170c" />
                        </mesh>
                    ))}
                </group>

                {/* Window Directional / Ambient Cast Light */}
                <pointLight
                    color={config.sunColor}
                    intensity={config.sunIntensity}
                    distance={8}
                    decay={2}
                    position={[0, 1.2, -1]}
                />
            </group>
        </group>
    );
}



// -------------------------------------------------------------
// SUB-COMPONENT: High-Tech Coffee Station / Espresso Bar
// -------------------------------------------------------------
function CoffeeStation() {
    const steamGeo = useMemo(() => {
        const count = 32;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 0.08;
            pos[i * 3 + 1] = 0.95 + Math.random() * 0.35;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        return geo;
    }, []);

    const lastSteamUpdate = useRef(0);
    useFrame((state) => {
        // Throttle coffee steam to ~20 FPS - slow rising particles don't need 60fps
        const now = state.clock.elapsedTime;
        const dt = now - lastSteamUpdate.current;
        if (dt < 0.05) return;
        lastSteamUpdate.current = now;
        const pos = steamGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < 32; i++) {
            pos[i * 3 + 1] += dt * 0.22;
            pos[i * 3] += (Math.random() - 0.5) * dt * 0.05;
            if (pos[i * 3 + 1] > 1.35) {
                pos[i * 3 + 1] = 0.96;
                pos[i * 3] = (Math.random() - 0.5) * 0.06;
            }
        }
        steamGeo.attributes.position.needsUpdate = true;
    });

    return (
        <group position={[2.8, 0, 0.7]} rotation={[0, -Math.PI / 2, 0]}>
            <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
                <boxGeometry args={[1.4, 0.9, 0.7]} />
                <meshStandardMaterial color="#0a101b" roughness={0.4} metalness={0.7} />
            </mesh>
            <mesh position={[0, 0.89, 0.355]}>
                <boxGeometry args={[1.4, 0.02, 0.01]} />
                <meshBasicMaterial color="#ffb703" toneMapped={false} />
            </mesh>

            {/* High-Tech Espresso Machine */}
            <group position={[0, 0.9, -0.05]}>
                <mesh castShadow position={[0, 0.25, 0]}>
                    <boxGeometry args={[0.55, 0.5, 0.45]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh position={[0.18, 0.28, -0.1]}>
                    <cylinderGeometry args={[0.06, 0.06, 0.38, 16]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                </mesh>
                <mesh position={[-0.08, 0.12, 0.15]}>
                    <cylinderGeometry args={[0.04, 0.04, 0.1, 12]} />
                    <meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.1} />
                </mesh>
                <mesh position={[-0.08, 0.06, 0.15]} castShadow>
                    <cylinderGeometry args={[0.045, 0.04, 0.09, 16]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.5} />
                </mesh>
                <mesh position={[-0.08, 0.095, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[0.04, 16]} />
                    <meshBasicMaterial color="#3d1e08" />
                </mesh>
            </group>

            <points position={[-0.08, 0.1, 0.1]} geometry={steamGeo}>
                <pointsMaterial color="#ffffff" size={0.032} transparent opacity={0.35} toneMapped={false} />
            </points>

            {/* ============================================================ */}
            {/* DESIGNER COFFEE TABLE LIGHTING ELEMENTS & FIXTURES            */}
            {/* ============================================================ */}

            {/* 1. SCANDINAVIAN SPUN BRASS CONE PENDANT LIGHT FIXTURE */}
            <group position={[0, 0, 0]}>
                {/* Ceiling Mounting Rosette */}
                <mesh position={[0, 2.7, 0]}>
                    <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Slender Braided Black Suspension Cord */}
                <mesh position={[0, 2.32, 0]}>
                    <cylinderGeometry args={[0.005, 0.005, 0.74, 8]} />
                    <meshStandardMaterial color="#020617" roughness={0.9} />
                </mesh>
                {/* Polished Solid Brass Lamp Socket & Finial */}
                <mesh position={[0, 1.95, 0]}>
                    <cylinderGeometry args={[0.032, 0.032, 0.06, 16]} />
                    <meshStandardMaterial color="#eab308" metalness={0.92} roughness={0.15} />
                </mesh>
                {/* Spun Brushed Brass Conical Lampshade */}
                <mesh position={[0, 1.88, 0]} castShadow>
                    <coneGeometry args={[0.22, 0.18, 24, 1, true]} />
                    <meshStandardMaterial color="#ca8a04" metalness={0.88} roughness={0.22} side={THREE.DoubleSide} />
                </mesh>
                {/* Warm Glowing Exposed Filament Globe Bulb */}
                <mesh position={[0, 1.81, 0]}>
                    <sphereGeometry args={[0.055, 16, 16]} />
                    <meshBasicMaterial color="#fffbeb" toneMapped={false} />
                </mesh>
                {/* Primary Warm Downward Pool of Light (Casting 2700K onto espresso machine & countertop) */}
                <pointLight color="#fef3c7" intensity={5.4} distance={4.2} decay={1.8} position={[0, 1.75, 0.05]} />
            </group>

            {/* 2. FLOATING OAK WALL SHELF WITH COFFEE ACCESSORIES & UNDER-SHELF WARM LED */}
            <group position={[0, 1.55, -0.22]}>
                {/* Solid Oak Floating Shelf */}
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[1.3, 0.035, 0.24]} />
                    <meshStandardMaterial color="#6a4c33" roughness={0.5} />
                </mesh>
                {/* Under-Shelf Warm Indirect LED Light Strip */}
                <mesh position={[0, -0.02, 0.08]}>
                    <boxGeometry args={[1.26, 0.012, 0.02]} />
                    <meshBasicMaterial color="#ffb703" toneMapped={false} />
                </mesh>
                <pointLight color="#f59e0b" intensity={2.4} distance={2.4} decay={2} position={[0, -0.06, 0.08]} />

                {/* Ceramic Cappuccino Mugs on Shelf */}
                {[-0.35, -0.20, 0.25].map((mx, idx) => (
                    <group key={idx} position={[mx, 0.06, 0]}>
                        <mesh castShadow>
                            <cylinderGeometry args={[0.045, 0.038, 0.07, 12]} />
                            <meshStandardMaterial color={idx === 1 ? '#f8fafc' : '#1e293b'} roughness={0.3} />
                        </mesh>
                    </group>
                ))}

                {/* Glass Coffee Bean Canister */}
                <group position={[0.42, 0.09, 0]}>
                    <mesh castShadow>
                        <cylinderGeometry args={[0.05, 0.05, 0.14, 14]} />
                        <meshStandardMaterial color="#ffffff" transparent opacity={0.45} roughness={0.1} />
                    </mesh>
                    <mesh position={[0, -0.02, 0]}>
                        <cylinderGeometry args={[0.046, 0.046, 0.09, 12]} />
                        <meshStandardMaterial color="#451a03" roughness={0.85} />
                    </mesh>
                    <mesh position={[0, 0.075, 0]}>
                        <cylinderGeometry args={[0.052, 0.052, 0.02, 14]} />
                        <meshStandardMaterial color="#a16207" roughness={0.4} metalness={0.6} />
                    </mesh>
                </group>
            </group>

            {/* 3. ARTICULATED BRASS COUNTER TASK LAMP ON TABLE CORNER */}
            <group position={[0.55, 0.90, 0.12]}>
                {/* Weighted Brass Base */}
                <mesh castShadow position={[0, 0.01, 0]}>
                    <cylinderGeometry args={[0.055, 0.06, 0.02, 14]} />
                    <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
                {/* Arched Slender Brass Stem */}
                <mesh position={[-0.04, 0.16, 0]} rotation={[0, 0, 0.35]}>
                    <cylinderGeometry args={[0.008, 0.008, 0.32, 8]} />
                    <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
                {/* Angled Brass Hood Shade */}
                <mesh position={[-0.10, 0.28, 0]} rotation={[0, 0, -0.6]} castShadow>
                    <cylinderGeometry args={[0.035, 0.06, 0.09, 12]} />
                    <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
                </mesh>
                {/* Warm Task Light on counter */}
                <pointLight color="#fed7aa" intensity={2.5} distance={2.2} decay={2} position={[-0.12, 0.26, 0]} />
            </group>
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Aesthetic Solid Oak Platform Bed & Nightstand
// -------------------------------------------------------------
function CyberBedAndChillZone() {
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

            {/* Warm Ambient Bedside Reading Light */}
            <pointLight color="#fed7aa" intensity={1.5} distance={2.8} decay={2} position={[0, 0.8, 0]} />
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Architectural Ceiling Ventilation & Ambient Beam
// -------------------------------------------------------------
function IndustrialCeilingVent() {
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
}

// -------------------------------------------------------------
// SUB-COMPONENT: Upper Wall Copper Conduits & Warm Accents
// -------------------------------------------------------------
function WallPipelinesAndConduits() {
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

            {/* Warm Ambient Conduit Accents along left wall */}
            <mesh position={[-3.38, 3.05, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 6.8, 12]} />
                <meshBasicMaterial color="#f59e0b" toneMapped={false} />
            </mesh>
            <mesh position={[-3.38, 2.96, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 6.8, 12]} />
                <meshBasicMaterial color="#10b981" toneMapped={false} />
            </mesh>
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Shelves, Collectibles & Neon "THAT'S ME" Sign
// -------------------------------------------------------------
function CyberRoomDecor() {
    const signFlickerRef = useRef<THREE.MeshBasicMaterial>(null);
    const lastSignUpdate = useRef(0);

    useFrame((state) => {
        // Throttle neon sign flicker to ~24 FPS - cinematic enough for a "neon" effect
        if (state.clock.elapsedTime - lastSignUpdate.current < 0.042) return;
        lastSignUpdate.current = state.clock.elapsedTime;
        if (signFlickerRef.current) {
            const t = state.clock.elapsedTime;
            const flicker = Math.sin(t * 12) > -0.7 ? 1.0 : 0.2;
            signFlickerRef.current.opacity = 0.85 * flicker;
        }
    });

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

            {/* NEON WALL SIGN: "THAT'S ME // RAY OS" (BACK WALL) */}
            <group position={[-2.0, 2.7, -3.45]}>
                <mesh>
                    <boxGeometry args={[1.6, 0.45, 0.02]} />
                    <meshStandardMaterial color="#050810" roughness={0.9} />
                </mesh>
                <mesh position={[0, 0, 0.015]}>
                    <planeGeometry args={[1.54, 0.4]} />
                    <meshBasicMaterial
                        ref={signFlickerRef}
                        color="#00f5d4"
                        transparent
                        opacity={0.9}
                        toneMapped={false}
                    />
                </mesh>
            </group>

            {/* Atmospheric Cyber Dust Motes */}
            <CyberDustMotes />
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Floating Cyber Dust Motes
// -------------------------------------------------------------
function CyberDustMotes() {
    // Reduced from 120 to 60 particles - imperceptible visual difference at half the CPU cost
    const count = 60;
    const lastDustUpdate = useRef(0);
    const { geo } = useMemo(() => {
        const g = new THREE.BufferGeometry();
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 6.5;
            p[i * 3 + 1] = 0.5 + Math.random() * 3.0;
            p[i * 3 + 2] = (Math.random() - 0.5) * 6.5;
        }
        g.setAttribute('position', new THREE.BufferAttribute(p, 3));
        return { geo: g };
    }, []);

    useFrame((state) => {
        // Throttle dust mote updates to ~20 FPS - slow-floating particles don't need 60fps
        if (state.clock.elapsedTime - lastDustUpdate.current < 0.05) return;
        lastDustUpdate.current = state.clock.elapsedTime;
        const p = geo.attributes.position.array as Float32Array;
        const t = state.clock.elapsedTime;
        const dt = 0.05; // Fixed timestep for throttled update
        for (let i = 0; i < count; i++) {
            p[i * 3 + 1] += Math.sin(t + i) * dt * 0.05;
            p[i * 3] += Math.cos(t * 0.5 + i) * dt * 0.03;
        }
        geo.attributes.position.needsUpdate = true;
    });

    return (
        <points geometry={geo}>
            <pointsMaterial color="#00f5d4" size={0.025} transparent opacity={0.4} toneMapped={false} />
        </points>
    );
}

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

                {/* Morning Sunlight Beam (Permanently mounted to prevent shader recompilation stutter on theme switch) */}
                <spotLight
                    position={[0, 4.0, -3.8]}
                    target-position={[0, 0.7, 0]}
                    intensity={environmentPhase === 'morning' ? 2.6 : 0}
                    color="#fef08a"
                    angle={0.85}
                    penumbra={0.65}
                />

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

                {/* Corner Server Rack with Patch Cables & LEDs */}
                <ServerRackTower />

                {/* Dynamic Atmosphere Window (Trees in morning, sunset in evening, rain at night) */}
                <DynamicAtmosphereWindow environmentPhase={environmentPhase} />

                {/* Coffee Station / Espresso Bar */}
                <CoffeeStation />

                {/* Cyber Futon Bed & Chill Zone */}
                <CyberBedAndChillZone />

                {/* Shelves & Decor */}
                <CyberRoomDecor />

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
