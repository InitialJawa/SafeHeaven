import React, { useState, useEffect } from 'react';
import { useAppStore } from '../stores';
import { 
  Settings as SettingsIcon, 
  Shield, 
  HelpCircle, 
  Save, 
  Bell, 
  Smartphone, 
  Mail, 
  Globe, 
  Radio, 
  Volume2, 
  DollarSign, 
  CheckCircle2, 
  Send, 
  Zap, 
  SlidersHorizontal,
  AlertTriangle,
  Lock,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';
import { NotificationChannelConfig, GlobalSystemConfig } from '../types';
import { NotificationTestInspectorModal, TestResultData } from '../components/NotificationTestInspectorModal';

export const Settings: React.FC = () => {
  const { 
    portfolioConfig, 
    strategies, 
    universes, 
    updatePortfolioConfig,
    notificationConfig,
    saveNotificationConfig,
    globalConfig,
    saveGlobalConfig
  } = useAppStore();

  // 1. Portfolio Base Config
  const [capital, setCapital] = useState(500000000);
  const [universe, setUniverse] = useState(universes[0]?.name || 'LQ45 Core Universe');
  const [topN, setTopN] = useState(10);
  const [strategyTemplate, setStrategyTemplate] = useState('strat-1');
  const [strategyProfile, setStrategyProfile] = useState<string>('auto');

  // 2. Notification Channel Config State
  const [notifState, setNotifState] = useState<NotificationChannelConfig>({
    email: 'imamnasrulloh02@gmail.com',
    emailEnabled: true,
    whatsapp: '+6281234567890',
    whatsappEnabled: true,
    webhookUrl: 'https://api.my-custom-webhook.com/alerts',
    webhookEnabled: false,
    telegramToken: '7123456789:AAFxX_ExampleTelegramBotToken',
    telegramChatId: '-100123456789',
    telegramEnabled: true,
    discordWebhook: 'https://discord.com/api/webhooks/123456789/ExampleDiscordWebhookKey',
    discordEnabled: true,
    rotationAlert: true,
    signalAlert: true,
    dailyReport: false,
    crashAlert: true,
  });

  // 3. Global Workbench System Config State
  const [sysState, setSysState] = useState<GlobalSystemConfig>({
    currencyDisplay: 'IDR',
    executionMode: 'Otomatis',
    autoSyncInterval: '15s',
    maxSingleStockAllocation: 15,
    autoStopLoss: 10,
    soundNotifications: true,
    highContrastGlow: true,
  });

  const [isTestingNotif, setIsTestingNotif] = useState(false);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'notifications' | 'global'>('portfolio');

  // Modal Inspector State
  const [isInspectorModalOpen, setIsInspectorModalOpen] = useState(false);
  const [selectedChannelName, setSelectedChannelName] = useState('WhatsApp');
  const [testResultData, setTestResultData] = useState<TestResultData | null>(null);

  useEffect(() => {
    if (portfolioConfig) {
      setCapital(portfolioConfig.capital || 500000000);
      setUniverse(portfolioConfig.universe || 'LQ45 Core Universe');
      setTopN(portfolioConfig.topN || 10);
      setStrategyTemplate(portfolioConfig.strategyTemplate || 'strat-1');
      setStrategyProfile(portfolioConfig.strategyProfile || 'auto');
    }
    if (notificationConfig) {
      setNotifState({
        email: notificationConfig.email || '',
        emailEnabled: notificationConfig.emailEnabled ?? true,
        whatsapp: notificationConfig.whatsapp || '',
        whatsappEnabled: notificationConfig.whatsappEnabled ?? true,
        webhookUrl: notificationConfig.webhookUrl || '',
        webhookEnabled: notificationConfig.webhookEnabled ?? false,
        telegramToken: notificationConfig.telegramToken || '',
        telegramChatId: notificationConfig.telegramChatId || '',
        telegramEnabled: notificationConfig.telegramEnabled ?? true,
        discordWebhook: notificationConfig.discordWebhook || '',
        discordEnabled: notificationConfig.discordEnabled ?? true,
        rotationAlert: notificationConfig.rotationAlert ?? true,
        signalAlert: notificationConfig.signalAlert ?? true,
        dailyReport: notificationConfig.dailyReport ?? false,
        crashAlert: notificationConfig.crashAlert ?? true,
      });
    }
    if (globalConfig) {
      setSysState({
        currencyDisplay: globalConfig.currencyDisplay || 'IDR',
        executionMode: globalConfig.executionMode || 'Otomatis',
        autoSyncInterval: globalConfig.autoSyncInterval || '15s',
        maxSingleStockAllocation: globalConfig.maxSingleStockAllocation || 15,
        autoStopLoss: globalConfig.autoStopLoss || 10,
        soundNotifications: globalConfig.soundNotifications ?? true,
        highContrastGlow: globalConfig.highContrastGlow ?? true,
      });
    }
  }, [portfolioConfig, notificationConfig, globalConfig]);

  const handleStrategyChange = (templateId: string) => {
    setStrategyTemplate(templateId);
    const selectedStrat = strategies.find(s => s.id === templateId);
    if (selectedStrat) {
      toast.info(`Preset strategi diaktifkan: ${selectedStrat.name}`);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();

    const portfolioPayload = {
      capital,
      universe,
      topN,
      strategyTemplate,
      strategyProfile: strategyProfile as any,
      strategyName: strategies.find(s => s.id === strategyTemplate)?.name || 'Custom Strategy'
    };

    try {
      await Promise.all([
        updatePortfolioConfig(portfolioPayload),
        saveNotificationConfig(notifState),
        saveGlobalConfig(sysState)
      ]);
      toast.success('Seluruh pengaturan SafeHeaven Workbench berhasil disimpan!');
    } catch (err) {
      console.error(err);
      toast.error('Gagal menyimpan konfigurasi ke server.');
    }
  };

  const handleTestNotification = async (channelName: string) => {
    setSelectedChannelName(channelName);
    setIsInspectorModalOpen(true);
    setIsTestingNotif(true);
    setTestResultData(null);

    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/notif/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: channelName, config: notifState })
      });
      const data = await res.json();
      setTestResultData(data);
      if (res.ok && data.success) {
        toast.success(data.message || `Notifikasi uji coba berhasil dikirim ke ${channelName}!`);
      } else {
        toast.error(data.message || `Uji coba ${channelName} perlu konfigurasi.`);
      }
    } catch (err: any) {
      const errObj: TestResultData = {
        channel: channelName,
        success: false,
        message: `Gagal menghubungi server: ${err.message || 'Network error'}`,
        troubleshooting: [
          '1. Pastikan dev server berjalan dengan normal.',
          '2. Periksa jaringan internet Anda.'
        ]
      };
      setTestResultData(errObj);
      toast.error(`Uji coba saluran notifikasi ${channelName} gagal.`);
    } finally {
      setIsTestingNotif(false);
    }
  };

  const handleBatchTestAll = async () => {
    const channels = ['WhatsApp', 'Email', 'Telegram', 'Discord', 'Custom Webhook'];
    toast.info('Memulai tes seluruh 5 saluran notifikasi...');
    for (const ch of channels) {
      await handleTestNotification(ch);
    }
  };

  return (
    <div id="settings-workbench" className="px-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-8 bg-[#ccff00] rounded-full"></span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans flex items-center gap-2">
              Settings Workbench
            </h1>
            <p className="text-xs text-[#9f9bac] font-sans mt-0.5">
              Kelola modal kerja, saluran notifikasi real-time (WhatsApp, Email, Telegram, Discord, Webhook), serta preferensi global sistem SafeHeaven.
            </p>
          </div>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1b1926] pb-3">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-sans flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'portfolio' 
              ? 'bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30' 
              : 'text-[#9f9bac] hover:text-white hover:bg-[#111018]'
          }`}
        >
          <SettingsIcon className="w-4 h-4" /> Portfolio & Strategi
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-sans flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'notifications' 
              ? 'bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30' 
              : 'text-[#9f9bac] hover:text-white hover:bg-[#111018]'
          }`}
        >
          <Bell className="w-4 h-4" /> Saluran Notifikasi (WhatsApp/Email/Webhook)
        </button>

        <button
          onClick={() => setActiveTab('global')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-sans flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'global' 
              ? 'bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30' 
              : 'text-[#9f9bac] hover:text-white hover:bg-[#111018]'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" /> Pengaturan Sistem Global
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Settings Form Container */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSaveAll} className="space-y-6">
            
            {/* TAB 1: Portfolio & Strategy Settings */}
            {activeTab === 'portfolio' && (
              <div className="card card-elevated p-6 bg-[#0b0a10]/45 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#1b1926]">
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    <SettingsIcon className="w-4.5 h-4.5 text-[#ccff00]" /> Konfigurasi Dasar Portfolio
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-[#00f5a0] bg-[#00f5a0]/10 border border-[#00f5a0]/20 px-2.5 py-1 rounded-full">
                    Formula Allocation Active
                  </span>
                </div>

                {/* Capital & Target Universe */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-sans">
                  <div className="space-y-2">
                    <label className="text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px] flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-[#ccff00]" /> Modal Kerja Awal (Capital IDR)
                    </label>
                    <input
                      id="settings-capital-input"
                      type="number"
                      required
                      value={capital}
                      onChange={(e) => setCapital(parseInt(e.target.value) || 0)}
                      placeholder="Rp 500.000.000"
                      className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-mono text-xs font-bold"
                    />
                    <p className="text-[10px] text-[#686477]">Basis kalkulasi nominal pembelian saham per rebalancing.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#00f0ff]" /> Target Universe Saham
                    </label>
                    <select
                      id="settings-universe-select"
                      value={universe}
                      onChange={(e) => setUniverse(e.target.value)}
                      className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-bold"
                    >
                      {universes.map((u) => (
                        <option key={u.id} value={u.name} className="bg-[#12111f]">{u.name}</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-[#686477]">Kelompok penyaringan emiten awal sebelum skoring.</p>
                  </div>
                </div>

                {/* Top N & Strategy Preset */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-sans">
                  <div className="space-y-2">
                    <label className="text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> Konstituen Unggulan (Top N Saham)
                    </label>
                    <input
                      id="settings-topn-input"
                      type="number"
                      min="1"
                      max="50"
                      required
                      value={topN}
                      onChange={(e) => setTopN(parseInt(e.target.value) || 1)}
                      className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-mono text-xs font-bold"
                    />
                    <p className="text-[10px] text-[#686477]">Jumlah maksimum saham berperingkat skor tertinggi dalam alokasi.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px] flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-purple-400" /> Template Strategi Kuantitatif
                    </label>
                    <select
                      id="settings-strategy-select"
                      value={strategyTemplate}
                      onChange={(e) => handleStrategyChange(e.target.value)}
                      className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-bold"
                    >
                      {strategies.map((s) => (
                        <option key={s.id} value={s.id} className="bg-[#12111f]">{s.name}</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-[#686477]">Mengatur pembobotan otomatis (Quality, Value, Growth, Momentum, Dividen).</p>
                  </div>
                  <div className="space-y-2 mt-4">
                    <label className="text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px] flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-blue-400" /> Profil Strategi
                    </label>
                    <select
                      id="settings-profile-select"
                      value={strategyProfile}
                      onChange={(e) => setStrategyProfile(e.target.value)}
                      className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-bold"
                    >
                      <option value="auto" className="bg-[#12111f]">Auto (Ikut Regime)</option>
                      <option value="aggressive_momentum" className="bg-[#12111f]">Aggressive Momentum</option>
                      <option value="defensive_value" className="bg-[#12111f]">Defensive Value</option>
                      <option value="custom" className="bg-[#12111f]">Custom (Template)</option>
                    </select>
                    <p className="text-[10px] text-[#686477]">Pilih Auto untuk pembobotan otomatis mengikuti kondisi IHSG.</p>
                  </div>
                </div>

                {/* Notice box replacing old sliders */}
                <div className="p-4 rounded-xl bg-[#111018]/80 border border-[#1b1926] space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-[#ccff00] font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Alokasi Aset Otomatis & Dinamis
                  </div>
                  <p className="text-[#9f9bac] text-[11px] leading-relaxed">
                    Pengaturan bobot pengaman alokasi manual (slider) telah dialihkan ke dalam <strong className="text-white">formula matematika strategi</strong>. Pembobotan saham, emas, dan kas IDR/USD kini diatur secara responsif berdasarkan sinyal makro dan regresi momentum real-time.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: Notification Channels (WhatsApp, Email, Webhook) */}
            {activeTab === 'notifications' && (
              <div className="card card-elevated p-6 bg-[#0b0a10]/45 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1b1926]">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                      <Bell className="w-4.5 h-4.5 text-[#ccff00]" /> Saluran Lampiran Notifikasi & Alert
                    </h3>
                    <p className="text-[10px] text-[#9f9bac] mt-0.5">
                      WhatsApp, Email, Telegram, Discord Webhook & Custom HTTP JSON Endpoint
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleBatchTestAll}
                    disabled={isTestingNotif}
                    className="px-3.5 py-2 bg-[#ccff00]/10 hover:bg-[#ccff00]/20 border border-[#ccff00]/30 text-[#ccff00] text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto"
                  >
                    <Zap className="w-3.5 h-3.5" /> Tes Seluruh 5 Saluran
                  </button>
                </div>

                {/* 1. WhatsApp Channel */}
                <div className="p-4 rounded-2xl bg-[#111018]/60 border border-[#1b1926] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Notifikasi WhatsApp (Instant Push)</h4>
                        <p className="text-[10px] text-[#9f9bac]">Terima sinyal jual/beli & peringatan crash shield langsung di HP Anda.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifState.whatsappEnabled} 
                        onChange={(e) => setNotifState({ ...notifState, whatsappEnabled: e.target.checked })} 
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[#1b1926] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  {notifState.whatsappEnabled && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <input
                        type="text"
                        value={notifState.whatsapp || ''}
                        onChange={(e) => setNotifState({ ...notifState, whatsapp: e.target.value })}
                        placeholder="+62 812-3456-7890"
                        className="flex-1 bg-[#0b0a10] border border-[#1b1926] rounded-xl px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-500/50"
                      />
                      <button
                        type="button"
                        disabled={isTestingNotif}
                        onClick={() => handleTestNotification('WhatsApp')}
                        className="px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <Send className="w-3.5 h-3.5" /> Tes WhatsApp
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Email Channel */}
                <div className="p-4 rounded-2xl bg-[#111018]/60 border border-[#1b1926] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Notifikasi Email (Laporan & Alert)</h4>
                        <p className="text-[10px] text-[#9f9bac]">Terima laporan mingguan rebalancing & analisis kuantitatif via Email.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={Boolean(notifState.emailEnabled)} 
                        onChange={(e) => setNotifState({ ...notifState, emailEnabled: e.target.checked })} 
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[#1b1926] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>

                  {notifState.emailEnabled && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <input
                        type="email"
                        value={notifState.email || ''}
                        onChange={(e) => setNotifState({ ...notifState, email: e.target.value })}
                        placeholder="email@domain.com"
                        className="flex-1 bg-[#0b0a10] border border-[#1b1926] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-500/50"
                      />
                      <button
                        type="button"
                        disabled={isTestingNotif}
                        onClick={() => handleTestNotification('Email')}
                        className="px-4 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <Send className="w-3.5 h-3.5" /> Tes Email
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Custom Webhook Telegram Bot */}
                <div className="p-4 rounded-2xl bg-[#111018]/60 border border-[#1b1926] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                        <Send className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Custom Webhook Telegram Bot API</h4>
                        <p className="text-[10px] text-[#9f9bac]">Kirim sinyal otomatis langsung ke Grup/Channel Telegram melalui Bot API.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={Boolean(notifState.telegramEnabled)} 
                        onChange={(e) => setNotifState({ ...notifState, telegramEnabled: e.target.checked })} 
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[#1b1926] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
                    </label>
                  </div>

                  {notifState.telegramEnabled && (
                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-[#9f9bac] font-bold block mb-1">Bot Token (BotFather)</label>
                          <input
                            type="text"
                            value={notifState.telegramToken || ''}
                            onChange={(e) => setNotifState({ ...notifState, telegramToken: e.target.value })}
                            placeholder="7123456789:AAFxX_..."
                            className="w-full bg-[#0b0a10] border border-[#1b1926] rounded-xl px-4 py-2 text-white font-mono text-xs focus:outline-none focus:border-sky-500/50"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#9f9bac] font-bold block mb-1">Chat ID / Channel ID</label>
                          <input
                            type="text"
                            value={notifState.telegramChatId || ''}
                            onChange={(e) => setNotifState({ ...notifState, telegramChatId: e.target.value })}
                            placeholder="-100123456789 atau @channel_name"
                            className="w-full bg-[#0b0a10] border border-[#1b1926] rounded-xl px-4 py-2 text-white font-mono text-xs focus:outline-none focus:border-sky-500/50"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          disabled={isTestingNotif}
                          onClick={() => handleTestNotification('Telegram')}
                          className="px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all"
                        >
                          <Send className="w-3.5 h-3.5" /> Tes Connection Telegram
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Custom Webhook Discord */}
                <div className="p-4 rounded-2xl bg-[#111018]/60 border border-[#1b1926] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Custom Webhook Discord Channel</h4>
                        <p className="text-[10px] text-[#9f9bac]">Kirim pesan embed berwarna resmi ke Discord Server Anda.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={Boolean(notifState.discordEnabled)} 
                        onChange={(e) => setNotifState({ ...notifState, discordEnabled: e.target.checked })} 
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[#1b1926] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>

                  {notifState.discordEnabled && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <input
                        type="url"
                        value={notifState.discordWebhook || ''}
                        onChange={(e) => setNotifState({ ...notifState, discordWebhook: e.target.value })}
                        placeholder="https://discord.com/api/webhooks/..."
                        className="flex-1 bg-[#0b0a10] border border-[#1b1926] rounded-xl px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-indigo-500/50"
                      />
                      <button
                        type="button"
                        disabled={isTestingNotif}
                        onClick={() => handleTestNotification('Discord')}
                        className="px-4 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <Send className="w-3.5 h-3.5" /> Tes Discord Webhook
                      </button>
                    </div>
                  )}
                </div>

                {/* 5. Custom HTTP / JSON Webhook */}
                <div className="p-4 rounded-2xl bg-[#111018]/60 border border-[#1b1926] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <Radio className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Custom HTTP JSON Webhook (Sistem Eksternal)</h4>
                        <p className="text-[10px] text-[#9f9bac]">Integrasi payload HTTP POST standar JSON untuk backend/sistem trading pihak ketiga.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={Boolean(notifState.webhookEnabled)} 
                        onChange={(e) => setNotifState({ ...notifState, webhookEnabled: e.target.checked })} 
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[#1b1926] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>

                  {notifState.webhookEnabled && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <input
                        type="url"
                        value={notifState.webhookUrl || ''}
                        onChange={(e) => setNotifState({ ...notifState, webhookUrl: e.target.value })}
                        placeholder="https://api.my-trading-server.com/alerts"
                        className="flex-1 bg-[#0b0a10] border border-[#1b1926] rounded-xl px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-purple-500/50"
                      />
                      <button
                        type="button"
                        disabled={isTestingNotif}
                        onClick={() => handleTestNotification('Custom Webhook')}
                        className="px-4 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <Send className="w-3.5 h-3.5" /> Tes Custom Webhook
                      </button>
                    </div>
                  )}
                </div>

                {/* Event Types Rules */}
                <div className="pt-4 border-t border-[#1b1926] space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider text-[10px]">Aturan Kejadian Pemicu Alert (Trigger Rules)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {[
                      { key: 'signalAlert', label: 'Perubahan Skor & Sinyal Beli/Jual', desc: 'Alert saat emiten menembus skor Beli (>80)' },
                      { key: 'rotationAlert', label: 'Rotasi Sektor & Arus Kas Makro', desc: 'Pemberitahuan perubahan fase rotasi sektor' },
                      { key: 'crashAlert', label: 'Peringatan Crash Shield Critical', desc: 'Peringatan penurunan pasar dramatis' },
                      { key: 'dailyReport', label: 'Ringkasan Harian EOD Portfolio', desc: 'Ringkasan performa harian dikirim setiap sore' }
                    ].map((rule) => (
                      <label key={rule.key} className="flex items-start gap-3 p-3 rounded-xl bg-[#111018]/40 border border-[#1b1926] cursor-pointer hover:border-[#ccff00]/30 transition-all">
                        <input
                          type="checkbox"
                          checked={notifState[rule.key as keyof NotificationChannelConfig] as boolean}
                          onChange={(e) => setNotifState({ ...notifState, [rule.key]: e.target.checked })}
                          className="mt-0.5 accent-[#ccff00]"
                        />
                        <div>
                          <span className="font-bold text-white block text-xs">{rule.label}</span>
                          <span className="text-[10px] text-[#686477]">{rule.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Global System Preferences (Affecting All Tabs) */}
            {activeTab === 'global' && (
              <div className="card card-elevated p-6 bg-[#0b0a10]/45 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#1b1926]">
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    <SlidersHorizontal className="w-4.5 h-4.5 text-[#ccff00]" /> Pengaturan Sistem Global Workbench
                  </h3>
                  <span className="text-[10px] font-mono text-[#9f9bac]">
                    Global Workspace Parameters
                  </span>
                </div>

                {/* Currency & Risk Profile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-sans">
                  <div className="space-y-2">
                    <label className="text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Format Tampilan Mata Uang Utama</label>
                    <select
                      value={sysState.currencyDisplay}
                      onChange={(e) => setSysState({ ...sysState, currencyDisplay: e.target.value as any })}
                      className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-bold"
                    >
                      <option value="IDR" className="bg-[#12111f]">IDR - Rupiah (Rp)</option>
                      <option value="USD" className="bg-[#12111f]">USD - US Dollar ($)</option>
                      <option value="DUAL" className="bg-[#12111f]">Dual Currency (IDR & USD)</option>
                    </select>
                    <p className="text-[10px] text-[#686477]">Mengatur representasi nominal di seluruh tab eksekusi & analisis.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Mode Eksekusi Sinyal Strategi</label>
                    <select
                      value={sysState.executionMode}
                      onChange={(e) => setSysState({ ...sysState, executionMode: e.target.value as any })}
                      className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-bold"
                    >
                      <option value="Otomatis" className="bg-[#12111f]">Otomatis (Sesuai Master Rules Strategy Builder)</option>
                      <option value="Semi-Auto" className="bg-[#12111f]">Semi-Auto (Kirim Alert & Konfirmasi Manual)</option>
                      <option value="Simulasi" className="bg-[#12111f]">Simulasi (Paper Trading & Test Sandbox)</option>
                    </select>
                    <p className="text-[10px] text-[#686477]">Masing-masing emiten & alokasi dikendalikan oleh formula kuantitatif di Strategy Builder.</p>
                  </div>
                </div>

                {/* API Sync & Auto Stop Loss */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-sans">
                  <div className="space-y-2">
                    <label className="text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Frekuensi Sync Data Live Yahoo Finance API</label>
                    <select
                      value={sysState.autoSyncInterval}
                      onChange={(e) => setSysState({ ...sysState, autoSyncInterval: e.target.value as any })}
                      className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-bold"
                    >
                      <option value="5s" className="bg-[#12111f]">Real-time Ultra (Setiap 5 Detik)</option>
                      <option value="15s" className="bg-[#12111f]">Standar Live (Setiap 15 Detik)</option>
                      <option value="60s" className="bg-[#12111f]">Hemat Bandwidth (Setiap 1 Menit)</option>
                      <option value="manual" className="bg-[#12111f]">Manual Sync Saham Saja</option>
                    </select>
                    <p className="text-[10px] text-[#686477]">Interval pembaruan kuotasi live BEI di background server.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Batas Maksimal Alokasi Per Single Stock (%)</label>
                    <input
                      type="number"
                      min="5"
                      max="50"
                      value={sysState.maxSingleStockAllocation}
                      onChange={(e) => setSysState({ ...sysState, maxSingleStockAllocation: parseInt(e.target.value) || 15 })}
                      className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-mono text-xs font-bold"
                    />
                    <p className="text-[10px] text-[#686477]">Batas diversifikasi untuk mencegah konsentrasi berlebih pada satu emiten.</p>
                  </div>
                </div>

                {/* System Toggles */}
                <div className="pt-4 border-t border-[#1b1926] space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider text-[10px]">Preferensi Tampilan & Audio Dashboard</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#111018]/40 border border-[#1b1926] cursor-pointer hover:border-[#ccff00]/30 transition-all">
                      <div className="flex items-center gap-2.5">
                        <Volume2 className="w-4 h-4 text-[#ccff00]" />
                        <span className="font-bold text-white">Efek Suara Notifikasi Signal</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={sysState.soundNotifications}
                        onChange={(e) => setSysState({ ...sysState, soundNotifications: e.target.checked })}
                        className="accent-[#ccff00]"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#111018]/40 border border-[#1b1926] cursor-pointer hover:border-[#ccff00]/30 transition-all">
                      <div className="flex items-center gap-2.5">
                        <Radio className="w-4 h-4 text-[#00f0ff]" />
                        <span className="font-bold text-white">Mode Estetika High-Contrast Glow</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={sysState.highContrastGlow}
                        onChange={(e) => setSysState({ ...sysState, highContrastGlow: e.target.checked })}
                        className="accent-[#00f0ff]"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Save Action Button */}
            <div className="pt-2 flex justify-end">
              <button
                id="save-settings-workbench-bottom-btn"
                type="submit"
                className="px-6 py-3 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/20 active:scale-98 transition-all"
              >
                <Save className="w-4 h-4 stroke-[2.5px]" /> Simpan Semua Konfigurasi
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Status & Guidance Info Cards */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active Integration Status */}
          <div className="card card-elevated p-6 space-y-4 bg-[#0b0a10]/45">
            <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2 border-b border-[#1b1926] pb-3">
              <Zap className="w-4.5 h-4.5 text-[#ccff00]" /> Status Integrasi Workbench
            </h4>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111018]/60 border border-[#1b1926]">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span className="text-white font-bold">WhatsApp Push</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${notifState.whatsappEnabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#1b1926] text-[#686477]'}`}>
                  {notifState.whatsappEnabled ? 'TERHUBUNG' : 'NONAKTIF'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111018]/60 border border-[#1b1926]">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span className="text-white font-bold">Email Alert</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${notifState.emailEnabled ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-[#1b1926] text-[#686477]'}`}>
                  {notifState.emailEnabled ? 'AKTIF' : 'NONAKTIF'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111018]/60 border border-[#1b1926]">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-sky-400" />
                  <span className="text-white font-bold">Telegram Bot</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${notifState.telegramEnabled ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-[#1b1926] text-[#686477]'}`}>
                  {notifState.telegramEnabled ? 'TERHUBUNG' : 'NONAKTIF'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111018]/60 border border-[#1b1926]">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <span className="text-white font-bold">Discord Webhook</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${notifState.discordEnabled ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-[#1b1926] text-[#686477]'}`}>
                  {notifState.discordEnabled ? 'TERHUBUNG' : 'NONAKTIF'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111018]/60 border border-[#1b1926]">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-bold">Custom Webhook</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${notifState.webhookEnabled ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-[#1b1926] text-[#686477]'}`}>
                  {notifState.webhookEnabled ? 'AKTIF' : 'NONAKTIF'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111018]/60 border border-[#1b1926]">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#ccff00]" />
                  <span className="text-white font-bold">Yahoo Finance Live</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20">
                  {sysState.autoSyncInterval}
                </span>
              </div>
            </div>
          </div>

          {/* Formula Allocation Guide Card */}
          <div className="card card-elevated p-6 space-y-3 bg-[#0b0a10]/45">
            <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Shield className="w-4.5 h-4.5 text-[#ccff00]" /> Aturan Pembobotan Dinamis
            </h4>
            <p className="text-xs text-[#9f9bac] leading-relaxed font-sans">
              Model SafeHeaven menggunakan <strong className="text-white">formula alokasi dinamis</strong>. Slider persentase aset manual telah ditiadakan agar porsi saham, emas, dan kas dapat beradaptasi secara otomatis mengikuti sinyal Crash Shield dan fluktuasi skor kuantitatif.
            </p>
          </div>

          {/* Help & Documentation */}
          <div className="card card-elevated p-6 space-y-3 bg-[#0b0a10]/45">
            <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <HelpCircle className="w-4.5 h-4.5 text-[#00f0ff]" /> Skenario & Bantuan
            </h4>
            <ul className="text-xs text-[#9f9bac] leading-relaxed space-y-2 list-disc pl-4 font-sans font-medium">
              <li>Gunakan tombol <strong className="text-white">Tes Alert</strong> untuk memverifikasi penerimaan sinyal di HP atau email Anda.</li>
              <li>Parameter <strong className="text-white">Max Single Stock Allocation</strong> mencegah kerugian sistemik bila satu emiten mengalami kejutan negatif.</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Real-time Notification Test Inspector Modal */}
      <NotificationTestInspectorModal
        isOpen={isInspectorModalOpen}
        onClose={() => setIsInspectorModalOpen(false)}
        channelName={selectedChannelName}
        testResult={testResultData}
        isLoading={isTestingNotif}
        onReTest={handleTestNotification}
        notifConfig={notifState}
      />
    </div>
  );
};
