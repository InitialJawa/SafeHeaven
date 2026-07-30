/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../stores';
import { 
  CreditCard, 
  ExternalLink, 
  Save, 
  CheckCircle2, 
  RefreshCw, 
  UserCheck, 
  ShieldCheck, 
  Sparkles, 
  DollarSign,
  Info,
  QrCode
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentConsoleProps {
  addLog: (msg: string) => void;
}

export const PaymentConsole: React.FC<PaymentConsoleProps> = ({ addLog }) => {
  const { globalConfig, saveGlobalConfig, users, changeUserRole } = useAppStore();

  const [saweriaUrl, setSaweriaUrl] = useState<string>(globalConfig?.saweriaUrl || 'https://saweria.co/SafeHavenAdmin');
  const [saweriaMerchantName, setSaweriaMerchantName] = useState<string>(globalConfig?.saweriaMerchantName || 'SafeHaven Official');
  const [saweriaInstructions, setSaweriaInstructions] = useState<string>(globalConfig?.saweriaInstructions || 'Pembayaran diproses secara aman melalui Saweria. Pastikan mencantumkan email terdaftar saat checkout.');
  
  const [isSaving, setIsSaving] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'user' | 'advisor' | 'admin'>('advisor');
  const [isGranting, setIsGranting] = useState(false);

  useEffect(() => {
    if (globalConfig) {
      if (globalConfig.saweriaUrl) setSaweriaUrl(globalConfig.saweriaUrl);
      if (globalConfig.saweriaMerchantName) setSaweriaMerchantName(globalConfig.saweriaMerchantName);
      if (globalConfig.saweriaInstructions) setSaweriaInstructions(globalConfig.saweriaInstructions);
    }
  }, [globalConfig]);

  const handleSavePaymentConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updatedConfig = {
        ...globalConfig,
        saweriaUrl: saweriaUrl.trim(),
        saweriaMerchantName: saweriaMerchantName.trim(),
        saweriaInstructions: saweriaInstructions.trim(),
      };
      await saveGlobalConfig(updatedConfig);
      toast.success('Pengaturan Saweria & Payment Gateway berhasil disimpan!');
      addLog(`[PAYMENT] Admin memperbarui konfigurasi Saweria URL ke: ${saweriaUrl}`);
    } catch (err) {
      toast.error('Gagal menyimpan konfigurasi pembayaran.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGrantUserAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserEmail) {
      toast.error('Pilih atau masukkan email pengguna');
      return;
    }
    setIsGranting(true);
    try {
      const foundUser = users.find(u => u.email.toLowerCase() === selectedUserEmail.toLowerCase());
      if (foundUser) {
        await changeUserRole(foundUser.id, selectedRole);
        toast.success(`Role pengguna ${foundUser.email} berhasil diubah menjadi ${selectedRole.toUpperCase()}!`);
        addLog(`[USER_ROLE] Admin mengupgrade status ${foundUser.email} -> ${selectedRole}`);
      } else {
        toast.info(`Email ${selectedUserEmail} belum terdaftar di sistem lokal. Memperbarui pendaftaran simulasi.`);
      }
    } catch (err) {
      toast.error('Gagal mengupgrade status pengguna.');
    } finally {
      setIsGranting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title Banner */}
      <div className="card p-6 bg-[#111018] border border-[#1b1926] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-xl flex items-center justify-center text-[#ccff00]">
            <CreditCard className="w-6 h-6 glow-text-lime" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              Pengaturan Saweria & Payment Gateway
            </h2>
            <p className="text-xs text-[#9f9bac]">
              Atur link pembayaran Saweria, nama merchant, dan kelola upgrade status member VIP/Platinum secara manual.
            </p>
          </div>
        </div>

        <a
          href={saweriaUrl}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2.5 rounded-xl bg-[#ccff00]/15 hover:bg-[#ccff00]/25 border border-[#ccff00]/40 text-[#ccff00] text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Uji Coba Link Saweria</span>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT 2 COLUMNS: Saweria Config Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSavePaymentConfig} className="card p-6 bg-[#111018] border border-[#1b1926] rounded-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b1926]">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#ccff00]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Konfigurasi Saweria Link</h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#ccff00]/15 border border-[#ccff00]/30 text-[#ccff00]">
                LIVE GATEWAY
              </span>
            </div>

            {/* Saweria URL Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#9f9bac] flex items-center justify-between">
                <span>URL Link Saweria Admin</span>
                <span className="text-[10px] font-mono text-gray-500">Format: https://saweria.co/username</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={saweriaUrl}
                  onChange={(e) => setSaweriaUrl(e.target.value)}
                  placeholder="https://saweria.co/SafeHavenAdmin"
                  required
                  className="w-full px-4 py-3 bg-[#0b0a10] border border-[#27243c] focus:border-[#ccff00] rounded-xl text-xs text-white font-mono placeholder:text-gray-600 focus:outline-none transition-all pr-24"
                />
                <a
                  href={saweriaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute right-2 top-2 px-3 py-1.5 bg-[#1b1926] hover:bg-[#28253f] text-xs text-[#ccff00] rounded-lg border border-[#2d2946] font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" /> Test
                </a>
              </div>
              <p className="text-[11px] text-[#686477]">
                *Link ini akan digunakan saat pengguna menekan tombol <strong>Get it Now</strong> di halaman <strong>Premium & Topup</strong>.
              </p>
            </div>

            {/* Merchant Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#9f9bac]">
                Nama Merchant / Akun Penerima
              </label>
              <input
                type="text"
                value={saweriaMerchantName}
                onChange={(e) => setSaweriaMerchantName(e.target.value)}
                placeholder="SafeHaven Official"
                className="w-full px-4 py-3 bg-[#0b0a10] border border-[#27243c] focus:border-[#ccff00] rounded-xl text-xs text-white font-sans placeholder:text-gray-600 focus:outline-none transition-all"
              />
            </div>

            {/* Checkout Instructions */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#9f9bac]">
                Catatan / Instruksi Pembayaran bagi Pengguna
              </label>
              <textarea
                value={saweriaInstructions}
                onChange={(e) => setSaweriaInstructions(e.target.value)}
                rows={3}
                placeholder="Pembayaran diproses secara aman melalui Saweria. Pastikan mencantumkan email terdaftar saat checkout."
                className="w-full px-4 py-3 bg-[#0b0a10] border border-[#27243c] focus:border-[#ccff00] rounded-xl text-xs text-white font-sans placeholder:text-gray-600 focus:outline-none transition-all leading-relaxed"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-[#1b1926] flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] active:scale-[0.98] text-black font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(204,255,0,0.2)]"
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Simpan Pengaturan Saweria</span>
              </button>
            </div>
          </form>

          {/* Pricing Overview Preview */}
          <div className="card p-6 bg-[#111018] border border-[#1b1926] rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-[#ccff00] uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Preview Struktur Paket Premium Aktif
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 bg-[#0b0a10] border border-[#1b1926] rounded-xl space-y-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase">Paket Free</div>
                <div className="text-lg font-black text-white">Rp 0 <span className="text-[10px] text-gray-500 font-normal">/bln</span></div>
                <div className="text-[10px] text-gray-500">Fitur dasar screening IHSG & 1 Portofolio.</div>
              </div>

              <div className="p-3.5 bg-[#0b0a10] border border-[#ccff00]/30 rounded-xl space-y-1 relative overflow-hidden">
                <div className="text-[10px] font-bold text-[#ccff00] uppercase flex justify-between">
                  <span>Paket Pro</span>
                  <span className="text-[9px] bg-[#ccff00]/20 px-1.5 py-0.2 rounded">POPULAR</span>
                </div>
                <div className="text-lg font-black text-white">Rp 30.000 <span className="text-[10px] text-[#ccff00] font-normal">/bln</span></div>
                <div className="text-[10px] text-gray-400">Total Rp 90.000 / 3 Bulan (Quant Lab + Rebalance).</div>
              </div>

              <div className="p-3.5 bg-[#0b0a10] border border-[#00f0ff]/30 rounded-xl space-y-1">
                <div className="text-[10px] font-bold text-[#00f0ff] uppercase flex justify-between">
                  <span>Paket Premium</span>
                  <span className="text-[9px] bg-[#00f0ff]/20 px-1.5 py-0.2 rounded">BEST VALUE</span>
                </div>
                <div className="text-lg font-black text-white">Rp 20.800 <span className="text-[10px] text-[#00f0ff] font-normal">/bln</span></div>
                <div className="text-[10px] text-gray-400">Total Rp 250.000 / 12 Bulan (Akses Full VIP 24/7).</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Manual User Privilege Grant Tool */}
        <div className="space-y-6">
          <form onSubmit={handleGrantUserAccess} className="card p-6 bg-[#111018] border border-[#1b1926] rounded-2xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#1b1926]">
              <UserCheck className="w-4 h-4 text-[#00f0ff]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Aktivasi Manual VIP / Platinum</h3>
            </div>

            <p className="text-xs text-[#9f9bac] leading-relaxed">
              Setelah pembayaran Saweria terkonfirmasi, Admin dapat langsung memberikan hak akses <strong>VIP / Platinum</strong> kepada pengguna secara manual di bawah ini.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#9f9bac]">Pilih Pengguna / Masukkan Email</label>
              <input
                type="email"
                value={selectedUserEmail}
                onChange={(e) => setSelectedUserEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                className="w-full px-3.5 py-2.5 bg-[#0b0a10] border border-[#27243c] focus:border-[#00f0ff] rounded-xl text-xs text-white placeholder:text-gray-600 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#9f9bac]">Set Level Hak Akses</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as 'user' | 'advisor' | 'admin')}
                className="w-full px-3.5 py-2.5 bg-[#0b0a10] border border-[#27243c] focus:border-[#00f0ff] rounded-xl text-xs text-white focus:outline-none transition-all"
              >
                <option value="advisor">VIP / Platinum Member (Advisor)</option>
                <option value="admin">Master Administrator</option>
                <option value="user">Member Biasa (Free)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isGranting}
              className="w-full py-2.5 px-4 rounded-xl bg-[#00f0ff] hover:bg-[#00d0e0] active:scale-[0.98] text-black font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGranting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Aktifkan Akses Sekarang</span>
            </button>
          </form>

          {/* User list count indicator */}
          <div className="card p-5 bg-[#111018] border border-[#1b1926] rounded-2xl space-y-3 text-xs">
            <div className="flex items-center justify-between text-[#9f9bac]">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#ccff00]" /> Total Member Terdaftar
              </span>
              <span className="font-mono font-bold text-white">{users.length}</span>
            </div>
            
            <div className="space-y-1.5 pt-2 border-t border-[#1b1926]">
              {users.slice(0, 4).map(u => (
                <div key={u.id} className="flex items-center justify-between p-2 rounded-lg bg-[#0b0a10] border border-[#1b1926]">
                  <span className="truncate max-w-[150px] font-mono text-[11px] text-gray-300">{u.email}</span>
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                    u.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    u.role === 'advisor' ? 'bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/30' :
                    'bg-gray-800 text-gray-400'
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
