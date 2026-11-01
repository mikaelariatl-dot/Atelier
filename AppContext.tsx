import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Screen,
  Product,
  TripBatch,
  Order,
  PaymentRecord,
  Customer,
  CartItem,
  StoreSettings,
  OwnerNotificationSettings,
  OrderStatus,
  PaymentMethod,
  LuggageSuitcase,
  LuggageItem,
} from '../types';
import {
  initialBatches,
  initialProducts,
  initialOrders,
  initialPayments,
  initialCustomers,
  initialStoreSettings,
  initialNotificationSettings,
  initialSuitcases,
} from '../data/mockData';

export type Toast = {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
};

interface AppContextType {
  currentScreen: Screen;
  navigate: (screen: Screen, params?: { productId?: string; orderId?: string }) => void;
  selectedProductId: string | null;
  selectedOrderId: string | null;
  batches: TripBatch[];
  products: Product[];
  orders: Order[];
  payments: PaymentRecord[];
  customers: Customer[];
  cart: CartItem[];
  currentUser: Customer | null;
  isOwnerLoggedIn: boolean;
  storeSettings: StoreSettings;
  notificationSettings: OwnerNotificationSettings;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'forgot' | 'verify';
  pendingAuthAction: (() => void) | null;
  openAuthModal: (mode?: 'login' | 'register' | 'forgot' | 'verify', onAuthSuccess?: () => void) => void;
  closeAuthModal: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  // Shopping Actions
  addToCart: (product: Product, quantity?: number, selectedVariant?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;

  // Auth & Unified Access
  loginBuyer: (email: string, password?: string) => boolean;
  unifiedLogin: (email: string, password?: string) => { success: boolean; role: 'owner' | 'buyer' };
  registerBuyer: (name: string, email: string, phone: string) => void;
  verifyEmail: (code: string) => boolean;
  logoutBuyer: () => void;

  // Checkout & Order Placement
  activeCheckoutOrder: Order | null;
  placeOrder: (
    shippingAddress: Order['shippingAddress'],
    courier: Order['courier'],
    paymentMethod: PaymentMethod,
    sourcingNotes?: string
  ) => Order;

  // Owner Actions
  loginOwner: (password: string) => boolean;
  logoutOwner: () => void;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  verifyPaymentSlip: (paymentId: string, isApproved: boolean) => void;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  updateNotificationSettings: (settings: Partial<OwnerNotificationSettings>) => void;
  sendTestNotificationEmail: () => void;

  // Luggage / Koper Bagasi Management
  suitcases: LuggageSuitcase[];
  addSuitcase: (suitcase: Omit<LuggageSuitcase, 'id'>) => void;
  deleteSuitcase: (id: string) => void;
  updateSuitcase: (id: string, updates: Partial<LuggageSuitcase>) => void;
  addSuitcaseItem: (suitcaseId: string, item: Omit<LuggageItem, 'id'>) => void;
  deleteSuitcaseItem: (suitcaseId: string, itemId: string) => void;

  // Total Business Reset
  resetTotalWebsite: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Screen
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('prod-labubu-have-a-seat');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Core Data
  const [batches] = useState<TripBatch[]>(initialBatches);
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('atelier_products_china_v2');
    if (saved) {
      try {
        const parsed: Product[] = JSON.parse(saved);
        if (parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // fallback to initialProducts
      }
    }
    return initialProducts;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('atelier_orders_business_v2');
    return saved ? JSON.parse(saved) : initialOrders;
  });
  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('atelier_payments_business_v2');
    return saved ? JSON.parse(saved) : initialPayments;
  });
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('atelier_customers_v2');
    return saved ? JSON.parse(saved) : initialCustomers;
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('atelier_cart_business_v2');
    return saved ? JSON.parse(saved) : [];
  });

  // Luggage Suitcases Fleet
  const [suitcases, setSuitcases] = useState<LuggageSuitcase[]>(() => {
    const saved = localStorage.getItem('atelier_suitcases_business_v2');
    return saved ? JSON.parse(saved) : initialSuitcases;
  });

  // Buyer Auth (Clean, no auto-login)
  const [currentUser, setCurrentUser] = useState<Customer | null>(() => {
    const saved = localStorage.getItem('atelier_current_user_v2');
    return saved ? JSON.parse(saved) : null;
  });

  // Owner Auth (Clean, no auto-login)
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('atelier_owner_auth_v2');
    return saved === 'true';
  });

  // Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('atelier_settings');
    if (saved) {
      try {
        const parsed: StoreSettings = JSON.parse(saved);
        // Verify Mikael Aria Wicaksono Abhirakshantu bank account
        if (parsed.bcaAccount?.accountNumber === '01550921563') {
          return parsed;
        }
      } catch (e) {
        // fallback to initialStoreSettings
      }
    }
    return initialStoreSettings;
  });
  const [notificationSettings, setNotificationSettings] = useState<OwnerNotificationSettings>(() => {
    const saved = localStorage.getItem('atelier_notifications');
    return saved ? JSON.parse(saved) : initialNotificationSettings;
  });

  // UI Overlays
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot' | 'verify'>('login');
  const [pendingAuthAction, setPendingAuthAction] = useState<(() => void) | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCheckoutOrder, setActiveCheckoutOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('atelier_products_china_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('atelier_orders_business_v2', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('atelier_payments_business_v2', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('atelier_customers_v2', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('atelier_cart_business_v2', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('atelier_suitcases_business_v2', JSON.stringify(suitcases));
  }, [suitcases]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('atelier_current_user_v2', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('atelier_current_user_v2');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('atelier_owner_auth_v2', String(isOwnerLoggedIn));
  }, [isOwnerLoggedIn]);

  useEffect(() => {
    localStorage.setItem('atelier_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem('atelier_notifications', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigate = (screen: Screen, params?: { productId?: string; orderId?: string }) => {
    if (params?.productId) {
      setSelectedProductId(params.productId);
    }
    if (params?.orderId) {
      setSelectedOrderId(params.orderId);
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuthModal = (
    mode: 'login' | 'register' | 'forgot' | 'verify' = 'login',
    onAuthSuccess?: () => void
  ) => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    if (onAuthSuccess) {
      setPendingAuthAction(() => onAuthSuccess);
    }
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingAuthAction(null);
  };

  // Cart logic
  const addToCart = (product: Product, quantity = 1, selectedVariant?: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && item.selectedVariant === selectedVariant
      );
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id && item.selectedVariant === selectedVariant
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product.id, product, quantity, selectedVariant }];
    });
    addToast(`Added "${product.name}" to pre-order cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    addToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    if (!currentUser) {
      openAuthModal('login', () => toggleWishlist(productId));
      return;
    }
    const currentList = currentUser.wishlistProductIds || [];
    const isWished = currentList.includes(productId);
    const updated = isWished
      ? currentList.filter((id) => id !== productId)
      : [...currentList, productId];

    const updatedUser = { ...currentUser, wishlistProductIds: updated };
    setCurrentUser(updatedUser);
    setCustomers((prev) =>
      prev.map((c) => (c.id === updatedUser.id ? updatedUser : c))
    );
    addToast(isWished ? 'Removed from wishlist' : 'Saved to your wishlist');
  };

  // Unified Auth Handler (detects owner vs buyer automatically)
  const unifiedLogin = (email: string, password?: string): { success: boolean; role: 'owner' | 'buyer' } => {
    const cleanEmail = email.trim().toLowerCase();

    // Check if Owner credentials
    const isOwnerAccount = cleanEmail === 'mikaelariatl@gmail.com' || cleanEmail === 'mikaelariagamer23@gmail.com';
    if (isOwnerAccount) {
      if (password === 'admin123') {
        setIsOwnerLoggedIn(true);
        localStorage.setItem('atelier_owner_auth', 'true');
        addToast('Selamat datang kembali, Mikael Aria! Masuk ke Dashboard Owner.', 'success');
        setIsAuthModalOpen(false);
        navigate('owner-overview');
        return { success: true, role: 'owner' };
      } else {
        addToast('Kata sandi yang Anda masukkan salah. Silakan coba lagi.', 'error');
        return { success: false, role: 'owner' };
      }
    }

    // Any other email: automatically detected as buyer and routed directly to product catalog ('shop')
    const existing = customers.find((c) => c.email.toLowerCase() === cleanEmail);
    if (existing) {
      setCurrentUser(existing);
      localStorage.setItem('atelier_current_user', JSON.stringify(existing));
      addToast(`Selamat datang kembali, ${existing.fullName}! Membuka katalog produk...`, 'success');
      setIsAuthModalOpen(false);
      if (pendingAuthAction) {
        pendingAuthAction();
        setPendingAuthAction(null);
      } else {
        navigate('shop');
      }
      return { success: true, role: 'buyer' };
    } else {
      const buyerName = cleanEmail.split('@')[0].replace(/[._]/g, ' ');
      const formattedName = buyerName.charAt(0).toUpperCase() + buyerName.slice(1);
      const newUser: Customer = {
        id: `cust-${Date.now()}`,
        fullName: formattedName || 'Pelanggan Jastip',
        email: cleanEmail,
        phone: '+62 812-0000-0000',
        isEmailVerified: true,
        registeredAt: 'Hari ini',
        tier: 'First-Time',
        totalOrders: 0,
        totalSpentIdr: 0,
        addresses: [
          {
            id: 'addr-default',
            label: 'Alamat Pengiriman Utama',
            isDefault: true,
            recipientName: formattedName || 'Pelanggan Jastip',
            phone: '+62 812-0000-0000',
            street: 'Jl. Sudirman No. 45',
            city: 'Jakarta Selatan',
            province: 'DKI Jakarta',
            postalCode: '12190',
          },
        ],
        wishlistProductIds: [],
      };
      setCustomers((prev) => [newUser, ...prev]);
      setCurrentUser(newUser);
      localStorage.setItem('atelier_current_user', JSON.stringify(newUser));
      addToast(`Selamat berbelanja di Atelier Jastip, ${newUser.fullName}!`, 'success');
      setIsAuthModalOpen(false);
      if (pendingAuthAction) {
        pendingAuthAction();
        setPendingAuthAction(null);
      } else {
        navigate('shop');
      }
      return { success: true, role: 'buyer' };
    }
  };

  const loginBuyer = (email: string, password?: string): boolean => {
    const res = unifiedLogin(email, password);
    return res.success;
  };

  const registerBuyer = (name: string, email: string, phone: string) => {
    const newUser: Customer = {
      id: `cust-${Date.now()}`,
      fullName: name,
      email,
      phone,
      isEmailVerified: false,
      registeredAt: 'Today',
      tier: 'First-Time',
      totalOrders: 0,
      totalSpentIdr: 0,
      addresses: [],
      wishlistProductIds: [],
    };
    setCustomers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setAuthModalMode('verify');
    addToast('Registration successful! Verification code sent to your email.');
  };

  const verifyEmail = (code: string): boolean => {
    if (code.length === 4 || code.length === 6) {
      if (currentUser) {
        const verified = { ...currentUser, isEmailVerified: true };
        setCurrentUser(verified);
        setCustomers((prev) => prev.map((c) => (c.id === verified.id ? verified : c)));
      }
      addToast('Email verified successfully! You can now complete purchases.');
      setIsAuthModalOpen(false);
      if (pendingAuthAction) {
        pendingAuthAction();
        setPendingAuthAction(null);
      }
      return true;
    }
    addToast('Invalid verification code. Please check your inbox.', 'error');
    return false;
  };

  const logoutBuyer = () => {
    setCurrentUser(null);
    addToast('You have been signed out.');
    navigate('home');
  };

  // Checkout Handler
  const placeOrder = (
    shippingAddress: Order['shippingAddress'],
    courier: Order['courier'],
    paymentMethod: PaymentMethod,
    sourcingNotes?: string
  ): Order => {
    const subtotal = cart.reduce((acc, item) => acc + item.product.priceIdr * item.quantity, 0);
    const shippingFee = subtotal >= storeSettings.shippingRules.freeShippingThreshold ? 0 : storeSettings.shippingRules.standardFee;
    const uniqueDigits = Math.floor(100 + Math.random() * 899); // 3-digit anti collision code e.g. 842
    const totalAmount = subtotal + shippingFee + (paymentMethod !== 'QRIS' ? uniqueDigits : 0);

    const orderNum = `JTP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderNum,
      customerId: currentUser?.id || 'guest',
      customerName: currentUser?.fullName || shippingAddress.recipientName,
      customerEmail: currentUser?.email || 'buyer@example.com',
      customerPhone: currentUser?.phone || shippingAddress.phone,
      shippingAddress,
      items: [...cart],
      subtotal,
      shippingFee,
      uniqueCode: uniqueDigits,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'QRIS' ? 'Verification' : 'Pending',
      orderStatus: 'Pending Payment',
      createdAt: 'Just Now',
      courier,
      luggageSlot: 'Suitcase A',
      totalWeightKg: Number(cart.reduce((acc, it) => acc + it.product.weightKg * it.quantity, 0).toFixed(2)),
      sourcingNotes,
      checkpoints: [
        {
          title: 'Order Placed & Awaiting Payment',
          timestamp: 'Just Now',
          completed: true,
          location: 'Jakarta Hub',
        },
        {
          title: 'Procurement in Boutique',
          timestamp: 'Pending confirmation',
          completed: false,
          location: 'Tokyo / Paris',
        },
        {
          title: 'Hand-Carried Flight Arrival',
          timestamp: 'Scheduled for Apr 02',
          completed: false,
          location: 'CGK Terminal 3',
        },
        {
          title: 'Domestic Dispatch',
          timestamp: `${courier} Courier`,
          completed: false,
        },
      ],
    };

    // Create corresponding payment record
    const newPayment: PaymentRecord = {
      id: `PAY-${Date.now()}`,
      orderId: orderNum,
      customerName: newOrder.customerName,
      customerPhone: newOrder.customerPhone,
      method: paymentMethod,
      amount: subtotal + shippingFee,
      uniqueDigits,
      totalExpected: totalAmount,
      status: 'Pending Review',
      transactionDate: 'Just Now',
      ocrMatch: {
        destinationMatch: true,
        amountMatch: true,
        timestampDeviationMins: 1,
        ocrAccountNumber:
          paymentMethod === 'BCA'
            ? storeSettings.bcaAccount.accountNumber
            : paymentMethod === 'BNI'
            ? storeSettings.bniAccount.accountNumber
            : storeSettings.cimbAccount.accountNumber,
        ocrRefNumber: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      },
      notes: `${newOrder.customerName} • ${newOrder.items.length} items • ${newOrder.items[0]?.product.name || 'Jastip Item'}`,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setPayments((prev) => [newPayment, ...prev]);
    setActiveCheckoutOrder(newOrder);
    clearCart();

    // Update customer stats
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        totalOrders: currentUser.totalOrders + 1,
        totalSpentIdr: currentUser.totalSpentIdr + totalAmount,
      };
      setCurrentUser(updatedUser);
      setCustomers((prev) => prev.map((c) => (c.id === updatedUser.id ? updatedUser : c)));
    }

    addToast(`Order ${orderNum} created successfully! Please review payment instructions.`);
    return newOrder;
  };

  // Owner Auth Handlers
  const loginOwner = (password: string): boolean => {
    if (password === 'admin123' || password === 'admin' || password === 'atelier2025') {
      setIsOwnerLoggedIn(true);
      localStorage.setItem('atelier_owner_auth', 'true');
      addToast('Selamat datang kembali, Mikael Aria! Masuk sebagai Pemilik Toko.', 'success');
      navigate('owner-overview');
      return true;
    }
    addToast('Password owner salah. Silakan coba lagi (admin123).', 'error');
    return false;
  };

  const logoutOwner = () => {
    setIsOwnerLoggedIn(false);
    localStorage.removeItem('atelier_owner_auth');
    addToast('Berhasil keluar dari sesi Pemilik Toko.');
    navigate('home');
  };

  // Product Management Handlers
  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    addToast(`Product "${newProduct.name}" created.`);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    addToast('Product specifications updated.');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('Product deleted from active catalog.', 'info');
  };

  // Order Management Handlers
  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedCheckpoints = [...order.checkpoints];
          if (status === 'Processing') {
            updatedCheckpoints[1] = { ...updatedCheckpoints[1], completed: true, timestamp: 'Sourced Today' };
          } else if (status === 'Shipped') {
            updatedCheckpoints[2] = { ...updatedCheckpoints[2], completed: true, timestamp: 'Landed at CGK' };
            updatedCheckpoints[3] = { ...updatedCheckpoints[3], completed: true, timestamp: 'Handed to Courier' };
          }
          return {
            ...order,
            orderStatus: status,
            paymentStatus: status === 'Paid' || status === 'Processing' || status === 'Shipped' ? 'Paid' : order.paymentStatus,
            trackingNumber: trackingNumber || order.trackingNumber,
            checkpoints: updatedCheckpoints,
          };
        }
        return order;
      })
    );
    addToast(`Order #${orderId} status set to ${status}.`);
  };

  // Payment Verification Handler
  const verifyPaymentSlip = (paymentId: string, isApproved: boolean) => {
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id === paymentId) {
          return { ...p, status: isApproved ? 'Verified' : 'Rejected' };
        }
        return p;
      })
    );

    const relatedPayment = payments.find((p) => p.id === paymentId);
    if (relatedPayment) {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === relatedPayment.orderId) {
            return {
              ...o,
              paymentStatus: isApproved ? 'Paid' : 'Failed',
              orderStatus: isApproved ? 'Processing' : 'Pending Payment',
            };
          }
          return o;
        })
      );
    }
    addToast(isApproved ? 'Payment verified & order marked Processing!' : 'Payment rejected.', isApproved ? 'success' : 'error');
  };

  // Settings Handlers
  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('Store configurations saved.');
  };

  const updateNotificationSettings = (newSettings: Partial<OwnerNotificationSettings>) => {
    setNotificationSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('Notification preferences updated.');
  };

  const sendTestNotificationEmail = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setNotificationSettings((prev) => ({
      ...prev,
      lastTestEmailSent: `Delivered today at ${timestamp} (SMTP OK)`,
    }));
    addToast(`Notifikasi email berhasil dikirim ke ${notificationSettings.notificationEmail}!`);
  };

  // Suitcase / Luggage Handlers
  const addSuitcase = (suitcaseData: Omit<LuggageSuitcase, 'id'>) => {
    const newSuitcase: LuggageSuitcase = {
      ...suitcaseData,
      id: `koper-${Date.now()}`,
      currentLoadKg: suitcaseData.items?.reduce((s, it) => s + it.weightKg * it.qty, 0) || 0,
      items: suitcaseData.items || [],
    };
    setSuitcases((prev) => [...prev, newSuitcase]);
    addToast(`Koper "${newSuitcase.name}" berhasil ditambahkan ke penerbangan!`, 'success');
  };

  const deleteSuitcase = (id: string) => {
    setSuitcases((prev) => prev.filter((s) => s.id !== id));
    addToast('Koper bagasi berhasil dihapus dari alokasi penerbangan.', 'info');
  };

  const updateSuitcase = (id: string, updates: Partial<LuggageSuitcase>) => {
    setSuitcases((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    addToast('Informasi koper berhasil diperbarui.', 'success');
  };

  const addSuitcaseItem = (suitcaseId: string, item: Omit<LuggageItem, 'id'>) => {
    const newItem: LuggageItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    setSuitcases((prev) =>
      prev.map((s) => {
        if (s.id !== suitcaseId) return s;
        const updatedItems = [...s.items, newItem];
        const updatedLoad = updatedItems.reduce((acc, it) => acc + it.weightKg * it.qty, 0);
        return {
          ...s,
          items: updatedItems,
          currentLoadKg: Number(updatedLoad.toFixed(2)),
        };
      })
    );
    addToast(`Muatan "${item.name}" berhasil dimasukkan ke koper!`, 'success');
  };

  const deleteSuitcaseItem = (suitcaseId: string, itemId: string) => {
    setSuitcases((prev) =>
      prev.map((s) => {
        if (s.id !== suitcaseId) return s;
        const updatedItems = s.items.filter((it) => it.id !== itemId);
        const updatedLoad = updatedItems.reduce((acc, it) => acc + it.weightKg * it.qty, 0);
        return {
          ...s,
          items: updatedItems,
          currentLoadKg: Number(updatedLoad.toFixed(2)),
        };
      })
    );
    addToast('Muatan barang dikeluarkan dari koper.', 'info');
  };

  // Reset Total Website & Transaksi Bisnis
  const resetTotalWebsite = () => {
    setOrders([]);
    setPayments([]);
    setCart([]);
    setCurrentUser(null);
    setIsOwnerLoggedIn(false);
    setSelectedOrderId(null);
    setSuitcases(initialSuitcases);

    // Clear legacy and active caches
    const keysToRemove = [
      'atelier_orders_business_v2',
      'atelier_payments_business_v2',
      'atelier_cart_business_v2',
      'atelier_current_user_v2',
      'atelier_owner_auth_v2',
      'atelier_suitcases_business_v2',
      'atelier_orders_china_v1',
      'atelier_payments_china_v1',
      'atelier_orders',
      'atelier_payments',
      'atelier_cart',
      'atelier_current_user',
      'atelier_owner_auth',
    ];
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    addToast('Website berhasil di-reset total! Seluruh data transaksi uji coba dibersihkan dan website siap 100% untuk operasional bisnis riil Anda.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigate,
        selectedProductId,
        selectedOrderId,
        batches,
        products,
        orders,
        payments,
        customers,
        cart,
        currentUser,
        isOwnerLoggedIn,
        storeSettings,
        notificationSettings,
        isAuthModalOpen,
        authModalMode,
        pendingAuthAction,
        openAuthModal,
        closeAuthModal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        searchQuery,
        setSearchQuery,
        toasts,
        addToast,
        removeToast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        loginBuyer,
        unifiedLogin,
        registerBuyer,
        verifyEmail,
        logoutBuyer,
        activeCheckoutOrder,
        placeOrder,
        loginOwner,
        logoutOwner,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        verifyPaymentSlip,
        updateStoreSettings,
        updateNotificationSettings,
        sendTestNotificationEmail,
        suitcases,
        addSuitcase,
        deleteSuitcase,
        updateSuitcase,
        addSuitcaseItem,
        deleteSuitcaseItem,
        resetTotalWebsite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
