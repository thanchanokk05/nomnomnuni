import HoursRangeField from '@/components/hours-range-field';
import { useFavorites } from '@/context/favorites';
import { useMenu } from '@/context/menu';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

function googleMapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const DAY_LABELS_TH: Record<(typeof DAYS)[number], string> = {
  Mon: 'Mon', Tue: 'Tue', Wed: 'Wed', Thu: 'Thu', Fri: 'Fri', Sat: 'Sat', Sun: 'Sun',
};
type DayAbbrev = (typeof DAYS)[number];

export default function AddFoodScreen() {
  const router = useRouter();
  const { addMenu } = useMenu();
  const { showToast } = useFavorites();

  const scheme = useColorScheme() ?? 'light';
  const isDark = scheme === 'dark';
  const t = Colors[scheme];

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [shop, setShop] = useState('');

  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');

  const [location, setLocation] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [operatingDays, setOperatingDays] = useState<DayAbbrev[]>([]);

  const [saving, setSaving] = useState(false);

  const openHours = useMemo(() => {
    if (!openTime || !closeTime) return '';
    return `${openTime} - ${closeTime}`;
  }, [openTime, closeTime]);

  const toggleDay = (d: DayAbbrev) => {
    setOperatingDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const handleSave = async () => {
    console.log('[add-food] handleSave: pressed');

    if (saving) {
      console.log('[add-food] handleSave: already saving, ignoring duplicate tap');
      return;
    }
    if (!name || !price || !shop) {
      Alert.alert('Incomplete information', 'Please fill in menu name, price, and shop name.');
      return;
    }
    const num = Number(price);
    if (Number.isNaN(num) || num < 0) {
      Alert.alert('Invalid price', 'Please enter a non-negative number for price.');
      return;
    }

    setSaving(true);
    try {
      console.log('[add-food] handleSave: calling addMenu');
      // addMenu strips undefined values and races against a 15s timeout.
      // See context/menu.tsx for the implementation.
      await addMenu({
        name: name.trim(),
        price: num,
        shopName: shop.trim(),
        openHours: openHours.trim() || undefined,
        operatingDays: operatingDays.length ? operatingDays : undefined,
        location: location.trim() || undefined,
        imageUri,
        createdBy: undefined,
      });
      console.log('[add-food] handleSave: addMenu resolved');

      showToast('Menu added successfully 🎉', 2200);
      router.replace('/(tabs)');
      return;
    } catch (e: any) {
      console.error('[add-food] handleSave failed:', e);
      Alert.alert('Error', `Could not save menu: ${e?.message ?? 'Please try again.'}`);
    } finally {
      setSaving(false);
    }
  };

  async function onPickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to the photo library to select a menu image');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    const uri = (result as any).assets?.[0]?.uri;
    if (uri) setImageUri(uri);
  }

  const openInMaps = async () => {
    const query = location.trim();
    if (!query) return;
    const url = googleMapsSearchUrl(shop.trim() ? `${shop.trim()} ${query}` : query);
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Error', 'Cannot open Google Maps.');
    }
  };

  const colors = {
    bg: t.background,
    text: t.text,
    subText: t.mutedText,
    cardBorder: t.border,
    inputBg: t.inputBg,
    inputBorder: t.inputBorder,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={[styles.header, { borderBottomColor: isDark ? '#1F2937' : '#F1F5F9' }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Add New Menu</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.subText }]}>Menu Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
              placeholder="e.g. Khao Soy Gai"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.subText }]}>Price (฿)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
              placeholder="e.g. 50"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.subText }]}>Shop Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
              placeholder="e.g. Grandma's Kitchen"
              placeholderTextColor="#94A3B8"
              value={shop}
              onChangeText={setShop}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.subText }]}>Opening Hours</Text>
            <HoursRangeField
              open={openTime}
              close={closeTime}
              onChange={(o, c) => {
                setOpenTime(o);
                setCloseTime(c);
              }}
            />
            <Text style={[styles.hoursPreview, { color: colors.subText, marginTop: 8 }]}>
              {openHours ? `Saved as: ${openHours}` : 'Select opening and closing time'}
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.subText }]}>Operating Days</Text>

            <View style={styles.daysRow}>
              {DAYS.map((d) => {
                const selected = operatingDays.includes(d);
                return (
                  <TouchableOpacity
                    key={d}
                    activeOpacity={0.85}
                    onPress={() => toggleDay(d)}
                    style={[
                      styles.dayPill,
                      {
                        borderColor: selected ? '#059669' : colors.inputBorder,
                        backgroundColor: selected ? '#059669' : colors.inputBg,
                      },
                    ]}
                  >
                    <Text style={{ color: selected ? '#fff' : colors.text, fontWeight: '800' }}>
                      {DAY_LABELS_TH[d]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.subText }]}>Location</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
              placeholder="e.g. D1 Cafeteria, MFU"
              value={location}
              onChangeText={setLocation}
              placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity
              onPress={openInMaps}
              disabled={!location.trim()}
              style={[styles.mapsLinkBtn, !location.trim() && { opacity: 0.4 }]}
              activeOpacity={0.8}
            >
              <MaterialIcons name="map" size={18} color="#059669" />
              <Text style={styles.mapsLinkText}>Open in Google Maps</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.subText }]}>Menu Photo</Text>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={onPickImage}
              style={[styles.photoPicker, { backgroundColor: colors.inputBg, borderColor: '#94A3B8' }]}
              activeOpacity={0.85}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.photoPreview} resizeMode="cover" />
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <MaterialIcons name="photo-camera" size={28} color={isDark ? '#94A3B8' : '#64748B'} />
                  <Text style={[styles.photoPickerText, { color: colors.subText }]}>Add menu photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, saving && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator color="#fff" />
                <Text style={[styles.submitButtonText, { marginLeft: 10 }]}>Saving...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Confirm Add Menu</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  inputGroup: { marginBottom: 24 },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  hoursPreview: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  photoPicker: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#94A3B8',
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  photoPickerText: {
    marginTop: 10,
    color: '#64748B',
    fontWeight: '700',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  dayPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#059669',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  mapsLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
  },
  mapsLinkText: { color: '#059669', fontWeight: '700', fontSize: 13, marginLeft: 6},
});