"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { connectWallet, disconnectWallet } from "@/lib/wallet";

interface WalletContextType {
  publicKey: string | null;
  connect: (walletId: string) => Promise<void>;
  disconnect: () => void;
  error: string | null;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const savedKey = localStorage.getItem("stellar_public_key");
    if (savedKey) setPublicKey(savedKey);
  }, []);

  const connect = async (walletId: string) => {
    setError(null);
    const result = await connectWallet(walletId);
    if (result.success && result.publicKey) {
      setPublicKey(result.publicKey);
    } else {
      setError(result.error || "Failed to connect");
    }
  };

  const disconnect = () => {
    disconnectWallet();
    setPublicKey(null);
  };

  const triggerRefresh = () => setRefreshTrigger(t => t + 1);

  return (
    <WalletContext.Provider value={{ publicKey, connect, disconnect, error, refreshTrigger, triggerRefresh }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) throw new Error("useWallet must be used within WalletProvider");
  return context;
}
