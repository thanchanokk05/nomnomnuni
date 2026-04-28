import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const formatHHmm = (date: Date) => {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

export function TimePickerField({ label, value, onChange, placeholder = 'Select Time' }: Props) {
  const [show, setShow] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShow(false);
    if (event.type === 'dismissed' || !selectedDate) return;
    onChange(formatHHmm(selectedDate));
    setShow(false);
  };

  return (
    <View style={styles.wrap}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity activeOpacity={0.8} onPress={() => setShow(true)} style={styles.field}>
        <MaterialIcons name="schedule" size={20} color="#64748B" />
        <Text style={[styles.valueText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={value ? new Date(`1970-01-01T${value}:00`) : new Date()}
          mode="time"
          is24Hour
          minuteInterval={15}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FD',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  valueText: { fontSize: 16, color: '#1E293B' },
  placeholderText: { color: '#94A3B8' },
});
