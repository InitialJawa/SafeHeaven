import React from 'react';
import { SafeHavenLogo } from './SafeHavenLogo';

export const PageLoader: React.FC = () => {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4 select-none">
      <div className="relative w-14 h-14 flex items-center justify-center">
        {/* Glowing ring animation */}
        <div className="absolute -inset-1 rounded-full border-2 border-[#F4B847]/20 border-t-[#F4B847] animate-spin"></div>
        <SafeHavenLogo className="w-9 h-9 drop-shadow-[0_0_10px_rgba(244,184,71,0.5)]" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#F4B847]">
          SafeHaven Engine
        </p>
        <p className="text-[10px] text-[#686477] font-mono">
          Memuat modul data & analitik...
        </p>
      </div>
    </div>
  );
};
