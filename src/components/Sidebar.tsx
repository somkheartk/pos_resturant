'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

type Page = 'menu' | 'orders' | 'reports' | 'settings';

interface SidebarProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

export default function Sidebar({ onNavigate, currentPage }: SidebarProps) {
  const { isOpen, toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const role = user?.role || 'staff';

  // เมนูตาม role
  const menuList = [
    { key: 'orders', icon: '↻', label: 'รายการสั่งซื้อ' },
    { key: 'menu', icon: '🍽️', label: 'เมนูอาหาร' },
    ...(role === 'admin' ? [
      { key: 'reports', icon: '📊', label: 'รายงาน' },
      { key: 'settings', icon: '⚙', label: 'ตั้งค่า' },
    ] : [])
  ];

  const handleMenuClick = (page: Page) => {
    onNavigate(page);
    // Auto-close on mobile after clicking menu item
    if (window.innerWidth < 1024 && isOpen) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-blue-900 flex flex-col pt-[73px] pb-4 transition-all duration-300 ${
          isOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-16'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 mb-6 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
              P
            </div>
            <span className={`text-white font-semibold text-lg whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>
              POS System
            </span>
          </div>
          {/* Close button - visible only when expanded */}
          {isOpen && (
            <button
              onClick={toggleSidebar}
              className="p-1 text-white hover:bg-blue-800 rounded transition-colors"
            >
              <span className="text-xl">×</span>
            </button>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex-1 space-y-2">
          {menuList.map(menu => (
            <button
              key={menu.key}
              onClick={() => handleMenuClick(menu.key as Page)}
              className={`w-full flex items-center py-2.5 pr-4 text-white rounded-lg transition-colors ${currentPage === menu.key ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
            >
              <div className="w-16 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">{menu.icon}</span>
              </div>
              <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>{menu.label}</span>
            </button>
          ))}
        </div>

        {/* User Section */}
        <div className="mt-auto space-y-2">
          <div className="w-full flex items-center py-2.5 pr-4 text-white bg-blue-800 rounded-lg">
            <div className="w-16 flex items-center justify-center flex-shrink-0">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className={`flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-300 ${
              isOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'
            }`}>
              <span className="text-sm font-medium whitespace-nowrap truncate">
                {user?.name || 'ผู้ใช้งาน'}
              </span>
              <span className="text-xs text-gray-300 whitespace-nowrap">
                {user?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'พนักงาน'}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full flex items-center py-2.5 pr-4 text-white hover:bg-red-600 rounded-lg transition-colors"
          >
            <div className="w-16 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🚪</span>
            </div>
            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </>
  );
}
