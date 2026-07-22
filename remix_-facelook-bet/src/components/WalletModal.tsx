import React, { useState, useEffect } from "react";
import { X, ArrowDownRight, ArrowUpRight, Check, Coins, Plus, Wallet, Sparkles, Loader2, Landmark, Smartphone } from "lucide-react";

interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "bet_stake" | "bet_win";
  amount: number;
  time: string;
  target: string;
}

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  onDeposit: (amt: number) => void;
  onWithdraw: (amt: number) => void;
  transactions: Array<Transaction>;
}

export default function WalletModal({
  isOpen,
  onClose,
  walletBalance,
  onDeposit,
  onWithdraw,
  transactions,
}: WalletModalProps) {
  const [activeSegment, setActiveSegment] = useState<"deposit" | "withdraw" | "logs">("deposit");
  const [amount, setAmount] = useState<string>("50");
  const [phoneText, setPhoneText] = useState("0712345678");
  const [carrierNetwork, setCarrierNetwork] = useState<"MPESA" | "AIRTEL">("MPESA");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // M-PESA STK Push Simulation States
  const [stkState, setStkState] = useState<"idle" | "sending" | "pushed" | "completed">("idle");
  const [stkPin, setStkPin] = useState("");

  if (!isOpen) return null;

  // Auto-fill or adjust phone format
  const detectAndSetNetwork = (val: string) => {
    setPhoneText(val);
    const safaricomPrefixes = ["070", "071", "072", "074", "079", "0110", "0111", "0112", "0113", "0114", "0115"];
    const airtelPrefixes = ["073", "075", "078", "0100", "0101"];
    const cleaned = val.replace(/\s+/g, "");
    const isAir = airtelPrefixes.some(p => cleaned.startsWith(p));
    if (isAir) {
      setCarrierNetwork("AIRTEL");
    } else {
      setCarrierNetwork("MPESA");
    }
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    setStkState("sending");

    // Simulate MPESA API Daraja endpoint handshake
    setTimeout(() => {
      setLoading(false);
      setStkState("pushed"); // STK prompt pops up
    }, 1500);
  };

  const handleSTKPinAuthorize = () => {
    if (stkPin.length < 4) {
      alert("Enter a valid 4-digit PIN");
      return;
    }
    setLoading(true);
    // Simulate transaction callback from Safaricom MPESA servers
    setTimeout(() => {
      const parsed = parseFloat(amount);
      onDeposit(parsed);
      setLoading(false);
      setStkState("completed");
      setSuccessMsg(`MPESA STK Push Approved! $${parsed.toFixed(2)} credited via Daraja C2B (TX: MP${Math.random().toString(36).substr(2,8).toUpperCase()}).`);
      setStkPin("");
      setTimeout(() => {
        setStkState("idle");
        setSuccessMsg("");
      }, 4000);
    }, 1200);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (parsed > walletBalance) {
      alert("Insufficient balance for withdrawal.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      onWithdraw(parsed);
      setLoading(false);
      setSuccessMsg(`Withdrawal of $${parsed.toFixed(2)} successfully sent to MPESA Registered Name! (B2C processed safely)`);
      setTimeout(() => {
        setSuccessMsg("");
      }, 4000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[1000] flex justify-center items-center p-4">
      <div className="bg-white dark:bg-[#242526] w-full max-w-md rounded-xl p-6 shadow-2xl border border-gray-200 dark:border-[#3e4042] flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-150 relative overflow-hidden">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5 pb-3 border-b border-gray-150 dark:border-[#3e4042]">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-full flex justify-center items-center mx-auto mb-2 relative">
            <Wallet className="w-6 h-6" />
            <Coins className="w-3.5 h-3.5 text-amber-500 absolute bottom-1 right-1" />
          </div>
          <h2 className="text-xl font-extrabold text-[#050505] dark:text-[#e4e6eb] leading-none">Deposit & Withdrawal Hub</h2>
          <p className="text-xs text-gray-500 mt-1">Coherent MPESA API Integration</p>
          <div className="mt-3 text-3xl font-black text-[#1877f2] dark:text-blue-400 font-mono">
            ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">Escrow Account balance</span>
        </div>

        {/* Buttons Action Toggle */}
        <div className="grid grid-cols-3 gap-1.5 bg-gray-100 dark:bg-[#18191a] p-1 rounded-lg mb-4">
          <button
            onClick={() => { setActiveSegment("deposit"); setStkState("idle"); }}
            className={`py-1.5 text-xs font-bold rounded-md transition-all ${
              activeSegment === "deposit" ? "bg-emerald-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Deposit Funds
          </button>
          <button
            onClick={() => { setActiveSegment("withdraw"); setStkState("idle"); }}
            className={`py-1.5 text-xs font-bold rounded-md transition-all ${
              activeSegment === "withdraw" ? "bg-red-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Withdrawal
          </button>
          <button
            onClick={() => { setActiveSegment("logs"); setStkState("idle"); }}
            className={`py-1.5 text-xs font-bold rounded-md transition-all ${
              activeSegment === "logs" ? "bg-white dark:bg-[#242526] text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500"
            }`}
          >
            Ledger
          </button>
        </div>

        {/* Tabs Contents */}
        <div className="flex-1 overflow-y-auto min-h-[240px]">
          {successMsg && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300 border border-green-200 dark:border-green-900/40 rounded-xl text-xs font-semibold leading-relaxed animate-in slide-in-from-top duration-150">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* DEPOSIT FORM */}
          {activeSegment === "deposit" && stkState === "idle" && (
            <form onSubmit={handleDepositSubmit} className="space-y-4 text-left">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  Safaricom MPESA Daraja API Active
                </span>
                <span className="opacity-75 text-[11px]">1 USD ≈ 130 KSh</span>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Choose Mobile Partner
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setCarrierNetwork("MPESA")}
                    className={`p-2.5 rounded-lg border text-center flex items-center justify-center gap-1.5 transition-all ${
                      carrierNetwork === "MPESA"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-gray-50 dark:bg-[#18191a] border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50"
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-green-500" fill={carrierNetwork === "MPESA" ? "white" : "green"} /> Safaricom MPESA
                  </button>
                  <button
                    type="button"
                    onClick={() => setCarrierNetwork("AIRTEL")}
                    className={`p-2.5 rounded-lg border text-center flex items-center justify-center gap-1.5 transition-all ${
                      carrierNetwork === "AIRTEL"
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-gray-50 dark:bg-[#18191a] border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50"
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-red-500" fill={carrierNetwork === "AIRTEL" ? "white" : "red"} /> Airtel Money
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Kenyan Mobile Number
                </label>
                <input
                  type="text"
                  value={phoneText}
                  onChange={(e) => detectAndSetNetwork(e.target.value)}
                  placeholder="e.g. 0712345678"
                  className="w-full bg-gray-50 dark:bg-[#18191a] text-gray-900 dark:text-white border border-gray-200 dark:border-[#3e4042] rounded-lg p-2 text-xs font-mono font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Deposit Amount ($ USD Equivalent)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-sm font-bold text-gray-400">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    className="w-full bg-gray-50 dark:bg-[#18191a] text-gray-900 dark:text-white border border-gray-200 dark:border-[#3e4042] rounded-lg p-2 pl-7 text-xs font-black outline-none font-mono"
                  />
                  <span className="absolute right-3.5 top-2.5 text-[10px] text-gray-400 font-mono">
                    ≈ {(parseFloat(amount || "0") * 130).toLocaleString()} KSh
                  </span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {["10", "50", "100", "250"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className="flex-1 py-1 text-[10px] border border-gray-200 dark:border-zinc-800 rounded bg-gray-55 dark:bg-[#1c1d1e] text-gray-650 font-mono hover:bg-gray-100"
                    >
                      +${preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#31a24c] hover:bg-[#28873e] text-white font-black text-xs rounded-lg transition-colors flex items-center justify-center gap-1 shadow-md"
                >
                  <Plus className="w-4 h-4" /> Trigger MPESA Deposit
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveSegment("withdraw"); }}
                  className="px-4 py-2.5 bg-red-650 hover:bg-red-700 text-red-100 hover:text-white font-bold text-xs rounded-lg border border-red-200/40 transition-colors"
                >
                  Withdraw instead
                </button>
              </div>
            </form>
          )}

          {/* STK PUSH WAITING DIALOG SIMULATION */}
          {activeSegment === "deposit" && stkState === "sending" && (
            <div className="py-12 text-center space-y-4">
              <Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto" />
              <div>
                <h4 className="font-extrabold text-sm text-gray-800 dark:text-gray-100">Contacting Safaricom Daraja API...</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">Please wait while our payment gateway pushes a secure STK request to {phoneText}.</p>
              </div>
            </div>
          )}

          {/* SIMULATED MPESA MOBILE STK PROMPT POPUP */}
          {activeSegment === "deposit" && stkState === "pushed" && (
            <div className="p-5 bg-zinc-900 border border-zinc-800 text-white rounded-xl space-y-4 text-left my-2 relative animate-in zoom-in duration-200">
              <div className="absolute top-2 right-2 bg-green-600 text-white text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-full font-black">
                SIMULATOR
              </div>
              
              <div className="flex items-center gap-2 mb-1.5 pb-2 border-b border-zinc-800">
                <Landmark className="w-5 h-5 text-green-400" />
                <span className="font-mono text-xs font-black uppercase text-green-400">M-PESA Paybill 788220</span>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                  Do you want to pay <strong className="text-white">KSh {(parseFloat(amount || "0") * 130).toLocaleString()}</strong> to <strong className="text-white">LOOKGROUPS BET CLAN COOP</strong>?
                </p>
                <p className="text-[10px] text-zinc-400 font-mono italic">Account: COLLINS DNEGO</p>
              </div>

              <div>
                <label className="block text-[8px] font-mono tracking-widest text-[#a1a1aa] mb-1">
                  ENTER 4-DIGIT M-PESA PIN:
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={stkPin}
                  onChange={(e) => setStkPin(e.target.value)}
                  placeholder="PIN"
                  className="w-24 bg-zinc-950 text-white border border-zinc-700 rounded p-1.5 mb-1.5 font-black text-center outline-none tracking-widest font-mono focus:border-green-500 text-xs"
                />
                <p className="text-[9px] text-zinc-500">For mock testing, enter any 4 digits (e.g. 1234).</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSTKPinAuthorize}
                  disabled={loading}
                  className="flex-1 py-1.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-[11px] rounded"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : "Confirm & Send"}
                </button>
                <button
                  type="button"
                  onClick={() => setStkState("idle")}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-705 text-zinc-300 font-extrabold text-[11px] rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* STK COMPLETED SUCCESS */}
          {activeSegment === "deposit" && stkState === "completed" && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                <Check className="w-9 h-9" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-gray-800 dark:text-gray-100">Transaction Confirmed!</h4>
                <p className="text-xs text-gray-500 mt-1">Safaricom MPESA completed. Ledger synchronized successfully.</p>
              </div>
              <button
                type="button"
                onClick={() => setStkState("idle")}
                className="py-1.5 px-4 bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-lg"
              >
                Done
              </button>
            </div>
          )}

          {/* WITHDRAW FORM */}
          {activeSegment === "withdraw" && (
            <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-left">
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 rounded-lg flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  Fast MPESA B2C Withdrawal System
                </span>
                <span className="opacity-75">Instant settlement</span>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Kenyan Mobile Number
                </label>
                <input
                  type="text"
                  value={phoneText}
                  onChange={(e) => setPhoneText(e.target.value)}
                  placeholder="e.g. 0712345678"
                  className="w-full bg-gray-50 dark:bg-[#18191a] text-gray-900 dark:text-white border border-gray-200 dark:border-[#3e4042] rounded-lg p-2 text-xs font-mono font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Withdrawal Amount ($ USD Equivalent)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-sm font-bold text-gray-400">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    max={walletBalance}
                    min="1"
                    className="w-full bg-gray-50 dark:bg-[#18191a] text-gray-900 dark:text-white border border-gray-200 dark:border-[#3e4042] rounded-lg p-2 pl-7 text-xs font-black outline-none font-mono"
                  />
                  <span className="absolute right-3.5 top-2.5 text-[10px] text-gray-400 font-mono">
                    ≈ {(parseFloat(amount || "0") * 130).toLocaleString()} KSh
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-red-650 hover:bg-red-700 text-white font-black text-xs rounded-lg transition-colors flex justify-center items-center gap-1 shadow-md"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initiate MPESA Withdrawal"}
              </button>
            </form>
          )}

          {/* LEDGER LOGS */}
          {activeSegment === "logs" && (
            <div className="space-y-2 text-left">
              {transactions.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">
                  No transaction expense or deposit history logged yet.
                </div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="p-3 bg-gray-50 dark:bg-[#18191a] rounded-lg border border-gray-150 dark:border-zinc-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-full ${
                        tx.type === "deposit" || tx.type === "bet_win" 
                          ? "bg-green-100 dark:bg-green-950/40 text-green-600" 
                          : "bg-red-100 dark:bg-red-950/40 text-red-500"
                      }`}>
                        {tx.type === "deposit" || tx.type === "bet_win" ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span className="block font-extrabold text-gray-800 dark:text-gray-200 uppercase text-[9px] font-mono leading-none mb-1">
                          {tx.type === "deposit" ? "MPESA DEPOSIT" : tx.type === "withdraw" ? "MPESA WITHDRAW" : tx.type}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono block max-w-[200px] truncate">{tx.target}</span>
                      </div>
                    </div>
                    <div className={`font-mono font-black ${
                      tx.type === "deposit" || tx.type === "bet_win" ? "text-green-600" : "text-red-500"
                    }`}>
                      {tx.type === "deposit" || tx.type === "bet_win" ? "+" : "-"}${tx.amount.toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
