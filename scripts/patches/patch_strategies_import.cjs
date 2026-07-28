const fs = require('fs');
let content = fs.readFileSync('src/pages/Strategies.tsx', 'utf8');
content = content.replace(/import \{ Sliders, Plus, Trash2, Shield, Percent, Check, X, Pencil \} from 'lucide-react';/, "import { Sliders, Plus, Trash2, Shield, Percent, Check, X, Pencil, Info } from 'lucide-react';");
fs.writeFileSync('src/pages/Strategies.tsx', content);
