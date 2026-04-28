import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: 'AIzaSyAxHCW0stUNJkb-H7aNCDoYTS11QDybVyI',
  authDomain: 'nomnomuni-97584.firebaseapp.com',
  projectId: 'nomnomuni-97584',
  messagingSenderId: '133034446233',
  appId: '1:133034446223:web:297b1badca58d42e168ffa',
  measurementId: 'G-J6VPM4EQ6X',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let auth: ReturnType<typeof getAuth>;
if (Platform.OS === 'web') {
  // บน web Firebase ใช้ localStorage อัตโนมัติ
  auth = getAuth(app);
} else {
  try {
    // Native (iOS/Android): ใช้ AsyncStorage เพื่อให้ login ค้างข้ามการปิด-เปิดแอพ
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // hot-reload: app already initialized
    auth = getAuth(app);
  }
}

export { auth };
export const db = getFirestore(app);
export default app;
