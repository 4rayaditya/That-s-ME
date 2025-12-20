import type { PerformanceTier, DeviceType } from '@/types';

/**
 * Detects device type based on screen width
 */
export function detectDeviceType(): DeviceType {
    if (typeof window === 'undefined') return 'desktop';

    const width = window.innerWidth;

    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
}

/**
 * Detects performance tier based on:
 * - Hardware concurrency (CPU cores)
 * - Device memory
 * - Device type
 * - Connection speed (optional)
 */
export function detectPerformanceTier(deviceType: DeviceType): PerformanceTier {
    if (typeof window === 'undefined') {
        return getDefaultTier('high');
    }

    const nav = navigator as Navigator & {
        deviceMemory?: number;
        connection?: {
            effectiveType?: string;
        };
    };

    // Mobile devices default to lower tier
    if (deviceType === 'mobile') {
        return getDefaultTier('medium');
    }

    // Check hardware capabilities
    const cores = navigator.hardwareConcurrency || 4;
    const memory = nav.deviceMemory || 4;
    const connection = nav.connection?.effectiveType;

    // Low-end device detection
    if (cores <= 2 || memory <= 2 || connection === '2g' || connection === 'slow-2g') {
        return getDefaultTier('low');
    }

    // Medium-tier device detection
    if (cores <= 4 || memory <= 4 || connection === '3g') {
        return getDefaultTier('medium');
    }

    // High-end device
    return getDefaultTier('high');
}

function getDefaultTier(tier: 'high' | 'medium' | 'low'): PerformanceTier {
    const tiers: Record<string, PerformanceTier> = {
        high: {
            tier: 'high',
            enableShadows: true,
            enablePostProcessing: true,
            maxLights: 3,
            pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        },
        medium: {
            tier: 'medium',
            enableShadows: false,
            enablePostProcessing: false,
            maxLights: 2,
            pixelRatio: 1,
        },
        low: {
            tier: 'low',
            enableShadows: false,
            enablePostProcessing: false,
            maxLights: 1,
            pixelRatio: 1,
        },
    };

    return tiers[tier];
}

/**
 * Throttle function to limit execution rate
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function (this: any, ...args: Parameters<T>) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Debounce function to delay execution
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function (this: any, ...args: Parameters<T>) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, alpha: number): number {
    return start + (end - start) * alpha;
}
