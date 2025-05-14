// src/service/firebaseConfig.jsx
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, // Can be undefined if not set
};

let app;
let auth;
let db;
let googleProvider;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });

  console.log("Firebase initialized successfully.");

} catch (error) {
  console.error("Firebase initialization error:", error);
  console.error("PLEASE CHECK YOUR FIREBASE CONFIGURATION IN THE .env FILE AND IN THE FIREBASE CONSOLE.");
  // Provide minimal mocks to prevent app from crashing hard if above fails,
  // though the expectation is that with correct .env, it should work.
  app = app || null; // Keep app if initialized before error in auth/db
  auth = auth || {
    onAuthStateChanged: (callback) => { callback(null); return () => {}; },
    currentUser: null,
    signInWithPopup: () => Promise.reject(new Error("Firebase Auth not properly initialized.")),
    signOut: () => Promise.resolve(),
  };
  db = db || {
    // Add mock Firestore methods if needed for basic app functionality without full DB
  };
  googleProvider = googleProvider || null;
}

export { app, auth, db, googleProvider };