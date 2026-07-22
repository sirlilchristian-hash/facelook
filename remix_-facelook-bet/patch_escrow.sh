#!/bin/bash
# Replaces everything from {escrowEngineTab === "tujengane" to the closing ) : null} with the unified UI.

awk '
BEGIN { skip = 0 }
/{escrowEngineTab === "tujengane" \? \(/ {
    print "            {/* Unified Escrow Interface */}"
    print "            <div className=\"space-y-4 animate-in fade-in duration-200 text-left pb-16\">"
    print "              {ratioOddValue > 0 ? ("
    print "                <>"
    print "                  {/* Match Card */}"
    print "                  <div className=\"bg-white dark:bg-[#18191a] p-3 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden\">"
    print "                    <div className=\"flex justify-between items-start mb-3\">"
    print "                      <div>"
    print "                        <div className=\"flex items-center gap-1.5 text-[9px] font-bold text-gray-500 mb-1\">"
    print "                          <span className=\"w-4 h-4 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-[8px]\">⚽</span>"
    print "                          {ratioMatch?.league || \"Premier League\"}"
    print "                        </div>"
    print "                        <h3 className=\"text-sm font-black text-gray-900 dark:text-white leading-tight\">"
    print "                          {ratioMatch?.homeTeam} <span className=\"text-gray-400 font-normal\">vs</span> {ratioMatch?.awayTeam}"
    print "                        </h3>"
    print "                      </div>"
    print "                      <div className=\"bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black px-2 py-1 rounded-lg border border-blue-100 dark:border-blue-800/50 flex flex-col items-end\">"
    print "                        <span className=\"uppercase text-[8px] opacity-70 flex items-center gap-1\"><span className=\"w-1.5 h-1.5 rounded-full bg-emerald-500\"></span> Your Pick</span>"
    print "                        <span>{ratioOddName} @{ratioOddValue.toFixed(2)}</span>"
    print "                      </div>"
    print "                    </div>"
    print ""
    print "                    {/* Contract Value Input */}"
    print "                    <div className=\"pt-3 border-t border-gray-100 dark:border-zinc-800\">"
    print "                        <label className=\"text-[9px] text-gray-500 font-bold uppercase block mb-1\">"
    print "                          Contract Value ($)"
    print "                        </label>"
    print "                        <div className=\"relative\">"
    print "                          <span className=\"absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm\">$</span>"
    print "                          <input"
    print "                            type=\"number\""
    print "                            min=\"1\""
    print "                            value={ratioTotalPool}"
    print "                            onChange={(e) => {"
    print "                              const val = Math.max(1, parseFloat(e.target.value) || 0);"
    print "                              setRatioTotalPool(val);"
    print "                              setCollabTargetStake(val);"
    print "                              setCalculatorMode(\"contract\");"
    print "                            }}"
    print "                            className=\"w-full bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-zinc-800 rounded-xl py-2 pl-7 pr-3 font-mono font-bold text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-colors\""
    print "                          />"
    print "                        </div>"
    print "                    </div>"
    print "                  </div>"
    print ""
    print "                  <button "
    print "                    onClick={() => setShowEscrowCalculationModal(true)}"
    print "                    className=\"w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] py-3 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2\""
    print "                  >"
    print "                    <span>🧮</span> Calculate"
    print "                  </button>"
    print "                </>"
    print "              ) : ("
    print "                <div className=\"p-6 bg-gray-50/50 dark:bg-zinc-800/10 rounded-2xl border border-dashed border-gray-300 dark:border-zinc-700 text-[11px] text-gray-500 text-center leading-relaxed flex flex-col items-center gap-3 mt-4\">"
    print "                  <div className=\"w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-xl\">"
    print "                    🤝"
    print "                  </div>"
    print "                  <div>"
    print "                    <strong className=\"text-gray-900 dark:text-gray-300 block mb-1\">Welcome to LookUpto Escrow</strong>"
    print "                    Select any match decimal odd on the left to propose a brand new challenge."
    print "                  </div>"
    print "                </div>"
    print "              )}"
    print "            </div>"
    
    skip = 1
    next
}
/            \) : null\}/ {
    if (skip) {
        skip = 0
        next
    }
}
{
    if (!skip) {
        print
    }
}
' src/App.tsx > src/App.tsx.tmp && mv src/App.tsx.tmp src/App.tsx
