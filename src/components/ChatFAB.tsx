/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { useAppStore } from '../stores';

export const ChatFAB: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { chatMessages, chatLoading, sendChatMessage } = useAppStore();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatLoading) return;
    
    const message = input;
    setInput('');
    await sendChatMessage(message);
  };

  return (
    <div id="ai-chat-root" className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          id="chat-fab-toggle-open"
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[#ccff00] hover:bg-[#b2e000] text-black rounded-full flex items-center justify-center shadow-lg shadow-[#ccff00]/15 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer border border-[#ccff00]/30 group relative"
        >
          <MessageSquare className="w-6 h-6 text-black" />
          <span className="absolute right-16 bg-[#111111] border border-[#1f1f1f] text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none font-sans">
            Tanya SafeHeaven AI
          </span>
        </button>
      )}

      {/* Chat Window Popup */}
      {isOpen && (
        <div 
          id="chat-assistant-window" 
          className="w-96 h-[500px] bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]"
        >
          {/* Header */}
          <div className="bg-[#111111] border-b border-[#1f1f1f] px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-[#ccff00]/10 border border-[#ccff00]/25 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#ccff00]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-tight">SafeHeaven AI</h3>
                <span className="text-[10px] text-[#ccff00] flex items-center">
                  <span className="w-1.5 h-1.5 bg-[#ccff00] rounded-full inline-block mr-1.5 animate-pulse"></span>
                  Model: gemini-3.5-flash
                </span>
              </div>
            </div>
            <button
              id="chat-fab-toggle-close"
              onClick={() => setIsOpen(false)}
              className="text-[#a0a0a0] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Messages Timeline */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div 
                  key={msg.id} 
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-[#111111] border border-[#1f1f1f] flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-[#ccff00]" />
                      </div>
                    )}
                    <div className={`rounded-xl px-3.5 py-2.5 text-xs font-sans ${
                      isUser 
                        ? 'bg-[#ccff00] text-black font-semibold rounded-tr-none' 
                        : 'bg-[#111111] text-white border border-[#1f1f1f] rounded-tl-none leading-relaxed'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <span className={`block text-[9px] mt-1 text-right ${isUser ? 'text-black/70' : 'text-[#6b7280]'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {chatLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[85%]">
                  <div className="w-7 h-7 rounded-lg bg-[#111111] border border-[#1f1f1f] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-[#ccff00]" />
                  </div>
                  <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl rounded-tl-none px-4 py-3 text-xs text-[#a0a0a0]">
                    <div className="flex items-center space-x-1.5">
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

          {/* Form Input */}
          <form 
            onSubmit={handleSubmit} 
            className="p-3 bg-[#111111] border-t border-[#1f1f1f] flex items-center space-x-2"
          >
            <input
              id="ai-chat-input-field"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya perihal portfolio, skor saham..."
              className="flex-1 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-[#ccff00]"
              disabled={chatLoading}
            />
            <button
              id="ai-chat-send-btn"
              type="submit"
              disabled={!input.trim() || chatLoading}
              className="w-8 h-8 bg-[#ccff00] hover:bg-[#b2e000] disabled:bg-white/5 disabled:text-[#4b5563] text-black rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
