import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: 'light' | 'dark';
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  mode: 'system',
  setMode: () => {},
});

const STORAGE_KEY = '@nomnomuni_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme() ?? 'light';
  const [mode, setModeState] = useState<ThemeMode>('system');

  // Load saved preference on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v === 'light' || v === 'dark' || v === 'system') {
        setModeState(v);
      }
    });
  }, []);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    AsyncStorage.setItem(STORAGE_KEY, m);
  };

  const theme: 'light' | 'dark' =
    mode === 'system' ? systemScheme : mode;

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
