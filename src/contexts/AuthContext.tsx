'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  sendPasswordResetEmail,
  deleteUser,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import type { UserProfile, UserGroup } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  signUp: (username: string, email: string, password: string, userGroup: UserGroup) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        if (!isAuthenticated) {
          await loadProfile(fbUser.uid);
        }
      } else {
        setUser(null);
        setFirebaseUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProfile(uid: string) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        const data = snap.data();
        setUser({
          id: data.id || uid,
          username: data.username || 'user',
          userGroup: data.userGroup || 'child',
          age: data.age,
          consentGranted: true,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      } else {
        setUser({
          id: uid,
          username: `guest_${uid.slice(0, 8)}`,
          userGroup: 'child',
          consentGranted: true,
          createdAt: new Date(),
        });
      }
      setIsAuthenticated(true);
    } catch {
      setAuthError('Failed to load profile.');
    }
  }

  async function signUp(username: string, email: string, password: string, userGroup: UserGroup): Promise<boolean> {
    if (!username || !email || !password) { setAuthError('All fields are required.'); return false; }
    if (password.length < 6) { setAuthError('Password must be at least 6 characters.'); return false; }
    setIsLoading(true);
    setAuthError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const profile: UserProfile = { id: result.user.uid, username, userGroup, consentGranted: true, createdAt: new Date() };
      await setDoc(doc(db, 'users', result.user.uid), { ...profile, createdAt: new Date() });
      setUser(profile);
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    } catch (e: unknown) {
      setIsLoading(false);
      const err = e as { code?: string };
      if (err.code === 'auth/email-already-in-use') setAuthError('Email is already registered.');
      else if (err.code === 'auth/weak-password') setAuthError('Password is too weak.');
      else if (err.code === 'auth/invalid-email') setAuthError('Invalid email address.');
      else setAuthError('Sign up failed.');
      return false;
    }
  }

  async function login(email: string, password: string): Promise<boolean> {
    if (!email || !password) { setAuthError('Email and password are required.'); return false; }
    setIsLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await loadProfile(result.user.uid);
      setIsLoading(false);
      return true;
    } catch (e: unknown) {
      setIsLoading(false);
      const err = e as { code?: string };
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') setAuthError('Invalid email or password.');
      else if (err.code === 'auth/too-many-requests') setAuthError('Too many attempts. Try again later.');
      else setAuthError('Login failed.');
      return false;
    }
  }

  async function signInWithGoogle() {
    setIsLoading(true);
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;
      const snap = await getDoc(doc(db, 'users', uid));
      if (!snap.exists()) {
        const profile: UserProfile = {
          id: uid,
          username: result.user.displayName || `user_${uid.slice(0, 8)}`,
          userGroup: 'child',
          consentGranted: true,
          createdAt: new Date(),
        };
        await setDoc(doc(db, 'users', uid), { ...profile, createdAt: new Date() });
        setUser(profile);
      } else {
        await loadProfile(uid);
      }
      setIsAuthenticated(true);
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in popup was closed.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setAuthError('An account already exists with this email using a different sign-in method.');
      } else {
        setAuthError('Google sign-in failed.');
      }
    }
    setIsLoading(false);
  }

  async function continueAsGuest() {
    setIsLoading(true);
    setAuthError(null);
    try {
      const result = await signInAnonymously(auth);
      setUser({ id: result.user.uid, username: `guest_${result.user.uid.slice(0, 8)}`, userGroup: 'child', consentGranted: true, createdAt: new Date() });
      setIsAuthenticated(true);
    } catch {
      setAuthError('Could not start guest session.');
    }
    setIsLoading(false);
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
    setIsAuthenticated(false);
  }

  async function resetPassword(email: string): Promise<boolean> {
    try { await sendPasswordResetEmail(auth, email); return true; } catch { setAuthError('Failed to send reset email.'); return false; }
  }

  async function deleteAccountFn(): Promise<boolean> {
    if (!firebaseUser) return false;
    try {
      const uid = firebaseUser.uid;
      for (const sub of ['sessions', 'screeningResults']) {
        const snap = await getDocs(collection(db, 'users', uid, sub));
        for (const d of snap.docs) await deleteDoc(d.ref);
      }
      await deleteDoc(doc(db, 'users', uid));
      await deleteUser(firebaseUser);
      setUser(null);
      setIsAuthenticated(false);
      return true;
    } catch { setAuthError('Failed to delete account.'); return false; }
  }

  return (
    <AuthContext.Provider value={{ user, firebaseUser, isAuthenticated, isLoading, authError, signUp, login, signInWithGoogle, continueAsGuest, logout, resetPassword, deleteAccount: deleteAccountFn, clearError: () => setAuthError(null) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
