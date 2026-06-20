"use client";
import dynamic from "next/dynamic";

const AppContent = dynamic(() => import("@/components/AppContent").then(m => m.AppContent), { ssr: false });

export default function Home() {
  return <AppContent />;
}
