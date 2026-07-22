const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `        <main className={\`\${
          !sidebarVisible 
            ? (activeTab === "profile" ? "md:col-span-4 lg:col-span-4" : "md:col-span-3 lg:col-span-3") 
            : (activeTab === "profile" ? "md:col-span-3 lg:col-span-3" : "md:col-span-3 lg:col-span-2")
        } space-y-6\`}>`;

const replaceStr = `        <main className="flex-1 min-w-0 space-y-6">`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.tsx', code, 'utf8');
