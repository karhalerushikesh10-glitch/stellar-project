"use client";
import { useState } from "react";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setOpen(!open)}
        className="p-2 border rounded bg-gray-100 text-black min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        ☰
      </button>
      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-md p-4 flex flex-col gap-4 text-black z-40">
          <a href="#" className="py-2 min-h-[44px] flex items-center">Dashboard</a>
          <a href="#" className="py-2 min-h-[44px] flex items-center">Settings</a>
          <button onClick={() => setOpen(false)} className="text-red-500 py-2 text-left min-h-[44px]">Close</button>
        </div>
      )}
    </div>
  );
}
