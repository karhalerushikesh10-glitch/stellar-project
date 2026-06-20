"use client";
import { useEffect, useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { getXLMBalance } from "@/lib/stellar";

export function BalanceCard() {
  const { publicKey, refreshTrigger } = useWallet();
  const [balance, setBalance] = useState<string>("0.0000");

  useEffect(() => {
    if (!publicKey) {
      setBalance("0.0000");
      return;
    }

    const fetchBalance = async () => {
      const bal = await getXLMBalance(publicKey);
      setBalance(bal);
    };

    fetchBalance();

    const interval = setInterval(fetchBalance, 15000);
    return () => clearInterval(interval);
  }, [publicKey, refreshTrigger]);

  if (!publicKey) return null;

  return (
    <div className="p-6 text-center">
      <h2 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">Your Balance</h2>
      <p className="text-[var(--text-hint)] text-sm mt-1">Native XLM</p>
      <div className="text-3xl font-bold font-mono text-[var(--text-primary)] tracking-wider mt-2">{balance} XLM</div>
    </div>
  );
}
