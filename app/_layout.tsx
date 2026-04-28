import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import Toast from '@/components/toast';
import { FavoritesProvider } from '@/context/favorites';
import { MenuProvider } from '@/context/menu';
import { ReviewProvider } from '@/context/ReviewContext';
import { ThemeModeProvider, useThemeMode } from '@/context/theme';
import { UserProvider } from '@/context/user';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Keep splash screen visible while we load icon fonts (prevents "square" icons on web)
void SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: 'login',
};

function AppRoot() {
  const colorScheme = useColorScheme();
  const { resolvedScheme } = useThemeMode();
  const scheme = resolvedScheme ?? (colorScheme === 'dark' ? 'dark' : 'light');

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#166534',
          headerTitleStyle: { fontWeight: '800', color: '#166534', fontSize: 18 },
          animation: 'slide_from_right',
        }}>
        {/* หน้า Login ไม่ต้องมี Header */}
        <Stack.Screen name="login" options={{ headerShown: false }} />

        {/* หน้าหลักที่มี Tab Bar ด้านล่าง */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* หน้ารายละเอียดอาหาร */}
        <Stack.Screen
          name="food/[id]"
          options={({ route }) => ({
            title: (route?.params as any)?.name ?? 'Food Detail',
            headerShown: false,
          })}
        />

        {/* หน้าเพิ่มอาหาร (เปิดแบบ Modal เลื่อนจากข้างล่าง) */}
        <Stack.Screen
          name="add-food"
          options={{
            presentation: 'modal',
            title: 'Share New Menu',
            headerShown: false,
          }}
        />

        {/* หน้า Modal อื่นๆ */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Info' }} />
      </Stack>
      <Toast />
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
   // Ensure icon fonts are loaded on web builds (e.g. Firebase Hosting)
   const [fontsLoaded] = useFonts({
     ...MaterialIcons.font,
     ...Ionicons.font,
     ...MaterialCommunityIcons.font,
   });

   React.useEffect(() => {
     if (fontsLoaded) void SplashScreen.hideAsync();
   }, [fontsLoaded]);

   if (!fontsLoaded) return null;

   return (
     <GestureHandlerRootView style={{ flex: 1 }}>
       <FavoritesProvider>
         <MenuProvider>
           <ReviewProvider>
             <UserProvider>
              <ThemeModeProvider>
                <AppRoot />
              </ThemeModeProvider>
             </UserProvider>
           </ReviewProvider>
         </MenuProvider>
       </FavoritesProvider>
     </GestureHandlerRootView>
   );
 }