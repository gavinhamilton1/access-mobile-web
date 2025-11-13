import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { SaltProvider, type Mode } from '@salt-ds/core';

import '@salt-ds/core/css/salt-core.css';
import '@salt-ds/theme/css/global.css';
import '@salt-ds/theme/css/theme.css';

type SaltThemeContextValue = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
};

const SALT_THEME_STORAGE_KEY = 'salt-theme-mode';

const SaltThemeContext = createContext<SaltThemeContextValue | undefined>(undefined);

export const useSaltTheme = (): SaltThemeContextValue => {
  const context = useContext(SaltThemeContext);
  if (!context) {
    throw new Error('useSaltTheme must be used within a SaltThemeProvider');
  }
  return context;
};

type SaltThemeProviderProps = {
  children: ReactNode;
};

export const SaltThemeProvider: React.FC<SaltThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<Mode>('dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedMode = window.localStorage.getItem(SALT_THEME_STORAGE_KEY) as Mode | null;
      if (storedMode === 'light' || storedMode === 'dark') {
        setMode(storedMode);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SALT_THEME_STORAGE_KEY, mode);
    }
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const contextValue = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode,
    }),
    [mode, toggleMode],
  );

  return (
    <SaltThemeContext.Provider value={contextValue}>
      <SaltProvider mode={mode} density="touch" applyClassesTo="root">
        {children}
      </SaltProvider>
    </SaltThemeContext.Provider>
  );
};

