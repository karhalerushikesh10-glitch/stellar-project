import React, { useRef, useState } from 'react';

export const HolographicAssetViewer = ({ assetCode, balance }: { assetCode: string, balance: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div className="perspective-1000 w-full max-w-sm mx-auto my-6">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.1s ease-out',
        }}
        className="relative group p-[1px] rounded-3xl overflow-hidden transform-style-3d bg-gradient-to-br from-white/10 to-white/5"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-600/30 via-transparent to-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
        
        <div className="relative p-6 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 h-full flex flex-col justify-between overflow-hidden shadow-2xl">
          {/* Holographic scanline effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20" />
          
          <div className="flex justify-between items-start z-10">
            <div>
              <h4 className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">Asset Hologram</h4>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 font-mono">
                {assetCode}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          
          <div className="mt-12 z-10 flex justify-between items-end">
            <div>
              <p className="text-xs text-white/40 mb-1">Quantum Balance</p>
              <p className="text-2xl font-light text-white font-mono">{balance}</p>
            </div>
            <div className="text-right">
              <div className="inline-block px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
                Synchronized
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
\n// Fix z-index stacking\n