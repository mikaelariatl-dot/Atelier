import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StoreSettings } from '../../types';

export const OwnerSettings: React.FC = () => {
  const { storeSettings, updateStoreSettings, addToast } = useApp();

  const [settings, setSettings] = useState<StoreSettings>(storeSettings);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(settings);
    addToast('Atelier store configurations and treasury accounts saved', 'success');
  };

  return (
    <div className="max-w-4xl space-y-8">
      
      {/* Title */}
      <div className="pb-4 border-b border-[#e8e2d9]">
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#96422d]">Treasury & Store Operations</span>
        <h1 className="font-serif text-3xl text-[#1e1c1a] mt-0.5">Store Settings & Bank Channels</h1>
        <p className="text-xs text-[#736e65] mt-1">
          Manage sole proprietor contact details, thresholds, and designated receiving accounts.
        </p>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
        
        {/* Section 1: Store Brand Info */}
        <div className="bg-white border border-[#e8e2d9] p-6 space-y-4 shadow-xs">
          <h3 className="font-serif text-lg text-[#1e1c1a] pb-2 border-b border-[#f0ece6]">
            1. Brand Identity & Sole Proprietor
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">
                Storefront Name
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3 py-2 border border-[#d4cbbf] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">
                Curator / Sole Owner Name
              </label>
              <input
                type="text"
                value={settings.ownerName}
                onChange={(e) => setSettings({ ...settings, ownerName: e.target.value })}
                className="w-full px-3 py-2 border border-[#d4cbbf] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">
                Public Concierge WhatsApp
              </label>
              <input
                type="text"
                value={settings.ownerPhone}
                onChange={(e) => setSettings({ ...settings, ownerPhone: e.target.value })}
                className="w-full px-3 py-2 border border-[#d4cbbf] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">
                Support & Verification Email
              </label>
              <input
                type="email"
                value={settings.ownerEmail}
                onChange={(e) => setSettings({ ...settings, ownerEmail: e.target.value })}
                className="w-full px-3 py-2 border border-[#d4cbbf] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Financial Thresholds */}
        <div className="bg-white border border-[#e8e2d9] p-6 space-y-4 shadow-xs">
          <h3 className="font-serif text-lg text-[#1e1c1a] pb-2 border-b border-[#f0ece6]">
            2. Domestic Shipping & Policies
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">
                Free Domestic Shipping Threshold (IDR)
              </label>
              <input
                type="number"
                step={50000}
                value={settings.shippingRules.freeShippingThreshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shippingRules: {
                      ...settings.shippingRules,
                      freeShippingThreshold: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-2 border border-[#d4cbbf] font-mono focus:outline-none"
              />
              <span className="text-[10px] text-[#736e65] mt-1 block">
                Orders equal or exceeding this total qualify for complimentary insured domestic courier.
              </span>
            </div>

            <div>
              <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">
                Currency Exchange Rate Buffer
              </label>
              <input
                type="text"
                disabled
                value="1 CNY (RMB) = Rp 2.240 (Direct Yuan China)"
                className="w-full px-3 py-2 bg-[#fbf9f8] border border-[#e8e2d9] text-[#736e65]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Receiving Bank Accounts */}
        <div className="bg-white border border-[#e8e2d9] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#f0ece6]">
            <h3 className="font-serif text-lg text-[#1e1c1a]">
              3. Designated Receiving Accounts (Indonesian Banking)
            </h3>
            <span className="text-[10px] font-mono text-[#96422d] uppercase">
              Used on Checkout Step 4 & Invoices
            </span>
          </div>

          <div className="space-y-4">
            {/* BCA */}
            <div className="p-4 border border-[#e8e2d9] bg-[#faf8f5] space-y-3">
              <span className="font-mono text-xs font-semibold text-[#1e1c1a]">Bank Central Asia (BCA)</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">Account Number</label>
                  <input
                    type="text"
                    value={settings.bcaAccount.accountNumber}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        bcaAccount: { ...settings.bcaAccount, accountNumber: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#d4cbbf] font-mono text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">Account Holder</label>
                  <input
                    type="text"
                    value={settings.bcaAccount.accountHolder}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        bcaAccount: { ...settings.bcaAccount, accountHolder: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#d4cbbf] text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* BNI */}
            <div className="p-4 border border-[#e8e2d9] bg-[#faf8f5] space-y-3">
              <span className="font-mono text-xs font-semibold text-[#1e1c1a]">Bank Negara Indonesia (BNI)</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">Account Number</label>
                  <input
                    type="text"
                    value={settings.bniAccount.accountNumber}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        bniAccount: { ...settings.bniAccount, accountNumber: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#d4cbbf] font-mono text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">Account Holder</label>
                  <input
                    type="text"
                    value={settings.bniAccount.accountHolder}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        bniAccount: { ...settings.bniAccount, accountHolder: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#d4cbbf] text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* CIMB */}
            <div className="p-4 border border-[#e8e2d9] bg-[#faf8f5] space-y-3">
              <span className="font-mono text-xs font-semibold text-[#1e1c1a]">CIMB Niaga</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">Account Number</label>
                  <input
                    type="text"
                    value={settings.cimbAccount.accountNumber}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cimbAccount: { ...settings.cimbAccount, accountNumber: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#d4cbbf] font-mono text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">Account Holder</label>
                  <input
                    type="text"
                    value={settings.cimbAccount.accountHolder}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cimbAccount: { ...settings.cimbAccount, accountHolder: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#d4cbbf] text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* QRIS */}
            <div className="p-4 border border-[#e8e2d9] bg-[#faf8f5] space-y-3">
              <span className="font-mono text-xs font-semibold text-[#1e1c1a]">QRIS Gateway</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">Merchant Name</label>
                  <input
                    type="text"
                    value={settings.qrisConfig.merchantName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        qrisConfig: { ...settings.qrisConfig, merchantName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#d4cbbf] text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase text-[#736e65] text-[10px] mb-1">NMID Code</label>
                  <input
                    type="text"
                    value={settings.qrisConfig.nmid}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        qrisConfig: { ...settings.qrisConfig, nmid: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#d4cbbf] font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#333] transition-colors rounded-xs shadow-xs"
          >
            Save Store & Banking Settings
          </button>
        </div>

      </form>

      {/* Danger Zone: Total Website Reset */}
      <div className="border border-red-200 bg-red-50/50 p-6 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-serif text-lg font-bold text-red-900">Mulai Bersih & Reset Total Transaksi</h4>
            <p className="text-xs text-red-700 mt-0.5">
              Bersihkan seluruh pesanan uji coba dan mutasi tester untuk langsung memulai bisnis jastip resmi Anda.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Apakah Anda yakin ingin me-reset total data transaksi toko? Semua data pesanan dan pembayaran uji coba akan dibersihkan agar website siap digunakan untuk bisnis riil.')) {
                // Call reset
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-mono text-xs uppercase tracking-wider rounded transition-colors"
          >
            Reset Total Transaksi
          </button>
        </div>
      </div>

    </div>
  );
};
