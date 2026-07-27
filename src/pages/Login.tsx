/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAppStore } from '../stores';
import { auth, googleProvider, signInWithPopup } from '../lib/firebase';
import { ShieldCheck, ArrowRight, UserPlus, LogIn, Lock, Mail, User, TrendingUp, Landmark, Shield } from 'lucide-react';
import { SafeHavenLogo } from '../components/SafeHavenLogo';

export const Login: React.FC = () => {
  const [, setLocation] = useLocation();
  const { login, register, loginWithGoogle } = useAppStore();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const u = result.user;
      await loginWithGoogle(u.email || 'user@gmail.com', u.displayName || 'Google User', u.uid);
      setLocation('/');
    } catch (err) {
      console.error('Google Auth Error:', err);
      // Fallback local google login if popup is blocked in iframe
      login(email, name);
      setLocation('/');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate minor delay
    setTimeout(async () => {
      try {
        if (isRegister) {
          await register(email, password, name);
        } else {
          login(email, name);
        }
        setLocation('/');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div id="login-page-container" className="min-h-screen bg-[#060509] text-white flex justify-center items-center px-4 py-8 relative overflow-hidden font-sans select-none">
      
      {/* Absolute Ambient Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#ccff00]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#00f0ff]/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Outer split container */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* LEFT COLUMN: Visual Marketing Panel (Behance Presentation Element) */}
        <div className="hidden md:flex flex-col md:col-span-6 space-y-6 text-left pr-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center">
              <SafeHavenLogo className="w-6 h-6 drop-shadow-[0_0_6px_rgba(244,184,71,0.4)]" />
            </div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#F4B847]">Cockpit Engine v1.2</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight font-sans">
              Smart finance cockpit <br />
              engineered for <span className="text-[#ccff00] glow-text-lime underline decoration-[#ccff00]/40">growth.</span>
            </h1>
            <p className="text-xs text-[#9f9bac] leading-relaxed max-w-md">
              Kombinasi analisis kuantitatif SafeHeaven dan keindahan visual SafeHeaven. Rasakan rebalancing aset instan, optimalisasi portofolio kualitatif berbasis AI, dan pemantauan bursa real-time.
            </p>
          </div>

          {/* MOCK VIRTUAL CREDIT CARD (SAFEHEAVEN SIGNATURE DESIGN) */}
          <div className="relative group perspective">
            {/* Card Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#ccff00]/15 to-[#00f0ff]/10 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Credit Card Body */}
            <div className="relative w-full h-52 rounded-2xl bg-gradient-to-br from-[#12111f] via-[#0f0e15] to-[#1a1827] border border-[#2d2943] p-6 flex flex-col justify-between shadow-2xl overflow-hidden transition-all duration-300 transform group-hover:translate-y-[-4px] group-hover:scale-[1.01] hover:border-[#ccff00]/30">
              {/* Gloss Reflection Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

              {/* Top Card Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-extrabold tracking-wider text-white">SafeHeaven<span className="text-[#ccff00]">.</span></h3>
                  <span className="text-[9px] text-[#686477] font-mono tracking-widest uppercase">Visa Infinite</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Contactless symbol */}
                  <div className="w-5 h-5 flex flex-col justify-between items-center gap-0.5 opacity-30">
                    <span className="block w-4 h-0.5 bg-white rounded-full"></span>
                    <span className="block w-3.5 h-0.5 bg-white rounded-full"></span>
                    <span className="block w-2.5 h-0.5 bg-white rounded-full"></span>
                  </div>
                  {/* Card Chip icon */}
                  <div className="w-8 h-6 bg-gradient-to-r from-amber-400/40 to-yellow-500/20 border border-yellow-500/30 rounded-md relative flex items-center justify-center overflow-hidden">
                    <span className="absolute w-full h-[1px] bg-yellow-500/20 top-1/2"></span>
                    <span className="absolute h-full w-[1px] bg-yellow-500/20 left-1/2"></span>
                  </div>
                </div>
              </div>

              {/* Card Center: Capital Balance */}
              <div className="space-y-0.5">
                <span className="text-[9px] text-[#9f9bac] uppercase font-mono tracking-wider">Total Active Portfolio</span>
                <p className="text-2xl font-bold font-mono tracking-tight text-[#ccff00]">
                  Rp 500.000.000<span className="text-white text-xs font-sans">,00</span>
                </p>
              </div>

              {/* Bottom Card Footer */}
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[8px] text-[#686477] uppercase font-mono tracking-widest">Card Holder</span>
                  <p className="text-xs font-bold font-mono tracking-wide text-white">IMAM NASRULLOH</p>
                </div>
                <div className="text-right">
                  <span className="text-[8px] text-[#686477] uppercase font-mono tracking-widest">Expiry</span>
                  <p className="text-xs font-bold font-mono tracking-wide text-white">09 / 31</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Mini-Bento Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0b0a10]/50 border border-[#1b1926] rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#00f5a0]/10 flex items-center justify-center text-[#00f5a0]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-[#686477] uppercase font-bold tracking-wider">Daily Rebalancing</p>
                <p className="text-sm font-extrabold text-white">99.98% Acc.</p>
              </div>
            </div>

            <div className="bg-[#0b0a10]/50 border border-[#1b1926] rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/10 flex items-center justify-center text-[#00f0ff]">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-[#686477] uppercase font-bold tracking-wider">SafeHaven Vault</p>
                <p className="text-sm font-extrabold text-white">Secured Assets</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Glassmorphic Authentication Card */}
        <div className="w-full md:col-span-6 flex justify-center">
          <div className="w-full max-w-md bg-[#0b0a10]/60 border border-[#1b1926] rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative">
            
            {/* Form Header */}
            <div className="text-center mb-6">
              <div className="md:hidden inline-flex items-center justify-center w-10 h-10 mb-3">
                <SafeHavenLogo className="w-8 h-8 drop-shadow-[0_0_8px_rgba(244,184,71,0.4)]" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white font-sans">
                {isRegister ? 'Membuat Akun Baru' : 'Masuk ke Cockpit'}
              </h2>
              <p className="text-xs text-[#9f9bac] mt-1">
                {isRegister ? 'Mulailah dengan merancang taktis akun Anda' : 'Silakan gunakan detail demo Anda untuk masuk langsung'}
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-[#9f9bac] flex items-center gap-1.5 ml-0.5">
                    <User className="w-3.5 h-3.5" /> Nama Lengkap
                  </label>
                  <input
                    id="login-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="cth: Imam Nasrulloh"
                    className="w-full bg-[#111018] border border-[#1b1926] text-sm rounded-xl px-4 py-3 text-white placeholder-[#686477] focus:outline-none focus:border-[#ccff00] focus:shadow-[0_0_15px_rgba(204,255,0,0.1)] transition-all font-sans"
                  />
                </div>
              )}

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-[#9f9bac] flex items-center gap-1.5 ml-0.5">
                  <Mail className="w-3.5 h-3.5" /> Alamat Email
                </label>
                <input
                  id="login-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cth: nama@email.com"
                  className="w-full bg-[#111018] border border-[#1b1926] text-sm rounded-xl px-4 py-3 text-white placeholder-[#686477] focus:outline-none focus:border-[#ccff00] focus:shadow-[0_0_15px_rgba(204,255,0,0.1)] transition-all font-sans"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-[#9f9bac] flex items-center gap-1.5 ml-0.5">
                  <Lock className="w-3.5 h-3.5" /> PIN Keamanan / Password
                </label>
                <input
                  id="login-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#111018] border border-[#1b1926] text-sm rounded-xl px-4 py-3 text-white placeholder-[#686477] focus:outline-none focus:border-[#ccff00] focus:shadow-[0_0_15px_rgba(204,255,0,0.1)] transition-all font-sans"
                />
              </div>

              {/* Submit Button */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/20 active:scale-98"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                ) : isRegister ? (
                  <>
                    <UserPlus className="w-4 h-4" /> Daftar Akun <ArrowRight className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" /> Masuk Ke Cockpit <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {/* Google Firebase Auth Button */}
              <button
                id="login-google-btn"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full mt-2 bg-[#171522] hover:bg-[#201d2f] border border-[#2d2943] text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {googleLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Lanjutkan dengan Google</span>
                  </>
                )}
              </button>

              {/* Demo Mode Instant Access Button */}
              <button
                id="login-demo-btn"
                type="button"
                onClick={() => {
                  useAppStore.getState().loginDemoUser(false);
                  setLocation('/dashboard');
                }}
                className="w-full mt-2 bg-[#111018] hover:bg-[#181624] border border-[#ccff00]/30 text-[#ccff00] text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(204,255,0,0.1)]"
              >
                <span>Coba Langsung dengan Akun Demo</span>
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center text-xs">
              <span className="text-[#686477]">
                {isRegister ? 'Sudah memiliki akun?' : 'Belum memiliki akun?'}
              </span>{' '}
              <button
                id="login-toggle-mode-btn"
                onClick={() => setIsRegister(!isRegister)}
                className="text-[#ccff00] hover:text-[#ddff33] font-bold underline bg-transparent border-0 cursor-pointer p-0 ml-1 transition-colors"
              >
                {isRegister ? 'Masuk sekarang' : 'Daftar sekarang'}
              </button>
            </div>

            {/* Security Note Footer */}
            <div className="mt-8 pt-4 border-t border-[#1b1926] flex items-center justify-center gap-2 text-[9px] text-[#686477]">
              <Shield className="w-3.5 h-3.5 text-[#ccff00]" />
              <span>Sistem Enkripsi AES-256 Terlindungi oleh Protokol SafeHeaven.</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
