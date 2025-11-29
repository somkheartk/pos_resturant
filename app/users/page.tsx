"use client";
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import LoginPage from '@/components/LoginPage';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { useMemo, useState } from 'react';
import { permissionGroups, roles } from '@/config/permissions';

export default function UsersRoute() {
  const { isAuthenticated, user } = useAuth();
  const { getUserPermissions, setPermission, getUserRoles, toggleUserRole, getRolePermissions, setRolePermission } = usePermissions();
  const { t } = useLanguage();
  const { isOpen } = useSidebar();

  // Mock users in system
  const users = useMemo(() => ([
    { id: '1', name: t('ผู้ดูแลระบบ', 'Admin'), email: 'admin@pos.com', role: 'admin' as const },
    { id: '2', name: t('พนักงาน', 'Staff'), email: 'staff@pos.com', role: 'staff' as const },
  ]), [t]);

  const [query, setQuery] = useState('');
  const filteredUsers = users.filter(u =>
    [u.name, u.email, u.role].join(' ').toLowerCase().includes(query.toLowerCase())
  );

  // All permission groups and items from config (new style)
  const allGroups = permissionGroups.map(g => ({
    key: g.key,
    label: t(g.labelTh, g.labelEn),
    items: g.items.map(it => ({ key: it.key, label: t(it.labelTh, it.labelEn) })),
  }));

  // Accordion open state per user for advanced section
  const [openAdv, setOpenAdv] = useState<Record<string, boolean>>({});
  const [openRole, setOpenRole] = useState<Record<string, boolean>>({});

  // Early returns AFTER all hooks to keep hook order stable
  if (!isAuthenticated) return <LoginPage />;
  if (user?.role !== 'admin') return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Header />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pt-[73px] transition-all duration-300 relative" style={{ marginLeft: isOpen ? '256px' : '64px', marginRight: '384px' }}>
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="text-red-500 font-semibold">{t('ไม่มีสิทธิ์เข้าถึงหน้านี้', 'Not authorized')}</div>
          </div>
        </main>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Header />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pt-[73px] transition-all duration-300 relative" style={{ marginLeft: isOpen ? '256px' : '64px', marginRight: '384px' }}>
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-blue-900 drop-shadow-sm">{t('ผู้ใช้งานและสิทธิ์', 'Users & Permissions')}</h1>
              <p className="text-gray-700 mt-1">{t('กำหนดสิทธิ์การเข้าถึงเมนูสำหรับผู้ใช้งานแต่ละคน', 'Set menu access rights per user')}</p>
            </div>

            {/* Role-level permissions editor */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden mb-6">
              <div className="px-4 lg:px-6 py-3 bg-blue-50/50 border-b">
                <div className="text-sm text-blue-900 font-medium">{t('สิทธิ์ตามบทบาท', 'Role permissions')}</div>
              </div>
              <div className="p-4 lg:p-6 space-y-3">
                {roles.map((r) => {
                  const rp = getRolePermissions(r.key as any);
                  const open = !!openRole[r.key];
                  return (
                    <div key={`role-${r.key}`} className="bg-white border border-gray-100 rounded-xl shadow-sm">
                      <button
                        onClick={() => setOpenRole(prev => ({ ...prev, [r.key]: !prev[r.key] }))}
                        className="w-full flex items-center justify-between px-4 lg:px-6 py-3 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-900">{t(r.labelTh, r.labelEn)}</span>
                          <span className="text-xs text-gray-500">{t('ตั้งค่าสิทธิ์ตามบทบาทนี้', 'Configure permissions for this role')}</span>
                        </div>
                        <span className="text-gray-400">{open ? '−' : '+'}</span>
                      </button>
                      {open && (
                        <div className="px-4 lg:px-6 pb-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {permissionGroups.map((g) => (
                              <div key={g.key} className="border border-gray-100 rounded-lg">
                                <div className="px-3 py-2 bg-blue-50/60 text-blue-900 text-sm font-semibold rounded-t-lg flex items-center justify-between">
                                  <span>{t(g.labelTh, g.labelEn)}</span>
                                  <div className="space-x-2">
                                    <button
                                      onClick={() => g.items.forEach(it => setRolePermission(r.key as any, it.key, true))}
                                      className="text-xs px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white"
                                    >{t('เปิดทั้งหมด', 'Enable')}</button>
                                    <button
                                      onClick={() => g.items.forEach(it => setRolePermission(r.key as any, it.key, false))}
                                      className="text-xs px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                                    >{t('ปิดทั้งหมด', 'Disable')}</button>
                                  </div>
                                </div>
                                <div className="p-3 grid grid-cols-1 gap-2">
                                  {g.items.map((it) => {
                                    const on = !!rp[it.key];
                                    return (
                                      <div key={it.key} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-800">{t(it.labelTh, it.labelEn)}</span>
                                        <button
                                          aria-pressed={on}
                                          onClick={() => setRolePermission(r.key as any, it.key, !on)}
                                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${on ? 'bg-orange-500 focus:ring-orange-400' : 'bg-gray-300 focus:ring-gray-300'}`}
                                        >
                                          <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${on ? 'translate-x-5' : 'translate-x-1'}`} />
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-4 lg:px-6 py-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>🔒</span>
                  <span>{t('ปรับสิทธิ์ผู้ใช้งานได้แบบเรียลไทม์', 'Adjust user permissions in real-time')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                    <span className="text-gray-400 mr-2">🔍</span>
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t('ค้นหาผู้ใช้ ชื่อ/อีเมล...', 'Search users name/email...')}
                      className="bg-transparent outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="px-4 lg:px-6 py-3 bg-blue-50/50 border-b">
                <div className="text-sm text-blue-900 font-medium">{t('กำหนดสิทธิ์รายผู้ใช้ (Override)', 'Per-user permissions (Override)')}</div>
              </div>
              <div className="p-4 lg:p-6 space-y-3">
                {filteredUsers.map((u) => {
                  const assignedRoles = getUserRoles(u.id, [u.role as any]);
                  const perms = getUserPermissions(u.id, assignedRoles[0]);
                  const open = !!openAdv[u.id];
                  const allKeys = permissionGroups.flatMap(g => g.items.map(it => it.key));
                  return (
                    <div key={`user-${u.id}`} className="bg-white border border-gray-100 rounded-xl shadow-sm">
                      <div className="w-full flex items-center justify-between px-3 lg:px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-semibold text-gray-900">{u.name}</div>
                            <div className="text-xs text-gray-500">{u.email}</div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {roles.map((r) => {
                              const on = assignedRoles.includes(r.key as any);
                              return (
                                <button
                                  key={`r-${u.id}-${r.key}`}
                                  onClick={() => toggleUserRole(u.id, r.key as any)}
                                  className={`text-xs px-2 py-0.5 rounded-full border ${on ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}
                                >
                                  {t(r.labelTh, r.labelEn)}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => allKeys.forEach(k => setPermission(u.id, k, true))}
                            className="text-xs px-2 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                          >{t('เปิดทั้งหมด', 'Enable all')}</button>
                          <button
                            onClick={() => allKeys.forEach(k => setPermission(u.id, k, false))}
                            className="text-xs px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
                          >{t('ปิดทั้งหมด', 'Disable all')}</button>
                          <button
                            onClick={() => setOpenAdv(prev => ({ ...prev, [u.id]: !prev[u.id] }))}
                            className="ml-2 text-sm text-blue-700 hover:text-blue-900"
                          >{open ? t('ย่อ', 'Collapse') : t('ขยาย', 'Expand')}</button>
                        </div>
                      </div>
                      {open && (
                        <div className="px-4 lg:px-6 pb-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {allGroups.map((g) => (
                              <div key={g.key} className="border border-gray-100 rounded-lg">
                                <div className="px-3 py-2 bg-blue-50/60 text-blue-900 text-sm font-semibold rounded-t-lg flex items-center justify-between">
                                  <span>{g.label}</span>
                                  <div className="space-x-2">
                                    <button
                                      onClick={() => g.items.forEach(it => setPermission(u.id, it.key, true))}
                                      className="text-xs px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white"
                                    >{t('เปิดทั้งหมด', 'Enable')}</button>
                                    <button
                                      onClick={() => g.items.forEach(it => setPermission(u.id, it.key, false))}
                                      className="text-xs px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                                    >{t('ปิดทั้งหมด', 'Disable')}</button>
                                  </div>
                                </div>
                                <div className="p-3 grid grid-cols-1 gap-2">
                                  {g.items.map((it) => {
                                    const on = !!perms[it.key];
                                    return (
                                      <div key={it.key} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-800">{it.label}</span>
                                        <button
                                          aria-pressed={on}
                                          onClick={() => setPermission(u.id, it.key, !on)}
                                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${on ? 'bg-orange-500 focus:ring-orange-400' : 'bg-gray-300 focus:ring-gray-300'}`}
                                        >
                                          <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${on ? 'translate-x-5' : 'translate-x-1'}`} />
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">{t('การเปลี่ยนแปลงจะถูกบันทึกในเบราว์เซอร์ (localStorage)', 'Changes are saved in your browser (localStorage)')}</p>
          </div>
        </main>
      </div>
    </div>
  );
}
