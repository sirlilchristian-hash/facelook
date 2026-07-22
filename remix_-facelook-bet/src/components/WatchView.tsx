import React, { useState, useEffect, useRef } from "react";
import { Match, VideoItem } from "../types";
import { motion, AnimatePresence } from "motion/react";
import UploadCreatorStudioModal from "./UploadCreatorStudioModal";
import { 
  Play, Pause, RefreshCw, Volume2, Sparkles, Trophy, 
  MoreVertical, Heart, Share2, MessageCircle, Compass, 
  Award, ExternalLink, Calendar, CheckCircle2, ShieldCheck, 
  HelpCircle, ChevronRight, ChevronLeft, ChevronUp, ChevronDown, ArrowUp, ArrowDown, Video, Flag, Star, BookOpen, UserCheck, Check, X, ShieldAlert, BadgeInfo, Bookmark, UploadCloud, Plus, ThumbsUp, Smile, Send, Square, Users, Flame, Search, Eye, History, MapPin, MoreHorizontal, Maximize2, Info, Lock
} from "lucide-react";

interface WatchViewProps {
  selectedMatch: Match | null;
  onSelectOdd: (match: Match, oddName: string, oddValue: number) => void;
  walletBalance: number;
  onSaveItem?: (type: string, content: string, thumb?: string) => void;
  onTagItem?: () => void;
  forceShowSimulation?: number;
  videosList?: VideoItem[];
  setVideosList?: (videos: VideoItem[]) => void;
  reelsList?: VideoItem[];
  setReelsList?: (reels: VideoItem[]) => void;
  successFactoryList?: VideoItem[];
  setSuccessFactoryList?: (success: VideoItem[]) => void;
  onJoinChallenge?: (videoId: string) => void;
}

const KenyanCoatOfArmsShield = () => (
  <svg className="w-16 h-16 md:w-20 md:h-20 drop-shadow-md shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Crossed Spears */}
    <path d="M15 85 L85 15 M85 85 L15 15" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
    <polygon points="15,15 22,12 18,22" fill="#cbd5e1" />
    <polygon points="85,15 78,12 82,22" fill="#cbd5e1" />
    
    {/* Shield Outer Outline */}
    <path d="M30 20 Q50 15 70 20 Q75 55 50 88 Q25 55 30 20 Z" fill="#111827" stroke="#e2e8f0" strokeWidth="2.5" />
    
    {/* Shield Red Center Stripe */}
    <path d="M36 20 Q50 16 64 20 Q67 52 50 82 Q33 52 36 20 Z" fill="#b91c1c" />
    
    {/* Black Top Band */}
    <path d="M30 20 Q50 15 70 20 Q71 35 50 38 Q29 35 30 20 Z" fill="#000000" />
    
    {/* White Divider Lines */}
    <path d="M29 35 Q50 38 71 35" stroke="#ffffff" strokeWidth="2" />
    <path d="M32 58 Q50 62 68 58" stroke="#ffffff" strokeWidth="2" />
    
    {/* Green Bottom Section */}
    <path d="M32 58 Q50 62 68 58 Q72 70 50 85 Q28 70 32 58 Z" fill="#15803d" />
    
    {/* Center Rooster / Emblem Symbol */}
    <path d="M50 42 L53 48 L58 48 L54 52 L56 58 L50 54 L44 58 L46 52 L42 48 L47 48 Z" fill="#ffffff" />
  </svg>
);

export default function WatchView({
  selectedMatch,
  onSelectOdd,
  walletBalance,
  onSaveItem,
  onTagItem,
  forceShowSimulation = 0,
  videosList: propsVideosList,
  setVideosList: propsSetVideosList,
  reelsList: propsReelsList,
  setReelsList: propsSetReelsList,
  successFactoryList: propsSuccessFactoryList,
  setSuccessFactoryList: propsSetSuccessFactoryList,
  onJoinChallenge,
}: WatchViewProps) {

  // Navigation Tabs at the top of Watch Tab
  const [watchSubTab, setWatchSubTab] = useState<"videos" | "reels" | "success_factory" | "kenyan_show">("videos");

  // Kenyan Show specific states
  const [pitchSubTab, setPitchSubTab] = useState<"preview" | "stats" | "lineups" | "h2h">("preview");
  const [newKenyanMessage, setNewKenyanMessage] = useState("");
  const [kenyanChatMessages, setKenyanChatMessages] = useState([
    {
      id: "msg-1",
      user: "BrianKE",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BrianKE&backgroundColor=0284c7",
      time: "2m",
      text: "Great match! JKUAT pressing hard!",
    },
    {
      id: "msg-2",
      user: "Tesh_W",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TeshW&backgroundColor=16a34a",
      time: "1m",
      text: "That goal changed the game!",
    },
    {
      id: "msg-3",
      user: "MajiKami",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MajiKami&backgroundColor=d97706",
      time: "1m",
      text: "KCA midfield is solid 💪",
    },
    {
      id: "msg-4",
      user: "FootyQueen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FootyQueen&backgroundColor=9333ea",
      time: "1m",
      text: "Who's winning this?",
    },
    {
      id: "msg-5",
      user: "Collins Dnego",
      badge: "Elite Bettor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=2563eb",
      time: "now",
      text: "I'm backing JKUAT till the end!",
    },
    {
      id: "msg-6",
      user: "JayGloria",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JayGloria&backgroundColor=db2777",
      time: "now",
      text: "This derby never disappoints 🔥",
    },
  ]);

  // Video upload states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCreator, setUploadCreator] = useState("Me (Predictor Champion)");
  const [uploadSummary, setUploadSummary] = useState("");
  const [uploadTags, setUploadTags] = useState("#prediction, #odds, #win");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFileUrl, setUploadFileUrl] = useState<string>("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setUploadFile(file);
    const objectUrl = URL.createObjectURL(file);
    setUploadFileUrl(objectUrl);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/")) {
        handleFileChange(file);
      } else {
        alert("Please drop a valid video file.");
      }
    }
  };

  const handleVideoUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      alert("Please select or drop a video file from your device first.");
      return;
    }
    if (!uploadTitle.trim()) {
      alert("Please enter a title for your clip.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress bar increase
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Complete upload: add to list
          const tagsArray = uploadTags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0)
            .map((t) => (t.startsWith("#") ? t : `#${t}`));

          // Create a mock gradient for the uploaded item
          const gradients = [
            "from-purple-600 via-pink-600 to-orange-500",
            "from-blue-600 via-cyan-500 to-indigo-500",
            "from-emerald-500 via-teal-600 to-blue-600",
            "from-red-500 via-pink-500 to-purple-600"
          ];
          const selectedGradient = gradients[Math.floor(Math.random() * gradients.length)];

          const newVideo: VideoItem = {
            id: `upload-${Date.now()}`,
            title: uploadTitle,
            creator: uploadCreator || "Anonymous Predictor",
            creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100", // Predictor avatar
            views: "1 View",
            likes: 1,
            liked: true,
            commentsCount: 0,
            tags: tagsArray.length > 0 ? tagsArray : ["#user-upload"],
            duration: "0:30",
            videoUrl: uploadFileUrl,
            thumbnailGradient: selectedGradient,
            summary: uploadSummary || "User-submitted video breakdown of match prediction details.",
            privacy: "public"
          };

          setVideosList([newVideo, ...videosList]);
          setVideoPage(0); // Go to first page to see the new clip
          setIsUploading(false);
          setShowUploadModal(false);
          
          // Reset form fields
          setUploadTitle("");
          setUploadSummary("");
          setUploadTags("#prediction, #odds, #win");
          setUploadFile(null);

          alert("Congratulations! Your video has been published to the Live Creator Feed successfully.");
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };
  
  // Videos section pagination and animation states
  const [videoPage, setVideoPage] = useState(0);
  const [videoDirection, setVideoDirection] = useState(1); // 1 = next, -1 = prev
  const [videoTransitionMode, setVideoTransitionMode] = useState<"horizontal" | "vertical">("horizontal");
  const itemsPerPage = 6;

  // Reels section single-theater view and transition states
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [reelDirection, setReelDirection] = useState(1); // 1 = down/next, -1 = up/prev
  const [showComments, setShowComments] = useState(true);
  const [newCommentInput, setNewCommentInput] = useState("");
  const wheelCooldownRef = useRef(false);

  const handleWheelNavigation = (e: React.WheelEvent) => {
    if (wheelCooldownRef.current) return;
    if (Math.abs(e.deltaY) < 20) return;
    wheelCooldownRef.current = true;
    setTimeout(() => {
      wheelCooldownRef.current = false;
    }, 400);

    if (e.deltaY > 0) {
      setReelDirection(1);
      setActiveReelIndex((prev) => (prev + 1) % reelsList.length);
    } else {
      setReelDirection(-1);
      setActiveReelIndex((prev) => (prev - 1 + reelsList.length) % reelsList.length);
    }
  };

  // Success Factory single-theater view and transition states
  const [activeSFIndex, setActiveSFIndex] = useState(0);
  const [sfDirection, setSfDirection] = useState(1); // 1 = down/next, -1 = up/prev
  const [showPartnershipModal, setShowPartnershipModal] = useState(false);

  // Existing soccer game simulation state (Collapsible interactive widget)
  const [showMatchTracker, setShowMatchTracker] = useState(true);

  // Fallback KPL Derby matchup for Kenyan Show isolated channel
  const fallbackMatch: Match = {
    id: "m-kpl-default",
    homeTeam: "A.F.C Leopards",
    awayTeam: "Gor Mahia",
    league: "Kenyan Premier League (Mashemeji Derby Live)",
    status: "LIVE",
    time: "78'",
    score: "2-1",
    odds: { "1": 2.10, "X": 3.20, "2": 2.90 },
    trivia: "The Mashemeji Derby is Kenya's oldest and most heated football rivalry, dating back to 1968.",
    flActiveCount: 42
  };

  const [activeMatch, setActiveMatch] = useState<Match | null>(selectedMatch || fallbackMatch);
  const [isPlaying, setIsPlaying] = useState(true);
  const [matchMinute, setMatchMinute] = useState<number>(70);
  const [scoreHome, setScoreHome] = useState<number>(2);
  const [scoreAway, setScoreAway] = useState<number>(1);
  const [ballPos, setBallPos] = useState({ x: 50, y: 50 });
  const [homePlayerPos, setHomePlayerPos] = useState({ x: 40, y: 48 });
  const [awayPlayerPos, setAwayPlayerPos] = useState({ x: 60, y: 52 });
  const [commentaryList, setCommentaryList] = useState<Array<{ time: string; text: string; type: "ai" | "tactical" | "system" }>>([
    { time: "65'", text: "Yellow card issued to Chelsea midfielder for a technical foul on Bruno.", type: "system" },
    { time: "60'", text: "TACTICAL BRIEF: Manchester United has consolidated into a mid-block pivot, trying to close half-spaces.", type: "tactical" },
    { time: "58'", text: "GOAL! Bruno Fernandes clinical finish into the bottom right corner! Assist by Garnacho.", type: "ai" }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Kenyan Show localized persistent comments state
  const [kenyanShowComments, setKenyanShowComments] = useState<Array<{
    id: string;
    userName: string;
    userAvatar: string;
    text: string;
    timestamp: string;
    likes: number;
    hasLiked?: boolean;
    tier?: string;
  }>>([
    {
      id: "c-1",
      userName: "Collins Dnego",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2",
      text: "Ingwe is looking extremely sharp! AFC Leopards overlaps on wings is really stretching Gor Mahia's mid block.",
      timestamp: "Just now",
      likes: 21,
      tier: "Lvl 42 Treasurer"
    },
    {
      id: "c-2",
      userName: "Zephaniah Mwangi",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zephaniah&backgroundColor=a855f7",
      text: "Gor Mahia's striking force has higher counter speed. I backed Gor Mahia win or draw on my LookUpto active escrow ticket. High values locked!",
      timestamp: "3 mins ago",
      likes: 15,
      tier: "Elite Coach"
    },
    {
      id: "c-3",
      userName: "Collo Dnego",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collo&backgroundColor=059669",
      text: "This real-time pitch simulator ratios are incredibly synced with betting markets. Zero house margins is the real revolution here.",
      timestamp: "9 mins ago",
      likes: 8,
      tier: "Pro Analyst"
    },
    {
      id: "c-4",
      userName: "Joy Gloria",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joy&backgroundColor=db2777",
      text: "Let's lock the escrow match invitation now. Anyone challenging the 2-1 scoreline? Ready to stake casual ratio matched pool!",
      timestamp: "14 mins ago",
      likes: 34,
      tier: "Grandmaster"
    }
  ]);
  const [newCommentText, setNewCommentText] = useState("");

  // Interaction dropdown menus
  const [activeMenuVideoId, setActiveMenuVideoId] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  
  // Videos Redesign states matching user reference image
  const [videoSearchFilter, setVideoSearchFilter] = useState("");
  const [videoCategoryTab, setVideoCategoryTab] = useState<"All" | "Trending" | "Live" | "Following" | "My Videos">("All");
  const [videoSortMode, setVideoSortMode] = useState<"Most Recent" | "Most Popular">("Most Recent");
  const [selectedDetailVideoId, setSelectedDetailVideoId] = useState<string>("v-1");
  const [newDetailComment, setNewDetailComment] = useState("");
  const [detailCommentsMap, setDetailCommentsMap] = useState<Record<string, Array<{
    id: string;
    userName: string;
    userAvatar: string;
    verified?: boolean;
    text: string;
    timestamp: string;
    likes: number;
    hasLiked?: boolean;
  }>>>({
    "v-1": [
      {
        id: "dc-1",
        userName: "Kev The Analyst",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kev&backgroundColor=3b82f6",
        verified: true,
        text: "Brilliant analysis! Man Utd defense will be key.",
        timestamp: "2h ago",
        likes: 34
      },
      {
        id: "dc-2",
        userName: "Lynne_Bet",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lynne&backgroundColor=ec4899",
        verified: false,
        text: "I agree! Rashford is in great form too.",
        timestamp: "1h ago",
        likes: 12
      },
      {
        id: "dc-3",
        userName: "Kiprono",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kiprono&backgroundColor=10b981",
        verified: false,
        text: "Disagree. I think midfield will decide this one.",
        timestamp: "1h ago",
        likes: 8
      }
    ]
  });

  // Partners Program Application State
  const [hasAppliedPartner, setHasAppliedPartner] = useState(false);
  const [appliedStatusText, setAppliedStatusText] = useState("");

  // Videos Data Store
  const [localVideosList, setLocalVideosList] = useState<VideoItem[]>([
    {
      id: "v-1",
      title: "How Man Utd Can Win the Derby This Weekend",
      creator: "Collins Dnego",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2",
      views: "14.2K",
      likes: 1200,
      liked: false,
      commentsCount: 86,
      tags: ["#ManUtd", "#Derby", "#EPL"],
      duration: "3:42",
      timeAgo: "2h ago",
      thumbnailGradient: "from-red-600 to-red-900",
      bgImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
      summary: "Detailed tactical breakdown of how United can exploit space and win the derby."
    },
    {
      id: "v-2",
      title: "Analyzing EPL Top 4 Race with Live Stats",
      creator: "Zephaniah Mwangi",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zephaniah&backgroundColor=a855f7",
      views: "8.9K",
      likes: 842,
      liked: false,
      commentsCount: 54,
      tags: ["#EPL", "#Top4", "#Analytics"],
      duration: "5:12",
      timeAgo: "5h ago",
      thumbnailGradient: "from-blue-600 to-indigo-900",
      bgImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800",
      summary: "Statistical analysis of top 4 contenders and upcoming crucial fixtures."
    },
    {
      id: "v-3",
      title: "Arsenal vs Chelsea Tactical Breakdown",
      creator: "Metrine Karandini",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Metrine&backgroundColor=ec4899",
      views: "6.1K",
      likes: 620,
      liked: false,
      commentsCount: 41,
      tags: ["#Arsenal", "#Chelsea", "#Tactics"],
      duration: "2:15",
      timeAgo: "1d ago",
      thumbnailGradient: "from-red-700 to-blue-900",
      bgImage: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=800",
      summary: "Key tactical battles on the wings and midfield setup for Arsenal vs Chelsea."
    },
    {
      id: "v-4",
      title: "La Liga Weekend Predictions & Best Bets",
      creator: "Hon Amini O. Junior",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hon&backgroundColor=f59e0b",
      views: "11.3K",
      likes: 1100,
      liked: false,
      commentsCount: 72,
      tags: ["#LaLiga", "#Predictions", "#BestBets"],
      duration: "8:05",
      timeAgo: "1d ago",
      thumbnailGradient: "from-amber-600 to-amber-900",
      bgImage: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&q=80&w=800",
      summary: "Comprehensive match previews for Real Madrid, Barcelona, and Atletico Madrid."
    },
    {
      id: "v-5",
      title: "Staking Pool Strategy That Always Works",
      creator: "Collo Dnego Page",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collo&backgroundColor=059669",
      views: "9.4K",
      likes: 930,
      liked: false,
      commentsCount: 63,
      tags: ["#Staking", "#Strategy", "#LookUpto"],
      duration: "4:30",
      timeAgo: "2d ago",
      thumbnailGradient: "from-emerald-600 to-teal-900",
      bgImage: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&q=80&w=800",
      summary: "How to structure group staking pools to minimize risk and maximize gains."
    },
    {
      id: "v-6",
      title: "Top 5 Underdogs to Watch This Season",
      creator: "Zephaniah Mwangi",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zephaniah&backgroundColor=a855f7",
      views: "7.2K",
      likes: 710,
      liked: false,
      commentsCount: 38,
      tags: ["#Underdogs", "#Football", "#Tips"],
      duration: "3:15",
      timeAgo: "2d ago",
      thumbnailGradient: "from-purple-600 to-indigo-900",
      bgImage: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&q=80&w=800",
      summary: "High-value underdog picks that offer incredible betting ratios."
    }
  ]);

  // Success Factory Videos (Stories from Users who found Facelook/LookUpto important)
  const [localSuccessFactoryList, setLocalSuccessFactoryList] = useState<VideoItem[]>([
    {
      id: "sf-1",
      title: "My $3,200 payout milestone story using Facelook Pages! 💸🌸",
      creator: "Collins Dnego",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2",
      views: "34.5K",
      likes: 4120,
      liked: true,
      commentsCount: 890,
      tags: ["#success_story", "#wallet_withdrawn", "#payout_milestone", "#facelook"],
      duration: "4:50",
      thumbnailGradient: "from-indigo-600 to-violet-955 shadow-inner",
      summary: "How setting up and syncing 'Baridi SANA Page' allowed automatic payouts and decentralized sports predictions!"
    },
    {
      id: "sf-2",
      title: "From standard bettor to elite clan-lead: My journey 📈🏆",
      creator: "Baridi SANA Page admin",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Baridi&backgroundColor=1877f2",
      views: "18.7K",
      likes: 1980,
      liked: false,
      commentsCount: 410,
      tags: ["#facelook_important", "#clan_influence", "#sport_predictions"],
      duration: "6:10",
      thumbnailGradient: "from-sky-700 to-blue-900",
      summary: "Why Facelook Pages provided the crucial user interface to build community sports syndicates."
    }
  ]);

  // Reels Data Store (Separated from Videos)
  const [localReelsList, setLocalReelsList] = useState<VideoItem[]>([
    {
      id: "r-1",
      title: "Bruno with another world class goal! 🔥",
      creator: "FootyKenya",
      creatorAvatar: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=120",
      verified: true,
      views: "52K",
      likes: 2400,
      liked: false,
      commentsCount: 186,
      shares: 320,
      tags: ["#ManUtd", "#PremierLeague", "#FaceLookBet"],
      pillTags: ["#ManUtd", "#PremierLeague", "#LookUpto", "#Soccer", "#Highlights"],
      duration: "00:45",
      timeAgo: "1h ago",
      thumbnailGradient: "from-red-900 via-[#18181b] to-black",
      bgImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1000",
      summary: "Bruno Fernandes strikes a breathtaking volley into the top corner!"
    },
    {
      id: "r-2",
      title: "🔥 Nairobi Derby Live Crowd Reaction!",
      creator: "Collins Dnego",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2",
      verified: true,
      views: "155K",
      likes: 12400,
      liked: false,
      commentsCount: 1530,
      shares: 890,
      tags: ["#Derby", "#Nairobi", "#Football"],
      pillTags: ["#Mashemeji", "#KPL", "#GorMahia", "#AFCLeopards"],
      duration: "00:45",
      timeAgo: "2h ago",
      thumbnailGradient: "from-red-650 via-orange-550 to-amber-500",
      bgImage: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=1000",
      summary: "Pure madness at the stadium when the derby winning goal was struck in the 94th minute!"
    },
    {
      id: "r-3",
      title: "🎯 Correct prediction payout highlight by admin",
      creator: "Baridi SANA Page admin",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Baridi&backgroundColor=1877f2",
      verified: true,
      views: "98K",
      likes: 8520,
      liked: true,
      commentsCount: 940,
      shares: 410,
      tags: ["#payout", "#lookupto_clan", "#fever"],
      pillTags: ["#Prediction", "#Payout", "#Staking", "#Winners"],
      duration: "00:59",
      timeAgo: "3h ago",
      thumbnailGradient: "from-blue-600 via-indigo-500 to-purple-600",
      bgImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1000",
      summary: "How we hit a dynamic match slip live. Simple guides to copying calculations."
    },
    {
      id: "r-4",
      title: "⚽ Brilliant tactical defense analysis in 30 seconds",
      creator: "Hon Amini O. Junior",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hon&backgroundColor=f59e0b",
      verified: true,
      views: "45K",
      likes: 3120,
      liked: false,
      commentsCount: 184,
      shares: 150,
      tags: ["#tactics", "#defense", "#premier_league"],
      pillTags: ["#Tactics", "#EPL", "#Analysis", "#Soccer"],
      duration: "00:30",
      timeAgo: "5h ago",
      thumbnailGradient: "from-teal-600 via-emerald-500 to-green-600",
      bgImage: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&q=80&w=1000",
      summary: "Why a low defensive block was effective during the Premier League match today."
    }
  ]);

  const [reelCommentsMap, setReelCommentsMap] = useState<Record<string, {
    id: string;
    author: string;
    verified?: boolean;
    avatar: string;
    time: string;
    text: string;
    likes: number;
  }[]>>({
    "r-1": [
      {
        id: "c-1",
        author: "Kev The Analyst",
        verified: true,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
        time: "1h ago",
        text: "Bruno never disappoints! Man U are back! 🔥",
        likes: 120
      },
      {
        id: "c-2",
        author: "Lynne._Bet",
        verified: false,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
        time: "56m ago",
        text: "If they keep this form, top 4 is possible! 👏",
        likes: 64
      },
      {
        id: "c-3",
        author: "Kiprono",
        verified: false,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
        time: "50m ago",
        text: "Placed my bet earlier. Looking good so far ✅",
        likes: 42
      },
      {
        id: "c-4",
        author: "Mwas",
        verified: false,
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=100",
        time: "30m ago",
        text: "Defense still shaky though 🤔",
        likes: 28
      },
      {
        id: "c-5",
        author: "Jayden",
        verified: false,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
        time: "28m ago",
        text: "Bruno for Ballon d'Or? 👀",
        likes: 19
      }
    ]
  });

  const handleAddComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCommentInput.trim()) return;
    const currentReel = (propsReelsList || localReelsList)[activeReelIndex] || (propsReelsList || localReelsList)[0];
    if (!currentReel) return;

    const newC = {
      id: `c-${Date.now()}`,
      author: "Me (Predictor Champion)",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
      time: "Just now",
      text: newCommentInput.trim(),
      likes: 0
    };

    setReelCommentsMap(prev => ({
      ...prev,
      [currentReel.id]: [...(prev[currentReel.id] || []), newC]
    }));
    setNewCommentInput("");
  };

  const handleLikeComment = (commentId: string) => {
    const currentReel = (propsReelsList || localReelsList)[activeReelIndex] || (propsReelsList || localReelsList)[0];
    if (!currentReel) return;
    setReelCommentsMap(prev => ({
      ...prev,
      [currentReel.id]: (prev[currentReel.id] || []).map(c => 
        c.id === commentId ? { ...c, likes: c.likes + 1 } : c
      )
    }));
  };

  const handleLikeReel = (reelId: string) => {
    const setList = propsSetReelsList || setLocalReelsList;
    setList((prev: VideoItem[]) => prev.map(r => {
      if (r.id === reelId) {
        return { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 };
      }
      return r;
    }));
  };

  const videosList = propsVideosList || localVideosList;
  const setVideosList = propsSetVideosList || setLocalVideosList;
  const successFactoryList = propsSuccessFactoryList || localSuccessFactoryList;
  const setSuccessFactoryList = propsSetSuccessFactoryList || setLocalSuccessFactoryList;
  const reelsList = propsReelsList || localReelsList;
  const setReelsList = propsSetReelsList || setLocalReelsList;


  // Reel Feed Sub-Tabs state (Trending, Following, For You)
  const [reelTab, setReelTab] = useState<"trending" | "following" | "foryou">("trending");
  const [followedCreators, setFollowedCreators] = useState<string[]>([
    "FootyKenya", "Collins Dnego", "Hon Amini O. Junior", "Baridi SANA Page admin", "Zephaniah Mwangi"
  ]);
  const [userSearchHistory, setUserSearchHistory] = useState<string[]>([
    "Premier League", "Nairobi Derby", "Manchester United", "Correct Score Odds"
  ]);
  const [userMostWatched, setUserMostWatched] = useState<string[]>([
    "Tactical Analysis", "Match Highlights", "Live Crowd Reactions"
  ]);
  const [newSearchInput, setNewSearchInput] = useState("");

  // Handle Create Reel state
  const [showCreateReel, setShowCreateReel] = useState(false);
  const [newReelTitle, setNewReelTitle] = useState("");
  const [newReelSummary, setNewReelSummary] = useState("");
  const [newReelGradient, setNewReelGradient] = useState("from-pink-500 via-purple-600 to-indigo-700");

  // Interactive Tutorial Videos and Advertisements
  const tutorials = [
    {
      id: "tut-1",
      title: "Tutorial: Fast path to synchronize Pages & switch accounts",
      instructor: "Collins Dnego (Elite Partner)",
      length: "3 mins",
      views: "5,410 views",
      stepsCount: 4,
      desc: "Detailed visual guide demonstrating the See All Profiles switcher and how user profiles handle pages without overlapping layouts."
    },
    {
      id: "tut-2",
      title: "Tutorial: Navigating LookGroups & Staking syndicate ratios",
      instructor: "Zephaniah Mwangi (Veteran)",
      length: "5 mins",
      views: "8,209 views",
      stepsCount: 5,
      desc: "Learn about the peer-to-peer LookUpto engine, live odds calculators, and setting community goals for sports predictions."
    }
  ];

  // Helper useEffect for the Kenyan Show tab shortcut to ensure simulator opens
  useEffect(() => {
    if (forceShowSimulation > 0) {
      setWatchSubTab("kenyan_show");
      setShowMatchTracker(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [forceShowSimulation]);

  // Sync state if selectedMatch changes from outside (e.g. Game Hub)
  useEffect(() => {
    if (selectedMatch) {
      setActiveMatch(selectedMatch);
      const parts = selectedMatch.score.split("-");
      if (parts.length === 2) {
        setScoreHome(parseInt(parts[0]) || 0);
        setScoreAway(parseInt(parts[1]) || 0);
      }
      const min = parseInt(selectedMatch.time.replace("'", ""));
      setMatchMinute(isNaN(min) ? 45 : min);
    }
  }, [selectedMatch]);

  // Football pitch live simulation ticker
  useEffect(() => {
    let timer: any;
    if (isPlaying && activeMatch && activeMatch.status === "LIVE") {
      timer = setInterval(() => {
        setMatchMinute((prev) => {
          if (prev >= 90) {
            setIsPlaying(false);
            return 90;
          }
          const bx = 30 + Math.random() * 40;
          const by = 20 + Math.random() * 60;
          setBallPos({ x: bx, y: by });
          setHomePlayerPos({ x: bx - 4 - Math.random() * 6, y: by + (Math.random() - 0.5) * 10 });
          setAwayPlayerPos({ x: bx + 4 + Math.random() * 6, y: by + (Math.random() - 0.5) * 10 });

          if (Math.random() > 0.85) {
            const randomEvents = [
              "Fierce tackle wins possession in the wide spaces!",
              "Spectacular save from the goalkeeper tipping it over the crossbar!",
              "Sensational counter-attack on the left-wing flank!",
              "Offside flag ruins a beautiful through-ball chance.",
              "The crowd chant intensifies as the attack builds up!",
              "Shouts of hand-ball are waved away by the referee."
            ];
            const eventText = randomEvents[Math.floor(Math.random() * randomEvents.length)];
            setCommentaryList((prevList) => [
              { time: `${prev + 1}'`, text: eventText, type: "system" },
              ...prevList.slice(0, 15)
            ]);
          }

          if (Math.random() > 0.985) {
            const isHomeScoring = Math.random() > 0.5;
            if (isHomeScoring) {
              setScoreHome((s) => s + 1);
              setCommentaryList((pl) => [
                { time: `${prev + 1}'`, text: `🎉 GOAL! Beautiful combination play leads to a stunner into the top corner for ${activeMatch.homeTeam}!`, type: "ai" },
                ...pl
              ]);
            } else {
              setScoreAway((s) => s + 1);
              setCommentaryList((pl) => [
                { time: `${prev + 1}'`, text: `🎉 GOAL! Sensational counter strikes the net for ${activeMatch.awayTeam}! Deflection caught the keeper off-balance.`, type: "ai" },
                ...pl
              ]);
            }
          }
          return prev + 1;
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeMatch]);

  // AI generated broadcaster insights
  const fetchAiCommentary = async () => {
    if (!activeMatch) return;
    setIsAiLoading(true);
    try {
      const response = await fetch("/api/generate-commentary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homeTeam: activeMatch.homeTeam,
          awayTeam: activeMatch.awayTeam,
          minute: `${matchMinute}'`,
          score: `${scoreHome} - ${scoreAway}`,
        }),
      });
      const data = await response.json();
      if (data) {
        setCommentaryList((prev) => [
          { time: `${matchMinute}'`, text: `🎙️ BROADCASTER: ${data.leadCommentary}`, type: "ai" },
          { time: `${matchMinute}'`, text: `🍻 PUB BANTER: ${data.crowdBanter}`, type: "system" },
          { time: `${matchMinute}'`, text: `📊 TACTICAL: ${data.tacticalAnalysis}`, type: "tactical" },
          ...prev
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleLikeVideo = (id: string, listType: "videos" | "sf") => {
    if (listType === "videos") {
      setVideosList(prev => prev.map(v => {
        if (v.id === id) {
          return { ...v, liked: !v.liked, likes: v.liked ? v.likes - 1 : v.likes + 1 };
        }
        return v;
      }));
    } else {
      setSuccessFactoryList(prev => prev.map(v => {
        if (v.id === id) {
          return { ...v, liked: !v.liked, likes: v.liked ? v.likes - 1 : v.likes + 1 };
        }
        return v;
      }));
    }
  };

  const handleApplyPartnership = () => {
    setHasAppliedPartner(true);
    setAppliedStatusText("Applying model credentials... Checking compliance metrics... Your profile holds 1,209 followers which exceeds the 1,000 threshold requirement! Application is now under pending administrative view.");
    alert("Application successfully submitted! You've met all eligibility rules.");
  };

  // Video Section Animation Variants
  const videoContainerVariants = {
    enter: (direction: number) => ({
      x: videoTransitionMode === "horizontal" ? (direction > 0 ? 120 : -120) : 0,
      y: videoTransitionMode === "vertical" ? (direction > 0 ? 150 : -150) : 0,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 280,
        damping: 24,
        mass: 1
      }
    },
    exit: (direction: number) => ({
      x: videoTransitionMode === "horizontal" ? (direction < 0 ? 120 : -120) : 0,
      y: videoTransitionMode === "vertical" ? (direction < 0 ? 150 : -150) : 0,
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.2 }
    })
  };

  const totalVideoPages = Math.ceil(videosList.length / itemsPerPage);
  const currentVideos = videosList.slice(videoPage * itemsPerPage, (videoPage + 1) * itemsPerPage);

  const handleNextVideoPage = () => {
    setVideoDirection(1);
    setVideoPage((prev) => (prev + 1) % totalVideoPages);
  };

  const handlePrevVideoPage = () => {
    setVideoDirection(-1);
    setVideoPage((prev) => (prev - 1 + totalVideoPages) % totalVideoPages);
  };

  // Reel Section Animation Variants
  const reelVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.96
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 280,
        damping: 24,
        mass: 1
      }
    },
    exit: (direction: number) => ({
      y: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.96,
      transition: { duration: 0.22 }
    })
  };

  return (
    <div className="space-y-6 w-full max-w-full px-1 sm:px-2 py-1 font-sans text-left">
      
      {/* 1. APPLET WATCH TAB HEADER CONTROL - Sub-Tabs aligned horizontally + Top Right Action Bar */}
      <div className="bg-white dark:bg-[#1c1d1e] rounded-2xl shadow-sm border border-gray-200/55 dark:border-zinc-800 p-2 text-left flex items-center justify-between gap-3">
        <div className="flex flex-row items-center gap-1.5 overflow-x-auto whitespace-nowrap p-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-zinc-800">
          <button
            onClick={() => setWatchSubTab("videos")}
            className={`py-2 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0 ${
              watchSubTab === "videos"
                ? "bg-blue-50 dark:bg-blue-950/45 text-blue-650 dark:text-blue-400 border border-blue-150 dark:border-blue-900 shadow-sm"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Videos</span>
          </button>
          
          <button
            onClick={() => setWatchSubTab("reels")}
            className={`py-2 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0 ${
              watchSubTab === "reels"
                ? "bg-purple-50 dark:bg-purple-950/45 text-purple-650 dark:text-purple-400 border border-purple-150 dark:border-purple-900 shadow-sm"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-purple-500" />
            <span>Reels</span>
          </button>
          
          <button
            onClick={() => setWatchSubTab("success_factory")}
            className={`py-2 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0 ${
              watchSubTab === "success_factory"
                ? "bg-amber-50 dark:bg-amber-950/45 text-amber-650 dark:text-amber-400 border border-amber-150 dark:border-amber-900 shadow-sm"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-500" />
            <span>Success Factory</span>
          </button>
          
          <button
            onClick={() => setWatchSubTab("kenyan_show")}
            className={`py-2 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0 ${
              watchSubTab === "kenyan_show"
                ? "bg-emerald-50 dark:bg-emerald-950/45 text-emerald-650 dark:text-emerald-400 border border-emerald-150 dark:border-emerald-900 shadow-sm"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
            }`}
            id="watch-tab-kenyan-show"
          >
            <span className="text-sm">🇰🇪</span>
            <span>Kenyan Show</span>
          </button>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0 pr-1">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-[#1877f2] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Video / Reel</span>
          </button>

          <button
            onClick={() => setShowPartnershipModal(true)}
            className="px-3.5 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Share Story</span>
          </button>

          <div className="relative w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-gray-300 cursor-pointer">
            <span className="text-xs">🔔</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">2</span>
          </div>

          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2" 
            alt="User avatar" 
            className="w-8 h-8 rounded-full object-cover border-2 border-[#1877f2] shrink-0"
          />
        </div>
      </div>

      {/* 3. CONDITIONAL RENDER BY ACTIVE WATCH TAB SUB-SELECTION */}
      
      {/* ======================= SUB-TAB: VIDEOS ======================= */}
      {watchSubTab === "videos" && (() => {
        const allVideos = propsVideosList || localVideosList;
        
        // Filter by search & pill category
        const filteredVideos = allVideos.filter(v => {
          const matchesSearch = !videoSearchFilter || 
            v.title.toLowerCase().includes(videoSearchFilter.toLowerCase()) ||
            v.creator.toLowerCase().includes(videoSearchFilter.toLowerCase());

          if (!matchesSearch) return false;

          if (videoCategoryTab === "Trending") return (v.likes || 0) > 800;
          if (videoCategoryTab === "Live") return true;
          if (videoCategoryTab === "Following") return followedCreators.includes(v.creator);
          if (videoCategoryTab === "My Videos") return v.creator.includes("Collins") || v.creator.includes("Me");

          return true;
        });

        const selectedVideo = allVideos.find(v => v.id === selectedDetailVideoId) || allVideos[0] || localVideosList[0];
        const commentsForSelected = detailCommentsMap[selectedVideo.id] || [];
        const isFollowingSelected = followedCreators.includes(selectedVideo.creator);

        return (
          <div className="space-y-6 font-sans text-left animate-in fade-in duration-200">
            
            {/* 1. TOP SEARCH & UPLOAD BAR */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Search Input */}
              <div className="relative w-full sm:max-w-xl">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={videoSearchFilter}
                  onChange={(e) => setVideoSearchFilter(e.target.value)}
                  placeholder="Search videos, creators, teams..."
                  className="w-full bg-[#f0f2f5] dark:bg-zinc-800/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm font-medium pl-11 pr-4 py-3 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Upload Video Button */}
              <button
                onClick={() => setShowUploadModal(true)}
                className="w-full sm:w-auto px-6 py-3 bg-[#1877f2] hover:bg-blue-600 active:scale-95 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs shrink-0 cursor-pointer"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span>Upload Video</span>
              </button>
            </div>

            {/* 2. FILTER PILLS & SORT ROW */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {(["All", "Trending", "Live", "Following", "My Videos"] as const).map((cat) => {
                  const isActive = videoCategoryTab === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setVideoCategoryTab(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        isActive
                          ? "bg-[#1877f2] text-white shadow-2xs"
                          : "bg-[#e4e6eb] dark:bg-zinc-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={videoSortMode}
                    onChange={(e) => setVideoSortMode(e.target.value as any)}
                    className="appearance-none bg-white dark:bg-[#242526] border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-1.5 pr-8 text-xs font-semibold text-gray-700 dark:text-gray-200 cursor-pointer focus:outline-none shadow-2xs"
                  >
                    <option value="Most Recent">Most Recent</option>
                    <option value="Most Popular">Most Popular</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 3. MAIN SPLIT GRID (3 Columns x 2 Rows Video Grid on Left + Selected Detail Panel on Far Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">
              
              {/* LEFT COLUMN: 3 Columns x 2 Rows Grid of Video Cards */}
              <div className="lg:col-span-7 xl:col-span-7 space-y-5 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {filteredVideos.map((video) => {
                    const isSelected = selectedVideo.id === video.id;
                    
                    return (
                      <div 
                        key={video.id}
                        onClick={() => setSelectedDetailVideoId(video.id)}
                        className={`bg-white dark:bg-[#242526] rounded-2xl border overflow-hidden shadow-2xs transition-all cursor-pointer group flex flex-col justify-between ${
                          isSelected 
                            ? "ring-2 ring-[#1877f2] border-[#1877f2]" 
                            : "border-gray-200/80 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"
                        }`}
                      >
                        {/* Thumbnail Container */}
                        <div className="aspect-video w-full relative bg-gray-900 overflow-hidden shrink-0">
                          {video.bgImage ? (
                            <img 
                              src={video.bgImage} 
                              alt={video.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${video.thumbnailGradient}`} />
                          )}

                          {/* Dark gradient overlay */}
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-white/90 text-[#1877f2] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                              <Play className="w-4 h-4 translate-x-0.5 fill-current" />
                            </div>
                          </div>

                          {/* Duration Badge */}
                          <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/75 text-white text-[10px] font-bold rounded backdrop-blur-xs">
                            {video.duration || "3:00"}
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-2.5 space-y-2 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            {/* Creator Row */}
                            <div className="flex items-center gap-1.5">
                              <img 
                                src={video.creatorAvatar} 
                                alt={video.creator} 
                                className="w-5 h-5 rounded-full object-cover border border-gray-100 shrink-0"
                              />
                              <span className="text-[11px] font-bold text-gray-900 dark:text-white flex items-center gap-1 truncate min-w-0">
                                <span className="truncate">{video.creator}</span>
                                <CheckCircle2 className="w-3 h-3 text-[#1877f2] fill-[#1877f2] text-white shrink-0" />
                              </span>
                              <span className="text-[9px] text-gray-400 ml-auto shrink-0 font-medium">
                                {video.timeAgo || "2h ago"}
                              </span>
                            </div>

                            {/* Video Title */}
                            <h3 className="text-[11px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#1877f2] transition-colors">
                              {video.title}
                            </h3>
                          </div>

                          {/* Card Stats & Challenge Button */}
                          <div className="pt-1.5 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-0.5 hover:text-red-500 transition-colors">
                                <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                                <span>{video.likes >= 1000 ? `${(video.likes / 1000).toFixed(1)}K` : video.likes}</span>
                              </span>
                              <span className="flex items-center gap-0.5">
                                <MessageCircle className="w-3 h-3" />
                                <span>{video.commentsCount}</span>
                              </span>
                              <span className="flex items-center gap-0.5">
                                <Eye className="w-3 h-3" />
                                <span>{video.views}</span>
                              </span>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onJoinChallenge) {
                                  onJoinChallenge(video.id);
                                } else {
                                  alert(`Challenge accepted for "${video.title}"!`);
                                }
                              }}
                              className="px-2 py-0.5 border border-[#1877f2] text-[#1877f2] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[9px] font-bold rounded flex items-center gap-0.5 transition-colors cursor-pointer shrink-0"
                            >
                              <span>⚔️ Challenge</span>
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Load More Button at bottom of Grid */}
                <div className="pt-1 text-center">
                  <button
                    onClick={() => alert("All available creator videos are loaded.")}
                    className="px-5 py-1.5 bg-white dark:bg-[#242526] border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  >
                    <span>Load more</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: Interactive Expanded Video Player & Details Panel on Far End */}
              <div className="lg:col-span-5 xl:col-span-5 bg-white dark:bg-[#242526] rounded-2xl border border-gray-200/80 dark:border-zinc-800 overflow-hidden shadow-sm p-4 md:p-5 space-y-4 w-full">
                
                {/* Header Title + Close Button */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
                  <h2 className="text-base md:text-lg font-black text-gray-900 dark:text-white truncate max-w-[90%]">
                    {selectedVideo.title}
                  </h2>
                  <button
                    onClick={() => alert("Video panel minimized")}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Video Player Box - ENLARGED FRAME */}
                <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden relative group shadow-md border border-gray-900">
                  {selectedVideo.bgImage ? (
                    <img 
                      src={selectedVideo.bgImage} 
                      alt={selectedVideo.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${selectedVideo.thumbnailGradient}`} />
                  )}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <button 
                      onClick={() => alert(`Playing video stream for "${selectedVideo.title}"`)}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white text-[#1877f2] flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                    >
                      <Play className="w-8 h-8 md:w-9 md:h-9 translate-x-0.5 fill-current" />
                    </button>
                  </div>

                  {/* Controls Bar at bottom of player */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3.5 md:p-4 flex items-center justify-between text-white text-xs md:text-sm font-mono select-none">
                    <div className="flex items-center gap-4">
                      <Play className="w-5 h-5 fill-current cursor-pointer hover:scale-110 transition-transform" />
                      <Volume2 className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" />
                      <span className="font-semibold">0:00 / {selectedVideo.duration || "3:42"}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-sans font-black bg-white/20 px-1.5 py-0.5 rounded cursor-pointer hover:bg-white/30">HD</span>
                      <span className="cursor-pointer hover:scale-110 transition-transform text-base">⚙️</span>
                      <span className="cursor-pointer hover:scale-110 transition-transform text-base">⛶</span>
                    </div>
                  </div>
                </div>

                {/* Creator Profile Card */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedVideo.creatorAvatar} 
                      alt={selectedVideo.creator} 
                      className="w-12 h-12 md:w-13 md:h-13 rounded-full object-cover border-2 border-gray-100 shadow-2xs"
                    />
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <span>{selectedVideo.creator}</span>
                        <CheckCircle2 className="w-4 h-4 text-[#1877f2] fill-[#1877f2] text-white shrink-0" />
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Elite LookUpto Bettor
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (isFollowingSelected) {
                        setFollowedCreators(followedCreators.filter(c => c !== selectedVideo.creator));
                      } else {
                        setFollowedCreators([...followedCreators, selectedVideo.creator]);
                      }
                    }}
                    className={`px-5 py-2 font-bold text-xs md:text-sm rounded-xl transition-all cursor-pointer ${
                      isFollowingSelected
                        ? "bg-[#1877f2] text-white shadow-2xs"
                        : "border-2 border-[#1877f2] text-[#1877f2] hover:bg-blue-50 dark:hover:bg-blue-950/40"
                    }`}
                  >
                    {isFollowingSelected ? "Following" : "Follow"}
                  </button>
                </div>

                {/* Social Engagement Row */}
                <div className="flex items-center justify-between py-3 border-y border-gray-100 dark:border-zinc-800 text-xs md:text-sm text-gray-600 dark:text-gray-300 font-bold">
                  <button 
                    onClick={() => {
                      const updatedList = allVideos.map(v => {
                        if (v.id === selectedVideo.id) {
                          return { ...v, liked: !v.liked, likes: v.liked ? v.likes - 1 : v.likes + 1 };
                        }
                        return v;
                      });
                      if (propsSetVideosList) propsSetVideosList(updatedList);
                      else setLocalVideosList(updatedList);
                    }}
                    className="flex items-center gap-2 hover:text-red-500 cursor-pointer transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${selectedVideo.liked ? "text-red-500 fill-red-500" : ""}`} />
                    <span>{selectedVideo.likes >= 1000 ? `${(selectedVideo.likes / 1000).toFixed(1)}K` : selectedVideo.likes}</span>
                  </button>

                  <button className="flex items-center gap-2 hover:text-[#1877f2] cursor-pointer transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>{commentsForSelected.length || selectedVideo.commentsCount} Comments</span>
                  </button>

                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Video link copied to clipboard!");
                    }}
                    className="flex items-center gap-2 hover:text-[#1877f2] cursor-pointer transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>

                  <button 
                    onClick={() => {
                      if (onSaveItem) onSaveItem("video", selectedVideo.title);
                      else alert(`Saved "${selectedVideo.title}" to favorites.`);
                    }}
                    className="flex items-center gap-2 hover:text-[#1877f2] cursor-pointer transition-colors"
                  >
                    <Bookmark className="w-5 h-5" />
                    <span>Save</span>
                  </button>

                  <button 
                    onClick={() => alert("More video options")}
                    className="p-1 hover:text-[#1877f2] cursor-pointer transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Comments Panel - ENLARGED & EXPANDED */}
                <div className="space-y-4 pt-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      Comments ({commentsForSelected.length})
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 cursor-pointer">
                      <span>Most Recent</span>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Expanded List of Comments */}
                  <div className="space-y-3.5 max-h-[380px] md:max-h-[460px] overflow-y-auto pr-2 font-sans">
                    {commentsForSelected.map((cmt) => (
                      <div key={cmt.id} className="flex items-start gap-3 text-xs md:text-sm">
                        <img 
                          src={cmt.userAvatar} 
                          alt={cmt.userName} 
                          className="w-9 h-9 rounded-full object-cover shrink-0"
                        />
                        <div className="space-y-1 flex-1">
                          <div className="bg-gray-100 dark:bg-zinc-800 p-3 rounded-2xl space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-900 dark:text-white">{cmt.userName}</span>
                              {cmt.verified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#1877f2] fill-[#1877f2] text-white shrink-0" />
                              )}
                              <span className="text-xs text-gray-400 font-medium ml-2">{cmt.timestamp}</span>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 font-normal leading-relaxed">
                              {cmt.text}
                            </p>
                          </div>

                          {/* Comment Actions */}
                          <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 pt-0.5">
                            <button 
                              onClick={() => alert(`Replying to ${cmt.userName}...`)}
                              className="hover:underline cursor-pointer"
                            >
                              Reply
                            </button>
                            <button 
                              onClick={() => {
                                setDetailCommentsMap({
                                  ...detailCommentsMap,
                                  [selectedVideo.id]: commentsForSelected.map(c => 
                                    c.id === cmt.id ? { ...c, likes: c.hasLiked ? c.likes - 1 : c.likes + 1, hasLiked: !c.hasLiked } : c
                                  )
                                });
                              }}
                              className="flex items-center gap-1 hover:text-blue-500 cursor-pointer"
                            >
                              <ThumbsUp className={`w-3.5 h-3.5 ${cmt.hasLiked ? "text-[#1877f2] fill-[#1877f2]" : ""}`} />
                              <span>{cmt.likes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input Box for new comment */}
                  <div className="pt-2 flex items-center gap-2.5">
                    <img 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2" 
                      alt="Me" 
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 bg-[#f0f2f5] dark:bg-zinc-800 rounded-full flex items-center px-3 py-1.5 gap-2">
                      <input 
                        type="text"
                        value={newDetailComment}
                        onChange={(e) => setNewDetailComment(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newDetailComment.trim()) {
                            const newCmtObj = {
                              id: `dc-${Date.now()}`,
                              userName: "Collins Dnego",
                              userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2",
                              verified: true,
                              text: newDetailComment.trim(),
                              timestamp: "Just now",
                              likes: 0
                            };
                            setDetailCommentsMap({
                              ...detailCommentsMap,
                              [selectedVideo.id]: [...commentsForSelected, newCmtObj]
                            });
                            setNewDetailComment("");
                          }
                        }}
                        placeholder="Add a comment..."
                        className="w-full bg-transparent text-xs text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none"
                      />
                      <button 
                        onClick={() => alert("Emoji selector")}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer shrink-0"
                      >
                        <Smile className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (!newDetailComment.trim()) return;
                          const newCmtObj = {
                            id: `dc-${Date.now()}`,
                            userName: "Collins Dnego",
                            userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2",
                            verified: true,
                            text: newDetailComment.trim(),
                            timestamp: "Just now",
                            likes: 0
                          };
                          setDetailCommentsMap({
                            ...detailCommentsMap,
                            [selectedVideo.id]: [...commentsForSelected, newCmtObj]
                          });
                          setNewDetailComment("");
                        }}
                        className="p-1.5 bg-[#1877f2] hover:bg-blue-600 text-white rounded-full transition-colors shrink-0 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        );
      })()}

      {/* ======================= SUB-TAB: REELS ======================= */}
      {watchSubTab === "reels" && (() => {
        const baseReelsList = propsReelsList || localReelsList;

        // Compute displayed reels based on selected tab: Trending, Following, or For You
        const displayedReels = (() => {
          if (reelTab === "following") {
            const followedClips = baseReelsList.filter(r => 
              followedCreators.some(c => r.creator.toLowerCase().includes(c.toLowerCase()))
            );
            return followedClips.length > 0 ? followedClips : baseReelsList;
          }
          
          if (reelTab === "foryou") {
            return baseReelsList.map((item, index) => {
              let reason = "Matched your preferences";
              if (index === 0) reason = `Based on search "${userSearchHistory[0] || "Premier League"}" & Most Watched`;
              else if (index === 1) reason = `Based on search "${userSearchHistory[1] || "Nairobi Derby"}" & Live Crowd Reactions`;
              else if (index === 2) reason = `Based on search "${userSearchHistory[2] || "Manchester United"}" & Predictions`;
              else if (index === 3) reason = `Based on most watched: "${userMostWatched[0] || "Tactical Analysis"}"`;
              else reason = `Recommended from search "${userSearchHistory[index % userSearchHistory.length] || "Football"}"`;

              return {
                ...item,
                forYouReason: reason
              };
            });
          }

          return baseReelsList;
        })();

        const currentReel = displayedReels[activeReelIndex] || displayedReels[0] || baseReelsList[0];
        const currentReelComments = reelCommentsMap[currentReel?.id] || reelCommentsMap["r-1"] || [];

        const handleWheelNav = (e: React.WheelEvent) => {
          if (e.deltaY > 40) {
            setReelDirection(1);
            setActiveReelIndex((prev) => (prev + 1) % displayedReels.length);
          } else if (e.deltaY < -40) {
            setReelDirection(-1);
            setActiveReelIndex((prev) => (prev - 1 + displayedReels.length) % displayedReels.length);
          }
        };

        return (
          <div className="space-y-5 font-sans">
            
            {/* Header Banner matching Create & Share Reels design */}
            <div className="bg-[#ebf5ff] dark:bg-blue-950/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-blue-100 dark:border-blue-900/40">
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-[#1877f2] flex items-center justify-center shrink-0 shadow-xs border border-blue-200 dark:border-blue-800">
                  <Trophy className="w-6 h-6 text-[#1877f2]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white leading-tight">
                    Create & Share Reels
                  </h3>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mt-0.5">
                    Post short clips, predictions, reactions and highlights.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateReel(!showCreateReel)}
                className="px-5 py-2.5 bg-[#1877f2] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-95 shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <span>{showCreateReel ? "✕ Close" : "Create Reel +"}</span>
              </button>
            </div>

            {/* Create Reel Editor Panel */}
            {showCreateReel && (
              <div className="max-w-md mx-auto border-2 border-dashed border-blue-300 dark:border-blue-800/60 rounded-3xl p-5 bg-blue-500/5 backdrop-blur-xs space-y-4 shadow-md text-left animate-in slide-in-from-top-3 duration-200">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">🎥</span>
                  <span className="text-xs font-black text-blue-800 dark:text-blue-300 uppercase font-mono">Create and Publish a New Reel</span>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Reel Title / Caption</label>
                    <input 
                      type="text" 
                      value={newReelTitle}
                      onChange={(e) => setNewReelTitle(e.target.value)}
                      placeholder="e.g. AFC Leopards vs Gor Mahia 100% correct score analysis! 🔥"
                      className="w-full bg-white dark:bg-[#1a1b1c] border border-gray-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Commentary / Strategy</label>
                    <textarea 
                      value={newReelSummary}
                      onChange={(e) => setNewReelSummary(e.target.value)}
                      placeholder="Explain the public feedback tips or your selected staking syndicate layouts..."
                      className="w-full bg-white dark:bg-[#1a1b1c] border border-gray-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[70px]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!newReelTitle.trim()) {
                        alert("Please provide a captioned title for your Reel!");
                        return;
                      }
                      const newReelObj: VideoItem = {
                        id: `r-user-${Date.now()}`,
                        title: newReelTitle,
                        creator: "Current Predictor",
                        creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
                        views: "1 View",
                        likes: 1,
                        liked: true,
                        commentsCount: 0,
                        tags: ["#FaceLookReels", "#CorrectScore", "#Prediction"],
                        pillTags: ["#Highlights", "#ManUtd", "#Prediction"],
                        duration: "00:30",
                        timeAgo: "Just now",
                        thumbnailGradient: "from-blue-600 to-indigo-800",
                        bgImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1000",
                        summary: newReelSummary || "User published a new reel!"
                      };
                      const setList = propsSetReelsList || setLocalReelsList;
                      setList([newReelObj, ...(propsReelsList || localReelsList)]);
                      setNewReelTitle("");
                      setNewReelSummary("");
                      setShowCreateReel(false);
                      alert("Your Reel was successfully published!");
                    }}
                    className="w-full py-2.5 bg-[#1877f2] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-transform active:scale-[0.99]"
                  >
                    Publish Reel 🚀
                  </button>
                </div>
              </div>
            )}

            {/* ================= REELS NAVIGATION SUB-TABS BAR ================= */}
            <div className="bg-white dark:bg-[#1c1d1e] border border-gray-200/80 dark:border-zinc-800 rounded-2xl p-3 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none">
                  {/* Trending Tab */}
                  <button
                    onClick={() => {
                      setReelTab("trending");
                      setActiveReelIndex(0);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                      reelTab === "trending"
                        ? "bg-[#1877f2] text-white shadow-md shadow-blue-500/20"
                        : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <Flame className={`w-4 h-4 ${reelTab === "trending" ? "text-amber-300 fill-amber-300" : "text-amber-500"}`} />
                    <span>Trending Reels</span>
                  </button>

                  {/* Following Tab */}
                  <button
                    onClick={() => {
                      setReelTab("following");
                      setActiveReelIndex(0);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                      reelTab === "following"
                        ? "bg-[#1877f2] text-white shadow-md shadow-blue-500/20"
                        : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Following</span>
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-black ${
                      reelTab === "following" ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300"
                    }`}>
                      {followedCreators.length}
                    </span>
                  </button>

                  {/* For You Tab */}
                  <button
                    onClick={() => {
                      setReelTab("foryou");
                      setActiveReelIndex(0);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                      reelTab === "foryou"
                        ? "bg-[#1877f2] text-white shadow-md shadow-blue-500/20"
                        : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <Sparkles className={`w-4 h-4 ${reelTab === "foryou" ? "text-amber-300 fill-amber-300 animate-pulse" : "text-purple-500"}`} />
                    <span>For You</span>
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-black ${
                      reelTab === "foryou" ? "bg-white/20 text-white" : "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300"
                    }`}>
                      Tailored
                    </span>
                  </button>
                </div>

                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 hidden lg:flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>
                    {reelTab === "trending" && "Top viral clips across sports & predictions"}
                    {reelTab === "following" && `Clips from ${followedCreators.length} creators you follow`}
                    {reelTab === "foryou" && "Personalized by searches & most watched"}
                  </span>
                </div>
              </div>




            </div>

            {/* Main Interactive Reels Player + Comments Panel Layout */}
            <div 
              onWheel={handleWheelNav}
              className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start select-none"
            >
              {/* Left Column: Video Player Container */}
              <div className={`transition-all duration-300 ${showComments ? "lg:col-span-7" : "lg:col-span-8 lg:col-start-3"}`}>
                
                <div className="relative w-full aspect-[4/4] sm:aspect-[4/4] max-h-[520px] rounded-2xl overflow-hidden bg-black shadow-xl border border-gray-200/20 dark:border-zinc-800 group">
                  
                  {/* Background Reel Video / Image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/50">
                    <img 
                      src={currentReel.bgImage || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1000"} 
                      alt="reel video frame"
                      className="w-full h-full object-cover opacity-90"
                    />
                  </div>

                  {/* Top-left capsule badge tailored to selected Reel Tab */}
                  <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 max-w-[85%]">
                    <div className="bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/15 shadow-md">
                      {reelTab === "trending" && (
                        <>
                          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>Trending Reel</span>
                          <span className="text-white/40">|</span>
                          <span>{currentReel.views} views</span>
                        </>
                      )}
                      {reelTab === "following" && (
                        <>
                          <Users className="w-3.5 h-3.5 text-blue-400" />
                          <span>Following @{currentReel.creator}</span>
                          <span className="text-white/40">|</span>
                          <span className="text-emerald-400 font-extrabold text-[10px] uppercase">Creator Clip</span>
                        </>
                      )}
                      {reelTab === "foryou" && (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-spin" />
                          <span className="text-amber-200 font-bold truncate max-w-[200px] sm:max-w-xs">
                            {(currentReel as any).forYouReason || `Based on search "${userSearchHistory[0]}"`}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Floating Overlay Action Buttons */}
                  <div className="absolute right-4 bottom-16 z-20 flex flex-col items-center gap-3">
                    {/* Like Button */}
                    <button 
                      onClick={() => handleLikeReel(currentReel.id)}
                      className="flex flex-col items-center group/btn cursor-pointer"
                    >
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-md ${
                        currentReel.liked ? "bg-red-500 text-white" : "bg-black/40 backdrop-blur-md text-white hover:bg-black/60"
                      }`}>
                        <Heart className={`w-5.5 h-5.5 ${currentReel.liked ? "fill-current" : ""}`} />
                      </div>
                      <span className="text-xs font-bold text-white mt-1 drop-shadow-md">
                        {currentReel.likes > 999 ? `${(currentReel.likes / 1000).toFixed(1)}K` : currentReel.likes}
                      </span>
                    </button>

                    {/* Comment Button */}
                    <button 
                      onClick={() => setShowComments(!showComments)}
                      className="flex flex-col items-center group/btn cursor-pointer"
                    >
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-md ${
                        showComments ? "bg-[#1877f2] text-white" : "bg-black/40 backdrop-blur-md text-white hover:bg-black/60"
                      }`}>
                        <MessageCircle className="w-5.5 h-5.5 fill-current" />
                      </div>
                      <span className="text-xs font-bold text-white mt-1 drop-shadow-md">
                        {currentReelComments.length || currentReel.commentsCount}
                      </span>
                    </button>

                    {/* Share Button */}
                    <button 
                      onClick={() => alert(`Shared reel: "${currentReel.title}"`)}
                      className="flex flex-col items-center group/btn cursor-pointer"
                    >
                      <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all shadow-md">
                        <Share2 className="w-5.5 h-5.5" />
                      </div>
                      <span className="text-xs font-bold text-white mt-1 drop-shadow-md">
                        {currentReel.shares || 320}
                      </span>
                    </button>

                    {/* Bookmark Button */}
                    <button 
                      onClick={() => alert(`Saved reel to bookmarks: "${currentReel.title}"`)}
                      className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all shadow-md cursor-pointer"
                    >
                      <Bookmark className="w-5.5 h-5.5" />
                    </button>
                  </div>

                  {/* Bottom Left Creator & Caption Info Overlay */}
                  <div className="absolute left-4 bottom-14 right-20 z-20 text-left space-y-1.5">
                    <div className="flex items-center gap-2">
                      <img 
                        src={currentReel.creatorAvatar} 
                        alt="creator" 
                        className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm"
                      />
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white drop-shadow-md">{currentReel.creator}</span>
                        {currentReel.verified && (
                          <CheckCircle2 className="w-4 h-4 text-[#1877f2] fill-[#1877f2] text-white" />
                        )}
                        {reelTab === "following" && (
                          <span className="px-2 py-0.5 bg-blue-600/80 text-white rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-0.5">
                            <UserCheck className="w-3 h-3" /> Following
                          </span>
                        )}
                        <span className="text-xs text-white/80 font-medium ml-0.5">· {currentReel.timeAgo || "1h ago"}</span>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base font-bold text-white leading-snug drop-shadow-md">
                      {currentReel.title}
                    </p>

                    <div className="flex flex-wrap gap-1.5 text-xs font-medium text-white/90">
                      {currentReel.tags.map(t => (
                        <span key={t} className="hover:underline cursor-pointer">{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Playback Progress Bar & Controls */}
                  <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center gap-3 text-white text-xs font-semibold">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="hover:scale-110 transition-transform cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>

                    <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer">
                      <div className="h-full bg-[#1877f2] rounded-full w-[53%]" />
                    </div>

                    <span className="font-mono text-[11px] text-white/90">00:24 / 00:45</span>

                    <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">HD</span>

                    <button className="hover:scale-110 transition-transform cursor-pointer">
                      <Square className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Navigation Arrows overlay on hover */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30 hidden group-hover:flex flex-col gap-2">
                    <button 
                      onClick={() => {
                        setReelDirection(-1);
                        setActiveReelIndex((prev) => (prev - 1 + displayedReels.length) % displayedReels.length);
                      }}
                      className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all shadow-md cursor-pointer"
                      title="Previous Reel (Scroll Up)"
                    >
                      <ChevronUp className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => {
                        setReelDirection(1);
                        setActiveReelIndex((prev) => (prev + 1) % displayedReels.length);
                      }}
                      className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all shadow-md cursor-pointer"
                      title="Next Reel (Scroll Down)"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>

                </div>

                {/* Pill Tags underneath video player */}
                <div className="flex flex-wrap items-center justify-between gap-2 mt-3 select-none">
                  <div className="flex flex-wrap items-center gap-2">
                    {(currentReel.pillTags || ["#ManUtd", "#PremierLeague", "#LookUpto", "#Soccer", "#Highlights"]).map((tag) => (
                      <span 
                        key={tag}
                        onClick={() => {
                          const tagClean = tag.replace('#', '');
                          if (!userSearchHistory.includes(tagClean)) {
                            setUserSearchHistory(prev => [...prev, tagClean]);
                          }
                          setReelTab("foryou");
                        }}
                        className="px-3.5 py-1.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        title="Click to filter For You recommendations by this topic"
                      >
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>

                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    Reel {activeReelIndex + 1} of {displayedReels.length}
                  </div>
                </div>

              </div>

              {/* Right Column: Comment Section matching photo */}
              {showComments && (
                <div className="lg:col-span-5 w-full bg-white dark:bg-[#242526] rounded-2xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm flex flex-col justify-between h-[520px] text-left font-sans">
                  
                  {/* Comments Panel Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      Comments ({currentReelComments.length})
                    </h3>
                    <button 
                      onClick={() => setShowComments(false)}
                      className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Comments List */}
                  <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-zinc-700">
                    {currentReelComments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3 group">
                        <img 
                          src={comment.avatar} 
                          alt={comment.author} 
                          className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-gray-900 dark:text-white">{comment.author}</span>
                              {comment.verified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#1877f2] fill-[#1877f2] text-white" />
                              )}
                              <span className="text-[11px] text-gray-400">{comment.time}</span>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-xs text-gray-800 dark:text-gray-200 mt-1 leading-relaxed">
                            {comment.text}
                          </p>

                          <div className="flex items-center gap-3 mt-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                            <button 
                              onClick={() => handleLikeComment(comment.id)}
                              className="flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>{comment.likes}</span>
                            </button>
                            <button 
                              onClick={() => setNewCommentInput(`@${comment.author} `)}
                              className="hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment Input Form */}
                  <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center gap-2">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
                      alt="user avatar" 
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <form 
                      onSubmit={handleAddComment}
                      className="flex-1 flex items-center bg-gray-100 dark:bg-zinc-800/80 rounded-full px-3 py-1.5 border border-transparent focus-within:border-blue-500 transition-colors"
                    >
                      <input 
                        type="text" 
                        value={newCommentInput}
                        onChange={(e) => setNewCommentInput(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-transparent text-xs text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={() => setNewCommentInput(prev => prev + " 🔥")}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                      >
                        <Smile className="w-4 h-4" />
                      </button>
                    </form>
                    <button 
                      onClick={handleAddComment}
                      className="w-8 h-8 rounded-full bg-[#1877f2] hover:bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-90 cursor-pointer"
                    >
                      <Send className="w-4 h-4 fill-white translate-x-0.5" />
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>
        );
      })()}

      {/* ======================= SUB-TAB: SUCCESS FACTORY ======================= */}
      {watchSubTab === "success_factory" && (
        <div className="space-y-6 animate-in fade-in duration-200 w-full font-sans text-left">
          
          {/* Top Banner Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
                <Trophy className="w-5 h-5 text-[#1877f2]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                  Success Stories & Partnerships
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Real people, real wins. Discover how the FaceLook Bet community is winning together.
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setShowPartnershipModal(true)}
                className="px-5 py-2.5 bg-[#1877f2] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Share Your Story</span>
              </button>
            </div>
          </div>

          {/* Main 2-Column Section: Featured Spotlight Left + Sidebars Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT MAIN: Featured Success Story Hero Card */}
            <div className="lg:col-span-8 bg-white dark:bg-[#242526] rounded-3xl border border-gray-200/80 dark:border-zinc-800 p-5 md:p-6 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Left Photo/Video Spotlight Box */}
                <div className="md:col-span-5 relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-square bg-gradient-to-br from-blue-600 to-indigo-800 shadow-md group">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
                    alt="Featured Ambassador"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-black text-gray-900 dark:text-white flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>Top Predictor</span>
                  </div>
                </div>

                {/* Right Quote & Metrics Details */}
                <div className="md:col-span-7 space-y-4 text-left">
                  <div className="text-3xl text-blue-500 font-serif leading-none">“</div>
                  <p className="text-sm md:text-base font-bold text-gray-800 dark:text-gray-100 leading-relaxed">
                    FaceLook Bet changed my game! I turned my predictions into a full-time income. The community, tools and partners made it possible.
                  </p>
                  
                  <div>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                      <span>Collins Dnego</span>
                      <CheckCircle2 className="w-4 h-4 text-[#1877f2] fill-[#1877f2] text-white" />
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">Verified Ambassador</p>
                  </div>

                  {/* 3 Metric Pills */}
                  <div className="pt-2 grid grid-cols-3 gap-2 border-t border-gray-100 dark:border-zinc-800">
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold block">Total Winnings</span>
                      <span className="text-xs md:text-sm font-black text-emerald-600 dark:text-emerald-400">KES 532,000</span>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/30 p-2 rounded-xl border border-blue-100 dark:border-blue-900/50">
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold block">Success Rate</span>
                      <span className="text-xs md:text-sm font-black text-blue-600 dark:text-blue-400">78%</span>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-950/30 p-2 rounded-xl border border-purple-100 dark:border-purple-900/50">
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold block">Challenges Won</span>
                      <span className="text-xs md:text-sm font-black text-purple-600 dark:text-purple-400">142</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Slider Dots + Nav Arrows Footer */}
              <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-1.5 rounded-full bg-[#1877f2]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-zinc-700"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-zinc-700"></span>
                </div>

                <div className="flex items-center gap-2">
                  <button className="w-7 h-7 rounded-full border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-7 h-7 rounded-full border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBARS COLUMN */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* 1. Our Partners Grid */}
              <div className="bg-white dark:bg-[#242526] rounded-2xl border border-gray-200/80 dark:border-zinc-800 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">
                    Our Partners
                  </h3>
                  <button 
                    onClick={() => setShowPartnershipModal(true)}
                    className="text-xs font-bold text-[#1877f2] hover:underline cursor-pointer"
                  >
                    See all
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2.5 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-150 dark:border-zinc-700 flex items-center justify-center font-black text-sm text-emerald-600">
                    betPawa
                  </div>
                  <div className="p-2.5 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-150 dark:border-zinc-700 flex items-center justify-center font-black text-sm text-blue-800 dark:text-blue-400">
                    SportPesa
                  </div>
                  <div className="p-2.5 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-150 dark:border-zinc-700 flex items-center justify-center font-black text-sm text-amber-500">
                    Radiant
                  </div>
                  <div className="p-2.5 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-150 dark:border-zinc-700 flex items-center justify-center font-black text-sm text-blue-600">
                    1XBET
                  </div>
                </div>
              </div>

              {/* 2. Partner With FaceLook Bet Card */}
              <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black text-gray-900 dark:text-white leading-snug">
                    Partner With FaceLook Bet
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">
                    Grow your brand with the largest sports prediction community.
                  </p>
                  <button 
                    onClick={() => setShowPartnershipModal(true)}
                    className="mt-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Become a Partner
                  </button>
                </div>
              </div>

              {/* 3. What You Get Card */}
              <div className="bg-white dark:bg-[#242526] rounded-2xl border border-gray-200/80 dark:border-zinc-800 p-4 shadow-sm space-y-3">
                <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">
                  What You Get
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">Global Exposure</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Reach thousands of sports fans</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">Credibility Badge</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Get verified & build trust</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">Partner Rewards</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Earn more with our packages</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">Community Growth</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Access to exclusive communities</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* LOWER SECTION: More Success Stories Grid */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-gray-900 dark:text-white tracking-tight">
                More Success Stories
              </h3>
              <button 
                onClick={() => setShowPartnershipModal(true)}
                className="text-xs font-bold text-[#1877f2] hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Story 1 */}
              <div className="bg-white dark:bg-[#242526] rounded-2xl border border-gray-200/80 dark:border-zinc-800 overflow-hidden shadow-xs space-y-2 group">
                <div className="relative aspect-[4/3] bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
                    alt="Metrine Karandini"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-[#1877f2] text-white flex items-center justify-center shadow-md">
                    <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <h4 className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1">
                    <span>Metrine Karandini</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1877f2] fill-[#1877f2] text-white shrink-0" />
                  </h4>
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">KES 220,000</p>
                  <p className="text-[10px] text-gray-400 font-medium">Won from EPL predictions</p>
                </div>
              </div>

              {/* Story 2 */}
              <div className="bg-white dark:bg-[#242526] rounded-2xl border border-gray-200/80 dark:border-zinc-800 overflow-hidden shadow-xs space-y-2 group">
                <div className="relative aspect-[4/3] bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
                    alt="Zephaniah Mwangi"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-[#1877f2] text-white flex items-center justify-center shadow-md">
                    <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <h4 className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1">
                    <span>Zephaniah Mwangi</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1877f2] fill-[#1877f2] text-white shrink-0" />
                  </h4>
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">KES 185,000</p>
                  <p className="text-[10px] text-gray-400 font-medium">Built a streak of 12 wins</p>
                </div>
              </div>

              {/* Story 3 */}
              <div className="bg-white dark:bg-[#242526] rounded-2xl border border-gray-200/80 dark:border-zinc-800 overflow-hidden shadow-xs space-y-2 group">
                <div className="relative aspect-[4/3] bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"
                    alt="Hon Amini O. Junior"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-[#1877f2] text-white flex items-center justify-center shadow-md">
                    <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <h4 className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1">
                    <span>Hon Amini O. Junior</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1877f2] fill-[#1877f2] text-white shrink-0" />
                  </h4>
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">KES 310,000</p>
                  <p className="text-[10px] text-gray-400 font-medium">Soccer + Tujengane Pools</p>
                </div>
              </div>

              {/* Story 4 */}
              <div className="bg-white dark:bg-[#242526] rounded-2xl border border-gray-200/80 dark:border-zinc-800 overflow-hidden shadow-xs space-y-2 group">
                <div className="relative aspect-[4/3] bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400"
                    alt="Lynne Bet"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-[#1877f2] text-white flex items-center justify-center shadow-md">
                    <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <h4 className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1">
                    <span>Lynne Bet</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1877f2] fill-[#1877f2] text-white shrink-0" />
                  </h4>
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">KES 150,000</p>
                  <p className="text-[10px] text-gray-400 font-medium">From small stakes to big wins</p>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Callout Banner */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold text-lg">
                ★
              </div>
              <div>
                <h4 className="text-sm font-black text-gray-900 dark:text-white">
                  You can be the next success story!
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Share your journey, inspire others and earn rewards.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPartnershipModal(true)}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
            >
              Share Your Story
            </button>
          </div>

        </div>
      )}

      {/* ======================= SUB-TAB: KENYAN SHOW ======================= */}
      {watchSubTab === "kenyan_show" && (
        <div className="animate-in fade-in duration-300 w-full font-sans text-left space-y-4 py-1">
          
          {/* Main Dark Container matching screenshot */}
          <div className="bg-[#021f11] border border-[#094223] rounded-3xl p-3 md:p-5 text-white space-y-4 shadow-2xl">
            
            {/* 1. Cover Photo Banner with AI Generated Stadium & Kenyan Coat of Arms */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-[#0d4f29] bg-gradient-to-r from-[#011a0d] via-[#022e17] to-[#011a0d] p-5 md:p-6 shadow-xl">
              {/* Background Image generated with Gemini AI */}
              <img 
                src="/src/assets/images/kenyan_show_banner_1784711843648.jpg" 
                alt="Kenyan Show Cover" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#01190d]/95 via-[#022614]/75 to-[#01190d]/95"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* AI Generated Kenyan Coat of Arms Shield Emblem */}
                  <KenyanCoatOfArmsShield />
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white font-sans uppercase">
                        KENYAN SHOW
                      </h1>
                      <span className="px-2.5 py-0.5 bg-red-600 text-white font-black text-[10px] rounded-md tracking-wider animate-pulse uppercase shadow-xs">
                        LIVE
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-200 font-medium mt-1">
                      Proudly showcasing Kenyan talent. Supporting university games.
                    </p>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2.5 self-end md:self-center">
                  <button className="px-4 py-2 bg-[#083e20]/80 hover:bg-[#0c522b] border border-emerald-500/30 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-sm">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Like <span className="text-emerald-300 font-black">1.2K</span></span>
                  </button>
                  <button className="px-4 py-2 bg-[#083e20]/80 hover:bg-[#0c522b] border border-emerald-500/30 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-sm">
                    <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Share</span>
                  </button>
                  <button className="p-2 bg-[#083e20]/80 hover:bg-[#0c522b] border border-emerald-500/30 text-white rounded-xl backdrop-blur-md transition-all cursor-pointer">
                    <MoreHorizontal className="w-4 h-4 text-gray-200" />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Main Match Broadcaster + Stats + Live Chat Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Column 1 & 2 (8 Cols): Scoreboard, Pitch, Match Stats & Latest Events */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Scoreboard & Pitch Container (White Card) */}
                <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-4 md:p-5 border border-gray-200/90 dark:border-zinc-800 text-gray-900 dark:text-white shadow-sm space-y-4">
                  
                  {/* Top Live Badge */}
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="px-2 py-0.5 bg-red-600 text-white font-black text-[10px] rounded-md animate-pulse">
                      LIVE NOW
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1 text-[11px] font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-red-500" /> Machakos Stadium, Kenya
                    </span>
                  </div>

                  {/* Teams Scoreboard Row */}
                  <div className="flex items-center justify-between gap-2 px-2 py-1">
                    {/* Home Team */}
                    <div className="flex flex-col items-center text-center flex-1">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-600 text-white font-black text-xs md:text-sm flex items-center justify-center border-4 border-blue-200 shadow-md mb-1.5">
                        JKUAT
                      </div>
                      <span className="text-sm font-black text-gray-900 dark:text-white">JKUAT FC</span>
                      <span className="text-[10px] text-gray-400 font-medium">Home Team</span>
                    </div>

                    {/* Score Center Box */}
                    <div className="flex flex-col items-center justify-center px-4">
                      <div className="bg-[#052c17] text-white px-6 py-2 rounded-2xl border border-emerald-500/30 flex items-center gap-3 shadow-inner">
                        <span className="text-2xl md:text-3xl font-black">1</span>
                        <span className="text-xl font-bold opacity-60">:</span>
                        <span className="text-2xl md:text-3xl font-black">1</span>
                      </div>
                      <span className="text-xs font-black text-emerald-500 font-mono mt-1.5 tracking-wider">
                        63:24
                      </span>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center text-center flex-1">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#800020] text-white font-black text-xs md:text-sm flex items-center justify-center border-4 border-red-200 shadow-md mb-1.5">
                        KCA
                      </div>
                      <span className="text-sm font-black text-gray-900 dark:text-white">KCA University</span>
                      <span className="text-[10px] text-gray-400 font-medium">Away Team</span>
                    </div>
                  </div>

                  {/* Sub-Tabs under Scoreboard */}
                  <div className="flex items-center gap-6 border-b border-gray-150 dark:border-zinc-800 text-xs font-bold pt-1">
                    <button 
                      onClick={() => setPitchSubTab("preview")}
                      className={`pb-2 transition-colors cursor-pointer ${
                        pitchSubTab === "preview" 
                          ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 font-black" 
                          : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      }`}
                    >
                      LIVE PREVIEW
                    </button>
                    <button 
                      onClick={() => setPitchSubTab("stats")}
                      className={`pb-2 transition-colors cursor-pointer ${
                        pitchSubTab === "stats" 
                          ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 font-black" 
                          : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      }`}
                    >
                      STATS
                    </button>
                    <button 
                      onClick={() => setPitchSubTab("lineups")}
                      className={`pb-2 transition-colors cursor-pointer ${
                        pitchSubTab === "lineups" 
                          ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 font-black" 
                          : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      }`}
                    >
                      LINEUPS
                    </button>
                    <button 
                      onClick={() => setPitchSubTab("h2h")}
                      className={`pb-2 transition-colors cursor-pointer ${
                        pitchSubTab === "h2h" 
                          ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 font-black" 
                          : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      }`}
                    >
                      H2H
                    </button>
                  </div>

                  {/* Soccer Pitch & Match Stats Inner Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
                    
                    {/* Soccer Field View (7 Cols) */}
                    <div className="md:col-span-7 relative h-64 bg-gradient-to-b from-emerald-800 via-emerald-900 to-emerald-950 rounded-2xl border border-emerald-700/60 overflow-hidden shadow-inner flex flex-col justify-between p-3">
                      {/* Pitch Field Markings */}
                      <div className="absolute inset-2 border border-white/25 rounded-lg pointer-events-none flex items-center justify-center">
                        <div className="w-20 h-20 border border-white/25 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                        </div>
                        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/25" />
                        <div className="absolute left-0 top-1/4 bottom-1/4 w-10 border border-l-0 border-white/25" />
                        <div className="absolute right-0 top-1/4 bottom-1/4 w-10 border border-r-0 border-white/25" />
                      </div>

                      {/* Player tactical dots on pitch */}
                      <div className="absolute top-1/3 left-1/3 w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white shadow-md z-10">
                        9
                      </div>
                      <div className="absolute bottom-1/3 left-1/2 w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white shadow-md z-10">
                        10
                      </div>
                      <div className="absolute top-1/4 right-1/3 w-6 h-6 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white shadow-md z-10">
                        9
                      </div>
                      <div className="absolute bottom-1/4 right-1/4 w-6 h-6 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white shadow-md z-10">
                        7
                      </div>

                      {/* Dangerous Attack Callout Box */}
                      <div className="relative z-10 self-center my-auto bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-center shadow-lg">
                        <span className="text-[9px] font-black tracking-widest text-gray-300 uppercase block">
                          DANGEROUS ATTACK
                        </span>
                        <span className="text-xs font-black text-white uppercase">
                          JKUAT FC
                        </span>
                      </div>

                      {/* Bottom Pitch Controls Bar */}
                      <div className="relative z-10 flex items-center justify-between text-white text-xs">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-white/20 rounded cursor-pointer">
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          </button>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-red-400">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> LIVE
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-white/20 rounded cursor-pointer">
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1 hover:bg-white/20 rounded cursor-pointer">
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Stats & Latest Events Column (5 Cols) */}
                    <div className="md:col-span-5 space-y-3 text-xs">
                      
                      {/* MATCH STATS */}
                      <div className="space-y-2">
                        <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">
                          MATCH STATS
                        </h4>

                        <div className="space-y-1.5 font-semibold text-gray-800 dark:text-gray-200">
                          <div>
                            <div className="flex justify-between text-[11px] mb-0.5">
                              <span className="font-black text-blue-600 dark:text-blue-400">56%</span>
                              <span className="text-gray-500 dark:text-gray-400 text-[10px] font-medium">Possession</span>
                              <span className="font-black text-red-500">44%</span>
                            </div>
                            <div className="flex h-1.5 w-full bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <div className="w-[56%] bg-blue-600"></div>
                              <div className="w-[44%] bg-red-600"></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] mb-0.5">
                              <span className="font-black text-blue-600 dark:text-blue-400">8</span>
                              <span className="text-gray-500 dark:text-gray-400 text-[10px] font-medium">Shots</span>
                              <span className="font-black text-red-500">6</span>
                            </div>
                            <div className="flex h-1.5 w-full bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <div className="w-[57%] bg-blue-600"></div>
                              <div className="w-[43%] bg-red-600"></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] mb-0.5">
                              <span className="font-black text-blue-600 dark:text-blue-400">4</span>
                              <span className="text-gray-500 dark:text-gray-400 text-[10px] font-medium">Shots on Target</span>
                              <span className="font-black text-red-500">2</span>
                            </div>
                            <div className="flex h-1.5 w-full bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <div className="w-[66%] bg-blue-600"></div>
                              <div className="w-[34%] bg-red-600"></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] mb-0.5">
                              <span className="font-black text-blue-600 dark:text-blue-400">3</span>
                              <span className="text-gray-500 dark:text-gray-400 text-[10px] font-medium">Corners</span>
                              <span className="font-black text-red-500">1</span>
                            </div>
                            <div className="flex h-1.5 w-full bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <div className="w-[75%] bg-blue-600"></div>
                              <div className="w-[25%] bg-red-600"></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] mb-0.5">
                              <span className="font-black text-blue-600 dark:text-blue-400">11</span>
                              <span className="text-gray-500 dark:text-gray-400 text-[10px] font-medium">Fouls</span>
                              <span className="font-black text-red-500">9</span>
                            </div>
                            <div className="flex h-1.5 w-full bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <div className="w-[55%] bg-blue-600"></div>
                              <div className="w-[45%] bg-red-600"></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] mb-0.5">
                              <span className="font-black text-blue-600 dark:text-blue-400">1</span>
                              <span className="text-gray-500 dark:text-gray-400 text-[10px] font-medium">Yellow Cards</span>
                              <span className="font-black text-red-500">1</span>
                            </div>
                            <div className="flex h-1.5 w-full bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <div className="w-[50%] bg-blue-600"></div>
                              <div className="w-[50%] bg-red-600"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* LATEST EVENTS */}
                      <div className="space-y-1.5 pt-2 border-t border-gray-150 dark:border-zinc-800">
                        <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">
                          LATEST EVENTS
                        </h4>

                        <div className="space-y-1 text-[11px] text-gray-700 dark:text-gray-300">
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-gray-900 dark:text-white">63'</span>
                            <span>Dangerous attack by JKUAT FC</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-gray-900 dark:text-white">60'</span>
                            <span>Yellow card – KCA University</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                            <span>58'</span>
                            <span>⚽ Goal! KCA University (1 - 1)</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                            <span>45'</span>
                            <span>⚽ Goal! JKUAT FC (1 - 0)</span>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* Column 3 (4 Cols): LIVE CHAT */}
              <div className="lg:col-span-4 bg-white dark:bg-[#1a1b1e] rounded-2xl p-4 border border-gray-200/90 dark:border-zinc-800 text-gray-900 dark:text-white shadow-sm flex flex-col justify-between h-full min-h-[460px]">
                
                <div>
                  {/* Live Chat Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-150 dark:border-zinc-800">
                    <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">
                      LIVE CHAT
                    </h3>
                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 1.4K online
                    </span>
                  </div>

                  {/* Chat Messages */}
                  <div className="py-3 space-y-3.5 text-xs overflow-y-auto max-h-[380px] scrollbar-thin">
                    {kenyanChatMessages.map((msg) => (
                      <div key={msg.id} className="flex items-start gap-2.5">
                        <img src={msg.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-gray-200 dark:border-zinc-700" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 overflow-hidden">
                              <span className="font-black text-gray-900 dark:text-white text-xs truncate">{msg.user}</span>
                              {msg.badge && (
                                <span className="text-[9px] font-black text-[#1877f2] bg-blue-50 dark:bg-blue-950/60 px-1 rounded flex items-center gap-0.5 shrink-0">
                                  <CheckCircle2 className="w-2.5 h-2.5 fill-[#1877f2] text-white" /> {msg.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono shrink-0">{msg.time}</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 font-medium text-[11px] mt-0.5 leading-snug">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat Input */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newKenyanMessage.trim()) return;
                    setKenyanChatMessages([
                      ...kenyanChatMessages,
                      {
                        id: `msg-${Date.now()}`,
                        user: "JayGloria",
                        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joy&backgroundColor=db2777",
                        time: "now",
                        text: newKenyanMessage.trim()
                      }
                    ]);
                    setNewKenyanMessage("");
                  }}
                  className="pt-2 border-t border-gray-150 dark:border-zinc-800 flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <input 
                      type="text"
                      value={newKenyanMessage}
                      onChange={(e) => setNewKenyanMessage(e.target.value)}
                      placeholder="Write a message..."
                      className="w-full text-xs px-3 py-2 pr-8 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button type="button" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <Smile className="w-4 h-4" />
                    </button>
                  </div>

                  <button 
                    type="submit"
                    disabled={!newKenyanMessage.trim()}
                    className="w-8 h-8 rounded-xl bg-[#059669] hover:bg-emerald-600 disabled:opacity-40 text-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 fill-current" />
                  </button>
                </form>

              </div>

            </div>

            {/* 3. PREFERRED BETTING ODDS Section */}
            <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-4 md:p-5 border border-gray-200/90 dark:border-zinc-800 text-gray-900 dark:text-white shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                  PREFERRED BETTING ODDS
                </h3>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  Odds provided by <span className="font-black">FaceLook Bet</span> <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-white" />
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1X2 Full Time */}
                <div className="p-3 bg-gray-50 dark:bg-zinc-900/60 rounded-xl border border-gray-150 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">1X2 Full Time</span>
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <button 
                      onClick={() => selectedMatch && onSelectOdd(selectedMatch, "JKUAT FC", 2.25)}
                      className="p-2 bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-emerald-500 transition-all cursor-pointer"
                    >
                      <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 block truncate">JKUAT FC</span>
                      <span className="text-sm font-black text-blue-600 dark:text-blue-400">2.25</span>
                    </button>

                    <button 
                      onClick={() => selectedMatch && onSelectOdd(selectedMatch, "Draw", 3.20)}
                      className="p-2 bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-emerald-500 transition-all cursor-pointer"
                    >
                      <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 block">Draw</span>
                      <span className="text-sm font-black text-red-500">3.20</span>
                    </button>

                    <button 
                      onClick={() => selectedMatch && onSelectOdd(selectedMatch, "KCA University", 2.85)}
                      className="p-2 bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-emerald-500 transition-all cursor-pointer"
                    >
                      <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 block truncate">KCA University</span>
                      <span className="text-sm font-black text-red-500">2.85</span>
                    </button>
                  </div>
                </div>

                {/* Double Chance */}
                <div className="p-3 bg-gray-50 dark:bg-zinc-900/60 rounded-xl border border-gray-150 dark:border-zinc-800 space-y-2">
                  <span className="text-xs font-black block">Double Chance</span>

                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <button 
                      onClick={() => selectedMatch && onSelectOdd(selectedMatch, "1X", 1.40)}
                      className="p-2 bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-emerald-500 transition-all cursor-pointer"
                    >
                      <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 block">1X</span>
                      <span className="text-sm font-black text-blue-600 dark:text-blue-400">1.40</span>
                    </button>

                    <button 
                      onClick={() => selectedMatch && onSelectOdd(selectedMatch, "X2", 1.55)}
                      className="p-2 bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-emerald-500 transition-all cursor-pointer"
                    >
                      <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 block">X2</span>
                      <span className="text-sm font-black text-blue-600 dark:text-blue-400">1.55</span>
                    </button>

                    <button 
                      onClick={() => selectedMatch && onSelectOdd(selectedMatch, "12", 1.32)}
                      className="p-2 bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-emerald-500 transition-all cursor-pointer"
                    >
                      <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 block">12</span>
                      <span className="text-sm font-black text-blue-600 dark:text-blue-400">1.32</span>
                    </button>
                  </div>
                </div>

                {/* Over / Under 2.5 */}
                <div className="p-3 bg-gray-50 dark:bg-zinc-900/60 rounded-xl border border-gray-150 dark:border-zinc-800 space-y-2">
                  <span className="text-xs font-black block">Over / Under 2.5</span>

                  <div className="grid grid-cols-2 gap-1.5 text-center">
                    <button 
                      onClick={() => selectedMatch && onSelectOdd(selectedMatch, "Over 2.5", 1.75)}
                      className="p-2 bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-emerald-500 transition-all cursor-pointer"
                    >
                      <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 block">Over 2.5</span>
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">1.75</span>
                    </button>

                    <button 
                      onClick={() => selectedMatch && onSelectOdd(selectedMatch, "Under 2.5", 2.05)}
                      className="p-2 bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-emerald-500 transition-all cursor-pointer"
                    >
                      <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 block">Under 2.5</span>
                      <span className="text-sm font-black text-red-500">2.05</span>
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-gray-500 flex items-center gap-1 font-medium pt-1">
                <Info className="w-3 h-3 text-blue-500" /> Odds update in real-time. Bet responsibly.
              </p>
            </div>

            {/* 4. BET & CHALLENGE MODES Section */}
            <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-4 md:p-5 border border-gray-200/90 dark:border-zinc-800 text-gray-900 dark:text-white shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                BET & CHALLENGE MODES
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1: MIMI NA WEWE */}
                <div className="p-4 bg-gray-50/80 dark:bg-zinc-900/40 rounded-2xl border border-gray-150 dark:border-zinc-800 flex flex-col justify-between space-y-4 text-center">
                  <div className="space-y-1.5">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-blue-100 dark:bg-blue-950/60 text-[#1877f2] flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-black text-blue-600 dark:text-blue-400">
                      MIMI NA WEWE
                    </h4>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">1v1 Challenge</span>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-tight">
                      Challenge a friend head-to-head. One prediction. One winner.
                    </p>
                  </div>

                  {/* Avatars comparison */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="text-center">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=You&backgroundColor=1877f2" alt="" className="w-8 h-8 rounded-full mx-auto border" />
                      <span className="text-[9px] font-bold text-gray-500 block mt-0.5">You</span>
                    </div>
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-[9px] flex items-center justify-center">VS</span>
                    <div className="text-center">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Opponent&backgroundColor=800020" alt="" className="w-8 h-8 rounded-full mx-auto border" />
                      <span className="text-[9px] font-bold text-gray-500 block mt-0.5">Opponent</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => onJoinChallenge?.("chal-mimi-na-wewe")}
                    className="w-full py-2.5 bg-[#1877f2] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    Start Challenge
                  </button>
                </div>

                {/* Card 2: TUJENGANE POOL */}
                <div className="p-4 bg-gray-50/80 dark:bg-zinc-900/40 rounded-2xl border border-gray-150 dark:border-zinc-800 flex flex-col justify-between space-y-4 text-center">
                  <div className="space-y-1.5">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      TUJENGANE POOL
                    </h4>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Group Challenge</span>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-tight">
                      Create or join a pool. Many vs Many. Highest prediction wins.
                    </p>
                  </div>

                  {/* Group Avatars comparison */}
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-center">
                      <div className="flex -space-x-1.5">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-[8px] font-bold flex items-center justify-center border border-white">P1</div>
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[8px] font-bold flex items-center justify-center border border-white">P2</div>
                        <div className="w-6 h-6 rounded-full bg-emerald-700 text-white text-[8px] font-bold flex items-center justify-center border border-white">P3</div>
                      </div>
                      <span className="text-[9px] font-bold text-gray-500 block mt-0.5">Your Pool</span>
                    </div>
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[8px] flex items-center justify-center">VS</span>
                    <div className="text-center">
                      <div className="flex -space-x-1.5">
                        <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-[8px] font-bold flex items-center justify-center border border-white">O1</div>
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[8px] font-bold flex items-center justify-center border border-white">O2</div>
                        <div className="w-6 h-6 rounded-full bg-blue-700 text-white text-[8px] font-bold flex items-center justify-center border border-white">O3</div>
                      </div>
                      <span className="text-[9px] font-bold text-gray-500 block mt-0.5">Opponent Pool</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => onJoinChallenge?.("chal-tujengane-pool")}
                    className="w-full py-2.5 bg-[#059669] hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    Create / Join Pool
                  </button>
                </div>

                {/* Card 3: THREE WAY */}
                <div className="p-4 bg-gray-50/80 dark:bg-zinc-900/40 rounded-2xl border border-gray-150 dark:border-zinc-800 flex flex-col justify-between space-y-4 text-center">
                  <div className="space-y-1.5">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-black text-purple-600 dark:text-purple-400">
                      THREE WAY
                    </h4>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pick Your Side</span>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-tight">
                      Three outcomes. You pick one. May the best prediction win!
                    </p>
                  </div>

                  {/* Options Row */}
                  <div className="flex items-center justify-center gap-2 text-[9px] font-extrabold text-gray-600 dark:text-gray-300">
                    <div className="p-1.5 bg-purple-50 dark:bg-purple-950/40 rounded-lg text-center">
                      <span>Home Win</span>
                    </div>
                    <span>→</span>
                    <div className="p-1.5 bg-purple-50 dark:bg-purple-950/40 rounded-lg text-center">
                      <span>Draw</span>
                    </div>
                    <span>→</span>
                    <div className="p-1.5 bg-purple-50 dark:bg-purple-950/40 rounded-lg text-center">
                      <span>Away Win</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => onJoinChallenge?.("chal-three-way")}
                    className="w-full py-2.5 bg-[#7c3aed] hover:bg-purple-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    Join Three Way
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 dark:text-gray-400 text-center font-medium flex items-center justify-center gap-1.5 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                All bets are secured with FaceLook Escrow. Fair. Transparent. Trusted.
              </p>
            </div>

            {/* 5. HOW IT WORKS + FACELOOK ESCROW ENGINE Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Dark Card: HOW IT WORKS */}
              <div className="lg:col-span-8 bg-[#07131e] text-white p-5 rounded-2xl border border-gray-800 shadow-md flex flex-col justify-between space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-300">
                  HOW IT WORKS
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="space-y-1">
                    <div className="w-10 h-10 mx-auto rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center text-sm font-black">
                      1
                    </div>
                    <span className="text-xs font-bold block">1. Pick</span>
                    <span className="text-[10px] text-gray-400 block leading-tight">Choose your prediction</span>
                  </div>

                  <div className="space-y-1">
                    <div className="w-10 h-10 mx-auto rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center text-sm font-black">
                      2
                    </div>
                    <span className="text-xs font-bold block">2. Bet</span>
                    <span className="text-[10px] text-gray-400 block leading-tight">Stake and confirm</span>
                  </div>

                  <div className="space-y-1">
                    <div className="w-10 h-10 mx-auto rounded-full bg-emerald-900/50 text-emerald-400 flex items-center justify-center text-sm font-black">
                      3
                    </div>
                    <span className="text-xs font-bold block">3. Lock</span>
                    <span className="text-[10px] text-gray-400 block leading-tight">Escrow secures the pot</span>
                  </div>

                  <div className="space-y-1">
                    <div className="w-10 h-10 mx-auto rounded-full bg-amber-900/50 text-amber-400 flex items-center justify-center text-sm font-black">
                      4
                    </div>
                    <span className="text-xs font-bold block">4. Win</span>
                    <span className="text-[10px] text-gray-400 block leading-tight">Winner takes all</span>
                  </div>
                </div>
              </div>

              {/* Right Green Card: FACELOOK ESCROW ENGINE */}
              <div className="lg:col-span-4 bg-[#03361e] text-white p-5 rounded-2xl border border-emerald-800/80 shadow-md flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300">
                    FACELOOK ESCROW ENGINE
                  </h4>
                  <p className="text-[11px] text-gray-200 leading-tight">
                    Your stake is protected. Funds are locked and released only when the match ends.
                  </p>
                  <button 
                    onClick={() => setShowPartnershipModal(true)}
                    className="px-3 py-1 bg-emerald-600/40 hover:bg-emerald-600 text-white text-[10px] font-bold rounded-lg border border-emerald-400/30 transition-all cursor-pointer"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* 6. Footer bar */}
            <div className="text-center py-2 text-xs font-bold text-gray-300 flex items-center justify-center gap-2 pt-2 border-t border-[#094223]">
              <span>🇰🇪</span>
              <span>Proudly Kenyan • Supporting Talent • Building Champions</span>
            </div>

          </div>

        </div>
      )}

      {/* ======================= PROFESSIONAL CREATOR STUDIO UPLOAD MODAL ======================= */}
      <UploadCreatorStudioModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onPublish={(newVid) => {
          setVideosList([newVid, ...videosList]);
          setVideoPage(0);
        }}
        initialMatch={activeMatch || selectedMatch || undefined}
        walletBalance={walletBalance}
      />

      {/* ======================= COMMUNITY PARTNERSHIP MODAL ======================= */}
      <AnimatePresence>
        {showPartnershipModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-[140] p-4 font-sans animate-in fade-in duration-150">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#242526] rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full border border-gray-150 dark:border-zinc-800 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-150 dark:border-zinc-800 flex items-center justify-between bg-amber-500/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-100 dark:bg-amber-950/50 rounded-xl text-amber-600 dark:text-amber-400">
                    <Award className="w-5 h-5 stroke-[2.5px]" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-black text-gray-950 dark:text-gray-100">
                      Join Community Partnership
                    </h3>
                    <p className="text-[10px] text-gray-550 dark:text-gray-400">
                      Unlock staker revenue shares and elite brand ambassador verification
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPartnershipModal(false)}
                  className="p-1.5 hover:bg-gray-150 dark:hover:bg-zinc-800 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form / Requirements Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 text-left">
                
                {/* Requirements Indicator Progress Checklist */}
                <div className="space-y-3 bg-gray-50 dark:bg-zinc-900/40 p-4 rounded-2xl border border-gray-150 dark:border-zinc-800">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-450 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Your Verification Checklist</span>
                  </h4>
                  
                  {/* Status checklist item 1 */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-gray-700 dark:text-gray-300">1. Followers Metric (1k+ Required)</span>
                      <span className="font-mono text-emerald-500 font-extrabold flex items-center gap-0.5 text-[10px]">
                        <Check className="w-3 h-3 stroke-[2.5px]" />
                        <span>1,209 / 1,000 (Met)</span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-250 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-full rounded-full" />
                    </div>
                  </div>

                  {/* Status checklist item 2 */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-gray-700 dark:text-gray-300">2. Staking Slips Shared (5+ Required)</span>
                      <span className="font-mono text-emerald-500 font-extrabold flex items-center gap-0.5 text-[10px]">
                        <Check className="w-3 h-3 stroke-[2.5px]" />
                        <span>5 / 5 Active</span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-250 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-full rounded-full" />
                    </div>
                  </div>

                  {/* Status checklist item 3 */}
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-150 dark:border-zinc-800">
                    <span className="font-bold text-gray-700 dark:text-gray-300">3. Integrity & Trust Rating</span>
                    <span className="text-emerald-500 font-black text-[10px] uppercase bg-emerald-500/10 px-2 py-0.5 rounded-sm">
                      Excellent
                    </span>
                  </div>
                </div>

                {!hasAppliedPartner ? (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleApplyPartnership();
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-450 dark:text-gray-400 block">
                        Ambassador Channel Name
                      </label>
                      <input
                        type="text"
                        required
                        defaultValue="Collins Dnego"
                        className="w-full text-xs font-semibold px-3 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl focus:ring-1 focus:ring-amber-500 focus:outline-hidden dark:text-white"
                        placeholder="e.g. Collins Dnego"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-450 dark:text-gray-400 block">
                        Preferred Prediction Niche
                      </label>
                      <select 
                        required
                        className="w-full text-xs font-semibold px-3 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl focus:ring-1 focus:ring-amber-500 focus:outline-hidden dark:text-white"
                      >
                        <option value="kpl">Kenyan Premier League (Mashemeji Specialty)</option>
                        <option value="football">Global Football Analytics & Parlays</option>
                        <option value="multisport">Multi-sport Accumulator Tips</option>
                        <option value="virtuals">Virtual Simulated Matches</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-450 dark:text-gray-400 block">
                        Social Handle / Reference Page Url
                      </label>
                      <input
                        type="text"
                        required
                        defaultValue="https://lookupto.com/p/collo_dnego_page"
                        className="w-full text-xs font-semibold px-3 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl focus:ring-1 focus:ring-amber-500 focus:outline-hidden dark:text-white"
                        placeholder="https://lookupto.com/p/username"
                      />
                    </div>

                    {/* Sync Checkbox */}
                    <label className="flex items-start gap-2.5 p-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.02] cursor-pointer hover:bg-amber-500/[0.05] transition-colors select-none">
                      <input 
                        type="checkbox"
                        required
                        defaultChecked
                        className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 focus:ring-offset-0"
                      />
                      <span className="text-[10.5px] text-gray-650 dark:text-gray-300 font-medium leading-relaxed">
                        I authorize automatic sync with my synchronized <strong>Baridi SANA Page</strong> and <strong>Collo Dnego Page</strong> streams for instant content uploads.
                      </span>
                    </label>

                    {/* Submission button */}
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 text-xs font-black rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer text-center flex items-center justify-center gap-2 mt-2"
                    >
                      <UserCheck className="w-4 h-4 text-neutral-950" />
                      <span>Submit Ambassador Partnership Application</span>
                    </button>
                  </form>
                ) : (
                  <div className="py-6 text-center space-y-4 animate-in zoom-in duration-200">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <ShieldCheck className="w-9 h-9 stroke-[2.5px]" />
                    </div>
                    <div className="space-y-1.5 max-w-sm mx-auto">
                      <h4 className="text-sm font-black text-gray-950 dark:text-gray-150">
                        Application Successfully Filed!
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        Your credentials have been successfully transmitted. Our LOOKUPTO compliance team is reviewing your <strong>1,209 followers</strong> stream connectivity.
                      </p>
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950 rounded-xl text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                        Status: Pending Administrative Review (1-3 days)
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPartnershipModal(false)}
                      className="py-2 px-6 border border-gray-250 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300 text-xs font-black rounded-xl transition-all cursor-pointer"
                    >
                      Return to testimonies
                    </button>
                  </div>
                )}

              </div>

              {/* Action Footer (Only shown when not applied) */}
              {!hasAppliedPartner && (
                <div className="p-5 border-t border-gray-150 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/40 flex justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowPartnershipModal(false)}
                    className="py-2 px-4 border border-gray-250 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300 text-xs font-black rounded-xl transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
