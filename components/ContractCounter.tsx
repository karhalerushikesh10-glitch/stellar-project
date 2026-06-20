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
    <div className="p-4 border rounded bg-white text-black shadow-sm">
      <h3 className="text-lg font-bold mb-2">Counter Contract</h3>
      <p className="text-gray-600 mb-4">Current Count: {count !== null ? count : "Loading..."}</p>
      
      <button 
        onClick={handleIncrement} 
        disabled={loading || !publicKey}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? "Incrementing..." : "Increment Count"}
      </button>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      {hash && (
        <p className="text-green-500 mt-2 text-sm">
          Success! Hash: <a href={`https://stellar.expert/explorer/testnet/tx/${hash}`} target="_blank" rel="noreferrer" className="underline">{hash.slice(0,10)}...</a>
        </p>
      )}
    </div>
  );
}
