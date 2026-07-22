import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/text-white font-black text-sm whitespace-normal break-words mb-2/g, 'text-white font-black text-sm truncate mb-2');

fs.writeFileSync('src/App.tsx', code, 'utf8');
