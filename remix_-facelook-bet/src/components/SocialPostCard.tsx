import React, { useState, useEffect, useRef } from "react";
import { Post, Comment } from "../types";
import { 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  UserCheck, 
  Bookmark, 
  X, 
  Copy, 
  Check, 
  Star, 
  Send, 
  Smile, 
  Edit3, 
  Trash2, 
  Globe, 
  Share, 
  Flame, 
  Heart, 
  Sparkle,
  MoreHorizontal
} from "lucide-react";

interface SocialPostCardProps {
  key?: any;
  post: Post;
  currentUserId?: string;
  currentUserProfile?: { name: string; avatar: string };
  onLike: (postId: string, reaction?: Post["reaction"]) => void;
  onRepost: (originalPost: Post) => void;
  onSave: (type: string, content: string, avatar?: string) => void;
  onTag: () => void;
  onAcceptBet?: (post: Post) => void;
  onUpdatePostComments: (postId: string, updatedComments: Comment[]) => void;
  isDarkMode?: boolean;
  walletBalance?: number;
  onUpdateWallet?: (amount: number) => void;
}

// Particle interface for floating star bursts
interface StarParticle {
  id: number;
  x: number; // horizontal variation
  size: number;
  rotation: number;
  color: string;
}

export default function SocialPostCard({
  post,
  currentUserId = "user-1",
  currentUserProfile = { 
    name: "Collins Dnego (You)", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2" 
  },
  onLike,
  onRepost,
  onSave,
  onTag,
  onAcceptBet,
  onUpdatePostComments,
  isDarkMode = false,
  walletBalance = 1500,
  onUpdateWallet
}: SocialPostCardProps) {
  
  // Hover Reaction menu states
  const [showReactionSelector, setShowReactionSelector] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Star floating animations state
  const [starParticles, setStarParticles] = useState<StarParticle[]>([]);

  // Modal displays
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [starModalOpen, setStarModalOpen] = useState(false);
  const [selectedStarCount, setSelectedStarCount] = useState(50); // Default bundle to 50 Stars ($5.00)

  // Comments write/edit engine state
  const [newCommentText, setNewCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  // Link copy checkmark state
  const [copiedLink, setCopiedLink] = useState(false);

  // Clean-up timeouts
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // Show reaction bar on hover with 350ms delay
  const handleLikeMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setShowReactionSelector(true);
    }, 350); 
  };

  const handleLikeMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setShowReactionSelector(false);
    }, 400); 
  };

  // Helper to trigger floating star particles burst (fancy effect)
  const triggerStarsBurst = () => {
    const starColors = ["#ffd700", "#ffc107", "#ffeb3b", "#ff9800", "#e0a800"];
    const chunks = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: (Math.random() * 120) - 60, // scatter horizontally
      size: Math.random() * 14 + 10,
      rotation: Math.random() * 360,
      color: starColors[Math.floor(Math.random() * starColors.length)]
    }));

    setStarParticles(prev => [...prev, ...chunks]);

    // Clear particle objects after anim completes (1200ms)
    setTimeout(() => {
      setStarParticles(prev => prev.filter(p => !chunks.some(c => c.id === p.id)));
    }, 1200);
  };

  // Handle direct reaction click or standard Like click
  const selectReaction = (reactionType: Post["reaction"]) => {
    if (reactionType === "star") {
      setStarModalOpen(true);
      setShowReactionSelector(false);
      return;
    }
    onLike(post.id, reactionType);
    triggerStarsBurst();
    setShowReactionSelector(false);
  };

  const toggleStandardLike = () => {
    if (post.hasLiked) {
      onLike(post.id, undefined); // unlike
    } else {
      selectReaction("like"); // Default to standard like 👍
    }
  };

  // Comments Engine functions
  const handlePostCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    if (editingCommentId) {
      // Edit mode
      const updated = post.comments.map(c => {
        if (c.id === editingCommentId) {
          return { ...c, content: newCommentText.trim() };
        }
        return c;
      });
      onUpdatePostComments(post.id, updated);
      setEditingCommentId(null);
    } else {
      // Create mode
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        author: currentUserProfile.name,
        content: newCommentText.trim(),
        time: "Just now"
      };
      
      const updated = [...post.comments, newComment];
      onUpdatePostComments(post.id, updated);
    }

    setNewCommentText("");
  };

  const startEditingComment = (commentId: string, text: string) => {
    setEditingCommentId(commentId);
    setNewCommentText(text);
  };

  const deleteComment = (commentId: string) => {
    const updated = post.comments.filter(c => c.id !== commentId);
    onUpdatePostComments(post.id, updated);
    if (editingCommentId === commentId) {
      setEditingCommentId(null);
      setNewCommentText("");
    }
  };

  const copyPostLink = () => {
    const postUrl = `https://lookupto.app/posts/${post.id}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }).catch(err => {
      console.error("Failed to copy link:", err);
    });
  };

  // Get current reaction symbol & style
  const getReactionStyle = () => {
    switch (post.reaction) {
      case "love":
        return { label: "Love ❤️", color: "text-[#f02849]", emoji: "❤️" };
      case "wow":
        return { label: "Wow 😮", color: "text-[#f5c33b]", emoji: "😮" };
      case "sad":
        return { label: "Sad 😢", color: "text-[#f5c33b]", emoji: "😢" };
      case "lol":
        return { label: "Haha 😂", color: "text-[#f5c33b]", emoji: "😂" };
      case "star":
        return { label: "Star ⭐", color: "text-amber-500", emoji: "⭐" };
      default:
        return post.hasLiked 
          ? { label: "Like 👍", color: "text-[#1877f2]", emoji: "👍" } 
          : { label: "Like", color: "text-gray-550 dark:text-gray-400", emoji: "👍" };
    }
  };

  const reactionStyle = getReactionStyle();

  return (
    <div className="bg-white dark:bg-[#242526] rounded-xl shadow-md p-5 border border-gray-200 dark:border-[#3e4042] transition-colors duration-300 relative text-left">
      
      {/* Dynamic Keyframes Injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes starFloatingBurst {
          0% {
            transform: translate3d(0, 0, 0) scale(0.2) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 1;
            transform: translate3d(calc(var(--scatter-x) * 0.3), -30px, 0) scale(1.2) rotate(45deg);
          }
          100% {
            transform: translate3d(var(--scatter-x), -160px, 0) scale(0.5) rotate(calc(var(--rot-angle) * 1deg));
            opacity: 0;
          }
        }
        .anim-gold-star-burst {
          position: absolute;
          animation: starFloatingBurst 1100ms cubic-bezier(0.25, 1, 0.4, 1) forwards;
          pointer-events: none;
          z-index: 100;
        }
      `}} />

      {/* Star Particles Burst render stage */}
      <div className="absolute inset-x-0 bottom-12 h-0 flex justify-center pointer-events-none relative overflow-visible">
        {starParticles.map(p => (
          <div
            key={p.id}
            className="anim-gold-star-burst text-amber-400"
            style={{
              left: "50%",
              bottom: "20px",
              fontSize: `${p.size}px`,
              // @ts-ignore
              "--scatter-x": `${p.x}px`,
              "--rot-angle": `${p.rotation}`,
              color: p.color,
              textShadow: "0 0 10px rgba(253, 224, 71, 0.6)"
            }}
          >
            ★
          </div>
        ))}
      </div>

      {/* Repost Header Info */}
      {post.repostOf && (
        <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-gray-100 dark:border-zinc-800 text-xs font-bold text-gray-505 dark:text-gray-400 select-none">
          <Share className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
          <span>{post.author} reposted this content:</span>
        </div>
      )}

      {/* Top Author Bar */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <img 
            src={post.repostOf ? post.repostOf.avatar : post.avatar} 
            className="w-10 h-10 rounded-full border border-gray-200" 
            alt="avatar" 
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-extrabold text-sm text-[#050505] dark:text-[#e4e6eb] leading-tight">
                {post.repostOf ? post.repostOf.author : post.author}
              </h4>
              {post.betCard && (
                <span className="text-[9px] uppercase font-mono tracking-widest bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded font-extrabold leading-none">Ratio bet propose</span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">
              {post.repostOf ? `Reposted • ${post.time}` : post.time}
            </span>
          </div>
        </div>

        {/* Global indicator */}
        {post.isGlobalChannel && (
          <span className="bg-blue-50 dark:bg-blue-950 text-blue-500 dark:text-blue-400 text-[10px] px-2 py-0.5 font-bold uppercase rounded-md tracking-wider">
            🌐 Global Channel
          </span>
        )}
      </div>

      {/* Repost inner encapsulated card wrapper or normal post message body */}
      {post.repostOf ? (
        <div className="bg-gray-50 dark:bg-[#1c1d1e] rounded-xl border border-gray-200 dark:border-zinc-800 p-4 mb-4 mt-2 hover:border-gray-300 dark:hover:border-zinc-750 transition-all">
          <p className="text-sm text-gray-800 dark:text-gray-250 leading-relaxed mb-3 italic">
            "{post.repostOf.content}"
          </p>

          {/* Render embedded bet if inner post had a betCard too */}
          {post.repostOf.betCard && (
            <div className="bg-white dark:bg-[#242526] border border-gray-150 dark:border-zinc-800 rounded-xl overflow-hidden text-xs">
              <div className="bg-gray-100 dark:bg-zinc-800 p-2.5 flex items-center justify-between text-gray-700 dark:text-gray-300">
                <span className="font-mono font-bold">MATCH: {post.repostOf.betCard.match}</span>
                <span className="font-mono font-bold">${post.repostOf.betCard.totalPool.toFixed(2)} Vol</span>
              </div>
              <div className="p-3 space-y-1 font-mono text-[11px] text-gray-450 text-left">
                <div>Prediction Target: <strong className="text-blue-500">{post.repostOf.betCard.prediction}</strong></div>
                <div>Odds ratio: <strong>{post.repostOf.betCard.odds}</strong></div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-gray-100 dark:border-zinc-800/60 text-[10.5px] text-gray-400">
            <span>Posted originally by {post.repostOf.author}</span>
            <span>•</span>
            <span>{post.repostOf.time}</span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
          {post.content}
        </p>
      )}

      {/* Normal post: Underneath original post bets if attached */}
      {!post.repostOf && post.betCard && (
        <div className="bg-gray-55/60 dark:bg-[#18191a] border border-gray-150 dark:border-zinc-800 rounded-xl overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-[#1877f2] to-blue-800 p-3.5 flex items-center justify-between text-white select-none">
            <span className="text-xs font-mono font-bold tracking-tight">ESCROW POOL: {post.betCard.match}</span>
            <span className="text-[10px] font-mono font-bold">Total escrow: ${post.betCard.totalPool.toFixed(2)}</span>
          </div>
          <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs space-y-1.5 leading-relaxed font-mono text-gray-500">
              <div>Prediction target: <strong className="text-[#1877f2] dark:text-blue-400">{post.betCard.prediction}</strong></div>
              <div>Creator stake holding: <strong className="text-gray-800 dark:text-gray-300">${post.betCard.stakes.creator.toFixed(2)}</strong></div>
              <div>Opponent liability required: <strong className="text-red-500 font-extrabold">${post.betCard.stakes.opponents.toFixed(2)}</strong></div>
              <div className="font-extrabold text-amber-600 dark:text-amber-500 pt-1 border-t border-gray-200 dark:border-zinc-700">🏛️ Org. Escrow Tax (2% upon full hold): ${(post.betCard.totalPool * 0.02).toFixed(2)}</div>
            </div>

            {post.betCard.status === "OPEN" ? (
              onAcceptBet && (
                <button
                  onClick={() => onAcceptBet(post)}
                  className="w-full sm:w-auto py-2 px-5 bg-[#31a24c] hover:bg-[#2b8f41] text-white text-xs font-bold rounded-lg shadow-md transition-colors leading-none font-sans cursor-pointer shrink-0 active:scale-95"
                >
                  Match & Guarantee Spot
                </button>
              )
            ) : (
              <span className="w-full sm:w-auto text-center py-2 px-5 bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-zinc-650 text-xs font-bold rounded-lg cursor-not-allowed uppercase tracking-widest whitespace-nowrap">
                🔒 Matches Secured
              </span>
            )}
          </div>
        </div>
      )}

      {/* POST INTERACTIONS FOOTER PANEL */}
      <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-800 pt-3 relative select-none">
        
        {/* Like Reaction Button (With hover popover options) */}
        <div 
          className="flex-1 relative"
          onMouseEnter={handleLikeMouseEnter}
          onMouseLeave={handleLikeMouseLeave}
        >
          <button 
            onClick={toggleStandardLike}
            className={`w-full flex items-center justify-center gap-1.5 py-1.5 hover:bg-gray-150/40 dark:hover:bg-[#323334] rounded-lg text-xs font-bold transition-all transition-colors cursor-pointer ${reactionStyle.color}`}
          >
            <span className="text-sm select-none">{reactionStyle.emoji}</span>
            <span>{reactionStyle.label} ({post.likes})</span>
          </button>

          {/* Hover reaction panel (Wow, Love, Sad, Lol, Star) */}
          {showReactionSelector && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white dark:bg-zinc-850 rounded-full py-1.5 px-3 border border-gray-200 dark:border-zinc-700 flex items-center gap-3.5 z-50 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-250">
              {[
                { type: "wow", label: "Wow", emoji: "😮" },
                { type: "love", label: "Wow", emoji: "❤️" },
                { type: "sad", label: "Sad", emoji: "😢" },
                { type: "lol", label: "Haha", emoji: "😂" },
                { type: "star", label: "Star", emoji: "⭐" },
              ].map((react) => (
                <button
                  key={react.type}
                  onClick={() => selectReaction(react.type as any)}
                  className="hover:scale-130 transition-transform duration-200 cursor-pointer text-lg leading-none active:scale-95"
                  title={react.type}
                >
                  {react.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Instant Auto-Repost Button directly visible as one of the major actions */}
        <button 
          onClick={() => {
            onRepost(post);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 hover:bg-gray-150/40 dark:hover:bg-[#323334] rounded-lg text-xs font-bold text-gray-550 dark:text-gray-400 hover:text-cyan-500 transition-colors cursor-pointer active:scale-95 duration-200"
          title="Automatic Repost to profile feed"
        >
          <Share className="w-4 h-4 text-cyan-500" /> 
          <span>Repost</span>
        </button>

        {/* Comment trigger opens slide-up drawer on mobile and central overlay list */}
        <button 
          onClick={() => setCommentDrawerOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 hover:bg-gray-150/40 dark:hover:bg-[#323334] rounded-lg text-xs font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" /> 
          <span>Comment ({post.comments.length})</span>
        </button>

        {/* Share Button opens options modal */}
        <button 
          onClick={() => setShareModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 hover:bg-gray-150/40 dark:hover:bg-[#323334] rounded-lg text-xs font-bold text-gray-550 dark:text-gray-400 hover:text-blue-500 transition-all transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4" /> 
          <span>Share</span>
        </button>

        {/* Tagging button */}
        <button 
          onClick={onTag}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 hover:bg-gray-150/40 dark:hover:bg-[#323334] rounded-lg text-xs font-bold text-gray-550 dark:text-gray-400 hover:text-emerald-500 transition-all transition-colors cursor-pointer"
        >
          <UserCheck className="w-4 h-4" /> 
          <span>Tag</span>
        </button>

        {/* Save button */}
        <button 
          onClick={() => onSave('post', post.content, post.avatar)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 hover:bg-gray-150/40 dark:hover:bg-[#323334] rounded-lg text-xs font-bold text-gray-555 dark:text-gray-400 hover:text-amber-500 transition-all transition-colors cursor-pointer"
        >
          <Bookmark className="w-4 h-4" /> 
          <span>Save</span>
        </button>

      </div>

      {/* ========================================================= */}
      {/* 1. HIGH-FIDELITY CENTERED POPUP OVERLAY WINDOW FOR COMMENTS */}
      {/* ========================================================= */}
      {commentDrawerOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-150 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-205">
          
          {/* Main modal content card container */}
          <div className="w-full max-w-xl bg-white dark:bg-[#242526] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-left border border-gray-150 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
            
            {/* Header section identical to mock photo */}
            <div className="relative py-4 border-b border-gray-200 dark:border-zinc-800 text-center select-none bg-white dark:bg-[#242526] shrink-0">
              <h3 className="font-extrabold text-[16px] text-gray-900 dark:text-white font-sans">
                {post.repostOf ? `${post.repostOf.author}'s Post` : `${post.author}'s Post`}
              </h3>
              
              {/* White circle close icon in the top right */}
              <button 
                onClick={() => { setCommentDrawerOpen(false); setEditingCommentId(null); setNewCommentText(""); }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 rounded-full transition-colors cursor-pointer"
                title="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable inner viewport containing Post attachments and replies list */}
            <div className="flex-1 overflow-y-auto">
              
              {/* Deep Cinematic blue-slate letterbox wrapper for the core post image */}
              <div className="bg-[#05162e] dark:bg-[#030d1c] min-h-[300px] flex items-center justify-center relative overflow-hidden select-none border-b border-gray-100 dark:border-[#2f3031]">
                <img 
                  src={
                    post.author.includes("Bavian") || post.content.toLowerCase().includes("bavian") 
                    ? "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800"
                    : post.id === "p-fb-1" || post.content.includes("Chelsea")
                    ? "https://images.unsplash.com/photo-1540747737956-378724044432?auto=format&fit=crop&q=85&w=800" 
                    : post.id === "p-fb-2" || post.content.includes("Gor Mahia")
                    ? "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=85&w=800"
                    : post.id === "p-fb-3" || post.content.includes("Germany")
                    ? "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=85&w=800"
                    : "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=85&w=800" // Stadium fallback
                  } 
                  className="max-h-[380px] object-contain w-auto mx-auto" 
                  alt="Post preview context" 
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Text forecast / Match summary text overlay */}
              <div className="p-4 bg-gray-50/20 dark:bg-zinc-900/5 select-text border-b border-gray-100 dark:border-zinc-800">
                <p className="text-[13px] text-gray-800 dark:text-gray-200 leading-relaxed font-sans">{post.content}</p>
                {post.betCard && (
                  <div className="mt-3 bg-blue-50/50 dark:bg-blue-950/10 p-3 rounded-xl border border-blue-100/60 dark:border-blue-900/20 text-xs font-mono text-blue-800 dark:text-blue-300">
                    <div className="font-extrabold flex items-center justify-between">
                      <span>🏆 Active Peer Escrow</span>
                      <span className="text-[10px] bg-blue-500/10 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">{post.betCard.status}</span>
                    </div>
                    <div className="mt-1.5 space-y-0.5">
                      <div>Match target: {post.betCard.match}</div>
                      <div>Propose odds: {post.betCard.odds.toFixed(2)} | Target: {post.betCard.prediction}</div>
                      <div className="text-amber-600 font-extrabold">Total escrow pool: ${post.betCard.totalPool.toFixed(2)}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbs plus comments counter totals strip matching image */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-150 dark:border-zinc-800 select-none text-[12.5px] text-gray-500 dark:text-gray-400 font-sans">
                
                {/* Thumb icon bubble blue background */}
                <div className="flex items-center gap-1.5 font-semibold">
                  <span className="w-[19px] h-[19px] bg-[#1877f2] hover:bg-blue-600 rounded-full flex items-center justify-center p-0.5 shadow-xs transition-colors">
                    <ThumbsUp className="w-2.5 h-2.5 fill-white text-white" />
                  </span>
                  <span className="text-gray-850 dark:text-gray-200 font-extrabold">{post.likes}</span>
                </div>

                {/* Right label comments comments count */}
                <span className="font-semibold text-gray-650 dark:text-gray-350">{post.comments.length} comments</span>
              </div>

              {/* Interactive replies list */}
              <div className="p-5 space-y-4 max-h-[250px] overflow-y-auto">
                {post.comments.length === 0 ? (
                  <div className="py-10 text-center text-gray-400">
                    <MessageSquare className="w-8 h-8 text-gray-300 dark:text-zinc-700 mx-auto mb-2 animate-bounce" />
                    <p className="text-xs font-bold">Write a forecast comment below.</p>
                    <p className="text-[10px] text-gray-500 mt-1 max-w-[200px] mx-auto">Be the first to share your thoughts, predictions or banter.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {post.comments.map((comment) => {
                      const isMyComment = comment.author === currentUserProfile.name || comment.author.includes("(You)");
                      return (
                        <div key={comment.id || comment.content} className="flex gap-3 items-start group text-left">
                          
                          {/* Profile thumbnail */}
                          <img 
                            src={isMyComment ? currentUserProfile.avatar : "https://ui-avatars.com/api/?name=" + encodeURIComponent(comment.author) + "&background=eaeaea&color=333"} 
                            className="w-8 h-8 rounded-full border border-gray-150 shrink-0 mt-0.5" 
                            alt="replier-avatar" 
                            referrerPolicy="no-referrer"
                          />

                          {/* Bubble box */}
                          <div className="flex-1">
                            <div className="bg-gray-100 dark:bg-zinc-800/70 p-3 rounded-2xl border border-gray-150 dark:border-zinc-800 text-xs">
                              <div className="flex justify-between items-center mb-1 select-none">
                                <span className="font-extrabold text-gray-900 dark:text-gray-100">{comment.author}</span>
                                <span className="text-[9px] font-mono text-gray-400">{comment.time}</span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed break-words">{comment.content}</p>
                            </div>

                            {/* Self editable comment control row triggers */}
                            {isMyComment && (
                              <div className="flex gap-3 text-[10px] pl-2 mt-1 select-none font-bold text-gray-400 dark:text-zinc-550 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => startEditingComment(comment.id || "", comment.content)}
                                  className="hover:text-blue-500 flex items-center gap-0.5 cursor-pointer"
                                >
                                  <Edit3 className="w-2.5 h-2.5" />
                                  Edit
                                </button>
                                <button 
                                  onClick={() => deleteComment(comment.id || "")}
                                  className="hover:text-rose-500 flex items-center gap-0.5 cursor-pointer"
                                >
                                  <Trash2 className="w-2.5 h-2.5" />
                                  Delete
                                </button>
                              </div>
                            )}

                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Comment Writing & Editing Engine matching photo structure identically */}
            <form onSubmit={handlePostCommentSubmit} className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#242526] shrink-0">
              
              {/* Dynamic notification warning if editing comment */}
              {editingCommentId && (
                <div className="bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 mb-2.5 rounded-lg text-[10.5px] font-bold text-amber-600 dark:text-amber-400 flex items-center justify-between select-none">
                  <span>✏️ Editing Comment Mode</span>
                  <button 
                    type="button" 
                    onClick={() => { setEditingCommentId(null); setNewCommentText(""); }}
                    className="text-xs hover:underline uppercase text-[9px]"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <div className="flex items-start gap-2.5">
                
                {/* User avatar on the left */}
                <img 
                  src={currentUserProfile.avatar} 
                  className="w-9 h-9 rounded-full border border-gray-150 shrink-0 mt-0.5" 
                  alt="composer-avatar" 
                  referrerPolicy="no-referrer"
                />
                
                {/* Gray capsule container resembling the facebook input panel */}
                <div className="flex-1 bg-[#f0f2f5] dark:bg-[#3a3b3c] rounded-2xl p-3 border border-gray-100 dark:border-zinc-700 flex flex-col justify-between gap-2.5">
                  
                  {/* Actual comment input box field */}
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder={editingCommentId ? "Edit your comment content..." : `Comment as ${currentUserProfile.name.split(" ")[0]}`}
                    className="w-full bg-transparent border-none outline-hidden text-[12.5px] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 p-0 leading-normal"
                    required
                    autoFocus
                  />

                  {/* Icon strip of stickers and emoticons bar under comment field */}
                  <div className="flex items-center justify-between select-none">
                    
                    {/* Emoticon shortcut tray matching image */}
                    <div className="flex items-center gap-1.5">
                      {[
                        { symbol: "🥸", label: "sticker" },
                        { symbol: "😊", label: "smiley" },
                        { symbol: "📷", label: "camera" },
                        { symbol: "GIF", label: "gif" },
                        { symbol: "🎨", label: "sticker2" }
                      ].map((item, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            if (item.symbol === "GIF") {
                              setNewCommentText(p => p + " [GIF] ");
                            } else if (item.symbol === "📷") {
                              setNewCommentText(p => p + " [Photo Attachment] ");
                            } else {
                              setNewCommentText(p => p + item.symbol);
                            }
                          }}
                          className="hover:scale-120 hover:text-blue-500 transition-all text-[14px] cursor-pointer p-0.5 leading-none shrink-0"
                          title={item.label}
                        >
                          {item.symbol}
                        </button>
                      ))}
                    </div>

                    {/* Paper plane submit gray or blue active arrowhead on the right */}
                    <button
                      type="submit"
                      className={`p-1 bg-transparent border-none outline-hidden cursor-pointer transition-colors duration-200 shrink-0 ${
                        newCommentText.trim() ? "text-blue-600 hover:text-blue-700 hover:scale-110" : "text-gray-400 dark:text-zinc-650"
                      }`}
                      title="Send Comment"
                    >
                      <Send className="w-4 h-4 fill-current" />
                    </button>

                  </div>

                </div>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SHARE POST SYSTEM LEVEL PICKER MODAL */}
      {/* ======================================================== */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-150 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-[#242526] rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-left font-sans">
            
            {/* Header banner */}
            <div className="p-4 border-b border-gray-150 dark:border-zinc-800 flex items-center justify-between select-none bg-gray-50 dark:bg-zinc-900/40">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-500" />
                Inter-Stakers Sharing System
              </h3>
              <button 
                onClick={() => setShareModalOpen(false)}
                className="p-1 px-2.5 text-xs font-black bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-500 rounded-lg cursor-pointer-all"
              >
                Cancel
              </button>
            </div>

            <div className="p-5 space-y-5">
              
              {/* Repost Options area */}
              <div className="space-y-2">
                <span className="text-[10px] text-gray-400 font-mono font-black uppercase tracking-wider block mb-1">
                  Profile Sharing & Reposts
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* Share to Profile / Repost action */}
                  <button
                    onClick={() => {
                      onRepost(post);
                      setShareModalOpen(false);
                    }}
                    className="flex flex-col items-center justify-center p-4 bg-blue-50/60 dark:bg-blue-950/20 hover:bg-blue-100/75 dark:hover:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/30 rounded-2xl transition-all cursor-pointer group active:scale-95 text-center gap-1.5"
                  >
                    <Share className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="font-extrabold text-xs text-gray-800 dark:text-gray-200">Repost Message</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-normal">Republishes this message with your credentials block over it</span>
                  </button>

                  {/* Clone to Saved Items */}
                  <button
                    onClick={() => {
                      onSave('post', post.content, post.avatar);
                      setShareModalOpen(false);
                    }}
                    className="flex flex-col items-center justify-center p-4 bg-emerald-50/50 dark:bg-emerald-950/15 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/30 rounded-2xl transition-all cursor-pointer group active:scale-95 text-center gap-1.5"
                  >
                    <Bookmark className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                    <span className="font-extrabold text-xs text-gray-800 dark:text-gray-200">Save to Vault</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-normal">Saves this predicting code slip under your private drawer folder</span>
                  </button>

                </div>
              </div>

              {/* URL LINK COPIER BUTTON */}
              <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-zinc-800">
                <span className="text-[10px] text-gray-400 font-mono font-black uppercase tracking-wider block mb-1">
                  Copy direct sports link
                </span>

                <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#18191a] p-2.5 rounded-xl border border-gray-150 dark:border-zinc-800 relative">
                  <span className="text-xs font-mono text-gray-450 dark:text-gray-500 truncate flex-1">
                    https://lookupto.app/posts/{post.id}
                  </span>

                  <button
                    type="button"
                    onClick={copyPostLink}
                    className="p-1.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700 text-[#1877f2] font-semibold text-xs rounded-lg shadow-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95 shrink-0"
                    title="Copy URL link button with tooltip"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-500 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-gray-400" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* External platform quick shortcuts */}
              <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
                <span className="text-[10px] text-gray-400 font-mono font-black uppercase tracking-wider block">
                  Other Dispatch Options (socials)
                </span>

                <div className="flex justify-between gap-1 overflow-x-auto pb-1 select-none">
                  {[
                    { name: "WhatsApp", color: "bg-emerald-510 hover:bg-emerald-600 text-white", symbol: "💬" },
                    { name: "X / Twitter", color: "bg-black hover:bg-zinc-900 text-white", symbol: "𝕏" },
                    { name: "Messenger", color: "bg-blue-610 hover:bg-blue-710 text-white", symbol: "🔵" },
                    { name: "Telegram", color: "bg-sky-500 hover:bg-sky-600 text-white", symbol: "✈️" },
                    { name: "Email", color: "bg-gray-600 hover:bg-gray-700 text-white", symbol: "✉️" }
                  ].map((plat) => (
                    <button
                      key={plat.name}
                      onClick={() => {
                        alert(`Sharing to ${plat.name} via standard deep-linking client dispatch... Done!`);
                        setShareModalOpen(false);
                      }}
                      className={`${plat.color} px-3 py-1.5 text-[11px] rounded-lg font-black transition-all cursor-pointer flex items-center gap-1 shrink-0 active:scale-95`}
                    >
                      <span>{plat.symbol}</span>
                      <span>{plat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. HIGH-FIDELITY CENTERED POPUP OVERLAY WINDOW FOR PAID STARS */}
      {/* ======================================================== */}
      {starModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-250 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200 text-left">
          <div className="w-full max-w-sm bg-white dark:bg-[#242526] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden relative flex flex-col p-6 gap-4 text-left font-sans animate-in zoom-in-95 duration-200">
            
            {/* Header section identical to mock photo / beautiful overlay style */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-150 dark:border-zinc-800 select-none">
              <div>
                <h3 className="font-extrabold text-[15px] text-gray-900 dark:text-white">
                  Gift Stars to {post.repostOf ? post.repostOf.author : post.author}
                </h3>
                <p className="text-[10px] text-amber-500 font-mono font-black uppercase tracking-wider mt-0.5">⭐ Supported by Direct Sports Balance</p>
              </div>
              <button 
                onClick={() => setStarModalOpen(false)}
                className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-550 dark:text-gray-300 rounded-full transition-colors cursor-pointer"
                title="Cancel Stars transaction"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Generated Gorgeous Premium Stars banner */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-150 dark:border-zinc-850 shadow-inner select-none h-36 bg-gradient-to-br from-indigo-950 via-zinc-900 to-amber-955 flex flex-col justify-end p-3.5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.18),transparent_60%)]"></div>
              {/* Star graphics floating */}
              <div className="absolute top-3 right-4 text-3xl text-amber-400 opacity-60 animate-bounce duration-1000">⭐</div>
              <div className="absolute top-8 left-8 text-xl text-yellow-300 opacity-40 animate-pulse">⭐</div>
              <div className="absolute top-4 left-1/3 text-sm text-yellow-100 opacity-50">✨</div>
              <div className="absolute top-14 right-1/4 text-xs text-amber-200 opacity-30">✨</div>
              
              <div className="relative z-10">
                <span className="text-[9px] bg-amber-500 text-black font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest w-fit mb-1 shadow-sm block">Official Tokens</span>
                <p className="text-[11px] font-medium text-gray-200">Your current wallet credits support real star payouts.</p>
              </div>
            </div>

            {/* Balance container */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900/40 border border-gray-150 dark:border-zinc-800/85 rounded-xl select-none text-[12px]">
              <span className="font-bold text-gray-500 dark:text-gray-400">Your available wallet balance:</span>
              <span className="font-mono text-xs font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </span>
            </div>

            {/* Bundle selection grids */}
            <div className="space-y-1.5 text-left">
              <span className="text-[9px] text-gray-400 font-mono font-black uppercase tracking-wider block">
                Select Star Bundle Package
              </span>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { count: 10, price: 1.00, label: "Starter pack", color: "border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/10 text-sky-600 dark:text-sky-400" },
                  { count: 50, price: 5.00, label: "Medium gift (Popular)", color: "border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold" },
                  { count: 100, price: 10.00, label: "Elite support", color: "border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 text-purple-600 dark:text-purple-400" },
                  { count: 250, price: 25.00, label: "VIP Mega fan", color: "border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold" }
                ].map((bundle) => (
                  <button
                    key={bundle.count}
                    type="button"
                    onClick={() => setSelectedStarCount(bundle.count)}
                    className={`flex flex-col p-2.5 rounded-lg border text-left cursor-pointer transition-all active:scale-97 duration-150 relative ${
                      selectedStarCount === bundle.count 
                        ? "ring-2 ring-amber-500 border-amber-500 bg-amber-500/10 dark:bg-amber-500/15" 
                        : bundle.color
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[12px]">
                      <span>⭐</span>
                      <span className="font-black">{bundle.count} Stars</span>
                    </div>
                    <span className="text-[10px] font-mono leading-none mt-1 font-bold">${bundle.price.toFixed(2)} USD</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom slider parameterizer count */}
            <div className="space-y-1 pt-1.5 border-t border-gray-150 dark:border-zinc-800">
              <div className="flex justify-between items-center text-xs select-none">
                <span className="font-bold text-gray-500 dark:text-gray-400 text-[11px]">Custom count tracker:</span>
                <strong className="text-amber-500 font-mono font-black text-xs">⭐ {selectedStarCount} Stars = ${(selectedStarCount * 0.10).toFixed(2)}</strong>
              </div>
              
              <input 
                type="range"
                min="5"
                max="500"
                step="5"
                value={selectedStarCount}
                onChange={(e) => setSelectedStarCount(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[8px] font-mono text-gray-400">
                <span>Min: 5</span>
                <span>Max: 500 Stars ($50.00)</span>
              </div>
            </div>

            {/* Pay with wallet button */}
            <button
              onClick={() => {
                const requiredPrice = selectedStarCount * 0.10;
                if (walletBalance < requiredPrice) {
                  alert(`Insufficient balance! Your current wallet balance is $${walletBalance.toFixed(2)}, which is less than the $${requiredPrice.toFixed(2)} required for ${selectedStarCount} Stars. Please claim and deposit more sports stakes first via Wallet shortcuts!`);
                  return;
                }
                
                // Deduct credits
                if (onUpdateWallet) {
                  onUpdateWallet(-requiredPrice);
                }
                
                // Apply star reaction
                onLike(post.id, "star");
                triggerStarsBurst();
                setStarModalOpen(false);
                alert(`Transaction Complete! Successfully debited $${requiredPrice.toFixed(2)} from your wallet holding to gift ${selectedStarCount} Stars to ${post.repostOf ? post.repostOf.author : post.author}! ⭐`);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 hover:from-amber-600 to-yellow-500 hover:to-yellow-600 text-black text-xs font-black uppercase tracking-wider font-sans select-none flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-97 cursor-pointer duration-200"
            >
              <span>⭐</span>
              <span>Send {selectedStarCount} Stars (${(selectedStarCount * 0.10).toFixed(2)})</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
