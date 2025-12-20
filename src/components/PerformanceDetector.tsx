'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { detectDeviceType, detectPerformanceTier } from '@/lib/utils';

export function PerformanceDetector() {
  const setDeviceType = useAppStore((state) => state.setDeviceType);
  const setPerformanceTier = useAppStore((state) => state.setPerformanceTier);

  useEffect(() => {
    // Detect device type
    const deviceType = detectDeviceType();
    setDeviceType(deviceType);

    // Detect performance tier
    const performanceTier = detectPerformanceTier(deviceType);
    setPerformanceTier(performanceTier);

    // Update on resize
    const handleResize = () => {
      const newDeviceType = detectDeviceType();
      setDeviceType(newDeviceType);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setDeviceType, setPerformanceTier]);

  return null;
}
