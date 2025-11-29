'use client';

import { useState } from 'react';
import { menuItems, categories } from '@/data/menuData';
import MenuCard from '@/components/MenuCard';
import CategoryTabs from '@/components/CategoryTabs';
import Sidebar from '@/components/Sidebar';
import CartSidebar from '@/components/CartSidebar';
import LoginPage from '@/components/LoginPage';
import OrdersPage from '@/components/OrdersPage';
import ReportsPage from '@/components/ReportsPage';
import SettingsPage from '@/components/SettingsPage';
import Header from '@/components/Header';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

type Page = 'menu' | 'orders' | 'reports' | 'settings';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [currentPage, setCurrentPage] = useState<Page>('menu');
  const { isOpen, toggleSidebar } = useSidebar();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const filteredItems =
    activeCategory === 'ทั้งหมด'
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <Header />
      
      {/* Left Sidebar */}
      <Sidebar onNavigate={setCurrentPage} currentPage={currentPage} />

      {/* Main Content with Header */}
      <div 
        className="flex-1 flex flex-col min-w-0 pt-[73px] transition-all duration-300" 
        style={{ 
          marginLeft: isOpen ? '256px' : '64px',
          marginRight: currentPage === 'menu' ? '384px' : '0' 
        }}
      >
        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {currentPage === 'menu' && (
            <div className="p-4 lg:p-8">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold mb-2">
                  {t('เมนูอาหาร', 'Food Menu')}
                </h1>
                <p className="text-gray-600">
                  {t('เลือกเมนูอาหารจากรายการด้านล่าง', 'Select menu items from the list below')}
                </p>
              </div>

              <CategoryTabs
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {currentPage === 'orders' && <OrdersPage />}
          {currentPage === 'reports' && <ReportsPage />}
          {currentPage === 'settings' && <SettingsPage />}
        </div>
      </div>

      {/* Right Cart Sidebar - Only show on menu page */}
      {currentPage === 'menu' && <CartSidebar />}
    </div>
  );
}
