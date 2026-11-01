import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Package,
  MapPin,
  Heart,
  User,
  ShieldCheck,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  Receipt
} from 'lucide-react';
import { OrderVisualTimeline } from './OrderVisualTimeline';
import { InvoiceModal } from '../common/InvoiceModal';
import { Order } from '../../types';

export const BuyerDashboard: React.FC = () => {
  const { currentUser, orders, products, storeSettings, logoutBuyer, toggleWishlist, addToCart, addToast, navigate } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'profile'>('orders');
  const [stageFilter, setStageFilter] = useState<'All' | 'Processing' | 'Purchased' | 'In Transit' | 'Delivered'>('All');
  const [expandedTimelines, setExpandedTimelines] = useState<Record<string, boolean>>({});
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  const toggleTimeline = (orderId: string) => {
    setExpandedTimelines((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#faf8f5] px-4">
        <h2 className="font-serif text-2xl text-[#1e1c1a] mb-2">Member Session Required</h2>
        <p className="text-sm text-[#736e65] mb-6">Please log in to review your personal shopping dashboard.</p>
        <button
          onClick={() => navigate('shop')}
          className="px-6 py-2.5 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-widest"
        >
          Return to Atelier Storefront
        </button>
      </div>
    );
  }

  // Filter orders
  const buyerOrders = orders.filter((o) => o.customerEmail === currentUser.email || o.customerId === currentUser.id);
  const wishlistProducts = products.filter((p) => (currentUser.wishlistProductIds || []).includes(p.id));

  const getOrderStage = (o: any): 'Processing' | 'Purchased' | 'In Transit' | 'Delivered' => {
    if (o.orderStatus === 'Delivered' || o.orderStatus === 'Completed') return 'Delivered';
    if (o.orderStatus === 'Shipped') return 'In Transit';
    if (o.orderStatus === 'Processing') return 'Purchased';
    return 'Processing';
  };

  const displayedOrders = buyerOrders.filter((o) => {
    if (stageFilter === 'All') return true;
    return getOrderStage(o) === stageFilter;
  });

  return (
    <div className="bg-[#fbf9f8] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Profile Ribbon */}
        <div className="bg-white border border-[#e8e2d9] p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-[#f4eee6] border border-[#e8e2d9] flex items-center justify-center font-serif text-2xl text-[#1e1c1a]">
              {currentUser.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif text-2xl text-[#1e1c1a]">{currentUser.fullName}</h1>
                {currentUser.isEmailVerified ? (
                  <span className="inline-flex items-center text-[10px] font-mono uppercase text-[#2d6a4f] bg-[#d8f3dc] px-2 py-0.5 border border-[#b7e4c7]">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Verified Member
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[10px] font-mono uppercase text-[#96422d] bg-[#f4eee6] px-2 py-0.5">
                    Unverified
                  </span>
                )}
              </div>
              <p className="text-xs text-[#736e65] mt-0.5">
                {currentUser.email} • {currentUser.phone} • Tier: <strong className="text-[#1e1c1a]">{currentUser.tier}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('shop')}
              className="px-4 py-2 border border-[#1e1c1a] text-xs font-mono uppercase tracking-wider text-[#1e1c1a] hover:bg-[#faf8f5] transition-colors"
            >
              Katalog Jastip China
            </button>
            <button
              onClick={logoutBuyer}
              className="inline-flex items-center px-4 py-2 bg-[#f4eee6] text-xs font-mono uppercase tracking-wider text-[#736e65] hover:text-[#1e1c1a] hover:bg-[#e8e2d9] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-[#e8e2d9] mb-8 space-x-8 text-xs font-mono uppercase tracking-wider overflow-x-auto">
          {[
            { id: 'orders', label: `My Orders (${buyerOrders.length})`, icon: <Package className="w-4 h-4 mr-2" /> },
            { id: 'addresses', label: `Address Book (${currentUser.addresses.length})`, icon: <MapPin className="w-4 h-4 mr-2" /> },
            { id: 'wishlist', label: `Saved Wishlist (${wishlistProducts.length})`, icon: <Heart className="w-4 h-4 mr-2" /> },
            { id: 'profile', label: 'Security & Preferences', icon: <User className="w-4 h-4 mr-2" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center pb-3 border-b-2 font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-[#1e1c1a] text-[#1e1c1a]'
                  : 'border-transparent text-[#736e65] hover:text-[#1e1c1a]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Visual Stage Filter Ribbon */}
            <div className="flex flex-wrap items-center gap-2 pb-2">
              {[
                { id: 'All', label: 'All Orders', count: buyerOrders.length },
                { id: 'Processing', label: 'Processing', count: buyerOrders.filter((o) => getOrderStage(o) === 'Processing').length },
                { id: 'Purchased', label: 'Purchased', count: buyerOrders.filter((o) => getOrderStage(o) === 'Purchased').length },
                { id: 'In Transit', label: 'In Transit', count: buyerOrders.filter((o) => getOrderStage(o) === 'In Transit').length },
                { id: 'Delivered', label: 'Delivered', count: buyerOrders.filter((o) => getOrderStage(o) === 'Delivered').length },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStageFilter(s.id as any)}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all border ${
                    stageFilter === s.id
                      ? 'bg-[#1e1c1a] text-white border-[#1e1c1a] shadow-xs'
                      : 'bg-white text-[#736e65] border-[#e8e2d9] hover:border-[#b5a99a]'
                  }`}
                >
                  <span>{s.label}</span>
                  <span className={`ml-1.5 px-1.5 py-0.2 text-[10px] rounded-xs ${
                    stageFilter === s.id ? 'bg-[#3b3632] text-white' : 'bg-[#f4eee6] text-[#96422d]'
                  }`}>
                    {s.count}
                  </span>
                </button>
              ))}
            </div>

            {displayedOrders.length === 0 ? (
              <div className="bg-white border border-[#e8e2d9] p-12 text-center space-y-4">
                <Package className="w-10 h-10 text-[#a8a196] mx-auto" />
                <h3 className="font-serif text-xl text-[#1e1c1a]">
                  {stageFilter === 'All' ? 'No Active Sourcing Orders' : `No Orders Currently in '${stageFilter}' Stage`}
                </h3>
                <p className="text-xs text-[#736e65] max-w-sm mx-auto">
                  {stageFilter === 'All'
                    ? "Anda belum memesan barang titipan pada trip China (Guangzhou & Shanghai) mendatang."
                    : `Tidak ada pesanan Anda yang sedang berada di tahapan '${stageFilter}'.`}
                </p>
                {stageFilter !== 'All' ? (
                  <button
                    onClick={() => setStageFilter('All')}
                    className="px-6 py-2.5 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#333]"
                  >
                    Lihat Semua Pesanan
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('shop')}
                    className="px-6 py-2.5 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#333]"
                  >
                    Jelajahi Produk Viral China
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {displayedOrders.map((order) => {
                  const isExpanded = !!expandedTimelines[order.id];
                  const currentStage = getOrderStage(order);

                  return (
                    <div
                      key={order.id}
                      className="bg-white border border-[#e8e2d9] p-6 hover:border-[#b5a99a] transition-all shadow-xs"
                    >
                      {/* Order Header Summary */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#f0ece6] gap-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-semibold text-[#1e1c1a]">{order.id}</span>
                            <span className="text-[10px] font-mono uppercase bg-[#f4eee6] text-[#96422d] px-2 py-0.5">
                              Batch 01 (China Express)
                            </span>
                            <span className="text-[10px] font-mono uppercase bg-[#f7f5f2] text-[#1e1c1a] px-2 py-0.5 border border-[#e8e2d9]">
                              Stage: {currentStage}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#736e65] mt-1">
                            Placed: {order.createdAt}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span
                            className={`text-[11px] font-mono uppercase px-2.5 py-1 border ${
                              order.orderStatus === 'Completed' || order.orderStatus === 'Delivered'
                                ? 'bg-[#d8f3dc] text-[#1b4332] border-[#b7e4c7]'
                                : order.orderStatus === 'Pending Payment'
                                ? 'bg-[#fff3cd] text-[#856404] border-[#ffeeba]'
                                : 'bg-[#f4eee6] text-[#1e1c1a] border-[#e8e2d9]'
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                          <div className="font-mono text-sm font-semibold text-[#1e1c1a]">
                            Rp {order.totalAmount.toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>

                      {/* VISUAL ORDER TIMELINE (Processing -> Purchased -> In Transit -> Delivered) */}
                      <div className="my-5">
                        <OrderVisualTimeline order={order} compact={!isExpanded} />

                        {/* Toggle detail view button */}
                        <div className="mt-2 text-right">
                          <button
                            type="button"
                            onClick={() => toggleTimeline(order.id)}
                            className="inline-flex items-center text-[11px] font-mono uppercase text-[#736e65] hover:text-[#1e1c1a] transition-colors"
                          >
                            <span>{isExpanded ? 'Collapse Timeline Details' : 'View Full Milestone Breakdown'}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 ml-1" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 ml-1" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Items snippet */}
                      <div className="py-4 border-t border-[#f0ece6] grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {order.items.map((item) => (
                          <div key={item.product.id} className="flex items-center space-x-3 text-xs">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover bg-[#f4eee6] border border-[#e8e2d9]"
                            />
                            <div className="min-w-0">
                              <div className="font-medium text-[#1e1c1a] truncate">{item.product.name}</div>
                              <div className="text-[11px] text-[#736e65]">
                                Qty: {item.quantity} {item.selectedVariant && `• ${item.selectedVariant}`}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Card Footer */}
                      <div className="pt-4 border-t border-[#f0ece6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="text-[#736e65]">
                          Courier: <span className="text-[#1e1c1a] font-mono uppercase">{order.courier}</span>
                          {order.trackingNumber && (
                            <span className="ml-2 font-mono">AWB: {order.trackingNumber}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setInvoiceOrder(order)}
                            className="inline-flex items-center text-xs font-mono uppercase text-emerald-800 font-semibold hover:underline bg-emerald-50 px-2.5 py-1 border border-emerald-200 rounded"
                          >
                            <Receipt className="w-3.5 h-3.5 mr-1" />
                            Invoice Web
                          </button>
                          <button
                            onClick={() => navigate('order-confirmation', { orderId: order.id })}
                            className="inline-flex items-center text-xs font-mono uppercase text-[#96422d] font-semibold hover:underline"
                          >
                            Lacak Pesanan <ChevronRight className="w-4 h-4 ml-0.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif text-xl text-[#1e1c1a]">Delivery Address Book</h3>
                <p className="text-xs text-[#736e65]">Where your imported items will be delivered from Jakarta.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentUser.addresses.map((addr) => (
                <div key={addr.id} className="bg-white border border-[#e8e2d9] p-5 relative">
                  {addr.isDefault && (
                    <span className="inline-block text-[10px] font-mono uppercase bg-[#f4eee6] text-[#96422d] px-2 py-0.5 mb-2">
                      Default Shipping Address
                    </span>
                  )}
                  <h4 className="font-medium text-sm text-[#1e1c1a]">{addr.recipientName}</h4>
                  <div className="text-xs text-[#736e65] mt-1">{addr.phone}</div>
                  <div className="text-xs text-[#736e65] mt-2 leading-relaxed">
                    {addr.street}<br />
                    {addr.city}, {addr.province} {addr.postalCode}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-xl text-[#1e1c1a]">Saved Wishlist</h3>
              <p className="text-xs text-[#736e65]">Items you're considering for upcoming sourcing trips.</p>
            </div>

            {wishlistProducts.length === 0 ? (
              <div className="bg-white border border-[#e8e2d9] p-12 text-center space-y-4">
                <Heart className="w-10 h-10 text-[#a8a196] mx-auto" />
                <h3 className="font-serif text-xl text-[#1e1c1a]">Your Wishlist is Empty</h3>
                <p className="text-xs text-[#736e65] max-w-sm mx-auto">
                  Simpan barang viral dari China (Guangzhou, Shanghai, Shenzhen, Yiwu) saat browsing untuk memantau kuota koper dan harga.
                </p>
                <button
                  onClick={() => navigate('shop')}
                  className="px-6 py-2.5 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#333]"
                >
                  Explore Sourcing Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {wishlistProducts.map((p) => (
                  <div key={p.id} className="bg-white border border-[#e8e2d9] p-4 flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-square bg-[#f4eee6] mb-3 overflow-hidden">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-[10px] font-mono uppercase text-[#96422d]">{p.brand}</div>
                      <h4 className="font-medium text-xs text-[#1e1c1a] mt-0.5 line-clamp-2">{p.name}</h4>
                      <div className="font-mono text-xs font-semibold text-[#1e1c1a] mt-2">
                        Rp {p.priceIdr.toLocaleString('id-ID')}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#f0ece6] flex items-center space-x-2">
                      <button
                        onClick={() => addToCart(p, 1)}
                        className="flex-1 py-2 bg-[#1e1c1a] text-white text-[11px] font-mono uppercase tracking-wider hover:bg-[#333]"
                      >
                        Reserve
                      </button>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="p-2 border border-[#e8e2d9] text-[#736e65] hover:text-[#96422d]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFILE & SECURITY */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-[#e8e2d9] p-6 sm:p-8 max-w-xl space-y-6">
            <div>
              <h3 className="font-serif text-xl text-[#1e1c1a]">Profile & Security Settings</h3>
              <p className="text-xs text-[#736e65]">Manage your personal verification and authentication data.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">Full Legal Name</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.fullName}
                  className="w-full px-3 py-2 bg-[#fbf9f8] border border-[#e8e2d9] text-[#736e65] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">Email Address</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full px-3 py-2 bg-[#fbf9f8] border border-[#e8e2d9] text-[#736e65] cursor-not-allowed"
                  />
                  <span className="text-[10px] font-mono uppercase text-[#2d6a4f] shrink-0">✓ Verified</span>
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">Registered Phone</label>
                <input
                  type="tel"
                  disabled
                  value={currentUser.phone}
                  className="w-full px-3 py-2 bg-[#fbf9f8] border border-[#e8e2d9] text-[#736e65] cursor-not-allowed"
                />
              </div>

              <div className="pt-4 border-t border-[#f0ece6]">
                <h4 className="font-medium text-xs text-[#1e1c1a] mb-2">Change Password</h4>
                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full px-3 py-2 border border-[#d4cbbf] text-xs focus:outline-none focus:border-[#1e1c1a]"
                  />
                  <input
                    type="password"
                    placeholder="New Password (min 6 characters)"
                    className="w-full px-3 py-2 border border-[#d4cbbf] text-xs focus:outline-none focus:border-[#1e1c1a]"
                  />
                  <button
                    type="button"
                    onClick={() => addToast('Password successfully updated', 'success')}
                    className="px-4 py-2 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-wider"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* In-Web Digital Invoice Modal */}
      <InvoiceModal
        order={invoiceOrder}
        isOpen={!!invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
        storeSettings={storeSettings}
      />
    </div>
  );
};
