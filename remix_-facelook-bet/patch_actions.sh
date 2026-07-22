#!/bin/bash
awk '
BEGIN { in_actions = 0 }
/div className="space-y-3 py-2"/ {
    print "                <div className=\"space-y-4 py-2\">"
    print "                  <div className=\"bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-gray-100 dark:border-zinc-700/50\">"
    print "                    <div className=\"grid grid-cols-2 gap-y-2 text-xs\">"
    print "                      <div className=\"text-gray-500 font-bold uppercase\">Match</div>"
    print "                      <div className=\"font-black text-gray-900 dark:text-white text-right\">{ratioMatchName}</div>"
    print "                      <div className=\"text-gray-500 font-bold uppercase\">Prediction</div>"
    print "                      <div className=\"font-black text-gray-900 dark:text-white text-right\">{ratioOddName === \"1\" ? ratioMatch?.homeTeam : ratioOddName === \"2\" ? ratioMatch?.awayTeam : \"Draw\"} @{ratioOddValue.toFixed(2)}</div>"
    print "                      <div className=\"text-gray-500 font-bold uppercase\">Contract Value</div>"
    print "                      <div className=\"font-black text-blue-600 dark:text-blue-400 text-right\">${getCentralCalculation().contractValue.toFixed(2)}</div>"
    print "                      <div className=\"text-gray-500 font-bold uppercase\">Challenge Type</div>"
    print "                      <div className=\"font-black text-emerald-600 dark:text-emerald-400 text-right\">"
    print "                        {escrowEngineTab === \"mimi\" ? mimiChallengeType + \" Challenge\" : escrowEngineTab === \"three_way\" ? \"Three-Way Challenge\" : \"Tujengane Challenge\"}"
    print "                      </div>"
    print "                    </div>"
    print "                  </div>"
    print ""
    print "                  {escrowEngineTab === \"mimi\" && mimiChallengeType === \"Open\" ? ("
    print "                    <div>"
    print "                      <h3 className=\"text-xs font-bold uppercase text-gray-900 dark:text-white mb-2\">Audience Selection</h3>"
    print "                      <p className=\"text-[10px] text-gray-500 mb-3\">Who Can Accept This Challenge?</p>"
    print "                      <div className=\"space-y-2\">"
    print "                        {["
    print "                          { key: \047friends\047, label: \047Friends\047 },"
    print "                          { key: \047clan\047, label: \047Clan Members\047 },"
    print "                          { key: \047public\047, label: \047Public Community\047 },"
    print "                          { key: \047similar\047, label: \047Similar Bettors\047 },"
    print "                          { key: \047verified\047, label: \047Verified Players\047 }"
    print "                        ].map((item) => ("
    print "                          <label key={item.key} className=\"flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-zinc-700\">"
    print "                            <input "
    print "                              type=\"checkbox\" "
    print "                              checked={openAudience[item.key as keyof typeof openAudience]}"
    print "                              onChange={(e) => setOpenAudience({...openAudience, [item.key]: e.target.checked})}"
    print "                              className=\"w-4 h-4 rounded text-emerald-600 bg-gray-100 border-gray-300 focus:ring-emerald-500 dark:bg-zinc-800 dark:border-zinc-700 dark:ring-offset-zinc-900\""
    print "                            />"
    print "                            <span className=\"text-xs font-bold text-gray-700 dark:text-gray-300\">{item.label}</span>"
    print "                          </label>"
    print "                        ))}"
    print "                      </div>"
    print "                      <button onClick={() => {"
    print "                        window.alert(\"Challenge Published with Audience Preferences!\");"
    print "                        setShowEscrowCalculationModal(false);"
    print "                        setTimeout(() => setEscrowModalStage(\"calculation\"), 300);"
    print "                      }} className=\"w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer\">"
    print "                        <span className=\"text-base\">📢</span> Publish Open Challenge"
    print "                      </button>"
    print "                    </div>"
    print "                  ) : ("
    print "                    <div className=\"space-y-3\">"

    # We skip original line
    getline;
    in_actions = 1
    next
}
in_actions == 1 && /<\/div>/ && /Post Challenge/ {
    print
    print "                    </div>"
    in_actions = 0
    next
}
{print}
' src/App.tsx > src/App.tsx.tmp && mv src/App.tsx.tmp src/App.tsx
