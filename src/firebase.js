import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAxHCW0stUNJkb-H7aNCDoYTS11QDybVyI",
  authDomain: "nomnomuni-97584.firebaseapp.com",
  projectId: "nomnomuni-97584",
  storageBucket: "nomnomuni-97584.firebasestorage.app",
  messagingSenderId: "133034446223",
  appId: "1:133034446223:web:297b1badca58d42e168ffa",
  measurementId: "G-J6VPM4EQ6X",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth: persistent on native via AsyncStorage, on web via localStorage (default)
let auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    auth = getAuth(app); // already initialized (hot-reload)
  }
}

export { auth };
export const db = getFirestore(app);

isSupported().then((yes) => {
  if (yes) getAnalytics(app);
});

export default app;