import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemeContextType = {
  themeMode: ThemeMode;
  setThemeMode: (m: ThemeMode) => void;
  /** Resolved scheme after applying ThemeMode override. */
  resolvedScheme: 'light' | 'dark';
};

const STORAGE_KEY = 'settings.themeMode';

const ThemeModeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useRNColorScheme() ?? 'light';
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw === 'system' || raw === 'light' || raw === 'dark') setThemeModeState(raw);
    })();
  }, []);

  async function setThemeMode(m: ThemeMode) {
    setThemeModeState(m);
    await AsyncStorage.setItem(STORAGE_KEY, m);
  }

  const resolvedScheme: 'light' | 'dark' = useMemo(() => {
    if (themeMode === 'system') return systemScheme === 'dark' ? 'dark' : 'light';
    return themeMode;
  }, [systemScheme, themeMode]);

  const value = useMemo(() => ({ themeMode, setThemeMode, resolvedScheme }), [themeMode, resolvedScheme]);

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return ctx;
}
