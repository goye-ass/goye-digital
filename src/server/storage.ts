import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  DigitalProduct,
  OrderRecord,
  SiteSettings,
  MarketplaceStats,
  AdminNotification,
  EmailReceipt,
  NotificationType
} from '../types/marketplace';
import { STARTER_PRODUCTS, INITIAL_SETTINGS } from '../data/starterProducts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const PROTECTED_FILES_DIR = path.resolve(DATA_DIR, 'protected_files');
const PRODUCTS_FILE = path.resolve(DATA_DIR, 'products.json');
const ORDERS_FILE = path.resolve(DATA_DIR, 'orders.json');
const SETTINGS_FILE = path.resolve(DATA_DIR, 'settings.json');
const NOTIFICATIONS_FILE = path.resolve(DATA_DIR, 'notifications.json');
const RECEIPTS_FILE = path.resolve(DATA_DIR, 'email_receipts.json');

// Ensure storage directories exist
export function initStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PROTECTED_FILES_DIR)) {
    fs.mkdirSync(PROTECTED_FILES_DIR, { recursive: true });
  }

  // Initialize or re-seed with all 20 products if empty or outdated
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(STARTER_PRODUCTS, null, 2), 'utf-8');
  } else {
    try {
      const current = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
      if (current.length < 20 || !current[0]?.product_id) {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(STARTER_PRODUCTS, null, 2), 'utf-8');
      }
    } catch {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(STARTER_PRODUCTS, null, 2), 'utf-8');
    }
  }

  // Initialize settings if not present
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(INITIAL_SETTINGS, null, 2), 'utf-8');
  }

  // Initialize orders if not present
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }

  // Initialize notifications if not present
  if (!fs.existsSync(NOTIFICATIONS_FILE)) {
    const seedNotifications: AdminNotification[] = [
      {
        id: `notif-${Date.now().toString(36)}-init1`,
        type: 'ORDER_PAID',
        title: 'System Initialized: 20 Products Ready',
        message: 'All 20 GOYE digital products are active with OWNED_BY_GOYE verified status.',
        timestamp: new Date().toISOString(),
        read: false,
        metadata: {
          amount: 0,
          gateway: 'PAYSTACK'
        }
      }
    ];
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(seedNotifications, null, 2), 'utf-8');
  }

  // Initialize receipts if not present
  if (!fs.existsSync(RECEIPTS_FILE)) {
    fs.writeFileSync(RECEIPTS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }

  // Ensure all 20 starter protected files are written to secure directory
  for (const product of STARTER_PRODUCTS) {
    const filename = path.basename(product.file_path_private);
    const filePath = path.resolve(PROTECTED_FILES_DIR, filename);
    if (!fs.existsSync(filePath)) {
      const content = product.content_document_text || `GOYE DIGITAL PRODUCT: ${product.product_name}\nProduct ID: ${product.product_id}\nVersion: ${product.version}\n© 2026 GOYE. All Rights Reserved.`;
      fs.writeFileSync(filePath, content, 'utf-8');
    }
  }
}

// Product Storage helpers
export function getAllProducts(): DigitalProduct[] {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.map((p: any) => normalizeProduct(p));
  } catch (err) {
    console.error('Error reading products:', err);
    return [];
  }
}

function normalizeProduct(p: any): DigitalProduct {
  const prodId = p.product_id || p.id;
  const prodName = p.product_name || p.title;
  const ownership = p.ownership_status || p.ownershipStatus || 'OWNED_BY_GOYE';
  const status = p.product_status || (p.status === 'PUBLISHED' ? 'Active' : p.status) || 'Active';
  const fileType = p.file_type || p.fileType || 'PDF';
  const fileSize = p.file_size || p.fileSize || '2.0 MB';
  const price = typeof p.price === 'number' ? p.price : 2000;

  return {
    ...p,
    product_id: prodId,
    product_name: prodName,
    id: prodId,
    title: prodName,
    ownership_status: ownership,
    ownershipStatus: ownership,
    product_status: status,
    status,
    file_type: fileType,
    fileType,
    file_size: fileSize,
    fileSize,
    price,
    currency: 'NGN',
    preview_image: p.preview_image || p.coverImage || '/src/assets/images/goye_startup_kit_1790804175475.jpg',
    coverImage: p.preview_image || p.coverImage || '/src/assets/images/goye_startup_kit_1790804175475.jpg',
    license_terms: p.license_terms || p.licenseTerms || 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: p.usage_instructions || p.usageInstructions || 'Download, open in compatible app, customize for your business',
    refund_policy_ref: p.refund_policy_ref || p.refundPolicyRef || 'Digital product, no refund after download, defective file replacement within 7 days',
    file_path_private: p.file_path_private || `/private/products/${prodId.toLowerCase()}.${fileType.toLowerCase()}`,
    isFree: price === 0
  };
}

export function saveProducts(products: DigitalProduct[]): void {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

// Public shop API: WHERE ownership_status IN ('OWNED_BY_GOYE','CREATED_FOR_GOYE','LICENSED_FOR_RESALE') AND product_status='Active'
export function getPublicProducts(): DigitalProduct[] {
  const all = getAllProducts();
  const allowedOwnership = ['OWNED_BY_GOYE', 'CREATED_FOR_GOYE', 'LICENSED_FOR_RESALE'];

  return all
    .filter(p => allowedOwnership.includes(p.ownership_status) && p.product_status === 'Active')
    .map(p => {
      // Security: Strip private file path and raw content payload from public shop view
      const { file_path_private, content_document_text, ...publicData } = p;
      return publicData as DigitalProduct;
    });
}

export function getProductById(id: string, isPublic = true): DigitalProduct | null {
  const all = getAllProducts();
  const product = all.find(p => p.product_id === id || p.id === id);
  if (!product) return null;

  if (isPublic) {
    const allowedOwnership = ['OWNED_BY_GOYE', 'CREATED_FOR_GOYE', 'LICENSED_FOR_RESALE'];
    if (product.product_status !== 'Active' || !allowedOwnership.includes(product.ownership_status)) {
      return null;
    }
    const { file_path_private, content_document_text, ...publicData } = product;
    return publicData as DigitalProduct;
  }

  return product;
}

// Order Storage helpers
export function getAllOrders(): OrderRecord[] {
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.map((o: any) => normalizeOrder(o));
  } catch (err) {
    console.error('Error reading orders:', err);
    return [];
  }
}

function normalizeOrder(o: any): OrderRecord {
  return {
    ...o,
    id: o.id,
    product_id: o.product_id || o.productId,
    product_name: o.product_name || o.productTitle,
    productId: o.product_id || o.productId,
    productTitle: o.product_name || o.productTitle,
    email: o.email || o.customerEmail,
    customerEmail: o.email || o.customerEmail,
    customer_name: o.customer_name || o.customerName || 'Customer',
    customerName: o.customer_name || o.customerName || 'Customer',
    amount: o.amount,
    currency: 'NGN',
    status: o.status || (o.paymentStatus?.toLowerCase() === 'paid' ? 'paid' : 'pending'),
    paymentStatus: (o.status === 'paid' || o.paymentStatus === 'PAID') ? 'PAID' : 'PENDING',
    downloadStatus: (o.status === 'paid' || o.paymentStatus === 'PAID') ? 'AVAILABLE' : 'NOT_AVAILABLE',
    downloadToken: o.download_token || o.downloadToken,
    download_token: o.download_token || o.downloadToken,
    downloadExpiresAt: o.download_expires_at || o.downloadExpiresAt,
    download_expires_at: o.download_expires_at || o.downloadExpiresAt,
    created_at: o.created_at || o.createdDate || new Date().toISOString(),
    createdDate: o.created_at || o.createdDate || new Date().toISOString(),
    download_history: o.download_history || o.downloadHistory || []
  };
}

export function saveOrders(orders: OrderRecord[]): void {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

export function getOrderById(id: string): OrderRecord | null {
  const orders = getAllOrders();
  return orders.find(o => o.id === id) || null;
}

export function getOrderByToken(token: string): OrderRecord | null {
  const orders = getAllOrders();
  return orders.find(o => o.download_token === token || o.downloadToken === token) || null;
}

export function getCustomerOrders(email: string): OrderRecord[] {
  const orders = getAllOrders();
  const normalized = email.trim().toLowerCase();
  return orders.filter(o => o.email.toLowerCase() === normalized || o.customerEmail?.toLowerCase() === normalized);
}

// Settings Storage helpers
export function getSettings(): SiteSettings {
  try {
    const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(data);

    // Compute configured status based on environment variables
    const paystackConfigured = Boolean(process.env.PAYSTACK_SECRET_KEY && process.env.PAYSTACK_SECRET_KEY.trim() !== '');
    const flutterwaveConfigured = Boolean(process.env.FLUTTERWAVE_SECRET_KEY && process.env.FLUTTERWAVE_SECRET_KEY.trim() !== '');

    return {
      ...INITIAL_SETTINGS,
      ...parsed,
      paystackConfigured,
      flutterwaveConfigured
    };
  } catch (err) {
    console.error('Error reading settings:', err);
    return INITIAL_SETTINGS as SiteSettings;
  }
}

export function saveSettings(settings: Partial<SiteSettings>): SiteSettings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

// Real Marketplace Statistics (No fake metrics! Real database counts)
export function getMarketplaceStats(): MarketplaceStats {
  const products = getAllProducts();
  const orders = getAllOrders();

  const allowedOwnership = ['OWNED_BY_GOYE', 'CREATED_FOR_GOYE', 'LICENSED_FOR_RESALE'];
  const activeApproved = products.filter(
    p => allowedOwnership.includes(p.ownership_status) && p.product_status === 'Active'
  );

  const byOwnership = {
    OWNED_BY_GOYE: products.filter(p => p.ownership_status === 'OWNED_BY_GOYE').length,
    CREATED_FOR_GOYE: products.filter(p => p.ownership_status === 'CREATED_FOR_GOYE').length,
    LICENSED_FOR_RESALE: products.filter(p => p.ownership_status === 'LICENSED_FOR_RESALE').length,
    PENDING_RIGHTS_REVIEW: products.filter(p => p.ownership_status === 'PENDING_RIGHTS_REVIEW').length,
    DO_NOT_PUBLISH: products.filter(p => p.ownership_status === 'DO_NOT_PUBLISH').length,
  };

  const paidOrders = orders.filter(o => o.status === 'paid' || o.paymentStatus === 'PAID');

  let grossRevenueNgn = 0;
  let totalDownloads = 0;

  for (const o of paidOrders) {
    grossRevenueNgn += o.amount;
  }

  for (const p of products) {
    totalDownloads += (p.download_count || 0);
  }

  return {
    totalProducts: products.length,
    activeApprovedProducts: activeApproved.length,
    byOwnershipStatus: byOwnership,
    totalOrders: orders.length,
    paidOrders: paidOrders.length,
    totalDownloads,
    grossRevenueNgn
  };
}

// ----------------------------------------------------
// Admin Notifications Management
// ----------------------------------------------------
export function getAllNotifications(): AdminNotification[] {
  try {
    const data = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

export function saveNotifications(notifs: AdminNotification[]): void {
  fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifs, null, 2), 'utf-8');
}

export function addNotification(
  type: NotificationType,
  title: string,
  message: string,
  metadata?: AdminNotification['metadata']
): AdminNotification {
  const notifs = getAllNotifications();
  const newNotif: AdminNotification = {
    id: `notif-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    type,
    title,
    message,
    timestamp: new Date().toISOString(),
    read: false,
    metadata
  };

  notifs.unshift(newNotif);
  // Keep last 100 notifications
  if (notifs.length > 100) notifs.length = 100;
  saveNotifications(notifs);
  return newNotif;
}

export function markNotificationAsRead(id: string): boolean {
  const notifs = getAllNotifications();
  const item = notifs.find(n => n.id === id);
  if (item) {
    item.read = true;
    saveNotifications(notifs);
    return true;
  }
  return false;
}

export function markAllNotificationsRead(): void {
  const notifs = getAllNotifications();
  for (const n of notifs) {
    n.read = true;
  }
  saveNotifications(notifs);
}

export function clearAllNotifications(): void {
  saveNotifications([]);
}

// ----------------------------------------------------
// Email Receipt Generation & Storage
// ----------------------------------------------------
export function getAllReceipts(): EmailReceipt[] {
  try {
    const data = fs.readFileSync(RECEIPTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveReceipts(receipts: EmailReceipt[]): void {
  fs.writeFileSync(RECEIPTS_FILE, JSON.stringify(receipts, null, 2), 'utf-8');
}

export function getReceiptByOrderId(orderId: string): EmailReceipt | null {
  const receipts = getAllReceipts();
  return receipts.find(r => r.order_id === orderId) || null;
}

export function createAndSaveReceipt(order: OrderRecord, product: DigitalProduct): EmailReceipt {
  const receipts = getAllReceipts();
  const existing = receipts.find(r => r.order_id === order.id);
  if (existing) return existing;

  const receiptNumber = `REC-${order.id.replace('ORD-', '')}`;
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const downloadUrl = order.download_url
    ? (order.download_url.startsWith('http') ? order.download_url : `${appUrl}${order.download_url}`)
    : `${appUrl}/download/${order.id}`;

  const newReceipt: EmailReceipt = {
    receipt_number: receiptNumber,
    order_id: order.id,
    issued_at: new Date().toISOString(),
    customer_name: order.customer_name || 'Valued Customer',
    customer_email: order.email,
    product_id: product.product_id,
    product_name: product.product_name,
    category: product.category,
    file_type: product.file_type,
    version: product.version,
    amount: order.amount,
    subtotal: order.amount,
    vat_amount: 0,
    currency: 'NGN',
    payment_method: order.payment_method,
    payment_reference: order.paystack_reference || order.flutterwave_transaction_id || `REF-${order.id}`,
    download_url: downloadUrl,
    download_expires_at: order.download_expires_at || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    license_terms: product.license_terms || 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    refund_policy_ref: product.refund_policy_ref || 'Digital product, no refund after download, defective file replacement within 7 days',
    support_email: 'goyedagosmessenterprise@gmail.com',
    notes: 'VAT 0% Exempt Digital Educational/Business Publication (Nigeria First Schedule VAT Act)'
  };

  receipts.unshift(newReceipt);
  saveReceipts(receipts);

  // Trigger admin notification for order payment & email receipt
  addNotification(
    'ORDER_PAID',
    `Verified Payment: ₦${new Intl.NumberFormat('en-NG').format(order.amount)}`,
    `${product.product_name} purchased by ${order.customer_name || 'Customer'} (${order.email}) via ${order.payment_method}. Receipt #${receiptNumber} generated.`,
    {
      order_id: order.id,
      product_id: product.product_id,
      amount: order.amount,
      customer_email: order.email,
      customer_name: order.customer_name,
      gateway: order.payment_method
    }
  );

  return newReceipt;
}

// Generate printable, standalone HTML email receipt
export function renderEmailReceiptHtml(receipt: EmailReceipt): string {
  const formattedAmount = `₦${new Intl.NumberFormat('en-NG').format(receipt.amount)}`;
  const formattedDate = new Date(receipt.issued_at).toLocaleString('en-NG', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Africa/Lagos'
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Receipt ${receipt.receipt_number} – GOYE Digital Marketplace</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 24px;
      background-color: #0b0e14;
      color: #e2e8f0;
      line-height: 1.5;
    }
    .receipt-container {
      max-width: 680px;
      margin: 0 auto;
      background: #121722;
      border: 1px solid #1e283d;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #121722 0%, #1a2234 100%);
      padding: 32px;
      border-bottom: 2px solid #d4af37;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .brand-subtitle {
      font-size: 11px;
      color: #d4af37;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-top: 4px;
    }
    .badge-paid {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid #10b981;
      color: #10b981;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .content {
      padding: 32px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
      background: #0b0e14;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #1e283d;
    }
    .meta-item label {
      display: block;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
      margin-bottom: 4px;
    }
    .meta-item value {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      font-family: monospace;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
      padding: 12px;
      border-bottom: 1px solid #1e283d;
    }
    td {
      padding: 16px 12px;
      border-bottom: 1px solid #1e283d;
      font-size: 14px;
    }
    .total-row td {
      border-bottom: none;
      font-size: 18px;
      font-weight: 700;
      color: #d4af37;
    }
    .download-box {
      background: rgba(212, 175, 55, 0.08);
      border: 1px solid rgba(212, 175, 55, 0.3);
      padding: 24px;
      border-radius: 12px;
      text-align: center;
      margin-bottom: 32px;
    }
    .download-btn {
      display: inline-block;
      background: #d4af37;
      color: #0b0e14;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      text-decoration: none;
      margin-top: 12px;
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
    }
    .policy-box {
      font-size: 12px;
      color: #94a3b8;
      background: #0b0e14;
      padding: 16px;
      border-radius: 8px;
      border-left: 3px solid #d4af37;
      margin-bottom: 24px;
      line-height: 1.6;
    }
    .footer {
      border-top: 1px solid #1e283d;
      padding: 24px 32px;
      font-size: 12px;
      color: #64748b;
      text-align: center;
      background: #0e131d;
    }
    .actions-bar {
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .action-btn {
      background: #1e283d;
      color: #e2e8f0;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
    }
    @media print {
      body {
        background: #ffffff;
        color: #000000;
        padding: 0;
      }
      .actions-bar, .download-btn {
        display: none !important;
      }
      .receipt-container {
        border: none;
        box-shadow: none;
        max-width: 100%;
        background: #ffffff;
      }
      .header, .footer, .meta-grid, .policy-box {
        background: #f8fafc !important;
        color: #000000 !important;
      }
      .brand-title, .meta-item value {
        color: #000000 !important;
      }
      th, td {
        border-color: #cbd5e1 !important;
        color: #000000 !important;
      }
    }
  </style>
</head>
<body>
  <div class="actions-bar">
    <button class="action-btn" onclick="window.print()">🖨️ Print / Save PDF</button>
  </div>

  <div class="receipt-container">
    <div class="header">
      <div>
        <h1 class="brand-title">GOYE DIGITAL MARKETPLACE</h1>
        <div class="brand-subtitle">Official Commercial Transaction Receipt</div>
      </div>
      <div class="badge-paid">Payment Verified</div>
    </div>

    <div class="content">
      <div class="meta-grid">
        <div class="meta-item">
          <label>Receipt Number</label>
          <value>${receipt.receipt_number}</value>
        </div>
        <div class="meta-item">
          <label>Order Reference</label>
          <value>${receipt.order_id}</value>
        </div>
        <div class="meta-item">
          <label>Date Issued (WAT)</label>
          <value>${formattedDate}</value>
        </div>
        <div class="meta-item">
          <label>Payment Method</label>
          <value>${receipt.payment_method}</value>
        </div>
        <div class="meta-item">
          <label>Customer Name</label>
          <value>${receipt.customer_name}</value>
        </div>
        <div class="meta-item">
          <label>Customer Email</label>
          <value>${receipt.customer_email}</value>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item & Description</th>
            <th>Type</th>
            <th>License</th>
            <th style="text-align: right;">Amount (NGN)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>${receipt.product_name}</strong><br />
              <small style="color: #94a3b8;">ID: ${receipt.product_id} · Version: ${receipt.version} · Category: ${receipt.category}</small>
            </td>
            <td>${receipt.file_type}</td>
            <td>Single Buyer Commercial</td>
            <td style="text-align: right; font-weight: 600;">${formattedAmount}</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: right; color: #94a3b8;">Subtotal:</td>
            <td style="text-align: right; font-weight: 600;">${formattedAmount}</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: right; color: #94a3b8;">Value Added Tax (0% Exempt Publication):</td>
            <td style="text-align: right; font-weight: 600;">₦0.00</td>
          </tr>
          <tr class="total-row">
            <td colspan="3" style="text-align: right;">Total Amount Paid:</td>
            <td style="text-align: right;">${formattedAmount}</td>
          </tr>
        </tbody>
      </table>

      <div class="download-box">
        <div style="font-weight: 700; color: #ffffff; font-size: 16px;">Download Access Link Ready</div>
        <p style="font-size: 13px; color: #94a3b8; margin: 6px 0;">
          Signed digital delivery valid for 24 hours. Your download token is verified against this order.
        </p>
        <a href="${receipt.download_url}" class="download-btn" target="_blank">⬇️ Download Digital Product File</a>
      </div>

      <div class="policy-box">
        <strong>Digital License Terms:</strong> ${receipt.license_terms}<br />
        <strong>Technical Defect Guarantee:</strong> ${receipt.refund_policy_ref}<br />
        <strong>Payment Gateway Reference:</strong> ${receipt.payment_reference}
      </div>
    </div>

    <div class="footer">
      <strong>GOYE Digital Marketplace</strong> · Lagos, Nigeria<br />
      Original Digital Tools for Business, Learning & Growth · NGN Direct Settlement<br />
      Support Email: <a href="mailto:${receipt.support_email}" style="color: #d4af37; text-decoration: none;">${receipt.support_email}</a> · WhatsApp: +234 813 000 0000
    </div>
  </div>
</body>
</html>`;
}

// Protected file path helper
export function getProtectedFilePath(product: DigitalProduct): string | null {
  const cleanName = path.basename(product.file_path_private || `${product.product_id}.docx`);
  const target = path.resolve(PROTECTED_FILES_DIR, cleanName);
  if (fs.existsSync(target)) {
    return target;
  }

  // Fallback: check by product id
  const fallback = path.resolve(PROTECTED_FILES_DIR, `${product.product_id}.docx`);
  if (fs.existsSync(fallback)) return fallback;

  // Auto-generate if missing
  const content = product.content_document_text || `GOYE DIGITAL PRODUCT: ${product.product_name}\nID: ${product.product_id}\n© 2026 GOYE. All Rights Reserved.`;
  fs.writeFileSync(target, content, 'utf-8');
  return target;
}

export function saveProtectedFile(filename: string, content: string | Buffer): string {
  const cleanName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
  const target = path.resolve(PROTECTED_FILES_DIR, cleanName);
  fs.writeFileSync(target, content);
  return cleanName;
}

// Generate secure 24-hour download token
export function generateDownloadToken(): { token: string; expiresAt: string } {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours expiry
  return { token, expiresAt };
}
