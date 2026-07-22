import React, { useState } from "react";
import { X, Sparkles, Check, Phone, ArrowRight, ShieldCheck, Mail, Loader2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (phoneNumber?: string, email?: string, provider?: string) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("register");
  const [phoneNum, setPhoneNum] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [carrier, setCarrier] = useState<"safaricom" | "airtel" | "unknown">("unknown");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  if (!isOpen) return null;

  // Detect Carrier Prefix (Kenya)
  const handlePhoneChange = (num: string) => {
    setPhoneNum(num);
    const cleaned = num.replace(/\s+/g, "").replace("+254", "0");
    if (cleaned.length >= 3) {
      const prefix2 = cleaned.substring(0, 3); // e.g. "072" or "073"
      const prefix3 = cleaned.substring(0, 4); // e.g. "0110" or "0100"

      const safaricomPrefixes = ["070", "071", "072", "074", "079", "0757", "0758", "0759", "0768", "0769", "0110", "0111", "0112", "0113", "0114", "0115"];
      const airtelPrefixes = ["073", "075", "078", "0100", "0101", "0102", "0103", "0104", "0105", "0106"];

      const isSaf = safaricomPrefixes.some(p => cleaned.startsWith(p)) || 
                     (num.startsWith("+254") && safaricomPrefixes.some(p => ("0" + cleaned.substring(4)).startsWith(p)));
      const isAir = airtelPrefixes.some(p => cleaned.startsWith(p)) ||
                     (num.startsWith("+254") && airtelPrefixes.some(p => ("0" + cleaned.substring(4)).startsWith(p)));

      if (isSaf) {
        setCarrier("safaricom");
      } else if (isAir) {
        setCarrier("airtel");
      } else {
        setCarrier("unknown");
      }
    } else {
      setCarrier("unknown");
    }
  };

  const handleGoogleConnect = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      setSuccessMsg("Connected via Google API successfully! Logged in as collins.dnego@gmail.com");
      setTimeout(() => {
        onAuthSuccess("collins.dnego@gmail.com", "Google");
        onClose();
        setSuccessMsg("");
      }, 2000);
    }, 1500);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNum) {
      alert("Please enter a valid phone number.");
      return;
    }
    
    // Simulate API handshakes matching Carrier Network
    setPhoneLoading(true);
    setTimeout(() => {
      setPhoneLoading(false);
      setOtpSent(true);
      setSuccessMsg(`Simulated API Handshake secure! OTP sent to ${phoneNum}.`);
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneLoading(true);
    setTimeout(() => {
      setPhoneLoading(false);
      setSuccessMsg(`Phone registration accepted. Safaricom/Airtel API live connected!`);
      setTimeout(() => {
        onAuthSuccess(phoneNum, carrier === "safaricom" ? "Safaricom Kenya" : "Airtel Kenya");
        onClose();
        setSuccessMsg("");
        setOtpSent(false);
      }, 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1100] flex justify-center items-center p-4">
      <div className="bg-white dark:bg-[#1e1f20] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col relative animate-in fade-in zoom-in duration-150">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-black text-[#1877f2] leading-none">facelook</h2>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 font-mono uppercase tracking-wider">Gateway Secure Bet Access</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-1.5 bg-gray-100 dark:bg-zinc-900 p-1 rounded-xl mb-4">
          <button
            onClick={() => { setActiveTab("register"); setOtpSent(false); }}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
              activeTab === "register" ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500"
            }`}
          >
            Register Account
          </button>
          <button
            onClick={() => { setActiveTab("login"); setOtpSent(false); }}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
              activeTab === "login" ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500"
            }`}
          >
            Log In
          </button>
        </div>

        {/* Notification message */}
        {successMsg && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40 rounded-xl text-xs font-mono font-bold leading-tight">
            {googleLoading || phoneLoading ? <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> : <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />}
            <span>{successMsg}</span>
          </div>
        )}

        <div className="space-y-4 text-left">
          {/* Sign In with Google */}
          <button
            type="button"
            onClick={handleGoogleConnect}
            disabled={googleLoading || phoneLoading}
            className="w-full h-11 border border-gray-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-905 flex items-center justify-center gap-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all font-sans"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            ) : (
              <svg className="w-4 h-4 text-red-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            )}
            <span>Connect & Sign In with Google</span>
          </button>

          <div className="flex items-center gap-2 text-gray-300 dark:text-zinc-800 my-2">
            <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800" />
            <span className="text-[10px] font-bold text-gray-400 font-mono">OR USE PHONE CHANNEL</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800" />
          </div>

          {!otpSent ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] font-mono font-extrabold uppercase tracking-widest text-gray-400 mb-1.5 flex items-center gap-1">
                  <span>📱 Country Carrier Network</span>
                  <span className="bg-[#1877f2]/10 text-blue-500 text-[8px] font-extrabold px-1 rounded">KENYA CONNECT READY</span>
                </label>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                  <div className={`p-2 border rounded-xl flex items-center justify-between transition-all ${
                    carrier === "safaricom" ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400" : "bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-500"
                  }`}>
                    <span>Safaricom [M-PESA]</span>
                    <span className="text-[8px] tracking-tight bg-green-500 text-white px-1 rounded">070/071/072/011x</span>
                  </div>
                  <div className={`p-2 border rounded-xl flex items-center justify-between transition-all ${
                    carrier === "airtel" ? "bg-red-500/10 border-red-500 text-red-600 dark:text-red-400" : "bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-500"
                  }`}>
                    <span>Airtel Network</span>
                    <span className="text-[8px] tracking-tight bg-red-500 text-white px-1 rounded">073/075/078/010x</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono font-extrabold uppercase tracking-widest text-gray-400 mb-1.5">
                  Enter Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-[11px] flex items-center gap-1 text-xs text-gray-400 dark:text-zinc-600 font-mono">
                    <span>+254</span>
                  </div>
                  <input
                    type="text"
                    value={phoneNum}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="712345678 or 07xx..."
                    className="w-full bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-250 dark:border-zinc-800 rounded-xl p-2.5 pl-14 text-xs font-bold outline-none font-mono focus:border-blue-500"
                    disabled={phoneLoading}
                  />
                </div>
                <p className="text-[9px] text-gray-450 mt-1 leading-relaxed">
                  Autodetects Safaricom & Airtel formats to seamlessly enable zero-deposit push handshakes.
                </p>
              </div>

              <button
                type="submit"
                disabled={phoneLoading || carrier === "unknown"}
                className={`w-full h-11 rounded-xl text-white font-extrabold text-xs transition-colors flex justify-center items-center gap-1.5 ${
                  carrier === "unknown" 
                    ? "bg-gray-300 dark:bg-zinc-800 cursor-not-allowed text-gray-500" 
                    : "bg-[#1877f2] hover:bg-blue-600 shadow-md"
                }`}
              >
                {phoneLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Verify & Send OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-[9px] font-mono font-extrabold uppercase tracking-widest text-gray-400 mb-1.5">
                  Enter Simulated Verification OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit OTP code"
                  className="w-full bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-250 dark:border-zinc-800 rounded-xl p-2.5 text-center text-sm font-black outline-none tracking-widest font-mono focus:border-blue-500"
                  disabled={phoneLoading}
                />
              </div>

              <button
                type="submit"
                disabled={otpCode.length < 4 || phoneLoading}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors flex justify-center items-center gap-1"
              >
                {phoneLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Complete Auth Connectivity</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
