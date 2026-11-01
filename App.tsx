import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';

// Storefront Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { SearchModal } from './components/common/SearchModal';
import { CartDrawer } from './components/storefront/CartDrawer';
import { HomePage } from './components/storefront/HomePage';
import { ShopPage } from './components/storefront/ShopPage';
import { ProductDetailPage } from './components/storefront/ProductDetailPage';
import { CartPage } from './components/storefront/CartPage';
import { CheckoutPage } from './components/storefront/CheckoutPage';
import { PaymentInstructionsPage } from './components/storefront/PaymentInstructionsPage';
import { OrderConfirmationPage } from './components/storefront/OrderConfirmationPage';

// Buyer Components
import { BuyerAuthModal } from './components/buyer/BuyerAuthModal';
import { BuyerDashboard } from './components/buyer/BuyerDashboard';
import { LoginPage } from './components/auth/LoginPage';

// Owner Components
import { OwnerLayout } from './components/owner/OwnerLayout';
import { OwnerLogin } from './components/owner/OwnerLogin';
import { OwnerOverview } from './components/owner/OwnerOverview';
import { OwnerProducts } from './components/owner/OwnerProducts';
import { OwnerProductForm } from './components/owner/OwnerProductForm';
import { OwnerOrders } from './components/owner/OwnerOrders';
import { OwnerPayments } from './components/owner/OwnerPayments';
import { OwnerInventory } from './components/owner/OwnerInventory';
import { OwnerCustomers } from './components/owner/OwnerCustomers';
import { OwnerEmailNotifications } from './components/owner/OwnerEmailNotifications';
import { OwnerSettings } from './components/owner/OwnerSettings';

const AppContent: React.FC = () => {
  const { currentScreen, isOwnerLoggedIn } = useApp();

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  const isOwnerRoute = currentScreen.startsWith('owner-');

  // If attempting to view owner route while logged out, show standard login
  if (isOwnerRoute && !isOwnerLoggedIn) {
    return <LoginPage />;
  }

  // Owner Suite View
  if (isOwnerRoute && isOwnerLoggedIn) {
    return (
      <OwnerLayout>
        <ToastContainer />
        {currentScreen === 'owner-overview' && <OwnerOverview />}
        {currentScreen === 'owner-products' && <OwnerProducts />}
        {currentScreen === 'owner-add-product' && <OwnerProductForm />}
        {currentScreen === 'owner-orders' && <OwnerOrders />}
        {currentScreen === 'owner-payments' && <OwnerPayments />}
        {currentScreen === 'owner-inventory' && <OwnerInventory />}
        {currentScreen === 'owner-customers' && <OwnerCustomers />}
        {currentScreen === 'owner-email-notifications' && <OwnerEmailNotifications />}
        {currentScreen === 'owner-settings' && <OwnerSettings />}
      </OwnerLayout>
    );
  }

  // Public Storefront View
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f8] text-[#1e1c1a]">
      {/* Toast Notification Layer */}
      <ToastContainer />

      {/* Auth Modal for Buyers */}
      <BuyerAuthModal />

      {/* Cart Slide-Over Drawer */}
      <CartDrawer />

      {/* Live Global Search Modal */}
      <SearchModal />

      {/* Navigation Bar */}
      <Navbar />

      {/* Main Page Slot */}
      <main className="flex-1 pt-24">
        {currentScreen === 'home' && <HomePage />}
        {currentScreen === 'shop' && <ShopPage />}
        {currentScreen === 'product-detail' && <ProductDetailPage />}
        {currentScreen === 'cart' && <CartPage />}
        {currentScreen === 'checkout' && <CheckoutPage />}
        {currentScreen === 'payment-instructions' && <PaymentInstructionsPage />}
        {currentScreen === 'order-confirmation' && <OrderConfirmationPage />}
        {currentScreen === 'login' && <LoginPage />}
        {(currentScreen === 'buyer-dashboard' ||
          currentScreen === 'buyer-orders' ||
          currentScreen === 'buyer-wishlist') && <BuyerDashboard />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
