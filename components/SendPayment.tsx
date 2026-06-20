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
    <div className="p-6 bg-white rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4 text-black">Send XLM</h2>
      <form onSubmit={handleSend} className="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="Destination Address" 
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          className="border p-2 rounded text-black"
        />
        <input 
          type="text" 
          placeholder="Amount" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="border p-2 rounded text-black"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 transition"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
      
      {result && (
        <div className={`mt-4 p-4 rounded break-all ${result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {result.success ? (
            <p>
              Success! Hash:{" "}
              <a 
                href={`https://stellar.expert/explorer/testnet/tx/${result.hash}`} 
                target="_blank" 
                rel="noreferrer"
                className="underline"
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
