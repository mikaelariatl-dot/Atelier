import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Mail, Lock, User, Phone, CheckCircle2 } from 'lucide-react';

export const BuyerAuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, openAuthModal, loginBuyer, registerBuyer, verifyEmail, addToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [isForgotSubmitted, setIsForgotSubmitted] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('Silakan masukkan email Anda', 'error');
      return;
    }
    const success = loginBuyer(email, password);
    if (success) {
      closeAuthModal();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      addToast('Please fill in name and email', 'error');
      return;
    }
    if (password && passwordConfirm && password !== passwordConfirm) {
      addToast('Passwords do not match', 'error');
      return;
    }

    registerBuyer(name, email, phone || '0812-3456-7890');
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length < 4) {
      addToast('Please enter the verification code', 'error');
      return;
    }

    const success = verifyEmail(verificationCode);
    if (success) {
      closeAuthModal();
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      addToast('Please provide your registered email', 'error');
      return;
    }
    setIsForgotSubmitted(true);
    addToast(`Password recovery link sent to ${forgotEmail}`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-md border border-[#e8e2d9] shadow-2xl p-6 sm:p-8">
        
        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-[#736e65] hover:text-[#1e1c1a]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#96422d]">Atelier Access</span>
          <h2 className="font-serif text-2xl text-[#1e1c1a] mt-1">
            {authModalMode === 'login' && 'Masuk ke Akun Anda'}
            {authModalMode === 'register' && 'Daftar Akun Baru'}
            {authModalMode === 'verify' && 'Verifikasi Email'}
            {authModalMode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-[#736e65] mt-1">
            {authModalMode === 'login' && 'Masuk untuk melihat pesanan, riwayat belanja, & invoice digital.'}
            {authModalMode === 'register' && 'Daftar akun untuk menyimpan pesanan, invoice digital, dan alamat.'}
            {authModalMode === 'verify' && 'Masukkan kode konfirmasi yang telah dikirimkan.'}
            {authModalMode === 'forgot' && 'Masukkan email terdaftar untuk mengatur ulang kata sandi.'}
          </p>
        </div>

        {/* 1. LOGIN FORM */}
        {authModalMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#736e65] mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 pl-9 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none"
                  placeholder="amanda@example.com"
                />
                <Mail className="w-4 h-4 text-[#a8a196] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-mono uppercase text-[#736e65]">Password</label>
                <button
                  type="button"
                  onClick={() => openAuthModal('forgot')}
                  className="text-[10px] text-[#96422d] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 pl-9 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-[#a8a196] absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#333] transition-colors"
            >
              Sign In to Atelier
            </button>

            <div className="text-center pt-3 text-xs text-[#736e65]">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="text-[#96422d] font-medium underline underline-offset-2"
              >
                Register Here
              </button>
            </div>
          </form>
        )}

        {/* 2. REGISTER FORM */}
        {authModalMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#736e65] mb-1">Full Legal Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 pl-9 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none"
                  placeholder="Amanda Putri"
                />
                <User className="w-4 h-4 text-[#a8a196] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#736e65] mb-1">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 pl-9 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none"
                  placeholder="amanda@example.com"
                />
                <Mail className="w-4 h-4 text-[#a8a196] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#736e65] mb-1">WhatsApp / Phone *</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 pl-9 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none"
                  placeholder="0812-3456-7890"
                />
                <Phone className="w-4 h-4 text-[#a8a196] absolute left-3 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#736e65] mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#736e65] mb-1">Confirm *</label>
                <input
                  type="password"
                  required
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <p className="text-[10px] text-[#736e65] leading-relaxed pt-1">
              By creating an account, you agree to Atelier Jastip personal sourcing terms and verification guidelines.
            </p>

            <button
              type="submit"
              className="w-full py-3 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#333] transition-colors"
            >
              Register & Proceed to Verification →
            </button>

            <div className="text-center pt-2 text-xs text-[#736e65]">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="text-[#96422d] font-medium underline underline-offset-2"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* 3. EMAIL VERIFICATION FORM */}
        {authModalMode === 'verify' && (
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <div className="p-3 bg-[#fdfbf7] border border-[#e8e2d9] text-xs text-center text-[#736e65]">
              Kami telah mengirimkan 6 digit kode keamanan ke email Anda. Masukkan kode untuk verifikasi akun.
            </div>

            <div>
              <label className="block text-center text-[11px] font-mono uppercase text-[#736e65] mb-2">
                Security Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full text-center font-mono text-2xl tracking-[0.5em] px-3 py-3 border-2 border-[#1e1c1a] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#96422d] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#7e3624] transition-colors"
            >
              Verify Email & Confirm Member Access
            </button>

            <div className="text-center text-[11px] text-[#736e65]">
              Didn't receive it?{' '}
              <button
                type="button"
                onClick={() => {
                  setVerificationCode('849201');
                  addToast('New verification code sent: 849201', 'info');
                }}
                className="text-[#1e1c1a] font-mono underline"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        {/* 4. FORGOT PASSWORD FORM */}
        {authModalMode === 'forgot' && (
          <div className="space-y-4">
            {isForgotSubmitted ? (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#2d6a4f] mx-auto" />
                <h3 className="font-serif text-lg text-[#1e1c1a]">Recovery Link Dispatched</h3>
                <p className="text-xs text-[#736e65]">
                  Please check <strong className="text-[#1e1c1a]">{forgotEmail}</strong> for instructions to reset your password.
                </p>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-6 py-2 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-wider"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#736e65] mb-1">
                    Your Registered Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="amanda@example.com"
                    className="w-full text-xs px-3 py-2.5 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#333] transition-colors"
                >
                  Send Password Reset Instructions
                </button>

                <div className="text-center text-xs text-[#736e65]">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="text-[#96422d] font-medium underline"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
