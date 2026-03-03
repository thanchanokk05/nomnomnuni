import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import Toast from '@/components/toast';
import { FavoritesProvider } from '@/context/favorites';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <FavoritesProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#F39931' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '700' },
            animation: 'slide_from_right',
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="food/[id]"
            options={({ route }) => ({ title: (route?.params as any)?.name ?? 'Food Detail' })}
          />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <Toast />
        <StatusBar style="auto" />
      </ThemeProvider>
    </FavoritesProvider>
  );
}
