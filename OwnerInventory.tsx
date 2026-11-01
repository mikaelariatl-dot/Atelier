import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Luggage,
  Plus,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Package,
  Layers,
  Plane,
  X,
  RotateCcw
} from 'lucide-react';
import { LuggageSuitcaseType } from '../../types';

export const OwnerInventory: React.FC = () => {
  const {
    batches,
    suitcases,
    addSuitcase,
    deleteSuitcase,
    addSuitcaseItem,
    deleteSuitcaseItem,
    resetTotalWebsite,
    addToast
  } = useApp();

  const currentTrip = batches[0];

  // Modal / Form state for Add Luggage
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLuggageName, setNewLuggageName] = useState('');
  const [newLuggageCode, setNewLuggageCode] = useState('');
  const [newLuggageType, setNewLuggageType] = useState<LuggageSuitcaseType>('Checked 23kg');
  const [newLuggageCapacity, setNewLuggageCapacity] = useState('23.0');
  const [newLuggageCategory, setNewLuggageCategory] = useState('Pop Mart & Blind Box');
  const [newLuggageNotes, setNewLuggageNotes] = useState('');

  // Item addition state per suitcase
  const [activeItemFormSuitcaseId, setActiveItemFormSuitcaseId] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemWeight, setNewItemWeight] = useState('0.5');
  const [newItemQty, setNewItemQty] = useState('1');

  // Confirmation state for delete suitcase
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Total flight calculations
  const totalFleetCapacityKg = suitcases.reduce((sum, s) => sum + s.capacityKg, 0);
  const totalFleetLoadedKg = suitcases.reduce((sum, s) => sum + s.currentLoadKg, 0);
  const remainingFleetCapacityKg = Math.max(0, totalFleetCapacityKg - totalFleetLoadedKg);
  const payloadPercentage = totalFleetCapacityKg > 0 ? (totalFleetLoadedKg / totalFleetCapacityKg) * 100 : 0;

  const handleOpenAddModal = () => {
    const nextIndex = suitcases.length + 1;
    const nextLetter = String.fromCharCode(65 + suitcases.length); // A, B, C, D...
    setNewLuggageName(`Koper Bagasi ${nextLetter} - Rimowa / Samsonite`);
    setNewLuggageCode(`BAG-CAN-0${nextIndex}`);
    setNewLuggageType('Checked 23kg');
    setNewLuggageCapacity('23.0');
    setNewLuggageCategory('Pop Mart & Blind Box');
    setNewLuggageNotes('Alokasi koper checked untuk rute China Southern CAN—CGK');
    setIsAddModalOpen(true);
  };

  const handleTypeChange = (type: LuggageSuitcaseType) => {
    setNewLuggageType(type);
    if (type === 'Checked 23kg') setNewLuggageCapacity('23.0');
    else if (type === 'Checked 32kg') setNewLuggageCapacity('32.0');
    else if (type === 'Cabin 7-10kg') setNewLuggageCapacity('10.0');
    else if (type === 'Extra Cargo Box') setNewLuggageCapacity('25.0');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLuggageName.trim()) {
      addToast('Nama koper wajib diisi', 'error');
      return;
    }

    const capacityNum = parseFloat(newLuggageCapacity) || 23.0;

    addSuitcase({
      name: newLuggageName.trim(),
      code: newLuggageCode.trim() || `BAG-${Date.now().toString().slice(-4)}`,
      type: newLuggageType,
      capacityKg: capacityNum,
      currentLoadKg: 0,
      assignedCategory: newLuggageCategory,
      flightCode: currentTrip?.flightCode || 'CZ 387 CAN—CGK',
      notes: newLuggageNotes.trim(),
      items: [],
    });

    setIsAddModalOpen(false);
  };

  const handleAddItemSubmit = (e: React.FormEvent, suitcaseId: string) => {
    e.preventDefault();
    if (!newItemName.trim()) {
      addToast('Nama barang wajib diisi', 'error');
      return;
    }

    const weightNum = parseFloat(newItemWeight) || 0.1;
    const qtyNum = parseInt(newItemQty, 10) || 1;

    addSuitcaseItem(suitcaseId, {
      name: newItemName.trim(),
      weightKg: weightNum,
      qty: qtyNum,
    });

    setNewItemName('');
    setNewItemWeight('0.5');
    setNewItemQty('1');
    setActiveItemFormSuitcaseId(null);
  };

  return (
    <div className="space-y-8">
      
      {/* Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e8e2d9] gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#96422d]">Manajemen Logistik & Bagasi</span>
          <h1 className="font-serif text-3xl text-[#1e1c1a] mt-0.5">Alokasi Koper & Bagasi Pesawat</h1>
          <p className="text-xs text-[#736e65] mt-1">
            Pantau berat checked baggage (Penerbangan {currentTrip?.flightCode || 'CZ 387 CAN—CGK'}), tambah/hapus koper bagasi, dan kuota Bea Cukai.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-3.5 py-2 border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors rounded-xs shadow-2xs"
            title="Bersihkan transaksi uji coba untuk mulai berbisnis"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Total Website</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-[#1e1c1a] hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors rounded-xs shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Koper Bagasi</span>
          </button>
        </div>
      </div>

      {/* Fleet Overview Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e8e2d9] p-4.5 rounded-lg shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#736e65]">
            <span className="uppercase text-[10px]">Total Kapasitas Koper</span>
            <Luggage className="w-4 h-4 text-[#96422d]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#1e1c1a]">
            {totalFleetCapacityKg.toFixed(1)} <span className="text-sm font-normal text-[#736e65]">kg</span>
          </div>
          <p className="text-[11px] text-[#736e65]">Dari {suitcases.length} koper & dus aktif</p>
        </div>

        <div className="bg-white border border-[#e8e2d9] p-4.5 rounded-lg shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#736e65]">
            <span className="uppercase text-[10px]">Muatan Terisi Saat Ini</span>
            <Scale className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#1e1c1a]">
            {totalFleetLoadedKg.toFixed(1)} <span className="text-sm font-normal text-[#736e65]">kg</span>
          </div>
          <div className="w-full bg-[#f4eee6] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                payloadPercentage > 90 ? 'bg-red-600' : payloadPercentage > 75 ? 'bg-amber-500' : 'bg-emerald-600'
              }`}
              style={{ width: `${Math.min(100, payloadPercentage)}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-[#e8e2d9] p-4.5 rounded-lg shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#736e65]">
            <span className="uppercase text-[10px]">Sisa Kuota Bagasi</span>
            <Package className="w-4 h-4 text-[#1e1c1a]" />
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-700">
            {remainingFleetCapacityKg.toFixed(1)} <span className="text-sm font-normal text-[#736e65]">kg</span>
          </div>
          <p className="text-[11px] text-[#736e65]">Siap diisi titipan pesanan baru</p>
        </div>

        <div className="bg-white border border-[#e8e2d9] p-4.5 rounded-lg shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#736e65]">
            <span className="uppercase text-[10px]">Penerbangan Resmi</span>
            <Plane className="w-4 h-4 text-[#96422d]" />
          </div>
          <div className="font-mono text-lg font-bold text-[#1e1c1a] truncate">
            {currentTrip?.flightCode || 'CZ 387 CAN—CGK'}
          </div>
          <p className="text-[11px] text-[#736e65] truncate">{currentTrip?.destination || 'Guangzhou, China'}</p>
        </div>
      </div>

      {/* Dynamic Suitcases Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl text-[#1e1c1a]">Daftar Koper Bagasi Aktif</h2>
            <span className="px-2 py-0.5 bg-[#f4eee6] text-[#96422d] font-mono text-xs rounded">
              {suitcases.length} Unit
            </span>
          </div>
          <p className="text-xs text-[#736e65] hidden sm:block">
            Klik tombol tambah barang untuk mencatat manifest isi koper
          </p>
        </div>

        {suitcases.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-[#d4cbbf] p-12 text-center rounded-xl space-y-3">
            <Luggage className="w-12 h-12 text-[#a8a196] mx-auto" />
            <h3 className="font-serif text-lg text-[#1e1c1a]">Belum Ada Koper Bagasi Didaftarkan</h3>
            <p className="text-xs text-[#736e65] max-w-md mx-auto">
              Daftarkan koper bagasi Anda (Rimowa, Samsonite, tas kabin, atau dus kargo) untuk memantau kapasitas penerbangan jastip China Anda.
            </p>
            <button
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Koper Pertama</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suitcases.map((sc) => {
              const loadPercent = sc.capacityKg > 0 ? (sc.currentLoadKg / sc.capacityKg) * 100 : 0;
              const remainingKg = Math.max(0, sc.capacityKg - sc.currentLoadKg);
              const isItemFormOpen = activeItemFormSuitcaseId === sc.id;

              return (
                <div
                  key={sc.id}
                  className="bg-white border border-[#e8e2d9] rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-[#b5a99a] transition-all space-y-4"
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#f0ece6]">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#96422d] bg-[#f4eee6] px-2 py-0.5 rounded">
                            {sc.code}
                          </span>
                          <span className="font-mono text-[10px] text-[#736e65] bg-[#faf8f5] px-1.5 py-0.5 border border-[#e8e2d9] rounded">
                            {sc.type}
                          </span>
                        </div>
                        <h3 className="font-serif text-base font-semibold text-[#1e1c1a] leading-snug">
                          {sc.name}
                        </h3>
                        <p className="text-[11px] text-[#736e65] mt-0.5">
                          Kategori: <strong className="text-[#1e1c1a]">{sc.assignedCategory}</strong>
                        </p>
                      </div>

                      {/* Delete Suitcase Button */}
                      <button
                        onClick={() => setConfirmDeleteId(sc.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Hapus Koper Bagasi Ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between items-baseline text-xs font-mono">
                        <span className="text-[#736e65]">
                          Muatan: <strong className="text-[#1e1c1a]">{sc.currentLoadKg.toFixed(1)}</strong> / {sc.capacityKg.toFixed(1)} kg
                        </span>
                        <span
                          className={`font-semibold ${
                            remainingKg <= 2.0 ? 'text-red-600' : remainingKg <= 5.0 ? 'text-amber-700' : 'text-emerald-700'
                          }`}
                        >
                          {remainingKg.toFixed(1)} kg tersisa
                        </span>
                      </div>

                      <div className="w-full h-2 bg-[#f4eee6] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            loadPercent >= 90 ? 'bg-red-600' : loadPercent >= 75 ? 'bg-amber-500' : 'bg-[#1e1c1a]'
                          }`}
                          style={{ width: `${Math.min(100, loadPercent)}%` }}
                        />
                      </div>
                    </div>

                    {/* Manifest Item List */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono uppercase text-[#736e65]">
                        <span>Isi Manifest ({sc.items?.length || 0} Item)</span>
                        <button
                          type="button"
                          onClick={() => setActiveItemFormSuitcaseId(isItemFormOpen ? null : sc.id)}
                          className="text-[#96422d] hover:underline font-semibold flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{isItemFormOpen ? 'Tutup' : 'Tambah Muatan'}</span>
                        </button>
                      </div>

                      {/* Inline Add Item Form */}
                      {isItemFormOpen && (
                        <form
                          onSubmit={(e) => handleAddItemSubmit(e, sc.id)}
                          className="p-3 bg-[#fbf9f8] border border-[#e8e2d9] rounded-lg space-y-2 text-xs"
                        >
                          <div>
                            <input
                              type="text"
                              required
                              value={newItemName}
                              onChange={(e) => setNewItemName(e.target.value)}
                              placeholder="Nama barang (misal: Pop Mart Blind Box)"
                              className="w-full px-2.5 py-1.5 border border-[#d4cbbf] bg-white text-xs rounded focus:outline-none focus:border-[#1e1c1a]"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-mono text-[#736e65] block mb-0.5">Berat (kg)</label>
                              <input
                                type="number"
                                step="0.1"
                                min="0.1"
                                required
                                value={newItemWeight}
                                onChange={(e) => setNewItemWeight(e.target.value)}
                                className="w-full px-2.5 py-1 border border-[#d4cbbf] bg-white text-xs rounded focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-mono text-[#736e65] block mb-0.5">Jumlah (Pcs)</label>
                              <input
                                type="number"
                                min="1"
                                required
                                value={newItemQty}
                                onChange={(e) => setNewItemQty(e.target.value)}
                                className="w-full px-2.5 py-1 border border-[#d4cbbf] bg-white text-xs rounded focus:outline-none"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => setActiveItemFormSuitcaseId(null)}
                              className="px-2.5 py-1 text-xs text-[#736e65] hover:text-[#1e1c1a]"
                            >
                              Batal
                            </button>
                            <button
                              type="submit"
                              className="px-3 py-1 bg-[#1e1c1a] text-white text-xs font-mono uppercase rounded hover:bg-[#333]"
                            >
                              Simpan Item
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Items list */}
                      {sc.items && sc.items.length > 0 ? (
                        <div className="max-h-40 overflow-y-auto space-y-1.5 divide-y divide-[#f5f1eb] pr-1">
                          {sc.items.map((item) => (
                            <div
                              key={item.id}
                              className="pt-1.5 first:pt-0 flex items-center justify-between text-[11px] text-[#59554d]"
                            >
                              <div className="truncate pr-2">
                                <span className="font-medium text-[#1e1c1a]">{item.name}</span>
                                <span className="text-[#8a847d] ml-1 font-mono">({item.qty} pcs)</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-mono text-[10px] text-[#736e65]">
                                  {(item.weightKg * item.qty).toFixed(1)} kg
                                </span>
                                <button
                                  type="button"
                                  onClick={() => deleteSuitcaseItem(sc.id, item.id)}
                                  className="text-neutral-400 hover:text-red-600 p-0.5 transition-colors"
                                  title="Hapus item ini"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-2.5 text-center text-[11px] text-[#a8a196] italic bg-[#faf8f5] rounded border border-dashed border-[#e8e2d9]">
                          Koper masih kosong, siap diisi barang belanjaan
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Notes */}
                  {sc.notes && (
                    <div className="pt-2 border-t border-[#f0ece6] text-[10px] text-[#8a847d] italic">
                      "{sc.notes}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Customs & Bea Cukai Declaration Compliance */}
      <div className="bg-white border border-[#e8e2d9] p-6 rounded-xl shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#96422d]">
          <ShieldAlert className="w-4 h-4" />
          <span>Aturan Resmi Bea Cukai Penumpang Indonesia (PMK 203/PMK.04/2017)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-[#faf8f5] border border-[#e8e2d9] rounded-lg">
            <div className="text-[#736e65] mb-1 font-mono text-[10px] uppercase">Pembebasan FOB Penumpang Pribadi</div>
            <div className="font-mono text-base font-semibold text-[#1e1c1a]">USD $500.00 / orang</div>
            <p className="text-[10px] text-[#736e65] mt-1">Bebas bea masuk untuk barang bawaan pribadi di bawah limit</p>
          </div>

          <div className="p-3.5 bg-[#faf8f5] border border-[#e8e2d9] rounded-lg">
            <div className="text-[#736e65] mb-1 font-mono text-[10px] uppercase">Tarif Flat Kelebihan Impor</div>
            <div className="font-mono text-base font-semibold text-[#1e1c1a]">Bea Masuk 10% + PPN 11%</div>
            <p className="text-[10px] text-[#736e65] mt-1">Dihitung otomatis dan transparan tanpa pungli bandara</p>
          </div>

          <div className="p-3.5 bg-[#faf8f5] border border-[#e8e2d9] rounded-lg">
            <div className="text-[#736e65] mb-1 font-mono text-[10px] uppercase">Struk Resmi Store China</div>
            <div className="font-mono text-base font-semibold text-[#2d6a4f]">100% Faktur Toko Lengkap</div>
            <p className="text-[10px] text-[#736e65] mt-1">Disiapkan untuk Electronic Customs Declaration (e-CD)</p>
          </div>
        </div>
      </div>

      {/* MODAL: TAMBAH KOPER BAGASI BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-lg border border-[#e8e2d9] shadow-2xl p-6 sm:p-8 rounded-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e2d9] mb-5">
              <div className="flex items-center gap-2">
                <Luggage className="w-5 h-5 text-[#96422d]" />
                <h3 className="font-serif text-xl font-semibold text-[#1e1c1a]">
                  Tambah Koper Bagasi Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#8a847d] hover:text-[#1e1c1a] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#736e65] mb-1">
                  Nama Koper / Wadah Bagasi
                </label>
                <input
                  type="text"
                  required
                  value={newLuggageName}
                  onChange={(e) => setNewLuggageName(e.target.value)}
                  placeholder="Contoh: Koper Bagasi C - Samsonite 28 Inch"
                  className="w-full px-3 py-2 border border-[#d4cbbf] rounded text-xs focus:border-[#1e1c1a] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#736e65] mb-1">
                    Kode Identifikasi Koper
                  </label>
                  <input
                    type="text"
                    required
                    value={newLuggageCode}
                    onChange={(e) => setNewLuggageCode(e.target.value)}
                    placeholder="Contoh: BAG-CAN-03"
                    className="w-full px-3 py-2 border border-[#d4cbbf] rounded text-xs focus:border-[#1e1c1a] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#736e65] mb-1">
                    Kategori Alokasi Muatan
                  </label>
                  <select
                    value={newLuggageCategory}
                    onChange={(e) => setNewLuggageCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-[#d4cbbf] rounded text-xs bg-white focus:border-[#1e1c1a] focus:outline-none"
                  >
                    <option value="Pop Mart & Blind Box">Pop Mart & Blind Box</option>
                    <option value="C-Beauty & Kosmetik China">C-Beauty & Kosmetik China</option>
                    <option value="Fashion & Pakaian China">Fashion & Pakaian China</option>
                    <option value="Tech & Gadgets Berharga">Tech & Gadgets Berharga</option>
                    <option value="Makanan & Teh Khas China">Makanan & Teh Khas China</option>
                    <option value="Muatan Campuran">Muatan Campuran</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#736e65] mb-1.5">
                  Tipe Bagasi Pesawat
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Checked 23kg', label: 'Checked 23 kg (Standar)', cap: '23.0' },
                    { id: 'Checked 32kg', label: 'Checked 32 kg (Heavy)', cap: '32.0' },
                    { id: 'Cabin 7-10kg', label: 'Kabin 10 kg (Carry-On)', cap: '10.0' },
                    { id: 'Extra Cargo Box', label: 'Karton Ekstra 25 kg (1688)', cap: '25.0' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleTypeChange(t.id as LuggageSuitcaseType)}
                      className={`p-2.5 text-left border rounded text-xs transition-colors ${
                        newLuggageType === t.id
                          ? 'border-[#1e1c1a] bg-[#1e1c1a] text-white font-medium'
                          : 'border-[#d4cbbf] bg-white text-[#59554d] hover:border-[#1e1c1a]'
                      }`}
                    >
                      <div className="font-medium">{t.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#736e65] mb-1">
                  Kapasitas Maksimal (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="50"
                  required
                  value={newLuggageCapacity}
                  onChange={(e) => setNewLuggageCapacity(e.target.value)}
                  className="w-full px-3 py-2 border border-[#d4cbbf] rounded text-xs focus:border-[#1e1c1a] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#736e65] mb-1">
                  Catatan Khusus Koper (Opsional)
                </label>
                <input
                  type="text"
                  value={newLuggageNotes}
                  onChange={(e) => setNewLuggageNotes(e.target.value)}
                  placeholder="Contoh: Koper warna hitam, dipasangi TSA lock & tag Atelier"
                  className="w-full px-3 py-2 border border-[#d4cbbf] rounded text-xs focus:border-[#1e1c1a] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#e8e2d9] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-[#d4cbbf] text-xs font-mono uppercase text-[#736e65] hover:text-[#1e1c1a] rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors"
                >
                  Simpan Koper Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: HAPUS KOPER */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6 rounded-xl border border-[#e8e2d9] shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg text-[#1e1c1a]">Hapus Koper Bagasi Ini?</h3>
            <p className="text-xs text-[#736e65]">
              Koper ini akan dihapus dari manifest penerbangan dan kuota payload akan dihitung ulang.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 border border-[#d4cbbf] text-xs font-mono uppercase text-[#736e65] rounded hover:text-[#1e1c1a]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteSuitcase(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-mono uppercase tracking-wider rounded transition-colors"
              >
                Ya, Hapus Koper
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: RESET TOTAL WEBSITE */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 sm:p-8 rounded-xl border border-red-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-700">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1e1c1a]">Reset Total Transaksi Toko</h3>
                <p className="text-[11px] text-[#736e65]">Siapkan website untuk operasional bisnis riil Anda</p>
              </div>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 space-y-1.5 leading-relaxed">
              <p>Tindakan ini akan membersihkan:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                <li>Semua data pesanan uji coba (orders menjadi kosong 0)</li>
                <li>Semua mutasi/bukti transfer uji coba (payments menjadi kosong 0)</li>
                <li>Semua keranjang belanja tester</li>
                <li>Sesi login tester</li>
              </ul>
              <p className="pt-1 text-[11px] font-semibold text-red-900">
                Katalog produk jastip China dan pengaturan rekening bank Anda tetap aman tersimpan.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 border border-[#d4cbbf] text-xs font-mono uppercase text-[#736e65] rounded hover:text-[#1e1c1a]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  resetTotalWebsite();
                  setIsResetConfirmOpen(false);
                }}
                className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-mono uppercase tracking-wider rounded transition-colors font-medium shadow-xs"
              >
                Konfirmasi Reset Bersih
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
