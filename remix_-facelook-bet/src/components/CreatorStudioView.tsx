import React, { useState } from "react";
import { 
  Plus, Users, Trophy, Eye, MoreHorizontal, 
  Radio, Film, ThumbsUp, Share2, MessageSquare,
  Bell, ChevronDown, Search, Video, Filter, CheckSquare,
  Play, DollarSign, ArrowUpRight, X, Sparkles, CheckCircle2, Clock, Upload
} from "lucide-react";
import { VideoItem } from "../types";
import UploadCreatorStudioModal from "./UploadCreatorStudioModal";

interface CreatorStudioViewProps {
  videosList: VideoItem[];
  setVideosList: (videos: VideoItem[]) => void;
  reelsList: VideoItem[];
  setReelsList: (reels: VideoItem[]) => void;
  walletBalance: number;
}

interface ChallengeInfo {
  id: string;
  name: string;
  type: "Mimi na Wewe" | "Tujengane Pool" | "Three Way" | "No Challenge";
  status: "Waiting" | "Live" | "Completed" | "Won" | "Lost" | "Funding";
  stake: string;
  participants: number;
  poolAmount: string;
}

export default function CreatorStudioView({
  videosList,
  setVideosList,
  reelsList,
  setReelsList,
  walletBalance
}: CreatorStudioViewProps) {
  const currentCreator = "Collins Dnego";

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "videos" | "reels" | "live" | "drafts" | "scheduled">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeInfo | null>(null);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Statistics - 1 Simple Row of cards, identical size, no colorful backgrounds
  const statistics = [
    { label: "Followers", value: "12,650", change: "+8%", icon: Users },
    { label: "Reach", value: "28.6K", change: "+20%", icon: ArrowUpRight },
    { label: "Likes", value: "2.8K", change: "+15%", icon: ThumbsUp },
    { label: "Shares", value: "856", change: "+12%", icon: Share2 },
    { label: "Comments", value: "1.1K", change: "+10%", icon: MessageSquare },
    { label: "Watch Time", value: "24.6K mins", change: "+14%", icon: Eye },
  ];

  // Mock challenge badges mapping for videos
  const mockChallenges: ChallengeInfo[] = [
    { id: "c1", name: "Mimi na Wewe", type: "Mimi na Wewe", status: "Live", stake: "KES 500", participants: 2, poolAmount: "KES 1,000" },
    { id: "c2", name: "Tujengane Pool", type: "Tujengane Pool", status: "Funding", stake: "KES 200", participants: 14, poolAmount: "KES 2,800" },
    { id: "c3", name: "Three Way Challenge", type: "Three Way", status: "Waiting", stake: "KES 1,000", participants: 3, poolAmount: "KES 3,000" },
    { id: "c4", name: "Mimi na Wewe", type: "Mimi na Wewe", status: "Won", stake: "KES 1,500", participants: 2, poolAmount: "KES 3,000" },
    { id: "c5", name: "No Challenge", type: "No Challenge", status: "Completed", stake: "-", participants: 0, poolAmount: "-" },
    { id: "c6", name: "Tujengane Pool", type: "Tujengane Pool", status: "Live", stake: "KES 300", participants: 20, poolAmount: "KES 6,000" },
  ];

  const mockDates = ["Feb 20, 2026", "Feb 18, 2026", "Feb 15, 2026", "Feb 12, 2026", "Feb 10, 2026", "Feb 8, 2026"];

  // Filter content
  const filteredVideos = videosList.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (video.category || "").toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === "videos") return !video.isReel;
    if (activeTab === "reels") return video.isReel;
    if (activeTab === "live") return video.privacy === "live";
    if (activeTab === "drafts") return video.privacy === "draft";
    if (activeTab === "scheduled") return video.privacy === "scheduled";
    return true;
  });

  const getStatusBadgeStyle = (status: ChallengeInfo["status"]) => {
    switch (status) {
      case "Live":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800";
      case "Waiting":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800";
      case "Funding":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800";
      case "Won":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800";
      case "Completed":
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:border-zinc-700";
      case "Lost":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const handleOpenChallengeManager = (challenge: ChallengeInfo) => {
    setSelectedChallenge(challenge);
    setIsChallengeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#0a0b0d] font-sans text-gray-900 dark:text-gray-100 pb-20">
      
      {/* TOP NAVIGATION BAR */}
      <header className="bg-white dark:bg-[#1a1c21] border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-40 shadow-xs px-4 sm:px-8 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          
          {/* Branding & Search */}
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xl font-black tracking-tight text-[#1877f2]">FaceLook</span>
              <span className="bg-[#1877f2] text-white text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Studio</span>
            </div>

            {/* Global Search Bar */}
            <div className="relative flex-1 hidden md:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos, reels, live, challenges..." 
                className="w-full bg-[#f0f2f5] dark:bg-zinc-800 border border-transparent focus:border-[#1877f2] focus:bg-white dark:focus:bg-zinc-900 rounded-full pl-10 pr-4 py-2 text-xs font-medium transition-all outline-none"
              />
            </div>
          </div>
          
          {/* User Controls */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full text-gray-600 dark:text-gray-300 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-[#1a1c21]">2</span>
            </button>
            
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-zinc-800 cursor-pointer group">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 dark:border-zinc-700">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2" alt="Creator Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#1877f2] transition-colors">{currentCreator}</p>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">Creator Account</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors hidden sm:block" />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER (3-COLUMN LAYOUT) */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        
        {/* WELCOME SECTION */}
        <section className="bg-white dark:bg-[#1a1c21] rounded-2xl p-6 border border-gray-200/80 dark:border-zinc-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Welcome back, Collins!
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your videos, reels and betting challenges.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-[#1877f2] hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xs transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Video</span>
            </button>
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"
            >
              <Film className="w-4 h-4 text-purple-600" />
              <span>Create Reel</span>
            </button>
            <button 
              onClick={() => alert("Go Live broadcast feature initializing...")}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"
            >
              <Radio className="w-4 h-4 text-red-500" />
              <span>Go Live</span>
            </button>
          </div>
        </section>

        {/* STATISTICS ROW (Identical Card Sizes, Clean White, Minimal Colors) */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {statistics.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-[#1a1c21] p-4 rounded-2xl border border-gray-200/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
                <span className="text-xs font-medium">{stat.label}</span>
                <stat.icon className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 inline-block">
                  {stat.change} vs last 28 days
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* MAIN BODY GRID (LEFT 70% CONTENT LIBRARY, RIGHT 30% SIDEBAR) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: CONTENT LIBRARY (70%) */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-4">
            
            <div className="bg-white dark:bg-[#1a1c21] rounded-2xl border border-gray-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
              
              {/* Content Header & Tabs */}
              <div className="p-5 border-b border-gray-200/80 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Content Library</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">View and manage all uploaded content and challenges</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl overflow-x-auto">
                  {(["all", "videos", "reels", "live", "drafts", "scheduled"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize whitespace-nowrap transition-all ${
                        activeTab === tab
                          ? "bg-white dark:bg-zinc-900 text-[#1877f2] shadow-xs"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table List of Videos */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-zinc-800/50 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200/80 dark:border-zinc-800">
                      <th className="py-3 px-4 w-10 text-center">
                        <input type="checkbox" className="rounded border-gray-300 text-[#1877f2] focus:ring-0" />
                      </th>
                      <th className="py-3 px-4 min-w-[280px]">Content</th>
                      <th className="py-3 px-3 text-center">Views</th>
                      <th className="py-3 px-3 text-center">Reach</th>
                      <th className="py-3 px-3 text-center">Likes</th>
                      <th className="py-3 px-3 text-center">Shares</th>
                      <th className="py-3 px-3 text-center">Comments</th>
                      <th className="py-3 px-4 text-center">Challenge Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80 text-xs">
                    {filteredVideos.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-gray-500 dark:text-gray-400">
                          <Video className="w-8 h-8 mx-auto mb-2 opacity-40" />
                          <p className="font-semibold">No content found in this filter.</p>
                          <button 
                            onClick={() => setIsUploadModalOpen(true)} 
                            className="mt-3 text-xs font-bold text-[#1877f2] hover:underline"
                          >
                            Upload a new video
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredVideos.map((video, idx) => {
                        const challenge = mockChallenges[idx % mockChallenges.length];
                        return (
                          <tr key={video.id} className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors group">
                            <td className="py-4 px-4 text-center">
                              <input type="checkbox" className="rounded border-gray-300 text-[#1877f2] focus:ring-0" />
                            </td>
                            
                            {/* Video Info */}
                            <td className="py-4 px-4">
                              <div className="flex items-start gap-3">
                                <div className="relative w-28 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-zinc-800 shrink-0 border border-gray-200/60 dark:border-zinc-700">
                                  <img 
                                    src={video.bgImage || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=300"} 
                                    alt={video.title} 
                                    className="w-full h-full object-cover"
                                  />
                                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1 rounded">
                                    {video.duration || "3:42"}
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#1877f2] transition-colors">
                                    {video.title}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">Premier League</span>
                                    <span>•</span>
                                    <span>{mockDates[idx % mockDates.length]}</span>
                                    <span>•</span>
                                    <span className="capitalize px-1.5 py-0.2 bg-gray-100 dark:bg-zinc-800 rounded font-medium text-[10px]">
                                      {video.privacy || "Public"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Views */}
                            <td className="py-4 px-3 text-center font-semibold text-gray-900 dark:text-gray-200">
                              {video.views}
                            </td>

                            {/* Reach */}
                            <td className="py-4 px-3 text-center font-semibold text-gray-900 dark:text-gray-200">
                              {(idx * 3 + 12).toLocaleString()}K
                            </td>

                            {/* Likes */}
                            <td className="py-4 px-3 text-center font-semibold text-gray-900 dark:text-gray-200">
                              {(idx * 120 + 450).toLocaleString()}
                            </td>

                            {/* Shares */}
                            <td className="py-4 px-3 text-center font-semibold text-gray-900 dark:text-gray-200">
                              {(idx * 40 + 95).toLocaleString()}
                            </td>

                            {/* Comments */}
                            <td className="py-4 px-3 text-center font-semibold text-gray-900 dark:text-gray-200">
                              {video.commentsCount || (idx * 25 + 30)}
                            </td>

                            {/* Challenge Status */}
                            <td className="py-4 px-4 text-center">
                              <button 
                                onClick={() => handleOpenChallengeManager(challenge)}
                                className="flex flex-col items-center justify-center gap-1 mx-auto group/btn"
                              >
                                <span className="font-bold text-[11px] text-gray-700 dark:text-gray-300 group-hover/btn:text-[#1877f2]">
                                  {challenge.name}
                                </span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(challenge.status)}`}>
                                  {challenge.status}
                                </span>
                              </button>
                            </td>

                            {/* Manage Button */}
                            <td className="py-4 px-4 text-right">
                              <button 
                                onClick={() => handleOpenChallengeManager(challenge)}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-[#1877f2] hover:text-white dark:bg-zinc-800 dark:hover:bg-[#1877f2] text-gray-700 dark:text-gray-300 font-bold rounded-lg text-xs transition-all shadow-2xs"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: SIDEBAR (30%) - EXACTLY THREE CARDS */}
          <div className="lg:col-span-4 xl:col-span-4 space-y-6">
            
            {/* CARD 1: QUICK ACTIONS */}
            <div className="bg-white dark:bg-[#1a1c21] rounded-2xl p-5 border border-gray-200/80 dark:border-zinc-800 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-[#1877f2]/10 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border border-gray-200/60 dark:border-zinc-700 text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#1877f2]/10 text-[#1877f2] flex items-center justify-center shrink-0">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#1877f2]">Upload Video</p>
                    <p className="text-[11px] text-gray-500">Publish to feed & challenges</p>
                  </div>
                </button>

                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-purple-500/10 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border border-gray-200/60 dark:border-zinc-700 text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                    <Film className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-purple-600">Create Reel</p>
                    <p className="text-[11px] text-gray-500">Short vertical video</p>
                  </div>
                </button>

                <button 
                  onClick={() => alert("Go Live feature starting...")}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-red-500/10 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border border-gray-200/60 dark:border-zinc-700 text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-red-600">Go Live</p>
                    <p className="text-[11px] text-gray-500">Stream match commentary</p>
                  </div>
                </button>

                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-emerald-500/10 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border border-gray-200/60 dark:border-zinc-700 text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-emerald-600">Create Challenge</p>
                    <p className="text-[11px] text-gray-500">P2P or Pool stake prediction</p>
                  </div>
                </button>
              </div>
            </div>

            {/* CARD 2: PERFORMANCE */}
            <div className="bg-white dark:bg-[#1a1c21] rounded-2xl p-5 border border-gray-200/80 dark:border-zinc-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Performance</h2>
                <span className="text-[11px] font-semibold text-gray-400">Today</span>
              </div>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-zinc-800">
                  <span className="text-gray-600 dark:text-gray-400">Today's Views</span>
                  <span className="font-bold text-gray-900 dark:text-white">3,420</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-zinc-800">
                  <span className="text-gray-600 dark:text-gray-400">Today's Reach</span>
                  <span className="font-bold text-gray-900 dark:text-white">12.4K</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-zinc-800">
                  <span className="text-gray-600 dark:text-gray-400">Today's Likes</span>
                  <span className="font-bold text-gray-900 dark:text-white">850</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-gray-600 dark:text-gray-400">Today's Shares</span>
                  <span className="font-bold text-gray-900 dark:text-white">194</span>
                </div>
              </div>
            </div>

            {/* CARD 3: ACTIVE CHALLENGES */}
            <div className="bg-white dark:bg-[#1a1c21] rounded-2xl p-5 border border-gray-200/80 dark:border-zinc-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Active Challenges</h2>
                <button className="text-xs font-bold text-[#1877f2] hover:underline">See all</button>
              </div>

              <div className="space-y-3">
                <div 
                  onClick={() => handleOpenChallengeManager(mockChallenges[2])}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/60 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                >
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">Mimi na Wewe</p>
                    <p className="text-[11px] text-gray-500">2 Participants • KES 1,000</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800">
                    Waiting
                  </span>
                </div>

                <div 
                  onClick={() => handleOpenChallengeManager(mockChallenges[1])}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/60 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                >
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">Tujengane Pool</p>
                    <p className="text-[11px] text-gray-500">14 Participants • KES 2,800</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800">
                    Funding
                  </span>
                </div>

                <div 
                  onClick={() => handleOpenChallengeManager(mockChallenges[0])}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/60 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                >
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">Three Way Challenge</p>
                    <p className="text-[11px] text-gray-500">3 Participants • KES 3,000</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                    Live
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* CHALLENGE MANAGER MODAL */}
      {isChallengeModalOpen && selectedChallenge && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1c21] rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 dark:border-zinc-800 relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsChallengeModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1877f2]/10 text-[#1877f2] flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">{selectedChallenge.name} Manager</h3>
                <p className="text-xs text-gray-500">FaceLook Bet Challenge Details</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-800/60 rounded-xl p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-gray-200/60 dark:border-zinc-700">
                <span className="text-gray-500">Challenge Status:</span>
                <span className={`px-2 py-0.5 rounded-full font-bold border ${getStatusBadgeStyle(selectedChallenge.status)}`}>
                  {selectedChallenge.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-200/60 dark:border-zinc-700">
                <span className="text-gray-500">Individual Stake:</span>
                <span className="font-bold text-gray-900 dark:text-white">{selectedChallenge.stake}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-200/60 dark:border-zinc-700">
                <span className="text-gray-500">Total Participants:</span>
                <span className="font-bold text-gray-900 dark:text-white">{selectedChallenge.participants}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500">Prize Pool:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedChallenge.poolAmount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => {
                  alert(`Challenge "${selectedChallenge.name}" settings updated!`);
                  setIsChallengeModalOpen(false);
                }}
                className="w-full bg-[#1877f2] hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-xs"
              >
                Promote & Share Challenge
              </button>
              <button 
                onClick={() => setIsChallengeModalOpen(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      <UploadCreatorStudioModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onPublish={(newVideo) => {
          setVideosList([newVideo, ...videosList]);
        }}
        walletBalance={walletBalance}
      />
    </div>
  );
}

