'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useUniverseStore } from '@/store/universeStore';
import * as THREE from 'three';
import gsap from 'gsap';

export function CameraTransitionController() {
  const { camera } = useThree();
  const { cameraTransition, isTransitioning, updateTransitionProgress } = useUniverseStore();
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (cameraTransition && isTransitioning) {
      // Cancel any existing animation
      if (animationRef.current) {
        animationRef.current.kill();
      }

      const startPos = camera.position.clone();
      const targetPos = cameraTransition.to.clone();
      const targetLookAt = cameraTransition.lookAt.clone();

      // Animate camera position
      animationRef.current = gsap.to(camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: cameraTransition.duration / 1000,
        ease: 'power2.inOut',
        onUpdate: () => {
          camera.lookAt(targetLookAt);
          const progress = animationRef.current?.progress() || 0;
          updateTransitionProgress(progress);
        },
      });

      // Also animate camera rotation/lookAt
      const dummyObject = new THREE.Object3D();
      dummyObject.position.copy(startPos);
      dummyObject.lookAt(camera.position);

      gsap.to(dummyObject.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: cameraTransition.duration / 1000,
        ease: 'power2.inOut',
        onUpdate: () => {
          camera.quaternion.copy(dummyObject.quaternion);
        },
      });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [cameraTransition, isTransitioning, camera, updateTransitionProgress]);

  return null;
}
