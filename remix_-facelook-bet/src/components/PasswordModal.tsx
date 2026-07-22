import React, { useState } from "react";
import { Lock, AlertCircle, X } from "lucide-react";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PasswordModal({
  isOpen,
  onClose,
  onSuccess,
}: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1234") {
      setErrorMsg("");
      setPassword("");
      onSuccess();
      onClose();
    } else {
      setErrorMsg("Incorrect authentication PIN. Try: 1234");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-[1000] flex justify-center items-center p-4">
      <div className="bg-white dark:bg-[#242526] w-full max-w-sm rounded-xl p-6 shadow-2xl border border-gray-200 dark:border-[#3e4042] relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/40 text-blue-600 rounded-full flex justify-center items-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-[#050505] dark:text-[#e4e6eb]">Security Authentication</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Accessing private wallet transactions and interactive challenger contacts requires verification.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-1">
              Enter Credentials PIN
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter PIN (e.g. 1234)"
              required
              className="w-full bg-gray-50 dark:bg-[#18191a] text-gray-900 dark:text-white border border-gray-200 dark:border-[#3e4042] rounded-lg p-2.5 text-center text-lg font-mono font-bold outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-2.5 bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-300 rounded-lg text-xs font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm shadow-md"
          >
            Authenticate Credentials
          </button>
        </form>
      </div>
    </div>
  );
}
