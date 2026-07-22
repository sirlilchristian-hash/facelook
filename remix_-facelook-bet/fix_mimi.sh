#!/bin/bash

# We want to replace from:
# <div className="flex justify-between text-xs py-1.5">
#   <span className="text-gray-500 font-bold uppercase">Opponent Outcome</span>
#   <span className="font-black text-gray-900 dark:text-white">{opponentSelection === "1" ? "Home" : opponentSelection === "X" ? "Draw" : "Away"}</span>
# </div>
# Which happens before `{escrowEngineTab === "three_way" && (`

awk '
BEGIN { skip = 0; printed = 0 }
/<div className="flex justify-between text-xs py-1.5">/ {
    # Check if the next line has Opponent Outcome
    # We buffer lines in awk or we can just set a flag if we are near it
}
' src/App.tsx
