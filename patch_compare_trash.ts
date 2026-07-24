import fs from 'fs';

let code = fs.readFileSync('src/pages/Compare.tsx', 'utf8');

const regex = /className="absolute top-4 right-4 text-\[#686477\] hover:text-\[#ff3366\] p-1\.5 hover:bg-\[#111018\] rounded-lg transition-colors cursor-pointer z-10 opacity-0 group-hover:opacity-100"/g;
const replacement = 'className="absolute top-4 right-4 text-[#686477] hover:text-[#ff3366] p-1.5 hover:bg-[#111018] rounded-lg transition-colors cursor-pointer z-10"';

code = code.replace(regex, replacement);
fs.writeFileSync('src/pages/Compare.tsx', code);
console.log("Done compare trash");
