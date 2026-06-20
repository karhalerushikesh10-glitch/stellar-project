"use client";
import { useState, useEffect } from "react";
import { rpc } from "@stellar/stellar-sdk";

export function TransactionStatus({ hash }: { hash: string }) {
  const [status, setStatus] = useState<string>("PENDING");

  useEffect(() => {
    if (!hash) return;
    
    let interval: any;
    const rpcUrl = process.env.NEXT_PUBLIC_SOROBAN_RPC || "https://soroban-testnet.stellar.org:443";
    const server = new rpc.Server(rpcUrl);

    const checkStatus = async () => {
      try {
        const res = await server.getTransaction(hash);
        setStatus(res.status);
        if (res.status !== "NOT_FOUND") {
          clearInterval(interval);
        }
      } catch (e) {
        console.error("status check error", e);
      }
    };

    interval = setInterval(checkStatus, 3000);
    checkStatus();

    return () => clearInterval(interval);
  }, [hash]);

  return (
    <div className="p-2 border border-[var(--border-soft)] rounded mt-2 text-sm bg-[var(--bg-elevated)]">
      <span className="font-semibold text-[var(--text-secondary)]">Status: </span>
      <span className={status === "SUCCESS" ? "text-[var(--success)] font-bold" : status === "FAILED" ? "text-[var(--error)] font-bold" : "text-[var(--warning)] font-bold"}>
        {status}
      </span>
    </div>
  );
}
