import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, firebaseInitError, isFirebaseConfigured } from '../firebase';
import { getRedirectResult, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      if (!isFirebaseConfigured && firebaseInitError) {
        // eslint-disable-next-line no-console
        console.error(firebaseInitError);
      }
      setLoading(false);
      return undefined;
    }

    // If a redirect-based sign-in happened, this resolves it (and surfaces errors).
    getRedirectResult(auth).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Google redirect sign-in failed:', error);
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    isFirebaseConfigured,
    firebaseInitError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};