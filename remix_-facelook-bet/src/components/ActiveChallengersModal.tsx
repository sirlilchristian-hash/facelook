import { useState } from "react";
import { X, ShieldAlert, Award, UserCheck, Gamepad2, Users, Flame, Zap, Coins, TrendingUp } from "lucide-react";

interface ActiveChallengersModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  matchName: string;
  userSelection: string; // "Home", "Draw", "Away"
  userStake: number;
  onJoinChallenge: () => void;
  numOpponents?: number; // 1 or 2
  targetMode?: "proposed" | "op";
  selectedOutcome?: "1" | "X" | "2";
  collabChallenges?: Array<any>;
  onJoinChallengeById?: (collabId: string, optionSymbol: string) => void;
  onContributeToCollab?: (collabId: string, amount: number) => void;
}

export default function ActiveChallengersModal({
  isOpen,
  onClose,
  walletBalance,
  matchName,
  userSelection,
  userStake,
  onJoinChallenge,
  numOpponents = 2,
  targetMode = "proposed",
  selectedOutcome = "1",
  collabChallenges = [],
  onJoinChallengeById,
  onContributeToCollab
}: ActiveChallengersModalProps) {
  const [activeTab, setActiveTab] = useState<"opposite" | "direct">("opposite");
  const [poolAmount, setPoolAmount] = useState<number>(20);

  if (!isOpen) return null;

  // 1. Handling for 3-Way Match Mode (numOpponents === 2)
  const mock3WayChallenges = [
    {
      id: "ac-1",
      user1: "AlexMorgan",
      user2: "JohnDoe22",
      stakePerUser: userStake,
      totalPool: userStake * 2,
    },
    {
      id: "ac-2",
      user1: "ProBettor99",
      user2: "NairobiKing",
      stakePerUser: userStake,
      totalPool: userStake * 2,
    }
  ];

  const handleJoin3Way = (challenge: any) => {
    if (walletBalance < userStake) {
      alert(`Insufficient balance. You need $${userStake.toFixed(2)} to join this 3-way match.`);
      return;
    }
    onJoinChallenge();
    onClose();
  };

  // 2. Handling for 1v1 Challenge Mode (numOpponents === 1)
  // Filter active 1v1 challenges
  const active1v1 = collabChallenges.filter(
    c => c.numOpponents === 1 && (c.status === "posted" || c.status === "collecting")
  );

  // Split into challenges on CURRENT match vs OTHER matches
  const currentMatch1v1 = active1v1.filter(c => c.matchName === matchName);
  const otherMatch1v1 = active1v1.filter(c => c.matchName !== matchName);

  // If we have current match 1v1 challenges, use them. Otherwise, fall back to other live matches.
  const display1v1 = currentMatch1v1.length > 0 ? currentMatch1v1 : otherMatch1v1;
  const isFallbackMatch = currentMatch1v1.length === 0 && otherMatch1v1.length > 0;

  // Classify 1v1 challenges into Opposite vs Direct
  // Opposite: c.selectedOutcome !== selectedOutcome
  // Direct: c.selectedOutcome === selectedOutcome
  const opposite1v1 = display1v1.filter(c => c.selectedOutcome !== selectedOutcome);
  const direct1v1 = display1v1.filter(c => c.selectedOutcome === selectedOutcome);

  const handleMatchOpponent = (challenge: any) => {
    const cost = challenge.targetTotalStake;
    if (walletBalance < cost) {
      alert(`Insufficient balance. You need $${cost.toFixed(2)} to meet this opponent.`);
      return;
    }
    if (onJoinChallengeById) {
      // Join using current user selection
      onJoinChallengeById(challenge.id, selectedOutcome);
      onClose();
    }
  };

  const handlePoolStakes = (challenge: any) => {
    const remaining = challenge.targetTotalStake - challenge.currentTotalStake;
    const actualContribution = Math.min(poolAmount, remaining);
    if (actualContribution <= 0) {
      alert("This pool is already fully funded!");
      return;
    }
    if (walletBalance < actualContribution) {
      alert(`Insufficient balance to contribute $${actualContribution.toFixed(2)}.`);
      return;
    }
    if (onContributeToCollab) {
      onContributeToCollab(challenge.id, actualContribution);
      alert(`Successfully contributed $${actualContribution.toFixed(2)} to coordinate stakes with @${challenge.creator}!`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-[1100] flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1e1f21] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-gray-150 dark:border-zinc-800 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-zinc-850 bg-gray-50/50 dark:bg-black/10 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div className="text-left font-sans">
              <h3 className="text-sm font-black text-gray-900 dark:text-white leading-none">👥 Active Challengers</h3>
              <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 block mt-0.5">
                {numOpponents === 1 ? "1v1 Peer Staking Hub" : "3-Way Match Completion"}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors text-gray-400 hover:text-gray-900 dark:text-gray-300 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto font-sans flex-1 space-y-4">

          {numOpponents === 2 ? (
            // 3-WAY MATCH MODE (ORIGINAL FLOW)
            <div className="space-y-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono font-medium leading-relaxed bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10">
                These active 1v1 challenges need a 3rd person backing <strong className="text-indigo-600 dark:text-indigo-400">"{userSelection}"</strong> to complete the 3-Way Match. Match the stake to join!
              </p>

              <div className="space-y-3 pt-1">
                {mock3WayChallenges.map((challenge) => (
                  <div key={challenge.id} className="p-3 bg-white dark:bg-[#18191a] rounded-xl border border-gray-150 dark:border-zinc-800 hover:border-indigo-500/40 transition-all text-left">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex -space-x-2">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(challenge.user1)}&backgroundColor=1877f2`} className="w-6 h-6 rounded-full border border-white dark:border-[#18191a]" />
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(challenge.user2)}&backgroundColor=f59e0b`} className="w-6 h-6 rounded-full border border-white dark:border-[#18191a]" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 font-mono uppercase bg-gray-100 dark:bg-zinc-900 px-2 py-0.5 rounded">
                        3-Way Match
                      </span>
                    </div>
                    
                    <div className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
                      <span className="text-blue-600 dark:text-blue-400">@{challenge.user1}</span> vs <span className="text-amber-600 dark:text-amber-500">@{challenge.user2}</span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-zinc-850">
                      <div className="text-[10px] font-mono">
                        <span className="text-gray-500">Stake required:</span> <strong className="text-indigo-600 dark:text-indigo-400">${challenge.stakePerUser.toFixed(2)}</strong>
                      </div>
                      <button
                        onClick={() => handleJoin3Way(challenge)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        Join & Place Bet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // 1v1 MATCH MODE (NEW PEER STAKING HUB)
            <div className="space-y-4">
              <div className="bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10 space-y-1">
                <div className="text-xs font-black text-gray-900 dark:text-white">
                  🏟️ Current Selection: {matchName}
                </div>
                <div className="text-[10.5px] text-gray-500 dark:text-gray-400 leading-tight">
                  You are preparing a 1v1 challenge backing <strong className="text-indigo-600 dark:text-indigo-400">"{userSelection}"</strong> at <strong className="font-mono text-amber-600 dark:text-amber-400">${userStake.toFixed(2)}</strong> stake. Meet peers to secure an instant match!
                </div>
              </div>

              {/* Sub-tabs for Opposite vs Direct */}
              <div className="grid grid-cols-2 p-1 bg-gray-100 dark:bg-zinc-900 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab("opposite")}
                  className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === "opposite"
                      ? "bg-white dark:bg-[#1e1f21] text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  🎯 Opposite Challengers ({opposite1v1.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("direct")}
                  className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === "direct"
                      ? "bg-white dark:bg-[#1e1f21] text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  🤝 Same Predictions ({direct1v1.length})
                </button>
              </div>

              {isFallbackMatch && (
                <div className="px-2.5 py-1.5 bg-amber-500/10 dark:bg-amber-500/5 rounded-lg border border-amber-500/20 text-[9.5px] text-amber-700 dark:text-amber-400 font-bold font-mono">
                  💡 Showing other active live matches in network pool
                </div>
              )}

              {/* CHALLENGE LIST */}
              {activeTab === "opposite" ? (
                // OPPOSITE CHALLENGERS
                <div className="space-y-2.5">
                  <p className="text-[10.5px] text-gray-500 dark:text-gray-400 leading-tight">
                    Back your <strong>{userSelection}</strong> selection directly against these open peer challenges who predicted the opposite:
                  </p>

                  {opposite1v1.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 dark:bg-zinc-900/40 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800">
                      <p className="text-[11px] text-gray-400">No matching opposite peer challengers right now.</p>
                      <span className="text-[9px] text-gray-500 mt-1 block">Publish your challenge to invite buddies!</span>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {opposite1v1.map((c) => (
                        <div key={c.id} className="p-3 bg-white dark:bg-zinc-900/40 rounded-xl border border-gray-150 dark:border-zinc-800/80 hover:border-indigo-500/30 transition-all text-left">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9.5px] text-gray-400 font-mono font-bold block uppercase">{c.matchName}</span>
                              <div className="text-xs font-extrabold text-gray-800 dark:text-gray-200 mt-0.5 flex items-center gap-1">
                                <span className="text-indigo-600 dark:text-indigo-400">@{c.creator}</span>
                                <span className="text-[9.5px] font-normal text-gray-400">backs</span>
                                <span className="text-rose-500 dark:text-rose-400 font-bold">{c.prediction}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[8.5px] font-mono text-gray-400 block font-bold">THEIR STAKE</span>
                              <span className="text-xs font-black font-mono text-gray-900 dark:text-white">${c.targetTotalStake.toFixed(2)}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-zinc-800/60">
                            <div className="text-[9.5px] text-gray-500 dark:text-gray-400 flex items-center gap-1 font-mono">
                              <Coins className="w-3 h-3 text-amber-500" />
                              <span>Your Stake:</span>
                              <strong className="text-gray-800 dark:text-gray-200">${c.targetTotalStake.toFixed(2)}</strong>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleMatchOpponent(c)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wide transition-all shadow-sm cursor-pointer hover:scale-[1.01] flex items-center gap-1"
                            >
                              <Zap className="w-3 h-3" />
                              Match & Escrow
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // DIRECT PROPOSED SAME PREDICTION
                <div className="space-y-2.5">
                  <p className="text-[10.5px] text-gray-500 dark:text-gray-400 leading-tight">
                    Pool your stake alongside these active peers who are backing the <strong>same prediction</strong>. Share stakes to build a powerful multi-peer joint escrow!
                  </p>

                  <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/20 p-2 rounded-lg border border-indigo-150 text-[10px] text-indigo-750 dark:text-indigo-300 font-medium font-sans">
                    <span className="text-indigo-500 text-xs">💰</span>
                    <div className="flex-1 flex justify-between items-center">
                      <span>Deducted contribution stake:</span>
                      <select
                        value={poolAmount}
                        onChange={(e) => setPoolAmount(Number(e.target.value))}
                        className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-[10px] font-extrabold rounded p-0.5 outline-none font-mono"
                      >
                        <option value={10}>$10.00</option>
                        <option value={20}>$20.00</option>
                        <option value={50}>$50.00</option>
                        <option value={100}>$100.00</option>
                      </select>
                    </div>
                  </div>

                  {direct1v1.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 dark:bg-zinc-900/40 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800">
                      <p className="text-[11px] text-gray-400">No peer same-prediction pools exist right now.</p>
                      <span className="text-[9px] text-gray-500 mt-1 block">Start a new group pool to invite colleagues!</span>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {direct1v1.map((c) => {
                        const remaining = c.targetTotalStake - c.currentTotalStake;
                        const progress = (c.currentTotalStake / c.targetTotalStake) * 100;
                        return (
                          <div key={c.id} className="p-3 bg-white dark:bg-zinc-900/40 rounded-xl border border-gray-150 dark:border-zinc-800/80 hover:border-indigo-500/30 transition-all text-left">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[9.5px] text-gray-400 font-mono font-bold block uppercase">{c.matchName}</span>
                                <div className="text-xs font-extrabold text-gray-800 dark:text-gray-200 mt-0.5 flex items-center gap-1">
                                  <span className="text-emerald-600">@{c.creator}</span>
                                  <span className="text-[9.5px] font-normal text-gray-400">backing</span>
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{c.prediction}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-[8.5px] font-mono text-gray-400 block font-bold">TARGET TOTAL</span>
                                <span className="text-xs font-black font-mono text-gray-900 dark:text-white">${c.targetTotalStake.toFixed(2)}</span>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-2.5 space-y-1">
                              <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                                <span>Funded: <strong>${c.currentTotalStake.toFixed(2)}</strong></span>
                                <span>{progress.toFixed(0)}%</span>
                              </div>
                              <div className="w-full bg-gray-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style={{ width: `${Math.min(100, progress)}%` }}></div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-zinc-800/60">
                              <span className="text-[9.5px] text-gray-500 dark:text-gray-400 font-mono">
                                Remaining needed: <strong className="text-amber-600 dark:text-amber-400">${remaining.toFixed(2)}</strong>
                              </span>
                              <button
                                type="button"
                                onClick={() => handlePoolStakes(c)}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wide transition-all shadow-sm cursor-pointer hover:scale-[1.01] flex items-center gap-1"
                              >
                                <Users className="w-3 h-3" />
                                Pool Stakes
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
