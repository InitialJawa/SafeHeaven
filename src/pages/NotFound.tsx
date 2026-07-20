/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLocation } from 'wouter';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const NotFound: React.FC = () => {
  const [, setLocation] = useLocation();

  return (
    <div id="not-found-view" className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-red-950/20 border border-red-500/25 text-[#ff3366] rounded-2xl mb-5 animate-pulse shadow-lg shadow-red-500/5">
        <ShieldCheck className="w-6 h-6 rotate-180" />
      </div>
      <h1 className="text-xl font-extrabold tracking-tight text-white font-sans">Halaman Tidak Ditemukan</h1>
      <p className="text-xs text-[#9f9bac] max-w-sm mt-2 leading-relaxed font-sans font-medium">
        Sistem mendeteksi bahwa alamat url yang Anda tuju berada di luar cakupan terminal kuantitatif SafeHeaven.
      </p>
      <button
        id="not-found-back-home"
        onClick={() => setLocation('/')}
        className="mt-6 px-4.5 py-3 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/20 active:scale-95"
      >
        Kembali ke Cockpit <ArrowRight className="w-4 h-4 stroke-[2.5px]" />
      </button>
    </div>
  );
};
