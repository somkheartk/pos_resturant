'use client';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/components/LoginPage';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Header />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pt-[73px] transition-all duration-300">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
