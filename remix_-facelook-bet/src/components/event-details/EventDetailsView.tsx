import React, { useState } from "react";
import { 
  ArrowLeft,
  Share2,
  CheckCircle,
  MessageCircle,
  Users,
  Trophy,
  Activity,
  BarChart2,
  Clock,
  MapPin,
  Calendar,
  Lock
} from "lucide-react";
import { Event } from "../types";

export default function EventDetailsView({ event, onBack }: { event: Event, onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Mimi na Wewe", "3-Way Challenge", "Tujengane Pools", "Activity", "Statistics"];

  // Mock Data
  const odds = { home: 1.95, draw: 3.60, away: 4.20 };
  const prediction = { home: 58, draw: 18, away: 24 };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-white dark:bg-[#18191a] min-h-screen text-gray-900 dark:text-gray-100 font-sans pb-24">
      {/* Header */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold mb-4 hover:text-[#1877f2]">
        <ArrowLeft className="w-4 h-4" /> Back to Discover
      </button>

      <div className="relative rounded-2xl overflow-hidden mb-6 h-64 shadow-lg">
        <img src={event.matchBanner} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end text-white">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black">{event.title}</h1>
              <div className="flex gap-4 text-sm font-bold opacity-90 mt-1">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{event.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{event.time}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{event.venue}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-emerald-500 text-white text-xs font-black px-2 py-1 rounded mb-2 inline-block">✔ Verified</div>
              <div className="text-xs font-bold bg-white/20 px-3 py-1.5 rounded">Kickoff In 2d 14h</div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl border border-gray-200 dark:border-zinc-800">
           <p className="text-xs text-gray-500 font-bold">Total Escrow Locked</p>
           <p className="text-2xl font-black text-emerald-600">$38,520</p>
        </div>
        <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl border border-gray-200 dark:border-zinc-800">
           <p className="text-xs text-gray-500 font-bold">Total Participants</p>
           <p className="text-2xl font-black">{event.participants}</p>
        </div>
        <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl border border-gray-200 dark:border-zinc-800">
           <p className="text-xs text-gray-500 font-bold">Open Challenges</p>
           <p className="text-2xl font-black text-[#1877f2]">{event.openChallenges}</p>
        </div>
        <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl border border-gray-200 dark:border-zinc-800">
           <p className="text-xs text-gray-500 font-bold">Active Pools</p>
           <p className="text-2xl font-black text-emerald-600">{event.openPools}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b dark:border-zinc-800">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-black text-sm whitespace-nowrap ${activeTab === tab ? "text-[#1877f2] border-b-2 border-[#1877f2]" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-[#242526] p-6 rounded-2xl border border-gray-200 dark:border-zinc-800">
        {activeTab === "Overview" && (
          <div className="space-y-6">
            <h2 className="text-xl font-black">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-sm mb-2 text-gray-500">Odds</h4>
                <div className="flex gap-2 text-sm font-black">
                   <div className="flex-1 bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl text-center">Home <span className="block text-xl">{odds.home}</span></div>
                   <div className="flex-1 bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl text-center">Draw <span className="block text-xl">{odds.draw}</span></div>
                   <div className="flex-1 bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl text-center">Away <span className="block text-xl">{odds.away}</span></div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-2 text-gray-500">Community Prediction</h4>
                <div className="flex gap-2 text-sm font-black">
                   <div className="flex-1 bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl text-center text-blue-600">Home <span className="block text-xl">{prediction.home}%</span></div>
                   <div className="flex-1 bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl text-center text-gray-500">Draw <span className="block text-xl">{prediction.draw}%</span></div>
                   <div className="flex-1 bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl text-center text-red-600">Away <span className="block text-xl">{prediction.away}%</span></div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 pt-4 border-t dark:border-zinc-800">
              <button className="flex-1 bg-[#1877f2] text-white py-3 rounded-xl font-black text-sm">Join Challenge</button>
              <button className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-black text-sm">Create Challenge</button>
              <button className="bg-gray-100 dark:bg-[#3a3b3c] px-4 py-3 rounded-xl font-black text-sm flex items-center gap-2"><Share2 className="w-4 h-4"/> Share</button>
            </div>
          </div>
        )}
        {activeTab !== "Overview" && (
           <div className="text-center py-20 text-gray-500 font-bold">{activeTab} section coming soon.</div>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#242526] border-t dark:border-zinc-800 p-4 flex gap-4 justify-center">
        <button className="bg-[#1877f2] text-white px-6 py-3 rounded-xl font-black text-sm">Create Mimi na Wewe</button>
        <button className="bg-[#1877f2] text-white px-6 py-3 rounded-xl font-black text-sm">Create 3-Way Challenge</button>
        <button className="bg-[#1877f2] text-white px-6 py-3 rounded-xl font-black text-sm">Create Tujengane Pool</button>
      </div>

      {/* Floating Ask Nyota AI */}
      <button className="fixed bottom-20 right-6 bg-[#1877f2] text-white p-4 rounded-full shadow-lg flex items-center gap-2 font-black text-sm hover:bg-blue-600">
        <MessageCircle className="w-5 h-5" /> Ask Nyota AI
      </button>
    </div>
  );
}
