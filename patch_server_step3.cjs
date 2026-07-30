const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

// 1. Remove global portfolioConfig variable declaration
content = content.replace(/let portfolioConfig: \{[\s\S]*?\} = \{[\s\S]*?lastRebalancedAt: undefined\n\};/g, `
const defaultPortfolioConfig = {
  capital: 500000000,
  strategyName: 'Warren Buffett',
  universe: 'IHSG Top 50',
  topN: 10,
  strategyTemplate: 'strat-1',
  strategyProfile: 'growth',
  allocationSaham: 65,
  allocationEmas: 15,
  allocationCash: 15,
  allocationUSD: 5,
  crashThreshold: 5,
  stopLoss: 7,
  activeStressScenario: undefined,
  stressImpactPct: undefined,
  lastRebalancedAt: undefined
};

async function getPortfolioConfig(uid: string) {
  if (!uid || uid === 'anonymous') return { ...defaultPortfolioConfig };
  try {
    const doc = await admin.firestore().collection('users').doc(uid).collection('configs').doc('portfolio').get();
    if (doc.exists) {
      return { ...defaultPortfolioConfig, ...doc.data() };
    }
  } catch (e) {
    console.warn('Error reading portfolio config', e);
  }
  return { ...defaultPortfolioConfig };
}

async function setPortfolioConfig(uid: string, configData: any) {
  if (!uid || uid === 'anonymous') return;
  try {
    await admin.firestore().collection('users').doc(uid).collection('configs').doc('portfolio').set(configData, { merge: true });
  } catch (e) {
    console.warn('Error writing portfolio config', e);
  }
}
`);

// Now replace usages in endpoints.
// To do this reliably, I'll find the endpoints using portfolioConfig and make them async, then inject config.
function patchEndpoint(content, endpointDef, isAsync) {
  let [definition, start] = endpointDef;
  let blockRegex = new RegExp(definition.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '([\\s\\S]*?)}\\);');
  
  if (!isAsync) {
    // make it async
    let newDef = definition.replace('(req, res) => {', 'async (req, res) => {');
    content = content.replace(definition, newDef);
  }
  
  // Inject const portfolioConfig = await getPortfolioConfig(req.user?.uid || 'anonymous');
  let injection = `\n  const portfolioConfig = await getPortfolioConfig(req.user?.uid || 'anonymous');`;
  
  // We can just find the opening brace and insert it.
  let openBraceIndex = content.indexOf('{', content.indexOf(isAsync ? definition : definition.replace('(req, res)', 'async (req, res)')));
  
  // Actually a simpler way is to replace `(req, res) => {` or `async (req, res) => {` with the injection
  let defString = isAsync ? definition : definition.replace('(req, res)', 'async (req, res)');
  let withInjection = defString + injection;
  content = content.replace(defString, withInjection);
  
  return content;
}

// 2. Identify the routes
const routesToPatch = [
  "app.get('/api/portfolio/config', (req, res) => {",
  "app.put('/api/portfolio/config', async (req, res) => {",
  "app.get('/api/portfolio/growth', async (req, res) => {",
  "app.get('/api/portfolio/stock-picks', (req, res) => {",
  "app.get('/api/market/analysis-matrix', (req, res) => {",
  "app.post('/api/admin/trigger-stress', (req, res) => {",
  "app.post('/api/admin/trigger-rebalance', (req, res) => {",
  "app.post('/api/admin/trigger-drift', (req, res) => {",
  "app.get('/api/ai/portfolio-insight', async (req, res) => {",
  "app.post('/api/chat', async (req, res) => {"
];

for (let r of routesToPatch) {
  let isAsync = r.includes('async');
  content = patchEndpoint(content, [r, 0], isAsync);
}

// 3. For app.put('/api/portfolio/config', we also need to change how it's saved.
// Previously it updated the global variable and sqlite. Let's just update Firestore.
content = content.replace(/portfolioConfig = \{ \.\.\.portfolioConfig, \.\.\.req\.body \};\n\s+await executeQuery\([\s\S]*?\n\s+\);\n\s+await executeQuery\("DELETE FROM portfolio_snapshots WHERE portfolio_id = 'default_portfolio'"\);/g, `
    Object.assign(portfolioConfig, req.body);
    await setPortfolioConfig(req.user?.uid || 'anonymous', portfolioConfig);
`);

// For the admin endpoints, they updated the global variable. Now they should update Firestore.
content = content.replace(/portfolioConfig = \{([\s\S]*?)\};(\s+)res\.json\(\{ success: true, message: 'Rebalance executed' \}\);/g, `
    Object.assign(portfolioConfig, {$1});
    await setPortfolioConfig(req.user?.uid || 'anonymous', portfolioConfig);
    res.json({ success: true, message: 'Rebalance executed' });
`);

content = content.replace(/portfolioConfig = \{([\s\S]*?)\};(\s+)res\.json\(\{ success: true, message: 'Allocation drifted' \}\);/g, `
    Object.assign(portfolioConfig, {$1});
    await setPortfolioConfig(req.user?.uid || 'anonymous', portfolioConfig);
    res.json({ success: true, message: 'Allocation drifted' });
`);


fs.writeFileSync('server.ts', content);
