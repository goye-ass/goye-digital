import React from 'react';
import { ShieldCheck, Scale, CheckCircle2, AlertOctagon, FileCheck, Lock } from 'lucide-react';

interface LicensingSectionProps {
  onOpenPolicy: (type: 'license' | 'refund' | 'terms') => void;
}

export const LicensingSection: React.FC<LicensingSectionProps> = ({ onOpenPolicy }) => {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Intellectual Property Governance</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Originality, Rights & Licensing Architecture
        </h2>
        <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
          GOYE operates under an uncompromising principle: every digital product published on this marketplace is 100% created by GOYE, commissioned with documented work-for-hire assignment, or held under verified commercial redistribution rights.
        </p>
      </div>

      {/* 3 Core Tenets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#121722] border border-[#1E283D] rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Original Authorship</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            All templates, checklists, prompt collections, and strategic guides are engineered from direct commercial consulting experience. We never upload, scrape, copy, or redistribute third-party copyrighted work.
          </p>
        </div>

        <div className="p-6 bg-[#121722] border border-[#1E283D] rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Audited Rights Pipeline</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every product in our catalog undergoes a strict 5-Phase Pre-Publication Audit (Content, Rights, Price, License, and File review). Unverified items remain permanently barred from public access.
          </p>
        </div>

        <div className="p-6 bg-[#121722] border border-[#1E283D] rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Server-Protected Delivery</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Original files are stored in an encrypted server-side repository and delivered exclusively through cryptographic, single-session access tokens following verified bank or web3 settlement.
          </p>
        </div>
      </div>

      {/* License Tiers Comparison */}
      <div className="p-8 bg-[#121722] border border-[#1E283D] rounded-2xl space-y-6">
        <div>
          <h3 className="font-display text-xl font-bold text-white">License Tiers & Permitted Usage</h3>
          <p className="text-xs text-slate-400 mt-1">
            Understand what you can and cannot do with purchased GOYE digital products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Commercial Use License */}
          <div className="p-5 bg-[#0B0E14] border border-[#D4AF37]/40 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                COMMERCIAL USE LICENSE
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">Standard for Templates</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Granted for business founders, agencies, and consultants who need practical frameworks in their daily commercial operations.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Use within your company or private consultancy</span>
              </div>
              <div className="flex items-start gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Customize proposals, invoices, and plans for client deliveries</span>
              </div>
              <div className="flex items-start gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Incorporate prompt recipes into internal business workflows</span>
              </div>
              <div className="flex items-start gap-2 text-red-400">
                <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>NO resale, re-uploading, or public distribution of raw templates</span>
              </div>
            </div>
          </div>

          {/* Personal Use License */}
          <div className="p-5 bg-[#0B0E14] border border-[#1E283D] rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                PERSONAL USE LICENSE
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Educational Guides</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Designed for individual study, skill development, and personal projects.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Personal study and individual career advancement</span>
              </div>
              <div className="flex items-start gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Private personal project implementations</span>
              </div>
              <div className="flex items-start gap-2 text-red-400">
                <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>NO commercial resale or mass corporate circulation</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
          <span>Need custom enterprise rights or multi-seat distribution?</span>
          <button
            onClick={() => onOpenPolicy('license')}
            className="text-[#D4AF37] hover:underline font-semibold"
          >
            Review Detailed License Agreement
          </button>
        </div>
      </div>
    </section>
  );
};
