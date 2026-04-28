import React, { createContext, ReactNode, useContext, useState } from 'react';

type FavoritesContextType = {
  favorites: number[];
  toggleFavorite: (id: number, name?: string) => void;
  isFavorite: (id: number) => boolean;
  toastMessage: string | null;
  showToast: (message: string, durationMs?: number) => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function isFavorite(id: number) {
    return favorites.includes(id);
  }

  function showToast(message: string, durationMs: number = 1800) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), durationMs);
  }

  function toggleFavorite(id: number, name?: string) {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((p) => p !== id) : [...prev, id];
      showToast(
        name
          ? `${name} ${exists ? 'removed from' : 'added to'} favorites`
          : exists ? 'Removed from favorites' : 'Added to favorites'
      );
      return next;
    });
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, toastMessage, showToast }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
