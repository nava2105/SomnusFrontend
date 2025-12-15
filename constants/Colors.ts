/**
 * Centralized color palette for Somnus app
 * Supports light and dark themes with semantic naming
 */

const tintColorLight = '#2f95dc';
const tintColorDark = '#10B981';

export default {
    light: {
        text: '#000000',
        secondaryText: '#565656',
        background: '#CAF0F8',
        tint: tintColorLight,
        tabIconDefault: '#565656',
        tabIconSelected: tintColorLight,
        cardBackground: '#90E0EF',
    },
    dark: {
        text: '#ffffff',
        secondaryText: '#7D7D7D',
        background: '#0F172A',
        tint: tintColorDark,
        tabIconDefault: '#7D7D7D',
        tabIconSelected: tintColorDark,
        cardBackground: '#1D192B',
    },
    // Semantic colors for sleep states
    awakeColor: '#FF8D28',
    pickupColor: '#FF383C',
    asleepColor: '#34C759',
} as const;