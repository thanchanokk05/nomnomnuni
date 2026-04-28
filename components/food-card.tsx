import { useFavorites } from '@/context/favorites';
import { FOODS } from '@/data/foods';
import { Heart } from 'lucide-react-native';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Allow both mock foods (FOODS) and context menus (which may include imageUri)
type Food = (typeof FOODS)[number] & {
  imageUri?: string | null;
  openHours?: string;
  operatingDays?: string[];
};

const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_TO_INDEX: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

function parseHHmmToMinutes(hhmm: string): number | null {
  const m = hhmm.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
  return hh * 60 + mm;
}

function parseOpenHours(openHours?: string): { start: number; end: number } | null {
  if (!openHours) return null;
  const parts = openHours.split('-').map((p) => p.trim());
  if (parts.length !== 2) return null;
  const start = parseHHmmToMinutes(parts[0]);
  const end = parseHHmmToMinutes(parts[1]);
  if (start == null || end == null) return null;
  return { start, end };
}

function getDayAbbrevFromDate(d: Date): string {
  // JS getDay(): Sun=0..Sat=6
  const idx = d.getDay();
  const map = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return map[idx] ?? 'Mon';
}

function formatOperatingDays(days?: string[]): string {
  if (!days?.length) return '';
  const uniq = Array.from(new Set(days)).filter((x) => DAY_TO_INDEX[x] != null);
  uniq.sort((a, b) => DAY_TO_INDEX[a] - DAY_TO_INDEX[b]);

  // Common: Mon-Fri
  const monFri = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  if (monFri.every((d) => uniq.includes(d)) && uniq.length === 5) return 'Mon - Fri';
  if (uniq.length === 7) return 'Mon - Sun';
  if (uniq.length === 1) return uniq[0];

  const first = uniq[0];
  const last = uniq[uniq.length - 1];
  // If contiguous, show range
  const contiguous = uniq.every((d, i) => i === 0 || DAY_TO_INDEX[d] === DAY_TO_INDEX[uniq[i - 1]] + 1);
  if (contiguous && first && last) return `${first} - ${last}`;

  return uniq.join(', ');
}

export default function FoodCard({ item }: { item: Food }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(item.id);

  const imageSource = item.imageUri
    ? { uri: item.imageUri }
    : require('@/assets/images/icon.png');

  const openNow = useMemo(() => {
    if (!item.openHours || !item.operatingDays?.length) return false;

    const today = new Date();
    const day = getDayAbbrevFromDate(today);
    if (!item.operatingDays.includes(day)) return false;

    const range = parseOpenHours(item.openHours);
    if (!range) return false;

    const nowMinutes = today.getHours() * 60 + today.getMinutes();

    // Support overnight hours (e.g. 22:00 - 02:00)
    if (range.end >= range.start) {
      return nowMinutes >= range.start && nowMinutes <= range.end;
    }
    // Overnight: open if now >= start OR now <= end
    return nowMinutes >= range.start || nowMinutes <= range.end;
  }, [item.openHours, item.operatingDays]);

  const daysLabel = formatOperatingDays(item.operatingDays);

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Image source={imageSource} style={styles.image} />
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{item.name}</Text>
            {openNow ? (
              <View style={styles.openNowBadge}>
                <Text style={styles.openNowText}>Open Now</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.price}>฿{item.price}</Text>

          {item.openHours ? (
            <Text style={styles.hours}>
              Open: {item.openHours}
              {daysLabel ? ` (${daysLabel})` : ''}
            </Text>
          ) : null}
        </View>
      </View>

      <TouchableOpacity
        accessible
        accessibilityLabel={fav ? 'Remove from favorites' : 'Add to favorites'}
        accessibilityRole="button"
        accessibilityState={{ selected: fav }}
        onPress={() => toggleFavorite(item.id, item.name)}
        style={styles.heartButton}
      >
        <Heart size={24} color={fav ? '#15803D' : '#166534'} fill={fav ? '#15803D' : 'none'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    marginVertical: 6,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    elevation: 1,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#EEE',
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  name: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#052E16',
  },
  price: {
    marginTop: 6,
    color: '#355E3B',
  },
  hours: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  openNowBadge: {
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  openNowText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  heartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});
