import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';

import Toast from '@/components/toast';
import { FavoritesProvider } from '@/context/favorites';
import { ReviewProvider } from '@/context/ReviewContext';
import { UserProvider } from '@/context/user';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: 'login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Navigation should not be triggered here; Stack renders the screens and
  // unstable_settings.anchor is used to pick the initial route.

  return (
    <FavoritesProvider>
      <ReviewProvider>
        <UserProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: '#FFFFFF' },
                headerTintColor: '#14532D',
                headerTitleStyle: { fontWeight: '700', color: '#14532D' },
                animation: 'slide_from_right',
              }}>
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="food/[id]"
                options={({ route }) => ({ title: (route?.params as any)?.name ?? 'Food Detail' })}
              />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <Toast />
            <StatusBar style="auto" />
          </ThemeProvider>
        </UserProvider>
      </ReviewProvider>
    </FavoritesProvider>
  );
}
