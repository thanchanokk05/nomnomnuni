// Static fallback dishes. Empty by default so the All Menu list shows only
// real Firestore data (or the empty state when there's nothing yet).
//
// To add samples back later, append entries here and re-introduce the merge
// in app/(tabs)/index.tsx.

export type StaticFood = {
  id: number;
  name: string;
  price: number;
  shopName: string;
  location: string;
  openHours: string;
  imageUri: string | null;
  createdBy: string;
};

export const FOODS: StaticFood[] = [];
