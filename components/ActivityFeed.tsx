"use client";
import { useState, useEffect } from "react";
import { fetchContractEvents, getLatestLedger } from "@/lib/eventStream";
import { scValToNative } from "@stellar/stellar-sdk";

export function ActivityFeed() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: any;
    let currentLedger = 0;

    const init = async () => {
      currentLedger = await getLatestLedger();
      if (currentLedger > 100) currentLedger -= 100; // look back a bit
      setLoading(false);
      poll();
      interval = setInterval(poll, 5000);
    };

    const poll = async () => {
      const ids = [
        process.env.NEXT_PUBLIC_COUNTER_CONTRACT_ID,
        process.env.NEXT_PUBLIC_PAYMENT_SPLITTER_ADDRESS,
        process.env.NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS
      ].filter(Boolean) as string[];

      if (ids.length === 0 || currentLedger === 0) return;

      const newEvents = await fetchContractEvents(ids, currentLedger);
      if (newEvents.length > 0) {
        setEvents(prev => {
          const combined = [...newEvents, ...prev];
          const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
          return unique.slice(0, 20); 
        });
        currentLedger = Number(newEvents[newEvents.length - 1].ledger) + 1;
      }
    };

    init();
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-2xl text-[var(--text-secondary)] shadow-[0_1px_3px_rgba(43,38,32,0.06)]">Loading activity feed...</div>;

  return (
    <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-soft)] shadow-[0_1px_3px_rgba(43,38,32,0.06)] h-64 overflow-y-auto rounded-2xl">
      <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)]">Live Activity Feed</h3>
      {events.length === 0 ? (
        <p className="text-[var(--text-hint)]">No recent events.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {events.map((ev, idx) => {
             let topicStr = "";
             try {
                topicStr = ev.topic.map((t: any) => String(scValToNative(t))).join(" / ");
             } catch(e) { topicStr = "Event"; }

             return (
               <li key={idx} className="p-3 border border-[var(--border-soft)] rounded-xl bg-[var(--bg-elevated)] text-sm flex flex-col hover:bg-[var(--bg-sunken)] transition">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${topicStr.includes('INCREMENT') ? 'bg-[var(--accent)]' : topicStr.includes('SPLIT') ? 'bg-[var(--secondary)]' : topicStr.includes('TRANSFER') ? 'bg-[var(--success)]' : 'bg-[var(--info)]'}`}></span>
                    <span className="font-semibold text-[var(--text-primary)]">{topicStr}</span>
                  </div>
                  <span className="text-xs text-[var(--text-secondary)]">Contract: {String(ev.contractId || "").slice(0,10)}...</span>
                  <span className="text-xs text-[var(--text-secondary)]">Ledger: {ev.ledger}</span>
               </li>
             );
          })}
        </ul>
      )}
    </div>
  );
}
