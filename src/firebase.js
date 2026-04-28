import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAxHCW0stUNJkb-H7aNCDoYTS11QDybVyI",
  authDomain: "nomnomuni-97584.firebaseapp.com",
  projectId: "nomnomuni-97584",
  storageBucket: "nomnomuni-97584.firebasestorage.app",
  messagingSenderId: "133034446223",
  appId: "1:133034446223:web:297b1badca58d42e168ffa",
  measurementId: "G-J6VPM4EQ6X"
};

// Initialize Firebase (safe for hot-reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics only works in browser (not SSR / React Native)
isSupported().then((yes) => {
  if (yes) getAnalytics(app);
});

export default app;