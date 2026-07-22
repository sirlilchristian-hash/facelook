#!/bin/bash
awk '
BEGIN { printed = 0; in_mimi = 0; skip = 0; }
/{escrowEngineTab === "mimi" && \(/ {
    print
    in_mimi = 1
    next
}
in_mimi == 1 && /<div className="flex justify-between text-xs py-1.5">/ && /Opponent Outcome/ {
    skip = 1
}
in_mimi == 1 && skip == 1 && /<\/div>/ {
    skip = 0
    # Now we insert the new logic
    print "                      {/* Challenge Type Dropdown */}"
    print "                      <div className=\"pt-3 mt-2 border-t border-gray-100 dark:border-zinc-800 space-y-3\">"
    print "                        <div>"
    print "                          <label className=\"text-[9px] text-gray-500 font-bold uppercase block mb-1\">Challenge Type</label>"
    print "                          <select "
    print "                            value={mimiChallengeType} "
    print "                            onChange={(e) => setMimiChallengeType(e.target.value as any)}"
    print "                            className=\"w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-blue-500\""
    print "                          >"
    print "                            <option value=\"Open\">🌍 Open Challenge</option>"
    print "                            <option value=\"Forced\">🔒 Forced Challenge</option>"
    print "                            <option value=\"Private\">👤 Private Challenge</option>"
    print "                          </select>"
    print "                        </div>"
    print "                        {mimiChallengeType === \"Open\" && ("
    print "                          <div className=\"text-xs text-gray-500\">"
    print "                            Opponent Can Choose: <span className=\"font-bold text-gray-900 dark:text-gray-300\">{ratioOddName === \"1\" ? \"Draw or Away\" : ratioOddName === \"X\" ? \"Home or Away\" : \"Home or Draw\"}</span>"
    print "                          </div>"
    print "                        )}"
    print "                        {mimiChallengeType === \"Forced\" && ("
    print "                          <div>"
    print "                            <label className=\"text-[9px] text-gray-500 font-bold uppercase block mb-1\">Force Opponent To Choose</label>"
    print "                            <select "
    print "                              value={opponentSelection} "
    print "                              onChange={(e) => setOpponentSelection(e.target.value)}"
    print "                              className=\"w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-blue-500\""
    print "                            >"
    print "                              {ratioOddName !== \"1\" && <option value=\"1\">Home</option>}"
    print "                              {ratioOddName !== \"X\" && <option value=\"X\">Draw</option>}"
    print "                              {ratioOddName !== \"2\" && <option value=\"2\">Away</option>}"
    print "                            </select>"
    print "                          </div>"
    print "                        )}"
    print "                        {mimiChallengeType === \"Private\" && ("
    print "                          <div className=\"space-y-2\">"
    print "                            <label className=\"text-[9px] text-gray-500 font-bold uppercase block mb-1\">Send Challenge To</label>"
    print "                            {!mimiPrivateFriend ? ("
    print "                              <div className=\"relative\">"
    print "                                <span className=\"absolute left-2 top-1/2 -translate-y-1/2 text-gray-400\">🔍</span>"
    print "                                <input"
    print "                                  type=\"text\""
    print "                                  placeholder=\"Search Friend...\""
    print "                                  value={mimiFriendSearch}"
    print "                                  onChange={(e) => setMimiFriendSearch(e.target.value)}"
    print "                                  className=\"w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-lg py-2 pl-7 pr-3 text-xs text-gray-900 dark:text-white outline-none focus:border-blue-500\""
    print "                                />"
    print "                                {mimiFriendSearch && ("
    print "                                  <div className=\"absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg\">"
    print "                                    <button"
    print "                                      className=\"w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-zinc-700\""
    print "                                      onClick={() => {"
    print "                                        setMimiPrivateFriend(\"Michael Brown\");"
    print "                                        setMimiFriendSearch(\"\");"
    print "                                      }}"
    print "                                    >"
    print "                                      Michael Brown"
    print "                                    </button>"
    print "                                  </div>"
    print "                                )}"
    print "                              </div>"
    print "                            ) : ("
    print "                              <div className=\"flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-2 rounded-lg border border-blue-100 dark:border-blue-800/50\">"
    print "                                <span className=\"text-xs font-bold\">✓ {mimiPrivateFriend}</span>"
    print "                                <button onClick={() => setMimiPrivateFriend(null)} className=\"text-xs hover:underline\">Change</button>"
    print "                              </div>"
    print "                            )}"
    print "                          </div>"
    print "                        )}"
    print "                      </div>"
    in_mimi = 0
    next
}
skip == 1 { next }
{ print }
' src/App.tsx > src/App.tsx.tmp && mv src/App.tsx.tmp src/App.tsx
