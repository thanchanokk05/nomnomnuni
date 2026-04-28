import { ChevronRight, Code, Heart, Home, type LucideIcon, Send, User } from 'lucide-react-native';
import { OpaqueColorValue, type StyleProp, type ViewStyle } from 'react-native';

const MAPPING: Record<string, { Icon: LucideIcon; filled?: boolean }> = {
  'house.fill': { Icon: Home, filled: true },
  'paperplane.fill': { Icon: Send, filled: true },
  'chevron.left.forwardslash.chevron.right': { Icon: Code },
  'chevron.right': { Icon: ChevronRight },
  'heart.fill': { Icon: Heart, filled: true },
  'person.fill': { Icon: User, filled: true },
};

type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: unknown;
}) {
  const entry = MAPPING[name];
  if (!entry) return null;
  const { Icon, filled } = entry;
  return (
    <Icon
      size={size}
      color={color as string}
      fill={filled ? (color as string) : 'none'}
      style={style as any}
    />
  );
}
