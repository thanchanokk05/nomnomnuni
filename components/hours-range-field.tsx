import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Slot = 'open' | 'close';

interface Props {
  open: string;
  close: string;
  onChange: (open: string, close: string) => void;
  step?: 30 | 60;
}

function buildHours(step: 30 | 60): string[] {
  const out: string[] = [];
  for (let h = 0; h < 24; h++) {
    out.push(`${String(h).padStart(2, '0')}:00`);
    if (step === 30) out.push(`${String(h).padStart(2, '0')}:30`);
  }
  return out;
}

export default function HoursRangeField({ open, close, onChange, step = 30 }: Props) {
  const [editing, setEditing] = useState<Slot | null>(null);
  const hours = useMemo(() => buildHours(step), [step]);

  const invalid =
    open && close && open >= close
      ? 'Closing time must be after opening time'
      : null;

  const select = (value: string) => {
    if (editing === 'open') onChange(value, close);
    else if (editing === 'close') onChange(open, value);
    setEditing(null);
  };

  const current = editing === 'open' ? open : editing === 'close' ? close : '';

  return (
    <View>
      <View style={styles.row}>
        <SlotButton label="Opens" value={open} onPress={() => setEditing('open')} />
        <Text style={styles.dash}>–</Text>
        <SlotButton label="Closes" value={close} onPress={() => setEditing('close')} />
      </View>

      {invalid ? <Text style={styles.error}>{invalid}</Text> : null}

      <Modal visible={editing !== null} transparent animationType="fade" onRequestClose={() => setEditing(null)}>
        <Pressable style={styles.overlay} onPress={() => setEditing(null)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.sheetTitle}>
              Select {editing === 'open' ? 'opening' : 'closing'} time
            </Text>
            <FlatList
              data={hours}
              keyExtractor={(t) => t}
              initialScrollIndex={Math.max(0, hours.indexOf(current))}
              getItemLayout={(_, i) => ({ length: 44, offset: 44 * i, index: i })}
              renderItem={({ item }) => {
                const selected = item === current;
                return (
                  <TouchableOpacity
                    style={[styles.option, selected && styles.optionSelected]}
                    onPress={() => select(item)}
                  >
                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity style={styles.cancel} onPress={() => setEditing(null)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function SlotButton({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.slot}>
      <MaterialIcons name="access-time" size={18} color="#64748B" />
      <View style={{ flex: 1 }}>
        <Text style={styles.slotLabel}>{label}</Text>
        <Text style={[styles.slotValue, !value && styles.slotPlaceholder]}>
          {value || '--:--'}
        </Text>
      </View>
      <MaterialIcons name="unfold-more" size={20} color="#94A3B8" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dash: { fontSize: 18, color: '#94A3B8', fontWeight: '700' },
  slot: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 56,
  },
  slotLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' },
  slotValue: { fontSize: 16, color: '#1E293B', fontWeight: '700', marginTop: 2 },
  slotPlaceholder: { color: '#94A3B8', fontWeight: '500' },
  error: { color: '#DC2626', fontSize: 12, fontWeight: '600', marginTop: 8 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  sheet: {
    width: '100%',
    maxWidth: 320,
    height: 420,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
  },
  sheetTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
    paddingVertical: 10,
  },
  option: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  optionSelected: { backgroundColor: '#ECFDF5' },
  optionText: { fontSize: 16, color: '#475569', fontWeight: '500' },
  optionTextSelected: { color: '#059669', fontWeight: '800' },
  cancel: { paddingVertical: 12, alignItems: 'center' },
  cancelText: { color: '#EF4444', fontWeight: '700' },
});
