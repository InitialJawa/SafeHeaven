/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, MailOpen } from 'lucide-react';
import { useAppStore } from '../stores';

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { alerts, fetchInitialData } = useAppStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadAlerts = alerts.filter((a) => a.status === 'unread');
  const count = unreadAlerts.length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    // Optimistically clear local status
    useAppStore.setState((state) => ({
      alerts: state.alerts.map((a) => ({ ...a, status: 'read' as const }))
    }));
  };

  const markOneAsRead = (id: string) => {
    useAppStore.setState((state) => ({
      alerts: state.alerts.map((a) => a.id === id ? { ...a, status: 'read' as const } : a)
    }));
  };

  return (
    <div id="notification-center-root" className="relative" ref={dropdownRef}>
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#a0a0a0] hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#f23645] text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-[#000]">
            {count}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          id="notification-dropdown-box" 
          className="absolute right-0 mt-2 w-80 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl shadow-2xl overflow-hidden z-50 animate-[slideUp_0.15s_ease-out]"
        >
          <div className="px-4 py-3 bg-[#111111] border-b border-[#1f1f1f] flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Notifikasi Aktif ({count})</span>
            {count > 0 && (
              <button
                id="mark-all-read-btn"
                onClick={markAllAsRead}
                className="text-[10px] text-[#00c9a5] hover:text-[#00a87e] flex items-center gap-1 font-medium cursor-pointer"
              >
                <Check className="w-3 h-3" /> Tandai semua dibaca
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-[#1f1f1f]">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#6b7280]">
                Belum ada notifikasi baru
              </div>
            ) : (
              alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3.5 text-left transition-colors relative flex items-start gap-2.5 ${alert.status === 'unread' ? 'bg-[#111111]' : 'hover:bg-white/[0.02]'}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${alert.status === 'unread' ? 'bg-[#00c9a5]' : 'bg-[#4b5563]'}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white leading-normal pr-4">{alert.message}</p>
                    <span className="text-[9px] text-[#6b7280] font-mono mt-1 block">
                      {new Date(alert.time).toLocaleTimeString('id-ID')} - {alert.type}
                    </span>
                  </div>
                  {alert.status === 'unread' && (
                    <button
                      id={`mark-read-${alert.id}`}
                      onClick={() => markOneAsRead(alert.id)}
                      title="Tandai dibaca"
                      className="absolute right-3 top-3 text-[#6b7280] hover:text-[#00c9a5] cursor-pointer"
                    >
                      <MailOpen className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2 bg-[#111111] border-t border-[#1f1f1f] text-center">
            <span className="text-[10px] text-[#6b7280]">SafeHeaven Alert Systems v1.0</span>
          </div>
        </div>
      )}
    </div>
  );
};
