import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { SidepanelController } from './useSidepanelController';
import { useSidepanelController } from './useSidepanelController';

const SidepanelContext = createContext<SidepanelController | null>(null);

export function SidepanelProvider({ children }: { children: ReactNode }) {
  const controller = useSidepanelController();
  return <SidepanelContext.Provider value={controller}>{children}</SidepanelContext.Provider>;
}

export function useSidepanel() {
  const ctx = useContext(SidepanelContext);
  if (!ctx) {
    throw new Error('useSidepanel must be used within SidepanelProvider');
  }
  return ctx;
}
