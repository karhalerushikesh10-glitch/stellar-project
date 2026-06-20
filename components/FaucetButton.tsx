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
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition"
      >
        {loading ? "Funding..." : "Fund with Friendbot"}
      </button>
      {message && <p className="text-sm mt-2 text-gray-700">{message}</p>}
    </div>
  );
}
