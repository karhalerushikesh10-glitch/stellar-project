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
    <div className="bg-[var(--bg-surface)] border border-[var(--border-soft)] shadow-[0_1px_3px_rgba(43,38,32,0.06)] p-4 rounded-2xl text-[var(--text-primary)]">
      <h2 className="text-lg font-bold mb-4">Payment Splitter</h2>
      <div className="mb-4">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Total Amount (in basic units)</label>
        <input 
          className="w-full bg-[var(--bg-sunken)] border border-[var(--border-medium)] rounded p-2 mt-1 text-[var(--text-primary)] placeholder-[var(--text-hint)] focus:outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(194,112,61,0.12)] transition"
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          placeholder="e.g. 10000000" 
        />
      </div>
      
      <div className="mb-4 flex flex-col gap-2">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Recipients (up to 10)</label>
        {recipients.map((r, i) => (
          <input 
            key={i} 
            className="w-full bg-[var(--bg-sunken)] border border-[var(--border-medium)] rounded p-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-hint)] focus:outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(194,112,61,0.12)] transition"
            value={r} 
            onChange={(e) => handleUpdate(i, e.target.value)} 
            placeholder={`Recipient ${i+1} G...`} 
          />
        ))}
        {recipients.length < 10 && (
          <button onClick={handleAdd} className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] text-left transition mt-1">+ Add Recipient</button>
        )}
      </div>

      <button 
        onClick={handleSplit} 
        disabled={loading || !publicKey}
        className="w-full px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded transition disabled:opacity-50 shadow-[0_1px_3px_rgba(43,38,32,0.06)]"
      >
        {loading ? "Splitting..." : "Split Payment"}
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
