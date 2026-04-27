// constants/theme.ts
import { Platform } from 'react-native';

export const Colors = {
  // Hero
  primary:        '#10B981', // emerald-500
  primaryPressed: '#059669', // emerald-600
  primarySoft:    '#D1FAE5', // emerald-100

  // Neutrals
  background:     '#FAFAF9', // stone-50
  surface:        '#FFFFFF', // white
  borderSubtle:   '#F5F5F4', // stone-100
  border:         '#E7E5E4', // stone-200

  // Text
  textPrimary:    '#1C1917', // stone-900
  textSecondary:  '#57534E', // stone-600
  textTertiary:   '#A8A29E', // stone-400
  textDisabled:   '#D6D3D1', // stone-300

  // Semantic
  destructive:    '#EF4444', // red-500
  warning:        '#F59E0B', // amber-500
} as const;

export const Typography = {
  fontFamily: Platform.OS === 'ios' ? 'SF Pro Rounded' : 'System',

  size: {
    display: 34,
    title:   22,
    bodyLg:  17,
    body:    15,
    caption: 13,
    micro:   11,
  },

  weight: {
    regular:  '400' as const,
    semibold: '600' as const,
    bold:     '700' as const,
    heavy:    '800' as const,
  },

  letterSpacing: {
    display: -0.5,
    micro:    0.5,
  },
} as const;

export const Spacing = {
  xs:    4,
  sm:    8,
  md:    12,
  lg:    16,
  xl:    20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

export const Radius = {
  sm:     8,
  md:     14,
  lg:     20,
  button: 12,
} as const;

export const Shadows = {
  card: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius:  8,
    elevation:     2,
  },
  fab: {
    shadowColor:   '#10B981',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius:  12,
    elevation:     6,
  },
};
