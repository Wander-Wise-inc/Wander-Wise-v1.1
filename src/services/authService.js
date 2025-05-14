// src/services/authService.js
import { auth, googleProvider } from '../service/firebaseConfig'; // Ensure this path is correct
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

export const authService = {
  // Sign in with Google
  async signInWithGoogle() {
    if (!auth || !googleProvider) {
      console.error("Firebase Auth or Google Provider not initialized.");
      throw new Error("Authentication service is not ready. Please check Firebase configuration.");
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Store relevant user info (optional, can be handled by onAuthStateChanged listener in App.jsx or Header)
      // localStorage.setItem('authUser', JSON.stringify({ uid: user.uid, name: user.displayName, email: user.email, picture: user.photoURL }));
      return {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        picture: user.photoURL,
        emailVerified: user.emailVerified,
      };
    } catch (error) {
      console.error('Error signing in with Google:', error.code, error.message);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error("Sign-in popup was closed. Please try again.");
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error("Sign-in was cancelled. Please try again if this was a mistake.");
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error("Sign-in popup was blocked by the browser. Please enable popups for this site and try again.");
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error("Network error during sign-in. Please check your internet connection.");
      }
      throw new Error("Google Sign-In failed. Please check your connection or try again later.");
    }
  },

  // Sign out
  async signOutUser() { // Renamed to avoid conflict if you have a different signOut elsewhere
    if (!auth) {
      console.error("Firebase Auth not initialized.");
      throw new Error("Authentication service is not ready.");
    }
    try {
      await signOut(auth);
      // localStorage.removeItem('authUser');
    } catch (error) {
      console.error('Error signing out:', error.code, error.message);
      throw new Error("Sign-out failed. Please try again.");
    }
  },

  // Listen to auth state changes
  onAuthStateChangedListener(callback) { // Renamed to avoid conflict
    if (!auth) {
      console.warn("Firebase Auth not initialized. Auth state changes will not be monitored.");
      callback(null); // Report no user
      return () => {}; // Return a no-op unsubscribe function
    }
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const user = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          picture: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
        };
        // localStorage.setItem('authUser', JSON.stringify(user)); // Optional: update local storage
        callback(user);
      } else {
        // User is signed out
        // localStorage.removeItem('authUser'); // Optional: clear local storage
        callback(null);
      }
    });
  }
};