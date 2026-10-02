import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  FileText,
  BookOpen,
  Scale,
  DownloadCloud,
  CreditCard,
  Lock,
  Eye,
  ArrowRight
} from 'lucide-react';
import { DigitalProduct, SiteSettings } from '../types/marketplace';
import { PaystackLogo, FlutterwaveLogo } from './PaymentLogos';

interface ProductModalProps {
  product: DigitalProduct | null;
  onClose: () => void;
  onInitiateCheckout: (product: DigitalProduct, gateway: 'PAYSTACK' | 'FLUTTERWAVE') => void;
  onOpenPolicy: (policyType: 'license' | 'refund' | 'terms') => void;
  settings: SiteSettings;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onInitiateCheckout,
  onOpenPolicy,
  settings
}) => {
  const [showBlurredPreview, setShowBlurredPreview] = useState(true);

  if (!product) return null;

  const formatNgn = (val: number) => {
    return `₦${new Intl.NumberFormat('en-NG').format(val)}`;
  };

  const prodId = product.product_id || product.id || '';
  const prodName = product.product_name || product.title || '';
  const prodCategory = product.category;
  const prodDesc = product.full_description || product.fullDescription || product.short_description || '';
  const prodFileType = product.file_type || product.fileType || 'PDF';
  const prodFileSize = product.file_size || product.fileSize || '2.0 MB';
  const prodVersion = product.version || '1.0';
  const prodCreator = product.creator || 'GOYE Team';
  const prodImage = product.preview_image || product.coverImage || '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0B0E14] border border-[#1E283D] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E283D] bg-[#121722]/80">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="text-[#D4AF37] font-semibold">{prodCategory}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-white font-medium">{prodId}</span>
            <span aria-hidden="true">·</span>
            <span>Version {prodVersion}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold">OWNED_BY_GOYE</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Content Area (7 columns) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Product Title */}
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                {prodName}
              </h2>

              {/* Creator & Verification Marker */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="text-slate-400">Creator:</span>
                <span className="text-white font-medium">{prodCreator}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400">Rights Status:</span>
                <span className="text-emerald-400 font-semibold">{product.ownership_status} (Verified)</span>
              </div>

              {/* Cover Image & File Format Breakdown */}
              <div className="rounded-xl overflow-hidden border border-[#1E283D] bg-[#121722] aspect-[16/9] relative">
                {prodImage ? (
                  <img
                    src={prodImage}
                    alt={prodName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#121722] text-[#D4AF37]">
                    <FileText className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-[#0B0E14]/85 backdrop-blur-sm text-xs text-slate-200 border border-[#1E283D] rounded-lg">
                  Format: <span className="text-[#D4AF37] font-semibold">{prodFileType}</span> ({prodFileSize})
                </div>
              </div>

              {/* Full Description */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Product Description
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {prodDesc}
                </p>
              </div>

              {/* What You Get / Deliverables */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  What You Get (Included Assets)
                </h3>
                <ul className="space-y-2">
                  {(product.features || [
                    'Original structured digital document',
                    'Complete fill-in framework with instructions',
                    'Commercial use license for business operations',
                    'Immediate verified download link'
                  ]).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Blurred Document Preview (Required in Section 5) */}
              <div className="p-5 bg-[#121722] border border-[#1E283D] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Protected Document Preview (Sample View)
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">Original Protected Vault</span>
                </div>

                <div className="relative rounded-lg overflow-hidden border border-[#1E283D] bg-[#0B0E14] p-4 text-xs font-mono text-slate-300 min-h-[140px]">
                  {/* Sample content text with optional blur overlay */}
                  <div className={showBlurredPreview ? 'filter blur-[1.5px] select-none opacity-75' : ''}>
                    <p className="text-[#D4AF37] font-semibold mb-1">
                      DOCUMENT: {prodName}
                    </p>
                    <p className="text-slate-400 text-[11px] mb-2">
                      CREATOR: {prodCreator} · REF: {prodId}
                    </p>
                    <p className="leading-relaxed text-slate-300">
                      {product.content_document_text
                        ? product.content_document_text.slice(0, 300) + '...'
                        : '1. Executive Summary & Investment Thesis\n2. Corporate Registration & CAC Verification\n3. Operational Procedures\n4. Financial Models & Payment Gateway Setup\n[Content protected by GOYE license...]'}
                    </p>
                  </div>

                  {showBlurredPreview && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center">
                      <Lock className="w-6 h-6 text-[#D4AF37] mb-1.5" />
                      <span className="text-xs font-bold text-white">Full File Available Upon Verified Purchase</span>
                      <span className="text-[11px] text-slate-400 mt-0.5">
                        Delivered securely via Paystack or Flutterwave verification
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* License Terms */}
              <div className="p-4 bg-[#0e1420] border border-[#D4AF37]/30 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-xs uppercase tracking-wider">
                  <Scale className="w-4 h-4" />
                  <span>License Terms</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {product.license_terms || 'Single buyer license, commercial use allowed, no redistribution/resale of file itself'}
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>© 2026 GOYE. All Rights Reserved.</span>
                  <button
                    onClick={() => onOpenPolicy('license')}
                    className="text-[#D4AF37] hover:underline"
                  >
                    View License Details
                  </button>
                </div>
              </div>

              {/* Usage Instructions */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Usage Instructions
                </h3>
                <div className="p-3.5 bg-[#121722] border border-[#1E283D] rounded-xl text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                  {product.usage_instructions || 'Download, open in compatible app, customize for your business'}
                </div>
              </div>
            </div>

            {/* Right Contiguous Purchase Module (5 columns, sticky) */}
            <div className="lg:col-span-5 lg:sticky lg:top-4">
              <div className="p-6 bg-[#121722] border border-[#1E283D] rounded-2xl shadow-xl space-y-6">
                {/* Price Display */}
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                    Investment Price
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                      {formatNgn(product.price)}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">NGN (Fixed)</span>
                  </div>
                  <span className="block text-[11px] text-emerald-400 mt-1">
                    Settles in NGN via Nigerian & International Cards
                  </span>
                </div>

                {/* File Specifications Summary */}
                <div className="space-y-2 py-3 border-y border-[#1E283D] text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Delivery:</span>
                    <span className="text-white font-medium">Instant 24-Hour Signed Link</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Format:</span>
                    <span className="text-white font-medium">{prodFileType}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">File Size:</span>
                    <span className="text-white font-medium">{prodFileSize}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Rights:</span>
                    <span className="text-emerald-400 font-semibold">{product.ownership_status}</span>
                  </div>
                </div>

                {/* Primary Buy Buttons: Paystack + Flutterwave (Section 5) */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                    Choose Payment Method (NO STRIPE):
                  </span>

                  {/* Paystack Buy Button */}
                  <button
                    onClick={() => onInitiateCheckout(product, 'PAYSTACK')}
                    className="w-full py-3.5 px-4 bg-[#0BA4DB] hover:bg-[#0996c7] text-white font-bold rounded-xl transition-colors shadow-lg flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-white" />
                      <span>Pay with Paystack</span>
                    </div>
                    <span className="font-mono text-sm">{formatNgn(product.price)}</span>
                  </button>

                  {/* Flutterwave Buy Button */}
                  <button
                    onClick={() => onInitiateCheckout(product, 'FLUTTERWAVE')}
                    className="w-full py-3.5 px-4 bg-[#FB9129] hover:bg-[#ea8421] text-slate-950 font-bold rounded-xl transition-colors shadow-lg flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-slate-950" />
                      <span>Pay with Flutterwave</span>
                    </div>
                    <span className="font-mono text-sm">{formatNgn(product.price)}</span>
                  </button>
                </div>

                {/* Gateway Trust Badges */}
                <div className="pt-2 flex items-center justify-center gap-4 text-xs text-slate-400 border-t border-[#1E283D]/60">
                  <PaystackLogo className="opacity-80" />
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <FlutterwaveLogo className="opacity-80" />
                </div>

                {/* Guarantee / Refund Note */}
                <div className="text-center text-[11px] text-slate-400">
                  <span>{product.refund_policy_ref || 'Digital product, no refund after download, defective file replacement within 7 days'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
