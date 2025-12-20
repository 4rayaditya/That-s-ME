import { create } from 'zustand';
import type { PerformanceTier, DeviceType } from '@/types';

interface AppState {
    performanceTier: PerformanceTier;
    deviceType: DeviceType;
    selectedProjectId: string | null;
    isProjectDetailOpen: boolean;

    setPerformanceTier: (tier: PerformanceTier) => void;
    setDeviceType: (type: DeviceType) => void;
    setSelectedProject: (id: string | null) => void;
    setProjectDetailOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    performanceTier: {
        tier: 'high',
        enableShadows: true,
        enablePostProcessing: true,
        maxLights: 3,
        pixelRatio: 1.5,
    },
    deviceType: 'desktop',
    selectedProjectId: null,
    isProjectDetailOpen: false,

    setPerformanceTier: (tier) => set({ performanceTier: tier }),
    setDeviceType: (type) => set({ deviceType: type }),
    setSelectedProject: (id) => set({ selectedProjectId: id }),
    setProjectDetailOpen: (open) => set({ isProjectDetailOpen: open }),
}));
