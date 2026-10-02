/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowUpDown,
  Sparkles,
  Download,
  ShieldCheck,
  FileCheck,
  AlertCircle,
  ExternalLink,
  Mail,
  Scale,
  Award,
  ArrowRight,
  Folder,
  DownloadCloud
} from 'lucide-react';
import { DigitalProduct, SiteSettings, ProductCategory } from './types/marketplace';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CheckoutModal } from './components/CheckoutModal';
import { DownloadPage } from './components/DownloadPage';
import { CustomerDashboard } from './components/CustomerDashboard';
import { SupportSection } from './components/SupportSection';
import { LicensingSection } from './components/LicensingSection';
import { PolicyModal } from './components/PolicyModal';
import { AdminPortal } from './components/AdminPortal';
import { PaystackLogo, FlutterwaveLogo } from './components/PaymentLogos';
import { INITIAL_SETTINGS } from './data/starterProducts';

export default function App() {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS as SiteSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Mobile loading optimization: fastMode toggle for low data / slow connections
  const [fastMode, setFastMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('goye_fast_mode');
      if (saved !== null) return saved === 'true';
      const conn = (navigator as any).connection;
      if (conn && (conn.saveData || conn.effectiveType === '2g' || conn.effectiveType === '3g')) {
        return true;
      }
    }
    return false;
  });

  // Navigation & Filter State
  const [activeNavTab, setActiveNavTab] = useState<'catalog' | 'licensing' | 'support'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  // Modals & Panels
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<DigitalProduct | null>(null);
  const [checkoutGateway, setCheckoutGateway] = useState<'PAYSTACK' | 'FLUTTERWAVE'>('PAYSTACK');
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [showCustomerDashboard, setShowCustomerDashboard] = useState(false);
  const [activePolicy, setActivePolicy] = useState<'license' | 'refund' | 'terms' | 'privacy' | null>(null);

  // Direct Route Handling for /download/:orderId
  const [downloadOrderId, setDownloadOrderId] = useState<string | null>(null);

  // Check URL pathname for direct routes
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      if (path.startsWith('/download/')) {
        const orderId = path.replace('/download/', '').split('?')[0];
        if (orderId) setDownloadOrderId(orderId);
      } else if (path === '/admin') {
        setShowAdminPortal(true);
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, []);

  // Save fastMode preference
  useEffect(() => {
    localStorage.setItem('goye_fast_mode', String(fastMode));
  }, [fastMode]);

  // Mobile optimization: Instant hydration from local cache (0ms blank screen)
  useEffect(() => {
    try {
      const cached = localStorage.getItem('goye_cached_products');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          setIsLoading(false);
        }
      }
      const cachedSet = localStorage.getItem('goye_cached_settings');
      if (cachedSet) {
        setSettings(prev => ({ ...prev, ...JSON.parse(cachedSet) }));
      }
    } catch {
      // ignore JSON errors
    }
  }, []);

  // Fetch Public Products & Settings from Backend
  const loadMarketplaceData = async () => {
    try {
      const [prodRes, setRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/settings')
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
        try {
          localStorage.setItem('goye_cached_products', JSON.stringify(prodData));
        } catch {}
      }

      if (setRes.ok) {
        const setData = await setRes.json();
        setSettings((prev) => ({ ...prev, ...setData }));
        try {
          localStorage.setItem('goye_cached_settings', JSON.stringify(setData));
        } catch {}
      }
    } catch (err) {
      console.error('Error fetching marketplace data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  // 10 Official Categories from Section 1
  const all10Categories: ProductCategory[] = [
    'Business Templates',
    'Marketing Templates',
    'AI Resources',
    'Education Resources',
    'Website Resources',
    'Productivity Templates',
    'Small Business Tools',
    'E-books and Guides',
    'Social Media Content Packs',
    'Professional Documents'
  ];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const name = (p.product_name || p.title || '').toLowerCase();
          const desc = (p.short_description || p.shortDescription || '').toLowerCase();
          const id = (p.product_id || p.id || '').toLowerCase();
          const cat = (p.category || '').toLowerCase();
          if (!name.includes(q) && !desc.includes(q) && !id.includes(q) && !cat.includes(q)) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'ALL' && p.category !== selectedCategory) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        // Default: sort by product_id or publication date
        return (a.product_id || '').localeCompare(b.product_id || '');
      });
  }, [products, searchQuery, selectedCategory, sortBy]);

  // Bestsellers (Flagship products)
  const bestsellers = useMemo(() => {
    const bestsellerIds = ['P-GOYE-001', 'P-GOYE-008', 'P-GOYE-016', 'P-GOYE-013'];
    return products.filter((p) => bestsellerIds.includes(p.product_id || p.id || ''));
  }, [products]);

  // Format Nigerian Naira
  const formatNgn = (val: number) => {
    return `₦${new Intl.NumberFormat('en-NG').format(val)}`;
  };

  // If on a /download/:orderId route
  if (downloadOrderId) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col font-sans">
        <Navbar
          activeTab={activeNavTab}
          setActiveTab={(tab) => {
            setDownloadOrderId(null);
            window.history.pushState({}, '', '/');
            setActiveNavTab(tab as any);
          }}
          onOpenAdmin={() => setShowAdminPortal(true)}
          onOpenCustomerDashboard={() => setShowCustomerDashboard(true)}
        />
        <main className="flex-1">
          <DownloadPage
            orderId={downloadOrderId}
            onBackToShop={() => {
              setDownloadOrderId(null);
              window.history.pushState({}, '', '/');
            }}
          />
        </main>
        {showAdminPortal && (
          <AdminPortal
            onClose={() => setShowAdminPortal(false)}
            onRefreshPublicData={loadMarketplaceData}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-white pb-16 sm:pb-0">
      {/* 1. Header (Top Bar Contract) */}
      <Navbar
        activeTab={activeNavTab}
        setActiveTab={(tab) => {
          setActiveNavTab(tab as any);
          if (tab === 'catalog') setSelectedCategory('ALL');
        }}
        onOpenAdmin={() => setShowAdminPortal(true)}
        onOpenCustomerDashboard={() => setShowCustomerDashboard(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeNavTab === 'licensing' ? (
          <LicensingSection onOpenPolicy={(type) => setActivePolicy(type)} />
        ) : activeNavTab === 'support' ? (
          <SupportSection
            settings={settings}
            onOpenPolicy={(type) => setActivePolicy(type)}
          />
        ) : (
          /* Catalog View */
          <div>
            {/* Hero Section with 10-category grid */}
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={(cat) => setSelectedCategory(cat)}
              categories={all10Categories}
              totalPublished={products.length}
              fastMode={fastMode}
              setFastMode={setFastMode}
            />

            {/* Bestsellers Section (Section 5) - Hidden in Fast Mode to save mobile data */}
            {!fastMode && selectedCategory === 'ALL' && !searchQuery && bestsellers.length > 0 && (
              <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#1E283D]/60">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#D4AF37]" />
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                      GOYE Bestsellers & Flagship Suites
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400">High Demand Nigerian & International Tools</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {bestsellers.map((product) => (
                    <ProductCard
                      key={product.product_id}
                      product={product}
                      onSelect={(p) => setSelectedProduct(p)}
                      onBuyNow={(p) => {
                        setCheckoutProduct(p);
                        setCheckoutGateway('PAYSTACK');
                      }}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* All Products Catalog Grid */}
            <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header & Sort Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E283D]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {selectedCategory === 'ALL' ? 'Complete Digital Product Catalog (20)' : selectedCategory}
                    </h2>
                    {fastMode && (
                      <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold rounded-full">
                        Fast Mobile Mode Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Showing {filteredProducts.length} products · 100% OWNED_BY_GOYE · Currency: NGN Only
                  </p>
                </div>

                {/* Sorting Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>Sort:</span>
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1.5 bg-[#121722] border border-[#1E283D] focus:border-[#D4AF37] text-white text-xs rounded-lg outline-none cursor-pointer"
                  >
                    <option value="newest">Catalog Order (P-GOYE-001 ...)</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Products Grid or Fast Mobile List */}
              {isLoading ? (
                <div className="text-center py-20 text-slate-400">
                  <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm">Loading 20 GOYE digital products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-[#121722]/50 border border-[#1E283D] rounded-2xl p-8 max-w-md mx-auto my-8">
                  <p className="text-sm font-semibold text-white">No products found matching your filter.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('ALL');
                    }}
                    className="mt-4 px-4 py-2 bg-[#D4AF37] text-slate-950 font-bold text-xs rounded-lg"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : fastMode ? (
                /* Fast Mobile Compact List View (Reduced DOM, instant rendering) */
                <div className="space-y-3 pt-6">
                  {filteredProducts.map((product) => {
                    const priceNgn = `₦${new Intl.NumberFormat('en-NG').format(product.price)}`;
                    return (
                      <div
                        key={product.product_id || product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="p-4 bg-[#121722] border border-[#1E283D] hover:border-[#D4AF37] rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-colors shadow-sm"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span className="text-[#D4AF37] font-semibold uppercase">{product.category}</span>
                            <span>·</span>
                            <span className="font-mono">{product.product_id}</span>
                            <span>·</span>
                            <span className="font-mono text-slate-300">{product.file_type}</span>
                          </div>
                          <h4 className="font-semibold text-white text-sm sm:text-base truncate group-hover:text-[#D4AF37]">
                            {product.product_name}
                          </h4>
                          <p className="text-xs text-slate-300 line-clamp-1">{product.short_description}</p>
                        </div>

                        <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                          <span className="font-mono font-bold text-white text-sm sm:text-base">
                            {priceNgn}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCheckoutProduct(product);
                              setCheckoutGateway('PAYSTACK');
                            }}
                            className="px-3.5 py-1.5 bg-[#D4AF37] hover:bg-[#E5BE48] text-slate-950 font-bold text-xs rounded-lg cursor-pointer shadow-sm"
                          >
                            {product.price === 0 || product.isFree ? 'Claim' : 'Buy'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Full Visual Product Cards Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.product_id || product.id}
                      product={product}
                      onSelect={(p) => setSelectedProduct(p)}
                      onBuyNow={(p) => {
                        setCheckoutProduct(p);
                        setCheckoutGateway('PAYSTACK');
                      }}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Footer (Clean, Quiet, Anti-Slop, Paystack + Flutterwave Only) */}
      <footer className="bg-[#080B10] border-t border-[#1E283D] pt-12 pb-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Brand Column */}
            <div className="md:col-span-5 space-y-3">
              <span className="font-display font-bold text-white text-base tracking-tight block">
                GOYE DIGITAL MARKETPLACE
              </span>
              <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
                Download practical templates, guides and digital resources created by GOYE. Settles exclusively in NGN via Paystack and Flutterwave. Zero Stripe integration.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <PaystackLogo className="opacity-80" />
                <span aria-hidden="true" className="text-slate-600">·</span>
                <FlutterwaveLogo className="opacity-80" />
              </div>
            </div>

            {/* 10 Categories List */}
            <div className="md:col-span-4 space-y-2">
              <span className="text-white font-semibold text-xs uppercase tracking-wider block">
                10 Core Categories
              </span>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                {all10Categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveNavTab('catalog');
                      setSelectedCategory(cat);
                    }}
                    className="text-left text-slate-400 hover:text-white truncate transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Legal & Governance */}
            <div className="md:col-span-3 space-y-2">
              <span className="text-white font-semibold text-xs uppercase tracking-wider block">
                Governance & Legal
              </span>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    onClick={() => setActivePolicy('license')}
                    className="hover:text-white transition-colors"
                  >
                    License Terms (Single Buyer)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePolicy('refund')}
                    className="hover:text-white transition-colors"
                  >
                    Defective File Replacement Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePolicy('terms')}
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="text-[#D4AF37] hover:underline flex items-center gap-1.5 pt-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{settings.contactEmail}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#1E283D] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © 2026 GOYE. All Rights Reserved. All 20 products OWNED_BY_GOYE.
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCustomerDashboard(true)}
                className="hover:text-slate-300 cursor-pointer"
              >
                /download (Order Lookup)
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => setShowAdminPortal(true)}
                className="hover:text-slate-300 cursor-pointer"
              >
                /admin (Portal)
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal (/product/[id]) */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onInitiateCheckout={(p, gateway) => {
            setSelectedProduct(null);
            setCheckoutProduct(p);
            setCheckoutGateway(gateway);
          }}
          onOpenPolicy={(policy) => setActivePolicy(policy)}
          settings={settings}
        />
      )}

      {/* Checkout Modal (/checkout/[id]) */}
      {checkoutProduct && (
        <CheckoutModal
          product={checkoutProduct}
          initialGateway={checkoutGateway}
          onClose={() => setCheckoutProduct(null)}
          settings={settings}
          onOrderSuccess={(orderId, downloadUrl) => {
            loadMarketplaceData();
          }}
        />
      )}

      {/* Customer Orders & Download Lookup Modal */}
      {showCustomerDashboard && (
        <CustomerDashboard onClose={() => setShowCustomerDashboard(false)} />
      )}

      {/* Admin Management Portal Modal (/admin, /admin/products, /admin/products/new, /admin/orders) */}
      {showAdminPortal && (
        <AdminPortal
          onClose={() => setShowAdminPortal(false)}
          onRefreshPublicData={loadMarketplaceData}
        />
      )}

      {/* Legal & Policy Modals */}
      {activePolicy && (
        <PolicyModal
          policyType={activePolicy}
          onClose={() => setActivePolicy(null)}
          settings={settings}
        />
      )}

      {/* Mobile Sticky Bottom Quick-Access Bar (Optimized for 1-thumb mobile navigation) */}
      <nav aria-label="Mobile Navigation" className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0E14]/95 backdrop-blur-lg border-t border-[#1E283D] px-4 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => {
            setActiveNavTab('catalog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-semibold transition-colors cursor-pointer ${
            activeNavTab === 'catalog' ? 'text-[#D4AF37]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Folder className="w-4 h-4" />
          <span>Catalog</span>
        </button>

        <button
          onClick={() => setShowCustomerDashboard(true)}
          className="flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-semibold text-slate-400 hover:text-[#D4AF37] transition-colors cursor-pointer"
        >
          <DownloadCloud className="w-4 h-4" />
          <span>My Orders</span>
        </button>

        <button
          onClick={() => setActiveNavTab('support')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-semibold transition-colors cursor-pointer ${
            activeNavTab === 'support' ? 'text-[#D4AF37]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Support</span>
        </button>

        <button
          onClick={() => setShowAdminPortal(true)}
          className="flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Admin</span>
        </button>
      </nav>
    </div>
  );
}
