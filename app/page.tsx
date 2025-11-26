'use client';

import { useState } from 'react';
import { menuItems, categories } from '@/data/menuData';
import MenuCard from '@/components/MenuCard';
import CategoryTabs from '@/components/CategoryTabs';
import Sidebar from '@/components/Sidebar';
import CartSidebar from '@/components/CartSidebar';
import LoginPage from '@/components/LoginPage';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const { isOpen, toggleSidebar } = useSidebar();
  const { isAuthenticated } = useAuth();

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
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 lg:p-8 min-w-0 lg:ml-16">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="mb-4 p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors lg:hidden"
        >
          <span className="text-xl">☰ เมนู</span>
        </button>

        {/* Desktop Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:block mb-4 p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          <span className="text-xl">☰</span>
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">เมนูอาหาร</h1>
          <p className="text-gray-600">เลือกเมนูอาหารจากรายการด้านล่าง</p>
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

      {/* Right Cart Sidebar */}
      <CartSidebar />
    </div>
  );
}
