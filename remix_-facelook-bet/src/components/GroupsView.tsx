import { useState } from "react";
import { Group, Post } from "../types";
import { 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  MessageSquare, 
  Plus, 
  CheckCircle,
  MoreVertical,
  MoreHorizontal,
  Bell,
  Share2,
  Trash2,
  X,
  Shield,
  Award,
  Lock,
  Clock,
  AlertTriangle,
  ChevronRight,
  Pen,
  Check,
  Eye,
  Image as ImageIcon,
  Copy,
  Link,
  UserPlus,
  Search,
  DollarSign,
  Calendar,
  FileText,
  BarChart2,
  Sparkles,
  CheckCircle2,
  Info,
  Globe,
  Bookmark,
  Gamepad2,
  ThumbsUp,
  Send,
  PieChart,
  ArrowUpRight,
  Flame,
  Zap,
  ChevronDown
} from "lucide-react";

interface GroupsViewProps {
  walletBalance: number;
  onUpdateWallet: (amt: number) => void;
  activeGroupId: string;
  setActiveGroupId: (id: string) => void;
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  onNavigateTab: (tab: string) => void;
  setCreateGroupModalOpen?: (open: boolean) => void;
}

export default function GroupsView({ 
  walletBalance, 
  onUpdateWallet,
  activeGroupId,
  setActiveGroupId,
  groups,
  setGroups,
  onNavigateTab,
  setCreateGroupModalOpen
}: GroupsViewProps) {
  // Navigation & Filtering States
  const [activeGroupTab, setActiveGroupTab] = useState<"discussion" | "featured" | "members" | "events" | "media" | "files" | "polls">("discussion");
  const [groupSearchQuery, setGroupSearchQuery] = useState("");
  const [sidebarFilter, setSidebarFilter] = useState<"feed" | "discover" | "investments">("feed");

  // Interaction States
  const [shrunkJoinedPools, setShrunkJoinedPools] = useState<string[]>([]);
  const [typedComment, setTypedComment] = useState("");
  const [selectedPoolBells, setSelectedPoolBells] = useState<Record<string, boolean>>({
    "pool-1": false,
    "pool-2": true,
  });
  const [postBells, setPostBells] = useState<Record<string, boolean>>({});
  const [commentInputMap, setCommentInputMap] = useState<Record<string, string>>({});
  const [activePostMenuId, setActivePostMenuId] = useState<string | null>(null);
  const [coverMenuOpen, setCoverMenuOpen] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [sharedPostsMap, setSharedPostsMap] = useState<Record<string, boolean>>({});
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Investment Confirmation Modal
  const [confirmingInvestment, setConfirmingInvestment] = useState<{
    poolId: string;
    cost: number;
    matchName: string;
    time: string;
    league: string;
    odds: { "1": number; X: number; "2": number };
    prediction: string;
    estYield?: string;
  } | null>(null);

  const [customInvestAmount, setCustomInvestAmount] = useState<number>(50);

  // States for Editing Group Name & Photos
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempGroupName, setTempGroupName] = useState("");
  const [photoEditTarget, setPhotoEditTarget] = useState<"cover" | "profile" | null>(null);
  const [viewingFullscreenPhoto, setViewingFullscreenPhoto] = useState<string | null>(null);
  const [customPhotoUrl, setCustomPhotoUrl] = useState("");

  // Post Creator Options
  const [postType, setPostType] = useState<"discussion" | "challenge" | "investment" | "poll">("discussion");
  const [postText, setPostText] = useState("");
  const [investmentGoal, setInvestmentGoal] = useState("1000");
  const [investmentYield, setInvestmentYield] = useState("15");

  // Members Management
  const [membersModalTab, setMembersModalTab] = useState<"members" | "admin">("members");
  const [inviteInput, setInviteInput] = useState("");

  // Sample Polls Data
  const [pollsList, setPollsList] = useState([
    {
      id: "poll-1",
      question: "Who will win the upcoming Mashemeji Derby match?",
      author: "Collins Dnego (You)",
      time: "2 hours ago",
      totalVotes: 142,
      votedOption: null as number | null,
      options: [
        { id: 0, text: "Gor Mahia (1)", votes: 68 },
        { id: 1, text: "Draw Match (X)", votes: 42 },
        { id: 2, text: "AFC Leopards (2)", votes: 32 }
      ]
    },
    {
      id: "poll-2",
      question: "Which escrow structure is best for Liverpool vs Chelsea?",
      author: "Marcus_88",
      time: "Yesterday",
      totalVotes: 89,
      votedOption: 0,
      options: [
        { id: 0, text: "Tujengane Pool Escrow (Collaborative)", votes: 54 },
        { id: 1, text: "Mimi na Wewe (1v1 Direct)", votes: 25 },
        { id: 2, text: "Three-Way Multi-odds Syndicate", votes: 10 }
      ]
    }
  ]);

  // Sample Events Data
  const [eventsList, setEventsList] = useState([
    {
      id: "evt-1",
      title: "⚽ Mashemeji Derby Live Watch Party & Escrow Match",
      date: "Saturday, 15:00 UTC",
      location: "Game Hub Live Stream & Nairobi Sports Lounge",
      attendees: 48,
      isAttending: true,
      desc: "Join us live in the watch hub while our syndicate escrow pools lock in real-time."
    },
    {
      id: "evt-2",
      title: "🏆 EPL Weekend Syndicate Pool Strategy Session",
      date: "Friday, 18:00 UTC",
      location: "FaceLook Bet Voice Room 1",
      attendees: 23,
      isAttending: false,
      desc: "Reviewing match stats and picking high-ratio odds for the $5,000 group escrow pool."
    }
  ]);

  // Sample Media Gallery
  const mediaGallery = [
    { id: "m-1", url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600", title: "Winning $450 Slip", tag: "Winning Slip" },
    { id: "m-2", url: "https://images.unsplash.com/photo-1540747737956-37872404a82f?q=80&w=600", title: "Stadium Watch Party", tag: "Watch Party" },
    { id: "m-3", url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600", title: "Derby Pitch View", tag: "Live Match" },
    { id: "m-4", url: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=600", title: "Escrow Locked Proof", tag: "Proof" }
  ];

  // Sample Files
  const filesList = [
    { id: "f-1", name: "FaceLook_Bet_Escrow_Syndicate_Guide_v2.pdf", size: "1.4 MB", date: "Jul 10, 2026", uploader: "Dandora King (Auditor)" },
    { id: "f-2", name: "Mashemeji_Derby_Historical_Odds_Ratios.xlsx", size: "820 KB", date: "Jul 14, 2026", uploader: "P2P Prophet" },
    { id: "f-3", name: "Tujengane_Pool_Profit_Sharing_Rules.pdf", size: "512 KB", date: "Jun 28, 2026", uploader: "Marcus_88" }
  ];

  // Members list
  const [clanMembers, setClanMembers] = useState([
    { name: "Marcus_88", role: "Owner & Lead Admin", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=9c27b0", status: "Active Now", level: "Lvl 99 Matcher", tag: "Founder", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-400/20" },
    { name: "Collins Dnego (You)", role: "Co-Admin / Moderator", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2", status: "Active Now", level: "Lvl 50 Chief Scout", tag: "Co-Admin", color: "bg-blue-500/10 text-[#1877f2] border-blue-400/20" },
    { name: "crypto_expert", role: "VIP Whale Backer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=crypto_expert&backgroundColor=2196f3", status: "Active Today", level: "Lvl 88 Ratio Specialist", tag: "VIP Investor", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-400/20" },
    { name: "Dandora King", role: "Pool Escrow Auditor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dandora&backgroundColor=4caf50", status: "Online", level: "Lvl 42 Treasurer", tag: "Treasurer", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-400/20" },
    { name: "Leopard Keeper", role: "AFC Leopards Scout", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leopard&backgroundColor=ff9800", status: "Offline", level: "Lvl 34 Scout", tag: "Scout / Helper", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-400/20" },
    { name: "K'Ogalo Fanatic", role: "Gor Mahia Advisor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gor&backgroundColor=e91e63", status: "Active Yesterday", level: "Lvl 31 Advisor", tag: "Advisor", color: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-400/20" },
    { name: "P2P Prophet", role: "Math Ratio Expert", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=P2P&backgroundColor=607d8b", status: "Online", level: "Lvl 75 Guru", tag: "Mathematics", color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-400/20" }
  ]);

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];

  const triggerToast = (text: string) => {
    setNotificationToast(text);
    setTimeout(() => {
      setNotificationToast(null);
    }, 3000);
  };

  const handleUpdateGroupName = (newName: string) => {
    if (!newName || !newName.trim()) {
      triggerToast("Group name cannot be empty!");
      return;
    }
    setGroups(groups.map(g => {
      if (g.id === activeGroupId) {
        return { ...g, name: newName.trim() };
      }
      return g;
    }));
    setIsEditingName(false);
    triggerToast("Group name updated successfully!");
  };

  const handleUpdatePhoto = (type: "cover" | "profile", url: string) => {
    setGroups(groups.map(g => {
      if (g.id === activeGroupId) {
        if (type === "cover") {
          return { ...g, coverImage: url };
        } else {
          return { ...g, avatar: url };
        }
      }
      return g;
    }));
    setPhotoEditTarget(null);
    setCustomPhotoUrl("");
    triggerToast(`${type === "cover" ? "Cover photo" : "Profile photo"} updated successfully!`);
  };

  const handleDeletePhoto = (type: "cover" | "profile") => {
    const defaultCover = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200";
    const defaultProfile = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(activeGroup.name)}&backgroundColor=1877f2`;
    handleUpdatePhoto(type, type === "cover" ? defaultCover : defaultProfile);
    triggerToast(`${type === "cover" ? "Cover" : "Profile"} photo deleted.`);
  };

  const handleDirectInviteFriend = () => {
    if (!inviteInput.trim()) {
      triggerToast("Please enter a valid username or email address!");
      return;
    }
    const username = inviteInput.trim();
    
    if (clanMembers.some(m => m.name.toLowerCase() === username.toLowerCase())) {
      triggerToast(`"${username}" is already in this group!`);
      return;
    }

    const newMember = {
      name: username,
      role: "Member / Scout",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}&backgroundColor=1877f2`,
      status: "Active Now",
      level: "Lvl 1 Matcher",
      tag: "Invited",
      color: "bg-blue-500/10 text-[#1877f2] border-blue-400/20"
    };

    setClanMembers([...clanMembers, newMember]);
    setGroups(groups.map(g => {
      if (g.id === activeGroupId) {
        return { ...g, membersCount: g.membersCount + 1 };
      }
      return g;
    }));

    triggerToast(`Sent invite request! ${username} successfully joined "${activeGroup.name}"!`);
    setInviteInput("");
  };

  const handlePostInGroup = () => {
    if (!postText.trim()) return;
    
    let betCardData = undefined;
    if (postType === "investment") {
      betCardData = {
        match: `${activeGroup.name} Investment Opportunity`,
        type: `Verified Investment Pool`,
        prediction: `Est. Yield: ${investmentYield}% p.a.`,
        odds: parseFloat(investmentYield) || 15,
        totalPool: parseFloat(investmentGoal) || 1000,
        stakes: { creator: 250, opponents: (parseFloat(investmentGoal) || 1000) - 250 },
        status: "OPEN" as const
      };
    } else if (postType === "challenge") {
      betCardData = {
        match: "Gor Mahia vs AFC Leopards (Derby Challenge)",
        type: "Syndicate Challenge Escrow",
        prediction: "Draw Match (@2.80)",
        odds: 2.80,
        totalPool: 200,
        stakes: { creator: 50, opponents: 150 },
        status: "OPEN" as const
      };
    }

    const newPost: Post = {
      id: `gp-${Date.now()}`,
      author: "Collins Dnego (You)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2",
      time: "Just now",
      content: postText.trim(),
      likes: 0,
      comments: [],
      betCard: betCardData
    };
    
    setGroups(groups.map(g => {
      if (g.id === activeGroupId) {
        return { ...g, posts: [newPost, ...g.posts] };
      }
      return g;
    }));

    setPostText("");
    setPostType("discussion");
    triggerToast("Published successfully to group feed!");
  };

  const executeInvestmentConfirmation = () => {
    if (!confirmingInvestment) return;
    const amountToInvest = customInvestAmount || confirmingInvestment.cost;

    if (walletBalance < amountToInvest) {
      alert(`Insufficient wallet balance to invest $${amountToInvest}. Please deposit funds into your FaceLook Wallet first.`);
      return;
    }

    onUpdateWallet(-amountToInvest);
    setShrunkJoinedPools([...shrunkJoinedPools, confirmingInvestment.poolId]);
    setSelectedPoolBells(prev => ({ ...prev, [confirmingInvestment.poolId]: true }));
    
    triggerToast(`🎉 Investment of $${amountToInvest} confirmed for "${confirmingInvestment.matchName}"! Yield tracking active.`);
    setConfirmingInvestment(null);
  };

  const handleToggleLike = (postId: string) => {
    setGroups(groups.map(g => {
      if (g.id === activeGroupId) {
        return {
          ...g,
          posts: g.posts.map(p => {
            if (p.id === postId) {
              const isAlreadyLiked = (p as any).isLikedByMe;
              const nextLikes = isAlreadyLiked ? Math.max(0, p.likes - 1) : p.likes + 1;
              return {
                ...p,
                likes: nextLikes,
                isLikedByMe: !isAlreadyLiked
              };
            }
            return p;
          })
        };
      }
      return g;
    }));
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputMap[postId];
    if (!text || !text.trim()) return;
    
    setGroups(groups.map(g => {
      if (g.id === activeGroupId) {
        return {
          ...g,
          posts: g.posts.map(p => {
            if (p.id === postId) {
              return {
                ...p,
                comments: [
                  ...p.comments,
                  {
                    author: "Collins Dnego (You)",
                    content: text.trim(),
                    time: "Just now"
                  }
                ]
              };
            }
            return p;
          })
        };
      }
      return g;
    }));

    setCommentInputMap({
      ...commentInputMap,
      [postId]: ""
    });
    triggerToast("Comment added!");
  };

  const handleSharePost = (postId: string) => {
    setSharedPostsMap({ ...sharedPostsMap, [postId]: true });
    triggerToast("🔗 Post link copied to clipboard!");
    setTimeout(() => {
      setSharedPostsMap(prev => ({ ...prev, [postId]: false }));
    }, 3000);
  };

  const handleDeletePost = (postId: string) => {
    setGroups(groups.map(g => {
      if (g.id === activeGroupId) {
        return {
          ...g,
          posts: g.posts.filter(p => p.id !== postId)
        };
      }
      return g;
    }));
    setActivePostMenuId(null);
    triggerToast("Post removed from group feed.");
  };

  const handleVotePoll = (pollId: string, optionIdx: number) => {
    setPollsList(pollsList.map(p => {
      if (p.id === pollId) {
        if (p.votedOption !== null) {
          triggerToast("You have already voted in this poll!");
          return p;
        }
        const updatedOptions = p.options.map((opt, idx) => {
          if (idx === optionIdx) return { ...opt, votes: opt.votes + 1 };
          return opt;
        });
        triggerToast(`Vote recorded for option #${optionIdx + 1}!`);
        return {
          ...p,
          votedOption: optionIdx,
          totalVotes: p.totalVotes + 1,
          options: updatedOptions
        };
      }
      return p;
    }));
  };

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
    (g.category && g.category.toLowerCase().includes(groupSearchQuery.toLowerCase()))
  );

  return (
    <div className="w-full max-w-7xl mx-auto font-sans antialiased text-gray-900 dark:text-gray-100">
      
      {/* THREE-COLUMN LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ========================================== */}
        {/* LEFT SIDEBAR (25% / lg:col-span-3)        */}
        {/* ========================================== */}
        <aside className="lg:col-span-3 space-y-4">
          
          {/* Search Groups Box */}
          <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200/80 dark:border-zinc-800 p-3.5">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#3a3b3c] rounded-full px-3.5 py-2">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input 
                type="text"
                placeholder="Search Groups..."
                value={groupSearchQuery}
                onChange={(e) => setGroupSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-gray-800 dark:text-gray-100 placeholder-gray-400 font-sans"
              />
            </div>

            {/* Left Nav Filter Tabs */}
            <div className="flex items-center gap-1 mt-3 font-sans text-xs font-bold">
              <button
                onClick={() => setSidebarFilter("feed")}
                className={`flex-1 py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer ${
                  sidebarFilter === "feed" 
                    ? "bg-blue-50 dark:bg-blue-950/40 text-[#1877f2] font-black" 
                    : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800"
                }`}
              >
                Your Feed
              </button>
              <button
                onClick={() => setSidebarFilter("discover")}
                className={`flex-1 py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer ${
                  sidebarFilter === "discover" 
                    ? "bg-blue-50 dark:bg-blue-950/40 text-[#1877f2] font-black" 
                    : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800"
                }`}
              >
                Discover
              </button>
            </div>
          </div>

          {/* "+ Create New Group" Button */}
          <button
            onClick={() => setCreateGroupModalOpen ? setCreateGroupModalOpen(true) : triggerToast("Create Group wizard opened")}
            className="w-full py-3 px-4 bg-[#1877f2] hover:bg-blue-600 text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Group</span>
          </button>

          {/* "Groups You've Joined" List */}
          <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200/80 dark:border-zinc-800 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-zinc-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Groups You've Joined ({groups.length})
              </h3>
              <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-[#1877f2] font-mono px-1.5 py-0.5 rounded font-black">
                ACTIVE
              </span>
            </div>

            <div className="space-y-1.5 max-h-[380px] overflow-y-auto scrollbar-thin pr-1">
              {filteredGroups.map((group) => {
                const isActive = group.id === activeGroupId;
                return (
                  <button
                    key={group.id}
                    onClick={() => {
                      setActiveGroupId(group.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer group ${
                      isActive 
                        ? "bg-blue-50 dark:bg-blue-950/40 border-2 border-[#1877f2]" 
                        : "hover:bg-gray-50 dark:hover:bg-zinc-800 border border-transparent"
                    }`}
                  >
                    <img 
                      src={group.avatar} 
                      alt={group.name} 
                      className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-200 dark:border-zinc-700 shadow-xs"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-black line-clamp-1 ${isActive ? "text-[#1877f2] dark:text-blue-400" : "text-gray-900 dark:text-white"}`}>
                        {group.name}
                      </p>
                      <p className="text-[10px] text-gray-500 font-medium">
                        {group.membersCount.toLocaleString()} members
                      </p>
                    </div>
                    {group.id === "group-1" && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active posts today" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group Features & Quick Tools */}
          <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200/80 dark:border-zinc-800 p-4 space-y-2 font-sans text-xs">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">
              Group Tools & Escrow
            </h4>

            <button 
              onClick={() => setActiveGroupTab("featured")}
              className="w-full p-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-xl flex items-center gap-3 text-emerald-700 dark:text-emerald-400 font-extrabold transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600">
                <DollarSign className="w-4 h-4" />
              </div>
              <span>My Investments</span>
            </button>

            <button 
              onClick={() => onNavigateTab("hub")}
              className="w-full p-2.5 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-xl flex items-center gap-3 text-gray-800 dark:text-gray-200 font-bold transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-[#1877f2]">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <span>Betting Pools</span>
            </button>

            <button 
              onClick={() => setActiveGroupTab("media")}
              className="w-full p-2.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl flex items-center gap-3 text-gray-800 dark:text-gray-200 font-bold transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-gray-300">
                <Bookmark className="w-4 h-4" />
              </div>
              <span>Saved Discussions</span>
            </button>

            <button 
              onClick={() => setShowMembersModal(true)}
              className="w-full p-2.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl flex items-center gap-3 text-gray-800 dark:text-gray-200 font-bold transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-gray-300">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>Group Settings</span>
            </button>
          </div>

        </aside>

        {/* ========================================== */}
        {/* CENTER FEED (50% / lg:col-span-6)          */}
        {/* ========================================== */}
        <main className="lg:col-span-6 space-y-5">
          
          {/* GROUP BANNER / COVER CARD */}
          <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200/80 dark:border-zinc-800 overflow-hidden relative">
            
            {/* Cover Image Container */}
            <div className="h-48 md:h-56 w-full relative group/cover">
              <img 
                src={activeGroup.coverImage} 
                className="w-full h-full object-cover" 
                alt={activeGroup.name} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Edit Cover Photo Overlay Button */}
              <button
                onClick={() => setPhotoEditTarget("cover")}
                className="absolute top-3 right-3 px-3 py-1.5 bg-black/60 hover:bg-black/90 text-white border border-white/20 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-xs"
              >
                <Pen className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit Cover</span>
              </button>

              {/* Group Name & Avatar Overlaid in Banner */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="relative group/avatar shrink-0">
                    <img 
                      src={activeGroup.avatar} 
                      className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-4 border-white dark:border-[#242526] shadow-md object-cover" 
                      alt={activeGroup.name} 
                    />
                    <button
                      onClick={() => setPhotoEditTarget("profile")}
                      className="absolute -bottom-1 -right-1 p-1 bg-[#1877f2] hover:bg-blue-600 text-white rounded-full transition-all cursor-pointer shadow-md"
                      title="Edit Profile Image"
                    >
                      <Pen className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-0.5">
                    {isEditingName ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tempGroupName}
                          onChange={(e) => setTempGroupName(e.target.value)}
                          className="bg-black/70 border border-white/40 text-white text-lg font-black px-2.5 py-1 rounded-xl outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdateGroupName(tempGroupName);
                            if (e.key === "Escape") setIsEditingName(false);
                          }}
                        />
                        <button
                          onClick={() => handleUpdateGroupName(tempGroupName)}
                          className="p-1.5 bg-emerald-600 text-white rounded-lg cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl md:text-2xl font-black tracking-tight text-white drop-shadow-sm">
                          {activeGroup.name}
                        </h1>
                        <button
                          onClick={() => {
                            setTempGroupName(activeGroup.name);
                            setIsEditingName(true);
                          }}
                          className="p-1 hover:bg-white/20 text-white/80 rounded-lg transition-all"
                        >
                          <Pen className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs font-medium text-white/90">
                      <span className="flex items-center gap-1 font-mono text-[11px] bg-blue-500/30 backdrop-blur-xs px-2 py-0.5 rounded border border-blue-400/40">
                        <Globe className="w-3 h-3 text-cyan-300" /> Public Group
                      </span>
                      <span>•</span>
                      <span className="font-bold">{activeGroup.membersCount.toLocaleString()} members</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Banner Action Bar */}
            <div className="p-4 bg-white dark:bg-[#242526] flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 dark:border-zinc-800">
              
              {/* Stacked Member Avatars */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 overflow-hidden">
                  {clanMembers.slice(0, 4).map((m, idx) => (
                    <img 
                      key={idx} 
                      src={m.avatar} 
                      alt={m.name} 
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-[#242526] object-cover" 
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {clanMembers[0].name} and 12 friends are members
                </span>
              </div>

              {/* Actions Row */}
              <div className="flex items-center gap-2">
                
                {/* Joined Dropdown Button */}
                <div className="relative">
                  <button
                    onClick={() => setCoverMenuOpen(!coverMenuOpen)}
                    className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Joined</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {coverMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#242526] border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-30 overflow-hidden font-sans py-1.5 text-left text-xs font-bold">
                      <button
                        onClick={() => { setShowMembersModal(true); setCoverMenuOpen(false); }}
                        className="w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-2"
                      >
                        <Users className="w-4 h-4 text-blue-500" /> Administration & Members
                      </button>
                      <button
                        onClick={() => { triggerToast("Muted group notifications"); setCoverMenuOpen(false); }}
                        className="w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-2"
                      >
                        <Bell className="w-4 h-4 text-amber-500" /> Mute Activity
                      </button>
                      <div className="border-t border-gray-100 dark:border-zinc-800 my-1" />
                      <button
                        onClick={() => { triggerToast("Left group successfully"); setCoverMenuOpen(false); }}
                        className="w-full px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 flex items-center gap-2"
                      >
                        <X className="w-4 h-4" /> Leave Group
                      </button>
                    </div>
                  )}
                </div>

                {/* Invite Friends Button */}
                <button
                  onClick={() => setShowMembersModal(true)}
                  className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-[#1877f2] dark:text-blue-400 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Invite</span>
                </button>

                {/* Share Group Button */}
                <button
                  onClick={() => {
                    triggerToast("🔗 Group link copied to clipboard!");
                  }}
                  className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl transition-all cursor-pointer"
                  title="Share Group"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {/* PROMINENT GREEN "INVEST IN GROUP" BUTTON */}
                <button
                  onClick={() => setConfirmingInvestment({
                    poolId: "grp-inv-1",
                    cost: 100,
                    matchName: `${activeGroup.name} Syndicate Growth Fund`,
                    time: "Active Opportunity",
                    league: "Verified Group Staking",
                    odds: { "1": 2.0, X: 3.0, "2": 3.0 },
                    prediction: "18% p.a. Projected Yield",
                    estYield: "18%"
                  })}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Invest in Group</span>
                </button>

              </div>

            </div>

          </div>

          {/* GROUP NAVIGATION TABS */}
          <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200/80 dark:border-zinc-800 p-1.5 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none font-sans text-xs font-extrabold select-none">
            {(["discussion", "featured", "members", "events", "media", "files", "polls"] as const).map((tab) => {
              const isActive = activeGroupTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveGroupTab(tab)}
                  className={`px-3.5 py-2 rounded-xl capitalize transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#1877f2] text-white shadow-xs"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {tab === "discussion" && <MessageSquare className="w-3.5 h-3.5" />}
                  {tab === "featured" && <Award className="w-3.5 h-3.5 text-amber-300" />}
                  {tab === "members" && <Users className="w-3.5 h-3.5" />}
                  {tab === "events" && <Calendar className="w-3.5 h-3.5" />}
                  {tab === "media" && <ImageIcon className="w-3.5 h-3.5" />}
                  {tab === "files" && <FileText className="w-3.5 h-3.5" />}
                  {tab === "polls" && <BarChart2 className="w-3.5 h-3.5" />}
                  <span>{tab}</span>
                </button>
              );
            })}
          </div>

          {/* TAB CONTENTS RENDERER */}

          {/* 1. DISCUSSION TAB */}
          {activeGroupTab === "discussion" && (
            <div className="space-y-5">
              
              {/* CREATE POST BOX WITH CHALLENGE & INVESTMENT BUTTONS */}
              <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200/80 dark:border-zinc-800 p-4 space-y-3">
                <div className="flex gap-3 items-start">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2" 
                    className="w-10 h-10 rounded-full shrink-0" 
                    alt="User Avatar" 
                  />
                  <div className="flex-1">
                    <textarea
                      rows={2}
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                      placeholder={`Start a discussion in ${activeGroup.name}...`}
                      className="w-full bg-gray-50 dark:bg-[#18191a] border border-gray-200 dark:border-zinc-700 rounded-xl p-3 text-xs text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-[#1877f2] font-medium resize-none"
                    />

                    {/* Extra fields if Investment Mode */}
                    {postType === "investment" && (
                      <div className="mt-2.5 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl grid grid-cols-2 gap-3 animate-in fade-in">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300 mb-1">
                            Target Investment Goal ($)
                          </label>
                          <input 
                            type="number"
                            value={investmentGoal}
                            onChange={(e) => setInvestmentGoal(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-zinc-800 border border-emerald-300 text-xs font-bold rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300 mb-1">
                            Estimated Yield / Return (%)
                          </label>
                          <input 
                            type="number"
                            value={investmentYield}
                            onChange={(e) => setInvestmentYield(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-zinc-800 border border-emerald-300 text-xs font-bold rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Composer Actions Row */}
                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-gray-100 dark:border-zinc-800 gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap font-sans text-xs font-bold">
                    <button
                      onClick={() => setPostType("discussion")}
                      className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
                        postType === "discussion" ? "bg-gray-200 dark:bg-zinc-700 text-gray-900 dark:text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <ImageIcon className="w-4 h-4 text-emerald-500" />
                      <span>Photo/Video</span>
                    </button>

                    {/* CHALLENGE BUTTON (Blue) */}
                    <button
                      onClick={() => setPostType("challenge")}
                      className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
                        postType === "challenge" ? "bg-blue-100 text-[#1877f2] font-black" : "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                      }`}
                    >
                      <Gamepad2 className="w-4 h-4 text-[#1877f2]" />
                      <span>Challenge</span>
                    </button>

                    {/* INVESTMENT OPPORTUNITY BUTTON (Green) */}
                    <button
                      onClick={() => setPostType("investment")}
                      className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
                        postType === "investment" ? "bg-emerald-100 text-emerald-700 font-black" : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                      }`}
                    >
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>Investment Opportunity</span>
                    </button>
                  </div>

                  <button
                    onClick={handlePostInGroup}
                    disabled={!postText.trim()}
                    className="py-2 px-5 bg-[#1877f2] hover:bg-blue-600 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                </div>
              </div>

              {/* ACTIVE SYNDICATE POOLS WIDGET */}
              <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200/80 dark:border-zinc-800 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                    Active Group Escrow Pools
                  </h3>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 font-mono font-black px-2 py-0.5 rounded uppercase">
                    2 LIVE MATCHES
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Pool Card 1 */}
                  <div className="p-3.5 bg-gray-50 dark:bg-[#18191a] rounded-xl border border-gray-200 dark:border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                      <span className="text-[#1877f2] bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded">
                        MAN CITY VS ARSENAL
                      </span>
                      <span className="text-emerald-600 font-extrabold">80% FUNDED</span>
                    </div>
                    <p className="text-xs font-black text-gray-800 dark:text-gray-200">
                      Man City Win (@2.65 Odds)
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[80%]" />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-gray-500 font-bold">$80 / $100 Pool Goal</span>
                      <button
                        onClick={() => setConfirmingInvestment({
                          poolId: "pool-1",
                          cost: 20,
                          matchName: "Man City vs Arsenal",
                          time: "Today 18:30",
                          league: "EPL",
                          odds: { "1": 2.1, X: 3.4, "2": 3.2 },
                          prediction: "Man City Win (@2.65)"
                        })}
                        className="py-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <TrendingUp className="w-3 h-3" />
                        <span>Invest $20</span>
                      </button>
                    </div>
                  </div>

                  {/* Pool Card 2 */}
                  <div className="p-3.5 bg-gray-50 dark:bg-[#18191a] rounded-xl border border-gray-200 dark:border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                      <span className="text-[#1877f2] bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded">
                        MASHEMEJI DERBY
                      </span>
                      <span className="text-amber-600 font-extrabold">40% FUNDED</span>
                    </div>
                    <p className="text-xs font-black text-gray-800 dark:text-gray-200">
                      Gor Mahia vs AFC Draw (@2.80 Odds)
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[40%]" />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-gray-500 font-bold">$200 / $500 Pool Goal</span>
                      <button
                        onClick={() => setConfirmingInvestment({
                          poolId: "pool-2",
                          cost: 50,
                          matchName: "Gor Mahia vs AFC Leopards",
                          time: "Today 15:00",
                          league: "Mashemeji Derby",
                          odds: { "1": 2.5, X: 2.8, "2": 3.1 },
                          prediction: "Draw Match (@2.80)"
                        })}
                        className="py-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <TrendingUp className="w-3 h-3" />
                        <span>Invest $50</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* POST FEED CARDS */}
              <div className="space-y-4">
                {activeGroup.posts.map((post) => (
                  <div 
                    key={post.id} 
                    className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200/80 dark:border-zinc-800 p-5 space-y-3 relative"
                  >
                    
                    {/* Post Author Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover shrink-0" />
                        <div>
                          <h4 className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                            <span>{post.author}</span>
                            {post.author.includes("Collins") && (
                              <span className="text-[9px] bg-blue-100 text-[#1877f2] font-mono px-1 rounded font-extrabold">ADMIN</span>
                            )}
                          </h4>
                          <p className="text-[10px] text-gray-400 font-medium">{post.time} • Group Member</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Post Body Content */}
                    <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed font-normal">
                      {post.content}
                    </p>

                    {/* Investment Card Attachment (If Present) */}
                    {post.betCard && (
                      <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-emerald-700 font-mono tracking-wider">
                            {post.betCard.type}
                          </span>
                          <span className="text-xs font-black text-emerald-600 bg-white dark:bg-zinc-800 px-2 py-0.5 rounded shadow-xs">
                            Target: ${post.betCard.totalPool}
                          </span>
                        </div>

                        <h5 className="text-xs font-extrabold text-gray-900 dark:text-white">
                          {post.betCard.match}
                        </h5>
                        <p className="text-[11px] font-mono text-emerald-800 dark:text-emerald-300 font-bold">
                          {post.betCard.prediction}
                        </p>

                        <div className="w-full bg-gray-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden my-1">
                          <div className="bg-emerald-500 h-full w-[65%]" />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-gray-500 font-bold">
                            $650 / ${post.betCard.totalPool} Funded
                          </span>

                          <button
                            onClick={() => setConfirmingInvestment({
                              poolId: post.id,
                              cost: 50,
                              matchName: post.betCard?.match || "Group Investment",
                              time: "Active Now",
                              league: "Syndicate Escrow",
                              odds: { "1": 2.0, X: 3.0, "2": 3.0 },
                              prediction: post.betCard?.prediction || "High Yield",
                              estYield: `${post.betCard?.odds}%`
                            })}
                            className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1"
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>Invest Now</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Post Actions Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-zinc-800 text-xs font-bold text-gray-500">
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        className={`flex items-center gap-1.5 hover:text-[#1877f2] transition-colors cursor-pointer ${
                          (post as any).isLikedByMe ? "text-[#1877f2] font-black" : ""
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes} Upvotes</span>
                      </button>

                      <button 
                        onClick={() => {
                          const input = commentInputMap[post.id] || "";
                          setCommentInputMap({ ...commentInputMap, [post.id]: input });
                        }}
                        className="flex items-center gap-1.5 hover:text-[#1877f2] transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments.length} Comments</span>
                      </button>

                      <button
                        onClick={() => handleSharePost(post.id)}
                        className="flex items-center gap-1.5 hover:text-[#1877f2] transition-colors cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>

                    {/* Comments List & Input */}
                    {post.comments.length > 0 && (
                      <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 space-y-2">
                        {post.comments.map((comment, cIdx) => (
                          <div key={cIdx} className="p-2.5 bg-gray-50 dark:bg-[#18191a] rounded-xl text-xs space-y-0.5">
                            <span className="font-extrabold text-[#1877f2] block">{comment.author}</span>
                            <p className="text-gray-800 dark:text-gray-200 font-normal">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentInputMap[post.id] || ""}
                        onChange={(e) => setCommentInputMap({ ...commentInputMap, [post.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddComment(post.id);
                        }}
                        className="flex-1 bg-gray-100 dark:bg-[#3a3b3c] rounded-full px-3.5 py-1.5 text-xs text-gray-800 dark:text-gray-100 outline-none"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="px-3 py-1.5 bg-[#1877f2] text-white text-xs font-bold rounded-full"
                      >
                        Send
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* 2. FEATURED TAB */}
          {activeGroupTab === "featured" && (
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 font-mono px-2 py-0.5 rounded">
                    FEATURED GROUP INVESTMENTS
                  </span>
                  <Award className="w-5 h-5 text-yellow-300" />
                </div>
                <h3 className="text-lg font-black leading-snug">
                  Group Syndicate Staking Pool #4 (Verified Escrow)
                </h3>
                <p className="text-xs text-white/90 leading-relaxed font-medium">
                  Pool capital together with 40+ verified syndicate members. All liability stakes are backed in FaceLook Bet escrow smart vaults with zero counterparty risk.
                </p>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-[10px] text-white/80 block uppercase font-bold">Expected ROI</span>
                    <span className="text-lg font-black text-yellow-300">18.5% p.a.</span>
                  </div>
                  <button
                    onClick={() => setConfirmingInvestment({
                      poolId: "feat-1",
                      cost: 100,
                      matchName: "Syndicate Staking Pool #4",
                      time: "Open Goal",
                      league: "Featured Escrow",
                      odds: { "1": 2.0, X: 3.0, "2": 3.0 },
                      prediction: "18.5% Yield",
                      estYield: "18.5%"
                    })}
                    className="py-2 px-5 bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Invest $100 Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. MEMBERS TAB */}
          {activeGroupTab === "members" && (
            <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200/80 dark:border-zinc-800 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
                <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#1877f2]" />
                  Group Members ({activeGroup.membersCount})
                </h3>

                {/* Invite input */}
                <div className="flex items-center gap-2">
                  <input 
                    type="text"
                    placeholder="Invite username..."
                    value={inviteInput}
                    onChange={(e) => setInviteInput(e.target.value)}
                    className="p-1.5 px-3 text-xs bg-gray-100 dark:bg-zinc-800 rounded-xl border-none outline-none"
                  />
                  <button
                    onClick={handleDirectInviteFriend}
                    className="px-3 py-1.5 bg-[#1877f2] text-white text-xs font-bold rounded-xl"
                  >
                    Invite
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {clanMembers.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#18191a] rounded-xl">
                    <div className="flex items-center gap-3">
                      <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                          <span>{m.name}</span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${m.color}`}>
                            {m.tag}
                          </span>
                        </h4>
                        <p className="text-[10px] text-gray-500">{m.role} • {m.level}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. EVENTS TAB */}
          {activeGroupTab === "events" && (
            <div className="space-y-4">
              {eventsList.map((evt) => (
                <div key={evt.id} className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200/80 dark:border-zinc-800 p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-blue-50 text-[#1877f2] px-2 py-0.5 rounded uppercase">
                      UPCOMING MATCH WATCH PARTY
                    </span>
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
                    {evt.title}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    📍 {evt.location} • 🕒 {evt.date}
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    {evt.desc}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-emerald-600 font-bold">{evt.attendees} Members Attending</span>
                    <button
                      onClick={() => triggerToast("RSVP Confirmed! Watch party event added to your calendar.")}
                      className="py-1.5 px-4 bg-[#1877f2] text-white text-xs font-bold rounded-xl"
                    >
                      {evt.isAttending ? "Going ✓" : "Join Watch Party"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 5. MEDIA TAB */}
          {activeGroupTab === "media" && (
            <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200/80 dark:border-zinc-800 p-5 space-y-3">
              <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#1877f2]" />
                Group Media & Winning Slips
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {mediaGallery.map((m) => (
                  <div 
                    key={m.id} 
                    onClick={() => setViewingFullscreenPhoto(m.url)}
                    className="h-28 rounded-xl overflow-hidden relative group cursor-pointer border border-gray-200 dark:border-zinc-700"
                  >
                    <img src={m.url} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2 text-white">
                      <span className="text-[10px] font-bold line-clamp-1">{m.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. FILES TAB */}
          {activeGroupTab === "files" && (
            <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200/80 dark:border-zinc-800 p-5 space-y-3">
              <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1877f2]" />
                Group Files & Escrow Guides
              </h3>
              <div className="space-y-2">
                {filesList.map((f) => (
                  <div key={f.id} className="p-3 bg-gray-50 dark:bg-[#18191a] rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{f.name}</p>
                        <p className="text-[10px] text-gray-400">{f.size} • Uploaded by {f.uploader}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => triggerToast(`Downloading ${f.name}...`)}
                      className="px-3 py-1 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 text-xs font-bold rounded-lg"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. POLLS TAB */}
          {activeGroupTab === "polls" && (
            <div className="space-y-4">
              {pollsList.map((poll) => (
                <div key={poll.id} className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200/80 dark:border-zinc-800 p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-bold text-gray-900 dark:text-white">Poll by {poll.author}</span>
                    <span>{poll.time} • {poll.totalVotes} Votes</span>
                  </div>

                  <h4 className="text-xs font-extrabold text-gray-900 dark:text-white">
                    {poll.question}
                  </h4>

                  <div className="space-y-2">
                    {poll.options.map((opt, optIdx) => {
                      const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                      const isVoted = poll.votedOption === optIdx;

                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleVotePoll(poll.id, optIdx)}
                          className={`w-full p-3 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                            isVoted 
                              ? "border-[#1877f2] bg-blue-50/50 dark:bg-blue-950/30" 
                              : "border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
                          }`}
                        >
                          {/* Progress fill */}
                          <div 
                            className="absolute top-0 bottom-0 left-0 bg-blue-100/60 dark:bg-blue-900/30 transition-all pointer-events-none"
                            style={{ width: `${pct}%` }}
                          />

                          <div className="relative z-10 flex items-center justify-between text-xs font-bold">
                            <span className={isVoted ? "text-[#1877f2] font-black" : "text-gray-800 dark:text-gray-200"}>
                              {opt.text} {isVoted && "✓"}
                            </span>
                            <span className="text-gray-500 font-mono">{pct}%</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>

        {/* ========================================== */}
        {/* RIGHT SIDEBAR (25% / lg:col-span-3)       */}
        {/* ========================================== */}
        <aside className="lg:col-span-3 space-y-4">
          
          {/* ABOUT GROUP CARD */}
          <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200/80 dark:border-zinc-800 p-4.5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-[#1877f2]" />
              About Group
            </h3>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              {activeGroup.description}
            </p>

            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-zinc-800 text-xs font-semibold text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Public Group</p>
                  <p className="text-[10px] text-gray-400 font-normal">Anyone can see who's in the group and what they post.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">FaceLook Bet Escrow Protected</p>
                  <p className="text-[10px] text-gray-400 font-normal">All group bets use real-time liability locking.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Created July 2026</p>
                  <p className="text-[10px] text-gray-400 font-normal">Official verified syndicate.</p>
                </div>
              </div>
            </div>
          </div>

          {/* COMMUNITY INSIGHTS */}
          <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200/80 dark:border-zinc-800 p-4.5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-500" />
              Community Insights
            </h3>

            <div className="grid grid-cols-2 gap-2.5 text-center">
              <div className="p-2.5 bg-gray-50 dark:bg-[#18191a] rounded-xl border border-gray-100 dark:border-zinc-800">
                <span className="text-[10px] text-gray-400 uppercase font-black block">Total Volume</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">$12,450</span>
              </div>

              <div className="p-2.5 bg-gray-50 dark:bg-[#18191a] rounded-xl border border-gray-100 dark:border-zinc-800">
                <span className="text-[10px] text-gray-400 uppercase font-black block">Active Escrows</span>
                <span className="text-sm font-black text-[#1877f2] font-mono">8 Live</span>
              </div>

              <div className="p-2.5 bg-gray-50 dark:bg-[#18191a] rounded-xl border border-gray-100 dark:border-zinc-800">
                <span className="text-[10px] text-gray-400 uppercase font-black block">Win Rate</span>
                <span className="text-sm font-black text-amber-500 font-mono">78.4%</span>
              </div>

              <div className="p-2.5 bg-gray-50 dark:bg-[#18191a] rounded-xl border border-gray-100 dark:border-zinc-800">
                <span className="text-[10px] text-gray-400 uppercase font-black block">Members</span>
                <span className="text-sm font-black text-gray-900 dark:text-white font-mono">{activeGroup.membersCount}</span>
              </div>
            </div>
          </div>

          {/* FEATURED INVESTMENT OPPORTUNITY (Green Highlight) */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-4.5 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded font-mono">
                VERIFIED INVESTMENT
              </span>
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </div>

            <h4 className="text-xs font-black leading-snug">
              Syndicate Staking Opportunity #4
            </h4>

            <p className="text-[11px] text-white/90 font-medium leading-relaxed">
              Target Goal: $1,000 • Raised $650 (65%)
            </p>

            <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
              <div className="bg-yellow-300 h-full w-[65%]" />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[9px] text-white/80 block uppercase font-bold">Est. Yield</span>
                <span className="text-sm font-black text-yellow-300">18% p.a.</span>
              </div>

              {/* GREEN "INVEST NOW" BUTTON */}
              <button
                onClick={() => setConfirmingInvestment({
                  poolId: "feat-sidebar-1",
                  cost: 50,
                  matchName: "Syndicate Staking Opportunity #4",
                  time: "Closing Soon",
                  league: "Group Escrow Vault",
                  odds: { "1": 2.0, X: 3.0, "2": 3.0 },
                  prediction: "18% Yield",
                  estYield: "18%"
                })}
                className="py-1.5 px-4 bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Invest Now</span>
              </button>
            </div>
          </div>

          {/* UPCOMING EVENTS */}
          <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200/80 dark:border-zinc-800 p-4.5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              Upcoming Events
            </h3>

            <div className="space-y-2 text-xs">
              {eventsList.slice(0, 2).map((evt) => (
                <div key={evt.id} className="p-2.5 bg-gray-50 dark:bg-[#18191a] rounded-xl border border-gray-100 dark:border-zinc-800 space-y-1">
                  <p className="font-extrabold text-gray-900 dark:text-white text-[11px] line-clamp-1">{evt.title}</p>
                  <p className="text-[10px] text-gray-400 font-mono">{evt.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* BETTING INTEGRATION / ESCROW ENGINES */}
          <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200/80 dark:border-zinc-800 p-4.5 space-y-2 font-sans text-xs">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">
              FaceLook Bet Engines
            </h4>

            <button 
              onClick={() => onNavigateTab("hub")}
              className="w-full p-2 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 text-[#1877f2] font-bold rounded-xl flex items-center justify-between transition-colors"
            >
              <span>Mimi na Wewe 1v1 Escrow</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button 
              onClick={() => onNavigateTab("hub")}
              className="w-full p-2 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 font-bold rounded-xl flex items-center justify-between transition-colors"
            >
              <span>Tujengane Pool Escrow</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button 
              onClick={() => onNavigateTab("hub")}
              className="w-full p-2 bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 text-purple-700 dark:text-purple-400 font-bold rounded-xl flex items-center justify-between transition-colors"
            >
              <span>Three-Way Challenges</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </aside>

      </div>

      {/* ========================================== */}
      {/* MODALS & DIALOGS                          */}
      {/* ========================================== */}

      {/* CONFIRM INVESTMENT MODAL */}
      {confirmingInvestment && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-[140] p-4 font-sans animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#242526] border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col text-left">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/30">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base">Confirm Group Investment</h3>
              </div>
              <button 
                onClick={() => setConfirmingInvestment(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-[#18191a] rounded-xl border border-gray-200 dark:border-zinc-800 space-y-1">
                <p className="text-[10px] font-mono text-gray-400 uppercase font-black">Opportunity Target</p>
                <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
                  {confirmingInvestment.matchName}
                </h4>
                <p className="text-xs text-emerald-600 font-bold">
                  {confirmingInvestment.prediction}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Investment Amount ($)
                </label>
                <input 
                  type="number"
                  value={customInvestAmount}
                  onChange={(e) => setCustomInvestAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-sm font-bold outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-center justify-between text-xs text-[#1877f2] font-bold">
                <span>Wallet Balance Available:</span>
                <span className="font-mono">${walletBalance.toLocaleString()}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-gray-50 dark:bg-[#18191a] border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-2">
              <button
                onClick={() => setConfirmingInvestment(null)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={executeInvestmentConfirmation}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Confirm & Back Investment
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADMINISTRATION & MEMBERS MODAL */}
      {showMembersModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-[130] p-4 font-sans animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#242526] border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col text-left max-h-[85vh]">
            
            <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gray-50 dark:bg-[#18191a]">
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#1877f2]" />
                <span>{activeGroup.name} - Members & Administration</span>
              </h3>
              <button onClick={() => setShowMembersModal(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Invite Section */}
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-900/50 space-y-2">
                <h4 className="text-xs font-black text-[#1877f2]">Direct Friend Invite</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inviteInput}
                    onChange={(e) => setInviteInput(e.target.value)}
                    placeholder="Enter username or phone number..."
                    className="flex-1 p-2 bg-white dark:bg-zinc-800 text-xs font-bold rounded-xl border border-blue-200 dark:border-zinc-700 outline-none"
                  />
                  <button
                    onClick={handleDirectInviteFriend}
                    className="px-4 py-2 bg-[#1877f2] text-white text-xs font-bold rounded-xl"
                  >
                    Send Invite
                  </button>
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Group Roster ({clanMembers.length})</h4>
                {clanMembers.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#18191a] rounded-xl text-xs">
                    <div className="flex items-center gap-3">
                      <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{m.name}</p>
                        <p className="text-[10px] text-gray-400">{m.role}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${m.color}`}>
                      {m.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-[#18191a] border-t border-gray-100 dark:border-zinc-800 flex justify-end">
              <button onClick={() => setShowMembersModal(false)} className="px-4 py-2 bg-gray-200 dark:bg-zinc-800 text-xs font-bold rounded-xl">
                Close Directory
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PHOTO EDIT OPTIONS MODAL */}
      {photoEditTarget && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-[130] p-4 font-sans animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#242526] border border-gray-200 dark:border-[#3e4042] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col text-left">
            
            <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gray-50 dark:bg-[#1a1b1c]">
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                <span>Manage {photoEditTarget === "cover" ? "Cover" : "Profile"} Photo</span>
              </h3>
              <button 
                onClick={() => { setPhotoEditTarget(null); setCustomPhotoUrl(""); }}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <button
                onClick={() => {
                  setViewingFullscreenPhoto(photoEditTarget === "cover" ? activeGroup.coverImage : activeGroup.avatar);
                  setPhotoEditTarget(null);
                }}
                className="w-full p-3 bg-gray-50 hover:bg-gray-100 dark:bg-[#18191a] border border-gray-200 dark:border-zinc-800 rounded-2xl flex items-center gap-3"
              >
                <Eye className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-gray-900 dark:text-white">View Current Photo</span>
              </button>

              <div className="p-4 bg-gray-50 dark:bg-[#18191a] border border-gray-200 dark:border-zinc-800 rounded-2xl space-y-3">
                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200">
                  Change Photo URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="flex-1 bg-white dark:bg-[#242526] text-xs rounded-xl px-3 py-2 border border-gray-200 dark:border-zinc-700"
                  />
                  <button
                    onClick={() => {
                      if (!customPhotoUrl.trim()) return;
                      handleUpdatePhoto(photoEditTarget, customPhotoUrl.trim());
                    }}
                    className="py-1.5 px-3.5 bg-[#1877f2] text-white rounded-xl text-xs font-bold"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleDeletePhoto(photoEditTarget)}
                className="w-full p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset to Default Photo</span>
              </button>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-[#1a1b1c] border-t border-gray-100 dark:border-zinc-800 flex justify-end">
              <button onClick={() => { setPhotoEditTarget(null); setCustomPhotoUrl(""); }} className="px-4 py-2 bg-gray-200 dark:bg-zinc-800 text-xs font-bold rounded-xl">
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FULLSCREEN PHOTO LIGHTBOX PREVIEW */}
      {viewingFullscreenPhoto && (
        <div 
          onClick={() => setViewingFullscreenPhoto(null)}
          className="fixed inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center z-[200] p-4 cursor-zoom-out animate-in fade-in duration-200"
        >
          <button onClick={() => setViewingFullscreenPhoto(null)} className="absolute top-6 right-6 p-2 bg-white/10 text-white rounded-full">
            <X className="w-6 h-6" />
          </button>
          <img src={viewingFullscreenPhoto} className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl" alt="Preview" />
        </div>
      )}

      {/* Toast notifications */}
      {notificationToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/95 text-white text-xs px-4 py-3 rounded-2xl border border-zinc-800 shadow-2xl z-[150] flex items-center gap-2">
          <span>🔔</span>
          <span className="font-bold">{notificationToast}</span>
        </div>
      )}

    </div>
  );
}
