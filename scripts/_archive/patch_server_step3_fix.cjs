const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

// Use `let portfolioConfig = ...` instead of `const` where it's injected
content = content.replace(/const portfolioConfig = await getPortfolioConfig/g, `let portfolioConfig = await getPortfolioConfig`);

// Also, save it back where we reassign it in the admin endpoints
// line 1981 trigger-stress
content = content.replace(/portfolioConfig = \{\s*\.\.\.portfolioConfig,\s*activeStressScenario: scenarioName,\s*stressImpactPct: equityShift\s*\};\s*try \{/g, `Object.assign(portfolioConfig, { activeStressScenario: scenarioName, stressImpactPct: equityShift });
  await setPortfolioConfig(req.user?.uid || 'anonymous', portfolioConfig);
  try {`);
  
// line 2018 trigger-rebalance
content = content.replace(/portfolioConfig = \{\s*\.\.\.portfolioConfig,\s*allocationSaham: activeStrat\.allocationSaham,\s*allocationEmas: activeStrat\.allocationEmas,\s*allocationCash: activeStrat\.allocationCash,\s*allocationUSD: activeStrat\.allocationUSD,\s*activeStressScenario: undefined,\s*stressImpactPct: 0,\s*lastRebalancedAt: new Date\(\)\.toISOString\(\)\s*\};\s*try \{/g, `Object.assign(portfolioConfig, {
    allocationSaham: activeStrat.allocationSaham,
    allocationEmas: activeStrat.allocationEmas,
    allocationCash: activeStrat.allocationCash,
    allocationUSD: activeStrat.allocationUSD,
    activeStressScenario: undefined,
    stressImpactPct: 0,
    lastRebalancedAt: new Date().toISOString()
  });
  await setPortfolioConfig(req.user?.uid || 'anonymous', portfolioConfig);
  try {`);
  
// line 2067 trigger-drift
content = content.replace(/portfolioConfig = \{\s*\.\.\.portfolioConfig,\s*allocationSaham: 75,\s*allocationEmas: 15,\s*allocationCash: 10,\s*allocationUSD: 0,\s*lastRebalancedAt: new Date\(\)\.toISOString\(\)\s*\};\s*try \{/g, `Object.assign(portfolioConfig, {
    allocationSaham: 75,
    allocationEmas: 15,
    allocationCash: 10,
    allocationUSD: 0,
    lastRebalancedAt: new Date().toISOString()
  });
  await setPortfolioConfig(req.user?.uid || 'anonymous', portfolioConfig);
  try {`);

fs.writeFileSync('server.ts', content);
