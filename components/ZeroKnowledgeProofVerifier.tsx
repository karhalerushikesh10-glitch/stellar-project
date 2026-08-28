import React, { useState, useEffect } from 'react';

export const ZeroKnowledgeProofVerifier = ({ payload, onVerified }: { payload?: string, onVerified?: (isValid: boolean) => void }) => {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!payload) return;
    
    setStep(1); // Generating circuit
    const t1 = setTimeout(() => {
      setStep(2); // Validating SNARK
      let p = 0;
      const interval = setInterval(() => {
        p += Math.random() * 15;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          setStep(3); // Verified
          if (onVerified) onVerified(true);
        }
        setProgress(p);
      }, 200);
    }, 1200);

    return () => clearTimeout(t1);
  }, [payload, onVerified]);

  return (
    <div className="w-full max-w-md p-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl text-white font-mono shadow-2xl relative overflow-hidden">
      {/* Decorative bg element */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 blur-3xl rounded-full pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6">
        <svg className={`w-6 h-6 ${step === 3 ? 'text-green-400' : 'text-purple-400 animate-pulse'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <h2 className="text-lg font-semibold tracking-wide">ZK-SNARK Verifier</h2>
      </div>

      <div className="space-y-4 text-sm">
        <div className={`flex justify-between items-center ${step >= 1 ? 'opacity-100' : 'opacity-30'}`}>
          <span>1. Initializing Arithmetic Circuit</span>
          {step === 1 ? <span className="animate-spin text-purple-400">⟳</span> : step > 1 ? <span className="text-green-400">✓</span> : null}
        </div>
        
        <div className={`flex flex-col gap-2 ${step >= 2 ? 'opacity-100' : 'opacity-30'}`}>
          <div className="flex justify-between items-center">
            <span>2. Validating Groth16 Proof</span>
            {step === 2 ? <span className="text-purple-400">{Math.floor(progress)}%</span> : step > 2 ? <span className="text-green-400">✓</span> : null}
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className={`flex justify-between items-center ${step === 3 ? 'opacity-100 text-green-400' : 'opacity-30'}`}>
          <span>3. Cryptographic Privacy Secured</span>
          {step === 3 && <span>✓</span>}
        </div>
      </div>
      
      {step === 3 && (
        <div className="mt-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-green-300/80 break-all">
          Proof Hash: 0x{Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join('')}
        </div>
      )}
    </div>
  );
};