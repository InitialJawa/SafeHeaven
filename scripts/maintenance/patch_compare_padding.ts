import fs from 'fs';

let code = fs.readFileSync('src/pages/Compare.tsx', 'utf8');

const regex2 = /<div className="flex items-center gap-2 mb-3">/;
const replacement2 = '<div className="flex items-center gap-2 mb-3 pr-8">';

code = code.replace(regex2, replacement2);
fs.writeFileSync('src/pages/Compare.tsx', code);
console.log("Done compare padding");
