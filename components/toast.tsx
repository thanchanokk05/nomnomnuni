import { useFavorites } from '@/context/favorites';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Toast() {
  const { toastMessage } = useFavorites();

  if (!toastMessage) return null;

  return (
    <View pointerEvents="none" style={styles.container}>
      <View style={styles.toast}>
        <Text style={styles.text}>{toastMessage}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    backgroundColor: '#F39931',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
  },
});
