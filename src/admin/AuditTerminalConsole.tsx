/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Terminal } from 'lucide-react';

interface AuditTerminalConsoleProps {
  auditLogs: string[];
  clearLogs: () => void;
}

export const AuditTerminalConsole: React.FC<AuditTerminalConsoleProps> = ({ auditLogs, clearLogs }) => {
  return (
    <div className="card card-elevated p-6 space-y-4 bg-[#0b0a10]/45 border border-[#1b1926]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#ccff00]" />
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">
            System Operational Audit Terminal
          </h3>
        </div>
        <button
          onClick={clearLogs}
          className="text-[10px] text-[#686477] hover:text-[#9f9bac] underline cursor-pointer font-mono"
        >
          Clear Logs
        </button>
      </div>

      <div className="bg-[#0e0d15] p-4 rounded-xl border border-[#1b1926] font-mono text-[11px] text-[#00f0ff] space-y-1.5 h-64 overflow-y-auto leading-relaxed shadow-inner">
        {auditLogs.length === 0 ? (
          <div className="text-[#686477] italic">[SYSTEM READY] Idle... Waiting for admin commands or event triggers.</div>
        ) : (
          auditLogs.map((log, index) => (
            <div key={index} className="flex gap-2 text-white/90">
              <span className="text-[#686477] shrink-0">&gt;</span>
              <span className="break-all">{log}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
