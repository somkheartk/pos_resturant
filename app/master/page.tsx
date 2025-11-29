"use client";
import MasterMenuPage from '@/components/MasterMenuPage';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import LoginPage from '@/components/LoginPage';
import { useAuth } from '@/contexts/AuthContext';

export default function MasterMenuRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Header />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pt-[73px] transition-all duration-300 pl-16 lg:pl-64">
        <main className="flex-1 overflow-auto">
          <MasterMenuPage />
        </main>
      </div>
    </div>
  );
}
