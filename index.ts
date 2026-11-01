export type Screen =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'payment-instructions'
  | 'order-confirmation'
  | 'buyer-dashboard'
  | 'buyer-orders'
  | 'buyer-wishlist'
  | 'login'
  | 'owner-login'
  | 'owner-overview'
  | 'owner-products'
  | 'owner-add-product'
  | 'owner-edit-product'
  | 'owner-orders'
  | 'owner-order-detail'
  | 'owner-payments'
  | 'owner-inventory'
  | 'owner-customers'
  | 'owner-email-notifications'
  | 'owner-settings';

export type TripBatch = {
  id: string;
  name: string;
  destination: string;
  districts: string[];
  travelDates: string;
  poDeadline: string;
  flightReturn: string;
  flightCode: string;
  luggageCapacityKg: number;
  luggageAllocatedKg: number;
  isOpen: boolean;
  statusText: string;
};

export type ProductCategory =
  | 'Barang Viral China'
  | 'Pop Mart & Collectibles'
  | 'C-Beauty & Skincare'
  | 'Fashion & Bags China'
  | 'Douyin Tech & Lifestyle'
  | 'China Tea & Snacks'
  | 'Boutique Fashion'
  | 'Luxury & Designer Bags'
  | 'J-Beauty Cult Hits'
  | 'Specialty Snacks & Tea'
  | 'Lifestyle & Collectibles';

export type Product = {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: ProductCategory;
  priceIdr: number;
  originalPriceForeign?: string;
  originalPriceIdr?: number; // for strikethrough discount
  description: string;
  specifications: string[];
  images: string[];
  batchId: string;
  weightKg: number;
  stockSlots: number;
  maxSlots: number;
  isAvailable: boolean;
  status: 'Published' | 'Draft' | 'Archived';
  originStore: string;
  estimatedArrival: string;
  soldCount?: number; // e.g. 1420 for Tokopedia/Shopee style "Terjual 1.4rb"
  rating?: number; // e.g. 4.9
  reviewCount?: number; // e.g. 84
  isFreeShipping?: boolean; // Bebas Ongkir badge
  isViralChina?: boolean; // Fast flag for viral China
  variants?: {
    name: string;
    options: string[];
  }[];
  dimensions?: string;
  minOrder?: number;
  maxOrderPerPerson?: number;
  requiresCooling?: boolean;
  tags?: string[];
};

export type CartItem = {
  productId: string;
  product: Product;
  quantity: number;
  selectedVariant?: string;
};

export type OrderStatus =
  | 'Pending Payment'
  | 'Payment Verification'
  | 'Paid'
  | 'Processing'
  | 'Purchased'
  | 'In Transit'
  | 'Shipped'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled'
  | 'Refunded';

export type PaymentMethod = 'BCA' | 'BNI' | 'CIMB' | 'QRIS';

export type PaymentRecord = {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  method: PaymentMethod;
  amount: number;
  uniqueDigits: number; // e.g., 842 for anti-collision
  totalExpected: number;
  status: 'Pending Review' | 'Verified' | 'Rejected' | 'Expired';
  transactionDate: string;
  proofSlipUrl?: string;
  ocrMatch?: {
    destinationMatch: boolean;
    amountMatch: boolean;
    timestampDeviationMins: number;
    ocrAccountNumber: string;
    ocrRefNumber: string;
  };
  notes?: string;
};

export type Order = {
  id: string; // e.g., JTP-2025-089
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    recipientName: string;
    phone: string;
    street: string;
    district: string;
    city: string;
    province: string;
    postalCode: string;
  };
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  uniqueCode: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Verification' | 'Paid' | 'Failed';
  orderStatus: OrderStatus;
  createdAt: string;
  courier: 'Paxel Cold' | 'JNE YES' | 'GrabExpress Instant' | 'SiCepat BEST' | 'J&T Express' | 'JNE Reguler';
  trackingNumber?: string;
  luggageSlot: 'Carry-On A' | 'Suitcase A' | 'Suitcase B' | 'Dispatched' | 'Koper Hand-Carry Guangzhou A' | 'Koper B';
  totalWeightKg: number;
  sourcingNotes?: string;
  checkpoints: {
    title: string;
    timestamp: string;
    completed: boolean;
    location?: string;
  }[];
};

export type Customer = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isEmailVerified: boolean;
  registeredAt: string;
  tier: 'VIP Concierge' | 'Standard' | 'First-Time';
  totalOrders: number;
  totalSpentIdr: number;
  addresses: {
    id: string;
    label: string;
    isDefault: boolean;
    recipientName: string;
    phone: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
  }[];
  wishlistProductIds: string[];
};

export type OwnerNotificationSettings = {
  notificationEmail: string;
  notifyOnNewOrder: boolean;
  notifyOnPaymentReceived: boolean;
  notifyOnPaymentFailed: boolean;
  notifyOnOrderCancelled: boolean;
  notifyOnRefundProcessed: boolean;
  notifyOnLowStock: boolean;
  lowStockThreshold: number;
  lastTestEmailSent?: string;
};

export type StoreSettings = {
  storeName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  heroHeadline: string;
  heroSubheadline: string;
  bcaAccount: {
    accountNumber: string;
    accountHolder: string;
  };
  bniAccount: {
    accountNumber: string;
    accountHolder: string;
  };
  cimbAccount: {
    accountNumber: string;
    accountHolder: string;
  };
  qrisConfig: {
    merchantName: string;
    nmid: string;
    isActive: boolean;
  };
  shippingRules: {
    freeShippingThreshold: number;
    standardFee: number;
    paxelColdFee: number;
  };
  termsAndConditions: string;
  customsPolicy: string;
};

export type LuggageSuitcaseType = 'Checked 23kg' | 'Checked 32kg' | 'Cabin 7-10kg' | 'Extra Cargo Box';

export interface LuggageItem {
  id: string;
  name: string;
  weightKg: number;
  qty: number;
}

export interface LuggageSuitcase {
  id: string;
  name: string;
  code: string;
  type: LuggageSuitcaseType;
  capacityKg: number;
  currentLoadKg: number;
  assignedCategory: string;
  flightCode: string;
  notes?: string;
  items: LuggageItem[];
}
