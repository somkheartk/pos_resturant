"use client";
import ReportsPage from '@/components/ReportsPage';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import LoginPage from '@/components/LoginPage';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSidebar } from '@/contexts/SidebarContext';

export default function ReportsRoute() {
  const { isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { t } = useLanguage();
  const { isOpen } = useSidebar();
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Header />
      <Sidebar />
      <div
        className="flex-1 flex flex-col min-w-0 pt-[73px] transition-all duration-300 relative"
        style={{ marginLeft: isOpen ? '256px' : '64px', marginRight: '384px' }}
      >
        <main className="flex-1 overflow-auto">
          <ReportsPage />
        </main>
        {/* Cart Toggle Button */}
        {cartItems && cartItems.length > 0 && (
          <button
            className="absolute bottom-8 right-8 z-30 bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-orange-600 transition-all"
            onClick={() => setIsCartOpen((open) => !open)}
          >
            {isCartOpen ? t('ปิดรายการสินค้า', 'Hide Cart') : t('ดูรายการสินค้า', 'View Cart')}
          </button>
        )}
        {/* Slide-in Cart Panel */}
        <div className="flex">
          <div className="flex-1" />
          {cartItems && cartItems.length > 0 && (
            <div
              className={`h-[calc(100vh-4rem)] w-80 bg-white shadow-2xl z-20 absolute top-8 right-8 transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
              style={{ maxHeight: 'calc(100vh - 4rem)' }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-lg font-bold text-orange-600">{t('รายการสินค้า', 'Cart Items')}</h2>
                <button
                  className="text-gray-400 hover:text-gray-700 text-2xl"
                  onClick={() => setIsCartOpen(false)}
                >×</button>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto h-[calc(100%-64px)]">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-semibold text-gray-800">{item.name}</div>
                      <div className="text-xs text-gray-500">{t('จำนวน', 'Qty')}: {item.quantity}</div>
                    </div>
                    <div className="font-bold text-orange-500">฿{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
                <div className="pt-4 border-t font-bold text-lg text-right text-orange-600">
                  {t('รวม', 'Total')}: ฿{cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
