import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Mail, Lock, ShieldCheck, ShoppingBag, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { unifiedLogin, navigate } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Silakan masukkan alamat email Anda.');
      return;
    }

    setIsSubmitting(true);
    const result = unifiedLogin(cleanEmail, password);
    setIsSubmitting(false);

    if (!result.success) {
      // Standard discreet error message (no hint whether an account is admin or regular)
      setErrorMessage('Kata sandi yang Anda masukkan salah. Silakan periksa kembali.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-linear-to-b from-[#fbf9f8] to-[#f3efe9]">
      <div className="w-full max-w-md bg-white border border-[#e6dfd5] rounded-2xl shadow-xl overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-[#1b1c1c] text-white px-6 py-6 text-center relative">
          <button
            onClick={() => navigate('home')}
            className="absolute left-4 top-5 text-[#a8a196] hover:text-white p-1 transition-colors"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <span className="inline-block text-[10px] tracking-widest uppercase font-mono text-[#c27863] bg-white/10 px-3 py-0.5 rounded-full mb-1">
            Atelier Jastip
          </span>
          <h1 className="font-serif text-2xl font-normal text-white">Masuk Akun</h1>
          <p className="text-xs text-[#a8a196] mt-1">
            Akses belanja jastip China, lacak pesanan, & lihat invoice digital
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <span className="font-bold">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1b1c1c] mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: nama@gmail.com"
                  className="w-full text-xs px-3.5 py-3 pl-10 border border-[#d4cbbf] rounded-xl focus:border-[#1b1c1c] focus:ring-1 focus:ring-[#1b1c1c] focus:outline-none bg-white transition-all"
                />
                <Mail className="w-4 h-4 text-[#8a847d] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#1b1c1c]">
                  Password
                </label>
                <span className="text-[11px] text-[#8a847d]">
                  (Untuk pembeli opsional)
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  className="w-full text-xs px-3.5 py-3 pl-10 pr-10 border border-[#d4cbbf] rounded-xl focus:border-[#1b1c1c] focus:ring-1 focus:ring-[#1b1c1c] focus:outline-none bg-white transition-all"
                />
                <Lock className="w-4 h-4 text-[#8a847d] absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#8a847d] hover:text-[#1b1c1c]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#1b1c1c] hover:bg-neutral-800 active:scale-[0.99] text-white font-medium text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2"
            >
              <span>{isSubmitting ? 'Memproses...' : 'Masuk Sekarang'}</span>
              <span className="material-symbols-outlined text-[16px]">login</span>
            </button>
          </form>

          {/* Tokopedia & Shopee Reassurance Pills */}
          <div className="pt-4 border-t border-[#e6dfd5]/80 grid grid-cols-2 gap-3 text-[11px] text-[#625e56]">
            <div className="flex items-center gap-2 bg-[#fbf9f8] p-2.5 rounded-lg border border-[#e6dfd5]/50">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Invoice Digital Otomatis di Web</span>
            </div>
            <div className="flex items-center gap-2 bg-[#fbf9f8] p-2.5 rounded-lg border border-[#e6dfd5]/50">
              <ShoppingBag className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Jastip 100% Original China Direct</span>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => navigate('shop')}
              className="text-xs text-[#625e56] hover:text-[#1b1c1c] hover:underline"
            >
              ← Kembali belanja di Katalog Produk
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
