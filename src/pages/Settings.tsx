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
  Layers,
  Bot,
  Cpu,
  Key,
  RefreshCw,
  BrainCircuit,
  Eye,
  EyeOff,
  Server,
  PanelRight,
  PanelRightClose,
  Minimize2,
  Maximize2,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Webhook,
  Plug,
  Scale,
  Rocket
} from 'lucide-react';
import { toast } from 'sonner';
import { WhatsappIcon, TelegramIcon, DiscordIcon, GoogleGeminiIcon, OpenAIIcon, AnthropicIcon, DeepSeekIcon } from '../components/AppLogos';
import { NotificationChannelConfig, GlobalSystemConfig, AiApiConfig, AiProvider } from '../types';
import { NotificationTestInspectorModal, TestResultData } from '../components/NotificationTestInspectorModal';

export const Settings: React.FC = () => {
  const { 
    user,
    portfolioConfig, 
    strategies, 
    universes, 
    updatePortfolioConfig,
    notificationConfig,
    saveNotificationConfig,
    globalConfig,
    saveGlobalConfig,
    aiConfig,
    saveAiConfig
  } = useAppStore();

  // 1. Portfolio Base Config
  const [capital, setCapital] = useState(500000000);
  const [universe, setUniverse] = useState(universes[0]?.name || 'LQ45 Core Universe');
  const [topN, setTopN] = useState(10);
  const [strategyTemplate, setStrategyTemplate] = useState('strat-1');
  const [strategyProfile, setStrategyProfile] = useState<string>('auto');

  // 2. Notification Channel Config State
  const [notifState, setNotifState] = useState<NotificationChannelConfig>({
    email: user?.email || 'admin@safehaven.id',
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

  // 4. AI API Config State
  const [showApiKey, setShowApiKey] = useState(false);
  const [aiState, setAiState] = useState<AiApiConfig>({
    provider: 'gemini',
    aiModel: 'gemini-2.5-flash',
    customApiKey: '',
    customBaseUrl: '',
    aiTemperature: 0.3,
    aiAdvisorTone: 'balanced',
    autoNewsSentiment: true,
    stockScoringReasoning: true,
    maxTokens: 2048,
    enableSearchGrounding: true
  });

  const [isTestingNotif, setIsTestingNotif] = useState(false);
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [aiTestResult, setAiTestResult] = useState<{ success: boolean; message: string; latencyMs: number; providerUsed?: string; modelUsed?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'notifications' | 'global' | 'ai_api'>('portfolio');

  // Modal Inspector State
  const [isInspectorModalOpen, setIsInspectorModalOpen] = useState(false);
  const [selectedChannelName, setSelectedChannelName] = useState('WhatsApp');
  const [testResultData, setTestResultData] = useState<TestResultData | null>(null);

  // 5. Simple Sidebar Visibility Toggle
  const [showSidebar, setShowSidebar] = useState<boolean>(() => {
    const saved = localStorage.getItem('safehaven_settings_show_sidebar');
    return saved !== null ? saved === 'true' : true;
  });
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const toggleSidebar = () => {
    const nextState = !showSidebar;
    setShowSidebar(nextState);
    localStorage.setItem('safehaven_settings_show_sidebar', String(nextState));
    toast.info(nextState ? 'Sidebar ditampilkan' : 'Sidebar disembunyikan (Layar Penuh)');
  };

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
    if (aiConfig) {
      setAiState({
        provider: aiConfig.provider || 'gemini',
        aiModel: aiConfig.aiModel || 'gemini-2.5-flash',
        customApiKey: aiConfig.customApiKey || '',
        customBaseUrl: aiConfig.customBaseUrl || '',
        aiTemperature: aiConfig.aiTemperature ?? 0.3,
        aiAdvisorTone: aiConfig.aiAdvisorTone || 'balanced',
        autoNewsSentiment: aiConfig.autoNewsSentiment ?? true,
        stockScoringReasoning: aiConfig.stockScoringReasoning ?? true,
        maxTokens: aiConfig.maxTokens || 2048,
        enableSearchGrounding: aiConfig.enableSearchGrounding ?? true
      });
    }
  }, [portfolioConfig, notificationConfig, globalConfig, aiConfig]);

  const handleStrategyChange = (templateId: string) => {
    setStrategyTemplate(templateId);
    const selectedStrat = strategies.find(s => s.id === templateId);
    if (selectedStrat) {
      toast.info(`Preset strategi diaktifkan: ${selectedStrat.name}`);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();

    let calculatedStrategyName = 'Auto Regime (IHSG)';
    if (strategyProfile === 'custom') {
      calculatedStrategyName = strategies.find(s => s.id === strategyTemplate)?.name || 'Custom Strategy';
    } else {
      const nameMap: Record<string, string> = {
        auto: 'Auto Regime (IHSG)',
        aggressive_momentum: 'Aggressive Momentum',
        defensive_value: 'Defensive Value'
      };
      calculatedStrategyName = nameMap[strategyProfile] || 'Auto Regime (IHSG)';
    }

    const portfolioPayload = {
      capital,
      universe,
      topN,
      strategyTemplate,
      strategyProfile: strategyProfile as any,
      strategyName: calculatedStrategyName
    };

    try {
      await Promise.all([
        updatePortfolioConfig(portfolioPayload),
        saveNotificationConfig(notifState),
        saveGlobalConfig(sysState),
        saveAiConfig(aiState)
      ]);
      toast.success('Seluruh pengaturan SafeHeaven Workbench & AI Engine berhasil disimpan!');
    } catch (err) {
      console.error(err);
      toast.error('Gagal menyimpan konfigurasi ke server.');
    }
  };

  const handleProviderChange = (newProvider: AiProvider) => {
    let defaultModel = 'gemini-2.5-flash';
    if (newProvider === 'openai') defaultModel = 'gpt-4o-mini';
    else if (newProvider === 'anthropic') defaultModel = 'claude-3-5-sonnet-20241022';
    else if (newProvider === 'deepseek') defaultModel = 'deepseek-chat';
    else if (newProvider === 'groq') defaultModel = 'llama-3.3-70b-versatile';
    else if (newProvider === 'custom_openai') defaultModel = 'llama3';

    let defaultBaseUrl = aiState.customBaseUrl || '';
    if (newProvider === 'custom_openai' && !defaultBaseUrl) {
      defaultBaseUrl = 'http://localhost:11434/v1';
    }

    setAiState(prev => ({
      ...prev,
      provider: newProvider,
      aiModel: defaultModel,
      customBaseUrl: defaultBaseUrl
    }));
  };

  const handleTestAiApi = async () => {
    setIsTestingAi(true);
    setAiTestResult(null);
    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/ai/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: aiState.provider,
          aiModel: aiState.aiModel,
          customApiKey: aiState.customApiKey,
          customBaseUrl: aiState.customBaseUrl,
          aiTemperature: aiState.aiTemperature,
          maxTokens: aiState.maxTokens
        })
      });
      const data = await res.json();
      setAiTestResult(data);
      if (data.success) {
        toast.success(`Uji Coba AI (${data.providerUsed || aiState.provider} - ${data.modelUsed}): Terhubung OK (${data.latencyMs}ms)`);
      } else {
        toast.error(data.message || 'Gagal terhubung ke AI API.');
      }
    } catch (err: any) {
      setAiTestResult({
        success: false,
        message: `Koneksi gagal: ${err.message || 'Network error'}`,
        latencyMs: 0
      });
      toast.error('Gagal menghubungi endpoint tes AI API.');
    } finally {
      setIsTestingAi(false);
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

        {/* Top Quick Save Button when Sidebar is Hidden */}
        {!showSidebar && (
          <button
            onClick={(e) => handleSaveAll(e as any)}
            type="button"
            className="px-4 py-2.5 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-[#ccff00]/10 transition-all active:scale-98 shrink-0 self-start md:self-center"
          >
            <Save className="w-4 h-4 stroke-[2.5px]" /> Simpan Semua Pengaturan
          </button>
        )}
      </div>

      {/* Settings Navigation Tabs & Sidebar Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="bg-[#111018]/80 p-1.5 rounded-2xl border border-[#1b1926] flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1">
          <button
            type="button"
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold font-sans flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'portfolio' 
                ? 'bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/40 shadow-lg shadow-[#ccff00]/10' 
                : 'text-[#9f9bac] hover:text-white hover:bg-[#1b1926]/60 border border-transparent'
            }`}
          >
            <SettingsIcon className="w-4 h-4" /> Portfolio & Strategi
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold font-sans flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'notifications' 
                ? 'bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/40 shadow-lg shadow-[#ccff00]/10' 
                : 'text-[#9f9bac] hover:text-white hover:bg-[#1b1926]/60 border border-transparent'
            }`}
          >
            <Bell className="w-4 h-4" /> Notifikasi & Alert
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-0.5">
              {[notifState.whatsappEnabled, notifState.emailEnabled, notifState.telegramEnabled, notifState.discordEnabled, notifState.webhookEnabled].filter(Boolean).length} Aktif
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('global')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold font-sans flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'global' 
                ? 'bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/40 shadow-lg shadow-[#ccff00]/10' 
                : 'text-[#9f9bac] hover:text-white hover:bg-[#1b1926]/60 border border-transparent'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" /> Sistem Global
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ai_api')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold font-sans flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ai_api' 
                ? 'bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/40 shadow-lg shadow-[#ccff00]/10' 
                : 'text-[#9f9bac] hover:text-white hover:bg-[#1b1926]/60 border border-transparent'
            }`}
          >
            <Bot className="w-4 h-4 text-[#ccff00]" /> AI Engine API
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20 ml-0.5 uppercase">
              {aiState.provider.toUpperCase()}
            </span>
          </button>
        </div>

        {/* Simple Sidebar Toggle Button */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="px-3.5 py-2.5 bg-[#111018]/80 hover:bg-[#1b1926] border border-[#1b1926] text-xs font-bold text-[#9f9bac] hover:text-white rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 self-start lg:self-center"
        >
          {showSidebar ? (
            <>
              <PanelRightClose className="w-4 h-4 text-[#ccff00]" />
              <span>Sembunyikan Sidebar</span>
            </>
          ) : (
            <>
              <PanelRight className="w-4 h-4 text-[#ccff00]" />
              <span>Tampilkan Sidebar</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Settings Form Container */}
        <div className={`${showSidebar ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6 transition-all duration-300`}>
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
                    <label className="text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px] flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-[#ccff00]" /> Modal Kerja Awal (Capital IDR)</span>
                      <span className="text-[#ccff00] font-mono font-bold">Rp {capital.toLocaleString('id-ID')}</span>
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
                    <div className="flex items-center gap-1.5 pt-0.5">
                      {[
                        { label: '100 Jt', value: 100000000 },
                        { label: '500 Jt', value: 500000000 },
                        { label: '1 Milyar', value: 1000000000 },
                        { label: '2.5 Milyar', value: 2500000000 }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setCapital(preset.value)}
                          className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                            capital === preset.value
                              ? 'bg-[#ccff00]/15 text-[#ccff00] border-[#ccff00]/40'
                              : 'bg-[#111018] text-[#9f9bac] border-[#1b1926] hover:text-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
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

                {/* Top N & Strategy Select */}
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
                      <Shield className="w-3.5 h-3.5 text-blue-400" /> Profil Strategi Kuantitatif
                    </label>
                    <select
                      id="settings-strategy-profile-select"
                      value={strategyProfile === 'custom' ? `custom:${strategyTemplate}` : strategyProfile}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.startsWith('custom:')) {
                          const stratId = val.replace('custom:', '');
                          const strat = strategies.find(s => s.id === stratId);
                          if (strat) {
                            setStrategyProfile('custom');
                            setStrategyTemplate(stratId);
                            toast.info(`Strategi diubah ke template kustom: ${strat.name}`);
                          }
                        } else {
                          const nameMap: Record<string, string> = {
                            auto: 'Auto Regime (IHSG)',
                            aggressive_momentum: 'Aggressive Momentum',
                            defensive_value: 'Defensive Value'
                          };
                          setStrategyProfile(val);
                          toast.info(`Profil dinamis diaktifkan: ${nameMap[val] || val}`);
                        }
                      }}
                      className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-bold"
                    >
                      <optgroup label="PROFIL DINAMIS (REGIME-BASED)" className="bg-[#12111f] text-amber-400 font-bold">
                        <option value="auto" className="bg-[#12111f] text-white">Auto (Ikut Regime IHSG)</option>
                        <option value="aggressive_momentum" className="bg-[#12111f] text-white">Aggressive Momentum (Otoriter)</option>
                        <option value="defensive_value" className="bg-[#12111f] text-white">Defensive Value (Konservatif)</option>
                      </optgroup>
                      <optgroup label="TEMPLATE KUSTOM MANUAL" className="bg-[#12111f] text-[#ccff00] font-bold">
                        {strategies.map((s) => (
                          <option key={s.id} value={`custom:${s.id}`} className="bg-[#12111f] text-white">
                            {s.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    <p className="text-[10px] text-[#686477]">Pilih profil otomasi AI berbasis regime pasar, atau gunakan template manual.</p>
                  </div>
                  
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
                        <WhatsappIcon className="w-5 h-5" />
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
                        <TelegramIcon className="w-5 h-5" />
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
                        <DiscordIcon className="w-5 h-5" />
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
                        <Webhook className="w-5 h-5" />
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

            {/* TAB 4: AI API & Multi-Provider Engine Settings */}
            {activeTab === 'ai_api' && (
              <div className="card card-elevated p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b1926] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#ccff00]">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white font-sans flex items-center gap-2">
                        Konfigurasi Multi-Provider AI API & Engine
                      </h3>
                      <p className="text-xs text-[#9f9bac]">
                        Pilih provider AI favorit Anda (Gemini, OpenAI, Anthropic, DeepSeek, Groq, atau Custom OpenAI / Ollama) dan atur parameter kinerjanya.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestAiApi}
                    disabled={isTestingAi}
                    className="px-4 py-2 bg-[#ccff00]/10 hover:bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/30 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isTestingAi ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Zap className="w-3.5 h-3.5" />
                    )}
                    {isTestingAi ? 'Menguji API...' : 'Tes Koneksi AI Engine'}
                  </button>
                </div>

                {/* Test Result Inspector Banner */}
                {aiTestResult && (
                  <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                    aiTestResult.success 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Status Koneksi AI: {aiTestResult.success ? 'TERHUBUNG (OK)' : 'GAGAL'}
                      </span>
                      {aiTestResult.latencyMs > 0 && (
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-black/40">
                          {aiTestResult.latencyMs} ms
                        </span>
                      )}
                    </div>
                    <p className="text-[#c8c5d3] leading-relaxed">{aiTestResult.message}</p>
                  </div>
                )}

                {/* Section 1: Provider Selection */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider text-[10px] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-[#ccff00]" /> Pilih AI Engine Provider
                    </span>
                    <span className="text-[10px] text-[#ccff00] font-mono flex items-center gap-1.5">
                      {aiState.provider === 'gemini' ? <><GoogleGeminiIcon className="w-3 h-3" /> Google Gemini 2.5</> :
                       aiState.provider === 'openai' ? <><OpenAIIcon className="w-3 h-3" /> OpenAI GPT-4o</> :
                       aiState.provider === 'anthropic' ? <><AnthropicIcon className="w-3 h-3" /> Anthropic Claude</> :
                       aiState.provider === 'deepseek' ? <><DeepSeekIcon className="w-3 h-3" /> DeepSeek R1/V3</> :
                       aiState.provider === 'groq' ? <><Zap className="w-3 h-3" /> Groq LPU</> : <><Plug className="w-3 h-3" /> Custom API</>}
                    </span>
                  </h4>

                  <div className="bg-[#111018] p-1.5 rounded-2xl border border-[#1b1926] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <button
                      type="button"
                      onClick={() => handleProviderChange('gemini')}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                        aiState.provider === 'gemini'
                          ? 'bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/20 font-extrabold'
                          : 'text-[#9f9bac] hover:text-white hover:bg-[#1b1926]'
                      }`}
                    >
                      <GoogleGeminiIcon className="w-4 h-4" /> Google Gemini
                    </button>

                    <button
                      type="button"
                      onClick={() => handleProviderChange('openai')}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                        aiState.provider === 'openai'
                          ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-400/20 font-extrabold'
                          : 'text-[#9f9bac] hover:text-white hover:bg-[#1b1926]'
                      }`}
                    >
                      <OpenAIIcon className="w-4 h-4" /> OpenAI
                    </button>

                    <button
                      type="button"
                      onClick={() => handleProviderChange('anthropic')}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                        aiState.provider === 'anthropic'
                          ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20 font-extrabold'
                          : 'text-[#9f9bac] hover:text-white hover:bg-[#1b1926]'
                      }`}
                    >
                      <AnthropicIcon className="w-4 h-4" /> Claude
                    </button>

                    <button
                      type="button"
                      onClick={() => handleProviderChange('deepseek')}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                        aiState.provider === 'deepseek'
                          ? 'bg-purple-400 text-black shadow-lg shadow-purple-400/20 font-extrabold'
                          : 'text-[#9f9bac] hover:text-white hover:bg-[#1b1926]'
                      }`}
                    >
                      <DeepSeekIcon className="w-4 h-4" /> DeepSeek
                    </button>

                    <button
                      type="button"
                      onClick={() => handleProviderChange('groq')}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                        aiState.provider === 'groq'
                          ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20 font-extrabold'
                          : 'text-[#9f9bac] hover:text-white hover:bg-[#1b1926]'
                      }`}
                    >
                      <Zap className="w-4 h-4" /> Groq
                    </button>

                    <button
                      type="button"
                      onClick={() => handleProviderChange('custom_openai')}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                        aiState.provider === 'custom_openai'
                          ? 'bg-sky-400 text-black shadow-lg shadow-sky-400/20 font-extrabold'
                          : 'text-[#9f9bac] hover:text-white hover:bg-[#1b1926]'
                      }`}
                    >
                      <Plug className="w-4 h-4" /> Custom / Ollama
                    </button>
                  </div>
                </div>

                {/* Section 2: Model & Endpoint Details */}
                <div className="space-y-4 pt-4 border-t border-[#1b1926]">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#ccff00]" /> 2. Model & Endpoint Provider
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Model Dropdown or Custom Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white block">Pilih Model AI</label>
                      {aiState.provider === 'gemini' && (
                        <select
                          value={aiState.aiModel}
                          onChange={(e) => setAiState({ ...aiState, aiModel: e.target.value })}
                          className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 text-xs font-medium cursor-pointer"
                        >
                          <option value="gemini-2.5-flash">Gemini 3.6 Flash — Cepat & Efisien (Rekomendasi Utama)</option>
                          <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro — Penalaran Kuantitatif Kompleks</option>
                          <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite — Mode Kecepatan Tinggi</option>
                        </select>
                      )}

                      {aiState.provider === 'openai' && (
                        <select
                          value={aiState.aiModel}
                          onChange={(e) => setAiState({ ...aiState, aiModel: e.target.value })}
                          className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400/40 text-xs font-medium cursor-pointer"
                        >
                          <option value="gpt-4o-mini">GPT-4o Mini — Cepat & Hemat Token (Standar)</option>
                          <option value="gpt-4o">GPT-4o — Flagship Multimodal Intelligence</option>
                          <option value="o3-mini">o3-mini — Special Reasoning Model</option>
                          <option value="gpt-4-turbo">GPT-4 Turbo — Legacy High Performance</option>
                        </select>
                      )}

                      {aiState.provider === 'anthropic' && (
                        <select
                          value={aiState.aiModel}
                          onChange={(e) => setAiState({ ...aiState, aiModel: e.target.value })}
                          className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400/40 text-xs font-medium cursor-pointer"
                        >
                          <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet — Presisi Laporan Keuangan</option>
                          <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku — Super Cepat & Ringkas</option>
                          <option value="claude-3-opus-20240229">Claude 3 Opus — Penalaran Sangat Mendalam</option>
                        </select>
                      )}

                      {aiState.provider === 'deepseek' && (
                        <select
                          value={aiState.aiModel}
                          onChange={(e) => setAiState({ ...aiState, aiModel: e.target.value })}
                          className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400/40 text-xs font-medium cursor-pointer"
                        >
                          <option value="deepseek-chat">DeepSeek-V3 (deepseek-chat) — General Analysis</option>
                          <option value="deepseek-reasoner">DeepSeek-R1 (deepseek-reasoner) — Chain-of-Thought Reasoning</option>
                        </select>
                      )}

                      {aiState.provider === 'groq' && (
                        <select
                          value={aiState.aiModel}
                          onChange={(e) => setAiState({ ...aiState, aiModel: e.target.value })}
                          className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/40 text-xs font-medium cursor-pointer"
                        >
                          <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile — High Quality Inference</option>
                          <option value="deepseek-r1-distill-llama-70b">DeepSeek R1 Distill Llama 70B — Deep Math/Logic</option>
                          <option value="mixtral-8x7b-32768">Mixtral 8x7B (32k Context)</option>
                        </select>
                      )}

                      {aiState.provider === 'custom_openai' && (
                        <input
                          type="text"
                          value={aiState.aiModel}
                          onChange={(e) => setAiState({ ...aiState, aiModel: e.target.value })}
                          placeholder="misal: llama3, qwen2.5-coder, mistral-small, gpt-4o-custom"
                          className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-400/40 text-xs font-medium"
                        />
                      )}
                    </div>

                    {/* Custom Base URL Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white flex items-center justify-between">
                        <span>Base URL Endpoint (Opsional / Custom)</span>
                        {aiState.provider === 'custom_openai' && <span className="text-[10px] text-sky-400 font-mono">Wajib diisi</span>}
                      </label>
                      <input
                        type="text"
                        value={aiState.customBaseUrl || ''}
                        onChange={(e) => setAiState({ ...aiState, customBaseUrl: e.target.value })}
                        placeholder={
                          aiState.provider === 'custom_openai' ? 'http://localhost:11434/v1 atau https://openrouter.ai/api/v1' :
                          aiState.provider === 'openai' ? 'https://api.openai.com/v1 (default)' :
                          aiState.provider === 'deepseek' ? 'https://api.deepseek.com (default)' :
                          aiState.provider === 'groq' ? 'https://api.groq.com/openai/v1 (default)' :
                          'https://api.anthropic.com/v1 (default)'
                        }
                        className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 text-xs font-mono"
                      />
                      <p className="text-[10px] text-[#686477]">
                        Biarkan kosong untuk menggunakan URL standar resmi dari provider.
                      </p>
                    </div>
                  </div>

                  {/* API Key Management Input */}
                  <div className="p-4 rounded-xl bg-[#111018]/60 border border-[#1b1926] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-[#ccff00]" /> Custom API Key ({aiState.provider.toUpperCase()})
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="text-[11px] text-[#9f9bac] hover:text-white flex items-center gap-1 transition-all cursor-pointer"
                      >
                        {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {showApiKey ? 'Sembunyikan' : 'Tampilkan Key'}
                      </button>
                    </div>

                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={aiState.customApiKey || ''}
                      onChange={(e) => setAiState({ ...aiState, customApiKey: e.target.value })}
                      placeholder={
                        aiState.provider === 'gemini' ? 'Biarkan kosong untuk menggunakan GEMINI_API_KEY lingkungan server' :
                        `Masukkan API Key ${aiState.provider.toUpperCase()} Anda (misal: sk-...)`
                      }
                      className="w-full bg-[#0b0a10] border border-[#1b1926] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#ccff00]/40 text-xs font-mono"
                    />

                    <div className="flex items-start gap-2 text-[11px] text-[#9f9bac]">
                      <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        {aiState.provider === 'gemini' ? (
                          <>API Key Gemini dikelola dengan aman di server (<code className="text-[#ccff00] font-mono">process.env.GEMINI_API_KEY</code>). Isi input di atas jika ingin menggunakan API key pribadi.</>
                        ) : (
                          <>API Key disimpan aman di server backend dan digunakan khusus untuk proxy request ke <strong className="text-white">{aiState.provider.toUpperCase()}</strong>. Kunci tidak pernah diekspos di client browser.</>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Max Tokens & Temperature */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white block">Maksimal Panjang Respons (Max Tokens)</label>
                      <select
                        value={aiState.maxTokens}
                        onChange={(e) => setAiState({ ...aiState, maxTokens: parseInt(e.target.value) || 2048 })}
                        className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 text-xs font-medium cursor-pointer"
                      >
                        <option value={1024}>1024 Tokens — Ringkas & Cepat</option>
                        <option value={2048}>2048 Tokens — Standar Komprehensif (Default)</option>
                        <option value={4096}>4096 Tokens — Analisis Laporan Keuangan Panjang</option>
                      </select>
                    </div>

                    <div className="space-y-2 p-3 bg-[#111018]/40 border border-[#1b1926] rounded-xl">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-bold text-white flex items-center gap-1.5">
                          <SlidersHorizontal className="w-3.5 h-3.5 text-[#ccff00]" /> Temperature: <span className="text-[#ccff00] font-mono">{aiState.aiTemperature}</span>
                        </label>
                        <span className="text-[10px] font-mono text-[#9f9bac]">
                          {aiState.aiTemperature <= 0.2 ? 'Presisi Ketat' : aiState.aiTemperature <= 0.5 ? 'Seimbang' : 'Kreatif'}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        value={aiState.aiTemperature}
                        onChange={(e) => setAiState({ ...aiState, aiTemperature: parseFloat(e.target.value) || 0.3 })}
                        className="w-full accent-[#ccff00] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Advisor Tone & Features */}
                <div className="space-y-4 pt-4 border-t border-[#1b1926]">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <BrainCircuit className="w-3.5 h-3.5 text-[#ccff00]" /> 3. Gaya Penasihat (Advisor Tone) & Fitur Kecerdasan
                  </h4>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white block">Gaya Analisis AI Advisor</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setAiState({ ...aiState, aiAdvisorTone: 'balanced' })}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          aiState.aiAdvisorTone === 'balanced'
                            ? 'bg-[#ccff00]/15 border-[#ccff00] text-white'
                            : 'bg-[#111018]/40 border-[#1b1926] text-[#9f9bac] hover:border-[#333]'
                        }`}
                      >
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><Scale className="w-3.5 h-3.5 text-[#ccff00]" /> Seimbang</span>
                          {aiState.aiAdvisorTone === 'balanced' && <CheckCircle2 className="w-3.5 h-3.5 text-[#ccff00]" />}
                        </div>
                        <p className="text-[10px] text-[#9f9bac] mt-1">Analisis objektif antara risiko teknikal dan potensi fundamental.</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAiState({ ...aiState, aiAdvisorTone: 'conservative' })}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          aiState.aiAdvisorTone === 'conservative'
                            ? 'bg-emerald-500/15 border-emerald-400 text-white'
                            : 'bg-[#111018]/40 border-[#1b1926] text-[#9f9bac] hover:border-[#333]'
                        }`}
                      >
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Konservatif</span>
                          {aiState.aiAdvisorTone === 'conservative' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        <p className="text-[10px] text-[#9f9bac] mt-1">Mengutamakan pengamanan modal, kriteria likuiditas, dan stop-loss ketat.</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAiState({ ...aiState, aiAdvisorTone: 'growth_momentum' })}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          aiState.aiAdvisorTone === 'growth_momentum'
                            ? 'bg-purple-500/15 border-purple-400 text-white'
                            : 'bg-[#111018]/40 border-[#1b1926] text-[#9f9bac] hover:border-[#333]'
                        }`}
                      >
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><Rocket className="w-3.5 h-3.5 text-purple-400" /> Growth & Momentum</span>
                          {aiState.aiAdvisorTone === 'growth_momentum' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                        </div>
                        <p className="text-[10px] text-[#9f9bac] mt-1">Fokus pada sinyal breakout harga, pertumbuhan ekspansif, dan tren cepat.</p>
                      </button>
                    </div>
                  </div>

                  {/* Feature Checkboxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                    <label className="flex items-center justify-between p-3 rounded-xl bg-[#111018]/40 border border-[#1b1926] cursor-pointer hover:border-[#ccff00]/30 transition-all">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white block">Search Grounding / Web Verification</span>
                        <span className="text-[10px] text-[#686477] block">Verifikasi berita & fakta langsung melalui pencarian web live.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={aiState.enableSearchGrounding}
                        onChange={(e) => setAiState({ ...aiState, enableSearchGrounding: e.target.checked })}
                        className="accent-[#ccff00]"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-[#111018]/40 border border-[#1b1926] cursor-pointer hover:border-[#ccff00]/30 transition-all">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white block">Sintesis Sentimen Berita Pasar</span>
                        <span className="text-[10px] text-[#686477] block">Otomatisasi pengelompokan berita IHSG di halaman Market News.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={aiState.autoNewsSentiment}
                        onChange={(e) => setAiState({ ...aiState, autoNewsSentiment: e.target.checked })}
                        className="accent-[#ccff00]"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-[#111018]/40 border border-[#1b1926] cursor-pointer hover:border-[#ccff00]/30 transition-all sm:col-span-2">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white block">Penalaran Naratif Skor Emiten</span>
                        <span className="text-[10px] text-[#686477] block">Tampilkan paragraf ringkasan AI alasan pemberian skor saham pada Ticker Detail.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={aiState.stockScoringReasoning}
                        onChange={(e) => setAiState({ ...aiState, stockScoringReasoning: e.target.checked })}
                        className="accent-[#ccff00]"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

          </form>
        </div>

        {/* Sidebar Status & Guidance Info Cards */}
        {showSidebar && (
          <div className="lg:col-span-4 space-y-4 sticky top-20 self-start transition-all duration-300">
            
            {/* Quick Save Sidebar Banner */}
            <div className="card card-elevated bg-[#0b0a10]/80 border border-[#1b1926] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#ccff00] uppercase tracking-wider">Aksi Cepat</span>
                <button
                  type="button"
                  onClick={toggleSidebar}
                  title="Sembunyikan Sidebar"
                  className="p-1 rounded-md text-[#9f9bac] hover:text-white hover:bg-[#1b1926] transition-all cursor-pointer"
                >
                  <PanelRightClose className="w-3.5 h-3.5" />
                </button>
              </div>
              <h4 className="text-xs font-bold text-white leading-tight">Simpan Perubahan Pengaturan</h4>
              <p className="text-[10px] text-[#9f9bac]">
                Simpan seluruh konfigurasi Portfolio, Notifikasi, Sistem Global, dan AI Engine sekaligus.
              </p>
              <button
                onClick={(e) => handleSaveAll(e as any)}
                type="button"
                className="w-full py-2.5 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#ccff00]/10 transition-all active:scale-98"
              >
                <Save className="w-4 h-4 stroke-[2.5px]" /> Simpan Semua
              </button>
            </div>

            {/* Active Integration Status */}
            <div className="card card-elevated bg-[#0b0a10]/45 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1b1926] pb-2.5">
                <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#ccff00]" /> Status Integrasi
                </h4>
                <span className="text-[10px] font-mono text-[#ccff00] px-1.5 py-0.5 rounded bg-[#ccff00]/10 border border-[#ccff00]/20 font-bold">
                  LIVE
                </span>
              </div>
              
              <div className="space-y-2 text-xs">
                {/* WA */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#111018]/60 border border-[#1b1926]">
                  <div className="flex items-center gap-1.5 truncate mr-1">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-white font-bold text-[11px] truncate">WhatsApp Push</span>
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${notifState.whatsappEnabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#1b1926] text-[#686477]'}`}>
                    {notifState.whatsappEnabled ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#111018]/60 border border-[#1b1926]">
                  <div className="flex items-center gap-1.5 truncate mr-1">
                    <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="text-white font-bold text-[11px] truncate">Email Alert</span>
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${notifState.emailEnabled ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-[#1b1926] text-[#686477]'}`}>
                    {notifState.emailEnabled ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </div>

                {/* Telegram */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#111018]/60 border border-[#1b1926]">
                  <div className="flex items-center gap-1.5 truncate mr-1">
                    <Send className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="text-white font-bold text-[11px] truncate">Telegram Bot</span>
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${notifState.telegramEnabled ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-[#1b1926] text-[#686477]'}`}>
                    {notifState.telegramEnabled ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </div>

                {/* Discord */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#111018]/60 border border-[#1b1926]">
                  <div className="flex items-center gap-1.5 truncate mr-1">
                    <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="text-white font-bold text-[11px] truncate">Discord Webhook</span>
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${notifState.discordEnabled ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-[#1b1926] text-[#686477]'}`}>
                    {notifState.discordEnabled ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </div>

                {/* Webhook */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#111018]/60 border border-[#1b1926]">
                  <div className="flex items-center gap-1.5 truncate mr-1">
                    <Radio className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="text-white font-bold text-[11px] truncate">Custom Webhook</span>
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${notifState.webhookEnabled ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-[#1b1926] text-[#686477]'}`}>
                    {notifState.webhookEnabled ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </div>

                {/* Yahoo */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#111018]/60 border border-[#1b1926]">
                  <div className="flex items-center gap-1.5 truncate mr-1">
                    <Radio className="w-3.5 h-3.5 text-[#ccff00] shrink-0" />
                    <span className="text-white font-bold text-[11px] truncate">Yahoo Sync</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20">
                    {sysState.autoSyncInterval}
                  </span>
                </div>

                {/* AI Engine */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#111018]/60 border border-[#1b1926]">
                  <div className="flex items-center gap-1.5 truncate mr-1">
                    <Bot className="w-3.5 h-3.5 text-[#ccff00] shrink-0" />
                    <span className="text-white font-bold text-[11px] truncate">AI Engine</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20 max-w-[90px] truncate">
                    {aiState.provider.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Formula Allocation Guide Card */}
            <div className="card card-elevated bg-[#0b0a10]/45 p-5 space-y-3">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsGuideOpen(!isGuideOpen)}
              >
                <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#ccff00]" /> Aturan Pembobotan
                </h4>
                <button type="button" className="text-[#9f9bac] hover:text-white">
                  {isGuideOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
              {isGuideOpen && (
                <p className="text-[11px] text-[#9f9bac] leading-relaxed font-sans pt-2 border-t border-[#1b1926]">
                  Model SafeHeaven menggunakan <strong className="text-white">formula alokasi dinamis</strong>. Porsi saham, emas, dan kas beradaptasi secara otomatis mengikuti sinyal Crash Shield dan fluktuasi skor kuantitatif.
                </p>
              )}
            </div>

          </div>
        )}
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
