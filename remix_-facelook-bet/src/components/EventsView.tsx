import React, { useState } from "react";
import { 
  Search, 
  Home, 
  Calendar, 
  Bell, 
  Bookmark, 
  Plus, 
  Users, 
  CheckCircle,
  X,
  Share2,
  ChevronDown,
  Filter,
  MessageCircle
} from "lucide-react";
import { Event } from "../types";
import EventDetailsView from "./event-details/EventDetailsView";

export default function EventsView() {
  const [activeTab, setActiveTab] = useState<"home" | "my" | "pending" | "saved">("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  
  // Countdown Timer
  const [timeLeft, setTimeLeft] = useState<string>("2 Days 14 Hours");

  // Sample Data (should be replaced with real data/state management later)
  const [events, setEvents] = useState<Event[]>([
    {
      id: "ev-1",
      title: "Manchester United vs Arsenal",
      matchBanner: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800",
      competition: "Premier League",
      date: "Saturday, May 24",
      time: "4:30 PM",
      venue: "Old Trafford",
      participants: 1250,
      openChallenges: 256,
      openPools: 34,
      status: "VERIFIED",
      verificationConfirmations: 3
    },
    {
      id: "ev-2",
      title: "Barcelona vs Real Madrid",
      matchBanner: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800",
      competition: "La Liga",
      date: "Sunday, May 25",
      time: "9:00 PM",
      venue: "Camp Nou",
      participants: 980,
      openChallenges: 189,
      openPools: 29,
      status: "VERIFIED",
      verificationConfirmations: 3
    }
  ]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to add event
    setShowModal(false);
  };

  if (activeEvent) {
    return <EventDetailsView event={activeEvent} onBack={() => setActiveEvent(null)} />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-white dark:bg-[#18191a] min-h-screen text-gray-900 dark:text-gray-100 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Sidebar */}
        <div className="md:col-span-3 space-y-4">
          <h1 className="text-2xl font-black mb-4">Events</h1>
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#3a3b3c] rounded-full px-4 py-2 mb-4">
            <Search className="w-5 h-5 text-gray-500" />
            <input 
              type="text"
              placeholder="Search events"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm"
            />
          </div>
          
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl font-bold text-sm"><Home className="w-5 h-5"/> Home</button>
            <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl font-bold text-sm"><Users className="w-5 h-5"/> My Events</button>
            <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl font-bold text-sm"><Bell className="w-5 h-5"/> Notifications</button>
            <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl font-bold text-sm"><Bookmark className="w-5 h-5"/> Saved Events</button>
          </nav>
          
          <button 
            onClick={() => setShowModal(true)}
            className="w-full bg-[#1877f2] text-white py-2 rounded-xl font-black text-sm flex items-center justify-center gap-2 mt-4 hover:bg-blue-600"
          >
            <Plus className="w-5 h-5" /> Create New Event
          </button>
          
          <div className="mt-6 border-t pt-4 dark:border-zinc-800">
            <h3 className="font-black text-sm text-gray-500 mb-2">Categories</h3>
            {["Football", "Basketball", "Tennis", "Boxing", "Esports", "Cricket", "Rugby", "MMA", "Motorsport", "Volleyball", "Athletics", "Other Sports"].map(cat => (
              <button key={cat} className="block w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl text-sm font-bold">{cat}</button>
            ))}
          </div>
        </div>

      {/* Center Discover Events */}
        <div className="md:col-span-9">
          <h2 className="text-lg font-black mb-4">Discover events</h2>
          
          {/* Top Filters */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <button className="flex items-center gap-1 bg-gray-100 dark:bg-[#3a3b3c] px-3 py-1.5 rounded-full text-xs font-bold">My location <ChevronDown className="w-3 h-3"/></button>
            <button className="flex items-center gap-1 bg-gray-100 dark:bg-[#3a3b3c] px-3 py-1.5 rounded-full text-xs font-bold">Any date <ChevronDown className="w-3 h-3"/></button>
            {["All", "Football", "Basketball", "Tennis", "Esports"].map(f => (
              <button key={f} className={`px-4 py-1.5 rounded-full text-xs font-bold ${f === "All" ? "bg-[#1877f2] text-white" : "bg-gray-100 dark:bg-[#3a3b3c]"}`}>{f}</button>
            ))}
            <button className="flex items-center gap-1 bg-gray-100 dark:bg-[#3a3b3c] px-3 py-1.5 rounded-full text-xs font-bold"><Filter className="w-3 h-3"/> More filters</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {events.map(event => (
              <div key={event.id} className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden flex flex-col">
                <div className="relative">
                  <img src={event.matchBanner} alt={event.title} className="w-full h-32 object-cover rounded-t-2xl" />
                  <div className={`absolute top-2 right-2 text-[10px] font-black px-2 py-0.5 rounded ${event.status === "VERIFIED" ? "bg-emerald-500 text-white" : "bg-orange-500 text-white"}`}>
                    {event.status === "VERIFIED" ? "✔ Verified" : "Pending"}
                  </div>
                </div>
                <div className="p-3 space-y-2 flex-grow">
                  <h3 className="font-black text-xs line-clamp-2" title={event.title}>{event.title}</h3>
                  <p className="text-[10px] text-gray-500">{event.date} • {event.time}</p>
                  <p className="text-[10px] font-bold text-[#1877f2]">{event.competition} • {event.venue}</p>
                  
                  {/* Countdown */}
                  <div className="text-[10px] font-bold text-gray-600 bg-gray-100 dark:bg-zinc-800 p-1.5 rounded-lg text-center">
                    Kickoff In <span className="text-[#1877f2]">{timeLeft}</span>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-3 gap-1 pt-2 border-t dark:border-zinc-800">
                    <div className="text-center bg-gray-50 dark:bg-zinc-800 rounded-lg p-1">
                      <span className="block text-xs font-black text-[#1877f2]">{event.openChallenges}</span>
                      <span className="text-[9px] font-bold text-gray-500">Challenges</span>
                    </div>
                    <div className="text-center bg-gray-50 dark:bg-zinc-800 rounded-lg p-1">
                      <span className="block text-xs font-black text-emerald-600">{event.openPools}</span>
                      <span className="text-[9px] font-bold text-gray-500">Pools</span>
                    </div>
                    <div className="text-center bg-gray-50 dark:bg-zinc-800 rounded-lg p-1">
                      <span className="block text-xs font-black text-purple-600">{event.participants}</span>
                      <span className="text-[9px] font-bold text-gray-500">Participants</span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="p-3 pt-0 flex gap-2">
                  <button onClick={() => setActiveEvent(event)} className="flex-1 bg-[#1877f2] text-white py-1.5 text-[10px] font-black rounded-lg">View</button>
                  <button className="flex-1 bg-emerald-500 text-white py-1.5 text-[10px] font-black rounded-lg">Join</button>
                  <button className="bg-gray-100 dark:bg-[#3a3b3c] px-2 text-gray-500 rounded-lg"><Share2 className="w-3.5 h-3.5"/></button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Featured Event Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#242526] rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-zinc-800 space-y-4">
              <h3 className="font-black text-sm">Why Trust This Event?</h3>
              {["Community Verified", "Betting Ready", "Escrow Supported", "Nyota AI Available"].map(item => (
                <div key={item} className="flex gap-3 items-center">
                  <div className="p-1 bg-emerald-100 rounded-full text-emerald-600"><CheckCircle className="w-4 h-4"/></div>
                  <h4 className="font-bold text-sm">{item}</h4>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-2 bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200" className="w-full h-32 object-cover" />
               <div className="p-4">
                  <div className="flex justify-between">
                    <h3 className="font-black text-lg">Manchester United vs Arsenal</h3>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500">Escrow Locked</p>
                      <p className="font-black text-emerald-600 text-sm">$38,520</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Premier League • Old Trafford • Sat, May 24, 2025 • 4:30 PM</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs font-bold text-gray-500">Odds</p>
                      <div className="flex gap-2 text-[10px] font-black mt-1">
                        <span className="bg-gray-100 dark:bg-zinc-800 p-1 rounded">Home 1.95</span>
                        <span className="bg-gray-100 dark:bg-zinc-800 p-1 rounded">Draw 3.60</span>
                        <span className="bg-gray-100 dark:bg-zinc-800 p-1 rounded">Away 4.20</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500">Community Prediction</p>
                      <div className="flex gap-1 text-[10px] font-black mt-1">
                        <span className="text-blue-600">Home 58%</span>
                        <span className="text-gray-500">Draw 18%</span>
                        <span className="text-red-600">Away 24%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mt-4">
                    <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-black text-sm">Create Challenge (254 Active)</button>
                    <button className="bg-gray-100 dark:bg-[#3a3b3c] px-4 py-2 rounded-xl font-black text-sm flex items-center gap-2"><MessageCircle className="w-4 h-4"/> Ask Nyota AI</button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#242526] rounded-2xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black">Create New Event</h2>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <input type="text" placeholder="Home Team" className="w-full p-2 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700" />
              <input type="text" placeholder="Away Team" className="w-full p-2 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700" />
              <input type="text" placeholder="Competition" className="w-full p-2 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700" />
              <div className="flex gap-2">
                <input type="date" className="w-full p-2 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700" />
                <input type="time" className="w-full p-2 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700" />
              </div>
              <input type="text" placeholder="Stadium / Venue" className="w-full p-2 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700" />
              <button type="submit" className="w-full bg-[#1877f2] text-white p-3 rounded-xl font-black">Create Event</button>
            </form>
          </div>
        </div>
      )}
      
      {/* Floating Ask Nyota AI Button */}
      <button className="fixed bottom-6 right-6 bg-[#1877f2] text-white p-4 rounded-full shadow-lg flex items-center gap-2 font-black text-sm hover:bg-blue-600">
        <MessageCircle className="w-5 h-5" /> Ask Nyota AI
      </button>
    </div>
  );
}
