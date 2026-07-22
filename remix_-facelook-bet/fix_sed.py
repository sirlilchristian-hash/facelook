import sys

with open("src/App.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    if '<div className="space-y-3">' in line and i + 1 < len(lines) and '<div className="text-xs text-gray-500 text-center mb-4">' in lines[i+1]:
        # check if next line after is "Your escrow contract is ready"
        if i + 2 < len(lines) and "Your escrow contract is ready" in lines[i+2]:
            new_lines.append(line)
            new_lines.append(lines[i+1])
            i += 2
        else:
            # We found the bad injection!
            # Keep space-y-3 but discard the text-xs line
            new_lines.append(line)
            i += 2 # skip the bad line
    else:
        new_lines.append(line)
        i += 1

with open("src/App.tsx", "w") as f:
    f.writelines(new_lines)
