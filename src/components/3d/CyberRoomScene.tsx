'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import CyberCharacter, { CharacterRoutine } from './CyberCharacter';
import CameraController, { CameraMode } from './CameraController';
import { MonitorTextures } from './MonitorTextures';

interface CyberRoomSceneProps {
    cameraMode: CameraMode;
    onDollyComplete: () => void;
    onReturnComplete: () => void;
    currentRoutine: CharacterRoutine;
    onRoutineChange: (routine: CharacterRoutine, label: string) => void;
}

// -------------------------------------------------------------
// SUB-COMPONENT: Triple Monitors with Live Procedural Screens
// -------------------------------------------------------------
function BattlestationMonitors({ monitorTextures }: { monitorTextures: MonitorTextures }) {
    return (
        <group position={[0, 1.45, -0.9]}>
            {/* Monitor Mount Stand & Articulated Arms */}
            <mesh position={[0, -0.4, -0.1]}>
                <cylinderGeometry args={[0.04, 0.05, 0.8, 16]} />
                <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.78, 0]}>
                <boxGeometry args={[0.35, 0.04, 0.25]} />
                <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* 1. PRIMARY CENTER CURVED ULTRAWIDE MONITOR */}
            <group position={[0, 0, 0]}>
                {/* Frame */}
                <mesh castShadow>
                    <boxGeometry args={[1.5, 0.82, 0.06]} />
                    <meshStandardMaterial color="#0b0f19" metalness={0.8} roughness={0.3} />
                </mesh>
                {/* Glowing Screen Bezel Trim */}
                <mesh position={[0, 0, 0.032]}>
                    <boxGeometry args={[1.44, 0.76, 0.005]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                </mesh>
                {/* Active Screen Surface */}
                <mesh position={[0, 0, 0.035]}>
                    <planeGeometry args={[1.4, 0.72]} />
                    <meshBasicMaterial map={monitorTextures.centerTexture} toneMapped={false} />
                </mesh>
                {/* Monitor Face Light Emitted into Room */}
                <pointLight color="#00f5d4" intensity={1.8} distance={2.8} decay={2} position={[0, 0, 0.4]} />
            </group>

            {/* 2. LEFT MONITOR (Angled Inward 25 deg) */}
            <group position={[-1.15, 0.05, 0.18]} rotation={[0, 0.42, 0]}>
                {/* Frame */}
                <mesh castShadow>
                    <boxGeometry args={[0.82, 0.8, 0.05]} />
                    <meshStandardMaterial color="#0b0f19" metalness={0.8} roughness={0.3} />
                </mesh>
                {/* Active Screen Surface */}
                <mesh position={[0, 0, 0.028]}>
                    <planeGeometry args={[0.76, 0.74]} />
                    <meshBasicMaterial map={monitorTextures.leftTexture} toneMapped={false} />
                </mesh>
                <pointLight color="#ff0055" intensity={1.0} distance={2.0} decay={2} position={[0, 0, 0.3]} />
            </group>

            {/* 3. RIGHT MONITOR (Angled Inward -25 deg) */}
            <group position={[1.15, 0.05, 0.18]} rotation={[0, -0.42, 0]}>
                {/* Frame */}
                <mesh castShadow>
                    <boxGeometry args={[0.82, 0.8, 0.05]} />
                    <meshStandardMaterial color="#0b0f19" metalness={0.8} roughness={0.3} />
                </mesh>
                {/* Active Screen Surface */}
                <mesh position={[0, 0, 0.028]}>
                    <planeGeometry args={[0.76, 0.74]} />
                    <meshBasicMaterial map={monitorTextures.rightTexture} toneMapped={false} />
                </mesh>
                <pointLight color="#7209b7" intensity={1.0} distance={2.0} decay={2} position={[0, 0, 0.3]} />
            </group>
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Battlestation Desk, RGB Keyboard, Cables, Lamp
// -------------------------------------------------------------
function BattlestationDesk() {
    const lampFlickerRef = useRef<THREE.PointLight>(null);

    useFrame((state) => {
        if (lampFlickerRef.current) {
            // Subtle warm lamp hum flicker
            lampFlickerRef.current.intensity = 2.4 + Math.sin(state.clock.elapsedTime * 15) * 0.15;
        }
    });

    return (
        <group position={[0, 0, -0.7]}>
            {/* Desktop Surface */}
            <mesh receiveShadow castShadow position={[0, 0.72, 0]}>
                <boxGeometry args={[3.2, 0.06, 1.2]} />
                <meshStandardMaterial color="#090d16" roughness={0.4} metalness={0.6} />
            </mesh>

            {/* Desk Edge Neon Cyan Underglow Strip */}
            <mesh position={[0, 0.69, 0.602]}>
                <boxGeometry args={[3.2, 0.015, 0.01]} />
                <meshBasicMaterial color="#00f5d4" toneMapped={false} />
            </mesh>

            {/* Desk Steel Legs */}
            <mesh castShadow position={[-1.48, 0.36, 0]}>
                <boxGeometry args={[0.08, 0.72, 1.0]} />
                <meshStandardMaterial color="#05080f" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh castShadow position={[1.48, 0.36, 0]}>
                <boxGeometry args={[0.08, 0.72, 1.0]} />
                <meshStandardMaterial color="#05080f" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* RGB Mechanical Keyboard */}
            <group position={[0, 0.76, 0.15]}>
                <mesh castShadow>
                    <boxGeometry args={[0.55, 0.02, 0.2]} />
                    <meshStandardMaterial color="#111827" roughness={0.5} />
                </mesh>
                {/* Glowing Keycaps Array */}
                <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.5, 0.16]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                </mesh>
            </group>

            {/* Cyber Gaming Mouse & Mousepad */}
            <mesh position={[0.42, 0.755, 0.15]}>
                <boxGeometry args={[0.25, 0.005, 0.3]} />
                <meshStandardMaterial color="#020408" roughness={0.9} />
            </mesh>
            <mesh position={[0.42, 0.77, 0.15]} castShadow>
                <boxGeometry args={[0.08, 0.03, 0.14]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>
            {/* Mouse RGB Glow */}
            <mesh position={[0.42, 0.786, 0.15]}>
                <boxGeometry args={[0.02, 0.002, 0.06]} />
                <meshBasicMaterial color="#f72585" toneMapped={false} />
            </mesh>

            {/* Tangled Glowing Neon Cables Snaking Under Desk */}
            <mesh position={[0.3, 0.1, -0.2]} rotation={[0, 0.5, 0]}>
                <torusGeometry args={[0.6, 0.02, 8, 32, Math.PI * 1.2]} />
                <meshBasicMaterial color="#00f5d4" toneMapped={false} />
            </mesh>
            <mesh position={[-0.4, 0.08, -0.1]} rotation={[0, -0.8, 0]}>
                <torusGeometry args={[0.8, 0.025, 8, 32, Math.PI * 0.9]} />
                <meshBasicMaterial color="#f72585" toneMapped={false} />
            </mesh>
            <mesh position={[0.8, 0.05, 0.1]} rotation={[0, 1.2, 0]}>
                <torusGeometry args={[0.5, 0.018, 8, 32, Math.PI * 1.4]} />
                <meshBasicMaterial color="#ffb703" toneMapped={false} />
            </mesh>

            {/* ARTICULATED DESK LAMP WITH WARM AMBER GLOW */}
            <group position={[-1.2, 0.75, -0.3]}>
                {/* Lamp Base */}
                <mesh castShadow>
                    <cylinderGeometry args={[0.09, 0.1, 0.03, 16]} />
                    <meshStandardMaterial color="#ffb703" metalness={0.8} roughness={0.3} />
                </mesh>
                {/* Angled Arm */}
                <mesh position={[0.1, 0.22, 0.1]} rotation={[0, 0, -0.45]}>
                    <cylinderGeometry args={[0.015, 0.015, 0.45, 8]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
                </mesh>
                {/* Lamp Hood Shade */}
                <mesh position={[0.22, 0.42, 0.2]} rotation={[0.4, 0, -0.7]}>
                    <coneGeometry args={[0.12, 0.16, 16, 1, true]} />
                    <meshStandardMaterial color="#ffb703" metalness={0.7} roughness={0.3} side={THREE.DoubleSide} />
                </mesh>
                {/* Glowing Bulb */}
                <mesh position={[0.22, 0.38, 0.2]}>
                    <sphereGeometry args={[0.04, 16, 16]} />
                    <meshBasicMaterial color="#ffb703" toneMapped={false} />
                </mesh>
                {/* Warm Amber Spotlight */}
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
                {/* Wheeled Base */}
                <mesh position={[0, 0.1, 0]}>
                    <cylinderGeometry args={[0.3, 0.35, 0.05, 5]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.9} />
                </mesh>
                {/* Gas Cylinder */}
                <mesh position={[0, 0.3, 0]}>
                    <cylinderGeometry args={[0.04, 0.04, 0.35, 12]} />
                    <meshStandardMaterial color="#334155" metalness={0.9} />
                </mesh>
                {/* Seat Cushion */}
                <mesh castShadow position={[0, 0.5, 0]}>
                    <boxGeometry args={[0.55, 0.1, 0.52]} />
                    <meshStandardMaterial color="#080e1a" roughness={0.7} />
                </mesh>
                {/* Backrest with Cyber Cyan Wings */}
                <mesh castShadow position={[0, 0.88, -0.22]} rotation={[0.1, 0, 0]}>
                    <boxGeometry args={[0.48, 0.72, 0.1]} />
                    <meshStandardMaterial color="#0b1322" roughness={0.7} />
                </mesh>
                {/* Neon Piping on Chair Back */}
                <mesh position={[0, 0.88, -0.27]} rotation={[0.1, 0, 0]}>
                    <planeGeometry args={[0.36, 0.6]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                </mesh>
                {/* Armrests */}
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
// SUB-COMPONENT: Corner Server Racks with Blinking LED Arrays
// -------------------------------------------------------------
function ServerRackTower() {
    const ledRef = useRef<THREE.InstancedMesh>(null);
    const count = 48;

    const ledData = useMemo(() => {
        const positions: THREE.Vector3[] = [];
        const colors: THREE.Color[] = [];
        const colorPalette = [
            new THREE.Color('#00f5d4'), // Cyan
            new THREE.Color('#00f5d4'),
            new THREE.Color('#10b981'), // Green
            new THREE.Color('#f72585'), // Magenta
            new THREE.Color('#ffb703'), // Amber
            new THREE.Color('#040810'), // Dark (off)
        ];

        let idx = 0;
        for (let row = 0; row < 12; row++) {
            for (let col = 0; col < 4; col++) {
                positions.push(
                    new THREE.Vector3(
                        -0.24 + col * 0.16,
                        0.35 + row * 0.18,
                        0.38
                    )
                );
                colors.push(colorPalette[Math.floor(Math.random() * colorPalette.length)]);
                idx++;
            }
        }
        return { positions, colors };
    }, []);

    useFrame((state) => {
        if (!ledRef.current) return;
        const time = state.clock.elapsedTime;
        const matrix = new THREE.Matrix4();
        const dummy = new THREE.Object3D();

        for (let i = 0; i < count; i++) {
            dummy.position.copy(ledData.positions[i]);
            dummy.updateMatrix();
            ledRef.current.setMatrixAt(i, dummy.matrix);

            // Random blinking
            const blink = Math.sin(time * 8 + i * 1.7) > 0.3;
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
                <meshStandardMaterial color="#070b12" roughness={0.5} metalness={0.7} />
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
                    <meshStandardMaterial color="#111c2e" metalness={0.8} roughness={0.3} />
                </mesh>
            ))}

            {/* Blinking Status LED Array */}
            <instancedMesh ref={ledRef} args={[undefined, undefined, count]}>
                <sphereGeometry args={[0.014, 8, 8]} />
                <meshBasicMaterial toneMapped={false} />
            </instancedMesh>

            {/* Internal Server Rack Glow Light */}
            <pointLight color="#00f5d4" intensity={1.5} distance={2.5} decay={2} position={[0, 1.4, 0.5]} />
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Rainy Window with Cyber City Skyline & Traffic
// -------------------------------------------------------------
function RainyCyberWindow() {
    const rainRef = useRef<THREE.Points>(null);
    const traffic1Ref = useRef<THREE.Mesh>(null);
    const traffic2Ref = useRef<THREE.Mesh>(null);

    // Particle rain sliding down window pane
    const rainCount = 180;
    const { rainGeo, rainPositions } = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(rainCount * 3);
        for (let i = 0; i < rainCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 3.4;
            pos[i * 3 + 1] = 1.0 + Math.random() * 1.8;
            pos[i * 3 + 2] = -3.48; // Window surface
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        return { rainGeo: geo, rainPositions: pos };
    }, []);

    useFrame((state, delta) => {
        // Animate rain drops dripping downward
        const pos = rainGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < rainCount; i++) {
            pos[i * 3 + 1] -= delta * (1.5 + (i % 5) * 0.4);
            if (pos[i * 3 + 1] < 1.0) {
                pos[i * 3 + 1] = 2.8;
            }
        }
        rainGeo.attributes.position.needsUpdate = true;

        // Animate flying cyber hover-car traffic outside window
        const time = state.clock.elapsedTime;
        if (traffic1Ref.current) {
            traffic1Ref.current.position.x = ((time * 2.2) % 12) - 6;
        }
        if (traffic2Ref.current) {
            traffic2Ref.current.position.x = 6 - ((time * 1.6) % 12);
        }
    });

    return (
        <group position={[0, 0, 0]}>
            {/* Window Outer Frame */}
            <mesh position={[0, 1.9, -3.46]}>
                <boxGeometry args={[3.8, 2.1, 0.08]} />
                <meshStandardMaterial color="#080e18" metalness={0.9} roughness={0.3} />
            </mesh>

            {/* Glass Pane */}
            <mesh position={[0, 1.9, -3.48]}>
                <planeGeometry args={[3.6, 1.9]} />
                <meshStandardMaterial
                    color="#091426"
                    transparent
                    opacity={0.75}
                    roughness={0.1}
                    metalness={0.6}
                />
            </mesh>

            {/* Streaking Rain Drops on Glass */}
            <points ref={rainRef} geometry={rainGeo}>
                <pointsMaterial color="#00f5d4" size={0.03} transparent opacity={0.65} toneMapped={false} />
            </points>

            {/* CYBER CITY SKYLINE OUTSIDE WINDOW */}
            <group position={[0, 1.8, -5.5]}>
                {/* Deep Moody City Sky Backdrop */}
                <mesh position={[0, 0, -1]}>
                    <planeGeometry args={[14, 8]} />
                    <meshBasicMaterial color="#02040a" />
                </mesh>

                {/* Distant Skyscrapers */}
                <mesh position={[-2.8, -0.4, 0]}>
                    <boxGeometry args={[1.2, 4.2, 0.6]} />
                    <meshStandardMaterial color="#050a14" roughness={0.9} />
                </mesh>
                <mesh position={[-0.9, -0.2, 0]}>
                    <boxGeometry args={[1.6, 5.0, 0.8]} />
                    <meshStandardMaterial color="#080e1c" roughness={0.9} />
                </mesh>
                <mesh position={[1.4, -0.6, 0]}>
                    <boxGeometry args={[1.4, 3.8, 0.7]} />
                    <meshStandardMaterial color="#060c18" roughness={0.9} />
                </mesh>
                <mesh position={[3.2, 0, 0]}>
                    <boxGeometry args={[1.5, 5.6, 0.9]} />
                    <meshStandardMaterial color="#0a1224" roughness={0.9} />
                </mesh>

                {/* Neon Billboards on Buildings */}
                <mesh position={[-0.9, 1.2, 0.42]}>
                    <planeGeometry args={[1.2, 0.6]} />
                    <meshBasicMaterial color="#f72585" toneMapped={false} />
                </mesh>
                <mesh position={[1.4, 0.8, 0.37]}>
                    <planeGeometry args={[0.9, 0.4]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                </mesh>

                {/* Flying Hover-Car Light Trails (Traffic) */}
                <mesh ref={traffic1Ref} position={[-6, 0.4, 0.8]}>
                    <boxGeometry args={[0.6, 0.04, 0.04]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                </mesh>
                <mesh ref={traffic2Ref} position={[6, -0.2, 0.6]}>
                    <boxGeometry args={[0.7, 0.04, 0.04]} />
                    <meshBasicMaterial color="#f72585" toneMapped={false} />
                </mesh>

                {/* City Neon Ambient Light */}
                <pointLight color="#3a86ff" intensity={1.8} distance={8} decay={2} position={[0, 1.2, -1]} />
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
            {/* Industrial Countertop */}
            <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
                <boxGeometry args={[1.4, 0.9, 0.7]} />
                <meshStandardMaterial color="#0c121e" roughness={0.4} metalness={0.7} />
            </mesh>
            {/* Neon Amber Accent Edge */}
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
                {/* Illuminated Cyan Fluid Tube / Water Reservoir */}
                <mesh position={[0.18, 0.28, -0.1]}>
                    <cylinderGeometry args={[0.06, 0.06, 0.38, 16]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                </mesh>
                {/* Chrome Drip Head & Tray */}
                <mesh position={[-0.08, 0.12, 0.15]}>
                    <cylinderGeometry args={[0.04, 0.04, 0.1, 12]} />
                    <meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.1} />
                </mesh>
                {/* Coffee Mug on Tray */}
                <mesh position={[-0.08, 0.06, 0.15]} castShadow>
                    <cylinderGeometry args={[0.045, 0.04, 0.09, 16]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.5} />
                </mesh>
                {/* Steaming Coffee Fluid Surface */}
                <mesh position={[-0.08, 0.095, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[0.04, 16]} />
                    <meshBasicMaterial color="#3d1e08" />
                </mesh>
            </group>

            {/* Rising Steam Particle Cloud */}
            <points position={[-0.08, 0.1, 0.1]} geometry={steamGeo}>
                <pointsMaterial color="#00f5d4" size={0.035} transparent opacity={0.45} toneMapped={false} />
            </points>

            {/* Warm Coffee Bar Lighting */}
            <pointLight color="#ffb703" intensity={1.6} distance={2.2} decay={2} position={[0, 1.4, 0.2]} />
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Cyber Futon Platform Bed & Hologram Clock
// -------------------------------------------------------------
function CyberBedAndChillZone() {
    const [clockTime, setClockTime] = useState('00:00:00');

    useEffect(() => {
        const updateClock = () => {
            const d = new Date();
            setClockTime(
                d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
            );
        };
        updateClock();
        const id = setInterval(updateClock, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <group position={[-2.7, 0, 0.8]} rotation={[0, Math.PI / 2, 0]}>
            {/* Low-profile Platform Bed Frame */}
            <mesh castShadow receiveShadow position={[0, 0.16, 0]}>
                <boxGeometry args={[1.4, 0.32, 2.3]} />
                <meshStandardMaterial color="#060910" roughness={0.7} metalness={0.3} />
            </mesh>

            {/* Glowing Magenta Underglow Strip around Bed Frame */}
            <mesh position={[0, 0.02, 0]}>
                <boxGeometry args={[1.44, 0.02, 2.34]} />
                <meshBasicMaterial color="#f72585" toneMapped={false} />
            </mesh>

            {/* Mattress & Cyber Duvet */}
            <mesh position={[0, 0.35, 0.1]} castShadow>
                <boxGeometry args={[1.3, 0.18, 2.1]} />
                <meshStandardMaterial color="#0d1527" roughness={0.8} />
            </mesh>
            {/* Folded Duvet Accent (Geometric Fold) */}
            <mesh position={[0, 0.45, 0.3]} castShadow>
                <boxGeometry args={[1.28, 0.08, 1.4]} />
                <meshStandardMaterial color="#13203b" roughness={0.7} />
            </mesh>
            {/* Pillows */}
            <mesh position={[0.3, 0.48, -0.7]} rotation={[0.2, 0, 0]} castShadow>
                <boxGeometry args={[0.5, 0.14, 0.35]} />
                <meshStandardMaterial color="#1e293b" roughness={0.8} />
            </mesh>
            <mesh position={[-0.3, 0.48, -0.7]} rotation={[0.2, 0, 0]} castShadow>
                <boxGeometry args={[0.5, 0.14, 0.35]} />
                <meshStandardMaterial color="#1e293b" roughness={0.8} />
            </mesh>

            {/* Bedside Nightstand */}
            <mesh position={[0.9, 0.25, -0.7]} castShadow>
                <boxGeometry args={[0.4, 0.5, 0.45]} />
                <meshStandardMaterial color="#090e18" metalness={0.7} />
            </mesh>

            {/* Floating Holographic Cyber Clock */}
            <group position={[0.9, 0.68, -0.7]}>
                <mesh>
                    <boxGeometry args={[0.32, 0.12, 0.02]} />
                    <meshBasicMaterial color="#00f5d4" transparent opacity={0.8} toneMapped={false} />
                </mesh>
            </group>

            {/* Relaxing Bed Ambient Light */}
            <pointLight color="#f72585" intensity={1.4} distance={2.4} decay={2} position={[0, 0.8, 0]} />
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
            // Neon sign intermittent glitch flicker
            const t = state.clock.elapsedTime;
            const flicker = Math.sin(t * 12) > -0.7 ? 1.0 : 0.2;
            signFlickerRef.current.opacity = 0.85 * flicker;
        }
    });

    return (
        <group>
            {/* FLOATING WALL SHELVES (LEFT WALL) */}
            <group position={[-3.4, 2.2, 0.6]} rotation={[0, Math.PI / 2, 0]}>
                {/* Upper Shelf */}
                <mesh castShadow>
                    <boxGeometry args={[1.8, 0.04, 0.28]} />
                    <meshStandardMaterial color="#0b1220" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Retro Game Cartridges (Pixel Jeff Mario Homage) */}
                <mesh position={[-0.5, 0.1, 0]} castShadow>
                    <boxGeometry args={[0.15, 0.16, 0.03]} />
                    <meshStandardMaterial color="#e63946" />
                </mesh>
                <mesh position={[-0.3, 0.1, 0]} castShadow>
                    <boxGeometry args={[0.15, 0.16, 0.03]} />
                    <meshStandardMaterial color="#ffb703" />
                </mesh>
                {/* Pixel Mushroom Collectible Figurine */}
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
                {/* Bioluminescent Cyber Bonsai Plant */}
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
                {/* Backing plate */}
                <mesh>
                    <boxGeometry args={[1.6, 0.45, 0.02]} />
                    <meshStandardMaterial color="#050810" roughness={0.9} />
                </mesh>
                {/* Outer Neon Border */}
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

            {/* FLOATING CYBER DUST PARTICLES */}
            <CyberDustMotes />
        </group>
    );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Floating Cyber Dust Motes in Neon Light Rays
// -------------------------------------------------------------
function CyberDustMotes() {
    const count = 120;
    const { geo, posArray } = useMemo(() => {
        const g = new THREE.BufferGeometry();
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 6.5;
            p[i * 3 + 1] = 0.5 + Math.random() * 3.0;
            p[i * 3 + 2] = (Math.random() - 0.5) * 6.5;
        }
        g.setAttribute('position', new THREE.BufferAttribute(p, 3));
        return { geo: g, posArray: p };
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
// SUB-COMPONENT: Diorama Architecture (Walls, Grid Floor)
// -------------------------------------------------------------
function DioramaRoomGeometry() {
    return (
        <group>
            {/* Dark Reflective Grid Floor */}
            <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[7.2, 7.2]} />
                <meshStandardMaterial
                    color="#040710"
                    roughness={0.25}
                    metalness={0.7}
                />
            </mesh>

            {/* Glowing Floor Grid Lines */}
            <gridHelper args={[7.2, 24, '#00f5d4', '#0d1d36']} position={[0, 0.005, 0]} />

            {/* Back Wall */}
            <mesh receiveShadow position={[0, 1.8, -3.5]}>
                <planeGeometry args={[7.2, 3.6]} />
                <meshStandardMaterial color="#060a14" roughness={0.8} />
            </mesh>

            {/* Left Wall */}
            <mesh receiveShadow position={[-3.5, 1.8, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[7.2, 3.6]} />
                <meshStandardMaterial color="#050812" roughness={0.8} />
            </mesh>

            {/* Right Wall (Partial cutaway) */}
            <mesh receiveShadow position={[3.5, 1.8, -1.8]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[3.6, 3.6]} />
                <meshStandardMaterial color="#050812" roughness={0.8} />
            </mesh>

            {/* Baseboard Neon Light Strips */}
            <mesh position={[0, 0.02, -3.48]}>
                <boxGeometry args={[7.2, 0.03, 0.02]} />
                <meshBasicMaterial color="#00f5d4" toneMapped={false} />
            </mesh>
            <mesh position={[-3.48, 0.02, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[7.2, 0.03, 0.02]} />
                <meshBasicMaterial color="#f72585" toneMapped={false} />
            </mesh>
        </group>
    );
}

// -------------------------------------------------------------
// MAIN SCENE ROOT EXPORT
// -------------------------------------------------------------
export default function CyberRoomScene({
    cameraMode,
    onDollyComplete,
    onReturnComplete,
    currentRoutine,
    onRoutineChange,
}: CyberRoomSceneProps) {
    // Instantiate dynamic procedural canvas textures for monitors
    const monitorTextures = useMemo(() => new MonitorTextures(), []);

    // Clean up textures on unmount
    useEffect(() => {
        return () => monitorTextures.destroy();
    }, [monitorTextures]);

    // R3F loop update
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
                camera={{ position: [6.5, 5.5, 6.5], fov: 42 }}
                gl={{
                    antialias: true,
                    powerPreference: 'high-performance',
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2,
                }}
            >
                {/* R3F Dynamic Code Loop */}
                <SceneLoop />

                {/* Camera Choreography Controller */}
                <CameraController
                    mode={cameraMode}
                    onDollyComplete={onDollyComplete}
                    onReturnComplete={onReturnComplete}
                />

                {/* Ambient Atmospheric Lighting */}
                <ambientLight intensity={0.45} color="#0d1b2a" />
                <directionalLight
                    castShadow
                    position={[5, 8, 4]}
                    intensity={0.7}
                    color="#e0fbfc"
                    shadow-mapSize={[2048, 2048]}
                    shadow-bias={-0.0001}
                />

                {/* Room Geometry: Floor, Walls, Conduits */}
                <DioramaRoomGeometry />

                {/* Battlestation Setup: Desk, Monitors, Cables, Lamp */}
                <BattlestationDesk />
                <BattlestationMonitors monitorTextures={monitorTextures} />

                {/* Autonomous Character Simulation (Aditya Ray) */}
                <CyberCharacter
                    currentRoutine={currentRoutine}
                    onRoutineChange={onRoutineChange}
                />

                {/* Corner Server Rack with Blinking LEDs */}
                <ServerRackTower />

                {/* Dystopian Rainy Window & City Outside */}
                <RainyCyberWindow />

                {/* Coffee Station / Espresso Bar */}
                <CoffeeStation />

                {/* Cozy Futon Bed & Chill Zone */}
                <CyberBedAndChillZone />

                {/* Shelves & Decor (Pixel Jeff inspired) */}
                <CyberRoomDecor />
            </Canvas>
        </div>
    );
}
