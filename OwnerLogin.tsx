import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, ArrowLeft, KeyRound } from 'lucide-react';

export const OwnerLogin: React.FC = () => {
  const { loginOwner, navigate } = useApp();

  const [email, setEmail] = useState('mikaelariatl@gmail.com');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const success = loginOwner(password);
    if (!success) {
      setErrorMsg('Kredensial akses tidak sah. Periksa password master owner.');
    }
  };

  return (
    <div className="min-h-screen bg-[#191716] flex flex-col justify-center items-center px-4 py-12 text-[#e8e2d9]">
      <div className="max-w-md w-full bg-[#221f1d] border border-[#38332f] p-8 shadow-2xl relative">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('home')}
          className="inline-flex items-center text-xs font-mono text-[#a8a196] hover:text-white mb-6 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1 group-hover:-translate-x-0.5 transition-transform" />
          Return to Atelier Storefront
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 bg-[#2d2825] border border-[#4a423d] flex items-center justify-center text-[#c27863]">
            <KeyRound className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#c27863]">
            Curator Restricted Gateway
          </span>
          <h1 className="font-serif text-2xl text-white mt-1">Atelier Jastip Suite</h1>
          <p className="text-xs text-[#a8a196] mt-1">
            Authentication terminal for Mikael Aria Wicaksono (Sole Proprietor & Overseas China Curator).
          </p>
        </div>

        {/* Security Notice */}
        <div className="mb-6 p-3 bg-[#2c221e] border border-[#523932] text-[11px] text-[#d99f92] flex items-start space-x-2">
          <ShieldAlert className="w-4 h-4 text-[#c27863] shrink-0 mt-0.5" />
          <p>
            Portal khusus pengelola. Akses diverifikasi menggunakan otentikasi terenkripsi.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 text-xs font-mono text-[#e76f51] bg-[#38201a] p-2.5 border border-[#6b2f21]">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#a8a196] mb-1">
              Owner Master Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-[#191716] border border-[#3d3834] text-white focus:border-[#c27863] focus:outline-none"
              placeholder="mikaelariatl@gmail.com"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[#a8a196] mb-1">
              Curator Passkey
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-[#191716] border border-[#3d3834] text-white focus:border-[#c27863] focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#c27863] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#b06752] transition-colors mt-2"
          >
            Unlock Curator Terminal →
          </button>
        </form>

      </div>
    </div>
  );
};
