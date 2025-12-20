'use client';

import { create } from 'zustand';
import * as THREE from 'three';

export type GalaxySection = 'universe' | 'home' | 'projects' | 'about' | 'contact' | 'skills';

interface CameraTransition {
  from: THREE.Vector3;
  to: THREE.Vector3;
  lookAt: THREE.Vector3;
  duration: number;
  progress: number;
}

interface UniverseStore {
  currentSection: GalaxySection;
  isTransitioning: boolean;
  cameraTransition: CameraTransition | null;
  fppEnabled: boolean;
  showCockpit: boolean;
  galaxiesDiscovered: Set<GalaxySection>;
  
  // Actions
  navigateToGalaxy: (section: GalaxySection, cameraPosition: THREE.Vector3, lookAt: THREE.Vector3) => void;
  exitGalaxy: () => void;
  setTransitioning: (transitioning: boolean) => void;
  updateTransitionProgress: (progress: number) => void;
  setFPPEnabled: (enabled: boolean) => void;
  toggleCockpit: () => void;
  discoverGalaxy: (section: GalaxySection) => void;
  resetUniverse: () => void;
}

export const useUniverseStore = create<UniverseStore>((set, get) => ({
  currentSection: 'universe',
  isTransitioning: false,
  cameraTransition: null,
  fppEnabled: true,
  showCockpit: true,
  galaxiesDiscovered: new Set(['universe']),

  navigateToGalaxy: (section, cameraPosition, lookAt) => {
    const currentCamera = new THREE.Vector3(0, 5, 20); // Default universe position
    
    set({
      isTransitioning: true,
      cameraTransition: {
        from: currentCamera.clone(),
        to: cameraPosition.clone(),
        lookAt: lookAt.clone(),
        duration: 2000, // 2 seconds
        progress: 0,
      },
    });

    // After transition, update current section
    setTimeout(() => {
      set({
        currentSection: section,
        isTransitioning: false,
        cameraTransition: null,
      });
      get().discoverGalaxy(section);
    }, 2000);
  },

  exitGalaxy: () => {
    const universePosition = new THREE.Vector3(0, 5, 20);
    const lookAt = new THREE.Vector3(0, 0, 0);

    set({
      isTransitioning: true,
      cameraTransition: {
        from: new THREE.Vector3(0, 0, 0), // Will be set from current camera
        to: universePosition,
        lookAt: lookAt,
        duration: 2000,
        progress: 0,
      },
    });

    setTimeout(() => {
      set({
        currentSection: 'universe',
        isTransitioning: false,
        cameraTransition: null,
      });
    }, 2000);
  },

  setTransitioning: (transitioning) => set({ isTransitioning: transitioning }),

  updateTransitionProgress: (progress) => {
    const transition = get().cameraTransition;
    if (transition) {
      set({
        cameraTransition: {
          ...transition,
          progress,
        },
      });
    }
  },

  setFPPEnabled: (enabled) => set({ fppEnabled: enabled }),

  toggleCockpit: () => set((state) => ({ showCockpit: !state.showCockpit })),

  discoverGalaxy: (section) => {
    const discovered = new Set(get().galaxiesDiscovered);
    discovered.add(section);
    set({ galaxiesDiscovered: discovered });
  },

  resetUniverse: () => {
    set({
      currentSection: 'universe',
      isTransitioning: false,
      cameraTransition: null,
      fppEnabled: true,
      showCockpit: true,
      galaxiesDiscovered: new Set(['universe']),
    });
  },
}));
