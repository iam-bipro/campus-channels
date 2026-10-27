import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getDatabase, type Database } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export function getFirebaseAuth(): Auth {
  if (!firebaseConfig.apiKey) {
    throw new Error('Firebase Auth is not configured. Add EXPO_PUBLIC_FIREBASE_API_KEY to .env.');
  }
  return getAuth(app);
}

export const db = getFirestore(app);
export const storage = getStorage(app);

export function getRealtimeDatabase(): Database {
  if (!firebaseConfig.databaseURL && !firebaseConfig.projectId) {
    throw new Error('Firebase Realtime Database is not configured.');
  }
  return getDatabase(app);
}
