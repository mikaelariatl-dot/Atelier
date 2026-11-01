import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Star
} from 'lucide-react';
import { Product, ProductCategory } from '../../types';

export const OwnerProducts: React.FC = () => {
  const { products, deleteProduct, updateProduct, navigate, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove "${name}" from the active sourcing manifest?`)) {
      deleteProduct(id);
    }
  };

  const handleToggleAvailable = (product: Product) => {
    updateProduct(product.id, { isAvailable: !product.isAvailable });
    addToast(`"${product.name}" marked as ${!product.isAvailable ? 'Available' : 'Paused'}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e8e2d9] gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#96422d]">Curator Catalog</span>
          <h1 className="font-serif text-3xl text-[#1e1c1a] mt-0.5">Product Management</h1>
          <p className="text-xs text-[#736e65] mt-1">
            Maintain boutique items, quota limits, prices, and luggage payload weights.
          </p>
        </div>

        <button
          onClick={() => navigate('owner-add-product')}
          className="inline-flex items-center px-4 py-2 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#333] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Sourced Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#e8e2d9] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Item Name, Brand, SKU..."
            className="w-full text-xs pl-8 pr-3 py-2 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none"
          />
          <Search className="w-4 h-4 text-[#a8a196] absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-[#d4cbbf] bg-white font-mono text-xs focus:outline-none"
          >
            <option value="all">Semua Kategori</option>
            <option value="Barang Viral China">Barang Viral China</option>
            <option value="Pop Mart & Collectibles">Pop Mart & Collectibles</option>
            <option value="C-Beauty & Skincare">C-Beauty & Skincare</option>
            <option value="Fashion & Bags China">Fashion & Bags China</option>
            <option value="Douyin Tech & Lifestyle">Douyin Tech & Lifestyle</option>
            <option value="China Tea & Snacks">China Tea & Snacks</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#e8e2d9] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f5f2] border-b border-[#e8e2d9] font-mono uppercase text-[#736e65] text-[10px]">
              <tr>
                <th className="p-3.5">Product & SKU</th>
                <th className="p-3.5">Category & Store</th>
                <th className="p-3.5">Price (IDR)</th>
                <th className="p-3.5">Weight</th>
                <th className="p-3.5">Quota Slots</th>
                <th className="p-3.5">Active</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ece6]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#736e65]">
                    No products found matching query.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  return (
                    <tr key={p.id} className="hover:bg-[#faf8f5] transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center space-x-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-12 h-12 object-cover bg-[#f4eee6] border border-[#e8e2d9] shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="text-[10px] font-mono text-[#96422d] uppercase">
                              {p.brand} • {p.sku}
                            </div>
                            <div className="font-medium text-[#1e1c1a] truncate">{p.name}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="text-[#1e1c1a]">{p.category}</div>
                        <div className="text-[10px] text-[#736e65]">{p.originStore}</div>
                      </td>

                      <td className="p-3.5 font-mono">
                        <div className="font-semibold text-[#1e1c1a]">
                          Rp {p.priceIdr.toLocaleString('id-ID')}
                        </div>
                        {p.originalPriceForeign && (
                          <div className="text-[10px] text-[#736e65]">
                            {p.originalPriceForeign}
                          </div>
                        )}
                      </td>

                      <td className="p-3.5 font-mono text-[#736e65]">
                        {p.weightKg} kg
                      </td>

                      <td className="p-3.5">
                        <div className="font-mono text-xs text-[#1e1c1a]">
                          {p.stockSlots} / {p.maxSlots} slots remaining
                        </div>
                        <div className="w-20 h-1 bg-[#f4eee6] mt-1 overflow-hidden">
                          <div
                            className="h-full bg-[#1e1c1a]"
                            style={{ width: `${((p.maxSlots - p.stockSlots) / p.maxSlots) * 100}%` }}
                          />
                        </div>
                      </td>

                      <td className="p-3.5">
                        <button
                          onClick={() => handleToggleAvailable(p)}
                          className={`px-2 py-0.5 text-[10px] font-mono uppercase border ${
                            p.isAvailable
                              ? 'bg-[#d8f3dc] text-[#1b4332] border-[#b7e4c7]'
                              : 'bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]'
                          }`}
                        >
                          {p.isAvailable ? 'Available' : 'Paused'}
                        </button>
                      </td>

                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => navigate('owner-add-product')}
                          className="p-1.5 text-[#736e65] hover:text-[#1e1c1a] hover:bg-[#f4eee6] rounded-xs"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 text-[#96422d] hover:text-[#7e3624] hover:bg-[#fdf2f0] rounded-xs"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
