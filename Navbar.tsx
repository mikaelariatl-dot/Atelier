import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    currentScreen,
    navigate,
    cart,
    currentUser,
    isOwnerLoggedIn,
    logoutOwner,
    logoutBuyer,
    openAuthModal,
    setIsCartDrawerOpen,
    setIsSearchModalOpen,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartAmount = cart.reduce((acc, item) => acc + item.product.priceIdr * item.quantity, 0);

  const formatRupiah = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-[#fbf9f8]/95 backdrop-blur-md border-b border-[#e6dfd5]">
      {/* Top Operational Status Ribbon */}
      <div className="bg-[#eae8e7] text-[#1b1c1c] text-xs px-4 lg:px-12 py-2 flex items-center justify-between border-b border-[#e6dfd5]/40">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="material-symbols-outlined text-[#625e56] text-[15px]">flight_takeoff</span>
          <span className="tracking-wide text-[#625e56]">
            <strong className="text-[#1b1c1c] font-semibold">Guangzhou & Shanghai Batch 01:</strong> Pre-orders dibuka · Pengiriman langsung hand-carry · Bebas Ongkir se-Indonesia
          </span>
        </div>
        <div className="flex items-center gap-5 shrink-0 text-xs">
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[#625e56] hover:text-[#1b1c1c] transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">chat</span>
            <span className="hidden sm:inline">WhatsApp Concierge (+62 812-3456-7890)</span>
          </a>
          <div className="hidden sm:flex items-center gap-1 text-[#625e56] pl-3 border-l border-[#c4c7c7]/50 font-medium">
            <span>IDR (Rp)</span>
          </div>
          <div className="flex items-center gap-1 text-[#2d6a4f] text-[11px] font-semibold pl-3 border-l border-[#c4c7c7]/50">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            <span className="hidden sm:inline">100% Original Guarantees</span>
          </div>
        </div>
      </div>

      {/* Main 3-Zone Navigation Bar */}
      <div className="max-w-7xl mx-auto h-20 px-4 lg:px-12 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => navigate('home')}
          className="flex flex-col text-left group shrink-0 focus:outline-none"
        >
          <span className="font-serif text-2xl tracking-tight uppercase text-[#1b1c1c] group-hover:text-[#625e56] transition-colors font-medium">
            Atelier Jastip
          </span>
          <span className="text-[10px] tracking-widest uppercase text-[#625e56]">
            Curated Sourcing · 100% China Direct · Pop Mart & Douyin Viral
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#625e56]">
          <button
            onClick={() => navigate('home')}
            className={`transition-colors hover:text-[#1b1c1c] ${
              currentScreen === 'home' ? 'text-[#1b1c1c] border-b border-[#1b1c1c] pb-0.5' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigate('shop')}
            className={`transition-colors hover:text-[#1b1c1c] ${
              currentScreen === 'shop' || currentScreen === 'product-detail' ? 'text-[#1b1c1c] border-b border-[#1b1c1c] pb-0.5' : ''
            }`}
          >
            Semua Produk
          </button>
          <button
            onClick={() => {
              navigate('shop');
              window.dispatchEvent(new CustomEvent('select-category', { detail: 'Barang Viral China' }));
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full hover:bg-amber-100 transition-colors"
          >
            <span className="text-sm">🔥</span>
            <span>Barang Viral China</span>
          </button>
          <button
            onClick={() => {
              navigate('home');
              setTimeout(() => {
                const el = document.getElementById('upcoming-trips-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="transition-colors hover:text-[#1b1c1c]"
          >
            Jadwal Rute
          </button>
          <button
            onClick={() => {
              navigate('home');
              setTimeout(() => {
                const el = document.getElementById('how-it-works-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="transition-colors hover:text-[#1b1c1c]"
          >
            Cara Belanja
          </button>
          <button
            onClick={() => {
              if (currentUser) {
                navigate('buyer-orders');
              } else {
                openAuthModal('login', () => navigate('buyer-orders'));
              }
            }}
            className="transition-colors hover:text-[#1b1c1c]"
          >
            Lacak Pesanan
          </button>
        </nav>

        {/* Zone 3: Interactive Affordances */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            aria-label="Search items"
            className="w-9 h-9 flex items-center justify-center text-[#444748] hover:text-[#1b1c1c] rounded-full hover:bg-[#eae8e7] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => {
              if (currentUser) {
                navigate('buyer-wishlist');
              } else {
                openAuthModal('login', () => navigate('buyer-wishlist'));
              }
            }}
            aria-label="Wishlist"
            className="relative w-9 h-9 flex items-center justify-center text-[#444748] hover:text-[#1b1c1c] rounded-full hover:bg-[#eae8e7] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">favorite</span>
            {currentUser && currentUser.wishlistProductIds.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#c06e4c]" />
            )}
          </button>

          {/* Cart Button with Count and Amount */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#eae8e7] hover:bg-[#e9e2d7] text-[#1b1c1c] transition-colors font-medium text-xs"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            <span className="hidden sm:inline">
              Cart ({totalCartCount}) · {formatRupiah(totalCartAmount)}
            </span>
            <span className="sm:hidden font-bold">{totalCartCount}</span>
          </button>

          {/* Account Profile / Login Button */}
          <div className="relative">
            {isOwnerLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('owner-overview')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1c1c] text-amber-300 border border-amber-500/40 rounded-full text-xs font-mono font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
                  title="Masuk ke Owner Suite"
                >
                  <span className="text-sm">👑</span>
                  <span className="hidden sm:inline">Owner Suite</span>
                </button>
                <button
                  onClick={logoutOwner}
                  className="w-8 h-8 rounded-full border border-[#d4cbbf] text-[#ba1a1a] hover:bg-red-50 flex items-center justify-center transition-colors"
                  title="Logout Owner"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                </button>
              </div>
            ) : currentUser ? (
              <div>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-8 h-8 rounded-full bg-[#1b1c1c] text-white flex items-center justify-center text-xs font-semibold focus:outline-none"
                  title={currentUser.fullName}
                >
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#e6dfd5] py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#e6dfd5]/60">
                      <p className="text-sm font-semibold text-[#1b1c1c] truncate">{currentUser.fullName}</p>
                      <p className="text-xs text-[#747878] truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold text-[#2a5a44] bg-[#2a5a44]/10 px-2 py-0.5 rounded-full">
                        {currentUser.tier}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('buyer-dashboard');
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-[#1b1c1c] hover:bg-[#f5f3f3] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#625e56]">person</span>
                      My Profile & Addresses
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('buyer-orders');
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-[#1b1c1c] hover:bg-[#f5f3f3] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#625e56]">package_2</span>
                      Order History & Tracking
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('buyer-wishlist');
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-[#1b1c1c] hover:bg-[#f5f3f3] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#625e56]">favorite</span>
                      Saved Wishlist
                    </button>
                    <div className="border-t border-[#e6dfd5]/60 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logoutBuyer();
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-[#ba1a1a] hover:bg-red-50 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[16px]">logout</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('login')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1b1c1c] text-white hover:bg-neutral-800 transition-colors font-medium text-xs shadow-xs"
                title="Masuk Akun"
              >
                <span className="material-symbols-outlined text-[16px]">person</span>
                <span className="hidden sm:inline">Masuk</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
