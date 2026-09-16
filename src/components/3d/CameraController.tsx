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

    // Fixed 4th wall camera coordinates (desktop)
    const FIXED_WALL4_POS = useMemo(() => new THREE.Vector3(-0.40, 1.82, 5.35), []);
    // Mobile portrait pull-back: higher + further back so full room width fits vertically
    const FIXED_WALL4_POS_MOBILE = useMemo(() => new THREE.Vector3(0.10, 3.20, 9.50), []);
    // Mobile room target is more centered (Y a bit lower to show floor/furniture)
    const ROOM_TARGET_MOBILE = useMemo(() => new THREE.Vector3(0.20, 1.10, -0.20), []);
    const ROOM_TARGET = useMemo(() => new THREE.Vector3(0.60, 1.45, -0.55), []);
    const MASTER_FOV = 58;

    const getResponsiveMasterFov = (aspect: number) => {
        if (aspect < 1) {
            // Portrait phone: significantly widen FOV so full room width fits
            // At aspect 0.46 (typical phone): 58 + 0.54 * 52 = ~86°
            return Math.min(95, Math.round(58 + (1 - aspect) * 52));
        }
        return 58;
    };

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
    // FIRST-PERSON FREE ROAM EXPLORER CONTROLS
    // (WASD Strafe + 360° Mouse Look + Jump + Sprint + Inertia)
    // ============================================================
    const walkPosRef = useRef(new THREE.Vector3(0, 1.65, 1.2));
    const walkYawRef = useRef(0); // Horizontal angle in radians
    const targetYawRef = useRef(0);
    const walkPitchRef = useRef(-0.05); // Vertical pitch in radians
    const targetPitchRef = useRef(-0.05);
    const walkStepRef = useRef(0);
    const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
    const jumpVelRef = useRef(0);
    const jumpYRef = useRef(0);
    const isGroundedRef = useRef(true);

    const keysRef = useRef({
        forward: false,
        backward: false,
        left: false,
        right: false,
        turnLeft: false,
        turnRight: false,
        sprint: false,
    });
    const isPointerDownRef = useRef(false);
    const lastPointerPosRef = useRef({ x: 0, y: 0 });
    // Mobile virtual joystick analog input (-1..1)
    const mobileWalkRef = useRef({ fwd: 0, right: 0 });
    const isJoystickTogglingRef = useRef(false);

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
            startTargetRef.current.copy(ROOM_TARGET);
            currentTourTargetPosRef.current.copy(ROOM_TARGET);
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
            targetYawRef.current = 0;
            walkPitchRef.current = -0.05;
            targetPitchRef.current = -0.05;
            velocityRef.current.set(0, 0, 0);
            jumpVelRef.current = 0;
            jumpYRef.current = 0;
            isGroundedRef.current = true;
            mobileWalkRef.current = { fwd: 0, right: 0 };
            isJoystickTogglingRef.current = false;
            keysRef.current = {
                forward: false,
                backward: false,
                left: false,
                right: false,
                turnLeft: false,
                turnRight: false,
                sprint: false,
            };
        }
    }, [mode, camera, onTourPoiChange, ROOM_TARGET, ROOM_TARGET_MOBILE, FIXED_WALL4_POS, FIXED_WALL4_POS_MOBILE, INTRO_START_POS, MONITOR_POS]);

    // Pointer drag / 360-degree mouse look listeners for Free Roam Mode
    useEffect(() => {
        if (mode !== 'walk') return;

        const dom = gl.domElement;
        dom.style.cursor = 'grab';

        const handlePointerDown = (e: PointerEvent) => {
            // Do not capture if clicking on UI buttons or dialogs
            if ((e.target as HTMLElement)?.closest('button, a, input, textarea')) return;
            isPointerDownRef.current = true;
            lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
            dom.style.cursor = 'grabbing';
            try {
                dom.setPointerCapture(e.pointerId);
            } catch {}
        };

        const handlePointerMove = (e: PointerEvent) => {
            if (!isPointerDownRef.current) return;
            const dx = e.clientX - lastPointerPosRef.current.x;
            const dy = e.clientY - lastPointerPosRef.current.y;
            lastPointerPosRef.current = { x: e.clientX, y: e.clientY };

            const isTouchInput = e.pointerType === 'touch';
            const isJoystickToggling =
                isJoystickTogglingRef.current ||
                Math.abs(mobileWalkRef.current.fwd) > 0.05 ||
                Math.abs(mobileWalkRef.current.right) > 0.05;

            // When joystick is not toggling, significantly boost drag speed for effortless 360° looking.
            // When joystick is actively toggled, provide smoother, controlled rotation for fine steering.
            const yawSensitivity = isJoystickToggling
                ? (isTouchInput ? 0.005 : 0.0036)
                : (isTouchInput ? 0.0135 : 0.0072);

            const pitchSensitivity = yawSensitivity * 0.82;

            targetYawRef.current -= dx * yawSensitivity;
            targetPitchRef.current -= dy * pitchSensitivity;
            // Vertical pitch clamp: -75° to +75°
            targetPitchRef.current = THREE.MathUtils.clamp(targetPitchRef.current, -1.3, 1.3);
        };

        const handlePointerUp = (e: PointerEvent) => {
            isPointerDownRef.current = false;
            dom.style.cursor = 'grab';
            try {
                if (dom.hasPointerCapture(e.pointerId)) {
                    dom.releasePointerCapture(e.pointerId);
                }
            } catch {}
        };

        dom.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);

        // Listen for mobile joystick input from MobileWalkControls
        const handleMobileWalk = (e: Event) => {
            const { fwd, right, isToggling } = (
                e as CustomEvent<{ fwd: number; right: number; isToggling?: boolean }>
            ).detail;
            mobileWalkRef.current = { fwd, right };
            if (typeof isToggling === 'boolean') {
                isJoystickTogglingRef.current = isToggling;
            } else {
                isJoystickTogglingRef.current = Math.abs(fwd) > 0.05 || Math.abs(right) > 0.05;
            }
        };
        window.addEventListener('mobilewalk', handleMobileWalk);

        return () => {
            dom.style.cursor = 'auto';
            dom.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerUp);
            window.removeEventListener('mobilewalk', handleMobileWalk);
        };
    }, [mode, gl]);

    // Keyboard listeners for Free Roam Mode (WASD strafe, Arrow keys, Shift sprint, Space jump)
    useEffect(() => {
        if (mode !== 'walk') return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
            const k = e.key.toLowerCase();
            if (k === 'w') keysRef.current.forward = true;
            if (k === 's') keysRef.current.backward = true;
            if (k === 'a') keysRef.current.left = true;
            if (k === 'd') keysRef.current.right = true;
            if (e.code === 'ArrowUp') keysRef.current.forward = true;
            if (e.code === 'ArrowDown') keysRef.current.backward = true;
            if (e.code === 'ArrowLeft') keysRef.current.turnLeft = true;
            if (e.code === 'ArrowRight') keysRef.current.turnRight = true;
            if (e.shiftKey || k === 'shift') keysRef.current.sprint = true;
            if (e.code === 'KeyJ') {
                if (isGroundedRef.current) {
                    jumpVelRef.current = 3.2;
                    isGroundedRef.current = false;
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase();
            if (k === 'w') keysRef.current.forward = false;
            if (k === 's') keysRef.current.backward = false;
            if (k === 'a') keysRef.current.left = false;
            if (k === 'd') keysRef.current.right = false;
            if (e.code === 'ArrowUp') keysRef.current.forward = false;
            if (e.code === 'ArrowDown') keysRef.current.backward = false;
            if (e.code === 'ArrowLeft') keysRef.current.turnLeft = false;
            if (e.code === 'ArrowRight') keysRef.current.turnRight = false;
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
            const aspect = camera instanceof THREE.PerspectiveCamera ? camera.aspect : 1;
            const isMobilePortrait = aspect < 1;
            // Choose camera target position based on orientation
            const activeCamPos = isMobilePortrait ? FIXED_WALL4_POS_MOBILE : FIXED_WALL4_POS;
            const activeTarget = isMobilePortrait ? ROOM_TARGET_MOBILE : ROOM_TARGET;
            const targetMasterFov = getResponsiveMasterFov(aspect);
            const targetIntroFov = aspect < 1 ? Math.min(85, Math.round(46 + (1 - aspect) * 48)) : 46;

            if (introProgressRef.current < 1) {
                introProgressRef.current = Math.min(1, introProgressRef.current + dt * 0.42);
                const p = introProgressRef.current;
                const ease = 1 - Math.pow(1 - p, 3);
                camera.position.lerpVectors(INTRO_START_POS, activeCamPos, ease);
                camera.lookAt(activeTarget);
                if (camera instanceof THREE.PerspectiveCamera) {
                    camera.fov = THREE.MathUtils.lerp(targetIntroFov, targetMasterFov, ease);
                    camera.updateProjectionMatrix();
                }
            } else {
                camera.position.lerp(activeCamPos, Math.min(1, dt * 10));
                camera.lookAt(activeTarget);
                if (camera instanceof THREE.PerspectiveCamera && Math.abs(camera.fov - targetMasterFov) > 0.2) {
                    camera.fov = THREE.MathUtils.lerp(camera.fov, targetMasterFov, Math.min(1, dt * 8));
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
                const aspect = camera.aspect;
                const targetFov = aspect < 1 ? Math.min(90, currentStop.fov + 28) : currentStop.fov;
                camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, Math.min(1, dt * 3));
                camera.updateProjectionMatrix();
            }

            // Dwell for 5 full seconds before switching to the next angle
            if (tourTimeInStopRef.current >= currentStop.duration) {
                tourTimeInStopRef.current = 0;
                const nextIndex = tourIndexRef.current + 1;
                if (nextIndex >= TOUR_STOPS.length) {
                    // Guided tour finished all showcase stops!
                    onTourCompleteRef.current?.();
                } else {
                    tourIndexRef.current = nextIndex;
                    onTourPoiChangeRef.current?.(TOUR_STOPS[nextIndex].name, nextIndex + 1, TOUR_STOPS.length);
                }
            }

        // ============================================================
        // 3. FIRST-PERSON FREE ROAM EXPLORER (WASD STRAFE + 360 MOUSE LOOK)
        // ============================================================
        } else if (mode === 'walk') {
            const keys = keysRef.current;

            // Keyboard camera rotation using arrow keys if user prefers keyboard-only look
            if (keys.turnLeft) {
                targetYawRef.current += dt * 2.4;
            }
            if (keys.turnRight) {
                targetYawRef.current -= dt * 2.4;
            }

            // Silky smooth interpolation of look angles towards target
            walkYawRef.current = THREE.MathUtils.lerp(walkYawRef.current, targetYawRef.current, Math.min(1, dt * 22));
            walkPitchRef.current = THREE.MathUtils.lerp(walkPitchRef.current, targetPitchRef.current, Math.min(1, dt * 22));

            // Camera forward and right vectors projected onto horizontal XZ plane
            const fwdX = Math.sin(walkYawRef.current);
            const fwdZ = -Math.cos(walkYawRef.current);
            const rightX = Math.cos(walkYawRef.current);
            const rightZ = Math.sin(walkYawRef.current);

            // Compute input direction with true FPS strafing (W/S fwd/back, A/D left/right)
            let dirX = 0;
            let dirZ = 0;
            if (keys.forward) { dirX += fwdX; dirZ += fwdZ; }
            if (keys.backward) { dirX -= fwdX; dirZ -= fwdZ; }
            if (keys.left) { dirX -= rightX; dirZ -= rightZ; }
            if (keys.right) { dirX += rightX; dirZ += rightZ; }

            // Apply mobile joystick analog input (scaled to 60% of max speed for control)
            const mw = mobileWalkRef.current;
            if (Math.abs(mw.fwd) > 0.05 || Math.abs(mw.right) > 0.05) {
                const mobileScale = 0.6;
                dirX += (fwdX * mw.fwd + rightX * mw.right) * mobileScale;
                dirZ += (fwdZ * mw.fwd + rightZ * mw.right) * mobileScale;
            }

            const inputMagnitude = Math.hypot(dirX, dirZ);
            if (inputMagnitude > 0.001) {
                dirX /= inputMagnitude;
                dirZ /= inputMagnitude;
            }

            const speed = (keys.sprint ? 3.6 : 2.1); // m/s
            const targetVelX = dirX * speed;
            const targetVelZ = dirZ * speed;
            const accelRate = inputMagnitude > 0.001 ? 14 : 9; // Snappy acceleration, smooth glide damping

            velocityRef.current.x = THREE.MathUtils.lerp(velocityRef.current.x, targetVelX, Math.min(1, dt * accelRate));
            velocityRef.current.z = THREE.MathUtils.lerp(velocityRef.current.z, targetVelZ, Math.min(1, dt * accelRate));

            const curHorizontalSpeed = Math.hypot(velocityRef.current.x, velocityRef.current.z);

            // Jump Physics & Gravity
            if (!isGroundedRef.current) {
                jumpVelRef.current -= 11.5 * dt;
                jumpYRef.current += jumpVelRef.current * dt;
                if (jumpYRef.current <= 0) {
                    jumpYRef.current = 0;
                    jumpVelRef.current = 0;
                    isGroundedRef.current = true;
                }
            }

            // Head Bob & Footstep cadence
            const isMovingOnFloor = curHorizontalSpeed > 0.12 && isGroundedRef.current;
            if (isMovingOnFloor) {
                const stepCadence = keys.sprint ? 14 : 9.5;
                walkStepRef.current += dt * stepCadence;
            }
            const bobScale = keys.sprint ? 0.030 : 0.016;
            const headBobY = isMovingOnFloor
                ? Math.sin(walkStepRef.current * 2) * bobScale
                : Math.sin(performance.now() * 0.0018) * 0.003; // Gentle breathing idle motion
            const headBobX = isMovingOnFloor
                ? Math.cos(walkStepRef.current) * (bobScale * 0.45)
                : 0;

            // Room collision and position update
            let nextX = walkPosRef.current.x + velocityRef.current.x * dt;
            let nextZ = walkPosRef.current.z + velocityRef.current.z * dt;

            // Outer room walls boundary:
            // Desk wall (z = -3.5), Wardrobe right (x = 3.5), Window left (x = -3.5), Entry front wall (z = 2.85)
            nextX = THREE.MathUtils.clamp(nextX, -2.60, 2.50);
            nextZ = THREE.MathUtils.clamp(nextZ, -2.30, 2.10);

            // Furniture collision buffer around bed (x: [-1.55, 0.40], z: [0.70, 2.35])
            if (nextX > -1.55 && nextX < 0.40 && nextZ > 0.70 && nextZ < 2.35) {
                const distLeft = Math.abs(nextX - (-1.55));
                const distRight = Math.abs(nextX - 0.40);
                const distFront = Math.abs(nextZ - 0.70);
                const minPush = Math.min(distLeft, distRight, distFront);
                if (minPush === distFront) nextZ = 0.70;
                else if (minPush === distLeft) nextX = -1.55;
                else nextX = 0.40;
            }

            walkPosRef.current.x = nextX;
            walkPosRef.current.z = nextZ;
            walkPosRef.current.y = 1.65 + jumpYRef.current + headBobY;

            // Update camera position with lateral head sway
            camera.position.set(
                walkPosRef.current.x + headBobX,
                walkPosRef.current.y,
                walkPosRef.current.z
            );

            // Look-at direction computed from yaw and pitch
            const lookDirX = Math.sin(walkYawRef.current) * Math.cos(walkPitchRef.current);
            const lookDirY = Math.sin(walkPitchRef.current);
            const lookDirZ = -Math.cos(walkYawRef.current) * Math.cos(walkPitchRef.current);

            camera.lookAt(
                camera.position.x + lookDirX,
                camera.position.y + lookDirY,
                camera.position.z + lookDirZ
            );

            // Dynamic FOV sensation (boosts field of view when sprinting)
            const targetFov = (keys.sprint && isMovingOnFloor) ? 70 : 62;
            if (camera instanceof THREE.PerspectiveCamera) {
                camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, Math.min(1, dt * 7));
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

            const aspect = camera instanceof THREE.PerspectiveCamera ? camera.aspect : 1;
            const returnCamPos = aspect < 1 ? FIXED_WALL4_POS_MOBILE : FIXED_WALL4_POS;
            const returnTarget = aspect < 1 ? ROOM_TARGET_MOBILE : ROOM_TARGET;
            const returnFov = getResponsiveMasterFov(aspect);

            camera.position.lerpVectors(startCamPosRef.current, returnCamPos, ease);
            camera.lookAt(returnTarget);

            if (camera instanceof THREE.PerspectiveCamera) {
                camera.fov = THREE.MathUtils.lerp(camera.fov, returnFov, Math.min(1, dt * 6));
                camera.updateProjectionMatrix();
            }

            if (p >= 1) {
                onReturnComplete();
            }
        }
    });

    return null;
}
