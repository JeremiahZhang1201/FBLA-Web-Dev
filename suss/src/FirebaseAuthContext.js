// src/FirebaseAuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './firebaseAuth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        return;
      }
      try {
        const res = await fetch(`http://localhost:6969/users/uid/${currentUser.uid}`);
        if (res.ok) {
          const userDoc = await res.json();
          setUser({
            ...currentUser,
            role: userDoc.role,
            gpa: userDoc.gpa,
            courses: userDoc.courses,
            preferredRoles: userDoc.preferredRoles,
          });
        } else if (res.status === 404) {
          console.warn(
            'No user doc found in Mongo for this Firebase user. Please do a proper signup to create the doc.'
          );
          setUser({ ...currentUser, role: null });
        } else {
          console.warn('Error fetching user doc. Status:', res.status);
          setUser({ ...currentUser, role: null });
        }
      } catch (err) {
        console.error('Error fetching user doc:', err);
        setUser({ ...currentUser, role: null });
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
