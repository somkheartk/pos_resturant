'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export interface Branch {
  id: string;
  name: string;
  taxId?: string;
  address1?: string;
}

interface BranchContextType {
  branches: Branch[];
  currentBranchId: string;
  currentBranch: Branch;
  setCurrentBranch: (branchId: string) => void;
}

const STORAGE_KEY = 'pos.branch.current';

const BranchContext = createContext<BranchContextType | undefined>(undefined);

const defaultBranches: Branch[] = [
  { id: 'main', name: 'สาขาหลัก', taxId: '0105551234567' },
  { id: 'bkk-2', name: 'สาขากรุงเทพ 2' },
];

export function BranchProvider({ children }: { children: ReactNode }) {
  const [branches] = useState<Branch[]>(defaultBranches);
  const [currentBranchId, setCurrentBranchId] = useState<string>('main');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCurrentBranchId(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, currentBranchId); } catch {}
  }, [currentBranchId]);

  const currentBranch = useMemo(
    () => branches.find(b => b.id === currentBranchId) || branches[0],
    [branches, currentBranchId]
  );

  const setCurrentBranch = (branchId: string) => setCurrentBranchId(branchId);

  const value = useMemo(() => ({ branches, currentBranchId, currentBranch, setCurrentBranch }), [branches, currentBranchId, currentBranch]);

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
}

export function useBranch() {
  const ctx = useContext(BranchContext);
  if (!ctx) throw new Error('useBranch must be used within BranchProvider');
  return ctx;
}
