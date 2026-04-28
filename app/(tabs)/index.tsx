import { Pencil, PlusCircle, Trash2, Utensils, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import FoodCard from '@/components/food-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useMenu } from '@/context/menu';
import { auth } from '@/firebase/config';

import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

export default function HomeScreen() {
  const router = useRouter();
  const { menus, loading: menusLoading, deleteMenu, updateMenu } = useMenu();
  const [budget, setBudget] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editShopName, setEditShopName] = useState('');

  const currentUid = auth.currentUser?.uid ?? null;

  const allMenus = React.useMemo(() => {
    // Adapt context menus to the shape expected by FoodCard.
    return menus.map((m) => ({
      id: m.id,
      name: m.name,
      price: m.price,
      imageUri: m.imageUri ?? null,
      shopName: m.shopName,
      openHours: m.openHours,
      operatingDays: m.operatingDays,
      location: m.location,
      createdBy: m.createdBy,
      userId: m.userId,
    }));
  }, [menus]);

  const [filtered, setFiltered] = useState(allMenus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    // When menus update, refresh list (keeps budget filter if user already searched)
    const num = Number(budget);
    if (budget.trim() && !Number.isNaN(num)) {
      setFiltered(allMenus.filter((f) => f.price <= num));
    } else {
      setFiltered(allMenus);
    }
  }, [allMenus, budget]);

  function onFindFood() {
    Keyboard.dismiss();
    setError(null);

    if (!budget.trim()) {
      setError('Please enter your budget.');
      return;
    }

    const num = Number(budget);
    if (Number.isNaN(num)) {
      setError('Please enter a valid number.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const results = allMenus.filter((f) => f.price <= num);

      if (results.length === 0) {
        setError(`No food found under ${num} baht.`);
      }

      setFiltered(results);
      setLoading(false);
    }, 500);
  }

  const openEdit = (id: string) => {
    const m = menus.find((x) => x.id === id);
    if (!m) return;
    setEditId(id);
    setEditName(m.name);
    setEditPrice(String(m.price));
    setEditShopName(m.shopName);
    setEditOpen(true);
  };

  const submitEdit = () => {
    if (editId == null) return;
    const priceNum = Number(editPrice);
    if (!editName.trim()) return;
    if (Number.isNaN(priceNum) || priceNum < 0) return;
    updateMenu(editId, { name: editName.trim(), price: priceNum, shopName: editShopName.trim() });
    setEditOpen(false);
    setEditId(null);
  };

  const isContextMenu = (id: string | number) => typeof id === 'string' && menus.some((m) => m.id === id);
  const isOwnerMenu = (item: any) =>
    typeof item?.id === 'string' && !!currentUid && item.userId === currentUid;

  const showEmpty = !menusLoading && !loading && filtered.length === 0;

  return (
    <ThemedView style={styles.mainContainer}>
      <View style={styles.container}>
        {/* --- Header & Add Button --- */}
        <View style={styles.header}>
          <View>
            <ThemedText type="title">NomNomUni</ThemedText>
            <ThemedText type="subtitle">Find your best budget meal</ThemedText>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-food')}>
            <PlusCircle size={36} color="#166534" />
          </TouchableOpacity>
        </View>

        {/* --- Search Section --- */}
        <View style={styles.searchBox}>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Your budget (e.g. 50)"
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity onPress={onFindFood} style={styles.button}>
              <Text style={styles.buttonText}>Find</Text>
            </TouchableOpacity>
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {/* --- Food List Section --- */}
        <View style={styles.listArea}>
          <View style={styles.listHeader}>
            <Text style={styles.listLabel}>{budget ? `Results for ${budget} THB` : 'All Menus'}</Text>
            <Text style={styles.itemCount}>{filtered.length} items</Text>
          </View>

          {menusLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#166534" />
              <Text style={styles.loadingText}>Loading menus...</Text>
            </View>
          ) : loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#166534" />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : showEmpty ? (
            <View style={styles.emptyState}>
              <Utensils size={44} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No menus yet</Text>
              <Text style={styles.emptySubtitle}>Tap + to add your first menu.</Text>
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(i: any) => String(i.id)}
              renderItem={({ item }) => (
                <ReanimatedSwipeable
                  enabled={isOwnerMenu(item)}
                  overshootLeft={false}
                  overshootRight={false}
                  friction={1.5}
                  renderLeftActions={() =>
                    isOwnerMenu(item) ? (
                      <View style={styles.swipeActionsLeft}>
                        <TouchableOpacity
                          activeOpacity={0.9}
                          style={[styles.actionButton, styles.editButton]}
                          onPress={() => openEdit(String(item.id))}
                        >
                          <Pencil size={20} color="#fff" />
                          <Text style={styles.actionText}>Edit</Text>
                        </TouchableOpacity>
                      </View>
                    ) : null
                  }
                  renderRightActions={() =>
                    isOwnerMenu(item) ? (
                      <View style={styles.swipeActionsRight}>
                        <TouchableOpacity
                          activeOpacity={0.9}
                          style={[styles.actionButton, styles.deleteButton]}
                          onPress={() => typeof item.id === 'string' && deleteMenu(item.id)}
                        >
                          <Trash2 size={20} color="#fff" />
                          <Text style={styles.actionText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    ) : null
                  }
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      router.push({
                        pathname: '/food/[id]',
                        params: { id: String(item.id) },
                      })
                    }
                    style={styles.cardWrapper}
                  >
                    <View>
                      <FoodCard item={item as any} />
                      <Text style={styles.addedByText}>
                        Added by: {item.createdBy ? String(item.createdBy) : 'Anonymous'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </ReanimatedSwipeable>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}

        </View>

        <Modal visible={editOpen} transparent animationType="slide" onRequestClose={() => setEditOpen(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Menu</Text>
                <TouchableOpacity onPress={() => setEditOpen(false)}>
                  <X size={22} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalLabel}>Name</Text>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                style={styles.modalInput}
                placeholder="Menu name"
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.modalLabel}>Price</Text>
              <TextInput
                value={editPrice}
                onChangeText={setEditPrice}
                style={styles.modalInput}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.modalLabel}>Shop</Text>
              <TextInput
                value={editShopName}
                onChangeText={setEditShopName}
                style={styles.modalInput}
                placeholder="Shop name"
                placeholderTextColor="#94A3B8"
              />

              <TouchableOpacity style={styles.modalSaveButton} onPress={submitEdit}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ThemedView>
  );
 }

 const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButton: {
    padding: 5,
  },
  searchBox: {
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  button: {
    backgroundColor: '#166534',
    paddingHorizontal: 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  errorText: {
    marginTop: 8,
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  listArea: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  itemCount: {
    fontSize: 12,
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#166534',
    fontWeight: '600',
  },
  swipeActionsLeft: {
    justifyContent: 'center',
    marginBottom: 12,
    paddingLeft: 6,
  },
  swipeActionsRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 12,
    paddingRight: 6,
  },
  actionButton: {
    height: '100%',
    minHeight: 84,
    borderRadius: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#F59E0B',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalLabel: {
    marginTop: 10,
    marginBottom: 6,
    color: '#334155',
    fontWeight: '700',
  },
  modalInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalSaveButton: {
    marginTop: 16,
    backgroundColor: '#166534',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSaveText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 80,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  emptySubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  addedByText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'left',
  },
 });