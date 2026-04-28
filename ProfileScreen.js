// Required install:
// npx expo install expo-image-picker

import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const PLACEHOLDER_AVATAR =
  'https://ui-avatars.com/api/?name=tt&background=E5E7EB&color=6B7280&size=256';

const COLORS = {
  background: '#F5F6F8',
  cardDark: '#1F2937',
  cardDarkBorder: '#111827',
  divider: 'rgba(255,255,255,0.06)',
  textPrimary: '#0F172A',
  textMuted: '#6B7280',
  textOnDark: '#F9FAFB',
  textOnDarkMuted: '#9CA3AF',
  green: '#22C55E',
  greenDark: '#16A34A',
  iconBubble: '#374151',
};

export default function ProfileScreen() {
  const [avatarUri, setAvatarUri] = useState(PLACEHOLDER_AVATAR);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission required',
        'We need access to your photos to change your profile picture.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            <TouchableOpacity
              style={styles.editBadge}
              onPress={handlePickImage}
              activeOpacity={0.85}
              accessibilityLabel="Change profile picture"
            >
              <Feather name="edit-2" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>tt</Text>
          <Text style={styles.email}>test@test.com</Text>
        </View>

        {/* Account Settings card */}
        <Text style={styles.sectionTitle}>Account Settings</Text>

        <View style={styles.card}>
          <MenuRow
            icon={<Feather name="user" size={18} color={COLORS.textOnDark} />}
            label="Edit Profile"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <MenuRow
            icon={<Feather name="lock" size={18} color={COLORS.textOnDark} />}
            label="Change Password"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <MenuRow
            icon={<Feather name="sun" size={18} color={COLORS.textOnDark} />}
            label="Theme Mode"
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuRow({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.rowIconBubble}>{icon}</View>
      <Text style={styles.rowLabel}>{label}</Text>
      <FontAwesome5 name="chevron-right" size={12} color={COLORS.textOnDarkMuted} />
    </TouchableOpacity>
  );
}

const AVATAR_SIZE = 120;
const BADGE_SIZE = 34;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  profileSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  avatarWrapper: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    marginBottom: 16,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#E5E7EB',
  },
  editBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.background,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: COLORS.textMuted,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 12,
    marginLeft: 4,
  },

  card: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  rowIconBubble: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.iconBubble,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textOnDark,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.divider,
    marginLeft: 60,
  },
});
