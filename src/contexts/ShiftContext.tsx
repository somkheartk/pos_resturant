'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Shift {
  userId: string;
  userName: string;
  openedAt: string;
  startingCash: number;
  sales: number;
  branchId?: string;
}

interface ShiftContextType {
  currentShift: Shift | null;
  isShiftOpen: boolean;
  openShift: (startingCash: number, userName: string, userId: string, branchId?: string) => void;
  closeShift: (endingCash: number) => { difference: number; expected: number; actual: number };
  addSale: (amount: number) => void;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

const STORAGE_KEY = 'pos.currentShift';

export function ShiftProvider({ children }: { children: ReactNode }) {
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCurrentShift(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (currentShift) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentShift));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }, [currentShift]);

  const openShift = (startingCash: number, userName: string, userId: string, branchId?: string) => {
    setCurrentShift({
      userId,
      userName,
      openedAt: new Date().toISOString(),
      startingCash,
      sales: 0,
      branchId,
    });
  };

  const closeShift = (endingCash: number) => {
    const expected = (currentShift?.startingCash || 0) + (currentShift?.sales || 0);
    const difference = endingCash - expected;
    // TODO: Save to history/backend
    setCurrentShift(null);
    return { difference, expected, actual: endingCash };
  };

  const addSale = (amount: number) => {
    if (currentShift) {
      setCurrentShift({ ...currentShift, sales: currentShift.sales + amount });
    }
  };

  return (
    <ShiftContext.Provider
      value={{
        currentShift,
        isShiftOpen: !!currentShift,
        openShift,
        closeShift,
        addSale,
      }}
    >
      {children}
    </ShiftContext.Provider>
  );
}

export function useShift() {
  const ctx = useContext(ShiftContext);
  if (!ctx) throw new Error('useShift must be used within ShiftProvider');
  return ctx;
}
