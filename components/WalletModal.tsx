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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-80 text-black">
        <h2 className="text-xl font-bold mb-4">Connect Wallet</h2>
        <div className="flex flex-col gap-3">
          {WALLETS.map((w) => (
            <button
              key={w.id}
              onClick={() => handleConnect(w.id)}
              disabled={!!loadingId}
              className="p-3 border rounded hover:bg-gray-100 flex justify-between items-center transition"
            >
              <span>{w.name}</span>
              {loadingId === w.id && <span className="text-sm text-gray-500">Connecting...</span>}
            </button>
          ))}
        </div>
        <button 
          onClick={onClose}
          className="mt-6 w-full p-2 text-red-500 hover:bg-red-50 rounded transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
