"use client";
import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { callSplitter } from "@/lib/soroban";

export function PaymentSplitter() {
  const { publicKey } = useWallet();
  const [recipients, setRecipients] = useState<string[]>(["", ""]);
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    if (recipients.length < 10) setRecipients([...recipients, ""]);
  };

  const handleUpdate = (idx: number, val: string) => {
    const copy = [...recipients];
    copy[idx] = val;
    setRecipients(copy);
  };

  const handleSplit = async () => {
    if (!publicKey) return setError("Wallet not connected");
    const validRecipients = recipients.filter(r => r.length === 56 && r.startsWith("G"));
    if (validRecipients.length < 2) return setError("Need at least 2 valid recipients");
    if (!amount || isNaN(Number(amount))) return setError("Invalid amount");

    setLoading(true);
    setError(null);
    setHash(null);
    
    const token = process.env.NEXT_PUBLIC_SDT_TOKEN_ADDRESS || "CDLZFC3SYJYDZT7K67VZ75HPJVIEWBNIVCQRGF7Y78O9G2K3K64P9U5Q";

    const res = await callSplitter(publicKey, token, validRecipients, Number(amount));
    if (res.success && res.hash) {
      setHash(res.hash);
    } else {
      setError(res.error || "Failed to split");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded bg-white text-black shadow-sm">
      <h3 className="text-lg font-bold mb-4">Payment Splitter</h3>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Total Amount (in basic units)</label>
        <input 
          className="w-full border p-2 rounded text-black" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          placeholder="e.g. 10000000" 
        />
      </div>
      
      <div className="mb-4 flex flex-col gap-2">
        <label className="block text-sm font-semibold">Recipients (up to 10)</label>
        {recipients.map((r, i) => (
          <input 
            key={i} 
            className="w-full border p-2 rounded text-black text-sm" 
            value={r} 
            onChange={(e) => handleUpdate(i, e.target.value)} 
            placeholder={`Recipient ${i+1} G...`} 
          />
        ))}
        {recipients.length < 10 && (
          <button onClick={handleAdd} className="text-blue-500 text-sm self-start">+ Add Recipient</button>
        )}
      </div>

      <button 
        onClick={handleSplit} 
        disabled={loading || !publicKey}
        className="w-full py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        {loading ? "Splitting..." : "Split Payment"}
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
