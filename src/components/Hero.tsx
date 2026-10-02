import React from 'react';
import { Search, ShieldCheck, FileCheck, Lock, Sparkles, Folder } from 'lucide-react';
import { ProductCategory } from '../types/marketplace';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: ProductCategory[];
  totalPublished: number;
  fastMode?: boolean;
  setFastMode?: (val: boolean) => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  totalPublished,
  fastMode,
  setFastMode
}) => {
  return (
    <section className="relative pt-8 pb-7 sm:pt-14 sm:pb-12 border-b border-[#1E283D] overflow-hidden">
      {/* Subtle brand ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-radial from-[#123B72]/30 via-transparent to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-5">
        {/* Unboxed Brand Kicker + Mobile Network Speed Optimization indicator */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-medium text-[#D4AF37]">
          <div className="flex items-center gap-1.5 bg-[#121722] px-3 py-1 rounded-full border border-[#1E283D]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>All Products 100% OWNED_BY_GOYE</span>
          </div>

          <span aria-hidden="true" className="text-slate-600 hidden sm:inline">·</span>

          <div className="flex items-center gap-1.5 bg-[#121722] px-3 py-1 rounded-full border border-[#1E283D] text-slate-300">
            <span>Paystack & Flutterwave NGN Only</span>
          </div>

          {setFastMode && (
            <button
              onClick={() => setFastMode(!fastMode)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer border ${
                fastMode
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                  : 'bg-[#121722] border-[#1E283D] text-slate-400 hover:text-white'
              }`}
              title="Toggle mobile data saver & ultra-fast loading mode"
            >
              <span>⚡ Fast Mobile Mode: {fastMode ? 'ON' : 'OFF'}</span>
            </button>
          )}
        </div>

        {/* Required Primary Headline */}
        <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] text-balance max-w-4xl mx-auto">
          Original Digital Tools for Business, Learning & Growth
        </h1>

        {/* Required Subheadline */}
        <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Download practical templates, guides and digital resources created by GOYE. Instant secure download upon verified Paystack or Flutterwave payment.
        </p>

        {/* Search Input Bar */}
        <div className="max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search business templates, proposal packs, spreadsheets, guides..."
              className="w-full pl-12 pr-4 py-3.5 bg-[#121722] border border-[#1E283D] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl text-white placeholder-slate-400 text-sm sm:text-base outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 px-2 py-1 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Grid (All 10 Categories required in Section 1 and Section 5) */}
        <div className="pt-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
            <span className="font-semibold uppercase tracking-wider text-slate-300">
              Browse 10 Digital Categories
            </span>
            <span>{totalPublished} Active Products</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? 'ALL' : cat)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedCategory === cat
                    ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37] shadow-md font-semibold'
                    : 'bg-[#121722] text-slate-300 border-[#1E283D] hover:border-[#D4AF37]/50 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Folder className="w-3.5 h-3.5 opacity-70" />
                </div>
                <span className="text-xs line-clamp-1 leading-snug">{cat}</span>
              </button>
            ))}
          </div>

          {selectedCategory !== 'ALL' && (
            <div className="pt-3 text-center">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className="text-xs text-[#D4AF37] hover:underline"
              >
                Clear category filter (Show all 20 products)
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
