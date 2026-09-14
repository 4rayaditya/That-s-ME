'use client';

import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export type CharacterRoutine =
    | 'coding'
    | 'walking_to_coffee'
    | 'brewing_coffee'
    | 'walking_to_bed'
    | 'resting_bed'
    | 'returning_to_desk';

interface CyberCharacterProps {
    currentRoutine: CharacterRoutine;
    onRoutineChange: (routine: CharacterRoutine, label: string) => void;
}

export default function CyberCharacter({
    currentRoutine,
    onRoutineChange,
}: CyberCharacterProps) {
    const groupRef = useRef<THREE.Group>(null);

    // Body parts refs for procedural animation
    const headRef = useRef<THREE.Group>(null);
    const torsoRef = useRef<THREE.Group>(null);
    const leftArmRef = useRef<THREE.Group>(null);
    const rightArmRef = useRef<THREE.Group>(null);
    const leftHandRef = useRef<THREE.Mesh>(null);
    const rightHandRef = useRef<THREE.Mesh>(null);
    const leftLegRef = useRef<THREE.Group>(null);
    const rightLegRef = useRef<THREE.Group>(null);
    const leftFootRef = useRef<THREE.Mesh>(null);
    const rightFootRef = useRef<THREE.Mesh>(null);
    const datapadRef = useRef<THREE.Group>(null);
    const coffeeCupRef = useRef<THREE.Group>(null);

    // Target spatial coordinates for locations in the room
    const DESK_POS = new THREE.Vector3(0, 0, 0.4);
    const COFFEE_POS = new THREE.Vector3(2.6, 0, 0.8);
    const BED_POS = new THREE.Vector3(-2.6, 0, 0.8);

    // Internal timing for auto-routines
    const stateTimerRef = useRef(0);
    const currentRoutineRef = useRef<CharacterRoutine>(currentRoutine);
    currentRoutineRef.current = currentRoutine;

    // Routine definitions & labels
    const ROUTINE_LABELS: Record<CharacterRoutine, string> = {
        coding: 'Compiling Neural Shaders & Live Hacking (Desk)',
        walking_to_coffee: 'Heading to Neon Espresso Bar...',
        brewing_coffee: 'Brewing Hyper-Caffeine Espresso & Sipping ☕',
        walking_to_bed: 'Heading to Cyber Futon to Recharge...',
        resting_bed: 'Chilling on Cyber Futon & Datapad Lofi Beats 🛏️',
        returning_to_desk: 'Returning to Battlestation...',
    };

    // Auto-advance routine timer if not manually overridden
    useEffect(() => {
        stateTimerRef.current = 0;
    }, [currentRoutine]);

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        const time = state.clock.getElapsedTime();
        stateTimerRef.current += delta;

        // Auto state-machine transitions after set durations
        const r = currentRoutineRef.current;
        if (r === 'coding' && stateTimerRef.current > 20) {
            onRoutineChange('walking_to_coffee', ROUTINE_LABELS['walking_to_coffee']);
            stateTimerRef.current = 0;
        } else if (r === 'brewing_coffee' && stateTimerRef.current > 12) {
            onRoutineChange('walking_to_bed', ROUTINE_LABELS['walking_to_bed']);
            stateTimerRef.current = 0;
        } else if (r === 'resting_bed' && stateTimerRef.current > 14) {
            onRoutineChange('returning_to_desk', ROUTINE_LABELS['returning_to_desk']);
            stateTimerRef.current = 0;
        }

        const group = groupRef.current;

        // Animate based on routine state
        if (r === 'coding') {
            // Smoothly snap/lerp to desk chair position
            group.position.lerp(DESK_POS, delta * 4);
            group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, Math.PI, delta * 6);

            // Sitting pose
            if (leftLegRef.current) {
                leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, -Math.PI / 2.2, delta * 8);
                leftLegRef.current.position.y = 0.65;
            }
            if (rightLegRef.current) {
                rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, -Math.PI / 2.2, delta * 8);
                rightLegRef.current.position.y = 0.65;
            }
            if (torsoRef.current) {
                torsoRef.current.position.y = 0.85 + Math.sin(time * 4) * 0.015;
            }

            // Head nodding rhythmically to music
            if (headRef.current) {
                headRef.current.rotation.x = 0.15 + Math.sin(time * 6) * 0.05;
                headRef.current.rotation.y = Math.sin(time * 2.5) * 0.08;
            }

            // Rapid typing keystroke animations for arms & hands
            if (leftArmRef.current) {
                leftArmRef.current.rotation.x = -Math.PI / 3 + Math.sin(time * 24) * 0.08;
                leftArmRef.current.rotation.y = 0.25 + Math.cos(time * 12) * 0.05;
                leftArmRef.current.rotation.z = -0.15;
            }
            if (rightArmRef.current) {
                rightArmRef.current.rotation.x = -Math.PI / 3 + Math.cos(time * 26) * 0.08;
                rightArmRef.current.rotation.y = -0.25 + Math.sin(time * 14) * 0.05;
                rightArmRef.current.rotation.z = 0.15;
            }

            // Hide coffee cup & datapad
            if (coffeeCupRef.current) coffeeCupRef.current.visible = false;
            if (datapadRef.current) datapadRef.current.visible = false;

        } else if (r === 'walking_to_coffee' || r === 'walking_to_bed' || r === 'returning_to_desk') {
            // Determine target vector
            let target = COFFEE_POS;
            let nextState: CharacterRoutine = 'brewing_coffee';
            if (r === 'walking_to_bed') {
                target = BED_POS;
                nextState = 'resting_bed';
            } else if (r === 'returning_to_desk') {
                target = DESK_POS;
                nextState = 'coding';
            }

            // Check if reached destination
            const dist = group.position.distanceTo(target);
            if (dist < 0.15) {
                group.position.copy(target);
                onRoutineChange(nextState, ROUTINE_LABELS[nextState]);
                stateTimerRef.current = 0;
            } else {
                // Move towards target
                const dir = new THREE.Vector3().subVectors(target, group.position).normalize();
                group.position.addScaledVector(dir, delta * 1.6);

                // Face movement direction
                const angle = Math.atan2(dir.x, dir.z);
                group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, angle, delta * 10);

                // Natural walk cycle: bobbing torso
                if (torsoRef.current) {
                    torsoRef.current.position.y = 1.05 + Math.abs(Math.sin(time * 8)) * 0.06;
                }

                // Leg swing
                const legSwing = Math.sin(time * 8) * 0.65;
                if (leftLegRef.current) {
                    leftLegRef.current.rotation.x = legSwing;
                    leftLegRef.current.position.y = 0.55;
                }
                if (rightLegRef.current) {
                    rightLegRef.current.rotation.x = -legSwing;
                    rightLegRef.current.position.y = 0.55;
                }

                // Arm swing opposite to legs
                if (leftArmRef.current) {
                    leftArmRef.current.rotation.x = -legSwing * 0.7;
                    leftArmRef.current.rotation.z = -0.1;
                }
                if (rightArmRef.current) {
                    rightArmRef.current.rotation.x = legSwing * 0.7;
                    rightArmRef.current.rotation.z = 0.1;
                }

                if (headRef.current) {
                    headRef.current.rotation.x = 0;
                    headRef.current.rotation.y = 0;
                }

                if (coffeeCupRef.current) coffeeCupRef.current.visible = false;
                if (datapadRef.current) datapadRef.current.visible = false;
            }

        } else if (r === 'brewing_coffee') {
            // Standing at coffee station, facing coffee machine
            group.position.lerp(COFFEE_POS, delta * 4);
            group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, -Math.PI / 2, delta * 6);

            if (torsoRef.current) torsoRef.current.position.y = 1.05;

            // Legs standing straight
            if (leftLegRef.current) {
                leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, delta * 6);
                leftLegRef.current.position.y = 0.55;
            }
            if (rightLegRef.current) {
                rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, delta * 6);
                rightLegRef.current.position.y = 0.55;
            }

            // Sipping / holding coffee cup
            if (coffeeCupRef.current) coffeeCupRef.current.visible = true;
            if (datapadRef.current) datapadRef.current.visible = false;

            // Periodic sip animation
            const sipProgress = (Math.sin(time * 2) + 1) / 2; // 0 to 1
            if (rightArmRef.current) {
                rightArmRef.current.rotation.x = THREE.MathUtils.lerp(-0.4, -1.3, sipProgress);
                rightArmRef.current.rotation.y = THREE.MathUtils.lerp(0.1, -0.4, sipProgress);
                rightArmRef.current.rotation.z = THREE.MathUtils.lerp(0.2, 0.5, sipProgress);
            }
            if (leftArmRef.current) {
                leftArmRef.current.rotation.x = 0.2;
                leftArmRef.current.rotation.z = -0.15;
            }
            if (headRef.current) {
                headRef.current.rotation.x = THREE.MathUtils.lerp(0.05, 0.25, sipProgress);
            }

        } else if (r === 'resting_bed') {
            // Reclining / sitting relaxed on the cyber bed
            group.position.lerp(BED_POS, delta * 4);
            group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, Math.PI / 2, delta * 6);

            // Relaxed sitting/reclined posture
            if (torsoRef.current) {
                torsoRef.current.position.y = 0.7;
                torsoRef.current.rotation.x = -0.25; // Leaning back slightly
            }

            if (leftLegRef.current) {
                leftLegRef.current.rotation.x = -Math.PI / 2.3;
                leftLegRef.current.position.y = 0.5;
            }
            if (rightLegRef.current) {
                rightLegRef.current.rotation.x = -Math.PI / 2.5;
                rightLegRef.current.position.y = 0.5;
            }

            // Holding glowing datapad in hands
            if (coffeeCupRef.current) coffeeCupRef.current.visible = false;
            if (datapadRef.current) datapadRef.current.visible = true;

            if (leftArmRef.current) {
                leftArmRef.current.rotation.x = -0.8;
                leftArmRef.current.rotation.y = 0.4;
            }
            if (rightArmRef.current) {
                rightArmRef.current.rotation.x = -0.8;
                rightArmRef.current.rotation.y = -0.4;
            }
            if (headRef.current) {
                headRef.current.rotation.x = 0.35 + Math.sin(time * 2) * 0.03; // Looking down at datapad
            }
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, 0.4]}>
            {/* TORSO & JACKET */}
            <group ref={torsoRef} position={[0, 0.85, 0]}>
                {/* Tech Streetwear Jacket (Oversized Cyber Bomber) */}
                <mesh castShadow position={[0, 0.2, 0]}>
                    <boxGeometry args={[0.46, 0.48, 0.3]} />
                    <meshStandardMaterial color="#0b1320" roughness={0.7} metalness={0.2} />
                </mesh>

                {/* Cyberpunk Emissive Trim - Neon Cyan Chest Stripes */}
                <mesh position={[0, 0.2, 0.155]}>
                    <planeGeometry args={[0.34, 0.04]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                </mesh>
                <mesh position={[0, 0.08, 0.155]}>
                    <planeGeometry args={[0.26, 0.03]} />
                    <meshBasicMaterial color="#f72585" toneMapped={false} />
                </mesh>

                {/* Glowing Collar / Tech-Neck */}
                <mesh position={[0, 0.45, 0]}>
                    <cylinderGeometry args={[0.13, 0.15, 0.1, 16]} />
                    <meshStandardMaterial color="#080e18" roughness={0.6} />
                </mesh>
                <mesh position={[0, 0.45, 0.12]}>
                    <sphereGeometry args={[0.02, 8, 8]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                </mesh>

                {/* HEAD & HAIR & CYBER HEADSET */}
                <group ref={headRef} position={[0, 0.58, 0]}>
                    {/* Face / Head Base */}
                    <mesh castShadow position={[0, 0, 0]}>
                        <boxGeometry args={[0.24, 0.26, 0.24]} />
                        <meshStandardMaterial color="#d4a373" roughness={0.8} />
                    </mesh>

                    {/* Cyber Punk Dark Hair */}
                    <mesh position={[0, 0.12, 0.02]}>
                        <boxGeometry args={[0.26, 0.12, 0.26]} />
                        <meshStandardMaterial color="#1a1c23" roughness={0.9} />
                    </mesh>
                    <mesh position={[-0.04, 0.16, 0.08]}>
                        <coneGeometry args={[0.08, 0.12, 4]} />
                        <meshStandardMaterial color="#111317" roughness={0.9} />
                    </mesh>

                    {/* Cyber Visor / Goggles */}
                    <mesh position={[0, 0.04, 0.125]}>
                        <boxGeometry args={[0.22, 0.08, 0.04]} />
                        <meshStandardMaterial
                            color="#00f5d4"
                            emissive="#00f5d4"
                            emissiveIntensity={1.8}
                            roughness={0.1}
                            metalness={0.8}
                            toneMapped={false}
                        />
                    </mesh>

                    {/* Cyber Headset - Headband */}
                    <mesh position={[0, 0.12, 0]}>
                        <torusGeometry args={[0.14, 0.02, 8, 24, Math.PI]} />
                        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
                    </mesh>
                    {/* Left Glowing Earcup */}
                    <mesh position={[-0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
                        <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                    </mesh>
                    {/* Right Glowing Earcup */}
                    <mesh position={[0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
                        <meshBasicMaterial color="#f72585" toneMapped={false} />
                    </mesh>
                </group>

                {/* LEFT ARM */}
                <group ref={leftArmRef} position={[-0.28, 0.35, 0]}>
                    <mesh castShadow position={[0, -0.16, 0]}>
                        <boxGeometry args={[0.12, 0.34, 0.14]} />
                        <meshStandardMaterial color="#0e1726" roughness={0.7} />
                    </mesh>
                    {/* Neon Sleeve Stripe */}
                    <mesh position={[-0.065, -0.16, 0]} rotation={[0, -Math.PI / 2, 0]}>
                        <planeGeometry args={[0.02, 0.28]} />
                        <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                    </mesh>
                    {/* Left Hand */}
                    <mesh ref={leftHandRef} position={[0, -0.34, 0]}>
                        <boxGeometry args={[0.09, 0.1, 0.1]} />
                        <meshStandardMaterial color="#c68b59" roughness={0.8} />
                    </mesh>
                </group>

                {/* RIGHT ARM */}
                <group ref={rightArmRef} position={[0.28, 0.35, 0]}>
                    <mesh castShadow position={[0, -0.16, 0]}>
                        <boxGeometry args={[0.12, 0.34, 0.14]} />
                        <meshStandardMaterial color="#0e1726" roughness={0.7} />
                    </mesh>
                    {/* Neon Sleeve Stripe */}
                    <mesh position={[0.065, -0.16, 0]} rotation={[0, Math.PI / 2, 0]}>
                        <planeGeometry args={[0.02, 0.28]} />
                        <meshBasicMaterial color="#f72585" toneMapped={false} />
                    </mesh>
                    {/* Right Hand */}
                    <mesh ref={rightHandRef} position={[0, -0.34, 0]}>
                        <boxGeometry args={[0.09, 0.1, 0.1]} />
                        <meshStandardMaterial color="#c68b59" roughness={0.8} />
                    </mesh>

                    {/* COFFEE CUP ITEM (Attached to right hand when drinking) */}
                    <group ref={coffeeCupRef} position={[0, -0.42, 0.08]} visible={false}>
                        <mesh>
                            <cylinderGeometry args={[0.05, 0.04, 0.1, 12]} />
                            <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.6} />
                        </mesh>
                        {/* Glowing Coffee Logo */}
                        <mesh position={[0, 0, 0.05]}>
                            <planeGeometry args={[0.04, 0.04]} />
                            <meshBasicMaterial color="#ffb703" toneMapped={false} />
                        </mesh>
                    </group>
                </group>

                {/* HOLOGRAPHIC DATAPAD (Held in hands when relaxing on bed) */}
                <group ref={datapadRef} position={[0, 0.05, 0.35]} rotation={[-0.5, 0, 0]} visible={false}>
                    <mesh>
                        <boxGeometry args={[0.3, 0.2, 0.015]} />
                        <meshStandardMaterial color="#030812" metalness={0.9} roughness={0.1} />
                    </mesh>
                    {/* Holographic Glowing Display */}
                    <mesh position={[0, 0, 0.01]}>
                        <planeGeometry args={[0.28, 0.18]} />
                        <meshBasicMaterial color="#00f5d4" transparent opacity={0.85} toneMapped={false} />
                    </mesh>
                </group>
            </group>

            {/* LEGS & SNEAKERS */}
            {/* Left Leg */}
            <group ref={leftLegRef} position={[-0.14, 0.55, 0]}>
                <mesh castShadow position={[0, -0.22, 0]}>
                    <boxGeometry args={[0.13, 0.44, 0.15]} />
                    <meshStandardMaterial color="#070c14" roughness={0.8} />
                </mesh>
                {/* Sneaker */}
                <mesh ref={leftFootRef} position={[0, -0.46, 0.04]} castShadow>
                    <boxGeometry args={[0.14, 0.1, 0.22]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.3} />
                </mesh>
                {/* Glowing Sole */}
                <mesh position={[0, -0.51, 0.04]}>
                    <boxGeometry args={[0.145, 0.02, 0.23]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                </mesh>
            </group>

            {/* Right Leg */}
            <group ref={rightLegRef} position={[0.14, 0.55, 0]}>
                <mesh castShadow position={[0, -0.22, 0]}>
                    <boxGeometry args={[0.13, 0.44, 0.15]} />
                    <meshStandardMaterial color="#070c14" roughness={0.8} />
                </mesh>
                {/* Sneaker */}
                <mesh ref={rightFootRef} position={[0, -0.46, 0.04]} castShadow>
                    <boxGeometry args={[0.14, 0.1, 0.22]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.3} />
                </mesh>
                {/* Glowing Sole */}
                <mesh position={[0, -0.51, 0.04]}>
                    <boxGeometry args={[0.145, 0.02, 0.23]} />
                    <meshBasicMaterial color="#f72585" toneMapped={false} />
                </mesh>
            </group>
        </group>
    );
}
