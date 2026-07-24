import React, { useState, useEffect } from 'react';
import { Settings2, ArrowUp, ArrowDown, X, Save, Plus, Activity, PieChart, TrendingUp, ShieldAlert, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

export type WidgetId = 'summary' | 'wallet' | 'rotation' | 'performance' | 'treemap' | 'picks' | 'alerts' | 'rsi' | 'sector' | 'macd' | 'volatility' | 'ihsg_analysis' | 'watchlist_detail' | 'regime' | 'gauges' | 'kinerja' | 'musiman';

export const WIDGET_NAMES: Record<WidgetId, string> = {
  summary: 'Ringkasan Portfolio (Summary)',
  wallet: 'Kartu Manajemen Dana',
  rotation: 'Multi-Tier Rotation',
  performance: 'Grafik Performa Portfolio',
  treemap: 'Alokasi Treemap',
  picks: 'Sinyal Pilihan Teratas',
  alerts: 'Riwayat Rotasi & Sinyal',
  rsi: 'RSI Indicator',
  sector: 'Sector Weighting',
  macd: 'MACD Momentum Tracker',
  volatility: 'Indikator Volatilitas Market',
  ihsg_analysis: 'Analisis IHSG Terpadu (Yahoo Finance)',
  watchlist_detail: 'Daftar Pantau & Statistik Kunci (Yahoo Finance Live)',
  regime: 'Sebaran Durasi Regime Pasar',
  gauges: 'Analisa Gauges (Teknikal & Analis)',
  kinerja: 'Kinerja Return Historis',
  musiman: 'Analisis Musiman Bulanan',
};

export const WIDGET_DESCRIPTIONS: Record<WidgetId, string> = {
  summary: 'Total nilai akun, profit/loss harian, dan grafik tren kilat (sparkline)',
  wallet: 'Saldo aktif, transfer cepat, dan kontrol kokpit portofolio utama',
  rotation: 'Sistem rotasi aset otomatis untuk jaring pengaman risiko',
  performance: 'Visualisasi pertumbuhan modal historis dan ekuitas portofolio',
  treemap: 'Peta hierarki alokasi modal berbasis sektor & kelas aset',
  picks: 'Daftar rekomendasi sinyal kuantitatif berbasis algoritma AI',
  alerts: 'Audit log riwayat transaksi, rotasi otomatis, dan notifikasi',
  rsi: 'Relative Strength Index (14D) untuk deteksi overbought / oversold',
  sector: 'Bobot distribusi investasi berdasarkan sektor industri',
  macd: 'Konvergensi & divergensi rata-rata bergerak (12, 26, 9)',
  volatility: 'Skor volatilitas pasar terbobot dan deteksi lonjakan risiko',
  ihsg_analysis: 'Gauges penilaian teknikal & analis, analisis musiman bulanan, dan kinerja historis indeks IHSG',
  watchlist_detail: 'Informasi harga real-time, rentang hari & 52-minggu, berita terkini, dan statistik kunci bursa atau saham.',
  regime: 'Peta distribusi durasi regime pasar (Normal, Bull, Bear, Volatile).',
  gauges: 'Indikator konsensus osilator & MA dengan jarum dinamis (TradingView Style).',
  kinerja: 'Tabel ringkasan performa kenaikan/penurunan harga (1Mgg s/d 1Thn).',
  musiman: 'Grafik garis performa return bulanan historis per tahun (2024 - 2026).',
};

export const DEFAULT_ORDER: WidgetId[] = [
  'summary',
  'wallet',
  'rotation',
  'performance',
  'treemap',
  'picks',
  'alerts',
  'ihsg_analysis',
];

interface WidgetConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOrder: WidgetId[];
  onSave: (newOrder: WidgetId[]) => void;
  title?: string;
  scopeName?: string;
  availableWidgetList?: WidgetId[];
  defaultOrderList?: WidgetId[];
}

export const WidgetConfigModal: React.FC<WidgetConfigModalProps> = ({
  isOpen,
  onClose,
  currentOrder,
  onSave,
  title = 'Kelola & Tambah Widget Dashboard',
  scopeName = 'Dashboard',
  availableWidgetList,
  defaultOrderList = DEFAULT_ORDER,
}) => {
  const [order, setOrder] = useState<WidgetId[]>(currentOrder);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setOrder(currentOrder);
    }
  }, [isOpen, currentOrder]);

  if (!isOpen) return null;

  const handleDragStart = (index: number, e: React.DragEvent) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    if (draggedIndex !== index) {
      const newOrder = [...order];
      const [movedItem] = newOrder.splice(draggedIndex, 1);
      newOrder.splice(index, 0, movedItem);
      setOrder(newOrder);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...order];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setOrder(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === order.length - 1) return;
    const newOrder = [...order];
    [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
    setOrder(newOrder);
  };

  const toggleWidget = (widget: WidgetId) => {
    if (order.includes(widget)) {
      setOrder(order.filter(w => w !== widget));
    } else {
      setOrder([...order, widget]);
    }
  };

  const handleSave = () => {
    onSave(order);
    toast.success('Pengaturan widget berhasil disimpan');
    onClose();
  };

  const pool = availableWidgetList || (Object.keys(WIDGET_NAMES) as WidgetId[]);
  const unselectedWidgets = pool.filter(w => !order.includes(w));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0b0a10] border border-[#1b1926] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-[scaleIn_0.2s_ease-out]">
        <div className="px-5 py-4 border-b border-[#1b1926] flex items-center justify-between bg-[#111018]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center">
              <Plus className="w-4 h-4 text-[#ccff00]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">{title}</h2>
              <p className="text-[10px] text-[#9f9bac]">Pilih, urutkan, atau hapus widget analitis untuk ruang kerja Anda</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#686477] hover:text-white p-1 rounded-lg hover:bg-[#1b1926] transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5 space-y-5 max-h-[65vh] overflow-y-auto custom-scrollbar">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] text-[#ccff00] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Activity className="w-3 h-3" /> Widget Aktif Di {scopeName} ({order.length})
              </p>
              <span className="text-[10px] text-[#686477]">Geser (drag) atau gunakan panah untuk reorder</span>
            </div>
            <div className="space-y-2">
              {order.length === 0 && (
                <div className="p-4 rounded-xl bg-[#111018] border border-dashed border-[#1b1926] text-center">
                  <p className="text-xs text-[#686477]">Tidak ada widget aktif di {scopeName.toLowerCase()}.</p>
                </div>
              )}
              {order.map((widget, index) => {
                const isDragging = draggedIndex === index;
                const isDragOver = dragOverIndex === index && !isDragging;

                return (
                  <div 
                    key={widget} 
                    draggable
                    onDragStart={(e) => handleDragStart(index, e)}
                    onDragOver={(e) => handleDragOver(index, e)}
                    onDrop={(e) => handleDrop(index, e)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing group ${
                      isDragging
                        ? 'opacity-30 bg-[#1b1926] border-[#ccff00] border-dashed'
                        : isDragOver
                        ? 'bg-[#ccff00]/10 border-[#ccff00] shadow-[0_0_12px_rgba(204,255,0,0.15)] scale-[1.01]'
                        : 'bg-[#111018] border-[#1b1926] hover:border-[#2a273b]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 flex-1 pr-2 min-w-0">
                      <div className="text-[#686477] group-hover:text-[#ccff00] cursor-grab active:cursor-grabbing shrink-0 transition-colors p-1 rounded hover:bg-[#1b1926]">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-white block truncate">{WIDGET_NAMES[widget] || widget}</span>
                        <span className="text-[10px] text-[#686477] block mt-0.5 truncate">{WIDGET_DESCRIPTIONS[widget] || ''}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button 
                        type="button"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        title="Geser Ke Atas"
                        className="p-1.5 rounded-lg bg-[#1b1926] hover:bg-[#252233] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors text-white"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => moveDown(index)}
                        disabled={index === order.length - 1}
                        title="Geser Ke Bawah"
                        className="p-1.5 rounded-lg bg-[#1b1926] hover:bg-[#252233] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors text-white"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <div className="w-px h-4 bg-[#1b1926] mx-1"></div>
                      <button 
                        type="button"
                        onClick={() => toggleWidget(widget)}
                        title={`Hapus dari ${scopeName}`}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {unselectedWidgets.length > 0 && (
            <div className="pt-3 border-t border-[#1b1926]">
              <p className="text-[10px] text-[#9f9bac] uppercase font-bold tracking-wider mb-3">
                Katalog Widget Analitis Tersedia ({unselectedWidgets.length})
              </p>
              <div className="space-y-2">
                {unselectedWidgets.map(widget => (
                  <div key={widget} className="flex items-center justify-between p-3 rounded-xl bg-[#0b0a10] border border-[#1b1926] hover:border-[#ccff00]/30 transition-all group">
                    <div className="flex-1 pr-3">
                      <span className="text-xs font-bold text-[#e1e1e1] group-hover:text-white transition-colors block">{WIDGET_NAMES[widget] || widget}</span>
                      <span className="text-[10px] text-[#686477] block mt-0.5">{WIDGET_DESCRIPTIONS[widget] || ''}</span>
                    </div>
                    <button 
                      onClick={() => toggleWidget(widget)}
                      className="px-3 py-1.5 rounded-lg bg-[#ccff00]/10 hover:bg-[#ccff00] text-[#ccff00] hover:text-black border border-[#ccff00]/30 text-xs font-bold cursor-pointer transition-all flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="px-5 py-4 border-t border-[#1b1926] bg-[#111018]/50 flex justify-between items-center">
          <button 
            onClick={() => setOrder(defaultOrderList)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#9f9bac] hover:text-white transition-colors cursor-pointer"
          >
            Reset Default
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#9f9bac] hover:bg-[#1b1926] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#ccff00] hover:bg-[#ddff33] text-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(204,255,0,0.15)] active:scale-95 font-sans"
            >
              <Save className="w-3.5 h-3.5" /> Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
