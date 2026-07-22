import React, { useState, useEffect } from "react";
import { 
  Home as HomeIcon, 
  Tv, 
  Users, 
  Gamepad2, 
  Search, 
  Menu, 
  Wallet, 
  Moon, 
  Sun, 
  MessageSquare, 
  Bell, 
  Lock, 
  Plus, 
  ThumbsUp, 
  Share2, 
  Send, 
  Sparkles, 
  Trophy, 
  Grid,
  ChevronRight,
  LogOut,
  Info,
  Settings, 
  CircleDot, 
  Smartphone,
  CheckCircle,
  HelpCircle,
  UserPlus,
  Compass,
  RefreshCw,
  TrendingUp,
  X,
  Copy,
  Link,
  Check,
  User,
  ChevronDown,
  ChevronUp,
  History,
  Bookmark,
  Film,
  Store,
  Gift,
  Calendar,
  Rss,
  Smile,
  CreditCard,
  Flag,
  Activity,
  MessageCircle,
  Camera,
  CheckCircle2,
  Lightbulb,
  Heart,
  Star,
  UserCheck,
  Video,
  Swords,
  Globe,
  ArrowLeft,
  Minus,
  Square
} from "lucide-react";

// Sub-components
import WatchView from "./components/WatchView";
import GroupsView from "./components/GroupsView";
import MarketplaceView from "./components/MarketplaceView";
import SocialPostCard from "./components/SocialPostCard";
import PasswordModal from "./components/PasswordModal";
import FLPoolModal from "./components/FLPoolModal";
import InviteModal from "./components/InviteModal";
import ActiveChallengersModal from "./components/ActiveChallengersModal";
import JoinOpponentConfirmModal from "./components/JoinOpponentConfirmModal";
import GameHubModal from "./components/GameHubModal";
import WalletModal from "./components/WalletModal";
import AuthModal from "./components/AuthModal";
import ProfileView from "./components/ProfileView";
import CreatorStudioView from "./components/CreatorStudioView";
import LeftNavigationSidebar from "./components/LeftNavigationSidebar";
import ChallengesView from "./components/ChallengesView";
import HubView from "./components/HubView";
import EventsView from "./components/EventsView";

// Types
import { Match, Post, Friend, LookUptoParams, Group, Comment, VideoItem } from "./types";

export const PROFILES: Record<string, { name: string; type: "user" | "page"; avatar: string; desc: string }> = {
  "Collins Dnego": {
    name: "Collins Dnego",
    type: "user",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2",
    desc: "Elite LookUpto Bettor"
  },
  "Zephaniah Mwangi": {
    name: "Zephaniah Mwangi",
    type: "user",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zephaniah&backgroundColor=a855f7",
    desc: "Veteran Predictor Clan-Lead"
  },
  "Collo Dnego": {
    name: "Collo Dnego",
    type: "page",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collo&backgroundColor=059669",
    desc: "Managed Fan Club Page"
  }
};

// Helper Components
interface DrawerMenuRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  onClick: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  isActive?: boolean;
}

const DrawerMenuRow: React.FC<DrawerMenuRowProps> = ({ 
  icon, 
  title, 
  subtitle, 
  badge, 
  onClick, 
  isFirst, 
  isLast,
  isActive
}) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-3.5 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors text-left
      ${isFirst ? 'rounded-t-3xl' : ''} 
      ${isLast ? 'rounded-b-3xl' : 'border-b border-gray-50 dark:border-zinc-800/50'}
      ${isActive ? 'bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-900/10' : 'bg-white dark:bg-zinc-900'}
    `}
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isActive ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}>
        {icon}
      </div>
      <div className="flex flex-col justify-center">
        <span className={`text-[15px] font-black leading-tight ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
          {title}
        </span>
        {subtitle && (
          <span className="text-[11px] font-bold text-gray-400 leading-tight">
            {subtitle}
          </span>
        )}
      </div>
    </div>
    <div className="flex items-center gap-2">
      {badge && (
        <div className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
          {badge}
        </div>
      )}
      <ChevronRight className="w-5 h-5 text-gray-300" />
    </div>
  </button>
);

export interface UniversalOutcomeInput {
  id: string;
  name: string;
  odds: number;
}

export interface UniversalOutcomeResult extends UniversalOutcomeInput {
  impliedProb: number;
  sharePct: number;
  requiredStake: number;
}

export interface UniversalCalculationResult {
  contractValue: number;
  escrowFee: number;
  feePerParticipant: number;
  escrowLockValue: number;
  outcomes: UniversalOutcomeResult[];
  userStake: number;
  opponentStake: number;
  userPct: number;
  opponentPct: number;
  player1Stake: number;
  player2Stake: number;
  player3Stake: number;
  player1Pct: number;
  player2Pct: number;
  player3Pct: number;
  player1Odds: number;
  player2Odds: number;
  player3Odds: number;
  userOdds: number;
  opponentOdds: number;
  userReturn: number;
  userProfit: number;
  opponentReturn: number;
  opponentProfit: number;
  player1Return: number;
  player1Profit: number;
  player2Return: number;
  player2Profit: number;
  player3Return: number;
  player3Profit: number;
}

export const calculateUniversalStakes = (
  outcomes: UniversalOutcomeInput[],
  targetContractValue: number
): UniversalCalculationResult => {
  const contractValue = Math.max(1, targetContractValue);

  // 1. Calculate implied probability (1 / decimal odds) for each outcome
  const ipList = outcomes.map((o) => {
    const validOdds = o.odds && o.odds > 1 ? o.odds : 2.0;
    return 1 / validOdds;
  });

  const totalIp = ipList.reduce((sum, ip) => sum + ip, 0);

  // 2. Calculate proportional share percentage and initial required stake
  let totalCalculatedStake = 0;
  const calculatedOutcomes: UniversalOutcomeResult[] = outcomes.map((o, idx) => {
    const validOdds = o.odds && o.odds > 1 ? o.odds : 2.0;
    const ip = ipList[idx];
    const sharePct = totalIp > 0 ? (ip / totalIp) * 100 : 100 / outcomes.length;
    const rawStake = (sharePct / 100) * contractValue;
    const requiredStake = Math.round(rawStake * 100) / 100;
    totalCalculatedStake += requiredStake;

    return {
      ...o,
      odds: validOdds,
      impliedProb: ip,
      sharePct,
      requiredStake,
    };
  });

  // 3. Rounding adjustment so sum(stakes) strictly equals contractValue
  const diff = Math.round((contractValue - totalCalculatedStake) * 100) / 100;
  if (diff !== 0 && calculatedOutcomes.length > 0) {
    calculatedOutcomes[0].requiredStake = Math.round((calculatedOutcomes[0].requiredStake + diff) * 100) / 100;
  }

  // 4. Escrow fee (2%) and Winner Receives (contractValue - escrowFee)
  const escrowFee = Math.round(contractValue * 0.02 * 100) / 100;
  const feePerParticipant = Math.round((escrowFee / Math.max(1, outcomes.length)) * 100) / 100;
  const escrowLockValue = Math.round((contractValue - escrowFee) * 100) / 100;

  const o1 = calculatedOutcomes[0] || { requiredStake: 0, sharePct: 0, odds: 2.0 };
  const o2 = calculatedOutcomes[1] || { requiredStake: 0, sharePct: 0, odds: 2.0 };
  const o3 = calculatedOutcomes[2] || { requiredStake: 0, sharePct: 0, odds: 2.0 };

  const userStake = o1.requiredStake;
  const opponentStake = calculatedOutcomes.slice(1).reduce((sum, o) => sum + o.requiredStake, 0);

  const userReturn = escrowLockValue;
  const userProfit = userReturn - userStake;
  const opponentReturn = escrowLockValue;
  const opponentProfit = opponentReturn - opponentStake;

  return {
    contractValue,
    escrowFee,
    feePerParticipant,
    escrowLockValue,
    outcomes: calculatedOutcomes,
    userStake,
    opponentStake,
    userPct: o1.sharePct,
    opponentPct: calculatedOutcomes.slice(1).reduce((sum, o) => sum + o.sharePct, 0),
    player1Stake: o1.requiredStake,
    player2Stake: o2.requiredStake,
    player3Stake: o3.requiredStake,
    player1Pct: o1.sharePct,
    player2Pct: o2.sharePct,
    player3Pct: o3.sharePct,
    player1Odds: o1.odds,
    player2Odds: o2.odds,
    player3Odds: o3.odds,
    userOdds: o1.odds,
    opponentOdds: o2.odds,
    userReturn,
    userProfit,
    opponentReturn,
    opponentProfit,
    player1Return: escrowLockValue,
    player1Profit: escrowLockValue - o1.requiredStake,
    player2Return: escrowLockValue,
    player2Profit: escrowLockValue - o2.requiredStake,
    player3Return: escrowLockValue,
    player3Profit: escrowLockValue - o3.requiredStake,
  };
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "watch" | "groups" | "hub" | "profile" | "pages" | "memo" | "marketplace" | "creator_studio" | "challenges" | "events">("home");
  const [toastQueue, setToastQueue] = useState<Array<{ id: string; message: string; type?: "success" | "info" | "error" }>>([]);

  const triggerToast = (message: string, type: "success" | "info" | "error" = "info") => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToastQueue(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToastQueue(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("lookupto_dark_mode");
      if (saved !== null) {
        return saved === "true";
      }
    } catch (e) {
      // safe fallback
    }
    return false;
  });
  
  useEffect(() => {
    // Hijack window.alert to make the app feel fully functional with clean UI toasts
    const originalAlert = window.alert;
    window.alert = (msg: string) => {
      triggerToast(msg, "info");
    };
    return () => {
      window.alert = originalAlert;
    };
  }, []);

  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [pagesMenuOpen, setPagesMenuOpen] = useState(false);

  // Resize states for LookUpto Escrow Engine
  const [escrowWidth, setEscrowWidth] = useState<number>(340); // default width in px
  const [escrowHeight, setEscrowHeight] = useState<number>(580); // default height in px
  const [escrowTop, setEscrowTop] = useState<number>(0);
  const [escrowRight, setEscrowRight] = useState<number>(0);
  const [escrowSizeMode, setEscrowSizeMode] = useState<"normal" | "max" | "min">("normal");
  const [isResizing, setIsResizing] = useState<"n" | "s" | "e" | "w" | "nw" | "ne" | "sw" | "se" | "move" | null>(null);
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; w: number; h: number; top: number; right: number }>({ x: 0, y: 0, w: 340, h: 580, top: 0, right: 0 });

  const startDragResize = (direction: "n" | "s" | "e" | "w" | "nw" | "ne" | "sw" | "se" | "move", clientX: number, clientY: number) => {
    let currW = escrowWidth;
    let currH = escrowHeight;
    let currTop = escrowTop;
    let currRight = escrowRight;

    if (escrowSizeMode === "max") {
      currW = Math.min(760, window.innerWidth - 32);
      currH = Math.min(820, window.innerHeight - 100);
      currTop = 0;
      currRight = 0;
    } else if (escrowSizeMode === "min") {
      currW = Math.max(280, escrowWidth);
      currH = 56;
    }

    setEscrowWidth(currW);
    setEscrowHeight(currH);
    setEscrowTop(currTop);
    setEscrowRight(currRight);
    setEscrowSizeMode("normal");
    setIsResizing(direction);
    setResizeStart({ x: clientX, y: clientY, w: currW, h: currH, top: currTop, right: currRight });
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleResizeMove = (clientX: number, clientY: number) => {
      const deltaX = clientX - resizeStart.x;
      const deltaY = clientY - resizeStart.y;

      let newWidth = resizeStart.w;
      let newHeight = resizeStart.h;
      let newTop = resizeStart.top;
      let newRight = resizeStart.right;

      if (isResizing === "move") {
        newTop = resizeStart.top + deltaY;
        newRight = resizeStart.right - deltaX;
      } else {
        // Vertical resizing (North/South) - allow down to 56px (min) up to 1200px
        if (isResizing.includes("n")) {
          newHeight = Math.max(56, Math.min(1200, resizeStart.h - deltaY));
          newTop = resizeStart.top + (resizeStart.h - newHeight);
        } else if (isResizing.includes("s")) {
          newHeight = Math.max(56, Math.min(1200, resizeStart.h + deltaY));
        }

        // Horizontal resizing (East/West) - allow down to 280px up to 1000px
        if (isResizing.includes("w")) {
          newWidth = Math.max(280, Math.min(1000, resizeStart.w - deltaX));
        } else if (isResizing.includes("e")) {
          newWidth = Math.max(280, Math.min(1000, resizeStart.w + deltaX));
          newRight = resizeStart.right - (newWidth - resizeStart.w);
        }
      }

      setEscrowWidth(newWidth);
      setEscrowHeight(newHeight);
      setEscrowTop(newTop);
      setEscrowRight(newRight);
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleResizeMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      handleResizeMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleMouseUp = () => {
      setIsResizing(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isResizing, resizeStart]);

  const handleResetSize = () => {
    setEscrowWidth(340);
    setEscrowHeight(580);
    setEscrowTop(0);
    setEscrowRight(0);
  };

  // --- NYOTA / OPPONENT DISCOVERY PANEL STATES & EFFECTS ---
  const [nyotaStatus, setNyotaStatus] = useState<"idle" | "searching" | "paused" | "found">("idle");
  const [escrowLiveStatus, setEscrowLiveStatus] = useState<"Waiting for Opponent" | "Opponent Found" | "Escrow Locked" | "Match In Progress" | "Settled">("Waiting for Opponent");
  const [discoveryMode, setDiscoveryMode] = useState<"idle" | "searching" | "invite" | "post_success" | "invite_expired">("idle");
  const [nyotaSearchStep, setNyotaSearchStep] = useState<number>(0);
  const [nyotaMatchesFound, setNyotaMatchesFound] = useState<number>(0);
  const [nyotaInvitationsSent, setNyotaInvitationsSent] = useState<number>(0);
  const [nyotaAcceptanceRate, setNyotaAcceptanceRate] = useState<string>("--");
  const [nyotaEstTime, setNyotaEstTime] = useState<string>("--");
  
  // Real-time animation of search filters
  const [activeFilterIndex, setActiveFilterIndex] = useState<number>(0);

  // Invite states
  const [friendSearchQuery, setFriendSearchQuery] = useState<string>("");
  const [selectedFriendTab, setSelectedFriendTab] = useState<"recent" | "clan" | "favorites">("recent");
  const [invitationCountdown, setInvitationCountdown] = useState<number>(0);
  const [pendingFriendName, setPendingFriendName] = useState<string>("");

  // Search logs / timeline entries
  const [timelineLogs, setTimelineLogs] = useState<string[]>([
    "Challenge Created",
    "Waiting for Search"
  ]);

  // Nyota Search Simulation Effect
  useEffect(() => {
    let interval: any = null;
    if (nyotaStatus === "searching") {
      interval = setInterval(() => {
        setNyotaSearchStep((prevStep) => {
          const nextStep = prevStep + 1;
          
          // Animate filter selection sequentially
          setActiveFilterIndex((prev) => (prev + 1) % 11);

          // Update Search logs and metrics
          if (nextStep === 1) {
            setTimelineLogs((prev) => [...prev, "Searching Friends"]);
            setNyotaMatchesFound(1);
            setNyotaEstTime("2m 30s");
            setNyotaAcceptanceRate("84%");
          } else if (nextStep === 2) {
            setTimelineLogs((prev) => [...prev, "Searching Clan"]);
            setNyotaMatchesFound(3);
            setNyotaEstTime("1m 45s");
          } else if (nextStep === 3) {
            setTimelineLogs((prev) => [...prev, "Searching Public"]);
            setNyotaMatchesFound(5);
            setNyotaEstTime("1m 10s");
          } else if (nextStep === 4) {
            setTimelineLogs((prev) => [...prev, "Checking Wallet Compatibility"]);
            setNyotaMatchesFound(7);
          } else if (nextStep === 5) {
            setTimelineLogs((prev) => [...prev, "Comparing Challenge Rules"]);
            setNyotaMatchesFound(9);
            setNyotaInvitationsSent(1);
            setNyotaEstTime("45s");
          } else if (nextStep === 6) {
            setTimelineLogs((prev) => [...prev, "Finding Similar Bettors"]);
            setNyotaMatchesFound(12);
          } else if (nextStep === 7) {
            setTimelineLogs((prev) => [...prev, "Searching Selected Match"]);
            setTimelineLogs((prev) => [...prev, "Compatible Opponent Found"]);
            setNyotaMatchesFound(14);
            setNyotaInvitationsSent(2);
            setNyotaEstTime("15s");
          } else if (nextStep === 8) {
            setTimelineLogs((prev) => [...prev, "Updating Compatibility"]);
            setTimelineLogs((prev) => [...prev, "Invitation Sent", "Opponent Reviewing Challenge"]);
            setNyotaEstTime("5s");
          } else if (nextStep >= 9) {
            // Found opponent!
            setNyotaStatus("found");
            setTimelineLogs((prev) => [...prev, "Challenge Accepted", "Escrow Ready"]);
            setNyotaEstTime("Ready");
            setNyotaAcceptanceRate("100%");
            triggerToast("🟢 Opponent Found & Challenge Accepted! Escrow is now ready.", "success");
            clearInterval(interval);
          }

          return nextStep;
        });
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [nyotaStatus]);

  // Update Escrow Live Status based on search outcome
  useEffect(() => {
    if (nyotaStatus === "idle" || nyotaStatus === "searching" || nyotaStatus === "paused") {
      setEscrowLiveStatus("Waiting for Opponent");
    } else if (nyotaStatus === "found") {
      setEscrowLiveStatus("Opponent Found");
      
      const t1 = setTimeout(() => {
        setEscrowLiveStatus("Escrow Locked");
        triggerToast("🔒 Calculated stakes locked into escrow safely before kickoff!", "success");
        setTimelineLogs((prev) => [...prev, "Escrow Fees Deducted", "Stakes Locked in Smart Contract"]);
        
        const t2 = setTimeout(() => {
          setEscrowLiveStatus("Match In Progress");
          triggerToast("⚽ Match has kicked off! Live simulation running...", "info");
          setTimelineLogs((prev) => [...prev, "Match Kicked Off", "Simulating Live Action..."]);
          
          const t3 = setTimeout(() => {
            setEscrowLiveStatus("Settled");
            triggerToast("🏆 Match Settled! Remaining escrow balance awarded to the winner.", "success");
            setTimelineLogs((prev) => [...prev, "Match Finished", "Remaining Balance Disbursed to Winner"]);
          }, 6000);
          
          return () => clearTimeout(t3);
        }, 4000);
        
        return () => clearTimeout(t2);
      }, 4500);
      
      return () => clearTimeout(t1);
    }
  }, [nyotaStatus]);

  // Invitation countdown timer
  useEffect(() => {
    let timer: any = null;
    if (discoveryMode === "invite" && invitationCountdown > 0) {
      timer = setTimeout(() => {
        setInvitationCountdown((prev) => {
          if (prev <= 1) {
            // Countdown ended - invitation expired!
            setDiscoveryMode("invite_expired");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [discoveryMode, invitationCountdown]);
  // -------------------------------------------------------------
  
  // Custom auth state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ phoneNumber?: string; email?: string; provider?: string } | null>(null);

  // Elevated LookGroups states for synchronization across sidebars & Group Wall
  const [activeGroupId, setActiveGroupId] = useState("g-1");
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupCategory, setNewGroupCategory] = useState("Local Leagues");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupCoverImage, setNewGroupCoverImage] = useState("");
  const [newGroupAvatar, setNewGroupAvatar] = useState("");

  // Interactive Facebook Popovers & Menu States
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [messengerOpen, setMessengerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  // Custom Popover sub-filters and interactive state variables
  const [notificationsFilterTab, setNotificationsFilterTab] = useState<"all" | "unread">("all");
  const [notifOptionsMenuOpen, setNotifOptionsMenuOpen] = useState(false);
  const [notificationList, setNotificationList] = useState([
    {
      id: "noti-spec-1",
      names: "Hon Amini O. Junior, Metrine Karandini and 1,071 other people",
      action: "liked your reel: \"Peter Selasysi...\"",
      time: "1m",
      read: true,
      category: "new",
      type: "like",
      avatar: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=150"
    },
    {
      id: "noti-spec-2",
      names: "Erick Chelody, Hezz Jakoyugi and 3 others",
      action: "followed you.",
      time: "2h",
      read: true,
      category: "new",
      type: "follow",
      avatar: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=150"
    },
    {
      id: "noti-spec-3",
      names: "Ashôkâ Ïñçôginitä AI, Matrine Sakwa and Shims M Aggrey",
      action: "started following you from your suggested list.",
      time: "3h",
      read: false,
      category: "new",
      type: "follow",
      avatar: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=150"
    },
    {
      id: "noti-spec-4",
      names: "Samuel Werunga",
      action: "followed you.",
      time: "15h",
      read: false,
      category: "new",
      type: "follow_btn",
      avatar: "https://images.unsplash.com/photo-1500305060288-0f6d4b83002b?q=80&w=150"
    },
    {
      id: "noti-spec-5",
      names: "Wananda Dickson",
      action: "mentioned you and other followers in a comment.",
      time: "4h",
      read: false,
      category: "new",
      type: "mention",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150"
    },
    {
      id: "noti-spec-6",
      names: "Wananda Dickson",
      action: "mentioned you and other followers in a comment.",
      time: "8h",
      read: false,
      category: "new",
      type: "mention",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150"
    },
    // Earlier Section
    {
      id: "noti-spec-7",
      names: "Wananda Dickson",
      action: "mentioned you and other followers in his comments.",
      time: "18h",
      read: false,
      category: "earlier",
      type: "mention",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150"
    },
    {
      id: "noti-spec-8",
      names: "Wananda Dickson",
      action: "mentioned you and other followers in a comment.",
      time: "18h",
      read: false,
      category: "earlier",
      type: "mention",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150"
    }
  ]);

  const [samuelWerungaStatus, setSamuelWerungaStatus] = useState<"follow" | "following" | "dismissed">("follow");

  // Game Hub Modal States
  const [gameHubModalOpen, setGameHubModalOpen] = useState(false);
  const [selectedMatchForHub, setSelectedMatchForHub] = useState<Match | null>(null);
  const [showOtherLiveShortcuts, setShowOtherLiveShortcuts] = useState(false);

  // Inline Game Hub Visual States
  const [inlineHubTab, setInlineHubTab] = useState<"All Markets" | "Main" | "First Half" | "Goals" | "Cards and Corners">("All Markets");
  const [inlineHubCollapsed, setInlineHubCollapsed] = useState({
    oneXtwo: false,
    nextGoal: false,
    totalOverUnder: false,
    btts: false,
    corners: false,
  });

  // Resizable Challenge Window States
  const [challengeWindowOpen, setChallengeWindowOpen] = useState(false);
  const [challengeWindowData, setChallengeWindowData] = useState<{
    oppUser: string;
    oppStake: number;
    matchName: string;
    prediction: string;
    isProposedMarket?: boolean | "waiting" | "waiting_forced";
    proposedMarketToAcceptor?: string;
    isWaitingForced?: boolean;
  } | null>(null);
  const [challengeWindowWidth, setChallengeWindowWidth] = useState(550);
  const [challengeWindowHeight, setChallengeWindowHeight] = useState(480);
  const [challengeMode, setChallengeMode] = useState<"proposed" | "optionalized" | "waiting">("proposed");
  const [selectedAcceptorOutcome, setSelectedAcceptorOutcome] = useState<"1" | "X" | "2">("X");
  const [requestChangeTypeTab, setRequestChangeTypeTab] = useState<"market_category" | "force_outcome">("market_category");
  const [isRequestingChange, setIsRequestingChange] = useState(false);
  const [requestedMarketInput, setRequestedMarketInput] = useState("");
  const [requestChangeStatus, setRequestChangeStatus] = useState<"none" | "submitting" | "accepted" | "declined">("none");
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [marketChangeChallengeData, setMarketChangeChallengeData] = useState<any | null>(null);
  const [customGlobalChallenges, setCustomGlobalChallenges] = useState<any[]>([]);
  const [collabAddedAmount, setCollabAddedAmount] = useState<number>(15);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = challengeWindowWidth;
    const startHeight = challengeWindowHeight;

    const doDrag = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(420, startWidth + (moveEvent.clientX - startX));
      const newHeight = Math.max(400, startHeight + (moveEvent.clientY - startY));
      setChallengeWindowWidth(newWidth);
      setChallengeWindowHeight(newHeight);
    };

    const stopDrag = () => {
      document.removeEventListener("mousemove", doDrag);
      document.removeEventListener("mouseup", stopDrag);
    };

    document.addEventListener("mousemove", doDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  // Messenger Interactive states
  const [messengerSearchQuery, setMessengerSearchQuery] = useState("");
  const [messengerActiveTab, setMessengerActiveTab] = useState<"all" | "unread" | "groups" | "communities">("all");
  const [messengerPin, setMessengerPin] = useState(["", "", "", "", "", ""]);
  const [messengerUnlocked, setMessengerUnlocked] = useState(false);
  const [messengerChats, setMessengerChats] = useState([
    { id: "msg-1", name: "Margaret Wainoi", text: "Messages and calls are secured with end-to-end encryption. Only people in this chat can read them.", time: "4w", color: "bg-pink-500", status: "offline" },
    { id: "msg-2", name: "Mercy Mutiso", text: "Messages and calls are secured with end-to-end encryption. Only people in this chat can read them.", time: "4w", color: "bg-amber-500", status: "offline" },
    { id: "msg-3", name: "Sushy Macha", text: "Messages and calls are secured with end-to-end encryption. Only people in this chat can read them.", time: "4w", color: "bg-teal-500", status: "offline" },
    { id: "msg-4", name: "Cheru Too Faith", text: "Messages and calls are secured with end-to-end encryption. Only people in this chat can read them.", time: "4w", color: "bg-sky-500", status: "offline" },
    { id: "msg-5", name: "Mamake Alex", text: "Messages and calls are secured with end-to-end encryption. Only people in this chat can read them.", time: "2h", color: "bg-indigo-500", status: "online" },
    { id: "msg-6", name: "Dantez Demaish", text: "Messages and calls are secured with end-to-end encryption. Only people in this chat can read them.", time: "5h", color: "bg-rose-500", status: "online" },
    { id: "msg-7", name: "Abuu Kiprotich", text: "Messages and calls are secured with end-to-end encryption. Only people in this chat can read them.", time: "1d", color: "bg-emerald-500", status: "online" },
    { id: "msg-8", name: "Emily Shee", text: "Messages and calls are secured with end-to-end encryption. Only people in this chat can read them.", time: "3d", color: "bg-purple-500", status: "online" }
  ]);

  // App Launcher interactive states
  const [launcherSearch, setLauncherSearch] = useState("");

  // Switchable page profiles for the Profile switcher dropdown
  const [activeProfilePage, setActiveProfilePage] = useState("Collins Dnego");

  // Tagging & Saved States
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [composerTaggedFriends, setComposerTaggedFriends] = useState<string[]>([]);
  const [savedItems, setSavedItems] = useState([
    { id: "s1", type: "post", title: "Saved post from Alex Morgan: Thanks for the great business on the Chelsea vs Arsenal bet!", date: "Yesterday", thumb: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400&q=80" },
    { id: "s2", type: "memo", title: "Success Memo: Look-upto engine win", date: "2 days ago", thumb: "https://images.unsplash.com/photo-1518605368461-1e2474f8846c?w=400&q=80" },
    { id: "s3", type: "video", title: "Reel: Mashemeji Derby Highlights", date: "1 week ago", icon: "Tv" },
  ]);

  // ⭐ AI Chat State
  const [nyotaChatOpen, setNyotaChatOpen] = useState(false);
  const [nyotaMessages, setNyotaMessages] = useState<{role: 'user'|'model', content: string, thought?: string}[]>([
    { role: 'model', content: "Hello! I am ⭐ AI. How can I assist you with FaceLook Bet, betting inquiries, account details, or navigating our platform today? 😊" }
  ]);
  const [nyotaInput, setNyotaInput] = useState("");
  const [nyotaLoading, setNyotaLoading] = useState(false);

  const handleMemoPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMemoIsCompressing(true);
      // Simulate photo compression and validation
      setTimeout(() => {
        setMemoIsCompressing(false);
        setMemoComposePhoto(URL.createObjectURL(file));
      }, 1500);
    }
  };

  const handleMemoSubmit = () => {
    if (!memoComposePhoto || !memoComposeText.trim()) {
      alert("A memo MUST be accompanied by a high-quality camera photo and a description.");
      return;
    }
    
    const newMemo = {
      id: `m-${Date.now()}`,
      author: activeProfilePage,
      type: memoComposeType,
      text: memoComposeText,
      photo: memoComposePhoto,
      timestamp: "Just now",
      tagged: memoComposeTagged.trim() !== "" ? memoComposeTagged : undefined
    };
    
    setMemos([newMemo, ...memos]);
    setMemoFeedMode("feed");
    setMemoComposeText("");
    setMemoComposePhoto(null);
    setMemoComposeTagged("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleDropdown = (dropdown: "launcher" | "messenger" | "notifications" | "profile") => {
    setLauncherOpen(dropdown === "launcher" ? !launcherOpen : false);
    setMessengerOpen(dropdown === "messenger" ? !messengerOpen : false);
    setNotificationsOpen(dropdown === "notifications" ? !notificationsOpen : false);
    setProfileMenuOpen(dropdown === "profile" ? !profileMenuOpen : false);
  };

  const handleSaveItem = (itemType: string, itemContent: string, thumb?: string) => {
    setSavedItems([{
      id: `s-${Date.now()}`,
      type: itemType,
      title: itemContent,
      date: "Just now",
      thumb,
      icon: itemType === "video" ? "Tv" : undefined
    }, ...savedItems]);
    alert("Saved to your collection.");
  };

  const handleNyotaSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!nyotaInput.trim() || nyotaLoading) return;

    const userMessage = { role: 'user' as const, content: nyotaInput };
    setNyotaMessages(prev => [...prev, userMessage]);
    setNyotaInput("");
    setNyotaLoading(true);

    try {
      const appContext = {
        walletBalance,
        activeTab,
        hubActiveFilter,
        escrowEngineTab,
        collabChallengesCount: collabChallenges.length,
        customGlobalChallengesCount: customGlobalChallenges.length
      };

      const response = await fetch("/api/nyota-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...nyotaMessages, userMessage],
          appContext
        })
      });
      const data = await response.json();
      setNyotaMessages(prev => [...prev, { role: 'model', content: data.reply, thought: data.thought }]);
      
      if (data.navigateTo) {
        setActiveTab(data.navigateTo);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      if (data.openMessenger) {
        setMessengerOpen(true);
      }
    } catch (err) {
      setNyotaMessages(prev => [...prev, { role: 'model', content: "My connection to the server was interrupted. Please try again." }]);
    } finally {
      setNyotaLoading(false);
    }
  };

  const handlePinChange = (idx: number, value: string) => {
    const updated = [...messengerPin];
    updated[idx] = value;
    setMessengerPin(updated);

    // Focus next pin box
    if (value && idx < 5) {
      const nextBox = document.getElementById(`msg-pin-${idx + 1}`);
      if (nextBox) (nextBox as HTMLInputElement).focus();
    }

    // Try to auto lock/unlock
    if (updated.every(v => v !== "")) {
      setMessengerUnlocked(true);
      alert("🔒 Congratulations! Secure PIN recognized. Encrypted conversations have been decrypted successfully!");
    }
  };

  const [notifications, setNotifications] = useState<Array<{ id: string; text: string; time: string; read: boolean }>>([
    { id: "noti-1", text: "You have been elected as Co-Admin of Mashemeji Derby Clan (Ligi Bigi)!", time: "1 hour ago", read: false },
    { id: "noti-2", text: "Marcus_88 launched Premier League High Rollers Syndicate Pool #1", time: "2 hours ago", read: false },
    { id: "noti-3", text: "Welcome to Zero House Edge Syndicate! Click members count to invite partners.", time: "1 day ago", read: true }
  ]);
  const [groups, setGroups] = useState<Group[]>([
    {
      id: "g-1",
      name: "Premier League High Rollers Syndicate",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Premier&backgroundColor=e91e63",
      coverImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200",
      membersCount: 14205,
      description: "A private club composed exclusively of high liability look-upto matchers. Zero house margins, pure mathematical calculations only. Join active syndicates!",
      posts: [
        {
          id: "gp-1",
          author: "Marcus_88",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=9c27b0",
          time: "10 mins ago",
          content: "Just loaded the global pool for Man City vs Arsenal. I'm taking Man City to secure the win. Sponsoring 5 sendoffs of $100 each. Get in while the lookupto is open!",
          likes: 38,
          comments: [
            { author: "crypto_expert", content: "Already backed you on 2 spots. Ratios are beautiful.", time: "8 mins ago" }
          ]
        }
      ]
    },
    {
      id: "g-2",
      name: "Mashemeji Derby Clan (Ligi Bigi)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mashemeji&backgroundColor=4caf50",
      coverImage: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=1200",
      membersCount: 8430,
      description: "The home of local tier sports betting, focused entirely on Ligi Bigi, Mashemeji Derbies, and Gor Mahia vs AFC Leopards insights.",
      posts: [
        {
          id: "gp-2",
          author: "Collins Dnego",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2",
          time: "1 hour ago",
          content: "Ligi Bigi Mashemeji derby is crazy! 1-1 right now. Gor Mahia must score, AFC leopards middle defense has deep gaps. Anyone going P2P?",
          likes: 42,
          comments: []
        }
      ]
    },
    {
      id: "g-3",
      name: "Zero House Edge Syndicate",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zero&backgroundColor=2196f3",
      coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200",
      membersCount: 22100,
      description: "No bookmakers, no hidden juice, no losses to the middleman. Community-voted peer-to-peer matched pools with mathematical ratios.",
      posts: []
    }
  ]);

  // Real sports live/upcoming matches loaded dynamically
  const [matches, setMatches] = useState<Match[]>([]);
  const [isFeedLoading, setIsFeedLoading] = useState(false);
  const [selectedHubSport, setSelectedHubSport] = useState("Soccer");
  const [selectedMatchForEscrowPool, setSelectedMatchForEscrowPool] = useState<Match | null>(null);

  // Memo Tab State
  const [memoFeedMode, setMemoFeedMode] = useState<"feed" | "compose">("feed");
  const [memoComposeType, setMemoComposeType] = useState<"fundraising" | "thanksgiving" | "success">("success");
  const [memoComposeText, setMemoComposeText] = useState("");
  const [memoComposePhoto, setMemoComposePhoto] = useState<string | null>(null);
  const [memoComposeTagged, setMemoComposeTagged] = useState<string>("");
  const [memoIsCompressing, setMemoIsCompressing] = useState(false);
  const [memos, setMemos] = useState<{id: string; author: string; type: string; text: string; photo: string; timestamp: string; tagged?: string}[]>([
    {
      id: "m-1",
      author: "Alex Morgan",
      type: "thanksgiving",
      text: "Thanks for the great business on the Chelsea vs Arsenal bet! You honored the escrow perfectly.",
      photo: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400&q=80",
      timestamp: "2 hours ago",
      tagged: "Collins Dnego"
    },
    {
      id: "m-2",
      author: "Sarah Chen",
      type: "success",
      text: "Secured a massive win using the Look-upto engine! Grateful for this amazing platform.",
      photo: "https://images.unsplash.com/photo-1518605368461-1e2474f8846c?w=400&q=80",
      timestamp: "5 hours ago"
    }
  ]);

  // Authentication Pin locks
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [authReturnAction, setAuthReturnAction] = useState<"wallet" | "interactions" | null>(null);
  const [interactionsUnlocked, setInteractionsUnlocked] = useState(false);

  // General Escrow Modals
  const [flModalOpen, setFlModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [activeChallengersModalOpen, setActiveChallengersModalOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  // States for user funds & transaction history
  const [walletBalance, setWalletBalance] = useState<number>(1500.00);
  const [transactions, setTransactions] = useState<Array<{ id: string; type: "deposit" | "withdraw" | "bet_stake" | "bet_win"; amount: number; time: string; target: string }>>([
    { id: "tx-1", type: "deposit", amount: 1500.00, time: "Just now", target: "Free Virtual Signup Credits" }
  ]);

  // Lifted video lists for Creator Studio synchronization
  const [studioVideos, setStudioVideos] = useState<VideoItem[]>([
    {
      id: "v-1",
      title: "How I hit 100% Correct Score on Nairobi Derby Live Stream 🏆",
      creator: "Zephaniah Mwangi",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zephaniah&backgroundColor=a855f7",
      views: "14.2K",
      likes: 1240,
      liked: false,
      commentsCount: 382,
      tags: ["#lookupto", "#correctscore", "#nairobi_soccer", "#derby"],
      duration: "3:42",
      thumbnailGradient: "from-blue-600 to-indigo-900",
      summary: "Amazing high-stakes tactical review of local odds and betting parameters live."
    },
    {
      id: "v-2",
      title: "Leeds vs Man Utd Betting Ratio Analytics (Live commentary & public tips)",
      creator: "Metrine Karandini",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Metrine&backgroundColor=ec4899",
      views: "8.9K",
      likes: 642,
      liked: false,
      commentsCount: 119,
      tags: ["#predictions", "#leeds", "#ratios", "#facelook"],
      duration: "5:12",
      thumbnailGradient: "from-purple-600 to-pink-700",
      summary: "Step-by-step ratio analysis detailing P2P wagering triggers."
    },
    {
      id: "v-3",
      title: "Standard betting slips copycat tutorial from seasoned lookupto partners",
      creator: "Collins Dnego",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2",
      views: "4.5K",
      likes: 310,
      liked: false,
      commentsCount: 45,
      tags: ["#partnership", "#earnings", "#lookupto_clan"],
      duration: "2:15",
      thumbnailGradient: "from-emerald-600 to-teal-800",
      summary: "How to copy and synchronize daily staker layouts perfectly.",
      challenge: {
        id: "ch-v3",
        title: "Beat Collins Dnego: Match staker ratios of Leeds vs Chelsea",
        pool: 80,
        joined: false
      }
    },
    {
      id: "v-4",
      title: "English Premier League Weekend Projections & live odds breakdown",
      creator: "Hon Amini O. Junior",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hon&backgroundColor=f59e0b",
      views: "22.1K",
      likes: 2190,
      liked: false,
      commentsCount: 994,
      tags: ["#football_fever", "#epl_odds", "#betting_tips"],
      duration: "8:05",
      thumbnailGradient: "from-amber-600 to-red-800",
      summary: "Comprehensive look at match schedules, injured player rosters, and live broadcast odds."
    },
    {
      id: "v-5",
      title: "Gor Mahia vs AFC Leopards Tactical History & Derby Odds",
      creator: "Zephaniah Mwangi",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zephaniah&backgroundColor=a855f7",
      views: "18.5K",
      likes: 1950,
      liked: false,
      commentsCount: 220,
      tags: ["#mashemeji", "#gormahia", "#afcleopards", "#derby"],
      duration: "4:30",
      thumbnailGradient: "from-emerald-600 to-green-950",
      summary: "A deep look into the rich history of Kenya's biggest soccer derby and the current odds."
    },
    {
      id: "v-6",
      title: "Staking Pool Strategy: How to pool with friends on high ratios",
      creator: "Collo Dnego Page",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collo&backgroundColor=059669",
      views: "11.2K",
      likes: 830,
      liked: false,
      commentsCount: 94,
      tags: ["#pooling", "#staking", "#lookupto_clan"],
      duration: "3:15",
      thumbnailGradient: "from-amber-500 to-orange-900",
      summary: "Step by step walkthrough on creating decentralized group staker agreements."
    }
  ]);

  const [studioReels, setStudioReels] = useState<VideoItem[]>([
    {
      id: "r-1",
      title: "🔥 Nairobi Derby Live Crowd Reaction!",
      creator: "Collins Dnego",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2",
      views: "155K",
      likes: 12400,
      liked: false,
      commentsCount: 1530,
      tags: ["#derby", "#reels", "#nairobi", "#football"],
      duration: "0:45",
      thumbnailGradient: "from-red-650 via-orange-550 to-amber-500",
      summary: "Pure madness at the stadium when the Nairobi derby winning goal was struck in the 94th minute!"
    },
    {
      id: "r-2",
      title: "🎯 Correct prediction payout highlight by admin",
      creator: "Baridi SANA Page admin",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Baridi&backgroundColor=1877f2",
      views: "98K",
      likes: 8520,
      liked: true,
      commentsCount: 940,
      tags: ["#payout", "#lookupto_clan", "#fever"],
      duration: "0:59",
      thumbnailGradient: "from-blue-600 via-indigo-500 to-purple-600",
      summary: "How we hit a dynamic match slip live. Simple guides to copying calculations."
    },
    {
      id: "r-3",
      title: "⚽ Brilliant tactical defense analysis in 30 seconds",
      creator: "Hon Amini O. Junior",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hon&backgroundColor=f59e0b",
      views: "45K",
      likes: 3120,
      liked: false,
      commentsCount: 184,
      tags: ["#tactics", "#defense", "#premier_league"],
      duration: "0:30",
      thumbnailGradient: "from-teal-600 via-emerald-500 to-green-600",
      summary: "Why a low defensive block was effective during the Premier League match today."
    },
    {
      id: "r-4",
      title: "⚡ Mashemeji Derby Fan Match Day Energy!",
      creator: "Zephaniah Mwangi",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zephaniah&backgroundColor=a855f7",
      views: "88K",
      likes: 7400,
      liked: false,
      commentsCount: 680,
      tags: ["#derby", "#fans", "#stadium", "#kpl"],
      duration: "0:30",
      thumbnailGradient: "from-emerald-600 via-teal-500 to-green-650",
      summary: "Incredible fan chants outside the stadium as both teams arrive for the massive derby."
    },
    {
      id: "r-5",
      title: "🔥 Instant Payout Proof: Switched to Page Profile!",
      creator: "Collo Dnego Page",
      creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collo&backgroundColor=059669",
      views: "120K",
      likes: 10200,
      liked: false,
      commentsCount: 1430,
      tags: ["#payout", "#proof", "#finance", "#escrow"],
      duration: "0:45",
      thumbnailGradient: "from-purple-600 via-pink-600 to-orange-500",
      summary: "Live mobile screen recording showing instant withdrawal to local wallets in seconds."
    }
  ]);

  const [studioSuccess, setStudioSuccess] = useState<VideoItem[]>([
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

  // Selected live watch simulator match
  const [watchSelectedMatch, setWatchSelectedMatch] = useState<Match | null>(null);
  const [kenyanShowTrigger, setKenyanShowTrigger] = useState(0);

  // Open-ended Search prompt (connected to search-grounded tips!)
  const [searchPrompt, setSearchPrompt] = useState("");
  const [searchResponse, setSearchResponse] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // Ratio-Engine inputs
  const [ratioOpponent, setRatioOpponent] = useState<Friend | null>(null);
  const [ratioMatchName, setRatioMatchName] = useState("");
  const [ratioOddName, setRatioOddName] = useState("");
  const [ratioOddValue, setRatioOddValue] = useState<number>(0);
  const [ratioTotalPool, setRatioTotalPool] = useState<number>(100);
  const [calculatorMode, setCalculatorMode] = useState<"stake" | "contract">("stake");
  const [calculatorUserStakeInput, setCalculatorUserStakeInput] = useState<number>(40);
  const [sendoffsCount, setSendoffsCount] = useState<number>(1);
  const [isSendoffEnabled, setIsSendoffEnabled] = useState(false);
  const [postToGlobal, setPostToGlobal] = useState(false);
  const [ratioMatch, setRatioMatch] = useState<Match | null>(null);
  const [ratioSelection, setRatioSelection] = useState<"1" | "X" | "2">("1");
  const [numOpponents, setNumOpponents] = useState<1 | 2>(1);
  const [opponentSelection, setOpponentSelection] = useState<"1" | "X" | "2">("X");
  const [challengeTargetMode, setChallengeTargetMode] = useState<"proposed" | "op">("proposed");
  const [isWaitingMode, setIsWaitingMode] = useState(true);

  const [composerText, setComposerText] = useState("");
  const [isRatioEscrowCollapsed, setIsRatioEscrowCollapsed] = useState(false);

  // Private Challenge states
  interface PrivateChallengeFriend {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    status: "online" | "idle" | "offline";
    walletBalance: number;
    verified?: boolean;
  }

  const connectedFriendsList: PrivateChallengeFriend[] = [
    { id: "pf-mb", username: "@MichaelB", displayName: "Michael Brown", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80", status: "online", walletBalance: 320.00, verified: true },
    { id: "pf-mj", username: "@MichaelJ", displayName: "Michael James", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80", status: "online", walletBalance: 210.00, verified: false },
    { id: "pf-ma", username: "@MichelleA", displayName: "Michelle Adams", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80", status: "offline", walletBalance: 155.00, verified: true },
    { id: "pf-mo", username: "@MikeO", displayName: "Mike Otieno", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80", status: "online", walletBalance: 280.00, verified: true },
    { id: "pf-jm", username: "@JohnM", displayName: "John Mwangi", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80", status: "online", walletBalance: 190.00, verified: true },
    { id: "pf-jk", username: "@JonathanK", displayName: "Jonathan Kimani", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80", status: "idle", walletBalance: 240.00, verified: false },
    { id: "pf-jw", username: "@JoyceW", displayName: "Joyce Wanjiru", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80", status: "online", walletBalance: 310.00, verified: true },
    { id: "pf-bo", username: "@BrianO", displayName: "Brian Ouma", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80", status: "online", walletBalance: 175.00, verified: false },
    { id: "pf-ko", username: "@KevinO", displayName: "Kevin Otieno", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80", status: "idle", walletBalance: 400.00, verified: true },
    { id: "pf-sk", username: "@SarahK", displayName: "Sarah Kim", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80", status: "online", walletBalance: 220.00, verified: true },
    { id: "pf-dt", username: "@david_t", displayName: "David T.", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80", status: "online", walletBalance: 250.00, verified: true },
    { id: "pf-sl", username: "@sarah_l", displayName: "Sarah L.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80", status: "online", walletBalance: 180.50, verified: false },
    { id: "pf-ew", username: "@emma_w", displayName: "Emma W.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80", status: "offline", walletBalance: 95.00, verified: false },
    { id: "pf-ak", username: "@alex_k", displayName: "Alex K.", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80", status: "online", walletBalance: 420.00, verified: true }
  ];

  const [selectedPrivateFriend, setSelectedPrivateFriend] = useState<PrivateChallengeFriend | null>(null);
  const [privateFriendSearchQuery, setPrivateFriendSearchQuery] = useState("");
  const [recentSearchIds, setRecentSearchIds] = useState<string[]>(["pf-mb", "pf-bo", "pf-ko", "pf-sk"]);
  const [privateChallengeExpiry, setPrivateChallengeExpiry] = useState<"15m" | "1h" | "24h">("1h");
  const [privateChallengeMode, setPrivateChallengeMode] = useState<"Open" | "Forced">("Open");
  const [privateForcedOutcome, setPrivateForcedOutcome] = useState<string>("");
  const [privateChallengeStatus, setPrivateChallengeStatus] = useState<"draft" | "sent" | "accepted" | "declined" | "expired">("draft");
  const [privateChallengeViewMode, setPrivateChallengeViewMode] = useState<"creator" | "friend">("creator");
  const [privateChallengeTimeLeft, setPrivateChallengeTimeLeft] = useState<number>(3600);

  const handleSelectPrivateFriend = (friend: PrivateChallengeFriend) => {
    setSelectedPrivateFriend(friend);
    setPrivateFriendSearchQuery(friend.displayName);
    setRecentSearchIds((prev) => [friend.id, ...prev.filter((id) => id !== friend.id)].slice(0, 10));
    setPrivateForcedOutcome("");
  };

  // Collaborative Escrow Engine states
  const [escrowEngineTab, setEscrowEngineTab] = useState<"mimi" | "three_way" | "tujengane">("mimi");
  const [showEscrowCalculationModal, setShowEscrowCalculationModal] = useState(false);
  const [escrowModalStage, setEscrowModalStage] = useState<
    "calculation" | "choose_distribution" | "invite_friend" | "private_sent" | "private_declined" | "private_expired" | "nyota_confirm" | "nyota_messenger" | "published" | "receipt"
  >("calculation");

  // Nyota AI Messenger & Receipt state
  const [nyotaMatchMessages, setNyotaMatchMessages] = useState<
    Array<{
      id: string;
      sender: "nyota" | "user";
      text: string;
      quickReplies?: string[];
      matchCard?: boolean;
      threeWayVerifiedCard?: boolean;
    }>
  >([]);
  const [nyotaScopeIndex, setNyotaScopeIndex] = useState<number>(0);
  const [nyotaScopeAnswers, setNyotaScopeAnswers] = useState<{
    friends: boolean;
    clan: boolean;
    public: boolean;
    similar: boolean;
    verified: boolean;
  }>({
    friends: true,
    clan: true,
    public: true,
    similar: true,
    verified: true,
  });
  const [nyotaChatInput, setNyotaChatInput] = useState("");
  const [nyotaMatchStatus, setNyotaMatchStatus] = useState<"questions" | "searching" | "matched" | "merged">("questions");
  const [receiptNumber, setReceiptNumber] = useState<string>("");
  const [threeWayJoinedCount, setThreeWayJoinedCount] = useState<number>(1);

  // Tujengane Pool Contribution Model & State Variables
  const [tujenganeModelMode, setTujenganeModelMode] = useState<"flexible" | "fixed">("flexible");
  const [tujenganeContributorsCount, setTujenganeContributorsCount] = useState<number>(6);
  const [tujenganeCustomMembersInput, setTujenganeCustomMembersInput] = useState<string>("");
  const [isTujenganeCustom, setIsTujenganeCustom] = useState<boolean>(false);
  const [tujenganeJoinedCount, setTujenganeJoinedCount] = useState<number>(1);
  const [tujenganeMinContrib, setTujenganeMinContrib] = useState<number>(10);
  const [tujenganeCreatorContrib, setTujenganeCreatorContrib] = useState<number>(40);
  const [tujenganeMaxMembers, setTujenganeMaxMembers] = useState<string>("10");
  const [tujenganeVisibility, setTujenganeVisibility] = useState<"Public" | "Clan" | "Friends">("Public");
  const [tujenganeContributorsList, setTujenganeContributorsList] = useState<Array<{ id: string; name: string; amount: number; isCreator?: boolean }>>([
    { id: "creator", name: "You (Creator)", amount: 40, isCreator: true }
  ]);
  const [tujenganeOpponent1Matched, setTujenganeOpponent1Matched] = useState<boolean>(false);
  const [tujenganeOpponent2Matched, setTujenganeOpponent2Matched] = useState<boolean>(false);

  const getNormalizedCreatorPick = (): "1" | "X" | "2" => {
    if (ratioOddName) {
      const norm = ratioOddName.trim().toLowerCase();
      if (norm === "1" || norm === "home") return "1";
      if (norm === "x" || norm === "draw") return "X";
      if (norm === "2" || norm === "away") return "2";
      if (ratioMatch) {
        if (ratioMatch.homeTeam && norm.includes(ratioMatch.homeTeam.trim().toLowerCase())) return "1";
        if (ratioMatch.awayTeam && norm.includes(ratioMatch.awayTeam.trim().toLowerCase())) return "2";
        if (ratioMatch.homeTeam && ratioMatch.homeTeam.trim().toLowerCase().includes(norm)) return "1";
        if (ratioMatch.awayTeam && ratioMatch.awayTeam.trim().toLowerCase().includes(norm)) return "2";
      }
    }
    if (ratioSelection === "1" || ratioSelection === "X" || ratioSelection === "2") {
      return ratioSelection;
    }
    return "1";
  };

  const getThreeWayParticipants = () => {
    const calc = getCentralCalculation();
    const odds1 = (ratioOddName === "1" && ratioOddValue > 0) ? ratioOddValue : (ratioMatch?.odds?.["1"] ?? 2.10);
    const oddsX = (ratioOddName === "X" && ratioOddValue > 0) ? ratioOddValue : (ratioMatch?.odds?.X ?? 3.25);
    const odds2 = (ratioOddName === "2" && ratioOddValue > 0) ? ratioOddValue : (ratioMatch?.odds?.["2"] ?? 3.50);

    const homeTeam = ratioMatch?.homeTeam || "Home";
    const awayTeam = ratioMatch?.awayTeam || "Away";

    const pHome = { key: "1", label: `Home (${homeTeam})`, shortLabel: homeTeam, odds: odds1, stake: calc.player1Stake };
    const pDraw = { key: "X", label: "Draw", shortLabel: "Draw", odds: oddsX, stake: calc.player2Stake };
    const pAway = { key: "2", label: `Away (${awayTeam})`, shortLabel: awayTeam, odds: odds2, stake: calc.player3Stake };

    if (ratioOddName === "X") {
      return [
        { role: "Player 1 (You)", isUser: true, ...pDraw, status: "✓ Ready" },
        { role: "Player 2", isUser: false, ...pHome, status: "Waiting for Opponent" },
        { role: "Player 3", isUser: false, ...pAway, status: "Waiting for Opponent" },
      ];
    } else if (ratioOddName === "2") {
      return [
        { role: "Player 1 (You)", isUser: true, ...pAway, status: "✓ Ready" },
        { role: "Player 2", isUser: false, ...pHome, status: "Waiting for Opponent" },
        { role: "Player 3", isUser: false, ...pDraw, status: "Waiting for Opponent" },
      ];
    } else {
      return [
        { role: "Player 1 (You)", isUser: true, ...pHome, status: "✓ Ready" },
        { role: "Player 2", isUser: false, ...pDraw, status: "Waiting for Opponent" },
        { role: "Player 3", isUser: false, ...pAway, status: "Waiting for Opponent" },
      ];
    }
  };

  const scopeQuestionsList = [
    { key: "friends", label: "Friends", question: "Should I search among Friends?" },
    { key: "clan", label: "Clan Members", question: "Search Clan Members?" },
    { key: "public", label: "Public Community", question: "Search Public Community?" },
    { key: "similar", label: "Similar Bettors", question: "Search Similar Bettors?" },
    { key: "verified", label: "Verified Players", question: "Search Verified Players?" },
  ];

  const triggerThreeWayNyotaMatchmaking = () => {
    const parts = getThreeWayParticipants();
    const player2 = parts[1];
    const player3 = parts[2];

    setTimeout(() => {
      setNyotaMatchMessages((prev) => [
        ...prev,
        {
          id: `3way-step1-${Date.now()}`,
          sender: "nyota",
          text: `🔍 Searching open contracts for Player 2 (${player2.label})...`,
        },
      ]);
    }, 600);

    setTimeout(() => {
      setNotifications((prev) => [
        {
          id: `noti-${Date.now()}`,
          text: `🤖 Nyota AI matched Player 2 (${player2.shortLabel}) for your 3-Way Challenge on ${ratioMatchName || "Match"}!`,
          time: "Just now",
          read: false,
        },
        ...prev,
      ]);
      setNyotaMatchMessages((prev) => [
        ...prev,
        {
          id: `3way-p2-${Date.now()}`,
          sender: "nyota",
          text: `✓ Player 2 found!\n\n• Outcome: ${player2.label} @${player2.odds.toFixed(2)}\n• Required Stake: $${player2.stake.toFixed(2)}\n• Status: ✓ Wallet & Stake Verified`,
        },
        {
          id: `3way-step2-${Date.now()}`,
          sender: "nyota",
          text: `🔍 Continuing search for Player 3 (${player3.label})...`,
        },
      ]);
    }, 1800);

    setTimeout(() => {
      setNotifications((prev) => [
        {
          id: `noti-${Date.now()}`,
          text: `🎉 Nyota AI matched Player 3 (${player3.shortLabel})! All participants verified for ${ratioMatchName || "Match"}.`,
          time: "Just now",
          read: false,
        },
        ...prev,
      ]);
      setNyotaMatchStatus("matched");
      setNyotaMatchMessages((prev) => [
        ...prev,
        {
          id: `3way-p3-${Date.now()}`,
          sender: "nyota",
          text: `✓ Player 3 found!\n\n• Outcome: ${player3.label} @${player3.odds.toFixed(2)}\n• Required Stake: $${player3.stake.toFixed(2)}\n• Status: ✓ Wallet & Stake Verified`,
        },
        {
          id: `3way-all-${Date.now()}`,
          sender: "nyota",
          text: `🎉 All 3 participants matched!\n\n✓ All participants verified.\n✓ Wallet balances verified.\n✓ Required stakes verified.`,
          threeWayVerifiedCard: true,
          quickReplies: ["Initialize Escrow", "Cancel Search"],
        },
      ]);
    }, 3200);
  };

  const triggerTujenganeNyotaMatchmaking = () => {
    const calc = getCentralCalculation();
    const creatorPick = getNormalizedCreatorPick();

    let groupTargetStake = calc.player1Stake;
    let opp1Name = "Draw";
    let opp1Stake = calc.player2Stake;
    let opp2Name = ratioMatch?.awayTeam || "Away";
    let opp2Stake = calc.player3Stake;

    if (creatorPick === "X") {
      groupTargetStake = calc.player2Stake;
      opp1Name = ratioMatch?.homeTeam || "Home";
      opp1Stake = calc.player1Stake;
      opp2Name = ratioMatch?.awayTeam || "Away";
      opp2Stake = calc.player3Stake;
    } else if (creatorPick === "2") {
      groupTargetStake = calc.player3Stake;
      opp1Name = ratioMatch?.homeTeam || "Home";
      opp1Stake = calc.player1Stake;
      opp2Name = "Draw";
      opp2Stake = calc.player2Stake;
    }

    const groupPredName = creatorPick === "1" ? (ratioMatch?.homeTeam || "Home") : creatorPick === "2" ? (ratioMatch?.awayTeam || "Away") : "Draw";
    setTujenganeOpponent1Matched(false);
    setTujenganeOpponent2Matched(false);

    if (tujenganeModelMode === "fixed") {
      const memberCount = isTujenganeCustom ? (parseInt(tujenganeCustomMembersInput) || 2) : tujenganeContributorsCount;
      const contributionPerMember = groupTargetStake / (memberCount > 0 ? memberCount : 1);
      setTujenganeJoinedCount(1);

      setNyotaMatchMessages([
        {
          id: "tuj-fixed-1",
          sender: "nyota",
          text: `🤖 Starting Nyota AI Fixed Pool Search for ${ratioMatchName || "Match"}!\n\n🎯 Group Target Stake: $${groupTargetStake.toFixed(2)} backing ${groupPredName}\n👥 Seats: ${memberCount} Contributors ($${contributionPerMember.toFixed(2)} / seat)`,
        },
      ]);

      setTimeout(() => {
        setNyotaMatchMessages((prev) => [
          ...prev,
          {
            id: `tuj-fp1-${Date.now()}`,
            sender: "nyota",
            text: `🔍 Phase 1: Nyota finding team members backing "${groupPredName}" with $${contributionPerMember.toFixed(2)} fixed stake...`,
          },
        ]);
      }, 800);

      setTimeout(() => {
        setTujenganeJoinedCount(Math.min(memberCount, 2));
        setNyotaMatchMessages((prev) => [
          ...prev,
          {
            id: `tuj-fc1-${Date.now()}`,
            sender: "nyota",
            text: `🤝 Teammate Joined! (${Math.min(memberCount, 2)} / ${memberCount})\n• Stake $${contributionPerMember.toFixed(2)}: Verified & Locked ✓`,
          },
        ]);
      }, 2200);

      setTimeout(() => {
        setTujenganeJoinedCount(memberCount);
        setNyotaMatchMessages((prev) => [
          ...prev,
          {
            id: `tuj-fc2-${Date.now()}`,
            sender: "nyota",
            text: `🎉 All ${memberCount} Teammates Joined! (${memberCount} / ${memberCount})\n\n✓ Phase 1 Complete: Total pool target of $${groupTargetStake.toFixed(2)} raised equally!`,
          },
        ]);
      }, 4000);

      setTimeout(() => {
        setTujenganeOpponent1Matched(true);
        setNyotaMatchMessages((prev) => [
          ...prev,
          {
            id: `tuj-fopp1-${Date.now()}`,
            sender: "nyota",
            text: `⚡ Phase 2: Searching for opposing betting sides...\n\n✓ Opponent Side 1 Matched: ${opp1Name} ($${opp1Stake.toFixed(2)} required stake locked)`,
          },
        ]);
      }, 5500);

      setTimeout(() => {
        setTujenganeOpponent2Matched(true);
        setNyotaMatchStatus("matched");
        setNyotaMatchMessages((prev) => [
          ...prev,
          {
            id: `tuj-fopp2-${Date.now()}`,
            sender: "nyota",
            text: `🎉 Opponent Side 2 Matched: ${opp2Name} ($${opp2Stake.toFixed(2)} required stake locked)!`,
            tujenganeVerifiedCard: true,
            quickReplies: ["Merge Escrow", "Continue Searching", "Cancel"],
          },
        ]);
      }, 7000);

    } else {
      // Flexible Contribution Mode
      const maxCreatorSeed = groupTargetStake * 0.9;
      const initialSeed = Math.min(tujenganeCreatorContrib, maxCreatorSeed);
      const initialRemaining = Math.max(0, groupTargetStake - initialSeed);

      // Initial list with Creator
      const initialList = [{ id: "creator", name: "You (Creator)", amount: initialSeed, isCreator: true }];
      setTujenganeContributorsList(initialList);

      const seedPct = groupTargetStake > 0 ? (initialSeed / groupTargetStake) * 100 : 0;

      setNyotaMatchMessages([
        {
          id: "tuj-1",
          sender: "nyota",
          text: `🤖 Starting Nyota AI Flexible Pool Search for ${ratioMatchName || "Match"}!\n\n🎯 Group Target Stake: $${groupTargetStake.toFixed(2)} backing ${groupPredName}\n🌱 Creator Seed: $${initialSeed.toFixed(2)} (${seedPct.toFixed(1)}% Ownership)\n💵 Remaining Needed: $${initialRemaining.toFixed(2)}\n⚙️ System Limit: Max Capped at Remaining ($${initialRemaining.toFixed(2)}) | Visibility: ${tujenganeVisibility}`,
        },
      ]);

      // Break remaining amount into 3 realistic contributions
      const rem = initialRemaining;
      const c1Amt = Math.min(rem, Math.max(1, Math.round(rem * 0.35)));
      const rem2 = Math.max(0, rem - c1Amt);
      const c2Amt = Math.min(rem2, Math.max(1, Math.round(rem2 * 0.5)));
      const c3Amt = Math.max(0, rem2 - c2Amt);

      setTimeout(() => {
        setNyotaMatchMessages((prev) => [
          ...prev,
          {
            id: `tuj-p1-${Date.now()}`,
            sender: "nyota",
            text: `🔍 Phase 1: Nyota searching for flexible contributions (capped at max $${initialRemaining.toFixed(2)}) to fill remaining pool...`,
          },
        ]);
      }, 800);

      setTimeout(() => {
        if (c1Amt > 0) {
          setTujenganeContributorsList((prev) => [...prev, { id: "p1", name: "Alice M.", amount: c1Amt }]);
          const currentRaised = initialSeed + c1Amt;
          const currentRem = Math.max(0, groupTargetStake - currentRaised);
          setNyotaMatchMessages((prev) => [
            ...prev,
            {
              id: `tuj-c1-${Date.now()}`,
              sender: "nyota",
              text: `🤝 Contributor Alice M. joined with $${c1Amt.toFixed(2)} contribution!\n• Raised: $${currentRaised.toFixed(2)} / $${groupTargetStake.toFixed(2)} (${((currentRaised / groupTargetStake) * 100).toFixed(1)}%)\n• Remaining Needed: $${currentRem.toFixed(2)}`,
            },
          ]);
        }
      }, 2200);

      setTimeout(() => {
        if (c2Amt > 0) {
          setTujenganeContributorsList((prev) => [...prev, { id: "p2", name: "Brian K.", amount: c2Amt }]);
          const currentRaised = initialSeed + c1Amt + c2Amt;
          const currentRem = Math.max(0, groupTargetStake - currentRaised);
          setNyotaMatchMessages((prev) => [
            ...prev,
            {
              id: `tuj-c2-${Date.now()}`,
              sender: "nyota",
              text: `🤝 Contributor Brian K. joined with $${c2Amt.toFixed(2)} contribution!\n• Raised: $${currentRaised.toFixed(2)} / $${groupTargetStake.toFixed(2)} (${((currentRaised / groupTargetStake) * 100).toFixed(1)}%)\n• Remaining Needed: $${currentRem.toFixed(2)}`,
            },
          ]);
        }
      }, 3600);

      setTimeout(() => {
        if (c3Amt > 0) {
          setTujenganeContributorsList((prev) => [...prev, { id: "p3", name: "Sarah W.", amount: c3Amt }]);
        }
        setNyotaMatchMessages((prev) => [
          ...prev,
          {
            id: `tuj-cfull-${Date.now()}`,
            sender: "nyota",
            text: `🎉 Contributor Sarah W. joined with $${c3Amt.toFixed(2)} contribution!\n\n✓ Phase 1 Complete: Pool Target of $${groupTargetStake.toFixed(2)} fully raised across flexible contributors!\n• Every contributor holds a proportional ownership share of potential winnings.`,
          },
        ]);
      }, 5000);

      setTimeout(() => {
        setTujenganeOpponent1Matched(true);
        setNyotaMatchMessages((prev) => [
          ...prev,
          {
            id: `tuj-opp1-${Date.now()}`,
            sender: "nyota",
            text: `⚡ Phase 2: Searching for opposing betting sides...\n\n✓ Opponent Side 1 Matched: ${opp1Name} ($${opp1Stake.toFixed(2)} required stake locked)`,
          },
        ]);
      }, 6400);

      setTimeout(() => {
        setTujenganeOpponent2Matched(true);
        setNyotaMatchStatus("matched");
        setNyotaMatchMessages((prev) => [
          ...prev,
          {
            id: `tuj-opp2-${Date.now()}`,
            sender: "nyota",
            text: `🎉 Opponent Side 2 Matched: ${opp2Name} ($${opp2Stake.toFixed(2)} required stake locked)!`,
            tujenganeVerifiedCard: true,
            quickReplies: ["Merge Escrow", "Continue Searching", "Cancel"],
          },
        ]);
      }, 7800);
    }
  };

  const initiateNyotaMessenger = () => {
    setEscrowModalStage("nyota_messenger");
    if (escrowEngineTab === "tujengane") {
      setNyotaMatchStatus("searching");
      triggerTujenganeNyotaMatchmaking();
    } else if (escrowEngineTab === "three_way") {
      setNyotaMatchStatus("searching");
      setNyotaMatchMessages([
        {
          id: "m-1",
          sender: "nyota",
          text: `🤖 Hello! I received your 3-Way Challenge contract for ${ratioMatchName || "Match"}.\n\nSearching for 2 compatible participants on this event...`,
        },
      ]);
      triggerThreeWayNyotaMatchmaking();
    } else {
      setNyotaMatchStatus("questions");
      setNyotaScopeIndex(0);
      setNyotaScopeAnswers({
        friends: true,
        clan: true,
        public: true,
        similar: true,
        verified: true,
      });
      setNyotaMatchMessages([
        {
          id: "m-1",
          sender: "nyota",
          text: "Hello! I have received your Open Challenge.\n\nI will help you find the best opponent.",
        },
        {
          id: "m-2",
          sender: "nyota",
          text: "Let's refine your search scope. Should I search among Friends?",
          quickReplies: ["Yes", "No"],
        },
      ]);
    }
  };

  const handleNyotaUserAnswer = (answerText: string) => {
    if (!answerText.trim()) return;
    const isYes = answerText.toLowerCase().includes("yes") || answerText.toLowerCase().includes("y");

    const currentKey = scopeQuestionsList[nyotaScopeIndex]?.key as keyof typeof nyotaScopeAnswers;
    const updatedAnswers = { ...nyotaScopeAnswers };
    if (currentKey) {
      updatedAnswers[currentKey] = isYes;
      setNyotaScopeAnswers(updatedAnswers);
    }

    const userMsg = { id: `u-${Date.now()}`, sender: "user" as const, text: answerText };
    const nextIndex = nyotaScopeIndex + 1;
    setNyotaScopeIndex(nextIndex);
    setNyotaChatInput("");

    if (nextIndex < scopeQuestionsList.length) {
      const nextQ = scopeQuestionsList[nextIndex];
      const nyotaMsg = {
        id: `n-${Date.now()}`,
        sender: "nyota" as const,
        text: nextQ.question,
        quickReplies: ["Yes", "No"],
      };
      setNyotaMatchMessages((prev) => [...prev, userMsg, nyotaMsg]);
    } else {
      const activeScopes = scopeQuestionsList
        .filter((q) => updatedAnswers[q.key as keyof typeof updatedAnswers])
        .map((q) => q.label);

      const summaryText =
        activeScopes.length > 0
          ? `Great. I will search ${activeScopes.join(" and ")} only.`
          : "Understood. I will search the entire global market.";

      const summaryMsg = {
        id: `n-${Date.now()}`,
        sender: "nyota" as const,
        text: summaryText,
      };

      setNyotaMatchMessages((prev) => [...prev, userMsg, summaryMsg]);
      setNyotaMatchStatus("searching");

      triggerNyotaMatchmakingSequence();
    }
  };

  const triggerNyotaMatchmakingSequence = () => {
    const steps = [
      "Searching...",
      "Compatible player found.",
      "Wallet verified.",
      "Stake requirement matched.",
      "Challenge accepted.",
    ];

    steps.forEach((stepText, idx) => {
      setTimeout(() => {
        setNyotaMatchMessages((prev) => [
          ...prev,
          {
            id: `search-${idx}-${Date.now()}`,
            sender: "nyota",
            text: stepText,
          },
        ]);
      }, (idx + 1) * 700);
    });

    setTimeout(() => {
      setNyotaMatchStatus("matched");
      setNyotaMatchMessages((prev) => [
        ...prev,
        {
          id: `match-${Date.now()}`,
          sender: "nyota",
          text: "I found a compatible opponent.",
          matchCard: true,
          quickReplies: ["Merge Escrow", "Continue Searching", "Cancel Search"],
        },
      ]);
    }, (steps.length + 1) * 700);
  };

  const handleNyotaMatchAction = (action: string) => {
    if (action === "Merge Escrow" || action === "Initialize Escrow") {
      const userMsg = { id: `u-${Date.now()}`, sender: "user" as const, text: action };
      const confirmMsgs = [
        { id: `c-1-${Date.now()}`, sender: "nyota" as const, text: "Escrow initialized successfully." },
        { id: `c-2-${Date.now()}`, sender: "nyota" as const, text: "All 3 participant stakes locked in Escrow." },
        { id: `c-3-${Date.now()}`, sender: "nyota" as const, text: "Challenge is now active!" },
      ];
      setNyotaMatchMessages((prev) => [...prev, userMsg, ...confirmMsgs]);
      setNyotaMatchStatus("merged");

      const generatedReceiptNum = `${Math.floor(100000 + Math.random() * 900000)}`;
      setReceiptNumber(generatedReceiptNum);

      setTimeout(() => {
        setEscrowModalStage("receipt");
      }, 1000);
    } else if (action === "Continue Searching") {
      const userMsg = { id: `u-${Date.now()}`, sender: "user" as const, text: "Continue Searching" };
      const resMsg = { id: `n-${Date.now()}`, sender: "nyota" as const, text: "Resuming search for another compatible opponent..." };
      setNyotaMatchMessages((prev) => [...prev, userMsg, resMsg]);
      setNyotaMatchStatus("searching");
      if (escrowEngineTab === "tujengane") {
        triggerTujenganeNyotaMatchmaking();
      } else if (escrowEngineTab === "three_way") {
        triggerThreeWayNyotaMatchmaking();
      } else {
        triggerNyotaMatchmakingSequence();
      }
    } else if (action === "Cancel Search" || action === "Cancel") {
      setShowEscrowCalculationModal(false);
      setTimeout(() => setEscrowModalStage("calculation"), 300);
    }
  };

  const handleSendPrivateChallenge = () => {
    if (!selectedPrivateFriend) return;
    if (privateChallengeMode === "Forced" && !privateForcedOutcome) return;

    const expirySecs = privateChallengeExpiry === "15m" ? 900 : privateChallengeExpiry === "1h" ? 3600 : 86400;
    setPrivateChallengeTimeLeft(expirySecs);
    setPrivateChallengeStatus("sent");
    setPrivateChallengeViewMode("creator");

    const modeText = privateChallengeMode === "Forced" && privateForcedOutcome
      ? ` (Forced on ${privateForcedOutcome === "1" ? (ratioMatch?.homeTeam || "Home") : privateForcedOutcome === "2" ? (ratioMatch?.awayTeam || "Away") : "Draw"})`
      : "";

    // Deliver real-time notification to selected friend
    setNotifications((prev) => [
      {
        id: `noti-${Date.now()}`,
        text: `📩 Private Challenge invitation sent to ${selectedPrivateFriend.displayName} (${selectedPrivateFriend.username})${modeText} for ${ratioMatchName || "Match"}!`,
        time: "Just now",
        read: false,
      },
      ...prev,
    ]);

    // Deliver inbox message to FaceLook Bet Messenger
    setMessengerChats((prev) => [
      {
        id: `msg-${Date.now()}`,
        name: selectedPrivateFriend.displayName,
        text: `📩 Private Challenge: ${ratioMatchName || "Match"} ($${getCentralCalculation().contractValue.toFixed(2)} contract value). Waiting for response...`,
        time: "Just now",
        color: "bg-purple-500",
        status: selectedPrivateFriend.status,
      },
      ...prev,
    ]);

    setEscrowModalStage("private_sent");
  };

  const handleFriendAcceptChallenge = () => {
    if (!selectedPrivateFriend) return;

    const reqStake = getCentralCalculation().opponentStake;
    if (selectedPrivateFriend.walletBalance < reqStake) {
      alert(`Wallet Verification Failed: ${selectedPrivateFriend.displayName} has insufficient balance ($${selectedPrivateFriend.walletBalance.toFixed(2)}) for required stake ($${reqStake.toFixed(2)}).`);
      return;
    }

    setPrivateChallengeStatus("accepted");

    setNotifications((prev) => [
      {
        id: `noti-${Date.now()}`,
        text: `🎉 Private Challenge accepted by ${selectedPrivateFriend.displayName} (@${selectedPrivateFriend.username})! Wallet verified, both stakes locked in escrow ($${getCentralCalculation().escrowLockValue.toFixed(2)} total).`,
        time: "Just now",
        read: false,
      },
      ...prev,
    ]);

    const generatedReceiptNum = `${Math.floor(100000 + Math.random() * 900000)}`;
    setReceiptNumber(generatedReceiptNum);

    setEscrowModalStage("receipt");
  };

  const handleFriendDeclineChallenge = () => {
    setPrivateChallengeStatus("declined");

    setNotifications((prev) => [
      {
        id: `noti-${Date.now()}`,
        text: `❌ Your private challenge to ${selectedPrivateFriend?.displayName || "friend"} was declined.`,
        time: "Just now",
        read: false,
      },
      ...prev,
    ]);

    setEscrowModalStage("private_declined");
  };

  const handleFriendExpireChallenge = () => {
    setPrivateChallengeStatus("expired");

    setNotifications((prev) => [
      {
        id: `noti-${Date.now()}`,
        text: `⏰ Your private challenge invitation to ${selectedPrivateFriend?.displayName || "friend"} expired without a response.`,
        time: "Just now",
        read: false,
      },
      ...prev,
    ]);

    setEscrowModalStage("private_expired");
  };

  const downloadTextReceipt = () => {
    const calc = getCentralCalculation();
    const opponentTeam = ratioOddName === "1" ? (ratioMatch?.awayTeam || "Away") : (ratioMatch?.homeTeam || "Home");
    const receiptContent = `===================================================
             ESCROW CONTRACT RECEIPT               
===================================================
Receipt Number:               ESC-2026-${receiptNumber || "894201"}-NYOTA
Date & Time:                  ${new Date().toLocaleString()}
Match:                        ${ratioMatchName}
Prediction:                   ${ratioOddName === "1" ? ratioMatch?.homeTeam : ratioOddName === "2" ? ratioMatch?.awayTeam : "Draw"} @${ratioOddValue.toFixed(2)}
Challenge Type:               ${escrowEngineTab === "mimi" ? mimiChallengeType + " Challenge" : escrowEngineTab === "three_way" ? "Three-Way Challenge" : "Tujengane Challenge"}
Contract Value:               $${calc.contractValue.toFixed(2)}
Your Required Stake:          $${calc.userStake.toFixed(2)}
Opponent Required Stake:      $${calc.opponentStake.toFixed(2)}
Escrow Fee:                   $${calc.escrowFee.toFixed(2)}
Fee Per Player:               $${calc.feePerParticipant.toFixed(2)}
Total Escrow Locked:          $${calc.escrowLockValue.toFixed(2)}
Escrow Status:                ACTIVE & LOCKED
Opponent ID:                  OPP-${Math.floor(10000 + Math.random() * 90000)}-VERIFIED (${opponentTeam})
Nyota Match Confirmation ID:  NYOTA-MATCH-${Math.floor(100000 + Math.random() * 900000)}
===================================================
Thank you for using Nyota AI Escrow Engine!
===================================================`;

    const blob = new Blob([receiptContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Escrow_Receipt_ESC-2026-${receiptNumber || "894201"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const [openAudience, setOpenAudience] = useState({
    friends: true,
    clan: true,
    public: true,
    similar: true,
    verified: true
  });
  const [mimiChallengeType, setMimiChallengeType] = useState<"Open" | "Forced" | "Private">("Open");
  const [mimiPrivateFriend, setMimiPrivateFriend] = useState<string | null>(null);
  const [mimiFriendSearch, setMimiFriendSearch] = useState("");
  const [collabTargetStake, setCollabTargetStake] = useState<number>(100);
  const [collabCreatorStake, setCollabCreatorStake] = useState<number>(20);
  const [collabNumOpponents, setCollabNumOpponents] = useState<1 | 2>(1);
  const [collabTargetMode, setCollabTargetMode] = useState<"proposed" | "op">("proposed");
  const [collabProposedOpponentSelection, setCollabProposedOpponentSelection] = useState<string>("");
  const [collabFormulationMode, setCollabFormulationMode] = useState<"single_side" | "total_pool">("total_pool");
  const [collabOpponentStakeInput, setCollabOpponentStakeInput] = useState<number | undefined>(undefined);
  const [interactiveCollabJoinOption, setInteractiveCollabJoinOption] = useState<string>("");
  const [interactiveJoinerName, setInteractiveJoinerName] = useState<string>("");
  const [collabInviteName, setCollabInviteName] = useState<string>("");
  const [collabInviteStake, setCollabInviteStake] = useState<number>(20);
  const [collabInviteFrom, setCollabInviteFrom] = useState<string>("");

  const [showCollabConfirmModal, setShowCollabConfirmModal] = useState(false);
  const [pendingCollabConfig, setPendingCollabConfig] = useState<any | null>(null);

  const [collabAddFundsModalOpen, setCollabAddFundsModalOpen] = useState(false);
  const [selectedCollabForAddFunds, setSelectedCollabForAddFunds] = useState<{ collabId: string; amount: number } | null>(null);

  const [collabReadyToMerge, setCollabReadyToMerge] = useState<boolean>(false);
  const [collabMergeTolerance, setCollabMergeTolerance] = useState<number>(0);
  
  // Tujengane AI States
  const [tujenganeNyotaStatus, setTujenganeNyotaStatus] = useState<"Connecting" | "Online" | "Offline">("Connecting");
  const [tujenganeAutoMatch, setTujenganeAutoMatch] = useState<boolean>(true);
  const [tujenganeChallengeRules, setTujenganeChallengeRules] = useState<"Open" | "Selective" | "Forced" | "Three-Way">("Open");
  const [isTujenganeSearching, setIsTujenganeSearching] = useState<boolean>(false);
  const [tujenganeSearchText, setTujenganeSearchText] = useState<string>("Searching Worldwide...");
  const [tujenganeMergeCandidates, setTujenganeMergeCandidates] = useState<any[]>([]);
  const [tujenganeAICandidates, setTujenganeAICandidates] = useState<number>(18);
  const [tujenganeLiquidityScore, setTujenganeLiquidityScore] = useState<number>(97);
  const [tujenganeCommunityInterest, setTujenganeCommunityInterest] = useState<string>("Very High");
  const [tujenganeEstTime, setTujenganeEstTime] = useState<string>("2 Minutes");
  const [tujenganeRecContrib, setTujenganeRecContrib] = useState<number>(10);
  const [showTujenganeContractPreview, setShowTujenganeContractPreview] = useState<boolean>(false);
  const [tujenganeCreatorPrediction, setTujenganeCreatorPrediction] = useState<"1" | "X" | "2">("1");
  const [tujenganeMembersJoined, setTujenganeMembersJoined] = useState<number>(1);
  const [tujenganeTargetContributors, setTujenganeTargetContributors] = useState<number>(5);
  const [tujenganePoolNyotaStatus, setTujenganePoolNyotaStatus] = useState<"idle" | "searching" | "found_contributors" | "found_opp1" | "found_all" | "locking" | "locked">("idle");
  const [tujenganeOpp1Joined, setTujenganeOpp1Joined] = useState(false);
  const [tujenganeOpp2Joined, setTujenganeOpp2Joined] = useState(false);

  // 3-Way Challenge States
  const [threeWayParticipant1Joined, setThreeWayParticipant1Joined] = useState(true); // Creator is always joined
  const [threeWayParticipant2Joined, setThreeWayParticipant2Joined] = useState(false);
  const [threeWayParticipant3Joined, setThreeWayParticipant3Joined] = useState(false);
  const [threeWayNyotaStatus, setThreeWayNyotaStatus] = useState<"idle" | "searching" | "found_one" | "found_all" | "locking" | "locked">("idle");
  const [threeWayCreatorPrediction, setThreeWayCreatorPrediction] = useState<"1" | "X" | "2">("1");

  // Collaboration Pools tab interaction states
  const [collabContribAmountModalOpen, setCollabContribAmountModalOpen] = useState(false);
  const [selectedCollabForContribInput, setSelectedCollabForContribInput] = useState<any | null>(null);
  const [collabContribAmount, setCollabContribAmount] = useState<number>(20);
  const [showCollabDebitConfirm, setShowCollabDebitConfirm] = useState(false);

  const [collabChallenges, setCollabChallenges] = useState<Array<{
    id: string;
    matchName: string;
    match: Match;
    prediction: string;
    odds: number;
    targetTotalStake: number;
    currentTotalStake: number;
    creator: string;
    contributors: Array<{ name: string; stake: number }>;
    status: "collecting" | "ready" | "posted" | "matched" | "resolved";
    numOpponents: number;
    opponents: Array<{ name: string; selection: string; selectionSymbol?: string; stake: number }>;
    targetMode?: "proposed" | "op";
    selectedOutcome?: "1" | "X" | "2";
    formulationMode?: "single_side" | "total_pool";
    targetStakeCreator?: number;
    currentStakeCreator?: number;
    opponentsTargets?: Array<{ symbol: string; label: string; targetStake: number; currentStake: number; odds: number }>;
    repostedAsProposed?: boolean;
    remainingProposedMarket?: string;
    invites?: Array<{ id: string; name: string; invitedBy: string; stake: number; status: "pending" | "accepted" | "declined" }>;
    winningsDisbursed?: boolean;
    disbursementReport?: Array<{ name: string; payout: number; sharePercent: number }>;
    readyToMerge?: boolean;
  }>>([
    {
      id: "collab-1",
      matchName: "Man City vs Arsenal",
      match: {
        id: "m-1",
        homeTeam: "Man City",
        awayTeam: "Arsenal",
        time: "Live • 67'",
        score: "1 - 1",
        odds: { "1": 2.10, "X": 3.20, "2": 3.40 }
      } as any,
      prediction: "Home (Man City)",
      odds: 2.10,
      targetTotalStake: 100,
      currentTotalStake: 70,
      creator: "Collins Dnego (You)",
      contributors: [
        { name: "Collins Dnego (You)", stake: 30 },
        { name: "Alex Smith", stake: 20 },
        { name: "John Doe", stake: 20 }
      ],
      invites: [
        { id: "inv-1", name: "David L.", invitedBy: "Alex Smith", stake: 15, status: "pending" },
        { id: "inv-2", name: "Sarah K.", invitedBy: "John Doe", stake: 15, status: "pending" }
      ],
      status: "collecting",
      numOpponents: 2,
      opponents: [],
      targetMode: "proposed",
      selectedOutcome: "1"
    },
    {
      id: "collab-2",
      matchName: "Chelsea vs Liverpool",
      match: {
        id: "m-2",
        homeTeam: "Chelsea",
        awayTeam: "Liverpool",
        time: "Live • 12'",
        score: "0 - 0",
        odds: { "1": 2.80, "X": 3.40, "2": 2.20 }
      } as any,
      prediction: "Away (Liverpool)",
      odds: 2.20,
      targetTotalStake: 120,
      currentTotalStake: 120,
      creator: "Collins Dnego (You)",
      contributors: [
        { name: "Collins Dnego (You)", stake: 60 },
        { name: "Marcus_88", stake: 40 },
        { name: "Linet K.", stake: 20 }
      ],
      status: "posted",
      numOpponents: 1,
      opponents: [],
      targetMode: "proposed",
      selectedOutcome: "2"
    }
  ]);
  const [selectedCollabForModal, setSelectedCollabForModal] = useState<any | null>(null);
  const [collabModalOpen, setCollabModalOpen] = useState(false);
  const [joinOpponentModalOpen, setJoinOpponentModalOpen] = useState(false);
  const [selectedCollabForJoin, setSelectedCollabForJoin] = useState<any | null>(null);

  // Game Hub custom Hamburger Menu states
  const [isHubMenuOpen, setIsHubMenuOpen] = useState(false);
  const [hubActiveFilter, setHubActiveFilter] = useState<string>("all");
  const [hubExpandedCountry, setHubExpandedCountry] = useState<string | null>(null);
  const [hubExpandedLeagueRanking, setHubExpandedLeagueRanking] = useState<string | null>(null);

  // Invite Notifications State for Game Hub
  const [challengeInvites, setChallengeInvites] = useState<Array<{
    id: string;
    challengerName: string;
    challengerAvatar: string;
    matchName: string;
    backedOption: string;
    odds: { "1": number; "X": number; "2": number };
    proposedOppMarket: string;
    liabilityAmount: number;
    totalPool: number;
    proposerPrediction: string;
    isProposedMarket: boolean;
    status: "pending" | "accepted" | "declined";
  }>>([
    {
      id: "invite-1",
      challengerName: "Collins Dnego",
      challengerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2",
      matchName: "A.F.C Leopards vs Gor Mahia",
      backedOption: "1",
      odds: { "1": 2.10, "X": 3.20, "2": 2.90 },
      proposedOppMarket: "Gor Mahia Win (2) or Draw (X)",
      liabilityAmount: 25.00,
      totalPool: 50.00,
      proposerPrediction: "Home Win (1)",
      isProposedMarket: true,
      status: "pending"
    },
    {
      id: "invite-2",
      challengerName: "Zephaniah Mwangi",
      challengerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zephaniah&backgroundColor=a855f7",
      matchName: "Tusker FC vs Bandari",
      backedOption: "X",
      odds: { "1": 2.40, "X": 3.00, "2": 2.50 },
      proposedOppMarket: "Tusker FC Win (1) or Bandari Win (2)",
      liabilityAmount: 110.00,
      totalPool: 220.00,
      proposerPrediction: "Draw Game (X)",
      isProposedMarket: true,
      status: "pending"
    },
    {
      id: "invite-3",
      challengerName: "Collo Dnego",
      challengerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collo&backgroundColor=059669",
      matchName: "Posta Rangers vs Kakamega Homeboyz",
      backedOption: "2",
      odds: { "1": 1.95, "X": 3.10, "2": 3.30 },
      proposedOppMarket: "Posta Rangers Win (1) or Draw (X)",
      liabilityAmount: 40.00,
      totalPool: 80.00,
      proposerPrediction: "Away Win (2)",
      isProposedMarket: false,
      status: "pending"
    }
  ]);

  const [selectedInviteForModal, setSelectedInviteForModal] = useState<any | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleAcceptInvite = (invite: any) => {
    const taxRate = 0.02;
    const stake = invite.liabilityAmount;
    const tax = invite.totalPool * taxRate;
    const totalRequired = stake + tax;

    if (walletBalance < totalRequired) {
      alert(`⚠️ Inadequate Wallet Credits! You need $${totalRequired.toFixed(2)} ($${stake.toFixed(2)} stake matching value + $${tax.toFixed(2)} Escrow Tax calculated at 2.0% of full pool hold) but only have $${walletBalance.toFixed(2)}. Consider depositing credits or accepting cheaper challenges.`);
      return;
    }

    // Deduct and update wallet
    setWalletBalance(prev => prev - totalRequired);

    // Create the transaction logs
    const newTxStake = {
      id: `tx-accept-${Date.now()}`,
      type: "bet_stake" as const,
      amount: stake,
      time: "Just now",
      target: `Matched Escrow: @${invite.challengerName} on ${invite.matchName} (Custom counter odds ratio locked)`
    };

    const newTxTax = {
      id: `tx-tax-${Date.now()}`,
      type: "withdraw" as const,
      amount: tax,
      time: "Just now",
      target: `Org. Escrow Tax (2.0% full pool hold)`
    };

    setTransactions(prev => [newTxStake, newTxTax, ...prev]);

    // Update status in challengeInvites list
    setChallengeInvites(prev => prev.map(inv => {
      if (inv.id === invite.id) {
        return { ...inv, status: "accepted" as const };
      }
      return inv;
    }));

    alert(`🎉 Success! Challenge match contract locked in Escrow Pool. Locked $${totalRequired.toFixed(2)} with peer @${invite.challengerName} for matchup ${invite.matchName}.`);

    // Clean states and close
    setIsInviteModalOpen(false);
    setSelectedInviteForModal(null);
  };

  const handleDeclineInvite = (invite: any) => {
    setChallengeInvites(prev => prev.map(inv => {
      if (inv.id === invite.id) {
        return { ...inv, status: "declined" as const };
      }
      return inv;
    }));

    alert(`✕ Declined challenge invite from @${invite.challengerName} successfully.`);

    setIsInviteModalOpen(false);
    setSelectedInviteForModal(null);
  };

  // Friends list with live activities
  const [friendsList] = useState<Friend[]>([
    { id: "fr-1", name: "David T.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=ff5722", status: "online", mutualFriends: 12 },
    { id: "fr-2", name: "Sarah L.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=4caf50", status: "online", mutualFriends: 8 },
    { id: "fr-3", name: "Michael B.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=e91e63", status: "idle", mutualFriends: 15 },
    { id: "fr-4", name: "Emma W.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=3f51b5", status: "offline", mutualFriends: 3 }
  ]);

  // Unified community feed posts has state for likes/comments
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);

  // League Rankings/Standings data for the countries/leagues directory dropdowns
  const leagueStandings: Record<string, Array<{ pos: number; team: string; played: number; points: number; form: string[] }>> = {
    "English Premier League": [
      { pos: 1, team: "Arsenal", played: 34, points: 77, form: ["W", "W", "L", "W", "W"] },
      { pos: 2, team: "Manchester City", played: 33, points: 76, form: ["W", "W", "W", "W", "W"] },
      { pos: 3, team: "Liverpool", played: 34, points: 74, form: ["D", "L", "W", "D", "W"] },
      { pos: 4, team: "Manchester United", played: 34, points: 68, form: ["W", "W", "W", "D", "L"] },
      { pos: 5, team: "Chelsea", played: 34, points: 64, form: ["W", "L", "W", "W", "D"] },
    ],
    "Spanish La Liga": [
      { pos: 1, team: "Real Madrid", played: 34, points: 84, form: ["W", "W", "W", "W", "W"] },
      { pos: 2, team: "Barcelona", played: 34, points: 73, form: ["W", "L", "W", "L", "W"] },
      { pos: 3, team: "Girona", played: 34, points: 71, form: ["W", "W", "W", "W", "L"] },
      { pos: 4, team: "Atletico Madrid", played: 34, points: 64, form: ["W", "W", "L", "W", "W"] },
    ],
    "Kenya Premier League (Ligi Bigi)": [
      { pos: 1, team: "Gor Mahia", played: 28, points: 60, form: ["W", "W", "D", "W", "W"] },
      { pos: 2, team: "Kenya Police", played: 28, points: 51, form: ["W", "D", "W", "W", "D"] },
      { pos: 3, team: "Tusker FC", played: 28, points: 49, form: ["L", "W", "W", "L", "W"] },
      { pos: 4, team: "AFC Leopards", played: 28, points: 47, form: ["W", "W", "W", "D", "D"] },
    ],
    "NBA Playoffs": [
      { pos: 1, team: "Boston Celtics", played: 82, points: 64, form: ["W", "W", "W", "L", "W"] },
      { pos: 2, team: "Dallas Mavericks", played: 82, points: 50, form: ["W", "W", "W", "W", "L"] },
      { pos: 3, team: "New York Knicks", played: 82, points: 50, form: ["W", "W", "L", "W", "L"] },
      { pos: 4, team: "LA Lakers", played: 82, points: 47, form: ["L", "L", "W", "L", "W"] },
    ],
    "German Bundesliga": [
      { pos: 1, team: "Bayer Leverkusen", played: 32, points: 84, form: ["W", "D", "D", "W", "W"] },
      { pos: 2, team: "Bayern Munich", played: 32, points: 69, form: ["L", "W", "W", "W", "L"] },
      { pos: 3, team: "VfB Stuttgart", played: 32, points: 67, form: ["W", "L", "D", "W", "W"] },
    ],
    "Italian Serie A": [
      { pos: 1, team: "Inter Milan", played: 34, points: 89, form: ["W", "W", "D", "W", "W"] },
      { pos: 2, team: "AC Milan", played: 34, points: 70, form: ["D", "L", "D", "L", "W"] },
      { pos: 3, team: "Juventus", played: 34, points: 65, form: ["D", "D", "D", "W", "D"] },
    ]
  };

  const getCountryForLeague = (league: string): string => {
    const l = (league || "").toLowerCase();
    if (l.includes("english") || l.includes("premier league") || l.includes("manchester") || l.includes("chelsea") || l.includes("arsenal")) {
      if (l.includes("kenya")) return "Kenya";
      return "England";
    }
    if (l.includes("la liga") || l.includes("spanish") || l.includes("real madrid") || l.includes("barcelona") || l.includes("girona")) return "Spain";
    if (l.includes("serie a") || l.includes("italian") || l.includes("inter milan") || l.includes("juventus")) return "Italy";
    if (l.includes("bundesliga") || l.includes("german") || l.includes("bayern") || l.includes("leverkusen")) return "Germany";
    if (l.includes("kenya") || l.includes("ligi bigi") || l.includes("kpl") || l.includes("gor mahia") || l.includes("afc leopard")) return "Kenya";
    if (l.includes("nba") || l.includes("playoff") || l.includes("basketball") || l.includes("celtics") || l.includes("lakers") || l.includes("mavericks")) return "USA";
    return "International";
  };

  // Helper computes the matches that qualify under active Filters
  const getFilteredMatches = () => {
    return matches.filter((m) => {
      if (hubActiveFilter === "highlights") {
        return m.flActiveCount > 1300; // Match count representing our active stakers threshold
      }
      if (hubActiveFilter === "upcoming") {
        return m.status === "UPCOMING";
      }
      if (hubActiveFilter === "live") {
        return m.status === "LIVE";
      }
      if (hubActiveFilter.startsWith("league:")) {
        const targetLeague = hubActiveFilter.replace("league:", "");
        return m.league && m.league.toLowerCase().trim() === targetLeague.toLowerCase().trim();
      }
      if (hubActiveFilter.startsWith("country:")) {
        const targetCountry = hubActiveFilter.replace("country:", "");
        return getCountryForLeague(m.league).toLowerCase().trim() === targetCountry.toLowerCase().trim();
      }
      
      // Default: show currently selected sport tabs in standard Soccer, Basketball...
      const sportKey = selectedHubSport === "Soccer" ? "Football" : selectedHubSport;
      return m.sport?.toLowerCase() === sportKey.toLowerCase() || m.sport === sportKey;
    });
  };

  // Fetch real-world up-to-the-minute games and upcoming matches
  const fetchRealSportsGames = async () => {
    setIsFeedLoading(true);
    try {
      const response = await fetch("/api/sports-feed?league=Premier League & Champions League & World Cup");
      const data = await response.json();
      if (data && data.matches) {
        setMatches(data.matches);
        // Default the watching game target to the first active live match if not selected yet
        const liveMatch = data.matches.find((m: Match) => m.status === "LIVE");
        if (liveMatch) {
          setWatchSelectedMatch(liveMatch);
        }
      }
    } catch (err) {
      console.error("Error loading sports games:", err);
    } finally {
      setIsFeedLoading(false);
    }
  };

  // Load social posts feed
  const fetchSocialPostsFeed = async () => {
    try {
      const response = await fetch("/api/generate-posts");
      const data = await response.json();
      if (data && data.posts) {
        setFeedPosts(data.posts);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRealSportsGames();
    fetchSocialPostsFeed();
  }, []);

  // Theme support: React reactive system with automatic state synchronization and DOM manipulation
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.setAttribute("data-theme", "dark");
      html.classList.add("dark");
    } else {
      html.setAttribute("data-theme", "light");
      html.classList.remove("dark");
    }
    try {
      localStorage.setItem("lookupto_dark_mode", String(isDarkMode));
    } catch (e) {
      // safe fallback
    }
  }, [isDarkMode]);

  // Tujengane AI Simulation Engine
  useEffect(() => {
    // 1. Simulate Nyota Connection
    const timer = setTimeout(() => {
      setTujenganeNyotaStatus("Online");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 2. Real-time recalculation of liquidity, candidates and interest
    // whenever inputs change.
    if (escrowEngineTab === "tujengane" && ratioOddValue > 0) {
      const baseLiquidity = Math.max(10, 100 - (collabTargetStake / 20) + (ratioOddValue > 2 ? 15 : 0));
      const normalizedScore = Math.min(99, Math.max(30, Math.round(baseLiquidity)));
      setTujenganeLiquidityScore(normalizedScore);
      
      let estMins = Math.max(1, Math.round(collabTargetStake / 35));
      if (tujenganeChallengeRules === "Open") estMins = Math.max(1, estMins - 2);
      if (tujenganeVisibility === "Global") estMins = Math.max(1, estMins - 1);
      setTujenganeEstTime(`${estMins} Minutes`);

      setTujenganeAICandidates(Math.round(normalizedScore * 0.4));
      
      const interestMap = ["Low", "Moderate", "High", "Very High"];
      const interestIdx = Math.min(3, Math.floor(normalizedScore / 25));
      setTujenganeCommunityInterest(interestMap[interestIdx]);

      // Smart Merge recommendations
      if (tujenganeAutoMatch) {
        setTujenganeMergeCandidates([
           { id: "m-1", pool: "Chelsea 1v1", compatibility: 94, missing: 15, time: "2 min" },
           { id: "m-2", pool: "Top Goalscorer", compatibility: 87, missing: 25, time: "5 min" },
           { id: "m-3", pool: "First Half Goals", compatibility: 78, missing: 5, time: "1 min" }
        ]);
      } else {
        setTujenganeMergeCandidates([]);
      }
    }
  }, [ratioOddValue, collabTargetStake, collabCreatorStake, tujenganeChallengeRules, tujenganeVisibility, tujenganeAutoMatch, escrowEngineTab]);

  // Synchronize contract value and stakes between different engines
  useEffect(() => {
    if ((escrowEngineTab === "mimi" || escrowEngineTab === "three_way") && calculatorMode !== "contract") {
      setCalculatorMode("contract");
      return;
    }
    const calc = getCentralCalculation();
    if (calculatorMode === "stake") {
      if (Math.abs(collabCreatorStake - calculatorUserStakeInput) > 0.01) {
        setCollabCreatorStake(calculatorUserStakeInput);
      }
      if (Math.abs(ratioTotalPool - calc.contractValue) > 0.01) {
        setRatioTotalPool(calc.contractValue);
      }
      if (Math.abs(collabTargetStake - calc.contractValue) > 0.01) {
        setCollabTargetStake(calc.contractValue);
      }
    } else {
      const currentContractVal = escrowEngineTab === "tujengane" ? collabTargetStake : ratioTotalPool;
      if (ratioTotalPool !== currentContractVal) {
        setRatioTotalPool(currentContractVal);
      }
      if (collabTargetStake !== currentContractVal) {
        setCollabTargetStake(currentContractVal);
      }
      if (Math.abs(calculatorUserStakeInput - calc.userStake) > 0.01) {
        setCalculatorUserStakeInput(calc.userStake);
      }
      if (Math.abs(collabCreatorStake - calc.userStake) > 0.01) {
        setCollabCreatorStake(calc.userStake);
      }
    }
  }, [calculatorMode, calculatorUserStakeInput, ratioTotalPool, collabTargetStake, ratioOddValue, escrowEngineTab]);

  useEffect(() => {
    // 3. Search text rotating
    let searchTimer: any;
    if (isTujenganeSearching || tujenganeAutoMatch) {
      let step = 0;
      const texts = ["Searching Worldwide...", "Searching Friends...", "Searching Community...", "Compatible Pools Found!"];
      searchTimer = setInterval(() => {
        setTujenganeSearchText(texts[step % texts.length]);
        step++;
      }, 3000);
    } else {
      setTujenganeSearchText("Search Paused");
    }
    return () => clearInterval(searchTimer);
  }, [isTujenganeSearching, tujenganeAutoMatch]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Auth unlock callback
  const handleAuthSuccess = () => {
    if (authReturnAction === "wallet") {
      setWalletModalOpen(true);
    } else if (authReturnAction === "interactions") {
      setInteractionsUnlocked(true);
    }
  };

  // Trigger PIN modal
  const triggerPinCheck = (action: "wallet" | "interactions") => {
    if (action === "interactions" && interactionsUnlocked) {
      return;
    }
    setAuthReturnAction(action);
    setPasswordModalOpen(true);
  };

  // Create Group Submit handler
  const handleCreateGroupSubmit = () => {
    if (!newGroupName.trim()) {
      return;
    }

    const defaultCover = "https://images.unsplash.com/photo-1540747737956-37872404a82f?q=80&w=1200";
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newGroupName)}&backgroundColor=3b82f6`;
    const created: Group = {
      id: "g-" + Date.now(),
      name: newGroupName.trim(),
      category: newGroupCategory,
      description: newGroupDescription.trim() || "A customized private sports betting syndicate club with matched liabilities.",
      coverImage: newGroupCoverImage.trim() || defaultCover,
      avatar: newGroupAvatar.trim() || defaultAvatar,
      membersCount: 1, // You are the founder
      posts: []
    };

    setGroups([...groups, created]);
    setActiveGroupId(created.id);
    setActiveTab("groups");
    setCreateGroupModalOpen(false);

    // Reset fields
    setNewGroupName("");
    setNewGroupCategory("Local Leagues");
    setNewGroupDescription("");
    setNewGroupCoverImage("");
    setNewGroupAvatar("");

    setNotifications(prev => [
      { id: `noti-${Date.now()}`, text: `Successfully created and launched group: "${created.name}"`, time: "Just now", read: false },
      ...prev
    ]);
  };

  // Select an opponent for 1v1 lookupto
  const handleSelectOpponent = (fr: Friend) => {
    if (!interactionsUnlocked) {
      triggerPinCheck("interactions");
      return;
    }
    setRatioOpponent(fr);
    setComposerText(`Hey @${fr.name}, I am challenging you to a ratio bet! Let's lock in.`);
  };

  // Select Live Odd selection triggering P2P calculation immediately
  const handleSelectOdd = (m: Match, oddName: string, oddValue: number) => {
    if (marketChangeChallengeData) {
      // Intercept and handle market change request!
      setRequestedMarketInput(`${oddName} @${oddValue.toFixed(2)}`);
      setChallengeWindowData(marketChangeChallengeData);
      setIsRequestingChange(true);
      setChallengeWindowOpen(true);
      setMarketChangeChallengeData(null);
      return;
    }

    setRatioMatch(m);
    setRatioMatchName(`${m.homeTeam} vs ${m.awayTeam}`);
    setRatioOddName(oddName);
    setRatioOddValue(oddValue);
    setIsRatioEscrowCollapsed(false);
    
    // Choose selection mapping
    if (oddName === m.homeTeam) {
      setRatioSelection("1");
      setOpponentSelection("X");
    } else if (oddName === "Draw") {
      setRatioSelection("X");
      setOpponentSelection("2");
    } else {
      setRatioSelection("2");
      setOpponentSelection("1");
    }
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Post Open / Lookupto Bet Challenge dynamically on the social feed
  const handlePostBetChallenge = () => {
    if (!ratioMatchName || !ratioOddName || ratioOddValue <= 0) {
      alert("Please select a live match odd from the widget or Sports hub center first.");
      return;
    }

    const effectivePostToGlobal = (numOpponents === 2 && isWaitingMode) ? false : postToGlobal;

    const creatorRatio = getCreatorRatio();
    const creatorStake = getCreatorStake();
    const opponentLiability = getOpponentLiability();
    const marketingExpense = isSendoffEnabled ? ratioTotalPool * 0.01 : 0;
    const totalRequired = creatorStake + marketingExpense;

    if (walletBalance < totalRequired) {
      alert(`Your wallet balance ($${walletBalance.toFixed(2)}) is insufficient to cover your portion of this look-upto pool ($${creatorStake.toFixed(2)})${isSendoffEnabled ? ` and the 1% sendoff global marketing expense ($${marketingExpense.toFixed(2)}). Total: $${totalRequired.toFixed(2)}` : ''}. Fund your wallet first.`);
      return;
    }

    // Deduct creator stake and marketing fee, log transaction
    setWalletBalance((prev) => prev - totalRequired);
    const txId = `tx-${Date.now()}`;
    const newTxList: Array<{ id: string; type: "deposit" | "withdraw" | "bet_stake" | "bet_win"; amount: number; time: string; target: string }> = [
      {
        id: txId,
        type: "bet_stake",
        amount: creatorStake,
        time: "Just now",
        target: `Ratio Bet Slip: ${ratioMatchName}`,
      }
    ];

    if (marketingExpense > 0) {
      newTxList.push({
        id: `tx-mkt-${Date.now()}`,
        type: "withdraw" as const,
        amount: marketingExpense,
        time: "Just now",
        target: `1% Sendoff Global Channel Marketing Fee (${isSendoffEnabled ? sendoffsCount * 5 : 1} positions)`,
      });
    }

    setTransactions([...newTxList, ...transactions]);

    const newPost: Post = {
      id: `p-${Date.now()}`,
      author: "Collins Dnego (You)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2",
      time: "Just now",
      content: composerText || `Just proposed an open peer-to-peer challenge ticket! Calculated ratio-stakes holding. Who's backing my opponent?`,
      likes: 0,
      comments: [],
      isGlobalChannel: isSendoffEnabled && effectivePostToGlobal,
      betCard: {
        match: ratioMatchName,
        type: `Ratio Challenge: ${ratioOddName} (@${ratioOddValue.toFixed(2)})`,
        prediction: ratioOddName,
        odds: ratioOddValue,
        totalPool: ratioTotalPool,
        stakes: { creator: parseFloat(creatorStake.toFixed(2)), opponents: parseFloat(opponentLiability.toFixed(2)) },
        status: "OPEN",
      },
    };

    setFeedPosts([newPost, ...feedPosts]);
    setComposerText("");
    
    // Reset Engine variables
    setRatioMatchName("");
    setRatioOddName("");
    setRatioOddValue(0);
    setRatioOpponent(null);

    // Bounce home
    setActiveTab("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Post Challenge to Active Escrow Pools
  const handlePostChallengeToPools = () => {
    if (!ratioMatch || !ratioMatchName || !ratioOddName || ratioOddValue <= 0) {
      alert("Please select a live match odd from the widget or Sports hub center first.");
      return;
    }

    const creatorStake = getCreatorStake();
    const opponentLiability = getOpponentLiability();
    
    // Total creator required: they only need to lock their creatorStake (as the roller)
    if (walletBalance < creatorStake) {
      alert(`Your wallet balance ($${walletBalance.toFixed(2)}) is insufficient to cover your portion of this challenge ($${creatorStake.toFixed(2)}). Fund your wallet first.`);
      return;
    }

    // Deduct creator stake, log transaction
    setWalletBalance((prev) => prev - creatorStake);
    const txId = `tx-post-challenge-${Date.now()}`;
    const newTx = {
      id: txId,
      type: "bet_stake" as const,
      amount: creatorStake,
      time: "Just now",
      target: `Posted P2P Challenge: ${ratioMatchName} (Roller: You, Stake: $${creatorStake.toFixed(2)})`,
    };

    setTransactions([newTx, ...transactions]);

    // Create custom challenge
    const opponentSelName = opponentSelection === "1" ? "Home Win" : opponentSelection === "X" ? "Draw" : "Away Win";
    const opponentOddsVal = opponentSelection === "1" ? ratioMatch.odds["1"] : opponentSelection === "X" ? ratioMatch.odds.X : ratioMatch.odds["2"];

    const newChallenge = {
      id: `custom-pc-${Date.now()}`,
      user: "Collins Dnego (You)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2",
      stake: opponentLiability, // The opponent needs to match the liability
      prediction: `${ratioOddName} @${ratioOddValue.toFixed(2)}`,
      status: "LIVE" as const,
      matchName: ratioMatchName,
      isProposedMarket: numOpponents === 2 ? (isWaitingMode ? "waiting" : false) : (challengeTargetMode === "proposed"),
      proposedMarketToAcceptor: numOpponents === 2 ? undefined : (challengeTargetMode === "proposed" ? `${opponentSelName} @${opponentOddsVal.toFixed(2)}` : undefined),
      opponentsPossibleStakes: numOpponents === 2 && !isWaitingMode ? calculateLookuptoStakes().opponents.map(opp => ({ selectionName: opp.selectionName, stake: opp.stake })) : undefined
    };

    setCustomGlobalChallenges((prev) => [newChallenge, ...prev]);
    
    alert(`🎉 Challenge Posted Successfully! Your roller stake of $${creatorStake.toFixed(2)} is locked. The challenge has been posted to Active Escrow Pools for opponents to match with a liability of $${opponentLiability.toFixed(2)}.`);
    
    // Reset Engine variables
    setRatioMatchName("");
    setRatioOddName("");
    setRatioOddValue(0);
    setRatioOpponent(null);
    setComposerText("");

    // Open Active Escrow Pools to let the user see their posted challenge!
    setFlModalOpen(true);
  };

  // Join/Match peer-to-peer liability posted by others
  const handleAcceptBetFromPost = (post: Post) => {
    if (!post.betCard) return;
    const stakeRequired = post.betCard.stakes.opponents;
    const totalTax = post.betCard.totalPool * 0.02;
    
    // In handleAcceptBetFromPost, the user takes the entire opponent side of the match, 
    // so they pay the entire tax amount as the sole opponent for this match.
    const opponentTax = totalTax;
    const totalRequiredToPay = stakeRequired + opponentTax;

    if (walletBalance < totalRequiredToPay) {
      alert(`Insufficient funds. This challenge requires matching a liability stake of $${stakeRequired.toFixed(2)} + $${opponentTax.toFixed(2)} Org Tax.`);
      return;
    }

    // Deduct
    setWalletBalance((prev) => prev - totalRequiredToPay);
    setTransactions([
      {
        id: `tx-${Date.now()}`,
        type: "bet_stake",
        amount: stakeRequired,
        time: "Just now",
        target: `Matched P2P Challenge with @${post.author}`,
      },
      {
        id: `tx-tax-${Date.now()}`,
        type: "withdraw" as const,
        amount: opponentTax,
        time: "Just now",
        target: `Org. Escrow Tax (2% full hold)`,
      },
      ...transactions,
    ]);

    // Update Post Bet Card to matched status
    setFeedPosts(feedPosts.map((p) => {
      if (p.id === post.id && p.betCard) {
        return {
          ...p,
          betCard: {
            ...p.betCard,
            status: "MATCHED",
          },
        };
      }
      return p;
    }));

    alert(`Challenge Accepted! You matched @${post.author}'s P2P bet for $${stakeRequired.toFixed(2)}. Escrow contract is active.`);
  };

  // accepting bid from the FL Escrow modal
  const handleMatchFromFlModal = (
    oppUser: string,
    oppStake: number,
    matchName: string,
    prediction: string,
    isProposedMarket?: boolean | "waiting" | "waiting_forced",
    proposedMarketToAcceptor?: string,
    isWaitingForced?: boolean
  ) => {
    // Open the resizable challenge window instead of immediate debit
    setChallengeWindowData({ 
      oppUser, 
      oppStake, 
      matchName, 
      prediction, 
      isProposedMarket: isProposedMarket ?? true, 
      proposedMarketToAcceptor,
      isWaitingForced 
    });
    setIsRequestingChange(false);
    setRequestedMarketInput("");
    setRequestChangeStatus("none");
    setResponseMessage("");
    
    // Choose standard safe opposite of roller to avoid duplicate choice
    const predLower = (prediction || "").toLowerCase();
    let rollerPick: "1" | "X" | "2" = "1";
    if (predLower.includes("1") || predLower.includes("home") || predLower.includes("win")) {
      rollerPick = "1";
    } else if (predLower.includes("x") || predLower.includes("draw")) {
      rollerPick = "X";
    } else {
      rollerPick = "2";
    }
    const safeRemaining: "1" | "X" | "2" = rollerPick === "1" ? "X" : "1";
    setSelectedAcceptorOutcome(safeRemaining);
    
    // If NOT proposed market (meaning it is an OP / Open Proposition), 
    // we term the post as OP whereby an acceptor will access options to bet a market of his own choice (optionalized tab).
    if (isProposedMarket === "waiting") {
      setChallengeMode("waiting");
    } else if (isProposedMarket === false) {
      setChallengeMode("optionalized");
    } else {
      setChallengeMode("proposed");
    }
    
    setRequestChangeTypeTab("market_category");
    setChallengeWindowOpen(true);
  };

  const handleCreateCollaborativeChallenge = () => {
    if (!ratioMatch || !ratioMatchName || !ratioOddName || ratioOddValue <= 0) {
      alert("Please select a live match odd from the widget or Sports hub center first to propose a collaborative challenge prediction.");
      return;
    }
    if (collabTargetStake <= 0) {
      alert("Target total stake must be greater than zero.");
      return;
    }
    if (collabCreatorStake <= 0) {
      alert("Your starting stake must be greater than zero.");
      return;
    }

    const creatorSelSymbol = ratioSelection || "1";
    const remainingSymbols = ["1", "X", "2"].filter(sym => sym !== creatorSelSymbol);
    const activeOpponentSelection = remainingSymbols.includes(collabProposedOpponentSelection) 
      ? collabProposedOpponentSelection 
      : remainingSymbols[0];

    // Get correct targets using our formula
    let targets = getCollabTargets(
      collabFormulationMode,
      ratioMatch,
      creatorSelSymbol,
      collabNumOpponents,
      activeOpponentSelection,
      collabTargetStake
    );

    if (collabTargetMode === "op" && collabNumOpponents === 1) {
      const targetsOption1 = getCollabTargets(
        collabFormulationMode,
        ratioMatch,
        creatorSelSymbol,
        collabNumOpponents,
        remainingSymbols[0],
        collabTargetStake
      );
      const targetsOption2 = getCollabTargets(
        collabFormulationMode,
        ratioMatch,
        creatorSelSymbol,
        collabNumOpponents,
        remainingSymbols[1],
        collabTargetStake
      );
      targets = targetsOption1.targetStakeCreator > targetsOption2.targetStakeCreator ? targetsOption1 : targetsOption2;
    }

    if (collabCreatorStake > targets.targetStakeCreator) {
      alert(`Your starting stake ($${collabCreatorStake.toFixed(2)}) cannot exceed the calculated target creator stake of $${targets.targetStakeCreator.toFixed(2)}.`);
      return;
    }

    if (walletBalance < collabCreatorStake) {
      alert(`Your wallet balance ($${walletBalance.toFixed(2)}) is insufficient to cover your initial contribution ($${collabCreatorStake.toFixed(2)}).`);
      return;
    }

    setPendingCollabConfig({
      targets,
      creatorSelSymbol,
      activeOpponentSelection,
      collabCreatorStake,
      ratioMatch,
      ratioOddName,
      ratioOddValue,
      collabFormulationMode,
      collabNumOpponents,
      collabTargetMode,
      ratioSelection,
      collabReadyToMerge
    });
    setShowCollabConfirmModal(true);
  };

  const handleConfirmCollaborativeChallenge = () => {
    if (!pendingCollabConfig) return;
    
    const {
      targets,
      collabCreatorStake,
      ratioMatch,
      ratioOddName,
      ratioOddValue,
      collabFormulationMode,
      collabNumOpponents,
      collabTargetMode,
      ratioSelection,
      collabReadyToMerge
    } = pendingCollabConfig;

    // Deduct creator stake, log transaction
    setWalletBalance((prev) => prev - collabCreatorStake);
    const txId = `tx-collab-create-${Date.now()}`;
    const newTx = {
      id: txId,
      type: "bet_stake" as const,
      amount: collabCreatorStake,
      time: "Just now",
      target: `Collaborative Pool Initial Stake: ${ratioMatch.homeTeam} vs ${ratioMatch.awayTeam}`
    };
    setTransactions([newTx, ...transactions]);

    const newCollab = {
      id: `collab-${Date.now()}`,
      matchName: `${ratioMatch.homeTeam} vs ${ratioMatch.awayTeam}`,
      match: ratioMatch,
      prediction: `${ratioOddName} (@${ratioOddValue.toFixed(2)})`,
      odds: ratioOddValue,
      formulationMode: collabFormulationMode,
      targetStakeCreator: targets.targetStakeCreator,
      currentStakeCreator: collabCreatorStake,
      targetTotalStake: targets.targetTotalStake,
      currentTotalStake: collabCreatorStake,
      creator: "Collins Dnego (You)",
      contributors: [
        { name: "Collins Dnego (You)", stake: collabCreatorStake }
      ],
      status: collabCreatorStake >= targets.targetStakeCreator ? ("posted" as const) : ("collecting" as const),
      numOpponents: collabNumOpponents,
      opponents: [],
      opponentsTargets: targets.opponents,
      targetMode: collabNumOpponents === 1 ? collabTargetMode : "proposed",
      selectedOutcome: ratioSelection,
      invites: [],
      winningsDisbursed: false,
      readyToMerge: collabReadyToMerge
    };

    setCollabChallenges([newCollab, ...collabChallenges]);
    setShowCollabConfirmModal(false);
    setPendingCollabConfig(null);
    triggerToast("🎉 Collaborative Escrow Pool successfully created! Share with stakers to complete the target stake.", "success");

    // Also post a prompt to feed so other users can see it
    const postText = `Just launched a NEW Collaborative Escrow Pool! 🤝 We are betting on ${ratioMatch.homeTeam} vs ${ratioMatch.awayTeam} (${ratioOddName} @${ratioOddValue.toFixed(2)}). We need $${(targets.targetStakeCreator - collabCreatorStake).toFixed(2)} more to reach our creator side goal of $${targets.targetStakeCreator.toFixed(2)}. Backers join now!`;
    const newPost: Post = {
      id: `p-collab-launch-${Date.now()}`,
      author: "Collins Dnego (You)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2",
      time: "Just now",
      content: postText,
      likes: 0,
      comments: [],
      isGlobalChannel: false,
      betCard: {
        match: `${ratioMatch.homeTeam} vs ${ratioMatch.awayTeam}`,
        type: `Collaborative Escrow Pool`,
        prediction: ratioOddName,
        odds: ratioOddValue,
        totalPool: targets.targetTotalStake,
        stakes: { creator: collabCreatorStake, opponents: targets.targetTotalStake - collabCreatorStake },
        status: "OPEN"
      }
    };
    setFeedPosts([newPost, ...feedPosts]);
  };

  const handleSupportClick = (collabId: string, amount: number) => {
    const collab = collabChallenges.find(c => c.id === collabId);
    if (!collab) return;

    // Show modal if user is the creator (initializer)
    if (collab.creator === "Collins Dnego (You)") {
      setSelectedCollabForAddFunds({ collabId, amount });
      setCollabAddFundsModalOpen(true);
    } else {
      handleContributeToCollab(collabId, amount, "Collins Dnego (You)");
    }
  };

  const handleContributeToCollab = (collabId: string, amount: number, contributorName: string = "Collins Dnego (You)") => {
    const collab = collabChallenges.find(c => c.id === collabId);
    if (!collab) return;

    // Use our formulation fields to calculate remaining creator contribution
    const targetCreator = collab.targetStakeCreator ?? collab.targetTotalStake;
    const currentCreator = collab.currentStakeCreator ?? collab.currentTotalStake;
    const remaining = Math.max(0, targetCreator - currentCreator);
    const actualAmount = Math.min(amount, remaining);

    if (actualAmount <= 0) return;

    if (contributorName === "Collins Dnego (You)") {
      if (walletBalance < actualAmount) {
        alert(`Insufficient wallet balance to contribute $${actualAmount.toFixed(2)}.`);
        return;
      }
      setWalletBalance(prev => prev - actualAmount);
      // Log transaction
      const txId = `tx-collab-contrib-${Date.now()}`;
      setTransactions([
        {
          id: txId,
          type: "bet_stake" as const,
          amount: actualAmount,
          time: "Just now",
          target: `Contribution to ${collab.matchName} Collab Pool`
        },
        ...transactions
      ]);
    }

    // Update the challenge
    setCollabChallenges(prev => prev.map(c => {
      if (c.id === collabId) {
        const nextStakeCreator = (c.currentStakeCreator ?? c.currentTotalStake) + actualAmount;
        const nextStakeTotal = c.currentTotalStake + actualAmount;
        const nextStatus = nextStakeCreator >= (c.targetStakeCreator ?? c.targetTotalStake) ? ("posted" as const) : c.status;
        
        // Find existing contributor or add new one
        const existingIdx = c.contributors.findIndex(contrib => contrib.name === contributorName);
        let updatedContributors = [...c.contributors];
        if (existingIdx > -1) {
          updatedContributors[existingIdx].stake += actualAmount;
        } else {
          updatedContributors.push({ name: contributorName, stake: actualAmount });
        }

        // If target met, post to feed as proposed/active challenge
        if (nextStakeCreator >= (c.targetStakeCreator ?? c.targetTotalStake) && c.status === "collecting") {
          setTimeout(() => {
            triggerToast(`🎉 Collaborative Challenge for ${c.matchName} is fully funded! Posted to global pool.`, "success");
            
            // Add notification to notifications
            const newNotif = {
              id: `notif-collab-funded-${Date.now()}`,
              text: `🤝 Collaborative Challenge for ${c.matchName} is 100% funded ($${(c.targetStakeCreator ?? c.targetTotalStake).toFixed(2)})! Posted to the global sportsbook waiting for opponents.`,
              time: "Just now",
              read: false
            };
            setNotifications(prevNotif => [newNotif, ...prevNotif]);

            // Create new pool challenger item
            const newChallenge = {
              id: `collab-global-${c.id}`,
              user: `${c.creator} & Group`,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Group&backgroundColor=10b981`,
              stake: c.stake,
              prediction: `${c.selectionText} @${c.odds}`,
              status: "LIVE" as const,
              matchName: c.matchName,
              isProposedMarket: c.targetMode === "proposed" ? true : (c.targetMode === "waiting" || c.targetMode === "waiting_forced" ? c.targetMode : false),
              proposedMarketToAcceptor: c.targetMode === "proposed" ? "pending" : undefined
            };
            setCustomGlobalChallenges(prev => [newChallenge, ...prev]);

          }, 500);
        }

        return {
          ...c,
          currentStakeCreator: nextStakeCreator,
          currentTotalStake: nextStakeTotal,
          status: nextStatus,
          contributors: updatedContributors
        };
      }
      return c;
    }));
  };

  const handlePerformInteractiveCollabJoin = (
    collabId: string, 
    optionSymbol: string, 
    joinerNameInput?: string, 
    joinType: "individual" | "collaboration" = "individual",
    customAmount?: number
  ) => {
    const collab = collabChallenges.find(c => c.id === collabId);
    if (!collab) return;

    const matchObj = collab.match;
    const home = matchObj.homeTeam;
    const away = matchObj.awayTeam;

    // Resolve name
    const defaultOppNames = ["Marcus_88", "Linet K.", "Alex Smith", "Chelsea Backer", "Dortmund Fan", "Arsenal Gunner"];
    const randomBotName = defaultOppNames[Math.floor(Math.random() * defaultOppNames.length)];
    const finalName = joinerNameInput?.trim() || `${randomBotName} (Simulated Opponent)`;

    // Resolve option text & odds
    let selectionLabel = "";
    if (optionSymbol === "1") {
      selectionLabel = `Home (${home})`;
    } else if (optionSymbol === "X") {
      selectionLabel = "Draw (X)";
    } else if (optionSymbol === "2") {
      selectionLabel = `Away (${away})`;
    } else {
      selectionLabel = optionSymbol; // fallback
    }

    // Resolve opponentsTargets if it's missing on the fly
    let currentOpponentsTargets = collab.opponentsTargets;
    if (!currentOpponentsTargets || currentOpponentsTargets.length === 0) {
      const calculated = getCollabTargets(
        collab.formulationMode || "total_pool",
        collab.match,
        collab.selectedOutcome || "1",
        collab.numOpponents,
        optionSymbol,
        collab.targetTotalStake
      );
      currentOpponentsTargets = calculated.opponents;
    }

    const oppTarget = currentOpponentsTargets.find(t => t.symbol === optionSymbol);
    const targetStake = oppTarget ? oppTarget.targetStake : (collab.targetTotalStake / (collab.numOpponents || 1));
    const currentOpponentContributions = collab.opponents
      .filter(o => o.selectionSymbol === optionSymbol || o.selection.includes(selectionLabel))
      .reduce((sum, o) => sum + o.stake, 0);
    const remainingNeeded = Math.max(0, targetStake - currentOpponentContributions);

    if (remainingNeeded <= 0) {
      triggerToast("This selection's required stake is already 100% funded!", "error");
      return;
    }

    let stakeToContribute = remainingNeeded;
    if (customAmount !== undefined && customAmount > 0) {
      stakeToContribute = Math.min(customAmount, remainingNeeded);
    } else if (joinType === "collaboration") {
      stakeToContribute = remainingNeeded > 20 ? Math.round(remainingNeeded * 0.4) : remainingNeeded;
    }

    setCollabChallenges(prev => prev.map(c => {
      if (c.id === collabId) {
        let updatedOpponentsTargets = c.opponentsTargets || currentOpponentsTargets;
        
        // Add new opponent contribution entry
        const newOpponentEntry = {
          name: finalName,
          selection: selectionLabel,
          selectionSymbol: optionSymbol,
          stake: stakeToContribute
        };
        const updatedOpponents = [...c.opponents, newOpponentEntry];

        // Update current funded stake for this target in opponentsTargets list
        updatedOpponentsTargets = updatedOpponentsTargets.map(t => {
          if (t.symbol === optionSymbol) {
            return {
              ...t,
              currentStake: (t.currentStake || 0) + stakeToContribute
            };
          }
          return t;
        });

        // Determine if ALL targets are fully matched
        const allOppsFullyFunded = updatedOpponentsTargets.every(target => 
          (target.currentStake || 0) >= target.targetStake - 0.05
        );

        const nextStatus = allOppsFullyFunded ? ("matched" as const) : ("posted" as const);

        // Trigger notifications & toasts
        setTimeout(() => {
          const textMsg = allOppsFullyFunded
            ? `🔐 Peer-to-Peer Collaborative Escrow on ${c.matchName} is now 100% matched and locked!`
            : `👤 ${finalName} contributed $${stakeToContribute.toFixed(2)} backing ${selectionLabel}! Remaining needed: $${Math.max(0, targetStake - (currentOpponentContributions + stakeToContribute)).toFixed(2)}`;

          const newNotif = {
            id: `notif-collab-join-${Date.now()}`,
            text: textMsg,
            time: "Just now",
            read: false
          };
          setNotifications(prevNotif => [newNotif, ...prevNotif]);
          triggerToast(allOppsFullyFunded ? "🔐 Escrow Fully Locked!" : "👤 Opponent Contributed!", "success");
        }, 150);

        return {
          ...c,
          opponents: updatedOpponents,
          opponentsTargets: updatedOpponentsTargets,
          currentTotalStake: c.currentTotalStake + stakeToContribute,
          status: nextStatus
        };
      }
      return c;
    }));

    // Reset local interactive selections
    setInteractiveCollabJoinOption("");
    setInteractiveJoinerName("");
    setCollabOpponentStakeInput(undefined);

    // Reload the selected collab modal item safely
    setTimeout(() => {
      setCollabChallenges(currentList => {
        const reloaded = currentList.find(item => item.id === collabId);
        if (reloaded) {
          setSelectedCollabForModal(reloaded);
        }
        return currentList;
      });
    }, 200);
  };

  const handleSimulateOpponentJoin = (collabId: string, type: "individual" | "collaboration" = "individual") => {
    const collab = collabChallenges.find(c => c.id === collabId);
    if (!collab) return;

    const creatorSymbol = collab.selectedOutcome || "1";
    
    // Resolve opponentsTargets if it's missing on the fly
    let currentOpponentsTargets = collab.opponentsTargets;
    if (!currentOpponentsTargets || currentOpponentsTargets.length === 0) {
      const calculated = getCollabTargets(
        collab.formulationMode || "total_pool",
        collab.match,
        collab.selectedOutcome || "1",
        collab.numOpponents,
        "X", // fallback
        collab.targetTotalStake
      );
      currentOpponentsTargets = calculated.opponents;
    }

    // Find first opponent target that still has remaining needed stake
    const openTargets = currentOpponentsTargets.filter(t => {
      const currentFunded = collab.opponents.filter(o => o.selectionSymbol === t.symbol).reduce((sum, o) => sum + o.stake, 0);
      return currentFunded < t.targetStake - 0.05;
    });

    if (openTargets.length === 0) {
      triggerToast("No further opponent backing is needed for this challenge!", "info");
      return;
    }

    const targetToJoin = openTargets[0];
    const optionSymbol = targetToJoin.symbol;

    const currentFundedOnSymbol = collab.opponents.filter(o => o.selectionSymbol === optionSymbol).reduce((sum, o) => sum + o.stake, 0);
    const remainingNeeded = Math.max(0, targetToJoin.targetStake - currentFundedOnSymbol);

    // Simulate custom contribution (either fully or partially)
    let customAmount: number | undefined = undefined;
    if (type === "collaboration" || Math.random() > 0.4) {
      // Contribute 30-60% of remaining needed, or full if remaining is small
      customAmount = remainingNeeded > 25 ? Math.max(10, Math.round(remainingNeeded * (0.3 + Math.random() * 0.3))) : remainingNeeded;
    }

    handlePerformInteractiveCollabJoin(collabId, optionSymbol, undefined, type, customAmount);
  };

  const handleMergeCollabPools = (poolId1: string, poolId2: string) => {
    const pool1 = collabChallenges.find(c => c.id === poolId1);
    const pool2 = collabChallenges.find(c => c.id === poolId2);
    if (!pool1 || !pool2) return;

    setCollabChallenges(prev => prev.map(c => {
      if (c.id === poolId1) {
        return {
          ...c,
          status: "matched" as const,
          opponents: pool2.contributors.map(contrib => ({
            name: `${contrib.name} (via Opposing Collab Pool)`,
            selection: pool2.prediction,
            stake: contrib.stake
          }))
        };
      }
      if (c.id === poolId2) {
        return {
          ...c,
          status: "matched" as const,
          opponents: pool1.contributors.map(contrib => ({
            name: `${contrib.name} (via Opposing Collab Pool)`,
            selection: pool1.prediction,
            stake: contrib.stake
          }))
        };
      }
      return c;
    }));

    if (selectedCollabForModal && (selectedCollabForModal.id === poolId1 || selectedCollabForModal.id === poolId2)) {
      setSelectedCollabForModal((prev: any) => {
        if (!prev) return null;
        const targetPool = prev.id === poolId1 ? pool1 : pool2;
        const opposingPool = prev.id === poolId1 ? pool2 : pool1;
        return {
          ...targetPool,
          status: "matched",
          opponents: opposingPool.contributors.map(contrib => ({
            name: `${contrib.name} (via Opposing Collab Pool)`,
            selection: opposingPool.prediction,
            stake: contrib.stake
          }))
        };
      });
    }

    triggerToast(`🎉 Successfully merged & matched Collaborative Pools for ${pool1.matchName}!`, "success");
    const newNotif = {
      id: `notif-collab-merge-${Date.now()}`,
      text: `🤝 Collaborative Pools merged for ${pool1.matchName}! Your pool has successfully matched opposing stakers' pool.`,
      time: "Just now",
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleCombineSameSidePools = (targetPoolId: string, sourcePoolId: string) => {
    const targetPool = collabChallenges.find(c => c.id === targetPoolId);
    const sourcePool = collabChallenges.find(c => c.id === sourcePoolId);
    if (!targetPool || !sourcePool) return;

    setCollabChallenges(prev => {
      const remaining = prev.filter(c => c.id !== sourcePoolId);
      return remaining.map(c => {
        if (c.id === targetPoolId) {
          const combinedContributors = [...c.contributors];
          let extraStakeAdded = 0;
          sourcePool.contributors.forEach(sc => {
            const existing = combinedContributors.find(cc => cc.name === sc.name);
            if (existing) {
              existing.stake += sc.stake;
            } else {
              combinedContributors.push(sc);
            }
            extraStakeAdded += sc.stake;
          });

          const newTotalStake = c.currentTotalStake + extraStakeAdded;
          const newStatus = newTotalStake >= c.targetTotalStake ? ("posted" as const) : ("collecting" as const);

          return {
            ...c,
            contributors: combinedContributors,
            currentTotalStake: newTotalStake,
            currentStakeCreator: (c.currentStakeCreator || 0) + extraStakeAdded,
            status: newStatus
          };
        }
        return c;
      });
    });

    if (selectedCollabForModal && selectedCollabForModal.id === targetPoolId) {
      setSelectedCollabForModal((prev: any) => {
        if (!prev) return null;
        const combinedContributors = [...prev.contributors];
        let extraStakeAdded = 0;
        sourcePool.contributors.forEach(sc => {
          const existing = combinedContributors.find(cc => cc.name === sc.name);
          if (existing) {
            existing.stake += sc.stake;
          } else {
            combinedContributors.push(sc);
          }
          extraStakeAdded += sc.stake;
        });

        const newTotalStake = prev.currentTotalStake + extraStakeAdded;
        const newStatus = newTotalStake >= prev.targetTotalStake ? ("posted" as const) : ("collecting" as const);

        return {
          ...prev,
          contributors: combinedContributors,
          currentTotalStake: newTotalStake,
          currentStakeCreator: (prev.currentStakeCreator || 0) + extraStakeAdded,
          status: newStatus
        };
      });
    }
  };

  const handleNavigateToWholeMatchPageForChange = () => {
    if (!challengeWindowData) return;
    
    // Save challenge context to restore on market click
    setMarketChangeChallengeData(challengeWindowData);
    setIsRequestingChange(true);
    setChallengeWindowOpen(false);

    const targetMatchName = challengeWindowData.matchName || "";
    const foundMatch = matches.find(m => 
      `${m.homeTeam} vs ${m.awayTeam}`.toLowerCase() === targetMatchName.toLowerCase() ||
      targetMatchName.toLowerCase().includes(m.homeTeam.toLowerCase()) ||
      targetMatchName.toLowerCase().includes(m.awayTeam.toLowerCase())
    );

    if (foundMatch) {
      setSelectedMatchForHub(foundMatch);
    } else {
      // Build a beautiful dynamic Match object so they are guaranteed a perfect Match Center experience
      const newMatch: Match = {
        id: `dynamic-match-${Date.now()}`,
        homeTeam: targetMatchName.split("vs")[0]?.trim() || "A.F.C Leopards",
        awayTeam: targetMatchName.split("vs")[1]?.trim() || "Gor Mahia",
        league: "Mashemeji Derby Specialty",
        status: "LIVE",
        time: "45'",
        score: "1:0",
        odds: { "1": 2.10, X: 3.20, "2": 2.90 },
        trivia: "Derby match playing under high-voltage community escrow stakes.",
        flActiveCount: 15
      };
      setMatches(prev => [...prev, newMatch]);
      setSelectedMatchForHub(newMatch);
    }

    setActiveTab("hub");
    alert(`💡 Taken to the whole Match Center page for "${challengeWindowData.matchName}"! Tap any of the markets/odds below to request a change for it.`);
  };

  // Invite buddies and lock stakes
  const handleInviteFriendsCallback = (invitedCount: number, friends: string[]) => {
    const effectivePostToGlobal = (numOpponents === 2 && isWaitingMode) ? false : postToGlobal;

    const creatorRatio = getCreatorRatio();
    const costPerMatch = ratioTotalPool * creatorRatio;
    const matchedMultiplier = isSendoffEnabled ? sendoffsCount * 5 : invitedCount;
    const totalHeldCost = costPerMatch * matchedMultiplier;
    const marketingExpense = isSendoffEnabled ? ratioTotalPool * 0.01 : 0;
    const totalRequired = totalHeldCost + marketingExpense;

    if (walletBalance < totalRequired) {
      alert(`The requested Sendoff parameters requires $${totalRequired.toFixed(2)} total hold ($${totalHeldCost.toFixed(2)} stakes + $${marketingExpense.toFixed(2)} global channels promo fee), but you only have $${walletBalance.toFixed(2)}.`);
      return;
    }

    setWalletBalance((prev) => prev - totalRequired);
    const newTxList: Array<{ id: string; type: "deposit" | "withdraw" | "bet_stake" | "bet_win"; amount: number; time: string; target: string }> = [
      {
        id: `tx-${Date.now()}`,
        type: "bet_stake",
        amount: totalHeldCost,
        time: "Just now",
        target: `Sendoff Friends Challenge: Sponsoring ${matchedMultiplier} matches`,
      }
    ];

    if (marketingExpense > 0) {
      newTxList.push({
        id: `tx-mkt-${Date.now()}`,
        type: "withdraw" as const,
        amount: marketingExpense,
        time: "Just now",
        target: `1% Sendoff Global Channel Marketing Fee (${invitedCount} invited)`,
      });
    }

    setTransactions([...newTxList, ...transactions]);

    // Create a feed post with isGlobalChannel too if postToGlobal is enabled on sendoff!
    const newPost: Post = {
      id: `p-inv-${Date.now()}`,
      author: "Collins Dnego (You)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2",
      time: "Just now",
      content: composerText || `Just proposed an invite-only peer-to-peer challenge to my circle of ${friends.join(", ")}! Sponsoring ${matchedMultiplier} sendoff matches on: ${ratioMatchName || "Match Prediction"}. Join the escrow now!`,
      likes: 0,
      comments: [],
      isGlobalChannel: isSendoffEnabled && effectivePostToGlobal,
      betCard: {
        match: ratioMatchName || "Direct Invitation Event",
        type: `Friends Invite Challenge: ${ratioOddName || "Match Prediction"}`,
        prediction: ratioOddName || "Selected Prediction",
        odds: ratioOddValue || 2.0,
        totalPool: ratioTotalPool,
        stakes: { creator: parseFloat(totalHeldCost.toFixed(2)), opponents: parseFloat((ratioTotalPool - costPerMatch).toFixed(2)) },
        status: "OPEN",
      },
    };

    setFeedPosts([newPost, ...feedPosts]);
    setComposerText("");

    alert(`Challenges proposal sent to ${invitedCount} friends! Co-stake contract was initialized, locking $${totalHeldCost.toFixed(2)} in virtual assets${marketingExpense > 0 ? ` and $${marketingExpense.toFixed(2)} marketing fee deducted.` : '.'}`);
  };

  // Submit standard social posts from our Composer
  const handlePublishStandardPost = () => {
    if (!composerText.trim()) return;

    const standardPost: Post = {
      id: `std-p-${Date.now()}`,
      author: "Collins Dnego (You)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2",
      time: "Just now",
      content: composerText,
      likes: 0,
      comments: [],
    };

    setFeedPosts([standardPost, ...feedPosts]);
    setComposerText("");
  };

  // Like/Reaction of a social post
  const handleLikePost = (postId: string, reaction?: Post["reaction"]) => {
    setFeedPosts(feedPosts.map((p) => {
      if (p.id === postId) {
        if (reaction) {
          // If already reactive and clicking the same reaction -> toggle off
          if (p.hasLiked && p.reaction === reaction) {
            return {
              ...p,
              likes: Math.max(0, p.likes - 1),
              hasLiked: false,
              reaction: undefined
            };
          }
          // If had an existing but different reaction, only change reaction type, likes count remains the same
          const wasLiked = p.hasLiked;
          return {
            ...p,
            likes: wasLiked ? p.likes : p.likes + 1,
            hasLiked: true,
            reaction: reaction
          };
        } else {
          // Standard toggling Like onClick
          const wasLiked = p.hasLiked;
          return {
            ...p,
            likes: wasLiked ? Math.max(0, p.likes - 1) : p.likes + 1,
            hasLiked: !wasLiked,
            reaction: wasLiked ? undefined : "like"
          };
        }
      }
      return p;
    }));
  };

  // Repost helper: clones and nests original post content
  const handleRepostPost = (originalPost: Post) => {
    // If the original post has an inner nested repostOf, unpack it to prevent infinite embedding depth
    const sourcePost = originalPost.repostOf ? originalPost.repostOf : originalPost;

    const repostPost: Post = {
      id: `std-p-repost-${Date.now()}`,
      author: "Collins Dnego (You)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2",
      time: "Just now",
      content: `@${sourcePost.author}'s forecast prediction has been reposted on my profile feed!`,
      likes: 0,
      comments: [],
      repostOf: sourcePost // Nest original post structure cleanly
    };

    setFeedPosts([repostPost, ...feedPosts]);
    alert("This post has been reposted onto your profile feed successfully!");
  };

  // Comments helper: updates comments array of a given post
  const handleUpdatePostComments = (postId: string, updatedComments: Comment[]) => {
    setFeedPosts(feedPosts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          comments: updatedComments
        };
      }
      return p;
    }));
  };

  // Submit search query directly to automated crawler with Gemini search groundings
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPrompt.trim()) return;

    setIsSearchLoading(true);
    setSearchResponse("");
    try {
      // Prompt server to generate real insights
      const response = await fetch("/api/sports-feed?league=" + encodeURIComponent(searchPrompt));
      const data = await response.json();
      if (data && data.matches && data.matches.length > 0) {
        setMatches(data.matches);
        setSearchResponse(`Found ${data.matches.length} matches currently scheduled or active. Check the Sports Hub center!`);
      } else {
        setSearchResponse("We looked up current schedules, but found no active matches matching that criteria in the instant feed. Loading default schedules.");
      }
    } catch {
      setSearchResponse("Failed to establish sync with external sports APIs. Serving cached odds and simulations.");
    } finally {
      setIsSearchLoading(false);
    }
  };

  // LookUpto Engine calculations based on user inputs
  const calculateLookuptoStakes = () => {
    // We fall back to standard odds if ratioMatch is null
    const odds1 = ratioMatch?.odds["1"] ?? 2.0;
    const oddsX = ratioMatch?.odds.X ?? 3.0;
    const odds2 = ratioMatch?.odds["2"] ?? 4.0;

    if (numOpponents === 2) {
      // 3 outcomes total (Creator + 2 opponents)
      let userOddsVal = odds1;
      let opp1OddsVal = oddsX;
      let opp2OddsVal = odds2;

      let userSelName = "Home Win";
      let opp1SelName = "Draw";
      let opp2SelName = "Away Win";

      if (ratioSelection === "1") {
        userOddsVal = odds1; userSelName = ratioMatch ? ratioMatch.homeTeam : "Home Win";
        opp1OddsVal = oddsX; opp1SelName = "Draw";
        opp2OddsVal = odds2; opp2SelName = ratioMatch ? ratioMatch.awayTeam : "Away Win";
      } else if (ratioSelection === "X") {
        userOddsVal = oddsX; userSelName = "Draw";
        opp1OddsVal = odds1; opp1SelName = ratioMatch ? ratioMatch.homeTeam : "Home Win";
        opp2OddsVal = odds2; opp2SelName = ratioMatch ? ratioMatch.awayTeam : "Away Win";
      } else if (ratioSelection === "2") {
        userOddsVal = odds2; userSelName = ratioMatch ? ratioMatch.awayTeam : "Away Win";
        opp1OddsVal = odds1; opp1SelName = ratioMatch ? ratioMatch.homeTeam : "Home Win";
        opp2OddsVal = oddsX; opp2SelName = "Draw";
      }

      // Inverse probability ratio formula
      const ipUser = userOddsVal > 0 ? 1 / userOddsVal : 0;
      const ipOpp1 = opp1OddsVal > 0 ? 1 / opp1OddsVal : 0;
      const ipOpp2 = opp2OddsVal > 0 ? 1 / opp2OddsVal : 0;
      const totalIp = ipUser + ipOpp1 + ipOpp2;

      const userPctVal = totalIp > 0 ? (ipUser / totalIp) * 100 : 0;
      const opp1PctVal = totalIp > 0 ? (ipOpp1 / totalIp) * 100 : 0;
      const opp2PctVal = totalIp > 0 ? (ipOpp2 / totalIp) * 100 : 0;

      const userStakeVal = (userPctVal / 100) * ratioTotalPool;
      const opp1StakeVal = (opp1PctVal / 100) * ratioTotalPool;
      const opp2StakeVal = (opp2PctVal / 100) * ratioTotalPool;

      return {
        userPct: userPctVal,
        userStake: userStakeVal,
        userSelection: ratioSelection,
        userSelectionName: userSelName,
        userOdds: userOddsVal,
        opponentsCount: 2,
        opponents: [
          { name: "Opponent A", pct: opp1PctVal, stake: opp1StakeVal, selection: ratioSelection === "1" ? "X" : "1" as "1"|"X"|"2", selectionName: opp1SelName, odds: opp1OddsVal },
          { name: "Opponent B", pct: opp2PctVal, stake: opp2StakeVal, selection: ratioSelection === "2" ? "X" : "2" as "1"|"X"|"2", selectionName: opp2SelName, odds: opp2OddsVal }
        ]
      };
    } else {
      // 1 opponent only (User vs 1 Opponent choice)
      let userOddsVal = odds1;
      let oppOddsVal = oddsX;

      let userSelName = "Home Win";
      let oppSelName = "Draw";

      if (ratioSelection === "1") {
        userOddsVal = odds1; userSelName = ratioMatch ? ratioMatch.homeTeam : "Home Win";
        if (opponentSelection === "X") {
          oppOddsVal = oddsX; oppSelName = "Draw";
        } else {
          oppOddsVal = odds2; oppSelName = ratioMatch ? ratioMatch.awayTeam : "Away Win";
        }
      } else if (ratioSelection === "X") {
        userOddsVal = oddsX; userSelName = "Draw";
        if (opponentSelection === "1") {
          oppOddsVal = odds1; oppSelName = ratioMatch ? ratioMatch.homeTeam : "Home Win";
        } else {
          oppOddsVal = odds2; oppSelName = ratioMatch ? ratioMatch.awayTeam : "Away Win";
        }
      } else {
        userOddsVal = odds2; userSelName = ratioMatch ? ratioMatch.awayTeam : "Away Win";
        if (opponentSelection === "1") {
          oppOddsVal = odds1; oppSelName = ratioMatch ? ratioMatch.homeTeam : "Home Win";
        } else {
          oppOddsVal = oddsX; oppSelName = "Draw";
        }
      }

      // Inverse probability ratio formula
      const ipUser = userOddsVal > 0 ? 1 / userOddsVal : 0;
      const ipOpp = oppOddsVal > 0 ? 1 / oppOddsVal : 0;
      const totalIp = ipUser + ipOpp;

      const userPctVal = totalIp > 0 ? (ipUser / totalIp) * 100 : 0;
      const oppPctVal = totalIp > 0 ? (ipOpp / totalIp) * 100 : 0;

      const userStakeVal = (userPctVal / 100) * ratioTotalPool;
      const oppStakeVal = (oppPctVal / 100) * ratioTotalPool;

      return {
        userPct: userPctVal,
        userStake: userStakeVal,
        userSelection: ratioSelection,
        userSelectionName: userSelName,
        userOdds: userOddsVal,
        opponentsCount: 1,
        opponents: [
          { name: "My Opponent", pct: oppPctVal, stake: oppStakeVal, selection: opponentSelection, selectionName: oppSelName, odds: oppOddsVal }
        ]
      };
    }
  };

  const getCentralCalculation = (): UniversalCalculationResult => {
    if (escrowEngineTab === "three_way") {
      const odds1 = (ratioOddName === "1" && ratioOddValue > 0) ? ratioOddValue : (ratioMatch?.odds?.["1"] ?? 2.10);
      const oddsX = (ratioOddName === "X" && ratioOddValue > 0) ? ratioOddValue : (ratioMatch?.odds?.X ?? 3.25);
      const odds2 = (ratioOddName === "2" && ratioOddValue > 0) ? ratioOddValue : (ratioMatch?.odds?.["2"] ?? 3.50);

      const outcomes: UniversalOutcomeInput[] = [
        { id: "1", name: `Home (${ratioMatch?.homeTeam || "Home"})`, odds: odds1 },
        { id: "X", name: "Draw", odds: oddsX },
        { id: "2", name: `Away (${ratioMatch?.awayTeam || "Away"})`, odds: odds2 },
      ];

      let targetContractValue = ratioTotalPool;
      if (calculatorMode === "stake") {
        const ip1 = 1 / odds1;
        const ipX = 1 / oddsX;
        const ip2 = 1 / odds2;
        const totalIp = ip1 + ipX + ip2;

        let userIp = ip1;
        if (ratioOddName === "X") userIp = ipX;
        if (ratioOddName === "2") userIp = ip2;

        const userSharePct = totalIp > 0 ? userIp / totalIp : 0.3333;
        targetContractValue = userSharePct > 0 ? calculatorUserStakeInput / userSharePct : calculatorUserStakeInput * 3;
      }

      const res = calculateUniversalStakes(outcomes, targetContractValue);

      let userStake = res.player1Stake;
      let opponentStake = res.player2Stake + res.player3Stake;
      let userPct = res.player1Pct;
      let opponentPct = res.player2Pct + res.player3Pct;

      if (ratioOddName === "X") {
        userStake = res.player2Stake;
        opponentStake = res.player1Stake + res.player3Stake;
        userPct = res.player2Pct;
        opponentPct = res.player1Pct + res.player3Pct;
      } else if (ratioOddName === "2") {
        userStake = res.player3Stake;
        opponentStake = res.player1Stake + res.player2Stake;
        userPct = res.player3Pct;
        opponentPct = res.player1Pct + res.player2Pct;
      }

      return {
        ...res,
        userStake,
        opponentStake,
        userPct,
        opponentPct,
      };
    } else if (escrowEngineTab === "tujengane") {
      const odds1 = (ratioOddName === "1" && ratioOddValue > 0) ? ratioOddValue : (ratioMatch?.odds?.["1"] ?? 2.10);
      const oddsX = (ratioOddName === "X" && ratioOddValue > 0) ? ratioOddValue : (ratioMatch?.odds?.X ?? 3.25);
      const odds2 = (ratioOddName === "2" && ratioOddValue > 0) ? ratioOddValue : (ratioMatch?.odds?.["2"] ?? 3.50);

      const outcomes: UniversalOutcomeInput[] = [
        { id: "1", name: `Home (${ratioMatch?.homeTeam || "Home"})`, odds: odds1 },
        { id: "X", name: "Draw", odds: oddsX },
        { id: "2", name: `Away (${ratioMatch?.awayTeam || "Away"})`, odds: odds2 },
      ];

      return calculateUniversalStakes(outcomes, ratioTotalPool);
    } else {
      // 1v1 mode (Mimi na Wewe)
      const userOdds = ratioOddValue > 0 ? ratioOddValue : 2.0;

      let effectiveOpponentOdds = 1 / Math.max(0.01, 1 - (1 / userOdds));
      if (mimiChallengeType === "Forced" && ratioMatch) {
        effectiveOpponentOdds = ratioMatch.odds[opponentSelection as keyof typeof ratioMatch.odds] || effectiveOpponentOdds;
      } else if (
        (mimiChallengeType === "Private" || escrowModalStage === "invite_friend" || escrowModalStage === "private_sent") &&
        privateChallengeMode === "Forced" &&
        privateForcedOutcome &&
        ratioMatch
      ) {
        effectiveOpponentOdds = ratioMatch.odds[privateForcedOutcome as keyof typeof ratioMatch.odds] || effectiveOpponentOdds;
      }
      const opponentOdds = effectiveOpponentOdds > 1 ? effectiveOpponentOdds : 2.0;

      const outcomes: UniversalOutcomeInput[] = [
        { id: "user", name: "Your Selection", odds: userOdds },
        { id: "opponent", name: "Opponent Selection", odds: opponentOdds },
      ];

      let targetContractValue = ratioTotalPool;
      if (calculatorMode === "stake") {
        const ipUser = 1 / userOdds;
        const ipOpp = 1 / opponentOdds;
        const totalIp = ipUser + ipOpp;
        const userSharePct = totalIp > 0 ? ipUser / totalIp : 0.5;
        targetContractValue = userSharePct > 0 ? calculatorUserStakeInput / userSharePct : calculatorUserStakeInput * 2;
      }

      return calculateUniversalStakes(outcomes, targetContractValue);
    }
  };

  const getCreatorRatio = () => {
    return getCentralCalculation().userPct / 100;
  };

  const getCreatorStake = () => {
    return getCentralCalculation().userStake;
  };

  const getOpponentLiability = () => {
    return getCentralCalculation().opponentStake;
  };

  const getCollabTargets = (
    mode: "single_side" | "total_pool",
    match: any,
    creatorSel: string,
    numOpps: number,
    oppSelection: string, // fallback / choice
    targetInput: number
  ) => {
    const odds1 = match?.odds?.["1"] ?? 2.0;
    const oddsX = match?.odds?.X ?? 3.0;
    const odds2 = match?.odds?.["2"] ?? 4.0;

    const allOutcomes = [
      { symbol: "1", label: `Home (${match?.homeTeam || ""})`, odd: odds1 },
      { symbol: "X", label: "Draw (X)", odd: oddsX },
      { symbol: "2", label: `Away (${match?.awayTeam || ""})`, odd: odds2 }
    ];

    const creatorOutcome = allOutcomes.find(o => o.symbol === creatorSel) || allOutcomes[0];
    const creatorOdds = creatorOutcome.odd;

    if (numOpps === 1) {
      // 1v1 mode: Creator vs 1 Opponent selection
      let oppSymbol: "1" | "X" | "2" = "2";
      if (creatorSel === "1") {
        oppSymbol = oppSelection === "X" ? "X" : "2";
      } else if (creatorSel === "X") {
        oppSymbol = oppSelection === "1" ? "1" : "2";
      } else {
        oppSymbol = oppSelection === "1" ? "1" : "X";
      }
      const oppOutcome = allOutcomes.find(o => o.symbol === oppSymbol) || allOutcomes[2];
      const oppOdds = oppOutcome.odd;

      if (mode === "single_side") {
        const targetStakeCreator = targetInput;
        const payout = targetStakeCreator * creatorOdds;
        const targetStakeOpp = payout / oppOdds;
        const targetTotalStake = targetStakeCreator + targetStakeOpp;
        return {
          targetStakeCreator,
          targetTotalStake,
          opponents: [
            { symbol: oppSymbol, label: oppOutcome.label, targetStake: targetStakeOpp, currentStake: 0, odds: oppOdds }
          ]
        };
      } else {
        // total_pool mode
        const targetTotalStake = targetInput;
        const ipCreator = 1 / creatorOdds;
        const ipOpp = 1 / oppOdds;
        const totalIp = ipCreator + ipOpp;

        const creatorPct = ipCreator / totalIp;
        const oppPct = ipOpp / totalIp;

        const targetStakeCreator = creatorPct * targetTotalStake;
        const targetStakeOpp = oppPct * targetTotalStake;

        return {
          targetStakeCreator,
          targetTotalStake,
          opponents: [
            { symbol: oppSymbol, label: oppOutcome.label, targetStake: targetStakeOpp, currentStake: 0, odds: oppOdds }
          ]
        };
      }
    } else {
      // 3-way mode: Creator vs both other outcomes
      const remainingOutcomes = allOutcomes.filter(o => o.symbol !== creatorSel);
      const opp1Outcome = remainingOutcomes[0];
      const opp2Outcome = remainingOutcomes[1];

      const opp1Odds = opp1Outcome.odd;
      const opp2Odds = opp2Outcome.odd;

      if (mode === "single_side") {
        const targetStakeCreator = targetInput;
        const payout = targetStakeCreator * creatorOdds;
        const targetStakeOpp1 = payout / opp1Odds;
        const targetStakeOpp2 = payout / opp2Odds;
        const targetTotalStake = targetStakeCreator + targetStakeOpp1 + targetStakeOpp2;

        return {
          targetStakeCreator,
          targetTotalStake,
          opponents: [
            { symbol: opp1Outcome.symbol, label: opp1Outcome.label, targetStake: targetStakeOpp1, currentStake: 0, odds: opp1Odds },
            { symbol: opp2Outcome.symbol, label: opp2Outcome.label, targetStake: targetStakeOpp2, currentStake: 0, odds: opp2Odds }
          ]
        };
      } else {
        // total_pool mode
        const targetTotalStake = targetInput;
        const ipCreator = 1 / creatorOdds;
        const ipOpp1 = 1 / opp1Odds;
        const ipOpp2 = 1 / opp2Odds;
        const totalIp = ipCreator + ipOpp1 + ipOpp2;

        const creatorPct = ipCreator / totalIp;
        const opp1Pct = ipOpp1 / totalIp;
        const opp2Pct = ipOpp2 / totalIp;

        const targetStakeCreator = creatorPct * targetTotalStake;
        const targetStakeOpp1 = opp1Pct * targetTotalStake;
        const targetStakeOpp2 = opp2Pct * targetTotalStake;

        return {
          targetStakeCreator,
          targetTotalStake,
          opponents: [
            { symbol: opp1Outcome.symbol, label: opp1Outcome.label, targetStake: targetStakeOpp1, currentStake: 0, odds: opp1Odds },
            { symbol: opp2Outcome.symbol, label: opp2Outcome.label, targetStake: targetStakeOpp2, currentStake: 0, odds: opp2Odds }
          ]
        };
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#18191a] text-[#050505] dark:text-[#e4e6eb] font-sans antialiased transition-colors duration-300">
      
      {/* HEADER UPPER NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-[#242526] h-14 border-b border-gray-200 dark:border-[#3e4042] px-4 flex items-center justify-between shadow-sm transition-colors duration-300">
        
        {/* Left Side elements */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setIsMainMenuOpen(!isMainMenuOpen);
            }}
            className="w-10 h-10 hover:bg-gray-100 dark:hover:bg-[#323334] rounded-full transition-colors text-gray-600 dark:text-gray-300 flex items-center justify-center cursor-pointer overflow-hidden relative"
            title="Toggle Main Menu"
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <Menu className={`absolute w-full h-full transition-all duration-300 transform ${isMainMenuOpen ? 'rotate-180 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`} />
              <ArrowLeft className={`absolute w-full h-full transition-all duration-300 transform ${isMainMenuOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-180 opacity-0 scale-50'}`} />
            </div>
          </button>
          <div className="flex items-center gap-1">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setActiveTab("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="text-2xl font-black text-[#1877f2] hover:opacity-90 tracking-tight select-none leading-none"
            >
              facelook
            </a>
            <button
              onClick={() => { setActiveTab("hub"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="text-emerald-500 font-extrabold text-[11px] tracking-widest border border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 px-1.5 py-0.5 rounded leading-none cursor-pointer transition-colors"
              title="Launch GameHub"
            >
              BET
            </button>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center bg-[#f0f2f5] dark:bg-[#3a3b3c] rounded-full px-3.5 py-1.5 w-64 border border-transparent focus-within:border-[#1877f2] transition-all">
            <Search className="w-4 h-4 text-gray-400 shrink-0 mr-1.5" />
            <input
              type="text"
              value={searchPrompt}
              onChange={(e) => setSearchPrompt(e.target.value)}
              placeholder="Search teams & schedules..."
              className="bg-transparent border-none outline-none text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 w-full"
            />
          </form>
        </div>

        {/* Center Navigation Tabs */}
        <div className="flex items-center gap-1 md:gap-2 h-full">
          <button 
            onClick={() => setActiveTab("home")}
            className={`w-14 md:w-24 h-full relative flex items-center justify-center transition-all ${
              activeTab === "home" ? "text-[#1877f2]" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800"
            }`}
            title="Social Feed Feed"
          >
            <HomeIcon className="w-5 md:w-6 h-5 md:h-6" />
            {activeTab === "home" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1877f2] rounded-t-full" />}
          </button>

          <button 
            onClick={() => {
              if (matches.length > 0 && !watchSelectedMatch) {
                setWatchSelectedMatch(matches[0]);
              }
              setActiveTab("watch");
              setKenyanShowTrigger(prev => prev + 1);
            }}
            className="w-14 md:w-24 h-full relative flex flex-col items-center justify-center transition-all text-amber-500 hover:bg-gray-50 dark:hover:bg-zinc-800"
            title="Kenyan Show - Soccer Simulator Feed"
          >
            <span className="text-base leading-none">🇰🇪</span>
            <span className="text-[8px] font-black uppercase tracking-tighter text-gray-700 dark:text-gray-300">Kenyan Show</span>
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 opacity-60 rounded-t-full" />
          </button>
          
          <button 
            onClick={() => {
              if (matches.length > 0 && !watchSelectedMatch) {
                setWatchSelectedMatch(matches[0]);
              }
              setActiveTab("watch");
            }}
            className={`w-14 md:w-24 h-full relative flex items-center justify-center transition-all ${
              activeTab === "watch" ? "text-[#1877f2]" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800"
            }`}
            title="Spectate Live Matches & Commentary"
          >
            <Tv className="w-5 md:w-6 h-5 md:h-6" />
            {activeTab === "watch" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1877f2] rounded-t-full" />}
          </button>

          <button 
            onClick={() => setActiveTab("groups")}
            className={`w-14 md:w-24 h-full relative flex items-center justify-center transition-all ${
              activeTab === "groups" ? "text-[#1877f2]" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800"
            }`}
            title="Join Clans & Betting Syndicates"
          >
            <Users className="w-5 md:w-6 h-5 md:h-6" />
            {activeTab === "groups" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1877f2] rounded-t-full" />}
          </button>

          <button 
            onClick={() => setActiveTab("hub")}
            className={`w-14 md:w-24 h-full relative flex items-center justify-center transition-all ${
              activeTab === "hub" ? "text-[#1877f2]" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800"
            }`}
            title="Sportsbook Odds Center & LookUpto Slip"
          >
            <Gamepad2 className="w-5 md:w-6 h-5 md:h-6" />
            {activeTab === "hub" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1877f2] rounded-t-full" />}
          </button>

          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-14 md:w-24 h-full relative flex items-center justify-center transition-all ${
              activeTab === "profile" ? "text-[#1877f2]" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800"
            }`}
            title="Page Profile"
          >
            <User className="w-5 md:w-6 h-5 md:h-6" />
            {activeTab === "profile" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1877f2] rounded-t-full" />}
          </button>
        </div>

        {/* Right Side Shortcuts */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div 
              onClick={() => setAuthModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/45 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-emerald-200/50 cursor-pointer transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              <span>{currentUser.email || currentUser.phoneNumber}</span>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="py-1 px-3 bg-[#1877f2] hover:bg-blue-600 text-white text-[10px] md:text-xs font-black rounded-lg shadow-xs transition-all flex items-center gap-1 leading-none font-sans cursor-pointer whitespace-nowrap"
            >
              <span>🔑 Register</span>
            </button>
          )}

          {/* Quick wallet readout */}
          <button 
            onClick={() => triggerPinCheck("wallet")}
            className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/25 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-blue-200/50 dark:border-blue-900/40"
          >
            <Wallet className="w-4 h-4 shrink-0" />
            <span className="font-mono">${walletBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </button>

          <button 
            onClick={toggleTheme} 
            className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-[#3a3b3c] dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 rounded-full transition-colors"
            title="Toggle Light/Dark Look"
          >
            {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* 1. APP LAUNCHER SHORTCUTS POPUP (Grid icon button) */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown("launcher")}
              className={`p-2 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                launcherOpen 
                  ? "bg-blue-100 dark:bg-zinc-700 text-[#1877f2] dark:text-blue-400" 
                  : "bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200"
              }`}
              title="Menu Launcher"
            >
              <Grid className="w-5 h-5 animate-pulse-subtle" />
            </button>

            {launcherOpen && (
              <div className="absolute right-[-100px] sm:right-0 mt-3 bg-white dark:bg-[#242526] border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-2xl w-[92vw] sm:w-[580px] max-h-[80vh] overflow-y-auto z-[120] p-4 text-left animate-in fade-in-50 slide-in-from-top-3 duration-200">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white px-2 mb-3">Menu</h3>
                
                {/* Search Menu Input */}
                <div className="relative px-2 mb-4">
                  <div className="flex items-center bg-[#f0f2f5] dark:bg-[#3a3b3c] rounded-full px-3 py-2 border border-transparent focus-within:border-[#1877f2] transition-colors">
                    <Search className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                    <input 
                      type="text" 
                      placeholder="Search menu"
                      value={launcherSearch}
                      onChange={(e) => setLauncherSearch(e.target.value)}
                      className="bg-transparent text-xs w-full outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-sans"
                    />
                  </div>
                </div>

                {/* 2 Column Layout: Left Column Social/Entertainment, Right Column Create */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Left segment (Social, Entertainment, Shopping) */}
                  <div className="md:col-span-3 space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                    {/* Social Section */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1 uppercase tracking-wider">Social</h4>
                      <div className="space-y-1">
                        <button 
                          onClick={() => { setActiveTab("profile"); setLauncherOpen(false); }}
                          className="w-full text-left p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors flex items-start gap-3"
                        >
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-full text-[#1877f2] dark:text-blue-400 shrink-0 mt-0.5">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-gray-900 dark:text-white">Pages</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-normal leading-relaxed">Discover and connect with businesses.</p>
                          </div>
                        </button>

                        <button 
                          onClick={() => { setActiveTab("groups"); setLauncherOpen(false); }}
                          className="w-full text-left p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors flex items-start gap-3"
                        >
                          <div className="p-2 bg-pink-100 dark:bg-pink-900/40 rounded-full text-pink-500 shrink-0 mt-0.5">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-gray-900 dark:text-white">Groups</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-normal leading-relaxed">Connect with people who share your interests.</p>
                          </div>
                        </button>

                        <button 
                          onClick={() => { setActiveTab("home"); setLauncherOpen(false); }}
                          className="w-full text-left p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors flex items-start gap-3"
                        >
                          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-full text-emerald-500 shrink-0 mt-0.5">
                            <HomeIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-gray-900 dark:text-white">News Feed</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-normal leading-relaxed">See relevant posts from people and Pages you follow.</p>
                          </div>
                        </button>

                        <button 
                          onClick={() => { setActiveTab("home"); setLauncherOpen(false); }}
                          className="w-full text-left p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors flex items-start gap-3"
                        >
                          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-full text-indigo-500 shrink-0 mt-0.5">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-gray-900 dark:text-white">Feeds</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-normal leading-relaxed">See the most recent posts from your friends, groups, Pages.</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Entertainment Section */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1 uppercase tracking-wider">Entertainment</h4>
                      <div className="space-y-1">
                        <button 
                          onClick={() => { setActiveTab("watch"); setLauncherOpen(false); }}
                          className="w-full text-left p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors flex items-start gap-3"
                        >
                          <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-full text-amber-500 shrink-0 mt-0.5">
                            <Tv className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-gray-900 dark:text-white">Gaming Video</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-normal leading-relaxed">Watch and connect with your favorite games and streamers.</p>
                          </div>
                        </button>

                        <button 
                          onClick={() => { setActiveTab("hub"); setLauncherOpen(false); }}
                          className="w-full text-left p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors flex items-start gap-3"
                        >
                          <div className="p-2 bg-violet-100 dark:bg-violet-900/40 rounded-full text-violet-500 shrink-0 mt-0.5">
                            <Gamepad2 className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-gray-900 dark:text-white">Play games</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-normal leading-relaxed">Play your favorite sports betting games and lookupto slips.</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Shopping Section */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1 uppercase tracking-wider">Shopping</h4>
                      <div className="space-y-1">
                        <button 
                          onClick={() => { triggerPinCheck("wallet"); setLauncherOpen(false); }}
                          className="w-full text-left p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors flex items-start gap-3"
                        >
                          <div className="p-2 bg-rose-100 dark:bg-rose-900/40 rounded-full text-rose-500 shrink-0 mt-0.5">
                            <Wallet className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-gray-900 dark:text-white">Orders and payments</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-normal leading-relaxed">A seamless, secure way to pay on the apps you already use.</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right segment (Create Column) */}
                  <div className="md:col-span-2 border-t md:border-t-0 md:border-l border-gray-100 dark:border-zinc-800 pt-3 md:pt-0 md:pl-4">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white px-1 mb-2">Create</h4>
                    <div className="space-y-1.5 font-sans">
                      <button 
                        onClick={() => { setLauncherOpen(false); window.scrollTo({ top: 350, behavior: "smooth" }); }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-colors flex items-center gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-gray-700 dark:text-gray-200 shrink-0">
                          <Plus className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-250">Post</span>
                      </button>

                      <button 
                        onClick={() => { setLauncherOpen(false); setCreateGroupModalOpen(true); }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-colors flex items-center gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-gray-700 dark:text-gray-200 shrink-0">
                          <Users className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-[#1877f2] dark:text-blue-450 flex items-center gap-1.5">
                          <span>Group</span> 
                          <span className="text-[9px] bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded uppercase font-black text-blue-600 dark:text-blue-400">Syndicate</span>
                        </span>
                      </button>

                      <button 
                        onClick={() => { setLauncherOpen(false); alert("Story creation wizard is ready! Share your top odds slip on your stories feed."); }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-colors flex items-center gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-gray-700 dark:text-gray-200 shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-250">Story</span>
                      </button>

                      <button 
                        onClick={() => { setLauncherOpen(false); alert("Upload a sports reaction short Reel video or game summary commentary."); }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-colors flex items-center gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-gray-700 dark:text-gray-200 shrink-0">
                          <Tv className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-250">Reel</span>
                      </button>

                      <div className="text-[9px] text-gray-400 dark:text-gray-500 pt-4 px-2 italic">
                        Clicking Group directly launches the facelook P2P Group Creator dialog!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. MESSENGER CHATS POPUP (MessageSquare icon button) */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown("messenger")}
              className={`p-2 rounded-full transition-all cursor-pointer flex items-center justify-center relative ${
                messengerOpen 
                  ? "bg-blue-100 dark:bg-zinc-700 text-[#1877f2] dark:text-blue-400" 
                  : "bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200"
              }`}
              title="Chats Messenger"
            >
              <MessageSquare className="w-5 h-5" />
              {!messengerUnlocked && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-[#242526]">
                  🔒
                </span>
              )}
            </button>

            {messengerOpen && (
              <div className="absolute right-[-60px] sm:right-0 mt-3 bg-white dark:bg-[#242526] border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-2xl w-[90vw] sm:w-[360px] max-h-[820px] z-[120] flex flex-col overflow-hidden text-left animate-in py-1 duration-150">
                
                {/* Header title */}
                <div className="p-3.5 flex items-center justify-between pb-2">
                  <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">Chats</h3>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <button onClick={() => alert("Messenger global setings")} className="p-1 hover:bg-gray-150 dark:hover:bg-zinc-800 rounded-full text-xs font-bold leading-none cursor-pointer">•••</button>
                    <button className="text-xs p-1 hover:bg-gray-150 dark:hover:bg-zinc-800 rounded-full">⛶</button>
                    <button onClick={() => alert("Write new secure peer-to-peer message")} className="text-xs p-1 hover:bg-gray-150 dark:hover:bg-zinc-800 rounded-full">📝</button>
                  </div>
                </div>

                {/* Messenger search bar */}
                <div className="px-3 pb-2.5">
                  <div className="flex items-center bg-[#f0f2f5] dark:bg-[#3a3b3c] rounded-full px-3 py-1.5 border border-transparent">
                    <Search className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
                    <input 
                      type="text" 
                      placeholder="Search Messenger" 
                      value={messengerSearchQuery}
                      onChange={(e) => setMessengerSearchQuery(e.target.value)}
                      className="bg-transparent text-xs w-full outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Sub Tab Buttons */}
                <div className="flex items-center gap-1.5 px-3 mb-2 font-sans select-none text-[11px] font-bold">
                  {(["all", "unread", "groups", "communities"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setMessengerActiveTab(tab)}
                      className={`px-3 py-1 rounded-full capitalize cursor-pointer transition-all ${
                        messengerActiveTab === tab
                          ? "bg-blue-50 dark:bg-blue-900/30 text-[#1877f2] dark:text-blue-400 font-extrabold"
                          : "text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* PIN Lock code notification banner */}
                {!messengerUnlocked ? (
                  <div className="m-3 p-3.5 bg-blue-50 dark:bg-[#1a2e4c] border border-blue-200/50 dark:border-blue-900/60 rounded-xl space-y-2">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1 bg-blue-105 dark:bg-blue-952 text-[#1877f2] dark:text-blue-350 rounded-full mt-0.5">
                        <Info className="w-5 h-5 shrink-0" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-gray-800 dark:text-[#f0f2f5]">Chat history is missing</h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal">Enter your PIN to restore chat history.</p>
                      </div>
                    </div>
                    
                    {/* PIN interactive digits panel */}
                    <div className="flex items-center justify-between gap-1 pt-1.5">
                      {messengerPin.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`msg-pin-${idx}`}
                          type="password"
                          maxLength={1}
                          pattern="[0-9]*"
                          inputMode="numeric"
                          value={digit}
                          placeholder="-"
                          onChange={(e) => handlePinChange(idx, e.target.value)}
                          className="w-8 h-9 text-center bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm font-black text-blue-600 dark:text-blue-400 focus:outline-[#1877f2]"
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <button 
                        onClick={() => alert("Universal Decrypt hint: enter any 6 digits (e.g. 123456) in the input boxes to unlock and list details of secure conversations.")}
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                      >
                        Forgot PIN?
                      </button>
                      <button 
                        onClick={() => setMessengerUnlocked(true)}
                        className="text-[9px] bg-[#1877f2] hover:bg-blue-600 text-white font-mono px-2 py-0.5 rounded font-bold"
                      >
                        Skip & Reveal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="m-3 p-2 bg-emerald-50 dark:bg-emerald-952/40 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-400">
                    <span className="flex items-center gap-1">🟢 Chat synchronization secure</span>
                    <button onClick={() => { setMessengerUnlocked(false); setMessengerPin(["", "", "", "", "", ""]); }} className="text-gray-400 hover:text-gray-900 font-bold">Lock</button>
                  </div>
                )}

                {/* Chats roster list */}
                <div className={`max-h-[350px] overflow-y-auto divide-y divide-gray-100 dark:divide-zinc-800 transition-all ${!messengerUnlocked ? "blur-xs opacity-50 select-none pointer-events-none" : ""}`}>
                  {messengerChats
                    .filter(c => {
                      if (messengerActiveTab === "unread" && c.status !== "online") return false;
                      if (messengerSearchQuery && !c.name.toLowerCase().includes(messengerSearchQuery.toLowerCase())) return false;
                      return true;
                    })
                    .map((chat) => (
                      <div 
                        key={chat.id}
                        onClick={() => alert(`Entering direct chat with ${chat.name}... Hello! Send safe peer bets.`)}
                        className="p-3 hover:bg-gray-50 dark:hover:bg-zinc-850 flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="relative shrink-0 select-none">
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(chat.name)}&backgroundColor=1877f2`} 
                            className="w-10 h-10 rounded-full border border-gray-100 dark:border-zinc-800"
                            alt={chat.name}
                          />
                          {chat.status === "online" && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#242526]" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between">
                            <h4 className="text-xs font-black text-gray-900 dark:text-gray-100 group-hover:text-[#1877f2] transition-colors">{chat.name}</h4>
                            <span className="text-[10px] font-mono text-gray-400">{chat.time}</span>
                          </div>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate leading-relaxed pt-0.5">
                            {chat.text}
                          </p>
                        </div>

                        {chat.status === "online" && (
                          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0" />
                        )}
                      </div>
                    ))}
                </div>

                <div className="p-2 border-t border-gray-100 dark:border-zinc-800 text-center bg-gray-50 dark:bg-zinc-900">
                  <button 
                    onClick={() => alert("Launching standalone Facelook Messenger client module...")}
                    className="text-[11px] font-bold text-[#1877f2] dark:text-blue-450 hover:underline cursor-pointer"
                  >
                    See all in Messenger
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. NOTIFICATIONS POPOVER (Bell icon button) */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown("notifications")}
              className={`p-2 rounded-full transition-all cursor-pointer flex items-center justify-center relative ${
                notificationsOpen 
                  ? "bg-blue-100 dark:bg-zinc-700 text-[#1877f2] dark:text-blue-400" 
                  : "bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200"
              }`}
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notificationList.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-650 text-white font-mono text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse border-2 border-white dark:border-[#242526]">
                  {notificationList.filter(n => !n.read).length}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-[-40px] sm:right-0 mt-3 bg-white dark:bg-[#242526] border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-2xl w-[90vw] sm:w-[350px] max-h-[80vh] overflow-y-auto z-[120] text-left animate-in slide-in-from-top-2 duration-150 py-1.5 flex flex-col">
                
                {/* Header Title with Optional More Dots Toggle menu */}
                <div className="p-3 flex items-center justify-between relative">
                  <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">Notifications</h3>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setNotifOptionsMenuOpen(!notifOptionsMenuOpen)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full font-black text-gray-500 cursor-pointer text-sm"
                    >
                      •••
                    </button>

                    {/* Screenshot 1 styled Options Menu */}
                    {notifOptionsMenuOpen && (
                      <div className="absolute right-0 mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-2xl w-48 py-1 z-[130] text-left">
                        <button 
                          onClick={() => {
                            setNotificationList(notificationList.map(n => ({...n, read: true})));
                            setNotifOptionsMenuOpen(false);
                            alert("All alerts marked read.");
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-zinc-700 text-xs font-bold text-gray-850 dark:text-gray-150 flex items-center gap-2"
                        >
                          <Check className="w-3.5 h-3.5 text-green-500" />
                          <span>Mark all as read</span>
                        </button>
                        <button 
                          onClick={() => { setNotifOptionsMenuOpen(false); alert("Opening Notification constraints page..."); }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-zinc-700 text-xs font-bold text-gray-850 dark:text-gray-150 flex items-center gap-2"
                        >
                          <Settings className="w-3.5 h-3.5 text-gray-400" />
                          <span>Notification settings</span>
                        </button>
                        <button 
                          onClick={() => { setNotifOptionsMenuOpen(false); }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-zinc-700 text-xs font-bold text-gray-850 dark:text-gray-150 flex items-center gap-2"
                        >
                          <Bell className="w-3.5 h-3.5 text-blue-500" />
                          <span>Open Notifications</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-tabs "All" & "Unread" layout from the screenshots */}
                <div className="flex items-center gap-2 px-3 pb-2 border-b border-gray-100 dark:border-zinc-805 select-none font-sans text-xs">
                  <button 
                    onClick={() => setNotificationsFilterTab("all")}
                    className={`px-3 py-1.5 rounded-full font-black ${
                      notificationsFilterTab === "all" 
                        ? "bg-blue-100 dark:bg-blue-900/35 text-blue-600 dark:text-blue-400" 
                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setNotificationsFilterTab("unread")}
                    className={`px-3 py-1.5 rounded-full font-black ${
                      notificationsFilterTab === "unread" 
                        ? "bg-blue-100 dark:bg-blue-900/35 text-blue-600 dark:text-blue-400" 
                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    Unread
                  </button>
                </div>

                {/* Main scroll list */}
                <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50 dark:divide-zinc-800/40 font-sans">
                  
                  {/* New notifications section */}
                  <div className="p-3 pb-1 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-gray-905 dark:text-white">New</span>
                    <button onClick={() => alert("Marked recent activities read.")} className="text-[#1877f2] hover:underline text-[11px] font-bold">See all</button>
                  </div>

                  {notificationList
                    .filter(n => {
                      if (notificationsFilterTab === "unread" && n.read) return false;
                      if (n.id === "noti-spec-4" && samuelWerungaStatus === "dismissed") return false;
                      return n.category === "new";
                    })
                    .map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => {
                          setNotificationList(notificationList.map(notif => notif.id === item.id ? { ...notif, read: true } : notif));
                        }}
                        className={`p-3 text-xs flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-zinc-800/60 cursor-pointer ${!item.read ? "bg-blue-50/40 dark:bg-blue-950/15" : ""}`}
                      >
                        <div className="relative shrink-0 select-none">
                          <img src={item.avatar} className="w-11 h-11 rounded-full object-cover" alt="author" />
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border-2 border-white dark:border-[#242526] ${
                            item.type === "like" ? "bg-blue-500 text-white" : "bg-emerald-500 text-white"
                          }`}>
                            {item.type === "like" ? "👍" : "👤"}
                          </div>
                        </div>

                        <div className="flex-1">
                          <p className="text-gray-800 dark:text-gray-200 leading-normal">
                            <span className="font-extrabold text-gray-900 dark:text-white mr-1">{item.names}</span> 
                            <span className="font-normal text-gray-600 dark:text-gray-300">{item.action}</span>
                          </p>
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-1 block">{item.time} ago</span>

                          {/* Interactive Samuel follow buttons (Specific to Samuel Werunga card in screenshots!) */}
                          {item.id === "noti-spec-4" && (
                            <div className="flex items-center gap-2 pt-2 text-[11.5px] select-none">
                              {samuelWerungaStatus === "follow" ? (
                                <>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setSamuelWerungaStatus("following"); alert("You succeeded in following back Samuel Werunga!"); }}
                                    className="px-4 py-1.5 bg-[#1877f2] hover:bg-blue-600 font-extrabold text-white rounded-lg transition-transform"
                                  >
                                    Follow Back
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setSamuelWerungaStatus("dismissed"); }}
                                    className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 font-extrabold text-gray-700 dark:text-gray-150 rounded-lg transition-transform"
                                  >
                                    Dismiss
                                  </button>
                                </>
                              ) : (
                                <span className="bg-emerald-55 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 font-black border border-emerald-200 px-2.5 py-1 rounded-lg">
                                  ✓ Following
                                </span>
                              )}
                            </div>
                          )}

                          {/* @ts-ignore */}
                          {item.isProposal && (
                            <div className="mt-2.5 p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/35 border border-indigo-200 dark:border-indigo-800 text-xs text-left">
                              <div className="font-semibold text-indigo-700 dark:text-indigo-300">
                                Proposed Change Details:
                              </div>
                              <div className="mt-1 space-y-1 font-mono text-[10.5px] text-gray-700 dark:text-gray-300">
                                {/* @ts-ignore */}
                                <div>Match: <span className="text-gray-950 dark:text-white font-bold">{item.proposalMatchName}</span></div>
                                {/* @ts-ignore */}
                                <div>Original: <span className="line-through text-red-500 font-semibold">{item.proposalOldMarket}</span></div>
                                {/* @ts-ignore */}
                                <div>Counter-Market: <span className="text-blue-500 font-extrabold">{item.proposalNewMarket}</span></div>
                                {/* @ts-ignore */}
                                <div>Commit Stake: <span className="font-extrabold text-[#1877f2] dark:text-blue-400">${item.proposalStake?.toFixed(2)}</span></div>
                              </div>
                              
                              {/* @ts-ignore */}
                              {item.proposalStatus === "pending" ? (
                                <div className="mt-2 flex gap-1.5 pt-1.5 border-t border-indigo-100 dark:border-indigo-900/65">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Confirm/Accept the proposed change!
                                      // @ts-ignore
                                      const isCollab = item.isCollaboration;
                                      // @ts-ignore
                                      const stakeAm = item.proposalStake || 0;
                                      
                                      if (isCollab) {
                                        // It's a collaboration proposal!
                                        // The acceptor already paid `stakeAm` which is locked in escrow.
                                        // "if accepted then the challenge is posted in global"
                                        const newCollabChallenge = {
                                          id: `collab-challenge-${Date.now()}`,
                                          // @ts-ignore
                                          user: `${item.oppUser || "Collaborator"} & You`,
                                          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Us&backgroundColor=10b981`,
                                          status: "LIVE" as const,
                                          // @ts-ignore
                                          matchName: item.proposalMatchName,
                                          isProposedMarket: false,
                                        };
                                        setCustomGlobalChallenges(prev => [newCollabChallenge, ...prev]);
                                        // @ts-ignore
                                        alert(`Perfect! You accepted @${item.oppUser}'s custom collaboration proposal on market: "${item.proposalNewMarket}". The challenge has been posted freely in the global pool with zero sendoff charges!`);
                                      } else {
                                        if (walletBalance < stakeAm) {
                                          alert(`Insufficient wallet balance to accept this $${stakeAm.toFixed(2)} change.`);
                                          return;
                                        }
                                        setWalletBalance((prev) => prev - stakeAm);
                                        setTransactions([
                                          {
                                            id: `tx-${Date.now()}`,
                                            type: "bet_stake",
                                            amount: stakeAm,
                                            time: "Just now",
                                            // @ts-ignore
                                            target: `Approved Change: ${item.proposalNewMarket} on ${item.proposalMatchName}`,
                                          },
                                          ...transactions,
                                        ]);
                                        // @ts-ignore
                                        alert(`Perfect! You accepted @${item.oppUser}'s customized market proposal: "${item.proposalNewMarket}". Escrow funds ($${stakeAm.toFixed(2)}) committed successfully!`);
                                      }

                                      // Update proposal state
                                      setNotificationList(prevNotifs => 
                                        prevNotifs.map(notif => 
                                          notif.id === item.id 
                                            // @ts-ignore
                                            ? { ...notif, proposalStatus: "accepted", action: `approved and sealed your request to change the market for ${item.proposalMatchName} to "${item.proposalNewMarket}"` }
                                            : notif
                                        )
                                      );
                                    }}
                                    className="px-2.5 py-1 bg-green-600 hover:bg-green-700 font-extrabold text-white text-[10.5px] rounded-md transition-all cursor-pointer"
                                  >
                                    Accept Change
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Decline and Cancel
                                      // @ts-ignore
                                      const isCollab = item.isCollaboration;
                                      // @ts-ignore
                                      const refundAm = item.proposalStake || 0;

                                      if (isCollab && refundAm > 0) {
                                        // "if declined, the amount of money debited from the acceptor is refunded showing a fail in collaboration"
                                        setWalletBalance((prev) => prev + refundAm);
                                        setTransactions([
                                          {
                                            id: `tx-collab-refund-${Date.now()}`,
                                            type: "deposit",
                                            amount: refundAm,
                                            time: "Just now",
                                            // @ts-ignore
                                            target: `Collaboration Refund: Proposal declined on ${item.proposalMatchName}`,
                                          },
                                          ...transactions,
                                        ]);
                                        alert(`Collaboration proposal declined. Your contribution of $${refundAm.toFixed(2)} has been fully refunded, showing a fail in collaboration.`);
                                      } else {
                                        alert(`The proposal change was declined and canceled.`);
                                      }

                                      setNotificationList(prevNotifs => 
                                        prevNotifs.map(notif => 
                                          notif.id === item.id 
                                            // @ts-ignore
                                            ? { 
                                                ...notif, 
                                                proposalStatus: "declined", 
                                                action: isCollab 
                                                  // @ts-ignore
                                                  ? `declined your collaboration request on ${item.proposalMatchName} to "${item.proposalNewMarket}" (refunded)` 
                                                  // @ts-ignore
                                                  : `declined your request to change the market on ${item.proposalMatchName} to "${item.proposalNewMarket}" (challenge canceled)` 
                                              }
                                            : notif
                                        )
                                      );
                                    }}
                                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 font-extrabold text-white text-[10.5px] rounded-md transition-all cursor-pointer"
                                  >
                                    Decline & Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="mt-2 text-[10.5px] font-bold">
                                  {/* @ts-ignore */}
                                  {item.proposalStatus === "accepted" ? (
                                    <span className="text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 shadow-xs">
                                      ✓ Accepted & Sealed
                                    </span>
                                  ) : (
                                    <span className="text-red-605 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 shadow-xs">
                                      ✗ Declined / Canceled
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {!item.read && (
                          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0 self-center" />
                        )}
                      </div>
                    ))}

                  {/* Earlier section */}
                  <div className="p-3 pb-1 text-xs font-extrabold text-gray-905 dark:text-white bg-gray-50/50 dark:bg-[#1a1b1c] border-y border-gray-100 dark:border-zinc-800">
                    Earlier
                  </div>

                  {notificationList
                    .filter(n => {
                      if (notificationsFilterTab === "unread" && n.read) return false;
                      return n.category === "earlier";
                    })
                    .map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => {
                          setNotificationList(notificationList.map(notif => notif.id === item.id ? { ...notif, read: true } : notif));
                        }}
                        className={`p-3 text-xs flex items-start gap-3 hover:bg-gray-55/65 dark:hover:bg-zinc-800/60 cursor-pointer ${!item.read ? "bg-blue-50/40 dark:bg-blue-950/15" : ""}`}
                      >
                        <div className="relative shrink-0 select-none">
                          <img src={item.avatar} className="w-11 h-11 rounded-full object-cover" alt="author" />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[10px] text-white border-2 border-white dark:border-[#242526]">
                            💬
                          </div>
                        </div>

                        <div className="flex-1">
                          <p className="text-gray-800 dark:text-gray-200 leading-normal">
                            <span className="font-extrabold text-gray-900 dark:text-white mr-1">{item.names}</span>
                            <span className="font-normal text-gray-600 dark:text-gray-300">{item.action}</span>
                          </p>
                          <span className="text-[10px] text-gray-400 mt-1 block">{item.time} ago</span>
                        </div>

                        {!item.read && (
                          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0 self-center" />
                        )}
                      </div>
                    ))}
                </div>

                {/* Footer of Notifications */}
                <div className="p-2 border-t border-gray-150 dark:border-zinc-805 text-center bg-gray-55/60 dark:bg-[#1a1b1c]">
                  <button 
                    onClick={() => {
                      alert("Successfully retrieved previous daily activities feeds.");
                    }}
                    className="w-full py-1.5 bg-gray-150 dark:bg-[#323334] hover:bg-gray-200 text-gray-700 dark:text-gray-200 font-extrabold text-xs rounded-xl cursor-pointer"
                  >
                    See previous notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. PROFILE / ACCOUNT DROPDOWN (Avatar selector popup matching Screenshot 3) */}
          <div className="relative">
            <div 
              onClick={() => toggleDropdown("profile")}
              className="relative cursor-pointer group select-none active:scale-95 transition-transform"
            >
              <img 
                src={PROFILES[activeProfilePage]?.avatar || PROFILES["Collins Dnego"].avatar} 
                className="w-9 h-9 rounded-full object-cover border-2 border-gray-300 dark:border-zinc-700 group-hover:border-[#1877f2] transition-colors" 
                alt="User avatar" 
              />
              <span className="absolute bottom-[-2px] right-[-2px] bg-gray-200 dark:bg-zinc-800 p-0.5 rounded-full border border-white dark:border-zinc-800 text-[8px]">
                ▼
              </span>
            </div>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-3 bg-white dark:bg-[#242526] border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-2xl w-[90vw] sm:w-[350px] z-[120] p-4 text-left animate-in duration-200">
                
                {/* Profiles section matching Screenshot 3 */}
                <div className="bg-[#f7f8fa] dark:bg-[#1c1d1e] rounded-xl p-2.5 border border-gray-200/55 dark:border-zinc-800 shadow-sm space-y-2 mb-3">
                  
                  <div className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest pb-1 border-b border-gray-150 dark:border-zinc-804/50 mb-1">
                    Personal Accounts
                  </div>

                  {/* Option 1: Collins Dnego */}
                  <div 
                    onClick={() => {
                      setActiveProfilePage("Collins Dnego");
                      alert("Switched live session to: Collins Dnego");
                    }}
                    className={`p-2 rounded-lg pointer flex items-center justify-between cursor-pointer transition-all ${
                      activeProfilePage === "Collins Dnego" 
                        ? "bg-white dark:bg-[#242526] border border-[#1877f2] shadow-xs" 
                        : "hover:bg-gray-100 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2" className="w-9 h-9 rounded-full border" alt="cd" />
                      <div className="text-left font-sans min-w-0">
                        <span className="text-xs font-black text-gray-900 dark:text-gray-150 block truncate">Collins Dnego</span>
                        <span className="text-[9px] text-gray-400 block font-normal">Active User Profile</span>
                      </div>
                    </div>
                    {activeProfilePage === "Collins Dnego" && (
                      <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">✓</span>
                    )}
                  </div>

                  {/* Option 2: Zephaniah Mwangi */}
                  <div 
                    onClick={() => {
                      setActiveProfilePage("Zephaniah Mwangi");
                      alert("Switched live session to: Zephaniah Mwangi's profile");
                    }}
                    className={`p-2 rounded-lg pointer flex items-center justify-between cursor-pointer transition-all ${
                      activeProfilePage === "Zephaniah Mwangi" 
                        ? "bg-white dark:bg-[#242526] border border-[#1877f2] shadow-xs" 
                        : "hover:bg-gray-100 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zephaniah&backgroundColor=a855f7" className="w-9 h-9 rounded-full border" alt="zm" />
                      <div className="text-left font-sans min-w-0">
                        <span className="text-xs font-black text-gray-950 dark:text-gray-200 block truncate">Zephaniah Mwangi</span>
                        <span className="text-[9px] text-gray-400 block font-normal">Predictor Clan-Lead</span>
                      </div>
                    </div>
                    {activeProfilePage === "Zephaniah Mwangi" && (
                      <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">✓</span>
                    )}
                  </div>

                  <div className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest pt-2 pb-1 border-b border-gray-150 dark:border-zinc-804/50 mb-1">
                    Managed Pages
                  </div>

                  {/* Option 4: Collo Dnego */}
                  <div 
                    onClick={() => {
                      setActiveProfilePage("Collo Dnego");
                      alert("Switched live session to page: Collo Dnego");
                    }}
                    className={`p-2 rounded-lg pointer flex items-center justify-between cursor-pointer transition-all ${
                      activeProfilePage === "Collo Dnego" 
                        ? "bg-white dark:bg-[#242526] border border-[#1877f2] shadow-xs" 
                        : "hover:bg-gray-100 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Collo&backgroundColor=059669" className="w-9 h-9 rounded-full border" alt="cd" />
                      <div className="text-left font-sans min-w-0">
                        <span className="text-xs font-black text-gray-900 dark:text-gray-150 block truncate">Collo Dnego</span>
                        <span className="text-[9px] text-gray-400 block font-normal">Managed Fan Club Page</span>
                      </div>
                    </div>
                    {activeProfilePage === "Collo Dnego" && (
                      <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">✓</span>
                    )}
                  </div>

                  {/* See all profiles button */}
                  <button 
                    onClick={() => alert("Successfully synchronized all live profile manager assets.")}
                    className="w-full py-1.5 px-3 bg-gray-200/55 hover:bg-gray-200 dark:bg-[#2c2d2e] dark:hover:bg-[#3c3d3e] text-gray-800 dark:text-gray-200 font-extrabold text-[12px] rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>See all profiles (3 synchronized)</span>
                  </button>
                </div>

                {/* Primary Settings Menu rows of Screenshot 3 */}
                <div className="space-y-1 py-1 font-sans text-xs">
                  <button 
                    onClick={() => alert("Launching Settings & privacy overlay center")}
                    className="w-full p-2.5 hover:bg-gray-100 dark:hover:bg-zinc-800/60 rounded-xl flex items-center justify-between transition-colors text-gray-800 dark:text-gray-200"
                  >
                    <div className="flex items-center gap-3 font-bold">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-gray-300">
                        <Settings className="w-4 h-4" />
                      </div>
                      <span>Settings & privacy</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  <button 
                    onClick={() => alert("Connecting live interactive customer support...")}
                    className="w-full p-2.5 hover:bg-gray-100 dark:hover:bg-zinc-800/60 rounded-xl flex items-center justify-between transition-colors text-gray-800 dark:text-gray-200"
                  >
                    <div className="flex items-center gap-3 font-bold">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-gray-300">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <span>Help & support</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  <button 
                    onClick={() => { toggleTheme(); }}
                    className="w-full p-2.5 hover:bg-gray-100 dark:hover:bg-zinc-800/60 rounded-xl flex items-center justify-between transition-colors text-gray-800 dark:text-gray-200"
                  >
                    <div className="flex items-center gap-3 font-bold">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-gray-300">
                        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      </div>
                      <span>Display & accessibility</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  <button 
                    onClick={() => alert("Thanks for your valuable advice! Feedbacks submitted to the admin team.")}
                    className="w-full p-2.5 hover:bg-gray-100 dark:hover:bg-zinc-800/60 rounded-xl flex items-center justify-between transition-colors text-gray-800 dark:text-gray-200"
                  >
                    <div className="flex items-center gap-2 font-bold w-full">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-gray-300">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <p>Give feedback</p>
                        <span className="text-[9px] text-gray-400 block font-normal">CTRL B</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                  </button>

                  <button 
                    onClick={() => {
                      setCurrentUser(null);
                      setProfileMenuOpen(false);
                      alert("Successfully logged out of active profile page session.");
                    }}
                    className="w-full p-2.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl flex items-center gap-3 transition-colors text-red-600 dark:text-red-400 font-bold"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-100/50 dark:bg-red-950/40 flex items-center justify-center">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span>Log out</span>
                  </button>
                </div>

                {/* Footer terms exact match to Screenshot 3 */}
                <div className="text-[10px] text-gray-400 dark:text-gray-500 pt-3 border-t border-gray-100 dark:border-zinc-800 mt-2 font-normal leading-relaxed text-center">
                  Privacy · Terms · Advertising · Ad Choices ▷ · Cookies · More · Facelook © 2026
                </div>

              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN NAVIGATION DRAWER - Slide-in from Left (Improved to match Screenshot 2) */}
      <div className={`fixed inset-0 z-[1000] flex transition-all duration-300 ${isMainMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div 
          onClick={() => setIsMainMenuOpen(false)} 
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isMainMenuOpen ? "opacity-100" : "opacity-0"}`}
        />
        
        <div className={`relative bg-white dark:bg-[#1c1d1f] w-[85vw] max-w-[360px] h-full shadow-2xl flex flex-col overflow-hidden font-sans transition-transform duration-300 ease-in-out ${isMainMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          
          {/* DRAWER HEADER */}
            <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-[#1c1d1f]">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black text-[#1877f2] tracking-tighter">facelook</span>
                  <span className="bg-[#1877f2] text-white text-[10px] font-black px-1.5 py-0.5 rounded leading-none uppercase">BET</span>
                </div>
                <p className="text-[10px] font-bold text-gray-400">Play • Predict • Win Together</p>
              </div>
              <button 
                onClick={() => setIsMainMenuOpen(false)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full text-gray-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none bg-[#f7f8fa] dark:bg-zinc-950/20">
              {/* PROFILE CARD - Refined to match Screenshot 2 */}
              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[28px] p-4 space-y-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center overflow-hidden border-2 border-white dark:border-zinc-800 shadow-md">
                    <img 
                      src={PROFILES[activeProfilePage]?.avatar || PROFILES["Collins Dnego"].avatar} 
                      alt="Avatar" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight">
                      {PROFILES[activeProfilePage]?.name || "Collins Dnego"}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-4 h-4 bg-blue-600 rounded-md flex items-center justify-center rotate-45">
                        <Star className="w-2 h-2 text-white fill-current -rotate-45" />
                      </div>
                      <p className="text-[11px] font-bold text-gray-500">{PROFILES[activeProfilePage]?.desc || "Elite LookUpto Bettor"}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>

                <div className="pt-3 border-t border-gray-50 dark:border-zinc-800/50">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Wallet Balance</p>
                    <ChevronRight className="w-3 h-3 text-gray-300" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-black text-[#1877f2]">KES {walletBalance.toLocaleString()}.00</span>
                  </div>
                </div>
              </div>

              {/* MENU ITEMS - Preservation of exact tabs from user screenshot */}
              <div className="space-y-4 pb-8">
                {/* SECTION 1 */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm">
                  <DrawerMenuRow 
                    icon={<Gamepad2 className="w-5 h-5 fill-current" />}
                    title="Game Hub"
                    subtitle="Bet, challenge & compete"
                    onClick={() => { setActiveTab("hub"); setIsMainMenuOpen(false); }}
                    isFirst
                    isActive
                  />
                  <DrawerMenuRow 
                    icon={<Trophy className="w-5 h-5" />}
                    title="My Challenges"
                    subtitle="All your bets & challenges"
                    badge="12"
                    onClick={() => { setActiveTab("challenges"); setIsMainMenuOpen(false); }}
                  />
                  <DrawerMenuRow 
                    icon={<MessageSquare className="w-5 h-5" />}
                    title="Challenge Invites"
                    subtitle="Invites waiting for your action"
                    badge="3"
                    onClick={() => { setActiveTab("challenges"); setIsMainMenuOpen(false); }}
                  />
                  <DrawerMenuRow 
                    icon={<Wallet className="w-5 h-5" />}
                    title="Wallet"
                    subtitle="Deposit, withdraw & history"
                    onClick={() => { setIsMainMenuOpen(false); }}
                  />
                  <DrawerMenuRow 
                    icon={<Users className="w-5 h-5" />}
                    title="Friends"
                    subtitle="Connect & challenge friends"
                    onClick={() => { setIsMainMenuOpen(false); }}
                    isLast
                  />
                </div>

                {/* SECTION 2 */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm">
                  <DrawerMenuRow 
                    icon={<Tv className="w-5 h-5" />}
                    title="Watch Hub"
                    subtitle="Live streams & highlights"
                    onClick={() => { setActiveTab("watch"); setIsMainMenuOpen(false); }}
                    isFirst
                  />
                  <DrawerMenuRow 
                    icon={<Video className="w-5 h-5" />}
                    title="Creator Studio"
                    subtitle="Create, share & grow"
                    onClick={() => { setActiveTab("creator_studio"); setIsMainMenuOpen(false); }}
                  />
                  <DrawerMenuRow 
                    icon={<Flag className="w-5 h-5" />}
                    title="Pages"
                    subtitle="Manage your pages"
                    onClick={() => { setActiveTab("pages"); setIsMainMenuOpen(false); }}
                  />
                  <DrawerMenuRow 
                    icon={<Users className="w-5 h-5" />}
                    title="LookGroups"
                    subtitle="Join or create groups"
                    onClick={() => { setActiveTab("groups"); setIsMainMenuOpen(false); }}
                    isLast
                  />
                </div>

                {/* SECTION 3 */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm">
                  <DrawerMenuRow 
                    icon={<Sparkles className="w-5 h-5" />}
                    title="AI Assistant"
                    subtitle="Smarter predictions & tips"
                    onClick={() => { setIsMainMenuOpen(false); }}
                    isFirst
                  />
                  <DrawerMenuRow 
                    icon={<Bell className="w-5 h-5" />}
                    title="Notifications"
                    subtitle="Stay updated"
                    badge="2"
                    onClick={() => { setIsMainMenuOpen(false); }}
                  />
                  <DrawerMenuRow 
                    icon={<Settings className="w-5 h-5" />}
                    title="Settings"
                    subtitle="Account & preferences"
                    onClick={() => { setIsMainMenuOpen(false); }}
                    isLast
                  />
                </div>

                {/* EXPANDABLE SEE MORE */}
                {showMoreMenu && (
                  <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm transition-all duration-300">
                    <DrawerMenuRow 
                      icon={<History className="w-5 h-5" />}
                      title="Memo"
                      onClick={() => { setActiveTab("memo"); setIsMainMenuOpen(false); }}
                      isFirst
                    />
                    <DrawerMenuRow 
                      icon={<Bookmark className="w-5 h-5" />}
                      title="Saved Videos & Posts"
                      onClick={() => { setIsMainMenuOpen(false); }}
                    />
                    <DrawerMenuRow 
                      icon={<Film className="w-5 h-5" />}
                      title="Reels"
                      onClick={() => { setIsMainMenuOpen(false); }}
                    />
                    <DrawerMenuRow 
                      icon={<Store className="w-5 h-5" />}
                      title="Marketplace"
                      onClick={() => { setActiveTab("marketplace"); setIsMainMenuOpen(false); }}
                    />
                    <DrawerMenuRow 
                      icon={<TrendingUp className="w-5 h-5" />}
                      title="Ads Manager"
                      onClick={() => { setIsMainMenuOpen(false); }}
                    />
                    <DrawerMenuRow 
                      icon={<Gift className="w-5 h-5" />}
                      title="Birthdays"
                      onClick={() => { setIsMainMenuOpen(false); }}
                    />
                    <DrawerMenuRow 
                      icon={<Calendar className="w-5 h-5" />}
                      title="Events"
                      onClick={() => { setIsMainMenuOpen(false); }}
                    />
                    <DrawerMenuRow 
                      icon={<Rss className="w-5 h-5" />}
                      title="Feeds"
                      onClick={() => { setIsMainMenuOpen(false); }}
                    />
                    <DrawerMenuRow 
                      icon={<Tv className="w-5 h-5" />}
                      title="Gaming Video"
                      onClick={() => { setIsMainMenuOpen(false); }}
                    />
                    <DrawerMenuRow 
                      icon={<MessageCircle className="w-5 h-5" />}
                      title="Messenger"
                      onClick={() => { setIsMainMenuOpen(false); }}
                    />
                    <DrawerMenuRow 
                      icon={<Smile className="w-5 h-5" />}
                      title="Messenger Kids"
                      onClick={() => { setIsMainMenuOpen(false); }}
                    />
                    <DrawerMenuRow 
                      icon={<CreditCard className="w-5 h-5" />}
                      title="Orders and payments"
                      onClick={() => { setIsMainMenuOpen(false); }}
                    />
                    <DrawerMenuRow 
                      icon={<Gamepad2 className="w-5 h-5" />}
                      title="Play games"
                      onClick={() => { setActiveTab("hub"); setIsMainMenuOpen(false); }}
                    />
                    <DrawerMenuRow 
                      icon={<Activity className="w-5 h-5" />}
                      title="Recent ad activity"
                      onClick={() => { setIsMainMenuOpen(false); }}
                      isLast
                    />
                  </div>
                )}

                <button 
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="w-full flex items-center gap-4 p-4 bg-gray-200/50 dark:bg-zinc-800/50 border border-transparent rounded-[24px] hover:bg-gray-200 dark:hover:bg-zinc-800 transition-all active:scale-95"
                >
                  <div className="w-9 h-9 bg-white dark:bg-zinc-900 shadow-sm rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400">
                    {showMoreMenu ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                  </div>
                  <span className="text-[15px] font-black text-gray-900 dark:text-white">
                    {showMoreMenu ? "See less" : "See more"}
                  </span>
                </button>
              </div>
            </div>

            {/* LOGOUT FOOTER */}
            <div className="p-4 bg-[#f7f8fa] dark:bg-zinc-950/20 pb-8">
              <button 
                onClick={() => {
                  setCurrentUser(null);
                  setIsMainMenuOpen(false);
                  alert("Successfully logged out.");
                }}
                className="w-full flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all active:scale-95 group"
              >
                <LogOut className="w-6 h-6 text-red-500 shrink-0 ml-2" />
                <div className="flex-1 text-left">
                  <p className="text-[15px] font-black text-red-500 leading-none mb-1">Logout</p>
                  <p className="text-[11px] font-bold text-gray-400 leading-tight">Sign out of FaceLook Bet</p>
                </div>
              </button>
            </div>
          </div>
        </div>

      {/* SEARCH CRAWLED BRIEF NOTIFIER */}
      {searchResponse && (
        <div className="bg-blue-600 text-white text-xs py-2.5 px-4 text-center flex items-center justify-center gap-2 shadow-inner">
          <Sparkles className="w-4 h-4 fill-white" />
          <span><strong>Search grounded result:</strong> {searchResponse}</span>
          <button onClick={() => setSearchResponse("")} className="font-sans font-bold ml-2 underline hover:no-underline">Dismiss</button>
        </div>
      )}
{/* GRID LAYOUT (Left Sidebar + Center Main + Right Sidebar) */}
      <div className={`max-w-7xl mx-auto px-2 sm:px-4 py-4 grid grid-cols-1 ${
        activeTab === "hub"
          ? "md:grid-cols-4 lg:grid-cols-4"
          : activeTab === "profile"
          ? "grid-cols-1"
          : "lg:grid-cols-12"
      } gap-6`}>

        {/* LEFT NAVIGATION SIDEBAR (Visible in Home, Videos section/Watch Hub, etc. - NOT in Game Hub) */}
        {activeTab !== "hub" && activeTab !== "profile" && (
          <aside className="hidden lg:block lg:col-span-3 sticky top-[80px] h-[calc(100vh-100px)] overflow-y-auto scrollbar-thin pr-1 select-none z-30">
            <LeftNavigationSidebar
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onTriggerAction={(msg) => triggerToast(msg)}
            />
          </aside>
        )}

        {/* CENTER MAIN INTERACTIVE CONTENT AREA */}
        <main className={`${
          activeTab === "hub"
            ? "md:col-span-3 lg:col-span-3"
            : activeTab === "profile"
            ? "w-full"
            : "lg:col-span-9"
        } space-y-6`}>

          {marketChangeChallengeData && (
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-4.5 shadow-lg border border-indigo-400/20 text-left relative overflow-hidden animate-in slide-in-from-top-4 duration-200">
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="text-2xl animate-pulse">🔄</span>
                  <div>
                    <h4 className="text-xs font-black tracking-widest uppercase font-mono text-cyan-300">Market Change Mode Activated</h4>
                    <p className="text-xs text-white/95 leading-relaxed font-semibold mt-0.5">
                      You are requesting a market/bet change for matchup <strong className="text-yellow-300 font-extrabold">"{marketChangeChallengeData.matchName}"</strong> against <strong className="text-yellow-300 font-extrabold">@{marketChangeChallengeData.oppUser}</strong>.
                    </p>
                    <p className="text-[10.5px] text-white/80 italic mt-1 font-mono leading-relaxed">
                      👉 Tap any of the markets/odds displayed below on this match page to select it as your proposed change!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    // Cancel selection mode, reopen challenge window
                    setChallengeWindowData(marketChangeChallengeData);
                    setChallengeWindowOpen(true);
                    setMarketChangeChallengeData(null);
                  }}
                  className="px-2.5 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shadow-inner active:scale-95"
                >
                  Return to Challenge
                </button>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl translate-x-4 -translate-y-4" />
            </div>
          )}
          
          {/* DYNAMIC SHIFTED PROFILE TAB VIEW */}
          {activeTab === "profile" && (
            <ProfileView 
              walletBalance={walletBalance}
              onUpdateWallet={(amount) => setWalletBalance(amount)}
              triggerToast={(msg) => alert(msg)}
              activeProfilePage={activeProfilePage}
            />
          )}

          {/* 1. SOCIAL FEED TAB VIEW */}
          {activeTab === "home" && (
            <div className="space-y-6 text-left">
              {/* Facebook-style Stories Panel */}
              <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin select-none">
                {/* User Story */}
                <div className="w-24 h-36 bg-white dark:bg-[#242526] rounded-xl shadow-sm border border-gray-150 dark:border-[#3e4042] shrink-0 text-center relative overflow-hidden group flex flex-col justify-between p-2">
                  <div className="h-2/3 bg-gray-100 rounded-lg overflow-hidden relative">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2" className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="profile" />
                  </div>
                  <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 border-4 border-white dark:border-[#242526] flex items-center justify-center text-white">
                    <Plus className="w-4 h-4 fill-white font-bold" />
                  </div>
                  <p className="text-[10px] font-black text-gray-800 dark:text-gray-200">My Story</p>
                </div>

                {/* Friends wins summaries */}
                <div className="w-24 h-36 bg-gradient-to-t from-pink-900 to-indigo-950 rounded-xl shrink-0 relative overflow-hidden p-2.5 select-none text-white flex flex-col justify-between border border-[#3e4042]">
                  <span className="text-[14px] bg-pink-500 rounded-full w-6 h-6 flex justify-center items-center leading-none font-black text-xs border border-white">🔥</span>
                  <div className="text-left font-sans">
                    <p className="text-[9px] font-mono text-pink-300">David T.</p>
                    <p className="text-[10px] font-black leading-tight">Won $340 Draw Ratio Bet!</p>
                  </div>
                </div>

                <div className="w-24 h-36 bg-gradient-to-t from-emerald-900 to-teal-950 rounded-xl shrink-0 relative overflow-hidden p-2.5 select-none text-white flex flex-col justify-between border border-[#3e4042]">
                  <span className="text-[14px] bg-emerald-500 rounded-full w-6 h-6 flex justify-center items-center leading-none font-black text-xs border border-white">💰</span>
                  <div className="text-left font-sans">
                    <p className="text-[9px] font-mono text-teal-300">Sarah L.</p>
                    <p className="text-[10px] font-black leading-tight">matched liability $150 wins!</p>
                  </div>
                </div>
              </div>

              {/* Composer Box (Matches standard Facebook input with Lookupto Ratio Engine parameters) */}
              <div className="bg-white dark:bg-[#242526] rounded-xl shadow-md p-4 border border-gray-250 dark:border-[#3e4042] transition-colors duration-300">
                <div className="flex gap-3 items-start pb-3 border-b border-gray-150 dark:border-zinc-800">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2" className="w-9.5 h-9.5 rounded-full" alt="profile" />
                  
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      value={composerText}
                      onChange={(e) => setComposerText(e.target.value)}
                      placeholder="What's on your mind, Collins?"
                      className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none border-none py-1.5 focus:ring-0"
                    />
                  </div>
                </div>

                {composerTaggedFriends.length > 0 && (
                  <div className="pt-2 text-xs text-blue-600 font-bold flex flex-wrap gap-1">
                    With: {composerTaggedFriends.map((f, i) => (
                       <span key={i} className="bg-blue-50 px-2 py-0.5 rounded-full">{f}</span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3">
                  <div className="flex gap-2 text-xs font-semibold text-gray-500 dark:text-gray-450 overflow-x-auto">
                    <button className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-[#323334] px-3 py-1.5 rounded-md text-red-500 transition-colors whitespace-nowrap"><span>🎥</span> Live Game</button>
                    <button className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-[#323334] px-3 py-1.5 rounded-md text-green-500 transition-colors whitespace-nowrap"><span>📷</span> Photo/Video</button>
                    <button onClick={() => setTagModalOpen(true)} className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-[#323334] px-3 py-1.5 rounded-md text-blue-500 transition-colors whitespace-nowrap"><span>👥</span> Tag Friends</button>
                  </div>
                  <button
                    onClick={handlePublishStandardPost}
                    disabled={!composerText.trim()}
                    className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-md transition-colors shrink-0"
                  >
                    Post Standard Info
                  </button>
                </div>
              </div>

              {/* Community Feed List */}
              <div className="space-y-4">
                {feedPosts.map((post) => (
                  <SocialPostCard
                    key={post.id}
                    post={post}
                    onLike={handleLikePost}
                    onRepost={handleRepostPost}
                    onSave={handleSaveItem}
                    onTag={() => setTagModalOpen(true)}
                    onAcceptBet={handleAcceptBetFromPost}
                    onUpdatePostComments={handleUpdatePostComments}
                    isDarkMode={isDarkMode}
                    walletBalance={walletBalance}
                    onUpdateWallet={(amount: number) => setWalletBalance(prev => prev + amount)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 2. LIVE SPECTACLE WATCH VIEW */}
          {activeTab === "watch" && (
            <WatchView 
              selectedMatch={watchSelectedMatch} 
              onSelectOdd={handleSelectOdd}
              walletBalance={walletBalance}
              onSaveItem={handleSaveItem}
              onTagItem={() => setTagModalOpen(true)}
              forceShowSimulation={kenyanShowTrigger}
              videosList={studioVideos}
              setVideosList={setStudioVideos}
              reelsList={studioReels}
              setReelsList={setStudioReels}
              successFactoryList={studioSuccess}
              setSuccessFactoryList={setStudioSuccess}
              onJoinChallenge={(videoId) => {
                const video = studioVideos.find(v => v.id === videoId);
                if (video) {
                  setChallengeWindowData({
                    oppUser: video.creator,
                    oppStake: video.challenge?.pool ? parseInt(video.challenge.pool) : 50,
                    matchName: "Video Challenge Match",
                    prediction: "1",
                    isProposedMarket: true,
                  });
                  setChallengeWindowOpen(true);
                }
              }}
            />
          )}

          {/* C. CREATOR STUDIO TAB VIEW */}
          {activeTab === "creator_studio" && (
            <CreatorStudioView 
              videosList={studioVideos}
              setVideosList={setStudioVideos}
              reelsList={studioReels}
              setReelsList={setStudioReels}
              walletBalance={walletBalance}
            />
          )}

          {/* M. MEMO TAB VIEW */}
          {activeTab === "memo" && (
            <div className="space-y-6 text-left animate-in fade-in duration-200 w-full max-w-2xl mx-auto">
              
              <div className="flex bg-white dark:bg-[#242526] p-1 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 font-sans">
                <button
                  onClick={() => setMemoFeedMode("feed")}
                  className={`flex-1 p-2 rounded-lg text-sm font-black transition-all ${
                    memoFeedMode === "feed" ? "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 shadow-sm " : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  Memo Feed
                </button>
                <button
                  onClick={() => setMemoFeedMode("compose")}
                  className={`flex-1 p-2 rounded-lg text-sm font-black transition-all ${
                    memoFeedMode === "compose" ? "bg-blue-600 text-white shadow-sm " : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  Post a Memo
                </button>
              </div>

              {memoFeedMode === "feed" && (
                <div className="space-y-4">
                  {memos.map(memo => (
                    <div key={memo.id} className="bg-white dark:bg-[#242526] rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden font-sans">
                      <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center gap-3">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(memo.author)}&backgroundColor=1877f2`} className="w-10 h-10 rounded-full" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-gray-900 dark:text-gray-100">{memo.author}</h4>
                              <span className="text-[10px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded-full border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300">
                                {memo.type === "fundraising" ? "Fundraising" : memo.type === "thanksgiving" ? "Thanksgiving" : "Success"} Memo
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gray-500">{memo.timestamp}</span>
                              <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] rounded-full flex items-center gap-1"><Users className="w-3 h-3" /> Past Opponent</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">{memo.text}</p>
                        {memo.tagged && (
                          <div className="mb-3 text-xs text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg inline-flex">
                            Tagged: {memo.tagged}
                          </div>
                        )}
                        <img src={memo.photo} alt="Memo reference" className="w-full h-auto rounded-xl border border-gray-100 dark:border-zinc-800" />
                      </div>
                      <div className="px-4 py-3 bg-gray-50 dark:bg-[#18191a] border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-2">
                        <button 
                          onClick={() => handleSaveItem('memo', memo.text, memo.photo)}
                          className="flex items-center gap-1 px-4 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-800 dark:text-white rounded-full text-xs font-black transition-colors cursor-pointer"
                        >
                          <Bookmark className="w-3.5 h-3.5" /> Save
                        </button>
                        <button className="flex items-center gap-1 px-4 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-800 dark:text-white rounded-full text-xs font-black transition-colors cursor-pointer">
                          <Heart className="w-3.5 h-3.5" /> Support
                        </button>
                      </div>
                    </div>
                  ))}
                  {memos.length === 0 && (
                    <div className="p-8 text-center bg-white dark:bg-[#242526] rounded-xl border border-gray-200 dark:border-zinc-800">
                      <History className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No memos from your past opponents yet.</p>
                    </div>
                  )}
                </div>
              )}

               {memoFeedMode === "compose" && (
                <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden font-sans">
                  <div className="bg-blue-600 p-4 shrink-0 text-white flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-lg">Post a Memo</h3>
                      <p className="text-xs text-blue-100 font-medium">Visible only to users you've challenged with</p>
                    </div>
                  </div>
                  
                  <div className="p-5 space-y-5">
                    <div>
                      <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2">Memo Type</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {["fundraising", "thanksgiving", "success"].map((type) => (
                          <button
                            key={type}
                            onClick={() => setMemoComposeType(type as any)}
                            className={`p-2.5 rounded-xl text-xs font-black capitalize transition-all border outline-none cursor-pointer ${
                              memoComposeType === type 
                                ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400 ring-1 ring-blue-500/50" 
                                : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-700"
                            }`}
                          >
                            {type} Flow
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {memoComposeType === "thanksgiving" && (
                      <div className="animate-in fade-in duration-200">
                        <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Users className="w-3 h-3"/> Tag Past Opponent</label>
                        <input 
                          type="text" 
                          placeholder="Type their username to link profile..." 
                          value={memoComposeTagged}
                          onChange={(e) => setMemoComposeTagged(e.target.value)}
                          className="w-full p-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-[#18191a] text-gray-900 dark:text-white text-sm outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-800 transition-all font-medium"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2">Story details</label>
                      <textarea 
                        rows={4} 
                        placeholder={
                          memoComposeType === "fundraising" ? "Describe why you are raising funds and ask for help from your verified peers..." :
                          memoComposeType === "thanksgiving" ? "Write a thank you note for honoring the escrow perfectly..." :
                          "Share your verified success or win story from a recent pool..."
                        }
                        value={memoComposeText}
                        onChange={(e) => setMemoComposeText(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-[#18191a] text-gray-900 dark:text-white text-sm outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-800 transition-all font-medium resize-none shadow-inner"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs flex justify-between items-center tracking-wider mb-2 text-gray-500">
                        <span className="font-black text-[11px] uppercase">Attach Camera Photo</span>
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800">Must be high quality</span>
                      </label>
                      
                      {!memoComposePhoto ? (
                        <div className="border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-[#323334] transition-colors relative cursor-pointer bg-gray-50/50 dark:bg-[#18191a]">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleMemoPhotoSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center mb-3">
                            <Camera className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                          </div>
                          <p className="text-sm font-black text-gray-700 dark:text-gray-300">Tap to upload proof photo</p>
                          <p className="text-[10px] text-gray-500 mt-1 font-bold">Only camera photos (high pixels). Fake/AI prohibited.</p>
                        </div>
                      ) : memoIsCompressing ? (
                        <div className="border border-gray-200 dark:border-zinc-700 rounded-xl p-8 text-center bg-gray-50 dark:bg-[#18191a] shadow-inner">
                          <div className="w-8 h-8 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                          <p className="text-xs font-black text-blue-600 dark:text-blue-400">Compressing & Validating quality...</p>
                        </div>
                      ) : (
                        <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-700 group hover:shadow-lg transition-all animate-in fade-in zoom-in-95 duration-200">
                          <img src={memoComposePhoto} alt="Selected" className="w-full h-56 object-cover" />
                          <button 
                            onClick={() => setMemoComposePhoto(null)}
                            title="Remove photo"
                            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-rose-500 rounded-full text-white backdrop-blur-sm transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between">
                            <span className="text-[10px] text-white flex items-center gap-1 font-black"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> HIGH-RES VERIFIED</span>
                            <span className="text-[10px] text-white font-mono bg-black/50 px-1.5 py-0.5 rounded font-black tracking-wider shadow">2.4MB Compressed</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-[#18191a] border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-3 shrink-0">
                    <button 
                      onClick={() => setMemoFeedMode("feed")}
                      className="px-5 py-2 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer outline-none"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleMemoSubmit}
                      disabled={!memoComposePhoto || !memoComposeText.trim() || memoIsCompressing}
                      className="px-6 py-2 rounded-xl font-black text-sm bg-[#1877f2] hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-white transition-all outline-none flex items-center gap-2"
                    >
                       <Send className="w-3.5 h-3.5" /> Post Memo
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* S. SAVED TAB VIEW */}
          {activeTab === "saved" && (
            <div className="space-y-6 text-left animate-in fade-in duration-200 w-full max-w-2xl mx-auto font-sans">
              
              <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gray-50 dark:bg-[#18191a]">
                  <h3 className="font-black text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-purple-500" />
                    Saved
                  </h3>
                </div>
                
                <div className="p-4 space-y-4">
                  {savedItems.length === 0 ? (
                    <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                      <Bookmark className="w-10 h-10 mx-auto text-gray-300 dark:text-zinc-600 mb-2" />
                      <p className="font-bold">No saved items yet.</p>
                      <p className="text-xs">Save videos, posts, memos and pics to see them here.</p>
                    </div>
                  ) : (
                    savedItems.map(item => (
                      <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer group">
                        <div className="w-20 h-20 bg-gray-200 dark:bg-zinc-700 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {item.thumb ? (
                             <img src={item.thumb} alt="thumbnail" className="w-full h-full object-cover" />
                          ) : item.icon === "Tv" ? (
                             <Tv className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                          ) : (
                             <Camera className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 line-clamp-2">{item.title}</h4>
                          <span className="text-xs text-gray-500 mt-1 block uppercase tracking-wider font-black">
                            {item.type} • {item.date}
                          </span>
                        </div>
                        <button className="text-gray-400 hover:text-rose-500 p-2 opacity-0 group-hover:opacity-100 transition-all rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/30">
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. TEAMS SYNDICATES GROUPS VIEW */}
          {activeTab === "groups" && (
            <GroupsView 
              walletBalance={walletBalance} 
              onUpdateWallet={(amt) => {
                setWalletBalance((prev) => prev + amt);
                setTransactions([
                  { id: `tx-${Date.now()}`, type: amt > 0 ? "bet_win" : "bet_stake", amount: Math.abs(amt), time: "Just now", target: "Joined clan syndicate pool" },
                  ...transactions
                ]);
              }}
              activeGroupId={activeGroupId}
              setActiveGroupId={setActiveGroupId}
              groups={groups}
              setGroups={setGroups}
              onNavigateTab={(tab) => setActiveTab(tab as any)}
              setCreateGroupModalOpen={setCreateGroupModalOpen}
            />
          )}

          {/* Events View */}
          {activeTab === "events" && (
            <EventsView />
          )}

          {/* Marketplace Tab View */}
          {activeTab === "marketplace" && (
            <MarketplaceView
              walletBalance={walletBalance}
              onUpdateWallet={(amt) => {
                setWalletBalance((prev) => prev + amt);
              }}
              onAddTransaction={(totalAmount, itemDetails) => {
                setTransactions([
                  { id: `tx-${Date.now()}`, type: "bet_stake", amount: totalAmount, time: "Just now", target: itemDetails },
                  ...transactions
                ]);
              }}
            />
          )}

          {activeTab === "challenges" && (
            <div className="animate-in fade-in duration-200">
               <ChallengesView 
                  walletBalance={walletBalance} 
                  onUpdateWallet={(amt) => setWalletBalance(prev => prev + amt)}
               />
            </div>
          )}

          {/* 4. MAIN ODDS CENTER AND LOOKUPTO SPORTSBOOK HUB */}
          {activeTab === "hub" && (
            <HubView 
              walletBalance={walletBalance} 
              onNavigateTab={(tab) => setActiveTab(tab)} 
            />
          )}
          {/* End of HubView */}
          {/* 5. PAGES DIRECTORY VIEW (Redesigned matching photo) */}
          {activeTab === "pages" && (
            <div className="space-y-6 text-left animate-in fade-in duration-200 font-sans">
              
              {/* Header Card with Blueprint Vector Graphics on Right */}
              <div className="bg-white dark:bg-[#242526] p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-2xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="max-w-xl space-y-1.5 relative z-10">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Pages & Profile Hub
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Manage your profiles and pages. Switch between them instantly.
                  </p>
                </div>

                {/* Right Blueprint Graphic SVG */}
                <div className="hidden sm:block opacity-75 dark:opacity-40 shrink-0 pointer-events-none">
                  <svg width="220" height="110" viewBox="0 0 220 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="70" y="10" width="120" height="85" rx="8" stroke="#93C5FD" strokeWidth="2" strokeDasharray="3 3" fill="none" />
                    <rect x="80" y="20" width="100" height="65" rx="6" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
                    <circle cx="102" cy="42" r="10" stroke="#3B82F6" strokeWidth="1.5" fill="none" />
                    <line x1="120" y1="36" x2="165" y2="36" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
                    <line x1="120" y1="46" x2="150" y2="46" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" />
                    <line x1="92" y1="62" x2="168" y2="62" stroke="#DBEAFE" strokeWidth="2" strokeLinecap="round" />
                    
                    {/* Secondary back card */}
                    <rect x="20" y="30" width="80" height="55" rx="6" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
                    <circle cx="38" cy="48" r="7" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
                    <line x1="52" y1="45" x2="85" y2="45" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
                    <line x1="52" y1="53" x2="75" y2="53" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Main Matrix Grid - 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* LEFT COLUMN: Personal Accounts (Switchable) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#1877f2] fill-[#1877f2]" />
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                      Personal Accounts (Switchable)
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(PROFILES)
                      .filter(([_, p]) => p.type === "user")
                      .map(([key, p]) => {
                        const isActive = activeProfilePage === key;
                        const formattedId = key.toLowerCase().replace(/\s/g, "_");

                        return (
                          <div 
                            key={key} 
                            className={`p-5 rounded-2xl bg-white dark:bg-[#242526] border transition-all shadow-2xs ${
                              isActive 
                                ? "border-2 border-[#1877f2]" 
                                : "border border-gray-200/80 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <img 
                                src={p.avatar} 
                                alt={p.name} 
                                className="w-14 h-14 rounded-full border border-gray-100 dark:border-zinc-700 shadow-xs object-cover shrink-0" 
                              />
                              <div className="space-y-1">
                                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                  <span>{p.name}</span>
                                  <CheckCircle2 className="w-4 h-4 text-[#1877f2] fill-[#1877f2] text-white" />
                                </h3>
                                <div className="inline-block px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-[#1877f2] dark:text-blue-400 font-extrabold text-[10px] rounded uppercase tracking-wider font-mono">
                                  PROFILE ACCOUNT
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                  {p.desc}
                                </p>
                              </div>
                            </div>
                            
                            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                              <span className="text-gray-500 dark:text-gray-400 font-mono font-medium">
                                ID: {formattedId}
                              </span>

                              {isActive ? (
                                <div className="flex items-center gap-1.5 text-[#1877f2] dark:text-blue-400 font-bold">
                                  <span>Currently Active</span>
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setActiveProfilePage(key);
                                  }}
                                  className="px-4 py-1.5 border-2 border-[#1877f2] text-[#1877f2] hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl font-bold transition-all cursor-pointer"
                                >
                                  Log in as User
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* RIGHT COLUMN: Managed Pages (Switchable) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                        Managed Pages (Switchable)
                      </h2>
                    </div>
                    <button 
                      onClick={() => alert("All managed pages listed below.")}
                      className="text-xs font-semibold text-[#1877f2] dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      View all pages
                    </button>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(PROFILES)
                      .filter(([_, p]) => p.type === "page")
                      .map(([key, p]) => {
                        const isActive = activeProfilePage === key;
                        const formattedId = key.toLowerCase().replace(/\s/g, "_");

                        return (
                          <div 
                            key={key} 
                            className={`p-5 rounded-2xl bg-white dark:bg-[#242526] border transition-all shadow-2xs ${
                              isActive 
                                ? "border-2 border-amber-500" 
                                : "border border-gray-200/80 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <img 
                                src={p.avatar} 
                                alt={p.name} 
                                className="w-14 h-14 rounded-full border border-gray-100 dark:border-zinc-700 shadow-xs object-cover shrink-0" 
                              />
                              <div className="space-y-1">
                                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                  {p.name}
                                </h3>
                                <div className="inline-block px-2 py-0.5 bg-orange-50 dark:bg-amber-950/60 text-orange-600 dark:text-amber-400 font-extrabold text-[10px] rounded uppercase tracking-wider font-mono">
                                  PAGE PROFILE
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                  {p.desc}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                              <span className="text-gray-500 dark:text-gray-400 font-mono font-medium">
                                ID: {formattedId}
                              </span>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setActiveTab("profile");
                                    setActiveProfilePage(key);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                  }}
                                  className="px-3.5 py-1.5 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200 font-bold rounded-xl transition-all cursor-pointer"
                                >
                                  View Page
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveProfilePage(key);
                                  }}
                                  disabled={isActive}
                                  className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer shadow-2xs ${
                                    isActive
                                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 cursor-default"
                                      : "bg-[#ff8c00] hover:bg-orange-600 text-white"
                                  }`}
                                >
                                  {isActive ? "Currently Active" : "Switch Identity"}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

              </div>

              {/* Bottom Tip Banner */}
              <div className="bg-[#f0f6ff] dark:bg-blue-950/20 border border-blue-100/80 dark:border-blue-900/40 rounded-xl p-4 flex items-center gap-2.5 text-xs text-gray-700 dark:text-gray-300 font-medium">
                <Lightbulb className="w-4 h-4 text-[#1877f2] shrink-0" />
                <span>
                  <strong>Tip:</strong> You can switch between your accounts or pages anytime without logging out.
                </span>
              </div>

            </div>
          )}
        </main>

        {/* RIGHT SIDEBAR - LookUpto Escrow Engine (Appears during Game Hub entry) */}
        {activeTab === "hub" && (
          <aside className="md:col-span-1 md:sticky md:top-[80px] h-[85vh] relative z-40">

          {/* Embedded LookUpto Escrow Calculator Engine */}
          <div 
            className="absolute bg-white dark:bg-[#242526] rounded-xl shadow-2xl border border-gray-250 dark:border-[#3e4042] text-left transition-all duration-150 overflow-hidden group/escrow" 
            style={
              escrowSizeMode === "max"
                ? {
                    width: '760px',
                    height: '820px',
                    maxWidth: 'calc(100vw - 32px)',
                    maxHeight: 'calc(100vh - 100px)',
                    top: '0px',
                    right: '0px',
                    zIndex: 60,
                  }
                : escrowSizeMode === "min"
                ? {
                    width: '300px',
                    height: '56px',
                    top: `${escrowTop}px`,
                    right: `${escrowRight}px`,
                    overflow: 'hidden',
                  }
                : {
                    width: `${escrowWidth}px`,
                    height: `${escrowHeight}px`,
                    top: `${escrowTop}px`,
                    right: `${escrowRight}px`,
                    minWidth: '280px',
                    minHeight: '400px',
                    maxWidth: '800px',
                    maxHeight: '1200px',
                  }
            }
          >
            {/* North (Top) Border Handle */}
            <div 
              className="absolute top-0 left-0 w-full h-2 cursor-n-resize bg-transparent hover:bg-blue-500/10 active:bg-blue-500/20 z-50 flex items-center justify-center transition-all"
              onMouseDown={(e) => {
                e.preventDefault();
                startDragResize("n", e.clientX, e.clientY);
              }}
              onTouchStart={(e) => {
                if (e.touches.length > 0) {
                  startDragResize("n", e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              title="Drag top edge to resize height"
            >
              <div className="flex gap-1 items-center opacity-0 group-hover/escrow:opacity-100 transition-opacity pointer-events-none">
                <div className="w-1.5 h-1 bg-gray-400 dark:bg-zinc-500 rounded-full"></div>
                <div className="w-1.5 h-1 bg-gray-400 dark:bg-zinc-500 rounded-full"></div>
              </div>
            </div>

            {/* South (Bottom) Border Handle */}
            <div 
              className="absolute bottom-0 left-0 w-full h-2 cursor-s-resize bg-transparent hover:bg-blue-500/10 active:bg-blue-500/20 z-50 flex items-center justify-center transition-all"
              onMouseDown={(e) => {
                e.preventDefault();
                startDragResize("s", e.clientX, e.clientY);
              }}
              onTouchStart={(e) => {
                if (e.touches.length > 0) {
                  startDragResize("s", e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              title="Drag bottom edge to resize height"
            >
              <div className="flex gap-1 items-center opacity-0 group-hover/escrow:opacity-100 transition-opacity pointer-events-none">
                <div className="w-1.5 h-1 bg-gray-400 dark:bg-zinc-500 rounded-full"></div>
                <div className="w-1.5 h-1 bg-gray-400 dark:bg-zinc-500 rounded-full"></div>
              </div>
            </div>

            {/* West (Left) Border Handle */}
            <div 
              className="absolute left-0 top-0 w-2 h-full cursor-w-resize bg-transparent hover:bg-blue-500/10 active:bg-blue-500/20 z-50 flex flex-col items-center justify-center transition-all"
              onMouseDown={(e) => {
                e.preventDefault();
                startDragResize("w", e.clientX, e.clientY);
              }}
              onTouchStart={(e) => {
                if (e.touches.length > 0) {
                  startDragResize("w", e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              title="Drag left edge to resize width"
            >
              <div className="flex flex-col gap-1 items-center opacity-0 group-hover/escrow:opacity-100 transition-opacity pointer-events-none">
                <div className="w-1 h-1.5 bg-gray-400 dark:bg-zinc-500 rounded-full"></div>
                <div className="w-1 h-1.5 bg-gray-400 dark:bg-zinc-500 rounded-full"></div>
              </div>
            </div>

            {/* East (Right) Border Handle */}
            <div 
              className="absolute right-0 top-0 w-2 h-full cursor-e-resize bg-transparent hover:bg-blue-500/10 active:bg-blue-500/20 z-50 flex flex-col items-center justify-center transition-all"
              onMouseDown={(e) => {
                e.preventDefault();
                startDragResize("e", e.clientX, e.clientY);
              }}
              onTouchStart={(e) => {
                if (e.touches.length > 0) {
                  startDragResize("e", e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              title="Drag right edge to resize width"
            >
              <div className="flex flex-col gap-1 items-center opacity-0 group-hover/escrow:opacity-100 transition-opacity pointer-events-none">
                <div className="w-1 h-1.5 bg-gray-400 dark:bg-zinc-500 rounded-full"></div>
                <div className="w-1 h-1.5 bg-gray-400 dark:bg-zinc-500 rounded-full"></div>
              </div>
            </div>

            {/* North-West (Top-Left) Corner Handle */}
            <div 
              className="absolute top-0 left-0 w-5 h-5 cursor-nw-resize bg-transparent hover:bg-blue-500/20 active:bg-blue-500/30 z-55 flex items-start justify-start p-1 transition-all"
              onMouseDown={(e) => {
                e.preventDefault();
                startDragResize("nw", e.clientX, e.clientY);
              }}
              onTouchStart={(e) => {
                if (e.touches.length > 0) {
                  startDragResize("nw", e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              title="Drag corner to resize top & left"
            >
              <svg className="w-2.5 h-2.5 text-gray-400 dark:text-zinc-500 opacity-60 hover:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 10 10">
                <path d="M0 0 L10 10 M0 3 L3 0 M0 6 L6 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>

            {/* North-East (Top-Right) Corner Handle */}
            <div 
              className="absolute top-0 right-0 w-5 h-5 cursor-ne-resize bg-transparent hover:bg-blue-500/20 active:bg-blue-500/30 z-55 flex items-start justify-end p-1 transition-all"
              onMouseDown={(e) => {
                e.preventDefault();
                startDragResize("ne", e.clientX, e.clientY);
              }}
              onTouchStart={(e) => {
                if (e.touches.length > 0) {
                  startDragResize("ne", e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              title="Drag corner to resize top & right"
            >
              <svg className="w-2.5 h-2.5 text-gray-400 dark:text-zinc-500 opacity-60 hover:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 10 10">
                <path d="M10 0 L0 10 M10 3 L7 0 M10 6 L4 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Bottom-Left Corner Handle */}
            <div 
              className="absolute bottom-0 left-0 w-5 h-5 cursor-sw-resize bg-transparent hover:bg-blue-500/20 active:bg-blue-500/30 z-55 flex items-end justify-start p-1 transition-all"
              onMouseDown={(e) => {
                e.preventDefault();
                startDragResize("sw", e.clientX, e.clientY);
              }}
              onTouchStart={(e) => {
                if (e.touches.length > 0) {
                  startDragResize("sw", e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              title="Drag corner to resize bottom & left"
            >
              <svg className="w-2.5 h-2.5 text-gray-400 dark:text-zinc-500 opacity-60 hover:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 10 10">
                <path d="M0 10 L10 0 M3 10 L10 3 M6 10 L10 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Bottom-Right Corner Handle */}
            <div 
              className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize bg-transparent hover:bg-blue-500/20 active:bg-blue-500/30 z-55 flex items-end justify-end p-1 transition-all"
              onMouseDown={(e) => {
                e.preventDefault();
                startDragResize("se", e.clientX, e.clientY);
              }}
              onTouchStart={(e) => {
                if (e.touches.length > 0) {
                  startDragResize("se", e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              title="Drag corner to resize bottom & right"
            >
              <svg className="w-2.5 h-2.5 text-gray-400 dark:text-zinc-500 opacity-60 hover:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 10 10">
                <path d="M10 10 L0 0 M7 10 L0 7 M4 10 L0 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Main content wrapper of LookUpto Escrow Engine */}
            <div className="p-4 h-full overflow-y-auto select-text scrollbar-thin flex flex-col relative" style={{ direction: 'ltr' }}>
            <div 
              className="flex items-center justify-between font-black text-gray-800 dark:text-white pb-2.5 border-b border-gray-150 dark:border-zinc-800 mb-4 select-none cursor-grab active:cursor-grabbing hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 p-1 rounded-lg transition-colors"
              onMouseDown={(e) => {
                // Don't trigger move if clicking inside interactive buttons or inputs
                const target = e.target as HTMLElement;
                if (target.closest('button') || target.closest('input')) return;
                e.preventDefault();
                startDragResize("move", e.clientX, e.clientY);
              }}
              onTouchStart={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest('button') || target.closest('input')) return;
                if (e.touches.length > 0) {
                  startDragResize("move", e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              title="Click and drag to reposition Escrow Engine window anywhere"
            >
              <h3 
                onClick={() => escrowSizeMode === "min" && setEscrowSizeMode("normal")}
                className={`text-xs sm:text-sm font-black flex items-center gap-1.5 font-sans ${escrowSizeMode === "min" ? "cursor-pointer hover:text-blue-600" : ""}`}
              >
                📊 lookUpto Escrow Engine
                {escrowSizeMode === "min" && (
                  <span className="text-[10px] text-blue-500 font-bold font-mono ml-1.5 animate-pulse">(Minimized - Click to expand)</span>
                )}
              </h3>
              <div className="flex items-center gap-1.5">
                {/* Iconic Box Window Sizing Controls */}
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 p-0.5 rounded-lg border border-gray-200 dark:border-zinc-700">
                  {/* Smallest / Min Size Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEscrowSizeMode(escrowSizeMode === "min" ? "normal" : "min");
                    }}
                    className={`p-1 rounded-md transition-all cursor-pointer ${
                      escrowSizeMode === "min"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-700"
                    }`}
                    title="Smallest / Min Size (Minimize)"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  {/* Maximum Size Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEscrowSizeMode(escrowSizeMode === "max" ? "normal" : "max");
                    }}
                    className={`p-1 rounded-md transition-all cursor-pointer ${
                      escrowSizeMode === "max"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-700"
                    }`}
                    title="Maximum Size (Maximize)"
                  >
                    <Square className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setEscrowSizeMode("normal");
                    handleResetSize();
                  }}
                  className="text-[10px] text-gray-400 hover:text-blue-500 font-bold uppercase transition-colors cursor-pointer font-mono"
                  type="button"
                  title="Reset to default window size"
                >
                  Reset
                </button>
                {ratioOddValue > 0 && (
                  <button 
                    onClick={() => { setRatioMatchName(""); setRatioOddName(""); setRatioOddValue(0); }}
                    className="text-[10px] text-gray-400 hover:text-red-500 font-bold uppercase transition-colors cursor-pointer font-mono border-l border-gray-200 dark:border-zinc-800 pl-1.5"
                    type="button"
                  >
                    Reset Pred
                  </button>
                )}
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex border-b border-gray-150 dark:border-zinc-800 mb-4 text-[10px] sm:text-[11px] font-bold font-sans">
              <button
                type="button"
                onClick={() => setEscrowEngineTab("mimi")}
                className={`flex-1 pb-2 text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  escrowEngineTab === "mimi"
                    ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-1"><span className="text-sm">👤</span> <span className="hidden sm:inline">Mimi na wewe</span></div>
                <span className="text-[8px] font-normal text-gray-400">Challenge (1 vs 1)</span>
              </button>
              <button
                type="button"
                onClick={() => setEscrowEngineTab("three_way")}
                className={`flex-1 pb-2 text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  escrowEngineTab === "three_way"
                    ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-1"><span className="text-sm">🔺</span> <span className="hidden sm:inline">3-Way Challenge</span></div>
                <span className="text-[8px] font-normal text-gray-400">(3 Players)</span>
              </button>
              <button
                type="button"
                onClick={() => setEscrowEngineTab("tujengane")}
                className={`flex-1 pb-2 text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  escrowEngineTab === "tujengane"
                    ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-1"><span className="text-sm">🤝</span> <span className="hidden sm:inline">Tujengane</span></div>
                <span className="text-[8px] font-normal text-gray-400">Group Challenge</span>
              </button>
            </div>

            {/* Unified Escrow Interface */}
            <div className="space-y-4 animate-in fade-in duration-200 text-left pb-16">
              {ratioOddValue > 0 ? (
                <>
                  {/* Match Card */}
                  <div className="bg-white dark:bg-[#18191a] p-3 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500 mb-1">
                          <span className="w-4 h-4 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-[8px]">⚽</span>
                          {ratioMatch?.league || "Premier League"}
                        </div>
                        <h3 className="text-sm font-black text-gray-900 dark:text-white leading-tight">
                          {ratioMatch?.homeTeam} <span className="text-gray-400 font-normal">vs</span> {ratioMatch?.awayTeam}
                        </h3>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black px-2 py-1 rounded-lg border border-blue-100 dark:border-blue-800/50 flex flex-col items-end">
                        <span className="uppercase text-[8px] opacity-70 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Your Pick</span>
                        <span>{ratioOddName} @{ratioOddValue.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Contract Value Input */}
                    <div className="pt-3 border-t border-gray-100 dark:border-zinc-800">
                        <label className="text-[9px] text-gray-500 font-bold uppercase block mb-1">
                          Contract Value ($)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
                          <input
                            type="number"
                            min="1"
                            value={ratioTotalPool}
                            onChange={(e) => {
                              const val = Math.max(1, parseFloat(e.target.value) || 0);
                              setRatioTotalPool(val);
                              setCollabTargetStake(val);
                              setCalculatorMode("contract");
                            }}
                            className="w-full bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-zinc-800 rounded-xl py-2 pl-7 pr-3 font-mono font-bold text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowEscrowCalculationModal(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] py-3 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>🧮</span> Continue
                  </button>
                </>
              ) : (
                <div className="p-6 bg-gray-50/50 dark:bg-zinc-800/10 rounded-2xl border border-dashed border-gray-300 dark:border-zinc-700 text-[11px] text-gray-500 text-center leading-relaxed flex flex-col items-center gap-3 mt-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-xl">
                    🤝
                  </div>
                  <div>
                    <strong className="text-gray-900 dark:text-gray-300 block mb-1">Welcome to LookUpto Escrow</strong>
                    Select any match decimal odd on the left to propose a brand new challenge.
                  </div>
                </div>
              )}
            </div>
          </div>
          </div>
        </aside>
        )}

      </div>

      {showEscrowCalculationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#18191a] w-full max-w-sm rounded-3xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/50">
              <h2 className="font-black text-gray-900 dark:text-white text-sm flex items-center gap-2">
                {escrowModalStage === "calculation" && <><span>🧮</span> Escrow Review</>}
                {escrowModalStage === "choose_distribution" && <><span>🚀</span> Choose Distribution</>}
                {escrowModalStage === "invite_friend" && <><span>👤</span> Invite Friend</>}
                {escrowModalStage === "private_sent" && <><span>📩</span> Private Challenge Sent</>}
                {escrowModalStage === "private_declined" && <><span>❌</span> Challenge Declined</>}
                {escrowModalStage === "private_expired" && <><span>⏰</span> Challenge Expired</>}
                {escrowModalStage === "nyota_confirm" && <><span>🤖</span> Start Nyota AI Search</>}
                {escrowModalStage === "nyota_messenger" && <><span>🤖</span> Nyota AI Matchmaker</>}
                {escrowModalStage === "published" && <><span>📢</span> Challenge Published</>}
                {escrowModalStage === "receipt" && <><span>🧾</span> Escrow Receipt</>}
              </h2>
              <button 
                onClick={() => {
                  setShowEscrowCalculationModal(false);
                  setTimeout(() => setEscrowModalStage("calculation"), 300);
                }} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto space-y-3 font-sans flex-1">
              {/* STAGE 1: Escrow Contract Review ("calculation") */}
              {escrowModalStage === "calculation" && (
                <>
                  {/* Summary Card at the top */}
                  <div className="bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-gray-100 dark:border-zinc-700/50 mb-3">
                    <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                      <div className="text-gray-500 font-bold uppercase text-[10px]">Match</div>
                      <div className="font-black text-gray-900 dark:text-white text-right truncate">{ratioMatchName}</div>
                      <div className="text-gray-500 font-bold uppercase text-[10px]">Prediction</div>
                      <div className="font-black text-gray-900 dark:text-white text-right">
                        {ratioOddName === "1" ? ratioMatch?.homeTeam : ratioOddName === "2" ? ratioMatch?.awayTeam : "Draw"} @{ratioOddValue.toFixed(2)}
                      </div>
                      <div className="text-gray-500 font-bold uppercase text-[10px]">Contract Value</div>
                      <div className="font-black text-blue-600 dark:text-blue-400 text-right">${getCentralCalculation().contractValue.toFixed(2)}</div>
                      <div className="text-gray-500 font-bold uppercase text-[10px]">Challenge Type</div>
                      <div className="font-black text-emerald-600 dark:text-emerald-400 text-right">
                        {escrowEngineTab === "mimi" ? mimiChallengeType + " Challenge" : escrowEngineTab === "three_way" ? "Three-Way Challenge" : "Tujengane Challenge"}
                      </div>
                    </div>
                  </div>

                  {escrowEngineTab === "mimi" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs py-1.5 border-b border-gray-100 dark:border-zinc-800">
                        <span className="text-gray-500 font-bold uppercase">Your Req. Stake</span>
                        <span className="font-black text-gray-900 dark:text-white">${getCentralCalculation().userStake.toFixed(2)}</span>
                      </div>
                      {mimiChallengeType === "Open" ? (
                        <>
                          {ratioSelection !== "1" && (
                            <div className="flex justify-between text-xs py-1.5 border-b border-gray-100 dark:border-zinc-800">
                              <span className="text-gray-500 font-bold uppercase">Home Opponent Stake</span>
                              <span className="font-black text-gray-900 dark:text-white">${(getCentralCalculation().contractValue * ( (1/(ratioMatch?.odds["1"]||2)) / ((1/(ratioMatch?.odds["1"]||2)) + (1/(ratioOddValue||2))) )).toFixed(2)}</span>
                            </div>
                          )}
                          {ratioSelection !== "X" && (
                            <div className="flex justify-between text-xs py-1.5 border-b border-gray-100 dark:border-zinc-800">
                              <span className="text-gray-500 font-bold uppercase">Draw Opponent Stake</span>
                              <span className="font-black text-gray-900 dark:text-white">${(getCentralCalculation().contractValue * ( (1/(ratioMatch?.odds.X||3)) / ((1/(ratioMatch?.odds.X||3)) + (1/(ratioOddValue||2))) )).toFixed(2)}</span>
                            </div>
                          )}
                          {ratioSelection !== "2" && (
                            <div className="flex justify-between text-xs py-1.5 border-b border-gray-100 dark:border-zinc-800">
                              <span className="text-gray-500 font-bold uppercase">Away Opponent Stake</span>
                              <span className="font-black text-gray-900 dark:text-white">${(getCentralCalculation().contractValue * ( (1/(ratioMatch?.odds["2"]||4)) / ((1/(ratioMatch?.odds["2"]||4)) + (1/(ratioOddValue||2))) )).toFixed(2)}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex justify-between text-xs py-1.5 border-b border-gray-100 dark:border-zinc-800">
                          <span className="text-gray-500 font-bold uppercase">Opponent Req. Stake</span>
                          <span className="font-black text-gray-900 dark:text-white">${getCentralCalculation().opponentStake.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xs py-1.5 border-b border-gray-100 dark:border-zinc-800">
                        <span className="text-gray-500 font-bold uppercase">Escrow Fee</span>
                        <span className="font-black text-rose-500">${getCentralCalculation().escrowFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs py-1.5 border-b border-gray-100 dark:border-zinc-800">
                        <span className="text-gray-500 font-bold uppercase">Winner Receives</span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400">${getCentralCalculation().escrowLockValue.toFixed(2)}</span>
                      </div>

                      {/* Challenge Type Dropdown */}
                      <div className="pt-3 mt-2 border-t border-gray-100 dark:border-zinc-800 space-y-3">
                        <div>
                          <label className="text-[9px] text-gray-500 font-bold uppercase block mb-1">Challenge Type</label>
                          <select 
                            value={mimiChallengeType} 
                            onChange={(e) => setMimiChallengeType(e.target.value as any)}
                            className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-blue-500"
                          >
                            <option value="Open">🌍 Open Challenge</option>
                            <option value="Forced">🔒 Forced Challenge</option>
                            <option value="Private">👤 Private Challenge</option>
                          </select>
                        </div>
                        {mimiChallengeType === "Open" && (
                          <div className="text-xs text-gray-500">
                            Opponent Can Choose: <span className="font-bold text-gray-900 dark:text-gray-300">{ratioSelection === "1" ? "Draw or Away" : ratioSelection === "X" ? "Home or Away" : "Home or Draw"}</span>
                          </div>
                        )}
                        {mimiChallengeType === "Forced" && (
                          <div>
                            <label className="text-[9px] text-gray-500 font-bold uppercase block mb-1">Force Opponent To Choose</label>
                            <select 
                              value={opponentSelection === getNormalizedCreatorPick() ? (getNormalizedCreatorPick() === "1" ? "X" : "1") : opponentSelection} 
                              onChange={(e) => setOpponentSelection(e.target.value as "1" | "X" | "2")}
                              className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-blue-500 cursor-pointer"
                            >
                              {getNormalizedCreatorPick() !== "1" && (
                                <option value="1">Home ({ratioMatch?.homeTeam || "Home"})</option>
                              )}
                              {getNormalizedCreatorPick() !== "X" && (
                                <option value="X">Draw</option>
                              )}
                              {getNormalizedCreatorPick() !== "2" && (
                                <option value="2">Away ({ratioMatch?.awayTeam || "Away"})</option>
                              )}
                            </select>
                          </div>
                        )}
                        {mimiChallengeType === "Private" && (
                          <div className="space-y-2">
                            <label className="text-[9px] text-gray-500 font-bold uppercase block mb-1">Send Challenge To</label>
                            {!mimiPrivateFriend ? (
                              <div className="relative flex items-center">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                                <input
                                  type="text"
                                  placeholder="Search Friend..."
                                  value={mimiFriendSearch}
                                  onChange={(e) => setMimiFriendSearch(e.target.value)}
                                  className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-lg py-2 pl-7 pr-9 text-xs text-gray-900 dark:text-white outline-none focus:border-blue-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                      window.alert("Deep social media search initiated...");
                                      setMimiFriendSearch("Michael");
                                  }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-blue-500 cursor-pointer"
                                  title="Deep Search Social Friends"
                                >
                                  <Search className="w-4 h-4" />
                                </button>
                                {mimiFriendSearch && (
                                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg">
                                    <button
                                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-zinc-700"
                                      onClick={() => {
                                        setMimiPrivateFriend("Michael Brown");
                                        setMimiFriendSearch("");
                                      }}
                                    >
                                      Michael Brown
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-2 rounded-lg border border-blue-100 dark:border-blue-800/50">
                                <span className="text-xs font-bold">✓ {mimiPrivateFriend}</span>
                                <button onClick={() => setMimiPrivateFriend(null)} className="text-xs hover:underline">Change</button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {escrowEngineTab === "three_way" && (
                    <div className="space-y-3 pt-1">
                      {/* Participant Summary Cards */}
                      <div className="space-y-2">
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                          Participant Summary
                        </div>
                        {getThreeWayParticipants().map((p, idx) => (
                          <div 
                            key={idx} 
                            className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                              p.isUser 
                                ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/80 shadow-xs" 
                                : "bg-gray-50 dark:bg-zinc-800/60 border-gray-200/80 dark:border-zinc-700/60"
                            }`}
                          >
                            <div className="flex justify-between items-center font-bold">
                              <span className={p.isUser ? "text-indigo-900 dark:text-indigo-200" : "text-gray-900 dark:text-white"}>
                                {p.role}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                p.isUser 
                                  ? "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300" 
                                  : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                              }`}>
                                {p.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] pt-0.5">
                              <span className="text-gray-600 dark:text-gray-300 font-medium">
                                {p.label} <span className="font-mono text-gray-800 dark:text-gray-200 font-bold">@{p.odds.toFixed(2)}</span>
                              </span>
                              <span className="font-black text-gray-900 dark:text-white">${p.stake.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Escrow Summary */}
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200/80 dark:border-zinc-700/60 space-y-1.5 text-xs">
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">
                          Escrow Summary
                        </div>
                        <div className="flex justify-between text-xs py-0.5">
                          <span className="text-gray-500 font-bold uppercase text-[10px]">Contract Value</span>
                          <span className="font-black text-blue-600 dark:text-blue-400">${getCentralCalculation().contractValue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs py-0.5">
                          <span className="text-gray-500 font-bold uppercase text-[10px]">Escrow Fee (2%)</span>
                          <span className="font-black text-rose-500">${getCentralCalculation().escrowFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs py-0.5">
                          <span className="text-gray-500 font-bold uppercase text-[10px]">Winner Receives</span>
                          <span className="font-black text-emerald-600 dark:text-emerald-400">${getCentralCalculation().escrowLockValue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs py-1 border-t border-gray-200/60 dark:border-zinc-700/60 pt-1.5">
                          <span className="text-gray-500 font-bold uppercase text-[10px]">Escrow Status</span>
                          <span className="font-bold text-amber-600 dark:text-amber-400 text-[11px]">Waiting for 2 Participants</span>
                        </div>
                      </div>

                      {/* Information Notice */}
                      <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-2.5 rounded-xl text-[10px] text-blue-900 dark:text-blue-200 leading-normal flex gap-2 items-start">
                        <span className="text-xs shrink-0 mt-0.5">ℹ️</span>
                        <span>
                          Required Stakes are automatically calculated using the selected decimal odds. Lower-risk selections contribute higher stakes, while higher-risk selections contribute lower stakes. The winner receives the remaining escrow balance after the escrow fee has been deducted before kickoff.
                        </span>
                      </div>
                    </div>
                  )}

                  {escrowEngineTab === "tujengane" && (() => {
                    const calc = getCentralCalculation();
                    const creatorPick = getNormalizedCreatorPick();

                    let groupTargetStake = calc.player1Stake;
                    let opp1Name = "Draw";
                    let opp1Stake = calc.player2Stake;
                    let opp2Name = ratioMatch?.awayTeam || "Away";
                    let opp2Stake = calc.player3Stake;

                    if (creatorPick === "X") {
                      groupTargetStake = calc.player2Stake;
                      opp1Name = ratioMatch?.homeTeam || "Home";
                      opp1Stake = calc.player1Stake;
                      opp2Name = ratioMatch?.awayTeam || "Away";
                      opp2Stake = calc.player3Stake;
                    } else if (creatorPick === "2") {
                      groupTargetStake = calc.player3Stake;
                      opp1Name = ratioMatch?.homeTeam || "Home";
                      opp1Stake = calc.player1Stake;
                      opp2Name = "Draw";
                      opp2Stake = calc.player2Stake;
                    }

                    const groupPredName = creatorPick === "1" ? (ratioMatch?.homeTeam || "Home") : creatorPick === "2" ? (ratioMatch?.awayTeam || "Away") : "Draw";
                    
                    // Fixed pool math
                    const memberCount = isTujenganeCustom ? (parseInt(tujenganeCustomMembersInput) || 2) : tujenganeContributorsCount;
                    const contributionPerMember = groupTargetStake / (memberCount > 0 ? memberCount : 1);
                    const fixedRaisedAmount = contributionPerMember * tujenganeJoinedCount;
                    const fixedRemainingAmount = Math.max(0, groupTargetStake - fixedRaisedAmount);
                    const fixedProgressPct = Math.min(100, (tujenganeJoinedCount / (memberCount > 0 ? memberCount : 1)) * 100);

                    // Dynamic flexible pool math
                    const totalRaised = tujenganeContributorsList.reduce((sum, item) => sum + (item.amount || 0), 0);
                    const remainingNeeded = Math.max(0, groupTargetStake - totalRaised);
                    const raiseProgressPct = groupTargetStake > 0 ? Math.min(100, (totalRaised / groupTargetStake) * 100) : 0;
                    const contributorsJoinedCount = tujenganeContributorsList.filter(item => (item.amount || 0) > 0).length;

                    const totalEscrowFee = calc.escrowFee;
                    const winnerReceives = calc.escrowLockValue;

                    // Creator Seed Ownership & Profit
                    const maxCreatorContrib = Math.max(0, groupTargetStake * 0.9);
                    const creatorItem = tujenganeContributorsList.find(item => item.isCreator);
                    const creatorContribVal = creatorItem ? Math.min(creatorItem.amount, maxCreatorContrib) : Math.min(tujenganeCreatorContrib, maxCreatorContrib);
                    const creatorOwnershipPct = groupTargetStake > 0 ? (creatorContribVal / groupTargetStake) * 100 : 0;
                    const creatorEstReturn = (creatorOwnershipPct / 100) * winnerReceives;
                    const creatorEstProfit = creatorEstReturn - creatorContribVal;

                    const getTujenganePoolStatusText = () => {
                      if (tujenganeModelMode === "fixed") {
                        if (tujenganeJoinedCount < memberCount) {
                          return `Waiting for Contributors (${tujenganeJoinedCount}/${memberCount} Joined)`;
                        }
                      } else {
                        if (remainingNeeded > 0) {
                          return `Waiting for Contributors ($${remainingNeeded.toFixed(2)} remaining needed)`;
                        }
                      }
                      if (!tujenganeOpponent1Matched) {
                        return `Waiting for Opponent Side 1 (${opp1Name})`;
                      }
                      if (!tujenganeOpponent2Matched) {
                        return `Waiting for Opponent Side 2 (${opp2Name})`;
                      }
                      return "Ready to Initialize Escrow";
                    };

                    return (
                      <div className="space-y-3.5 pt-1 text-left font-sans">
                        {/* Group Contract */}
                        <div className="bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-2xl border border-blue-100 dark:border-blue-900/40 space-y-1.5 text-xs">
                          <div className="text-[10px] font-black text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-1 flex justify-between items-center">
                            <span>Group Target Stake</span>
                            <span className="text-[9px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full font-bold">Odds Math</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-blue-100/60 dark:border-blue-900/30">
                            <span className="text-blue-900 dark:text-blue-200 font-bold">Total Group Target Stake</span>
                            <span className="font-black text-blue-700 dark:text-blue-300">${groupTargetStake.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-blue-100/60 dark:border-blue-900/30">
                            <span className="text-gray-600 dark:text-gray-400">Opponent Side 1 Stake ({opp1Name})</span>
                            <span className="font-mono font-bold text-gray-900 dark:text-white">${opp1Stake.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-600 dark:text-gray-400">Opponent Side 2 Stake ({opp2Name})</span>
                            <span className="font-mono font-bold text-gray-900 dark:text-white">${opp2Stake.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Contribution Mode Selector (Equal vs Flexible) */}
                        <div className="bg-gray-100 dark:bg-zinc-800 p-1 rounded-2xl flex gap-1 font-sans">
                          <button
                            type="button"
                            onClick={() => setTujenganeModelMode("fixed")}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              tujenganeModelMode === "fixed"
                                ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-black"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                          >
                            <span>👥</span> Equal Contributions
                          </button>
                          <button
                            type="button"
                            onClick={() => setTujenganeModelMode("flexible")}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              tujenganeModelMode === "flexible"
                                ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-black"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                          >
                            <span>⚡</span> Flexible Contributions
                          </button>
                        </div>

                        {/* Mode 1: Flexible Contributions */}
                        {tujenganeModelMode === "flexible" && (
                          <>
                            {/* Pool Settings (Creator Controls) */}
                            <div className="bg-white dark:bg-zinc-900 p-3.5 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-3 text-xs shadow-xs">
                              <div className="flex justify-between items-center text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                <span>⚙️ POOL SETTINGS (CREATOR CONTROLS)</span>
                                <span className="text-[9px] text-gray-400 uppercase font-extrabold tracking-wider">FLEXIBLE MODE</span>
                              </div>

                              {/* Creator Initial Contribution */}
                              <div className="bg-indigo-50/60 dark:bg-indigo-950/30 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 space-y-2">
                                <div className="flex justify-between items-center">
                                  <label className="text-[11px] font-bold text-indigo-900 dark:text-indigo-200 block">
                                    Creator Initial Contribution (Optional)
                                  </label>
                                  <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-300">
                                    {creatorOwnershipPct.toFixed(1)}% Ownership
                                  </span>
                                </div>
                                <div className="relative">
                                  <span className="absolute left-2.5 top-2 text-gray-400 text-xs font-bold">$</span>
                                  <input
                                    type="number"
                                    min="0"
                                    max={maxCreatorContrib}
                                    value={Math.min(tujenganeCreatorContrib, maxCreatorContrib)}
                                    onChange={(e) => {
                                      const rawVal = Math.max(0, parseFloat(e.target.value) || 0);
                                      const val = Math.min(rawVal, maxCreatorContrib);
                                      setTujenganeCreatorContrib(val);
                                      setTujenganeContributorsList((prev) => {
                                        const filtered = prev.filter(p => !p.isCreator);
                                        return [{ id: "creator", name: "You (Creator)", amount: val, isCreator: true }, ...filtered];
                                      });
                                    }}
                                    className="w-full pl-6 pr-2 py-1.5 bg-white dark:bg-zinc-800 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-black text-indigo-900 dark:text-indigo-100 outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                </div>
                                <p className="text-[10px] text-indigo-700/80 dark:text-indigo-300/80 font-medium pt-0.5">
                                  Maximum seed is <span className="font-bold">${maxCreatorContrib.toFixed(2)}</span> (capped at 90% of required stake so at least 10% remains for contributors).
                                </p>
                                <div className="grid grid-cols-2 gap-1.5 pt-0.5 text-[10px]">
                                  <div className="bg-emerald-50 dark:bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-200/60 flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">Est. Return:</span>
                                    <span className="font-bold text-emerald-700 dark:text-emerald-300">${creatorEstReturn.toFixed(2)}</span>
                                  </div>
                                  <div className="bg-blue-50 dark:bg-blue-950/40 p-1.5 rounded-lg border border-blue-200/60 flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">Est. Profit:</span>
                                    <span className={`font-bold ${creatorEstProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                                      {creatorEstProfit >= 0 ? "+" : ""}${creatorEstProfit.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* System-Linked Dynamic Max Limit Communication */}
                              <div className="bg-indigo-50/70 dark:bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 space-y-1.5">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                                    ⚡ SYSTEM CONTRIBUTION LIMIT
                                  </span>
                                  <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase">
                                    DYNAMICALLY LINKED
                                  </span>
                                </div>
                                <div className="bg-white dark:bg-zinc-800 p-2 rounded-lg border border-indigo-100 dark:border-zinc-700 flex justify-between items-center shadow-xs text-[11px]">
                                  <span className="text-gray-500 font-bold">Max Required Contribution:</span>
                                  <span className="font-black text-emerald-600 dark:text-emerald-400">
                                    ${remainingNeeded.toFixed(2)}
                                  </span>
                                </div>
                                <p className="text-[9px] text-indigo-700/80 dark:text-indigo-300/80 font-medium leading-tight">
                                  System dynamically caps maximum contribution to the exact remaining required balance (<span className="font-bold">${remainingNeeded.toFixed(2)}</span>).
                                </p>
                              </div>

                              {/* Limit Max Contributors & Visibility */}
                              <div className="grid grid-cols-2 gap-2.5 pt-1">
                                <div>
                                  <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 block mb-1">
                                    Limit Max Contributors (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Unlimited or e.g. 10"
                                    value={tujenganeMaxMembers}
                                    onChange={(e) => setTujenganeMaxMembers(e.target.value)}
                                    className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-gray-900 dark:text-white outline-none"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 block mb-1">
                                    Pool Visibility
                                  </label>
                                  <div className="flex gap-1">
                                    {(["Public", "Clan", "Friends"] as const).map((vis) => (
                                      <button
                                        key={vis}
                                        type="button"
                                        onClick={() => setTujenganeVisibility(vis)}
                                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                                          tujenganeVisibility === vis
                                            ? "bg-indigo-600 text-white"
                                            : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                                        }`}
                                      >
                                        {vis}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Dynamic Progress Display */}
                            <div className="bg-gray-50 dark:bg-zinc-900 p-3.5 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-2.5 text-xs">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Dynamic Progress</span>
                                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50">
                                  {contributorsJoinedCount} Contributors Joined
                                </span>
                              </div>

                              <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-white dark:bg-zinc-800 p-2 rounded-xl border border-gray-100 dark:border-zinc-700">
                                  <span className="text-[9px] text-gray-400 font-bold uppercase block">Group Target Stake</span>
                                  <span className="text-xs font-black text-gray-900 dark:text-white">${groupTargetStake.toFixed(2)}</span>
                                </div>
                                <div className="bg-white dark:bg-zinc-800 p-2 rounded-xl border border-gray-100 dark:border-zinc-700">
                                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase block">Amount Raised</span>
                                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">${totalRaised.toFixed(2)}</span>
                                </div>
                                <div className="bg-white dark:bg-zinc-800 p-2 rounded-xl border border-gray-100 dark:border-zinc-700">
                                  <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold uppercase block">Remaining Amount</span>
                                  <span className="text-xs font-black text-amber-600 dark:text-amber-400">${remainingNeeded.toFixed(2)}</span>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span className="text-gray-500">Funding Progress</span>
                                  <span className="text-indigo-600 dark:text-indigo-400">{raiseProgressPct.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-emerald-500 h-full transition-all duration-300" 
                                    style={{ width: `${raiseProgressPct}%` }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Contributor Breakdown & Proportional Payout Preview */}
                            <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-2 text-xs">
                              <div className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1 flex justify-between items-center">
                                <span>Contributors & Proportional Returns</span>
                                <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold">Proportional Returns</span>
                              </div>

                              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                                {tujenganeContributorsList.map((item, idx) => {
                                  const ownPct = groupTargetStake > 0 ? ((item.amount || 0) / groupTargetStake) * 100 : 0;
                                  const estWin = (ownPct / 100) * winnerReceives;
                                  const estProfit = estWin - (item.amount || 0);
                                  return (
                                    <div key={item.id || idx} className="flex justify-between items-center bg-gray-50 dark:bg-zinc-800/80 p-2 rounded-xl text-xs">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-indigo-500 font-bold">👤</span>
                                        <div>
                                          <span className="font-bold text-gray-900 dark:text-white block">{item.name}</span>
                                          <span className="text-[10px] text-gray-400 font-semibold">${item.amount.toFixed(2)} contributed</span>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <span className="font-bold text-indigo-600 dark:text-indigo-400 block">{ownPct.toFixed(1)}% Share</span>
                                        <div className="text-[10px] flex gap-1 justify-end font-bold">
                                          <span className="text-emerald-600 dark:text-emerald-400">Return: ${estWin.toFixed(2)}</span>
                                          <span className={estProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}>
                                            ({estProfit >= 0 ? "+" : ""}${estProfit.toFixed(2)})
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="bg-amber-50 dark:bg-amber-950/30 p-2 rounded-xl border border-amber-200/50 text-[10px] text-amber-900 dark:text-amber-200 leading-tight flex items-center gap-1.5">
                                <span>💡</span>
                                <span>
                                  Every contributor earns winnings strictly according to their contribution percentage.
                                </span>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Mode 2: Equal Contributions */}
                        {tujenganeModelMode === "fixed" && (
                          <>
                            {/* Team Setup (Equal Controls) */}
                            <div className="bg-white dark:bg-zinc-900 p-3.5 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-3 text-xs shadow-xs">
                              <div className="flex justify-between items-center text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                <span>⚙️ POOL SETTINGS (CREATOR CONTROLS)</span>
                                <span className="text-[9px] text-gray-400 uppercase font-extrabold tracking-wider">EQUAL CONTRIBUTIONS</span>
                              </div>

                              <div>
                                <label className="text-gray-700 dark:text-gray-300 font-bold text-[11px] block mb-1.5">
                                  Number of Contributors
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                  {[2, 3, 4, 5, 10].map((num) => (
                                    <button
                                      key={num}
                                      type="button"
                                      onClick={() => {
                                        setIsTujenganeCustom(false);
                                        setTujenganeContributorsCount(num);
                                      }}
                                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                                        !isTujenganeCustom && memberCount === num
                                          ? "bg-indigo-600 text-white shadow-xs"
                                          : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                                      }`}
                                    >
                                      {num}
                                    </button>
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() => setIsTujenganeCustom(true)}
                                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                                      isTujenganeCustom
                                        ? "bg-indigo-600 text-white shadow-xs"
                                        : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                                    }`}
                                  >
                                    Custom
                                  </button>
                                </div>
                                {isTujenganeCustom && (
                                  <div className="mt-2">
                                    <input
                                      type="number"
                                      min="2"
                                      max="100"
                                      placeholder="Enter number of members (e.g. 6)"
                                      value={tujenganeCustomMembersInput}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setTujenganeCustomMembersInput(val);
                                        const parsed = parseInt(val);
                                        if (parsed >= 2) setTujenganeContributorsCount(parsed);
                                      }}
                                      className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 space-y-1.5">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase block">Required Contribution Per Member</span>
                                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400">Divided equally across {memberCount} seats</span>
                                  </div>
                                  <span className="font-black text-sm text-emerald-700 dark:text-emerald-300">${contributionPerMember.toFixed(2)}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] text-center border-t border-emerald-200/50">
                                  <div>
                                    <span className="text-gray-500 block">Ownership</span>
                                    <span className="font-bold text-emerald-800 dark:text-emerald-300">{(100 / memberCount).toFixed(1)}%</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 block">Est. Return</span>
                                    <span className="font-bold text-emerald-800 dark:text-emerald-300">${((1 / memberCount) * winnerReceives).toFixed(2)}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 block">Est. Profit</span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                      +${(((1 / memberCount) * winnerReceives) - contributionPerMember).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Limit Max Contributors & Visibility */}
                              <div className="grid grid-cols-2 gap-2.5 pt-1">
                                <div>
                                  <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 block mb-1">
                                    Limit Max Contributors (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Unlimited or e.g. 10"
                                    value={tujenganeMaxMembers}
                                    onChange={(e) => setTujenganeMaxMembers(e.target.value)}
                                    className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-gray-900 dark:text-white outline-none"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 block mb-1">
                                    Pool Visibility
                                  </label>
                                  <div className="flex gap-1">
                                    {(["Public", "Clan", "Friends"] as const).map((vis) => (
                                      <button
                                        key={vis}
                                        type="button"
                                        onClick={() => setTujenganeVisibility(vis)}
                                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                                          tujenganeVisibility === vis
                                            ? "bg-indigo-600 text-white"
                                            : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                                        }`}
                                      >
                                        {vis}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Equal Progress Display */}
                            <div className="bg-gray-50 dark:bg-zinc-900 p-3.5 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-2.5 text-xs">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Dynamic Progress</span>
                                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50">
                                  {tujenganeJoinedCount} / {memberCount} Members Joined
                                </span>
                              </div>

                              <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-white dark:bg-zinc-800 p-2 rounded-xl border border-gray-100 dark:border-zinc-700">
                                  <span className="text-[9px] text-gray-400 font-bold uppercase block">Group Target Stake</span>
                                  <span className="text-xs font-black text-gray-900 dark:text-white">${groupTargetStake.toFixed(2)}</span>
                                </div>
                                <div className="bg-white dark:bg-zinc-800 p-2 rounded-xl border border-gray-100 dark:border-zinc-700">
                                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase block">Amount Raised</span>
                                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">${fixedRaisedAmount.toFixed(2)}</span>
                                </div>
                                <div className="bg-white dark:bg-zinc-800 p-2 rounded-xl border border-gray-100 dark:border-zinc-700">
                                  <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold uppercase block">Remaining Amount</span>
                                  <span className="text-xs font-black text-amber-600 dark:text-amber-400">${fixedRemainingAmount.toFixed(2)}</span>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span className="text-gray-500">Funding Progress</span>
                                  <span className="text-indigo-600 dark:text-indigo-400">{fixedProgressPct.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-emerald-500 h-full transition-all duration-300" 
                                    style={{ width: `${fixedProgressPct}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Escrow Summary */}
                        <div className="bg-gray-50 dark:bg-zinc-900 p-3 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-1.5 text-xs">
                          <div className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">
                            Escrow Summary
                          </div>
                          <div className="flex justify-between py-1 border-b border-gray-100 dark:border-zinc-800">
                            <span className="text-gray-500">Contract Value</span>
                            <span className="font-bold text-gray-900 dark:text-white">${calc.contractValue.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-gray-100 dark:border-zinc-800">
                            <span className="text-gray-500">Escrow Fee (2%)</span>
                            <span className="font-bold text-rose-500">${totalEscrowFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-500 font-bold">Total Winner Receives</span>
                            <span className="font-black text-emerald-600 dark:text-emerald-400">${winnerReceives.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Pool Status */}
                        <div className="bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50 flex justify-between items-center text-xs">
                          <span className="font-bold text-amber-800 dark:text-amber-300 uppercase text-[10px]">Pool Status</span>
                          <span className="font-bold text-amber-900 dark:text-amber-200">{getTujenganePoolStatusText()}</span>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}

              {/* STAGE 2: Choose Distribution ("choose_distribution") */}
              {escrowModalStage === "choose_distribution" && (
                <div className="space-y-4 py-1 font-sans">
                  {/* Summary Card */}
                  <div className="bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-gray-100 dark:border-zinc-700/50">
                    <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                      <div className="text-gray-500 font-bold uppercase text-[10px]">Match</div>
                      <div className="font-black text-gray-900 dark:text-white text-right truncate">{ratioMatchName}</div>
                      <div className="text-gray-500 font-bold uppercase text-[10px]">Prediction</div>
                      <div className="font-black text-gray-900 dark:text-white text-right">
                        {ratioOddName === "1" ? ratioMatch?.homeTeam : ratioOddName === "2" ? ratioMatch?.awayTeam : "Draw"} @{ratioOddValue.toFixed(2)}
                      </div>
                      <div className="text-gray-500 font-bold uppercase text-[10px]">Contract Value</div>
                      <div className="font-black text-blue-600 dark:text-blue-400 text-right">${getCentralCalculation().contractValue.toFixed(2)}</div>
                      <div className="text-gray-500 font-bold uppercase text-[10px]">Challenge Type</div>
                      <div className="font-black text-emerald-600 dark:text-emerald-400 text-right">
                        {escrowEngineTab === "mimi" ? mimiChallengeType + " Challenge" : escrowEngineTab === "three_way" ? "Three-Way Challenge" : "Tujengane Challenge"}
                      </div>
                    </div>
                  </div>

                  {/* Audience checkboxes if Open Challenge */}
                  {escrowEngineTab === "mimi" && mimiChallengeType === "Open" && (
                    <div>
                      <h3 className="text-xs font-bold uppercase text-gray-900 dark:text-white mb-1.5">Audience Selection</h3>
                      <p className="text-[10px] text-gray-500 mb-2">Who Can Accept This Challenge?</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { key: 'friends', label: 'Friends' },
                          { key: 'clan', label: 'Clan Members' },
                          { key: 'public', label: 'Public Community' },
                          { key: 'similar', label: 'Similar Bettors' },
                          { key: 'verified', label: 'Verified Players' }
                        ].map((item) => (
                          <label key={item.key} className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-zinc-700">
                            <input 
                              type="checkbox" 
                              checked={openAudience[item.key as keyof typeof openAudience]}
                              onChange={(e) => setOpenAudience({...openAudience, [item.key]: e.target.checked})}
                              className="w-3.5 h-3.5 rounded text-emerald-600 bg-gray-100 border-gray-300 focus:ring-emerald-500 dark:bg-zinc-800 dark:border-zinc-700 dark:ring-offset-zinc-900"
                            />
                            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Options: Distribution methods */}
                  <div className="space-y-2.5 pt-2">
                    <div className="text-[11px] text-gray-500 text-center font-bold">
                      Select Distribution Method
                    </div>
                    {escrowEngineTab === "tujengane" ? (
                      <>
                        <button 
                          onClick={() => setEscrowModalStage("nyota_confirm")}
                          className="w-full bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                        >
                          <span className="text-base">🤖</span> Find Contributors & Opponents with Nyota AI
                        </button>
                        <button 
                          onClick={() => {
                            setTujenganeJoinedCount(1);
                            setTujenganeOpponent1Matched(false);
                            setTujenganeOpponent2Matched(false);
                            setEscrowModalStage("published");
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                        >
                          <span className="text-base">📢</span> Publish Tujengane Pool
                        </button>
                      </>
                    ) : escrowEngineTab === "three_way" ? (
                      <>
                        <button 
                          onClick={() => setEscrowModalStage("nyota_confirm")}
                          className="w-full bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                        >
                          <span className="text-base">🤖</span> Find Participants with Nyota AI
                        </button>
                        <button 
                          onClick={() => {
                            setThreeWayJoinedCount(1);
                            setEscrowModalStage("published");
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                        >
                          <span className="text-base">📢</span> Publish 3-Way Challenge
                        </button>
                      </>
                    ) : (
                      <>
                        {mimiChallengeType === "Private" && (
                          <button 
                            onClick={() => setEscrowModalStage("invite_friend")}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                          >
                            <span className="text-base">👤</span> Invite Friend (Private Challenge)
                          </button>
                        )}
                        <button 
                          onClick={() => setEscrowModalStage("nyota_confirm")}
                          className="w-full bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                        >
                          <span className="text-base">🤖</span> Nyota AI Search
                        </button>
                        {mimiChallengeType !== "Private" && (
                          <button 
                            onClick={() => setEscrowModalStage("invite_friend")}
                            className="w-full bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                          >
                            <span className="text-base">👤</span> Invite Friend (Private Challenge)
                          </button>
                        )}
                        <button 
                          onClick={() => setEscrowModalStage("published")}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                        >
                          <span className="text-base">📢</span> Publish Open Challenge
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* STAGE: Invite Friend ("invite_friend") */}
              {escrowModalStage === "invite_friend" && (
                <div className="space-y-3 font-sans py-1">
                  {/* Contract Summary */}
                  <div className="bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-gray-100 dark:border-zinc-700/50">
                    <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                      <div className="text-gray-500 font-bold uppercase text-[10px]">Match</div>
                      <div className="font-black text-gray-900 dark:text-white text-right truncate">{ratioMatchName}</div>
                      <div className="text-gray-500 font-bold uppercase text-[10px]">Prediction</div>
                      <div className="font-black text-gray-900 dark:text-white text-right">
                        {ratioOddName === "1" ? ratioMatch?.homeTeam : ratioOddName === "2" ? ratioMatch?.awayTeam : "Draw"} @{ratioOddValue.toFixed(2)}
                      </div>
                      <div className="text-gray-500 font-bold uppercase text-[10px]">Contract Value</div>
                      <div className="font-black text-blue-600 dark:text-blue-400 text-right">${getCentralCalculation().contractValue.toFixed(2)}</div>
                      <div className="text-gray-500 font-bold uppercase text-[10px]">Challenge Type</div>
                      <div className="font-black text-purple-600 dark:text-purple-400 text-right">Private Challenge</div>
                    </div>
                  </div>

                  {/* Friend Search Header & Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-500 font-bold uppercase block">Send Challenge To</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
                      <input
                        type="text"
                        placeholder="Search friend by name or @username..."
                        value={privateFriendSearchQuery}
                        onChange={(e) => setPrivateFriendSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl py-2 pl-8 pr-8 text-xs text-gray-900 dark:text-white outline-none focus:border-purple-500 transition-all"
                      />
                      {privateFriendSearchQuery && (
                        <button
                          onClick={() => setPrivateFriendSearchQuery("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-bold cursor-pointer"
                          title="Clear Search"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Friend List (Recent Searches vs Live Search Results) */}
                  {(() => {
                    const trimmedQ = privateFriendSearchQuery.trim();
                    const isSearching = trimmedQ.length >= 2;

                    if (!isSearching) {
                      // Recent Searches
                      const recentFriends = recentSearchIds
                        .map((id) => connectedFriendsList.find((f) => f.id === id))
                        .filter((f): f is PrivateChallengeFriend => Boolean(f));

                      return (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between px-0.5">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
                              <span>🕒</span> Recent Searches
                            </span>
                            <span className="text-[9px] text-gray-400 font-mono">{recentFriends.length} friends</span>
                          </div>
                          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                            {recentFriends.map((friend) => {
                              const isSelected = selectedPrivateFriend?.id === friend.id;
                              return (
                                <div
                                  key={friend.id}
                                  onClick={() => handleSelectPrivateFriend(friend)}
                                  className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                    isSelected
                                      ? "bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 shadow-xs"
                                      : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="relative">
                                      <img src={friend.avatar} alt={friend.displayName} className="w-8 h-8 rounded-full object-cover" />
                                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-900 ${
                                        friend.status === "online" ? "bg-emerald-500" : friend.status === "idle" ? "bg-amber-500" : "bg-gray-400"
                                      }`} />
                                    </div>
                                    <div>
                                      <div className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1">
                                        <span>{friend.displayName}</span>
                                        {friend.verified && (
                                          <span className="bg-blue-500 text-white rounded-full w-3.5 h-3.5 inline-flex items-center justify-center text-[8px] font-black" title="Verified Friend">✓</span>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-gray-400 font-mono">{friend.username}</div>
                                    </div>
                                  </div>
                                  <div>
                                    {isSelected ? (
                                      <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">✓ Selected</span>
                                    ) : (
                                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold hover:underline">Select</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }

                    // Live Search Results
                    const qLower = trimmedQ.toLowerCase();
                    const matched = connectedFriendsList.filter(
                      (f) => f.displayName.toLowerCase().includes(qLower) || f.username.toLowerCase().includes(qLower)
                    );

                    const sortedResults = matched.sort((a, b) => {
                      const aName = a.displayName.toLowerCase();
                      const bName = b.displayName.toLowerCase();
                      const aUser = a.username.toLowerCase();
                      const bUser = b.username.toLowerCase();

                      // 1. Starts with typed letters
                      const aStarts = aName.startsWith(qLower) || aUser.startsWith(qLower);
                      const bStarts = bName.startsWith(qLower) || bUser.startsWith(qLower);
                      if (aStarts && !bStarts) return -1;
                      if (!aStarts && bStarts) return 1;

                      // 2. Recently searched friends
                      const aRecent = recentSearchIds.indexOf(a.id);
                      const bRecent = recentSearchIds.indexOf(b.id);
                      if (aRecent !== -1 && bRecent !== -1) return aRecent - bRecent;
                      if (aRecent !== -1 && bRecent === -1) return -1;
                      if (aRecent === -1 && bRecent !== -1) return 1;

                      // 3. Alphabetical matches
                      return a.displayName.localeCompare(b.displayName);
                    });

                    return (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between px-0.5">
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
                            <span>🔍</span> Search Results ({sortedResults.length})
                          </span>
                          <button
                            onClick={() => setPrivateFriendSearchQuery("")}
                            className="text-[10px] text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
                          >
                            Clear Search
                          </button>
                        </div>

                        {sortedResults.length > 0 ? (
                          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                            {sortedResults.map((friend) => {
                              const isSelected = selectedPrivateFriend?.id === friend.id;
                              return (
                                <div
                                  key={friend.id}
                                  onClick={() => handleSelectPrivateFriend(friend)}
                                  className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                    isSelected
                                      ? "bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 shadow-xs"
                                      : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="relative">
                                      <img src={friend.avatar} alt={friend.displayName} className="w-8 h-8 rounded-full object-cover" />
                                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-900 ${
                                        friend.status === "online" ? "bg-emerald-500" : friend.status === "idle" ? "bg-amber-500" : "bg-gray-400"
                                      }`} />
                                    </div>
                                    <div>
                                      <div className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1">
                                        <span>{friend.displayName}</span>
                                        {friend.verified && (
                                          <span className="bg-blue-500 text-white rounded-full w-3.5 h-3.5 inline-flex items-center justify-center text-[8px] font-black" title="Verified Friend">✓</span>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-gray-400 font-mono">{friend.username}</div>
                                    </div>
                                  </div>
                                  <div>
                                    {isSelected ? (
                                      <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">✓ Selected</span>
                                    ) : (
                                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold hover:underline">Select</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl border border-dashed border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-900/50 text-center space-y-2">
                            <div className="text-gray-400 text-xl">👤🔍</div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-bold">
                              No matching friend found.
                            </p>
                            <button
                              onClick={() => setPrivateFriendSearchQuery("")}
                              className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/60 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              Clear Search
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Selected Opponent card */}
                  {selectedPrivateFriend && (
                    <div className="bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 p-3 rounded-2xl space-y-2.5">
                      <div className="text-[10px] text-purple-700 dark:text-purple-300 font-black uppercase tracking-wider flex justify-between items-center">
                        <span>Selected Opponent</span>
                        <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full text-[9px] font-bold">✓ Ready to Invite</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={selectedPrivateFriend.avatar} alt={selectedPrivateFriend.displayName} className="w-8 h-8 rounded-full object-cover border border-purple-300" />
                          <div>
                            <div className="font-black text-xs text-gray-900 dark:text-white">{selectedPrivateFriend.displayName}</div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">{selectedPrivateFriend.username}</div>
                          </div>
                        </div>
                      </div>

                      {/* Private Challenge Mode Dropdown */}
                      <div className="pt-2 border-t border-purple-100 dark:border-purple-900/50 flex flex-col gap-1 text-xs">
                        <label className="text-gray-600 dark:text-gray-300 font-bold text-[11px] block">
                          Private Challenge Mode
                        </label>
                        <select
                          value={privateChallengeMode}
                          onChange={(e) => {
                            const mode = e.target.value as "Open" | "Forced";
                            setPrivateChallengeMode(mode);
                            if (mode === "Open") {
                              setPrivateForcedOutcome("");
                            }
                          }}
                          className="w-full bg-white dark:bg-zinc-800 border border-purple-200 dark:border-purple-800 rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-900 dark:text-white outline-none cursor-pointer focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="Open">Open</option>
                          <option value="Forced">Forced</option>
                        </select>
                      </div>

                      {/* Force Friend To Bet On Dropdown (Shown only when Forced mode selected) */}
                      {privateChallengeMode === "Forced" && (
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-gray-600 dark:text-gray-300 font-bold text-[11px] block">
                            Force Friend To Bet On
                          </label>
                          <select
                            value={privateForcedOutcome}
                            onChange={(e) => setPrivateForcedOutcome(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-800 border border-purple-200 dark:border-purple-800 rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-900 dark:text-white outline-none cursor-pointer focus:ring-1 focus:ring-purple-500"
                          >
                            <option value="">-- Select Forced Outcome --</option>
                            {(() => {
                              const creatorPick = getNormalizedCreatorPick();
                              if (creatorPick === "1") {
                                return (
                                  <>
                                    <option value="X">Draw</option>
                                    <option value="2">Away ({ratioMatch?.awayTeam || "Away"})</option>
                                  </>
                                );
                              } else if (creatorPick === "X") {
                                return (
                                  <>
                                    <option value="1">Home ({ratioMatch?.homeTeam || "Home"})</option>
                                    <option value="2">Away ({ratioMatch?.awayTeam || "Away"})</option>
                                  </>
                                );
                              } else {
                                return (
                                  <>
                                    <option value="1">Home ({ratioMatch?.homeTeam || "Home"})</option>
                                    <option value="X">Draw</option>
                                  </>
                                );
                              }
                            })()}
                          </select>
                        </div>
                      )}

                      {/* Immediate Recalculation Display when Forced Outcome selected */}
                      {privateChallengeMode === "Forced" && privateForcedOutcome && (
                        <div className="bg-purple-100/80 dark:bg-purple-900/40 p-2.5 rounded-xl text-xs flex justify-between items-center border border-purple-200 dark:border-purple-800">
                          <span className="text-purple-800 dark:text-purple-300 font-bold text-[11px]">
                            Opponent Required Stake:
                          </span>
                          <span className="font-black text-purple-950 dark:text-purple-100 text-xs">
                            ${getCentralCalculation().opponentStake.toFixed(2)}
                          </span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-purple-100 dark:border-purple-900/50 flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-300 font-bold text-[11px]">Invitation Expiry:</span>
                        <select
                          value={privateChallengeExpiry}
                          onChange={(e) => setPrivateChallengeExpiry(e.target.value as "15m" | "1h" | "24h")}
                          className="bg-white dark:bg-zinc-800 border border-purple-200 dark:border-purple-800 rounded-lg px-2 py-1 text-xs font-bold text-gray-900 dark:text-white outline-none cursor-pointer"
                        >
                          <option value="15m">15 Minutes</option>
                          <option value="1h">1 Hour</option>
                          <option value="24h">24 Hours</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Primary Button */}
                  <button
                    disabled={!selectedPrivateFriend || (privateChallengeMode === "Forced" && !privateForcedOutcome)}
                    onClick={handleSendPrivateChallenge}
                    className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                      selectedPrivateFriend && (privateChallengeMode !== "Forced" || privateForcedOutcome)
                        ? "bg-purple-600 hover:bg-purple-700 text-white cursor-pointer" 
                        : "bg-gray-200 text-gray-400 dark:bg-zinc-800 dark:text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <span>📩</span> Send Private Challenge
                  </button>
                </div>
              )}

              {/* STAGE: Private Challenge Sent ("private_sent") */}
              {escrowModalStage === "private_sent" && (
                <div className="space-y-3 font-sans py-1">
                  <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 p-3 rounded-2xl text-center space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <img src={selectedPrivateFriend?.avatar} className="w-7 h-7 rounded-full object-cover border border-purple-400" />
                      <span className="font-black text-xs text-purple-900 dark:text-purple-200">
                        Invited: {selectedPrivateFriend?.displayName} ({selectedPrivateFriend?.username})
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                      ⏳ Status: Waiting for Response
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                      Time Remaining to Respond: {Math.floor(privateChallengeTimeLeft / 60)}m {privateChallengeTimeLeft % 60}s
                    </div>
                  </div>

                  {/* View Mode Switcher */}
                  <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl gap-1 text-xs">
                    <button
                      onClick={() => setPrivateChallengeViewMode("creator")}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                        privateChallengeViewMode === "creator"
                          ? "bg-white dark:bg-zinc-900 text-purple-600 dark:text-purple-400 shadow-xs"
                          : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                      }`}
                    >
                      👁️ Creator View
                    </button>
                    <button
                      onClick={() => setPrivateChallengeViewMode("friend")}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                        privateChallengeViewMode === "friend"
                          ? "bg-purple-600 text-white shadow-xs"
                          : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                      }`}
                    >
                      👤 Friend's View (Simulation)
                    </button>
                  </div>

                  {privateChallengeViewMode === "creator" ? (
                    <div className="space-y-3">
                      <div className="bg-gray-50 dark:bg-zinc-900 p-3 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-1.5 text-xs">
                        <div className="text-[10px] text-gray-400 font-bold uppercase pb-1 border-b border-gray-100 dark:border-zinc-800">
                          Invitation Contract Summary
                        </div>
                        <div className="grid grid-cols-2 gap-y-1 text-[11px]">
                          <span className="text-gray-500">Match:</span>
                          <span className="font-bold text-right truncate text-gray-900 dark:text-white">{ratioMatchName}</span>

                          <span className="text-gray-500">Your Prediction:</span>
                          <span className="font-bold text-right text-gray-900 dark:text-white">
                            {ratioOddName === "1" ? ratioMatch?.homeTeam : ratioOddName === "2" ? ratioMatch?.awayTeam : "Draw"} @{ratioOddValue.toFixed(2)}
                          </span>

                          <span className="text-gray-500">Contract Value:</span>
                          <span className="font-black text-right text-blue-600 dark:text-blue-400">${getCentralCalculation().contractValue.toFixed(2)}</span>

                          <span className="text-gray-500">Your Locked Stake:</span>
                          <span className="font-bold text-right text-emerald-600 dark:text-emerald-400">${getCentralCalculation().userStake.toFixed(2)}</span>

                          <span className="text-gray-500">Opponent Req. Stake:</span>
                          <span className="font-bold text-right text-purple-600 dark:text-purple-400">${getCentralCalculation().opponentStake.toFixed(2)}</span>

                          <span className="text-gray-500">Challenge Type:</span>
                          <span className="font-bold text-right text-purple-600 dark:text-purple-400">Private Challenge</span>
                        </div>
                      </div>

                      {/* Quick Testing Triggers */}
                      <div className="bg-gray-50 dark:bg-zinc-800/60 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 space-y-1.5">
                        <div className="text-[10px] text-gray-500 font-bold uppercase text-center">
                          ⚡ Interactive Response Testing Triggers
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={handleFriendAcceptChallenge}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            ✓ Accept
                          </button>
                          <button
                            onClick={handleFriendDeclineChallenge}
                            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            ✕ Decline
                          </button>
                          <button
                            onClick={handleFriendExpireChallenge}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            ⏰ Expire
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* FRIEND'S VIEW CARD */
                    <div className="bg-white dark:bg-zinc-900 border-2 border-purple-500/80 rounded-2xl p-3 space-y-3 shadow-lg">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📩</span>
                          <div>
                            <div className="font-black text-xs text-gray-900 dark:text-white">FaceLook Bet Messenger Challenge</div>
                            <div className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">Received from You (Creator)</div>
                          </div>
                        </div>
                        <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                          Private
                        </span>
                      </div>

                      <div className="bg-gray-50 dark:bg-zinc-800/70 p-2.5 rounded-xl space-y-1.5 text-xs border border-gray-100 dark:border-zinc-700">
                        <div className="grid grid-cols-2 gap-y-1 text-[11px]">
                          <span className="text-gray-500 font-bold">Match:</span>
                          <span className="font-black text-right truncate text-gray-900 dark:text-white">{ratioMatchName}</span>

                          <span className="text-gray-500 font-bold">Creator's Pick:</span>
                          <span className="font-black text-right text-gray-900 dark:text-white">
                            {ratioOddName === "1" ? ratioMatch?.homeTeam : ratioOddName === "2" ? ratioMatch?.awayTeam : "Draw"} @{ratioOddValue.toFixed(2)}
                          </span>

                          <span className="text-gray-500 font-bold">Contract Value:</span>
                          <span className="font-black text-right text-blue-600 dark:text-blue-400">${getCentralCalculation().contractValue.toFixed(2)}</span>

                          <span className="text-gray-500 font-bold">Your Required Stake:</span>
                          <span className="font-black text-right text-emerald-600 dark:text-emerald-400">${getCentralCalculation().opponentStake.toFixed(2)}</span>

                          <span className="text-gray-500 font-bold">Your Wallet Balance:</span>
                          <span className="font-bold text-right text-gray-900 dark:text-white">${selectedPrivateFriend?.walletBalance.toFixed(2)}</span>
                        </div>

                        <div className="pt-1.5 border-t border-gray-200 dark:border-zinc-700 flex justify-between items-center text-[10px]">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            ✓ Wallet Verified (Sufficient Balance)
                          </span>
                          <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">
                            ⏱️ {Math.floor(privateChallengeTimeLeft / 60)}m left
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={handleFriendAcceptChallenge}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-black text-xs transition-colors shadow-md cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span>✓</span> Accept Challenge
                        </button>
                        <button
                          onClick={handleFriendDeclineChallenge}
                          className="flex-1 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span>✕</span> Decline
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STAGE: Private Challenge Declined ("private_declined") */}
              {escrowModalStage === "private_declined" && (
                <div className="py-4 space-y-4 text-center font-sans">
                  <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                    ❌
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 dark:text-white text-base mb-1">
                      Private Challenge Declined
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed px-2">
                      Your private challenge was declined by <span className="font-bold">{selectedPrivateFriend?.displayName || "your friend"}</span>.
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => {
                        setSelectedPrivateFriend(null);
                        setEscrowModalStage("invite_friend");
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <span>👤</span> Invite Another Friend
                    </button>
                    <button
                      onClick={() => {
                        setMimiChallengeType("Open");
                        setEscrowModalStage("published");
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <span>📢</span> Convert to Open Challenge
                    </button>
                    <button
                      onClick={() => {
                        setShowEscrowCalculationModal(false);
                        setTimeout(() => setEscrowModalStage("calculation"), 300);
                      }}
                      className="w-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors hover:bg-gray-200"
                    >
                      Cancel Challenge
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE: Private Challenge Expired ("private_expired") */}
              {escrowModalStage === "private_expired" && (
                <div className="py-4 space-y-4 text-center font-sans">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                    ⏰
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 dark:text-white text-base mb-1">
                      Invitation Expired
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed px-2">
                      Your invitation to <span className="font-bold">{selectedPrivateFriend?.displayName || "your friend"}</span> expired without a response.
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleSendPrivateChallenge}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <span>🔄</span> Resend Invitation
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPrivateFriend(null);
                        setEscrowModalStage("invite_friend");
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <span>👤</span> Invite Another Friend
                    </button>
                    <button
                      onClick={() => {
                        setMimiChallengeType("Open");
                        setEscrowModalStage("published");
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <span>📢</span> Convert to Open Challenge
                    </button>
                    <button
                      onClick={() => {
                        setShowEscrowCalculationModal(false);
                        setTimeout(() => setEscrowModalStage("calculation"), 300);
                      }}
                      className="w-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors hover:bg-gray-200"
                    >
                      Cancel Challenge
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 3: Nyota AI Confirmation Dialog ("nyota_confirm") */}
              {escrowModalStage === "nyota_confirm" && (
                <div className="py-4 space-y-4 text-center font-sans">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                    🤖
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 dark:text-white text-base mb-2">
                      Start Nyota AI Search
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed px-2">
                      Nyota AI will begin searching for the most compatible opponent based on your challenge contract and selected preferences. Continue?
                    </p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => setEscrowModalStage("choose_distribution")}
                      className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                      No
                    </button>
                    <button 
                      onClick={initiateNyotaMessenger}
                      className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors cursor-pointer"
                    >
                      Yes
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 4: Nyota AI Messenger ("nyota_messenger") */}
              {escrowModalStage === "nyota_messenger" && (
                <div className="flex flex-col h-[340px] font-sans">
                  {/* Conversation Chat Log */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                    {nyotaMatchMessages.map((msg) => (
                      <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                        <div className={`p-3 rounded-2xl max-w-[85%] ${
                          msg.sender === "user" 
                            ? "bg-indigo-600 text-white rounded-br-none" 
                            : "bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-200/50 dark:border-zinc-700/50"
                        }`}>
                          <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                          
                          {/* Match Presentation Card if opponent found */}
                          {msg.matchCard && (
                            <div className="mt-3 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-indigo-200 dark:border-indigo-800/80 text-gray-900 dark:text-white space-y-2 shadow-xs">
                              <div className="flex justify-between items-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                                <span>Matched Opponent</span>
                                <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full">✓ Wallet Verified</span>
                              </div>
                              <div className="grid grid-cols-2 gap-y-1 text-xs pt-1 border-t border-gray-100 dark:border-zinc-800">
                                <span className="text-gray-500 font-bold">Opponent Outcome:</span>
                                <span className="font-black text-right">{ratioOddName === "1" ? (ratioMatch?.awayTeam || "Away") : (ratioMatch?.homeTeam || "Home")}</span>
                                <span className="text-gray-500 font-bold">Required Stake:</span>
                                <span className="font-black text-right text-emerald-600 dark:text-emerald-400">${getCentralCalculation().opponentStake.toFixed(2)}</span>
                              </div>
                              <div className="text-[10px] text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-zinc-800/60 p-2 rounded-lg border border-gray-100 dark:border-zinc-800">
                                "I matched this opponent because they selected the opposite outcome, have sufficient wallet balance, meet the required stake, and are currently online."
                              </div>
                              <div className="text-[11px] font-bold text-center pt-1 text-gray-700 dark:text-gray-300">
                                Ready to merge this escrow?
                              </div>
                            </div>
                          )}

                          {/* Tujengane Verified Card */}
                          {msg.tujenganeVerifiedCard && (
                            <div className="mt-3 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-indigo-200 dark:border-indigo-800/80 text-gray-900 dark:text-white space-y-2 shadow-xs text-left">
                              <div className="flex justify-between items-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                                <span>Tujengane Pool Verified</span>
                                <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full">✓ Ready to Merge</span>
                              </div>
                              
                              <div className="space-y-1.5 text-xs pt-1 border-t border-gray-100 dark:border-zinc-800">
                                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold">
                                  <span>✓</span> Contributors Complete ({isTujenganeCustom ? (parseInt(tujenganeCustomMembersInput) || 2) : tujenganeContributorsCount}/{isTujenganeCustom ? (parseInt(tujenganeCustomMembersInput) || 2) : tujenganeContributorsCount})
                                </div>
                                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold">
                                  <span>✓</span> Opponent Side 1 Matched
                                </div>
                                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold">
                                  <span>✓</span> Opponent Side 2 Matched
                                </div>
                              </div>

                              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/50 space-y-0.5 text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">
                                <div>✓ All team members funded</div>
                                <div>✓ Both opposing sides matched</div>
                                <div>✓ Full contract locked in escrow</div>
                              </div>

                              <div className="text-[11px] font-bold text-center pt-1 text-emerald-600 dark:text-emerald-400">
                                Ready to Merge Escrow
                              </div>
                            </div>
                          )}
                          {msg.threeWayVerifiedCard && (
                            <div className="mt-3 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-indigo-200 dark:border-indigo-800/80 text-gray-900 dark:text-white space-y-2 shadow-xs">
                              <div className="flex justify-between items-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                                <span>3-Way Contract Verification</span>
                                <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full">✓ All 3 Matched</span>
                              </div>
                              
                              <div className="space-y-1 text-xs pt-1 border-t border-gray-100 dark:border-zinc-800">
                                {getThreeWayParticipants().map((p, pIdx) => (
                                  <div key={pIdx} className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-zinc-800/60 last:border-0">
                                    <div className="font-bold text-gray-800 dark:text-gray-200">
                                      {p.role} <span className="text-[10px] font-normal text-gray-500">({p.shortLabel})</span>
                                    </div>
                                    <div className="text-right font-mono font-bold text-gray-900 dark:text-white">
                                      ${p.stake.toFixed(2)} <span className="text-[10px] text-gray-500 font-normal">@{p.odds.toFixed(2)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/50 space-y-0.5 text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">
                                <div>✓ All 3 participants matched & verified</div>
                                <div>✓ Wallet balances verified</div>
                                <div>✓ Required stakes locked & ready</div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Quick Reply Buttons */}
                        {msg.quickReplies && nyotaMatchStatus !== "merged" && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {msg.quickReplies.map((reply) => (
                              <button
                                key={reply}
                                onClick={() => {
                                  if (reply === "Yes" || reply === "No") {
                                    handleNyotaUserAnswer(reply);
                                  } else {
                                    handleNyotaMatchAction(reply);
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs ${
                                  reply === "Merge Escrow" || reply === "Initialize Escrow"
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                    : reply === "Yes"
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                    : "bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-gray-800 dark:text-gray-200"
                                }`}
                              >
                                {reply}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Chat Input Bar */}
                  {nyotaMatchStatus === "questions" && (
                    <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 flex gap-2">
                      <input
                        type="text"
                        value={nyotaChatInput}
                        onChange={(e) => setNyotaChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleNyotaUserAnswer(nyotaChatInput);
                        }}
                        placeholder="Type answer..."
                        className="flex-1 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleNyotaUserAnswer(nyotaChatInput)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STAGE 5: Receipt ("receipt") */}
              {escrowModalStage === "receipt" && (
                <div className="space-y-3 font-sans py-1">
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3 rounded-2xl text-center space-y-1">
                    <span className="text-2xl">✅</span>
                    <h3 className="font-black text-emerald-700 dark:text-emerald-400 text-xs uppercase tracking-wider">
                      Escrow Active & Locked
                    </h3>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      Contract verified by Nyota AI Engine
                    </p>
                  </div>

                  {/* Formatted Receipt Card */}
                  <div className="bg-gray-50 dark:bg-zinc-900 p-3 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-2 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-zinc-800">
                      <span className="text-gray-400 font-bold uppercase text-[9px]">Receipt No</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">ESC-2026-{receiptNumber || "894201"}-NYOTA</span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
                      <span className="text-gray-500">Match:</span>
                      <span className="font-bold text-right truncate text-gray-900 dark:text-white">{ratioMatchName}</span>

                      <span className="text-gray-500">Prediction:</span>
                      <span className="font-bold text-right text-gray-900 dark:text-white">
                        {ratioOddName === "1" ? ratioMatch?.homeTeam : ratioOddName === "2" ? ratioMatch?.awayTeam : "Draw"} @{ratioOddValue.toFixed(2)}
                      </span>

                      <span className="text-gray-500">Challenge Type:</span>
                      <span className="font-bold text-right text-emerald-600 dark:text-emerald-400">
                        {escrowEngineTab === "mimi" ? mimiChallengeType + " Challenge" : escrowEngineTab === "three_way" ? "Three-Way Challenge" : "Tujengane Challenge"}
                      </span>

                      <span className="text-gray-500">Contract Value:</span>
                      <span className="font-black text-right text-blue-600 dark:text-blue-400">${getCentralCalculation().contractValue.toFixed(2)}</span>

                      <span className="text-gray-500">Your Stake:</span>
                      <span className="font-bold text-right text-gray-900 dark:text-white">${getCentralCalculation().userStake.toFixed(2)}</span>

                      <span className="text-gray-500">Opponent Stake:</span>
                      <span className="font-bold text-right text-gray-900 dark:text-white">${getCentralCalculation().opponentStake.toFixed(2)}</span>

                      <span className="text-gray-500">Escrow Fee:</span>
                      <span className="font-bold text-right text-rose-500">${getCentralCalculation().escrowFee.toFixed(2)}</span>

                      <span className="text-gray-500">Total Locked:</span>
                      <span className="font-black text-right text-emerald-600 dark:text-emerald-400">${getCentralCalculation().escrowLockValue.toFixed(2)}</span>

                      <span className="text-gray-500">Opponent ID:</span>
                      <span className="font-mono font-bold text-right text-gray-900 dark:text-white">OPP-77412-VERIFIED</span>
                    </div>
                  </div>

                  {/* Receipt Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={downloadTextReceipt}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
                    >
                      <span>📥</span> Download Receipt (.txt)
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          window.alert("Navigated to active Escrow Challenge!");
                          setShowEscrowCalculationModal(false);
                          setTimeout(() => setEscrowModalStage("calculation"), 300);
                        }}
                        className="flex-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>👁️</span> View Challenge
                      </button>
                      <button
                        onClick={() => {
                          setShowEscrowCalculationModal(false);
                          setTimeout(() => setEscrowModalStage("calculation"), 300);
                        }}
                        className="flex-1 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 6: Published Challenge ("published") */}
              {escrowModalStage === "published" && (
                <div className="py-2 space-y-3 text-center font-sans">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                    📢
                  </div>

                  {escrowEngineTab === "tujengane" ? (() => {
                    const calc = getCentralCalculation();
                    const creatorPick = getNormalizedCreatorPick();
                    let groupTargetStake = calc.player1Stake;
                    if (creatorPick === "X") groupTargetStake = calc.player2Stake;
                    else if (creatorPick === "2") groupTargetStake = calc.player3Stake;

                    const totalRaised = tujenganeContributorsList.reduce((sum, item) => sum + (item.amount || 0), 0);
                    const remainingNeeded = Math.max(0, groupTargetStake - totalRaised);
                    const raiseProgressPct = groupTargetStake > 0 ? Math.min(100, (totalRaised / groupTargetStake) * 100) : 0;
                    const contributorsJoinedCount = tujenganeContributorsList.filter(item => (item.amount || 0) > 0).length;

                    return (
                    <div className="space-y-3 text-left font-sans">
                      <div className="text-center">
                        <h3 className="font-black text-gray-900 dark:text-white text-base mb-1">
                          Tujengane Pool Published
                        </h3>
                        <div className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold text-[11px] px-3 py-1 rounded-full my-1">
                          <span>⏳</span>
                          {remainingNeeded > 0 ? (
                            <>Status: Waiting for Contributors (${remainingNeeded.toFixed(2)} remaining)</>
                          ) : !tujenganeOpponent1Matched ? (
                            <>Status: Searching for Opponent Side 1...</>
                          ) : !tujenganeOpponent2Matched ? (
                            <>Status: Searching for Opponent Side 2...</>
                          ) : (
                            <>Status: Escrow Ready!</>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed px-2 mt-1">
                          Your Tujengane Flexible Pool contract is live on the global challenge feed.
                        </p>
                      </div>

                      {/* Pool Status Card */}
                      <div className="bg-gray-50 dark:bg-zinc-900 p-3.5 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-2.5 text-xs">
                        <div className="flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-wider">
                          <span>Pool Funding Progress</span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            ${totalRaised.toFixed(2)} / ${groupTargetStake.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full transition-all duration-300"
                            style={{ width: `${raiseProgressPct}%` }}
                          />
                        </div>

                        {/* List of Joined Contributors */}
                        <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 space-y-1.5 text-xs">
                          <div className="text-[10px] font-bold text-gray-400 uppercase">
                            Contributors ({contributorsJoinedCount})
                          </div>
                          <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                            {tujenganeContributorsList.map((item, idx) => (
                              <div key={item.id || idx} className="flex justify-between items-center bg-white dark:bg-zinc-800 p-1.5 rounded-lg text-[11px]">
                                <span className="font-bold text-gray-900 dark:text-white">👤 {item.name}</span>
                                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">${item.amount.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Opponents Status */}
                        <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 space-y-1.5 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-bold">Opponent Side 1</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              tujenganeOpponent1Matched ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                            }`}>
                              {tujenganeOpponent1Matched ? "✓ Matched" : "Searching..."}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-bold">Opponent Side 2</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              tujenganeOpponent2Matched ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                            }`}>
                              {tujenganeOpponent2Matched ? "✓ Matched" : "Searching..."}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Controls */}
                      {remainingNeeded > 0 || !tujenganeOpponent1Matched || !tujenganeOpponent2Matched ? (
                        <div className="space-y-2 pt-1">
                          <button
                            onClick={() => {
                              if (remainingNeeded > 0) {
                                triggerTujenganeNyotaMatchmaking();
                              } else if (!tujenganeOpponent1Matched) {
                                setTujenganeOpponent1Matched(true);
                                setNotifications((prev) => [
                                  {
                                    id: `noti-${Date.now()}`,
                                    text: `⚡ Opponent Side 1 matched for your Tujengane Pool on ${ratioMatchName || "Match"}!`,
                                    time: "Just now",
                                    read: false,
                                  },
                                  ...prev,
                                ]);
                              } else if (!tujenganeOpponent2Matched) {
                                setTujenganeOpponent2Matched(true);
                                setNotifications((prev) => [
                                  {
                                    id: `noti-${Date.now()}`,
                                    text: `🎉 Opponent Side 2 matched! Your Tujengane Pool escrow is ready to initialize.`,
                                    time: "Just now",
                                    read: false,
                                  },
                                  ...prev,
                                ]);
                              }
                            }}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-md flex items-center justify-center gap-1.5"
                          >
                            {remainingNeeded > 0 ? (
                              <><span>👥</span> Simulate Nyota Matching Contributors</>
                            ) : !tujenganeOpponent1Matched ? (
                              <><span>⚡</span> Simulate Opponent Side 1 Matching</>
                            ) : (
                              <><span>⚡</span> Simulate Opponent Side 2 Matching</>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setShowEscrowCalculationModal(false);
                              setTimeout(() => setEscrowModalStage("calculation"), 300);
                            }}
                            className="w-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors hover:bg-gray-200"
                          >
                            Close
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-1 text-center">
                          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-2.5 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                            🎉 Escrow Ready - All contributors & opposing sides matched!
                          </div>
                          <button
                            onClick={() => {
                              const generatedReceiptNum = `${Math.floor(100000 + Math.random() * 900000)}`;
                              setReceiptNumber(generatedReceiptNum);
                              setEscrowModalStage("receipt");
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-md flex items-center justify-center gap-1.5"
                          >
                            <span>🔒</span> Initialize Escrow
                          </button>
                        </div>
                      )}
                    </div>
                  );
                  })() : escrowEngineTab === "three_way" ? (
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-black text-gray-900 dark:text-white text-base mb-1">
                          3-Way Challenge Published
                        </h3>
                        <div className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold text-[11px] px-3 py-1 rounded-full my-1">
                          <span>⏳</span> Status: Waiting for Participants ({threeWayJoinedCount} of 3 Joined)
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed px-2 mt-1">
                          Your 3-Way contract is live on the global feed. You will be notified automatically when opponents join each position.
                        </p>
                      </div>

                      {/* Participant positions list */}
                      <div className="text-left bg-gray-50 dark:bg-zinc-900 p-3 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-2 text-xs">
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">
                          Contract Positions ({threeWayJoinedCount} / 3)
                        </div>
                        {getThreeWayParticipants().map((p, idx) => {
                          const isJoined = idx === 0 || (idx === 1 && threeWayJoinedCount >= 2) || (idx === 2 && threeWayJoinedCount >= 3);
                          return (
                            <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-zinc-800/60 last:border-0">
                              <div className="space-y-0.5">
                                <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                  <span>{p.role}</span>
                                  <span className="text-[10px] text-gray-500 font-normal">({p.label})</span>
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono">
                                  Req. Stake: ${p.stake.toFixed(2)} @{p.odds.toFixed(2)}
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                isJoined 
                                  ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300" 
                                  : "bg-gray-200 dark:bg-zinc-800 text-gray-500"
                              }`}>
                                {isJoined ? "✓ Joined" : "Waiting..."}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Simulation / Action Controls */}
                      {threeWayJoinedCount < 3 ? (
                        <div className="space-y-2 pt-1">
                          <button
                            onClick={() => {
                              const nextCount = threeWayJoinedCount + 1;
                              setThreeWayJoinedCount(nextCount);
                              if (nextCount === 2) {
                                setNotifications((prev) => [
                                  {
                                    id: `noti-${Date.now()}`,
                                    text: `📩 Player 2 joined your 3-Way Challenge on ${ratioMatchName || "Match"}! (2 of 3 Joined)`,
                                    time: "Just now",
                                    read: false,
                                  },
                                  ...prev,
                                ]);
                              } else if (nextCount === 3) {
                                setNotifications((prev) => [
                                  {
                                    id: `noti-${Date.now()}`,
                                    text: `🎉 All 3 participants have joined your 3-Way Challenge on ${ratioMatchName || "Match"}! Ready for escrow initialization.`,
                                    time: "Just now",
                                    read: false,
                                  },
                                  ...prev,
                                ]);
                              }
                            }}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-md flex items-center justify-center gap-1.5"
                          >
                            <span>👤</span> Simulate Participant Joining ({threeWayJoinedCount} → {threeWayJoinedCount + 1})
                          </button>
                          <button
                            onClick={() => {
                              setShowEscrowCalculationModal(false);
                              setTimeout(() => setEscrowModalStage("calculation"), 300);
                            }}
                            className="w-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors hover:bg-gray-200"
                          >
                            Close
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-1">
                          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-2.5 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                            🎉 All 3 participants joined & verified!
                          </div>
                          <button
                            onClick={() => {
                              const generatedReceiptNum = `${Math.floor(100000 + Math.random() * 900000)}`;
                              setReceiptNumber(generatedReceiptNum);
                              setEscrowModalStage("receipt");
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-md flex items-center justify-center gap-1.5"
                          >
                            <span>🔒</span> Initialize Escrow
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="font-black text-gray-900 dark:text-white text-base mb-1">
                          Challenge Published Successfully
                        </h3>
                        <div className="inline-block bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold text-[10px] px-2.5 py-1 rounded-full my-1">
                          ⏳ Status: Waiting for Opponent
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed px-2 mt-2">
                          Your open challenge is now live on the global feed. You will receive a notification as soon as an opponent accepts your contract!
                        </p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={() => {
                            window.alert("Navigated to published Challenge!");
                            setShowEscrowCalculationModal(false);
                            setTimeout(() => setEscrowModalStage("calculation"), 300);
                          }}
                          className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-100 transition-colors cursor-pointer"
                        >
                          View Challenge
                        </button>
                        <button 
                          onClick={() => {
                            setShowEscrowCalculationModal(false);
                            setTimeout(() => setEscrowModalStage("calculation"), 300);
                          }}
                          className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Footer Controls for Calculation / Choose Distribution / Invite Friend stages */}
            {(escrowModalStage === "calculation" || escrowModalStage === "choose_distribution" || escrowModalStage === "invite_friend") && (
              <div className="p-4 border-t border-gray-100 dark:border-zinc-800 flex gap-3 bg-gray-50/50 dark:bg-zinc-900/50">
                <button 
                  onClick={() => {
                    if (escrowModalStage === "choose_distribution" || escrowModalStage === "invite_friend") {
                      setEscrowModalStage("calculation");
                    } else {
                      setShowEscrowCalculationModal(false);
                      setTimeout(() => setEscrowModalStage("calculation"), 300);
                    }
                  }} 
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Back
                </button>
                {escrowModalStage === "calculation" && (
                  <button 
                    onClick={() => {
                      if (escrowEngineTab === "mimi" && mimiChallengeType === "Private") {
                        setEscrowModalStage("invite_friend");
                      } else {
                        setEscrowModalStage("choose_distribution");
                      }
                    }} 
                    className="flex-1 py-2.5 rounded-xl font-bold text-xs shadow-md transition-colors bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    Continue
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ALL MODAL ESCROW PORTALS */}
      <PasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <FLPoolModal
        isOpen={flModalOpen}
        onClose={() => {
          setFlModalOpen(false);
          setSelectedMatchForEscrowPool(null);
        }}
        walletBalance={walletBalance}
        onMatchChallenge={handleMatchFromFlModal}
        filterMatchName={selectedMatchForEscrowPool ? `${selectedMatchForEscrowPool.homeTeam} vs ${selectedMatchForEscrowPool.awayTeam}` : undefined}
        customGlobalChallenges={customGlobalChallenges}
      />



      <InviteModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        isSendoffEnabled={isSendoffEnabled}
        sendoffsCount={sendoffsCount}
        matchName={ratioMatchName}
        onSendInvites={handleInviteFriendsCallback}
      />

      <ActiveChallengersModal
        isOpen={activeChallengersModalOpen}
        onClose={() => setActiveChallengersModalOpen(false)}
        walletBalance={walletBalance}
        matchName={ratioMatchName}
        userSelection={ratioSelection === "1" ? "Home" : ratioSelection === "X" ? "Draw" : "Away"}
        userStake={getCreatorStake()}
        onJoinChallenge={() => {
          handlePostBetChallenge();
          alert(`You successfully completed the 3-Way Match challenge by matching the remaining odds!`);
        }}
        numOpponents={numOpponents}
        targetMode={challengeTargetMode}
        selectedOutcome={ratioSelection as "1" | "X" | "2"}
        collabChallenges={collabChallenges}
        onJoinChallengeById={(collabId, optionSymbol) => {
          handlePerformInteractiveCollabJoin(collabId, optionSymbol, "Collins Dnego (You)", "individual");
          triggerToast(`⚡ Successfully joined and locked 1v1 peer escrow!`, "success");
        }}
        onContributeToCollab={(collabId, amount) => {
          handleContributeToCollab(collabId, amount, "Collins Dnego (You)");
        }}
      />

      <JoinOpponentConfirmModal
        isOpen={joinOpponentModalOpen}
        onClose={() => {
          setJoinOpponentModalOpen(false);
          setSelectedCollabForJoin(null);
        }}
        challenge={selectedCollabForJoin}
        onConfirm={(collabId, optionSymbol, joinerNameInput) => {
          handlePerformInteractiveCollabJoin(collabId, optionSymbol, joinerNameInput, "individual");
        }}
      />

      {/* COLLABORATIVE ACTIVE CHALLENGERS MODAL */}
      {collabModalOpen && selectedCollabForModal && (() => {
        const matchObj = selectedCollabForModal.match;
        const home = matchObj?.homeTeam || "";
        const away = matchObj?.awayTeam || "";
        const prediction = selectedCollabForModal.prediction;
        const oddsVal = selectedCollabForModal.odds || 2.0;

        // Parse creator selection
        let creatorSymbol = selectedCollabForModal.selectedOutcome || "1";
        if (!selectedCollabForModal.selectedOutcome) {
          if (prediction.toLowerCase().includes("draw") || prediction.toLowerCase().includes("(x)")) {
            creatorSymbol = "X";
          } else if (prediction.toLowerCase().includes("away") || prediction.toLowerCase().includes(away.toLowerCase())) {
            creatorSymbol = "2";
          } else {
            creatorSymbol = "1";
          }
        }

        // Compute all three outcomes
        const allOutcomes = [
          { symbol: "1", label: `Home (${home})`, odd: matchObj?.odds?.["1"] || 2.0 },
          { symbol: "X", label: "Draw (X)", odd: matchObj?.odds?.X || 3.0 },
          { symbol: "2", label: `Away (${away})`, odd: matchObj?.odds?.["2"] || 3.0 }
        ];

        const creatorOutcome = allOutcomes.find(o => o.symbol === creatorSymbol) || allOutcomes[0];
        const remainingOutcomes = allOutcomes.filter(o => o.symbol !== creatorSymbol);

        // Calculate potential total pool payout if group wins
        const totalWinningsPool = selectedCollabForModal.targetTotalStake;

        // Safe access to invites
        const currentInvites = selectedCollabForModal.invites || [];

        // Handler to send a cascading invitation (supports single or multi batch-invite)
        const handleSendInvitation = (namesOverride?: string) => {
          const rawNames = namesOverride || collabInviteName;
          if (!rawNames.trim()) {
            alert("Please enter at least one collaborator's name or email.");
            return;
          }
          if (collabInviteStake <= 0) {
            alert("Stake must be greater than zero.");
            return;
          }

          // Split by comma for multi-invite
          const namesList = rawNames
            .split(",")
            .map(n => n.trim())
            .filter(n => n.length > 0);

          if (namesList.length === 0) {
            alert("No valid names found. Ensure they are separated by commas.");
            return;
          }

          // Whichever member was selected to send the invite
          const inviter = collabInviteFrom || "Collins Dnego (You)";

          const newInviteItems = namesList.map((name, index) => ({
            id: `inv-${Date.now()}-${index}`,
            name,
            invitedBy: inviter,
            stake: collabInviteStake,
            status: "pending" as const
          }));

          // Update main challenges state & local modal item state
          setCollabChallenges(prev => prev.map(c => {
            if (c.id === selectedCollabForModal.id) {
              const updatedInvites = [...(c.invites || []), ...newInviteItems];
              return { ...c, invites: updatedInvites };
            }
            return c;
          }));

          setSelectedCollabForModal((prev: any) => ({
            ...prev,
            invites: [...(prev.invites || []), ...newInviteItems]
          }));

          triggerToast(`📨 Successfully sent ${namesList.length} cascading invitations on behalf of ${inviter}!`, "success");
          setCollabInviteName("");
        };

        // Handler to simulate acceptance of all pending invitations at once
        const handleAcceptAllInvitations = () => {
          const pending = currentInvites.filter((i: any) => i.status === "pending");
          if (pending.length === 0) {
            triggerToast("No pending invitations to accept.", "info");
            return;
          }

          setCollabChallenges(prev => prev.map(c => {
            if (c.id === selectedCollabForModal.id) {
              const invites = c.invites || [];
              
              // Filter pending and convert to contributors
              const acceptedPending = invites.filter(i => i.status === "pending");
              const newContributors = acceptedPending.map(i => ({ name: i.name, stake: i.stake }));
              
              const updatedContributors = [...c.contributors, ...newContributors];
              const totalNewStake = acceptedPending.reduce((sum, i) => sum + i.stake, 0);
              const nextStake = c.currentTotalStake + totalNewStake;
              const nextStatus = nextStake >= c.targetTotalStake ? ("posted" as const) : c.status;

              // Mark all pending as accepted
              const updatedInvites = invites.map(i => i.status === "pending" ? { ...i, status: "accepted" as const } : i);

              setTimeout(() => {
                triggerToast(`🤝 All ${acceptedPending.length} collaborators successfully accepted their invitations and funded the pool!`, "success");
              }, 100);

              return {
                ...c,
                contributors: updatedContributors,
                currentTotalStake: nextStake,
                status: nextStatus,
                invites: updatedInvites
              };
            }
            return c;
          }));

          // Synchronize local modal state
          setTimeout(() => {
            setCollabChallenges(currentList => {
              const reloaded = currentList.find(item => item.id === selectedCollabForModal.id);
              if (reloaded) {
                setSelectedCollabForModal(reloaded);
              }
              return currentList;
            });
          }, 150);
        };

        // Handler to simulate invitation acceptance
        const handleAcceptInvitation = (inviteId: string) => {
          setCollabChallenges(prev => prev.map(c => {
            if (c.id === selectedCollabForModal.id) {
              const invites = c.invites || [];
              const targetInvite = invites.find(i => i.id === inviteId);
              if (!targetInvite) return c;

              // Append to contributors
              const updatedContributors = [...c.contributors, { name: targetInvite.name, stake: targetInvite.stake }];
              const nextStake = c.currentTotalStake + targetInvite.stake;
              const nextStatus = nextStake >= c.targetTotalStake ? ("posted" as const) : c.status;

              // Mark invite as accepted
              const updatedInvites = invites.map(i => i.id === inviteId ? { ...i, status: "accepted" as const } : i);

              setTimeout(() => {
                triggerToast(`🤝 ${targetInvite.name} accepted ${targetInvite.invitedBy}'s invitation and contributed $${targetInvite.stake.toFixed(2)}!`, "success");
              }, 100);

              return {
                ...c,
                contributors: updatedContributors,
                currentTotalStake: nextStake,
                status: nextStatus,
                invites: updatedInvites
              };
            }
            return c;
          }));

          // Synchronize local modal item state
          setTimeout(() => {
            setCollabChallenges(currentList => {
              const reloaded = currentList.find(item => item.id === selectedCollabForModal.id);
              if (reloaded) {
                setSelectedCollabForModal(reloaded);
              }
              return currentList;
            });
          }, 150);
        };

        // Handler to simulate invitation declination
        const handleDeclineInvitation = (inviteId: string) => {
          setCollabChallenges(prev => prev.map(c => {
            if (c.id === selectedCollabForModal.id) {
              const invites = c.invites || [];
              const updatedInvites = invites.map(i => i.id === inviteId ? { ...i, status: "declined" as const } : i);
              return { ...c, invites: updatedInvites };
            }
            return c;
          }));

          setTimeout(() => {
            setSelectedCollabForModal((prev: any) => ({
              ...prev,
              invites: (prev.invites || []).map((i: any) => i.id === inviteId ? { ...i, status: "declined" } : i)
            }));
            triggerToast("Invitation declined.", "info");
          }, 100);
        };

        // ALGORITHMIC WINNINGS DISBURSEMENT
        const handleDisburseCollabWinnings = () => {
          // Calculate proportional disbursement for all contributors
          const report = selectedCollabForModal.contributors.map((contrib: any) => {
            const sharePct = contrib.stake / selectedCollabForModal.currentTotalStake;
            const payoutAmount = sharePct * totalWinningsPool;
            return {
              name: contrib.name,
              payout: payoutAmount,
              sharePercent: sharePct * 100
            };
          });

          // Check if Collins Dnego (You) was a contributor to award real wallet balance
          const userContribution = selectedCollabForModal.contributors.find(
            (contrib: any) => contrib.name.includes("Collins Dnego") || contrib.name.includes("You")
          );

          if (userContribution) {
            const userSharePct = userContribution.stake / selectedCollabForModal.currentTotalStake;
            const userPayout = userSharePct * totalWinningsPool;

            setWalletBalance(prev => prev + userPayout);
            
            // Log a transaction
            const txId = `tx-collab-payout-${Date.now()}`;
            setTransactions(prevTx => [
              {
                id: txId,
                type: "win" as const,
                amount: userPayout,
                time: "Just now",
                target: `🏆 Proportional Winnings Disbursed: ${selectedCollabForModal.matchName}`
              },
              ...prevTx
            ]);
          }

          // Update challenge status to resolved
          setCollabChallenges(prev => prev.map(c => {
            if (c.id === selectedCollabForModal.id) {
              return {
                ...c,
                status: "resolved" as const,
                winningsDisbursed: true,
                disbursementReport: report
              };
            }
            return c;
          }));

          // Synchronize local modal item state
          setTimeout(() => {
            setSelectedCollabForModal((prev: any) => ({
              ...prev,
              status: "resolved" as const,
              winningsDisbursed: true,
              disbursementReport: report
            }));
            triggerToast(`🏆 Algorithmic winnings of $${totalWinningsPool.toFixed(2)} disbursed proportionally to all backers!`, "success");
          }, 150);
        };

        return (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2200] flex justify-center items-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#242526] rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 font-sans border border-gray-200 dark:border-zinc-800 shadow-2xl">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                    <span>🤝</span> Collaborative Active Challengers
                  </h3>
                  <p className="text-[10px] text-blue-100 font-mono">
                    Escrow Pool ID: {selectedCollabForModal.id}
                  </p>
                </div>
                <button 
                  onClick={() => { setCollabModalOpen(false); setSelectedCollabForModal(null); }} 
                  className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-left">
                
                {/* Event details card */}
                <div className="p-3.5 bg-gray-50 dark:bg-zinc-800/30 rounded-xl border border-gray-150 dark:border-zinc-800">
                  <span className="block text-[8.5px] uppercase font-mono tracking-widest font-extrabold text-blue-600 dark:text-blue-400 mb-1">
                    Target Event Prediction & Odds
                  </span>
                  <div className="font-black text-gray-900 dark:text-white text-sm">
                    🏟️ {selectedCollabForModal.matchName}
                  </div>
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mt-1">
                    Prediction Option: <span className="text-emerald-500 font-bold">{selectedCollabForModal.prediction}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 italic font-mono flex items-center justify-between">
                    <span>Target Total Pool: ${selectedCollabForModal.targetTotalStake.toFixed(2)}</span>
                    {selectedCollabForModal.numOpponents === 1 && (
                      <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold text-[8.5px] uppercase px-1.5 py-0.5 rounded">
                        Mode: {selectedCollabForModal.targetMode === "op" ? "Open Prop (OP)" : "Proposed Market"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Members/Collaborators contributions */}
                <div className="bg-gray-50/50 dark:bg-zinc-900/20 p-3 rounded-xl border border-gray-200 dark:border-zinc-800 space-y-2">
                  <h4 className="text-[10px] uppercase font-mono font-extrabold tracking-wider text-gray-400 flex justify-between items-center">
                    <span>👥 Backer Stakes & Expected Returns</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                      Funded: ${selectedCollabForModal.currentTotalStake.toFixed(2)} / ${selectedCollabForModal.targetTotalStake.toFixed(2)}
                    </span>
                  </h4>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {selectedCollabForModal.contributors.map((contrib: any, idx: number) => {
                      const groupTarget = selectedCollabForModal.targetStakeCreator || selectedCollabForModal.currentTotalStake || 1;
                      const sharePct = contrib.stake / groupTarget;
                      const expectedReturn = sharePct * totalWinningsPool;
                      return (
                        <div key={idx} className="p-2 bg-blue-50/40 dark:bg-blue-900/5 rounded-lg text-xs space-y-1">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-gray-800 dark:text-gray-200">{contrib.name}</span>
                            <span className="text-blue-600 dark:text-blue-400 font-mono">${contrib.stake.toFixed(2)} ({(sharePct * 100).toFixed(0)}%)</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold font-mono bg-white dark:bg-[#1c1d1e] p-1 rounded border border-gray-100 dark:border-zinc-800">
                            <span>Expected Return on Win:</span>
                            <span className="text-emerald-500 font-bold">${expectedReturn.toFixed(2)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* INVITE ACTIVE COLLABORATORS SECTION */}
                {selectedCollabForModal.status === "collecting" && (
                  <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-500/30 text-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                      <span className="text-[10px] uppercase font-mono tracking-wider font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <span>✉️</span> Invite Active Collaborators
                      </span>
                      <span className="text-[9px] text-emerald-700 dark:text-emerald-300 font-mono font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Ready to Merge
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                        Send invites to other active collaboration pools betting on <strong className="text-emerald-600 dark:text-emerald-400">{selectedCollabForModal.prediction}</strong> who are looking to merge forces and meet their group targets!
                      </div>
                      
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {(() => {
                          const readyCollaborators = collabChallenges.filter(c => 
                            c.id !== selectedCollabForModal.id &&
                            c.matchName === selectedCollabForModal.matchName &&
                            c.prediction === selectedCollabForModal.prediction &&
                            c.odds === selectedCollabForModal.odds &&
                            c.readyToMerge &&
                            c.currentTotalStake < c.targetTotalStake &&
                            c.status === "collecting"
                          );

                          if (readyCollaborators.length === 0) {
                            return (
                              <div className="text-center p-3 text-[10px] text-gray-400 italic bg-white/40 dark:bg-zinc-900/30 rounded-xl border border-emerald-500/10">
                                No active collaborators matching your prediction are ready to merge right now. Check back later!
                              </div>
                            );
                          }

                          return readyCollaborators.map(oppCollab => (
                            <div key={oppCollab.id} className="p-2.5 bg-white dark:bg-[#18191a] border border-emerald-200 dark:border-emerald-900/30 rounded-xl flex justify-between items-center text-xs shadow-xs">
                              <div>
                                <span className="font-extrabold text-gray-800 dark:text-gray-200 block truncate max-w-[150px]">
                                  {oppCollab.creator}
                                </span>
                                <span className="text-[9px] text-emerald-600 dark:text-emerald-500 font-mono font-bold">
                                  Funded: ${oppCollab.currentTotalStake}/${oppCollab.targetTotalStake}
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  handleCombineSameSidePools(selectedCollabForModal.id, oppCollab.id);
                                  triggerToast(`Merged pools with ${oppCollab.creator}!`, "success");
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9.5px] font-black px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm "
                              >
                                <span>🤝</span> Merge Pool
                              </button>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                  </div>
                )}

                {/* ALGORITHMIC WINNINGS DISBURSEMENT RESULTS REPORT (Historic resolved view) */}
                {selectedCollabForModal.status === "resolved" && selectedCollabForModal.disbursementReport && (
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2.5">
                    <span className="text-[9.5px] uppercase font-mono tracking-widest font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <span>🏆</span> Dynamic Disbursement Ledger
                    </span>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal font-medium">
                      Winnings of <span className="font-bold text-emerald-600">${totalWinningsPool.toFixed(2)}</span> has been successfully disbursed across all backers according to the exact proportion of investment:
                    </p>
                    <div className="space-y-1.5 font-mono text-[10.5px]">
                      {selectedCollabForModal.disbursementReport.map((rep: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center p-1.5 bg-white dark:bg-[#18191a] border border-emerald-500/15 rounded text-xs">
                          <div>
                            <span className="font-extrabold text-gray-800 dark:text-gray-200 block">{rep.name}</span>
                            <span className="text-[8.5px] text-gray-400">Share: {rep.sharePercent.toFixed(0)}%</span>
                          </div>
                          <span className="text-emerald-500 font-extrabold text-right">+${rep.payout.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Opponents Section */}
                {selectedCollabForModal.status !== "resolved" && (
                  <div className="space-y-3.5 border-t border-b border-gray-150 dark:border-zinc-800 py-3.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10.5px] uppercase font-mono font-black tracking-wider text-gray-400">
                        🥊 Peer-to-Peer Opponent Joining Engine
                      </h4>
                      <span className="text-[9.5px] text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded-md">
                        {selectedCollabForModal.numOpponents === 1 ? "1v1 Challenge" : "3-Way Challenge"}
                      </span>
                    </div>

                    {/* List currently joined opponents */}
                    {selectedCollabForModal.opponents.length > 0 && (
                      <div className="space-y-2">
                        <span className="block text-[8px] uppercase font-mono tracking-wider text-gray-400 font-bold">
                          Currently Joined Opponents ({selectedCollabForModal.opponents.length} of {selectedCollabForModal.numOpponents})
                        </span>
                        <div className="space-y-1.5">
                          {selectedCollabForModal.opponents.map((opp: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center p-2.5 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-150 dark:border-indigo-900/30 rounded-xl text-xs">
                              <div>
                                <span className="font-extrabold text-indigo-700 dark:text-indigo-400 block">{opp.name}</span>
                                <span className="text-[9px] text-gray-500 dark:text-gray-400">Backing: <span className="font-bold text-indigo-600 dark:text-indigo-300">{opp.selection}</span></span>
                              </div>
                              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-extrabold bg-white dark:bg-[#18191a] px-2.5 py-1 rounded-lg border border-indigo-200/50 dark:border-indigo-900/20">${opp.stake.toFixed(2)} Matched</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Join Form / Actions if not fully matched */}
                    {selectedCollabForModal.status === "posted" ? (
                      <div className="p-3 bg-gradient-to-br from-indigo-50/30 to-purple-50/30 dark:from-indigo-950/5 dark:to-purple-950/5 border border-indigo-150/40 dark:border-indigo-900/20 rounded-xl space-y-3 text-xs">
                        
                        {/* Mode-specific logic */}
                        {selectedCollabForModal.numOpponents === 1 ? (
                          // 1v1 Mode
                          selectedCollabForModal.targetMode === "op" ? (
                            // OP (Open Proposition) Choice mode
                            <div className="space-y-2.5">
                              <div>
                                <span className="block text-[9.5px] uppercase font-mono tracking-wider text-purple-600 dark:text-purple-400 font-extrabold">
                                  👐 Open Proposition (OP) Choice Select
                                </span>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal mt-0.5">
                                  As an opponent, you have the flexibility to choose which of the remaining two outcomes you want to back:
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                {remainingOutcomes.map((out) => {
                                  const isSelected = interactiveCollabJoinOption === out.symbol;
                                  return (
                                    <button
                                      key={out.symbol}
                                      type="button"
                                      onClick={() => setInteractiveCollabJoinOption(out.symbol)}
                                      className={`p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col justify-center items-center ${
                                        isSelected 
                                          ? "bg-purple-600 text-white border-purple-700 shadow-md scale-[1.02]" 
                                          : "bg-white dark:bg-[#18191a] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-zinc-800 hover:border-purple-300"
                                      }`}
                                    >
                                      <span className="text-[10px] font-bold truncate max-w-full">{out.label}</span>
                                      <span className={`text-[11px] font-black font-mono mt-0.5 ${isSelected ? "text-white" : "text-purple-600 dark:text-purple-400"}`}>
                                        @{out.odd.toFixed(2)}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            // Proposed Market mode (Show proposed opposite market)
                            (() => {
                              const designatedOpp = selectedCollabForModal.opponentsTargets?.[0];
                              const label = designatedOpp ? designatedOpp.label : remainingOutcomes[0]?.label;
                              const odd = designatedOpp ? designatedOpp.odds : remainingOutcomes[0]?.odd;
                              return (
                                <div className="space-y-2 animate-in fade-in duration-150">
                                  <div>
                                    <span className="block text-[9.5px] uppercase font-mono tracking-wider text-blue-600 dark:text-blue-400 font-extrabold">
                                      📌 Pre-Designated Proposed Market
                                    </span>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal mt-0.5">
                                      This pool has been launched with a designated opposing proposed market selection:
                                    </p>
                                  </div>

                                  <div className="p-2.5 bg-blue-50/40 dark:bg-blue-950/10 border border-blue-200/50 dark:border-blue-900/20 rounded-xl flex items-center justify-between">
                                    <div>
                                      <span className="text-[9px] text-gray-400 block font-mono font-bold">Opponent's Backing Outcome:</span>
                                      <span className="text-[11px] font-extrabold text-blue-700 dark:text-blue-300">
                                        {label}
                                      </span>
                                    </div>
                                    <span className="text-xs font-black font-mono text-blue-600 dark:text-blue-400 bg-white dark:bg-[#18191a] px-2 py-1 rounded-md border border-blue-100">
                                      @{odd?.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })()
                          )
                        ) : (
                          // 3-Way Mode (2 Opponents)
                          selectedCollabForModal.opponents.length === 0 ? (
                            // 1st joiner gets to choose
                            <div className="space-y-2.5">
                              <div>
                                <span className="block text-[9.5px] uppercase font-mono tracking-wider text-amber-600 dark:text-amber-400 font-extrabold">
                                  🎯 3-Way Choice (First Opponent Select)
                                </span>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal mt-0.5">
                                  Choose which decimal odd fits you best. The remaining unchosen option will then be automatically reposted as a pre-determined proposed market:
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                {remainingOutcomes.map((out) => {
                                  const isSelected = interactiveCollabJoinOption === out.symbol;
                                  return (
                                    <button
                                      key={out.symbol}
                                      type="button"
                                      onClick={() => setInteractiveCollabJoinOption(out.symbol)}
                                      className={`p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col justify-center items-center ${
                                        isSelected 
                                          ? "bg-amber-500 text-white border-amber-600 shadow-md scale-[1.02]" 
                                          : "bg-white dark:bg-[#18191a] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-zinc-800 hover:border-amber-300"
                                      }`}
                                    >
                                      <span className="text-[10px] font-bold truncate max-w-full">{out.label}</span>
                                      <span className={`text-[11px] font-black font-mono mt-0.5 ${isSelected ? "text-white" : "text-amber-600 dark:text-amber-400"}`}>
                                        @{out.odd.toFixed(2)}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            // 2nd joiner gets the unchosen remaining
                            <div className="space-y-2">
                              <div>
                                <span className="block text-[9.5px] uppercase font-mono tracking-wider text-emerald-600 dark:text-emerald-400 font-extrabold">
                                  🌎 Reposted Proposed Market (Last Remaining Outcome)
                                </span>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal mt-0.5">
                                  This challenge was reposted as a proposed market with the final remaining outcome unbacked:
                                </p>
                              </div>

                              {(() => {
                                const forceSymbol = selectedCollabForModal.remainingProposedMarket || "2";
                                const forceOutcome = allOutcomes.find(o => o.symbol === forceSymbol) || remainingOutcomes[1] || remainingOutcomes[0];
                                return (
                                  <div className="p-2.5 bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-200/50 dark:border-emerald-900/20 rounded-xl flex items-center justify-between animate-pulse">
                                    <div>
                                      <span className="text-[9px] text-gray-400 block font-mono font-bold">Unbacked Outcome Offered:</span>
                                      <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300">
                                        {forceOutcome?.label}
                                      </span>
                                    </div>
                                    <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400 bg-white dark:bg-[#18191a] px-2 py-1 rounded-md border border-emerald-100 font-bold">
                                      @{forceOutcome?.odd.toFixed(2)}
                                    </span>
                                  </div>
                                );
                              })()}
                            </div>
                          )
                        )}

                        {/* Joiner Name and Action Controls */}
                        <div className="space-y-3 pt-2 border-t border-gray-150 dark:border-zinc-800">
                          <div>
                            <label className="block text-[8px] text-gray-400 font-bold uppercase mb-0.5 font-mono">Opponent Challenger Name</label>
                            <div className="flex gap-1">
                              <input
                                type="text"
                                placeholder="Enter challenger name (e.g. Alex Smith, or leave empty for AI)"
                                value={interactiveJoinerName}
                                onChange={(e) => setInteractiveJoinerName(e.target.value)}
                                className="w-full bg-white dark:bg-[#18191a] border border-gray-250 dark:border-zinc-800 rounded-lg p-1.5 text-xs outline-none text-gray-900 dark:text-white"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const randomNames = ["Alex Smith", "Linet K.", "Marcus_88", "Chelsea Backer", "Dortmund Fan", "Arsenal Gunner"];
                                  setInteractiveJoinerName(randomNames[Math.floor(Math.random() * randomNames.length)]);
                                }}
                                className="px-2 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded-lg border border-gray-300/30 text-[10px] font-bold"
                              >
                                🤖 Bot
                              </button>
                            </div>
                          </div>

                          {/* Custom contribution amount and status indicator */}
                          {(() => {
                            let finalSymbol = "";
                            if (selectedCollabForModal.numOpponents === 1) {
                              if (selectedCollabForModal.targetMode === "op") {
                                finalSymbol = interactiveCollabJoinOption;
                              } else {
                                finalSymbol = selectedCollabForModal.opponentsTargets?.[0]?.symbol || remainingOutcomes[0]?.symbol || "2";
                              }
                            } else {
                              if (selectedCollabForModal.opponents.length === 0) {
                                finalSymbol = interactiveCollabJoinOption;
                              } else {
                                finalSymbol = selectedCollabForModal.remainingProposedMarket || "2";
                              }
                            }

                            if (!finalSymbol) return null;

                            // Resolve target for this symbol
                            let oppTargets = selectedCollabForModal.opponentsTargets;
                            if (!oppTargets || oppTargets.length === 0) {
                              const calculated = getCollabTargets(
                                selectedCollabForModal.formulationMode || "total_pool",
                                selectedCollabForModal.match,
                                selectedCollabForModal.selectedOutcome || "1",
                                selectedCollabForModal.numOpponents,
                                finalSymbol,
                                selectedCollabForModal.targetTotalStake
                              );
                              oppTargets = calculated.opponents;
                            }

                            const matchingTargetObj = oppTargets.find((t: any) => t.symbol === finalSymbol);
                            const targetAmount = matchingTargetObj ? matchingTargetObj.targetStake : (selectedCollabForModal.targetTotalStake / selectedCollabForModal.numOpponents);
                            const currentFundedOnSymbol = selectedCollabForModal.opponents
                              .filter((o: any) => o.selectionSymbol === finalSymbol)
                              .reduce((sum: number, o: any) => sum + o.stake, 0);
                            const remainingNeeded = Math.max(0, targetAmount - currentFundedOnSymbol);

                            return (
                              <div className="bg-gray-100/50 dark:bg-[#1a1b1c] p-2.5 rounded-xl space-y-2 border border-gray-200/50 dark:border-zinc-800">
                                <div className="flex justify-between items-center text-[10.5px]">
                                  <span className="text-gray-500 font-medium">Selected Backing Target:</span>
                                  <span className="font-extrabold text-gray-800 dark:text-white font-mono">
                                    ${targetAmount.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-[10.5px]">
                                  <span className="text-gray-500 font-medium">Already Funded on this side:</span>
                                  <span className="font-bold text-gray-800 dark:text-white font-mono">
                                    ${currentFundedOnSymbol.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-[10.5px] border-b border-dashed border-gray-200 dark:border-zinc-800 pb-1.5">
                                  <span className="text-blue-600 dark:text-blue-400 font-black">Remaining Stake Needed:</span>
                                  <span className="font-black text-blue-600 dark:text-blue-400 font-mono">
                                    ${remainingNeeded.toFixed(2)}
                                  </span>
                                </div>

                                <div>
                                  <label className="block text-[8px] text-gray-400 font-bold uppercase mb-1 font-mono">
                                    Your Contribution Amount ($)
                                  </label>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="number"
                                      min="1"
                                      max={Math.ceil(remainingNeeded)}
                                      placeholder={`Up to $${remainingNeeded.toFixed(2)}`}
                                      value={collabOpponentStakeInput !== undefined ? collabOpponentStakeInput : ""}
                                      onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        setCollabOpponentStakeInput(isNaN(val) ? undefined : Math.max(1, Math.min(val, remainingNeeded)));
                                      }}
                                      className="w-full bg-white dark:bg-[#18191a] border border-gray-200 dark:border-zinc-800 rounded-lg p-1.5 font-bold font-mono text-center text-xs text-gray-900 dark:text-white outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setCollabOpponentStakeInput(remainingNeeded)}
                                      className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg cursor-pointer"
                                    >
                                      MAX
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Action trigger button */}
                          <button
                            type="button"
                            onClick={() => {
                              let finalSymbol = "";
                              if (selectedCollabForModal.numOpponents === 1) {
                                if (selectedCollabForModal.targetMode === "op") {
                                  if (!interactiveCollabJoinOption) {
                                    alert("Please select which decimal odd you wish to back first!");
                                    return;
                                  }
                                  finalSymbol = interactiveCollabJoinOption;
                                } else {
                                  finalSymbol = selectedCollabForModal.opponentsTargets?.[0]?.symbol || remainingOutcomes[0]?.symbol || "2";
                                }
                              } else {
                                // 3-way Mode
                                if (selectedCollabForModal.opponents.length === 0) {
                                  if (!interactiveCollabJoinOption) {
                                    alert("Please select which decimal odd you wish to back first!");
                                    return;
                                  }
                                  finalSymbol = interactiveCollabJoinOption;
                                } else {
                                  finalSymbol = selectedCollabForModal.remainingProposedMarket || "2";
                                }
                              }

                              handlePerformInteractiveCollabJoin(
                                selectedCollabForModal.id,
                                finalSymbol,
                                interactiveJoinerName || undefined,
                                "individual",
                                collabOpponentStakeInput
                              );
                            }}
                            className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-black rounded-lg transition-all text-center cursor-pointer shadow-sm flex items-center justify-center gap-1"
                          >
                            <span>⚡</span> Confirm Peer-to-Peer Escrow Lock
                          </button>
                        </div>

                      </div>
                    ) : selectedCollabForModal.status === "matched" ? (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-center font-bold text-xs flex flex-col items-center justify-center gap-1.5">
                        <div className="flex items-center gap-1">
                          <span>🔐</span> All Opponents Matched & Escrow Fully Locked
                        </div>
                        <p className="text-[9px] text-gray-400 leading-normal font-medium mt-1">
                          The event is actively live. Click the button below to simulate prediction success and trigger the dynamic disbursement algorithm!
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* REAL-TIME COMPATIBLE COLLABORATION MERGE SECTION */}
                {selectedCollabForModal.status === "posted" && (
                  <div className="p-3.5 bg-gray-50/50 dark:bg-zinc-800/10 rounded-xl border border-gray-150 dark:border-zinc-800/40 space-y-2.5">
                    <h4 className="text-[10px] uppercase font-mono font-extrabold tracking-wider text-gray-450 flex items-center gap-1">
                      <span>🔗</span> Match opposing collaboration pool
                    </h4>
                    
                    {collabChallenges.filter(c => 
                      c.id !== selectedCollabForModal.id && 
                      c.matchName === selectedCollabForModal.matchName && 
                      c.prediction !== selectedCollabForModal.prediction && 
                      c.status === "collecting"
                    ).length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-[10px] text-gray-500 leading-normal">
                          We found another active collaboration group betting against your prediction on the same game. Click to match both pools!
                        </p>
                        {collabChallenges.filter(c => 
                          c.id !== selectedCollabForModal.id && 
                          c.matchName === selectedCollabForModal.matchName && 
                          c.prediction !== selectedCollabForModal.prediction && 
                          c.status === "collecting"
                        ).map(oppCollab => (
                          <div key={oppCollab.id} className="p-2 bg-white dark:bg-[#18191a] border border-gray-200 dark:border-zinc-800 rounded-lg flex justify-between items-center text-xs">
                            <div>
                              <span className="font-extrabold text-gray-800 dark:text-gray-200 block truncate max-w-[150px]">
                                {oppCollab.prediction}
                              </span>
                              <span className="text-[9px] text-gray-400 font-mono">
                                Funded: ${oppCollab.currentTotalStake}/${oppCollab.targetTotalStake}
                              </span>
                            </div>
                            <button
                              onClick={() => handleMergeCollabPools(selectedCollabForModal.id, oppCollab.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-2.5 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1"
                            >
                              <span>🤝</span> Merge Pools
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-gray-400 italic leading-normal">
                        No other active collaboration pools found on this game right now. You can create a second pool in the Sports hub backing an opposing decimal odd, then merge them here!
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-3 border-t border-gray-150 dark:border-zinc-800 flex flex-col gap-2">
                  {selectedCollabForModal.status === "matched" && (
                    <button
                      type="button"
                      onClick={handleDisburseCollabWinnings}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-black rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-md"
                    >
                      🏆 Simulate Successful Resolution & Disburse Winnings
                    </button>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setCollabModalOpen(false); setSelectedCollabForModal(null); }}
                      className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-lg transition-all cursor-pointer text-center"
                    >
                      Close Window
                    </button>
                    {selectedCollabForModal.opponents.length > 0 && selectedCollabForModal.status !== "matched" && selectedCollabForModal.status !== "resolved" && (
                      <button
                        type="button"
                        onClick={() => {
                          setCollabChallenges(prev => prev.map(c => c.id === selectedCollabForModal.id ? { ...c, status: "matched" as const } : c));
                          setSelectedCollabForModal((prev: any) => ({ ...prev, status: "matched" }));
                          triggerToast("🎉 Collaborative Escrow successfully locked & matched! Let the game resolve.", "success");
                        }}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer text-center"
                      >
                        🔐 Lock & Match Escrow
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {/* TAG FRIENDS MODAL */}
      {tagModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2200] flex justify-center items-center p-4">
          <div className="bg-white dark:bg-[#242526] rounded-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 font-sans">
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-extrabold text-gray-900 dark:text-white">Tag Friends</h3>
              <button onClick={() => setTagModalOpen(false)} className="bg-gray-100 dark:bg-zinc-800 p-1.5 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2">
              <input 
                type="text" 
                placeholder="Search friends..." 
                className="w-full bg-gray-100 dark:bg-[#3a3b3c] border-none rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white outline-none mb-2"
              />
              <div className="max-h-64 overflow-y-auto w-full px-1 space-y-1">
                {[
                  "Alex Morgan", "Sarah Chen", "Erick Chelody", "Abuu Kiprotich", "Collins Dnego"
                ].map(friend => {
                  const isTagged = composerTaggedFriends.includes(friend);
                  return (
                    <button 
                      key={friend}
                      onClick={() => {
                        if (isTagged) {
                          setComposerTaggedFriends(prev => prev.filter(f => f !== friend));
                        } else {
                          setComposerTaggedFriends(prev => [...prev, friend]);
                        }
                      }}
                      className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <span className={`text-sm font-bold ${isTagged ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>{friend}</span>
                      {isTagged && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-[#18191a]">
              <button 
                onClick={() => setTagModalOpen(false)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {showCollabConfirmModal && pendingCollabConfig && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-[2200] flex justify-center items-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-[#1e1f21] rounded-2xl shadow-2xl border-2 border-emerald-500/30 dark:border-zinc-800 relative overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-gray-150 dark:border-zinc-800 bg-emerald-500/10 dark:bg-emerald-500/5 flex justify-between items-center select-none font-sans">
              <div className="flex items-center gap-2">
                <span className="text-base">🤝</span>
                <div className="text-left">
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-950 dark:text-white">Confirm Collaboration</h3>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 block">Review transaction details</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowCollabConfirmModal(false);
                  setPendingCollabConfig(null);
                }}
                className="p-1 px-1.5 hover:bg-gray-200 dark:hover:bg-zinc-850 rounded-md transition-colors text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 font-sans max-h-[70vh] overflow-y-auto">
              <div className="text-center space-y-1">
                <h4 className="text-[11px] font-extrabold text-gray-900 dark:text-white">Initialize Escrow Pool</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  You are about to launch a new collaborative escrow challenge. Please review your side's stake and the total required target.
                </p>
              </div>

              <div className="space-y-2 bg-gray-50 dark:bg-[#18191a] rounded-xl p-3 border border-gray-200 dark:border-zinc-800/80">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-zinc-800/80">
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-mono">Match</span>
                  <span className="text-[11px] font-black text-gray-900 dark:text-white text-right">
                    {pendingCollabConfig.ratioMatch.homeTeam} vs {pendingCollabConfig.ratioMatch.awayTeam}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-zinc-800/80">
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-mono">Prediction</span>
                  <span className="text-[11px] font-black text-blue-600 dark:text-blue-400">
                    {pendingCollabConfig.ratioOddName} (@{pendingCollabConfig.ratioOddValue.toFixed(2)})
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-zinc-800/80">
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-mono">Target Pool Limit</span>
                  <span className="text-[11px] font-black text-gray-900 dark:text-white">
                    ${pendingCollabConfig.targets.targetStakeCreator.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-mono">Your Initial Debit</span>
                  <span className="text-[13px] font-black text-red-500 font-mono">
                    -${pendingCollabConfig.collabCreatorStake.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-3 border border-amber-200 dark:border-amber-900/30">
                <div className="flex items-start gap-2">
                  <span className="text-amber-500 text-sm mt-0.5">⚠️</span>
                  <p className="text-[9.5px] font-semibold text-amber-700 dark:text-amber-500 leading-snug">
                    By confirming, <strong className="font-extrabold text-red-600 dark:text-red-400 font-mono">${pendingCollabConfig.collabCreatorStake.toFixed(2)}</strong> will be permanently debited from your wallet balance to initiate this collaborative challenge and secure your spot.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCollabConfirmModal(false);
                    setPendingCollabConfig(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 font-bold text-[11px] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  No, Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCollaborativeChallenge}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Yes, Initialize
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COLLABORATIVE POOLS TAB CONTRIBUTION & DEBIT CONFIRMATION MODAL */}
      {collabContribAmountModalOpen && selectedCollabForContribInput && (() => {
        const pool = selectedCollabForContribInput;
        const targetStake = pool.targetStakeCreator ?? pool.targetTotalStake;
        const currentStake = pool.currentStakeCreator ?? pool.currentTotalStake;
        const remaining = Math.max(0, targetStake - currentStake);

        return (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-[2300] flex justify-center items-center p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-white dark:bg-[#1e1f21] rounded-2xl shadow-2xl border-2 border-emerald-500/30 dark:border-zinc-800 relative overflow-hidden animate-in zoom-in-95 duration-150">
              
              {/* Header */}
              <div className="p-4 border-b border-gray-150 dark:border-zinc-800 bg-emerald-500/10 dark:bg-emerald-500/5 flex justify-between items-center font-sans">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤝</span>
                  <div className="text-left">
                    <h3 className="text-xs font-black uppercase tracking-wider text-gray-950 dark:text-white">
                      {!showCollabDebitConfirm ? "Enter Contribution Amount" : "Confirm Debit Authorization"}
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 block font-bold">
                      {!showCollabDebitConfirm ? "Specify your stake contribution" : "Confirm withdrawal from main balance"}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setCollabContribAmountModalOpen(false);
                    setSelectedCollabForContribInput(null);
                  }}
                  className="p-1 px-1.5 hover:bg-gray-200 dark:hover:bg-zinc-850 rounded-md transition-colors text-gray-400 hover:text-gray-950 dark:hover:text-white cursor-pointer"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 font-sans max-h-[75vh] overflow-y-auto">
                
                {/* Info Card */}
                <div className="p-3 bg-gray-50 dark:bg-[#18191a] rounded-xl border border-gray-150 dark:border-zinc-850 space-y-1">
                  <span className="text-[9px] font-mono font-bold uppercase text-gray-400">Match Pool</span>
                  <div className="text-xs font-black text-gray-900 dark:text-white">{pool.matchName}</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold">Backed: "{pool.prediction}"</div>
                  <div className="text-[10px] text-gray-500 font-mono font-semibold">
                    Pool Target: ${targetStake.toFixed(2)} | Funded: ${currentStake.toFixed(2)}
                  </div>
                </div>

                {!showCollabDebitConfirm ? (
                  /* Step 1: Input Amount */
                    <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-gray-400">
                        Contribution Amount ($)
                      </label>
                      <input 
                        type="number"
                        min={1}
                        max={remaining}
                        value={collabContribAmount || ""}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setCollabContribAmount(Math.min(val, remaining));
                        }}
                        className="w-full bg-gray-55 dark:bg-[#18191a] border border-gray-250 dark:border-zinc-800 rounded-xl p-3 text-sm font-mono font-black outline-none text-gray-900 dark:text-white focus:border-emerald-500/50"
                        placeholder={`Up to $${remaining.toFixed(2)}`}
                      />
                      <div className="flex justify-between text-[9px] text-gray-400 font-semibold font-mono pt-1">
                        <span>Max Contribution: ${remaining.toFixed(2)}</span>
                        <span>Wallet Balance: <strong className="text-gray-700 dark:text-gray-300">${walletBalance.toFixed(2)}</strong></span>
                      </div>
                    </div>

                    {/* Presets */}
                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                      {[5, 10, 20, remaining].map((amt, aidx) => (
                        <button
                          key={aidx}
                          type="button"
                          onClick={() => setCollabContribAmount(Math.min(amt, remaining))}
                          className="py-1 px-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg text-[10px] font-bold font-mono transition-colors text-gray-700 dark:text-gray-300 cursor-pointer text-center"
                        >
                          {amt === remaining ? "Max" : `$${amt}`}
                        </button>
                      ))}
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (collabContribAmount <= 0) {
                          alert("Please enter a valid contribution amount greater than $0.");
                          return;
                        }
                        if (collabContribAmount > remaining) {
                          alert(`The remaining target creator stake is only $${remaining.toFixed(2)}.`);
                          return;
                        }
                        if (walletBalance < collabContribAmount) {
                          alert(`Insufficient wallet balance. You need $${collabContribAmount.toFixed(2)} but only have $${walletBalance.toFixed(2)}.`);
                          return;
                        }
                        setShowCollabDebitConfirm(true);
                      }}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-550 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer mt-2"
                    >
                      Continue to Confirmation →
                    </button>
                  </div>
                ) : (
                  /* Step 2: Debit Confirmation */
                  <div className="space-y-4">
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 text-[11px] text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                      ⚠️ <strong>Debit Authorization:</strong> This transaction will authorize a debit of <strong className="font-mono text-gray-950 dark:text-white">${collabContribAmount.toFixed(2)}</strong> from your main account balance. Please confirm below.
                    </div>

                    <div className="bg-gray-50 dark:bg-[#18191a] p-3 rounded-xl border border-gray-200 dark:border-zinc-800 font-mono text-[10.5px] space-y-1.5">
                      <div className="flex justify-between text-gray-500 font-semibold">
                        <span>Current Wallet Balance:</span>
                        <span>${walletBalance.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-red-500 font-bold">
                        <span>Contribution Debit:</span>
                        <span>-${collabContribAmount.toFixed(2)}</span>
                      </div>
                      <div className="h-px bg-gray-200 dark:border-zinc-800 my-1"></div>
                      <div className="flex justify-between text-emerald-500 font-black">
                        <span>Estimated Post-Debit Balance:</span>
                        <span>${(walletBalance - collabContribAmount).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowCollabDebitConfirm(false)}
                        className="flex-1 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 font-bold text-[11px] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleContributeToCollab(pool.id, collabContribAmount, "Collins Dnego (You)");
                          setCollabContribAmountModalOpen(false);
                          setSelectedCollabForContribInput(null);
                          triggerToast(`🤝 Contributed $${collabContribAmount.toFixed(2)} to ${pool.matchName} pool!`, "success");
                        }}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] shadow-md transition-colors cursor-pointer"
                      >
                        Yes, Debit & Back
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        );
      })()}

      {/* P2P INVITE SETTLEMENT PROCESSOR MODAL */}
      {collabAddFundsModalOpen && selectedCollabForAddFunds && (() => {
        const collab = collabChallenges.find(c => c.id === selectedCollabForAddFunds.collabId);
        if (!collab) return null;

        const addAmount = selectedCollabForAddFunds.amount;
        const currentUserContrib = collab.contributors.find(c => c.name === "Collins Dnego (You)")?.stake || 0;
        
        const targetCreator = collab.targetStakeCreator ?? collab.targetTotalStake;
        const currentCreator = collab.currentStakeCreator ?? collab.currentTotalStake;
        const remaining = Math.max(0, targetCreator - currentCreator);
        const actualAmount = Math.min(addAmount, remaining);

        const groupTarget = collab.targetStakeCreator || collab.targetTotalStake || 1;
        const expectedTotalPool = collab.targetTotalStake;
        
        const currentReturns = (currentUserContrib / groupTarget) * expectedTotalPool;
        const newContrib = currentUserContrib + actualAmount;
        const newReturns = (newContrib / groupTarget) * expectedTotalPool;

        return (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-[2200] flex justify-center items-center p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-white dark:bg-[#1e1f21] rounded-2xl shadow-2xl border-2 border-emerald-500/30 dark:border-zinc-800 relative overflow-hidden animate-in zoom-in-95 duration-150">
              <div className="p-4 border-b border-gray-150 dark:border-zinc-800 bg-emerald-500/10 dark:bg-emerald-500/5 flex justify-between items-center select-none font-sans">
                <div className="flex items-center gap-2">
                  <span className="text-base">💸</span>
                  <div className="text-left">
                    <h3 className="text-xs font-black uppercase tracking-wider text-gray-950 dark:text-white">Add Funds to Investment</h3>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 block">Top up your existing collaboration</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setCollabAddFundsModalOpen(false);
                    setSelectedCollabForAddFunds(null);
                  }}
                  className="p-1 px-1.5 hover:bg-gray-200 dark:hover:bg-zinc-850 rounded-md transition-colors text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 font-sans max-h-[70vh] overflow-y-auto">
                <div className="space-y-2 bg-gray-50 dark:bg-[#18191a] rounded-xl p-3 border border-gray-200 dark:border-zinc-800/80">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-zinc-800/80">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-mono">Current Stake</span>
                    <span className="text-[11px] font-black text-gray-900 dark:text-white">
                      ${currentUserContrib.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-zinc-800/80">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-mono">Current Returns</span>
                    <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                      ${currentReturns.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-zinc-800/80">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-mono">Added Funds</span>
                    <span className="text-[11px] font-black text-blue-600 dark:text-blue-400">
                      +${actualAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-mono">New Total Returns</span>
                    <span className="text-[13px] font-black text-emerald-500 font-mono">
                      ${newReturns.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-3 border border-emerald-200 dark:border-emerald-900/30">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-sm mt-0.5">💸</span>
                    <p className="text-[9.5px] font-semibold text-emerald-700 dark:text-emerald-500 leading-snug">
                      Do you want to add <strong className="font-extrabold text-gray-900 dark:text-white">${actualAmount.toFixed(2)}</strong> as an investment to your initiated collaboration?
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCollabAddFundsModalOpen(false);
                      setSelectedCollabForAddFunds(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 font-bold text-[11px] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    No, Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleContributeToCollab(selectedCollabForAddFunds.collabId, actualAmount, "Collins Dnego (You)");
                      setCollabAddFundsModalOpen(false);
                      setSelectedCollabForAddFunds(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Yes, Add Funds
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* P2P INVITE SETTLEMENT PROCESSOR MODAL */}
      {isInviteModalOpen && selectedInviteForModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-[2200] flex justify-center items-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-[#1e1f21] rounded-2xl shadow-2xl border-2 border-amber-500/30 dark:border-zinc-800 relative overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 border-b border-gray-150 dark:border-zinc-800 bg-amber-500/10 dark:bg-amber-500/5 flex justify-between items-center select-none font-sans">
              <div className="flex items-center gap-2">
                <span className="text-base">🤝</span>
                <div className="text-left">
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-950 dark:text-white animate-pulse">LookUpto Peer Escrow</h3>
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 block">Invite Settlement Portal</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsInviteModalOpen(false);
                  setSelectedInviteForModal(null);
                }}
                className="p-1 px-1.5 hover:bg-gray-200 dark:hover:bg-zinc-850 rounded-md transition-colors text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 space-y-4 max-h-[82vh] overflow-y-auto font-sans scrollbar-thin">
              {/* Proposer Info */}
              <div className="flex items-center gap-3 bg-gray-50/70 dark:bg-[#18191a]/45 p-3 rounded-xl border border-gray-150 dark:border-zinc-850">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-500">
                  <img src={selectedInviteForModal.challengerAvatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] uppercase font-mono text-gray-450">Challenger Proposer</span>
                  <span className="text-sm font-black text-gray-950 dark:text-white">@{selectedInviteForModal.challengerName}</span>
                </div>
              </div>

              {/* Matchup & Classification */}
              <div className="space-y-1 my-1 text-left">
                <span className="text-[9.5px] font-mono uppercase text-gray-400 dark:text-gray-500 block">Fixture / Classification</span>
                <div className="p-3 bg-gray-55/40 dark:bg-black/10 rounded-lg border border-gray-150 dark:border-zinc-800 space-y-1">
                  <div className="text-xs font-bold text-indigo-600 dark:text-blue-400">Fixture: {selectedInviteForModal.matchName}</div>
                  
                  {/* Classification Tag */}
                  <div className="flex items-center gap-1.5 mt-1 select-none">
                    <span className={`text-[8.5px] font-mono font-black uppercase px-2 py-0.5 rounded tracking-wide border ${
                      selectedInviteForModal.liabilityAmount < 100
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-405"
                        : "bg-amber-500/10 border-amber-500/25 text-amber-700 dark:text-amber-400 animate-pulse"
                    }`}>
                      {selectedInviteForModal.liabilityAmount < 100 ? "Casual Match Escrow ($10 - $99)" : "🔥 High Roller Challenge Escrow ($100+)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Selections Compare card */}
              <div className="grid grid-cols-2 gap-3 text-left text-xs">
                <div className="p-3 bg-gray-55/65 dark:bg-[#18191a]/30 rounded-xl border border-gray-150 dark:border-zinc-850">
                  <span className="block text-[8px] text-gray-450 font-mono uppercase mb-1">@{selectedInviteForModal.challengerName} Backs:</span>
                  <span className="font-extrabold text-gray-950 dark:text-white block">"{selectedInviteForModal.proposerPrediction}"</span>
                  <span className="text-[10px] font-mono text-blue-500 dark:text-blue-450 block mt-1.5">Odds Locked: @{selectedInviteForModal.odds[selectedInviteForModal.backedOption].toFixed(2)}</span>
                </div>

                <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/15">
                  <span className="block text-[8px] text-amber-600 dark:text-amber-450 font-mono uppercase mb-1">🔒 Requires You Back:</span>
                  <span className="font-extrabold text-amber-655 dark:text-amber-400 block">"{selectedInviteForModal.proposedOppMarket}"</span>
                  <span className="text-[10px] font-mono text-gray-500 block mt-1.5">Counter Odds matched</span>
                </div>
              </div>

              {/* Escrow Pool Math Ledger */}
              <div className="p-3.5 bg-gray-50/50 dark:bg-[#18191a]/30 rounded-xl border border-gray-150 dark:border-zinc-800 space-y-2 text-left select-none animate-in duration-200">
                <h4 className="text-[10.5px] font-black uppercase tracking-wider text-gray-800 dark:text-zinc-350">P2P Escrow Pool Math Ledger</h4>
                <div className="space-y-1.5 text-xs font-mono text-gray-650 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Your Matched Stake (Debit Value):</span>
                    <span className="font-bold text-gray-950 dark:text-white">${selectedInviteForModal.liabilityAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Challenger Stake:</span>
                    <span className="font-bold text-gray-950 dark:text-white">${(selectedInviteForModal.totalPool - selectedInviteForModal.liabilityAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Match Escrow Pool:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">${selectedInviteForModal.totalPool.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-gray-150 dark:border-zinc-800/80">
                    <span>Org. Escrow Tax (2.0% full pool hold):</span>
                    <span className="font-bold text-amber-600 dark:text-amber-450">${(selectedInviteForModal.totalPool * 0.02).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-dotted border-gray-200 dark:border-zinc-700 text-sm font-black text-gray-950 dark:text-white leading-none">
                    <span>Total Wallet Authorization:</span>
                    <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                      ${(selectedInviteForModal.liabilityAmount + (selectedInviteForModal.totalPool * 0.02)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-150 dark:border-zinc-800/60 flex justify-between items-center text-[10px]">
                  <span className="text-gray-400 font-mono">Your Current Virtual Credits:</span>
                  <span className={`font-mono font-black ${walletBalance >= (selectedInviteForModal.liabilityAmount + (selectedInviteForModal.totalPool * 0.02)) ? "text-emerald-500" : "text-red-500"}`}>
                    ${walletBalance.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Operational Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleDeclineInvite(selectedInviteForModal)}
                  className="flex-1 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-650 dark:text-red-400 font-extrabold text-xs uppercase tracking-wide rounded-xl border border-red-600/20 hover:text-red-700 transition-colors cursor-pointer active:scale-95"
                >
                  Decline Challenge
                </button>

                <button
                  type="button"
                  onClick={() => handleAcceptInvite(selectedInviteForModal)}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs uppercase tracking-wide rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
                >
                  Lock Escrow & Play
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESIZABLE ACCEPT CHALLENGE WINDOW */}
      {challengeWindowOpen && challengeWindowData && (() => {
        // Find Roller prediction Choice
        const getRollerChoice = () => {
          const pred = (challengeWindowData.prediction || "").toLowerCase();
          if (pred.includes("1") || pred.includes("home") || pred.includes("win")) {
            return "1";
          } else if (pred.includes("x") || pred.includes("draw")) {
            return "X";
          } else {
            return "2";
          }
        };
        const rollerChoice = getRollerChoice();

        const odds1 = 1.85;
        const oddsX = 3.25;
        const odds2 = 4.10;

        const calcAcceptLiability = () => {
          const oppStake = challengeWindowData.oppStake;
          if (challengeMode === "optionalized" || challengeMode === "waiting") {
            const oddsMap = { "1": 1.85, "X": 3.25, "2": 4.10 };
            const rOdds = oddsMap[rollerChoice] || 2.10;
            const aOdds = oddsMap[selectedAcceptorOutcome] || 3.25;
            
            if (challengeMode === "waiting") {
                // In waiting mode, oppStake is the total liability of both opponents.
                // We estimate the split based on the odds.
                const remainingOutcome = ["1", "X", "2"].find(o => o !== rollerChoice && o !== selectedAcceptorOutcome) as "1"|"X"|"2";
                const remOdds = oddsMap[remainingOutcome] || 3.0;
                
                const ipR = 1 / rOdds;
                const ipA = 1 / aOdds;
                const ipRem = 1 / remOdds;
                const totalIp = ipR + ipA + ipRem;
                
                // The total pool is creatorStake + totalOppStake.
                // We know totalOppStake = oppStake.
                // pool = oppStake / (1 - (ipR / totalIp))
                const pool = oppStake / (1 - (ipR / totalIp));
                return pool * (ipA / totalIp);
            } else {
                const sumOdds = rOdds + aOdds;
                const calcRatio = aOdds / sumOdds;
                return oppStake * (1 - calcRatio);
            }
          } else if (challengeWindowData.isProposedMarket === "waiting_forced") {
            return oppStake;
          } else {
            const estimatedSumOfOdds = 3.4;
            const estimatedOdds = 2.10;
            const calcRatio = estimatedOdds / estimatedSumOfOdds;
            return oppStake * (1 - calcRatio);
          }
        };
        const activeDebitValue = calcAcceptLiability();
        
        return (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-[2100] flex justify-center items-center p-4">
            <div 
              style={{ width: `${challengeWindowWidth}px`, height: `${challengeWindowHeight}px` }} 
              className="bg-white dark:bg-[#242526] rounded-2xl shadow-2xl border-2 border-blue-500/30 dark:border-zinc-700/80 flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-150"
            >
              {/* Resize grabber handle in bottom-right floor */}
              <div 
                onMouseDown={startResize}
                className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-[2201] flex items-end justify-end p-0.5"
                title="Drag to resize window"
              >
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="21" y1="21" x2="9" y2="9" strokeLinecap="round" />
                  <line x1="21" y1="15" x2="15" y2="21" strokeLinecap="round" />
                </svg>
              </div>

              {/* Header block with elegant gradient styling */}
              <div className="px-5 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-650 text-white flex justify-between items-center shrink-0 border-b border-white/10 select-none">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🤝</span>
                  <div>
                    <h3 className="font-extrabold text-sm tracking-wide">P2P Escrow - Accept Challenge</h3>
                    <p className="text-[10px] opacity-80 font-mono">Interactive Settlement Workspace</p>
                  </div>
                </div>
                <button 
                  onClick={() => setChallengeWindowOpen(false)}
                  className="p-1 hover:bg-white/15 rounded-full transition-colors cursor-pointer"
                >
                  <span className="text-sm font-bold">✕</span>
                </button>
              </div>

              {/* Body Content - scrollable parameters */}
              <div className="flex-1 overflow-y-auto p-5 text-left space-y-4 font-sans text-gray-800 dark:text-gray-200">
                
                {/* Match header */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800/60 pb-2">
                  <div>
                    <span className="text-[10px] bg-blue-500/10 text-[#1877f2] dark:text-blue-450 px-2 py-0.5 rounded font-mono font-bold uppercase">
                      Game Matchup Details
                    </span>
                    <h2 className="text-base font-black text-gray-900 dark:text-white mt-1 flex items-center gap-2 select-none">
                      🏟️ {challengeWindowData.matchName}
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-black text-gray-450 bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg select-none">
                    TOTAL STAKE: ${challengeWindowData.oppStake.toFixed(2)}
                  </span>
                </div>

                {requestChangeStatus !== "none" ? (
                  /* SIMULATION LOGIC: Interactive Roller Decision */
                  <div className="space-y-4 py-4">
                    {requestChangeStatus === "submitting" && (
                      <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">📡 Requesting Market Change...</h4>
                        <p className="text-[11px] text-gray-400 max-w-sm">
                          Submitting your proposed custom terms <strong className="text-blue-500 font-mono">"{requestedMarketInput}"</strong> to proposer <strong>@{challengeWindowData.oppUser}</strong>.
                        </p>
                        <div className="flex gap-2 pt-3">
                          <button 
                            type="button"
                            onClick={() => setRequestChangeStatus("accepted")}
                            className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white text-[9px] font-bold rounded shadow-xs"
                          >
                            Simulate Accept
                          </button>
                          <button 
                            type="button"
                            onClick={() => setRequestChangeStatus("declined")}
                            className="px-2.5 py-1 bg-red-650 hover:bg-red-700 text-white text-[9px] font-bold rounded shadow-xs"
                          >
                            Simulate Decline
                          </button>
                        </div>
                      </div>
                    )}

                    {requestChangeStatus === "accepted" && (
                      <div className="flex flex-col items-center justify-center p-4 space-y-3.5 text-center bg-green-500/5 border border-green-500/20 rounded-xl animate-in fade-in duration-200">
                        <div className="h-10 w-10 rounded-full bg-green-550/10 text-green-600 dark:text-green-400 flex items-center justify-center text-lg font-bold">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-green-650 dark:text-green-400">🎉 Proposal Accepted by Roller!</h4>
                          <p className="text-[11px] text-gray-500 dark:text-gray-455 mt-1 max-w-sm">
                            <strong>@{challengeWindowData.oppUser}</strong> has reviewed and <span className="bg-green-555/15 px-1 py-0.5 rounded text-green-600">approved</span> your requested market modifications!
                          </p>
                        </div>
                        <div className="bg-white/80 dark:bg-black/20 p-2.5 rounded-xl font-mono text-[10.5px] text-left w-full border border-gray-100 dark:border-zinc-800">
                          <div><span className="text-gray-400">Match:</span> <span className="text-gray-800 dark:text-gray-200 font-bold">{challengeWindowData.matchName}</span></div>
                          <div><span className="text-gray-400">Total Stake:</span> <span className="text-[#1877f2] font-black">${challengeWindowData.oppStake.toFixed(2)}</span></div>
                          <div><span className="text-gray-400">Agreed Market:</span> <span className="text-green-600 font-extrabold">{requestedMarketInput}</span></div>
                        </div>
                        <div className="flex gap-2 w-full justify-center">
                          <button 
                            type="button"
                            onClick={() => {
                              const totalTaxFloat = (activeDebitValue + challengeWindowData.oppStake) * 0.02;
                              const totalRequiredToPayForFloat = activeDebitValue + totalTaxFloat;

                              if (walletBalance < totalRequiredToPayForFloat) {
                                alert(`Your wallet balance is insufficient ($${walletBalance.toFixed(2)}) to lock this $${activeDebitValue.toFixed(2)} liability and $${totalTaxFloat.toFixed(2)} Org Tax.`);
                                return;
                              }
                              setWalletBalance((prev) => prev - totalRequiredToPayForFloat);
                              setTransactions([
                                {
                                  id: `tx-${Date.now()}`,
                                  type: "bet_stake",
                                  amount: activeDebitValue,
                                  time: "Just now",
                                  target: `Matched Escrow: @${challengeWindowData.oppUser} on ${challengeWindowData.matchName} (Counter Accepted: ${requestedMarketInput})`,
                                },
                                {
                                  id: `tx-tax-${Date.now()}`,
                                  type: "withdraw" as const,
                                  amount: totalTaxFloat,
                                  time: "Just now",
                                  target: `Org. Escrow Tax (2% full hold)`,
                                },
                                ...transactions,
                              ]);
                              alert(`Successfully locked and matched challenge under agreed modified terms of "${requestedMarketInput}"!`);
                              setChallengeWindowOpen(false);
                            }}
                            className="py-1.5 px-3.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs rounded-lg shadow-sm "
                          >
                            Lock Escrow & Play
                          </button>
                          <button 
                            type="button"
                            onClick={() => {
                              setRequestChangeStatus("none");
                              setIsRequestingChange(false);
                            }}
                            className="py-1.5 px-3 bg-gray-250 dark:bg-zinc-850 text-gray-700 dark:text-gray-200 hover:bg-gray-300 font-bold text-xs rounded-lg"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    )}

                    {requestChangeStatus === "declined" && (
                      <div className="flex flex-col items-center justify-center p-4 space-y-3.5 text-center bg-red-500/5 border border-red-500/20 rounded-xl animate-in fade-in duration-200">
                        <div className="h-10 w-10 rounded-full bg-red-550/10 text-red-600 dark:text-red-400 flex items-center justify-center text-lg font-bold">
                          ✗
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-red-650 dark:text-red-400">❌ Proposal Declined by Roller</h4>
                          <p className="text-[11px] text-gray-500 dark:text-gray-455 mt-1 max-w-sm">
                            <strong>@{challengeWindowData.oppUser}</strong> preferred to stay with original risk conditions and declined your requested terms.
                          </p>
                        </div>
                        <div className="flex gap-2 w-full justify-center">
                          <button 
                            type="button"
                            onClick={() => {
                              setRequestChangeStatus("none");
                              setIsRequestingChange(false);
                              setRequestedMarketInput("");
                            }}
                            className="py-1.5 px-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-lg shadow-sm "
                          >
                            Back To Original Offer
                          </button>
                          <button 
                            type="button"
                            onClick={() => setChallengeWindowOpen(false)}
                            className="py-1.5 px-3 bg-gray-200 dark:bg-zinc-850 hover:bg-gray-300 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-lg"
                          >
                            Cancel Challenge
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {challengeWindowData.isProposedMarket === "waiting" ? (
                      /* ======================= WAITING MODE PANEL ======================= */
                      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex flex-col gap-3 select-none text-left animate-in fade-in duration-200">
                        <div className="flex justify-between items-center pb-2 border-b border-indigo-500/15">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">⏳</span>
                            <div>
                              <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-mono font-black uppercase block tracking-wider">3-Way Split: Waiting Mode</span>
                              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block mt-0.5">
                                Proposer <strong>@{challengeWindowData.oppUser}</strong> backed <strong>"{challengeWindowData.prediction}"</strong>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-650 dark:text-gray-300 leading-normal">
                          <p className="mb-2">This is a 3-way challenge. As the first acceptor, you must pick one of the two remaining outcomes. The last outcome will then become a forced market for the next acceptor.</p>
                          <label className="block text-[10px] uppercase font-mono font-black text-gray-500 mb-1.5">Select Your Outcome:</label>
                          <div className="grid grid-cols-2 gap-2 font-mono font-bold text-[10.5px]">
                            {["1", "X", "2"].filter(c => c !== rollerChoice).map(sel => {
                              const selName = sel === "1" ? "Home Win (1)" : sel === "X" ? "Draw (X)" : "Away Win (2)";
                              const selOdds = sel === "1" ? odds1 : sel === "X" ? oddsX : odds2;
                              return (
                                <button
                                  key={sel}
                                  type="button"
                                  onClick={() => setSelectedAcceptorOutcome(sel as "1"|"X"|"2")}
                                  className={`py-2 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                                    selectedAcceptorOutcome === sel
                                      ? "bg-indigo-600 border-indigo-600 text-white"
                                      : "bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
                                  }`}
                                >
                                  {selName} @{selOdds.toFixed(2)}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : challengeWindowData.isProposedMarket === true ? (
                      /* ======================= PEER COLLABORATION WORKSPACE ======================= */
                      <div className="bg-emerald-500/[0.04] border border-emerald-500/15 rounded-2xl p-4 flex flex-col gap-3 select-none text-left animate-in fade-in duration-200">
                        <div className="flex justify-between items-center pb-2.5 border-b border-emerald-500/15">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🤝</span>
                            <div>
                              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono font-black uppercase block tracking-wider">P2P Collaboration Active</span>
                              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block mt-0.5">
                                Partner with <strong>@{challengeWindowData.oppUser}</strong>
                              </span>
                            </div>
                          </div>
                          <div className="text-right font-mono">
                            <span className="block text-[8px] text-gray-400 uppercase tracking-widest font-bold">Proposer Bet choice</span>
                            <span className="block text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                              Backing "{challengeWindowData.prediction}"
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-gray-650 dark:text-gray-300 leading-normal space-y-3">
                          <p>
                            Instead of betting against <strong>@{challengeWindowData.oppUser}</strong>, you are joining forces as a collaborator to back their exact choice of <strong className="text-emerald-600 dark:text-emerald-400">"{challengeWindowData.prediction}"</strong> together!
                          </p>

                          {/* Contribution control */}
                          <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800/80 rounded-xl p-3.5 space-y-2.5">
                            <label className="block text-[10px] font-mono font-black text-gray-400 uppercase tracking-wider">
                              Added Stake to Contribute ($):
                            </label>
                            <div className="flex gap-2 items-center">
                              <input
                                type="number"
                                min="1"
                                value={collabAddedAmount}
                                onChange={(e) => setCollabAddedAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                                className="w-24 px-2.5 py-1.5 bg-gray-50 dark:bg-zinc-950 border border-gray-250 dark:border-zinc-800 rounded-lg text-xs font-mono font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <div className="flex flex-wrap gap-1">
                                {[5, 10, 25, 50, 100].map((amt) => (
                                  <button
                                    key={amt}
                                    type="button"
                                    onClick={() => setCollabAddedAmount(amt)}
                                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                                      collabAddedAmount === amt
                                        ? "bg-emerald-600 border-emerald-600 text-white"
                                        : "bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-750 border-gray-200 dark:border-zinc-750 text-gray-750 dark:text-gray-205"
                                    }`}
                                  >
                                    +${amt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Combined stakes calculation table */}
                          <div className="p-3 bg-gray-50 dark:bg-zinc-900/40 rounded-xl border border-gray-150 dark:border-zinc-800/80 space-y-1.5 text-[11px]">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Roller's Original Stake:</span>
                              <span className="font-mono font-bold text-gray-800 dark:text-gray-200">${challengeWindowData.oppStake.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                              <span>Your Added Contribution:</span>
                              <span className="font-mono">+${collabAddedAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 dark:border-zinc-800 pt-1.5 mt-1.5 font-extrabold text-xs">
                              <span className="text-gray-900 dark:text-white">New Combined Stake:</span>
                              <span className="font-mono text-emerald-600 dark:text-emerald-400">${(challengeWindowData.oppStake + collabAddedAmount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-blue-600 dark:text-blue-400 text-[10px] font-mono font-bold pt-1">
                              <span>🏛️ Global Pool Escrow Fee:</span>
                              <span>$0.00 (posted freely!)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* ======================= STANDARD OPEN PROPOSITION PANEL ======================= */
                      <>
                        {challengeWindowData.isProposedMarket === "waiting_forced" && (
                          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-2.5 mb-2 text-center text-[10px] font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-wider animate-in fade-in">
                            ⏳ 3-WAY SPLIT: WAITING MODE BET (FORCED REMAINDER)
                          </div>
                        )}
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex flex-col gap-2 select-none text-left animate-in fade-in duration-200">
                          <div className="flex justify-between items-center pb-2 border-b border-amber-500/15">
                            <div>
                              <span className="text-[9px] text-amber-600 dark:text-amber-450 font-mono font-black uppercase block">👑 ROLLER MARKET (Proposer Choice)</span>
                              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block mt-0.5">@{challengeWindowData.oppUser} backed <strong>"{challengeWindowData.prediction}"</strong></span>
                            </div>
                            <div className="text-right font-mono">
                              <span className="block text-[8px] text-gray-400">Escrow Odds</span>
                              <span className="block text-xs font-extrabold text-amber-500">@{rollerChoice === "1" ? odds1 : rollerChoice === "X" ? oddsX : odds2}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-[9px] text-blue-650 dark:text-blue-400 font-mono font-black uppercase block">🤝 PROPOSED MARKET (Forced Opponent Target)</span>
                            <span className="text-xs font-extrabold text-[#1877f2] dark:text-blue-450 block mt-0.5">
                              👉 {challengeWindowData.proposedMarketToAcceptor || "Opposite counter prediction"}
                            </span>
                          </div>
                        </div>

                        {/* FORCED OUTCOME INFORMATION (NO OPTIONALIZED CHOICES PER USER REQUEST) */}
                        <div className="p-4 border border-dashed border-blue-500/30 dark:border-zinc-800 rounded-2xl bg-blue-500/[0.02] dark:bg-black/5 select-none leading-relaxed text-left">
                          <div className="flex items-center gap-1.5 mb-2">
                            <span className="text-xs">🔒</span>
                            <span className="text-[10px] text-[#1877f2] font-mono font-black uppercase tracking-wider">Forced Opponent Outcome Locked</span>
                          </div>
                          <p className="text-xs text-gray-750 dark:text-gray-300">
                            Since the roller <strong>@{challengeWindowData.oppUser}</strong> is forcing a market, you are assigned to back:
                          </p>
                          <div className="mt-2.5 p-3 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">🎯</span>
                              <div>
                                <span className="text-[10px] text-gray-450 block font-mono leading-none">YOUR ASSIGNED OUTCOME</span>
                                <span className="text-xs font-black text-gray-900 dark:text-white mt-1 block">
                                  {challengeWindowData.proposedMarketToAcceptor || "Opposite Counter Prediction"}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs font-black text-blue-600 dark:text-[#a3e635] bg-blue-500/10 dark:bg-[#a3e635]/10 px-2 py-1 rounded font-mono">
                              @{rollerChoice === "1" ? oddsX : rollerChoice === "X" ? odds2 : odds1}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-450 mt-2.5 leading-normal">
                            💡 Acceptor choice is not permitted for standard P2P matched challenges because the roller establishes the direct risk ratio. However, you can use the counter-propositions below to request a change.
                          </p>
                        </div>
                      </>
                    )}

                    {challengeWindowData.isProposedMarket !== "waiting" && challengeWindowData.isProposedMarket !== "waiting_forced" && (
                      <>
                        {/* DIVIDED REQUEST MARKET CHANGE PARAMETERS */}
                        {challengeWindowData.isProposedMarket !== "waiting" && challengeWindowData.isProposedMarket !== "waiting_forced" && (
                          <div className="p-3.5 rounded-xl border border-gray-200 dark:border-zinc-850 bg-gray-50/50 dark:bg-black/5">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-black text-gray-800 dark:text-gray-200 uppercase font-mono flex items-center gap-1.5 text-left">
                                <span>🔄</span> Change & Counter Propositions
                              </span>
                              {isRequestingChange && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsRequestingChange(false);
                                    setRequestedMarketInput("");
                                  }}
                                  className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-red-500/10 text-red-650 hover:bg-red-500/20 font-black rounded transition-all cursor-pointer"
                                >
                                  Cancel Request
                                </button>
                              )}
                            </div>
                            
                            <p className="text-[10.5px] text-gray-400 leading-normal mb-3 text-left">
                              {challengeWindowData.isProposedMarket !== false 
                                ? "Want to collaborate but prefer a different market outcome? Propose a custom market change below."
                                : "Don't agree with the forced market? Request a custom market change by navigating to the full match page."
                              }
                            </p>

                    <div className="space-y-3">
                              <button
                                type="button"
                                onClick={handleNavigateToWholeMatchPageForChange}
                                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-blue-400/25 cursor-pointer"
                              >
                                🔍 Select Custom Market from Full Match Page
                              </button>

                              {isRequestingChange && (
                                <div className="animate-in slide-in-from-top-2 duration-150">
                                  {requestedMarketInput ? (
                                    <div className="p-3 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1.5 text-left">
                                      <div className="flex justify-between items-center">
                                        <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono font-black uppercase tracking-wider block">✓ SELECTED MARKET TO PROPOSE</span>
                                        <button
                                          type="button"
                                          onClick={() => setRequestedMarketInput("")}
                                          className="text-[9px] text-red-500 hover:underline font-bold"
                                        >
                                          Reset
                                        </button>
                                      </div>
                                      <div className="text-xs font-extrabold text-gray-950 dark:text-white font-mono bg-white dark:bg-zinc-900 p-2 rounded-lg border border-gray-150 dark:border-zinc-800">
                                        Proposed Outcome: <span className="text-indigo-600 dark:text-blue-400 font-bold">"{requestedMarketInput}"</span>
                                      </div>
                                      <span className="text-[10px] text-gray-450 block leading-normal">
                                        Tap the green <strong className="text-emerald-600 font-bold">'Yes'</strong> button in the footer to submit this proposed market change directly to <strong>@{challengeWindowData.oppUser}</strong>.
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="p-3 bg-gray-100/50 dark:bg-black/15 rounded-xl border border-gray-150 dark:border-zinc-800/60 text-center animate-pulse">
                                      <span className="text-[10.5px] text-gray-500 font-mono block">
                                        ⏳ Awaiting your market selection. Tap the button above to select from the live match center.
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Yes No Cancel confirmation wrapper block */}
                        <div className="p-3.5 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/45 rounded-xl space-y-1 text-left">
                          <span className="font-extrabold text-[11px] text-yellow-800 dark:text-yellow-400 block mb-0.5">
                            ⚠️ Are you sure to proceed?
                          </span>
                          <div className="text-[10.5px] text-gray-600 dark:text-gray-300 leading-normal">
                            {challengeWindowData.isProposedMarket === "waiting" ? (
                              <span>
                                3-Way Match setup: backing <strong className="text-indigo-650 dark:text-indigo-400 font-mono uppercase">"{selectedAcceptorOutcome === "1" ? "Home Win (1)" : selectedAcceptorOutcome === "X" ? "Draw (X)" : "Away Win (2)"}"</strong>.
                                A stake of <strong className="text-red-500 font-black">${activeDebitValue.toFixed(2)}</strong> will be <strong className="text-red-500 font-black">debited immediately</strong> from your balance and locked. The remaining option will be forced on the final opponent.
                                <div className="font-extrabold text-amber-600 dark:text-amber-500 pt-1 mt-1 border-t border-yellow-200 dark:border-yellow-900/45">🏛️ Org. Escrow Tax (2% upon full hold): ${((activeDebitValue + challengeWindowData.oppStake) * 0.02).toFixed(2)}</div>
                              </span>
                            ) : challengeWindowData.isProposedMarket === "waiting_forced" ? (
                              <span>
                                Final 3-Way Forced setup: backing <strong className="text-indigo-650 dark:text-indigo-400 font-mono uppercase">"{challengeWindowData.proposedMarketToAcceptor}"</strong>.
                                A stake of <strong className="text-red-500 font-black">${activeDebitValue.toFixed(2)}</strong> will be <strong className="text-red-500 font-black">debited immediately</strong> from your balance and locked. The global escrow will be fully matched.
                                <div className="font-extrabold text-amber-600 dark:text-amber-500 pt-1 mt-1 border-t border-yellow-200 dark:border-yellow-900/45">🏛️ Org. Escrow Tax (2% upon full hold): ${((activeDebitValue + challengeWindowData.oppStake) * 0.02).toFixed(2)}</div>
                              </span>
                            ) : challengeWindowData.isProposedMarket !== false ? (
                              isRequestingChange ? (
                                <span>
                                  Collaboration with custom market: proposing <strong className="text-indigo-650 dark:text-indigo-400 font-mono font-black">"{requestedMarketInput}"</strong>. 
                                  Your contribution of <strong className="text-red-500 font-black">${collabAddedAmount.toFixed(2)}</strong> will be debited and held.
                                  If @{challengeWindowData.oppUser} declines, you will be <strong className="text-green-600 font-bold">fully refunded</strong>!
                                </span>
                              ) : (
                                <span>
                                  Immediate collaboration setup: backing <strong className="text-[#31a24c] font-mono uppercase font-black">"{challengeWindowData.prediction}"</strong> with @{challengeWindowData.oppUser}.
                                  A contribution of <strong className="text-red-500 font-black">${collabAddedAmount.toFixed(2)}</strong> will be <strong className="text-red-500 font-black">debited immediately</strong> and the challenge posted freely.
                                </span>
                              )
                            ) : isRequestingChange ? (
                              <span>
                                Market change proposal registers: <strong className="text-blue-600 dark:text-blue-450 font-mono">"{requestedMarketInput}"</strong>. 
                                This submits an interactive decision proposal to @{challengeWindowData.oppUser} to Accept/Decline in real-time. 
                                <strong className="text-gray-950 dark:text-white font-extrabold"> No wallet holding debited immediately!</strong>
                              </span>
                            ) : challengeMode === "optionalized" || challengeWindowData.isProposedMarket === false ? (
                              <span>
                                Optionalized matched setup: backing <strong className="text-indigo-650 dark:text-indigo-400 font-mono uppercase">"{selectedAcceptorOutcome === "1" ? "Home Win (1)" : selectedAcceptorOutcome === "X" ? "Draw (X)" : "Away Win (2)"}"</strong>.
                                A stake of <strong className="text-red-500 font-black">${activeDebitValue.toFixed(2)}</strong> will be <strong className="text-red-500 font-black">debited immediately</strong> from your balance and locked.
                                <div className="font-extrabold text-amber-600 dark:text-amber-500 pt-1 mt-1 border-t border-yellow-200 dark:border-yellow-900/45">🏛️ Org. Escrow Tax (2% upon full hold): ${((activeDebitValue + challengeWindowData.oppStake) * 0.02).toFixed(2)}</div>
                              </span>
                            ) : (
                              <span>
                                Standard match configuration: backing the counter marker opposite of <strong className="text-indigo-650 dark:text-indigo-400 font-mono">"{challengeWindowData.prediction}"</strong>. 
                                A stake of <strong className="text-red-500 font-black">${activeDebitValue.toFixed(2)}</strong> will be <strong className="text-red-500 font-black">debited immediately</strong> and locked in global escrow.
                                <div className="font-extrabold text-amber-600 dark:text-amber-500 pt-1 mt-1 border-t border-yellow-200 dark:border-yellow-900/45">🏛️ Org. Escrow Tax (2% upon full hold): ${((activeDebitValue + challengeWindowData.oppStake) * 0.02).toFixed(2)}</div>
                              </span>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Resizable Footer controls */}
              <div className="p-4 bg-gray-50 dark:bg-[#1c1d1e] border-t border-gray-200 dark:border-zinc-800/80 flex justify-between items-center shrink-0 select-none">
                <div className="text-[11px] font-mono">
                  {challengeWindowData.isProposedMarket === "waiting" ? (
                    <span className="text-gray-500">Debited from main: <strong className="text-red-500 font-black">${(activeDebitValue + ((activeDebitValue + challengeWindowData.oppStake) * 0.02)).toFixed(2)}</strong></span>
                  ) : challengeWindowData.isProposedMarket === true ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Contribution to Debit: ${collabAddedAmount.toFixed(2)} <span className="text-[10px] text-gray-400">(Zero Sendoff Charges!)</span></span>
                  ) : isRequestingChange ? (
                    <span className="text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1">⏰ Pending counter decision</span>
                  ) : (
                    <span className="text-gray-500">Debited from main: <strong className="text-red-500 font-black">${(activeDebitValue + ((activeDebitValue + challengeWindowData.oppStake) * 0.02)).toFixed(2)}</strong></span>
                  )}
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      if (challengeWindowData.isProposedMarket === "waiting") {
                        // ======================= WAITING MODE FLOW (3-WAY SPLIT) =======================
                        const totalRequiredToPayForFloat = activeDebitValue + ((activeDebitValue + challengeWindowData.oppStake) * 0.02);
                        if (walletBalance < totalRequiredToPayForFloat) {
                          alert(`Your wallet balance is insufficient ($${walletBalance.toFixed(2)}) to accept this 3-way split challenge for $${totalRequiredToPayForFloat.toFixed(2)}.`);
                          return;
                        }

                        // Determine remaining selection
                        const sel1 = rollerChoice;
                        const sel2 = selectedAcceptorOutcome;
                        const remaining = ["1", "X", "2"].find(s => s !== sel1 && s !== sel2);
                        const selName = remaining === "1" ? "Home Win (1)" : remaining === "X" ? "Draw (X)" : "Away Win (2)";
                        
                        setWalletBalance((prev) => prev - totalRequiredToPayForFloat);
                        setTransactions([
                          {
                            id: `tx-waiting-${Date.now()}`,
                            type: "bet_stake",
                            amount: activeDebitValue,
                            time: "Just now",
                            target: `Accepted 3-Way Challenge: @${challengeWindowData.oppUser} on ${challengeWindowData.matchName} (You chose: ${selectedAcceptorOutcome === "1" ? "Home Win" : selectedAcceptorOutcome === "X" ? "Draw" : "Away Win"})`,
                          },
                          ...transactions,
                        ]);

                        // Post new forced market for the remaining 3rd outcome
                        const remainingLiability = challengeWindowData.oppStake - activeDebitValue;
                        const newForcedChallenge = {
                          id: `custom-pc-forced-${Date.now()}`,
                          user: `System (3-Way Remaining)`,
                          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Waiting&backgroundColor=ff9800",
                          stake: remainingLiability, 
                          prediction: `Waiting for: ${selName}`,
                          status: "LIVE" as const,
                          matchName: challengeWindowData.matchName,
                          isProposedMarket: "waiting_forced" as const,
                          proposedMarketToAcceptor: `${selName}`,
                        };
                        setCustomGlobalChallenges([newForcedChallenge, ...customGlobalChallenges]);

                        alert(`🎉 3-Way Waiting Mode matched! Your choice is locked. The final remaining outcome (${selName}) has been posted as a Forced Market for the final acceptor!`);
                        setChallengeWindowOpen(false);
                      } else if (challengeWindowData.isProposedMarket === true) {
                        // ======================= COLLABORATION FLOW =======================
                        if (walletBalance < collabAddedAmount) {
                          alert(`Your wallet balance is insufficient ($${walletBalance.toFixed(2)}) to contribute $${collabAddedAmount.toFixed(2)}.`);
                          return;
                        }

                        if (!isRequestingChange) {
                          // Collaborate immediately on original market
                          setWalletBalance((prev) => prev - collabAddedAmount);
                          setTransactions([
                            {
                              id: `tx-collab-${Date.now()}`,
                              type: "bet_stake",
                              amount: collabAddedAmount,
                              time: "Just now",
                              target: `Collaborated: Partnered with @${challengeWindowData.oppUser} on ${challengeWindowData.matchName} with +$${collabAddedAmount.toFixed(2)}`,
                            },
                            ...transactions,
                          ]);

                          // Post to customGlobalChallenges freely in global pool
                          const newCollabChallenge = {
                            id: `collab-challenge-${Date.now()}`,
                            user: `${challengeWindowData.oppUser} & You`,
                            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Us&backgroundColor=10b981`,
                                          status: "LIVE" as const,
                            matchName: challengeWindowData.matchName,
                            isProposedMarket: false,
                          };
                          setCustomGlobalChallenges([newCollabChallenge, ...customGlobalChallenges]);

                          alert(`🎉 Collaboration Successful! You accepted @${challengeWindowData.oppUser}'s bet of "${challengeWindowData.prediction}" and contributed an added $${collabAddedAmount.toFixed(2)} to their stake (total pool: $${(challengeWindowData.oppStake + collabAddedAmount).toFixed(2)}). Challenge is posted freely in the global pool!`);
                        } else {
                          // Proposed custom market change
                          if (!requestedMarketInput) {
                            alert("Please select or specify a custom market outcome first.");
                            return;
                          }
                          // Debit acceptor immediately
                          setWalletBalance((prev) => prev - collabAddedAmount);
                          setTransactions([
                            {
                              id: `tx-collab-prop-${Date.now()}`,
                              type: "bet_stake",
                              amount: collabAddedAmount,
                              time: "Just now",
                              target: `Collab Proposal: Contributed $${collabAddedAmount.toFixed(2)} (Pending change to "${requestedMarketInput}")`,
                            },
                            ...transactions,
                          ]);

                          // Send notification to roller
                          const newProposalNotification = {
                            id: `noti-prop-${Date.now()}`,
                            names: `@${challengeWindowData.oppUser}`,
                            action: `proposes a custom market change to "${requestedMarketInput}" and collaborated with +$${collabAddedAmount.toFixed(2)} contribution.`,
                            time: "Just now",
                            read: false,
                            category: "new",
                            type: "mention",
                            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(challengeWindowData.oppUser)}&backgroundColor=10b981`,
                                          status: "pending" as const,
                          };
                          setNotificationList([newProposalNotification, ...notificationList]);
                          alert(`🤝 Collaboration Proposal Registered! Debited $${collabAddedAmount.toFixed(2)} contribution. Proposer @${challengeWindowData.oppUser} will be notified immediately. If they decline, you'll be fully refunded.`);
                        }
                        setChallengeWindowOpen(false);
                      } else {
                        // ======================= STANDARD P2P MATCHING FLOW =======================
                        if (!isRequestingChange) {
                          const totalTaxFloat = (activeDebitValue + challengeWindowData.oppStake) * 0.02;
                          const totalRequiredToPayForFloat = activeDebitValue + totalTaxFloat;

                          if (walletBalance < totalRequiredToPayForFloat) {
                            alert(`Your wallet balance is insufficient ($${walletBalance.toFixed(2)}) to lock this $${activeDebitValue.toFixed(2)} liability and $${totalTaxFloat.toFixed(2)} Org Tax.`);
                            return;
                          }
                          setWalletBalance((prev) => prev - totalRequiredToPayForFloat);
                          setTransactions([
                            {
                              id: `tx-${Date.now()}`,
                              type: "bet_stake",
                              amount: activeDebitValue,
                              time: "Just now",
                              target: `Matched Escrow: @${challengeWindowData.oppUser} on ${challengeWindowData.matchName} (${challengeMode === "optionalized" ? (selectedAcceptorOutcome === "1" ? "Home Win" : selectedAcceptorOutcome === "X" ? "Draw" : "Away Win") : "Counter Prediction"})`,
                            },
                            {
                              id: `tx-tax-${Date.now()}`,
                              type: "withdraw" as const,
                              amount: totalTaxFloat,
                              time: "Just now",
                              target: `Org. Escrow Tax (2% full hold)`,
                            },
                            ...transactions,
                          ]);
                          alert(`Successfully matched the P2P liability of @${challengeWindowData.oppUser} for $${activeDebitValue.toFixed(2)}! Safe escrow locked immediately.`);
                        } else {
                          // Proposal requested change
                          const newProposalNotification = {
                            id: `noti-prop-${Date.now()}`,
                            names: `@${challengeWindowData.oppUser}`,
                            action: `requested custom market changes for ${challengeWindowData.matchName}`,
                            time: "Just now",
                            read: false,
                            category: "new",
                            type: "mention",
                            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(challengeWindowData.oppUser)}&backgroundColor=ffc107`,
                                          status: "pending" as const,
                          };
                          setNotificationList([newProposalNotification, ...notificationList]);
                          alert(`Counter proposal registered for "${requestedMarketInput}". Opponent will be notified immediately. No funds debited yet!`);
                        }
                        setChallengeWindowOpen(false);
                      }
                    }}
                    className="py-1.5 px-4 bg-[#31a24c] hover:bg-[#2b8f41] text-white font-extrabold text-xs rounded-lg shadow-xs cursor-pointer"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setChallengeWindowOpen(false)}
                    className="py-1.5 px-3 bg-gray-200 hover:bg-gray-300 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-200 font-extrabold text-xs rounded-lg shadow-xs cursor-pointer"
                  >
                    No
                  </button>
                  <button
                    onClick={() => setChallengeWindowOpen(false)}
                    className="py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-lg shadow-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        walletBalance={walletBalance}
        onDeposit={(amt) => {
          setWalletBalance((prev) => prev + amt);
          setTransactions([
            { id: `tx-${Date.now()}`, type: "deposit", amount: amt, time: "Just now", target: "Simulated MPESA deposit" },
            ...transactions
          ]);
        }}
        onWithdraw={(amt) => {
          setWalletBalance((prev) => prev - amt);
          setTransactions([
            { id: `tx-${Date.now()}`, type: "withdraw", amount: amt, time: "Just now", target: "Simulated MPESA withdrawal" },
            ...transactions
          ]);
        }}
        transactions={transactions}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(phoneNumber, email, provider) => {
          setCurrentUser({ phoneNumber, email, provider });
          setAuthModalOpen(false);
        }}
      />

      {/* CREATE NEW SPORTS SYNDICATE GROUP MODAL */}
      {createGroupModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-[130] p-4 font-sans animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#242526] border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gray-50 dark:bg-[#1c1d1e]">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl">
                  <Plus className="w-5 h-5 text-[#1877f2]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white leading-tight">
                    Create Sports Syndicate Group
                  </h3>
                  <p className="text-xs text-gray-400">Launch a private betting clan matching pool</p>
                </div>
              </div>
              <button 
                onClick={() => setCreateGroupModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-150 dark:hover:bg-zinc-800 rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Form */}
            <div className="p-6 overflow-y-auto space-y-4 text-left">
              
              {/* Group Name input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-gray-405 dark:text-gray-400 tracking-wider">
                  Syndicate Name *
                </label>
                <input 
                  type="text"
                  placeholder="e.g., El Classico High Rollers, Nairobi Bets Syndicate..."
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#18191a] text-sm rounded-xl px-4 py-3 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Group Category selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-gray-450 dark:text-gray-400 tracking-wider">
                  Category
                </label>
                <select 
                  value={newGroupCategory}
                  onChange={(e) => setNewGroupCategory(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#18191a] text-sm rounded-xl px-4 py-3 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#1877f2] cursor-pointer"
                >
                  <option value="Local leagues">⚽ Local Leagues</option>
                  <option value="VIP syndicates">💎 VIP Syndicates</option>
                  <option value="Zero margins">🔥 Zero Margins</option>
                  <option value="High stakers">⚡ High Stakers</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-gray-450 dark:text-gray-400 tracking-wider">
                  Clan Description
                </label>
                <textarea 
                  rows={2}
                  placeholder="Tell potential matchers about your sports specialities, rules, or target margins..."
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#18191a] text-sm rounded-xl px-4 py-3 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Preset Image Selectors */}
                    <div className="space-y-3">
                
                {/* Cover presets */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-gray-500 dark:text-gray-450 uppercase text-[10px] tracking-wider">Cover Image URL</label>
                    <span className="text-[10px] text-gray-400 font-medium">Click quick presets (optional)</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Custom cover address..."
                    value={newGroupCoverImage}
                    onChange={(e) => setNewGroupCoverImage(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#18191a] text-xs font-mono rounded-xl px-4 py-2.5 border border-gray-205 dark:border-zinc-850 text-gray-900 dark:text-gray-105 outline-none focus:ring-1 focus:ring-[#1877f2]"
                  />
                  <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                    <button 
                      type="button"
                      onClick={() => setNewGroupCoverImage("https://images.unsplash.com/photo-1540747737956-37872404a82f?q=80&w=600")}
                      className={`px-2 py-1 text-[10px] font-extrabold rounded-lg border transition-all text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer ${
                        newGroupCoverImage.includes("1540747737956") ? "bg-[#1877f2]/10 border-[#1877f2] text-[#1877f2]" : "bg-gray-50 dark:bg-[#1c1d1e] border-gray-200 dark:border-zinc-800 hover:bg-gray-100 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      ⚽ Stadium Lights
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewGroupCoverImage("https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=600")}
                      className={`px-2 py-1 text-[10px] font-extrabold rounded-lg border transition-all text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer ${
                        newGroupCoverImage.includes("1518063319789") ? "bg-[#1877f2]/10 border-[#1877f2] text-[#1877f2]" : "bg-gray-50 dark:bg-[#1c1d1e] border-gray-200 dark:border-zinc-800 hover:bg-gray-100 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      🏃 Turf Field
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewGroupCoverImage("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600")}
                      className={`px-2 py-1 text-[10px] font-extrabold rounded-lg border transition-all text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer ${
                        newGroupCoverImage.includes("1508098682722") ? "bg-[#1877f2]/10 border-[#1877f2] text-[#1877f2]" : "bg-gray-50 dark:bg-[#1c1d1e] border-gray-200 dark:border-zinc-800 hover:bg-gray-100 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      🏐 Sporting Ball
                    </button>
                  </div>
                </div>

                {/* Avatar presets */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-gray-500 dark:text-gray-450 uppercase text-[10px] tracking-wider">Avatar / Logo Icon</label>
                    <span className="text-[10px] text-gray-400 font-medium">Click quick presets (optional)</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Custom logo address..."
                    value={newGroupAvatar}
                    onChange={(e) => setNewGroupAvatar(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#18191a] text-xs font-mono rounded-xl px-4 py-2.5 border border-gray-205 dark:border-zinc-850 text-gray-900 dark:text-gray-105 outline-none focus:ring-1 focus:ring-[#1877f2]"
                  />
                  <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                    <button 
                      type="button"
                      onClick={() => setNewGroupAvatar("https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=150")}
                      className={`px-2 py-1 text-[10px] font-extrabold rounded-lg border transition-all text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer ${
                        newGroupAvatar.includes("1517649763962") ? "bg-[#1877f2]/10 border-[#1877f2] text-[#1877f2]" : "bg-gray-50 dark:bg-[#1c1d1e] border-gray-200 dark:border-zinc-800 hover:bg-gray-100 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      ⚽ Classic Match
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewGroupAvatar("https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=150")}
                      className={`px-2 py-1 text-[10px] font-extrabold rounded-lg border transition-all text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer ${
                        newGroupAvatar.includes("1461896836934") ? "bg-[#1877f2]/10 border-[#1877f2] text-[#1877f2]" : "bg-gray-50 dark:bg-[#1c1d1e] border-gray-200 dark:border-zinc-800 hover:bg-gray-100 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      🏃 Trophy Race
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewGroupAvatar("https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=150")}
                      className={`px-2 py-1 text-[10px] font-extrabold rounded-lg border transition-all text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer ${
                        newGroupAvatar.includes("1546182990") ? "bg-[#1877f2]/10 border-[#1877f2] text-[#1877f2]" : "bg-gray-50 dark:bg-[#1c1d1e] border-gray-200 dark:border-zinc-800 hover:bg-gray-100 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      🦁 Mascot Shield
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-gray-50 dark:bg-[#1c1d1e] border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setCreateGroupModalOpen(false)}
                className="px-4 py-2.5 bg-gray-250 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-850 dark:text-gray-200 text-xs font-black rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateGroupSubmit}
                disabled={!newGroupName.trim()}
                className={`px-5 py-2.5 text-xs font-black rounded-xl transition-all shadow flex items-center gap-1.5 cursor-pointer ${
                  newGroupName.trim() 
                    ? "bg-[#1877f2] hover:bg-blue-600 text-white transform hover:scale-[1.02]" 
                    : "bg-gray-150 dark:bg-zinc-850 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                }`}
              >
                <span>🚀 Launch Syndicate</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ⭐ AI FLOATING CHAT WIDGET */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end">
        {nyotaChatOpen && (
          <div className="mb-4 w-80 sm:w-96 h-[500px] bg-white dark:bg-[#242526] rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-zinc-700 overflow-hidden animate-in fade-in slide-in-from-bottom-5">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl shadow-inner border border-white/30 backdrop-blur-sm">
                  <Star className="w-6 h-6 fill-white text-white" />
                </div>
                <div>
                  <h3 className="text-white font-black leading-tight flex items-center gap-1">⭐ AI</h3>
                  <p className="text-white/80 text-[10px] font-medium leading-none">Your intelligent betting sidekick</p>
                </div>
              </div>
              <button 
                onClick={() => setNyotaChatOpen(false)}
                className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
                title="Close AI Engine"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#18191a]">
              {nyotaMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="flex flex-col max-w-[85%]">
                    <div className={`rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none shadow-sm' 
                        : 'bg-white dark:bg-[#3a3b3c] text-gray-800 dark:text-gray-100 rounded-bl-none shadow-sm border border-gray-100 dark:border-zinc-800'
                    }`}>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                </div>
              ))}
              {nyotaLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-[#3a3b3c] w-12 h-8 rounded-2xl rounded-bl-none shadow border border-gray-100 dark:border-zinc-800 flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleNyotaSubmit} className="p-3 bg-white dark:bg-[#242526] border-t border-gray-100 dark:border-zinc-800 shrink-0">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={nyotaInput}
                  onChange={(e) => setNyotaInput(e.target.value)}
                  placeholder="Ask ⭐ AI anything..."
                  disabled={nyotaLoading}
                  className="w-full bg-[#f0f2f5] dark:bg-[#3a3b3c] text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 rounded-full pl-4 pr-12 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50"
                  autoFocus
                />
                <button 
                  type="submit"
                  disabled={!nyotaInput.trim() || nyotaLoading}
                  className="absolute right-1.5 p-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-full transition-colors"
                >
                  <Send className="w-4 h-4 ml-0.5 mt-0.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Floating Toggle Button */}
        <button
          onClick={() => setNyotaChatOpen(!nyotaChatOpen)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-[201] overflow-hidden relative group ${
            nyotaChatOpen 
              ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-900 border-2 border-transparent' 
              : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-blue-500/30 ring-4 ring-white dark:ring-[#18191a]'
          }`}
        >
          {nyotaChatOpen ? (
            <X className="w-6 h-6 animate-in spin-in-12 duration-200" />
          ) : (
            <div className="relative">
              <Star className="w-7 h-7 fill-white text-white animate-pulse" />
            </div>
          )}
        </button>
      </div>
      
      {/* GLOBAL NOTIFICATION TOASTS */}
      <div className="fixed bottom-24 right-6 z-[1000] flex flex-col gap-2 max-w-sm pointer-events-none">
        {toastQueue.map(toast => (
          <div key={toast.id} className="pointer-events-auto items-center p-4 bg-gray-900/90 dark:bg-white/90 text-white dark:text-gray-900 rounded-xl shadow-lg animate-in slide-in-from-right-4 fade-in duration-300">
            <p className="text-sm font-bold flex items-center gap-2">
              <span className="text-blue-400 dark:text-[#1877f2]">ℹ</span>
              {toast.message}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
