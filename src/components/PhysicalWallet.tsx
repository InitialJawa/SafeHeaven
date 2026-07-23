import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, ArrowLeftRight, Eye, EyeOff } from 'lucide-react';
import { useAppStore } from '../stores';
import { toast } from 'sonner';

interface PhysicalWalletProps {
  capital: number;
  strategyName: string;
  onTopUp: () => void;
  onTransfer: () => void;
}

export const PhysicalWallet: React.FC<PhysicalWalletProps> = ({
  capital,
  strategyName,
  onTopUp,
  onTransfer,
}) => {
  const [hideBalance, setHideBalance] = useState(false);

  const { user } = useAppStore();

  // Helper to format currency
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="relative w-full h-[260px] flex items-end justify-center select-none group/wallet pb-2">
      {/* 1. Behind Card Stack (Peeking out of the pocket) */}
      <motion.div
        className="absolute top-2 left-6 right-6 h-36 rounded-2xl bg-gradient-to-tr from-[#c084fc] via-[#a855f7] to-[#7c3aed] border border-white/20 p-5 shadow-lg flex flex-col justify-between z-0 transition-transform duration-500 ease-out group-hover/wallet:-translate-y-8"
        initial={{ y: 0 }}
      >
        {/* Visa and card decor */}
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <p className="text-[9px] text-purple-200/90 uppercase tracking-wider font-mono font-bold max-w-[170px] truncate">{strategyName || 'SAFEHEAVEN PRIVATE'}</p>
            <h4 className="text-sm font-extrabold text-white tracking-wide truncate max-w-[180px] uppercase">{user?.name || 'IMAM NASRULLOH'}</h4>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-extrabold italic text-white tracking-wider">VISA</span>
            <p className="text-[7px] text-white/60 font-mono">INFINITE</p>
          </div>
        </div>

        {/* Card Number & Expiry */}
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <div className="w-6 h-4 bg-yellow-400/80 rounded-sm border border-yellow-500/20 relative overflow-hidden">
              <span className="absolute top-1/2 left-0 right-0 h-[1px] bg-yellow-600/30"></span>
              <span className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-yellow-600/30"></span>
            </div>
            <p className="text-xs text-white/90 font-mono tracking-widest font-semibold">•••• •••• •••• 8888</p>
          </div>
          <p className="text-[9px] text-white/80 font-mono leading-none">
            VALID: <span className="font-bold">05/29</span>
          </p>
        </div>
      </motion.div>

      {/* 2. Middle Layer Shadow/Aura */}
      <div className="absolute top-12 left-4 right-4 h-36 bg-purple-900/40 rounded-2xl blur-md -z-10 transition-transform duration-500 group-hover/wallet:scale-105"></div>

      {/* 3. Main Leather Wallet Pocket */}
      <div 
        className="relative w-full h-[180px] rounded-3xl bg-gradient-to-b from-[#3a1d5a] via-[#24113a] to-[#140822] border-2 border-[#542d80] p-5 shadow-[0_15px_30px_rgba(0,0,0,0.5),_inset_0_2px_4px_rgba(255,255,255,0.1)] flex flex-col justify-between overflow-hidden z-10"
      >
        {/* Leather Stitching Line Decoration */}
        <div className="absolute inset-2 border border-dashed border-purple-500/20 rounded-[20px] pointer-events-none"></div>

        {/* Pocket Shimmer Light Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover/wallet:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"></div>

        {/* Wallet Content */}
        <div className="space-y-1.5 z-10 mt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-purple-300 font-extrabold uppercase tracking-widest font-sans">Total Active Capital</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f5a0] animate-pulse"></span>
          </div>
          
          <AnimatePresence mode="wait">
            {hideBalance ? (
              <motion.p
                key="hidden"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-2xl font-extrabold font-mono text-white tracking-widest leading-none py-1 h-8"
              >
                •••••••••••
              </motion.p>
            ) : (
              <motion.p
                key="visible"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-2xl font-extrabold font-mono text-white tracking-tight leading-none h-8 drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]"
              >
                {formatIDR(capital)}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Monthly change percentage */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#00f5a0] font-sans font-bold bg-[#00f5a0]/10 border border-[#00f5a0]/20 px-2 py-0.5 rounded-full">
              +4.82% bulan ini
            </span>
            <span className="text-[8px] text-purple-400 font-mono">Secured</span>
          </div>
        </div>

        {/* Action Controls at Bottom */}
        <div className="flex justify-between items-center z-10">
          {/* Add Balance/Top Up Button */}
          <button
            id="wallet-add-balance"
            onClick={onTopUp}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 hover:border-white/20 text-white font-sans text-xs font-bold transition-all shadow-inner cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-purple-300" />
            <span>Top Up Saldo</span>
          </button>

          {/* Secondary Action Icons */}
          <div className="flex items-center gap-2">
            {/* Quick Rebalance Shortcut Button */}
            <button
              id="wallet-quick-transfer"
              onClick={onTransfer}
              title="Kirim Dana"
              className="w-8.5 h-8.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 active:scale-90 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4 text-purple-300" />
            </button>

            {/* Eye Hide Visibility Button */}
            <button
              id="wallet-toggle-visibility"
              onClick={() => {
                setHideBalance(!hideBalance);
                toast.success(hideBalance ? 'Saldo ditampilkan' : 'Saldo disembunyikan');
              }}
              title={hideBalance ? 'Tampilkan Saldo' : 'Sembunyikan Saldo'}
              className="w-8.5 h-8.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 active:scale-90 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
            >
              {hideBalance ? <Eye className="w-4 h-4 text-[#00f0ff]" /> : <EyeOff className="w-4 h-4 text-purple-300" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
