#!/bin/bash
awk '
/const \[escrowModalStage, setEscrowModalStage\] = useState/ {
    print
    print "  const [openAudience, setOpenAudience] = useState({"
    print "    friends: true,"
    print "    clan: true,"
    print "    public: true,"
    print "    similar: true,"
    print "    verified: true"
    print "  });"
    next
}
{print}
' src/App.tsx > src/App.tsx.tmp && mv src/App.tsx.tmp src/App.tsx
