"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { getCount, callIncrement } from "@/lib/soroban";

export function ContractCounter() {
  const { publicKey } = useWallet();
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCount();
  }, []);

  const fetchCount = async () => {
    const val = await getCount();
    setCount(val);
  };

  const handleIncrement = async () => {
    if (!publicKey) return setError("Wallet not connected");
    setLoading(true);
    setError(null);
    setHash(null);
    const res = await callIncrement(publicKey);
    if (res.success && res.hash) {
      setHash(res.hash);
      setTimeout(fetchCount, 4000); // Wait for network
    } else {
      setError(res.error || "Failed to increment");
    }
    setLoading(false);
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-soft)] shadow-[0_1px_3px_rgba(43,38,32,0.06)] p-4 rounded-2xl text-[var(--text-primary)]">
      <h2 className="text-lg font-bold mb-4">Counter Contract</h2>
      <p className="mb-4 text-[var(--text-secondary)]">Current Count: {count !== null ? count : "Loading..."}</p>
      
      <button 
        onClick={handleIncrement} 
        disabled={loading || !publicKey}
        className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded transition disabled:opacity-50 shadow-[0_1px_3px_rgba(43,38,32,0.06)]"
      >
        {loading ? "Incrementing..." : "Increment Count"}
      </button>

      {error && <p className="text-[var(--error)] text-sm mt-4 bg-[var(--error-bg)] border border-[var(--error-border)] px-3 py-2 rounded">{error}</p>}
      {hash && (
        <p className="mt-4 p-3 bg-[var(--success-bg)] border border-[var(--success-border)] rounded text-sm text-[var(--success)]">
          Success! Hash: <a href={`https://stellar.expert/explorer/testnet/tx/${hash}`} target="_blank" rel="noreferrer" className="font-bold underline decoration-[var(--success)] underline-offset-2">{hash.slice(0,10)}...</a>
        </p>
      )}
    </div>
  );
}
