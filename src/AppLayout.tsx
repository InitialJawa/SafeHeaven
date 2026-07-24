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
import { AnimatedTierCard } from './components/AnimatedTierCard';
import { GlobalSearch } from './components/GlobalSearch';
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
  Terminal, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X,
  User,
  ChevronLeft,
  ChevronRight,
  Search,
  Activity,
  Newspaper
} from 'lucide-react';
import { toast } from 'sonner';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isCollapsed = isSidebarCollapsed && !isHovered;

  const handleLogout = () => {
    logout();
    toast.info('Sesi Anda telah diakhiri.');
    setLocation('/login');
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

  // Nav menus structure grouped by category
  const menuGroups = [
    {
      category: 'HOME',
      items: [
        { name: 'Market Cockpit', path: '/', icon: LayoutDashboard },
      ]
    },
    {
      category: 'ANALYSIS',
      items: [
        { name: 'Market Analytics', path: '/analytics', icon: BarChart2 },
        { name: 'Stock Analysis', path: '/stock-analysis', icon: Activity },
        { name: 'Market News', path: '/news', icon: Newspaper },
        { name: 'Universe Builder', path: '/universe', icon: Layers },
        { name: 'Strategy Builder', path: '/strategies', icon: Sliders },
      ]
    },
    {
      category: 'PORTFOLIO',
      items: [
        { name: 'Portfolio', path: '/portfolio', icon: Wallet },
        { name: 'Portfolio Compare', path: '/compare', icon: Columns },
      ]
    },
    {
      category: 'QUANT LAB',
      items: [
        { name: 'Backtest', path: '/backtest', icon: History },
        { name: 'Walk Forward', path: '/optimize', icon: Cpu },
      ]
    },
    {
      category: 'RISK',
      items: [
        { name: 'Risk Control', path: '/risk', icon: Shield },
        { name: 'Alerts', path: '/alerts', icon: Bell },
      ]
    },
    {
      category: 'SYSTEM',
      items: [
        { name: 'Admin Console', path: '/admin', icon: Terminal },
        { name: 'Settings', path: '/settings', icon: Settings },
      ]
    }
  ];

  // Helper to resolve current path name for the Header title
  const getCurrentHeaderTitle = () => {
    if (location === '/') return 'Market Cockpit';
    if (location.startsWith('/ticker/')) {
      const parts = location.split('/');
      return `Analisis Ticker: ${parts[parts.length - 1].toUpperCase()}`;
    }
    for (const group of menuGroups) {
      const matching = group.items.find(m => m.path === location);
      if (matching) return matching.name;
    }
    return 'SafeHeaven System';
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
          <div className="w-8 h-8 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-lg flex items-center justify-center text-[#ccff00] shrink-0">
            <ShieldCheck className="w-4.5 h-4.5 glow-text-lime" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 animate-[fadeIn_0.2s_ease-out]">
              <h1 className="text-base font-extrabold tracking-tight text-white leading-none font-sans truncate">
                SafeHaven<span className="text-[#ccff00]">.</span>
              </h1>
              <span className="text-[9px] text-[#686477] block font-mono tracking-wider font-bold truncate">FINANCE COCKPIT</span>
            </div>
          )}
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
                      title={isCollapsed ? item.name : undefined}
                      className={`flex items-center gap-3 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                        isCollapsed ? 'px-0 justify-center w-10 mx-auto' : 'px-3'
                      } ${
                        isActive 
                          ? 'bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00]' 
                          : 'border border-transparent text-[#9f9bac] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#ccff00]' : 'text-[#686477] group-hover:text-white transition-colors'}`} />
                      {!isCollapsed && <span className="truncate animate-[fadeIn_0.2s_ease-out]">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>



        {/* Sidebar Footer User Card */}
        {user && (
          <div className={`p-4 border-t border-[#1b1926] bg-[#111018]/45 flex items-center justify-between gap-2 text-xs transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}>
            {isCollapsed ? (
              <div 
                className="w-8 h-8 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/25 flex items-center justify-center text-[#ccff00] font-bold font-mono cursor-pointer shrink-0 hover:border-[#ff3366]/40 transition-colors"
                onClick={handleLogout}
                title={`Keluar (${user.name})`}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/25 flex items-center justify-center text-[#ccff00] shrink-0 font-bold font-mono">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{user.name}</p>
                    <span className="text-[10px] text-[#686477] uppercase font-mono font-bold">{user.role}</span>
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
        )}
      </aside>

      {/* 2. MAIN APPLICATION CONTENT PORT */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-60'}`}>
        
        {/* TOP HEADER BAR */}
        <header 
          id="top-header-panel" 
          className="h-14 border-b border-[#1b1926] bg-[#0a090f]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20"
        >
          {/* Mobile menu, Desktop Sidebar Toggle and Title */}
          <div className="flex items-center gap-2.5">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 text-[#9f9bac] hover:text-white hover:bg-white/5 rounded-xl cursor-pointer"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>

            {/* Desktop Sidebar collapse/expand button */}
            <button
              id="desktop-sidebar-collapse-toggle-btn"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex p-1.5 text-[#9f9bac] hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
              title={isSidebarCollapsed ? "Tampilkan Sidebar (Expand)" : "Sembunyikan Sidebar (Collapse)"}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-4.5 h-4.5 text-[#ccff00]" />
              ) : (
                <ChevronLeft className="w-4.5 h-4.5 text-[#686477] hover:text-[#ccff00] transition-colors" />
              )}
            </button>

            <h2 className="text-sm font-bold text-white tracking-tight font-sans">
              {getCurrentHeaderTitle()}
            </h2>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#686477] hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
              title="Cari (Ctrl+K)"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
            {/* Real-time triggering Notification dropdown widget */}
            <NotificationCenter />

            {/* Micro User Avatar display */}
            {user && (
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#1b1926]">
                <div className="w-8 h-8 rounded-full bg-[#111018] border-2 border-[#ccff00]/40 flex items-center justify-center text-[#ccff00] relative overflow-hidden shrink-0">
                  <span className="font-bold text-xs font-sans text-white">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-white leading-tight font-sans">{user.name}</p>
                  <span className="text-[9px] text-[#686477] font-mono">SafeHeaven Active</span>
                </div>
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
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-lg flex items-center justify-center text-[#ccff00]">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <h1 className="text-sm font-bold tracking-tight text-white leading-none">SafeHeaven<span className="text-[#ccff00]">.</span></h1>
              </div>
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
                          <span className="truncate">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>



            {/* Drawer Footer User Card */}
            {user && (
              <div className="p-4 border-t border-[#1b1926] bg-[#111018]/45 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7.5 h-7.5 rounded-full bg-[#ccff00]/10 flex items-center justify-center text-[#ccff00] font-bold font-mono shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{user.name}</p>
                    <span className="text-[9px] text-[#686477] uppercase font-mono font-bold">{user.role}</span>
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
            )}
          </aside>
        </div>

      {/* 4. FLOATING CHATFAB FOR SERVER-SIDE GEMINI COMPANION ASSISTANT */}
      <ChatFAB />
      <JumpToTopFAB />
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

    </div>
  );
};
