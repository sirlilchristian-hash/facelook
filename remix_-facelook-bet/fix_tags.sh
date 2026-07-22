#!/bin/bash
awk '
BEGIN { in_bad_block = 0 }
/div className="space-y-3"><div className="text-xs text-gray-500 text-center mb-4">/ {
    print "                    <div className=\"space-y-3\">"
    print "                      <div className=\"text-xs text-gray-500 text-center mb-4\">"
    in_bad_block = 1
    next
}
in_bad_block == 1 && /Your escrow contract is ready. How would you like to proceed\?/ {
    print "                        Your escrow contract is ready. How would you like to proceed?"
    print "                      </div>"
    in_bad_block = 0
    next
}
/Post Challenge<\/span>/ {
    print
    getline
    print
    print "                    </div>" # Closes space-y-3
    print "                  </div>" # Closes space-y-4
    next
}
{print}
' src/App.tsx > src/App.tsx.tmp && mv src/App.tsx.tmp src/App.tsx
