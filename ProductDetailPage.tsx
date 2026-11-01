import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    navigate,
    addToCart,
    setIsCartDrawerOpen,
    currentUser,
    openAuthModal,
  } = useApp();

  const product =
    products.find((p) => p.id === selectedProductId) ||
    products[0]; // fallback to first item

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0]?.options[0] || 'Default'
  );
  const [quantity, setQuantity] = useState(1);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('acc-1');

  const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  const handleQtyChange = (delta: number) => {
    const max = product.maxOrderPerPerson || 2;
    const min = product.minOrder || 1;
    const next = quantity + delta;
    if (next >= min && next <= max) {
      setQuantity(next);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    setIsCartDrawerOpen(true);
  };

  const handleDirectCheckout = () => {
    addToCart(product, quantity, selectedVariant);
    if (!currentUser) {
      openAuthModal('login', () => navigate('checkout'));
    } else if (!currentUser.isEmailVerified) {
      openAuthModal('verify', () => navigate('checkout'));
    } else {
      navigate('checkout');
    }
  };

  const companionItems = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 lg:px-12 pt-6 pb-20">
      {/* 1. Breadcrumbs & Flight Live Badge */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center justify-between gap-4 py-3 mb-6">
        <ol className="flex items-center flex-wrap gap-2 text-xs uppercase tracking-wider text-[#625e56]">
          <li>
            <button onClick={() => navigate('home')} className="hover:text-[#1b1c1c]">Home</button>
          </li>
          <li className="text-[#c4c7c7]">/</li>
          <li>
            <button onClick={() => navigate('shop')} className="hover:text-[#1b1c1c]">Shop Drops</button>
          </li>
          <li className="text-[#c4c7c7]">/</li>
          <li>
            <span className="hover:text-[#1b1c1c]">{product.category}</span>
          </li>
          <li className="text-[#c4c7c7]">/</li>
          <li className="text-[#1b1c1c] font-semibold truncate max-w-[200px] md:max-w-none">
            {product.name}
          </li>
        </ol>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e9e2d7]/70 text-[#1e1b15] text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c06e4c] animate-pulse"></span>
          <span>China Direct Batch #01 Live</span>
        </div>
      </nav>

      {/* 2. Split Showcase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
        {/* LEFT COLUMN: Image Gallery & Assurance */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Main Stage Image */}
          <div className="relative rounded-2xl overflow-hidden bg-white border border-[#e6dfd5] shadow-sm aspect-[4/5] w-full">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            {/* Origin Badge */}
            <div className="absolute top-4 left-4 backdrop-blur-md bg-white/90 px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-[#e6dfd5]">
              <span className="material-symbols-outlined text-[#625e56] text-[15px]">pin_drop</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1b1c1c]">
                {product.originStore}
              </span>
            </div>
            {/* Live Purchase Slip Verified */}
            <div className="absolute bottom-4 right-4 backdrop-blur-md bg-[#1b1c1c]/90 text-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm text-[10px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">receipt_long</span>
              <span>Live Purchase Slip Verified</span>
            </div>
            {/* Weight Overlay */}
            <div className="absolute bottom-4 left-4 backdrop-blur-md bg-white/90 px-3 py-1 rounded-full flex items-center gap-1.5 text-[#625e56] shadow-sm text-[10px] border border-[#e6dfd5]">
              <span className="material-symbols-outlined text-[14px]">luggage</span>
              <span>{product.weightKg} kg / Hand-carry Checked Rimowa</span>
            </div>
          </div>

          {/* Thumbnail Selector */}
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative rounded-xl overflow-hidden bg-[#f5f3f3] aspect-[4/5] border transition-all ${
                  selectedImageIndex === idx
                    ? 'border-[#1b1c1c] ring-2 ring-[#1b1c1c]'
                    : 'border-[#e6dfd5] opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                <span className="absolute bottom-1 inset-x-1 text-center text-[10px] bg-white/80 py-0.5 rounded text-[#1b1c1c] font-semibold">
                  {idx === 0 ? 'Front' : idx === 1 ? 'Detail' : idx === 2 ? 'Packaging' : 'Editorial'}
                </span>
              </button>
            ))}
          </div>

          {/* Authentic Assurance Featurette Box */}
          <div className="rounded-2xl p-5 bg-white border border-[#e6dfd5] shadow-xs flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#f5f3f3] flex items-center justify-center shrink-0 text-[#2a5a44]">
                <span className="material-symbols-outlined text-[22px]">verified</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#1b1c1c]">Curator Hand-Purchased in Tokyo</p>
                <p className="text-[11px] text-[#625e56] mt-0.5 leading-relaxed">
                  Original bilingual paper invoice, boutique dust bag, care manual & serial card included in packaging.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsReceiptModalOpen(true)}
              className="shrink-0 px-4 py-2 rounded-full bg-[#eae8e7] hover:bg-[#e9e2d7] text-[11px] font-bold uppercase tracking-wider text-[#1b1c1c] flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>Sample Receipt</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Purchase, Quota & Sourcing Engine */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-widest uppercase text-[#625e56]">
                {product.brand}
              </span>
              <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#eae8e7] text-[#625e56]">
                REF: {product.sku}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1b1c1c] font-medium leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 pt-1 text-[#625e56] text-xs">
              <span className="material-symbols-outlined text-[16px] text-[#c06e4c]">store</span>
              <span>Direct boutique allocation · {product.originStore}</span>
              <span>·</span>
              <span className="text-[#1b1c1c] font-medium">100% Tax-Free Slip</span>
            </div>
          </div>

          {/* Pricing Card with Transparent Breakdown */}
          <div className="rounded-2xl p-6 bg-white border border-[#e6dfd5] shadow-xs space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#625e56] block">
                  All-Inclusive Jastip Price
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-[#1b1c1c] tracking-tight mt-0.5">
                  {formatRupiah(product.priceIdr * quantity)}
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e9e2d7] text-[#1e1b15] text-[10px] font-bold uppercase">
                  Tokyo Direct
                </span>
                <p className="text-xs text-[#747878] line-through mt-1">
                  ID Retail {formatRupiah(Math.round(product.priceIdr * 1.25))}
                </p>
              </div>
            </div>

            {/* Transparent Cost Architecture */}
            <div className="pt-3 bg-[#f5f3f3] rounded-xl p-3 text-xs text-[#444748] space-y-1">
              <div className="flex items-center justify-between font-semibold text-[#1b1c1c]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">calculate</span>
                  <span>Transparent Cost Architecture</span>
                </span>
                <span className="text-[#c06e4c] text-[10px] uppercase font-bold">No Hidden Surcharges</span>
              </div>
              <p className="text-[11px] text-[#625e56] leading-relaxed">
                Tokyo in-store price ({product.originalPriceForeign || '¥58,000'}) + Personal shopper curation & inspection fee + Hand-carry Rimowa baggage quota + Indonesia Bea Cukai official passenger import duty.
              </p>
            </div>
          </div>

          {/* Batch 04 Sourcing Itinerary */}
          <div className="rounded-2xl p-5 bg-[#f5f3f3] border border-[#e6dfd5] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#625e56] text-[18px]">calendar_month</span>
                <h3 className="text-xs font-bold text-[#1b1c1c] uppercase tracking-wider">
                  Batch 04 Sourcing Itinerary
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white text-[#1b1c1c]">
                Tokyo Spring 2025
              </span>
            </div>

            <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#c4c7c7]/60 text-xs">
              <div className="relative">
                <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-[#c06e4c] ring-4 ring-[#f5f3f3]"></span>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1b1c1c]">Pre-Order & Payment Cutoff</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#ffdbce] text-[#c06e4c] font-bold">
                    In 2 Days
                  </span>
                </div>
                <p className="text-[11px] text-[#625e56]">26 March 2025 · 23:59 WIB (Strict cutoff for queue token)</p>
              </div>

              <div className="relative">
                <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-[#625e56] ring-4 ring-[#f5f3f3]"></span>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1b1c1c]">In-Store Procurement & Live Verification</span>
                  <span className="text-[11px] text-[#747878]">Tokyo Time</span>
                </div>
                <p className="text-[11px] text-[#625e56]">29 March 2025 · Real-time WhatsApp video & dust bag unboxing</p>
              </div>

              <div className="relative">
                <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-[#1b1c1c] ring-4 ring-[#f5f3f3]"></span>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1b1c1c]">Jakarta Courier Dispatch</span>
                  <span className="text-[10px] text-[#2a5a44] font-bold">Free JNE YES / Paxel</span>
                </div>
                <p className="text-[11px] text-[#625e56]">03 April 2025 · Dispatched via Paxel Cold-Chain or JNE YES bubble box</p>
              </div>
            </div>
          </div>

          {/* Luggage Saturation Gauge */}
          <div className="rounded-2xl p-5 bg-white border border-[#e6dfd5] shadow-xs space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-[#1b1c1c]">Luggage Saturation Status</span>
              <span className="text-[11px] font-bold text-[#c06e4c] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                {product.stockSlots} Slots Left
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#f5f3f3] overflow-hidden">
              <div className="h-full bg-[#1b1c1c] rounded-full w-[82%]" />
            </div>
            <div className="flex justify-between text-[11px] text-[#625e56]">
              <span>Allocated: 82% of batch trunk space</span>
              <span className="text-[#1b1c1c] font-semibold">
                Item Weight: {(product.weightKg * quantity).toFixed(2)} kg
              </span>
            </div>
          </div>

          {/* Variant Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wider text-[#625e56]">
                  {product.variants[0].name}
                </span>
                <span className="font-semibold text-[#1b1c1c]">{selectedVariant}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {product.variants[0].options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedVariant(opt)}
                    className={`p-2.5 rounded-xl text-left text-xs font-semibold border transition-all ${
                      selectedVariant === opt
                        ? 'border-[#1b1c1c] bg-[#fbf9f8] ring-1 ring-[#1b1c1c] text-[#1b1c1c]'
                        : 'border-[#e6dfd5] bg-white text-[#625e56] hover:bg-[#f5f3f3]'
                    }`}
                  >
                    <span className="truncate block">{opt.split('(')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dimensions */}
          {product.dimensions && (
            <div className="p-3 bg-white rounded-xl border border-[#e6dfd5] flex items-center justify-between text-xs text-[#1b1c1c]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#625e56] text-[16px]">straighten</span>
                <span>Dimensions: {product.dimensions}</span>
              </div>
              <span className="text-[#747878] text-[11px]">Hand-carry approved</span>
            </div>
          )}

          {/* Quantity Selector with Bea Cukai Note */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold uppercase tracking-wider text-[#625e56]">Quantity</span>
              <span className="text-[11px] text-[#747878]">
                Max {product.maxOrderPerPerson || 2} pcs per Indonesian NIK (Bea Cukai)
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center rounded-full bg-white border border-[#e6dfd5] p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => handleQtyChange(-1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f5f3f3] text-[#1b1c1c]"
                >
                  <span className="material-symbols-outlined text-[16px]">remove</span>
                </button>
                <span className="w-10 text-center font-bold text-sm text-[#1b1c1c]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQtyChange(1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f5f3f3] text-[#1b1c1c]"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
              <div className="text-xs text-[#625e56]">
                Total weight:{' '}
                <span className="font-semibold text-[#1b1c1c]">
                  {(product.weightKg * quantity).toFixed(2)} kg
                </span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full h-12 rounded-full bg-[#1b1c1c] hover:bg-neutral-800 text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2.5 transition-colors shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              <span>Add to Pre-Order Cart · {formatRupiah(product.priceIdr * quantity)}</span>
            </button>

            <button
              type="button"
              onClick={handleDirectCheckout}
              className="w-full h-11 rounded-full bg-[#eae8e7] hover:bg-[#e9e2d7] text-[#1b1c1c] text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>Reserve & Direct Checkout</span>
            </button>

            <a
              href={`https://wa.me/?text=Hello%20Atelier%20Jastip,%20I%20am%20inquiring%20about%20the%20${encodeURIComponent(
                product.name
              )}%20(SKU:%20${product.sku}).`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 rounded-full flex items-center justify-center gap-2 text-[#625e56] hover:text-[#1b1c1c] text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>Ask Clara (Curator) on WhatsApp</span>
            </a>
          </div>

          {/* Accordion Policies */}
          <div className="pt-4 space-y-2">
            <div className="rounded-xl bg-white border border-[#e6dfd5] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === 'acc-1' ? null : 'acc-1')}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs font-bold text-[#1b1c1c]"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#625e56] text-[18px]">verified</span>
                  100% Authenticity & Boutique Receipts
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#625e56]">
                  {openAccordion === 'acc-1' ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              {openAccordion === 'acc-1' && (
                <div className="px-5 pb-4 text-xs text-[#444748] space-y-1.5 border-t border-[#e6dfd5]/40 pt-2 leading-relaxed">
                  <p>Every piece is acquired in-person at official brand flagships or premier department stores in Ginza or Shibuya.</p>
                  <p className="text-[11px] text-[#747878]">You receive the physical paper tax-free receipt, official dust bag, warranty booklet, and store tags.</p>
                </div>
              )}
            </div>

            <div className="rounded-xl bg-white border border-[#e6dfd5] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === 'acc-2' ? null : 'acc-2')}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs font-bold text-[#1b1c1c]"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#625e56] text-[18px]">payments</span>
                  Indonesian Payment Methods & Escrow
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#625e56]">
                  {openAccordion === 'acc-2' ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              {openAccordion === 'acc-2' && (
                <div className="px-5 pb-4 text-xs text-[#444748] space-y-1.5 border-t border-[#e6dfd5]/40 pt-2 leading-relaxed">
                  <p>We support BCA, BNI, CIMB Niaga manual bank transfers with unique 3-digit anti-collision verification digits, and instant QRIS.</p>
                </div>
              )}
            </div>

            <div className="rounded-xl bg-white border border-[#e6dfd5] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === 'acc-3' ? null : 'acc-3')}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs font-bold text-[#1b1c1c]"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#625e56] text-[18px]">gavel</span>
                  Customs & Bea Cukai Transparency
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#625e56]">
                  {openAccordion === 'acc-3' ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              {openAccordion === 'acc-3' && (
                <div className="px-5 pb-4 text-xs text-[#444748] space-y-1.5 border-t border-[#e6dfd5]/40 pt-2 leading-relaxed">
                  <p>All items comply with Indonesian Customs Regulations (PMK No. 203/PMK.04/2017). All applicable import taxes are pre-calculated and cleared transparently.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Companion Items: Frequently Paired in Luggage */}
      <div className="mt-20 pt-12 border-t border-[#e6dfd5]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#625e56]">Tokyo Batch 04 Additions</span>
            <h2 className="font-serif text-2xl lg:text-3xl text-[#1b1c1c] mt-1">Frequently Paired in Luggage</h2>
          </div>
          <p className="text-xs text-[#625e56] max-w-md">
            Consolidate multiple items in the same flight luggage to enjoy combined Jakarta dispatch and complimentary courier insurance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {companionItems.map((comp) => (
            <div
              key={comp.id}
              className="bg-white rounded-2xl p-4 border border-[#e6dfd5] shadow-xs flex flex-col justify-between group"
            >
              <div
                className="space-y-3 cursor-pointer"
                onClick={() => navigate('product-detail', { productId: comp.id })}
              >
                <div className="relative rounded-xl overflow-hidden bg-[#f5f3f3] aspect-[4/5] w-full">
                  <img
                    src={comp.images[0]}
                    alt={comp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/90 text-[#1b1c1c] text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border border-[#e6dfd5]">
                    {comp.originStore.split(' ')[0]}
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-white/90 text-[#625e56] text-[10px] font-mono border border-[#e6dfd5]">
                    {comp.weightKg} kg
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#625e56]">
                    {comp.brand}
                  </span>
                  <h3 className="font-serif text-sm font-semibold text-[#1b1c1c] mt-0.5 truncate group-hover:underline">
                    {comp.name}
                  </h3>
                  <p className="text-[11px] text-[#747878] truncate mt-0.5">{comp.description}</p>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-[#e6dfd5] flex items-center justify-between">
                <span className="text-xs font-bold text-[#1b1c1c]">{formatRupiah(comp.priceIdr)}</span>
                <button
                  type="button"
                  onClick={() => addToCart(comp, 1)}
                  className="w-8 h-8 rounded-full bg-[#eae8e7] hover:bg-[#1b1c1c] hover:text-white transition-colors flex items-center justify-center text-[#1b1c1c]"
                  title="Add to pre-order cart"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SAMPLE BOUTIQUE RECEIPT POPUP MODAL */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl border border-[#e6dfd5] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e6dfd5]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#625e56]">receipt</span>
                <h3 className="font-serif text-base font-bold text-[#1b1c1c]">Authentic Store Receipt Sample</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#f5f3f3] flex items-center justify-center text-[#625e56]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="rounded-xl bg-[#f5f3f3] p-5 font-mono text-xs text-[#1b1c1c] space-y-2 border border-[#e6dfd5]">
              <div className="text-center pb-3 border-b border-dashed border-[#747878]/50">
                <p className="font-bold tracking-widest uppercase text-sm">ISSEY MIYAKE GINZA</p>
                <p className="text-[#625e56] text-[11px]">4-4-4 Ginza, Chuo-ku, Tokyo 104-0061</p>
                <p className="text-[#625e56] text-[11px]">Store Reg: 03-3566-5225 · Cashier #04</p>
              </div>
              <div className="flex justify-between pt-2">
                <span>BB LUCENT MATTE 6X6 (BLK)</span>
                <span>¥58,000</span>
              </div>
              <div className="flex justify-between text-[#625e56]">
                <span>TAX FREE (CONSUMPTION TAX 10%)</span>
                <span>-¥5,800</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-dashed border-[#747878]/50">
                <span>TOTAL TAX-FREE CHARGE</span>
                <span>¥58,000</span>
              </div>
              <div className="pt-2 text-[10px] text-[#625e56] text-center leading-relaxed">
                Passport verification stamped. Digital copy uploaded to your Atelier order timeline instantly upon in-store checkout.
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(false)}
                className="px-5 py-2 rounded-full bg-[#1b1c1c] text-white text-xs font-bold uppercase tracking-wider"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
