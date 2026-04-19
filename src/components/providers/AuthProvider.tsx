import React, { createContext, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase/client';
import { useAppStore } from '../../store/useAppStore';
import { User } from '../../types';

const AuthContext = createContext({});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const setUser = useAppStore((state) => state.setUser);
  const setLoading = useAppStore((state) => state.setLoading);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            setUser(userDoc.data() as User);
          } else {
            // Create new user profile
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Learner',
              photoURL: firebaseUser.photoURL || '',
              role: 'student',
              stats: {
                streak: 0,
                points: 0,
                level: 1,
                studyTimeMinutes: 0
              },
              preferences: {
                theme: 'system',
                focusMode: false
              }
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setUser(newUser);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error in AuthProvider:', error);
        setUser(null);
        toast.error('Session error. Please check database permissions.');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
};
