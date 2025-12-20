'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

export function ContactGalaxy() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = clock.getElapsedTime() * 0.04;
        }
    });

    const contactMethods = [
        { icon: '📧', label: 'Email', value: 'contact@example.com', color: '#ef4444' },
        { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/yourname', color: '#0077b5' },
        { icon: '🐙', label: 'GitHub', value: 'github.com/yourusername', color: '#171515' },
        { icon: '🐦', label: 'Twitter', value: '@yourusername', color: '#1da1f2' },
    ];

    return (
        <group>
            {/* Central Gateway */}
            <mesh>
                <torusGeometry args={[2, 0.5, 16, 100]} />
                <meshStandardMaterial
                    color="#ef4444"
                    emissive="#ef4444"
                    emissiveIntensity={0.6}
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>

            {/* Inner portal */}
            <mesh>
                <circleGeometry args={[2, 64]} />
                <meshBasicMaterial
                    color="#7c3aed"
                    transparent
                    opacity={0.5}
                    side={THREE.DoubleSide}
                />
            </mesh>

            <pointLight color="#ef4444" intensity={10} distance={40} />

            {/* Title */}
            <Float speed={2} rotationIntensity={0.4} floatIntensity={1}>
                <Text
                    position={[0, 5, 0]}
                    fontSize={1.2}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.08}
                    outlineColor="#ef4444"
                >
                    Contact Gateway
                </Text>
            </Float>

            {/* Contact Methods Orbiting */}
            <group ref={groupRef}>
                {contactMethods.map((method, index) => {
                    const angle = (index / contactMethods.length) * Math.PI * 2;
                    const radius = 7;
                    const x = Math.cos(angle) * radius;
                    const z = Math.sin(angle) * radius;

                    return (
                        <group key={method.label} position={[x, 0, z]}>
                            <Float speed={1.5 + index * 0.3} rotationIntensity={0.5} floatIntensity={0.8}>
                                {/* Contact Card */}
                                <Html
                                    transform
                                    distanceFactor={4}
                                    style={{
                                        width: '250px',
                                    }}
                                >
                                    <div
                                        className="bg-black/90 border-2 rounded-lg p-4 backdrop-blur-md cursor-pointer hover:scale-105 transition-transform"
                                        style={{ borderColor: method.color }}
                                    >
                                        <div className="text-4xl mb-2 text-center">{method.icon}</div>
                                        <div className="text-white font-bold text-center mb-1">{method.label}</div>
                                        <div className="text-gray-400 text-sm text-center break-all">{method.value}</div>
                                    </div>
                                </Html>
                            </Float>

                            {/* Orb indicator */}
                            <mesh position={[0, -3, 0]}>
                                <sphereGeometry args={[0.3, 16, 16]} />
                                <meshBasicMaterial color={method.color} />
                            </mesh>
                            <pointLight position={[0, -3, 0]} color={method.color} intensity={2} distance={5} />
                        </group>
                    );
                })}
            </group>

            {/* Energy beams */}
            {contactMethods.map((method, index) => {
                const angle = (index / contactMethods.length) * Math.PI * 2;
                const radius = 7;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;

                const points = [];
                points.push(new THREE.Vector3(0, 0, 0));
                points.push(new THREE.Vector3(x, 0, z));

                const geometry = new THREE.BufferGeometry().setFromPoints(points);

                return (
                    <primitive key={`beam-${index}`} object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: method.color, transparent: true, opacity: 0.5 }))} />
                );
            })}

            {/* Pulsing rings */}
            {[3, 4, 5].map((radius) => (
                <mesh key={radius} rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[radius, radius + 0.05, 64]} />
                    <meshBasicMaterial color="#ef4444" transparent opacity={0.2} side={THREE.DoubleSide} />
                </mesh>
            ))}

            {/* Message particles */}
            {Array.from({ length: 80 }).map((_, i) => {
                const angle = Math.random() * Math.PI * 2;
                const distance = 9 + Math.random() * 12;
                const x = Math.cos(angle) * distance;
                const z = Math.sin(angle) * distance;
                const y = (Math.random() - 0.5) * 12;

                return (
                    <mesh key={i} position={[x, y, z]}>
                        <sphereGeometry args={[0.06, 8, 8]} />
                        <meshBasicMaterial color="#f87171" />
                    </mesh>
                );
            })}

            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={0.7} />
        </group>
    );
}
