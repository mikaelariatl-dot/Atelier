import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    navigate,
    currentUser,
    openAuthModal,
    storeSettings,
    addToast,
  } = useApp();

  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  const subtotal = cart.reduce((acc, item) => acc + item.product.priceIdr * item.quantity, 0);
  const totalWeight = Number(
    cart.reduce((acc, item) => acc + item.product.weightKg * item.quantity, 0).toFixed(2)
  );
  const isFreeShipping = subtotal >= storeSettings.shippingRules.freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : storeSettings.shippingRules.standardFee;
  const finalTotal = Math.max(0, subtotal - discountAmount) + shippingFee;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'TOKYO2025' || promoCode.trim().toUpperCase() === 'VIP') {
      const disc = 150000;
      setDiscountAmount(disc);
      addToast(`Promo code applied! Enjoy -${formatRupiah(disc)} VIP deduction.`);
    } else {
      addToast('Invalid promo code. Try "TOKYO2025".', 'error');
    }
  };

  const handleProceed = () => {
    if (!currentUser) {
      openAuthModal('login', () => navigate('checkout'));
    } else if (!currentUser.isEmailVerified) {
      openAuthModal('verify', () => navigate('checkout'));
    } else {
      navigate('checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center">
        <div className="w-20 h-20 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#747878] mx-auto mb-6">
          <span className="material-symbols-outlined text-[40px]">shopping_bag</span>
        </div>
        <h1 className="font-serif text-3xl font-medium text-[#1b1c1c] mb-3">Your pre-order cart is empty</h1>
        <p className="text-sm text-[#444748] max-w-md mx-auto mb-8">
          You haven't reserved any luggage slots yet. Browse active Tokyo and Paris drops before pre-orders close.
        </p>
        <button
          onClick={() => navigate('shop')}
          className="px-8 py-3.5 rounded-full bg-[#1b1c1c] text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm"
        >
          Explore Catalog Drops
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-12 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#625e56] mb-6">
        <button onClick={() => navigate('home')} className="hover:text-[#1b1c1c]">Home</button>
        <span>/</span>
        <span className="text-[#1b1c1c] font-semibold">Shopping Cart</span>
      </nav>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-8 mb-8 border-b border-[#e6dfd5] gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#c06e4c]">Flight Luggage Allocation</span>
          <h1 className="font-serif text-3xl md:text-4xl text-[#1b1c1c] mt-1">Review Pre-Order Cart</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#625e56] bg-[#f5f3f3] px-3.5 py-2 rounded-lg">
          <span className="material-symbols-outlined text-[16px] text-[#2a5a44]">luggage</span>
          <span>Combined Weight: <strong className="text-[#1b1c1c]">{totalWeight} kg</strong></span>
          <span>·</span>
          <span>Tokyo Spring Batch 04</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart items table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-[#e6dfd5] overflow-hidden shadow-sm">
            <div className="hidden sm:grid grid-cols-12 px-6 py-3.5 bg-[#f5f3f3]/70 text-[11px] font-bold uppercase tracking-wider text-[#625e56] border-b border-[#e6dfd5]">
              <div className="col-span-6">Curated Item</div>
              <div className="col-span-2 text-center">Unit Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>

            <div className="divide-y divide-[#e6dfd5]">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.selectedVariant || ''}`} className="p-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-6 flex items-center gap-4 w-full">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-20 rounded-lg object-cover bg-[#f5f3f3] shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#625e56]">
                        {item.product.brand} · {item.product.sku}
                      </span>
                      <h3
                        onClick={() => navigate('product-detail', { productId: item.productId })}
                        className="text-sm font-semibold text-[#1b1c1c] hover:underline cursor-pointer truncate"
                      >
                        {item.product.name}
                      </h3>
                      {item.selectedVariant && (
                        <p className="text-xs text-[#747878] mt-0.5">{item.selectedVariant}</p>
                      )}
                      <span className="text-[11px] text-[#747878] block mt-1">
                        Weight: {item.product.weightKg} kg/unit
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-2 text-center text-xs font-semibold text-[#1b1c1c]">
                    {formatRupiah(item.product.priceIdr)}
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-center gap-2">
                    <div className="flex items-center border border-[#e6dfd5] rounded-full bg-[#fbf9f8] px-2.5 py-1">
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        className="text-xs text-[#1b1c1c] hover:opacity-70 px-1 font-bold"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        className="text-xs text-[#1b1c1c] hover:opacity-70 px-1 font-bold"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-[#747878] hover:text-[#ba1a1a] transition-colors p-1"
                      title="Remove"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>

                  <div className="sm:col-span-2 text-right text-sm font-bold text-[#1b1c1c] w-full sm:w-auto">
                    {formatRupiah(item.product.priceIdr * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => navigate('shop')}
              className="text-xs font-semibold text-[#625e56] hover:text-[#1b1c1c] flex items-center gap-1.5 uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-[#e6dfd5] p-6 shadow-sm space-y-5">
            <h2 className="font-serif text-lg font-semibold text-[#1b1c1c] pb-3 border-b border-[#e6dfd5]">
              Order Summary
            </h2>

            {/* Free shipping progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#625e56]">Free Domestic Delivery</span>
                <span className="font-semibold text-[#1b1c1c]">
                  {isFreeShipping ? 'Unlocked!' : `Add ${formatRupiah(storeSettings.shippingRules.freeShippingThreshold - subtotal)} more`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#f5f3f3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1b1c1c] rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (subtotal / storeSettings.shippingRules.freeShippingThreshold) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-[#625e56]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-medium text-[#1b1c1c]">{formatRupiah(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#2a5a44]">
                  <span>VIP Promo Discount</span>
                  <span>-{formatRupiah(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Courier (Java Hub)</span>
                <span className="font-medium text-[#1b1c1c]">
                  {isFreeShipping ? <span className="text-[#2a5a44]">Rp 0 (Free)</span> : formatRupiah(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Import Duties & Bea Cukai</span>
                <span className="text-[#2a5a44] font-medium">Included (100% Cleared)</span>
              </div>

              <div className="pt-3 border-t border-[#e6dfd5] flex justify-between items-baseline text-base">
                <span className="font-bold text-[#1b1c1c]">Total Amount Due</span>
                <span className="font-bold text-lg text-[#1b1c1c]">{formatRupiah(finalTotal)}</span>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="pt-2 flex gap-2">
              <input
                type="text"
                placeholder="Promo Code (e.g. TOKYO2025)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 text-xs border border-[#e6dfd5] rounded-lg px-3 py-2 bg-[#fbf9f8] focus:outline-none uppercase"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#eae8e7] hover:bg-[#e9e2d7] text-xs font-semibold text-[#1b1c1c] rounded-lg uppercase tracking-wider transition-colors"
              >
                Apply
              </button>
            </form>

            <button
              onClick={handleProceed}
              className="w-full h-12 rounded-full bg-[#1b1c1c] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <span>Proceed to Step-by-Step Checkout</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>

            <div className="text-[11px] text-[#747878] space-y-1 pt-2 text-center">
              <p>✓ 100% Authentic In-Store Physical Receipt Included</p>
              <p>✓ Hand-Carried Passenger Luggage Security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
