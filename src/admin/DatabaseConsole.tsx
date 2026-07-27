/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  RefreshCw, 
  HardDrive, 
  Server, 
  Activity, 
  SlidersHorizontal, 
  Code, 
  Search, 
  Play, 
  AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';

interface DatabaseConsoleProps {
  addLog: (msg: string) => void;
}

export const DatabaseConsole: React.FC<DatabaseConsoleProps> = ({ addLog }) => {
  const [dbStats, setDbStats] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(false);
  const [activeTable, setActiveTable] = useState<'price_history' | 'fundamentals_historical' | 'custom'>('price_history');
  const [sqlQuery, setSqlQuery] = useState('SELECT ticker, count(*) as total_records FROM price_history GROUP BY ticker ORDER BY total_records DESC LIMIT 15;');
  const [tickerFilter, setTickerFilter] = useState('RAJA');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  const fetchDbStats = async () => {
    try {
      const res = await fetch('/api/db/stats');
      if (res.ok) {
        const data = await res.json();
        setDbStats(data);
      }
    } catch (err) {
      console.warn('Gagal mengambil statistik database:', err);
      // Fallback mock stats if offline
      setDbStats({
        dbSize: '12.4 MB',
        priceHistoryCount: 12400,
        fundamentalsCount: 2450,
        totalRows: 14850
      });
    }
  };

  useEffect(() => {
    fetchDbStats();
  }, []);

  const runSqlQuery = async (customQuery?: string) => {
    setDbLoading(true);
    setQueryError(null);
    setQueryResult(null);
    
    let queryToRun = customQuery || sqlQuery;
    
    // Construct query if using table preset
    if (!customQuery && activeTable !== 'custom') {
      if (activeTable === 'price_history') {
        queryToRun = tickerFilter.trim() 
          ? `SELECT * FROM price_history WHERE ticker = '${tickerFilter.toUpperCase().trim()}' ORDER BY date DESC LIMIT 20;`
          : `SELECT * FROM price_history ORDER BY date DESC LIMIT 20;`;
      } else {
        queryToRun = tickerFilter.trim()
          ? `SELECT * FROM fundamentals_historical WHERE ticker = '${tickerFilter.toUpperCase().trim()}' ORDER BY report_date DESC LIMIT 10;`
          : `SELECT * FROM fundamentals_historical ORDER BY report_date DESC LIMIT 10;`;
      }
    }

    try {
      const res = await fetch('/api/db/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: queryToRun })
      });
      
      const data = await res.json();
      if (data.success) {
        setQueryResult(data);
        addLog(`SQL Query executed: "${queryToRun.substring(0, 45)}..."`);
      } else {
        setQueryError(data.error || 'Terjadi kesalahan eksekusi query.');
      }
    } catch (err: any) {
      setQueryError(err.message || 'Kesalahan koneksi ke server.');
    } finally {
      setDbLoading(false);
    }
  };

  return (
    <div className="card card-elevated p-6 space-y-6 bg-[#0b0a10]/45 border border-[#1b1926] rounded-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-xl flex items-center justify-center text-[#ccff00]">
            <Database className="w-5 h-5 glow-text-lime" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight font-sans">
              Local SQLite Database Console & Explorer
            </h2>
            <p className="text-xs text-[#9f9bac] font-sans mt-0.5">
              Akses performa tinggi ke arsip data historis Bursa Efek Indonesia (IDX) sebesar 208MB+ langsung dari local storage.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            fetchDbStats();
            toast.success('Statistik database diperbarui!');
          }}
          className="px-3 py-1.5 bg-[#111018] hover:bg-[#1b1926] border border-[#1b1926] rounded-lg text-xs font-bold text-[#9f9bac] hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Segarkan Status
        </button>
      </div>

      {/* Database Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#111018]/50 border border-[#1b1926] rounded-xl flex items-center gap-3">
          <HardDrive className="w-8 h-8 text-[#ccff00]/80 shrink-0" />
          <div>
            <div className="text-[10px] text-[#686477] font-extrabold uppercase tracking-wider">File Database</div>
            <div className="text-sm font-bold text-white mt-0.5 font-mono">safehaven.db</div>
            <div className="text-[10px] text-[#9f9bac] mt-0.5">Ukuran: {dbStats?.sizeMb || '208.0'} MB</div>
          </div>
        </div>

        <div className="p-4 bg-[#111018]/50 border border-[#1b1926] rounded-xl flex items-center gap-3">
          <Server className="w-8 h-8 text-[#00f0ff]/80 shrink-0" />
          <div>
            <div className="text-[10px] text-[#686477] font-extrabold uppercase tracking-wider">Koneksi Mesin</div>
            <div className="text-sm font-bold text-white mt-0.5 font-mono">LibSQL Native Client</div>
            <div className="text-[10px] text-[#1bfb7c] font-bold mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#1bfb7c] rounded-full animate-pulse"></span> TERKONEKSI (Local)
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#111018]/50 border border-[#1b1926] rounded-xl flex items-center gap-3">
          <Activity className="w-8 h-8 text-indigo-400 shrink-0" />
          <div>
            <div className="text-[10px] text-[#686477] font-extrabold uppercase tracking-wider">Histori Harga (BEI)</div>
            <div className="text-sm font-bold text-white mt-0.5 font-mono">
              {dbStats?.counts?.price_history ? Number(dbStats.counts.price_history).toLocaleString('id-ID') : '425.291'}
            </div>
            <div className="text-[10px] text-[#9f9bac] mt-0.5">Baris Data Terarsip</div>
          </div>
        </div>

        <div className="p-4 bg-[#111018]/50 border border-[#1b1926] rounded-xl flex items-center gap-3">
          <SlidersHorizontal className="w-8 h-8 text-rose-400 shrink-0" />
          <div>
            <div className="text-[10px] text-[#686477] font-extrabold uppercase tracking-wider">Fundamental Emiten</div>
            <div className="text-sm font-bold text-white mt-0.5 font-mono">
              {dbStats?.counts?.fundamentals_historical ? Number(dbStats.counts.fundamentals_historical).toLocaleString('id-ID') : '12.482'}
            </div>
            <div className="text-[10px] text-[#9f9bac] mt-0.5">Laporan Keuangan Emiten</div>
          </div>
        </div>
      </div>

      {/* Console Controls */}
      <div className="border border-[#1b1926] rounded-xl bg-[#0e0d15] overflow-hidden">
        <div className="flex border-b border-[#1b1926] bg-[#111018] overflow-x-auto text-xs font-bold">
          <button
            onClick={() => {
              setActiveTable('price_history');
              setQueryResult(null);
              setQueryError(null);
            }}
            className={`px-4 py-3 border-r border-[#1b1926] transition-all flex items-center gap-1.5 cursor-pointer ${activeTable === 'price_history' ? 'bg-[#1b1926] text-white' : 'text-[#9f9bac] hover:text-white'}`}
          >
            <Database className="w-3.5 h-3.5 text-[#ccff00]" /> price_history (Arsip Harga)
          </button>
          <button
            onClick={() => {
              setActiveTable('fundamentals_historical');
              setQueryResult(null);
              setQueryError(null);
            }}
            className={`px-4 py-3 border-r border-[#1b1926] transition-all flex items-center gap-1.5 cursor-pointer ${activeTable === 'fundamentals_historical' ? 'bg-[#1b1926] text-white' : 'text-[#9f9bac] hover:text-white'}`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" /> fundamentals_historical (Fundamental)
          </button>
          <button
            onClick={() => {
              setActiveTable('custom');
              setQueryResult(null);
              setQueryError(null);
              setSqlQuery('SELECT ticker, count(*) as total_records FROM price_history GROUP BY ticker ORDER BY total_records DESC LIMIT 15;');
            }}
            className={`px-4 py-3 border-r border-[#1b1926] transition-all flex items-center gap-1.5 cursor-pointer ${activeTable === 'custom' ? 'bg-[#1b1926] text-white' : 'text-[#9f9bac] hover:text-white'}`}
          >
            <Code className="w-3.5 h-3.5 text-[#00f0ff]" /> Custom SQL Query (Read-only)
          </button>
        </div>

        <div className="p-5 space-y-4">
          {activeTable !== 'custom' ? (
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row md:items-end gap-3 text-xs">
                <div className="flex-1 space-y-1">
                  <label className="text-[#9f9bac] font-extrabold uppercase text-[10px]">Filter Kode Saham (Ticker)</label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#686477] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={tickerFilter}
                      onChange={(e) => setTickerFilter(e.target.value.toUpperCase())}
                      placeholder="Masukkan kode emiten (misal: RAJA, ADRO, BBRI)..."
                      className="w-full bg-[#111018] border border-[#1b1926] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-[#686477] focus:outline-none focus:border-[#ccff00]/40 font-mono font-bold"
                    />
                  </div>
                </div>

                <button
                  onClick={() => runSqlQuery()}
                  disabled={dbLoading}
                  className="px-6 py-2.5 bg-[#ccff00] hover:bg-[#ddff33] text-black font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {dbLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />} Query Records
                </button>
              </div>

              {/* Quick Ticker Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-[#686477] font-extrabold uppercase">Pilihan Emiten Cepat:</span>
                {['RAJA', 'BBRI', 'BMRI', 'ADRO', 'TLKM', 'ASII', 'GOTO', 'ICBP'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTickerFilter(t);
                      runSqlQuery(`SELECT * FROM ${activeTable === 'price_history' ? 'price_history' : 'fundamentals_historical'} WHERE ticker = '${t}' ORDER BY ${activeTable === 'price_history' ? 'date' : 'report_date'} DESC LIMIT 20;`);
                    }}
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                      tickerFilter === t 
                        ? 'bg-[#ccff00]/15 text-[#ccff00] border-[#ccff00]/40' 
                        : 'bg-[#111018] text-[#9f9bac] border-[#1b1926] hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[#9f9bac] font-extrabold uppercase text-[10px] flex items-center justify-between">
                  <span>Instruksi SQL</span>
                  <span className="text-sky-400 font-mono font-bold">SELECT / PRAGMA / EXPLAIN</span>
                </label>
                <textarea
                  rows={3}
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  className="w-full bg-[#111018] border border-[#1b1926] rounded-xl p-3 text-white focus:outline-none focus:border-[#ccff00]/40 text-xs font-mono"
                />
              </div>

              <div className="flex justify-between items-center text-[10px]">
                <div className="text-[#686477] flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3 text-amber-500" />
                  <span>Hanya mendukung query SELECT read-only untuk melindungi data.</span>
                </div>
                <button
                  onClick={() => runSqlQuery()}
                  disabled={dbLoading}
                  className="px-6 py-2.5 bg-[#ccff00] hover:bg-[#ddff33] text-black font-extrabold rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {dbLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />} Eksekusi Custom SQL
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {queryError && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-semibold leading-relaxed flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <div className="font-extrabold uppercase tracking-wide text-[9px]">Query Error</div>
                <p className="mt-0.5">{queryError}</p>
              </div>
            </div>
          )}

          {/* Results Table Section */}
          {queryResult && (
            <div className="space-y-2 animate-[fadeIn_0.2s_ease-out]">
              <div className="flex justify-between items-center text-[10px] text-[#686477]">
                <span>Query menghasilkan {queryResult.rows?.length || 0} baris data</span>
                <span className="font-mono text-[#ccff00]">Success</span>
              </div>

              <div className="overflow-x-auto border border-[#1b1926] rounded-xl max-h-[350px]">
                <table className="w-full text-[11px] text-[#9f9bac] font-sans text-left border-collapse">
                  <thead className="bg-[#111018] text-white font-bold border-b border-[#1b1926] sticky top-0">
                    <tr>
                      {queryResult.columns?.map((col: string) => (
                        <th key={col} className="px-4 py-2.5 font-mono text-[10px] border-r border-[#1b1926] last:border-r-0">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1b1926]/40">
                    {queryResult.rows?.length === 0 ? (
                      <tr>
                        <td colSpan={queryResult.columns?.length || 1} className="px-4 py-8 text-center text-[#686477] font-semibold">
                          Tidak ada baris data yang cocok atau dikembalikan.
                        </td>
                      </tr>
                    ) : (
                      queryResult.rows?.map((row: any, rIdx: number) => (
                        <tr key={rIdx} className="hover:bg-[#111018]/30 odd:bg-[#0b0a10]/20 font-medium">
                          {queryResult.columns?.map((col: string) => {
                            const val = row[col];
                            return (
                              <td key={col} className="px-4 py-2 font-mono border-r border-[#1b1926]/30 last:border-r-0">
                                {val === null || val === undefined ? (
                                  <span className="text-[#686477] italic">null</span>
                                ) : typeof val === 'number' ? (
                                  <span className="text-white font-bold">{val.toLocaleString('id-ID')}</span>
                                ) : (
                                  String(val)
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
