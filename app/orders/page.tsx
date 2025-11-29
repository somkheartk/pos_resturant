"use client";
import OrdersPage from '@/components/OrdersPage';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import LoginPage from '@/components/LoginPage';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';

export default function OrdersRoute() {
  const { isAuthenticated } = useAuth();
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
          <OrdersPage />
        </main>
      </div>
    </div>
  );
}
