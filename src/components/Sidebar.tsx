'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();

  const handleMenuClick = () => {
    // Auto-close on mobile after clicking menu item
    if (window.innerWidth < 1024 && isOpen) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-blue-900 flex flex-col py-4 transition-all duration-300 ${
          isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:w-16 lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center px-4 mb-6">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
            P
          </div>
          {isOpen && (
            <span className="ml-3 text-white font-semibold text-lg whitespace-nowrap">
              POS System
            </span>
          )}
          {!isOpen && (
            <span className="ml-3 text-white font-semibold text-lg whitespace-nowrap hidden lg:hidden">
              POS System
            </span>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="mx-4 mb-4 flex items-center gap-3 px-3 py-2 text-white hover:bg-blue-800 rounded-lg transition-colors"
        >
          <span className="text-xl flex-shrink-0">☰</span>
          {isOpen && <span className="whitespace-nowrap">เมนู</span>}
        </button>

        {/* Menu Items */}
        <div className="flex-1 space-y-2 px-4">
          <button
            onClick={handleMenuClick}
            className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-blue-800 rounded-lg transition-colors"
          >
            <span className="text-xl flex-shrink-0">↻</span>
            {isOpen && <span className="whitespace-nowrap">รายการสั่งซื้อ</span>}
          </button>

          <button
            onClick={handleMenuClick}
            className="w-full flex items-center gap-3 px-3 py-2 text-white bg-blue-800 rounded-lg transition-colors"
          >
            <span className="text-xl flex-shrink-0">📊</span>
            {isOpen && <span className="whitespace-nowrap">รายงาน</span>}
          </button>

          <button
            onClick={handleMenuClick}
            className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-blue-800 rounded-lg transition-colors"
          >
            <span className="text-xl flex-shrink-0">⚙</span>
            {isOpen && <span className="whitespace-nowrap">ตั้งค่า</span>}
          </button>
        </div>

        {/* User Section */}
        <div className="px-4 mt-auto space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 text-white bg-blue-800 rounded-lg">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
              👤
            </div>
            {isOpen && (
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium whitespace-nowrap truncate">
                  {user?.name || 'ผู้ใช้งาน'}
                </span>
                <span className="text-xs text-gray-300 whitespace-nowrap">
                  {user?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'พนักงาน'}
                </span>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-red-600 rounded-lg transition-colors"
          >
            <span className="text-xl flex-shrink-0">🚪</span>
            {isOpen && <span className="whitespace-nowrap">ออกจากระบบ</span>}
          </button>
        </div>
      </div>
    </>
  );
}
