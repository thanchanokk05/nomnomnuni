import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  // เช็คว่าเป็นโหมดมืดหรือไม่
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        // ปรับสีปุ่มที่เลือก: โหมดมืดอาจใช้สีเขียวที่สว่างขึ้นนิดนึงเพื่อให้เห็นชัด
        tabBarActiveTintColor: isDark ? '#4ADE80' : '#166534', 
        tabBarInactiveTintColor: isDark ? '#64748B' : '#94A3B8',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 30 : 12,
          paddingTop: 8,
          // เปลี่ยนสีพื้นหลังตามโหมด
          backgroundColor: isDark ? '#3b3a3aff' : '#FFFFFF',
          // เปลี่ยนสีเส้นขอบด้านบน
          borderTopWidth: 1,
          borderTopColor: isDark ? '#1E293B' : '#F1F5F9',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: 'Favorite',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="heart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}