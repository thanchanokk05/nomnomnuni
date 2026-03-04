import { ThemedView } from '@/components/themed-view';
import { useFavorites } from '@/context/favorites';
import { useReview } from '@/context/ReviewContext';
import { FOODS } from '@/data/foods';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function FoodDetail() {
  const params = useLocalSearchParams();
  const id = Number(params.id);
  const item = FOODS.find((f) => f.id === id);
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!item) return null;

  const fav = isFavorite(item.id);

  // Local reviews UI state + global reviews from context
  const [reviewsLocal, setReviewsLocal] = React.useState<Array<{ rating: number; comment: string }>>([
    { rating: 4, comment: 'Delicious — student priced' },
  ]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [newRating, setNewRating] = React.useState<number>(5);
  const [newComment, setNewComment] = React.useState<string>('');
  const { addReview, getReviewsByFood } = useReview();
  const globalReviews = item ? getReviewsByFood(item.id) : [];

  function handleSubmitReview() {
    if (!newComment.trim()) return;
    const review = { rating: newRating, comment: newComment.trim() };
    // push to local UI array (optional) and push to global context
    setReviewsLocal((prev) => [review, ...prev]);
    if (item) {
      addReview(item.id, newComment.trim());
    }
    setNewComment('');
    setNewRating(5);
    setModalVisible(false);
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Image source={require('@/assets/images/icon.png')} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{item.price} baht</Text>
        </View>

        <TouchableOpacity
          style={styles.heart}
          onPress={() => toggleFavorite(item.id)}
          accessibilityLabel={fav ? 'Remove from favorites' : 'Add to favorites'}
          accessibilityState={{ selected: fav }}>
          <MaterialIcons name={fav ? 'favorite' : 'favorite-border'} size={28} color={fav ? '#86EFAC' : '#14532D'} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={() => toggleFavorite(item.id)}>
          <Text style={styles.addButtonText}>{fav ? 'Remove from Favorite' : 'Add to Favorite'}</Text>
        </TouchableOpacity>

        {/* Shop Information Card */}
        <View style={styles.shopCard}>
          <Text style={styles.shopSectionTitle}>Shop information</Text>

          <View style={styles.shopRow}>
            <Text style={styles.shopLabel}>🏪 Shop name</Text>
            <Text style={styles.shopValue}>อาหารตามสั่ง</Text>
          </View>

          <View style={styles.shopRow}>
            <Text style={styles.shopLabel}>📍 Zone</Text>
            <Text style={styles.shopValue}>โรงอาหารE1</Text>
          </View>

          <View style={styles.shopRow}>
            <Text style={styles.shopLabel}>⏰ Opening hours</Text>
            <Text style={styles.shopValue}>08:00 – 16:00 น.</Text>
          </View>

          <Text style={[styles.shopSectionTitle, { marginTop: 12 }]}>⭐ Reviews</Text>

          <View style={styles.ratingRow}>
            <View style={styles.starsRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <MaterialIcons
                  key={i}
                  name={i < 4 ? 'star' : 'star-border'}
                  size={16}
                  color={i < 4 ? '#23974eff' : '#CCCCCC'}
                  style={{ marginRight: 4 }}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>4.2/5 <Text style={styles.reviewCount}>(128 reviews)</Text></Text>
          </View>

          <View style={styles.reviews}>
            {globalReviews.map((r) => (
              <Text key={r.id} style={styles.reviewItem}>💬 "{r.comment}"</Text>
            ))}
          </View>

          <TouchableOpacity style={styles.writeButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.writeButtonText}>Write Review</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Review Modal (keeps modal outside scroll) */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Write a review</Text>

            <View style={styles.starPicker}>
              {Array.from({ length: 5 }).map((_, i) => (
                <TouchableOpacity key={i} onPress={() => setNewRating(i + 1)}>
                  <MaterialIcons
                    name={i < newRating ? 'star' : 'star-border'}
                    size={28}
                    color={i < newRating ? '#22C55E' : '#CCCCCC'}
                    style={{ marginHorizontal: 6 }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Write your comment..."
              multiline
              style={styles.commentInput}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
                <Text style={styles.submitButtonText}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0FDF4',
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
    backgroundColor: '#166534',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  /* New shop card styles */
  shopCard: {
    width: '100%',
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  shopSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: 8,
  },
  shopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  shopLabel: {
    color: '#777777',
    fontWeight: '600',
  },
  shopValue: {
    color: '#2D2D2D',
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  starsRow: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    color: '#166534',
    fontWeight: '700',
  },
  reviewCount: {
    color: '#166534',
    fontWeight: '600',
    fontSize: 12,
  },
  reviews: {
    marginTop: 12,
  },
  reviewItem: {
    color: '#166534',
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
    fontSize: 14,
  },
  writeButton: {
    marginTop: 12,
    backgroundColor: '#22C55E',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  writeButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  /* Modal styles */
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: 16,
  },
  starPicker: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentInput: {
    minHeight: 60,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    color: '#2D2D2D',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginRight: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#DCFCE7',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#166534',
    fontWeight: '700',
  },
});
