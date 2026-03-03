// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxHCW0stUNJkb-H7aNCDoYTS11QDybVyI",
  authDomain: "nomnomuni-97584.firebaseapp.com",
  projectId: "nomnomuni-97584",
  storageBucket: "nomnomuni-97584.firebasestorage.app",
  messagingSenderId: "133034446223",
  appId: "1:133034446223:web:297b1badca58d42e168ffa",
  measurementId: "G-J6VPM4EQ6X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);