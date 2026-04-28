import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type User = { name: string; email: string; photoURL?: string | null } | null;

type UserContextType = {
  user: User;
  loading: boolean;
  setUser: (u: User) => void;
  clearUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true); // true จนกว่า Firebase จะตอบกลับ

  // รับ auth state จาก Firebase ทุกครั้งที่แอพเปิด → login ค้างอัตโนมัติ
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'User',
          email: firebaseUser.email ?? '',
          photoURL: firebaseUser.photoURL ?? null,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  function clearUser() {
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, loading, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
