'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Project } from '@/types';
import { useAppStore } from '@/store/appStore';

interface ProjectCard3DProps {
  project: Project;
  position: [number, number, number];
  index: number;
}

export function ProjectCard3D({ project, position, index }: ProjectCard3DProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const setSelectedProject = useAppStore((state) => state.setSelectedProject);
  const setProjectDetailOpen = useAppStore((state) => state.setProjectDetailOpen);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Idle floating animation
    meshRef.current.position.y = position[1] + Math.sin(time + index) * 0.1;

    // Hover scale effect
    const targetScale = hovered ? 1.1 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );

    // Subtle rotation
    if (!hovered) {
      meshRef.current.rotation.y = Math.sin(time * 0.3 + index) * 0.1;
    }
  });

  const handleClick = () => {
    setSelectedProject(project.id);
    setProjectDetailOpen(true);
  };

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Card container */}
      <RoundedBox
        args={[2, 2.8, 0.1]}
        radius={0.05}
        smoothness={4}
        castShadow
      >
        <meshStandardMaterial
          color={hovered ? '#38bdf8' : '#1e293b'}
          metalness={0.6}
          roughness={0.4}
          emissive={hovered ? '#0ea5e9' : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </RoundedBox>

      {/* Title */}
      <Text
        position={[0, 0.8, 0.06]}
        fontSize={0.15}
        maxWidth={1.8}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        font="/fonts/inter-bold.woff"
        anchorX="center"
        anchorY="middle"
        color="#ffffff"
      >
        {project.title}
      </Text>

      {/* Description */}
      <Text
        position={[0, 0.3, 0.06]}
        fontSize={0.08}
        maxWidth={1.7}
        lineHeight={1.2}
        textAlign="center"
        font="/fonts/inter-regular.woff"
        anchorX="center"
        anchorY="middle"
        color="#cbd5e1"
      >
        {project.description}
      </Text>

      {/* Tech stack indicators */}
      <group position={[0, -0.6, 0.06]}>
        {project.techStack.slice(0, 3).map((tech, i) => (
          <Text
            key={tech}
            position={[(i - 1) * 0.6, 0, 0]}
            fontSize={0.06}
            color="#0ea5e9"
            anchorX="center"
          >
            {tech}
          </Text>
        ))}
      </group>

      {/* Glow effect when hovered */}
      {hovered && (
        <pointLight
          position={[0, 0, 0.5]}
          intensity={0.5}
          distance={3}
          color="#0ea5e9"
        />
      )}
    </group>
  );
}
