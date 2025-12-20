'use client';

import { useState, useEffect } from 'react';

interface IntroSequenceProps {
  onComplete: () => void;
}

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [stage, setStage] = useState<'static' | 'mission' | 'accept' | 'display' | 'complete'>('static');
  const [showAcceptButton, setShowAcceptButton] = useState(false);

  useEffect(() => {
    // TV static for 3 seconds
    if (stage === 'static') {
      const timer = setTimeout(() => {
        setStage('mission');
        setTimeout(() => setShowAcceptButton(true), 2000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleAcceptMission = () => {
    setStage('accept');
    setTimeout(() => {
      setStage('display');
      setTimeout(() => {
        setStage('complete');
        onComplete();
      }, 3000);
    }, 2000);
  };

  if (stage === 'complete') return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {/* TV Static Effect */}
      {stage === 'static' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[80%] max-w-4xl aspect-video bg-gray-900 rounded-lg border-8 border-gray-800 shadow-2xl overflow-hidden">
            {/* Old TV Frame */}
            <div className="absolute inset-0 bg-gradient-radial from-gray-700 via-gray-800 to-black opacity-30" />
            
            {/* Static Animation */}
            <div className="absolute inset-0 opacity-80">
              <div className="absolute inset-0 animate-tv-static bg-noise" 
                   style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                     backgroundSize: '200px 200px',
                     animation: 'tv-noise 0.2s steps(10) infinite'
                   }}
              />
            </div>

            {/* Scan Lines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full bg-gradient-to-b from-transparent via-black/10 to-transparent animate-scan-line" 
                   style={{ backgroundSize: '100% 4px' }}
              />
            </div>

            {/* TV Screen Glow */}
            <div className="absolute inset-0 bg-gradient-radial from-cyan-500/20 via-transparent to-transparent animate-pulse" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-mono text-white/80 animate-pulse tracking-wider">
                NO SIGNAL
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mission Briefing */}
      {stage === 'mission' && (
        <div className="absolute inset-0 flex items-center justify-center p-8 animate-fade-in">
          <div className="max-w-3xl w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-cyan-500/50 rounded-lg p-12 shadow-2xl shadow-cyan-500/20">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block px-6 py-2 bg-red-600 text-white font-bold text-sm rounded-full mb-4 animate-pulse">
                CLASSIFIED - TOP SECRET
              </div>
              <h1 className="text-5xl font-bold text-cyan-400 mb-2 tracking-wider">
                MISSION BRIEFING
              </h1>
              <div className="h-1 w-32 bg-cyan-500 mx-auto"></div>
            </div>

            {/* Mission Details */}
            <div className="space-y-6 text-gray-300 font-mono text-lg">
              <div className="border-l-4 border-cyan-500 pl-4">
                <p className="text-cyan-400 font-bold mb-2">OBJECTIVE:</p>
                <p>Locate and explore the legendary Galaxy "RAY"</p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <p className="text-yellow-400 font-bold mb-2">STATUS:</p>
                <p>Galaxy RAY coordinates detected in Sector 7-G</p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-green-400 font-bold mb-2">MISSION:</p>
                <p>Navigate through multiple galaxies, discover new worlds, and uncover the mysteries of the universe.</p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <p className="text-purple-400 font-bold mb-2">EQUIPMENT:</p>
                <p>Experimental FPV Spacecraft • Advanced Navigation System • Deep Space Scanner</p>
              </div>
            </div>

            {/* Accept Button */}
            {showAcceptButton && (
              <div className="mt-10 text-center animate-fade-in">
                <button
                  onClick={handleAcceptMission}
                  className="group relative px-12 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-2xl rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="relative flex items-center gap-3">
                    <span>ACCEPT MISSION</span>
                    <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
                <p className="mt-4 text-gray-500 text-sm animate-pulse">
                  Press to begin your journey, Commander
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mission Accepted */}
      {stage === 'accept' && (
        <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
          <div className="text-center">
            <div className="text-8xl font-bold text-green-400 mb-6 animate-pulse">
              MISSION ACCEPTED
            </div>
            <div className="text-3xl text-cyan-400 font-mono">
              Initializing Systems...
            </div>
          </div>
        </div>
      )}

      {/* Display Initialization */}
      {stage === 'display' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black animate-fade-in">
          <div className="w-full max-w-4xl space-y-6 px-8">
            {/* System Boot */}
            <div className="font-mono text-green-400 space-y-2">
              <p className="animate-typing">{'>'} BOOTING SHIP SYSTEMS...</p>
              <p className="animate-typing animation-delay-200">{'>'} NAVIGATION: ONLINE ✓</p>
              <p className="animate-typing animation-delay-400">{'>'} WEAPONS: DISABLED</p>
              <p className="animate-typing animation-delay-600">{'>'} LIFE SUPPORT: ACTIVE ✓</p>
              <p className="animate-typing animation-delay-800">{'>'} FPV CONTROLS: CALIBRATED ✓</p>
              <p className="animate-typing animation-delay-1000">{'>'} DEEP SPACE SCANNER: READY ✓</p>
              <p className="animate-typing animation-delay-1200 text-cyan-400">{'>'} DESTINATION: GALAXY RAY</p>
              <p className="animate-typing animation-delay-1400 text-yellow-400 text-xl mt-4">{'>'} LAUNCHING IN 3...</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-6 overflow-hidden border-2 border-cyan-500">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-progress"></div>
            </div>

            <p className="text-center text-gray-400 font-mono animate-pulse">
              Prepare for hyperspace jump...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
