'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

interface MotionContextValue {
  /** True when the system asks for reduced motion or the visitor switched it off. */
  reduced: boolean;
  /** False until the stored choice and system preference have been read. */
  ready: boolean;
  toggle: () => void;
}

const MotionContext = createContext<MotionContextValue>({ reduced: false, ready: false, toggle: () => {} });

export function useMotion() {
  return useContext(MotionContext);
}

const STORAGE_KEY = 'nexora-motion';

function readStored(): 'off' | 'on' | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'off' || value === 'on' ? value : null;
  } catch {
    return null;
  }
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const [systemReduced, setSystemReduced] = useState(false);
  const [choice, setChoice] = useState<'off' | 'on' | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setSystemReduced(query.matches);
    sync();
    setChoice(readStored());
    setReady(true);
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const reduced = choice ? choice === 'off' : systemReduced;

  useEffect(() => {
    document.documentElement.classList.toggle('motion-off', reduced);
  }, [reduced]);

  const toggle = useCallback(() => {
    const next = reduced ? 'on' : 'off';
    setChoice(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode: the choice lasts for this page view */
    }
  }, [reduced]);

  return <MotionContext.Provider value={{ reduced, ready, toggle }}>{children}</MotionContext.Provider>;
}
