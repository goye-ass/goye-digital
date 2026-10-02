import React, { useState } from 'react';
import {
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { SiteSettings } from '../types/marketplace';

interface SupportSectionProps {
  settings: SiteSettings;
  onOpenPolicy: (type: 'refund' | 'license' | 'terms') => void;
}

export const SupportSection: React.FC<SupportSectionProps> = ({
  settings,
  onOpenPolicy
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [subject, setSubject] = useState('Product Download Assistance');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const faqs = [
    {
      q: 'How do I download my digital product?',
      a: 'Free resources are available immediately after providing your name and email. For paid products, as soon as your payment is verified by the backend gateway, you will receive an instant download button and token. You can also retrieve your downloads anytime by entering your email in the "My Orders" portal.'
    },
    {
      q: 'What payment methods are supported?',
      a: 'We support real payment channels: Paystack (debit cards, bank transfer, USSD), Flutterwave, and the official Pi Network SDK when accessing the marketplace through the official Pi Browser.'
    },
    {
      q: 'Can I get a refund on a digital product?',
      a: 'Because digital products are delivered immediately in unencrypted downloadable format, orders are generally non-refundable once accessed. However, under the GOYE Technical Defect Guarantee, if a file is defective, corrupted, or missing advertised components and our engineering team cannot fix it within 48 hours, a 100% refund is provided.'
    },
    {
      q: 'What license do I receive with my purchase?',
      a: 'Each product has an explicit license tier: Personal Use (for study and individual projects) or Commercial Use (permitted within your business, consultancy, and client deliveries). Purchasers may never resell, re-distribute, or sub-license the raw files as competing standalone digital products.'
    },
    {
      q: 'Can I use the product commercially?',
      a: 'Yes, for products marked with the "COMMERCIAL_USE" license, you have the legal right to apply the templates, prompt sets, and frameworks in commercial client deliverables and operational workflows.'
    },
    {
      q: 'What happens if my payment fails or deducts without unlocking?',
      a: 'If your card was debited but your download was not immediately unlocked, do not panic. Simply submit the support form below or email us with your payment transaction reference and email. Our server cross-checks the gateway log directly and manually authorizes your order within a few hours.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    try {
      setStatus('submitting');
      const res = await fetch('/api/support/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, orderId, subject, message })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit inquiry');

      setStatus('success');
      setFeedback(data.message || 'Thank you. Your message has been received.');
      setMessage('');
      setOrderId('');
    } catch (err: any) {
      setStatus('error');
      setFeedback(err.message || 'Failed to send message.');
    }
  };

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2">
          <HelpCircle className="w-4 h-4" />
          <span>Customer Support & Assistance</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Frequently Asked Questions & Helpdesk
        </h2>
        <p className="mt-3 text-slate-300 text-sm sm:text-base">
          Direct assistance from the GOYE Digital Marketplace operations team.
        </p>
      </div>

      {/* FAQs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="p-6 bg-[#121722] border border-[#1E283D] rounded-xl space-y-2.5"
          >
            <h3 className="font-semibold text-white text-base flex items-start gap-2">
              <span className="text-[#D4AF37] font-mono">0{idx + 1}.</span>
              <span>{faq.q}</span>
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed pl-7">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      {/* Contact Channels & Direct Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-[#1E283D]">
        {/* Contact Channels Card */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <h3 className="font-display text-xl font-bold text-white">Direct Communication</h3>
            <p className="text-xs text-slate-400 mt-1">
              Reach out to our customer care team regarding order verification or licensing inquiries.
            </p>
          </div>

          <div className="space-y-4">
            {/* Email */}
            <div className="p-4 bg-[#121722] border border-[#1E283D] rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-slate-400 block font-medium">Official Support Email</span>
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="text-white hover:text-[#D4AF37] text-sm font-semibold truncate block transition-colors"
                >
                  {settings.contactEmail}
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="p-4 bg-[#121722] border border-[#1E283D] rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">WhatsApp Support Line</span>
                <span className="text-white text-sm font-semibold">{settings.contactWhatsApp}</span>
              </div>
            </div>

            {/* Support Hours */}
            <div className="p-4 bg-[#0e1420] border border-[#1E283D] rounded-xl text-xs text-slate-400 space-y-1">
              <span className="text-slate-300 font-semibold block">Operating Schedule:</span>
              <p>{settings.supportHours}</p>
              <p className="text-[11px] text-slate-500 pt-1">
                Average ticket response time: Under 4 operational hours.
              </p>
            </div>
          </div>
        </div>

        {/* Support Inquiry Form */}
        <div className="lg:col-span-7 bg-[#121722] border border-[#1E283D] rounded-2xl p-6 sm:p-8">
          <h3 className="font-display text-lg font-bold text-white mb-1">
            Submit a Support Request
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Include your Order ID if contacting regarding a purchase.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Samuel Okon"
                  className="w-full px-3.5 py-2.5 bg-[#0B0E14] border border-[#1E283D] focus:border-[#D4AF37] rounded-xl text-white text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. samuel@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#0B0E14] border border-[#1E283D] focus:border-[#D4AF37] rounded-xl text-white text-sm outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Order ID (Optional)
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. ORD-12345"
                  className="w-full px-3.5 py-2.5 bg-[#0B0E14] border border-[#1E283D] focus:border-[#D4AF37] rounded-xl text-white text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Subject *
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0B0E14] border border-[#1E283D] focus:border-[#D4AF37] rounded-xl text-white text-sm outline-none transition-colors"
                >
                  <option value="Product Download Assistance">Product Download Assistance</option>
                  <option value="Payment Verification Inquiry">Payment Verification Inquiry</option>
                  <option value="Commercial License Inquiry">Commercial License Inquiry</option>
                  <option value="Technical Defect / Replacement">Technical Defect / Replacement</option>
                  <option value="Other Question">Other Question</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Message & Details *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your question or issue in detail..."
                className="w-full px-3.5 py-2.5 bg-[#0B0E14] border border-[#1E283D] focus:border-[#D4AF37] rounded-xl text-white text-sm outline-none transition-colors"
              />
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  status === 'success'
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/60 border border-red-500/40 text-red-300'
                }`}
              >
                {status === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{feedback}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-3 px-4 bg-[#D4AF37] hover:bg-[#E5BE48] text-slate-950 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>{status === 'submitting' ? 'Submitting...' : 'Send Support Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
