import React, { useState } from "react";
import { 
  Video, UploadCloud, Sparkles, Trophy, Users, ShieldCheck, 
  CheckCircle2, X, Check, ChevronRight, ChevronDown, ChevronUp, 
  Search, Smile, Send, Info, Lock, Globe, HelpCircle, Edit2, 
  Trash2, Play, ArrowRight, Bot, FileVideo, Layers, Flame, 
  RefreshCw, Eye, Share2, ThumbsUp, Plus, CheckCircle, Save, 
  Sliders, Calendar, MapPin, Film, ArrowLeft, Target, Image as ImageIcon, SendHorizontal
} from "lucide-react";
import { VideoItem, Match } from "../types";

interface UploadCreatorStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (newVideo: VideoItem) => void;
  initialMatch?: Match;
  walletBalance?: number;
}

// Sample fixtures for Game Hub browser & AI assistant
const SAMPLE_FIXTURES: Match[] = [
  {
    id: "m-101",
    homeTeam: "Manchester United",
    awayTeam: "Arsenal",
    league: "Premier League",
    status: "UPCOMING",
    time: "Today, 8:00 PM",
    score: "VS",
    odds: { "1": 2.85, X: 3.40, "2": 2.10 },
    trivia: "The marquee Premier League fixture with high stakes.",
    flActiveCount: 128
  },
  {
    id: "m-102",
    homeTeam: "Gor Mahia",
    awayTeam: "AFC Leopards",
    league: "Kenyan Premier League (Mashemeji Derby)",
    status: "LIVE",
    time: "68'",
    score: "1-1",
    odds: { "1": 2.25, X: 3.20, "2": 2.85 },
    trivia: "Kenya's classic Mashemeji rivalry.",
    flActiveCount: 210
  },
  {
    id: "m-103",
    homeTeam: "Chelsea",
    awayTeam: "Liverpool",
    league: "Premier League",
    status: "UPCOMING",
    time: "Tomorrow, 6:30 PM",
    score: "VS",
    odds: { "1": 2.60, X: 3.30, "2": 2.30 },
    trivia: "High tactical clash at Stamford Bridge.",
    flActiveCount: 95
  },
  {
    id: "m-104",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    league: "La Liga (El Clásico)",
    status: "UPCOMING",
    time: "Saturday, 9:00 PM",
    score: "VS",
    odds: { "1": 2.15, X: 3.50, "2": 2.90 },
    trivia: "The biggest rivalry in world football.",
    flActiveCount: 340
  }
];

export default function UploadCreatorStudioModal({
  isOpen,
  onClose,
  onPublish,
  initialMatch,
  walletBalance = 12500
}: UploadCreatorStudioModalProps) {
  if (!isOpen) return null;

  // Active step (1: Content, 2: Challenge, 3: Details, 4: Publish)
  const [activeStep, setActiveStep] = useState<number>(1);

  // 1. Choose Content Type
  const [contentType, setContentType] = useState<"reel" | "video">("reel");

  // 2. Attach Betting Challenge (Optional)
  const [attachChallenge, setAttachChallenge] = useState<boolean>(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(initialMatch || SAMPLE_FIXTURES[0]);
  const [selectedMarket, setSelectedMarket] = useState<string>("Match Winner (1X2)");
  const [selectedOddName, setSelectedOddName] = useState<string>("Arsenal Win");
  const [selectedOddsValue, setSelectedOddsValue] = useState<number>(2.10);
  const [challengeType, setChallengeType] = useState<string>("Mimi na Wewe (1v1)");
  const [stakeAmount, setStakeAmount] = useState<number>(500);

  // Game Hub & AI Modals
  const [showGameHubBrowser, setShowGameHubBrowser] = useState<boolean>(false);
  const [showAiAssistant, setShowAiAssistant] = useState<boolean>(false);
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ sender: "ai" | "user"; text: string; options?: string[] }>>([
    {
      sender: "ai",
      text: "Hi! I'm your FaceLook Bet AI Assistant. Need help picking a fixture or finding value odds for your video prediction?",
      options: ["Show today's top matches", "Suggest an high-value odd"]
    }
  ]);

  // Game Hub Browser selection state
  const [ghSelectedFixture, setGhSelectedFixture] = useState<Match>(SAMPLE_FIXTURES[0]);
  const [ghOddChoice, setGhOddChoice] = useState<{ name: string; val: number }>({ name: "Arsenal Win", val: 2.10 });

  // 3. Add Video & Details
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [uploadTitle, setUploadTitle] = useState<string>("");
  const [uploadDescription, setUploadDescription] = useState<string>("");
  const [uploadHashtags, setUploadHashtags] = useState<string>("e.g. #Arsenal #ManUtd #EPL");
  const [creatorHandle, setCreatorHandle] = useState<string>("@your_username");
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800"
  );

  // 4. Publish Settings
  const [videoVisibility, setVideoVisibility] = useState<"Public" | "Friends" | "Private">("Public");
  const [allowReactions, setAllowReactions] = useState<"Yes" | "No">("Yes");
  const [aiGeneratedLabel, setAiGeneratedLabel] = useState<"No" | "Yes">("No");
  const [allowOthersChallenge, setAllowOthersChallenge] = useState<boolean>(true);

  // Submitting / Preview states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  // Potential Return calculation
  const potentialReturn = (stakeAmount * selectedOddsValue).toFixed(2);

  // Drag and drop handlers
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
        setUploadFile(file);
        if (!uploadTitle) {
          setUploadTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
        }
      } else {
        alert("Please drop a valid video file.");
      }
    }
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      setUploadFile(file);
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
    }
  };

  // AI Assistant Choice
  const handleAiChoice = (option: string) => {
    if (option.includes("top matches") || option.includes("Suggest")) {
      setAiChatMessages(prev => [
        ...prev,
        { sender: "user", text: option },
        {
          sender: "ai",
          text: "Here are high-confidence predictions for upcoming matches:",
          options: SAMPLE_FIXTURES.map(f => `${f.homeTeam} vs ${f.awayTeam} (${f.league})`)
        }
      ]);
    } else if (SAMPLE_FIXTURES.some(f => option.includes(f.homeTeam))) {
      const foundMatch = SAMPLE_FIXTURES.find(f => option.includes(f.homeTeam))!;
      setSelectedMatch(foundMatch);
      setSelectedOddName(`${foundMatch.awayTeam} Win`);
      setSelectedOddsValue(foundMatch.odds["2"]);
      setAttachChallenge(true);

      if (!uploadTitle) {
        setUploadTitle(`${foundMatch.homeTeam} vs ${foundMatch.awayTeam} Analytical Breakdown & Challenge`);
      }

      setAiChatMessages(prev => [
        ...prev,
        { sender: "user", text: option },
        {
          sender: "ai",
          text: `Attached ${foundMatch.homeTeam} vs ${foundMatch.awayTeam} (${foundMatch.awayTeam} Win @ ${foundMatch.odds["2"]}) to your upload! Returning to Creator Studio...`
        }
      ]);

      setTimeout(() => setShowAiAssistant(false), 1200);
    } else {
      setShowAiAssistant(false);
    }
  };

  // Confirm Game Hub selection
  const handleConfirmGameHubSelection = () => {
    setSelectedMatch(ghSelectedFixture);
    setSelectedOddName(ghOddChoice.name);
    setSelectedOddsValue(ghOddChoice.val);
    setAttachChallenge(true);
    setShowGameHubBrowser(false);

    if (!uploadTitle) {
      setUploadTitle(`${ghSelectedFixture.homeTeam} vs ${ghSelectedFixture.awayTeam} Match Analysis & Betting Pick`);
    }
  };

  // Final Publish Handler
  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      alert("Please enter a video or reel title before publishing.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const tagsArray = uploadHashtags
        .split(/[,\s]+/)
        .map(t => t.trim())
        .filter(t => t.length > 0 && t !== "e.g.")
        .map(t => t.startsWith("#") ? t : `#${t}`);

      const newVid: VideoItem = {
        id: `upload-${Date.now()}`,
        title: uploadTitle,
        creator: creatorHandle.replace("@", "") || "Collins Bettor",
        creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2",
        views: "1 View",
        likes: 1,
        liked: true,
        commentsCount: 0,
        tags: tagsArray.length > 0 ? tagsArray : ["#prediction", "#FaceLookBet"],
        duration: contentType === "reel" ? "0:45" : "3:20",
        videoUrl: uploadFile ? URL.createObjectURL(uploadFile) : undefined,
        thumbnailGradient: contentType === "reel" ? "from-blue-600 via-indigo-600 to-purple-600" : "from-blue-600 to-indigo-900",
        bgImage: thumbnailPreview,
        summary: uploadDescription || (attachChallenge && selectedMatch 
          ? `Analysis for ${selectedMatch.homeTeam} vs ${selectedMatch.awayTeam}. Attached ${challengeType} betting challenge with ${selectedOddName} @ ${selectedOddsValue}.`
          : "Creator video breakdown and prediction tips."),
        privacy: videoVisibility.toLowerCase() as any,
        meantForChildren: false,
        locationRestriction: "None",
        challenge: (attachChallenge && selectedMatch) ? {
          id: `ch-${Date.now()}`,
          title: `${selectedMatch.homeTeam} vs ${selectedMatch.awayTeam} - ${selectedOddName}`,
          pool: Math.round(Number(potentialReturn)),
          joined: false
        } : undefined
      };

      onPublish(newVid);
      setIsSubmitting(false);
      onClose();
      alert(`Success! Your ${contentType.toUpperCase()} "${uploadTitle}" ${attachChallenge ? "with Escrow Challenge" : ""} has been published!`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[2200] bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 font-sans overflow-y-auto animate-in fade-in duration-200">
      
      {/* Main Container */}
      <div className="bg-[#f8fafc] dark:bg-[#121316] w-full max-w-6xl rounded-3xl shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col max-h-[94vh] overflow-hidden text-gray-900 dark:text-gray-100">
        
        {/* ================= TOP HEADER BAR ================= */}
        <div className="px-6 py-4 bg-white dark:bg-[#1a1b1e] border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
          
          {/* Logo & Sub-header */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-[#1877f2] font-sans">facelook</span>
              <span className="px-1.5 py-0.5 bg-[#1877f2] text-white font-black text-[10px] rounded uppercase tracking-wider">
                BET
              </span>
            </div>
            <span className="text-gray-300 dark:text-zinc-700">|</span>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Creator Studio
            </span>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowPreviewModal(true)}
              className="px-4 py-1.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-gray-500" />
              <span>Preview</span>
            </button>

            <button
              onClick={() => alert("Draft saved successfully!")}
              className="px-4 py-1.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-gray-500" />
              <span>Save Draft</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* ================= STEP PROGRESS INDICATOR ================= */}
        <div className="bg-white dark:bg-[#1a1b1e] px-8 py-3 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-center text-xs font-bold shrink-0">
          <div className="flex items-center gap-3 sm:gap-10 max-w-2xl w-full justify-between">
            
            {/* Step 1 */}
            <div 
              onClick={() => setActiveStep(1)}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                activeStep === 1 ? "text-[#1877f2] font-black" : "text-gray-400 dark:text-zinc-500"
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                activeStep >= 1 ? "bg-[#1877f2] text-white shadow-xs" : "bg-gray-200 dark:bg-zinc-800 text-gray-500"
              }`}>1</span>
              <span>Content</span>
            </div>

            <div className="h-0.5 flex-1 bg-gray-200 dark:bg-zinc-800 max-w-[60px]" />

            {/* Step 2 */}
            <div 
              onClick={() => setActiveStep(2)}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                activeStep === 2 ? "text-[#1877f2] font-black" : "text-gray-400 dark:text-zinc-500"
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                activeStep >= 2 ? "bg-[#1877f2] text-white shadow-xs" : "bg-gray-200 dark:bg-zinc-800 text-gray-500"
              }`}>2</span>
              <span>Challenge (Optional)</span>
            </div>

            <div className="h-0.5 flex-1 bg-gray-200 dark:bg-zinc-800 max-w-[60px]" />

            {/* Step 3 */}
            <div 
              onClick={() => setActiveStep(3)}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                activeStep === 3 ? "text-[#1877f2] font-black" : "text-gray-400 dark:text-zinc-500"
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                activeStep >= 3 ? "bg-[#1877f2] text-white shadow-xs" : "bg-gray-200 dark:bg-zinc-800 text-gray-500"
              }`}>3</span>
              <span>Details</span>
            </div>

            <div className="h-0.5 flex-1 bg-gray-200 dark:bg-zinc-800 max-w-[60px]" />

            {/* Step 4 */}
            <div 
              onClick={() => setActiveStep(4)}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                activeStep === 4 ? "text-[#1877f2] font-black" : "text-gray-400 dark:text-zinc-500"
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                activeStep === 4 ? "bg-[#1877f2] text-white shadow-xs" : "bg-gray-200 dark:bg-zinc-800 text-gray-500"
              }`}>4</span>
              <span>Publish</span>
            </div>

          </div>
        </div>

        {/* ================= MAIN CONTENT GRID ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT 8 COLS: FORM SECTIONS */}
          <div className="lg:col-span-8 space-y-6 text-left">
            
            {/* ================= CARD 1: CHOOSE CONTENT TYPE ================= */}
            <div className="bg-white dark:bg-[#1a1b1e] p-5 sm:p-6 rounded-2xl border border-gray-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">
                  1. Choose Content Type
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  What are you publishing today?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Upload Reel */}
                <div
                  onClick={() => setContentType("reel")}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 select-none ${
                    contentType === "reel"
                      ? "border-[#1877f2] bg-blue-50/40 dark:bg-blue-950/20 shadow-xs"
                      : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/40"
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#1877f2] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Film className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white">Upload Reel</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
                      Short-form vertical video<br />(up to 60s)
                    </p>
                  </div>
                </div>

                {/* Upload Video */}
                <div
                  onClick={() => setContentType("video")}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 select-none ${
                    contentType === "video"
                      ? "border-[#1877f2] bg-blue-50/40 dark:bg-blue-950/20 shadow-xs"
                      : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/40"
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 flex items-center justify-center shrink-0">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white">Upload Video</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
                      Standard landscape video<br />(up to 10 minutes)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= CARD 2: ATTACH BETTING CHALLENGE (OPTIONAL) ================= */}
            <div className="bg-white dark:bg-[#1a1b1e] p-5 sm:p-6 rounded-2xl border border-gray-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
              
              {/* Card Header + Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white">
                    2. Attach Betting Challenge (Optional)
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Add a betting challenge to your content.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Attach Challenge
                  </span>
                  <button
                    type="button"
                    onClick={() => setAttachChallenge(!attachChallenge)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                      attachChallenge ? "bg-[#1877f2] justify-end" : "bg-gray-300 dark:bg-zinc-700 justify-start"
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              </div>

              {/* Box Inside Card 2 */}
              {!attachChallenge ? (
                /* No Challenge Selected Banner */
                <div className="p-8 bg-gray-50/70 dark:bg-zinc-900/40 rounded-2xl border border-gray-200/60 dark:border-zinc-800/60 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 font-black text-xs">
                    <span className="text-lg">⚽</span>
                    <span>No challenge selected yet</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">
                    Browse games or ask AI to find the perfect market.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    {/* Browse Game Hub */}
                    <button
                      type="button"
                      onClick={() => setShowGameHubBrowser(true)}
                      className="px-5 py-2.5 bg-white dark:bg-zinc-800 border-2 border-[#1877f2] text-[#1877f2] dark:text-blue-400 text-xs font-black rounded-xl hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Target className="w-4 h-4 text-[#1877f2]" />
                      <span>Browse Game Hub</span>
                    </button>

                    {/* Ask AI Assistant */}
                    <button
                      type="button"
                      onClick={() => setShowAiAssistant(true)}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Bot className="w-4 h-4 text-amber-300" />
                      <span>Ask AI Assistant</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Challenge Attached Active Details */
                <div className="p-4 bg-blue-50/30 dark:bg-blue-950/20 rounded-2xl border border-blue-200 dark:border-blue-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#1877f2] uppercase tracking-wider">
                      Attached Challenge Fixture
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowGameHubBrowser(true)}
                      className="text-xs font-bold text-[#1877f2] hover:underline cursor-pointer"
                    >
                      Change Match
                    </button>
                  </div>

                  {selectedMatch && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
                        <span className="text-[10px] text-gray-400 font-bold block">Match</span>
                        <span className="font-black text-gray-900 dark:text-white truncate block">
                          {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
                        </span>
                      </div>

                      <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
                        <span className="text-[10px] text-gray-400 font-bold block">Pick & Odds</span>
                        <span className="font-black text-[#1877f2]">
                          {selectedOddName} @ {selectedOddsValue.toFixed(2)}
                        </span>
                      </div>

                      <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
                        <span className="text-[10px] text-gray-400 font-bold block">Challenge Stake</span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400">
                          KES {stakeAmount} (Return KES {potentialReturn})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* ================= CARD 3: ADD VIDEO & DETAILS ================= */}
            <div className="bg-white dark:bg-[#1a1b1e] p-5 sm:p-6 rounded-2xl border border-gray-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">
                  3. Add Video & Details
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Upload your video and tell your audience what it's about.
                </p>
              </div>

              {/* Grid: Dropzone Box on Left, Title & Description on Right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Left Upload Dropzone Box (4 cols) */}
                <div className="md:col-span-4">
                  {!uploadFile ? (
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById("visual-studio-file-picker")?.click()}
                      className={`h-full min-h-[170px] border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all select-none ${
                        isDragActive
                          ? "border-[#1877f2] bg-blue-50/50 dark:bg-blue-950/30"
                          : "border-gray-300 dark:border-zinc-700 hover:border-[#1877f2] bg-gray-50/40 dark:bg-zinc-900/30"
                      }`}
                    >
                      <input
                        type="file"
                        id="visual-studio-file-picker"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                      />
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950 text-[#1877f2] flex items-center justify-center mb-2">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-black text-gray-800 dark:text-gray-200">
                        Click to upload
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                        or drag and drop
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono mt-2">
                        MP4, MOV, WebM • Max 500MB
                      </p>
                    </div>
                  ) : (
                    <div className="h-full min-h-[170px] p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-200 dark:border-blue-900/40 flex flex-col justify-between text-left">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-[#1877f2] text-white rounded-xl flex items-center justify-center shrink-0">
                          <Video className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                            {uploadFile.name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono">
                            {(uploadFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setUploadFile(null)}
                        className="text-xs font-bold text-red-500 hover:underline cursor-pointer pt-2"
                      >
                        Remove file
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Inputs (8 cols) */}
                <div className="md:col-span-8 space-y-3">
                  
                  {/* Video Title */}
                  <div className="relative">
                    <label className="text-xs font-black text-gray-700 dark:text-gray-300 block mb-1">
                      Video Title
                    </label>
                    <input
                      type="text"
                      maxLength={100}
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="Create a catchy title.."
                      className="w-full text-xs font-medium px-3.5 py-2.5 bg-gray-50/70 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-[#1877f2]"
                    />
                    <span className="absolute right-3 bottom-2.5 text-[10px] text-gray-400 font-mono">
                      {uploadTitle.length}/100
                    </span>
                  </div>

                  {/* Description */}
                  <div className="relative">
                    <label className="text-xs font-black text-gray-700 dark:text-gray-300 block mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      maxLength={500}
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      placeholder="Share your analysis, stats, and insights..."
                      className="w-full text-xs font-medium px-3.5 py-2.5 bg-gray-50/70 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-[#1877f2] resize-none"
                    />
                    <span className="absolute right-3 bottom-2 text-[10px] text-gray-400 font-mono">
                      {uploadDescription.length}/500
                    </span>
                  </div>

                </div>

              </div>

              {/* Bottom Row: Tags, Creator Handle, Thumbnail */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="text-xs font-black text-gray-700 dark:text-gray-300 block mb-1">
                    Tags / Hashtags
                  </label>
                  <input
                    type="text"
                    value={uploadHashtags}
                    onChange={(e) => setUploadHashtags(e.target.value)}
                    placeholder="e.g. #Arsenal #ManUtd #EPL"
                    className="w-full text-xs font-medium px-3.5 py-2 bg-gray-50/70 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-[#1877f2]"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-gray-700 dark:text-gray-300 block mb-1">
                    Creator Handle
                  </label>
                  <input
                    type="text"
                    value={creatorHandle}
                    onChange={(e) => setCreatorHandle(e.target.value)}
                    placeholder="@your_username"
                    className="w-full text-xs font-medium px-3.5 py-2 bg-gray-50/70 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-[#1877f2]"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-gray-700 dark:text-gray-300 block mb-1">
                    Thumbnail
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("Custom thumbnail uploaded!")}
                    className="w-full text-xs font-bold px-3.5 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4 text-[#1877f2]" />
                    <span>Upload Thumbnail</span>
                  </button>
                </div>
              </div>

            </div>

            {/* ================= CARD 4: PUBLISH SETTINGS ================= */}
            <div className="bg-white dark:bg-[#1a1b1e] p-5 sm:p-6 rounded-2xl border border-gray-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">
                  4. Publish Settings
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Choose how and where to publish.
                </p>
              </div>

              {/* Row 1: Dropdown Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Visibility */}
                <div>
                  <label className="text-xs font-black text-gray-700 dark:text-gray-300 block mb-1">
                    Visibility
                  </label>
                  <div className="relative">
                    <select
                      value={videoVisibility}
                      onChange={(e) => setVideoVisibility(e.target.value as any)}
                      className="w-full text-xs font-bold pl-8 pr-3 py-2 bg-gray-50/70 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white appearance-none cursor-pointer"
                    >
                      <option value="Public">Public</option>
                      <option value="Friends">Friends Only</option>
                      <option value="Private">Private</option>
                    </select>
                    <Globe className="w-3.5 h-3.5 text-[#1877f2] absolute left-2.5 top-2.5 pointer-events-none" />
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* Allow Reactions */}
                <div>
                  <label className="text-xs font-black text-gray-700 dark:text-gray-300 block mb-1">
                    Allow Reactions
                  </label>
                  <div className="relative">
                    <select
                      value={allowReactions}
                      onChange={(e) => setAllowReactions(e.target.value as any)}
                      className="w-full text-xs font-bold pl-8 pr-3 py-2 bg-gray-50/70 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white appearance-none cursor-pointer"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <ThumbsUp className="w-3.5 h-3.5 text-[#1877f2] absolute left-2.5 top-2.5 pointer-events-none" />
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* AI Generated Label */}
                <div>
                  <label className="text-xs font-black text-gray-700 dark:text-gray-300 block mb-1">
                    AI Generated Label
                  </label>
                  <div className="relative">
                    <select
                      value={aiGeneratedLabel}
                      onChange={(e) => setAiGeneratedLabel(e.target.value as any)}
                      className="w-full text-xs font-bold pl-8 pr-3 py-2 bg-gray-50/70 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white appearance-none cursor-pointer"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                    <Sparkles className="w-3.5 h-3.5 text-[#1877f2] absolute left-2.5 top-2.5 pointer-events-none" />
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 2: Allow others to challenge toggle card */}
              <div className="p-4 bg-gray-50/70 dark:bg-zinc-900/40 rounded-2xl border border-gray-200/60 dark:border-zinc-800/60 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gray-200/80 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white">
                      Allow others to challenge / react to this video
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Let other users create challenges based on your prediction.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAllowOthersChallenge(!allowOthersChallenge)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center shrink-0 ${
                    allowOthersChallenge ? "bg-[#1877f2] justify-end" : "bg-gray-300 dark:bg-zinc-700 justify-start"
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                </button>
              </div>

            </div>

            {/* ================= BOTTOM ACTION BAR (LEFT SIDE) ================= */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => alert("Draft saved!")}
                  className="px-6 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 text-gray-700 dark:text-gray-200 font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={handlePublishSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-[#1877f2] hover:bg-blue-600 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-t-white border-blue-200 rounded-full animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <SendHorizontal className="w-4 h-4" />
                      <span>Review & Publish</span>
                    </>
                  )}
                </button>
              </div>

              {/* Centered Footer Disclaimer */}
              <div className="text-center pt-2">
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  <span>All challenges are secured with FaceLook Escrow. Fair. Transparent. Trusted.</span>
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT 4 COLS: STICKY SIDEBAR */}
          <div className="lg:col-span-4 space-y-4 text-left">
            
            {/* 1. CHALLENGE SUMMARY CARD */}
            <div className="bg-white dark:bg-[#1a1b1e] p-5 rounded-2xl border border-gray-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-150 dark:border-zinc-800">
                <h3 className="text-xs font-black uppercase text-gray-900 dark:text-white">
                  Challenge Summary
                </h3>
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-extrabold text-[10px] rounded-full">
                  Optional
                </span>
              </div>

              {!attachChallenge ? (
                /* No Challenge Attached */
                <div className="py-4 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#1877f2] flex items-center justify-center">
                    <Trophy className="w-6 h-6 stroke-[2px]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white">
                      No challenge attached
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 max-w-[200px]">
                      Your video will be published normally.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachChallenge(true)}
                    className="mt-1 px-4 py-2 bg-white dark:bg-zinc-800 border-2 border-blue-200 dark:border-blue-900/60 text-[#1877f2] hover:bg-blue-50/50 font-black text-xs rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    Attach Challenge
                  </button>
                </div>
              ) : (
                /* Challenge Details Attached */
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl border border-blue-200/60 dark:border-blue-900/40 space-y-2">
                    <div className="flex justify-between items-center text-gray-500">
                      <span>Match</span>
                      <span className="font-bold text-gray-900 dark:text-white truncate max-w-[150px]">
                        {selectedMatch?.homeTeam} vs {selectedMatch?.awayTeam}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-gray-500">
                      <span>Prediction</span>
                      <span className="font-black text-[#1877f2]">{selectedOddName}</span>
                    </div>

                    <div className="flex justify-between items-center text-gray-500">
                      <span>Odds</span>
                      <span className="font-black text-emerald-600">@{selectedOddsValue.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-gray-500">
                      <span>Stake / Return</span>
                      <span className="font-black text-gray-900 dark:text-white">
                        KES {stakeAmount} / KES {potentialReturn}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. HOW IT WORKS CARD */}
            <div className="bg-white dark:bg-[#1a1b1e] p-5 rounded-2xl border border-gray-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase text-gray-900 dark:text-white">
                How it works
              </h3>

              <div className="space-y-4 relative">
                {/* Stepper item 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1877f2] flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                    <Film className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white">
                      1. You pick
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      Upload your reel or video.
                    </p>
                  </div>
                </div>

                {/* Stepper item 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white">
                      2. (Optional) Challenge
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      Pick a game and odd from Game Hub or Ask AI.
                    </p>
                  </div>
                </div>

                {/* Stepper item 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white">
                      3. We secure
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      Escrow is created based on your challenge type.
                    </p>
                  </div>
                </div>

                {/* Stepper item 4 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                    <SendHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white">
                      4. You publish
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      Your content and challenge go live!
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. NEED HELP / ASK AI CARD */}
            <div className="bg-blue-50/60 dark:bg-blue-950/30 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/40 shadow-xs space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-[#1877f2] flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 dark:text-white">
                    Need help?
                  </h4>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5 leading-snug">
                    Ask AI Assistant to find the best games and odds for you.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAiAssistant(true)}
                className="w-full py-2 bg-white dark:bg-zinc-800 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 text-[#1877f2] dark:text-blue-400 text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Ask AI Now</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* ================= INLINE GAME HUB BROWSER MODAL ================= */}
      {showGameHubBrowser && (
        <div className="fixed inset-0 z-[2300] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 font-sans animate-in fade-in duration-150">
          <div className="bg-[#121314] text-white w-full max-w-xl rounded-3xl border border-zinc-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            
            {/* Game Hub Header */}
            <div className="p-4 bg-[#1b1c1e] border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#1877f2] text-white font-black text-[10px] rounded uppercase font-mono">
                  GAME HUB
                </span>
                <span className="text-xs font-bold text-gray-300">Browse Sports & Odds</span>
              </div>
              <button
                onClick={() => setShowGameHubBrowser(false)}
                className="p-1 hover:bg-zinc-800 rounded-full text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content List */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1 text-left">
              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1.5">
                  Select Match Fixture
                </label>
                <div className="space-y-2">
                  {SAMPLE_FIXTURES.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => {
                        setGhSelectedFixture(f);
                        setGhOddChoice({ name: `${f.awayTeam} Win`, val: f.odds["2"] });
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        ghSelectedFixture.id === f.id
                          ? "border-[#1877f2] bg-blue-950/40"
                          : "border-zinc-800 bg-[#17181a] hover:bg-zinc-800/60"
                      }`}
                    >
                      <div>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold block">{f.league}</span>
                        <span className="text-xs font-black text-white">{f.homeTeam} vs {f.awayTeam}</span>
                      </div>
                      <span className="text-[11px] font-bold text-gray-400 font-mono">{f.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Market Choice */}
              {ghSelectedFixture && (
                <div className="p-3 bg-[#17181a] rounded-2xl border border-zinc-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-amber-400">
                      Odds Selection (Match Winner 1X2)
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <button
                      type="button"
                      onClick={() => setGhOddChoice({ name: `${ghSelectedFixture.homeTeam} Win`, val: ghSelectedFixture.odds["1"] })}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        ghOddChoice.name.includes(ghSelectedFixture.homeTeam)
                          ? "border-emerald-500 bg-emerald-950/50 text-emerald-400 font-black"
                          : "border-zinc-800 bg-[#1e1f21] text-gray-300"
                      }`}
                    >
                      <span className="text-[10px] text-gray-400 block truncate">{ghSelectedFixture.homeTeam}</span>
                      <span className="text-sm font-black text-blue-400">{ghSelectedFixture.odds["1"]}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGhOddChoice({ name: "Draw", val: ghSelectedFixture.odds.X })}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        ghOddChoice.name === "Draw"
                          ? "border-emerald-500 bg-emerald-950/50 text-emerald-400 font-black"
                          : "border-zinc-800 bg-[#1e1f21] text-gray-300"
                      }`}
                    >
                      <span className="text-[10px] text-gray-400 block">Draw</span>
                      <span className="text-sm font-black text-red-400">{ghSelectedFixture.odds.X}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGhOddChoice({ name: `${ghSelectedFixture.awayTeam} Win`, val: ghSelectedFixture.odds["2"] })}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        ghOddChoice.name.includes(ghSelectedFixture.awayTeam)
                          ? "border-emerald-500 bg-emerald-950/50 text-emerald-400 font-black"
                          : "border-zinc-800 bg-[#1e1f21] text-gray-300"
                      }`}
                    >
                      <span className="text-[10px] text-gray-400 block truncate">{ghSelectedFixture.awayTeam}</span>
                      <span className="text-sm font-black text-blue-400">{ghSelectedFixture.odds["2"]}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 bg-[#1b1c1e] border-t border-zinc-800 flex justify-end gap-2">
              <button
                onClick={() => setShowGameHubBrowser(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmGameHubSelection}
                className="px-5 py-2 bg-[#1877f2] hover:bg-blue-600 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Attach Market & Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= INTERACTIVE AI ASSISTANT DRAWER ================= */}
      {showAiAssistant && (
        <div className="fixed inset-0 z-[2400] bg-black/80 backdrop-blur-xs flex justify-end font-sans animate-in slide-in-from-right duration-200">
          <div className="w-full max-w-md bg-white dark:bg-[#1a1b1d] h-full shadow-2xl flex flex-col justify-between text-gray-900 dark:text-gray-100 border-l border-gray-200 dark:border-zinc-800">
            
            <div className="p-4 border-b border-gray-200 dark:border-zinc-800 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-amber-300 font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black">AI Betting Assistant</h3>
                  <p className="text-[10px] opacity-80">Guiding your match prediction setup</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiAssistant(false)}
                className="p-1 hover:bg-white/20 rounded-full text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs text-left">
              {aiChatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-[#1877f2] text-white font-bold rounded-br-xs"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 font-medium rounded-bl-xs"
                  }`}>
                    {msg.text}
                  </div>

                  {msg.options && (
                    <div className="mt-2 space-y-1.5 w-full pl-2">
                      {msg.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleAiChoice(opt)}
                          className="w-full py-2 px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800 rounded-xl text-purple-700 dark:text-purple-300 font-bold text-left text-xs transition-all flex items-center justify-between cursor-pointer"
                        >
                          <span>{opt}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type match name..."
                className="flex-1 text-xs px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    handleAiChoice(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
              <button
                onClick={() => setShowAiAssistant(false)}
                className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= PREVIEW MODAL ================= */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-[2500] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-sans">
          <div className="bg-white dark:bg-[#1f2023] w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center">
              <span className="text-xs font-black text-[#1877f2] uppercase">Live Feed Preview</span>
              <button onClick={() => setShowPreviewModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-left">
              <div className="aspect-[16/9] bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white relative overflow-hidden">
                <Play className="w-10 h-10 fill-current opacity-80" />
                <span className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-mono">
                  {contentType.toUpperCase()}
                </span>
              </div>

              <h4 className="text-sm font-black text-gray-900 dark:text-white">
                {uploadTitle || "Untitled Prediction Clip"}
              </h4>

              <p className="text-xs text-gray-500 line-clamp-2">
                {uploadDescription || "Video breakdown summary..."}
              </p>

              {attachChallenge && selectedMatch && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/50 text-xs space-y-1">
                  <div className="flex justify-between items-center font-bold text-[#1877f2]">
                    <span>🎯 {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}</span>
                    <span>@{selectedOddsValue.toFixed(2)}</span>
                  </div>
                  <div className="text-[11px] text-gray-600 dark:text-gray-300 font-medium">
                    Pick: <strong>{selectedOddName}</strong> | Challenge: <strong>{challengeType}</strong>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="w-full py-2 bg-[#1877f2] text-white text-xs font-bold rounded-xl"
              >
                Back to Editing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
