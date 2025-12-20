import { create } from 'zustand';

interface JourneyState {
    currentSection: number;
    visitedSections: Set<number>;
    collectibles: number;
    interactiveMode: boolean;

    setCurrentSection: (section: number) => void;
    markSectionVisited: (section: number) => void;
    collectItem: () => void;
    toggleInteractiveMode: () => void;
    resetJourney: () => void;
}

export const useJourneyStore = create<JourneyState>((set) => ({
    currentSection: 0,
    visitedSections: new Set([0]),
    collectibles: 0,
    interactiveMode: true,

    setCurrentSection: (section) =>
        set((state) => ({
            currentSection: section,
            visitedSections: new Set([...state.visitedSections, section]),
        })),

    markSectionVisited: (section) =>
        set((state) => ({
            visitedSections: new Set([...state.visitedSections, section]),
        })),

    collectItem: () =>
        set((state) => ({ collectibles: state.collectibles + 1 })),

    toggleInteractiveMode: () =>
        set((state) => ({ interactiveMode: !state.interactiveMode })),

    resetJourney: () =>
        set({
            currentSection: 0,
            visitedSections: new Set([0]),
            collectibles: 0,
        }),
}));
