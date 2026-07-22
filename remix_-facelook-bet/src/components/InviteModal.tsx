import { useState, useEffect } from "react";
import { X, Check, Users, Sparkles } from "lucide-react";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSendoffEnabled: boolean;
  sendoffsCount: number;
  matchName: string;
  onSendInvites: (invitedCount: number, friends: string[]) => void;
}

export default function InviteModal({
  isOpen,
  onClose,
  isSendoffEnabled,
  sendoffsCount,
  matchName,
  onSendInvites,
}: InviteModalProps) {
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  // List of active social friends in our community
  const socialFriends = [
    "David T.", "Sarah L.", "Michael B.", "Emma W.", "John M.", 
    "Mike R.", "Lisa M.", "Alex G.", "Chris Evans", "Marcus_88", 
    "CryptoKing", "Sam D.", "Rachel Green", "Tom Hardy", "Peter Parker"
  ];

  // Derive maximum allowed invites
  const getMaxInvites = () => {
    if (!isSendoffEnabled) return 15; // Allow inviting multiple buddies at a payable price
    return sendoffsCount * 10; // Rule: 1 Sendoff = 5 Guaranteed matches + 5 Backup invites (so up to 10 invites)
  };

  const getGuaranteedSpots = () => {
    return isSendoffEnabled ? sendoffsCount * 5 : 1;
  };

  const maxAllowed = getMaxInvites();

  const toggleAllFriends = (checked: boolean) => {
    if (checked) {
      setSelectedFriends(socialFriends.slice(0, maxAllowed));
    } else {
      setSelectedFriends([]);
    }
  };

  const handleToggleFriend = (friend: string) => {
    if (selectedFriends.includes(friend)) {
      setSelectedFriends(selectedFriends.filter((f) => f !== friend));
    } else {
      if (selectedFriends.length >= maxAllowed) {
        alert(`You have reached the maximum invitation limit of ${maxAllowed} friend(s) based on your look-upto configurations.`);
        return;
      }
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  const handleSend = () => {
    if (selectedFriends.length === 0) {
      alert("Please select at least one friend to invite.");
      return;
    }
    onSendInvites(selectedFriends.length, selectedFriends);
    setSelectedFriends([]);
    onClose();
  };

  useEffect(() => {
    setSelectedFriends([]);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[1000] flex justify-center items-center p-4">
      <div className="bg-white dark:bg-[#242526] w-full max-w-md rounded-xl p-6 shadow-2xl border border-gray-200 dark:border-[#3e4042] flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-150">
        <div className="flex justify-between items-center pb-3 border-b border-gray-150 dark:border-[#3e4042]">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              👥 Propose Challenge to Friends
            </h2>
            <p className="text-xs text-blue-500 font-bold mt-1.5 flex items-center gap-1 leading-none">
              <Sparkles className="w-3.5 h-3.5 fill-blue-500 text-blue-500" /> Matches: {matchName}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-[#323334] rounded-full text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Bounds readout */}
        <div className="my-4 p-3 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40 rounded-lg text-xs leading-relaxed text-blue-900 dark:text-blue-200 select-none">
          {isSendoffEnabled ? (
            <div>
              <strong>🚀 Sendoffs Tool Enabled ({sendoffsCount} count)</strong><br />
              Guaranteed peer spots: <strong className="text-blue-700 dark:text-blue-400">{getGuaranteedSpots()}</strong>. Total invites limit: <strong className="text-blue-700 dark:text-blue-400">{maxAllowed}</strong> (Backup invites will be queued in priority order as offers are accepted!).
            </div>
          ) : (
            <div>
              <strong>ℹ️ Standard LookUpto Challenge</strong><br />
              Allows up to {maxAllowed} targeted peer challenge invitations at a payable price per buddy. Enable the <strong>Sendoff Tool</strong> in the LookUpto engine to invite larger circles of friends dynamically with marketing tools!
            </div>
          )}
        </div>

        {/* Select All Checkbox */}
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-[#3e4042] mb-3">
          <input
            type="checkbox"
            id="select-all-cb"
            checked={selectedFriends.length > 0 && selectedFriends.length === Math.min(socialFriends.length, maxAllowed)}
            onChange={(e) => toggleAllFriends(e.target.checked)}
            className="w-4 h-4 rounded text-[#1877f2] border-gray-300 focus:ring-[#1877f2] cursor-pointer"
          />
          <label htmlFor="select-all-cb" className="text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer flex-1">
            Toggle All Eligible (up to {maxAllowed} limit)
          </label>
          <span className="text-[10px] font-mono text-gray-400 font-bold">
            {selectedFriends.length} / {maxAllowed} selected
          </span>
        </div>

        {/* List scroll */}
        <div className="flex-1 overflow-y-auto space-y-1 mb-4 border border-gray-150 dark:border-[#3e4042] rounded-lg p-1">
          {socialFriends.map((friend, idx) => {
            const isSelected = selectedFriends.includes(friend);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleToggleFriend(friend)}
                className={`w-full flex items-center justify-between p-2 rounded-md transition-all text-left ${
                  isSelected 
                    ? "bg-blue-500/10 text-blue-600 font-semibold" 
                    : "hover:bg-gray-50 dark:hover:bg-[#323334] text-gray-700 dark:text-gray-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(friend)}&backgroundColor=1877f2`} className="w-7 h-7 rounded-full object-cover" alt="avatar" />
                  <span className="text-xs font-medium">{friend}</span>
                </div>
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 bg-white dark:bg-zinc-800"
                }`}>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleSend}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md"
        >
          <Users className="w-4 h-4" /> Propose & Match {selectedFriends.length} friend(s)
        </button>
      </div>
    </div>
  );
}
