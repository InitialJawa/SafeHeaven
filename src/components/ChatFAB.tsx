/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  MessageSquare, X, Send, Bot, Copy, Check, 
  Trash2, Maximize2, Minimize2, Plus
} from 'lucide-react';
import Markdown from 'react-markdown';
import { useAppStore } from '../stores';

interface AiConfigState {
  provider: string;
  aiModel: string;
  advisorStyle: string;
}

export const ChatFAB: React.FC = () => {
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeConfig, setActiveConfig] = useState<AiConfigState>({
    provider: 'gemini',
    aiModel: 'gemini-2.5-flash',
    advisorStyle: 'Seimbang'
  });

  const { chatMessages, chatLoading, sendChatMessage, clearChatMessages } = useAppStore();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch current active AI engine config on mount & when modal opens
  const fetchActiveAiConfig = async () => {
    try {
      const base = window.location.origin;
      const res = await window.appFetch(`${base}/api/ai/config`);
      if (res.ok) {
        const data = await res.json();
        setActiveConfig({
          provider: data.provider || 'gemini',
          aiModel: data.aiModel || 'gemini-2.5-flash',
          advisorStyle: data.advisorStyle || 'Seimbang'
        });
      }
    } catch (e) {
      console.warn('Failed to fetch active AI config:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchActiveAiConfig();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Auto scroll to latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || chatLoading) return;
    
    const message = input.trim();
    setInput('');
    await sendChatMessage(message);
    fetchActiveAiConfig();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClearAll = () => {
    clearChatMessages();
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleNewChat = () => {
    handleClearAll();
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="ai-chat-root" className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          id="chat-fab-toggle-open"
          onClick={() => setIsOpen(true)}
          className="w-13 h-13 bg-[#ccff00] hover:bg-[#b2e000] text-black rounded-full flex items-center justify-center shadow-xl shadow-[#ccff00]/20 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer border border-[#ccff00]/40 group relative"
          title="Buka Chat AI Assistant"
        >
          <Bot className="w-5 h-5 text-black" />
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#00f5a0] border-2 border-[#0b0a10] rounded-full animate-pulse"></span>
          <span className="absolute right-15 bg-[#111018] border border-[#222030] text-white text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none font-medium">
            SafeHaven AI ({activeConfig.provider.toUpperCase()})
          </span>
        </button>
      )}

      {/* Chat Window Popup */}
      {isOpen && (
        <div 
          id="chat-assistant-window" 
          className={`bg-[#0d0c14] border border-[#222030] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isExpanded 
              ? 'w-[680px] h-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]' 
              : 'w-[390px] h-[520px] max-w-[calc(100vw-2rem)]'
          }`}
        >
          {/* Minimalist Single-Row Header */}
          <div className="bg-[#111018] border-b border-[#222030] px-3.5 py-2.5 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-lg flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-[#ccff00]" />
              </div>
              <span className="text-xs font-bold text-white tracking-tight">SafeHaven AI</span>
              <span className="text-[9px] font-mono font-bold uppercase text-[#ccff00] bg-[#ccff00]/10 border border-[#ccff00]/20 px-1.5 py-0.5 rounded">
                {activeConfig.provider}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f5a0] animate-pulse" title="Terhubung" />
            </div>

            <div className="flex items-center space-x-1">
              <button
                id="ai-chat-new-btn"
                onClick={handleNewChat}
                className="p-1.5 rounded-lg text-[#888899] hover:text-[#ccff00] hover:bg-white/5 transition-colors cursor-pointer flex items-center space-x-1 text-xs"
                title="Chat Baru / New Chat"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                id="ai-chat-clear-btn"
                onClick={handleClearAll}
                title="Hapus Semua Chat"
                className="p-1.5 rounded-lg text-[#888899] hover:text-[#ff4d4d] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setLocation('/ai');
                }}
                title="Buka AI Manager Layar Penuh"
                className="p-1.5 rounded-lg text-[#888899] hover:text-white hover:bg-white/5 transition-colors cursor-pointer hidden sm:block"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                id="chat-fab-toggle-close"
                onClick={() => setIsOpen(false)}
                title="Tutup"
                className="p-1.5 rounded-lg text-[#888899] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Timeline */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#0a0910]">
            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center select-none">
                <div className="w-10 h-10 rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center mb-3">
                  <Bot className="w-5 h-5 text-[#ccff00]" />
                </div>
                <p className="text-xs font-bold text-white mb-1">SafeHaven AI Advisor</p>
                <p className="text-[11px] text-[#888899] max-w-[220px] leading-relaxed">
                  Tanyakan analisis saham IHSG, rekomendasi portfolio, atau simulasi strategi Anda.
                </p>
              </div>
            ) : (
              chatMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                const messageProvider = msg.provider || activeConfig.provider;

                return (
                  <div 
                    key={msg.id} 
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[88%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {!isUser && (
                        <div className="w-6 h-6 rounded-md bg-[#161524] border border-[#2f2d45] flex items-center justify-center shrink-0 mt-0.5 shadow">
                          <Bot className="w-3 h-3 text-[#ccff00]" />
                        </div>
                      )}

                      <div className="group relative">
                        <div className={`rounded-xl px-3.5 py-2.5 text-xs font-sans ${
                          isUser 
                            ? 'bg-[#ccff00] text-black font-semibold rounded-tr-none shadow-md' 
                            : 'bg-[#13121c] text-white border border-[#222030] rounded-tl-none leading-relaxed shadow-lg'
                        }`}>
                          {isUser ? (
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          ) : (
                            <div className="prose prose-invert prose-xs text-xs space-y-1.5 max-w-none [&>p]:m-0 [&>p]:leading-relaxed [&>ul]:my-1 [&>ul]:pl-3.5 [&>ul]:list-disc [&>ol]:my-1 [&>ol]:pl-3.5 [&>ol]:list-decimal [&>strong]:text-[#ccff00] [&>strong]:font-bold [&>table]:w-full [&>table]:my-1.5 [&>table]:border-collapse [&>th]:border [&>th]:border-[#222030] [&>th]:px-2 [&>th]:py-0.5 [&>th]:bg-[#1a1829] [&>td]:border [&>td]:border-[#222030] [&>td]:px-2 [&>td]:py-0.5">
                              <Markdown>{msg.text}</Markdown>
                            </div>
                          )}

                          <div className={`flex items-center justify-between text-[9px] mt-1.5 pt-1 border-t ${
                            isUser ? 'border-black/10 text-black/60' : 'border-[#222030] text-[#71718a]'
                          }`}>
                            {!isUser && (
                              <span className="uppercase font-mono font-medium text-[#8888aa]">
                                {messageProvider}
                              </span>
                            )}
                            <span className={isUser ? 'ml-auto' : ''}>{msg.timestamp}</span>
                          </div>
                        </div>

                        {/* Copy response action for AI */}
                        {!isUser && (
                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.text)}
                            className="absolute -bottom-2 right-1.5 bg-[#1a1926] border border-[#2f2d45] text-[#a0a0b0] hover:text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all flex items-center space-x-1 cursor-pointer"
                            title="Salin Teks"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-2.5 h-2.5 text-[#00f5a0]" />
                            ) : (
                              <Copy className="w-2.5 h-2.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Loading Indicator */}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[85%]">
                  <div className="w-6 h-6 rounded-md bg-[#161524] border border-[#2f2d45] flex items-center justify-center shrink-0">
                    <Bot className="w-3 h-3 text-[#ccff00] animate-pulse" />
                  </div>
                  <div className="bg-[#13121c] border border-[#222030] rounded-xl rounded-tl-none px-3.5 py-2 text-xs text-[#a0a0b0]">
                    <span className="text-white font-medium text-[11px]">Memproses jawaban...</span>
                    <div className="flex items-center space-x-1 mt-1.5">
                      <div className="w-1.5 h-1.5 bg-[#ccff00] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-[#ccff00] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-[#ccff00] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Minimal Form Input */}
          <form 
            onSubmit={handleSubmit} 
            className="p-2.5 bg-[#111018] border-t border-[#222030] flex items-center space-x-2"
          >
            <textarea
              ref={inputRef}
              id="ai-chat-input-field"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Tanya ${activeConfig.provider.toUpperCase()}... (Enter untuk kirim)`}
              className="flex-1 bg-[#0a0910] border border-[#222030] rounded-xl px-3 py-2 text-xs text-white placeholder-[#686880] focus:outline-none focus:border-[#ccff00] resize-none max-h-20 min-h-[36px] leading-relaxed"
              disabled={chatLoading}
            />

            <button
              id="ai-chat-send-btn"
              type="submit"
              disabled={!input.trim() || chatLoading}
              className="w-8 h-8 bg-[#ccff00] hover:bg-[#b2e000] disabled:bg-[#1a1926] disabled:text-[#4b5563] text-black rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 font-bold"
              title="Kirim Pesan"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
