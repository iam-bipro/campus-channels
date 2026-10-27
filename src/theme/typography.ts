import { colors } from './colors';

export const typography = {
  brand: {
    fontSize: 41,
    fontWeight: '800' as const,
    color: colors.ink,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: colors.ink,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    color: colors.body,
  },
  label: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.ink,
  },
} as const;
