'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface FPPControlsProps {
  enabled?: boolean;
  movementSpeed?: number;
  lookSpeed?: number;
  boundaryRadius?: number;
}

export function FPPControls({
  enabled = true,
  movementSpeed = 0.15,
  lookSpeed = 0.002,
  boundaryRadius = 100,
}: FPPControlsProps) {
  const { camera } = useThree();
  const keysPressed = useRef<Set<string>>(new Set());
  const mouseMovement = useRef({ x: 0, y: 0 });
  const velocity = useRef(new THREE.Vector3());
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const isPointerLocked = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    // Initialize euler from camera rotation
    euler.current.setFromQuaternion(camera.quaternion);

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerLocked.current) return;
      
      mouseMovement.current.x = e.movementX;
      mouseMovement.current.y = e.movementY;
    };

    const handlePointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement !== null;
    };

    const handleClick = () => {
      // Request pointer lock on click
      if (document.pointerLockElement === null) {
        document.body.requestPointerLock();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('click', handleClick);
    };
  }, [enabled, camera]);

  useFrame(() => {
    if (!enabled) return;

    // Mouse look
    if (isPointerLocked.current) {
      euler.current.y -= mouseMovement.current.x * lookSpeed;
      euler.current.x -= mouseMovement.current.y * lookSpeed;

      // Clamp vertical rotation
      euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x));

      camera.quaternion.setFromEuler(euler.current);

      // Reset mouse movement
      mouseMovement.current.x = 0;
      mouseMovement.current.y = 0;
    }

    // WASD Movement
    const moveDirection = new THREE.Vector3();

    if (keysPressed.current.has('w')) moveDirection.z -= 1;
    if (keysPressed.current.has('s')) moveDirection.z += 1;
    if (keysPressed.current.has('a')) moveDirection.x -= 1;
    if (keysPressed.current.has('d')) moveDirection.x += 1;
    if (keysPressed.current.has(' ')) moveDirection.y += 1; // Space to go up
    if (keysPressed.current.has('shift')) moveDirection.y -= 1; // Shift to go down

    // Normalize diagonal movement
    if (moveDirection.length() > 0) {
      moveDirection.normalize();
    }

    // Apply movement relative to camera direction
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    velocity.current.x = right.x * moveDirection.x + forward.x * moveDirection.z;
    velocity.current.z = right.z * moveDirection.x + forward.z * moveDirection.z;
    velocity.current.y = moveDirection.y;

    // Apply velocity
    camera.position.addScaledVector(velocity.current, movementSpeed);

    // Keep within boundaries (sphere)
    if (camera.position.length() > boundaryRadius) {
      camera.position.normalize().multiplyScalar(boundaryRadius);
    }

    // Minimum height above ground
    if (camera.position.y < 2) {
      camera.position.y = 2;
    }
  });

  return null;
}
