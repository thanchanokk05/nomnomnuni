import { useFavorites } from '@/context/favorites';
import { FOODS } from '@/data/foods';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type Food = (typeof FOODS)[number];

export default function FoodCard({ item }: { item: Food }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(item.id);

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Image source={require('@/assets/images/icon.png')} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{item.price} baht</Text>
        </View>
      </View>

      <TouchableOpacity
        accessible
        accessibilityLabel={fav ? 'Remove from favorites' : 'Add to favorites'}
        accessibilityRole="button"
        accessibilityState={{ selected: fav }}
        onPress={() => toggleFavorite(item.id, item.name)}
        style={styles.heartButton}>
        <MaterialIcons name={fav ? 'favorite' : 'favorite-border'} size={24} color={fav ? '#15803D' : '#166534'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    marginVertical: 6,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    elevation: 1,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#EEE',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#052E16',
  },
  price: {
    marginTop: 6,
    color: '#355E3B',
  },
  heartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});
