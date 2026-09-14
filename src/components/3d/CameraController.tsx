'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

export type CameraMode = 'orbit' | 'dolly_in' | 'at_screen' | 'dolly_out';

interface CameraControllerProps {
    mode: CameraMode;
    onDollyComplete: () => void;
    onReturnComplete: () => void;
}

export default function CameraController({
    mode,
    onDollyComplete,
    onReturnComplete,
}: CameraControllerProps) {
    const { camera, gl } = useThree();

    // Orbit state variables
    const isDraggingRef = useRef(false);
    const previousPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const orbitAngleRef = useRef(Math.PI / 4); // Initial isometric angle
    const orbitPitchRef = useRef(0.48); // Elevation angle
    const orbitRadiusRef = useRef(9.2); // Distance from center
    const userInteractedRef = useRef(false);
    const idleTimerRef = useRef(0);

    // Animation progress for dolly-zoom
    const transitionProgressRef = useRef(0);
    const startCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
    const startTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());

    // Spatial targets
    const ROOM_CENTER = new THREE.Vector3(0, 1.2, 0);

    // Primary central curved monitor location
    const MONITOR_POS = new THREE.Vector3(0, 1.45, -0.85);

    // Over-the-shoulder camera vantage point
    const SHOULDER_POS = new THREE.Vector3(0.28, 1.52, 0.65);

    // Close-up screen focus
    const SCREEN_LOCK_POS = new THREE.Vector3(0, 1.45, -0.15);

    // Setup mouse drag event handlers for orbit mode
    useEffect(() => {
        const dom = gl.domElement;

        const onPointerDown = (e: PointerEvent) => {
            if (mode !== 'orbit') return;
            isDraggingRef.current = true;
            userInteractedRef.current = true;
            idleTimerRef.current = 0;
            previousPointerRef.current = { x: e.clientX, y: e.clientY };
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!isDraggingRef.current || mode !== 'orbit') return;
            const dx = e.clientX - previousPointerRef.current.x;
            const dy = e.clientY - previousPointerRef.current.y;

            orbitAngleRef.current -= dx * 0.005;
            orbitPitchRef.current = Math.max(0.15, Math.min(Math.PI / 2.5, orbitPitchRef.current + dy * 0.005));

            previousPointerRef.current = { x: e.clientX, y: e.clientY };
        };

        const onPointerUp = () => {
            isDraggingRef.current = false;
        };

        const onWheel = (e: WheelEvent) => {
            if (mode !== 'orbit') return;
            e.preventDefault();
            orbitRadiusRef.current = Math.max(6.5, Math.min(13.0, orbitRadiusRef.current + e.deltaY * 0.005));
            idleTimerRef.current = 0;
        };

        dom.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        dom.addEventListener('wheel', onWheel, { passive: false });

        return () => {
            dom.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            dom.removeEventListener('wheel', onWheel);
        };
    }, [gl, mode]);

    // Track mode changes
    useEffect(() => {
        if (mode === 'dolly_in') {
            transitionProgressRef.current = 0;
            startCamPosRef.current.copy(camera.position);
            startTargetRef.current.copy(ROOM_CENTER);
        } else if (mode === 'dolly_out') {
            transitionProgressRef.current = 0;
            startCamPosRef.current.copy(camera.position);
            startTargetRef.current.copy(MONITOR_POS);
        }
    }, [mode, camera]);

    useFrame((_, delta) => {
        if (mode === 'orbit') {
            // Auto slow-motion 360 cinematic pan when idle
            idleTimerRef.current += delta;
            if (!isDraggingRef.current && idleTimerRef.current > 0.5) {
                orbitAngleRef.current += delta * 0.12; // Cinematic slow 360 panning
            }

            // Spherical to Cartesian coordinates
            const phi = Math.PI / 2 - orbitPitchRef.current;
            const theta = orbitAngleRef.current;
            const r = orbitRadiusRef.current;

            const targetX = r * Math.sin(phi) * Math.sin(theta);
            const targetY = r * Math.cos(phi) + 1.0;
            const targetZ = r * Math.sin(phi) * Math.cos(theta);

            // Smooth damping into target orbit position
            camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), delta * 4);
            camera.lookAt(ROOM_CENTER);

            // Set natural FOV
            if (camera instanceof THREE.PerspectiveCamera) {
                camera.fov = THREE.MathUtils.lerp(camera.fov, 42, delta * 4);
                camera.updateProjectionMatrix();
            }

        } else if (mode === 'dolly_in') {
            // Smooth dolly-zoom inward over shoulder and lock onto monitor
            transitionProgressRef.current = Math.min(1, transitionProgressRef.current + delta * 0.85);
            const p = transitionProgressRef.current;

            // EaseInOutCubic
            const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

            // 2-Stage Spline: First sweep over shoulder, then zoom directly into monitor
            let currentTargetCamPos = new THREE.Vector3();
            let currentLookTarget = new THREE.Vector3();

            if (ease < 0.6) {
                const subT = ease / 0.6;
                currentTargetCamPos.lerpVectors(startCamPosRef.current, SHOULDER_POS, subT);
                currentLookTarget.lerpVectors(startTargetRef.current, MONITOR_POS, subT);
            } else {
                const subT = (ease - 0.6) / 0.4;
                currentTargetCamPos.lerpVectors(SHOULDER_POS, SCREEN_LOCK_POS, subT);
                currentLookTarget.copy(MONITOR_POS);
            }

            camera.position.copy(currentTargetCamPos);
            camera.lookAt(currentLookTarget);

            // Dolly-Zoom dynamic FOV tightening
            if (camera instanceof THREE.PerspectiveCamera) {
                camera.fov = THREE.MathUtils.lerp(42, 28, ease);
                camera.updateProjectionMatrix();
            }

            if (p >= 1) {
                onDollyComplete();
            }

        } else if (mode === 'at_screen') {
            camera.position.copy(SCREEN_LOCK_POS);
            camera.lookAt(MONITOR_POS);
            if (camera instanceof THREE.PerspectiveCamera) {
                camera.fov = 28;
                camera.updateProjectionMatrix();
            }

        } else if (mode === 'dolly_out') {
            // Reverse dolly: Pull back out from monitor to orbit view
            transitionProgressRef.current = Math.min(1, transitionProgressRef.current + delta * 1.0);
            const p = transitionProgressRef.current;
            const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

            // Target orbit resting coordinates
            const phi = Math.PI / 2 - orbitPitchRef.current;
            const theta = orbitAngleRef.current;
            const r = orbitRadiusRef.current;
            const orbitPos = new THREE.Vector3(
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi) + 1.0,
                r * Math.sin(phi) * Math.cos(theta)
            );

            camera.position.lerpVectors(SCREEN_LOCK_POS, orbitPos, ease);
            camera.lookAt(ROOM_CENTER);

            if (camera instanceof THREE.PerspectiveCamera) {
                camera.fov = THREE.MathUtils.lerp(28, 42, ease);
                camera.updateProjectionMatrix();
            }

            if (p >= 1) {
                onReturnComplete();
            }
        }
    });

    return null;
}
