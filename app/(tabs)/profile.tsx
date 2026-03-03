import React from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const PRIMARY = '#f39931';
const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const stats = [
    { id: 'fav', label: 'Favorites', value: 12, emoji: '❤️' },
    { id: 'orders', label: 'Orders', value: 5, emoji: '🍔' },
    { id: 'reviews', label: 'Reviews', value: 4, emoji: '⭐' },
  ];

  const menu = [
    'My Favorites',
    'Order History',
    'Notifications',
    'Settings',
    'Help & Support',
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <View style={styles.headerCard}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/300?img=12' }}
              style={styles.avatar}
            />
            <Text style={styles.name}>Khung Khing</Text>
            <Text style={styles.email}>khungkhing@email.com</Text>

            <TouchableOpacity style={styles.editButton} accessibilityRole="button">
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsCard}>
            {stats.map((s) => (
              <View key={s.id} style={styles.statItem}>
                <Text style={styles.statEmoji}>{s.emoji}</Text>
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
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity style={styles.logoutButton} accessibilityRole="button">
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
    backgroundColor: '#F7F7F7',
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
  editButton: {
    marginTop: 16,
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 50,
    alignItems: 'center',
    width: '100%',
  },
  editText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
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
  statEmoji: {
    fontSize: 22,
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
    backgroundColor: '#D32F2F',
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