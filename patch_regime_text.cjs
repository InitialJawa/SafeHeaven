const fs = require('fs');
let code = fs.readFileSync('src/components/RegimeTreemap.tsx', 'utf-8');

const oldTextLogic = `        // Render text according to block height and width
        if (block.h >= 110) {
          // Large Block (e.g., NORMAL 40%)
          ctx.font = '800 13px Inter, system-ui, sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(block.name, block.x + 14, block.y + 14);

          if (block.isDominant) {
            const badgeText = 'DOMINAN';
            ctx.font = 'extrabold 9px JetBrains Mono, monospace';
            const badgeW = ctx.measureText(badgeText).width + 10;
            const badgeH = 18;
            const badgeX = block.x + block.w - badgeW - 12;
            const badgeY = block.y + 12;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
            drawRoundRectPath(ctx, badgeX, badgeY, badgeW, badgeH, 6);
            ctx.fill();

            ctx.fillStyle = block.textColor;
            ctx.fillText(badgeText, badgeX + 5, badgeY + 4);
          }

          // Bottom stacked text
          ctx.font = '900 32px Inter, system-ui, sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(\`\${block.percentage}%\`, block.x + 14, block.y + block.h - 52);

          ctx.font = '700 10px JetBrains Mono, monospace';
          ctx.fillStyle = block.textColor === '#ffffff' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.8)';
          ctx.fillText(block.subtitle, block.x + 14, block.y + block.h - 20);

        } else if (block.h >= 75) {
          // Medium Block (e.g., BULL 30% or VOLATILE with larger space)
          ctx.font = '800 12px Inter, system-ui, sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(block.name, block.x + 14, block.y + 10);

          ctx.font = '900 22px Inter, system-ui, sans-serif';
          ctx.fillText(\`\${block.percentage}%\`, block.x + 14, block.y + 26);

          if (block.h >= 90) {
            ctx.font = '700 9px JetBrains Mono, monospace';
            ctx.fillStyle = block.textColor === '#ffffff' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.8)';
            ctx.fillText(block.subtitle, block.x + 14, block.y + 52);
          }

        } else if (block.h >= 50) {
          // Medium Compact Block (e.g. VOLATILE 20%)
          ctx.font = '800 11px Inter, system-ui, sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(block.name, block.x + 12, block.y + 10);

          ctx.font = '900 18px Inter, system-ui, sans-serif';
          ctx.fillText(\`\${block.percentage}%\`, block.x + 12, block.y + 26);

        } else {
          // Small Compact Inline Block (e.g. BEAR 10%)
          const midY = block.y + block.h / 2;
          ctx.font = '800 11px Inter, system-ui, sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(block.name, block.x + 12, midY);

          ctx.font = '900 14px Inter, system-ui, sans-serif';
          ctx.textAlign = 'right';
          ctx.textBaseline = 'middle';
          ctx.fillText(\`\${block.percentage}%\`, block.x + block.w - 12, midY);
        }`;

const newTextLogic = `        // Text rendering
        ctx.fillStyle = block.textColor;
        ctx.font = 'bold 12px Inter, system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        if (block.w > 70 && block.h > 65) {
          ctx.fillText(block.name, block.x + 14, block.y + 14);

          if (block.isDominant) {
            const badgeText = 'DOMINAN';
            ctx.font = 'bold 10px JetBrains Mono, monospace';
            const badgeW = ctx.measureText(badgeText).width + 12;
            const badgeH = 20;
            const badgeX = block.x + block.w - badgeW - 14;
            const badgeY = block.y + 14;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
            ctx.beginPath();
            ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 6);
            ctx.fill();

            ctx.fillStyle = block.textColor;
            ctx.fillText(badgeText, badgeX + 6, badgeY + 5);
          }

          // Percentage & Subtitle
          if (block.h > 110) {
            ctx.font = '900 26px Inter, system-ui, sans-serif';
            ctx.fillText(\`\${block.percentage}%\`, block.x + 14, block.y + block.h - 48);

            ctx.font = '600 10px JetBrains Mono, monospace';
            ctx.fillStyle = block.textColor === '#ffffff' ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)';
            ctx.fillText(block.subtitle, block.x + 14, block.y + block.h - 22);
          } else {
            ctx.font = '900 20px Inter, system-ui, sans-serif';
            ctx.fillText(\`\${block.percentage}%\`, block.x + 14, block.y + block.h - 32);

            ctx.font = '600 9px JetBrains Mono, monospace';
            ctx.fillStyle = block.textColor === '#ffffff' ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)';
            ctx.fillText(block.subtitle, block.x + 14, block.y + block.h - 16);
          }
        } else if (block.w > 50 && block.h > 40) {
          ctx.font = 'bold 10px Inter, system-ui, sans-serif';
          ctx.fillText(block.name, block.x + 8, block.y + 8);
          ctx.font = 'bold 14px Inter, system-ui, sans-serif';
          ctx.fillText(\`\${block.percentage}%\`, block.x + 8, block.y + block.h - 22);
        }`;

code = code.replace(oldTextLogic, newTextLogic);
fs.writeFileSync('src/components/RegimeTreemap.tsx', code);
console.log("Patched text successfully");
