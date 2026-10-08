"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Branch } from "@/types/shared";

/**
 * The branch switcher scopes data across screens, so it lives at the shell
 * level. The branch list is mocked here until the API exposes it.
 */
const MOCK_BRANCHES: Branch[] = [
  { id: "br_ph", name: "Port Harcourt" },
  { id: "br_lagos", name: "Lagos" },
  { id: "br_abuja", name: "Abuja" },
  { id: "br_kano", name: "Kano" },
];

interface BranchContextValue {
  branches: Branch[];
  activeBranch: Branch;
  setActiveBranchId: (id: string) => void;
}

const BranchContext = createContext<BranchContextValue | null>(null);

export function BranchProvider({ children }: { children: ReactNode }) {
  const [activeBranchId, setActiveBranchId] = useState(MOCK_BRANCHES[0].id);

  const value = useMemo<BranchContextValue>(() => {
    const activeBranch =
      MOCK_BRANCHES.find((branch) => branch.id === activeBranchId) ?? MOCK_BRANCHES[0];
    return { branches: MOCK_BRANCHES, activeBranch, setActiveBranchId };
  }, [activeBranchId]);

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
}

export function useBranch() {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error("useBranch must be used within a BranchProvider");
  }
  return context;
}
