import React, { createContext, ReactNode, useContext, useState } from 'react';

type Review = {
  id: string;
  foodId: number;
  comment: string;
  createdAt: number;
};

type ReviewContextType = {
  reviews: Review[];
  addReview: (foodId: number, comment: string) => void;
  getReviewsByFood: (foodId: number) => Review[];
};

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  function addReview(foodId: number, comment: string) {
    const r: Review = { id: String(Date.now()), foodId, comment, createdAt: Date.now() };
    setReviews((prev) => [r, ...prev]);
  }

  function getReviewsByFood(foodId: number) {
    return reviews.filter((r) => r.foodId === foodId);
  }

  return <ReviewContext.Provider value={{ reviews, addReview, getReviewsByFood }}>{children}</ReviewContext.Provider>;
}

export function useReview() {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error('useReview must be used within ReviewProvider');
  return ctx;
}
