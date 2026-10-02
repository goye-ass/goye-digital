export type ProductCategory =
  | 'Business Templates'
  | 'Marketing Templates'
  | 'AI Resources'
  | 'Education Resources'
  | 'Website Resources'
  | 'Productivity Templates'
  | 'Small Business Tools'
  | 'E-books and Guides'
  | 'Social Media Content Packs'
  | 'Professional Documents';

export type OwnershipStatus =
  | 'OWNED_BY_GOYE'
  | 'CREATED_FOR_GOYE'
  | 'LICENSED_FOR_RESALE'
  | 'PENDING_RIGHTS_REVIEW'
  | 'DO_NOT_PUBLISH';

export type ProductStatus = 'Active' | 'Draft' | 'Archived';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type DownloadAccessStatus = 'NOT_AVAILABLE' | 'AVAILABLE' | 'DOWNLOADED';

export type PaymentMethodType = 'PAYSTACK' | 'FLUTTERWAVE' | 'FREE';

export interface ProductPreviewPage {
  pageNumber: number;
  title: string;
  excerpt: string;
}

export interface DigitalProduct {
  // DB schema fields matching prompt Section 6
  product_id: string;
  product_name: string;
  category: ProductCategory;
  short_description: string;
  full_description: string;
  version: string;
  creator: string;
  ownership_status: OwnershipStatus;
  rights_documentation_status: string;
  commercial_use_permission_status: string;
  file_type: string;
  file_size: string;
  price: number; // Integer NGN
  currency: 'NGN';
  product_status: ProductStatus;
  publication_date: string;
  last_updated: string;
  download_count: number;
  sales_count: number;
  file_path_private: string;
  preview_image: string;
  license_terms: string;
  usage_instructions: string;
  refund_policy_ref: string;

  // Rich frontend features
  features: string[];
  intended_audience: string;
  preview_pages?: ProductPreviewPage[];
  content_document_text?: string;

  // Compatibility aliases
  id?: string;
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  ownershipStatus?: OwnershipStatus;
  status?: string;
  fileType?: string;
  fileSize?: string;
  coverImage?: string;
  isFree?: boolean;
}

export interface DownloadLog {
  downloadedAt: string;
  ip?: string;
  userAgent?: string;
}

export interface OrderRecord {
  id: string; // uuid
  product_id: string;
  product_name: string;
  email: string;
  customer_name?: string;
  amount: number; // Integer NGN
  currency: 'NGN';
  payment_method: PaymentMethodType;
  paystack_reference?: string;
  flutterwave_transaction_id?: string;
  status: OrderStatus;
  download_url?: string;
  download_token?: string;
  download_expires_at?: string;
  created_at: string;
  download_history?: DownloadLog[];

  // Compatibility aliases
  productId?: string;
  productTitle?: string;
  customerEmail?: string;
  customerName?: string;
  paymentStatus?: string;
  orderStatus?: string;
  createdDate?: string;
  downloadStatus?: DownloadAccessStatus;
  downloadToken?: string;
  downloadExpiresAt?: string;
  downloadHistory?: DownloadLog[];
}

export interface SiteSettings {
  contactWhatsApp: string;
  contactEmail: string;
  contactPhone: string;
  supportHours: string;
  refundPolicy: string;
  termsOfService: string;
  privacyPolicy: string;
  licenseTermsSummary: string;
  paystackEnabled: boolean;
  flutterwaveEnabled: boolean;
  paystackConfigured: boolean;
  flutterwaveConfigured: boolean;
}

export interface MarketplaceStats {
  totalProducts: number;
  activeApprovedProducts: number;
  byOwnershipStatus: {
    OWNED_BY_GOYE: number;
    CREATED_FOR_GOYE: number;
    LICENSED_FOR_RESALE: number;
    PENDING_RIGHTS_REVIEW: number;
    DO_NOT_PUBLISH: number;
  };
  totalOrders: number;
  paidOrders: number;
  totalDownloads: number;
  grossRevenueNgn: number;
}

// ----------------------------------------------------
// Admin Notifications System
// ----------------------------------------------------
export type NotificationType =
  | 'ORDER_PAID'
  | 'NEW_ORDER'
  | 'SUPPORT_TICKET'
  | 'DOWNLOAD_ACCESSED'
  | 'PRODUCT_CREATED'
  | 'RIGHTS_ALERT';

export interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  metadata?: {
    order_id?: string;
    product_id?: string;
    amount?: number;
    customer_email?: string;
    customer_name?: string;
    gateway?: string;
    ticket_subject?: string;
  };
}

// ----------------------------------------------------
// Email Receipt System
// ----------------------------------------------------
export interface EmailReceipt {
  receipt_number: string;
  order_id: string;
  issued_at: string;
  customer_name: string;
  customer_email: string;
  product_id: string;
  product_name: string;
  category: ProductCategory;
  file_type: string;
  version: string;
  amount: number;
  subtotal?: number;
  vat_amount?: number;
  currency: 'NGN';
  payment_method: PaymentMethodType;
  payment_reference: string;
  download_url: string;
  download_expires_at: string;
  license_terms: string;
  refund_policy_ref: string;
  support_email: string;
  notes?: string;
}
