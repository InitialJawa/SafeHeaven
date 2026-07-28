const fs = require('fs');
let content = fs.readFileSync('src/pages/Strategies.tsx', 'utf8');
content = content.replace(/  const \[editId, setEditId\] = useState<string \| null>\(null\);/, "  const [editId, setEditId] = useState<string | null>(null);\n  const [showAutoTooltip, setShowAutoTooltip] = useState(false);");
fs.writeFileSync('src/pages/Strategies.tsx', content);
