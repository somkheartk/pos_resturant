"use client";

import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePermissions } from '@/contexts/PermissionContext';

export default function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { getUserPermissions, getUserRoles } = usePermissions();
  const pathname = usePathname();
  // Ensure permissions use the current auth role as fallback, not default staff
  const userRoles = getUserRoles(
    user?.id || 'anonymous',
    (user as any)?.roles || (user?.role ? [user.role] : ['staff'])
  );
  const userPerms = getUserPermissions(
    user?.id || 'anonymous',
    (Array.isArray((user as any)?.roles) ? (user as any)?.roles?.[0] : (user?.role as any))
  );
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Debug log
  console.log('Sidebar userPerms:', userPerms);
  console.log('Sidebar user:', user);

  // Inline SVG icons for consistent look without extra deps
  const Icons = {
    orders: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="6" y="3" width="12" height="18" rx="2" className=""/>
        <path d="M9 7h6M8 11h8M8 15h8" />
      </svg>
    ),
    cashier: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M6 11h4M6 15h2M14 11h4M14 15h4" />
        <path d="M2 7l2-4h16l2 4" />
      </svg>
    ),
    menu: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <rect x="4" y="4" width="7" height="7" rx="1" />
        <rect x="13" y="4" width="7" height="7" rx="1" />
        <rect x="4" y="13" width="7" height="7" rx="1" />
        <rect x="13" y="13" width="7" height="7" rx="1" />
      </svg>
    ),
    master: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 7h6l2 2h10v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
      </svg>
    ),
    reports: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <rect x="4" y="13" width="3" height="7" rx="1" />
        <rect x="10.5" y="9" width="3" height="11" rx="1" />
        <rect x="17" y="5" width="3" height="15" rx="1" />
      </svg>
    ),
    settings: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3.2" />
        <path d="M19.4 15a7.9 7.9 0 0 0 .1-6l-2 .8a5.9 5.9 0 0 1 0 4.4l1.9.8zM4.5 9a7.9 7.9 0 0 0 0 6l1.9-.8a5.9 5.9 0 0 1 0-4.4L4.5 9zM9 4.6a7.9 7.9 0 0 1 6 0L14.2 6a5.9 5.9 0 0 0-4.4 0L9 4.6zM14.2 18a5.9 5.9 0 0 1-4.4 0L9 19.4a7.9 7.9 0 0 0 6 0L14.2 18z" />
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Z" />
        <path d="M3.8 20.1a8.2 8.2 0 0 1 16.4 0c-2.4 1-5 1.6-8.2 1.6s-5.8-.6-8.2-1.6Z" />
      </svg>
    ),
    logout: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M15 12H4" />
        <path d="M11 8l-4 4 4 4" />
        <rect x="15" y="4" width="5" height="16" rx="2" />
      </svg>
    ),
  } as const;

  // เมนูตาม role พร้อมเมนูย่อย
  const menuList = [
    { key: 'orders', icon: Icons.orders, label: t('รายการสั่งซื้อ', 'Orders'), href: '/orders', show: userPerms.orders ?? true },
    { key: 'menu', icon: Icons.cashier, label: t('เมนูอาหาร / แคชเชียร์', 'Menu / Cashier'), href: '/', show: userPerms.menu ?? true },
    { key: 'master', icon: Icons.master, label: t('จัดการเมนูอาหาร', 'Master Menu'), href: '/master', show: userPerms.master ?? true },
    {
      key: 'reports', icon: Icons.reports, label: t('รายงาน', 'Reports'), href: '/reports', show: userPerms.reports ?? true,
      children: [
        { key: 'reports.viewDaily', label: t('รายวัน', 'Daily'), href: '/reports?tab=daily', show: userPerms['reports.viewDaily'] ?? true },
        { key: 'reports.viewMonthly', label: t('รายเดือน', 'Monthly'), href: '/reports?tab=monthly', show: userPerms['reports.viewMonthly'] ?? true },
      ].filter(c => c.show)
    },
    {
      key: 'settings', icon: Icons.settings, label: t('ตั้งค่า', 'Settings'), href: '/settings', show: userPerms.settings ?? true,
      children: [
        { key: 'settings.company', label: t('ข้อมูลร้าน', 'Company'), href: '/settings?tab=company', show: userPerms['settings.company'] ?? true },
        { key: 'settings.printers', label: t('เครื่องพิมพ์', 'Printers'), href: '/settings?tab=printers', show: userPerms['settings.printers'] ?? true },
      ].filter(c => c.show)
    },
    {
      key: 'users', icon: Icons.users, label: t('ผู้ใช้งาน', 'Users'), href: '/users', show: userPerms.users ?? true,
      children: [
        { key: 'users.invite', label: t('เชิญผู้ใช้', 'Invite user'), href: '/users?tab=invite', show: userPerms['users.invite'] ?? true },
        { key: 'users.delete', label: t('ลบผู้ใช้', 'Delete user'), href: '/users?tab=manage', show: userPerms['users.delete'] ?? true },
      ].filter(c => c.show)
    },
  ].filter(m => m.show);

  console.log('Sidebar menuList:', menuList);

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
        <div className="flex-1 space-y-2 px-1">
          {menuList.map(menu => {
            const active = pathname === menu.href || pathname.startsWith(menu.href + '/');
            const hasChildren = Array.isArray((menu as any).children) && (menu as any).children.length > 0;
            const open = openGroups[menu.key] ?? active;
            return (
              <div key={menu.key}>
                <div className={`w-full flex items-center justify-between py-2.5 pr-2 text-white rounded-lg transition-colors ${active ? 'bg-blue-800/60' : 'hover:bg-blue-800'}`}>
                  <Link
                    href={menu.href}
                    title={typeof menu.label === 'string' ? menu.label : undefined}
                    className="flex items-center flex-1"
                  >
                    <div className="w-16 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">{menu.icon}</span>
                    </div>
                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>{menu.label}</span>
                  </Link>
                  {hasChildren && isOpen && (
                    <button onClick={() => setOpenGroups(prev => ({ ...prev, [menu.key]: !open }))} className="px-2 text-gray-200 hover:text-white">
                      {open ? '▾' : '▸'}
                    </button>
                  )}
                </div>
                {hasChildren && isOpen && open && (
                  <div className="ml-6 mt-1 mb-2 border-l border-blue-800/60">
                    {((menu as any).children as Array<any>).map((c) => {
                      const subActive = false; // path highlight for query tabs omitted
                      return (
                        <Link
                          key={c.key}
                          href={c.href}
                          className={`block pl-6 pr-3 py-2 text-sm rounded-r-lg text-gray-200 hover:text-white hover:bg-blue-800/50 ${subActive ? 'bg-blue-800/50 text-white' : ''}`}
                        >
                          {c.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
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
                {user?.name || t('ผู้ใช้งาน', 'User')}
              </span>
              <span className="text-xs text-gray-300 whitespace-nowrap">
                {userRoles.map(r => (r === 'admin' ? t('ผู้ดูแลระบบ', 'Admin') : t('พนักงาน', 'Staff'))).join(', ')}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full flex items-center py-2.5 pr-4 text-white hover:bg-red-600 rounded-lg transition-colors"
          >
            <div className="w-16 flex items-center justify-center flex-shrink-0 text-white">
              {Icons.logout}
            </div>
            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>{t('ออกจากระบบ', 'Logout')}</span>
          </button>
        </div>
      </div>
    </>
  );
}
