import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  ExternalLink, 
  Globe, 
  Terminal, 
  Copy, 
  Zap, 
  Smartphone, 
  Mail, 
  Radio, 
  HelpCircle,
  Code
} from 'lucide-react';
import { NotificationChannelConfig } from '../types';

export interface TestResultData {
  channel: string;
  success: boolean;
  message: string;
  timestamp?: string;
  waUrl?: string;
  mailtoUrl?: string;
  phone?: string;
  email?: string;
  formattedText?: string;
  subject?: string;
  troubleshooting?: string[];
  debugPayload?: any;
}

interface NotificationTestInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelName: string;
  testResult: TestResultData | null;
  isLoading: boolean;
  onReTest: (channel: string) => void;
  notifConfig: NotificationChannelConfig;
}

export const NotificationTestInspectorModal: React.FC<NotificationTestInspectorModalProps> = ({
  isOpen,
  onClose,
  channelName,
  testResult,
  isLoading,
  onReTest,
  notifConfig
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'troubleshoot' | 'payload'>('overview');

  if (!isOpen) return null;

  const handleCopyDebug = () => {
    if (testResult?.debugPayload) {
      navigator.clipboard.writeText(JSON.stringify(testResult.debugPayload, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getChannelIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'whatsapp':
        return <Smartphone className="w-5 h-5 text-emerald-400" />;
      case 'email':
        return <Mail className="w-5 h-5 text-cyan-400" />;
      case 'telegram':
        return <Send className="w-5 h-5 text-sky-400" />;
      case 'discord':
        return <Globe className="w-5 h-5 text-indigo-400" />;
      default:
        return <Radio className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0f0e15] border border-[#1b1926] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1b1926] bg-[#111018]/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#1b1926] border border-[#2d293e]">
              {getChannelIcon(channelName)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white font-sans">
                  Pengujian Saluran {channelName}
                </h3>
                {isLoading ? (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full animate-pulse">
                    MENGIRIM...
                  </span>
                ) : testResult?.success ? (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> SUKSES
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> GAGAL / PERLU SETUP
                  </span>
                )}
              </div>
              <p className="text-xs text-[#9f9bac] mt-0.5 font-sans">
                Inspector Notifikasi Real-time SafeHeaven Workbench
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#9f9bac] hover:text-white hover:bg-[#1b1926] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-[#1b1926] bg-[#0b0a10]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#1b1926] text-[#ccff00] border-t-2 border-[#ccff00]'
                : 'text-[#9f9bac] hover:text-white'
            }`}
          >
            Hasil Diagnostic
          </button>
          {testResult?.troubleshooting && testResult.troubleshooting.length > 0 && (
            <button
              onClick={() => setActiveTab('troubleshoot')}
              className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'troubleshoot'
                  ? 'bg-[#1b1926] text-[#ccff00] border-t-2 border-[#ccff00]'
                  : 'text-amber-400/90 hover:text-amber-300'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" /> Panduan Setup ({testResult.troubleshooting.length})
            </button>
          )}
          <button
            onClick={() => setActiveTab('payload')}
            className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'payload'
                ? 'bg-[#1b1926] text-[#ccff00] border-t-2 border-[#ccff00]'
                : 'text-[#9f9bac] hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Payload & Response Log
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 font-sans">
          {isLoading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-[#ccff00] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#9f9bac]">
                Menghubungi endpoint API server dan memproses sinyal notifikasi {channelName}...
              </p>
            </div>
          ) : activeTab === 'overview' ? (
            <div className="space-y-4">
              
              {/* Status Message Card */}
              <div className={`p-4 rounded-xl border ${
                testResult?.success 
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                  : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-start gap-3">
                  {testResult?.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-1">
                      {testResult?.success ? 'Pengujian Berhasil' : 'Sinyal Gagal Terkirim'}
                    </h4>
                    <p className="text-xs font-medium leading-relaxed">
                      {testResult?.message}
                    </p>
                    {testResult?.timestamp && (
                      <span className="text-[10px] text-gray-400 font-mono mt-2 block">
                        Waktu Eksekusi: {testResult.timestamp}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Special Direct Action: WhatsApp Web Link */}
              {channelName.toLowerCase() === 'whatsapp' && testResult?.waUrl && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                      <Smartphone className="w-4 h-4" /> Akses Langsung WhatsApp Web / App
                    </span>
                    <a
                      href={testResult.waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      Buka WhatsApp & Kirim Pesan <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <p className="text-[11px] text-emerald-200/80">
                    Sistem telah memformat teks pesan di bawah ini. Anda dapat mengkliknya untuk langsung membuka WhatsApp Web atau Aplikasi WhatsApp di HP/Desktop Anda:
                  </p>
                  <pre className="p-3 bg-[#0a090e] rounded-lg border border-[#1b1926] text-[11px] text-emerald-300 font-mono whitespace-pre-wrap leading-relaxed select-all">
                    {testResult.formattedText}
                  </pre>
                </div>
              )}

              {/* Special Direct Action: Email Mailto Link */}
              {channelName.toLowerCase() === 'email' && testResult?.mailtoUrl && (
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Kirim via Email Client Anda
                    </span>
                    <a
                      href={testResult.mailtoUrl}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-extrabold rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 transition-all"
                    >
                      Buka Aplikasi Email <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-[11px] text-cyan-200/80">
                      <strong>Penerima:</strong> {testResult.email}
                    </p>
                    <p className="text-[11px] text-cyan-200/80">
                      <strong>Subjek:</strong> {testResult.subject}
                    </p>
                  </div>
                </div>
              )}

              {/* Config Summary */}
              <div className="p-4 rounded-xl bg-[#111018] border border-[#1b1926] space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#ccff00]" /> Parameter Terkonfigurasi Saat Ini
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  {channelName === 'WhatsApp' && (
                    <div className="p-2 rounded bg-[#0b0a10] border border-[#1b1926] text-gray-300">
                      <span className="text-gray-500 block text-[9px]">NOMOR WHATSAPP:</span>
                      {notifConfig.whatsapp || 'Belum diisi'}
                    </div>
                  )}
                  {channelName === 'Email' && (
                    <div className="p-2 rounded bg-[#0b0a10] border border-[#1b1926] text-gray-300">
                      <span className="text-gray-500 block text-[9px]">ALAMAT EMAIL:</span>
                      {notifConfig.email || 'Belum diisi'}
                    </div>
                  )}
                  {channelName === 'Telegram' && (
                    <>
                      <div className="p-2 rounded bg-[#0b0a10] border border-[#1b1926] text-gray-300">
                        <span className="text-gray-500 block text-[9px]">BOT TOKEN:</span>
                        {notifConfig.telegramToken ? `${notifConfig.telegramToken.slice(0, 10)}...` : 'Belum diisi'}
                      </div>
                      <div className="p-2 rounded bg-[#0b0a10] border border-[#1b1926] text-gray-300">
                        <span className="text-gray-500 block text-[9px]">CHAT ID:</span>
                        {notifConfig.telegramChatId || 'Belum diisi'}
                      </div>
                    </>
                  )}
                  {channelName === 'Discord' && (
                    <div className="p-2 rounded bg-[#0b0a10] border border-[#1b1926] text-gray-300 sm:col-span-2 truncate">
                      <span className="text-gray-500 block text-[9px]">DISCORD WEBHOOK URL:</span>
                      {notifConfig.discordWebhook || notifConfig.webhookUrl || 'Belum diisi'}
                    </div>
                  )}
                  {(channelName === 'Custom Webhook' || channelName === 'Webhook') && (
                    <div className="p-2 rounded bg-[#0b0a10] border border-[#1b1926] text-gray-300 sm:col-span-2 truncate">
                      <span className="text-gray-500 block text-[9px]">CUSTOM HTTP WEBHOOK URL:</span>
                      {notifConfig.webhookUrl || 'Belum diisi'}
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : activeTab === 'troubleshoot' ? (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> Langkah Petunjuk Penyelesaian Konflik / Setup:
              </h4>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs text-amber-200">
                {testResult?.troubleshooting?.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-mono font-bold text-amber-400">{idx + 1}.</span>
                    <span>{step.replace(/^[0-9]+\.\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-[#ccff00]" /> Response JSON Payload Inspector
                </span>
                <button
                  onClick={handleCopyDebug}
                  className="px-2.5 py-1 text-[10px] font-bold bg-[#1b1926] hover:bg-[#2d293e] text-white rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Copy className="w-3 h-3" /> {copied ? 'Tersalin!' : 'Copy JSON'}
                </button>
              </div>
              <pre className="p-4 bg-[#08070d] rounded-xl border border-[#1b1926] text-[11px] font-mono text-[#ccff00] overflow-x-auto max-h-[300px]">
                {JSON.stringify(testResult?.debugPayload || testResult || { message: 'No payload data' }, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="p-4 border-t border-[#1b1926] bg-[#111018] flex items-center justify-between">
          <button
            onClick={() => onReTest(channelName)}
            disabled={isLoading}
            className="px-4 py-2 bg-[#1b1926] hover:bg-[#2d293e] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-[#ccff00]" /> {isLoading ? 'Memproses...' : 'Ulangi Uji Coba'}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold rounded-xl cursor-pointer transition-all"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
};
