'use client';

import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CharacterRoutine } from './CyberCharacter';
import { audio } from '@/lib/audio';

interface CyberDogProps {
    characterRoutine: CharacterRoutine;
    petTrigger?: number;
}

export default function CyberDog({ characterRoutine, petTrigger }: CyberDogProps) {
    const dogGroupRef = useRef<THREE.Group>(null);
    const dogBodyRef = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Group>(null);
    const tailRef = useRef<THREE.Group>(null);

    // Interactive petting state
    const [isExcited, setIsExcited] = useState(false);
    const [hovered, setHovered] = useState(false);
    const excitedTimerRef = useRef(0);
    const prevPetTriggerRef = useRef(petTrigger);

    const isSleepingTime = characterRoutine === 'walking_to_bed' || characterRoutine === 'resting_bed';

    // Respond whenever user clicks "Pet Me! 🐕" floating marker
    React.useEffect(() => {
        if (petTrigger !== undefined && petTrigger !== prevPetTriggerRef.current) {
            prevPetTriggerRef.current = petTrigger;
            setIsExcited(true);
            excitedTimerRef.current = 4.5;
        }
    }, [petTrigger]);

    const handleDogClick = (e: any) => {
        e.stopPropagation();
        audio.playDogBark();
        setIsExcited(true);
        excitedTimerRef.current = 4.5;
    };

    useFrame((state, delta) => {
        const dt = Math.min(0.05, delta);
        const time = state.clock.getElapsedTime();

        // Excited timer countdown
        if (isExcited) {
            excitedTimerRef.current -= dt;
            if (excitedTimerRef.current <= 0) {
                setIsExcited(false);
            }
        }

        // ============================================================
        // NATURAL WHOLE-BODY ANIMAL MOTION (NO DISJOINTED ODD PARTS)
        // ============================================================
        if (dogBodyRef.current) {
            const breathSpeed = isSleepingTime ? 1.1 : isExcited ? 3.8 : 1.6;
            const breathAmp = isSleepingTime ? 0.012 : isExcited ? 0.024 : 0.016;

            // Natural organic chest breathing pulse on the unified body
            dogBodyRef.current.scale.y = 1 + Math.sin(time * breathSpeed) * breathAmp;
            dogBodyRef.current.scale.x = 1 + Math.sin(time * breathSpeed) * (breathAmp * 0.6);
            dogBodyRef.current.position.y = 0.11 + Math.sin(time * breathSpeed) * 0.003;
        }

        // Gentle, curious or sleepy head movement
        if (headRef.current) {
            if (isSleepingTime) {
                // Sleeping: head resting down flat and calm
                headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0.28, Math.min(1, dt * 4));
                headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, 0.05, Math.min(1, dt * 4));
                headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, 0.08, Math.min(1, dt * 4));
            } else if (isExcited) {
                // Excited when petted: head perked up, looking happily at user
                headRef.current.rotation.x = -0.15 + Math.sin(time * 8) * 0.04;
                headRef.current.rotation.y = Math.sin(time * 5) * 0.08;
                headRef.current.rotation.z = Math.sin(time * 4) * 0.05;
            } else {
                // Calm resting: gentle, peaceful subtle glance
                headRef.current.rotation.x = 0.08 + Math.sin(time * 0.7) * 0.03;
                headRef.current.rotation.y = Math.sin(time * 0.5) * 0.08;
                headRef.current.rotation.z = Math.sin(time * 0.4) * 0.04;
            }
        }

        // Natural curled tail motion
        if (tailRef.current) {
            if (isSleepingTime) {
                // Sleepy slow gentle twitch
                tailRef.current.rotation.y = 0.35 + Math.sin(time * 0.8) * 0.04;
            } else if (isExcited) {
                // Happy fast wag when petted
                tailRef.current.rotation.y = Math.sin(time * 16) * 0.35;
            } else {
                // Calm resting wag
                tailRef.current.rotation.y = 0.25 + Math.sin(time * 1.8) * 0.12;
            }
        }
    });

    return (
        <group>
            {/* ============================================================ */}
            {/* 1. SEPARATE LUXURY 3D DOG BED ("HOME BASE")                 */}
            {/* ============================================================ */}
            <group position={[1.15, 0, 0.75]}>
                {/* Curved Bentwood Bed Base Tray */}
                <mesh castShadow receiveShadow position={[0, 0.04, 0]}>
                    <cylinderGeometry args={[0.42, 0.44, 0.08, 32]} />
                    <meshStandardMaterial color="#6a4c33" roughness={0.5} />
                </mesh>

                {/* Raised Padded Bolster Cushion Rim */}
                <mesh castShadow position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.34, 0.085, 16, 32]} />
                    <meshStandardMaterial color="#ded7cb" roughness={0.88} />
                </mesh>

                {/* Ultra-Soft Tufted Center Mattress Cushion */}
                <mesh receiveShadow position={[0, 0.09, 0]}>
                    <cylinderGeometry args={[0.34, 0.34, 0.06, 24]} />
                    <meshStandardMaterial color="#eae4d8" roughness={0.92} />
                </mesh>

                {/* Cozy Plaid Accent Blanket */}
                <mesh position={[0.18, 0.12, 0.18]} rotation={[0.2, 0.4, -0.1]} castShadow>
                    <boxGeometry args={[0.22, 0.02, 0.28]} />
                    <meshStandardMaterial color="#d97706" roughness={0.8} />
                </mesh>

                {/* Elevated Wooden Double Dog Bowl Stand */}
                <group position={[0.55, 0, -0.2]}>
                    <mesh castShadow position={[0, 0.04, 0]}>
                        <boxGeometry args={[0.36, 0.08, 0.18]} />
                        <meshStandardMaterial color="#5a3d28" roughness={0.5} />
                    </mesh>
                    {/* Ceramic Water Bowl with Cool Water Surface */}
                    <mesh castShadow position={[-0.09, 0.08, 0]}>
                        <cylinderGeometry args={[0.065, 0.05, 0.06, 16]} />
                        <meshStandardMaterial color="#ffffff" roughness={0.2} />
                    </mesh>
                    <mesh position={[-0.09, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <circleGeometry args={[0.055, 16]} />
                        <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} />
                    </mesh>
                    {/* Ceramic Food Bowl with Kibble */}
                    <mesh castShadow position={[0.09, 0.08, 0]}>
                        <cylinderGeometry args={[0.065, 0.05, 0.06, 16]} />
                        <meshStandardMaterial color="#ffffff" roughness={0.2} />
                    </mesh>
                    <mesh position={[0.09, 0.095, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <circleGeometry args={[0.055, 16]} />
                        <meshStandardMaterial color="#78350f" roughness={0.9} />
                    </mesh>
                </group>

                {/* Yellow-Green Felt Tennis Ball Beside Bed */}
                <group position={[0.38, 0.05, 0.28]}>
                    <mesh castShadow receiveShadow>
                        <sphereGeometry args={[0.05, 16, 16]} />
                        <meshStandardMaterial color="#d4e157" roughness={0.8} />
                    </mesh>
                    <mesh rotation={[0.4, 0.5, 0]}>
                        <torusGeometry args={[0.0505, 0.004, 8, 24]} />
                        <meshStandardMaterial color="#ffffff" roughness={0.6} />
                    </mesh>
                </group>
            </group>

            {/* ============================================================ */}
            {/* 2. GOLDEN RETRIEVER COMPANION (ONE UNIFIED ORGANIC ENTITY)   */}
            {/* ============================================================ */}
            <group
                ref={dogGroupRef}
                position={[1.15, 0.06, 0.75]}
                rotation={[0, -Math.PI / 4, 0]}
                onClick={handleDogClick}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHovered(true);
                    document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                    setHovered(false);
                    document.body.style.cursor = 'auto';
                }}
            >
                {/* UNIFIED SCULPTED GOLDEN RETRIEVER BODY */}
                <group ref={dogBodyRef} position={[0, 0.11, 0]}>
                    {/* Main Torso: Rounded, muscular body resting naturally inside bed */}
                    <mesh castShadow position={[0, 0.05, 0]}>
                        <sphereGeometry args={[0.19, 20, 16]} />
                        <meshStandardMaterial color="#df9b3a" roughness={0.75} />
                    </mesh>

                    {/* Elongated Flank / Haunch Volume */}
                    <mesh castShadow position={[0, 0.04, 0.09]}>
                        <sphereGeometry args={[0.16, 18, 14]} />
                        <meshStandardMaterial color="#d99333" roughness={0.75} />
                    </mesh>

                    {/* Soft Golden-Cream Chest & Underbelly Marking */}
                    <mesh position={[0, -0.01, -0.06]}>
                        <sphereGeometry args={[0.155, 16, 14]} />
                        <meshStandardMaterial color="#f7dfa6" roughness={0.85} />
                    </mesh>

                    {/* Left Tucked Paws (Integrated naturally under chest) */}
                    <group position={[-0.08, -0.03, -0.15]}>
                        <mesh castShadow>
                            <boxGeometry args={[0.075, 0.05, 0.14]} />
                            <meshStandardMaterial color="#df9b3a" roughness={0.75} />
                        </mesh>
                        <mesh position={[0, -0.01, -0.05]} castShadow>
                            <sphereGeometry args={[0.042, 10, 8]} />
                            <meshStandardMaterial color="#faeed6" roughness={0.85} />
                        </mesh>
                    </group>

                    {/* Right Tucked Paws (Integrated naturally under chest) */}
                    <group position={[0.08, -0.03, -0.15]}>
                        <mesh castShadow>
                            <boxGeometry args={[0.075, 0.05, 0.14]} />
                            <meshStandardMaterial color="#df9b3a" roughness={0.75} />
                        </mesh>
                        <mesh position={[0, -0.01, -0.05]} castShadow>
                            <sphereGeometry args={[0.042, 10, 8]} />
                            <meshStandardMaterial color="#faeed6" roughness={0.85} />
                        </mesh>
                    </group>

                    {/* Left & Right Curled Hind Thighs */}
                    <mesh castShadow position={[-0.14, 0.03, 0.07]} rotation={[0.2, 0.3, -0.1]}>
                        <sphereGeometry args={[0.09, 12, 10]} />
                        <meshStandardMaterial color="#d99333" roughness={0.75} />
                    </mesh>
                    <mesh castShadow position={[0.14, 0.03, 0.07]} rotation={[0.2, -0.3, 0.1]}>
                        <sphereGeometry args={[0.09, 12, 10]} />
                        <meshStandardMaterial color="#d99333" roughness={0.75} />
                    </mesh>

                    {/* Classic Saddle-Brown Leather Collar with Polished Brass Tag */}
                    <group position={[0, 0.12, -0.12]} rotation={[0.35, 0, 0]}>
                        <mesh>
                            <torusGeometry args={[0.12, 0.016, 8, 24]} />
                            <meshStandardMaterial color="#543011" roughness={0.45} />
                        </mesh>
                        <mesh position={[0, -0.11, 0.02]} castShadow>
                            <cylinderGeometry args={[0.02, 0.02, 0.005, 16]} />
                            <meshStandardMaterial color="#eab308" metalness={0.92} roughness={0.15} />
                        </mesh>
                    </group>

                    {/* RETRIEVER HEAD & FAITHFUL FACE */}
                    <group ref={headRef} position={[0, 0.16, -0.18]}>
                        {/* Cranium with Gentle Forehead Slope */}
                        <mesh castShadow position={[0, 0.04, 0]}>
                            <sphereGeometry args={[0.115, 18, 16]} />
                            <meshStandardMaterial color="#df9b3a" roughness={0.75} />
                        </mesh>

                        {/* Soft Golden Retriever Muzzle & Snout */}
                        <group position={[0, 0.01, -0.10]}>
                            <mesh castShadow rotation={[0.1, 0, 0]}>
                                <cylinderGeometry args={[0.048, 0.072, 0.12, 14]} />
                                <meshStandardMaterial color="#f0cb85" roughness={0.8} />
                            </mesh>
                            {/* Moist Black Button Nose */}
                            <mesh position={[0, 0.025, -0.07]} castShadow>
                                <boxGeometry args={[0.042, 0.03, 0.024]} />
                                <meshStandardMaterial color="#0a0a0c" roughness={0.15} metalness={0.1} />
                            </mesh>
                            {/* Soft Dark Smile Cleft */}
                            <mesh position={[0, -0.015, -0.06]}>
                                <boxGeometry args={[0.008, 0.012, 0.035]} />
                                <meshStandardMaterial color="#1a110a" roughness={0.6} />
                            </mesh>
                        </group>

                        {/* Warm Soulful Dark Brown Eyes */}
                        <mesh position={[-0.05, 0.055, -0.08]} castShadow>
                            <sphereGeometry args={[0.016, 12, 12]} />
                            <meshStandardMaterial color="#1c120c" roughness={0.1} metalness={0.2} />
                        </mesh>
                        <mesh position={[0.05, 0.055, -0.08]} castShadow>
                            <sphereGeometry args={[0.016, 12, 12]} />
                            <meshStandardMaterial color="#1c120c" roughness={0.1} metalness={0.2} />
                        </mesh>

                        {/* SOFT FLOPPY DROPPED RETRIEVER EARS (Naturally Draped) */}
                        <mesh castShadow position={[-0.095, -0.01, -0.01]} rotation={[0.2, 0, -0.25]}>
                            <boxGeometry args={[0.048, 0.14, 0.022]} />
                            <meshStandardMaterial color="#c98224" roughness={0.8} />
                        </mesh>
                        <mesh castShadow position={[0.095, -0.01, -0.01]} rotation={[0.2, 0, 0.25]}>
                            <boxGeometry args={[0.048, 0.14, 0.022]} />
                            <meshStandardMaterial color="#c98224" roughness={0.8} />
                        </mesh>
                    </group>

                    {/* FEATHERED PLUMED RETRIEVER TAIL (Curled Gently Along Bed) */}
                    <group ref={tailRef} position={[0, 0.04, 0.18]}>
                        <mesh castShadow position={[-0.06, 0.02, 0.08]} rotation={[0.3, -0.6, 0.2]}>
                            <cylinderGeometry args={[0.032, 0.042, 0.18, 12]} />
                            <meshStandardMaterial color="#df9b3a" roughness={0.8} />
                        </mesh>
                        <mesh castShadow position={[-0.14, 0.03, 0.16]} rotation={[0.2, -1.2, 0.3]}>
                            <cylinderGeometry args={[0.022, 0.032, 0.16, 12]} />
                            <meshStandardMaterial color="#f0cb85" roughness={0.85} />
                        </mesh>
                    </group>
                </group>

                {/* Floating Interactive Hover Prompt */}
                {hovered && (
                    <mesh position={[0, 0.55, 0]}>
                        <boxGeometry args={[0.26, 0.07, 0.01]} />
                        <meshBasicMaterial color="#f59e0b" transparent opacity={0.9} toneMapped={false} />
                    </mesh>
                )}
            </group>
        </group>
    );
}
