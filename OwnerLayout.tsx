import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  ClipboardList,
  CheckCheck,
  Luggage,
  Users,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Plane,
  ChevronRight
} from 'lucide-react';
import { Screen } from '../../types';

export const OwnerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentScreen, navigate, logoutOwner, orders, payments, batches } = useApp();

  const pendingPaymentsCount = payments.filter((p) => p.status === 'Pending Review').length;
  const activeSourcingCount = orders.filter((o) => o.orderStatus === 'Processing' || o.orderStatus === 'Paid').length;
  const currentTrip = batches[0];

  const navItems: { id: Screen; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'owner-overview', label: 'Overview Desk', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'owner-orders', label: 'Order Manifest', icon: <ClipboardList className="w-4 h-4" />, badge: activeSourcingCount },
    { id: 'owner-payments', label: 'Slip Reconciliation', icon: <CheckCheck className="w-4 h-4" />, badge: pendingPaymentsCount },
    { id: 'owner-products', label: 'Product Catalog', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'owner-add-product', label: 'Add New Product', icon: <PlusCircle className="w-4 h-4" /> },
    { id: 'owner-inventory', label: 'Luggage Payload', icon: <Luggage className="w-4 h-4" /> },
    { id: 'owner-customers', label: 'Client CRM', icon: <Users className="w-4 h-4" /> },
    { id: 'owner-email-notifications', label: 'Email Triggers', icon: <Mail className="w-4 h-4" /> },
    { id: 'owner-settings', label: 'Store Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5f2] flex flex-col md:flex-row text-[#1e1c1a]">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-[#1e1c1a] text-[#e8e2d9] shrink-0 flex flex-col justify-between border-r border-[#2d2a27]">
        <div>
          {/* Brand Heading */}
          <div className="p-6 border-b border-[#2d2a27]">
            <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest uppercase text-[#c27863]">
              <span className="w-2 h-2 rounded-full bg-[#c27863] animate-pulse" />
              <span>Curator Suite</span>
            </div>
            <h1 className="font-serif text-xl tracking-wider text-white mt-1">ATELIER JASTIP CHINA</h1>
            <p className="text-[11px] font-mono text-[#8a847d] mt-0.5">Mikael Aria Wicaksono • Sole Owner</p>
          </div>

          {/* Active Trip Telemetry Card */}
          {currentTrip && (
            <div className="m-4 p-3.5 bg-[#282522] border border-[#3b3632] text-xs">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#c27863] mb-1.5">
                <span className="flex items-center">
                  <Plane className="w-3 h-3 mr-1" /> {currentTrip.flightCode}
                </span>
                <span className="text-[#8a847d]">CAN → CGK</span>
              </div>
              <div className="font-serif text-white text-sm mb-2">{currentTrip.name}</div>

              {/* Luggage Capacity Meter */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-[#8a847d]">
                  <span>Luggage Load</span>
                  <span className="text-white font-medium">{currentTrip.luggageAllocatedKg} / {currentTrip.luggageCapacityKg} kg</span>
                </div>
                <div className="w-full h-1.5 bg-[#1e1c1a] overflow-hidden">
                  <div
                    className="h-full bg-[#c27863]"
                    style={{ width: `${(currentTrip.luggageAllocatedKg / currentTrip.luggageCapacityKg) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Nav List */}
          <nav className="px-3 py-2 space-y-1">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-mono uppercase tracking-wider transition-all text-left ${
                    isActive
                      ? 'bg-[#2a2623] text-white border-l-2 border-[#c27863]'
                      : 'text-[#a8a196] hover:text-white hover:bg-[#25221f]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#96422d] text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#2d2a27] space-y-2">
          <button
            onClick={() => navigate('home')}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono uppercase tracking-wider text-[#a8a196] hover:text-white hover:bg-[#282522] transition-colors"
          >
            <span className="flex items-center">
              <ExternalLink className="w-3.5 h-3.5 mr-2" />
              Storefront View
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={logoutOwner}
            className="w-full flex items-center px-3 py-2 text-xs font-mono uppercase tracking-wider text-[#c27863] hover:text-[#d98b77] hover:bg-[#282522] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Lock Suite
          </button>
        </div>
      </aside>

      {/* MAIN OWNER WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Control Header */}
        <header className="h-16 bg-white border-b border-[#e8e2d9] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            <span className="text-xs font-mono uppercase text-[#736e65]">Kurs Acuan:</span>
            <span className="text-xs font-mono font-medium text-[#1e1c1a] bg-[#faf8f5] px-2.5 py-1 border border-[#e8e2d9]">
              1 CNY (RMB) = Rp 2.240
            </span>
            <span className="hidden sm:inline text-xs font-mono font-medium text-[#1e1c1a] bg-[#faf8f5] px-2.5 py-1 border border-[#e8e2d9]">
              Sourcing: Guangzhou & Shanghai
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('owner-add-product')}
              className="hidden sm:inline-flex items-center px-3.5 py-1.5 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#333] transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              Tambah Produk China
            </button>

            <div className="flex items-center space-x-2 pl-4 border-l border-[#e8e2d9]">
              <div className="w-8 h-8 rounded-full bg-[#f4eee6] border border-[#d4cbbf] flex items-center justify-center font-serif text-xs font-bold text-[#1e1c1a]">
                MA
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-medium text-[#1e1c1a] leading-none">Mikael Aria</div>
                <div className="text-[10px] font-mono text-[#736e65] mt-0.5">Pemilik Toko</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
};
