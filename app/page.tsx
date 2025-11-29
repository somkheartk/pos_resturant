
'use client';
import { useState } from 'react';
import { menuItems, categories } from '@/data/menuData';
import MenuCard from '@/components/MenuCard';
import CategoryTabs from '@/components/CategoryTabs';
import Sidebar from '@/components/Sidebar';
import CartSidebar from '@/components/CartSidebar';
import LoginPage from '@/components/LoginPage';
import Header from '@/components/Header';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const { isOpen } = useSidebar();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const filteredItems =
    activeCategory === 'ทั้งหมด'
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Header />
      <Sidebar />
      <div 
        className="flex-1 flex flex-col min-w-0 pt-[73px] transition-all duration-300" 
        style={{ 
          marginLeft: isOpen ? '256px' : '64px',
          marginRight: '384px'
        }}
      >
        <div className="flex-1 overflow-auto">
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
        </div>
      </div>
      <CartSidebar />
    </div>
  );
}
