import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Copy, Check, Upload, Clock, AlertTriangle, ShieldCheck, ExternalLink, QrCode } from 'lucide-react';

export const PaymentInstructionsPage: React.FC = () => {
  const { selectedOrderId, orders, storeSettings, payments, addToast, navigate } = useApp();
  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [proofImage, setProofImage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [senderBankName, setSenderBankName] = useState('BCA');
  const [senderAccountName, setSenderAccountName] = useState('');
  const [isProofSubmitted, setIsProofSubmitted] = useState(order?.paymentStatus === 'Verification' || order?.paymentStatus === 'Paid');

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#faf8f5] px-4">
        <h2 className="font-serif text-2xl text-[#1e1c1a] mb-2">Order Not Found</h2>
        <p className="text-sm text-[#736e65] mb-6">We could not locate the details for this transaction.</p>
        <button
          onClick={() => navigate('shop')}
          className="px-6 py-2.5 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-widest"
        >
          Return to Atelier Boutique
        </button>
      </div>
    );
  }

  const selectedBank =
    order.paymentMethod === 'BNI'
      ? { name: 'Bank Negara Indonesia (BNI)', code: 'BNI', acc: storeSettings.bniAccount.accountNumber, holder: storeSettings.bniAccount.accountHolder }
      : order.paymentMethod === 'CIMB'
      ? { name: 'CIMB Niaga', code: 'CIMB', acc: storeSettings.cimbAccount.accountNumber, holder: storeSettings.cimbAccount.accountHolder }
      : { name: 'Bank Central Asia (BCA)', code: 'BCA', acc: storeSettings.bcaAccount.accountNumber, holder: storeSettings.bcaAccount.accountHolder };

  const handleCopy = (text: string, type: 'amount' | 'account') => {
    navigator.clipboard.writeText(text);
    if (type === 'amount') {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
      addToast('Exact payable amount copied to clipboard', 'info');
    } else {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
      addToast('Bank account number copied', 'info');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
        addToast('Receipt slip attached successfully', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofImage) {
      addToast('Please attach your transfer screenshot or receipt', 'error');
      return;
    }

    setIsProofSubmitted(true);
    addToast('Bukti transfer terkirim! Mikael Aria akan segera memverifikasi pesanan Anda.', 'success');
  };

  return (
    <div className="bg-[#fbf9f8] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Alert */}
        <div className="border border-[#e8e2d9] bg-white p-6 sm:p-8 mb-8 text-center shadow-xs">
          <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#96422d] bg-[#f4eee6] px-3 py-1 mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>Awaiting Payment • 24-Hour Hold</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#1e1c1a] mb-2">
            Payment Instructions
          </h1>
          <p className="text-xs text-[#736e65] max-w-lg mx-auto">
            Order <span className="font-mono text-[#1e1c1a] font-medium">{order.id}</span> has been logged. Please complete your transfer to secure your personal luggage quota.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Main Payment Card (Cols 1-7) */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Amount Box */}
            <div className="bg-white border-2 border-[#1e1c1a] p-6">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#736e65] mb-1">
                Total Payable Amount
              </div>
              
              <div className="flex items-baseline justify-between mb-2">
                <div className="font-mono text-3xl font-bold text-[#1e1c1a] tracking-tight">
                  Rp {order.totalAmount.toLocaleString('id-ID')}
                </div>
                <button
                  onClick={() => handleCopy(order.totalAmount.toString(), 'amount')}
                  className="inline-flex items-center text-xs font-mono px-3 py-1.5 border border-[#1e1c1a] hover:bg-[#1e1c1a] hover:text-white transition-colors"
                >
                  {copiedAmount ? <Check className="w-3.5 h-3.5 mr-1 text-[#2d6a4f]" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copiedAmount ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Anti-collision breakdown explanation */}
              <div className="bg-[#f9f6f0] p-3 border border-[#e8e2d9] text-xs space-y-1">
                <div className="flex items-center text-[#96422d] font-mono font-medium text-[11px]">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Exact 3-digit Code: +Rp {order.uniqueCode}
                </div>
                <p className="text-[#736e65] text-[11px] leading-relaxed">
                  Harap transfer dengan <strong>jumlah persis hingga 3 digit terakhir</strong>. Kode unik ini membantu Mikael Aria memverifikasi mutasi bank otomatis untuk pesanan koper Anda.
                </p>
              </div>
            </div>

            {/* If QRIS */}
            {order.paymentMethod === 'QRIS' ? (
              <div className="bg-white border border-[#e8e2d9] p-6 text-center space-y-4">
                <div className="inline-flex items-center text-xs font-mono uppercase text-[#736e65]">
                  <QrCode className="w-4 h-4 mr-1 text-[#96422d]" />
                  QRIS National Standard
                </div>
                <h3 className="font-serif text-lg text-[#1e1c1a]">Scan to Pay via Banking / e-Wallet</h3>

                {/* QR Display */}
                <div className="inline-block p-4 border border-[#e8e2d9] bg-white shadow-xs">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=00020101021226680016ID.CO.QRIS.WWW01189360099900000000005204581253033605802ID5914ATELIER+JASTIP6007JAKARTA62070703A016304"
                    alt="Atelier Jastip QRIS"
                    className="w-48 h-48 mx-auto"
                  />
                  <div className="text-[10px] font-mono text-[#736e65] mt-2">
                    NMID: {storeSettings.qrisConfig.nmid} • {storeSettings.qrisConfig.merchantName}
                  </div>
                </div>

                <p className="text-xs text-[#736e65]">
                  Open BCA Mobile, GoPay, OVO, ShopeePay, Livin by Mandiri, or Dana and scan the code above.
                </p>
              </div>
            ) : (
              /* Bank Transfer Details */
              <div className="bg-white border border-[#e8e2d9] p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#f0ece6]">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#96422d]">Designated Destination</span>
                    <h3 className="font-serif text-lg text-[#1e1c1a]">{selectedBank.name}</h3>
                  </div>
                  <span className="text-xs font-mono font-medium px-2.5 py-1 bg-[#f4eee6] text-[#1e1c1a] border border-[#e8e2d9]">
                    {selectedBank.code}
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="text-[#736e65] mb-1 font-mono uppercase text-[10px]">Account Number</div>
                    <div className="flex items-center justify-between bg-[#fbf9f8] p-3 border border-[#e8e2d9]">
                      <span className="font-mono text-base font-semibold text-[#1e1c1a] tracking-wider">
                        {selectedBank.acc}
                      </span>
                      <button
                        onClick={() => handleCopy(selectedBank.acc, 'account')}
                        className="inline-flex items-center text-xs font-mono px-3 py-1 bg-white border border-[#d4cbbf] hover:bg-[#1e1c1a] hover:text-white transition-colors"
                      >
                        {copiedAccount ? <Check className="w-3 h-3 mr-1 text-[#2d6a4f]" /> : <Copy className="w-3 h-3 mr-1" />}
                        {copiedAccount ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-[#736e65] mb-1 font-mono uppercase text-[10px]">Account Holder Name</div>
                    <div className="bg-[#fbf9f8] p-3 border border-[#e8e2d9] font-medium text-[#1e1c1a]">
                      {selectedBank.holder}
                    </div>
                  </div>

                  <div>
                    <div className="text-[#736e65] mb-1 font-mono uppercase text-[10px]">Payment Reference / Berita Transfer</div>
                    <div className="bg-[#fbf9f8] p-3 border border-[#e8e2d9] font-mono text-[#1e1c1a]">
                      {order.id}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Proof of Payment Upload Card */}
            <div className="bg-white border border-[#e8e2d9] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#96422d]">Verification Step</span>
                  <h3 className="font-serif text-lg text-[#1e1c1a]">Submit Transfer Receipt</h3>
                </div>
                {order.paymentStatus === 'Paid' && (
                  <span className="text-xs font-mono bg-[#d8f3dc] text-[#1b4332] px-2.5 py-1 border border-[#b7e4c7]">
                    ✓ Payment Verified
                  </span>
                )}
                {(order.paymentStatus === 'Verification' || isProofSubmitted) && order.paymentStatus !== 'Paid' && (
                  <span className="text-xs font-mono bg-[#fefae0] text-[#78590c] px-2.5 py-1 border border-[#f5ee9e]">
                    ⏳ Under Manual Audit
                  </span>
                )}
              </div>

              {order.paymentStatus === 'Paid' ? (
                <div className="bg-[#f7fdf9] border border-[#d8f3dc] p-4 text-xs space-y-2">
                  <div className="flex items-center text-[#2d6a4f] font-mono font-medium">
                    <ShieldCheck className="w-4 h-4 mr-1.5" />
                    Pembayaran Diverifikasi oleh Mikael Aria
                  </div>
                  <p className="text-[#52796f] leading-relaxed">
                    Alokasi belanja Anda telah diamankan di manifest resmi sourcing China Mikael Aria.
                  </p>
                  <button
                    onClick={() => navigate('order-confirmation', { orderId: order.id })}
                    className="inline-flex items-center text-xs font-mono uppercase text-[#1e1c1a] font-medium underline underline-offset-4 mt-2"
                  >
                    Track Concierge Fulfillment Status →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitProof} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[#736e65] font-mono uppercase text-[10px] mb-1">
                        Your Bank / Provider
                      </label>
                      <input
                        type="text"
                        value={senderBankName}
                        onChange={(e) => setSenderBankName(e.target.value)}
                        placeholder="e.g. BCA, Mandiri, GoPay"
                        className="w-full px-3 py-2 border border-[#d4cbbf] text-xs focus:outline-none focus:border-[#1e1c1a]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#736e65] font-mono uppercase text-[10px] mb-1">
                        Sender Account Name
                      </label>
                      <input
                        type="text"
                        value={senderAccountName}
                        onChange={(e) => setSenderAccountName(e.target.value)}
                        placeholder="e.g. Amanda Putri"
                        className="w-full px-3 py-2 border border-[#d4cbbf] text-xs focus:outline-none focus:border-[#1e1c1a]"
                      />
                    </div>
                  </div>

                  {/* Upload Dropzone */}
                  <div className="border-2 border-dashed border-[#d4cbbf] p-6 text-center hover:border-[#1e1c1a] transition-colors relative bg-[#fdfbf7]">
                    {proofImage ? (
                      <div className="space-y-3">
                        <img
                          src={proofImage}
                          alt="Transfer proof preview"
                          className="max-h-48 mx-auto object-contain border border-[#e8e2d9]"
                        />
                        <div className="text-xs text-[#2d6a4f] font-mono">
                          ✓ Transfer screenshot attached
                        </div>
                        <button
                          type="button"
                          onClick={() => setProofImage('')}
                          className="text-xs text-[#96422d] underline font-mono"
                        >
                          Replace Screenshot
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="w-8 h-8 mx-auto text-[#a8a196]" />
                        <div className="text-xs text-[#1e1c1a] font-medium">
                          Upload Mobile Banking Screenshot or ATM Slip
                        </div>
                        <p className="text-[11px] text-[#736e65]">
                          PNG, JPG, or WEBP up to 5MB
                        </p>
                        
                        <div className="flex items-center justify-center pt-2">
                          <label className="cursor-pointer px-5 py-2.5 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#333] transition-colors rounded-xs shadow-xs">
                            <span>Pilih Foto / Screenshot Bukti</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full py-3 bg-[#96422d] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#7e3624] transition-colors"
                  >
                    Konfirmasi & Kirim Bukti Transfer →
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Right Summary Sidebar (Cols 8-12) */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Booking Snapshot */}
            <div className="bg-white border border-[#e8e2d9] p-6 space-y-4">
              <h3 className="font-serif text-lg text-[#1e1c1a] pb-2 border-b border-[#f0ece6]">
                Order Breakdown
              </h3>

              <div className="text-xs space-y-2.5">
                <div className="flex justify-between text-[#736e65]">
                  <span>Order Identifier</span>
                  <span className="font-mono text-[#1e1c1a]">{order.id}</span>
                </div>
                <div className="flex justify-between text-[#736e65]">
                  <span>Sourcing Itinerary</span>
                  <span className="font-mono text-[#96422d]">China Guangzhou & Shanghai Batch 01</span>
                </div>
                <div className="flex justify-between text-[#736e65]">
                  <span>Items Subtotal</span>
                  <span className="font-mono text-[#1e1c1a]">Rp {order.subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-[#736e65]">
                  <span>Domestic Courier</span>
                  <span className="font-mono text-[#1e1c1a]">
                    {order.shippingFee === 0 ? 'Free' : `Rp ${order.shippingFee.toLocaleString('id-ID')}`}
                  </span>
                </div>
                <div className="flex justify-between text-[#736e65]">
                  <span>Verification Code</span>
                  <span className="font-mono text-[#96422d] font-bold">+Rp {order.uniqueCode}</span>
                </div>
                <div className="pt-2 border-t border-[#f0ece6] flex justify-between font-mono font-medium text-sm text-[#1e1c1a]">
                  <span>Grand Total</span>
                  <span>Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Items List Preview */}
              <div className="pt-3 border-t border-[#f0ece6] space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#736e65]">
                  Reserved Luggage Items ({order.items.length})
                </div>
                {order.items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3 text-xs">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-10 h-10 object-cover bg-[#f4eee6] border border-[#e8e2d9]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[#1e1c1a] font-medium truncate">{item.product.name}</div>
                      <div className="text-[10px] text-[#736e65]">Qty: {item.quantity} {item.selectedVariant && `• ${item.selectedVariant}`}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('order-confirmation', { orderId: order.id })}
                className="w-full py-3 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#333] transition-colors"
              >
                View Detailed Order Status & Progress →
              </button>
              
              <button
                onClick={() => navigate('shop')}
                className="w-full py-2.5 border border-[#e8e2d9] text-[#736e65] text-xs font-mono uppercase tracking-widest hover:text-[#1e1c1a] hover:border-[#1e1c1a] bg-white transition-colors"
              >
                Return to Shop Catalog
              </button>
            </div>

            {/* Direct WhatsApp Concierge Help */}
            <div className="p-4 bg-[#f4eee6] border border-[#e8e2d9] text-xs">
              <div className="font-medium text-[#1e1c1a] mb-1">Sudah transfer tapi belum berubah?</div>
              <p className="text-[11px] text-[#736e65] mb-3 leading-relaxed">
                Anda dapat meneruskan bukti transfer langsung ke Mikael Aria via WhatsApp beserta ID Pesanan untuk rekonsiliasi kilat.
              </p>
              <a
                href={`https://wa.me/6281234567890?text=Halo%20Mikael,%20saya%20sudah%20bayar%20order%20${order.id}%20sebesar%20Rp%20${order.totalAmount.toLocaleString('id-ID')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-xs font-mono text-[#96422d] font-semibold hover:underline"
              >
                Kirim Bukti ke WhatsApp (+62 812-3456-7890) <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
