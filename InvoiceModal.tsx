import React from 'react';
import { Order, StoreSettings } from '../../types';
import { X, Printer, CheckCircle2, Clock, ShieldCheck, Download, Share2 } from 'lucide-react';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  storeSettings: StoreSettings;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  order,
  isOpen,
  onClose,
  storeSettings,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPaid = order.paymentStatus === 'Paid';
  const invoiceNumber = `INV/${order.createdAt.replace(/[^0-9]/g, '') || '20250325'}/${order.id}`;

  const getBankDetails = () => {
    if (order.paymentMethod === 'BNI') {
      return storeSettings.bniAccount;
    } else if (order.paymentMethod === 'CIMB') {
      return storeSettings.cimbAccount;
    }
    return storeSettings.bcaAccount;
  };

  const targetBank = getBankDetails();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="relative bg-white w-full max-w-2xl border border-[#e8e2d9] shadow-2xl p-6 sm:p-8 rounded-xl print:border-none print:shadow-none print:p-0">
        
        {/* Close and Action Bar (Hidden when printing) */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e8e2d9] mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase bg-[#f4eee6] text-[#96422d] px-2.5 py-1 font-semibold rounded">
              Digital In-Web Invoice
            </span>
            <span className="text-xs text-[#736e65]">Tersimpan di akun Anda</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1c1a] text-white text-xs font-mono uppercase rounded hover:bg-[#333] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Tutup"
              className="p-1.5 text-[#736e65] hover:text-[#1e1c1a] rounded hover:bg-[#f5f3f3]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE INVOICE CONTENT */}
        <div className="space-y-6 text-[#1b1c1c]">
          
          {/* Header Store & Invoice Meta */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#e6dfd5]">
            <div>
              <h2 className="font-serif text-2xl font-bold tracking-tight uppercase">
                Atelier Jastip
              </h2>
              <p className="text-xs text-[#625e56] mt-0.5 font-medium">
                Personal Sourcing & Curated Import Concierge
              </p>
              <div className="text-[11px] text-[#747878] mt-2 space-y-0.5">
                <p>Owner: <strong>{storeSettings.ownerName}</strong></p>
                <p>Email: {storeSettings.ownerEmail}</p>
                <p>WhatsApp: {storeSettings.ownerPhone}</p>
              </div>
            </div>

            <div className="sm:text-right">
              <div className="inline-block px-3 py-1 rounded font-mono text-xs font-bold uppercase mb-2 border ${
                isPaid ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'
              }">
                {isPaid ? '✓ LUNAS / SETTLED' : 'MENUNGGU VERIFIKASI PEMBAYARAN'}
              </div>
              <div className="font-mono text-xs text-[#747878]">
                No: <span className="font-bold text-[#1b1c1c]">{invoiceNumber}</span>
              </div>
              <div className="font-mono text-xs text-[#747878]">
                Tanggal: {order.createdAt}
              </div>
              <div className="font-mono text-xs text-[#747878]">
                ID Order: {order.id}
              </div>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#fbf9f8] p-4 rounded-lg border border-[#e8e2d9]">
            <div>
              <span className="font-mono text-[10px] uppercase text-[#736e65] font-bold block mb-1">
                Tujuan Pengiriman:
              </span>
              <p className="font-bold text-[#1b1c1c]">{order.shippingAddress.recipientName}</p>
              <p className="text-[#625e56]">{order.shippingAddress.phone}</p>
              <p className="text-[#625e56] mt-1 leading-relaxed">
                {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
              </p>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase text-[#736e65] font-bold block mb-1">
                Metode Pembayaran & Rekening:
              </span>
              <p className="font-bold text-[#1b1c1c]">
                {order.paymentMethod === 'QRIS' ? 'QRIS Nasional Real-Time' : `Transfer Bank ${order.paymentMethod}`}
              </p>
              {order.paymentMethod !== 'QRIS' && (
                <div className="mt-1 font-mono text-[11px] text-[#444748] space-y-0.5">
                  <p>Rekening: <strong className="text-[#1b1c1c]">{targetBank.accountNumber}</strong></p>
                  <p>A/N: <strong>{targetBank.accountHolder}</strong></p>
                </div>
              )}
              <div className="mt-2 text-[11px] text-[#625e56]">
                Kurir Domestik: <span className="font-bold text-[#1b1c1c] uppercase">{order.courier}</span>
                {order.trackingNumber && (
                  <span className="block font-mono">No. Resi: {order.trackingNumber}</span>
                )}
              </div>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1b1c1c] text-[#736e65] font-mono uppercase text-[10px]">
                  <th className="py-2.5 text-left font-semibold">Produk</th>
                  <th className="py-2.5 text-center font-semibold">Qty</th>
                  <th className="py-2.5 text-right font-semibold">Harga Satuan</th>
                  <th className="py-2.5 text-right font-semibold">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ece6]">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="py-3">
                    <td className="py-2.5 pr-2">
                      <div className="font-medium text-[#1b1c1c]">{item.product.name}</div>
                      <div className="text-[10px] text-[#747878] font-mono">
                        SKU: {item.product.sku} {item.selectedVariant ? `• Varian: ${item.selectedVariant}` : ''}
                      </div>
                    </td>
                    <td className="py-2.5 text-center font-mono font-medium">{item.quantity}</td>
                    <td className="py-2.5 text-right font-mono text-[#625e56]">
                      Rp {item.product.priceIdr.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 text-right font-mono font-semibold text-[#1b1c1c]">
                      Rp {(item.product.priceIdr * item.quantity).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cost Breakdown Ledger */}
          <div className="pt-3 border-t border-[#e6dfd5] flex flex-col items-end">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-[#747878]">
                <span>Total Belanja:</span>
                <span className="font-mono text-[#1b1c1c]">Rp {order.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-[#747878]">
                <span>Biaya Pengiriman:</span>
                <span className="font-mono text-[#1b1c1c]">
                  {order.shippingFee === 0 ? 'Bebas Ongkir (Rp 0)' : `Rp ${order.shippingFee.toLocaleString('id-ID')}`}
                </span>
              </div>
              <div className="flex justify-between text-[#747878]">
                <span>Kode Unik Verifikasi:</span>
                <span className="font-mono text-[#96422d]">+Rp {order.uniqueCode}</span>
              </div>
              <div className="pt-2 border-t border-[#1b1c1c] flex justify-between font-mono font-bold text-sm text-[#1b1c1c]">
                <span>Grand Total:</span>
                <span>Rp {order.totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Official Footer Guarantee */}
          <div className="p-3.5 bg-[#fdfbf7] border border-[#e8e2d9] rounded text-[11px] text-[#736e65] leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-[#1b1c1c] mb-1">
              <ShieldCheck className="w-4 h-4 text-[#2d6a4f]" />
              <span>Ketentuan Invoice Digital Web:</span>
            </div>
            Invoice ini diterbitkan secara otomatis dan sah melalui sistem website Atelier Jastip. Sesuai preferensi Anda, invoice tersimpan aman di akun web dan tidak dikirimkan ke email untuk kepraktisan. Anda dapat mencetak atau menyimpan dokumen ini kapan saja.
          </div>

        </div>

      </div>
    </div>
  );
};
