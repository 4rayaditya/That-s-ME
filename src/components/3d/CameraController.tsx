'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

export type CameraMode = 'orbit' | 'dolly_in' | 'at_screen' | 'dolly_out' | 'tour' | 'walk';

export interface TourStop {
    id: string;
    name: string;
    subtitle: string;
    camPos: THREE.Vector3;
    target: THREE.Vector3;
    fov: number;
    duration: number; // 5.0 seconds per user request
}

export const TOUR_STOPS: TourStop[] = [
    {
        id: 'battlestation',
        name: 'BATTLESTATION // WORKSPACE',
        subtitle: 'Dual monitors, custom liquid-cooled RTX rig, and mechanical keyboard',
        camPos: new THREE.Vector3(-0.72, 1.28, -1.85),
        target: new THREE.Vector3(0.18, 1.45, -3.20),
        fov: 42,
        duration: 5.0,
    },
    {
        id: 'espresso_wardrobe',
        name: 'ESPRESSO BAR & BOTANICAL WARDROBE',
        subtitle: 'Italian espresso bar alongside Scandinavian fluted oak wardrobe with cascading pothos',
        camPos: new THREE.Vector3(0.65, 1.60, -1.05),
        target: new THREE.Vector3(3.15, 1.50, -1.05),
        fov: 48,
        duration: 5.0,
    },
    {
        id: 'lounge',
        name: 'MEDIA LOUNGE // 65" 4K OLED TV',
        subtitle: 'Chill sofa zone with Japanese cyberpunk wall-mounted skateboards',
        camPos: new THREE.Vector3(1.25, 1.40, -0.65),
        target: new THREE.Vector3(2.85, 1.45, 1.15),
        fov: 46,
        duration: 5.0,
    },
    {
        id: 'bed',
        name: 'CYBER FUTON // RECHARGE POD',
        subtitle: 'Minimalist platform mattress, designer arc floor lamp, and cozy parquet rug',
        camPos: new THREE.Vector3(-0.95, 1.62, 2.45),
        target: new THREE.Vector3(-2.65, 0.72, 1.15),
        fov: 48,
        duration: 5.0,
    },
];

interface CameraControllerProps {
    mode: CameraMode;
    onDollyComplete: () => void;
    onReturnComplete: () => void;
    onTourPoiChange?: (poiName: string, index: number, total: number) => void;
    onTourComplete?: () => void;
    onTourProgress?: (progress: number) => void;
    forcedTourIndex?: number | null;
}

export default function CameraController({
    mode,
    onDollyComplete,
    onReturnComplete,
    onTourPoiChange,
    onTourComplete,
    onTourProgress,
    forcedTourIndex,
}: CameraControllerProps) {
    const { camera, gl } = useThree();

    // Fixed 4th wall camera coordinates
    const FIXED_WALL4_POS = useMemo(() => new THREE.Vector3(-0.40, 1.82, 5.35), []);
    const ROOM_TARGET = useMemo(() => new THREE.Vector3(0.60, 1.45, -0.55), []);
    const MASTER_FOV = 58;

    // Cinematic initial load/reload slow zoom-out animation
    const INTRO_START_POS = useMemo(() => new THREE.Vector3(-0.25, 1.68, 3.75), []);
    const INTRO_START_FOV = 46;
    const introProgressRef = useRef(0);

    // Animation progress for dolly-zoom
    const transitionProgressRef = useRef(0);
    const startCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
    const startTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());

    // Tour mode state (5 seconds dwell per stop)
    const tourIndexRef = useRef(0);
    const tourTimeInStopRef = useRef(0);
    const currentTourTargetPosRef = useRef(new THREE.Vector3(0, 1.45, -0.70));

    // Spatial targets
    const MONITOR_POS = useMemo(() => new THREE.Vector3(0, 1.45, -3.15), []);
    const SCREEN_LOCK_POS = useMemo(() => new THREE.Vector3(0, 1.45, -2.45), []);

    // ============================================================
    // GTA 5 FREE-ROAM WALK MODE CONTROLS (WASD + MOUSE LOOK)
    // ============================================================
    const walkPosRef = useRef(new THREE.Vector3(0, 1.65, 1.2));
    const walkYawRef = useRef(0); // Horizontal angle in radians
    const walkPitchRef = useRef(-0.05); // Vertical pitch in radians
    const walkStepRef = useRef(0);
    const keysRef = useRef({
        forward: false,
        backward: false,
        left: false,
        right: false,
        sprint: false,
    });
    const isPointerDownRef = useRef(false);
    const lastPointerPosRef = useRef({ x: 0, y: 0 });

    const onTourPoiChangeRef = useRef(onTourPoiChange);
    useEffect(() => {
        onTourPoiChangeRef.current = onTourPoiChange;
    });

    const onTourProgressRef = useRef(onTourProgress);
    useEffect(() => {
        onTourProgressRef.current = onTourProgress;
    });

    const onTourCompleteRef = useRef(onTourComplete);
    useEffect(() => {
        onTourCompleteRef.current = onTourComplete;
    });

    const lastHandledForcedIndexRef = useRef<number | null>(null);
    const lastProgressReportRef = useRef<number>(0);

    // Handle manual tour index override (from on-screen next/prev buttons)
    useEffect(() => {
        if (mode === 'tour') {
            if (forcedTourIndex !== undefined && forcedTourIndex !== null) {
                if (lastHandledForcedIndexRef.current !== forcedTourIndex) {
                    lastHandledForcedIndexRef.current = forcedTourIndex;
                    tourIndexRef.current = forcedTourIndex % TOUR_STOPS.length;
                    tourTimeInStopRef.current = 0;
                    onTourPoiChangeRef.current?.(
                        TOUR_STOPS[tourIndexRef.current].name,
                        tourIndexRef.current + 1,
                        TOUR_STOPS.length
                    );
                }
            }
        } else {
            lastHandledForcedIndexRef.current = null;
        }
    }, [forcedTourIndex, mode]);

    // When entering tour mode, reset dwell timer and broadcast initial stop
    useEffect(() => {
        if (mode === 'tour') {
            tourTimeInStopRef.current = 0;
            onTourPoiChangeRef.current?.(
                TOUR_STOPS[tourIndexRef.current].name,
                tourIndexRef.current + 1,
                TOUR_STOPS.length
            );
        }
    }, [mode]);

    // Track mode changes & initialize camera
    useEffect(() => {
        if (mode === 'orbit') {
            if (introProgressRef.current === 0) {
                camera.position.copy(INTRO_START_POS);
                camera.lookAt(ROOM_TARGET);
                if (camera instanceof THREE.PerspectiveCamera) {
                    camera.fov = INTRO_START_FOV;
                    camera.updateProjectionMatrix();
                }
            } else {
                camera.position.copy(FIXED_WALL4_POS);
                camera.lookAt(ROOM_TARGET);
                if (camera instanceof THREE.PerspectiveCamera) {
                    camera.fov = MASTER_FOV;
                    camera.updateProjectionMatrix();
                }
            }
        } else if (mode === 'dolly_in') {
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
            startCamPosRef.current.copy(camera.position);
            startTargetRef.current.copy(ROOM_TARGET);
            if (onTourPoiChange) {
                onTourPoiChange(TOUR_STOPS[0].name, 1, TOUR_STOPS.length);
            }
        } else if (mode === 'walk') {
            walkPosRef.current.set(0, 1.65, 1.2);
            walkYawRef.current = 0;
            walkPitchRef.current = -0.05;
        }
    }, [mode, camera, onTourPoiChange, ROOM_TARGET, FIXED_WALL4_POS, INTRO_START_POS, MONITOR_POS]);

    // Keyboard listeners for GTA 5 Walk Mode (No mouse drag)
    useEffect(() => {
        if (mode !== 'walk') return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
            const k = e.key.toLowerCase();
            if (k === 'w' || e.code === 'ArrowUp') keysRef.current.forward = true;
            if (k === 's' || e.code === 'ArrowDown') keysRef.current.backward = true;
            if (k === 'a' || e.code === 'ArrowLeft') keysRef.current.left = true;
            if (k === 'd' || e.code === 'ArrowRight') keysRef.current.right = true;
            if (e.shiftKey) keysRef.current.sprint = true;
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase();
            if (k === 'w' || e.code === 'ArrowUp') keysRef.current.forward = false;
            if (k === 's' || e.code === 'ArrowDown') keysRef.current.backward = false;
            if (k === 'a' || e.code === 'ArrowLeft') keysRef.current.left = false;
            if (k === 'd' || e.code === 'ArrowRight') keysRef.current.right = false;
            if (!e.shiftKey) keysRef.current.sprint = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [mode]);

    useFrame((_, delta) => {
        const dt = Math.min(0.05, delta);

        // ============================================================
        // 1. FIXED 4TH WALL VIEW: SMOOTH SLOW ZOOM-OUT ON LOAD
        // ============================================================
        if (mode === 'orbit') {
            if (introProgressRef.current < 1) {
                introProgressRef.current = Math.min(1, introProgressRef.current + dt * 0.42);
                const p = introProgressRef.current;
                const ease = 1 - Math.pow(1 - p, 3);
                camera.position.lerpVectors(INTRO_START_POS, FIXED_WALL4_POS, ease);
                camera.lookAt(ROOM_TARGET);
                if (camera instanceof THREE.PerspectiveCamera) {
                    camera.fov = THREE.MathUtils.lerp(INTRO_START_FOV, MASTER_FOV, ease);
                    camera.updateProjectionMatrix();
                }
            } else {
                camera.position.lerp(FIXED_WALL4_POS, Math.min(1, dt * 10));
                camera.lookAt(ROOM_TARGET);
                if (camera instanceof THREE.PerspectiveCamera && camera.fov !== MASTER_FOV) {
                    camera.fov = THREE.MathUtils.lerp(camera.fov, MASTER_FOV, Math.min(1, dt * 8));
                    camera.updateProjectionMatrix();
                }
            }

        // ============================================================
        // 2. ROOM TOUR: GUIDED CINEMATIC CAMERA PATH (5 SECONDS DWELL)
        // ============================================================
        } else if (mode === 'tour') {
            const currentStop = TOUR_STOPS[tourIndexRef.current];
            tourTimeInStopRef.current += dt;

            // Report 0 to 1 progress for HUD progress bar (throttled to ~15 FPS to prevent React render thrashing)
            const progress = Math.min(1, tourTimeInStopRef.current / currentStop.duration);
            const now = performance.now();
            if (now - lastProgressReportRef.current > 65) {
                lastProgressReportRef.current = now;
                onTourProgressRef.current?.(progress);
            }

            // Subtle slow movie crane drift over the 5 seconds to keep camera dynamic
            const driftX = Math.sin(tourTimeInStopRef.current * 0.3) * 0.08;
            const driftY = Math.cos(tourTimeInStopRef.current * 0.25) * 0.03;
            const targetCamPos = currentStop.camPos.clone().add(new THREE.Vector3(driftX, driftY, 0));

            // Smoothly glide camera into the current stop position & target
            camera.position.lerp(targetCamPos, Math.min(1, dt * 2.8));
            currentTourTargetPosRef.current.lerp(currentStop.target, Math.min(1, dt * 3.2));
            camera.lookAt(currentTourTargetPosRef.current);

            if (camera instanceof THREE.PerspectiveCamera) {
                camera.fov = THREE.MathUtils.lerp(camera.fov, currentStop.fov, Math.min(1, dt * 3));
                camera.updateProjectionMatrix();
            }

            // Dwell for 5 full seconds before switching to the next angle
            if (tourTimeInStopRef.current >= currentStop.duration) {
                tourTimeInStopRef.current = 0;
                const nextIndex = (tourIndexRef.current + 1) % TOUR_STOPS.length;
                tourIndexRef.current = nextIndex;
                onTourPoiChangeRef.current?.(TOUR_STOPS[nextIndex].name, nextIndex + 1, TOUR_STOPS.length);
            }

        // ============================================================
        // 3. GTA 5 FREE ROAM WALK MODE (WASD + SPRINT + HEAD BOB)
        // ============================================================
        } else if (mode === 'walk') {
            const keys = keysRef.current;
            const speed = (keys.sprint ? 3.4 : 2.1); // m/s

            // Forward and Right vectors projected onto horizontal XZ plane
            const fwdX = Math.sin(walkYawRef.current);
            const fwdZ = -Math.cos(walkYawRef.current);
            // Steer orientation with A / D or Left / Right keys (Constrained so 4th wall is never visible)
            if (keys.left) {
                walkYawRef.current += dt * 2.2;
            }
            if (keys.right) {
                walkYawRef.current -= dt * 2.2;
            }

            // Stop the GTA walk from turning around to see the open 4th wall
            walkYawRef.current = THREE.MathUtils.clamp(
                walkYawRef.current,
                -Math.PI * 0.55,
                Math.PI * 0.55
            );

            let moveFwd = 0;
            if (keys.forward) moveFwd += 1;
            if (keys.backward) moveFwd -= 1;

            const isMoving = Math.abs(moveFwd) > 0.01;
            if (isMoving) {
                walkStepRef.current += dt * (keys.sprint ? 12 : 8);
            }

            const moveX = fwdX * moveFwd;
            const moveZ = fwdZ * moveFwd;

            // Boundaries: cannot walk beyond the bed and TV light towards the unrendered 4th wall
            const nextX = THREE.MathUtils.clamp(walkPosRef.current.x + moveX * speed * dt, -2.15, 2.15);
            const nextZ = THREE.MathUtils.clamp(walkPosRef.current.z + moveZ * speed * dt, -2.40, 1.25);
            const headBob = isMoving ? Math.sin(walkStepRef.current) * 0.022 : 0;
            const targetY = 1.65 + headBob;

            walkPosRef.current.set(nextX, targetY, nextZ);
            camera.position.lerp(walkPosRef.current, Math.min(1, dt * 14));

            // Compute look-at point based on yaw and pitch
            const lookX = camera.position.x + Math.sin(walkYawRef.current) * Math.cos(walkPitchRef.current);
            const lookY = camera.position.y + Math.sin(walkPitchRef.current);
            const lookZ = camera.position.z - Math.cos(walkYawRef.current) * Math.cos(walkPitchRef.current);

            camera.lookAt(lookX, lookY, lookZ);

            if (camera instanceof THREE.PerspectiveCamera && camera.fov !== 62) {
                camera.fov = THREE.MathUtils.lerp(camera.fov, 62, Math.min(1, dt * 6));
                camera.updateProjectionMatrix();
            }

        // ============================================================
        // 4. DOLLY IN (GLIDE INTO SCREEN)
        // ============================================================
        } else if (mode === 'dolly_in') {
            transitionProgressRef.current = Math.min(1, transitionProgressRef.current + dt * 1.6);
            const p = transitionProgressRef.current;
            const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

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
        // 5. AT SCREEN (WINDOWS OS)
        // ============================================================
        } else if (mode === 'at_screen') {
            camera.position.copy(SCREEN_LOCK_POS);
            camera.lookAt(MONITOR_POS);
            if (camera instanceof THREE.PerspectiveCamera) {
                camera.fov = 38;
                camera.updateProjectionMatrix();
            }

        // ============================================================
        // 6. DOLLY OUT (RETURN TO ORBIT)
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
