import { ThemedView } from '@/components/themed-view';
import { useFavorites } from '@/context/favorites';
import { FOODS } from '@/data/foods';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FoodDetail() {
  const params = useLocalSearchParams();
  const id = Number(params.id);
  const item = FOODS.find((f) => f.id === id);
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!item) return null;

  const fav = isFavorite(item.id);

  return (
    <ThemedView style={styles.container}>
      <Image source={require('@/assets/images/icon.png')} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price} baht</Text>
      </View>

      <TouchableOpacity
        style={styles.heart}
        onPress={() => toggleFavorite(item.id, item.name)}
        accessibilityLabel={fav ? 'Remove from favorites' : 'Add to favorites'}
        accessibilityState={{ selected: fav }}>
        <MaterialIcons name={fav ? 'favorite' : 'favorite-border'} size={28} color={fav ? '#F39931' : '#2D2D2D'} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={() => toggleFavorite(item.id, item.name)}>
        <Text style={styles.addButtonText}>Add to Favorite</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF8EE',
    alignItems: 'center',
  },
  image: {
    width: 260,
    height: 260,
    borderRadius: 16,
    marginTop: 20,
    backgroundColor: '#fff',
  },
  info: {
    marginTop: 20,
    alignItems: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2D2D2D',
  },
  price: {
    fontSize: 18,
    marginTop: 8,
    color: '#2D2D2D',
  },
  heart: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    marginTop: 30,
    backgroundColor: '#F39931',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
