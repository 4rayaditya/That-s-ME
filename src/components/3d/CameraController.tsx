'use client';

import React, { useRef, useEffect, useMemo } from 'react';
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
        subtitle: 'Sleek single ultrawide OLED monitor, custom liquid-cooled PC tower with RTX GPU, and mechanical keyboard',
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

    // Fixed 4th wall middle camera coordinates (generously zoomed out so entire room diorama is comfortably visible):
    // Centered horizontally (x = 0), at eye-level wall height (y = 1.82), pulled back on the 4th wall (z = 5.35)
    // looking straight forward into the room with zero mouse/trackpad rotation.
    const FIXED_WALL4_POS = useMemo(() => new THREE.Vector3(0, 1.82, 5.35), []);
    const ROOM_TARGET = useMemo(() => new THREE.Vector3(0, 1.45, -0.60), []);

    // Opening cinematic reveal: starts at user's maximum zoom-in (z = 4.55, fov = 55) and smoothly glides out to 4th wall (z = 5.35, fov = 58)
    const introActiveRef = useRef(true);
    const introProgressRef = useRef(0);
    const INTRO_ZOOM_POS = useMemo(() => new THREE.Vector3(0, 1.75, 4.55), []);
    const INTRO_FOV = 55;
    const MASTER_FOV = 58;
    const INTRO_DURATION = 2.6; // seconds

    // Animation progress for dolly-zoom
    const transitionProgressRef = useRef(0);
    const startCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
    const startTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());

    // Tour mode state
    const tourIndexRef = useRef(0);
    const tourTimeInStopRef = useRef(0);
    const tourTransitionRef = useRef(0);
    const currentTourTargetPosRef = useRef(new THREE.Vector3(0, 1.45, -0.70));

    // Spatial targets
    const MONITOR_POS = new THREE.Vector3(0, 1.45, -0.85);
    const SCREEN_LOCK_POS = new THREE.Vector3(0, 1.45, -0.15);

    // Track mode changes
    useEffect(() => {
        if (mode !== 'orbit') {
            introActiveRef.current = false;
        }

        if (mode === 'dolly_in') {
            transitionProgressRef.current = 0;
            startCamPosRef.current.copy(camera.position);
            startTargetRef.current.copy(ROOM_TARGET);
        } else if (mode === 'dolly_out') {
            transitionProgressRef.current = 0;
            startCamPosRef.current.copy(camera.position);
            startTargetRef.current.copy(MONITOR_POS);
        } else if (mode === 'tour') {
            tourIndexRef.current = 0;
            tourTimeInStopRef.current = 0;
            tourTransitionRef.current = 0;
            startCamPosRef.current.copy(camera.position);
            startTargetRef.current.copy(ROOM_TARGET);
            if (onTourPoiChange) {
                onTourPoiChange(TOUR_STOPS[0].name, 1, TOUR_STOPS.length);
            }
        }
    }, [mode, camera, onTourPoiChange, ROOM_TARGET]);

    useFrame((_, delta) => {
        const dt = Math.min(0.05, delta);

        // ============================================================
        // 1. FIXED 4TH WALL MIDDLE VIEW: OPENING REVEAL & FIXED VIEW
        // ============================================================
        if (mode === 'orbit') {
            if (introActiveRef.current) {
                introProgressRef.current = Math.min(1, introProgressRef.current + dt / INTRO_DURATION);
                const p = introProgressRef.current;
                // Luxurious cubic ease-out: smooth decelerating glide backwards
                const ease = 1 - Math.pow(1 - p, 3);

                camera.position.lerpVectors(INTRO_ZOOM_POS, FIXED_WALL4_POS, ease);
                camera.lookAt(ROOM_TARGET);

                if (camera instanceof THREE.PerspectiveCamera) {
                    camera.fov = THREE.MathUtils.lerp(INTRO_FOV, MASTER_FOV, ease);
                    camera.updateProjectionMatrix();
                }

                if (p >= 1) {
                    introActiveRef.current = false;
                }
            } else {
                // Camera position is permanently locked at the 4th wall middle view
                camera.position.lerp(FIXED_WALL4_POS, Math.min(1, dt * 8));
                camera.lookAt(ROOM_TARGET);

                // Natural perspective FOV (58 degrees for generously zoomed out 4th wall framing showing entire room)
                if (camera instanceof THREE.PerspectiveCamera) {
                    camera.fov = THREE.MathUtils.lerp(camera.fov, MASTER_FOV, Math.min(1, dt * 6));
                    camera.updateProjectionMatrix();
                }
            }

        // ============================================================
        // 2. ROOM TOUR: GUIDED CINEMATIC CAMERA PATH
        // ============================================================
        } else if (mode === 'tour') {
            const currentStop = TOUR_STOPS[tourIndexRef.current];
            tourTimeInStopRef.current += dt;

            // Smoothly glide camera into the current stop position & target
            camera.position.lerp(currentStop.camPos, Math.min(1, dt * 2.8));
            currentTourTargetPosRef.current.lerp(currentStop.target, Math.min(1, dt * 3.2));
            camera.lookAt(currentTourTargetPosRef.current);

            if (camera instanceof THREE.PerspectiveCamera) {
                camera.fov = THREE.MathUtils.lerp(camera.fov, 38, Math.min(1, dt * 3));
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
        // 3. DOLLY IN (SUBTLE, SMOOTH DIRECT GLIDE INTO COMPUTER SCREEN)
        // ============================================================
        } else if (mode === 'dolly_in') {
            transitionProgressRef.current = Math.min(1, transitionProgressRef.current + dt * 1.6);
            const p = transitionProgressRef.current;
            const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

            // Direct smooth linear glide along center axis into screen position (no odd swerves)
            camera.position.lerpVectors(startCamPosRef.current, SCREEN_LOCK_POS, ease);
            camera.lookAt(MONITOR_POS);

            if (camera instanceof THREE.PerspectiveCamera) {
                camera.fov = THREE.MathUtils.lerp(58, 38, ease);
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
                camera.fov = 38;
                camera.updateProjectionMatrix();
            }

        // ============================================================
        // 5. DOLLY OUT (SUBTLE, SMOOTH DIRECT RETURN TO 4TH WALL VIEW)
        // ============================================================
        } else if (mode === 'dolly_out') {
            transitionProgressRef.current = Math.min(1, transitionProgressRef.current + dt * 1.6);
            const p = transitionProgressRef.current;
            const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

            camera.position.lerpVectors(SCREEN_LOCK_POS, FIXED_WALL4_POS, ease);
            camera.lookAt(ROOM_TARGET);

            if (camera instanceof THREE.PerspectiveCamera) {
                camera.fov = THREE.MathUtils.lerp(38, 58, ease);
                camera.updateProjectionMatrix();
            }

            if (p >= 1) {
                onReturnComplete();
            }
        }
    });

    return null;
}
