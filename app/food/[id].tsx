import RestaurantMap from '@/components/restaurant-map';
import { ThemedView } from '@/components/themed-view';
import { useFavorites } from '@/context/favorites';
import { useMenu } from '@/context/menu';
import { useReview } from '@/context/ReviewContext';
import { FOODS } from '@/data/foods';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Heart,
  MapPin,
  MessageCircle,
  Store,
  X,
  type LucideIcon,
} from 'lucide-react-native';
import { Image as ExpoImage } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

function googleMapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export default function FoodDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { menus } = useMenu();

  const routeId = Array.isArray(id) ? id[0] : id;
  const numericId = routeId ? Number(routeId) : NaN;

  // Menus from Firestore use string doc ids, FOODS uses numeric ids.
  const menuItem = useMemo(() => {
    if (!routeId) return undefined;
    return menus.find((m) => m.id === routeId);
  }, [menus, routeId]);

  const staticItem = useMemo(() => {
    if (!Number.isFinite(numericId)) return undefined;
    return FOODS.find((f) => f.id === numericId);
  }, [numericId]);

  const food = menuItem
    ? {
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        shopName: menuItem.shopName,
        openHours: menuItem.openHours,
        location: menuItem.location,
        imageUri: menuItem.imageUri,
        createdAt: menuItem.createdAt,
      }
    : staticItem
      ? {
          id: staticItem.id,
          name: staticItem.name,
          price: staticItem.price,
          shopName: 'ไม่ระบุร้าน',
          openHours: '08:00 - 16:00',
          location: '—',
          imageUri: null as string | null,
          createdAt: Date.now(),
        }
      : null;

  const { isFavorite, toggleFavorite } = useFavorites();
  const { addReview, getReviewsByFood, getAuthorProfile } = useReview();

  const [modalVisible, setModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');

  if (!food) {
    return (
      <ThemedView style={[styles.mainContainer, { justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
        <Text style={{ color: '#334155', fontWeight: '700', fontSize: 16 }}>ไม่พบข้อมูลอาหาร</Text>
      </ThemedView>
    );
  }

  const foodId = String(food.id);

  const isFav = isFavorite(foodId);
  const reviews = getReviewsByFood(foodId);

  // Resolve author profiles for reviews that have userId
  const [authorProfiles, setAuthorProfiles] = useState<
    Record<string, { displayName: string; photoURL: string | null }>
  >({});

  useEffect(() => {
    let alive = true;

    (async () => {
      const ids = Array.from(new Set(reviews.map((r: any) => r.userId).filter(Boolean))) as string[];
      if (!ids.length) return;

      const entries = await Promise.all(
        ids.map(async (uid) => {
          const profile = await getAuthorProfile(uid);
          return [uid, profile] as const;
        })
      );

      if (!alive) return;
      setAuthorProfiles((prev) => {
        const next = { ...prev };
        for (const [uid, profile] of entries) next[uid] = profile;
        return next;
      });
    })();

    return () => {
      alive = false;
    };
  }, [reviews, getAuthorProfile]);

  const handleSubmitReview = () => {
    if (!newComment.trim()) return;
    addReview(foodId, newComment.trim());
    setNewComment('');
    setModalVisible(false);
  };

  return (
    <ThemedView style={styles.mainContainer}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* --- Header Image & Back Button --- */}
        <View style={styles.imageContainer}>
          <Image
            source={food.imageUri ? { uri: food.imageUri } : require('@/assets/images/app-icon.png')}
            style={styles.mainImage}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.replace('/(tabs)');
            }}
          >
            <ArrowLeft size={24} color="#1E293B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.floatingHeart} onPress={() => { toggleFavorite(foodId, food.name); router.push('/(tabs)/favorite'); }}>
            <Heart
              size={26}
              color={isFav ? '#EF4444' : '#64748B'}
              fill={isFav ? '#EF4444' : 'none'}
            />
          </TouchableOpacity>
        </View>

        {/* --- Content Area --- */}
        <View style={styles.contentCard}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodPrice}>฿{food.price}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Open Now</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Shop Information Section */}
          <Text style={styles.sectionTitle}>Shop Information</Text>
          <View style={styles.infoGrid}>
            <InfoRow Icon={Store} label="Shop Name" value={food.shopName || 'ไม่ระบุร้าน'} />
            <InfoRow
              Icon={MapPin}
              label="Location"
              value={food.location || '—'}
              onPress={
                food.location
                  ? () => {
                      const q = food.shopName ? `${food.shopName} ${food.location}` : food.location!;
                      Linking.openURL(googleMapsSearchUrl(q)).catch(() => {});
                    }
                  : undefined
              }
              TrailingIcon={food.location ? ExternalLink : undefined}
            />
            <InfoRow Icon={Clock} label="Open Hours" value={food.openHours || '08:00 - 16:00'} />
          </View>

          {food.location ? (
            <View style={{ marginBottom: 24 }}>
              <Text style={styles.sectionTitle}>On the Map</Text>
              <RestaurantMap
                query={food.shopName ? `${food.shopName} ${food.location}` : food.location}
              />
            </View>
          ) : null}

          {/* Reviews Section */}
          <View style={styles.reviewHeaderRow}>
            <Text style={styles.sectionTitle}>Community Reviews</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.addReviewLink}>Write Review</Text>
            </TouchableOpacity>
          </View>

          {reviews.length > 0 ? (
            reviews.map((r: any) => {
              const resolved = r.userId ? authorProfiles[r.userId] : undefined;
              const displayName =
                resolved?.displayName ??
                r.displayName ??
                'Anonymous';
              const photoURL: string | null =
                resolved?.photoURL ??
                (r.photoURL ?? null);

              return (
                <View key={r.id} style={styles.reviewCard}>
                  <View style={styles.reviewUserRow}>
                    {photoURL ? (
                      <ExpoImage source={{ uri: photoURL }} style={styles.reviewAvatarImg} contentFit="cover" />
                    ) : (
                      <View style={styles.avatarPlaceholder} />
                    )}
                    <Text style={styles.reviewUser}>{displayName}</Text>
                  </View>
                  <Text style={styles.reviewText}>{r.comment}</Text>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <MessageCircle size={40} color="#CBD5E1" />
              <Text style={styles.emptyStateText}>No reviews yet. Share your thoughts!</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* --- Sticky Footer Action --- */}
      <SafeAreaView style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.primaryButton, isFav && styles.activeButton]}
          onPress={() => {
            toggleFavorite(foodId, food.name);
            router.push('/(tabs)/favorite');
          }}
        >
          {isFav ? (
            <CheckCircle2 size={20} color="#fff" />
          ) : (
            <Heart size={20} color="#fff" fill="#fff" />
          )}
          <Text style={styles.primaryButtonText}>{isFav ? 'Saved to Favorites' : 'Add to Favorites'}</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* --- Review Modal --- */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Write a review</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Share your thoughts..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              value={newComment}
              onChangeText={setNewComment}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
              <Text style={styles.submitButtonText}>Post Review</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ThemedView>
  );
}

// Helper Component for Info Rows
const InfoRow = ({
  Icon,
  label,
  value,
  onPress,
  TrailingIcon,
}: {
  Icon: LucideIcon;
  label: string;
  value: string;
  onPress?: () => void;
  TrailingIcon?: LucideIcon;
}) => {
  const Container: any = onPress ? TouchableOpacity : View;
  return (
    <Container style={styles.infoRow} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <View style={styles.iconCircle}>
        <Icon size={18} color="#059669" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, onPress && { color: '#059669' }]}>{value}</Text>
      </View>
      {TrailingIcon ? <TrailingIcon size={18} color="#059669" /> : null}
    </Container>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  // Image Section
  imageContainer: {
    width: '100%',
    height: 380,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 8,
    borderRadius: 12,
  },
  floatingHeart: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  // Content Card
  contentCard: {
    marginTop: -30,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  foodPrice: {
    fontSize: 20,
    color: '#059669',
    fontWeight: '700',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  // Info Items
  infoGrid: {
    gap: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  // Reviews
  reviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addReviewLink: {
    color: '#059669',
    fontWeight: '700',
    fontSize: 14,
  },
  reviewCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
  },
  reviewUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  avatarPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#CBD5E1',
  },
  reviewAvatarImg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#CBD5E1',
  },
  reviewUser: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  reviewText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 30,
  },
  emptyStateText: {
    marginTop: 10,
    color: '#94A3B8',
    fontSize: 14,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  primaryButton: {
    backgroundColor: '#059669',
    height: 56,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#059669',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  activeButton: {
    backgroundColor: '#1E293B',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Modal Style
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    height: 120,
    fontSize: 16,
    color: '#1E293B',
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#059669',
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});