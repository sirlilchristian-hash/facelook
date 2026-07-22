import React, { useState } from "react";
import { X, ChevronDown, ChevronUp, Shield, HelpCircle, Trophy, Sparkles, Star } from "lucide-react";
import { Match } from "../types";

interface GameHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match;
  onSelectOdd: (m: Match, oddName: string, oddValue: number) => void;
}

export default function GameHubModal({ isOpen, onClose, match, onSelectOdd }: GameHubModalProps) {
  if (!isOpen) return null;

  // Active sub-category tabs
  type CategoryTab = "All Markets" | "Main" | "First Half" | "Goals" | "Cards and Corners";
  const [activeTab, setActiveTab] = useState<CategoryTab>("All Markets");

  // Custom collapsed sections state
  const [collapsed, setCollapsed] = useState({
    oneXtwo: false,
    nextGoal: false,
    totalOverUnder: false,
    btts: false,
    corners: false,
  });

  const toggleSection = (section: keyof typeof collapsed) => {
    setCollapsed((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Generate dynamic odds offsets relative to standard 1X2 odds to make it feel extremely realistic & live!
  const hOdds = match.odds["1"];
  const dOdds = match.odds.X;
  const aOdds = match.odds["2"];

  // Secondary market values derived dynamically
  const nextGoalHome = Math.max(1.15, (hOdds * 0.9)).toFixed(2);
  const nextGoalNone = Math.max(2.1, (dOdds * 0.8)).toFixed(2);
  const nextGoalAway = Math.max(1.15, (aOdds * 0.9)).toFixed(2);

  const totalOver = Math.max(1.35, (hOdds * 0.75)).toFixed(2);
  const totalUnder = Math.max(1.45, (aOdds * 0.85)).toFixed(2);

  const bttsYes = Math.max(1.4, (dOdds * 0.4)).toFixed(2);
  const bttsNo = Math.max(1.3, (hOdds * 0.7)).toFixed(2);

  const totalCornersOver = "1.85";
  const totalCornersUnder = "1.92";

  // Filter sections based on active category tabs
  const shouldShowSection = (section: string) => {
    if (activeTab === "All Markets") return true;
    if (activeTab === "Main") return ["oneXtwo", "btts"].includes(section);
    if (activeTab === "First Half") return ["oneXtwo"].includes(section);
    if (activeTab === "Goals") return ["nextGoal", "totalOverUnder", "btts"].includes(section);
    if (activeTab === "Cards and Corners") return ["corners"].includes(section);
    return true;
  };

  const handleSelectMarketOption = (optionLabel: string, oddsValStr: string) => {
    const numericOdds = parseFloat(oddsValStr) || 1.80;
    // Call existing App handler to select this odd for the Ratio Slip
    onSelectOdd(match, optionLabel, numericOdds);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-[2300] flex justify-center items-end sm:items-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full sm:max-w-md bg-[#121314] text-gray-100 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-zinc-800/80 flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden"
        id="betika-game-hub"
      >
        {/* Betika Branded Top Utilities Bar */}
        <div className="px-4 py-3 bg-[#1e1f21] border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-[#a3e635] text-[#121314] text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider shadow-xs font-mono">
              ★ Betika! Hub
            </span>
            <span className="text-[10px] text-gray-400 font-mono">Game Hub Match Live Center</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-800 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Scoreboard Header Panel */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-[#18191b] to-[#121314] border-b border-zinc-800/80 shrink-0 text-center relative overflow-hidden select-none">
          {/* Decorative backdrop graphics */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

          <div className="text-[9px] text-emerald-400 font-mono font-bold tracking-widest uppercase mb-1">
            ⚽ {match.league}
          </div>

          <div className="grid grid-cols-7 items-center justify-between gap-1 mt-2 relative z-10">
            {/* Home Team */}
            <div className="col-span-3 text-right">
              <span className="block text-xs text-gray-400 font-mono mb-1">HOME TEAM</span>
              <span className="font-extrabold text-sm sm:text-base text-white block line-clamp-2 leading-tight">
                {match.homeTeam}
              </span>
            </div>

            {/* LIVE SCORE & CLOCK */}
            <div className="col-span-1 flex flex-col items-center justify-center">
              <div className="text-xl font-black text-[#a3e635] font-mono tracking-wider">
                {match.status === "LIVE" ? (match.score || "1:0") : "0:0"}
              </div>
              <div className="text-[8.5px] text-red-500 font-mono font-bold whitespace-nowrap animate-pulse mt-0.5 bg-red-500/10 px-1 py-0.5 rounded">
                {match.status === "LIVE" ? "45:10' 1st half" : "UPCOMING"}
              </div>
            </div>

            {/* Away Team */}
            <div className="col-span-3 text-left">
              <span className="block text-xs text-gray-400 font-mono mb-1">AWAY TEAM</span>
              <span className="font-extrabold text-sm sm:text-base text-white block line-clamp-2 leading-tight">
                {match.awayTeam}
              </span>
            </div>
          </div>

          {/* Quick Statistics Banner */}
          <div className="mt-4 pt-3 border-t border-zinc-800/70 flex justify-center items-center gap-4 text-[10px] text-gray-400 font-mono">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-800/60 text-yellow-400 border border-yellow-500/10">
              🟨 1 yellow card
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-800/60 text-white border border-zinc-700/20">
              📊 3 corners
            </span>
            <span className="text-emerald-500 text-[9px] font-bold">
              ● Match Live Tracker Connected
            </span>
          </div>
        </div>

        {/* Categories Horizontal Scrolling Tab Selection */}
        <div className="bg-[#18191b] px-3.5 py-2 border-b border-zinc-800/70 shrink-0 select-none overflow-x-auto scrollbar-none flex gap-1.5 whitespace-nowrap">
          {(["All Markets", "Main", "First Half", "Goals", "Cards and Corners"] as CategoryTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-[10.5px] font-bold rounded-full transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-[#a3e635] text-[#121314] shadow-xs"
                  : "bg-[#252628] text-gray-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Markets Collapsible Stack Body */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#111213]">
          {/* ACCORDION 1: 1x2 */}
          {shouldShowSection("oneXtwo") && (
            <div className="border border-zinc-800/80 rounded-xl overflow-hidden bg-[#18191b]">
              <button
                onClick={() => toggleSection("oneXtwo")}
                className="w-full px-3 py-2.5 bg-[#1c1d1f] hover:bg-zinc-800 flex justify-between items-center text-xs font-black font-sans uppercase tracking-wide cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-1 text-gray-100">
                  <span className="text-emerald-400">⚡</span> 1X2 Standard Outcome
                </span>
                {collapsed.oneXtwo ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-white" />}
              </button>

              {!collapsed.oneXtwo && (
                <div className="p-3 grid grid-cols-3 gap-2 animate-in fade-in duration-100">
                  <button 
                    onClick={() => handleSelectMarketOption(`${match.homeTeam} (Home Win)`, hOdds.toFixed(2))}
                    className="p-2.5 bg-[#252628] hover:bg-[#a3e635]/10 hover:border-[#a3e635]/40 rounded-lg border border-zinc-800 text-left transition-all relative cursor-pointer"
                  >
                    <span className="block text-[8px] text-gray-400 font-bold">1 (Home)</span>
                    <span className="text-gray-200 text-xs font-mono font-bold block truncate">{match.homeTeam}</span>
                    <span className="text-sm font-black text-[#a3e635] block mt-1 tracking-wider">@{hOdds.toFixed(2)}</span>
                  </button>

                  <button 
                    onClick={() => handleSelectMarketOption("Draw", dOdds.toFixed(2))}
                    className="p-2.5 bg-[#252628] hover:bg-[#a3e635]/10 hover:border-[#a3e635]/40 rounded-lg border border-zinc-800 text-left transition-all relative cursor-pointer"
                  >
                    <span className="block text-[8px] text-gray-400 font-bold">X (Draw)</span>
                    <span className="text-gray-200 text-xs font-mono font-bold block truncate">Draw Settlement</span>
                    <span className="text-sm font-black text-[#a3e635] block mt-1 tracking-wider">@{dOdds.toFixed(2)}</span>
                  </button>

                  <button 
                    onClick={() => handleSelectMarketOption(`${match.awayTeam} (Away Win)`, aOdds.toFixed(2))}
                    className="p-2.5 bg-[#252628] hover:bg-[#a3e635]/10 hover:border-[#a3e635]/40 rounded-lg border border-zinc-800 text-left transition-all relative cursor-pointer"
                  >
                    <span className="block text-[8px] text-gray-400 font-bold">2 (Away)</span>
                    <span className="text-gray-200 text-xs font-mono font-bold block truncate">{match.awayTeam}</span>
                    <span className="text-sm font-black text-[#a3e635] block mt-1 tracking-wider">@{aOdds.toFixed(2)}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ACCORDION 2: Who Will Score 2nd Goal */}
          {shouldShowSection("nextGoal") && (
            <div className="border border-zinc-800/80 rounded-xl overflow-hidden bg-[#18191b]">
              <button
                onClick={() => toggleSection("nextGoal")}
                className="w-full px-3 py-2.5 bg-[#1c1d1f] hover:bg-zinc-800 flex justify-between items-center text-xs font-black font-sans uppercase tracking-wide cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-1 text-gray-100">
                  <span className="text-amber-400">⚽</span> Who Will Score 2nd Goal
                </span>
                {collapsed.nextGoal ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-white" />}
              </button>

              {!collapsed.nextGoal && (
                <div className="p-3 grid grid-cols-3 gap-2 animate-in fade-in duration-100">
                  <button 
                    onClick={() => handleSelectMarketOption(`${match.homeTeam} to Score 2nd Goal`, nextGoalHome)}
                    className="p-2.5 bg-[#252628] hover:bg-[#a3e635]/10 hover:border-[#a3e635]/40 rounded-lg border border-zinc-800 text-left transition-all relative cursor-pointer"
                  >
                    <span className="block text-[8px] text-gray-400 font-bold">1 (Home)</span>
                    <span className="text-gray-250 text-xs font-bold block truncate">Home Team</span>
                    <span className="text-sm font-black text-[#a3e635] block mt-1">@{nextGoalHome}</span>
                  </button>

                  <button 
                    onClick={() => handleSelectMarketOption("No 2nd Goal Scored", nextGoalNone)}
                    className="p-2.5 bg-[#252628] hover:bg-[#a3e635]/10 hover:border-[#a3e635]/40 rounded-lg border border-zinc-800 text-left transition-all relative cursor-pointer"
                  >
                    <span className="block text-[8px] text-gray-400 font-bold">None</span>
                    <span className="text-gray-250 text-xs font-bold block truncate">No Scorer</span>
                    <span className="text-sm font-black text-[#a3e635] block mt-1">@{nextGoalNone}</span>
                  </button>

                  <button 
                    onClick={() => handleSelectMarketOption(`${match.awayTeam} to Score 2nd Goal`, nextGoalAway)}
                    className="p-2.5 bg-[#252628] hover:bg-[#a3e635]/10 hover:border-[#a3e635]/40 rounded-lg border border-zinc-800 text-left transition-all relative cursor-pointer"
                  >
                    <span className="block text-[8px] text-gray-400 font-bold">2 (Away)</span>
                    <span className="text-gray-250 text-xs font-bold block truncate">Away Team</span>
                    <span className="text-sm font-black text-[#a3e635] block mt-1">@{nextGoalAway}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ACCORDION 3: Total Goals Over / Under 2.5 */}
          {shouldShowSection("totalOverUnder") && (
            <div className="border border-zinc-800/80 rounded-xl overflow-hidden bg-[#18191b]">
              <button
                onClick={() => toggleSection("totalOverUnder")}
                className="w-full px-3 py-2.5 bg-[#1c1d1f] hover:bg-zinc-800 flex justify-between items-center text-xs font-black font-sans uppercase tracking-wide cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-1 text-gray-100">
                  <span className="text-blue-400">🥅</span> Total Goals Margin (2.5)
                </span>
                {collapsed.totalOverUnder ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-white" />}
              </button>

              {!collapsed.totalOverUnder && (
                <div className="p-3 grid grid-cols-2 gap-2.5 animate-in fade-in duration-100">
                  <button 
                    onClick={() => handleSelectMarketOption("Total Goals: Over 2.5", totalOver)}
                    className="p-2.5 bg-[#252628] hover:bg-[#a3e635]/10 hover:border-[#a3e635]/40 rounded-lg border border-zinc-800 text-left transition-all relative cursor-pointer"
                  >
                    <span className="block text-[8px] text-gray-400 font-bold">OVER 2.5 GOALS</span>
                    <span className="text-gray-200 text-xs font-bold block mt-1">Over 2.5 Goal Scored</span>
                    <span className="text-sm font-black text-[#a3e635] block mt-1">@{totalOver}</span>
                  </button>

                  <button 
                    onClick={() => handleSelectMarketOption("Total Goals: Under 2.5", totalUnder)}
                    className="p-2.5 bg-[#252628] hover:bg-[#a3e635]/10 hover:border-[#a3e635]/40 rounded-lg border border-zinc-800 text-left transition-all relative cursor-pointer"
                  >
                    <span className="block text-[8px] text-gray-400 font-bold">UNDER 2.5 GOALS</span>
                    <span className="text-gray-200 text-xs font-bold block mt-1">Under 2.5 Goal Scored</span>
                    <span className="text-sm font-black text-[#a3e635] block mt-1">@{totalUnder}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ACCORDION 4: Both Teams to Score (GG/NG) */}
          {shouldShowSection("btts") && (
            <div className="border border-zinc-800/80 rounded-xl overflow-hidden bg-[#18191b]">
              <button
                onClick={() => toggleSection("btts")}
                className="w-full px-3 py-2.5 bg-[#1c1d1f] hover:bg-zinc-800 flex justify-between items-center text-xs font-black font-sans uppercase tracking-wide cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-1 text-gray-100">
                  <span className="text-pink-400">🤝</span> Both Teams to Score (GG/NG)
                </span>
                {collapsed.btts ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-white" />}
              </button>

              {!collapsed.btts && (
                <div className="p-3 grid grid-cols-2 gap-2.5 animate-in fade-in duration-100">
                  <button 
                    onClick={() => handleSelectMarketOption("Both Teams to Score: Yes (GG)", bttsYes)}
                    className="p-2.5 bg-[#252628] hover:bg-[#a3e635]/10 hover:border-[#a3e635]/40 rounded-lg border border-zinc-800 text-left transition-all relative cursor-pointer"
                  >
                    <span className="block text-[8px] text-gray-400 font-bold">YES (GG)</span>
                    <span className="text-gray-200 text-xs font-bold block mt-1">Both sides will score</span>
                    <span className="text-sm font-black text-[#a3e635] block mt-1">@{bttsYes}</span>
                  </button>

                  <button 
                    onClick={() => handleSelectMarketOption("Both Teams to Score: No (NG)", bttsNo)}
                    className="p-2.5 bg-[#252628] hover:bg-[#a3e635]/10 hover:border-[#a3e635]/40 rounded-lg border border-[#a3e635]/0 text-left transition-all relative cursor-pointer"
                  >
                    <span className="block text-[8px] text-gray-400 font-bold">NO (NG)</span>
                    <span className="text-gray-200 text-xs font-bold block mt-1">At least one team cleansheet</span>
                    <span className="text-sm font-black text-[#a3e635] block mt-1">@{bttsNo}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ACCORDION 5: Corners Over/Under */}
          {shouldShowSection("corners") && (
            <div className="border border-zinc-800/80 rounded-xl overflow-hidden bg-[#18191b]">
              <button
                onClick={() => toggleSection("corners")}
                className="w-full px-3 py-2.5 bg-[#1c1d1f] hover:bg-zinc-800 flex justify-between items-center text-xs font-black font-sans uppercase tracking-wide cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-1 text-gray-100">
                  <span className="text-purple-400">🚩</span> Total Match Corners Over/Under 9.5
                </span>
                {collapsed.corners ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-white" />}
              </button>

              {!collapsed.corners && (
                <div className="p-3 grid grid-cols-2 gap-2.5 animate-in fade-in duration-100">
                  <button 
                    onClick={() => handleSelectMarketOption("Match Corners: Over 9.5", totalCornersOver)}
                    className="p-2.5 bg-[#252628] hover:bg-[#a3e635]/10 hover:border-[#a3e635]/40 rounded-lg border border-zinc-800 text-left transition-all relative cursor-pointer"
                  >
                    <span className="block text-[8px] text-gray-400 font-bold">OVER 9.5 CORNERS</span>
                    <span className="text-gray-200 text-xs font-bold block mt-1">10 or more corners</span>
                    <span className="text-sm font-black text-[#a3e635] block mt-1">@{totalCornersOver}</span>
                  </button>

                  <button 
                    onClick={() => handleSelectMarketOption("Match Corners: Under 9.5", totalCornersUnder)}
                    className="p-2.5 bg-[#252628] hover:bg-[#a3e635]/10 hover:border-[#a3e635]/40 rounded-lg border border-zinc-800 text-left transition-all relative cursor-pointer"
                  >
                    <span className="block text-[8px] text-gray-400 font-bold">UNDER 9.5 CORNERS</span>
                    <span className="text-gray-200 text-xs font-bold block mt-1">9 or fewer corners</span>
                    <span className="text-sm font-black text-[#a3e635] block mt-1">@{totalCornersUnder}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dynamic bottom notification information block footer */}
        <div className="p-3.5 bg-[#1c1d1f] border-t border-zinc-800/80 text-center shrink-0">
          <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1.5">
            <span>🛡️</span> Zero house margin. All selections feed directly into your ratio challenge slip!
          </p>
        </div>
      </div>
    </div>
  );
}
