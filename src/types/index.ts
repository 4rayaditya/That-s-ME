export interface Project {
    id: string;
    title: string;
    description: string;
    longDescription?: string;
    techStack: string[];
    githubUrl?: string;
    liveDemoUrl?: string;
    thumbnail: string;
    featured?: boolean;
    year?: number;
}

export interface PerformanceTier {
    tier: 'high' | 'medium' | 'low';
    enableShadows: boolean;
    enablePostProcessing: boolean;
    maxLights: number;
    pixelRatio: number;
}

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
