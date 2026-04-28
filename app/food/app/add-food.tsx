import HourDropdown from '@/components/hour-dropdown';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView, Platform, SafeAreaView,
    ScrollView,
    StyleSheet, Text, TextInput, TouchableOpacity,
    View
} from 'react-native';
export default function AddFoodScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [shop, setShop] = useState('');

  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [location, setLocation] = useState('');

  const handlePaste = async () => {
    const text = await Clipboard.getStringAsync();
    if (!text) {
      Alert.alert('Clipboard empty', 'There is nothing to paste.');
      return;
    }
    setLocation(text);
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(location);
  };

  const handleSave = () => {
    if (!name || !price || !shop) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    alert('บันทึกข้อมูลเรียบร้อย!');
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="close" size={28} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Menu</Text>
          <View style={{ width: 28 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Menu Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Basil Fried Rice"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price (Baht)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 50"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Shop Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Grandma's Kitchen"
              value={shop}
              onChangeText={setShop}
            />
          </View>

          <View style={styles.sectionTitleWrap}>
            <Text style={styles.sectionTitle}>LOCATION</Text>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.clipboardRow}>
              <TouchableOpacity style={styles.clipboardBtn} onPress={handlePaste} activeOpacity={0.7}>
                <MaterialIcons name="content-paste" size={16} color="#059669" />
                <Text style={[styles.clipboardText, { color: '#059669' }]}>Paste</Text>
              </TouchableOpacity>
              {location.length > 0 && (
                <TouchableOpacity style={styles.clipboardBtn} onPress={handleCopy} activeOpacity={0.7}>
                  <MaterialIcons name="content-copy" size={16} color="#64748B" />
                  <Text style={[styles.clipboardText, { color: '#64748B' }]}>Copy</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.locationField}>
              <MaterialIcons name="map" size={20} color="#64748B" />
              <TextInput
                style={styles.locationInput}
                placeholder="Enter shop location"
                placeholderTextColor="#94A3B8"
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          <View style={styles.sectionTitleWrap}>
            <Text style={styles.sectionTitle}>OPEN HOURS</Text>
          </View>

          <View style={styles.inputGroup}>
            <HourDropdown label="Open time" value={openTime} onChange={setOpenTime} />
          </View>

          <View style={styles.inputGroup}>
            <HourDropdown label="Close time" value={closeTime} onChange={setCloseTime} />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
            <Text style={styles.submitButtonText}>Confirm Add Menu</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  scrollContent: { padding: 24 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 8, textTransform: 'uppercase' },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitleWrap: { marginTop: 4, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A', letterSpacing: 1 },
  submitButton: {
    backgroundColor: '#059669',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  clipboardRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginBottom: 8,
  },
  clipboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clipboardText: { fontSize: 13, fontWeight: '600' },
  locationField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FD',
    borderRadius: 16,
  },
  locationInput: { flex: 1, fontSize: 16, color: '#1E293B', padding: 0 },
});
