'use client';

import React, { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CharacterRoutine } from './CyberCharacter';
import { audio } from '@/lib/audio';

interface CyberDogProps {
    characterRoutine: CharacterRoutine;
}

export default function CyberDog({ characterRoutine }: CyberDogProps) {
    const dogGroupRef = useRef<THREE.Group>(null);
    const bodyRef = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Group>(null);
    const tailRef = useRef<THREE.Group>(null);
    const leftEarRef = useRef<THREE.Group>(null);
    const rightEarRef = useRef<THREE.Group>(null);

    // Legs for trotting, sitting & sleeping
    const frontLeftLegRef = useRef<THREE.Group>(null);
    const frontRightLegRef = useRef<THREE.Group>(null);
    const backLeftLegRef = useRef<THREE.Group>(null);
    const backRightLegRef = useRef<THREE.Group>(null);

    // Playful Tennis Ball Ref & Position
    const ballRef = useRef<THREE.Group>(null);
    const ballPosRef = useRef(new THREE.Vector3(1.15, 0.045, 1.05));

    // Interactive petting state
    const [isExcited, setIsExcited] = useState(false);
    const [hovered, setHovered] = useState(false);
    const excitedTimerRef = useRef(0);

    // Dedicated Dog Bed Position ("Home Base")
    const DOG_BED_POS = useMemo(() => new THREE.Vector3(1.15, 0.06, 0.75), []);

    // Playful Roaming Spots around the room when NOT sleeping
    const PLAY_SPOTS = useMemo(
        () => [
            { pos: new THREE.Vector3(0.25, 0, 0.6), rotY: -Math.PI / 3, action: 'play_bow' }, // Area rug
            { pos: new THREE.Vector3(-0.65, 0, -1.6), rotY: Math.PI / 2, action: 'nudge_ball' }, // Sunny window & Monstera
            { pos: new THREE.Vector3(2.15, 0, -0.6), rotY: -Math.PI / 2, action: 'sit_proud' }, // Woody wardrobe
            { pos: new THREE.Vector3(1.7, 0, 0.7), rotY: -Math.PI / 4, action: 'sniff' }, // Near coffee bar
            { pos: new THREE.Vector3(1.15, 0.06, 0.75), rotY: -Math.PI / 4, action: 'rest_ball' }, // In dog bed
        ],
        []
    );

    const currentSpotIdxRef = useRef(0);
    const playTimerRef = useRef(0);

    const isSleepingTime = characterRoutine === 'walking_to_bed' || characterRoutine === 'resting_bed';

    const handleDogClick = (e: any) => {
        e.stopPropagation();
        audio.playDogBark();
        setIsExcited(true);
        excitedTimerRef.current = 4.0;
    };

    useFrame((state, delta) => {
        if (!dogGroupRef.current) return;
        const time = state.clock.getElapsedTime();

        // Excited countdown
        if (isExcited) {
            excitedTimerRef.current -= delta;
            if (excitedTimerRef.current <= 0) {
                setIsExcited(false);
            }
        }

        // ============================================================
        // 1. BEHAVIOR MODE: SLEEP IN OWN BED vs PLAYING IN ROOM
        // ============================================================
        let targetPos = DOG_BED_POS;
        let targetRotY = -Math.PI / 4;
        let currentAction = 'sleep';

        if (isSleepingTime) {
            // When user clicks sleep: Golden Retriever goes to ITS OWN BED and sleeps!
            targetPos = DOG_BED_POS;
            targetRotY = -Math.PI / 4;
            currentAction = 'sleep';
        } else {
            // Other times: Golden Retriever plays with ball in different parts of the room
            playTimerRef.current += delta;
            if (playTimerRef.current > 14.0) {
                playTimerRef.current = 0;
                currentSpotIdxRef.current = (currentSpotIdxRef.current + 1) % PLAY_SPOTS.length;
            }
            const spot = PLAY_SPOTS[currentSpotIdxRef.current];
            targetPos = spot.pos;
            targetRotY = spot.rotY;
            currentAction = spot.action;
        }

        const group = dogGroupRef.current;
        const dist = group.position.distanceTo(targetPos);
        const isWalking = dist > 0.08;

        // Dynamic forward facing vector for ball tracking
        const forward = new THREE.Vector3(
            Math.sin(group.rotation.y),
            0,
            Math.cos(group.rotation.y)
        );

        if (isWalking) {
            // Trot towards target smoothly without overshoot
            const dir = new THREE.Vector3().subVectors(targetPos, group.position).normalize();
            const step = Math.min(dist, delta * 1.35);
            group.position.addScaledVector(dir, step);

            // Shortest-path angle interpolation
            const moveAngle = Math.atan2(dir.x, dir.z);
            let diff = moveAngle - group.rotation.y;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            group.rotation.y += diff * Math.min(1, delta * 7);

            // Trotting 4-leg gait
            const legSwing = Math.sin(time * 11) * 0.45;
            if (frontLeftLegRef.current) frontLeftLegRef.current.rotation.x = legSwing;
            if (frontRightLegRef.current) frontRightLegRef.current.rotation.x = -legSwing;
            if (backLeftLegRef.current) backLeftLegRef.current.rotation.x = -legSwing;
            if (backRightLegRef.current) backRightLegRef.current.rotation.x = legSwing;

            if (bodyRef.current) {
                bodyRef.current.position.y = 0.28 + Math.abs(Math.sin(time * 11)) * 0.02;
                bodyRef.current.rotation.x = 0;
            }

            // Head bobbing happily
            if (headRef.current) {
                headRef.current.position.set(0, 0.20, -0.22);
                headRef.current.rotation.x = Math.sin(time * 11) * 0.08;
                headRef.current.rotation.z = 0;
            }

            // Floppy ears bounce while trotting
            if (leftEarRef.current) leftEarRef.current.rotation.x = 0.2 + Math.sin(time * 11) * 0.12;
            if (rightEarRef.current) rightEarRef.current.rotation.x = 0.2 + Math.cos(time * 11) * 0.12;

            // Ball rolls ahead of the dog
            if (!isSleepingTime) {
                const targetBallPos = group.position.clone().add(forward.clone().multiplyScalar(0.3));
                targetBallPos.y = 0.045;
                ballPosRef.current.lerp(targetBallPos, delta * 6);
                if (ballRef.current) {
                    ballRef.current.position.copy(ballPosRef.current);
                    ballRef.current.rotation.x += delta * 6;
                }
            }
        } else {
            // At target location
            group.position.lerp(targetPos, delta * 6);

            let diff = targetRotY - group.rotation.y;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            group.rotation.y += diff * Math.min(1, delta * 5);

            // ========================================================
            // A. SLEEPING IN BED STATE
            // ========================================================
            if (isSleepingTime) {
                // Low sleeping height nestled directly inside bed cushion
                if (bodyRef.current) {
                    bodyRef.current.position.y = 0.14 + Math.sin(time * 1.6) * 0.005; // Gentle breathing bob
                    bodyRef.current.rotation.x = 0;
                    bodyRef.current.rotation.z = -0.08;
                }

                // Front & rear legs tucked under body
                if (frontLeftLegRef.current) frontLeftLegRef.current.rotation.x = THREE.MathUtils.lerp(frontLeftLegRef.current.rotation.x, -Math.PI / 2.5, delta * 6);
                if (frontRightLegRef.current) frontRightLegRef.current.rotation.x = THREE.MathUtils.lerp(frontRightLegRef.current.rotation.x, -Math.PI / 2.5, delta * 6);
                if (backLeftLegRef.current) backLeftLegRef.current.rotation.x = THREE.MathUtils.lerp(backLeftLegRef.current.rotation.x, -Math.PI / 2.2, delta * 6);
                if (backRightLegRef.current) backRightLegRef.current.rotation.x = THREE.MathUtils.lerp(backRightLegRef.current.rotation.x, -Math.PI / 2.2, delta * 6);

                // Head resting down comfortably on the bolster rim
                if (headRef.current) {
                    headRef.current.position.set(0, 0.10, -0.22);
                    headRef.current.rotation.x = 0.38;
                    headRef.current.rotation.z = 0.06;
                }

                // Floppy ears relaxed flat against cushion
                if (leftEarRef.current) leftEarRef.current.rotation.x = 0.35;
                if (rightEarRef.current) rightEarRef.current.rotation.x = 0.35;

                // Tail resting curled beside paws with subtle sleepy twitch
                if (tailRef.current) {
                    tailRef.current.rotation.y = 0.4 + Math.sin(time * 0.8) * 0.05;
                    tailRef.current.rotation.z = -0.4;
                }

                // Ball rests quietly beside dog bed
                if (ballRef.current) {
                    ballPosRef.current.set(1.15, 0.045, 1.12);
                    ballRef.current.position.copy(ballPosRef.current);
                }
            } else {
                // ====================================================
                // B. PLAYING WITH BALL AT ACTIVE SPOT
                // ====================================================
                if (currentAction === 'play_bow') {
                    // Play-bow: front shoulders dip down, rear up, happy tail wag
                    if (bodyRef.current) {
                        bodyRef.current.position.y = 0.19;
                        bodyRef.current.rotation.x = 0.22;
                    }
                    if (frontLeftLegRef.current) frontLeftLegRef.current.rotation.x = -Math.PI / 3;
                    if (frontRightLegRef.current) frontRightLegRef.current.rotation.x = -Math.PI / 3;
                    if (backLeftLegRef.current) backLeftLegRef.current.rotation.x = 0;
                    if (backRightLegRef.current) backRightLegRef.current.rotation.x = 0;

                    if (headRef.current) {
                        headRef.current.position.set(0, 0.16, -0.22);
                        headRef.current.rotation.x = -0.15;
                    }
                } else if (currentAction === 'nudge_ball') {
                    // Nudging ball with nose
                    if (bodyRef.current) {
                        bodyRef.current.position.y = 0.26;
                        bodyRef.current.rotation.x = 0.05;
                    }
                    if (frontLeftLegRef.current) frontLeftLegRef.current.rotation.x = 0;
                    if (frontRightLegRef.current) frontRightLegRef.current.rotation.x = 0;
                    if (backLeftLegRef.current) backLeftLegRef.current.rotation.x = -Math.PI / 3;
                    if (backRightLegRef.current) backRightLegRef.current.rotation.x = -Math.PI / 3;

                    if (headRef.current) {
                        headRef.current.position.set(0, 0.18, -0.22);
                        headRef.current.rotation.x = 0.25 + Math.sin(time * 4) * 0.1;
                    }
                } else {
                    // Proud sit with ball between front paws
                    if (bodyRef.current) {
                        bodyRef.current.position.y = 0.26 + Math.sin(time * 2.5) * 0.008;
                        bodyRef.current.rotation.x = 0;
                    }
                    if (frontLeftLegRef.current) frontLeftLegRef.current.rotation.x = 0;
                    if (frontRightLegRef.current) frontRightLegRef.current.rotation.x = 0;
                    if (backLeftLegRef.current) backLeftLegRef.current.rotation.x = -Math.PI / 3;
                    if (backRightLegRef.current) backRightLegRef.current.rotation.x = -Math.PI / 3;

                    if (headRef.current) {
                        headRef.current.position.set(0, 0.20, -0.22);
                        headRef.current.rotation.x = isExcited ? -0.2 : Math.sin(time * 2) * 0.05;
                        headRef.current.rotation.z = Math.sin(time * 1.5) * 0.08; // Curious head tilt
                    }
                }

                // Ear perk / bounce
                if (leftEarRef.current) leftEarRef.current.rotation.x = 0.2 + Math.sin(time * 3) * 0.05;
                if (rightEarRef.current) rightEarRef.current.rotation.x = 0.2 - Math.sin(time * 3) * 0.05;

                // Active joyful tail wagging
                if (tailRef.current) {
                    const wagSpeed = isExcited ? 24 : currentAction === 'play_bow' ? 22 : 12;
                    const wagAmp = isExcited ? 0.65 : 0.45;
                    tailRef.current.rotation.y = Math.sin(time * wagSpeed) * wagAmp;
                    tailRef.current.rotation.z = 0.2 + Math.cos(time * wagSpeed * 0.5) * 0.06;
                }

                // Ball rests right between front paws
                const targetBallPos = group.position.clone().add(forward.clone().multiplyScalar(0.24));
                targetBallPos.y = 0.045;
                ballPosRef.current.lerp(targetBallPos, delta * 5);
                if (ballRef.current) {
                    ballRef.current.position.copy(ballPosRef.current);
                }
            }
        }
    });

    return (
        <group>
            {/* 1. SEPARATE LUXURY 3D DOG BED ("HOME BASE") */}
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
                    {/* Ceramic Water Bowl */}
                    <mesh castShadow position={[-0.09, 0.08, 0]}>
                        <cylinderGeometry args={[0.065, 0.05, 0.06, 16]} />
                        <meshStandardMaterial color="#ffffff" roughness={0.2} />
                    </mesh>
                    <mesh position={[-0.09, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <circleGeometry args={[0.055, 16]} />
                        <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} />
                    </mesh>
                    {/* Ceramic Food Bowl */}
                    <mesh castShadow position={[0.09, 0.08, 0]}>
                        <cylinderGeometry args={[0.065, 0.05, 0.06, 16]} />
                        <meshStandardMaterial color="#ffffff" roughness={0.2} />
                    </mesh>
                    <mesh position={[0.09, 0.095, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <circleGeometry args={[0.055, 16]} />
                        <meshStandardMaterial color="#78350f" roughness={0.9} />
                    </mesh>
                </group>
            </group>

            {/* 2. INTERACTIVE 3D TENNIS BALL / TOY */}
            <group ref={ballRef} position={[1.15, 0.045, 1.05]}>
                {/* Yellow-Green Felt Tennis Ball */}
                <mesh castShadow receiveShadow>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshStandardMaterial color="#d4e157" roughness={0.8} />
                </mesh>
                {/* White Curved Seam Line */}
                <mesh rotation={[0.4, 0.5, 0]}>
                    <torusGeometry args={[0.0505, 0.004, 8, 24]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.6} />
                </mesh>
            </group>

            {/* 3. GOLDEN RETRIEVER COMPANION ENTITY */}
            <group
                ref={dogGroupRef}
                position={[1.15, 0.06, 0.75]}
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
                {/* GOLDEN RETRIEVER ANATOMY (Honey Golden Coat & Fluffy Ruff) */}
                <group ref={bodyRef} position={[0, 0.26, 0]}>
                    {/* Muscular Deep Barrel Chest (Honey Golden Coat) */}
                    <mesh castShadow position={[0, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.135, 0.12, 0.24, 16]} />
                        <meshStandardMaterial color="#df9b3a" roughness={0.75} />
                    </mesh>
                    {/* Golden-Cream Chest & Neck Feathering Ruff */}
                    <mesh position={[0, -0.04, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.12, 0.10, 0.21, 14]} />
                        <meshStandardMaterial color="#f9e0a8" roughness={0.85} />
                    </mesh>

                    {/* Tapered Flank & Haunches (Golden Honey Coat) */}
                    <mesh castShadow position={[0, 0.015, 0.13]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.10, 0.12, 0.18, 16]} />
                        <meshStandardMaterial color="#df9b3a" roughness={0.75} />
                    </mesh>
                    {/* Soft Cream Belly Marking */}
                    <mesh position={[0, -0.045, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.085, 0.10, 0.15, 14]} />
                        <meshStandardMaterial color="#f9e0a8" roughness={0.85} />
                    </mesh>

                    {/* Classic Saddle-Brown Leather Collar with Brass Tag */}
                    <group position={[0, 0.08, -0.17]}>
                        <mesh rotation={[Math.PI / 2, 0, 0]}>
                            <torusGeometry args={[0.115, 0.016, 8, 20]} />
                            <meshStandardMaterial color="#603813" roughness={0.5} />
                        </mesh>
                        {/* Polished Brass Circular Dog Tag */}
                        <mesh position={[0, -0.085, -0.04]}>
                            <cylinderGeometry args={[0.02, 0.02, 0.005, 16]} />
                            <meshStandardMaterial color="#eab308" metalness={0.92} roughness={0.15} />
                        </mesh>
                    </group>

                    {/* BROAD FRIENDLY RETRIEVER HEAD & FLOPPY DROP EARS */}
                    <group ref={headRef} position={[0, 0.20, -0.22]}>
                        {/* Cranium with Rounded Retriever Forehead */}
                        <mesh castShadow position={[0, 0.01, 0]}>
                            <sphereGeometry args={[0.125, 16, 16]} />
                            <meshStandardMaterial color="#df9b3a" roughness={0.75} />
                        </mesh>

                        {/* Soft Golden Retriever Velvet Muzzle & Snout */}
                        <group position={[0, -0.035, -0.11]}>
                            <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
                                <cylinderGeometry args={[0.052, 0.08, 0.13, 14]} />
                                <meshStandardMaterial color="#f0cb85" roughness={0.8} />
                            </mesh>
                            {/* Moist Black Button Nose with Nostrils */}
                            <mesh position={[0, 0.02, -0.075]} castShadow>
                                <boxGeometry args={[0.046, 0.032, 0.026]} />
                                <meshStandardMaterial color="#09090b" roughness={0.2} metalness={0.1} />
                            </mesh>
                            {/* Dark Lips & Mouth Cleft */}
                            <mesh position={[0, -0.022, -0.065]}>
                                <boxGeometry args={[0.01, 0.015, 0.045]} />
                                <meshStandardMaterial color="#1c120c" roughness={0.6} />
                            </mesh>
                        </group>

                        {/* Warm Expressive Dark Brown Retriever Eyes with Brow Ridges */}
                        <mesh position={[-0.055, 0.04, -0.095]} castShadow>
                            <sphereGeometry args={[0.018, 10, 10]} />
                            <meshStandardMaterial color="#1c120c" roughness={0.1} metalness={0.2} />
                        </mesh>
                        <mesh position={[0.055, 0.04, -0.095]} castShadow>
                            <sphereGeometry args={[0.018, 10, 10]} />
                            <meshStandardMaterial color="#1c120c" roughness={0.1} metalness={0.2} />
                        </mesh>

                        {/* SOFT FLOPPY DROPPED GOLDEN RETRIEVER EARS */}
                        {/* Left Floppy Drop Ear */}
                        <group ref={leftEarRef} position={[-0.095, 0.04, -0.01]} rotation={[0.2, 0, -0.28]}>
                            <mesh castShadow position={[0, -0.07, 0]}>
                                <boxGeometry args={[0.055, 0.15, 0.025]} />
                                <meshStandardMaterial color="#cf8726" roughness={0.8} />
                            </mesh>
                        </group>

                        {/* Right Floppy Drop Ear */}
                        <group ref={rightEarRef} position={[0.095, 0.04, -0.01]} rotation={[0.2, 0, 0.28]}>
                            <mesh castShadow position={[0, -0.07, 0]}>
                                <boxGeometry args={[0.055, 0.15, 0.025]} />
                                <meshStandardMaterial color="#cf8726" roughness={0.8} />
                            </mesh>
                        </group>
                    </group>

                    {/* FEATHERED RETRIEVER PLUMED TAIL */}
                    <group ref={tailRef} position={[0, 0.08, 0.2]}>
                        {/* Base Segment Extending Backwards */}
                        <mesh castShadow position={[0, 0.04, 0.08]} rotation={[0.45, 0, 0]}>
                            <cylinderGeometry args={[0.038, 0.045, 0.16, 12]} />
                            <meshStandardMaterial color="#df9b3a" roughness={0.8} />
                        </mesh>
                        {/* Plumed Saber Tip with Soft Feathered Fringe */}
                        <mesh castShadow position={[0, 0.09, 0.2]} rotation={[0.85, 0, 0]}>
                            <cylinderGeometry args={[0.028, 0.038, 0.18, 12]} />
                            <meshStandardMaterial color="#f0cb85" roughness={0.85} />
                        </mesh>
                        {/* Feathered Fringe Underneath */}
                        <mesh position={[0, 0.06, 0.16]} rotation={[0.65, 0, 0]}>
                            <boxGeometry args={[0.01, 0.06, 0.18]} />
                            <meshStandardMaterial color="#faeed6" roughness={0.9} />
                        </mesh>
                    </group>

                    {/* FOUR STURDY RETRIEVER LEGS WITH FEATHERING */}
                    {/* Front Left Leg */}
                    <group ref={frontLeftLegRef} position={[-0.09, -0.08, -0.12]}>
                        <mesh castShadow position={[0, -0.06, 0]}>
                            <cylinderGeometry args={[0.038, 0.032, 0.15, 10]} />
                            <meshStandardMaterial color="#df9b3a" roughness={0.8} />
                        </mesh>
                        <mesh castShadow position={[0, -0.14, -0.02]}>
                            <boxGeometry args={[0.058, 0.032, 0.078]} />
                            <meshStandardMaterial color="#faeed6" roughness={0.9} />
                        </mesh>
                    </group>

                    {/* Front Right Leg */}
                    <group ref={frontRightLegRef} position={[0.09, -0.08, -0.12]}>
                        <mesh castShadow position={[0, -0.06, 0]}>
                            <cylinderGeometry args={[0.038, 0.032, 0.15, 10]} />
                            <meshStandardMaterial color="#df9b3a" roughness={0.8} />
                        </mesh>
                        <mesh castShadow position={[0, -0.14, -0.02]}>
                            <boxGeometry args={[0.058, 0.032, 0.078]} />
                            <meshStandardMaterial color="#faeed6" roughness={0.9} />
                        </mesh>
                    </group>

                    {/* Back Left Leg */}
                    <group ref={backLeftLegRef} position={[-0.09, -0.07, 0.12]}>
                        <mesh castShadow position={[0, -0.04, 0]}>
                            <sphereGeometry args={[0.058, 10, 10]} />
                            <meshStandardMaterial color="#df9b3a" roughness={0.8} />
                        </mesh>
                        <mesh position={[0, -0.08, 0]} castShadow>
                            <cylinderGeometry args={[0.038, 0.032, 0.12, 10]} />
                            <meshStandardMaterial color="#df9b3a" roughness={0.8} />
                        </mesh>
                        <mesh castShadow position={[0, -0.14, -0.015]}>
                            <boxGeometry args={[0.056, 0.032, 0.076]} />
                            <meshStandardMaterial color="#faeed6" roughness={0.9} />
                        </mesh>
                    </group>

                    {/* Back Right Leg */}
                    <group ref={backRightLegRef} position={[0.09, -0.07, 0.12]}>
                        <mesh castShadow position={[0, -0.04, 0]}>
                            <sphereGeometry args={[0.058, 10, 10]} />
                            <meshStandardMaterial color="#df9b3a" roughness={0.8} />
                        </mesh>
                        <mesh position={[0, -0.08, 0]} castShadow>
                            <cylinderGeometry args={[0.038, 0.032, 0.12, 10]} />
                            <meshStandardMaterial color="#df9b3a" roughness={0.8} />
                        </mesh>
                        <mesh castShadow position={[0, -0.14, -0.015]}>
                            <boxGeometry args={[0.056, 0.032, 0.076]} />
                            <meshStandardMaterial color="#faeed6" roughness={0.9} />
                        </mesh>
                    </group>
                </group>

                {/* Floating Interaction Prompt when Hovered */}
                {hovered && (
                    <mesh position={[0, 0.65, 0]}>
                        <boxGeometry args={[0.28, 0.08, 0.01]} />
                        <meshBasicMaterial color="#f59e0b" transparent opacity={0.9} toneMapped={false} />
                    </mesh>
                )}
            </group>
        </group>
    );
}
