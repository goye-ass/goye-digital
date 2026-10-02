import React, { useState } from 'react';
import {
  X,
  Lock,
  CheckCircle,
  AlertTriangle,
  Download,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Clock,
  FileText
} from 'lucide-react';
import { DigitalProduct, SiteSettings, PaymentMethodType } from '../types/marketplace';
import { PaystackLogo, FlutterwaveLogo } from './PaymentLogos';
import { ReceiptModal } from './ReceiptModal';

interface CheckoutModalProps {
  product: DigitalProduct | null;
  initialGateway?: 'PAYSTACK' | 'FLUTTERWAVE';
  onClose: () => void;
  settings: SiteSettings;
  onOrderSuccess: (orderId: string, downloadUrl: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  product,
  initialGateway = 'PAYSTACK',
  onClose,
  settings,
  onOrderSuccess
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'PAYSTACK' | 'FLUTTERWAVE'>(initialGateway);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [successOrder, setSuccessOrder] = useState<{
    orderId: string;
    downloadUrl: string;
    expiresAt: string;
  } | null>(null);

  if (!product) return null;

  const isFreeProduct = product.price === 0 || product.isFree;

  const formatNgn = (val: number) => {
    return `₦${new Intl.NumberFormat('en-NG').format(val)}`;
  };

  const prodId = product.product_id || product.id || '';
  const prodName = product.product_name || product.title || '';

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerEmail.trim()) {
      setErrorMessage('Please provide a valid email address to receive your download link.');
      return;
    }

    try {
      setIsProcessing(true);

      // Handle Free Product Claim directly
      if (isFreeProduct) {
        const res = await fetch('/api/orders/free', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: prodId,
            email: customerEmail.trim().toLowerCase(),
            customerName: customerName.trim() || 'Valued Customer'
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to claim resource.');

        setSuccessOrder({
          orderId: data.orderId,
          downloadUrl: data.download_url,
          expiresAt: data.expires_at
        });
        onOrderSuccess(data.orderId, data.download_url);
        setIsProcessing(false);
        return;
      }

      const endpoint = selectedMethod === 'PAYSTACK'
        ? '/api/paystack/initialize'
        : '/api/flutterwave/initialize';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: prodId,
          email: customerEmail.trim().toLowerCase(),
          customerName: customerName.trim() || 'Valued Customer'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details ? `${data.error}: ${data.details}` : data.error || 'Payment initialization failed.');
      }

      // If gateway returned a live checkout / authorization URL, redirect customer to live gateway
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
        return;
      } else if (data.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }

      // If keys are not yet configured in environment, show direct guidance and simulated verification option for developer/owner testing
      if (data.note) {
        setErrorMessage(`${data.note}`);
        setIsProcessing(false);
        return;
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment initiation error.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0B0E14] border border-[#1E283D] rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E283D] bg-[#121722]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-display font-bold text-white text-base sm:text-lg">
              Secure Checkout · NGN Only (No Stripe)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Order Summary Item */}
          <div className="p-4 bg-[#121722] border border-[#1E283D] rounded-xl flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-[#D4AF37] font-semibold uppercase tracking-wider block">
                {product.category} · {prodId}
              </span>
              <h4 className="font-semibold text-white text-sm sm:text-base line-clamp-1">
                {prodName}
              </h4>
              <span className="text-xs text-slate-400">
                Format: {product.file_type || product.fileType} · License: Commercial Use
              </span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xl font-bold text-white font-mono tabular-nums">
                {formatNgn(product.price)}
              </span>
              <span className="block text-[11px] text-slate-400">Currency: NGN</span>
            </div>
          </div>

          {/* Success State */}
          {successOrder ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-950/60 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Payment Verified & Authorized!</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Order ID: <span className="font-mono text-[#D4AF37]">{successOrder.orderId}</span>
                </p>
                <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 mt-2">
                  <Clock className="w-4 h-4" />
                  <span>Signed download link valid for 24 hours.</span>
                </div>
              </div>

              {/* Direct Download & Receipt Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <a
                  href={successOrder.downloadUrl}
                  download
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#E5BE48] text-slate-950 font-bold rounded-xl transition-colors shadow-lg cursor-pointer text-xs sm:text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {prodName}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowReceiptModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-[#1E283D] hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors border border-slate-700 text-xs sm:text-sm cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#D4AF37]" />
                  <span>View Email Receipt</span>
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Full Name or Company *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Babatunde Lawal"
                  className="w-full px-3.5 py-2.5 bg-[#121722] border border-[#1E283D] focus:border-[#D4AF37] rounded-xl text-white text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address for Download Link *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. babatunde@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#121722] border border-[#1E283D] focus:border-[#D4AF37] rounded-xl text-white text-sm outline-none transition-colors"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Your signed 24-hour download token will be linked to this email address.
                </p>
              </div>

              {/* Payment Method Selector (Paystack vs Flutterwave) */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Select Gateway (Paystack or Flutterwave)
                </label>

                {/* Paystack Option */}
                <label
                  onClick={() => setSelectedMethod('PAYSTACK')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedMethod === 'PAYSTACK'
                      ? 'bg-[#0BA4DB]/15 border-[#0BA4DB]'
                      : 'bg-[#121722] border-[#1E283D] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="gateway"
                      value="PAYSTACK"
                      checked={selectedMethod === 'PAYSTACK'}
                      onChange={() => setSelectedMethod('PAYSTACK')}
                      className="text-[#0BA4DB] focus:ring-[#0BA4DB]"
                    />
                    <div>
                      <PaystackLogo />
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Debit Card, Bank Transfer, USSD (NGN)
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-white">
                    {formatNgn(product.price)}
                  </span>
                </label>

                {/* Flutterwave Option */}
                <label
                  onClick={() => setSelectedMethod('FLUTTERWAVE')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedMethod === 'FLUTTERWAVE'
                      ? 'bg-[#FB9129]/15 border-[#FB9129]'
                      : 'bg-[#121722] border-[#1E283D] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="gateway"
                      value="FLUTTERWAVE"
                      checked={selectedMethod === 'FLUTTERWAVE'}
                      onChange={() => setSelectedMethod('FLUTTERWAVE')}
                      className="text-[#FB9129] focus:ring-[#FB9129]"
                    />
                    <div>
                      <FlutterwaveLogo />
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Nigerian Cards, Mobile Money, Barter (NGN)
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-white">
                    {formatNgn(product.price)}
                  </span>
                </label>
              </div>

              {/* Error Notice */}
              {errorMessage && (
                <div className="p-3 bg-amber-950/60 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <p>{errorMessage}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Configure <code className="text-[#D4AF37]">PAYSTACK_SECRET_KEY</code> or <code className="text-[#D4AF37]">FLUTTERWAVE_SECRET_KEY</code> in your environment variables to enable live gateway redirects.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer ${
                    selectedMethod === 'PAYSTACK'
                      ? 'bg-[#0BA4DB] hover:bg-[#0996c7] text-white shadow-cyan-950/40'
                      : 'bg-[#FB9129] hover:bg-[#ea8421] text-slate-950 shadow-amber-950/40'
                  }`}
                >
                  {isProcessing ? (
                    <span>Initializing Gateway...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        Pay {formatNgn(product.price)} via {selectedMethod === 'PAYSTACK' ? 'Paystack' : 'Flutterwave'}
                      </span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-bit SSL Secure Checkout · Direct NGN Settlement · No Stripe</span>
              </div>
            </form>
          )}
        </div>
      </div>

      {showReceiptModal && successOrder && (
        <ReceiptModal
          orderId={successOrder.orderId}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
};
