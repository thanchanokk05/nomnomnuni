import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import Toast from '@/components/toast';
import { FavoritesProvider } from '@/context/favorites';
import { MenuProvider } from '@/context/menu';
import { ReviewProvider } from '@/context/ReviewContext';
import { UserProvider } from '@/context/user';

void SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: 'index',
};

function AppRoot() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#166534',
          headerTitleStyle: { fontWeight: '800', color: '#166534', fontSize: 18 },
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="food/[id]"
          options={({ route }) => ({
            title: (route?.params as any)?.name ?? 'Food Detail',
            headerShown: false,
          })}
        />
        <Stack.Screen name="add-food" options={{ presentation: 'modal', title: 'Share New Menu', headerShown: false }} />
        <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
        <Stack.Screen name="change-password" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Info' }} />
      </Stack>
      <Toast />
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  React.useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <FavoritesProvider>
          <MenuProvider>
            <ReviewProvider>
              <UserProvider>
                <AppRoot />
              </UserProvider>
            </ReviewProvider>
          </MenuProvider>
        </FavoritesProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
