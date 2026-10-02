import React from 'react';
import { ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import { DigitalProduct } from '../types/marketplace';

interface ProductCardProps {
  product: DigitalProduct;
  onSelect: (product: DigitalProduct) => void;
  onBuyNow: (product: DigitalProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onBuyNow
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const formatNgn = (val: number) => {
    return `₦${new Intl.NumberFormat('en-NG').format(val)}`;
  };

  const prodId = product.product_id || product.id || '';
  const prodName = product.product_name || product.title || '';
  const prodCategory = product.category;
  const prodDesc = product.short_description || product.shortDescription || '';
  const prodFileType = product.file_type || product.fileType || 'PDF';
  const prodVersion = product.version || '1.0';
  const prodImage = product.preview_image || product.coverImage || '';

  return (
    <article className="group flex flex-col bg-[#121722] border border-[#1E283D] hover:border-[#D4AF37]/60 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/50">
      {/* 1. Cover Image Lead with Mobile Loading Skeleton */}
      <div
        onClick={() => onSelect(product)}
        className="relative aspect-[4/3] w-full bg-[#182030] overflow-hidden cursor-pointer"
      >
        {/* Shimmer Placeholder while image loads on slow mobile connections */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#182030] via-[#222c42] to-[#182030] animate-pulse" />
        )}

        {!imageError && prodImage ? (
          <img
            src={prodImage}
            alt={prodName}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#123B72]/40 via-[#121722] to-[#0B0E14] border-b border-[#1E283D]">
            <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-1">
              GOYE Verified Digital
            </span>
            <span className="text-sm font-medium text-slate-200 line-clamp-2">
              {prodName}
            </span>
          </div>
        )}

        {/* Format Badge */}
        <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#0B0E14]/85 backdrop-blur-sm text-[11px] font-semibold text-slate-200 rounded border border-[#1E283D]">
          {prodFileType}
        </div>

        {/* Ownership Badge */}
        <div className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-950/85 backdrop-blur-sm text-[11px] font-semibold text-emerald-400 rounded border border-emerald-500/30">
          OWNED_BY_GOYE
        </div>
      </div>

      {/* 2. Metadata & Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
            <span className="text-[#D4AF37] font-medium">{prodCategory}</span>
            <span aria-hidden="true">·</span>
            <span>{prodId}</span>
            <span aria-hidden="true">·</span>
            <span>v{prodVersion}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(product)}
            className="font-display text-base font-semibold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1 cursor-pointer"
          >
            {prodName}
          </h3>

          {/* Short Description */}
          <p className="mt-2 text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {prodDesc}
          </p>
        </div>

        {/* 3. Price & Action */}
        <div className="mt-5 pt-4 border-t border-[#1E283D] flex items-center justify-between gap-3">
          <div>
            <span className="text-lg font-bold text-white font-mono tabular-nums">
              {formatNgn(product.price)}
            </span>
            <span className="block text-[11px] text-slate-400">Paystack / Flutterwave</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelect(product)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#1A2234] hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Details
            </button>
            <button
              onClick={() => onBuyNow(product)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-[#D4AF37] hover:bg-[#E5BE48] rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <span>Buy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
