import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Project Firebase config (copied from src/firebase.js)
const firebaseConfig = {
  apiKey: "AIzaSyAxHCW0stUNJkb-H7aNCDoYTS11QDybVyI",
  authDomain: "nomnomuni-97584.firebaseapp.com",
  projectId: "nomnomuni-97584",
  storageBucket: "nomnomuni-97584.appspot.com",
  messagingSenderId: "133034446223",
  appId: "1:133034446223:web:297b1badca58d42e168ffa",
  measurementId: "G-J6VPM4EQ6X",
};

// Initialize Firebase app only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export auth instance for use in the app
export const auth = getAuth(app);

// Export firestore for persistence (menus, profiles, etc.)
export const db = getFirestore(app);

// Export storage for uploads (e.g. profile photos)
export const storage = getStorage(app);
