'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSidebar } from '@/contexts/SidebarContext';

export default function Header() {
  const { user } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { toggleSidebar, isOpen } = useSidebar();

  return (
    <header 
      className="fixed top-0 right-0 bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between z-40 transition-all duration-300"
      style={{ left: isOpen ? '256px' : '64px' }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="text-xl">☰</span>
        </button>

        {/* Desktop Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="text-xl">☰</span>
        </button>

        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-64 lg:w-96">
          <span className="text-gray-400 mr-2">🔍</span>
          <input
            type="text"
            placeholder={t('ค้นหาเมนู...', 'Search menu...')}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="text-lg">{language === 'th' ? '🇹🇭' : '🇺🇸'}</span>
          <span className="hidden sm:inline text-sm font-medium">
            {language === 'th' ? 'TH' : 'EN'}
          </span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <span className="text-xl">🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500">
              {user?.role === 'admin'
                ? t('ผู้ดูแลระบบ', 'Admin')
                : t('พนักงาน', 'Staff')}
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
