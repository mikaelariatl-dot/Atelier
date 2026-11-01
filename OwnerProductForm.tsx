import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Product, ProductCategory } from '../../types';

export const OwnerProductForm: React.FC = () => {
  const { addProduct, navigate, addToast } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    sku: `AT-${Math.floor(1000 + Math.random() * 9000)}`,
    category: 'Luxury & Designer Bags' as ProductCategory,
    originStore: 'Ginza Flagship, Tokyo',
    priceIdr: 2500000,
    originalPriceForeign: '¥25,000',
    weightKg: 0.45,
    stockSlots: 5,
    maxSlots: 5,
    isAvailable: true,
    status: 'Published' as 'Published' | 'Draft' | 'Archived',
    estimatedArrival: 'Apr 02, 2025',
    description: '',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    ],
    specifications: [
      'Authentic in-store paper receipt included',
      'Original boutique packaging & dust bag',
    ],
  });

  const [imageInput, setImageInput] = useState('');
  const [specInput, setSpecInput] = useState('');

  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    setFormData({
      ...formData,
      images: [...formData.images, imageInput.trim()],
    });
    setImageInput('');
  };

  const handleRemoveImage = (index: number) => {
    if (formData.images.length <= 1) {
      addToast('At least one image is required', 'error');
      return;
    }
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleAddSpec = () => {
    if (!specInput.trim()) return;
    setFormData({
      ...formData,
      specifications: [...formData.specifications, specInput.trim()],
    });
    setSpecInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.brand || !formData.priceIdr) {
      addToast('Please fill in all mandatory fields', 'error');
      return;
    }

    addProduct({
      name: formData.name,
      brand: formData.brand,
      sku: formData.sku,
      category: formData.category,
      originStore: formData.originStore,
      priceIdr: Number(formData.priceIdr),
      originalPriceForeign: formData.originalPriceForeign,
      weightKg: Number(formData.weightKg),
      stockSlots: Number(formData.stockSlots),
      maxSlots: Number(formData.maxSlots),
      isAvailable: formData.isAvailable,
      status: formData.status,
      estimatedArrival: formData.estimatedArrival,
      description: formData.description,
      images: formData.images,
      specifications: formData.specifications,
      batchId: 'china-guangzhou-express',
    });

    navigate('owner-products');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e8e2d9]">
        <button
          onClick={() => navigate('owner-products')}
          className="inline-flex items-center text-xs font-mono uppercase text-[#736e65] hover:text-[#1e1c1a] group"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1 group-hover:-translate-x-0.5 transition-transform" />
          Cancel & Return to Catalog
        </button>

        <h1 className="font-serif text-2xl text-[#1e1c1a]">
          Curate New Sourced Piece
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#e8e2d9] p-6 sm:p-8 space-y-8 shadow-xs">
        
        {/* Section 1: Identification & Brand */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg text-[#1e1c1a] pb-2 border-b border-[#f0ece6]">
            1. Identity & Boutique Origin
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">
                Product Title / Model Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Lucent Gloss Tote 6x6"
                className="w-full px-3 py-2 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">
                Designer Brand *
              </label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Issey Miyake"
                className="w-full px-3 py-2 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">
                Product Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                className="w-full px-3 py-2 border border-[#d4cbbf] bg-white focus:outline-none"
              >
                <option value="Barang Viral China">Barang Viral China</option>
                <option value="Pop Mart & Collectibles">Pop Mart & Collectibles</option>
                <option value="C-Beauty & Skincare">C-Beauty & Skincare</option>
                <option value="Fashion & Bags China">Fashion & Bags China</option>
                <option value="Douyin Tech & Lifestyle">Douyin Tech & Lifestyle</option>
                <option value="China Tea & Snacks">China Tea & Snacks</option>
              </select>
            </div>

            <div>
              <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">
                Store District / Origin
              </label>
              <input
                type="text"
                value={formData.originStore}
                onChange={(e) => setFormData({ ...formData, originStore: e.target.value })}
                placeholder="e.g. Huaihai Road Shanghai, Shisanhang Guangzhou"
                className="w-full px-3 py-2 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">
                SKU Identifier
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2 border border-[#d4cbbf] font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pricing */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg text-[#1e1c1a] pb-2 border-b border-[#f0ece6]">
            2. Transparent Pricing Architecture
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">
                Final Customer Price (IDR) *
              </label>
              <input
                type="number"
                required
                min={0}
                step={1000}
                value={formData.priceIdr}
                onChange={(e) => setFormData({ ...formData, priceIdr: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-[#d4cbbf] font-mono focus:border-[#1e1c1a] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">
                Original Boutique Retail (Foreign)
              </label>
              <input
                type="text"
                value={formData.originalPriceForeign}
                onChange={(e) => setFormData({ ...formData, originalPriceForeign: e.target.value })}
                placeholder="e.g. ¥38,500"
                className="w-full px-3 py-2 border border-[#d4cbbf] font-mono focus:border-[#1e1c1a] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Luggage Quota & Logistics */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg text-[#1e1c1a] pb-2 border-b border-[#f0ece6]">
            3. Luggage Weight & Batch Quota
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">
                Item Weight in Kilograms *
              </label>
              <input
                type="number"
                required
                min={0.01}
                step={0.01}
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-[#d4cbbf] font-mono focus:border-[#1e1c1a] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">
                Max Available Slots
              </label>
              <input
                type="number"
                required
                min={1}
                value={formData.maxSlots}
                onChange={(e) => setFormData({ ...formData, maxSlots: Number(e.target.value), stockSlots: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-[#d4cbbf] font-mono focus:border-[#1e1c1a] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">
                Estimated Jakarta Arrival
              </label>
              <input
                type="text"
                value={formData.estimatedArrival}
                onChange={(e) => setFormData({ ...formData, estimatedArrival: e.target.value })}
                className="w-full px-3 py-2 border border-[#d4cbbf] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Descriptions & Specs */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg text-[#1e1c1a] pb-2 border-b border-[#f0ece6]">
            4. Descriptions & Specifications
          </h3>

          <div className="text-xs">
            <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">
              Boutique Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none text-xs"
              placeholder="Describe material, dimensions, Tokyo boutique origin..."
            />
          </div>

          <div className="text-xs space-y-2">
            <label className="block font-mono uppercase text-[#736e65] text-[10px]">
              Key Specifications & Guarantees
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.specifications.map((spec, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2.5 py-1 bg-[#f4eee6] border border-[#e8e2d9] text-xs font-mono"
                >
                  {spec}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, specifications: formData.specifications.filter((_, i) => i !== idx) })}
                    className="ml-1.5 text-[#96422d] hover:text-[#7e3624]"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={specInput}
                onChange={(e) => setSpecInput(e.target.value)}
                placeholder="e.g. Dimensions: 34 x 34 cm"
                className="flex-1 px-3 py-2 border border-[#d4cbbf] text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSpec}
                className="px-4 py-2 bg-[#1e1c1a] text-white text-xs font-mono uppercase"
              >
                + Add Spec
              </button>
            </div>
          </div>
        </div>

        {/* Section 5: Gallery Images */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg text-[#1e1c1a] pb-2 border-b border-[#f0ece6]">
            5. Product Images
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative group border border-[#e8e2d9] aspect-square bg-[#f4eee6]">
                <img src={img} alt="Product" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex space-x-2 text-xs">
            <input
              type="url"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="Paste image URL (https://...)"
              className="flex-1 px-3 py-2 border border-[#d4cbbf] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-[#1e1c1a] text-white text-xs font-mono uppercase"
            >
              + Add Image URL
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-[#e8e2d9] flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('owner-products')}
            className="px-6 py-2.5 border border-[#d4cbbf] text-xs font-mono uppercase text-[#736e65] hover:text-[#1e1c1a]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#333] transition-colors"
          >
            Publish Product to Atelier
          </button>
        </div>

      </form>

    </div>
  );
};
