/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useAppStore } from './stores';
import { NotificationCenter } from './components/NotificationCenter';
import { ChatFAB } from './components/ChatFAB';
import { JumpToTopFAB } from './components/JumpToTopFAB';
import { GlobalSearch } from './components/GlobalSearch';
import { SafeHavenLogo } from './components/SafeHavenLogo';
import { 
  LayoutDashboard, 
  Wallet, 
  Columns, 
  History, 
  Cpu, 
  Sliders, 
  BarChart2, 
  Layers, 
  Shield, 
  Bell, 
  Settings, 
  LogOut, 
  LogIn,
  Menu, 
  X,
  User,
  ChevronLeft,
  ChevronRight,
  Search,
  Activity,
  LineChart,
  Newspaper,
  Globe,
  Bot,
  Lock,
  Crown,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { GoogleIcon, GmailIcon } from './components/AppLogos';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useLocation();
  const { user, isDemoMode, loginDemoUser, logout } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isCollapsed = isSidebarCollapsed && !isHovered;
  const isRegisteredUser = !!user && !isDemoMode && user?.email !== 'demo@safehaven.id';
  const isAuth = !!user;
  const isPremium = isRegisteredUser && (user?.isPremium || user?.tier === 'Platinum' || user?.role === 'admin');

  const handleLogout = () => {
    logout();
    toast.info('Sesi Anda telah diakhiri.');
    setLocation('/landing');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Nav menus structure grouped by category with public/premium permissions
  const menuGroups = [
    {
      category: 'HOME',
      items: [
        { name: 'Market Cockpit', path: '/', icon: LayoutDashboard, isPublic: true },
        { name: 'IHSG Chart', path: '/full-chart/IHSG', icon: LineChart, isPublic: true },
      ]
    },
    {
      category: 'ANALYSIS',
      items: [
        { name: 'Market Analytics', path: '/analytics', icon: BarChart2, isPublic: true },
        { name: 'Stock Analysis', path: '/stock-analysis', icon: Activity, isPublic: true },
        { name: 'Market News', path: '/news', icon: Newspaper, isPublic: true },
        { name: 'Universe Builder', path: '/universe', icon: Layers, isPublic: false },
        { name: 'Strategy Builder', path: '/strategies', icon: Sliders, isPublic: false },
      ]
    },
    {
      category: 'PORTFOLIO',
      items: [
        { name: 'Portfolio', path: '/portfolio', icon: Wallet, isPublic: false },
        { name: 'Portfolio Compare', path: '/compare', icon: Columns, isPublic: false },
      ]
    },
    {
      category: 'QUANT LAB',
      items: [
        { name: 'Backtest', path: '/backtest', icon: History, isPublic: false, isPremiumOnly: true },
        { name: 'Walk Forward', path: '/optimize', icon: Cpu, isPublic: false, isPremiumOnly: true },
      ]
    },
    {
      category: 'ALERTS',
      items: [
        { name: 'Alerts', path: '/alerts', icon: Bell, isPublic: false },
      ]
    },
    {
      category: 'SYSTEM',
      items: [
        { name: 'AI Manager', path: '/ai', icon: Bot, isPublic: false },
        { name: 'Settings', path: '/settings', icon: Settings, isPublic: false },
        { name: 'Admin Console', path: '/admin', icon: Shield, isPublic: false },
      ]
    }
  ];

  // Helper to resolve current path name for the Header title
  const getCurrentHeaderTitle = () => {
    if (location === '/' || location === '/dashboard') return 'Market Cockpit';
    if (location === '/admin') return 'Admin Operations & Mission Control';
    if (location === '/risk') return 'Risk Control & Protection';
    if (location.startsWith('/ticker/')) {
      const parts = location.split('/');
      return `Analisis Ticker: ${parts[parts.length - 1].toUpperCase()}`;
    }
    if (location.startsWith('/full-chart/')) {
      const parts = location.split('/');
      return `Full Chart: ${parts[parts.length - 1].toUpperCase()}`;
    }
    for (const group of menuGroups) {
      const matching = group.items.find(m => m.path === location);
      if (matching) return matching.name;
    }
    return 'SafeHaven System';
  };

  return (
    <div id="safeheaven-workspace" className="min-h-screen bg-[#060509] text-white flex font-sans selection:bg-[#ccff00] selection:text-black">
      
      {/* 1. DESKTOP SIDEBAR PANEL */}
      <aside 
        id="sidebar-desktop" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden lg:flex flex-col border-r border-[#1b1926] bg-[#0a090f] shrink-0 fixed top-0 bottom-0 left-0 z-30 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[72px]' : 'w-60'}`}
      >
        {/* Brand Header */}
        <div className={`h-14 border-b border-[#1b1926] flex items-center gap-2.5 transition-all duration-300 ${isCollapsed ? 'px-0 justify-center' : 'px-5'}`}>
          <Link href="/landing" className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
              <SafeHavenLogo className="w-7 h-7 drop-shadow-[0_0_8px_rgba(244,184,71,0.4)]" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 animate-[fadeIn_0.2s_ease-out]">
                <h1 className="text-base font-extrabold tracking-tight text-white leading-none font-sans truncate">
                  SafeHaven<span className="text-[#F4B847]">.</span>
                </h1>
                <span className="text-[9px] text-[#686477] block font-mono tracking-wider font-bold truncate">FINANCE COCKPIT</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation items list */}
        <nav className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
          {menuGroups.map((group) => (
            <div key={group.category} className="space-y-1">
              <div className={`px-3 mb-2 flex items-center justify-between ${isCollapsed ? 'justify-center' : ''}`}>
                {isCollapsed ? (
                  <span className="h-[1px] w-4 bg-[#1b1926]/40"></span>
                ) : (
                  <>
                    <span className="text-[10px] font-extrabold text-[#686477] tracking-widest font-mono uppercase">
                      {group.category}
                    </span>
                    <span className="h-[1px] flex-1 bg-[#1b1926]/40 ml-2"></span>
                  </>
                )}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location === item.path;
                  const Icon = item.icon;
                  return (
                    <Link 
                      key={item.path} 
                      href={item.path}
                      id={`nav-link-${item.path.replace('/', 'home')}`}
                      title={isCollapsed ? `${item.name}${item.isPremiumOnly ? ' (PRO)' : !item.isPublic && !isRegisteredUser ? ' (Login Needed)' : ''}` : undefined}
                      className={`flex items-center gap-3 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                        isCollapsed ? 'px-0 justify-center w-10 mx-auto' : 'px-3'
                      } ${
                        isActive 
                          ? 'bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00]' 
                          : 'border border-transparent text-[#9f9bac] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#ccff00]' : 'text-[#686477] group-hover:text-white transition-colors'}`} />
                      {!isCollapsed && (
                        <>
                          <span className="truncate flex-1 animate-[fadeIn_0.2s_ease-out]">{item.name}</span>
                          {item.isPremiumOnly ? (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 shrink-0 flex items-center gap-1">
                              {!isRegisteredUser && <Lock className="w-2.5 h-2.5 text-[#ccff00]" />}
                              PRO
                            </span>
                          ) : !item.isPublic && !isRegisteredUser ? (
                            <Lock className="w-3.5 h-3.5 text-[#686477] group-hover:text-[#ccff00] transition-colors shrink-0" />
                          ) : null}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer User Card */}
        {user ? (
          <div className={`p-4 border-t border-[#1b1926] bg-[#111018]/45 flex items-center justify-between gap-2 text-xs transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}>
            {isCollapsed ? (
              <div 
                className="w-8 h-8 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/25 flex items-center justify-center text-[#ccff00] font-bold font-mono cursor-pointer shrink-0 hover:border-[#ff3366]/40 transition-colors relative"
                onClick={handleLogout}
                title={`Keluar (${user.name})`}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
                
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/25 flex items-center justify-center text-[#ccff00] shrink-0 font-bold font-mono relative">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                    
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate flex items-center gap-1">
                      <span>{user.name}</span>
                    </p>
                    
                  </div>
                </div>
                <button
                  id="desktop-logout-btn"
                  onClick={handleLogout}
                  className="text-[#686477] hover:text-[#ff3366] p-1.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className={`p-3 border-t border-[#1b1926] bg-[#111018]/45 text-xs ${isCollapsed ? 'text-center' : ''}`}>
            {!isCollapsed ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#686477] font-mono font-bold uppercase">Akses Tamu (Public)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setLocation('/login')}
                    className="flex-1 bg-[#ccff00] hover:bg-[#ddff33] text-black font-extrabold text-[11px] py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-1"
                  >
                    <LogIn className="w-3 h-3" />
                    <span>Masuk</span>
                  </button>
                  <button
                    onClick={() => loginDemoUser(false)}
                    className="flex-1 bg-[#171522] hover:bg-[#201d2f] border border-[#2d2943] text-white font-bold text-[11px] py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-1"
                  >
                    <UserCheck className="w-3 h-3 text-[#ccff00]" />
                    <span>Demo</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setLocation('/login')}
                className="w-8 h-8 mx-auto rounded-full bg-[#111018] border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] cursor-pointer"
                title="Masuk / Login"
              >
                <LogIn className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </aside>

      {/* 2. MAIN APPLICATION CONTENT PORT */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-60'}`}>
        
        {/* TOP HEADER BAR */}
        <header 
          id="top-header-panel" 
          className="h-14 border-b border-[#1b1926] bg-[#0a090f]/80 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20"
        >
          {/* Mobile menu, Desktop Sidebar Toggle and Title */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 text-[#9f9bac] hover:text-white hover:bg-white/5 rounded-xl cursor-pointer shrink-0"
            >
              <Menu className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </button>

            {/* Desktop Sidebar collapse/expand button */}
            <button
              id="desktop-sidebar-collapse-toggle-btn"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex p-1.5 text-[#9f9bac] hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition-colors shrink-0"
              title={isSidebarCollapsed ? "Tampilkan Sidebar (Expand)" : "Sembunyikan Sidebar (Collapse)"}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-4.5 h-4.5 text-[#ccff00]" />
              ) : (
                <ChevronLeft className="w-4.5 h-4.5 text-[#686477] hover:text-[#ccff00] transition-colors" />
              )}
            </button>

            <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight font-sans truncate max-w-[140px] sm:max-w-xs md:max-w-md lg:max-w-lg">
              {getCurrentHeaderTitle()}
            </h2>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 sm:p-2 text-[#686477] hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition-colors shrink-0"
              title="Cari (Ctrl+K)"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
            {/* Real-time triggering Notification dropdown widget */}
            <NotificationCenter />

            {/* Header User Actions */}
            {isAuth ? (
              <div className="hidden sm:flex items-center gap-2 pl-2 sm:pl-3 border-l border-[#1b1926] shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#111018] border-2 border-[#ccff00]/40 flex items-center justify-center text-[#ccff00] relative shrink-0">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="font-bold text-xs font-sans text-white">{user ? user.name.charAt(0).toUpperCase() : 'D'}</span>
                  )}
                  
                </div>
                <div className="text-left hidden md:block max-w-[120px] lg:max-w-[160px]">
                  <p className="text-[10px] font-bold text-white leading-tight font-sans truncate">{user ? user.name : 'Demo User'}</p>
                  
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-[#1b1926] shrink-0">
                <Link
                  href="/landing"
                  className="hidden md:inline-flex items-center gap-1 text-xs text-[#9f9bac] hover:text-white px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Landing Page</span>
                </Link>
                <button
                  onClick={() => loginDemoUser(false)}
                  className="hidden sm:inline-flex items-center gap-1 bg-[#171522] hover:bg-[#201d2f] border border-[#2d2943] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#ccff00]" />
                  <span>Coba Demo</span>
                </button>
                <Link
                  href="/login"
                  className="bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold px-3.5 py-1.5 rounded-lg transition-all shadow-md shadow-[#ccff00]/10 flex items-center gap-1 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk</span>
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* MIDDLE VIEW CONTENT SCROLLPORT */}
        <main className="flex-1 py-6 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* 3. MOBILE RESPONSIVE SLIDEBAR DRAWER */}
      <div 
        id="mobile-sidebar-drawer" 
        className={`fixed inset-0 z-50 lg:hidden flex transition-all duration-300 ${isMobileMenuOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div 
          onClick={() => setIsMobileMenuOpen(false)} 
          className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
        ></div>

        {/* Drawer Body */}
        <aside 
          className={`w-64 bg-[#0a090f] border-r border-[#1b1926] h-full flex flex-col relative z-10 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Drawer Header */}
          <div className="h-14 px-5 border-b border-[#1b1926] flex items-center justify-between">
              <Link href="/landing" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 cursor-pointer">
                <div className="w-7 h-7 flex items-center justify-center">
                  <SafeHavenLogo className="w-6 h-6 drop-shadow-[0_0_6px_rgba(244,184,71,0.4)]" />
                </div>
                <h1 className="text-sm font-bold tracking-tight text-white leading-none">SafeHaven<span className="text-[#F4B847]">.</span></h1>
              </Link>
              <button
                id="mobile-sidebar-close-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#9f9bac] hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Drawer Nav links */}
            <nav className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
              {menuGroups.map((group) => (
                <div key={group.category} className="space-y-1">
                  <div className="px-3 mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-[#686477] tracking-widest font-mono uppercase">
                      {group.category}
                    </span>
                    <span className="h-[1px] flex-1 bg-[#1b1926]/40 ml-2"></span>
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = location === item.path;
                      const Icon = item.icon;
                      return (
                        <Link 
                          key={item.path} 
                          href={item.path}
                          id={`mobile-nav-link-${item.path.replace('/', 'home')}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isActive 
                              ? 'bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00]' 
                              : 'border border-transparent text-[#9f9bac] hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#ccff00]' : 'text-[#686477] group-hover:text-white transition-colors'}`} />
                          <span className="truncate flex-1">{item.name}</span>
                          {item.isPremiumOnly ? (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 shrink-0 flex items-center gap-1">
                              {!isRegisteredUser && <Lock className="w-2.5 h-2.5 text-[#ccff00]" />}
                              PRO
                            </span>
                          ) : !item.isPublic && !isRegisteredUser ? (
                            <Lock className="w-3.5 h-3.5 text-[#686477] group-hover:text-[#ccff00] transition-colors shrink-0" />
                          ) : null}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Drawer Footer User Card */}
            {isAuth ? (
              <div className="p-4 border-t border-[#1b1926] bg-[#111018]/45 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7.5 h-7.5 rounded-full bg-[#ccff00]/10 flex items-center justify-center text-[#ccff00] font-bold font-mono shrink-0 relative">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                    ) : (
                      user ? user.name.charAt(0).toUpperCase() : 'D'
                    )}
                    
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{user ? user.name : 'Demo User'}</p>
                    
                  </div>
                </div>
                <button
                  id="mobile-logout-btn"
                  onClick={handleLogout}
                  className="text-[#686477] hover:text-[#ff3366] cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-4 border-t border-[#1b1926] bg-[#111018]/45 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-[#ccff00] text-black font-extrabold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Akun</span>
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    loginDemoUser(false);
                  }}
                  className="w-full bg-[#171522] text-white font-bold text-xs py-2 rounded-xl border border-[#2d2943] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-[#ccff00]" />
                  <span>Coba Akun Demo</span>
                </button>
              </div>
            )}
          </aside>
        </div>

      {/* 4. FLOATING CHATFAB FOR SERVER-SIDE GEMINI COMPANION ASSISTANT */}
      {!location.startsWith('/ai') && <ChatFAB />}
      <JumpToTopFAB />
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

    </div>
  );
};
