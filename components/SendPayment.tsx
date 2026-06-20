"use client";
import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { sendXLM } from "@/lib/transactions";

export function SendPayment() {
  const { publicKey, triggerRefresh } = useWallet();
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{success: boolean, hash?: string, error?: string} | null>(null);

  if (!publicKey) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const res = await sendXLM(publicKey, destination, amount);
    setResult(res);
    if (res.success) {
      triggerRefresh();
      setDestination("");
      setAmount("");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 text-[var(--text-primary)]">
      <h2 className="text-xl font-bold mb-4">Send XLM</h2>
      <form onSubmit={handleSend} className="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="Destination (G...)" 
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          className="w-full bg-[var(--bg-sunken)] border border-[var(--border-medium)] rounded p-2 text-[var(--text-primary)] placeholder-[var(--text-hint)] focus:outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(194,112,61,0.12)] transition"
        />
        <input 
          type="number" 
          placeholder="Amount (XLM)" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full bg-[var(--bg-sunken)] border border-[var(--border-medium)] rounded p-2 text-[var(--text-primary)] placeholder-[var(--text-hint)] focus:outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(194,112,61,0.12)] transition"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded transition disabled:opacity-50 shadow-[0_1px_3px_rgba(43,38,32,0.06)]"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
      
      {result && (
        <div className={`mt-4 p-4 rounded break-all border ${result.success ? "bg-[var(--success-bg)] border-[var(--success-border)] text-[var(--success)]" : "bg-[var(--error-bg)] border-[var(--error-border)] text-[var(--error)]"}`}>
          {result.success ? (
            <p>
              Success! Hash:{" "}
              <a 
                href={`https://stellar.expert/explorer/testnet/tx/${result.hash}`} 
                target="_blank" 
                rel="noreferrer"
                className="font-bold underline decoration-[var(--success)] underline-offset-2"
              >
                {result.hash}
              </a>
            </p>
          ) : (
            <p>Error: {result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
