import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};
  
const REQUIRED_KEYS = ['apiKey', 'authDomain', 'projectId', 'appId'];

const looksLikeFirebaseWebApiKey = (value) => {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  // Firebase Web API keys typically look like: AIzaSy... (39 chars total)
  return /^AIza[0-9A-Za-z_-]{35}$/.test(trimmed);
};

const getConfigProblems = (config) => {
  const missing = REQUIRED_KEYS.filter((k) => !config?.[k]);
  const problems = [];

  if (missing.length > 0) {
    problems.push(`Missing required env vars for Firebase: ${missing.map((k) => `REACT_APP_FIREBASE_${k.replace(/([A-Z])/g, '_$1').toUpperCase()}`).join(', ')}`);
  }

  if (config?.apiKey && !looksLikeFirebaseWebApiKey(config.apiKey)) {
    problems.push('REACT_APP_FIREBASE_API_KEY does not look like a valid Firebase Web API key (expected to start with "AIza" and be 39 chars).');
  }

  return problems;
};

let app = null;
export let auth = null;
export let db = null;
export const googleProvider = new GoogleAuthProvider();

const configProblems = getConfigProblems(firebaseConfig);
export const isFirebaseConfigured = configProblems.length === 0;
export const firebaseInitError = isFirebaseConfigured
  ? null
  : `Firebase is not configured. ${configProblems.join(' ')}`;

if (!isFirebaseConfigured) {
  // Avoid crashing the app on startup; consumers should handle auth/db being null.
  // This commonly happens when `.env` is missing or contains placeholder values.
  // eslint-disable-next-line no-console
  console.error(firebaseInitError);
} else {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize Firebase:', error);
    auth = null;
    db = null;
  }
}

// Enable offline persistence (helps with blocked requests)
if (db) {
  try {
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.warn('Firestore persistence already enabled in another tab');
      } else if (err.code === 'unimplemented') {
        // Browser doesn't support persistence
        console.warn('Browser does not support Firestore persistence');
      }
    });
  } catch (error) {
    console.warn('Could not enable Firestore persistence:', error);
  }
}

export const signInWithGoogle = async () => {
  if (!auth) {
    throw new Error(
      firebaseInitError ||
        'Firebase Auth is not initialized. Check your REACT_APP_FIREBASE_* environment variables.'
    );
  }
  const { signInWithPopup, signInWithRedirect } = await import('firebase/auth');
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    // If popups are blocked (common in stricter browsers), fall back to redirect.
    if (
      error?.code === 'auth/popup-blocked' ||
      error?.code === 'auth/operation-not-supported-in-this-environment'
    ) {
      return signInWithRedirect(auth, googleProvider);
    }
    throw error;
  }
};

export const logOut = async () => {
  if (!auth) return;
  const { signOut } = await import('firebase/auth');
  return signOut(auth);
};