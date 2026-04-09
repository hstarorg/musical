import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Wraps RN's useColorScheme to guarantee only 'light' | 'dark' (never null/unspecified)
 */
export function useColorScheme(): 'light' | 'dark' {
  const scheme = useRNColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}
