import React from 'react';
import { X, Shield, FileText, Scale, RefreshCw } from 'lucide-react';
import { SiteSettings } from '../types/marketplace';

interface PolicyModalProps {
  policyType: 'license' | 'refund' | 'terms' | 'privacy' | null;
  onClose: () => void;
  settings: SiteSettings;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  policyType,
  onClose,
  settings
}) => {
  if (!policyType) return null;

  const getDetails = () => {
    switch (policyType) {
      case 'refund':
        return {
          title: 'Digital Products Refund Policy',
          icon: RefreshCw,
          content: settings.refundPolicy
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          icon: Scale,
          content: settings.termsOfService
        };
      case 'privacy':
        return {
          title: 'Privacy Policy',
          icon: Shield,
          content: settings.privacyPolicy
        };
      case 'license':
      default:
        return {
          title: 'GOYE Digital Product License Framework',
          icon: FileText,
          content: `GOYE DIGITAL PRODUCT LICENSE TERMS

1. GOVERNING PRINCIPLE
GOYE DIGITAL MARKETPLACE publishes original digital resources created directly by GOYE or legally licensed with verified commercial redistribution rights. Every digital asset carries clear usage terms.

2. LICENSE TIERS:
a) PERSONAL USE LICENSE:
- The purchaser receives a non-exclusive, non-transferable, revocable license to download and utilize the product for individual study, education, and personal projects.
- You may NOT use the asset for commercial client engagements or public redistribution.

b) COMMERCIAL USE LICENSE:
- The purchaser is authorized to use the templates, frameworks, worksheets, and prompts within their own commercial business operations, client deliverables, and consulting projects.
- You may customize and deliver completed work to clients.
- You may NOT resell, repackage, sub-license, or redistribute the raw template, guide, or prompt file as a standalone product.

c) EXTENDED / ENTERPRISE LICENSE:
- For corporate distribution across teams exceeding 20 seats, contact goyedagosmessenterprise@gmail.com for multi-seat licensing.

3. INTELLECTUAL PROPERTY NOTICE
All trademarks, copyrights, and intellectual property in products created by GOYE remain the sole property of GOYE. Copyright © 2026 GOYE. All Rights Reserved.`
        };
    }
  };

  const { title, icon: Icon, content } = getDetails();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0B0E14] border border-[#1E283D] rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E283D] bg-[#121722]">
          <div className="flex items-center gap-2 text-white">
            <Icon className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-display font-bold text-base sm:text-lg">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line space-y-4">
          {content}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#1E283D] bg-[#0e131d] flex items-center justify-between text-xs text-slate-400">
          <span>GOYE DIGITAL MARKETPLACE Compliance</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#121722] hover:bg-slate-800 border border-[#1E283D] text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
