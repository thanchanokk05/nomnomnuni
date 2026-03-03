import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import FoodCard from '@/components/food-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FOODS } from '@/data/foods';

export default function HomeScreen() {
  const router = useRouter();
  const [budget, setBudget] = useState('');
  const [filtered, setFiltered] = useState(FOODS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onFindFood() {
    setError(null);
    if (!budget.trim()) {
      setError('Please select your budget.');
      return;
    }
    const num = Number(budget);
    if (Number.isNaN(num)) {
      setError('Please enter a valid number.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const results = FOODS.filter((f) => f.price <= num);
      if (results.length === 0) {
        setError('No food available in this price range.');
      }
      setFiltered(results);
      setLoading(false);
    }, 600);
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.centerBox}>
          <ThemedText type="title">NomNomUni</ThemedText>
          <ThemedText type="subtitle">what’s your budget today?</ThemedText>

          <View style={styles.inputRow}>
            <TextInput
              placeholder="e.g. 50 baht"
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
              style={styles.input}
              accessibilityLabel="Budget input"
            />
            <TouchableOpacity accessibilityRole="button" onPress={onFindFood} style={styles.button}>
              <Text style={styles.buttonText}>find food</Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <View style={styles.listArea}>
          <ThemedText type="subtitle" style={{ marginTop: 0 }}>
            Food list
          </ThemedText>

          {loading ? (
            <ActivityIndicator size="large" color="#F39931" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(i) => String(i.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() =>
                    router.push({
  pathname: '/food/[id]',
  params: {
    id: item.id.toString(),
    name: item.name,
  },
})
                  }
                >
                  <FoodCard item={item} />
                </TouchableOpacity>
              )}
              style={{ marginTop: 12 }}
            />
          )}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF8EE',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
  },
  input: {
    width: '60%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2D2D2D',
    marginVertical: 15,
  },
  button: {
    backgroundColor: '#F39931',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
    marginLeft: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  errorText: {
    marginTop: 10,
    color: '#B00020',
    fontWeight: '600',
  },
  listArea: {
    // keep list in bottom area
    paddingBottom: 20,
  },
});
