import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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
