import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Mail,
  DownloadCloud,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import { EmailReceipt } from '../types/marketplace';

interface ReceiptModalProps {
  orderId: string;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ orderId, onClose }) => {
  const [receipt, setReceipt] = useState<EmailReceipt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        setIsLoading(true);
        setError('');
        const res = await fetch(`/api/receipts/${encodeURIComponent(orderId)}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch receipt');
        }
        setReceipt(data);
      } catch (err: any) {
        setError(err.message || 'Unable to load official receipt.');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchReceipt();
    }
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      setResendSuccess('');
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/resend-receipt`, {
        method: 'POST'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resend receipt');
      setResendSuccess(data.message || `Receipt resent to ${receipt?.customer_email}`);
      setTimeout(() => setResendSuccess(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Error resending receipt');
    } finally {
      setIsResending(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/download/${orderId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const formatNgn = (val: number) => {
    return `₦${new Intl.NumberFormat('en-NG').format(val)}`;
  };

  const formattedDate = receipt
    ? new Date(receipt.issued_at).toLocaleString('en-NG', {
        dateStyle: 'full',
        timeStyle: 'medium',
        timeZone: 'Africa/Lagos'
      })
    : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#0B0E14] border border-[#1E283D] rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Modal Controls Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1E283D] bg-[#121722] shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-display font-bold text-white text-sm sm:text-base">
              Official Email Receipt · GOYE Marketplace
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print or Save as PDF"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E283D] hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <button
              onClick={handleResend}
              disabled={isResending || !receipt}
              title="Resend receipt to customer email"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37] hover:bg-[#E5BE48] text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isResending ? 'Sending...' : 'Resend Email'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resend Confirmation Toast */}
        {resendSuccess && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/40 px-6 py-2.5 text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{resendSuccess}</span>
            </div>
            <button onClick={() => setResendSuccess('')} className="text-emerald-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Receipt Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {isLoading ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading commercial transaction receipt...</p>
            </div>
          ) : error || !receipt ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 bg-red-950/60 border border-red-500/40 rounded-full flex items-center justify-center mx-auto text-red-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Receipt Unavailable</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">{error || 'Order has not completed payment yet.'}</p>
            </div>
          ) : (
            <div className="bg-[#121722] border border-[#1E283D] rounded-xl overflow-hidden shadow-lg p-5 sm:p-8 space-y-6">
              {/* Receipt Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E283D]">
                <div>
                  <span className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-widest block">
                    GOYE DIGITAL MARKETPLACE
                  </span>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight mt-0.5">
                    Official Purchase Receipt
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Lagos, Nigeria · Currency: NGN Only (No Stripe)
                  </p>
                </div>
                <div className="sm:text-right">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-bold rounded-full uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Payment Verified</span>
                  </span>
                  <span className="block font-mono text-xs text-slate-400 mt-1.5">
                    Receipt #{receipt.receipt_number}
                  </span>
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#0B0E14] border border-[#1E283D] rounded-xl text-xs">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider block text-[10px] font-semibold">
                    Billed To (Customer)
                  </span>
                  <strong className="text-white text-sm block mt-0.5">{receipt.customer_name}</strong>
                  <span className="text-slate-300 font-mono">{receipt.customer_email}</span>
                </div>

                <div>
                  <span className="text-slate-500 uppercase tracking-wider block text-[10px] font-semibold">
                    Transaction Details
                  </span>
                  <div className="text-slate-300 mt-0.5 space-y-0.5">
                    <div>
                      Order ID: <strong className="text-white font-mono">{receipt.order_id}</strong>
                    </div>
                    <div>
                      Gateway: <span className="text-[#D4AF37] font-semibold">{receipt.payment_method}</span>
                    </div>
                    <div>
                      Date: <span className="text-slate-300">{formattedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#1E283D] text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="pb-3 font-semibold">Product Description</th>
                      <th className="pb-3 font-semibold">Format</th>
                      <th className="pb-3 font-semibold">License</th>
                      <th className="pb-3 font-semibold text-right">Price (NGN)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E283D]">
                    <tr>
                      <td className="py-3 pr-2">
                        <div className="font-semibold text-white text-sm">{receipt.product_name}</div>
                        <div className="text-[11px] text-slate-400">
                          ID: <span className="font-mono text-slate-300">{receipt.product_id}</span> · Version {receipt.version} · {receipt.category}
                        </div>
                      </td>
                      <td className="py-3 text-slate-300 font-mono">{receipt.file_type}</td>
                      <td className="py-3 text-slate-300">Single Buyer Commercial</td>
                      <td className="py-3 text-right font-mono font-bold text-white text-sm">
                        {formatNgn(receipt.amount)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-2.5 text-right text-slate-400">
                        Subtotal:
                      </td>
                      <td className="py-2.5 text-right font-mono text-slate-200">
                        {formatNgn(receipt.subtotal || receipt.amount)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-2.5 text-right text-slate-400">
                        Value Added Tax (0% Exempt Digital Publication):
                      </td>
                      <td className="py-2.5 text-right font-mono text-slate-400">₦0.00</td>
                    </tr>
                    <tr className="border-t-2 border-[#1E283D] text-sm">
                      <td colSpan={3} className="py-3 text-right font-bold text-white">
                        Total Amount Paid:
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-emerald-400 text-base">
                        {formatNgn(receipt.amount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Digital Delivery Box */}
              <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl space-y-3 text-center">
                <div className="flex items-center justify-center gap-2 text-white font-semibold text-sm">
                  <DownloadCloud className="w-4 h-4 text-[#D4AF37]" />
                  <span>Your Digital Product File is Ready</span>
                </div>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Signed token access valid for 24 hours. You can download the file immediately or access it via your Customer Dashboard.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <a
                    href={receipt.download_url}
                    download
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] hover:bg-[#E5BE48] text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md cursor-pointer"
                  >
                    <DownloadCloud className="w-4 h-4" />
                    <span>Download {receipt.product_name}</span>
                  </a>

                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#121722] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1E283D] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Order URL'}</span>
                  </button>

                  <a
                    href={`/api/receipts/${encodeURIComponent(receipt.order_id)}/html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#121722] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1E283D] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Standalone Web Receipt</span>
                  </a>
                </div>
              </div>

              {/* License & Defect Policy Guarantee */}
              <div className="p-4 bg-[#0B0E14] border border-[#1E283D] rounded-xl space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Commercial License & Rights Terms</span>
                </div>
                <p className="leading-relaxed">
                  <strong>Authorized Use:</strong> {receipt.license_terms}
                </p>
                <p className="leading-relaxed">
                  <strong>7-Day Defect Guarantee:</strong> {receipt.refund_policy_ref}
                </p>
                <p className="text-[11px] text-slate-500 pt-1">
                  Gateway Reference: <span className="font-mono text-slate-400">{receipt.payment_reference}</span> · Billed in Nigerian Naira (NGN).
                </p>
              </div>

              {/* Footer Contacts */}
              <div className="text-center pt-2 text-xs text-slate-500 space-y-1">
                <p>Questions regarding your order or digital delivery?</p>
                <div className="flex items-center justify-center gap-4 text-slate-400">
                  <a href={`mailto:${receipt.support_email}`} className="text-[#D4AF37] hover:underline">
                    {receipt.support_email}
                  </a>
                  <span>·</span>
                  <span>WhatsApp: +234 813 000 0000</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
