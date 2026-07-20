import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Search, X, TrendingUp, BookOpen } from 'lucide-react';
import { useAppStore } from '../stores';

export const GlobalSearch: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useLocation();
  const { tickers, strategies } = useAppStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredTickers = tickers.filter(t => t.symbol.toLowerCase().includes(query.toLowerCase()) || t.name.toLowerCase().includes(query.toLowerCase()));
  const filteredStrategies = strategies.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));

  const handleNavigate = (path: string) => {
    setLocation(path);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#0a090f] border border-[#1b1926] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1b1926]">
          <Search className="w-5 h-5 text-[#686477]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Cari Ticker, Strategi, atau Halaman..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-[#686477]"
          />
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-full text-[#686477] hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
          {filteredTickers.length === 0 && filteredStrategies.length === 0 && query && (
            <div className="p-4 text-center text-[#686477] text-xs">Tidak ditemukan.</div>
          )}
          
          {filteredTickers.slice(0, 5).map(t => (
            <button key={t.symbol} onClick={() => handleNavigate(`/ticker/${t.symbol}`)} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#ccff00]/10 group text-xs text-left">
              <TrendingUp className="w-4 h-4 text-[#ccff00]" />
              <div>
                <div className="font-bold text-white group-hover:text-[#ccff00]">{t.symbol}</div>
                <div className="text-[#686477] text-[10px]">{t.name}</div>
              </div>
            </button>
          ))}
          
          {filteredStrategies.slice(0, 5).map(s => (
            <button key={s.id} onClick={() => handleNavigate('/strategies')} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#ccff00]/10 group text-xs text-left">
              <BookOpen className="w-4 h-4 text-[#ccff00]" />
              <div className="font-bold text-white group-hover:text-[#ccff00]">{s.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
