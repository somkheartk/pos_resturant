'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

const STORAGE_KEY = 'pos.branches.v1';

export interface Branch {
  id: string;
  name: string;
}

interface BranchContextType {
  branches: Branch[];
  currentBranchId: string;
  setCurrentBranchId: (id: string) => void;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export function BranchProvider({ children }: { children: ReactNode }) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranchId, setCurrentBranchId] = useState<string>('');

  useEffect(() => {
    const storedBranches = localStorage.getItem(STORAGE_KEY);
    if (storedBranches) {
      setBranches(JSON.parse(storedBranches));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(branches));
  }, [branches]);

  const value = useMemo(() => ({ branches, currentBranchId, setCurrentBranchId }), [branches, currentBranchId]);

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
}

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
};
