'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

export function AboutGalaxy() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = clock.getElapsedTime() * 0.03;
        }
    });

    const skills = [
        { name: 'React', color: '#61dafb', icon: '⚛️' },
        { name: 'TypeScript', color: '#3178c6', icon: '📘' },
        { name: 'Next.js', color: '#000000', icon: '▲' },
        { name: 'Three.js', color: '#049ef4', icon: '🎮' },
        { name: 'Node.js', color: '#68a063', icon: '🟢' },
        { name: 'Python', color: '#3776ab', icon: '🐍' },
    ];

    return (
        <group>
            {/* Central Core */}
            <mesh>
                <sphereGeometry args={[2, 32, 32]} />
                <meshStandardMaterial
                    color="#10b981"
                    emissive="#10b981"
                    emissiveIntensity={0.5}
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>
            <pointLight color="#10b981" intensity={8} distance={40} />

            {/* Title */}
            <Float speed={2} rotationIntensity={0.3} floatIntensity={1}>
                <Text
                    position={[0, 6, 0]}
                    fontSize={1.2}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.08}
                    outlineColor="#10b981"
                >
                    About Constellation
                </Text>
            </Float>

            {/* Bio Hologram */}
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <group position={[0, 0, 5]}>
                    <Html
                        transform
                        distanceFactor={6}
                        style={{
                            width: '400px',
                            background: 'rgba(0, 0, 0, 0.8)',
                            border: '2px solid #10b981',
                            borderRadius: '12px',
                            padding: '24px',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <div className="text-white">
                            <h3 className="text-2xl font-bold text-green-400 mb-4">👨‍💻 Full Stack Developer</h3>
                            <p className="text-gray-300 mb-4">
                                Passionate about creating immersive web experiences with cutting-edge technologies.
                                Specialized in 3D web development, React ecosystems, and performant applications.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <span
                                        key={skill.name}
                                        className="px-3 py-1 bg-green-900/30 border border-green-500/50 rounded-full text-sm"
                                    >
                                        {skill.icon} {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Html>
                </group>
            </Float>

            {/* Skill Orbs Orbiting */}
            <group ref={groupRef}>
                {skills.map((skill, index) => {
                    const angle = (index / skills.length) * Math.PI * 2;
                    const radius = 8;
                    const x = Math.cos(angle) * radius;
                    const z = Math.sin(angle) * radius;
                    const y = Math.sin(angle * 3) * 2;

                    return (
                        <group key={skill.name} position={[x, y, z]}>
                            <Float speed={1 + index * 0.2} rotationIntensity={0.5}>
                                <mesh>
                                    <sphereGeometry args={[0.5, 16, 16]} />
                                    <meshStandardMaterial
                                        color={skill.color}
                                        emissive={skill.color}
                                        emissiveIntensity={0.5}
                                        metalness={0.7}
                                        roughness={0.3}
                                    />
                                </mesh>
                                <Text
                                    position={[0, -1, 0]}
                                    fontSize={0.3}
                                    color="#ffffff"
                                    anchorX="center"
                                    anchorY="middle"
                                >
                                    {skill.name}
                                </Text>
                            </Float>
                        </group>
                    );
                })}
            </group>

            {/* Connecting Lines */}
            {skills.map((_, index) => {
                const angle = (index / skills.length) * Math.PI * 2;
                const radius = 8;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                const y = Math.sin(angle * 3) * 2;

                const points = [];
                points.push(new THREE.Vector3(0, 0, 0));
                points.push(new THREE.Vector3(x, y, z));

                const geometry = new THREE.BufferGeometry().setFromPoints(points);

                return (
                    <primitive key={`line-${index}`} object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#10b981', transparent: true, opacity: 0.3 }))} />
                );
            })}

            {/* Particle field */}
            {Array.from({ length: 100 }).map((_, i) => {
                const angle = Math.random() * Math.PI * 2;
                const distance = 10 + Math.random() * 15;
                const x = Math.cos(angle) * distance;
                const z = Math.sin(angle) * distance;
                const y = (Math.random() - 0.5) * 15;

                return (
                    <mesh key={i} position={[x, y, z]}>
                        <sphereGeometry args={[0.05, 8, 8]} />
                        <meshBasicMaterial color="#34d399" />
                    </mesh>
                );
            })}

            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
        </group>
    );
}
