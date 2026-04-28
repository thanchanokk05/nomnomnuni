/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#15803D';
const tintColorDark = '#22C55E';

export const Colors = {
  light: {
    text: '#0F172A',
    background: '#FFFFFF',

    tint: tintColorLight,
    icon: '#0F172A',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorLight,

    // extra UI primitives
    surface: '#FFFFFF',
    surfaceAlt: '#F8FAFC',
    border: '#E2E8F0',
    inputBg: '#F8FAFC',
    inputBorder: '#E2E8F0',
    mutedText: '#64748B',
    shadow: '#000000',
    danger: '#B91C1C',
  },
  dark: {
    text: '#F8FAFC',
    background: '#121212',

    tint: tintColorDark,
    icon: '#F8FAFC',
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintColorDark,

    // extra UI primitives
    surface: '#0B1220',
    surfaceAlt: '#111827',
    border: '#2A2A2A',
    inputBg: '#1E293B',
    inputBorder: '#334155',
    mutedText: '#94A3B8',
    shadow: '#000000',
    danger: '#EF4444',
  },
} as const;

export const ThemeExtras = {
  primary: tintColorLight,
  primaryDark: '#166534',
  mutedText: '#64748B',
  danger: '#B91C1C',
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
