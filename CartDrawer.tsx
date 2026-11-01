import React from 'react';
import { useApp } from '../../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    navigate,
    currentUser,
    openAuthModal,
    storeSettings,
  } = useApp();

  if (!isCartDrawerOpen) return null;

  const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  const subtotal = cart.reduce((acc, item) => acc + item.product.priceIdr * item.quantity, 0);
  const totalWeight = Number(
    cart.reduce((acc, item) => acc + item.product.weightKg * item.quantity, 0).toFixed(2)
  );
  const isFreeShipping = subtotal >= storeSettings.shippingRules.freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : storeSettings.shippingRules.standardFee;
  const total = subtotal + shippingFee;

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    if (!currentUser) {
      openAuthModal('login', () => navigate('checkout'));
    } else if (!currentUser.isEmailVerified) {
      openAuthModal('verify', () => navigate('checkout'));
    } else {
      navigate('checkout');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in flex justify-end">
      <div className="w-full max-w-md h-full bg-[#fbf9f8] shadow-2xl flex flex-col justify-between border-l border-[#e6dfd5] animate-slide-left">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#e6dfd5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1b1c1c] text-[22px]">shopping_bag</span>
            <h2 className="font-serif text-lg font-semibold text-[#1b1c1c]">
              Pre-Order Cart ({cart.reduce((acc, it) => acc + it.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-[#eae8e7] flex items-center justify-center text-[#625e56]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#747878] mb-4">
                <span className="material-symbols-outlined text-[32px]">shopping_bag</span>
              </div>
              <h3 className="font-serif text-lg font-medium text-[#1b1c1c] mb-1">Your cart is empty</h3>
              <p className="text-xs text-[#747878] max-w-xs mb-6">
                Discover limited Japanese drops and reserve your passenger luggage allocation before batch closing.
              </p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('shop');
                }}
                className="px-6 py-2.5 rounded-full bg-[#1b1c1c] text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                Explore Active Catalog
              </button>
            </div>
          ) : (
            <>
              {/* Active Batch & Luggage Notice */}
              <div className="p-3.5 rounded-xl bg-[#e9e2d7]/50 border border-[#e6dfd5] flex items-start gap-3">
                <span className="material-symbols-outlined text-[#625e56] text-[20px] mt-0.5">
                  flight_takeoff
                </span>
                <div>
                  <p className="text-xs font-semibold text-[#1b1c1c]">Tokyo Batch 04 Allocation</p>
                  <p className="text-[11px] text-[#625e56]">
                    Items are hand-carried in passenger checked luggage. Combined luggage weight:{' '}
                    <strong className="text-[#1b1c1c]">{totalWeight} kg</strong>
                  </p>
                </div>
              </div>

              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedVariant || ''}`}
                  className="flex gap-4 p-4 rounded-xl bg-white border border-[#e6dfd5] shadow-sm relative group"
                >
                  <div className="w-20 h-24 rounded-lg bg-[#f5f3f3] overflow-hidden shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#625e56]">
                          {item.product.brand}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-[#747878] hover:text-[#ba1a1a] transition-colors"
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                      <h4 className="text-xs font-semibold text-[#1b1c1c] line-clamp-2 mt-0.5">
                        {item.product.name}
                      </h4>
                      {item.selectedVariant && (
                        <p className="text-[11px] text-[#747878] mt-0.5">{item.selectedVariant}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#e6dfd5] rounded-full bg-[#fbf9f8] px-2 py-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          className="text-xs text-[#1b1c1c] hover:opacity-70 px-1"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold px-2">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          className="text-xs text-[#1b1c1c] hover:opacity-70 px-1"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#1b1c1c]">
                        {formatRupiah(item.product.priceIdr * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-[#e6dfd5] bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-[#625e56]">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((acc, it) => acc + it.quantity, 0)} items)</span>
                <span className="font-semibold text-[#1b1c1c]">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Domestic Courier</span>
                <span className="font-semibold text-[#1b1c1c]">
                  {isFreeShipping ? <span className="text-[#2a5a44]">FREE (Promo)</span> : formatRupiah(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#e6dfd5] text-sm">
                <span className="font-bold text-[#1b1c1c]">Total Amount</span>
                <span className="font-bold text-base text-[#1b1c1c]">{formatRupiah(total)}</span>
              </div>
            </div>

            {!currentUser && (
              <p className="text-[11px] text-[#b88728] bg-[#b88728]/10 p-2 rounded-lg text-center font-medium">
                Buyer sign-in is required before checking out to bind customs manifest.
              </p>
            )}

            <button
              onClick={handleCheckoutClick}
              className="w-full h-11 rounded-full bg-[#1b1c1c] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <span>Proceed to Checkout</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>

            <button
              onClick={() => {
                setIsCartDrawerOpen(false);
                navigate('cart');
              }}
              className="w-full py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-[#625e56] hover:text-[#1b1c1c] transition-colors text-center"
            >
              View Full Cart Breakdown
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
