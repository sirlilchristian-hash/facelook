import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  X, 
  Check, 
  Calendar, 
  Heart, 
  User, 
  MapPin, 
  Star, 
  Globe, 
  Link as LinkIcon, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  MoreHorizontal, 
  Briefcase, 
  Activity, 
  Video, 
  Image as ImageIcon, 
  Play, 
  Settings, 
  ChevronDown, 
  HelpCircle, 
  Shield, 
  Coins, 
  Award, 
  BookOpen, 
  Camera, 
  Newspaper,
  UserPlus,
  Share,
  MessageCircle,
  Eye,
  Trash2,
  Sliders,
  List,
  CheckCircle,
  FileText,
  Bookmark,
  Bell,
  SlidersHorizontal,
  FolderOpen,
  Sparkles
} from "lucide-react";

interface ProfileViewProps {
  walletBalance: number;
  onUpdateWallet: (amount: number) => void;
  triggerToast: (msg: string) => void;
  activeProfilePage?: string;
}

export default function ProfileView({
  walletBalance,
  onUpdateWallet,
  triggerToast,
  activeProfilePage
}: ProfileViewProps) {
  // Navigation states
  const [activeTab, setActiveTab] = useState<"all" | "about" | "reels" | "photos" | "followers" | "more">("followers");
  const [moreActiveSection, setMoreActiveSection] = useState<string | null>(null);
  
  // About tab secondary vertical navigation state
  const [aboutSubTab, setAboutSubTab] = useState<
    "intro" | "category" | "personal" | "details" | "links" | "communities" | 
    "services" | "offers" | "work" | "education" | "hobbies" | "interests" | "travel"
  >("intro");

  // Editable Profile details state
  const [pageName, setPageName] = useState("Baridi SANA");
  const [followersCount, setFollowersCount] = useState(451);
  const [followingCount, setFollowingCount] = useState(21);
  const [bioText, setBioText] = useState("Hour's News");
  const [categoryText, setCategoryText] = useState("Personal blog");
  
  // Dynamic sync of switched profile context
  useEffect(() => {
    if (activeProfilePage) {
      if (activeProfilePage === "Collins Dnego") {
        setPageName("Collins Dnego");
        setBioText("Elite LookUpto Bettor");
        setCategoryText("Personal Profile");
        setProfilePhoto("https://api.dicebear.com/7.x/avataaars/svg?seed=Collins&backgroundColor=1877f2");
        setFollowersCount(1209);
        setFollowingCount(483);
        setEditName("Collins Dnego");
        setEditBio("Elite LookUpto Bettor");
        setEditCategory("Personal Profile");
      } else if (activeProfilePage === "Zephaniah Mwangi") {
        setPageName("Zephaniah Mwangi");
        setBioText("Veteran Predictor Clan-Lead");
        setCategoryText("Clan Organizer");
        setProfilePhoto("https://api.dicebear.com/7.x/avataaars/svg?seed=Zephaniah&backgroundColor=a855f7");
        setFollowersCount(832);
        setFollowingCount(129);
        setEditName("Zephaniah Mwangi");
        setEditBio("Veteran Predictor Clan-Lead");
        setEditCategory("Clan Organizer");
      } else if (activeProfilePage === "Baridi SANA") {
        setPageName("Baridi SANA");
        setBioText("Hour's News");
        setCategoryText("Personal blog");
        setProfilePhoto("https://api.dicebear.com/7.x/avataaars/svg?seed=Baridi&backgroundColor=1877f2");
        setFollowersCount(451);
        setFollowingCount(21);
        setEditName("Baridi SANA");
        setEditBio("Hour's News");
        setEditCategory("Personal blog");
      } else if (activeProfilePage === "Collo Dnego") {
        setPageName("Collo Dnego");
        setBioText("Managed Fan Club Page");
        setCategoryText("Page Profile • Gaming Creator");
        setProfilePhoto("https://api.dicebear.com/7.x/avataaars/svg?seed=Collo&backgroundColor=059669");
        setFollowersCount(2540);
        setFollowingCount(84);
        setEditName("Collo Dnego");
        setEditBio("Managed Fan Club Page");
        setEditCategory("Page Profile • Gaming Creator");
      }
    }
  }, [activeProfilePage]);

  // Interactive editing modals / field inputs
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editName, setEditName] = useState(pageName);
  const [editBio, setEditBio] = useState(bioText);
  const [editCategory, setEditCategory] = useState(categoryText);

  // Cover & Profile images states
  const [coverPhoto, setCoverPhoto] = useState("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200");
  const [profilePhoto, setProfilePhoto] = useState("https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300");
  const [isEditingCoverUrl, setIsEditingCoverUrl] = useState(false);
  const [isEditingProfileUrl, setIsEditingProfileUrl] = useState(false);
  const [tempCoverUrl, setTempCoverUrl] = useState(coverPhoto);
  const [tempProfileUrl, setTempProfileUrl] = useState(profilePhoto);

  // Search filter inside followers
  const [followersSearchQuery, setFollowersSearchQuery] = useState("");
  // Followers Sub-Tab filter: "followers" | "following"
  const [followersSubTab, setFollowersSubTab] = useState<"followers" | "following">("followers");

  // Reels tab details
  const [reelsSubTab, setReelsSubTab] = useState<"yours" | "saved">("yours");
  
  // Photos tab details
  const [photosSubTab, setPhotosSubTab] = useState<"yours" | "albums">("yours");
  const [fullscreenPhoto, setFullscreenPhoto] = useState<string | null>(null);
  const [photosList, setPhotosList] = useState<Array<{ id: string; url: string; title: string }>>([
    { id: "p1", url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600", title: "Mashemeji Bigi Derby Trophy Match" },
    { id: "p2", url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600", title: "Local Football Champions Match" },
    { id: "p3", url: "https://images.unsplash.com/photo-1500305060288-0f6d4b83002b?q=80&w=600", title: "Syndicate Supporters Gathering" },
    { id: "p4", url: "https://images.unsplash.com/photo-1551972251-12cdb3485373?q=80&w=600", title: "Broadcasting Stadium View" },
    { id: "p5", url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600", title: "Syndicate Strategy Session with Partners" },
    { id: "p6", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600", title: "Analytical Ledger Match-day Setup" }
  ]);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoTitle, setNewPhotoTitle] = useState("");
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);

  // Manage sections state which can toggled in Photos dropdown
  const [selectedMoreTab, setSelectedMoreTab] = useState<string | null>(null);
  const [customFeedbackMsg, setCustomFeedbackMsg] = useState("");

  // Timeline posts state under "All" Tab
  const [whatsOnYourMindText, setWhatsOnYourMindText] = useState("");
  const [timelinePosts, setTimelinePosts] = useState<Array<{
    id: string;
    author: string;
    avatar: string;
    time: string;
    content: string;
    likes: number;
    hasLiked: boolean;
    comments: Array<{ author: string; content: string; time: string }>;
  }>>([
    {
      id: "post-tpl-1",
      author: "Baridi SANA",
      avatar: profilePhoto,
      time: "June 19 at 1:21 AM",
      content: "Somebody once said, 'We are not buying police uniforms... we are securing the collective peer-to-peer matched liability backing on facelook!' Getting into the Premier League Syndicate today, zero house edge allows us to look up to the highest margins! ⚽🔥",
      likes: 124,
      hasLiked: false,
      comments: [
        { author: "Erick Chelody", content: "Already backed you with $150 on the Asian handicap option!", time: "18 mins ago" },
        { author: "Hezz Jakoyugi", content: "Super clean layout, let's keep winning.", time: "12 mins ago" }
      ]
    },
    {
      id: "post-tpl-2",
      author: "Baridi SANA",
      avatar: profilePhoto,
      time: "June 15 at 4:32 PM",
      content: "The beautiful game is defined by calculated risks. Our platform ensures that stakers hold their own keys we have locked in 100% security reserves on lookupto.",
      likes: 83,
      hasLiked: true,
      comments: []
    }
  ]);

  // Ensure posts avatar is synchronized with editing
  useEffect(() => {
    setTimelinePosts(prev => prev.map(p => {
      if (p.author === "Baridi SANA") {
        return { ...p, avatar: profilePhoto };
      }
      return p;
    }));
  }, [profilePhoto]);

  // Followers list precisely match photo 2
  const [followers, setFollowers] = useState<Array<{
    id: string;
    name: string;
    role: string;
    avatar: string;
    isFollowing: boolean;
    location: string;
  }>>([
    { id: "f-1", name: "Erick Chelody", role: "Procurement Officer at Nairobi, Kenya", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Erick&backgroundColor=2563eb", isFollowing: true, location: "Nairobi, Kenya" },
    { id: "f-2", name: "Hezz Jakoyugi", role: "Nairobi, Kenya", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hezz&backgroundColor=dc2626", isFollowing: true, location: "Nairobi, Kenya" },
    { id: "f-3", name: "Ashôkâ Ïñçôginità AI", role: "Kisi, Kenya", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ashoka&backgroundColor=16a34a", isFollowing: false, location: "Kisi, Kenya" },
    { id: "f-4", name: "Nick Xavi", role: "Nairobi, Kenya", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nick&backgroundColor=ca8a04", isFollowing: true, location: "Nairobi, Kenya" },
    { id: "f-5", name: "Matrine Sakwa", role: "Active supporter / Matched enthusiast", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Matrine&backgroundColor=db2777", isFollowing: false, location: "Kakamega, Kenya" },
    { id: "f-6", name: "Shims M Aggrey", role: "Works at Nairobi, Kenya", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shims&backgroundColor=7c3aed", isFollowing: true, location: "Nairobi, Kenya" },
    { id: "f-7", name: "Sylas Mangeni", role: "Calculated Sports Analyst", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sylas&backgroundColor=0284c7", isFollowing: false, location: "Eldoret, Kenya" },
    { id: "f-8", name: "Samuel Werunga", role: "Hustler at Sky Packing Material Trd: LLC", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samuel&backgroundColor=059669", isFollowing: true, location: "Mombasa, Kenya" }
  ]);

  // Interactive Reels list match photo 4
  const [reels, setReels] = useState<Array<{
    id: string;
    videoUrl: string;
    coverImg: string;
    views: string;
    likesCount: number;
    title: string;
  }>>([
    { id: "r1", videoUrl: "", coverImg: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=300", views: "650", likesCount: 420, title: "Ligi Bigi Matchday Drama!" },
    { id: "r2", videoUrl: "", coverImg: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=300", views: "408", likesCount: 182, title: "How to hedge zero margin bets" },
    { id: "r3", videoUrl: "", coverImg: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=300", views: "35K", likesCount: 4120, title: "Mashemeji goals shootout!" },
    { id: "r4", videoUrl: "", coverImg: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300", views: "721", likesCount: 388, title: "Stadium Broadcasting Interview" },
    { id: "r5", videoUrl: "", coverImg: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=300", views: "277", likesCount: 110, title: "Ledger calculations tutorial" },
    { id: "r6", videoUrl: "", coverImg: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300", views: "263", likesCount: 95, title: "Locking liability funds safely" }
  ]);

  // Handle saving profile changes
  const saveProfileDetails = () => {
    if (!editName.trim()) {
      triggerToast("Name cannot be empty!");
      return;
    }
    setPageName(editName);
    setBioText(editBio);
    setCategoryText(editCategory);
    setIsEditingInfo(false);
    triggerToast("Profile page details updated successfully!");
  };

  // Handle uploading photos
  const handleAddNewPhoto = () => {
    if (!newPhotoUrl.trim()) {
      triggerToast("Please input a valid photo URL!");
      return;
    }
    const newP = {
      id: `p-${Date.now()}`,
      url: newPhotoUrl.trim(),
      title: newPhotoTitle.trim() || "Uploaded Photo"
    };
    setPhotosList([newP, ...photosList]);
    setNewPhotoUrl("");
    setNewPhotoTitle("");
    setShowAddPhotoModal(false);
    triggerToast("New photo added to albums successfully!");
  };

  // Follower toggle actions
  const toggleFollowFollower = (id: string, name: string) => {
    setFollowers(prev => prev.map(f => {
      if (f.id === id) {
        const nextState = !f.isFollowing;
        triggerToast(nextState ? `You are now following ${name}!` : `You unfollowed ${name}.`);
        if (nextState) {
          setFollowingCount(c => c + 1);
        } else {
          setFollowingCount(c => Math.max(0, c - 1));
        }
        return { ...f, isFollowing: nextState };
      }
      return f;
    }));
  };

  const handlePostSubmit = () => {
    if (!whatsOnYourMindText.trim()) {
      triggerToast("Post content cannot be empty!");
      return;
    }
    const newPostItem = {
      id: `post-${Date.now()}`,
      author: pageName,
      avatar: profilePhoto,
      time: "Just now",
      content: whatsOnYourMindText,
      likes: 0,
      hasLiked: false,
      comments: []
    };
    setTimelinePosts([newPostItem, ...timelinePosts]);
    setWhatsOnYourMindText("");
    triggerToast("Posted to timeline successfully!");
  };

  const handleLikePost = (id: string) => {
    setTimelinePosts(prev => prev.map(p => {
      if (p.id === id) {
        const liked = !p.hasLiked;
        return {
          ...p,
          hasLiked: liked,
          likes: liked ? p.likes + 1 : Math.max(0, p.likes - 1)
        };
      }
      return p;
    }));
  };

  const handleDeletePost = (id: string) => {
    setTimelinePosts(prev => prev.filter(p => p.id !== id));
    triggerToast("Post deleted from timeline.");
  };

  // Filtered followers
  const filteredFollowersList = followers.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(followersSearchQuery.toLowerCase()) || 
                          f.role.toLowerCase().includes(followersSearchQuery.toLowerCase());
    if (followersSubTab === "followers") {
      return matchesSearch;
    } else {
      // following are followed ones
      return matchesSearch && f.isFollowing;
    }
  });

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 font-sans">
      
      {/* LEFT SIDEBAR ("MANAGE PAGE" COL) */}
      <aside className="w-full lg:w-72 shrink-0 space-y-4">
        
        <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl shadow-sm border border-gray-150 dark:border-zinc-800 text-left">
          {/* Header Title */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
            <h2 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#1877f2]" />
              <span>Manage Page</span>
            </h2>
            <span className="text-[10px] px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-mono font-bold rounded-full">Pro</span>
          </div>

          {/* Profile Card shortcut */}
          <div className="flex items-center gap-3 py-4">
            <div className="relative shrink-0">
              <img 
                src={profilePhoto} 
                className="w-12 h-12 rounded-full border-2 border-[#1877f2] shadow-sm object-cover" 
                alt="Profile Avatar" 
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#242526] rounded-full" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-black text-sm text-gray-950 dark:text-white leading-tight truncate">{pageName}</h3>
              <p className="text-xs text-gray-400 font-medium truncate">{bioText}</p>
            </div>
          </div>

          {/* Nav List matches exactly what is on the left sidebar photo 1 */}
          <div className="space-y-1 pt-1">
            <button 
              onClick={() => {
                triggerToast("Opening Professional Dashboard: 104k Impressions tracked this season.");
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-black text-gray-700 dark:text-gray-300 hover:bg-[#1877f2]/10 hover:text-[#1877f2] dark:hover:bg-[#1877f2]/15 transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <span>Professional dashboard</span>
              </div>
              <span className="bg-red-500 text-white font-mono text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black">1</span>
            </button>

            <button 
              onClick={() => triggerToast("Opening Page Insights: Growth in Kenya staker cohorts up 18.2%.")}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-extrabold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-805 transition-all text-left"
            >
              <div className="p-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
                <Award className="w-3.5 h-3.5" />
              </div>
              <span>Insights</span>
            </button>

            <button 
              onClick={() => triggerToast("Direct Match Planner and Scheduler loaded.")}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-extrabold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-805 transition-all text-left"
            >
              <div className="p-1.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-lg">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span>Planner</span>
            </button>

            <button 
              onClick={() => triggerToast("Awaiting ledger settlement for zero-juice monetization eligibility.")}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-extrabold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-805 transition-all text-left"
            >
              <div className="p-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Coins className="w-3.5 h-3.5" />
              </div>
              <span>Monetization</span>
            </button>

            <button 
              onClick={() => triggerToast("Ad Center options loaded. Launch target campaigns.")}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-extrabold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-805 transition-all text-left"
            >
              <div className="p-1.5 bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-lg">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <span>Ad Center</span>
            </button>

            <button 
              onClick={() => triggerToast("Create targeted campaigns to increase match volume.")}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-extrabold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-805 transition-all text-left"
            >
              <div className="p-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <span>Create ads</span>
            </button>

            <button 
              onClick={() => triggerToast("Linking Instagram account to syndicate feed.")}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-extrabold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-805 transition-all text-left"
            >
              <div className="p-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg">
                <Share className="w-3.5 h-3.5" />
              </div>
              <span>Boost Instagram post</span>
            </button>

            <button 
              onClick={() => setIsEditingInfo(true)}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-extrabold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-805 transition-all text-left"
            >
              <div className="p-1.5 bg-zinc-500/10 text-gray-600 dark:text-gray-400 rounded-lg">
                <Settings className="w-3.5 h-3.5" />
              </div>
              <span>Settings</span>
            </button>
          </div>

          {/* More Tools collapsible exactly as shown in photo 2 */}
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800 space-y-2">
            <span className="block text-[10px] font-mono font-black uppercase text-gray-400 tracking-wider">More Tools</span>
            <div className="grid grid-cols-2 gap-2 text-[10.5px]">
              <button 
                onClick={() => triggerToast("Verification portal loaded.")}
                className="p-2 bg-gray-50 hover:bg-blue-500/5 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 rounded-xl text-left border border-gray-150 dark:border-zinc-800/80 font-bold"
              >
                ✓ Meta Verified
              </button>
              <button 
                onClick={() => triggerToast("CRM Leads workspace open.")}
                className="p-2 bg-gray-50 hover:bg-blue-500/5 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 rounded-xl text-left border border-gray-150 dark:border-zinc-800/80 font-bold"
              >
                👥 Leads Center
              </button>
              <button 
                onClick={() => triggerToast("Meta Business Manager workspace open.")}
                className="p-2 bg-gray-50 hover:bg-blue-500/5 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 rounded-xl text-left border border-gray-150 dark:border-zinc-800/80 font-bold"
              >
                ⊞ Meta Suite
              </button>
              <button 
                onClick={() => triggerToast("Manus AI analytics dashboard loaded.")}
                className="p-2 bg-gray-50 hover:bg-blue-500/5 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 rounded-xl text-left border border-gray-150 dark:border-zinc-800/80 font-bold"
              >
                🗲 Manus AI
              </button>
            </div>
          </div>

          <button 
            onClick={() => triggerToast("Opening Advertising setup to promote Baridi SANA syndicate.")}
            className="w-full mt-5 py-2.5 bg-[#1877f2] hover:bg-blue-600 text-white rounded-xl text-xs font-black shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Share className="w-3.5 h-3.5 text-white fill-white" />
            <span>Advertise</span>
          </button>

        </div>

      </aside>

      {/* RIGHT MAIN WORKSPACE PANELS */}
      <div className="flex-1 space-y-6">
        
        {/* PROFILE HEADER: COVER + AVATAR CARD */}
        <div className="bg-white dark:bg-[#242526] rounded-3xl shadow-sm border border-gray-150 dark:border-zinc-800 overflow-hidden text-left relative">
          
          {/* Cover Photo */}
          <div className="h-48 md:h-64 bg-gray-200 relative group overflow-hidden">
            <img 
              src={coverPhoto} 
              className="w-full h-full object-cover" 
              alt="Cover Image" 
            />
            
            {/* Cover photo editing button overlay */}
            <button 
              onClick={() => {
                setTempCoverUrl(coverPhoto);
                setIsEditingCoverUrl(true);
              }}
              className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/85 backdrop-blur-xs text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-white" />
              <span>Edit cover photo</span>
            </button>
          </div>

          {/* Avatar and Row overlap */}
          <div className="px-6 pb-6 pt-3 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between md:gap-6 -mt-16 sm:-mt-24 mb-4">
              
              {/* Profile Avatar overlaps cover */}
              <div className="relative shrink-0 mb-4 md:mb-0">
                <div className="w-28 sm:w-36 h-28 sm:h-36 rounded-full border-4 border-white dark:border-[#242526] shadow-xl overflow-hidden bg-gray-100">
                  <img src={profilePhoto} className="w-full h-full object-cover" alt="Profile" />
                </div>
                <button 
                  onClick={() => {
                    setTempProfileUrl(profilePhoto);
                    setIsEditingProfileUrl(true);
                  }}
                  className="absolute bottom-2 right-2 p-2 bg-gray-150 hover:bg-gray-250 dark:bg-[#3e4042] dark:hover:bg-[#4e5052] rounded-full border border-gray-300 dark:border-zinc-600 shadow transition-all cursor-pointer"
                  title="Change profile avatar"
                >
                  <Camera className="w-4.5 h-4.5 text-gray-700 dark:text-gray-200" />
                </button>
              </div>

              {/* Page Titles details */}
              <div className="flex-1 text-center md:text-left space-y-1 py-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white flex items-center justify-center md:justify-start gap-1.5 leading-none">
                  <span>{pageName}</span>
                  <CheckCircle className="w-5 h-5 text-blue-500 fill-blue-500/10" />
                </h1>
                
                {/* Followers clickable to toggle followers list */}
                <div 
                  onClick={() => setActiveTab("followers")}
                  className="text-xs text-gray-500 font-medium hover:underline cursor-pointer flex justify-center md:justify-start gap-2 flex-wrap items-center mt-1"
                >
                  <span className="font-extrabold text-gray-800 dark:text-white">{followersCount.toLocaleString()} followers</span>
                  <span className="text-gray-350">•</span>
                  <span className="font-extrabold text-gray-800 dark:text-white">{followingCount.toLocaleString()} following</span>
                </div>

                {/* Sub titles metadata */}
                <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap text-xs text-gray-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Newspaper className="w-3.5 h-3.5 text-blue-500" />
                    <span>{bioText}</span>
                  </span>
                  <span className="text-gray-305">•</span>
                  <span className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{categoryText}</span>
                  </span>
                </div>
              </div>

              {/* Right Side Call to Actions */}
              <div className="flex items-center gap-2 mt-4 md:mt-0 shrink-0">
                <button 
                  onClick={() => triggerToast("Launching professional performance analytics dashboard.")}
                  className="px-4 py-2 bg-[#1877f2] hover:bg-blue-600 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center gap-1 cursor-pointer leading-none"
                >
                  <Activity className="w-3.5 h-3.5 text-white" />
                  <span>Professional dashboard</span>
                </button>
                
                <button 
                  onClick={() => setIsEditingInfo(true)}
                  className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-800 dark:text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-transparent hover:border-gray-305 dark:hover:border-zinc-700"
                >
                  Edit
                </button>

                <button 
                  onClick={() => triggerToast("Meta Sponsored placement setup loaded.")}
                  className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-800 dark:text-white rounded-xl transition-all cursor-pointer"
                  title="Promote / Advertise page"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* TAB MENU ROW EXACTLY MATCH PHOTOS */}
            <div className="flex items-center justify-between border-t border-gray-150 dark:border-zinc-800 pt-2 mt-4 flex-wrap gap-2">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none min-w-0">
                
                {[
                  { id: "all", label: "All" },
                  { id: "about", label: "About" },
                  { id: "reels", label: "Reels" },
                  { id: "photos", label: "Photos" },
                  { id: "followers", label: "Followers" }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTab(t.id as any);
                      setMoreActiveSection(null);
                      setSelectedMoreTab(null);
                    }}
                    className={`px-4 py-2.5 text-xs font-black rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === t.id && !selectedMoreTab
                        ? "bg-[#1877f2]/10 text-[#1877f2]" 
                        : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-805"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}

                {/* MORE DROPDOWN Exactly match Photo 1 */}
                <div className="relative group">
                  <button
                    className={`px-4 py-2.5 text-xs font-black rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      selectedMoreTab ? "bg-[#1877f2]/10 text-[#1877f2]" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-805"
                    }`}
                  >
                    <span>More</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  <div className="absolute left-0 mt-1 w-48 bg-white dark:bg-[#242526] border border-gray-150 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden py-1.5 hidden group-hover:block hover:block z-50 animate-in fade-in zoom-in-95 duration-100">
                    {[
                      { item: "mentions", label: "Mentions" },
                      { item: "reviews", label: "Reviews" },
                      { item: "live", label: "Live" },
                      { item: "groups", label: "Groups" },
                      { item: "events", label: "Events" },
                      { item: "check-ins", label: "Check-ins" },
                      { item: "reviews-given", label: "Reviews given" },
                      { item: "manage-sections", label: "Manage sections" }
                    ].map(sect => (
                      <button
                        key={sect.item}
                        onClick={() => {
                          setSelectedMoreTab(sect.label);
                          triggerToast(`Switched into section placeholder: ${sect.label}`);
                        }}
                        className="w-full text-left px-4 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-105 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        {sect.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
              
              {/* Ellipsis more operations */}
              <button 
                onClick={() => triggerToast("Opening Advanced Page Settings Escrow Profile Controls.")}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-150 dark:hover:bg-zinc-800 rounded-xl transition-all cursor-pointer"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

          </div>

        </div>

        {/* CONDITIONALLY RENDER LOWER WORKSPACES BASED ON HORIZONTAL TABS */}
        
        {/* TAB 1: FOLLOWERS VIEW (Photo 2 matches) */}
        {activeTab === "followers" && !selectedMoreTab && (
          <div className="bg-white dark:bg-[#242526] rounded-3xl p-6 shadow-sm border border-gray-150 dark:border-zinc-800 space-y-6 text-left">
            
            {/* Header filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-150 dark:border-zinc-800">
              <div>
                <h2 className="text-md font-black text-gray-950 dark:text-white uppercase tracking-wide">Followers</h2>
                <p className="text-xs text-gray-400">Manage connections and direct partners</p>
              </div>

              {/* Sub-tabs: Followers / Following */}
              <div className="flex bg-gray-50 dark:bg-zinc-900 p-1.5 rounded-xl border border-gray-150 dark:border-zinc-800/80 gap-1.5 self-start sm:self-auto text-xs font-extrabold text-gray-500">
                <button
                  onClick={() => setFollowersSubTab("followers")}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    followersSubTab === "followers" 
                      ? "bg-white dark:bg-zinc-800 text-[#1877f2] shadow-sm font-black" 
                      : "hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Followers
                </button>
                <button
                  onClick={() => setFollowersSubTab("following")}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    followersSubTab === "following" 
                      ? "bg-white dark:bg-zinc-800 text-[#1877f2] shadow-sm font-black" 
                      : "hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Following
                </button>
              </div>
            </div>

            {/* Live Search and Friends actions box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 flex bg-gray-50 dark:bg-[#18191a] border border-gray-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 items-center gap-2 overflow-hidden focus-within:ring-1 focus-within:ring-[#1877f2]">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input 
                  type="text" 
                  value={followersSearchQuery}
                  onChange={(e) => setFollowersSearchQuery(e.target.value)}
                  placeholder="Search followers..."
                  className="bg-transparent border-none text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none w-full"
                />
                {followersSearchQuery && (
                  <button onClick={() => setFollowersSearchQuery("")} className="text-gray-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button 
                onClick={() => triggerToast("Invitation link copied! Share to invite partners to lookupto.")}
                className="py-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/35 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer border border-blue-200/50 dark:border-blue-900/40"
              >
                <UserPlus className="w-4 h-4 text-[#1877f2]" />
                <span>Invite friends</span>
              </button>
            </div>

            {/* Followers Cards Grid list matching photo 2 */}
            {filteredFollowersList.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-400 italic">
                No matching followers in this folder. Try searching another term!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFollowersList.map((f) => (
                  <div 
                    key={f.id}
                    className="p-4 bg-gray-55/40 dark:bg-[#1c1d1e]/50 border border-gray-150 dark:border-zinc-800/80 rounded-2xl flex items-center justify-between hover:border-gray-250 dark:hover:border-zinc-700 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={f.avatar} className="w-12 h-12 rounded-full border border-gray-200 shadow-sm object-cover" alt={f.name} />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1c1d1e]" />
                      </div>
                      <div className="text-left font-sans leading-relaxed">
                        <h4 className="text-xs font-black text-gray-950 dark:text-white">{f.name}</h4>
                        <p className="text-[10.5px] text-gray-500 font-medium leading-tight max-w-[180px] truncate">{f.role}</p>
                        <span className="text-[9px] font-mono text-gray-400">{f.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 text-right shrink-0">
                      <button 
                        onClick={() => toggleFollowFollower(f.id, f.name)}
                        className={`px-3 py-1.5 rounded-lg text-[10.5px] font-black transition-all cursor-pointer ${
                          f.isFollowing 
                            ? "bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-250" 
                            : "bg-[#1877f2] hover:bg-blue-600 text-white"
                        }`}
                      >
                        {f.isFollowing ? "Unfollow" : "Follow"}
                      </button>
                      <button
                        onClick={() => {
                          triggerToast(`Challenging "${f.name}" to lookupto 1v1 peer trade...`);
                        }}
                        className="text-[9px] text-blue-500 hover:underline font-mono font-bold uppercase mt-1 cursor-pointer"
                      >
                        ⚔️ Challenge 1v1
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: PHOTOS VIEW (Photo 3 matches) */}
        {activeTab === "photos" && !selectedMoreTab && (
          <div className="bg-white dark:bg-[#242526] rounded-3xl p-6 shadow-sm border border-gray-150 dark:border-zinc-800 space-y-6 text-left">
            
            {/* Title / Actions row */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-150 dark:border-zinc-800 flex-wrap gap-2">
              <div>
                <h2 className="text-md font-black text-gray-950 dark:text-white uppercase tracking-wide">Photos</h2>
                <p className="text-xs text-gray-400">Broadcasting media albums setup</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddPhotoModal(true)}
                  className="px-3 py-1.5 bg-[#1877f2] hover:bg-blue-600 text-white text-xs font-black rounded-lg transition-all cursor-pointer shadow-xs leading-none"
                >
                  Add photos/video
                </button>
                <button 
                  onClick={() => triggerToast("Opening albums management workflow.")}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-all"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sub-tabs: Your Photos / Albums */}
            <div className="flex bg-gray-50 dark:bg-zinc-900 p-1 rounded-xl border border-gray-150 dark:border-zinc-800/80 gap-1 text-xs font-extrabold max-w-xs text-gray-500">
              <button
                onClick={() => setPhotosSubTab("yours")}
                className={`flex-1 py-1 px-3 rounded-lg text-center cursor-pointer transition-colors ${
                  photosSubTab === "yours" 
                    ? "bg-white dark:bg-zinc-800 text-[#1877f2] shadow-sm font-black" 
                    : "hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Your photos
              </button>
              <button
                onClick={() => setPhotosSubTab("albums")}
                className={`flex-1 py-1 px-3 rounded-lg text-center cursor-pointer transition-colors ${
                  photosSubTab === "albums" 
                    ? "bg-white dark:bg-zinc-800 text-[#1877f2] shadow-sm font-black" 
                    : "hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Albums
              </button>
            </div>

            {/* Grid layout matches Photo 3 */}
            {photosSubTab === "yours" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
                {photosList.map((ph) => (
                  <div 
                    key={ph.id}
                    className="group relative h-40 md:h-44 rounded-2xl overflow-hidden border border-gray-150 dark:border-zinc-800/80 cursor-pointer shadow-xs bg-gray-100"
                  >
                    <img 
                      src={ph.url} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      onClick={() => setFullscreenPhoto(ph.url)}
                      alt="Album Slide" 
                    />
                    
                    {/* Pencil Edit design overlay */}
                    <button 
                      onClick={() => {
                        triggerToast(`Edited description properties of photo "${ph.title}"`);
                      }}
                      className="absolute top-2.5 right-2.5 p-1.5 bg-black/60 hover:bg-black/85 text-white rounded-full transition-all opacity-80 group-hover:opacity-100 cursor-pointer"
                      title="Edit Photo Details"
                    >
                      <Settings className="w-3.5 h-3.5 text-white" />
                    </button>

                    {/* Photo title display overlay on hover */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-left translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <p className="text-[10px] text-white font-extrabold truncate">{ph.title}</p>
                    </div>
                  </div>
                ))}

                {/* Simulated Custom item representing 'B' photo logo as shown in screenshot */}
                <div className="group relative h-40 md:h-44 rounded-2xl overflow-hidden border border-blue-200/50 dark:border-zinc-800 bg-teal-500/10 flex items-center justify-center cursor-pointer">
                  <div className="text-center space-y-1">
                    <span className="block text-4xl font-extrabold text-teal-600">B</span>
                    <span className="block text-[8px] font-mono tracking-widest text-[#1877f2] font-bold">BARIDI BROADCAST</span>
                  </div>
                  <button 
                    onClick={() => triggerToast("Viewing Baridi SANA brand emblem.")}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-black/60 hover:bg-black/85 text-white rounded-full cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            ) : (
              // ALBUMS
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div 
                  onClick={() => triggerToast("Opening 'Soccer Matchday Media' Album with 14 items.")}
                  className="p-3 bg-gray-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl text-center space-y-2 cursor-pointer hover:border-[#1877f2]/50 transition-all"
                >
                  <div className="h-32 bg-gray-200 rounded-2xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=200" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-gray-950 dark:text-white">Derby Coverage</h4>
                    <span className="text-[10px] text-gray-400">12 items • Modified 1 day ago</span>
                  </div>
                </div>

                <div 
                  onClick={() => triggerToast("Opening 'My Pinned Clips' Album with 8 items.")}
                  className="p-3 bg-gray-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl text-center space-y-2 cursor-pointer hover:border-[#1877f2]/50 transition-all"
                >
                  <div className="h-32 bg-gray-200 rounded-2xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=200" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-gray-950 dark:text-white">Syndicate Milestones</h4>
                    <span className="text-[10px] text-gray-400">4 items • Modified June 15</span>
                  </div>
                </div>

                {/* Create Album Placeholder */}
                <div 
                  onClick={() => triggerToast("Album production is connected on Manus suite.")}
                  className="p-3 bg-blue-500/5 hover:bg-blue-500/10 border-2 border-dashed border-blue-500/15 rounded-3xl flex flex-col items-center justify-center text-center p-6 h-full cursor-pointer transition-all"
                >
                  <FolderOpen className="w-8 h-8 text-[#1877f2] mb-2" />
                  <span className="text-xs font-black text-[#1877f2] uppercase tracking-wide">Create Album</span>
                  <span className="text-[9px] text-gray-400">Organize workspace media assets</span>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: REELS VIEW (Photo 4 matches) */}
        {activeTab === "reels" && !selectedMoreTab && (
          <div className="bg-white dark:bg-[#242526] rounded-3xl p-6 shadow-sm border border-gray-150 dark:border-zinc-800 space-y-6 text-left font-sans">
            
            {/* Header / Actions row */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-150 dark:border-zinc-800 flex-wrap gap-2">
              <div>
                <h2 className="text-md font-black text-gray-950 dark:text-white uppercase tracking-wide">Reels</h2>
                <p className="text-xs text-gray-400">Short broadcast video snippets</p>
              </div>

              <button
                onClick={() => triggerToast("Video uploader connected to Manus media pipeline.")}
                className="px-4 py-2 bg-[#1877f2] hover:bg-blue-600 text-white text-xs font-black rounded-lg transition-all cursor-pointer shadow-xs leading-none"
              >
                Create reel
              </button>
            </div>

            {/* Sub menu */}
            <div className="flex bg-gray-50 dark:bg-zinc-900 p-1 rounded-xl border border-gray-150 dark:border-zinc-800/80 gap-1 text-xs font-extrabold max-w-xs text-gray-500">
              <button
                onClick={() => setReelsSubTab("yours")}
                className={`flex-1 py-1 px-3 rounded-lg text-center cursor-pointer transition-colors ${
                  reelsSubTab === "yours" 
                    ? "bg-white dark:bg-zinc-800 text-[#1877f2] shadow-sm font-black" 
                    : "hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Your Reels
              </button>
              <button
                onClick={() => setReelsSubTab("saved")}
                className={`flex-1 py-1 px-3 rounded-lg text-center cursor-pointer transition-colors ${
                  reelsSubTab === "saved" 
                    ? "bg-white dark:bg-zinc-800 text-[#1877f2] shadow-sm font-black" 
                    : "hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Saved reels
              </button>
            </div>

            {/* Grid matching Photo 4 views */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              {reels.map((rl) => (
                <div 
                  key={rl.id}
                  onClick={() => triggerToast(`Simulating active playback on reel "${rl.title}" (Views: ${rl.views})`)}
                  className="group relative h-48 rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 cursor-pointer shadow-xs bg-gray-100"
                >
                  <img src={rl.coverImg} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt="Reel layout" />
                  
                  {/* View count indicator precisely on bottom right/left as in photo 4 */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-2 flex items-center gap-1">
                    <Play className="w-3 h-3 text-white fill-white shrink-0" />
                    <span className="text-[10px] text-white font-mono font-black">{rl.views} views</span>
                  </div>

                  {/* Play circle emblem overlay on hover */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <div className="p-2.5 bg-white/20 backdrop-blur-xs rounded-full">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 4: ABOUT VIEW (Photo 5 matches) */}
        {activeTab === "about" && !selectedMoreTab && (
          <div className="bg-white dark:bg-[#242526] rounded-3xl p-6 shadow-sm border border-gray-150 dark:border-zinc-800 space-y-6 text-left font-sans">
            
            <div className="pb-3 border-b border-gray-150 dark:border-zinc-800">
              <h2 className="text-md font-black text-gray-950 dark:text-white uppercase tracking-wide">About Page</h2>
              <p className="text-xs text-gray-400">Configure page taxonomy and metadata variables</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              
              {/* About Vertical Sub-navigation Menu (Matching photo 5 layout) */}
              <div className="w-full md:w-56 shrink-0 flex flex-col border-r border-gray-100 dark:border-zinc-800 pr-0 md:pr-4 space-y-1">
                {[
                  { id: "intro", label: "Intro" },
                  { id: "category", label: "Category" },
                  { id: "personal", label: "Personal details" },
                  { id: "details", label: "Details" },
                  { id: "links", label: "Links" },
                  { id: "communities", label: "Communities" },
                  { id: "services", label: "Services" },
                  { id: "offers", label: "Offers" },
                  { id: "work", label: "Work" },
                  { id: "education", label: "Education" },
                  { id: "hobbies", label: "Hobbies" },
                  { id: "interests", label: "Interests" },
                  { id: "travel", label: "Travel" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAboutSubTab(item.id as any)}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      aboutSubTab === item.id
                        ? "bg-[#1877f2]/10 text-[#1877f2]"
                        : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-805"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Right Side panel detail values matches photo 5 right box */}
              <div className="flex-1 space-y-4">
                
                {aboutSubTab === "intro" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-widest">Bio details</h4>
                        <button onClick={() => setIsEditingInfo(true)} className="p-1 text-blue-500 hover:underline text-xs font-bold cursor-pointer">Edit</button>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Newspaper className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-xs text-gray-800 dark:text-gray-150">{bioText}</strong>
                          <span className="text-[10px] text-gray-400">Current active Category</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-widest">Pinned details</h4>
                        <button onClick={() => setIsEditingInfo(true)} className="p-1 text-blue-500 hover:underline text-xs font-bold cursor-pointer">Edit</button>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <BookOpen className="w-4 h-4 text-[#1877f2] shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-xs text-gray-800 dark:text-gray-150">{categoryText}</strong>
                          <span className="text-[10px] text-gray-400">Pinned page template</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {aboutSubTab === "category" && (
                  <div className="p-4 bg-gray-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl space-y-3">
                    <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Page Categories</h3>
                    <p className="text-[11px] text-gray-500">Classifying your page assists users in search indexes.</p>
                    <div className="flex gap-2 flex-wrap pt-2">
                      {["Personal blog", "Hour's News", "Betting Syndicate", "Sports Journalist"].map(cat => (
                        <button
                          key={cat}
                          onClick={() => {
                            setCategoryText(cat);
                            triggerToast(`Category switched to "${cat}" successfully!`);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            categoryText === cat 
                              ? "bg-blue-600 text-white" 
                              : "bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-250 hover:bg-gray-50"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {aboutSubTab === "personal" && (
                  <div className="p-4 bg-gray-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl space-y-3">
                    <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Personal page specifics</h3>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between p-2 bg-white dark:bg-zinc-805 rounded-xl">
                        <span className="text-gray-400 col-span-1">Birth Date / Created:</span>
                        <strong className="text-gray-850 dark:text-white font-mono">December 12</strong>
                      </div>
                      <div className="flex justify-between p-2 bg-white dark:bg-zinc-805 rounded-xl">
                        <span className="text-gray-400">Civilian Relationship:</span>
                        <strong className="text-gray-850 dark:text-white">Widowed</strong>
                      </div>
                      <div className="flex justify-between p-2 bg-white dark:bg-zinc-805 rounded-xl">
                        <span className="text-gray-400">Pronoun indicators:</span>
                        <strong className="text-gray-850 dark:text-white font-mono">him</strong>
                      </div>
                    </div>
                  </div>
                )}

                {aboutSubTab === "details" && (
                  <div className="p-4 bg-gray-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl space-y-3">
                    <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Location & Ratings details</h3>
                    <div className="space-y-3.5 text-xs">
                      <div className="flex items-center gap-2.5">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                        <div>
                          <strong className="block">Not yet rated (0 Reviews)</strong>
                          <span className="text-[10px] text-gray-400">Needs 5 reviews from certified matchers</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <div>
                          <strong className="block">Thika, Thika, Kenya</strong>
                          <span className="text-[10px] text-gray-400">Active syndicate headquarters</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {["links", "communities", "services", "offers", "work", "education", "hobbies", "interests", "travel"].includes(aboutSubTab) && (
                  <div className="p-6 bg-gray-50 dark:bg-zinc-900 border-2 border-dashed border-gray-150 dark:border-zinc-800 rounded-2xl text-center space-y-2">
                    <Shield className="w-8 h-8 text-blue-500 mx-auto opacity-75" />
                    <h3 className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-wider">{aboutSubTab.toUpperCase()} LEDGER CONFIG</h3>
                    <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
                      Your configuration is locked with on-chain protocol keys matching page "Baridi SANA". Tap "Edit" at the header to adjust variables.
                    </p>
                    <button 
                      onClick={() => triggerToast(`Proposing upgrade on '${aboutSubTab}' details.`)}
                      className="mt-2 px-3 py-1 bg-[#1877f2] hover:bg-blue-600 text-white text-[10.5px] font-bold rounded-lg transition-all"
                    >
                      Propose update
                    </button>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* TAB 5: ALL (TIMELINE & POSTS - Photo 6 matches) */}
        {activeTab === "all" && !selectedMoreTab && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            
            {/* Left Column (Metadata details boxes matching photo 6) */}
            <div className="md:col-span-1 space-y-4 text-left">
              
              {/* Personal Details Card */}
              <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl border border-gray-150 dark:border-zinc-800 space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="font-extrabold text-xs text-gray-900 dark:text-white uppercase tracking-wider">Personal details</h3>
                  <button onClick={() => triggerToast("Edit Personal details locked with cert codes.")} className="text-[10.5px] font-bold text-blue-500 hover:underline">Edit</button>
                </div>
                
                <div className="space-y-3 text-xs text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>December 12</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-red-500 shrink-0" />
                    <span>Widowed <span className="text-[9.5px] text-gray-400">(I recommend several wifes)</span></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-mono">him</span>
                  </div>
                </div>
              </div>

              {/* Details Card */}
              <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl border border-gray-150 dark:border-zinc-800 space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="font-extrabold text-xs text-gray-900 dark:text-white uppercase tracking-wider">Details</h3>
                  <button onClick={() => triggerToast("Edit Details locked with cert codes.")} className="text-[10.5px] font-bold text-blue-500 hover:underline">Edit</button>
                </div>
                
                <div className="space-y-3 text-xs text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2.5">
                    <Star className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Not yet rated (0 Reviews)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="font-mono text-[11px]">Thika, Thika, Kenya</span>
                  </div>
                </div>
              </div>

              {/* Links Card */}
              <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl border border-gray-150 dark:border-zinc-800 space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="font-extrabold text-xs text-gray-900 dark:text-white uppercase tracking-wider">Links</h3>
                  <button onClick={() => triggerToast("Edit Links locked with cert codes.")} className="text-[10.5px] font-bold text-blue-500 hover:underline">Edit</button>
                </div>
                
                <div className="space-y-3 text-xs text-[#1877f2]">
                  <a href="https://tuko.co.ke" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 hover:underline">
                    <LinkIcon className="w-4 h-4 text-[#1877f2] shrink-0" />
                    <span className="font-mono text-[11px]">tuko.co.ke</span>
                  </a>
                </div>
              </div>

              {/* Contact info */}
              <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl border border-gray-150 dark:border-zinc-800 space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="font-extrabold text-xs text-gray-900 dark:text-white uppercase tracking-wider">Contact info</h3>
                  <button onClick={() => triggerToast("Edit Contact Info locked with cert codes.")} className="text-[10.5px] font-bold text-blue-500 hover:underline">Edit</button>
                </div>
                
                <div className="space-y-3 text-xs text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-[#1877f2] shrink-0" />
                    <span>{pageName}</span>
                  </div>
                </div>
              </div>

              {/* Highlights box */}
              <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl border border-gray-150 dark:border-zinc-800 space-y-3 shadow-sm text-center">
                <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wide">Highlights</p>
                <p className="text-[10.5px] text-gray-400 pb-1.5 leading-normal">Highlight your favorite syndicate slips or matching events for fans to see.</p>
                <button
                  onClick={() => triggerToast("Highlight uploader setup program open.")}
                  className="w-full py-2 bg-blue-500/10 hover:bg-blue-500/17 text-[#1877f2] border border-blue-500/20 text-xs font-black rounded-xl transition-all cursor-pointer"
                >
                  Add Highlights
                </button>
              </div>

            </div>

            {/* Right Column (Composer + Featured + Posts list matching photo 6) */}
            <div className="md:col-span-2 space-y-6 text-left">
              
              {/* Composer Box */}
              <div className="bg-white dark:bg-[#242526] p-4 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm space-y-3.5">
                <div className="flex items-center gap-3">
                  <img src={profilePhoto} className="w-9 h-9 rounded-full object-cover shadow-xs border border-gray-150" alt="Avatar" />
                  <input 
                    type="text" 
                    value={whatsOnYourMindText}
                    onChange={(e) => setWhatsOnYourMindText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handlePostSubmit();
                      }
                    }}
                    placeholder={`What's on your mind, ${pageName}?`}
                    className="flex-1 bg-gray-50 dark:bg-zinc-900 border border-gray-205 dark:border-zinc-800 rounded-full px-4 py-2 text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none focus:ring-1 focus:ring-[#1877f2] font-medium"
                  />
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 dark:border-zinc-800/80 my-2" />

                {/* Sub row of icons: Live Video, Photo/video, Reel exactly match photo 6 */}
                <div className="flex items-center justify-around text-xs font-black text-gray-500 flex-wrap gap-1">
                  <button 
                    onClick={() => triggerToast("Starting Live Video Match commentary...")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 hover:bg-gray-50 dark:hover:bg-zinc-805 rounded-xl transition-colors cursor-pointer"
                  >
                    <Video className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Live video</span>
                  </button>

                  <button 
                    onClick={() => {
                      setShowAddPhotoModal(true);
                      setPhotosSubTab("yours");
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 hover:bg-gray-50 dark:hover:bg-zinc-805 rounded-xl transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Photo/video</span>
                  </button>

                  <button 
                    onClick={() => {
                      setActiveTab("reels");
                      triggerToast("Opened reels creator view.");
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 hover:bg-gray-50 dark:hover:bg-zinc-805 rounded-xl transition-colors cursor-pointer"
                  >
                    <Play className="w-4 h-4 text-pink-500 shrink-0 fill-pink-500/15" />
                    <span>Reel</span>
                  </button>
                </div>

                {whatsOnYourMindText.trim() && (
                  <button 
                    onClick={handlePostSubmit}
                    className="w-full py-2 bg-[#1877f2] hover:bg-blue-600 font-extrabold text-xs text-white rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Submit Post
                  </button>
                )}

              </div>

              {/* Featured Card Box */}
              <div className="bg-white dark:bg-[#242526] p-4 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">Featured</h3>
                  <p className="text-[10.5px] text-gray-400 mt-0.5 leading-normal">People won't see this unless you pin something.</p>
                </div>
                <button 
                  onClick={() => triggerToast("Pins manager and Featured sliders config loaded.")}
                  className="px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl border border-gray-200 dark:border-zinc-700 transition-all cursor-pointer"
                >
                  Manage
                </button>
              </div>

              {/* Control / Grid selection row */}
              <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl border border-gray-150 dark:border-zinc-800 flex items-center justify-between shadow-xs">
                <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Posts</span>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => triggerToast("Active filter options loaded.")}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl border border-gray-200 dark:border-zinc-750 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
                    <span>Filters</span>
                  </button>
                  <button 
                    onClick={() => triggerToast("Managing active ledger publication timeline...")}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl border border-gray-200 dark:border-zinc-750 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <List className="w-3.5 h-3.5 text-gray-500" />
                    <span>Manage posts</span>
                  </button>
                </div>
              </div>

              {/* Sub-tabs view indicators */}
              <div className="flex border-b border-gray-150 dark:border-zinc-800 px-1 bg-white/70 dark:bg-zinc-900/60 rounded-xl max-w-xs gap-3">
                <button className="py-2.5 px-3 text-xs font-black border-b-2 border-[#1877f2] text-[#1877f2] flex items-center gap-1">
                  <List className="w-3.5 h-3.5" />
                  <span>List view</span>
                </button>
                <button onClick={() => triggerToast("Grid posts dashboard loaded.")} className="py-2.5 px-3 text-xs font-bold text-gray-400 hover:text-gray-600 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Grid view</span>
                </button>
              </div>

              {/* Posts Timeline rendering */}
              <div className="space-y-5">
                {timelinePosts.map((post) => (
                  <div 
                    key={post.id}
                    className="bg-white dark:bg-[#242526] rounded-3xl p-4 sm:p-5 border border-gray-150 dark:border-zinc-800/80 shadow-xs space-y-4 text-left"
                  >
                    {/* Post Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={post.avatar} className="w-10 h-10 rounded-full object-cover border border-gray-150" alt="avatar" />
                        <div>
                          <h4 className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1">
                            <span>{post.author}</span>
                            <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10 shrink-0" />
                          </h4>
                          <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1 leading-none pt-0.5">
                            <span>{post.time}</span>
                            <span>•</span>
                            <Globe className="w-3 h-3 text-gray-400" />
                          </span>
                        </div>
                      </div>

                      {/* Options menu */}
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-500/5 transition-all cursor-pointer"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content text */}
                    <p className="text-xs text-gray-800 dark:text-gray-250 leading-relaxed font-sans">{post.content}</p>

                    {/* Aesthetic cover spectrum or gradient if matching June 19 post exactly */}
                    {post.id === "post-tpl-1" && (
                      <div className="h-44 bg-gradient-to-tr from-indigo-700 via-purple-600 to-pink-500 rounded-2xl flex flex-col items-center justify-center text-center p-6 text-white text-md font-black italic shadow-inner tracking-tight relative overflow-hidden select-none">
                        <span>"We are not buying police uniforms..."</span>
                        <span className="block text-xs font-mono text-white/70 font-bold uppercase tracking-widest mt-2">facelook MATCHING ACTIVE</span>
                        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                      </div>
                    )}

                    {/* Likes & Comments tally metrics */}
                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono pb-2.5 border-b border-gray-100 dark:border-zinc-800/80 pt-1">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
                        <span>{post.likes} stakers liked</span>
                      </span>
                      <span>{post.comments.length} comments</span>
                    </div>

                    {/* Bottom action bar */}
                    <div className="flex text-xs font-bold text-gray-500 text-center select-none pt-1">
                      <button 
                        onClick={() => handleLikePost(post.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 hover:bg-gray-50 dark:hover:bg-zinc-805 rounded-xl cursor-pointer ${post.hasLiked ? "text-blue-500 font-black" : ""}`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${post.hasLiked ? "fill-blue-500/10" : ""}`} />
                        <span>Like</span>
                      </button>
                      <button 
                        onClick={() => triggerToast("Comment module ready. Type to reply directly!")}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 hover:bg-gray-50 dark:hover:bg-zinc-805 rounded-xl cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Comment</span>
                      </button>
                      <button 
                        onClick={() => triggerToast("Invitation copied! Invite stakers to see this post.")}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 hover:bg-gray-50 dark:hover:bg-zinc-805 rounded-xl cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* MOCK EXTRA CONTENT PANELS SELECTED VIA dropdown 'selectedMoreTab' */}
        {selectedMoreTab && (
          <div className="bg-white dark:bg-[#242526] rounded-3xl p-6 shadow-sm border border-gray-150 dark:border-zinc-800 text-left space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-150 dark:border-zinc-800">
              <h3 className="text-md font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-500" />
                <span>{selectedMoreTab} Workspace</span>
              </h3>
              <button 
                onClick={() => setSelectedMoreTab(null)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                Back
              </button>
            </div>

            <div className="p-12 text-center space-y-4">
              <Sparkles className="w-12 h-12 text-[#1877f2] mx-auto animate-bounce" />
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#1877f2]">lookupto decentralized protocol online</h4>
                <p className="text-xs text-gray-400">
                  You are viewing the specialized page portal module <strong>"{selectedMoreTab}"</strong> tailored for page <strong>Baridi SANA</strong>.
                </p>
              </div>

              {/* Enter mock details */}
              <div className="max-w-sm mx-auto space-y-2 mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <input 
                  type="text" 
                  value={customFeedbackMsg}
                  onChange={(e) => setCustomFeedbackMsg(e.target.value)}
                  placeholder="Enter localized action prompt..."
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none"
                />
                <button
                  onClick={() => {
                    const phrase = customFeedbackMsg.trim() || `${selectedMoreTab} data compiled successfully.`;
                    triggerToast(phrase);
                    setCustomFeedbackMsg("");
                  }}
                  className="w-full py-2 bg-[#1877f2] hover:bg-blue-600 text-white font-black text-xs rounded-xl shadow cursor-pointer uppercase tracking-tight"
                >
                  Propose {selectedMoreTab} Ledger Swap
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* FULLSCREEN PHOTO LIGHTBOX VIEWER */}
      {fullscreenPhoto && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[200] p-4">
          <button 
            onClick={() => setFullscreenPhoto(null)} 
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          
          <img src={fullscreenPhoto} className="max-h-[90vh] max-w-full rounded-2xl object-contain shadow-2xl animate-in zoom-in-95 duration-150" alt="Zoomed view" />
        </div>
      )}

      {/* EDIT PAGE INFORMATION MODAL */}
      {isEditingInfo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-[130] p-4 font-sans animate-in fade-in duration-100">
          <div className="bg-white dark:bg-[#242526] border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden text-left animate-in zoom-in-95 duration-150">
            
            <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-extrabold text-base text-gray-950 dark:text-white flex items-center gap-1.5">
                <Settings className="w-5 h-5 text-blue-500" />
                <span>Adjust Page Variables</span>
              </h3>
              <button onClick={() => setIsEditingInfo(false)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-black uppercase text-gray-400 tracking-wider">Page Title name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-gray-800 dark:text-gray-100 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-black uppercase text-gray-400 tracking-wider">Category news descriptor</label>
                <input 
                  type="text" 
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-gray-800 dark:text-gray-100 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-black uppercase text-gray-400 tracking-wider">Pinned Template Details</label>
                <input 
                  type="text" 
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-gray-800 dark:text-gray-100 outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-gray-55 dark:bg-[#1c1d1e] border-t border-gray-100 dark:border-zinc-800/80 flex justify-end gap-3">
              <button 
                onClick={() => setIsEditingInfo(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
              <button 
                onClick={saveProfileDetails}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Save configurations
              </button>
            </div>

          </div>
        </div>
      )}

      {/* EDIT COVER PHOTO LIGHTBOX */}
      {isEditingCoverUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-[130] p-4 font-sans animate-in fade-in duration-100">
          <div className="bg-white dark:bg-[#242526] border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden text-left animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-gray-100 dark:border-zinc-850 flex items-center justify-between bg-gray-50 dark:bg-[#1c1d1e]">
              <h3 className="font-extrabold text-xs text-gray-900 dark:text-white uppercase tracking-wider">Upload Cover Photo</h3>
              <button onClick={() => setIsEditingCoverUrl(false)} className="text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block">Select Image File</label>
              <div className="relative border-2 border-dashed border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setTempCoverUrl(URL.createObjectURL(f));
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <p className="text-xs font-bold text-gray-600 dark:text-gray-300">Tap to upload local file</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-px bg-gray-200 dark:bg-zinc-800 flex-1"></div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">or</span>
                <div className="h-px bg-gray-200 dark:bg-zinc-800 flex-1"></div>
              </div>

              <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block">Input landscape image URL</label>
              <input 
                type="text" 
                value={tempCoverUrl}
                onChange={(e) => setTempCoverUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-gray-800 dark:text-gray-100 outline-none"
              />
              <p className="text-[10px] text-gray-400 leading-normal">Use Unsplash landscape image links to match the page background perfectly.</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-[#1c1d1e] border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-2.5">
              <button onClick={() => setIsEditingCoverUrl(false)} className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl cursor-pointer">Discard</button>
              <button 
                onClick={() => {
                  if (tempCoverUrl.trim()) {
                    setCoverPhoto(tempCoverUrl.trim());
                    setIsEditingCoverUrl(false);
                    triggerToast("Cover photo updated successfully!");
                  }
                }}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl cursor-pointer shadow"
              >
                Apply Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE PHOTO LIGHTBOX */}
      {isEditingProfileUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-[130] p-4 font-sans animate-in fade-in duration-100">
          <div className="bg-white dark:bg-[#242526] border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden text-left animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-gray-100 dark:border-zinc-850 flex items-center justify-between bg-gray-50 dark:bg-[#1c1d1e]">
              <h3 className="font-extrabold text-xs text-gray-900 dark:text-white uppercase tracking-wider">Upload Profile Photo Avatar</h3>
              <button onClick={() => setIsEditingProfileUrl(false)} className="text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block">Select Image File</label>
              <div className="relative border-2 border-dashed border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setTempProfileUrl(URL.createObjectURL(f));
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <p className="text-xs font-bold text-gray-600 dark:text-gray-300">Tap to upload local file</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-px bg-gray-200 dark:bg-zinc-800 flex-1"></div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">or</span>
                <div className="h-px bg-gray-200 dark:bg-zinc-800 flex-1"></div>
              </div>

              <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block">Input square profile image URL</label>
              <input 
                type="text" 
                value={tempProfileUrl}
                onChange={(e) => setTempProfileUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-gray-800 dark:text-gray-100 outline-none"
              />
              <p className="text-[10px] text-gray-400 leading-normal">Use Unsplash square portrait links to match profile overlap perfectly.</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-[#1c1d1e] border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-2.5">
              <button onClick={() => setIsEditingProfileUrl(false)} className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl cursor-pointer">Discard</button>
              <button 
                onClick={() => {
                  if (tempProfileUrl.trim()) {
                    setProfilePhoto(tempProfileUrl.trim());
                    setIsEditingProfileUrl(false);
                    triggerToast("Profile photo avatar updated successfully!");
                  }
                }}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl cursor-pointer shadow"
              >
                Apply Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD PHOTO TO ALBUMS MODAL */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-[130] p-4 font-sans animate-in fade-in duration-100">
          <div className="bg-white dark:bg-[#242526] border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden text-left animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-gray-100 dark:border-zinc-850 flex items-center justify-between bg-gray-50 dark:bg-[#1c1d1e]">
              <h3 className="font-extrabold text-xs text-gray-900 dark:text-white uppercase tracking-wider">Publish New Album Media</h3>
              <button onClick={() => setShowAddPhotoModal(false)} className="text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block">Select Image File</label>
                <div className="relative border-2 border-dashed border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setNewPhotoUrl(URL.createObjectURL(f));
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-300">Tap to upload local file</p>
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <div className="h-px bg-gray-200 dark:bg-zinc-800 flex-1"></div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">or</span>
                <div className="h-px bg-gray-200 dark:bg-zinc-800 flex-1"></div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block">Photo Name / Title</label>
                <input 
                  type="text" 
                  value={newPhotoTitle}
                  onChange={(e) => setNewPhotoTitle(e.target.value)}
                  placeholder="e.g. Gor Mahia strategy meeting..."
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs text-gray-800 dark:text-gray-100 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block">Photo Absolute URL Path</label>
                <input 
                  type="text" 
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs text-gray-800 dark:text-gray-100 outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-[#1c1d1e] border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-2.5 font-sans">
              <button onClick={() => setShowAddPhotoModal(false)} className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl cursor-pointer">Discard</button>
              <button 
                onClick={handleAddNewPhoto}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl cursor-pointer shadow"
              >
                Confirm Add
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
