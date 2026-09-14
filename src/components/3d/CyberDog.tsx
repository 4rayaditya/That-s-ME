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
    const leftEarRef = useRef<THREE.Mesh>(null);
    const rightEarRef = useRef<THREE.Mesh>(null);

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

            {/* DOG MAIN BODY */}
            <group ref={bodyRef} position={[0, 0.26, 0]}>
                {/* Torso */}
                <mesh castShadow position={[0, 0, 0]}>
                    <boxGeometry args={[0.22, 0.22, 0.38]} />
                    <meshStandardMaterial color="#c68a4c" roughness={0.7} />
                </mesh>

                {/* Cyber Armor Plate on Back / Shoulders */}
                <mesh castShadow position={[0, 0.115, 0.02]}>
                    <boxGeometry args={[0.21, 0.03, 0.28]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Cyber Armor Neon Accent Line */}
                <mesh position={[0, 0.132, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.16, 0.02]} />
                    <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                </mesh>

                {/* Creamy Underbelly */}
                <mesh position={[0, -0.06, 0]}>
                    <boxGeometry args={[0.18, 0.12, 0.32]} />
                    <meshStandardMaterial color="#faeed6" roughness={0.9} />
                </mesh>

                {/* CYBERNETIC COLLAR WITH GLOWING CYBER-TAG */}
                <group position={[0, 0.08, -0.16]}>
                    <mesh>
                        <boxGeometry args={[0.23, 0.04, 0.08]} />
                        <meshStandardMaterial color="#090d16" metalness={0.9} />
                    </mesh>
                    <mesh position={[0, 0, -0.042]}>
                        <boxGeometry args={[0.18, 0.02, 0.01]} />
                        <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                    </mesh>
                    {/* Glowing Dog Tag (Pulsing Cyan) */}
                    <mesh position={[0, -0.05, -0.045]}>
                        <cylinderGeometry args={[0.02, 0.02, 0.01, 8]} />
                        <meshBasicMaterial color="#f72585" toneMapped={false} />
                    </mesh>
                </group>

                {/* HEAD & EXPRESSIVE EARS */}
                <group ref={headRef} position={[0, 0.18, -0.22]}>
                    {/* Head Skull */}
                    <mesh castShadow position={[0, 0, 0]}>
                        <boxGeometry args={[0.2, 0.18, 0.18]} />
                        <meshStandardMaterial color="#c68a4c" roughness={0.7} />
                    </mesh>

                    {/* Muzzle / Snout */}
                    <mesh castShadow position={[0, -0.04, -0.12]}>
                        <boxGeometry args={[0.12, 0.09, 0.12]} />
                        <meshStandardMaterial color="#faeed6" roughness={0.8} />
                    </mesh>
                    {/* Black Nose */}
                    <mesh position={[0, -0.01, -0.185]}>
                        <boxGeometry args={[0.04, 0.03, 0.02]} />
                        <meshStandardMaterial color="#111827" roughness={0.3} />
                    </mesh>

                    {/* Cyber Visor / Glowing Cyan Eyes */}
                    <mesh position={[0, 0.03, -0.095]}>
                        <boxGeometry args={[0.17, 0.04, 0.02]} />
                        <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                    </mesh>

                    {/* Left Perked Ear */}
                    <mesh ref={leftEarRef} position={[-0.08, 0.12, -0.02]} rotation={[0, 0, -0.2]} castShadow>
                        <coneGeometry args={[0.05, 0.1, 4]} />
                        <meshStandardMaterial color="#c68a4c" roughness={0.7} />
                    </mesh>

                    {/* Right Perked Ear */}
                    <mesh ref={rightEarRef} position={[0.08, 0.12, -0.02]} rotation={[0, 0, 0.2]} castShadow>
                        <coneGeometry args={[0.05, 0.1, 4]} />
                        <meshStandardMaterial color="#c68a4c" roughness={0.7} />
                    </mesh>
                </group>

                {/* WAGGING CYBER TAIL */}
                <group ref={tailRef} position={[0, 0.08, 0.19]}>
                    <mesh castShadow position={[0, 0.08, 0.06]} rotation={[0.5, 0, 0]}>
                        <cylinderGeometry args={[0.03, 0.04, 0.18, 8]} />
                        <meshStandardMaterial color="#c68a4c" roughness={0.7} />
                    </mesh>
                    {/* Cyber Tail Tip */}
                    <mesh position={[0, 0.17, 0.11]}>
                        <sphereGeometry args={[0.028, 8, 8]} />
                        <meshBasicMaterial color="#00f5d4" toneMapped={false} />
                    </mesh>
                </group>

                {/* 4 ARTICULATED LEGS */}
                {/* Front Left */}
                <group ref={frontLeftLegRef} position={[-0.09, -0.1, -0.12]}>
                    <mesh castShadow position={[0, -0.08, 0]}>
                        <boxGeometry args={[0.06, 0.18, 0.06]} />
                        <meshStandardMaterial color="#faeed6" roughness={0.8} />
                    </mesh>
                </group>

                {/* Front Right */}
                <group ref={frontRightLegRef} position={[0.09, -0.1, -0.12]}>
                    <mesh castShadow position={[0, -0.08, 0]}>
                        <boxGeometry args={[0.06, 0.18, 0.06]} />
                        <meshStandardMaterial color="#faeed6" roughness={0.8} />
                    </mesh>
                </group>

                {/* Back Left (with Titanium Cyber Joint) */}
                <group ref={backLeftLegRef} position={[-0.09, -0.1, 0.12]}>
                    <mesh castShadow position={[0, -0.08, 0]}>
                        <boxGeometry args={[0.07, 0.18, 0.07]} />
                        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
                    </mesh>
                </group>

                {/* Back Right */}
                <group ref={backRightLegRef} position={[0.09, -0.1, 0.12]}>
                    <mesh castShadow position={[0, -0.08, 0]}>
                        <boxGeometry args={[0.07, 0.18, 0.07]} />
                        <meshStandardMaterial color="#c68a4c" roughness={0.8} />
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
