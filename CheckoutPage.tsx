import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Truck, ChevronRight, Check, AlertCircle, ArrowLeft, Lock } from 'lucide-react';
import { Order, PaymentMethod } from '../../types';

export const CheckoutPage: React.FC = () => {
  const { cart, currentUser, storeSettings, placeOrder, openAuthModal, addToast, navigate } = useApp();

  // If buyer not logged in or not verified, enforce authentication
  if (!currentUser || !currentUser.isEmailVerified) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#faf8f5] px-4 py-16">
        <div className="max-w-md w-full bg-white p-8 border border-[#e8e2d9] text-center shadow-xs">
          <div className="w-12 h-12 mx-auto mb-4 bg-[#f4eee6] flex items-center justify-center text-[#96422d]">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl text-[#1e1c1a] mb-2">Authentication Required</h2>
          <p className="text-sm text-[#736e65] mb-6">
            To ensure secure personal luggage allocation and tracking, all Atelier Jastip orders require a registered and verified member profile.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full py-3 bg-[#1e1c1a] text-[#faf8f5] text-xs uppercase tracking-widest font-medium hover:bg-[#333] transition-colors"
            >
              Sign In to Proceed
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="w-full py-3 border border-[#1e1c1a] text-[#1e1c1a] text-xs uppercase tracking-widest font-medium hover:bg-[#faf8f5] transition-colors"
            >
              Create Account
            </button>
          </div>
          <button
            onClick={() => navigate('cart')}
            className="mt-6 text-xs text-[#736e65] hover:text-[#1e1c1a] underline underline-offset-4"
          >
            Return to Shopping Cart
          </button>
        </div>
      </div>
    );
  }

  // Multi-step Checkout State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Address State
  const defaultAddr = currentUser.addresses.find((a) => a.isDefault) || currentUser.addresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddr ? defaultAddr.id : 'new');
  const [addressForm, setAddressForm] = useState({
    recipientName: defaultAddr ? defaultAddr.recipientName : currentUser.fullName,
    phone: defaultAddr ? defaultAddr.phone : currentUser.phone,
    street: defaultAddr ? defaultAddr.street : '',
    district: 'Kebayoran Baru',
    city: defaultAddr ? defaultAddr.city : 'Jakarta Selatan',
    province: defaultAddr ? defaultAddr.province : 'DKI Jakarta',
    postalCode: defaultAddr ? defaultAddr.postalCode : '12190',
  });

  // Shipping Method
  const [courier, setCourier] = useState<Order['courier']>('Paxel Cold');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BCA');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.priceIdr * item.quantity, 0);
  const totalWeightKg = Number(
    cart.reduce((acc, item) => acc + item.product.weightKg * item.quantity, 0).toFixed(2)
  );

  const isFreeDomesticShipping = subtotal >= storeSettings.shippingRules.freeShippingThreshold;
  const shippingFee = isFreeDomesticShipping
    ? 0
    : courier === 'Paxel Cold'
    ? storeSettings.shippingRules.paxelColdFee
    : storeSettings.shippingRules.standardFee;

  const grandTotal = subtotal + shippingFee;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAddressId === 'new') {
      if (!addressForm.recipientName || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.postalCode) {
        addToast('Please complete all required shipping address fields', 'error');
        return;
      }
    }
    setCurrentStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handleStep3Submit = () => {
    setCurrentStep(4);
  };

  const handleFinalOrderSubmit = () => {
    if (!acceptedTerms) {
      addToast('Please agree to Jastip terms & customs declaration', 'error');
      return;
    }

    setIsSubmitting(true);

    const finalAddress: Order['shippingAddress'] =
      selectedAddressId !== 'new' && defaultAddr
        ? {
            recipientName: defaultAddr.recipientName,
            phone: defaultAddr.phone,
            street: defaultAddr.street,
            district: 'Kebayoran Baru',
            city: defaultAddr.city,
            province: defaultAddr.province,
            postalCode: defaultAddr.postalCode,
          }
        : {
            recipientName: addressForm.recipientName,
            phone: addressForm.phone,
            street: addressForm.street,
            district: addressForm.district,
            city: addressForm.city,
            province: addressForm.province,
            postalCode: addressForm.postalCode,
          };

    setTimeout(() => {
      const createdOrder = placeOrder(finalAddress, courier, paymentMethod, specialInstructions);
      setIsSubmitting(false);
      navigate('payment-instructions', { orderId: createdOrder.id });
    }, 600);
  };

  return (
    <div className="bg-[#fbf9f8] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb & Step Tracker */}
        <div className="mb-8">
          <button
            onClick={() => navigate('cart')}
            className="inline-flex items-center text-xs text-[#736e65] hover:text-[#1e1c1a] mb-4 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1 group-hover:-translate-x-0.5 transition-transform" />
            Back to Cart
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#e8e2d9] pb-6 gap-4">
            <div>
              <span className="text-[10px] tracking-widest uppercase font-mono text-[#96422d]">Atelier Checkout</span>
              <h1 className="font-serif text-3xl text-[#1e1c1a]">Secure Concierge Order</h1>
            </div>

            {/* Stepper Pills */}
            <div className="flex items-center space-x-2 text-xs">
              {[
                { step: 1, label: 'Address' },
                { step: 2, label: 'Shipping' },
                { step: 3, label: 'Summary' },
                { step: 4, label: 'Payment' },
              ].map((s, idx) => (
                <div key={s.step} className="flex items-center">
                  <div
                    onClick={() => {
                      if (currentStep > s.step) setCurrentStep(s.step as any);
                    }}
                    className={`flex items-center px-3 py-1.5 border text-[11px] font-mono tracking-wider cursor-pointer transition-colors ${
                      currentStep === s.step
                        ? 'border-[#1e1c1a] bg-[#1e1c1a] text-white'
                        : currentStep > s.step
                        ? 'border-[#b5a99a] bg-[#f4eee6] text-[#1e1c1a]'
                        : 'border-[#e8e2d9] text-[#a8a196] cursor-not-allowed'
                    }`}
                  >
                    {currentStep > s.step ? (
                      <Check className="w-3 h-3 mr-1 text-[#96422d]" />
                    ) : (
                      <span className="mr-1.5">{s.step}.</span>
                    )}
                    {s.label}
                  </div>
                  {idx < 3 && <ChevronRight className="w-3.5 h-3.5 text-[#d4cbbf] mx-1" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Steps Form (Cols 1-7) */}
          <div className="lg:col-span-7 bg-white border border-[#e8e2d9] p-6 sm:p-8">
            
            {/* STEP 1: SHIPPING ADDRESS */}
            {currentStep === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl text-[#1e1c1a] mb-1">Step 1: Recipient & Delivery Address</h2>
                  <p className="text-xs text-[#736e65]">
                    Where should Clara ship your authentic items after customs inspection in Jakarta?
                  </p>
                </div>

                {/* Saved Address Cards */}
                {currentUser.addresses.length > 0 && (
                  <div className="space-y-3 mb-6">
                    <label className="text-[11px] uppercase tracking-wider font-mono text-[#736e65] block">
                      Select Saved Address
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentUser.addresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-3.5 border cursor-pointer transition-all text-xs relative ${
                            selectedAddressId === addr.id
                              ? 'border-[#1e1c1a] bg-[#fdfbf7]'
                              : 'border-[#e8e2d9] hover:border-[#b5a99a]'
                          }`}
                        >
                          {addr.isDefault && (
                            <span className="absolute top-2 right-2 text-[9px] font-mono uppercase bg-[#f4eee6] text-[#96422d] px-1.5 py-0.5">
                              Default
                            </span>
                          )}
                          <div className="font-medium text-[#1e1c1a] mb-1">{addr.recipientName}</div>
                          <div className="text-[#736e65] text-[11px]">{addr.phone}</div>
                          <div className="text-[#736e65] line-clamp-2 mt-1">
                            {addr.street}, {addr.city}, {addr.province} {addr.postalCode}
                          </div>
                        </div>
                      ))}
                      
                      <div
                        onClick={() => setSelectedAddressId('new')}
                        className={`p-3.5 border border-dashed cursor-pointer transition-all text-xs flex items-center justify-center text-center ${
                          selectedAddressId === 'new'
                            ? 'border-[#1e1c1a] bg-[#fdfbf7] text-[#1e1c1a]'
                            : 'border-[#d4cbbf] text-[#736e65] hover:border-[#1e1c1a]'
                        }`}
                      >
                        + Enter New Domestic Address
                      </div>
                    </div>
                  </div>
                )}

                {/* New Address Fields if selected */}
                {selectedAddressId === 'new' && (
                  <div className="space-y-4 pt-2 border-t border-[#f0ece6]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#736e65] mb-1">
                          Recipient Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.recipientName}
                          onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                          className="w-full text-xs px-3 py-2.5 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none"
                          placeholder="e.g. Amanda Putri"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#736e65] mb-1">
                          WhatsApp / Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          className="w-full text-xs px-3 py-2.5 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none"
                          placeholder="0812-xxxx-xxxx"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#736e65] mb-1">
                        Street Address & Residence / Apt Unit *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        className="w-full text-xs px-3 py-2.5 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none"
                        placeholder="e.g. Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#736e65] mb-1">
                          City / District *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          className="w-full text-xs px-3 py-2.5 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#736e65] mb-1">
                          Province *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.province}
                          onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                          className="w-full text-xs px-3 py-2.5 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#736e65] mb-1">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.postalCode}
                          onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                          className="w-full text-xs px-3 py-2.5 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#333] transition-colors"
                  >
                    Continue to Shipping Method →
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: SHIPPING METHOD */}
            {currentStep === 2 && (
              <form onSubmit={handleStep2Submit} className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl text-[#1e1c1a] mb-1">Step 2: Domestic Courier & Handling</h2>
                  <p className="text-xs text-[#736e65]">
                    Items are hand-carried by Clara from Tokyo/Paris, cleared through customs, and re-dispatched from Jakarta.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'Paxel Cold',
                      name: 'Paxel Cold / Fragile Luxury Pack',
                      desc: 'Temperature controlled, double bubble-wrap packing for cosmetics, chocolate & tea.',
                      time: '1-2 Days from Jakarta arrival',
                      price: isFreeDomesticShipping ? 'Free (Tier Eligible)' : `Rp ${storeSettings.shippingRules.paxelColdFee.toLocaleString('id-ID')}`,
                    },
                    {
                      id: 'JNE YES',
                      name: 'JNE YES (Yakin Esok Sampai) + Full Insurance',
                      desc: 'Priority overnight transit coverage for designer bags & apparel.',
                      time: 'Next Day delivery throughout Java',
                      price: isFreeDomesticShipping ? 'Free (Tier Eligible)' : `Rp ${storeSettings.shippingRules.standardFee.toLocaleString('id-ID')}`,
                    },
                    {
                      id: 'GrabExpress Instant',
                      name: 'GrabExpress Instant Courier (Jabodetabek)',
                      desc: 'Direct courier delivery on the day Clara returns to Jakarta.',
                      time: 'Same day upon batch landing',
                      price: 'Rp 85.000',
                    },
                  ].map((c) => (
                    <label
                      key={c.id}
                      className={`block p-4 border cursor-pointer transition-all ${
                        courier === c.id ? 'border-[#1e1c1a] bg-[#fdfbf7]' : 'border-[#e8e2d9] hover:border-[#b5a99a]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            name="courier"
                            checked={courier === c.id}
                            onChange={() => setCourier(c.id as any)}
                            className="mt-1 accent-[#1e1c1a]"
                          />
                          <div>
                            <div className="text-xs font-medium text-[#1e1c1a]">{c.name}</div>
                            <div className="text-[11px] text-[#736e65] mt-0.5">{c.desc}</div>
                            <div className="text-[10px] font-mono text-[#96422d] mt-1">Est: {c.time}</div>
                          </div>
                        </div>
                        <div className="text-xs font-mono font-medium text-[#1e1c1a]">{c.price}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#736e65] mb-1">
                    Special Packaging or Delivery Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none"
                    placeholder="e.g. Leave with building security if not home, or include original brand shopping bag."
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-mono uppercase text-[#736e65] hover:text-[#1e1c1a]"
                  >
                    ← Back to Address
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#333] transition-colors"
                  >
                    Review Order Summary →
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: ORDER SUMMARY */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl text-[#1e1c1a] mb-1">Step 3: Review Order & Luggage Quota</h2>
                  <p className="text-xs text-[#736e65]">
                    Confirm your requested items and estimated delivery date before picking your payment channel.
                  </p>
                </div>

                {/* Items List */}
                <div className="divide-y divide-[#f0ece6] border border-[#e8e2d9]">
                  {cart.map((item) => (
                    <div key={`${item.product.id}-${item.selectedVariant || ''}`} className="p-4 flex items-center space-x-4">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover bg-[#f4eee6] border border-[#e8e2d9]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-mono text-[#96422d] uppercase">
                          Brand: {item.product.brand} • SKU: {item.product.sku}
                        </div>
                        <h4 className="text-xs font-medium text-[#1e1c1a] truncate">{item.product.name}</h4>
                        {item.selectedVariant && (
                          <div className="text-[11px] text-[#736e65]">Option: {item.selectedVariant}</div>
                        )}
                        <div className="text-[11px] font-mono text-[#736e65] mt-1">
                          Qty: {item.quantity} × Rp {item.product.priceIdr.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="text-right text-xs font-mono font-medium text-[#1e1c1a]">
                        Rp {(item.product.priceIdr * item.quantity).toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Logistics Banner */}
                <div className="bg-[#f9f6f0] p-4 border border-[#e8e2d9] text-xs space-y-2">
                  <div className="flex items-center text-[#96422d] font-mono font-medium uppercase text-[11px]">
                    <ShieldCheck className="w-4 h-4 mr-1.5" />
                    Atelier 100% Sourcing Authenticity Promise
                  </div>
                  <p className="text-[#59554d] text-[11px] leading-relaxed">
                    Clara personally purchases each unit from official boutiques in Ginza/Omotesando or Le Marais Paris. Every item includes the original boutique paper receipt and brand dustbag. If an item is sold out in Tokyo, you will receive an immediate full 100% refund.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-mono uppercase text-[#736e65] hover:text-[#1e1c1a]"
                  >
                    ← Back to Shipping
                  </button>
                  <button
                    type="button"
                    onClick={handleStep3Submit}
                    className="px-6 py-3 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#333] transition-colors"
                  >
                    Proceed to Payment Options →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PAYMENT METHOD SELECTION */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl text-[#1e1c1a] mb-1">Step 4: Select Payment Channel</h2>
                  <p className="text-xs text-[#736e65]">
                    Select Bank Transfer (BCA / BNI / CIMB) or scan with any QRIS mobile banking / e-wallet.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'BCA' as PaymentMethod,
                      name: 'BCA (Bank Central Asia) Manual Transfer',
                      tag: 'Most Popular',
                      desc: 'Instant verification with 3-digit anti-collision code and proof slip upload.',
                      icon: '🏦',
                    },
                    {
                      id: 'BNI' as PaymentMethod,
                      name: 'BNI (Bank Negara Indonesia) Manual Transfer',
                      tag: 'Supported',
                      desc: 'Direct transfer to Clara Sutanto BNI account with fast reconciliation.',
                      icon: '🏦',
                    },
                    {
                      id: 'CIMB' as PaymentMethod,
                      name: 'CIMB Niaga Bank Transfer',
                      tag: 'Supported',
                      desc: 'Direct transfer to Clara Sutanto CIMB account.',
                      icon: '🏦',
                    },
                    {
                      id: 'QRIS' as PaymentMethod,
                      name: 'QRIS Real-Time Scan (BCA, GoPay, OVO, ShopeePay)',
                      tag: 'Dynamic QR',
                      desc: 'Scan real-time QR code with any Indonesian banking or e-wallet app.',
                      icon: '📱',
                    },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`block p-4 border cursor-pointer transition-all ${
                        paymentMethod === method.id ? 'border-[#1e1c1a] bg-[#fdfbf7]' : 'border-[#e8e2d9] hover:border-[#b5a99a]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === method.id}
                            onChange={() => setPaymentMethod(method.id)}
                            className="mt-1 accent-[#1e1c1a]"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">{method.icon}</span>
                              <span className="text-xs font-medium text-[#1e1c1a]">{method.name}</span>
                              <span className="text-[9px] font-mono uppercase bg-[#f4eee6] text-[#96422d] px-1.5 py-0.5">
                                {method.tag}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#736e65] mt-1 pl-6">{method.desc}</div>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Notice regarding 3-digit anti-collision */}
                <div className="p-4 border border-[#e8e2d9] bg-[#fbf9f8] text-xs space-y-2">
                  <div className="flex items-center text-[#1e1c1a] font-mono text-[11px] font-medium">
                    <AlertCircle className="w-3.5 h-3.5 text-[#96422d] mr-1.5" />
                    How Payment Matching Works
                  </div>
                  <p className="text-[#736e65] text-[11px] leading-relaxed">
                    Upon clicking "Place Order & Pay", our system will assign a temporary <strong>unique 3-digit verification code</strong> (e.g. +Rp 243) to your total. Please transfer the exact amount and upload your receipt screenshot so Clara can confirm your order immediately.
                  </p>
                </div>

                {/* Agreement Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start space-x-2 text-xs text-[#59554d] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 accent-[#1e1c1a]"
                    />
                    <span>
                      I understand that this is a customized Jastip purchase. Clara Sutanto will personally inspect and carry items from official overseas retailers. Full refund is guaranteed if unavailable at boutique.
                    </span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-[#f0ece6]">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-xs font-mono uppercase text-[#736e65] hover:text-[#1e1c1a]"
                  >
                    ← Back to Review
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting || !acceptedTerms}
                    onClick={handleFinalOrderSubmit}
                    className={`px-8 py-3.5 text-xs font-mono uppercase tracking-widest text-white transition-all ${
                      isSubmitting || !acceptedTerms
                        ? 'bg-[#a8a196] cursor-not-allowed'
                        : 'bg-[#96422d] hover:bg-[#7e3624] shadow-sm'
                    }`}
                  >
                    {isSubmitting ? 'Securing Allocation...' : 'Place Order & View Payment Details →'}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Summary Sidebar (Cols 8-12) */}
          <div className="lg:col-span-5 space-y-6 sticky top-28">
            <div className="bg-white border border-[#e8e2d9] p-6">
              <h3 className="font-serif text-lg text-[#1e1c1a] mb-4 pb-3 border-b border-[#f0ece6]">
                Summary ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
              </h3>

              <div className="space-y-3 text-xs mb-6">
                <div className="flex justify-between text-[#736e65]">
                  <span>Items Subtotal</span>
                  <span className="font-mono text-[#1e1c1a]">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>

                <div className="flex justify-between text-[#736e65]">
                  <span>Total Payload Weight</span>
                  <span className="font-mono text-[#1e1c1a]">{totalWeightKg} kg</span>
                </div>

                <div className="flex justify-between text-[#736e65]">
                  <span>Domestic Courier</span>
                  <span className="font-mono text-[#1e1c1a]">
                    {shippingFee === 0 ? (
                      <span className="text-[#2d6a4f] font-medium">Free (Threshold Reached)</span>
                    ) : (
                      `Rp ${shippingFee.toLocaleString('id-ID')}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-[#736e65]">
                  <span>Customs & Sourcing Handling</span>
                  <span className="font-mono text-[#2d6a4f]">Included</span>
                </div>

                <div className="pt-3 border-t border-[#f0ece6] flex justify-between items-baseline">
                  <span className="font-medium text-sm text-[#1e1c1a]">Estimated Total</span>
                  <div className="text-right">
                    <div className="font-mono text-xl font-medium text-[#1e1c1a]">
                      Rp {grandTotal.toLocaleString('id-ID')}
                    </div>
                    <div className="text-[10px] text-[#736e65]">
                      (Plus 3-digit verification code on next step)
                    </div>
                  </div>
                </div>
              </div>

              {/* Concierge Info Box */}
              <div className="border-t border-[#f0ece6] pt-4 text-[11px] text-[#736e65] space-y-2">
                <div className="flex items-center text-[#1e1c1a] font-medium">
                  <Truck className="w-3.5 h-3.5 mr-1.5 text-[#96422d]" />
                  Delivery Timeline
                </div>
                <p>
                  Current Tokyo Drop batch will be hand-inspected and dispatched to your address by <strong>Apr 04, 2025</strong>.
                </p>
              </div>
            </div>

            {/* Assistance card */}
            <div className="p-4 bg-[#f4eee6] border border-[#e8e2d9] text-xs">
              <div className="font-serif text-sm text-[#1e1c1a] mb-1">Need help with checkout?</div>
              <p className="text-[11px] text-[#736e65] mb-2 leading-relaxed">
                Connect directly with Clara via WhatsApp for urgent inquiries or specific boutique sizing checks.
              </p>
              <a
                href="https://wa.me/6281234567890?text=Hello%20Clara,%20I%20have%20a%20question%20about%20my%20Atelier%20order"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[11px] text-[#96422d] hover:underline"
              >
                Chat on WhatsApp (+62 812-3456-7890) →
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
