"use client";
import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { WalletModal } from "./WalletModal";

export function WalletButton() {
  const { publicKey, disconnect, error } = useWallet();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col items-center">
      {publicKey ? (
        <div className="flex items-center gap-4">
          <span className="text-sm font-mono bg-[var(--bg-elevated)] border border-[var(--border-medium)] px-3 py-1.5 rounded-full text-[var(--text-primary)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--success)]"></span>
            {publicKey.slice(0, 5)}...{publicKey.slice(-5)}
          </span>
          <button 
            onClick={disconnect}
            className="px-4 py-2 bg-[var(--bg-sunken)] border border-[var(--border-medium)] text-[var(--text-primary)] rounded hover:bg-[var(--bg-elevated)] transition shadow-[0_1px_3px_rgba(43,38,32,0.06)]"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setShowModal(true)}
          className="px-5 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded transition shadow-[0_1px_3px_rgba(43,38,32,0.06)]"
        >
          Connect Wallet
        </button>
      )}
      {error && <p className="text-[var(--error)] text-sm mt-2 bg-[var(--error-bg)] border border-[var(--error-border)] px-3 py-1 rounded">{error}</p>}
      {showModal && <WalletModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
