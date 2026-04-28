import { CheckCircle2, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- Icon & Title --- */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Info size={40} color="#166534" />
          </View>
          <ThemedText type="title" style={styles.title}>About NomNomUni</ThemedText>
          <ThemedText style={styles.version}>Version 1.0.0</ThemedText>
        </View>

        {/* --- Content Description --- */}
        <View style={styles.contentCard}>
          <ThemedText style={styles.description}>
            NomNomUni is your best companion for finding affordable and delicious meals 
            around the campus. We believe that a student's budget shouldn't limit their 
            taste buds.
          </ThemedText>
          
          <View style={styles.divider} />

          {/* Features List */}
          <View style={styles.featureItem}>
            <CheckCircle2 size={20} color="#166534" />
            <ThemedText style={styles.featureText}>Smart Budget Search</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <CheckCircle2 size={20} color="#166534" />
            <ThemedText style={styles.featureText}>Real Student Reviews</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <CheckCircle2 size={20} color="#166534" />
            <ThemedText style={styles.featureText}>Community Driven Menus</ThemedText>
          </View>
        </View>

        {/* --- Action Button --- */}
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => router.back()}
        >
          <ThemedText style={styles.closeButtonText}>Understood</ThemedText>
        </TouchableOpacity>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
  },
  version: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  closeButton: {
    marginTop: 40,
    backgroundColor: '#166534',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 100,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});