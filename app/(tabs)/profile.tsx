import React from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useFavorites } from '@/context/favorites';
import { useUser } from '@/context/user';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PRIMARY = '#86EFAC';
const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, clearUser } = useUser();
  const { favorites } = useFavorites();
  const router = useRouter();

  const stats = [
    { id: 'fav', label: 'Favorites', value: favorites.length },
    { id: 'reviews', label: 'Reviews', value: 4 },
  ];

  const menu = [
    'My Favorites',
    'Notifications',
    'Settings',
    'Help & Support',
  ];

  const avatarSize = Math.min(140, width * 0.35);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <View style={styles.headerCard}>
            <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="person-circle" size={avatarSize} color="#DDD" />
            </View>
            <Text style={styles.name}>{user?.name ?? 'Guest'}</Text>
            <Text style={styles.email}>{user?.email ?? 'guest@email.com'}</Text>
          </View>

          <View style={styles.statsCard}>
            {stats.map((s) => (
              <View key={s.id} style={styles.statItem}>
                <View style={styles.iconWrap}>
                  {s.id === 'fav' && <Ionicons name="heart" size={22} color={PRIMARY} />}
                  {s.id === 'reviews' && <FontAwesome name="star" size={20} color={PRIMARY} />}
                </View>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuCard}>
            {menu.map((m) => (
              <TouchableOpacity key={m} style={styles.menuItem} accessibilityRole="button">
                <Text style={styles.menuText}>{m}</Text>
                <Ionicons name="chevron-forward" size={18} color="#BBB" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity
            style={styles.logoutButton}
            accessibilityRole="button"
            onPress={() => {
              clearUser();
              router.replace('/login');
            }}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_RADIUS = 20;
const GAP = 16;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  scroll: {
    padding: GAP,
    paddingBottom: 32,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  top: {
    marginBottom: 12,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    marginBottom: 16,
  },
  avatar: {
    width: Math.min(140, width * 0.35),
    height: Math.min(140, width * 0.35),
    borderRadius: Math.min(140, width * 0.35) / 2,
    backgroundColor: '#EEE',
    marginBottom: 14,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D2D2D',
  },
  email: {
    marginTop: 6,
    fontSize: 14,
    color: '#666',
  },

  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  iconWrap: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2D2D2D',
  },
  statLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#777',
  },

  menuSection: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: 10,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomColor: '#F0F0F0',
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 15,
    color: '#2D2D2D',
    fontWeight: '600',
  },
  chevron: {
    fontSize: 20,
    color: '#BBB',
  },

  bottom: {
    marginTop: 18,
  },
  logoutButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});