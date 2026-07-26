#!/bin/bash
# Patch TickerDetail.tsx
sed -i 's/volumeSeriesRef.current.setData(/if(validCandles.length > 0) { try { volumeSeriesRef.current.setData(/g' src/pages/TickerDetail.tsx
sed -i 's/color: c.color,/color: c.color || (c.close >= c.open ? "rgba(0, 230, 118, 0.4)" : "rgba(255, 23, 68, 0.4)"),/g' src/pages/TickerDetail.tsx
sed -i 's/          color: c.color/          color: c.color || (c.close >= c.open ? "rgba(0, 230, 118, 0.4)" : "rgba(255, 23, 68, 0.4)")/g' src/pages/TickerDetail.tsx
sed -i 's/volumeSeriesRef.current.applyOptions({ visible: true });/volumeSeriesRef.current.applyOptions({ visible: true }); } catch (e) { console.warn("Failed to set volume data", e); } }/g' src/pages/TickerDetail.tsx

sed -i 's/candlestickSeriesRef.current.setData(/try { candlestickSeriesRef.current.setData(/g' src/pages/TickerDetail.tsx
sed -i 's/          close: Number(c.close),/          close: Number(c.close),/g' src/pages/TickerDetail.tsx
sed -i 's/        }))/        })); } catch (e) { console.warn("Failed to set candlestick data", e); }/g' src/pages/TickerDetail.tsx

# Patch FullChart.tsx
sed -i 's/candlestickSeriesRef.current.setData(candleData);/if (candleData.length > 0) { try { candlestickSeriesRef.current.setData(candleData); } catch(e) { console.warn("Candle Data error", e); } }/g' src/pages/FullChart.tsx
sed -i 's/s.setData(calc\[calcKey\]);/if (calc[calcKey] \&\& calc[calcKey].length > 0) { try { s.setData(calc[calcKey]); } catch(e) {} }/g' src/pages/FullChart.tsx
sed -i 's/sU.setData(/try { sU.setData(/g' src/pages/FullChart.tsx
sed -i 's/sL.setData(/try { sL.setData(/g' src/pages/FullChart.tsx
sed -i 's/sO.setData(/try { sO.setData(/g' src/pages/FullChart.tsx
sed -i 's/sUp.setData(/try { sUp.setData(/g' src/pages/FullChart.tsx
sed -i 's/sLow.setData(/try { sLow.setData(/g' src/pages/FullChart.tsx
sed -i 's/sWT1.setData(/try { sWT1.setData(/g' src/pages/FullChart.tsx
sed -i 's/sWT2.setData(/try { sWT2.setData(/g' src/pages/FullChart.tsx
sed -i 's/sADX.setData(/try { sADX.setData(/g' src/pages/FullChart.tsx
sed -i 's/sPDI.setData(/try { sPDI.setData(/g' src/pages/FullChart.tsx
sed -i 's/sMDI.setData(/try { sMDI.setData(/g' src/pages/FullChart.tsx
sed -i 's/sK.setData(/try { sK.setData(/g' src/pages/FullChart.tsx
sed -i 's/sD.setData(/try { sD.setData(/g' src/pages/FullChart.tsx
sed -i 's/sHist.setData(/try { sHist.setData(/g' src/pages/FullChart.tsx
sed -i 's/sLine.setData(/try { sLine.setData(/g' src/pages/FullChart.tsx
sed -i 's/sSig.setData(/try { sSig.setData(/g' src/pages/FullChart.tsx
sed -i 's/vSeries.setData(/try { vSeries.setData(/g' src/pages/FullChart.tsx
sed -i 's/vmSeries.setData(/try { vmSeries.setData(/g' src/pages/FullChart.tsx

