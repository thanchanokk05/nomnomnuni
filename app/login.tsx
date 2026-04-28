import { useUser } from '@/context/user';
import { auth } from '@/firebase/config';
import { Eye, EyeOff, Lock, Mail, User, Utensils } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useUser();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onLogin() {
    const normalizedEmail = email.trim();
    const rawPassword = password;

    if (!normalizedEmail || !rawPassword.trim()) return;

    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, normalizedEmail, rawPassword);
      const displayName = cred.user.displayName || '';
      const photoURL = cred.user.photoURL || null;

      // restore user to global state so app can use it
      setUser({ name: displayName, email: normalizedEmail, photoURL });
      router.replace('/(tabs)');
    } catch (e: any) {
      const code = e?.code as string | undefined;

      let msg = 'Sign in failed. Please try again.';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') msg = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
      if (code === 'auth/user-not-found') msg = 'ไม่พบบัญชีผู้ใช้นี้';
      if (code === 'auth/invalid-email') msg = 'อีเมลไม่ถูกต้อง';
      if (code === 'auth/too-many-requests') msg = 'ลองใหม่ภายหลัง (พยายามหลายครั้งเกินไป)';

      Alert.alert(msg);
    } finally {
      setLoading(false);
    }
  }

  async function onSignUp() {
    const displayName = name.trim();
    const normalizedEmail = email.trim();
    const rawPassword = password;

    if (!displayName || !normalizedEmail || !rawPassword.trim()) return;

    if (rawPassword.length < 8) {
      Alert.alert('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, rawPassword);

      // Save displayName to Firebase user profile (optional but useful)
      await updateProfile(cred.user, { displayName });

      // Save to app global user state
      setUser({ name: displayName, email: normalizedEmail, photoURL: cred.user.photoURL || null });

      // Go to main tabs immediately
      router.replace('/(tabs)');
    } catch (e: any) {
      const code = e?.code as string | undefined;

      let msg = 'Sign up failed. Please try again.';
      if (code === 'auth/email-already-in-use') msg = 'This email is already in use.';
      if (code === 'auth/invalid-email') msg = 'Invalid email address.';
      if (code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';

      // keep it simple (no extra UI added)
      Alert.alert(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Utensils size={50} color="#166534" />
          </View>
          <Text style={styles.brandTitle}>NomNomUni</Text>
          <Text style={styles.brandSubtitle}>Delicious meals within your budget</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </Text>

          <View style={styles.inputSection}>
            {mode === 'signup' && (
              <View style={styles.inputWrapper}>
                <User size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  placeholderTextColor="#94A3B8"
                />
              </View>
            )}

            <View style={styles.inputWrapper}>
              <Mail size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  placeholderTextColor="#94A3B8"
                />
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  onPress={() => setShowPassword((v) => !v)}
                  style={styles.eyeButton}
                >
                  {showPassword ? (
                    <EyeOff size={22} color="#64748B" />
                  ) : (
                    <Eye size={22} color="#64748B" />
                  )}
                </TouchableOpacity>
              </View>

              {mode === 'signup' ? (
                <Text
                  style={[
                    styles.passwordHint,
                    { color: password.length >= 8 ? '#16A34A' : '#DC2626' },
                  ]}
                >
                  Minimum 8 characters
                </Text>
              ) : null}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={mode === 'login' ? onLogin : onSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {mode === 'login' ? 'Sign In' : 'Get Started'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setMode(mode === 'login' ? 'signup' : 'login')} 
            style={styles.switchRow}
          >
            <Text style={styles.switchTextPre}>
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <Text style={styles.switchTextLink}> {mode === 'login' ? 'Sign Up' : 'Log In'}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const PRIMARY = '#166534';
const BACKGROUND = '#F8FAFC'; // เปลี่ยนจากสีเขียวอ่อนเป็นสีเทานวลให้ดูแพงขึ้น

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 90,
    height: 90,
    backgroundColor: '#DCFCE7',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: PRIMARY,
    letterSpacing: -1,
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 30,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputSection: {
    gap: 16,
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 54,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  eyeButton: {
    height: 54,
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  button: {
    backgroundColor: PRIMARY,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
    backgroundColor: '#94A3B8',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
  switchRow: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchTextPre: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  switchTextLink: {
    color: PRIMARY,
    fontWeight: '700',
  },
  passwordHint: {
    marginTop: 8,
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '700',
  },
});