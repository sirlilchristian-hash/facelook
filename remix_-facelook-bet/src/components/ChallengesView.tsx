import React, { useState, useRef } from "react";
import {
  Search,
  Filter,
  Swords,
  Users,
  Lock,
  Trophy,
  XCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  X,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Zap,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Flame,
  Calendar
} from "lucide-react";

export type ChallengeStatus =
  | "Proposed"
  | "Received"
  | "Sent"
  | "Funding"
  | "Matching"
  | "Locked"
  | "Live"
  | "Won"
  | "Lost"
  | "Cancelled";

export type EngineType = "Mimi na Wewe" | "Tujengane Pool" | "Three-Way";

export interface ChallengeItem {
  id: string;
  matchName: string;
  league?: string;
  prediction: string;
  engineType: EngineType;
  stakeAmount: number;
  totalPoolAmount: number;
  opponentsOrMembers: string;
  opponentAvatars?: string[];
  status: ChallengeStatus;
  time: string;
  creatorName: string;
  userRole: "creator" | "opponent" | "contributor" | "invitee";
  odds?: number;
  contractId?: string;
  notes?: string;
  breakdown?: {
    userStake: number;
    opponentStake?: number;
    escrowTax?: number;
    potentialReturn?: number;
    potentialProfit?: number;
    contributorsCount?: number;
    targetStake?: number;
    currentStake?: number;
  };
}

interface ChallengesViewProps {
  walletBalance: number;
  onUpdateWallet: (amt: number) => void;
  challengeInvites?: any[];
  collabChallenges?: any[];
  customGlobalChallenges?: any[];
  onOpenEscrowModal?: (engine: "mimi" | "tujengane" | "three_way") => void;
  onNavigateTab?: (tab: string) => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({
  walletBalance,
  onUpdateWallet,
  challengeInvites = [],
  collabChallenges = [],
  customGlobalChallenges = [],
  onOpenEscrowModal,
  onNavigateTab,
}) => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [engineFilter, setEngineFilter] = useState<string>("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial Mock Challenges dataset spanning all statuses & engines
  const initialChallenges: ChallengeItem[] = [
    {
      id: "ch-101",
      matchName: "Manchester United vs Arsenal",
      league: "English Premier League",
      prediction: "Manchester United Win (1) @2.45",
      engineType: "Mimi na Wewe",
      stakeAmount: 50.0,
      totalPoolAmount: 100.0,
      opponentsOrMembers: "vs Alex Smith",
      opponentAvatars: ["https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=3b82f6"],
      status: "Live",
      time: "Live • 64'",
      creatorName: "Collins Dnego (You)",
      userRole: "creator",
      odds: 2.45,
      contractId: "ESC-2026-884192-MNU",
      notes: "Equal stake 1v1 matchup locked in Escrow Pool",
      breakdown: {
        userStake: 50.0,
        opponentStake: 50.0,
        escrowTax: 2.0,
        potentialReturn: 98.0,
        potentialProfit: 48.0,
      },
    },
    {
      id: "ch-102",
      matchName: "A.F.C Leopards vs Gor Mahia",
      league: "Kenya Premier League",
      prediction: "Home Win (1) @2.10",
      engineType: "Mimi na Wewe",
      stakeAmount: 25.0,
      totalPoolAmount: 50.0,
      opponentsOrMembers: "from Collins Dnego",
      opponentAvatars: ["https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2"],
      status: "Received",
      time: "10m ago",
      creatorName: "Collins Dnego",
      userRole: "invitee",
      odds: 2.10,
      contractId: "ESC-2026-901243-KPL",
      notes: "Opponent proposed Gor Mahia (2) or Draw (X) as counter-liability",
      breakdown: {
        userStake: 25.0,
        opponentStake: 25.0,
        escrowTax: 1.0,
        potentialReturn: 49.0,
        potentialProfit: 24.0,
      },
    },
    {
      id: "ch-103",
      matchName: "Real Madrid vs Barcelona",
      league: "Spanish La Liga",
      prediction: "Real Madrid Win (1) @1.95",
      engineType: "Tujengane Pool",
      stakeAmount: 30.0,
      totalPoolAmount: 100.0,
      opponentsOrMembers: "3 Pool Contributors",
      opponentAvatars: [
        "https://api.dicebear.com/7.x/avataaars/svg?seed=You&backgroundColor=1877f2",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=10b981",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=f59e0b",
      ],
      status: "Funding",
      time: "25m ago",
      creatorName: "Collins Dnego (You)",
      userRole: "creator",
      odds: 1.95,
      contractId: "ESC-2026-339102-TJ",
      notes: "Group target $100.00. Current pool: $70.00 ($30.00 remaining needed)",
      breakdown: {
        userStake: 30.0,
        currentStake: 70.0,
        targetStake: 100.0,
        contributorsCount: 3,
        potentialReturn: 195.0,
      },
    },
    {
      id: "ch-104",
      matchName: "Chelsea vs Liverpool",
      league: "English Premier League",
      prediction: "Draw (X) @3.40",
      engineType: "Three-Way",
      stakeAmount: 40.0,
      totalPoolAmount: 120.0,
      opponentsOrMembers: "Player 2: Marcus_88, Player 3: Linet K.",
      opponentAvatars: [
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus_88&backgroundColor=8b5cf6",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Linet&backgroundColor=ec4899",
      ],
      status: "Matching",
      time: "1h ago",
      creatorName: "Collins Dnego (You)",
      userRole: "creator",
      odds: 3.40,
      contractId: "ESC-2026-773109-3WAY",
      notes: "Player 1 (You): Draw. Player 2 matched Chelsea Win. Waiting for Player 3 (Liverpool Win).",
      breakdown: {
        userStake: 40.0,
        opponentStake: 80.0,
        escrowTax: 2.4,
        potentialReturn: 117.6,
      },
    },
    {
      id: "ch-105",
      matchName: "Tusker FC vs Bandari",
      league: "Kenya Premier League",
      prediction: "Draw (X) @3.00",
      engineType: "Mimi na Wewe",
      stakeAmount: 110.0,
      totalPoolAmount: 220.0,
      opponentsOrMembers: "vs Zephaniah Mwangi",
      opponentAvatars: ["https://api.dicebear.com/7.x/avataaars/svg?seed=Zephaniah&backgroundColor=a855f7"],
      status: "Locked",
      time: "Starts in 20m",
      creatorName: "Zephaniah Mwangi",
      userRole: "opponent",
      odds: 3.00,
      contractId: "ESC-2026-119283-LOCKED",
      notes: "Both stakes fully verified & locked in Escrow. Match kickoff imminent.",
      breakdown: {
        userStake: 110.0,
        opponentStake: 110.0,
        escrowTax: 4.4,
        potentialReturn: 215.6,
      },
    },
    {
      id: "ch-106",
      matchName: "Bayern Munich vs Dortmund",
      league: "German Bundesliga",
      prediction: "Over 2.5 Goals @1.70",
      engineType: "Mimi na Wewe",
      stakeAmount: 45.0,
      totalPoolAmount: 90.0,
      opponentsOrMembers: "vs David T.",
      opponentAvatars: ["https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=ef4444"],
      status: "Won",
      time: "Yesterday",
      creatorName: "Collins Dnego (You)",
      userRole: "creator",
      odds: 1.70,
      contractId: "ESC-2026-664101-WON",
      notes: "Result: 3-2 (5 goals scored). Winnings disbursed automatically to your wallet balance.",
      breakdown: {
        userStake: 45.0,
        opponentStake: 45.0,
        escrowTax: 1.8,
        potentialReturn: 88.2,
        potentialProfit: 43.2,
      },
    },
    {
      id: "ch-107",
      matchName: "Inter Milan vs AC Milan",
      league: "Italian Serie A",
      prediction: "AC Milan Win (2) @3.10",
      engineType: "Mimi na Wewe",
      stakeAmount: 35.0,
      totalPoolAmount: 70.0,
      opponentsOrMembers: "vs Sarah L.",
      opponentAvatars: ["https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=10b981"],
      status: "Lost",
      time: "2 days ago",
      creatorName: "Collins Dnego (You)",
      userRole: "creator",
      odds: 3.10,
      contractId: "ESC-2026-442109-LOST",
      notes: "Result: Inter Milan won 2-1.",
      breakdown: {
        userStake: 35.0,
        opponentStake: 35.0,
        escrowTax: 1.4,
      },
    },
    {
      id: "ch-108",
      matchName: "Boston Celtics vs Dallas Mavericks",
      league: "NBA Basketball",
      prediction: "Celtics -5.5 Spread @1.90",
      engineType: "Mimi na Wewe",
      stakeAmount: 60.0,
      totalPoolAmount: 120.0,
      opponentsOrMembers: "Open Community Challenge",
      status: "Proposed",
      time: "3h ago",
      creatorName: "Collins Dnego (You)",
      userRole: "creator",
      odds: 1.90,
      contractId: "ESC-2026-992182-PROP",
      notes: "Challenge posted to global feed. Waiting for opponent to accept.",
      breakdown: {
        userStake: 60.0,
        opponentStake: 60.0,
        escrowTax: 2.4,
        potentialReturn: 117.6,
      },
    },
    {
      id: "ch-109",
      matchName: "Posta Rangers vs Kakamega Homeboyz",
      league: "Kenya Premier League",
      prediction: "Away Win (2) @3.30",
      engineType: "Mimi na Wewe",
      stakeAmount: 40.0,
      totalPoolAmount: 80.0,
      opponentsOrMembers: "to Collo Dnego",
      opponentAvatars: ["https://api.dicebear.com/7.x/avataaars/svg?seed=Collo&backgroundColor=059669"],
      status: "Sent",
      time: "4h ago",
      creatorName: "Collins Dnego (You)",
      userRole: "creator",
      odds: 3.30,
      contractId: "ESC-2026-551209-SENT",
      notes: "Direct invitation sent to @Collo Dnego. Pending recipient response.",
      breakdown: {
        userStake: 40.0,
        opponentStake: 40.0,
        escrowTax: 1.6,
      },
    },
    {
      id: "ch-110",
      matchName: "PSG vs Marseille",
      league: "French Ligue 1",
      prediction: "Home Win (1) @1.65",
      engineType: "Tujengane Pool",
      stakeAmount: 50.0,
      totalPoolAmount: 150.0,
      opponentsOrMembers: "Cancelled Pool",
      status: "Cancelled",
      time: "3 days ago",
      creatorName: "Collins Dnego (You)",
      userRole: "creator",
      odds: 1.65,
      contractId: "ESC-2026-002194-CNC",
      notes: "Pool cancelled by creator before completion. Stakes refunded 100%.",
      breakdown: {
        userStake: 50.0,
      },
    },
  ];

  // Merge dynamic live challenges created in App state
  const mergedDynamicChallenges: ChallengeItem[] = [];

  // Add invites
  (challengeInvites || []).forEach((inv, idx) => {
    mergedDynamicChallenges.push({
      id: `dyn-inv-${inv.id || idx}`,
      matchName: inv.matchName || "Live Match",
      league: "Sportsbook Escrow Match",
      prediction: inv.proposerPrediction || inv.backedOption || "Match Pick",
      engineType: "Mimi na Wewe",
      stakeAmount: inv.liabilityAmount || 25.0,
      totalPoolAmount: inv.totalPool || 50.0,
      opponentsOrMembers: `from ${inv.challengerName || "Challenger"}`,
      opponentAvatars: [inv.challengerAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Challenger&backgroundColor=1877f2"],
      status: inv.status === "accepted" ? "Locked" : inv.status === "declined" ? "Cancelled" : "Received",
      time: "Just now",
      creatorName: inv.challengerName || "Peer",
      userRole: "invitee",
      contractId: `ESC-2026-${100000 + idx}-INV`,
      notes: inv.proposedOppMarket ? `Counter Market: ${inv.proposedOppMarket}` : "Direct peer challenge invite",
      breakdown: {
        userStake: inv.liabilityAmount || 25.0,
        opponentStake: inv.liabilityAmount || 25.0,
        escrowTax: (inv.totalPool || 50) * 0.02,
        potentialReturn: (inv.totalPool || 50) * 0.98,
      },
    });
  });

  // Add collab pools
  (collabChallenges || []).forEach((collab, idx) => {
    const isFull = collab.currentTotalStake >= collab.targetTotalStake || collab.status === "posted";
    mergedDynamicChallenges.push({
      id: `dyn-collab-${collab.id || idx}`,
      matchName: collab.matchName || "Group Match",
      league: "Tujengane Escrow Syndicate",
      prediction: collab.prediction || "Group Pick",
      engineType: "Tujengane Pool",
      stakeAmount: collab.currentStakeCreator || collab.currentTotalStake || 30.0,
      totalPoolAmount: collab.targetTotalStake || 100.0,
      opponentsOrMembers: `${collab.contributors?.length || 1} Contributors`,
      opponentAvatars: (collab.contributors || []).map(
        (c: any, i: number) => `https://api.dicebear.com/7.x/avataaars/svg?seed=%24%7BencodeURIComponent(c.name)%7D&backgroundColor=1877f2"1877f2" : "10b981"}`
      ),
      status: isFull ? "Matching" : "Funding",
      time: "Active Pool",
      creatorName: collab.creator || "You",
      userRole: "creator",
      contractId: `ESC-2026-${200000 + idx}-TJ`,
      notes: `Target Stake: $${collab.targetTotalStake}. Raised: $${collab.currentTotalStake}`,
      breakdown: {
        userStake: collab.currentStakeCreator || 30.0,
        currentStake: collab.currentTotalStake,
        targetStake: collab.targetTotalStake,
        contributorsCount: collab.contributors?.length || 1,
      },
    });
  });

  // Combine initial + dynamic (avoid duplicates by ID)
  const allChallengesMap = new Map<string, ChallengeItem>();
  [...mergedDynamicChallenges, ...initialChallenges].forEach((item) => {
    if (!allChallengesMap.has(item.id)) {
      allChallengesMap.set(item.id, item);
    }
  });
  const allChallenges = Array.from(allChallengesMap.values());

  // Filter tabs list as requested in prompt:
  // All, Received, Sent, Funding, Matching, Locked, Live, Won, Lost, Cancelled
  const tabs = [
    "All",
    "Received",
    "Sent",
    "Funding",
    "Matching",
    "Locked",
    "Live",
    "Won",
    "Lost",
    "Cancelled",
  ];

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Filtered dataset
  const filteredChallenges = allChallenges.filter((item) => {
    // 1. Tab filter
    if (activeTab !== "All") {
      if (item.status.toLowerCase() !== activeTab.toLowerCase()) {
        return false;
      }
    }

    // 2. Engine filter
    if (engineFilter !== "All") {
      if (item.engineType !== engineFilter) {
        return false;
      }
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.matchName.toLowerCase();
      const pred = item.prediction.toLowerCase();
      const opp = item.opponentsOrMembers.toLowerCase();
      const eng = item.engineType.toLowerCase();
      const cid = (item.contractId || "").toLowerCase();
      return matchName.includes(q) || pred.includes(q) || opp.includes(q) || eng.includes(q) || cid.includes(q);
    }

    return true;
  });

  // Helper status icon mapper from screenshot
  const getStatusIcon = (status: ChallengeStatus) => {
    switch (status) {
      case "Proposed":
        return <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 shadow-sm"><Clock className="w-6 h-6" /></div>;
      case "Received":
        return <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shadow-sm"><Search className="w-6 h-6" /></div>;
      case "Funding":
        return <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 shadow-sm"><Users className="w-6 h-6" /></div>;
      case "Matching":
        return <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 shadow-sm"><Flame className="w-6 h-6" /></div>;
      case "Locked":
        return <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 shadow-sm"><Lock className="w-6 h-6" /></div>;
      case "Live":
        return <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 shadow-sm"><Zap className="w-6 h-6 animate-pulse" /></div>;
      case "Won":
        return <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 shadow-sm"><CheckCircle2 className="w-6 h-6" /></div>;
      case "Lost":
        return <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 shadow-sm"><XCircle className="w-6 h-6" /></div>;
      case "Cancelled":
        return <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 shadow-sm"><X className="w-6 h-6" /></div>;
      default:
        return <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm"><Search className="w-6 h-6" /></div>;
    }
  };

  const getStatusColorClass = (status: ChallengeStatus) => {
    switch (status) {
      case "Proposed": return "text-amber-600";
      case "Received": return "text-blue-600";
      case "Funding": return "text-purple-600";
      case "Matching": return "text-orange-500";
      case "Locked": return "text-emerald-600";
      case "Live": return "text-emerald-500";
      case "Won": return "text-emerald-600";
      case "Lost": return "text-rose-600";
      default: return "text-gray-500";
    }
  };

  const copyContractId = (cid: string) => {
    navigator.clipboard.writeText(cid);
    setCopiedId(cid);
    showToast("📋 Escrow Contract Receipt ID copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto font-sans text-left animate-in fade-in duration-300 pb-20">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[300] bg-blue-600 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-blue-400 animate-in slide-in-from-top-3">
          <Zap className="w-4 h-4 fill-white text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION - Blue FaceLook Bet Theme */}
      <div className="fixed top-0 left-0 right-0 z-[200] bg-[#1877f2] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <button onClick={() => window.history.back()} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
          <span>My Challenges</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-black">12</span>
        </h1>
        <div className="relative">
          <div className="p-1 hover:bg-white/10 rounded-lg transition-colors">
             <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] font-black flex items-center justify-center rounded-full border border-white">2</span>
             <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* TABS SECTION - Fixed below header */}
      <div className="sticky top-[52px] z-[190] bg-white dark:bg-[#18191a] border-b border-gray-100 dark:border-zinc-800/80 px-2 py-3 flex items-center gap-1 group">
        <button 
          onClick={() => scrollTabs("left")}
          className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full text-gray-700 dark:text-gray-200 transition-all shadow-sm cursor-pointer z-10 active:scale-90 shrink-0"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto scrollbar-none flex items-center gap-2 px-1"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-black whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-[#1877f2] text-white shadow-md shadow-blue-500/20"
                  : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button 
          onClick={() => scrollTabs("right")}
          className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full text-gray-700 dark:text-gray-200 transition-all shadow-sm cursor-pointer z-10 active:scale-90 shrink-0"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4 pt-4">
        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#1877f2] transition-shadow"
            />
          </div>
          <button className="px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300">
            <Filter className="w-4 h-4 text-[#1877f2]" />
            <span>Filter</span>
          </button>
        </div>

        {/* CHALLENGE LIST */}
        <div className="space-y-3">
          {filteredChallenges.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <Search className="w-12 h-12 text-gray-200 mx-auto" />
              <p className="text-gray-400 font-bold">No challenges found</p>
            </div>
          ) : (
            filteredChallenges.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedChallenge(item)}
                className="bg-white dark:bg-[#242526] rounded-2xl p-4 border border-gray-100 dark:border-zinc-800/80 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 items-center relative"
              >
                {/* Left Side: Status Icon */}
                <div className="flex flex-col items-center gap-1.5 w-16 shrink-0">
                  {getStatusIcon(item.status)}
                  <span className={`text-[10px] font-bold ${getStatusColorClass(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                {/* Center: Info */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <h3 className="text-[15px] font-black text-gray-900 dark:text-white truncate">
                    {item.matchName}
                  </h3>
                  <div className="flex flex-col text-[11px] font-bold text-gray-500 dark:text-gray-400">
                    <span>Prediction: <span className="text-gray-900 dark:text-gray-100">{item.prediction.split("@")[0]}</span></span>
                    <span>{item.userRole === "invitee" ? "From: " : "Opponent: "}<span className="text-[#1877f2]">@User_{item.id.slice(-3)}</span></span>
                  </div>
                  <div className="pt-1">
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-[10px] font-bold text-gray-600 dark:text-gray-300">
                      {item.engineType}
                    </span>
                  </div>
                </div>

                {/* Right Side: Stake & Meta */}
                <div className="text-right shrink-0 space-y-1">
                   <div className="space-y-0">
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">
                        {item.status === "Funding" ? "Pool Target" : item.status === "Live" ? "Potential Winnings" : "Stake"}
                      </span>
                      <span className="text-sm font-black text-gray-900 dark:text-white">
                        KES {((item.breakdown?.targetStake || item.totalPoolAmount) * 110).toLocaleString()}
                      </span>
                   </div>

                   {/* Progress/Time info */}
                   <div className="flex flex-col items-end gap-1 pt-1">
                      {item.status === "Funding" ? (
                        <div className="flex items-center gap-2 w-24">
                           <div className="flex-1 h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-500 rounded-full w-[69%]" />
                           </div>
                           <span className="text-[10px] font-black text-purple-600">69%</span>
                        </div>
                      ) : item.status === "Live" ? (
                        <div className="flex items-center gap-1">
                           <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                           <span className="text-[10px] font-bold text-red-500 uppercase">Live</span>
                        </div>
                      ) : item.status === "Matching" ? (
                        <span className="text-[10px] font-black text-orange-500 italic">Searching...</span>
                      ) : item.status === "Locked" ? (
                         <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                            <Lock className="w-3 h-3" />
                            <span>Escrow Locked</span>
                         </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                           <Clock className="w-3 h-3" />
                           <span>12m ago</span>
                        </div>
                      )}
                   </div>
                </div>

                {/* Chevron */}
                <ChevronRight className="w-4 h-4 text-gray-300 ml-1 shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
           <div className="bg-white dark:bg-[#1c1d1f] w-full max-w-sm rounded-3xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden text-left animate-in zoom-in-95 duration-200">
              <div className="p-4 bg-[#1877f2] text-white flex justify-between items-center">
                 <h3 className="font-bold">Challenge Details</h3>
                 <button onClick={() => setSelectedChallenge(null)}><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 space-y-4">
                 <div className="flex justify-between border-b pb-2 border-gray-100 dark:border-zinc-800">
                    <span className="text-gray-500 text-xs font-bold">Match</span>
                    <span className="font-black text-xs">{selectedChallenge.matchName}</span>
                 </div>
                 <div className="flex justify-between border-b pb-2 border-gray-100 dark:border-zinc-800">
                    <span className="text-gray-500 text-xs font-bold">Prediction</span>
                    <span className="font-black text-xs text-[#1877f2]">{selectedChallenge.prediction}</span>
                 </div>
                 <div className="flex justify-between border-b pb-2 border-gray-100 dark:border-zinc-800">
                    <span className="text-gray-500 text-xs font-bold">Status</span>
                    <span className={`font-black text-xs ${getStatusColorClass(selectedChallenge.status)}`}>{selectedChallenge.status}</span>
                 </div>
                 <div className="pt-2">
                    <button className="w-full py-3 bg-[#1877f2] text-white rounded-2xl font-black text-sm shadow-lg active:scale-95 transition-transform">
                       View Escrow Contract
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ChallengesView;
