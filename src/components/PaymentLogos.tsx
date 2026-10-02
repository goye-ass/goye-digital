import React from 'react';

export const PaystackLogo: React.FC<{ className?: string }> = ({ className = 'h-5' }) => (
  <div className={`flex items-center gap-1.5 font-bold tracking-tight text-white ${className}`}>
    <div className="w-5 h-5 rounded bg-[#0BA4DB] flex items-center justify-center font-black text-xs text-white shadow-sm">
      P
    </div>
    <span className="text-sm font-semibold tracking-wide">paystack</span>
  </div>
);

export const FlutterwaveLogo: React.FC<{ className?: string }> = ({ className = 'h-5' }) => (
  <div className={`flex items-center gap-1.5 font-bold tracking-tight text-white ${className}`}>
    <div className="w-5 h-5 rounded bg-[#FB9129] flex items-center justify-center font-black text-xs text-slate-950 shadow-sm">
      F
    </div>
    <span className="text-sm font-semibold tracking-wide">flutterwave</span>
  </div>
);
