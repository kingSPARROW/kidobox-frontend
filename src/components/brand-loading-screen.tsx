'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, Heart } from 'lucide-react';

interface BrandLoadingScreenProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

const DEFAULT_MESSAGES = [
  'Curating little needs & big smiles...',
  'Gathering baby-safe essentials...',
  'Loading pure organic cotton comforts...',
  'Preparing gentle care & sweet giggles...',
  'Finding the perfect toys & treasures...',
];

export function BrandLoadingScreen({
  message,
  subMessage = 'LITTLE NEEDS. BIG SMILES.',
  fullScreen = true,
}: BrandLoadingScreenProps) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (message) return;
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % DEFAULT_MESSAGES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [message]);

  const displayMessage = message || DEFAULT_MESSAGES[msgIndex];

  return (
    <div
      className={`${
        fullScreen ? 'fixed inset-0 z-[9999]' : 'w-full min-h-[380px]'
      } bg-gradient-to-b from-[#fffbfd] via-[#fff5f8] to-[#f0f9ff] flex flex-col items-center justify-center p-6 select-none animate-in fade-in duration-300`}
      role="status"
      aria-label="Loading KIDOBOX content"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#ff268b]/15 via-[#ffbd12]/15 to-[#00b5df]/15 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-60 h-60 rounded-full bg-[#00adeb]/10 blur-2xl translate-x-20 -translate-y-16 pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-sm text-center">
        {/* Floating Sparkles & Heart Accents */}
        <div className="absolute -top-4 -left-6 text-[#ffbd12] animate-bounce duration-1000">
          <Sparkles className="w-5 h-5 fill-current opacity-80" />
        </div>
        <div className="absolute -bottom-2 -right-4 text-[#ff268b] animate-pulse">
          <Heart className="w-4 h-4 fill-current opacity-70" />
        </div>

        {/* Mascot / Brand Logo Container */}
        <div className="relative mb-5 transform transition-transform duration-500 hover:scale-105">
          <div className="w-48 h-20 sm:w-56 sm:h-24 relative flex items-center justify-center">
            {/* Logo Image */}
            <img
              src="/assets/logo.svg"
              alt="KIDOBOX Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(255,38,139,0.18)]"
              onError={(e) => {
                // Fallback to /logo.png if SVG fails
                (e.target as HTMLImageElement).src = '/logo.png';
              }}
            />
          </div>
        </div>

        {/* Tagline */}
        <p className="text-[10px] sm:text-[11px] font-black tracking-[0.25em] text-[#122e50]/70 uppercase mb-4">
          {subMessage}
        </p>

        {/* Animated Progress Bar */}
        <div className="w-48 h-1.5 bg-[#ff268b]/10 rounded-full overflow-hidden relative shadow-inner mb-4">
          <div className="h-full bg-gradient-to-r from-[#ff268b] via-[#ffbd12] to-[#00adeb] rounded-full animate-loading-bar" />
        </div>

        {/* Dynamic Rotating Message */}
        <div className="h-6 flex items-center justify-center">
          <span className="text-xs sm:text-sm font-bold text-[#122e50] tracking-tight transition-all duration-300">
            {displayMessage}
          </span>
        </div>

        {/* Bouncing Brand Dots */}
        <div className="flex items-center gap-2 mt-4">
          <span className="w-2 h-2 rounded-full bg-[#ff268b] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-[#ffbd12] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-[#00adeb] animate-bounce" />
          <span className="w-2 h-2 rounded-full bg-[#72bd45] animate-bounce [animation-delay:-0.1s]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes loadingBar {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 70%;
            margin-left: 15%;
          }
          100% {
            width: 100%;
            margin-left: 0%;
          }
        }
        .animate-loading-bar {
          animation: loadingBar 1.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default BrandLoadingScreen;
