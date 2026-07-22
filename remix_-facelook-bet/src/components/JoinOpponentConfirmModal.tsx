import { useState, useEffect } from "react";
import { X, Check, Gamepad2, Info, User, HelpCircle, TrendingUp } from "lucide-react";

interface JoinOpponentConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: any;
  onConfirm: (collabId: string, optionSymbol: string, joinerName?: string) => void;
}

export default function JoinOpponentConfirmModal({
  isOpen,
  onClose,
  challenge,
  onConfirm
}: JoinOpponentConfirmModalProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const [joinerName, setJoinerName] = useState<string>("Collins Dnego (You)");
  const [isBot, setIsBot] = useState<boolean>(false);

  // Automatically pre-select the appropriate outcome based on targetMode and opponents
  useEffect(() => {
    if (!challenge) return;

    const home = challenge.match?.homeTeam || "";
    const away = challenge.match?.awayTeam || "";
    const creatorSymbol = challenge.selectedOutcome || "1";

    const allOutcomes = [
      { symbol: "1", label: `Home (${home})`, odd: challenge.match?.odds?.["1"] || 2.0 },
      { symbol: "X", label: "Draw (X)", odd: challenge.match?.odds?.X || 3.0 },
      { symbol: "2", label: `Away (${away})`, odd: challenge.match?.odds?.["2"] || 3.0 }
    ];

    const remainingOutcomes = allOutcomes.filter(o => o.symbol !== creatorSymbol);

    if (challenge.numOpponents === 1) {
      if (challenge.targetMode === "op") {
        // OP mode: user can choose. Default to the first remaining outcome.
        setSelectedSymbol(remainingOutcomes[0]?.symbol || "");
      } else {
        // Proposed mode: locked into the custom designated outcome if available.
        const designatedSymbol = challenge.opponentsTargets?.[0]?.symbol;
        setSelectedSymbol(designatedSymbol || remainingOutcomes[0]?.symbol || "");
      }
    } else {
      // 3-Way Mode
      if (challenge.opponents.length === 0) {
        // 1st opponent: gets to choose from remaining outcomes. Default to first.
        setSelectedSymbol(remainingOutcomes[0]?.symbol || "");
      } else {
        // 2nd opponent: locked into the remainingProposedMarket.
        setSelectedSymbol(challenge.remainingProposedMarket || "2");
      }
    }
  }, [challenge]);

  if (!isOpen || !challenge) return null;

  const matchObj = challenge.match;
  const home = matchObj?.homeTeam || "";
  const away = matchObj?.awayTeam || "";
  const creatorSymbol = challenge.selectedOutcome || "1";

  // Build outcomes
  const allOutcomes = [
    { symbol: "1", label: `Home (${home})`, odd: matchObj?.odds?.["1"] || 2.0 },
    { symbol: "X", label: "Draw (X)", odd: matchObj?.odds?.X || 3.0 },
    { symbol: "2", label: `Away (${away})`, odd: matchObj?.odds?.["2"] || 3.0 }
  ];

  const remainingOutcomes = allOutcomes.filter(o => o.symbol !== creatorSymbol);

  // Determine if user has a choice
  let isChoiceMode = false;
  let fixedOutcome: any = null;

  if (challenge.numOpponents === 1) {
    if (challenge.targetMode === "op") {
      isChoiceMode = true;
    } else {
      isChoiceMode = false;
      const designatedOpp = challenge.opponentsTargets?.[0];
      const designatedSymbol = designatedOpp?.symbol;
      fixedOutcome = remainingOutcomes.find(o => o.symbol === designatedSymbol) || designatedOpp || remainingOutcomes[0];
    }
  } else {
    if (challenge.opponents.length === 0) {
      isChoiceMode = true;
    } else {
      isChoiceMode = false;
      const forceSymbol = challenge.remainingProposedMarket || "2";
      fixedOutcome = allOutcomes.find(o => o.symbol === forceSymbol) || remainingOutcomes[1] || remainingOutcomes[0];
    }
  }

  // Calculate stake
  const requiredStake = challenge.numOpponents === 1 
    ? challenge.targetTotalStake 
    : (challenge.targetTotalStake / 2);

  // Calculate potential payout based on selected odd
  const activeOutcome = isChoiceMode 
    ? allOutcomes.find(o => o.symbol === selectedSymbol) 
    : fixedOutcome;

  const activeOdd = activeOutcome?.odd || 2.0;
  const potentialPayout = requiredStake * activeOdd;

  const handleYes = () => {
    const symbolToSend = isChoiceMode ? selectedSymbol : (fixedOutcome?.symbol || "2");
    if (isChoiceMode && !symbolToSend) {
      alert("Please select an outcome choice first!");
      return;
    }
    const finalName = isBot ? "" : joinerName; // Empty triggers random simulation bot name in performance
    onConfirm(challenge.id, symbolToSend, finalName);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-[1100] flex justify-center items-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-[#1e1f21] rounded-2xl shadow-2xl overflow-hidden border border-gray-150 dark:border-zinc-800 flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-zinc-850 bg-gray-50/50 dark:bg-black/10 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-black text-gray-900 dark:text-white leading-none">⚡ Join Escrow Challenge</h3>
              <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 block mt-0.5">Confirmation Window</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors text-gray-400 hover:text-gray-900 dark:text-gray-300 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 text-left overflow-y-auto max-h-[75vh]">
          
          {/* Match & Stake info */}
          <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-150/40 dark:border-indigo-900/20 rounded-xl space-y-2">
            <span className="text-[8px] uppercase font-mono tracking-widest font-extrabold text-indigo-600 dark:text-indigo-400 block">
              Escrow Match Details
            </span>
            <div className="text-xs font-black text-gray-900 dark:text-white">
              🏟️ {home} vs {away}
            </div>
            <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-400 font-medium pt-1 border-t border-indigo-100/30">
              <span>Challenge Creator:</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{challenge.creator}</span>
            </div>
            <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-400 font-medium">
              <span>Creator Prediction:</span>
              <span className="font-bold text-emerald-500">{challenge.prediction}</span>
            </div>
            <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-400 font-medium">
              <span>Escrow Type:</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                {challenge.numOpponents === 1 ? "1v1 Escrow" : "3-Way Escrow"}
              </span>
            </div>
          </div>

          {/* Decimals & Choice Selection */}
          <div className="space-y-2">
            {isChoiceMode ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-[9.5px] uppercase font-mono tracking-wider text-purple-600 dark:text-purple-400 font-extrabold flex items-center gap-1">
                    <span>👐</span> Choose Your Match Odds Decimal
                  </span>
                  <span className="text-[8.5px] text-gray-400 font-mono font-bold">Open Prop Choice (OP)</span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                  This challenge has custom open odds decimals. Choose which of the remaining outcomes you wish to back:
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {remainingOutcomes.map((out) => {
                    const isSelected = selectedSymbol === out.symbol;
                    return (
                      <button
                        key={out.symbol}
                        type="button"
                        onClick={() => setSelectedSymbol(out.symbol)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-center items-center ${
                          isSelected 
                            ? "bg-amber-500 border-amber-600 text-black shadow-md scale-[1.02]" 
                            : "bg-white dark:bg-[#18191a] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-zinc-800 hover:border-amber-400"
                        }`}
                      >
                        <span className="text-[10.5px] font-bold truncate max-w-full">{out.label}</span>
                        <span className={`text-[12px] font-black font-mono mt-0.5 ${isSelected ? "text-black" : "text-amber-600 dark:text-amber-400"}`}>
                          @{out.odd.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-[9.5px] uppercase font-mono tracking-wider text-blue-600 dark:text-blue-400 font-extrabold flex items-center gap-1">
                    <span>📋</span> Proposed Match Odds Decimal
                  </span>
                  <span className="text-[8.5px] text-gray-400 font-mono font-bold">Proposed Challenge</span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                  This challenge was pre-configured with a proposed target outcome and fixed decimal odds:
                </p>

                <div className="p-3 bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/30 rounded-xl flex items-center justify-between mt-1">
                  <div>
                    <span className="text-[9px] text-gray-400 block font-mono font-bold">Your Backing Selection:</span>
                    <span className="text-[11.5px] font-extrabold text-gray-900 dark:text-white">
                      {fixedOutcome?.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-gray-400 block font-mono font-bold">Fixed Odds:</span>
                    <span className="text-sm font-black font-mono text-amber-600 dark:text-amber-400">
                      @{fixedOutcome?.odd.toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bet details & Potential Payout */}
          <div className="p-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl space-y-2">
            <span className="text-[8.5px] uppercase font-mono tracking-wider text-gray-500 dark:text-gray-400 font-extrabold block">
              💰 Escrow Stake & Payout Breakdown
            </span>
            
            <div className="grid grid-cols-2 gap-2 text-center pt-1 font-sans">
              <div className="bg-white dark:bg-[#18191a] p-2 rounded-lg border border-gray-150 dark:border-zinc-800">
                <span className="text-[8.5px] text-gray-400 block font-mono font-bold">YOUR STAKE</span>
                <span className="text-xs font-black text-gray-900 dark:text-white">${requiredStake.toFixed(2)}</span>
              </div>
              <div className="bg-white dark:bg-[#18191a] p-2 rounded-lg border border-gray-150 dark:border-zinc-800">
                <span className="text-[8.5px] text-gray-400 block font-mono font-bold text-emerald-600 dark:text-emerald-400">EST. PAYOUT</span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-0.5">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  ${potentialPayout.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Identity input / Simulated Join choice */}
          <div className="space-y-2">
            <span className="block text-[8.5px] uppercase font-mono tracking-wider text-gray-400 font-bold">
              👤 Choose Identity To Place Bet
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsBot(false)}
                className={`flex-1 py-1.5 px-2.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  !isBot 
                    ? "bg-indigo-600 border-indigo-700 text-white shadow-sm" 
                    : "bg-white dark:bg-[#18191a] text-gray-700 dark:text-gray-300 border-gray-250 dark:border-zinc-800 hover:bg-gray-50"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Your Own Name
              </button>
              <button
                type="button"
                onClick={() => setIsBot(true)}
                className={`flex-1 py-1.5 px-2.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  isBot 
                    ? "bg-indigo-600 border-indigo-700 text-white shadow-sm" 
                    : "bg-white dark:bg-[#18191a] text-gray-700 dark:text-gray-300 border-gray-250 dark:border-zinc-800 hover:bg-gray-50"
                }`}
              >
                🤖
                Bot Simulator
              </button>
            </div>

            {!isBot && (
              <div className="space-y-1 pt-1">
                <label className="block text-[8px] text-gray-400 font-mono font-bold uppercase">Staker Name / Alias</label>
                <input
                  type="text"
                  value={joinerName}
                  onChange={(e) => setJoinerName(e.target.value)}
                  className="w-full bg-white dark:bg-[#18191a] border border-gray-200 dark:border-zinc-800 rounded-lg p-1.5 text-xs font-bold outline-none text-gray-900 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* Yes/No confirmation prompt */}
          <div className="pt-2 border-t border-gray-100 dark:border-zinc-850 space-y-3">
            <div className="flex items-start gap-1.5 p-2 bg-yellow-500/5 border border-yellow-500/20 rounded-lg text-[10px] text-amber-800 dark:text-amber-400 font-medium">
              <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                By backing this selection, you agree to lock <strong>${requiredStake.toFixed(2)}</strong> into the decentralized collaborative escrow pool. Let the match result resolve!
              </span>
            </div>

            <div className="text-center py-1">
              <span className="text-xs font-black text-gray-800 dark:text-gray-200 flex items-center justify-center gap-1.5 font-sans">
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                Confirm joining this escrow challenge?
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1 font-sans">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 bg-gray-100 hover:bg-gray-250 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200 text-xs font-black rounded-xl border border-gray-300/20 text-center cursor-pointer transition-all shadow-sm"
              >
                No, Cancel
              </button>
              <button
                type="button"
                onClick={handleYes}
                className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl text-center cursor-pointer transition-all shadow-md hover:scale-[1.01] flex items-center justify-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Yes, Place Bet
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
