import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import FoodCard from '@/components/food-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFavorites } from '@/context/favorites';
import { FOODS } from '@/data/foods';

export default function FavoriteScreen() {
  const { favorites } = useFavorites();
  const items = FOODS.filter((f) => favorites.includes(f.id));

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Favorite</ThemedText>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No favorite food yet.</Text>
        </View>
      ) : (
        <FlatList data={items} keyExtractor={(i) => String(i.id)} renderItem={({ item }) => <FoodCard item={item} />} />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF8EE',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#2D2D2D',
    fontWeight: '600',
  },
});
