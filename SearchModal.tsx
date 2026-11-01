import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const SearchModal: React.FC = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, products, navigate } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isSearchModalOpen) return null;

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#e6dfd5] overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#e6dfd5] flex items-center gap-3">
          <span className="material-symbols-outlined text-[#747878] text-[22px]">search</span>
          <input
            autoFocus
            type="text"
            placeholder="Search Japanese or Parisian items (e.g., Issey Miyake, Le Labo, SK-II, BBM-001)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm text-[#1b1c1c] placeholder:text-[#747878]/60 focus:outline-none bg-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-[#747878] hover:text-[#1b1c1c] text-xs uppercase"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-[#f5f3f3] flex items-center justify-center text-[#747878] hover:text-[#1b1c1c]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Suggested Quick Searches */}
        <div className="px-5 py-3 bg-[#f5f3f3]/60 border-b border-[#e6dfd5]/60 flex items-center gap-2 overflow-x-auto text-xs text-[#625e56]">
          <span className="font-semibold text-[#1b1c1c] shrink-0">Popular:</span>
          {['Issey Miyake', 'Le Labo Gaiac 10', 'Shiseido Fino', 'Tokyo Banana', 'Human Made'].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => setSearchTerm(tag)}
                className="px-2.5 py-1 rounded-full bg-white border border-[#e6dfd5] hover:border-[#1b1c1c] transition-colors shrink-0"
              >
                {tag}
              </button>
            )
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#747878]">
              <span className="material-symbols-outlined text-[36px] mb-2 opacity-50">search_off</span>
              <p className="text-sm font-medium">No curated drops match "{searchTerm}"</p>
              <p className="text-xs mt-1">Try searching for a brand, item name, or category.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setIsSearchModalOpen(false);
                  navigate('product-detail', { productId: item.id });
                }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#f5f3f3] transition-colors cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-lg bg-[#efeded] overflow-hidden shrink-0">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#625e56]">
                      {item.brand}
                    </span>
                    <span className="text-[10px] text-[#747878]">· {item.sku}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#1b1c1c] truncate">{item.name}</h4>
                  <p className="text-xs text-[#747878] truncate">{item.originStore}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-[#1b1c1c]">{formatRupiah(item.priceIdr)}</span>
                  <span className="block text-[10px] text-[#2a5a44] font-medium">
                    {item.stockSlots > 0 ? `${item.stockSlots} slots left` : 'Waitlist Only'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
