import React, { createContext, ReactNode, useContext, useMemo, useRef, useState } from 'react';

import { auth } from '@/firebase/config';
import {
    doc,
    getDoc,
    getFirestore,
    type DocumentData,
} from 'firebase/firestore';

type Review = {
  id: string;
  foodId: number;
  comment: string;
  createdAt: number;
  userId?: string;
  displayName?: string;
  photoURL?: string | null;
};

type PublicProfile = {
  displayName: string;
  photoURL: string | null;
};

type ReviewContextType = {
  reviews: Review[];
  addReview: (foodId: number, comment: string) => void;
  getReviewsByFood: (foodId: number) => Review[];
  getAuthorProfile: (userId?: string) => Promise<PublicProfile>;
};

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

const DEFAULT_PROFILE: PublicProfile = { displayName: 'Anonymous', photoURL: null };

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  // cache resolved profiles to avoid repeated Firestore reads
  const profileCacheRef = useRef<Map<string, PublicProfile>>(new Map());

  const db = useMemo(() => getFirestore(), []);

  async function getAuthorProfile(userId?: string): Promise<PublicProfile> {
    if (!userId) return DEFAULT_PROFILE;

    const cached = profileCacheRef.current.get(userId);
    if (cached) return cached;

    try {
      // Expected structure: users/{uid} with fields: displayName, photoURL
      const snap = await getDoc(doc(db, 'users', userId));
      if (snap.exists()) {
        const data = snap.data() as DocumentData;
        const profile: PublicProfile = {
          displayName: (data?.displayName as string) || 'Anonymous',
          photoURL: (data?.photoURL as string) || null,
        };
        profileCacheRef.current.set(userId, profile);
        return profile;
      }
    } catch {
      // ignore and fall back
    }

    profileCacheRef.current.set(userId, DEFAULT_PROFILE);
    return DEFAULT_PROFILE;
  }

  function addReview(foodId: number, comment: string) {
    const cu = auth.currentUser;
    const r: Review = {
      id: String(Date.now()),
      foodId,
      comment,
      createdAt: Date.now(),
      userId: cu?.uid,
      displayName: cu?.displayName ?? 'Anonymous',
      photoURL: cu?.photoURL ?? null,
    };

    setReviews((prev) => [r, ...prev]);
  }

  function getReviewsByFood(foodId: number) {
    return reviews.filter((r) => r.foodId === foodId);
  }

  return (
    <ReviewContext.Provider value={{ reviews, addReview, getReviewsByFood, getAuthorProfile }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReview() {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error('useReview must be used within ReviewProvider');
  return ctx;
}
