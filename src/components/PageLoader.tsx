import React from 'react';

export const PageLoader: React.FC = () => {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4 select-none">
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Glowing ring animation */}
        <div className="absolute inset-0 rounded-full border-2 border-[#ccff00]/20 border-t-[#ccff00] animate-spin"></div>
        <div className="w-6 h-6 rounded-full bg-[#ccff00]/10 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-ping"></div>
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#ccff00]">
          SafeHaven Engine
        </p>
        <p className="text-[10px] text-[#686477] font-mono">
          Memuat modul data & analitik...
        </p>
      </div>
    </div>
  );
};
