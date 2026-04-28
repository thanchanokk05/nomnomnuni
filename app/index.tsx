import { useUser } from '@/context/user';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { user, loading } = useUser();

  // รอ Firebase ตรวจ auth state ก่อน redirect
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <ActivityIndicator size="large" color="#166534" />
      </View>
    );
  }

  // ถ้า login อยู่ → ไปหน้าหลัก, ถ้าไม่ → ไป login
  return user ? <Redirect href="/(tabs)" /> : <Redirect href="/login" />;
}
