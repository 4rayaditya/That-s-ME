'use client';

import React, { useRef, useState } from 'react';
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

    // Legs for trotting & sitting
    const frontLeftLegRef = useRef<THREE.Group>(null);
    const frontRightLegRef = useRef<THREE.Group>(null);
    const backLeftLegRef = useRef<THREE.Group>(null);
    const backRightLegRef = useRef<THREE.Group>(null);

    // Interactive petting state
    const [isExcited, setIsExcited] = useState(false);
    const [hovered, setHovered] = useState(false);
    const excitedTimerRef = useRef(0);

    // Target positions based on Aditya's activities
    const POS_NEAR_DESK = new THREE.Vector3(1.1, 0, 0.7);
    const POS_NEAR_COFFEE = new THREE.Vector3(1.8, 0, 0.85);
    const POS_NEAR_BED = new THREE.Vector3(-1.6, 0, 0.9);

    const handleDogClick = (e: any) => {
        e.stopPropagation();
        audio.playDogBark();
        setIsExcited(true);
        excitedTimerRef.current = 3.5;
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

        // Determine destination based on character routine
        let targetPos = POS_NEAR_DESK;
        let targetRotY = -Math.PI / 4; // Facing slightly towards desk

        if (characterRoutine === 'walking_to_coffee' || characterRoutine === 'brewing_coffee') {
            targetPos = POS_NEAR_COFFEE;
            targetRotY = 0; // Facing coffee counter
        } else if (characterRoutine === 'walking_to_bed' || characterRoutine === 'resting_bed') {
            targetPos = POS_NEAR_BED;
            targetRotY = Math.PI / 2; // Facing bed
        }

        const group = dogGroupRef.current;
        const dist = group.position.distanceTo(targetPos);
        const isWalking = dist > 0.06;

        if (isWalking) {
            // Trot towards target smoothly without overshoot
            const dir = new THREE.Vector3().subVectors(targetPos, group.position).normalize();
            const step = Math.min(dist, delta * 1.4);
            group.position.addScaledVector(dir, step);

            // Shortest-path angle interpolation to prevent 180-degree jitter/flips
            const moveAngle = Math.atan2(dir.x, dir.z);
            let diff = moveAngle - group.rotation.y;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            group.rotation.y += diff * Math.min(1, delta * 8);

            // Trotting leg swing
            const legSwing = Math.sin(time * 12) * 0.4;
            if (frontLeftLegRef.current) frontLeftLegRef.current.rotation.x = legSwing;
            if (frontRightLegRef.current) frontRightLegRef.current.rotation.x = -legSwing;
            if (backLeftLegRef.current) backLeftLegRef.current.rotation.x = -legSwing;
            if (backRightLegRef.current) backRightLegRef.current.rotation.x = legSwing;

            if (bodyRef.current) {
                bodyRef.current.position.y = 0.28 + Math.abs(Math.sin(time * 12)) * 0.02;
            }
        } else {
            // Resting / sitting in place without shaking
            group.position.lerp(targetPos, delta * 6);

            let diff = targetRotY - group.rotation.y;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            group.rotation.y += diff * Math.min(1, delta * 5);

            // Sitting pose: back legs tucked, front legs upright
            if (frontLeftLegRef.current) frontLeftLegRef.current.rotation.x = THREE.MathUtils.lerp(frontLeftLegRef.current.rotation.x, 0, delta * 6);
            if (frontRightLegRef.current) frontRightLegRef.current.rotation.x = THREE.MathUtils.lerp(frontRightLegRef.current.rotation.x, 0, delta * 6);
            if (backLeftLegRef.current) backLeftLegRef.current.rotation.x = THREE.MathUtils.lerp(backLeftLegRef.current.rotation.x, -Math.PI / 3, delta * 6);
            if (backRightLegRef.current) backRightLegRef.current.rotation.x = THREE.MathUtils.lerp(backRightLegRef.current.rotation.x, -Math.PI / 3, delta * 6);

            // Gentle breathing body bob
            if (bodyRef.current) {
                bodyRef.current.position.y = 0.26 + Math.sin(time * 2.5) * 0.008;
            }
        }

        // Tail wagging animation
        if (tailRef.current) {
            const wagSpeed = isExcited ? 22 : isWalking ? 12 : 6;
            const wagAmp = isExcited ? 0.55 : 0.3;
            tailRef.current.rotation.y = Math.sin(time * wagSpeed) * wagAmp;
            tailRef.current.rotation.z = 0.3 + Math.cos(time * wagSpeed * 0.5) * 0.08;
        }

        // Head tilting & curious looking
        if (headRef.current) {
            const tilt = Math.sin(time * 1.6) * 0.1;
            headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, tilt, delta * 4);
            headRef.current.rotation.x = isExcited ? -0.2 : Math.sin(time * 2) * 0.05;
        }

        // Ear perk
        if (leftEarRef.current) leftEarRef.current.rotation.x = Math.sin(time * 3.5) * 0.06;
        if (rightEarRef.current) rightEarRef.current.rotation.x = -Math.sin(time * 3.5) * 0.06;
    });

    return (
        <group>
            {/* STATIONARY CIRCULAR NEON CYBER-PET RUG ANCHORED AT HOME POSITION */}
            <group position={[1.1, 0, 0.7]}>
                <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <circleGeometry args={[0.42, 24]} />
                    <meshStandardMaterial color="#080e1a" roughness={0.9} />
                </mesh>
                <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.4, 0.42, 24]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                </mesh>
            </group>

            {/* AUTONOMOUS DOG HOUND ENTITY */}
            <group
                ref={dogGroupRef}
                position={[1.1, 0, 0.7]}
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

            {/* REALISTIC CANINE ANATOMY (Shiba Inu / Cybernetic Companion) */}
            <group ref={bodyRef} position={[0, 0.26, 0]}>
                {/* 1. Muscular Deep Barrel Chest (Two-Tone Ginger & Cream Underbelly) */}
                <mesh castShadow position={[0, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.13, 0.11, 0.22, 16]} />
                    <meshStandardMaterial color="#c68a4c" roughness={0.75} />
                </mesh>
                {/* Cream Chest Fur / Throat Shield (Urajiro Marking) */}
                <mesh position={[0, -0.05, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.115, 0.095, 0.19, 14]} />
                    <meshStandardMaterial color="#fdf6eb" roughness={0.9} />
                </mesh>

                {/* 2. Tapered Flank & Haunches (Hind Waist) */}
                <mesh castShadow position={[0, 0.015, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.095, 0.11, 0.16, 16]} />
                    <meshStandardMaterial color="#c68a4c" roughness={0.75} />
                </mesh>
                {/* Cream Belly Marking */}
                <mesh position={[0, -0.045, 0.11]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.08, 0.095, 0.14, 14]} />
                    <meshStandardMaterial color="#fdf6eb" roughness={0.9} />
                </mesh>

                {/* 3. TACTICAL CYBER-HARNESS & BACK SADDLE */}
                <group position={[0, 0.09, 0.01]}>
                    {/* Carbon Fiber Saddle Plate */}
                    <mesh castShadow>
                        <boxGeometry args={[0.22, 0.035, 0.28]} />
                        <meshStandardMaterial color="#090d16" metalness={0.85} roughness={0.25} />
                    </mesh>
                    {/* Harness Straps Wrapping Under Chest */}
                    <mesh position={[0, -0.06, -0.08]}>
                        <torusGeometry args={[0.135, 0.015, 8, 20]} />
                        <meshStandardMaterial color="#030712" roughness={0.8} />
                    </mesh>
                    <mesh position={[0, -0.06, 0.08]}>
                        <torusGeometry args={[0.12, 0.015, 8, 20]} />
                        <meshStandardMaterial color="#030712" roughness={0.8} />
                    </mesh>
                    {/* Dual Tactical Battery Micro-Packs on Sides */}
                    <mesh position={[-0.12, -0.01, 0]}>
                        <boxGeometry args={[0.03, 0.06, 0.12]} />
                        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
                    </mesh>
                    <mesh position={[0.12, -0.01, 0]}>
                        <boxGeometry args={[0.03, 0.06, 0.12]} />
                        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
                    </mesh>
                    {/* Glowing Telemetry Diodes */}
                    <mesh position={[-0.138, 0, 0.02]}>
                        <sphereGeometry args={[0.007, 8, 8]} />
                        <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                    </mesh>
                    <mesh position={[0.138, 0, 0.02]}>
                        <sphereGeometry args={[0.007, 8, 8]} />
                        <meshBasicMaterial color="#f72585" toneMapped={false} />
                    </mesh>
                    {/* Miniature Tactical Antenna Angled Backwards */}
                    <mesh position={[0.08, 0.07, 0.08]} rotation={[-0.35, 0, 0.1]}>
                        <cylinderGeometry args={[0.004, 0.006, 0.14, 8]} />
                        <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
                    </mesh>
                    <mesh position={[0.08, 0.14, 0.06]}>
                        <sphereGeometry args={[0.008, 8, 8]} />
                        <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                    </mesh>
                </group>

                {/* 4. CYBERNETIC COLLAR WITH PULSING HOLOGRAPHIC ID TAG */}
                <group position={[0, 0.08, -0.17]}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.11, 0.018, 8, 20]} />
                        <meshStandardMaterial color="#030712" metalness={0.8} />
                    </mesh>
                    {/* Neon Collar Trim Ring */}
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.112, 0.006, 8, 20]} />
                        <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                    </mesh>
                    {/* Hexagonal Cyber Dog Tag */}
                    <mesh position={[0, -0.08, -0.04]} rotation={[0, 0, Math.PI / 6]}>
                        <cylinderGeometry args={[0.024, 0.024, 0.006, 6]} />
                        <meshStandardMaterial color="#f72585" emissive="#f72585" emissiveIntensity={1.2} toneMapped={false} />
                    </mesh>
                </group>

                {/* 5. EXPRESSIVE CANINE HEAD & EARS */}
                <group ref={headRef} position={[0, 0.20, -0.22]}>
                    {/* Cranium & Forehead */}
                    <mesh castShadow position={[0, 0.01, 0]}>
                        <sphereGeometry args={[0.115, 14, 14]} />
                        <meshStandardMaterial color="#c68a4c" roughness={0.75} />
                    </mesh>
                    {/* Fluffy Cheek Tufts (Cream Fur on Sides of Face) */}
                    <mesh position={[-0.09, -0.02, 0]} rotation={[0, 0, 0.2]}>
                        <sphereGeometry args={[0.055, 8, 8]} />
                        <meshStandardMaterial color="#fdf6eb" roughness={0.85} />
                    </mesh>
                    <mesh position={[0.09, -0.02, 0]} rotation={[0, 0, -0.2]}>
                        <sphereGeometry args={[0.055, 8, 8]} />
                        <meshStandardMaterial color="#fdf6eb" roughness={0.85} />
                    </mesh>

                    {/* Tapered Muzzle / Snout (Cream Shiba Fur with Defined Bridge) */}
                    <group position={[0, -0.035, -0.11]}>
                        <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.048, 0.075, 0.12, 12]} />
                            <meshStandardMaterial color="#fdf6eb" roughness={0.85} />
                        </mesh>
                        {/* Moist Black Nose with Nostrils */}
                        <mesh position={[0, 0.018, -0.07]}>
                            <boxGeometry args={[0.042, 0.03, 0.025]} />
                            <meshStandardMaterial color="#09090b" roughness={0.2} metalness={0.1} />
                        </mesh>
                        {/* Black Mouth Cleft Line */}
                        <mesh position={[0, -0.02, -0.06]}>
                            <boxGeometry args={[0.01, 0.015, 0.04]} />
                            <meshStandardMaterial color="#18181b" roughness={0.5} />
                        </mesh>
                    </group>

                    {/* Cyber Visor / Glowing Cyan Optical Eyes */}
                    <mesh position={[0, 0.03, -0.09]}>
                        <boxGeometry args={[0.165, 0.036, 0.025]} />
                        <meshStandardMaterial
                            color="#00f5d4"
                            emissive="#00f5d4"
                            emissiveIntensity={1.8}
                            roughness={0.1}
                            metalness={0.8}
                            toneMapped={false}
                        />
                    </mesh>

                    {/* Triangular Perked Shiba Ears with Soft Inner Ear Pink/Cream */}
                    <group ref={leftEarRef} position={[-0.075, 0.11, -0.01]} rotation={[0, 0, -0.25]}>
                        {/* Outer Fur Shell */}
                        <mesh castShadow>
                            <coneGeometry args={[0.048, 0.11, 4]} />
                            <meshStandardMaterial color="#c68a4c" roughness={0.8} />
                        </mesh>
                        {/* Inner Ear Fuzz */}
                        <mesh position={[0, -0.01, -0.012]} rotation={[0.1, 0, 0]}>
                            <coneGeometry args={[0.034, 0.085, 4]} />
                            <meshStandardMaterial color="#fdf6eb" roughness={0.9} />
                        </mesh>
                    </group>

                    <group ref={rightEarRef} position={[0.075, 0.11, -0.01]} rotation={[0, 0, 0.25]}>
                        <mesh castShadow>
                            <coneGeometry args={[0.048, 0.11, 4]} />
                            <meshStandardMaterial color="#c68a4c" roughness={0.8} />
                        </mesh>
                        <mesh position={[0, -0.01, -0.012]} rotation={[0.1, 0, 0]}>
                            <coneGeometry args={[0.034, 0.085, 4]} />
                            <meshStandardMaterial color="#fdf6eb" roughness={0.9} />
                        </mesh>
                    </group>
                </group>

                {/* 6. FLUFFY SICKLE TAIL WITH GLOWING CYBER-TIP */}
                <group ref={tailRef} position={[0, 0.09, 0.18]}>
                    {/* Tail Base Segment Curling Upwards */}
                    <mesh castShadow position={[0, 0.07, 0.04]} rotation={[0.65, 0, 0]}>
                        <cylinderGeometry args={[0.038, 0.045, 0.14, 10]} />
                        <meshStandardMaterial color="#c68a4c" roughness={0.8} />
                    </mesh>
                    {/* Tail Mid Fluff Arc (Cream Underside) */}
                    <mesh castShadow position={[0, 0.16, 0.07]} rotation={[1.1, 0, 0]}>
                        <cylinderGeometry args={[0.034, 0.042, 0.12, 10]} />
                        <meshStandardMaterial color="#fdf6eb" roughness={0.85} />
                    </mesh>
                    {/* Tail Curled Tip with Cyan Neon Emissive Cap */}
                    <mesh position={[0, 0.22, 0.05]}>
                        <sphereGeometry args={[0.026, 10, 10]} />
                        <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                    </mesh>
                </group>

                {/* 7. FOUR DIGITIGRADE LEGS & DETAILED PAWS WITH PADS */}
                {/* Front Left Leg */}
                <group ref={frontLeftLegRef} position={[-0.09, -0.08, -0.12]}>
                    {/* Forearm */}
                    <mesh castShadow position={[0, -0.06, 0]}>
                        <cylinderGeometry args={[0.036, 0.03, 0.14, 10]} />
                        <meshStandardMaterial color="#fdf6eb" roughness={0.85} />
                    </mesh>
                    {/* Modeled Paw with Pads */}
                    <mesh castShadow position={[0, -0.135, -0.02]}>
                        <boxGeometry args={[0.055, 0.03, 0.075]} />
                        <meshStandardMaterial color="#faeed6" roughness={0.9} />
                    </mesh>
                </group>

                {/* Front Right Leg */}
                <group ref={frontRightLegRef} position={[0.09, -0.08, -0.12]}>
                    <mesh castShadow position={[0, -0.06, 0]}>
                        <cylinderGeometry args={[0.036, 0.03, 0.14, 10]} />
                        <meshStandardMaterial color="#fdf6eb" roughness={0.85} />
                    </mesh>
                    <mesh castShadow position={[0, -0.135, -0.02]}>
                        <boxGeometry args={[0.055, 0.03, 0.075]} />
                        <meshStandardMaterial color="#faeed6" roughness={0.9} />
                    </mesh>
                </group>

                {/* Back Left Leg (Muscular Haunch with Titanium Cyber Joint) */}
                <group ref={backLeftLegRef} position={[-0.09, -0.07, 0.12]}>
                    {/* Upper Thigh Haunch */}
                    <mesh castShadow position={[0, -0.04, 0]}>
                        <sphereGeometry args={[0.055, 10, 10]} />
                        <meshStandardMaterial color="#c68a4c" roughness={0.8} />
                    </mesh>
                    {/* Hock Joint (Cyber Armor Plating) */}
                    <mesh position={[0, -0.08, 0]}>
                        <boxGeometry args={[0.045, 0.09, 0.045]} />
                        <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.25} />
                    </mesh>
                    {/* Back Paw */}
                    <mesh castShadow position={[0, -0.135, -0.015]}>
                        <boxGeometry args={[0.054, 0.03, 0.072]} />
                        <meshStandardMaterial color="#faeed6" roughness={0.9} />
                    </mesh>
                </group>

                {/* Back Right Leg */}
                <group ref={backRightLegRef} position={[0.09, -0.07, 0.12]}>
                    <mesh castShadow position={[0, -0.04, 0]}>
                        <sphereGeometry args={[0.055, 10, 10]} />
                        <meshStandardMaterial color="#c68a4c" roughness={0.8} />
                    </mesh>
                    <mesh position={[0, -0.08, 0]}>
                        <boxGeometry args={[0.045, 0.09, 0.045]} />
                        <meshStandardMaterial color="#c68a4c" roughness={0.8} />
                    </mesh>
                    <mesh castShadow position={[0, -0.135, -0.015]}>
                        <boxGeometry args={[0.054, 0.03, 0.072]} />
                        <meshStandardMaterial color="#faeed6" roughness={0.9} />
                    </mesh>
                </group>
            </group>

            {/* Floating Interaction Prompt when Hovered */}
            {hovered && (
                <mesh position={[0, 0.65, 0]}>
                    <boxGeometry args={[0.26, 0.08, 0.01]} />
                    <meshBasicMaterial color="#00f5d4" transparent opacity={0.85} toneMapped={false} />
                </mesh>
            )}
        </group>
        </group>
    );
}
