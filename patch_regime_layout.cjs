const fs = require('fs');
let code = fs.readFileSync('src/components/RegimeTreemap.tsx', 'utf-8');

const oldLayoutLogic = `      if (sorted.length >= 2) {
        const topItem = sorted[0];
        const rightItems = sorted.slice(1);

        // Left column width proportional to top item value (min 40%, max 60%)
        const leftRatio = Math.min(0.6, Math.max(0.4, topItem.value / 100));
        const leftW = Math.round((innerW - gap) * leftRatio);
        const rightW = innerW - leftW - gap;

        // Left Dominant Block
        const detailsTop = getRegimeDetails(topItem.name);
        layoutBlocks.push({
          id: topItem.name.toLowerCase(),
          name: topItem.name.toUpperCase(),
          percentage: topItem.value,
          color: detailsTop.color,
          textColor: detailsTop.textColor,
          subtitle: detailsTop.subtitle,
          isDominant: true,
          x: padding,
          y: padding,
          w: leftW,
          h: innerH
        });

        // Right column stacked blocks
        const totalRightVal = rightItems.reduce((sum, item) => sum + item.value, 0) || 1;
        let currentY = padding;
        const availableH = innerH - gap * (rightItems.length - 1);

        rightItems.forEach((item, idx) => {
          const itemH = idx === rightItems.length - 1 
            ? (padding + innerH - currentY) 
            : Math.round(availableH * (item.value / totalRightVal));
          
          const details = getRegimeDetails(item.name);
          layoutBlocks.push({
            id: item.name.toLowerCase(),
            name: item.name.toUpperCase(),
            percentage: item.value,
            color: details.color,
            textColor: details.textColor,
            subtitle: details.subtitle,
            isDominant: false,
            x: padding + leftW + gap,
            y: currentY,
            w: rightW,
            h: itemH
          });

          currentY += itemH + gap;
        });
      } else {`;

const newLayoutLogic = `      if (sorted.length === 4) {
        const leftItem = sorted[0];
        const rightTopItem = sorted[1];
        const rightBotLeftItem = sorted[2];
        const rightBotRightItem = sorted[3];

        const leftW = Math.round((innerW - gap) * 0.52);
        const rightW = innerW - leftW - gap;

        const rightTopH = Math.round((innerH - gap) * 0.52);
        const rightBotH = innerH - rightTopH - gap;
        const subW = Math.round((rightW - gap) * 0.5);
        const rx = padding + leftW + gap;

        // 1. Left Dominant Block
        const detailsTop = getRegimeDetails(leftItem.name);
        layoutBlocks.push({
          id: leftItem.name.toLowerCase(),
          name: leftItem.name.toUpperCase(),
          percentage: leftItem.value,
          color: detailsTop.color,
          textColor: detailsTop.textColor,
          subtitle: detailsTop.subtitle,
          isDominant: true,
          x: padding,
          y: padding,
          w: leftW,
          h: innerH
        });

        // 2. Right Top Block
        const detailsRightTop = getRegimeDetails(rightTopItem.name);
        layoutBlocks.push({
          id: rightTopItem.name.toLowerCase(),
          name: rightTopItem.name.toUpperCase(),
          percentage: rightTopItem.value,
          color: detailsRightTop.color,
          textColor: detailsRightTop.textColor,
          subtitle: detailsRightTop.subtitle,
          isDominant: false,
          x: rx,
          y: padding,
          w: rightW,
          h: rightTopH
        });

        // 3. Right Bottom Left Block
        const detailsRightBotLeft = getRegimeDetails(rightBotLeftItem.name);
        layoutBlocks.push({
          id: rightBotLeftItem.name.toLowerCase(),
          name: rightBotLeftItem.name.toUpperCase(),
          percentage: rightBotLeftItem.value,
          color: detailsRightBotLeft.color,
          textColor: detailsRightBotLeft.textColor,
          subtitle: detailsRightBotLeft.subtitle,
          isDominant: false,
          x: rx,
          y: padding + rightTopH + gap,
          w: subW,
          h: rightBotH
        });

        // 4. Right Bottom Right Block
        const detailsRightBotRight = getRegimeDetails(rightBotRightItem.name);
        layoutBlocks.push({
          id: rightBotRightItem.name.toLowerCase(),
          name: rightBotRightItem.name.toUpperCase(),
          percentage: rightBotRightItem.value,
          color: detailsRightBotRight.color,
          textColor: detailsRightBotRight.textColor,
          subtitle: detailsRightBotRight.subtitle,
          isDominant: false,
          x: rx + subW + gap,
          y: padding + rightTopH + gap,
          w: rightW - subW - gap,
          h: rightBotH
        });

      } else if (sorted.length >= 2) {
        // Fallback for non-4 items
        const topItem = sorted[0];
        const rightItems = sorted.slice(1);

        const leftRatio = Math.min(0.6, Math.max(0.4, topItem.value / 100));
        const leftW = Math.round((innerW - gap) * leftRatio);
        const rightW = innerW - leftW - gap;

        const detailsTop = getRegimeDetails(topItem.name);
        layoutBlocks.push({
          id: topItem.name.toLowerCase(),
          name: topItem.name.toUpperCase(),
          percentage: topItem.value,
          color: detailsTop.color,
          textColor: detailsTop.textColor,
          subtitle: detailsTop.subtitle,
          isDominant: true,
          x: padding,
          y: padding,
          w: leftW,
          h: innerH
        });

        const totalRightVal = rightItems.reduce((sum, item) => sum + item.value, 0) || 1;
        let currentY = padding;
        const availableH = innerH - gap * (rightItems.length - 1);

        rightItems.forEach((item, idx) => {
          const itemH = idx === rightItems.length - 1 
            ? (padding + innerH - currentY) 
            : Math.round(availableH * (item.value / totalRightVal));
          
          const details = getRegimeDetails(item.name);
          layoutBlocks.push({
            id: item.name.toLowerCase(),
            name: item.name.toUpperCase(),
            percentage: item.value,
            color: details.color,
            textColor: details.textColor,
            subtitle: details.subtitle,
            isDominant: false,
            x: padding + leftW + gap,
            y: currentY,
            w: rightW,
            h: itemH
          });

          currentY += itemH + gap;
        });
      } else {`;

if (code.includes(oldLayoutLogic.trim().substring(0, 50))) {
  code = code.replace(oldLayoutLogic, newLayoutLogic);
  fs.writeFileSync('src/components/RegimeTreemap.tsx', code);
  console.log("Patched layout successfully");
} else {
  console.log("oldLayoutLogic not found");
}
