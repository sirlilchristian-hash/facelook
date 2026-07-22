import React, { useState } from "react";
import { 
  Bell, 
  ChevronDown, 
  ChevronUp,
  ChevronRight, 
  Search, 
  Plus,
  Zap,
  Users,
  Trophy,
  Activity,
  ChevronLeft,
  X,
  Swords,
  ClipboardList,
  Mail,
  Users2,
  TrendingUp,
  LayoutGrid,
  Gamepad2,
  Globe,
  User,
  Wallet,
  Video,
  Smartphone,
  Settings,
  LogOut,
  MessageSquare,
  Star,
  History,
  Bookmark,
  Clapperboard,
  Store,
  BarChart3,
  Gift,
  Calendar,
  Rss,
  MonitorPlay,
  MessageCircle,
  Baby,
  CreditCard,
  Gamepad,
  Clock
} from "lucide-react";

interface HubViewProps {
  walletBalance: number;
  onNavigateTab: (tab: string) => void;
}

const HubView: React.FC<HubViewProps> = ({ walletBalance, onNavigateTab }) => {
  const [activeSport, setActiveSport] = useState("Soccer");
  const [isGameHubModalOpen, setIsGameHubModalOpen] = useState(false);

  const sports = [
    { name: "Soccer", icon: "⚽" },
    { name: "Table Tennis", icon: "🏓" },
    { name: "Boxing", icon: "🥊" },
    { name: "Basketball", icon: "🏀" },
    { name: "Tennis", icon: "🎾" },
  ];

  const fixtures = [
    {
      id: 1,
      league: "Premier League",
      status: "LIVE",
      time: "34'",
      team1: { name: "Arsenal", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png" },
      team2: { name: "Liverpool", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/1200px-Liverpool_FC.svg.png" },
      odds: { "1": "2.45", "X": "3.40", "2": "2.85" },
      activeStakers: 2450
    },
    {
      id: 2,
      league: "Premier League",
      status: "UPCOMING",
      time: "Today • 16:00",
      team1: { name: "Manchester City", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png" },
      team2: { name: "Southampton", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c9/Southampton_FC.svg/1200px-Southampton_FC.svg.png" },
      odds: { "1": "1.12", "X": "9.50", "2": "21.00" },
      activeStakers: 1980
    },
    {
      id: 3,
      league: "Premier League",
      status: "UPCOMING",
      time: "Tomorrow • 18:30",
      team1: { name: "Chelsea", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/1200px-Chelsea_FC.svg.png" },
      team2: { name: "Newcastle United", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/Newcastle_United_Logo.svg/1200px-Newcastle_United_Logo.svg.png" },
      odds: { "1": "1.68", "X": "4.20", "2": "4.80" },
      activeStakers: 1520
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#18191a] font-sans pb-32">
      {/* HEADER - Style matching facelook BET branding */}
      <header className="sticky top-0 z-[200] bg-white dark:bg-[#1c1d1f] border-b border-gray-100 dark:border-zinc-800/80 px-4 py-2 flex items-center justify-between shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black text-[#1877f2] tracking-tighter uppercase">Game Hub</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsGameHubModalOpen(true)}
            className="w-9 h-9 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-[#1877f2] hover:bg-blue-100 transition-colors shadow-sm"
          >
            <Gamepad2 className="w-5 h-5" />
          </button>

          <div className="relative">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-gray-500">
              <Bell className="w-5 h-5" />
            </button>
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full border-2 border-white dark:border-[#1c1d1f] flex items-center justify-center">3</span>
          </div>
          
          <button className="flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors text-xs font-black text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700">
            <span>KES {walletBalance.toLocaleString()}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      </header>

      {/* SEARCH BAR - style matching Screenshot 2 */}
      <div className="px-4 py-2 bg-white dark:bg-[#1c1d1f] border-b border-gray-50 dark:border-zinc-800/50">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search teams & sports..." 
            className="w-full bg-[#f0f2f5] dark:bg-zinc-900 border-none rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#1877f2]/20 outline-none transition-all dark:text-white"
          />
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="px-4 py-4">
        <div className="bg-gradient-to-br from-[#0a2351] via-[#1a4a9c] to-[#1877f2] rounded-3xl p-6 text-white relative overflow-hidden shadow-xl border border-white/10">
          {/* Soccer Ball Background Pattern */}
          <div className="absolute top-0 right-0 w-48 h-48 opacity-20 transform translate-x-12 -translate-y-8">
             <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8-3.59 8-8-3.59 8-8 8zm0-15c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-5-5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
          </div>

          <div className="relative z-10 space-y-4 max-w-[80%]">
            <span className="bg-[#b7e4ff]/30 text-[#b7e4ff] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border border-[#b7e4ff]/20">
              WORLD CUP '26 QUALIFIERS
            </span>
            <h2 className="text-3xl font-black leading-tight">
              LookUpto Engine handles zero margins.
            </h2>
            <p className="text-sm font-medium text-blue-100 opacity-90 leading-relaxed">
              Propose challenges directly to friends or launch to global stakers.
            </p>
            

          </div>
        </div>
      </section>

      {/* SPORTS CATEGORIES */}
      <section className="px-4 py-2 relative flex items-center gap-2">
        <button 
          onClick={() => {
            const el = document.getElementById("sports-scroll");
            if (el) el.scrollBy({ left: -150, behavior: "smooth" });
          }}
          className="p-1.5 bg-white dark:bg-zinc-800 rounded-full shadow-md border border-gray-100 dark:border-zinc-700 z-10 hover:bg-gray-50 transition-colors shrink-0"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>

        <div id="sports-scroll" className="flex-1 flex gap-3 overflow-x-auto scrollbar-none py-1">
          {sports.map((sport) => (
            <button
              key={sport.name}
              onClick={() => setActiveSport(sport.name)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border ${
                activeSport === sport.name
                  ? "bg-[#1877f2] text-white border-[#1877f2] shadow-md"
                  : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-zinc-800 hover:bg-gray-50"
              }`}
            >
              <span>{sport.icon}</span>
              <span>{sport.name}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={() => {
            const el = document.getElementById("sports-scroll");
            if (el) el.scrollBy({ left: 150, behavior: "smooth" });
          }}
          className="p-1.5 bg-white dark:bg-zinc-800 rounded-full shadow-md border border-gray-100 dark:border-zinc-700 z-10 hover:bg-gray-50 transition-colors shrink-0"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </section>

      {/* FIXTURES SECTION */}
      <section className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#1877f2]" />
            <h3 className="font-black text-gray-900 dark:text-white">
              Highlights: Live & Upcoming Soccer Fixtures
            </h3>
          </div>
          <button className="text-sm font-bold text-[#1877f2] flex items-center gap-1">
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {fixtures.map((fixture) => (
            <div key={fixture.id} className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800/80 shadow-sm overflow-hidden p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">{fixture.league}</span>
                   <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                     fixture.status === "LIVE" 
                       ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" 
                       : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                   }`}>
                     {fixture.status} {fixture.time}
                   </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                  <img src={fixture.team1.logo} alt={fixture.team1.name} className="w-12 h-12 object-contain" />
                  <span className="text-sm font-black text-center truncate w-full dark:text-white">{fixture.team1.name}</span>
                </div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">VS</div>
                <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                  <img src={fixture.team2.logo} alt={fixture.team2.name} className="w-12 h-12 object-contain" />
                  <span className="text-sm font-black text-center truncate w-full dark:text-white">{fixture.team2.name}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 shrink-0">
                  {Object.entries(fixture.odds).map(([key, val]) => (
                    <button key={key} className="flex flex-col items-center justify-center w-14 h-16 bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700/50 hover:bg-gray-100 transition-colors">
                      <span className="text-[10px] font-bold text-gray-400 mb-1">{key}</span>
                      <span className="text-sm font-black text-gray-900 dark:text-white">{val}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-1 border-t border-gray-50 dark:border-zinc-800 flex items-center justify-between bg-emerald-50/30 dark:bg-emerald-950/10 -mx-4 -mb-4 px-4 py-3">
                 <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px] font-black text-emerald-600">{fixture.activeStakers.toLocaleString()} active stakers</span>
                 </div>
                 <button className="text-[11px] font-black text-emerald-600 flex items-center gap-1 hover:underline">
                    View & Match Liability <ChevronRight className="w-3.5 h-3.5" />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SUB-NAV TABS */}
      <section className="px-4 py-4 grid grid-cols-4 gap-2 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
         {[
           { id: "live", label: "Live Matches", icon: <Activity className="w-5 h-5" />, color: "text-emerald-500" },
           { id: "challenges", label: "My Challenges", icon: <Users className="w-5 h-5" />, color: "text-[#1877f2]" },
           { id: "results", label: "Results", icon: <Trophy className="w-5 h-5" />, color: "text-purple-500" },
           { id: "top", label: "Top Stakers", icon: <Activity className="w-5 h-5 rotate-90" />, color: "text-orange-500" }
         ].map((nav) => (
           <button 
             key={nav.label} 
             className="flex flex-col items-center gap-1 py-2"
             onClick={() => onNavigateTab(nav.id)}
           >
              <div className={nav.color}>{nav.icon}</div>
              <span className="text-[10px] font-bold text-gray-500 text-center">{nav.label}</span>
           </button>
         ))}
      </section>


      {/* GAME HUB MODAL - Exact style from Proposed Game Hub Menu Screenshot */}
      {isGameHubModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            onClick={() => setIsGameHubModalOpen(false)} 
            className="absolute inset-0"
          />
          
          <div className="relative bg-white dark:bg-[#1c1d1f] w-full max-w-lg max-h-[90vh] shadow-2xl flex flex-col rounded-[32px] overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-zinc-800 sticky top-0 bg-white dark:bg-[#1c1d1f] z-10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center shadow-sm">
                  <Gamepad2 className="w-8 h-8 text-[#1877f2]" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#1877f2] leading-none mb-1">GAME HUB</h2>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">P2P Sports Betting & Challenges</p>
                </div>
              </div>
              <button 
                onClick={() => setIsGameHubModalOpen(false)}
                className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-none">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <Zap className="w-4 h-4 fill-current" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Quick Actions</span>
                </div>
                <div className="space-y-2">

                  <ModalActionItem 
                    icon={<ClipboardList className="w-5 h-5" />} 
                    iconBg="bg-[#1877f2]"
                    label="My Challenges" 
                    desc="View all your challenges & status"
                    badge="12"
                    onClick={() => { onNavigateTab("challenges"); setIsGameHubModalOpen(false); }}
                  />
                  <ModalActionItem 
                    icon={<Mail className="w-5 h-5" />} 
                    iconBg="bg-purple-600"
                    label="Challenge Invites" 
                    desc="Challenges waiting for your response"
                    badge="3"
                    onClick={() => setIsGameHubModalOpen(false)}
                  />
                  <ModalActionItem 
                    icon={<Users2 className="w-5 h-5" />} 
                    iconBg="bg-emerald-600"
                    label="Tujengane Pools" 
                    desc="Join or manage collaborative pools"
                    badge="1"
                    onClick={() => setIsGameHubModalOpen(false)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#1877f2]">
                  <LayoutGrid className="w-4 h-4" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Browse Sports</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {[
                    { name: "Soccer", icon: "⚽" },
                    { name: "Basketball", icon: "🏀" },
                    { name: "Tennis", icon: "🎾" },
                    { name: "Table Tennis", icon: "🏓" },
                    { name: "Boxing", icon: "🥊" },
                  ].map((s) => (
                    <button key={s.name} className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:border-[#1877f2] transition-all group">
                      <span className="text-xl group-hover:scale-110 transition-transform">{s.icon}</span>
                      <span className="text-[10px] font-black text-gray-600 dark:text-gray-400">{s.name}</span>
                    </button>
                  ))}
                  <button className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:border-[#1877f2] transition-all group">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Plus className="w-4 h-4 text-[#1877f2]" />
                    </div>
                    <span className="text-[10px] font-black text-gray-600 dark:text-gray-400">More</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-orange-500">
                  <Trophy className="w-4 h-4" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Match Categories</span>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-[32px] border border-gray-100 dark:border-zinc-800 overflow-hidden divide-y dark:divide-zinc-800">
                  {[
                    { label: "Highlights", icon: "⭐", desc: "Top and trending matches" },
                    { label: "Live Matches", icon: "🔴", desc: "Matches happening now", count: 4 },
                    { label: "Upcoming Fixtures", icon: "📅", desc: "Matches scheduled soon", count: 8 },
                    { label: "Results", icon: "🏆", desc: "Completed matches & scores" }
                  ].map((cat) => (
                    <button key={cat.label} className="w-full flex items-center gap-4 p-4 hover:bg-white dark:hover:bg-zinc-800 transition-all group">
                      <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">{cat.icon}</span>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-black text-gray-900 dark:text-white">{cat.label}</p>
                        <p className="text-[10px] font-bold text-gray-400 leading-tight">{cat.desc}</p>
                      </div>
                      {cat.count && (
                         <span className="bg-[#1877f2] text-white text-[10px] font-black px-2 py-0.5 rounded-full mr-2">{cat.count}</span>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1877f2] group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// HELPER COMPONENTS
const ModalActionItem = ({ icon, iconBg, label, desc, badge, onClick }: any) => (
  <button onClick={onClick} className="w-full flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[24px] hover:border-[#1877f2]/30 transition-all group shadow-sm hover:shadow-md">
    <div className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div className="flex-1 text-left">
      <p className="text-sm font-black text-gray-900 dark:text-white leading-none mb-1">{label}</p>
      <p className="text-[10px] font-bold text-gray-400 leading-tight">{desc}</p>
    </div>
    {badge && (
      <span className="bg-[#1877f2] text-white text-[10px] font-black px-2.5 py-1 rounded-full">{badge}</span>
    )}
    <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-[#1877f2] group-hover:translate-x-1 transition-all" />
  </button>
);

export default HubView;
