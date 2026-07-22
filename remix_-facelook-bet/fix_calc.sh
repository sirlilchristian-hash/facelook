#!/bin/bash
awk '
BEGIN { in_calc = 0; printed = 0 }
/if \(escrowEngineTab === "mimi"\) {/ {
    # Replace the 1v1 block
}
' src/App.tsx
