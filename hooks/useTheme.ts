/**
 * Custom hook for accessing theme-aware colors and scheme
 * Provides a centralized way to handle light/dark mode
 */

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export function useTheme() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const isDark = colorScheme === 'dark';

    return {
        /** Current theme color tokens */
        colors,
        /** Whether dark mode is active */
        isDark,
        /** Current color scheme ('light' | 'dark') */
        colorScheme,
    } as const;
}