import React from 'react';
import { DownloadCloud, Lock, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAdmin: () => void;
  onOpenCustomerDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAdmin,
  onOpenCustomerDashboard
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0E14]/95 backdrop-blur-md border-b border-[#1E283D] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single Text Element Wordmark */}
        <button
          onClick={() => setActiveTab('catalog')}
          className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
        >
          <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-[#D4AF37] transition-colors whitespace-nowrap">
            GOYE DIGITAL MARKETPLACE
          </span>
        </button>

        {/* Zone 2: Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`whitespace-nowrap transition-colors py-1 hover:text-[#D4AF37] ${
              activeTab === 'catalog' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : ''
            }`}
          >
            All Products (20)
          </button>
          <button
            onClick={() => setActiveTab('licensing')}
            className={`whitespace-nowrap transition-colors py-1 hover:text-[#D4AF37] ${
              activeTab === 'licensing' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : ''
            }`}
          >
            Rights & Ownership
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`whitespace-nowrap transition-colors py-1 hover:text-[#D4AF37] ${
              activeTab === 'support' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : ''
            }`}
          >
            Support & FAQ
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenCustomerDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-200 hover:text-white bg-[#121722] hover:bg-[#1A2234] border border-[#1E283D] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            title="Access your verified downloads and orders"
          >
            <DownloadCloud className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden xs:inline">My Orders</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-transparent hover:bg-[#121722] border border-transparent hover:border-[#1E283D] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            title="Administrator Management Portal"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-[#1E283D]/60 bg-[#0B0E14] text-xs font-medium text-slate-300">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-2 py-1 ${activeTab === 'catalog' ? 'text-[#D4AF37]' : ''}`}
        >
          Catalog (20)
        </button>
        <button
          onClick={() => setActiveTab('licensing')}
          className={`px-2 py-1 ${activeTab === 'licensing' ? 'text-[#D4AF37]' : ''}`}
        >
          Rights
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`px-2 py-1 ${activeTab === 'support' ? 'text-[#D4AF37]' : ''}`}
        >
          Support
        </button>
      </div>
    </header>
  );
};
