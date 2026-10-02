import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  LayoutDashboard,
  Package,
  ShoppingBag,
  ShieldCheck,
  CreditCard,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  Search,
  Filter,
  Save,
  FileText,
  Bell,
  Receipt,
  Mail,
  Printer,
  ExternalLink,
  Clock,
  Sparkles,
  CheckCheck,
  Trash2,
  HelpCircle,
  DownloadCloud,
  Send,
  Eye
} from 'lucide-react';
import {
  DigitalProduct,
  OrderRecord,
  SiteSettings,
  MarketplaceStats,
  OwnershipStatus,
  ProductCategory,
  AdminNotification,
  EmailReceipt,
  NotificationType
} from '../types/marketplace';
import { ReceiptModal } from './ReceiptModal';

interface AdminPortalProps {
  onClose: () => void;
  onRefreshPublicData: () => void;
  initialView?: 'dashboard' | 'products' | 'new_product' | 'orders' | 'notifications' | 'receipts';
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onClose,
  onRefreshPublicData,
  initialView = 'dashboard'
}) => {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Sub-pages: /admin (dashboard), /admin/products, /admin/products/new, /admin/orders, /admin/notifications, /admin/receipts
  const [currentView, setCurrentView] = useState<
    'dashboard' | 'products' | 'new_product' | 'orders' | 'notifications' | 'receipts'
  >(initialView);

  const navigateView = (view: 'dashboard' | 'products' | 'new_product' | 'orders' | 'notifications' | 'receipts') => {
    setCurrentView(view);
    const path = view === 'dashboard' ? '/admin' : `/admin/${view === 'new_product' ? 'products/new' : view}`;
    window.history.pushState(null, '', path);
  };

  const handlePortalClose = () => {
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState(null, '', '/');
    }
    onClose();
  };

  // Filter & Search states
  const [productSearch, setProductSearch] = useState('');
  const [ownershipFilter, setOwnershipFilter] = useState<string>('ALL');

  // Data states
  const [stats, setStats] = useState<MarketplaceStats | null>(null);
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [notificationFilter, setNotificationFilter] = useState<
    'ALL' | 'UNREAD' | 'ORDERS' | 'SUPPORT' | 'DOWNLOADS' | 'RIGHTS'
  >('ALL');

  // Receipts State
  const [receipts, setReceipts] = useState<EmailReceipt[]>([]);
  const [receiptSearch, setReceiptSearch] = useState('');
  const [selectedReceiptOrderId, setSelectedReceiptOrderId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Default fields for /admin/products/new
  // Prompt Section 5: defaults: ownership_status=PENDING_RIGHTS_REVIEW, creator=GOYE Team, currency=NGN, version=1.0
  const initialNewProduct: Partial<DigitalProduct> = {
    product_name: '',
    category: 'Business Templates',
    short_description: '',
    full_description: '',
    version: '1.0',
    creator: 'GOYE Team',
    ownership_status: 'PENDING_RIGHTS_REVIEW',
    rights_documentation_status: 'Verified',
    commercial_use_permission_status: 'Commercial Allowed',
    file_type: 'DOCX',
    file_size: '2.0 MB',
    price: 2500,
    currency: 'NGN',
    product_status: 'Draft',
    license_terms: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: 'Download, open in compatible app, customize for your business',
    refund_policy_ref: 'Digital product, no refund after download, defective file replacement within 7 days',
    content_document_text: 'GOYE DIGITAL PRODUCT\n© 2026 GOYE. All Rights Reserved.'
  };

  const [formData, setFormData] = useState<Partial<DigitalProduct>>(initialNewProduct);

  const fetchNotifications = async (key: string) => {
    try {
      const res = await fetch('/api/admin/notifications', {
        headers: { 'x-admin-key': key }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadNotifs(data.unreadCount || 0);
      }
    } catch (e) {
      console.error('Error fetching notifications:', e);
    }
  };

  const fetchReceipts = async (key: string) => {
    try {
      const res = await fetch('/api/admin/receipts', {
        headers: { 'x-admin-key': key }
      });
      if (res.ok) {
        const data = await res.json();
        setReceipts(data || []);
      }
    } catch (e) {
      console.error('Error fetching receipts:', e);
    }
  };

  const fetchAdminData = async (key: string) => {
    setIsLoading(true);
    try {
      const headers = { 'x-admin-key': key };

      const [statsRes, prodRes, orderRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/products', { headers }),
        fetch('/api/admin/orders', { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
      if (orderRes.ok) setOrders(await orderRes.json());

      // Also fetch notifications and receipts
      await Promise.all([
        fetchNotifications(key),
        fetchReceipts(key)
      ]);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Live polling for notifications every 10s
  useEffect(() => {
    if (!isAuthenticated || !adminKey) return;
    const interval = setInterval(() => {
      fetchNotifications(adminKey);
    }, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, adminKey]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/admin/notifications/${id}/read`, {
        method: 'POST',
        headers: { 'x-admin-key': adminKey }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadNotifs(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error('Error marking notification read:', e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/admin/notifications/read-all', {
        method: 'POST',
        headers: { 'x-admin-key': adminKey }
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadNotifs(0);
      setFeedbackMsg('All notifications marked as read.');
    } catch (e) {
      console.error('Error marking all read:', e);
    }
  };

  const handleClearNotifications = async () => {
    if (!window.confirm('Clear all admin notifications history?')) return;
    try {
      await fetch('/api/admin/notifications', {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey }
      });
      setNotifications([]);
      setUnreadNotifs(0);
      setFeedbackMsg('Notification history cleared.');
    } catch (e) {
      console.error('Error clearing notifications:', e);
    }
  };

  const handleTriggerTestNotification = async (type: NotificationType) => {
    try {
      const titles: Record<NotificationType, string> = {
        ORDER_PAID: 'Verified Payment: ₦18,500 received via Paystack',
        NEW_ORDER: 'New Order Claimed: Startup Checklist Free Claim',
        SUPPORT_TICKET: 'Customer Inquiry: Babatunde Lawal - License Query',
        DOWNLOAD_ACCESSED: 'Download Verified: GOYE Business Plan Template',
        PRODUCT_CREATED: 'New Product Added: Executive Contract Pack',
        RIGHTS_ALERT: 'Rights Check Required: Third-Party Template Review'
      };

      const res = await fetch('/api/admin/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({
          type,
          title: titles[type] || 'Test Notification Alert',
          message: `Live simulated test notification for ${type} triggered by administrator at ${new Date().toLocaleTimeString()}.`
        })
      });

      if (res.ok) {
        setFeedbackMsg(`Test ${type} notification dispatched!`);
        fetchNotifications(adminKey);
      }
    } catch (e) {
      console.error('Error triggering test alert:', e);
    }
  };

  const handleResendReceipt = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/resend-receipt`, {
        method: 'POST'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resend receipt');
      setFeedbackMsg(data.message || 'Receipt resent successfully.');
      fetchReceipts(adminKey);
      fetchNotifications(adminKey);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error resending receipt.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminKey })
      });
      if (res.ok) {
        setIsAuthenticated(true);
        fetchAdminData(adminKey);
      } else {
        const err = await res.json();
        setAuthError(err.error || 'Invalid credentials.');
      }
    } catch (e: any) {
      setAuthError('Connection error.');
    }
  };

  // Toggle Publish handler with strict enforcement
  // Rule: Admin toggle publish must be disabled with error if ownership_status not in approved list:
  // Show "Rights not approved - cannot publish"
  const handleTogglePublish = async (product: DigitalProduct) => {
    setErrorMessage('');
    setFeedbackMsg('');

    const allowedOwnership = ['OWNED_BY_GOYE', 'CREATED_FOR_GOYE', 'LICENSED_FOR_RESALE'];
    const isApproved = allowedOwnership.includes(product.ownership_status);

    if (product.product_status !== 'Active') {
      if (!isApproved) {
        setErrorMessage(`Rights not approved - cannot publish: ${product.product_name} (${product.ownership_status})`);
        return;
      }
    }

    const nextStatus = product.product_status === 'Active' ? 'Draft' : 'Active';

    try {
      const res = await fetch(`/api/admin/products/${product.product_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({
          product_status: nextStatus
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      setFeedbackMsg(`Updated ${product.product_name} status to ${nextStatus}.`);
      fetchAdminData(adminKey);
      onRefreshPublicData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating product');
    }
  };

  // Save / Create product (/admin/products/new)
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setFeedbackMsg('');

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      setFeedbackMsg(`Product ${data.product.product_id} created successfully.`);
      setFormData(initialNewProduct);
      setCurrentView('products');
      fetchAdminData(adminKey);
      onRefreshPublicData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error creating product');
    }
  };

  const formatNgn = (val: number) => {
    return `₦${new Intl.NumberFormat('en-NG').format(val)}`;
  };

  // Filtered products list for /admin/products
  const displayedProducts = products.filter((p) => {
    if (ownershipFilter !== 'ALL' && p.ownership_status !== ownershipFilter) {
      return false;
    }
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      const matchName = (p.product_name || '').toLowerCase().includes(q);
      const matchId = (p.product_id || '').toLowerCase().includes(q);
      const matchCat = (p.category || '').toLowerCase().includes(q);
      if (!matchName && !matchId && !matchCat) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-6xl bg-[#0B0E14] border border-[#1E283D] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[94vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#1E283D] bg-[#121722]">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-display font-bold text-white text-base sm:text-lg">
              GOYE Digital Marketplace · Admin Management
            </h2>
            {isAuthenticated && (
              <span className="text-[11px] text-emerald-400 font-mono">
                [Authenticated]
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => navigateView('notifications')}
                className="relative p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Admin Notifications & Audit Alerts"
              >
                <Bell className="w-4 h-4 text-[#D4AF37]" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-amber-500 text-slate-950 rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotifs}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={handlePortalClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Gate */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <form
              onSubmit={handleLogin}
              className="w-full max-w-md bg-[#121722] border border-[#1E283D] p-8 rounded-2xl space-y-5 text-center"
            >
              <div className="w-12 h-12 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl flex items-center justify-center mx-auto text-[#D4AF37]">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">Admin Authentication</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Access ownership audit ledger, product creation, and Paystack/Flutterwave orders.
                </p>
              </div>

              <div>
                <input
                  type="password"
                  required
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Master Admin Key..."
                  className="w-full px-4 py-2.5 bg-[#0B0E14] border border-[#1E283D] focus:border-[#D4AF37] rounded-xl text-white text-sm outline-none text-center tracking-wider"
                />
              </div>

              {authError && (
                <div className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-500/30">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#E5BE48] text-slate-950 font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Access Portal
              </button>
            </form>
          </div>
        ) : (
          /* Main Authenticated Layout */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar */}
            <aside className="w-full md:w-56 bg-[#0e131d] border-b md:border-b-0 md:border-r border-[#1E283D] p-3 flex md:flex-col gap-1 shrink-0 overflow-x-auto">
              <button
                onClick={() => navigateView('dashboard')}
                className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  currentView === 'dashboard'
                    ? 'bg-[#D4AF37] text-slate-950'
                    : 'text-slate-300 hover:bg-[#121722] hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>/admin (Dashboard)</span>
              </button>

              <button
                onClick={() => navigateView('products')}
                className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  currentView === 'products'
                    ? 'bg-[#D4AF37] text-slate-950'
                    : 'text-slate-300 hover:bg-[#121722] hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>/admin/products ({products.length})</span>
              </button>

              <button
                onClick={() => {
                  setFormData(initialNewProduct);
                  navigateView('new_product');
                }}
                className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  currentView === 'new_product'
                    ? 'bg-[#D4AF37] text-slate-950'
                    : 'text-slate-300 hover:bg-[#121722] hover:text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>/admin/products/new</span>
              </button>

              <button
                onClick={() => navigateView('orders')}
                className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  currentView === 'orders'
                    ? 'bg-[#D4AF37] text-slate-950'
                    : 'text-slate-300 hover:bg-[#121722] hover:text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>/admin/orders ({orders.length})</span>
              </button>

              <button
                onClick={() => navigateView('notifications')}
                className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  currentView === 'notifications'
                    ? 'bg-[#D4AF37] text-slate-950'
                    : 'text-slate-300 hover:bg-[#121722] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4" />
                  <span>/admin/notifications</span>
                </div>
                {unreadNotifs > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950 animate-pulse">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigateView('receipts')}
                className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  currentView === 'receipts'
                    ? 'bg-[#D4AF37] text-slate-950'
                    : 'text-slate-300 hover:bg-[#121722] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Receipt className="w-4 h-4" />
                  <span>/admin/receipts</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  ({receipts.length})
                </span>
              </button>

              <div className="mt-auto hidden md:block pt-4 border-t border-[#1E283D] text-[11px] text-slate-500">
                <span>GOYE DB Ledger · NGN Only</span>
              </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Feedback Alert */}
              {feedbackMsg && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
                  <span>{feedbackMsg}</span>
                  <button onClick={() => setFeedbackMsg('')} className="text-emerald-400 hover:text-white">
                    ×
                  </button>
                </div>
              )}

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 bg-red-950/70 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                  <button onClick={() => setErrorMessage('')} className="text-red-400 hover:text-white">
                    ×
                  </button>
                </div>
              )}

              {/* VIEW 1: /admin - Dashboard with counts by ownership_status */}
              {currentView === 'dashboard' && stats && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-xl font-bold text-white">/admin · Ownership Status Dashboard</h3>
                      <p className="text-xs text-slate-400">
                        Counts by ownership status and verified sales ledger.
                      </p>
                    </div>
                    <button
                      onClick={() => fetchAdminData(adminKey)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121722] border border-[#1E283D] text-xs text-slate-300 hover:text-white rounded-lg cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {/* Ownership Status Count Cards */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Products by Ownership Status (Section 2 & 5)
                    </h4>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                      <div className="p-4 bg-[#121722] border border-emerald-500/30 rounded-xl">
                        <span className="text-[10px] text-emerald-400 font-semibold uppercase block">
                          OWNED_BY_GOYE
                        </span>
                        <span className="text-2xl font-bold text-white font-mono mt-1 block">
                          {stats.byOwnershipStatus?.OWNED_BY_GOYE ?? 0}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 block">Publish Eligible</span>
                      </div>

                      <div className="p-4 bg-[#121722] border border-blue-500/30 rounded-xl">
                        <span className="text-[10px] text-blue-400 font-semibold uppercase block">
                          CREATED_FOR_GOYE
                        </span>
                        <span className="text-2xl font-bold text-white font-mono mt-1 block">
                          {stats.byOwnershipStatus?.CREATED_FOR_GOYE ?? 0}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 block">Publish Eligible</span>
                      </div>

                      <div className="p-4 bg-[#121722] border border-purple-500/30 rounded-xl">
                        <span className="text-[10px] text-purple-400 font-semibold uppercase block">
                          LICENSED_FOR_RESALE
                        </span>
                        <span className="text-2xl font-bold text-white font-mono mt-1 block">
                          {stats.byOwnershipStatus?.LICENSED_FOR_RESALE ?? 0}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 block">Publish Eligible</span>
                      </div>

                      <div className="p-4 bg-[#121722] border border-amber-500/40 rounded-xl">
                        <span className="text-[10px] text-amber-400 font-semibold uppercase block">
                          PENDING_RIGHTS_REVIEW
                        </span>
                        <span className="text-2xl font-bold text-white font-mono mt-1 block">
                          {stats.byOwnershipStatus?.PENDING_RIGHTS_REVIEW ?? 0}
                        </span>
                        <span className="text-[10px] text-red-400 mt-1 block">Publish BLOCKED</span>
                      </div>

                      <div className="p-4 bg-[#121722] border border-red-500/40 rounded-xl">
                        <span className="text-[10px] text-red-400 font-semibold uppercase block">
                          DO_NOT_PUBLISH
                        </span>
                        <span className="text-2xl font-bold text-white font-mono mt-1 block">
                          {stats.byOwnershipStatus?.DO_NOT_PUBLISH ?? 0}
                        </span>
                        <span className="text-[10px] text-red-400 mt-1 block">Publish BLOCKED</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial & Order Ledger Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 bg-[#121722] border border-[#1E283D] rounded-xl space-y-1">
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
                        Total Verified Orders
                      </span>
                      <span className="text-2xl font-bold text-white font-mono tabular-nums">
                        {stats.totalOrders}
                      </span>
                      <span className="text-[11px] text-emerald-400 block">
                        {stats.paidOrders} Settled via Paystack / Flutterwave
                      </span>
                    </div>

                    <div className="p-4 bg-[#121722] border border-[#1E283D] rounded-xl space-y-1">
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
                        Gross Settled Revenue (NGN)
                      </span>
                      <span className="text-2xl font-bold text-[#D4AF37] font-mono tabular-nums">
                        {formatNgn(stats.grossRevenueNgn)}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Currency NGN Only · No Stripe
                      </span>
                    </div>

                    <div className="p-4 bg-[#121722] border border-[#1E283D] rounded-xl space-y-1">
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
                        Active Shop Products
                      </span>
                      <span className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
                        {stats.activeApprovedProducts}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        All {stats.activeApprovedProducts} products showing in shop
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: /admin/products - List, filter by ownership, search, publish toggle */}
              {currentView === 'products' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl font-bold text-white">/admin/products · Product Catalog</h3>
                      <p className="text-xs text-slate-400">
                        Filter by ownership status, search, and toggle publish.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setFormData(initialNewProduct);
                        setCurrentView('new_product');
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 bg-[#D4AF37] hover:bg-[#E5BE48] text-slate-950 font-bold rounded-lg text-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Product (/admin/products/new)</span>
                    </button>
                  </div>

                  {/* Filter and Search Bar */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#121722] p-3 rounded-xl border border-[#1E283D]">
                    <div className="relative flex-1 w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search product name, ID, or category..."
                        className="w-full pl-9 pr-3 py-1.5 bg-[#0B0E14] border border-[#1E283D] rounded-lg text-xs text-white outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Filter className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-400 whitespace-nowrap">Ownership:</span>
                      <select
                        value={ownershipFilter}
                        onChange={(e) => setOwnershipFilter(e.target.value)}
                        className="px-2.5 py-1.5 bg-[#0B0E14] border border-[#1E283D] rounded-lg text-xs text-white outline-none"
                      >
                        <option value="ALL">All Ownerships</option>
                        <option value="OWNED_BY_GOYE">OWNED_BY_GOYE</option>
                        <option value="CREATED_FOR_GOYE">CREATED_FOR_GOYE</option>
                        <option value="LICENSED_FOR_RESALE">LICENSED_FOR_RESALE</option>
                        <option value="PENDING_RIGHTS_REVIEW">PENDING_RIGHTS_REVIEW</option>
                        <option value="DO_NOT_PUBLISH">DO_NOT_PUBLISH</option>
                      </select>
                    </div>
                  </div>

                  {/* Products Table */}
                  <div className="bg-[#121722] border border-[#1E283D] rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-[#0B0E14] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#1E283D]">
                        <tr>
                          <th className="px-4 py-3">Product ID</th>
                          <th className="px-4 py-3">Product Name</th>
                          <th className="px-3 py-3">Category</th>
                          <th className="px-3 py-3">Price (NGN)</th>
                          <th className="px-3 py-3">Ownership Status</th>
                          <th className="px-3 py-3">Status</th>
                          <th className="px-3 py-3 text-right">Publish Toggle</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E283D]">
                        {displayedProducts.map((p) => {
                          const allowedOwnership = ['OWNED_BY_GOYE', 'CREATED_FOR_GOYE', 'LICENSED_FOR_RESALE'];
                          const isApproved = allowedOwnership.includes(p.ownership_status);
                          const isActive = p.product_status === 'Active';

                          return (
                            <tr key={p.product_id} className="hover:bg-[#182234]/50">
                              <td className="px-4 py-3 font-mono font-medium text-[#D4AF37]">{p.product_id}</td>
                              <td className="px-4 py-3 font-medium text-white max-w-xs truncate">
                                <span>{p.product_name}</span>
                                <span className="block text-[10px] text-slate-400 font-mono">
                                  {p.file_type} · {p.file_size} · v{p.version}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-slate-400">{p.category}</td>
                              <td className="px-3 py-3 font-mono font-bold text-white">
                                {formatNgn(p.price)}
                              </td>
                              <td className="px-3 py-3">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                    isApproved
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                      : 'bg-red-950 text-red-300 border border-red-500/30'
                                  }`}
                                >
                                  {p.ownership_status}
                                </span>
                              </td>
                              <td className="px-3 py-3">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                    isActive
                                      ? 'bg-blue-950 text-blue-300 border border-blue-500/30'
                                      : 'bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  {p.product_status}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-right">
                                <button
                                  onClick={() => handleTogglePublish(p)}
                                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                                    isActive
                                      ? 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                                      : isApproved
                                      ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'
                                      : 'bg-slate-800 hover:bg-red-900 text-slate-400 border border-red-500/40'
                                  }`}
                                  title={!isApproved && !isActive ? 'Rights not approved - cannot publish' : ''}
                                >
                                  {isActive ? 'Deactivate' : isApproved ? 'Publish' : 'Blocked'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW 3: /admin/products/new - Upload form with required defaults */}
              {currentView === 'new_product' && (
                <div className="max-w-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-xl font-bold text-white">/admin/products/new · Upload Product</h3>
                      <p className="text-xs text-slate-400">
                        Default: ownership_status=PENDING_RIGHTS_REVIEW, creator=GOYE Team, currency=NGN, version=1.0
                      </p>
                    </div>
                    <button
                      onClick={() => setCurrentView('products')}
                      className="px-3 py-1.5 bg-[#121722] hover:bg-slate-800 text-slate-300 text-xs rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleCreateProduct} className="p-6 bg-[#121722] border border-[#1E283D] rounded-2xl space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Product Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.product_name}
                        onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                        placeholder="e.g. Executive Corporate Business Plan"
                        className="w-full px-3 py-2 bg-[#0B0E14] border border-[#1E283D] rounded-lg text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Category (10 Options) *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                          className="w-full px-3 py-2 bg-[#0B0E14] border border-[#1E283D] rounded-lg text-white"
                        >
                          <option value="Business Templates">Business Templates</option>
                          <option value="Marketing Templates">Marketing Templates</option>
                          <option value="AI Resources">AI Resources</option>
                          <option value="Education Resources">Education Resources</option>
                          <option value="Website Resources">Website Resources</option>
                          <option value="Productivity Templates">Productivity Templates</option>
                          <option value="Small Business Tools">Small Business Tools</option>
                          <option value="E-books and Guides">E-books and Guides</option>
                          <option value="Social Media Content Packs">Social Media Content Packs</option>
                          <option value="Professional Documents">Professional Documents</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Ownership Status (Default: PENDING_RIGHTS_REVIEW) *</label>
                        <select
                          value={formData.ownership_status}
                          onChange={(e) => setFormData({ ...formData, ownership_status: e.target.value as OwnershipStatus })}
                          className="w-full px-3 py-2 bg-[#0B0E14] border border-[#1E283D] rounded-lg text-white font-mono"
                        >
                          <option value="PENDING_RIGHTS_REVIEW">PENDING_RIGHTS_REVIEW (Default - Blocked)</option>
                          <option value="OWNED_BY_GOYE">OWNED_BY_GOYE (Approved)</option>
                          <option value="CREATED_FOR_GOYE">CREATED_FOR_GOYE (Approved)</option>
                          <option value="LICENSED_FOR_RESALE">LICENSED_FOR_RESALE (Approved)</option>
                          <option value="DO_NOT_PUBLISH">DO_NOT_PUBLISH (Blocked)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Price (NGN Only) *</label>
                        <input
                          type="number"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-[#0B0E14] border border-[#1E283D] rounded-lg text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">File Type (PDF, DOCX, XLSX, ZIP) *</label>
                        <select
                          value={formData.file_type}
                          onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
                          className="w-full px-3 py-2 bg-[#0B0E14] border border-[#1E283D] rounded-lg text-white"
                        >
                          <option value="DOCX">DOCX</option>
                          <option value="XLSX">XLSX</option>
                          <option value="PDF">PDF</option>
                          <option value="PPTX">PPTX</option>
                          <option value="ZIP">ZIP</option>
                          <option value="TXT">TXT</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Version (Default: 1.0)</label>
                        <input
                          type="text"
                          value={formData.version}
                          onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                          className="w-full px-3 py-2 bg-[#0B0E14] border border-[#1E283D] rounded-lg text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Short Description *</label>
                      <input
                        type="text"
                        required
                        value={formData.short_description}
                        onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0B0E14] border border-[#1E283D] rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Full Description *</label>
                      <textarea
                        rows={3}
                        required
                        value={formData.full_description}
                        onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0B0E14] border border-[#1E283D] rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Protected Document Payload (Stored in private bucket vault; delivered server-side upon verified Paystack/Flutterwave payment)
                      </label>
                      <textarea
                        rows={4}
                        value={formData.content_document_text}
                        onChange={(e) => setFormData({ ...formData, content_document_text: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0B0E14] border border-[#1E283D] rounded-lg text-white font-mono text-[11px]"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#D4AF37] hover:bg-[#E5BE48] text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save & Add to Product Catalog</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* VIEW 4: /admin/orders - Orders list */}
              {currentView === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-xl font-bold text-white">/admin/orders · Customer Orders</h3>
                      <p className="text-xs text-slate-400">
                        Audit trail of Paystack and Flutterwave orders with download status.
                      </p>
                    </div>
                    <span className="text-xs text-slate-400">{orders.length} total recorded</span>
                  </div>

                  <div className="bg-[#121722] border border-[#1E283D] rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-[#0B0E14] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#1E283D]">
                        <tr>
                          <th className="px-4 py-3">Order ID</th>
                          <th className="px-3 py-3">Customer Email</th>
                          <th className="px-3 py-3">Product Name</th>
                          <th className="px-3 py-3">Amount (NGN)</th>
                          <th className="px-3 py-3">Gateway</th>
                          <th className="px-3 py-3">Payment Status</th>
                          <th className="px-3 py-3">Signed URL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E283D]">
                        {orders.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                              No orders recorded yet.
                            </td>
                          </tr>
                        ) : (
                          orders.map((o) => (
                            <tr key={o.id} className="hover:bg-[#182234]/50">
                              <td className="px-4 py-3 font-mono font-medium text-[#D4AF37]">{o.id}</td>
                              <td className="px-3 py-3">
                                <span className="font-medium text-white">{o.customer_name || 'Customer'}</span>
                                <span className="block text-[11px] text-slate-400">{o.email}</span>
                              </td>
                              <td className="px-3 py-3 text-slate-200 max-w-xs truncate">{o.product_name}</td>
                              <td className="px-3 py-3 font-mono font-bold text-white">{formatNgn(o.amount)}</td>
                              <td className="px-3 py-3 font-mono text-[11px] text-slate-400">{o.payment_method}</td>
                              <td className="px-3 py-3">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                    o.status === 'paid'
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                      : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                                  }`}
                                >
                                  {o.status}
                                </span>
                              </td>
                              <td className="px-3 py-3">
                                {o.download_url ? (
                                  <a
                                    href={o.download_url}
                                    download
                                    className="text-xs text-[#D4AF37] hover:underline font-mono"
                                  >
                                    Active (24h)
                                  </a>
                                ) : (
                                  <span className="text-[11px] text-slate-500">None</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW 5: /admin/notifications - Event Notifications & Real-Time Alerts */}
              {currentView === 'notifications' && (
                <div className="space-y-6">
                  {/* Header & Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-xl font-bold text-white">
                          /admin/notifications · Audit & Event Alerts
                        </h3>
                        {unreadNotifs > 0 && (
                          <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold rounded-full">
                            {unreadNotifs} New Unread
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Real-time alerts for verified payments, downloads, support messages, and product rights reviews.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleMarkAllAsRead}
                        disabled={unreadNotifs === 0}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121722] hover:bg-slate-800 disabled:opacity-50 text-slate-200 text-xs font-semibold rounded-lg border border-[#1E283D] transition-colors cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Mark All Read</span>
                      </button>

                      <button
                        onClick={handleClearNotifications}
                        disabled={notifications.length === 0}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121722] hover:bg-red-950/60 text-slate-300 hover:text-red-300 text-xs font-semibold rounded-lg border border-[#1E283D] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        <span>Clear All</span>
                      </button>

                      {/* Quick Test Alert Buttons */}
                      <button
                        onClick={() => handleTriggerTestNotification('ORDER_PAID')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] text-xs font-bold rounded-lg border border-[#D4AF37]/30 transition-colors cursor-pointer"
                        title="Simulate a real-time payment notification"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Test Alert</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    {(
                      [
                        { id: 'ALL', label: `All (${notifications.length})` },
                        { id: 'UNREAD', label: `Unread (${unreadNotifs})` },
                        { id: 'ORDERS', label: 'Payments & Orders' },
                        { id: 'SUPPORT', label: 'Support Tickets' },
                        { id: 'DOWNLOADS', label: 'File Downloads' },
                        { id: 'RIGHTS', label: 'Rights & Safety' }
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setNotificationFilter(f.id)}
                        className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                          notificationFilter === f.id
                            ? 'bg-[#D4AF37] text-slate-950 font-bold'
                            : 'bg-[#121722] text-slate-400 hover:text-white border border-[#1E283D]'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Notifications List */}
                  <div className="space-y-3">
                    {notifications.length === 0 ? (
                      <div className="p-12 text-center bg-[#121722] border border-[#1E283D] rounded-xl text-slate-400 space-y-2">
                        <Bell className="w-8 h-8 text-slate-600 mx-auto" />
                        <p className="text-sm text-slate-300 font-semibold">No Notifications Yet</p>
                        <p className="text-xs text-slate-500">
                          Verified transactions, download activities, and support tickets will appear here automatically.
                        </p>
                        <button
                          onClick={() => handleTriggerTestNotification('ORDER_PAID')}
                          className="mt-2 px-4 py-2 bg-[#D4AF37] text-slate-950 font-bold text-xs rounded-lg inline-flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Generate Sample Alert</span>
                        </button>
                      </div>
                    ) : (
                      notifications
                        .filter((n) => {
                          if (notificationFilter === 'UNREAD') return !n.read;
                          if (notificationFilter === 'ORDERS') return n.type === 'ORDER_PAID' || n.type === 'NEW_ORDER';
                          if (notificationFilter === 'SUPPORT') return n.type === 'SUPPORT_TICKET';
                          if (notificationFilter === 'DOWNLOADS') return n.type === 'DOWNLOAD_ACCESSED';
                          if (notificationFilter === 'RIGHTS') return n.type === 'RIGHTS_ALERT' || n.type === 'PRODUCT_CREATED';
                          return true;
                        })
                        .map((n) => {
                          // Type-specific icon & badge styling
                          let icon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
                          let badgeBg = 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300';

                          if (n.type === 'SUPPORT_TICKET') {
                            icon = <HelpCircle className="w-4 h-4 text-blue-400" />;
                            badgeBg = 'bg-blue-950/60 border-blue-500/40 text-blue-300';
                          } else if (n.type === 'DOWNLOAD_ACCESSED') {
                            icon = <DownloadCloud className="w-4 h-4 text-purple-400" />;
                            badgeBg = 'bg-purple-950/60 border-purple-500/40 text-purple-300';
                          } else if (n.type === 'RIGHTS_ALERT') {
                            icon = <AlertTriangle className="w-4 h-4 text-amber-400" />;
                            badgeBg = 'bg-amber-950/60 border-amber-500/40 text-amber-300';
                          } else if (n.type === 'PRODUCT_CREATED') {
                            icon = <Package className="w-4 h-4 text-cyan-400" />;
                            badgeBg = 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300';
                          }

                          const formattedTime = new Date(n.timestamp).toLocaleString('en-NG', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                            timeZone: 'Africa/Lagos'
                          });

                          return (
                            <div
                              key={n.id}
                              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                                n.read
                                  ? 'bg-[#121722]/80 border-[#1E283D] opacity-80'
                                  : 'bg-[#151c2a] border-[#D4AF37]/50 shadow-md shadow-amber-950/10'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg border ${badgeBg} shrink-0 mt-0.5`}>
                                  {icon}
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h5 className="font-bold text-white text-sm">{n.title}</h5>
                                    {!n.read && (
                                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                                    )}
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B0E14] border border-[#1E283D] text-slate-400">
                                      {n.type}
                                    </span>
                                  </div>

                                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{n.message}</p>

                                  {/* Metadata Chips */}
                                  {n.metadata && (
                                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                                      {n.metadata.order_id && (
                                        <span className="font-mono text-[#D4AF37] bg-[#0B0E14] px-2 py-0.5 rounded border border-[#1E283D]">
                                          Order: {n.metadata.order_id}
                                        </span>
                                      )}
                                      {n.metadata.amount !== undefined && n.metadata.amount > 0 && (
                                        <span className="font-mono text-emerald-400 font-bold bg-[#0B0E14] px-2 py-0.5 rounded border border-[#1E283D]">
                                          {formatNgn(n.metadata.amount)}
                                        </span>
                                      )}
                                      {n.metadata.gateway && (
                                        <span className="font-mono text-slate-300 bg-[#0B0E14] px-2 py-0.5 rounded border border-[#1E283D]">
                                          {n.metadata.gateway}
                                        </span>
                                      )}
                                      {n.metadata.customer_email && (
                                        <span className="text-slate-400 bg-[#0B0E14] px-2 py-0.5 rounded border border-[#1E283D]">
                                          {n.metadata.customer_email}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  <div className="text-[10px] text-slate-500 pt-1 flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" />
                                    <span>{formattedTime} (WAT)</span>
                                  </div>
                                </div>
                              </div>

                              {/* Card Action Buttons */}
                              <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
                                {!n.read && (
                                  <button
                                    onClick={() => handleMarkAsRead(n.id)}
                                    className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-[#0B0E14] border border-[#1E283D] rounded-lg transition-colors cursor-pointer"
                                  >
                                    Mark Read
                                  </button>
                                )}

                                {n.metadata?.order_id && (
                                  <button
                                    onClick={() => setSelectedReceiptOrderId(n.metadata?.order_id || null)}
                                    className="px-2.5 py-1 text-[11px] font-bold text-[#D4AF37] hover:bg-[#D4AF37]/15 bg-[#0B0E14] border border-[#D4AF37]/40 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                                  >
                                    <Receipt className="w-3 h-3" />
                                    <span>Receipt</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
              )}

              {/* VIEW 6: /admin/receipts - Official Email Receipts Management */}
              {currentView === 'receipts' && (
                <div className="space-y-6">
                  {/* Header & Search */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-bold text-white">
                        /admin/receipts · Official Email Receipts Ledger
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Commercial receipts generated for every verified Paystack, Flutterwave, and Free claim transaction.
                      </p>
                    </div>

                    <div className="relative w-full sm:w-72">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={receiptSearch}
                        onChange={(e) => setReceiptSearch(e.target.value)}
                        placeholder="Search receipt #, order, email..."
                        className="w-full pl-9 pr-3 py-2 bg-[#121722] border border-[#1E283D] focus:border-[#D4AF37] rounded-xl text-white text-xs outline-none"
                      />
                    </div>
                  </div>

                  {/* Receipts Table */}
                  <div className="bg-[#121722] border border-[#1E283D] rounded-xl overflow-x-auto shadow-lg">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0B0E14] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#1E283D]">
                        <tr>
                          <th className="px-4 py-3">Receipt #</th>
                          <th className="px-3 py-3">Order ID</th>
                          <th className="px-3 py-3">Customer</th>
                          <th className="px-3 py-3">Product</th>
                          <th className="px-3 py-3">Amount (NGN)</th>
                          <th className="px-3 py-3">Gateway</th>
                          <th className="px-3 py-3">Issued Date (WAT)</th>
                          <th className="px-3 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E283D]">
                        {receipts.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                              No receipts issued yet. Receipts are generated automatically upon order payment.
                            </td>
                          </tr>
                        ) : (
                          receipts
                            .filter((r) => {
                              if (!receiptSearch.trim()) return true;
                              const q = receiptSearch.toLowerCase();
                              return (
                                r.receipt_number.toLowerCase().includes(q) ||
                                r.order_id.toLowerCase().includes(q) ||
                                r.customer_email.toLowerCase().includes(q) ||
                                r.customer_name.toLowerCase().includes(q) ||
                                r.product_name.toLowerCase().includes(q)
                              );
                            })
                            .map((r) => (
                              <tr key={r.receipt_number} className="hover:bg-[#182234]/50">
                                <td className="px-4 py-3 font-mono font-bold text-[#D4AF37]">
                                  {r.receipt_number}
                                </td>
                                <td className="px-3 py-3 font-mono text-slate-300">{r.order_id}</td>
                                <td className="px-3 py-3">
                                  <div className="font-semibold text-white">{r.customer_name}</div>
                                  <div className="text-[11px] text-slate-400">{r.customer_email}</div>
                                </td>
                                <td className="px-3 py-3 max-w-xs truncate text-slate-200">
                                  <span className="font-medium text-white">{r.product_name}</span>
                                  <span className="block text-[10px] text-slate-400 font-mono">
                                    {r.product_id} ({r.file_type})
                                  </span>
                                </td>
                                <td className="px-3 py-3 font-mono font-bold text-white">
                                  {formatNgn(r.amount)}
                                </td>
                                <td className="px-3 py-3 font-mono text-[11px] text-[#D4AF37]">
                                  {r.payment_method}
                                </td>
                                <td className="px-3 py-3 text-[11px] text-slate-400 whitespace-nowrap">
                                  {new Date(r.issued_at).toLocaleDateString('en-NG')}
                                </td>
                                <td className="px-3 py-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => setSelectedReceiptOrderId(r.order_id)}
                                      className="px-2.5 py-1 bg-[#D4AF37] hover:bg-[#E5BE48] text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                                      title="View Official Email Receipt"
                                    >
                                      View
                                    </button>

                                    <a
                                      href={`/api/receipts/${encodeURIComponent(r.order_id)}/html`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 bg-[#0B0E14] hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-[#1E283D] transition-colors"
                                      title="Print HTML Document"
                                    >
                                      <Printer className="w-3.5 h-3.5" />
                                    </a>

                                    <button
                                      onClick={() => handleResendReceipt(r.order_id)}
                                      className="p-1.5 bg-[#0B0E14] hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-[#1E283D] transition-colors cursor-pointer"
                                      title="Resend to Customer Email"
                                    >
                                      <Send className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* Official Email Receipt Modal */}
      {selectedReceiptOrderId && (
        <ReceiptModal
          orderId={selectedReceiptOrderId}
          onClose={() => setSelectedReceiptOrderId(null)}
        />
      )}
    </div>
  );
};
