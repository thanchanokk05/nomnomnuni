import React from 'react';
import {
    Alert,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { Camera, ChevronLeft, User } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { updateProfile } from 'firebase/auth';

import { useUser } from '@/context/user';
import { auth } from '@/firebase/config';

const PRIMARY_GREEN = '#166534';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const current = auth.currentUser;

  // Single source of truth for the avatar preview = context first, auth fallback.
  const initialPhoto = user?.photoURL ?? current?.photoURL ?? null;

  const [displayName, setDisplayName] = React.useState(
    user?.name ?? current?.displayName ?? ''
  );
  const [photoUri, setPhotoUri] = React.useState<string | null>(initialPhoto);
  const [saving, setSaving] = React.useState(false);

  async function onPickPhoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission required', 'Please allow photo library access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.3,
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
    });

    if (result.canceled) return;

    const asset = result.assets?.[0];
    if (!asset) return;

    // แปลงเป็น data URI — ใช้ได้ทุก device โดยไม่ต้องใช้ Storage
    const dataUri = asset.base64
      ? `data:image/jpeg;base64,${asset.base64}`
      : asset.uri;

    setPhotoUri(dataUri);
    setUser({
      name: user?.name ?? current?.displayName ?? '',
      email: user?.email ?? current?.email ?? '',
      photoURL: dataUri,
    });
  }

  async function onSave() {
    const nextName = displayName.trim();
    if (!nextName) {
      Alert.alert('Missing', 'Display Name is required.');
      return;
    }
    if (!auth.currentUser) {
      Alert.alert('Not signed in', 'Please sign in again.');
      return;
    }
    if (saving) return;

    setSaving(true);
    try {
      // บันทึกแค่ displayName ไปที่ Firebase Auth
      // photoURL เก็บใน context เท่านั้น (base64 ยาวเกิน Firebase Auth limit)
      await updateProfile(auth.currentUser, { displayName: nextName });

      setUser({
        name: nextName,
        email: auth.currentUser.email ?? user?.email ?? '',
        photoURL: photoUri ?? null,
      });

      setSaving(false);
      router.replace('/(tabs)/profile' as any);
    } catch (e: any) {
      console.error('[edit-profile] onSave failed:', e);
      Alert.alert('Error', `Failed to update profile: ${e?.message ?? 'Please try again.'}`);
    } finally {
      setSaving(false);
    }
  }

  const previewUri = photoUri || undefined;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/profile' as any)} style={styles.backBtn} accessibilityRole="button">
            <ChevronLeft size={22} color={PRIMARY_GREEN} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.card}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCircle}>
              {previewUri ? (
                <Image source={{ uri: previewUri }} style={styles.avatarImg} />
              ) : (
                <User size={56} color="#CBD5E1" />
              )}
            </View>

            <TouchableOpacity onPress={onPickPhoto} style={styles.photoBtn} accessibilityRole="button">
              <Camera size={18} color="#fff" />
              <Text style={styles.photoBtnText}>Change photo</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Display Name</Text>
          <View style={styles.inputRow}>
            <User size={18} color="#64748B" style={{ marginRight: 10 }} />
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your name"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, saving && styles.btnDisabled]}
            onPress={onSave}
            disabled={saving}
            accessibilityRole="button"
          >
            <Text style={styles.primaryBtnText}>{saving ? 'Saving...' : 'Save changes'}</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  header: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  avatarWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: PRIMARY_GREEN,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  photoBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  label: {
    marginTop: 10,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    marginBottom: 14,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
  },
  primaryBtn: {
    backgroundColor: PRIMARY_GREEN,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '800',
  },
  btnDisabled: { opacity: 0.7 },
  note: {
    marginTop: 12,
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    textAlign: 'center',
  },
});
