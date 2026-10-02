import React, { useState, useEffect } from 'react';
import {
  DownloadCloud,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  ShieldCheck,
  ArrowLeft,
  Mail,
  Printer
} from 'lucide-react';
import { ReceiptModal } from './ReceiptModal';

interface DownloadPageProps {
  orderId: string;
  onBackToShop: () => void;
}

export const DownloadPage: React.FC<DownloadPageProps> = ({ orderId, onBackToShop }) => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Order not found');
        }
        setOrder(data);
      } catch (err: any) {
        setError(err.message || 'Failed to retrieve order details.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const formatNgn = (val: number) => {
    return `₦${new Intl.NumberFormat('en-NG').format(val)}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <button
        onClick={onBackToShop}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to GOYE Digital Marketplace</span>
      </button>

      <div className="bg-[#121722] border border-[#1E283D] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-10 space-y-8">
        {loading ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Verifying secure download token...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-14 h-14 bg-red-950/60 border border-red-500/40 rounded-full flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Order Lookup Issue</h2>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">{error}</p>
            </div>
            <button
              onClick={onBackToShop}
              className="px-5 py-2.5 bg-[#D4AF37] text-slate-950 font-bold rounded-xl text-xs"
            >
              Return to Catalog
            </button>
          </div>
        ) : order.is_expired ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-14 h-14 bg-amber-950/60 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto text-amber-400">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Signed Download URL Expired</h2>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                For security reasons, GOYE digital product signed URLs expire 24 hours after issuance.
              </p>
            </div>
            <div className="p-4 bg-[#0B0E14] border border-[#1E283D] rounded-xl text-xs text-slate-400 max-w-md mx-auto">
              Please email <span className="text-[#D4AF37]">goyedagosmessenterprise@gmail.com</span> with Order ID <strong className="text-white font-mono">{order.id}</strong> to receive an refreshed link.
            </div>
          </div>
        ) : order.status !== 'paid' ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-14 h-14 bg-amber-950/60 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto text-amber-400">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Payment Verification Pending</h2>
              <p className="text-xs text-slate-300 mt-1">
                Order <span className="font-mono text-[#D4AF37]">{order.id}</span> status is currently <strong>{order.status}</strong>.
              </p>
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              If your card was debited, payment confirmation may take up to 2 minutes depending on network verification. Refresh this page to check for payment confirmation.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#D4AF37] text-slate-950 font-bold rounded-xl text-xs"
            >
              Refresh Verification Status
            </button>
          </div>
        ) : (
          /* Successful Verified Download */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-950/60 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="w-9 h-9" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Your Download is Ready
              </h1>
              <p className="text-xs text-slate-400">
                Order verified via {order.payment_method} · Currency: NGN
              </p>
            </div>

            {/* Order Details Card */}
            <div className="p-5 bg-[#0B0E14] border border-[#1E283D] rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-[#1E283D]">
                <span className="text-slate-400">Order Reference:</span>
                <span className="font-mono font-bold text-[#D4AF37]">{order.id}</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-3 border-b border-[#1E283D]">
                <span className="text-slate-400">Product Name:</span>
                <span className="font-semibold text-white">{order.product_name}</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-3 border-b border-[#1E283D]">
                <span className="text-slate-400">Buyer Email:</span>
                <span className="text-slate-200">{order.email}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-mono font-bold text-emerald-400">{formatNgn(order.amount)}</span>
              </div>
            </div>

            {/* Expiration Notice */}
            <div className="flex items-center gap-2 p-3.5 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs text-amber-300">
              <Clock className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Signed URL active. This download token expires in 24 hours.</span>
            </div>

            {/* Action Buttons: Download + View Receipt */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={order.download_url}
                download
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#D4AF37] hover:bg-[#E5BE48] text-slate-950 font-bold rounded-xl text-sm transition-all shadow-xl shadow-amber-950/30 cursor-pointer"
              >
                <DownloadCloud className="w-5 h-5" />
                <span>Download {order.product_name}</span>
              </a>

              <button
                onClick={() => setShowReceipt(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1E283D] hover:bg-slate-700 text-white font-bold rounded-xl text-sm transition-colors border border-slate-700 shadow-md cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#D4AF37]" />
                <span>View Official Email Receipt</span>
              </button>
            </div>

            <div className="text-center pt-4 text-xs text-slate-500 space-y-1">
              <p>Need support or file replacement?</p>
              <a
                href="mailto:goyedagosmessenterprise@gmail.com"
                className="text-[#D4AF37] hover:underline"
              >
                goyedagosmessenterprise@gmail.com
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Official Email Receipt Modal */}
      {showReceipt && (
        <ReceiptModal
          orderId={orderId}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};
