import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCategory } from '../../types';

export const ShopPage: React.FC = () => {
  const { products, navigate, addToCart, batches } = useApp();

  const [selectedBatch, setSelectedBatch] = useState<string>('china-guangzhou-express');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [weightFilter, setWeightFilter] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(15000000);
  const [searchWord, setSearchWord] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('featured');
  const [quotaFilter, setQuotaFilter] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail) {
        setSelectedCategory(e.detail);
      }
    };
    window.addEventListener('select-category', handler);
    return () => window.removeEventListener('select-category', handler);
  }, []);

  const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  // Filter products
  let filtered = products.filter((p) => {
    // Search
    if (
      searchWord &&
      !p.name.toLowerCase().includes(searchWord.toLowerCase()) &&
      !p.brand.toLowerCase().includes(searchWord.toLowerCase()) &&
      !p.sku.toLowerCase().includes(searchWord.toLowerCase())
    ) {
      return false;
    }

    // Category
    if (selectedCategory !== 'All' && p.category !== selectedCategory) {
      return false;
    }

    // Price
    if (p.priceIdr > maxPrice) {
      return false;
    }

    // Weight filter
    if (weightFilter && p.weightKg > 0.5) {
      return false;
    }

    // Quota status
    if (quotaFilter === 'open' && p.stockSlots === 0) {
      return false;
    }
    if (quotaFilter === 'low' && (p.stockSlots > 3 || p.stockSlots === 0)) {
      return false;
    }

    // District filter
    if (selectedDistrict !== 'all') {
      const originMatch = p.originStore.toLowerCase().includes(selectedDistrict.toLowerCase());
      const tagMatch = p.tags?.some((t) => t.toLowerCase().includes(selectedDistrict.toLowerCase()));
      if (!originMatch && !tagMatch) return false;
    }

    return true;
  });

  // Sort
  if (sortOption === 'price-low') {
    filtered.sort((a, b) => a.priceIdr - b.priceIdr);
  } else if (sortOption === 'price-high') {
    filtered.sort((a, b) => b.priceIdr - a.priceIdr);
  } else if (sortOption === 'quota-low') {
    filtered.sort((a, b) => a.stockSlots - b.stockSlots);
  }

  const resetFilters = () => {
    setSelectedBatch('china-guangzhou-express');
    setSelectedCategory('All');
    setWeightFilter(false);
    setMaxPrice(15000000);
    setSearchWord('');
    setSortOption('featured');
    setQuotaFilter('all');
    setSelectedDistrict('all');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Progress & Trip Operational Bar */}
      <div className="w-full bg-[#eae8e7]/80 backdrop-blur-sm px-4 lg:px-12 py-3 border-b border-[#e6dfd5]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[#625e56] text-xs">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-[#c06e4c] animate-pulse"></span>
            <span className="text-[#1b1c1c] font-semibold">Guangzhou & Shanghai Batch 01 Sourcing Aktif</span>
            <span className="text-[#625e56]/40">·</span>
            <span>
              Pre-orders ditutup <strong className="text-[#1b1c1c]">26 Mar, 23:59 WIB</strong>
            </span>
            <span className="text-[#625e56]/40">·</span>
            <span>
              Penerbangan Hand-Carry Mendarat: <strong className="text-[#1b1c1c]">02 Apr (CGK T3)</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px]">luggage</span>
              <span>
                Baggage Quota: <strong className="text-[#1b1c1c]">78% Filled</strong>
              </span>
            </span>
            <div className="w-24 h-1.5 bg-[#dbd9d9] rounded-full overflow-hidden">
              <div className="h-full bg-[#1b1c1c] rounded-full w-[78%]"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-12 py-8 lg:py-12 w-full">
        {/* Breadcrumb & Section Header */}
        <div className="mb-10">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#625e56] mb-3">
            <button onClick={() => navigate('home')} className="hover:text-[#1b1c1c]">Home</button>
            <span>/</span>
            <span>Shop Drops</span>
            <span>/</span>
            <span className="text-[#1b1c1c] font-semibold">China Direct Sourcing Batch</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#e6dfd5]">
            <div className="max-w-3xl">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#c06e4c] block mb-1">
                Katalog Jastip China 100% Original
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1b1c1c] font-normal tracking-tight">
                Katalog Produk China
              </h1>
              <p className="text-sm text-[#444748] mt-2 leading-relaxed max-w-2xl">
                Koleksi kurasi Pop Mart original, C-Beauty terhits, fashion Guangzhou, dan gadget Douyin viral. Hand-carried langsung dari China dengan invoice digital di dalam website.
              </p>
            </div>
            {/* Quick Manifest Stats Card */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-[#e6dfd5] shadow-xs shrink-0">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#625e56]">Flight Manifest</span>
                <span className="font-serif text-base font-bold text-[#1b1c1c]">CZ 387 CAN—CGK</span>
                <span className="text-[11px] text-[#747878]">Checked Cargo + Koper Hand-Carry</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#1b1c1c]">
                <span className="material-symbols-outlined text-[20px]">airlines</span>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Split: Left Filter Controls & Right Main Catalog */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT FILTER SIDEBAR */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-[#e6dfd5] shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#e6dfd5]">
                <h3 className="text-sm font-bold text-[#1b1c1c] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#625e56]">tune</span>
                  Sourcing Filters
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-[11px] font-semibold text-[#625e56] hover:text-[#1b1c1c] uppercase tracking-wider"
                >
                  Reset
                </button>
              </div>

              {/* Trip Batch Selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#625e56] block">
                  Trip Batch
                </label>
                <div className="space-y-1 text-xs">
                  <label
                    onClick={() => setSelectedBatch('tokyo-spring-2025')}
                    className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                      selectedBatch === 'tokyo-spring-2025'
                        ? 'bg-[#f5f3f3] text-[#1b1c1c] font-semibold'
                        : 'hover:bg-[#fbf9f8] text-[#444748]'
                    }`}
                  >
                    <span>Tokyo Spring 2025</span>
                    <span className="text-[10px] bg-[#e9e2d7] px-2 py-0.5 rounded text-[#1b1c1c] font-bold">
                      {products.length} items
                    </span>
                  </label>
                  <label
                    onClick={() => setSelectedBatch('ready-stock')}
                    className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                      selectedBatch === 'ready-stock'
                        ? 'bg-[#f5f3f3] text-[#1b1c1c] font-semibold'
                        : 'hover:bg-[#fbf9f8] text-[#444748]'
                    }`}
                  >
                    <span>Ready Stock Jakarta</span>
                    <span className="text-[10px] text-[#747878]">1 item</span>
                  </label>
                  <div className="flex items-center justify-between p-2.5 rounded-lg text-[#747878] opacity-60 text-xs">
                    <span>Paris PFW Archive</span>
                    <span className="text-[10px] uppercase font-bold">Closed</span>
                  </div>
                </div>
              </div>

              {/* Sourcing Category */}
              <div className="space-y-2 pt-2 border-t border-[#e6dfd5]">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#625e56] block">
                  Sourcing Category
                </label>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`w-full flex items-center justify-between py-2 px-2.5 rounded-lg text-left transition-colors ${
                      selectedCategory === 'All'
                        ? 'bg-[#1b1c1c] text-white font-semibold'
                        : 'text-[#444748] hover:bg-[#f5f3f3]'
                    }`}
                  >
                    <span>All Curations</span>
                    <span className="text-[10px] opacity-75">{products.length}</span>
                  </button>
                  {[
                    'Barang Viral China',
                    'Boutique Fashion',
                    'J-Beauty Cult Hits',
                    'Luxury & Designer Bags',
                    'Specialty Snacks & Tea',
                    'Lifestyle & Collectibles',
                  ].map((cat) => {
                    const count = products.filter((p) => p.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full flex items-center justify-between py-2 px-2.5 rounded-lg text-left transition-colors ${
                          selectedCategory === cat
                            ? 'bg-[#1b1c1c] text-white font-semibold'
                            : 'text-[#444748] hover:bg-[#f5f3f3]'
                        }`}
                      >
                        <span className="truncate pr-2">{cat}</span>
                        <span className="text-[10px] opacity-75">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Luggage Weight Filter */}
              <div className="space-y-2 pt-2 border-t border-[#e6dfd5]">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#625e56] block">
                  Luggage & Form Factor
                </label>
                <div className="space-y-1.5 text-xs text-[#444748]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={weightFilter}
                      onChange={(e) => setWeightFilter(e.target.checked)}
                      className="rounded accent-[#1b1c1c]"
                    />
                    <span>Under 0.5 kg (Easy Cabin)</span>
                  </label>
                </div>
              </div>

              {/* Budget Range Slider */}
              <div className="space-y-2 pt-2 border-t border-[#e6dfd5]">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#625e56]">
                    Budget Range (IDR)
                  </label>
                  <span className="text-xs font-bold text-[#1b1c1c]">
                    Up to {(maxPrice / 1000000).toFixed(1)}M
                  </span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="15000000"
                  step="250000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#1b1c1c] bg-[#e6dfd5] h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] text-[#747878] pt-1">
                  <span>Rp 100 rb</span>
                  <span>Rp 15.0 jt</span>
                </div>
              </div>

              {/* Luggage Quota Status Filter */}
              <div className="space-y-2 pt-2 border-t border-[#e6dfd5]">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#625e56] block">
                  Luggage Quota Status
                </label>
                <div className="space-y-1 text-xs text-[#444748]">
                  <button
                    onClick={() => setQuotaFilter('all')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg ${
                      quotaFilter === 'all' ? 'bg-[#f5f3f3] font-semibold text-[#1b1c1c]' : ''
                    }`}
                  >
                    All Items
                  </button>
                  <button
                    onClick={() => setQuotaFilter('open')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 ${
                      quotaFilter === 'open' ? 'bg-[#f5f3f3] font-semibold text-[#1b1c1c]' : ''
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#2a5a44]" />
                    <span>Open for PO</span>
                  </button>
                  <button
                    onClick={() => setQuotaFilter('low')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 ${
                      quotaFilter === 'low' ? 'bg-[#f5f3f3] font-semibold text-[#1b1c1c]' : ''
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#c06e4c]" />
                    <span>Quota Low (&lt;3 slots left)</span>
                  </button>
                </div>
              </div>

              {/* Sentra Sourcing China */}
              <div className="space-y-2 pt-2 border-t border-[#e6dfd5]">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#625e56] block">
                  Kota & Sentra Sourcing
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['all', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Beijing', 'Hangzhou'].map((dist) => (
                    <button
                      key={dist}
                      onClick={() => setSelectedDistrict(dist)}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                        selectedDistrict === dist
                          ? 'bg-[#1b1c1c] text-white'
                          : 'bg-[#f5f3f3] text-[#444748] hover:bg-[#eae8e7]'
                      }`}
                    >
                      {dist === 'all' ? 'Semua Kota' : dist}
                    </button>
                  ))}
                </div>
              </div>

              {/* Proof of Sourcing Assurance */}
              <div className="p-3.5 rounded-xl bg-[#f5f3f3] flex items-start gap-3">
                <span className="material-symbols-outlined text-[20px] text-[#c06e4c] shrink-0">
                  inventory_2
                </span>
                <div>
                  <p className="text-xs font-bold text-[#1b1c1c]">Proof of Sourcing</p>
                  <p className="text-[11px] text-[#625e56] mt-0.5 leading-relaxed">
                    Physical store receipt + bag video included with each dispatch.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT MAIN CATALOG */}
          <section className="lg:col-span-9 flex flex-col gap-6">
            {/* Search and Sort Header (Tokopedia / Shopee Inspired) */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e6dfd5] shadow-xs space-y-3">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#747878] text-[20px]">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Cari barang viral China, Pop Mart Labubu, skincare, brand..."
                    value={searchWord}
                    onChange={(e) => setSearchWord(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 rounded-xl bg-[#fbf9f8] text-sm text-[#1b1c1c] placeholder:text-[#747878]/60 focus:outline-none border border-[#e6dfd5] focus:border-[#1b1c1c]"
                  />
                  {searchWord && (
                    <button
                      onClick={() => setSearchWord('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#747878] hover:text-[#1b1c1c]"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#625e56]">Urutkan:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="h-11 px-3.5 rounded-xl bg-[#fbf9f8] text-xs font-semibold text-[#1b1c1c] border border-[#e6dfd5] focus:outline-none cursor-pointer"
                  >
                    <option value="featured">Paling Sesuai / Rekomendasi</option>
                    <option value="quota-low">Sisa Slot Sedikit (Hampir Habis)</option>
                    <option value="price-low">Harga: Terendah ke Tertinggi</option>
                    <option value="price-high">Harga: Tertinggi ke Terendah</option>
                  </select>
                </div>
              </div>

              {/* Quick Trending Keyword Chips (Tokopedia / Shopee feature) */}
              <div className="flex items-center gap-2 overflow-x-auto text-[11px] pt-1 pb-0.5 no-scrollbar">
                <span className="font-semibold text-[#625e56] shrink-0">🔥 Populer:</span>
                {[
                  { label: 'Labubu Have a Seat', q: 'Labubu' },
                  { label: 'Crybaby Powerpuff', q: 'Crybaby' },
                  { label: 'Lampu Sunset Douyin', q: 'Sunset' },
                  { label: 'Flower Knows Swan', q: 'Flower Knows' },
                  { label: 'Bao Bao Issey Miyake', q: 'Bao Bao' },
                  { label: 'Fino Hair Mask', q: 'Fino' },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => setSearchWord(chip.q)}
                    className="px-2.5 py-1 bg-[#f5f3f3] hover:bg-[#e9e2d7] text-[#1b1c1c] rounded-full whitespace-nowrap transition-colors border border-[#e6dfd5]/60"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Horizontal Category Pill Tabs (Shopee / Tokopedia Style) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
              {[
                { id: 'All', label: 'Semua Produk', icon: '🛍️' },
                { id: 'Barang Viral China', label: 'Barang Viral China', icon: '🔥' },
                { id: 'Boutique Fashion', label: 'Fashion Import', icon: '✨' },
                { id: 'J-Beauty Cult Hits', label: 'Beauty & Skincare', icon: '💄' },
                { id: 'Luxury & Designer Bags', label: 'Tas Mewah', icon: '👜' },
                { id: 'Specialty Snacks & Tea', label: 'Snacks & Tea', icon: '🍵' },
                { id: 'Lifestyle & Collectibles', label: 'Collectibles', icon: '🧸' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap transition-all border ${
                    selectedCategory === tab.id
                      ? 'bg-[#1b1c1c] text-white border-[#1b1c1c] shadow-xs'
                      : 'bg-white text-[#444748] border-[#e6dfd5] hover:border-[#b5a99a]'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Active Filter Badges Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-[#625e56]">
              <div className="flex flex-wrap items-center gap-2">
                <span>Filter Aktif:</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eae8e7] text-[#1b1c1c] text-xs font-medium">
                  {selectedCategory === 'All' ? 'Semua Kategori' : selectedCategory}
                </span>
                {searchWord && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eae8e7] text-[#1b1c1c] text-xs font-medium">
                    Kata Kunci: "{searchWord}"
                    <button onClick={() => setSearchWord('')}>×</button>
                  </span>
                )}
                {weightFilter && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eae8e7] text-[#1b1c1c] text-xs font-medium">
                    Under 0.5 kg
                    <button onClick={() => setWeightFilter(false)}>×</button>
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-[#c06e4c] hover:underline ml-1 uppercase"
                >
                  Reset
                </button>
              </div>
              <div>
                Menampilkan <strong className="text-[#1b1c1c]">{filtered.length}</strong> dari{' '}
                <strong className="text-[#1b1c1c]">{products.length}</strong> produk jastip
              </div>
            </div>

            {/* PRODUCT GRID */}
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center border border-[#e6dfd5] shadow-xs">
                <span className="material-symbols-outlined text-[48px] text-[#747878] mb-3">
                  search_off
                </span>
                <h3 className="font-serif text-xl font-medium text-[#1b1c1c] mb-1">
                  No products matched your filters
                </h3>
                <p className="text-xs text-[#625e56] max-w-sm mx-auto mb-6">
                  Try adjusting your price range, district selection, or reset the filters to see all available drops.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-full bg-[#1b1c1c] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((item) => (
                  <article
                    key={item.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-[#e6dfd5] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Media Card */}
                      <div
                        className="relative w-full aspect-[4/5] bg-[#f5f3f3] overflow-hidden cursor-pointer"
                        onClick={() => navigate('product-detail', { productId: item.id })}
                      >
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        
                        {/* Top Badges Row */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
                          <span className="px-2 py-0.5 rounded bg-[#fbf9f8]/95 backdrop-blur-md text-[#1b1c1c] text-[10px] font-bold uppercase tracking-wider border border-[#e6dfd5]/60 shadow-xs">
                            {item.originStore.split(',')[0]}
                          </span>

                          {item.category === 'Barang Viral China' ? (
                            <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
                              <span>🔥</span> Viral China
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                              Bebas Ongkir
                            </span>
                          )}
                        </div>

                        {/* Bottom Slot Badge */}
                        <span
                          className={`absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${
                            item.stockSlots === 0
                              ? 'bg-[#ba1a1a] text-white'
                              : item.stockSlots <= 3
                              ? 'bg-[#c06e4c] text-white'
                              : 'bg-white/90 text-[#1e1b15] backdrop-blur-xs'
                          }`}
                        >
                          {item.stockSlots === 0
                            ? 'Sisa Slot Habis'
                            : `Sisa ${item.stockSlots} slot koper`}
                        </span>
                      </div>

                      {/* Card Meta */}
                      <div className="p-4 space-y-2">
                        {/* Rating & Terjual (Tokopedia / Shopee Signature) */}
                        <div className="flex items-center justify-between text-[11px] text-[#625e56]">
                          <div className="flex items-center gap-1">
                            <span className="text-amber-500 font-bold">★</span>
                            <span className="font-bold text-[#1b1c1c]">{item.rating || 4.9}</span>
                            <span className="text-[#a8a196]">({item.reviewCount || 84})</span>
                          </div>
                          <span className="font-medium text-[#2d6a4f] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                            Terjual {(item.soldCount || 340).toLocaleString('id-ID')}
                          </span>
                        </div>

                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#96422d]">
                          {item.brand}
                        </div>

                        <h2
                          onClick={() => navigate('product-detail', { productId: item.id })}
                          className="font-serif text-sm font-semibold text-[#1b1c1c] line-clamp-2 hover:underline cursor-pointer leading-snug"
                        >
                          {item.name}
                        </h2>

                        {/* Price & Discounts */}
                        <div className="pt-2 border-t border-[#f0ece6]">
                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-bold text-[#1b1c1c]">
                              {formatRupiah(item.priceIdr)}
                            </span>
                            {item.originalPriceIdr && (
                              <span className="text-xs text-[#a8a196] line-through font-mono">
                                {formatRupiah(item.originalPriceIdr)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-[#747878] mt-0.5 font-mono">
                            <span>Estimasi: {item.estimatedArrival}</span>
                            <span className="text-[#2d6a4f] font-semibold">100% Ori</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dual Action Buttons (Tokopedia / Shopee Style) */}
                    <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(item, 1, item.variants?.[0]?.options[0]);
                        }}
                        className="py-2 px-2 rounded-xl text-[11px] font-bold border border-[#1b1c1c] text-[#1b1c1c] hover:bg-[#fbf9f8] transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[15px]">add_shopping_cart</span>
                        <span>+ Keranjang</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (item.stockSlots === 0) {
                            navigate('product-detail', { productId: item.id });
                          } else {
                            addToCart(item, 1, item.variants?.[0]?.options[0]);
                            navigate('checkout');
                          }
                        }}
                        className="py-2 px-2 rounded-xl text-[11px] font-bold bg-[#1b1c1c] text-white hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Beli Langsung</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            <div className="mt-8 flex items-center justify-between bg-white p-4 rounded-2xl border border-[#e6dfd5] shadow-xs text-xs">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="flex items-center gap-1 text-[#625e56] hover:text-[#1b1c1c] uppercase font-semibold disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                Previous
              </button>
              <div className="flex items-center gap-1 font-semibold">
                <span className="w-8 h-8 rounded-full bg-[#1b1c1c] text-white flex items-center justify-center">
                  1
                </span>
                <span className="w-8 h-8 rounded-full text-[#625e56] flex items-center justify-center">
                  2
                </span>
              </div>
              <button
                onClick={() => setCurrentPage(2)}
                className="flex items-center gap-1 text-[#1b1c1c] hover:text-[#625e56] uppercase font-semibold"
              >
                Next
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </section>
        </div>

        {/* BOTTOM ASSISTANCE BANNER */}
        <section className="mt-16 bg-[#1b1c1c] text-white rounded-3xl p-8 lg:p-12 shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 text-[10px] font-bold uppercase tracking-widest">
                <span className="material-symbols-outlined text-[14px]">link</span>
                Direct Store Sourcing
              </div>
              <h2 className="font-serif text-2xl lg:text-3xl text-white font-medium">
                Can't find the exact Japanese or boutique item you want?
              </h2>
              <p className="text-xs text-neutral-300 max-w-xl leading-relaxed">
                Send us any link from Rakuten, Mercari, Shibuya Parco, or local Ginza shops. We calculate the exact JPY to IDR conversion, tax, and hand-carry luggage fee within 15 minutes.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-[#1b1c1c] hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                Submit via WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
