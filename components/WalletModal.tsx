"use client";
import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { FREIGHTER_ID, ALBEDO_ID, XBULL_ID } from "@/lib/wallet";

const WALLETS = [
  { id: FREIGHTER_ID, name: "Freighter" },
  { id: XBULL_ID, name: "xBull" },
  { id: ALBEDO_ID, name: "Albedo" },
];

export function WalletModal({ onClose }: { onClose: () => void }) {
  const { connect } = useWallet();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleConnect = async (id: string) => {
    setLoadingId(id);
    await connect(id);
    setLoadingId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[rgba(43,38,32,0.5)] backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-soft)] p-6 rounded-2xl w-80 text-[var(--text-primary)] shadow-[0_4px_12px_rgba(43,38,32,0.1)]">
        <h2 className="text-xl font-bold mb-4">Connect Wallet</h2>
        <div className="flex flex-col gap-3">
          {WALLETS.map((w) => (
            <button
              key={w.id}
              onClick={() => handleConnect(w.id)}
              disabled={!!loadingId}
              className="p-3 border border-[var(--border-medium)] rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-sunken)] flex justify-between items-center transition"
            >
              <span className="font-medium text-[var(--text-primary)]">{w.name}</span>
              {loadingId === w.id && <span className="text-sm text-[var(--text-hint)]">Connecting...</span>}
            </button>
          ))}
        </div>
        <button 
          onClick={onClose}
          className="mt-6 w-full p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sunken)] rounded-xl transition border border-transparent"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
