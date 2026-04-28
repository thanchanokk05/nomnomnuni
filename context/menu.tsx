import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { auth, db } from '@/firebase/config';

export type MenuItem = {
  id: string; // Firestore doc id
  userId: string;
  createdBy?: string; // display name snapshot at creation time
  name: string;
  price: number;
  shopName: string;
  openHours?: string;
  operatingDays?: string[]; // e.g. ['Mon','Tue','Wed']
  location?: string;
  imageUri: string | null;
  createdAt: number; // ms epoch for UI sorting
};

type MenuContextType = {
  menus: MenuItem[];
  loading: boolean;
  addMenu: (payload: Omit<MenuItem, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  deleteMenu: (id: string) => Promise<void>;
  updateMenu: (id: string, patch: Partial<Omit<MenuItem, 'id' | 'userId' | 'createdAt'>>) => Promise<void>;
  clearMenus: () => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

function toMillis(v: any): number {
  // Firestore Timestamp (web) -> ms
  if (!v) return Date.now();
  if (typeof v === 'number') return v;
  if (typeof v?.toMillis === 'function') return v.toMillis();
  if (typeof v?.seconds === 'number') return v.seconds * 1000;
  return Date.now();
}

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  const clearMenus = React.useCallback(() => {
    setMenus([]);
  }, []);

  useEffect(() => {
    // Public real-time menus feed (all users)
    let unsubscribeMenus: (() => void) | null = null;

    setLoading(true);
    const q = query(collection(db, 'menus'), orderBy('createdAt', 'desc'));
    unsubscribeMenus = onSnapshot(
      q,
      (snap) => {
        const items: MenuItem[] = snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            userId: data.userId,
            createdBy: data.createdBy,
            name: data.name,
            price: data.price,
            shopName: data.shopName,
            openHours: data.openHours,
            operatingDays: Array.isArray(data.operatingDays) ? data.operatingDays : undefined,
            location: data.location,
            imageUri: data.imageUri ?? null,
            createdAt: toMillis(data.createdAt),
          };
        });

        setMenus(items);
        setLoading(false);
      },
      () => {
        // If listening fails, keep UI usable but empty
        setMenus([]);
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribeMenus) unsubscribeMenus();
    };
  }, [clearMenus]);

  const addMenu = async (payload: Omit<MenuItem, 'id' | 'userId' | 'createdAt'>) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not signed in. Please sign in and try again.');

    // Build the doc, then strip undefined — Firestore Web SDK rejects
    // `undefined` values with "Unsupported field value: undefined".
    const docData: Record<string, any> = {
      ...payload,
      userId: user.uid,
      createdBy: payload.createdBy ?? user.displayName ?? user.email ?? 'Anonymous',
      createdAt: serverTimestamp(),
    };
    for (const k of Object.keys(docData)) {
      if (docData[k] === undefined) delete docData[k];
    }

    // Race against a timeout so a hung network request can't block the UI
    // forever — the caller's spinner would never clear and navigation would
    // never run.
    const TIMEOUT_MS = 15000;
    await Promise.race([
      addDoc(collection(db, 'menus'), docData),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error(`Firestore did not respond within ${TIMEOUT_MS / 1000}s`)),
          TIMEOUT_MS
        )
      ),
    ]);

    // no local setMenus here; onSnapshot will update in real time
  };

  const deleteMenu = async (id: string) => {
    await deleteDoc(doc(db, 'menus', id));
    // onSnapshot will update
  };

  const updateMenu = async (id: string, patch: Partial<Omit<MenuItem, 'id' | 'userId' | 'createdAt'>>) => {
    // Strip undefined fields here too — same reason as addMenu.
    const cleaned: Record<string, any> = { ...patch };
    for (const k of Object.keys(cleaned)) {
      if (cleaned[k] === undefined) delete cleaned[k];
    }
    await updateDoc(doc(db, 'menus', id), cleaned);
    // onSnapshot will update
  };

  const value = useMemo(
    () => ({ menus, loading, addMenu, deleteMenu, updateMenu, clearMenus }),
    [menus, loading, clearMenus]
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used within MenuProvider');
  return ctx;
}
