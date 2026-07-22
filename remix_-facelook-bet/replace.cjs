const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const startStr = `            ) : (
              ratioOddValue > 0 ? (
                <div className="space-y-4 animate-in fade-in duration-200">`;

const endStr = `                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-[#242526]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-xs font-bold font-sans">Select any prediction from</p>
                  <p className="text-xs font-bold font-sans">the feed or explorer.</p>
                </div>
              )
            )}
          </div>
        </aside>`;

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr) + endStr.length;

if (startIdx === -1 || endIdx === -1) {
  console.log("NOT FOUND", startIdx, endIdx);
  process.exit(1);
}

const newBlock = `            ) : escrowEngineTab === "mimi" ? (
              ratioOddValue > 0 ? (
                <div className="space-y-4 animate-in fade-in duration-200 text-left">
                  {/* Match Card */}
                  <div className="bg-white dark:bg-[#18191a] p-3 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500 mb-1">
                          <span className="w-4 h-4 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-[8px]">⚽</span>
                          {ratioMatch?.league || "Premier League"}
                        </div>
                        <h3 className="text-sm font-black text-gray-900 dark:text-white leading-tight">
                          {ratioMatch?.homeTeam} <span className="text-gray-400 font-normal">vs</span> {ratioMatch?.awayTeam}
                        </h3>
                        <p className="text-[9px] text-gray-500 mt-0.5">Sat, 19 May 2025 • 07:30 PM</p>
                      </div>
                      <div className="text-right bg-gray-50 dark:bg-zinc-800 p-1.5 rounded-lg border border-gray-100 dark:border-zinc-700">
                        <span className="block text-[8px] font-bold text-gray-500 mb-0.5">Kickoff in</span>
                        <div className="flex gap-1 text-[10px] font-black font-mono text-gray-800 dark:text-gray-200">
                           <span>02<span className="text-[7px] text-gray-400 font-sans ml-0.5">HRS</span></span>
                           <span>:</span>
                           <span>14<span className="text-[7px] text-gray-400 font-sans ml-0.5">MIN</span></span>
                           <span>:</span>
                           <span>36<span className="text-[7px] text-gray-400 font-sans ml-0.5">SEC</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex border-t border-gray-100 dark:border-zinc-800 pt-2 mt-1 divide-x divide-gray-100 dark:divide-zinc-800">
                       <div className="flex-1 text-center">
                         <span className="block text-[8px] text-blue-600 dark:text-blue-400 font-bold mb-0.5">Your Pick</span>
                         <span className="text-xs font-black text-blue-700 dark:text-blue-500">{ratioOddName}</span>
                       </div>
                       <div className="flex-1 text-center">
                         <span className="block text-[8px] text-gray-500 font-bold mb-0.5">Odds</span>
                         <span className="text-xs font-black text-gray-900 dark:text-white">@ {ratioOddValue.toFixed(2)}</span>
                       </div>
                       <div className="flex-1 text-center">
                         <span className="block text-[8px] text-gray-500 font-bold mb-0.5">Risk Level</span>
                         <span className="text-xs font-black text-amber-500">High ❓</span>
                       </div>
                    </div>
                  </div>

                  {/* Contract Summary */}
                  <div className="bg-white dark:bg-[#18191a] p-3 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-[10px] font-black flex items-center gap-1.5 text-gray-800 dark:text-white mb-3">
                       <span className="text-blue-500">📋</span> Contract Summary
                    </h3>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <div className="text-center">
                         <span className="block text-[8px] text-gray-500 font-bold mb-0.5">Total Amount</span>
                         <span className="text-xs font-black text-blue-600 dark:text-blue-400">\${ratioTotalPool.toFixed(2)}</span>
                      </div>
                      <div className="text-center">
                         <span className="block text-[8px] text-gray-500 font-bold mb-0.5">Your Share</span>
                         <span className="text-xs font-black text-blue-600 dark:text-blue-400">\${getCreatorStake().toFixed(2)}</span>
                      </div>
                      <div className="text-center">
                         <span className="block text-[8px] text-gray-500 font-bold mb-0.5">Opponent Share</span>
                         <span className="text-xs font-black text-rose-500">\${(ratioTotalPool - getCreatorStake()).toFixed(2)}</span>
                      </div>
                      <div className="text-center">
                         <span className="block text-[8px] text-gray-500 font-bold mb-0.5">Escrow Fee (2%)</span>
                         <span className="text-xs font-black text-gray-900 dark:text-white">\${(ratioTotalPool * 0.02).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 dark:bg-zinc-800 p-2 rounded-lg border border-gray-100 dark:border-zinc-700">
                       <div className="flex items-center gap-1.5">
                         <span className="text-[10px]">🔒</span>
                         <span className="text-[9px] font-bold text-gray-600 dark:text-gray-400">Status: <span className="text-blue-600 dark:text-blue-400">Waiting for Opponent</span></span>
                       </div>
                       <span className="text-[9px] font-bold text-gray-600 dark:text-gray-400">Escrow Lock Value: \${ratioTotalPool.toFixed(2)} ℹ️</span>
                    </div>
                  </div>

                  {/* Your Side vs Opponent Side */}
                  <div className="relative flex gap-2">
                     {/* VS Badge */}
                     <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 dark:bg-zinc-800 rounded-full border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-[8px] font-black z-10 text-gray-500">
                       VS
                     </div>
                     <div className="flex-1 bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                       <h4 className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 dark:text-blue-400 mb-2">
                         <span>👤</span> Your Side
                       </h4>
                       <div className="grid grid-cols-2 gap-2 mb-2">
                         <div>
                           <span className="block text-[8px] text-gray-500 font-bold mb-0.5">Prediction</span>
                           <span className="text-[10px] font-black text-blue-700 dark:text-blue-500">{ratioOddName}</span>
                         </div>
                         <div>
                           <span className="block text-[8px] text-gray-500 font-bold mb-0.5">Odds</span>
                           <span className="text-[10px] font-black text-gray-800 dark:text-gray-200">@ {ratioOddValue.toFixed(2)}</span>
                         </div>
                       </div>
                       <div className="flex justify-between items-center mt-3 pt-2 border-t border-blue-100 dark:border-blue-900/30">
                         <div>
                           <span className="block text-[8px] text-gray-500 font-bold mb-0.5">Required Stake</span>
                           <span className="text-xs font-black text-blue-600 dark:text-blue-400">\${getCreatorStake().toFixed(2)}</span>
                         </div>
                         <span className="text-[8px] font-bold text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full flex items-center gap-1">
                           🕒 Waiting
                         </span>
                       </div>
                     </div>

                     <div className="flex-1 bg-rose-50/50 dark:bg-rose-900/10 p-3 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                       <h4 className="flex items-center gap-1.5 text-[10px] font-black text-rose-600 dark:text-rose-400 mb-2">
                         <span>👤</span> Opponent Side
                       </h4>
                       <div className="grid grid-cols-2 gap-2 mb-2">
                         <div>
                           <span className="block text-[8px] text-gray-500 font-bold mb-0.5">Prediction</span>
                           <span className="text-[10px] font-black text-rose-700 dark:text-rose-500">Any Other</span>
                         </div>
                         <div>
                           <span className="block text-[8px] text-gray-500 font-bold mb-0.5">Odds</span>
                           <span className="text-[10px] font-black text-gray-800 dark:text-gray-200">@ {((1 / (1 - (1 / ratioOddValue)))).toFixed(2)}</span>
                         </div>
                       </div>
                       <div className="flex justify-between items-center mt-3 pt-2 border-t border-rose-100 dark:border-rose-900/30">
                         <div>
                           <span className="block text-[8px] text-gray-500 font-bold mb-0.5">Required Stake</span>
                           <span className="text-xs font-black text-rose-600 dark:text-rose-400">\${(ratioTotalPool - getCreatorStake()).toFixed(2)}</span>
                         </div>
                         <span className="text-[8px] font-bold text-rose-500 bg-rose-100 dark:bg-rose-900/30 px-2 py-1 rounded-full flex items-center gap-1">
                           🔍 Searching
                         </span>
                       </div>
                     </div>
                  </div>

                  {/* Challenge Type */}
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-black flex items-center gap-1.5 text-gray-800 dark:text-white">
                      <span>⚙️</span> Challenge Type
                    </h3>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: "open", icon: "🌐", title: "Open Market", desc: "Opponent can choose any side." },
                        { id: "proposed", icon: "🎯", title: "Proposed Market", desc: "Opponent must take the selected side." },
                        { id: "selective", icon: "⚖️", title: "Selective Market", desc: "You choose which sides are allowed." },
                        { id: "private", icon: "🔒", title: "Private Challenge", desc: "Challenge a specific friend only." }
                      ].map(type => (
                        <button key={type.id} onClick={() => setChallengeTargetMode(type.id as any)} className={\`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center \${challengeTargetMode === type.id ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400" : "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:border-blue-300"}\`}>
                           <span className="text-xs mb-1">{type.icon}</span>
                           <span className={\`text-[8px] font-bold mb-0.5 \${challengeTargetMode === type.id ? "text-blue-700 dark:text-blue-400" : "text-gray-800 dark:text-gray-200"}\`}>{type.title}</span>
                           <span className="text-[6px] text-gray-500 leading-tight hidden sm:block">{type.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Find Opponent with Nyota AI */}
                  <div className="bg-white dark:bg-[#18191a] p-3 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-lg">🤖</div>
                        <div>
                          <h4 className="text-[10px] font-black text-gray-900 dark:text-white">Find Opponent with Nyota AI</h4>
                          <p className="text-[8px] text-gray-500">Nyota is finding the best opponent for you...</p>
                        </div>
                      </div>
                      <div className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[8px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                         ⚡ AI Active
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {["Friends", "Public Players", "Similar Bettors", "Active Wallets", "Compatible Odds"].map(filter => (
                        <div key={filter} className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-2 py-1 flex items-center gap-1">
                          <span className="text-[8px] text-gray-600 dark:text-gray-400 font-medium">{filter}</span>
                          <span className="text-emerald-500 text-[8px]">✓</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => window.alert("Searching for Opponents...")} className="flex-2 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold py-1.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1 cursor-pointer">
                        🔍 Find Opponent
                      </button>
                      <button onClick={() => window.alert("Invite friend modal opened.")} className="flex-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 text-[9px] font-bold py-1.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1 cursor-pointer">
                        👤 Invite Friend
                      </button>
                      <button onClick={() => window.alert("Challenge boosted!")} className="flex-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 text-[9px] font-bold py-1.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1 cursor-pointer">
                        🚀 Boost Challenge
                      </button>
                      <button onClick={() => window.alert("Viewing waiting list.")} className="flex-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 text-[9px] font-bold py-1.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1 cursor-pointer">
                        🕒 View Waiting
                      </button>
                    </div>
                  </div>

                  {/* Escrow Summary */}
                  <div className="bg-white dark:bg-[#18191a] p-3 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex justify-between items-center text-center">
                     <div>
                       <span className="text-[12px] block mb-0.5">🏆</span>
                       <span className="block text-[7px] text-gray-500 uppercase font-bold mb-0.5">Potential Win</span>
                       <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">\${ratioTotalPool.toFixed(2)}</span>
                     </div>
                     <div>
                       <span className="text-[12px] block mb-0.5">🥇</span>
                       <span className="block text-[7px] text-gray-500 uppercase font-bold mb-0.5">Winner Takes All</span>
                       <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">Yes</span>
                     </div>
                     <div>
                       <span className="text-[12px] block mb-0.5">🕒</span>
                       <span className="block text-[7px] text-gray-500 uppercase font-bold mb-0.5">Match Starts In</span>
                       <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">2h 14m</span>
                     </div>
                     <div>
                       <span className="text-[12px] block mb-0.5">🛡️</span>
                       <span className="block text-[7px] text-gray-500 uppercase font-bold mb-0.5">Escrow Security</span>
                       <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">100% Secure</span>
                     </div>
                  </div>

                  {/* Initialize Button */}
                  <button
                    type="button"
                    onClick={() => {
                      window.alert("Initializing Mimi na Wewe Escrow... Validating odds, freezing stakes, creating smart contract and generating escrow ID...");
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black py-3 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>🔒</span> Initialize Escrow
                  </button>

                  <div className="flex gap-2">
                    <button type="button" onClick={() => window.alert("Opening full PDF Escrow Contract with AI explanations of returns and rules...")} className="flex-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 text-[10px] font-bold py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer flex items-center justify-center gap-1">
                      <span>📄</span> Preview Contract
                    </button>
                    <button type="button" onClick={() => window.alert("Incomplete Mimi na Wewe saved to drafts safely.")} className="flex-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 text-[10px] font-bold py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer flex items-center justify-center gap-1">
                      <span>🔖</span> Save Draft
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-[#242526]">
                  <span className="text-3xl mb-2">⚽</span>
                  <p className="text-xs font-bold font-sans">Select any prediction from</p>
                  <p className="text-xs font-bold font-sans">the feed or explorer.</p>
                </div>
              )
            ) : escrowEngineTab === "three_way" ? (
              <div className="space-y-4 animate-in fade-in duration-200 text-left">
                {/* 3-Way mode content */}
                {ratioOddValue > 0 ? (
                  <>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white mb-2">3-Way Match Challenge</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {["Home", "Draw", "Away"].map((outcome, i) => (
                        <div key={outcome} className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-3 rounded-2xl flex flex-col gap-2">
                           <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-700 pb-2">
                             <span className="text-[10px] font-bold text-gray-500">Player {i+1}</span>
                             <span className={\`text-[9px] px-2 py-0.5 rounded-full font-bold \${i === 0 ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-gray-100 text-gray-500 dark:bg-zinc-700 dark:text-gray-400"}\`}>{i === 0 ? "You" : "Searching"}</span>
                           </div>
                           <div>
                             <span className="block text-[8px] text-gray-500 font-bold mb-0.5">Prediction</span>
                             <span className="text-[11px] font-black text-gray-900 dark:text-white">{outcome}</span>
                           </div>
                           <div className="flex justify-between">
                             <div>
                               <span className="block text-[8px] text-gray-500 font-bold mb-0.5">Required Stake</span>
                               <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">\${(ratioTotalPool / 3).toFixed(2)}</span>
                             </div>
                             <div className="text-right">
                               <span className="block text-[8px] text-gray-500 font-bold mb-0.5">Odds</span>
                               <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">@ {(3.0).toFixed(2)}</span>
                             </div>
                           </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                       <h4 className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 mb-2 border-b border-indigo-200/50 dark:border-indigo-800/50 pb-1">Three-Way Escrow Summary</h4>
                       <div className="flex justify-between text-[9px] mb-1">
                         <span className="text-gray-600 dark:text-gray-400">Total Escrow Value</span>
                         <span className="font-bold text-gray-900 dark:text-white">\${ratioTotalPool.toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between text-[9px] mb-1">
                         <span className="text-gray-600 dark:text-gray-400">Winner Takes All</span>
                         <span className="font-bold text-emerald-600 dark:text-emerald-400">Yes (\${(ratioTotalPool * 0.98).toFixed(2)})</span>
                       </div>
                       <div className="flex justify-between text-[9px]">
                         <span className="text-gray-600 dark:text-gray-400">Escrow Fee (2%)</span>
                         <span className="font-bold text-gray-900 dark:text-white">\${(ratioTotalPool * 0.02).toFixed(2)}</span>
                       </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => window.alert("Initializing 3-Way Escrow...")}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black py-3 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>🔺</span> Initialize 3-Way Challenge
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-[#242526]">
                    <span className="text-3xl mb-2">⚽</span>
                    <p className="text-xs font-bold font-sans">Select a prediction to start.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>`;

code = code.substring(0, startIdx) + newBlock + code.substring(endIdx);
fs.writeFileSync('src/App.tsx', code, 'utf8');
