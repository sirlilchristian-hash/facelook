import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/overflow-visible relative min-h-min h-auto whitespace-normal break-words/g, 'overflow-hidden relative');
code = code.replace(/overflow-visible min-h-min h-auto whitespace-normal break-words/g, 'overflow-hidden');
code = code.replace(/min-h-min h-auto whitespace-normal break-words"/g, '"');
code = code.replace(/min-h-min h-auto whitespace-normal break-words items-center text-center/g, 'items-center text-center');

fs.writeFileSync('src/App.tsx', code, 'utf8');
