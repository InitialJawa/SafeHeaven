const fs = require('fs');
let code = fs.readFileSync('src/pages/Analytics.tsx', 'utf8');

code = code.replace(/import \{ AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line \} from 'recharts';\n/, '');
code = code.replace(/const \[ihsgData, setIhsgData\] = useState<any\[\]>\(\[\]\);\n/, '');
code = code.replace(/const \[ihsgRange, setIhsgRange\] = useState\('1M'\);\n/, '');

const ihsgEffectRegex = /useEffect\(\(\) => \{\n\s*const fetchIhsg = async \(\) => \{[\s\S]*?\}, \[ihsgRange\]\);/;
code = code.replace(ihsgEffectRegex, '');

fs.writeFileSync('src/pages/Analytics.tsx', code);
