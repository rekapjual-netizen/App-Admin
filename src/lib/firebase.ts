import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'MISSING',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app;
try {
  if (import.meta.env.VITE_FIREBASE_API_KEY) {
    app = initializeApp(firebaseConfig);
  } else {
    console.warn('Firebase API Key is missing. Please set it in Settings.');
  }
} catch (error) {
  console.error('Firebase initialization failed:', error);
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
