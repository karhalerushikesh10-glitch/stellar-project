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
    <div className="p-6 bg-white rounded-lg shadow-md mt-4 text-center">
      <h2 className="text-lg text-gray-500">Your Balance</h2>
      <div className="text-4xl font-bold mt-2 text-black">{balance} XLM</div>
    </div>
  );
}
