import React, { useState } from 'react';
import {
  DownloadCloud,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  FileText
} from 'lucide-react';
import { ReceiptModal } from './ReceiptModal';

interface OrderSummary {
  id: string;
  product_name: string;
  productTitle?: string;
  amount: number;
  currency: string;
  status: string;
  paymentStatus?: string;
  created_at: string;
  download_url?: string;
  downloadUrl?: string;
}

interface CustomerDashboardProps {
  onClose: () => void;
  initialEmail?: string;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onClose,
  initialEmail = ''
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [receiptOrderId, setReceiptOrderId] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setIsLoading(true);
      setError('');
      setHasSearched(true);

      const res = await fetch(`/api/orders/lookup?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to lookup orders');
      }

      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Lookup failed.');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNgn = (val: number) => {
    return `₦${new Intl.NumberFormat('en-NG').format(val)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0B0E14] border border-[#1E283D] rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E283D] bg-[#121722]">
          <div className="flex items-center gap-2">
            <DownloadCloud className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-display font-bold text-white text-base sm:text-lg">
              Customer Orders & 24h Signed Downloads
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-[#1E283D] bg-[#0e131d]">
          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address used at Paystack/Flutterwave checkout..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#121722] border border-[#1E283D] focus:border-[#D4AF37] rounded-xl text-white text-sm outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#E5BE48] text-slate-950 font-bold rounded-xl text-sm transition-colors cursor-pointer shrink-0"
            >
              {isLoading ? 'Searching...' : 'Find My Orders'}
            </button>
          </form>
          <p className="text-[11px] text-slate-400 mt-2">
            Enter your customer email to retrieve your verified purchases and active download links.
          </p>
        </div>

        {/* Body / Order List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-xs text-red-300">
              {error}
            </div>
          )}

          {!hasSearched ? (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <div className="w-12 h-12 bg-[#121722] border border-[#1E283D] rounded-full flex items-center justify-center mx-auto text-[#D4AF37]">
                <DownloadCloud className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-white">Retrieve Your Digital Downloads</h4>
              <p className="text-xs max-w-sm mx-auto text-slate-400 leading-relaxed">
                Your purchases on GOYE Digital Marketplace are tied to your email address. Enter your address above to view your order history.
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <p className="text-sm text-slate-300">No orders found for this email address.</p>
              <p className="text-xs text-slate-500">
                Please confirm you typed the exact email address used at Paystack or Flutterwave checkout.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                <span>Found {orders.length} Order(s)</span>
                <span>Sorted by Most Recent</span>
              </div>

              {orders.map((order) => {
                const isPaid = order.status === 'paid' || order.paymentStatus === 'PAID';
                const downloadLink = order.download_url || order.downloadUrl;
                const prodName = order.product_name || order.productTitle || 'Digital Product';

                return (
                  <div
                    key={order.id}
                    className="p-4 bg-[#121722] border border-[#1E283D] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#D4AF37] font-semibold">{order.id}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(order.created_at || (order as any).createdDate || Date.now()).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-white">{prodName}</h4>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400">Amount:</span>
                        <span className="font-mono text-slate-200 font-semibold">
                          {formatNgn(order.amount)}
                        </span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-slate-400">Status:</span>

                        {isPaid ? (
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Paid & Verified</span>
                          </span>
                        ) : (
                          <span className="text-amber-400 font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Payment Pending</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions: Download + Receipt */}
                    <div className="shrink-0 flex items-center gap-2">
                      {isPaid && (
                        <button
                          onClick={() => setReceiptOrderId(order.id)}
                          className="flex items-center gap-1 px-3 py-2 bg-[#1E283D] hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
                          title="View Official Email Receipt"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Receipt</span>
                        </button>
                      )}

                      {isPaid && downloadLink ? (
                        <a
                          href={downloadLink}
                          download
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#D4AF37] hover:bg-[#E5BE48] text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-sm"
                        >
                          <DownloadCloud className="w-4 h-4" />
                          <span>Download File</span>
                        </a>
                      ) : !isPaid ? (
                        <span className="px-3 py-1.5 bg-amber-950/40 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-medium">
                          Payment Required
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Email Receipt Modal */}
      {receiptOrderId && (
        <ReceiptModal
          orderId={receiptOrderId}
          onClose={() => setReceiptOrderId(null)}
        />
      )}
    </div>
  );
};
