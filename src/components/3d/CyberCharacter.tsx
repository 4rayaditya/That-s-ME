'use client';

import React, { useRef, useEffect, useMemo } from 'react';
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
    const bodyRootRef = useRef<THREE.Group>(null);

    // Body parts refs for procedural animation
    const headRef = useRef<THREE.Group>(null);
    const torsoRef = useRef<THREE.Group>(null);
    const leftArmRef = useRef<THREE.Group>(null);
    const rightArmRef = useRef<THREE.Group>(null);
    const leftLegRef = useRef<THREE.Group>(null);
    const rightLegRef = useRef<THREE.Group>(null);
    const coffeeCupRef = useRef<THREE.Group>(null);

    // Precise spatial coordinates for locations in the room
    const DESK_POS = useMemo(() => new THREE.Vector3(0, 0, 0.4), []);
    const COFFEE_POS = useMemo(() => new THREE.Vector3(2.15, 0, 0.7), []); // Directly in front of espresso bar
    const BED_STAND_POS = useMemo(() => new THREE.Vector3(-1.9, 0, 0.75), []); // Foot of bed for standing
    const BED_LIE_POS = useMemo(() => new THREE.Vector3(-2.1, 0.55, 0.8), []); // Flat horizontal on mattress

    // Internal timing for routines
    const stateTimerRef = useRef(0);
    const currentRoutineRef = useRef<CharacterRoutine>(currentRoutine);
    currentRoutineRef.current = currentRoutine;

    // Routine definitions & labels
    const ROUTINE_LABELS: Record<CharacterRoutine, string> = {
        coding: 'Compiling Neural Shaders & Live Hacking (Desk)',
        walking_to_coffee: 'Heading to Neon Espresso Bar...',
        brewing_coffee: 'Brewing Hyper-Caffeine Espresso & Sipping ☕',
        walking_to_bed: 'Heading to Cyber Futon to Sleep...',
        resting_bed: 'Sleeping on Cyber Futon & Recharging 🛏️',
        returning_to_desk: 'Returning to Battlestation...',
    };

    useEffect(() => {
        stateTimerRef.current = 0;
    }, [currentRoutine]);

    useFrame((state, delta) => {
        if (!groupRef.current || !bodyRootRef.current) return;
        const time = state.clock.getElapsedTime();
        stateTimerRef.current += delta;

        const r = currentRoutineRef.current;
        const group = groupRef.current;
        const bodyRoot = bodyRootRef.current;

        // Auto state-machine transitions after long, natural durations
        if (r === 'coding' && stateTimerRef.current > 35) {
            onRoutineChange('walking_to_coffee', ROUTINE_LABELS['walking_to_coffee']);
            stateTimerRef.current = 0;
        } else if (r === 'brewing_coffee' && stateTimerRef.current > 20) {
            onRoutineChange('walking_to_bed', ROUTINE_LABELS['walking_to_bed']);
            stateTimerRef.current = 0;
        } else if (r === 'resting_bed' && stateTimerRef.current > 25) {
            onRoutineChange('returning_to_desk', ROUTINE_LABELS['returning_to_desk']);
            stateTimerRef.current = 0;
        }

        // ============================================================
        // STATE 1: CODING AT DESK (Sitting upright in ergonomic chair)
        // ============================================================
        if (r === 'coding') {
            group.position.lerp(DESK_POS, delta * 5);
            group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0, delta * 6);
            group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, 0, delta * 6);
            group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, Math.PI, delta * 6);

            // Natural sitting height - whole skeleton stays anchored together
            bodyRoot.position.y = 0.5;
            bodyRoot.rotation.x = 0.05;

            // Hips & Legs bent at 90 degrees for sitting
            if (leftLegRef.current) {
                leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, -Math.PI / 2.1, delta * 8);
                leftLegRef.current.rotation.z = -0.05;
            }
            if (rightLegRef.current) {
                rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, -Math.PI / 2.1, delta * 8);
                rightLegRef.current.rotation.z = 0.05;
            }

            // Torso upright with gentle music nodding
            if (torsoRef.current) {
                torsoRef.current.position.set(0, 0.28, 0);
                torsoRef.current.rotation.x = 0.08 + Math.sin(time * 4) * 0.02;
                torsoRef.current.rotation.y = 0;
                torsoRef.current.rotation.z = 0;
            }
            if (headRef.current) {
                headRef.current.rotation.x = 0.15 + Math.sin(time * 6) * 0.04;
                headRef.current.rotation.y = Math.sin(time * 2) * 0.06;
                headRef.current.rotation.z = 0;
            }

            // Keystrokes on mechanical keyboard
            if (leftArmRef.current) {
                leftArmRef.current.rotation.x = -Math.PI / 3 + Math.sin(time * 24) * 0.06;
                leftArmRef.current.rotation.y = 0.25;
                leftArmRef.current.rotation.z = -0.15;
            }
            if (rightArmRef.current) {
                rightArmRef.current.rotation.x = -Math.PI / 3 + Math.cos(time * 26) * 0.06;
                rightArmRef.current.rotation.y = -0.25;
                rightArmRef.current.rotation.z = 0.15;
            }

            if (coffeeCupRef.current) coffeeCupRef.current.visible = false;

        // ============================================================
        // STATE 2: WALKING (Desk -> Coffee, Coffee -> Bed, Bed -> Desk)
        // ============================================================
        } else if (r === 'walking_to_coffee' || r === 'walking_to_bed' || r === 'returning_to_desk') {
            let target = COFFEE_POS;
            let nextState: CharacterRoutine = 'brewing_coffee';

            if (r === 'walking_to_bed') {
                target = BED_STAND_POS;
                nextState = 'resting_bed';
            } else if (r === 'returning_to_desk') {
                target = DESK_POS;
                nextState = 'coding';
            }

            // Smoothly recover upright posture and floor level
            group.position.y = THREE.MathUtils.lerp(group.position.y, 0, delta * 8);
            group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0, delta * 8);
            group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, 0, delta * 8);

            // Waypoint: if starting from bed, step out to BED_STAND_POS first
            let currentNavTarget = target;
            if (group.position.x < -1.95 && (r === 'returning_to_desk' || r === 'walking_to_coffee')) {
                currentNavTarget = BED_STAND_POS;
            }

            const dx = currentNavTarget.x - group.position.x;
            const dz = currentNavTarget.z - group.position.z;
            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist < 0.14) {
                if (currentNavTarget === target) {
                    group.position.copy(target);
                    onRoutineChange(nextState, ROUTINE_LABELS[nextState]);
                    stateTimerRef.current = 0;
                } else {
                    // Cleared bed, continue to main target
                    group.position.copy(currentNavTarget);
                }
            } else {
                // Move towards destination
                const dirX = dx / dist;
                const dirZ = dz / dist;
                group.position.x += dirX * delta * 1.5;
                group.position.z += dirZ * delta * 1.5;

                const moveAngle = Math.atan2(dirX, dirZ);
                group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, moveAngle, delta * 10);

                // Standing height
                bodyRoot.position.y = 0.55 + Math.abs(Math.sin(time * 8)) * 0.04;
                bodyRoot.rotation.x = 0;

                if (torsoRef.current) {
                    torsoRef.current.position.set(0, 0.28, 0);
                    torsoRef.current.rotation.set(0.05, 0, 0);
                }
                if (headRef.current) headRef.current.rotation.set(0, 0, 0);

                // Natural leg walk swing
                const legSwing = Math.sin(time * 8) * 0.6;
                if (leftLegRef.current) {
                    leftLegRef.current.rotation.x = legSwing;
                    leftLegRef.current.rotation.z = 0;
                }
                if (rightLegRef.current) {
                    rightLegRef.current.rotation.x = -legSwing;
                    rightLegRef.current.rotation.z = 0;
                }

                // Opposite arm swing
                if (leftArmRef.current) {
                    leftArmRef.current.rotation.x = -legSwing * 0.7;
                    leftArmRef.current.rotation.y = 0;
                    leftArmRef.current.rotation.z = -0.1;
                }
                if (rightArmRef.current) {
                    rightArmRef.current.rotation.x = legSwing * 0.7;
                    rightArmRef.current.rotation.y = 0;
                    rightArmRef.current.rotation.z = 0.1;
                }

                if (coffeeCupRef.current) coffeeCupRef.current.visible = false;
            }

        // ============================================================
        // STATE 3: BREWING ESPRESSO (Stands locked at counter, sips coffee)
        // ============================================================
        } else if (r === 'brewing_coffee') {
            // Locked firmly in front of the espresso bar at x=2.15, z=0.7 facing +X
            group.position.lerp(COFFEE_POS, delta * 8);
            group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0, delta * 8);
            group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, 0, delta * 8);
            group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, Math.PI / 2, delta * 8); // Facing coffee machine directly

            bodyRoot.position.y = 0.55;
            bodyRoot.rotation.x = 0;

            // Standing legs straight and stationary
            if (leftLegRef.current) {
                leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, delta * 8);
                leftLegRef.current.rotation.z = 0;
            }
            if (rightLegRef.current) {
                rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, delta * 8);
                rightLegRef.current.rotation.z = 0;
            }

            if (torsoRef.current) {
                torsoRef.current.position.set(0, 0.28, 0);
                torsoRef.current.rotation.set(0, 0, 0);
            }

            // Holding & sipping coffee cup
            if (coffeeCupRef.current) coffeeCupRef.current.visible = true;

            const sipCycle = (Math.sin(time * 2.2) + 1) / 2; // 0 to 1
            if (rightArmRef.current) {
                rightArmRef.current.rotation.x = THREE.MathUtils.lerp(-0.4, -1.35, sipCycle);
                rightArmRef.current.rotation.y = THREE.MathUtils.lerp(0.1, -0.4, sipCycle);
                rightArmRef.current.rotation.z = THREE.MathUtils.lerp(0.2, 0.5, sipCycle);
            }
            if (leftArmRef.current) {
                leftArmRef.current.rotation.x = 0.2;
                leftArmRef.current.rotation.y = 0;
                leftArmRef.current.rotation.z = -0.15;
            }
            if (headRef.current) {
                headRef.current.rotation.x = THREE.MathUtils.lerp(0.05, 0.28, sipCycle);
                headRef.current.rotation.y = 0;
                headRef.current.rotation.z = 0;
            }

        // ============================================================
        // STATE 4: SLEEPING ON BED (Actually lying flat horizontally on mattress!)
        // ============================================================
        } else if (r === 'resting_bed') {
            // Positioned horizontally along the mattress surface
            group.position.lerp(BED_LIE_POS, delta * 5);

            // Reclined flat on back: head on pillow (-X), feet towards room (+X), face looking up (+Y)
            // Euler rotation: rx = -PI/2, ry = 0, rz = PI/2
            group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -Math.PI / 2, delta * 6);
            group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, 0, delta * 6);
            group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, Math.PI / 2, delta * 6);

            // Hips remain anchored at natural position
            bodyRoot.position.y = 0.55;
            bodyRoot.rotation.x = 0;

            // Legs straight and relaxed flat along mattress
            if (leftLegRef.current) {
                leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0.04, delta * 8);
                leftLegRef.current.rotation.z = -0.06;
            }
            if (rightLegRef.current) {
                rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0.04, delta * 8);
                rightLegRef.current.rotation.z = 0.06;
            }

            // Torso flat with gentle, deep sleep breathing (chest rising & falling along local Z which is world +Y)
            if (torsoRef.current) {
                torsoRef.current.rotation.set(0, 0, 0);
                torsoRef.current.position.set(0, 0.28, Math.sin(time * 1.5) * 0.015);
            }

            // Head resting comfortably on pillow
            if (headRef.current) {
                headRef.current.rotation.x = 0;
                headRef.current.rotation.y = 0.15;
                headRef.current.rotation.z = 0.1;
            }

            // Arms resting comfortably on chest / stomach
            if (leftArmRef.current) {
                leftArmRef.current.rotation.x = -0.35;
                leftArmRef.current.rotation.y = 0.35;
                leftArmRef.current.rotation.z = 0.2;
            }
            if (rightArmRef.current) {
                rightArmRef.current.rotation.x = -0.35;
                rightArmRef.current.rotation.y = -0.35;
                rightArmRef.current.rotation.z = -0.2;
            }

            if (coffeeCupRef.current) coffeeCupRef.current.visible = false;
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, 0.4]}>
            {/* ANATOMICALLY UNIFIED SKELETON ROOT (Hips/Pelvis Center) */}
            <group ref={bodyRootRef} position={[0, 0.55, 0]}>
                {/* Hips / Waist Connector (Permanently bridges upper body and legs!) */}
                <mesh castShadow position={[0, 0, 0]}>
                    <boxGeometry args={[0.38, 0.16, 0.26]} />
                    <meshStandardMaterial color="#070c14" roughness={0.8} />
                </mesh>

                {/* UPPER BODY: TORSO + HEAD + ARMS (Attached directly to Hips) */}
                <group ref={torsoRef} position={[0, 0.28, 0]}>
                    {/* Tech Streetwear Cyber Bomber Jacket */}
                    <mesh castShadow position={[0, 0, 0]}>
                        <boxGeometry args={[0.46, 0.44, 0.3]} />
                        <meshStandardMaterial color="#0b1320" roughness={0.7} metalness={0.2} />
                    </mesh>

                    {/* Cyberpunk Emissive Trim - Neon Cyan Chest Stripes */}
                    <mesh position={[0, 0.05, 0.155]}>
                        <planeGeometry args={[0.34, 0.04]} />
                        <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                    </mesh>
                    <mesh position={[0, -0.07, 0.155]}>
                        <planeGeometry args={[0.26, 0.03]} />
                        <meshBasicMaterial color="#f72585" toneMapped={false} />
                    </mesh>

                    {/* Glowing Tech Collar */}
                    <mesh position={[0, 0.25, 0]}>
                        <cylinderGeometry args={[0.13, 0.15, 0.08, 16]} />
                        <meshStandardMaterial color="#080e18" roughness={0.6} />
                    </mesh>

                    {/* HEAD & HAIR & CYBER HEADSET */}
                    <group ref={headRef} position={[0, 0.38, 0]}>
                        {/* Face */}
                        <mesh castShadow position={[0, 0, 0]}>
                            <boxGeometry args={[0.24, 0.26, 0.24]} />
                            <meshStandardMaterial color="#d4a373" roughness={0.8} />
                        </mesh>

                        {/* Cyberpunk Dark Hair */}
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

                        {/* Cyber Headset */}
                        <mesh position={[0, 0.12, 0]}>
                            <torusGeometry args={[0.14, 0.02, 8, 24, Math.PI]} />
                            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
                        </mesh>
                        <mesh position={[-0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
                            <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                        </mesh>
                        <mesh position={[0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
                            <meshBasicMaterial color="#f72585" toneMapped={false} />
                        </mesh>
                    </group>

                    {/* LEFT ARM */}
                    <group ref={leftArmRef} position={[-0.28, 0.16, 0]}>
                        <mesh castShadow position={[0, -0.16, 0]}>
                            <boxGeometry args={[0.12, 0.34, 0.14]} />
                            <meshStandardMaterial color="#0e1726" roughness={0.7} />
                        </mesh>
                        <mesh position={[-0.065, -0.16, 0]} rotation={[0, -Math.PI / 2, 0]}>
                            <planeGeometry args={[0.02, 0.28]} />
                            <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                        </mesh>
                        <mesh position={[0, -0.34, 0]}>
                            <boxGeometry args={[0.09, 0.1, 0.1]} />
                            <meshStandardMaterial color="#c68b59" roughness={0.8} />
                        </mesh>
                    </group>

                    {/* RIGHT ARM */}
                    <group ref={rightArmRef} position={[0.28, 0.16, 0]}>
                        <mesh castShadow position={[0, -0.16, 0]}>
                            <boxGeometry args={[0.12, 0.34, 0.14]} />
                            <meshStandardMaterial color="#0e1726" roughness={0.7} />
                        </mesh>
                        <mesh position={[0.065, -0.16, 0]} rotation={[0, Math.PI / 2, 0]}>
                            <planeGeometry args={[0.02, 0.28]} />
                            <meshBasicMaterial color="#f72585" toneMapped={false} />
                        </mesh>
                        <mesh position={[0, -0.34, 0]}>
                            <boxGeometry args={[0.09, 0.1, 0.1]} />
                            <meshStandardMaterial color="#c68b59" roughness={0.8} />
                        </mesh>

                        {/* Coffee Cup Item */}
                        <group ref={coffeeCupRef} position={[0, -0.42, 0.08]} visible={false}>
                            <mesh>
                                <cylinderGeometry args={[0.05, 0.04, 0.1, 12]} />
                                <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.6} />
                            </mesh>
                            <mesh position={[0, 0, 0.05]}>
                                <planeGeometry args={[0.04, 0.04]} />
                                <meshBasicMaterial color="#ffb703" toneMapped={false} />
                            </mesh>
                        </group>
                    </group>
                </group>

                {/* LOWER BODY: LEGS & SNEAKERS (Attached directly to Hips) */}
                {/* Left Leg */}
                <group ref={leftLegRef} position={[-0.13, -0.06, 0]}>
                    <mesh castShadow position={[0, -0.22, 0]}>
                        <boxGeometry args={[0.13, 0.44, 0.15]} />
                        <meshStandardMaterial color="#070c14" roughness={0.8} />
                    </mesh>
                    <mesh position={[0, -0.46, 0.04]} castShadow>
                        <boxGeometry args={[0.14, 0.1, 0.22]} />
                        <meshStandardMaterial color="#ffffff" roughness={0.3} />
                    </mesh>
                    <mesh position={[0, -0.51, 0.04]}>
                        <boxGeometry args={[0.145, 0.02, 0.23]} />
                        <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                    </mesh>
                </group>

                {/* Right Leg */}
                <group ref={rightLegRef} position={[0.13, -0.06, 0]}>
                    <mesh castShadow position={[0, -0.22, 0]}>
                        <boxGeometry args={[0.13, 0.44, 0.15]} />
                        <meshStandardMaterial color="#070c14" roughness={0.8} />
                    </mesh>
                    <mesh position={[0, -0.46, 0.04]} castShadow>
                        <boxGeometry args={[0.14, 0.1, 0.22]} />
                        <meshStandardMaterial color="#ffffff" roughness={0.3} />
                    </mesh>
                    <mesh position={[0, -0.51, 0.04]}>
                        <boxGeometry args={[0.145, 0.02, 0.23]} />
                        <meshBasicMaterial color="#f72585" toneMapped={false} />
                    </mesh>
                </group>
            </group>
        </group>
    );
}
