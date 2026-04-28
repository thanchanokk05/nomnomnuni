import { Heart } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FoodCard from '@/components/food-card';
import { ThemedView } from '@/components/themed-view';
import { useFavorites } from '@/context/favorites';
import { useMenu } from '@/context/menu';

export default function FavoriteScreen() {
  const { favorites } = useFavorites();
  const { menus } = useMenu();

  // กรองเฉพาะ menus ที่อยู่ใน favorites (ใช้ string ID ตรงกัน)
  const items = menus.filter((m) => favorites.includes(m.id));

  // ส่วนแสดงผลเมื่อไม่มีข้อมูล (Empty State)
  const renderEmptyContainer = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.iconCircle}>
        <Heart size={64} color="#CBD5E1" />
      </View>
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptySubtitle}>
        Explore the menu and tap the heart icon to save your favorite dishes here.
      </Text>
    </View>
  );

  return (
    <ThemedView style={styles.mainContainer}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Favorites</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{items.length} Items</Text>
          </View>
        </View>

        <FlatList
          data={items}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <FoodCard item={item} />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyContainer}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC', // ใช้สีเดียวกับหน้า Food Detail
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  countBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  countText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    flexGrow: 1, // สำคัญ: เพื่อให้ ListEmptyComponent อยู่กลางจอ
  },
  cardWrapper: {
    marginBottom: 16, // เพิ่มระยะห่างระหว่างการ์ด
  },
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});