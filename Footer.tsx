import React from 'react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  return (
    <footer className="w-full bg-[#f5f3f3] text-[#1b1c1c] border-t border-[#e6dfd5] mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-[#c4c7c7]/30">
          {/* Brand Column */}
          <div className="lg:col-span-2 pr-0 lg:pr-12">
            <span className="font-serif text-2xl tracking-tight uppercase text-[#1b1c1c] block mb-2 font-medium">
              Atelier Jastip
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#625e56] mb-4">
              Curated Personal Shopping Suite
            </p>
            <p className="text-sm text-[#444748] max-w-sm mb-6 leading-relaxed">
              Jasa titip kurasi langsung dari China (Guangzhou, Shanghai, Shenzhen, & Yiwu) untuk kolektor & pecinta produk viral. Pop Mart 100% original, C-Beauty terhits, gadget Douyin, dan fashion terkini dengan invoice digital otomatis langsung di dalam web.
            </p>
            <div className="flex items-center gap-2.5 text-[#625e56] text-xs">
              <span className="material-symbols-outlined text-[18px] text-[#2a5a44]">verified</span>
              <span>100% Original & Struk Pembelian Toko Resmi</span>
            </div>
          </div>

          {/* Discovery */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] mb-4">
              Katalog China
            </h4>
            <ul className="space-y-2.5 text-xs text-[#444748]">
              <li>
                <button
                  onClick={() => navigate('shop')}
                  className="hover:text-[#1b1c1c] transition-colors"
                >
                  Semua Produk Drops
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('shop')}
                  className="hover:text-[#1b1c1c] transition-colors"
                >
                  Pop Mart & Blind Box Viral
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('shop')}
                  className="hover:text-[#1b1c1c] transition-colors"
                >
                  Guangzhou Wholesale & Fashion
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate('home');
                    setTimeout(() => {
                      document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-[#1b1c1c] transition-colors"
                >
                  Baggage & Weight Limits
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#1b1c1c] transition-colors"
                >
                  Custom Sourcing Request
                </a>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] mb-4">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-[#444748]">
              <li>
                <button
                  onClick={() => navigate('buyer-orders')}
                  className="hover:text-[#1b1c1c] transition-colors"
                >
                  Order Status & Flight Manifest
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#1b1c1c] transition-colors"
                >
                  Direct VIP WhatsApp
                </a>
              </li>
              <li>
                <span className="text-[#747878]">Bank Transfer & Settlement</span>
              </li>
              <li>
                <span className="text-[#747878]">Paxel Cold Chain & JNE Cargo</span>
              </li>
              <li>
                <span className="text-[#747878]">Authenticity Guarantee & Customs</span>
              </li>
            </ul>
          </div>

          {/* Payment & Escrow */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] mb-3">
              Payment & Escrow
            </h4>
            <p className="text-xs text-[#444748] mb-4 leading-relaxed">
              Instant manual check and automated multi-bank verification.
            </p>
            <div className="flex flex-wrap gap-1.5 mb-6">
              <span className="px-2.5 py-1 text-[11px] font-semibold rounded bg-white text-[#1b1c1c] border border-[#e6dfd5]">
                BCA
              </span>
              <span className="px-2.5 py-1 text-[11px] font-semibold rounded bg-white text-[#1b1c1c] border border-[#e6dfd5]">
                BNI
              </span>
              <span className="px-2.5 py-1 text-[11px] font-semibold rounded bg-white text-[#1b1c1c] border border-[#e6dfd5]">
                CIMB
              </span>
              <span className="px-2.5 py-1 text-[11px] font-semibold rounded bg-white text-[#1b1c1c] border border-[#e6dfd5]">
                QRIS
              </span>
              <span className="px-2.5 py-1 text-[11px] font-semibold rounded bg-white text-[#1b1c1c] border border-[#e6dfd5]">
                VISA
              </span>
            </div>
            <div className="pt-2 border-t border-[#c4c7c7]/30 text-[11px] text-[#747878]">
              <span>Direct Bank Transfer: BNI, BCA, & CIMB Niaga</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#747878] gap-4">
          <p>© 2025 Atelier Jastip China. Jakarta — Guangzhou — Shanghai — Shenzhen. All rights reserved.</p>
          <div className="flex items-center gap-5 text-[11px] uppercase tracking-wider">
            <span className="hover:text-[#1b1c1c] cursor-pointer">Terms of Sourcing</span>
            <span className="hover:text-[#1b1c1c] cursor-pointer">Customs Declaration (ECD)</span>
            <span className="hover:text-[#1b1c1c] cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
