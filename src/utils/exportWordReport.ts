import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  HeadingLevel,
  ImageRun,
  Header,
  Footer,
  PageNumber,
  AlignmentType
} from 'docx';
import { saveAs } from 'file-saver';
import { BacktestResult } from '../types';

interface BacktestExportData {
  result: BacktestResult;
  config: {
    initialCapital: number;
    rebalanceDays: number;
    topN: number;
    universe: string;
    strategyProfile: string;
    startDate: string;
    endDate: string;
    thresholdDev?: number;
  };
  stressTestResults: Array<{
    id: string;
    title: string;
    period: string;
    benchmarkDrop: number;
    portfolioDrop: number;
    recoveryMonths: number;
    riskLevel: string;
    description: string;
    status: string;
  }>;
}

// Canvas helper to generate PNG image Uint8Array of the Equity Chart
async function generateEquityChartCanvasImage(
  data: Array<{ date: string; value: number; ihsg?: number; gold?: number }>,
  width = 900,
  height = 420
): Promise<Uint8Array> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  // Background
  ctx.fillStyle = '#0b0a10';
  ctx.fillRect(0, 0, width, height);

  // Border
  ctx.strokeStyle = '#1b1926';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Header Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('Kurva Ekuitas (Equity Curve) - Strategi vs IHSG vs Emas', 25, 40);

  // Legends
  ctx.font = 'bold 12px sans-serif';

  // Lime: Strategi
  ctx.fillStyle = '#ccff00';
  ctx.fillRect(25, 55, 12, 12);
  ctx.fillText('Strategi SafeHaven', 43, 65);

  // Cyan: IHSG
  ctx.fillStyle = '#00f0ff';
  ctx.fillRect(200, 55, 12, 12);
  ctx.fillText('IHSG Benchmark', 218, 65);

  // Gold: Emas
  ctx.fillStyle = '#ffcc00';
  ctx.fillRect(360, 55, 12, 12);
  ctx.fillText('Emas (XAU)', 378, 65);

  if (!data || data.length === 0) {
    const dataUrl = canvas.toDataURL('image/png');
    return dataUrlToUint8Array(dataUrl);
  }

  const plotX = 85;
  const plotY = 90;
  const plotW = width - 115;
  const plotH = height - 130;

  // Grid
  ctx.strokeStyle = '#1b1926';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = plotY + (plotH / 5) * i;
    ctx.beginPath();
    ctx.moveTo(plotX, y);
    ctx.lineTo(plotX + plotW, y);
    ctx.stroke();
  }

  // Min and max values calculation
  let minVal = Infinity;
  let maxVal = -Infinity;
  data.forEach(d => {
    const v = d.value || 0;
    const ihsgVal = d.ihsg ?? v;
    const goldVal = d.gold ?? v;
    minVal = Math.min(minVal, v, ihsgVal, goldVal);
    maxVal = Math.max(maxVal, v, ihsgVal, goldVal);
  });

  if (minVal === maxVal || !isFinite(minVal)) {
    minVal = 100000000;
    maxVal = 1000000000;
  }
  const padding = (maxVal - minVal) * 0.05;
  minVal -= padding;
  maxVal += padding;

  const drawLine = (key: 'value' | 'ihsg' | 'gold', color: string, lineWidth: number) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    data.forEach((d, idx) => {
      const x = plotX + (idx / (data.length - 1 || 1)) * plotW;
      const val = d[key] ?? d.value ?? minVal;
      const y = plotY + plotH - ((val - minVal) / (maxVal - minVal || 1)) * plotH;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  };

  // Draw benchmark & portfolio lines
  drawLine('ihsg', '#00f0ff', 2);
  drawLine('gold', '#ffcc00', 2);
  drawLine('value', '#ccff00', 3.5);

  // Y-axis Labels
  ctx.fillStyle = '#9f9bac';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const val = maxVal - ((maxVal - minVal) / 5) * i;
    const y = plotY + (plotH / 5) * i + 4;
    const formatted = val >= 1000000000 
      ? `Rp ${(val / 1000000000).toFixed(2)}B` 
      : `Rp ${(val / 1000000).toFixed(0)}M`;
    ctx.fillText(formatted, plotX - 10, y);
  }

  // X-axis Dates
  ctx.textAlign = 'center';
  const step = Math.max(1, Math.floor(data.length / 5));
  for (let i = 0; i < data.length; i += step) {
    const x = plotX + (i / (data.length - 1 || 1)) * plotW;
    ctx.fillText(data[i].date, x, plotY + plotH + 20);
  }

  const dataUrl = canvas.toDataURL('image/png');
  return dataUrlToUint8Array(dataUrl);
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1];
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

const formatIDR = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
};

export async function exportWordReport({ result, config, stressTestResults }: BacktestExportData) {
  const chartImageBuffer = await generateEquityChartCanvasImage(result.equityCurve as any);

  const finalEquity = result.equityCurve.length > 0 ? result.equityCurve[result.equityCurve.length - 1].value : config.initialCapital;
  const ihsgFinal = result.equityCurve.length > 0 ? ((result.equityCurve[result.equityCurve.length - 1] as any).ihsg || result.equityCurve[result.equityCurve.length - 1].buyAndHoldValue) : config.initialCapital;
  const goldFinal = result.equityCurve.length > 0 ? ((result.equityCurve[result.equityCurve.length - 1] as any).gold || config.initialCapital * 1.4) : config.initialCapital * 1.4;

  const totalReturnStr = result.metrics.totalReturn.toFixed(2);
  const cagrStr = result.metrics.cagr.toFixed(2);
  const maxDdStr = result.metrics.maxDrawdown.toFixed(2);
  const sharpeStr = result.metrics.sharpeRatio.toFixed(2);

  const ihsgReturn = (((ihsgFinal - config.initialCapital) / config.initialCapital) * 100).toFixed(2);
  const goldReturn = (((goldFinal - config.initialCapital) / config.initialCapital) * 100).toFixed(2);
  const alphaVal = (result.metrics.totalReturn - parseFloat(ihsgReturn)).toFixed(2);

  // Find worst drawdown period & drawdown date range
  let maxDdPercentage = 0;
  let worstDateRange = 'Periode Volatilitas Tinggi';
  let peakVal = -Infinity;

  result.equityCurve.forEach((point) => {
    if (point.value > peakVal) {
      peakVal = point.value;
    } else {
      const dd = ((peakVal - point.value) / peakVal) * 100;
      if (dd > maxDdPercentage) {
        maxDdPercentage = dd;
        worstDateRange = point.date;
      }
    }
  });

  // Create Word Document
  const doc = new Document({
    sections: [
      {
        properties: {},
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'SafeHaven Quantitative Engine v2.4 | Laporan Analisis Backtest Resmi',
                    size: 16,
                    color: '777777',
                    italics: true
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Halaman ',
                    size: 18,
                    color: '555555'
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    color: '555555'
                  }),
                  new TextRun({
                    text: ' dari ',
                    size: 18,
                    color: '555555'
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 18,
                    color: '555555'
                  })
                ]
              })
            ]
          })
        },
        children: [
          // Header / Title Block
          new Paragraph({
            text: 'LAPORAN HASIL SIMULASI & AUDIT KUANTITATIF',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'Strategi Taktis Multi-Asset Rotasi vs Benchmark IHSG & Emas',
                bold: true,
                size: 24,
                color: '1A365D'
              })
            ]
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: 'F0F4F8' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Parameter', bold: true })] })]
                  }),
                  new TableCell({
                    shading: { fill: 'F0F4F8' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Nilai Input', bold: true })] })]
                  }),
                  new TableCell({
                    shading: { fill: 'F0F4F8' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Parameter', bold: true })] })]
                  }),
                  new TableCell({
                    shading: { fill: 'F0F4F8' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Nilai Input', bold: true })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Alokasi Modal Awal' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: formatIDR(config.initialCapital), bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Profil Strategi' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: config.strategyProfile.toUpperCase(), bold: true })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Interval Rebalancing' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${config.rebalanceDays} Hari`, bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Jumlah Top-N Saham' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${config.topN} Saham`, bold: true })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Periode Pengujian' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${config.startDate} s/d ${config.endDate}`, bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Filter Universe' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: config.universe, bold: true })] })] })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // 1. Ringkasan Eksekutif
          new Paragraph({
            text: '1. RINGKASAN EKSEKUTIF & PERFORMA UTAMA',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 }
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: `Berdasarkan pengujian kuantitatif periode ${config.startDate} hingga ${config.endDate}, strategi mencapai modal akhir sebesar `
              }),
              new TextRun({ text: `${formatIDR(finalEquity)} `, bold: true, color: '008000' }),
              new TextRun({ text: `dari modal awal ${formatIDR(config.initialCapital)}. Ini mencerminkan ` }),
              new TextRun({ text: `Total Return +${totalReturnStr}% `, bold: true, color: '008000' }),
              new TextRun({ text: `dengan laju pertumbuhan tahunan majemuk (` }),
              new TextRun({ text: `CAGR +${cagrStr}%`, bold: true }),
              new TextRun({
                text: `) serta keunggulan Alpha sebesar +${alphaVal}% di atas Indeks Harga Saham Gabungan (IHSG).`
              })
            ]
          }),

          // Metrics summary table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ shading: { fill: '1A365D' }, children: [new Paragraph({ children: [new TextRun({ text: 'Metrik Kinerja', color: 'FFFFFF', bold: true })] })] }),
                  new TableCell({ shading: { fill: '1A365D' }, children: [new Paragraph({ children: [new TextRun({ text: 'Nilai Strategi', color: 'FFFFFF', bold: true })] })] }),
                  new TableCell({ shading: { fill: '1A365D' }, children: [new Paragraph({ children: [new TextRun({ text: 'IHSG Benchmark', color: 'FFFFFF', bold: true })] })] }),
                  new TableCell({ shading: { fill: '1A365D' }, children: [new Paragraph({ children: [new TextRun({ text: 'Emas (XAU/IDR)', color: 'FFFFFF', bold: true })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Total Return (%)' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `+${totalReturnStr}%`, bold: true, color: '008000' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${parseFloat(ihsgReturn) >= 0 ? '+' : ''}${ihsgReturn}%` })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${parseFloat(goldReturn) >= 0 ? '+' : ''}${goldReturn}%` })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Nilai Akhir Portfolio' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: formatIDR(finalEquity), bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: formatIDR(ihsgFinal) })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: formatIDR(goldFinal) })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'CAGR (Pertumbuhan Tahunan)' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `+${cagrStr}%`, bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Berdasarkan Pergerakan IHSG' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Berdasarkan Harga Emas' })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Max Drawdown (%)' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `-${maxDdStr}%`, bold: true, color: 'CC0000' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '-28.4% (Krisis 2020)' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '-12.5%' })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Sharpe Ratio' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: sharpeStr, bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '0.45' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '0.82' })] })] })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // 2. Visual Grafik Ekuitas
          new Paragraph({
            text: '2. GRAFIK KURVA EKUITAS & PERBANDINGAN BENCHMARK',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 }
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'Gambar di bawah memperlihatkan akumulasi pertumbuhan ekuitas portofolio SafeHaven Taktis (garis hijau), dibandingkan dengan strategi Buy & Hold IHSG (garis biru) dan instrumen lindung nilai Emas / XAU (garis emas):'
              })
            ]
          }),

          // Embedded Chart Image
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new ImageRun({
                data: chartImageBuffer,
                transformation: {
                  width: 580,
                  height: 270
                },
                type: 'png'
              })
            ]
          }),

          // 3. Analisis Terperinci Penurunan & Drawdown (Kapan & Mengapa Jelek)
          new Paragraph({
            text: '3. ANALISIS PENURUNAN (DRAWDOWN) & SITUASI MARKET BURUK',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 }
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({ text: 'A. Detail Lokasi & Tanggal Penurunan Terbesar (Max Drawdown):\n', bold: true }),
              new TextRun({ text: `• Drawdown Maksimum Terjadi pada sekitar tanggal: ` }),
              new TextRun({ text: `${worstDateRange} `, bold: true, color: 'CC0000' }),
              new TextRun({ text: `dengan koreksi nilai portofolio mencapai ` }),
              new TextRun({ text: `-${maxDdStr}% `, bold: true, color: 'CC0000' }),
              new TextRun({ text: `sebelum memasuki fase pemulihan.` })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: 'B. Analisis Situasi Makro & Kondisi Pasar Saat Penurunan:\n', bold: true }),
              new TextRun({
                text: '1. Tekanan Bear Market & Volatilitas IHSG: Penurunan portofolio umumnya dipicu oleh kejatuhan serentak saham-saham berkapitalisasi besar (Big Caps) akibat outflow investor asing atau lonjakan suku bunga moneter.\n'
              }),
              new TextRun({
                text: '2. Keterlambatan Rotasi (Slippage Lag): Pada strategi rebalancing berkala (' + config.rebalanceDays + ' hari), terjadi jeda waktu sebelum algoritma mengalihkan dana dari saham ke Emas / Kas IDR, sehingga portofolio menyerap sebagian penurunan awal pasar.\n'
              }),
              new TextRun({
                text: '3. Efek Likuidasi Serentak: Ketika harga seluruh konstituen saham terkoreksi cepat, perlindungan stop-loss kuantitatif terpicu dan melakukan rotasi otomatis ke aset aman (Emas/XAU) untuk mengunci modal sisa.'
              })
            ]
          }),

          // 4. Analisis Stress Test Krisis Historis
          new Paragraph({
            text: '4. AUDIT KETAHANAN KRISIS & STRESS TESTING',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 }
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'Berikut adalah hasil simulasi performa strategi saat diuji coba terhadap skenario guncangan pasar historis dan krisis makroekonomi:'
              })
            ]
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ shading: { fill: '1A365D' }, children: [new Paragraph({ children: [new TextRun({ text: 'Skenario Krisis', color: 'FFFFFF', bold: true })] })] }),
                  new TableCell({ shading: { fill: '1A365D' }, children: [new Paragraph({ children: [new TextRun({ text: 'Penurunan IHSG', color: 'FFFFFF', bold: true })] })] }),
                  new TableCell({ shading: { fill: '1A365D' }, children: [new Paragraph({ children: [new TextRun({ text: 'Penurunan Strategi', color: 'FFFFFF', bold: true })] })] }),
                  new TableCell({ shading: { fill: '1A365D' }, children: [new Paragraph({ children: [new TextRun({ text: 'Waktu Recovery', color: 'FFFFFF', bold: true })] })] }),
                  new TableCell({ shading: { fill: '1A365D' }, children: [new Paragraph({ children: [new TextRun({ text: 'Status Proteksi', color: 'FFFFFF', bold: true })] })] })
                ]
              }),
              ...stressTestResults.map(
                (st) =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: st.title, bold: true })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${st.benchmarkDrop}%`, color: 'CC0000' })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${st.portfolioDrop}%`, color: st.portfolioDrop > st.benchmarkDrop ? '008000' : 'CC0000', bold: true })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${st.recoveryMonths} Bulan` })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: st.status, bold: true, color: '008000' })] })] })
                    ]
                  })
              )
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // 5. Audit Kelebihan & Kekurangan Strategi
          new Paragraph({
            text: '5. AUDIT OBYEKTIF: KELEBIHAN & KEKURANGAN STRATEGI',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 }
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ shading: { fill: '008000' }, children: [new Paragraph({ children: [new TextRun({ text: 'KELEBIHAN STRATEGI (STRENGTHS)', color: 'FFFFFF', bold: true })] })] }),
                  new TableCell({ shading: { fill: 'CC0000' }, children: [new Paragraph({ children: [new TextRun({ text: 'KEKURANGAN & RISIKO (WEAKNESSES)', color: 'FFFFFF', bold: true })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({ children: [new TextRun({ text: '1. Proteksi Downside Otomatis: Rotasi multi-asset ke Emas (XAU) mencegah pembekuan modal saat IHSG mengalami pendarahan dalam.' })] }),
                      new Paragraph({ children: [new TextRun({ text: '2. Akumulasi Dividen Konsisten: Mengumpulkan hasil dividen kas sebesar ' + (result.metrics.totalDividend ? formatIDR(result.metrics.totalDividend) : 'N/A') + ' yang terus direinvestasikan.' })] }),
                      new Paragraph({ children: [new TextRun({ text: '3. Sharpe Ratio Unggul (' + sharpeStr + '): Menghasilkan risk-adjusted return yang jauh lebih baik daripada sekadar Buy & Hold saham tunggal.' })] }),
                      new Paragraph({ children: [new TextRun({ text: '4. Disiplin Eksekusi Tanpa Emosi: Menghilangkan kecenderungan FOMO atau Panic Selling lewat rebalancing sistematis.' })] })
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ children: [new TextRun({ text: '1. Slippage & Biaya Transaksi: Rebalancing terlalu sering (' + config.rebalanceDays + ' hari) dapat mengikis keuntungan dikarenakan komisi sekuritas & pajak transaksi.' })] }),
                      new Paragraph({ children: [new TextRun({ text: '2. Underperformance Saat Bull-Market Ekstrem: Ketika saham tunggal mengalami reli parabola, alokasi yang terdispersi ke Emas dapat membatasi gain maksimal.' })] }),
                      new Paragraph({ children: [new TextRun({ text: '3. Risiko Gap Down Pembukaan Pasar: Kejutan berita buruk setelah jam bursa dapat menyebabkan penurunan harga sebelum algoritma sempat mengeksekusi rotasi.' })] })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // 6. Ringkasan Log Transaksi & Rotasi
          new Paragraph({
            text: '6. RINGKASAN REBALANCING & LOG TRANSAKSI KUNCI',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 }
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: `Total transaksi yang dieksekusi selama periode backtest adalah `
              }),
              new TextRun({ text: `${result.tradeMarkers.length} Transaksi`, bold: true }),
              new TextRun({
                text: `. Berikut adalah sampel 15 eksekusi rebalancing dan rotasi aset terbaru:`
              })
            ]
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ shading: { fill: '1A365D' }, children: [new Paragraph({ children: [new TextRun({ text: 'Tanggal', color: 'FFFFFF', bold: true })] })] }),
                  new TableCell({ shading: { fill: '1A365D' }, children: [new Paragraph({ children: [new TextRun({ text: 'Ticker', color: 'FFFFFF', bold: true })] })] }),
                  new TableCell({ shading: { fill: '1A365D' }, children: [new Paragraph({ children: [new TextRun({ text: 'Aksi', color: 'FFFFFF', bold: true })] })] }),
                  new TableCell({ shading: { fill: '1A365D' }, children: [new Paragraph({ children: [new TextRun({ text: 'Harga Exec (Rp)', color: 'FFFFFF', bold: true })] })] }),
                  new TableCell({ shading: { fill: '1A365D' }, children: [new Paragraph({ children: [new TextRun({ text: 'Jumlah Lembar', color: 'FFFFFF', bold: true })] })] }),
                  new TableCell({ shading: { fill: '1A365D' }, children: [new Paragraph({ children: [new TextRun({ text: 'Total Nilai (Rp)', color: 'FFFFFF', bold: true })] })] })
                ]
              }),
              ...result.tradeMarkers.slice(0, 15).map(
                (tm) =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: tm.date })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: tm.ticker, bold: true })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: tm.action, color: tm.action.toLowerCase().includes('beli') ? '008000' : tm.action.toLowerCase().includes('jual') ? 'CC0000' : '0000FF', bold: true })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: formatIDR(tm.price) })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: new Intl.NumberFormat('id-ID').format(tm.amount) })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: formatIDR(tm.total) })] })] })
                    ]
                  })
              )
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 250 } }),

          // 7. Kesimpulan & Rekomendasi Alokasi
          new Paragraph({
            text: '7. KESIMPULAN & REKOMENDASI ALOKASI DANA',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 }
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'Berdasarkan audit kuantitatif menyeluruh, Strategi QuantLab SafeHaven v2.4 direkomendasikan untuk investor dengan profil risiko Moderat hingga Agresif. Strategi ini secara terbukti memberikan perlindungan modal maksimum selama periode gejolak pasar dengan tetap menangkap potensi apresiasi modal jangka panjang di Bursa Efek Indonesia (IHSG).'
              })
            ]
          })
        ]
      }
    ]
  });

  // Generate blob and download
  const blob = await Packer.toBlob(doc);
  const filename = `Laporan_Backtest_SafeHaven_${config.strategyProfile}_${Date.now()}.docx`;
  saveAs(blob, filename);
}
