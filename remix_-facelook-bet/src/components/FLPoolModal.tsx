import { useState } from "react";
import { X, Play, ShieldAlert, Award, UserCheck } from "lucide-react";

interface PoolChallenger {
  id: string;
  user: string;
  avatar: string;
  stake: number;
  prediction: string;
  status: "LIVE" | "UPCOMING";
  matchName: string;
  isProposedMarket?: boolean | "waiting" | "waiting_forced";
  proposedMarketToAcceptor?: string;
  opponentsPossibleStakes?: { selectionName: string, stake: number }[];
}

interface FLPoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  onMatchChallenge: (opponent: string, stake: number, matchName: string, prediction: string, isProposedMarket?: boolean | "waiting" | "waiting_forced", proposedMarketToAcceptor?: string) => void;
  filterMatchName?: string;
  customGlobalChallenges?: PoolChallenger[];
}

export default function FLPoolModal({
  isOpen,
  onClose,
  walletBalance,
  onMatchChallenge,
  filterMatchName,
  customGlobalChallenges = [],
}: FLPoolModalProps) {
  const [activeTab, setActiveTab] = useState<"match" | "global">("match");

  // Mock Active peer-to-peer challenges available in the global community pools
  const matchPools: PoolChallenger[] = [
    ...customGlobalChallenges,
    {
      id: "pc-1",
      user: "david_t",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=ffc107",
      stake: 150,
      prediction: "Draw (X) @3.40",
      status: "LIVE",
      matchName: "Manchester United vs Chelsea",
      isProposedMarket: true,
      proposedMarketToAcceptor: "Manchester United Win (1) or Chelsea Win (2)",
    },
    {
      id: "pc-2",
      user: "crypto_king",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Crypto&backgroundColor=00bcd4",
      stake: 300,
      prediction: "Chelsea Win @4.10",
      status: "UPCOMING",
      matchName: "Manchester United vs Chelsea",
      isProposedMarket: false,
    },
    {
      id: "pc-3",
      user: "sarah_l",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=4caf50",
      stake: 25,
      prediction: "Manchester United Win @1.75",
      status: "LIVE",
      matchName: "Manchester United vs Chelsea",
      isProposedMarket: true,
      proposedMarketToAcceptor: "Draw Game (X) @3.25",
    },
    {
      id: "pc-tt-1",
      user: "spin_master",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Spin&backgroundColor=4caf50",
      stake: 80,
      prediction: "Ma Long Win @2.20",
      status: "LIVE",
      matchName: "Ma Long vs Fan Zhendong",
      isProposedMarket: false,
    },
    {
      id: "pc-tt-2",
      user: "table_legend",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Table&backgroundColor=9c27b0",
      stake: 120,
      prediction: "Fan Zhendong Win @1.60",
      status: "LIVE",
      matchName: "Ma Long vs Fan Zhendong",
      isProposedMarket: true,
      proposedMarketToAcceptor: "Ma Long Win @2.20",
    },
    {
      id: "pc-bx-1",
      user: "iron_hook",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Iron&backgroundColor=f44336",
      stake: 200,
      prediction: "Tyson Fury Win @2.10",
      status: "UPCOMING",
      matchName: "Tyson Fury vs Oleksandr Usyk",
      isProposedMarket: true,
      proposedMarketToAcceptor: "Oleksandr Usyk Win @1.80",
    },
    {
      id: "pc-bx-2",
      user: "jab_artist",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jab&backgroundColor=ff9800",
      stake: 350,
      prediction: "Oleksandr Usyk Win @1.80",
      status: "UPCOMING",
      matchName: "Tyson Fury vs Oleksandr Usyk",
      isProposedMarket: false,
    },
    {
      id: "pc-bsk-1",
      user: "hoop_star",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hoop&backgroundColor=00bfc4",
      stake: 150,
      prediction: "Boston Celtics Win @1.45",
      status: "LIVE",
      matchName: "Boston Celtics vs Dallas Mavericks",
      isProposedMarket: true,
      proposedMarketToAcceptor: "Dallas Mavericks Win @2.85",
    },
    {
      id: "pc-bsk-2",
      user: "luka_magic",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luka&backgroundColor=3f51b5",
      stake: 220,
      prediction: "Dallas Mavericks Win @2.85",
      status: "LIVE",
      matchName: "Boston Celtics vs Dallas Mavericks",
      isProposedMarket: false,
    }
  ];

  // Filter challenges matches
  const filteredMatchPools = filterMatchName 
    ? matchPools.filter(p => p.matchName.toLowerCase() === filterMatchName.toLowerCase() || p.matchName.includes(filterMatchName))
    : matchPools;

  const globalPools: PoolChallenger[] = [
    {
      id: "gpc-1",
      user: "anonymous_shark",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shark&backgroundColor=3f51b5",
      stake: 1000,
      prediction: "Open Match - Challenger Chooses",
      status: "LIVE",
      matchName: "Real Madrid vs Barcelona",
      isProposedMarket: false,
    },
    {
      id: "gpc-2",
      user: "bet_master",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bet&backgroundColor=f44336",
      stake: 50,
      prediction: "Draw (X) Match @3.80",
      status: "UPCOMING",
      matchName: "Netherlands vs Sweden",
      isProposedMarket: true,
      proposedMarketToAcceptor: "Sweden Win @2.60",
    },
  ];

  if (!isOpen) return null;

  const handleMatch = (pc: PoolChallenger) => {
    if (walletBalance < pc.stake) {
      alert(`Your wallet balance is insufficient ($${walletBalance.toFixed(2)}) to match this P2P challenge of $${pc.stake.toFixed(2)}. deposit funds via the Wallet shortcut.`);
      return;
    }
    onMatchChallenge(pc.user, pc.stake, pc.matchName, pc.prediction, pc.isProposedMarket, pc.proposedMarketToAcceptor);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[1000] flex justify-center items-center p-4">
      <div className="bg-white dark:bg-[#242526] w-full max-w-3xl rounded-xl p-6 shadow-2xl border border-gray-200 dark:border-[#3e4042] flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center pb-3 border-b border-gray-150 dark:border-[#3e4042]">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              📊 LookUpto Active Escrow Pools
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Zero house margins. Real-time community liabilities matched using ratio algorithm ratios.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#323334] rounded-full text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex gap-2 my-4 bg-gray-100 dark:bg-[#18191a] p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("match")}
            className={`flex-1 py-2 font-bold text-xs rounded-md transition-all ${
              activeTab === "match"
                ? "bg-white dark:bg-[#242526] text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Match Specific Pools
          </button>
          <button
            onClick={() => setActiveTab("global")}
            className={`flex-1 py-2 font-bold text-xs rounded-md transition-all ${
              activeTab === "global"
                ? "bg-white dark:bg-[#242526] text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Global Community Channels
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-left">
          {activeTab === "match" ? (
            <div className="space-y-4">
              {/* High Rollers ($100+) */}
              <div>
                <h3 className="text-[10px] font-mono font-bold uppercase text-red-500 tracking-wider mb-2.5 flex items-center gap-1">
                  <Award className="w-4 h-4" /> Professional High Rollers ($100 - $500)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredMatchPools.filter(p => p.stake >= 100).map((pc) => (
                    <div key={pc.id} className="p-4 bg-gray-50 dark:bg-[#18191a] border border-gray-200 dark:border-zinc-800 rounded-xl relative overflow-hidden shadow-sm flex flex-col justify-between">
                      <div className="absolute top-0 right-0">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-bl ${
                          pc.status === "LIVE" ? "bg-red-500 text-white" : "bg-blue-600 text-white"
                        }`}>
                          {pc.status}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2.5 mb-2">
                          <img src={pc.avatar} className="w-8 h-8 rounded-full border border-gray-200" alt={pc.user} />
                          <div>
                            <span className="font-extrabold text-sm text-gray-800 dark:text-gray-200 block">Roller Name: @{pc.user}</span>
                            <span className="block text-[9px] text-gray-400 font-mono italic">{pc.matchName}</span>
                          </div>
                        </div>
                        <div className="space-y-1 bg-white/50 dark:bg-black/10 p-2 rounded-lg text-xs font-mono border border-gray-100 dark:border-zinc-800/50">
                          <div><span className="text-gray-400">Range:</span> <span className="text-red-500 font-bold">Professional High Roller ($100 - $500)</span></div>
                          <div><span className="text-gray-400">Total Stake:</span> <span className="text-gray-900 dark:text-white font-bold">${pc.stake.toFixed(2)}</span></div>
                          <div><span className="text-gray-400">Roller Market:</span> <span className="text-gray-905 dark:text-gray-200 font-bold">{pc.prediction}</span></div>
                          {pc.isProposedMarket === "waiting_forced" ? (
                            <div className="pt-1 mt-1 border-t border-gray-100/50 dark:border-zinc-800/30">
                              <span className="text-indigo-600 dark:text-indigo-400 font-bold text-[10px] block mb-0.5">⏳ Waiting Mode Bet (Forced)</span>
                              <span className="text-gray-800 dark:text-gray-200 font-bold">Must Accept: {pc.proposedMarketToAcceptor}</span>
                            </div>
                          ) : pc.isProposedMarket === "waiting" ? (
                            <div className="pt-1 mt-1 border-t border-gray-100/50 dark:border-zinc-800/30">
                              <span className="text-indigo-600 dark:text-indigo-400 font-bold text-[10px] block mb-0.5">⏳ Waiting Mode (3-Way Split)</span>
                              <span className="text-gray-800 dark:text-gray-200 font-bold">Acceptor can choose 1st counter-bet</span>
                            </div>
                          ) : pc.isProposedMarket ? (
                            <div className="pt-1 mt-1 border-t border-gray-100/50 dark:border-zinc-800/30">
                              <span className="text-amber-600 dark:text-amber-400 font-bold text-[10px] block mb-0.5">🔒 Proposed Market (Must Accept)</span>
                              <span className="text-gray-800 dark:text-gray-200 font-bold">{pc.proposedMarketToAcceptor || "Forced counter bet"}</span>
                            </div>
                          ) : (
                            <div className="pt-1 mt-1 border-t border-gray-100/50 dark:border-zinc-800/30">
                              <span className="text-indigo-650 dark:text-indigo-400 font-bold text-[10px] block mb-0.5">⚡ OP (Open Proposition)</span>
                              <span className="text-gray-500 dark:text-gray-400 italic font-bold block mb-1">Acceptor choice enabled - back your own selection!</span>
                              {pc.opponentsPossibleStakes && (
                                <div className="space-y-0.5 border-t border-dashed border-gray-200 dark:border-zinc-700/50 pt-1">
                                  <span className="text-[9px] text-gray-400 block mb-0.5">Available Market Liabilities (3-Way Target):</span>
                                  {pc.opponentsPossibleStakes.map((stake, idx) => (
                                    <div key={idx} className="flex justify-between text-[10px] text-gray-700 dark:text-gray-300">
                                      <span>{stake.selectionName}</span>
                                      <span className="font-bold">${stake.stake.toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-150 dark:border-zinc-800/60 pt-3 mt-3">
                        <div>
                          <span className="block text-[8px] text-gray-400 font-bold uppercase">TOTAL STAKE</span>
                          <span className="text-md font-black text-[#1877f2] dark:text-blue-400">${pc.stake.toFixed(2)}</span>
                        </div>
                        <button
                          onClick={() => handleMatch(pc)}
                          className="py-1.5 px-3 bg-[#31a24c] hover:bg-[#2b8f41] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm leading-none"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Accept Challenge
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredMatchPools.filter(p => p.stake >= 100).length === 0 && (
                    <div className="col-span-2 text-center text-xs py-4 text-gray-400 font-mono">
                      No high roller challenges proposed yet for this match.
                    </div>
                  )}
                </div>
              </div>

              {/* Casual Players (<100) */}
              <div className="pt-2">
                <h3 className="text-[10px] font-mono font-bold uppercase text-blue-500 tracking-wider mb-2.5 flex items-center gap-1">
                  <Play className="w-3 h-3 fill-blue-500" /> Casual Match Escrow ($10 - $99)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredMatchPools.filter(p => p.stake < 100).map((pc) => (
                    <div key={pc.id} className="p-4 bg-gray-50 dark:bg-[#18191a] border border-gray-200 dark:border-zinc-800 rounded-xl relative overflow-hidden shadow-sm flex flex-col justify-between">
                      <div className="absolute top-0 right-0">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-bl bg-red-500 text-white">
                          {pc.status}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2.5 mb-2">
                          <img src={pc.avatar} className="w-8 h-8 rounded-full border border-gray-300" alt={pc.user} />
                          <div>
                            <span className="font-extrabold text-sm text-gray-800 dark:text-gray-200 block">Roller Name: @{pc.user}</span>
                            <span className="block text-[9px] text-gray-400 font-mono italic">{pc.matchName}</span>
                          </div>
                        </div>
                        <div className="space-y-1 bg-white/50 dark:bg-black/10 p-2 rounded-lg text-xs font-mono border border-gray-100 dark:border-zinc-800/50">
                          <div><span className="text-gray-400">Range:</span> <span className="text-[#1877f2] font-bold">Casual Match Escrow ($10 - $99)</span></div>
                          <div><span className="text-gray-400">Total Stake:</span> <span className="text-gray-900 dark:text-white font-bold">${pc.stake.toFixed(2)}</span></div>
                          <div><span className="text-gray-400">Roller Market:</span> <span className="text-gray-905 dark:text-gray-200 font-bold">{pc.prediction}</span></div>
                          {pc.isProposedMarket === "waiting_forced" ? (
                            <div className="pt-1 mt-1 border-t border-gray-100/50 dark:border-zinc-800/30">
                              <span className="text-indigo-600 dark:text-indigo-400 font-bold text-[10px] block mb-0.5">⏳ Waiting Mode Bet (Forced)</span>
                              <span className="text-gray-800 dark:text-gray-200 font-bold">Must Accept: {pc.proposedMarketToAcceptor}</span>
                            </div>
                          ) : pc.isProposedMarket === "waiting" ? (
                            <div className="pt-1 mt-1 border-t border-gray-100/50 dark:border-zinc-800/30">
                              <span className="text-indigo-600 dark:text-indigo-400 font-bold text-[10px] block mb-0.5">⏳ Waiting Mode (3-Way Split)</span>
                              <span className="text-gray-800 dark:text-gray-200 font-bold">Acceptor can choose 1st counter-bet</span>
                            </div>
                          ) : pc.isProposedMarket ? (
                            <div className="pt-1 mt-1 border-t border-gray-100/50 dark:border-zinc-800/30">
                              <span className="text-amber-600 dark:text-amber-400 font-bold text-[10px] block mb-0.5">🔒 Proposed Market (Must Accept)</span>
                              <span className="text-gray-800 dark:text-gray-200 font-bold">{pc.proposedMarketToAcceptor || "Forced counter bet"}</span>
                            </div>
                          ) : (
                            <div className="pt-1 mt-1 border-t border-gray-100/50 dark:border-zinc-800/30">
                              <span className="text-indigo-650 dark:text-indigo-400 font-bold text-[10px] block mb-0.5">⚡ OP (Open Proposition)</span>
                              <span className="text-gray-500 dark:text-gray-400 italic font-bold block mb-1">Acceptor choice enabled - back your own selection!</span>
                              {pc.opponentsPossibleStakes && (
                                <div className="space-y-0.5 border-t border-dashed border-gray-200 dark:border-zinc-700/50 pt-1">
                                  <span className="text-[9px] text-gray-400 block mb-0.5">Available Market Liabilities (3-Way Target):</span>
                                  {pc.opponentsPossibleStakes.map((stake, idx) => (
                                    <div key={idx} className="flex justify-between text-[10px] text-gray-700 dark:text-gray-300">
                                      <span>{stake.selectionName}</span>
                                      <span className="font-bold">${stake.stake.toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-150 dark:border-zinc-800/60 pt-3 mt-3">
                        <div>
                          <span className="block text-[8px] text-gray-400 font-bold uppercase">TOTAL STAKE</span>
                          <span className="text-md font-black text-[#1877f2] dark:text-blue-400">${pc.stake.toFixed(2)}</span>
                        </div>
                        <button
                          onClick={() => handleMatch(pc)}
                          className="py-1.5 px-3 bg-[#31a24c] hover:bg-[#2b8f41] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm leading-none"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Accept Challenge
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredMatchPools.filter(p => p.stake < 100).length === 0 && (
                    <div className="col-span-2 text-center text-xs py-4 text-gray-400 font-mono">
                      No casual challenges proposed yet for this match.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/25 border border-yellow-200 dark:border-yellow-904/40 text-yellow-800 dark:text-yellow-200 rounded-lg flex items-start gap-2 text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Global pools represent open-challenge tickets. Escrow dynamically calculates ratios for whatever leagues chosen, allowing you to enter custom stakes securely.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {globalPools.map((pc) => (
                  <div key={pc.id} className="p-4 bg-gray-50 dark:bg-[#18191a] border border-gray-200 dark:border-zinc-800 rounded-xl relative overflow-hidden shadow-sm flex flex-col justify-between">
                    <div className="absolute top-0 right-0">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-bl bg-red-500 text-white">
                        {pc.status}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <img src={pc.avatar} className="w-8 h-8 rounded-full" alt={pc.user} />
                        <div>
                          <span className="font-extrabold text-sm text-gray-800 dark:text-gray-200">@{pc.user}</span>
                          <span className="block text-[9px] text-gray-400 font-mono italic">{pc.matchName}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mb-3 leading-tight">
                        Offer: <strong className="text-gray-700 dark:text-gray-300">{pc.prediction}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-150 dark:border-zinc-800/60 pt-3 mt-1">
                      <div>
                        <span className="block text-[8px] text-gray-400 font-bold uppercase">TOTAL CHALLENGE</span>
                        <span className="text-lg font-black text-[#1877f2] dark:text-blue-400">${pc.stake.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => handleMatch(pc)}
                        className="py-1.5 px-4 bg-[#31a24c] hover:bg-[#2b8f41] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm font-sans leading-none"
                      >
                        Accept Challenge
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
