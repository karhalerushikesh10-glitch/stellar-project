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
          <span className="text-sm font-mono bg-gray-100 p-2 rounded text-black">
            {publicKey.slice(0, 5)}...{publicKey.slice(-5)}
          </span>
          <button 
            onClick={disconnect}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Connect Wallet
        </button>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {showModal && <WalletModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
