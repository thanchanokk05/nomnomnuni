import React from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';

import { Image } from 'expo-image';

import { useMenu } from '@/context/menu';
import { useUser } from '@/context/user';
import { ChevronRight, HelpCircle, Lock, LogOut, Pencil, Shield, User } from 'lucide-react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { auth } from '@/firebase/config';
import { signOut } from 'firebase/auth';

const PRIMARY_GREEN = '#166534';

// Append a timestamp query so the Image component re-fetches even when the
// underlying URL string is unchanged (Storage URLs are stable per path).
function withCacheBust(url: string | null | undefined, token: number): string | null {
  if (!url) return null;
  return `${url}${url.includes('?') ? '&' : '?'}cb=${token}`;
}

export default function ProfileScreen() {
  const { user, clearUser } = useUser();
  const { clearMenus } = useMenu();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const avatarSize = Math.min(width * 0.28, 140);

  // Bump this on focus to force Image to refetch even if URL string is the same.
  const [cacheToken, setCacheToken] = React.useState(() => Date.now());

  // Single source of truth: read photoURL from context. Fall back to auth
  // only when context has nothing yet (first render before login propagates).
  const rawPhotoURL = user?.photoURL ?? auth.currentUser?.photoURL ?? null;
  const photoURL = withCacheBust(rawPhotoURL, cacheToken);

  // Force a fresh cache token every time the user navigates back here. This
  // guarantees a freshly-uploaded avatar shows up even if the URL is stable.
  useFocusEffect(
    React.useCallback(() => {
      setCacheToken(Date.now());
    }, [])
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* --- Header Section --- */}
        <View style={styles.headerSection}>
          <View style={styles.avatarWrapper}>
            <View
              style={[
                styles.avatarCircle,
                { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
              ]}
            >
              {photoURL ? (
                <Image
                  source={{ uri: photoURL }}
                  style={[styles.avatarImg, { borderRadius: avatarSize / 2 }]}
                  contentFit="cover"
                  cachePolicy="none"
                />
              ) : (
                <User size={avatarSize * 0.6} color="#CBD5E1" />
              )}
            </View>
            <TouchableOpacity
              style={styles.editBadge}
              accessibilityRole="button"
              onPress={() => router.push('/edit-profile' as any)}
            >
              <Pencil size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.name ?? 'Student User'}</Text>
          <Text style={styles.userEmail}>{user?.email ?? 'student@university.ac.th'}</Text>
        </View>

        {/* --- Menu List --- */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuHeader}>Account Settings</Text>
          <View style={styles.menuCard}>
            {/* Edit Profile */}
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/edit-profile' as any)}>
              <View style={styles.menuLeft}>
                <View style={styles.menuIconBox}>
                  <User size={22} color={PRIMARY_GREEN} />
                </View>
                <Text style={styles.menuLabel}>Edit Profile</Text>
              </View>
              <ChevronRight size={24} color="#CBD5E1" />
            </TouchableOpacity>

            {/* Change Password */}
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/change-password' as any)}>
              <View style={styles.menuLeft}>
                <View style={styles.menuIconBox}>
                  <Lock size={22} color={PRIMARY_GREEN} />
                </View>
                <Text style={styles.menuLabel}>Change Password</Text>
              </View>
              <ChevronRight size={24} color="#CBD5E1" />
            </TouchableOpacity>

          </View>
        </View>

        {/* --- Help & Support --- */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuHeader}>Help & Support</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/modal' as any)}
              accessibilityRole="button"
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconBox}>
                  <HelpCircle size={22} color={PRIMARY_GREEN} />
                </View>
                <Text style={styles.menuLabel}>Help & Support</Text>
              </View>
              <ChevronRight size={24} color="#CBD5E1" />
            </TouchableOpacity>

            {/* PDPA / Privacy Policy */}
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomWidth: 0 }]}
              onPress={() => Linking.openURL('https://pdpa.pro/policies/view/en/jZDkeAZcC9c1bKvjy2zPUY6U')}
              accessibilityRole="button"
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconBox}>
                  <Shield size={22} color={PRIMARY_GREEN} />
                </View>
                <Text style={styles.menuLabel}>Privacy Policy (PDPA)</Text>
              </View>
              <ChevronRight size={24} color="#CBD5E1" />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Logout Section (separate) --- */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            (async () => {
              try {
                await signOut(auth);
              } finally {
                clearMenus();
                clearUser?.();
                router.replace('/login');
              }
            })();
          }}
        >
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarCircle: {
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 8 },
    }),
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: PRIMARY_GREEN,
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#F8FAFC',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  menuContainer: {
    marginBottom: 30,
  },
  menuHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  menuSubLabel: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  dangerIconBox: {
    backgroundColor: '#FEF2F2',
  },
  dangerText: {
    color: '#B91C1C',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutBtnText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 16,
  },
});
