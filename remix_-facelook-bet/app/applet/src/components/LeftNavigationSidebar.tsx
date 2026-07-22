import React, { useState } from "react";
import { 
  BarChart2, 
  TrendingUp, 
  Megaphone, 
  RefreshCw, 
  Sparkles, 
  Rss, 
  Users, 
  Calendar, 
  Gamepad2, 
  History, 
  Flag, 
  Film, 
  Bookmark, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";

interface LeftNavigationSidebarProps {
  activeTab: string;
  onSelectTab: (tab: any) => void;
  onTriggerAction: (msg: string) => void;
}

export const LeftNavigationSidebar: React.FC<LeftNavigationSidebarProps> = ({
  activeTab,
  onSelectTab,
  onTriggerAction,
}) => {
  const [showMoreSuggested, setShowMoreSuggested] = useState(true);

  return (
    <div className="space-y-1 font-sans text-left text-gray-900 dark:text-gray-100 pr-2">
      {/* SECTION 1: Business & Professional Tools */}
      <div className="space-y-0.5">
        <button
          type="button"
          onClick={() => {
            onSelectTab("creator_studio");
            onTriggerAction("Opening Professional Dashboard analytics");
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left ${
            activeTab === "creator_studio" ? "bg-gray-200/90 dark:bg-zinc-800 text-[#1877f2] font-black" : ""
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-[#1877f2] flex items-center justify-center shrink-0">
            <BarChart2 className="w-5 h-5 text-[#1877f2]" />
          </div>
          <span className="truncate text-[13.5px] font-bold text-gray-900 dark:text-white">Professional dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => onTriggerAction("Opening Ads Manager: Manage active campaign budgets and reach")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="truncate text-[13.5px] font-bold text-gray-900 dark:text-white">Ads Manager</span>
        </button>

        <button
          type="button"
          onClick={() => onTriggerAction("Opening Ad Center: Promote posts, pages & staker challenges")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Megaphone className="w-5 h-5" />
          </div>
          <span className="truncate text-[13.5px] font-bold text-gray-900 dark:text-white">Ad Center</span>
        </button>

        <button
          type="button"
          onClick={() => onTriggerAction("Opening Meta Business Suite: Multi-account & page management")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/30 text-[#1877f2] flex items-center justify-center shrink-0">
            <RefreshCw className="w-4.5 h-4.5 text-[#1877f2]" />
          </div>
          <span className="truncate text-[13.5px] font-bold text-gray-900 dark:text-white">Meta Business Suite</span>
        </button>
      </div>

      <hr className="my-2 border-gray-200 dark:border-zinc-800" />

      {/* SECTION 2: Suggested */}
      <div className="space-y-0.5">
        <div className="px-3 py-1.5 text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Suggested
        </div>

        {/* Meta AI */}
        <button
          type="button"
          onClick={() => onTriggerAction("Meta AI / LookUpto AI Assistant ready to analyze matches & strategies")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs hover:bg-gray-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-4 h-4 fill-white text-white" />
          </div>
          <span className="truncate text-[13.5px] font-bold text-gray-900 dark:text-white">Meta AI</span>
        </button>

        {/* Feeds */}
        <button
          type="button"
          onClick={() => onSelectTab("home")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs hover:bg-gray-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left ${
            activeTab === "home" ? "bg-gray-200/90 dark:bg-zinc-800 text-[#1877f2]" : ""
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#1877f2] flex items-center justify-center shrink-0">
            <Rss className="w-4.5 h-4.5 text-[#1877f2]" />
          </div>
          <span className="truncate text-[13.5px] font-bold text-gray-900 dark:text-white">Feeds</span>
        </button>

        {/* Groups */}
        <button
          type="button"
          onClick={() => onSelectTab("groups")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs hover:bg-gray-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left ${
            activeTab === "groups" ? "bg-gray-200/90 dark:bg-zinc-800 text-[#1877f2]" : ""
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Users className="w-4.5 h-4.5 fill-white text-white" />
          </div>
          <span className="truncate text-[13.5px] font-bold text-gray-900 dark:text-white">Groups</span>
        </button>

        {/* Events */}
        <button
          type="button"
          onClick={() => onTriggerAction("Events: Check upcoming live match events & community tournaments")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs hover:bg-gray-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Calendar className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="truncate text-[13.5px] font-bold text-gray-900 dark:text-white">Events</span>
        </button>

        {/* Gaming Video */}
        <button
          type="button"
          onClick={() => onSelectTab("watch")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs hover:bg-gray-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left ${
            activeTab === "watch" ? "bg-gray-200/90 dark:bg-zinc-800 text-[#1877f2]" : ""
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Gamepad2 className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="truncate text-[13.5px] font-bold text-gray-900 dark:text-white">Gaming Video</span>
        </button>

        {showMoreSuggested && (
          <>
            {/* Memories */}
            <button
              type="button"
              onClick={() => onSelectTab("memo")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs hover:bg-gray-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left ${
                activeTab === "memo" ? "bg-gray-200/90 dark:bg-zinc-800 text-[#1877f2]" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <History className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="truncate text-[13.5px] font-bold text-gray-900 dark:text-white">Memories</span>
            </button>

            {/* Pages */}
            <button
              type="button"
              onClick={() => onSelectTab("pages")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs hover:bg-gray-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left ${
                activeTab === "pages" ? "bg-gray-200/90 dark:bg-zinc-800 text-[#1877f2]" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Flag className="w-4.5 h-4.5 fill-white text-white" />
              </div>
              <span className="truncate text-[13.5px] font-bold text-gray-900 dark:text-white">Pages</span>
            </button>

            {/* Reels */}
            <button
              type="button"
              onClick={() => onSelectTab("watch")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs hover:bg-gray-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Film className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="truncate text-[13.5px] font-bold text-gray-900 dark:text-white">Reels</span>
            </button>

            {/* Saved */}
            <button
              type="button"
              onClick={() => onSelectTab("saved")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs hover:bg-gray-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left ${
                activeTab === "saved" ? "bg-gray-200/90 dark:bg-zinc-800 text-[#1877f2]" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bookmark className="w-4.5 h-4.5 fill-white text-white" />
              </div>
              <span className="truncate text-[13.5px] font-bold text-gray-900 dark:text-white">Saved</span>
            </button>
          </>
        )}

        {/* Toggle Expansion */}
        <button
          type="button"
          onClick={() => setShowMoreSuggested(!showMoreSuggested)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs hover:bg-gray-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 flex items-center justify-center shrink-0">
            {showMoreSuggested ? <ChevronUp className="w-4.5 h-4.5" /> : <ChevronDown className="w-4.5 h-4.5" />}
          </div>
          <span className="truncate text-[13.5px] font-bold text-gray-900 dark:text-white">
            {showMoreSuggested ? "See less" : "See more"}
          </span>
        </button>
      </div>

      <hr className="my-2 border-gray-200 dark:border-zinc-800" />

      {/* SECTION 3: Your Shortcuts */}
      <div className="space-y-0.5">
        <div className="px-3 py-1.5 text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Your shortcuts
        </div>

        {/* Shortcut 1 */}
        <button
          type="button"
          onClick={() => {
            onSelectTab("groups");
            onTriggerAction("Opened shortcut group: Drug Addiction Recovery Now!");
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs hover:bg-gray-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left group"
        >
          <img
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=80&q=80"
            alt="Drug Addiction Recovery Now!"
            className="w-8 h-8 rounded-lg object-cover shrink-0 border border-gray-200 dark:border-zinc-700"
          />
          <span className="truncate text-[13px] font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
            Drug Addiction Recovery Now!
          </span>
        </button>

        {/* Shortcut 2 */}
        <button
          type="button"
          onClick={() => {
            onSelectTab("groups");
            onTriggerAction("Opened shortcut group: Kalenjins On Facebook");
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs hover:bg-gray-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left group"
        >
          <img
            src="https://images.unsplash.com/photo-1517649763962-0c6232662000?auto=format&fit=crop&w=80&q=80"
            alt="Kalenjins On Facebook"
            className="w-8 h-8 rounded-lg object-cover shrink-0 border border-gray-200 dark:border-zinc-700"
          />
          <span className="truncate text-[13px] font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
            Kalenjins On Facebook
          </span>
        </button>

        {/* Shortcut 3 */}
        <button
          type="button"
          onClick={() => {
            onSelectTab("groups");
            onTriggerAction("Opened shortcut group: Bulala bwe baluhya ne baloma chisimo che lubukusu");
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs hover:bg-gray-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left group"
        >
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=80&q=80"
            alt="Bulala bwe baluhya ne baloma chisimo che lubukusu"
            className="w-8 h-8 rounded-lg object-cover shrink-0 border border-gray-200 dark:border-zinc-700"
          />
          <span className="truncate text-[13px] font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
            Bulala bwe baluhya ne baloma chisimo che lubukusu
          </span>
        </button>

        {/* Shortcut 4 */}
        <button
          type="button"
          onClick={() => {
            onSelectTab("groups");
            onTriggerAction("Opened shortcut group: Bungoma yetu");
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs hover:bg-gray-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left group"
        >
          <img
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=80&q=80"
            alt="Bungoma yetu"
            className="w-8 h-8 rounded-lg object-cover shrink-0 border border-gray-200 dark:border-zinc-700"
          />
          <span className="truncate text-[13px] font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
            Bungoma yetu
          </span>
        </button>
      </div>
    </div>
  );
};

export default LeftNavigationSidebar;
