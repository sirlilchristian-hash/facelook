#!/bin/bash
awk '
BEGIN { in_mimi = 0; }
/{escrowEngineTab === "mimi" && \(/ {
    print
    in_mimi = 1
    next
}
in_mimi == 1 && /<div className="flex justify-between text-xs py-1.5 border-b border-gray-100 dark:border-zinc-800">/ && /Opponent Req. Stake/ {
    print "                      {mimiChallengeType === \"Open\" ? ("
    print "                        <>"
    print "                          {ratioSelection !== \"1\" && ("
    print "                            <div className=\"flex justify-between text-xs py-1.5 border-b border-gray-100 dark:border-zinc-800\">"
    print "                              <span className=\"text-gray-500 font-bold uppercase\">Home Opponent Req. Stake</span>"
    print "                              <span className=\"font-black text-gray-900 dark:text-white\">${(getCentralCalculation().contractValue * ( (1/(ratioMatch?.odds[\"1\"]||2)) / ((1/(ratioMatch?.odds[\"1\"]||2)) + (1/(ratioOddValue||2))) )).toFixed(2)}</span>"
    print "                            </div>"
    print "                          )}"
    print "                          {ratioSelection !== \"X\" && ("
    print "                            <div className=\"flex justify-between text-xs py-1.5 border-b border-gray-100 dark:border-zinc-800\">"
    print "                              <span className=\"text-gray-500 font-bold uppercase\">Draw Opponent Req. Stake</span>"
    print "                              <span className=\"font-black text-gray-900 dark:text-white\">${(getCentralCalculation().contractValue * ( (1/(ratioMatch?.odds[\"X\"]||3)) / ((1/(ratioMatch?.odds[\"X\"]||3)) + (1/(ratioOddValue||2))) )).toFixed(2)}</span>"
    print "                            </div>"
    print "                          )}"
    print "                          {ratioSelection !== \"2\" && ("
    print "                            <div className=\"flex justify-between text-xs py-1.5 border-b border-gray-100 dark:border-zinc-800\">"
    print "                              <span className=\"text-gray-500 font-bold uppercase\">Away Opponent Req. Stake</span>"
    print "                              <span className=\"font-black text-gray-900 dark:text-white\">${(getCentralCalculation().contractValue * ( (1/(ratioMatch?.odds[\"2\"]||4)) / ((1/(ratioMatch?.odds[\"2\"]||4)) + (1/(ratioOddValue||2))) )).toFixed(2)}</span>"
    print "                            </div>"
    print "                          )}"
    print "                        >"
    print "                      ) : ("
    print "                        <div className=\"flex justify-between text-xs py-1.5 border-b border-gray-100 dark:border-zinc-800\">"
    print "                          <span className=\"text-gray-500 font-bold uppercase\">Opponent Req. Stake</span>"
    print "                          <span className=\"font-black text-gray-900 dark:text-white\">${getCentralCalculation().opponentStake.toFixed(2)}</span>"
    print "                        </div>"
    print "                      )}"
    
    # We need to skip the original 4 lines
    getline; getline; getline;
    next
}
in_mimi == 1 && /Force Opponent To Choose/ {
    print "                            <label className=\"text-[9px] text-gray-500 font-bold uppercase block mb-1\">Force Opponent To Choose</label>"
    print "                            <select "
    print "                              value={opponentSelection} "
    print "                              onChange={(e) => setOpponentSelection(e.target.value)}"
    print "                              className=\"w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-blue-500\""
    print "                            >"
    print "                              <option value=\"1\" disabled={ratioSelection === \"1\"}>Home {ratioSelection === \"1\" ? \"(Your Pick)\" : \"\"}</option>"
    print "                              <option value=\"X\" disabled={ratioSelection === \"X\"}>Draw {ratioSelection === \"X\" ? \"(Your Pick)\" : \"\"}</option>"
    print "                              <option value=\"2\" disabled={ratioSelection === \"2\"}>Away {ratioSelection === \"2\" ? \"(Your Pick)\" : \"\"}</option>"
    print "                            </select>"
    
    # We need to skip the original select lines
    while (getline > 0) {
        if ($0 ~ /<\/select>/) {
            break
        }
    }
    next
}
{ print }
' src/App.tsx > src/App.tsx.tmp && mv src/App.tsx.tmp src/App.tsx
