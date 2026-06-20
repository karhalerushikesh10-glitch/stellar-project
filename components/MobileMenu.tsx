"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const content = open && mounted ? (
    <div className="z-[100]">
      <div className="bg-[rgba(43,38,32,0.5)] backdrop-blur-sm fixed inset-0 z-[100] md:hidden" onClick={() => setOpen(false)} />
      <div className="fixed inset-y-0 left-0 w-64 bg-[var(--bg-surface)] border-r border-[var(--border-soft)] shadow-[2px_0_12px_rgba(43,38,32,0.08)] z-[101] p-4 md:hidden flex flex-col">
        <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)] tracking-wide">StellarPay</h2>
        <nav className="flex flex-col gap-2">
          <a href="#" className="p-3 rounded-xl hover:bg-[var(--bg-sunken)] text-[var(--text-primary)] transition">Dashboard</a>
          <a href="#" className="p-3 rounded-xl hover:bg-[var(--bg-sunken)] text-[var(--text-primary)] transition">Transfer</a>
          <a href="#" className="p-3 rounded-xl hover:bg-[var(--bg-sunken)] text-[var(--text-primary)] transition">Activity</a>
        </nav>
        <button onClick={() => setOpen(false)} className="text-[var(--error)] hover:text-[var(--text-primary)] transition py-2 text-left min-h-[44px]">Close</button>
      </div>
    </div>
  ) : null;

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setOpen(!open)}
        className="p-2 border border-[var(--border-medium)] rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        ☰
      </button>
      {content && createPortal(content, document.body)}
    </div>
  );
}
