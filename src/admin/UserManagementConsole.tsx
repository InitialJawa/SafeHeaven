/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../stores';
import { 
  Users, 
  UserCheck, 
  ShieldCheck, 
  Crown, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  UserPlus, 
  Wrench, 
  Mail, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { GoogleIcon, GmailIcon } from '../components/AppLogos';

interface UserManagementConsoleProps {
  addLog: (msg: string) => void;
}

export const UserManagementConsole: React.FC<UserManagementConsoleProps> = ({ addLog }) => {
  const { users, changeUserRole, addClient, fetchInitialData } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | 'admin' | 'advisor' | 'user'>('all');
  const [loading, setLoading] = useState(false);

  // New Client Form
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);

  // VIP Diagnostic tool
  const [diagnosticEmail, setDiagnosticEmail] = useState('');
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);

  const filteredUsers = (users || []).filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleChangeRole = async (userId: string, userEmail: string, newRole: 'user' | 'advisor' | 'admin') => {
    try {
      setLoading(true);
      await changeUserRole(userId, newRole);
      const roleName = newRole === 'admin' ? 'Admin' : newRole === 'advisor' ? 'VIP / Advisor' : 'Member Biasa';
      toast.success(`Role pengguna ${userEmail} berhasil diubah ke ${roleName}`);
      addLog(`USER ROLE CHANGED: ${userEmail} -> ${newRole}`);
      await fetchInitialData();
    } catch (err) {
      toast.error('Gagal memperbarui hak akses pengguna.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientEmail) return;

    try {
      setIsAddingClient(true);
      await addClient(newClientName, newClientEmail);
      toast.success(`Member VIP/Klien ${newClientName} berhasil ditambahkan!`);
      addLog(`VIP CLIENT ADDED: ${newClientEmail}`);
      setNewClientName('');
      setNewClientEmail('');
      await fetchInitialData();
    } catch (err) {
      toast.error('Gagal menambahkan klien.');
    } finally {
      setIsAddingClient(false);
    }
  };

  const handleRunVipDiagnostic = () => {
    if (!diagnosticEmail) return;
    const targetUser = users.find(u => u.email.toLowerCase() === diagnosticEmail.toLowerCase().trim());
    
    if (targetUser) {
      setDiagnosticResult({
        found: true,
        user: targetUser,
        status: targetUser.role === 'advisor' || targetUser.role === 'admin' ? 'Active VIP / High Tier' : 'Member Standard',
        hasClaim: targetUser.role === 'admin' || targetUser.role === 'advisor',
        recommendation: targetUser.role === 'user' ? 'Gunakan tombol "Tingkatkan ke VIP" di daftar anggota untuk mengaktifkan akses.' : 'Akses VIP aktif dan tidak ada kendala.'
      });
    } else {
      setDiagnosticResult({
        found: false,
        status: 'Email Tidak Terdaftar',
        hasClaim: false,
        recommendation: 'Email belum melakukan pendaftaran atau login dengan Google. Minta pengguna untuk login terlebih dahulu.'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00f0ff]/10 border border-[#00f0ff]/20 rounded-xl flex items-center justify-center text-[#00f0ff]">
              <Users className="w-5 h-5 glow-text-cyan" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-sans">Manajemen Pengguna & Control Member VIP</h2>
              <p className="text-xs text-[#9f9bac] mt-0.5 font-sans">
                Pengelolaan akun terdaftar, pemberian lisensi VIP/Advisor, dan inspeksi masalah akses member.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1.5 bg-[#111018] border border-[#1b1926] text-[#00f0ff] rounded-xl">
              Total Pengguna: {users.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Member List + VIP Quick Diagnostic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN (8 cols): Member List & Role Controls */}
        <div className="lg:col-span-8 space-y-5">
          
          <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] space-y-4">
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-[#686477] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama atau email member..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#111018] border border-[#1b1926] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#686477] focus:outline-none focus:border-[#00f0ff]/40"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                {(['all', 'admin', 'advisor', 'user'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRoleFilter(r)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer capitalize ${
                      selectedRoleFilter === r
                        ? 'bg-[#00f0ff]/15 text-[#00f0ff] border-[#00f0ff]/40'
                        : 'bg-[#111018] text-[#9f9bac] border-[#1b1926] hover:text-white'
                    }`}
                  >
                    {r === 'all' ? 'Semua' : r === 'advisor' ? 'VIP Advisor' : r}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto border border-[#1b1926] rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#111018] text-white font-bold border-b border-[#1b1926]">
                  <tr>
                    <th className="px-4 py-3">Nama Member</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role Saat Ini</th>
                    <th className="px-4 py-3 text-right">Ubah Akses Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b1926]/40 text-[#9f9bac]">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-[#686477] font-semibold">
                        Tidak ada pengguna yang cocok dengan kriteria pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isGmail = u.email.toLowerCase().includes('gmail') || u.email.toLowerCase().endsWith('@gmail.com');
                      return (
                        <tr key={u.id} className="hover:bg-[#111018]/40">
                          <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                            <div className="relative">
                              {u.photoURL ? (
                                <img src={u.photoURL} alt={u.name} className="w-6 h-6 rounded-full object-cover border border-[#2d2943]" referrerPolicy="no-referrer" />
                              ) : u.role === 'admin' ? (
                                <ShieldCheck className="w-4 h-4 text-[#ccff00]" />
                              ) : u.role === 'advisor' ? (
                                <Crown className="w-4 h-4 text-amber-400" />
                              ) : (
                                <UserCheck className="w-4 h-4 text-[#9f9bac]" />
                              )}
                              {isGmail && (
                                <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-[#1b1926] shadow-sm" title="Akun Gmail / Google">
                                  <GoogleIcon className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </div>
                            <span>{u.name}</span>
                          </td>
                          <td className="px-4 py-3 font-mono text-white">
                            <div className="flex items-center gap-1.5">
                              {isGmail ? (
                                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white text-[11px]" title="Akun Gmail / Google">
                                  <GoogleIcon className="w-3.5 h-3.5 shrink-0" />
                                  <span>{u.email}</span>
                                </span>
                              ) : (
                                <span>{u.email}</span>
                              )}
                            </div>
                          </td>
                        <td className="px-4 py-3 font-mono">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.role === 'admin' ? 'bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30' :
                            u.role === 'advisor' ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30' :
                            'bg-[#1b1926] text-[#9f9bac]'
                          }`}>
                            {u.role === 'advisor' ? 'VIP Advisor' : u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-1.5">
                          {u.role !== 'admin' && (
                            <button
                              disabled={loading}
                              onClick={() => handleChangeRole(u.id, u.email, 'admin')}
                              className="px-2.5 py-1 bg-[#ccff00]/10 hover:bg-[#ccff00]/20 text-[#ccff00] text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                            >
                              Jadikan Admin
                            </button>
                          )}
                          {u.role !== 'advisor' && (
                            <button
                              disabled={loading}
                              onClick={() => handleChangeRole(u.id, u.email, 'advisor')}
                              className="px-2.5 py-1 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                            >
                              Tingkatkan ke VIP
                            </button>
                          )}
                          {u.role !== 'user' && (
                            <button
                              disabled={loading}
                              onClick={() => handleChangeRole(u.id, u.email, 'user')}
                              className="px-2.5 py-1 bg-[#1b1926] hover:bg-[#282538] text-[#9f9bac] text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                            >
                              Set Standard
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
                </tbody>
              </table>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN (4 cols): VIP Registration & Diagnostic Tool */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Form 1: Add New VIP Client */}
          <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] space-y-4">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-amber-400" /> Daftarkan Member VIP Baru
            </h3>

            <form onSubmit={handleCreateClient} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[#9f9bac] font-bold uppercase text-[10px]">Nama Lengkap VIP</label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Misal: Budi Santoso"
                  className="w-full bg-[#111018] border border-[#1b1926] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#9f9bac] font-bold uppercase text-[10px]">Email Terdaftar</label>
                <input
                  type="email"
                  required
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="Misal: budi.vip@gmail.com"
                  className="w-full bg-[#111018] border border-[#1b1926] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400/40"
                />
              </div>

              <button
                type="submit"
                disabled={isAddingClient}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" /> Aktifkan Hak Akses VIP
              </button>
            </form>
          </div>

          {/* Form 2: VIP Error & Access Diagnostic */}
          <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] space-y-4">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#00f0ff]" /> Cek & Diagnosis Error Member VIP
            </h3>

            <p className="text-[11px] text-[#9f9bac]">
              Gunakan alat ini apabila member melapor lisensi VIP tidak masuk atau mengalami kejanggalan hak akses.
            </p>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[#9f9bac] font-bold uppercase text-[10px]">Email Member</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={diagnosticEmail}
                    onChange={(e) => setDiagnosticEmail(e.target.value)}
                    placeholder="Masukkan email member..."
                    className="flex-1 bg-[#111018] border border-[#1b1926] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]/40"
                  />
                  <button
                    type="button"
                    onClick={handleRunVipDiagnostic}
                    className="px-3.5 py-2 bg-[#00f0ff] hover:bg-cyan-300 text-black font-extrabold rounded-xl cursor-pointer"
                  >
                    Cek
                  </button>
                </div>
              </div>

              {diagnosticResult && (
                <div className="p-3.5 bg-[#111018] border border-[#1b1926] rounded-xl space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#686477]">Status Pendaftaran:</span>
                    <span className={`font-bold font-mono ${diagnosticResult.found ? 'text-[#00f5a0]' : 'text-[#ff3366]'}`}>
                      {diagnosticResult.status}
                    </span>
                  </div>

                  {diagnosticResult.found && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#686477]">Role Aktif:</span>
                      <span className="font-bold text-white font-mono">{diagnosticResult.user.role}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#1b1926] text-[11px] text-[#9f9bac]">
                    <span className="font-bold text-white">Rekomendasi: </span>
                    {diagnosticResult.recommendation}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
