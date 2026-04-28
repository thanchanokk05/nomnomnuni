import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// 1. ระบุประเภทข้อมูล (Props) ให้ชัดเจนเพื่อกัน TypeScript บ่น
interface HourDropdownProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

export default function HourDropdown({ label, value, onChange }: HourDropdownProps) {
  const [visible, setVisible] = useState(false);

  const handleTextChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length >= 3) {
      formatted = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
    }
    if (formatted.length <= 5) {
      onChange(formatted);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <MaterialIcons name="access-time" size={20} color="#94A3B8" style={styles.icon} />
        
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={handleTextChange}
          placeholder={label}
          placeholderTextColor="#94A3B8"
          keyboardType="number-pad"
          maxLength={5}
        />

        <TouchableOpacity 
          style={styles.pickerBtn} 
          onPress={() => setVisible(true)}
        >
          <MaterialIcons name="unfold-more" size={24} color="#64748B" />
        </TouchableOpacity>
      </View>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>เลือกเวลาเร็วๆ</Text>
            
            <FlatList
              data={HOURS}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={Platform.OS === 'web'}
              snapToInterval={50}
              decelerationRate="fast"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.timeItem, value === item && styles.selectedItem]}
                  onPress={() => {
                    onChange(item);
                    setVisible(false);
                  }}
                >
                  <Text style={[styles.timeText, value === item && styles.selectedText]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            
            <TouchableOpacity style={styles.closeBtn} onPress={() => setVisible(false)}>
              <Text style={styles.closeBtnText}>ยกเลิก</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    marginBottom: 10 
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FD',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 50,
    paddingHorizontal: 12,
  },
  icon: { 
    marginRight: 8 
  },
  textInput: { 
    flex: 1, 
    fontSize: 16, 
    color: '#1E293B', 
    fontWeight: '500' 
  },
  pickerBtn: { 
    paddingLeft: 10, 
    borderLeftWidth: 1, 
    borderLeftColor: '#E2E8F0' 
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: 280,
    height: 400,
    padding: 15,
    ...Platform.select({
      web: {
        // ใช้ cursor พื้นฐานสำหรับ web
        alignSelf: 'center',
      },
      default: {},
    }),
  },
  modalTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    marginBottom: 10, 
    textAlign: 'center', 
    color: '#64748B' 
  },
  timeItem: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  selectedItem: { 
    backgroundColor: '#F0FDF4' 
  },
  timeText: { 
    fontSize: 18, 
    color: '#64748B', 
    fontWeight: '500' 
  },
  selectedText: { 
    color: '#059669', 
    fontWeight: '700' 
  },
  closeBtn: { 
    marginTop: 10, 
    padding: 10, 
    alignItems: 'center' 
  },
  closeBtnText: { 
    color: '#EF4444', 
    fontWeight: '600' 
  },
});