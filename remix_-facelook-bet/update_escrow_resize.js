import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetSidebar = `        {/* RIGHT SIDEBAR - Ads and Quick Shortcuts */}
        {activeTab !== "profile" && (
          <aside className="md:col-span-1 space-y-6 md:sticky md:top-[80px]">

          {/* Embedded LookUpto Escrow Calculator Engine */}
          <div className="bg-white dark:bg-[#242526] rounded-xl shadow-md p-4 border border-gray-250 dark:border-[#3e4042] text-left transition-colors duration-300">
            <div className="flex items-center justify-between font-black text-gray-800 dark:text-white pb-2.5 border-b border-gray-150 dark:border-zinc-800 mb-4">`;

const replaceSidebar = `        {/* RIGHT SIDEBAR - Ads and Quick Shortcuts */}
        {activeTab !== "profile" && (
          <aside className="md:col-span-1 md:sticky md:top-[80px] h-[85vh] relative z-40">

          {/* Embedded LookUpto Escrow Calculator Engine */}
          <div 
            className="absolute top-0 right-0 w-full min-w-[280px] min-h-[500px] bg-white dark:bg-[#242526] rounded-xl shadow-2xl border border-gray-250 dark:border-[#3e4042] text-left transition-colors duration-300 resize overflow-auto" 
            style={{ direction: 'rtl' }}
          >
            <div className="p-4 h-full" style={{ direction: 'ltr' }}>
            <div className="flex items-center justify-between font-black text-gray-800 dark:text-white pb-2.5 border-b border-gray-150 dark:border-zinc-800 mb-4">`;

if (code.includes(targetSidebar)) {
  code = code.replace(targetSidebar, replaceSidebar);
} else {
  console.log("Could not find exact target string. Attempting fallback...");
  
  // Try to find a slightly different version
  const fallbackRegex = /<aside className="md:col-span-1 space-y-6 md:sticky md:top-\[80px\]">\s*\{\/\* Embedded LookUpto Escrow Calculator Engine \*\/\}\s*<div className="bg-white dark:bg-\[#242526\] rounded-xl shadow-md p-4 border border-gray-250 dark:border-\[#3e4042\] text-left transition-colors duration-300[^"]*">/g;
  
  const fallbackReplace = `<aside className="md:col-span-1 md:sticky md:top-[80px] h-[85vh] relative z-40">

          {/* Embedded LookUpto Escrow Calculator Engine */}
          <div 
            className="absolute top-0 right-0 w-full min-w-[280px] min-h-[500px] bg-white dark:bg-[#242526] rounded-xl shadow-2xl border border-gray-250 dark:border-[#3e4042] text-left transition-colors duration-300 resize overflow-auto" 
            style={{ direction: 'rtl' }}
          >
            <div className="p-4 h-full" style={{ direction: 'ltr' }}>`;
            
  if (fallbackRegex.test(code)) {
    code = code.replace(fallbackRegex, fallbackReplace);
  } else {
    console.log("Fallback failed too.");
  }
}

// We need to add closing div for the inner content
const closingTarget = `                  </div>
                </div>
              ) : null}
            </div>
          </div>
          </aside>
        )}
      </div>`;
      
const closingReplace = `                  </div>
                </div>
              ) : null}
            </div>
            </div>
          </div>
          </aside>
        )}
      </div>`;

if (code.includes(closingTarget)) {
    code = code.replace(closingTarget, closingReplace);
}

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log("Updated.");
