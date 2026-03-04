import { useUser } from '@/context/user';
import { auth } from '@/firebase/config';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useUser();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation', 'Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      setUser({ name: user.displayName ?? '', email: user.email ?? email });
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Login failed', `${err.code ?? ''} ${err.message ?? 'Unable to login'}`);
    } finally {
      setLoading(false);
    }
  }

  async function onSignUp() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Validation', 'Please enter name, email and password.');
      return;
    }
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      // update displayName on Firebase user
      try {
        await updateProfile(user, { displayName: name });
      } catch (uErr) {
        // non-fatal: continue even if profile update fails
        console.warn('updateProfile failed', uErr);
      }
      setUser({ name, email });
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Sign up failed', `${err.code ?? ''} ${err.message ?? 'Unable to sign up'}`);
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
        <View style={styles.card}>
          <Text style={styles.title}>{mode === 'login' ? 'Welcome back to NomNomUni' : 'Create your NomNomUni account'}</Text>

          {mode === 'signup' && (
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              accessibilityLabel="Name input"
            />
          )}

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            accessibilityLabel="Email input"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            accessibilityLabel="Password input"
          />

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={mode === 'login' ? onLogin : onSignUp}
            accessibilityRole="button"
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? (mode === 'login' ? 'Logging in...' : 'Signing up...') : (mode === 'login' ? 'Log In' : 'Sign Up')}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'signup' : 'login')} style={styles.switchRow}>
            <Text style={styles.switchText}>
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const PRIMARY = '#166534';
const BACKGROUND = '#F0FDF4';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#2D2D2D',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#166534',
  },
  button: {
    marginTop: 8,
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  switchRow: {
    marginTop: 12,
  },
  switchText: {
    color: PRIMARY,
    fontWeight: '600',
  },
});
