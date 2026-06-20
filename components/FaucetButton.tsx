"use client";
import { useState } from "react";
import { useWallet } from "@/context/WalletContext";

export function FaucetButton() {
  const { publicKey, triggerRefresh } = useWallet();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!publicKey) return null;

  const fundAccount = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`https://friendbot.stellar.org/?addr=${publicKey}`);
      if (res.ok) {
        setMessage("Account funded successfully!");
        triggerRefresh();
      } else {
        setMessage("Failed to fund account.");
      }
    } catch (e) {
      setMessage("Error contacting friendbot.");
    }
    setLoading(false);
  };

  return (
    <div className="mt-4 flex flex-col items-center">
      <button 
        onClick={fundAccount} 
        disabled={loading}
        className="w-full px-4 py-2 bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:bg-[var(--bg-sunken)] border border-[var(--border-medium)] rounded font-medium transition shadow-[0_1px_3px_rgba(43,38,32,0.06)]"
      >
        {loading ? "Funding..." : "Fund with Friendbot"}
      </button>
      {message && (
        <p className={`text-sm mt-2 px-3 py-1 rounded border ${message.includes("success") ? "text-[var(--success)] bg-[var(--success-bg)] border-[var(--success-border)]" : "text-[var(--error)] bg-[var(--error-bg)] border-[var(--error-border)]"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
