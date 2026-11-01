import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCategory } from '../../types';

export const HomePage: React.FC = () => {
  const { products, navigate, addToCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Countdown timer state for Tokyo cutoff
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 37,
    seconds: 49,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  const viralChinaProducts = products.filter((p) => p.category === 'Barang Viral China');

  const filteredProducts =
    selectedCategory === 'All'
      ? products.slice(0, 8)
      : products.filter((p) => p.category === selectedCategory || (selectedCategory.includes('Viral') && p.category === 'Barang Viral China')).slice(0, 8);

  return (
    <div className="flex flex-col w-full">
      {/* 1. ACTIVE TRIP HERO BANNER */}
      <section className="relative w-full px-4 lg:px-12 py-10 lg:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Status Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#e6dfd5]/60">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e9e2d7] text-[#1e1b15] text-[11px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1b1c1c] animate-pulse"></span>
                Kurator Siaga Langsung di China
              </span>
              <span className="text-[#625e56] text-[11px] font-bold tracking-widest uppercase">
                Flight Run #CAN-2501
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[#625e56] text-xs">
              <span className="material-symbols-outlined text-[16px]">pin_drop</span>
              <span>Guangzhou Tianhe · Shanghai Huaihai · Shenzhen Huaqiangbei</span>
            </div>
          </div>

          {/* Split Hero Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Editorial Left Column */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#625e56]">
                  <span className="w-8 h-[1px] bg-[#625e56]"></span>
                  <span>100% China Direct Personal Shopping</span>
                </div>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1b1c1c] tracking-tight font-normal leading-tight">
                  China Direct <span className="italic">Jastip Curation</span> 2025
                </h1>
                <p className="text-base text-[#444748] max-w-xl leading-relaxed">
                  Belanja barang viral China terhits, Pop Mart 100% original, C-Beauty, fashion Guangzhou, dan gadget Shenzhen hand-carried langsung ke pintu rumah Anda di Indonesia. Dilengkapi invoice digital otomatis langsung di dalam website!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('shop')}
                  className="px-7 py-3 rounded-full bg-[#1b1c1c] text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md flex items-center gap-2"
                >
                  <span>Jelajahi Katalog China</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
                <button
                  onClick={() => {
                    document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-7 py-3 rounded-full bg-[#eae8e7] text-[#1b1c1c] text-xs font-bold uppercase tracking-wider hover:bg-[#e9e2d7] transition-all"
                >
                  Cara Kerja Jastip
                </button>
              </div>

              {/* Proof Lines */}
              <div className="mt-8 flex items-center gap-6 pt-4 text-[#625e56] text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#1b1c1c]">inventory_2</span>
                  <span>Hand-Carry & Koper Khusus</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#1b1c1c]">receipt_long</span>
                  <span>Invoice Digital di Web</span>
                </div>
              </div>
            </div>

            {/* Live Trip Telemetry Ticket Card */}
            <div className="lg:col-span-5">
              <div className="relative bg-white rounded-2xl p-6 lg:p-7 shadow-xl border border-[#e6dfd5]">
                <div className="absolute -top-3 left-6 px-3 py-1 bg-[#1b1c1c] text-white rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
                  Trip Dispatch Card
                </div>

                <div className="pt-2">
                  <div className="flex items-start justify-between pb-4">
                    <div>
                      <span className="text-[11px] font-bold tracking-widest uppercase text-[#625e56] block">
                        Sektor Pengadaan
                      </span>
                      <p className="font-serif text-xl text-[#1b1c1c] font-semibold">Guangzhou & Shanghai Batch 01</p>
                      <p className="text-xs text-[#625e56]">Tianhe · Huaihai Road · Huaqiangbei</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#1b1c1c]">
                      <span className="material-symbols-outlined text-[20px]">flight</span>
                    </div>
                  </div>

                  {/* Cutoff & Flight Dates */}
                  <div className="grid grid-cols-2 gap-4 py-3 bg-[#f5f3f3] rounded-xl p-3 my-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#625e56] block">PO Closure</span>
                      <span className="text-sm text-[#1b1c1c] font-bold">26 Mar, 23:59</span>
                      <span className="text-[11px] text-[#625e56] block">WIB (Strict Cutoff)</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#625e56] block">Flight Return</span>
                      <span className="text-sm text-[#1b1c1c] font-bold">28 Mar 2025</span>
                      <span className="text-[11px] text-[#625e56] block">CZ 387 CAN ➔ CGK</span>
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  <div className="my-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#625e56] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">timer</span>
                        Pre-Order Window Closes In
                      </span>
                      <span className="text-[11px] font-bold text-[#c06e4c]">Active Run</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-[#eae8e7] rounded-lg p-2">
                        <span className="text-xl font-bold font-mono block text-[#1b1c1c]">
                          {String(timeLeft.days).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-[#625e56]">Days</span>
                      </div>
                      <div className="bg-[#eae8e7] rounded-lg p-2">
                        <span className="text-xl font-bold font-mono block text-[#1b1c1c]">
                          {String(timeLeft.hours).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-[#625e56]">Hours</span>
                      </div>
                      <div className="bg-[#eae8e7] rounded-lg p-2">
                        <span className="text-xl font-bold font-mono block text-[#1b1c1c]">
                          {String(timeLeft.minutes).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-[#625e56]">Mins</span>
                      </div>
                      <div className="bg-[#eae8e7] rounded-lg p-2">
                        <span className="text-xl font-bold font-mono block text-[#1b1c1c]">
                          {String(timeLeft.seconds).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-[#625e56]">Secs</span>
                      </div>
                    </div>
                  </div>

                  {/* Luggage Quota Gauge */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[#625e56] uppercase text-[10px] font-bold tracking-wider">
                        Luggage Quota Allocated
                      </span>
                      <span className="text-[#1b1c1c] font-bold text-xs">78% Full (11.5 kg Left)</span>
                    </div>
                    <div className="w-full bg-[#eae8e7] h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#1b1c1c] h-full rounded-full transition-all duration-500 w-[78%]" />
                    </div>
                    <p className="text-[11px] text-[#625e56] mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">lock</span>
                      Baggage slots strictly capped to preserve luxury packaging condition.
                    </p>
                  </div>

                  {/* WhatsApp VIP Concierge Action */}
                  <div className="mt-4 pt-2">
                    <a
                      href="https://wa.me/"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 rounded-full bg-[#e9e2d7] text-[#1e1b15] hover:bg-[#eae8e7] text-xs font-bold uppercase tracking-wider text-center block transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                      <span>Direct VIP Concierge via WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOKOPEDIA & SHOPEE STYLE QUICK REASSURANCE & SHORTCUTS */}
      <section className="w-full bg-white border-y border-[#e6dfd5] py-4 px-4 lg:px-12 shadow-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => {
              navigate('shop');
              window.dispatchEvent(new CustomEvent('select-category', { detail: 'Barang Viral China' }));
            }}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition-all group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">🔥</span>
            <div>
              <p className="text-xs font-bold text-amber-950">Barang Viral China</p>
              <p className="text-[10px] text-amber-700">Pop Mart, Labubu, Douyin</p>
            </div>
          </button>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#fbf9f8] border border-[#e6dfd5]/80 text-left">
            <span className="material-symbols-outlined text-[24px] text-emerald-600">local_shipping</span>
            <div>
              <p className="text-xs font-bold text-[#1b1c1c]">Bebas Ongkir</p>
              <p className="text-[10px] text-[#625e56]">Min. belanja Rp 1,5 jt</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#fbf9f8] border border-[#e6dfd5]/80 text-left">
            <span className="material-symbols-outlined text-[24px] text-[#1b1c1c]">receipt_long</span>
            <div>
              <p className="text-xs font-bold text-[#1b1c1c]">Invoice Web Resmi</p>
              <p className="text-[10px] text-[#625e56]">Cetak & unduh di web (tanpa email)</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#fbf9f8] border border-[#e6dfd5]/80 text-left">
            <span className="material-symbols-outlined text-[24px] text-[#c27863]">verified_user</span>
            <div>
              <p className="text-xs font-bold text-[#1b1c1c]">100% Hand-Carried</p>
              <p className="text-[10px] text-[#625e56]">Koper aman & nota fisik asli</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PILLARS (TRUST & LEGITIMACY) */}
      <section className="w-full px-4 lg:px-12 py-14 bg-[#f5f3f3] border-b border-[#e6dfd5]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#e6dfd5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#1b1c1c] mb-4">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </div>
                <h3 className="font-semibold text-sm text-[#1b1c1c] mb-1">100% Boutique Authentic</h3>
                <p className="text-xs text-[#625e56] leading-relaxed">
                  Every piece is sourced directly inside official brand flagships and department stores. Physical paper invoice and store receipt handed to you.
                </p>
              </div>
              <span className="mt-4 text-[10px] font-bold uppercase tracking-wider text-[#444748]">
                Store Invoices Included
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#e6dfd5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#1b1c1c] mb-4">
                  <span className="material-symbols-outlined text-[20px]">luggage</span>
                </div>
                <h3 className="font-semibold text-sm text-[#1b1c1c] mb-1">Hand-Carried Safety</h3>
                <p className="text-xs text-[#625e56] leading-relaxed">
                  Transported in rigid shockproof luggage and personal cabin bags. Zero crushed boxes, zero dropped courier parcels, zero missing items.
                </p>
              </div>
              <span className="mt-4 text-[10px] font-bold uppercase tracking-wider text-[#444748]">
                White-Glove Transit
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#e6dfd5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#1b1c1c] mb-4">
                  <span className="material-symbols-outlined text-[20px]">policy</span>
                </div>
                <h3 className="font-semibold text-sm text-[#1b1c1c] mb-1">Bea Cukai Compliant</h3>
                <p className="text-xs text-[#625e56] leading-relaxed">
                  Cleared legally via customs personal baggage declaration (ECD). All applicable luxury duties and Indonesian import levies handled transparently.
                </p>
              </div>
              <span className="mt-4 text-[10px] font-bold uppercase tracking-wider text-[#444748]">
                Legally Cleared & Taxed
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#e6dfd5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#1b1c1c] mb-4">
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                </div>
                <h3 className="font-semibold text-sm text-[#1b1c1c] mb-1">Paxel & JNE YES Delivery</h3>
                <p className="text-xs text-[#625e56] leading-relaxed">
                  Dispatched swiftly across Jakarta, Surabaya, Bali, Medan, and Bandung using temperature-controlled cold chain or guaranteed next-day courier.
                </p>
              </div>
              <span className="mt-4 text-[10px] font-bold uppercase tracking-wider text-[#444748]">
                Insurance & Real-time GPS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SPECIAL SPOTLIGHT: 🔥 BARANG VIRAL CHINA TERLARIS & PALING DICARI */}
      <section className="w-full px-4 lg:px-12 py-16 bg-linear-to-b from-amber-50/70 via-white to-[#fbf9f8] border-b border-amber-200/60">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="text-sm">🔥</span>
                <span>Paling Banyak Dicari Minggu Ini</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-[#1b1c1c]">
                Barang Viral China Terlaris
              </h2>
              <p className="text-xs text-[#625e56] mt-1 max-w-xl">
                Koleksi Pop Mart Labubu, Crybaby x Powerpuff Girls, dan tren Douyin viral langsung dari supplier resmi China dengan jaminan 100% original & bebas ongkir.
              </p>
            </div>

            <button
              onClick={() => {
                navigate('shop');
                window.dispatchEvent(new CustomEvent('select-category', { detail: 'Barang Viral China' }));
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shrink-0 self-start md:self-auto"
            >
              <span>Lihat Semua Koleksi Viral China</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Viral Products Grid (Tokopedia & Shopee Style Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(viralChinaProducts.length > 0 ? viralChinaProducts : products.slice(0, 4)).map((item) => (
              <div
                key={`viral-${item.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-amber-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div
                  className="relative cursor-pointer"
                  onClick={() => navigate('product-detail', { productId: item.id })}
                >
                  <div className="aspect-[4/5] w-full overflow-hidden bg-[#f5f3f3] relative">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                      <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-1">
                        <span>🔥</span> VIRAL TIKTOK
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                        Bebas Ongkir
                      </span>
                    </div>
                  </div>

                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-amber-600 text-white shadow-xs">
                    {item.stockSlots} Slot Tersedia
                  </span>
                </div>

                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#625e56] mb-1">
                      <span className="font-semibold text-[#1b1c1c]">{item.brand}</span>
                      <span>•</span>
                      <span className="flex items-center text-amber-500 font-bold">
                        ★ 4.9
                      </span>
                      <span className="text-[#8a847d]">(3.8rb terjual)</span>
                    </div>

                    <h3
                      onClick={() => navigate('product-detail', { productId: item.id })}
                      className="font-serif text-sm font-semibold text-[#1b1c1c] line-clamp-2 mb-2 hover:text-amber-800 cursor-pointer min-h-[40px]"
                    >
                      {item.name}
                    </h3>

                    {/* Pricing */}
                    <div className="mb-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold text-[#1b1c1c]">
                          {formatRupiah(item.priceIdr)}
                        </span>
                        {item.originalPriceIdr && (
                          <span className="text-xs text-[#8a847d] line-through">
                            {formatRupiah(item.originalPriceIdr)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-700 font-medium">
                        ✓ Termasuk PPN & Jaminan Ori
                      </span>
                    </div>
                  </div>

                  {/* Dual Action Buttons (Tokopedia / Shopee Familiarity) */}
                  <div className="pt-2 border-t border-[#e6dfd5]/80 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addToCart(item, 1, item.variants?.[0]?.options[0])}
                      className="py-2 px-2 rounded-xl border border-[#1b1c1c] text-[#1b1c1c] hover:bg-[#eae8e7] text-[11px] font-bold tracking-wide transition-colors flex items-center justify-center gap-1"
                      title="Tambah ke Keranjang"
                    >
                      <span className="material-symbols-outlined text-[15px]">shopping_bag</span>
                      <span>+ Keranjang</span>
                    </button>
                    <button
                      onClick={() => {
                        addToCart(item, 1, item.variants?.[0]?.options[0]);
                        navigate('checkout');
                      }}
                      className="py-2 px-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold tracking-wide transition-colors flex items-center justify-center shadow-xs"
                      title="Beli Langsung ke Checkout"
                    >
                      <span>Beli Langsung</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED CURATED DROPS */}
      <section className="w-full px-4 lg:px-12 py-16 bg-[#fbf9f8]" id="tokyo-catalog">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#625e56] block mb-1">
                Tokyo & International Batch
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-[#1b1c1c]">
                Curated Drops & Limited Inventory
              </h2>
            </div>
            <p className="text-xs text-[#625e56] max-w-sm">
              Strict unit quotas allocated per run to match checked baggage limits. First confirmed, first sourced.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
            {['All', 'Barang Viral China', 'Boutique Fashion', 'J-Beauty Cult Hits', 'Specialty Snacks & Tea', 'Luxury & Designer Bags'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#1b1c1c] text-white shadow-xs'
                      : 'bg-[#eae8e7] text-[#1b1c1c] hover:bg-[#e9e2d7]'
                  }`}
                >
                  {cat === 'All' ? 'All Highlights' : cat === 'Barang Viral China' ? '🔥 Barang Viral China' : cat}
                </button>
              )
            )}
          </div>

          {/* Showcase Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden border border-[#e6dfd5] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div
                  className="relative cursor-pointer"
                  onClick={() => navigate('product-detail', { productId: item.id })}
                >
                  <div className="aspect-[4/5] w-full overflow-hidden bg-[#f5f3f3]">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {/* Origin Tag */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#fbf9f8]/90 backdrop-blur-md text-[#1b1c1c] text-[10px] font-bold tracking-wider uppercase border border-[#e6dfd5]/60 shadow-xs">
                    {item.tags?.[0] || 'Exclusive'}
                  </span>
                  {/* Slot indicator */}
                  <span
                    className={`absolute bottom-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${
                      item.stockSlots === 0
                        ? 'bg-[#ba1a1a] text-white'
                        : item.stockSlots <= 3
                        ? 'bg-[#c06e4c] text-white'
                        : 'bg-[#1b1c1c]/90 text-white'
                    }`}
                  >
                    {item.stockSlots === 0 ? 'Waitlist' : `${item.stockSlots} Slots Left`}
                  </span>
                </div>

                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#625e56] block mb-1">
                      {item.brand}
                    </span>
                    <h3
                      onClick={() => navigate('product-detail', { productId: item.id })}
                      className="font-serif text-base font-semibold text-[#1b1c1c] line-clamp-2 mb-2 hover:underline cursor-pointer"
                    >
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#747878] mb-3">
                      Original Store Price: {item.originalPriceForeign || 'In-store'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#e6dfd5]">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-base font-bold text-[#1b1c1c]">
                        {formatRupiah(item.priceIdr)}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-[#625e56]">
                        All-In Jakarta
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (item.stockSlots === 0) {
                          navigate('product-detail', { productId: item.id });
                        } else {
                          addToCart(item, 1, item.variants?.[0]?.options[0]);
                        }
                      }}
                      className={`w-full py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 ${
                        item.stockSlots === 0
                          ? 'bg-[#eae8e7] text-[#625e56] cursor-not-allowed'
                          : 'bg-[#1b1c1c] text-white hover:bg-neutral-800'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {item.stockSlots === 0 ? 'schedule' : 'keyboard_double_arrow_left'}
                      </span>
                      <span>{item.stockSlots === 0 ? 'Join Waitlist' : 'Reserve PO Slot'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('shop')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#eae8e7] hover:bg-[#e9e2d7] text-[#1b1c1c] text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <span>View All Items in Catalog ({products.length})</span>
              <span className="material-symbols-outlined text-[16px]">east</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE 4-STEP HOW IT WORKS */}
      <section className="w-full px-4 lg:px-12 py-20 bg-[#f5f3f3] border-t border-[#e6dfd5]" id="how-it-works-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#625e56] block mb-2">
              Concierge Protocol
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1b1c1c] font-medium">
              How Atelier Jastip Works
            </h2>
            <p className="text-sm text-[#444748] mt-2">
              Transparent, insured, and deeply personal. From Japanese department store counters straight into your hands in Jakarta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#e6dfd5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-2xl font-bold text-[#625e56]">01</span>
                  <span className="material-symbols-outlined text-[#625e56] text-[24px]">
                    shopping_cart_checkout
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-[#1b1c1c] mb-2">Browse & Reserve PO</h3>
                <p className="text-xs text-[#625e56] leading-relaxed">
                  Select items from our active drop list or submit a custom product link before the strict batch closing deadline (26 March, 23:59 WIB).
                </p>
              </div>
              <div className="mt-4 pt-2 text-[#747878] text-[10px] uppercase font-bold tracking-wider">
                Phase 1 · Pre-Trip Booking
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#e6dfd5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-2xl font-bold text-[#625e56]">02</span>
                  <span className="material-symbols-outlined text-[#625e56] text-[24px]">storefront</span>
                </div>
                <h3 className="font-semibold text-sm text-[#1b1c1c] mb-2">Kurator Belanja di China</h3>
                <p className="text-xs text-[#625e56] leading-relaxed">
                  Tim kami mendatangi toko resmi Pop Mart Shanghai, butik C-Beauty, dan sentra grosir Guangzhou. Pembeli menerima bukti video pembelian toko fisik secara transparan.
                </p>
              </div>
              <div className="mt-4 pt-2 text-[#747878] text-[10px] uppercase font-bold tracking-wider">
                Phase 2 · Real-Time Sourcing
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#e6dfd5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-2xl font-bold text-[#625e56]">03</span>
                  <span className="material-symbols-outlined text-[#625e56] text-[24px]">airlines</span>
                </div>
                <h3 className="font-semibold text-sm text-[#1b1c1c] mb-2">Flight & Bea Cukai Resmi</h3>
                <p className="text-xs text-[#625e56] leading-relaxed">
                  Semua barang dikemas rapi dengan pelindung koper khusus dan diterbangkan langsung ke Bandara Soekarno-Hatta (CGK) dengan deklarasi kepabeanan resmi (ECD).
                </p>
              </div>
              <div className="mt-4 pt-2 text-[#747878] text-[10px] uppercase font-bold tracking-wider">
                Phase 3 · Hand-Carry & Import
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#e6dfd5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-2xl font-bold text-[#625e56]">04</span>
                  <span className="material-symbols-outlined text-[#625e56] text-[24px]">
                    mark_email_read
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-[#1b1c1c] mb-2">Invoice Web & Pengiriman</h3>
                <p className="text-xs text-[#625e56] leading-relaxed">
                  Invoice digital langsung terbit di website tanpa repot kirim email. Pesanan dikirim langsung ke rumah via JNE YES, SiCepat, atau kurir instant pilihan Anda.
                </p>
              </div>
              <div className="mt-4 pt-2 text-[#747878] text-[10px] uppercase font-bold tracking-wider">
                Phase 4 · Final Fulfillment
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. UPCOMING TRIPS SCHEDULE */}
      <section className="w-full px-4 lg:px-12 py-16 bg-[#fbf9f8]" id="upcoming-trips-section">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#625e56] block mb-1">
                Jadwal Pengadaan China
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-[#1b1c1c]">Jadwal Rute Jastip China</h2>
            </div>
            <p className="text-xs text-[#625e56] max-w-sm">
              Amankan slot pre-order lebih awal. Kuota koper dibatasi untuk menjamin keamanan blind box dan keutuhan paket belanja Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Trip 1: Guangzhou Current */}
            <div className="bg-white rounded-2xl p-6 border border-[#e6dfd5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-[#e9e2d7] text-[#1e1b15] text-[10px] font-bold uppercase tracking-wide">
                    Batch Aktif
                  </span>
                  <span className="text-[10px] font-bold text-[#c06e4c] uppercase tracking-wider">
                    PO Dibuka
                  </span>
                </div>
                <h3 className="font-serif text-xl text-[#1b1c1c] mb-1">Guangzhou Direct Wholesale</h3>
                <p className="text-xs text-[#625e56] mb-4">Tianhe, Shisanhang, Yide Road & Baiyun</p>
                <div className="space-y-2 py-3 bg-[#f5f3f3] rounded-xl p-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#625e56]">Jadwal Sourcing:</span>
                    <span className="font-semibold text-[#1b1c1c]">28 Mar – 02 Apr 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#625e56]">Batas PO:</span>
                    <span className="font-semibold text-[#1b1c1c]">26 Mar, 23:59 WIB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#625e56]">Penerbangan:</span>
                    <span className="font-semibold text-[#1b1c1c]">CZ 387 CAN—CGK</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-2">
                <button
                  onClick={() => navigate('shop')}
                  className="w-full py-2.5 rounded-full bg-[#1b1c1c] text-white text-xs font-bold uppercase tracking-wider text-center block hover:bg-neutral-800 transition-colors"
                >
                  Jelajahi Katalog Batch Ini
                </button>
              </div>
            </div>

            {/* Trip 2: Shanghai Pop Mart */}
            <div className="bg-white rounded-2xl p-6 border border-[#e6dfd5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-[#eae8e7] text-[#1b1c1c] text-[10px] font-bold uppercase tracking-wide">
                    Batch Berikutnya
                  </span>
                  <span className="text-[10px] font-bold text-[#625e56] uppercase tracking-wider">
                    Waitlist Dibuka
                  </span>
                </div>
                <h3 className="font-serif text-xl text-[#1b1c1c] mb-1">Shanghai Pop Mart & Art</h3>
                <p className="text-xs text-[#625e56] mb-4">Huaihai Road, Xintiandi & Nanjing East</p>
                <div className="space-y-2 py-3 bg-[#f5f3f3] rounded-xl p-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#625e56]">Jadwal Sourcing:</span>
                    <span className="font-semibold text-[#1b1c1c]">15 Apr – 20 Apr 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#625e56]">Batas PO:</span>
                    <span className="font-semibold text-[#1b1c1c]">12 Apr, 23:59 WIB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#625e56]">Fokus Sourcing:</span>
                    <span className="font-semibold text-[#1b1c1c]">Labubu, Crybaby, Skullpanda</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-2">
                <button
                  onClick={() => navigate('shop')}
                  className="w-full py-2.5 rounded-full bg-[#eae8e7] hover:bg-[#e9e2d7] text-[#1b1c1c] text-xs font-bold uppercase tracking-wider text-center block transition-colors"
                >
                  Lihat Item Shanghai
                </button>
              </div>
            </div>

            {/* Trip 3: Shenzhen Tech */}
            <div className="bg-white rounded-2xl p-6 border border-[#e6dfd5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-[#eae8e7] text-[#1b1c1c] text-[10px] font-bold uppercase tracking-wide">
                    Mei 2025
                  </span>
                  <span className="text-[10px] font-bold text-[#625e56] uppercase tracking-wider">
                    Pratinjau
                  </span>
                </div>
                <h3 className="font-serif text-xl text-[#1b1c1c] mb-1">Shenzhen Tech & Gadget Hub</h3>
                <p className="text-xs text-[#625e56] mb-4">Huaqiangbei, Nanshan & Luohu</p>
                <div className="space-y-2 py-3 bg-[#f5f3f3] rounded-xl p-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#625e56]">Jadwal Sourcing:</span>
                    <span className="font-semibold text-[#1b1c1c]">05 Mei – 10 Mei 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#625e56]">Batas PO:</span>
                    <span className="font-semibold text-[#1b1c1c]">02 Mei, 23:59 WIB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#625e56]">Fokus Sourcing:</span>
                    <span className="font-semibold text-[#1b1c1c]">Xiaomi Mijia, Douyin Lamps, Tech</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-2">
                <button
                  onClick={() => navigate('shop')}
                  className="w-full py-2.5 rounded-full bg-[#eae8e7] hover:bg-[#e9e2d7] text-[#1b1c1c] text-xs font-bold uppercase tracking-wider text-center block transition-colors"
                >
                  Lihat Item Shenzhen
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INSTAGRAM STORIES FEED PREVIEW */}
      <section className="w-full px-4 lg:px-12 py-14 bg-[#f5f3f3] border-t border-[#e6dfd5]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#625e56] block mb-1">
                Live Instagram Stories
              </span>
              <h2 className="font-serif text-2xl text-[#1b1c1c]">On-The-Ground Shopping Snapshots</h2>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1b1c1c] hover:text-[#625e56] transition-colors"
            >
              <span>@atelier.jastip</span>
              <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-2.5 rounded-2xl border border-[#e6dfd5] shadow-xs">
              <div className="aspect-square w-full rounded-xl overflow-hidden mb-2 bg-[#eae8e7]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQx2tQj5jjJfCKgbA47rGHNSSUT92RRK3P9cvbOiwEBGRqeytd41FNbH91PaZ6hZX5wlljAkpRnrNgcnKJhgC_jhnPeAaLEGMxZ6uspsXmFkD12vB_eHUKmiL97kEO8qWBvpM5d3VpV95N8K8nPTdLuVj4b--B5UZwt1s7tSjnVxur7_raBfP8hYcYTotYXglMtMkMKOzapOtXX29IvMc_acL8797nV_AffuYWbV447YaQCohTGEoOQg"
                  alt="Ginza Mitsukoshi"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[11px] font-bold uppercase text-[#1b1c1c] truncate">Ginza Mitsukoshi</p>
              <p className="text-[10px] text-[#747878] truncate">Cosmetics Hall Dispatch · 10:45 JST</p>
            </div>

            <div className="bg-white p-2.5 rounded-2xl border border-[#e6dfd5] shadow-xs">
              <div className="aspect-square w-full rounded-xl overflow-hidden mb-2 bg-[#eae8e7]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7fPEHj8ImH6kXCH1XwcQKTq05yuo_EcZ5DpdyfUSvmOd3M2jnj9mHaLgIxtFzocuTcuM_NWiZdfLX0kC4oDflVILGeL1aE1FK1Nv7i-rrSsrXAS3Soz6kbIfJK3F_UQzRPqnB2Lam86xXAPHhtPpJUpNUzJlmBx4auvjfizVmzaF9gF-TE-FD4nDnZZT-Vnr3_Ea_xEwT_oVc373FxajG3LWPRuRDAGwDBH6NYEEPDLpNjb8duYWAVw"
                  alt="Porter Omotesando"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[11px] font-bold uppercase text-[#1b1c1c] truncate">Porter Omotesando</p>
              <p className="text-[10px] text-[#747878] truncate">Luggage Restock Check · 13:20 JST</p>
            </div>

            <div className="bg-white p-2.5 rounded-2xl border border-[#e6dfd5] shadow-xs">
              <div className="aspect-square w-full rounded-xl overflow-hidden mb-2 bg-[#eae8e7]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUgM62LL8AZ4Lu5s0qM10Nuj0GcYbdxO532xMQZ1VkzkXHtiYMJ1vJkK_uCx_xY3wAJbmsG-rovBvvZsQXQdCDNJ7BWJnp7VIbtHJCJ1FR-3S9BwZmwdIZwOdOlFu-mme4A997JVJrhw2ux2bjEw8f4Tnil-zxkh7VuYB7nyRV7TWjk9oOXX-loNDB40MunlMsODmeK_CjKDJJII8mnr5yLfh6FzDTNWhhOpLtjVqbO1vRIe0zcjVj2w"
                  alt="Tokyo Station DFS"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[11px] font-bold uppercase text-[#1b1c1c] truncate">Tokyo Station DFS</p>
              <p className="text-[10px] text-[#747878] truncate">Fresh Confection Batch · 16:00 JST</p>
            </div>

            <div className="bg-white p-2.5 rounded-2xl border border-[#e6dfd5] shadow-xs">
              <div className="aspect-square w-full rounded-xl overflow-hidden mb-2 bg-[#eae8e7]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcnqUm5s_GHbuXAxGANNEhmeQERpCUKzDN1ty1ShSODlZ6j0w99KMDpi6HpFgU22_8GV7WBHrZHfoI76PeKAwRtFZplvOR31KAbS1cqLW6vhCIY9O_InGU-Otytk4dT956Dsdf8rY_sRmxHsgUOA94kz_B8Ex3DpzjtBgOINyewsM0FbVNs8vTuydkHedrA7fdE0KCpiz3rEzTcRJSjYsZ795Ll9kuJkeQ077kvAe3QU1hJGWcdOC4HQ"
                  alt="Haneda Airport T3"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[11px] font-bold uppercase text-[#1b1c1c] truncate">Haneda Airport T3</p>
              <p className="text-[10px] text-[#747878] truncate">Customs Manifest Prep · 19:30 JST</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOM SOURCING CTA BANNER */}
      <section className="w-full px-4 lg:px-12 py-16 bg-[#fbf9f8]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#1b1c1c] text-white rounded-3xl p-8 lg:p-14 shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 text-[11px] font-bold uppercase tracking-widest mb-4">
                <span className="material-symbols-outlined text-[14px]">tune</span>
                <span>Bespoke Concierge Sourcing</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight mb-4 text-white">
                Looking for something specific that is not on our catalog?
              </h2>
              <p className="text-sm text-neutral-300 mb-8 leading-relaxed">
                Send us any product screenshot, official brand web URL, or Instagram link from Japan, Korea, or France. Our curator will verify boutique stock availability, calculate all-in Jakarta landing cost, and hold your personal luggage allocation.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-3.5 rounded-full bg-[#fbf9f8] text-[#1b1c1c] text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>Submit Custom Request via WhatsApp</span>
                </a>
                <span className="text-neutral-400 text-xs">Average quotation response within 30 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
