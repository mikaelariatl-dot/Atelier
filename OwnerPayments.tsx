import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Check,
  FileText,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { PaymentRecord } from '../../types';

export const OwnerPayments: React.FC = () => {
  const { payments, orders, verifyPaymentSlip, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activePaymentId, setActivePaymentId] = useState<string>(payments[0]?.id || '');

  const filteredPayments = payments.filter((p) => {
    return (
      p.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.totalExpected.toString().includes(searchQuery)
    );
  });

  const activePayment = payments.find((p) => p.id === activePaymentId) || payments[0];
  const linkedOrder = activePayment ? orders.find((o) => o.id === activePayment.orderId) : null;

  const handleApprove = (paymentId: string) => {
    verifyPaymentSlip(paymentId, true);
  };

  const handleFlagDiscrepancy = (paymentId: string) => {
    verifyPaymentSlip(paymentId, false);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e8e2d9] gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#96422d]">Treasury & Mutasi</span>
          <h1 className="font-serif text-3xl text-[#1e1c1a] mt-0.5">Slip Reconciliation Desk</h1>
          <p className="text-xs text-[#736e65] mt-1">
            Matching customer bank transfer receipts and QRIS notifications with Mikael Aria Wicaksono's receiving accounts.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1.5 bg-[#f4eee6] border border-[#e8e2d9] text-[#96422d]">
            Pending Audit: {payments.filter((p) => p.status === 'Pending Review').length}
          </span>
          <span className="px-3 py-1.5 bg-[#d8f3dc] border border-[#b7e4c7] text-[#1b4332]">
            Verified: {payments.filter((p) => p.status === 'Verified').length}
          </span>
        </div>
      </div>

      {/* Main Reconciliation Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Payments Queue (Cols 1-6) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, Buyer, or Amount..."
              className="w-full text-xs pl-8 pr-3 py-2 border border-[#d4cbbf] bg-white focus:outline-none focus:border-[#1e1c1a]"
            />
            <Search className="w-4 h-4 text-[#a8a196] absolute left-2.5 top-2.5" />
          </div>

          <div className="bg-white border border-[#e8e2d9] divide-y divide-[#f0ece6] shadow-xs">
            {filteredPayments.length === 0 ? (
              <div className="p-8 text-center text-[#736e65] text-xs space-y-1">
                <FileText className="w-8 h-8 text-[#d4cbbf] mx-auto mb-2" />
                <p className="font-medium text-[#1e1c1a]">Belum Ada Bukti Transfer Masuk</p>
                <p className="text-[11px]">Toko siap menerima transaksi langsung dari rekening pembeli.</p>
              </div>
            ) : (
              filteredPayments.map((p) => {
                const isSelected = activePayment?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setActivePaymentId(p.id)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#fbf9f8] border-l-4 border-l-[#1e1c1a]' : 'hover:bg-[#faf8f5]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-semibold text-[#1e1c1a]">{p.orderId}</span>
                          <span className="text-[10px] font-mono uppercase bg-[#f4eee6] text-[#96422d] px-1.5">
                            Code: +Rp {p.uniqueDigits}
                          </span>
                        </div>
                        <div className="text-xs font-medium text-[#1e1c1a] mt-1">{p.customerName}</div>
                        <div className="text-[11px] text-[#736e65]">
                          Channel: <span className="font-mono uppercase">{p.method}</span> • {p.transactionDate}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono text-xs font-bold text-[#1e1c1a]">
                          Rp {p.totalExpected.toLocaleString('id-ID')}
                        </div>
                        <span
                          className={`inline-block mt-1 text-[9px] font-mono uppercase px-2 py-0.5 border ${
                            p.status === 'Verified'
                              ? 'bg-[#d8f3dc] text-[#1b4332] border-[#b7e4c7]'
                              : 'bg-[#fff3cd] text-[#856404] border-[#ffeeba]'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Active Slip Inspector (Cols 7-12) */}
        {activePayment ? (
          <div className="lg:col-span-6 bg-white border border-[#e8e2d9] p-6 shadow-xs space-y-6 sticky top-20">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece6]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#96422d]">Inspection Desk</span>
                <h3 className="font-serif text-xl text-[#1e1c1a]">Audit Slip: {activePayment.orderId}</h3>
              </div>
              <span className="font-mono text-xs font-bold text-[#1e1c1a]">
                Rp {activePayment.totalExpected.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Slip Preview Box */}
            <div className="border border-[#e8e2d9] bg-[#fbf9f8] p-4 text-center">
              {activePayment.proofSlipUrl ? (
                <div className="space-y-3">
                  <img
                    src={activePayment.proofSlipUrl}
                    alt="Receipt Slip"
                    className="max-h-64 mx-auto object-contain border border-[#d4cbbf] bg-white shadow-xs"
                  />
                  <div className="text-[11px] font-mono text-[#736e65]">
                    Received: {activePayment.transactionDate}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-[#a8a196] text-xs space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-[#d4cbbf]" />
                  <div>No receipt screenshot submitted by buyer yet.</div>
                </div>
              )}
            </div>

            {/* Automated Anti-Collision Reconciliation Checks */}
            <div className="bg-[#f7f5f2] p-4 border border-[#e8e2d9] space-y-2.5 text-xs">
              <div className="font-mono uppercase text-[10px] text-[#736e65] mb-1">
                OCR Reconciliation Match Criteria
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#59554d]">1. Designated Receiving Account:</span>
                <span className="font-mono text-[#2d6a4f] flex items-center font-medium">
                  <Check className="w-3.5 h-3.5 mr-1" /> {activePayment.ocrMatch?.destinationMatch ? 'Account Confirmed' : 'Mismatch'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#59554d]">2. Anti-Collision Unique Suffix:</span>
                <span className="font-mono text-[#2d6a4f] flex items-center font-medium">
                  <Check className="w-3.5 h-3.5 mr-1" /> +Rp {activePayment.uniqueDigits} Matched
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#59554d]">3. Total Amount Audit:</span>
                <span className="font-mono text-[#2d6a4f] flex items-center font-medium">
                  <Check className="w-3.5 h-3.5 mr-1" /> Exact Match (Rp {activePayment.totalExpected.toLocaleString('id-ID')})
                </span>
              </div>
            </div>

            {/* Reconciliation Decision Buttons */}
            <div className="space-y-3 pt-2">
              {activePayment.status === 'Pending Review' ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleApprove(activePayment.id)}
                    className="py-3 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#333] transition-colors flex items-center justify-center space-x-1"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    <span>Approve & Lock Quota</span>
                  </button>

                  <button
                    onClick={() => handleFlagDiscrepancy(activePayment.id)}
                    className="py-3 border border-[#d4cbbf] text-[#96422d] text-xs font-mono uppercase tracking-wider hover:bg-[#faf8f5] transition-colors flex items-center justify-center space-x-1"
                  >
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    <span>Reject / Flag</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-[#d8f3dc] border border-[#b7e4c7] text-[#1b4332] text-xs font-mono flex items-center justify-between">
                  <span className="flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-1.5" /> Settled in Sourcing Ledger
                  </span>
                  <span className="text-[10px]">Diverifikasi oleh Mikael Aria</span>
                </div>
              )}

              {linkedOrder && (
                <div className="text-[11px] text-[#736e65] pt-1">
                  Buyer: <strong className="text-[#1e1c1a]">{linkedOrder.customerName}</strong> ({linkedOrder.customerPhone}) • {linkedOrder.items.length} items reserved.
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="lg:col-span-6 bg-white border border-[#e8e2d9] p-12 text-center rounded-xl space-y-3">
            <div className="w-12 h-12 bg-[#faf8f5] border border-[#e8e2d9] text-[#736e65] rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6 text-[#2d6a4f]" />
            </div>
            <h3 className="font-serif text-lg text-[#1e1c1a]">Meja Rekonsiliasi Bersih</h3>
            <p className="text-xs text-[#736e65] max-w-sm mx-auto leading-relaxed">
              Tidak ada antrean bukti transfer yang perlu diverifikasi. Semua mutasi bank terdata rapi.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
