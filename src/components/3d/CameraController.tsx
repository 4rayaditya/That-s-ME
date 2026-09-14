'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

export type CameraMode = 'orbit' | 'dolly_in' | 'at_screen' | 'dolly_out' | 'tour';

export interface TourStop {
    id: string;
    name: string;
    subtitle: string;
    camPos: THREE.Vector3;
    target: THREE.Vector3;
    duration: number; // Duration in seconds to view
}

export const TOUR_STOPS: TourStop[] = [
    {
        id: 'battlestation',
        name: '⚡ Battlestation // Neural Workspace',
        subtitle: 'Triple curved monitors, mechanical RGB keyboard, and custom carbon-fiber desk',
        camPos: new THREE.Vector3(0, 1.6, 0.75),
        target: new THREE.Vector3(0, 1.45, -0.85),
        duration: 4.2,
    },
    {
        id: 'espresso',
        name: '☕ Neon Espresso Bar // Hyper-Caffeine',
        subtitle: 'High-pressure steam espresso machine & continuous brewing station',
        camPos: new THREE.Vector3(1.6, 1.4, 1.3),
        target: new THREE.Vector3(2.6, 1.1, 0.7),
        duration: 4.0,
    },
    {
        id: 'dog',
        name: '🐕 Cyber-Dog "Byte" // Companion Hound',
        subtitle: 'Cybernetic Shiba Inu with illuminated collar & optical visor',
        camPos: new THREE.Vector3(0.9, 1.05, 1.1),
        target: new THREE.Vector3(1.1, 0.45, 0.3),
        duration: 3.8,
    },
    {
        id: 'bed',
        name: '🛏️ Cyber Futon // Sleep & Recharge Pod',
        subtitle: 'Futon platform with memory mattress, headphones, and floating clock',
        camPos: new THREE.Vector3(-1.7, 1.35, 1.5),
        target: new THREE.Vector3(-2.6, 0.55, 0.8),
        duration: 4.2,
    },
    {
        id: 'window',
        name: '🌿 Panoramic Window // Live Skyline',
        subtitle: 'Dynamic view synchronizing with live Indian Standard Time',
        camPos: new THREE.Vector3(0, 1.7, -1.0),
        target: new THREE.Vector3(0, 1.9, -5.2),
        duration: 4.2,
    },
    {
        id: 'servers',
        name: '🖥️ 42U Mainframe // Neural Cluster Tower',
        subtitle: 'High-density blades with blinking telemetry LEDs and patch cords',
        camPos: new THREE.Vector3(-2.2, 1.55, -1.2),
        target: new THREE.Vector3(-3.2, 1.4, -2.2),
        duration: 4.0,
    },
];

interface CameraControllerProps {
    mode: CameraMode;
    onDollyComplete: () => void;
    onReturnComplete: () => void;
    onTourPoiChange?: (poiName: string, index: number, total: number) => void;
    onTourComplete?: () => void;
}

export default function CameraController({
    mode,
    onDollyComplete,
    onReturnComplete,
    onTourPoiChange,
    onTourComplete,
}: CameraControllerProps) {
    const { camera, gl } = useThree();

    // Orbit state variables - LOCKED BY DEFAULT (No auto-rotation!)
    const isDraggingRef = useRef(false);
    const previousPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const orbitAngleRef = useRef(0.74); // Initial isometric angle (~42 deg, room-centered)
    const orbitPitchRef = useRef(0.40); // Elevation angle (frames floor and ceiling evenly)
    const orbitRadiusRef = useRef(7.0); // Calibrated zoom: comfortable breathing room while keeping corners edge-to-edge

    // Animation progress for dolly-zoom
    const transitionProgressRef = useRef(0);
    const startCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
    const startTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());

    // Tour mode state
    const tourIndexRef = useRef(0);
    const tourTimeInStopRef = useRef(0);
    const tourTransitionRef = useRef(0);
    const currentTourTargetPosRef = useRef(new THREE.Vector3(0, 1.25, 0));

    // Spatial targets
    const ROOM_CENTER = new THREE.Vector3(0, 1.25, 0);
    const MONITOR_POS = new THREE.Vector3(0, 1.45, -0.85);
    const SHOULDER_POS = new THREE.Vector3(0.28, 1.52, 0.65);
    const SCREEN_LOCK_POS = new THREE.Vector3(0, 1.45, -0.15);

    // Setup mouse drag event handlers for orbit mode
    useEffect(() => {
        const dom = gl.domElement;

        const onPointerDown = (e: PointerEvent) => {
            if (mode !== 'orbit') return;
            isDraggingRef.current = true;
            previousPointerRef.current = { x: e.clientX, y: e.clientY };
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!isDraggingRef.current || mode !== 'orbit') return;
            const dx = e.clientX - previousPointerRef.current.x;
            const dy = e.clientY - previousPointerRef.current.y;

            // Rotate purely on user drag
            orbitAngleRef.current -= dx * 0.005;
            orbitPitchRef.current = Math.max(0.18, Math.min(Math.PI / 2.5, orbitPitchRef.current + dy * 0.005));

            previousPointerRef.current = { x: e.clientX, y: e.clientY };
        };

        const onPointerUp = () => {
            isDraggingRef.current = false;
        };

        const onWheel = (e: WheelEvent) => {
            if (mode !== 'orbit') return;
            e.preventDefault();
            // Smooth zoom range around 7.0 so room remains edge-to-edge
            orbitRadiusRef.current = Math.max(5.5, Math.min(8.0, orbitRadiusRef.current + e.deltaY * 0.004));
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
        } else if (mode === 'tour') {
            tourIndexRef.current = 0;
            tourTimeInStopRef.current = 0;
            tourTransitionRef.current = 0;
            startCamPosRef.current.copy(camera.position);
            startTargetRef.current.copy(ROOM_CENTER);
            if (onTourPoiChange) {
                onTourPoiChange(TOUR_STOPS[0].name, 1, TOUR_STOPS.length);
            }
        }
    }, [mode, camera, onTourPoiChange]);

    useFrame((_, delta) => {
        // ============================================================
        // 1. ORBIT MODE: LOCKED - NO AUTO-ROTATION!
        // ============================================================
        if (mode === 'orbit') {
            // Notice: Auto-rotation has been completely removed per user request!
            // Spherical to Cartesian coordinates
            const phi = Math.PI / 2 - orbitPitchRef.current;
            const theta = orbitAngleRef.current;
            const r = orbitRadiusRef.current;

            const targetX = r * Math.sin(phi) * Math.sin(theta);
            const targetY = r * Math.cos(phi) + 1.15;
            const targetZ = r * Math.sin(phi) * Math.cos(theta);

            // Smooth damping into target orbit position
            camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), delta * 6);
            camera.lookAt(ROOM_CENTER);

            // Natural perspective FOV (38 degrees for edge-to-edge room framing)
            if (camera instanceof THREE.PerspectiveCamera) {
                camera.fov = THREE.MathUtils.lerp(camera.fov, 38, delta * 4);
                camera.updateProjectionMatrix();
            }

        // ============================================================
        // 2. ROOM TOUR: GUIDED CINEMATIC CAMERA PATH
        // ============================================================
        } else if (mode === 'tour') {
            const currentStop = TOUR_STOPS[tourIndexRef.current];
            tourTimeInStopRef.current += delta;

            // Smoothly glide camera into the current stop position & target
            camera.position.lerp(currentStop.camPos, delta * 2.8);
            currentTourTargetPosRef.current.lerp(currentStop.target, delta * 3.2);
            camera.lookAt(currentTourTargetPosRef.current);

            if (camera instanceof THREE.PerspectiveCamera) {
                camera.fov = THREE.MathUtils.lerp(camera.fov, 38, delta * 3);
                camera.updateProjectionMatrix();
            }

            // Move to next tour stop when duration elapses
            if (tourTimeInStopRef.current > currentStop.duration) {
                tourTimeInStopRef.current = 0;
                const nextIndex = tourIndexRef.current + 1;
                if (nextIndex < TOUR_STOPS.length) {
                    tourIndexRef.current = nextIndex;
                    if (onTourPoiChange) {
                        onTourPoiChange(TOUR_STOPS[nextIndex].name, nextIndex + 1, TOUR_STOPS.length);
                    }
                } else {
                    // Tour finished!
                    if (onTourComplete) onTourComplete();
                }
            }

        // ============================================================
        // 3. DOLLY IN (JACK IN)
        // ============================================================
        } else if (mode === 'dolly_in') {
            transitionProgressRef.current = Math.min(1, transitionProgressRef.current + delta * 0.85);
            const p = transitionProgressRef.current;
            const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

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

            if (camera instanceof THREE.PerspectiveCamera) {
                camera.fov = THREE.MathUtils.lerp(38, 28, ease);
                camera.updateProjectionMatrix();
            }

            if (p >= 1) {
                onDollyComplete();
            }

        // ============================================================
        // 4. AT SCREEN (HOLOGRAPHIC TERMINAL OS)
        // ============================================================
        } else if (mode === 'at_screen') {
            camera.position.copy(SCREEN_LOCK_POS);
            camera.lookAt(MONITOR_POS);
            if (camera instanceof THREE.PerspectiveCamera) {
                camera.fov = 28;
                camera.updateProjectionMatrix();
            }

        // ============================================================
        // 5. DOLLY OUT (RETURN TO ROOM)
        // ============================================================
        } else if (mode === 'dolly_out') {
            transitionProgressRef.current = Math.min(1, transitionProgressRef.current + delta * 1.0);
            const p = transitionProgressRef.current;
            const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

            const phi = Math.PI / 2 - orbitPitchRef.current;
            const theta = orbitAngleRef.current;
            const r = orbitRadiusRef.current;
            const orbitPos = new THREE.Vector3(
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi) + 1.15,
                r * Math.sin(phi) * Math.cos(theta)
            );

            camera.position.lerpVectors(SCREEN_LOCK_POS, orbitPos, ease);
            camera.lookAt(ROOM_CENTER);

            if (camera instanceof THREE.PerspectiveCamera) {
                camera.fov = THREE.MathUtils.lerp(28, 38, ease);
                camera.updateProjectionMatrix();
            }

            if (p >= 1) {
                onReturnComplete();
            }
        }
    });

    return null;
}
