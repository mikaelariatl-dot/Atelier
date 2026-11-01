import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Luggage,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  Plane,
  ChevronRight,
  ShieldCheck,
  Check,
  BarChart3,
  Award,
  Flame,
  ArrowUpRight,
  Plus,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export const OwnerOverview: React.FC = () => {
  const { products, orders, payments, batches, verifyPaymentSlip, navigate, addProduct, addToast } = useApp();
  const [chartMetric, setChartMetric] = useState<'revenue' | 'volume'>('revenue');

  const currentTrip = batches[0];
  const pendingPayments = payments.filter((p) => p.status === 'Pending Review');
  const paidOrders = orders.filter((o) => o.paymentStatus === 'Paid');
  const totalIntakeIdr = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Compute best performing / most bought products
  const productPerformance = products.map((prod) => {
    let unitsInActiveOrders = 0;
    let orderCount = 0;
    orders.forEach((o) => {
      o.items.forEach((item) => {
        if (item.productId === prod.id || item.product.id === prod.id) {
          unitsInActiveOrders += item.quantity;
          orderCount++;
        }
      });
    });

    const totalSoldUnits = (prod.soldCount || 120) + unitsInActiveOrders;
    const totalRevenueEst = totalSoldUnits * prod.priceIdr;

    return {
      product: prod,
      unitsSold: totalSoldUnits,
      activeOrders: orderCount,
      revenueIdr: totalRevenueEst,
    };
  });

  const sortedByRevenue = [...productPerformance].sort((a, b) => b.revenueIdr - a.revenueIdr);
  const sortedByVolume = [...productPerformance].sort((a, b) => b.unitsSold - a.unitsSold);

  const displayedTopProducts = (chartMetric === 'revenue' ? sortedByRevenue : sortedByVolume).slice(0, 6);
  const maxMetricValue = chartMetric === 'revenue'
    ? (displayedTopProducts[0]?.revenueIdr || 1)
    : (displayedTopProducts[0]?.unitsSold || 1);
  const topProduct = sortedByVolume[0]?.product;

  const chinaViralTrending = [
    {
      sku: 'LBB-WLD-02',
      name: 'Pop Mart Labubu "Wild Home" Spring Edition Vinyl Plush',
      brand: 'Pop Mart Official China',
      category: 'Barang Viral China' as const,
      priceIdr: 520000,
      originalPriceForeign: '¥109 RMB',
      surge: '+480% Douyin Trending',
      source: 'Huaihai Flagship Shanghai',
      desc: 'Seri teranyar Labubu edisi Spring Wild Home yang baru rilis dan paling diperebutkan di toko fisik Shanghai.',
      imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    },
    {
      sku: 'JDY-CNT-04',
      name: 'Judydoll 2-in-1 Dual-End Contour & Nose Bridge Highlight Stick',
      brand: 'Judydoll Shanghai',
      category: 'C-Beauty & Skincare' as const,
      priceIdr: 165000,
      originalPriceForeign: '¥35 RMB',
      surge: '+350% Xiaohongshu (RED)',
      source: 'Shanghai Beauty Hub',
      desc: 'Stick kontur hidung & tulang pipi viral Douyin dengan bayangan warna abu-abu netral alami.',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    },
    {
      sku: 'GZ-CLD-88',
      name: 'Xiaohongshu Puffy Cloud Quilted Hobo Shoulder Bag',
      brand: 'Guangzhou Studio',
      category: 'Fashion & Bags China' as const,
      priceIdr: 280000,
      originalPriceForeign: '¥65 RMB',
      surge: '+290% OOTD Viral',
      source: 'Shisanhang Wholesale',
      desc: 'Tas cloud lembut empuk aesthetic yang dikenakan selebgram Xiaohongshu, muat banyak dan ringan.',
      imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    },
    {
      sku: 'SZ-FAN-360',
      name: 'Shenzhen 360° Wireless Aromatherapy Folding Pocket Fan & Misting',
      brand: 'Shenzhen Tech Lab',
      category: 'Douyin Tech & Lifestyle' as const,
      priceIdr: 210000,
      originalPriceForeign: '¥49 RMB',
      surge: '+410% TikTok Live Hub',
      source: 'Huaqiangbei Electronics',
      desc: 'Kipas lipat saku multifungsi dengan semprotan nano mist dingin dan baterai 3000mAh powerbank.',
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    },
    {
      sku: 'CRY-SNT-09',
      name: 'Pop Mart Crybaby "Sunset Concert" Mini Figure Pendant Blind Box',
      brand: 'Pop Mart Official China',
      category: 'Pop Mart & Collectibles' as const,
      priceIdr: 460000,
      originalPriceForeign: '¥99 RMB',
      surge: '+520% Global Hype',
      source: 'Sanlitun Flagship Beijing',
      desc: 'Gantungan Crybaby edisi konser musik yang sold out dalam 5 menit pertama pembukaan toko.',
      imageUrl: 'https://images.unsplash.com/photo-1535572290543-960a8046f5af?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleAddViralToCatalog = (item: typeof chinaViralTrending[0]) => {
    if (products.some((p) => p.sku === item.sku || p.name === item.name)) {
      addToast(`"${item.name}" sudah terdaftar di katalog toko Anda!`, 'info');
      return;
    }

    addProduct({
      sku: item.sku,
      name: item.name,
      brand: item.brand,
      category: item.category,
      priceIdr: item.priceIdr,
      originalPriceForeign: item.originalPriceForeign,
      description: item.desc,
      specifications: [
        `Asal: ${item.source}, China`,
        'Kondisi: 100% Original Brand New',
        'Status: Trending Baru Banyak Dicari',
      ],
      images: [item.imageUrl],
      batchId: 'china-guangzhou-express',
      weightKg: 0.3,
      stockSlots: 10,
      maxSlots: 15,
      isAvailable: true,
      status: 'Published',
      originStore: item.source,
      estimatedArrival: '3-5 Hari Kirim Cepat',
      soldCount: 150,
      rating: 4.9,
      reviewCount: 24,
      isFreeShipping: true,
      isViralChina: true,
      tags: ['🔥 Baru Banyak Dicari', 'Viral China', item.surge],
    });

    addToast(`"${item.name}" berhasil ditambahkan ke katalog toko!`, 'success');
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#e8e2d9] gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#96422d]">Command Desk</span>
          <h1 className="font-serif text-3xl text-[#1e1c1a] mt-0.5">Sourcing Velocity & Telemetry China</h1>
          <p className="text-xs text-[#736e65] mt-1">
            Memantau pre-order aktif untuk batch <strong className="text-[#1e1c1a] font-mono">{currentTrip?.name || 'Guangzhou Direct Hub'}</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('owner-payments')}
            className="px-4 py-2 border border-[#1e1c1a] text-xs font-mono uppercase tracking-wider text-[#1e1c1a] hover:bg-[#faf8f5] transition-colors"
          >
            Review Slips ({pendingPayments.length})
          </button>
          <button
            onClick={() => navigate('owner-add-product')}
            className="px-4 py-2 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#333] transition-colors"
          >
            + Tambah Produk China
          </button>
        </div>
      </div>

      {/* METRIC CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Intake */}
        <div className="bg-white border border-[#e8e2d9] p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-[#736e65] uppercase">
            <span>Verified PO Intake</span>
            <TrendingUp className="w-4 h-4 text-[#2d6a4f]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#1e1c1a] mt-2">
            Rp {(totalIntakeIdr / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-[#2d6a4f] mt-1 flex items-center">
            <span>+28.5%</span>
            <span className="text-[#736e65] ml-1.5">vs Batch Sebelumnya</span>
          </div>
        </div>

        {/* Metric 2: Luggage Payload */}
        <div className="bg-white border border-[#e8e2d9] p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-[#736e65] uppercase">
            <span>Luggage Payload</span>
            <Luggage className="w-4 h-4 text-[#96422d]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#1e1c1a] mt-2">
            {currentTrip.luggageAllocatedKg} / {currentTrip.luggageCapacityKg} kg
          </div>
          <div className="w-full h-1.5 bg-[#f4eee6] mt-2 overflow-hidden">
            <div
              className="h-full bg-[#96422d]"
              style={{ width: `${Math.min(100, (currentTrip.luggageAllocatedKg / currentTrip.luggageCapacityKg) * 100)}%` }}
            />
          </div>
          <div className="text-[10px] font-mono text-[#736e65] mt-1.5">
            {(currentTrip.luggageCapacityKg - currentTrip.luggageAllocatedKg).toFixed(1)} kg available before quota lock
          </div>
        </div>

        {/* Metric 3: Active Orders */}
        <div className="bg-white border border-[#e8e2d9] p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-[#736e65] uppercase">
            <span>Confirmed Orders</span>
            <ClipboardList className="w-4 h-4 text-[#1e1c1a]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#1e1c1a] mt-2">
            {orders.length} Bookings
          </div>
          <div className="text-[11px] text-[#736e65] mt-1">
            {orders.filter((o) => o.orderStatus === 'Processing' || o.orderStatus === 'Paid').length} in active boutique manifest
          </div>
        </div>

        {/* Metric 4: Pending Slips */}
        <div className="bg-white border border-[#e8e2d9] p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-[#736e65] uppercase">
            <span>Pending Slip Audits</span>
            <AlertCircle className="w-4 h-4 text-[#b23a22]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#b23a22] mt-2">
            {pendingPayments.length} Unreconciled
          </div>
          <div className="text-[11px] text-[#736e65] mt-1">
            Awaiting Clara bank mutasi match
          </div>
        </div>

      </div>

      {/* TWO-COLUMN WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (Cols 1-7): Pending Verification & Intake Velocity */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Quick Verification Desk */}
          <div className="bg-white border border-[#e8e2d9] p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece6] mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#96422d]">Priority Audit</span>
                <h3 className="font-serif text-lg text-[#1e1c1a]">Pending Payment Slips</h3>
              </div>
              <button
                onClick={() => navigate('owner-payments')}
                className="text-xs font-mono uppercase text-[#736e65] hover:text-[#1e1c1a] flex items-center"
              >
                View Full Desk <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

            {pendingPayments.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#736e65]">
                <CheckCircle2 className="w-6 h-6 text-[#2d6a4f] mx-auto mb-2" />
                All customer transfer receipts are currently audited and verified.
              </div>
            ) : (
              <div className="divide-y divide-[#f0ece6]">
                {pendingPayments.map((p) => (
                  <div key={p.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-medium text-[#1e1c1a]">{p.orderId}</span>
                        <span className="text-[10px] font-mono bg-[#f4eee6] text-[#96422d] px-1.5">
                          Code: +Rp {p.uniqueDigits}
                        </span>
                      </div>
                      <div className="text-xs text-[#736e65] truncate mt-0.5">
                        {p.customerName} • {p.customerPhone}
                      </div>
                      <div className="font-mono text-xs font-semibold text-[#1e1c1a] mt-1">
                        Rp {p.totalExpected.toLocaleString('id-ID')} via {p.method}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => verifyPaymentSlip(p.id, true)}
                        className="px-3 py-1.5 bg-[#1e1c1a] text-white text-[11px] font-mono uppercase hover:bg-[#333]"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GRAFIK PEMBELIAN PRODUK PALING BAGUS */}
          <div className="bg-white border border-[#e8e2d9] p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#f0ece6] gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#96422d] font-semibold">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Analisis Performa Penjualan</span>
                </div>
                <h3 className="font-serif text-lg text-[#1e1c1a]">
                  Grafik Produk Pembelian Paling Bagus & Diminati
                </h3>
                <p className="text-xs text-[#736e65] mt-0.5">
                  Ranking produk paling laku berdasarkan akumulasi pembelian dan demand live.
                </p>
              </div>

              {/* Metric Switcher Tab */}
              <div className="flex items-center p-1 bg-[#f5f3f3] rounded-lg border border-[#e8e2d9] self-start sm:self-auto text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setChartMetric('revenue')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    chartMetric === 'revenue'
                      ? 'bg-white text-[#1b1c1c] font-bold shadow-xs'
                      : 'text-[#625e56] hover:text-[#1b1c1c]'
                  }`}
                >
                  💰 Total Omset (IDR)
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric('volume')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    chartMetric === 'volume'
                      ? 'bg-white text-[#1b1c1c] font-bold shadow-xs'
                      : 'text-[#625e56] hover:text-[#1b1c1c]'
                  }`}
                >
                  🔥 Unit Terjual (Volume)
                </button>
              </div>
            </div>

            {/* Top Spotlight Banner */}
            {topProduct && (
              <div className="p-3.5 bg-[#fdfbf7] border border-[#e8e2d9] rounded-lg flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-[#f4eee6] border border-[#e8e2d9] flex items-center justify-center font-bold text-amber-800 text-sm shrink-0">
                    👑 #1
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#96422d] uppercase font-bold">Produk Juara #1 Paling Diminati</span>
                    <h4 className="font-semibold text-[#1b1c1c] line-clamp-1">{topProduct.name}</h4>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    <Flame className="w-3 h-3 text-amber-600" />
                    High Velocity
                  </span>
                </div>
              </div>
            )}

            {/* Visual Ranking Graph Bars */}
            <div className="space-y-4 pt-2">
              {displayedTopProducts.map((item, index) => {
                const currentVal = chartMetric === 'revenue' ? item.revenueIdr : item.unitsSold;
                const percentage = Math.round((currentVal / maxMetricValue) * 100);

                return (
                  <div key={item.product.id} className="space-y-1.5 group">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0 pr-3">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                          index === 0
                            ? 'bg-amber-400 text-amber-950'
                            : index === 1
                            ? 'bg-stone-300 text-stone-900'
                            : index === 2
                            ? 'bg-amber-700 text-amber-50'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {index + 1}
                        </span>

                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-7 h-7 object-cover rounded border border-[#e8e2d9] shrink-0"
                        />

                        <div className="min-w-0">
                          <div className="font-medium text-[#1b1c1c] truncate text-xs flex items-center gap-2">
                            <span>{item.product.name}</span>
                            {item.product.category === 'Barang Viral China' && (
                              <span className="px-1.5 py-0.2 bg-red-50 text-red-700 border border-red-200 rounded text-[9px] font-mono shrink-0">
                                🔥 China Viral
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-[#747878]">
                            SKU: {item.product.sku} • {item.product.brand}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-[#1b1c1c]">
                          {chartMetric === 'revenue'
                            ? `Rp ${(item.revenueIdr / 1000000).toFixed(1)}M`
                            : `${item.unitsSold.toLocaleString('id-ID')} pcs`}
                        </div>
                        <div className="text-[10px] font-mono text-[#2d6a4f]">
                          {item.unitsSold.toLocaleString('id-ID')} terjual ({percentage}%)
                        </div>
                      </div>
                    </div>

                    {/* Bar visualization */}
                    <div className="w-full h-2.5 bg-[#f5f3f3] rounded-full overflow-hidden p-0.5 border border-[#e8e2d9]">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          index === 0
                            ? 'bg-gradient-to-r from-amber-500 to-[#96422d]'
                            : index === 1
                            ? 'bg-[#1e1c1a]'
                            : 'bg-[#625e56]'
                        }`}
                        style={{ width: `${Math.max(8, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Sourcing Advice */}
            <div className="pt-3 border-t border-[#f0ece6] text-[11px] text-[#736e65] flex items-center justify-between">
              <span>💡 Tip Kurator: Alokasikan kuota koper lebih besar untuk barang viral China & blind box dengan rasio omset tertinggi.</span>
              <button
                onClick={() => navigate('owner-products')}
                className="font-mono uppercase text-[#96422d] font-semibold hover:underline flex items-center gap-1 shrink-0 ml-2"
              >
                <span>Kelola Stok</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Daily Pre-Order Intake Velocity Chart */}
          <div className="bg-white border border-[#e8e2d9] p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece6] mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#736e65]">Intake Velocity</span>
                <h3 className="font-serif text-lg text-[#1e1c1a]">Daily Pre-Order Volume (IDR)</h3>
              </div>
              <span className="text-xs font-mono text-[#2d6a4f]">+24% vs Quota Cap</span>
            </div>

            {/* CSS Bar Chart */}
            <div className="h-36 flex items-end justify-between pt-4 px-2 gap-2">
              {[
                { day: 'Mar 18', amount: 8.5, height: '40%' },
                { day: 'Mar 19', amount: 14.2, height: '65%' },
                { day: 'Mar 20', amount: 19.8, height: '85%' },
                { day: 'Mar 21', amount: 12.0, height: '55%' },
                { day: 'Mar 22', amount: 22.4, height: '95%' },
                { day: 'Mar 23', amount: 16.5, height: '70%' },
                { day: 'Mar 24', amount: 18.2, height: '80%' },
              ].map((bar) => (
                <div key={bar.day} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="text-[10px] font-mono text-[#736e65] opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {bar.amount}M
                  </div>
                  <div
                    className="w-full bg-[#e8e2d9] group-hover:bg-[#1e1c1a] transition-colors rounded-t-xs"
                    style={{ height: bar.height }}
                  />
                  <span className="text-[10px] font-mono text-[#a8a196] mt-2 group-hover:text-[#1e1c1a]">
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* MENU BARANG VIRAL CHINA BARU & PALING BANYAK DICARI ORANG */}
          <div className="bg-white border border-[#e8e2d9] p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#f0ece6] gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-red-700 font-semibold">
                  <Flame className="w-3.5 h-3.5 text-red-600" />
                  <span>Live China Demand Radar</span>
                </div>
                <h3 className="font-serif text-lg text-[#1e1c1a]">
                  Menu Barang Viral China (Baru & Paling Dicari Orang)
                </h3>
                <p className="text-xs text-[#736e65] mt-0.5">
                  Produk dengan lonjakan pencarian tertinggi di Douyin, Xiaohongshu, dan Taobao. 1-klik untuk menambahkan ke katalog toko.
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-800 text-[11px] font-mono font-bold border border-red-200 self-start sm:self-auto flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-red-600" />
                Live Trending
              </span>
            </div>

            <div className="space-y-3">
              {chinaViralTrending.map((item) => {
                const isAlreadyAdded = products.some((p) => p.sku === item.sku || p.name === item.name);

                return (
                  <div
                    key={item.sku}
                    className="p-3.5 bg-[#fbf9f8] border border-[#e8e2d9] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#1b1c1c] transition-all"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg border border-[#e8e2d9] shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-100 text-red-800 border border-red-200">
                            🔥 {item.surge}
                          </span>
                          <span className="text-[10px] font-mono text-[#747878]">
                            {item.brand} • {item.source}
                          </span>
                        </div>
                        <h4 className="font-semibold text-xs text-[#1b1c1c] line-clamp-1">{item.name}</h4>
                        <p className="text-[11px] text-[#736e65] line-clamp-1 mt-0.5">{item.desc}</p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#e8e2d9]/60">
                      <div className="text-left sm:text-right">
                        <div className="font-mono font-bold text-xs text-[#1b1c1c]">
                          Rp {item.priceIdr.toLocaleString('id-ID')}
                        </div>
                        <div className="text-[10px] font-mono text-[#747878]">
                          Orig: {item.originalPriceForeign}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddViralToCatalog(item)}
                        disabled={isAlreadyAdded}
                        className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shadow-xs ${
                          isAlreadyAdded
                            ? 'bg-[#eae8e7] text-[#625e56] cursor-not-allowed border border-[#d4cbbf]'
                            : 'bg-[#1b1c1c] hover:bg-neutral-800 text-white'
                        }`}
                      >
                        {isAlreadyAdded ? (
                          <>
                            <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
                            <span>Ada di Katalog</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Masukkan Toko</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => navigate('owner-products')}
                className="text-xs font-mono uppercase text-[#96422d] hover:underline inline-flex items-center gap-1"
              >
                <span>Lihat Semua Produk Aktif ({products.length})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Column (Cols 8-12): Flight Telemetry & Payload breakdown */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Flight Card */}
          <div className="bg-[#24211e] text-[#e8e2d9] p-6 border border-[#3b3632]">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#c27863] pb-3 border-b border-[#3b3632] mb-4">
              <span className="flex items-center">
                <Plane className="w-3.5 h-3.5 mr-1" /> Penerbangan {currentTrip.flightCode}
              </span>
              <span>{currentTrip.travelDates}</span>
            </div>

            <h3 className="font-serif text-xl text-white mb-2">{currentTrip.name}</h3>
            <p className="text-xs text-[#a8a196] mb-4 leading-relaxed">
              Pop Mart Huaihai Road Shanghai, Sentra Grosir Shisanhang Guangzhou, & Pasar Elektronik Huaqiangbei Shenzhen.
            </p>

            <div className="bg-[#1c1a18] p-3 text-xs font-mono space-y-2 border border-[#302b28]">
              <div className="flex justify-between text-[#8a847d]">
                <span>Guangzhou Baiyun (CAN)</span>
                <span className="text-white">Mar 30, 11:45 CST</span>
              </div>
              <div className="flex justify-between text-[#8a847d]">
                <span>Jakarta CGK Landing</span>
                <span className="text-white">{currentTrip.flightReturn}</span>
              </div>
              <div className="flex justify-between text-[#8a847d]">
                <span>Customs Declaration</span>
                <span className="text-[#c27863]">Electronic Passenger Baggage (ECD)</span>
              </div>
            </div>
          </div>

          {/* Luggage Category Breakdown */}
          <div className="bg-white border border-[#e8e2d9] p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg text-[#1e1c1a] pb-2 border-b border-[#f0ece6]">
              Alokasi Payload Koper Hand-Carry
            </h3>

            <div className="space-y-3 text-xs">
              {[
                { cat: 'Pop Mart Blind Box & Vinyl Plush (Labubu, Crybaby)', weight: '18.5 kg', pct: 44 },
                { cat: 'C-Beauty & Skincare (Flower Knows, Judydoll)', weight: '11.2 kg', pct: 26 },
                { cat: 'Douyin Ambient Lamps & Tech Gadgets (Shenzhen)', weight: '7.8 kg', pct: 18 },
                { cat: 'Fashion & Tas Desainer Guangzhou (Chicever, Feiyue)', weight: '5.0 kg', pct: 12 },
              ].map((item) => (
                <div key={item.cat}>
                  <div className="flex justify-between text-[#1e1c1a] mb-1">
                    <span className="truncate pr-2">{item.cat}</span>
                    <span className="font-mono font-medium shrink-0">{item.weight}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#f4eee6]">
                    <div className="h-full bg-[#1e1c1a]" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#f0ece6] text-[11px] text-[#736e65]">
              Kuota bagasi: 2 × 23kg checked cases + 2 × 10kg cabin priority hand-carry.
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="p-4 bg-[#f4eee6] border border-[#e8e2d9] text-xs space-y-2">
            <div className="font-medium text-[#1e1c1a]">Shopper Actions</div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => navigate('owner-orders')}
                className="p-2.5 bg-white border border-[#d4cbbf] text-left hover:border-[#1e1c1a] transition-colors"
              >
                <div className="font-mono uppercase text-[10px] text-[#736e65]">Manage</div>
                <div className="font-medium text-[#1e1c1a] text-xs">All Orders</div>
              </button>
              <button
                onClick={() => navigate('owner-inventory')}
                className="p-2.5 bg-white border border-[#d4cbbf] text-left hover:border-[#1e1c1a] transition-colors"
              >
                <div className="font-mono uppercase text-[10px] text-[#736e65]">Inspect</div>
                <div className="font-medium text-[#1e1c1a] text-xs">Suitcase Slots</div>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
