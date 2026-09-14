'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import CyberCharacter, { CharacterRoutine } from './CyberCharacter';
import CyberDog from './CyberDog';
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
// SUB-COMPONENT: Triple Curved Monitors with Ambilight Backlight
// -------------------------------------------------------------
function BattlestationMonitors({ monitorTextures }: { monitorTextures: MonitorTextures }) {
    return (
        <group position={[0, 1.45, -0.9]}>
            {/* Heavy-Duty Heavy Articulated Hydraulic Mounting Arms */}
            <mesh position={[0, -0.4, -0.15]}>
                <cylinderGeometry args={[0.045, 0.055, 0.82, 16]} />
                <meshStandardMaterial color="#090e18" metalness={0.95} roughness={0.15} />
            </mesh>
            <mesh position={[0, -0.78, 0]}>
                <boxGeometry args={[0.42, 0.04, 0.28]} />
                <meshStandardMaterial color="#090e18" metalness={0.95} roughness={0.15} />
            </mesh>

            {/* AMBILIGHT BIAS BACKGLOW (Projecting onto the back wall behind monitors) */}
            <pointLight color="#00f5d4" intensity={2.4} distance={3.2} decay={2} position={[0, 0, -0.4]} />
            <pointLight color="#f72585" intensity={1.2} distance={2.4} decay={2} position={[0.8, 0, -0.3]} />

            {/* 1. PRIMARY CENTER CURVED ULTRAWIDE MONITOR */}
            <group position={[0, 0, 0]}>
                {/* Outer Beveled Chassis */}
                <mesh castShadow>
                    <boxGeometry args={[1.52, 0.84, 0.07]} />
                    <meshStandardMaterial color="#070b14" metalness={0.85} roughness={0.25} />
                </mesh>

                {/* Webcam & Biometric Sensor Array on Top */}
                <group position={[0, 0.435, 0.01]}>
                    <mesh>
                        <boxGeometry args={[0.16, 0.03, 0.05]} />
                        <meshStandardMaterial color="#03060d" metalness={0.9} roughness={0.2} />
                    </mesh>
                    <mesh position={[0, 0, 0.026]}>
                        <sphereGeometry args={[0.009, 12, 12]} />
                        <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                    </mesh>
                </group>

                {/* Glowing Screen Bezel Trim */}
                <mesh position={[0, 0, 0.036]}>
                    <boxGeometry args={[1.45, 0.77, 0.005]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                </mesh>
                {/* Active Screen Surface */}
                <mesh position={[0, 0, 0.039]}>
                    <planeGeometry args={[1.42, 0.74]} />
                    <meshBasicMaterial map={monitorTextures.centerTexture} toneMapped={false} />
                </mesh>
                {/* Screen Forward Cast Light */}
                <pointLight color="#00f5d4" intensity={2.0} distance={2.8} decay={2} position={[0, 0, 0.4]} />
            </group>

            {/* 2. LEFT MONITOR (Angled Inward 24 deg) */}
            <group position={[-1.18, 0.05, 0.18]} rotation={[0, 0.42, 0]}>
                <mesh castShadow>
                    <boxGeometry args={[0.84, 0.82, 0.06]} />
                    <meshStandardMaterial color="#070b14" metalness={0.85} roughness={0.25} />
                </mesh>
                <mesh position={[0, 0, 0.032]}>
                    <planeGeometry args={[0.78, 0.76]} />
                    <meshBasicMaterial map={monitorTextures.leftTexture} toneMapped={false} />
                </mesh>
                <pointLight color="#ff0055" intensity={1.2} distance={2.2} decay={2} position={[0, 0, 0.3]} />
            </group>

            {/* 3. RIGHT MONITOR (Angled Inward -24 deg) */}
            <group position={[1.18, 0.05, 0.18]} rotation={[0, -0.42, 0]}>
                <mesh castShadow>
                    <boxGeometry args={[0.84, 0.82, 0.06]} />
                    <meshStandardMaterial color="#070b14" metalness={0.85} roughness={0.25} />
                </mesh>
                <mesh position={[0, 0, 0.032]}>
                    <planeGeometry args={[0.78, 0.76]} />
                    <meshBasicMaterial map={monitorTextures.rightTexture} toneMapped={false} />
                </mesh>
                <pointLight color="#7209b7" intensity={1.2} distance={2.2} decay={2} position={[0, 0, 0.3]} />
            </group>
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Battlestation Desk, Mat, Keyboard, Cables, Lamp
// -------------------------------------------------------------
function BattlestationDesk() {
    const lampFlickerRef = useRef<THREE.PointLight>(null);

    useFrame((state) => {
        if (lampFlickerRef.current) {
            lampFlickerRef.current.intensity = 2.6 + Math.sin(state.clock.elapsedTime * 14) * 0.15;
        }
    });

    return (
        <group position={[0, 0, -0.7]}>
            {/* Desktop Surface - Textured Carbon-Fiber Beveled Finish */}
            <mesh receiveShadow castShadow position={[0, 0.72, 0]}>
                <boxGeometry args={[3.2, 0.06, 1.25]} />
                <meshStandardMaterial color="#080c16" roughness={0.35} metalness={0.7} />
            </mesh>

            {/* Desk Edge Neon Cyan Underglow Strip */}
            <mesh position={[0, 0.69, 0.627]}>
                <boxGeometry args={[3.2, 0.015, 0.01]} />
                <meshBasicMaterial color="#00f5d4" toneMapped={false} />
            </mesh>

            {/* Desk Heavy Steel Beveled Legs */}
            <mesh castShadow position={[-1.48, 0.36, 0]}>
                <boxGeometry args={[0.08, 0.72, 1.05]} />
                <meshStandardMaterial color="#04060c" metalness={0.95} roughness={0.15} />
            </mesh>
            <mesh castShadow position={[1.48, 0.36, 0]}>
                <boxGeometry args={[0.08, 0.72, 1.05]} />
                <meshStandardMaterial color="#04060c" metalness={0.95} roughness={0.15} />
            </mesh>

            {/* Cable Management Tray Under Desk with Glowing Power Strip */}
            <group position={[0, 0.66, -0.3]}>
                <mesh>
                    <boxGeometry args={[2.0, 0.05, 0.2]} />
                    <meshStandardMaterial color="#050812" metalness={0.9} />
                </mesh>
                {/* Glowing power strip switches */}
                {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
                    <mesh key={i} position={[x, -0.03, 0]}>
                        <boxGeometry args={[0.05, 0.01, 0.03]} />
                        <meshBasicMaterial color="#ffb703" toneMapped={false} />
                    </mesh>
                ))}
            </group>

            {/* EXTENDED CYBER CIRCUIT DESK MAT */}
            <group position={[0, 0.753, 0.12]}>
                <mesh receiveShadow>
                    <boxGeometry args={[1.9, 0.005, 0.68]} />
                    <meshStandardMaterial color="#040710" roughness={0.8} />
                </mesh>
                {/* Glowing turquoise perimeter trim */}
                <mesh position={[0, 0.003, 0]}>
                    <boxGeometry args={[1.92, 0.002, 0.7]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                </mesh>
            </group>

            {/* RGB Mechanical Keyboard with Sculpted Keycaps */}
            <group position={[0, 0.76, 0.15]}>
                <mesh castShadow>
                    <boxGeometry args={[0.58, 0.025, 0.22]} />
                    <meshStandardMaterial color="#0e1626" roughness={0.4} metalness={0.6} />
                </mesh>
                {/* Glowing Keycaps Array */}
                <mesh position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.54, 0.18]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                </mesh>
            </group>

            {/* Cyber Gaming Mouse & Charging Dock */}
            <group position={[0.46, 0.76, 0.15]}>
                <mesh position={[0, 0.002, 0]}>
                    <boxGeometry args={[0.18, 0.004, 0.26]} />
                    <meshStandardMaterial color="#020408" roughness={0.9} />
                </mesh>
                <mesh castShadow position={[0, 0.02, 0]}>
                    <boxGeometry args={[0.08, 0.035, 0.14]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0.038, 0]}>
                    <boxGeometry args={[0.015, 0.004, 0.06]} />
                    <meshBasicMaterial color="#f72585" toneMapped={false} />
                </mesh>
            </group>

            {/* FUTURISTIC ENERGY DRINK CAN ("NEO-ENERGY") */}
            <group position={[0.78, 0.76, 0.25]}>
                <mesh castShadow position={[0, 0.08, 0]}>
                    <cylinderGeometry args={[0.035, 0.035, 0.16, 16]} />
                    <meshStandardMaterial color="#00f5d4" metalness={0.9} roughness={0.2} />
                </mesh>
                {/* Aluminum Pull-Tab Lid */}
                <mesh position={[0, 0.162, 0]}>
                    <cylinderGeometry args={[0.034, 0.034, 0.005, 16]} />
                    <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
                </mesh>
            </group>

            {/* HARDWARE HACK BENCH / SOLDERING TOOLKIT ON RIGHT CORNER */}
            <group position={[1.2, 0.76, -0.2]}>
                {/* Tool Base */}
                <mesh castShadow position={[0, 0.02, 0]}>
                    <boxGeometry args={[0.28, 0.04, 0.22]} />
                    <meshStandardMaterial color="#111c2e" metalness={0.8} />
                </mesh>
                {/* Wire Spool */}
                <mesh position={[-0.07, 0.07, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.04, 0.04, 0.06, 12]} />
                    <meshStandardMaterial color="#ffb703" metalness={0.7} />
                </mesh>
                {/* Soldering Iron in Stand */}
                <mesh position={[0.06, 0.08, 0]} rotation={[0.4, 0, -0.4]}>
                    <cylinderGeometry args={[0.01, 0.015, 0.18, 8]} />
                    <meshStandardMaterial color="#334155" metalness={0.9} />
                </mesh>
            </group>

            {/* Tangled Glowing Neon Cables Snaking Under Desk */}
            <mesh position={[0.3, 0.08, -0.2]} rotation={[0, 0.5, 0]}>
                <torusGeometry args={[0.6, 0.02, 8, 32, Math.PI * 1.2]} />
                <meshBasicMaterial color="#00f5d4" toneMapped={false} />
            </mesh>
            <mesh position={[-0.4, 0.06, -0.1]} rotation={[0, -0.8, 0]}>
                <torusGeometry args={[0.8, 0.025, 8, 32, Math.PI * 0.9]} />
                <meshBasicMaterial color="#f72585" toneMapped={false} />
            </mesh>
            <mesh position={[0.8, 0.04, 0.1]} rotation={[0, 1.2, 0]}>
                <torusGeometry args={[0.5, 0.018, 8, 32, Math.PI * 1.4]} />
                <meshBasicMaterial color="#ffb703" toneMapped={false} />
            </mesh>

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

            {/* Ergonomic Swivel Gamer Chair */}
            <group position={[0, 0, 0.95]} rotation={[0, Math.PI, 0]}>
                <mesh position={[0, 0.1, 0]}>
                    <cylinderGeometry args={[0.3, 0.35, 0.05, 5]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.9} />
                </mesh>
                <mesh position={[0, 0.3, 0]}>
                    <cylinderGeometry args={[0.04, 0.04, 0.35, 12]} />
                    <meshStandardMaterial color="#334155" metalness={0.9} />
                </mesh>
                <mesh castShadow position={[0, 0.5, 0]}>
                    <boxGeometry args={[0.55, 0.1, 0.52]} />
                    <meshStandardMaterial color="#080e1a" roughness={0.7} />
                </mesh>
                <mesh castShadow position={[0, 0.88, -0.22]} rotation={[0.1, 0, 0]}>
                    <boxGeometry args={[0.48, 0.72, 0.1]} />
                    <meshStandardMaterial color="#0b1322" roughness={0.7} />
                </mesh>
                <mesh position={[0, 0.88, -0.27]} rotation={[0.1, 0, 0]}>
                    <planeGeometry args={[0.36, 0.6]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                </mesh>
                <mesh position={[-0.28, 0.65, 0]}>
                    <boxGeometry args={[0.08, 0.22, 0.32]} />
                    <meshStandardMaterial color="#1e293b" />
                </mesh>
                <mesh position={[0.28, 0.65, 0]}>
                    <boxGeometry args={[0.08, 0.22, 0.32]} />
                    <meshStandardMaterial color="#1e293b" />
                </mesh>
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
        const dummy = new THREE.Object3D();

        for (let i = 0; i < count; i++) {
            dummy.position.copy(ledData.positions[i]);
            dummy.updateMatrix();
            ledRef.current.setMatrixAt(i, dummy.matrix);

            const blink = Math.sin(time * 10 + i * 1.7) > 0.2;
            const c = blink ? ledData.colors[i] : new THREE.Color('#040810');
            ledRef.current.setColorAt(i, c);
        }
        ledRef.current.instanceColor!.needsUpdate = true;
        ledRef.current.instanceMatrix.needsUpdate = true;
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
// SUB-COMPONENT: Dynamic Atmosphere Window (Synchronized to Indian Time)
// -------------------------------------------------------------
function DynamicAtmosphereWindow({ environmentPhase }: { environmentPhase: EnvironmentPhase }) {
    const config = ENVIRONMENT_CONFIGS[environmentPhase];
    const rainRef = useRef<THREE.Points>(null);
    const traffic1Ref = useRef<THREE.Mesh>(null);
    const traffic2Ref = useRef<THREE.Mesh>(null);
    const treeGroupRef = useRef<THREE.Group>(null);

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

    useFrame((state, delta) => {
        const time = state.clock.elapsedTime;
        if (config.showRain && rainRef.current) {
            const pos = rainGeo.attributes.position.array as Float32Array;
            for (let i = 0; i < rainCount; i++) {
                pos[i * 3 + 1] -= delta * (1.5 + (i % 5) * 0.4);
                if (pos[i * 3 + 1] < 1.0) {
                    pos[i * 3 + 1] = 2.8;
                }
            }
            rainGeo.attributes.position.needsUpdate = true;
        }

        if (traffic1Ref.current) traffic1Ref.current.position.x = ((time * 2.2) % 12) - 6;
        if (traffic2Ref.current) traffic2Ref.current.position.x = 6 - ((time * 1.6) % 12);

        // Gentle breeze swaying the outdoor trees
        if (treeGroupRef.current) {
            treeGroupRef.current.rotation.z = Math.sin(time * 1.4) * 0.025;
        }
    });

    return (
        <group position={[0, 0, 0]}>
            {/* Window Outer Steel Frame with Mullions */}
            <mesh position={[0, 1.9, -3.46]}>
                <boxGeometry args={[3.8, 2.1, 0.08]} />
                <meshStandardMaterial color="#080e18" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Center Vertical Mullion */}
            <mesh position={[0, 1.9, -3.45]}>
                <boxGeometry args={[0.06, 2.05, 0.09]} />
                <meshStandardMaterial color="#080e18" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Glass Pane: Crystal clear with soft tint in daytime, moody dark tint at night */}
            <mesh position={[0, 1.9, -3.48]}>
                <planeGeometry args={[3.6, 1.9]} />
                <meshStandardMaterial
                    color={
                        environmentPhase === 'morning'
                            ? '#99f6e4'
                            : environmentPhase === 'evening'
                            ? '#fdba74'
                            : '#091426'
                    }
                    transparent
                    opacity={environmentPhase === 'night' ? 0.75 : 0.3}
                    roughness={0.1}
                    metalness={0.4}
                />
            </mesh>

            {/* Dripping Rain Particles (Rendered only at Night) */}
            {config.showRain && (
                <points ref={rainRef} geometry={rainGeo}>
                    <pointsMaterial color="#00f5d4" size={0.03} transparent opacity={0.65} toneMapped={false} />
                </points>
            )}

            {/* OUTSIDE WINDOW COURTYARD, SKY & MULTI-DEPTH ENVIRONMENT */}
            <group position={[0, 1.8, -5.5]}>
                {/* Sky Backdrop Plane (Color-coded to time of day) */}
                <mesh position={[0, 0, -1]}>
                    <planeGeometry args={[14, 8]} />
                    <meshBasicMaterial color={config.windowSkyTop} />
                </mesh>

                {/* MORNING / DAYTIME / EVENING: 3D GREEN CYBER TREES & FOLIAGE */}
                {config.showTrees && (
                    <group ref={treeGroupRef} position={[0, -0.6, 1.2]}>
                        {/* Tree 1: Left Foreground Canopy */}
                        <group position={[-1.6, 0, 0]}>
                            <mesh position={[0, 0.5, 0]}>
                                <cylinderGeometry args={[0.08, 0.14, 1.2, 8]} />
                                <meshStandardMaterial color="#1e293b" roughness={0.9} />
                            </mesh>
                            {/* Layered Green Foliage Spheres */}
                            <mesh position={[0, 1.2, 0]}>
                                <sphereGeometry args={[0.55, 12, 12]} />
                                <meshStandardMaterial
                                    color={environmentPhase === 'evening' ? '#d97706' : '#10b981'}
                                    roughness={0.7}
                                />
                            </mesh>
                            <mesh position={[0.2, 1.45, 0.1]}>
                                <sphereGeometry args={[0.42, 12, 12]} />
                                <meshStandardMaterial
                                    color={environmentPhase === 'evening' ? '#f59e0b' : '#34d399'}
                                    roughness={0.7}
                                />
                            </mesh>
                            <mesh position={[-0.15, 1.55, -0.1]}>
                                <sphereGeometry args={[0.38, 12, 12]} />
                                <meshStandardMaterial
                                    color={environmentPhase === 'evening' ? '#ea580c' : '#4ade80'}
                                    roughness={0.7}
                                />
                            </mesh>
                        </group>

                        {/* Tree 2: Center-Right Majestic Canopy */}
                        <group position={[1.4, 0.1, 0.2]}>
                            <mesh position={[0, 0.6, 0]}>
                                <cylinderGeometry args={[0.1, 0.16, 1.4, 8]} />
                                <meshStandardMaterial color="#1e293b" roughness={0.9} />
                            </mesh>
                            <mesh position={[0, 1.4, 0]}>
                                <sphereGeometry args={[0.68, 12, 12]} />
                                <meshStandardMaterial
                                    color={environmentPhase === 'evening' ? '#b45309' : '#059669'}
                                    roughness={0.7}
                                />
                            </mesh>
                            <mesh position={[-0.25, 1.7, 0.1]}>
                                <sphereGeometry args={[0.5, 12, 12]} />
                                <meshStandardMaterial
                                    color={environmentPhase === 'evening' ? '#d97706' : '#10b981'}
                                    roughness={0.7}
                                />
                            </mesh>
                            <mesh position={[0.2, 1.85, -0.1]}>
                                <sphereGeometry args={[0.42, 12, 12]} />
                                <meshStandardMaterial
                                    color={environmentPhase === 'evening' ? '#f59e0b' : '#34d399'}
                                    roughness={0.7}
                                />
                            </mesh>
                        </group>

                        {/* Tree 3: Distant Background Greenery */}
                        <group position={[-0.2, 0.2, -0.6]}>
                            <mesh position={[0, 1.1, 0]}>
                                <sphereGeometry args={[0.55, 10, 10]} />
                                <meshStandardMaterial
                                    color={environmentPhase === 'evening' ? '#92400e' : '#047857'}
                                    roughness={0.8}
                                />
                            </mesh>
                            <mesh position={[0.3, 1.35, 0]}>
                                <sphereGeometry args={[0.4, 10, 10]} />
                                <meshStandardMaterial
                                    color={environmentPhase === 'evening' ? '#b45309' : '#10b981'}
                                    roughness={0.8}
                                />
                            </mesh>
                        </group>

                        {/* Window Box Planter with Trailing Ivy on the sill */}
                        <group position={[0, 0.68, -0.1]}>
                            <mesh position={[0, 0, 0]}>
                                <boxGeometry args={[3.2, 0.12, 0.22]} />
                                <meshStandardMaterial color="#0f172a" roughness={0.8} />
                            </mesh>
                            {[-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2].map((x, i) => (
                                <mesh key={i} position={[x, 0.08, 0.08]}>
                                    <sphereGeometry args={[0.12, 8, 8]} />
                                    <meshStandardMaterial
                                        color={i % 2 === 0 ? '#10b981' : '#34d399'}
                                        roughness={0.6}
                                    />
                                </mesh>
                            ))}
                        </group>
                    </group>
                )}

                {/* DISTANT SKYLINE STRUCTURES */}
                <mesh position={[0, 0.8, -0.6]}>
                    <boxGeometry args={[2.8, 6.5, 0.5]} />
                    <meshStandardMaterial
                        color={environmentPhase === 'night' ? '#040710' : '#1e293b'}
                        roughness={0.9}
                    />
                </mesh>
                <mesh position={[-2.8, -0.4, 0]}>
                    <boxGeometry args={[1.2, 4.2, 0.6]} />
                    <meshStandardMaterial
                        color={environmentPhase === 'night' ? '#050a14' : '#334155'}
                        roughness={0.9}
                    />
                </mesh>
                <mesh position={[-0.9, -0.2, 0]}>
                    <boxGeometry args={[1.6, 5.0, 0.8]} />
                    <meshStandardMaterial
                        color={environmentPhase === 'night' ? '#080e1c' : '#1e293b'}
                        roughness={0.9}
                    />
                </mesh>
                <mesh position={[1.4, -0.6, 0]}>
                    <boxGeometry args={[1.4, 3.8, 0.7]} />
                    <meshStandardMaterial
                        color={environmentPhase === 'night' ? '#060c18' : '#334155'}
                        roughness={0.9}
                    />
                </mesh>
                <mesh position={[3.2, 0, 0]}>
                    <boxGeometry args={[1.5, 5.6, 0.9]} />
                    <meshStandardMaterial
                        color={environmentPhase === 'night' ? '#0a1224' : '#1e293b'}
                        roughness={0.9}
                    />
                </mesh>

                {/* Neon Billboard Signs (Active at Night & Evening) */}
                {(environmentPhase === 'night' || environmentPhase === 'evening') && (
                    <>
                        <mesh position={[-0.9, 1.2, 0.42]}>
                            <planeGeometry args={[1.2, 0.6]} />
                            <meshBasicMaterial color="#f72585" toneMapped={false} />
                        </mesh>
                        <mesh position={[1.4, 0.8, 0.37]}>
                            <planeGeometry args={[0.9, 0.4]} />
                            <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                        </mesh>
                        <mesh ref={traffic1Ref} position={[-6, 0.4, 0.8]}>
                            <boxGeometry args={[0.6, 0.04, 0.04]} />
                            <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                        </mesh>
                        <mesh ref={traffic2Ref} position={[6, -0.2, 0.6]}>
                            <boxGeometry args={[0.7, 0.04, 0.04]} />
                            <meshBasicMaterial color="#f72585" toneMapped={false} />
                        </mesh>
                    </>
                )}

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

    useFrame((_, delta) => {
        const pos = steamGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < 32; i++) {
            pos[i * 3 + 1] += delta * 0.22;
            pos[i * 3] += (Math.random() - 0.5) * delta * 0.05;
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
                <pointsMaterial color="#00f5d4" size={0.035} transparent opacity={0.45} toneMapped={false} />
            </points>
            <pointLight color="#ffb703" intensity={1.6} distance={2.2} decay={2} position={[0, 1.4, 0.2]} />
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Cyber Futon Platform Bed & Hologram Clock
// -------------------------------------------------------------
function CyberBedAndChillZone() {
    return (
        <group position={[-2.7, 0, 0.8]} rotation={[0, Math.PI / 2, 0]}>
            <mesh castShadow receiveShadow position={[0, 0.16, 0]}>
                <boxGeometry args={[1.4, 0.32, 2.3]} />
                <meshStandardMaterial color="#060910" roughness={0.7} metalness={0.3} />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
                <boxGeometry args={[1.44, 0.02, 2.34]} />
                <meshBasicMaterial color="#f72585" toneMapped={false} />
            </mesh>

            <mesh position={[0, 0.35, 0.1]} castShadow>
                <boxGeometry args={[1.3, 0.18, 2.1]} />
                <meshStandardMaterial color="#0d1527" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.45, 0.3]} castShadow>
                <boxGeometry args={[1.28, 0.08, 1.4]} />
                <meshStandardMaterial color="#13203b" roughness={0.7} />
            </mesh>
            <mesh position={[0.3, 0.48, -0.7]} rotation={[0.2, 0, 0]} castShadow>
                <boxGeometry args={[0.5, 0.14, 0.35]} />
                <meshStandardMaterial color="#1e293b" roughness={0.8} />
            </mesh>
            <mesh position={[-0.3, 0.48, -0.7]} rotation={[0.2, 0, 0]} castShadow>
                <boxGeometry args={[0.5, 0.14, 0.35]} />
                <meshStandardMaterial color="#1e293b" roughness={0.8} />
            </mesh>

            {/* Bedside Nightstand with Cyber Headphones on Stand */}
            <group position={[0.9, 0.25, -0.7]}>
                <mesh castShadow>
                    <boxGeometry args={[0.4, 0.5, 0.45]} />
                    <meshStandardMaterial color="#090e18" metalness={0.7} />
                </mesh>
                {/* Headphone Stand */}
                <mesh position={[0, 0.38, 0]}>
                    <cylinderGeometry args={[0.015, 0.015, 0.22, 8]} />
                    <meshStandardMaterial color="#00f5d4" metalness={0.9} />
                </mesh>
            </group>

            {/* Floating Holographic Cyber Clock */}
            <group position={[0.9, 0.68, -0.7]}>
                <mesh>
                    <boxGeometry args={[0.32, 0.12, 0.02]} />
                    <meshBasicMaterial color="#00f5d4" transparent opacity={0.8} toneMapped={false} />
                </mesh>
            </group>

            <pointLight color="#f72585" intensity={1.4} distance={2.4} decay={2} position={[0, 0.8, 0]} />
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Industrial Ceiling Ventilation Fan & Shadow Cast
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
            {/* Vent Housing */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1.3, 0.15, 1.3]} />
                <meshStandardMaterial color="#070b14" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Circular Vent Opening */}
            <mesh position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.42, 0.52, 24]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>

            {/* 4-Blade Rotating Fan Casting Ambient Shadows */}
            <group ref={fanRef} position={[0, -0.05, 0]}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]} castShadow>
                        <boxGeometry args={[0.12, 0.44, 0.02]} />
                        <meshStandardMaterial color="#04060c" metalness={0.95} roughness={0.15} />
                    </mesh>
                ))}
            </group>

            {/* Cyan Spotlight beaming down through the fan */}
            <spotLight
                position={[0, 0.2, 0]}
                angle={0.7}
                penumbra={0.85}
                intensity={1.4}
                color="#00f5d4"
                castShadow
            />
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Upper Wall Pipelines & Heavy Cable Conduits
// -------------------------------------------------------------
function WallPipelinesAndConduits() {
    return (
        <group>
            {/* Main Industrial Pipe across back wall */}
            <mesh position={[0, 3.2, -3.38]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.075, 0.075, 7.0, 16]} />
                <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.25} />
            </mesh>
            {/* Pipe Couplings with Amber Rings */}
            {[-2.2, -0.7, 0.8, 2.3].map((x, i) => (
                <mesh key={i} position={[x, 3.2, -3.38]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.095, 0.095, 0.08, 16]} />
                    <meshStandardMaterial color="#ffb703" metalness={0.7} roughness={0.3} />
                </mesh>
            ))}

            {/* Braided Neon Fiber Cables along left wall */}
            <mesh position={[-3.38, 3.05, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 6.8, 12]} />
                <meshBasicMaterial color="#00f5d4" toneMapped={false} />
            </mesh>
            <mesh position={[-3.38, 2.96, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 6.8, 12]} />
                <meshBasicMaterial color="#f72585" toneMapped={false} />
            </mesh>
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Shelves, Collectibles & Neon "THAT'S ME" Sign
// -------------------------------------------------------------
function CyberRoomDecor() {
    const signFlickerRef = useRef<THREE.MeshBasicMaterial>(null);

    useFrame((state) => {
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
    const count = 120;
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

    useFrame((state, delta) => {
        const p = geo.attributes.position.array as Float32Array;
        const t = state.clock.elapsedTime;
        for (let i = 0; i < count; i++) {
            p[i * 3 + 1] += Math.sin(t + i) * delta * 0.05;
            p[i * 3] += Math.cos(t * 0.5 + i) * delta * 0.03;
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
        useFrame((state) => {
            monitorTextures.update(state.clock.elapsedTime);
        });
        return null;
    }

    return (
        <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
            <Canvas
                shadows
                camera={{ position: [4.35, 3.88, 4.76], fov: 38 }}
                gl={{
                    antialias: true,
                    powerPreference: 'high-performance',
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: environmentPhase === 'morning' ? 1.4 : environmentPhase === 'afternoon' ? 1.35 : 1.25,
                }}
            >
                <SceneLoop />

                {/* Camera Choreography (Locked manual orbit or guided room tour) */}
                <CameraController
                    mode={cameraMode}
                    onDollyComplete={onDollyComplete}
                    onReturnComplete={onReturnComplete}
                    onTourPoiChange={onTourPoiChange}
                    onTourComplete={onTourComplete}
                />

                {/* Realistic Contact Shadows for all objects */}
                <ContactShadows
                    position={[0, 0.003, 0]}
                    opacity={0.75}
                    scale={10}
                    blur={2.0}
                    far={4.5}
                    resolution={1024}
                    color="#000000"
                />

                {/* Dynamic Ambient & Sun Atmospheric Lighting */}
                <ambientLight intensity={envConfig.ambientIntensity} color={envConfig.ambientColor} />
                <directionalLight
                    castShadow
                    position={envConfig.sunPosition}
                    intensity={envConfig.sunIntensity}
                    color={envConfig.sunColor}
                    shadow-mapSize={[2048, 2048]}
                    shadow-bias={-0.0001}
                />

                {/* Morning Sunlight Beam pouring through the window */}
                {environmentPhase === 'morning' && (
                    <spotLight
                        position={[0, 4.0, -3.8]}
                        target-position={[0, 0.7, 0]}
                        intensity={2.6}
                        color="#fef08a"
                        angle={0.85}
                        penumbra={0.65}
                        castShadow
                    />
                )}

                {/* Real Architectural Room: Hardwood Parquet, Acoustic Slat Walls, Rafter Ceiling, Loft Window */}
                <ArchitecturalRoom environmentPhase={environmentPhase} />
                <WallPipelinesAndConduits />
                <IndustrialCeilingVent />

                {/* Battlestation: Desk, Triple Monitors, Keyboard, Mat */}
                <BattlestationDesk />
                <BattlestationMonitors monitorTextures={monitorTextures} />

                {/* Autonomous Character Simulation (Aditya Ray) */}
                <CyberCharacter currentRoutine={currentRoutine} onRoutineChange={onRoutineChange} />

                {/* ANIMATED CYBER-DOG COMPANION ("Byte") */}
                <CyberDog characterRoutine={currentRoutine} />

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

                {/* 3D Floating Interactive POI Markers over Bed, Coffee Stand, Setup, and Dog */}
                <FloatingPoiMarkers
                    visible={cameraMode === 'orbit'}
                    onSelectSetup={onJackIn}
                    onSelectCoffee={() => onRoutineChange('walking_to_coffee', 'Heading to Neon Espresso Bar...')}
                    onSelectBed={() => onRoutineChange('walking_to_bed', 'Heading to Cyber Futon to Sleep...')}
                    onPetDog={() => {
                        audio.playDogBark();
                    }}
                />
            </Canvas>
        </div>
    );
}
