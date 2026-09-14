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
    const leftKneeRef = useRef<THREE.Group>(null);
    const rightKneeRef = useRef<THREE.Group>(null);
    const coffeeCupRef = useRef<THREE.Group>(null);

    // Precise spatial coordinates for locations in the room
    const DESK_POS = useMemo(() => new THREE.Vector3(0, 0, -1.85), []);
    const COFFEE_POS = useMemo(() => new THREE.Vector3(2.75, 0, -0.28), []); // Directly in front of espresso bar (counter flush against wardrobe)
    const BED_STAND_POS = useMemo(() => new THREE.Vector3(-1.85, 0, 0.8), []); // Foot of bed for standing
    const BED_LIE_POS = useMemo(() => new THREE.Vector3(-2.55, 0, 0.8), []); // Flat on futon mattress

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
        const dt = Math.min(0.05, delta); // Cap delta to prevent overshoot on frame drops
        stateTimerRef.current += dt;

        const damp = (speed: number) => Math.min(1, dt * speed);

        const r = currentRoutineRef.current;
        const group = groupRef.current;
        const bodyRoot = bodyRootRef.current;

        // Ensure group world X and Z rotations are strictly 0 at all times to prevent gimbal lock
        group.rotation.x = 0;
        group.rotation.z = 0;
        group.position.y = 0;

        // ============================================================
        // STATE 1: CODING AT DESK (Sitting upright in ergonomic chair)
        // ============================================================
        if (r === 'coding') {
            const isAtDesk = group.position.distanceTo(DESK_POS) < 0.04;
            if (isAtDesk) {
                group.position.copy(DESK_POS);
                group.rotation.set(0, Math.PI, 0);
            } else {
                group.position.lerp(DESK_POS, damp(6));
                let diff = Math.PI - group.rotation.y;
                while (diff < -Math.PI) diff += Math.PI * 2;
                while (diff > Math.PI) diff -= Math.PI * 2;
                group.rotation.y += diff * damp(6);
            }

            // Natural sitting height and posture on bodyRoot
            bodyRoot.position.y = THREE.MathUtils.lerp(bodyRoot.position.y, 0.5, damp(8));
            bodyRoot.rotation.x = THREE.MathUtils.lerp(bodyRoot.rotation.x, 0.05, damp(8));
            bodyRoot.rotation.y = 0;
            bodyRoot.rotation.z = 0;

            // Hips & Legs: thigh horizontal (-90 deg), knee bends DOWN 90 deg so feet rest flat on floor
            if (leftLegRef.current) {
                leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, -Math.PI / 2.15, damp(8));
                leftLegRef.current.rotation.y = 0;
                leftLegRef.current.rotation.z = -0.04;
            }
            if (rightLegRef.current) {
                rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, -Math.PI / 2.15, damp(8));
                rightLegRef.current.rotation.y = 0;
                rightLegRef.current.rotation.z = 0.04;
            }
            if (leftKneeRef.current) {
                leftKneeRef.current.rotation.x = THREE.MathUtils.lerp(leftKneeRef.current.rotation.x, Math.PI / 2.1, damp(8));
                leftKneeRef.current.rotation.y = 0;
                leftKneeRef.current.rotation.z = 0;
            }
            if (rightKneeRef.current) {
                rightKneeRef.current.rotation.x = THREE.MathUtils.lerp(rightKneeRef.current.rotation.x, Math.PI / 2.1, damp(8));
                rightKneeRef.current.rotation.y = 0;
                rightKneeRef.current.rotation.z = 0;
            }

            // Torso upright with gentle subtle breathing & rhythm
            if (torsoRef.current) {
                torsoRef.current.position.set(0, 0.28, 0);
                torsoRef.current.rotation.set(0.06 + Math.sin(time * 2.0) * 0.015, 0, 0);
            }
            if (headRef.current) {
                headRef.current.rotation.set(0.12 + Math.sin(time * 2.5) * 0.02, Math.sin(time * 1.0) * 0.03, 0);
            }

            // Keystrokes on mechanical keyboard (realistic subtle typing rhythm, not glitchy vibrating)
            if (leftArmRef.current) {
                leftArmRef.current.rotation.x = -Math.PI / 3.4 + Math.sin(time * 5.2) * 0.018;
                leftArmRef.current.rotation.y = 0.22;
                leftArmRef.current.rotation.z = -0.12;
            }
            if (rightArmRef.current) {
                rightArmRef.current.rotation.x = -Math.PI / 3.4 + Math.cos(time * 5.6) * 0.018;
                rightArmRef.current.rotation.y = -0.22;
                rightArmRef.current.rotation.z = 0.12;
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

            // Waypoint: if starting from bed, step out to BED_STAND_POS first
            let currentNavTarget = target;
            if (group.position.x < -1.95 && (r === 'returning_to_desk' || r === 'walking_to_coffee')) {
                currentNavTarget = BED_STAND_POS;
            }

            const dx = currentNavTarget.x - group.position.x;
            const dz = currentNavTarget.z - group.position.z;
            const dist = Math.sqrt(dx * dx + dz * dz);

            // Recover upright standing posture smoothly
            bodyRoot.position.y = THREE.MathUtils.lerp(bodyRoot.position.y, 0.55 + Math.abs(Math.sin(time * 7)) * 0.025, damp(8));
            bodyRoot.rotation.x = THREE.MathUtils.lerp(bodyRoot.rotation.x, 0, damp(8));
            bodyRoot.rotation.y = 0;
            bodyRoot.rotation.z = 0;

            if (dist < 0.08) {
                if (currentNavTarget === target) {
                    group.position.copy(target);
                    onRoutineChange(nextState, ROUTINE_LABELS[nextState]);
                    stateTimerRef.current = 0;
                } else {
                    // Cleared bed waypoint, continue to main target
                    group.position.copy(currentNavTarget);
                }
            } else {
                // Move towards destination smoothly without overshoot
                const dirX = dx / dist;
                const dirZ = dz / dist;
                const step = Math.min(dist, dt * 1.35);
                group.position.x += dirX * step;
                group.position.z += dirZ * step;

                // Shortest-path angle interpolation to prevent 180-degree jitter/flips
                const moveAngle = Math.atan2(dirX, dirZ);
                let diff = moveAngle - group.rotation.y;
                while (diff < -Math.PI) diff += Math.PI * 2;
                while (diff > Math.PI) diff -= Math.PI * 2;
                group.rotation.y += diff * damp(7);

                if (torsoRef.current) {
                    torsoRef.current.position.set(0, 0.28, 0);
                    torsoRef.current.rotation.set(0.05, 0, 0);
                }
                if (headRef.current) headRef.current.rotation.set(0, 0, 0);

                // Natural leg walk swing with realistic knee flexion
                const legSwing = Math.sin(time * 7) * 0.40;
                if (leftLegRef.current) {
                    leftLegRef.current.rotation.set(legSwing, 0, -0.02);
                }
                if (rightLegRef.current) {
                    rightLegRef.current.rotation.set(-legSwing, 0, 0.02);
                }
                if (leftKneeRef.current) {
                    leftKneeRef.current.rotation.set(Math.max(0, -legSwing) * 0.75, 0, 0);
                }
                if (rightKneeRef.current) {
                    rightKneeRef.current.rotation.set(Math.max(0, legSwing) * 0.75, 0, 0);
                }

                // Opposite arm swing
                if (leftArmRef.current) {
                    leftArmRef.current.rotation.set(-legSwing * 0.55, 0, -0.1);
                }
                if (rightArmRef.current) {
                    rightArmRef.current.rotation.set(legSwing * 0.55, 0, 0.1);
                }

                if (coffeeCupRef.current) coffeeCupRef.current.visible = false;
            }

        // ============================================================
        // STATE 3: BREWING ESPRESSO (Stands locked at counter, sips coffee)
        // ============================================================
        } else if (r === 'brewing_coffee') {
            // Locked firmly in front of the espresso bar at x=2.79, z=0.7 facing +X
            group.position.lerp(COFFEE_POS, damp(8));

            let diff = Math.PI / 2 - group.rotation.y;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            group.rotation.y += diff * damp(8);

            bodyRoot.position.y = THREE.MathUtils.lerp(bodyRoot.position.y, 0.55, damp(8));
            bodyRoot.rotation.set(0, 0, 0);

            // Standing legs straight and stationary
            if (leftLegRef.current) {
                leftLegRef.current.rotation.set(0, 0, -0.03);
            }
            if (rightLegRef.current) {
                rightLegRef.current.rotation.set(0, 0, 0.03);
            }
            if (leftKneeRef.current) {
                leftKneeRef.current.rotation.set(0, 0, 0);
            }
            if (rightKneeRef.current) {
                rightKneeRef.current.rotation.set(0, 0, 0);
            }

            if (torsoRef.current) {
                torsoRef.current.position.set(0, 0.28, 0);
                torsoRef.current.rotation.set(0, 0, 0);
            }

            // Holding & sipping coffee cup
            if (coffeeCupRef.current) coffeeCupRef.current.visible = true;

            const sipCycle = (Math.sin(time * 2.0) + 1) / 2; // 0 to 1
            if (rightArmRef.current) {
                rightArmRef.current.rotation.x = THREE.MathUtils.lerp(-0.4, -1.35, sipCycle);
                rightArmRef.current.rotation.y = THREE.MathUtils.lerp(0.1, -0.4, sipCycle);
                rightArmRef.current.rotation.z = THREE.MathUtils.lerp(0.2, 0.5, sipCycle);
            }
            if (leftArmRef.current) {
                leftArmRef.current.rotation.set(0.2, 0, -0.15);
            }
            if (headRef.current) {
                headRef.current.rotation.set(THREE.MathUtils.lerp(0.05, 0.28, sipCycle), 0, 0);
            }

        // ============================================================
        // STATE 4: SLEEPING ON BED (Lying flat horizontally on mattress without gimbal lock)
        // ============================================================
        } else if (r === 'resting_bed') {
            // Positioned horizontally along the mattress surface
            group.position.lerp(BED_LIE_POS, damp(5));

            let diff = Math.PI / 2 - group.rotation.y;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            group.rotation.y += diff * damp(5);

            // Reclined flat on back via bodyRoot.rotation.x only (ZERO group gimbal lock!)
            // Raised from the old 0.48: once the rig is pitched flat, each part's local
            // depth/radius becomes its VERTICAL thickness, so 0.48 sat the hips low enough
            // that the leg cylinders' own radius sank below the mattress + duvet surface.
            // 0.62 clears that while keeping the torso's back resting just on the duvet.
            bodyRoot.position.y = THREE.MathUtils.lerp(bodyRoot.position.y, 0.62, damp(5));
            bodyRoot.rotation.x = THREE.MathUtils.lerp(bodyRoot.rotation.x, -Math.PI / 2, damp(5));
            bodyRoot.rotation.y = 0;
            bodyRoot.rotation.z = 0;

            // Legs straight and relaxed flat along mattress â€” lerped into place (not snapped)
            // so the walking leg-swing settles smoothly into the resting pose instead of popping.
            if (leftLegRef.current) {
                leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0.02, damp(6));
                leftLegRef.current.rotation.y = 0;
                leftLegRef.current.rotation.z = THREE.MathUtils.lerp(leftLegRef.current.rotation.z, -0.05, damp(6));
            }
            if (rightLegRef.current) {
                rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0.02, damp(6));
                rightLegRef.current.rotation.y = 0;
                rightLegRef.current.rotation.z = THREE.MathUtils.lerp(rightLegRef.current.rotation.z, 0.05, damp(6));
            }
            if (leftKneeRef.current) {
                leftKneeRef.current.rotation.x = THREE.MathUtils.lerp(leftKneeRef.current.rotation.x, 0, damp(6));
                leftKneeRef.current.rotation.y = 0;
                leftKneeRef.current.rotation.z = 0;
            }
            if (rightKneeRef.current) {
                rightKneeRef.current.rotation.x = THREE.MathUtils.lerp(rightKneeRef.current.rotation.x, 0, damp(6));
                rightKneeRef.current.rotation.y = 0;
                rightKneeRef.current.rotation.z = 0;
            }

            // Torso flat with gentle, deep sleep breathing
            if (torsoRef.current) {
                torsoRef.current.rotation.x = THREE.MathUtils.lerp(torsoRef.current.rotation.x, 0, damp(6));
                torsoRef.current.rotation.y = THREE.MathUtils.lerp(torsoRef.current.rotation.y, 0, damp(6));
                torsoRef.current.rotation.z = 0;
                torsoRef.current.position.set(0, 0.28, Math.sin(time * 1.4) * 0.012);
            }

            // Head resting comfortably on pillow
            if (headRef.current) {
                headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, damp(6));
                headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, 0.12, damp(6));
                headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, 0.06, damp(6));
            }

            // Arms resting comfortably on chest / stomach
            if (leftArmRef.current) {
                leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.35, damp(6));
                leftArmRef.current.rotation.y = THREE.MathUtils.lerp(leftArmRef.current.rotation.y, 0.35, damp(6));
                leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.2, damp(6));
            }
            if (rightArmRef.current) {
                rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.35, damp(6));
                rightArmRef.current.rotation.y = THREE.MathUtils.lerp(rightArmRef.current.rotation.y, -0.35, damp(6));
                rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.2, damp(6));
            }

            if (coffeeCupRef.current) coffeeCupRef.current.visible = false;
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, -1.85]}>
            {/* ANATOMICALLY UNIFIED SKELETON ROOT (Hips/Pelvis Center) */}
            <group ref={bodyRootRef} position={[0, 0.55, 0]}>
                {/* Hips / Waist Connector (Anatomical Pelvis in Techwear Cargo Fabric) */}
                <mesh castShadow position={[0, 0, 0]}>
                    <boxGeometry args={[0.36, 0.16, 0.26]} />
                    <meshStandardMaterial color="#0b0f19" roughness={0.85} />
                </mesh>
                {/* Techwear Utility Belt with Metallic Buckle */}
                <mesh position={[0, 0.06, 0]}>
                    <boxGeometry args={[0.375, 0.04, 0.27]} />
                    <meshStandardMaterial color="#05070d" metalness={0.8} roughness={0.3} />
                </mesh>
                <mesh position={[0, 0.06, 0.138]}>
                    <boxGeometry args={[0.07, 0.05, 0.015]} />
                    <meshStandardMaterial color="#00f5d4" metalness={0.9} roughness={0.2} toneMapped={false} />
                </mesh>

                {/* UPPER BODY: TORSO + HEAD + ARMS (Attached directly to Hips) */}
                <group ref={torsoRef} position={[0, 0.28, 0]}>
                    {/* Inner Techwear Hoodie (Deep Charcoal Textured Fabric) */}
                    <mesh castShadow position={[0, 0, 0]}>
                        <boxGeometry args={[0.44, 0.42, 0.28]} />
                        <meshStandardMaterial color="#111520" roughness={0.8} />
                    </mesh>

                    {/* Ribbed Bottom Hem Band */}
                    <mesh position={[0, -0.19, 0]}>
                        <boxGeometry args={[0.42, 0.06, 0.27]} />
                        <meshStandardMaterial color="#0b0e17" roughness={0.9} />
                    </mesh>

                    {/* Outer Techwear Bomber Vest with Tactical Shoulder Pads */}
                    <mesh castShadow position={[0, 0.02, 0.01]}>
                        <boxGeometry args={[0.46, 0.38, 0.29]} />
                        <meshStandardMaterial color="#090d16" roughness={0.65} metalness={0.25} />
                    </mesh>

                    {/* Weather-Sealed Center Zipper Line */}
                    <mesh position={[0, 0.02, 0.16]}>
                        <boxGeometry args={[0.018, 0.36, 0.01]} />
                        <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.15} />
                    </mesh>

                    {/* Tactical Chest Cargo Pockets */}
                    <mesh position={[-0.12, 0.04, 0.16]} castShadow>
                        <boxGeometry args={[0.11, 0.13, 0.03]} />
                        <meshStandardMaterial color="#05080f" roughness={0.7} />
                    </mesh>
                    <mesh position={[0.12, 0.04, 0.16]} castShadow>
                        <boxGeometry args={[0.11, 0.13, 0.03]} />
                        <meshStandardMaterial color="#05080f" roughness={0.7} />
                    </mesh>

                    {/* Cyber Neon Accent Stripes on Pocket Flaps */}
                    <mesh position={[-0.12, 0.09, 0.178]}>
                        <planeGeometry args={[0.08, 0.014]} />
                        <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                    </mesh>
                    <mesh position={[0.12, 0.09, 0.178]}>
                        <planeGeometry args={[0.08, 0.014]} />
                        <meshBasicMaterial color="#f72585" toneMapped={false} />
                    </mesh>

                    {/* 3D Draped Hood Folds Behind Neck */}
                    <mesh position={[0, 0.19, -0.12]} rotation={[-0.28, 0, 0]} castShadow>
                        <boxGeometry args={[0.32, 0.14, 0.15]} />
                        <meshStandardMaterial color="#0b0e17" roughness={0.85} />
                    </mesh>

                    {/* Anatomical Neck */}
                    <mesh position={[0, 0.24, 0]}>
                        <cylinderGeometry args={[0.075, 0.085, 0.1, 16]} />
                        <meshStandardMaterial color="#d4a373" roughness={0.7} />
                    </mesh>

                    {/* HEAD, SCULPTED FACE, LAYERED HAIR & STUDIO HEADPHONES */}
                    <group ref={headRef} position={[0, 0.38, 0]}>
                        {/* Anatomical Cranium Base (Natural Skin Tone) */}
                        <mesh castShadow position={[0, 0, 0]}>
                            <boxGeometry args={[0.22, 0.23, 0.22]} />
                            <meshStandardMaterial color="#d4a373" roughness={0.7} />
                        </mesh>

                        {/* Tapered Lower Jaw & Chin */}
                        <mesh castShadow position={[0, -0.08, 0.03]}>
                            <boxGeometry args={[0.17, 0.09, 0.17]} />
                            <meshStandardMaterial color="#d4a373" roughness={0.7} />
                        </mesh>

                        {/* Nose Bridge */}
                        <mesh position={[0, -0.01, 0.125]}>
                            <boxGeometry args={[0.03, 0.065, 0.035]} />
                            <meshStandardMaterial color="#c68b59" roughness={0.7} />
                        </mesh>

                        {/* Ears */}
                        <mesh position={[-0.115, -0.02, 0]} rotation={[0, 0, 0.15]}>
                            <boxGeometry args={[0.025, 0.06, 0.04]} />
                            <meshStandardMaterial color="#c68b59" roughness={0.7} />
                        </mesh>
                        <mesh position={[0.115, -0.02, 0]} rotation={[0, 0, -0.15]}>
                            <boxGeometry args={[0.025, 0.06, 0.04]} />
                            <meshStandardMaterial color="#c68b59" roughness={0.7} />
                        </mesh>

                        {/* Layered Cyberpunk Dark Hair with Volume and Bangs */}
                        {/* Top Hair Volume */}
                        <mesh position={[0, 0.11, -0.01]}>
                            <boxGeometry args={[0.24, 0.1, 0.25]} />
                            <meshStandardMaterial color="#161820" roughness={0.85} />
                        </mesh>
                        {/* Front Bangs (Parted fringe) */}
                        <mesh position={[-0.05, 0.06, 0.12]} rotation={[0.1, 0, 0.15]}>
                            <boxGeometry args={[0.11, 0.08, 0.035]} />
                            <meshStandardMaterial color="#11131a" roughness={0.85} />
                        </mesh>
                        <mesh position={[0.06, 0.06, 0.12]} rotation={[0.1, 0, -0.15]}>
                            <boxGeometry args={[0.1, 0.07, 0.035]} />
                            <meshStandardMaterial color="#11131a" roughness={0.85} />
                        </mesh>
                        {/* Back Tapered Hair */}
                        <mesh position={[0, 0.01, -0.095]}>
                            <boxGeometry args={[0.23, 0.15, 0.08]} />
                            <meshStandardMaterial color="#161820" roughness={0.85} />
                        </mesh>

                        {/* Slim Cyber Optical Smart Visor with HUD Emissive Reflection */}
                        <mesh position={[0, 0.03, 0.122]}>
                            <boxGeometry args={[0.19, 0.048, 0.025]} />
                            <meshStandardMaterial
                                color="#00f5d4"
                                emissive="#00f5d4"
                                emissiveIntensity={1.4}
                                roughness={0.1}
                                metalness={0.9}
                                toneMapped={false}
                            />
                        </mesh>

                        {/* Realistic Studio Over-Ear Headphones (Sony/Bose Style) */}
                        {/* Metallic Telescoping Headband */}
                        <mesh position={[0, 0.12, 0]}>
                            <torusGeometry args={[0.13, 0.014, 8, 24, Math.PI]} />
                            <meshStandardMaterial color="#27272a" metalness={0.9} roughness={0.15} />
                        </mesh>
                        {/* Left Padded Ear Cup */}
                        <group position={[-0.135, -0.015, 0]}>
                            <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
                                <cylinderGeometry args={[0.055, 0.06, 0.035, 16]} />
                                <meshStandardMaterial color="#18181b" roughness={0.4} metalness={0.6} />
                            </mesh>
                            {/* Memory Foam Cushion Ring */}
                            <mesh position={[-0.016, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                                <torusGeometry args={[0.045, 0.012, 8, 16]} />
                                <meshStandardMaterial color="#09090b" roughness={0.95} />
                            </mesh>
                            {/* Status LED */}
                            <mesh position={[0, 0.04, 0.02]}>
                                <sphereGeometry args={[0.006, 8, 8]} />
                                <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                            </mesh>
                        </group>
                        {/* Right Padded Ear Cup */}
                        <group position={[0.135, -0.015, 0]}>
                            <mesh castShadow rotation={[0, 0, -Math.PI / 2]}>
                                <cylinderGeometry args={[0.055, 0.06, 0.035, 16]} />
                                <meshStandardMaterial color="#18181b" roughness={0.4} metalness={0.6} />
                            </mesh>
                            <mesh position={[0.016, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
                                <torusGeometry args={[0.045, 0.012, 8, 16]} />
                                <meshStandardMaterial color="#09090b" roughness={0.95} />
                            </mesh>
                            <mesh position={[0, 0.04, 0.02]}>
                                <sphereGeometry args={[0.006, 8, 8]} />
                                <meshBasicMaterial color="#f72585" toneMapped={false} />
                            </mesh>
                        </group>
                    </group>

                    {/* ARTICULATED LEFT ARM (Shoulder + Bicep + Forearm + Modeled Hand) */}
                    <group ref={leftArmRef} position={[-0.27, 0.16, 0]}>
                        {/* Deltoid / Shoulder Pad */}
                        <mesh castShadow position={[0, 0, 0]}>
                            <sphereGeometry args={[0.075, 12, 12]} />
                            <meshStandardMaterial color="#0e1422" roughness={0.7} />
                        </mesh>
                        {/* Bicep Sleeve */}
                        <mesh castShadow position={[0, -0.1, 0]}>
                            <cylinderGeometry args={[0.062, 0.055, 0.16, 12]} />
                            <meshStandardMaterial color="#0e1422" roughness={0.75} />
                        </mesh>
                        {/* Forearm with Ribbed Wrist Cuff */}
                        <mesh castShadow position={[0, -0.24, 0.02]}>
                            <cylinderGeometry args={[0.054, 0.046, 0.16, 12]} />
                            <meshStandardMaterial color="#111728" roughness={0.8} />
                        </mesh>
                        {/* Cyan Cyber Trim on Sleeve */}
                        <mesh position={[-0.055, -0.22, 0.02]} rotation={[0, -Math.PI / 2, 0]}>
                            <planeGeometry args={[0.015, 0.12]} />
                            <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                        </mesh>
                        {/* Modeled Left Hand (Palm + Curled Fingers on Keyboard) */}
                        <group position={[0, -0.34, 0.04]}>
                            {/* Palm */}
                            <mesh castShadow>
                                <boxGeometry args={[0.075, 0.035, 0.08]} />
                                <meshStandardMaterial color="#d4a373" roughness={0.7} />
                            </mesh>
                            {/* Thumb */}
                            <mesh position={[0.04, -0.005, 0.02]} rotation={[0, -0.4, 0]}>
                                <boxGeometry args={[0.024, 0.02, 0.04]} />
                                <meshStandardMaterial color="#c68b59" roughness={0.7} />
                            </mesh>
                            {/* Curled Fingers typing over keyboard keys */}
                            <mesh position={[0, -0.015, 0.045]} rotation={[-0.3, 0, 0]}>
                                <boxGeometry args={[0.068, 0.022, 0.04]} />
                                <meshStandardMaterial color="#c68b59" roughness={0.7} />
                            </mesh>
                        </group>
                    </group>

                    {/* ARTICULATED RIGHT ARM (Shoulder + Bicep + Forearm + Modeled Hand) */}
                    <group ref={rightArmRef} position={[0.27, 0.16, 0]}>
                        <mesh castShadow position={[0, 0, 0]}>
                            <sphereGeometry args={[0.075, 12, 12]} />
                            <meshStandardMaterial color="#0e1422" roughness={0.7} />
                        </mesh>
                        <mesh castShadow position={[0, -0.1, 0]}>
                            <cylinderGeometry args={[0.062, 0.055, 0.16, 12]} />
                            <meshStandardMaterial color="#0e1422" roughness={0.75} />
                        </mesh>
                        <mesh castShadow position={[0, -0.24, 0.02]}>
                            <cylinderGeometry args={[0.054, 0.046, 0.16, 12]} />
                            <meshStandardMaterial color="#111728" roughness={0.8} />
                        </mesh>
                        <mesh position={[0.055, -0.22, 0.02]} rotation={[0, Math.PI / 2, 0]}>
                            <planeGeometry args={[0.015, 0.12]} />
                            <meshBasicMaterial color="#f72585" toneMapped={false} />
                        </mesh>
                        {/* Modeled Right Hand (Resting on Mouse / Typing) */}
                        <group position={[0, -0.34, 0.04]}>
                            <mesh castShadow>
                                <boxGeometry args={[0.075, 0.035, 0.08]} />
                                <meshStandardMaterial color="#d4a373" roughness={0.7} />
                            </mesh>
                            <mesh position={[-0.04, -0.005, 0.02]} rotation={[0, 0.4, 0]}>
                                <boxGeometry args={[0.024, 0.02, 0.04]} />
                                <meshStandardMaterial color="#c68b59" roughness={0.7} />
                            </mesh>
                            <mesh position={[0, -0.015, 0.045]} rotation={[-0.3, 0, 0]}>
                                <boxGeometry args={[0.068, 0.022, 0.04]} />
                                <meshStandardMaterial color="#c68b59" roughness={0.7} />
                            </mesh>
                        </group>

                        {/* Coffee Cup Item (Held during brewing routine) */}
                        <group ref={coffeeCupRef} position={[0, -0.42, 0.08]} visible={false}>
                            <mesh castShadow>
                                <cylinderGeometry args={[0.05, 0.04, 0.1, 14]} />
                                <meshStandardMaterial color="#18181b" roughness={0.3} metalness={0.7} />
                            </mesh>
                            {/* Coffee Cup Handle */}
                            <mesh position={[0.05, 0, 0]}>
                                <torusGeometry args={[0.025, 0.008, 8, 12]} />
                                <meshStandardMaterial color="#18181b" roughness={0.3} />
                            </mesh>
                            {/* Steaming Coffee Surface */}
                            <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                                <circleGeometry args={[0.045, 12]} />
                                <meshStandardMaterial color="#451a03" roughness={0.2} />
                            </mesh>
                        </group>
                    </group>
                </group>

                {/* LOWER BODY: 2-JOINT ARTICULATED LEGS & HIGH-TOP CYBER SNEAKERS */}
                {/* Left Leg (Thigh rotates around hip joint [0, 0, 0]) */}
                <group ref={leftLegRef} position={[-0.13, -0.06, 0]}>
                    {/* Upper Thigh in Tapered Dark Cargo Joggers */}
                    <mesh castShadow position={[0, -0.11, 0]}>
                        <cylinderGeometry args={[0.075, 0.065, 0.22, 12]} />
                        <meshStandardMaterial color="#080c14" roughness={0.85} />
                    </mesh>
                    {/* Cargo Flap Pocket on Outer Thigh */}
                    <mesh position={[-0.075, -0.11, 0]}>
                        <boxGeometry args={[0.02, 0.1, 0.09]} />
                        <meshStandardMaterial color="#05080f" roughness={0.8} />
                    </mesh>

                    {/* Knee & Lower Shin (Joint at y = -0.22) */}
                    <group ref={leftKneeRef} position={[0, -0.22, 0]}>
                        {/* Knee cap */}
                        <mesh position={[0, 0, 0.03]} castShadow>
                            <sphereGeometry args={[0.045, 8, 8]} />
                            <meshStandardMaterial color="#080c14" roughness={0.85} />
                        </mesh>
                        {/* Articulated Shin */}
                        <mesh castShadow position={[0, -0.11, 0]}>
                            <cylinderGeometry args={[0.062, 0.052, 0.22, 12]} />
                            <meshStandardMaterial color="#080c14" roughness={0.85} />
                        </mesh>

                        {/* High-Top Cyber Streetwear Sneaker */}
                        <group position={[0, -0.23, 0.04]}>
                            {/* Sneaker Ankle Collar & Tongue */}
                            <mesh castShadow position={[0, 0.04, -0.02]}>
                                <boxGeometry args={[0.11, 0.08, 0.12]} />
                                <meshStandardMaterial color="#18181b" roughness={0.6} />
                            </mesh>
                            {/* Sneaker Leather Upper */}
                            <mesh castShadow position={[0, 0, 0.02]}>
                                <boxGeometry args={[0.115, 0.07, 0.18]} />
                                <meshStandardMaterial color="#f8fafc" roughness={0.3} />
                            </mesh>
                            {/* Sneaker Contoured Rubber Sole with Tread */}
                            <mesh position={[0, -0.045, 0.02]} receiveShadow>
                                <boxGeometry args={[0.125, 0.03, 0.21]} />
                                <meshStandardMaterial color="#090d16" roughness={0.7} />
                            </mesh>
                            {/* Cyan Air-Bubble Heel Piping */}
                            <mesh position={[0, -0.035, -0.07]}>
                                <boxGeometry args={[0.11, 0.015, 0.02]} />
                                <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                            </mesh>
                        </group>
                    </group>
                </group>

                {/* Right Leg (Thigh rotates around hip joint [0, 0, 0]) */}
                <group ref={rightLegRef} position={[0.13, -0.06, 0]}>
                    <mesh castShadow position={[0, -0.11, 0]}>
                        <cylinderGeometry args={[0.075, 0.065, 0.22, 12]} />
                        <meshStandardMaterial color="#080c14" roughness={0.85} />
                    </mesh>
                    <mesh position={[0.075, -0.11, 0]}>
                        <boxGeometry args={[0.02, 0.1, 0.09]} />
                        <meshStandardMaterial color="#05080f" roughness={0.8} />
                    </mesh>

                    {/* Knee & Lower Shin (Joint at y = -0.22) */}
                    <group ref={rightKneeRef} position={[0, -0.22, 0]}>
                        <mesh position={[0, 0, 0.03]} castShadow>
                            <sphereGeometry args={[0.045, 8, 8]} />
                            <meshStandardMaterial color="#080c14" roughness={0.85} />
                        </mesh>
                        <mesh castShadow position={[0, -0.11, 0]}>
                            <cylinderGeometry args={[0.062, 0.052, 0.22, 12]} />
                            <meshStandardMaterial color="#080c14" roughness={0.85} />
                        </mesh>

                        {/* High-Top Cyber Streetwear Sneaker (Sole correctly at -0.045) */}
                        <group position={[0, -0.23, 0.04]}>
                            <mesh castShadow position={[0, 0.04, -0.02]}>
                                <boxGeometry args={[0.11, 0.08, 0.12]} />
                                <meshStandardMaterial color="#18181b" roughness={0.6} />
                            </mesh>
                            <mesh castShadow position={[0, 0, 0.02]}>
                                <boxGeometry args={[0.115, 0.07, 0.18]} />
                                <meshStandardMaterial color="#f8fafc" roughness={0.3} />
                            </mesh>
                            <mesh position={[0, -0.045, 0.02]} receiveShadow>
                                <boxGeometry args={[0.125, 0.03, 0.21]} />
                                <meshStandardMaterial color="#090d16" roughness={0.7} />
                            </mesh>
                            {/* Magenta Air-Bubble Heel Piping */}
                            <mesh position={[0, -0.035, -0.07]}>
                                <boxGeometry args={[0.11, 0.015, 0.02]} />
                                <meshBasicMaterial color="#f72585" toneMapped={false} />
                            </mesh>
                        </group>
                    </group>
                </group>
            </group>
        </group>
    );
}
