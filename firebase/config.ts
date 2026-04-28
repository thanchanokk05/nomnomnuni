import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: 'AIzaSyAxHCW0stUNJkb-H7aNCDoYTS11QDybVyI',
  authDomain: 'nomnomuni-97584.firebaseapp.com',
  projectId: 'nomnomuni-97584',
  storageBucket: 'nomnomuni-97584.firebasestorage.app',   // ← แก้ให้ถูก
  messagingSenderId: '133034446233',
  appId: '1:133034446223:web:297b1badca58d42e168ffa',
  measurementId: 'G-J6VPM4EQ6X',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Native: ใช้ AsyncStorage เพื่อให้ login ค้างข้ามการปิด-เปิดแอพ
// Web: getAuth ใช้ localStorage โดยอัตโนมัติ (ค้างอยู่แล้ว)
let auth: ReturnType<typeof getAuth>;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  try {
    // firebase v10+ ย้าย getReactNativePersistence ไปที่ subpath นี้
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getReactNativePersistence } = require('firebase/auth/react-native');
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    auth = getAuth(app); // hot-reload: already initialized
  }
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
