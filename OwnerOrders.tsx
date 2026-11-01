import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  CheckCircle2,
  Clock,
  Eye,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { OrderStatus } from '../../types';

export const OwnerOrders: React.FC = () => {
  const { orders, payments, updateOrderStatus, verifyPaymentSlip, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeOrderId, setActiveOrderId] = useState<string>(orders[0]?.id || '');
  const [newTrackingNumber, setNewTrackingNumber] = useState('');

  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders[0];
  const activePayment = activeOrder ? payments.find((p) => p.orderId === activeOrder.id) : null;

  // Filtering
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || o.orderStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    if (!activeOrder) return;
    updateOrderStatus(activeOrder.id, newStatus);
    addToast(`Order ${activeOrder.id} status updated to ${newStatus}`, 'success');
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder || !newTrackingNumber) return;
    updateOrderStatus(activeOrder.id, activeOrder.orderStatus, newTrackingNumber);
    setNewTrackingNumber('');
    addToast('Airway Bill / Tracking number saved and buyer notified', 'success');
  };

  const statusOptions: OrderStatus[] = [
    'Pending Payment',
    'Payment Verification',
    'Paid',
    'Processing',
    'Shipped',
    'Delivered',
    'Completed',
    'Cancelled',
  ];

  return (
    <div className="space-y-6">
      
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e8e2d9] gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#96422d]">Curator Operations</span>
          <h1 className="font-serif text-3xl text-[#1e1c1a] mt-0.5">Order Fulfillment Manifest</h1>
        </div>
        <div className="text-xs font-mono text-[#736e65]">
          Total Manifest: <strong className="text-[#1e1c1a]">{orders.length} orders</strong> • Total Intake: Rp {(orders.reduce((a, b) => a + b.totalAmount, 0) / 1000000).toFixed(1)}M
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white border border-[#e8e2d9] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Buyer, or Email..."
            className="w-full text-xs pl-8 pr-3 py-2 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none"
          />
          <Search className="w-4 h-4 text-[#a8a196] absolute left-2.5 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-[#d4cbbf] bg-white text-xs font-mono focus:outline-none"
          >
            <option value="all">All Lifecycle Stages</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* SPLIT INSPECTOR VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Table (Cols 1-7) */}
        <div className="lg:col-span-7 bg-white border border-[#e8e2d9] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7f5f2] border-b border-[#e8e2d9] font-mono uppercase text-[#736e65] text-[10px]">
                <tr>
                  <th className="p-3.5">Order</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Total Amount</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ece6]">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[#736e65]">
                      No orders match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => {
                    const isSelected = activeOrder?.id === o.id;
                    return (
                      <tr
                        key={o.id}
                        onClick={() => setActiveOrderId(o.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#fbf9f8] font-medium' : 'hover:bg-[#faf8f5]'
                        }`}
                      >
                        <td className="p-3.5 font-mono text-[#1e1c1a]">
                          {o.id}
                          {o.uniqueCode && (
                            <span className="block text-[9px] text-[#96422d]">+{o.uniqueCode}</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="text-[#1e1c1a] font-medium truncate max-w-[120px]">{o.customerName}</div>
                          <div className="text-[10px] text-[#736e65] truncate max-w-[120px]">{o.customerEmail}</div>
                        </td>
                        <td className="p-3.5 font-mono font-medium text-[#1e1c1a]">
                          Rp {o.totalAmount.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`inline-block text-[9px] font-mono uppercase px-2 py-0.5 border ${
                              o.orderStatus === 'Completed' || o.orderStatus === 'Delivered'
                                ? 'bg-[#d8f3dc] text-[#1b4332] border-[#b7e4c7]'
                                : o.orderStatus === 'Pending Payment'
                                ? 'bg-[#fff3cd] text-[#856404] border-[#ffeeba]'
                                : o.orderStatus === 'Processing' || o.orderStatus === 'Paid'
                                ? 'bg-[#f4eee6] text-[#96422d] border-[#e8e2d9]'
                                : 'bg-[#e9ecef] text-[#495057] border-[#ced4da]'
                            }`}
                          >
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveOrderId(o.id);
                            }}
                            className="p-1 text-[#736e65] hover:text-[#1e1c1a]"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Active Inspector (Cols 8-12) */}
        {activeOrder && (
          <div className="lg:col-span-5 bg-white border border-[#e8e2d9] p-6 shadow-xs space-y-6 sticky top-20">
            
            {/* Inspector Header */}
            <div className="pb-4 border-b border-[#f0ece6]">
              <div className="flex items-center justify-between text-xs font-mono text-[#736e65] mb-1">
                <span>Active Sourcing Inspector</span>
                <span className="text-[#96422d] uppercase">{activeOrder.luggageSlot}</span>
              </div>
              <h2 className="font-serif text-2xl text-[#1e1c1a]">{activeOrder.id}</h2>
              <div className="text-xs text-[#736e65] mt-1">
                Ordered: {activeOrder.createdAt}
              </div>
            </div>

            {/* Customer Direct Contact */}
            <div className="p-3 bg-[#faf8f5] border border-[#e8e2d9] text-xs flex items-center justify-between">
              <div>
                <div className="font-medium text-[#1e1c1a]">{activeOrder.customerName}</div>
                <div className="text-[#736e65] text-[11px]">{activeOrder.customerPhone}</div>
              </div>
              <a
                href={`https://wa.me/${activeOrder.customerPhone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(activeOrder.customerName)},%20saya%20Mikael%20Aria%20dari%20Atelier%20Jastip%20terkait%20pesanan%20${activeOrder.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-3 py-1.5 bg-[#25d366] text-white font-mono text-[10px] uppercase tracking-wider rounded-xs hover:bg-[#20ba59]"
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                WhatsApp
              </a>
            </div>

            {/* Lifecycle Stage Switcher */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#736e65] mb-1.5">
                Update Fulfillment Checkpoint
              </label>
              <select
                value={activeOrder.orderStatus}
                onChange={(e) => handleUpdateStatus(e.target.value as OrderStatus)}
                className="w-full text-xs font-mono px-3 py-2 border border-[#d4cbbf] bg-white focus:outline-none focus:border-[#1e1c1a]"
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Tracking / AWB Updater */}
            <form onSubmit={handleSaveTracking} className="space-y-2">
              <label className="block text-[10px] font-mono uppercase text-[#736e65]">
                Domestic Courier AWB / Resi
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTrackingNumber}
                  onChange={(e) => setNewTrackingNumber(e.target.value)}
                  placeholder={activeOrder.trackingNumber || 'e.g. PXL-82910391'}
                  className="flex-1 text-xs px-3 py-2 border border-[#d4cbbf] focus:outline-none focus:border-[#1e1c1a]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1e1c1a] text-white text-xs font-mono uppercase hover:bg-[#333]"
                >
                  Save
                </button>
              </div>
            </form>

            {/* Payment & Slip Status */}
            <div className="p-3.5 border border-[#e8e2d9] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[#736e65] uppercase text-[10px]">Payment Verification</span>
                <span className="font-mono font-medium text-[#1e1c1a]">
                  Rp {activeOrder.totalAmount.toLocaleString('id-ID')}
                </span>
              </div>

              {activeOrder.paymentStatus !== 'Paid' ? (
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[#96422d] font-mono text-[11px]">{activeOrder.paymentStatus}</span>
                  {activePayment && (
                    <button
                      onClick={() => verifyPaymentSlip(activePayment.id, true)}
                      className="px-3 py-1 bg-[#2d6a4f] text-white text-[10px] font-mono uppercase"
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-[11px] text-[#2d6a4f] font-mono">
                  ✓ Reconciled with Bank Mutasi
                </div>
              )}
            </div>

            {/* Sourced Items Manifest */}
            <div className="space-y-3">
              <div className="text-[10px] font-mono uppercase text-[#736e65]">
                Items to Buy in Tokyo ({activeOrder.items.length})
              </div>

              <div className="divide-y divide-[#f0ece6]">
                {activeOrder.items.map((item) => (
                  <div key={item.product.id} className="py-2.5 flex items-center space-x-3 text-xs">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-10 h-10 object-cover bg-[#f4eee6] border border-[#e8e2d9]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[#1e1c1a] truncate">{item.product.name}</div>
                      <div className="text-[11px] text-[#736e65]">
                        Qty: {item.quantity} {item.selectedVariant && `• ${item.selectedVariant}`} • {item.product.weightKg}kg
                      </div>
                    </div>
                    <div className="font-mono text-xs font-semibold text-[#1e1c1a]">
                      Rp {(item.product.priceIdr * item.quantity).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="pt-2 border-t border-[#f0ece6] text-xs text-[#736e65]">
              <div className="font-mono uppercase text-[10px] text-[#736e65] mb-1">Domestic Recipient</div>
              <div className="text-[#1e1c1a]">{activeOrder.shippingAddress.recipientName}</div>
              <div className="line-clamp-2">
                {activeOrder.shippingAddress.street}, {activeOrder.shippingAddress.city} {activeOrder.shippingAddress.postalCode}
              </div>
            </div>

          </div>
        )}

        {!activeOrder && (
          <div className="lg:col-span-5 bg-white border border-[#e8e2d9] p-12 text-center rounded-xl space-y-3">
            <div className="w-12 h-12 bg-[#faf8f5] border border-[#e8e2d9] text-[#736e65] rounded-full flex items-center justify-center mx-auto">
              <Eye className="w-5 h-5 text-[#96422d]" />
            </div>
            <h3 className="font-serif text-lg text-[#1e1c1a]">Belum Ada Pesanan Masuk</h3>
            <p className="text-xs text-[#736e65] max-w-sm mx-auto leading-relaxed">
              Toko bersih dan siap beroperasi. Setiap pesanan baru dari pembeli akan otomatis muncul di manifest ini.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
