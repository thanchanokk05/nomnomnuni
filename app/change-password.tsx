import React from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { ChevronLeft, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { getAuth, updatePassword } from 'firebase/auth';

import { useThemeMode } from '@/context/theme';

const PRIMARY_GREEN = '#166534';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { resolvedScheme } = useThemeMode();
  const isDark = resolvedScheme === 'dark';

  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  async function onSave() {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Missing information', 'Please enter both the new password and confirm password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Password mismatch', 'New password and confirm password must match.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Not signed in', 'Please sign in again.');
      return;
    }

    setSaving(true);
    try {
      await updatePassword(user, newPassword);
      Alert.alert('Success', 'Your password has been updated.');
      setNewPassword('');
      setConfirmPassword('');
      if (router.canGoBack()) router.back();
      else router.replace('/(tabs)/profile' as any);
    } catch (e: any) {
      const code = e?.code as string | undefined;
      let message = 'Failed to change password. Please try again.';
      if (code === 'auth/requires-recent-login') {
        message = 'For security reasons, please sign out and sign in again before changing your password.';
      }
      Alert.alert('Error', message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? '#121212' : '#F8FAFC' }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/profile' as any)} style={styles.backBtn} accessibilityRole="button">
              <ChevronLeft size={22} color={PRIMARY_GREEN} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#1E293B' }]}>Change Password</Text>
            <View style={{ width: 40 }} />
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                borderColor: isDark ? '#2A2A2A' : '#F1F5F9',
              },
            ]}
          >
            <Text style={[styles.label, { color: isDark ? '#CBD5E1' : '#334155' }]}>New Password</Text>
            <View style={[styles.inputRow, { borderColor: isDark ? '#2A2A2A' : '#E2E8F0', backgroundColor: isDark ? '#121212' : '#F8FAFC' }]}>
              <Lock size={18} color={isDark ? '#94A3B8' : '#64748B'} style={{ marginRight: 10 }} />
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New password"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                style={[styles.input, { color: isDark ? '#E2E8F0' : '#0F172A' }]}
              />
            </View>

            <Text style={[styles.label, { color: isDark ? '#CBD5E1' : '#334155' }]}>Confirm Password</Text>
            <View style={[styles.inputRow, { borderColor: isDark ? '#2A2A2A' : '#E2E8F0', backgroundColor: isDark ? '#121212' : '#F8FAFC' }]}>
              <Lock size={18} color={isDark ? '#94A3B8' : '#64748B'} style={{ marginRight: 10 }} />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                style={[styles.input, { color: isDark ? '#E2E8F0' : '#0F172A' }]}
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, saving && styles.btnDisabled]}
              onPress={onSave}
              disabled={saving}
              accessibilityRole="button"
            >
              <Text style={styles.primaryBtnText}>{saving ? 'Saving...' : 'Save Password'}</Text>
            </TouchableOpacity>

            <Text style={[styles.note, { color: '#94A3B8' }]}>
              * If you see a "re-login required" message, please sign out and sign in again.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 40,
    paddingTop: 10,
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
  },
  card: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
  },
  label: {
    marginTop: 10,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '800',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    fontWeight: '600',
  },
  primaryBtn: {
    backgroundColor: PRIMARY_GREEN,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '800',
  },
  btnDisabled: {
    opacity: 0.7,
  },
  note: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
