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
    <ThemedView style={{ flex: 1 }}>
      <ThemedText type="title">Favorite</ThemedText>

      {items.length === 0 ? (
        <View style={styles.container}>
          <Text style={styles.empty}>No favorite food yet.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => <FoodCard item={item} />}
          style={{ marginTop: 12 }}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0FDF4',
  },
  empty: {
    color: '#166534',
    textAlign: 'center',
    marginTop: 40,
  },
});
