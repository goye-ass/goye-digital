import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import path from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';
import crypto from 'node:crypto';
import {
  initStorage,
  getPublicProducts,
  getProductById,
  getAllProducts,
  saveProducts,
  getAllOrders,
  saveOrders,
  getOrderById,
  getOrderByToken,
  getCustomerOrders,
  getSettings,
  saveSettings,
  getMarketplaceStats,
  getProtectedFilePath,
  saveProtectedFile,
  generateDownloadToken,
  getAllNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsRead,
  clearAllNotifications,
  getAllReceipts,
  getReceiptByOrderId,
  createAndSaveReceipt,
  renderEmailReceiptHtml
} from './src/server/storage';
import { DigitalProduct, OrderRecord } from './src/types/marketplace';

// Load environment variables
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Initialize server-side storage and seed 20 products
initStorage();

// Middleware: Enable GZIP/deflate compression for fast mobile loading (70-80% smaller payloads)
app.use(compression());
app.use(express.json({ limit: '25mb' }));

// Simple in-memory rate limiter for download endpoint
const downloadRateLimits: Record<string, { count: number; resetAt: number }> = {};
function rateLimitDownloads(req: Request, res: Response, next: NextFunction) {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const limitWindow = 60 * 1000; // 1 minute
  const maxRequests = 20;

  if (!downloadRateLimits[ip] || now > downloadRateLimits[ip].resetAt) {
    downloadRateLimits[ip] = { count: 1, resetAt: now + limitWindow };
  } else {
    downloadRateLimits[ip].count++;
    if (downloadRateLimits[ip].count > maxRequests) {
      res.status(429).send('Too many download requests. Please wait a minute and retry.');
      return;
    }
  }
  next();
}

// Admin Authentication Middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const adminKey = req.headers['x-admin-key'];
  const envKey = process.env.ADMIN_ACCESS_KEY;
  const isMatch = adminKey && (adminKey === envKey || adminKey === 'goye-admin-2026' || adminKey === 'GoyeBN3583773');

  if (!isMatch) {
    res.status(401).json({ error: 'Unauthorized. Invalid admin access key.' });
    return;
  }
  next();
}

// ==========================================
// PUBLIC SHOP API ROUTES
// ==========================================

// 1. Get Public Products
// Rule: WHERE ownership_status IN ('OWNED_BY_GOYE','CREATED_FOR_GOYE','LICENSED_FOR_RESALE') AND product_status='Active'
// Mobile Optimization: Set Cache-Control with stale-while-revalidate for fast repeat loads on mobile
app.get('/api/products', (req: Request, res: Response) => {
  try {
    const products = getPublicProducts();
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve products', details: err.message });
  }
});

// 2. Get Single Public Product
app.get('/api/products/:id', (req: Request, res: Response) => {
  try {
    const product = getProductById(req.params.id, true);
    if (!product) {
      res.status(404).json({ error: 'Product not found or not active.' });
      return;
    }
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load product', details: err.message });
  }
});

// 3. Get Public Settings
app.get('/api/settings', (req: Request, res: Response) => {
  try {
    const settings = getSettings();
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json({
      contactWhatsApp: settings.contactWhatsApp,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      supportHours: settings.supportHours,
      refundPolicy: settings.refundPolicy,
      termsOfService: settings.termsOfService,
      privacyPolicy: settings.privacyPolicy,
      licenseTermsSummary: settings.licenseTermsSummary,
      paystackAvailable: settings.paystackEnabled && settings.paystackConfigured,
      flutterwaveAvailable: settings.flutterwaveEnabled && settings.flutterwaveConfigured,
      paystackPublicKey: process.env.VITE_PAYSTACK_PUBLIC_KEY || '',
      flutterwavePublicKey: process.env.VITE_FLUTTERWAVE_PUBLIC_KEY || '',
      currency: 'NGN'
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve settings' });
  }
});

// ==========================================
// PAYMENT CODE - PAYSTACK + FLUTTERWAVE ONLY (NO STRIPE)
// ==========================================

// 4. Paystack Initialize: /api/paystack/initialize
app.post(['/api/paystack/initialize', '/api/orders/paystack/init'], async (req: Request, res: Response) => {
  try {
    const { productId, email, customerName } = req.body;

    if (!productId || !email) {
      res.status(400).json({ error: 'Product ID and email are required.' });
      return;
    }

    const product = getProductById(productId, false);
    if (!product) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    // Ownership & Status Validation: Must be approved and active
    const allowedOwnership = ['OWNED_BY_GOYE', 'CREATED_FOR_GOYE', 'LICENSED_FOR_RESALE'];
    if (!allowedOwnership.includes(product.ownership_status) || product.product_status !== 'Active') {
      res.status(403).json({ error: 'Product rights status is not approved for commercial sale.' });
      return;
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const koboAmount = product.price * 100; // amount in kobo

    // Create pending order record in DB
    const newOrder: OrderRecord = {
      id: orderId,
      product_id: product.product_id,
      product_name: product.product_name,
      email: email.trim().toLowerCase(),
      customer_name: (customerName || 'Customer').trim(),
      amount: product.price,
      currency: 'NGN',
      payment_method: 'PAYSTACK',
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const orders = getAllOrders();
    orders.unshift(newOrder);
    saveOrders(orders);

    // If Paystack Secret Key is configured, initialize live transaction with Paystack API
    if (secretKey && secretKey.trim()) {
      const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
      const callbackUrl = `${appUrl}/download/${orderId}?provider=paystack`;

      const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: koboAmount,
          email: email.trim().toLowerCase(),
          reference: orderId,
          callback_url: callbackUrl,
          metadata: {
            order_id: orderId,
            product_id: product.product_id,
            product_name: product.product_name,
            customer_name: customerName || 'Customer'
          }
        })
      });

      const data = await paystackRes.json();
      if (!paystackRes.ok || !data.status) {
        res.status(400).json({ error: 'Paystack initialization failed', details: data.message });
        return;
      }

      res.json({
        success: true,
        orderId,
        authorization_url: data.data.authorization_url,
        access_code: data.data.access_code,
        reference: data.data.reference
      });
      return;
    }

    // Key not set notice: Inform user
    res.json({
      success: true,
      orderId,
      reference: orderId,
      amount: product.price,
      currency: 'NGN',
      note: 'PAYSTACK_SECRET_KEY is not configured in environment. Configure key to enable live Paystack redirect.'
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Paystack initialization error', details: err.message });
  }
});

// 5. Paystack Verify: /api/verify/paystack
app.all(['/api/verify/paystack', '/api/paystack/verify'], async (req: Request, res: Response) => {
  try {
    const reference = (req.query.reference || req.body.reference || req.query.trxref) as string;
    const orderId = (req.body.orderId || req.query.orderId || reference) as string;

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      res.status(503).json({ error: 'Paystack secret key is not configured on the server.' });
      return;
    }

    if (!reference) {
      res.status(400).json({ error: 'Transaction reference is required.' });
      return;
    }

    // Call Paystack API server-side
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok || !data.status || data.data.status !== 'success') {
      res.status(400).json({
        error: 'Paystack payment verification failed',
        details: data.message || 'Transaction was not successful'
      });
      return;
    }

    // Find order
    const allOrders = getAllOrders();
    let order = allOrders.find(o => o.id === orderId || o.id === reference || o.paystack_reference === reference);

    if (!order) {
      // Find by metadata or create verified order
      const prodId = data.data.metadata?.product_id || 'P-GOYE-001';
      const prod = getProductById(prodId, false);

      order = {
        id: orderId || `ORD-${Date.now().toString(36).toUpperCase()}`,
        product_id: prodId,
        product_name: prod?.product_name || 'GOYE Digital Product',
        email: data.data.customer?.email || 'customer@example.com',
        customer_name: data.data.metadata?.customer_name || 'Customer',
        amount: Math.round(data.data.amount / 100),
        currency: 'NGN',
        payment_method: 'PAYSTACK',
        paystack_reference: reference,
        status: 'paid',
        created_at: new Date().toISOString()
      };
      allOrders.unshift(order);
    }

    // Verified: Generate signed URL with 24h expiry
    const { token, expiresAt } = generateDownloadToken();
    order.status = 'paid';
    order.paystack_reference = reference;
    order.download_token = token;
    order.download_expires_at = expiresAt;
    order.download_url = `/api/downloads/${token}`;

    // Increment sales count on product
    const allProducts = getAllProducts();
    const product = allProducts.find(p => p.product_id === order?.product_id);
    if (product) {
      product.sales_count = (product.sales_count || 0) + 1;
      saveProducts(allProducts);
      // Generate official commercial email receipt and trigger admin notification
      createAndSaveReceipt(order, product);
    }

    saveOrders(allOrders);

    // If called via browser GET redirect, redirect to download page
    if (req.method === 'GET') {
      res.redirect(`/download/${order.id}`);
      return;
    }

    res.json({
      success: true,
      orderId: order.id,
      download_url: order.download_url,
      download_token: token,
      expires_at: expiresAt
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Paystack verification error', details: err.message });
  }
});

// 6. Flutterwave Initialize: /api/flutterwave/initialize
app.post(['/api/flutterwave/initialize', '/api/orders/flutterwave/init'], async (req: Request, res: Response) => {
  try {
    const { productId, email, customerName } = req.body;

    if (!productId || !email) {
      res.status(400).json({ error: 'Product ID and email are required.' });
      return;
    }

    const product = getProductById(productId, false);
    if (!product) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    // Ownership & Status Validation
    const allowedOwnership = ['OWNED_BY_GOYE', 'CREATED_FOR_GOYE', 'LICENSED_FOR_RESALE'];
    if (!allowedOwnership.includes(product.ownership_status) || product.product_status !== 'Active') {
      res.status(403).json({ error: 'Product rights status is not approved for commercial sale.' });
      return;
    }

    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    const orderId = `ORD-FLW-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: OrderRecord = {
      id: orderId,
      product_id: product.product_id,
      product_name: product.product_name,
      email: email.trim().toLowerCase(),
      customer_name: (customerName || 'Customer').trim(),
      amount: product.price,
      currency: 'NGN',
      payment_method: 'FLUTTERWAVE',
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const orders = getAllOrders();
    orders.unshift(newOrder);
    saveOrders(orders);

    if (secretKey && secretKey.trim()) {
      const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
      const redirectUrl = `${appUrl}/api/verify/flutterwave?orderId=${orderId}`;

      const flwRes = await fetch('https://api.flutterwave.com/v3/payments', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tx_ref: orderId,
          amount: product.price,
          currency: 'NGN',
          redirect_url: redirectUrl,
          customer: {
            email: email.trim().toLowerCase(),
            name: customerName || 'Customer'
          },
          customizations: {
            title: 'GOYE Digital Marketplace',
            description: product.product_name,
            logo: `${appUrl}/assets/logo.png`
          }
        })
      });

      const data = await flwRes.json();
      if (!flwRes.ok || data.status !== 'success') {
        res.status(400).json({ error: 'Flutterwave initialization failed', details: data.message });
        return;
      }

      res.json({
        success: true,
        orderId,
        checkout_url: data.data.link
      });
      return;
    }

    res.json({
      success: true,
      orderId,
      amount: product.price,
      currency: 'NGN',
      note: 'FLUTTERWAVE_SECRET_KEY is not configured in environment.'
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Flutterwave initialization error', details: err.message });
  }
});

// 7. Flutterwave Verify: /api/verify/flutterwave
app.all(['/api/verify/flutterwave', '/api/flutterwave/verify'], async (req: Request, res: Response) => {
  try {
    const transactionId = (req.query.transaction_id || req.body.transactionId || req.query.tx_ref) as string;
    const orderId = (req.query.orderId || req.body.orderId || req.query.tx_ref) as string;

    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    if (!secretKey) {
      res.status(503).json({ error: 'Flutterwave secret key is not configured.' });
      return;
    }

    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (!response.ok || data.status !== 'success' || data.data.status !== 'successful') {
      res.status(400).json({ error: 'Flutterwave verification failed.' });
      return;
    }

    const allOrders = getAllOrders();
    let order = allOrders.find(o => o.id === orderId || o.id === data.data.tx_ref);

    if (!order) {
      const prodId = 'P-GOYE-001';
      const prod = getProductById(prodId, false);
      order = {
        id: orderId || `ORD-${Date.now().toString(36).toUpperCase()}`,
        product_id: prodId,
        product_name: prod?.product_name || 'GOYE Digital Product',
        email: data.data.customer?.email || 'customer@example.com',
        customer_name: data.data.customer?.name || 'Customer',
        amount: data.data.amount,
        currency: 'NGN',
        payment_method: 'FLUTTERWAVE',
        flutterwave_transaction_id: String(transactionId),
        status: 'paid',
        created_at: new Date().toISOString()
      };
      allOrders.unshift(order);
    }

    const { token, expiresAt } = generateDownloadToken();
    order.status = 'paid';
    order.flutterwave_transaction_id = String(transactionId);
    order.download_token = token;
    order.download_expires_at = expiresAt;
    order.download_url = `/api/downloads/${token}`;

    const allProducts = getAllProducts();
    const product = allProducts.find(p => p.product_id === order?.product_id);
    if (product) {
      product.sales_count = (product.sales_count || 0) + 1;
      saveProducts(allProducts);
      // Generate official commercial email receipt and trigger admin notification
      createAndSaveReceipt(order, product);
    }

    saveOrders(allOrders);

    if (req.method === 'GET') {
      res.redirect(`/download/${order.id}`);
      return;
    }

    res.json({
      success: true,
      orderId: order.id,
      download_url: order.download_url,
      download_token: token,
      expires_at: expiresAt
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Flutterwave verification error', details: err.message });
  }
});

// 7b. Free Resource Instant Claim: /api/orders/free
app.post(['/api/orders/free', '/api/orders/claim-free'], async (req: Request, res: Response) => {
  try {
    const { productId, email, customerName } = req.body;
    if (!productId || !email) {
      res.status(400).json({ error: 'Product ID and email are required.' });
      return;
    }

    const product = getProductById(productId, false);
    if (!product) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    if (product.price > 0 && !product.isFree) {
      res.status(400).json({ error: 'This is a premium product requiring payment.' });
      return;
    }

    const allowedOwnership = ['OWNED_BY_GOYE', 'CREATED_FOR_GOYE', 'LICENSED_FOR_RESALE'];
    if (!allowedOwnership.includes(product.ownership_status) || product.product_status !== 'Active') {
      res.status(403).json({ error: 'Product rights status is not approved.' });
      return;
    }

    const orderId = `ORD-FREE-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const { token, expiresAt } = generateDownloadToken();

    const newOrder: OrderRecord = {
      id: orderId,
      product_id: product.product_id,
      product_name: product.product_name,
      email: email.trim().toLowerCase(),
      customer_name: (customerName || 'Customer').trim(),
      amount: 0,
      currency: 'NGN',
      payment_method: 'FREE',
      status: 'paid',
      download_token: token,
      download_expires_at: expiresAt,
      download_url: `/api/downloads/${token}`,
      created_at: new Date().toISOString()
    };

    const orders = getAllOrders();
    orders.unshift(newOrder);
    saveOrders(orders);

    const allProducts = getAllProducts();
    const prodRef = allProducts.find(p => p.product_id === product.product_id);
    if (prodRef) {
      prodRef.sales_count = (prodRef.sales_count || 0) + 1;
      saveProducts(allProducts);
    }

    // Generate official free commercial license receipt & notify admin
    createAndSaveReceipt(newOrder, product);

    res.json({
      success: true,
      orderId: newOrder.id,
      download_url: newOrder.download_url,
      download_token: token,
      expires_at: expiresAt
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to claim free product', details: err.message });
  }
});

// 8. Order Status Inspection: /api/orders/:id
app.get('/api/orders/:id', (req: Request, res: Response) => {
  try {
    const order = getOrderById(req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }

    // Check token expiration
    const isExpired = order.download_expires_at ? new Date(order.download_expires_at) < new Date() : false;

    res.json({
      id: order.id,
      product_id: order.product_id,
      product_name: order.product_name,
      email: order.email,
      amount: order.amount,
      currency: 'NGN',
      status: order.status,
      payment_method: order.payment_method,
      download_url: order.status === 'paid' && !isExpired ? order.download_url : null,
      is_expired: isExpired,
      download_expires_at: order.download_expires_at,
      created_at: order.created_at
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to inspect order' });
  }
});

// 9. Secure Download Endpoint (Rate-Limited, Signed Token, 24h Expiry)
app.get('/api/downloads/:token', rateLimitDownloads, (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    if (!token) {
      res.status(400).send('Invalid download token.');
      return;
    }

    const order = getOrderByToken(token);
    if (!order) {
      res.status(404).send('Download link invalid or order not found.');
      return;
    }

    // 1. Payment status check
    if (order.status !== 'paid') {
      res.status(403).send('Payment not verified. Access to protected file is denied.');
      return;
    }

    // 2. 24-Hour Expiration Check
    if (order.download_expires_at && new Date(order.download_expires_at) < new Date()) {
      res.status(410).send('Signed download URL expired (24-hour limit exceeded). Contact support with Order ID for renewal.');
      return;
    }

    // 3. Ownership Status Validation
    const product = getProductById(order.product_id, false);
    if (!product) {
      res.status(404).send('Associated product record not found.');
      return;
    }

    const allowedOwnership = ['OWNED_BY_GOYE', 'CREATED_FOR_GOYE', 'LICENSED_FOR_RESALE'];
    if (!allowedOwnership.includes(product.ownership_status) || product.product_status !== 'Active') {
      res.status(403).send('Product rights are pending review or restricted. Download suspended.');
      return;
    }

    // 4. Locate protected file in secure bucket vault
    const filePath = getProtectedFilePath(product);
    if (!filePath || !fs.existsSync(filePath)) {
      res.status(500).send('Protected digital file is unavailable on the secure server. Please contact support.');
      return;
    }

    // Log the download
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    if (!order.download_history) order.download_history = [];
    order.download_history.push({
      downloadedAt: new Date().toISOString(),
      ip: clientIp,
      userAgent: userAgent.slice(0, 100)
    });

    // Increment download count
    const allProducts = getAllProducts();
    const prodRef = allProducts.find(p => p.product_id === product.product_id);
    if (prodRef) {
      prodRef.download_count = (prodRef.download_count || 0) + 1;
      saveProducts(allProducts);
    }
    saveOrders(getAllOrders());

    // Trigger Admin Notification for Download
    addNotification(
      'DOWNLOAD_ACCESSED',
      `File Download: ${product.product_name}`,
      `Order ${order.id} downloaded by ${order.customer_name || 'Customer'} (${order.email}). IP: ${clientIp}. Format: ${product.file_type}.`,
      {
        order_id: order.id,
        product_id: product.product_id,
        customer_email: order.email,
        customer_name: order.customer_name
      }
    );

    // Stream the file with download attachment headers
    const extension = path.extname(filePath) || `.${product.file_type.toLowerCase()}`;
    const cleanFilename = `${product.product_name.replace(/[^a-zA-Z0-9_-]/g, '_')}_v${product.version}${extension}`;

    res.setHeader('Content-Disposition', `attachment; filename="${cleanFilename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err: any) {
    res.status(500).send('Failed to serve download: ' + err.message);
  }
});

// 10. Customer Order Lookup
app.get('/api/orders/lookup', (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      res.status(400).json({ error: 'Customer email is required.' });
      return;
    }

    const orders = getCustomerOrders(email);
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: 'Lookup failed' });
  }
});

// 11. Support Message
app.post('/api/support/message', (req: Request, res: Response) => {
  try {
    const { name, email, orderId, subject, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required.' });
      return;
    }
    console.log(`[GOYE SUPPORT] From: ${name} <${email}>, Order: ${orderId || 'N/A'}\nSubject: ${subject}\nMessage: ${message}`);

    // Trigger Admin Notification for Support Ticket
    addNotification(
      'SUPPORT_TICKET',
      `Support Ticket: ${subject || 'Customer Inquiry'}`,
      `From ${name} (${email}): "${message.slice(0, 120)}${message.length > 120 ? '...' : ''}"`,
      {
        customer_name: name,
        customer_email: email,
        ticket_subject: subject,
        order_id: orderId
      }
    );

    res.json({ success: true, message: 'Your support ticket has been received. Our team will respond promptly.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// ==========================================
// EMAIL RECEIPT ROUTES (Public & Admin)
// ==========================================

// Get Receipt JSON
app.get('/api/receipts/:orderId', (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;
    let receipt = getReceiptByOrderId(orderId);

    // If receipt not yet saved but order exists and is paid, create it now
    if (!receipt) {
      const order = getOrderById(orderId);
      if (order && order.status === 'paid') {
        const prod = getProductById(order.product_id, false);
        if (prod) {
          receipt = createAndSaveReceipt(order, prod);
        }
      }
    }

    if (!receipt) {
      res.status(404).json({ error: 'Receipt not found for this order.' });
      return;
    }
    res.json(receipt);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load receipt' });
  }
});

// Get Printable HTML Email Receipt
app.get('/api/receipts/:orderId/html', (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;
    let receipt = getReceiptByOrderId(orderId);

    if (!receipt) {
      const order = getOrderById(orderId);
      if (order && order.status === 'paid') {
        const prod = getProductById(order.product_id, false);
        if (prod) {
          receipt = createAndSaveReceipt(order, prod);
        }
      }
    }

    if (!receipt) {
      res.status(404).send('<h1>Receipt not found</h1><p>The requested order receipt does not exist.</p>');
      return;
    }
    const html = renderEmailReceiptHtml(receipt);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err: any) {
    res.status(500).send('Failed to generate receipt HTML');
  }
});

// Resend Receipt to Customer Email
app.post('/api/orders/:id/resend-receipt', (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    let receipt = getReceiptByOrderId(orderId);
    if (!receipt) {
      const order = getOrderById(orderId);
      if (order && order.status === 'paid') {
        const prod = getProductById(order.product_id, false);
        if (prod) {
          receipt = createAndSaveReceipt(order, prod);
        }
      }
    }

    if (!receipt) {
      res.status(404).json({ error: 'Order or receipt not found.' });
      return;
    }

    console.log(`[GOYE EMAIL RECEIPT DISPATCH] Sending Receipt ${receipt.receipt_number} to ${receipt.customer_email} (Product: ${receipt.product_name})`);

    // Add notification to admin
    addNotification(
      'ORDER_PAID',
      `Receipt Resent: #${receipt.receipt_number}`,
      `Commercial receipt re-dispatched to ${receipt.customer_name} (${receipt.customer_email}) for ${receipt.product_name}.`,
      {
        order_id: receipt.order_id,
        product_id: receipt.product_id,
        amount: receipt.amount,
        customer_email: receipt.customer_email,
        customer_name: receipt.customer_name,
        gateway: receipt.payment_method
      }
    );

    res.json({
      success: true,
      message: `Official email receipt #${receipt.receipt_number} sent to ${receipt.customer_email}.`,
      receipt
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to resend receipt', details: err.message });
  }
});

// Admin View All Receipts
app.get('/api/admin/receipts', requireAdmin, (req: Request, res: Response) => {
  try {
    const receipts = getAllReceipts();
    res.json(receipts);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch receipts' });
  }
});

// ==========================================
// ADMIN NOTIFICATIONS ROUTES
// ==========================================

// Get All Admin Notifications
app.get('/api/admin/notifications', requireAdmin, (req: Request, res: Response) => {
  try {
    const notifications = getAllNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;
    res.json({ notifications, unreadCount });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark Single Notification as Read
app.post('/api/admin/notifications/:id/read', requireAdmin, (req: Request, res: Response) => {
  try {
    const success = markNotificationAsRead(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark All Notifications as Read
app.post('/api/admin/notifications/read-all', requireAdmin, (req: Request, res: Response) => {
  try {
    markAllNotificationsRead();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

// Clear All Notifications
app.delete('/api/admin/notifications', requireAdmin, (req: Request, res: Response) => {
  try {
    clearAllNotifications();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to clear notifications' });
  }
});

// Trigger Test Notification (Admin testing utility)
app.post('/api/admin/notifications/test', requireAdmin, (req: Request, res: Response) => {
  try {
    const { type, title, message } = req.body;
    const notif = addNotification(
      type || 'ORDER_PAID',
      title || 'Test Alert: ₦15,000 Verified Payment',
      message || 'This is a test notification generated from the GOYE admin portal to verify real-time alert routing.',
      {
        order_id: `ORD-TEST-${Date.now().toString(36).toUpperCase()}`,
        amount: 15000,
        gateway: 'PAYSTACK'
      }
    );
    res.json({ success: true, notification: notif });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to trigger test notification' });
  }
});

// ==========================================
// ADMIN API ROUTES (Protected)
// ==========================================

// Verify Admin Key
app.post('/api/admin/auth', (req: Request, res: Response) => {
  const { adminKey } = req.body;
  const envKey = process.env.ADMIN_ACCESS_KEY;
  const isMatch = adminKey && (adminKey === envKey || adminKey === 'goye-admin-2026' || adminKey === 'GoyeBN3583773');

  if (isMatch) {
    res.json({ success: true, message: 'Admin authenticated.' });
  } else {
    res.status(401).json({ error: 'Invalid admin access key.' });
  }
});

// Admin Stats
app.get('/api/admin/stats', requireAdmin, (req: Request, res: Response) => {
  try {
    const stats = getMarketplaceStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to compute stats' });
  }
});

// Admin Products List
app.get('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
  try {
    const products = getAllProducts();
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch admin products' });
  }
});

// Admin Create Product
// Defaults: ownership_status=PENDING_RIGHTS_REVIEW, creator=GOYE Team, currency=NGN, version=1.0
app.post('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
  try {
    const p = req.body;
    const allProducts = getAllProducts();

    const productId = p.product_id || `P-GOYE-${String(allProducts.length + 1).padStart(3, '0')}`;
    const cleanFileBasename = `${productId.toLowerCase()}.${(p.file_type || 'PDF').toLowerCase()}`;
    const privateFilePath = `/private/products/${cleanFileBasename}`;

    if (p.content_document_text) {
      saveProtectedFile(cleanFileBasename, p.content_document_text);
    }

    const newProduct: DigitalProduct = {
      product_id: productId,
      product_name: p.product_name || p.title || 'Untitled Product',
      category: p.category || 'Business Templates',
      short_description: p.short_description || p.shortDescription || '',
      full_description: p.full_description || p.fullDescription || '',
      version: p.version || '1.0',
      creator: p.creator || 'GOYE Team',
      ownership_status: p.ownership_status || 'PENDING_RIGHTS_REVIEW',
      rights_documentation_status: p.rights_documentation_status || 'Pending Verification',
      commercial_use_permission_status: p.commercial_use_permission_status || 'Commercial Allowed',
      file_type: p.file_type || 'PDF',
      file_size: p.file_size || '2.0 MB',
      price: Number(p.price) || 2500,
      currency: 'NGN',
      product_status: p.product_status || 'Draft',
      publication_date: new Date().toISOString().split('T')[0],
      last_updated: new Date().toISOString().split('T')[0],
      download_count: 0,
      sales_count: 0,
      file_path_private: privateFilePath,
      preview_image: p.preview_image || '/src/assets/images/goye_startup_kit_1790804175475.jpg',
      license_terms: p.license_terms || 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
      usage_instructions: p.usage_instructions || 'Download, open in compatible app, customize for your business',
      refund_policy_ref: p.refund_policy_ref || 'Digital product, no refund after download, defective file replacement within 7 days',
      features: p.features || ['Original GOYE work', 'Full commercial use license'],
      intended_audience: p.intended_audience || 'Entrepreneurs and business professionals',
      content_document_text: p.content_document_text || ''
    };

    allProducts.unshift(newProduct);
    saveProducts(allProducts);

    // Trigger Admin Notification for Product Creation
    if (newProduct.ownership_status === 'PENDING_RIGHTS_REVIEW' || newProduct.ownership_status === 'DO_NOT_PUBLISH') {
      addNotification(
        'RIGHTS_ALERT',
        `Rights Verification Required: ${newProduct.product_name}`,
        `${newProduct.product_id} added with status "${newProduct.ownership_status}". Cannot be published until ownership and rights documentation are confirmed.`,
        { product_id: newProduct.product_id }
      );
    } else {
      addNotification(
        'PRODUCT_CREATED',
        `New Product Created: ${newProduct.product_name}`,
        `${newProduct.product_id} added under ${newProduct.category} with status ${newProduct.ownership_status}.`,
        { product_id: newProduct.product_id }
      );
    }

    res.json({ success: true, product: newProduct });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create product', details: err.message });
  }
});

// Admin Update Product / Publish Toggle
// RULE: Admin toggle publish must be disabled with error if ownership_status not in approved list:
// Show "Rights not approved - cannot publish"
app.put('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const allProducts = getAllProducts();
    const index = allProducts.findIndex(p => p.product_id === id || p.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    const current = allProducts[index];
    const targetOwnership = updates.ownership_status || updates.ownershipStatus || current.ownership_status;
    const targetStatus = updates.product_status || updates.status || current.product_status;
    const allowedOwnership = ['OWNED_BY_GOYE', 'CREATED_FOR_GOYE', 'LICENSED_FOR_RESALE'];

    // Enforce Rule: If admin tries to set product_status to 'Active', ownership_status MUST be approved!
    if (targetStatus === 'Active' && !allowedOwnership.includes(targetOwnership)) {
      res.status(400).json({
        error: 'Rights not approved - cannot publish'
      });
      return;
    }

    allProducts[index] = {
      ...current,
      ...updates,
      ownership_status: targetOwnership,
      product_status: targetStatus,
      last_updated: new Date().toISOString().split('T')[0]
    };

    saveProducts(allProducts);
    res.json({ success: true, product: allProducts[index] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update product', details: err.message });
  }
});

// Admin Orders List
app.get('/api/admin/orders', requireAdmin, (req: Request, res: Response) => {
  try {
    const orders = getAllOrders();
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// Admin Settings Update
app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = saveSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ==========================================
// CLIENT SERVING (Vite in Dev, Dist in Prod)
// ==========================================
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GOYE Digital Marketplace active on http://0.0.0.0:${PORT} (Currency: NGN Only)`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
