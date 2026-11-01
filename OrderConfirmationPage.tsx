import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  FileText,
  Receipt
} from 'lucide-react';
import { OrderVisualTimeline } from '../buyer/OrderVisualTimeline';
import { InvoiceModal } from '../common/InvoiceModal';

export const OrderConfirmationPage: React.FC = () => {
  const { selectedOrderId, orders, batches, storeSettings, navigate } = useApp();
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#faf8f5] px-4">
        <h2 className="font-serif text-2xl text-[#1e1c1a] mb-2">Order Not Found</h2>
        <p className="text-sm text-[#736e65] mb-6">We could not locate this order.</p>
        <button
          onClick={() => navigate('shop')}
          className="px-6 py-2.5 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-widest"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const batchInfo = batches[0];

  return (
    <div className="bg-[#fbf9f8] min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('buyer-dashboard')}
            className="inline-flex items-center text-xs text-[#736e65] hover:text-[#1e1c1a] group font-mono uppercase"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1 group-hover:-translate-x-0.5 transition-transform" />
            Back to All Orders
          </button>
          
          <div className="text-xs font-mono text-[#736e65]">
            Placed: {order.createdAt}
          </div>
        </div>

        {/* Order Hero Banner */}
        <div className="bg-white border border-[#e8e2d9] p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f0ece6]">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#96422d] bg-[#f4eee6] px-2 py-0.5">
                  Trip Batch: {batchInfo?.name || 'China Guangzhou & Shanghai Express'}
                </span>
                <span className="text-xs font-mono text-[#736e65]">ID: {order.id}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#1e1c1a]">
                Concierge Fulfillment Passport
              </h1>
            </div>

            <div className="flex flex-col sm:items-end">
              <span className="text-xs font-mono text-[#736e65] uppercase">Total Order Value</span>
              <span className="font-mono text-2xl font-bold text-[#1e1c1a]">
                Rp {order.totalAmount.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] font-mono text-[#736e65]">
                {order.paymentStatus === 'Paid' ? '✓ Fully Settled' : 'Awaiting Payment Verification'}
              </span>
            </div>
          </div>

          {/* Action Prompt if Still Pending */}
          {order.paymentStatus !== 'Paid' && (
            <div className="mt-6 p-4 bg-[#fdfbf7] border border-[#e8e2d9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-[#736e65]">
                <strong className="text-[#96422d] font-medium block sm:inline mr-2">
                  Payment Verification Needed:
                </strong>
                Transfer Rp {order.totalAmount.toLocaleString('id-ID')} (incl. code +{order.uniqueCode}) to confirm your quota.
              </div>
              <button
                onClick={() => navigate('payment-instructions', { orderId: order.id })}
                className="px-5 py-2 bg-[#96422d] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#7e3624] transition-colors whitespace-nowrap self-start sm:self-auto"
              >
                Upload Payment Receipt →
              </button>
            </div>
          )}

          {/* Visual Order Timeline ('Processing', 'Purchased', 'In Transit', 'Delivered') */}
          <div className="mt-8">
            <OrderVisualTimeline order={order} />
          </div>

        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Purchased Items List (Cols 1-8) */}
          <div className="md:col-span-8 space-y-6">
            <div className="bg-white border border-[#e8e2d9] p-6">
              <h3 className="font-serif text-lg text-[#1e1c1a] mb-4 pb-3 border-b border-[#f0ece6]">
                Purchased Boutique Items ({order.items.length})
              </h3>

              <div className="divide-y divide-[#f0ece6]">
                {order.items.map((item) => (
                  <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex items-center space-x-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover bg-[#f4eee6] border border-[#e8e2d9] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-mono text-[#96422d] uppercase">
                        SKU: {item.product.sku} • {item.product.brand}
                      </div>
                      <h4 className="text-xs font-medium text-[#1e1c1a] truncate">{item.product.name}</h4>
                      {item.selectedVariant && (
                        <div className="text-[11px] text-[#736e65]">Option: {item.selectedVariant}</div>
                      )}
                      <div className="text-[11px] font-mono text-[#736e65] mt-1">
                        Weight: {item.product.weightKg}kg • Qty: {item.quantity} × Rp {item.product.priceIdr.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xs font-semibold text-[#1e1c1a]">
                        Rp {(item.product.priceIdr * item.quantity).toLocaleString('id-ID')}
                      </div>
                      <div className="text-[10px] font-mono text-[#2d6a4f] mt-1">
                        ✓ In Stock
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Boutique Receipt Guarantee */}
              <div className="mt-6 pt-4 border-t border-[#f0ece6] flex items-center space-x-3 text-xs text-[#736e65]">
                <FileText className="w-4 h-4 text-[#96422d] shrink-0" />
                <span>
                  Struk fisik asli dari store / flagship boutique resmi di China disertakan dengan aman di dalam paket Anda saat pengiriman lokal.
                </span>
              </div>
            </div>

            {/* Courier & Tracking Details */}
            <div className="bg-white border border-[#e8e2d9] p-6 space-y-4">
              <h3 className="font-serif text-lg text-[#1e1c1a] pb-2 border-b border-[#f0ece6]">
                Domestic Delivery Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-[10px] font-mono uppercase text-[#736e65] mb-1">Recipient & Address</div>
                  <div className="font-medium text-[#1e1c1a]">{order.shippingAddress.recipientName}</div>
                  <div className="text-[#736e65]">{order.shippingAddress.phone}</div>
                  <div className="text-[#736e65] mt-1 leading-relaxed">
                    {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase text-[#736e65] mb-1">Courier Service</div>
                  <div className="font-medium text-[#1e1c1a] uppercase">{order.courier}</div>
                  <div className="text-[#736e65] mt-1">
                    Airway Bill / Tracking: <span className="font-mono text-[#1e1c1a] font-medium">{order.trackingNumber || 'Generated upon Jakarta arrival'}</span>
                  </div>
                  {order.sourcingNotes && (
                    <div className="text-[#736e65] mt-2 italic bg-[#faf8f5] p-2 border border-[#e8e2d9]">
                      Note: "{order.sourcingNotes}"
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Payment & Concierge Box (Cols 9-12) */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Financial Ledger */}
            <div className="bg-white border border-[#e8e2d9] p-6 space-y-3 text-xs">
              <h3 className="font-serif text-lg text-[#1e1c1a] pb-2 border-b border-[#f0ece6]">
                Payment Ledger
              </h3>

              <div className="flex justify-between text-[#736e65]">
                <span>Items Subtotal</span>
                <span className="font-mono text-[#1e1c1a]">Rp {order.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-[#736e65]">
                <span>Domestic Delivery</span>
                <span className="font-mono text-[#1e1c1a]">
                  {order.shippingFee === 0 ? 'Free' : `Rp ${order.shippingFee.toLocaleString('id-ID')}`}
                </span>
              </div>
              <div className="flex justify-between text-[#736e65]">
                <span>Verification Code</span>
                <span className="font-mono text-[#96422d]">+Rp {order.uniqueCode}</span>
              </div>
              <div className="flex justify-between text-[#736e65]">
                <span>Channel</span>
                <span className="font-mono uppercase text-[#1e1c1a]">{order.paymentMethod}</span>
              </div>

              <div className="pt-2 border-t border-[#f0ece6] flex justify-between font-mono font-medium text-sm text-[#1e1c1a]">
                <span>Total Settled</span>
                <span>Rp {order.totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Direct WhatsApp Concierge Help */}
            <div className="p-4 bg-[#f4eee6] border border-[#e8e2d9] text-xs">
              <div className="font-serif text-sm text-[#1e1c1a] mb-1">Direct Shopper Concierge</div>
              <p className="text-[11px] text-[#736e65] mb-3 leading-relaxed">
                Ingin titip request barang tambahan atau cek space koper saat Mikael Aria berada di China? Hubungi langsung via WhatsApp.
              </p>
              <a
                href={`https://wa.me/6281234567890?text=Halo%20Mikael,%20saya%20ingin%20menanyakan%20order%20${order.id}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center py-2.5 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#333] transition-colors"
              >
                Chat WhatsApp (+62 812-3456-7890)
              </a>
            </div>

            <button
              onClick={() => setIsInvoiceOpen(true)}
              className="w-full py-2.5 bg-emerald-800 text-white text-xs font-mono uppercase tracking-widest hover:bg-emerald-900 transition-colors flex items-center justify-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              <span>Lihat Invoice Resmi Web</span>
            </button>

            <button
              onClick={() => navigate('shop')}
              className="w-full py-2.5 border border-[#1e1c1a] text-[#1e1c1a] text-xs font-mono uppercase tracking-widest hover:bg-[#faf8f5] transition-colors"
            >
              Lanjut Belanja Katalog
            </button>

          </div>

        </div>

      </div>

      {/* In-Web Digital Invoice Modal */}
      <InvoiceModal
        order={order}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        storeSettings={storeSettings}
      />
    </div>
  );
};
